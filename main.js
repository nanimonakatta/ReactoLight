import { updateScore } from "./score.js";
import debouncedCheckDevice, {checkDevice, mobileQuery, desktopQuery, landscapeQuery, fromtabQuery} from "./media.js";

const lightContainer = document.querySelector('.light-container');
const select = document.querySelector('select'); 
const detailsInp =document.querySelectorAll('.details-content input');
const startBtn = document.querySelector('.start-btn'); 
const countdownSpan = document.querySelector('.countdown');
const createdScore = document.querySelector('.created-score');
const timeRemainingSpan = document.querySelector('.time-remaining');
const wantTimer = document.querySelectorAll('.timer-need input');
const details = document.querySelector('details');
const summary = document.querySelector('summary');
const colors = ['#f5c280', '#eeec79', '#64ed98', '#63deed', '#b8a67a', '#ad7ab8', '#7a89b8', '#f18d8b'];
const audios = [
  new Audio('./assets/B.mp3'), 
  new Audio('./assets/C.mp3'),
  new Audio('./assets/F.mp3'),
  new Audio('./assets/E.mp3'),
  new Audio('./assets/B.mp3'),
  new Audio('./assets/C.mp3'),
  new Audio('./assets/E.mp3'),
  new Audio('./assets/D.mp3'),
  new Audio('./assets/B.mp3'),
  new Audio('./assets/C.mp3'),
  new Audio('./assets/F.mp3'),
  new Audio('./assets/E.mp3'),
  new Audio('./assets/D.mp3'),
  new Audio('./assets/C.mp3'),
  new Audio('./assets/extra.mp3')
];
const wrong = new Audio('./assets/wrong.mp3');
let isButtonVisible = true;
let isGamePlaying = false;
let isGameStarted = false;
let timeoutId1;
let timeoutId2;
let timeoutId3;
let timeoutId4;
let intervalId;
let randomId = '';
let yourScore = 0;
let timeRemaining = 0;
let wantTimerVal = 1; // 1 for 'yes' 0 for 'no'
let audioNumberToPlay = 0;


document.addEventListener('DOMContentLoaded', function() {
  selectNoOfLights();
  createLights(select.value);
  switchOnLight();
  updateScore(yourScore, select);
  updateTimerOnScreen();
  wantTimerFun();
  chnageSummaryIcon();
  assignTime();

  mobileQuery.addEventListener('change', debouncedCheckDevice);
  fromtabQuery.addEventListener('change', debouncedCheckDevice);
  desktopQuery.addEventListener('change', debouncedCheckDevice);
  landscapeQuery.addEventListener('change', debouncedCheckDevice);
  document.body.querySelector('main').addEventListener('click', hideDetailsElement);
  document.body.querySelector('footer').addEventListener('click', hideDetailsElement);
  detailsInp.forEach((input) => input.addEventListener('click', () => changeToSelectedTime(input)));
});


// THE__TIMER__WHICH__OCCURS__WHEN__YOU__CLICK__START__GAME__BUTTON
function wantTimerFun() {
  wantTimer.forEach((input) => {
    input.addEventListener('click', function() {
      wantTimerVal = parseInt(input.value);
    })
  })
}


// UPDATES__TIMER__ON__SCREEN
function updateTimerOnScreen() {
  timeRemainingSpan.innerHTML = timeRemaining;
}


// ENDS__GAME
let timeoutId5;
function endGame() {
  isGamePlaying = false;
  startBtn.innerHTML = 'New Game';
  isButtonVisible = true;
  assignTime();
  updateTimerOnScreen();
  if (intervalId) clearInterval(intervalId);
  updateScore(yourScore, select);
  if (wantTimerVal === 0) {
    clearTimeout(timeoutId5);
    setTimeout(function() {
      startBtn.style.transform = 'scale(1)';
    }, 500);
  } else {
    startBtn.style.transform = 'scale(1)';
  }
  hideLights();
  audioNumberToPlay = 0;
}


