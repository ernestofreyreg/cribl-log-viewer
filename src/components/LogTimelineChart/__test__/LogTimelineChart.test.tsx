import { render, screen } from "@testing-library/react";
import { LogTimelineChart } from "../LogTimelineChart";

describe("LogTimelineChart", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("renders timeline chart with data", () => {
    const mockData = [
      { minute: 27000000, count: 2 },
      { minute: 27000060, count: 1 },
      { minute: 27000120, count: 3 },
    ];

    const { container } = render(
      <LogTimelineChart
        hits={mockData}
        maxCount={3}
        timeResolution={60}
        onResolutionChange={() => {}}
        loading={false}
      />
    );

    expect(container.querySelectorAll(".bar")).toHaveLength(3);
  });

  it("renders empty state when no data provided", () => {
    const { container } = render(
      <LogTimelineChart
        hits={[]}
        maxCount={0}
        timeResolution={60}
        onResolutionChange={() => {}}
      />
    );

    expect(container.querySelectorAll(".bar")).toHaveLength(0);
  });

  it("displays error message when error is provided", () => {
    const { container } = render(
      <LogTimelineChart
        hits={[]}
        maxCount={0}
        timeResolution={60}
        onResolutionChange={() => {}}
        error={new Error("Test error")}
      />
    );
    expect(screen.getByText("Test error")).toBeInTheDocument();
  });

  it("displays empty state when rows are empty and isDone is true", () => {
    const { container } = render(
      <LogTimelineChart
        hits={[]}
        maxCount={0}
        timeResolution={60}
        onResolutionChange={() => {}}
      />
    );
    expect(screen.getByText("No data")).toBeInTheDocument();
  });
});
