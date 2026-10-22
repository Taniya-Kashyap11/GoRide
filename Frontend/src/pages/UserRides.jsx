
import { useCallback, useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  Button,
  Spinner,
  Alert,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import socket from "../socket";
const API_URL = `${import.meta.env.VITE_BASE_URL}/api/rides`;

const getStatusVariant = (status) => {
  const variants = {
    pending: "warning",
    accepted: "primary",
    ongoing: "info",
    completed: "success",
    cancelled: "secondary",
  };

  return variants[status?.toLowerCase()] || "secondary";
};

const formatDate = (date) => {
  if (!date) return "Date unavailable";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Date unavailable";
  }

  return parsedDate.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const UserRides = () => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRides = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("userToken");

      const response = await axios.get(
        `${API_URL}/my-rides`,
        {
          withCredentials: true,
          headers: token
            ? { Authorization: `Bearer ${token}` }
            : {},
        }
      );

      setRides(response.data.rides || []);
    } catch (err) {
      console.error(
        "Fetch user rides error:",
        err.response?.data || err
      );

      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to load your rides. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // useEffect(() => {
  //   fetchRides();
  // }, [fetchRides]);
  useEffect(() => {
  socket.connect();

  const handleRideStatusChanged = () => {
    fetchRides();
  };

  socket.on("rideStatusChanged", handleRideStatusChanged);

  // Fetch rides when the page opens.
  fetchRides();

  return () => {
    socket.off("rideStatusChanged", handleRideStatusChanged);
    socket.disconnect();
  };
}, [fetchRides]);

  return (
    <Container className="py-4 py-md-5">
 
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-1">My Rides</h2>
          <p className="text-muted mb-0">
            Track your GoRide bookings and ride details.
          </p>
        </div>

        <div className="d-flex gap-2">
          <Button
            variant="outline-success"
            onClick={fetchRides}
            disabled={loading}
          >
            {loading ? "Refreshing..." : "Refresh"}
          </Button>

          <Button as={Link} to="/home" variant="success">
            Book a Ride
          </Button>
        </div>
      </div>

      {error && (
        <Alert
          variant="danger"
          dismissible
          onClose={() => setError("")}
        >
          {error}
          <div className="mt-2">
            <Button
              variant="outline-danger"
              size="sm"
              onClick={fetchRides}
            >
              Try Again
            </Button>
          </div>
        </Alert>
      )}

      {loading ? (
        <div className="text-center py-5">
          <Spinner
            animation="border"
            variant="success"
            role="status"
          />
          <p className="text-muted mt-3 mb-0">
            Loading your rides...
          </p>
        </div>
      ) : error ? null : rides.length === 0 ? (

        <Card className="border-0 shadow-sm text-center py-5">
          <Card.Body>
            <div
              className="rounded-circle bg-light d-flex align-items-center justify-content-center mx-auto mb-3"
              style={{ width: 76, height: 76 }}
            >
              <span style={{ fontSize: 34 }}>🚗</span>
            </div>

            <h4 className="fw-semibold">No rides yet</h4>

            <p className="text-muted mb-4">
              Your bookings will appear here once you book your
              first ride with GoRide.
            </p>

            <Button as={Link} to="/home" variant="success">
              Book Your First Ride
            </Button>
          </Card.Body>
        </Card>
      ) : (
   
        <>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <p className="text-muted mb-0">
              {rides.length}{" "}
              {rides.length === 1 ? "ride" : "rides"} found
            </p>
          </div>

          <Row className="g-4">
            {rides.map((ride) => (
              <Col xs={12} key={ride._id}>
                <Card className="border-0 shadow-sm h-100">
                  <Card.Body className="p-3 p-md-4">
                 
                    <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
                      <div>
                        <h5 className="fw-bold text-capitalize mb-1">
                          {ride.rideType || "Regular"} Ride
                        </h5>

                        <small className="text-muted">
                          Booked on {formatDate(ride.createdAt)}
                        </small>
                      </div>

                      <Badge
                        bg={getStatusVariant(ride.status)}
                        className="text-capitalize px-3 py-2"
                      >
                        {ride.status || "Unknown"}
                      </Badge>
                    </div>

                    <Row className="g-4">
                 
                      <Col md={7}>
                        <div className="d-flex gap-3">
                          <div className="d-flex flex-column align-items-center">
                            <span
                              className="rounded-circle bg-success d-inline-block"
                              style={{
                                width: 11,
                                height: 11,
                                marginTop: 5,
                              }}
                            />

                            <div
                              className="border-start border-2 border-secondary"
                              style={{ height: 38 }}
                            />

                            <span
                              className="bg-danger d-inline-block"
                              style={{
                                width: 11,
                                height: 11,
                                borderRadius: 2,
                              }}
                            />
                          </div>

                          <div className="flex-grow-1">
                            <div className="mb-3">
                              <small className="text-muted d-block fw-semibold">
                                PICKUP LOCATION
                              </small>

                              <div className="fw-medium text-break">
                                {ride.pickup?.address ||
                                  "Location unavailable"}
                              </div>
                            </div>

                            <div>
                              <small className="text-muted d-block fw-semibold">
                                DESTINATION
                              </small>

                              <div className="fw-medium text-break">
                                {ride.destination?.address ||
                                  "Location unavailable"}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Col>

                      {/* Fare and Booking Details */}
                      <Col md={5}>
                        <div className="bg-light rounded p-3 h-100">
                          <Row className="g-3">
                            <Col xs={6}>
                              <small className="text-muted d-block">
                                ESTIMATED FARE
                              </small>

                              <h5 className="fw-bold text-success mb-0">
                                ₹
                                {Number(ride.fare || 0).toFixed(2)}
                              </h5>
                            </Col>

                            <Col xs={6}>
                              <small className="text-muted d-block">
                                RIDE STATUS
                              </small>

                              <div className="fw-semibold text-capitalize">
                                {ride.status || "Unknown"}
                              </div>
                            </Col>
                          </Row>

                          <hr />

                          <small className="text-muted d-block">
                            BOOKING ID
                          </small>

                          <div
                            className="small text-break"
                            title={ride._id}
                          >
                            {ride._id}
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </>
      )}
    </Container>
  );
};

export default UserRides;
