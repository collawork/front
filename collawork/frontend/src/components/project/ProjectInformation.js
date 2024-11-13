import { useEffect, useState } from "react";
import { useUser } from '../../context/UserContext';
import axios from 'axios';
import {projectStore} from '../../store';


const API_URL = process.env.REACT_APP_API_URL;

const ProjectImformation = () => {

    // clickProjectName -> 클릭한 프로젝트 이름
    // const [managerUser, setManagerUser] = useState([]); // 가져온 담당자의 정보를 담 // 일단 사진 빼고..
    
    // const { userId } = useUser();
    const [projectData, setProjectData] = useState([]);
    const [userData, setUserDate] = useState([]);
    // const PlusProjectCreatedBy = projectStore(state => state.PlusProjectCreatedBy);
    const {projectName} = projectStore();
    console.log("ProjectHome zustand : " + projectName);
    

    
    useEffect(() => {
        if(projectName){
            Send();  // projectName 으로 프로젝트 정보 조회
            if(userData.id){
                manager(); // 프로젝트 생성자 Id 로 유저 정보 조회
            }
        }
    }, [projectName]);

    function manager(){ // 유저 정보 조회 
        const token = localStorage.getItem('token');

        axios({
            url: `${API_URL}/api/user/projects/projecthomeusers`,
            headers: { 'Authorization': `Bearer ${token}` },
            method: 'post',
            params: { id : projectData.id },
            baseURL: 'http://localhost:8080',
            withCredentials: true,
        }).then(function(response) {
            
            console.log("ProjectHome의 username : " + response.data.username);
            console.log("ProjectHome email : " + response.data.email);
            setUserDate(response.data);
           
          
        });
    }

    function Send(){ // 프로젝트 정보 조회
        axios({
            url: `${API_URL}/api/user/projects/projectselect`,
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
            method: 'post',
            params: { projectName },
            baseURL: 'http://localhost:8080',
            withCredentials: true,
        }).then(function(response) {

            setProjectData(response.data[0]);
            console.log(projectData);
        });
    }
    
    return (
        <>
        <h3>프로젝트 이름 : {projectData.projectName}</h3>
        <h3>담당자 이름/ 일단 코드 : {projectData.createdBy}</h3> <h3>{userData.position}</h3>
        <h3>이메일: {userData.email}</h3>
        </>
    )


}
export default ProjectImformation;