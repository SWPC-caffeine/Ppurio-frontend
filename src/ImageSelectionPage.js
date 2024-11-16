import React, { useState, useEffect } from "react";
import "./css/ImageSelectionPage.css";

const ImageSelectionPage = ({ onSelectImage, onClose, summaryContent }) => {
  const [imageUrls, setImageUrls] = useState([]);  // 이미지 URL들을 저장할 상태 (초기값은 빈 배열)
  const [selectedImage, setSelectedImage] = useState(null);  // 선택된 이미지 저장할 상태

  useEffect(() => {
    // summaryContent가 변경될 때마다 서버에 요청을 보냄
    fetch(`${process.env.REACT_APP_SERVER_IP}/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: summaryContent }),  // 부모로부터 받은 summaryContent를 전송
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success && data.imageUrls) {  // 'imageUrls'로 변경
          // imageUrls가 배열로 직접 전달되므로 바로 사용
          setImageUrls(data.imageUrls);  // 서버에서 받은 이미지 URL들을 imageUrls 상태에 저장
        } else {
          console.error("서버 응답에 imageUrls가 없습니다.", data);  // 디버깅용
        }
      })
      .catch((error) => {
        console.error("이미지 로드 실패:", error);  // 오류 처리
      });
  }, [summaryContent]);  // summaryContent가 변경될 때마다 effect가 실행됨

  const handleImageClick = (url) => {
    setSelectedImage(url);  // 선택한 이미지 URL을 상태에 저장
  };

  const handleNextClick = () => {
    if (selectedImage) {
      onSelectImage(selectedImage);  // 선택된 이미지를 부모 컴포넌트에 전달
    } else {
      alert("이미지를 선택해주세요.");  // 이미지 선택을 하지 않으면 경고
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
                src={url}  // 서버에서 제공한 이미지 URL
                alt={`Option ${index + 1}`}
                className={`imageOption ${
                  selectedImage === url ? "selected" : ""
                }`}
                onClick={() => handleImageClick(url)}  // 이미지를 클릭하면 선택
              />
            ))
          ) : (
            <p>이미지를 불러오는 중입니다...</p>  // 이미지가 로딩되지 않으면 표시되는 메시지
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
