import React,{useState,useEffect} from "react";
import Confetti from 'react-confetti';
import {GiPodiumWinner} from "react-icons/gi";
import {BiImage} from "react-icons/bi";
import HorizontalScrollMenu from 'react-horizontal-scrolling-menu';
import { ScrollMenu, VisibilityContext } from 'react-horizontal-scrolling-menu';
import "../css/offers.css";
import axios  from "axios";
import constants from "../constants";
import { cssTransition, toast } from "react-toastify";



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

    var initialUserRequestForm = {
        name:'',
        phoneNumber:'',
        noOfDays:'',
        nameErr:'init',
        phoneNumberErr:'init',
        noOfDaysErr:'init'
    }

    var winnerDeclarationHour = constants['winnerDeclarationHour']

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
    var [generatedWinner,setGeneratedWinnner] = useState(null)

    var [form,setForm] = useState(initialUserRequestForm)
    var [canBeSubmitted,setCanBeSubmitted] = useState(false);
    var [checkForm,setCheckForm] = useState(false)
    var [sendSuccess,setSendSuccess] = useState(false);
    var [sendFailure,setSendFailure] = useState(false);

    useEffect(() => {
        console.log("canbeSubmitted::", canBeSubmitted)
    },[])


    // initial required api calls
    useEffect(() =>
    {
        // console.log({isResultsTime});

        axios.get("/offers/previousWinners").then((res) =>
        {
            console.log(res.data);
            // var reve = res.data.reverse();
            // console.log(reve);
            setWinnersList(res.data)
        })
        .catch((err) =>
        {
            console.log("Error occured while fetching offers ..",err);
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

        axios.get("normalOffers/getActiveOffers")
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
        console.log(day);
        if(day === 'Yesterday')
        {
            console.log("fetching yesterday's winner");
            var url = "/offers/getYesterdaysWinner"
        }
        else if (day === 'Today')
        {
            var url = "/offers/getTodaysWinner"
        }
        console.log("url: " + url);
        axios.get(url)
            .then((res) =>
            {
                console.log(res.data);
                setPreviousWinner(res.data)
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
        var presentTime = presentDate.getTime()
        var declarationDate = new Date(presentDate - (presentDate % (1000 * 60 * 60 *24)) + (1000 * 60 * 60 * 17) - (1000 * 60 * 60 * 5.5))
        var declarationTime = declarationDate.getTime()
        console.log({presentDate});
        console.log({presentTime});
        console.log({declarationTime});
        console.log({declarationDate});
        var timeDiff = presentTime - declarationTime
        console.log({timeDiff});
        var hours = presentDate.getHours()
        if(hours>=winnerDeclarationHour && hours<24)
        {
            if(timeDiff > 0 && timeDiff <= 22 * 1000)
            {
                setStage({...initialStage,'isRunning':true})
            }
            else if(timeDiff > 0 && timeDiff <= (22 * 1000) + (1 * 60 * 1000))
            {
                setStage({...initialStage,'isShowing':true})
            }
            else
            {
                setStage({...initialStage,'isDeclaring':true})
                // setStage({...initialStage,'isNormal':true})
                setDay("Today")
            }
        }
        else
        {
            setStage({...initialStage,'isNormal':true})
            // setStage({...initialStage,'isRunning':true})
            setDay("Yesterday");
        }
        if(hours>=winnerDeclarationHour)
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

        // globalsendTime = sendTime

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
            axios.get("/offers/getTodaysWinner")
            .then((res)=>{
                console.log(res.data);
                setGeneratedWinnner(res.data)
            })
            .catch((err)=>{
                console.log("Error occured while fetching generated winner");
            })
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
            // },10000)
            },1*60*1000)
        }
    },[stage])

    if(sendSuccess)
    {
      toast.success("Request Sent successfully",{position:toast.POSITION.BOTTOM_CENTER});
    }

    if(checkForm)
    {
      validate()
      setCheckForm(false)
    }


    function validate()
    {
      if (form.nameErr=="" && form.phoneNumberErr=="" && form.noOfDaysErr=="")
      {
          console.log("can be submitted");
          setCanBeSubmitted(true);
      }
      else
      {
          setCanBeSubmitted(false);
      }
    }

    function handleChangeForm(event)
    {
        console.log(form);
        if(event.target.id=="phoneNumber" || event.target.id=="noOfDays")
        {
            var l = event.target.value.length
            var lc = event.target.value.charAt(l-1)
            if(lc=='0' || lc=='1' || lc=='2' || lc=='3' || lc=='4' || lc=='5' || lc=='6' || lc=='7' || lc=='8' ||lc=='9')
            {
                if(l<=10)
                {
                    setForm({...form,[event.target.id]:event.target.value});
                    validateForm(event.target.id,event.target.value)
                }
            }
            else
            {
                setForm({...form,[event.target.id]:event.target.value.slice(0,l-1)})
                validateForm(event.target.id,event.target.value.slice(0,l-1))
            }
        }
        else
        {
            setForm({...form,[event.target.id]:event.target.value});
            validateForm(event.target.id,event.target.value)
            console.log(form);
        }
        setCheckForm(true)
    }

    function
    validateForm(field,value)
    {
        //console.log(field,value);
        switch(field)
        {
        case 'name':
            if(value.length<3)
            setForm({...form,nameErr:"Name should contain atleast 3 characters",name:value})
            else if (!value.match(/^[a-zA-Z ]{3,}$/gm))
            {
            setForm({...form,nameErr:"Name should only contain characters",name:value})
            //console.log("Iam here",form)
            }
            else
            setForm({...form,nameErr:"",name:value})
            break
        case 'phoneNumber':
            if (value.length == 0)
                setForm({...form,phoneNumberErr:"Enter Phone Number",phoneNumber:value})
            else if(value.length != 10)
                setForm({...form,phoneNumberErr:"Phone Number should contain exactly 10 digits",phoneNumber:value})
            else
                setForm({...form,phoneNumber:value,phoneNumberErr:""})
            break
        case "noOfDays":
            if(value.length==0)
            setForm({...form,noOfDaysErr:"Enter Number Of Days",noOfDays:value})
            else if(value<30)
            setForm({...form,noOfDaysErr:"Minimum Number of Days is 30",noOfDays:value})
            else
            setForm({...form,noOfDaysErr:"",noOfDays:value})
            break
        }
    }

    function sendRequest(){
        console.log("sending request..");
        axios.post("/userRequests/add",form)
        .then((res) =>{
            if(res.data.status)
            {
                toast.success("OfferUser updated successfully",{position:toast.POSITION.BOTTOM_CENTER});
                setForm(initialUserRequestForm)
                setCanBeSubmitted(false);
                console.log("added successfully");
            }
            else
            {
                toast.warning("Phone Number Already Exists",{position:toast.POSITION.BOTTOM_CENTER});
                console.log("phone Number already exists");
            }
        })
        .catch((err) =>{
            toast.error("Something went wrong, Please try again",{position:toast.POSITION.BOTTOM_CENTER});
            console.log("Error occured while adding user Request..",err);
        })
    }

    // if(sendSuccess)
    // {
    //   toast.success("Request Sent successfully",{position:toast.POSITION.BOTTOM_CENTER});
    // }

    // if(sendFailure)
    // {
    //     toast.error("Something went wrong, please try again",{position:toast.POSITION.BOTTOM_CENTER});
    // }



    return <div className="offers-page">
            {stage['isRunning'] === true?<GeneratingWinnerResponse/>
            :stage['isWaiting'] && generatedWinner ?<WaitingTimeContainer winnerPhoneNumber={generatedWinner.winnerPhoneNumber}/>
            :stage['isShowing']?<ShowResult winner={generatedWinner}/>
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
                <div id="offer-carousel" className="carousel slide" data-ride="carousel">
                        <div className="carousel-inner">
                            {normalOffers && normalOffers.slice(0).reverse().map((offer,index) =>
                                {
                                    return <div className={index == 0?"carousel-item active":"carousel-item"} key={index}>
                                        <OfferComponent offer={offer}/>
                                    </div>
                                })
                            }
                        </div>
                        <a className="carousel-control-prev"  href="#offer-carousel" role="button" data-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span className="sr-only">Previous</span>
                        </a>
                        <a className="carousel-control-next"  href="#offer-carousel" role="button" data-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                            <span className="sr-only">Next</span>
                        </a>
                    </div>
                </div>
                {stage['isDeclaring']?
                // previousWinner && <CongratulationsContainer winnerName={previousWinner.winnerName}/>
                <></>
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
                        {nextOffer?<div className="offer-details">
                            <p className="product-name">{nextOffer?nextOffer.productName:""}</p>
                            <p className="product-description">{nextOffer?nextOffer.description:""}</p>
                            <p className="product-worth">RS {nextOffer?nextOffer.worth:""}</p>
                        </div>:<div>
                            <p className="product-name">No Offer</p>
                            </div>}
                    </div>
                </div>
                <div className="winner-container">
                    <h5 className="section-heading">{day}'s Winner</h5>
                    <WinnerComponent winner={previousWinner} singleDay={true}/>
                </div>
                <div className="winner-list-container">
                    <h5 className="section-heading">Previous Winners</h5>
                    {<div id="previous-winners-carousel" className="carousel slide" data-ride="carousel">
                        <div className="carousel-inner">
                            {winnersList.slice(0).reverse().map((winner,index) =>{
                                    return <div key={index} className={index == 0?"carousel-item active":"carousel-item"}>
                                    <WinnerComponent winner={winner} singleDay={false}/>
                                </div>
                            })}
                        </div>
                        <a className="carousel-control-prev" href="#previous-winners-carousel" role="button" data-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span className="sr-only">Previous</span>
                        </a>
                        <a className="carousel-control-next" href="#previous-winners-carousel" role="button" data-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                            <span className="sr-only">Next</span>
                        </a>
                    </div>}
                </div>
                <div className="offer-user-request-form">
                    <form className="admin-form offer-user-request-form" onSubmit={(e) =>{e.preventDefault();}}>
                        <p className="offerUserRequestForm-title">Send Request</p>
                        <p className="offerUserRequest-description">Send us a request to be a part of this offer</p>
                        <div className="form-group">
                            <label for="name">Name</label>
                            <input type="text" className="form-control name" id="name" onChange={handleChangeForm} value={form.name} placeholder=""/>
                            { form.nameErr.length>0 && form.nameErr!="init" && <p className="adminErr err">{form.nameErr}</p>}
                        </div>
                        <div className="form-group" >
                            <label for="phoneNumber">Phone Number</label>
                            <input type="text" className="form-control phoneNumber"  onChange={handleChangeForm} id="phoneNumber" value={form.phoneNumber}/>
                            { form.phoneNumberErr.length>0 && form.phoneNumberErr!="init" && <p className="adminErr err">{form.phoneNumberErr}</p>}
                        </div>
                        <div className="form-group" >
                            <label for="productDiscount">Number of Days</label>
                            <input type="text" className="form-control productDiscount"  onChange={handleChangeForm} id="noOfDays" value={form.noOfDays}/>
                            { form.noOfDaysErr.length>0 && form.noOfDaysErr!="init" &&  <p className="adminErr err">{form.noOfDaysErr}</p>}
                        </div>
                        { canBeSubmitted?<button type="button" className="btn btn-primary"  onClick={sendRequest}>Send Request</button>:<button type="button" className="btn btn-primary" disabled>Send Request</button>}
                    </form>
                </div>
            </div> }
        </div>
}


function WinnerComponent(props)
{
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
                {props.singleDay && props.winner && !props.winner.winnerImage && <div className="winner-phoneNumber">{props.winner && props.winner.winnerPhoneNumber}</div>}
                <div className="winner-date">{props.winner && props.winner.date.slice(0,10)}</div>
            </div>
        </div>
     </div>
}

function OfferComponent(props)
{
    if(props.offer)
    return <div className="winner-component">
        <div className="winner-div">
            <div className="winner-image offer-product-image">
                {
                props.offer && props.offer.image ? <img src={props.offer.image}></img> :
                <BiImage className="no-image"/>
                }
            </div>
            <div className="winner-details">
                <div className="product-name">{props.offer && props.offer.productName}</div>
                <p className="product-description">{props.offer && props.offer.description}</p>
                {/* <div className="winner-date">{props.offer && props.offer.price}</div> */}
                <div className="price">
                    <p className="product-worth item-priceAfterDiscount col-6">RS {props.offer && props.offer.retailPrice>0 && props.offer.retailPrice}</p>
                    {props.offer &&  props.offer.price>0 && <p className="item-price col-6">RS {props.offer.price}</p>}
                </div>
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
        return <div className="phoneNumberDigits">
            <h1>{props.numbers}</h1>
        </div>
    }
}

