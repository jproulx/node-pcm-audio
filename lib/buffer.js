'use strict';
var Buffer = require('buffer').Buffer;
var util   = require('util');
var debug  = require('debug')('pcm-audio:buffer');
/**
 * Extends the native buffer with read/write methods for sampling
 *
 * @public
 */
function PCMBuffer () {
    debug('Constructor', arguments);
    Buffer.apply(this, arguments);
    // By default, use 16-bit signed read/write methods
    this.readSample  = this.readInt16LE.bind(this);
    this.writeSample = this.writeInt16LE.bind(this);
}
util.inherits(PCMBuffer, Buffer);
/**
 * Set proper read/write methods based on PCM format
 *
 * @public
 * @param   {Object}    format
 */
PCMBuffer.prototype.format = function (format) {
    var validFloat = format['float'] && (format.bitDepth == 32 || format.bitDepth == 64);
    var signedness = format.signed ? 's' : 'u';
    var endianness = format.bitDepth == 8 ? '' : format.endianness.toUpperCase();
    var type       = validFloat ? 'Float' : (signedness == 'u' ? 'UInt' : 'Int');
    if (format.bitDepth == 64) {
        type = 'Double';
    }
    var method     = [
        type,
        validFloat || format.bitDepth == 64 ? '' : format.bitDepth,
        endianness
    ].join('');
    this.readSample  = this['read' + method].bind(this);
    this.writeSample = this['write' + method].bind(this);
};
module.exports = PCMBuffer;
