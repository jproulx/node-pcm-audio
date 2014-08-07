'use strict';
var Stream    = require('stream').Stream;
var stream    = require('readable-stream');
var util      = require('util');
var debug     = require('debug')('pcm-audio:stream');
var Format    = require('./format');
var PCMBuffer = require('./buffer');
/**
 * Base Stream class for PCM streams
 *
 * @public
 * @param   {Object}    format      PCM format options
 * @param   {Object}    options     Stream options
 */
function PCMStream (format) {
    Stream.call(this);
    this.format = new Format(format);
    this.buffer = new PCMBuffer(0);
}
util.inherits(PCMStream, Stream);
var Readable = stream.Readable;
function PCMReadable (format) {
    this.format = new Format(format);
    this.buffer = new PCMBuffer(0);
    Readable.apply(this, arguments);
}
util.inherits(PCMReadable, Readable);
var Writable = stream.Writable;
function PCMWritable (format) {
    this.format = new Format(format);
    this.buffer = new PCMBuffer(0);
    Writable.apply(this, arguments);
}
util.inherits(PCMWritable, Writable);
module.exports = {
    'Stream'   : PCMStream,
    'Readable' : PCMReadable,
    'Writable' : PCMWritable
};
