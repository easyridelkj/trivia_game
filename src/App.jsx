import React, { useState, useEffect } from 'react';

const QUESTIONS_FILE = '/questions.json';

function loadQuestions() {
  return fetch(QUESTIONS_FILE)
    .then(res => res.json())
    .catch(() => []);
}

function getHighScores() {
  return JSON.parse(localStorage.getItem('highScores') || '[]');
}

function saveHighScore(name, score) {
  const scores = getHighScores();
  scores.push({ name, score });
  scores.sort((a, b) => b.score - a.score);
  localStorage.setItem('highScores', JSON.stringify(scores.slice(0, 10)));
}

export default function App() {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [name, setName] = useState('');
  const [highScores, setHighScores] = useState([]);

  useEffect(() => {
    loadQuestions().then(setQuestions);
    setHighScores(getHighScores());
  }, []);

  function handleAnswer(choice) {
    if (choice === questions[current].answer) {
      setScore(score + 1);
    }
    if (current + 1 < questions.length) {
      setCurrent(current + 1);
    } else {
      setShowScore(true);
    }
  }

  function handleSaveScore() {
    if (name.trim()) {
      saveHighScore(name, score);
      setHighScores(getHighScores());
    }
  }


  if (!questions.length) return <div className="trivia-card">Loading questions...</div>;

  if (showScore) {
    return (
      <div className="score-section">
        <h2 style={{ color: '#2193b0', marginBottom: 16 }}>🎉 Your Score: {score} / {questions.length}</h2>
        <input
          placeholder="Enter your name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <button onClick={handleSaveScore} style={{ marginBottom: 18 }}>Save Score</button>
        <h3 style={{ color: '#185a9d', marginTop: 24 }}>🏆 High Scores</h3>
        <ol style={{ padding: 0, listStyle: 'none', margin: '0 auto', maxWidth: 300 }}>
          {highScores.map((hs, i) => (
            <li key={i} style={{ background: '#f7f7f7', borderRadius: 8, margin: '6px 0', padding: '8px 12px', color: '#2193b0', fontWeight: 'bold' }}>
              {hs.name}: {hs.score}
            </li>
          ))}
        </ol>
        <button onClick={() => window.location.reload()} style={{ marginTop: 18 }}>Play Again</button>
      </div>
    );
  }

  const q = questions[current];
  return (
    <div className="trivia-card">
      <h2 style={{ color: '#2193b0', marginBottom: 16 }}>🧠 Trivia Game</h2>
      <div style={{ fontSize: '1.2rem', marginBottom: 18 }}>
        <strong>Question {current + 1}:</strong> {q.question}
      </div>
      <div style={{ width: '100%', margin: '20px 0' }}>
        {q.choices.map(choice => (
          <button
            key={choice}
            style={{ width: '100%', margin: '8px 0' }}
            onClick={() => handleAnswer(choice)}
          >
            {choice}
          </button>
        ))}
      </div>
      <div style={{ color: '#185a9d', fontWeight: 'bold', marginTop: 12 }}>Score: {score}</div>
    </div>
  );
}
