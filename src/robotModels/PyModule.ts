import {PyFunction} from './PyFunction';


export class PyModule
{
    private _functions: PyFunction[];

    public get functions(): PyFunction[] { return this._functions; }
    public set functions(val: PyFunction[]) { this._functions = val; }

    public constructor() {
        this.functions = [];
    }
}
