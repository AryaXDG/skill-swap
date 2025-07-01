import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaTimes, FaPlus, FaChevronDown } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchSkills } from '../../store/skillSlice';

const SkillSelector = ({
  selectedSkills, // { skill: { _id, name }, proficiency? }[]
  onChange, // (newSkills) => void
  type, // 'possessed' or 'seeking'
}) => {
  const dispatch = useDispatch();
  const { skills: allSkills, status } = useSelector((state) => state.skills);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // DEBUG 1: Log the state from Redux right after it's selected.
  // Check your console: Is `allSkills` an empty array `[]`? Is `status` 'idle', 'loading', or 'succeeded'?
  useEffect(() => {
    console.log('SKILL SELECTOR REDUX STATE:', { allSkills, status });
  }, [allSkills, status]);


  // Fetch skills if not already present
  useEffect(() => {
    if (status === 'idle') {
      // DEBUG 2: Confirm that the dispatch is being called.
      console.log('Redux status is "idle". Dispatching fetchSkills...');
      dispatch(fetchSkills());
    }
  }, [status, dispatch]);

  // Update suggestions based on search term
  useEffect(() => {
    // DEBUG 3: Log what's happening inside the suggestion logic.
    console.log('Suggestion useEffect fired.', { searchTerm, allSkills_count: allSkills.length });
    
    if (searchTerm) {
      const filtered = allSkills.filter(
        (skill) =>
          skill.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !selectedSkills.find((s) => s.skill._id === skill._id)
      );
      
      // DEBUG 4: Check if any skills were found. If `allSkills` is empty,
      // `filtered` will always be empty.
      console.log('Filtered suggestions:', filtered);

      setSuggestions(filtered.slice(0, 10)); // Limit suggestions
      setIsDropdownOpen(true);
    } else {
      setSuggestions([]);
      setIsDropdownOpen(false);
    }
  }, [searchTerm, allSkills, selectedSkills]);

  const addSkill = (skill) => {
    if (selectedSkills.find((s) => s.skill._id === skill._id)) return;

    const newSkill =
      type === 'possessed'
        ? { skill: { _id: skill._id, name: skill.name }, proficiency: 'Intermediate' }
        : { skill: { _id: skill._id, name: skill.name } };

    onChange([...selectedSkills, newSkill]);
    setSearchTerm('');
    setSuggestions([]);
  };

  const removeSkill = (skillId) => {
    onChange(selectedSkills.filter((s) => s.skill._id !== skillId));
  };

  const updateProficiency = (skillId, proficiency) => {
    onChange(
      selectedSkills.map((s) =>
        s.skill._id === skillId ? { ...s, proficiency } : s
      )
    );
  };

  return (
    <div className="w-full">
      {/* Selected Skills Tags */}
      <div className="flex flex-wrap gap-2 mb-3 p-3 bg-dark-900 rounded-lg min-h-[50px] border border-dark-700">
        <AnimatePresence>
          {selectedSkills.map(({ skill, proficiency }) => (
            <motion.div
              key={skill._id}
              layout
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex items-center bg-primary text-white rounded-full text-sm"
            >
              <span className="pl-3 pr-2 py-1">{skill.name}</span>
              {type === 'possessed' && (
                <select
                  value={proficiency}
                  onChange={(e) => updateProficiency(skill._id, e.target.value)}
                  className="bg-primary-dark text-white rounded-r-full pl-2 pr-1 py-1 -ml-1 text-xs outline-none appearance-none"
                  onClick={(e) => e.stopPropagation()} // Prevent click from bubbling
                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                  <option>Expert</option>
                </select>
              )}
              <button
                onClick={() => removeSkill(skill._id)}
                className="ml-1 mr-2 text-primary-light hover:text-white"
              >
                <FaTimes size={12} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Autocomplete Input */}
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Type to search for a skill..."
          className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-dark-100 placeholder-dark-50 focus:outline-none focus:ring-2 focus:ring-primary"
          onFocus={() => searchTerm && setIsDropdownOpen(true)}
          onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)} // Delay to allow click
        />

        <AnimatePresence>
          {isDropdownOpen && suggestions.length > 0 && (
            <motion.ul
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute z-10 w-full mt-1 bg-dark-800 border border-dark-700 rounded-lg shadow-lg max-h-60 overflow-y-auto"
            >
              {suggestions.map((skill) => (
                <li
                  key={skill._id}
                  className="flex items-center justify-between px-4 py-2 text-dark-100 hover:bg-primary hover:text-white cursor-pointer"
                  onMouseDown={(e) => { // Use onMouseDown to fire before onBlur
                    e.preventDefault();
                    addSkill(skill);
                  }}
                >
                  {skill.name}
                  <FaPlus size={12} />
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SkillSelector;