/**
 * provide util functions for some operations
 */
import * as path from 'path';

/**
 * get the actual resource path through one resource metadata value
 * @param resourceVal the value of resource metadata from suite
 * @param suitePath the file path of suite
 */
export function getResourcePath(resourceVal: string,
                                suitePath: string): string
{
    if (path.isAbsolute(resourceVal)) {
        return resourceVal;        
    } else {
        return path.join(suitePath, resourceVal);
    }
}