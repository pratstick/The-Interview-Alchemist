import React, { useState, useRef } from 'react';
import { LuUser, LuUpload, LuTrash } from 'react-icons/lu';

const ProfilePhotoSelector = ({ image, setImage, preview, setPreview }) => {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Update the image state
      setImage(file);

      // Generate preview url from file
      const preview = URL.createObjectURL(file);
      if (setPreview) {
        setPreview(preview);
      }
      setPreviewUrl(preview);
    }
  };
  
  const handleRemoveImage = () => {
    setImage(null);
    setPreviewUrl(null);
    if (setPreview) {
      setPreview(null);
    }
  };

  const onChooseFile = () => {
    inputRef.current.click();
  };

  return (
    <div className='flex flex-col items-center space-y-4'>
      <input
        type='file'
        accept='image/*'
        ref={inputRef}
        onChange={handleImageChange}
        className='hidden'
      />

      {!image ? (
        <div className='relative w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center'>
          <LuUser className='w-16 h-16 text-gray-400' />
          <button
            type='button'
            className='absolute -bottom-2 right-0 bg-primary text-white p-2 rounded-full hover:bg-primary-dark transition-colors'
            onClick={onChooseFile}
          >
            <LuUpload className='w-4 h-4' />
          </button>
        </div>
      ) : (
        <div className='relative group'>
          <img 
            src={preview || previewUrl} 
            alt='Profile preview' 
            className='w-32 h-32 rounded-full object-cover border-2 border-primary'
          />
          <button 
            type='button' 
            className='absolute -bottom-2 right-0 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors'
            onClick={handleRemoveImage}
          >
            <LuTrash className='w-4 h-4' />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePhotoSelector;