const inputSlider=document.querySelector("[data-lengthSlider]");
const lengthDisplay=document.querySelector("[data-lengthNumber]");
const passwordDisplay=document.querySelector("[data-passwordDisplay]");
const copyBtn=document.querySelector("[data-copy]");
const copyMsg=document.querySelector("[data-copyMsg]");
const uppercaseCheck=document.querySelector("#uppercase");
const lowercaseCheck=document.querySelector("#lowercase");
const numbersCheck=document.querySelector("#numbers");
const symbolsCheck=document.querySelector("#symbols");
const indicator=document.querySelector("[data-indicator]");
const generateBtn=document.querySelector(".generateBtn");
const allCheckBox=document.querySelectorAll("input[type=checkbox]");
console.log(allCheckBox);

let password="";
let passwordLength=10;
let checkCount=1;
const symbolsString = "!@#$%^&*()-_=+[]{};:'\"\\|,.<>/?";


function handleSlider(){
    inputSlider.value=passwordLength;
    lengthDisplay.innerText=passwordLength;
}

function setIndicator(color){
    indicator.style.backgroundColor=color;
}

function getRandomInteger(min,max){
    return Math.floor(Math.random()*(max-min))+min;
}

function generatRandomNumber(){
    return getRandomInteger(0,9);
}

function generateUpperCase(){
    return  String.fromCharCode(getRandomInteger(65,90));
}

function generateLowerCase(){
    return  String.fromCharCode(getRandomInteger(97,122));
}
function generateSymbols(){
    return symbolsString[getRandomInteger(0,symbolsString.length-1)];
}

function calcStrength(){
    let hasUpper=false;
    let hasLower=false;
    let hasNum=false;
    let hasSym=false;
    if(uppercaseCheck.checked) hasUpper=true;
    if(lowercaseCheck.checked) hasLower=true;
    if(numbersCheck.checked) hasNum=true;
    if(symbolsCheck.checked) hasSym=true;
    
    if((hasUpper || hasLower) && (hasNum || hasSym) && passwordLength>=8 ){
        setIndicator("#0f0");
    }
    else if((hasLower ||hasUpper) && (hasNum || hasSym) && passwordLength>=6 ){
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00");
    }
    
}

//relatime input slider value change
inputSlider.addEventListener('change',()=>{
    passwordLength=inputSlider.value;
    lengthDisplay.innerText=passwordLength;
});

async function copyContent() {
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText="Copied";
    }
    catch(e){
        // copyMsg.innerText="Failed";
        console.log(e);
        copyMsg.innerText(e);
    }
    //to make the span visible
    copyMsg.classList.add("active");
    
    //to make the span invisible 
    setTimeout(() => {
        copyMsg.classList.remove("active");
    },2000)
}

//copying is enabled only when value is present 
copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value)copyContent();
})

function shufflePassword(array){
    for (let i = array.length - 1; i > 0; i--) {
        // Generate a random index from 0 to i
        const randomIndex = Math.floor(Math.random() * (i + 1));

        // Swap the current element with the element at the random index
        [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
    }
    let str="";
    array.forEach(element => {
        str+=element;
    });
    return str;
}

function handleCheckboxChange(){
    checkCount=0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked)checkCount++;
    });
    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener('change',handleCheckboxChange);
})

//Main event of the page
generateBtn.addEventListener('click',()=>{
    //none of the checkboz are selected
    handleCheckboxChange();
    if(checkCount<=0)return;

    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }

    // The new Pawword generation starts here
    password="";
    let funcArr=[];

    if(uppercaseCheck.checked)funcArr.push(generateUpperCase);
    if(lowercaseCheck.checked)funcArr.push(generateLowerCase);
    if(numbersCheck.checked)funcArr.push(generatRandomNumber);
    if(symbolsCheck.checked)funcArr.push(generateSymbols);

    // Compulsory Addition 
    for(let i=0;i<funcArr.length;i++){
        password+=funcArr[i]();
    }

    //for remaining checkbox addition
    for(let i=0;i<passwordLength-funcArr.length;i++){
        password+=funcArr[Math.floor(Math.random()*(funcArr.length))]();
    }

    //shuffling password
    password=shufflePassword(Array.from(password));
    
    //show in UI
    passwordDisplay.value=password;

    //calculate Strength
    calcStrength();
    
})
