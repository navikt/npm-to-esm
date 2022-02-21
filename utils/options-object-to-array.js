module.exports = function optionsObjectToArray(optionsObject) {
    const argList = [];
    const optionNames = Object.keys(optionsObject);
    optionNames.forEach((optionName) => argList.push(`--${optionName}`, optionsObject[optionName]));
    return argList;
};
