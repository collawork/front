import { useMemo, useState } from "react";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import ReactModule from "./ReactModule";

const Board = () => {

    const [contexts, setContents] = useState();

    const formats:string[] = [
        "header", "size", "font",
        "bold", "italic", "underline", "strike", "blockquote",
        "list", "bullet", "indent", "link", "image",
        "color", "background", "align",
        "script", "code-block", "clean"
    ];


    const modules:{}= useMemo(() => ({
        toolbar: {
             container: "#toolBar"
        },
    }), []);
   
    return (
        <div>
            <div id="toolBar">
                <ReactModule />
            </div>
            <ReactQuill theme="snow" modules={modules} formats={formats} 
            		style={{height: "200px", width: "600px"}}
                value={contexts}
                onChange={(e)=> setContents(e.target.value)}
                
                    />
        </div>
    )

}

export default Board;


// function Board(){

//     const modules = {
//         toolbar: {
//             container: [
//               ["image"],
//               [{ header: [1, 2, 3, 4, 5, false] }],
//               ["bold", "underline"],
//             ],
//           },
//     }
//     return(
//         <div>
//             <ReactQuill theme="snow"
//             style={{ width: "800px", height: "200px" }}
//                     modules={modules}
//             />
//         </div>
//     )



