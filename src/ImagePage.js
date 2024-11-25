import React, { useState, useEffect } from "react";
import "./css/ImagePage.css";
import { useNavigate } from "react-router-dom";
import Draggable from "react-draggable";
import html2canvas from "html2canvas";

const ImagePage = ({ pdfSummary, selectedImageUrl, onClose }) => {
  const navigate = useNavigate();
  const [texts, setTexts] = useState([]);
  const [selectedTextIds, setSelectedTextIds] = useState([]); // 다중 선택을 위한 배열
  const [mode, setMode] = useState("move"); // 'move' 또는 'edit'

  // 모드 변경 시 선택된 텍스트 해제
  useEffect(() => {
    if (mode !== "edit") {
      setSelectedTextIds([]); // 모드 변경 시 다중 선택 초기화
    }
  }, [mode]);

  // 절대 경로로 변환 (선택된 이미지 URL이 상대 경로인 경우)
  const absoluteImageUrl = selectedImageUrl.startsWith("http")
    ? selectedImageUrl
    : `${process.env.REACT_APP_SERVER_IP}/${selectedImageUrl}`;

  useEffect(() => {
    if (pdfSummary) {
      const textHeight = 16; // 텍스트 크기
      const padding = 10; // 텍스트 간 간격
      const initialYOffset = 20; // 첫 번째 텍스트의 시작 위치

      const initialTexts = pdfSummary
        .split("-")
        .map((sentence, index) => ({
          id: index, // 고유 ID
          text: sentence.trim(),
          position: {
            x: 20, // 텍스트가 이미지의 왼쪽에서 20px 떨어진 위치
            y: initialYOffset + index * (textHeight + padding) - 550, // 위에서부터 텍스트 간격 계산
          },
          style: {
            color: "#000",
            fontSize: `${textHeight}px`,
            fontWeight: "normal",
            fontFamily: "Arial",
          },
        }))
        .filter((item) => item.text);
      setTexts(initialTexts);
    }
  }, [pdfSummary]);

  const handleConfirmClick = () => {
    handleSaveImageAndUpload();
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

  const handleSaveImageAndUpload = () => {
    const captureElement = document.querySelector(".captureArea");

    html2canvas(captureElement, {
      backgroundColor: null,
      useCORS: true,
      scale: 1,
    }).then((canvas) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            console.error("Canvas blob 생성에 실패했습니다.");
            return;
          }
          const imageBlobUrl = URL.createObjectURL(blob);
          const formData = new FormData();
          formData.append("image", blob, "customized_image.png");
          formData.append("summarizedText", pdfSummary);
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
              const fileUrl = `${process.env.REACT_APP_SERVER_IP}${data.filePath}`;
              navigate("/send-message", {
                state: {
                  imageBlobUrl,
                  serverFileUrl: fileUrl,
                  pdfSummary,
                },
              });
            })
            .catch((error) => {
              console.error("이미지 업로드 실패:", error);
            });
        },
        "image/png"
      );
    });
  };

  const handleTextClick = (id, event) => {
    event.stopPropagation();

    if (event.ctrlKey || event.metaKey) {
      // Ctrl(Mac의 경우 Command) 키를 눌렀을 때 다중 선택
      setSelectedTextIds((prevSelected) =>
        prevSelected.includes(id)
          ? prevSelected.filter((textId) => textId !== id) // 이미 선택된 경우 제거
          : [...prevSelected, id] // 선택된 경우 추가
      );
    } else {
      // Ctrl 키를 누르지 않았을 때는 단일 선택
      setSelectedTextIds([id]);
    }
  };

  const handleStyleChange = (styleType, value) => {
    setTexts((prev) =>
      prev.map((text) =>
        selectedTextIds.includes(text.id)
          ? { ...text, style: { ...text.style, [styleType]: value } }
          : text
      )
    );
  };

  const handleBoldToggle = () => {
    setTexts((prev) =>
      prev.map((text) =>
        selectedTextIds.includes(text.id)
          ? {
              ...text,
              style: {
                ...text.style,
                fontWeight:
                  text.style.fontWeight === "bold" ? "normal" : "bold",
              },
            }
          : text
      )
    );
  };

  const handleTextDelete = () => {
    setTexts((prev) => prev.filter((text) => !selectedTextIds.includes(text.id)));
    setSelectedTextIds([]);
  };

  const fontSizeValue = (() => {
    const selectedTexts = texts.filter((text) =>
      selectedTextIds.includes(text.id)
    );
    const fontSizes = selectedTexts.map((text) =>
      parseInt(text.style.fontSize)
    );
    const uniqueFontSizes = [...new Set(fontSizes)];
    if (uniqueFontSizes.length === 1) {
      return uniqueFontSizes[0];
    } else {
      return "";
    }
  })();
  

  return (
    <div className="modalImageOverlay">
      <div className="modalImageContent">
        <h3>포스터 편집</h3>

        {/* 모드 전환 버튼 */}
        <div className="modeSwitchContainer">
          <button
            className={
              mode === "move" ? "activeModeButton" : "confirmButton"
            }
            onClick={() => setMode("move")}
          >
            이동 모드
          </button>
          <button
            className={
              mode === "edit" ? "activeModeButton" : "confirmButton"
            }
            onClick={() => setMode("edit")}
          >
            편집 모드
          </button>
        </div>

        {/* 편집 모드에서 툴바를 이미지 영역 밖에 배치 */}
        {mode === "edit" && selectedTextIds.length > 0 && (
          <div
            className="floatingToolbar"
            data-html2canvas-ignore="true"
            onClick={(e) => e.stopPropagation()}
          >
            <label>
              색상:
              <input
                type="color"
                onChange={(e) => handleStyleChange("color", e.target.value)}
              />
            </label>
            <label>
            글자 크기:
            <input
              type="number"
              min="10"
              max="100"
              value={fontSizeValue}
              onChange={(e) =>
                handleStyleChange("fontSize", `${e.target.value}px`)
              }
            />
          </label>
            <button onClick={handleBoldToggle}>Bold</button>
            <label>
              폰트:
              <select
                onChange={(e) =>
                  handleStyleChange("fontFamily", e.target.value)
                }
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
              </select>
            </label>
            <button onClick={handleTextDelete}>삭제</button>
          </div>
        )}

        <div className="gridContainer">
          <div className="sideBar leftSideBar"></div>
          <div className="captureAreaWrapper">
            <div className="captureAreaContainer">
              {/* 이미지 영역 */}
              <div
                className={`captureArea ${
                  mode === "move" ? "moveMode" : "editMode"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (selectedTextIds.length > 0) {
                    setSelectedTextIds([]);
                  }
                }}
              >
                <img
                  src={absoluteImageUrl}
                  alt="생성된 이미지"
                  className="imagePreview"
                />
                {texts.map((text) => (
                  <Draggable
                    key={text.id}
                    bounds=".captureArea"
                    position={text.position}
                    disabled={mode !== "move"} // 편집 모드에서는 드래그 비활성화
                    onStop={(e, data) =>
                      setTexts((prev) =>
                        prev.map((item) =>
                          item.id === text.id
                            ? { ...item, position: { x: data.x, y: data.y } }
                            : item
                        )
                      )
                    }
                  >
                    <div
                      className={`overlayText ${
                        selectedTextIds.includes(text.id) ? "selectedText" : ""
                      }`}
                      style={text.style}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (mode === "edit") {
                          handleTextClick(text.id, e);
                        }
                      }}
                    >
                      {text.text}
                    </div>
                  </Draggable>
                ))}
              </div>
            </div>
          </div>
          <div className="sideBar rightSideBar"></div>
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
