import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import ChatDashboard from './components/chatDashboard'
import DefaultPage from './components/DefaultPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DefaultPage />} />
        <Route path="/chat" element={<ChatDashboard />} />
      </Routes>
    </Router>
  )
}

export default App