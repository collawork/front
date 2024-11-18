import { useState } from 'react';
import NewVoting from '../Voting/NewVoting';

const VotingList = () => {

  // const [show, setShow] = useState(false); // 새 vote 모달 핸들러
  const [modalShow, setModalShow] = useState(false); 

    return(
      <>
      <h3>투표 페이지</h3>
      <button onClick={() => setModalShow(true)}>+ 새 투표</button>
      {modalShow && <NewVoting setModalShow ={setModalShow}/>}
      </>
    )
}
export default VotingList;