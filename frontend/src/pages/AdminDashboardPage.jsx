import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Users, ShieldX, Ban, Repeat, Send, Download, BarChart2, Bell, Search } from 'lucide-react';

// --- MOCK DATA ---
const mockUsers = [
  { id: 1, name: 'Alex Doe', email: 'alex.doe@example.com', joined: '2024-10-15', status: 'Active' },
  { id: 2, name: 'Marc Demo', email: 'marc.demo@example.com', joined: '2024-10-12', status: 'Active' },
  { id: 3, name: 'Jane Smith', email: 'jane.smith@example.com', joined: '2024-09-28', status: 'Banned' },
  { id: 4, name: 'Chris Lee', email: 'chris.lee@example.com', joined: '2024-09-20', status: 'Active' },
];

const mockModerationItems = [
  { id: 1, user: 'NewUser123', skill: 'Professional Cuddler', reason: 'Potentially inappropriate' },
  { id: 2, user: 'SpamBot', skill: 'FREE MONEY CLICK HERE', reason: 'Obvious spam' },
];

const mockSwaps = [
    {id: 'S1024', participants: ['Alex Doe', 'Marc Demo'], skill: 'React <> Python', status: 'Accepted', date: '2024-11-01'},
    {id: 'S1023', participants: ['Chris Lee', 'Jane Smith'], skill: 'Design <> Cooking', status: 'Cancelled', date: '2024-10-28'},
    {id: 'S1022', participants: ['Alex Doe', 'NewUser123'], skill: 'Photoshop <> Marketing', status: 'Pending', date: '2024-11-05'},
];


// --- MAIN ADMIN PAGE COMPONENT ---
const AdminDashboardPage = () => {
    
    const [activeView, setActiveView] = useState('dashboard');

    const renderView = () => {
        switch(activeView) {
            case 'dashboard': return <DashboardView />;
            case 'users': return <UserManagementView />;
            case 'moderation': return <ContentModerationView />;
            case 'swaps': return <SwapMonitoringView />;
            case 'announcements': return <AnnouncementsView />;
            case 'reports': return <ReportsView />;
            default: return <DashboardView />;
        }
    };
    
    return (
        <div className="flex min-h-screen bg-slate-100 font-sans">
            <Sidebar activeView={activeView} setActiveView={setActiveView} />
            <main className="flex-1 p-8">
                {renderView()}
            </main>
        </div>
    );
};


const Sidebar = ({ activeView, setActiveView }) => (
    <aside className="w-64 bg-white shadow-md flex flex-col">
        <div className="p-6 border-b border-slate-200">
            <h1 className="text-2xl font-bold text-slate-900">SkillSwap <span className="text-blue-600">Admin</span></h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
            <SidebarItem icon={<LayoutDashboard />} label="Dashboard" view="dashboard" activeView={activeView} onClick={setActiveView} />
            <SidebarItem icon={<Users />} label="User Management" view="users" activeView={activeView} onClick={setActiveView} />
            <SidebarItem icon={<ShieldX />} label="Content Moderation" view="moderation" activeView={activeView} onClick={setActiveView} />
            <SidebarItem icon={<Repeat />} label="Swap Monitoring" view="swaps" activeView={activeView} onClick={setActiveView} />
            <SidebarItem icon={<Send />} label="Announcements" view="announcements" activeView={activeView} onClick={setActiveView} />
            <SidebarItem icon={<Download />} label="Reports" view="reports" activeView={activeView} onClick={setActiveView} />
        </nav>
        <div className="p-4 border-t border-slate-200">
             <Link to="/profile" className="text-slate-600 hover:text-blue-600 font-semibold">Back to Site</Link>
        </div>
    </aside>
);

const SidebarItem = ({ icon, label, view, activeView, onClick }) => (
    <button 
        onClick={() => onClick(view)}
        className={`w-full flex items-center space-x-3 py-2 px-4 rounded-lg transition-colors ${activeView === view ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-200'}`}
    >
        {icon}
        <span className="font-semibold">{label}</span>
    </button>
);


const DashboardView = () => (
    <div>
        <h2 className="text-3xl font-bold text-slate-800 mb-6">Dashboard Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Total Users" value="1,258" icon={<Users className="text-blue-500" />} />
            <StatCard title="Active Swaps" value="312" icon={<Repeat className="text-emerald-500" />} />
            <StatCard title="Pending Moderation" value="2" icon={<ShieldX className="text-amber-500" />} />
            <StatCard title="Banned Users" value="17" icon={<Ban className="text-rose-500" />} />
        </div>
        <div className="mt-8 bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-xl font-bold text-slate-800 mb-4">Platform Activity</h3>
            <div className="h-64 bg-slate-200 rounded-lg flex items-center justify-center">
                <p className="text-slate-500">Chart placeholder (e.g., Recharts)</p>
            </div>
        </div>
    </div>
);

