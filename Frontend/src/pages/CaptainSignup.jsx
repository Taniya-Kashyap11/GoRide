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

const CaptainSignup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [vehicleColor, setVehicleColor] = useState("");
  const [vehiclePlate, setVehiclePlate] = useState("");
  const [vehicleCapacity, setVehicleCapacity] = useState("");
  const [vehicleType, setVehicleType] = useState("");
 const [error, setError] = useState("");
 const [loading, setLoading] = useState(false);

  const { setCaptain } = useContext(CaptainDataContext);

  const navigate = useNavigate();

  const submitHandler = async (e) => {

    e.preventDefault();

    setError("");
    setLoading(true);


    const captainDetails = {

      fullname: {
        firstname: firstname,
        lastname: lastname,
      },

      email: email,

      password: password,

      vehicle: {
        color: vehicleColor,
        plate: vehiclePlate,
        capacity: vehicleCapacity,
        vehicleType: vehicleType,
      },

    };


    try {

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/captains/register`,
        captainDetails,
        { withCredentials: true }
      );


      if (response.status === 201) {

        const data = response.data;
        setCaptain(data.captain);
        localStorage.setItem("captainToken", data.token);
        navigate("/captain-home");
      }

    } catch (err) {

      console.log("Signup Error:", err);

      const validationErrors = err.response?.data?.errors;
      setError(
        (validationErrors?.length
          ? validationErrors.map(({ msg }) => msg).join(", ")
          : err.response?.data?.message) ||
        "Something went wrong. Please try again."
      );

    } finally {

      setLoading(false);

    }

  };


  return (
      <div
    style={{
      height: "100vh",
      overflow: "hidden",
      backgroundColor: "#f5f7f5",
    }}
  >
    <Container fluid className="p-0 h-100">

      <Row className="g-0 h-100">

        <Col
          lg={6}
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
                Start Driving
                <br />
                With GoRide
              </h1>
              <p
                className="text-secondary fs-5 mb-4"
                style={{
                  maxWidth: "520px",
                  lineHeight: "1.6",
                }}
              >
                Join thousands of drivers earning on their
                own schedule. Register your vehicle and start
                accepting rides with GoRide.
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
                    Flexible earnings
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
                    Your Schedule
                  </h6>

                  <small className="text-secondary">
                    Drive when you want
                  </small>
                </div>

              </div>

            </div>

          </div>

        </Col>
                <Col
          lg={6}
          xs={12}
          style={{
            height: "100vh",
            overflowY: "auto",
            backgroundColor: "#fff",
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
                maxWidth: "570px",
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

                <Card.Body className="p-0 p-xl-3">
                  <div className="mb-4">

                    <div
                      className="mb-2 fw-semibold"
                      style={{
                        color: "#168c35",
                        fontSize: "13px",
                      }}
                    >
                      CAPTAIN REGISTRATION
                    </div>

                    <h2
                      className="fw-bold mb-2"
                      style={{
                        color: "#10251e",
                      }}
                    >
                      Become a GoRide Captain
                    </h2>

                    <p className="text-secondary">
                      Create your account and start earning with GoRide
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
                    <h6 className="fw-bold mb-3">
                      Personal Information
                    </h6>
                    <Row className="g-3 mb-3">
                      <Col md={6}>

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


                      <Col md={6}>

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

                    </Form.Group>
                    <h6 className="fw-bold mb-3">
                      Vehicle Information
                    </h6>
                    <Row className="g-3 mb-3">
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label className="fw-semibold">
                            Vehicle color
                          </Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="e.g. White"
                            value={vehicleColor}
                            onChange={(e) =>
                              setVehicleColor(e.target.value)
                            }
                            required
                            size="lg"
                            className="rounded-3"
                          />

                        </Form.Group>

                      </Col>


                      <Col md={6}>

                        <Form.Group>

                          <Form.Label className="fw-semibold">
                            Vehicle plate
                          </Form.Label>

                          <Form.Control
                            type="text"
                            placeholder="e.g. HR 26 AB 1234"
                            value={vehiclePlate}
                            onChange={(e) =>
                              setVehiclePlate(e.target.value)
                            }
                            required
                            size="lg"
                            className="rounded-3 text-uppercase"
                          />

                        </Form.Group>

                      </Col>

                    </Row>


                    <Row className="g-3 mb-4">

                      <Col md={6}>

                        <Form.Group>

                          <Form.Label className="fw-semibold">
                            Vehicle capacity
                          </Form.Label>

                          <Form.Control
                            type="number"
                            min="1"
                            placeholder="Number of seats"
                            value={vehicleCapacity}
                            onChange={(e) =>
                              setVehicleCapacity(e.target.value)
                            }
                            required
                            size="lg"
                            className="rounded-3"
                          />

                        </Form.Group>

                      </Col>


                      <Col md={6}>

                        <Form.Group>

                          <Form.Label className="fw-semibold">
                            Vehicle type
                          </Form.Label>

                          <Form.Select
                            value={vehicleType}
                            onChange={(e) =>
                              setVehicleType(e.target.value)
                            }
                            required
                            size="lg"
                            className="rounded-3"
                          >

                            <option value="">
                              Select vehicle
                            </option>

                            <option value="car">
                              Car
                            </option>

                            <option value="auto">
                              Auto
                            </option>

                            <option value="motorcycle">
                              Moto
                            </option>

                          </Form.Select>

                        </Form.Group>

                      </Col>

                    </Row>
                    <Button
                      type="submit"
                      size="lg"
                      disabled={loading}
                      className="w-100 border-0 rounded-3 fw-semibold py-2"
                      style={{
                        backgroundColor: "#111",
                      }}
                    >
                      {loading
                        ? "Creating account..."
                        : "Create Captain Account"}
                    </Button>
                    <p className="text-center text-secondary mt-4">

                      Already have an account?{" "}

                      <Link
                        to="/captain-login"
                        className="fw-semibold text-decoration-none"
                        style={{
                          color: "#168c35",
                        }}
                      >
                        Login here
                      </Link>

                    </p>


                     <div className="d-flex align-items-center my-4">

                    <div className="border-top"></div>

                    <span className="px-3 text-secondary small">
                      OR
                    </span>

                    <div className=" border-top"></div>
                  </div>
                    <Link
                      to="/login"
                      className="text-decoration-none"
                    >

                      <Button
                        variant="outline-success"
                        size="lg"
                        className="w-100 rounded-3 fw-semibold"
                      >
                        Sign in as User
                      </Button>

                    </Link>
                    <p
                      className="text-center text-secondary mt-4"
                      style={{
                        fontSize: "11px",
                        lineHeight: "1.5",
                      }}
                    >
                      By creating a captain account, you agree to our{" "}
                      <span className="text-decoration-underline">
                        Terms of Service
                      </span>{" "}
                      and{" "}
                      <span className="text-decoration-underline">
                        Privacy Policy
                      </span>.
                    </p>
                    <div className="text-center mt-3">

                      <Link
                        to="/"
                        className="small text-secondary text-decoration-none"
                      >
                        ← Back to GoRide
                      </Link>

                    </div>

                  </Form>

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

export default CaptainSignup;
