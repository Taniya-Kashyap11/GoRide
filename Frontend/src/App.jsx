import { Routes,Route } from "react-router-dom";
import Home from "./pages/Home";
import UserLogin from "./pages/userLogin";
import UserSignup from "./pages/userSIgnup";
import CaptainLogin from "./pages/captainLogin";
import CaptainSignup from "./pages/captainSignup";
import  LandingPage  from "./pages/LandingPage";
import UserProtectedWrapper from "./pages/UserProtectedWrapper";
import UserLogout from "./pages/UserLogout";
import CaptainHome from "./pages/CaptainHome";
import CaptainProtectWrapper from "./pages/CaptainProtectWrapper";
import MyRides from "./pages/MyRides";
import UserRides from "./pages/UserRides";
function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<LandingPage/>}></Route>
           <Route path='/login' element={<UserLogin/>}></Route>
              <Route path='/signup' element={<UserSignup/>}></Route>
                 <Route path='/captain-login' element={<CaptainLogin/>}></Route>
                    <Route path='/captain-signup' element={<CaptainSignup/>}></Route>
                    <Route path="/my-rides" element={<MyRides />} />
                    <Route path="/user-rides" element={<UserRides/>}></Route>
                    <Route path="/home" element={
                      <UserProtectedWrapper>
                        <Home/>
                      </UserProtectedWrapper>
                    }></Route>
                    <Route path="/logout" element={
                        <UserProtectedWrapper>
                        <UserLogout/>
                      </UserProtectedWrapper>
                    }>

                    </Route>
                      <Route path="/captain-home" element={
                        <CaptainProtectWrapper>
                             <CaptainHome/>
                        </CaptainProtectWrapper>
                     
                }></Route>
      </Routes>
    </>
  )
}

export default App
