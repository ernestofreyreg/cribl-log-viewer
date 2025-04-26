import { act, renderHook, waitFor } from "@testing-library/react";
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

  it.only("handles JSON parsing errors gracefully", async () => {
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
});
