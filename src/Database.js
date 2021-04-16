const Util = require('./Util');
const fetch = require('node-fetch');
const {EventEmitter} = require('events');

/**
 * quick.replit -
 * Created by Lebyy_Dev.
 */
class Database extends EventEmitter {
    /**
   * Inititates the quick.replit instance!
   * @param {string} dbURL Replit database URL.
   * @example const { Database } = require("quick.replit");
   * const db = new Database("url");
   */
    constructor(dbURL) {
        super();
        if (dbURL) this.url = dbURL;
        else this.url = process.env.REPLIT_DB_URL;
        if (!this.url) throw new Error('An URL was not provied/obtained!', 'URLError');
        this.readyAt = new Date();
        this.tries = 3;
        setTimeout(()=>this.emit('ready'),0);
    }

    /**
   * Sets a value to the specified key on the database!
   * @param {string} key The key to set.
   * @param value The value to set on the key.
   * @param {object} [ops={}] Set options.
   * @param {number} [ops.sleep=3500] Alter the time to sleep for if the response code is 429.
   * @return {Promise<Boolean>}
   * @example await db.set("foo", "bar").then(() => console.log("Saved data"));
   */
    async set(key, value, ops = {}) {
        if (!Util.isKey(key)) throw new Error('Invalid key provided!', 'KeyError');
        if (!Util.isValue(value)) throw new Error('Invalid value provided!', 'ValueError');
        if (!ops.sleep || typeof ops.sleep !== "number" || ops.sleep < 1) ops.sleep = 3500
        this.emit('debug', `Setting ${value} to ${key}`);
        const body = await fetch(this.url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: encodeURIComponent(key) + '=' + encodeURIComponent(JSON.stringify(value)),
        });
        if (body.status != 200) {
            throw new Error(
                'The Replit Database URL is invalid! No data was found.',
                'ReplitDBError'
            );
        }
        if (body.status == 429) {
            if (this.tries == 0) {
                this.tries = 3;
                return this.emit(
                    'error',
                    `Quick.Replit encountered 429 error code on saving ${key} while setting ${value}, Quick.Replit re-tried for 3 times but failed at saving you will have to run the function again after some time`
                );
            }
            this.emit(
                'error',
                `Quick.Replit encountered 429 error code on saving ${key} while setting ${value}, Quick.Replit will retry for 3 more times if it fails you will have to run the function again after some time`
            );
            ops.set = true;
            await this._handle429(key, value, ops);
        }
        if (body.status == 200) {
        this.tries = 3;
        return true;
        }
    }

    /**
   * Set's the value in each element of array to the key in each element of array!
   * @param {Array} items The Data Array.
   * @param {object} [ops={}] Set options.
   * @param {number} [ops.sleep=3500] Alter the time to sleep for if the response code is 429.
   * @return {Promise<any[]>}
   * @example const data = [
   * { key: "test_1", value: "hello1" },
   * { key: "test_2", value: "hello2" },
   * { key: "test_3", value: "hello3" },
   * { key: "test_4", value: "hello4" },
   * { key: "test_5", value: "hello5" },
   * { key: "test_6", value: "hello6" },
   * { key: "test_7", value: "hello7" },
   * { key: "test_8", value: "hello8" },
   * { key: "test_9", value: "hello9" }
   * ];
   * await db.setMany(data)
   */
    async setMany(items = [], ops = {}) {
        if (!Array.isArray(items)) throw new Error('Items must be an Array!', 'ValueError');
        const cleaned = items.filter(
            (item) => item.key && typeof item.key === 'string'
        );
        cleaned.forEach(async (clean) => {
            await this.set(clean.key, clean.value, ops);
        });
        return cleaned;
    }

    /**
   * Writes a value to the specified key on the database (Similar to set)!
   * @param {string} key The key to set.
   * @param {string} value The value to set on the key.
   * @param {object} [ops={}] Write options.
   * @param {number} [ops.sleep=3500] Alter the time to sleep for if the response code is 429.
   * @example await db.write("foo", "bar").then(() => console.log("Saved data"));
   */
    async write(key, value, ops = {}) {
        return this.set(key, value, ops);
    }

    /**
   * Deletes a key from the database!
   * @param {string} key The key to set.
   * @param {object} [ops={}] Delete options.
   * @param {number} [ops.sleep=3500] Alter the time to sleep for if the response code is 429.
   * @return {Promise<Boolean>}
   * @example db.delete("foo").then(() => console.log("Deleted data"));
   */
    async delete(key, ops = {}) {
        if (!Util.isKey(key)) throw new Error('Invalid key provided!', 'KeyError');
        if (!ops.sleep || typeof ops.sleep !== "number" || ops.sleep < 1) ops.sleep = 3500
        this.emit('debug', `Deleting ${key}`);
        const body = await fetch(this.url + '/' + encodeURIComponent(key), {
            method: 'DELETE',
        });
        if (body.status == 429) {
            if (this.tries == 0) {
                this.tries = 3;
                return this.emit(
                    'error',
                    `Quick.Replit encountered 429 error code on deleting ${key}, Quick.Replit re-tried for 3 times but still failed at fetching you will have to run the function again after some time`
                );
            }
            this.emit(
                'error',
                `Quick.Replit encountered 429 error code on deleting ${key}, Quick.Replit will retry for 3 more times if it fails you will have to run the function again after some time`
            );
            ops.delete = true;
            await this._handle429(key, null, ops);
        }
        if (body.status == 200 || body.status == 204 || body.status == 404) {
            if (this.tries != 3) this.tries = 3;
            return true;
        }
    }

    /**
   * Fetches the value stored on the key from database!
   * @param {string} key The key to set.
   * @param {object} [ops={}] Get options.
   * @param {boolean} [ops.raw=false] If set to true, it will return the raw un-parsed data.
   * @param {number} [ops.sleep=3500] Alter the time to sleep for if the response code is 429.
   * @return {Promise<any>}
   * @example await db.fetch("foo").then(console.log);
   */
    async fetch(key, ops = {}) {
        if (!Util.isKey(key)) throw new Error('Invalid key provided!', 'KeyError');
        if (!ops.sleep || typeof ops.sleep !== "number" || ops.sleep < 1) ops.sleep = 3500
        if (typeof ops.raw !== "boolean") ops.raw = false;
        let data;
        this.emit('debug', `Getting ${key}`);
        let body = await fetch(this.url + '/' + encodeURIComponent(key));
        if (body.status == 429) {
            if (this.tries == 0) {
                this.tries = 3;
                return this.emit(
                    'error',
                    `Quick.Replit encountered 429 error code on fetching ${key}, Quick.Replit re-tried for 3 times but still failed at fetching you will have to run the function again after some time`
                );
            }
            this.emit(
                'error',
                `Quick.Replit encountered 429 error code on fetching ${key}, Quick.Replit will retry for 3 more times if it fails you will have to run the function again after some time`
            );
            ops.fetch = true;
            await this._handle429(key, null, ops);
        }
        if (body.status == 200 || body.status == 404) {
            if (this.tries != 3) this.tries = 3;
            body = await body.text();
            body = decodeURIComponent(body);
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
                return body;
            }
            if (value == null || value == undefined) {
                return null;
            }
            return value;
        }
    }

    /**
   * Fetches the data from database!
   * @param {string} key Key
   * @param {object} [ops={}] Fetch options.
   * @param {boolean} [ops.raw=false] If set to true, it will return the raw un-parsed data.
   * @param {number} [ops.sleep=3500] Alter the time to sleep for if the response code is 429.
   * @return {Promise<any>}
   * @example await db.get("foo").then(console.log);
   */
    async get(key, ops = {}) {
        return await this.fetch(key, ops);
    }

    /**
   * Checks if there is a data stored with the given key!
   * @param {string} key Key
   * @param {object} [ops={}] Exists options
   * @param {boolean} [ops.raw=false] If set to true, it will return the raw un-parsed data.
   * @param {number} [ops.sleep=3500] Alter the time to sleep for if the response code is 429.
   * @return {Promise<Boolean>}
   * @example await db.exists("foo").then(console.log);
   */
    async exists(key, ops = {}) {
        if (!Util.isKey(key)) throw new Error('Invalid key specified!', 'KeyError');
        const get = await this.get(key, ops);
        return !!get;
    }

    /**
   * Checks if there is a data stored with the given key! (Similiar to the exists method)
   * @param {string} key Key
   * @param {object} [ops={}] Has options
   * @param {boolean} [ops.raw=false] If set to true, it will return the raw un-parsed data.
   * @param {number} [ops.sleep=3500] Alter the time to sleep for if the response code is 429.
   * @return {Promise<Boolean>}
   * @example await db.has("foo").then(console.log);
   */
    async has(key, ops = {}) {
        return await this.exists(key, ops);
    }

    /**
   * Checks the type of value stored in the key! (Similar to type method)
   * @param {string} key The key to set.
   * @param {object} [ops={}] TypeOf options
   * @param {boolean} [ops.raw=false] If set to true, it will return the raw un-parsed data.
   * @param {number} [ops.sleep=3500] Alter the time to sleep for if the response code is 429.
   * @return {Promise<"string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function" | "array">}
   * @example await db.typeof("foo").then(console.log);
   */
    async typeof(key, ops = {}) {
        return await this.type(key, ops);
    }

    /**
   * Returns everything from the database
   * @param {object} [ops={}] All options
   * @param {boolean} [ops.raw=false] If set to true, it will return the raw un-parsed data.
   * @param {number} [ops.sleep=3500] Alter the time to sleep for if the response code is 429.
   * @param {number} [ops.limit=0] Fetch data only upto the specified limit (0 = Unlimited).
   * @return {Promise<Array>}
   * @example let data = await db.all();
   * console.log(`There are total ${data.length} entries.`);
   */
    async all(ops = {}) {
        if (!ops.limit || typeof ops.limit !== "number" || ops.limit < 1) ops.limit = 0;
        let output = [];
        for (const key of await this.listall('', ops)) {
            const value = await this.get(key, ops);
            output.push({ID: key, data: value});
        }
        if (!!ops.limit) output = output.slice(0, ops.limit);
        return output;
    }

    /**
   * Returns raw data object from the database {key: value}!
   * @param {object} [ops={}] Raw options
   * @param {boolean} [ops.raw=false] If set to true, it will return the raw un-parsed data.
   * @param {number} [ops.sleep=3500] Alter the time to sleep for if the response code is 429.
   * @param {number} [ops.limit=0] Fetch data only upto the specified limit (0 = Unlimited).
   * @return {Promise<Object>}
   * @example await db.raw().then(console.log);
   */
    async raw(ops = {}) {
        if (!ops.limit || typeof ops.limit !== "number" || ops.limit < 1) ops.limit = 0;
        let output = {};
        for (const key of await this.listall('', ops)) {
            const value = await this.get(key, ops);
            output[key] = value;
        }
        if (!!ops.limit) output = output.slice(0, ops.limit);
        return output;
    }

    /**
   * Returns all of the key's from the database!
   * @param {string} [prefix=""] The prefix to listall keys from.
   * @param {object} [ops={}] TypeOf options
   * @param {number} [ops.sleep=3500] Alter the time to sleep for if the response code is 429.
   * @return {Promise<Array>}
   * @example await db.listall().then(console.log);
   */
    async listall(prefix = '', ops = {}) {
        this.emit('debug', 'Listing all the keys from the database...');
        if (!ops.sleep || typeof ops.sleep !== "number" || ops.sleep < 1) ops.sleep = 3500;
        let body = await fetch(
            this.url + `?encode=true&prefix=${encodeURIComponent(prefix)}`
        );
        if (body.status == 429) {
            if (this.tries == 0) {
                this.tries = 3;
                return this.emit(
                    'error',
                    'Quick.Replit encountered 429 error code on listing all the keys, Quick.Replit re-tried for 3 times but still failed at fetching you will have to run the function again after some time'
                );
            }
            this.emit(
                'error',
                'Quick.Replit encountered 429 error code on listing all the keys, Quick.Replit will retry for 3 more times if it fails you will have to run the function again after some time'
            );
            ops.listall = true;
            await this._handle429(prefix, null, ops);
        }
        if(this.tries != 3) this.tries = 3;
        body = await body.text();
        if (body.length === 0) {
            return [];
        }
        const list = [];
        return body.split('\n').map(decodeURIComponent);
    }

    /**
   * Does a math calculation and stores the value in the database!
   * @param {string} key Data key
   * @param {string} operator One of +, -, * or /
   * @param {number} value The value, must be a number
   * @param {object} [ops={}] Math options
   * @param {boolean} [ops.raw=false] If set to true, it will return the raw un-parsed data.
   * @param {number} [ops.sleep=3500] Alter the time to sleep for if the response code is 429.
   * @return {Promise<Boolean>}
   * @example db.math("items", "+", 200).then(() => console.log("Added 200 items"));
   */
    async math(key, operator, value, ops = {}) {
        if (!Util.isKey(key)) throw new Error('Invalid key specified!', 'KeyError');
        if (!operator) throw new Error('No operator provided!');
        if (!Util.isValue(value)) throw new Error('Invalid value specified!', 'ValueError');

        switch (operator) {
        case 'add':
        case '+':
            const add = await this.get(key, ops);
            if (!add) {
                return this.set(key, value, ops);
            } else {
                if (typeof add !== 'number') {
                    throw new Error('Target is not a number!');
                }
                return this.set(key, add + value, ops);
            }
            break;

        case 'subtract':
        case 'sub':
        case '-':
            const less = await this.get(key, ops);
            if (!less) {
                return this.set(key, value, ops);
            } else {
                if (typeof less !== 'number') {
                    throw new Error('Target is not a number!');
                }
                return this.set(key, less - value, ops);
            }
            break;

        case 'multiply':
        case 'mul':
        case '*':
            const mul = await this.get(key, ops);
            if (!mul) {
                return this.set(key, value, ops);
            } else {
                if (typeof mul !== 'number') {
                    throw new Error('Target is not a number!');
                }
                return this.set(key, mul * value, ops);
            }
            break;

        case 'divide':
        case 'div':
        case '/':
            const div = await this.get(key, ops);
            if (!div) {
                return this.set(key, value, ops);
            } else {
                if (typeof div !== 'number') {
                    throw new Error('Target is not a number!');
                }
                return this.set(key, div / value, ops);
            }
            break;
        default:
            throw new Error('Unknown operator provided!');
        }
    }

    /**
   * Adds +1 to the the value of the key specified in the database!
   * @param {string} key key
   * @param {number} value value
   * @param {object} [ops={}] Add options
   * @param {number} [ops.sleep=3500] Alter the time to sleep for if the response code is 429.
   * @return {Promise<Boolean>}
   * @example db.add("items", 200).then(() => console.log("Added 200 items"));
   */
    async add(key, value, ops = {}) {
        return await this.math(key, '+', value, ops);
    }

    /**
   * Subtract's 1 from the the value of the key specified in the database!
   * @param {string} key Key
   * @param {number} value Value
   * @param {object} [ops={}] Add options
   * @param {number} [ops.sleep=3500] Alter the time to sleep for if the response code is 429.
   * @return {Promise<Boolean>}
   * @example db.subtract("items", 100).then(() => console.log("Removed 100 items"));
   */
    async subtract(key, value, ops = {}) {
        return await this.math(key, '-', value, ops);
    }

    /**
   * Fetches everything from the database and sorts by given target!
   * @param {string} key Key
   * @param {object} [ops={}] StartsWith options
   * @param {boolean} [ops.raw=false] If set to true, it will return the raw un-parsed data.
   * @param {number} [ops.sleep=3500] Alter the time to sleep for if the response code is 429.
   * @param {number} [ops.limit=0] Fetch data only upto the specified limit (0 = Unlimited).
   * @return {Promise<Array>}
   * @example const data = await db.startsWith("money", { sort: ".data" });
   */
    async startsWith(key, ops = {}) {
        if (!key || typeof key !== 'string') {
            throw new Error(
                `Expected key to be a string, but received a ${typeof key}`
            );
        }
        const all = await this.all(ops);
        return Util.sort(key, all, ops);
    }

    /**
   * Pushe's the specific value into an array to the key in the database!
   * @param {string} key Key
   * @param {string} value Value
   * @param {object} [ops={}] Push options
   * @param {boolean} [ops.raw=false] If set to true, it will return the raw un-parsed data.
   * @param {number} [ops.sleep=3500] Alter the time to sleep for if the response code is 429.
   * @return {Promise<Boolean>}
   * @example const data = await db.push("foo", "bar");
   */
    async push(key, value, ops = {}) {
        if (!Util.isKey(key)) throw new Error('Invalid key provided!', 'KeyError');
        if (!Util.isValue(value)) throw new Error('Invalid value provided!', 'ValueError');
        this.emit('debug', `Pushing ${value} to ${key}`);
        const data = await this.get(key, ops);
        if (!data) {
            return await this.set(key, [value], ops);
        }
        if (data) {
            if (!Array.isArray(data)) throw new Error('Data is not an Array!', 'ValueError');
            data.push(value);
            return await this.set(key, data, ops);
        }
    }

    /**
   * Pull's the specific value from an array to the key in the database!
   * @param {string} key Key
   * @param {string} value Value
   * @param {object} [ops={}] Pull options
   * @param {boolean} [ops.raw=false] If set to true, it will return the raw un-parsed data.
   * @param {number} [ops.sleep=3500] Alter the time to sleep for if the response code is 429.
   * @return {Promise<Boolean>}
   * @example const data = await db.pull("foo", "bar");
   */
    async pull(key, value, ops = {}) {
        if (!Util.isKey(key)) throw new Error('Invalid key provided!', 'KeyError');
        if (!Util.isValue(value)) throw new Error('Invalid value provided!', 'ValueError');
        this.emit('debug', `Pulling ${value} from ${key}`);
        const oldData = await this.get(key, ops);
        if (!Array.isArray(oldData)) throw new Error('Data is not an Array!', 'ValueError');
        let newData;
        if (Array.isArray(value)) {
            newData = oldData.filter((d) => !value.includes(d));
        } else newData = oldData.filter((d) => d !== value);
        return await this.set(key, newData, ops);
    }

    /**
   * Return's the value type of the key!
   * @param {string} key key
   * @param {object} [ops={}] Type options
   * @param {boolean} [ops.raw=false] If set to true, it will return the raw un-parsed data.
   * @param {number} [ops.sleep=3500] Alter the time to sleep for if the response code is 429.
   * @example console.log(await db.type("foo"));
   * @return {Promise<"string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function" | "array">}
   */
    async type(key, ops) {
        if (!Util.isKey(key)) throw new Error('Invalid Key!', 'KeyError');
        const fetched = await this.get(key, ops);
        if (Array.isArray(fetched)) return 'array';
        return typeof fetched;
    }

    /**
   * Delete's all of the data from the database!
   * @param {object} [ops={}] Clear options
   * @param {number} [ops.sleep=3500] Alter the time to sleep for if the response code is 429.
   * @return {Promise<Boolean>}
   * @example const data = await db.clear();
   */
    async clear(ops = {}) {
        this.emit('debug', 'Deleting everything from the database...');
        const promises = [];
        for (const key of await this.listall('', ops)) {
            promises.push(this.delete(key, ops));
        }
        return true;
    }

    /**
   * Delete's all of the data from the database! (similar to the clear method)
   * @param {object} [ops={}] DeleteAll options
   * @param {number} [ops.sleep=3500] Alter the time to sleep for if the response code is 429.
   * @return {Promise<Boolean>}
   * @example const data = await db.deleteAll();
   */
    async deleteAll(ops = {}) {
        this.emit('debug', 'Deleting everything from the database...');
        return await this.clear(ops);
    }

    /**
   * Import's the specific data from another database into replit database!
   * @param {Array} data Data
   * @param {object} [ops={}] Import options
   * @param {number} [ops.sleep=3500] Alter the time to sleep for if the response code is 429.
   * @return {Promise<Boolean>}
   * @example const data = QuickDB.all();
   * db.import(data);
   */
    import(data = [], ops = {}) {
        return new Promise(async (resolve, reject) => {
            if (!Array.isArray(data)) {
                return reject(
                    new Error(
                        `Data type must be Array, received ${typeof data}!`,
                        'DataTypeError'
                    )
                );
            }
            if (data.length < 1) return resolve(false);
            data.forEach((x, i) => {
                if (!x.ID || !x.data) {
                    return reject(
                        new Error(
                            `Data is missing ${!x.ID ? 'ID' : 'data'} path!`,
                            'DataImportError'
                        )
                    );
                }
                setTimeout(async () => {
                     this.set(x.ID, x.data, ops);
                }, 150 * (i + 1));
            });
            return resolve(true);
        });
    }

    /**
   * Export's all of the data from the database to quick.db!
   * @param {any} quickdb Quick.db instance
   * @param {object} [ops={}] export options
   * @param {boolean} [ops.raw=false] If set to true, it will return the raw un-parsed data.
   * @param {number} [ops.sleep=3500] Alter the time to sleep for if the response code is 429.
   * @param {number} [ops.limit=0] Fetch data only upto the specified limit (0 = Unlimited).
   * @return {Promise<any[]>}
   * @example const data = await db.exportToQuickDB(quickdb);
   */
    async exportToQuickDB(quickdb, ops = {}) {
        if (!quickdb) throw new Error('Quick.db instance was not provided!');
        this.emit('debug', 'Exporting all data from the database to quick.db...');
        const data = await this.all(ops);
        data.forEach((item) => {
            quickdb.set(item.ID, item.data);
        });
        return quickdb.all();
    }

    /**
   * Export's all of the data from the database to quickmongo!
   * @param {any} quickmongo QuickMongo instance
   * @param {object} [ops={}] export options
   * @param {boolean} [ops.raw=false] If set to true, it will return the raw un-parsed data.
   * @param {number} [ops.sleep=3500] Alter the time to sleep for if the response code is 429.
   * @param {number} [ops.limit=0] Fetch data only upto the specified limit (0 = Unlimited).
   * @return {Promise<any[]>}
   * @example const data = await db.exportToQuickMongo(quickmongo);
   */
    async exportToQuickMongo(quickmongo, ops = {}) {
        if (!quickmongo) throw new Error('Quick Mongo instance was not provided!');
        this.emit('debug', 'Exporting all data from the database to quickmongo...');
        const data = await this.all(ops);
        data.forEach(async (item) => {
            await quickmongo.set(item.ID, item.data);
        });
        return quickmongo.all();
    }

    /**
   * Write latency
   * @ignore
   * @private
   * @return {Promise<number>}
   */
    async _write() {
        const start = Date.now();
        await this.set('LQ==', Buffer.from(start.toString()).toString('base64'));
        return Date.now() - start;
    }

    /**
   * Read latency
   * @ignore
   * @private
   * @return {Promise<number>}
   */
    async _read() {
        const start = Date.now();
        await this.get('LQ==');
        return Date.now() - start;
    }

    /**
   * Delete latency
   * @ignore
   * @private
   * @return {Promise<number>}
   */
    async _delete() {
        const start = Date.now();
        await this.delete('LQ==');
        return Date.now() - start;
    }

    /**
   * Handles 429
   * @ignore
   * @private
   * @return {Promise<boolean>}
   */
    async _handle429(key, value, ops = {}) {
        this.tries--;
        async function sleep(ms) {
            return new Promise((resolve) => setTimeout(resolve, ms));
        }
        await sleep(ops.sleep || 3500);
        if (ops.fetch) {
            return this.fetch(key, ops);
        }
        if (ops.delete) {
            return this.delete(key, ops);
        }
        if (ops.set) {
            return this.set(key, value, ops);
        }
        if (ops.listall) {
            return this.listall(key, ops);
        }
    }

    /**
   * Fetches the overall ping of quick.replit database in MS!
   * @param {object} [ops={}] Ping options
   * @example const ping = await db.ping();
   * @return {Promise<Object>}
   * console.log("Average: ", ping.average);
   */
    async ping(ops = {}) {
        this.emit('debug', 'Getting the database ping...');
        const writeping = await this._write();
        const readping = await this._read();
        const deleteping = await this._delete();
        const average = (writeping + readping + deleteping) / 3;
        const ltc = {
            write: writeping + 'ms',
            read: readping + 'ms',
            delete: deleteping + 'ms',
            average: Math.round(average) + 'ms',
        };
        return ltc;
    }

    /**
   * Returns database connection uptime!
   * @return {Promise<Number>}
   * @example console.log(`Database is up for ${db.uptime} ms.`);
   */
    uptime() {
        if (!this.readyAt) return 0;
        const timestamp = this.readyAt.getTime();
        return Date.now() - timestamp;
    }
}

/**
 * Emitted when database creates connection
 * @event Database#ready
 * @example db.on("ready", () => {
 *     console.log("Successfully connected to the database!");
 * });
 */

/**
 * Emitted when database encounters error
 * @event Database#error
 * @param {Error} Error Error Message
 * @example db.on("error", console.error);
 */

/**
 * Emitted on debug mode
 * @event Database#debug
 * @param {string} Message Debug message
 * @example db.on("debug", console.log);
 */

module.exports = Database;
