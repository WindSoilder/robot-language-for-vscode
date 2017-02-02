"use strict";
const fs = require("fs");
/**
 * item to cache for search result in goto definition
 */
class CacheItem {
    constructor(location, lastModifyTime) {
        this.location = location;
        this.lastModifyTime = lastModifyTime;
    }
    get location() { return this._location; }
    set location(value) { this._location = value; }
    get lastModifyTime() { return this._lastModifyTime; }
    set lastModifyTime(value) { this._lastModifyTime = value; }
}
/**
 * cache for search result class
 */
class GlobalCacheSet {
    constructor(maxCacheSize) {
        this._cacheItems = new Map();
        this._cacheKeys = [];
        this._cacheSize = 0;
        this._maxCacheSize = maxCacheSize;
    }
    get cacheItems() { return this._cacheItems; }
    get cacheSize() { return this._cacheSize; }
    get maxCacheSize() { return this._maxCacheSize; }
    set maxCacheSize(value) { this.maxCacheSize = value; }
    /**
     * return true if the target name(keyword or variable) is in cache items
     * and the relative file doesn't need to be updated
     */
    IsTargetInCache(targetName) {
        if (this.isTargetInCacheSet(targetName)) {
            if (this.isTargetNeedToBeUpdated(targetName)) {
                return false;
            }
            else {
                return true;
            }
        }
        else {
            return false;
        }
    }
    /**
     * return location according to target name(keyword or variable)
     */
    GetTargetLocation(targetName) {
        if (!this.isTargetInCacheSet(targetName)) {
            return null;
        }
        else {
            return this.cacheItems.get(targetName).location;
        }
    }
    /**
     * add target name search result to cache set
     */
    AddItemToTargetSet(targetName, targetLocation) {
        let lastModifyTime = fs.statSync(targetLocation.uri.fsPath).mtime;
        let item = new CacheItem(targetLocation, lastModifyTime);
        if (this._cacheSize == this._maxCacheSize) {
            let keyToDelete = this._cacheKeys.shift();
            this._cacheItems.delete(keyToDelete);
        }
        else if (!this._cacheItems.has(targetName)) {
            ++this._cacheSize;
        }
        this._cacheItems.set(targetName, item);
        this._cacheKeys.push(targetName);
    }
    isTargetInCacheSet(targetName) {
        return this.cacheItems.has(targetName);
    }
    isTargetNeedToBeUpdated(targetName) {
        let cacheItem = this.cacheItems.get(targetName);
        let stat = fs.statSync(cacheItem.location.uri.fsPath);
        return stat.mtime.getTime() != cacheItem.lastModifyTime.getTime();
    }
}
exports.globalKeywordCacheSet = new GlobalCacheSet(200);
exports.globalVariableCacheSet = new GlobalCacheSet(100);
//# sourceMappingURL=CacheItem.js.map