import React, { useState, useEffect } from "react";
import "./css/ImageSelectionPage.css";

const ImageSelectionPage = ({ onSelectImage, onClose, summaryContent }) => {
  const [imageUrls, setImageUrls] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isImageGenerationComplete, setIsImageGenerationComplete] =
    useState(false);

  useEffect(() => {
    let progressInterval;

    if (loadingProgress < 97) {
      // 90%까지 1%씩 증가
      progressInterval = setInterval(() => {
        setLoadingProgress((prevProgress) => {
          if (prevProgress + 1 <= 97) {
            return prevProgress + 1;
          }
          clearInterval(progressInterval); // 90%에 도달하면 멈춤
          return 97;
        });
      }, 200); // 0.1초마다 1%씩 증가 (더 천천히)
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

  const handleImageClick = (url) => {
    setSelectedImage(url);
  };

  const handleNextClick = () => {
    if (selectedImage) {
      onSelectImage(selectedImage);
    } else {
      alert("이미지를 선택해주세요.");
    }
  };

  return (
    <div className="modalOverlay">
      <div className="modalContent">
        <h3>{isImageGenerationComplete ? "이미지 선택" : "이미지 생성중.."}</h3>{" "}
        {/* 텍스트 변경 */}
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
            imageUrls.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`Option ${index + 1}`}
                className={`imageOption ${
                  selectedImage === url ? "selected" : ""
                }`}
                onClick={() => handleImageClick(url)}
              />
            ))
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
            <button className="regenerateButton">이미지 재생성</button>
          </>
        )}
        <button className="closeButton" onClick={onClose}>
          닫기
        </button>
      </div>
    </div>
  );
};

export default ImageSelectionPage;
