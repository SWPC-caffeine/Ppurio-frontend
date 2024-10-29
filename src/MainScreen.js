import React, { useState, useRef } from "react";
import './css/MainScreen.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import NextPage from './NextPage';
import ImagePage from './ImagePage';
import LoadingSpinner from './loadingSpinner'; // 로딩 스피너 임포트
import mammoth from "mammoth"; // Mammoth.js 임포트

const MainScreen = () => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [userText, setUserText] = useState("");  // 프롬프트 텍스트 입력 상태 추가
  const [previewContent, setPreviewContent] = useState(""); // 미리보기 콘텐츠 상태 추가
  const fileInputRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [view, setView] = useState('next');
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가

  const handleFileChange = async (file) => {
    if (file) {
      setFile(file);  // setFile을 통해 실제 파일 객체 저장
      setFileName(file.name);
      setPreviewContent(""); // 기존 미리보기 내용 초기화

      // 파일 형식에 따라 미리보기 처리
      if (file.type === "application/pdf") {
        setPreviewContent(<iframe src={URL.createObjectURL(file)} title="file-preview" className="pdfPreview" />);
      } else if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        // .docx 파일 처리
        await handleWordFilePreview(file);
      } else {
        setPreviewContent(<p>미리보기가 지원되지 않는 파일 형식입니다.</p>);
      }
    }
  };

  const handleWordFilePreview = async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.convertToHtml({ arrayBuffer });
      setPreviewContent(<div dangerouslySetInnerHTML={{ __html: result.value }} />); // 변환된 HTML 설정
    } catch (error) {
      console.error("Word 파일 변환 중 오류 발생:", error);
      setPreviewContent(<p>Word 파일을 변환하는 데 실패했습니다.</p>);
    }
  };

  const handleFileDelete = () => {
    setFile(null);
    setFileName("");
    setPreviewContent(""); // 미리보기 내용 초기화
    fileInputRef.current.value = null;
  };

  const handleNextClick = async () => {
    if (!file || !userText) {
      alert("파일과 텍스트를 모두 입력해주세요.");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("userText", userText);
    try {
      const response =  await fetch(`${process.env.REACT_APP_SERVER_IP}/upload`, {
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
      alert("파일 업로드에 실패했습니다. 사유: 파일 크기나 형식 문제일 수 있습니다.");
    } finally {
      setIsLoading(false);
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
    if (droppedFile && isValidFileType(droppedFile)) {
      handleFileChange(droppedFile);
    } else {
      alert("지원되는 파일 형식만 업로드 가능합니다.");
    }
  };

  const isValidFileType = (file) => {
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];
    return allowedTypes.includes(file.type);
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
          onChange={(e) => setUserText(e.target.value)}
        />
      </div>

      <div className="rightSection">
        <h3>파일 업로드</h3>
        
        <div 
          className="pdfUploadSection" 
          onDragOver={handleDragOver} 
          onDrop={handleDrop}
        >
          <div className="fileInputSection">
            <label className="customFileInput">
              <input
                type="file"
                accept=".pdf,.docx"  // 허용되는 파일 확장자 설정
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

          {previewContent ? (
            <div className="filePreview">
              {previewContent}
            </div>
          ) : (
            <div className="pdfPlaceholder">
              <p>파일 업로드 창</p>
              <p>(파일 선택 또는 드래그 앤 드롭)</p>
            </div>
          )}
        </div>
      </div>

      <button className="nextButton" onClick={handleNextClick}>다음</button>

      {isLoading && <LoadingSpinner />} {/* 로딩 중일 때 로딩 스피너 표시 */}
    
      {isModalOpen && view === 'next' && <NextPage onNext={handleNextPage} onClose={handleCloseModal} />}
      {isModalOpen && view === 'image' && <ImagePage onClose={handleCloseModal} />}
    </div>
  );
};

export default MainScreen;
