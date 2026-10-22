import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Image,
  Alert,
} from "react-bootstrap";

import { CaptainDataContext } from "../context/CaptainContext";

const CaptainLogin = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { setCaptain } = useContext(CaptainDataContext);

  const navigate = useNavigate();
  const submitHandler = async (e) => {

    e.preventDefault();

    setError("");
    setLoading(true);

    const captainData = {
      email,
      password,
    };

    try {

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/captains/login`,
        captainData,{
          withCredentials:true,
        }
      );

      if (response.status === 200) {

        const data = response.data;
        console.log("Data token from login captain",data.token);
        setCaptain(data.captain);

        // localStorage.setItem("captainToken", data.token);
          localStorage.setItem("captainToken",data.token);
        navigate("/captain-home");
      }

    } catch (err) {

      console.log("Login Error:", err);

      setError(
        err.response?.data?.message ||
        "Invalid email or password. Please try again."
      );

    } finally {

      setLoading(false);

    }
  };


  return (

    <div
      className="min-vh-100 d-flex align-items-center"
      style={{
        backgroundColor: "#f5f7f5",
      }}
    >
      <Container fluid className="px-0">
        <Row className="g-0 min-vh-100">
          <Col
            lg={7}
            className="d-none d-lg-flex position-relative align-items-center"
            style={{
              backgroundImage: `
                linear-gradient(
                  90deg,
                  rgba(255,255,255,0.92),
                  rgba(255,255,255,0.35)
                ),
                url("/bgImage.png")
              `,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="position-relative px-5 ms-4">
              <Link to="/">
                <Image
                  src="/logo.png"
                  alt="GoRide"
                  width={165}
                  className="mb-5"
                />
              </Link>
              <h1
                className="fw-bold display-4 mb-3"
                style={{
                  color: "#10251e",
                  lineHeight: "1.05",
                }}
              >
                Drive With
                <br />
                GoRide
              </h1>
              <p
                className="text-secondary fs-5 mb-4"
                style={{
                  maxWidth: "530px",
                  lineHeight: "1.6",
                }}
              >
                Turn your driving time into earning time.
                Connect with riders, choose your trips and
                grow your earnings with GoRide.
              </p>
              <div className="d-flex gap-4">
                <div>
                  <h6
                    className="fw-bold mb-1"
                    style={{ color: "#168c35" }}
                  >
                    Earn More
                  </h6>
                  <small className="text-secondary">
                    Flexible earning
                  </small>
                </div>
                <div>
                  <h6
                    className="fw-bold mb-1"
                    style={{ color: "#168c35" }}
                  >
                    Drive Safely
                  </h6>
                  <small className="text-secondary">
                    Verified riders
                  </small>
                </div>
                <div>
                  <h6
                    className="fw-bold mb-1"
                    style={{ color: "#168c35" }}
                  >
                    Stay Flexible
                  </h6>
                  <small className="text-secondary">
                    Drive on your time
                  </small>
                </div>
              </div>
            </div>
          </Col>
          <Col
            lg={5}
            className="d-flex align-items-center justify-content-center bg-white"
          >
            <div
              className="w-100 px-4"
              style={{
                maxWidth: "480px",
              }}
            >
              <div className="d-lg-none text-center mb-4">
                <Link to="/">
                  <Image
                    src="/logo.png"
                    alt="GoRide"
                    width={145}
                  />
                </Link>
              </div>
              <Card className="border-0">
                <Card.Body className="p-4 p-xl-5">
                  <div className="mb-4">

                    <div
                      className="mb-2 fw-semibold"
                      style={{
                        color: "#168c35",
                        fontSize: "13px",
                      }}
                    >
                      CAPTAIN PORTAL
                    </div>

                    <h2
                      className="fw-bold mb-2"
                      style={{
                        color: "#10251e",
                      }}
                    >
                      Welcome Back, Captain
                    </h2>

                    <p className="text-secondary mb-0">
                      Login to manage your rides and earnings
                    </p>
                  </div>
                  {error && (

                    <Alert
                      variant="danger"
                      className="small"
                    >
                      {error}
                    </Alert>

                  )}
                  <Form onSubmit={submitHandler}>
                    <Form.Group className="mb-4">
                      <Form.Label className="fw-semibold">
                        Email address
                      </Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="email@gmail.com"
                        value={email}
                        onChange={(e) =>
                          setEmail(e.target.value)
                        }
                        required
                        size="lg"
                        className="rounded-3"
                      />
                    </Form.Group>
                    <Form.Group className="mb-4">
                      <div className="d-flex justify-content-between align-items-center">
                        <Form.Label className="fw-semibold mb-2">
                          Password
                        </Form.Label>
                        <Link
                          to="/captain-forgot-password"
                          className="small text-decoration-none"
                          style={{
                            color: "#168c35",
                          }}
                        >
                          Forgot password?
                       </Link>
                      </div>
                      <Form.Control
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) =>
                          setPassword(e.target.value)
                        }
                        required
                        size="lg"
                        className="rounded-3"
                      />

                    </Form.Group>
                    <Button
                      type="submit"
                      size="lg"
                      disabled={loading}
                      className="w-100 border-0 rounded-3 fw-semibold py-2"
                      style={{
                        backgroundColor: "#111111",
                      }}
                    >
                      {loading
                        ? "Logging in..."
                        : "Login as Captain"}
                    </Button>
                    <p className="text-center text-secondary mt-4 mb-0">

                      New to GoRide?{" "}

                      <Link
                        to="/captain-signup"
                        className="fw-semibold text-decoration-none"
                        style={{
                          color: "#168c35",
                        }}
                      >
                        Register as a Captain
                      </Link>
                    </p>
                  </Form>

                  {/* <div className="d-flex align-items-center my-4">

                    <div className="border-top"><hr /></div>

                    <span className="px-3 text-secondary small">
                      OR
                    </span>
                    <div className=" border-top "><hr /></div>
                  </div> */}
                  <Link
                    to="/login"
                    className="text-decoration-none"
                  >
                    <br />
                    <Button
                      variant="outline-success"
                      size="lg"
                      className="w-100 rounded-3 fw-semibold mt-1"
                    >
                      Sign in as User
                    </Button>
                      <br />
                  </Link>
                  <div className="text-center mt-4">

                    <Link
                      to="/"
                      className="small text-secondary text-decoration-none"
                    >
                      ← Back to GoRide
                    </Link>

                  </div>

                </Card.Body>

              </Card>

            </div>

          </Col>

        </Row>

      </Container>

    </div>
  );
};

export default CaptainLogin;
// import { useState } from "react";
// import React from "react";
// import { Link } from "react-router-dom";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { CaptainDataContext } from "../context/CaptainContext";
// const CaptainLogin = () => {
//     const[email,setEmail]=useState("");
//     const [password,setPassoword]=useState("");
//     const {captain,setCaptain}=React.useContext(CaptainDataContext);
//     const navigate=useNavigate();
//     const submitHandler=async(e)=>{
//       e.preventDefault();
//      const captain={
//         email,
//         password
//       }
//       try{
//         const response=await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/login`,captain)
//         if(response.status===200){
//           const data=response.data;
//           setCaptain(data.captain);
//           localStorage.setItem('captainToken',data.token);
//           navigate('/captain-home');
//         }
//       }catch(err){
//         console.log("Error :",err);
//       }
//       setEmail("");
//       setPassoword("");
//     }
//   return (
//     <div className="p-7 h-screen flex flex-col justify-between">
//       <div>
//         <img src="/image.jpg" alt="logo" />
//       <form onSubmit={(e)=>{submitHandler(e)}}>
//        <h3 className="text-lg font-medium">What's your email</h3>
//        <input onChange={(e)=>{setEmail(e.target.value)}} value={email}
//        className="  bg-[#eeeeee] mb-7 rounded px-4 py-2 border w-full text-lg"
//        required type="email" name="" placeholder="email@gmail.com" id="" />
//        <h3 className="text-lg font-medium">Enter Password</h3>
//        <input  className="bg-[#eeeeee] mb-7 rounded px-4 py-2 border w-full text-lg" type="password" onChange={(e)=>{setPassoword(e.target.value)}} value={password}placeholder="password" name="" id="" />
//        <button  className="bg-[#111] text-white font-semibold rounded px-4 py-2 mb-3 border w-full text-lg">Login</button>
//        <p>Join a fleet?<Link  to='/captain-signup' className='text-blue-600'>Register as a Captain</Link></p>
//       </form>
//       </div>
//       <div>
//         <Link to='/login' className="bg-[#10b461] mb-7 text-fff font-semibold rounded px-4 py-2 border w-full text-lg">Sign in as User</Link>
//       </div>
//     </div>
//   )
// }

// export default CaptainLogin