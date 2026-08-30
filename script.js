// ===== STATE =====
// A calculator needs to remember three things between button presses:
let currentValue = '0';       // what's currently on screen
let firstOperand = null;      // the number entered before an operator was pressed
let pendingOperator = null;   // which operator (+ − × ÷) is waiting to be applied
let waitingForSecondOperand = false; // true right after you press an operator

const display = document.getElementById('display');
const buttonsContainer = document.querySelector('.buttons');

// ===== DISPLAY HELPER =====
function updateDisplay() {
  display.textContent = currentValue;
}

// ===== DIGIT INPUT =====
function inputDigit(digit) {
  if (waitingForSecondOperand) {
    // Start a fresh number instead of appending to the old result
    currentValue = digit;
    waitingForSecondOperand = false;
  } else {
    // Replace the placeholder "0", otherwise append the new digit
    currentValue = currentValue === '0' ? digit : currentValue + digit;
  }
}

// ===== DECIMAL POINT =====
function inputDecimal() {
  if (waitingForSecondOperand) {
    currentValue = '0.';
    waitingForSecondOperand = false;
    return;
  }
  // Only add a decimal point if there isn't one already
  if (!currentValue.includes('.')) {
    currentValue += '.';
  }
}

// ===== CLEAR =====
function resetCalculator() {
  currentValue = '0';
  firstOperand = null;
  pendingOperator = null;
  waitingForSecondOperand = false;
}

// ===== +/- SIGN TOGGLE =====
function toggleSign() {
  currentValue = (parseFloat(currentValue) * -1).toString();
}

// ===== PERCENT =====
function inputPercent() {
  currentValue = (parseFloat(currentValue) / 100).toString();
}

// ===== ARITHMETIC =====
// A switch statement (an "if-else chain" for a single variable) picks
// the correct operation based on which operator button was pressed.
function calculate(first, second, operator) {
  switch (operator) {
    case '+':
      return first + second;
    case '-':
      return first - second;
    case '×':
      return first * second;
    case '÷':
      return second === 0 ? 'Error' : first / second;
    default:
      return second;
  }
}

// ===== OPERATOR BUTTON PRESSED (+ − × ÷) =====
function handleOperator(nextOperator) {
  const inputValue = parseFloat(currentValue);

  if (pendingOperator && waitingForSecondOperand) {
    // User changed their mind about the operator (e.g. pressed + then ×)
    pendingOperator = nextOperator;
    return;
  }

  if (firstOperand === null) {
    // First operator press in this calculation — just remember the number
    firstOperand = inputValue;
  } else if (pendingOperator) {
    // A calculation is already pending — chain it (e.g. 2 + 3 + 4)
    const result = calculate(firstOperand, inputValue, pendingOperator);
    currentValue = String(result);
    firstOperand = result;
    updateDisplay();
  }

  waitingForSecondOperand = true;
  pendingOperator = nextOperator;
}

// ===== EQUALS BUTTON =====
function handleEquals() {
  const inputValue = parseFloat(currentValue);
  if (pendingOperator === null || firstOperand === null) return;

  const result = calculate(firstOperand, inputValue, pendingOperator);
  currentValue = String(result);

  // Reset for a brand new calculation, but keep the result visible
  firstOperand = null;
  pendingOperator = null;
  waitingForSecondOperand = false;
}

// ===== EVENT DELEGATION =====
// Instead of adding a listener to every single button, we add ONE
// listener to the container and check which button was actually clicked
// via e.target. This is called "event delegation" and it scales much
// better as your UI grows.
buttonsContainer.addEventListener('click', (e) => {
  const button = e.target.closest('.btn');
  if (!button) return; // click landed on the container gap, not a button

  const action = button.dataset.action;
  const value = button.dataset.value;

  if (action === 'digit') {
    inputDigit(value);
  } else if (action === 'decimal') {
    inputDecimal();
  } else if (action === 'clear') {
    resetCalculator();
  } else if (action === 'sign') {
    toggleSign();
  } else if (action === 'percent') {
    inputPercent();
  } else if (action === 'operator') {
    handleOperator(value);
  } else if (action === 'equals') {
    handleEquals();
  }

  updateDisplay();
});