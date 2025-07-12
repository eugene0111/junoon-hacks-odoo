import React, { useState, useEffect, useRef } from 'react';
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

// A helper to get the auth token, assuming it's in localStorage
const getAuthToken = () => localStorage.getItem('token');
const navigate = useNavigate();

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

const UserCard = ({ user }) => (
    <Link to={`/users/${user._id}`} className="bg-white border rounded-lg p-6 flex flex-col justify-between shadow-sm hover:shadow-lg transition-shadow duration-300 hover:border-blue-500">
        <div>
            <div className="flex justify-between items-start"><div className="flex items-center space-x-4"><img src={user.profilePhoto || `https://i.pravatar.cc/150?u=${user.email}`} alt={`${user.firstName} ${user.lastName}`} className="w-12 h-12 bg-gray-200 rounded-full object-cover"/><div><h3 className="text-lg font-bold text-gray-800">{user.firstName} {user.lastName}</h3><p className="text-sm text-gray-500">{user.location}, {user.country}</p></div></div><div className="flex items-center space-x-2"><span className={`text-xs font-semibold ${user.availability === 'available' ? 'text-green-700 bg-green-100' : 'text-yellow-700 bg-yellow-100'} px-2 py-1 rounded-full capitalize`}>{user.availability}</span></div></div>
            <div className="flex justify-end text-yellow-500 items-center mt-2"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg><span className="ml-1 font-bold">{user.rating.toFixed(1)}</span></div>
            <div className="mt-4 space-y-4"><div><h4 className="text-sm font-semibold text-gray-500">Offering</h4><div className="flex flex-wrap gap-2 mt-2">{(user.skillsOffered || []).map(skill => <span key={skill} className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">{skill}</span>)}</div></div><div><h4 className="text-sm font-semibold text-gray-500">Looking for</h4><div className="flex flex-wrap gap-2 mt-2">{(user.skillsWanted || []).map(skill => <span key={skill} className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">{skill}</span>)}</div></div></div>
        </div>
        <div className="mt-6"><div className="flex justify-between items-center text-sm text-gray-500"><span>{user.swapsCompleted} swaps</span><span>1-2hr response</span></div><div className="w-full mt-2 text-center bg-blue-900 text-white py-2 rounded-lg hover:bg-gray-800 font-semibold transition-colors">View Profile</div></div>
    </Link>
);

const RequestCard = ({ swap, currentUserId }) => {
    const otherUser = swap.requester._id === currentUserId ? swap.provider : swap.requester;
    const role = swap.requester._id === currentUserId ? "Outgoing" : "Incoming";

    const statusInfo = {
        pending: { badge: 'bg-yellow-100 text-yellow-800', text: 'Pending' },
        accepted: { badge: 'bg-green-100 text-green-800', text: 'Accepted' },
        rejected: { badge: 'bg-red-100 text-red-800', text: 'Rejected' },
        completed: { badge: 'bg-blue-100 text-blue-800', text: 'Completed' },
        cancelled: { badge: 'bg-gray-100 text-gray-800', text: 'Cancelled' },
    };
    const currentStatus = statusInfo[swap.status] || statusInfo.pending;
  
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex items-center justify-between hover:shadow-lg hover:border-gray-300 transition-all duration-300">
        <div className="flex items-center space-x-6">
          <div className="text-center">
            <img src={otherUser.profilePhoto || `https://i.pravatar.cc/150?u=${otherUser._id}`} alt={otherUser.firstName} className="w-24 h-24 bg-gray-200 rounded-full object-cover mb-2"/>
            <span className="text-sm text-gray-500">rating: {otherUser.rating?.toFixed(1) || 'N/A'}</span>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">{otherUser.firstName} {otherUser.lastName}</h3>
            {swap.post ? (
                <>
                    <div className="flex items-center text-sm mb-3"><span className="text-gray-500 w-28 font-medium">I Offer:</span><div className="flex flex-wrap gap-2"><span className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">{swap.post.skillOffered}</span></div></div>
                    <div className="flex items-center text-sm"><span className="text-gray-500 w-28 font-medium">I Want:</span><div className="flex flex-wrap gap-2"><span className="bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded-full">{swap.post.skillWanted}</span></div></div>
                </>
            ) : (
                <p className="text-sm text-gray-500">Direct user-to-user request.</p>
            )}
          </div>
        </div>
        <div className="text-right flex flex-col items-end">
            <span className={`px-3 py-1 text-sm rounded-full font-semibold ${currentStatus.badge}`}>{currentStatus.text}</span>
            <span className={`mt-2 text-xs font-bold ${role === "Incoming" ? "text-blue-600" : "text-purple-600"}`}>{role} Request</span>
            {swap.status === 'pending' && role === 'Incoming' && (
                <div className="flex items-center space-x-3 mt-4">
                    <button className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 transition-colors">Accept</button>
                    <button className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition-colors">Reject</button>
                </div>
            )}
        </div>
      </div>
    );
};
  
