
/**
* Calculates a path relative to a file.
*
* @param name The relative path.
* @param file The file path.
* @return The calculated path.
*/
export declare function relativeToFile(name: string, file: string): string;

/**
* Joins two paths.
*
* @param path1 The first path.
* @param path2 The second path.
* @return The joined path.
*/
export declare function join(path1: string, path2: string): string;

/**
* Generate a query string from an object.
*
* @param params Object containing the keys and values to be used.
* @param traditional Boolean Use the old URI template standard (RFC6570)
* @returns The generated query string, excluding leading '?'.
*/
export declare function buildQueryString(params: Object, traditional?: Boolean): string;

/**
* Parse a query string.
*
* @param queryString The query string to parse.
* @returns Object with keys and values mapped from the query string.
*/
export declare function parseQueryString(queryString: string): Object;