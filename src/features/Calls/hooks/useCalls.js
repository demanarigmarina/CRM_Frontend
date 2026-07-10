import {
  useCallback,
  useEffect,
  useState,
} from "react";

import Swal from "sweetalert2";



const Toast = Swal.mixin({

  toast: true,

  position: "top-end",

  showConfirmButton: false,

  timer: 2500,

  timerProgressBar: true,

});


<<<<<<< HEAD
const getErrorMessage = (error, fallback) => {
  console.error("Full API error response:", error.response?.data);
=======

>>>>>>> a2e780bede0037974f150d7b9f2ebd7add0968fa



const normalizeCall = (
  call,
  index = 0
) => {

<<<<<<< HEAD
  if (call.scheduledAt) {
    const scheduledTime = new Date(call.scheduledAt).getTime();

    if (!Number.isNaN(scheduledTime) && scheduledTime < Date.now()) {
      return "Past Call";
    }
  }

  return "Future Call";
};

const normalizeCall = (call, index = 0) => {
  const normalized = {
    ...call,
    _id: call._id || call.id || `call-${Date.now()}-${index}`,
    clientName: call.clientName || call.client?.name || "",
    companyName: call.companyName || call.company || "",
    contactMethod: call.contactMethod || "Phone",
    contactValue: call.contactValue || call.phone || call.email || "",
    phone:
      call.phone ||
      (call.contactMethod === "Phone" || call.contactMethod === "Text"
        ? call.contactValue || ""
        : ""),
    email:
      call.email ||
      (call.contactMethod === "Email" ? call.contactValue || "" : ""),
    callType: call.callType || "Follow-up Call",
    status: call.status || "Scheduled",
    category: getCallCategory(call),
    scheduledAt: call.scheduledAt || null,
    completedAt: call.completedAt || null,
    notes: call.notes || "",
    outcome: call.outcome || "",
    createdAt: call.createdAt || call.scheduledAt || new Date().toISOString(),
  };

  return normalized;
};

const normalizeCalls = (value) => {
  if (Array.isArray(value)) {
    return value.map((call, index) => normalizeCall(call, index));
  }

  if (Array.isArray(value?.calls)) return value.calls.map((call, index) => normalizeCall(call, index));
  if (Array.isArray(value?.data)) return value.data.map((call, index) => normalizeCall(call, index));

  return [];
};

const persistCalls = (value) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
};

const readStoredCalls = () => {
  if (typeof window === "undefined") return [];

  const storedRaw = window.localStorage.getItem(STORAGE_KEY);

  if (!storedRaw) return [];

  try {
    const parsed = JSON.parse(storedRaw);
    return normalizeCalls(parsed);
  } catch {
    return [];
  }
};

