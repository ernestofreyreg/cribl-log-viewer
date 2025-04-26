import React, { useCallback, useRef, useState } from "react";
import {
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
  List,
  ScrollParams,
} from "react-virtualized";
import styles from "./NDJSONTable.module.css";
import { classNames } from "../../lib/classNames";
import { Chevron } from "../icons/Chevron";
import { LogEntry } from "../LogEntry/LogEntry";

interface NDJSONTableProps {
  rows: any[];
  loadNextChunk: () => void;
  isDone: boolean;
}

export function NDJSONTable({ rows, loadNextChunk, isDone }: NDJSONTableProps) {
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
      tabIndex={0}
      parent={listRef.current!}
      rowIndex={index}
    >
      <div style={style} className={styles.rowContainer}>
        <div
          className={classNames(styles.row, styles.gridRow)}
          onClick={handleRowClick(index)}
          role="button"
          aria-pressed={expandedRow === index}
        >
          <div>
            <Chevron rotated={expandedRow === index} />
            {rows[index]._time
              ? new Date(rows[index]._time as string).toISOString()
              : "-"}
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
      const ratio = scrollTop / (scrollHeight - clientHeight);
      if (ratio >= 0.85) {
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
        {!rows.length && isDone && <div className={styles.noData}>No data</div>}
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
