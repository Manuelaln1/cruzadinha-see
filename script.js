const words = [
  {
    word: "SEGURANÇA",
    clue: "1. Para evitar riscos na internet, precisamos adotar medidas de ____.",
    direction: "down",
    start: { x: 3, y: 1 },
  },
  {
    word: "DESMATAMENTO",
    clue: "2. Remoção da vegetação nativa em grande escala.",
    direction: "across",
    start: { x: 2, y: 2 },
  },
  {
    word: "GD",
    clue: "3. Super-herói.",
    direction: "across",
    start: { x: 3, y: 3 },
  },
  {
    word: "ASSOREAMENTO",
    clue: "4. Terra que entope rios.",
    direction: "across",
    start: { x: 3, y: 9 },
  },
  {
    word: "AGUA",
    clue: "5. Fórmula H₂O.",
    direction: "across",
    start: { x: 6, y: 5 },
  },
  {
    word: "AMAZONIA",
    clue: "6. Maior floresta tropical do mundo.",
    direction: "down",
    start: { x: 6, y: 5 },
  },
  {
    word: "NATUREZA",
    clue: "7. Mundo natural.",
    direction: "across",
    start: { x: 5, y: 12 },
  },
  {
    word: "FLORESTA",
    clue: "8. Grande área coberta por árvores e vida selvagem",
    direction: "across",
    start: { x: 10, y: 7 },
  },
  {
    word: "LIXOELETRÔNICO",
    clue: "9. Aparelhos eletrônicos descartados.",
    direction: "down",
    start: { x: 14, y: 6 },
  },
  {
    word: "TOXICOS",
    clue: "10. Produtos químicos perigosos.",
    direction: "down",
    start: { x: 4, y: 18 },
  },
  {
    word: "CONTAMINAÇÃO",
    clue: "11. Poluição no ar, água ou solo.",
    direction: "across",
    start: { x: 3, y: 19 },
  },
  {
    word: "GUARDIÕES",
    clue: "12. Protetores da floresta.",
    direction: "down",
    start: { x: 7, y: 17 },
  },
  {
    word: "RECICLAGEM",
    clue: "13. Reuso de materiais.",
    direction: "across",
    start: { x: 6, y: 24 },
  },
  {
    word: "BITES",
    clue: "14. Personagem má da HQ.",
    direction: "down",
    start: { x: 9, y: 18 },
  },
  {
    word: "LILA",
    clue: "15. Personagem feminina.",
    direction: "across",
    start: { x: 13, y: 17 },
  },
  {
    word: "MAX",
    clue: "16. Personagem masculino.",
    direction: "down",
    start: { x: 16, y: 16 },
  },
  {
    word: "TRADIÇÕES",
    clue: "17. Costumes antigos.",
    direction: "down",
    start: { x: 18, y: 13 },
  },
  {
    word: "DIGITAIS",
    clue: "18. Relacionado às impressões dos dedos ou ao ambiente virtual.",
    direction: "across",
    start: { x: 11, y: 21 },
  },
  {
    word: "IA",
    clue: "19. Inteligência Artificial.",
    direction: "down",
    start: { x: 14, y: 21 },
  },
];

let grid = [];
let currentWord = null;
let correctWords = new Set();
const maxRows = 30;
const maxCols = 20;

