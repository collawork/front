import { useState } from 'react';
import ReactModal from "react-modal";

const Aside = () => {
  const [newProjectShow, setNewProjectShow] = useState(false);
  const [title, setTitle] = useState("");
  const [contents, setContents] = useState("");
  const [textShow, setTextShow] = useState(false);
  const [selectShow, setSelectShow] = useState(false);
  const [modalShow1, setModalShow1] = useState(true);
  const [newShow, setNewShow] = useState(false);

  const modalCloseHandler = () => {
    setNewShow(false);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
  }

  return (
    <>
      <ReactModal
        isOpen={newShow}
        contentLabel="새 프로젝트"
        style={{
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: 600,
            borderRadius: 0,
            border: "none",
            padding: '20px',
          },
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
          }
        }}
      >
        <h2>프로젝트 만들기</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            placeholder="제목을 입력하세요"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            required
          />
          <textarea
            placeholder="설명을 입력하세요"
            value={contents}
            onChange={(e) => setContents(e.target.value)}
          />
          <input
            type="date"
            name="start-date"
            required
          />
          <div>
            <button type="submit">프로젝트 생성</button>
            <button type="button" onClick={modalCloseHandler}>취소</button>
          </div>
        </form>
      </ReactModal>

     
      <div className="aside">
        <div className="aside-top">
          <div>collawork</div>
          <button onClick={() => setNewShow(true)}>+ 새 프로젝트</button>
        </div>
        <div className="aside-bottom">
          <div className="project-list">
            <div className="project-item">프로젝트1</div>
            <div className="project-item">프로젝트2</div>
            <div className="project-item">프로젝트3</div>
            <div className="project-item">프로젝트4</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Aside;
