import { useCallback, useEffect, useState } from "react";
import socket from "../socket";
import axios from "axios";
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Container,
  Row,
  Spinner,
} from "react-bootstrap";
import {
  FaArrowRight,
  FaCarSide,
  FaClock,
  FaLocationDot,
  FaMoneyBillWave,
  FaRoute,
  FaRotate,
  FaStar,
  FaUser,
  FaRightFromBracket
} from "react-icons/fa6";
import "../CaptainHome.css";
import { useNavigate } from "react-router-dom";
const API_URL = `${import.meta.env.VITE_BASE_URL}/api/rides`;
const getToken = () => localStorage.getItem("captainToken");

const formatMoney = (amount) =>
  `₹${Number(amount || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const formatDate = (date) => {
  if (!date) return "Booking date unavailable";

  const parsedDate = new Date(date);

  return Number.isNaN(parsedDate.getTime())
    ? "Booking date unavailable"
    : parsedDate.toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      });
};

const getPassengerName = (user) => {
  if (!user) return "Passenger";

  const name = `${user.firstName || ""} ${user.lastName || ""}`.trim();

  return name || user.email || "Passenger";
};

const CaptainHome = () => {
  const [rides, setRides] = useState([]);
  const [activeRides, setActiveRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeLoading, setActiveLoading] = useState(true);
  const [actionId, setActionId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate=useNavigate();
  const fetchAvailableRides = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const token = getToken();

      if (!token) {
        throw new Error("Please log in as a captain first.");
      }

      const response = await axios.get(`${API_URL}/available`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      setRides(response.data.rides || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to load available rides."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchActiveRides = useCallback(async () => {
    setActiveLoading(true);

    try {
      const token = getToken();

      if (!token) {
        throw new Error("Please log in as a captain first.");
      }

      const response = await axios.get(
        `${API_URL}/captain/my-rides`,
        {
          headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
        }
      );

      setActiveRides(response.data.rides || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to load your rides."
      );
    } finally {
      setActiveLoading(false);
    }
  }, []);

  // useEffect(() => {
  //   fetchAvailableRides();
  //   fetchActiveRides();
  // }, [fetchAvailableRides, fetchActiveRides]);
useEffect(() => {
  fetchAvailableRides();
  fetchActiveRides();

  socket.connect();

  const handleNewRide = () => {
    fetchAvailableRides();
  };

  const handleRideStatusChanged = () => {
    fetchAvailableRides();
    fetchActiveRides();
  };

  socket.on("newRideAvailable", handleNewRide);
  socket.on("rideStatusChanged", handleRideStatusChanged);

  return () => {
    socket.off("newRideAvailable", handleNewRide);
    socket.off("rideStatusChanged", handleRideStatusChanged);
  };
}, [fetchAvailableRides, fetchActiveRides]);

  const acceptRide = async (rideId) => {
    setActionId(rideId);
    setError("");
    setMessage("");

    try {
      const token = getToken();

      if (!token) {
        throw new Error("Please log in as a captain first.");
      }

      const response = await axios.patch(
        `${API_URL}/${rideId}/accept`,
        {},
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );

      setRides((previous) =>
        previous.filter((ride) => ride._id !== rideId)
      );

      setMessage(
        response.data.message || "Ride accepted successfully."
      );

      await Promise.all([
        fetchAvailableRides(),
        fetchActiveRides(),
      ]);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to accept this ride."
      );

      await fetchAvailableRides();
    } finally {
      setActionId(null);
    }
  };

  const updateRideStatus = async (rideId, action) => {
    setActionId(rideId);
    setError("");
    setMessage("");

    try {
      const token = getToken();

      if (!token) {
        throw new Error("Please log in as a captain first.");
      }

      const response = await axios.patch(
        `${API_URL}/${rideId}/${action}`,
        {},
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );

      setMessage(
        response.data.message ||
          (action === "start"
            ? "Ride started successfully."
            : "Ride completed successfully.")
      );

      await fetchActiveRides();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to update ride status."
      );
    } finally {
      setActionId(null);
    }
  };

  const renderRoute = (ride) => (
    <div className="captain-route">
      <div className="captain-route-point">
        <span className="route-dot pickup-dot" />
        <div className="flex-grow-1">
          <span className="route-label">PICKUP LOCATION</span>
          <p className="route-address">
            {ride.pickup?.address || "Location unavailable"}
          </p>
        </div>
      </div>

      <div className="route-connector" />

      <div className="captain-route-point">
        <span className="route-dot destination-dot" />
        <div className="flex-grow-1">
          <span className="route-label">DESTINATION</span>
          <p className="route-address mb-0">
            {ride.destination?.address || "Location unavailable"}
          </p>
        </div>
      </div>
    </div>
  );
  
  const renderRideDetails = (ride) => (
    <Row className="g-3 captain-ride-metrics">
      <Col xs={4}>
        <div className="metric-box">
          <FaMoneyBillWave className="metric-icon" />
          <span className="metric-label">FARE</span>
          <strong>{formatMoney(ride.fare)}</strong>
        </div>
      </Col>

      <Col xs={4}>
        <div className="metric-box">
          <FaRoute className="metric-icon" />
          <span className="metric-label">DISTANCE</span>
          <strong>
            {Number(ride.distanceKm || 0).toFixed(1)} km
          </strong>
        </div>
      </Col>

      <Col xs={4}>
        <div className="metric-box">
          <FaClock className="metric-icon" />
          <span className="metric-label">DURATION</span>
          <strong>{ride.durationMinutes ?? "—"} min</strong>
        </div>
      </Col>
    </Row>
  );
 
const logout = async () => {
  const token = localStorage.getItem("captainToken");

  try {
    await axios.get(`${import.meta.env.VITE_BASE_URL}/captains/logout`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      withCredentials: true,
    });
  } catch (error) {
    console.error(
      "Logout API error:",
      error.response?.data || error.message
    );
  } finally {
    localStorage.removeItem("captainToken");
    navigate("/", { replace: true });
  }
};

  return (
    <div className="captain-dashboard">
      <Container fluid="xl" className="captain-container">
        <header className="captain-page-header">
          <div>
            <div className="captain-eyebrow">
              <span className="captain-eyebrow-dot" />
              GORIDE DRIVER PARTNER
            </div>

            <h1>Captain Dashboard</h1>

            <p>
              Manage your ride requests and keep your day moving.
            </p>
            <div>
                <button
                        className="icon-button fs-6 fw-6"
                        onClick={logout}
                        title="Log out"
                        aria-label="Log out"
                      >
                        <FaRightFromBracket />
                      </button>
            </div>
          </div>

          <Button
            className="captain-refresh-btn"
            variant="light"
            onClick={() => {
              fetchAvailableRides();
              fetchActiveRides();
            }}
            disabled={loading || activeLoading}
          >
            <FaRotate className={loading ? "spin-icon" : ""} />
            Refresh dashboard
          </Button>
        </header>

        <Row className="g-3 captain-summary-row">
          <Col xs={6} lg={3}>
            <Card className="captain-summary-card h-100">
              <Card.Body>
                <div className="summary-icon summary-green">
                  <FaCarSide />
                </div>
                <span className="summary-label">New requests</span>
                <h3>{loading ? "—" : rides.length}</h3>
                <p>Available for pickup</p>
              </Card.Body>
            </Card>
          </Col>

          <Col xs={6} lg={3}>
            <Card className="captain-summary-card h-100">
              <Card.Body>
                <div className="summary-icon summary-blue">
                  <FaRoute />
                </div>
                <span className="summary-label">My rides</span>
                <h3>{activeLoading ? "—" : activeRides.length}</h3>
                <p>Accepted and in progress</p>
              </Card.Body>
            </Card>
          </Col>

          <Col xs={6} lg={3}>
            <Card className="captain-summary-card h-100">
              <Card.Body>
                <div className="summary-icon summary-yellow">
                  <FaMoneyBillWave />
                </div>
                <span className="summary-label">Ride earnings</span>
                <h3 className="summary-text">
                  {formatMoney(
                    activeRides.reduce(
                      (total, ride) =>
                        total +
                        (ride.status === "completed"
                          ? Number(ride.fare || 0)
                          : 0),
                      0
                    )
                  )}
                </h3>
                <p>From completed rides shown</p>
              </Card.Body>
            </Card>
          </Col>

          <Col xs={6} lg={3}>
            <Card className="captain-summary-card h-100">
              <Card.Body>
                <div className="summary-icon summary-purple">
                  <FaStar />
                </div>
                <span className="summary-label">Your focus</span>
                <h3 className="summary-text">Ride safe</h3>
                <p>Every trip, every passenger</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {error && (
          <Alert
            variant="danger"
            dismissible
            onClose={() => setError("")}
            className="captain-alert"
          >
            {error}
          </Alert>
        )}

        {message && (
          <Alert
            variant="success"
            dismissible
            onClose={() => setMessage("")}
            className="captain-alert"
          >
            {message}
          </Alert>
        )}

        <section className="captain-section">
          <div className="captain-section-header">
            <div>
              <span className="section-kicker">FIND YOUR NEXT TRIP</span>
              <h2>Available ride requests</h2>
              <p>Review the route and fare before accepting a booking.</p>
            </div>

            <Badge bg="light" text="dark" className="captain-count-badge">
              {loading ? "Loading..." : `${rides.length} requests`}
            </Badge>
          </div>

          {loading ? (
            <div className="captain-loading">
              <Spinner animation="border" />
              <p>Finding available rides...</p>
            </div>
          ) : rides.length === 0 ? (
            <Card className="captain-empty-card">
              <Card.Body>
                <div className="empty-icon">
                  <FaCarSide />
                </div>
                <h5>No ride requests right now</h5>
                <p>
                  New bookings will appear here when passengers request
                  a ride.
                </p>
                <Button
                  variant="outline-success"
                  onClick={fetchAvailableRides}
                >
                  <FaRotate className="me-2" />
                  Check again
                </Button>
              </Card.Body>
            </Card>
          ) : (
            <Row className="g-4">
              {rides.map((ride) => (
                <Col xs={12} lg={6} key={ride._id}>
                  <Card className="captain-ride-card h-100">
                    <Card.Body>
                      <div className="ride-card-header">
                        <div className="ride-type-icon">
                          <FaCarSide />
                        </div>

                        <div className="flex-grow-1">
                          <h3>
                            {ride.rideType || "Standard"} ride
                          </h3>
                          <span className="ride-date">
                            {formatDate(ride.createdAt)}
                          </span>
                        </div>

                        <Badge
                          bg="warning"
                          text="dark"
                          className="ride-status-badge"
                        >
                          Pending
                        </Badge>
                      </div>

                      <div className="passenger-strip">
                        <div className="passenger-avatar">
                          <FaUser />
                        </div>
                        <div>
                          <span className="route-label">PASSENGER</span>
                          <p>{getPassengerName(ride.user)}</p>
                        </div>
                      </div>

                      {renderRoute(ride)}
                      {renderRideDetails(ride)}

                      <Button
                        className="captain-primary-btn w-100"
                        onClick={() => acceptRide(ride._id)}
                        disabled={actionId !== null}
                      >
                        {actionId === ride._id ? (
                          <>
                            <Spinner
                              size="sm"
                              animation="border"
                              className="me-2"
                            />
                            Accepting ride...
                          </>
                        ) : (
                          <>
                            Accept ride
                  
                          </>
                        )}
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </section>

        <section className="captain-section active-rides-section">
          <div className="captain-section-header">
            <div>
              <span className="section-kicker">YOUR CURRENT BOOKINGS</span>
              <h2>My active rides</h2>
              <p>
                Track accepted trips and update their status as you go.
              </p>
            </div>

            <Button
              variant="light"
              className="captain-refresh-btn"
              onClick={fetchActiveRides}
              disabled={activeLoading}
            >
              <FaRotate className={activeLoading ? "spin-icon" : ""} />
              Refresh
            </Button>
          </div>

          {activeLoading ? (
            <div className="captain-loading">
              <Spinner animation="border" />
              <p>Loading your rides...</p>
            </div>
          ) : activeRides.length === 0 ? (
            <Card className="captain-empty-card">
              <Card.Body>
                <div className="empty-icon">
                  <FaRoute />
                </div>
                <h5>No active rides yet</h5>
                <p>
                  Once you accept a request, your booking will appear
                  here.
                </p>
              </Card.Body>
            </Card>
          ) : (
            <Row className="g-4">
              {activeRides.map((ride) => (
                <Col xs={12} lg={6} key={ride._id}>
                  <Card className="captain-ride-card h-100">
                    <Card.Body>
                      <div className="ride-card-header">
                        <div className="ride-type-icon">
                          <FaCarSide />
                        </div>

                        <div className="flex-grow-1">
                          <h3>
                            {ride.rideType || "Standard"} ride
                          </h3>
                          <span className="ride-date">
                            {formatDate(ride.createdAt)}
                          </span>
                        </div>

                        <Badge
                          bg={
                            ride.status === "ongoing"
                              ? "info"
                              : "primary"
                          }
                          text={
                            ride.status === "ongoing"
                              ? "dark"
                              : undefined
                          }
                          className="ride-status-badge text-capitalize"
                        >
                          {ride.status}
                        </Badge>
                      </div>

                      <div className="passenger-strip">
                        <div className="passenger-avatar">
                          <FaUser />
                        </div>
                        <div>
                          <span className="route-label">PASSENGER</span>
                          <p>{getPassengerName(ride.user)}</p>
                        </div>
                      </div>

                      {renderRoute(ride)}
                      {renderRideDetails(ride)}

                      {ride.status === "accepted" && (
                        <Button
                          className="captain-primary-btn w-100"
                          disabled={actionId !== null}
                          onClick={() =>
                            updateRideStatus(ride._id, "start")
                          }
                        >
                          {actionId === ride._id ? (
                            <Spinner
                              size="sm"
                              animation="border"
                              className="me-2"
                            />
                          ) : null}
                          Start ride
                          <FaArrowRight className="ms-2" />
                        </Button>
                      )}

                      {ride.status === "ongoing" && (
                        <Button
                          className="captain-complete-btn w-100"
                          disabled={actionId !== null}
                          onClick={() =>
                            updateRideStatus(ride._id, "complete")
                          }
                        >
                          {actionId === ride._id ? (
                            <Spinner
                              size="sm"
                              animation="border"
                              className="me-2"
                            />
                          ) : null}
                          Complete ride
                        </Button>
                      )}

                      {ride.status === "completed" && (
                        <div className="completed-note">
                          <FaStar />
                          Ride completed successfully
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </section>

        <footer className="captain-footer">
          <span>GoRide Captain</span>
          <span>Drive safe. Arrive happy.</span>
        </footer>
      </Container>
    </div>
  );
};

export default CaptainHome;
