import FrajBox from "../abis/FrajBox.json";
import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Main from "./Main";
import Web3 from "web3";
import "./App.css";

const ipfsClient = require("ipfs-http-client");
const ipfs = ipfsClient({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
}); // leaving out the arguments will default to these values

const App = () => {
  const [account, setAccount] = useState("");
  const [frajbox, setFrajbox] = useState(null);
  const [files, setFiles] = useState([]);
  const [filesCount, setFilesCount] = useState(0);
  const [buffer, setBuffer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState(null);
  const [name, setName] = useState(null);

  useEffect(() => {
    const loadWeb3 = async () => {
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
      } else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);
      } else {
        window.alert(
          "Non-Ethereum browser detected. You should consider trying MetaMask!"
        );
      }
    };

    const loadBlockchainData = async () => {
      const web3 = window.web3;
      // Load account
      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);
      // Network ID
      const networkId = await web3.eth.net.getId();
      const networkData = FrajBox.networks[networkId];
      if (networkData) {
        // Assign contract
        const frajbox = new web3.eth.Contract(FrajBox.abi, networkData.address);
        setFrajbox(frajbox);

        // Get files amount
        const fetchedFilesCount = await frajbox.methods.fileCount().call();
        setFilesCount(fetchedFilesCount);
        // Load files&sort by the newest
        for (var i = filesCount; i >= 1; i--) {
          const file = await frajbox.methods.files(i).call();
          setFiles((files) => [...files, file]);
        }
      } else {
        window.alert("FrajBox contract not deployed to detected network.");
      }
    };

    loadWeb3();
    loadBlockchainData();
  }, [filesCount]);

  // Get file from user
  const captureFile = (event) => {
    event.preventDefault();

    const file = event.target.files[0];
    const reader = new window.FileReader();

    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      setBuffer(Buffer(reader.result));
      setType(file.type);
      setName(file.name);
    };
  };

  const uploadFile = (description) => {
    console.log("Submitting file to IPFS...");

    // Add file to the IPFS
    ipfs.add(buffer, (error, result) => {
      if (error) {
        console.error(error);
        return;
      }

      setLoading(true);
      // Assign value for the file without extension
      if (type === "") {
        setType(null);
      }
      frajbox.methods
        .uploadFile(result[0].hash, result[0].size, type, name, description)
        .send({ from: account })
        .on("transactionHash", (hash) => {
          setLoading(false);
          setType(null);
          setName(null);
          window.location.reload();
        })
        .on("error", (e) => {
          window.alert("Error");
          setLoading(false);
        });
    });
  };

  return (
    <div>
      <Navbar account={account} />
      {loading ? (
        <div id="loader" className="text-center mt-5">
          <p>Loading...</p>
        </div>
      ) : (
        <Main files={files} captureFile={captureFile} uploadFile={uploadFile} />
      )}
    </div>
  );
};

export default App;
