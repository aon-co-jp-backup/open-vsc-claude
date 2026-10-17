// "TypeScript + Node.js + REST API" style templates (the alternative to GraphQL + Cosmo).
import type { Files, Selection } from './catalog';

const PG_URL = 'postgresql://app:app@localhost:5432/app';
const API_PORT = 8000;

export function generateRest(sel: Selection): Files {
  const files: Files = {};
  if (sel.frontend !== 'none') {
    for (const [p, c] of Object.entries(frontendFiles(sel.frontend))) files['frontend/' + p] = c;
  }
  const be =
    sel.backend === 'python-fastapi' ? fastapiFiles(sel.database)
    : sel.backend === 'rust-poem' ? poemFiles(sel.database)
    : sel.backend === 'node-ts' ? nodeFiles(sel.database)
    : {};
  for (const [p, c] of Object.entries(be)) files['backend/' + p] = c;
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

function readme(sel: Selection): string {
  const L = ['# Generated stack (REST)', '', `- Frontend: ${sel.frontend}`, `- Database: ${sel.database}`, `- Backend: ${sel.backend}`, '', '## Run', ''];
  if (sel.database === 'postgres') L.push('```', 'docker compose up -d', '```', '');
  if (sel.backend === 'python-fastapi') {
    L.push('```', 'cd backend', 'python -m venv .venv', '.venv/Scripts/activate   # Windows / source .venv/bin/activate', 'pip install -r requirements.txt', `uvicorn main:app --reload --port ${API_PORT}`, '```', '');
  } else if (sel.backend === 'rust-poem') {
    L.push('```', 'cd backend', 'cargo run', '```', '');
  } else if (sel.backend === 'node-ts') {
    L.push('```', 'cd backend', 'npm install', 'npm run dev', '```', '');
  }
  if (sel.frontend === 'html-css') {
    L.push(`Open \`frontend/index.html\`. API base is \`http://localhost:${API_PORT}\`.`, '');
  } else if (sel.frontend !== 'none') {
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

function frontendFiles(kind: string): Files {
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
  const common: Files = {
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

function nodeFiles(db: string): Files {
  const deps: Record<string, string> = { express: '^4.21.0', cors: '^2.8.5' };
  const dev: Record<string, string> = {
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
  let pre: string;
  let list: string;
  let create: string;
  if (db === 'none') {
    pre = `const items: Item[] = [];`;
    list = `  res.json(items);`;
    create = `  const item = { id: items.length + 1, name: String(req.body.name) };
  items.push(item);
  res.json(item);`;
  } else if (db === 'sqlite') {
    pre = `import { DatabaseSync } from 'node:sqlite'; // built in since Node 22.5

const db = new DatabaseSync('app.db');
db.exec('CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL)');`;
    list = `  res.json(db.prepare('SELECT id, name FROM items ORDER BY id').all());`;
    create = `  const name = String(req.body.name);
  const info = db.prepare('INSERT INTO items (name) VALUES (?)').run(name);
  res.json({ id: Number(info.lastInsertRowid), name });`;
  } else {
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
  const wrap = (body: string) => body;
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

function fastapiFiles(db: string): Files {
  const reqs = ['fastapi>=0.115', 'uvicorn[standard]>=0.30'];
  if (db === 'postgres') reqs.push('psycopg[binary]>=3.2');
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
  let body: string;
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
  } else if (db === 'sqlite') {
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
  } else {
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

function poemFiles(db: string): Files {
  const deps = [
    'poem = "3"',
    'tokio = { version = "1", features = ["rt-multi-thread", "macros"] }',
    'serde = { version = "1", features = ["derive"] }',
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
  } else {
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
