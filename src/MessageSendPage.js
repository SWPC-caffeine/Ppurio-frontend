// MessageSendPage.js
import React, { useState } from "react";
import "./css/MessageSendPage.css";
import phoneImg from "./image/phoneImg.png";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useLocation } from "react-router-dom";

// 수신자 리스트 컴포넌트 분리
const RecipientList = ({ recipients, onRemove, onClear }) => (
  <div className="receiver-list">
    <span className="receiver-label">받는 사람</span>
    <div className="receiver-area">
      {recipients.map((recipient) => (
        <div key={recipient} className="recipient-item">
          {recipient}
          <button
            onClick={() => onRemove(recipient)}
            className="remove-button"
            aria-label="번호 제거"
          >
            x
          </button>
        </div>
      ))}
    </div>
    <button className="clear-button" onClick={onClear} aria-label="전체 제거">
      전체제거
    </button>
  </div>
);

// 전화번호 유효성 검사 함수
const isValidPhoneNumber = (number) => {
  const phoneRegex = /^01[0-9]\d{3,4}\d{4}$/;
  return phoneRegex.test(number);
};

const MessageSendPage = () => {
  const location = useLocation();
  const { imageBlobUrl, serverFileUrl, pdfSummary } = location.state || {}; // ImagePage에서 전달된 데이터
  const [inputValue, setInputValue] = useState("");
  const [recipients, setRecipients] = useState([]);
  const [sendOption, setSendOption] = useState(null); // 'now' 또는 'scheduled'
  const [scheduledDate, setScheduledDate] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 번호 추가
  const handleAddRecipient = () => {
    const numbers = inputValue
      .split("\n")
      .map((num) => num.trim())
      .filter((num) => num && isValidPhoneNumber(num));

    if (numbers.length === 0) {
      setAlertMessage("올바른 전화번호를 입력해 주세요.");
      return;
    }

    setRecipients([...new Set([...recipients, ...numbers])]);
    setInputValue("");
    setAlertMessage("");
  };

  // Enter 키 입력 처리
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAddRecipient();
    }
  };

  
  // 수신자 제거
  const handleRemoveRecipient = (number) => {
    setRecipients(recipients.filter((recipient) => recipient !== number));
  };

  // 수신자 전체 제거
  const handleClearRecipients = () => {
    setRecipients([]);
  };

  // 즉시 발송 선택
  const handleSendNowClick = () => {
    setSendOption("now");
    setScheduledDate(null);
  };

  // 예약 발송 선택
  const handleSendScheduledClick = () => {
    setSendOption("scheduled");
  };

  // 메시지 전송 처리
  const handleSendClick = async () => {
    if (recipients.length === 0) {
      setAlertMessage("수신번호가 하나도 등록되어 있지 않습니다.");
      return;
    }
    if (!sendOption) {
      setAlertMessage("즉시 발송 또는 예약 발송을 선택해 주세요.");
      return;
    }

    setIsLoading(true);
    try {
      const recipientsArray = recipients.map((recipient) => ({
        to: recipient,
        name: "김철수",
        changeWord: { var1: "치환 문자 예시" },
      }));
      const fileName = serverFileUrl.split("/").pop();

      const requestData = {
        messageContent: pdfSummary || "",
        sender: "01084356517", // 발신번호
        recipients: recipientsArray,
        fileUrl: serverFileUrl,
        fileName: fileName,
      };

      console.log("전송 데이터:", requestData);

      const response = await fetch(
      `${process.env.REACT_APP_SERVER_IP}/send-mms`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData), // JSON 데이터 전송
        }
      );

      if (!response.ok) {
        const errorMessage = await response.text(); // 백엔드가 반환한 에러 메시지
        console.error("백엔드 응답 에러:", errorMessage);
        throw new Error("메시지 전송에 실패했습니다.");
      }

      const result = await response.json();
      console.log("메시지 전송 성공:", result);
      setAlertMessage("메시지를 성공적으로 보냈습니다.");
      setRecipients([]);
      setSendOption(null);
      setScheduledDate(null);
    } catch (error) {
      console.error("메시지 전송 에러:", error);
      setAlertMessage("메시지 전송에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="message-send-container">
      <div className="phone-preview">
        <img
          src={phoneImg}
          alt="휴대폰"
          style={{ width: "150%", height: "100%" }}
        />

        {/* 휴대폰 화면 위에 blob 이미지와 pdfSummary 표시 */}
        <div className="content-overlay">
          {imageBlobUrl && (
            <div className="image-content">
              <img
                src={imageBlobUrl}
                alt="보내는 이미지"
                style={{ maxWidth: "100%", height: "auto" }}
              />
            </div>
          )}
          {pdfSummary && (
            <div className="message-content" style={{ whiteSpace: "pre-wrap" }}>
              {pdfSummary}
            </div>
          )}
        </div>
      </div>

      <div className="send-settings">
        <h3>발신번호 설정</h3>
        <button className="sender-number" aria-label="발신번호">
          010-8435-6517
        </button>

        <h3>수신번호 설정</h3>
        <div className="receiver-settings">
          <div className="input-container">
            <label className="input-label" htmlFor="phone-input">
              직접 입력
            </label>
            <textarea
              id="phone-input"
              placeholder="번호 입력, 여러개 입력 시 Shift + Enter로 구분"
              className="input-area"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              aria-label="전화번호 입력"
            />
            <button
              className="add-button"
              onClick={handleAddRecipient}
              aria-label="번호 추가"
            >
              번호 추가 +
            </button>
          </div>

          <RecipientList
            recipients={recipients}
            onRemove={handleRemoveRecipient}
            onClear={handleClearRecipients}
          />
        </div>

        <div className="send-options">
          <button
            className={`send-now ${sendOption === "now" ? "active" : ""}`}
            onClick={handleSendNowClick}
            aria-label="즉시 발송"
          >
            즉시 발송
          </button>
          <button
            className={`send-scheduled ${
              sendOption === "scheduled" ? "active" : ""
            }`}
            onClick={handleSendScheduledClick}
            aria-label="예약 발송"
          >
            예약 발송
          </button>
        </div>

        {sendOption === "scheduled" && (
          <div className="date-picker">
            <label htmlFor="date-picker">보낼 날짜와 시간: </label>
            <DatePicker
              id="date-picker"
              selected={scheduledDate}
              onChange={(date) => setScheduledDate(date)}
              showTimeSelect
              dateFormat="yyyy/MM/dd hh:mm aa"
              placeholderText="날짜와 시간을 선택하세요"
            />
          </div>
        )}

        {alertMessage && <div className="alert-message">{alertMessage}</div>}

        <button
          className="send-button"
          onClick={handleSendClick}
          disabled={isLoading}
          aria-label="보내기"
        >
          {isLoading ? "전송 중..." : "보내기"}
        </button>
      </div>
    </div>
  );
};

export default MessageSendPage;
