import React, { useEffect, useState } from 'react';

const WaveAnimation = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Small delay to ensure smooth initial render
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="wave-container">
      <div className="wave"></div>
      <div className={`boat ${isVisible ? 'visible' : 'hidden'}`}>
        <img src="/boat.png" alt="boat" />
      </div>
      <style jsx>{`
        .wave-container {
          position: fixed;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 100px;
          overflow: visible;
        }
        .wave {
          background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 88.7'%3E%3Cpath d='M800 56.9c-155.5 0-204.9-50-405.5-49.9-200 0-250 49.9-394.5 49.9v31.8h800v-.2-31.6z' fill='%2300B4D8'/%3E%3C/svg%3E");
          position: absolute;
          width: 200%;
          height: 100%;
          background-repeat: repeat-x;
          background-position: 0 bottom;
          transform-origin: center bottom;
          animation: wave 15s linear infinite;
          z-index: 1;
        }
        .boat img {
          width: 100px;
          height: auto;
          transform: translateY(0);
        }
        .boat {
          position: absolute;
          bottom: 60px;
          left: -100px;
          animation: sail 13s linear infinite, bob 3s linear infinite;
          z-index: 2;
          opacity: 0;
          transition: opacity 0.3s ease-in-out;
        }
        .boat.visible {
          opacity: 1;
        }
        .boat.hidden {
          opacity: 0;
        }
        @keyframes wave {
          0% {
            transform: translateX(0) translateZ(0) scaleY(1);
          }
          50% {
            transform: translateX(-25%) translateZ(0) scaleY(0.8);
          }
          100% {
            transform: translateX(-50%) translateZ(0) scaleY(1);
          }
        }

        @keyframes sail {
          0% { left: -100px; }
          100% { left: 100%; }
        }

        @keyframes bob {
            0%, 100% {
                transform: translateY(35px);
            }
            25% {
                transform: translateY(45px);
            }
            50% {
                transform: translateY(55px);
            }
        }
      `}</style>
    </div>
  );
};

export default WaveAnimation;