import React, { useState, useEffect } from "react";
import "./css/ImageSelectionPage.css";

const ImageSelectionPage = ({ onSelectImage, onClose }) => {
  const [imageUrls, setImageUrls] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetch("http://223.194.133.27:3030/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: summaryContent.join(" ") }), // 요약된 텍스트 전송
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setImageUrls(data.imagePaths); // 서버에서 받은 이미지 경로들
        }
      })
      .catch((error) => console.error("이미지 로드 실패:", error));
  }, []);

  const handleImageClick = (url) => {
    setSelectedImage(url);
  };

  const handleNextClick = () => {
    if (selectedImage) {
      onSelectImage(selectedImage); // 선택한 이미지를 ImagePage.js로 전달
    } else {
      alert("이미지를 선택해주세요.");
    }
  };

  return (
    <div className="modalOverlay">
      <div className="modalContent">
        <h3>이미지 선택</h3>
        <div className="imageGrid">
          {imageUrls.length > 0 ? (
            imageUrls.map((url, index) => (
              <img
                key={index}
                src={url} // 서버에서 제공한 이미지 경로
                alt={`Option ${index + 1}`}
                className={`imageOption ${
                  selectedImage === url ? "selected" : ""
                }`}
                onClick={() => handleImageClick(url)}
              />
            ))
          ) : (
            <p>이미지를 불러오는 중입니다...</p>
          )}
        </div>

        <button className="selectionNextButton" onClick={handleNextClick}>
          다음
        </button>
        <button className="closeButton" onClick={onClose}>
          닫기
        </button>
      </div>
    </div>
  );
};

export default ImageSelectionPage;
