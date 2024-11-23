/*
작성자: 서현준
작성일: 2024.11.6
달력을 이용한 일정 등록 서비스 제공
*/


import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const registerSchedule = async (newData) => {
    const response = await axios(
        {
            url: `${API_URL}/api/calendar/insert`,
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
            method: 'post',
            data: { newData },
            baseURL: 'http://localhost:8080',
        }
    )
    return response.data;
};

const updateEvent = async (id, title, description, color) => {
    const updateData = { id, title, description, color }
    const response = await axios(
        {
            url: `${API_URL}/api/calendar/update`,
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
            method: 'post',
            data: { updateData },
            baseURL: 'http://localhost:8080',
            withCredentials: true
        }
    );
    return response.data;
};

const updataEventDate = async (id, start, end, allDay) => {
    const updateData = { id, start, end, allDay };
    const response = await axios(
        {
            url: `${API_URL}/api/calendar/updatedate`,
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
            method: 'post',
            data: { updateData },
            baseURL: 'http://localhost:8080',
            withCredentials: true
        }
    );
    console.log(response.data);
    return response.data;
};

const deleteEventDate = async (id) => {
    const response = await axios(
        {
            url: `${API_URL}/api/calendar/delete/${id}`,
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
            method: 'delete',
            baseURL: 'http://localhost:8080',
            withCredentials: true
        }
    );
    console.log(response.data);
    return response.data;
};

const CalendarService = {
    registerSchedule,
    updateEvent,
    updataEventDate,
    deleteEventDate
};
export default CalendarService;