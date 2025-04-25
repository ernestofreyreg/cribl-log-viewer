# Cribl Log Viewer

A React app/components for efficiently viewing and streaming large NDJSON (Newline Delimited JSON) log files. This component handles streaming data with virtualized scrolling for optimal performance.

## Features

- [x] Streams NDJSON data in chunks for memory efficiency
- [x] Virtualized scrolling for smooth performance with large datasets
- [x] Automatic loading of more data as you scroll
- [x] Throttled processing to prevent overwhelming the browser
- [x] Handles backpressure and incomplete JSON lines
- [x] Responsive design that adapts to container size
- [ ] Implemented suggested design using CSS (no UI frameworks/kits)
- [ ] Selecting a data row, expands the data in a more human readable format.
- [ ] Tests implemented for components and logic
- [ ] Timeline component

## Installation

I personally use pnpm (https://pnpm.io/) so the instructions are:

```bash
pnpm install
pnpm run start
```
