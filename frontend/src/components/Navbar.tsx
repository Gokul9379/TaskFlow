import { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

interface NavbarProps {
  searchTerm?: string;
  onSearch?: (term: string) => void;
}

export default function Navbar({ searchTerm = '', onSearch }: NavbarProps) {
  const auth = useContext(AuthContext);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // --- NEW: Email Notifications State ---
  const [emailNotifs, setEmailNotifs] = useState(true);

  // Load the preference from LocalStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('emailNotifs');
    if (saved !== null) {
      setEmailNotifs(saved === 'true');
    }
  }, []);

  const userEmail = auth?.userEmail || 'Account';
  const displayName = auth?.userName || 'User'; 
  const userInitial = displayName.charAt(0).toUpperCase();
  const subText = userEmail.includes('@') ? userEmail : 'Active Session';
  
  const handleLogout = () => {
    setIsProfileOpen(false);
    if (auth) {
      auth.logout();
    }
  };

  const openSettings = () => {
    setIsProfileOpen(false);
    setIsSettingsOpen(true);
  };

  // --- NEW: Toggle Function ---
  const toggleNotifications = async () => {
    const newState = !emailNotifs;
    setEmailNotifs(newState);
    localStorage.setItem('emailNotifs', String(newState)); // Save locally instantly

    try {
      const token = localStorage.getItem('token');
      await axios.patch('http://localhost:3000/users/settings/notifications', 
        { enabled: newState },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Notifications turned ${newState ? 'ON' : 'OFF'}`);
    } catch (error) {
      // Revert if the API call fails
      setEmailNotifs(!newState); 
      localStorage.setItem('emailNotifs', String(!newState));
      toast.error('Failed to save settings.');
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-40 w-full bg-white/70 backdrop-blur-xl border-b border-gray-100 shadow-[0_4px_30px_rgba(0,0,0,0.03)]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 py-3">
          
          {/* Brand Logo */}
          <Link 
            to="/" 
            className="group flex shrink-0 items-center gap-2.5 text-xl font-black tracking-tight text-gray-900 transition-all hover:opacity-80"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 transition-transform group-hover:scale-105 group-active:scale-95">
              T
            </div>
            <span className="hidden md:block">TaskFlow<span className="text-blue-600">.</span></span>
          </Link>

          {/* Live Search Bar */}
          {onSearch !== undefined && (
            <div className="flex-1 mx-3 sm:mx-8 max-w-md">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => onSearch(e.target.value)}
                  className="w-full rounded-2xl border border-gray-200/80 bg-gray-50/50 py-2 pl-10 pr-4 text-sm font-medium text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
                {searchTerm && (
                  <button 
                    onClick={() => onSearch('')}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Right Side Actions */}
          <div className="flex items-center gap-2 sm:gap-4 ml-auto">
            
            <Link 
              to="/create-task" 
              className="flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-3 sm:px-4 py-2 text-sm font-bold text-white shadow-md shadow-blue-500/20 transition-all hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 active:scale-95"
              title="New Task"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              <span className="hidden sm:inline">New</span>
            </Link>

            <div className="h-6 w-[1px] bg-gray-200 hidden sm:block"></div>

            {/* Clickable Profile Dropdown Container */}
            <div className="relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2.5 rounded-full border border-transparent sm:p-1 sm:pr-3 transition-colors hover:bg-gray-50 focus:bg-gray-50 focus:outline-none active:scale-95"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-gray-800 to-gray-600 font-bold text-white shadow-sm ring-2 ring-transparent transition-all hover:ring-gray-200">
                  {userInitial}
                </div>
                
                <div className="hidden lg:flex flex-col text-left">
                  <span className="text-xs font-bold text-gray-900 truncate max-w-[100px]">
                    {displayName}
                  </span>
                  <span className="text-[10px] font-medium text-gray-500 truncate max-w-[100px]">
                    {subText}
                  </span>
                </div>

                <svg className="hidden lg:block w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu Popup */}
              {isProfileOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)}></div>
                  <div className="absolute right-0 top-full mt-2 w-60 z-50 rounded-2xl bg-white p-2 shadow-[0_12px_40px_-10px_rgba(0,0,0,0.15)] border border-gray-100 origin-top-right transition-all">
                    
                    <div className="px-3 py-3 border-b border-gray-50 mb-2">
                      <p className="text-sm font-bold text-gray-900 truncate">{displayName}</p>
                      <p className="text-xs font-medium text-gray-500 truncate mt-0.5">{userEmail}</p>
                    </div>

                    <button 
                      onClick={openSettings}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 hover:text-gray-900"
                    >
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Account Settings
                    </button>

                    <button 
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
                    >
                      <svg className="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign Out
                    </button>
                    
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* --- Account Settings Modal --- */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-md transition-all duration-300">
          <div className="relative w-full max-w-md rounded-[2rem] bg-white p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-gray-100/50 overflow-hidden">
            
            {/* Background Accent */}
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-blue-600 to-indigo-600"></div>

            {/* Close Button */}
            <button 
              onClick={() => setIsSettingsOpen(false)}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition-all hover:bg-white/30 active:scale-95"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Profile Content */}
            <div className="relative z-10 flex flex-col items-center mt-12 text-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-gradient-to-tr from-gray-800 to-gray-600 text-3xl font-bold text-white shadow-lg">
                {userInitial}
              </div>
              <h2 className="mt-4 text-2xl font-black text-gray-900">{displayName}</h2>
              <p className="text-sm font-medium text-gray-500">{userEmail}</p>
            </div>

            {/* Settings List */}
            <div className="mt-8 space-y-4">
              <div className="flex items-center justify-between rounded-2xl bg-gray-50 p-4 border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-gray-900">Email Notifications</p>
                    <p className="text-xs text-gray-500">Receive updates on tasks.</p>
                  </div>
                </div>
                
                {/* --- Interactive Toggle --- */}
                <button 
                  onClick={toggleNotifications}
                  className={`h-6 w-11 rounded-full relative transition-all duration-300 ${emailNotifs ? 'bg-blue-600' : 'bg-gray-300'}`}
                >
                  <div className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all duration-300 shadow-sm ${emailNotifs ? 'right-1' : 'left-1'}`}></div>
                </button>
                {/* ---------------------------- */}
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-gray-50 p-4 border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-gray-900">Account Security</p>
                    <p className="text-xs text-gray-500">Managed securely via backend.</p>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-600 ring-1 ring-inset ring-emerald-500/20 uppercase tracking-wider">
                  Secure
                </span>
              </div>
            </div>

            <button 
              onClick={() => setIsSettingsOpen(false)}
              className="mt-8 w-full rounded-xl bg-gray-900 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-gray-800 active:scale-95"
            >
              Close Settings
            </button>

          </div>
        </div>
      )}
    </>
  );
}