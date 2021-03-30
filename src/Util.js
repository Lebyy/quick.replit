const _ = require("lodash")

class Util {

    /**
     * Will return true if the key provided is a string
     * @param str Anything to test
     * @returns {Boolean}
     */
    static isKey(str) {
        return typeof str === "string";
    }

    /**
     * Will return true if the key is not Infinity
     * @param data Any data
     * @returns {Boolean}
     */
    static isValue(data) {
        if (data === Infinity || data === -Infinity) return false;
        if (typeof data === "undefined") return false;
        return true;
    }

     /**
     * Sort data
     * @param {string} key Key
     * @param {Array} data Data
     * @param {object} ops options
     */
    static sort(key, data, ops) {
        if (!key || !data || !Array.isArray(data)) return [];
        let arb = data.filter(i => i.ID.startsWith(key));
        if (ops.sort && typeof ops.sort === 'string') {
            if (ops.sort.startsWith('.')) ops.sort = ops.sort.slice(1);
            ops.sort = ops.sort.split('.');
            arb = _.sortBy(arb, ops.sort).reverse();
        }
        return arb;
    }

}

module.exports = Util