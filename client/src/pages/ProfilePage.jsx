import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useForm } from 'react-hook-form';
import api from '../services/api';
import { useDispatch } from 'react-redux';
import { loadUserFromToken } from '../store/authSlice';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import SkillSelector from '../components/profile/SkillSelector';
import { FaSave, FaUser, FaTools } from 'react-icons/fa';

const ProfilePage = () => {
  const { user, isLoading: isAuthLoading } = useAuth();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Form for Bio/Avatar
  const { register, handleSubmit, setValue: setFormValue } = useForm();
  
  // State for Skills
  const [skillsPossessed, setSkillsPossessed] = useState([]);
  const [skillsSeeking, setSkillsSeeking] = useState([]);

  // Populate form and skill state when user data loads
  useEffect(() => {
    if (user) {
      setFormValue('bio', user.bio);
      setFormValue('avatarUrl', user.avatarUrl);
      
      // FIX 1: Add (|| []) to prevent .map() on undefined
      setSkillsPossessed((user.skills_possessed || []).map(s => ({
        skill: { _id: s.skill._id, name: s.skill.name },
        proficiency: s.proficiency
      })));
      
      // FIX 1: Add (|| []) to prevent .map() on undefined
      setSkillsSeeking((user.skills_seeking || []).map(s => ({
        skill: { _id: s.skill._id, name: s.skill.name }
      })));
    }
  }, [user, setFormValue]);

  const onProfileSubmit = async (data) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    try {
      // 'data' will correctly contain only 'avatarUrl' and 'bio'
      // because 'username' and 'email' are disabled.
      await api.put('/users/profile', data);
      setSuccess('Profile updated successfully!');
      dispatch(loadUserFromToken()); // Re-fetch user data
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setIsLoading(false);
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  const onSkillsSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    // Format for API (needs to be [{ skill: 'id', ... }])
    const payload = {
      skills_possessed: skillsPossessed.map(s => ({
        skill: s.skill._id,
        proficiency: s.proficiency
      })),
      skills_seeking: skillsSeeking.map(s => ({
        skill: s.skill._id
      }))
    };
    
    try {
      await api.put('/users/profile/skills', payload);
      setSuccess('Skills updated successfully!');
      dispatch(loadUserFromToken()); // Re-fetch user data
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update skills.');
    } finally {
      setIsLoading(false);
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  if (isAuthLoading || !user) {
    return <LoadingSpinner size="lg" />;
  }

  return (
    <div className="container max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-4xl font-extrabold text-white mb-8">Your Profile</h1>

      {/* Success/Error Messages */}
      {success && <div className="p-4 mb-4 text-center bg-success/20 text-success rounded-lg">{success}</div>}
      {error && <div className="p-4 mb-4 text-center bg-danger/20 text-danger rounded-lg">{error}</div>}

      {/* Profile Details Form */}
      <form
        onSubmit={handleSubmit(onProfileSubmit)}
        className="p-8 bg-dark-800 rounded-lg shadow-xl border border-dark-700 mb-8"
      >
        <div className="flex items-center mb-6">
          <FaUser className="text-3xl text-primary" />
          <h2 className="ml-3 text-2xl font-bold text-white">Profile Details</h2>
        </div>
        
        <div className="space-y-4">
          
          {/* FIX 2: Spread register and add disabled prop */}
          <Input 
            id="username" 
            label="Username (read-only)" 
            type="text" 
            defaultValue={user.username} 
            className="opacity-70" 
            {...register("username")}
            disabled 
          />
          
          {/* FIX 2: Spread register and add disabled prop */}
          <Input 
            id="email" 
            label="Email (read-only)" 
            type="email" 
            defaultValue={user.email} 
            className="opacity-70" 
            {...register("email")}
            disabled
          />
          
          <Input
            id="avatarUrl"
            label="Avatar URL"
            type="text"
            placeholder="https://your-image.com/avatar.png"
            // FIX 2: Spread register call
            {...register("avatarUrl")}
          />
          
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-dark-50 mb-1">Bio</label>
            <textarea
              id="bio"
              {...register('bio')} // This was already correct
              rows="4"
              placeholder="Tell everyone a little about yourself..."
              className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-dark-100 placeholder-dark-50 focus:outline-none focus:ring-2 focus:ring-primary"
            ></textarea>
          </div>
          
          <Button type="submit" disabled={isLoading} icon={FaSave}>
            {isLoading ? 'Saving...' : 'Save Profile'}
          </Button>
        </div>
      </form>

      {/* Skills Form */}
      <form
        onSubmit={onSkillsSubmit}
        className="p-8 bg-dark-800 rounded-lg shadow-xl border border-dark-700"
      >
        <div className="flex items-center mb-6">
          <FaTools className="text-3xl text-secondary" />
          <h2 className="ml-3 text-2xl font-bold text-white">Your Skills</h2>
        </div>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-primary mb-3">Skills You Have</h3>
            <SkillSelector
              selectedSkills={skillsPossessed}
              onChange={setSkillsPossessed}
              type="possessed"
            />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-secondary mb-3">Skills You Seek</h3>
            <SkillSelector
              selectedSkills={skillsSeeking}
              onChange={setSkillsSeeking}
              type="seeking"
            />
          </div>
          
          <Button type="submit" disabled={isLoading} icon={FaSave} variant="secondary">
            {isLoading ? 'Saving...' : 'Save Skills'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;