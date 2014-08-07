var debug     = require('debug')('pcm-audio:tone');
var Readable  = require('./stream').Readable;
var PCMBuffer = require('./buffer');
var util      = require('util');

function Mixer () {
    Readable.call(this);
    debug('Constructor', this);
    this.inputs = [];
};
util.inherits(ToneGenerator, Readable);

Mixer.prototype.input = function (input) {
    this.inputs.push(input);
};

Mixer.prototype.clamp = function (value) {
    return Math.max(this.format.MIN, Math.min(this.format.MAX, value));
};

Mixer.prototype._read = function (size) {
    var self = this;

    this.inputs.forEach(function (input) {

    });
};

module.exports = Mixer;