const Pagination = () => (<div className="mt-8 flex justify-center items-center space-x-2 text-gray-600"><button className="px-3 py-1 rounded-lg hover:bg-gray-200 transition-colors">{"<"}</button><button className="px-3 py-1 rounded-lg bg-gray-800 text-white font-bold">1</button><button className="px-3 py-1 rounded-lg hover:bg-gray-200 transition-colors">2</button><button className="px-3 py-1 rounded-lg hover:bg-gray-200 transition-colors">3</button><button className="px-3 py-1 rounded-lg hover:bg-gray-200 transition-colors">{">"}</button></div>);


const DiscoverView = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/users`);
                if (response.data && response.data.success) {
                    setUsers(response.data.data);
                } else {
                    throw new Error('Failed to fetch user data.');
                }
            } catch (err) {
                setError(err.message || "An unknown error occurred.");
                console.error("Error fetching users:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    if (loading) { return <div className="flex justify-center items-center h-96"><Loader2 className="w-12 h-12 animate-spin text-blue-500"/></div>; }
    if (error) { return <div className="p-8 text-center text-red-500 font-semibold">Error loading users: {error}</div>; }

    return (
        <><div className="px-8 pt-6"><div className="flex items-center space-x-4"><div className="flex-grow relative"><input type="text" placeholder="Search by name, skills, or expertise..." className="w-full pl-10 pr-4 py-2 border rounded-lg" /><svg className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg></div><AvailabilityDropdown /><div className="flex items-center border rounded-lg"><button className="p-2 bg-gray-800 text-white rounded-l-md"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg></button><button className="p-2 border-l bg-white rounded-r-md"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg></button></div></div></div>
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">{users.map(user => (<UserCard key={user._id} user={user} />))}</div></>
    );
};

const SwapRequestsView = ({ onUpdateCount }) => {
    const [swaps, setSwaps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const fetchSwapData = async () => {
            const token = getAuthToken();
            if (!token) {
                setError("Please log in to see your swap requests.");
                setLoading(false);
                return;
            }

            try {
                const [swapsRes, meRes] = await Promise.all([
                    axios.get('http://localhost:3000/api/swaps', { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get('http://localhost:3000/api/auth/me', { headers: { Authorization: `Bearer ${token}` } })
                ]);
                
                if (swapsRes.data && swapsRes.data.success) {
                    setSwaps(swapsRes.data.data);
                    onUpdateCount(swapsRes.data.count);
                } else {
                    throw new Error('Failed to fetch swaps.');
                }

                if (meRes.data && meRes.data.success) {
                    setCurrentUser(meRes.data.data);
                } else {
                    throw new Error('Failed to identify current user.');
                }

            } catch (err) {
                setError(err.message || "An error occurred fetching swap data.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchSwapData();
    }, [onUpdateCount]);

    if (loading) { return <div className="flex justify-center items-center h-96"><Loader2 className="w-12 h-12 animate-spin text-blue-500"/></div>; }
    if (error) { return <div className="p-8 text-center text-red-500 font-semibold">{error}</div>; }

    return (
        <div className="p-8">
            <div className="mb-8 flex justify-between items-center">
                <div className="flex items-center space-x-4"><select className="border-gray-300 rounded-lg px-4 py-2 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"><option>Pending</option><option>Accepted</option><option>Rejected</option></select></div>
                <div className="flex items-center space-x-2"><input type="text" placeholder="Search requests..." className="border-gray-300 rounded-lg px-4 py-2 w-80 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" /><button className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-700 font-semibold transition-colors">Search</button></div>
            </div>
            <div className="space-y-6">
                {swaps.length > 0 ? (
                    swaps.map(swap => (<RequestCard key={swap._id} swap={swap} currentUserId={currentUser._id} />))
                ) : (
                    <p className="text-center text-gray-500 py-10">You have no swap requests.</p>
                )}
            </div>
            <Pagination />
        </div>
    );
};

const Header = () => (
    <header className="bg-white py-4 px-8 flex justify-between items-center border-b">
        <div className='flex items-center space-x-4'>
            <h1 className="text-2xl font-bold text-gray-800">SkillSwap</h1>
        </div>
        <div className="flex items-center space-x-4">
            <button onClick={() => {navigate('/user-profile')}} className="text-gray-600 hover:text-gray-800 border px-4 py-2 rounded-lg">My Profile</button>
        </div>
    </header>
);

const Footer = () => (
    <footer className="mt-auto">
        <div className="bg-blue-900">
            <div className="max-w-7xl mx-auto py-12 px-8">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                    <div className="md:col-span-2">
                        <h2 className="text-xl font-bold text-white mb-4">SkillSwap</h2>
                    </div>
                    <div>
                        <h3 className="font-semibold text-white mb-4">Platform</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-slate-300 hover:text-white transition-colors">Browse skills</a></li>
                            <li><a href="#" className="text-slate-300 hover:text-white transition-colors">Success stories</a></li>
                            <li><a href="#" className="text-slate-300 hover:text-white transition-colors">Community guidelines</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold text-white mb-4">Support</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-slate-300 hover:text-white transition-colors">Help center</a></li>
                            <li><a href="#" className="text-slate-300 hover:text-white transition-colors">Contact us</a></li>
                            <li><a href="#" className="text-slate-300 hover:text-white transition-colors">Report an issue</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold text-white mb-4">Company</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-slate-300 hover:text-white transition-colors">About us</a></li>
                            <li><a href="#" className="text-slate-300 hover:text-white transition-colors">Careers</a></li>
                            <li><a href="#" className="text-slate-300 hover:text-white transition-colors">Privacy policy</a></li>
                            <li><a href="#" className="text-slate-300 hover:text-white transition-colors">Terms of service</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        {/* Bottom footer section with dark slate background */}
        <div className="bg-slate-900 text-slate-400">
            <div className="max-w-7xl mx-auto py-6 px-8 text-center">
                <p>© {new Date().getFullYear()} SkillSwap. All rights reserved.</p>
                <div className="mt-4 flex justify-center space-x-6">
                    <Link to="/about" className="hover:text-white transition-colors">About</Link>
                    <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
                    <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                </div>
            </div>
        </div>
    </footer>
);


const DiscoverScreen = () => {
    const [activeTab, setActiveTab] = useState('Discover');
    const [swapRequestCount, setSwapRequestCount] = useState(0);

    const renderContent = () => {
        switch (activeTab) {
          case 'Discover': return <DiscoverView />;
          case 'Swap Requests': return <SwapRequestsView onUpdateCount={setSwapRequestCount} />;
          default: return <DiscoverView />;
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow w-full">
                <div className="max-w-7xl mx-auto">
                    <div className="px-8 pt-6 border-b bg-white">
                        <div className="flex space-x-8">
                            <button onClick={() => setActiveTab('Discover')} className={`pb-3 flex items-center space-x-2 ${activeTab === 'Discover' ? 'font-semibold text-gray-800 border-b-2 border-gray-800' : 'text-gray-500 hover:text-gray-800'}`}>
                                <span>Discover</span>
                            </button>
                            <button onClick={() => setActiveTab('Swap Requests')} className={`pb-3 flex items-center space-x-2 ${activeTab === 'Swap Requests' ? 'font-semibold text-gray-800 border-b-2 border-gray-800' : 'text-gray-500 hover:text-gray-800'}`}>
                                <span>Swap Requests ({swapRequestCount})</span>
                            </button>
                        </div>
                    </div>
                    {renderContent()}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default DiscoverScreen;