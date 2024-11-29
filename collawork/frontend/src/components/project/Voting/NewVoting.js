import React, { useRef, useState } from "react";
import ReactModal from "react-modal";
import axios from "axios";
import { projectStore } from "../../../store";
import { useUser } from "../../../context/UserContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faXmark,faClockRotateLeft,faCalendar,faUser} from "@fortawesome/free-solid-svg-icons";


const API_URL = process.env.REACT_APP_API_URL;

const Voting = ({
  updateVotingList,
  setModalShow,
  modalShow,
  setUpdateList,
}) => {
  const [title, setTitle] = useState(""); // 투표 제목
  const [detail, setDetail] = useState(""); // 투표 설명
  const [dateShow, setDateShow] = useState(false); // 날짜 입력 창 show
  const [selectedOption, setSelectedOption] = useState(null); // 투표 옵션
  const nextID = useRef(1);
  const { projectData } = projectStore();
  const { userId } = useUser();
  const [inputDate, setInputDate] = useState(); // 입력받을 마감일

  const [inputItems, setInputItems] = useState([{ id: 0, voteOption: "" }]); // 투표 항목
  let arr = [];

  // 투표 항목 추가
  const addInput = () => {
    const input = { id: nextID.current, voteOption: "" };
    setInputItems([...inputItems, input]);
    nextID.current += 1;
  };

  // 투표 항목 삭제
  const deleteInput = (index) => {
    setInputItems(inputItems.filter((item) => item.id !== index));
  };

  // 투표 항목 수정
  const handleChange = (e, index) => {
    const updatedItems = [...inputItems];
    updatedItems[index].voteOption = e.target.value;
    setInputItems(updatedItems);
  };

  // 모달 초기화
  const resetModalState = () => {
    setTitle("");
    setDetail("");
    setInputItems([{ id: 0, voteOption: "" }]);
    nextID.current = 1;
    setSelectedOption(null);
    setDateShow(false);
  };

  // 투표 생성 API
  const send = async () => {
    const token = localStorage.getItem("token");
    const userIdValue = userId?.userId || userId;

    try {
      const response = await axios.post(
        `${API_URL}/api/user/projects/newvoting`,
        {
          votingName: title,
          projectId: String(projectData.id),
          createdUser: String(userIdValue),
          detail: detail,
          contents: arr,
          inputDate:inputDate? inputDate : null
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data[0]);
      console.log(response.data);
    } catch (error) {
      console.error("Error during API request:", error.response || error.message);
    }
  };

  // 투표 생성 처리
  const handleSubmit = async (e) => {
    e.preventDefault();
    arr = inputItems.map((item) => item.voteOption);
    console.log("입력받은 날짜 : " + inputDate);

    try {
      await send(); // API 호출
      updateVotingList(); // 부모 컴포넌트의 상태 업데이트
      resetModalState(); // 상태 초기화
      setModalShow(false); // 모달 닫기
      alert("투표가 생성되었습니다!");
    } catch (error) {
      console.error("Error during voting creation:", error);
    }
  };

  // 모달 취소 처리
  const cancelHandler = () => {
    resetModalState();
    setModalShow(false);
  };

  return (
    <>
      <ReactModal
        isOpen={modalShow}
        closeModal={cancelHandler}
        contentLabel="new voting modal"
        appElement={document.getElementById("root")}
        style={{
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            borderRadius: 0,
            border: "none",
            padding: "42px",
          
          },
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.75)",
          },
        }}
      >
         <button
        onClick={cancelHandler}
        style={{
          position: "absolute",
          top: "10px", 
          right: "10px",
          fontSize: "2rem", 
          fontWeight: "bold", 
          background: "none",
          border: "none",
          cursor: "pointer",
        }}
      >
        <FontAwesomeIcon icon={faXmark} />
      </button>
        <form onSubmit={handleSubmit}>
          <input
            placeholder="제목을 입력하세요."
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <input
            placeholder="투표에 관한 설명 입력 (옵션)"
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            required
          />
          <br />
          <br />
          {inputItems.map((item, index) => (
            <div key={index}>
              <label>
                항목 {index + 1}
                <input
                  type="text"
                  value={item.voteOption}
                  onChange={(e) => handleChange(e, index)}
                />
                {index === 0 && inputItems.length < 30 && (
                  <button type="button" onClick={addInput}>
                    +
                  </button>
                )}
                {index > 0 && (
                  <button type="button" onClick={() => deleteInput(item.id)}>
                    -
                  </button>
                )}
              </label>
            </div>
          ))}
          <div className="radio-group" >
            <br/>
            <br/>
            <label><FontAwesomeIcon icon={faClockRotateLeft} />   투표 마감일</label>
            <div>
            <br/>
              <input
                className="radio-item"
                type="radio"
                value={1}
                checked={selectedOption === 1}
                onChange={() => {
                  setSelectedOption(1);
                  setDateShow(true);
                }}
              />
              <label><FontAwesomeIcon icon={faCalendar} />   날짜 지정</label>
              <h5 style={{color:"gray"}}>   마감일에 자동으로 투표가 종료됩니다.</h5>
              {dateShow && (
            <input
            type="date"
           value={inputDate}
           onChange={(e) => setInputDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]} 
          />)}
              <input
                className="radio-item"
                type="radio"
                value={2}
                checked={selectedOption === 2}
                onChange={() => {
                  setSelectedOption(2);
                  setDateShow(false);
                }}
              />
              <label><FontAwesomeIcon icon={faUser} /> 사용자 별도 지정</label>
              <h5 style={{color:"gray"}}>  투표 생성자가 종료버튼을 눌러야 종료됩니다.</h5>
            </div>

          </div>
          <br />
          <br />
          <button type="submit">저장</button>
        </form>
      </ReactModal>
    </>
  );
};

export default Voting;
