import React, { useState, useEffect } from "react";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import VolumeMuteIcon from "@mui/icons-material/VolumeMute";
import Parallax from "../components/parallax/Parallax";
import parallax from "./../components/parallax";
import song from "../assets/web_background_music.mp3";
import "./Main.css";
import Footer from "./Footer";
import angry from "../assets/PROJECT GODJIRA.png";
import TextComponent from "./../components/TextComponent";

const Main = (props) => {
  const [play, setPlay] = useState(false);
  const [showMint, setShowMint] = useState(false);
  const [address, setAddress] = useState("");
  useEffect(() => {
    parallax();
  }, []);
  const showMintHandler = (wallet) => {
    setShowMint(true);
    setAddress(wallet);
  };
  const playAudio = (type) => {
    const audio = document.getElementById("playAudio");
    if (type === "start") {
      audio.play();
      setPlay(true);
    } else {
      audio.pause();
      setPlay(false);
    }
  };

  return (
    <div id="parallax">
      <Parallax />
      <img style = {{width : "35%", height : "14%", marginTop: "3%", marginLeft:"32%"}} src = {require('../assets/Project Godjira@2x.png')} />
      <div className="container">
        {play ? (
          <VolumeMuteIcon className="mute" onClick={() => playAudio("stop")} />
        ) : (
          <VolumeOffIcon className="mute" onClick={() => playAudio("start")} />
        )}

        <audio id="playAudio">
          <source src={song} />
        </audio>
        <TextComponent/>
      </div>
      <Footer />
    </div>
  );
};

export default Main;
