import axios from "axios";
import { useState, useEffect } from 'react';
import {useUser} from '../../context/UserContext';
// import { useUser } from '../context/UserContext';

const API_URL = process.env.REACT_APP_API_URL;

const ProjectHome = () => {

    // const { userId } = useUser();

    // useEffect(() => {
    //     manager();
    // }, []);

    // function manager(){ // userId 로 프로젝트 정보 조회
    //     axios({
    //         url: `${API_URL}/api/user/projects/projecthomeusers`,
    //         headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    //         method: 'post',
    //         params: { userId },
    //         baseURL: 'http://localhost:8080',
    //         withCredentials: true,
    //     }).then(function(response) {
    //         console.log("ProjectHome : " + response);
    //         console.log("ProjectHome : " + response.data);
            
    //     });
    // }


    return(
        <>
        </>

    )
};
export default ProjectHome;