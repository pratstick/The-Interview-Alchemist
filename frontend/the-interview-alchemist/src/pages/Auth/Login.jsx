import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/Inputs/Input';

const Login = ({ setCurrentPage }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    // Add your login logic here
  };

  return (
    <div className='w-full max-w-md mx-auto p-8 bg-white rounded-xl shadow-sm'>
      <div className='mb-8 text-center'>
        <h3 className='text-2xl font-semibold text-gray-900'>Welcome Back</h3>
        <p className='text-sm text-gray-600 mt-2'>
          Please enter your details to login
        </p>
      </div>

      <form onSubmit={handleLogin} className='space-y-6'>
        <div className='space-y-4'>
          <Input 
            value={email} 
            onChange={({ target }) => setEmail(target.value)} 
            label="Email Address" 
            placeholder="john@example.com" 
            type="email" 
          />
          <Input 
            value={password} 
            onChange={({ target }) => setPassword(target.value)} 
            label="Password" 
            placeholder="Min 8 characters" 
            type="password" 
          />
        </div>

        {error && (
          <p className='text-red-500 text-sm text-center'>{error}</p>
        )}

        <button 
          type='submit' 
          className='w-full py-3 px-4 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-colors'
        >
          Login
        </button>

        <div className="text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <button 
            type="button"
            className="font-medium text-primary hover:text-primary-dark cursor-pointer hover:underline focus:outline-none"
            onClick={() => setCurrentPage("signup")}
          >
            Sign up
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;