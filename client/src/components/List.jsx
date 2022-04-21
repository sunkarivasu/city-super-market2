import React  from "react";
import {Link} from "react-router-dom";
import "../css/List.css";

function createItem(props)
{
    return (<div className="item col-12 col-md-2 col-sm-6">
        <Item id={props._id} imgUrl={props.image} brand={props.brand} description={props.description} discount={props.discount} price={props.price}/>
    </div>);
}

function Item(props)
{
    return(
            <div className="main-item">
                <Link className="item-btn" to={"/productDescription/"+props.id}>
                    <div className="" id={props.key}>
                        <div className="item-img">
                        <img className="item-image" src={props.imgUrl}/>
                        </div>
                        <div className="hr"/>
                        <div className="item-details">
                            <p className="item-brand">{props.brand}</p>
                            <div className="price">
                                <p className="item-priceAfterDiscount col-6">₹ {Math.round(props.price*(100-props.discount)/100)}</p>
                                { props.discount>0 && <p className="item-price col-6">₹ {props.price}</p>}
                            </div>
                            <p className="item-description">{props.description}</p>
                        </div>
                                            </div>  
                </Link>
            </div>);
}

function CreateList(props)
{   
    if(props)
    {
        return (
        <div className="list">
            <div className="list-title flex-container-space-between">
                <p className="list-title-main">{props[0].category}</p>
                <Link className="view-all-btn btn-primary" to={"/viewAll/"+props[0].category}>VIEW ALL</Link>
            </div>
            <div className="row list-items">
                {props.map(createItem)}
            </div>   
        </div>);
    }
    else
    {
        return(<div>Loading...</div>)
    } 
}

export default CreateList;
export {createItem,Item};
