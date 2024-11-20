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
import CalendarService from '../services/CalendarService';

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
        id, title, start, end, allDay, description, createdBy, createdAt, groupId,
        setId, setTitle, setStart, setEnd, setAllDay, setDescription, setCreatedBy, setCreatedAt, setGroupId
    } = calendarEvents();
    const editable = true

    const [events, setEvents] = useState([]);
    const [isEventAdded, setIsEventAdded] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState({});


    const [modalIsOpen, setModalIsOpen] = useState(false);


    const API_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {

        const fetchProjectId = async () => {
            setSelectedProjectId(projectData.id);
            console.log(projectData);
        };
        fetchProjectId();
        console.log("선택된 프로젝트 아이디 값 = ", selectedProjectId);

        const fetchUserInfo = async () => {
            setCreatedBy(userId);
        };
        fetchUserInfo();
        console.log("createdBy = ", createdBy);

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
                        params: { selectedProjectId: selectedProjectId ? selectedProjectId : "null" }
                    }
                );
                if (response.data) {
                    console.log("일정 모두 가져왔어!");
                    console.log(response.data);
                    // setEvents(prev => [...prev, response.data[0]])
                    // setEvents(prev => [...prev, response.data[1]])

                    for (let i = 0; i < response.data.length; i++) {
                        setEvents(prev => [...prev, response.data[i]])
                    }

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
        setIsEventAdded(false);

    }, [selectedProjectId, userId, isEventAdded]);


    //// userId와 projectId 필터를 거친 모든 일정 조회
    const filterEventsByProjectId = (events, selectedProjectId) => {


        return events.filter(event => event.groupId == selectedProjectId);
    };

    const changeView = () => {
        setCurrentView(currentView === 'dayGridMonth' ? 'timeGridWeek' : 'dayGridMonth');
    };

    const handleModalClose = () => {
        setModalIsOpen(false);
    };

    const handleDateSelect = async (info) => {

        let allDay;
        if (info.startStr.length < 11) {
            allDay = true;

        } else {
            allDay = false;

        }
        console.log("날짜 길이가 짧으면 allDay true고, 길면 false : ", allDay); // 근데 시점이.. 문제네..

        // 드래그하여 선택한 영역에 대한 정보를 받습니다.
        const newEvent = {
            title: "",
            start: info.startStr,
            end: info.endStr,
            allDay: allDay,
            groupId: selectedProjectId,
            createdBy: createdBy
            // description은 null 가능, createAt, Id는 DB에서 값 부여.
        };
        console.log("시분이 있고 없는 데이터의 길이를 확인해 보자!! ", info.startStr);
        console.log("!!!새로운 이벤트 객체의 올데이 여부 : " + newEvent.allDay);


        let result = await CalendarService.registerSchedule(newEvent);
        setIsEventAdded(true);

        // 선택 영역을 해제합니다.
        info.view.calendar.unselect();
        if (result == false) {
            alert("일정 등록에 실패하였습니다.")
        }
        handleModalClose();

    };

    // 특정 일정의 제목 설명을 가져오는 함수
    const handleEventClick = (info) => {

        setId(info.event.id);
        setTitle(info.event.title);
        setDescription(info.event.extendedProps.description);

        setModalIsOpen(true);


    };

    // 일정 업데이트
    const updateSelectedEvent = async (e) => {

        e.preventDefault();

        let result = await CalendarService.updateEvent(id, title, description);
        if (result == false) {
            alert("일정 변경에 실패하였습니다.")
        }
        setIsEventAdded(true);
        handleModalClose();
    }

    // 일정 update ------ 진행 중 
    // const handleSaveEvent = () => {

    //     if (selectedEvent) {
    //         const updatedEvents = events.map(event => {
    //             if (event.id === selectedEvent.id) {
    //                 return { ...event, ...selectedEvent };
    //             }
    //             return event;
    //         });
    //         setEvents(updatedEvents);
    //         handleModalClose();
    //     };
    // };

    // 일정의 날짜 updata ---- 진행 중
    const handleEventDrop = (info) => {
        const updatedEvents = events.map((event) => {
          if (event.id === info.event.id) {
            return { ...event, start: info.event.startStr }; // 변경된 시작 시간으로 업데이트
          }
          return event; // 다른 이벤트는 그대로 유지
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
                editable={false}
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
                <form onSubmit={updateSelectedEvent}>
                    제목 : <input type='text' name='title' onChange={(e) => setTitle(e.target.value)} value={title} placeholder='일정의 제목을 입력해 주세요.' />
                    설명 : <input type='text' name='description' onChange={(e) => setDescription(e.target.value)} value={description} placeholder='일정의 상세 설명을 입력해 주세요.' />

                    <button type='submit'>저장</button>
                    {/* 해당 이벤트에 마우스를 올리면 설명이 1초 뒤에 보이도록 해보자..! */}
                </form>
                {/* <DatePicker selected={start} onChange={(date) => setStart(date)} style={{ width: 200, marginRight: 10 }} />
                <DatePicker selected={end} onChange={(date) => setEnd(date)} style={{ width: 200, marginRight: 10 }} />  날짜 변경은 풀캘린더에서 제공해주는 방법을 이용.. */}
                {/* <button onClick={handleSaveEvent}>저장</button> */}
                {/* <button onClick={handleModalClose}>취소</button> */}
            </ReactModal>
        </div>



    );
}