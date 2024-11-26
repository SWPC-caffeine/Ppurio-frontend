import React, { useState, useEffect } from "react";
import "./css/ImageSelectionPage.css";
import leftIcon from "./image/leftIcon.png";

const ImageSelectionPage = ({ onSelectImage, onClose, summaryContent }) => {
  const [imageUrls, setImageUrls] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isImageGenerationComplete, setIsImageGenerationComplete] =
    useState(false);

  // 이미지 생성 및 진행 상황 처리
  useEffect(() => {
    let progressInterval;

    if (loadingProgress < 97) {
      // 97%까지 1%씩 증가
      progressInterval = setInterval(() => {
        setLoadingProgress((prevProgress) => {
          if (prevProgress + 1 <= 97) {
            return prevProgress + 1;
          }
          clearInterval(progressInterval); // 97%에 도달하면 멈춤
          return 97;
        });
      }, 200); // 0.2초마다 1%씩 증가
    } else if (loadingProgress === 97) {
      // 97%에서 멈추고, 이미지 생성 시작
      fetch(`${process.env.REACT_APP_SERVER_IP}/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: summaryContent }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success && data.imageUrls) {
            const imageArray = data.imageUrls.split(",");
            setImageUrls(imageArray);
            // 이미지가 생성되면 프로그레스 바를 100%로 설정
            setLoadingProgress(100);
            setIsImageGenerationComplete(true); // 이미지 생성 완료
          } else {
            console.error("서버 응답에 imageUrls가 없습니다.", data);
          }
        })
        .catch((error) => {
          console.error("이미지 로드 실패:", error);
        });
    }

    return () => clearInterval(progressInterval); // 컴포넌트가 언마운트되거나 업데이트될 때 interval을 정리
  }, [loadingProgress, summaryContent]);

  // 이미지 클릭 처리
  const handleImageClick = (url) => {
    setSelectedImage(url);
  };

  // "다음" 버튼 클릭 처리
  const handleNextClick = () => {
    if (selectedImage) {
      onSelectImage(selectedImage);
    } else {
      alert("이미지를 선택해주세요.");
    }
  };

  // "이미지 재생성" 버튼 클릭 시 처리
  const handleRegenerateClick = () => {
    setImageUrls([]); // 이미지 목록 초기화
    setLoadingProgress(0); // 진행 상태 초기화
    setIsImageGenerationComplete(false); // 이미지 생성 상태 초기화
    setSelectedImage(null); // 선택된 이미지 초기화
  };

  return (
    <div className="modalOverlay">
      <div className="modalContent">
        {/* 왼쪽 상단에 뒤로가기 화살표 추가 */}
        <button className="backButton" onClick={onClose}>
          <img src={leftIcon} alt="뒤로가기" />
        </button>

        <h3>{isImageGenerationComplete ? "이미지 확인" : "이미지 생성중.."}</h3>
        <div className="progressBarWrapper">
          {loadingProgress < 100 && (
            <>
              <div className="progressBar">
                <div
                  className="progressBarFill"
                  style={{ width: `${loadingProgress}%` }}
                ></div>
              </div>
              <p>{loadingProgress}%</p>
            </>
          )}
        </div>
        <div className="imageGrid">
          {imageUrls.length > 0 ? (
            <img
              src={imageUrls[0]} // 첫 번째 이미지만 사용
              alt="Selected Option"
              className={`imageOption ${
                selectedImage === imageUrls[0] ? "selected" : ""
              }`}
              onClick={() => handleImageClick(imageUrls[0])} // 첫 번째 이미지 클릭 이벤트 처리
            />
          ) : (
            <p></p> // 이미지가 로드될 때까지 아무것도 표시되지 않음
          )}
        </div>
        {/* 조건부 렌더링: 이미지가 있을 때만 버튼 표시 */}
        {imageUrls.length > 0 && (
          <>
            <button className="selectionNextButton" onClick={handleNextClick}>
              다음
            </button>
            <button
              className="regenerateButton"
              onClick={handleRegenerateClick}
            >
              이미지 재생성
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ImageSelectionPage;
