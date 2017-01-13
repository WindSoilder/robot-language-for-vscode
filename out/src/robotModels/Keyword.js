"use strict";
class Keyword {
    constructor(pos, n) {
        this.position = pos;
        this.name = n;
    }
    get position() { return this._position; }
    set position(value) { this._position = value; }
    get name() { return this._name; }
    set name(value) { this._name = value; }
}
exports.Keyword = Keyword;
//# sourceMappingURL=Keyword.js.map