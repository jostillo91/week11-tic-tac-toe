// --- Simple Tic-Tac-Toe (no frameworks) --------------------------------------
// Features required by assignment:
// - 3x3 grid of clickable cells
// - Alternate X / O turns + heading showing whose turn
// - Restart button to reset
// - Detect win and draw
// - Show Bootstrap-styled alert on win/draw
// - Code is commented to show understanding

// DOM refs
const boardEl = document.getElementById('board');
const turnBadge = document.getElementById('turnBadge');
const alertContainer = document.getElementById('alertContainer');
const restartBtn = document.getElementById('restartBtn');

// Game state
let board;           // Array(9) with 'X' | 'O' | null
let currentPlayer;   // 'X' | 'O'
let gameActive;      // boolean

// All winning index triplets: rows, cols, diagonals
const WIN_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
  [0, 4, 8], [2, 4, 6]             // diagonals
];

// Initialize game on load
init();

function init() {
  board = Array(9).fill(null);
  currentPlayer = 'X';
  gameActive = true;

  // Clear all cell UI and (re)attach listeners
  const cells = boardEl.querySelectorAll('.ttt-cell');
  cells.forEach((btn) => {
    btn.textContent = '';
    btn.disabled = false;
    btn.classList.remove('win');
    // In case of re-init, ensure only one listener
    btn.removeEventListener('click', onCellClick);
    btn.addEventListener('click', onCellClick);
  });

  hideAlert();
  updateTurnBadge();
}

// Handles a cell click
function onCellClick(e) {
  if (!gameActive) return;

  const index = Number(e.currentTarget.dataset.index);

  // If cell already taken, do nothing
  if (board[index] !== null) return;

  // Place current player mark in state and UI
  board[index] = currentPlayer;
  setCellUI(index, currentPlayer);

  // Check for a win first, then draw, else switch turns
  const winInfo = getWinInfo();
  if (winInfo) {
    endGameWithWin(winInfo);
    return;
  }

  if (isDraw()) {
    endGameWithDraw();
    return;
  }

  // Switch turns
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  updateTurnBadge();
}

// Update a single cell's UI to the given value
function setCellUI(index, value) {
  const cell = boardEl.querySelector(`.ttt-cell[data-index="${index}"]`);
  cell.textContent = value ? value : '';
  // Disable only when a mark is set
  cell.disabled = Boolean(value);
}

// Update the little badge that shows whose turn it is
function updateTurnBadge() {
  turnBadge.textContent = `${currentPlayer}’s Turn`;
  turnBadge.className = 'badge text-bg-primary';
}

// Return an object describing the winning line, or null if no win
function getWinInfo() {
  for (const [a, b, c] of WIN_LINES) {
    const v1 = board[a], v2 = board[b], v3 = board[c];
    if (v1 && v1 === v2 && v2 === v3) {
      return { player: v1, line: [a, b, c] };
    }
  }
  return null;
}

// Draw = every cell filled and no winner
function isDraw() {
  return board.every((v) => v !== null);
}

// End the game with a winner
function endGameWithWin({ player, line }) {
  gameActive = false;

  // Highlight winning cells
  line.forEach((idx) => {
    const cell = boardEl.querySelector(`.ttt-cell[data-index="${idx}"]`);
    cell.classList.add('win');
  });

  // Disable all cells
  boardEl.querySelectorAll('.ttt-cell').forEach((btn) => (btn.disabled = true));

  // Announce winner with a Bootstrap alert
  showAlert(`${player} wins! 🎉`, 'success');
  // Turn badge reflects completion
  turnBadge.textContent = `${player} wins`;
  turnBadge.className = 'badge text-bg-success';
}

// End the game with a draw
function endGameWithDraw() {
  gameActive = false;

  // Disable all cells
  boardEl.querySelectorAll('.ttt-cell').forEach((btn) => (btn.disabled = true));

  showAlert(`It's a draw. Cat’s game!`, 'warning');
  turnBadge.textContent = `Draw`;
  turnBadge.className = 'badge text-bg-warning';
}

// Show a Bootstrap alert inside the alert container
function showAlert(message, type = 'primary') {
  // type: 'primary' | 'success' | 'warning' | 'danger' ...
  alertContainer.innerHTML = `
    <div class="alert alert-${type} d-flex justify-content-between align-items-center" role="alert">
      <div class="fw-semibold">${message}</div>
      <button type="button" class="btn-close" aria-label="Close"></button>
    </div>
  `;

  // Wire close button
  const closeBtn = alertContainer.querySelector('.btn-close');
  closeBtn.addEventListener('click', hideAlert);
}

// Hide the alert (if shown)
function hideAlert() {
  alertContainer.innerHTML = '';
}

// Public: Restart the game (wired to button)
function restartGame() {
  init();
}

// Wire up restart button
restartBtn.addEventListener('click', restartGame);

// Optional power-user nicety: Press "R" to restart quickly
document.addEventListener('keydown', (e) => {
  if (e.key.toLowerCase() === 'r') restartGame();
});
