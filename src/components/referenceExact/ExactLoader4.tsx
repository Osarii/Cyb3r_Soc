import React from 'react';
import styled from 'styled-components';

const ExactLoader4 = () => {
  return (
    <StyledWrapper>
      <div className="loader-container">
        <div className="loader-3d">
          <div className="loader-inner">
            <div className="loader-face loader-face-front" />
            <div className="loader-face loader-face-back" />
            <div className="loader-face loader-face-right" />
            <div className="loader-face loader-face-left" />
            <div className="loader-face loader-face-top" />
            <div className="loader-face loader-face-bottom" />
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .loader-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 900px;
    perspective: 500px;
  }

  .loader-3d {
    width: 40px;
    height: 40px;
    position: relative;
    transform-style: preserve-3d;
    animation: rotate-3d 6s infinite linear;
  }

  .loader-inner {
    width: 100%;
    height: 100%;
    position: relative;
    transform-style: preserve-3d;
    animation: pulse 1.5s infinite ease-in-out alternate;
  }

  .loader-face {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0.9;
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 0 8px rgba(100, 200, 255, 0.4);
  }

  .loader-face-front {
    background: linear-gradient(45deg, #ff3366, #ff3366 50%, transparent 50%),
      linear-gradient(-45deg, #8844ee, #8844ee 50%, transparent 50%);
    background-size: 10px 10px;
    transform: translateZ(20px);
  }

  .loader-face-back {
    background: repeating-linear-gradient(
        0deg,
        #00ffcc,
        #00ffcc 3px,
        transparent 3px,
        transparent 6px
      ),
      repeating-linear-gradient(
        90deg,
        #00ffcc,
        #00ffcc 3px,
        transparent 3px,
        transparent 6px
      );
    transform: rotateY(180deg) translateZ(20px);
  }

  .loader-face-right {
    background: radial-gradient(circle, #ffcc00 20%, transparent 20%),
      radial-gradient(circle, transparent 20%, #ffcc00 20%, transparent 30%);
    background-size: 15px 15px;
    background-position:
      0 0,
      7px 7px;
    transform: rotateY(90deg) translateZ(20px);
  }

  .loader-face-left {
    background: linear-gradient(135deg, #ff0066 25%, transparent 25%),
      linear-gradient(225deg, #ff0066 25%, transparent 25%),
      linear-gradient(315deg, #ff0066 25%, transparent 25%),
      linear-gradient(45deg, #ff0066 25%, transparent 25%);
    background-size: 10px 10px;
    transform: rotateY(-90deg) translateZ(20px);
  }

  .loader-face-top {
    background: conic-gradient(
      from 90deg at 50% 50%,
      #00ff99,
      #9900ff,
      #ff0099,
      #00ff99
    );
    transform: rotateX(90deg) translateZ(20px);
  }

  .loader-face-bottom {
    background: repeating-linear-gradient(
      45deg,
      #ff6600,
      #ff6600 5px,
      #ffcc00 5px,
      #ffcc00 10px
    );
    transform: rotateX(-90deg) translateZ(20px);
  }

  @keyframes rotate-3d {
    0% {
      transform: rotateX(0) rotateY(0) rotateZ(0);
    }
    100% {
      transform: rotateX(360deg) rotateY(720deg) rotateZ(360deg);
    }
  }

  @keyframes pulse {
    0% {
      transform: scale3d(0.8, 0.8, 0.8);
    }
    100% {
      transform: scale3d(1.1, 1.1, 1.1);
    }
  }`;

export default ExactLoader4;

