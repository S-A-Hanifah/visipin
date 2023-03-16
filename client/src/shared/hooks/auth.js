import { useState, useEffect, useCallback } from "react";


let logOutTimer;

export const useAuth = () => {
    const [token, setToken] = useState(false);
    const [expiredToken, setExpiredToken] = useState();
    const [userId, setUserId] = useState(null);
  
    const logIn = useCallback((uid, token, exp) => {
      setToken(token);
      setUserId(uid);
      const tokenExp = exp || new Date(new Date().getTime() + 1000 * 60 * 60);
      setExpiredToken(tokenExp);
      localStorage.setItem(
        "userData",
        JSON.stringify({
          userId: uid,
          token: token,
          expiration: tokenExp.toISOString(),
        })
      );
    }, []);
  
    useEffect(() => {
      const storedData = JSON.parse(localStorage.getItem("userData"));
  
      if (
        storedData &&
        storedData.token &&
        new Date(storedData.expiration) > new Date()
      ) {
        logIn(
          storedData.userId,
          storedData.token,
          new Date(storedData.expiration)
        );
      }
    }, [logIn]);
  
    const logOut = useCallback(() => {
      setToken(null);
      setExpiredToken(null);
      setUserId(null);
      localStorage.removeItem("userData");
    }, []);
  
    useEffect(() => {
      if (token && expiredToken) {
        const timeRemain = expiredToken.getTime() - new Date().getTime();
        logOutTimer = setTimeout(logOut, timeRemain);
      } else {
        clearTimeout(logOutTimer);
      }
    }, [token, logOut, expiredToken]);

    return{token,logIn,logOut, userId}
}