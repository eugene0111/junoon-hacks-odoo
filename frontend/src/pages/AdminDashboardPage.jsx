import React, { useState, Fragment, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { LayoutDashboard, Users, ShieldX, Ban, Repeat, Send, Download, Loader2, AlertTriangle, Menu, X, Search, CheckCircle, Eye } from 'lucide-react';
import { Transition } from '@headlessui/react';
// --- IMPORT THE CHARTING COMPONENTS ---
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


// A helper to get the auth token, assuming it's in localStorage
const getAuthToken = () => localStorage.getItem('token');


// --- NEW COMPONENT FOR THE PLATFORM ACTIVITY CHART ---
const PlatformActivityChart = ({ users, swaps }) => {
    // Process data for the chart
    const data = [
        // This is sample data. In a real app, you'd process your actual user/swap data by month/day.
        { name: 'Jan', users: 12, swaps: 2 }, { name: 'Feb', users: 19, swaps: 3 },
        { name: 'Mar', users: 22, swaps: 1 }, { name: 'Apr', users: 25, swaps: 5 },
        { name: 'May', users: 21, swaps: 4 }, { name: 'Jun', users: 27, swaps: 7 },
        { name: 'Jul', users: users.length, swaps: swaps.filter(s => s.status === 'accepted').length },
    ];

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
          return (
            <div className="p-3 bg-white border border-slate-300 rounded-lg shadow-lg">
              <p className="font-bold text-slate-800">{`Month: ${label}`}</p>
              <p className="text-sm text-blue-600">{`New Users: ${payload[0].value}`}</p>
              <p className="text-sm text-emerald-600">{`Active Swaps: ${payload[1].value}`}</p>
            </div>
          );
        }
        return null;
    };

    return (
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm">
            <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-4">Platform Activity</h3>
            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={data}
                        margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                    >
                        <defs>
                            <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorSwaps" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                        <YAxis stroke="#6b7280" fontSize={12} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend wrapperStyle={{fontSize: "14px"}} />
                        <Area type="monotone" dataKey="users" name="Total Users" stroke="#3b82f6" fill="url(#colorUsers)" strokeWidth={2} />
                        <Area type="monotone" dataKey="swaps" name="Active Swaps" stroke="#10b981" fill="url(#colorSwaps)" strokeWidth={2} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};


