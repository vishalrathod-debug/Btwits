import { createContext, useState } from "react";

// 1. Create context
const UserContext = createContext();

// 2. Provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // 🔐 login (store user)
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData)); // optional
  };

  // 🚪 logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <UserContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
export default UserContext
