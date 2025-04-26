import { useCallback, useEffect, useState } from "react";
import { throttle } from "./throttle";

interface Row {
  [key: string]: string | number | boolean | null;
}

export function useRemoteNDJSON(url: string) {
  const [rows, setRows] = useState<Row[]>([]);
  const [reader, setReader] = useState<ReadableStreamBYOBReader | null>(null);
  const [decoder] = useState(() => new TextDecoder());
  const [buffer, setBuffer] = useState<string>("");
  const [isDone, setIsDone] = useState<boolean>(false);

  const processChunk = useCallback(async () => {
    if (!reader || isDone) return;

    try {
      let buffered = new ArrayBuffer(60 * 1024); // 60Kb for above the fold buffer
      const { value, done } = await reader.read(
        new Uint8Array(buffered, 0, buffered.byteLength)
      );
      if (done) {
        setIsDone(true);
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
    }
  }, [reader, buffer, decoder, isDone]);

  const loadNextChunk = useCallback(throttle(processChunk, 500), [
    processChunk,
  ]);

  useEffect(() => {
    const initStream = async () => {
      const response = await fetch(url);
      const streamReader = response.body?.getReader({
        mode: "byob",
      });
      if (streamReader) {
        setReader(streamReader);
      }
    };
    initStream();
  }, [url]);

  useEffect(() => {
    if (rows.length === 0) {
      loadNextChunk();
    }
  }, [rows, loadNextChunk]);

  return { rows, isDone, loadNextChunk };
}
