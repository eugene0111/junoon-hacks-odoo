import React, { useState } from 'react';

// Initial data can come from an API call in a real application
const initialUserData = {
  name: 'Alex Doe',
  location: 'New York, USA',
  skillsOffered: ['Graphic Design', 'Video Editing', 'Photoshop'],
  skillsWanted: ['Python', 'JavaScript', 'Manager'],
  availability: 'Weekends',
  profileVisibility: 'Public',
  profilePhoto: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' // A random placeholder avatar
};

const UserProfile = () => {
  // State for each editable field
  const [name, setName] = useState(initialUserData.name);
  const [location, setLocation] = useState(initialUserData.location);
  const [skillsOffered, setSkillsOffered] = useState(initialUserData.skillsOffered);
  const [skillsWanted, setSkillsWanted] = useState(initialUserData.skillsWanted);
  const [availability, setAvailability] = useState(initialUserData.availability);
  const [profileVisibility, setProfileVisibility] = useState(initialUserData.profileVisibility);
  const [profilePhoto, setProfilePhoto] = useState(initialUserData.profilePhoto);

  // Helper function to remove a skill
  const removeSkill = (skillToRemove, list, setList) => {
    setList(list.filter(skill => skill !== skillToRemove));
  };
  
  // Handlers for top-level actions
  const handleSave = () => {
    const updatedData = { name, location, skillsOffered, skillsWanted, availability, profileVisibility };
    console.log("Saving data:", updatedData);
    // Here you would typically make an API call to save the data
    alert("Profile Saved!");
  };

  const handleDiscard = () => {
    setName(initialUserData.name);
    setLocation(initialUserData.location);
    setSkillsOffered(initialUserData.skillsOffered);
    setSkillsWanted(initialUserData.skillsWanted);
    setAvailability(initialUserData.availability);
    setProfileVisibility(initialUserData.profileVisibility);
    console.log("Changes discarded.");
  };

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-8">
        {/* Header Section */}
        <div className="flex justify-between items-center border-b border-gray-200 pb-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800">User profile</h1>
          <div className="flex items-center space-x-6">
            <a href="#swap" className="text-base font-medium text-gray-600 hover:text-blue-600">Swap request</a>
            <a href="#home" className="text-base font-medium text-gray-600 hover:text-blue-600">Home</a>
            <img src={initialUserData.profilePhoto} alt="User Avatar" className="w-12 h-12 rounded-full object-cover" />
          </div>
        </div>

        {/* Edit Controls */}
        <div className="flex items-center mb-8">
            <button onClick={handleSave} className="text-green-600 font-bold py-2 px-4 rounded hover:bg-green-50">Save</button>
            <button onClick={handleDiscard} className="text-red-500 font-bold py-2 px-4 rounded hover:bg-red-50 ml-2">Discard</button>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Left Column: Details */}
          <div className="md:col-span-2 space-y-8">
            {/* Form Fields */}
            <div>
              <label className="text-sm font-semibold text-gray-600 mb-2 block">Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 border-b-2 border-gray-300 focus:border-blue-500 outline-none transition" />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600 mb-2 block">Location</label>
              <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full p-2 border-b-2 border-gray-300 focus:border-blue-500 outline-none transition" />
            </div>

            {/* Skills Offered */}
            <div>
              <label className="text-sm font-semibold text-gray-600 mb-2 block">Skills Offered</label>
              <div className="flex flex-wrap gap-2">
                {skillsOffered.map(skill => (
                  <div key={skill} className="flex items-center bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm">
                    <span>{skill}</span>
                    <button onClick={() => removeSkill(skill, skillsOffered, setSkillsOffered)} className="ml-2 font-extrabold text-blue-500 hover:text-blue-800">×</button>
                  </div>
                ))}
              </div>
              <input type="text" placeholder="Add a skill..." className="w-full mt-3 p-2 border-b-2 border-gray-300 focus:border-blue-500 outline-none transition" onKeyDown={(e) => { if(e.key === 'Enter' && e.target.value) { setSkillsOffered([...skillsOffered, e.target.value]); e.target.value = ''; } }} />
            </div>

            {/* Skills Wanted */}
            <div>
              <label className="text-sm font-semibold text-gray-600 mb-2 block">Skills wanted</label>
              <div className="flex flex-wrap gap-2">
                {skillsWanted.map(skill => (
                  <div key={skill} className="flex items-center bg-purple-100 text-purple-800 rounded-full px-3 py-1 text-sm">
                    <span>{skill}</span>
                    <button onClick={() => removeSkill(skill, skillsWanted, setSkillsWanted)} className="ml-2 font-extrabold text-purple-500 hover:text-purple-800">×</button>
                  </div>
                ))}
              </div>
               <input type="text" placeholder="Add a skill..." className="w-full mt-3 p-2 border-b-2 border-gray-300 focus:border-blue-500 outline-none transition" onKeyDown={(e) => { if(e.key === 'Enter' && e.target.value) { setSkillsWanted([...skillsWanted, e.target.value]); e.target.value = ''; } }} />
            </div>
             <div>
              <label className="text-sm font-semibold text-gray-600 mb-2 block">Availability</label>
              <input type="text" value={availability} onChange={(e) => setAvailability(e.target.value)} className="w-full p-2 border-b-2 border-gray-300 focus:border-blue-500 outline-none transition" />
            </div>
             <div>
              <label className="text-sm font-semibold text-gray-600 mb-2 block">Profile</label>
              <input type="text" value={profileVisibility} onChange={(e) => setProfileVisibility(e.target.value)} className="w-full p-2 border-b-2 border-gray-300 focus:border-blue-500 outline-none transition" />
            </div>
          </div>

          {/* Right Column: Profile Photo */}
          <div className="flex flex-col items-center mt-6 md:mt-0">
            <h3 className="text-sm font-semibold text-gray-600 mb-2">Profile Photo</h3>
            <div className="relative">
              <img src={profilePhoto} alt="Profile" className="w-40 h-40 rounded-full object-cover border-4 border-gray-200" />
            </div>
            <div className="mt-4">
              <button className="text-sm text-blue-600 hover:underline">Add/Edit</button>
              <button className="text-sm text-red-500 hover:underline ml-4">Remove</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;