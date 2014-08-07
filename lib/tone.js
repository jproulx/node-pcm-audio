var debug     = require('debug')('pcm-audio:tone');
var Readable  = require('./stream').Readable;
var PCMBuffer = require('./buffer');
var util      = require('util');
function ToneGenerator (frequency, duration) {
    Readable.call(this);
    this.frequency = parseFloat(frequency || 440);//parseFloat(frequency) || 440.0;
    this.duration  = parseFloat(duration || 0);
    this.generated = 0;
    debug('Constructor', this);
};
util.inherits(ToneGenerator, Readable);

function Sine (t) {
    return Math.sin(2 * Math.PI * t);
}
function Square (t) {
    var sine = Sine(t);
    if (sine < 0) {return -1};
    if (sine > 0) {return 1};
    return 0;
}
function Sawtooth (t) {
    return t - Math.floor(t + 0.5);
}
function Triangle (t) {
    return Math.abs(Sawtooth(t));
}
ToneGenerator.prototype.createLookup = function (handler) {
    var period = this.format.sampleRate / this.frequency;
    var length = Math.round(period);
    this.lookup = new Float32Array(length);
    for (var i = 0; i < length; i++) {
        var t = i / period;
        this.lookup[i] = handler(t);
    }
};
ToneGenerator.prototype._read = function (size) {
    var samples = size / this.format.blockAlign | 0;
    var buffer  = new PCMBuffer(samples * this.format.blockAlign);
    buffer.format(this.format);
    var amplitude = this.format.MAX;
    for (var i = 0; i < samples; i++) {
        for (var channel = 0; channel < this.format.channels; channel++) {
            var step = this.generated + i;
            var value = this.lookup[step % this.lookup.length] * amplitude;
            if (!this.format.float) {
                value = Math.round(value);
            }
            var offset = (i * this.format.sampleSize * this.format.channels) + (channel * this.format.sampleSize);
            buffer.writeSample(value, offset);
        }
    }
    this.generated += samples;
    this.push(buffer);
};
ToneGenerator.Sine = Sine;
ToneGenerator.Square = Square;
ToneGenerator.Sawtooth = Sawtooth;
ToneGenerator.Triangle = Triangle;
module.exports = ToneGenerator;
