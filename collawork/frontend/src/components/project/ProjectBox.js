import React, { useState, useEffect, useRef } from "react";

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
      {/* Percent Display */}
      <div className="percent">
        <h1 ref={h1}>0%</h1>
      </div>

      {/* Bar and Progress */}
      <div>
        <span
          className="bar"
          ref={box}
          onMouseMove={(e) => {
            move(e);
            getPercent(e);
          }}
          onMouseUp={(e) => {
            stop(e);
            init(e);
          }}
          onMouseLeave={() => {
            stop();
          }}
        >
          {/* Circles */}
          <div className="circles">
            {[0, 25, 50, 75, 100].map((el, index) => (
              <span key={index} className={num >= el ? "on" : ""}></span>
            ))}
          </div>

          {/* Draggable Progress Handle */}
          <span
            className="progress"
            onMouseDown={(e) => drag(e)}
            ref={circle}
          ></span>

          {/* Percent Labels */}
          <div className="num">
            {[0, 25, 50, 75, 100].map((el, index) => (
              <span key={index} className={"percent" + index}>
                {el}%
              </span>
            ))}
          </div>
        </span>
      </div>
    </div>
  );
};

export default App;
