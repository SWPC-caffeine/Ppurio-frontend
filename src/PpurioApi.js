import React, { useState } from "react";

// API URL 및 기타 상수 설정
const API_URL = "https://message.ppurio.com";
const USER_NAME = "dkdk6517";
const TOKEN = `${process.env.PPURIO_API_TOKEN}`;  // 여기에 토큰 입력
const SEND_TIME = "2025-12-30T23:59:59";

const MessagingComponent = () => {
  const [accessToken, setAccessToken] = useState(null);
  const [messageKey, setMessageKey] = useState(null);
  const [loading, setLoading] = useState(false);

  // 엑세스 토큰 발급 함수
  const getAccessToken = async () => {
    try {
      const response = await fetch(`${API_URL}/v1/token`, {
        method: "POST",
        headers: {
          "Authorization": "Basic " + btoa(`${USER_NAME}:${TOKEN}`)
        }
      });
      const data = await response.json();
      setAccessToken(data.token);
      console.log("Access Token:", data.token);
      return data.token;
    } catch (error) {
      console.error("Error getting access token:", error);
    }
  };

  // 메시지 발송 함수
  const sendMessage = async (token) => {
    try {
      const payload = {
        account: USER_NAME, // 뿌리오 계정
        messageType: "SMS", // SMS(단문) / LMS(장문) / MMS(포토)
        content: "예약 발송입니다. 즉시 발송은 시간(sendTime) 파라미터를 삭제하고 사용 부탁드립니다.",  // 메시지 내용
        from: "01012345678", // 발신번호(숫자만)
        duplicateFlag: "N", // 수신번호 중복 허용 여부(Y:허용 / N:제거)
        rejectType: "AD", // 광고성 문자 수신거부 설정(AD:수신거부 / 비활성화: 파라미터 삭제)
        refKey: "ref_key", // 요청에 부여할 키
        targetCount: 1, // 수신자수
        sendTime: SEND_TIME, // 예약일자 (즉시발송은 해당 필드를 삭제)
        targets: [ // 수신자 및 변수(치환문자) 정보
          {
            to: "01012345678", // 수신자 및 변수(치환문자) 정보
            name: "홍길동", // [*이름*] 변수에 들어갈 정보(필수X)
            changeWord: {
              var1: "10000" // # 변수(치환문자) 정보(필수X)
            }
          }
        ]
      };

      const response = await fetch(`${API_URL}/v1/message`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      setMessageKey(data.messageKey);
      console.log("Message Sent. Message Key:", data.messageKey);
      return data.messageKey;
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // 예약 발송 취소 함수
  const cancelReservation = async (token, messageKey) => {
    try {
      const payload = {
        account: USER_NAME,
        messageKey: messageKey
      };

      const response = await fetch(`${API_URL}/v1/cancel`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      console.log("Reservation Cancelled. Response Code:", data.code);
      return data.code;
    } catch (error) {
      console.error("Error cancelling reservation:", error);
    }
  };

  // 메시지 발송 및 취소 핸들러
  const handleSendAndCancel = async () => {
    setLoading(true);

    // 1. 엑세스 토큰 발급
    const token = await getAccessToken();
    if (!token) {
      console.error("Failed to retrieve access token");
      setLoading(false);
      return;
    }

    // 2. 메시지 발송
    const key = await sendMessage(token);
    if (!key) {
      console.error("Failed to send message");
      setLoading(false);
      return;
    }

    // 3. 예약 취소 (10초 후)
    setTimeout(async () => {
      await cancelReservation(token, key);
      setLoading(false);
      console.log("Message cancelled successfully");
    }, 10000); // 10초 대기 후 예약 취소
  };

  return (
    <div>
      <h2>뿌리오 메시지 발송 및 예약 취소</h2>
      <button onClick={handleSendAndCancel} disabled={loading}>
        {loading ? "작업 중..." : "메시지 발송 및 예약 취소"}
      </button>
      {accessToken && <p>Access Token: {accessToken}</p>}
      {messageKey && <p>Message Key: {messageKey}</p>}
    </div>
  );
};

export default MessagingComponent;
