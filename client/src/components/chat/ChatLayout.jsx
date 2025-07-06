import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSocket } from '../../hooks/useSocket';
import { fetchInteractions } from '../../store/interactionSlice';
import { useAuth } from '../../hooks/useAuth';

import ChatSidebar from './ChatSidebar';
import ChatWindow from './ChatWindow';
import LoadingSpinner from '../common/LoadingSpinner';
import { FaComments } from 'react-icons/fa';

const ChatLayout = ({ selectedInteractionId }) => {
  const dispatch = useDispatch();
  const { socket, isConnected } = useSocket();
  const { user } = useAuth();
  
  const { interactions, status: interactionStatus } = useSelector(
    (state) => state.interactions
  );
  
  // Local state for online users
  const [onlineUsers, setOnlineUsers] = useState(new Set());

  // Fetch interactions on load
  useEffect(() => {
    dispatch(fetchInteractions());
  }, [dispatch]);

  // Socket event listeners
  useEffect(() => {
    if (socket && isConnected) {
      
      // Listen for 'user_online'
      const handleUserOnline = ({ userId }) => {
        setOnlineUsers((prev) => new Set(prev).add(userId));
      };
      
      // Listen for 'user_offline'
      const handleUserOffline = ({ userId }) => {
        setOnlineUsers((prev) => {
          const newSet = new Set(prev);
          newSet.delete(userId);
          return newSet;
        });
      };
      
      socket.on('user_online', handleUserOnline);
      socket.on('user_offline', handleUserOffline);
      
      // TODO: Need an event to get *all* currently online users on connect
      // This would typically be an 'emit' from client and 'on' from server
      
      return () => {
        socket.off('user_online', handleUserOnline);
        socket.off('user_offline', handleUserOffline);
      };
    }
  }, [socket, isConnected]);
  
  // Get the full interaction object
  const selectedInteraction = interactions.find(
    (i) => i._id === selectedInteractionId
  );
  
  // Find the other participant in the chat
  const otherParticipant = selectedInteraction?.participants.find(
    (p) => p._id !== user._id
  );

  if (interactionStatus === 'loading') {
    return <LoadingSpinner size="lg" />;
  }
  
  return (
    <div className="flex h-full max-h-[calc(100vh-140px)] w-full max-w-7xl mx-auto bg-dark-800 rounded-lg shadow-xl overflow-hidden border border-dark-700">
      
      {/* Sidebar */}
      <ChatSidebar
        interactions={interactions}
        onlineUsers={onlineUsers}
        selectedInteractionId={selectedInteractionId}
      />
      
      {/* Main Chat Window */}
      <div className="flex-1 flex flex-col">
        {selectedInteraction && otherParticipant ? (
          <ChatWindow
            key={selectedInteraction._id} // Force re-mount on chat change
            interaction={selectedInteraction}
            otherParticipant={otherParticipant}
            socket={socket}
            isSocketConnected={isConnected}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-dark-50 p-8">
            <FaComments className="text-6xl text-dark-700 mb-4" />
            <h2 className="text-2xl font-semibold">Welcome to Chat</h2>
            <p className="mt-2 text-center">
              Select a conversation from the sidebar to start chatting.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatLayout;