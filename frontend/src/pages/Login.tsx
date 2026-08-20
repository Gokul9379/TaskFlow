import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext'; // <-- Import our new context

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  // Grab the global login function from our context!
  const auth = useContext(AuthContext);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:3000/auth/login', {
        email,
        password,
      });
      
      // Use the global context to log in, save data, and navigate all at once
      if (auth) {
        auth.login(response.data.access_token, email);
      }
      
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gray-50 overflow-hidden">
      
      {/* Decorative Background Blobs */}
      <div className="absolute -top-20 -left-20 h-96 w-96 rounded-full bg-blue-400/20 blur-[100px]"></div>
      <div className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-indigo-400/20 blur-[100px]"></div>

      {/* Glassmorphism Card */}
      <div className="relative z-10 w-full max-w-[420px] rounded-3xl bg-white/80 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl border border-white">
        
        {/* Logo/Brand */}
        <div className="mb-6 flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-2xl font-black text-white shadow-lg shadow-blue-200">
            T
          </div>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Welcome back</h2>
          <p className="mt-2 text-sm text-gray-500">Enter your details to access your tasks.</p>
        </div>
        
        {error && (
          <div className="mb-6 rounded-xl bg-rose-50 p-3 text-center text-sm font-medium text-rose-600 border border-rose-100">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Email</label>
            <input
              type="email"
              required
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm text-gray-900 transition-all outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 placeholder-gray-400"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Password</label>
            <input
              type="password"
              required
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm text-gray-900 transition-all outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 placeholder-gray-400"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="mt-2 w-full rounded-xl bg-blue-600 py-3 text-sm font-bold text-white shadow-md shadow-blue-200 transition-all hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-300 active:scale-[0.98]"
          >
            Sign In
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-500 font-medium">
          Don't have an account?{' '}
          <Link 
            to="/register" 
            className="text-blue-600 hover:text-blue-700 hover:underline underline-offset-4 transition-colors"
          >
            Create one now
          </Link>
        </p>
      </div>
    </div>
  );
}