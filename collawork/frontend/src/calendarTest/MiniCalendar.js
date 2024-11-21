import ReactModal from "react-modal"
import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from "axios";
import cloneDeep from 'lodash/cloneDeep';

export const MiniCalendar = () => {

  const [events, setEvents] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');

  const API_URL = process.env.REACT_APP_API_URL;
  useEffect(() => {

    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await axios(
          {
            url: `${API_URL}/api/calendar/events`,
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json', // JSON 형식으로 전송
            },
            method: 'get',
            params: { selectedProjectId: selectedProjectId ? selectedProjectId : "null" }
          }
        );
        if (response.data) {
          console.log("일정 모두 가져왔어!");
          console.log(response.data);
          // setEvents(prev => [...prev, response.data[0]])
          // setEvents(prev => [...prev, response.data[1]])

          // for (let i = 0; i < response.data.length; i++) {
          //     setEvents(prev => cloneDeep([...prev, response.data[i]]))
          // }
          setEvents([
            { title: '이벤트 1', date: '2024-11-21', projectId: 1 },
            { title: '이벤트 2', date: '2024-11-22', projectId: 1 },
            { title: '이벤트 2-1', date: '2024-11-22', projectId: 2 },
            // {
            //   date: '2024-11-22',
            //   allDay: true,
            //   color: null,
            //   end: "2024-10-29T15:00:00Z",
            //   extendedProps:
            //   {
            //     description: null,
            //     createdAt: '2024-11-21T03:49:02Z',
            //     createdBy: 4
            //   },
            //   // projectId: null,
            //   id: 32,
            //   start: "2024-10-28T15:00:00Z",
            //   title: "test"
            // },
            // {
            //   allDay: true,
            //   color: null,
            //   end: "2024-10-28T15:00:00Z",
            //   extendedProps:
            //   {
            //     description: null,
            //     createdAt: '2024-11-21T03:49:02Z',
            //     createdBy: 4
            //   },
            //   // projectId: null,
            //   id: 33,
            //   start: "2024-10-28T15:00:00Z",
            //   title: ""
            // }
          ]);

          console.log(events);
        } else {
          console.log("미안해.. 일정 못 담았어.. ㅠㅠ");
        };
      } catch (error) {
        if (error.response?.status === 403) {
          console.error('인증 오류: 토큰이 만료되었거나 권한이 없습니다.');
        } else {
          console.error('이벤트 객체를 불러오는 중 에러 발생:', error);
        }
      };
    };
    fetchEvents();
    // setEvents([
    //   { title: '이벤트 1', date: '2024-11-21' },
    //   { title: '이벤트 2', date: '2024-11-22' }
    // ]);
  }, []);



  return (
    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      editable={true}
      selectable={true}
      events={events}
    />
  );

}