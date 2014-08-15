var Tone    = require('./lib/tone');
var Speaker = require('speaker');
var format  = {
    'channels'   : 1,
    'sampleRate' : 96000,
    'bitDepth'   : 32
};
var speaker   = new Speaker(format);
var frequency = 110;
var Signal = new Tone(format)
    .setFrequency(frequency)
    .setType(Tone.Sawtooth);
var types = ['Sine','Square','Sawtooth','Triangle'];
var interval = setInterval(function () {
    Signal
        .setFrequency(frequency += 0.01);

    console.log(frequency);
    if (Math.round(frequency) == 1000) {
        Signal.unpipe(speaker);
        clearInterval(interval);

    }
}, 0);

Signal.pipe(speaker);
