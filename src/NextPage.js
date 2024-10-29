import React, { useState, useEffect } from 'react';
import './css/NextPage.css';  // 스타일 파일

const NextPage = ({ Content = "", onNext, onClose }) => { // 기본값을 빈 문자열로 설정
  // State to manage the summarized PDF content
  const [summaryContent, setSummaryContent] = useState(Content);

  useEffect(() => {
    if (Content) {
      setSummaryContent(Content);  // Content prop 변경 시 상태 업데이트
    }
  }, [Content]);

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
            <div className="pdfTitle">요약</div>
            <textarea
              className="pdfContentEditable"  // New class for styling the editable area
              value={summaryContent || ""}     // Bind the value to the state, 기본값으로 빈 문자열 사용
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
