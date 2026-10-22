
import React, { useCallback, useEffect, useState } from "react";
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

  return new Date(date).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const MyRides = () => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

 
const fetchRides = useCallback(async () => {
  setLoading(true);
  setError("");

  try {
    const response = await axios.get(`${API_URL}/captain/my-rides`,{
      withCredentials: true,
    });
    setRides(response.data.rides || []);
  } catch (err) {
    setError(
      err.response?.data?.message ||
      err.message ||
      "Unable to load rides. Please try again."
    );
  } finally {
    setLoading(false);
  }
}, []);

useEffect(() => {
  fetchRides();
}, [fetchRides]);

const handleCancelRide = async (rideId) => {
  const confirmed = window.confirm(
    "Are you sure you want to cancel this ride?"
  );

  if (!confirmed) return;

  setCancellingId(rideId);
  setError("");
  setSuccessMessage("");

  try {
    const response = await axios.patch(
      `${API_URL}/${rideId}/cancel`,
      {},
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    setRides((previousRides) =>
      previousRides.map((ride) =>
        ride._id === rideId
          ? { ...ride, status: "cancelled" }
          : ride
      )
    );

    setSuccessMessage(
      response.data.message ||
      "Your ride has been cancelled successfully."
    );
  } catch (err) {
    setError(
      err.response?.data?.message ||
      err.message ||
      "Unable to cancel this ride."
    );
  } finally {
    setCancellingId(null);
  }
};

  return (
    <Container className="py-4 py-md-5">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-1">My Rides</h2>
          <p className="text-muted mb-0">
            View and manage your GoRide bookings.
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
        </Alert>
      )}

      {successMessage && (
        <Alert
          variant="success"
          dismissible
          onClose={() => setSuccessMessage("")}
        >
          {successMessage}
        </Alert>
      )}

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" role="status" />
          <p className="text-muted mt-3 mb-0">
            Loading your rides...
          </p>
        </div>
      ) : rides.length === 0 ? (
        <Card className="border-0 shadow-sm text-center py-5">
          <Card.Body>
            <h4 className="fw-semibold">No rides yet</h4>
            <p className="text-muted">
              Your bookings will appear here when you book a ride.
            </p>
            <Button as={Link} to="/home" variant="success">
              Book Your First Ride
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <>
          <p className="text-muted mb-3">
            {rides.length} {rides.length === 1 ? "ride" : "rides"} found
          </p>

          <Row className="g-4">
            {rides.map((ride) => (
              <Col xs={12} key={ride._id}>
                <Card className="border-0 shadow-sm">
                  <Card.Body className="p-3 p-md-4">
                    <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
                      <div>
                        <h5 className="fw-bold text-capitalize mb-1">
                          {ride.rideType} Ride
                        </h5>
                        <small className="text-muted">
                          Booked on {formatDate(ride.createdAt)}
                        </small>
                      </div>

                      <Badge
                        bg={getStatusVariant(ride.status)}
                        className="text-capitalize px-3 py-2"
                      >
                        {ride.status}
                      </Badge>
                    </div>

                    <Row className="g-3">
                      <Col md={7}>
                        <div className="d-flex gap-3">
                          <div className="d-flex flex-column align-items-center">
                            <span className="rounded-circle bg-success d-inline-block" style={{ width: 11, height: 11, marginTop: 5 }} />
                            <div
                              className="border-start border-2 border-secondary"
                              style={{ height: 38 }}
                            />
                            <span className="bg-danger d-inline-block" style={{ width: 11, height: 11 }} />
                          </div>

                          <div className="flex-grow-1">
                            <div className="mb-3">
                              <small className="text-muted d-block">
                                PICKUP
                              </small>
                              <div className="fw-medium">
                                {ride.pickup?.address || "Not available"}
                              </div>
                            </div>

                            <div>
                              <small className="text-muted d-block">
                                DESTINATION
                              </small>
                              <div className="fw-medium">
                                {ride.destination?.address || "Not available"}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Col>

                      <Col md={5}>
                        <div className="bg-light rounded p-3 h-100">
                          <Row className="g-3">
                            <Col xs={6}>
                              <small className="text-muted d-block">
                                ESTIMATED FARE
                              </small>
                              <h5 className="fw-bold mb-0">
                                ₹{Number(ride.fare || 0).toFixed(2)}
                              </h5>
                            </Col>

                            <Col xs={6}>
                              <small className="text-muted d-block">
                                DISTANCE
                              </small>
                              <h6 className="fw-semibold mb-0">
                                {Number(ride.distanceKm || 0).toFixed(2)} km
                              </h6>
                            </Col>

                            <Col xs={12}>
                              <small className="text-muted d-block">
                                ESTIMATED DURATION
                              </small>
                              <span className="fw-semibold">
                                {ride.durationMinutes ?? "—"} minutes
                              </span>
                            </Col>
                          </Row>
                        </div>
                      </Col>
                    </Row>

                    <div className="d-flex justify-content-end mt-4">
                      {ride.status === "pending" && (
                        <Button
                          variant="outline-danger"
                          onClick={() => handleCancelRide(ride._id)}
                          disabled={cancellingId === ride._id}
                        >
                          {cancellingId === ride._id
                            ? "Cancelling..."
                            : "Cancel Ride"}
                        </Button>
                      )}
                    </div>
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

export default MyRides;
