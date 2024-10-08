import React from 'react';
import './ImagePage.css';  // 스타일 파일

const ImagePage = ({ onClose }) => {
  return (
    <div className="modalImageOverlay">
      <div className='modalImageContent'>
        {/* 이미지 화면 */}
        <div className="imagePreview">
          <p>생성된 이미지</p>
          <img src={require('./image/imageExample.jpeg')} alt="생성된 이미지" />  {/* 이미지 파일 경로 수정 */}
          {/* 확인 버튼 */}
          <button className="confirmButton" onClick={onClose}>확인</button>
        </div>
      </div>
    </div>
  );
};

export default ImagePage;
