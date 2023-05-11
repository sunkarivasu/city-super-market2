import React,{useState,useEffect} from "react";
import Confetti from 'react-confetti';
import {GiPodiumWinner} from "react-icons/gi";
import {BiImage} from "react-icons/bi";
import HorizontalScrollMenu from 'react-horizontal-scrolling-menu';
import { ScrollMenu, VisibilityContext } from 'react-horizontal-scrolling-menu';
import "../css/offers.css";
import axios  from "axios";



function OffersPage()
{
    var resetStage = {
        'isNormal':false,
        'isRunning':false,
        'isWaiting':false,
        'isShowing':false,
        'isDeclaring':false
    }
    var initialStage = {
        ...resetStage,
        'isNormal':true,
    }

    // var globalUpdateTime;

    var [previousWinner,setPreviousWinner] = useState(null);
    var [nextOffer,setNextOffer] = useState(null);
    var [winnersList,setWinnersList] = useState([]);
    var [participantsList,setParticipantsList] = useState([]);
    var [stage,setStage] = useState(initialStage);
    var [timeRemaining,setTimeRemaining] = useState("00:00:00")
    var [winner,setWinner] = useState(); 
    var [day,setDay] = useState("");
    var [normalOffers,setNormalOffers] = useState(null)


    // initial required api calls
    useEffect(() =>
    { 
        // console.log({isResultsTime});

        axios.get("/offers/").then((res) =>
        {
            setWinnersList(res.data)
        })
        .catch((err) =>
        {
            console.log("Erroe occured while fetching offers ..",err);
        })
        
        axios.get("/offerUsers/")
        .then((res) =>
        {
            setParticipantsList(res.data)
        })
        .catch((err) =>
        {
            console.log("Error occured while fetching offeruser",err);
        })

        axios.get("offers/getTodaysOffer/")
        .then((res) =>
        {
            setNextOffer(res.data)
            console.log(res.data);
        })
        .catch((err) =>
        {
            console.log("Error occured while fetching today's offer",err);
        })

        axios.get("normalOffers/")
        .then((res) =>
        {
            setNormalOffers(res.data)
        })
        .catch((err) =>
        {
            console.log("Error while fetching normal offers..",err);
        })
    },[])

    useEffect(()=>
    {
        if(day === 'Yesterday')
        {
            console.log("fetching yesterday's winner");
            var url = "/offers/getYesterdaysWinner"
        }
        else if (day == 'Today')
        {
            var url = "/offers/getTodaysWinner"
        }
        axios.get(url)
            .then((res) =>
            {
                console.log(res.data);
                setPreviousWinner({
                    winnerName:res.data.winnerName,
                    date:res.data.date,
                    winnerPhoneNumber:res.data.winnerPhoneNumer,
                    winnerImage:res.data.winnerImage
                })
            })
            .catch((err) =>
            {
                console.log("Error occured while fetching yesterday's winner",err);
            })
    },[day])

    // updating time for every second
    useEffect(() =>
    {
        var presentDate = new Date()
        console.log({presentDate});
        var hours = presentDate.getHours()
        if(hours>=17 && hours<24)
        {
            setStage({...initialStage,'isDeclaring':true})
            // setStage({...initialStage,'isNormal':true})
            setDay("Today");
        }
        else
        {
            setStage({...initialStage,'isNormal':true})
            setDay("Yesterday");
        }
        if(hours>=17)
        {
            var nextDate = new Date(presentDate.getTime() + (24 * 60 * 60 * 1000))
            var nextDate = new Date(nextDate.getFullYear(),nextDate.getMonth(),nextDate.getDate(),17)
        }
        else
        {
            var nextDate = new Date(presentDate.getFullYear(),presentDate.getMonth(),presentDate.getDate(),17)
        }

        var diff = nextDate - presentDate;

        var msec = diff;
        var hh = Math.floor(msec / 1000 / 60 / 60);
        msec -= hh * 1000 * 60 * 60;
        var mm = Math.floor(msec / 1000 / 60);
        msec -= mm * 1000 * 60;
        var ss = Math.floor(msec / 1000);
        msec -= ss * 1000;

        var updateTime = setInterval(()=>
        {
            console.log("updating time");
            checkIsSpinningTime(hh,mm,ss);
            if(ss == 0)
            {
                mm -= 1
                ss = 59
            }
            else
            {
                ss -= 1
            }
            if (mm == -1)
            {
                hh -= 1 
                mm = 0
            }
            if(hh == -1)
            {
                hh = 23
                mm = 59
            }
            setTimeRemaining(convertToTwoLetters(hh)+":"+(convertToTwoLetters(mm))+":"+(convertToTwoLetters(ss)));
        },1000);

        // globalUpdateTime = updateTime

        var convertToTwoLetters = (time) => 
        {
            return time.toString().length==2?(time.toString()):("0"+time.toString()) 
        }

        var checkIsSpinningTime = () =>
        {
            if (hh == 0 && mm == 0 & ss == 0)
            // if (true)
            {
                console.log("its running time.. huhuhu..");
                clearInterval(updateTime);
                setStage({...resetStage,"isRunning":true});
                // setStage({...resetStage,"isWaiting":true});
                // setStage({...resetStage,"isShowing":true});
            }
        }
    },[])

    // clear interval if stage['isNormal'] == false
    useEffect(() =>
    {
        console.log("stage changed..",stage);

        // if(stage['isNormal'] === false)
        // {
        //     clearInterval(globalUpdateTime)
        // }
    },[stage])

    //to show the Running screen only for 10 seconds
    useEffect(() =>
    {
        if(stage['isRunning'])
        {
            setTimeout(()=>
            {
                setStage({...resetStage,"isRunning":false,"isWaiting":true});
            },10000)
        }
    },[stage])

    //to show the waiting screen only for 12 seconds
    useEffect(() =>
    {
        if(stage['isWaiting'])
        {
            setTimeout(()=>
            {
                setStage({...resetStage,"isWaiting":false,"isShowing":true})
            },12000)
        }
    },[stage])

    // to show the showing screen only for 10 minutes
    useEffect(() =>
    {
        if(stage['isShowing'])
        {
            setTimeout(()=>
            {
                setStage({...resetStage,"isShowing":false,"isDeclaring":true})
            },10000)
            // },10*60*1000)
        }
    },[stage])

    return <div className="offers-page">
            {stage['isRunning'] === true?<GeneratingWinnerResponse/>
            :stage['isWaiting']?<WaitingTimeContainer winnerNumber={[9,9,4,9,5,6,6,5,8,5]}/>
            :stage['isShowing']?<ShowResult/>
            :<div className="container">
                <div className="top-heading">
                    <div className="csm-heading">
                        <b><img className="csm-logo" src="images/offers/csm-logo.jpg"/> CITY SUPER MARKET</b> 
                    </div>
                    <div className="one-rupee-heading">
                        <b className="">ONE RUPEE OFFER</b> 
                    </div>
                    <p className="description">Just pay 30 Rupees to be a member of this offer for 1 month</p>
                </div>
                <div className="normal-offers-container">
                <h5>Special offers only for you</h5>
                <div id="carouselExampleControls" className="carousel slide" data-ride="carousel">
                        <div className="carousel-inner">
                            {normalOffers && normalOffers.map((offer,index) =>
                                {
                                    console.log(offer);
                                    return <div className={index == 0?"carousel-item active":"carousel-item"} key={index}>
                                        <OfferComponent offer={offer}/>
                                    </div>
                                    // return <div className="normal-offer">
                                    //     <div className="offer-image">
                                    //         <img src={offer.image}/>
                                    //     </div>
                                    //     <div className="offer-productName">
                                    //         <p>{offer.productName}</p>
                                    //     </div>
                                    //     <div className="offer-mrp">
                                    //         <p>{offer.price}</p>
                                    //     </div>
                                    // </div>
                                })
                            }
                            {/* {winnersList.slice(0).reverse().map((winner,index) =>{
                                if(index == 0)
                                {
                                    return <></>
                                }
                                else if (index == 1)
                                {
                                    return <div className="carousel-item active">
                                    <WinnerComponent winner={winnersList[1]}/>
                                </div>
                                }
                                else
                                {
                                    return <div className="carousel-item" key={index}>
                                    <WinnerComponent winner={winner}/>
                                    </div>
                                }
                                
                            })} */}
                        </div>  
                        <a className="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span className="sr-only">Previous</span>
                        </a>
                        <a className="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                            <span className="sr-only">Next</span>
                        </a>
                    </div>
                </div>
                {stage['isDeclaring']?
                <CongratulationsContainer/>
                // 
                :
                    <div className="timmer">
                        <p className="winner-declaration-heading">Today's winner will be declared in</p>
                        <Digits numbers={timeRemaining}/>
                    </div>
                    // )
                }
                {/* <hr/> */}
                <div className="next-offer">
                    <h5 className="section-heading">Today's offer</h5>
                    <div className="next-offer-div">
                        <div className="next-offer-product-image offer-product-image">
                            {nextOffer ? <img src={nextOffer.image}/>:<BiImage className="no-image vertical-center"/>}
                        </div>
                        <div className="offer-details">
                            <p className="product-name">{nextOffer?nextOffer.productName:""}</p>
                            <p className="product-description">{nextOffer?nextOffer.description:""}</p>
                            <p className="product-worth">RS {nextOffer?nextOffer.worth:""}</p>
                        </div>
                    </div>
                </div>
                <div className="winner-container">
                    <h5 className="section-heading">{day}'s Winner</h5>
                    <WinnerComponent winner={previousWinner}/>
                </div>
                <div className="winner-list-container">
                    <h5 className="section-heading">Previous Winners</h5>
                    <div id="carouselExampleControls" className="carousel slide" data-ride="carousel">
                        <div className="carousel-inner">
                           
                            {winnersList.slice(0).reverse().map((winner,index) =>{
                                if(index == 0)
                                {
                                    return <></>
                                }
                                else if (index == 1)
                                {
                                    return <div className="carousel-item active">
                                    <WinnerComponent winner={winner}/>
                                </div>
                                }
                                else
                                {
                                    return <div className="carousel-item" key={index}>
                                    <WinnerComponent winner={winner}/>
                                    </div>
                                }
                                
                            })}
                        </div>  
                        <a className="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span className="sr-only">Previous</span>
                        </a>
                        <a className="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                            <span className="sr-only">Next</span>
                        </a>
                    </div>
                </div>
            </div> }   
        </div>
}


