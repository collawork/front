/*
작성자: 서현준
작성일: 2024.11.6
달력을 이용한 일정 등록 서비스 제공
*/


import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;
const registerSchedule = async (newData) => {

    console.log("데이터를 보냅니다! 하느님~!!! 잘 받아주세요~~!!!!! ", newData);

    console.log(`${API_URL}`);

    await axios(
        {
            url: `${API_URL}/api/calendar/insert`,
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json', // JSON 형식으로 전송
            },
            method: 'post',
            data: { newData },
            baseURL: 'http://localhost:8080',
            withCredentials: true

        }
    ).then(function (response) {
        console.log("CalendarService : ", response);
        console.log("CalendarService : ", response.data);
        // return response;
    });
};

const CalendarService = {
    registerSchedule
}

export default CalendarService;