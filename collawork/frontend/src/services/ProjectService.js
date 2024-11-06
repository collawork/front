import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;

const newProjctInsert =  async(data) => {
    const title = data.title;
    const context = data.context;

    const token = localStorage.getItem('token');
    return await axios.post(`${API_URL}/api/project/newproject`,{
        title,
        context
    },{
        headers : {
             'Authorization': `Bearer ${token}`
        }
    })
};

const ProjectService = {
    newProjctInsert
}

export default ProjectService;