const UserManagementView = () => {
    const [users, setUsers] = useState(mockUsers);
    const banUser = (userId) => {
        if(window.confirm('Are you sure you want to ban this user?')) {
            setUsers(users.map(u => u.id === userId ? {...u, status: 'Banned'} : u));
            alert(`User ${userId} has been banned.`);
        }
    };
    return (
        <div>
             <h2 className="text-3xl font-bold text-slate-800 mb-6">User Management</h2>
             <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <div className="relative w-full max-w-xs">
                        <input type="text" placeholder="Search users..." className="w-full p-2 pl-10 border border-slate-300 rounded-lg"/>
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20}/>
                    </div>
                </div>
                <div className="overflow-x-auto">
                     <table className="w-full text-left">
                        <thead className="border-b border-slate-200 text-slate-600">
                            <tr>
                                <th className="p-3">User</th><th className="p-3">Email</th><th className="p-3">Joined Date</th><th className="p-3">Status</th><th className="p-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id} className="border-b border-slate-100">
                                    <td className="p-3 font-semibold">{user.name}</td>
                                    <td className="p-3">{user.email}</td>
                                    <td className="p-3">{user.joined}</td>
                                    <td className="p-3"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${user.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>{user.status}</span></td>
                                    <td className="p-3 text-right">
                                        <button onClick={() => banUser(user.id)} disabled={user.status === 'Banned'} className="bg-rose-500 text-white px-3 py-1 rounded-lg hover:bg-rose-600 disabled:bg-rose-300 disabled:cursor-not-allowed flex items-center gap-1 float-right"><Ban size={14}/> Ban</button>
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

const ContentModerationView = () => (
    <div>
         <h2 className="text-3xl font-bold text-slate-800 mb-6">Content Moderation Queue</h2>
         <div className="space-y-4">
            {mockModerationItems.map(item => (
                <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm flex justify-between items-center">
                    <div>
                        <p className="font-bold text-slate-800">{item.skill}</p>
                        <p className="text-sm text-slate-500">Submitted by: <span className="font-semibold">{item.user}</span> | Reason: {item.reason}</p>
                    </div>
                    <div className="flex space-x-2">
                        <button className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600">Approve</button>
                        <button className="bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600">Reject</button>
                    </div>
                </div>
            ))}
         </div>
    </div>
);

const SwapMonitoringView = () => (
    <div>
        <h2 className="text-3xl font-bold text-slate-800 mb-6">Swap Monitoring</h2>
        <div className="bg-white p-6 rounded-xl shadow-sm">
            {/* Table for swaps similar to UserManagementView */}
             <p className="text-slate-500">A table displaying all swaps (ID, participants, status, etc.) would go here.</p>
        </div>
    </div>
);

const AnnouncementsView = () => (
    <div>
        <h2 className="text-3xl font-bold text-slate-800 mb-6">Send Platform-Wide Announcement</h2>
        <div className="bg-white p-6 rounded-xl shadow-sm max-w-2xl mx-auto">
            <div className="space-y-4">
                <div>
                    <label className="font-semibold text-slate-600">Subject</label>
                    <input type="text" placeholder="e.g., Upcoming Maintenance" className="w-full mt-1 p-2 border border-slate-300 rounded-lg"/>
                </div>
                <div>
                    <label className="font-semibold text-slate-600">Message</label>
                    <textarea rows="6" placeholder="Write your announcement here..." className="w-full mt-1 p-2 border border-slate-300 rounded-lg"></textarea>
                </div>
                <button className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2">
                    <Send size={18}/> Send Announcement
                </button>
            </div>
        </div>
    </div>
);

const ReportsView = () => (
    <div>
        <h2 className="text-3xl font-bold text-slate-800 mb-6">Download Reports</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ReportCard title="User Activity Log" description="CSV of all user sign-ups, logins, and profile updates." />
            <ReportCard title="Feedback & Ratings" description="Complete log of all feedback and ratings submitted by users." />
            <ReportCard title="Swap Statistics" description="Detailed report on all pending, completed, and cancelled swaps." />
        </div>
    </div>
);




const StatCard = ({ title, value, icon }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm flex items-center space-x-4">
        <div className="bg-slate-100 p-3 rounded-full">{icon}</div>
        <div>
            <p className="text-slate-500 text-sm font-semibold">{title}</p>
            <p className="text-2xl font-bold text-slate-900">{value}</p>
        </div>
    </div>
);

const ReportCard = ({ title, description }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-bold text-slate-800">{title}</h3>
        <p className="text-sm text-slate-500 mt-2 mb-4">{description}</p>
        <button className="w-full bg-slate-800 text-white font-semibold py-2 rounded-lg hover:bg-slate-900 flex items-center justify-center gap-2">
            <Download size={16}/> Download .CSV
        </button>
    </div>
);

export default AdminDashboardPage;