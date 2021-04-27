import "@babel/polyfill";

/**
  Game of life rules:
    1. Any live cell with two or three live neighbours survives.
    2. Any dead cell with three live neighbours becomes a live cell.
    3. All other live cells die in the next generation. Similarly, all other dead cells stay dead.

  How this works:
    1.
    2.
    3.
*/

const gameOfLife = document.querySelector(".game-of-life");
const button = document.querySelector("#gameButton");
let gameOn = false;

// ----------------------------------
// ----- Game of Life Constants -----
// ----------------------------------
function filterByNodeType(arr, n) {
  return arr.filter((e) => e.nodeType === 1);
}

// An array of rows
const cellRows = filterByNodeType(Array.from(gameOfLife.childNodes), 1);

// An array of arrays of cells
const cellMatrix = cellRows.map((cellRow) =>
  filterByNodeType(Array.from(cellRow.childNodes), 1)
);

// An array of all cells
const cellArray = cellMatrix.flat();

// ----------------------------------
// -------- Event listeners ---------
// ----------------------------------

gameOfLife.addEventListener("click", (e) => {
  if (e.target.classList.contains("cell")) {
    e.target.classList.toggle("alive");
  }
});

button.addEventListener("click", (e) => {
  const btn = e.target;
  if (btn.classList.contains("btn-primary")) {
    // Change button styles
    btn.classList.replace("btn-primary", "btn-danger");
    btn.innerHTML = "Parar";
    // Start Game
    gameOn = true;
    runGameOfLife();
  } else if (btn.classList.contains("btn-danger")) {
    // Change button styles
    btn.classList.replace("btn-danger", "btn-primary");
    btn.innerHTML = "Empezar";
    // Stop Game
    gameOn = false;
  }
});

// ----------------------------------
// ----- Game of Life Functions -----
// ----------------------------------

function isAlive(cell) {
  return cell.classList.contains("alive");
}

function modulus(n, m) {
  if (n < 0) {
    n += m * m;
  } else if (n === 0) {
    // Las celdas empiezan por 1
    return m;
  }
  return n % m;
}

function getCellNeighbours(cell) {
  const id = Number(cell.id.slice(-3));

  const adjacentCellsNumber = [
    // Cross neighbours
    modulus(id - 17, 17 * 17),
    modulus(id + 1, 17 * 17),
    modulus(id + 17, 17 * 17),
    modulus(id - 1, 17 * 17),
    // Diagonal neighbours
    modulus(id - 17 - 1, 17 * 17),
    modulus(id - 17 + 1, 17 * 17),
    modulus(id + 17 - 1, 17 * 17),
    modulus(id + 17 + 1, 17 * 17),
  ];

  const adjacentCellsIds = adjacentCellsNumber.map((id) => {
    return "cell-" + ("000" + id).slice(-3);
  });

  return cellArray.filter((cell) => adjacentCellsIds.includes(cell.id));
}

// Returns the future state of the cell
// If 1 cell should be alive
// If 0 cell should be dead
function getFutureCellState(cell) {
  const neighbours = getCellNeighbours(cell);
  const aliveNeighbours = neighbours.filter((cell) =>
    cell.classList.contains("alive")
  );
  // Any live cell with two or three live neighbours survives
  if (cell.classList.contains("alive")) {
    if (aliveNeighbours.length === 2 || aliveNeighbours.length === 3) {
      return 1;
    }
  }
  // Any dead cell with three live neighbours becomes a live cell
  else {
    if (aliveNeighbours.length === 3) {
      return 1;
    }
  }
  // All other live cells die in the next generation
  // All other dead cells stay dead.
  return 0;
}

function getFutureStates() {
  return cellArray.map((cell) => {
    return { [cell.id]: getFutureCellState(cell) };
  });
}

function updateStates() {
  // Get future cells' state
  const futureStates = getFutureStates();

  // Update cells' state
  futureStates.forEach((cellObj) => {
    // Get cell id
    const cellId = Object.keys(cellObj)[0];
    const cellFutureState = cellObj[cellId];
    const cell = document.querySelector("#" + cellId);

    if (
      (cellFutureState === 0 && isAlive(cell)) ||
      (cellFutureState === 1 && !isAlive(cell))
    ) {
      // Change cell state
      cell.classList.toggle("alive");
    }
  });
}

async function runGameOfLife() {
  while (gameOn) {
    // Update cells state
    updateStates();

    console.log("States updated");
    // Wait
    await new Promise((resolve) => setTimeout(resolve, 300));
  }
}
