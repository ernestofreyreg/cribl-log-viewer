# Cribl Log Viewer

A React app/components for efficiently viewing and streaming large NDJSON (Newline Delimited JSON) log files. This component handles streaming data with virtualized scrolling for optimal performance.

## Features

- [x] Streams NDJSON data in chunks for memory efficiency
- [x] Virtualized scrolling for smooth performance with large datasets
- [x] Automatic loading of more data as you scroll
- [x] Throttled processing to prevent overwhelming the browser
- [x] Handles backpressure and incomplete JSON lines
- [x] Responsive design that adapts to container size
- [x] Implemented suggested design using CSS (no UI frameworks/kits)
- [x] Selecting a data row, expands the data in a more human readable format.
- [x] Tests implemented for components and logic
- [x] Timeline component

## Installation

I personally use pnpm (https://pnpm.io/) so the instructions are:

```bash
pnpm install
pnpm run start
```

Use `npm` or `yarn` if preferred.

## Added dependencies

- **react-virtualized**: (https://bvaughn.github.io/react-virtualized/). React component for rendering large datasets in list or grid format by only rendering DOM elements that are currently visible in the viewport, significantly reducing memory usage and processing time. Implementing this behavior myself, efficiently, would take me more time.

## Tests

Run tests with the following command:

```
pnpm run test
```

Run them on watch mode:

```
pnpm run test:watch
```

## Timeline component

I created a simple chart bars component for our project to provide basic data visualization capabilities without overcomplicating the implementation. Since we had limited time to dedicate to this feature, I focused on building something functional rather than comprehensive. The component only uses HTML and CSS modules with React, making it lightweight and easy to maintain without adding heavy dependencies.

Interestingly, the data displayed in these charts shows an unusually even distribution of events, which differs from what we typically see in log data.

## Testing

Unit tests implemented for all components (excluding App component)
Test coverage exceeds 80%.

### Opportunities for Enhancement

- Visual Testing
  We could strengthen our testing approach by implementing visual regression tests for UI-focused components:

  - LogEntry: Verify rendering of various log entry types and states
  - Icons: Ensure consistent appearance across different sizes and contexts
  - LogTimelineChart: Validate correct visualization of timeline data
  - NDJSONTable: Confirm proper formatting and display of complex data structures

- Automated Testing Expansion
  Additional automated testing opportunities include:

  - Integration tests to verify component interactions
  - End-to-end tests for critical user flows
  - Performance testing for data-intensive components
  - Accessibility compliance testing

### Next Steps

Prioritize implementing visual testing for the identified components to ensure UI consistency with design specifications.

## Empty and Error States

### Empty state

![empty-state](public/empty-state.png)

### Error state

![error-state](public/error-state.png)
