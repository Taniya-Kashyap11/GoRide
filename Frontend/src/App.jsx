import { Routes,Route } from "react-router-dom";
import Home from "./pages/Home";
import UserLogin from "./pages/userLogin"
import UserSignup from "./pages/userSignup"
import CaptainLogin from "./pages/captainLogin";
import CaptainSignup from "./pages/captainSignup";
function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Home/>}></Route>
           <Route path='/login' element={<UserLogin/>}></Route>
              <Route path='/signup' element={<UserSignup/>}></Route>
                 <Route path='/captain-login' element={<CaptainLogin/>}></Route>
                    <Route path='/captain-signup' element={<CaptainSignup/>}></Route>
      </Routes>
    </>
  )
}

export default App
