import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/Inputs/Input';
import ProfilePhotoSelector from '../../components/Inputs/ProfilePhotoSelector';
import { validateEmail } from '../../utils/helper';

const SignUp = ({ setCurrentPage }) => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  
  const handleSignUp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Validation
    if (!fullName.trim()) {
      setError("Please enter full name");
      setIsLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    if (!password) {
      setError("Please enter your password");
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      setIsLoading(false);
      return;
    }

    setError("");
    
    try {
      // Signup API call
      // const formData = new FormData();
      // formData.append('fullName', fullName);
      // formData.append('email', email);
      // formData.append('password', password);
      // if (profilePic) formData.append('profilePic', profilePic);
      
      // const response = await authService.signup(formData);
      // handle successful signup (store token, redirect, etc.)
      navigate('/dashboard'); // Redirect on success
    } catch (error) {
      let errorMessage = "Something went wrong. Please try again";
      
      if (error.response) {
        errorMessage = error.response.data.message || 
                      error.response.data.error || 
                      "Registration failed";
      } else if (error.request) {
        errorMessage = "Network error. Please check your connection";
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className='w-full max-w-md mx-auto p-8 bg-white rounded-xl shadow-sm'>
      <div className='mb-8 text-center'>
        <h3 className='text-2xl font-semibold text-gray-900'>Create an account</h3>
        <p className='text-sm text-gray-600 mt-2'>
          Join us today by entering your details below.
        </p>
      </div>

      <form onSubmit={handleSignUp} className='space-y-6'>
        <div className='flex justify-center mb-4'>
          <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />
        </div>

        <div className='space-y-4'>
          <Input
            value={fullName} 
            onChange={({ target }) => setFullName(target.value)}
            label="Full Name"
            placeholder="Jane Doe"
            type="text"
            required
          />

          <Input
            value={email} 
            onChange={({ target }) => setEmail(target.value)} 
            label="Email Address" 
            placeholder="john@example.com" 
            type="email" 
            required
          />

          <Input 
            value={password} 
            onChange={({ target }) => setPassword(target.value)} 
            label="Password" 
            placeholder="Min 8 characters" 
            type="password" 
            required
          />   
        </div>

        {error && (
          <p className='text-red-500 text-sm text-center animate-fade-in'>
            {error}
          </p>
        )}

        <button 
          type='submit' 
          className={`w-full py-3 px-4 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-colors flex justify-center items-center ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating account...
            </>
          ) : (
            'Sign Up'
          )}
        </button>

        <div className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <button 
            type="button"
            className="font-medium text-primary hover:text-primary-dark cursor-pointer hover:underline focus:outline-none"
            onClick={() => setCurrentPage("login")}
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignUp;