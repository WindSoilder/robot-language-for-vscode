"use strict";
class Searchable {
    constructor(pos, n) {
        this.position = pos;
        this.name = n;
    }
    get position() { return this._position; }
    set position(value) { this._position = value; }
    get name() { return this._name; }
    set name(value) { this._name = value; }
}
exports.Searchable = Searchable;
//# sourceMappingURL=Searchable.js.map