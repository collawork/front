import { create } from "zustand";

export const projectStore = create((set, get)=> ({
    // 선택한 프로젝트 name 저장

    projectName : '', // 프로젝트 이름
    projectCreatedBy : '', // 프로젝트 생성자 
    managerEmail : '',  // 프로젝트 생성자 이메일
    managerName : '', // 프로젝트 생성자 이름

    
    PlusProjectName: (value) => {
        set({projectName: value})
    },

    PlusProjectCreatedBy: (value) => {
        set({projectCreatedBy: value})
    },

    PlusManagerEmail : (value) => {
        set({managerEmail: value})
    },

    PlusManagerName : (value) => {
        set({managerName: value})
    },




}))

export const calendarUser = create((set, get) => ({

    title : '',
    start : '',
    end : '',
    allDay : '',
    description : '',
    createdBy : '',
    createdAt : '',

    PlusTitle : (value) => {set({title: value})},
    PlusStart : (value) => {set({start: value})},
    PlusEnd : (value) => {set({end: value})},
    PlusAllDay : (value) => {set({allDay: value})},
    PlusDescription : (value) => {set({description: value})},
    PlusCreatedBy : (value) => {set({createdBy: value})},
    PlusCreatedAt : (value) => {set({createdAt: value})}

}));

export const calendarProject = create((set, get) => ({

    title : '',
    start : '',
    end : '',
    allDay : '',
    description : '',
    projectId : '',
    createdBy : '',
    createdAt : '',

    PlusTitle : (value) => {set({title: value})},
    PlusStart : (value) => {set({start: value})},
    PlusEnd : (value) => {set({end: value})},
    PlusAllDay : (value) => {set({allDay: value})},
    PlusDescription : (value) => {set({description: value})},
    PlusProjectId : (value) => {set({projectId: value})},
    PlusCreatedBy : (value) => {set({createdBy: value})},
    PlusCreatedAt : (value) => {set({createdAt: value})}

}));