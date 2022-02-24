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

  const [mintCount, setMintCount] = useState(0);

  const mintToken = () => {
    if (!minted && mintCount === 0) {
      setMintCount(1)
      alert("You have minted token number 6");
    } else {
      setMinted(true);
    }
  };

  return (
    <div className="textContainer">
      <div className="gen-2-logo">
        <img
          style={minted ? {width: "450px", height: "200px",  marginLeft: "10%", marginTop:"12%" } : { width: "450px", height: "200px", marginTop:"12%"}}
          src={require("../assets/Group 13081@2x.png")}
        />
      </div>
      <div className="connect-mint-button">
        {connected ? (
          minted ? (
            <div className="message">
              SORRY ONLY ONE MINT PER WALLET...
            </div>
          ) : (
            <>
              <button
                className="connect-wallet-button"
                onClick={() => {
                  mintToken();
                }}
              >
                MINT NOW!
              </button>
              <div className="number-of-mint">
                <span className="osake-font-apply">2500 </span>LEFT
              </div>
            </>
          )
        ) : (
          <button
            className="connect-wallet-button"
            onClick={connectWalletHandler}
          >
            <span>
              <img style={{ marginRight: "12px",  width:"30px", height:"30px"}} src={require("../assets/wallet.png")} />
            </span>
            CONNECT
          </button>
        )}
      </div>
    </div>
  );
};

export default TextComponent;
