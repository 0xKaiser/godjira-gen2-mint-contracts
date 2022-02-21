import React, { useState } from "react";
import SplitText from "./SplitText";
import { providerHandler } from "./../Contractor/SmapleCourt";

const TextComponent = (props) => {
  const connectWalletHandler = () => {
    if (window.ethereum) {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then(async (result) => {
          await providerHandler();
          props.showMintHandler(result);
        })
        .catch((e) => {});
    }
  };
  return (
    <div className="textContainer">
      <p>
        {/* <SplitText
          copy="Connect your wallet. Your journey will start."
          role="heading"
        /> */}
        <img style = {{width : "60%", height : "5%"}} src = {require('../assets/Group 131.png')} />
        {/* <span className="bar">__</span> */}
      </p>

      <button className="connect-wallet-button" onClick={connectWalletHandler}>
        <span style = {{marginRight:"4px"}}><img src = {require("../assets/wallet.png")}/></span>CONNECT YOUR WALLET
      </button>
    </div>
  );
};

export default TextComponent;
