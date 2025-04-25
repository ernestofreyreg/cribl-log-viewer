import "./styles.css";
import NDJSONTable from "./components/NDJSONTable";

export default function App() {
  return (
    <div className="App">
      <NDJSONTable url="https://s3.amazonaws.com/io.cribl.c021.takehome/cribl.log" />
    </div>
  );
}
