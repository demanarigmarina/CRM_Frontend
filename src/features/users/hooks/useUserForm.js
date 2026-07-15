import {useState} from "react";
import Swal from "sweetalert2";
import {formatDateInput} from "../../../utils/date";
import {useFormBase} from "../../../hooks/useFormBase";

const EMPTY_FORM={
  team:"",
  firstName:"",
  middleName:"",
  lastName:"",
  suffixName:"",
  birthday:"",
  placeOfBirth:"",
  gender:"",
  email:"",
  password:"",
  confirmPassword:"",
  role:"",
  phone:"",
  country:"Philippines",
  province:"",
  city:"",
  barangay:"",
  street:"",
  houseNumber:"",
  zipCode:"",
  removeProfilePicture:false,
};

const text=value=>String(value??"").trim();

const formatPhone=phone=>{
  if(!phone)return"";
  const cleaned=String(phone).replace(/\D/g,"");

  if(/^09\d{9}$/.test(cleaned)){
    return cleaned.replace(/^(09\d{2})(\d{3})(\d{4})$/,"$1 $2 $3");
  }

  if(/^639\d{9}$/.test(cleaned)){
    return cleaned.replace(/^(63)(9\d{2})(\d{3})(\d{4})$/,"+$1 $2 $3 $4");
  }

  return phone;
};

export function useUserForm(){
  const base=useFormBase(EMPTY_FORM);
  const[showSidePane,setShowSidePane]=useState(false);
  const[editingUser,setEditingUser]=useState(null);
  const[showPassword,setShowPassword]=useState(false);
  const[showConfirmPassword,setShowConfirmPassword]=useState(false);

  const openCreateSidePane=()=>{
    base.resetForm();
    setEditingUser(null);
    setShowPassword(false);
    setShowConfirmPassword(false);
    setShowSidePane(true);
  };

  const openEditSidePane=user=>{
    const address=user?.currentAddress??{};
    const country=address.country||"Philippines";
    const province=address.province||"";
    const city=address.municipality||"";

    base.setFormData({
      team:user?.team?._id||user?.team||"",
      firstName:user?.firstName||"",
      middleName:user?.middleName||"",
      lastName:user?.lastName||"",
      suffixName:user?.suffixName||"",
      birthday:formatDateInput(user?.dateOfBirth),
      placeOfBirth:user?.placeOfBirth||"",
      gender:user?.sex||"",
      email:user?.email||"",
      password:"",
      confirmPassword:"",
      role:user?.role||"",
      phone:formatPhone(user?.phone||""),
      country,
      province,
      city,
      barangay:address.barangay||"",
      street:address.street||"",
      houseNumber:address.houseNumber||"",
      zipCode:address.zipCode||"",
      removeProfilePicture:false,
    });

    base.setAddressCodes(base.resolveEditCodes(country,province,city));
    base.setPreviewFromPath(user?.profilePicture);
    base.setAvatar(null);
    setEditingUser(user?.employeeId||null);
    setShowPassword(false);
    setShowConfirmPassword(false);
    setShowSidePane(true);
  };

  const resetAndClose=()=>{
    setShowSidePane(false);
    setEditingUser(null);
    setShowPassword(false);
    setShowConfirmPassword(false);
    base.resetForm();
  };

  const closeSidePane=()=>{
    setShowSidePane(false);
  };

  const validatePasswords=()=>{
    const password=base.formData.password||"";
    const confirmPassword=base.formData.confirmPassword||"";

    if(!editingUser&&!password){
      Swal.fire({
        icon:"error",
        title:"Password is required",
        text:"Please enter a password for the new user.",
      });
      return false;
    }

    if(!editingUser&&!confirmPassword){
      Swal.fire({
        icon:"error",
        title:"Confirm password is required",
        text:"Please confirm the new user's password.",
      });
      return false;
    }

    if(password||confirmPassword){
      if(password.length<8){
        Swal.fire({
          icon:"error",
          title:"Password is too short",
          text:"Password must contain at least 8 characters.",
        });
        return false;
      }

      if(password!==confirmPassword){
        Swal.fire({
          icon:"error",
          title:"Passwords do not match",
        });
        return false;
      }
    }

    return true;
  };

  const validateRequiredFields=()=>{
    const requiredFields=[
      ["First name",base.formData.firstName],
      ["Last name",base.formData.lastName],
      ["Date of birth",base.formData.birthday],
      ["Place of birth",base.formData.placeOfBirth],
      ["Gender",base.formData.gender],
      ["Email",base.formData.email],
      ["Role",base.formData.role],
      ["Phone number",base.formData.phone],
      ["Country",base.formData.country],
      ["Province",base.formData.province],
      ["Municipality/City",base.formData.city],
      ["ZIP code",base.formData.zipCode],
    ];

    const missingField=requiredFields.find(([,value])=>!text(value));

    if(missingField){
      Swal.fire({
        icon:"error",
        title:`${missingField[0]} is required`,
        text:"Please complete all required user information.",
      });
      return false;
    }

    return true;
  };

  const validateForm=()=>{
    if(!validateRequiredFields())return false;
    return validatePasswords();
  };

  const buildUserPayload=()=>{
    const form=base.formData;

    const payload={
      team:form.team||null,
      firstName:text(form.firstName),
      middleName:text(form.middleName),
      lastName:text(form.lastName),
      suffixName:text(form.suffixName),
      email:text(form.email).toLowerCase(),
      role:form.role,
      phone:text(form.phone),
      sex:form.gender,
      dateOfBirth:form.birthday,
      placeOfBirth:text(form.placeOfBirth),
      currentAddress:{
        houseNumber:text(form.houseNumber),
        street:text(form.street),
        barangay:text(form.barangay),
        municipality:text(form.city),
        province:text(form.province),
        zipCode:text(form.zipCode),
        country:text(form.country)||"Philippines",
      },
      removeProfilePicture:Boolean(form.removeProfilePicture),
    };

    if(form.password){
      payload.password=form.password;
    }

    return payload;
  };

  return{
    ...base,
    showSidePane,
    editingUser,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    openCreateSidePane,
    openEditSidePane,
    resetAndClose,
    closeSidePane,
    validatePasswords,
    validateRequiredFields,
    validateForm,
    buildUserPayload,
  };
}