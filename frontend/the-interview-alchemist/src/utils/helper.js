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