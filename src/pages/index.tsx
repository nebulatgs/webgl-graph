import Graph from "../components/Graph";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

export default function Home() {
  return (
      <div className="flex flex-col h-full">
        <Header />
        <div className="flex  h-full">
          <Sidebar />
          <Graph/>
        </div>
      </div>
  )
}
