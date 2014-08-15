//FIXME
var debug     = require('debug')('pcm-audio:tone');
var Readable  = require('./stream').Readable;
var PCMBuffer = require('./buffer');
var util      = require('util');
function ToneGenerator (format) {
    Readable.call(this, format);
    this.generated = 0;
    this.samples   = 0;
    this.frequency = null;
    this.handler   = null;
    this.playing   = false;
    debug('Constructor', this.format);
};
util.inherits(ToneGenerator, Readable);
/**
 * Set or modify the frequency used for this tone
 *
 * @public
 * @param   {Number}    frequency
 */
ToneGenerator.prototype.setFrequency = function (frequency) {
    debug('setFrequency', frequency);
    this.frequency = Number(frequency);
    if (this.handler) {
        this.setType(this.handler);
    }
    //if (this.playing) {
    //    this.next = true;
    //}
    return this;
}
/**
 * Set the tone lookup handler, a function that can calculate the wave position in steps
 *
 * @public
 * @param   {Function}  handler
 */
ToneGenerator.prototype.setType = function (handler) {
    this.handler = handler;
    // Assuming a periodic waveform, determine how many periods we need to lookup
    var period = this.format.sampleRate / this.frequency;
    // Take closest integer value of periods
    var length = Math.round(period);
    // Look up table will hold floating point numbers
    this.lookup = new Float32Array(length);
    for (var i = 0; i < length; i++) {
        this.lookup[i] = handler(i / period);
    }
    // Approximate the number of samples closest to our lookup table that gives us a
    // millisecond of sound
    this.samples = Math.ceil(Math.round(this.format.sampleRate / 1000) / length) * length;
    // Create a new PCM buffer to contain samples
    this.buffer = new PCMBuffer(this.samples * this.format.blockAlign);
    this.buffer.format(this.format);
    this.buffer.fill(null);
    debug('setType', handler.name, 'period', period, 'samples', this.samples);
    return this;
};
/**
 * Create a millisecond of audio tone at highest amplitude possible
 *
 * @public
 */
ToneGenerator.prototype._read = function () {
    this.playing = true;
    var amplitude = 0.25 * this.format.MAX;
    //
    for (var i = 0; i < this.samples; i++) {
        var value = this.lookup[i % this.lookup.length] * amplitude;
        if (!this.format.float) {
            value = Math.round(value);
        }
        for (var channel = 0; channel < this.format.channels; channel++) {
            var offset = (i * this.format.blockAlign) + (channel * this.format.sampleSize);
            this.buffer.writeSample(value, offset);
        }
    }
    var copy = new Buffer(this.buffer.length);
    this.buffer.copy(copy);
    this.push(copy);
    //if (this.next) {
    //    this.setType(this.handler);
    //    this.next = null;
    //}
};
/**
 * Calculate a sine wave at position t
 *
 * @public
 * @static
 * @param   {Number}    t
 * @return  {Number}
 */
ToneGenerator.Sine = function Sine (t) {
    return Math.sin(2 * Math.PI * t);
};
/**
 * Calculate a square wave at position t
 *
 * @public
 * @static
 * @param   {Number}    t
 * @return  {Number}
 */
ToneGenerator.Square = function Square (t) {
    var sine = ToneGenerator.Sine(t);
    if (sine < 0) { return -1; }
    if (sine > 0) { return  1; }
    return 0;
}
/**
 * Calculate a sawtooth wave at position t
 *
 * @public
 * @static
 * @param   {Number}    t
 * @return  {Number}
 */
ToneGenerator.Sawtooth = function Sawtooth (t) {
    return t - Math.floor(t + 0.5);
}
/**
 * Calculate a triangle wave at position t
 *
 * @public
 * @static
 * @param   {Number}    t
 * @return  {Number}
 */
ToneGenerator.Triangle = function Triangle (t) {
    return Math.abs(ToneGenerator.Sawtooth(t));
}
module.exports = ToneGenerator;
