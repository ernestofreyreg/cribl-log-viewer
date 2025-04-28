import { render, screen, fireEvent } from "@testing-library/react";
import NDJSONTable from "../NDJSONTable";

jest.mock("react-virtualized", () => {
  const originalModule = jest.requireActual("react-virtualized");

  return {
    ...originalModule,
    AutoSizer: ({ children }: { children: any }) =>
      children({ width: 1000, height: 600 }),
    List: ({
      rowRenderer,
      rowCount,
    }: {
      rowRenderer: any;
      rowCount: number;
    }) => {
      const rows = [];
      for (let i = 0; i < Math.min(rowCount, 10); i++) {
        rows.push(
          rowRenderer({
            index: i,
            key: `row-${i}`,
            style: {},
            isScrolling: false,
            isVisible: true,
            parent: {
              // Minimal mock of required parent methods
              registerChild: () => {},
            },
          })
        );
      }
      return <div data-testid="virtualized-list">{rows}</div>;
    },
    CellMeasurer: ({ children }: { children: any }) => <div>{children}</div>,
  };
});

describe("NDJSONTable", () => {
  const mockRows = [
    { _time: "2024-01-01T00:00:00Z", message: "Test message 1" },
    { _time: "2024-01-01T00:01:00Z", message: "Test message 2" },
  ];

  const mockLoadNextChunk = jest.fn();

  it("renders table headers", () => {
    render(
      <NDJSONTable
        rows={mockRows}
        loadNextChunk={mockLoadNextChunk}
        isDone={false}
      />
    );

    expect(screen.getByText("Time")).toBeInTheDocument();
    expect(screen.getByText("Event")).toBeInTheDocument();
  });

  it("displays no data message when rows are empty and isDone is true", () => {
    render(
      <NDJSONTable rows={[]} loadNextChunk={mockLoadNextChunk} isDone={true} />
    );

    expect(screen.getByText("No data")).toBeInTheDocument();
  });

  it("renders rows with timestamps and data", async () => {
    render(
      <NDJSONTable
        rows={mockRows}
        loadNextChunk={mockLoadNextChunk}
        isDone={false}
      />
    );

    expect(screen.getByText("2024-01-01T00:00:00.000Z")).toBeInTheDocument();
    expect(screen.getByText(JSON.stringify(mockRows[0]))).toBeInTheDocument();
  });

  it("expands row on click", () => {
    render(
      <NDJSONTable
        rows={mockRows}
        loadNextChunk={mockLoadNextChunk}
        isDone={false}
      />
    );

    const firstRow = screen
      .getByText("2024-01-01T00:00:00.000Z")
      .closest("div");
    fireEvent.click(firstRow!);

    expect(
      screen.queryByText(JSON.stringify(mockRows[0]))
    ).not.toBeInTheDocument();

    expect(screen.getByTestId("log-entry-container")).toBeInTheDocument();
  });

  it("displays error message when error is provided", () => {
    render(
      <NDJSONTable
        rows={[]}
        loadNextChunk={mockLoadNextChunk}
        isDone={false}
        error={new Error("Test error")}
      />
    );
    expect(screen.getByText("Test error")).toBeInTheDocument();
  });

  it("displays empty state when rows are empty and isDone is true", () => {
    render(
      <NDJSONTable rows={[]} loadNextChunk={mockLoadNextChunk} isDone={true} />
    );
    expect(screen.getByText("No data")).toBeInTheDocument();
  });
});
