/*
작성자: 서현준
작성일: 2024.10.31

마이 페이지 겸 헤더랑 네비가 없는 메인 페이지

날씨 AIP
fullcalendar API를 사용할 예정
*/
import { useNavigate } from "react-router-dom"
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'

const MyPage = () => {
    const navigate = useNavigate();

    // 캘린더로 이동
    const moveToCalender = () => {
        navigate('/calender');
    };

    // 프로젝트로 이동
    const moveToProject = () => {
        navigate('/project');
    }

    // 친구 페이지로 이동
    const moveToFirend = () => {
        navigate('/friend');
    }

    const handleDateClick = (arg) => {
        alert(arg.dateStr)
    }


    /*
    사용자가 달력에서 요구하는 기능 목록을 뽑아내 보자..!
    1. 클릭으로 특정 날을 지정할 수 있는 기능
        - 드래그를 통해 기간도 특정할 수 있도록 한다.
    2. 특정 날 또는 기간에 기록을 남기는 기능
        - text(title만 가질 수도 있고, title과 context를 둘다 가질 수도 있도록..),
          아이콘, 중요도 설정, 체크박스, 
    */


    return (
        <>
            <div className="나름 헤더">
                <span className="hi-user-name">안녕하세요 현준님, 좋은 아침이예요!</span>
                {/* 로그인 정보를 바탕으로 이름을 조회하고 접속한 시간을 조회해서 해당하는 적당한 인사말을 넣어준다.*/}

                <span className="tpday">2024년 10월 30일</span>
                <image className="weather-icon" src="../image/icon/해당하는.png" />
            </div>

            <div className="종으로 가운데 정렬 flex?">
                <div className="calender-mypage">
                    <span className="text">달력</span>
                    <image className="mypage-icon" src='../image/icon/calender.png' />
                    <FullCalendar
                        plugins={[dayGridPlugin, interactionPlugin]}
                        dateClick={handleDateClick}
                        eventContent={renderEventContent}
                        initialView="dayGridMonth"
                        weekends={true}

                        events={[
                            { title: '현욱이 생일', date: '2024-11-05', textColor: 'red' },
                            { title: 'event 2', date: '2024-11-01', start: '2024-11-10', end: '2024-11-12' },
                            { title: 'event 3', date: '2024-11-06' },
                            { title: '' }
                        ]}
                    />
                </div>


                <div className="횡으로 나란히 정렬">
                    <div className="projects-mypage">
                        <span className="text">프로젝트</span>
                        <image className="mypage-icon" src='../image/icon/project.png' />
                        <div className="project-list">
                            <span>Collawork 프로젝트</span>
                            <span>현준의 두 번째 프로젝트</span>
                            <span>현준의 첫 번째 프로젝트</span>
                        </div>
                    </div>

                    <div className="friends-mypage">
                        <span className="text">친구</span>
                        <image className="mypage-icon" src='../image/icon/friend.png' />
                        <div className="friend-list">
                            <span>카리스마.동규</span>
                            <span>애착인형.진우</span>
                            <span>똘똘한 핑프.서연</span>
                        </div>
                    </div>
                </div>
            </div>
        </>


    )

}
export default MyPage;

function renderEventContent(eventInfo) {
    return (
        <>
            <b>{eventInfo.timeText}</b>
            <i>{eventInfo.event.title}</i>
        </>
    )
}