import React, { useCallback, useRef, useState } from "react";
import {
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
  List,
  ScrollParams,
} from "react-virtualized";
import { useRemoteNDJSON } from "../../lib/useRemoteNDJSON";
import styles from "./NDJSONTable.module.css";
import { classNames } from "../../lib/classNames";
import { Chevron } from "../icons/Chevron";
import { LogEntry } from "../LogEntry/LogEntry";

interface NDJSONTableProps {
  url: string;
}

export function NDJSONTable({ url }: NDJSONTableProps) {
  const { rows, loadNextChunk } = useRemoteNDJSON(url);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const listRef = useRef<List>(null);
  const cache = new CellMeasurerCache({
    fixedWidth: true,
    defaultHeight: 24,
    keyMapper: (index) => index,
  });

  const handleRowClick = useCallback(
    (index: number) => () => {
      setExpandedRow((prev) => (prev === index ? null : index));
      cache.clear(index, 0);
      listRef.current?.recomputeRowHeights(index);
    },
    [cache]
  );

  const rowRenderer = ({
    index,
    key,
    style,
  }: {
    index: number;
    key: string;
    style: React.CSSProperties;
  }) => (
    <CellMeasurer
      cache={cache}
      columnIndex={0}
      key={key}
      parent={listRef.current!}
      rowIndex={index}
    >
      <div style={style} className={styles.rowContainer}>
        <div
          className={classNames(styles.row, styles.gridRow)}
          onClick={handleRowClick(index)}
        >
          <div>
            <Chevron rotated={expandedRow === index} />
            {new Date(rows[index]._time as string).toISOString()}
          </div>
          <div>
            {expandedRow !== index && <pre>{JSON.stringify(rows[index])}</pre>}
          </div>
        </div>

        {expandedRow === index && (
          <div className={styles.expandedRow}>
            <LogEntry logData={rows[index]} />
          </div>
        )}
      </div>
    </CellMeasurer>
  );

  const handleScroll = useCallback(
    (event: ScrollParams) => {
      const { scrollTop, clientHeight, scrollHeight } = event;
      const threshold = clientHeight / 2;
      if (scrollTop + threshold >= scrollHeight - threshold) {
        loadNextChunk();
      }
    },
    [loadNextChunk]
  );

  return (
    <div className={styles.container}>
      <div className={classNames(styles.header, styles.gridRow)}>
        <div>Time</div>
        <div>Event</div>
      </div>
      <div style={{ height: "80vh", width: "100%" }}>
        <AutoSizer>
          {({ width, height }) => (
            <List
              ref={listRef}
              deferredMeasurementCache={cache}
              rowHeight={cache.rowHeight}
              height={height}
              rowCount={rows.length}
              rowRenderer={rowRenderer}
              width={width}
              onScroll={handleScroll}
            />
          )}
        </AutoSizer>
      </div>
    </div>
  );
}

export default NDJSONTable;
