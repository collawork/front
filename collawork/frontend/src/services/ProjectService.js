import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const newProjctInsert = async (data) => {

    const title = data.title;
    const context = data.context;
    console.log(title);
    console.log(context);

    function Send(){
        console.log(title);
        console.log(context);
        axios(
            {
                url:`${API_URL}/api/user/projects/newproject`,
                method: 'post',
                data: {
                    title:title, context:context
                },
                baseURL:'http://localhost:8080',
                withCredentials: true,
            }
        ).then(function(response){
            console.log(response.data)
        }
    )
    }

    // const token = localStorage.getItem('token');

    
    // const requestData = {
    //     title,
    //     context
    // };
    // console.log(token);

    // try {
    //     const response = await axios.post(
    //         `${API_URL}/api/user/projects/newproject`,
    //         requestData,  
    //         {
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Authorization': `Bearer ${token}`  
    //             },
    //             withCredentials: true  
    //         }
    //     );

    //     console.log("요청 응답:", response); 

    //     return response;
        
    // } catch (error) {
       
    //     console.error('Error while creating project:', error);
    //     throw error;
    // }
};

const ProjectService = {
    newProjctInsert
};

export default ProjectService;
