/**
 * This class is represent for simplify metadata in test suite
 * Just like:
 *     library    dell.automation.ca_common.common
 *     Resource   resourcePath
 */
export class MetaData {
    private _dataType: string;
    private _dataValue: string;

    public constructor(dType : string, dValue : string) {
        this.dataType = dType;
        this.dataValue = dValue;
    }
    
    get dataType(): string { return this._dataType; }

    set dataType(value: string) { this._dataType = value; }

    get dataValue(): string { return this._dataValue; }

    set dataValue(value: string) { this._dataValue = value; }
}

export class LibraryMetaData extends MetaData {

}

export class ResourceMetaData extends MetaData {
}