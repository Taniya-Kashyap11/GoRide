import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Navbar,
  Nav,
  Container,
  Row,
  Col,
  Button,
  Form,
  Card,
} from "react-bootstrap";

import {
  FaCar,
  FaLocationDot,
  FaArrowRight,
} from "react-icons/fa6";

import { AiFillThunderbolt } from "react-icons/ai";
import { MdSecurity } from "react-icons/md";
import { BsWallet2 } from "react-icons/bs";

import "../LandingPage.css";

const rides = [
  {
    name: "Economy",
    image: "/economy-car.png",
    description: "Affordable everyday rides",
  },
  {
    name: "Comfort",
    image: "/comfort-car.png",
    description: "Extra comfort for your journey",
  },
  {
    name: "XL",
    image: "/xl-car.png",
    description: "More space for groups",
  },
  {
    name: "Premium",
    image: "/premium-car.png",
    description: "A premium travel experience",
  },
];

const features = [
  {
    icon: <AiFillThunderbolt />,
    title: "Easy Booking",
    description: "Book your ride in a few simple steps.",
  },
  {
    icon: <MdSecurity />,
    title: "Safety First",
    description: "Enjoy a convenient and safety-conscious ride experience.",
  },
  {
    icon: <BsWallet2 />,
    title: "Clear Pricing",
    description: "Review your ride details before continuing.",
  },
];

