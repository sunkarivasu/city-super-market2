import React from "react";
// import useWindowSize from 'react-use/lib/useWindowSize'
import Confetti from 'react-confetti'


function Carosuel()
{
    // const { width, height } = {"500px","500px"}
    return (
        <div className="carousel-section">
            <div id="carouselExampleSlidesOnly" className="carousel slide" data-ride="carousel">
                <div className="carousel-inner">
                    <div className="carousel-item active">
                        {/* <div className="birthday-carousel row" style={{padding:"5px",backgroundColor:"orange"}}>
                            <div className="col-2"></div>
                            <div className="col-4">
                                <img src="mayya-img.jpg" alt="mayya-img" style={{width:"220px",height:"220px",borderRadius:"50%",margin:"50px"}}/>
                            </div>
                            <div className="col-6">
                                <p style={{marginTop:"90px",color:"white",fontWeight:"900",fontFamily:"italic",fontSize:"50px"}}>Happy Birthday Mayya</p>
                                <div style={{textAlign:"center"}}>
                                    <p style={{marginTop:"10px",color:"green",fontWeight:"700",fontFamily:"italic",fontSize:"25px"}}>May all your dreams come true</p>
                                </div>
                            </div>
                            <Confetti recycle={true}/>
                        </div> */}
                        <img className="carousel-image d-block w-100" src="images/carousel/carousel-1-light-blue.jpg" alt="First slide"/>
                    </div>
                    <div className="carousel-item">
                        <img className="carousel-image d-block w-100" src="images/carousel/carousel-1-2.jpg" alt="First slide"/>
                    </div>
                    <div className="carousel-item">
                        <img className="carousel-image d-block w-100" src="images/carousel/carousel-1-3.jpg" alt="First slide"/>
                    </div>
                </div>
            </div>
        </div>
        );
}


export default Carosuel;

{/* <div id="carouselExampleControls" className="carousel slide" data-ride="carousel">
                <div class="carousel-inner">
                    <div class="carousel-item active">
                    <img class="carousel-image d-block w-100" src="images/carousel/carousel-1-3.jpg" alt="First slide"/>
                    </div>
                    <div class="carousel-item">
                    <img class="carousel-image d-block w-100" src="images/carousel/delivery.jpg" alt="Second slide"/>
                    </div>
                    <div class="carousel-item">
                    <img class="carousel-image d-block w-100" src="images/carousel/delivery.jpg" alt="Third slide"/>
                    </div>
                </div>
                <a className="carousel-control-prev carousel-control" href="#carouselExampleControls" role="button" data-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="sr-only"></span>
                </a>
                <a className="carousel-control-next carousel-control" href="#carouselExampleControls" role="button" data-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="sr-only"></span>
                </a>
            </div> */}