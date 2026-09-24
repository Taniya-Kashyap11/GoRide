import { useState } from "react";
import { Link } from "react-router-dom";
const CaptainLogin = () => {
    const[email,setEmail]=useState("");
    const [password,setPassoword]=useState("");
    const [userData,setUserData]=useState({});
    const submitHandler=(e)=>{
      e.preventDefault();
      setUserData({
        email,
        password
      })
      setEmail("");
      setPassoword("");
    }
  return (
    <div className="p-7 h-screen flex flex-col justify-between">
      <div>
        <img src="" alt="logo" />
      <form onSubmit={(e)=>{submitHandler(e)}}>
       <h3 className="text-lg font-medium">What's your email</h3>
       <input onChange={(e)=>{setEmail(e.target.value)}} value={email}
       className="  bg-[#eeeeee] mb-7 rounded px-4 py-2 border w-full text-lg"
       required type="email" name="" placeholder="email@gamil.com" id="" />
       <h3 className="text-lg font-medium">Enter Password</h3>
       <input  className="bg-[#eeeeee] mb-7 rounded px-4 py-2 border w-full text-lg" type="password" onChange={(e)=>{setPassoword(e.target.value)}} value={password}placeholder="password" name="" id="" />
       <button  className="bg-[#111] text-fff font-semibold rounded px-4 py-2 mb-3 border w-full text-lg">Login</button>
       <p>Join a fleet?<Link  to='/captain-signup' className='text-blue-600'>Register as a Captain</Link></p>
      </form>
      </div>
      <div>
        <Link to='/login' className="bg-[#10b461] mb-7 text-fff font-semibold rounded px-4 py-2 border w-full text-lg">Sign in as User</Link>
      </div>
    </div>
  )
}

export default CaptainLogin