<h1 align="center">Quick.Replit</h1>
<p>
  <a href="https://discord.gg/pndumb6J3t" target="_blank">
    <img alt="Discord" src="https://img.shields.io/badge/Chat-Click%20here-7289d9?style=for-the-badge&logo=discord">
  </a>
  <a href="https://www.npmjs.com/package/quick.replit" target="_blank">
    <img alt="Version" src="https://img.shields.io/npm/v/quick.replit.svg?style=for-the-badge">
  </a>
  <a href="https://quickreplit.js.org" target="_blank">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg?style=for-the-badge" />
  </a>
  <a href="https://github.com/Lebyy/quick.replit/graphs/commit-activity" target="_blank">
    <img alt="Maintenance" src="https://img.shields.io/badge/Maintained%3F-yes-green.svg?style=for-the-badge" />
  </a>
  <a href="https://github.com/Lebyy/quick.replit/blob/master/LICENSE" target="_blank">
    <img alt="License: AGPL--3.0" src="https://img.shields.io/github/license/Lebyy/quick.replit?style=for-the-badge" />
  </a>
</p>

## What is Quick.Replit?
> A quick and easy wraper to interact with the replit database!

### 📚 [Documentation](https://quickreplit.js.org)

## Install

```sh
npm install quick.replit
```

## Usage

```js
const { Database } = require("quick.replit");
const db = new Database(process.env.REPLIT_DB_URL)

//Set
await db.set("foo", "bar")
.then(() => console.log("ID 'foo' is saved with the value 'bar'!"));

//Get
await db.get("foo").then(data => {
  console.log(data) // Logs 'bar'
});

//Delete
await db.delete("foo")
.then(() => console.log("ID 'foo' is deleted from the database!"));

//All
await db.all().then(data => {
  console.log(data) // Logs all of the data with their key's in array form
});

//Add
await db.add("foo", 1)
.then(() => console.log("Added +1 to ID 'foo'!"));
});

//Subtract
await db.subtract("foo", 1)
.then(() => console.log("Subtracted 1 from ID 'foo'!"));
});

//Push
await db.set("foo", ["bar"]) // -> ["bar"]
await db.push("foo", "foo") // -> ["bar", "foo"]

//Pull
await db.pull("foo", "bar") // -> ["foo"]

//startsWith
await db.startsWith("money", { sort: ".data" }).then(data => {
  console.log(data) // Logs all of the data present which starts with the ID 'money' in array form!
});

//Math
await db.math("coins", "-", 30).then(() => console.log("Subtracted 30 coins!")); // operand: /, +, *, -, "add", "plus", "subtract", "minus", "mul", "multiply", "div", "divide"

//Ping
await db.ping() // Returns a object which contains the write, read, delete and average latencies!

//Has
await db.has("foo").then(data => console.log(data)) // -> true || false

// Even more methods and events are listed in our documentation! Make sure to check them out at https://quickreplit.js.org
```

## Author

👤 **Lebyy**

* Github: [@Lebyy](https://github.com/Lebyy)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/Lebyy/quick.replit/issues). You can also take a look at the [contributing guide](https://github.com/Lebyy/quick.replit/blob/master/CONTRIBUTING.md).

## Show your support

Give a ⭐️ if this project helped you!

<a href="https://www.patreon.com/Lebyy">
  <img src="https://c5.patreon.com/external/logo/become_a_patron_button@2x.png" width="160">
</a>

## 📝 License

Copyright © 2021 [Lebyy](https://github.com/Lebyy).<br />
This project is [AGPL--3.0](https://github.com/Lebyy/quick.replit/blob/master/LICENSE) licensed.

***
