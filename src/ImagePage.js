import React, { useState, useEffect } from "react";
import "./css/ImagePage.css";
import { useNavigate } from "react-router-dom";
import Draggable from "react-draggable";
import html2canvas from "html2canvas";

const ImagePage = ({ pdfSummary, selectedImageUrl, onClose }) => {
  const navigate = useNavigate();
  const [splitSummary, setSplitSummary] = useState([]);
  const [styles, setStyles] = useState({});
  const [selectedTextIndex, setSelectedTextIndex] = useState(null);
  const [toolbarPosition, setToolbarPosition] = useState({ x: 0, y: 0 });

  // 절대 경로로 변환 (선택된 이미지 URL이 상대 경로인 경우)
  const absoluteImageUrl = selectedImageUrl.startsWith("http")
    ? selectedImageUrl
    : `${process.env.REACT_APP_SERVER_IP}/${selectedImageUrl}`;

  useEffect(() => {
    console.log("Selected Image URL:", selectedImageUrl);
    if (pdfSummary) {
      setSplitSummary(
        pdfSummary
          .split("-")
          .map((sentence) => sentence.trim())
          .filter(Boolean)
      );
    }
  }, [pdfSummary, selectedImageUrl]);

  const handleConfirmClick = () => {
    handleSaveImageAndUpload();
    navigate("/send-message");
  };
  
  const handleSaveImageAndUpload = () => {
    const captureElement = document.querySelector(".captureArea");
  
    html2canvas(captureElement, {
      backgroundColor: null,
      useCORS: true,
      scale: 1,
    }).then((canvas) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          console.error("Canvas blob 생성에 실패했습니다.");
          return;
        }
        const imageBlobUrl = URL.createObjectURL(blob); // Blob을 URL로 변환
        const formData = new FormData();
        formData.append("image", blob, "customized_image.png");
        formData.append("summarizedText", pdfSummary); // PDF 요약본도 함께 전송
        console.log(formData.blob);
        console.log(formData.pdfSummary);
        // 서버로 POST 요청 전송
        fetch(`${process.env.REACT_APP_SERVER_IP}/upload-image`, {
          method: "POST",
          body: formData,
        })
          .then((response) => response.json())
          .then((data) => {
            if (!data.filePath) {
              console.error("서버에서 filePath를 반환하지 않았습니다.");
              return;
            }
            
            console.log("서버 응답:", data);
            const fileUrl = `${process.env.REACT_APP_SERVER_IP}${data.filePath}`; // 서버 URL 생성
            console.log("생성된 서버 URL:", fileUrl);
            
            
            navigate("/send-message", {
              state: {
                imageBlobUrl,
                serverFileUrl: fileUrl, // MMS 전송에 사용할 서버 URL
                pdfSummary,
              },
            });
          })
          .catch((error) => {
            console.error("이미지 업로드 실패:", error);
          });
      }, "image/png");
    });
  };
  

  const handleSaveImage = () => {
    const captureElement = document.querySelector(".captureArea");

    html2canvas(captureElement, {
      backgroundColor: null,
      useCORS: true,
      scale: 1,
    }).then((canvas) => {
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = "customized_image.png";
      link.click();
    });
  };

  const handleColorChange = (color) => {
    if (selectedTextIndex !== null) {
      setStyles((prevStyles) => ({
        ...prevStyles,
        [selectedTextIndex]: { ...prevStyles[selectedTextIndex], color },
      }));
    }
  };

  const handleFontSizeChange = (fontSize) => {
    if (selectedTextIndex !== null) {
      setStyles((prevStyles) => ({
        ...prevStyles,
        [selectedTextIndex]: {
          ...prevStyles[selectedTextIndex],
          fontSize: `${fontSize}px`,
        },
      }));
    }
  };
  const handleBoldToggle = () => {
    if (selectedTextIndex !== null) {
      setStyles((prevStyles) => ({
        ...prevStyles,
        [selectedTextIndex]: {
          ...prevStyles[selectedTextIndex],
          fontWeight: prevStyles[selectedTextIndex]?.fontWeight === 'bold' ? 'normal' : 'bold',
        },
      }));
    }
  };
  
  const handleFontFamilyChange = (fontFamily) => {
    if (selectedTextIndex !== null) {
      setStyles((prevStyles) => ({
        ...prevStyles,
        [selectedTextIndex]: { ...prevStyles[selectedTextIndex], fontFamily },
      }));
    }
  };
  
  const handleTextClick = (index, event) => {
    event.stopPropagation();
    setSelectedTextIndex(index);
    // 툴바 위치 설정
    const rect = event.target.getBoundingClientRect();
    const containerRect = document
      .querySelector(".captureArea")
      .getBoundingClientRect();
    setToolbarPosition({
      x: rect.left - containerRect.left,
      y: rect.top - containerRect.top - 50,
    });
  };

  const handleContainerClick = () => {
    setSelectedTextIndex(null);
  };

  return (
    <div className="modalImageOverlay" onClick={handleContainerClick}>
      <div className="modalImageContent">
  <h3>커스터마이즈된 포스터</h3>
  <div className="gridContainer">
    <div className="sideBar leftSideBar">
    </div>
    <div className="captureAreaWrapper">
      <div className="captureArea" onClick={(e) => e.stopPropagation()}>
        <img
          src={absoluteImageUrl}
          alt="생성된 이미지"
          className="imagePreview"
        />

        {splitSummary.map((sentence, index) => (
          <Draggable key={index} bounds=".captureArea">
            <div
              className="overlayText"
              style={{
                color: styles[index]?.color || "#000",
                fontSize: styles[index]?.fontSize || "16px",
                fontWeight: styles[index]?.fontWeight || "normal",
                fontFamily: styles[index]?.fontFamily || "Arial",
              }}
              onClick={(e) => handleTextClick(index, e)}
            >
              {sentence}
            </div>
          </Draggable>
        ))}
        {selectedTextIndex !== null && (
          <div
            className="floatingToolbar"
            style={{ left: toolbarPosition.x, top: toolbarPosition.y }}
            onClick={(e) => e.stopPropagation()}
            data-html2canvas-ignore="true"
          >
            <label>
              색상:
              <input
                type="color"
                value={styles[selectedTextIndex]?.color || "#000"}
                onChange={(e) => handleColorChange(e.target.value)}
              />
            </label>
            <label>
              글자 크기:
              <input
                type="number"
                min="10"
                max="100"
                value={parseInt(styles[selectedTextIndex]?.fontSize) || 16}
                onChange={(e) => handleFontSizeChange(e.target.value)}
              />{" "}
              px
            </label>
            <button onClick={handleBoldToggle}>
              {styles[selectedTextIndex]?.fontWeight === "bold"
                ? "Normal"
                : "Bold"}
            </button>
            <label>
              폰트:
              <select
                onChange={(e) => handleFontFamilyChange(e.target.value)}
                value={styles[selectedTextIndex]?.fontFamily || "Arial"}
              >
                <option value="Arial">Arial</option>
                <option value="Verdana">Verdana</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Georgia">Georgia</option>
                <option value="Courier New">Courier New</option>
                <option value="BlackHanSans-Regular">
                  BlackHanSans-Regular
                </option>
                <option value="CookieRun Black">CookieRun Black</option>
                <option value="CookieRun Bold">CookieRun Bold</option>
                <option value="CookieRun Regular">CookieRun Regular</option>
                <option value="양진체v0.9_otf">양진체v0.9_otf</option>
              </select>
            </label>
          </div>
        )}
      </div>
    </div>
    <div className="sideBar rightSideBar">
    </div>
  </div>
  <div className="buttonContainer">
    <button className="confirmButton" onClick={handleConfirmClick}>
      확인
    </button>
    <button className="saveButton" onClick={handleSaveImage}>
      <img
        src={require("./image/imageDownload.png")}
        alt="저장"
        className="downloadIcon"
      />
    </button>
  </div>
</div>

    </div>
  );
};

export default ImagePage;
