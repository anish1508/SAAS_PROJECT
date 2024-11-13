import React, { useState, useEffect } from 'react';
import './Game.css';

const getRandomPosition = () => {
 const maxPosition = 99;
 const minPosition = 0;
 return Math.floor(Math.random() * (maxPosition - minPosition + 1)) + minPosition;
};

const Game = () => {
 const [snake, setSnake] = useState([{ x: 20, y: 20 }]);
 const [food, setFood] = useState({ x: getRandomPosition(), y: getRandomPosition() });
 const [score, setScore] = useState(0);
 const [direction, setDirection] = useState('ArrowRight');
 const [gameSpeed, setGameSpeed] = useState(100);
 const [isGameOver, setIsGameOver] = useState(false);

 const moveSnake = () => {
    let newSnake = [...snake];
    const head = newSnake[0];
    let newHead;

    switch (direction) {
      case 'ArrowUp':
        newHead = { x: head.x, y: head.y - 1 };
        break;
      case 'ArrowDown':
        newHead = { x: head.x, y: head.y + 1 };
        break;
      case 'ArrowLeft':
        newHead = { x: head.x - 1, y: head.y };
        break;
      case 'ArrowRight':
        newHead = { x: head.x + 1, y: head.y };
        break;
      default:
        newHead = { x: head.x + 1, y: head.y };
        break;
    }


    if (newHead.x < 0 || newHead.x > 99 || newHead.y < 0 || newHead.y > 99) {
      setIsGameOver(true);
      return;
    }

    newSnake.unshift(newHead);

    if (checkCollision(newHead)) {
      setIsGameOver(true);
      return;
    }

    if (newHead.x === food.x && newHead.y === food.y) {
      setScore(score + 1);
      setFood({ x: getRandomPosition(), y: getRandomPosition() });
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
};
 const checkCollision = (position) => {
    const hitWall = position.x < 0 || position.x > 99 || position.y < 0 || position.y > 99;
    const hitSnake = snake.some(segment => segment.x === position.x && segment.y === position.y);
    return hitWall || hitSnake;
 };

 useEffect(() => {
    const interval = setInterval(moveSnake, gameSpeed);
    return () => clearInterval(interval);
 }, [direction, snake, food, score]);

 useEffect(() => {
    const handleKeyPress = (event) => {
      const newDirection = event.code;
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(newDirection)) {
        setDirection(newDirection);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
 }, []);

 const handleRestart = () => {
    setSnake([{ x: 20, y: 20 }]);
    setFood({ x: getRandomPosition(), y: getRandomPosition() });
    setScore(0);
    setDirection('ArrowRight');
    setGameSpeed(100);
    setIsGameOver(false);
 };

 return (
  <div>
    <h1>Snake Game</h1>
    <div className="game">
      {isGameOver && <div className="game-over">Game Over!</div>}
      <div className="score">Score: {score}</div>
      <div className="game-container">
        {snake.map((segment, index) => (
          <div key={index} className={`snake-segment ${index === 0 ? 'snake-head' : ''}`} style={{ left: segment.x * 10, top: segment.y * 10 }}></div>
        ))}
        <div className="food" style={{ left: food.x * 10, top: food.y * 10 }}></div>
      </div>
      {isGameOver && <button onClick={handleRestart}>Restart</button>}
    </div>
    </div>  
 );
};

export default Game;