const AdminDashboardPage = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeView, setActiveView] = useState('dashboard');
    const [users, setUsers] = useState([]);
    const [swaps, setSwaps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const moderationQueue = users.filter(user => 
        user.profileAnalysis && (user.profileAnalysis.rating === 'Moderate' || user.profileAnalysis.rating === 'Severe')
    );

    useEffect(() => {
        const fetchData = async () => {
            const token = getAuthToken();
            if (!token) {
                setError("Authentication token not found. Please log in.");
                setLoading(false);
                return;
            }
            const config = { headers: { Authorization: `Bearer ${token}` } };

            try {
                const [usersRes, swapsRes] = await Promise.all([
                    axios.get('http://localhost:3000/api/users', config),
                    axios.get('http://localhost:3000/api/swaps', config)
                ]);

                if (usersRes.data && usersRes.data.success) {
                    const usersWithStatus = usersRes.data.data.map(user => ({
                        ...user,
                        status: user.banned ? 'Banned' : 'Active',
                        joined: new Date(user.createdAt).toLocaleDateString(),
                    }));
                    setUsers(usersWithStatus);
                } else {
                    throw new Error('Failed to fetch user data.');
                }

                if (swapsRes.data && swapsRes.data.success) {
                    setSwaps(swapsRes.data.data);
                } else {
                    throw new Error('Failed to fetch swaps data.');
                }

            } catch (err) {
                setError(err.response?.data?.message || err.message || "An unknown error occurred while fetching data.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);
    
    const updateUserInList = (userId, updates) => {
        setUsers(users.map(u => (u._id === userId ? { ...u, ...updates } : u)));
    };

    const renderView = () => {
        if (loading) { return <div className="flex justify-center items-center h-full"><Loader2 className="w-12 h-12 animate-spin text-blue-500"/></div>; }
        if (error) { return (<div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg flex items-center"><AlertTriangle className="mr-3" /><div><p className="font-bold">Error</p><p>{error}</p></div></div>); }

        switch(activeView) {
            case 'dashboard': return <DashboardView users={users} swaps={swaps} moderationQueue={moderationQueue} />;
            case 'users': return <UserManagementView users={users} setUsers={setUsers} />;
            case 'moderation': return <ContentModerationView moderationQueue={moderationQueue} onUserUpdate={updateUserInList} />;
            case 'swaps': return <SwapMonitoringView swaps={swaps} />;
            case 'announcements': return <AnnouncementsView />;
            case 'reports': return <ReportsView users={users} swaps={swaps} />;
            default: return <DashboardView users={users} swaps={swaps} moderationQueue={moderationQueue} />;
        }
    };
    
    return (
        <div className="flex min-h-screen bg-slate-100 font-sans">
            <Sidebar activeView={activeView} setActiveView={setActiveView} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <div className="flex-1 flex flex-col">
                 <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    {renderView()}
                </main>
            </div>
        </div>
    );
};

const Sidebar = ({ activeView, setActiveView, sidebarOpen, setSidebarOpen }) => {
    const handleItemClick = (view) => {
        setActiveView(view);
        if (window.innerWidth < 1024) { setSidebarOpen(false); }
    };
    
    return (
        <>
            <Transition.Root show={sidebarOpen} as={Fragment}>
                <div className="lg:hidden">
                    <Transition.Child as={Fragment} enter="transition-opacity ease-linear duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="transition-opacity ease-linear duration-300" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0 bg-gray-900/80" onClick={() => setSidebarOpen(false)} />
                    </Transition.Child>
                    <Transition.Child as={Fragment} enter="transition ease-in-out duration-300 transform" enterFrom="-translate-x-full" enterTo="translate-x-0" leave="transition ease-in-out duration-300 transform" leaveFrom="translate-x-0" leaveTo="-translate-x-full">
                         <aside className="fixed inset-y-0 left-0 w-64 bg-white shadow-md flex flex-col z-40">
                            <div className="p-6 border-b border-slate-200"><h1 className="text-2xl font-bold text-slate-900">SkillSwap <span className="text-blue-600">Admin</span></h1></div>
                            <nav className="flex-1 p-4 space-y-2">
                                <SidebarItem icon={<LayoutDashboard />} label="Dashboard" view="dashboard" activeView={activeView} onClick={handleItemClick} />
                                <SidebarItem icon={<Users />} label="User Management" view="users" activeView={activeView} onClick={handleItemClick} />
                                <SidebarItem icon={<ShieldX />} label="Content Moderation" view="moderation" activeView={activeView} onClick={handleItemClick} />
                                <SidebarItem icon={<Repeat />} label="Swap Monitoring" view="swaps" activeView={activeView} onClick={handleItemClick} />
                                <SidebarItem icon={<Send />} label="Announcements" view="announcements" activeView={activeView} onClick={handleItemClick} />
                                <SidebarItem icon={<Download />} label="Reports" view="reports" activeView={activeView} onClick={handleItemClick} />
                            </nav>
                            <div className="p-4 border-t border-slate-200"><Link to="/" className="text-slate-600 hover:text-blue-600 font-semibold">Back to Site</Link></div>
                        </aside>
                    </Transition.Child>
                </div>
            </Transition.Root>
            <aside className="hidden lg:flex w-64 bg-white shadow-md flex-col flex-shrink-0">
                <div className="p-6 border-b border-slate-200"><h1 className="text-2xl font-bold text-slate-900">SkillSwap <span className="text-blue-600">Admin</span></h1></div>
                <nav className="flex-1 p-4 space-y-2">
                    <SidebarItem icon={<LayoutDashboard />} label="Dashboard" view="dashboard" activeView={activeView} onClick={setActiveView} />
                    <SidebarItem icon={<Users />} label="User Management" view="users" activeView={activeView} onClick={setActiveView} />
                    <SidebarItem icon={<ShieldX />} label="Content Moderation" view="moderation" activeView={activeView} onClick={setActiveView} />
                    <SidebarItem icon={<Repeat />} label="Swap Monitoring" view="swaps" activeView={activeView} onClick={setActiveView} />
                    <SidebarItem icon={<Send />} label="Announcements" view="announcements" activeView={activeView} onClick={setActiveView} />
                    <SidebarItem icon={<Download />} label="Reports" view="reports" activeView={activeView} onClick={setActiveView} />
                </nav>
                <div className="p-4 border-t border-slate-200"><Link to="/" className="text-slate-600 hover:text-blue-600 font-semibold">Back to Site</Link></div>
            </aside>
        </>
    );
};

const Header = ({ sidebarOpen, setSidebarOpen }) => (
    <header className="sticky top-0 bg-white/75 backdrop-blur-sm z-10 lg:hidden p-4 border-b border-slate-200 flex justify-between items-center">
        <h1 className="text-xl font-bold text-slate-900">SkillSwap <span className="text-blue-600">Admin</span></h1>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-md text-slate-600 hover:bg-slate-200">
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
    </header>
);

const SidebarItem = ({ icon, label, view, activeView, onClick }) => (
    <button onClick={() => onClick(view)} className={`w-full flex items-center space-x-3 py-2 px-4 rounded-lg transition-colors ${activeView === view ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-200'}`}>
        {icon}
        <span className="font-semibold">{label}</span>
    </button>
);

// --- UPDATED DashboardView with the chart ---
const DashboardView = ({ users, swaps, moderationQueue }) => {
    const totalUsers = users.length;
    const bannedUsers = users.filter(user => user.status === 'Banned').length;
    const activeSwaps = swaps.filter(swap => swap.status === 'accepted' || swap.status === 'pending').length;
    const pendingModeration = moderationQueue.length;

    return (
        <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-6">Dashboard Overview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <StatCard title="Total Users" value={totalUsers} icon={<Users className="text-blue-500" />} />
                <StatCard title="Active Swaps" value={activeSwaps} icon={<Repeat className="text-emerald-500" />} />
                <StatCard title="Pending Moderation" value={pendingModeration} icon={<ShieldX className="text-amber-500" />} />
                <StatCard title="Banned Users" value={bannedUsers} icon={<Ban className="text-rose-500" />} />
            </div>
            <div className="mt-8">
                {/* --- The chart component is now used here --- */}
                <PlatformActivityChart users={users} swaps={swaps} />
            </div>
        </div>
    );
};

const UserManagementView = ({ users, setUsers }) => {
    const toggleUserBanStatus = async (userId, currentStatus) => {
        const isBanned = currentStatus === 'Banned';
        const action = isBanned ? 'unban' : 'ban';
        const confirmationText = `Are you sure you want to ${action} this user?`;

        if (window.confirm(confirmationText)) {
            const token = getAuthToken();
            if (!token) {
                alert("Authentication error. Please log in again.");
                return;
            }

            try {
                await axios.put(`http://localhost:3000/api/users/${userId}/${action}`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setUsers(users.map(u => 
                    u._id === userId ? { ...u, status: isBanned ? 'Active' : 'Banned' } : u
                ));
                alert(`User has been successfully ${action}ned.`);
            } catch (error) {
                alert(`Error: Could not ${action} the user. Please try again.`);
            }
        }
    };

    return (
        <div>
             <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-6">User Management</h2>
             <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                    <div className="relative w-full sm:max-w-xs">
                        <input type="text" placeholder="Search users..." className="w-full p-2 pl-10 border border-slate-300 rounded-lg"/>
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20}/>
                    </div>
                     <p className="sm:hidden text-sm text-slate-500">Scroll horizontally to see all columns →</p>
                </div>
                <div className="overflow-x-auto">
                     <table className="w-full text-left min-w-[640px]">
                        <thead className="border-b border-slate-200 text-slate-600">
                            <tr><th className="p-3">User</th><th className="p-3">Email</th><th className="p-3">Joined Date</th><th className="p-3">Status</th><th className="p-3 text-right">Actions</th></tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user._id} className="border-b border-slate-100">
                                    <td className="p-3 font-semibold">{user.firstName} {user.lastName}</td>
                                    <td className="p-3 text-sm">{user.email}</td>
                                    <td className="p-3 text-sm">{user.joined}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${user.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="p-3 text-right">
                                        {user.status === 'Banned' ? (
                                            <button onClick={() => toggleUserBanStatus(user._id, user.status)} className="bg-emerald-500 text-white px-3 py-1 rounded-lg hover:bg-emerald-600 flex items-center gap-1 float-right text-sm"><CheckCircle size={14}/> Unban</button>
                                        ) : (
                                            <button onClick={() => toggleUserBanStatus(user._id, user.status)} className="bg-rose-500 text-white px-3 py-1 rounded-lg hover:bg-rose-600 flex items-center gap-1 float-right text-sm"><Ban size={14}/> Ban</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
             </div>
        </div>
    );
};

const ContentModerationView = ({ moderationQueue, onUserUpdate }) => {
    const getRatingClass = (rating) => {
        if (rating === 'Severe') return 'bg-rose-100 text-rose-800';
        if (rating === 'Moderate') return 'bg-amber-100 text-amber-800';
        return 'bg-slate-100 text-slate-800';
    };

    const handleDismiss = (userId) => {
        console.log(`Dismissing flag for user ${userId}.`);
        onUserUpdate(userId, { profileAnalysis: { rating: 'Good', recommendation: 'Flag dismissed by admin.' } });
    };

    const handleBan = async (userId) => {
        if (window.confirm("Are you sure you want to ban this user? This action is permanent.")) {
            const token = getAuthToken();
            if (!token) {
                alert("Authentication error. Please log in again.");
                return;
            }
            try {
                await axios.put(`http://localhost:3000/api/users/${userId}/ban`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                onUserUpdate(userId, { status: 'Banned', profileAnalysis: { rating: 'Good', recommendation: 'User banned by admin.' } });
                alert("User has been banned.");
            } catch (error) {
                alert("Error: Could not ban user.");
            }
        }
    };

    return (
        <div>
             <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-6">Content Moderation Queue</h2>
             <div className="space-y-4">
                {moderationQueue.length > 0 ? (
                    moderationQueue.map(user => (
                        <div key={user._id} className="bg-white p-4 rounded-xl shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-l-4 border-amber-500">
                            <div>
                                <div className="flex items-center gap-4">
                                    <h3 className="font-bold text-slate-800 text-lg">{user.firstName} {user.lastName}</h3>
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getRatingClass(user.profileAnalysis.rating)}`}>
                                        {user.profileAnalysis.rating}
                                    </span>
                                </div>
                                <p className="text-sm text-slate-500 mt-1">Joined: <span className="font-semibold">{user.joined}</span></p>
                                <p className="text-sm text-slate-600 mt-2">
                                    <span className="font-semibold">Analyzer Recommendation:</span> {user.profileAnalysis.recommendation}
                                </p>
                            </div>
                            <div className="flex space-x-2 w-full sm:w-auto shrink-0">
                                <button onClick={() => handleDismiss(user._id)} className="flex-1 sm:flex-none bg-slate-600 text-white px-4 py-2 rounded-lg hover:bg-slate-700 text-sm font-semibold flex items-center justify-center gap-2"><Eye size={16}/> Dismiss</button>
                                <button onClick={() => handleBan(user._id)} className="flex-1 sm:flex-none bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 text-sm font-semibold flex items-center justify-center gap-2"><Ban size={16}/> Ban User</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-10 bg-white rounded-lg shadow-sm">
                        <CheckCircle className="mx-auto text-emerald-500 w-12 h-12" />
                        <h3 className="mt-2 text-lg font-medium text-slate-900">Queue is Clear</h3>
                        <p className="mt-1 text-sm text-slate-500">No user profiles are currently flagged for review.</p>
                    </div>
                )}
             </div>
        </div>
    );
};


const SwapMonitoringView = ({swaps}) => {
    const getStatusClass = (status) => {
        switch (status) {
            case 'accepted': return 'bg-emerald-100 text-emerald-800';
            case 'completed': return 'bg-blue-100 text-blue-800';
            case 'cancelled':
            case 'rejected': return 'bg-rose-100 text-rose-800';
            case 'pending':
            default: return 'bg-amber-100 text-amber-800';
        }
    };

    return (
        <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-6">Swap Monitoring</h2>
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm">
                 <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[640px]">
                        <thead className="border-b border-slate-200 text-slate-600">
                            <tr>
                                <th className="p-3">Swap ID</th>
                                <th className="p-3">Participants</th>
                                <th className="p-3">Skill Swap</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {swaps.map(swap => {
                                const participants = [
                                    `${swap.requester.firstName || ''} ${swap.requester.lastName || ''}`.trim(),
                                    `${swap.provider.firstName || ''} ${swap.provider.lastName || ''}`.trim()
                                ];
                                let skillSwapText = 'N/A';
                                if (swap.post) {
                                    skillSwapText = `${swap.post.skillOffered} <> ${swap.post.skillWanted}`;
                                } else if (swap.details) {
                                    skillSwapText = `${swap.details.skillOfferedByRequester} <> ${swap.details.skillWantedByRequester}`;
                                }
                                return (
                                     <tr key={swap._id} className="border-b border-slate-100">
                                        <td className="p-3 font-mono text-xs">{swap._id}</td>
                                        <td className="p-3 text-sm">{participants.join(' & ')}</td>
                                        <td className="p-3 text-sm">{skillSwapText}</td>
                                        <td className="p-3">
                                             <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusClass(swap.status)}`}>
                                                 {swap.status}
                                             </span>
                                        </td>
                                        <td className="p-3 text-sm">{new Date(swap.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const AnnouncementsView = () => (
    <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-6">Send Announcement</h2>
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm max-w-2xl mx-auto">
            <div className="space-y-4">
                <div>
                    <label htmlFor="subject" className="font-semibold text-slate-600 text-sm">Subject</label>
                    <input id="subject" type="text" placeholder="e.g., Upcoming Maintenance" className="w-full mt-1 p-2 border border-slate-300 rounded-lg"/>
                </div>
                <div>
                    <label htmlFor="message" className="font-semibold text-slate-600 text-sm">Message</label>
                    <textarea id="message" rows="6" placeholder="Write your announcement here..." className="w-full mt-1 p-2 border border-slate-300 rounded-lg"></textarea>
                </div>
                <button className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2">
                    <Send size={18}/> Send Announcement
                </button>
            </div>
        </div>
    </div>
);

const ReportsView = ({ users, swaps }) => {
    const downloadCSV = (data, filename) => {
        if (!data || data.length === 0) {
            alert("No data available to download.");
            return;
        }
        const headers = Object.keys(data[0]);
        const csvContent = [
            headers.join(','),
            ...data.map(row => 
                headers.map(header => `"${String(row[header]).replace(/"/g, '""')}"`).join(',')
            )
        ].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `${filename}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-6">Download Reports</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <ReportCard title="User Activity Log" description="CSV of all users in the system." onDownload={() => downloadCSV(users, 'user_activity_log')} />
                <ReportCard title="Feedback & Ratings" description="Complete log of all feedback and ratings submitted by users." onDownload={() => alert("No feedback data available.")}/>
                <ReportCard title="Swap Statistics" description="Detailed report on all pending, completed, and cancelled swaps." onDownload={() => downloadCSV(swaps, 'swap_statistics')}/>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, icon }) => (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm flex items-center space-x-4">
        <div className="bg-slate-100 p-3 rounded-full">{icon}</div>
        <div>
            <p className="text-slate-500 text-sm font-semibold">{title}</p>
            <p className="text-xl sm:text-2xl font-bold text-slate-900">{value}</p>
        </div>
    </div>
);

const ReportCard = ({ title, description, onDownload }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col">
        <h3 className="text-base sm:text-lg font-bold text-slate-800">{title}</h3>
        <p className="text-sm text-slate-500 mt-2 mb-4 flex-grow">{description}</p>
        <button onClick={onDownload} className="w-full bg-slate-800 text-white font-semibold py-2 rounded-lg hover:bg-slate-900 flex items-center justify-center gap-2 text-sm">
            <Download size={16}/> Download .CSV
        </button>
    </div>
);

export default AdminDashboardPage;