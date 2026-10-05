# Changelog

All notable changes to TraceQuest are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project uses [Semantic Versioning](https://semver.org/).

## [0.1.0] - 2026-10-05

First public release.

### Added

- **PostgreSQL** (traced against ~v16): INSERT, indexed INSERT, SELECT, UPDATE and DELETE, covering MVCC visibility, the write-ahead log, heap pages and B-tree maintenance.
- **Apache Cassandra** (traced against ~v4.x): WRITE, READ, DELETE, lightweight transactions (Paxos) and compaction, covering token routing, QUORUM consistency, the commit log and memtable, hinted handoff, bloom filters, read repair and tombstones.
- Station-based journey path with play, pause, step, rewind and speed control, plus keyboard shortcuts.
- Call trail, component map and step log for every step, each linked to the real function and source file.
- XP and 25 achievements that carry across both tools.

[0.1.0]: https://github.com/Diafyx/tracequest/releases/tag/v0.1.0
