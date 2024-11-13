import { useEffect, useState } from "react";
import { useUser } from '../../context/UserContext';
import axios from 'axios';
import {projectStore} from '../../store';


const API_URL = process.env.REACT_APP_API_URL;

const ProjectImformation = () => {
    // clickProjectName -> 클릭한 프로젝트 이름
    // const [managerUser, setManagerUser] = useState([]); // 가져온 담당자의 정보를 담 // 일단 사진 빼고..
    const [projectTitle, setProjectTitle] = useState();
    const [managerEmail, setManagerEmail] = useState();
    const [managerName, setManagerName] = useState();
    const [getUserId, setGetUserId] = useState(null);
    const [managerPosition, setManagerPosition] = useState();
    const {projectName} = projectStore();
    console.log("ProjectHome zustand : " + projectName);
    console.log("ProjectHome 불러온 title : " + projectTitle);

    
    useEffect(() => {
        Send();  // projectName 으로 프로젝트 정보 조회
        if(getUserId !== null){
            manager(); // 프로젝트 생성자 Id 로 유저 정보 조회
        }
       
        
    }, [{projectName}]);

    function manager(){ // 유저 정보 조회 
        axios({
            url: `${API_URL}/api/user/projects/projecthomeusers`,
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
            method: 'post',
            params: { getUserId },
            baseURL: 'http://localhost:8080',
            withCredentials: true,
        }).then(function(response) {
            // setManagerUser(response);
            console.log("ProjectHome의 username : " + response.data.username);
            console.log("ProjectHome email : " + response.data.email);
            setManagerEmail(response.data.email);
            setManagerName( response.data.username);
            setManagerPosition(response.data.position);
          
        });
    }

    function Send() { // 프로젝트 정보 반환
        axios({
            url: `${API_URL}/api/user/projects/projectselect`,
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
            method: 'post',
            params: { projectName },
            baseURL: 'http://localhost:8080',
            withCredentials: true,
        }).then(function(response) {
            console.log(response);
            console.log(response.data[0]);
            console.log(response.data[0].projectName);
            setProjectTitle(response.data[0].projectName);
            setGetUserId(response.data[0].cretedBy);
        
            console.log("가져온 만든사람 : "  + response.data[0].id)
            console.log("가져온 관리자 유저 아이디 :: " + response.data[0].createdBy);
        });
    }
    

    // 담당자 id 로 이름 조회 다시 해야댐 
    return(
        <>
        <h3>프로젝트 이름 :{projectName}</h3>
        <h3>담당자 : {managerName}</h3>
        <h3>{managerEmail}{managerPosition}</h3> 
        </>
    )

}
export default ProjectImformation;