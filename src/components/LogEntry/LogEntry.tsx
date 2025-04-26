import styles from "./LogEntry.module.css";

type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

interface ValueProps {
  needsComma?: boolean;
}

interface TypedValueProps extends ValueProps {
  value: any;
}

function StringValue({ value, needsComma = false }: TypedValueProps) {
  return (
    <span className={styles.stringValue}>
      "{value}"{needsComma ? "," : ""}
    </span>
  );
}

function NumberValue({ value, needsComma = false }: TypedValueProps) {
  return (
    <span className={styles.numberValue}>
      {value}
      {needsComma ? "," : ""}
    </span>
  );
}

function BooleanValue({ value, needsComma = false }: TypedValueProps) {
  return (
    <span className={styles.booleanValue}>
      {value.toString()}
      {needsComma ? "," : ""}
    </span>
  );
}

function NullValue({ needsComma = false }: ValueProps) {
  return <span className={styles.nullValue}>null{needsComma ? "," : ""}</span>;
}

function DefaultValue({ value, needsComma = false }: TypedValueProps) {
  return (
    <span className={styles.defaultValue}>
      {String(value)}
      {needsComma ? "," : ""}
    </span>
  );
}

function JsonValue({ value, needsComma = false }: TypedValueProps) {
  if (value === null) {
    return <NullValue needsComma={needsComma} />;
  }

  if (typeof value === "string") {
    return <StringValue value={value} needsComma={needsComma} />;
  }

  if (typeof value === "number") {
    return <NumberValue value={value} needsComma={needsComma} />;
  }

  if (typeof value === "boolean") {
    return <BooleanValue value={value} needsComma={needsComma} />;
  }

  if (Array.isArray(value)) {
    return <JsonArray value={value} needsComma={needsComma} />;
  }

  if (typeof value === "object") {
    return <JsonObject value={value} needsComma={needsComma} />;
  }

  return <DefaultValue value={value} needsComma={needsComma} />;
}

interface ArrayProps extends ValueProps {
  value: JsonValue[];
}

function JsonArray({ value, needsComma = false }: ArrayProps) {
  return (
    <div className={styles.nestedValue}>
      {`[`}
      <div className={styles.nestedContent}>
        {value.map((item, index) => (
          <div key={index} className={styles.logRow}>
            <JsonValue value={item} needsComma={index < value.length - 1} />
          </div>
        ))}
      </div>
      {`]${needsComma ? "," : ""}`}
    </div>
  );
}

interface ObjectProps extends ValueProps {
  value: { [key: string]: JsonValue };
}

function JsonObject({ value, needsComma = false }: ObjectProps) {
  const entries = Object.entries(value);

  return (
    <div className={styles.nestedValue}>
      {`{`}
      <div className={styles.nestedContent}>
        {entries.map(([key, propValue], index) => (
          <div key={key} className={styles.logRow}>
            <span className={styles.keyName}>"{key}":</span>
            <JsonValue
              value={propValue}
              needsComma={index < entries.length - 1}
            />
          </div>
        ))}
      </div>
      {`}${needsComma ? "," : ""}`}
    </div>
  );
}

interface LogEntryProps {
  logData: { [key: string]: JsonValue };
}

export function LogEntry({ logData }: LogEntryProps) {
  return (
    <div className={styles.logEntryContainer} data-testid="log-entry-container">
      <JsonObject value={logData} />
    </div>
  );
}
