"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * This class is represent for simplify metadata in test suite
 * Just like:
 *     library    dell.automation.ca_common.common
 *     Resource   resourcePath
 */
var MetaData = (function () {
    function MetaData(dType, dValue) {
        this.dataType = dType;
        this.dataValue = dValue;
    }
    Object.defineProperty(MetaData.prototype, "dataType", {
        get: function () { return this._dataType; },
        set: function (value) { this._dataType = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MetaData.prototype, "dataValue", {
        get: function () { return this._dataValue; },
        set: function (value) { this._dataValue = value; },
        enumerable: true,
        configurable: true
    });
    return MetaData;
}());
exports.MetaData = MetaData;
var LibraryMetaData = (function (_super) {
    __extends(LibraryMetaData, _super);
    function LibraryMetaData() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return LibraryMetaData;
}(MetaData));
exports.LibraryMetaData = LibraryMetaData;
var ResourceMetaData = (function (_super) {
    __extends(ResourceMetaData, _super);
    function ResourceMetaData() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ResourceMetaData;
}(MetaData));
exports.ResourceMetaData = ResourceMetaData;
