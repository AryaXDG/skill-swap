import React from 'react';
import { useParams } from 'react-router-dom';
import ChatLayout from '../components/chat/ChatLayout';

const ChatPage = () => {
  const { interactionId } = useParams();

  return (
    <div className="container max-w-7xl mx-auto p-4 h-[calc(100vh-140px)]">
      <ChatLayout selectedInteractionId={interactionId} />
    </div>
  );
};

export default ChatPage;