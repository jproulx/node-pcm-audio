Math.tau = Math.PI * 2;
Math.sign = function (number) {
    if (isNaN(number)) {
        return NaN;
    }
    if (number > 0) {
        return 1;
    }
    if (number < 0) {
        return -1;
    }
    return 0;
}
Math.clamp = function (x, min, max) {
    if (isNaN(x)) {
        return NaN;
    }
    return Math.min(Math.max(x, min), max);
};
[8,16,24,32,48,64].forEach(function (bitDepth) {
    var power = Math.pow(2, bitDepth);
    var half  = Math.pow(2, bitDepth - 1);
    var int  = [-half, half - 1];
    var uint = [0, power];
    Math['int' + bitDepth + 'ToFloat'] = function (number) {
        return Math.clamp(number / half, -1, 1);
    };
    Math['floatToInt' + bitDepth] = function (number) {
        return Math.clamp(Math.round(number * half), int[0], int[1]);
    };
    Math['uint' + bitDepth + 'ToFloat'] = function (number) {
        return Math['int' + bitDepth + 'ToFloat'].call(Math, number - half);
    };
    Math['floatToUInt' + bitDepth] = function (number) {
        return Math.clamp(Math.round((number * half) + half), uint[0], uint[1]);
    };
});
Math.floatToInt = function (number, bitDepth) {
    return Math['floatToInt' + bitDepth].call(Math, number);
};
Math.intToFloat = function (number, bitDepth) {
    return Math['int' + bitDepth + 'ToFloat'].call(Math, number);
};
Math.floatToUInt = function (number, bitDepth) {
    return Math['floatToUInt' + bitDepth].call(Math, number);
};
Math.uintToFloat = function (number, bitDepth) {
    return Math['uint' + bitDepth + 'ToFloat'].call(Math, number);
};
