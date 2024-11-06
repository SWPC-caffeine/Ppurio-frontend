// NextPage.js
import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import './css/NextPage.css';  // 병합된 CSS 파일

const NextPage = ({ Content = "", onNext, onClose }) => {
  const [summaryContent, setSummaryContent] = useState(Content);
  const [selectedFont, setSelectedFont] = useState('Arial');

  useEffect(() => {
    if (Content) {
      setSummaryContent(Content);
    }
  }, [Content]);

  const handleSummaryChange = (e) => {
    setSummaryContent(e.target.value);
  };

  const handleFontChange = (selectedOption) => {
    setSelectedFont(selectedOption.value);
  };

  // 폰트 목록
  const fonts = [
    'Arial',
    'Times New Roman',
    'Georgia',
    'Courier New',
    'Verdana',
    'Tahoma',
    'Trebuchet MS',
    'Lucida Console',
    'Comic Sans MS',
    '궁서' // 예시로 궁서체 추가
  ];

  // 폰트 옵션 생성
  const fontOptions = fonts.map((font) => ({
    value: font,
    label: font,
  }));

  // 커스텀 스타일 적용
  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      fontFamily: state.data.value,
    }),
    singleValue: (provided, state) => ({
      ...provided,
      fontFamily: state.data.value,
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999, // 드롭다운 메뉴가 다른 요소 위에 표시되도록 설정
    }),
  };

  return (
    <div className="modalOverlay">
      <div className="modalContent">
        {/* 요약 화면 */}
        <div className="pdfSection">
          {/* PDF 요약 내용 */}
          <div className="pdfSummary">
            <div className="pdfTitle">요약</div>
            <textarea
              className="pdfContentEditable"
              value={summaryContent || ""}
              onChange={handleSummaryChange}
              rows="10"
              style={{ fontFamily: selectedFont }}
            />
            {/* 폰트 선택 드롭다운 */}
            <div className="fontSelector">
              <label htmlFor="fontSelect">폰트: </label>
              <div className="fontSelectWrapper">
                <Select
                  id="fontSelect"
                  options={fontOptions}
                  value={{ value: selectedFont, label: selectedFont }}
                  onChange={handleFontChange}
                  styles={customStyles}
                  menuPlacement="top" // 드롭다운 메뉴가 위로 열리도록 설정 (필요에 따라 조정)
                />
              </div>
            </div>
          </div>
          {/* '다음' 버튼 */}
          <button className="nextButton2" onClick={onNext}>다음</button>
        </div>
      </div>
    </div>
  );
};

export default NextPage;
