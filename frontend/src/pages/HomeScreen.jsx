import React, { useState, useEffect, useRef } from 'react';

// --- DATA for Discover Page ---
const users = [
    { name: 'Mohan Aggarwal', location: 'Mumbai, Maharashtra', status: 'Available', lastSeen: '2 hours ago', rating: 4.9, offering: ['React', 'TypeScript', 'Node.js'], lookingFor: ['Python', 'Machine Learning', 'Data Science'], description: 'Full-stack developer passionate about modern web technologies. Looking to expand into AI/ML.', swaps: 23, responseRate: '95%', avatar: 'MA' },
    { name: 'Priya Sharma', location: 'Delhi, India', status: 'Busy', lastSeen: '1 day ago', rating: 4.8, offering: ['Python', 'Django', 'PostgreSQL'], lookingFor: ['React', 'GraphQL', 'AWS'], description: 'Backend engineer with 5+ years experience. Eager to learn modern frontend frameworks.', swaps: 31, responseRate: '88%', avatar: 'PS' },
    { name: 'Arjun Patel', location: 'Bangalore, Karnataka', status: 'Available', lastSeen: '30 minutes ago', rating: 5, offering: ['UX Design', 'Figma', 'User Research'], lookingFor: ['React', 'CSS', 'Animation'], description: 'UX designer transitioning to frontend development. Love creating beautiful user experiences.', swaps: 18, responseRate: '100%', avatar: 'AP' },
    { name: 'Rajesh Kumar', location: 'Hyderabad, Telangana', status: 'Available', lastSeen: '5 hours ago', rating: 4.7, offering: ['Java', 'Spring Boot', 'Microservices'], lookingFor: ['Go', 'Kubernetes', 'Docker'], description: 'Senior backend developer looking to modernize my tech stack with cloud-native technologies.', swaps: 42, responseRate: '92%', avatar: 'RK' },
    { name: 'Anita Singh', location: 'Pune, Maharashtra', status: 'Busy', lastSeen: '1 hour ago', rating: 4.9, offering: ['iOS', 'Swift', 'SwiftUI'], lookingFor: ['React Native', 'Flutter', 'Kotlin'], description: 'Mobile developer specializing in iOS. Want to expand to cross-platform development.', swaps: 27, responseRate: '97%', avatar: 'AS' },
    { name: 'Vikram Reddy', location: 'Chennai, Tamil Nadu', status: 'Available', lastSeen: '3 hours ago', rating: 4.6, offering: ['DevOps', 'AWS', 'Terraform'], lookingFor: ['Azure', 'GCP', 'Security'], description: 'DevOps engineer passionate about cloud infrastructure and automation.', swaps: 15, responseRate: '85%', avatar: 'VR' },
];

// --- DATA for Swap Requests Page ---
const swapRequests = [
    { id: 1, name: 'Marc Demo', avatar: 'MD', rating: '3.9/5', skillsOffered: ['JavaScript'], skillsWanted: ['Photoshop'], status: 'Pending' },
    { id: 2, name: 'Anita Singh', avatar: 'AS', rating: '4.9/5', skillsOffered: ['SwiftUI'], skillsWanted: ['Flutter'], status: 'Rejected' },
    { id: 3, name: 'Rajesh Kumar', avatar: 'RK', rating: '4.7/5', skillsOffered: ['Java'], skillsWanted: ['Docker'], status: 'Accepted' },
];


// --- SUB-COMPONENTS for Discover Page ---

const AvailabilityDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState('Availability');
    const dropdownRef = useRef(null);
    const options = ["Available currently", "Available after a week", "Available after some days"];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) { setIsOpen(false); }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => { document.removeEventListener("mousedown", handleClickOutside); };
    }, [dropdownRef]);

    return (
        <div className="relative" ref={dropdownRef}>
            <button onClick={() => setIsOpen(!isOpen)} className="flex items-center justify-between w-full md:w-48 border bg-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm">
                <span className="text-gray-700 truncate">{selectedOption}</span>
                <svg className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>
            {isOpen && (
                <div className="absolute z-10 mt-2 w-full bg-white border rounded-lg shadow-xl"><div className="py-1">{options.map((option) => (<a key={option} href="#" onClick={(e) => { e.preventDefault(); setSelectedOption(option); setIsOpen(false); }} className="flex items-center justify-between text-gray-700 px-4 py-2 text-sm hover:bg-gray-100">{option}{selectedOption === option && (<svg className="w-5 h-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>)}</a>))}</div></div>
            )}
        </div>
    );
};

const UserCard = ({ user }) => ( <div className="bg-white border rounded-lg p-6 flex flex-col justify-between shadow-sm hover:shadow-lg transition-shadow"> <div> <div className="flex justify-between items-start"> <div className="flex items-center space-x-4"> <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600 text-xl">{user.avatar}</div> <div> <h3 className="text-lg font-bold text-gray-800">{user.name}</h3> <p className="text-sm text-gray-500">{user.location}</p> </div> </div> <div className="flex items-center space-x-2"> <span className={`text-xs font-semibold ${user.status === 'Available' ? 'text-green-700 bg-green-100' : 'text-yellow-700 bg-yellow-100'} px-2 py-1 rounded-full`}>{user.status}</span> <button className="text-gray-400 hover:text-gray-600"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg></button> </div> </div> <p className="text-sm text-gray-400 mt-1 ml-16">{user.lastSeen}</p> <div className="flex justify-end text-yellow-500 items-center"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg><span className="ml-1 font-bold">{user.rating}</span> </div> <div className="mt-4 space-y-4"> <div> <h4 className="text-sm font-semibold text-gray-500">Offering</h4> <div className="flex flex-wrap gap-2 mt-2">{user.offering.map(skill => <span key={skill} className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">{skill}</span>)}</div> </div> <div> <h4 className="text-sm font-semibold text-gray-500">Looking for</h4> <div className="flex flex-wrap gap-2 mt-2">{user.lookingFor.map(skill => <span key={skill} className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">{skill}</span>)}</div> </div> </div> <p className="text-sm text-gray-600 mt-4 h-10">{user.description}</p> </div> <div className="mt-6"> <div className="flex justify-between items-center text-sm text-gray-500"> <span>{user.swaps} swaps</span> <span>{user.responseRate} response</span> </div> <button className="w-full mt-2 bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-700 flex justify-center items-center font-semibold">Request Swap<svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg></button> </div> </div>);


// --- ENHANCED SUB-COMPONENTS for Swap Requests Page ---

const RequestCard = ({ request }) => {
    // Define styles for different statuses
    const statusInfo = {
        Pending: {
            badge: 'bg-yellow-100 text-yellow-800',
            text: 'Pending',
            actions: (
                <div className="flex items-center space-x-3 mt-4">
                    <button className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 transition-colors">Accept</button>
                    <button className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition-colors">Reject</button>
                </div>
            )
        },
        Accepted: {
            badge: 'bg-green-100 text-green-800',
            text: 'Accepted',
            actions: null
        },
        Rejected: {
            badge: 'bg-red-100 text-red-800',
            text: 'Rejected',
            actions: null
        },
    };

    const currentStatus = statusInfo[request.status];
  
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex items-center justify-between hover:shadow-lg hover:border-gray-300 transition-all duration-300">
        <div className="flex items-center space-x-6">
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600 text-3xl mb-2">{request.avatar}</div>
            <span className="text-sm text-gray-500">rating: {request.rating}</span>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">{request.name}</h3>
            <div className="flex items-center text-sm mb-3">
                <span className="text-gray-500 w-28 font-medium">Skills Offered:</span>
                <div className="flex flex-wrap gap-2">
                    {request.skillsOffered.map(skill => <span key={skill} className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">{skill}</span>)}
                </div>
            </div>
            <div className="flex items-center text-sm">
                <span className="text-gray-500 w-28 font-medium">Skill Wanted:</span>
                <div className="flex flex-wrap gap-2">
                    {request.skillsWanted.map(skill => <span key={skill} className="bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded-full">{skill}</span>)}
                </div>
            </div>
          </div>
        </div>
        <div className="text-right">
            <span className={`px-3 py-1 text-sm rounded-full font-semibold ${currentStatus.badge}`}>
                {currentStatus.text}
            </span>
            {currentStatus.actions}
        </div>
      </div>
    );
};
  
const Pagination = () => (<div className="mt-8 flex justify-center items-center space-x-2 text-gray-600"><button className="px-3 py-1 rounded-lg hover:bg-gray-200 transition-colors">{"<"}</button><button className="px-3 py-1 rounded-lg bg-gray-800 text-white font-bold">1</button><button className="px-3 py-1 rounded-lg hover:bg-gray-200 transition-colors">2</button><button className="px-3 py-1 rounded-lg hover:bg-gray-200 transition-colors">3</button><button className="px-3 py-1 rounded-lg hover:bg-gray-200 transition-colors">{">"}</button></div>);


// --- PAGE VIEWS ---

const DiscoverView = () => (
    <>
      <div className="px-8 pt-6">
        <div className="flex items-center space-x-4">
            <div className="flex-grow relative"><input type="text" placeholder="Search by name, skills, or expertise..." className="w-full pl-10 pr-4 py-2 border rounded-lg" /><svg className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg></div>
            <AvailabilityDropdown />
            <div className="flex items-center border rounded-lg"><button className="p-2 bg-gray-800 text-white rounded-l-md"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg></button><button className="p-2 border-l bg-white rounded-r-md"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg></button></div>
        </div>
      </div>
      <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {users.map(user => (<UserCard key={user.name} user={user} />))}
      </div>
    </>
);

const SwapRequestsView = () => (
    <div className="p-8">
      <div className="mb-8 flex justify-between items-center">
        <div className="flex items-center space-x-4">
            <select className="border-gray-300 rounded-lg px-4 py-2 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Pending</option><option>Accepted</option><option>Rejected</option>
            </select>
        </div>
        <div className="flex items-center space-x-2"><input type="text" placeholder="Search requests..." className="border-gray-300 rounded-lg px-4 py-2 w-80 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" /><button className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-700 font-semibold transition-colors">Search</button></div>
      </div>
      <div className="space-y-6">
        {swapRequests.map(request => (<RequestCard key={request.id} request={request} />))}
      </div>
      <Pagination />
    </div>
);


// --- SHARED COMPONENTS ---

const Header = () => (
    <header className="bg-white py-4 px-8 flex justify-between items-center border-b">
      <div className='flex items-center space-x-4'>
        <h1 className="text-2xl font-bold text-gray-800">SkillSwap</h1>
        <p className="text-sm text-gray-500 hidden md:block">Learn new skills by teaching what you know</p>
      </div>
      <div className="flex items-center space-x-4"><button className="text-gray-600 hover:text-gray-800 border px-4 py-2 rounded-lg">My Profile</button></div>
    </header>
);

const Footer = () => ( <footer className="bg-white border-t mt-8 py-10 px-8"> <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8"> <div className="md:col-span-2"> <h2 className="text-xl font-bold mb-4">SkillSwap</h2> <p className="text-gray-600 mb-4">Connect with fellow learners and exchange your skills to grow together in your career journey.</p> </div> <div> <h3 className="font-semibold text-gray-800 mb-4">Platform</h3> <ul className="space-y-2"> <li><a href="#" className="text-gray-600 hover:text-gray-800">Browse skills</a></li> <li><a href="#" className="text-gray-600 hover:text-gray-800">Success stories</a></li> <li><a href="#" className="text-gray-600 hover:text-gray-800">Community guidelines</a></li> </ul> </div> <div> <h3 className="font-semibold text-gray-800 mb-4">Support</h3> <ul className="space-y-2"> <li><a href="#" className="text-gray-600 hover:text-gray-800">Help center</a></li> <li><a href="#" className="text-gray-600 hover:text-gray-800">Contact us</a></li> <li><a href="#" className="text-gray-600 hover:text-gray-800">Report an issue</a></li> </ul> </div> <div> <h3 className="font-semibold text-gray-800 mb-4">Company</h3> <ul className="space-y-2"> <li><a href="#" className="text-gray-600 hover:text-gray-800">About us</a></li> <li><a href="#" className="text-gray-600 hover:text-gray-800">Careers</a></li> <li><a href="#" className="text-gray-600 hover:text-gray-800">Privacy policy</a></li> <li><a href="#" className="text-gray-600 hover:text-gray-800">Terms of service</a></li> </ul> </div> </div> <div className="max-w-7xl mx-auto mt-8 pt-8 border-t flex justify-between items-center text-sm text-gray-500"> <p>© 2024 SkillSwap. All rights reserved.</p> <p className="flex items-center">Trusted by 10,000+ learners</p> </div> </footer> );


// --- MAIN CONTROLLER COMPONENT ---

const DiscoverScreen = () => {
    const [activeTab, setActiveTab] = useState('Discover');

    const renderContent = () => {
        switch (activeTab) {
          case 'Discover': return <DiscoverView />;
          case 'Swap Requests': return <SwapRequestsView />;
          default: return <DiscoverView />;
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <Header />
            <main className="max-w-7xl mx-auto">
                {/* Tab Navigation */}
                <div className="px-8 pt-6 border-b bg-white">
                    <div className="flex space-x-8">
                        <button onClick={() => setActiveTab('Discover')} className={`pb-3 flex items-center space-x-2 ${activeTab === 'Discover' ? 'font-semibold text-gray-800 border-b-2 border-gray-800' : 'text-gray-500 hover:text-gray-800'}`}>
                            <span>Discover (6)</span>
                        </button>
                        <button onClick={() => setActiveTab('Swap Requests')} className={`pb-3 flex items-center space-x-2 ${activeTab === 'Swap Requests' ? 'font-semibold text-gray-800 border-b-2 border-gray-800' : 'text-gray-500 hover:text-gray-800'}`}>
                            <span>Swap Requests (3)</span>
                        </button>
                    </div>
                </div>

                {/* Render the active content based on the selected tab */}
                {renderContent()}

            </main>
            <Footer />
        </div>
    );
};

export default DiscoverScreen;