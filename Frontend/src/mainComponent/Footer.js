import React from "react";
import "./Footer.css";
import opensea from "../assets/opensea.png";
import medium from "../assets/medium.png";
import twitter from "../assets/twitter.png";

const links = [
  { src: twitter, name: "Twitter" },
  { src: medium, name: "Medium" },
  { src: opensea, name: "Opensea" },
];
const Footer = () => {
  return (
    <>
      <div className="footer">
        <ul>
          {links.map((item, i) => (
            <li className="element" key={i}>
              <img
                src={item.src}
                alt=""
                className="opensea"
                style={{
                  width: item.name === "Medium" ? "43px" : "35px",
                  height: item.name === "Medium" ? "43px" : "35px",
                }}
                title={item.name}
              />
            </li>
          ))}
        </ul>
      </div>
      <h2 className="text">Music: Hiraeth by Scott Buckley</h2>
    </>
  );
};

export default Footer;
