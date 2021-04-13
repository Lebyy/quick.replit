export = Util;
declare class Util {
    /**
   * Will return true if the key provided is a string
   * @param str Anything to test
   * @return {Boolean}
   */
    static isKey(str: any): boolean;
    /**
   * Will return true if the key is not Infinity
   * @param data Any data
   * @return {Boolean}
   */
    static isValue(data: any): boolean;
    /**
   * Sort data
   * @param {string} key Key
   * @param {Array} data Data
   * @param {object} ops options
   */
    static sort(key: string, data: any[], ops: object): any[];
}