function WinnerComponent(props)
{
    if(props.winner)
        console.log(props.winner.winnerImage);
    return <div className="winner-component">
        <div className="winner-div">
            <div className="winner-image offer-product-image">
                {
                props.winner && props.winner.winnerImage ? <img src={props.winner.winnerImage}></img> :
                <BiImage className="no-image"/>
                }
            </div>
            <div className="winner-details">
                <div className="winner-name">{props.winner && props.winner.winnerName}</div>
                <div className="winner-date">{props.winner && props.winner.date.slice(0,10)}</div>
            </div>
        </div>
     </div>
} 

function OfferComponent(props)
{
    if(props.offer)
        console.log(props.offer.image);
    return <div className="winner-component">
        <div className="winner-div">
            <div className="winner-image offer-product-image">
                {
                props.offer && props.offer.image ? <img src={props.offer.image}></img> :
                <BiImage className="no-image"/>
                }
            </div>
            <div className="winner-details">
                <div className="winner-name">{props.offer && props.offer.productName}</div>
                {/* <div className="winner-date">{props.offer && props.offer.price}</div> */}
                <div className="price">
                    <p className="item-priceAfterDiscount col-6">RS {props.offer && Math.round(props.offer.price*(100-props.offer.discount)/100)}</p>
                    {props.offer &&  props.offer.discount>0 && <p className="item-price col-6">RS {props.offer.price}</p>}
                </div>
                <p className="item-description">{props.offer && props.offer.description}</p>
            </div>
        </div>
     </div>
} 


