import {projectStore} from '../../store';

const ProjectChat = () => {

    const {projectData} = projectStore(); // zustand 에 저장되어 있는 project data 묶음
    console.log(projectData);
    console.log(projectData.id);
    console.log(projectData.projectName);
    
    return(
        <h2>프로젝트 채팅</h2>
    )
};
export default ProjectChat;