function initializeGrid() {
  const gridElement = document.getElementById("crosswordGrid");
  gridElement.innerHTML = "";

  // Initialize empty grid
  for (let y = 0; y < maxRows; y++) {
    grid[y] = [];
    for (let x = 0; x < maxCols; x++) {
      grid[y][x] = { letter: "", isBlack: true, wordIds: [], number: null };
    }
  }

  // Place words in grid
  words.forEach((wordData, index) => {
    const { word, direction, start } = wordData;

    for (let i = 0; i < word.length; i++) {
      const x = direction === "across" ? start.x + i : start.x;
      const y = direction === "down" ? start.y + i : start.y;

      if (x < maxCols && y < maxRows) {
        grid[y][x].letter = word[i];
        grid[y][x].isBlack = false;
        grid[y][x].wordIds.push(index);
      }
    }
  });

  // Place numbers one cell before each word
  words.forEach((wordData, index) => {
    const { direction, start } = wordData;
    const number = index + 1;

    const numberX = direction === "across" ? start.x - 1 : start.x;
    const numberY = direction === "down" ? start.y - 1 : start.y;

    if (
      numberX >= 0 &&
      numberY >= 0 &&
      numberX < maxCols &&
      numberY < maxRows
    ) {
      // Make sure the number cell is not black and add the number
      grid[numberY][numberX].isBlack = false;
      grid[numberY][numberX].number = number;
    }
  });

  // Create DOM elements
  for (let y = 0; y < maxRows; y++) {
    for (let x = 0; x < maxCols; x++) {
      const cell = document.createElement("div");
      cell.className = `cell ${grid[y][x].isBlack ? "black" : "white"}`;
      cell.dataset.x = x;
      cell.dataset.y = y;

      if (!grid[y][x].isBlack) {
        if (grid[y][x].number && grid[y][x].letter === "") {
          // Cell with only number - no input allowed, same color as background
          cell.className = "cell black";
          const number = document.createElement("div");
          number.className = "number-cell";
          number.textContent = grid[y][x].number;
          cell.appendChild(number);
        } else {
          // Regular input cell
          if (grid[y][x].number) {
            const number = document.createElement("div");
            number.className = "cell-number";
            number.textContent = grid[y][x].number;
            cell.appendChild(number);
          }

          const input = document.createElement("input");
          input.className = "cell-input";
          input.type = "text";
          input.maxLength = 1;
          input.addEventListener("input", handleInput);
          input.addEventListener("focus", handleFocus);
          input.addEventListener("keydown", handleKeyDown);
          cell.appendChild(input);
        }
      }

      gridElement.appendChild(cell);
    }
  }
}

function handleInput(event) {
  const input = event.target;
  const cell = input.parentElement;
  const x = parseInt(cell.dataset.x);
  const y = parseInt(cell.dataset.y);

  input.value = input.value.toUpperCase();

  // Move to next cell if current word is selected
  if (input.value && currentWord) {
    moveToNextCell(x, y);
  }

  checkWords();
  updateProgress();
}

function moveToNextCell(currentX, currentY) {
  if (!currentWord) return;

  const { word, direction, start } = currentWord;

  // Find current position in the word
  let currentIndex = -1;
  for (let i = 0; i < word.length; i++) {
    const wordX = direction === "across" ? start.x + i : start.x;
    const wordY = direction === "down" ? start.y + i : start.y;

    if (wordX === currentX && wordY === currentY) {
      currentIndex = i;
      break;
    }
  }

  // Move to next cell in the word
  if (currentIndex >= 0 && currentIndex < word.length - 1) {
    const nextIndex = currentIndex + 1;
    const nextX = direction === "across" ? start.x + nextIndex : start.x;
    const nextY = direction === "down" ? start.y + nextIndex : start.y;

    const nextCell = document.querySelector(
      `[data-x="${nextX}"][data-y="${nextY}"]`
    );
    const nextInput = nextCell?.querySelector(".cell-input");
    if (nextInput) {
      nextInput.focus();
      nextInput.select();
    }
  }
}

function handleFocus(event) {
  const input = event.target;
  const cell = input.parentElement;
  const x = parseInt(cell.dataset.x);
  const y = parseInt(cell.dataset.y);

  // Clear previous selections
  document
    .querySelectorAll(".cell.selected")
    .forEach((c) => c.classList.remove("selected"));

  // If no current word is selected, try to find one that includes this cell
  if (!currentWord || !isPartOfCurrentWord(x, y)) {
    const cellWordIds = grid[y][x].wordIds;
    if (cellWordIds.length > 0) {
      currentWord = words[cellWordIds[0]];
      highlightWord(currentWord);
      return;
    }
  }

  // Highlight current cell
  cell.classList.add("selected");
}

function isPartOfCurrentWord(x, y) {
  if (!currentWord) return false;

  const { word, direction, start } = currentWord;

  for (let i = 0; i < word.length; i++) {
    const wordX = direction === "across" ? start.x + i : start.x;
    const wordY = direction === "down" ? start.y + i : start.y;

    if (wordX === x && wordY === y) {
      return true;
    }
  }
  return false;
}

