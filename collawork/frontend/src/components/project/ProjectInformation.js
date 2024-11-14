import { useEffect, useState } from "react";
import { useUser } from '../../context/UserContext';
import axios from 'axios';
import {projectStore} from '../../store';


const API_URL = process.env.REACT_APP_API_URL;

const ProjectImformation = () => {

    const [show, setShow] = useState(false);

     // const [projectData, setProjectData] = useState([]); // 프로젝트 정보 데이터
   //  const [userData, setUserData] = useState([]); // 유저 정보 데이터
    // const PlusProjectCreatedBy = projectStore(state => state.PlusProjectCreatedBy);
    const {projectName,projectData,userData, PlusProjectData, PlusUserData} = projectStore();
    // 프로젝트 정보와 유저 정보 확인
    // const [isProjectLoaded, setIsProjectLoaded] = useState(false);


    useEffect(() => {
       if(projectName){
        Send();  // 1. projectName 으로 프로젝트 정보 조회
        
        setShow(true);
       
       }

    }, [projectName]);

    useEffect(() => {
        if (projectData.createdBy) {
          manager(); // 프로젝트 데이터의 createdBy가 있을 때만 유저 정보 조회
        }
      }, [projectData]); // projectData가 업데이트될 때마다 실행
   

    function Send(){ // 프로젝트 정보 조회
        const token = localStorage.getItem('token');
      
        axios({
            url: `${API_URL}/api/user/projects/projectselect`,
            headers: { 'Authorization': `Bearer ${token}` },
            method: 'post',
            params: { projectName },
            baseURL: 'http://localhost:8080',
        }).then(function(response) {

            PlusProjectData(response.data[0]);
            // setIsProjectLoaded(true);
            if(!response.data[0]){
                Send();
            }
            console.log(response);
        });
        console.log("projectData : " + projectData);
        console.log("projectData.createdBy : " + projectData.createdBy);
    }

    function manager(){ // 유저 정보 조회  // 유저정보에서 첫 실행할 때 오류남
        const token = localStorage.getItem('token');
        console.log(projectData.id);
        if(!projectData){
            Send();
        }
    
        axios({
            url: `${API_URL}/api/user/projects/projecthomeusers`,
            headers: { 'Authorization': `Bearer ${token}` },
            method: 'post',
            params: { id : projectData.createdBy },
            baseURL: 'http://localhost:8080',
        }).then(function(response) {

            console.log(response);
            PlusUserData(response.data);
           
          
        });
    }
    
    return (
        <>
       {show && (
        <div>
        <h3>프로젝트 이름 : {projectData.projectName}</h3>
        <h5>- {projectData.projectCode}</h5>
        <h3>담당자 이름 : {userData.username}</h3> 
        <h3>직급 : {userData.position}</h3>
        <h3>이메일: {userData.email}</h3>
        <h6>{projectData.createdAt}</h6>
        </div>
        )} 
        </>
    )


}
export default ProjectImformation;