"use strict";
/**
 * This class is represent for simplify metadata in test suite
 * Just like:
 *     library    dell.automation.ca_common.common
 *     Resource   resourcePath
 */
class MetaData {
    constructor(dType, dValue) {
        this.dataType = dType;
        this.dataValue = dValue;
    }
    get dataType() { return this._dataType; }
    set dataType(value) { this._dataType = value; }
    get dataValue() { return this._dataValue; }
    set dataValue(value) { this._dataValue = value; }
}
exports.MetaData = MetaData;
class LibraryMetaData extends MetaData {
}
exports.LibraryMetaData = LibraryMetaData;
class ResourceMetaData extends MetaData {
}
exports.ResourceMetaData = ResourceMetaData;
//# sourceMappingURL=MetaData.js.map