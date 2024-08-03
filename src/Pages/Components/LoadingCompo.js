import React, { useEffect } from "react";
import anime from "animejs/lib/anime.es.js";
import "../css/Loading.css";

const LoadingScreen = () => {
  useEffect(() => {
    anime({
      targets: ".loading-circle",
      strokeDashoffset: [anime.setDashoffset, 0],
      easing: "easeInOutSine",
      duration: 1500,
      delay: (el, i) => i * 250,
      direction: "alternate",
      loop: true,
    });
  }, []);

  return (
    <div className="loading-container">
      <svg className="loading-circle" viewBox="0 0 50 50">
        <circle
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke="#2ecc71"
          strokeWidth="4"
        />
      </svg>
    </div>
  );
};

export default LoadingScreen;
