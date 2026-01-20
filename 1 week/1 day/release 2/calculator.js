let display = document.getElementById('display');
let currentInput = '0';
let previousInput = '';
let operator = '';
let shouldResetDisplay = false;

function updateDisplay() {
    display.value = currentInput;
}

function appendNumber(number) {
    if (shouldResetDisplay) {
        currentInput = '0';
        shouldResetDisplay = false;
    }
    
    if (currentInput === '0' && number !== '.') {
        currentInput = number;
    } else {
        currentInput += number;
    }
    
    updateDisplay();
}

function appendDecimal() {
    if (shouldResetDisplay) {
        currentInput = '0';
        shouldResetDisplay = false;
    }
    
    if (currentInput.indexOf('.') === -1) {
        currentInput += '.';
        updateDisplay();
    }
}

function appendOperator(op) {
    if (operator && !shouldResetDisplay) {
        calculate();
    }
    
    previousInput = currentInput;
    operator = op;
    shouldResetDisplay = true;
}

function calculate() {
    if (!operator || shouldResetDisplay) {
        return;
    }
    
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);
    let result;
    
    switch (operator) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            if (current === 0) {
                currentInput = 'Ошибка';
                updateDisplay();
                resetCalculator();
                return;
            }
            result = prev / current;
            break;
        default:
            return;
    }
    
    currentInput = formatResult(result);
    operator = '';
    previousInput = '';
    shouldResetDisplay = true;
    updateDisplay();
}

function formatResult(result) {
    if (result % 1 !== 0) {
        return result.toFixed(10).replace(/\.?0+$/, '');
    }
    return result.toString();
}

function clearDisplay() {
    currentInput = '0';
    previousInput = '';
    operator = '';
    shouldResetDisplay = false;
    updateDisplay();
}

function clearEntry() {
    currentInput = '0';
    updateDisplay();
}

function deleteLast() {
    if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
    } else {
        currentInput = '0';
    }
    updateDisplay();
}

function resetCalculator() {
    setTimeout(() => {
        clearDisplay();
    }, 1500);
}

updateDisplay();