function Digits(props)
{
    if(props.numbers.length !== 10)
    {
        return <div className="digits">
        {props.numbers.split("").map((number,i) =>
        {
            if(number === ":")
                return ":"
            return <div className="digit" key={i}>
                <p>{number}</p>
            </div>
        })}
        
        </div>
    }
    else
    {
        return <div className="phoneNumber">
            <h1>{props.numbers}</h1>
        </div>
    }
}

function CongratulationsContainer()
{
    return (
    <div className="congratulations-container">
        <div>
            <img className="bouquet-image" src="images/offers/gift.gif"/>
        </div>
        <p className="congrats-message">Congratulations</p>
        <p className="winner-name">xyz</p>
    </div>)

}

function GeneratingWinnerResponse()
{
    return <div className="generating-winner-container">
         <img src="images/offers/running.gif"></img>
         <div className="generating-text">
            Declaring Winner
         </div>
</div>
}

function WaitingTimeContainer(props)
{
    var winnerPhoneNumber = props.winnerNumber
    var [revealedNumber,setRevealedNumber] = useState([0,0,0,0,0,0,0,0,0,0])
    
    useEffect( () =>
    {
        console.log('re-rendering...');
        // for (var i=0;i<10;i++)
        //     {
                var i = 0
                var revealNumberSlowly = setInterval(()=>
                {
                    var j = Math.floor(Math.random() * (10));
                    var nums = revealedNumber
                    nums[i] = j 
                    console.log(revealedNumber);
                    setRevealedNumber([...nums])
                },50);

                var changeIndex = setInterval(()=>
                {
                    var nums = revealedNumber
                    nums[i] = winnerPhoneNumber[i]
                    setRevealedNumber([...nums])
                    i += 1 
                    // clearInterval(revealNumberSlowly)
                },1000)

                setTimeout(() =>
                {
                    clearInterval(revealNumberSlowly)
                    clearInterval(changeIndex);
                },10000)
                
            // }

        // var revealWinner = async () =>
        // {

        // }
    },[])

    useEffect(() =>
    {
        console.log("number revealed");
    },[revealedNumber])

    return <div className="waiting-time-container">
        <div className="winnner-phone-number">
            {revealedNumber.map((number,i) =>
            {
                return <div key={i} className="winner-each-number">{number?number:"-"}</div>
            })}
        </div>
        <img src="images/offers/working.gif"></img>
    </div>
}

function ShowResult()
{
    return <div className="showing-time-container">
        <Confetti numberOfPieces={100}></Confetti>
        <img className="bouquet-image" src="images/offers/success.gif"/>
        <div className="congrats-message">
            <p>Congratulations</p>
        </div>
        <div className="winner">
            <p>Sunkari Vasu</p>
        </div>
    </div>
}



export default OffersPage