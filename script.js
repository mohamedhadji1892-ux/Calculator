const inputBox = document.getElementById("inputBox");
const buttons = document.querySelectorAll("button");

let currentInput = "";
let firstOperand = null;
let operator = null;
let shouldResetScreen = false;

function updateDisplay(value) {
    inputBox.value = value || "0";
}

function clearCalculator() {
    currentInput = "";
    firstOperand = null;
    operator = null;
    shouldResetScreen = false;
    updateDisplay("");
}

function deleteLast() {
    if (shouldResetScreen) {
        currentInput = "";
        shouldResetScreen = false;
    } else {
        currentInput = currentInput.slice(0, -1);
    }

    updateDisplay(currentInput);
}

function calculate(a, b, op) {
    switch (op) {
        case "+":
            return a + b;

        case "*":
            return a * b;

        case "/":
            if (b === 0) {
                throw new Error("Cannot divide by zero");
            }
            return a / b;

        case "%":
            return a % b;

        default:
            return b;
    }
}

function formatResult(number) {
    if (!Number.isFinite(number)) {
        return "Error";
    }

    return String(Number(number.toPrecision(12)));
}

function handleInput(value) {
    if (value === "AC") {
        clearCalculator();
        return;
    }

    if (value === "DEL") {
        deleteLast();
        return;
    }

    if (value === "=") {
        if (operator === null || firstOperand === null || currentInput === "") {
            return;
        }

        const secondOperand = Number(currentInput);

        try {
            const result = calculate(firstOperand, secondOperand, operator);
            currentInput = formatResult(result);
            updateDisplay(currentInput);
        } catch {
            currentInput = "";
            updateDisplay("Error");
        }

        firstOperand = null;
        operator = null;
        shouldResetScreen = true;
        return;
    }

    if (["+", "-", "*", "/", "%"].includes(value)) {
        if (currentInput === "" || currentInput === "Error") {
            return;
        }

        const number = Number(currentInput);

        if (operator !== null && firstOperand !== null && !shouldResetScreen) {
            try {
                firstOperand = calculate(firstOperand, number, operator);
                updateDisplay(formatResult(firstOperand));
            } catch {
                clearCalculator();
                updateDisplay("Error");
                return;
            }
        } else {
            firstOperand = number;
        }

        operator = value;
        currentInput = "";
        shouldResetScreen = false;
        return;
    }

    if (value === ".") {
        if (shouldResetScreen) {
            currentInput = "";
            shouldResetScreen = false;
        }

        if (!currentInput.includes(".")) {
            currentInput += currentInput === "" ? "0." : ".";
        }

        updateDisplay(currentInput);
        return;
    }

    if (/^\d+$/.test(value)) {
        if (shouldResetScreen) {
            currentInput = "";
            shouldResetScreen = false;
        }

        currentInput += value;
        updateDisplay(currentInput);
    }
}

buttons.forEach(button => {
    button.addEventListener("click", () => {
        handleInput(button.textContent.trim());
    });
});

updateDisplay("");
