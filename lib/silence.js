'use strict';
var debug    = require('debug')('pcm-audio:silence');
var util     = require('util');
var Readable = require('./stream').Readable;

function Silence () {
    debug('Constructor');
    Readable.apply(this, arguments);
}
util.inherits(Silence, Readable);

Silence.prototype._read = function (size) {
    debug('_read', size);
    var buffer = new Buffer(size);
    buffer.fill(null);
    this.push(buffer);
};

module.exports = Silence;
