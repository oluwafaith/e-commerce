const createUserToken = (user: any) => {
  return { name: user.name,email: user.email, userId: user._id, role: user.role };
};
export default createUserToken;
