import axios from "axios";
import React,{useEffect, useState} from "react";
import "../css/AdminLoginStylesheet.css";
import {useNavigate} from "react-router-dom";
import Footer from "./footer";
import Header from "./Header.component";
import video from "../videos/bipin.mp4";
// face recognition
import * as faceapi from "face-api.js";
import { useRef } from "react";
import "../css/AdminLoginStylesheet.css"

// adminLogin with face-recogization
function AdminLogin()
{
    var navigate = useNavigate();
    var [adminId,setAdminId] = useState();
    var [adminIdErr,setAdminIdErr] = useState("init");
    var [adminPassword,setAdminPassword] = useState();
    var [adminPasswordErr,setAdminPasswordErr] = useState("init")
    var [checkForm,setCheckForm] = useState(true);
    var [disableLoginButton,setDisableLoginButton] = useState(true);
    var videoRef = useRef();
    var videoStream;
    var streamVideo
    var [faceRecognitionError,setFaceRecognitionError] = useState("");
    var [faceRecognitionSuccessMsg,setFaceRecognitionSuccessMsg] = useState("");
    var [hideLoader,setHideLoader] = useState("none");
    var [loginFailed,setLoginFailed] = useState(false);

    useEffect(()=>
    {
      localStorage.removeItem("token");
      localStorage.removeItem("admin");
      localStorage.removeItem("user");
      Promise.all([
        faceapi.nets.faceRecognitionNet.loadFromUri(process.env.PUBLIC_URL+'/models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
        faceapi.nets.ssdMobilenetv1.loadFromUri('/models') //heavier/accurate version of tiny face detector
    ]).then(start)

    return  () => {
      console.log("last");
      streamVideo.getTracks().forEach(function(track) {
        track.stop();
      });
      
    }

    },[]);

    async function start() {
      // document.body.append('Models Loaded')
      
      videoStream = await navigator.getUserMedia(
          { video:{} },
          stream => {videoRef.current.srcObject = stream
            streamVideo = stream
            console.log(streamVideo);
            },
          err => console.error(err)
      )

     
      //video.src = '../videos/speech.mp4'
      console.log('video added')
      // recognizeFaces()
  }
  
  // async function recognizeFaces() {
  
  //     const labeledDescriptors = await loadLabeledImages()
  //     console.log(labeledDescriptors)
  //     const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, 0.55)
  
  
  //     video.addEventListener('play', async () => {
  //         console.log('Playing')
  //         const canvas = faceapi.createCanvasFromMedia(video)
  //         document.body.append(canvas)
  
  //         const displaySize = { width: video.width, height: video.height }
  //         faceapi.matchDimensions(canvas, displaySize)
  
          
  
  //         setInterval(async () => {
  //             const detections = await faceapi.detectAllFaces(video).withFaceLandmarks().withFaceDescriptors()
  
  //             const resizedDetections = faceapi.resizeResults(detections, displaySize)
  
  //             canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
  
  //             const results = resizedDetections.map((d) => {
  //                 return faceMatcher.findBestMatch(d.descriptor)
  //             })
  //             results.forEach( (result, i) => {
  //                 const box = resizedDetections[i].detection.box
  //                 const drawBox = new faceapi.draw.DrawBox(box, { label: result.toString() })
  //                 drawBox.draw(canvas)
  //             })
  //         }, 100)
  
  
          
  //     })
  // }

  function handleRetry()
  {
    setLoginFailed(false);
    window.location.reload();
  }
  
  
  function loadLabeledImages() {
      //const labels = ['Black Widow', 'Captain America', 'Hawkeye' , 'Jim Rhodes', 'Tony Stark', 'Thor', 'Captain Marvel']
      const labels = ['Vasu'] // for WebCam
      return Promise.all(
          labels.map(async (label)=>{
              const descriptions = []
              for(let i=1; i<=5; i++) {
                  const img = await faceapi.fetchImage(`../labeled_images/${label}/${i}.jpg`)
                  const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
                  console.log(label + i + JSON.stringify(detections))
                  descriptions.push(detections.descriptor)
              }
              // document.body.append(label+' Faces Loaded | ')
              return new faceapi.LabeledFaceDescriptors(label, descriptions)
          })
      )
  }


  async function handleVideoStreaming()
  {
    const labeledDescriptors = await loadLabeledImages()
    // console.log(labeledDescriptors)
    const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, 0.55)
    console.log('Playing')
    const video = document.getElementById("videoInput");
    const canvas = faceapi.createCanvasFromMedia(video)
    // canvas.style={"position":"absolute"}
    // document.body.append(canvas)

    const displaySize = { width: video.width, height: video.height }
    faceapi.matchDimensions(canvas, displaySize)

    var recognized_results = []
    var no_of_times_face_recognised = 0 
    var no_of_times_face_not_recognised = 0
    var recognizeFaces = setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video).withFaceLandmarks().withFaceDescriptors()

    const resizedDetections = faceapi.resizeResults(detections, displaySize)

    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)

    const results = resizedDetections.map((d) => {
        return faceMatcher.findBestMatch(d.descriptor)
    })


    if(results.length==0)
    {
      setFaceRecognitionError("No Face Detected")
    }
    else if(results.length>1)
    {
      setFaceRecognitionError("Multiple Faces Detected")
    }
    else 
    {
      setFaceRecognitionError("")
      if(results[0]._label=="Vasu")
        no_of_times_face_recognised+=1;
      else
        no_of_times_face_not_recognised+=1;

      recognized_results.push(results[0]._label)
    }

    
    if(no_of_times_face_not_recognised+no_of_times_face_recognised==10)
    {
      console.log(recognized_results);
      clearInterval(recognizeFaces);
      if(no_of_times_face_recognised/10>=0.8)
      {
        var admin = 
        {
          emailId:"admin@citysupermarket.com",
          password:"IamSuperAdmin@123"
        }
        axios.post("/users/loginAdmin",admin)
        .then((res)=>
        {
          if(res.data.success==true)
          {
            console.log("login success");
            localStorage.setItem("token",res.data.token);
            localStorage.setItem("admin",res.data.admin);
            setFaceRecognitionSuccessMsg("Logging in please wait");
            setHideLoader("block");
            setTimeout(()=>
            {
              navigate("/adminHome"); 
            },1000);
          }
          else
          {
            console.log("invalid credentials");
            setAdminPasswordErr(res.data.msg);
          }  
        })
        .catch((err)=>
        {
          console.log("Error occured while logging in the admin:"+err);
        })
      }
      else
      {
        console.log("login failed");
        setFaceRecognitionError("Login Failed");
        setLoginFailed(true);
      }
      
    
    }
    
    console.log(faceRecognitionError);
    
    

    // results.forEach( (result, i) => {
    //     console.log("person is identified as "+result);
    //     // const box = resizedDetections[i].detection.box
    //     // const drawBox = new faceapi.draw.DrawBox(box, { label: result.toString() })
    //     // drawBox.draw(canvas)
    //   })
    }, 200)

    // recognizeFaces(); 
  }



    function handleAdminIdChange(event)
    {
      //console.log(event.target.value)
      setAdminId(event.target.value);

      if(event.target.value.length==0)
        setAdminIdErr("Enter EmailId")
      else if(!event.target.value.match(/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/))
        setAdminIdErr("Invalid EmailId")
      else
        setAdminIdErr("")
      setCheckForm(true)

      if(adminIdErr=="" && adminPasswordErr=="")
        setDisableLoginButton(false)
      else
        setDisableLoginButton(true)

    }

    function handleChangePassword(event)
    {
      //console.log(event.target.value)
      setAdminPassword(event.target.value);
      if(event.target.value.length==0)
        setAdminPasswordErr("Enter Password")
      else
        setAdminPasswordErr("");
      setCheckForm(true);

      if(adminIdErr=="" && adminPasswordErr=="")
        setDisableLoginButton(false)
      else
        setDisableLoginButton(true)
    }

    
    function handleOnSubmit(event)
    {
      event.preventDefault();
      var admin = 
      {
        emailId:adminId,
        password:adminPassword
      }
      axios.post("/users/loginAdmin",admin)
      .then((res)=>
      {
        if(res.data.success==true)
        {
          //console.log("login success");
          localStorage.setItem("token",res.data.token);
          localStorage.setItem("admin",res.data.admin);
          navigate("../adminHome");
        }
        else
        {
          console.log("invalid credentials");
          setAdminPasswordErr(res.data.msg);
        }
          
      })
      .catch((err)=>
      {
        console.log("Error occured while logging in the admin:"+err);
      })
    }

    return (<div style={{textAlign:"center",height:"90vh"}}>
        <p className="">Please look into the camera</p>
        <video ref={videoRef} type="video/mp4" height="500" width="500" id="videoInput" onPlay={handleVideoStreaming} autoPlay muted  style={{borderRadius:"10px"}}></video>
        <p className="err-msg" style={{fontWeight:"500",color:"red"}}>{faceRecognitionError}</p>
        <p className="success-msg" style={{fontWeight:"500",color:"green"}}>
          {/* <p className="loader" style={{display:hideLoader}}></p>  */}
          {faceRecognitionSuccessMsg}</p>
        {loginFailed && <button className="btn btn-primary" onClick={handleRetry}>Retry</button>}
    </div>)
    
}

export default AdminLogin;


// return (
//   <div className="admin-panel">
//     {/* <Header/> */}
//     <div className="admin">
//       <form className="admin-form admin-login-form" onSubmit={handleOnSubmit}>
//         <div class="form-group">
//           {/* <label for="username">Admin Id</label> */}
//           <input type="text" className="form-control" id="adminId" aria-describedby="emailHelp" placeholder="Email Id" onChange={handleAdminIdChange} value={adminId}/>
//           {adminIdErr.length>0 && adminIdErr!="init" && <p className="err">{adminIdErr}</p>}
//         </div>
//         <div class="form-group">
//           {/* <label for="exampleInputPassword1">Password</label> */}
//         <input type="password" className="form-control" id="adminPassword" placeholder="Password" onChange={handleChangePassword} value={adminPassword}/>
//         {adminPasswordErr.length>0 && adminPasswordErr!="init" && <p className="err">{adminPasswordErr}</p>}
//         </div>
//         <button type="submit" className="btn btn-primary" disabled={disableLoginButton}>Login</button>
//       </form>

//     </div>
//     {/* <Footer/> */}
    

//   </div>
//   )