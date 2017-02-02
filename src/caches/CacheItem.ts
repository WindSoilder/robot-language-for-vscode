import {Location, Position} from 'vscode';
import * as fs from 'fs';

/**
 * item to cache for search result in goto definition
 */
class CacheItem {
    private _location : Location;
    private _lastModifyTime : Date;

    public constructor(location : Location, lastModifyTime : Date) {
        this.location = location;
        this.lastModifyTime = lastModifyTime;
    }

    get location() : Location { return this._location; }
    set location(value : Location) { this._location = value; }

    get lastModifyTime() : Date { return this._lastModifyTime; }
    set lastModifyTime(value : Date) { this._lastModifyTime = value; }
}

/**
 * cache for search result class
 */
class GlobalCacheSet {
    private _cacheItems : Map<string, CacheItem>;
    private _cacheKeys : string[];
    private _cacheSize : number;
    private _maxCacheSize : number;

    public constructor(maxCacheSize : number) {
        this._cacheItems = new Map<string, CacheItem>();
        this._cacheKeys = [];
        this._cacheSize = 0;
        this._maxCacheSize = maxCacheSize;
    }

    get cacheItems() : Map<string, CacheItem> { return this._cacheItems; }

    get cacheSize() : number { return this._cacheSize; }

    get maxCacheSize() : number { return this._maxCacheSize; }
    set maxCacheSize(value : number) { this.maxCacheSize = value; }

    /**
     * return true if the target name(keyword or variable) is in cache items
     * and the relative file doesn't need to be updated
     */
    public IsTargetInCache(targetName : string) {
        if (this.isTargetInCacheSet(targetName)) {
            if (this.isTargetNeedToBeUpdated(targetName)) {
                return false;
            } else {
                return true;
            }
        } else {
            return false;
        } 
    }

    /**
     * return location according to target name(keyword or variable)
     */
    public GetTargetLocation(targetName : string) : Location {
        if (!this.isTargetInCacheSet(targetName)) {
            return null;
        } else {
            return this.cacheItems.get(targetName).location;
        }
    }

    /**
     * add target name search result to cache set
     */
    public AddItemToTargetSet(targetName : string, targetLocation : Location) {
        let lastModifyTime : Date = fs.statSync(targetLocation.uri.fsPath).mtime;
        let item : CacheItem = new CacheItem(targetLocation, lastModifyTime);

        if (this._cacheSize == this._maxCacheSize) {
            let keyToDelete : string = this._cacheKeys.shift();
            this._cacheItems.delete(keyToDelete);
        } else if (!this._cacheItems.has(targetName)) {
            ++this._cacheSize;
        }
        this._cacheItems.set(targetName, item);
        this._cacheKeys.push(targetName);
    }

    private isTargetInCacheSet(targetName : string) : boolean {
        return this.cacheItems.has(targetName);
    }

    private isTargetNeedToBeUpdated(targetName : string) : boolean {
        let cacheItem : CacheItem = this.cacheItems.get(targetName);
        let stat : fs.Stats = fs.statSync(cacheItem.location.uri.fsPath);
        return stat.mtime.getTime() != cacheItem.lastModifyTime.getTime();
    }
}

export var globalKeywordCacheSet : GlobalCacheSet = new GlobalCacheSet(200);
export var globalVariableCacheSet : GlobalCacheSet = new GlobalCacheSet(100);