function CongratulationsContainer(props)
{
    return (
    <div className="congratulations-container">
        <div>
            <img className="bouquet-image" src="images/offers/gift.gif"/>
        </div>
        <p className="congrats-message">Congratulations</p>
        <p className="winner-name">{props && props.winnerName && props.winnerName}</p>
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
    console.log(props.winnerPhoneNumber)
    var winnerPhoneNumber = []
    for(var i=0;i<props.winnerPhoneNumber.length;i++)
    {
        winnerPhoneNumber.push(props.winnerPhoneNumber[i]);
    }
    console.log({winnerPhoneNumber});
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

function ShowResult(props)
{
    return <div className="showing-time-container">
        <Confetti numberOfPieces={100}></Confetti>
        <img className="bouquet-image" src="images/offers/success.gif"/>
        <div className="congrats-message">
            <p>Congratulations</p>
        </div>
        <div className="winner">
            <p>{props.winner.winnerName}</p>
        </div>
    </div>
}



export default OffersPage








// import React,{useState,useEffect} from "react";
// import Confetti from 'react-confetti';
// import {GiPodiumWinner} from "react-icons/gi";
// import {BiImage} from "react-icons/bi";
// import HorizontalScrollMenu from 'react-horizontal-scrolling-menu';
// import { ScrollMenu, VisibilityContext } from 'react-horizontal-scrolling-menu';
// import "../css/offers.css";
// import axios  from "axios";
// import constants from "../constants";
// import { cssTransition, toast } from "react-toastify";



// function OffersPage()
// {
//     var resetStage = {
//         'isNormal':false,
//         'isRunning':false,
//         'isWaiting':false,
//         'isShowing':false,
//         'isDeclaring':false
//     }
//     var initialStage = {
//         ...resetStage,
//         'isNormal':true,
//     }

//     var initialUserRequestForm = {
//         name:'',
//         phoneNumber:'',
//         noOfDays:'',
//         nameErr:'init',
//         phoneNumberErr:'init',
//         noOfDaysErr:'init'
//     }

//     var winnerDeclarationHour = constants['winnerDeclarationHour']

//     // var globalUpdateTime;

//     var [previousWinner,setPreviousWinner] = useState(null);
//     var [nextOffer,setNextOffer] = useState(null);
//     var [winnersList,setWinnersList] = useState([]);
//     var [participantsList,setParticipantsList] = useState([]);
//     var [stage,setStage] = useState(initialStage);
//     var [timeRemaining,setTimeRemaining] = useState("00:00:00")
//     var [winner,setWinner] = useState();
//     var [day,setDay] = useState("");
//     var [normalOffers,setNormalOffers] = useState(null)
//     var [generatedWinner,setGeneratedWinnner] = useState(null)

//     var [form,setForm] = useState(initialUserRequestForm)
//     var [canBeSubmitted,setCanBeSubmitted] = useState(false);
//     var [checkForm,setCheckForm] = useState(false)
//     var [sendSuccess,setSendSuccess] = useState(false);
//     var [sendFailure,setSendFailure] = useState(false);


//     // initial required api calls
//     useEffect(() =>
//     {
//         // console.log({isResultsTime});

//         axios.get("/offers/previousWinners").then((res) =>
//         {
//             console.log(res.data);
//             // var reve = res.data.reverse();
//             // console.log(reve);
//             setWinnersList(res.data)
//         })
//         .catch((err) =>
//         {
//             console.log("Error occured while fetching offers ..",err);
//         })

//         axios.get("/offerUsers/")
//         .then((res) =>
//         {
//             setParticipantsList(res.data)
//         })
//         .catch((err) =>
//         {
//             console.log("Error occured while fetching offeruser",err);
//         })

//         axios.get("offers/getTodaysOffer/")
//         .then((res) =>
//         {
//             setNextOffer(res.data)
//             console.log(res.data);
//         })
//         .catch((err) =>
//         {
//             console.log("Error occured while fetching today's offer",err);
//         })

//         axios.get("normalOffers/getActiveOffers")
//         .then((res) =>
//         {
//             setNormalOffers(res.data)
//         })
//         .catch((err) =>
//         {
//             console.log("Error while fetching normal offers..",err);
//         })
//     },[])

//     useEffect(()=>
//     {
//         console.log(day);
//         if(day === 'Yesterday')
//         {
//             console.log("fetching yesterday's winner");
//             var url = "/offers/getYesterdaysWinner"
//         }
//         else if (day === 'Today')
//         {
//             var url = "/offers/getTodaysWinner"
//         }
//         console.log("url: " + url);
//         axios.get(url)
//             .then((res) =>
//             {
//                 console.log(res.data);
//                 setPreviousWinner(res.data)
//             })
//             .catch((err) =>
//             {
//                 console.log("Error occured while fetching yesterday's winner",err);
//             })
//     },[day])

//     // updating time for every second
//     useEffect(() =>
//     {
//         var presentDate = new Date()
//         var presentTime = presentDate.getTime()
//         var declarationDate = new Date(presentDate - (presentDate % (1000 * 60 * 60 *24)) + (1000 * 60 * 60 * 17) - (1000 * 60 * 60 * 5.5))
//         var declarationTime = declarationDate.getTime()
//         console.log({presentDate});
//         console.log({presentTime});
//         console.log({declarationTime});
//         console.log({declarationDate});
//         var timeDiff = presentTime - declarationTime
//         console.log({timeDiff});
//         var hours = presentDate.getHours()
//         if(hours>=winnerDeclarationHour && hours<24)
//         {
//             if(timeDiff > 0 && timeDiff <= 22 * 1000)
//             {
//                 setStage({...initialStage,'isRunning':true})
//             }
//             else if(timeDiff > 0 && timeDiff <= (22 * 1000) + (1 * 60 * 1000))
//             {
//                 setStage({...initialStage,'isShowing':true})
//             }
//             else
//             {
//                 setStage({...initialStage,'isDeclaring':true})
//                 // setStage({...initialStage,'isNormal':true})
//                 setDay("Today")
//             }
//         }
//         else
//         {
//             setStage({...initialStage,'isNormal':true})
//             // setStage({...initialStage,'isRunning':true})
//             setDay("Yesterday");
//         }
//         if(hours>=winnerDeclarationHour)
//         {
//             var nextDate = new Date(presentDate.getTime() + (24 * 60 * 60 * 1000))
//             var nextDate = new Date(nextDate.getFullYear(),nextDate.getMonth(),nextDate.getDate(),17)
//         }
//         else
//         {
//             var nextDate = new Date(presentDate.getFullYear(),presentDate.getMonth(),presentDate.getDate(),17)
//         }

//         var diff = nextDate - presentDate;

//         var msec = diff;
//         var hh = Math.floor(msec / 1000 / 60 / 60);
//         msec -= hh * 1000 * 60 * 60;
//         var mm = Math.floor(msec / 1000 / 60);
//         msec -= mm * 1000 * 60;
//         var ss = Math.floor(msec / 1000);
//         msec -= ss * 1000;

//         var updateTime = setInterval(()=>
//         {
//             console.log("updating time");
//             checkIsSpinningTime(hh,mm,ss);
//             if(ss == 0)
//             {
//                 mm -= 1
//                 ss = 59
//             }
//             else
//             {
//                 ss -= 1
//             }
//             if (mm == -1)
//             {
//                 hh -= 1
//                 mm = 0
//             }
//             if(hh == -1)
//             {
//                 hh = 23
//                 mm = 59
//             }
//             setTimeRemaining(convertToTwoLetters(hh)+":"+(convertToTwoLetters(mm))+":"+(convertToTwoLetters(ss)));
//         },1000);

//         // globalsendTime = sendTime

//         var convertToTwoLetters = (time) =>
//         {
//             return time.toString().length==2?(time.toString()):("0"+time.toString())
//         }

//         var checkIsSpinningTime = () =>
//         {
//             if (hh == 0 && mm == 0 & ss == 0)
//             // if (true)
//             {
//                 console.log("its running time.. huhuhu..");
//                 clearInterval(updateTime);
//                 setStage({...resetStage,"isRunning":true});
//                 // setStage({...resetStage,"isWaiting":true});
//                 // setStage({...resetStage,"isShowing":true});
//             }
//         }
//     },[])

//     // clear interval if stage['isNormal'] == false
//     useEffect(() =>
//     {
//         console.log("stage changed..",stage);

//         // if(stage['isNormal'] === false)
//         // {
//         //     clearInterval(globalUpdateTime)
//         // }
//     },[stage])

//     //to show the Running screen only for 10 seconds
//     useEffect(() =>
//     {
//         if(stage['isRunning'])
//         {
//             axios.get("/offers/getTodaysWinner")
//             .then((res)=>{
//                 console.log(res.data);
//                 setGeneratedWinnner(res.data)
//             })
//             .catch((err)=>{
//                 console.log("Error occured while fetching generated winner");
//             })
//             setTimeout(()=>
//             {
//                 setStage({...resetStage,"isRunning":false,"isWaiting":true});
//             },10000)
//         }
//     },[stage])

//     //to show the waiting screen only for 12 seconds
//     useEffect(() =>
//     {
//         if(stage['isWaiting'])
//         {
//             setTimeout(()=>
//             {
//                 setStage({...resetStage,"isWaiting":false,"isShowing":true})
//             },12000)
//         }
//     },[stage])

//     // to show the showing screen only for 10 minutes
//     useEffect(() =>
//     {
//         if(stage['isShowing'])
//         {
//             setTimeout(()=>
//             {
//                 setStage({...resetStage,"isShowing":false,"isDeclaring":true})
//             // },10000)
//             },1*60*1000)
//         }
//     },[stage])

//     if(sendSuccess)
//     {
//       toast.success("Request Sent successfully",{position:toast.POSITION.BOTTOM_CENTER});
//     }

//     if(checkForm)
//     {
//       validate()
//       setCheckForm(false)
//     }


//     function validate()
//     {
//       if (form.nameErr=="" && form.phoneNumberErr=="" && form.noOfDaysErr=="")
//       {
//           console.log("can be submitted");
//           setCanBeSubmitted(true);
//       }
//       else
//       {
//           setCanBeSubmitted(false);
//       }
//     }

//     function handleChangeForm(event)
//     {
//         console.log(form);
//         if(event.target.id=="phoneNumber" || event.target.id=="noOfDays")
//         {
//             var l = event.target.value.length
//             var lc = event.target.value.charAt(l-1)
//             if(lc=='0' || lc=='1' || lc=='2' || lc=='3' || lc=='4' || lc=='5' || lc=='6' || lc=='7' || lc=='8' ||lc=='9')
//             {
//                 if(l<=10)
//                 {
//                     setForm({...form,[event.target.id]:event.target.value});
//                     validateForm(event.target.id,event.target.value)
//                 }
//             }
//             else
//             {
//                 setForm({...form,[event.target.id]:event.target.value.slice(0,l-1)})
//                 validateForm(event.target.id,event.target.value.slice(0,l-1))
//             }
//         }
//         else
//         {
//             setForm({...form,[event.target.id]:event.target.value});
//             validateForm(event.target.id,event.target.value)
//             console.log(form);
//         }
//         setCheckForm(true)
//     }

//     function
//     validateForm(field,value)
//     {
//         //console.log(field,value);
//         switch(field)
//         {
//         case 'name':
//             if(value.length<3)
//             setForm({...form,nameErr:"Name should contain atleast 3 characters",name:value})
//             else if (!value.match(/^[a-zA-Z ]{3,}$/gm))
//             {
//             setForm({...form,nameErr:"Name should only contain characters",name:value})
//             //console.log("Iam here",form)
//             }
//             else
//             setForm({...form,nameErr:"",name:value})
//             break
//         case 'phoneNumber':
//             if (value.length == 0)
//                 setForm({...form,phoneNumberErr:"Enter Phone Number",phoneNumber:value})
//             else if(value.length != 10)
//                 setForm({...form,phoneNumberErr:"Phone Number should contain exactly 10 digits",phoneNumber:value})
//             else
//                 setForm({...form,phoneNumber:value,phoneNumberErr:""})
//             break
//         case "noOfDays":
//             if(value.length==0)
//             setForm({...form,noOfDaysErr:"Enter Number Of Days",noOfDays:value})
//             else if(value<30)
//             setForm({...form,noOfDaysErr:"Minimum Number of Days is 30",noOfDays:value})
//             else
//             setForm({...form,noOfDaysErr:"",noOfDays:value})
//             break
//         }
//     }

//     function sendRequest(){
//         console.log("sending request..");
//         axios.post("/userRequests/add",form)
//         .then((res) =>{
//             if(res.data.status)
//             {
//                 toast.success("OfferUser updated successfully",{position:toast.POSITION.BOTTOM_CENTER});
//                 setForm(initialUserRequestForm)
//                 console.log("added successfully");
//             }
//             else
//             {
//                 toast.warning("Phone Number Already Exists",{position:toast.POSITION.BOTTOM_CENTER});
//                 console.log("phone Number already exists");
//             }
//         })
//         .catch((err) =>{
//             toast.error("Something went wrong, Please try again",{position:toast.POSITION.BOTTOM_CENTER});
//             console.log("Error occured while adding user Request..",err);
//         })
//     }

//     // if(sendSuccess)
//     // {
//     //   toast.success("Request Sent successfully",{position:toast.POSITION.BOTTOM_CENTER});
//     // }

//     // if(sendFailure)
//     // {
//     //     toast.error("Something went wrong, please try again",{position:toast.POSITION.BOTTOM_CENTER});
//     // }



//     return <div className="offers-page">
//             {stage['isRunning'] === true?<GeneratingWinnerResponse/>
//             :stage['isWaiting'] && generatedWinner ?<WaitingTimeContainer winnerPhoneNumber={generatedWinner.winnerPhoneNumber}/>
//             :stage['isShowing']?<ShowResult winner={generatedWinner}/>
//             :<div className="container">
//                 <div className="top-heading">
//                     <div className="csm-heading">
//                         <b><img className="csm-logo" src="images/offers/csm-logo.jpg"/> CITY SUPER MARKET</b>
//                     </div>
//                     <div className="one-rupee-heading">
//                         <b className="">ONE RUPEE OFFER</b>
//                     </div>
//                     <p className="description">Just pay 30 Rupees to be a member of this offer for 1 month</p>
//                 </div>
//                 <div className="normal-offers-container">
//                 <h5>Special offers only for you</h5>
//                 <div id="offer-carousel" className="carousel slide" data-ride="carousel">
//                         <div className="carousel-inner">
//                             {normalOffers && normalOffers.slice(0).reverse().map((offer,index) =>
//                                 {
//                                     return <div className={index == 0?"carousel-item active":"carousel-item"} key={index}>
//                                         <OfferComponent offer={offer}/>
//                                     </div>
//                                 })
//                             }
//                         </div>
//                         <a className="carousel-control-prev"  href="#offer-carousel" role="button" data-slide="prev">
//                         <span className="carousel-control-prev-icon" aria-hidden="true"></span>
//                             <span className="sr-only">Previous</span>
//                         </a>
//                         <a className="carousel-control-next"  href="#offer-carousel" role="button" data-slide="next">
//                         <span className="carousel-control-next-icon" aria-hidden="true"></span>
//                             <span className="sr-only">Next</span>
//                         </a>
//                     </div>
//                 </div>
//                 {stage['isDeclaring']?
//                 // previousWinner && <CongratulationsContainer winnerName={previousWinner.winnerName}/>
//                 <></>
//                 //
//                 :
//                     <div className="timmer">
//                         <p className="winner-declaration-heading">Today's winner will be declared in</p>
//                         <Digits numbers={timeRemaining}/>
//                     </div>
//                     // )
//                 }
//                 {/* <hr/> */}
//                 <div className="next-offer">
//                     <h5 className="section-heading">Today's offer</h5>
//                     <div className="next-offer-div">
//                         <div className="next-offer-product-image offer-product-image">
//                             {nextOffer ? <img src={nextOffer.image}/>:<BiImage className="no-image vertical-center"/>}
//                         </div>
//                         {nextOffer?<div className="offer-details">
//                             <p className="product-name">{nextOffer?nextOffer.productName:""}</p>
//                             <p className="product-description">{nextOffer?nextOffer.description:""}</p>
//                             <p className="product-worth">RS {nextOffer?nextOffer.worth:""}</p>
//                         </div>:<div>
//                             <p className="product-name">No Offer</p>
//                             </div>}
//                     </div>
//                 </div>
//                 <div className="winner-container">
//                     <h5 className="section-heading">{day}'s Winner</h5>
//                     <WinnerComponent winner={previousWinner} singleDay={true}/>
//                 </div>
//                 <div className="winner-list-container">
//                     <h5 className="section-heading">Previous Winners</h5>
//                     {<div id="previous-winners-carousel" className="carousel slide" data-ride="carousel">
//                         <div className="carousel-inner">
//                             {winnersList.slice(0).reverse().map((winner,index) =>{
//                                     return <div key={index} className={index == 0?"carousel-item active":"carousel-item"}>
//                                     <WinnerComponent winner={winner} singleDay={false}/>
//                                 </div>
//                             })}
//                         </div>
//                         <a className="carousel-control-prev" href="#previous-winners-carousel" role="button" data-slide="prev">
//                         <span className="carousel-control-prev-icon" aria-hidden="true"></span>
//                             <span className="sr-only">Previous</span>
//                         </a>
//                         <a className="carousel-control-next" href="#previous-winners-carousel" role="button" data-slide="next">
//                         <span className="carousel-control-next-icon" aria-hidden="true"></span>
//                             <span className="sr-only">Next</span>
//                         </a>
//                     </div>}
//                 </div>
//                 <div className="offer-user-request-form">
//                     <form className="admin-form offer-user-request-form" onSubmit={(e) =>{e.preventDefault();}}>
//                         <p className="offerUserRequestForm-title">Send Request</p>
//                         <p className="offerUserRequest-description">Send us a request to be a part of this offer</p>
//                         <div className="form-group">
//                             <label for="name">Name</label>
//                             <input type="text" className="form-control name" id="name" onChange={handleChangeForm} value={form.name} placeholder=""/>
//                             { form.nameErr.length>0 && form.nameErr!="init" && <p className="adminErr err">{form.nameErr}</p>}
//                         </div>
//                         <div className="form-group" >
//                             <label for="phoneNumber">Phone Number</label>
//                             <input type="text" className="form-control phoneNumber"  onChange={handleChangeForm} id="phoneNumber" value={form.phoneNumber}/>
//                             { form.phoneNumberErr.length>0 && form.phoneNumberErr!="init" && <p className="adminErr err">{form.phoneNumberErr}</p>}
//                         </div>
//                         <div className="form-group" >
//                             <label for="productDiscount">Number of Days</label>
//                             <input type="text" className="form-control productDiscount"  onChange={handleChangeForm} id="noOfDays" value={form.noOfDays}/>
//                             { form.noOfDaysErr.length>0 && form.noOfDaysErr!="init" &&  <p className="adminErr err">{form.noOfDaysErr}</p>}
//                         </div>
//                         { canBeSubmitted?<button type="button" className="btn btn-primary"  onClick={sendRequest}>Send Request</button>:<button type="button" className="btn btn-primary" disabled>Send Request</button>}
//                     </form>
//                 </div>
//             </div> }
//         </div>
// }


// function WinnerComponent(props)
// {
//     return <div className="winner-component">
//         <div className="winner-div">
//             <div className="winner-image offer-product-image">
//                 {
//                 props.winner && props.winner.winnerImage ? <img src={props.winner.winnerImage}></img> :
//                 <BiImage className="no-image"/>
//                 }
//             </div>
//             <div className="winner-details">
//                 <div className="winner-name">{props.winner && props.winner.winnerName}</div>
//                 {props.singleDay && props.winner && !props.winner.winnerImage && <div className="winner-phoneNumber">{props.winner && props.winner.winnerPhoneNumber}</div>}
//                 <div className="winner-date">{props.winner && props.winner.date.slice(0,10)}</div>
//             </div>
//         </div>
//      </div>
// }

// function OfferComponent(props)
// {
//     if(props.offer)
//     return <div className="winner-component">
//         <div className="winner-div">
//             <div className="winner-image offer-product-image">
//                 {
//                 props.offer && props.offer.image ? <img src={props.offer.image}></img> :
//                 <BiImage className="no-image"/>
//                 }
//             </div>
//             <div className="winner-details">
//                 <div className="product-name">{props.offer && props.offer.productName}</div>
//                 <p className="product-description">{props.offer && props.offer.description}</p>
//                 {/* <div className="winner-date">{props.offer && props.offer.price}</div> */}
//                 <div className="price">
//                     <p className="product-worth item-priceAfterDiscount col-6">RS {props.offer && props.offer.retailPrice>0 && props.offer.retailPrice}</p>
//                     {props.offer &&  props.offer.price>0 && <p className="item-price col-6">RS {props.offer.price}</p>}
//                 </div>
//             </div>
//         </div>
//      </div>
// }


// function Digits(props)
// {
//     if(props.numbers.length !== 10)
//     {
//         return <div className="digits">
//         {props.numbers.split("").map((number,i) =>
//         {
//             if(number === ":")
//                 return ":"
//             return <div className="digit" key={i}>
//                 <p>{number}</p>
//             </div>
//         })}
//         </div>
//     }
//     else
//     {
//         return <div className="phoneNumberDigits">
//             <h1>{props.numbers}</h1>
//         </div>
//     }
// }

// function CongratulationsContainer(props)
// {
//     return (
//     <div className="congratulations-container">
//         <div>
//             <img className="bouquet-image" src="images/offers/gift.gif"/>
//         </div>
//         <p className="congrats-message">Congratulations</p>
//         <p className="winner-name">{props && props.winnerName && props.winnerName}</p>
//     </div>)

// }

// function GeneratingWinnerResponse()
// {
//     return <div className="generating-winner-container">
//          <img src="images/offers/running.gif"></img>
//          <div className="generating-text">
//             Declaring Winner
//          </div>
// </div>
// }

// function WaitingTimeContainer(props)
// {
//     console.log(props.winnerPhoneNumber)
//     var winnerPhoneNumber = []
//     for(var i=0;i<props.winnerPhoneNumber.length;i++)
//     {
//         winnerPhoneNumber.push(props.winnerPhoneNumber[i]);
//     }
//     console.log({winnerPhoneNumber});
//     var [revealedNumber,setRevealedNumber] = useState([0,0,0,0,0,0,0,0,0,0])

//     useEffect( () =>
//     {
//         console.log('re-rendering...');
//         // for (var i=0;i<10;i++)
//         //     {
//                 var i = 0
//                 var revealNumberSlowly = setInterval(()=>
//                 {
//                     var j = Math.floor(Math.random() * (10));
//                     var nums = revealedNumber
//                     nums[i] = j
//                     console.log(revealedNumber);
//                     setRevealedNumber([...nums])
//                 },50);

//                 var changeIndex = setInterval(()=>
//                 {
//                     var nums = revealedNumber
//                     nums[i] = winnerPhoneNumber[i]
//                     setRevealedNumber([...nums])
//                     i += 1
//                     // clearInterval(revealNumberSlowly)
//                 },1000)

//                 setTimeout(() =>
//                 {
//                     clearInterval(revealNumberSlowly)
//                     clearInterval(changeIndex);
//                 },10000)

//             // }

//         // var revealWinner = async () =>
//         // {

//         // }
//     },[])

//     useEffect(() =>
//     {
//         console.log("number revealed");
//     },[revealedNumber])

//     return <div className="waiting-time-container">
//         <div className="winnner-phone-number">
//             {revealedNumber.map((number,i) =>
//             {
//                 return <div key={i} className="winner-each-number">{number?number:"-"}</div>
//             })}
//         </div>
//         <img src="images/offers/working.gif"></img>
//     </div>
// }

// function ShowResult(props)
// {
//     return <div className="showing-time-container">
//         <Confetti numberOfPieces={100}></Confetti>
//         <img className="bouquet-image" src="images/offers/success.gif"/>
//         <div className="congrats-message">
//             <p>Congratulations</p>
//         </div>
//         <div className="winner">
//             <p>{props.winner.winnerName}</p>
//         </div>
//     </div>
// }



// export default OffersPage