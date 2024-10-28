import React, { useState } from 'react';
import './css/NextPage.css';  // 스타일 파일

const NextPage = ({ onNext, onClose }) => {
  // State to manage the summarized PDF content
  const [summaryContent, setSummaryContent] = useState("여기에 PDF 요약 내용이 표시됩니다.");

  // Handle changes in the textarea
  const handleSummaryChange = (e) => {
    setSummaryContent(e.target.value);  // Update the state with the user's input
  };

  return (
    <div className="modalOverlay">
      <div className="modalContent">
        {/* 요약 화면 */}
        <div className="pdfSection">
          {/* PDF 요약 내용 */}
          <div className="pdfSummary">
            <div className = "pdfTitle">요약</div>
            <textarea
              className="pdfContentEditable"  // New class for styling the editable area
              value={summaryContent}           // Bind the value to the state
              onChange={handleSummaryChange}   // Handle changes in the textarea
              rows="10"                        // Define number of rows for the textarea
            />
          </div>
          {/* '다음' 버튼 */}
          <button className="nextButton2" onClick={onNext}>다음</button>
        </div>
      </div>
    </div>
  );
};

export default NextPage;