const LandingPage = () => {
  const navigate = useNavigate();

  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [rideType, setRideType] = useState("Economy");
  const [error, setError] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();

    if (!pickup.trim() || !destination.trim()) {
      setError("Please enter your pickup and destination.");
      return;
    }

    if (
      pickup.trim().toLowerCase() ===
      destination.trim().toLowerCase()
    ) {
      setError("Pickup and destination must be different.");
      return;
    }

    navigate("/login", {
      state: {
        pickup: pickup.trim(),
        destination: destination.trim(),
        rideType,
      },
    });
  };

  return (
    <div className="goride-page">
      <Navbar expand="lg" className="goride-navbar">
        <Container>
          <Navbar.Brand as={Link} to="/">
            <img
              src="/logo.png"
              alt="GoRide"
              className="goride-logo"
            />
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="goride-nav" />

          <Navbar.Collapse id="goride-nav">
            <Nav className="mx-auto goride-nav-links">
              <Nav.Link as={Link} to="/" className="active">
                Home
              </Nav.Link>

              <Nav.Link href="#how-it-works">
                How It Works
              </Nav.Link>
  
            </Nav>

            <div className="d-flex align-items-center gap-3 nav-actions">
              <Button
                as={Link}
                to="/login"
                variant="outline-success"
                className="login-btn"
              >
                Log in
              </Button>

              <Button
                as={Link}
                to="/signup"
                variant="success"
                className="signup-btn"
              >
                Sign up
              </Button>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <section className="hero-section">
        <Container>
          <Row className="align-items-center g-4">
            <Col lg={6}>
              <span className="section-label">
                YOUR JOURNEY, YOUR WAY
              </span>

              <h1 className="hero-title">
                Good rides.
                <br />
                <span>Better journeys.</span>
              </h1>

              <p className="hero-description">
                Getting where you need to go should be simple.
                Choose your ride, enter your destination, and
                let GoRide help you get moving.
              </p>

              <div className="d-flex align-items-center flex-wrap gap-4 mt-4">
                <Button
                  href="#book-ride"
                  variant="success"
                  className="primary-btn"
                >
                  Book a ride <FaArrowRight className="ms-2" />
                </Button>

                <a href="#how-it-works" className="learn-link">
                  How it works
                </a>
              </div>
            </Col>

            <Col lg={6}>
              <div className="hero-image-wrapper">
                <img
                  src="/bgImage.png"
                  alt="GoRide journey"
                  className="hero-image"
                />

                <Card className="hero-caption border-0">
                  <Card.Body className="d-flex align-items-center gap-3">
                    <div className="icon-box">
                      <FaCar />
                    </div>

                    <div>
                      <h6 className="mb-1">
                        Your next ride awaits
                      </h6>
                      <small className="text-muted">
                        Start your journey with GoRide
                      </small>
                    </div>
                  </Card.Body>
                </Card>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      <section id="book-ride" className="booking-section">
        <Container>
          <Card className="booking-card border-0">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <span className="section-label">
                    LET'S GET GOING
                  </span>
                  <h2 className="booking-title">
                    Where are you headed?
                  </h2>
                </div>

                <FaCar className="booking-icon" />
              </div>

              <Form onSubmit={handleSearch}>
                <Row className="g-3 align-items-end">
                  <Col lg={3} md={6}>
                    <Form.Group>
                      <Form.Label>Pickup location</Form.Label>

                      <div className="location-field">
                        <FaLocationDot className="pickup-icon" />

                        <Form.Control
                          value={pickup}
                          onChange={(e) => setPickup(e.target.value)}
                          placeholder="Enter pickup"
                          aria-label="Pickup location"
                        />
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg={3} md={6}>
                    <Form.Group>
                      <Form.Label>Destination</Form.Label>

                      <div className="location-field">
                        <FaLocationDot className="destination-icon" />

                        <Form.Control
                          value={destination}
                          onChange={(e) =>
                            setDestination(e.target.value)
                          }
                          placeholder="Where to?"
                          aria-label="Destination"
                        />
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg={3} md={6}>
                    <Form.Group>
                      <Form.Label>Ride type</Form.Label>

                      <Form.Select
                        value={rideType}
                        onChange={(e) => setRideType(e.target.value)}
                      >
                        {rides.map((ride) => (
                          <option key={ride.name} value={ride.name}>
                            {ride.name}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col lg={3} md={6}>
                    <Button
                      type="submit"
                      variant="success"
                      className="primary-btn search-btn w-100"
                    >
                      Find a ride <FaArrowRight className="ms-2" />
                    </Button>
                  </Col>
                </Row>

                {error && (
                  <p className="text-danger small mt-3 mb-0" role="alert">
                    {error}
                  </p>
                )}
              </Form>
            </Card.Body>
          </Card>
        </Container>
      </section>
      <section id="how-it-works" className="content-section">
        <Container>
          <div className="section-heading">
            <span className="section-label">HOW IT WORKS</span>
            <h2>Three steps. One easy journey.</h2>
            <p>Getting there is easier than ever.</p>
          </div>

          <Row className="g-4">
            {features.map((feature, index) => (
              <Col md={4} key={feature.title}>
                <Card className="feature-card h-100">
                  <Card.Body>
                    <div className="feature-top">
                      <div className="icon-box">
                        {feature.icon}
                      </div>

                      <span className="feature-number">
                        0{index + 1}
                      </span>
                    </div>

                    <Card.Title>{feature.title}</Card.Title>
                    <Card.Text>
                      {index === 0
                        ? "Enter your pickup and destination to get started."
                        : index === 1
                        ? "Select a ride that fits your travel needs."
                        : "Sign in to continue with your booking."}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
      <section className="rides-section">
        <Container>
          <div className="section-heading">
            <span className="section-label">RIDE OPTIONS</span>
            <h2>Find your kind of ride.</h2>
            <p>A comfortable option for every journey.</p>
          </div>

          <Row className="g-3">
            {rides.map((ride) => (
              <Col lg={3} sm={6} key={ride.name}>
                <Card className="ride-card h-100">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <div>
                        <Card.Title>{ride.name}</Card.Title>
                        <Card.Text>{ride.description}</Card.Text>
                      </div>

                      <Button
                        as={Link}
                        to={`/rides/${ride.name.toLowerCase()}`}
                        variant="light"
                        className="ride-link"
                        aria-label={`View ${ride.name} rides`}
                      >
                        <FaArrowRight />
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
      <footer className="goride-footer">
        <Container>
          <Row className="align-items-center gy-2">
            <Col sm={4}>
              <Link to="/">
                <img
                  src="/logo.png"
                  alt="GoRide"
                  className="footer-logo"
                />
              </Link>
            </Col>
            <Col sm={4} className="text-sm-center">
              <p className="mb-0">
                Making everyday journeys simpler.
              </p>
            </Col>
            <Col sm={4} className="text-sm-end">
              <small>
                © {new Date().getFullYear()} GoRide
              </small>
            </Col>
          </Row>
        </Container>
      </footer>
    </div>
  );
};

export default LandingPage;