function handleKeyDown(event) {
  const input = event.target;
  const cell = input.parentElement;
  const x = parseInt(cell.dataset.x);
  const y = parseInt(cell.dataset.y);

  // Handle backspace
  if (event.key === "Backspace" && !input.value && currentWord) {
    event.preventDefault();
    moveToPreviousCell(x, y);
  }

  // Handle arrow keys
  if (
    event.key === "ArrowRight" ||
    event.key === "ArrowLeft" ||
    event.key === "ArrowUp" ||
    event.key === "ArrowDown"
  ) {
    event.preventDefault();
    navigateWithArrows(event.key, x, y);
  }
}

function moveToPreviousCell(currentX, currentY) {
  if (!currentWord) return;

  const { word, direction, start } = currentWord;

  // Find current position in the word
  let currentIndex = -1;
  for (let i = 0; i < word.length; i++) {
    const wordX = direction === "across" ? start.x + i : start.x;
    const wordY = direction === "down" ? start.y + i : start.y;

    if (wordX === currentX && wordY === currentY) {
      currentIndex = i;
      break;
    }
  }

  // Move to previous cell in the word
  if (currentIndex > 0) {
    const prevIndex = currentIndex - 1;
    const prevX = direction === "across" ? start.x + prevIndex : start.x;
    const prevY = direction === "down" ? start.y + prevIndex : start.y;

    const prevCell = document.querySelector(
      `[data-x="${prevX}"][data-y="${prevY}"]`
    );
    const prevInput = prevCell?.querySelector(".cell-input");
    if (prevInput) {
      prevInput.focus();
      prevInput.select();
    }
  }
}

function navigateWithArrows(key, x, y) {
  let newX = x,
    newY = y;

  switch (key) {
    case "ArrowRight":
      newX++;
      break;
    case "ArrowLeft":
      newX--;
      break;
    case "ArrowDown":
      newY++;
      break;
    case "ArrowUp":
      newY--;
      break;
  }

  // Check if new position is valid and has an input (skip number-only cells)
  if (
    newX >= 0 &&
    newX < maxCols &&
    newY >= 0 &&
    newY < maxRows &&
    !grid[newY][newX].isBlack
  ) {
    const newCell = document.querySelector(
      `[data-x="${newX}"][data-y="${newY}"]`
    );
    const newInput = newCell?.querySelector(".cell-input");
    if (newInput) {
      newInput.focus();
      newInput.select();
    }
  }
}

function checkWords() {
  words.forEach((wordData, index) => {
    const { word, direction, start } = wordData;
    let isComplete = true;
    let currentWord = "";

    for (let i = 0; i < word.length; i++) {
      const x = direction === "across" ? start.x + i : start.x;
      const y = direction === "down" ? start.y + i : start.y;

      const cell = document.querySelector(`[data-x="${x}"][data-y="${y}"]`);
      const input = cell?.querySelector(".cell-input");
      const value = input?.value || "";

      currentWord += value;
      if (value !== word[i]) {
        isComplete = false;
      }
    }

    if (isComplete && currentWord === word) {
      if (!correctWords.has(index)) {
        correctWords.add(index);
        markWordAsCorrect(wordData, index);
      }
    }
  });
}

function markWordAsCorrect(wordData, index) {
  const { word, direction, start } = wordData;

  for (let i = 0; i < word.length; i++) {
    const x = direction === "across" ? start.x + i : start.x;
    const y = direction === "down" ? start.y + i : start.y;

    const cell = document.querySelector(`[data-x="${x}"][data-y="${y}"]`);
    if (cell) {
      cell.classList.add("correct");
    }
  }

  // Mark clue as completed
  const clueElement = document.querySelector(`[data-word-index="${index}"]`);
  if (clueElement) {
    clueElement.classList.add("completed");
  }
}

function updateProgress() {
  const progress = correctWords.size;
  const total = words.length;
  const percentage = (progress / total) * 100;

  document.getElementById("progressText").textContent = `${progress}/${total}`;
  document.getElementById("progressFill").style.width = `${percentage}%`;

  if (progress === total) {
    setTimeout(() => {
      showCongratulations();
    }, 500);
  }
}

