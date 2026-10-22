
import MapComponent from "../components/MapComponent";

export default function BookRide() {
  return (
    <main className="book-ride-page">
      <h1>Where would you like to go?</h1>
      <p>Select your pickup and destination on the map.</p>

      <MapComponent />
    </main>
  );
}