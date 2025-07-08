import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserPlus, FaCheckCircle, FaHourglassHalf } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';
import Button from '../common/Button.jsx';
import { useDispatch } from 'react-redux'; // <-- 1. Import useDispatch
import { respondToInteraction } from '../../store/interactionSlice'; // <-- 2. Import the new thunk

const ChatSidebar = ({ interactions, onlineUsers, selectedInteractionId }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const dispatch = useDispatch(); // <-- 3. Get the dispatch function

  const pendingInteractions = interactions.filter(i => i.status === 'pending' && i.initiated_by !== user._id);
  const matchedInteractions = interactions.filter(i => i.status === 'matched');

  const ChatListItem = ({ interaction }) => {
    const otherUser = interaction.participants.find(p => p._id !== user._id);
    if (!otherUser) return null; // Should not happen

    const isOnline = onlineUsers.has(otherUser._id);
    const isSelected = interaction._id === selectedInteractionId;

    return (
      <li
        onClick={() => navigate(`/chat/${interaction._id}`)}
        className={`
          flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-150
          ${isSelected ? 'bg-primary/20' : 'hover:bg-dark-700'}
        `}
      >
        <div className="relative">
          <img
            src={otherUser.avatarUrl || `https://placehold.co/100x100/111827/EC4899?text=${otherUser.username[0]}`}
            alt={otherUser.username}
            className="w-12 h-12 rounded-full object-cover border-2 border-dark-700"
          />
          {isOnline && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-dark-800"></span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-white truncate">{otherUser.username}</h4>
          <p className="text-xs text-dark-50 truncate">
            {interaction.status === 'matched' ? 'You are matched' : 'Pending...'}
          </p>
        </div>
      </li>
    );
  };
  
  // <-- 4. Update the handleResponse function
  const handleResponse = (interactionId, status) => {
    console.log(`Dispatching response for ${interactionId} with status ${status}`);
    dispatch(respondToInteraction({ interactionId, status }));
  };

  return (
    <div className="w-1/3 max-w-xs bg-dark-900/50 border-r border-dark-700 flex flex-col h-full">
      <div className="p-4 border-b border-dark-700">
        <h2 className="text-xl font-bold text-white">Conversations</h2>
        {/* Search bar could go here */}
      </div>

      {/* Pending Requests */}
      {pendingInteractions.length > 0 && (
        <div className="p-4 border-b border-dark-700">
           <h3 className="text-xs font-semibold uppercase text-secondary mb-2">Pending Requests</h3>
           <ul className="space-y-2">
            {pendingInteractions.map(interaction => {
              const otherUser = interaction.participants.find(p => p._id !== user._id);
              return (
                <li key={interaction._id} className="bg-dark-800 p-3 rounded-lg">
                  <span className="text-sm text-dark-50">
                    <strong className="text-white">{otherUser.username}</strong> wants to swap.
                  </span>
                  <div className="flex gap-2 mt-2">
                    {/* These buttons will now dispatch the thunk */}
                    <Button size="sm" variant="primary" onClick={() => handleResponse(interaction._id, 'matched')}>Accept</Button>
                    <Button size="sm" variant="danger" onClick={() => handleResponse(interaction._id, 'declined')}>Decline</Button>
                  </div>
                </li>
              )
            })}
           </ul>
        </div>
      )}

      {/* Matched Chats */}
      <div className="flex-1 p-4 overflow-y-auto">
        <h3 className="text-xs font-semibold uppercase text-primary mb-2">Matched Swaps</h3>
        <ul className="space-y-2">
          {matchedInteractions.map(interaction => (
            <ChatListItem key={interaction._id} interaction={interaction} />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ChatSidebar;
