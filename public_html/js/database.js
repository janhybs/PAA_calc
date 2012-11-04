var database = {};


database.saveMemory = function (memory) {
    localStorage.setItem ("calc.memory", memory);
};

database.getMemory = function () {
    return localStorage.getItem ("calc.memory");
};

database.clearMemory = function () {
    localStorage.removeItem ("calc.memory");
};

database.hasMemory = function () {
    return localStorage.getItem ("calc.memory") !== null;
};