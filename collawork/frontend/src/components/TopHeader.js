import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';


const TopHeader = () => {
    const [user, setUser] = useState({ username: '', name: '', greeting: '' });

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await axios.get('http://localhost:8080/api/user/info', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    console.log('반환된 유저 정보 :', response.data);
                    setUser({
                        username: response.data.username,
                        name: response.data.username,
                    });
                } catch (error) {
                    console.error('사용자 정보를 불러오는 중 에러 발생 : ', error);
                }
            }
        };

        fetchUserData();
    }, []);

    return(
        <>

        <h4>{user.name} 님</h4>
        <button>로그아웃</button>
        </>
    )
}

export default TopHeader;