import React, { useEffect, useState} from "react";
import { useParams,useNavigate } from "react-router-dom";
import axios from "axios";
import 'react-toastify/dist/ReactToastify.css';

function PaymentCheckOutPage()
{
    var [paymentItems,setpaymentItems] = useState(localStorage.getItem("paymentDetails"));
    var [paymentDetails,setpaymentDetails] = useState(JSON.parse(paymentItems));

    var navigate = useNavigate();

    useEffect(() =>
    {
        setTimeout(()=>
        {
            axios.post("http://localhost:3000/payments/paynow")
            .then((res) =>
                {
                    var information = {
                        "action":"https://securegw-stage.paytm.in/theia/processTransaction",
                        // "action":"https://securegw.paytm.in/theia/processTransaction",
                        "params":res.data
                    }

                    post(information)
                }

            )
            .catch((err) =>
            {
                console.log(err);
            })
        },1000)
        
        return () => { 
            localStorage.removeItem("paymentDetails")
        }
    },[])

    function isDate(val) {
        // Cross realm comptatible
        return Object.prototype.toString.call(val) === '[object Date]'
      }
      
      function isObj(val) {
        return typeof val === 'object'
      }
      
       function stringifyValue(val) {
        if (isObj(val) && !isDate(val)) {
          return JSON.stringify(val)
        } else {
          return val
        }
      }
      
      function buildForm({ action, params }) {
        const form = document.createElement('form')
        form.setAttribute('method', 'post')
        form.setAttribute('action', action)
      
        Object.keys(params).forEach(key => {
          const input = document.createElement('input')
          input.setAttribute('type', 'hidden')
          input.setAttribute('name', key)
          input.setAttribute('value', stringifyValue(params[key]))
          form.appendChild(input)
        })
      
        return form
      }
      
       function post(details) {
        const form = buildForm(details)
        document.body.appendChild(form)
        form.submit()
        form.remove()
      }

    return <div>
            <center>
                <h1>Please do not refresh this page...</h1>
            </center>
    </div>
}

export default PaymentCheckOutPage