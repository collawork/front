import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import ReactModal from 'react-modal';
import DatePicker from 'react-datepicker';
import axios from 'axios';
import { calendarEvents, projectStore } from '../store';
import { useUser } from '../context/UserContext';

// Modal 스타일 설정
const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    }
};


export const TestCalendar = () => {

    const [currentView, setCurrentView] = useState('dayGridMonth');

    const { userId } = useUser();
    const { projectData } = projectStore();
    const [selectedProjectId, setSelectedProjectId] = useState('');

    const {
        id, title, start, end, allDay, description, createdBy, createdAt, projectId,
        setId, setTitle, setStart, setEnd, setAllDay, setDescription, setCreatedBy, setCreatedAt, setProjectId
    } = calendarEvents();

    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState();

    const [modalIsOpen, setModalIsOpen] = useState(false);


    const API_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {

        setAllDay(true);

        const fetchProjectId = async () => {
            setSelectedProjectId(projectData.id);
            console.log(projectData);
        };
        fetchProjectId();
        console.log("선택된 프로젝트 아이디 값 = " + selectedProjectId);

        const fetchUserInfo = async () => {
            setCreatedBy(userId);
        };
        fetchUserInfo();
        console.log("createdBy = " + createdBy);

        // 모든 일정 조회
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
                        params: {selectedProjectId: selectedProjectId? selectedProjectId:"null"}
                    }
                );
                if (response.data) {
                    console.log("일정 모두 가져왔어!");
                   // setEvents(response.data)
                    console.log("setEvents는 useState라서.. 리스폰으로 확인해 본다.. : " + response.data);
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

    }, [selectedProjectId, userId, events]);


    //// userId와 projectId 필터를 거친 모든 일정 조회
    const filterEventsByProjectId = (events, selectedProjectId) => {
        return events.filter(event => event.projectId === selectedProjectId);
    };

    const changeView = () => {
        setCurrentView(currentView === 'dayGridMonth' ? 'timeGridWeek' : 'dayGridMonth');
        setAllDay(currentView === 'dayGridMonth' ? true : false)
        console.log("지금이니..?!!~!!! " + allDay);
        console.log("현재 뷰 " + currentView);
        console.log("현재 allday 여부 " + allDay);

    };
    console.log("현재 뷰 " + currentView);
    console.log("현재 allday 여부 " + allDay);

    const handleModalClose = () => {
        setModalIsOpen(false);
    };

    const handleDateSelect = (info) => {
        // 드래그하여 선택한 영역에 대한 정보를 받습니다.
        const newEvent = {
            title: '새로운 일정',
            start: info.startStr,
            end: info.endStr,
            allDay: allDay
        };
        console.log("새로운 이벤트 객체의 올데이 여부 : "+newEvent.allDay);
        setEvents([...events, newEvent]);
        // 선택 영역을 해제합니다.
        info.view.calendar.unselect();
    };

    // 일정의 제목 설명 update ------- 진행 중
    const handleEventClick = (info) => {
        setSelectedEvent(info.event);
        setModalIsOpen(true);
    };

    // 일정 update ------ 진행 중 
    const handleSaveEvent = () => {

        if (selectedEvent) {
            const updatedEvents = events.map(event => {
                if (event.id === selectedEvent.id) {
                    return { ...event, ...selectedEvent };
                }
                return event;
            });
            setEvents(updatedEvents);
            handleModalClose();
        };
    };

    // 일정의 날짜 updata ---- 진행 중
    const handleEventDrop = (info) => {
        const updatedEvents = events.map(event => {
            if (event.id === info.event.id) {
                return {
                    ...event,
                    start: info.event.startStr
                };
            }
            return event;
        });
        setEvents(updatedEvents);
    };

    return (
        <div>
            <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
                key={currentView}
                initialView={currentView}
                weekends={true}
                editable={true}
                selectable={true}
                select={handleDateSelect}
                eventClick={handleEventClick}
                eventDrop={handleEventDrop}
                selectAllow={info => {
                    return true; // 또는 특정 조건에 따라 허용 여부를 결정
                }}
                droppable={true}
                // selectAllow={(info) => {
                //     return info.start >= new Date(); // 오늘 이후의 날짜만 선택 가능하도록 제한
                // }}
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'custom'
                }}
                customButtons={{
                    custom: {
                        text: 'Month / Week',
                        click: () => changeView()
                    },
                    // custom2: {
                    //     text: '월간 보기',
                    //     click: () => changeView('dayGridMonth')
                    // }
                }}
                events={filterEventsByProjectId(events, selectedProjectId)}

            />
            <ReactModal
                isOpen={modalIsOpen}
                onRequestClose={handleModalClose}
                style={customStyles}
                contentLabel="Example Modal"
            >
                <form>
                    제목 : <input type='text' name='title' onChange={(e) => setTitle(e.target.value)} />
                    설명 : <input type='text' name='description' onChange={(e) => setDescription(e.target.value)} />
                    {/* 해당 이벤트에 마우스를 올리면 설명이 1초 뒤에 보이도록 해보자..! */}
                </form>
                {/* <DatePicker selected={start} onChange={(date) => setStart(date)} style={{ width: 200, marginRight: 10 }} />
                <DatePicker selected={end} onChange={(date) => setEnd(date)} style={{ width: 200, marginRight: 10 }} />  날짜 변경은 풀캘린더에서 제공해주는 방법을 이용.. */}
                <button onClick={handleSaveEvent}>저장</button>
                <button onClick={handleModalClose}>취소</button>
            </ReactModal>
        </div>



    );
}