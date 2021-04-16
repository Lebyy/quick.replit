export = Database;
/**
 * quick.replit -
 * Created by Lebyy_Dev.
 */
declare class Database {
    /**
   * Inititates the quick.replit instance!
   * @param {string} dbURL Replit database URL.
   * @example const { Database } = require("quick.replit");
   * const db = new Database("url");
   */
    constructor(dbURL: string);
    url: any;
    readyAt: Date;
    tries: number;
    /**
   * Sets a value to the specified key on the database!
   * @param {string} key The key to set.
   * @param value The value to set on the key.
   * @param {object} [ops={}] Set options.
   * @param {number} [ops.sleep=3500] Alter the time to sleep for if the response code is 429.
   * @return {Promise<Boolean>}
   * @example await db.set("foo", "bar").then(() => console.log("Saved data"));
   */
    set(key: string, value: any, ops?: {
        sleep?: number;
    }): Promise<boolean>;
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
    setMany(items?: any[], ops?: {
        sleep?: number;
    }): Promise<any[]>;
    /**
   * Writes a value to the specified key on the database (Similar to set)!
   * @param {string} key The key to set.
   * @param {string} value The value to set on the key.
   * @param {object} [ops={}] Write options.
   * @param {number} [ops.sleep=3500] Alter the time to sleep for if the response code is 429.
   * @example await db.write("foo", "bar").then(() => console.log("Saved data"));
   */
    write(key: string, value: string, ops?: {
        sleep?: number;
    }): Promise<boolean>;
    /**
   * Deletes a key from the database!
   * @param {string} key The key to set.
   * @param {object} [ops={}] Delete options.
   * @param {number} [ops.sleep=3500] Alter the time to sleep for if the response code is 429.
   * @return {Promise<Boolean>}
   * @example db.delete("foo").then(() => console.log("Deleted data"));
   */
    delete(key: string, ops?: {
        sleep?: number;
    }): Promise<boolean>;
    /**
   * Fetches the value stored on the key from database!
   * @param {string} key The key to set.
   * @param {object} [ops={}] Get options.
   * @param {boolean} [ops.raw=false] If set to true, it will return the raw un-parsed data.
   * @param {number} [ops.sleep=3500] Alter the time to sleep for if the response code is 429.
   * @return {Promise<any>}
   * @example await db.fetch("foo").then(console.log);
   */
    fetch(key: string, ops?: {
        raw?: boolean;
        sleep?: number;
    }): Promise<any>;
    /**
   * Fetches the data from database!
   * @param {string} key Key
   * @param {object} [ops={}] Fetch options.
   * @param {boolean} [ops.raw=false] If set to true, it will return the raw un-parsed data.
   * @param {number} [ops.sleep=3500] Alter the time to sleep for if the response code is 429.
   * @return {Promise<any>}
   * @example await db.get("foo").then(console.log);
   */
    get(key: string, ops?: {
        raw?: boolean;
        sleep?: number;
    }): Promise<any>;
    /**
   * Checks if there is a data stored with the given key!
   * @param {string} key Key
   * @param {object} [ops={}] Exists options
   * @param {boolean} [ops.raw=false] If set to true, it will return the raw un-parsed data.
   * @param {number} [ops.sleep=3500] Alter the time to sleep for if the response code is 429.
   * @return {Promise<Boolean>}
   * @example await db.exists("foo").then(console.log);
   */
    exists(key: string, ops?: {
        raw?: boolean;
        sleep?: number;
    }): Promise<boolean>;
    /**
   * Checks if there is a data stored with the given key! (Similiar to the exists method)
   * @param {string} key Key
   * @param {object} [ops={}] Has options
   * @param {boolean} [ops.raw=false] If set to true, it will return the raw un-parsed data.
   * @param {number} [ops.sleep=3500] Alter the time to sleep for if the response code is 429.
   * @return {Promise<Boolean>}
   * @example await db.has("foo").then(console.log);
   */
    has(key: string, ops?: {
        raw?: boolean;
        sleep?: number;
    }): Promise<boolean>;
    /**
   * Checks the type of value stored in the key! (Similar to type method)
   * @param {string} key The key to set.
   * @param {object} [ops={}] TypeOf options
   * @param {boolean} [ops.raw=false] If set to true, it will return the raw un-parsed data.
   * @param {number} [ops.sleep=3500] Alter the time to sleep for if the response code is 429.
   * @return {Promise<"string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function" | "array">}
   * @example await db.typeof("foo").then(console.log);
   */
    typeof(key: string, ops?: {
        raw?: boolean;
        sleep?: number;
    }): Promise<"string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function" | "array">;
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
    all(ops?: {
        raw?: boolean;
        sleep?: number;
        limit?: number;
    }): Promise<any[]>;
    /**
   * Returns raw data object from the database {key: value}!
   * @param {object} [ops={}] Raw options
   * @param {boolean} [ops.raw=false] If set to true, it will return the raw un-parsed data.
   * @param {number} [ops.sleep=3500] Alter the time to sleep for if the response code is 429.
   * @param {number} [ops.limit=0] Fetch data only upto the specified limit (0 = Unlimited).
   * @return {Promise<Object>}
   * @example await db.raw().then(console.log);
   */
    raw(ops?: {
        raw?: boolean;
        sleep?: number;
        limit?: number;
    }): Promise<any>;
    /**
   * Returns all of the key's from the database!
   * @param {string} [prefix=""] The prefix to listall keys from.
   * @param {object} [ops={}] TypeOf options
   * @param {number} [ops.sleep=3500] Alter the time to sleep for if the response code is 429.
   * @return {Promise<Array>}
   * @example await db.listall().then(console.log);
   */
    listall(prefix?: string, ops?: {
        sleep?: number;
    }): Promise<any[]>;
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
    math(key: string, operator: string, value: number, ops?: {
        raw?: boolean;
        sleep?: number;
    }): Promise<boolean>;
    /**
   * Adds +1 to the the value of the key specified in the database!
   * @param {string} key key
   * @param {number} value value
   * @param {object} [ops={}] Add options
   * @param {number} [ops.sleep=3500] Alter the time to sleep for if the response code is 429.
   * @return {Promise<Boolean>}
   * @example db.add("items", 200).then(() => console.log("Added 200 items"));
   */
    add(key: string, value: number, ops?: {
        sleep?: number;
    }): Promise<boolean>;
    /**
   * Subtract's 1 from the the value of the key specified in the database!
   * @param {string} key Key
   * @param {number} value Value
   * @param {object} [ops={}] Add options
   * @param {number} [ops.sleep=3500] Alter the time to sleep for if the response code is 429.
   * @return {Promise<Boolean>}
   * @example db.subtract("items", 100).then(() => console.log("Removed 100 items"));
   */
    subtract(key: string, value: number, ops?: {
        sleep?: number;
    }): Promise<boolean>;
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
    startsWith(key: string, ops?: {
        raw?: boolean;
        sleep?: number;
        limit?: number;
    }): Promise<any[]>;
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
    push(key: string, value: string, ops?: {
        raw?: boolean;
        sleep?: number;
    }): Promise<boolean>;
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
    pull(key: string, value: string, ops?: {
        raw?: boolean;
        sleep?: number;
    }): Promise<boolean>;
    /**
   * Return's the value type of the key!
   * @param {string} key key
   * @param {object} [ops={}] Type options
   * @param {boolean} [ops.raw=false] If set to true, it will return the raw un-parsed data.
   * @param {number} [ops.sleep=3500] Alter the time to sleep for if the response code is 429.
   * @example console.log(await db.type("foo"));
   * @return {Promise<"string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function" | "array">}
   */
    type(key: string, ops?: {
        raw?: boolean;
        sleep?: number;
    }): Promise<"string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function" | "array">;
    /**
   * Delete's all of the data from the database!
   * @param {object} [ops={}] Clear options
   * @param {number} [ops.sleep=3500] Alter the time to sleep for if the response code is 429.
   * @return {Promise<Boolean>}
   * @example const data = await db.clear();
   */
    clear(ops?: {
        sleep?: number;
    }): Promise<boolean>;
    /**
   * Delete's all of the data from the database! (similar to the clear method)
   * @param {object} [ops={}] DeleteAll options
   * @param {number} [ops.sleep=3500] Alter the time to sleep for if the response code is 429.
   * @return {Promise<Boolean>}
   * @example const data = await db.deleteAll();
   */
    deleteAll(ops?: {
        sleep?: number;
    }): Promise<boolean>;
    /**
   * Import's the specific data from another database into replit database!
   * @param {Array} data Data
   * @param {object} [ops={}] Import options
   * @param {number} [ops.sleep=3500] Alter the time to sleep for if the response code is 429.
   * @return {Promise<Boolean>}
   * @example const data = QuickDB.all();
   * db.import(data);
   */
    import(data?: any[], ops?: {
        sleep?: number;
    }): Promise<boolean>;
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
    exportToQuickDB(quickdb: any, ops?: {
        raw?: boolean;
        sleep?: number;
        limit?: number;
    }): Promise<any[]>;
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
    exportToQuickMongo(quickmongo: any, ops?: {
        raw?: boolean;
        sleep?: number;
        limit?: number;
    }): Promise<any[]>;
    /**
   * Write latency
   * @ignore
   * @private
   * @return {Promise<number>}
   */
    private _write;
    /**
   * Read latency
   * @ignore
   * @private
   * @return {Promise<number>}
   */
    private _read;
    /**
   * Delete latency
   * @ignore
   * @private
   * @return {Promise<number>}
   */
    private _delete;
    /**
   * Handles 429
   * @ignore
   * @private
   * @return {Promise<boolean>}
   */
    private _handle429;
    /**
   * Fetches the overall ping of quick.replit database in MS!
   * @param {object} [ops={}] Ping options
   * @example const ping = await db.ping();
   * @return {Promise<Object>}
   * console.log("Average: ", ping.average);
   */
    ping(ops?: object): Promise<any>;
    /**
   * Returns database connection uptime!
   * @return {Promise<Number>}
   * @example console.log(`Database is up for ${db.uptime} ms.`);
   */
    uptime(): Promise<number>;
}
