import axios from "axios";
import { useUser } from '../../context/UserContext';
import { useState, useEffect } from 'react';


const API_URL = process.env.REACT_APP_API_URL;

const ProjectHome = () => {

    const [managerUser, setManagerUser] = useState([]); // 가져온 담당자의 정보를 담는다 // 일단 사진 빼고..
    const { userId } = useUser();
    console.log("ProjectHome : " + userId);
   
    useEffect(() => {
        manager();
    }, []);

    function manager(){ // userId 로 프로젝트 정보 조회
        axios({
            url: `${API_URL}/api/user/projects/projecthomeusers`,
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
            method: 'post',
            params: { userId },
            baseURL: 'http://localhost:8080',
            withCredentials: true,
        }).then(function(response) {
            console.log("ProjectHome : " + response);
            setManagerUser(response.data);
            console.log("ProjectHome : " + response.data);
            console.log("ProjectHome 의 managerUser : " + response.data);
        });
    }


    return(
        <>
        <h3>담당자 :</h3> 
        <h3>프로젝트 아이디 : </h3>
        </>

    )
};
export default ProjectHome;