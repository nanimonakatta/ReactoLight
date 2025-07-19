const score = document.querySelector('.score');
const highScore = document.querySelector('.high-score');
let yourHighScore = [
  {
    id: 'two-lights',
    score: 0
  },
  {
    id: 'four-lights',
    score: 0
  },
  {
    id: 'six-lights',
    score: 0
  },
  {
    id: 'eight-lights',
    score: 0
  }
];

function updateScore(yourScore, select) {
  score.innerHTML = yourScore;
  const value = parseInt(select.value);
  if (value === 2) {
    score.innerHTML = yourScore;
    if (yourHighScore[0].score < yourScore) {
      yourHighScore[0].score = yourScore;
      storeHighScore();
    }
  } else if (value === 4) {
    score.innerHTML = yourScore;
    if (yourHighScore[1].score < yourScore) {
      yourHighScore[1].score = yourScore;
      storeHighScore();
    }
  } else if (value === 6) {
    score.innerHTML = yourScore;
    if (yourHighScore[2].score < yourScore) {
      yourHighScore[2].score = yourScore;
      storeHighScore();
    }
  } else if (value === 8) {
    score.innerHTML = yourScore;
    if (yourHighScore[3].score < yourScore) {
      yourHighScore[3].score = yourScore;
      storeHighScore();
    }
  }
  updatHighScore(highScore, select);
}

function storeHighScore() {
  localStorage.setItem('HIGH_SCORE', JSON.stringify(yourHighScore));
}

function updatHighScore(highScore, select) {
  const value = parseInt(select.value);
  const storedHighScore = JSON.parse(localStorage.getItem('HIGH_SCORE'));

  if (!storedHighScore) {
    storedHighScore = [
      { id: 'two-lights', score: 0 },
      { id: 'four-lights', score: 0 },
      { id: 'six-lights', score: 0 },
      { id: 'eight-lights', score: 0 }
    ];
    localStorage.setItem('HIGH_SCORE', JSON.stringify(storedHighScore));
  }

  if (value === 2) {
    highScore.innerHTML = storedHighScore[0].score;
  } else if (value === 4) {
    highScore.innerHTML = storedHighScore[1].score;
  } else if (value === 6) {
    highScore.innerHTML = storedHighScore[2].score;
  } else if (value === 8) {
    highScore.innerHTML = storedHighScore[3].score;
  }
}

export {updateScore, updatHighScore, storeHighScore}