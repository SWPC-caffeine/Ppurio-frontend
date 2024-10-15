import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';  // react-router-dom 최신 버전 사용
import MainScreen from './MainScreen';  // default import로 MainScreen 컴포넌트 불러오기
import NextPage from './NextPage';  // default import로 NextPage 컴포넌트 불러오기
import ImagePage from './ImagePage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainScreen />} />  {/* MainScreen 경로 설정 */}
        <Route path="/next" element={<NextPage />} />  {/* NextPage 경로 설정 */}
        <Route path="/image" element={<ImagePage/>} />
      </Routes>
    </Router>
  );
};

export default App;
