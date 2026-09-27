import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// import UserContext from "../context/UserContext";
import { UserDataContext } from '../context/UserContext'
const UserSignup = () => {
   const[email,setEmail]=useState("");
    const [password,setPassoword]=useState("");
    const[firstname,setFirstname]=useState("");
    const[lastname,setLastname]=useState("");
    const [userData,setUserData]=useState({});
    // const {user,setUser}=useContext(UserContext);
    const { user, setUser } = useContext(UserDataContext)
    const navigate=useNavigate();
    const submitHandler=async(e)=>{
      e.preventDefault();
      const newUser={
        fullname:{
         firstname: firstname,
      lastname:  lastname
        },
       email: email,
       password: password
       
      };
     try{ const response=await axios.post(`${import.meta.env.VITE_BASE_URL}/users/register`,newUser);
      if (response.status === 201) {
      const data = response.data
      setUser(data.user)
      localStorage.setItem('token', data.token)
      navigate('/home')
    }
      setEmail("");
      setPassoword("");
      setFirstname("");
      setLastname("");}
      catch(err){
        console.log("Error something went wrong");
      }
    }
  return (
   <div className="p-7 h-screen flex flex-col justify-between">
      <div>
       <img src="logo.jpg" alt="logo" />
      <form onSubmit={(e)=>{submitHandler(e)}}>
       <h3 className="text-lg font-medium">What's your name</h3>
       <div>
         <input onChange={(e)=>{setFirstname(e.target.value)}} value={firstname}
       className="  bg-[#eeeeee] mb-7 rounded px-4 py-2 border w-1/2 text-base placeholder:text-base"
       required type="text" name="" placeholder="Firstname" id="" />
        <input onChange={(e)=>{setLastname(e.target.value)}} value={lastname}
       className="  bg-[#eeeeee] mb-7 rounded px-4 py-2 border w-1/2 text-base placeholder:text-base"
       required type="text" name="" placeholder="Lastname" id="" />
       </div>
         <h3 className="text-lg font-medium">What's your email</h3>
       <input onChange={(e)=>{setEmail(e.target.value)}} value={email}
       className="  bg-[#eeeeee] mb-7 rounded px-4 py-2 border w-full text-lg placeholder:text-base"
       required type="email" name="" placeholder="email@gamil.com" id="" />
       <h3 className="text-lg font-medium">Enter Password</h3>
       <input  className="bg-[#eeeeee] mb-7 rounded px-4 py-2 border w-full text-lg" type="password" onChange={(e)=>{setPassoword(e.target.value)}} value={password}placeholder="password" name="" id="" />
       <button  className="bg-[#111]  font-semibold rounded px-4 py-2 mb-3 border w-full text-lg text-white">Signup</button>
       <p>Already have an account ?<Link  to='/login' className='text-blue-600'>Login here</Link></p>
      </form>
      </div>
      <div>
      <p className='text-[10px] leading-tight'>This site is protected by reCAPTCHA and the <span className='underline'>Google Privacy
            Policy</span> and <span className='underline'>Terms of Service apply</span>.</p>
      </div>
    </div>
  )
}

export default UserSignup