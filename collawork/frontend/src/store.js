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

export const calendar = create((set, get) => ({

    title : '',
    start : '',
    end : '',
    allDay : '',
    description : '',






    // // 달력 관련 변수들..
    // // let formData; // fullcalendar에서 지원해 주는 기능.
    // const [title, setTitle] = useState("");
    // const [start, setStart] = useState("");
    // const [end, setEnd] = useState("");
    // const [allDay, setAllDay] = useState(true);
    // // let extendedProps; // fullcalendar에서 지원해주지 않는 기능.
    // const [description , setDescription] = useState("");
    // // const [projectId, setProjectId] = useState("");
    // const [createdBy, setCreatedBy] = useState("");
    // const [createdAt, setCreatedAt] = useState("");
    // // const [projectName, setProjectName] = useState([]);

    
}))