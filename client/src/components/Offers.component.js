import React,{useState,useEffect} from "react";
import Confetti from 'react-confetti';
import {GiPodiumWinner} from "react-icons/gi";
import {BiImage} from "react-icons/bi";
import HorizontalScrollMenu from 'react-horizontal-scrolling-menu';
import { ScrollMenu, VisibilityContext } from 'react-horizontal-scrolling-menu';
import "../css/offers.css";



function OffersPage()
{
    var [previousWinner,setPreviousWinner] = useState(null);
    var [nextOffer,setnextOffer] = useState(null);
    var [winnersList,setWinnersList] = useState([]);
    var [participantsList,setParticipantsList] = useState([]);
    // var [hoursReamining,setHoursRemaining] = useState(0);
    // var [minutesRemaining,setMinutesRemaining] = useState(0);
    // var [secondsRemaining,setSecondsRemaining] = useState(0); 
    var [timeRemaining,setTimeRemaining] = useState("00:00:00")
    var [isSpinningTime,setIsSpinningTime] = useState(false);
    var [winner,setWinner] = useState(); 
    var [day,setDay] = useState("");
    var [isResultsTime,setIsResultsTime] = useState(true);

    useEffect(() =>
    { 
        console.log({isResultsTime});
        setPreviousWinner(
            {
                date:"22/04/2023",
                name:"Sunkari Vasu",
                phoneNumber:"9949566585"     
            }
        )
        setnextOffer(
            {
                name:"jhonson's baby powder",
                description:"suitable for childrens of age between 2-6",
                // image:"https://firebasestorage.googleapis.com/v0/b/city-super-market.appspot.com/o/edddedasdasasdasd34%2Fimage?alt=media&token=871099ab-b496-47d8-8a0f-cc089e286281",
                worth:"500"
            }
        )
        setWinnersList([
            {
                date:"22/04/2023",
                name:"Sunkari Vasu 1 ",
                phoneNumber:"9949566585"     
            },
            {
                date:"22/04/2023",
                name:"Sunkari Vasu 2",
                phoneNumber:"9949566585"     
            },
            {
                date:"22/04/2023",
                name:"Sunkari Vasu 3",
                phoneNumber:"9949566585"     
            },
            {
                date:"22/04/2023 efwer",
                name:"Sunkari Vasu 4",
                phoneNumber:"9949566585"     
            }

        ])
        var presentDate = new Date()
        console.log({presentDate});
        var hours = presentDate.getHours()
        if(hours>=17 && hours<24)
        {
            setIsResultsTime(true);
            setDay("Today");
        }
        else
        {
            // setIsResultsTime(false);
            setIsResultsTime(true);
            setDay("Yesterday");
        }
        if(presentDate.getHours()>=17)
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

        setInterval(()=>
        {
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

        var convertToTwoLetters = (time) => 
        {
            return time.toString().length==2?(time.toString()):("0"+time.toString()) 
        }

        var checkIsSpinningTime = () =>
        {
            if (hh == 0 && mm == 0 & ss == 0)
            {
                setIsSpinningTime(true)
            }
        }

        // array shuffling should be done at backend
        var shuffleArray = (array)  => {
            for (let i = array.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
          }

        setParticipantsList([
            {
                phoneNumber:"1234534343"
            },
            {
                phoneNumber:"2423223356"
            },
            {
                phoneNumber:"3956347890"
            },
            {
                phoneNumber:"9949566585"
            },
            {
                phoneNumber:"2679534567"
            },
            {
                phoneNumber:"9456784329"
            },
            {
                phoneNumber:"7386405112"
            },
            {
                phoneNumber:"8949566585"
            },
            {
                phoneNumber:"9059186409"
            },
            {
                phoneNumber:"6300028491"
            },
            {
                phoneNumber:"9546789540"
            }]); 
            setIsSpinningTime(true)
    },[])

    useEffect(()=>
    {
        console.log("changing isSpinninnTime",isSpinningTime);
        console.log(participantsList);
        var rotateArray = (array) =>
        {
            var firstElement = array.shift();
            array.push(firstElement);
            return array;
        }

        if(isSpinningTime && participantsList)
        {
            var arr1 = [1,2,3,4]
            setTimeout(() =>
            {

                clearInterval(rotateList);
                setIsSpinningTime(false);
            },10000);

            var rotateList = setInterval(()=>
            {
                selectRandomwinner();
            },10);

            var selectRandomwinner = () =>
            {
                var randomNumber = Math.floor(participantsList.length*Math.random());
                console.log(participantsList[randomNumber]);
                setWinner(participantsList[randomNumber])
            }

        }
    },[isSpinningTime])

    return <div className="offers-page">
            {nextOffer && <div className="container">
                <div className="top-heading">
                    <div className="csm-heading">
                        <b>CITY SUPER MARKET</b> 
                    </div>
                    <div className="one-rupee-heading">
                        <b className="">ONE RUPEE OFFER</b> 
                    </div>
                    <p className="description">Just pay 30 Rupees to be a member of this offer for 1 month</p>
                </div>
                {isResultsTime?
                <CongratulationsContainer/>
                :(isSpinningTime?
                    <div className="spinning-time">
                        <p className="winner-declaration-heading">Declaring winner by spining</p>
                        <div className="winner-declaration-container">
                            {winner && <Digits numbers={winner.phoneNumber}/>}
                        </div>
                    </div>:
                    <div className="timmer">
                        <p className="winner-declaration-heading">Today's winner will be declared in</p>
                        <Digits numbers={timeRemaining}/>
                    </div>)
                }
                {/* <hr/> */}
                <div className="next-offer">
                    <h5 className="section-heading">Today's offer</h5>
                    <div className="next-offer-div">
                        <div className="next-offer-product-image">
                            {nextOffer.image ? <img src={nextOffer.image}></img> :<BiImage className="no-image vertical-center"/>}
                        </div>
                        <div className="offer-details">
                            <p className="product-name">{nextOffer.name}</p>
                            <p className="product-description">{nextOffer.description}</p>
                            <p className="product-worth">RS {nextOffer.worth}</p>
                        </div>
                    </div>
                </div>
                {/* <hr/> */}
                <div className="winner-container">
                    <h5 className="section-heading">{day}'s Winner</h5>
                    <WinnerComponent winner={previousWinner}/>
                </div>
                {/* <hr/> */}
                <div className="winner-list-container">
                    <h5 className="section-heading">Previous Winners</h5>
                    <div id="carouselExampleControls" className="carousel slide" data-ride="carousel">
                        <div className="carousel-inner">
                            <div className="carousel-item active">
                                <WinnerComponent winner={winnersList[0]}/>
                            </div>
                            {winnersList.map((winner,index) =>{
                                return <div className="carousel-item" key={index}>
                                    <WinnerComponent winner={winner}/>
                                </div>
                            })}
                        </div>  
                        <a className="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">
                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span className="sr-only">Previous</span>
                        </a>
                        <a className="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">
                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                            <span className="sr-only">Next</span>
                        </a>
                    </div>
                </div>
            </div> }   
        </div>
}


function WinnerComponent(props)
{
    return <div className="winner-component">
        <div className="winner-div">
            <div className="winner-image">
                {
                props.winner.imageUrl ? <img src={props.winner.imageUrl}></img> :
                <BiImage className="no-image"/>
                }
            </div>
            <div className="winner-details">
                <div className="winner-name">{props.winner.name}</div>
                <div className="winner-date">{props.winner.date}</div>
            </div>
        </div>
     </div>
} 


function Digits(props)
{
    if(props.numbers.length !== 10)
    {
        return <div className="digits">
        {props.numbers.split("").map((number) =>
        {
            if(number === ":")
                return ":"
            return <div className="digit">
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


export default OffersPage