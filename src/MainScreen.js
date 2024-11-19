import React, { useState, useRef } from "react";
import "./css/MainScreen.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import NextPage from "./NextPage";
import ImagePage from "./ImagePage";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar"; // 원형 차트
import "react-circular-progressbar/dist/styles.css"; // 스타일
import mammoth from "mammoth";

const MainScreen = () => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [userText, setUserText] = useState("");
  const [previewContent, setPreviewContent] = useState("");
  const [summaryContent, setSummaryContent] = useState("");
  const fileInputRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [view, setView] = useState("next");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0); // 로딩 진행도

  const handleFileChange = async (file) => {
    if (file) {
      setFile(file);
      setFileName(file.name);
      setPreviewContent("");

      if (file.type === "application/pdf") {
        setPreviewContent(
          <iframe
            src={URL.createObjectURL(file)}
            title="file-preview"
            className="pdfPreview"
          />
        );
      } else if (
        file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
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
      setPreviewContent(
        <div dangerouslySetInnerHTML={{ __html: result.value }} />
      );
    } catch (error) {
      console.error("Word 파일 변환 중 오류 발생:", error);
      setPreviewContent(<p>Word 파일을 변환하는 데 실패했습니다.</p>);
    }
  };

  const handleFileDelete = () => {
    setFile(null);
    setFileName("");
    setPreviewContent("");
    fileInputRef.current.value = null;
  };

  const handleNextClick = async () => {
    if (!file || !userText) {
      return;
    }

    setIsLoading(true);
    setLoadingProgress(0); // 진행도 초기화

    const formData = new FormData();
    formData.append("file", file);
    formData.append("userText", userText);

    try {
      // 로딩 진행도 증가
      const interval = setInterval(() => {
        setLoadingProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 200); // 200ms마다 10%씩 증가

      const response = await fetch(
        `${process.env.REACT_APP_SERVER_IP}/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      if (!response.ok) {
        throw new Error("파일 업로드에 실패했습니다.");
      }

      const data = await response.json();
      setSummaryContent(data.summary);
      setIsModalOpen(true);
    } catch (error) {
      console.error("업로드 중 오류 발생:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setView("next");
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
    }
  };

  const isValidFileType = (file) => {
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    return allowedTypes.includes(file.type);
  };

  const handleNextPage = () => {
    setView("image");
  };

  const isNextButtonEnabled = file && userText;

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
                accept=".pdf,.docx"
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
            <div className="filePreview">{previewContent}</div>
          ) : (
            <div className="pdfPlaceholder">
              <p>파일 업로드 창</p>
              <p>(파일 선택 또는 드래그 앤 드롭)</p>
            </div>
          )}
        </div>
      </div>

      <button
        className={`nextButton ${isNextButtonEnabled ? "active" : ""}`}
        onClick={isNextButtonEnabled ? handleNextClick : null}
      >
        다음
      </button>

      {isLoading && (
        <div className="overlay">
          <div className="loadingContainer">
            <CircularProgressbar
              value={loadingProgress}
              text={`${loadingProgress}%`}
              styles={buildStyles({
                textColor: "#ffffff", // 텍스트 색상
                pathColor: "#6a99ff", // 진행 경로 색상
                trailColor: "#4a4a4a", // 진행 경로 배경색
              })}
            />
          </div>
        </div>
      )}

      {isModalOpen && view === "next" && (
        <NextPage
          Content={summaryContent}
          onNext={handleNextPage}
          onClose={handleCloseModal}
        />
      )}
      {isModalOpen && view === "image" && (
        <ImagePage pdfSummary={summaryContent} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default MainScreen;
