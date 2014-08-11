var Tone    = require('./lib/tone');
var Speaker = require('speaker');
var format  = {
    'channels'   : 1,
    'sampleRate' : 96000,
    'bitDepth'   : 32
};
var Signal = new Tone(format)
    .setFrequency(440)
    .setType(Tone.Sine);
//var types = ['Sine','Square','Sawtooth','Triangle'];
//setInterval(function () {
//    Signal
//        .setFrequency((Math.random() * 40) + 400)
//        .setType(Tone[types[Math.floor(Math.random() * types.length)]]);
//}, 0);

Signal.pipe(new Speaker(format));
