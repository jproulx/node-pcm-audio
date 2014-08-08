"use strict";
var debug = require('debug')('pcm-audio:format');
var os    = require('os');
/**
 * Return the correct value type or default value based on input object
 *
 * @private
 * @param   {Object}    object
 * @param   {String}    name
 * @param   {Mixed}     value
 * @param   {Object}    type
 * @return  {Mixed}
 */
function defaults (object, name, value, type) {
    return object && object[name] ? type(object[name]) : value;
}
/**
 * Determine the relevant codec for this stream based on the format
 *
 * @private
 * @param   {Object}    format
 * @return  {String}
 */
function determineCodec (format) {
    var validFloat = format['float'] && (format.bitDepth == 32 || format.bitDepth == 64);
    var signedness = format.signed ? 's' : 'u';
    var endianness = format.bitDepth == 8 ? '' : format.endianness.toLowerCase();
    return [
        validFloat ? 'f' : signedness,
        format.bitDepth,
        endianness
    ].join('');
}
/**
 * Creates an object representing the specified PCM format.
 *
 * By default, the assumed format is the CD/Redbook specification:
 * 2 channels, 44100 samples per second, 16 bits per sample
 *
 * @param   {Object}    format
 */
function Format (options) {
    // If options passed in are already a generated object, just use it
    if (options instanceof Format) {
        return options;
    }
    // Always create an object
    if (!(this instanceof Format)) {
        return new Format(options);
    }
    // Number of samples of audio carried per second
    this.sampleRate = defaults(options, 'sampleRate', 44100, Number);
    // Number of bits per sample
    this.bitDepth = defaults(options, 'bitDepth', 16, Number);
    // Number of channels
    this.channels = defaults(options, 'channels', 2, Number);
    // Samples are signed or unsigned whole integers
    this.signed = defaults(options, 'signed', true, Boolean);
    // Samples are floating point numbers or not
    this.float = defaults(options, 'float', false, Boolean);
    // Which significant byte is stored where for samples
    this.endianness = defaults(options, 'endianness', os.endianness() || 'LE', String);
    // The corresponding codec for this specific format
    this.codec = defaults(options, 'codec', determineCodec(this), String);
    // Number of bytes used per sample in individual channel
    this.sampleSize = this.bitDepth / 8;
    // Number of bytes used per sample across all channels
    this.blockAlign = this.sampleSize * this.channels;
    // Number of bytes used per second of audio
    this.bytesPerSecond = this.sampleRate * this.blockAlign;
    // Set min/max levels for manipulation bounds
    this.MIN = this.signed ? -Math.pow(2, this.bitDepth - 1) : 0;
    this.MAX = this.signed ?  Math.pow(2, this.bitDepth - 1) - 1 : Math.pow(2, this.bitDepth) - 1;
    // Float values are between -1 and 1
    this.MIN = this.float ? -1.0 : this.MIN;
    this.MAX = this.float ?  1.0 : this.MAX;
    debug('Constructor', this);
};

module.exports = Format;
