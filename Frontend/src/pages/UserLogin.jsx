import { useState,useContext } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { UserDataContext } from "../context/UserContext";
import axios from "axios";
const UserLogin = () => {
  const[email,setEmail]=useState("");
  const [password,setPassoword]=useState("");
  const [userData,setUserData]=useState({});
  const {user,setUser}=useContext(UserDataContext);
  const navigate=useNavigate();
  const submitHandler=async(e)=>{
    e.preventDefault();
    const userData={
      email,
      password
    }
    try{
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/login`,userData);
      if(response.status===200){
        const data=response.data;
        setUser(data.user);
        Navigate('/home');
      }
    }catch(err){
      console.log("Error",err);
    }
    setEmail("");
    setPassoword("");
  }
  return (
    <div className="p-7 h-screen flex flex-col justify-between">
      <div>
        <img src="logo.jpg" alt="logo" />
      <form onSubmit={(e)=>{submitHandler(e)}}>
       <h3 className="text-lg font-medium">What's your email</h3>
       <input onChange={(e)=>{setEmail(e.target.value)}} value={email}
       className="  bg-[#eeeeee] mb-7 rounded px-4 py-2 border w-full text-lg"
       required type="email" name="" placeholder="email@gamil.com" id="" />
       <h3 className="text-lg font-medium">Enter Password</h3>
       <input  className="bg-[#eeeeee] mb-7 rounded px-4 py-2 border w-full text-lg" type="password" onChange={(e)=>{setPassoword(e.target.value)}} value={password}placeholder="password" name="" id="" />
       <button  className="bg-[#111] text-white font-semibold rounded px-4 py-2 mb-3 border w-full text-lg">Login</button>
       <p>New here?<Link  to='/signup' className='text-blue-600'>Create new Account</Link></p>
      </form>
      </div>
      <div>
        <Link to='/captain-login' className="bg-[#10b461] mb-7 text-fff font-semibold rounded px-4 py-2 border w-full text-lg">Sign in as Captain</Link>
      </div>
    </div>
  )
}

export default UserLogin;