export const validateEmail = (email: string) => {
  const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;

  return reg.test(email);
};

export const validatePassword = (password: string) => {
  if (password.length >= 3) {
    return true;
  }

  return false;
};
