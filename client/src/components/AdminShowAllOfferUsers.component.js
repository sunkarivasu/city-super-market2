import react, { useEffect,useState } from "react";
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import { cssTransition, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


function AdminShowAllOfferUsers(props)
{

    var [offerUsers,setOfferUsers] = useState(null);
    var [phoneNumberFilter,setPhoneNumberFilter] = useState(null);
    var [filteredOfferUsers,setFilteredOfferUsers] = useState(null);
    var [statusFilter,setStatusFilter] = useState("All")
    var [activeCount,setActiveCount] = useState(null);

    useEffect(() => {

        axios.get("/offerUsers/")
            .then((res) => {
                console.log(res.data);
                var activeCountTemp = 0;  
                var alongWithStatus = res.data.reverse().map((offerUser) =>{
                    var time = new Date().getTime();
                    var startTime = new Date(offerUser.startDate.slice(5,7)+"/"+offerUser.startDate.slice(8,10)+"/"+offerUser.startDate.slice(0,4)).getTime()
                    var endTime = new Date(offerUser.endDate.slice(5,7)+"/"+offerUser.endDate.slice(8,10)+"/"+offerUser.endDate.slice(0,4)).getTime()
                    console.log(startTime,time,endTime);
                    if(startTime <= time && endTime >= time)
                    {
                        activeCountTemp += 1
                        return {...offerUser,status:"Active"}
                    }
                    else
                    {
                        return {...offerUser,status:"InActive"}
                    }
                })
                setOfferUsers(alongWithStatus)
                setActiveCount(activeCountTemp)
                setFilteredOfferUsers(alongWithStatus)})
            .catch((err) => console.log("Error Occured while fetching offerUsers"))    

        return () => {}
    },[]);

    function handleChangePhoneNumber(event)
    {
        var l = event.target.value.length
        var lc = event.target.value.charAt(l-1)
        if(l==0)
        {
            setFilteredOfferUsers(offerUsers)
        }
        if(lc=='0' || lc=='1' || lc=='2' || lc=='3' || lc=='4' || lc=='5' || lc=='6' || lc=='7' || lc=='8' ||lc=='9')
        {
            if(l<=10)
            {
                var newFilteredResults = offerUsers.filter((offerUser) => offerUser.phoneNumber.toString().startsWith(event.target.value))
                setFilteredOfferUsers(newFilteredResults)
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

    function handleChangeStatusFilter(event)
    {
        if(event.target.value == "All")
        {
            setFilteredOfferUsers(offerUsers)
        }
        else
        {
            var newFilteredResults = offerUsers.filter((offerUser) =>
            {
                console.log(offerUser.status,event.target.value);
                return offerUser.status == event.target.value
            });
            setFilteredOfferUsers(newFilteredResults)
        }
        setStatusFilter(event.target.value)
    }

    return <div className="adminShowAllOffers">
        <div className="adminShowAllProducts-navbar">
            <div className="navbar-category">
                <label style={{fontWeight:"500",fontSize:"1.1rem"}}>Phone Number</label>
                <input type="text" className="subCategory-select phoneNumber-filter-input" onChange={handleChangePhoneNumber} value={phoneNumberFilter}></input>
            </div>
            <div className="navbar-subCategory">
                <label style={{fontWeight:"500",fontSize:"1.1rem"}}>Status</label>
                <select className="subCategory-select" style={{width:"250px"}} value={statusFilter} onChange={handleChangeStatusFilter}>
                    <option value="All">All</option>
                    <option value="Active">Active</option>
                    <option value="InActive">InActive</option>
                </select>
            </div>
            
        </div>
        {offerUsers && <div className="counters">
                    <p className="total-users-count">Total:{offerUsers.length}</p>
                    <p className="active-users-count">Active:{activeCount}</p>
                    <p className="inactive-users-count">InActive:{offerUsers.length - activeCount}</p>
                </div>}
        <div style={{display:"block"}}>
                <button className="btn btn-secondary admin-add-product-home-btn" onClick={props.handleAddOfferUser}>Add OfferUser</button>
            </div>
        <div className="productList-titles row">
            <div className="col-3" style={{fontWeight:"600"}}>Name</div>
            <div className="col-2" style={{fontWeight:"600"}}>Phone Number</div>
            <div className="col-2" style={{fontWeight:"600"}}>Start Date</div>
            <div className="col-2" style={{fontWeight:"600"}}>End Date</div>
            <div className="col-2" style={{fontWeight:"600"}}>Status</div>
            <div className="col-1" style={{fontWeight:"600"}}></div>
        </div>
        <div className="subCategory-container">
            {filteredOfferUsers?filteredOfferUsers.length>0?<div>
                {filteredOfferUsers.map((offerUser,index) => {return <div className="productList-item row" id={offerUser._id} key={index}>
                <div className="offerList-item-name col-3">
                        <p style={{margin:"25px 0px"}}>{offerUser.name}</p>
                    </div>
                    <div className="offerList-item-phoneNumber col-2">
                        <p style={{margin:"25px 0px"}}>{offerUser.phoneNumber}</p>
                    </div>
                    <div className="offerList-item-startDate col-2" style={{textAlign:"left"}}>
                        <p style={{margin:"25px 0px",fontWeight:"500",textTransform:"capitalize"}}>{offerUser.startDate.slice(0,10)}</p>
                    </div>
                    <div className="offerList-item-endDate col-2">
                        <p style={{margin:"25px 0px"}}>{offerUser.endDate.slice(0,10)}</p>
                    </div>
                    <div className="offerList-item-status col-2">
                        <p style={{margin:"25px 0px"}}>{offerUser.status}</p>
                    </div>
                    <div className="offerList-item-edit col-1">
                        <button className="btn btn-secondary productList-item-edit-btn" style={{margin:"25px 10px 25px 0px"}} id={offerUser._id} onClick={handleEditOfferUser}>Edit</button>
                    </div>
                </div>})}
            </div>:<div className="no-users-found-msg">No Users Found</div>:<div className="loading-msg">Loading...</div>}
        </div>
    </div>
}

export default AdminShowAllOfferUsers;