import "./styles.css";
import NDJSONTable from "./components/NDJSONTable/NDJSONTable";
import { useRemoteNDJSON } from "./lib/useRemoteNDJSON";
import { useState } from "react";
import { useNDJSONTimelineCounter } from "./lib/useNDJSONTimelineCounter";
import { LogTimelineChart } from "./components/LogTimelineChart/LogTimelineChart";
import { Analytics } from "@vercel/analytics/react";
import styles from "./App.module.css";

const url = "https://s3.amazonaws.com/io.cribl.c021.takehome/cribl.log";

export default function App() {
  const {
    rows,
    loadNextChunk,
    isDone,
    error: dataError,
  } = useRemoteNDJSON(url);

  const [resolution, setResolution] = useState<number>(6 * 60);

  const {
    hits,
    maxCount,
    loading,
    error: timelineError,
  } = useNDJSONTimelineCounter(url, resolution);

  return (
    <div className={styles.App}>
      <LogTimelineChart
        hits={hits}
        maxCount={maxCount}
        timeResolution={resolution}
        onResolutionChange={setResolution}
        loading={loading}
        error={timelineError}
      />
      <NDJSONTable
        rows={rows}
        loadNextChunk={loadNextChunk}
        isDone={isDone}
        error={dataError}
      />
      <Analytics />
    </div>
  );
}
