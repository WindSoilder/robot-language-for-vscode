"use strict";
var Searchable = (function () {
    function Searchable(pos, n) {
        this.position = pos;
        this.name = n;
    }
    Object.defineProperty(Searchable.prototype, "position", {
        get: function () { return this._position; },
        set: function (value) { this._position = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Searchable.prototype, "name", {
        get: function () { return this._name; },
        set: function (value) { this._name = value; },
        enumerable: true,
        configurable: true
    });
    return Searchable;
}());
exports.Searchable = Searchable;
