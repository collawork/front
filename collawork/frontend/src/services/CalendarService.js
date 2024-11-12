/*
작성자: 서현준
작성일: 2024.11.6
달력을 이용한 일정 등록 서비스 제공
*/

// const [formData, setFormData] = useState({
//     scheduleId: '', pjId: '', scheduleTilte: '', scheduleDesc: '',
//     scheduleStart: '', scheduleEnd: '', scheduleCreate: '', createdBy: '', createdAt: ''
// });

import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;
const registerSchedule = async(title, start, end, description, projectId, createBy)=>{

    

    console.log(`${API_URL}`);

    axios(
        {
            url:`${API_URL}/api/calendar/insert`,
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json', // JSON 형식으로 전송
            },
            method: 'post',
            data: {title, start, end, description, projectId, createBy},
            //params: { title, start, end, description, projectId, createBy },
            baseURL:'http://localhost:8080',
            withCredentials: true

        }
    ).then(function(response){
        console.log("CalendarService : " + response);
        console.log("CalendarService : " + response.data);
      });
    // return await axios.post(`${API_URL}/api/calendar/insert`, formData, {
    //     headers: {
    //         'Authorization': `Bearer ${localStorage.getItem('token')}`,
    //         'Content-Type': 'application/json', // JSON 형식으로 전송
    //     },
    //     withCredentials: true
    // });
};

const CalendarService = {
    registerSchedule
}
  
export default CalendarService;