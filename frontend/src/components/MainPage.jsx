import React from 'react';
import pdf_icon from "../assets/pdf-icon.png";
import { useNavigate } from 'react-router-dom';

const MainPage = () => {
  const navigate = useNavigate()
  return (
    <div className="main-page">
        <div className="upper-main">
            <button className="download-pdf" onClick={()=>navigate("/chat-pdf")}>
                <img className="pdf-icon" src={pdf_icon} alt="pdf-icon" />
            </button>
        </div>
        <div className="side-panel-main">
          <button className="open-panel">
            Open Panel
          </button>
        </div>
        <div className="lower-main">
          <div className="placeholder">
            <input
            type="text"
            placeholder="Ask Chatbit something"
            />
            <div className="button-send">
              <button className="send">
                Send
              </button>
            </div>
          </div>
        </div>
    </div>
  );
};

export default MainPage;