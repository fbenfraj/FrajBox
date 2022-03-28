import React, { useState, useEffect } from "react";
import { convertBytes } from "./helpers";
import moment from "moment";

const Main = ({ files, captureFile, uploadFile, user, manager }) => {
  const [description, setDescription] = useState("");
  const [isManager, setIsManager] = useState(false);

  useEffect(() => {
    user === manager ? setIsManager(true) : setIsManager(false);
  }, [manager, user]);

  return (
    <div className="container-fluid mt-5 text-center">
      <div className="row">
        <main
          role="main"
          className="col-lg-12 ml-auto mr-auto"
          style={{ maxWidth: "1024px" }}
        >
          <div className="content">
            <div
              className="mx-auto"
              style={{ fontSize: "20px", lineHeight: "30px" }}
            >
              <a
                href="https://github.com/fbenfraj/FrajBox"
                target="_blank"
                rel="noopener noreferrer"
              >
                FrajBox
              </a>{" "}
              is a personnal decentralized file storage platform. <br /> It is
              build with React and Solidity.
              <br />
              <p>
                The files below are stored using IPFS. To learn more about IPFS{" "}
                <a
                  href="https://ipfs.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  click here
                </a>
                .
              </p>
              <br /> This project is deployed on the Rinkeby network (Ethereum
              Testnet) and is only for demonstration purpose.
              <br />
            </div>
            <p>&nbsp;</p>
            <div
              className="card mb-3 mx-auto bg-dark"
              style={{ maxWidth: "512px" }}
            >
              <h2 className="text-white text-monospace bg-dark">
                <b>
                  <ins>Share File</ins>
                </b>
              </h2>
              {!isManager && (
                <p style={{ color: "red" }}>
                  Please log in with your <b>manager</b> MetaMask account to
                  drop a file. :)
                </p>
              )}
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  uploadFile(description);
                }}
              >
                <div className="form-group">
                  <br></br>
                  <input
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="form-control text-monospace"
                    placeholder="description..."
                    disabled={!isManager}
                    required
                  />
                </div>
                <input
                  type="file"
                  onChange={captureFile}
                  className="text-white text-monospace"
                  disabled={!isManager}
                />
                <button
                  type="submit"
                  className={
                    "btn-" +
                    (isManager ? "primary" : "secondary") +
                    " btn-block"
                  }
                  disabled={!isManager}
                >
                  <b>Upload!</b>
                </button>
              </form>
            </div>
            <p>&nbsp;</p>
            <table
              className="table-sm table-bordered text-monospace"
              style={{ width: "1000px", maxHeight: "450px" }}
            >
              <thead style={{ fontSize: "15px" }}>
                <tr className="bg-dark text-white">
                  <th scope="col" style={{ width: "10px" }}>
                    id
                  </th>
                  <th scope="col" style={{ width: "200px" }}>
                    name
                  </th>
                  <th scope="col" style={{ width: "230px" }}>
                    description
                  </th>
                  <th scope="col" style={{ width: "120px" }}>
                    type
                  </th>
                  <th scope="col" style={{ width: "90px" }}>
                    size
                  </th>
                  <th scope="col" style={{ width: "90px" }}>
                    date
                  </th>
                  <th scope="col" style={{ width: "120px" }}>
                    uploader/view
                  </th>
                  <th scope="col" style={{ width: "120px" }}>
                    hash/view/get
                  </th>
                </tr>
              </thead>
              {files.map((file, key) => {
                return (
                  <thead style={{ fontSize: "12px" }} key={key}>
                    <tr>
                      <td>{file.fileId}</td>
                      <td>{file.fileName}</td>
                      <td>{file.fileDescription}</td>
                      <td>{file.fileType}</td>
                      <td>{convertBytes(file.fileSize)}</td>
                      <td>
                        {moment.unix(file.uploadTime).format("h:mm:ss A M/D/Y")}
                      </td>
                      <td>
                        <a
                          href={"https://etherscan.io/address/" + file.uploader}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          {file.uploader.substring(0, 10)}...
                        </a>
                      </td>
                      <td>
                        <a
                          href={"https://ipfs.infura.io/ipfs/" + file.fileHash}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          {file.fileHash.substring(0, 10)}...
                        </a>
                      </td>
                    </tr>
                  </thead>
                );
              })}
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Main;
