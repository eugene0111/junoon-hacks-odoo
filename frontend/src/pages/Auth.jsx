import { useState } from 'react';
import { ChevronRight, Mail, Lock, User, MapPin, Globe, Phone, ArrowLeft, CheckCircle } from 'lucide-react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const InputField = ({ icon: Icon, ...props }) => (
  <div className="relative h-full">
    {Icon && <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />}
    <input
      {...props}
      className={`w-full h-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
    />
  </div>
);

const AuthFrontend = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [signupStep, setSignupStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    location: '',
    country: '',
    phoneNumber: '',
    skillsOffered: [],
    skillsWanted: []
  });
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  
  const [customSkillOffered, setCustomSkillOffered] = useState('');
  const [customSkillWanted, setCustomSkillWanted] = useState('');
  
  const navigate = useNavigate();

  const availableSkills = [
    'Web Development', 'Mobile Development', 'UI/UX Design', 'Data Science',
    'Machine Learning', 'Cloud Computing', 'DevOps', 'Cybersecurity',
    'Digital Marketing', 'Content Writing', 'Graphic Design', 'Video Editing',
    'Photography', 'Music Production', 'Language Teaching', 'Business Consulting'
  ];

  const handleInputChange = (e) => {
    if (isLogin) {
      setLoginData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    } else {
      setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }
  };

  const toggleSkill = (skill, type) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].includes(skill)
        ? prev[type].filter(s => s !== skill)
        : [...prev[type], skill]
    }));
  };

  const handleNextStep = () => {
    const requiredFields = ['firstName', 'lastName', 'email', 'password', 'location', 'country', 'phoneNumber'];
    const isStep1Valid = requiredFields.every(field => formData[field]?.trim() !== '');

    if (isStep1Valid && formData.password.length >= 6) {
      setSignupStep(2);
    } else {
      alert('Please fill all fields and ensure password is at least 6 characters');
    }
  };

  const handleAddCustomSkill = (type) => {
    const stateVal = type === 'skillsOffered' ? customSkillOffered : customSkillWanted;
    const setState = type === 'skillsOffered' ? setCustomSkillOffered : setCustomSkillWanted;
    const newSkill = stateVal.trim();

    if (newSkill && !formData[type].includes(newSkill)) {
        setFormData(prev => ({
            ...prev,
            [type]: [...prev[type], newSkill]
        }));
    }
    setState(''); 
  };
  
  const handleCustomSkillKeyDown = (e, type) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCustomSkill(type);
    }
  };

  const handleSignup = async () => {
    if (formData.skillsOffered.length === 0 || formData.skillsWanted.length === 0) {
      alert('Please select at least one skill to offer and one skill to learn.');
      return;
    }
    console.log('Signup data:', formData);
    try {
        const response = await axios.post(`http://localhost:3000/api/auth/register`, formData);
        const token = response.data.token;
        localStorage.setItem("token", token);
        alert("Signed Up Successfully!");
        navigate('/home-screen');
    } catch (error) {
        alert("Signup failed: " + (error.response?.data?.message || error.message));
    }
  };

  const handleLogin = async () => {
    console.log('Login data:', loginData);
    try {
        const response = await axios.post(`http://localhost:3000/api/auth/login`, loginData);
        const token = response.data.token;
        localStorage.setItem("token", token);
        navigate('/home-screen');
    } catch (error) {
        alert("Login failed: " + (error.response?.data?.message || error.message));
    }
  };

  if (!isLogin && signupStep === 2) {
    const allOfferedSkills = [...new Set([...availableSkills, ...formData.skillsOffered])].sort();
    const allWantedSkills = [...new Set([...availableSkills, ...formData.skillsWanted])].sort();

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-lg p-8">
          <button
            onClick={() => setSignupStep(1)}
            className="flex items-center text-gray-600 hover:text-gray-800 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Skills Selection</h2>
            <p className="text-gray-600">Choose skills you can offer and skills you want to learn</p>
          </div>

          <div className="space-y-8">
            
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Skills I Can Offer</h3>
              <div className="flex flex-wrap gap-2">
                {allOfferedSkills.map(skill => (
                  <button
                    key={skill}
                    onClick={() => toggleSkill(skill, 'skillsOffered')}
                    className={`px-3 py-1.5 rounded-lg border-2 transition-all text-sm ${
                      formData.skillsOffered.includes(skill)
                        ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
              <div className="mt-4 flex gap-2 items-stretch">
                  <InputField
                      placeholder="Add another skill..."
                      value={customSkillOffered}
                      onChange={(e) => setCustomSkillOffered(e.target.value)}
                      onKeyDown={(e) => handleCustomSkillKeyDown(e, 'skillsOffered')}
                  />
                  <button
                      onClick={() => handleAddCustomSkill('skillsOffered')}
                      className="bg-blue-600 text-white font-medium px-5 rounded-lg hover:bg-blue-700 transition-colors flex-shrink-0 flex items-center justify-center"
                  >
                      Add
                  </button>
              </div>
            </div>

            
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Skills I Want to Learn</h3>
              <div className="flex flex-wrap gap-2">
                {allWantedSkills.map(skill => (
                  <button
                    key={skill}
                    onClick={() => toggleSkill(skill, 'skillsWanted')}
                    className={`px-3 py-1.5 rounded-lg border-2 transition-all text-sm ${
                      formData.skillsWanted.includes(skill)
                        ? 'border-green-500 bg-green-50 text-green-700 font-medium'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
              <div className="mt-4 flex gap-2 items-stretch">
                  <InputField
                      placeholder="Add another skill to learn..."
                      value={customSkillWanted}
                      onChange={(e) => setCustomSkillWanted(e.target.value)}
                      onKeyDown={(e) => handleCustomSkillKeyDown(e, 'skillsWanted')}
                  />
                  <button
                      onClick={() => handleAddCustomSkill('skillsWanted')}
                      className="bg-green-600 text-white font-medium px-5 rounded-lg hover:bg-green-700 transition-colors flex-shrink-0 flex items-center justify-center"
                  >
                      Add
                  </button>
              </div>
            </div>

            <button
              onClick={handleSignup}
              className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center"
            >
              Complete Registration
              <CheckCircle className="ml-2 w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-gray-600">
            {isLogin ? 'Sign in to continue to your account' : 'Join our skill exchange community'}
          </p>
        </div>

        {isLogin ? (
          <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} className="space-y-4">
            <InputField
              icon={Mail}
              type="email"
              name="email"
              placeholder="Email address"
              value={loginData.email}
              onChange={handleInputChange}
              required
            />
            <InputField
              icon={Lock}
              type="password"
              name="password"
              placeholder="Password"
              value={loginData.password}
              onChange={handleInputChange}
              required
            />
            <button
              type="submit"
              className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Sign In
            </button>
          </form>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); handleNextStep(); }} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <InputField
                icon={User}
                type="text"
                name="firstName"
                placeholder="First name"
                value={formData.firstName}
                onChange={handleInputChange}
                required
              />
              <InputField
                type="text"
                name="lastName"
                placeholder="Last name"
                value={formData.lastName}
                onChange={handleInputChange}
                required
              />
            </div>
            <InputField
              icon={Mail}
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            <InputField
              icon={Lock}
              type="password"
              name="password"
              placeholder="Password (min 6 characters)"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
            <InputField
              icon={MapPin}
              type="text"
              name="location"
              placeholder="City"
              value={formData.location}
              onChange={handleInputChange}
              required
            />
            <InputField
              icon={Globe}
              type="text"
              name="country"
              placeholder="Country"
              value={formData.country}
              onChange={handleInputChange}
              required
            />
            <InputField
              icon={Phone}
              type="tel"
              name="phoneNumber"
              placeholder="Phone number"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              required
            />
            <button
              type="submit"
              className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center"
            >
              Next Step
              <ChevronRight className="ml-2 w-5 h-5" />
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setSignupStep(1);
              }}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthFrontend;