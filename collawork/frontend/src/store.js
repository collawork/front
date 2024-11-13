import { create } from "zustand";

export const projectStore = create((set, get)=> ({
    // 선택한 프로젝트 name 저장

    projectName : '', // 프로젝트 이름

    
    PlusProjectName: (value) => {
        set({projectName: value})
    }
}))