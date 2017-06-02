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

/**
 * LibraryMetaData represent libraries in a test suite
 * it appears like this:
 * *** Settings ***
 * Library    a.b.c.d
 */
export class LibraryMetaData extends MetaData {

}

/**
 * ResourceMetaData represent resources in a test suite
 * it appears like this:
 * *** Settings ***
 * Resource    test_resource.txt
 */
export class ResourceMetaData extends MetaData {
}