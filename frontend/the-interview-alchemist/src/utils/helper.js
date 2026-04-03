import { BASE_URL } from './apiPaths';

// Default avatar shown when a user has no uploaded profile photo
export const FALLBACK_AVATAR = "https://picsum.photos/200";

// Returns a fully-qualified URL for a profile image.
// New uploads store a relative path (/uploads/file); legacy dev uploads may store
// an absolute http://localhost:8000/... URL — both are handled here.
export const getProfileImageUrl = (url) => {
  if (!url) return FALLBACK_AVATAR;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `${BASE_URL}${url}`;
};

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const getInitials = (title) => {
  if (!title) return "";
  const words = title.split(" ");
  let initials = "";

  for (let i = 0; i < Math.min(words.length,2); i++) {
    initials += words[i].charAt(0).toUpperCase();
  }
  return initials;
};  