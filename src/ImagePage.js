import React, { useState, useEffect } from 'react';
import './css/ImagePage.css';
import { useNavigate } from 'react-router-dom';
import Draggable from 'react-draggable';

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
        <div className="modalImageTitle">커스터마이즈된 포스터</div>

        <div className="imagePreview">
          <img src={require('./image/imageExample.png')} alt="생성된 이미지" />
          {/* 각 문장을 스티커처럼 드래그 가능한 요소로 만듭니다 */}
          {splitSummary.map((sentence, index) => (
            <Draggable key={index} bounds="parent">
              <div
                className="placedText"
                style={{
                  color: styles[index]?.color || '#000',
                  fontSize: styles[index]?.fontSize || '16px',
                  position: 'absolute',
                  transform: 'translate(-50%, -50%)',
                  cursor: 'move',
                  zIndex: 10,
                }}
              >
                {sentence}
              </div>
            </Draggable>
          ))}
        </div>

        <button className="imageSaveButton" onClick={onClose}></button>
        <button className="confirmButton" onClick={handleConfirmClick}>확인</button>
      </div>

      <div className="summaryContainer">
        <h3>PDF 요약 내용</h3>
        {splitSummary.map((sentence, index) => (
          <div key={index} className="sentenceContainer">
            <div className="controls">
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
  );
};

export default ImagePage;
