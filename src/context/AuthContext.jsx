import {
  createContext,useCallback,useContext,useEffect,useMemo,useState,
} from "react";
import {useNavigate} from "react-router-dom";
import {
  setAccessToken as setAxiosToken,
  setLogoutCallback,
} from "../services/api";
import {
  logout as logoutService,
  refreshToken,
} from "../services/authService";

const AuthContext=createContext(null);
const AUTH_STORAGE_KEY="crm_auth";

const normalizeUser=userData=>{
  if(!userData)return null;

  const permissions=Array.isArray(userData.permissions)
    ?[...new Set(userData.permissions.filter(Boolean))]
    :[];

  return{
    ...userData,
    roleTemplate:userData.roleTemplate||userData.role||"",
    permissions,
    permissionsCustomized:Boolean(userData.permissionsCustomized),
  };
};

const saveToStorage=(token,userData)=>{
  if(!token||!userData){
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return;
  }

  localStorage.setItem(
    AUTH_STORAGE_KEY,
    JSON.stringify({
      accessToken:token,
      user:userData,
    }),
  );
};

export function AuthProvider({children}){
  const[user,setUser]=useState(null);
  const[accessToken,setAccessToken]=useState(null);
  const[authReady,setAuthReady]=useState(false);
  const navigate=useNavigate();

  const clearAuth=useCallback(()=>{
    setAxiosToken(null);
    setAccessToken(null);
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  },[]);

  const applyAuth=useCallback((token,userData)=>{
    const normalizedUser=normalizeUser(userData);

    if(!token||!normalizedUser){
      clearAuth();
      return null;
    }

    setAxiosToken(token);
    setAccessToken(token);
    setUser(normalizedUser);
    saveToStorage(token,normalizedUser);

    return normalizedUser;
  },[clearAuth]);

  const handleLogout=useCallback(async(callServer=false)=>{
    try{
      if(callServer){
        await logoutService();
      }
    }catch(error){
      console.error("Logout error:",error);
    }finally{
      clearAuth();
      navigate("/login",{replace:true});
    }
  },[clearAuth,navigate]);

  useEffect(()=>{
    setLogoutCallback(()=>{
      void handleLogout(false);
    });

    return()=>{
      setLogoutCallback(null);
    };
  },[handleLogout]);

  const refreshAuth=useCallback(async()=>{
    const data=await refreshToken();

    if(!data?.accessToken||!data?.user){
      throw new Error("Invalid authentication refresh response.");
    }

    return applyAuth(data.accessToken,data.user);
  },[applyAuth]);

  useEffect(()=>{
    let active=true;

    const restoreSession=async()=>{
      try{
        const data=await refreshToken();

        if(!active)return;

        if(!data?.accessToken||!data?.user){
          throw new Error("Invalid authentication refresh response.");
        }

        applyAuth(data.accessToken,data.user);
      }catch(error){
        if(!active)return;

        console.error("Session restore error:",error);
        clearAuth();
      }finally{
        if(active){
          setAuthReady(true);
        }
      }
    };

    void restoreSession();

    return()=>{
      active=false;
    };
  },[applyAuth,clearAuth]);

  const saveAuth=useCallback((token,userData)=>{
    return applyAuth(token,userData);
  },[applyAuth]);

  const logout=useCallback(()=>{
    return handleLogout(true);
  },[handleLogout]);

  const updateUser=useCallback(updatedUserData=>{
    setUser(previousUser=>{
      if(!previousUser)return previousUser;

      const updatedUser=normalizeUser({
        ...previousUser,
        ...updatedUserData,
      });

      if(accessToken){
        saveToStorage(accessToken,updatedUser);
      }

      return updatedUser;
    });
  },[accessToken]);

  const contextValue=useMemo(()=>({
    accessToken,
    user,
    saveAuth,
    logout,
    updateUser,
    refreshAuth,
  }),[
    accessToken,
    user,
    saveAuth,
    logout,
    updateUser,
    refreshAuth,
  ]);

  if(!authReady)return null;

  return(
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(){
  const context=useContext(AuthContext);

  if(!context){
    throw new Error("useAuth must be used inside <AuthProvider>");
  }

  return context;
}