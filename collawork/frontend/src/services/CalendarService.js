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
const registerSchedule = async(data)=>{
    const formData = new FormData();

    const registerScheduleRequest ={
        scheduleId: data.scheduleId,
        pjId: data.pjId,
        scheduleTilte: data.scheduleTilte,
        scheduleDesc: data.scheduleDesc,
        scheduleStart: data.scheduleStart,
        scheduleEnd: data.scheduleEnd,
        scheduleCreate: data.scheduleCreate,
        createdBy: data.createdBy,
        createdAt: data.createdAt
    };

    formData.append("registerScheduleRequest", new Blob([JSON.stringify(registerScheduleRequest)],{type: 'application/json'}));

    console.log(`${API_URL}`);
    return await axios.post(`${API_URL}/api/calendar`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }, withCredentials: true
    });
};

const CalendarService = {
    registerSchedule
}
  
export default CalendarService;