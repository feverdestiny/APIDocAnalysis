const klawSync = require("klaw-sync");
const fs = require("fs");
var os = require("os");
class apiDb {
    constructor(path) {
        this.addPath = path;
        this.includes = [
            ".*\\.(clj|cls|coffee|cpp|cs|dart|erl|exs?|go|groovy|ino?|java|js|jsx|litcoffee|lua|p|php?|pl|pm|py|rb|scala|ts|vue)$"
        ];
    }

    parseFile(filename) {
        const self = this;
        self.filename = filename;
        console.log(filename);
        const fileContent = fs.readFileSync(filename, {
            encoding: "utf-8"
        });
        return fileContent;
    }
    findElements(block, filename) {
        var elements = [];

        // Replace Linebreak with Unicode
        block = block.replace(/\n/g, "\uffff");

        // Elements start with @
        var elementsRegExp = /(@(\w*)\s?(.+?)(?=\uffff[\s\*]*@|$))/gm;
        var matches = elementsRegExp.exec(block);
        while (matches) {
            var element = {
                source: matches[1],
                name: matches[2].toLowerCase(),
                sourceName: matches[2],
                content: matches[3]
            };

            // reverse Unicode Linebreaks
            element.content = element.content.replace(/\uffff/g, "\n");
            element.source = element.source.replace(/\uffff/g, "\n");

            elements.push(element);

            // next Match
            matches = elementsRegExp.exec(block);
        }
        return elements;
    }
    _findBlocks(src) {
        const blocks = [];
        const docBlocksRegExp = /\/\*\*\uffff?(.+?)\uffff?(?:\s*)?\*\//g;
        const inlineRegExp = /^(\s*)?(\*)[ ]?/gm;
        src = src.replace(/\n/g, "\uffff");
        let matches = docBlocksRegExp.exec(src);
        while (matches) {
            var block = matches[2] || matches[1];

            // Reverse Unicode Linebreaks
            block = block.replace(/\uffff/g, "\n");

            block = block.replace(inlineRegExp, "");
            blocks.push(block);

            // Find next
            matches = docBlocksRegExp.exec(src);
        }
        return blocks;
    }
    parseFiles() {
        let filterData = [];
        let files = klawSync(this.addPath).map(item => item.path);
        files = this.includeFilters(files);
        for (let i = 0; i < files.length; i += 1) {
            let newparseFile = this.parseFile(files[i]);
            newparseFile = newparseFile.replace(/\r\n/g, "\n");
            const blocks = this._findBlocks(newparseFile);
            const elements = blocks.map(item => {
                const el = this.findElements(item);
                return el;
            });
            const indexApiBlocks = this._findBlockWithApiGetIndex(elements);

            filterData = [...filterData, ...this.setData(elements)];
        }
        return filterData;
    }
    includeFilters(files) {
        const self = this;
        const regExpIncludeFilters = [];
        let filters = self.includes;
        if (typeof filters === "string") {
            filters = [filters];
        }
        filters.forEach(function(filter) {
            console.log(filter.length);
            if (filter.length > 0) {
                regExpIncludeFilters.push(new RegExp(filter));
            }
        });

        var length = regExpIncludeFilters.length;
        files = files.filter(function(filename) {
            // not include Directories like 'dirname.js/'
            if (fs.statSync(filename).isDirectory()) {
                return 0;
            }

            if (os.platform() === "win32") {
                filename = filename.replace(/\\/g, "/");
            }

            // apply every filter
            for (var i = 0; i < length; i += 1) {
                if (regExpIncludeFilters[i].test(filename)) {
                    return 1;
                }
            }

            return 0;
        });
        return files;
    }
    setData(elements) {
        let elData = elements;
        elData = elData.filter(item => item.length > 0);
        let parnes = elData.map(parse => {
            const obj = {};
            parse.forEach(element => {
                if (obj[element.name]) {
                    if (Array.isArray(obj[element.name])) {
                        //
                        obj[element.name].push(element.content);
                    } else {
                        let newObj = [];
                        newObj.push(obj[element.name]);
                        newObj.push(element.content);
                        obj[element.name] = newObj;
                    }
                } else {
                    obj[element.name] = element.content;
                }
            });
            return obj;
        });
        return parnes;
    }
    _findBlockWithApiGetIndex(blocks) {
        var foundIndexes = [];
        for (var i = 0; i < blocks.length; i += 1) {
            var found = false;
            for (var j = 0; j < blocks[i].length; j += 1) {
                // check apiIgnore
                if (blocks[i][j].name.substr(0, 9) === "apiignore") {
                    found = false;
                    break;
                }

                if (blocks[i][j].name.substr(0, 3) === "api") found = true;
            }
            if (found) {
                foundIndexes.push(i);
            }
        }
        return foundIndexes;
    }

    filterTableData(data, list) {
        const defalutApiList = [
            "apidefine",
            "apideprecated",
            "apidescription",
            "apierror_example",
            "apierror",
            "apiexample",
            "apigroup",
            "apiheader_example",
            "apiheader",
            "apiname",
            "apiparam_example",
            "apiparam",
            "apipermission",
            "apisample_request",
            "apisuccess_example",
            "apisuccess",
            "apiuse",
            "apiversion",
            "api"
        ];
        let reqApiList = {};
        defalutApiList.forEach(item => {
            reqApiList[item] = require(`./parsers/${item}`);
        });
        try {
            const newData = data.map(item => {
                const obj = {};
                defalutApiList.forEach(item2 => {
                    if (item[item2]) {
                        if (Array.isArray(item[item2])) {
                            obj[item2] = [];
                            item[item2].forEach((item3, index3) => {
                                obj[item2].push(
                                    reqApiList[item2].parse(item[item2][index3])
                                );
                            });
                        } else {
                            obj[item2] = reqApiList[item2].parse(item[item2]);
                        }
                    }
                });
                return obj;
            });
            return newData;
        } catch (e) {
            throw e;
        }
    }
    init() {
        const data = this.filterTableData(this.parseFiles());
        return data;
    }
}

module.exports = apiDb;
