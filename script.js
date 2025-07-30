const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generatebutton");
const allCheckbox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~@#$%^&*()_+-}[}]{/*.<:>?/";';

let password = "";
let passwordLength = 10;
let checkCount = 1;
setindicator("#ccc")
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;

    const min = inputSlider.min;
    const max = inputSlider.max;
    const percent = ((passwordLength - min) * 100) / (max - min);


    inputSlider.style.backgroundSize = `${percent}% 100%`;
}


function setindicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomNumber() {
    return getRndInteger(0, 10);
}
function generateUppercase() {
    return String.fromCharCode(getRndInteger(65, 91));
}
function generateLowercase() {
    return String.fromCharCode(getRndInteger(97, 123));
}
function generateSymbols() {
    let randIdx = getRndInteger(0, symbols.length);
    return symbols.charAt(randIdx);
}

function calcStrength() {
    let hasUpper = uppercaseCheck.checked;
    let hasLower = lowercaseCheck.checked;
    let hasNumbers = numbersCheck.checked;
    let hasSymbols = symbolsCheck.checked;

    if (hasUpper && hasLower && (hasNumbers || hasSymbols) && passwordLength >= 8) {
        setindicator("#0f0");
    }
    else if ((hasLower || hasUpper) && (hasNumbers || hasSymbols) && passwordLength >= 6) {
        setindicator("#ff0");
    }
    else {
        setindicator("#f00");
    }
}

async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied";
    }
    catch (e) {
        copyMsg.innerText = "Failed";
    }
    copyMsg.classList.add("active");

    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 1000);
}

inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
});

copyBtn.addEventListener('click', () => {
    if (passwordDisplay.value) {
        copyContent();
    }
});

function handleCheckboxChange() {
    checkCount = 0;
    allCheckbox.forEach((checkbox) => {
        if (checkbox.checked) checkCount++;
    });

    if (passwordLength <= checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((a) => {
        str += (a);
    })
    return str;
}

allCheckbox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckboxChange);
});

generateBtn.addEventListener('click', () => {
    if (checkCount <= 0) return;

    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    password = "";

    let funarray = [];
    if (uppercaseCheck.checked) funarray.push(generateUppercase);
    if (lowercaseCheck.checked) funarray.push(generateLowercase);
    if (numbersCheck.checked) funarray.push(getRandomNumber);
    if (symbolsCheck.checked) funarray.push(generateSymbols);

    // compulsory addition
    for (let i = 0; i < funarray.length; i++) {
        password += funarray[i]();
    }

    // remaining addition
    for (let i = 0; i < passwordLength - funarray.length; i++) {
        let randIdx = getRndInteger(0, funarray.length);
        password += funarray[randIdx]();
    }

    // shuffling
    password = shuffle(Array.from(password));
    passwordDisplay.value = password;

    calcStrength();
});


