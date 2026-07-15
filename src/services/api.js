import axios from "axios";

const API_URL=import.meta.env.VITE_API_URL||"http://localhost:5000";

const api=axios.create({
  baseURL:API_URL,
  withCredentials:true,
  headers:{
    Accept:"application/json",
  },
});

let accessToken=null;
let logoutCallback=null;
let isRefreshing=false;
let failedQueue=[];

export const setAccessToken=token=>{
  accessToken=token||null;
};

export const getAccessToken=()=>accessToken;

export const setLogoutCallback=callback=>{
  logoutCallback=typeof callback==="function"?callback:null;
};

const processQueue=(error,token=null)=>{
  failedQueue.forEach(({resolve,reject})=>{
    if(error)reject(error);
    else resolve(token);
  });
  failedQueue=[];
};

api.interceptors.request.use(
  config=>{
    config.headers=config.headers||{};
    if(accessToken){
      config.headers.Authorization=`Bearer ${accessToken}`;
    }
    return config;
  },
  error=>Promise.reject(error),
);

api.interceptors.response.use(
  response=>response,
  async error=>{
    const originalRequest=error?.config;

    if(!originalRequest)return Promise.reject(error);

    const isRefreshRequest=originalRequest.url?.includes("/api/auth/refresh");

    if(
      error?.response?.status!==401||
      originalRequest._retry||
      isRefreshRequest
    ){
      return Promise.reject(error);
    }

    if(isRefreshing){
      return new Promise((resolve,reject)=>{
        failedQueue.push({resolve,reject});
      }).then(token=>{
        originalRequest.headers=originalRequest.headers||{};
        originalRequest.headers.Authorization=`Bearer ${token}`;
        return api(originalRequest);
      });
    }

    originalRequest._retry=true;
    isRefreshing=true;

    try{
      const response=await axios.post(
        `${API_URL}/api/auth/refresh`,
        {},
        {withCredentials:true},
      );

      const newAccessToken=response?.data?.accessToken;

      if(!newAccessToken){
        throw new Error("Refresh endpoint did not return an access token.");
      }

      setAccessToken(newAccessToken);
      processQueue(null,newAccessToken);

      originalRequest.headers=originalRequest.headers||{};
      originalRequest.headers.Authorization=`Bearer ${newAccessToken}`;

      return api(originalRequest);
    }catch(refreshError){
      processQueue(refreshError);
      setAccessToken(null);

      if(logoutCallback){
        logoutCallback();
      }

      return Promise.reject(refreshError);
    }finally{
      isRefreshing=false;
    }
  },
);

export default api;