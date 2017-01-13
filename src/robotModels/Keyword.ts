export class Keyword {
    private _position: number;
    private _name: string;

    public constructor(pos : number, n : string) {
        this.position = pos;
        this.name = n;
    }
    
    get position() : number { return this._position; }
    set position(value : number) { this._position = value; }

    get name() : string { return this._name; }
    set name(value : string) { this._name = value; }
}