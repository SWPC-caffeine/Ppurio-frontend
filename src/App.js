import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainScreen from './MainScreen';
import NextPage from './NextPage';
import ImagePage from './ImagePage';
import MessageSendPage from './MessageSendPage';  // SendMessagePage import

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MessageSendPage />} />
        <Route path="/next" element={<NextPage />} />
        <Route path="/image" element={<ImagePage />} />
        <Route path="/send-message" element={<MessageSendPage />} /> {/* SendMessagePage 경로 설정 */}
      </Routes>
    </Router>
  );
};

export default App;