function showCongratulations() {
  // Create celebration overlay
  const overlay = document.createElement("div");
  overlay.className = "celebration-overlay";

  const congratsBox = document.createElement("div");
  congratsBox.className = "congratulations-box";

  congratsBox.innerHTML = `
                <h1 class="celebration-title">PARABÉNS!</h1>
                <p class="celebration-message">Você completou a Cruzadinha Amazônica!</p>
                <p class="celebration-subtitle">Agora você é um verdadeiro Guardião da Floresta!</p>
                <button onclick="resetGame(); this.parentElement.parentElement.remove();" class="celebration-button">
                    Jogar Novamente 
                </button>
            `;

  overlay.appendChild(congratsBox);
  document.body.appendChild(overlay);

  // Add confetti effect
  createConfetti();
}

function createConfetti() {
  const colors = ["#22c55e", "#86efac", "#fbbf24", "#f59e0b", "#10b981"];

  for (let i = 0; i < 50; i++) {
    setTimeout(() => {
      const confetti = document.createElement("div");
      confetti.className = "confetti";
      confetti.style.background =
        colors[Math.floor(Math.random() * colors.length)];
      confetti.style.left = Math.random() * 100 + "%";
      confetti.style.top = "-10px";
      confetti.style.animationDuration = 2 + Math.random() * 3 + "s";

      document.body.appendChild(confetti);

      setTimeout(() => confetti.remove(), 5000);
    }, i * 100);
  }
}

function createClues() {
  const acrossClues = document.getElementById("acrossClues");
  const downClues = document.getElementById("downClues");

  words.forEach((wordData, index) => {
    const clueDiv = document.createElement("div");
    clueDiv.className = "clue";
    clueDiv.textContent = wordData.clue;
    clueDiv.dataset.wordIndex = index;

    clueDiv.addEventListener("click", () => {
      highlightWord(wordData);
    });

    if (wordData.direction === "across") {
      acrossClues.appendChild(clueDiv);
    } else {
      downClues.appendChild(clueDiv);
    }
  });
}

function highlightWord(wordData) {
  // Set current word for navigation
  currentWord = wordData;

  // Clear previous selections
  document
    .querySelectorAll(".cell.selected")
    .forEach((c) => c.classList.remove("selected"));

  const { word, direction, start } = wordData;

  for (let i = 0; i < word.length; i++) {
    const x = direction === "across" ? start.x + i : start.x;
    const y = direction === "down" ? start.y + i : start.y;

    const cell = document.querySelector(`[data-x="${x}"][data-y="${y}"]`);
    if (cell) {
      cell.classList.add("selected");
    }
  }

  // Focus on first cell
  const firstCell = document.querySelector(
    `[data-x="${start.x}"][data-y="${start.y}"]`
  );
  const firstInput = firstCell?.querySelector(".cell-input");
  if (firstInput) {
    firstInput.focus();
    firstInput.select();
  }
}

function resetGame() {
  // Clear all inputs
  document.querySelectorAll(".cell-input").forEach((input) => {
    input.value = "";
  });

  // Remove all correct and selected classes
  document.querySelectorAll(".cell").forEach((cell) => {
    cell.classList.remove("correct", "selected");
  });

  // Remove completed class from clues
  document.querySelectorAll(".clue").forEach((clue) => {
    clue.classList.remove("completed");
  });

  // Reset game state
  correctWords.clear();
  currentWord = null;

  // Update progress
  updateProgress();
}

// Initialize the game
initializeGrid();
createClues();
updateProgress();

(function () {
  function c() {
    var b = a.contentDocument || a.contentWindow.document;
    if (b) {
      var d = b.createElement("script");
      d.innerHTML =
        "window.__CF$cv$params={r:'986de232b412f1ab',t:'MTc1OTE3NDEwNi4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";
      b.getElementsByTagName("head")[0].appendChild(d);
    }
  }
  if (document.body) {
    var a = document.createElement("iframe");
    a.height = 1;
    a.width = 1;
    a.style.position = "absolute";
    a.style.top = 0;
    a.style.left = 0;
    a.style.border = "none";
    a.style.visibility = "hidden";
    document.body.appendChild(a);
    if ("loading" !== document.readyState) c();
    else if (window.addEventListener)
      document.addEventListener("DOMContentLoaded", c);
    else {
      var e = document.onreadystatechange || function () {};
      document.onreadystatechange = function (b) {
        e(b);
        "loading" !== document.readyState &&
          ((document.onreadystatechange = e), c());
      };
    }
  }
})();

