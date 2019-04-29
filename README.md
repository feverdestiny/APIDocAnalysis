参考 apidoc，解析文件中接口信息

> 文件类型支持 clj|cls|coffee|cpp|cs|dart|erl|exs?|go|groovy|ino?|java|js|jsx|litcoffee|lua|p|php?|pl|pm|py|rb|scala|ts|vue

> 格式参考 http://apidocjs.com/

## 使用

```javascript
const path = require("path");
const addPath = path.resolve(__dirname, "./APITest");

const api = require("./index");
const data = new api(addPath).init();
console.log(data);
```
