import React, { useState, useEffect } from "react";
import { projectStore } from "../../store";
import axios from "axios";
import { useUser } from "../../context/UserContext";

const API_URL = process.env.REACT_APP_API_URL;

const ProgressBar = () => {
  const [percentage, setPercentage] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const { projectData } = projectStore();
  const { userId } = useUser();

  useEffect(() => {
    if (projectData.id) {
      findPercentage();
    }
  }, [projectData.id]);


  function findPercentage() {
    const token = localStorage.getItem("token");
    axios({
      url: `${API_URL}/api/user/projects/findPercentage`,
      headers: { Authorization: `Bearer ${token}` },
      method: "post",
      params: { projectId: projectData.id },
      baseURL: "http://localhost:8080",
    })
      .then((response) => {
        const newPercent = response.data.percent || 0;
        setPercentage(newPercent);
      })
      .catch((err) => console.error("투표 진행률 조회 중 error:", err));
  }

  function saveChanges() {
    const token = localStorage.getItem("token");
    axios({
      url: `${API_URL}/api/user/projects/ingSend`,
      headers: { Authorization: `Bearer ${token}` },
      method: "post",
      params: { projectId: projectData.id, state: percentage },
      baseURL: "http://localhost:8080",
    })
      .then(() => {
        alert("프로젝트 진행률이 저장되었습니다 !");
        setIsEditing(false);
      })
      .catch((err) => console.error("투표 진행률 저장 중 error:", err));
  }

 
  const handleMouseDown = () => {
    if (isEditing) setIsDragging(true);
  };

  const handleMouseUp = () => {
    if (isEditing) setIsDragging(false);
  };

  const handleMouseMove = (event) => {
    if (!isDragging || !isEditing) return;

    const bar = document.getElementById("progress-bar");
    const rect = bar.getBoundingClientRect();
    const mouseX = event.clientX - rect.left; 
    const newPercentage = Math.max(0, Math.min(100, (mouseX / rect.width) * 100)); 
    setPercentage(Math.round(newPercentage));
  };

  return (
    <div
      style={{
        margin: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          maxWidth: "500px",
          marginBottom: "10px",
        }}
      >
        <h4 style={{ margin: 0 ,  marginLeft:"200px" }}>진행률:</h4>
        <div style={{ fontSize: "24px", margin: "0 10px",marginRight:"160px" }}>{percentage}%</div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "521px",
          maxWidth: "540px",
          marginLeft:"250px",
        }}
      >
        <div
          id="progress-bar"
          style={{
            flex: 1,
            height: "10px",
            backgroundColor: "#ccc",
            borderRadius: "5px",
            position: "relative",
            marginRight: "10px",
            cursor: isEditing ? "pointer" : "not-allowed",
          }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseUp}
          onMouseUp={handleMouseUp}
          onClick={(e) => {
            if (!isEditing) {
              alert("Click the Change button to edit the progress bar.");
            }
          }}
        >
          <div
            style={{
              width: `${percentage}%`,
              height: "100%",
              backgroundColor: isEditing ? "black" : "#888",
              borderRadius: "5px",
              position: "absolute",
              top: 0,
              left: 0,
            }}
          ></div>
          <div
            onMouseDown={handleMouseDown}
            style={{
              position: "absolute",
              top: "50%",
              left: `${percentage}%`,
              transform: "translate(-50%, -50%)",
              width: "20px",
              height: "20px",
              borderRadius: "50%",
              backgroundColor: isEditing ? "white" : "black",
              border: "2px solid black",
              cursor: isEditing ? "red" : "not-allowed",
            }}
          ></div>
        </div>
        <div style={{ marginLeft: "10px" }}>
  {!isEditing ? (
    <button
      onClick={() => {
        if (String(userId) !== String(projectData.createdBy)) {
          alert("Only the administrator can edit the progress.");
          return;
        }
        setIsEditing(true);
      }}
      disabled={String(userId) !== String(projectData.createdBy)} // Disable button if not creator
      style={{
        padding: "10px 20px",
        backgroundColor: String(userId) !== String(projectData.createdBy) ? "gray" : "blue", // Change color when disabled
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: String(userId) !== String(projectData.createdBy) ? "not-allowed" : "pointer",
      }}
    >
      수정
    </button>
  ) : (
    <>
      <button
        onClick={saveChanges}
        style={{
          padding: "10px 20px",
          backgroundColor: "green",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          marginRight: "10px",
        }}
      >
        저장
      </button>
      <button
        onClick={() => {
          setIsEditing(false);
          findPercentage();
        }}
        style={{
          padding: "10px 20px",
          backgroundColor: "red",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        취소
      </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
