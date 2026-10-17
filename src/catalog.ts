// Stack catalog and bundled templates. No vscode dependency so it can be unit-tested.
// Design: GraphQL only (no REST) behind a WunderGraph Cosmo Router; no Node.js in any generated project.
import { generateRest } from './restTemplates';
import { COSMO_EXECUTION_CONFIG, COSMO_GRAPH_YAML, COSMO_SCHEMA } from './cosmoConfig';

export type Style = 'cosmo' | 'rest' | 'custom';
export type Frontend = 'none' | 'html-css' | 'html-css-ts' | 'html-css-ts-react' | 'rust-leptos';
export type Database = 'none' | 'sqlite' | 'postgres';
export type Backend = 'none' | 'python-fastapi' | 'rust-poem' | 'node-ts';

export type Gateway = 'cosmo' | 'rpoem' | 'none';

export interface Selection {
  style: Style;
  /** custom style only: the language/framework/requirements typed by the user */
  stack?: string;
  frontend: Frontend;
  gateway: Gateway;
  database: Database;
  backend: Backend;
}

export type Files = Record<string, string>;

export const OPTIONS = {
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
} as const;

const SUBGRAPH_PORT = 4001;
const ROUTER_PORT = 3002;
const RPOEM_PORT = 8080;

function gatewayPort(sel: Selection): number {
  if (sel.backend === 'none') return ROUTER_PORT;
  return sel.gateway === 'none' ? SUBGRAPH_PORT : sel.gateway === 'rpoem' ? RPOEM_PORT : ROUTER_PORT;
}

export function generate(input: Selection): Files {
  if (input.style === 'rest') return generateRest(input);
  if (input.style === 'custom') {
    return { 'README.md': '# Custom project\n\n言語・フレームワーク・作りたいものを入力して「Claude で生成・改変」を押してください。\n' };
  }
  // GraphQL + Cosmo style: Node-based options do not exist here, coerce them to the closest valid one.
  const sel: Selection = {
    ...input,
    frontend: input.frontend === 'none' ? 'none' : input.frontend === 'rust-leptos' ? 'rust-leptos' : 'html-css',
    backend: input.backend === 'node-ts' ? 'none' : input.backend,
    gateway: input.gateway === 'none' ? 'none' : input.gateway === 'rpoem' ? 'rpoem' : 'cosmo',
  };
  const files: Files = {};
  if (sel.frontend === 'rust-leptos') {
    for (const [p, c] of Object.entries(leptosFiles(gatewayPort(sel)))) files['frontend/' + p] = c;
  } else if (sel.frontend === 'html-css') {
    for (const [p, c] of Object.entries(frontendFiles(gatewayPort(sel)))) files['frontend/' + p] = c;
  }
  if (sel.backend !== 'none') {
    const cors = sel.gateway === 'none'; // the Cosmo Router handles CORS itself; direct browser access needs it on the subgraph
    const b = sel.backend === 'python-fastapi' ? fastapiFiles(sel.database, cors) : poemFiles(sel.database, cors);
    for (const [p, c] of Object.entries(b)) files['backend/' + p] = c;
  }
  if (sel.backend !== 'none' && sel.gateway === 'cosmo') {
    files['gateway/config.json'] = COSMO_EXECUTION_CONFIG;
    files['gateway/schema.graphqls'] = COSMO_SCHEMA;
    files['gateway/graph.yaml'] = COSMO_GRAPH_YAML;
  }
  if (sel.backend !== 'none' && sel.gateway === 'rpoem') {
    files['gateway/rpoem.env'] = `OPEN_RUNO_SUBGRAPHS=items=http://localhost:${SUBGRAPH_PORT}/graphql
`;
    files['gateway/schema.graphqls'] = COSMO_SCHEMA;
  }
  const compose = composeFile(sel);
  if (compose) files['docker-compose.yml'] = compose;
  files['README.md'] = readme(sel);
  return files;
}

