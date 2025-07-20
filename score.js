const score = document.querySelector('.score');
const highScore = document.querySelector('.high-score');
let yourHighScore = [
  {
    id: 'two-lights',
    score: {
      score15: 0,
      score30: 0,
      score45: 0,
      score60: 0
    }
  },
  {
    id: 'four-lights',
    score: {
      score15: 0,
      score30: 0,
      score45: 0,
      score60: 0
    }
  },
  {
    id: 'six-lights',
    score: {
      score15: 0,
      score30: 0,
      score45: 0,
      score60: 0
    }
  },
  {
    id: 'eight-lights',
    score: {
      score15: 0,
      score30: 0,
      score45: 0,
      score60: 0
    }
  }
];

storeHighScore();

function updateScore(yourScore, select, timeVal) {
  const variable = 'score' + timeVal;
  score.innerHTML = yourScore;
  const value = parseInt(select.value);
  if (value === 2) {
    score.innerHTML = yourScore;
    if (yourHighScore[0].score[variable] < yourScore) {
      yourHighScore[0].score[variable] = yourScore;
      storeHighScore();
    }
  } else if (value === 4) {
    score.innerHTML = yourScore;
    if (yourHighScore[1].score[variable] < yourScore) {
      yourHighScore[1].score[variable] = yourScore;
      storeHighScore();
    }
  } else if (value === 6) {
    score.innerHTML = yourScore;
    if (yourHighScore[2].score[variable] < yourScore) {
      yourHighScore[2].score[variable] = yourScore;
      storeHighScore();
    }
  } else if (value === 8) {
    score.innerHTML = yourScore;
    if (yourHighScore[3].score[variable] < yourScore) {
      yourHighScore[3].score[variable] = yourScore;
      storeHighScore();
    }
  }
  updatHighScore(highScore, select, variable);
}

function storeHighScore() {
  localStorage.setItem('HIGH_SCORE', JSON.stringify(yourHighScore));
}

function updatHighScore(highScore, select, variable) {
  const value = parseInt(select.value);
  let storedHighScore = JSON.parse(localStorage.getItem('HIGH_SCORE'));

  if (!storedHighScore) {
    storedHighScore = yourHighScore;
    localStorage.setItem('HIGH_SCORE', JSON.stringify(storedHighScore));
  }

  if (value === 2) {
    highScore.innerHTML = storedHighScore[0].score[variable];
  } else if (value === 4) {
    highScore.innerHTML = storedHighScore[1].score[variable];
  } else if (value === 6) {
    highScore.innerHTML = storedHighScore[2].score[variable];
  } else if (value === 8) {
    highScore.innerHTML = storedHighScore[3].score[variable];
  }
}

export {updateScore}