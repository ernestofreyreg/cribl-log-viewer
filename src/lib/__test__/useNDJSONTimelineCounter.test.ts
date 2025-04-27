import { renderHook, act } from "@testing-library/react";
import { useNDJSONTimelineCounter } from "../useNDJSONTimelineCounter";

describe("useNDJSONTimelineCounter", () => {
  const mockFetch = jest.fn();
  global.fetch = mockFetch;

  beforeEach(() => {
    mockFetch.mockClear();
  });

  it("should process NDJSON data and group by minutes correctly", async () => {
    const mockData = `
      {"_time": 1620000000000}
      {"_time": 1620000030000}
      {"_time": 1620003600000}
    `.trim();

    mockFetch.mockResolvedValueOnce({
      ok: true,
      text: () => Promise.resolve(mockData),
    });

    const { result } = renderHook(() =>
      useNDJSONTimelineCounter("test-url", 60)
    );

    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBe(null);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.hits).toEqual([
      { minute: 450000, count: 2 },
      { minute: 450001, count: 1 },
    ]);
  });

  it("should handle fetch errors", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    const { result } = renderHook(() =>
      useNDJSONTimelineCounter("test-url", 60)
    );

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.hits).toEqual([]);
  });

  it("should handle invalid JSON data", async () => {
    const mockData = `
      {"_time": 1620000000000}
      invalid json
      {"_time": 1620003600000}
    `.trim();

    mockFetch.mockResolvedValueOnce({
      ok: true,
      text: () => Promise.resolve(mockData),
    });

    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    const { result } = renderHook(() =>
      useNDJSONTimelineCounter("test-url", 60)
    );

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.hits).toEqual([
      { minute: 450000, count: 1 },
      { minute: 450001, count: 1 },
    ]);
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});
