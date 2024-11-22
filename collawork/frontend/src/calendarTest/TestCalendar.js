import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import ReactModal from 'react-modal';
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
    // 추가된 상태 변수 // #3788d8
    const [selectedColor, setSelectedColor] = useState('#2196f3'); // 초기값 설정

    // 색상 팔레트 예시
    const colors = [/*'#f44336', '#e91e63',*/ '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722'];

    const [currentView, setCurrentView] = useState('dayGridMonth');

    const { userId } = useUser();
    const { projectData } = projectStore();
    const [selectedProjectId, setSelectedProjectId] = useState('');

    const {
        id, title, start, end, allDay, description, createdBy, createdAt, projectId, color,
        setId, setTitle, setStart, setEnd, setAllDay, setDescription, setCreatedBy, setCreatedAt, setProjectId, setColor
    } = calendarEvents();
    const [isInserting, setIsInserting] = useState(true);
    const editable = true

    const [events, setEvents] = useState([]);
    const [isEventAdded, setIsEventAdded] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState({});


    const [modalIsOpen, setModalIsOpen] = useState(false);


    const API_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {

        const fetchProjectId = async () => {
            setProjectId(projectData.id);
            console.log(projectData);
        };
        fetchProjectId();
        console.log("선택된 프로젝트 아이디 값 = ", projectId);

        const fetchUserInfo = async () => {
            setCreatedBy(userId);
        };
        fetchUserInfo();
        console.log("createdBy = ", createdBy);

        // 모든 일정 조회
        const fetchEvents = async () => {
            setEvents([]);
            try {
                console.log(":::::::::::::::::::::::::::::::::::::::", projectId);
                const token = localStorage.getItem('token')
                const response = await axios(
                    {
                        url: `${API_URL}/api/calendar/events`,
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json', // JSON 형식으로 전송
                        },
                        method: 'get',
                        params: { selectedProjectId: projectId ? projectId : "0" }
                        //params: { selectedProjectId: selectedProjectId ? selectedProjectId : "null" }
                    }
                );
                if (response.data) {
                    console.log("일정 모두 가져왔어!");
                    console.log(response.data);
                    // setEvents(prev => [...prev, response.data[0]])
                    // setEvents(prev => [...prev, response.data[1]])
                    setEvents(response.data);
                    // for (let i = 0; i < response.data.length; i++) {
                    //     setEvents(prev => [...prev, response.data[i]])
                    // }

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

    }, [projectId, userId, isEventAdded]);


    //// userId와 projectId 필터를 거친 모든 일정 조회
    // const filterEventsByProjectId = (events, selectedProjectId) => {


    //     return events.filter(event => event.groupId == selectedProjectId);
    // };

    const changeView = () => {
        setCurrentView(currentView === 'dayGridMonth' ? 'timeGridWeek' : 'dayGridMonth');
    };

    const handleModalClose = () => {
        setModalIsOpen(false);
    };

    const handleDateSelect = async (info) => {
        setIsInserting(true);
        // 시분이 붙은 날짜 정보 처리 로직
        let allDay;
        if (info.startStr.length < 11) {
            allDay = true;
        } else {
            allDay = false;
        }

        //선택한 영역에 대한 스케쥴 상태를 받아 사용자에게 보여 준다.
        setTitle("");
        setDescription("");
        setStart(info.startStr);
        setEnd(info.endStr);
        setAllDay(allDay);
        setColor("#2196f3")

        setModalIsOpen(true);
    };

    const insertEvent = async (e) => {
        e.preventDefault();
        const newEvent = {
            title: "",
            start: e.startStr,
            end: e.endStr,
            allDay: allDay,
            projectId: projectId,
            createdBy: createdBy,
            color: "#2196f3"
        };

        let result = await CalendarService.registerSchedule(newEvent);
        if (result) {
            alert("일정 등록에 성공하였습니다.");
            setIsEventAdded(true);
        } else {
            alert("일정 등록에 실패하였습니다.");
        }

        // 선택 영역을 해제합니다.
        e.view.calendar.unselect();
        handleModalClose();

    }

    // 특정 일정의 제목 설명을 가져오는 함수
    const handleEventClick = (info) => {
        setIsInserting(false);
        setId(info.event.id);
        setTitle(info.event.title);
        setDescription(info.event.extendedProps.description);
        setColor(info.event.backgroundColor);

        setModalIsOpen(true);
    };

    // 입력한 일정의 제목과 설명, 고유 색상을 업데이트 하는 함수
    const updateSelectedEvent = async (e) => {

        e.preventDefault();

        let result = await CalendarService.updateEvent(id, title, description, color);
        if (result == false) {
            alert("일정 변경에 실패하였습니다.")
        }
        setIsEventAdded(true);
        handleModalClose();
    };


    const handleEventDrop = async (info) => {

        const updatedEvents = events.map(async (event) => {
            console.log("하나의 객체! ::::::::::::::::::::::::::::::::::::", info.event.id);
            console.log("::::::::::::::::::::::::::::::::::::::::::::::::::::", event.id);
            if (event.id == info.event.id) {
                let id = info.event.id;
                let start = info.event.startStr;
                let end = info.event.endStr;
                console.log("조건문을 만나기 전의 end", end);
                if (end == "") {
                    end = info.event.startStr
                    console.log("조건문의 적용을 받은 end", end);
                }
                console.log("조건문을 만난 후의 end", end);
                let allDay = info.event.allDay
                console.log("여기 올데이 여부가 들어 있어?", allDay);

                await CalendarService.updataEventDate(id, start, end, allDay)
                    .then(result => {
                        if (result) {
                            console.log("일정 시간 변경 :::::: 결과 ::::: ", result);
                            alert("일정 변경에 성공하였습니다.");
                            //setIsEventAdded(true);
                        } else {
                            alert("일정 변경에 실패하였습니다.")
                        }
                    });
            }
        });
    };

    const deleteSelectedEvent = async (e) => {

        e.preventDefault();

        console.log("삭제 진행 체크");
        await CalendarService.deleteEventDate(id)
            .then(result => {
                if (result) {
                    alert("일정 삭제에 성공하였습니다.");
                    setIsEventAdded(true);
                } else {
                    alert("일정 삭제에 실패하였습니다.")
                }
            });
        handleModalClose();
    };

    // const handleDeleteEvent = () => {
    //     if (!selectedEvent) {
    //         alert('삭제할 이벤트를 선택해주세요.');
    //         return;
    //     }

    //     // 백엔드 API 호출하여 이벤트 삭제
    //     axios.delete(`/api/events/${selectedEvent.id}`)
    //         .then(() => {
    //             // 삭제 성공 시 캘린더 갱신
    //             calendarRef.current.refetchEvents();
    //             setSelectedEvent(null); // 선택 상태 해제
    //         })
    //         .catch(error => {
    //             console.error('이벤트 삭제 실패:', error);
    //         });
    // };

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
                eventResize={handleEventDrop}
                selectAllow={info => {
                    return true; // 또는 특정 조건에 따라 허용 여부를 결정
                }}
                droppable={true}
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'view'
                }}
                customButtons={{
                    view: {
                        text: 'Month / Week',
                        click: () => changeView()
                    },
                }}
                events={events}

            />
            <ReactModal
                isOpen={modalIsOpen}
                onRequestClose={handleModalClose}
                style={customStyles}
                contentLabel="Example Modal"
            >
                {/* <form onSubmit={updateSelectedEvent}> */}
                <form onSubmit={isInserting ? insertEvent : updateSelectedEvent}>
                    제목 : <input type='text' name='title' onChange={(e) => setTitle(e.target.value)} value={title} placeholder='일정의 제목을 입력해 주세요.' />
                    설명 : <input type='text' name='description' onChange={(e) => setDescription(e.target.value)} value={description} placeholder='일정의 상세 설명을 입력해 주세요.' />
                    색상 :
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        {colors.map((theColor) => (
                            <div
                                key={theColor}
                                style={{
                                    backgroundColor: theColor,
                                    width: '30px',
                                    height: '25px',
                                    border: `2px solid ${color === theColor ? 'black' : 'transparent'}`,
                                    cursor: 'pointer',
                                    flex: 1 // 각 아이템이 공간을 균등하게 차지
                                }}
                                onChange={(e) => setColor(e.target.value)}
                                value={color}
                                onClick={() => setColor(theColor)}
                            />
                        ))}
                    </div>
                    <button type='submit'>저장</button>
                </form>
                {isInserting ? <></> : <button onClick={deleteSelectedEvent}>일정 삭제</button>}

                {/* <button onClick={deleteSelectedEvent}>일정 삭제</button> */}
            </ReactModal>
        </div>
    );
}