import React, { useState } from "react";
import './css/MessageSendPage.css';

const MessageSendPage = () => {
  const [inputValue, setInputValue] = useState("");
  const [recipients, setRecipients] = useState([]);
  const [isSendNowActive, setIsSendNowActive] = useState(false); // State for 즉시 발송 button
  const [isSendScheduledActive, setIsSendScheduledActive] = useState(false); // State for 예약 발송 button
  const [scheduledDate, setScheduledDate] = useState(""); // State to hold selected date for scheduled send

  // Add each number individually to the recipients list
  const handleAddRecipient = () => {
    const numbers = inputValue.split('\n').map(num => num.trim()).filter(num => num);
    setRecipients([...recipients, ...numbers]);
    setInputValue("");
  };

  // Trigger handleAddRecipient on Enter key press unless Shift is held
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddRecipient();
    }
  };

  // Remove a specific recipient by index
  const handleRemoveRecipient = (index) => {
    setRecipients(recipients.filter((_, i) => i !== index));
  };

  // Clear all recipients
  const handleClearRecipients = () => {
    setRecipients([]);
  };

  // Toggle 즉시 발송 button color
  const handleSendNowClick = () => {
    setIsSendNowActive(true);
    setIsSendScheduledActive(false);
    setScheduledDate(""); // Clear the scheduled date if switching to "Send Now"
  };

  // Toggle 예약 발송 button color and show date picker
  const handleSendScheduledClick = () => {
    setIsSendScheduledActive(true);
    setIsSendNowActive(false);
  };

  // Handle date change for scheduled send
  const handleDateChange = (e) => {
    setScheduledDate(e.target.value);
  };

  // Handle send button click and validation
  const handleSendClick = () => {
    // Validation checks
    if (recipients.length === 0) {
      alert("수신번호가 하나도 등록되어 있지 않습니다.");
      return;
    }
    if (!isSendNowActive && !isSendScheduledActive) {
      alert("즉시 발송 또는 예약 발송을 선택해 주세요.");
      return;
    }
    if (isSendScheduledActive && !scheduledDate) {
      alert("예약 발송을 선택한 경우, 보낼 날짜를 선택해 주세요.");
      return;
    }

    // If all checks pass, proceed with sending
    alert("메시지를 성공적으로 보냈습니다.");
  };

  return (
    <div className="message-send-container">
      <div className="phone-preview">
        <img src={require('./image/phoneImg.png')} alt="휴대폰" style={{ width: '150%', height: '100%' }} />
        
        {/* 휴대폰 화면 위에 문자와 이미지 위치 */}
        <div className="content-overlay">
          <div className="image-content">이미지</div>
          <div className="message-content">메시지</div>
        </div>
      </div>
      
      <div className="send-settings">
        <h3>발신번호 설정</h3>
        <button className="sender-number">010-1234-5678</button>
        
        <h3>수신번호 설정</h3>
        <div className="receiver-settings">
          <div className="input-container">
            <span className="input-label">직접 입력</span>
            <textarea 
              placeholder="번호 입력, 여러개 입력 시 Shift + Enter로 구분" 
              className="input-area" 
              value={inputValue} 
              onChange={(e) => setInputValue(e.target.value)} 
              onKeyDown={handleKeyPress}
            />
            <button className="add-button" onClick={handleAddRecipient}>번호 추가 +</button>
          </div>
          
          <div className="receiver-list">
            <span className="receiver-label">받는 사람</span>
            <div className="receiver-area">
              {recipients.map((recipient, index) => (
                <div key={index} className="recipient-item">
                  {recipient}
                  <button onClick={() => handleRemoveRecipient(index)} className="remove-button">x</button>
                </div>
              ))}
            </div>
            <button className="clear-button" onClick={handleClearRecipients}>전체제거</button>
          </div>
        </div>
        
        <div className="send-options">
          <button 
            className={`send-now ${isSendNowActive ? 'active' : ''}`} 
            onClick={handleSendNowClick}
          >
            즉시 발송
          </button>
          <button 
            className={`send-scheduled ${isSendScheduledActive ? 'active' : ''}`} 
            onClick={handleSendScheduledClick}
          >
            예약 발송
          </button>
        </div>

        {isSendScheduledActive && (
          <div className="date-picker">
            <label>보낼 날짜: </label>
            <input 
              type="date" 
              value={scheduledDate} 
              onChange={handleDateChange} 
            />
          </div>
        )}
        
        <button className="send-button" onClick={handleSendClick}>보내기</button>
      </div>
    </div>
  );
};

export default MessageSendPage;
