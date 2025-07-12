import React, { useState } from 'react';
import { Mail, Phone, Globe, Edit3, X, Check } from 'lucide-react';

// --- INITIAL DATA ---
const initialUserData = {
  firstName: 'Alex',
  lastName: 'Doe',
  email: 'alex.doe@example.com',
  phoneNo: '123-456-7890',
  country: 'New York, USA',
  skillsOffered: ['Graphic Design', 'Video Editing', 'Photoshop', 'React', 'Tailwind CSS'],
  skillsWanted: ['Python', 'JavaScript', 'Project Management', 'Figma'],
  isAvailable: true,
  profileVisibility: 'Public',
  profilePhoto: 'https://i.pravatar.cc/150?u=a042581f4e29026704d'
};

// --- MAIN COMPONENT ---
const UserProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(initialUserData);
  const [editedData, setEditedData] = useState(initialUserData);

  const handleEdit = () => {
    setEditedData(userData);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = () => {
    setUserData(editedData);
    setIsEditing(false);
    console.log("Saving data:", editedData);
    // API call would go here
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData(prev => ({ ...prev, [name]: value }));
  };

  const handleSkillChange = (e, listName) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      const newSkill = e.target.value.trim();
      if (!editedData[listName].includes(newSkill)) {
        setEditedData(prev => ({
          ...prev,
          [listName]: [...prev[listName], newSkill]
        }));
      }
      e.target.value = '';
    }
  };

  const removeSkill = (skillToRemove, listName) => {
    setEditedData(prev => ({
      ...prev,
      [listName]: prev[listName].filter(skill => skill !== skillToRemove)
    }));
  };

  return (
    <div className="bg-slate-100 font-sans antialiased">
      <div className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* --- LEFT COLUMN (PROFILE & STATUS) --- */}
          <div className="lg:col-span-1 space-y-8">
            <ProfileCard user={userData} isEditing={isEditing} editedData={editedData} setEditedData={setEditedData} />
            <div className="bg-white p-6 rounded-2xl shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Profile Visibility</h3>
                {isEditing ? (
                     <select name="profileVisibility" value={editedData.profileVisibility} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none transition bg-white">
                        <option>Public</option>
                        <option>Private</option>
                        <option>Network Only</option>
                    </select>
                  ) : (
                    <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{userData.profileVisibility}</p>
                  )}
            </div>
          </div>

          {/* --- RIGHT COLUMN (DETAILS & SKILLS) --- */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">About Me</h2>
                {isEditing ? (
                  <div className="flex items-center space-x-2">
                    <button onClick={handleSave} className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"><Check size={18}/> Save</button>
                    <button onClick={handleCancel} className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors">Cancel</button>
                  </div>
                ) : (
                  <button onClick={handleEdit} className="bg-slate-800 text-white font-semibold py-2 px-4 rounded-lg hover:bg-slate-900 transition-colors flex items-center gap-2"><Edit3 size={16}/> Edit Profile</button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoField label="First Name" name="firstName" value={isEditing ? editedData.firstName : userData.firstName} isEditing={isEditing} onChange={handleChange} />
                <InfoField label="Last Name" name="lastName" value={isEditing ? editedData.lastName : userData.lastName} isEditing={isEditing} onChange={handleChange} />
                <InfoField label="Email Address" name="email" value={isEditing ? editedData.email : userData.email} isEditing={isEditing} onChange={handleChange} type="email"/>
                <InfoField label="Phone Number" name="phoneNo" value={isEditing ? editedData.phoneNo : userData.phoneNo} isEditing={isEditing} onChange={handleChange} type="tel" />
                <InfoField label="Country" name="country" value={isEditing ? editedData.country : userData.country} isEditing={isEditing} onChange={handleChange} />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <SkillField label="Skills Offered" skills={isEditing ? editedData.skillsOffered : userData.skillsOffered} listName="skillsOffered" isEditing={isEditing} onKeyDown={handleSkillChange} onRemove={removeSkill} color="blue"/>
                <SkillField label="Skills Wanted" skills={isEditing ? editedData.skillsWanted : userData.skillsWanted} listName="skillsWanted" isEditing={isEditing} onKeyDown={handleSkillChange} onRemove={removeSkill} color="purple"/>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

// --- CHILD COMPONENTS ---

const ProfileCard = ({ user, isEditing, editedData, setEditedData }) => (
    <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
        <div className="relative inline-block mb-4">
            <img src={user.profilePhoto} alt="Profile" className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg" />
            {isEditing && (
                 <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-transform duration-200 hover:scale-110">
                    <Edit3 size={16} />
                 </button>
            )}
        </div>
        <h2 className="text-2xl font-bold text-gray-800">{user.firstName} {user.lastName}</h2>
        <p className="text-gray-500">Skill Sharer & Learner</p>

        <div className="mt-6 space-y-3 text-left">
            <a href={`mailto:${user.email}`} className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"><Mail size={18} className="mr-3 text-gray-400"/> {user.email}</a>
            <a href={`tel:${user.phoneNo}`} className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"><Phone size={18} className="mr-3 text-gray-400"/> {user.phoneNo}</a>
            <p className="flex items-center text-gray-600"><Globe size={18} className="mr-3 text-gray-400"/> {user.country}</p>
        </div>

        <div className="mt-8">
            <button 
                onClick={() => isEditing && setEditedData(prev => ({...prev, isAvailable: !prev.isAvailable}))}
                className={`w-full text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 ${editedData.isAvailable ? 'bg-emerald-500' : 'bg-rose-500'} ${isEditing ? 'cursor-pointer hover:opacity-90' : 'cursor-default'}`}
                disabled={!isEditing}
            >
                <div className={`w-3 h-3 rounded-full bg-white transition-all ${isEditing ? 'animate-pulse' : ''}`}></div>
                {isEditing ? (editedData.isAvailable ? 'Available for Swaps' : 'Not Available') : (user.isAvailable ? 'Available for Swaps' : 'Not Available')}
            </button>
        </div>
    </div>
);

const InfoField = ({ label, name, value, isEditing, onChange, type = "text" }) => (
    <div>
        <label className="text-sm font-semibold text-gray-500 mb-2 block">{label}</label>
        {isEditing ? (
            <input 
                type={type} name={name} value={value} onChange={onChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" 
            />
        ) : (
            <p className="w-full px-4 py-2 text-gray-800 bg-gray-50 rounded-lg">{value || '-'}</p>
        )}
    </div>
);

const SkillField = ({ label, skills, listName, isEditing, onKeyDown, onRemove, color }) => {
    const colorVariants = {
        blue: { bg: 'bg-blue-100', text: 'text-blue-800', remove: 'text-blue-500 hover:text-blue-700' },
        purple: { bg: 'bg-purple-100', text: 'text-purple-800', remove: 'text-purple-500 hover:text-purple-700' },
    };
    const selectedColor = colorVariants[color] || colorVariants.blue;

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">{label}</h3>
            <div className="flex flex-wrap gap-2">
                {skills.map(skill => (
                    <div key={skill} className={`flex items-center rounded-full px-4 py-1.5 text-sm font-medium ${selectedColor.bg} ${selectedColor.text}`}>
                        <span>{skill}</span>
                        {isEditing && (
                        <button onClick={() => onRemove(skill, listName)} className={`ml-2 p-0.5 rounded-full ${selectedColor.remove} transition-colors`}>
                            <X size={14} />
                        </button>
                        )}
                    </div>
                ))}
            </div>
            {isEditing && (
                <input 
                    type="text" 
                    placeholder="Add skill & press Enter" 
                    className="w-full mt-4 px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" 
                    onKeyDown={(e) => onKeyDown(e, listName)} 
                />
            )}
        </div>
    );
};

export default UserProfilePage;