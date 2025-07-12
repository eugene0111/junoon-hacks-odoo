import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Users, Repeat, ShieldCheck, Zap, MessageSquare, Moon, Sun } from 'lucide-react';

const LandingPage = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const navigate = useNavigate();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  return (
    <div className="bg-white dark:bg-slate-900 font-sans text-slate-800 dark:text-slate-200 antialiased">
      <header className="fixed top-0 left-0 right-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg z-50 border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-slate-900 dark:text-white">
            SkillSwap
          </Link>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-500 transition-colors">Features</a>
            <a href="#how-it-works" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-500 transition-colors">How It Works</a>
          </nav>
          <div className="flex items-center space-x-4">
            <button onClick={() => {navigate('/auth')}} className="hidden sm:block bg-blue-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md">
              Auth
            </button>
            <DarkModeToggle isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
          </div>
        </div>
      </header>

      <main>
        <section className="pt-32 pb-20 md:pt-40 md:pb-28 text-center bg-slate-50 dark:bg-slate-800/50">
          <div className="container mx-auto px-6">
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white leading-tight">
              Unlock Your Potential.
              <br/>
              <span className="text-blue-600 dark:text-blue-500">One Skill Swap at a Time.</span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-400">
              Join a global community where you can learn new skills by sharing your expertise. No money exchanged, just pure knowledge and growth.
            </p>
            <div className="mt-10">
              <Link to="/signup" className="bg-blue-600 text-white font-bold py-4 px-8 rounded-xl hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 text-lg">
                Start Your First Swap
              </Link>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="py-20">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">It's as Easy as 1-2-3</h2>
              <p className="mt-4 text-slate-600 dark:text-slate-400 max-w-xl mx-auto">Start your journey of learning and teaching in just a few simple steps.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <StepCard number="1" title="Create Your Profile" description="List the skills you can teach and the skills you want to learn. Make your profile shine!" />
              <StepCard number="2" title="Find a Match" description="Browse our community or use smart filters to find the perfect person to swap skills with." />
              <StepCard number="3" title="Learn & Grow" description="Connect with your partner, schedule sessions, and start sharing knowledge. It's that simple." />
            </div>
          </div>
        </section>

        <section id="features" className="py-20 bg-slate-50 dark:bg-slate-800/50">
          <div className="container mx-auto px-6">
             <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">Why You'll Love SkillSwap</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard icon={<Repeat size={28} className="text-blue-600 dark:text-blue-500" />} title="Barter, Don't Buy" description="Learn anything from coding to cooking without spending a dime. Your knowledge is your currency." />
              <FeatureCard icon={<Users size={28} className="text-blue-600 dark:text-blue-500" />} title="Community-Powered" description="Join a vibrant network of learners and experts who are passionate about growth and sharing." />
              <FeatureCard icon={<ShieldCheck size={28} className="text-blue-600 dark:text-blue-500" />} title="Verified Profiles" description="Our rating and feedback system helps you connect with trusted and reliable members." />
              <FeatureCard icon={<Zap size={28} className="text-blue-600 dark:text-blue-500" />} title="Endless Possibilities" description="With a diverse range of skills available, your learning potential is limitless." />
              <FeatureCard icon={<BookOpen size={28} className="text-blue-600 dark:text-blue-500" />} title="AI-Based Matching" description="Experience AI-powered matchmaking that connects you with the perfect swap opportunities." />
              <FeatureCard icon={<MessageSquare size={28} className="text-blue-600 dark:text-blue-500" />} title="Direct Communication" description="Our secure messaging system makes it easy to coordinate and connect with your swap partners." />
            </div>
          </div>
        </section>

        <section className="py-24 bg-blue-800">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-3xl md:text-4xl font-extrabold text-white">Ready to Grow?</h2>
                <p className="mt-4 text-blue-200 max-w-xl mx-auto">Join thousands of others who are leveling up their skills and making meaningful connections.</p>
                <div className="mt-8">
                    <Link to="/signup" className="bg-white text-blue-600 font-bold py-4 px-8 rounded-xl hover:bg-slate-100 transition-colors text-lg shadow-lg">
                        Sign Up for Free
                    </Link>
                </div>
            </div>
        </section>
      </main>

      <footer className="bg-slate-900 dark:bg-slate-900/50 text-slate-400 py-12">
        <div className="container mx-auto px-6 text-center">
            <p>© {new Date().getFullYear()} SkillSwap. All rights reserved.</p>
            <div className="mt-4 flex justify-center space-x-6">
                 <Link to="/about" className="hover:text-white transition-colors">About</Link>
                 <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
                 <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            </div>
        </div>
      </footer>
    </div>
  );
};

const DarkModeToggle = ({ isDarkMode, toggleDarkMode }) => (
    <button
        onClick={toggleDarkMode}
        className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
        aria-label="Toggle dark mode"
    >
        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
    </button>
);

const StepCard = ({ number, title, description }) => (
  <div className="p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-xl dark:hover:shadow-blue-900/20 transition-shadow duration-300">
    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center rounded-full mx-auto font-bold text-2xl mb-6">{number}</div>
    <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">{title}</h3>
    <p className="text-slate-600 dark:text-slate-400">{description}</p>
  </div>
);

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm hover:shadow-lg dark:hover:shadow-blue-900/20 transition-shadow duration-300">
    <div className="mb-4">{icon}</div>
    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
    <p className="text-slate-600 dark:text-slate-400 text-sm">{description}</p>
  </div>
);

export default LandingPage;