import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import googleCalendarPlugin from '@fullcalendar/google-calendar';
import ReactModal from 'react-modal';
import axios from 'axios';
import { calendarEvents, projectStore } from '../../store';
import { useUser } from '../../context/UserContext';
import CalendarService from '../../services/CalendarService';

import '../../components/assest/css/Calendar.css';
import { set } from 'lodash';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import Button from 'react-bootstrap/Button';
// import Card from 'react-bootstrap/Card';


// Modal 스타일 설정
// const customStyles = {
//     content: {
//         top: '50%',
//         left: '50%',
//         right: 'auto',
//         bottom: 'auto',
//         marginRight: '-50%',
//         transform: 'translate(-50%, -50%)'
//     }
// };


export const Calendar = () => {
    // 스케쥴 색상 종류
    const colors = [/*'#f44336', '#e91e63',*/ '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722'];
    // 현재 뷰를 설정. (Month 또는 Week)
    const [currentView, setCurrentView] = useState('dayGridMonth');
    // 팀장님이 전역으로 사용 가능하게 만든 유저 아이디
    const { userId } = useUser();
    // 쥬스탄드에 담긴 유저 정보
    const { projectData } = projectStore();
    // 사용자에게 보여주고 입력 받을 스케쥴 정보의 상태를 저장한다.
    const {
        id, title, start, end, allDay, description, createdBy, createdAt, projectId, color,
        setId, setTitle, setStart, setEnd, setAllDay, setDescription, setCreatedBy, setCreatedAt, setProjectId, setColor
    } = calendarEvents();
    // 한국의 휴일 정보
    const [krHoliday, setKrHoliday] = useState([]);
    // 스케쥴 등록과 수정을 같은 모달을 통해 할 수 있도록 한다.
    const [isInserting, setIsInserting] = useState(true);
    // ↳ 바로 그 모달이다.
    const [modalIsOpen, setModalIsOpen] = useState(false);
    // DB로부터 전달 받은 스케쥴 목록을 담는다.
    const [events, setEvents] = useState([]);
    // 스케쥴이 등록됐을 때 DB로부터 가장 최신의 스케쥴까지 사용자에게 보여줄 수 있도록 한다.
    const [isEventAdded, setIsEventAdded] = useState(false);

    const API_URL = process.env.REACT_APP_API_URL;
    const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
    const GOOGLE_CALENDAR_ID = process.env.REACT_APP_GOOGLE_CALENDAR_KR_HOLIDAY_ID

    const now = new Date();
    const sixMonthsAgo = new Date(now);
    sixMonthsAgo.setMonth(now.getMonth() - 2);
    const sixMonthsLater = new Date(now);
    sixMonthsLater.setMonth(now.getMonth() + 2);

    const timeMin = sixMonthsAgo.toISOString();
    const timeMax = sixMonthsLater.toISOString();


    useEffect(() => {

        // 구글 캘린더에서 한국의 공휴일 정보를 가져와 보자
        const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
        const GOOGLE_CALENDAR_ID = process.env.REACT_APP_GOOGLE_CALENDAR_KR_HOLIDAY_ID

        const fetchKrHoliday = async () => {
            console.log("::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: 구글에서 정보 좀 가져오려는데..");
            console.log(GOOGLE_API_KEY);
            console.log(GOOGLE_CALENDAR_ID);
            try {
                //                 const response = await axios.get(`https://www.googleapis.com/calendar/v3/calendars/${GOOGLE_CALENDAR_ID}/events?timeMin=${timeMin}&timeMax=${timeMax}&key=${GOOGLE_API_KEY}`,
                // );
                //                 console.log("구글에서 가져온 휴일 정보... ", response.data);
                //                 console.log(response.data.items);
                //                 const krH =response.data.items;

                //                 for(let i=0; i<response.data.length; i++){
                //                     let title = krH.i.summary;
                //                     let description = krH.i.description;
                //                     let start = krH.i.start;

                //                     setKrHoliday(...krHoliday, {title: title, description:description, start:start});
                //                 };
                //                 return krHoliday;
                const response = await axios.get(`https://www.googleapis.com/calendar/v3/calendars/${GOOGLE_CALENDAR_ID}/events?timeMin=${timeMin}&timeMax=${timeMax}&key=${GOOGLE_API_KEY}`,
                );
                console.log("구글에서 가져온 휴일 정보... ", response.data);
                console.log(response.data.items);
                const krH = response.data.items;

                for (let i = 0; i < response.data.items.length; i++) {
                    let title = krH[i].summary;
                    let description = krH[i].description;
                    let start = krH[i].start.date;
                    let color = "white";
                    let textColor = "red";

                    setKrHoliday((prev) => [...prev, { title: title, extendedProps: { description: description }, start: start, color: color, textColor: textColor }]);
                };
                return response.data.itiems;

            } catch (error) {
                console.error('Error fetching calendar events:', error);
                return null;
            }

        }
        fetchKrHoliday();
        // console.log("::::::::::::::::::::::::: 한국의 휴일 정보 (가공한 데이터)", krHoliday);
    }, []);

    console.log("::::::::::::::::::::::::: 한국의 휴일 정보 (가공한 데이터)", krHoliday);
    console.log("::::::::::::::::::::",events);

    // 달력이 불려질 때 바로 실행될 함수들..
    useEffect(() => {
        // DB로부터 최신 스케쥴을 받을 수 있도록 돕는다.
        setIsEventAdded(false);
        // 선택된 프로젝트 아이디 저장. 선택된 프로젝트 아이디가 없으면 개인 달력으로 사용된다.
        const fetchProjectId = async () => {
            setProjectId(projectData.id);
            console.log(projectData);
        };
        fetchProjectId();

        // 스케쥴을 등록한 유저 정보를 저장
        const fetchUserInfo = async () => {
            setCreatedBy(userId);
        };
        fetchUserInfo();

        // 프로젝트 아이디로 해당 일정 모두 조회. 아이디가 없으면 개인 일정을 모두 조회.
        const fetchEvents = async () => {

            // // 캐시에서 데이터 가져오기
            // const cachedEvents = localStorage.getItem('calendarEvents');
            // if (cachedEvents) {
            //     setEvents(JSON.parse(cachedEvents));
            //     return;
            // }



            setEvents([]);
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
                        params: { selectedProjectId: projectId ? projectId : "0" } // 0은 개인 일정을 뜻함
                    }
                );
                if (response.data) { // 일정이 객체 배열로 담겨있다.
                    setEvents(response.data);
                } else {
                    console.log("조회된 일정이 존재하지 않습니다.");
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
    }, [projectId, userId, isEventAdded]);

    // 뷰를 바꾸는 함수
    const changeView = () => {
        setCurrentView(currentView === 'dayGridMonth' ? 'timeGridWeek' : 'dayGridMonth');
    };

    // 모달을 닫는 함수
    const handleModalClose = () => {
        setModalIsOpen(false);
        //setIsEventAdded(true);
    };

    // 빈 날짜를 클릭할 때 발동하는 함수
    const handleDateSelect = async (info) => { // 선택한 날짜의 정보를 받을 수 있다.
        setIsInserting(true); // 인설트 중인지 수정 중인지를 확인하는 상태 변수. true면 인설트 중.
        // 시분이 붙은 날짜 정보 처리 로직
        let allDay;
        if (info.startStr.length < 11) {
            allDay = true;
        } else {
            allDay = false;
        }

        //선택한 영역에 대한 스케쥴 상태를 받아두고 이를 모달을 열어서 사용자에게 초기값으로 보여 준다.
        // 같은 모달로 수정도 진행하기 때문에 선택한 이벤트의 설정 값을 담고 있다.
        setTitle("");
        setDescription("");
        setStart(info.startStr);
        setEnd(info.endStr);
        setAllDay(allDay); // 바로 위에서 초기화한 allDay
        setColor("#2196f3")

        // 모달을 열면 상기에 적어둔 초기값들이 보여진다. 이후 사용자는 title, description, color를 변경할 수 있다.
        setModalIsOpen(true);
        setIsEventAdded(true);

        // 선택 영역을 해제합니다.
        info.view.calendar.unselect();

    };

    // 스케쥴 등록 함수
    const insertEvent = async (e) => {
        e.preventDefault(); // form의 submit 기본 동작을 막는다. (새로고침 막는 용도)
        const newEvent = {
            title, description, start, end, allDay, projectId, createdBy, color // 모달을 통해 사용자가 초기화한 새로운 값들을 담았다.
        }

        let result = await CalendarService.registerSchedule(newEvent);
        if (result) {
            alert("일정 등록에 성공하였습니다.");
            setIsEventAdded(true); // 등록된 일정이 달력에 반영될 수 있도록한다.
        } else {
            alert("일정 등록에 실패하였습니다.");
        }
        // 모달을 닫는다.
        handleModalClose();
    }

    // 특정 일정의 제목 설명을 가져오는 함수
    const handleEventClick = (info) => {
        // info.jsEvent.preventDefault(); // 공휴일을 클릭했을 때 구글 캘린더로 넘어가는 것을 방지
        // console.log("구글 캘린더에서 가져온 휴일 정보를 클릭했을 때 정보를 확인하기 위함.. ", info.event);
        if(!info.event.id){
            // setIsHoliday(true);
        }

        setIsInserting(false);
        setIsEventAdded(true);
        setId(info.event.id);
        setTitle(info.event.title);
        setDescription(info.event.extendedProps.description);
        setColor(info.event.backgroundColor);

        setModalIsOpen(true);
    };

    // 입력한 일정의 제목과 설명, 고유 색상을 업데이트 하는 함수
    const updateSelectedEvent = async (e) => {
        e.preventDefault(); // submit의 기본 동작을 막는다. (새로고침을 막는다.)

        let result = await CalendarService.updateEvent(id, title, description, color);
        if (result == false) {
            alert("일정 변경에 실패하였습니다.")
        }
        setIsEventAdded(true);
        handleModalClose();
    };

    // 스케쥴을 마우스로 클릭해 드래그 할 때 발동되는 함수. (날짜 정보를 수정)
    const handleEventDrop = async (info) => {

        // 특정 스케쥴을 찾아내 수정하는 함수
        events.map(async (event) => {
            if (event.id == info.event.id) {
                let id = info.event.id;
                let start = info.event.startStr;
                let end = info.event.endStr;
                if (end == "") { // start 날짜만 있다면 end 날짜를 start 날짜와 동일하게 초기화
                    end = info.event.startStr
                }
                let allDay = info.event.allDay // true면 날짜에 시분 정보가 있어도 적용되지 않고 종일 스케쥴로 관리

                await CalendarService.updataEventDate(id, start, end, allDay)
                    .then(result => {
                        if (result) {
                            //alert("일정 변경에 성공하였습니다.");
                        } else {
                            alert("일정 변경에 실패하였습니다.")
                        }
                    });
            }
        });
    };

    // 특정 스케쥴을 삭제하는 함수
    const deleteSelectedEvent = async (e) => {
        e.preventDefault(); // 새로고침을 막는다.

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

    return (
        <div className='fullCalendarContainer'>
            {/* <Card style={{ width: '18rem' }}>
                <Card.Img variant="top" src="holder.js/100px180" />
                <Card.Body>
                    <Card.Title>Card Title</Card.Title>
                    <Card.Text>
                        Some quick example text to build on the card title and make up the
                        bulk of the card's content.
                    </Card.Text>
                    <Button variant="primary">Go somewhere</Button>
                </Card.Body>
            </Card> */}
            {/* <div class="card" style="width: 18rem;">
                <div class="card-body">
                    <h5 class="card-title">Card title</h5>
                    <h6 class="card-subtitle mb-2 text-body-secondary">Card subtitle</h6>
                    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                    <a href="#" class="card-link">Card link</a>
                    <a href="#" class="card-link">Another link</a>
                </div>
            </div> */}
            <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin, googleCalendarPlugin]}
                height={600}
                //aspectRatio= {100}
                key={currentView}
                initialView={currentView} // 현재 뷰
                weekends={true} // 토일 표시
                editable={true} // 스케쥴 수정 가능 여부
                selectable={true} // 달력 조작 가능 여부
                droppable={true}
                select={handleDateSelect} // 빈 날짜 클릭 시
                eventClick={handleEventClick} // 스케쥴 클릭 시
                eventDrop={handleEventDrop} // 스케쥴을 통째로 드래그 시
                eventResize={handleEventDrop} // 스케쥴 날짜를 드래그 시
                selectAllow={info => {
                    return true; // 특정 조건에 따라 허용 여부를 결정. ex) 오늘 날짜 이후로는 선택하지 못하도록 강제 할 수 있다.
                }}
                headerToolbar={{ // 상단 버튼
                    left: 'prev,next today', // ,는 붙은 각각의 버튼. " "는 분리된 버튼
                    center: 'title',
                    right: 'view'
                }}
                customButtons={{ // 사용자 정의 버튼
                    view: {
                        text: 'Month / Week',
                        click: () => changeView()
                    },
                }}
                googleCalendarApiKey={`${GOOGLE_API_KEY}`}




                // events = {[
                //     ...events, // 기존 events 배열 전개
                //     {
                //       googleCalendarId: `${GOOGLE_CALENDAR_ID}`,
                //       color: 'white',   // an option!
                //       textColor: 'red'  // an option!
                //     }
                //   ]}

                // eventSources={
                //     [
                //         {googleCalendarId: 'ko.south_korea#holiday@group.v.calendar.google.com',
                //         className: 'ko_event'}
                //     ] 
                // }



                // events={
                //     [
                //         ...events,
                //         {
                //             googleCalendarId: GOOGLE_CALENDAR_ID,
                //             color: 'white',   // an option!
                //             textColor: 'red' // an option!
                //         }
                //     ]
                // }

                // eventSources={ // 동기
                //     [
                //         { events },
                //         // {
                //         //     googleCalendarId: GOOGLE_CALENDAR_ID,
                //         //     display: 'background',
                //         //     color: 'red',
                //         //     textColor: 'red'
                //         // }
                //     ]
                // }

                // eventSources={ // 동기
                //     [
                //         { events },
                //         { krHoliday },
                //         // {
                //         //     googleCalendarId: GOOGLE_CALENDAR_ID,
                //         //     //display: 'background',
                //         //     color: 'white',
                //         //     textColor: 'red',
                //         //     editable: false,
                //         //     // textBord: true
                //         //     start: '2024-10-01',
                //         //     end: '2025-02-01'
                //         // }
                //     ]
                // }

                events={[ ...krHoliday, ...events ]}// 이곳에 존재하는 스케쥴 객체를 달력으로 보여주는 기능. 비동기

            />
            < ReactModal // 등록, 수정을 함꼐하는 모달
                isOpen={modalIsOpen} // 모달 여닫는 기능
                onRequestClose={handleModalClose}
                //style={customStyles}
                contentLabel="insertOrUpdateModal"
                className="calendar-modal"
            >
                <form onSubmit={isInserting ? insertEvent : updateSelectedEvent}>
                    제목 : <input type='text' name='title' onChange={(e) => setTitle(e.target.value)} value={title} placeholder='일정의 제목을 입력해 주세요.' required />
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
            </ReactModal>
        </div >
    );
}