export default function useCalls() {
  const [calls, setCalls] = useState(() => normalizeCalls(readStoredCalls()));
  const [loading, setLoading] = useState(false);

  const syncCalls = useCallback((value) => {
    const normalized = normalizeCalls(value);
    setCalls(normalized);
    persistCalls(normalized);
    return normalized;
  }, []);

  const fetchCalls = useCallback(async () => {
    setLoading(true);

    try {
      const data = await callService.getCalls();
      const normalizedCalls = normalizeCalls(data);

      if (normalizedCalls.length > 0) {
        syncCalls(normalizedCalls);
      } else {
        const stored = readStoredCalls();
        if (stored.length > 0) {
          syncCalls(stored);
        } else {
          syncCalls([]);
        }
      }
    } catch (error) {
      console.error("Error loading calls:", error);

      const stored = readStoredCalls();
      if (stored.length > 0) {
        syncCalls(stored);
      } else {
        syncCalls([]);
      }

      Toast.fire({
        icon: "error",
        title: getErrorMessage(error, "Failed to load calls"),
      });
    } finally {
      setLoading(false);
    }
  }, [syncCalls]);

  useEffect(() => {
    fetchCalls();
  }, [fetchCalls]);

  const addCall = useCallback(async (payload) => {
    setLoading(true);

    const normalizedPayload = {
      ...payload,
      status: payload.status || "Scheduled",
      category: payload.category || getCallCategory(payload),
      contactValue: payload.contactValue || payload.phone || payload.email || "",
      phone:
        payload.phone ||
        (payload.contactMethod === "Phone" || payload.contactMethod === "Text"
          ? payload.contactValue || ""
          : ""),
      email:
        payload.email ||
        (payload.contactMethod === "Email" ? payload.contactValue || "" : ""),
      createdAt: payload.createdAt || new Date().toISOString(),
    };

    try {
      const data = await callService.createCall(normalizedPayload);
      const createdCall = normalizeCall(
        data?.call || data?.data || data || normalizedPayload,
        calls.length,
      );

      const nextCalls = [createdCall, ...calls];
      syncCalls(nextCalls);

      Toast.fire({
        icon: "success",
        title: data?.message || "Call created successfully",
      });

      return true;
    } catch (error) {
      console.error("Error creating call:", error);

      const fallbackCall = normalizeCall(
        {
          ...normalizedPayload,
          _id: `local-${Date.now()}`,
        },
        calls.length,
      );
      const nextCalls = [fallbackCall, ...calls];
      syncCalls(nextCalls);

      Toast.fire({
        icon: "success",
        title: "Call saved locally for now",
      });

      return true;
    } finally {
      setLoading(false);
    }
  }, [calls, syncCalls]);

  const editCall = useCallback(async (id, payload) => {
    setLoading(true);

    const normalizedPayload = {
      ...payload,
      status: payload.status || "Scheduled",
      category: payload.category || getCallCategory(payload),
      contactValue: payload.contactValue || payload.phone || payload.email || "",
      phone:
        payload.phone ||
        (payload.contactMethod === "Phone" || payload.contactMethod === "Text"
          ? payload.contactValue || ""
          : ""),
      email:
        payload.email ||
        (payload.contactMethod === "Email" ? payload.contactValue || "" : ""),
    };

    try {
      const data = await callService.updateCall(id, normalizedPayload);
      const updatedCall = normalizeCall(
        data?.call || data?.data || data || { ...normalizedPayload, _id: id },
        calls.length,
      );

      const nextCalls = calls.map((call) =>
        call._id === id ? updatedCall : call,
      );
      syncCalls(nextCalls);

      Toast.fire({
        icon: "success",
        title: data?.message || "Call updated successfully",
      });

      return true;
    } catch (error) {
      console.error("Error updating call:", error);

      const nextCalls = calls.map((call) =>
        call._id === id
          ? normalizeCall({ ...call, ...normalizedPayload, _id: id })
          : call,
      );
      syncCalls(nextCalls);

      Toast.fire({
        icon: "success",
        title: "Call updated locally for now",
      });

      return true;
    } finally {
      setLoading(false);
    }
  }, [calls, syncCalls]);

  const removeCall = useCallback(async (id) => {
    const result = await Swal.fire({
      title: "Delete call?",
      text: "This call record will be permanently removed.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it",
    });

    if (!result.isConfirmed) return false;

    setLoading(true);

    try {
      const data = await callService.deleteCall(id);

      const nextCalls = calls.filter((call) => call._id !== id);
      syncCalls(nextCalls);

      Toast.fire({
        icon: "success",
        title: data?.message || "Call deleted successfully",
      });

      return true;
    } catch (error) {
      console.error("Error deleting call:", error);

      const nextCalls = calls.filter((call) => call._id !== id);
      syncCalls(nextCalls);

      Toast.fire({
        icon: "success",
        title: "Call deleted locally for now",
      });

      return true;
    } finally {
      setLoading(false);
    }
  }, [calls, syncCalls]);

  const completeCall = useCallback(async (id, payload = {}) => {
    const result = await Swal.fire({
      title: "Mark call as completed?",
      text: "This call will be moved to Past Calls.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, complete it",
    });

    if (!result.isConfirmed) return false;

    setLoading(true);

    try {
      const data = await callService.completeCall(id, payload);
      const updatedCall = normalizeCall(
        data?.call || data?.data || data || { _id: id },
        calls.length,
      );

      const nextCalls = calls.map((call) =>
        call._id === id
          ? {
              ...call,
              ...updatedCall,
              status: "Completed",
              category: "Past Call",
              completedAt: updatedCall.completedAt || new Date().toISOString(),
            }
          : call,
      );
      syncCalls(nextCalls);

      Toast.fire({
        icon: "success",
        title: data?.message || "Call marked as completed",
      });

      return true;
    } catch (error) {
      console.error("Error completing call:", error);

      const nextCalls = calls.map((call) =>
        call._id === id
          ? {
              ...call,
              status: "Completed",
              category: "Past Call",
              completedAt: payload.completedAt || new Date().toISOString(),
            }
          : call,
      );
      syncCalls(nextCalls);

      Toast.fire({
        icon: "success",
        title: "Call marked as completed locally for now",
      });

      return true;
    } finally {
      setLoading(false);
    }
  }, [calls, syncCalls]);
=======
>>>>>>> a2e780bede0037974f150d7b9f2ebd7add0968fa

  return {

    ...call,


    _id:
      call._id ||
      `call-${Date.now()}-${index}`,



    clientName:
      call.clientName || "",



    companyName:
      call.companyName || "",



    contactMethod:
      call.contactMethod || "Phone",



    contactValue:
      call.contactValue || "",



    callType:
      call.callType || "Follow-up Call",



    status:
      call.status || "Scheduled",



    category:
      call.category ||
      "Future Call",



    scheduledAt:
      call.scheduledAt || null,



    completedAt:
      call.completedAt || null,


    notes:
      call.notes || "",


    outcome:
      call.outcome || "",

  };


};







