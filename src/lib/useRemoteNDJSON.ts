import { useCallback, useEffect, useState } from "react";
import { throttle } from "./throttle";

interface Row {
  [key: string]: string | number | boolean | null;
}

export function useRemoteNDJSON(url: string) {
  const [rows, setRows] = useState<Row[]>([]);
  const [reader, setReader] = useState<ReadableStreamDefaultReader | null>(
    null
  );
  const [decoder] = useState(() => new TextDecoder());
  const [buffer, setBuffer] = useState<string>("");
  const [isDone, setIsDone] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const initStream = async () => {
      const response = await fetch(url);
      const streamReader = response.body?.getReader();
      if (streamReader) {
        setReader(streamReader);
      }
    };
    initStream();
  }, [url]);

  const processChunk = useCallback(async () => {
    if (!reader || isDone || isLoading) return;
    setIsLoading(true);

    try {
      const { value, done } = await reader.read();
      if (done) {
        setIsDone(true);
        setIsLoading(false);
        return;
      }

      const chunk = decoder.decode(value, { stream: true });
      const combined = buffer + chunk;
      const lines = combined.split("\n");
      const lastLine = lines.pop();

      const newItems = lines
        .map((line) => {
          try {
            return JSON.parse(line);
          } catch {
            return null;
          }
        })
        .filter(Boolean);

      setRows((prev) => [...prev, ...newItems]);
      setBuffer(lastLine ?? "");
    } catch (err) {
      console.error("Error processing chunk:", err);
    } finally {
      setIsLoading(false);
    }
  }, [reader, buffer, decoder, isDone, isLoading]);

  const loadNextChunk = useCallback(throttle(processChunk, 500), [
    processChunk,
  ]);

  useEffect(() => {
    if (rows.length === 0) {
      loadNextChunk();
    }
  }, [rows, loadNextChunk]);

  return { rows, isDone, isLoading, loadNextChunk };
}
