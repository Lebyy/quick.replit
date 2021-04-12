const Util = require('./Util');
const fetch = require("node-fetch");
/**
 * quick.replit -
 * Created by Lebyy_Dev.
 */

class Database {
    
    /**
     * Creates ReplitDB instance
     * @param {string} ReplitDBShard Repl.it project domain
     * @example const quickreplit = require("quick.replit");
     * const db = new quickreplit.Database("url");
     */
     constructor(dbURL){
		 if (dbURL) this.url = dbURL;
     else this.url = process.env.REPLIT_DB_URL;
     if(!this.url) throw new Error("An URL was not provied/obtained!", "URLError");
     }

    /**
     * Sets a value to the specified key on the database
     * @param {string} key Key
     * @param value Data
     * @example db.set("foo", "bar").then(() => console.log("Saved data"));
    */
     async set(key, value, ops = {}){
      if (!Util.isKey(key)) throw new Error("Invalid key provided!", "KeyError");
      if (!Util.isValue(value)) throw new Error("Invalid value provided!", "ValueError");
			let body = await fetch(this.url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: encodeURIComponent(key) + "=" + JSON.stringify(value),
      });
			if(body.status != 200) throw new Error("The ReplitDBShard URL is invalid! No data was found.", "ReplitDBError");
      if(body.status == 429) {
			return await this._handle429(key, value, ops);
			}
			return true;
    }

		/**
     * Fetches everything and sorts by given target
     * @param {string} key Key
     * @param {object} ops Options
     * @example const data = await db.startsWith("money", { sort: ".data" });
    */
    async setMany(items = [], ops = {}) {
     if (!Array.isArray(items)) throw new Error("Items must be an Array!", "ValueError");
     const cleaned = items.filter(item => item.key && typeof item.key === "string");
     cleaned.forEach(async (clean) => {
     await this.set(clean.key, clean.value, ops);
     });
     return cleaned;
    }

        /**
     * Sets a value to the specified key on the database
     * @param {string} key Key
     * @param value Data
     * @example db.set("foo", "bar").then(() => console.log("Saved data"));
    */
    async write(key, value, ops = {}){
      return this.set(key, value);
    }

    /**
     * Deletes a data from the database
     * @param {string} key Key
     * @example db.delete("foo").then(() => console.log("Deleted data"));
    */
    async delete(key, ops = {}){
      if (!Util.isKey(key)) throw new Error("Invalid key provided!", "KeyError");
      let body = await fetch(this.url + "/" + encodeURIComponent(key), { method: "DELETE" });
      return true;
    }

    /**
     * Fetches the data from database
     * @param {string} key Key
     * @example db.fetch("foo").then(console.log);
     */
    async fetch(key, ops = {}){
		if (!Util.isKey(key)) throw new Error("Invalid key provided!", "KeyError");
    let data;
    let body = await fetch(this.url + "/" + encodeURIComponent(key)).then((res) => res.text())
		if (ops.raw) {
    return body;
    }
    if (!body) {
    return null;
    }
		let value = body;
    try {
    value = JSON.parse(value);
    } catch (_err) {
    throw new SyntaxError(
    `Failed to parse value of ${key}, try passing a raw option to get the raw value`
     );
    }
    if (value === null || value === undefined) {
    return null;
    }
		return value;
		}

    /**
     * Fetches the data from database
     * @param {string} key Key
     * @example db.get("foo").then(console.log);
    */
    async get(key, ops = {}){
    return await this.fetch(key, ops)
    }

    /**
     * Checks if there is a data stored with the given key
     * @param {string} key Key
     * @example db.exists("foo").then(console.log);
    */
    async exists(key, ops = {}) {
      if (!Util.isKey(key)) throw new Error("Invalid key specified!", "KeyError");
      let get = await this.get(key);
      return !!get;
    }

    /**
     * Checks if there is a data stored with the given key
     * @param {string} key Key
     * @example db.has("foo").then(console.log);
    */
    async has(key, ops = {}) {
      return await this.exists(key);
    }

		/**
     * Checks if there is a data stored with the given key
     * @param {string} key Key
     * @example db.has("foo").then(console.log);
    */
    async typeof(key, ops = {}) {
      return await this.exists(key);
    }

    /**
     * Returns everything from the database
     * @returns {Promise <Array>}
     * @example let data = await db.all();
     * console.log(`There are total ${data.length} entries.`);
    */
    async all(ops = {}){
				let output = [];
				let outputobj = {};
        for (const key of await this.listall()) {
        let value = await this.get(key);
        outputobj.ID = key;
				outputobj.data = value;
				output.push(outputobj)
        }
        return output;
    }

		/**
     * Returns everything from the database
     * @returns {Promise <Array>}
     * @example let data = await db.all();
     * console.log(`There are total ${data.length} entries.`);
    */
    async raw(ops = {}){
				let output = {};
        for (const key of await this.listall()) {
        let value = await this.get(key);
        output[key] = value;
        }
        return output;
    }

		/**
     * Returns everything from the database
     * @returns {Promise <Array>}
     * @example let data = await db.all();
     * console.log(`There are total ${data.length} entries.`);
    */
    async listall(prefix = "", ops = {}) {
    return await fetch(
      this.url + `?encode=true&prefix=${encodeURIComponent(prefix)}`
    )
      .then((r) => r.text())
      .then((t) => {
        if (t.length === 0) {
          return [];
        }
				let list = []
        return t.split("\n").map(decodeURIComponent);
			})
    }

     /**
     * A math calculation
     * @param {string} key Data key
     * @param {string} operator One of +, -, * or /
     * @param {number} value The value, must be a number
     * @example db.math("items", "+", 200).then(() => console.log("Added 200 items"));
     */
    async math(key, operator, value, ops = {}) {
      if (!Util.isKey(key)) throw new Error("Invalid key specified!", "KeyError");
      if (!operator) throw new Error("No operator provided!");
      if (!Util.isValue(value)) throw new Error("Invalid value specified!", "ValueError");

      switch(operator) {
          case "add":
          case "+":
              let add = await this.get(key)
              if (!add) {
                  return this.set(key, value);
              } else {
                  if (typeof add !== "number") throw new Error("Target is not a number!");
                  return this.set(key, add + value);
              }
              break;

          case "subtract":
          case "sub":
          case "-":
              let less = await this.get(key);
              if (!less) {
                  return this.set(key, value);
              } else {
                  if (typeof less !== "number") throw new Error("Target is not a number!");
                  return this.set(key, less - value);
              }
              break;

          case "multiply":
          case "mul":
          case "*":
              let mul = await this.get(key);
              if (!mul) {
                  return this.set(key, value);
              } else {
                  if (typeof mul !== "number") throw new Error("Target is not a number!");
                  return this.set(key, mul * value);
              }
              break;

          case "divide":
          case "div":
          case "/":
              let div = await this.get(key);
              if (!div) {
                  return this.set(key, value);
              } else {
                  if (typeof div !== "number") throw new Error("Target is not a number!");
                  return this.set(key, div / value);
              }
              break;
          default:
              throw new Error("Unknown operator provided!");
        }
    }

        /**
     * Add to a number value
     * @param {string} key key
     * @param {number} value value
     * @example db.add("items", 200).then(() => console.log("Added 200 items"));
     */
    async add(key, value, ops = {}) {
      return await this.math(key, "+", value);
  }

  /**
   * Subtract to a number value
   * @param {string} key Key
   * @param {number} value Value     
   * @example db.subtract("items", 100).then(() => console.log("Removed 100 items"));
   */
     async subtract(key, value, ops = {}) {
        return await this.math(key, "-", value);
     }

    /**
     * Fetches everything and sorts by given target
     * @param {string} key Key
     * @param {object} ops Options
     * @example const data = await db.startsWith("money", { sort: ".data" });
    */
    async startsWith(key, ops = {}) {
      if (!key || typeof key !== "string") throw new Error(`Expected key to be a string, but received a ${typeof key}`);
      let all = await this.all();
      return Util.sort(key, all, ops);
    }

		/**
     * Fetches everything and sorts by given target
     * @param {string} key Key
     * @param {object} ops Options
     * @example const data = await db.startsWith("money", { sort: ".data" });
    */
    async push(key, value, ops = {}) {
      if (!Util.isKey(key)) throw new Error("Invalid key provided!", "KeyError");
      if (!Util.isValue(value)) throw new Error("Invalid value provided!", "ValueError");
			let data = await this.get(key)
			if(!data){
			return await this.set(key, [value]);
			}
			if(data){
			if (!Array.isArray(data)) throw new Error("Data is not an Array!", "ValueError");
			data.push(value)
      return await this.set(key, data);
			}
    }

		/**
     * Fetches everything and sorts by given target
     * @param {string} key Key
     * @param {object} ops Options
     * @example const data = await db.startsWith("money", { sort: ".data" });
    */
    async pull(key, value, ops = {}) {
			if (!Util.isKey(key)) throw new Error("Invalid key provided!", "KeyError");
      if (!Util.isValue(value)) throw new Error("Invalid value provided!", "ValueError");
			const oldData = await this.get(key);
      if (!Array.isArray(oldData)) throw new Error("Data is not an Array!", "ValueError");
      let newData;
      if (Array.isArray(value)) newData = oldData.filter(d => !value.includes(d));
      else newData = oldData.filter(d => d !== value);
      return await this.set(key, newData);
    }


		/**
     * Fetches everything and sorts by given target
     * @param {string} key Key
     * @param {object} ops Options
     * @example const data = await db.startsWith("money", { sort: ".data" });
    */
    async clear(ops = {}) {
      const promises = [];
      for (const key of await this.listall()) {
      promises.push(this.delete(key));
      }
      return true;
    }

		/**
     * Fetches everything and sorts by given target
     * @param {string} key Key
     * @param {object} ops Options
     * @example const data = await db.startsWith("money", { sort: ".data" });
    */
    async import(data=[]) {
    return new Promise(async (resolve, reject) => {
    if (!Array.isArray(data)) return reject(new Error(`Data type must be Array, received ${typeof data}!`, "DataTypeError"));
    if (data.length < 1) return resolve(false);
    data.forEach((x, i) => {
    if (!x.ID || !x.data) return reject(new Error(`Data is missing ${!x.ID ? "ID" : "data"} path!`, "DataImportError"));
    setTimeout(async () => {
    await this.set(x.ID, x.data);
    }, 150 * (i + 1));
    });
    return resolve(true);
    });
    }

		/**
     * Fetches everything and sorts by given target
     * @param {string} key Key
     * @param {object} ops Options
     * @example const data = await db.startsWith("money", { sort: ".data" });
    */
    async exportToQuickDB(quickdb) {
    if (!quickdb) throw new Error("Quick.db instance was not provided!");
    const data = await this.all();
    data.forEach(item => {
    quickdb.set(item.ID, item.data);
    });
    return quickdb.all();
    }

		/**
     * Fetches everything and sorts by given target
     * @param {string} key Key
     * @param {object} ops Options
     * @example const data = await db.startsWith("money", { sort: ".data" });
    */
    async exportToQuickMongo(quickmongo) {
    if (!quickmongo) throw new Error("Quick Mongo instance was not provided!");
    const data = await this.all();
    data.forEach(async (item) => {
    await quickmongo.set(item.ID, item.data);
    });
    return quickmongo.all();
    }
    
		/**
     * Write latency
     * @ignore
     * @private
     * @returns {Promise<number>}
     */
		async _write() {
    const start = Date.now();
    await this.set("LQ==", Buffer.from(start.toString()).toString("base64"));
    return Date.now() - start;
    }

		/**
     * Read latency
     * @ignore
     * @private
     * @returns {Promise<number>}
     */
		async _read() {
    const start = Date.now();
    await this.get("LQ==");
    return Date.now() - start;
    }

		/**
     * Delete latency
     * @ignore
     * @private
     * @returns {Promise<number>}
     */
		async _delete() {
    const start = Date.now();
    await this.delete("LQ==");
    return Date.now() - start;
    }

		/**
     * Handles 429
     * @ignore
     * @private
     * @returns {Promise<boolean>}
     */
		async _handle429(key, value, ops) {
    async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
    }
		await sleep(ops.sleep || 3500)
    return this.set(key, value, ops);
    }

    /**
     * Fetches the overall ping of your database shard, in MS
     * @example const ping = await db.ping();
     * console.log("Ping: ", ping);
    */
    async ping(ops = {}){
			const writeping = await this._write();
			const readping = await this._read();
			const deleteping = await this._delete();
			const average = (writeping + readping + deleteping) / 3;
			const ltc = {
				write: writeping + "ms",
				read: readping + "ms",
				delete: deleteping + "ms",
				average: Math.round(average) + "ms"
			};
      return ltc; 
    }

}

module.exports = Database;
