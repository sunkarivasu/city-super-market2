import Header from "./components/Header.component.js";
import { BrowserRouter as Router ,Route,Routes} from "react-router-dom";
import Home from "./components/Home.component";
import "./css/App.css";
// import Footer from "./components/footer";
import CategoryItems from "./components/categoryItems";
import ProductDescription from "./components/ProductDescription.jsx";
// import LoginOrRegister from "./components/LoginOrRegister.component.js";
import Cart from "./components/Cart.component";
import Orders from "./components/Orders.component";
import AdminLogin from "./components/AdminLogin.component";
import AdminHome from "./components/AdminHome.component";
import AdminAddProduct from "./components/AdminAddProduct.component";
import AdminUpdateProduct from "./components/AdminUpdateProduct.component.js";
import AdminDeleteProduct from "./components/AdminDeleteProduct.component.js";
import AdminTest from "./components/AdminTest.component.js";
import CheckOutPage from "./components/CheckOut.component.js";
import PaymentCheckOutPage from "./components/PaymentCheckOut.component.js";
import PaymentSuccessPage from "./components/PaymentSuccess.component.js"
import PaymentFailurePage from "./components/PaymentFailure.component.js"



function App() {
  return(
        <Router>
          <div className="main-container">
            <Routes>
              {/* admin routes */}
              <Route path="/adminTest" element={<AdminTest/>}/>
              <Route path="/adminAddProduct" element={<AdminAddProduct/>}/>
              {/* <Route path="/adminAddCategory" element={<AdminAddCategory/>}/> */}
              <Route path="/adminUpdateProduct" element={<AdminUpdateProduct/>}/>
              <Route path="/adminDeleteProduct" element={<AdminDeleteProduct/>}/>
              <Route path="/adminLogin" element={<AdminLogin/>}/>
              <Route path="/adminHome"  element={<AdminHome/>}/>

              {/* user routes */}
              <Route path="/" element={<Home/>}/>
              <Route path="/viewAll/:categoryName" element={<CategoryItems/>}/>
              <Route path="/productDescription/:id" element={<ProductDescription/>}/>
              {/* <Route path="/login" element={<LoginOrRegister/>}/> */}
              <Route path="/cart" element={<Cart/>}/>
              <Route path="/order" element={<Orders/>}/>
              <Route path="/checkOut" element={<CheckOutPage/>}/>
              <Route path="/paymentCheckOut" element={<PaymentCheckOutPage/>}/>

              {/* payments routes */}
              <Route path="/PAYMENTSUCCESS" element={<PaymentSuccessPage/>}/>
              <Route path="/PAYMENTFAILURE" element={<PaymentFailurePage/>}/>



            </Routes>
          </div>
        </Router>);
}

export default App;
