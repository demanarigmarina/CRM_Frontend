import{useEffect,useRef,useState}from"react";
import{User as UserIcon,LogOut}from"lucide-react";
import{useNavigate}from"react-router-dom";
import Swal from"sweetalert2";
import{useAuth}from"../context/AuthContext";
import{getProfileImage}from"../utils/avatar";
import{getDisplayName}from"../utils/name";
import UserDisplayName from"./UserDisplayName";
import NotificationPanel from"./notifications/NotificationPanel";
import{useNotifications}from"../hooks/useNotifications";

export default function Navbar(){
const{user,logout}=useAuth(),navigate=useNavigate();
const routes={Admin:"/admin","Sales Manager":"/sales-manager","Sales Agent":"/sales-agent","Support Staff":"/support-staff"};
const profilePath=`${routes[user?.role]}/profile`;
const[open,setOpen]=useState(false),[notifOpen,setNotifOpen]=useState(false);
const dropdownRef=useRef(),notifRef=useRef();
const{notifications,unreadCount,loading,markAsRead,markAllAsRead,dismissNotification,clearAll}=useNotifications();

useEffect(()=>{
const close=e=>{
if(dropdownRef.current&&!dropdownRef.current.contains(e.target))setOpen(false);
if(notifRef.current&&!notifRef.current.contains(e.target))setNotifOpen(false);
};
document.addEventListener("mousedown",close);
return()=>document.removeEventListener("mousedown",close);
},[]);

const logoutUser=()=>Swal.fire({title:"Are you sure you want to Logout?",text:"You will be redirected to the Login page.",icon:"warning",showCancelButton:true,confirmButtonColor:"#ef4444",cancelButtonColor:"#6b7280",confirmButtonText:"Yes, Logout"}).then(async r=>{
if(r.isConfirmed)try{await logout()}catch{Swal.fire({icon:"error",title:"Logout Failed",text:"An error occurred while trying to logout"})}
});

const now=new Date();
const date=now.toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"});
const time=now.toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"});

return(
<div className="flex items-center justify-between rounded-md border border-gray-200 bg-white px-6 py-3">

<h1 className="text-xl font-semibold text-gray-800">Good Morning Carl!</h1>

<div className="flex items-center gap-5">

<div className="text-sm text-gray-500">{date} · {time}</div>

<NotificationPanel notifRef={notifRef} notifOpen={notifOpen} setNotifOpen={setNotifOpen} setOpen={setOpen} notifications={notifications} unreadCount={unreadCount} loading={loading} onMarkAsRead={markAsRead} onMarkAllAsRead={markAllAsRead} onDismiss={dismissNotification} onClearAll={clearAll}/>

<div className="relative" ref={dropdownRef}>

<div onClick={()=>{setOpen(!open);setNotifOpen(false)}} className="cursor-pointer">
<img src={getProfileImage(user)} alt="avatar" className="h-9 w-9 rounded-full border-2 border-red-500 object-cover"/>
</div>

{open&&(
<div className="absolute right-0 top-14 z-50 w-64 rounded-md border border-gray-200 bg-white p-4 shadow-lg">

<div className="mb-3 flex items-center gap-3">
<img src={getProfileImage(user)} alt="avatar" className="h-10 w-10 rounded-full object-cover"/>
<div>
<p className="text-sm font-medium text-gray-800">
<UserDisplayName user={user} showYou={false}>{getDisplayName(user,{includeMiddle:false,includeSuffix:true})}</UserDisplayName>
</p>
<p className="text-xs text-gray-500">{user?.role||"User"}</p>
</div>
</div>

<div className="my-2 border-t border-gray-200"/>

<button onClick={()=>{navigate(profilePath);setOpen(false)}} className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm text-gray-700 hover:bg-gray-100">
<UserIcon size={16}/>View Profile
</button>

<button onClick={logoutUser} className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm text-gray-700 hover:bg-gray-100">
<LogOut size={16}/>Logout
</button>

</div>
)}

</div>
</div>
</div>
);
}