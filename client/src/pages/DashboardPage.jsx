import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMatches } from '../store/interactionSlice';
import { useAuth } from '../hooks/useAuth';
import MatchCard from '../components/matches/MatchCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { FaExclamationTriangle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { matches, status, error } = useSelector((state) => state.interactions);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', message: '' });

  useEffect(() => {
    dispatch(fetchMatches());
  }, [dispatch]);

  const handleRequestSwap = async (receiver_id) => {
    try {
      await api.post('/interactions/request', { receiver_id });
      setModalContent({
        title: 'Success!',
        message: 'Your swap request has been sent. You can see its status in the Chat section.'
      });
      setIsModalOpen(true);
    } catch (error) {
      setModalContent({
        title: 'Error',
        message: error.response?.data?.message || 'Failed to send request. You may already have a pending swap.'
      });
      setIsModalOpen(true);
    }
  };

  // Check if user has skills
  const hasSkills =
    user?.skills_possessed?.length > 0 && user?.skills_seeking?.length > 0;

  let content;

  if (status === 'loading') {
    content = (
      <div className="flex justify-center mt-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  } else if (!hasSkills) {
    content = (
      <div className="flex flex-col items-center justify-center text-center p-8 bg-dark-800 rounded-lg shadow-xl border border-dark-700 mt-10">
        <FaExclamationTriangle className="text-5xl text-warning mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">
          Update Your Profile!
        </h2>
        <p className="text-dark-50 max-w-md mb-6">
          You need to add skills you possess and skills you are seeking
          before we can find your perfect matches.
        </p>
        <Button variant="primary" size="lg">
          <Link to="/profile">Go to Profile</Link>
        </Button>
      </div>
    );
  } else if (status === 'succeeded' && matches.length === 0) {
    content = (
      <div className="text-center p-8 bg-dark-800 rounded-lg shadow-xl border border-dark-700 mt-10">
        <h2 className="text-2xl font-bold text-white mb-2">No Matches Found</h2>
        <p className="text-dark-50">
          We couldn't find any reciprocal matches right now. Try adding more skills to your profile!
        </p>
      </div>
    );
  } else if (status === 'succeeded' && matches.length > 0) {
    content = (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {matches.map((user) => (
          <MatchCard key={user._id} user={user} onInteract={handleRequestSwap} />
        ))}
      </div>
    );
  } else if (status === 'failed') {
    content = (
      <div className="text-center p-8 bg-danger/20 text-danger rounded-lg mt-10">
        <h2 className="text-2xl font-bold">Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-4xl font-extrabold text-white mb-6">
        Your Matches
      </h1>
      <p className="text-lg text-dark-50 mb-8">
        We found users who have skills you want, and want skills you have.
      </p>
      {content}
      
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={modalContent.title}
      >
        <p className="text-dark-50 mb-6">{modalContent.message}</p>
        <Button onClick={() => setIsModalOpen(false)} fullWidth>Close</Button>
      </Modal>
    </div>
  );
};

export default DashboardPage;