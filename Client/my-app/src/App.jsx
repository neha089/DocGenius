import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Login from './Authentication/Login/Login';
import Register from './Authentication/Register/Register';
import ChatDashboard from './components/chatDashboard'
import DefaultPage from './components/DefaultPage'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<DefaultPage />} />
            <Route path="/chat" element={<ChatDashboard />} />
          </Routes>
      </BrowserRouter>
    </>
  )
}

export default App