import React, { useState, useEffect } from "react";
import "./css/ImagePage.css";
import { useNavigate } from "react-router-dom";
import Draggable from "react-draggable";
import html2canvas from "html2canvas";

const ImagePage = ({ pdfSummary, selectedImageUrl, onClose }) => {
  const navigate = useNavigate();
  const [splitSummary, setSplitSummary] = useState([]);
  const [styles, setStyles] = useState({});

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
    const imageContainer = document.querySelector(".imageContainer");

    html2canvas(imageContainer, {
      backgroundColor: null,
      useCORS: true,
    }).then((canvas) => {
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = "customized_image.png";
      link.click();
    });
  };

  const handleColorChange = (index, color) => {
    setStyles((prevStyles) => ({
      ...prevStyles,
      [index]: { ...prevStyles[index], color },
    }));
  };

  const handleFontSizeChange = (index, fontSize) => {
    setStyles((prevStyles) => ({
      ...prevStyles,
      [index]: { ...prevStyles[index], fontSize: `${fontSize}px` },
    }));
  };

  return (
    <div className="modalImageOverlay">
      <div className="modalImageContent">
        <h3>커스터마이즈된 포스터</h3>

        <div className="imageContainer">
          <img
            src={absoluteImageUrl}
            alt="선택된 이미지"
            className="imagePreview"
          />
          <div className="textOverlay">
            {splitSummary.map((sentence, index) => (
              <div key={index} className="textControlGroup">
                <Draggable bounds=".imagePreview">
                  <div
                    className="overlayText"
                    style={{
                      color: styles[index]?.color || "#000",
                      fontSize: styles[index]?.fontSize || "16px",
                    }}
                  >
                    {sentence}
                  </div>
                </Draggable>

                <div className="inlineControls" data-html2canvas-ignore="true">
                  <label>
                    색상:
                    <input
                      type="color"
                      onChange={(e) => handleColorChange(index, e.target.value)}
                    />
                  </label>
                  <label>
                    글자 크기:
                    <input
                      defaultValue={16}
                      type="number"
                      min="10"
                      max="100"
                      onChange={(e) =>
                        handleFontSizeChange(index, e.target.value)
                      }
                    />{" "}
                    px
                  </label>
                </div>
              </div>
            ))}
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
