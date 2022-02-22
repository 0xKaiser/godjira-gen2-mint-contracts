import React from "react";
import "./Footer.css";
import opensea from "../assets/Group 148.png";
import twitter from "../assets/twitter.png";

const links = [
  { src: twitter, url:"https://twitter.com/PGodjira", name: "Twitter" },
  { src: opensea, url:"https://opensea.io/collection/projectgodjiragenesis", name: "Opensea" },
];
const Footer = () => {
  return (
    <>
      <div className="footer">
        <ul>
          {links.map((item, i) => (
            <li className="element" key={i}>
              <a className="link" href={item.url} target="_blank">
                  <img
                    src={item.src}
                    alt=""
                    style={{
                      width: "28px",
                      height: "28px",
                    }}
                    title={item.name}
                  />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Footer;
