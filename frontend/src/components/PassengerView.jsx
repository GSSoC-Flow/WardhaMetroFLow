import { useEffect, useState } from "react";
import ShowMap from "./ShowMap";
import "./PassengerView.css";
import MemoisedShowMap from "./ShowMap";
const apiKey = import.meta.env.VITE_API_KEY;
export default function PassengerView() {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [coordsDest, setCoordsDest] = useState([28.6139, 77.209]);
  const [coordsSource, setCoordsSource] = useState([28.6139, 77.209]);

  useEffect(() => {
    async function getSourceCoordinates() {
      const response = await fetch(
        `http://api.openweathermap.org/geo/1.0/direct?q=${source}&appid=${apiKey}`
      );
      const data = await response.json();
      console.log(data);
      const lat = parseFloat(data[0].lat);
      const long = parseFloat(data[0].lon);
      setCoordsSource([lat, long]);
    }

    let timerSource;
    if (source.length > 0) {
      timerSource = setTimeout(() => getSourceCoordinates(), 3000);
    }

    return () => {
      clearTimeout(timerSource);
    };
  }, [source]);

  //destination useeffect
  useEffect(() => {
    async function getDestCoordinates() {
      const response = await fetch(
        `http://api.openweathermap.org/geo/1.0/direct?q=${destination}&appid=${apiKey}`
      );
      const data = await response.json();
      console.log(data);

      const lat = parseFloat(data[0].lat);
      const long = parseFloat(data[0].lon);
      setCoordsDest([lat, long]);
    }
    let timerDest;
    if (destination.length > 0) {
      timerDest = setTimeout(() => getDestCoordinates(), 3000);
    }
    return () => clearTimeout(timerDest);
  }, [destination]);

  function handleDestination(e) {
    e.preventDefault();
    setDestination(e.target.value);
  }
  //source input
  function handleSourceInput(e) {
    e.preventDefault();
    const speechrecognition =
      Window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new speechrecognition();
    recognition.onstart = () => {
      console.log("listening..");
    };
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSource(transcript);
    };
    recognition.onerror = (err) => {
      console.log("some error occured:", err);
    };
    recognition.start();
  }
  //destination input
  function handleDestInput(e) {
    e.preventDefault();
    const speechrecognition =
      Window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new speechrecognition();
    recognition.onstart = () => {
      console.log("listening..");
    };
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setDestination(transcript);
    };
    recognition.onerror = (err) => {
      console.log("some error occured:", err);
    };
    recognition.start();
  }
  return (
    <div className="home">
      <h1>Plan your next trip</h1>
      <div className="route-planner-container">
        <div className="userInput-container">
          <form>
            <fieldset>
              <legend>From</legend>
              <input
                value={source}
                onChange={(e) => setSource(e.target.value)}
                type="text"
              />
              <button onClick={(e) => handleSourceInput(e)}>🎙️</button>
            </fieldset>
            <fieldset>
              <legend>To</legend>
              <input
                type="text"
                value={destination}
                onChange={(e) => handleDestination(e)}
              />
              <button onClick={(e) => handleDestInput(e)}>🎙️</button>
            </fieldset>
          </form>
        </div>
        <div className="map">
          <MemoisedShowMap
            coordsDest={coordsDest}
            coordsSource={coordsSource}
          />
        </div>
      </div>
    </div>
  );
}
