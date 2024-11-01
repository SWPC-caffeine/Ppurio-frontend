import React from 'react';
import './css/ImagePage.css';  // 스타일 파일
import { useNavigate } from 'react-router-dom';  // useNavigate import

const ImagePage = ({ onClose }) => {
  const navigate = useNavigate();  // navigate 함수 설정

  const handleConfirmClick = () => {
    navigate('/send-message');  // '/send-message' 경로로 이동
  };

  return (
    <div className="modalImageOverlay">
      <div className="modalImageContent">
        {/* 제목 추가 */}
        <div className="modalImageTitle">생성된 이미지</div>
        {/* 이미지 화면 */}
        <div className="imagePreview">
          <img src={require('./image/imageExample.jpeg')} alt="생성된 이미지" />  {/* 이미지 파일 경로 수정 */}
        </div>
        {/*이미지 저장 버튼*/}
        <button className = "imageSaveButton" img = "src/imageDownload.png" onClick={onClose}></button>
        {/* 확인 버튼 */}
        <button className="confirmButton" onClick={handleConfirmClick}>확인</button>
      </div>
    </div>
  );
};

export default ImagePage;
