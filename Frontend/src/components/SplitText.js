import React from "react";

const SplitText = (props) => {
  return (
    <span aria-label={props.copy} role={props.role}>
      {props.copy.split("").map(function (char, index) {
        let style = {
          animationDelay: 0 + index / 10 + "s",
        };
        return (
          <span aria-hidden="true" key={index} style={style}>
            {char}
          </span>
        );
      })}
    </span>
  );
};

export default SplitText;
