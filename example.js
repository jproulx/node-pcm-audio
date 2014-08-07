var Tone = require('./lib/tone');
var Speaker = require('speaker');
var format  = {
    'channels'   : 2,
    'sampleRate' : 44100,
    'bitDepth'   : 16
};
var Signal = new Tone(440);
Signal.format(format);
Signal.createLookup(Tone.Sine);
Signal.pipe(new Speaker(format));
