import { useContext, useState } from "react";
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

const UserSignup = () => {

  // ================= USER DETAILS =================

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");

  // ================= UI STATES =================

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { setUser } = useContext(UserDataContext);
  const navigate = useNavigate();


  // =================================================
  // SIGNUP HANDLER
  // =================================================

  const submitHandler = async (e) => {

    e.preventDefault();

    setError("");
    setLoading(true);

    const newUser = {
      fullname: {
        firstname,
        lastname,
      },
      email,
      password,
    };

    try {

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/register`,
        newUser,
        { withCredentials: true }
      );

      if (response.status === 201) {

        const data = response.data;

        setUser(data.user);

        localStorage.setItem("userToken", data.token);

        navigate("/home");
      }

    } catch (err) {

      console.log("Signup Error:", err);

      setError(
        err.response?.data?.message ||
        "Something went wrong. Please try again."
      );

    } finally {

      setLoading(false);

    }
  };


  return (

    /*
      IMPORTANT:
      The entire page is fixed to viewport height.
      Only the right side will scroll.
    */

    <div
      className="vh-100 overflow-hidden"
      style={{
        backgroundColor: "#f5f7f5",
      }}
    >

      <Container fluid className="p-0 h-100">

        <Row className="g-0 h-100">


          {/* =================================================
              LEFT SIDE
              FIXED / STICKY
          ================================================= */}

          <Col
            lg={7}
            className="d-none d-lg-block"
            style={{
              height: "100vh",
              position: "sticky",
              top: 0,
              overflow: "hidden",
            }}
          >

            <div
              className="h-100 d-flex align-items-center"
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

              <div className="px-5 ms-4">


                {/* ================= LOGO ================= */}

                <Link to="/">

                  <Image
                    src="/logo.png"
                    alt="GoRide"
                    width={165}
                    className="mb-5"
                  />

                </Link>


                {/* ================= HEADING ================= */}

                <h1
                  className="fw-bold display-4 mb-3"
                  style={{
                    color: "#10251e",
                    lineHeight: "1.05",
                  }}
                >

                  Start Your
                  <br />

                  Journey Today

                </h1>


                {/* ================= DESCRIPTION ================= */}

                <p
                  className="text-secondary fs-5 mb-4"
                  style={{
                    maxWidth: "530px",
                    lineHeight: "1.6",
                  }}
                >

                  Create your GoRide account and enjoy safe,
                  affordable and reliable rides whenever you need them.

                </p>


                {/* ================= FEATURES ================= */}

                <div className="d-flex gap-4">


                  {/* FEATURE 1 */}

                  <div>

                    <h6
                      className="fw-bold mb-1"
                      style={{
                        color: "#168c35",
                      }}
                    >
                      Easy Booking
                    </h6>

                    <small className="text-secondary">
                      Book in seconds
                    </small>

                  </div>


                  {/* FEATURE 2 */}

                  <div>

                    <h6
                      className="fw-bold mb-1"
                      style={{
                        color: "#168c35",
                      }}
                    >
                      Safe Rides
                    </h6>

                    <small className="text-secondary">
                      Verified drivers
                    </small>

                  </div>


                  {/* FEATURE 3 */}

                  <div>

                    <h6
                      className="fw-bold mb-1"
                      style={{
                        color: "#168c35",
                      }}
                    >
                      Great Prices
                    </h6>

                    <small className="text-secondary">
                      No hidden charges
                    </small>

                  </div>


                </div>

              </div>

            </div>

          </Col>


          {/* =================================================
              RIGHT SIDE
              ONLY THIS SIDE SCROLLS
          ================================================= */}

          <Col
            lg={5}
            xs={12}
            className="bg-white"
            style={{
              height: "100vh",
              overflowY: "auto",
            }}
          >

            <div
              className="d-flex justify-content-center"
              style={{
                minHeight: "100%",
                padding: "50px 30px",
              }}
            >

              <div
                className="w-100"
                style={{
                  maxWidth: "480px",
                }}
              >


                {/* ================= MOBILE LOGO ================= */}

                <div className="d-lg-none text-center mb-4">

                  <Link to="/">

                    <Image
                      src="/logo.png"
                      alt="GoRide"
                      width={145}
                    />

                  </Link>

                </div>


                {/* ================= SIGNUP CARD ================= */}

                <Card className="border-0">

                  <Card.Body className="p-0 p-xl-3">


                    {/* ================= HEADER ================= */}

                    <div className="mb-4">

                      <h2
                        className="fw-bold mb-2"
                        style={{
                          color: "#10251e",
                        }}
                      >
                        Create Your Account
                      </h2>

                      <p className="text-secondary mb-0">
                        Join GoRide and start riding today
                      </p>

                    </div>


                    {/* ================= ERROR ================= */}

                    {error && (

                      <Alert
                        variant="danger"
                        className="small"
                      >
                        {error}
                      </Alert>

                    )}


                    {/* ================= FORM ================= */}

                    <Form onSubmit={submitHandler}>


                      {/* ================= NAME ================= */}

                      <Row className="g-3 mb-3">


                        {/* FIRST NAME */}

                        <Col sm={6}>

                          <Form.Group>

                            <Form.Label className="fw-semibold">
                              First name
                            </Form.Label>

                            <Form.Control
                              type="text"
                              placeholder="First name"
                              value={firstname}
                              onChange={(e) =>
                                setFirstname(e.target.value)
                              }
                              required
                              size="lg"
                              className="rounded-3"
                            />

                          </Form.Group>

                        </Col>


                        {/* LAST NAME */}

                        <Col sm={6}>

                          <Form.Group>

                            <Form.Label className="fw-semibold">
                              Last name
                            </Form.Label>

                            <Form.Control
                              type="text"
                              placeholder="Last name"
                              value={lastname}
                              onChange={(e) =>
                                setLastname(e.target.value)
                              }
                              required
                              size="lg"
                              className="rounded-3"
                            />

                          </Form.Group>

                        </Col>


                      </Row>


                      {/* ================= EMAIL ================= */}

                      <Form.Group className="mb-3">

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


                      {/* ================= PASSWORD ================= */}

                      <Form.Group className="mb-4">

                        <Form.Label className="fw-semibold">
                          Password
                        </Form.Label>

                        <Form.Control
                          type="password"
                          placeholder="Create a password"
                          value={password}
                          onChange={(e) =>
                            setPassword(e.target.value)
                          }
                          required
                          size="lg"
                          className="rounded-3"
                        />

                        <Form.Text className="text-secondary">
                          Use at least 6 characters.
                        </Form.Text>

                      </Form.Group>


                      {/* ================= CREATE ACCOUNT ================= */}

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
                          ? "Creating account..."
                          : "Create Account"}

                      </Button>


                      {/* ================= LOGIN ================= */}

                      <p className="text-center text-secondary mt-4 mb-0">

                        Already have an account?{" "}

                        <Link
                          to="/login"
                          className="fw-semibold text-decoration-none"
                          style={{
                            color: "#168c35",
                          }}
                        >
                          Login here
                        </Link>

                      </p>


                    </Form>


                    {/* ================= DIVIDER ================= */}

                    <div className="d-flex align-items-center my-4">

                      <div className="flex-grow-1 border-top" />

                      <span className="px-3 text-secondary small">
                        OR
                      </span>

                      <div className="flex-grow-1 border-top" />

                    </div>


                    {/* ================= CAPTAIN LOGIN ================= */}

                    <Link
                      to="/captain-login"
                      className="text-decoration-none"
                    >

                      <Button
                        variant="outline-success"
                        size="lg"
                        className="w-100 rounded-3 fw-semibold"
                      >
                        Sign in as Captain
                      </Button>

                    </Link>


                    {/* ================= TERMS ================= */}

                    <p
                      className="text-center text-secondary mt-4 mb-0"
                      style={{
                        fontSize: "11px",
                        lineHeight: "1.5",
                      }}
                    >

                      By creating an account, you agree to our{" "}

                      <span className="text-decoration-underline">
                        Terms of Service
                      </span>{" "}

                      and{" "}

                      <span className="text-decoration-underline">
                        Privacy Policy
                      </span>.

                    </p>


                    {/* ================= BACK HOME ================= */}

                    <div className="text-center mt-3">

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

            </div>

          </Col>


        </Row>

      </Container>

    </div>
  );
};

export default UserSignup;
// import { useContext, useState } from "react";
// import { Link } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// // import UserContext from "../context/UserContext";
// import { UserDataContext } from '../context/UserContext'
// const UserSignup = () => {
//    const[email,setEmail]=useState("");
//     const [password,setPassoword]=useState("");
//     const[firstname,setFirstname]=useState("");
//     const[lastname,setLastname]=useState("");
//     const [userData,setUserData]=useState({});
//     // const {user,setUser}=useContext(UserContext);
//     const { user, setUser } = useContext(UserDataContext)
//     const navigate=useNavigate();
//     const submitHandler=async(e)=>{
//       e.preventDefault();
//       const newUser={
//         fullname:{
//          firstname: firstname,
//       lastname:  lastname
//         },
//        email: email,
//        password: password
       
//       };
//      try{ const response=await axios.post(`${import.meta.env.VITE_BASE_URL}/users/register`,newUser);
//       if (response.status === 201) {
//       const data = response.data
//       setUser(data.user)
//       localStorage.setItem('userToken', data.token);
//       navigate('/home')
//     }
//       setEmail("");
//       setPassoword("");
//       setFirstname("");
//       setLastname("");}
//       catch(err){
//         console.log("Error something went wrong");
//       }
//     }
//   return (
//    <div className="p-7 h-screen flex flex-col justify-between">
//       <div>
//        <img src="/image.png" style={{width:'40px'}} alt="logo" />
//       <form onSubmit={(e)=>{submitHandler(e)}}>
//        <h3 className="text-lg font-medium">What's your name</h3>
//        <div>
//          <input onChange={(e)=>{setFirstname(e.target.value)}} value={firstname}
//        className="  bg-[#eeeeee] mb-7 rounded px-4 py-2 border w-1/2 text-base placeholder:text-base"
//        required type="text" name="" placeholder="Firstname" id="" />
//         <input onChange={(e)=>{setLastname(e.target.value)}} value={lastname}
//        className="  bg-[#eeeeee] mb-7 rounded px-4 py-2 border w-1/2 text-base placeholder:text-base"
//        required type="text" name="" placeholder="Lastname" id="" />
//        </div>
//          <h3 className="text-lg font-medium">What's your email</h3>
//        <input onChange={(e)=>{setEmail(e.target.value)}} value={email}
//        className="  bg-[#eeeeee] mb-7 rounded px-4 py-2 border w-full text-lg placeholder:text-base"
//        required type="email" name="" placeholder="email@gamil.com" id="" />
//        <h3 className="text-lg font-medium">Enter Password</h3>
//        <input  className="bg-[#eeeeee] mb-7 rounded px-4 py-2 border w-full text-lg" type="password" onChange={(e)=>{setPassoword(e.target.value)}} value={password}placeholder="password" name="" id="" />
//        <button  className="bg-[#111]  font-semibold rounded px-4 py-2 mb-3 border w-full text-lg text-white">Signup</button>
//        <p>Already have an account ?<Link  to='/login' className='text-blue-600'>Login here</Link></p>
//       </form>
//       </div>
//       <div>
//       <p className='text-[10px] leading-tight'>This site is protected by reCAPTCHA and the <span className='underline'>Google Privacy
//             Policy</span> and <span className='underline'>Terms of Service apply</span>.</p>
//       </div>
//     </div>
//   )
// }

// export default UserSignup