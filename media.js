const lightContainer = document.querySelector('.light-container');
const mobileQuery = window.matchMedia('(max-width: 500px)');
const fromtabQuery = window.matchMedia('(min-width: 501px)');
const desktopQuery = window.matchMedia('(min-width: 1024px)');
const landscapeQuery = window.matchMedia('(max-width: 1600px) and (max-height: 640px) and (orientation: landscape)');
let timeoutId;

function checkDevice() {
  const lights = lightContainer.children;
  const totalLights = [lightContainer.children][0].length;
  let rows = 2;
  let cols = 2;
  let width = '15vw';
  let height = '15vw';
  if(mobileQuery.matches) {
    width = '20vw';
    height = '20vw';
    if (totalLights === 2) {
      rows = 2;
      [...lights].forEach((light, i) => {
        light.style.gridRowStart = `${i + 1}`;
        light.style.gridColumn = `${i + 1}`;
      });
    } else if (totalLights === 4) {
      rows = 2;
    } else if (totalLights === 6) {
      rows = 3;
    } else if (totalLights === 8) {
      rows = 4;
    }
  } else if (fromtabQuery.matches) {
    if (totalLights === 2) {
      cols = 2;
      [...lights].forEach((light, i) => {
        light.style.gridRowStart = `${i + 1}`;
        light.style.gridColumn = `${i + 1}`;
      });
    } else if (totalLights === 4) {
      cols = 2;
    } else if (totalLights === 6) {
      cols = 3;
    } else if (totalLights === 8) {
      cols = 4;
    }
  } 
  if (desktopQuery.matches) {
    width = '10vw';
    height = '10vw';
  }
  if (landscapeQuery.matches) {
    width = '15vh';
    height = '15vh';
  }
  
  lightContainer.style.setProperty("--rows", `repeat(${rows}, ${height})`);
  lightContainer.style.setProperty("--cols", `repeat(${cols}, ${width})`);
}
export default function debouncedCheckDevice() {
  clearTimeout(timeoutId);
  timeoutId = setTimeout(checkDevice, 100)
}

export {mobileQuery, desktopQuery, landscapeQuery, fromtabQuery, checkDevice}