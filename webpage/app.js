(function(){
const __defs={};const __cache={};
function __require(n){n=n.replace(/^\.\//,"");if(__cache[n])return __cache[n].exports;const m={exports:{}};__cache[n]=m;__defs[n](m,m.exports,__require);return m.exports;}
__defs["catalog"]=function(module,exports,require){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OPTIONS = void 0;
exports.generate = generate;
// Stack catalog and bundled templates. No vscode dependency so it can be unit-tested.
// Design: GraphQL only (no REST) behind a WunderGraph Cosmo Router; no Node.js in any generated project.
const restTemplates_1 = require("./restTemplates");
const cosmoConfig_1 = require("./cosmoConfig");
exports.OPTIONS = {
    style: [
        { id: 'cosmo', label: 'GraphQL + WunderGraph Cosmo (Node.js・REST 不要)' },
        { id: 'rest', label: 'TypeScript + Node.js + REST API' },
        { id: 'custom', label: '自由入力 (言語・フレームワークを言葉で指定して Claude が開発)' },
    ],
    frontend: [
        { id: 'none', label: 'なし' },
        { id: 'html-css', label: 'HTML5 + CSS3 + JavaScript (ビルド不要)' },
        { id: 'rust-leptos', label: '【実験的】Rust + Leptos (WASM, trunk) — JS/TS を書かない', styles: ['cosmo'] },
        { id: 'html-css-ts', label: 'HTML5 + CSS3 + TypeScript (Vite)', styles: ['rest'] },
        { id: 'html-css-ts-react', label: 'HTML5 + CSS3 + TypeScript + React (Vite)', styles: ['rest'] },
    ],
    database: [
        { id: 'none', label: 'なし (メモリ上)' },
        { id: 'sqlite', label: 'SQLite' },
        { id: 'postgres', label: 'PostgreSQL' },
    ],
    gateway: [
        { id: 'cosmo', label: 'WunderGraph Cosmo Router (GraphQL Federation)', styles: ['cosmo'] },
        { id: 'rpoem', label: 'RPoem ゲートウェイ (Rust製・サブグラフ中継対応、ルート単位)', styles: ['cosmo'] },
        { id: 'none', label: 'なし (サブグラフへ直接接続)', styles: ['cosmo'] },
    ],
    backend: [
        { id: 'none', label: 'なし' },
        { id: 'python-fastapi', label: 'Python + FastAPI (GraphQL: Strawberry / REST)' },
        { id: 'rust-poem', label: 'Rust + Poem (GraphQL: async-graphql / REST: JSON)' },
        { id: 'node-ts', label: 'Node.js + Express (TypeScript)', styles: ['rest'] },
    ],
};
const SUBGRAPH_PORT = 4001;
const ROUTER_PORT = 3002;
const RPOEM_PORT = 8080;
function gatewayPort(sel) {
    if (sel.backend === 'none')
        return ROUTER_PORT;
    return sel.gateway === 'none' ? SUBGRAPH_PORT : sel.gateway === 'rpoem' ? RPOEM_PORT : ROUTER_PORT;
}
function generate(input) {
    if (input.style === 'rest')
        return (0, restTemplates_1.generateRest)(input);
    if (input.style === 'custom') {
        return { 'README.md': '# Custom project\n\n言語・フレームワーク・作りたいものを入力して「Claude で生成・改変」を押してください。\n' };
    }
    // GraphQL + Cosmo style: Node-based options do not exist here, coerce them to the closest valid one.
    const sel = {
        ...input,
        frontend: input.frontend === 'none' ? 'none' : input.frontend === 'rust-leptos' ? 'rust-leptos' : 'html-css',
        backend: input.backend === 'node-ts' ? 'none' : input.backend,
        gateway: input.gateway === 'none' ? 'none' : input.gateway === 'rpoem' ? 'rpoem' : 'cosmo',
    };
    const files = {};
    if (sel.frontend === 'rust-leptos') {
        for (const [p, c] of Object.entries(leptosFiles(gatewayPort(sel))))
            files['frontend/' + p] = c;
    }
    else if (sel.frontend === 'html-css') {
        for (const [p, c] of Object.entries(frontendFiles(gatewayPort(sel))))
            files['frontend/' + p] = c;
    }
    if (sel.backend !== 'none') {
        const cors = sel.gateway === 'none'; // the Cosmo Router handles CORS itself; direct browser access needs it on the subgraph
        const b = sel.backend === 'python-fastapi' ? fastapiFiles(sel.database, cors) : poemFiles(sel.database, cors);
        for (const [p, c] of Object.entries(b))
            files['backend/' + p] = c;
    }
    if (sel.backend !== 'none' && sel.gateway === 'cosmo') {
        files['gateway/config.json'] = cosmoConfig_1.COSMO_EXECUTION_CONFIG;
        files['gateway/schema.graphqls'] = cosmoConfig_1.COSMO_SCHEMA;
        files['gateway/graph.yaml'] = cosmoConfig_1.COSMO_GRAPH_YAML;
    }
    if (sel.backend !== 'none' && sel.gateway === 'rpoem') {
        files['gateway/rpoem.env'] = `OPEN_RUNO_SUBGRAPHS=items=http://localhost:${SUBGRAPH_PORT}/graphql
`;
        files['gateway/schema.graphqls'] = cosmoConfig_1.COSMO_SCHEMA;
    }
    const compose = composeFile(sel);
    if (compose)
        files['docker-compose.yml'] = compose;
    files['README.md'] = readme(sel);
    return files;
}
function composeFile(sel) {
    const svc = [];
    if (sel.database === 'postgres') {
        svc.push(`  db:
    image: postgres:16
    environment:
      POSTGRES_USER: app
      POSTGRES_PASSWORD: app
      POSTGRES_DB: app
    ports:
      - "5432:5432"`);
    }
    if (sel.backend !== 'none' && sel.gateway === 'cosmo') {
        svc.push(`  router:
    image: ghcr.io/wundergraph/cosmo/router:latest
    environment:
      EXECUTION_CONFIG_FILE_PATH: /app/config.json
      DEV_MODE: "true"
    volumes:
      - ./gateway/config.json:/app/config.json:ro
    ports:
      - "${ROUTER_PORT}:3002"`);
    }
    return svc.length ? `services:\n${svc.join('\n')}\n` : '';
}
const PG_URL = 'postgresql://app:app@localhost:5432/app';
function readme(sel) {
    const L = ['# Generated stack', '', `- Frontend: ${sel.frontend}`, `- Database: ${sel.database}`, `- Backend: ${sel.backend}`, `- Gateway: ${sel.gateway}`, '- API: GraphQL only (no REST, no Node.js)', '', '## Run', ''];
    if (sel.database === 'postgres')
        L.push('1. `docker compose up -d db`', '');
    if (sel.backend === 'python-fastapi') {
        L.push('Subgraph (port 4001):', '```', 'cd backend', 'python -m venv .venv', '.venv/Scripts/activate   # Windows / source .venv/bin/activate', 'pip install -r requirements.txt', `uvicorn main:app --port ${SUBGRAPH_PORT}`, '```', '');
    }
    else if (sel.backend === 'rust-poem') {
        L.push('Subgraph (port 4001):', '```', 'cd backend', 'cargo run', '```', '');
    }
    if (sel.backend !== 'none' && sel.gateway === 'cosmo') {
        L.push('Cosmo Router (port 3002) — download the `router` binary from https://github.com/wundergraph/cosmo/releases (tag `router@…`) or use the Docker image:', '```', '# binary (bash)', 'EXECUTION_CONFIG_FILE_PATH=gateway/config.json DEV_MODE=true ./router', '# Docker', 'docker compose up -d router', '```', '', '`gateway/config.json` is the pre-composed router execution config for `gateway/schema.graphqls`.', 'If you change the GraphQL schema, re-compose it once (the only step that needs Node.js, a dev-time tool):', '```', 'npx wgc router compose -i gateway/graph.yaml -o gateway/config.json', '```', '');
    }
    if (sel.backend !== 'none' && sel.gateway === 'rpoem') {
        L.push('RPoem gateway (port 8080) — https://github.com/aon-co-jp/RPoem :', '```', 'git clone https://github.com/aon-co-jp/RPoem && cd RPoem', 'OPEN_RUNO_SUBGRAPHS=items=http://localhost:4001/graphql cargo run -p open-runo-gateway   # bash', '$env:OPEN_RUNO_SUBGRAPHS="items=http://localhost:4001/graphql"; cargo run -p open-runo-gateway   # PowerShell', '```', 'The gateway discovers the root fields of the subgraph by introspection and forwards matching requests (root-field routing; queries mixing several subgraphs are rejected).', '');
    }
    if (sel.frontend === 'rust-leptos') {
        L.push('Frontend (Rust + Leptos CSR, no Node/JS): one-time `rustup target add wasm32-unknown-unknown` and `cargo install trunk --locked`, then:', '```', 'cd frontend', 'trunk serve --open', '```', '');
    }
    else if (sel.frontend === 'html-css') {
        L.push('Frontend: open `frontend/index.html` (it posts GraphQL to the gateway, or directly to the subgraph when no gateway is selected).', '');
    }
    return L.join('\n');
}
// ---------------------------------------------------------------- frontend
function frontendFiles(port) {
    return {
        'index.html': `<!doctype html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Items</title>
    <link rel="stylesheet" href="style.css" />
  </head>
  <body>
    <h1>Items</h1>
    <form id="form">
      <input id="name" placeholder="name" required />
      <button>Add</button>
    </form>
    <ul id="list"></ul>
    <script src="app.js"></script>
  </body>
</html>
`,
        'style.css': `:root { color-scheme: light dark; font-family: system-ui, sans-serif; }
body { max-width: 32rem; margin: 2rem auto; padding: 0 1rem; }
h1 { font-size: 1.4rem; }
form { display: flex; gap: .5rem; margin-bottom: 1rem; }
input { flex: 1; padding: .4rem .6rem; }
button { padding: .4rem .9rem; cursor: pointer; }
li { padding: .25rem 0; }
`,
        'app.js': `const ENDPOINT = 'http://localhost:${port}/graphql';
const list = document.getElementById('list');

async function gql(query, variables) {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  });
  const { data, errors } = await res.json();
  if (errors) throw new Error(errors.map((e) => e.message).join('; '));
  return data;
}

async function load() {
  const { items } = await gql('{ items { id name } }');
  list.innerHTML = '';
  for (const it of items) {
    const li = document.createElement('li');
    li.textContent = it.id + ': ' + it.name;
    list.appendChild(li);
  }
}

document.getElementById('form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('name');
  await gql('mutation ($name: String!) { createItem(name: $name) { id } }', { name: name.value });
  name.value = '';
  load();
});

load();
`,
    };
}
// ---------------------------------------------------------------- Rust + Leptos (CSR)
function leptosFiles(port) {
    return {
        'Cargo.toml': `[package]
name = "frontend"
version = "0.1.0"
edition = "2021"

[dependencies]
leptos = { version = "0.7", features = ["csr"] }
gloo-net = { version = "0.6", features = ["http", "json"] }
serde = { version = "1", features = ["derive"] }
serde_json = "1"
`,
        'index.html': `<!doctype html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Items</title>
    <link data-trunk rel="css" href="style.css" />
    <link data-trunk rel="rust" />
  </head>
  <body></body>
</html>
`,
        'style.css': `:root { color-scheme: light dark; font-family: system-ui, sans-serif; }
body { max-width: 32rem; margin: 2rem auto; padding: 0 1rem; }
h1 { font-size: 1.4rem; }
form { display: flex; gap: .5rem; margin-bottom: 1rem; }
input { flex: 1; padding: .4rem .6rem; }
button { padding: .4rem .9rem; cursor: pointer; }
li { padding: .25rem 0; }
.error { color: crimson; }
`,
        'src/main.rs': `use gloo_net::http::Request;
use leptos::prelude::*;
use leptos::task::spawn_local;
use serde::{de::DeserializeOwned, Deserialize};
use serde_json::json;

const ENDPOINT: &str = "http://localhost:${port}/graphql";

#[derive(Clone, Deserialize)]
struct Item {
    id: i64,
    name: String,
}

#[derive(Deserialize)]
struct ItemsData {
    items: Vec<Item>,
}

#[derive(Deserialize)]
struct GqlError {
    message: String,
}

#[derive(Deserialize)]
struct GqlResponse<T> {
    data: Option<T>,
    errors: Option<Vec<GqlError>>,
}

async fn gql<T: DeserializeOwned>(query: &str, variables: serde_json::Value) -> Result<T, String> {
    let body = json!({ "query": query, "variables": variables }).to_string();
    let resp = Request::post(ENDPOINT)
        .header("Content-Type", "application/json")
        .body(body)
        .map_err(|e| e.to_string())?
        .send()
        .await
        .map_err(|e| e.to_string())?;
    let parsed: GqlResponse<T> = resp.json().await.map_err(|e| e.to_string())?;
    if let Some(errors) = parsed.errors {
        return Err(errors.into_iter().map(|e| e.message).collect::<Vec<_>>().join("; "));
    }
    parsed.data.ok_or_else(|| "empty response".to_string())
}

fn load(set_items: WriteSignal<Vec<Item>>, set_error: WriteSignal<String>) {
    spawn_local(async move {
        match gql::<ItemsData>("{ items { id name } }", json!({})).await {
            Ok(d) => {
                set_error.set(String::new());
                set_items.set(d.items);
            }
            Err(e) => set_error.set(e),
        }
    });
}

#[component]
fn App() -> impl IntoView {
    let (items, set_items) = signal(Vec::<Item>::new());
    let (name, set_name) = signal(String::new());
    let (error, set_error) = signal(String::new());
    load(set_items, set_error);

    let on_submit = move |ev: leptos::ev::SubmitEvent| {
        ev.prevent_default();
        let n = name.get();
        spawn_local(async move {
            let r = gql::<serde_json::Value>(
                "mutation ($name: String!) { createItem(name: $name) { id } }",
                json!({ "name": n }),
            )
            .await;
            match r {
                Ok(_) => {
                    set_name.set(String::new());
                    load(set_items, set_error);
                }
                Err(e) => set_error.set(e),
            }
        });
    };

    view! {
        <h1>"Items"</h1>
        <form on:submit=on_submit>
            <input
                placeholder="name"
                required
                prop:value=move || name.get()
                on:input:target=move |ev| set_name.set(ev.target().value())
            />
            <button>"Add"</button>
        </form>
        <p class="error">{move || error.get()}</p>
        <ul>
            <For
                each=move || items.get()
                key=|it| it.id
                children=|it| view! { <li>{it.id} ": " {it.name}</li> }
            />
        </ul>
    }
}

fn main() {
    leptos::mount::mount_to_body(App);
}
`,
    };
}
// ---------------------------------------------------------------- FastAPI + Strawberry
function fastapiFiles(db, cors) {
    const reqs = ['fastapi>=0.115', 'uvicorn[standard]>=0.30', 'strawberry-graphql[fastapi]>=0.240'];
    if (db === 'postgres')
        reqs.push('psycopg[binary]>=3.2');
    let pre = '';
    let list;
    let create;
    if (db === 'none') {
        pre = `\n_items: list[Item] = []\n`;
        list = `        return _items`;
        create = `        item = Item(id=len(_items) + 1, name=name)
        _items.append(item)
        return item`;
    }
    else if (db === 'sqlite') {
        pre = `
import sqlite3
from contextlib import contextmanager

DB_PATH = "app.db"


@contextmanager
def conn():
    c = sqlite3.connect(DB_PATH)
    try:
        yield c
        c.commit()
    finally:
        c.close()


with conn() as c:
    c.execute("CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL)")
`;
        list = `        with conn() as c:
            rows = c.execute("SELECT id, name FROM items ORDER BY id").fetchall()
        return [Item(id=r[0], name=r[1]) for r in rows]`;
        create = `        with conn() as c:
            cur = c.execute("INSERT INTO items (name) VALUES (?)", (name,))
            return Item(id=cur.lastrowid, name=name)`;
    }
    else {
        pre = `
import os
from contextlib import contextmanager

import psycopg

DSN = os.environ.get("DATABASE_URL", "${PG_URL}")


@contextmanager
def conn():
    with psycopg.connect(DSN) as c:
        yield c


with conn() as c:
    c.execute("CREATE TABLE IF NOT EXISTS items (id BIGSERIAL PRIMARY KEY, name TEXT NOT NULL)")
`;
        list = `        with conn() as c:
            rows = c.execute("SELECT id, name FROM items ORDER BY id").fetchall()
        return [Item(id=r[0], name=r[1]) for r in rows]`;
        create = `        with conn() as c:
            row = c.execute("INSERT INTO items (name) VALUES (%s) RETURNING id", (name,)).fetchone()
        return Item(id=row[0], name=name)`;
    }
    const corsImport = cors ? 'from fastapi.middleware.cors import CORSMiddleware\n' : '';
    const corsUse = cors ? 'app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])\n' : '';
    const main = `import strawberry
from fastapi import FastAPI
${corsImport}from strawberry.fastapi import GraphQLRouter


@strawberry.type
class Item:
    id: int
    name: str
${pre}

@strawberry.type
class Query:
    @strawberry.field
    def items(self) -> list[Item]:
${list}


@strawberry.type
class Mutation:
    @strawberry.mutation
    def create_item(self, name: str) -> Item:
${create}


schema = strawberry.Schema(query=Query, mutation=Mutation)

# Subgraph behind the Cosmo Router (router -> http://localhost:${SUBGRAPH_PORT}/graphql)
app = FastAPI()
${corsUse}app.include_router(GraphQLRouter(schema), prefix="/graphql")
`;
    return { 'main.py': main, 'requirements.txt': reqs.join('\n') + '\n' };
}
// ---------------------------------------------------------------- Poem + async-graphql
function poemFiles(db, cors) {
    const deps = [
        'poem = "3"',
        'async-graphql = "7"',
        'async-graphql-poem = "7"',
        'tokio = { version = "1", features = ["rt-multi-thread", "macros"] }',
    ];
    if (db !== 'none')
        deps.push(`sqlx = { version = "0.8", features = ["runtime-tokio", "${db}"] }`);
    const cargo = `[package]
name = "backend"
version = "0.1.0"
edition = "2021"

[dependencies]
${deps.join('\n')}
`;
    let main;
    if (db === 'none') {
        main = `use std::sync::{Arc, Mutex};

use async_graphql::{Context, EmptySubscription, Object, Result, Schema, SimpleObject};
use async_graphql_poem::GraphQL;
use poem::{listener::TcpListener, ${cors ? 'middleware::Cors, ' : ''}post, ${cors ? 'EndpointExt, ' : ''}Route, Server};

#[derive(Clone, SimpleObject)]
struct Item {
    id: i64,
    name: String,
}

type Store = Arc<Mutex<Vec<Item>>>;

struct QueryRoot;

#[Object]
impl QueryRoot {
    async fn items(&self, ctx: &Context<'_>) -> Result<Vec<Item>> {
        Ok(ctx.data::<Store>()?.lock().unwrap().clone())
    }
}

struct MutationRoot;

#[Object]
impl MutationRoot {
    async fn create_item(&self, ctx: &Context<'_>, name: String) -> Result<Item> {
        let mut items = ctx.data::<Store>()?.lock().unwrap();
        let item = Item { id: items.len() as i64 + 1, name };
        items.push(item.clone());
        Ok(item)
    }
}

#[tokio::main]
async fn main() -> Result<(), std::io::Error> {
    let store: Store = Arc::new(Mutex::new(Vec::new()));
    let schema = Schema::build(QueryRoot, MutationRoot, EmptySubscription).data(store).finish();
    // Subgraph behind the Cosmo Router (router -> http://localhost:${SUBGRAPH_PORT}/graphql)
    let app = Route::new().at("/graphql", post(GraphQL::new(schema)))${cors ? '.with(Cors::new())' : ''};
    println!("subgraph on http://localhost:${SUBGRAPH_PORT}/graphql");
    Server::new(TcpListener::bind("0.0.0.0:${SUBGRAPH_PORT}")).run(app).await
}
`;
    }
    else {
        const sqlite = db === 'sqlite';
        const pool = sqlite ? 'sqlx::SqlitePool' : 'sqlx::PgPool';
        const url = sqlite ? 'sqlite://app.db?mode=rwc' : PG_URL;
        const id = sqlite ? 'INTEGER PRIMARY KEY AUTOINCREMENT' : 'BIGSERIAL PRIMARY KEY';
        const ph = sqlite ? '?' : '$1';
        main = `use async_graphql::{Context, EmptySubscription, Object, Result, Schema, SimpleObject};
use async_graphql_poem::GraphQL;
use poem::{listener::TcpListener, ${cors ? 'middleware::Cors, ' : ''}post, ${cors ? 'EndpointExt, ' : ''}Route, Server};

type Pool = ${pool};

#[derive(SimpleObject, sqlx::FromRow)]
struct Item {
    id: i64,
    name: String,
}

struct QueryRoot;

#[Object]
impl QueryRoot {
    async fn items(&self, ctx: &Context<'_>) -> Result<Vec<Item>> {
        let pool = ctx.data::<Pool>()?;
        Ok(sqlx::query_as::<_, Item>("SELECT id, name FROM items ORDER BY id").fetch_all(pool).await?)
    }
}

struct MutationRoot;

#[Object]
impl MutationRoot {
    async fn create_item(&self, ctx: &Context<'_>, name: String) -> Result<Item> {
        let pool = ctx.data::<Pool>()?;
        Ok(sqlx::query_as::<_, Item>("INSERT INTO items (name) VALUES (${ph}) RETURNING id, name")
            .bind(name)
            .fetch_one(pool)
            .await?)
    }
}

#[tokio::main]
async fn main() -> Result<(), std::io::Error> {
    let url = std::env::var("DATABASE_URL").unwrap_or_else(|_| "${url}".to_string());
    let pool = Pool::connect(&url).await.expect("connect to database");
    sqlx::query("CREATE TABLE IF NOT EXISTS items (id ${id}, name TEXT NOT NULL)")
        .execute(&pool)
        .await
        .expect("create table");
    let schema = Schema::build(QueryRoot, MutationRoot, EmptySubscription).data(pool).finish();
    // Subgraph behind the Cosmo Router (router -> http://localhost:${SUBGRAPH_PORT}/graphql)
    let app = Route::new().at("/graphql", post(GraphQL::new(schema)))${cors ? '.with(Cors::new())' : ''};
    println!("subgraph on http://localhost:${SUBGRAPH_PORT}/graphql");
    Server::new(TcpListener::bind("0.0.0.0:${SUBGRAPH_PORT}")).run(app).await
}
`;
    }
    return { 'Cargo.toml': cargo, 'src/main.rs': main };
}

};
__defs["restTemplates"]=function(module,exports,require){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRest = generateRest;
const PG_URL = 'postgresql://app:app@localhost:5432/app';
const API_PORT = 8000;
function generateRest(sel) {
    const files = {};
    if (sel.frontend !== 'none') {
        for (const [p, c] of Object.entries(frontendFiles(sel.frontend)))
            files['frontend/' + p] = c;
    }
    const be = sel.backend === 'python-fastapi' ? fastapiFiles(sel.database)
        : sel.backend === 'rust-poem' ? poemFiles(sel.database)
            : sel.backend === 'node-ts' ? nodeFiles(sel.database)
                : {};
    for (const [p, c] of Object.entries(be))
        files['backend/' + p] = c;
    if (sel.database === 'postgres') {
        files['docker-compose.yml'] = `services:
  db:
    image: postgres:16
    environment:
      POSTGRES_USER: app
      POSTGRES_PASSWORD: app
      POSTGRES_DB: app
    ports:
      - "5432:5432"
`;
    }
    files['README.md'] = readme(sel);
    return files;
}
function readme(sel) {
    const L = ['# Generated stack (REST)', '', `- Frontend: ${sel.frontend}`, `- Database: ${sel.database}`, `- Backend: ${sel.backend}`, '', '## Run', ''];
    if (sel.database === 'postgres')
        L.push('```', 'docker compose up -d', '```', '');
    if (sel.backend === 'python-fastapi') {
        L.push('```', 'cd backend', 'python -m venv .venv', '.venv/Scripts/activate   # Windows / source .venv/bin/activate', 'pip install -r requirements.txt', `uvicorn main:app --reload --port ${API_PORT}`, '```', '');
    }
    else if (sel.backend === 'rust-poem') {
        L.push('```', 'cd backend', 'cargo run', '```', '');
    }
    else if (sel.backend === 'node-ts') {
        L.push('```', 'cd backend', 'npm install', 'npm run dev', '```', '');
    }
    if (sel.frontend === 'html-css') {
        L.push(`Open \`frontend/index.html\`. API base is \`http://localhost:${API_PORT}\`.`, '');
    }
    else if (sel.frontend !== 'none') {
        L.push('```', 'cd frontend', 'npm install', 'npm run dev', '```', '', `Vite proxies \`/api\` to \`http://localhost:${API_PORT}\`.`, '');
    }
    return L.join('\n');
}
// ---------------------------------------------------------------- frontend
const CSS = `:root { color-scheme: light dark; font-family: system-ui, sans-serif; }
body { max-width: 32rem; margin: 2rem auto; padding: 0 1rem; }
h1 { font-size: 1.4rem; }
form { display: flex; gap: .5rem; margin-bottom: 1rem; }
input { flex: 1; padding: .4rem .6rem; }
button { padding: .4rem .9rem; cursor: pointer; }
li { padding: .25rem 0; }
`;
const FORM_BODY = `    <h1>Items</h1>
    <form id="form">
      <input id="name" placeholder="name" required />
      <button>Add</button>
    </form>
    <ul id="list"></ul>`;
function frontendFiles(kind) {
    if (kind === 'html-css') {
        return {
            'index.html': `<!doctype html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Items</title>
    <link rel="stylesheet" href="style.css" />
  </head>
  <body>
${FORM_BODY}
    <script src="app.js"></script>
  </body>
</html>
`,
            'style.css': CSS,
            'app.js': `const API = 'http://localhost:${API_PORT}/api/items';
const list = document.getElementById('list');

async function load() {
  const items = await (await fetch(API)).json();
  list.innerHTML = '';
  for (const it of items) {
    const li = document.createElement('li');
    li.textContent = it.id + ': ' + it.name;
    list.appendChild(li);
  }
}

document.getElementById('form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('name');
  await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: name.value }),
  });
  name.value = '';
  load();
});

load();
`,
        };
    }
    const react = kind === 'html-css-ts-react';
    const common = {
        'style.css': CSS,
        'tsconfig.json': `{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    ${react ? '"jsx": "react-jsx",\n    ' : ''}"strict": true,
    "skipLibCheck": true,
    "noEmit": true
  },
  "include": ["src"]
}
`,
        'vite.config.ts': react
            ? `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: { proxy: { '/api': 'http://localhost:${API_PORT}' } },
});
`
            : `import { defineConfig } from 'vite';

export default defineConfig({
  server: { proxy: { '/api': 'http://localhost:${API_PORT}' } },
});
`,
    };
    if (react) {
        return {
            ...common,
            'package.json': `{
  "name": "frontend",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": { "dev": "vite", "build": "tsc && vite build", "preview": "vite preview" },
  "dependencies": { "react": "^18.3.1", "react-dom": "^18.3.1" },
  "devDependencies": {
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.0",
    "typescript": "^5.6.0",
    "vite": "^5.4.0"
  }
}
`,
            'index.html': `<!doctype html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Items</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`,
            'src/main.tsx': `import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import '../style.css';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
`,
            'src/App.tsx': `import { FormEvent, useEffect, useState } from 'react';

interface Item {
  id: number;
  name: string;
}

export default function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [name, setName] = useState('');

  const load = async () => setItems(await (await fetch('/api/items')).json());

  useEffect(() => {
    load();
  }, []);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    await fetch('/api/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    setName('');
    load();
  };

  return (
    <>
      <h1>Items</h1>
      <form onSubmit={submit}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="name" required />
        <button>Add</button>
      </form>
      <ul>
        {items.map((it) => (
          <li key={it.id}>
            {it.id}: {it.name}
          </li>
        ))}
      </ul>
    </>
  );
}
`,
        };
    }
    return {
        ...common,
        'package.json': `{
  "name": "frontend",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": { "dev": "vite", "build": "tsc && vite build", "preview": "vite preview" },
  "devDependencies": { "typescript": "^5.6.0", "vite": "^5.4.0" }
}
`,
        'index.html': `<!doctype html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Items</title>
    <link rel="stylesheet" href="/style.css" />
  </head>
  <body>
${FORM_BODY}
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
`,
        'src/main.ts': `interface Item {
  id: number;
  name: string;
}

const list = document.getElementById('list') as HTMLUListElement;
const form = document.getElementById('form') as HTMLFormElement;
const nameInput = document.getElementById('name') as HTMLInputElement;

async function load(): Promise<void> {
  const items: Item[] = await (await fetch('/api/items')).json();
  list.innerHTML = '';
  for (const it of items) {
    const li = document.createElement('li');
    li.textContent = \`\${it.id}: \${it.name}\`;
    list.appendChild(li);
  }
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  await fetch('/api/items', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: nameInput.value }),
  });
  nameInput.value = '';
  await load();
});

load();
`,
    };
}
// ---------------------------------------------------------------- Node + Express (TypeScript)
function nodeFiles(db) {
    const deps = { express: '^4.21.0', cors: '^2.8.5' };
    const dev = {
        '@types/cors': '^2.8.17',
        '@types/express': '^4.17.21',
        '@types/node': '^22.0.0',
        tsx: '^4.19.0',
        typescript: '^5.6.0',
    };
    if (db === 'postgres') {
        deps.pg = '^8.13.0';
        dev['@types/pg'] = '^8.11.0';
    }
    const pkg = {
        name: 'backend',
        private: true,
        version: '0.1.0',
        type: 'module',
        scripts: { dev: 'tsx watch src/index.ts', build: 'tsc', start: 'node dist/index.js' },
        dependencies: deps,
        devDependencies: dev,
    };
    let pre;
    let list;
    let create;
    if (db === 'none') {
        pre = `const items: Item[] = [];`;
        list = `  res.json(items);`;
        create = `  const item = { id: items.length + 1, name: String(req.body.name) };
  items.push(item);
  res.json(item);`;
    }
    else if (db === 'sqlite') {
        pre = `import { DatabaseSync } from 'node:sqlite'; // built in since Node 22.5

const db = new DatabaseSync('app.db');
db.exec('CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL)');`;
        list = `  res.json(db.prepare('SELECT id, name FROM items ORDER BY id').all());`;
        create = `  const name = String(req.body.name);
  const info = db.prepare('INSERT INTO items (name) VALUES (?)').run(name);
  res.json({ id: Number(info.lastInsertRowid), name });`;
    }
    else {
        pre = `import pg from 'pg';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL ?? '${PG_URL}' });
await pool.query('CREATE TABLE IF NOT EXISTS items (id BIGSERIAL PRIMARY KEY, name TEXT NOT NULL)');`;
        list = `  const { rows } = await pool.query('SELECT id::int AS id, name FROM items ORDER BY id');
  res.json(rows);`;
        create = `  const name = String(req.body.name);
  const { rows } = await pool.query('INSERT INTO items (name) VALUES ($1) RETURNING id::int AS id', [name]);
  res.json({ id: rows[0].id, name });`;
    }
    const isPg = db === 'postgres';
    const wrap = (body) => body;
    const index = `import cors from 'cors';
import express from 'express';
${db === 'none' ? '' : pre + '\n'}
interface Item {
  id: number;
  name: string;
}
${db === 'none' ? '\n' + pre + '\n' : ''}
const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/items', ${isPg ? 'async ' : ''}(_req, res) => {
${wrap(list)}
});

app.post('/api/items', ${isPg ? 'async ' : ''}(req, res) => {
${wrap(create)}
});

app.listen(${API_PORT}, () => console.log('listening on http://localhost:${API_PORT}'));
`;
    return {
        'package.json': JSON.stringify(pkg, null, 2) + '\n',
        'tsconfig.json': `{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src"]
}
`,
        'src/index.ts': index,
    };
}
// ---------------------------------------------------------------- FastAPI (REST)
function fastapiFiles(db) {
    const reqs = ['fastapi>=0.115', 'uvicorn[standard]>=0.30'];
    if (db === 'postgres')
        reqs.push('psycopg[binary]>=3.2');
    const head = `from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])


class NewItem(BaseModel):
    name: str


class Item(NewItem):
    id: int

`;
    let body;
    if (db === 'none') {
        body = `
_items: list[Item] = []


@app.get("/api/items", response_model=list[Item])
def list_items():
    return _items


@app.post("/api/items", response_model=Item)
def create_item(new: NewItem):
    item = Item(id=len(_items) + 1, name=new.name)
    _items.append(item)
    return item
`;
    }
    else if (db === 'sqlite') {
        body = `
import sqlite3
from contextlib import contextmanager

DB_PATH = "app.db"


@contextmanager
def conn():
    c = sqlite3.connect(DB_PATH)
    try:
        yield c
        c.commit()
    finally:
        c.close()


with conn() as c:
    c.execute("CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL)")


@app.get("/api/items", response_model=list[Item])
def list_items():
    with conn() as c:
        rows = c.execute("SELECT id, name FROM items ORDER BY id").fetchall()
    return [Item(id=r[0], name=r[1]) for r in rows]


@app.post("/api/items", response_model=Item)
def create_item(new: NewItem):
    with conn() as c:
        cur = c.execute("INSERT INTO items (name) VALUES (?)", (new.name,))
        return Item(id=cur.lastrowid, name=new.name)
`;
    }
    else {
        body = `
import os
from contextlib import contextmanager

import psycopg

DSN = os.environ.get("DATABASE_URL", "${PG_URL}")


@contextmanager
def conn():
    with psycopg.connect(DSN) as c:
        yield c


with conn() as c:
    c.execute("CREATE TABLE IF NOT EXISTS items (id BIGSERIAL PRIMARY KEY, name TEXT NOT NULL)")


@app.get("/api/items", response_model=list[Item])
def list_items():
    with conn() as c:
        rows = c.execute("SELECT id, name FROM items ORDER BY id").fetchall()
    return [Item(id=r[0], name=r[1]) for r in rows]


@app.post("/api/items", response_model=Item)
def create_item(new: NewItem):
    with conn() as c:
        row = c.execute("INSERT INTO items (name) VALUES (%s) RETURNING id", (new.name,)).fetchone()
    return Item(id=row[0], name=new.name)
`;
    }
    return { 'main.py': head + body, 'requirements.txt': reqs.join('\n') + '\n' };
}
// ---------------------------------------------------------------- Poem (REST)
function poemFiles(db) {
    const deps = [
        'poem = "3"',
        'tokio = { version = "1", features = ["rt-multi-thread", "macros"] }',
        'serde = { version = "1", features = ["derive"] }',
    ];
    if (db !== 'none')
        deps.push(`sqlx = { version = "0.8", features = ["runtime-tokio", "${db}"] }`);
    const cargo = `[package]
name = "backend"
version = "0.1.0"
edition = "2021"

[dependencies]
${deps.join('\n')}
`;
    let main;
    if (db === 'none') {
        main = `use std::sync::{Arc, Mutex};

use poem::{
    get, handler, listener::TcpListener, middleware::Cors, web::{Data, Json}, EndpointExt, Route, Server,
};
use serde::{Deserialize, Serialize};

#[derive(Clone, Serialize)]
struct Item {
    id: i64,
    name: String,
}

#[derive(Deserialize)]
struct NewItem {
    name: String,
}

type Store = Arc<Mutex<Vec<Item>>>;

#[handler]
fn list(Data(store): Data<&Store>) -> Json<Vec<Item>> {
    Json(store.lock().unwrap().clone())
}

#[handler]
fn create(Data(store): Data<&Store>, Json(new): Json<NewItem>) -> Json<Item> {
    let mut items = store.lock().unwrap();
    let item = Item { id: items.len() as i64 + 1, name: new.name };
    items.push(item.clone());
    Json(item)
}

#[tokio::main]
async fn main() -> Result<(), std::io::Error> {
    let store: Store = Arc::new(Mutex::new(Vec::new()));
    let app = Route::new().at("/api/items", get(list).post(create)).data(store).with(Cors::new());
    println!("listening on http://localhost:${API_PORT}");
    Server::new(TcpListener::bind("0.0.0.0:${API_PORT}")).run(app).await
}
`;
    }
    else {
        const sqlite = db === 'sqlite';
        const pool = sqlite ? 'sqlx::SqlitePool' : 'sqlx::PgPool';
        const url = sqlite ? 'sqlite://app.db?mode=rwc' : PG_URL;
        const id = sqlite ? 'INTEGER PRIMARY KEY AUTOINCREMENT' : 'BIGSERIAL PRIMARY KEY';
        const ph = sqlite ? '?' : '$1';
        main = `use poem::{
    error::InternalServerError, get, handler, listener::TcpListener, middleware::Cors, web::{Data, Json}, EndpointExt,
    Result, Route, Server,
};
use serde::{Deserialize, Serialize};

type Pool = ${pool};

#[derive(Serialize, sqlx::FromRow)]
struct Item {
    id: i64,
    name: String,
}

#[derive(Deserialize)]
struct NewItem {
    name: String,
}

#[handler]
async fn list(Data(pool): Data<&Pool>) -> Result<Json<Vec<Item>>> {
    let items = sqlx::query_as::<_, Item>("SELECT id, name FROM items ORDER BY id")
        .fetch_all(pool)
        .await
        .map_err(InternalServerError)?;
    Ok(Json(items))
}

#[handler]
async fn create(Data(pool): Data<&Pool>, Json(new): Json<NewItem>) -> Result<Json<Item>> {
    let item = sqlx::query_as::<_, Item>("INSERT INTO items (name) VALUES (${ph}) RETURNING id, name")
        .bind(new.name)
        .fetch_one(pool)
        .await
        .map_err(InternalServerError)?;
    Ok(Json(item))
}

#[tokio::main]
async fn main() -> Result<(), std::io::Error> {
    let url = std::env::var("DATABASE_URL").unwrap_or_else(|_| "${url}".to_string());
    let pool = Pool::connect(&url).await.expect("connect to database");
    sqlx::query("CREATE TABLE IF NOT EXISTS items (id ${id}, name TEXT NOT NULL)")
        .execute(&pool)
        .await
        .expect("create table");
    let app = Route::new().at("/api/items", get(list).post(create)).data(pool).with(Cors::new());
    println!("listening on http://localhost:${API_PORT}");
    Server::new(TcpListener::bind("0.0.0.0:${API_PORT}")).run(app).await
}
`;
    }
    return { 'Cargo.toml': cargo, 'src/main.rs': main };
}

};
__defs["cosmoConfig"]=function(module,exports,require){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.COSMO_EXECUTION_CONFIG = exports.COSMO_GRAPH_YAML = exports.COSMO_SCHEMA = void 0;
// Generated once with `wgc router compose` from COSMO_SCHEMA + COSMO_GRAPH_YAML (routing_url http://localhost:4001/graphql).
// Bundled so that generated projects need no Node.js at all. Regenerate only if COSMO_SCHEMA changes.
exports.COSMO_SCHEMA = "type Item {\n  id: Int!\n  name: String!\n}\n\ntype Query {\n  items: [Item!]!\n}\n\ntype Mutation {\n  createItem(name: String!): Item!\n}\n";
exports.COSMO_GRAPH_YAML = "version: 1\nsubgraphs:\n  - name: items\n    routing_url: http://localhost:4001/graphql\n    schema:\n      file: ./schema.graphqls\n";
exports.COSMO_EXECUTION_CONFIG = "{\"engineConfig\":{\"defaultFlushInterval\":\"500\",\"datasourceConfigurations\":[{\"kind\":\"GRAPHQL\",\"rootNodes\":[{\"typeName\":\"Query\",\"fieldNames\":[\"items\"]},{\"typeName\":\"Mutation\",\"fieldNames\":[\"createItem\"]}],\"childNodes\":[{\"typeName\":\"Item\",\"fieldNames\":[\"id\",\"name\"]}],\"overrideFieldPathFromAlias\":true,\"customGraphql\":{\"fetch\":{\"url\":{\"staticVariableContent\":\"http://localhost:4001/graphql\"},\"method\":\"POST\",\"body\":{},\"baseUrl\":{},\"path\":{}},\"subscription\":{\"enabled\":true,\"url\":{\"staticVariableContent\":\"http://localhost:4001/graphql\"},\"protocol\":\"GRAPHQL_SUBSCRIPTION_PROTOCOL_WS\",\"websocketSubprotocol\":\"GRAPHQL_WEBSOCKET_SUBPROTOCOL_AUTO\"},\"federation\":{\"enabled\":true,\"serviceSdl\":\"type Item {\\n  id: Int!\\n  name: String!\\n}\\n\\ntype Query {\\n  items: [Item!]!\\n}\\n\\ntype Mutation {\\n  createItem(name: String!): Item!\\n}\\n\"},\"upstreamSchema\":{\"key\":\"134b697cc2c21304d030f763df634ba06896eae2\"}},\"requestTimeoutSeconds\":\"10\",\"id\":\"0\"}],\"fieldConfigurations\":[{\"typeName\":\"Mutation\",\"fieldName\":\"createItem\",\"argumentsConfiguration\":[{\"name\":\"name\",\"sourceType\":\"FIELD_ARGUMENT\"}]}],\"graphqlSchema\":\"schema {\\n  query: Query\\n  mutation: Mutation\\n}\\n\\ntype Item {\\n  id: Int!\\n  name: String!\\n}\\n\\ntype Query {\\n  items: [Item!]!\\n}\\n\\ntype Mutation {\\n  createItem(name: String!): Item!\\n}\",\"stringStorage\":{\"134b697cc2c21304d030f763df634ba06896eae2\":\"schema {\\n  query: Query\\n  mutation: Mutation\\n}\\n\\ntype Item {\\n  id: Int!\\n  name: String!\\n}\\n\\ntype Mutation {\\n  createItem(name: String!): Item!\\n}\\n\\ntype Query {\\n  items: [Item!]!\\n}\"}},\"version\":\"00000000-0000-0000-0000-000000000000\",\"subgraphs\":[{\"id\":\"0\",\"name\":\"items\",\"routingUrl\":\"http://localhost:4001/graphql\"}],\"featureFlagConfigs\":{},\"compatibilityVersion\":\"1:0.65.2\"}";

};
__defs["notices"]=function(module,exports,require){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NOTICES = void 0;
exports.pickLang = pickLang;
exports.noticeHtml = noticeHtml;
exports.noticeMarkdown = noticeMarkdown;
exports.NOTICES = {
    en: {
        title: 'Notices',
        items: [
            'Generated code is a starting point. Review, test and secure it before any production use; no warranty is given.',
            '"Generate with Claude" sends the selected stack, the current files and your request to the Anthropic API. Do not put secrets or personal data in the files or the request.',
            'Your Anthropic API key is stored in VS Code SecretStorage on this machine only. Never commit keys, passwords or private SSH keys to a repository.',
            'API usage is billed to your own Anthropic account.',
            'Experimental: Rust + Leptos frontend, RPoem gateway (root-field routing only; queries mixing several subgraphs are rejected). Cosmo Router config is pre-composed; re-run "wgc router compose" after changing the GraphQL schema.',
            'Files are written only to the folder you choose; existing files with the same name are overwritten.',
            'VPS / rental-server automatic read-write keys (SSH private and public keys): save them on a local drive as <file name>.txt (outside any repository) and tell Claude Code to read that file. Because Claude reads it, its contents are sent to the Anthropic API — use a dedicated, least-privilege key you can revoke, and never paste key contents into chat or commit the file.',
            'Creating a GitHub token (for pushing from Claude Code): GitHub → profile icon → Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token (https://github.com/settings/personal-access-tokens/new). Set a short expiration, choose "Only select repositories" and pick just the repository, then under Repository permissions set Contents = Read and write (Metadata stays Read-only). Click Generate, copy the token (shown only once), save it as <file name>.txt outside the repository, and never paste it into chat. Revoke it on the same page when no longer needed.',
            'Anthropic API key (needed for "Generate with Claude"): create it in the Claude Console (https://console.anthropic.com/settings/keys → Create Key), copy it once, and save it as <file name>.txt on a local drive, outside any repository, with the key alone on the first line. Then run "Open VSC Claude: Load Anthropic API Key from a .txt file" (or the "load key from txt" button) and pick that file: the key moves into VS Code SecretStorage and the file is not modified. Delete or revoke the key when no longer needed.',
        ],
    },
    ja: {
        title: '注意書き',
        items: [
            '生成されるコードは出発点です。本番利用の前に、必ず確認・テスト・セキュリティ対策を行ってください。動作の保証はありません。',
            '「Claude で生成・改変」は、選択したスタック・現在のファイル・要望を Anthropic API へ送信します。秘密情報や個人情報をファイルや要望に含めないでください。',
            'Anthropic API キーは、この PC の VS Code SecretStorage にのみ保存されます。キー・パスワード・SSH 秘密鍵をリポジトリへコミットしないでください。',
            'API の利用料金は、ご自身の Anthropic アカウントに請求されます。',
            '実験的機能: Rust + Leptos フロント、RPoem ゲートウェイ(ルートフィールド単位の振り分けのみ。複数サブグラフにまたがるクエリは拒否)。Cosmo Router の設定は事前生成済みです。GraphQL スキーマを変更したら「wgc router compose」を再実行してください。',
            'ファイルは選択したフォルダにのみ書き込まれ、同名の既存ファイルは上書きされます。',
            'VPS(レンタルサーバー)の自動読み書き用の秘密鍵・公開鍵は、ローカルドライブに「ファイル名.txt」として保存し(リポジトリの外に置く)、CLAUDE にそのファイルを読ませてください。CLAUDE が読むと内容が Anthropic API に送信されるため、取り消し可能で権限を最小にした専用の鍵を使い、鍵の内容をチャットに貼ったりファイルをコミットしたりしないでください。',
            'GitHub トークンの作り方(Claude Code から push する場合): GitHub → 右上のアイコン → Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token(https://github.com/settings/personal-access-tokens/new)。有効期限は短めにし、「Only select repositories」で対象リポジトリだけを選び、Repository permissions の Contents を「Read and write」にします(Metadata は Read-only のまま)。Generate token を押し、表示されたトークン(一度しか表示されません)をコピーして、リポジトリの外に「ファイル名.txt」として保存してください。チャットには貼らないでください。不要になったら同じ画面で失効させます。',
            'Anthropic API キー(「Claude で生成・改変」に必要): Claude Console(https://console.anthropic.com/settings/keys → Create Key)で作成し、一度だけ表示されるキーをコピーして、リポジトリの外のローカルドライブに「ファイル名.txt」として保存します(1行目にキーだけを書く)。その後「Open VSC Claude: Load Anthropic API Key from a .txt file」(または画面の「キーを txt から読込」ボタン)でそのファイルを選ぶと、キーが VS Code の SecretStorage に移り、ファイル自体は変更されません。不要になったらファイルを削除し、キーを失効させてください。',
        ],
    },
    'zh-cn': {
        title: '注意事项',
        items: [
            '生成的代码仅作为起点。用于生产环境前，请务必审查、测试并做好安全加固；不提供任何担保。',
            '“使用 Claude 生成/修改”会把所选技术栈、当前文件和您的需求发送到 Anthropic API。请勿在文件或需求中包含机密信息或个人数据。',
            'Anthropic API 密钥仅保存在本机的 VS Code SecretStorage 中。切勿将密钥、密码或 SSH 私钥提交到代码仓库。',
            'API 使用费用由您自己的 Anthropic 账户承担。',
            '实验性功能：Rust + Leptos 前端、RPoem 网关（仅按根字段路由，跨多个子图的查询会被拒绝）。Cosmo Router 配置已预先生成；修改 GraphQL 模式后请重新运行“wgc router compose”。',
            '文件只会写入您选择的文件夹，同名的现有文件将被覆盖。',
            'VPS（租用服务器）自动读写所用的 SSH 私钥和公钥：请以“文件名.txt”保存到本地磁盘（放在任何代码仓库之外），并让 Claude 读取该文件。由于 Claude 会读取其内容，内容将发送至 Anthropic API——请使用可随时吊销、权限最小的专用密钥，切勿把密钥内容粘贴到聊天中或提交该文件。',
            '创建 GitHub 令牌（用于从 Claude Code 推送）：GitHub → 右上角头像 → Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token（https://github.com/settings/personal-access-tokens/new）。设置较短的有效期，选择“Only select repositories”并仅选中目标仓库，在 Repository permissions 中将 Contents 设为“Read and write”（Metadata 保持只读）。点击 Generate token，复制令牌（仅显示一次），以“文件名.txt”保存到仓库之外，切勿粘贴到聊天中。不再需要时在同一页面吊销。',
            'Anthropic API 密钥（“使用 Claude 生成/修改”所需）：在 Claude Console（https://console.anthropic.com/settings/keys → Create Key）创建，复制仅显示一次的密钥，以“文件名.txt”保存到仓库之外的本地磁盘（第一行只写密钥）。然后运行“Open VSC Claude: Load Anthropic API Key from a .txt file”（或界面中的“从 txt 读取密钥”按钮）并选择该文件：密钥会存入 VS Code SecretStorage，文件本身不会被修改。不再需要时请删除文件并吊销密钥。',
        ],
    },
    'zh-tw': {
        title: '注意事項',
        items: [
            '產生的程式碼僅作為起點。用於正式環境前，請務必審查、測試並做好安全強化；不提供任何保證。',
            '「使用 Claude 產生/修改」會將所選技術堆疊、目前檔案與您的需求傳送至 Anthropic API。請勿在檔案或需求中包含機密資訊或個人資料。',
            'Anthropic API 金鑰僅儲存於本機的 VS Code SecretStorage。切勿將金鑰、密碼或 SSH 私密金鑰提交至程式碼儲存庫。',
            'API 使用費用由您自己的 Anthropic 帳戶負擔。',
            '實驗性功能：Rust + Leptos 前端、RPoem 閘道（僅依根欄位路由，跨多個子圖的查詢會被拒絕）。Cosmo Router 設定已預先產生；變更 GraphQL 結構描述後請重新執行「wgc router compose」。',
            '檔案只會寫入您選擇的資料夾，同名的既有檔案將被覆寫。',
            'VPS（租用伺服器）自動讀寫所用的 SSH 私密金鑰與公開金鑰：請以「檔名.txt」儲存於本機磁碟（置於任何程式碼儲存庫之外），並讓 Claude 讀取該檔案。由於 Claude 會讀取其內容，內容將傳送至 Anthropic API——請使用可隨時撤銷、權限最小的專用金鑰，切勿將金鑰內容貼到聊天中或提交該檔案。',
            '建立 GitHub 權杖（用於從 Claude Code 推送）：GitHub → 右上角大頭貼 → Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token（https://github.com/settings/personal-access-tokens/new）。設定較短的有效期限，選擇「Only select repositories」並僅選取目標儲存庫，在 Repository permissions 將 Contents 設為「Read and write」（Metadata 維持唯讀）。按下 Generate token，複製權杖（僅顯示一次），以「檔名.txt」儲存於儲存庫之外，切勿貼到聊天中。不再需要時於同一頁面撤銷。',
            'Anthropic API 金鑰（「使用 Claude 產生/修改」所需）：於 Claude Console（https://console.anthropic.com/settings/keys → Create Key）建立，複製僅顯示一次的金鑰，以「檔名.txt」儲存於儲存庫之外的本機磁碟（第一行只寫金鑰）。接著執行「Open VSC Claude: Load Anthropic API Key from a .txt file」（或介面中的「從 txt 讀取金鑰」按鈕）並選擇該檔案：金鑰會存入 VS Code SecretStorage，檔案本身不會被修改。不再需要時請刪除檔案並撤銷金鑰。',
        ],
    },
    ko: {
        title: '주의 사항',
        items: [
            '생성된 코드는 출발점일 뿐입니다. 운영 환경에 사용하기 전에 반드시 검토, 테스트 및 보안 조치를 하십시오. 어떠한 보증도 제공되지 않습니다.',
            '"Claude로 생성/수정"은 선택한 스택, 현재 파일, 요청 내용을 Anthropic API로 전송합니다. 파일이나 요청에 비밀 정보나 개인 정보를 포함하지 마십시오.',
            'Anthropic API 키는 이 PC의 VS Code SecretStorage에만 저장됩니다. 키, 비밀번호, SSH 개인 키를 저장소에 커밋하지 마십시오.',
            'API 사용 요금은 본인의 Anthropic 계정으로 청구됩니다.',
            '실험적 기능: Rust + Leptos 프런트엔드, RPoem 게이트웨이(루트 필드 단위 라우팅만 지원하며 여러 서브그래프에 걸친 쿼리는 거부됨). Cosmo Router 설정은 사전 생성되어 있으며, GraphQL 스키마를 변경하면 "wgc router compose"를 다시 실행하십시오.',
            '파일은 선택한 폴더에만 기록되며, 같은 이름의 기존 파일은 덮어씁니다.',
            'VPS(임대 서버) 자동 읽기/쓰기용 SSH 개인 키와 공개 키는 로컬 드라이브에 "파일이름.txt"로 저장하고(저장소 밖에 두기) Claude가 해당 파일을 읽도록 하십시오. Claude가 읽으면 내용이 Anthropic API로 전송되므로, 폐기 가능하고 권한이 최소인 전용 키를 사용하고 키 내용을 채팅에 붙여넣거나 파일을 커밋하지 마십시오.',
            'GitHub 토큰 만들기(Claude Code에서 push할 때): GitHub → 오른쪽 위 프로필 아이콘 → Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token(https://github.com/settings/personal-access-tokens/new). 만료 기간을 짧게 설정하고 "Only select repositories"에서 대상 저장소만 선택한 뒤, Repository permissions의 Contents를 "Read and write"로 설정합니다(Metadata는 읽기 전용 유지). Generate token을 누르고 표시된 토큰(한 번만 표시됨)을 복사해 저장소 밖에 "파일이름.txt"로 저장하십시오. 채팅에 붙여넣지 마십시오. 더 이상 필요 없으면 같은 화면에서 폐기하십시오.',
            'Anthropic API 키("Claude로 생성/수정"에 필요): Claude Console(https://console.anthropic.com/settings/keys → Create Key)에서 만들고, 한 번만 표시되는 키를 복사해 저장소 밖의 로컬 드라이브에 "파일이름.txt"로 저장하십시오(첫 줄에 키만 작성). 그런 다음 "Open VSC Claude: Load Anthropic API Key from a .txt file"(또는 화면의 "txt에서 키 불러오기" 버튼)을 실행해 그 파일을 선택하면 키가 VS Code SecretStorage로 옮겨지며 파일 자체는 변경되지 않습니다. 필요 없어지면 파일을 삭제하고 키를 폐기하십시오.',
        ],
    },
};
function pickLang(vscodeLanguage) {
    const l = vscodeLanguage.toLowerCase();
    if (l.startsWith('ja'))
        return 'ja';
    if (l.startsWith('ko'))
        return 'ko';
    if (l === 'zh-tw' || l === 'zh-hk' || l.startsWith('zh-hant'))
        return 'zh-tw';
    if (l.startsWith('zh'))
        return 'zh-cn';
    return 'en';
}
function noticeHtml(lang) {
    const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
    const n = exports.NOTICES[lang];
    return `<details id="notice"><summary>${esc(n.title)}</summary><ul>${n.items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul></details>`;
}
function noticeMarkdown() {
    const names = { en: 'English', ja: '日本語', 'zh-cn': '简体中文', 'zh-tw': '繁體中文（台灣）', ko: '한국어' };
    return Object.keys(exports.NOTICES)
        .map((l) => `<details><summary>${names[l]} — ${exports.NOTICES[l].title}</summary>\n\n${exports.NOTICES[l].items.map((i) => `- ${i}`).join('\n')}\n\n</details>`)
        .join('\n\n');
}

};
__defs["i18n"]=function(module,exports,require){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UI = void 0;
exports.UI = {
    ja: {
        style: '方式', frontend: 'フロント', database: 'DB', gateway: 'ゲートウェイ', backend: 'バックエンド',
        save: 'フォルダに保存', setKey: 'API キー入力', loadKey: 'キーを txt から読込', generate: 'Claude で生成・改変', reset: 'テンプレートに戻す',
        stackPh: '使う言語・フレームワーク・作りたいものを言葉で入力 (例: Go + Gin + PostgreSQL で ToDo API。Dockerfile も)',
        reqPh: 'Claude への要望 (例: ユーザー認証を追加 / Item に price を追加)  Ctrl+Enter で実行',
        files: 'ファイル', copy: 'コピー', copied: 'コピーしました', openEditor: 'エディタで開く',
        keyOk: 'API キー: 設定済み', keyMissing: 'API キー: 未設定', running: 'Claude に問い合わせ中…', updated: '個のファイルを更新しました (* 付き)。',
        hint: '選択を変えると即プレビューされます。* は Claude が変更したファイルです。',
        overwrite: '個の既存ファイルを上書きします。よろしいですか?', overwriteBtn: '上書き保存', saved: 'ファイルを保存しました。', openFolder: 'フォルダを開く',
        keyBad: 'API キーを読み取れませんでした(1行目にキーだけを書いてください)。', keyLoaded: 'API キーを読み込みました(SecretStorage に保存、ファイルは変更していません)。', noKey: 'API キーが未設定です。',
        demoBanner: 'DEMO: ブラウザ上でテンプレートのプレビューと zip 保存が試せます。Claude 生成は VS Code 拡張で使えます。', demoGen: 'デモでは Claude 生成は使えません。VS Code 拡張をインストールして API キーを設定してください。', demoKey: 'デモでは API キーは使えません(VS Code 拡張で設定します)。', demoSaved: 'zip をダウンロードしました。',
        updAvail: "更新があります: v{v}(現在 v{c})。", updInstall: "今すぐ更新", updNotes: "リリースノート", updLater: "後で", updDone: "更新しました。再読み込みで反映されます。", updReload: "再読み込み", updNone: "最新です(v{v})。", updFail: "更新の確認に失敗しました: {e}", updNoChecksum: "チェックサムが無いため自動インストールできません。リリースページから手動で入れてください。", updBadChecksum: "チェックサムが一致しません。インストールを中止しました。",
    },
    en: {
        style: 'Style', frontend: 'Frontend', database: 'Database', gateway: 'Gateway', backend: 'Backend',
        save: 'Save to folder', setKey: 'Enter API key', loadKey: 'Load key from .txt', generate: 'Generate / refine with Claude', reset: 'Reset to template',
        stackPh: 'Describe the language, framework and what to build (e.g. Go + Gin + PostgreSQL ToDo API with a Dockerfile)',
        reqPh: 'Request for Claude (e.g. add user auth / add a price field to Item)  Ctrl+Enter to run',
        files: 'Files', copy: 'Copy', copied: 'Copied', openEditor: 'Open in editor',
        keyOk: 'API key: set', keyMissing: 'API key: not set', running: 'Asking Claude…', updated: ' file(s) updated (marked with *).',
        hint: 'Changing a selection previews instantly. * marks files changed by Claude.',
        overwrite: ' existing file(s) will be overwritten. Continue?', overwriteBtn: 'Overwrite', saved: 'Files saved.', openFolder: 'Open folder',
        keyBad: 'Could not read an API key (put only the key on the first line).', keyLoaded: 'API key loaded (stored in SecretStorage; the file was not modified).', noKey: 'API key is not set.',
        demoBanner: 'DEMO: preview templates and download a zip right in your browser. Claude generation works in the VS Code extension.', demoGen: 'Claude generation is not available in the demo. Install the VS Code extension and set your API key.', demoKey: 'API keys are not used in the demo (set them in the VS Code extension).', demoSaved: 'zip downloaded.',
        updAvail: "Update available: v{v} (current v{c}).", updInstall: "Update now", updNotes: "Release notes", updLater: "Later", updDone: "Updated. Reload to apply.", updReload: "Reload", updNone: "You are up to date (v{v}).", updFail: "Update check failed: {e}", updNoChecksum: "No checksum is published, so it cannot be installed automatically. Install it manually from the release page.", updBadChecksum: "Checksum mismatch. Installation aborted.",
    },
    'zh-cn': {
        style: '方式', frontend: '前端', database: '数据库', gateway: '网关', backend: '后端',
        save: '保存到文件夹', setKey: '输入 API 密钥', loadKey: '从 txt 读取密钥', generate: '使用 Claude 生成/修改', reset: '恢复模板',
        stackPh: '用文字描述语言、框架和要做的东西（例：Go + Gin + PostgreSQL 的待办 API，并附 Dockerfile）',
        reqPh: '给 Claude 的需求（例：添加用户认证 / 给 Item 添加 price）  Ctrl+Enter 执行',
        files: '文件', copy: '复制', copied: '已复制', openEditor: '在编辑器中打开',
        keyOk: 'API 密钥：已设置', keyMissing: 'API 密钥：未设置', running: '正在询问 Claude…', updated: ' 个文件已更新（带 * 标记）。',
        hint: '更改选项会立即预览。带 * 的是 Claude 修改过的文件。',
        overwrite: ' 个现有文件将被覆盖，是否继续？', overwriteBtn: '覆盖保存', saved: '文件已保存。', openFolder: '打开文件夹',
        keyBad: '无法读取 API 密钥（第一行只写密钥）。', keyLoaded: '已读取 API 密钥（存入 SecretStorage，文件未被修改）。', noKey: '尚未设置 API 密钥。',
        demoBanner: '演示：可在浏览器中预览模板并下载 zip。Claude 生成功能请在 VS Code 扩展中使用。', demoGen: '演示中无法使用 Claude 生成。请安装 VS Code 扩展并设置 API 密钥。', demoKey: '演示中不使用 API 密钥（请在 VS Code 扩展中设置）。', demoSaved: '已下载 zip。',
        updAvail: "有可用更新：v{v}（当前 v{c}）。", updInstall: "立即更新", updNotes: "发行说明", updLater: "稍后", updDone: "已更新，重新加载后生效。", updReload: "重新加载", updNone: "已是最新版本（v{v}）。", updFail: "检查更新失败：{e}", updNoChecksum: "未提供校验和，无法自动安装。请从发布页面手动安装。", updBadChecksum: "校验和不匹配，已中止安装。",
    },
    'zh-tw': {
        style: '方式', frontend: '前端', database: '資料庫', gateway: '閘道', backend: '後端',
        save: '儲存到資料夾', setKey: '輸入 API 金鑰', loadKey: '從 txt 讀取金鑰', generate: '使用 Claude 產生/修改', reset: '還原範本',
        stackPh: '用文字描述語言、框架與要做的東西（例：Go + Gin + PostgreSQL 的待辦 API，並附 Dockerfile）',
        reqPh: '給 Claude 的需求（例：新增使用者驗證 / 為 Item 新增 price）  Ctrl+Enter 執行',
        files: '檔案', copy: '複製', copied: '已複製', openEditor: '在編輯器中開啟',
        keyOk: 'API 金鑰：已設定', keyMissing: 'API 金鑰：未設定', running: '正在詢問 Claude…', updated: ' 個檔案已更新（標有 *）。',
        hint: '變更選項會立即預覽。標有 * 的是 Claude 修改過的檔案。',
        overwrite: ' 個既有檔案將被覆寫，是否繼續？', overwriteBtn: '覆寫儲存', saved: '檔案已儲存。', openFolder: '開啟資料夾',
        keyBad: '無法讀取 API 金鑰（第一行只寫金鑰）。', keyLoaded: '已讀取 API 金鑰（存入 SecretStorage，檔案未被修改）。', noKey: '尚未設定 API 金鑰。',
        demoBanner: '示範：可在瀏覽器預覽範本並下載 zip。Claude 產生功能請於 VS Code 擴充功能使用。', demoGen: '示範中無法使用 Claude 產生。請安裝 VS Code 擴充功能並設定 API 金鑰。', demoKey: '示範中不使用 API 金鑰（請於 VS Code 擴充功能設定）。', demoSaved: '已下載 zip。',
        updAvail: "有可用更新：v{v}（目前 v{c}）。", updInstall: "立即更新", updNotes: "版本資訊", updLater: "稍後", updDone: "已更新，重新載入後生效。", updReload: "重新載入", updNone: "已是最新版本（v{v}）。", updFail: "檢查更新失敗：{e}", updNoChecksum: "未提供檢查碼，無法自動安裝。請從發行頁面手動安裝。", updBadChecksum: "檢查碼不符，已中止安裝。",
    },
    ko: {
        style: '방식', frontend: '프런트엔드', database: 'DB', gateway: '게이트웨이', backend: '백엔드',
        save: '폴더에 저장', setKey: 'API 키 입력', loadKey: 'txt에서 키 불러오기', generate: 'Claude로 생성/수정', reset: '템플릿으로 되돌리기',
        stackPh: '사용할 언어·프레임워크·만들고 싶은 것을 글로 입력 (예: Go + Gin + PostgreSQL ToDo API, Dockerfile 포함)',
        reqPh: 'Claude에게 요청 (예: 사용자 인증 추가 / Item에 price 추가)  Ctrl+Enter로 실행',
        files: '파일', copy: '복사', copied: '복사됨', openEditor: '에디터에서 열기',
        keyOk: 'API 키: 설정됨', keyMissing: 'API 키: 미설정', running: 'Claude에게 문의 중…', updated: '개 파일이 수정되었습니다(* 표시).',
        hint: '선택을 바꾸면 즉시 미리보기됩니다. *는 Claude가 변경한 파일입니다.',
        overwrite: '개의 기존 파일을 덮어씁니다. 계속할까요?', overwriteBtn: '덮어쓰기', saved: '파일을 저장했습니다.', openFolder: '폴더 열기',
        keyBad: 'API 키를 읽을 수 없습니다(첫 줄에 키만 작성하십시오).', keyLoaded: 'API 키를 불러왔습니다(SecretStorage에 저장, 파일은 변경되지 않음).', noKey: 'API 키가 설정되지 않았습니다.',
        demoBanner: '데모: 브라우저에서 템플릿 미리보기와 zip 다운로드를 체험할 수 있습니다. Claude 생성은 VS Code 확장에서 사용하십시오.', demoGen: '데모에서는 Claude 생성을 사용할 수 없습니다. VS Code 확장을 설치하고 API 키를 설정하십시오.', demoKey: '데모에서는 API 키를 사용하지 않습니다(VS Code 확장에서 설정).', demoSaved: 'zip을 다운로드했습니다.',
        updAvail: "업데이트가 있습니다: v{v} (현재 v{c}).", updInstall: "지금 업데이트", updNotes: "릴리스 노트", updLater: "나중에", updDone: "업데이트했습니다. 다시 로드하면 적용됩니다.", updReload: "다시 로드", updNone: "최신 버전입니다 (v{v}).", updFail: "업데이트 확인 실패: {e}", updNoChecksum: "체크섬이 없어 자동 설치할 수 없습니다. 릴리스 페이지에서 수동으로 설치하십시오.", updBadChecksum: "체크섬이 일치하지 않아 설치를 중단했습니다.",
    },
};

};
__defs["webview"]=function(module,exports,require){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.html = html;
const catalog_1 = require("./catalog");
const i18n_1 = require("./i18n");
const notices_1 = require("./notices");
function select(id, opts, def) {
    return `<select id="${id}">${opts
        .map((o) => `<option data-styles="${(o.styles ?? []).join(',')}" value="${o.id}"${o.id === def ? ' selected' : ''}${o.disabled ? ' disabled' : ''}>${o.label}</option>`)
        .join('')}</select>`;
}
function html(nonce, cspSource, lang = 'en') {
    const ui = i18n_1.UI[lang];
    // JSON for the inline script; "<" is escaped so the string can never close the script tag.
    const uiJson = JSON.stringify(ui).replace(/</g, '\\u003c');
    return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${cspSource} 'nonce-${nonce}'; script-src 'nonce-${nonce}';">
<style nonce="${nonce}">
  * { box-sizing: border-box; }
  body { font-family: var(--vscode-font-family); color: var(--vscode-foreground); margin: 0; padding: 0 14px 14px; }
  #bar { position: sticky; top: 0; z-index: 2; background: var(--vscode-editor-background); padding: 10px 0 8px; border-bottom: 1px solid var(--vscode-panel-border); }
  .row { display: flex; flex-wrap: wrap; gap: 10px; align-items: flex-end; margin-bottom: 8px; }
  label { display: flex; flex-direction: column; font-size: 11px; gap: 3px; min-width: 150px; flex: 1 1 150px; max-width: 280px; }
  select, textarea { background: var(--vscode-input-background); color: var(--vscode-input-foreground); border: 1px solid var(--vscode-input-border, #555); padding: 5px; font-size: 12px; }
  select:focus, textarea:focus, button:focus-visible { outline: 1px solid var(--vscode-focusBorder); }
  textarea { width: 100%; min-height: 54px; resize: vertical; font-family: inherit; }
  button { background: var(--vscode-button-background); color: var(--vscode-button-foreground); border: 0; padding: 6px 12px; cursor: pointer; font-size: 12px; }
  button:hover { background: var(--vscode-button-hoverBackground); }
  button.secondary { background: var(--vscode-button-secondaryBackground); color: var(--vscode-button-secondaryForeground); }
  button.secondary:hover { background: var(--vscode-button-secondaryHoverBackground); }
  button:disabled { opacity: .5; cursor: default; }
  #keystate { font-size: 11px; padding: 2px 8px; border-radius: 10px; border: 1px solid var(--vscode-panel-border); }
  #keystate.ok { color: var(--vscode-charts-green); }
  #keystate.no { color: var(--vscode-charts-yellow); }
  .hidden { display: none; }
  #stack { margin-bottom: 6px; }
  .actions { margin: 6px 0 0; }
  .grow { flex: 1; }
  #hint { font-size: 11px; opacity: .75; margin: 6px 0; }
  #status { font-size: 12px; min-height: 18px; margin: 4px 0; }
  #status.busy::before { content: ''; display: inline-block; width: 10px; height: 10px; margin-right: 6px; border: 2px solid var(--vscode-foreground); border-right-color: transparent; border-radius: 50%; animation: spin .8s linear infinite; vertical-align: -1px; }
  @keyframes spin { to { transform: rotate(360deg); } }
  #main { display: flex; gap: 10px; height: calc(100vh - 330px); min-height: 260px; }
  #files { width: 240px; flex: none; overflow: auto; border-right: 1px solid var(--vscode-panel-border); padding-right: 4px; }
  #files .dir { font-size: 11px; opacity: .7; padding: 6px 4px 2px; font-family: var(--vscode-editor-font-family); }
  #files .f { padding: 3px 6px 3px 14px; cursor: pointer; font-family: var(--vscode-editor-font-family); font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  #files .f:hover { background: var(--vscode-list-hoverBackground); }
  #files .f.sel { background: var(--vscode-list-activeSelectionBackground); color: var(--vscode-list-activeSelectionForeground); }
  #files .f.chg::after { content: ' *'; color: var(--vscode-charts-yellow); }
  #view { flex: 1; min-width: 0; display: flex; flex-direction: column; }
  #vbar { display: flex; gap: 8px; align-items: center; margin-bottom: 4px; }
  #vname { flex: 1; font-family: var(--vscode-editor-font-family); font-size: 12px; opacity: .85; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  #code { flex: 1; margin: 0; overflow: auto; padding: 8px 0; background: var(--vscode-textCodeBlock-background); font-family: var(--vscode-editor-font-family); font-size: var(--vscode-editor-font-size); tab-size: 2; }
  #code div { white-space: pre; padding-left: 4.5em; position: relative; min-height: 1.3em; }
  #code div::before { content: attr(data-n); position: absolute; left: 0; width: 3.6em; text-align: right; opacity: .45; user-select: none; }
  #notice { margin-top: 14px; font-size: 12px; opacity: .85; }
  @media (pointer: coarse) { button, select, textarea { font-size: 16px; min-height: 44px; } #files .f { padding: 10px 8px 10px 14px; } #copy, #edit { min-height: 44px; } }
  @media (max-width: 480px) { label { flex: 1 1 100%; max-width: none; } #bar .row > button { flex: 1 1 auto; } }
  @media (max-width: 700px) { #main { flex-direction: column; height: auto; } #files { width: auto; max-height: 160px; border-right: 0; } #code { max-height: 55vh; } }
</style>
</head>
<body>
<div id="bar">
  <div class="row">
    <label>${ui.style} ${select('style', catalog_1.OPTIONS.style, 'cosmo')}</label>
    <label class="stackopt">${ui.frontend} ${select('frontend', catalog_1.OPTIONS.frontend, 'html-css')}</label>
    <label class="stackopt">${ui.database} ${select('database', catalog_1.OPTIONS.database, 'sqlite')}</label>
    <label class="stackopt" id="gwlabel">${ui.gateway} ${select('gateway', catalog_1.OPTIONS.gateway, 'cosmo')}</label>
    <label class="stackopt">${ui.backend} ${select('backend', catalog_1.OPTIONS.backend, 'python-fastapi')}</label>
  </div>
  <textarea id="stack" class="hidden" placeholder="${ui.stackPh}"></textarea>
  <textarea id="req" placeholder="${ui.reqPh}"></textarea>
  <div class="row actions">
    <button id="gen">${ui.generate}</button>
    <button id="reset" class="secondary">${ui.reset}</button>
    <button id="save" class="secondary">${ui.save}</button>
    <span class="grow"></span>
    <span id="keystate" class="no">${ui.keyMissing}</span>
    <button id="key" class="secondary">${ui.setKey}</button>
    <button id="keyfile" class="secondary">${ui.loadKey}</button>
  </div>
</div>
<div id="hint">${ui.hint}</div>
<div id="status"></div>
<div id="main">
  <div id="files" aria-label="${ui.files}"></div>
  <div id="view">
    <div id="vbar"><span id="vname"></span><button id="copy" class="secondary">${ui.copy}</button><button id="edit" class="secondary">${ui.openEditor}</button></div>
    <div id="code" tabindex="0"></div>
  </div>
</div>
${(0, notices_1.noticeHtml)(lang)}
<script nonce="${nonce}">
  const vscode = acquireVsCodeApi();
  const T = ${uiJson};
  const $ = (id) => document.getElementById(id);
  let files = {}, changed = new Set(), current = null;
  const sel = () => ({ stack: $('stack').value, style: $('style').value, frontend: $('frontend').value, database: $('database').value, gateway: $('gateway').value, backend: $('backend').value });

  function saveState() {
    vscode.setState({ sel: sel(), req: $('req').value, stack: $('stack').value });
  }
  function restoreState() {
    const st = vscode.getState();
    if (!st) return;
    for (const id of ['style', 'frontend', 'database', 'gateway', 'backend']) {
      const el = $(id), v = st.sel && st.sel[id];
      if (v && [...el.options].some((o) => o.value === v && !o.disabled)) el.value = v;
    }
    $('req').value = st.req || '';
    $('stack').value = st.stack || '';
  }

  function applyStyle() {
    const st = $('style').value;
    for (const id of ['frontend', 'gateway', 'backend']) {
      const el = $(id);
      for (const o of el.options) {
        const styles = o.dataset.styles;
        o.hidden = !!styles && !styles.split(',').includes(st);
      }
      if (el.selectedOptions[0] && el.selectedOptions[0].hidden) {
        const ok = [...el.options].filter((o) => !o.hidden && !o.disabled);
        const next = ok.find((o) => o.value !== 'none') || ok[0];
        if (next) el.value = next.value;
      }
    }
    const custom = st === 'custom';
    for (const l of document.querySelectorAll('.stackopt')) l.style.display = custom ? 'none' : '';
    $('gwlabel').style.display = st === 'cosmo' ? '' : 'none';
    $('stack').classList.toggle('hidden', !custom);
  }

  function render() {
    const list = $('files');
    list.innerHTML = '';
    const names = Object.keys(files).sort((a, b) => {
      const da = a.includes('/') ? 0 : 1, db = b.includes('/') ? 0 : 1;
      return da - db || a.localeCompare(b);
    });
    if (!names.includes(current)) current = names.includes('README.md') ? 'README.md' : names[0] || null;
    let lastDir = null;
    for (const n of names) {
      const i = n.lastIndexOf('/');
      const dir = i < 0 ? '' : n.slice(0, i), base = n.slice(i + 1);
      if (dir !== lastDir) {
        lastDir = dir;
        { const h = document.createElement('div'); h.className = 'dir'; h.textContent = dir ? dir + '/' : './'; list.appendChild(h); }
      }
      const d = document.createElement('div');
      d.className = 'f' + (n === current ? ' sel' : '') + (changed.has(n) ? ' chg' : '');
      d.textContent = base;
      d.title = n;
      d.onclick = () => { current = n; render(); };
      list.appendChild(d);
    }
    $('vname').textContent = current || '';
    const code = $('code');
    code.innerHTML = '';
    if (current) {
      const lines = files[current].split('\\n');
      if (lines[lines.length - 1] === '') lines.pop();
      const frag = document.createDocumentFragment();
      lines.forEach((t, k) => { const d = document.createElement('div'); d.dataset.n = String(k + 1); d.textContent = t; frag.appendChild(d); });
      code.appendChild(frag);
    }
  }

  function setStatus(text, busy) {
    const s = $('status');
    s.textContent = text || '';
    s.className = busy ? 'busy' : '';
  }
  function setKeyState(has) {
    const k = $('keystate');
    k.textContent = has ? T.keyOk : T.keyMissing;
    k.className = has ? 'ok' : 'no';
  }

  function preview() { applyStyle(); changed = new Set(); saveState(); vscode.postMessage({ type: 'preview', selection: sel() }); }
  for (const id of ['style', 'frontend', 'database', 'gateway', 'backend']) $(id).onchange = preview;
  $('stack').oninput = saveState;
  $('req').oninput = saveState;
  $('reset').onclick = preview;
  $('save').onclick = () => vscode.postMessage({ type: 'save', files });
  $('key').onclick = () => vscode.postMessage({ type: 'setKey' });
  $('keyfile').onclick = () => vscode.postMessage({ type: 'loadKey' });
  $('copy').onclick = async () => {
    if (!current) return;
    try { await navigator.clipboard.writeText(files[current]); } catch (e) { vscode.postMessage({ type: 'copy', text: files[current] }); }
    setStatus(T.copied, false);
  };
  $('edit').onclick = () => current && vscode.postMessage({ type: 'openFile', path: current, content: files[current] });
  function generate() {
    $('gen').disabled = true;
    setStatus(T.running, true);
    saveState();
    vscode.postMessage({ type: 'generate', selection: sel(), base: files, request: $('req').value });
  }
  $('gen').onclick = generate;
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey) && !$('gen').disabled) { e.preventDefault(); generate(); }
  });

  window.addEventListener('message', (e) => {
    const m = e.data;
    if (m.type === 'files') { files = m.files; render(); }
    if (m.type === 'merge') {
      for (const [p, c] of Object.entries(m.files)) { files[p] = c; changed.add(p); }
      current = Object.keys(m.files)[0] || current;
      render();
    }
    if (m.type === 'status') { setStatus(m.text, false); $('gen').disabled = false; }
    if (m.type === 'keyState') setKeyState(m.has);
  });
  restoreState();
  preview();
  vscode.postMessage({ type: 'init' });
</script>
</body>
</html>`;
}

};
// Browser demo glue: runs the real webview HTML in a plain web page with an in-page "extension host".
// Templates are generated locally (no network, no API key); Claude generation is explained as extension-only.
(function () {
  const { generate } = __require('./catalog');
  const { html } = __require('./webview');
  const { pickLang } = __require('./notices');
  const { UI } = __require('./i18n');

  const q = new URLSearchParams(location.search).get('lang');
  const lang = pickLang(q || navigator.language || 'en');
  const ui = UI[lang];

  let state;
  try { state = JSON.parse(localStorage.getItem('open-vsc-claude-demo')); } catch (e) { state = undefined; }
  const reply = (m) => setTimeout(() => window.postMessage(m, '*'), 0);

  // ---- minimal stored-zip writer (no dependencies)
  const table = (() => {
    const t = [];
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      t.push(c >>> 0);
    }
    return t;
    if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
    navigator.serviceWorker.register('sw.js').catch(() => { /* offline support is optional */ });
  }
})();
  const crc32 = (b) => {
    let c = 0xffffffff;
    for (let i = 0; i < b.length; i++) c = table[(c ^ b[i]) & 0xff] ^ (c >>> 8);
    return (c ^ 0xffffffff) >>> 0;
  };
  const u16 = (v) => [v & 255, (v >> 8) & 255];
  const u32 = (v) => [v & 255, (v >> 8) & 255, (v >> 16) & 255, (v >>> 24) & 255];
  function zip(files) {
    const enc = new TextEncoder();
    const parts = [];
    const central = [];
    let offset = 0;
    for (const [name, content] of Object.entries(files)) {
      const nb = enc.encode(name);
      const data = enc.encode(content);
      const crc = crc32(data);
      const local = new Uint8Array([...u32(0x04034b50), ...u16(20), ...u16(0x0800), ...u16(0), ...u16(0), ...u16(0x21), ...u32(crc), ...u32(data.length), ...u32(data.length), ...u16(nb.length), ...u16(0)]);
      parts.push(local, nb, data);
      central.push(new Uint8Array([...u32(0x02014b50), ...u16(20), ...u16(20), ...u16(0x0800), ...u16(0), ...u16(0), ...u16(0x21), ...u32(crc), ...u32(data.length), ...u32(data.length), ...u16(nb.length), ...u16(0), ...u16(0), ...u16(0), ...u16(0), ...u32(0), ...u32(offset)]), nb);
      offset += local.length + nb.length + data.length;
    }
    const cdSize = central.reduce((n, p) => n + p.length, 0);
    const count = Object.keys(files).length;
    const end = new Uint8Array([...u32(0x06054b50), ...u16(0), ...u16(0), ...u16(count), ...u16(count), ...u32(cdSize), ...u32(offset), ...u16(0)]);
    return new Blob([...parts, ...central, end], { type: 'application/zip' });
  }
  function download(blob, name) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
  }

  window.acquireVsCodeApi = () => ({
    getState: () => state,
    setState: (s) => {
      state = s;
      try { localStorage.setItem('open-vsc-claude-demo', JSON.stringify(s)); } catch (e) { /* private mode */ }
    },
    postMessage: (m) => {
      if (m.type === 'preview') reply({ type: 'files', files: generate(m.selection) });
      else if (m.type === 'init') reply({ type: 'keyState', has: false });
      else if (m.type === 'generate') reply({ type: 'status', text: ui.demoGen });
      else if (m.type === 'setKey' || m.type === 'loadKey') reply({ type: 'status', text: ui.demoKey });
      else if (m.type === 'save') { download(zip(m.files), 'open-vsc-claude-project.zip'); reply({ type: 'status', text: ui.demoSaved }); }
      else if (m.type === 'openFile') window.open(URL.createObjectURL(new Blob([m.content], { type: 'text/plain;charset=utf-8' })), '_blank');
      else if (m.type === 'copy') { try { navigator.clipboard.writeText(m.text); } catch (e) { /* ignore */ } }
    },
  });

  document.open();
  // The webview markup carries a CSP <meta>; written into a plain page it is ignored (and logs an error), so drop it here.
  const page = html('demo', location.origin, lang)
    .replace(/<meta http-equiv="Content-Security-Policy"[^>]*>/, '')
    .replace('</head>', '<meta name="theme-color" content="#0e639c"><link rel="manifest" href="manifest.webmanifest"><link rel="apple-touch-icon" href="icon-180.png"><link rel="stylesheet" href="theme.css"></head>');
  document.open();
  document.write(page);
  document.close();
  const bar = document.createElement('div');
  bar.style.cssText = 'padding:8px 14px;font:12px system-ui,sans-serif;background:#0e639c;color:#fff;line-height:1.7;';
  bar.appendChild(document.createTextNode(ui.demoBanner + '  '));
  for (const [label, href] of [
    ['GitHub →', 'https://github.com/aon-co-jp/open-vsc-claude'],
    ['.vsix →', 'https://github.com/aon-co-jp/open-vsc-claude/releases/latest'],
    ['Docs (12 languages) →', 'https://github.com/aon-co-jp/open-vsc-claude/tree/main/docs/i18n'],
  ]) {
    const a = document.createElement('a');
    a.href = href;
    a.textContent = label;
    a.style.cssText = 'color:#fff;font-weight:600;margin-right:12px;white-space:nowrap;';
    bar.appendChild(a);
  }
  document.body.insertBefore(bar, document.body.firstChild);
  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
    navigator.serviceWorker.register('sw.js').catch(() => { /* offline support is optional */ });
  }
})();

})();
