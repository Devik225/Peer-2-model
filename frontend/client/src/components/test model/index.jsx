import { useState, useEffect } from "react";
import useEth from "../../contexts/EthContext/useEth";
import ContractBtns from "./ContractBtns";

function Index() {
  // const { state } = useEth();
  const { state: { contract, accounts } } = useEth();
  const [value, setValue] = useState("?");
  const [station1, setStation1] = useState("");
  const [station2, setStation2] = useState("");
  const [contractAddress, setContractAddress] = useState("not deployed yet")

  const positives = [0.531283905, 0.531385916, 0.531453759, 0.531492545, 0.531509996, 0.531521744, 0.531541864, 0.531571537, 0.531605781, 0.531637952, 0.531652455];
  const negatives = [-0.431285696, -0.531387708, -0.531455551, -0.531494337, -0.431511788, -0.531523535, -0.531543655, -0.531573329, -0.531607573, -0.531639744, -0.470654247]; 
  let [cTransactions, setCTransactions] = useState([]);
  let [transactions, setTransactions] = useState([]);
  // let [transactions2, setTransactions2] = useState([]);
  

  let addTransact = (v) => {
    setCTransactions([v]);
  }  
  
  // useEffect(() => {
  //   console.log(transactions, "devik");
  //   setTransactions2(transactions);
  // }, [transactions])
  
  

  const handleS1Change = e => {
    setStation1(e.target.value);
  };

  const handleS2Change = e => {
    setStation2(e.target.value);
  };

  const callAddress = async () =>{
    const tempAdd = await contract.methods.getContractAddress().call({from: station1 });
    setContractAddress(tempAdd);
  }

  const deployContract = async () =>{
    await contract.methods.setStations(station1, station2).send({from: station1});
    callAddress();
  };

  const startTransfer = async () =>{
    let temparr=[];
    for(let i=0; i<positives.length; i++){                                 
      const sent = (await contract.methods.write(parseInt(positives[i]*1000)).send({ from: station1}));
      const received = await contract.methods.read().call({from: station2});
      const p1 = received[received.length-1].positive;
      const n1 = Math.ceil(negatives[i]*1000);
      let isFault;
      if(parseInt(p1)+parseInt(n1) > 43){isFault = "Fault"}
      else{isFault = "No fault"}
      const customSent = { id: i, status:isFault, negative:n1, positive:p1, blockHash:sent.blockHash, blockNumber: sent.blockNumber, transactionHash: sent.transactionHash, gasUsed: sent.gasUsed };
      // console.log(sent);

      temparr.push(customSent);
      setTransactions(prevTransactions => [...prevTransactions, customSent]);
      addTransact(customSent);
    };
    // setTransactions(temparr);
    // positives.map( (pos) => contract.methods.write(parseInt(pos)).send({ from: accounts[0]}));
  };


  // const index =
  //   <>
  //     <div className="contract-container">
  //     <div>
  //       Current value = {value}
  //     </div>
  //       <ContractBtns setValue={setValue} />
  //     </div>
  //   </>;

  return (
    <div className="index">

      <div className="navbar">
        <div>Model for transferring data between power stations using Etherium Blockchain</div>
        <div className="prof">Thesis project under Dr. S R Mohanty</div>
      </div>

      <div className="head">
        Add Station addresses:
      </div>

      <div className="field">
        Sub Station 1 : 
        <input type="text" 
        placeholder="enter station 1 address"
        value={station1}
        onChange={handleS1Change}/>          
        <button>Set</button>
      </div>

      <div className="field">
        Sub Station 2 :
        <input type="text" 
        placeholder="enter station 2 address"
        value={station2}
        onChange={handleS2Change}/>  
        <button>Set</button>
      </div>

      <button className="btn" onClick={deployContract}>Deploy Smart Contract</button>

      <button className="btn" onClick={startTransfer}>Start the Transfer</button>

      <div className="prof">Contract Address :<span>{contractAddress}</span></div>

      

      <div className="head">Current Block:</div>
      <table className="table">
        <tr>
          <th>Block No.</th>
          <th>Block Hash</th>
          <th>Transaction Hash</th>
          <th>Gas used</th>
          <th>Sent</th>
          <th>Received</th>
          <th>Status</th>
        </tr>
          {cTransactions.map((val)=><tr key={val.id}>
            <td>{val.blockNumber}</td>
            <td>{val.blockHash}</td>
            <td>{val.transactionHash}</td>
            <td>{val.gasUsed} Wei</td>
            <td>{val.positive} A</td>
            <td>{val.negative} A</td>
            <td>{val.status}</td>
          </tr>)}
      </table>

      <div className="head">All Blocks:</div>
      <table className="table">
        <tr>
          <th>Block No.</th>
          <th>Block Hash</th>
          <th>Transaction Hash</th>
          <th>Gas used</th>
          <th>Sent</th>
          <th>Received</th>
          <th>Status</th>
        </tr>
          {transactions.map((val)=><tr key={val.id}>
            <td>{val.blockNumber}</td>
            <td>{val.blockHash}</td>
            <td>{val.transactionHash}</td>
            <td>{val.gasUsed} Wei</td>
            <td>{val.positive} A</td>
            <td>{val.negative} A</td>
            <td>{val.status}</td>
          </tr>)}
      </table>


      {/* {index} */}
    </div>
  );
}

export default Index;
