import { throttle } from "../throttle";

describe("throttle", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("limits execution to once per wait period", () => {
    const mockFn = jest.fn();
    const throttledFn = throttle(mockFn, 1000);

    throttledFn();
    throttledFn();
    throttledFn();

    jest.advanceTimersByTime(1000);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it("preserves function arguments", () => {
    const mockFn = jest.fn();
    const throttledFn = throttle(mockFn, 1000);

    throttledFn("test", 123);
    jest.advanceTimersByTime(1000);
    expect(mockFn).toHaveBeenCalledWith("test", 123);
  });
});
