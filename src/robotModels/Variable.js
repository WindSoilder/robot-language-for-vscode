"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Searchable_1 = require("./Searchable");
var Variable = (function (_super) {
    __extends(Variable, _super);
    function Variable() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Variable;
}(Searchable_1.Searchable));
exports.Variable = Variable;
