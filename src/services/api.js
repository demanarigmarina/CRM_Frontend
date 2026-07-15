import axios from "axios";

const API_URL=
  import.meta.env.VITE_API_URL||
  "http://localhost:5000";

const api=axios.create({
  baseURL:API_URL,
  withCredentials:true,
  headers:{
    "Content-Type":"application/json",
  },
});

let accessToken=null;
let logoutCallback=null;

const AUTH_ENDPOINTS=[
  "/api/auth/login",
  "/api/auth/refresh",
  "/api/auth/logout",
  "/api/auth/forgot-password",
  "/api/auth/reset-password",
];

const isAuthenticationEndpoint=url=>{
  const normalizedUrl=String(url||"");

  return AUTH_ENDPOINTS.some(endpoint=>
    normalizedUrl.includes(endpoint),
  );
};

export const setAccessToken=token=>{
  accessToken=token||null;
};

export const setLogoutCallback=callback=>{
  logoutCallback=
    typeof callback==="function"
      ?callback
      :null;
};

api.interceptors.request.use(
  config=>{
    config.headers=config.headers||{};

    if(accessToken){
      config.headers.Authorization=`Bearer ${accessToken}`;
    }else{
      delete config.headers.Authorization;
    }

    if(config.data instanceof FormData){
      delete config.headers["Content-Type"];
    }

    return config;
  },
  error=>Promise.reject(error),
);

api.interceptors.response.use(
  response=>response,
  error=>{
    const status=error?.response?.status;
    const requestUrl=error?.config?.url||"";

    if(
      status===401&&
      !isAuthenticationEndpoint(requestUrl)&&
      typeof logoutCallback==="function"
    ){
      logoutCallback();
    }

    return Promise.reject(error);
  },
);

export default api;