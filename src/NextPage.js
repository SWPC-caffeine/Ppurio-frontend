import React, { useState, useEffect } from "react";
import "./css/NextPage.css";
import ImageSelectionPage from "./ImageSelectionPage";
import ImagePage from "./ImagePage"; // ImagePage를 import합니다.

const NextPage = ({ Content = "", onNext, onClose }) => {
  const [summaryContent, setSummaryContent] = useState(Content);
  const [isImageSelectionOpen, setIsImageSelectionOpen] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState(null); // 선택된 이미지 URL 상태 추가
  const [isImagePageOpen, setIsImagePageOpen] = useState(false); // ImagePage를 표시하는 상태

  useEffect(() => {
    if (Content) {
      setSummaryContent(Content);
    }
  }, [Content]);

  const handleSummaryChange = (e) => {
    setSummaryContent(e.target.value);
  };

  const handleOpenImageSelection = () => {
    setIsImageSelectionOpen(true);
  };

  const handleSelectImage = (url) => {
    setSelectedImageUrl(url); // 선택된 이미지 URL 상태 업데이트
    setIsImageSelectionOpen(false); // 이미지 선택 페이지 닫기
    setIsImagePageOpen(true); // ImagePage를 열기 위해 상태를 true로 설정
  };

  return (
    <div className="modalOverlay">
      <div className="modalContent">
        <div className="pdfSection">
          <div className="pdfSummary">
            <div className="pdfTitle">요약</div>
            <textarea
              className="pdfContentEditable"
              value={summaryContent || ""}
              onChange={handleSummaryChange}
              rows="10"
            />
          </div>
          <button className="nextButton2" onClick={handleOpenImageSelection}>
            이미지 선택
          </button>
        </div>

        {/* 이미지 선택 모달 */}
        {isImageSelectionOpen && (
          <ImageSelectionPage
            summaryContent={summaryContent}
            onSelectImage={handleSelectImage} // 선택한 이미지를 전달받기 위해 props로 설정
            onClose={() => setIsImageSelectionOpen(false)}
          />
        )}

        {/* 선택된 이미지를 사용해 ImagePage를 렌더링 */}
        {isImagePageOpen && (
          <ImagePage
            pdfSummary={summaryContent}
            selectedImageUrl={selectedImageUrl} // 선택된 이미지 URL을 전달
            onClose={() => setIsImagePageOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default NextPage;
