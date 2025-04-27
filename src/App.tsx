import "./styles.css";
import NDJSONTable from "./components/NDJSONTable/NDJSONTable";
import { useRemoteNDJSON } from "./lib/useRemoteNDJSON";
import { useState } from "react";
import { useNDJSONTimelineCounter } from "./lib/useNDJSONTimelineCounter";
import { LogTimelineChart } from "./components/LogTimelineChart/LogTimelineChart";
import styles from "./App.module.css";

const url = "https://s3.amazonaws.com/io.cribl.c021.takehome/cribl.log";

export default function App() {
  const { rows, loadNextChunk, isDone } = useRemoteNDJSON(url);

  const [resolution, setResolution] = useState<number>(6 * 60);

  const { hits } = useNDJSONTimelineCounter(url, resolution);

  return (
    <div className={styles.App}>
      <LogTimelineChart
        hits={hits}
        timeResolution={resolution}
        onResolutionChange={setResolution}
      />
      <NDJSONTable rows={rows} loadNextChunk={loadNextChunk} isDone={isDone} />
    </div>
  );
}
