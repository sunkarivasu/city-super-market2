import React from "react";
import { FaBeer, FaCodeBranch, FaEnvelope,FaFacebook,FaInstagram,FaLocationArrow,FaPhone, FaPhoneAlt, FaSearchLocation, FaTwitter } from 'react-icons/fa'

function Footer()
{
    return (
        <div className="footer">
            <div className="footer-details row">
                <div className="footer-detail col-md-4">
                    {/* <p>Contact us</p> */}
                </div>
                <div className="footer-detail col-md-3">
                    <p className="footer-details-heading" style={{paddingLeft:"20px"}}>Contact us</p>
                    <ul type="none">
                        <li className="footer-contact-us-link"><FaEnvelope/> <a href="" className="footer-contact-us-link">csm@gmail.com</a></li>
                        <li className="footer-contact-us-link"><a href="" className="footer-contact-us-link"><FaPhoneAlt/> 9059186409</a></li>
                        <li className="footer-contact-us-link"><a href="" className="footer-contact-us-link"><FaPhoneAlt/> 9951539257</a></li>
                        {/* <li className="footer-contact-us-link"><a href="" className="footer-contact-us-link">Twitter</a></li> */}
                    </ul>
                </div>
                {/* <div className="footer-detail col-md-4">
                    <p className="footer-details-heading">About us</p>
                    <ul type="none">
                        <li></li>
                    </ul>
                </div> */}
                <div className="footer-detail col-md-4">
                    <p className="footer-details-heading" style={{paddingLeft:"20px"}}>Social</p>
                    <ul type="none">
                        <li className="footer-social-media-link"><a href="" className="footer-social-media-link"><FaFacebook/> Facebook</a></li>
                        <li className="footer-social-media-link"><a href="" className="footer-social-media-link"><FaInstagram/> Instagram</a></li>
                        <li className="footer-social-media-link"><a href="" className="footer-social-media-link"><FaTwitter/> Twitter</a></li>
                    </ul>
                </div>
            </div>
            <div className="footer-service-available" style={{paddingTop:"20px"}}>
                <p style={{display:"inline",padding:"0px 10px"}}>Rajam</p> | <p style={{display:"inline",padding:"0px 10px"}}>Dolapeta</p> | <p style={{display:"inline",padding:"0px 10px"}}>Palakonda</p> | <p style={{display:"inline",padding:"0px 10px"}}>Vijayanagaram</p> | <p style={{display:"inline",padding:"0px 10px"}}>Ponduru</p> | <p style={{display:"inline",padding:"0px 10px"}}>Srikakulam</p>
            </div>
            {/* <div className="footer-address">
                <p style={{marginBottom:"0px",paddingTop:"30px"}}> Main Branch</p>
                <p style={{marginBottom:"0px"}}>Palakonda Road,Rajam,</p>
                <p style={{marginBottom:"0px"}}>Vijayanagaram District,</p>
                <p style={{marginBottom:"0px"}}>Andhra pradesh.</p>
            </div> */}
            <div className="copyright">
                © 2022 City Super Market
            </div>
        </div>
    );
}


export default Footer;
