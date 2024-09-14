// File: apps/frontend/src/components/Chat.tsx

import React, { useState, useEffect, useRef } from 'react';
import Pusher from 'pusher-js';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import './Chat.css';
import fetchWithAuth from '../utils/fetchWithAuth';
import { API_BASE_URL } from '../utils/config';
import { getUser } from '../utils/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faPlus, faRedo, faPaperPlane, faHistory } from '@fortawesome/free-solid-svg-icons';
import ConversationList from './ConversationList';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const notyf = new Notyf();

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userMessage, setUserMessage] = useState('');
  const [conversationId, setConversationId] = useState<string>('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const chatHistoryRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Initialize conversation on component mount
    startNewConversation();
  }, []);

  useEffect(() => {
    // Setup Pusher for real-time updates
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY || '', {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || '',
    });

    const channel = pusher.subscribe('chat-channel');
    channel.bind('new-message', (data: any) => {
      if (data.conversation_id === conversationId) {
        setMessages((prevMessages) => [...prevMessages, { role: data.role, content: data.content }]);
        setIsTyping(false);
      }
    });

    return () => {
      pusher.unsubscribe('chat-channel');
      pusher.disconnect();
    };
  }, [conversationId]);

  useEffect(() => {
    // Scroll to the bottom when messages update
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const sendMessage = async () => {
    if (!userMessage.trim()) return;

    const message = userMessage.trim();
    setMessages((prevMessages) => [...prevMessages, { role: 'user', content: message }]);
    setUserMessage('');
    setIsTyping(true);

    try {
      await fetchWithAuth('/api/send_message', {
        method: 'POST',
        body: JSON.stringify({ conversation_id: conversationId, message }),
      });
      // Assistant's response will be handled via Pusher
    } catch (error: any) {
      notyf.error(error.message || 'Failed to send message.');
      setIsTyping(false);
    }
  };

  const startNewConversation = async () => {
    try {
      const data = await fetchWithAuth('/api/start_conversation', { method: 'POST' });
      setConversationId(data.conversation_id);
      setMessages([]);
      notyf.success('Started a new conversation.');
      setIsSidebarOpen(false);
    } catch (error: any) {
      notyf.error(error.message || 'Failed to start a new conversation.');
    }
  };

  const resetConversation = async () => {
    try {
      await fetchWithAuth('/api/reset_conversation', {
        method: 'POST',
        body: JSON.stringify({ conversation_id: conversationId }),
      });
      setMessages([]);
      notyf.success('Conversation reset.');
    } catch (error: any) {
      notyf.error(error.message || 'Failed to reset conversation.');
    }
  };

  // Define the loadConversation function to pass as a prop
  const loadConversation = async (convId: string) => {
    try {
      const data = await fetchWithAuth(`/api/load_conversation/${convId}`, { method: 'GET' });
      setConversationId(convId);
      setMessages(data.conversation);
      notyf.success('Conversation loaded.');
      setIsSidebarOpen(false);
    } catch (error: any) {
      notyf.error(error.message || 'Failed to load conversation.');
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserMessage(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className={`chat-page ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      {/* Sidebar for Conversation List */}
      <aside className={`conversation-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <ConversationList loadConversation={loadConversation} />
      </aside>

      {/* Main Chat Area */}
      <main className="chat-main">
        {/* Header */}
        <header className="chat-header">
          <h1>Chatbot</h1>
          <nav className="chat-nav">
            <button onClick={toggleSidebar} title="Toggle Conversation History" aria-label="Toggle Conversation History">
              <FontAwesomeIcon icon={faBars} />
            </button>
            <button onClick={startNewConversation} title="Start New Conversation" aria-label="Start New Conversation">
              <FontAwesomeIcon icon={faPlus} />
            </button>
            <button onClick={resetConversation} title="Reset Conversation" aria-label="Reset Conversation">
              <FontAwesomeIcon icon={faRedo} />
            </button>
            <button onClick={toggleSidebar} title="Conversation History" aria-label="Conversation History">
              <FontAwesomeIcon icon={faHistory} />
            </button>
          </nav>
        </header>

        {/* Conversation Area */}
        <div className="chat-container">
          <div className="chat-history" ref={chatHistoryRef}>
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.role}`}>
                <div className="message-content">{msg.content}</div>
              </div>
            ))}
            {isTyping && (
              <div className="message assistant">
                <div className="message-content typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
          </div>

          {/* Message Input Area */}
          <div className="message-input">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
            >
              <textarea
                value={userMessage}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                placeholder="Type your message and press Enter..."
                className="message-input-field"
                rows={1}
              />
              <button type="submit" className="send-button" aria-label="Send Message">
                <FontAwesomeIcon icon={faPaperPlane} />
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Chat;
