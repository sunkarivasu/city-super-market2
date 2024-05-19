import react, { useEffect,useState } from "react";
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import { cssTransition, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import "../css/offers.css"


function AdminShowAllUserRequests(props)
{

    var [userRequests,setUserRequests] = useState([]);
    var [phoneNumberFilter,setPhoneNumberFilter] = useState(null);
    var [filteredUserRequests,setFilteredUserRequests] = useState(null);
    var [statusChanged,setStatusChanged] = useState(false);

    useEffect(() => {
        axios.get("/userRequests/active")
            .then((res) => {
                console.log(res.data);
                setUserRequests(res.data.reverse())
                setFilteredUserRequests(res.data.reverse())})
            .catch((err) => console.log("Error Occured while fetching userRequests"))

        return () => {}
    },[statusChanged]);

    function handleEditUserRequest(event)
    {
        console.log(event.target.id);
        props.handleEditUserRequest(event.target.id)
        console.log("Edting user Request..");

    }

    function handleApproveUserRequest(event)
    {
        console.log("Approving user Request..");
        var userRequest = filteredUserRequests[event.target.id]
        console.log(userRequest);
        var newOfferUser = {
            name:userRequest.name,
            phoneNumber:userRequest.phoneNumber,
            noOfDays:userRequest.noOfDays
        }
        axios.post("/offerUsers/add",newOfferUser)
        .then((res) =>{
            axios.put("/userRequests/changeStatus",{
                id:userRequest._id,
                status:"Approved"
            })
            .then((res) =>{
                setStatusChanged(true)
                toast.success("Request Approved, OfferUser added",{position:toast.POSITION.BOTTOM_CENTER})
                console.log(res.data);
                setStatusChanged(false)
            })
            .catch((err) =>{
                console.log("Error occured while approving the request",err);
            })
            console.log(res.data);
        })
        .catch((err) =>{
            toast.error("Something went wrong please try again",{position:toast.POSITION.BOTTOM_CENTER})
           console.log("Error occured while adding OfferUser");
        })
    }



    function handleRejectUserRequest(event)
    {
        console.log("Edting user Request..");
        var userRequest = filteredUserRequests[event.target.id]
        axios.put("/userRequests/changeStatus",{
            id:userRequest._id,
            status:"Rejected"
        })
        .then((res) =>{
            setStatusChanged(true)
            toast.success("Request Rejected",{position:toast.POSITION.BOTTOM_CENTER})
            console.log(res.data);
            setStatusChanged(false)
        })
        .catch((err) =>{
            console.log("Error occured while approving the request",err);
        })
    }

    function handleChangePhoneNumber(event)
    {
        var l = event.target.value.length
        var lc = event.target.value.charAt(l-1)
        if(l==0)
        {
            setFilteredUserRequests(userRequests)
        }
        if(lc=='0' || lc=='1' || lc=='2' || lc=='3' || lc=='4' || lc=='5' || lc=='6' || lc=='7' || lc=='8' ||lc=='9')
        {
            if(l<=10)
            {
                var newFilteredResults = userRequests.filter((userRequest) => userRequest.phoneNumber.toString().startsWith(event.target.value))
                setFilteredUserRequests(newFilteredResults)
                console.log({newFilteredResults});
                setPhoneNumberFilter(event.target.value);
            }
            else
                setPhoneNumberFilter(event.target.value.slice(0,l-1))
        }
        else
        {
            setPhoneNumberFilter(event.target.value.slice(0,l-1))
        }
    }

    function handleEditOfferUser(event)
    {
        console.log(event.target.id);
        props.handleEditOfferUser(event.target.id);
    }


    return <div className="adminShowAllUserRequests">
        <div className="adminShowAllProducts-navbar">
            <div className="navbar-category">
                <label style={{fontWeight:"500",fontSize:"1.1rem"}}>Phone Number</label>
                <input type="text" className="subCategory-select phoneNumber-filter-input" onChange={handleChangePhoneNumber} value={phoneNumberFilter}></input>
            </div>
        </div>
        {userRequests && <div className="counters">
                    <p className="total-users-count">Total:{userRequests.length}</p>
                </div>}
        <div className="productList-titles row">
            <div className="col-3" style={{fontWeight:"600"}}>Name</div>
            <div className="col-2" style={{fontWeight:"600"}}>Phone Number</div>
            <div className="col-4" style={{fontWeight:"600"}}>Number Of Days</div>
            <div className="col-3" style={{fontWeight:"600"}}></div>
        </div>
        <div className="subCategory-container">
            {filteredUserRequests?filteredUserRequests.length>0?<div>
                {filteredUserRequests.map((userRequest,index) => {return <div className="productList-item row" id={userRequests._id} key={index}>
                <div className="offerList-item-name col-3">
                        <p style={{margin:"25px 0px"}}>{userRequest.name}</p>
                    </div>
                    <div className="offerList-item-phoneNumber col-2">
                        <p style={{margin:"25px 0px"}}>{userRequest.phoneNumber}</p>
                    </div>
                    <div className="offerList-item-startDate col-4" style={{textAlign:"left"}}>
                        <p style={{margin:"25px 0px",fontWeight:"500",textTransform:"capitalize"}}>{userRequest.noOfDays}</p>
                    </div>
                    <div className="offerList-item-edit col-1">
                        <button className="btn btn-secondary productList-item-edit-btn" style={{margin:"25px 10px 25px 0px"}} id={userRequest._id} onClick={handleEditUserRequest}>Edit</button>
                    </div>
                    <div className="offerList-item-edit col-1">
                        <button className="btn btn-secondary productList-item-approve-btn" style={{margin:"25px 10px 25px 0px"}} id={index} onClick={handleApproveUserRequest}>Approve</button>
                    </div>
                    <div className="offerList-item-edit col-1">
                        <button className="btn btn-secondary productList-item-reject-btn" style={{margin:"25px 10px 25px 0px"}} id={index} onClick={handleRejectUserRequest}>Reject</button>
                    </div>
                </div>})}
            </div>:<div className="no-users-found-msg">No Users Found</div>:<div className="loading-msg">Loading...</div>}
        </div>
    </div>
}

export default AdminShowAllUserRequests;