import react, { useEffect,useState } from "react";
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import { cssTransition, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';


function AdminShowAllNormalOffers(props)
{

    var [normalOffers,setNormalOffers] = useState(null);
    var [productNameFilter,setProductNameFilter] = useState(null);
    var [filteredOffers,setFilteredOffers] = useState(null);
    var [deleteOfferId,setDeleteOfferId] = useState(null);
    var [statusChangeId,setStatusChangeId] = useState(null);

    function fetchNormalOffers() 
    {
        axios.get("/normalOffers/")
            .then((res) => {
                console.log(res.data);
                setNormalOffers(res.data.reverse())
                setFilteredOffers(res.data.reverse())
            })
            .catch((err) => console.log("Error Occured while fetching normal offers"))    
    }

    useEffect(() => {
        fetchNormalOffers()
        return () => {}
    },[deleteOfferId]);



    function handleChangeProductName(event)
    {
        var newFilteredResults = normalOffers.filter((offer) => offer.productName.toString().startsWith(event.target.value))
        setFilteredOffers(newFilteredResults)
        setProductNameFilter(event.target.value);

    } 

    function handleEditNormalOffer(event)
    {
        console.log(event.target.id);
        props.handleEditNormalOffer(event.target.id);
    }

    function handleDeleteNormalOffer(event)
    {
        console.log(event.target.id);
        axios.delete("/normalOffers/delete/"+event.target.id)
        .then((res) =>
        {
            console.log("Normal Offer Deleted successfully");
        })
        .catch((err) =>
        {
            console.log("Error occured while deleting normal offer");
        });
        setDeleteOfferId(event.target.id);
    }

    function handleChangeStatusId(event)
    {
        console.log("changing status",event.target.checked);
        setStatusChangeId(event.target.id)
        console.log("id",event.target.id);
        axios.post("/normalOffers/changeStatus/"+event.target.id,{status:event.target.checked})
        .then((res) =>
        {
            fetchNormalOffers()
            console.log(res.data);
        })
        .catch((err) =>{
            console.log("Error occured while changing the status",err);
        })
    }

    return <div className="adminShowAllOffers">
        <div className="adminShowAllProducts-navbar">
            <div className="navbar-category">
                <label style={{fontWeight:"500",fontSize:"1.1rem"}}>Product Name</label>
                <input type="text" className="subCategory-select phoneNumber-filter-input" value={productNameFilter} onChange={handleChangeProductName}></input>
            </div>
        </div>
        <div style={{display:"block"}}>
                <button className="btn btn-secondary admin-add-product-home-btn" onClick={props.handleAddNormalOffer}>Add Normal Offer</button>
            </div>
        <div className="productList-titles row">
            <div className="col-1" style={{fontWeight:"600"}}>Image</div>
            <div className="col-2" style={{fontWeight:"600"}}>Product Name</div>
            <div className="col-2" style={{fontWeight:"600"}}>Description</div>
            <div className="col-1" style={{fontWeight:"600"}}>M.R.P</div>
            <div className="col-1" style={{fontWeight:"600"}}>Discount</div>
            <div className="col-1" style={{fontWeight:"600"}}>Price</div>
            <div className="col-1" style={{fontWeight:"600"}}>Status</div>
            <div className="col-3" style={{fontWeight:"600"}}></div>
        </div>
        <div className="subCategory-container">
            {filteredOffers?<div>
                {filteredOffers.length?filteredOffers.map((offer) => {return <div className="productList-item row" id={offer._id}>
                    <div className="offerList-item-img col-1">
                        <img src={offer.image} style={{width:"80px",height:"80px"}}/>
                    </div>
                    <div className="offerList-item-brand col-2" style={{textAlign:"left"}}>
                        <p style={{margin:"25px 0px",fontWeight:"500",textTransform:"capitalize"}}>{offer.productName}</p>
                    </div>
                    <div className="offerList-item-description col-2">
                        <p style={{margin:"25px 0px",fontWeight:"500"}}>{offer.description}</p>
                    </div>
                    <div className="offerList-item-mrp col-1">
                        <p style={{margin:"25px 0px"}}>Rs {offer.price}</p>
                    </div>
                    <div className="offerList-item-discount col-1">
                        <p style={{margin:"25px 0px"}}>{offer.discount}%</p>
                    </div>
                    <div className="offerList-item-price col-1">
                        <p style={{margin:"25px 0px"}}>Rs {Math.ceil(((100-offer.discount)/100)*offer.price)}</p>
                    </div>
                    <div className="offerList-item-status col-1">
                        <p style={{margin:"25px 0px"}}>
                            <FormControlLabel
                        control={
                        <Switch
                            // checked={offer.status}
                            checked={offer.status === "Active"?true:false}
                            onChange={handleChangeStatusId}
                            color="primary"
                            name="status"
                            id={offer._id}
                        />
                        }
                        /></p>
                    </div>
                    <div className="offerList-item-edit col-3">
                        <button className="btn btn-secondary productList-item-edit-btn" style={{margin:"25px 10px 25px 0px"}} id={offer._id} onClick={handleEditNormalOffer}>Edit</button>
                        <button className="btn btn-secondary productList-item-delete-btn" style={{margin:"25px 10px 25px 0px"}} id={offer._id} onClick={handleDeleteNormalOffer}>Delete</button>
                    </div>
                </div>}):<div className="no-users-found-msg">No offers found</div>}
            </div>:<div>Loading...</div>}
        </div>
    </div>
}

export default AdminShowAllNormalOffers;