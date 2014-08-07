'use strict';
var Stream    = require('stream').Stream;
var stream    = require('readable-stream');
var util      = require('util');
var os        = require('os');
var debug     = require('debug')('pcm-audio:stream');
var PCMBuffer = require('./buffer');
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
 * Set up PCM format for this stream
 *
 * @private
 * @param   {Object}    format      PCM format options
 * @param   {Object}    options     Stream options
 */
function format (format) {
    this.format                = format || {};
    this.format.sampleRate     = defaults(format, 'sampleRate', 44100,                       Number);
    this.format.bitDepth       = defaults(format, 'bitDepth',   16,                          Number);
    this.format.channels       = defaults(format, 'channels',   2,                           Number);
    this.format.signed         = defaults(format, 'signed',     true,                        Boolean);
    this.format.float          = defaults(format, 'float',      false,                       Boolean);
    this.format.endianness     = defaults(format, 'endianness', os.endianness() || 'LE',     String);
    this.format.codec          = defaults(format, 'codec',      determineCodec(this.format), String);
    this.format.sampleSize     = this.format.bitDepth / 8;
    this.format.blockAlign     = this.format.sampleSize * this.format.channels;
    this.format.bytesPerSecond = this.format.sampleRate * this.format.blockAlign;

    this.format.MAX = this.format.signed ? Math.pow(2, this.format.bitDepth - 1) - 1 : Math.pow(2, this.format.bitDepth) - 1;
    this.format.MIN = this.format.signed ? -Math.pow(2, this.format.bitDepth - 1) : -Math.pow(2, this.format.bitDepth);

    this.format.MAX = this.format.float ?  1.0 : this.format.MAX;
    this.format.MIN = this.format.float ? -1.0 : this.format.MIN;

    debug('Constructor', this.format);
    // Set up buffer
    this.buffer.format(this.format);
    return this;
}


/**
 * Base Stream class for PCM streams
 *
 * @public
 * @param   {Object}    format      PCM format options
 * @param   {Object}    options     Stream options
 */
function PCMStream () {
    Stream.apply(this, arguments);
    this.buffer = new PCMBuffer(0);
}
util.inherits(PCMStream, Stream);
PCMStream.prototype.format = format;

var Readable = stream.Readable;
function PCMReadable (options) {
    this.buffer = new PCMBuffer(0);
    Readable.apply(this, arguments);

}
util.inherits(PCMReadable, Readable);
PCMReadable.prototype.format = format;

var Writable = stream.Writable;
function PCMWritable (options) {
    this.buffer = new PCMBuffer(0);
    Writable.apply(this, arguments);

}
util.inherits(PCMWritable, Writable);
PCMWritable.prototype.format = format;

module.exports = {
    'Stream'   : PCMStream,
    'Readable' : PCMReadable,
    'Writable' : PCMWritable
};
