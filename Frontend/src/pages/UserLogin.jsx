import { useState, useContext } from "react";
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

import { UserDataContext } from "../context/UserContext";

const UserLogin = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { setUser } = useContext(UserDataContext);
  const navigate = useNavigate();
  const submitHandler = async (e) => {

    e.preventDefault();

    setError("");
    setLoading(true);

    const userData = {
      email,
      password,
    };

    try {

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/login`,
        userData,
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {

        const data = response.data;

        setUser(data.user);

        // localStorage.setItem("userToken", data.token);
        localStorage.setItem("userToken",data.token);
        navigate("/home");
      }

    } catch (err) {

      console.log("Error:", err);

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

            <div className="position-absolute top-0 w-100 h-100">
            </div>
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
                Your Ride,
                <br />
                Just a Tap Away
              </h1>
              <p
                className="text-secondary fs-5 mb-4"
                style={{
                  maxWidth: "530px",
                  lineHeight: "1.6",
                }}
              >
                Book your ride in seconds and get to your destination
                safely, comfortably, and on time.
              </p>
              <div className="d-flex gap-4">
                <div>
                  <h6
                    className="fw-bold mb-1"
                    style={{ color: "#168c35" }}
                  >
                    Safe
                  </h6>
                  <small className="text-secondary">
                    Verified drivers
                  </small>
                </div>
                <div>
                  <h6
                    className="fw-bold mb-1"
                    style={{ color: "#168c35" }}
                  >
                    Affordable
                  </h6>
                  <small className="text-secondary">
                    Transparent pricing
                  </small>
                </div>
                <div>
                  <h6
                    className="fw-bold mb-1"
                    style={{ color: "#168c35" }}
                  >
                    Reliable
                  </h6>
                  <small className="text-secondary">
                    Always on time
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
                    <h2
                      className="fw-bold mb-2"
                      style={{
                        color: "#10251e",
                      }}
                    >
                      Welcome Back
                    </h2>
                    <p className="text-secondary mb-0">
                      Login to your GoRide account
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
                        onChange={(e) => setEmail(e.target.value)}
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
                          to="/forgot-password"
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
                        onChange={(e) => setPassword(e.target.value)}
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
                      {loading ? "Logging in..." : "Login"}
                    </Button>
                  <p className="text-center text-secondary mt-4 mb-0">
                      Don't have an account?{" "}
                      <Link
                        to="/signup"
                        className="fw-semibold text-decoration-none"
                        style={{
                          color: "#168c35",
                        }}
                      > Create Account</Link>
                    </p>
                  </Form>
                  <br />
                  <Link
                    to="/captain-login"
                    className="text-decoration-none"
                  >
                    <br></br>
                    <Button
                      variant="outline-success"
                      size="lg"
                      className="w-100 rounded-3 fw-semibold mt-1"
                    >
                      Sign in as Captain
                    </Button>
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

export default UserLogin;




























// import { useState,useContext } from "react";
// import { Link } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
// import { UserDataContext } from "../context/UserContext";
// import axios from "axios";
// const UserLogin = () => {
//   const[email,setEmail]=useState("");
//   const [password,setPassoword]=useState("");
//   const [userData,setUserData]=useState({});
//   const {user,setUser}=useContext(UserDataContext);
//   const navigate=useNavigate();
//   const submitHandler=async(e)=>{
//     e.preventDefault();
//     const userData={
//       email,
//       password
//     }
//     try{
//       const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/login`,userData, {
//         withCredentials: true
//     });
//       if(response.status===200){
//         const data=response.data;
//         setUser(data.user);
//         localStorage.setItem('userToken',data.token);
//         navigate('/home');
//       }
//     }catch(err){
//       console.log("Error",err);
//     }
//     setEmail("");
//     setPassoword("");
//   }
//   return (
//     <div className="p-7 h-screen flex flex-col justify-between">
//       <div>
//         <img src="/image.png" style={{width:"70px"}} alt="logo" />
//       <form onSubmit={(e)=>{submitHandler(e)}}>
//        <h3 className="text-lg font-medium">What's your email</h3>
//        <input onChange={(e)=>{setEmail(e.target.value)}} value={email}
//        className="  bg-[#eeeeee] mb-7 rounded px-4 py-2 border w-full text-lg"
//        required type="email" name="" placeholder="email@gmail.com" id="" />
//        <h3 className="text-lg font-medium">Enter Password</h3>
//        <input  className="bg-[#eeeeee] mb-7 rounded px-4 py-2 border w-full text-lg" type="password" onChange={(e)=>{setPassoword(e.target.value)}} value={password}placeholder="password" name="" id="" />
//        <button  className="bg-[#111] text-white font-semibold rounded px-4 py-2 mb-3 border w-full text-lg">Login</button>
//        <p>New here?<Link  to='/signup' className='text-blue-600'>Create new Account</Link></p>
//       </form>
//       </div>
//       <div>
//         <Link to='/captain-login' className="bg-[#10b461] mb-7 text-fff font-semibold rounded px-4 py-2 border w-full text-lg">Sign in as Captain</Link>
//       </div>
//     </div>
//   )
// }

// export default UserLogin;