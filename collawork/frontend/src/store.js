import { Color } from "three";
import { create } from "zustand";

export const projectStore = create((set, get)=> ({
    // 선택한 프로젝트 name 저장

    projectName : '', // 프로젝트 이름
    projectCreatedBy : '', // 프로젝트 생성자 
    managerEmail : '',  // 프로젝트 생성자 이메일
    managerName : '', // 프로젝트 생성자 이름
    projectData : '', // ProjectInformation 에서 불러온 project 관련 data 묶음
    userData : '', // ProjectInformation 에서 불러온 프로젝트 관리자의 data 묶음
    voteList:[], // 입력받은 투표 항목 배열
    listState:'',

    PlusProjectName: (value) => {
        set({projectName: value})
    },

    PlusProjectCreatedBy: (value) => {
        set({projectCreatedBy: value})
    },

    PlusManagerEmail: (value) => {
        set({managerEmail: value})
    },

    PlusManagerName: (value) => {
        set({managerName: value})
    },

    PlusProjectData: (value) => {
        set({projectData: value})
    },

    PlusUserData: (value) => {
        set({userData: value})
    },

    PlusVoteList: (value) => {
        set({voteList: value})
    },
    
    PlusListState: (value) => {
        set({listState:value})
    }

}))

export const calendarEvents = create((set, get) => ({
    id : '',
    title : '',
    start : '',
    end : '',
    allDay : true,
    description : '',
    createdBy : '',
    createdAt : '',
    projectId : '',
    
    color : '',

    setId : (value) => {set({id: value})},
    setTitle : (value) => {set({title: value})},
    setStart : (value) => {set({start: value})},
    setEnd : (value) => {set({end: value})},
    setAllDay : (value) => {set({allDay: value})},
    setDescription : (value) => {set({description: value})},
    setCreatedBy : (value) => {set({createdBy: value})},
    setCreatedAt : (value) => {set({createdAt: value})},
    setProjectId : (value) => {set({projectId: value})},
    
    setColor : (value) => {set({color: value})}

}));



export const stateValue = create((set, get)=> ({
    // projectPages의 show state 들 관리

    homeShow : '',
    chatShow : '',
    calShow : '',
    notiShow : '',
    voting : '',

    setHomeShow : (value) => {
        set({homeShow : value})
    },

    setChatShow : (value) => {
        set({chatShow : value})
    },

    setCalShow : (value) => {
        set({calShow : value})
    },

    setNotiShow : (value) => {
        set({notiShow : value})
    },

    setVotig : (value) => {
        set({voting : value})
    }

}));


// 프로젝트 참여자 목록
export const friendsList = create((set, get)=> ({

    participants: [],

    setParticipants:(value) => {
        set({setParticipants : value})
    }

}));

