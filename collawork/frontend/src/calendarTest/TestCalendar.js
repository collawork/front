import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import ReactModal from 'react-modal';
import DatePicker from 'react-datepicker'; // 예시: react-datepicker

import { calendarEvents, projectStore } from '../store';

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

    const {
        id, title, start, end, allDay, description, createdBy, createdAt, projectId,
        setId, setTitle, setStart, setEnd, setAllDay, setDescription, setCreatedBy, setCreatedAt, setProjectId
    } = calendarEvents();

    const [events, setEvents] = useState([]);

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState();







    const handleModalClose = () => {
        setModalIsOpen(false);
    };

    const handleDateSelect = (info) => {
        // 드래그하여 선택한 영역에 대한 정보를 받습니다.
        const newEvent = {
            title: 'New Event',
            start: info.startStr,
            end: info.endStr
        };
        setEvents([...events, newEvent]);
        // 선택 영역을 해제합니다.
        info.view.calendar.unselect();
    };

    const handleEventClick = (info) => {
        setSelectedEvent(info.event);
        setModalIsOpen(true);
    };



    const handleSaveEvent = () => {
        if (title) {
            const newEvent = {
                title: title,
                start: start,
                end: end,

            };
            setEvents([...events, newEvent]);
            setModalIsOpen(false);
            setTitle('');
        }
    };

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
                initialView={currentView}
                weekends={true}
                editable={true}
                selectable={true}
                select={handleDateSelect}
                eventClick={handleEventClick}
                eventDrop={handleEventDrop}
                events={events}
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
                    right: 'custom,custom2'
                }}
                customButtons={{
                    custom: {
                        text: '주간 보기',
                        click: () => setCurrentView('timeGridWeek')
                        // click: () => changeView('timeGridWeek')
                    },
                    custom2: {
                        text: '월간 보기',
                        click: () => setCurrentView('dayGridMonth')
                    }
                }}

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
                <DatePicker selected={start} onChange={(date) => setStart(date)} style={{ width: 200, marginRight: 10 }} />
                <DatePicker selected={end} onChange={(date) => setEnd(date)} style={{ width: 200, marginRight: 10 }} />
                <button onClick={handleSaveEvent}>저장</button>
                <button onClick={handleModalClose}>취소</button>
            </ReactModal>
        </div>



    );
}