import React, { useEffect, useState, useCallback } from "react";
import { AutoSizer, List, ScrollParams } from "react-virtualized";
import { throttle } from "../lib/throttle";

interface Row {
  [key: string]: string | number | boolean | null;
}

interface NDJSONTableProps {
  url: string;
}

const NDJSONTable: React.FC<NDJSONTableProps> = ({ url }) => {
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

  const throttledProcessChunk = useCallback(throttle(processChunk, 500), [
    processChunk,
  ]);

  useEffect(() => {
    if (rows.length === 0) {
      throttledProcessChunk();
    }
  }, [rows, throttledProcessChunk]);

  const rowRenderer = ({
    index,
    key,
    style,
  }: {
    index: number;
    key: string;
    style: React.CSSProperties;
  }) => (
    <div className="log-row" key={key} style={style}>
      <div>{index}</div>
      <div>
        <pre>{JSON.stringify(rows[index])}</pre>
      </div>
    </div>
  );

  const handleScroll = useCallback(
    (event: ScrollParams) => {
      const { scrollTop, clientHeight, scrollHeight } = event;
      const threshold = clientHeight / 2;
      if (scrollTop + threshold >= scrollHeight - threshold) {
        throttledProcessChunk();
      }
    },
    [throttledProcessChunk]
  );

  return (
    <div style={{ height: "80vh", width: "100%" }}>
      <AutoSizer>
        {({ width, height }) => (
          <List
            height={height}
            rowCount={rows.length}
            rowHeight={24}
            rowRenderer={rowRenderer}
            width={width}
            onScroll={handleScroll}
          />
        )}
      </AutoSizer>
    </div>
  );
};

export default NDJSONTable;
