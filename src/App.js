// App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainScreen from './MainScreen';
import NextPage from './NextPage';
import ImagePage from './ImagePage';
import MessageSendPage from './MessageSendPage';

const App = () => {
  const [summaryContent, setSummaryContent] = useState([]);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<MainScreen onSetContent={setSummaryContent} />}
        />
        <Route
          path="/next"
          element={<NextPage Content={summaryContent} />}
        />
        <Route
          path="/image"
          element={<ImagePage pdfSummary={summaryContent} />}
        />
        <Route path="/send-message" element={<MessageSendPage />} />
      </Routes>
    </Router>
  );
};

export default App;
