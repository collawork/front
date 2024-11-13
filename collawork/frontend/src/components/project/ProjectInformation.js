import { useEffect, useState } from "react";
import { useUser } from '../../context/UserContext';
import axios from 'axios';
import {projectStore} from '../../store';


const API_URL = process.env.REACT_APP_API_URL;

const ProjectImformation = () => {

    // clickProjectName -> 클릭한 프로젝트 이름
    // const [managerUser, setManagerUser] = useState([]); // 가져온 담당자의 정보를 담 // 일단 사진 빼고..
    
    const { userId } = useUser();
    const [data, setData] = useState([]);
    const [userData, setUserDate] = useState([]);
    const PlusProjectCreatedBy = projectStore(state => state.PlusProjectCreatedBy);
    const {projectName} = projectStore();
    console.log("ProjectHome zustand : " + projectName);
    

    
    useEffect(() => {
        if(projectName){
            Send();  // projectName 으로 프로젝트 정보 조회
            if(data.id){
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
            params: { id : data.id },
            baseURL: 'http://localhost:8080',
            withCredentials: true,
        }).then(function(response) {
            // setManagerUser(response);
            console.log("ProjectHome의 username : " + response.data.username);
            console.log("ProjectHome email : " + response.data.email);
            // setUserDate(response.data.email);
            // PlusManagerName(response.data.username);
            setUserDate(response.data);
           //  setManagerPosition(response.data.position); // 직급
          
        });
    }

    function Send(){ // 프로젝트 정보 반환
        axios({
            url: `${API_URL}/api/user/projects/projectselect`,
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
            method: 'post',
            params: { projectName },
            baseURL: 'http://localhost:8080',
            withCredentials: true,
        }).then(function(response) {
            // console.log(response.data[0]);
            // console.log(response.data[0].projectName);
            // PlusProjectName(response.data[0].projectName);
            // PlusManagerEmail(response.data[0].email);
            // PlusProjectCreatedBy(response.data[0].cretedBy);
            // console.log("가져온 만든사람 : "  + response.data[0].id)
            // console.log("managerName : " + managerName);
            // console.log("managerEmail : " + managerEmail);
            // console.log("가져온 관리자 유저 아이디 :: " + response.data[0].createdBy);
            // console.log("가져온 관리자 유저 아이디 :: " +projectCreatedBy);

            setData(response.data[0]);
            console.log(data);
        });
    }
    
    return (
        <>
        <h3>프로젝트 이름 : {data.projectName}</h3>
        <h3>담당자 이름/ 일단 코드 : {data.createdBy}</h3>
        {/* <h3>이메일: {userData.email}</h3> */}
        </>
    )


}
export default ProjectImformation;