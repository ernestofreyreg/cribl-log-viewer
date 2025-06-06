import { renderHook, waitFor } from "@testing-library/react";
import { useRemoteNDJSON } from "../useRemoteNDJSON";

describe("useRemoteNDJSON", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("fetches and processes NDJSON data", async () => {
    const mockDataChunk = '{"id": 1}\n{"id": 2}\n{"id": 3}\n';
    const mockReader = {
      read: jest
        .fn()
        .mockResolvedValueOnce({
          value: new TextEncoder().encode(mockDataChunk),
          done: false,
        })
        .mockResolvedValueOnce({
          value: undefined,
          done: true,
        }),
    };

    global.fetch = jest.fn().mockResolvedValue({
      status: 200,
      body: {
        getReader: () => mockReader,
      },
    });

    const { result } = renderHook(() =>
      useRemoteNDJSON("http://test.com/data")
    );

    expect(result.current.rows).toEqual([]);
    expect(result.current.isDone).toBe(false);

    await waitFor(() => {
      expect(result.current.rows.length).toBe(3);
      expect(result.current.isDone).toBe(false);
      expect(result.current.rows).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }]);
    });
  });

  it("handles JSON parsing errors gracefully", async () => {
    const mockData = '{"id": 1}\ninvalid json\n{"id": 2}\n';
    const mockReader = {
      read: jest
        .fn()
        .mockResolvedValueOnce({
          value: new TextEncoder().encode(mockData),
          done: false,
        })
        .mockResolvedValueOnce({
          value: undefined,
          done: true,
        }),
    };

    global.fetch = jest.fn().mockResolvedValue({
      status: 200,
      body: {
        getReader: () => mockReader,
      },
    });

    const { result } = renderHook(() =>
      useRemoteNDJSON("http://test.com/data")
    );

    await waitFor(() => {
      expect(result.current.rows).toEqual([{ id: 1 }, { id: 2 }]);
    });
  });

  it("calls onChunkLoaded with each chunk", async () => {
    const onChunkLoaded = jest.fn();
    const mockDataChunk = '{"id": 1}\n{"id": 2}\n{"id": 3}\n';
    const mockReader = {
      read: jest
        .fn()
        .mockResolvedValueOnce({
          value: new TextEncoder().encode(mockDataChunk),
          done: false,
        })
        .mockResolvedValueOnce({
          value: undefined,
          done: true,
        }),
    };

    global.fetch = jest.fn().mockResolvedValue({
      status: 200,
      body: {
        getReader: () => mockReader,
      },
    });

    const { result } = renderHook(() =>
      useRemoteNDJSON("http://test.com/data", onChunkLoaded)
    );

    expect(result.current.rows).toEqual([]);
    expect(result.current.isDone).toBe(false);

    await waitFor(() => {
      expect(result.current.rows.length).toBe(3);
      expect(result.current.isDone).toBe(false);
      expect(result.current.rows).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }]);
      expect(onChunkLoaded).toHaveBeenCalledWith([
        { id: 1 },
        { id: 2 },
        { id: 3 },
      ]);
    });
  });

  it("handles fetch errors gracefully", async () => {
    const mockError = new Error("Fetch error");
    global.fetch = jest.fn().mockRejectedValue(mockError);

    const { result } = renderHook(() =>
      useRemoteNDJSON("http://test.com/data")
    );

    await waitFor(() => {
      expect(result.current.error).toBe(mockError);
    });
  });
});
