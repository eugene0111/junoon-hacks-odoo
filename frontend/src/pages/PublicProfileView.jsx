import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Mail, Phone, Globe, Send, X, Star, MessageSquare, Loader2 } from 'lucide-react';


const getAuthToken = () => localStorage.getItem('token');

const PublicProfileView = () => {
   
    const { id: profileUserId } = useParams(); 
    
    
    const [profileUser, setProfileUser] = useState(null);
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!profileUserId) {
                setError("No user ID provided in the URL.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const token = getAuthToken();

                
                const [profileRes, meRes] = await Promise.all([
                    fetch(`http://localhost:3000/api/users/${profileUserId}`),
                    token ? fetch('http://localhost:3000/api/auth/me', { headers: { 'Authorization': `Bearer ${token}` } }) : Promise.resolve(null)
                ]);

               
                if (!profileRes.ok) throw new Error('Could not find user profile.');
                const profileResult = await profileRes.json();
                if (!profileResult.success) throw new Error(profileResult.message);
                setProfileUser(profileResult.data);
                
              
                if (meRes) {
                    if (meRes.ok) {
                        const meResult = await meRes.json();
                        if(meResult.success) setLoggedInUser(meResult.data);
                    } else {
                        console.error("Could not fetch logged-in user, continuing as guest.");
                    }
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [profileUserId]); 

   
    const handleSubmitRequest = async (requestData) => {
        const token = getAuthToken();
        if (!token) {
            alert("You must be logged in to send a swap request.");
            return;
        }

        try {
           
            const response = await fetch('http://localhost:3000/api/swaps/request', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    providerId: profileUser._id, 
                    ...requestData
                })
            });

            const result = await response.json();
            if (!response.ok || !result.success) {
                throw new Error(result.message || "Failed to send request.");
            }

            alert("Swap request sent successfully!");
            setIsModalOpen(false);

        } catch (err) {
            alert(`Error: ${err.message}`);
        }
    };

    
    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-slate-100"><Loader2 className="w-12 h-12 animate-spin text-blue-600"/></div>;
    }
    if (error) {
        return <div className="min-h-screen flex items-center justify-center bg-slate-100 text-red-500 font-semibold">{error}</div>;
    }
    if (!profileUser) {
        return <div className="min-h-screen flex items-center justify-center bg-slate-100">User not found.</div>;
    }

  return (
    <>
      <div className="bg-slate-100 font-sans antialiased min-h-screen">
        <div className="container mx-auto p-4 md:p-8">
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm">
                <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 pb-8 border-b border-slate-200">
                    <img src={profileUser.profilePhoto || `https://i.pravatar.cc/150?u=${profileUser.email}`} alt="Profile" className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-white shadow-lg" />
                    <div className="flex-1 text-center sm:text-left">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">{profileUser.firstName} {profileUser.lastName}</h1>
                        <p className="text-gray-500 mt-1">{profileUser.location}, {profileUser.country}</p>
                        <div className="flex justify-center sm:justify-start items-center gap-2 mt-2">
                             <div className={`w-2.5 h-2.5 rounded-full ${profileUser.availability === 'available' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                             <p className={`text-sm font-semibold ${profileUser.availability === 'available' ? 'text-emerald-600' : 'text-rose-600'} capitalize`}>
                                {profileUser.availability === 'available' ? 'Available for Swaps' : profileUser.availability}
                            </p>
                        </div>
                    </div>
                   
                    {loggedInUser && loggedInUser._id !== profileUser._id && (
                        <button 
                            onClick={() => setIsModalOpen(true)}
                            className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2 w-full sm:w-auto"
                        >
                            <Send size={18}/> Request Swap
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <SkillList title="Skills Offered" skills={profileUser.skillsOffered} color="blue" />
                        <SkillList title="Skills Wanted" skills={profileUser.skillsWanted} color="purple" />
                    </div>
                    <div className="bg-slate-50 p-6 rounded-xl">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">User Rating</h3>
                        <div className="space-y-2">
                             <div className="flex items-center">
                                <div className="flex items-center gap-1 text-amber-400">
                                    {[...Array(5)].map((_, i) => <Star key={i} size={22} className={i < Math.round(profileUser.rating) ? 'text-amber-400' : 'text-slate-300'} fill="currentColor"/>)}
                                </div>
                                <span className="ml-3 text-2xl font-bold text-slate-700">{profileUser.rating.toFixed(1)}</span>
                            </div>
                            <p className="text-sm text-slate-500">Overall rating based on {profileUser.totalRatings} swaps.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
      
      
      {loggedInUser && profileUser && (
        <RequestModal 
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleSubmitRequest}
            loggedInUser={loggedInUser}
            profileUser={profileUser}
        />
      )}
    </>
  );
};


const SkillList = ({ title, skills, color }) => {
    const colorVariants = { blue: { bg: 'bg-blue-100', text: 'text-blue-800' }, purple: { bg: 'bg-purple-100', text: 'text-purple-800' } };
    const selectedColor = colorVariants[color];
    return (
        <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">{title}</h3>
            <div className="flex flex-wrap gap-2">
                {(skills || []).map(skill => <div key={skill} className={`rounded-full px-4 py-1.5 text-sm font-medium ${selectedColor.bg} ${selectedColor.text}`}>{skill}</div>)}
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
                    <div><label className="text-sm font-semibold text-gray-600 mb-2 block">Choose one of your offered skills</label><select value={mySkill} onChange={(e) => setMySkill(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 outline-none transition bg-white"><option value="" disabled>Select your skill...</option>{(loggedInUser.skillsOffered || []).map(skill => <option key={skill} value={skill}>{skill}</option>)}</select></div>
                    <div><label className="text-sm font-semibold text-gray-600 mb-2 block">Choose one of their wanted skills</label><select value={theirSkill} onChange={(e) => setTheirSkill(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 outline-none transition bg-white"><option value="" disabled>Select their needed skill...</option>{(profileUser.skillsWanted || []).map(skill => <option key={skill} value={skill}>{skill}</option>)}</select></div>
                    <div><label className="text-sm font-semibold text-gray-600 mb-2 block">Message (Optional)</label><textarea value={message} onChange={(e) => setMessage(e.target.value)} rows="4" placeholder={`Hi ${profileUser.firstName}, I'd like to propose a skill swap...`} className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 outline-none transition"></textarea></div>
                </div>
                <button onClick={handleSubmit} className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-blue-700 transition-transform duration-200 hover:scale-[1.02] flex items-center justify-center gap-2"><MessageSquare size={18}/> Submit Request</button>
            </div>
        </div>
    );
};

export default PublicProfileView;