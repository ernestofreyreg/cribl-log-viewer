import "./styles.css";
import NDJSONTable from "./components/NDJSONTable/NDJSONTable";
import { useRemoteNDJSON } from "./lib/useRemoteNDJSON";

export default function App() {
  const { rows, loadNextChunk, isDone } = useRemoteNDJSON(
    "https://s3.amazonaws.com/io.cribl.c021.takehome/cribl.log"
  );
  return (
    <div className="App">
      <NDJSONTable rows={rows} loadNextChunk={loadNextChunk} isDone={isDone} />
    </div>
  );
}