function composeFile(sel: Selection): string {
  const svc: string[] = [];
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

function readme(sel: Selection): string {
  const L = ['# Generated stack', '', `- Frontend: ${sel.frontend}`, `- Database: ${sel.database}`, `- Backend: ${sel.backend}`, `- Gateway: ${sel.gateway}`, '- API: GraphQL only (no REST, no Node.js)', '', '## Run', ''];
  if (sel.database === 'postgres') L.push('1. `docker compose up -d db`', '');
  if (sel.backend === 'python-fastapi') {
    L.push('Subgraph (port 4001):', '```', 'cd backend', 'python -m venv .venv', '.venv/Scripts/activate   # Windows / source .venv/bin/activate', 'pip install -r requirements.txt', `uvicorn main:app --port ${SUBGRAPH_PORT}`, '```', '');
  } else if (sel.backend === 'rust-poem') {
    L.push('Subgraph (port 4001):', '```', 'cd backend', 'cargo run', '```', '');
  }
  if (sel.backend !== 'none' && sel.gateway === 'cosmo') {
    L.push(
      'Cosmo Router (port 3002) — download the `router` binary from https://github.com/wundergraph/cosmo/releases (tag `router@…`) or use the Docker image:',
      '```',
      '# binary (bash)',
      'EXECUTION_CONFIG_FILE_PATH=gateway/config.json DEV_MODE=true ./router',
      '# Docker',
      'docker compose up -d router',
      '```',
      '',
      '`gateway/config.json` is the pre-composed router execution config for `gateway/schema.graphqls`.',
      'If you change the GraphQL schema, re-compose it once (the only step that needs Node.js, a dev-time tool):',
      '```',
      'npx wgc router compose -i gateway/graph.yaml -o gateway/config.json',
      '```',
      '',
    );
  }
  if (sel.backend !== 'none' && sel.gateway === 'rpoem') {
    L.push(
      'RPoem gateway (port 8080) — https://github.com/aon-co-jp/RPoem :',
      '```',
      'git clone https://github.com/aon-co-jp/RPoem && cd RPoem',
      'OPEN_RUNO_SUBGRAPHS=items=http://localhost:4001/graphql cargo run -p open-runo-gateway   # bash',
      '$env:OPEN_RUNO_SUBGRAPHS="items=http://localhost:4001/graphql"; cargo run -p open-runo-gateway   # PowerShell',
      '```',
      'The gateway discovers the root fields of the subgraph by introspection and forwards matching requests (root-field routing; queries mixing several subgraphs are rejected).',
      '',
    );
  }
  if (sel.frontend === 'rust-leptos') {
    L.push('Frontend (Rust + Leptos CSR, no Node/JS): one-time `rustup target add wasm32-unknown-unknown` and `cargo install trunk --locked`, then:', '```', 'cd frontend', 'trunk serve --open', '```', '');
  } else if (sel.frontend === 'html-css') {
    L.push('Frontend: open `frontend/index.html` (it posts GraphQL to the gateway, or directly to the subgraph when no gateway is selected).', '');
  }
  return L.join('\n');
}

// ---------------------------------------------------------------- frontend

function frontendFiles(port: number): Files {
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

function leptosFiles(port: number): Files {
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

function fastapiFiles(db: Database, cors: boolean): Files {
  const reqs = ['fastapi>=0.115', 'uvicorn[standard]>=0.30', 'strawberry-graphql[fastapi]>=0.240'];
  if (db === 'postgres') reqs.push('psycopg[binary]>=3.2');
  let pre = '';
  let list: string;
  let create: string;
  if (db === 'none') {
    pre = `\n_items: list[Item] = []\n`;
    list = `        return _items`;
    create = `        item = Item(id=len(_items) + 1, name=name)
        _items.append(item)
        return item`;
  } else if (db === 'sqlite') {
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
  } else {
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

function poemFiles(db: Database, cors: boolean): Files {
  const deps = [
    'poem = "3"',
    'async-graphql = "7"',
    'async-graphql-poem = "7"',
    'tokio = { version = "1", features = ["rt-multi-thread", "macros"] }',
  ];
  if (db !== 'none') deps.push(`sqlx = { version = "0.8", features = ["runtime-tokio", "${db}"] }`);
  const cargo = `[package]
name = "backend"
version = "0.1.0"
edition = "2021"

[dependencies]
${deps.join('\n')}
`;
  let main: string;
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
  } else {
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
