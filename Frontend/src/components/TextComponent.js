import React, { useState } from "react";
import { providerHandler } from "./../Contractor/SmapleCourt";

const TextComponent = (props) => {
  const connectWalletHandler = () => {
    if (window.ethereum) {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then(async (result) => {
          await providerHandler();
          // props.showMintHandler(result);
          setConnected(true);
        })
        .catch((e) => {});
    }
  };

  const [connected, setConnected] = useState(false);

  const [minted, setMinted] = useState(false);

  const mintToken = () => {
    if(minted){
      alert("You have already minted token number 6")
    }else{
      setMinted(true)
    }
  }

  return (
    <div className="textContainer">
      {connected ? (
        <>
          <button
            className="connect-wallet-button"
            onClick={() => {
              mintToken()
            }}
          >
            MINT TOKEN
          </button>
        </>
      ) : (
        <button
          className="connect-wallet-button"
          onClick={connectWalletHandler}
        >
          <span style={{ marginRight: "4px" }}>
            <img src={require("../assets/wallet.png")} />
          </span>
          CONNECT
        </button>
      )}
    </div>
  );
};

export default TextComponent;
