import React from 'react';
import { motion } from 'framer-motion';
import { FaStar, FaHandshake, FaHeart, FaExchangeAlt } from 'react-icons/fa';
import Button from '../common/Button';

// Helper to render skill tags
const SkillTag = ({ skill, type }) => {
  const color =
    type === 'has'
      ? 'bg-primary/20 text-primary'
      : 'bg-secondary/20 text-secondary';
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${color}`}
    >
      {skill.name}
    </span>
  );
};

const MatchCard = ({ user, onInteract }) => {
  
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.3 }}
      className="bg-dark-800 rounded-lg shadow-lg overflow-hidden border border-dark-700 flex flex-col"
    >
      {/* Header */}
      <div className="p-5 flex items-center space-x-4">
        <img
          src={user.avatarUrl || `https://placehold.co/400x400/111827/EC4899?text=${user.username[0]}`}
          alt={user.username}
          className="w-16 h-16 rounded-full border-4 border-secondary"
        />
        <div>
          <h3 className="text-xl font-bold text-white">{user.username}</h3>
          <div className="flex items-center mt-1 text-yellow-400">
            <FaStar />
            <span className="ml-1 text-sm text-dark-50">
              {user.average_helpfulness.toFixed(1)} Helpfulness ({user.total_ratings})
            </span>
          </div>
        </div>
      </div>

      {/* Bio */}
      <p className="px-5 text-dark-50 text-sm mb-4 h-16 overflow-y-auto">
        {user.bio || 'No bio provided.'}
      </p>

      {/* Skills */}
      <div className="px-5 space-y-3 flex-grow">
        <div>
          <h4 className="text-xs font-semibold uppercase text-primary mb-2">
            Skills they have:
          </h4>
          <div className="flex flex-wrap gap-2">
            {user.skills_possessed.slice(0, 5).map(({ skill }) => (
              <SkillTag key={skill._id} skill={skill} type="has" />
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-xs font-semibold uppercase text-secondary mb-2">
            Skills they seek:
          </h4>
          <div className="flex flex-wrap gap-2">
            {user.skills_seeking.slice(0, 5).map(({ skill }) => (
              <SkillTag key={skill._id} skill={skill} type="seeks" />
            ))}
          </div>
        </div>
      </div>

      {/* Footer / Action */}
      <div className="p-5 mt-4 bg-dark-900/50">
        <Button
          fullWidth
          variant="secondary"
          icon={FaExchangeAlt}
          onClick={() => onInteract(user._id)}
        >
          Request Swap
        </Button>
      </div>
    </motion.div>
  );
};

export default MatchCard;