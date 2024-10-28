import React, { useState, useRef } from "react";
import './css/MainScreen.css';  // Import the CSS file
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import NextPage from './NextPage';  // 모달 컴포넌트 불러오기
import ImagePage from './ImagePage';

const MainScreen = () => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [view, setView] = useState('next');  // 모달 뷰 상태 ('next' 또는 'image')

  // Function to handle file upload (via input or drag & drop)
  const handleFileChange = (file) => {
    if (file) {
      setFile(URL.createObjectURL(file));
      setFileName(file.name);
    }
  };

  // Function to handle file deletion
  const handleFileDelete = () => {
    setFile(null);  // Remove the file preview
    setFileName("");  // Clear the file name
    fileInputRef.current.value = null;  // Reset file input to allow re-upload
  };

  const handleNextClick = () => {
    setIsModalOpen(true);  // 모달 열기
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);  // 모달 닫기
    setView('next');  // 모달 닫을 때 다시 첫 화면으로 리셋
  };

  // Handle drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === "application/pdf") {
      handleFileChange(droppedFile);  // Drop된 파일을 처리
    } else {
      alert("PDF 파일만 업로드 가능합니다.");
    }
  };

  // "다음" 버튼 클릭 시 ImagePage로 전환
  const handleNextPage = () => {
    setView('image');
  };

  return (
    <div className="container">
      {/* Left Section: Text Input for "발송 목적" */}
      <div className="leftSection">
        <h2>발송 목적</h2>
        <textarea
          placeholder="프롬프트 텍스트 입력"
          className="textInput"
        />
      </div>

      {/* Right Section: File Upload and PDF Preview */}
      <div className="rightSection">
        <h3>PDF 파일</h3>
        
        <div 
          className="pdfUploadSection" 
          onDragOver={handleDragOver} 
          onDrop={handleDrop}  // 드래그 앤 드롭 핸들러 추가
        >
          <div className="fileInputSection">
            {/* Custom File Input for uploading PDF */}
            <label className="customFileInput">
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => handleFileChange(e.target.files[0])}
                className="fileInput"
                ref={fileInputRef}  // Assign ref to file input for resetting
              />
              {fileName ? fileName : "파일 선택"}  {/* 파일 선택 시 파일 이름 표시, 없으면 기본 텍스트 */}
            </label>
            
            {/* Display the uploaded file name and delete icon */}
            {fileName && (
              <div className="fileInfo">
                <FontAwesomeIcon 
                  icon={faTrashAlt} 
                  className="deleteIcon" 
                  onClick={handleFileDelete}
                />
              </div>
            )}
          </div>

          {/* Conditional rendering of PDF preview or placeholder */}
          {file ? (
            <iframe
              src={file}
              title="pdf-preview"
              className="pdfPreview"
            />
          ) : (
            <div className="pdfPlaceholder">
              <p>PDF 파일 업로드 창</p>
              <p>(파일 선택 또는 드래그 앤 드롭)</p>  {/* 안내 메시지 추가 */}
            </div>
          )}
        </div>
      </div>

      {/* Next Button */}
      <button className="nextButton" onClick={handleNextClick}>다음</button>
    
      {/* 모달 렌더링 - 상태에 따라 다른 모달 표시 */}
      {isModalOpen && view === 'next' && <NextPage onNext={handleNextPage} onClose={handleCloseModal} />}
      {isModalOpen && view === 'image' && <ImagePage onClose={handleCloseModal} />}
    </div>
  );
};

export default MainScreen;
