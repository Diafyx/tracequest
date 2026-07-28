# TraceQuest

Watch real systems run, one source-level step at a time. TraceQuest is a browser-based simulator that walks through the exact internal execution path of database and distributed-systems operations — reproduced faithfully from real source code, with plain-English explanations for every step.

![CI](https://github.com/GlassBoxStudio/tracequest/actions/workflows/ci.yml/badge.svg)

## Overview

Databases and distributed systems are usually black boxes: you send a query and get a result back, with no visibility into everything that happened in between. TraceQuest opens the box. Each operation is broken down into the real functions, files, and data structures involved — in the order they actually execute — and animated as a station-based journey you can play, pause, step through, and rewind.

Progress carries XP and achievements across every tool, so learning one system's internals feeds into recognizing the same patterns (write-ahead logging, replication, consistency models) in the next one.

## Tools

- **PostgreSQL** — INSERT, indexed INSERT, SELECT, UPDATE, DELETE, tracing MVCC, WAL, heap pages, and B-tree maintenance against real Postgres source.
- **Cassandra** — single-row WRITE, tracing token routing, replica selection, QUORUM consistency, commit log + memtable writes, and hinted handoff for offline replicas.

More tools and operations are added incrementally; each lives as a self-contained scenario, so the list above will grow.

## Tech Stack

- React + TypeScript, built with Vite
- Tailwind CSS for styling
- Zustand for state
- Framer Motion for animation
- Hand-built SVG journey-path visualization (no graph/diagramming library)

## Getting Started

```bash
git clone git@github.com:GlassBoxStudio/tracequest.git
cd tracequest
npm install
npm run dev
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the local dev server with hot reload |
| `npm run build` | Type-check and produce a production build |
| `npm run lint` | Run oxlint |
| `npm run preview` | Preview the production build locally |

## License

MIT © [GlassBoxStudio](https://github.com/GlassBoxStudio)
