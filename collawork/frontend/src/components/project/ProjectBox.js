import React, { useState, useEffect, useRef } from "react";
// import '../../components/assest/css/ProjectBox.css';

const App = () => {
  const circle = useRef(null);
  const box = useRef(null);
  const [con, setCon] = useState(null);
  const [cir, setCir] = useState(null);
  const [num, setNum] = useState(null);
  const h1 = useRef(null);

  useEffect(() => {
    const conWidth = box.current.getBoundingClientRect().width;
    setCon(conWidth);
    const circleWidth = circle.current.getBoundingClientRect().width;
    setCir(circleWidth);
  }, []);

  let isDragging = null;
  let originX = null;
  let originLeft = null;
  let result;

  const drag = (e) => {
    isDragging = true;
    originX = e.clientX;
    originLeft = circle.current.offsetWidth;
  };

  const move = (e) => {
    if (isDragging) {
      const diffX = e.clientX - originX;
      const endX = con - cir;
      circle.current.style.width = `${Math.min(
        Math.max(0, originLeft + diffX),
        endX
      )}px`;
    }
  };

  const stop = () => {
    isDragging = false;
  };

  const getPercent = () => {
    result = parseInt(circle.current.offsetWidth / 3.49);
    setNum(result);
    h1.current.innerText = result + "%";
  };

  const init = (e) => {
    const endX = con - cir;
    circle.current.style.width = `${Math.min(
      Math.max(0, e.clientX - e.currentTarget.offsetLeft),
      endX
    )}px`;
  };

  return (
    <div className="container">
  {/* 퍼센트 표시 */}
  <div className="percent">
    <h1 ref={h1}>0%</h1>
  </div>

  {/* 슬라이더 바 */}
  <div
    className="bar"
    onMouseMove={(e) => {
      move(e);
      getPercent(e);
    }}
    ref={box}
    onMouseUp={(e) => {
      stop(e);
      init(e);
    }}
    onMouseLeave={(e) => {
      stop(e);
    }}
  >
    {/* 진행 바 */}
    <span className="progress" ref={circle} onMouseDown={(e) => drag(e)}></span>

    {/* 원(마커) */}
    <div className="circles">
      {[0, 25, 50, 75, 100].map((el, index) => (
        <span key={index} className={num >= el ? "on" : ""}></span>
      ))}
    </div>
  </div>

  <div className="progress-container">
  <div className="progress-header">
    <h2>프로젝트 진행률</h2>
  </div>
  <div className="progress-content">
    <h1 ref={h1} className="progress-text">45%</h1>
    <div className="progress-bar">
      <span className="bar" ref={box}>
        <span className="progress" ref={circle}></span>
        <div className="num">
          {[0, 25, 50, 75, 100].map((el, index) => (
            <span key={index}>{el}%</span>
          ))}
        </div>
      </span>
    </div>
  </div>
</div>
</div>

  );
};

export default App;
