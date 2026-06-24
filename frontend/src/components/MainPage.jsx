import pdf_icon from "../assets/pdf-icon.png";
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from "react";


const MainPage = () => {
  const [messages, setMessages] = useState([])
  const [inputText, setInputText] = useState("")
  const [selectedFile, setSelectedFile] = useState(null)
  const [activeFilename, setActiveFilename] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [errorText, setErrorText] = useState("")

  const navigate = useNavigate()

  function handleInputChange(event) {
    setInputText(event.target.value)
  }

  function handleFileChange(event) {
    setSelectedFile(event.target.files[0])
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setErrorText("")

    if (!inputText.trim()) {
      return
    }

    setIsLoading(true)

    try {
      let currentFilename = activeFilename

      if (selectedFile) {
        const formData = new FormData()
        formData.append("file", selectedFile)

        const uploadResponse = await fetch("http://localhost:8000/upload", {
          method: "POST",
          body: formData,
        })

        if (!uploadResponse.ok) {
          throw new Error(`Upload failed (status ${uploadResponse.status})`)
        }

        currentFilename = await uploadResponse.json()
        setActiveFilename(currentFilename)
        setSelectedFile(null)
      }

      if (!currentFilename) {
        throw new Error("Please attach a PDF before asking a question.")
      }

      const askedQuestion = inputText
      setInputText("")

      const promptResponse = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: askedQuestion, file: currentFilename }),
      })

      if (!promptResponse.ok) {
        throw new Error(`Chat request failed (status ${promptResponse.status})`)
      }

      const chatData = await promptResponse.json()

      setMessages(previousMessages => [
        ...previousMessages,
        { question: askedQuestion, answer: chatData },
      ])
    } catch (error) {
      console.error(error)
      setErrorText(error.message || "Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="main-page">
      <div className="upper-main">
        <button className="download-pdf" onClick={() => navigate("/chat-pdf")}>
          <img className="pdf-icon" src={pdf_icon} alt="pdf-icon" />
        </button>
      </div>
      <div className="side-panel-main">
        <button className="open-panel">
          Open Panel
        </button>
      </div>
      <div className="lower-main">
        <div className="conversation">
          {messages.map((msg, index) => (
            <div key={index} className="message-pair">
              <p className="user-question">{msg.question}</p>
              <p className="bot-answer">{msg.answer}</p>
            </div>
          ))}
          {isLoading && (
            <div className="message-pair">
              <p className="bot-answer bot-answer-loading">Thinking…</p>
            </div>
          )}
        </div>

        {errorText && <p className="error-text">{errorText}</p>}

        {activeFilename && (
          <div className="active-file-chip">
            <span className="active-file-dot" />
            {activeFilename}
          </div>
        )}

        <form action="" className="chat-box" onSubmit={handleSubmit}>
          <input
            type="text"
            className="prompt-request"
            value={inputText}
            onChange={handleInputChange}
            placeholder="Ask something about your PDF..."
            disabled={isLoading}
          />

          <label className="file-attach-label" htmlFor="pdf-upload">
            {selectedFile ? selectedFile.name : "Attach PDF"}
          </label>
          <input
            id="pdf-upload"
            className="file-attach-input"
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            disabled={isLoading}
          />

          <button className="submit-btn" type="submit" disabled={isLoading}>
            {isLoading ? "Thinking…" : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MainPage;