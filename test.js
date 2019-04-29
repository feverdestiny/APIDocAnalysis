const path = require("path");
const addPath = path.resolve(__dirname, "./APITest");

const api = require("./index");
const data = new api(addPath).init();
console.log(data);
