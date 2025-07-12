
import { SKILL_LIST } from '../../../skills'; // Note: the path is now ../skills.js

// Header Component
const Header = () => (
  <header className="bg-white py-4 px-8 flex justify-between items-center border-b">
    <div className='flex items-center space-x-4'>
        <h1 className="text-2xl font-bold text-gray-800">SkillSwap</h1>
        <p className="text-sm text-gray-500 hidden md:block">Learn new skills by teaching what you know</p>
    </div>
    <div className="flex items-center space-x-4">
      <button className="text-gray-600 hover:text-gray-800 border px-4 py-2 rounded-md">My Profile</button>
      <button className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700">Start Teaching</button>
    </div>
  </header>
);

// Search and Tabs Component
const SearchAndTabs = () => (
  <div className="px-8 py-6">
    <div className="flex justify-between items-center mb-6">
      <div className="flex space-x-8 border-b w-full">
        <button className="font-semibold text-gray-800 border-b-2 border-gray-800 pb-2 flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.022 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>
            <span>Discover (6)</span>
        </button>
        <button className="text-gray-500 hover:text-gray-800 pb-2 flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12 7a1 1 0 11-2 0 1 1 0 012 0zm-4 0a1 1 0 11-2 0 1 1 0 012 0zM8 9a1 1 0 100 2h4a1 1 0 100-2H8z" clipRule="evenodd" /><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM3 10a7 7 0 1114 0 7 7 0 01-14 0z" clipRule="evenodd" /></svg>
            <span>Trending</span>
        </button>
        <button className="text-gray-500 hover:text-gray-800 pb-2 flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-3-5 3V4z" /></svg>
            <span>My Matches (3)</span>
        </button>
        <button className="text-gray-500 hover:text-gray-800 pb-2 flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2 11h14.586l-2.293 2.293a1 1 0 001.414 1.414l4-4a1 1 0 000-1.414l-4-4a1 1 0 00-1.414 1.414L16.586 9H2a1 1 0 000 2z" /></svg>
            <span>Analytics</span>
        </button>
      </div>
    </div>
    <div className="flex items-center space-x-4">
      <div className="flex-grow relative">
        <input
          type="text"
          placeholder="Search by name, skills, or expertise..."
          className="w-full pl-10 pr-4 py-2 border rounded-md"
        />
        <svg className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
      </div>
      <button className="flex items-center space-x-2 border px-4 py-2 rounded-md">
        <span>Availability</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
      </button>
      <div className="flex items-center border rounded-md">
        <button className="p-2 bg-gray-800 text-white"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg></button>
        <button className="p-2 border-l"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg></button>
      </div>
      <div className="flex items-center space-x-2 bg-gray-200 rounded-md p-1">
        <button className="bg-white px-4 py-1 rounded-md shadow">All</button>
        <button className="px-4 py-1 text-gray-600">Pro</button>
        <button className="px-4 py-1 text-gray-600">Beginners</button>
        <button className="px-4 py-1 text-gray-600">Experts</button>
      </div>
    </div>
  </div>
);

// User Card Component
const UserCard = ({ user }) => (
    <div className="bg-white border rounded-lg p-6 flex flex-col justify-between shadow-sm hover:shadow-lg transition-shadow duration-300">
      <div>
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600 text-xl">{user.avatar}</div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">{user.name}</h3>
              <p className="text-sm text-gray-500">{user.location}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {user.isPro && <span className="text-xs font-bold text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">Pro</span>}
            <span className={`text-xs font-semibold ${user.status === 'Available' ? 'text-green-700 bg-green-100' : 'text-yellow-700 bg-yellow-100'} px-2 py-1 rounded-full`}>{user.status}</span>
            <button className="text-gray-400 hover:text-gray-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
            </button>
          </div>
        </div>
        <p className="text-sm text-gray-400 mt-1 ml-16">{user.lastSeen}</p>
        <div className="flex justify-end text-yellow-500 items-center">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
            <span className="ml-1 font-bold">{user.rating}</span>
        </div>
        <div className="mt-4 space-y-4">
          <div>
            <h4 className="text-sm font-semibold text-gray-500">Offering</h4>
            <div className="flex flex-wrap gap-2 mt-2">
              {user.offering.map(skill => <span key={skill} className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">{skill}</span>)}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-500">Looking for</h4>
            <div className="flex flex-wrap gap-2 mt-2">
              {user.lookingFor.map(skill => <span key={skill} className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">{skill}</span>)}
            </div>
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-4 h-10">{user.description}</p>
      </div>
      <div className="mt-6">
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>{user.swaps} swaps</span>
          <span>{user.responseRate} response</span>
        </div>
        <button className="w-full mt-2 bg-gray-800 text-white py-2 rounded-md hover:bg-gray-700 flex justify-center items-center font-semibold">
          Request Swap
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
        </button>
      </div>
    </div>
  );

// Footer Component
const Footer = () => (
    <footer className="bg-white border-t mt-8 py-10 px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8">
        <div className="md:col-span-2">
          <h2 className="text-xl font-bold mb-4">SkillSwap</h2>
          <p className="text-gray-600 mb-4">Connect with fellow learners and exchange your skills to grow together in your career journey.</p>
          <div className="flex space-x-4">
            {/* Social Icons can be added here */}
          </div>
        </div>
        <div>
          <h3 className="font-semibold text-gray-800 mb-4">Platform</h3>
          <ul className="space-y-2">
            <li><a href="#" className="text-gray-600 hover:text-gray-800">Browse skills</a></li>
            <li><a href="#" className="text-gray-600 hover:text-gray-800">Success stories</a></li>
            <li><a href="#" className="text-gray-600 hover:text-gray-800">Community guidelines</a></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-gray-800 mb-4">Support</h3>
          <ul className="space-y-2">
            <li><a href="#" className="text-gray-600 hover:text-gray-800">Help center</a></li>
            <li><a href="#" className="text-gray-600 hover:text-gray-800">Contact us</a></li>
            <li><a href="#" className="text-gray-600 hover:text-gray-800">Report an issue</a></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-gray-800 mb-4">Company</h3>
          <ul className="space-y-2">
            <li><a href="#" className="text-gray-600 hover:text-gray-800">About us</a></li>
            <li><a href="#" className="text-gray-600 hover:text-gray-800">Careers</a></li>
            <li><a href="#" className="text-gray-600 hover:text-gray-800">Privacy policy</a></li>
            <li><a href="#" className="text-gray-600 hover:text-gray-800">Terms of service</a></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-8 pt-8 border-t flex justify-between items-center text-sm text-gray-500">
        <p>© 2024 SkillSwap. All rights reserved.</p>
        <p className="flex items-center">
            Trusted by 10,000+ learners
        </p>
      </div>
    </footer>
  );

// Main HomeScreen Component that assembles everything
const HomeScreen = () => {
    return (
      <div className="bg-gray-50 min-h-screen">
        <Header />
        <main className="max-w-7xl mx-auto">
          <SearchAndTabs />
          <div className="px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SKILL_LIST.map(user => (
              <UserCard key={user.name} user={user} />
            ))}
          </div>
        </main>
        <Footer />
      </div>
    );
  };
  
  export default HomeScreen;