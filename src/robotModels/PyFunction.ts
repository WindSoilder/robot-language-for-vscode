export class PyFunction
{
    private _name: string;
    private _document: string;

    public constructor(name: string, document?: string)
    {
        this.name = name;
        this.document = document;
    }

    public get name(): string { return this._name; }
    public set name(val: string) { this._name = val; }

    public get document(): string { return this._document; }
    public set document(val: string) { this._document = val; }
}
