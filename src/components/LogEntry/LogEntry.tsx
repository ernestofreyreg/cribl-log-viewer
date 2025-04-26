import { useCallback, useState } from "react";
import { Copy } from "../icons/Copy";
import styles from "./LogEntry.module.css";
import { Check } from "../icons/Check";
import { CopyButton } from "../CopyButton/CopyButton";

type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

interface LogEntryProps {
  logData: { [key: string]: JsonValue };
}

export function LogEntry({ logData }: LogEntryProps) {
  const renderValue = (value: any) => {
    if (value === null) {
      return <span className={styles.null}>null</span>;
    }
    if (typeof value === "string") {
      return <span className={styles.string}>"{value}"</span>;
    }
    if (typeof value === "number") {
      return <span className={styles.number}>{value}</span>;
    }
    if (typeof value === "boolean") {
      return <span className={styles.boolean}>{value.toString()}</span>;
    }
    if (Array.isArray(value)) {
      return (
        <>
          <span>[</span>
          <div className={styles.nested}>
            {value.map((item, i) => (
              <div key={i}>
                {renderValue(item)}
                {i < value.length - 1 ? "," : ""}
              </div>
            ))}
          </div>
          <span>]</span>
        </>
      );
    }
    if (typeof value === "object") {
      const entries = Object.entries(value);
      return (
        <>
          <span>{"{"}</span>
          <div className={styles.nested}>
            {entries.map(([key, val], i) => (
              <div key={key}>
                <span className={styles.key}>"{key}"</span>: {renderValue(val)}
                {i < entries.length - 1 ? "," : ""}
              </div>
            ))}
          </div>
          <span>{"}"}</span>
        </>
      );
    }
    return <span>{value}</span>;
  };

  return (
    <pre className={styles.viewer} data-testid="log-entry-container">
      {renderValue(logData)}

      <CopyButton data={logData} />
    </pre>
  );
}
