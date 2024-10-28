import React, { useState, useRef } from "react";
import './css/MainScreen.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import NextPage from './NextPage';
import ImagePage from './ImagePage';

const MainScreen = () => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [userText, setUserText] = useState("");  // 프롬프트 텍스트 입력 상태 추가
  const fileInputRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [view, setView] = useState('next');

  const handleFileChange = (file) => {
    if (file) {
      setFile(file);  // setFile을 통해 실제 파일 객체 저장
      setFileName(file.name);
    }
  };

  const handleFileDelete = () => {
    setFile(null);
    setFileName("");
    fileInputRef.current.value = null;
  };

  // 서버에 파일과 텍스트 데이터 전송하기
  const handleNextClick = async () => {
    if (!file || !userText) {
      alert("PDF 파일과 텍스트를 모두 입력해주세요.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);  // PDF 파일 추가
    formData.append("userText", userText);  // 사용자 텍스트 추가
    console.log("FormData 내용:", formData); // FormData의 내용을 확인
    try {
      const response = await fetch("http://223.194.129.121:3030/upload", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("파일 업로드에 실패했습니다.");
      }
      alert("파일이 성공적으로 업로드되었습니다.");
      setIsModalOpen(true);
    } catch (error) {
      console.error("업로드 중 오류 발생:", error);
      // pdf에서 추출한 문자가 8192자가 넘으면 gpt의 요약 input으로 넣을 수가 없음
      alert("파일 업로드에 실패했습니다. 사유: 아마 pdf의 내용이 너무 많아서 그럴 것임(동건)");
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setView('next');
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === "application/pdf") {
      handleFileChange(droppedFile);
    } else {
      alert("PDF 파일만 업로드 가능합니다.");
    }
  };

  const handleNextPage = () => {
    setView('image');
  };

  return (
    <div className="container">
      <div className="leftSection">
        <h2>발송 목적</h2>
        <textarea
          placeholder="프롬프트 텍스트 입력"
          className="textInput"
          value={userText}
          onChange={(e) => setUserText(e.target.value)}  // 사용자 입력을 상태로 저장
        />
      </div>

      <div className="rightSection">
        <h3>PDF 파일</h3>
        
        <div 
          className="pdfUploadSection" 
          onDragOver={handleDragOver} 
          onDrop={handleDrop}
        >
          <div className="fileInputSection">
            <label className="customFileInput">
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => handleFileChange(e.target.files[0])}
                className="fileInput"
                ref={fileInputRef}
              />
              {fileName ? fileName : "파일 선택"}
            </label>
            
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

          {file ? (
            <iframe
              src={URL.createObjectURL(file)}
              title="pdf-preview"
              className="pdfPreview"
            />
          ) : (
            <div className="pdfPlaceholder">
              <p>PDF 파일 업로드 창</p>
              <p>(파일 선택 또는 드래그 앤 드롭)</p>
            </div>
          )}
        </div>
      </div>

      <button className="nextButton" onClick={handleNextClick}>다음</button>
    
      {isModalOpen && view === 'next' && <NextPage onNext={handleNextPage} onClose={handleCloseModal} />}
      {isModalOpen && view === 'image' && <ImagePage onClose={handleCloseModal} />}
    </div>
  );
};

export default MainScreen;
