import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  Card,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaLocationDot ,FaRightFromBracket} from "react-icons/fa6";
import Map from "../components/Map";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const rideOptions = [
  {
    name: "Economy",
    description: "Affordable and reliable",
    price: "Budget friendly",
  },
  {
    name: "Comfort",
    description: "Extra comfort for your journey",
    price: "More comfort",
  },
  {
    name: "Premium",
    description: "Travel in style",
    price: "Premium experience",
  },
  {
    name: "XL",
    description: "More space for groups",
    price: "Extra capacity",
  },
];

const Home = () => {
  const [pickup, setPickup] = useState(null);
  const [destination, setDestination] = useState(null);

  const [selection, setSelection] = useState("pickup");

  const [pickupText, setPickupText] = useState("");
  const [destinationText, setDestinationText] = useState("");

  const [rideType, setRideType] = useState("economy");
  const [route, setRoute] = useState(null);
  const [loadingRoute, setLoadingRoute] = useState(false);
  const [routeError, setRouteError] = useState("");
  const [pickupResults, setPickupResults] = useState([]);
  const [destinationResults, setDestinationResults] = useState([]);
  const [searchingLocation, setSearchingLocation] = useState(false);
  const [searchingType, setSearchingType] = useState("");
  const [searchError, setSearchError] = useState("");
  const navigate=useNavigate();
  const handleLocationSelect = (type, coordinates) => {
    const formattedCoordinates = coordinates
      .map((coordinate) => coordinate.toFixed(5))
      .join(", ");

    if (type === "pickup") {
      setPickup(coordinates);
      setPickupText(formattedCoordinates);
      setPickupResults([]);
    } else {
      setDestination(coordinates);
      setDestinationText(formattedCoordinates);
      setDestinationResults([]);
    }

    setRoute(null);
    setRouteError("");
  };
  async function logout() {
    try {
      const token = localStorage.getItem("userToken");
      await axios.get(`${import.meta.env.VITE_BASE_URL}/users/logout`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        withCredentials: true,
      });
    } catch (error) {
      console.error("Logout API error:", error.response?.data || error.message);
    } finally {
      localStorage.removeItem("userToken");
      navigate("/", { replace: true });
    }
  }
  const handleAddressSearch = async (type) => {
    const query =
      type === "pickup" ? pickupText.trim() : destinationText.trim();

    if (!query) {
      setSearchError("Please enter a location to search.");
      return;
    }

    setSearchingLocation(true);
    setSearchingType(type);
    setSearchError("");

    if (type === "pickup") {
      setPickupResults([]);
    } else {
      setDestinationResults([]);
    }

    try {
      const params = new URLSearchParams({
        q: query,
        format: "jsonv2",
        limit: "5",
      });

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error(
          "Location search is temporarily unavailable. Please try again."
        );
      }

      const results = await response.json();

      if (type === "pickup") {
        setPickupResults(results);
      } else {
        setDestinationResults(results);
      }

      if (results.length === 0) {
        setSearchError("No locations found. Try a more specific address.");
      }
    } catch (error) {
      setSearchError(error.message || "Unable to search for this location.");
    } finally {
      setSearchingLocation(false);
      setSearchingType("");
    }
  };

  const handleAddressSelect = (type, result) => {
    const coordinates = [
      Number(result.lat),
      Number(result.lon),
    ];

    handleLocationSelect(type, coordinates);

    if (type === "pickup") {
      setPickupText(result.display_name);
      setPickupResults([]);
    } else {
      setDestinationText(result.display_name);
      setDestinationResults([]);
    }

    // The previous route no longer matches the selected locations.
    setRoute(null);
    setRouteError("");
  };


  const handlePickupChange = (event) => {
    setPickupText(event.target.value);
    setPickup(null);
  };

  const handleDestinationChange = (event) => {
    setDestinationText(event.target.value);
    setDestination(null);
  };


  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coordinates = [
          position.coords.latitude,
          position.coords.longitude,
        ];

        setPickup(coordinates);
        setPickupText(
          coordinates
            .map((coordinate) => coordinate.toFixed(5))
            .join(", ")
        );

        setSelection("destination");
      },
      (error) => {
        console.error("Location error:", error);

        alert(
          "Unable to get your location. Please allow location access and try again."
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };



  const handleSearchRides = async (event) => {
    event.preventDefault();

    if (!pickup || !destination) {
      alert("Please select both locations on the map.");
      return;
    }

    if (
      pickup[0] === destination[0] &&
      pickup[1] === destination[1]
    ) {
      alert("Pickup and destination cannot be the same.");
      return;
    }

    setLoadingRoute(true);
    setRouteError("");
    setRoute(null);

    try {
      // OSRM expects longitude,latitude.
      const start = `${pickup[1]},${pickup[0]}`;
      const end = `${destination[1]},${destination[0]}`;

      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${start};${end}?overview=full&geometries=geojson`
      );

      if (!response.ok) {
        throw new Error("Unable to contact the routing service.");
      }

      const data = await response.json();

      if (data.code !== "Ok" || !data.routes?.length) {
        throw new Error(
          "No driving route found. Please select different locations."
        );
      }

      const result = data.routes[0];

      // Convert GeoJSON [longitude, latitude]
      // to Leaflet [latitude, longitude].
      const coordinates = result.geometry.coordinates.map(
        ([longitude, latitude]) => [latitude, longitude]
      );

      const distanceKm = result.distance / 1000;
      const durationMinutes = Math.ceil(result.duration / 60);

      // Illustrative project fare, not a real market price.
      const multipliers = {
        economy: 1,
        comfort: 1.3,
        premium: 1.8,
        xl: 1.5,
      };

      const baseFare = 30;
      const perKmRate = 12;
      const multiplier = multipliers[rideType] ?? 1;

      const estimatedFare = Math.round(
        (baseFare + distanceKm * perKmRate) * multiplier
      );

      setRoute({
        coordinates,
        distanceKm,
        durationMinutes,
        estimatedFare,
      });
    } catch (error) {
      setRouteError(
        error.message || "Unable to calculate the route."
      );
    } finally {
      setLoadingRoute(false);
    }
  };

  const handleBookRide = async () => {
    if (!pickup || !destination || !route) {
      setRouteError("Please select both locations and search for a ride.");
      return;
    }

    try {
      const multipliers = {
        economy: 1,
        comfort: 1.3,
        premium: 1.8,
        xl: 1.5,
      };

      const fare = Math.round(
        (30 + route.distanceKm * 12) * multipliers[rideType]
      );
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/rides`,
        {
          pickup: {
            address: pickupText,
            coordinates: {
              lat: pickup[0],
              lon: pickup[1],
            },
          },
          destination: {
            address: destinationText,
            coordinates: {
              lat: destination[0],
              lon: destination[1],
            },
          },
          rideType,
          distanceKm: route.distanceKm,
          durationMinutes: route.durationMinutes,
          fare,
        }, { withCredentials: true })
      // const response = await fetch("http://localhost:3000/api/rides", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //     // Add your existing JWT authorization header here
      //     // if your app stores tokens in localStorage.
      //   },
      //   credentials: "include", // Keep if your auth uses cookies
      //   body: JSON.stringify({
      //     pickup: {
      //       address: pickupText,
      //       coordinates: {
      //         lat: pickup[0],
      //         lon: pickup[1],
      //       },
      //     },
      //     destination: {
      //       address: destinationText,
      //       coordinates: {
      //         lat: destination[0],
      //         lon: destination[1],
      //       },
      //     },
      //     rideType,
      //     distanceKm: route.distanceKm,
      //     durationMinutes: route.durationMinutes,
      //     fare: route.fare,
      //   }),
      // });

      const data = response;
      console.log("Data returned from backend", data);
      if (response.status == 201) {
        alert("Ride booked successfully!");
        console.log("Saved ride:", data.data.ride);
      }


    } catch (error) {
      setRouteError(error.message);
    }
  };

  return (
    <>
      <Container fluid className="px-0">
        <Row className="align-items-center g-0 px-3 px-md-4 py-3">
          <Col xs={6} md={3}>
            <Link to="/" className="d-inline-block">
              <img
                src="/logo.png"
                alt="GoRide"
                style={{
                  width: "100%",
                  maxWidth: "145px",
                  height: "auto",
                  display: "block",
                }}
              />
            </Link>
          </Col>

          <Col xs={6} md={9}>
            <nav className="d-none d-md-flex justify-content-end align-items-center gap-3 gap-lg-4">
              <Link
                to="/"
                className="text-decoration-none fw-bold text-success py-2"
              >
                Home
              </Link>

              <Link
                to="/user-rides"
                className="text-decoration-none text-dark py-2"
              >
                My Rides
              </Link>
              
                <button
            className="icon-button"
            onClick={logout}
            title="Log out"
            aria-label="Log out"
          >
            <FaRightFromBracket />
          </button>
            </nav>
          </Col>
        </Row>
      </Container>
      <section style={{ backgroundColor: "#f4f9f7" }}>
        <Container className="py-4 py-md-5">
          <Row className="align-items-center g-3 mb-4">
            <Col xs={12} md={8}>
              <p className="text-success fw-bold mb-2">
                GO WHERE YOU WANT
              </p>

              <h1 className="h2 fw-bold mb-2">
                Welcome Back !!
              </h1>

              <p className="text-muted mb-0">
                Where would you like to go today?
              </p>
            </Col>

            {/* <Col xs={12} md={4} className="text-md-end">
              <Button
                variant="outline-success"
                className="w-100"
                type="button"
                onClick={handleCurrentLocation}
              >
                <FaLocationDot className="me-2" />
                Current Location
              </Button>
            </Col> */}
          </Row>

          <Row className="g-4 align-items-stretch">
            <Col xs={12} lg={5}>
              <Card className="border-0 shadow-sm rounded-4 h-100">
                <Card.Body className="p-3 p-md-4">
                  <h2 className="h4 fw-bold">
                    Book a Ride
                  </h2>

                  <p className="text-muted mb-4">
                    Enter your pickup and destination to get started.
                  </p>
                  <Form onSubmit={handleSearchRides}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        Pickup location
                      </Form.Label>
                      <Form.Control
                        id="pickupLocation"
                        type="text"
                        placeholder="Select pickup on the map"
                        autoComplete="off"
                        value={pickupText}
                        onChange={handlePickupChange}
                        onFocus={() => setSelection("pickup")}
                        required
                      />
                      <Form.Text className="text-muted">
                        Select a point on the map or use Current Location.
                      </Form.Text>
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Destination</Form.Label>
                      <div className="d-flex gap-2">
                        <Form.Control
                          id="destinationLocation"
                          type="text"
                          placeholder="Enter destination address or place"
                          value={destinationText}
                          onChange={(event) => {
                            setDestinationText(event.target.value);
                            setDestination(null);
                            setRoute(null);
                            setDestinationResults([]);
                          }}
                          onFocus={() => setSelection("destination")}
                          required
                        />
                        <Button
                          type="button"
                          variant="outline-success"
                          disabled={searchingLocation}
                          onClick={() => handleAddressSearch("destination")}
                        >
                          {searchingType === "destination" ? "Searching..." : "Search"}
                        </Button>
                      </div>
                      {destinationResults.length > 0 && (
                        <div className="border rounded mt-2 bg-white">
                          {destinationResults.map((result) => (
                            <button
                              type="button"
                              key={result.place_id}
                              className="btn btn-light text-start w-100 rounded-0 border-bottom"
                              onClick={() => handleAddressSelect("destination", result)}
                            >
                              <span className="d-block small">
                                {result.display_name}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </Form.Group>
                    {searchError && (
                      <p className="text-danger small" role="alert">
                        {searchError}
                      </p>
                    )}
                    <Form.Group className="mb-4">
                      <Form.Label>
                        Choose your ride
                      </Form.Label>

                      <Form.Select
                        id="rideType"
                        value={rideType}
                        onChange={(event) =>
                          setRideType(event.target.value)
                        }
                      >
                        <option value="economy">
                          Economy
                        </option>

                        <option value="comfort">
                          Comfort
                        </option>

                        <option value="premium">
                          Premium
                        </option>

                        <option value="xl">
                          XL
                        </option>
                      </Form.Select>
                    </Form.Group>

                    <Button
                      type="submit"
                      variant="success"
                      className="w-100 py-2"
                    >
                      Search Rides →
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} lg={7}>
              <Card className="border-0 shadow-sm rounded-4 overflow-hidden h-100">
                <Card.Body className="p-3">
                  <h2 className="h5 fw-bold mb-3">
                    Select Your Locations
                  </h2>
                  <div className="d-flex flex-wrap gap-2 mb-3">
                    <Button
                      type="button"
                      size="sm"
                      variant={
                        selection === "pickup"
                          ? "success"
                          : "outline-success"
                      }
                      onClick={() => setSelection("pickup")}
                    >
                      Select Pickup
                    </Button>

                    <Button
                      type="button"
                      size="sm"
                      variant={
                        selection === "destination"
                          ? "success"
                          : "outline-success"
                      }
                      onClick={() =>
                        setSelection("destination")
                      }
                    >
                      Select Destination
                    </Button>
                  </div>

                  <p className="small text-muted mb-3">
                    Click the map to select your{" "}
                    <strong>{selection}</strong> location.
                  </p>

                  <div
                    style={{
                      height: "400px",
                      width: "100%",
                    }}
                  >
                    <Map
                      pickup={pickup}
                      destination={destination}
                      selection={selection}
                      onLocationSelect={handleLocationSelect}
                      route={route}
                    />
                  </div>

                  <div className="mt-3 small">
                    <p className="mb-1">
                      <span className="fw-semibold text-success">
                        Pickup:
                      </span>{" "}
                      {pickupText || "Not selected"}
                    </p>

                    <p className="mb-0">
                      <span className="fw-semibold text-success">
                        Destination:
                      </span>{" "}
                      {destinationText || "Not selected"}
                    </p>
                  </div>
                  {loadingRoute && (
                    <p className="text-muted mt-3 mb-0">
                      Calculating your route...
                    </p>
                  )}

                  {routeError && (
                    <p className="text-danger mt-3 mb-0" role="alert">
                      {routeError}
                    </p>
                  )}

                  {route && (
                    <Card className="border-0 bg-light mt-3">
                      <Card.Body>
                        <h3 className="h6 fw-bold">
                          Your Trip Estimate
                        </h3>

                        <Row className="g-3">
                          <Col xs={4}>
                            <div className="small text-muted">Distance</div>
                            <div className="fw-bold">
                              {route.distanceKm.toFixed(1)} km
                            </div>
                          </Col>

                          <Col xs={4}>
                            <div className="small text-muted">Est. time</div>
                            <div className="fw-bold">
                              {route.durationMinutes} min
                            </div>
                          </Col>

                          <Col xs={4}>
                            <div className="small text-muted">Est. fare</div>
                            <div className="fw-bold text-success">
                              ₹{route.estimatedFare}
                            </div>

                            <Button
                              variant="success"
                              onClick={handleBookRide}
                              disabled={!route || !pickup || !destination}
                            >
                              Book Ride
                            </Button>
                          </Col>
                        </Row>

                        <p className="small text-muted mt-3 mb-0">
                          Fare is a demonstration estimate and may differ
                          from the final fare.
                        </p>
                      </Card.Body>
                    </Card>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
      <Container className="py-4 py-md-5">
        <Row className="align-items-center g-3 mb-4">
          <Col>
            <p className="text-success fw-bold mb-1">
              QUICK OPTIONS
            </p>

            <h2 className="h4 fw-bold mb-0">
              Choose Your Ride
            </h2>
          </Col>

          <Col xs="auto">
            <Button
              as={Link}
              to="/rides"
              variant="outline-success"
              size="sm"
            >
              View all →
            </Button>
          </Col>
        </Row>

        <Row className="g-3">
          {rideOptions.map((ride) => (
            <Col
              xs={12}
              sm={6}
              lg={3}
              key={ride.name}
            >
              <Card className="h-100 border-0 shadow-sm rounded-4">
                <Card.Body className="p-3 p-md-4">
                  <h3 className="h5 fw-bold">
                    {ride.name}
                  </h3>

                  <p className="text-muted mb-3">
                    {ride.description}
                  </p>

                  <span className="small text-success fw-semibold">
                    {ride.price}
                  </span>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
};

export default Home;