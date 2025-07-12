import React, { useState, useEffect, useRef } from 'react';
import { FaPaperPlane, FaSpinner } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';
import Message from './Message';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingSpinner from '../common/LoadingSpinner.jsx';

const ChatWindow = ({ interaction, otherParticipant, socket, isSocketConnected }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Fetch initial messages
  useEffect(() => {
    const fetchMessages = async () => {
      setIsLoading(true);
      try {
        const res = await api.get(`/messages/${interaction._id}`);
        setMessages(res.data.data);
      } catch (error) {
        console.error('Failed to fetch messages', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMessages();
  }, [interaction._id]);

  // Scroll to bottom when messages load
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Socket event listeners for this chat
  useEffect(() => {
    if (socket) {
      // Join the interaction room
      socket.emit('join_room', interaction._id);

      const handleReceiveMessage = (message) => {
        if (message.interaction_id === interaction._id) {
          setMessages((prev) => [...prev, message]);
        }
      };
      
      const handleUserTyping = ({ userId }) => {
        if (userId === otherParticipant._id) setIsTyping(true);
      };
      
      const handleUserStoppedTyping = ({ userId }) => {
         if (userId === otherParticipant._id) setIsTyping(false);
      };

      socket.on('receive_message', handleReceiveMessage);
      socket.on('user_typing', handleUserTyping);
      socket.on('user_stopped_typing', handleUserStoppedTyping);

      return () => {
        socket.off('receive_message', handleReceiveMessage);
        socket.off('user_typing', handleUserTyping);
        socket.off('user_stopped_typing', handleUserStoppedTyping);
        // Note: We don't 'leave_room' here as the user might just switch chats
      };
    }
  }, [socket, interaction._id, otherParticipant._id]);

  // Handle 'typing' emission
  const handleTyping = () => {
    if (!socket) return;
    
    socket.emit('typing', { interaction_id: interaction._id });
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('stop_typing', { interaction_id: interaction._id });
    }, 2000);
  };
  
  // Handle message send
  const handleSubmit = (e) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !isSocketConnected) return;

    // Emit 'send_message' event
    socket.emit('send_message', {
      interaction_id: interaction._id,
      content: newMessage,
    });
    
    // Optimistically add message to state
    // Note: The server will broadcast 'receive_message', which will also add it.
    // To prevent duplicates, the server-side event is the source of truth.
    // We *could* add an optimistic UI message with a 'sending' state.
    
    setNewMessage('');
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    socket.emit('stop_typing', { interaction_id: interaction._id });
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center p-4 bg-dark-800 border-b border-dark-700 shadow-sm">
        <img
          src={otherParticipant.avatarUrl || `https://placehold.co/100x100/111827/EC4899?text=${otherParticipant.username[0]}`}
          alt={otherParticipant.username}
          className="w-10 h-10 rounded-full object-cover"
        />
        <h3 className="ml-3 text-lg font-semibold text-white">{otherParticipant.username}</h3>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {isLoading ? (
          <LoadingSpinner size="lg" />
        ) : (
          messages.map((msg) => (
            <Message
              key={msg._id || msg.timestamp} // Handle optimistic
              message={msg}
              isOwnMessage={msg.sender_id._id === user._id || msg.sender_id === user._id}
              sender={msg.sender_id._id === user._id ? user : otherParticipant}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
       {/* Typing Indicator */}
      <AnimatePresence>
        {isTyping && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="px-4 pb-1 text-sm text-secondary"
          >
            {otherParticipant.username} is typing...
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="p-4 bg-dark-900/50 border-t border-dark-700">
        <div className="flex items-center bg-dark-800 rounded-lg border border-dark-700 focus-within:ring-2 focus-within:ring-primary">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              handleTyping();
            }}
            placeholder="Type your message..."
            className="flex-1 bg-transparent px-4 py-3 text-white placeholder-dark-50 focus:outline-none"
            disabled={!isSocketConnected}
          />
          <button
            type="submit"
            className="p-3 text-primary disabled:text-dark-600 transition-colors"
            disabled={!isSocketConnected || newMessage.trim() === ''}
          >
            <FaPaperPlane size={20} />
          </button>
        </div>
        {!isSocketConnected && (
            <p className="text-xs text-danger mt-1">Connecting to chat...</p>
        )}
      </form>
    </div>
  );
};

export default ChatWindow;