// ALL__COUNTDOWN__RELATED__QUERIES__SECTION
function onTimerRunning() {
  intervalId = setInterval(function() {
    if (isGameStarted && timeRemaining > 0) {
      timeRemaining--;
    } else if (timeRemaining <= 0) {
      endOnStop();
    }
    updateTimerOnScreen();
  }, 1000);
}
function checkIfClickingStopped() {
  if (timeRemaining > 5) {
    timeoutId3 = setTimeout(function() {
      endOnStop();
    }, 5000);
  }
}
function endOnStop() {
  if (intervalId) clearInterval(intervalId);
  isGamePlaying = false;
  isGameStarted = false;
  switchOffLight();
  resetDisplay();
  updateTimerOnScreen();
}



function assignTime() {
  let timeVal = 0;
  detailsInp.forEach((input) => {
    if (input.hasAttribute('checked')) {
      timeVal = parseInt(input.value);
    }
  })
  timeRemaining = timeVal;
  updateTimerOnScreen();
}
function changeToSelectedTime(input) {
  detailsInp.forEach((inp) => {
    inp.removeAttribute('checked');
  })
  input.setAttribute('checked', true);
  if (intervalId) {
    clearInterval(intervalId);
    resetDisplay();
  }
  assignTime();
}


// RELOADS__THE__PAGE__ON__SELECTING__LEVEL/LIGHTS__AND__WHEN__GAME__ENDS__SECTION
function selectNoOfLights() {
  select.addEventListener('change', function() {
    if (intervalId) clearInterval(intervalId);
    resetDisplay();
  });
}
function resetDisplay() {
  clearTimeout(timeoutId1);
  clearTimeout(timeoutId2);
  countdownSpan.innerHTML = '';
  const noOfLights = parseInt(select.value);
  generateRandomIds(noOfLights);
  createLights(noOfLights);
  switchOnLight();
  assignTime();
  updateScore(yourScore, select);
  audioNumberToPlay = 0;
}


// CREATE__LIGHTS
function createLights(value) {
  let lightHTML = '';
  for (let i = 1; i <= value; i++) {
    lightHTML += `
      <div id=light${i}>
      <button style="background-color: ${colors[i - 1]};" disabled=${isGamePlaying ? false : true }></button>
      </div>`;
  }
  lightContainer.innerHTML = lightHTML;
  lightContainer.style.pointerEvents = 'none';
  generateRandomIds(value);
  checkDevice();
  handleClick(value);
}


// HANDLES__CLICK__EVENT__ON__EVERY__LIGHT__SECTION
function handleClick(value) {
  const lights = lightContainer.children;
  generateRandomIds(value);
  buttonBehaviour();
  [...lights].forEach((light) => {
    light.style.transform = 'scale(0)';
  })
  lightContainer.removeEventListener('click', proceedOnClick);
  lightContainer.addEventListener('click', proceedOnClick);
}
function proceedOnClick(event) {
  clearTimeout(timeoutId3);
  isGamePlaying ? 
    [...lightContainer.children].forEach((child) => child.style.cursor = "pointer") :
    [...lightContainer.children].forEach((child) => child.style.cursor = "default")
  if (isGamePlaying) {
    if (event.target.id === randomId) {
      showItsClicked(event.target.children[0]);
      yourScore += 50;
      generateRandomIds(select.value);
      switchOnLight();
      playSound();
    } else if (event.target.id !== randomId && [...lightContainer.children].some((child) => child.id === event.target.id)) {
      wrong.currentTime = 0.05;
      wrong.play();
      yourScore -= 100;
      if (yourScore < 0) {
        yourScore = 0;
        endGame();
        return;
      }
    }
    updateScore(yourScore, select);
    checkIfClickingStopped();
  }
}


// IT__HELPS__TO__KNOW__WHETHER__THE__LIGHT__IS__CLICKED__OR__NOT
function showItsClicked(button) {
  button.classList.add('active');
  setTimeout(function() {
    button.classList.remove('active');
  }, 100);
}


// GENERATING__RANDOM__id__FOR__LIGHT__SELECTION(which light will be swithced on)
function generateRandomIds(value) {
  randomId = `light${Math.floor(Math.random() * value) + 1}`;
}


