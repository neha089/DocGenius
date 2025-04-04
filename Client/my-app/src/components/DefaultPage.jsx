import React, { useState, useRef, useEffect } from 'react';

const DefaultPage = () => {
  const [activeTab, setActiveTab] = useState('welcome');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [message, setMessage] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'DocGenius AI',
      content: 'Hello! How can I assist you today?',
      timestamp: '10:30 AM',
      isCurrentUser: false,
    }
  ]);

  const suggestionOptions = [
    "Help me scan documents",
    "Create a filing system",
    "Extract text from images",
    "Compare two documents"
  ];

  const menuOptions = [
    { id: 'welcome', label: 'Welcome', icon: 'home' },
    { id: 'chat', label: 'Chat', icon: 'chat' },
    { id: 'documents', label: 'Documents', icon: 'document' },
    { id: 'settings', label: 'Settings', icon: 'settings' },
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim() === '' && !selectedFile) return;
    
    if (selectedFile) {
      // Send both file and message if file is selected
      const newMessage = {
        id: messages.length + 1,
        sender: 'You',
        content: message.trim() !== '' ? message : null,
        document: {
          name: selectedFile.name,
          size: `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`,
          url: '#',
        },
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isCurrentUser: true,
      };
      
      setMessages([...messages, newMessage]);
      setMessage('');
      setSelectedFile(null);
      
      // Simulate AI response to file upload with message
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const aiResponse = {
          id: messages.length + 2,
          sender: 'DocGenius AI',
          content: `I've received your document "${selectedFile.name}"${message.trim() !== '' ? ` and your message: "${message}"` : ''}. Would you like me to analyze this document?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isCurrentUser: false,
        };
        setMessages(prev => [...prev, aiResponse]);
      }, 2000);
    } else {
      // Send just the message if no file
      const newMessage = {
        id: messages.length + 1,
        sender: 'You',
        content: message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isCurrentUser: true,
      };
      
      setMessages([...messages, newMessage]);
      setMessage('');
      
      // Simulate AI response to message
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const aiResponse = {
          id: messages.length + 2,
          sender: 'DocGenius AI',
          content: `I've processed your request about "${message}". How would you like to proceed?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isCurrentUser: false,
        };
        setMessages(prev => [...prev, aiResponse]);
      }, 2000);
    }
    
    setShowSuggestions(false);
  };

  const handleSuggestion = (suggestion) => {
    setMessage(suggestion);
    setShowSuggestions(false);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    setSidebarOpen(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setActiveTab('welcome');
    setSidebarOpen(false);
  };

  // Render the Welcome Page
  const renderWelcomePage = () => (
    <div className={`flex flex-col items-center justify-center h-full p-8 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-blue-50 to-purple-50'}`}>
      <div className="h-24 w-24 rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center text-white font-bold shadow-lg mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h1 className="text-3xl font-bold mb-4 text-center">Welcome to DocGenius AI</h1>
      <p className="text-lg mb-8 text-center max-w-md">Your intelligent document assistant. Upload, analyze, and organize your documents with ease.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        <div className={`p-6 rounded-xl shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center mb-4">
            <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold ml-3">Document Analysis</h2>
          </div>
          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Upload your documents and get instant insights, summaries, and key information extraction.</p>
        </div>
        
        <div className={`p-6 rounded-xl shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center mb-4">
            <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold ml-3">Smart Organization</h2>
          </div>
          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Automatically categorize and organize your documents with our intelligent filing system.</p>
        </div>
        
        <div className={`p-6 rounded-xl shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center mb-4">
            <div className="p-2 rounded-lg bg-green-100 text-green-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold ml-3">Text Extraction</h2>
          </div>
          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Extract text from images, scanned documents, and PDFs with high accuracy OCR technology.</p>
        </div>
        
        <div className={`p-6 rounded-xl shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center mb-4">
            <div className="p-2 rounded-lg bg-red-100 text-red-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold ml-3">Secure Storage</h2>
          </div>
          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>All your documents are encrypted and stored securely. Access them anytime, anywhere.</p>
        </div>
      </div>
      
      <div className="mt-10">
        {isAuthenticated ? (
          <button 
            onClick={() => setActiveTab('chat')} 
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white font-medium rounded-lg shadow-lg transition duration-300"
          >
            Get Started
          </button>
        ) : (
          <div className="flex space-x-4">
            <button 
              onClick={() => setSidebarOpen(true)} 
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white font-medium rounded-lg shadow-lg transition duration-300"
            >
              Sign Up
            </button>
            <button 
              onClick={() => setSidebarOpen(true)} 
              className={`px-6 py-3 ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-100'} font-medium rounded-lg shadow-lg transition duration-300`}
            >
              Login
            </button>
          </div>
        )}
      </div>
    </div>
  );

  // Render Chat Page
  const renderChatPage = () => (
    <div className={`flex flex-col h-full ${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-blue-50 to-purple-50'}`}>
      {/* Chat Messages */}
      <div className={`flex-1 overflow-y-auto p-4 ${darkMode ? 'bg-gray-900' : 'bg-transparent'}`}>
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.isCurrentUser ? 'justify-end' : 'justify-start'}`}
            >
              {!msg.isCurrentUser && (
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center text-white text-xs font-bold mr-2 mt-1">
                  AI
                </div>
              )}
              <div
                className={`max-w-xs md:max-w-md rounded-2xl p-4 ${
                  msg.isCurrentUser
                    ? `${darkMode ? 'bg-blue-700' : 'bg-blue-600'} text-white rounded-br-none`
                    : `${darkMode ? 'bg-gray-800' : 'bg-gradient-to-r from-purple-600 to-blue-500'} text-white rounded-bl-none`
                }`}
              >                
                {msg.content && <p className="leading-relaxed">{msg.content}</p>}
                
                {msg.document && (
                  <div className={`${darkMode ? 'bg-gray-700' : 'bg-white bg-opacity-20'} p-3 rounded-xl ${msg.content ? 'mt-3' : 'mt-0'} flex items-center`}>
                    <div className={`${darkMode ? 'bg-gray-600' : 'bg-white bg-opacity-30'} p-2 rounded-lg`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-white">{msg.document.name}</p>
                      <p className="text-xs text-gray-100">{msg.document.size}</p>
                    </div>
                    <div className="ml-auto flex space-x-2">
                      <button className="p-1 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <a href={msg.document.url} className="p-1 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </a>
                    </div>
                  </div>
                )}
                
                <p className={`text-xs mt-2 ${msg.isCurrentUser ? 'text-blue-200' : 'text-gray-200'}`}>
                  {msg.timestamp}
                </p>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center text-white text-xs font-bold mr-2">
                AI
              </div>
              <div className={`rounded-2xl p-4 rounded-bl-none ${darkMode ? 'bg-gray-800' : 'bg-gradient-to-r from-purple-600 to-blue-500'} text-white`}>
                <div className="flex space-x-1">
                  <div className="h-2 w-2 rounded-full bg-white animate-bounce"></div>
                  <div className="h-2 w-2 rounded-full bg-white animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="h-2 w-2 rounded-full bg-white animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Suggestions */}
      {showSuggestions && (
        <div className={`px-4 py-2 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex flex-wrap gap-2">
            {suggestionOptions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestion(suggestion)}
                className={`text-sm px-3 py-1 rounded-full ${
                  darkMode 
                    ? 'bg-gray-700 text-white hover:bg-gray-600' 
                    : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                }`}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Selected File Preview */}
      {selectedFile && (
        <div className={`px-4 py-2 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-t`}>
          <div className={`flex items-center p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
            <div className={`p-2 rounded-md ${darkMode ? 'bg-gray-600' : 'bg-blue-100'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${darkMode ? 'text-blue-300' : 'text-blue-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-blue-600'}`}>
                {selectedFile.name}
              </p>
              <p className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                {(selectedFile.size / (1024 * 1024)).toFixed(1)} MB · PDF
              </p>
            </div>
            <button 
              onClick={removeSelectedFile}
              className={`p-1 rounded-full ${
                darkMode 
                  ? 'bg-gray-600 hover:bg-gray-500 text-gray-300' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-500'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
      
      {/* Message Input */}
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} border-t p-4`}>
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
          <button 
            type="button"
            onClick={() => setShowSuggestions(!showSuggestions)}
            className={`p-2 rounded-full ${
              darkMode 
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </button>
          
          <label htmlFor="file-upload" className="cursor-pointer">
            <div className={`p-2 rounded-full ${
              darkMode 
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            } ${selectedFile ? 'ring-2 ring-blue-500' : ''}`}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
              </svg>
            </div>
            <input
              id="file-upload"
              type="file"
              accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
              className="hidden"
              onChange={handleFileSelect}
            />
          </label>
          
          <div className="relative flex-1">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onClick={() => setShowSuggestions(false)}
              placeholder={selectedFile ? "Add a message with your file..." : "Ask DocGenius AI..."}
              className={`w-full rounded-full py-3 px-4 pr-10 ${
                darkMode 
                  ? 'bg-gray-700 text-white border-gray-600 focus:border-blue-500' 
                  : 'bg-gray-100 border-gray-200 focus:border-blue-500'
              } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            <button
              type="button"
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
          
          <button
            type="submit"
            className={`p-3 rounded-full shadow-lg bg-gradient-to-r ${
              message.trim() === '' && !selectedFile
                ? 'from-gray-400 to-gray-500 cursor-not-allowed' 
                : 'from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600'
            } text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform rotate-90" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );

  // Render Document Page (placeholder)
  const renderDocumentsPage = () => (
    <div className={`flex flex-col items-center justify-center h-full p-8 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-blue-50 to-purple-50'}`}>
      <svg xmlns="http://www.w3.org/2000/svg" className={`h-24 w-24 mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <h1 className="text-3xl font-bold mb-4">Documents</h1>
      <p className="text-lg mb-8 text-center max-w-md">Your documents section is currently empty. Upload documents to get started.</p>
      <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white font-medium rounded-lg shadow-lg transition duration-300 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" />
        </svg>
        Upload Documents
      </button>
    </div>
  );

  // Render Settings Page (placeholder)
  const renderSettingsPage = () => (
    <div className={`flex flex-col h-full p-8 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-blue-50 to-purple-50'}`}>
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      
      <div className={`p-6 rounded-xl shadow-md mb-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <h2 className="text-xl font-semibold mb-4">Appearance</h2>
      <div className="flex items-center justify-between">
        <span>Dark Mode</span>
        <button 
          onClick={() => setDarkMode(!darkMode)}
          className={`relative inline-flex items-center h-6 rounded-full w-11 ${darkMode ? 'bg-blue-600' : 'bg-gray-200'}`}
        >
          <span className={`inline-block w-4 h-4 transform transition-transform bg-white rounded-full ${darkMode ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
      </div>
    </div>
    
    <div className={`p-6 rounded-xl shadow-md mb-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <h2 className="text-xl font-semibold mb-4">Account</h2>
      <div className="mb-4">
        <label className={`block mb-2 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email</label>
        <input 
          type="email" 
          className={`w-full px-3 py-2 border rounded-md ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`} 
          value="user@example.com" 
          disabled 
        />
      </div>
      <div className="mb-4">
        <label className={`block mb-2 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Subscription</label>
        <div className={`px-3 py-2 border rounded-md ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}>
          Pro Plan - $19.99/month
        </div>
      </div>
      <button 
        className={`px-4 py-2 rounded-md ${darkMode ? 'bg-red-800 hover:bg-red-700 text-white' : 'bg-red-100 hover:bg-red-200 text-red-700'}`}
        onClick={handleLogout}
      >
        Log Out
      </button>
    </div>
    
    <div className={`p-6 rounded-xl shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <h2 className="text-xl font-semibold mb-4">Notifications</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span>Email Notifications</span>
          <button 
            className={`relative inline-flex items-center h-6 rounded-full w-11 ${darkMode ? 'bg-blue-600' : 'bg-blue-600'}`}
          >
            <span className="inline-block w-4 h-4 transform translate-x-6 bg-white rounded-full" />
          </button>
        </div>
        <div className="flex items-center justify-between">
          <span>Document Processing Alerts</span>
          <button 
            className={`relative inline-flex items-center h-6 rounded-full w-11 ${darkMode ? 'bg-blue-600' : 'bg-blue-600'}`}
          >
            <span className="inline-block w-4 h-4 transform translate-x-6 bg-white rounded-full" />
          </button>
        </div>
        <div className="flex items-center justify-between">
          <span>Weekly Summary</span>
          <button 
            className={`relative inline-flex items-center h-6 rounded-full w-11 ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}
          >
            <span className="inline-block w-4 h-4 transform translate-x-1 bg-white rounded-full" />
          </button>
        </div>
      </div>
    </div>
  </div>
);

  // Main component render
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div 
        className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 w-64 transition-transform duration-300 ease-in-out z-30
        ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} shadow-lg md:translate-x-0 md:static md:h-screen`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center text-white font-bold mr-2">
              D
            </div>
            <span className="text-lg font-bold">DocGenius AI</span>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)} 
            className="md:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {isAuthenticated ? (
          <>
            <div className="p-4">
              <ul className="space-y-2">
                {menuOptions.map((option) => (
                  <li key={option.id}>
                    <button
                      onClick={() => setActiveTab(option.id)}
                      className={`w-full flex items-center px-4 py-2 rounded-lg transition-colors ${
                        activeTab === option.id
                          ? `${darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-700'}`
                          : `hover:${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`
                      }`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        {option.icon === 'home' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />}
                        {option.icon === 'chat' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />}
                        {option.icon === 'document' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />}
                        {option.icon === 'settings' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />}
                        {option.icon === 'settings' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />}
                      </svg>
                      {option.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="absolute bottom-0 left-0 w-full p-4 border-t border-gray-200">
              <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center text-white font-bold">
                    U
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">User Name</p>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Pro Plan</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-4/5">
            <div className="p-8 max-w-sm mx-auto">
              <h2 className="text-2xl font-bold mb-6 text-center">Welcome Back</h2>
              <form onSubmit={handleLogin}>
                <div className="mb-4">
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Email
                  </label>
                  <input
                    type="email"
                    className={`w-full px-3 py-2 border rounded-md ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 placeholder-gray-400'
                    }`}
                    placeholder="your@email.com"
                  />
                </div>
                <div className="mb-6">
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Password
                  </label>
                  <input
                    type="password"
                    className={`w-full px-3 py-2 border rounded-md ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300'
                    }`}
                    placeholder="••••••••"
                  />
                  <div className="flex justify-end mt-2">
                    <a href="#" className={`text-sm ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                      Forgot password?
                    </a>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full px-4 py-2 text-white font-medium bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 rounded-md"
                >
                  Log In
                </button>
              </form>
              <div className="mt-6 text-center">
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Don't have an account?{' '}
                  <a href="#" className={`font-medium ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                    Sign up
                  </a>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top navbar */}
        <div className={`flex items-center justify-between h-16 px-4 ${darkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-gray-800 border-gray-200'} border-b`}>
          <div className="flex items-center">
            <button 
              onClick={() => setSidebarOpen(true)} 
              className="md:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="ml-2 text-xl font-bold hidden sm:block">
              {menuOptions.find(option => option.id === activeTab)?.label || 'DocGenius AI'}
            </h1>
          </div>
          <div className="flex items-center space-x-3">
            <button className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            >
              {darkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            {isAuthenticated && (
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center text-white font-bold">
                U
              </div>
            )}
          </div>
        </div>
        
        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'welcome' && renderWelcomePage()}
          {activeTab === 'chat' && renderChatPage()}
          {activeTab === 'documents' && renderDocumentsPage()}
          {activeTab === 'settings' && renderSettingsPage()}
        </div>
      </div>
    </div>
  );
};

export default DefaultPage;