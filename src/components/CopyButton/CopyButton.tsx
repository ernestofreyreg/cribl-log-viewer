import { useCallback, useState } from "react";
import { Check } from "../icons/Check";
import { Copy } from "../icons/Copy";
import styles from "./CopyButton.module.css";

type CopyButtonProps = { data: Record<string, unknown> };

export function CopyButton({ data }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [data]);

  return (
    <button className={styles.copyButton} type="button" onClick={handleCopy}>
      {copied ? <Check /> : <Copy />}
    </button>
  );
}