// LIGHT__IS__ON__OR__NOT__SECTION
function switchOnLight() {
  const lights = lightContainer.children;
  [...lights].forEach((light) => {
    if (light.id === randomId) {
      light.children[0].style.filter = 'brightness(1.2)';
      light.children[0].style.boxShadow = `
        0 0 5px 0 rgba(255, 255, 255, 0.4),
        0 0 10px 0 rgba(255, 255, 255, 0.4),
        0 0 30px 0 rgba(255, 255, 255, 0.4)
      `;
    } else {
      light.children[0].style.filter = 'brightness(0.3)';
      light.children[0].style.boxShadow = 'none';
    }
  })
}
function switchOffLight() {
  if(!isGamePlaying) {
    const lights = lightContainer.children;
    [...lights].forEach((light) => {
      light.children[0].style.filter = 'brightness(0.3)';
      light.children[0].style.boxShadow = 'none';
    });
  }
}


// LIGHT__IS__SHOWING__OR__NOT__SECTION
function showLights() {
  if (isGamePlaying) {
    const lights = lightContainer.children;
    lightContainer.style.pointerEvents = 'auto';
    [...lights].forEach((light) => {
      light.style.transform = 'scale(1)';
    });
  }
}
function hideLights() {
  if (!isGamePlaying) {
    const lights = lightContainer.children;
    [...lights].forEach((light) => {
      light.style.transform = 'scale(0)';
    });
  }
}


// START__BUTTON__BEHAVIOUR__SECTION
function buttonBehaviour() {
  if (!isButtonVisible) {
    startBtn.style.transform = 'scale(1)';
    clearTimeout(timeoutId4);
    if (yourScore !== 0) {
      createdScore.innerHTML = yourScore;
      timeoutId4 = setTimeout(function() {
        createdScore.style.opacity = 1;
      }, 700);
    }
    assignTime();
    updateTimerOnScreen();
  }
  if (isButtonVisible && !isGamePlaying){
    startBtn.removeEventListener('click', handleButtonClick);
    startBtn.addEventListener('click', handleButtonClick);
  }
}

function handleButtonClick() {
  if (timeoutId1) clearTimeout(timeoutId1);
  if (timeoutId2) clearTimeout(timeoutId2);
  startBtn.style.transform = 'scale(0)';
  countdownSpan.innerHTML = '';
  countdownSpan.style.transform = 'scale(1)';
  isButtonVisible = false;
  isGamePlaying = true;
  yourScore = 0;
  createdScore.style.opacity = 0;
  updateScore(yourScore, select);
    async function countdown() {
      if (wantTimerVal === 1) {
        for(let i = 4; i > 0; i--) {
          await new Promise((resolve, reject) => {
            clearTimeout(timeoutId1);
            timeoutId1 = setTimeout(function() {
              if (i > 1) {
                countdownSpan.innerHTML = i-1;
              } else {
                countdownSpan.innerHTML = 'GO';
                isGameStarted = true;
                onTimerRunning();
                checkIfClickingStopped();
                async function vanishGoText() {
                  await new Promise((resolve, reject) => {
                    clearTimeout(timeoutId2);
                    timeoutId2 = setTimeout(function() {
                      countdownSpan.style.transform = 'scale(0)';
                      showLights();
                      resolve();
                    }, 500);
                  })
                }
                vanishGoText();
              }
              resolve();
            }, 1000);
          })
        }
      } else {
        isGameStarted = true;
        onTimerRunning();
        checkIfClickingStopped();
        showLights();
      }
    };
  countdown();
}


// CORRECT__SOUND__PLAYING
function playSound() {
  if (audioNumberToPlay >= audios.length) {
    audioNumberToPlay = 0;
  }
  if (audios[audioNumberToPlay]) {
    audios[audioNumberToPlay].currentTime = 0;
    audios[audioNumberToPlay].play();
  }
  audioNumberToPlay++;
}


// DETAILS__SECTION
function hideDetailsElement() {
  details.hasAttribute('open') && details.removeAttribute('open')
}
function chnageSummaryIcon() {
  details.addEventListener('toggle', function() {
    if (details.hasAttribute('open')) {
      summary.innerHTML = '<i class="ri-close-large-fill"></i>'; 
      summary.style.color = 'red';
    } else {
      summary.innerHTML = '<i class="ri-menu-line"></i>';
      summary.style.color = 'whitesmoke';
    }
  });
}