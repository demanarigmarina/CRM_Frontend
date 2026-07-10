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






const normalizeCall = (
  call,
  index = 0
) => {


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