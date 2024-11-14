import { create } from "zustand";

export const projectStore = create((set, get)=> ({
    // 선택한 프로젝트 name 저장

    projectName : '', // 프로젝트 이름
    projectCreatedBy : '', // 프로젝트 생성자 
    managerEmail : '',  // 프로젝트 생성자 이메일
    managerName : '', // 프로젝트 생성자 이름
    projectData : '',
    userData : '',

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
    }




}))

export const calendarUserStore = create((set, get) => ({

    title : '',
    start : '',
    end : '',
    allDay : true,
    description : '',
    createdBy : '',
    //createdAt : '',

    setTitle : (value) => {set({title: value})},
    setStart : (value) => {set({start: value})},
    setEnd : (value) => {set({end: value})},
    setAllDay : (value) => {set({allDay: value})},
    setDescription : (value) => {set({description: value})},
    setCreatedBy : (value) => {set({createdBy: value})},
    //setCreatedAt : (value) => {set({createdAt: value})}

}));

export const calendarProject = create((set, get) => ({

    title : '',
    start : '',
    end : '',
    allDay : true,
    description : '',
    projectId : '',
    createdBy : '',
    //createdAt : '',

    setTitle : (value) => {set({title: value})},
    setStart : (value) => {set({start: value})},
    setEnd : (value) => {set({end: value})},
    setAllDay : (value) => {set({allDay: value})},
    setDescription : (value) => {set({description: value})},
    setProjectId : (value) => {set({projectId: value})},
    setCreatedBy : (value) => {set({createdBy: value})},
    //setCreatedAt : (value) => {set({createdAt: value})}

}));