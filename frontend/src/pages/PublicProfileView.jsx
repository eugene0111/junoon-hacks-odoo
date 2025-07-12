import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, Globe, Send, X, Star, MessageSquare } from 'lucide-react';

// --- MOCK DATA (Simulating API calls) ---

const profileUser = {
  id: 'user-002',
  firstName: 'Marc',
  lastName: 'Demo',
  email: 'marc.demo@example.com',
  phoneNo: '987-654-3210',
  country: 'San Francisco, USA',
  skillsOffered: ['Python', 'Data Analysis', 'Machine Learning'],
  skillsWanted: ['React', 'Graphic Design', 'Project Management'],
  isAvailable: true,
  profilePhoto: 'https://i.pravatar.cc/150?u=a042581f4e29026704a'
};

const loggedInUser = {
    id: 'user-001',
    skillsOffered: ['Graphic Design', 'Video Editing', 'Photoshop', 'React']
};


const PublicProfileView = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSubmitRequest = (requestData) => {
        console.log("Submitting Swap Request:", {
            fromUser: loggedInUser.id,
            toUser: profileUser.id,
            ...requestData
        });
        alert("Swap request sent successfully!");
        setIsModalOpen(false);
    };

  return (
    <>
      <div className="bg-slate-100 font-sans antialiased min-h-screen">
        <div className="container mx-auto p-4 md:p-8">
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm">
                
                {/* --- Profile Header --- */}
                <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 pb-8 border-b border-slate-200">
                    <img src={profileUser.profilePhoto} alt="Profile" className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-white shadow-lg" />
                    <div className="flex-1 text-center sm:text-left">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">{profileUser.firstName} {profileUser.lastName}</h1>
                        <p className="text-gray-500 mt-1">{profileUser.country}</p>
                        <div className="flex justify-center sm:justify-start items-center gap-2 mt-2">
                             <div className={`w-2.5 h-2.5 rounded-full ${profileUser.isAvailable ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                             <p className={`text-sm font-semibold ${profileUser.isAvailable ? 'text-emerald-600' : 'text-rose-600'}`}>
                                {profileUser.isAvailable ? 'Available for Swaps' : 'Not Available'}
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2 w-full sm:w-auto"
                    >
                        <Send size={18}/> Request Swap
                    </button>
                </div>

                {/* --- Skills & Feedback Grid --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <SkillList title="Skills Offered" skills={profileUser.skillsOffered} color="blue" />
                        <SkillList title="Skills Wanted" skills={profileUser.skillsWanted} color="purple" />
                    </div>
                    <div className="bg-slate-50 p-6 rounded-xl">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Rating and Feedback</h3>
                        <div className="space-y-4">
                            <div className="flex items-center">
                                <span className="font-semibold w-28">Overall Rating</span>
                                <div className="flex items-center gap-1 text-amber-400">
                                    <Star size={20} fill="currentColor"/><Star size={20} fill="currentColor"/><Star size={20} fill="currentColor"/><Star size={20} fill="currentColor"/><Star size={20} className="text-slate-300" fill="currentColor"/>
                                </div>
                                <span className="ml-2 text-gray-600 font-medium">(4.0)</span>
                            </div>
                            <p className="text-gray-600 pt-2">"Marc was a great partner! Very communicative and delivered high-quality work on time."</p>
                            <span className="text-sm font-semibold text-gray-500">- Jane Doe</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
      
      <RequestModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitRequest}
        loggedInUser={loggedInUser}
        profileUser={profileUser}
      />
    </>
  );
};



const SkillList = ({ title, skills, color }) => {
    const colorVariants = {
        blue: { bg: 'bg-blue-100', text: 'text-blue-800' },
        purple: { bg: 'bg-purple-100', text: 'text-purple-800' },
    };
    const selectedColor = colorVariants[color];
    return (
        <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">{title}</h3>
            <div className="flex flex-wrap gap-2">
                {skills.map(skill => <div key={skill} className={`rounded-full px-4 py-1.5 text-sm font-medium ${selectedColor.bg} ${selectedColor.text}`}>{skill}</div>)}
            </div>
        </div>
    );
};

const RequestModal = ({ isOpen, onClose, onSubmit, loggedInUser, profileUser }) => {
    if (!isOpen) return null;
    const [mySkill, setMySkill] = useState('');
    const [theirSkill, setTheirSkill] = useState('');
    const [message, setMessage] = useState('');
    const handleSubmit = () => {
        if (!mySkill || !theirSkill) { alert('Please select a skill from both dropdowns.'); return; }
        onSubmit({ mySkill, theirSkill, message });
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 space-y-6" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center"><h2 className="text-2xl font-bold text-gray-800">Send Swap Request to {profileUser.firstName}</h2><button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={24}/></button></div>
                <div className="space-y-4">
                    <div><label className="text-sm font-semibold text-gray-600 mb-2 block">Choose one of your offered skills</label><select value={mySkill} onChange={(e) => setMySkill(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 outline-none transition bg-white"><option value="" disabled>Select your skill...</option>{loggedInUser.skillsOffered.map(skill => <option key={skill} value={skill}>{skill}</option>)}</select></div>
                    <div><label className="text-sm font-semibold text-gray-600 mb-2 block">Choose one of their wanted skills</label><select value={theirSkill} onChange={(e) => setTheirSkill(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 outline-none transition bg-white"><option value="" disabled>Select their needed skill...</option>{profileUser.skillsWanted.map(skill => <option key={skill} value={skill}>{skill}</option>)}</select></div>
                    <div><label className="text-sm font-semibold text-gray-600 mb-2 block">Message (Optional)</label><textarea value={message} onChange={(e) => setMessage(e.target.value)} rows="4" placeholder={`Hi ${profileUser.firstName}, I'd like to propose a skill swap...`} className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 outline-none transition"></textarea></div>
                </div>
                <button onClick={handleSubmit} className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-blue-700 transition-transform duration-200 hover:scale-[1.02] flex items-center justify-center gap-2"><MessageSquare size={18}/> Submit Request</button>
            </div>
        </div>
    );
};

export default PublicProfileView;