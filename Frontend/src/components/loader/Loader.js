import React, { lazy } from "react";
import SplitText from "../SplitText";
import "./Loader.css";
// import PacmanLoader from "react-spinners/PacmanLoader";
import angry from "../../assets/angry.png";

const Loader = () => {
  return (
    <div className="loader">
      {/* <PacmanLoader color="#3E8E7E" loading={true} size={50} /> */}
      <img src={angry} alt="angry" className="loader-image" />
      <p style={{ marginLeft: "50px" }}>
        <SplitText copy="Welcome to The Tribe" role="heading" />
        <span
          className="bar"
          style={{
            animation: "display 1s forwards infinite",
            animationDelay: "1s",
          }}
        >
          __
        </span>
      </p>
    </div>
  );
};

export default Loader;
