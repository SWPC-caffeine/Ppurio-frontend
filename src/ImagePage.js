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
  const absoluteImageUrl =
    selectedImageUrl && selectedImageUrl.startsWith("http")
      ? selectedImageUrl
      : `http://223.194.133.27:3030/${selectedImageUrl}`;

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
    navigate("/send-message");
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

        <div className="captureArea" onClick={(e) => e.stopPropagation()}>
          <img
            src={require("./image/imageExample.png")}
            alt="생성된 이미지"
            className="imagePreview"
          />
          {/* 드래그 가능한 텍스트 오버레이 */}
          {splitSummary.map((sentence, index) => (
            <Draggable key={index} bounds=".imagePreview">
              <div
                className="overlayText"
                style={{
                  color: styles[index]?.color || '#000',
                  fontSize: styles[index]?.fontSize || '16px',
                  fontWeight: styles[index]?.fontWeight || 'normal',
                  fontFamily: styles[index]?.fontFamily || 'Arial',
                }}
                onClick={(e) => handleTextClick(index, e)}
              >
                {sentence}
              </div>
            </Draggable>
          ))}
          {/* 떠다니는 툴바 */}
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
        value={styles[selectedTextIndex]?.color || '#000'}
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
      />{' '}
      px
    </label>
    <button onClick={handleBoldToggle}>
      {styles[selectedTextIndex]?.fontWeight === 'bold' ? 'Normal' : 'Bold'}
    </button>
    <label>
      폰트:
      <select
        onChange={(e) => handleFontFamilyChange(e.target.value)}
        value={styles[selectedTextIndex]?.fontFamily || 'Arial'}
      >
        <option value="Arial">Arial</option>
        <option value="Verdana">Verdana</option>
        <option value="Times New Roman">Times New Roman</option>
        <option value="Georgia">Georgia</option>
        <option value="Courier New">Courier New</option>
        {/* Add more fonts as desired */}
      </select>
    </label>
  </div>
)}


        </div>

        {/* 확인과 저장 버튼 */}
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
