import React, { useState, useRef, useEffect } from 'react';

const ChatDashboard = () => {
  const [message, setMessage] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'DocGenius AI',
      content: 'Hello! How can I assist you today?',
      timestamp: '10:30 AM',
      isCurrentUser: false,
    },
    {
      id: 2,
      sender: 'You',
      content: 'I need help with organizing my documents.',
      timestamp: '10:32 AM',
      isCurrentUser: true,
    },
    {
      id: 3,
      sender: 'DocGenius AI',
      content: 'I can help you with that! Would you like me to analyze your documents or suggest a filing system?',
      timestamp: '10:35 AM',
      isCurrentUser: false,
    },
    {
      id: 4,
      sender: 'You',
      content: 'I need help organizing my medical records.',
      timestamp: '10:36 AM',
      isCurrentUser: true,
    },
    {
      id: 5,
      sender: 'DocGenius AI',
      document: {
        name: 'Medical_Records_Template.pdf',
        size: '1.8 MB',
        url: '#',
      },
      content: 'Here\'s a template you can use for organizing medical records efficiently.',
      timestamp: '10:40 AM',
      isCurrentUser: false,
    },
  ]);

  const suggestionOptions = [
    "Help me scan documents",
    "Create a filing system",
    "Extract text from images",
    "Compare two documents"
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

  return (
    <div className={`flex flex-col h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-blue-50 to-purple-50'}`}>
      {/* Header */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md p-4 flex items-center justify-between`}>
        <div className="flex items-center">
          <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center text-white font-bold shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="ml-4">
            <h1 className="text-lg font-semibold">DocGenius AI</h1>
            <div className="flex items-center">
              <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
              <p className="text-sm text-green-500">Active</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setDarkMode(!darkMode)} 
            className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-yellow-300' : 'bg-gray-200 text-gray-700'}`}
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
          <div className="relative">
            <button className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
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
};

export default ChatDashboard;