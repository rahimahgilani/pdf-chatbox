import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from './components/MainPage';
import ChatPDF from './components/ChatPDF';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/chat-pdf" element={<ChatPDF />} />
      </Routes>
    </BrowserRouter>

  );
};

export default App;