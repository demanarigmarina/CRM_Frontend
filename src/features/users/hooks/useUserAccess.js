import {useCallback,useEffect,useMemo,useRef,useState} from "react";
import Swal from "sweetalert2";
import api from "../../../services/api";

const Toast=Swal.mixin({
  toast:true,
  position:"top-end",
  showConfirmButton:false,
  timer:2200,
  timerProgressBar:true,
});

const getErrorMessage=error=>
  error?.response?.data?.message||
  error?.response?.data?.error||
  error?.message||
  "Something went wrong";

const unwrapData=data=>data?.data??data;

const normalizePermissions=permissions=>
  Array.isArray(permissions)
    ?[...new Set(permissions.filter(Boolean))]
    :[];

const normalizeUser=user=>({
  ...user,
  employeeId:user?.employeeId||"",
  firstName:user?.firstName||"",
  middleName:user?.middleName||"",
  lastName:user?.lastName||"",
  suffixName:user?.suffixName||"",
  email:user?.email||"",
  role:user?.role||"",
  roleTemplate:user?.roleTemplate||user?.role||"",
  permissions:normalizePermissions(user?.permissions||user?.access),
  status:user?.status||"",
  team:user?.team||null,
  profilePicture:user?.profilePicture||null,
});

export default function useUserAccess(){
  const[users,setUsers]=useState([]);
  const[roles,setRoles]=useState([]);
  const[allPermissions,setAllPermissions]=useState([]);
  const[selectedUserId,setSelectedUserId]=useState("");
  const[selectedUserData,setSelectedUserData]=useState(null);
  const[roleTemplate,setRoleTemplateState]=useState("");
  const[access,setAccess]=useState([]);
  const[savedState,setSavedState]=useState({
    userId:"",
    roleTemplate:"",
    access:[],
  });
  const[loading,setLoading]=useState(true);
  const[accessLoading,setAccessLoading]=useState(false);
  const[saving,setSaving]=useState(false);
  const requestIdRef=useRef(0);

  const roleTemplates=useMemo(
    ()=>roles.reduce((result,role)=>{
      result[role.name]=normalizePermissions(role.permissions);
      return result;
    },{}),
    [roles],
  );

  const selectedUser=useMemo(
    ()=>selectedUserData||
      users.find(user=>user.employeeId===selectedUserId)||
      null,
    [selectedUserData,users,selectedUserId],
  );

  const selectedAccess=useMemo(
    ()=>allPermissions.filter(permission=>access.includes(permission)),
    [allPermissions,access],
  );

  const unselectedAccess=useMemo(
    ()=>allPermissions.filter(permission=>!access.includes(permission)),
    [allPermissions,access],
  );

  const hasChanges=useMemo(()=>{
    const current=[...access].sort();
    const saved=[...savedState.access].sort();

    return(
      selectedUserId===savedState.userId&&
      (
        roleTemplate!==savedState.roleTemplate||
        current.length!==saved.length||
        current.some((permission,index)=>permission!==saved[index])
      )
    );
  },[
    selectedUserId,
    roleTemplate,
    access,
    savedState,
  ]);

  const applyUserAccess=useCallback(user=>{
    const normalized=normalizeUser(user);
    const permissions=normalizePermissions(normalized.permissions);

    setSelectedUserId(normalized.employeeId);
    setSelectedUserData(normalized);
    setRoleTemplateState(normalized.roleTemplate);
    setAccess(permissions);
    setSavedState({
      userId:normalized.employeeId,
      roleTemplate:normalized.roleTemplate,
      access:permissions,
    });
  },[]);

  const fetchUserAccess=useCallback(async(employeeId,{silent=false}={})=>{
    if(!employeeId)return null;

    const requestId=++requestIdRef.current;

    if(!silent)setAccessLoading(true);

    try{
      const response=await api.get(`/api/access/users/${employeeId}`);
      const user=normalizeUser(unwrapData(response.data));

      if(requestId===requestIdRef.current){
        applyUserAccess(user);
      }

      return user;
    }catch(error){
      console.error("Fetch user access error:",error);

      if(requestId===requestIdRef.current){
        Toast.fire({
          icon:"error",
          title:getErrorMessage(error),
        });
      }

      return null;
    }finally{
      if(requestId===requestIdRef.current&&!silent){
        setAccessLoading(false);
      }
    }
  },[applyUserAccess]);

  const fetchAccessData=useCallback(async()=>{
    setLoading(true);

    try{
      const[
        usersResponse,
        rolesResponse,
        permissionsResponse,
      ]=await Promise.all([
        api.get("/api/access/users"),
        api.get("/api/access/roles"),
        api.get("/api/access/permissions"),
      ]);

      const loadedUsers=Array.isArray(unwrapData(usersResponse.data))
        ?unwrapData(usersResponse.data).map(normalizeUser)
        :[];

      const loadedRoles=Array.isArray(unwrapData(rolesResponse.data))
        ?unwrapData(rolesResponse.data)
        :[];

      const loadedPermissions=normalizePermissions(
        unwrapData(permissionsResponse.data),
      );

      setUsers(loadedUsers);
      setRoles(loadedRoles);
      setAllPermissions(loadedPermissions);

      if(loadedUsers.length){
        await fetchUserAccess(loadedUsers[0].employeeId,{silent:true});
      }else{
        setSelectedUserId("");
        setSelectedUserData(null);
        setRoleTemplateState("");
        setAccess([]);
        setSavedState({
          userId:"",
          roleTemplate:"",
          access:[],
        });
      }
    }catch(error){
      console.error("Fetch access data error:",error);

      setUsers([]);
      setRoles([]);
      setAllPermissions([]);
      setSelectedUserId("");
      setSelectedUserData(null);
      setRoleTemplateState("");
      setAccess([]);

      Toast.fire({
        icon:"error",
        title:getErrorMessage(error),
      });
    }finally{
      setLoading(false);
    }
  },[fetchUserAccess]);

  useEffect(()=>{
    fetchAccessData();
  },[fetchAccessData]);

  const setSelectedUser=async employeeId=>{
    if(!employeeId||employeeId===selectedUserId)return;

    setSelectedUserId(employeeId);
    setSelectedUserData(
      users.find(user=>user.employeeId===employeeId)||null,
    );

    await fetchUserAccess(employeeId);
  };

  const setRoleTemplate=value=>{
    setRoleTemplateState(value);
    setAccess([...(roleTemplates[value]||[])]);
  };

  const toggleAccess=permission=>{
    if(!allPermissions.includes(permission))return;

    setAccess(previous=>
      previous.includes(permission)
        ?previous.filter(item=>item!==permission)
        :[
          ...previous,
          permission,
        ],
    );
  };

  const cancelChanges=()=>{
    if(selectedUserId!==savedState.userId)return;

    setRoleTemplateState(savedState.roleTemplate);
    setAccess([...savedState.access]);
  };

  const resetToTemplate=()=>{
    setAccess([...(roleTemplates[roleTemplate]||[])]);
  };

  const saveAccess=async()=>{
    if(!selectedUserId){
      Toast.fire({
        icon:"error",
        title:"Select a user first",
      });
      return false;
    }

    if(!roleTemplate){
      Toast.fire({
        icon:"error",
        title:"Select a role template",
      });
      return false;
    }

    setSaving(true);

    try{
      const response=await api.put(
        `/api/access/users/${selectedUserId}`,
        {
          roleTemplate,
          permissions:access,
        },
      );

      const updatedUser=normalizeUser(unwrapData(response.data));
      const permissions=normalizePermissions(updatedUser.permissions);

      setSelectedUserData(updatedUser);
      setUsers(previous=>
        previous.map(user=>
          user.employeeId===updatedUser.employeeId
            ?{
              ...user,
              ...updatedUser,
            }
            :user,
        ),
      );
      setRoleTemplateState(updatedUser.roleTemplate);
      setAccess(permissions);
      setSavedState({
        userId:updatedUser.employeeId,
        roleTemplate:updatedUser.roleTemplate,
        access:permissions,
      });

      Toast.fire({
        icon:"success",
        title:"Access permissions saved",
      });

      return true;
    }catch(error){
      console.error("Save user access error:",error);

      Toast.fire({
        icon:"error",
        title:getErrorMessage(error),
      });

      return false;
    }finally{
      setSaving(false);
    }
  };

  return{
    users,
    roles,
    roleTemplates,
    allPermissions,
    selectedUserId,
    selectedUser,
    setSelectedUser,
    roleTemplate,
    setRoleTemplate,
    access,
    selectedAccess,
    unselectedAccess,
    toggleAccess,
    saveAccess,
    cancelChanges,
    resetToTemplate,
    fetchAccessData,
    loading,
    accessLoading,
    saving,
    hasChanges,
  };
}