export default function useCalls() {


  const [calls, setCalls] =
    useState([]);



  const [loading, setLoading] =
    useState(false);









  const fetchCalls =
    useCallback(async()=>{


      /*
        Backend is not available yet.

        Keep empty state until API exists.
      */


      setLoading(false);


    },[]);








  useEffect(()=>{


    fetchCalls();


  },[fetchCalls]);









  const addCall =
    useCallback(async(payload)=>{


      setLoading(true);



      try{


        const newCall =
          normalizeCall({

            ...payload,


            status:
              payload.status ||
              "Scheduled",

          });



        setCalls(
          previous=>[
            newCall,
            ...previous,
          ]
        );



        Toast.fire({

          icon:"success",

          title:
            "Call added",

        });



        return true;



      }

      finally{


        setLoading(false);


      }



    },[]);









  const editCall =
    useCallback(async(
      id,
      payload
    )=>{


      setLoading(true);



      try{


        setCalls(
          previous =>

            previous.map(
              (call)=>

                call._id === id

                ?

                {
                  ...call,
                  ...payload,
                }

                :

                call

            )

        );



        Toast.fire({

          icon:"success",

          title:
            "Call updated",

        });



        return true;



      }

      finally{


        setLoading(false);


      }



    },[]);









  const removeCall =
    useCallback(async(id)=>{


      const confirm =
        await Swal.fire({

          title:
            "Delete call?",


          text:
            "This action cannot be undone.",


          icon:
            "warning",


          showCancelButton:true,


          confirmButtonColor:
            "#ef4444",


          confirmButtonText:
            "Delete",

        });





      if(!confirm.isConfirmed){

        return false;

      }




      setCalls(
        previous =>
          previous.filter(
            call =>
              call._id !== id
          )
      );




      Toast.fire({

        icon:"success",

        title:
          "Call deleted",

      });



      return true;



    },[]);









  const completeCall =
    useCallback(async(id)=>{


      setCalls(

        previous =>

          previous.map(
            call =>


              call._id === id


              ?

              {

                ...call,

                status:
                  "Completed",

                category:
                  "Past Call",

              }


              :

              call

          )

      );



      Toast.fire({

        icon:"success",

        title:
          "Call completed",

      });



      return true;



    },[]);









  return {


    calls,


    loading,


    fetchCalls,


    addCall,


    editCall,


    removeCall,


    completeCall,


  };


}