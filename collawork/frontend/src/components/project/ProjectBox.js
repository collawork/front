import React, { useState, useEffect } from "react";
import { projectStore } from "../../store";
import axios from "axios";
import { useUser } from '../../context/UserContext';

const API_URL = process.env.REACT_APP_API_URL;

const ProgressBar = () => {
  const [percentage, setPercentage] = useState(0); // Default percentage
  const [isEditing, setIsEditing] = useState(false); // Track editing state
  const { projectData } = projectStore();
  const { userId } = useUser();
  const [percent, setPercent] = useState(0); // Initialize percent state with 0

  // Fetch initial percentage value when projectData.id changes
  useEffect(() => {
    if (projectData.id) {
      findPercentage(); // Fetch percentage whenever projectData.id changes
    }
  }, [projectData.id]); // Dependency on projectData.id

  // 프로젝트 진행률 조회
  function findPercentage() {
    console.log("진행률 조회:: " + projectData.id);
    const token = localStorage.getItem("token");
    axios({
      url: `${API_URL}/api/user/projects/findPercentage`,
      headers: { Authorization: `Bearer ${token}` },
      method: "post",
      params: { projectId: projectData.id },
      baseURL: "http://localhost:8080",
    })
      .then((response) => {
        const newPercent = response.data.percent || 0; // Fallback to 0 if percent is null
        setPercent(newPercent); // Set percent state
        setPercentage(newPercent); // Update percentage state
        console.log("Percentage from DB: ", newPercent);
      })
      .catch((err) => console.error("프로젝트 진행률 조회 중 오류:", err));
  }

  // Save progress changes to the database
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
        setIsEditing(false); // Exit editing mode
        findPercentage(); // Refresh percentage from the database
        alert("프로젝트 진행률이 저장되었습니다.!");
      })
      .catch((err) => console.error("프로젝트 진행률 업데이트 중 오류:", err));
  }

  const handleClick = (event) => {
    if (!isEditing) return; // Ignore clicks if not in editing mode

    const rect = event.currentTarget.getBoundingClientRect();
    const clickX = event.clientX - rect.left; // Get click position
    const newPercentage = Math.round((clickX / rect.width) * 100); // Calculate percentage
    setPercentage(newPercentage); // Temporarily update percentage locally
  };

  const milestones = [0, 25, 50, 75, 100];

  return (
    <div style={{ textAlign: "center", margin: "20px", display: "inline-block" }}>
      <h4>프로젝트 진행률 :</h4>
      <div style={{ fontSize: "24px", marginBottom: "10px" }}>{percentage}%</div>
      <div
        style={{
          width: "300%",
          maxWidth: "500px",
          height: "27px",
          backgroundColor: "#black",
          borderRadius: "10px",
          position: "relative",
          cursor: isEditing ? "pointer" : "not-allowed", // Allow editing only if isEditing is true
          margin: "0 auto",
        }}
        onClick={isEditing ? handleClick : null} // Only allow clicks in editing mode
      >
        <div
          style={{
            width: `${percentage}%`,
            height: "100%",
            backgroundColor: "black",
            borderRadius: "10px",
            position: "absolute",
            top: 0,
            left: 0,
          }}
        ></div>
        {milestones.map((milestone) => (
          <div
            key={milestone}
            style={{
              position: "absolute",
              top: "50%",
              left: `${milestone}%`,
              transform: "translate(-50%, -50%)",
              width: "14px",
              height: "14px",
              borderRadius: "50%",
              backgroundColor: percentage >= milestone ? "#black" : "#ccc",
              border: "2px solid #gray",
            }}
          ></div>
        ))}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          maxWidth: "500px",
          margin: "10px auto",
          fontSize: "20px",
          color: "white",
        }}
      >
        <span>0%</span>
        <span>25%</span>
        <span>50%</span>
        <span>75%</span>
        <span>100%</span>
      </div>
      <div style={{ marginTop: "20px" }}>
        {!isEditing ? (
          <button
            onClick={() => {
              if (String(userId) !== String(projectData.createdBy)) {
                alert("프로젝트 진행률은 관리자만 수정할 수 있습니다.");
                return;
              }
              setIsEditing(true);
            }}
            style={{
              padding: "10px 20px",
              backgroundColor: "blue",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            변경하기
          </button>
        ) : (
          <button
            onClick={saveChanges} 
            style={{
              padding: "10px 20px",
              backgroundColor: "green",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            저장
          </button>
        )}
      </div>
    </div>
  );
};

export default ProgressBar;
