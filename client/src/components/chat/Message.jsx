import React from 'react';
import { motion } from 'framer-motion';

const Message = ({ message, isOwnMessage, sender }) => {
  const alignment = isOwnMessage ? 'items-end' : 'items-start';
  const bubbleColor = isOwnMessage
    ? 'bg-primary'
    : 'bg-dark-700';
  const senderName = isOwnMessage ? 'You' : sender.username;
  
  const variants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.3 }}
      className={`flex flex-col ${alignment}`}
    >
      <div className="flex items-center space-x-2">
        {!isOwnMessage && (
           <img
            src={sender.avatarUrl || `https://placehold.co/100x100/111827/EC4899?text=${sender.username[0]}`}
            alt={sender.username}
            className="w-6 h-6 rounded-full object-cover"
          />
        )}
        <span className="text-xs text-dark-50">{senderName}</span>
        <span className="text-xs text-dark-50">
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
      <div
        className={`
          mt-1 px-4 py-2 rounded-lg max-w-xs lg:max-w-md
          ${bubbleColor}
        `}
      >
        <p className="text-white break-words">{message.content}</p>
      </div>
    </motion.div>
  );
};

export default Message;