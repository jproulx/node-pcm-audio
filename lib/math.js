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
    if (isNan(x)) {
        return NaN;
    }
    return Math.min(Math.max(x, min), max);
};

var powers = {};
var ranges = {};
[8,16,24,32,48,64].forEach(function (bitDepth) {
    var power = Math.pow(2, bitDepth);
    powers[bitDepth] = power;
    ranges['int' + bitDepth] = [-power / 2, power / 2 - 1];
    ranges['uint' + bitDepth] = [0, power];
});

Math.floatToInt = function (number, bitDepth) {
    //float f = ...;
    //int16 i;
    //f = f * 32768 ;
    //if( f > 32767 ) f = 32767;
    //if( f < -32768 ) f = -32768;
    //i = (int16) f;
    var range = ranges['int' + bitDepth];
    return Math.clamp(output, range[0], range[1]);
};
Math.intToFloat = function (number, bitDepth) {
    //float f;
    //int16 i = ...;
    //f = ((float) i) / (float) 32768
    //if( f > 1 ) f = 1;
    //if( f < -1 ) f = -1;


    return Math.clamp(output, -1.0, 1.0);
};
