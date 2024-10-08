import React from 'react';
import './NextPage.css';  // 스타일 파일

const NextPage = ({ onNext, onClose }) => {
  return (
    <div className="modalOverlay">
      <div className="modalContent">
        {/* 요약 화면 */}
        <div className="pdfSection">
          {/* PDF 요약 내용 */}
          <div className="pdfSummary">
            <p>요약</p>
            <div className="pdfContent">
              {/* PDF 내용이 여기에 표시됩니다 */}
            </div>
          </div>
          {/* '다음' 버튼 */}
          <button className="nextButton2" onClick={onNext}>다음</button>
        </div>
      </div>
    </div>
  );
};

export default NextPage;
