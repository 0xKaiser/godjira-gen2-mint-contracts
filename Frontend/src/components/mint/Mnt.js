import React, { useEffect, useState } from "react";
import { Progress } from "react-sweet-progress";
import "react-sweet-progress/lib/style.css";
import "./mint.css";
import { percentage } from "./../Percentage";
import ethereum from "../../assets/ethereum.png";
import {
  totalSupply,
  presaleLive,
  maxCount,
  saleLive,
  mainsaleValue,
  presaleValue,
  whitelistCheck,
  presaleBuy,
} from "../../Contractor/SmapleCourt";

import angry from "../../assets/angry.png";
import RingLoader from "react-spinners/RingLoader";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { buy } from "./../../Contractor/SmapleCourt";

const Mint = (props) => {
  const [count, setCount] = useState(1);
  const [available, setAvailable] = useState(" ");
  const [preSaleBool, setPreSaleBool] = useState(true);
  const [preSaleValue, setpreSaleValue] = useState(0.061);
  const [max, setMax] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainSaleBool, setMainSaleBool] = useState(false);
  const [mainSaleValue, setMainSaleValue] = useState(0.061);
  const [whitelistMessage, setWhiteListMessage] = useState("");
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    totalSupply().then((e) => {
      setAvailable(e);
    });
    presaleLive().then((e) => {
      setPreSaleBool(e);
    });
    presaleValue().then((e) => {
      const dec = e;
      setpreSaleValue((prev) => (dec === 0 ? prev : dec));
    });
    maxCount().then((e) => {
      const dec = parseInt(e._hex, 16);
      setMax(dec);
      setLoading(false);
    });
    saleLive().then((e) => {
      setMainSaleBool(e);
    });
    mainsaleValue().then((e) => {
      const dec = e;
      setMainSaleValue((prev) => (dec === 0 ? prev : dec));
    });
  }, []);
  useEffect(() => {
    if (refresh) {
      totalSupply().then((e) => {
        setAvailable(e);
      });
      setRefresh(false);
    }
  }, [refresh]);
  useEffect(() => {
    if (preSaleBool) {
      whitelistCheck().then((e) => {
        setWhiteListMessage(e);
      });
    }
  }, [preSaleBool]);

  const decreaseCount = () => {
    if (count > 1) {
      setCount((prev) => prev - 1);
    }
  };
  const increaseCount = () => {
    if (count < 2) {
      setCount((prev) => prev + 1);
    }
  };
  return (
    <div className="mint" style={{ padding: loading ? "" : "40px" }}>
      {loading ? (
        <div className="loading">
          <RingLoader color="#FF1700" loading={true} size={50} />
        </div>
      ) : (
        <>
          <Progress
            percent={100 - Math.floor(percentage(max, available))}
            strokeWidth={15}
            status="error"
            theme={{
              error: {
                symbol: " ",
                color: "green",
              },
            }}
          />
          <h2 className="available">
            {max - available} of {max} available
          </h2>
          {preSaleBool &&
            (whitelistMessage ? (
              <h2>You are in whitelist</h2>
            ) : whitelistMessage === null ? (
              <h2>You are not in whitelist</h2>
            ) : null)}

          <div className="mint-container">
            <section className="sample-container">
              <img src={angry} className="sample" />
            </section>
            <section className="mint-content">
              <div className="mint-add">
                <p className="sale">
                  {preSaleBool && "Pre Sale"}
                  {!preSaleBool && mainSaleBool && "Main Sale"}
                </p>
                <div className="mint-add-content">
                  <img src={ethereum} className="ethereum" />
                  <p
                    className="ethereum-value"
                    style={{ fontSize: "30px", textTransform: "capitalize" }}
                  >
                    {preSaleBool && preSaleValue
                      ? preSaleValue
                      : !preSaleBool && mainSaleBool && mainSaleValue
                      ? mainSaleValue
                      : 0}
                    /mint
                  </p>
                </div>
                <div className="addButtons">
                  <button className="addButton" onClick={decreaseCount}>
                    -
                  </button>
                  <h4>{count}</h4>
                  <button className="addButton" onClick={increaseCount}>
                    +
                  </button>
                </div>
              </div>
              {/* //////////////////// */}
              <div className="mint-total">
                <div className="mint-add-content">
                  <img src={ethereum} className="ethereum ethereum-1" />
                  <p
                    className="ethereum-value"
                    style={{ fontSize: "40px", textTransform: "capitalize" }}
                  >
                    {preSaleBool && preSaleValue
                      ? preSaleValue * count
                      : !preSaleBool && mainSaleBool && mainSaleValue
                      ? mainSaleValue * count
                      : 0}
                    /Total
                  </p>
                </div>
                <button
                  disabled={
                    (preSaleBool && !whitelistMessage) ||
                    (!preSaleBool && !mainSaleBool)
                  }
                  className={
                    (preSaleBool && !whitelistMessage && "disable") ||
                    (!preSaleBool && !mainSaleBool && "disable")
                  }
                  onClick={() => {
                    if (preSaleBool) {
                      presaleBuy(
                        preSaleValue,
                        whitelistMessage,
                        count,
                        setRefresh
                      );
                    } else {
                      buy(mainSaleValue, count, setRefresh);
                    }
                  }}
                >
                  MINT
                </button>
                <ToastContainer />
              </div>
            </section>
          </div>
        </>
      )}
    </div>
  );
};

export default Mint;
