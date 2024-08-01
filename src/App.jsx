import React, { useState, useEffect } from 'react';
import './App.css';
import treasureMap from './photo.jpg';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//npm install react-toastify

const WIDTH = 400;
const HEIGHT = 400;

const getRandomNumber = (size) => Math.floor(Math.random() * size);

const getDistance = (e, target) => {
  const diffX = e.nativeEvent.offsetX - target.x;
  const diffY = e.nativeEvent.offsetY - target.y; 
  return Math.sqrt(diffX * diffX + diffY * diffY); 
}

const getDistanceHint = (distance) => {
  if (distance < 30) return 'Boiling hot!';
  if (distance < 40) return 'Really hot';
  if (distance < 60) return 'Hot';
  if (distance < 100) return 'Warm';
  if (distance < 180) return 'Cold';
  if (distance < 360) return 'Really cold';
  return 'Freezing!';
}

const App = () => {
  const [target, setTarget] = useState({ x: getRandomNumber(WIDTH), y: getRandomNumber(HEIGHT) });
  const [distanceHint, setDistanceHint] = useState('');
  const [clicks, setClicks] = useState(0);
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [gamesWon, setGamesWon] = useState([]);

  useEffect(() => {
    const storedGamesPlayed = localStorage.getItem('gamesPlayed');
    const storedGamesWon = localStorage.getItem('gamesWon');
    if (storedGamesPlayed) {
      setGamesPlayed(parseInt(storedGamesPlayed, 10));
    }
    if (storedGamesWon) {
      setGamesWon(JSON.parse(storedGamesWon));
    }
  }, []);

  const handleClick = (e) => {
    setClicks((prevClicks) => prevClicks + 1);
    const distance = getDistance(e, target);
    const hint = getDistanceHint(distance);
    setDistanceHint(hint);

    if (distance < 20) {
      toast.success(`Found the treasure in ${clicks + 1} clicks!`);
      setGamesPlayed((prevGamesPlayed) => {
        const newGamesPlayed = prevGamesPlayed + 1;
        localStorage.setItem('gamesPlayed', newGamesPlayed);
        return newGamesPlayed;
      });
      setGamesWon((prevGamesWon) => {
        const newGamesWon = [...prevGamesWon, clicks + 1];
        localStorage.setItem('gamesWon', JSON.stringify(newGamesWon));
        return newGamesWon;
      });
      setTarget({ x: getRandomNumber(WIDTH), y: getRandomNumber(HEIGHT) });
      setClicks(0);
      setDistanceHint('');
    }
  };

  const handleReset = () => {
    setGamesPlayed(0);
    setGamesWon([]);
    localStorage.removeItem('gamesPlayed');
    localStorage.removeItem('gamesWon');
    toast.info('Game history has been reset');
  }

  return (
    <>
     <div className="App">
      <h1>Find the treasure</h1>
      <img
        src={treasureMap}
        width={WIDTH}
        height={HEIGHT}
        id="map"
        draggable="false"
        onClick={handleClick}
        alt="Treasure Map"
      />
      <div id="distance">
        <h1>{distanceHint}</h1>
      </div>
      <p>Total games played: {gamesPlayed}</p>
      <p>Total games won: {gamesWon.length}</p>
      <div id="gamesWonContainer">
        <h2>Games won with clicks:</h2>
        <ul>
          {gamesWon.map((clicks, index) => (
            <li key={index}>Game {index + 1}: {clicks} clicks</li>
          ))}
        </ul>
      </div>
      <button onClick={handleReset}>Reset Game History</button>
      <ToastContainer />
    </div>
    </>
  );
}

export default App;







