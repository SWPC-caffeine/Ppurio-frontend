import React, { useState, useEffect } from 'react';
import './css/ImagePage.css';
import { useNavigate } from 'react-router-dom';
import Draggable from 'react-draggable';
import html2canvas from 'html2canvas';

const ImagePage = ({ pdfSummary, onClose }) => {
  const navigate = useNavigate();
  const [splitSummary, setSplitSummary] = useState([]);
  const [styles, setStyles] = useState({});

  useEffect(() => {
    if (pdfSummary) {
      setSplitSummary(pdfSummary.split('-').map((sentence) => sentence.trim()).filter(Boolean));
    }
  }, [pdfSummary]);

  const handleConfirmClick = () => {
    navigate('/send-message');
  };

  const handleSaveImage = () => {
    const imageContainer = document.querySelector('.imageContainer');

    html2canvas(imageContainer, {
      backgroundColor: null,
      useCORS: true,
    }).then((canvas) => {
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = 'customized_image.png';
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
            src={require('./image/imageExample.png')} 
            alt="생성된 이미지" 
            className="imagePreview" 
          />
          {/* Draggable text overlay */}
          <div className="textOverlay">
            {splitSummary.map((sentence, index) => (
              <div key={index} className="textControlGroup">
                <Draggable bounds=".imagePreview">
                  <div
                    className="overlayText"
                    style={{
                      color: styles[index]?.color || '#000',
                      fontSize: styles[index]?.fontSize || '16px',
                    }}
                  >
                    {sentence}
                  </div>
                </Draggable>
                
                {/* 고정된 글자색과 크기 조절 컨트롤 */}
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
                      onChange={(e) => handleFontSizeChange(index, e.target.value)}
                    /> px
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 오른쪽 하단에 위치한 확인과 저장 버튼 */}
        <div className="buttonContainer">
          <button className="confirmButton" onClick={handleConfirmClick}>확인</button>
          <button className="saveButton" onClick={handleSaveImage}>
            <img src={require('./image/imageDownload.png')} alt="저장" className="downloadIcon" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImagePage;
