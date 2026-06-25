import { useState } from "react";
import UserContext from "./UserContext";
import { useEffect } from "react";
import { getMe } from "../services/api";

const UserContextProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const initUser = async () => {
      const token = localStorage.getItem("token");

      // ❌ No token → stop loading
    //   if (!token) {
    //     setLoading(false);
    //     console.log("token not found")
    //     return;
    //   }

      try {
        const data = await getMe();
        setUser(data);
        console.log("data from useefect useprovider",data)
      } catch (error) {
        console.log("Auth error:", error);
        // ❌ invalid token → clean up
        // localStorage.removeItem("token");
        setUser(null);
      } finally {
        // ✅ ALWAYS stop loading
        setLoading(false);
      }
    };
    console.log("running inituser")
    initUser();
  }, []);

  return (
    <>
      <UserContext.Provider value={{ user, setUser, loading, setLoading }}>
        {children}
      </UserContext.Provider>
    </>
  );
};
export default UserContextProvider;
