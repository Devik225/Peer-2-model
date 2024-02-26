import { EthProvider } from "./contexts/EthContext";
import Index from "./components/test model";


function App() {
  return (
    <EthProvider>
      <Index/>
    </EthProvider>
  );
}

export default App;
