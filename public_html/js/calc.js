var calc = {};
var display;
var plus, minus, divide, multiply;
var memoryPlus, memoryMinus, memoryUse, clearEverything;
var comma, equals;
var operationIndicator, memoryIndicator;
var operation = "";
var operand = null;
var memory = null;
var nextIsClear = false;

var timerID;
var timerValue;

calc.init = function (e) {
    display = document.getElementById ("calc-display");

    plus = document.getElementById ("calc-plus");
    minus = document.getElementById ("calc-minus");
    multiply = document.getElementById ("calc-multiply");
    divide = document.getElementById ("calc-divide");

    memoryPlus = document.getElementById ("calc-memoryPlus");
    memoryMinus = document.getElementById ("calc-memoryMinus");
    memoryUse = document.getElementById ("calc-memoryUse");
    clearEverything = document.getElementById ("calc-clearEverything");
    equals = document.getElementById ("calc-equals");
    comma = document.getElementById ("calc-comma");

    memoryIndicator = document.getElementById ("calc-indicators-memory");
    operationIndicator = document.getElementById ("calc-indicators-operation");

    var operations = [plus, minus, divide, multiply];
    for (var p in operations)
        operations[p].addEventListener ("click", calc.operationPerformed);

    for (var i = 0; i <= 9; i++)
        document.getElementById ("calc-" + i).addEventListener ("click", calc.numberPerformed);

    display.addEventListener ("click", calc.inverseSign);

    equals.addEventListener ("click", calc.equals);
    comma.addEventListener ("click", calc.addComma);
    clearEverything.addEventListener ("click", calc.clearEverything);

    memoryUse.addEventListener ("click", calc.memoryUse);
    memoryMinus.addEventListener ("click", calc.memoryMinus);
    memoryPlus.addEventListener ("click", calc.memoryPlus);

    nextIsClear = true;
    calc.setValue ("-Welcome to calc-");
    calc.setMemoryIndicator (database.hasMemory ());
    calc.setOperationIndicator ("");
};

calc.clearDisplay = function () {
    display.innerHTML = "";
};

calc.showDelay = function (value) {
    clearInterval (timerID);
    timerValue = value + "";

    var i = 0;
    timerID = setInterval (function () {
        calc.displayAppend (timerValue.charAt (i++));
        if (i >= timerValue.length)
            clearInterval (timerID);
    }, 500 / timerValue.length);
};

calc.setMemoryIndicator = function (hasMemory) {
    memoryIndicator.innerHTML = hasMemory ? "M" : "";
};

calc.setOperationIndicator = function (op) {
    operationIndicator.innerHTML = op;
};

calc.clearEverything = function () {
    calc.clearDisplay ();
    operand = null;
    operation = "";
    calc.setValue ("");
    calc.setOperationIndicator ("");
};

calc.isEmpty = function () {
    return display.innerHTML.length === 0;
};

calc.getValue = function () {
    return Number (display.innerHTML);
};

calc.setValue = function (value) {
    //display.innerHTML = value + "";
    calc.clearDisplay ();
    calc.showDelay (value);
};

calc.equals = function () {
    calc.calculate ();
    calc.setValue (operand);
    operand = null;
    operation = "";
    calc.setOperationIndicator ("");
    nextIsClear = true;
};

calc.calculate = function () {
    if (!(operation.length > 0 && operand !== null))
        return;

    var prevNumber = operand;
    var prevOperation = operation;
    var curNumber = operand = calc.getValue ();

    console.log (prevNumber + " " + prevOperation + " " + curNumber);
    console.log (eval (prevNumber + " " + prevOperation + " " + curNumber));
    operand = eval (prevNumber + " " + prevOperation + " " + curNumber);
};

calc.displayAppend = function (number) {
    var innerHTML = display.innerHTML;
    innerHTML += number;
    display.innerHTML = innerHTML;
};

calc.operationPerformed = function (event) {
    if (calc.isEmpty ())
        return;

    if (operand !== null) {
        calc.calculate ();
        calc.setValue (operand);
        nextIsClear = true;
    } else {
        operand = calc.getValue ();
        nextIsClear = true;
    }

    operation = typeof event === "string" ? event : event.target.innerHTML;
    calc.setOperationIndicator (operation);
};


calc.addComma = function () {
    if (nextIsClear) {
        calc.clearDisplay ();
        nextIsClear = false;
    }
    if (!!~(calc.getValue () + "").indexOf ("."))
        return;
    calc.displayAppend (".");
};

calc.inverseSign = function () {
    var s = calc.getValue () + "";
    if (!!~s.indexOf ("-"))
        calc.setValue (s.substring (1));
    else
        calc.setValue ("-" + s);
};

calc.numberPerformed = function (event) {
    if (nextIsClear) {
        calc.clearDisplay ();
        nextIsClear = false;
    }
    calc.displayAppend (typeof event === "number" ? event : event.target.innerHTML);
};

calc.memoryPlus = function () {
    memory = calc.getValue ();
    database.saveMemory (memory);
    calc.setMemoryIndicator (true);
};

calc.memoryMinus = function () {
    memory = null;
    database.clearMemory ();
    calc.setMemoryIndicator (false);
};

calc.memoryUse = function () {
    if (memory === null)
        memory = database.getMemory ();
    if (memory === null)
        return;
    calc.setValue (memory);
};


calc.keyDown = function (event) {
    console.log (event.keyCode);
    if (event.keyCode >= 96 && event.keyCode <= 105)
        calc.numberPerformed (event.keyCode - 96);
    else {
        switch (event.keyCode) {
            case 110:
                calc.addComma ();
                break;
            case 107:
                calc.operationPerformed ("+");
                break;
            case 109:
                calc.operationPerformed ("-");
                break;
            case 106:
                calc.operationPerformed ("*");
                break;
            case 111:
                calc.operationPerformed ("/");
                break;
            case 13:
                calc.equals ();
                break;
            case 8:
            case 46:
                calc.clearEverything ();
                break;
        }
    }
};
























window.addEventListener ('load', calc.init);
window.addEventListener ('keydown', calc.keyDown);