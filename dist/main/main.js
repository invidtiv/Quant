"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/fast-xml-parser/src/util.js
var require_util = __commonJS({
  "node_modules/fast-xml-parser/src/util.js"(exports2) {
    "use strict";
    var nameStartChar = ":A-Za-z_\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD";
    var nameChar = nameStartChar + "\\-.\\d\\u00B7\\u0300-\\u036F\\u203F-\\u2040";
    var nameRegexp = "[" + nameStartChar + "][" + nameChar + "]*";
    var regexName = new RegExp("^" + nameRegexp + "$");
    var getAllMatches = function(string, regex) {
      const matches = [];
      let match = regex.exec(string);
      while (match) {
        const allmatches = [];
        allmatches.startIndex = regex.lastIndex - match[0].length;
        const len = match.length;
        for (let index = 0; index < len; index++) {
          allmatches.push(match[index]);
        }
        matches.push(allmatches);
        match = regex.exec(string);
      }
      return matches;
    };
    var isName = function(string) {
      const match = regexName.exec(string);
      return !(match === null || typeof match === "undefined");
    };
    exports2.isExist = function(v) {
      return typeof v !== "undefined";
    };
    exports2.isEmptyObject = function(obj) {
      return Object.keys(obj).length === 0;
    };
    exports2.merge = function(target, a, arrayMode) {
      if (a) {
        const keys = Object.keys(a);
        const len = keys.length;
        for (let i = 0; i < len; i++) {
          if (arrayMode === "strict") {
            target[keys[i]] = [a[keys[i]]];
          } else {
            target[keys[i]] = a[keys[i]];
          }
        }
      }
    };
    exports2.getValue = function(v) {
      if (exports2.isExist(v)) {
        return v;
      } else {
        return "";
      }
    };
    var DANGEROUS_PROPERTY_NAMES = [
      // '__proto__',
      // 'constructor',
      // 'prototype',
      "hasOwnProperty",
      "toString",
      "valueOf",
      "__defineGetter__",
      "__defineSetter__",
      "__lookupGetter__",
      "__lookupSetter__"
    ];
    var criticalProperties = ["__proto__", "constructor", "prototype"];
    exports2.isName = isName;
    exports2.getAllMatches = getAllMatches;
    exports2.nameRegexp = nameRegexp;
    exports2.DANGEROUS_PROPERTY_NAMES = DANGEROUS_PROPERTY_NAMES;
    exports2.criticalProperties = criticalProperties;
  }
});

// node_modules/fast-xml-parser/src/validator.js
var require_validator = __commonJS({
  "node_modules/fast-xml-parser/src/validator.js"(exports2) {
    "use strict";
    var util = require_util();
    var defaultOptions = {
      allowBooleanAttributes: false,
      //A tag can have attributes without any value
      unpairedTags: []
    };
    exports2.validate = function(xmlData, options) {
      options = Object.assign({}, defaultOptions, options);
      const tags = [];
      let tagFound = false;
      let reachedRoot = false;
      if (xmlData[0] === "\uFEFF") {
        xmlData = xmlData.substr(1);
      }
      for (let i = 0; i < xmlData.length; i++) {
        if (xmlData[i] === "<" && xmlData[i + 1] === "?") {
          i += 2;
          i = readPI(xmlData, i);
          if (i.err) return i;
        } else if (xmlData[i] === "<") {
          let tagStartPos = i;
          i++;
          if (xmlData[i] === "!") {
            i = readCommentAndCDATA(xmlData, i);
            continue;
          } else {
            let closingTag = false;
            if (xmlData[i] === "/") {
              closingTag = true;
              i++;
            }
            let tagName = "";
            for (; i < xmlData.length && xmlData[i] !== ">" && xmlData[i] !== " " && xmlData[i] !== "	" && xmlData[i] !== "\n" && xmlData[i] !== "\r"; i++) {
              tagName += xmlData[i];
            }
            tagName = tagName.trim();
            if (tagName[tagName.length - 1] === "/") {
              tagName = tagName.substring(0, tagName.length - 1);
              i--;
            }
            if (!validateTagName(tagName)) {
              let msg;
              if (tagName.trim().length === 0) {
                msg = "Invalid space after '<'.";
              } else {
                msg = "Tag '" + tagName + "' is an invalid name.";
              }
              return getErrorObject("InvalidTag", msg, getLineNumberForPosition(xmlData, i));
            }
            const result = readAttributeStr(xmlData, i);
            if (result === false) {
              return getErrorObject("InvalidAttr", "Attributes for '" + tagName + "' have open quote.", getLineNumberForPosition(xmlData, i));
            }
            let attrStr = result.value;
            i = result.index;
            if (attrStr[attrStr.length - 1] === "/") {
              const attrStrStart = i - attrStr.length;
              attrStr = attrStr.substring(0, attrStr.length - 1);
              const isValid = validateAttributeString(attrStr, options);
              if (isValid === true) {
                tagFound = true;
              } else {
                return getErrorObject(isValid.err.code, isValid.err.msg, getLineNumberForPosition(xmlData, attrStrStart + isValid.err.line));
              }
            } else if (closingTag) {
              if (!result.tagClosed) {
                return getErrorObject("InvalidTag", "Closing tag '" + tagName + "' doesn't have proper closing.", getLineNumberForPosition(xmlData, i));
              } else if (attrStr.trim().length > 0) {
                return getErrorObject("InvalidTag", "Closing tag '" + tagName + "' can't have attributes or invalid starting.", getLineNumberForPosition(xmlData, tagStartPos));
              } else if (tags.length === 0) {
                return getErrorObject("InvalidTag", "Closing tag '" + tagName + "' has not been opened.", getLineNumberForPosition(xmlData, tagStartPos));
              } else {
                const otg = tags.pop();
                if (tagName !== otg.tagName) {
                  let openPos = getLineNumberForPosition(xmlData, otg.tagStartPos);
                  return getErrorObject(
                    "InvalidTag",
                    "Expected closing tag '" + otg.tagName + "' (opened in line " + openPos.line + ", col " + openPos.col + ") instead of closing tag '" + tagName + "'.",
                    getLineNumberForPosition(xmlData, tagStartPos)
                  );
                }
                if (tags.length == 0) {
                  reachedRoot = true;
                }
              }
            } else {
              const isValid = validateAttributeString(attrStr, options);
              if (isValid !== true) {
                return getErrorObject(isValid.err.code, isValid.err.msg, getLineNumberForPosition(xmlData, i - attrStr.length + isValid.err.line));
              }
              if (reachedRoot === true) {
                return getErrorObject("InvalidXml", "Multiple possible root nodes found.", getLineNumberForPosition(xmlData, i));
              } else if (options.unpairedTags.indexOf(tagName) !== -1) {
              } else {
                tags.push({ tagName, tagStartPos });
              }
              tagFound = true;
            }
            for (i++; i < xmlData.length; i++) {
              if (xmlData[i] === "<") {
                if (xmlData[i + 1] === "!") {
                  i++;
                  i = readCommentAndCDATA(xmlData, i);
                  continue;
                } else if (xmlData[i + 1] === "?") {
                  i = readPI(xmlData, ++i);
                  if (i.err) return i;
                } else {
                  break;
                }
              } else if (xmlData[i] === "&") {
                const afterAmp = validateAmpersand(xmlData, i);
                if (afterAmp == -1)
                  return getErrorObject("InvalidChar", "char '&' is not expected.", getLineNumberForPosition(xmlData, i));
                i = afterAmp;
              } else {
                if (reachedRoot === true && !isWhiteSpace(xmlData[i])) {
                  return getErrorObject("InvalidXml", "Extra text at the end", getLineNumberForPosition(xmlData, i));
                }
              }
            }
            if (xmlData[i] === "<") {
              i--;
            }
          }
        } else {
          if (isWhiteSpace(xmlData[i])) {
            continue;
          }
          return getErrorObject("InvalidChar", "char '" + xmlData[i] + "' is not expected.", getLineNumberForPosition(xmlData, i));
        }
      }
      if (!tagFound) {
        return getErrorObject("InvalidXml", "Start tag expected.", 1);
      } else if (tags.length == 1) {
        return getErrorObject("InvalidTag", "Unclosed tag '" + tags[0].tagName + "'.", getLineNumberForPosition(xmlData, tags[0].tagStartPos));
      } else if (tags.length > 0) {
        return getErrorObject("InvalidXml", "Invalid '" + JSON.stringify(tags.map((t) => t.tagName), null, 4).replace(/\r?\n/g, "") + "' found.", { line: 1, col: 1 });
      }
      return true;
    };
    function isWhiteSpace(char) {
      return char === " " || char === "	" || char === "\n" || char === "\r";
    }
    function readPI(xmlData, i) {
      const start = i;
      for (; i < xmlData.length; i++) {
        if (xmlData[i] == "?" || xmlData[i] == " ") {
          const tagname = xmlData.substr(start, i - start);
          if (i > 5 && tagname === "xml") {
            return getErrorObject("InvalidXml", "XML declaration allowed only at the start of the document.", getLineNumberForPosition(xmlData, i));
          } else if (xmlData[i] == "?" && xmlData[i + 1] == ">") {
            i++;
            break;
          } else {
            continue;
          }
        }
      }
      return i;
    }
    function readCommentAndCDATA(xmlData, i) {
      if (xmlData.length > i + 5 && xmlData[i + 1] === "-" && xmlData[i + 2] === "-") {
        for (i += 3; i < xmlData.length; i++) {
          if (xmlData[i] === "-" && xmlData[i + 1] === "-" && xmlData[i + 2] === ">") {
            i += 2;
            break;
          }
        }
      } else if (xmlData.length > i + 8 && xmlData[i + 1] === "D" && xmlData[i + 2] === "O" && xmlData[i + 3] === "C" && xmlData[i + 4] === "T" && xmlData[i + 5] === "Y" && xmlData[i + 6] === "P" && xmlData[i + 7] === "E") {
        let angleBracketsCount = 1;
        for (i += 8; i < xmlData.length; i++) {
          if (xmlData[i] === "<") {
            angleBracketsCount++;
          } else if (xmlData[i] === ">") {
            angleBracketsCount--;
            if (angleBracketsCount === 0) {
              break;
            }
          }
        }
      } else if (xmlData.length > i + 9 && xmlData[i + 1] === "[" && xmlData[i + 2] === "C" && xmlData[i + 3] === "D" && xmlData[i + 4] === "A" && xmlData[i + 5] === "T" && xmlData[i + 6] === "A" && xmlData[i + 7] === "[") {
        for (i += 8; i < xmlData.length; i++) {
          if (xmlData[i] === "]" && xmlData[i + 1] === "]" && xmlData[i + 2] === ">") {
            i += 2;
            break;
          }
        }
      }
      return i;
    }
    var doubleQuote = '"';
    var singleQuote = "'";
    function readAttributeStr(xmlData, i) {
      let attrStr = "";
      let startChar = "";
      let tagClosed = false;
      for (; i < xmlData.length; i++) {
        if (xmlData[i] === doubleQuote || xmlData[i] === singleQuote) {
          if (startChar === "") {
            startChar = xmlData[i];
          } else if (startChar !== xmlData[i]) {
          } else {
            startChar = "";
          }
        } else if (xmlData[i] === ">") {
          if (startChar === "") {
            tagClosed = true;
            break;
          }
        }
        attrStr += xmlData[i];
      }
      if (startChar !== "") {
        return false;
      }
      return {
        value: attrStr,
        index: i,
        tagClosed
      };
    }
    var validAttrStrRegxp = new RegExp(`(\\s*)([^\\s=]+)(\\s*=)?(\\s*(['"])(([\\s\\S])*?)\\5)?`, "g");
    function validateAttributeString(attrStr, options) {
      const matches = util.getAllMatches(attrStr, validAttrStrRegxp);
      const attrNames = {};
      for (let i = 0; i < matches.length; i++) {
        if (matches[i][1].length === 0) {
          return getErrorObject("InvalidAttr", "Attribute '" + matches[i][2] + "' has no space in starting.", getPositionFromMatch(matches[i]));
        } else if (matches[i][3] !== void 0 && matches[i][4] === void 0) {
          return getErrorObject("InvalidAttr", "Attribute '" + matches[i][2] + "' is without value.", getPositionFromMatch(matches[i]));
        } else if (matches[i][3] === void 0 && !options.allowBooleanAttributes) {
          return getErrorObject("InvalidAttr", "boolean attribute '" + matches[i][2] + "' is not allowed.", getPositionFromMatch(matches[i]));
        }
        const attrName = matches[i][2];
        if (!validateAttrName(attrName)) {
          return getErrorObject("InvalidAttr", "Attribute '" + attrName + "' is an invalid name.", getPositionFromMatch(matches[i]));
        }
        if (!attrNames.hasOwnProperty(attrName)) {
          attrNames[attrName] = 1;
        } else {
          return getErrorObject("InvalidAttr", "Attribute '" + attrName + "' is repeated.", getPositionFromMatch(matches[i]));
        }
      }
      return true;
    }
    function validateNumberAmpersand(xmlData, i) {
      let re = /\d/;
      if (xmlData[i] === "x") {
        i++;
        re = /[\da-fA-F]/;
      }
      for (; i < xmlData.length; i++) {
        if (xmlData[i] === ";")
          return i;
        if (!xmlData[i].match(re))
          break;
      }
      return -1;
    }
    function validateAmpersand(xmlData, i) {
      i++;
      if (xmlData[i] === ";")
        return -1;
      if (xmlData[i] === "#") {
        i++;
        return validateNumberAmpersand(xmlData, i);
      }
      let count = 0;
      for (; i < xmlData.length; i++, count++) {
        if (xmlData[i].match(/\w/) && count < 20)
          continue;
        if (xmlData[i] === ";")
          break;
        return -1;
      }
      return i;
    }
    function getErrorObject(code, message, lineNumber) {
      return {
        err: {
          code,
          msg: message,
          line: lineNumber.line || lineNumber,
          col: lineNumber.col
        }
      };
    }
    function validateAttrName(attrName) {
      return util.isName(attrName);
    }
    function validateTagName(tagname) {
      return util.isName(tagname);
    }
    function getLineNumberForPosition(xmlData, index) {
      const lines = xmlData.substring(0, index).split(/\r?\n/);
      return {
        line: lines.length,
        // column number is last line's length + 1, because column numbering starts at 1:
        col: lines[lines.length - 1].length + 1
      };
    }
    function getPositionFromMatch(match) {
      return match.startIndex + match[1].length;
    }
  }
});

// node_modules/fast-xml-parser/src/xmlparser/OptionsBuilder.js
var require_OptionsBuilder = __commonJS({
  "node_modules/fast-xml-parser/src/xmlparser/OptionsBuilder.js"(exports2) {
    var { DANGEROUS_PROPERTY_NAMES, criticalProperties } = require_util();
    var defaultOnDangerousProperty = (name) => {
      if (DANGEROUS_PROPERTY_NAMES.includes(name)) {
        return "__" + name;
      }
      return name;
    };
    var defaultOptions = {
      preserveOrder: false,
      attributeNamePrefix: "@_",
      attributesGroupName: false,
      textNodeName: "#text",
      ignoreAttributes: true,
      removeNSPrefix: false,
      // remove NS from tag name or attribute name if true
      allowBooleanAttributes: false,
      //a tag can have attributes without any value
      //ignoreRootElement : false,
      parseTagValue: true,
      parseAttributeValue: false,
      trimValues: true,
      //Trim string values of tag and attributes
      cdataPropName: false,
      numberParseOptions: {
        hex: true,
        leadingZeros: true,
        eNotation: true
      },
      tagValueProcessor: function(tagName, val) {
        return val;
      },
      attributeValueProcessor: function(attrName, val) {
        return val;
      },
      stopNodes: [],
      //nested tags will not be parsed even for errors
      alwaysCreateTextNode: false,
      isArray: () => false,
      commentPropName: false,
      unpairedTags: [],
      processEntities: true,
      htmlEntities: false,
      ignoreDeclaration: false,
      ignorePiTags: false,
      transformTagName: false,
      transformAttributeName: false,
      updateTag: function(tagName, jPath, attrs) {
        return tagName;
      },
      // skipEmptyListItem: false
      captureMetaData: false,
      maxNestedTags: 100,
      strictReservedNames: true,
      onDangerousProperty: defaultOnDangerousProperty
    };
    function validatePropertyName(propertyName, optionName) {
      if (typeof propertyName !== "string") {
        return;
      }
      const normalized = propertyName.toLowerCase();
      if (DANGEROUS_PROPERTY_NAMES.some((dangerous) => normalized === dangerous.toLowerCase())) {
        throw new Error(
          `[SECURITY] Invalid ${optionName}: "${propertyName}" is a reserved JavaScript keyword that could cause prototype pollution`
        );
      }
      if (criticalProperties.some((dangerous) => normalized === dangerous.toLowerCase())) {
        throw new Error(
          `[SECURITY] Invalid ${optionName}: "${propertyName}" is a reserved JavaScript keyword that could cause prototype pollution`
        );
      }
    }
    function normalizeProcessEntities(value) {
      if (typeof value === "boolean") {
        return {
          enabled: value,
          // true or false
          maxEntitySize: 1e4,
          maxExpansionDepth: 10,
          maxTotalExpansions: 1e3,
          maxExpandedLength: 1e5,
          allowedTags: null,
          tagFilter: null
        };
      }
      if (typeof value === "object" && value !== null) {
        return {
          enabled: value.enabled !== false,
          maxEntitySize: Math.max(1, value.maxEntitySize ?? 1e4),
          maxExpansionDepth: Math.max(1, value.maxExpansionDepth ?? 1e4),
          maxTotalExpansions: Math.max(1, value.maxTotalExpansions ?? Infinity),
          maxExpandedLength: Math.max(1, value.maxExpandedLength ?? 1e5),
          maxEntityCount: Math.max(1, value.maxEntityCount ?? 1e3),
          allowedTags: value.allowedTags ?? null,
          tagFilter: value.tagFilter ?? null
        };
      }
      return normalizeProcessEntities(true);
    }
    var buildOptions = function(options) {
      const built = Object.assign({}, defaultOptions, options);
      const propertyNameOptions = [
        { value: built.attributeNamePrefix, name: "attributeNamePrefix" },
        { value: built.attributesGroupName, name: "attributesGroupName" },
        { value: built.textNodeName, name: "textNodeName" },
        { value: built.cdataPropName, name: "cdataPropName" },
        { value: built.commentPropName, name: "commentPropName" }
      ];
      for (const { value, name } of propertyNameOptions) {
        if (value) {
          validatePropertyName(value, name);
        }
      }
      if (built.onDangerousProperty === null) {
        built.onDangerousProperty = defaultOnDangerousProperty;
      }
      built.processEntities = normalizeProcessEntities(built.processEntities);
      return built;
    };
    exports2.buildOptions = buildOptions;
    exports2.defaultOptions = defaultOptions;
  }
});

// node_modules/fast-xml-parser/src/xmlparser/xmlNode.js
var require_xmlNode = __commonJS({
  "node_modules/fast-xml-parser/src/xmlparser/xmlNode.js"(exports2, module2) {
    "use strict";
    var XmlNode = class {
      constructor(tagname) {
        this.tagname = tagname;
        this.child = [];
        this[":@"] = {};
      }
      add(key, val) {
        if (key === "__proto__") key = "#__proto__";
        this.child.push({ [key]: val });
      }
      addChild(node) {
        if (node.tagname === "__proto__") node.tagname = "#__proto__";
        if (node[":@"] && Object.keys(node[":@"]).length > 0) {
          this.child.push({ [node.tagname]: node.child, [":@"]: node[":@"] });
        } else {
          this.child.push({ [node.tagname]: node.child });
        }
      }
    };
    module2.exports = XmlNode;
  }
});

// node_modules/fast-xml-parser/src/xmlparser/DocTypeReader.js
var require_DocTypeReader = __commonJS({
  "node_modules/fast-xml-parser/src/xmlparser/DocTypeReader.js"(exports2, module2) {
    var util = require_util();
    var DocTypeReader = class {
      constructor(options) {
        this.suppressValidationErr = !options;
        this.options = options || {};
      }
      readDocType(xmlData, i) {
        const entities = /* @__PURE__ */ Object.create(null);
        let entityCount = 0;
        if (xmlData[i + 3] === "O" && xmlData[i + 4] === "C" && xmlData[i + 5] === "T" && xmlData[i + 6] === "Y" && xmlData[i + 7] === "P" && xmlData[i + 8] === "E") {
          i = i + 9;
          let angleBracketsCount = 1;
          let hasBody = false, comment = false;
          let exp = "";
          for (; i < xmlData.length; i++) {
            if (xmlData[i] === "<" && !comment) {
              if (hasBody && hasSeq(xmlData, "!ENTITY", i)) {
                i += 7;
                let entityName, val;
                [entityName, val, i] = this.readEntityExp(xmlData, i + 1, this.suppressValidationErr);
                if (val.indexOf("&") === -1) {
                  if (this.options.enabled !== false && this.options.maxEntityCount != null && entityCount >= this.options.maxEntityCount) {
                    throw new Error(
                      `Entity count (${entityCount + 1}) exceeds maximum allowed (${this.options.maxEntityCount})`
                    );
                  }
                  const escaped = entityName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
                  entities[entityName] = {
                    regx: RegExp(`&${escaped};`, "g"),
                    val
                  };
                  entityCount++;
                }
              } else if (hasBody && hasSeq(xmlData, "!ELEMENT", i)) {
                i += 8;
                const { index } = this.readElementExp(xmlData, i + 1);
                i = index;
              } else if (hasBody && hasSeq(xmlData, "!ATTLIST", i)) {
                i += 8;
              } else if (hasBody && hasSeq(xmlData, "!NOTATION", i)) {
                i += 9;
                const { index } = this.readNotationExp(xmlData, i + 1, this.suppressValidationErr);
                i = index;
              } else if (hasSeq(xmlData, "!--", i)) {
                comment = true;
              } else {
                throw new Error(`Invalid DOCTYPE`);
              }
              angleBracketsCount++;
              exp = "";
            } else if (xmlData[i] === ">") {
              if (comment) {
                if (xmlData[i - 1] === "-" && xmlData[i - 2] === "-") {
                  comment = false;
                  angleBracketsCount--;
                }
              } else {
                angleBracketsCount--;
              }
              if (angleBracketsCount === 0) {
                break;
              }
            } else if (xmlData[i] === "[") {
              hasBody = true;
            } else {
              exp += xmlData[i];
            }
          }
          if (angleBracketsCount !== 0) {
            throw new Error(`Unclosed DOCTYPE`);
          }
        } else {
          throw new Error(`Invalid Tag instead of DOCTYPE`);
        }
        return { entities, i };
      }
      readEntityExp(xmlData, i) {
        i = skipWhitespace(xmlData, i);
        let entityName = "";
        while (i < xmlData.length && !/\s/.test(xmlData[i]) && xmlData[i] !== '"' && xmlData[i] !== "'") {
          entityName += xmlData[i];
          i++;
        }
        validateEntityName(entityName);
        i = skipWhitespace(xmlData, i);
        if (!this.suppressValidationErr) {
          if (xmlData.substring(i, i + 6).toUpperCase() === "SYSTEM") {
            throw new Error("External entities are not supported");
          } else if (xmlData[i] === "%") {
            throw new Error("Parameter entities are not supported");
          }
        }
        let entityValue = "";
        [i, entityValue] = this.readIdentifierVal(xmlData, i, "entity");
        if (this.options.enabled !== false && this.options.maxEntitySize != null && entityValue.length > this.options.maxEntitySize) {
          throw new Error(
            `Entity "${entityName}" size (${entityValue.length}) exceeds maximum allowed size (${this.options.maxEntitySize})`
          );
        }
        i--;
        return [entityName, entityValue, i];
      }
      readNotationExp(xmlData, i) {
        i = skipWhitespace(xmlData, i);
        let notationName = "";
        while (i < xmlData.length && !/\s/.test(xmlData[i])) {
          notationName += xmlData[i];
          i++;
        }
        !this.suppressValidationErr && validateEntityName(notationName);
        i = skipWhitespace(xmlData, i);
        const identifierType = xmlData.substring(i, i + 6).toUpperCase();
        if (!this.suppressValidationErr && identifierType !== "SYSTEM" && identifierType !== "PUBLIC") {
          throw new Error(`Expected SYSTEM or PUBLIC, found "${identifierType}"`);
        }
        i += identifierType.length;
        i = skipWhitespace(xmlData, i);
        let publicIdentifier = null;
        let systemIdentifier = null;
        if (identifierType === "PUBLIC") {
          [i, publicIdentifier] = this.readIdentifierVal(xmlData, i, "publicIdentifier");
          i = skipWhitespace(xmlData, i);
          if (xmlData[i] === '"' || xmlData[i] === "'") {
            [i, systemIdentifier] = this.readIdentifierVal(xmlData, i, "systemIdentifier");
          }
        } else if (identifierType === "SYSTEM") {
          [i, systemIdentifier] = this.readIdentifierVal(xmlData, i, "systemIdentifier");
          if (!this.suppressValidationErr && !systemIdentifier) {
            throw new Error("Missing mandatory system identifier for SYSTEM notation");
          }
        }
        return { notationName, publicIdentifier, systemIdentifier, index: --i };
      }
      readIdentifierVal(xmlData, i, type) {
        let identifierVal = "";
        const startChar = xmlData[i];
        if (startChar !== '"' && startChar !== "'") {
          throw new Error(`Expected quoted string, found "${startChar}"`);
        }
        i++;
        while (i < xmlData.length && xmlData[i] !== startChar) {
          identifierVal += xmlData[i];
          i++;
        }
        if (xmlData[i] !== startChar) {
          throw new Error(`Unterminated ${type} value`);
        }
        i++;
        return [i, identifierVal];
      }
      readElementExp(xmlData, i) {
        i = skipWhitespace(xmlData, i);
        let elementName = "";
        while (i < xmlData.length && !/\s/.test(xmlData[i])) {
          elementName += xmlData[i];
          i++;
        }
        if (!this.suppressValidationErr && !util.isName(elementName)) {
          throw new Error(`Invalid element name: "${elementName}"`);
        }
        i = skipWhitespace(xmlData, i);
        let contentModel = "";
        if (xmlData[i] === "E" && hasSeq(xmlData, "MPTY", i)) {
          i += 4;
        } else if (xmlData[i] === "A" && hasSeq(xmlData, "NY", i)) {
          i += 2;
        } else if (xmlData[i] === "(") {
          i++;
          while (i < xmlData.length && xmlData[i] !== ")") {
            contentModel += xmlData[i];
            i++;
          }
          if (xmlData[i] !== ")") {
            throw new Error("Unterminated content model");
          }
        } else if (!this.suppressValidationErr) {
          throw new Error(`Invalid Element Expression, found "${xmlData[i]}"`);
        }
        return {
          elementName,
          contentModel: contentModel.trim(),
          index: i
        };
      }
      readAttlistExp(xmlData, i) {
        i = skipWhitespace(xmlData, i);
        let elementName = "";
        while (i < xmlData.length && !/\s/.test(xmlData[i])) {
          elementName += xmlData[i];
          i++;
        }
        validateEntityName(elementName);
        i = skipWhitespace(xmlData, i);
        let attributeName = "";
        while (i < xmlData.length && !/\s/.test(xmlData[i])) {
          attributeName += xmlData[i];
          i++;
        }
        if (!validateEntityName(attributeName)) {
          throw new Error(`Invalid attribute name: "${attributeName}"`);
        }
        i = skipWhitespace(xmlData, i);
        let attributeType = "";
        if (xmlData.substring(i, i + 8).toUpperCase() === "NOTATION") {
          attributeType = "NOTATION";
          i += 8;
          i = skipWhitespace(xmlData, i);
          if (xmlData[i] !== "(") {
            throw new Error(`Expected '(', found "${xmlData[i]}"`);
          }
          i++;
          let allowedNotations = [];
          while (i < xmlData.length && xmlData[i] !== ")") {
            let notation = "";
            while (i < xmlData.length && xmlData[i] !== "|" && xmlData[i] !== ")") {
              notation += xmlData[i];
              i++;
            }
            notation = notation.trim();
            if (!validateEntityName(notation)) {
              throw new Error(`Invalid notation name: "${notation}"`);
            }
            allowedNotations.push(notation);
            if (xmlData[i] === "|") {
              i++;
              i = skipWhitespace(xmlData, i);
            }
          }
          if (xmlData[i] !== ")") {
            throw new Error("Unterminated list of notations");
          }
          i++;
          attributeType += " (" + allowedNotations.join("|") + ")";
        } else {
          while (i < xmlData.length && !/\s/.test(xmlData[i])) {
            attributeType += xmlData[i];
            i++;
          }
          const validTypes = ["CDATA", "ID", "IDREF", "IDREFS", "ENTITY", "ENTITIES", "NMTOKEN", "NMTOKENS"];
          if (!this.suppressValidationErr && !validTypes.includes(attributeType.toUpperCase())) {
            throw new Error(`Invalid attribute type: "${attributeType}"`);
          }
        }
        i = skipWhitespace(xmlData, i);
        let defaultValue = "";
        if (xmlData.substring(i, i + 8).toUpperCase() === "#REQUIRED") {
          defaultValue = "#REQUIRED";
          i += 8;
        } else if (xmlData.substring(i, i + 7).toUpperCase() === "#IMPLIED") {
          defaultValue = "#IMPLIED";
          i += 7;
        } else {
          [i, defaultValue] = this.readIdentifierVal(xmlData, i, "ATTLIST");
        }
        return {
          elementName,
          attributeName,
          attributeType,
          defaultValue,
          index: i
        };
      }
    };
    var skipWhitespace = (data, index) => {
      while (index < data.length && /\s/.test(data[index])) {
        index++;
      }
      return index;
    };
    function hasSeq(data, seq, i) {
      for (let j = 0; j < seq.length; j++) {
        if (seq[j] !== data[i + j + 1]) return false;
      }
      return true;
    }
    function validateEntityName(name) {
      if (util.isName(name))
        return name;
      else
        throw new Error(`Invalid entity name ${name}`);
    }
    module2.exports = DocTypeReader;
  }
});

// node_modules/strnum/strnum.js
var require_strnum = __commonJS({
  "node_modules/strnum/strnum.js"(exports2, module2) {
    var hexRegex = /^[-+]?0x[a-fA-F0-9]+$/;
    var numRegex = /^([\-\+])?(0*)([0-9]*(\.[0-9]*)?)$/;
    var consider = {
      hex: true,
      // oct: false,
      leadingZeros: true,
      decimalPoint: ".",
      eNotation: true
      //skipLike: /regex/
    };
    function toNumber(str, options = {}) {
      options = Object.assign({}, consider, options);
      if (!str || typeof str !== "string") return str;
      let trimmedStr = str.trim();
      if (options.skipLike !== void 0 && options.skipLike.test(trimmedStr)) return str;
      else if (str === "0") return 0;
      else if (options.hex && hexRegex.test(trimmedStr)) {
        return parse_int(trimmedStr, 16);
      } else if (trimmedStr.search(/[eE]/) !== -1) {
        const notation = trimmedStr.match(/^([-\+])?(0*)([0-9]*(\.[0-9]*)?[eE][-\+]?[0-9]+)$/);
        if (notation) {
          if (options.leadingZeros) {
            trimmedStr = (notation[1] || "") + notation[3];
          } else {
            if (notation[2] === "0" && notation[3][0] === ".") {
            } else {
              return str;
            }
          }
          return options.eNotation ? Number(trimmedStr) : str;
        } else {
          return str;
        }
      } else {
        const match = numRegex.exec(trimmedStr);
        if (match) {
          const sign = match[1];
          const leadingZeros = match[2];
          let numTrimmedByZeros = trimZeros(match[3]);
          if (!options.leadingZeros && leadingZeros.length > 0 && sign && trimmedStr[2] !== ".") return str;
          else if (!options.leadingZeros && leadingZeros.length > 0 && !sign && trimmedStr[1] !== ".") return str;
          else if (options.leadingZeros && leadingZeros === str) return 0;
          else {
            const num = Number(trimmedStr);
            const numStr = "" + num;
            if (numStr.search(/[eE]/) !== -1) {
              if (options.eNotation) return num;
              else return str;
            } else if (trimmedStr.indexOf(".") !== -1) {
              if (numStr === "0" && numTrimmedByZeros === "") return num;
              else if (numStr === numTrimmedByZeros) return num;
              else if (sign && numStr === "-" + numTrimmedByZeros) return num;
              else return str;
            }
            if (leadingZeros) {
              return numTrimmedByZeros === numStr || sign + numTrimmedByZeros === numStr ? num : str;
            } else {
              return trimmedStr === numStr || trimmedStr === sign + numStr ? num : str;
            }
          }
        } else {
          return str;
        }
      }
    }
    function trimZeros(numStr) {
      if (numStr && numStr.indexOf(".") !== -1) {
        numStr = numStr.replace(/0+$/, "");
        if (numStr === ".") numStr = "0";
        else if (numStr[0] === ".") numStr = "0" + numStr;
        else if (numStr[numStr.length - 1] === ".") numStr = numStr.substr(0, numStr.length - 1);
        return numStr;
      }
      return numStr;
    }
    function parse_int(numStr, base) {
      if (parseInt) return parseInt(numStr, base);
      else if (Number.parseInt) return Number.parseInt(numStr, base);
      else if (window && window.parseInt) return window.parseInt(numStr, base);
      else throw new Error("parseInt, Number.parseInt, window.parseInt are not supported");
    }
    module2.exports = toNumber;
  }
});

// node_modules/fast-xml-parser/src/ignoreAttributes.js
var require_ignoreAttributes = __commonJS({
  "node_modules/fast-xml-parser/src/ignoreAttributes.js"(exports2, module2) {
    function getIgnoreAttributesFn(ignoreAttributes) {
      if (typeof ignoreAttributes === "function") {
        return ignoreAttributes;
      }
      if (Array.isArray(ignoreAttributes)) {
        return (attrName) => {
          for (const pattern of ignoreAttributes) {
            if (typeof pattern === "string" && attrName === pattern) {
              return true;
            }
            if (pattern instanceof RegExp && pattern.test(attrName)) {
              return true;
            }
          }
        };
      }
      return () => false;
    }
    module2.exports = getIgnoreAttributesFn;
  }
});

// node_modules/fast-xml-parser/src/xmlparser/OrderedObjParser.js
var require_OrderedObjParser = __commonJS({
  "node_modules/fast-xml-parser/src/xmlparser/OrderedObjParser.js"(exports2, module2) {
    "use strict";
    var util = require_util();
    var xmlNode = require_xmlNode();
    var DocTypeReader = require_DocTypeReader();
    var toNumber = require_strnum();
    var getIgnoreAttributesFn = require_ignoreAttributes();
    var OrderedObjParser = class {
      constructor(options) {
        this.options = options;
        this.currentNode = null;
        this.tagsNodeStack = [];
        this.docTypeEntities = {};
        this.lastEntities = {
          "apos": { regex: /&(apos|#39|#x27);/g, val: "'" },
          "gt": { regex: /&(gt|#62|#x3E);/g, val: ">" },
          "lt": { regex: /&(lt|#60|#x3C);/g, val: "<" },
          "quot": { regex: /&(quot|#34|#x22);/g, val: '"' }
        };
        this.ampEntity = { regex: /&(amp|#38|#x26);/g, val: "&" };
        this.htmlEntities = {
          "space": { regex: /&(nbsp|#160);/g, val: " " },
          // "lt" : { regex: /&(lt|#60);/g, val: "<" },
          // "gt" : { regex: /&(gt|#62);/g, val: ">" },
          // "amp" : { regex: /&(amp|#38);/g, val: "&" },
          // "quot" : { regex: /&(quot|#34);/g, val: "\"" },
          // "apos" : { regex: /&(apos|#39);/g, val: "'" },
          "cent": { regex: /&(cent|#162);/g, val: "\xA2" },
          "pound": { regex: /&(pound|#163);/g, val: "\xA3" },
          "yen": { regex: /&(yen|#165);/g, val: "\xA5" },
          "euro": { regex: /&(euro|#8364);/g, val: "\u20AC" },
          "copyright": { regex: /&(copy|#169);/g, val: "\xA9" },
          "reg": { regex: /&(reg|#174);/g, val: "\xAE" },
          "inr": { regex: /&(inr|#8377);/g, val: "\u20B9" },
          "num_dec": { regex: /&#([0-9]{1,7});/g, val: (_, str) => fromCodePoint(str, 10, "&#") },
          "num_hex": { regex: /&#x([0-9a-fA-F]{1,6});/g, val: (_, str) => fromCodePoint(str, 16, "&#x") }
        };
        this.addExternalEntities = addExternalEntities;
        this.parseXml = parseXml;
        this.parseTextData = parseTextData;
        this.resolveNameSpace = resolveNameSpace;
        this.buildAttributesMap = buildAttributesMap;
        this.isItStopNode = isItStopNode;
        this.replaceEntitiesValue = replaceEntitiesValue;
        this.readStopNodeData = readStopNodeData;
        this.saveTextToParentTag = saveTextToParentTag;
        this.addChild = addChild;
        this.ignoreAttributesFn = getIgnoreAttributesFn(this.options.ignoreAttributes);
        this.entityExpansionCount = 0;
        this.currentExpandedLength = 0;
        if (this.options.stopNodes && this.options.stopNodes.length > 0) {
          this.stopNodesExact = /* @__PURE__ */ new Set();
          this.stopNodesWildcard = /* @__PURE__ */ new Set();
          for (let i = 0; i < this.options.stopNodes.length; i++) {
            const stopNodeExp = this.options.stopNodes[i];
            if (typeof stopNodeExp !== "string") continue;
            if (stopNodeExp.startsWith("*.")) {
              this.stopNodesWildcard.add(stopNodeExp.substring(2));
            } else {
              this.stopNodesExact.add(stopNodeExp);
            }
          }
        }
      }
    };
    function addExternalEntities(externalEntities) {
      const entKeys = Object.keys(externalEntities);
      for (let i = 0; i < entKeys.length; i++) {
        const ent = entKeys[i];
        const escaped = ent.replace(/[.\-+*:]/g, "\\.");
        this.lastEntities[ent] = {
          regex: new RegExp("&" + escaped + ";", "g"),
          val: externalEntities[ent]
        };
      }
    }
    function parseTextData(val, tagName, jPath, dontTrim, hasAttributes, isLeafNode, escapeEntities) {
      if (val !== void 0) {
        if (this.options.trimValues && !dontTrim) {
          val = val.trim();
        }
        if (val.length > 0) {
          if (!escapeEntities) val = this.replaceEntitiesValue(val, tagName, jPath);
          const newval = this.options.tagValueProcessor(tagName, val, jPath, hasAttributes, isLeafNode);
          if (newval === null || newval === void 0) {
            return val;
          } else if (typeof newval !== typeof val || newval !== val) {
            return newval;
          } else if (this.options.trimValues) {
            return parseValue(val, this.options.parseTagValue, this.options.numberParseOptions);
          } else {
            const trimmedVal = val.trim();
            if (trimmedVal === val) {
              return parseValue(val, this.options.parseTagValue, this.options.numberParseOptions);
            } else {
              return val;
            }
          }
        }
      }
    }
    function resolveNameSpace(tagname) {
      if (this.options.removeNSPrefix) {
        const tags = tagname.split(":");
        const prefix = tagname.charAt(0) === "/" ? "/" : "";
        if (tags[0] === "xmlns") {
          return "";
        }
        if (tags.length === 2) {
          tagname = prefix + tags[1];
        }
      }
      return tagname;
    }
    var attrsRegx = new RegExp(`([^\\s=]+)\\s*(=\\s*(['"])([\\s\\S]*?)\\3)?`, "gm");
    function buildAttributesMap(attrStr, jPath, tagName) {
      if (this.options.ignoreAttributes !== true && typeof attrStr === "string") {
        const matches = util.getAllMatches(attrStr, attrsRegx);
        const len = matches.length;
        const attrs = {};
        for (let i = 0; i < len; i++) {
          const attrName = this.resolveNameSpace(matches[i][1]);
          if (this.ignoreAttributesFn(attrName, jPath)) {
            continue;
          }
          let oldVal = matches[i][4];
          let aName = this.options.attributeNamePrefix + attrName;
          if (attrName.length) {
            if (this.options.transformAttributeName) {
              aName = this.options.transformAttributeName(aName);
            }
            aName = sanitizeName(aName, this.options);
            if (oldVal !== void 0) {
              if (this.options.trimValues) {
                oldVal = oldVal.trim();
              }
              oldVal = this.replaceEntitiesValue(oldVal, tagName, jPath);
              const newVal = this.options.attributeValueProcessor(attrName, oldVal, jPath);
              if (newVal === null || newVal === void 0) {
                attrs[aName] = oldVal;
              } else if (typeof newVal !== typeof oldVal || newVal !== oldVal) {
                attrs[aName] = newVal;
              } else {
                attrs[aName] = parseValue(
                  oldVal,
                  this.options.parseAttributeValue,
                  this.options.numberParseOptions
                );
              }
            } else if (this.options.allowBooleanAttributes) {
              attrs[aName] = true;
            }
          }
        }
        if (!Object.keys(attrs).length) {
          return;
        }
        if (this.options.attributesGroupName) {
          const attrCollection = {};
          attrCollection[this.options.attributesGroupName] = attrs;
          return attrCollection;
        }
        return attrs;
      }
    }
    var parseXml = function(xmlData) {
      xmlData = xmlData.replace(/\r\n?/g, "\n");
      const xmlObj = new xmlNode("!xml");
      let currentNode = xmlObj;
      let textData = "";
      let jPath = "";
      this.entityExpansionCount = 0;
      this.currentExpandedLength = 0;
      const docTypeReader = new DocTypeReader(this.options.processEntities);
      for (let i = 0; i < xmlData.length; i++) {
        const ch = xmlData[i];
        if (ch === "<") {
          if (xmlData[i + 1] === "/") {
            const closeIndex = findClosingIndex(xmlData, ">", i, "Closing Tag is not closed.");
            let tagName = xmlData.substring(i + 2, closeIndex).trim();
            if (this.options.removeNSPrefix) {
              const colonIndex = tagName.indexOf(":");
              if (colonIndex !== -1) {
                tagName = tagName.substr(colonIndex + 1);
              }
            }
            if (this.options.transformTagName) {
              tagName = this.options.transformTagName(tagName);
            }
            if (currentNode) {
              textData = this.saveTextToParentTag(textData, currentNode, jPath);
            }
            const lastTagName = jPath.substring(jPath.lastIndexOf(".") + 1);
            if (tagName && this.options.unpairedTags.indexOf(tagName) !== -1) {
              throw new Error(`Unpaired tag can not be used as closing tag: </${tagName}>`);
            }
            let propIndex = 0;
            if (lastTagName && this.options.unpairedTags.indexOf(lastTagName) !== -1) {
              propIndex = jPath.lastIndexOf(".", jPath.lastIndexOf(".") - 1);
              this.tagsNodeStack.pop();
            } else {
              propIndex = jPath.lastIndexOf(".");
            }
            jPath = jPath.substring(0, propIndex);
            currentNode = this.tagsNodeStack.pop();
            textData = "";
            i = closeIndex;
          } else if (xmlData[i + 1] === "?") {
            let tagData = readTagExp(xmlData, i, false, "?>");
            if (!tagData) throw new Error("Pi Tag is not closed.");
            textData = this.saveTextToParentTag(textData, currentNode, jPath);
            if (this.options.ignoreDeclaration && tagData.tagName === "?xml" || this.options.ignorePiTags) {
            } else {
              const childNode = new xmlNode(tagData.tagName);
              childNode.add(this.options.textNodeName, "");
              if (tagData.tagName !== tagData.tagExp && tagData.attrExpPresent) {
                childNode[":@"] = this.buildAttributesMap(tagData.tagExp, jPath, tagData.tagName);
              }
              this.addChild(currentNode, childNode, jPath, i);
            }
            i = tagData.closeIndex + 1;
          } else if (xmlData.substr(i + 1, 3) === "!--") {
            const endIndex = findClosingIndex(xmlData, "-->", i + 4, "Comment is not closed.");
            if (this.options.commentPropName) {
              const comment = xmlData.substring(i + 4, endIndex - 2);
              textData = this.saveTextToParentTag(textData, currentNode, jPath);
              currentNode.add(this.options.commentPropName, [{ [this.options.textNodeName]: comment }]);
            }
            i = endIndex;
          } else if (xmlData.substr(i + 1, 2) === "!D") {
            const result = docTypeReader.readDocType(xmlData, i);
            this.docTypeEntities = result.entities;
            i = result.i;
          } else if (xmlData.substr(i + 1, 2) === "![") {
            const closeIndex = findClosingIndex(xmlData, "]]>", i, "CDATA is not closed.") - 2;
            const tagExp = xmlData.substring(i + 9, closeIndex);
            textData = this.saveTextToParentTag(textData, currentNode, jPath);
            let val = this.parseTextData(tagExp, currentNode.tagname, jPath, true, false, true, true);
            if (val == void 0) val = "";
            if (this.options.cdataPropName) {
              currentNode.add(this.options.cdataPropName, [{ [this.options.textNodeName]: tagExp }]);
            } else {
              currentNode.add(this.options.textNodeName, val);
            }
            i = closeIndex + 2;
          } else {
            let result = readTagExp(xmlData, i, this.options.removeNSPrefix);
            let tagName = result.tagName;
            const rawTagName = result.rawTagName;
            let tagExp = result.tagExp;
            let attrExpPresent = result.attrExpPresent;
            let closeIndex = result.closeIndex;
            if (this.options.transformTagName) {
              const newTagName = this.options.transformTagName(tagName);
              if (tagExp === tagName) {
                tagExp = newTagName;
              }
              tagName = newTagName;
            }
            if (this.options.strictReservedNames && (tagName === this.options.commentPropName || tagName === this.options.cdataPropName || tagName === this.options.textNodeName || tagName === this.options.attributesGroupName)) {
              throw new Error(`Invalid tag name: ${tagName}`);
            }
            if (currentNode && textData) {
              if (currentNode.tagname !== "!xml") {
                textData = this.saveTextToParentTag(textData, currentNode, jPath, false);
              }
            }
            const lastTag = currentNode;
            if (lastTag && this.options.unpairedTags.indexOf(lastTag.tagname) !== -1) {
              currentNode = this.tagsNodeStack.pop();
              jPath = jPath.substring(0, jPath.lastIndexOf("."));
            }
            if (tagName !== xmlObj.tagname) {
              jPath += jPath ? "." + tagName : tagName;
            }
            const startIndex = i;
            if (this.isItStopNode(this.stopNodesExact, this.stopNodesWildcard, jPath, tagName)) {
              let tagContent = "";
              if (tagExp.length > 0 && tagExp.lastIndexOf("/") === tagExp.length - 1) {
                if (tagName[tagName.length - 1] === "/") {
                  tagName = tagName.substr(0, tagName.length - 1);
                  jPath = jPath.substr(0, jPath.length - 1);
                  tagExp = tagName;
                } else {
                  tagExp = tagExp.substr(0, tagExp.length - 1);
                }
                i = result.closeIndex;
              } else if (this.options.unpairedTags.indexOf(tagName) !== -1) {
                i = result.closeIndex;
              } else {
                const result2 = this.readStopNodeData(xmlData, rawTagName, closeIndex + 1);
                if (!result2) throw new Error(`Unexpected end of ${rawTagName}`);
                i = result2.i;
                tagContent = result2.tagContent;
              }
              const childNode = new xmlNode(tagName);
              if (tagName !== tagExp && attrExpPresent) {
                childNode[":@"] = this.buildAttributesMap(tagExp, jPath, tagName);
              }
              if (tagContent) {
                tagContent = this.parseTextData(tagContent, tagName, jPath, true, attrExpPresent, true, true);
              }
              jPath = jPath.substr(0, jPath.lastIndexOf("."));
              childNode.add(this.options.textNodeName, tagContent);
              this.addChild(currentNode, childNode, jPath, startIndex);
            } else {
              if (tagExp.length > 0 && tagExp.lastIndexOf("/") === tagExp.length - 1) {
                if (tagName[tagName.length - 1] === "/") {
                  tagName = tagName.substr(0, tagName.length - 1);
                  jPath = jPath.substr(0, jPath.length - 1);
                  tagExp = tagName;
                } else {
                  tagExp = tagExp.substr(0, tagExp.length - 1);
                }
                if (this.options.transformTagName) {
                  const newTagName = this.options.transformTagName(tagName);
                  if (tagExp === tagName) {
                    tagExp = newTagName;
                  }
                  tagName = newTagName;
                }
                const childNode = new xmlNode(tagName);
                if (tagName !== tagExp && attrExpPresent) {
                  childNode[":@"] = this.buildAttributesMap(tagExp, jPath, tagName);
                }
                this.addChild(currentNode, childNode, jPath, startIndex);
                jPath = jPath.substr(0, jPath.lastIndexOf("."));
              } else if (this.options.unpairedTags.indexOf(tagName) !== -1) {
                const childNode = new xmlNode(tagName);
                if (tagName !== tagExp && attrExpPresent) {
                  childNode[":@"] = this.buildAttributesMap(tagExp, jPath);
                }
                this.addChild(currentNode, childNode, jPath, startIndex);
                jPath = jPath.substr(0, jPath.lastIndexOf("."));
                i = result.closeIndex;
                continue;
              } else {
                const childNode = new xmlNode(tagName);
                if (this.tagsNodeStack.length > this.options.maxNestedTags) {
                  throw new Error("Maximum nested tags exceeded");
                }
                this.tagsNodeStack.push(currentNode);
                if (tagName !== tagExp && attrExpPresent) {
                  childNode[":@"] = this.buildAttributesMap(tagExp, jPath, tagName);
                }
                this.addChild(currentNode, childNode, jPath);
                currentNode = childNode;
              }
              textData = "";
              i = closeIndex;
            }
          }
        } else {
          textData += xmlData[i];
        }
      }
      return xmlObj.child;
    };
    function addChild(currentNode, childNode, jPath, startIndex) {
      if (!this.options.captureMetaData) startIndex = void 0;
      const result = this.options.updateTag(childNode.tagname, jPath, childNode[":@"]);
      if (result === false) {
      } else if (typeof result === "string") {
        childNode.tagname = result;
        currentNode.addChild(childNode, startIndex);
      } else {
        currentNode.addChild(childNode, startIndex);
      }
    }
    var replaceEntitiesValue = function(val, tagName, jPath) {
      if (val.indexOf("&") === -1) {
        return val;
      }
      const entityConfig = this.options.processEntities;
      if (!entityConfig.enabled) {
        return val;
      }
      if (entityConfig.allowedTags) {
        if (!entityConfig.allowedTags.includes(tagName)) {
          return val;
        }
      }
      if (entityConfig.tagFilter) {
        if (!entityConfig.tagFilter(tagName, jPath)) {
          return val;
        }
      }
      for (let entityName in this.docTypeEntities) {
        const entity = this.docTypeEntities[entityName];
        const matches = val.match(entity.regx);
        if (matches) {
          this.entityExpansionCount += matches.length;
          if (entityConfig.maxTotalExpansions && this.entityExpansionCount > entityConfig.maxTotalExpansions) {
            throw new Error(
              `Entity expansion limit exceeded: ${this.entityExpansionCount} > ${entityConfig.maxTotalExpansions}`
            );
          }
          const lengthBefore = val.length;
          val = val.replace(entity.regx, entity.val);
          if (entityConfig.maxExpandedLength) {
            this.currentExpandedLength += val.length - lengthBefore;
            if (this.currentExpandedLength > entityConfig.maxExpandedLength) {
              throw new Error(
                `Total expanded content size exceeded: ${this.currentExpandedLength} > ${entityConfig.maxExpandedLength}`
              );
            }
          }
        }
      }
      if (val.indexOf("&") === -1) return val;
      for (const entityName of Object.keys(this.lastEntities)) {
        const entity = this.lastEntities[entityName];
        const matches = val.match(entity.regex);
        if (matches) {
          this.entityExpansionCount += matches.length;
          if (entityConfig.maxTotalExpansions && this.entityExpansionCount > entityConfig.maxTotalExpansions) {
            throw new Error(
              `Entity expansion limit exceeded: ${this.entityExpansionCount} > ${entityConfig.maxTotalExpansions}`
            );
          }
        }
        val = val.replace(entity.regex, entity.val);
      }
      if (val.indexOf("&") === -1) return val;
      if (this.options.htmlEntities) {
        for (const entityName of Object.keys(this.htmlEntities)) {
          const entity = this.htmlEntities[entityName];
          const matches = val.match(entity.regex);
          if (matches) {
            this.entityExpansionCount += matches.length;
            if (entityConfig.maxTotalExpansions && this.entityExpansionCount > entityConfig.maxTotalExpansions) {
              throw new Error(
                `Entity expansion limit exceeded: ${this.entityExpansionCount} > ${entityConfig.maxTotalExpansions}`
              );
            }
          }
          val = val.replace(entity.regex, entity.val);
        }
      }
      val = val.replace(this.ampEntity.regex, this.ampEntity.val);
      return val;
    };
    function saveTextToParentTag(textData, parentNode, jPath, isLeafNode) {
      if (textData) {
        if (isLeafNode === void 0) isLeafNode = parentNode.child.length === 0;
        textData = this.parseTextData(
          textData,
          parentNode.tagname,
          jPath,
          false,
          parentNode[":@"] ? Object.keys(parentNode[":@"]).length !== 0 : false,
          isLeafNode
        );
        if (textData !== void 0 && textData !== "")
          parentNode.add(this.options.textNodeName, textData);
        textData = "";
      }
      return textData;
    }
    function isItStopNode(stopNodesExact, stopNodesWildcard, jPath, currentTagName) {
      if (stopNodesWildcard && stopNodesWildcard.has(currentTagName)) return true;
      if (stopNodesExact && stopNodesExact.has(jPath)) return true;
      return false;
    }
    function tagExpWithClosingIndex(xmlData, i, closingChar = ">") {
      let attrBoundary;
      let tagExp = "";
      for (let index = i; index < xmlData.length; index++) {
        let ch = xmlData[index];
        if (attrBoundary) {
          if (ch === attrBoundary) attrBoundary = "";
        } else if (ch === '"' || ch === "'") {
          attrBoundary = ch;
        } else if (ch === closingChar[0]) {
          if (closingChar[1]) {
            if (xmlData[index + 1] === closingChar[1]) {
              return {
                data: tagExp,
                index
              };
            }
          } else {
            return {
              data: tagExp,
              index
            };
          }
        } else if (ch === "	") {
          ch = " ";
        }
        tagExp += ch;
      }
    }
    function findClosingIndex(xmlData, str, i, errMsg) {
      const closingIndex = xmlData.indexOf(str, i);
      if (closingIndex === -1) {
        throw new Error(errMsg);
      } else {
        return closingIndex + str.length - 1;
      }
    }
    function readTagExp(xmlData, i, removeNSPrefix, closingChar = ">") {
      const result = tagExpWithClosingIndex(xmlData, i + 1, closingChar);
      if (!result) return;
      let tagExp = result.data;
      const closeIndex = result.index;
      const separatorIndex = tagExp.search(/\s/);
      let tagName = tagExp;
      let attrExpPresent = true;
      if (separatorIndex !== -1) {
        tagName = tagExp.substring(0, separatorIndex);
        tagExp = tagExp.substring(separatorIndex + 1).trimStart();
      }
      const rawTagName = tagName;
      if (removeNSPrefix) {
        const colonIndex = tagName.indexOf(":");
        if (colonIndex !== -1) {
          tagName = tagName.substr(colonIndex + 1);
          attrExpPresent = tagName !== result.data.substr(colonIndex + 1);
        }
      }
      return {
        tagName,
        tagExp,
        closeIndex,
        attrExpPresent,
        rawTagName
      };
    }
    function readStopNodeData(xmlData, tagName, i) {
      const startIndex = i;
      let openTagCount = 1;
      for (; i < xmlData.length; i++) {
        if (xmlData[i] === "<") {
          if (xmlData[i + 1] === "/") {
            const closeIndex = findClosingIndex(xmlData, ">", i, `${tagName} is not closed`);
            let closeTagName = xmlData.substring(i + 2, closeIndex).trim();
            if (closeTagName === tagName) {
              openTagCount--;
              if (openTagCount === 0) {
                return {
                  tagContent: xmlData.substring(startIndex, i),
                  i: closeIndex
                };
              }
            }
            i = closeIndex;
          } else if (xmlData[i + 1] === "?") {
            const closeIndex = findClosingIndex(xmlData, "?>", i + 1, "StopNode is not closed.");
            i = closeIndex;
          } else if (xmlData.substr(i + 1, 3) === "!--") {
            const closeIndex = findClosingIndex(xmlData, "-->", i + 3, "StopNode is not closed.");
            i = closeIndex;
          } else if (xmlData.substr(i + 1, 2) === "![") {
            const closeIndex = findClosingIndex(xmlData, "]]>", i, "StopNode is not closed.") - 2;
            i = closeIndex;
          } else {
            const tagData = readTagExp(xmlData, i, ">");
            if (tagData) {
              const openTagName = tagData && tagData.tagName;
              if (openTagName === tagName && tagData.tagExp[tagData.tagExp.length - 1] !== "/") {
                openTagCount++;
              }
              i = tagData.closeIndex;
            }
          }
        }
      }
    }
    function parseValue(val, shouldParse, options) {
      if (shouldParse && typeof val === "string") {
        const newval = val.trim();
        if (newval === "true") return true;
        else if (newval === "false") return false;
        else return toNumber(val, options);
      } else {
        if (util.isExist(val)) {
          return val;
        } else {
          return "";
        }
      }
    }
    function fromCodePoint(str, base, prefix) {
      const codePoint = Number.parseInt(str, base);
      if (codePoint >= 0 && codePoint <= 1114111) {
        return String.fromCodePoint(codePoint);
      } else {
        return prefix + str + ";";
      }
    }
    function sanitizeName(name, options) {
      if (util.criticalProperties.includes(name)) {
        throw new Error(`[SECURITY] Invalid name: "${name}" is a reserved JavaScript keyword that could cause prototype pollution`);
      } else if (util.DANGEROUS_PROPERTY_NAMES.includes(name)) {
        return options.onDangerousProperty(name);
      }
      return name;
    }
    module2.exports = OrderedObjParser;
  }
});

// node_modules/fast-xml-parser/src/xmlparser/node2json.js
var require_node2json = __commonJS({
  "node_modules/fast-xml-parser/src/xmlparser/node2json.js"(exports2) {
    "use strict";
    function prettify(node, options) {
      return compress(node, options);
    }
    function compress(arr, options, jPath) {
      let text;
      const compressedObj = {};
      for (let i = 0; i < arr.length; i++) {
        const tagObj = arr[i];
        const property = propName(tagObj);
        let newJpath = "";
        if (jPath === void 0) newJpath = property;
        else newJpath = jPath + "." + property;
        if (property === options.textNodeName) {
          if (text === void 0) text = tagObj[property];
          else text += "" + tagObj[property];
        } else if (property === void 0) {
          continue;
        } else if (tagObj[property]) {
          let val = compress(tagObj[property], options, newJpath);
          const isLeaf = isLeafTag(val, options);
          if (tagObj[":@"]) {
            assignAttributes(val, tagObj[":@"], newJpath, options);
          } else if (Object.keys(val).length === 1 && val[options.textNodeName] !== void 0 && !options.alwaysCreateTextNode) {
            val = val[options.textNodeName];
          } else if (Object.keys(val).length === 0) {
            if (options.alwaysCreateTextNode) val[options.textNodeName] = "";
            else val = "";
          }
          if (compressedObj[property] !== void 0 && compressedObj.hasOwnProperty(property)) {
            if (!Array.isArray(compressedObj[property])) {
              compressedObj[property] = [compressedObj[property]];
            }
            compressedObj[property].push(val);
          } else {
            if (options.isArray(property, newJpath, isLeaf)) {
              compressedObj[property] = [val];
            } else {
              compressedObj[property] = val;
            }
          }
        }
      }
      if (typeof text === "string") {
        if (text.length > 0) compressedObj[options.textNodeName] = text;
      } else if (text !== void 0) compressedObj[options.textNodeName] = text;
      return compressedObj;
    }
    function propName(obj) {
      const keys = Object.keys(obj);
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (key !== ":@") return key;
      }
    }
    function assignAttributes(obj, attrMap, jpath, options) {
      if (attrMap) {
        const keys = Object.keys(attrMap);
        const len = keys.length;
        for (let i = 0; i < len; i++) {
          const atrrName = keys[i];
          if (options.isArray(atrrName, jpath + "." + atrrName, true, true)) {
            obj[atrrName] = [attrMap[atrrName]];
          } else {
            obj[atrrName] = attrMap[atrrName];
          }
        }
      }
    }
    function isLeafTag(obj, options) {
      const { textNodeName } = options;
      const propCount = Object.keys(obj).length;
      if (propCount === 0) {
        return true;
      }
      if (propCount === 1 && (obj[textNodeName] || typeof obj[textNodeName] === "boolean" || obj[textNodeName] === 0)) {
        return true;
      }
      return false;
    }
    exports2.prettify = prettify;
  }
});

// node_modules/fast-xml-parser/src/xmlparser/XMLParser.js
var require_XMLParser = __commonJS({
  "node_modules/fast-xml-parser/src/xmlparser/XMLParser.js"(exports2, module2) {
    var { buildOptions } = require_OptionsBuilder();
    var OrderedObjParser = require_OrderedObjParser();
    var { prettify } = require_node2json();
    var validator = require_validator();
    var XMLParser2 = class {
      constructor(options) {
        this.externalEntities = {};
        this.options = buildOptions(options);
      }
      /**
       * Parse XML dats to JS object 
       * @param {string|Buffer} xmlData 
       * @param {boolean|Object} validationOption 
       */
      parse(xmlData, validationOption) {
        if (typeof xmlData === "string") {
        } else if (xmlData.toString) {
          xmlData = xmlData.toString();
        } else {
          throw new Error("XML data is accepted in String or Bytes[] form.");
        }
        if (validationOption) {
          if (validationOption === true) validationOption = {};
          const result = validator.validate(xmlData, validationOption);
          if (result !== true) {
            throw Error(`${result.err.msg}:${result.err.line}:${result.err.col}`);
          }
        }
        const orderedObjParser = new OrderedObjParser(this.options);
        orderedObjParser.addExternalEntities(this.externalEntities);
        const orderedResult = orderedObjParser.parseXml(xmlData);
        if (this.options.preserveOrder || orderedResult === void 0) return orderedResult;
        else return prettify(orderedResult, this.options);
      }
      /**
       * Add Entity which is not by default supported by this library
       * @param {string} key 
       * @param {string} value 
       */
      addEntity(key, value) {
        if (value.indexOf("&") !== -1) {
          throw new Error("Entity value can't have '&'");
        } else if (key.indexOf("&") !== -1 || key.indexOf(";") !== -1) {
          throw new Error("An entity must be set without '&' and ';'. Eg. use '#xD' for '&#xD;'");
        } else if (value === "&") {
          throw new Error("An entity with value '&' is not permitted");
        } else {
          this.externalEntities[key] = value;
        }
      }
    };
    module2.exports = XMLParser2;
  }
});

// node_modules/fast-xml-parser/src/xmlbuilder/orderedJs2Xml.js
var require_orderedJs2Xml = __commonJS({
  "node_modules/fast-xml-parser/src/xmlbuilder/orderedJs2Xml.js"(exports2, module2) {
    var EOL = "\n";
    function toXml(jArray, options) {
      let indentation = "";
      if (options.format && options.indentBy.length > 0) {
        indentation = EOL;
      }
      return arrToStr(jArray, options, "", indentation);
    }
    function arrToStr(arr, options, jPath, indentation) {
      let xmlStr = "";
      let isPreviousElementTag = false;
      if (!Array.isArray(arr)) {
        if (arr !== void 0 && arr !== null) {
          let text = arr.toString();
          text = replaceEntitiesValue(text, options);
          return text;
        }
        return "";
      }
      for (let i = 0; i < arr.length; i++) {
        const tagObj = arr[i];
        const tagName = propName(tagObj);
        if (tagName === void 0) continue;
        let newJPath = "";
        if (jPath.length === 0) newJPath = tagName;
        else newJPath = `${jPath}.${tagName}`;
        if (tagName === options.textNodeName) {
          let tagText = tagObj[tagName];
          if (!isStopNode(newJPath, options)) {
            tagText = options.tagValueProcessor(tagName, tagText);
            tagText = replaceEntitiesValue(tagText, options);
          }
          if (isPreviousElementTag) {
            xmlStr += indentation;
          }
          xmlStr += tagText;
          isPreviousElementTag = false;
          continue;
        } else if (tagName === options.cdataPropName) {
          if (isPreviousElementTag) {
            xmlStr += indentation;
          }
          xmlStr += `<![CDATA[${tagObj[tagName][0][options.textNodeName]}]]>`;
          isPreviousElementTag = false;
          continue;
        } else if (tagName === options.commentPropName) {
          xmlStr += indentation + `<!--${tagObj[tagName][0][options.textNodeName]}-->`;
          isPreviousElementTag = true;
          continue;
        } else if (tagName[0] === "?") {
          const attStr2 = attr_to_str(tagObj[":@"], options);
          const tempInd = tagName === "?xml" ? "" : indentation;
          let piTextNodeName = tagObj[tagName][0][options.textNodeName];
          piTextNodeName = piTextNodeName.length !== 0 ? " " + piTextNodeName : "";
          xmlStr += tempInd + `<${tagName}${piTextNodeName}${attStr2}?>`;
          isPreviousElementTag = true;
          continue;
        }
        let newIdentation = indentation;
        if (newIdentation !== "") {
          newIdentation += options.indentBy;
        }
        const attStr = attr_to_str(tagObj[":@"], options);
        const tagStart = indentation + `<${tagName}${attStr}`;
        const tagValue = arrToStr(tagObj[tagName], options, newJPath, newIdentation);
        if (options.unpairedTags.indexOf(tagName) !== -1) {
          if (options.suppressUnpairedNode) xmlStr += tagStart + ">";
          else xmlStr += tagStart + "/>";
        } else if ((!tagValue || tagValue.length === 0) && options.suppressEmptyNode) {
          xmlStr += tagStart + "/>";
        } else if (tagValue && tagValue.endsWith(">")) {
          xmlStr += tagStart + `>${tagValue}${indentation}</${tagName}>`;
        } else {
          xmlStr += tagStart + ">";
          if (tagValue && indentation !== "" && (tagValue.includes("/>") || tagValue.includes("</"))) {
            xmlStr += indentation + options.indentBy + tagValue + indentation;
          } else {
            xmlStr += tagValue;
          }
          xmlStr += `</${tagName}>`;
        }
        isPreviousElementTag = true;
      }
      return xmlStr;
    }
    function propName(obj) {
      const keys = Object.keys(obj);
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;
        if (key !== ":@") return key;
      }
    }
    function attr_to_str(attrMap, options) {
      let attrStr = "";
      if (attrMap && !options.ignoreAttributes) {
        for (let attr in attrMap) {
          if (!Object.prototype.hasOwnProperty.call(attrMap, attr)) continue;
          let attrVal = options.attributeValueProcessor(attr, attrMap[attr]);
          attrVal = replaceEntitiesValue(attrVal, options);
          if (attrVal === true && options.suppressBooleanAttributes) {
            attrStr += ` ${attr.substr(options.attributeNamePrefix.length)}`;
          } else {
            attrStr += ` ${attr.substr(options.attributeNamePrefix.length)}="${attrVal}"`;
          }
        }
      }
      return attrStr;
    }
    function isStopNode(jPath, options) {
      jPath = jPath.substr(0, jPath.length - options.textNodeName.length - 1);
      let tagName = jPath.substr(jPath.lastIndexOf(".") + 1);
      for (let index in options.stopNodes) {
        if (options.stopNodes[index] === jPath || options.stopNodes[index] === "*." + tagName) return true;
      }
      return false;
    }
    function replaceEntitiesValue(textValue, options) {
      if (textValue && textValue.length > 0 && options.processEntities) {
        for (let i = 0; i < options.entities.length; i++) {
          const entity = options.entities[i];
          textValue = textValue.replace(entity.regex, entity.val);
        }
      }
      return textValue;
    }
    module2.exports = toXml;
  }
});

// node_modules/fast-xml-parser/src/xmlbuilder/json2xml.js
var require_json2xml = __commonJS({
  "node_modules/fast-xml-parser/src/xmlbuilder/json2xml.js"(exports2, module2) {
    "use strict";
    var buildFromOrderedJs = require_orderedJs2Xml();
    var getIgnoreAttributesFn = require_ignoreAttributes();
    var defaultOptions = {
      attributeNamePrefix: "@_",
      attributesGroupName: false,
      textNodeName: "#text",
      ignoreAttributes: true,
      cdataPropName: false,
      format: false,
      indentBy: "  ",
      suppressEmptyNode: false,
      suppressUnpairedNode: true,
      suppressBooleanAttributes: true,
      tagValueProcessor: function(key, a) {
        return a;
      },
      attributeValueProcessor: function(attrName, a) {
        return a;
      },
      preserveOrder: false,
      commentPropName: false,
      unpairedTags: [],
      entities: [
        { regex: new RegExp("&", "g"), val: "&amp;" },
        //it must be on top
        { regex: new RegExp(">", "g"), val: "&gt;" },
        { regex: new RegExp("<", "g"), val: "&lt;" },
        { regex: new RegExp("'", "g"), val: "&apos;" },
        { regex: new RegExp('"', "g"), val: "&quot;" }
      ],
      processEntities: true,
      stopNodes: [],
      // transformTagName: false,
      // transformAttributeName: false,
      oneListGroup: false
    };
    function Builder(options) {
      this.options = Object.assign({}, defaultOptions, options);
      if (this.options.ignoreAttributes === true || this.options.attributesGroupName) {
        this.isAttribute = function() {
          return false;
        };
      } else {
        this.ignoreAttributesFn = getIgnoreAttributesFn(this.options.ignoreAttributes);
        this.attrPrefixLen = this.options.attributeNamePrefix.length;
        this.isAttribute = isAttribute;
      }
      this.processTextOrObjNode = processTextOrObjNode;
      if (this.options.format) {
        this.indentate = indentate;
        this.tagEndChar = ">\n";
        this.newLine = "\n";
      } else {
        this.indentate = function() {
          return "";
        };
        this.tagEndChar = ">";
        this.newLine = "";
      }
    }
    Builder.prototype.build = function(jObj) {
      if (this.options.preserveOrder) {
        return buildFromOrderedJs(jObj, this.options);
      } else {
        if (Array.isArray(jObj) && this.options.arrayNodeName && this.options.arrayNodeName.length > 1) {
          jObj = {
            [this.options.arrayNodeName]: jObj
          };
        }
        return this.j2x(jObj, 0, []).val;
      }
    };
    Builder.prototype.j2x = function(jObj, level, ajPath) {
      let attrStr = "";
      let val = "";
      const jPath = ajPath.join(".");
      for (let key in jObj) {
        if (!Object.prototype.hasOwnProperty.call(jObj, key)) continue;
        if (typeof jObj[key] === "undefined") {
          if (this.isAttribute(key)) {
            val += "";
          }
        } else if (jObj[key] === null) {
          if (this.isAttribute(key)) {
            val += "";
          } else if (key === this.options.cdataPropName) {
            val += "";
          } else if (key[0] === "?") {
            val += this.indentate(level) + "<" + key + "?" + this.tagEndChar;
          } else {
            val += this.indentate(level) + "<" + key + "/" + this.tagEndChar;
          }
        } else if (jObj[key] instanceof Date) {
          val += this.buildTextValNode(jObj[key], key, "", level);
        } else if (typeof jObj[key] !== "object") {
          const attr = this.isAttribute(key);
          if (attr && !this.ignoreAttributesFn(attr, jPath)) {
            attrStr += this.buildAttrPairStr(attr, "" + jObj[key]);
          } else if (!attr) {
            if (key === this.options.textNodeName) {
              let newval = this.options.tagValueProcessor(key, "" + jObj[key]);
              val += this.replaceEntitiesValue(newval);
            } else {
              val += this.buildTextValNode(jObj[key], key, "", level);
            }
          }
        } else if (Array.isArray(jObj[key])) {
          const arrLen = jObj[key].length;
          let listTagVal = "";
          let listTagAttr = "";
          for (let j = 0; j < arrLen; j++) {
            const item = jObj[key][j];
            if (typeof item === "undefined") {
            } else if (item === null) {
              if (key[0] === "?") val += this.indentate(level) + "<" + key + "?" + this.tagEndChar;
              else val += this.indentate(level) + "<" + key + "/" + this.tagEndChar;
            } else if (typeof item === "object") {
              if (this.options.oneListGroup) {
                const result = this.j2x(item, level + 1, ajPath.concat(key));
                listTagVal += result.val;
                if (this.options.attributesGroupName && item.hasOwnProperty(this.options.attributesGroupName)) {
                  listTagAttr += result.attrStr;
                }
              } else {
                listTagVal += this.processTextOrObjNode(item, key, level, ajPath);
              }
            } else {
              if (this.options.oneListGroup) {
                let textValue = this.options.tagValueProcessor(key, item);
                textValue = this.replaceEntitiesValue(textValue);
                listTagVal += textValue;
              } else {
                listTagVal += this.buildTextValNode(item, key, "", level);
              }
            }
          }
          if (this.options.oneListGroup) {
            listTagVal = this.buildObjectNode(listTagVal, key, listTagAttr, level);
          }
          val += listTagVal;
        } else {
          if (this.options.attributesGroupName && key === this.options.attributesGroupName) {
            const Ks = Object.keys(jObj[key]);
            const L = Ks.length;
            for (let j = 0; j < L; j++) {
              attrStr += this.buildAttrPairStr(Ks[j], "" + jObj[key][Ks[j]]);
            }
          } else {
            val += this.processTextOrObjNode(jObj[key], key, level, ajPath);
          }
        }
      }
      return { attrStr, val };
    };
    Builder.prototype.buildAttrPairStr = function(attrName, val) {
      val = this.options.attributeValueProcessor(attrName, "" + val);
      val = this.replaceEntitiesValue(val);
      if (this.options.suppressBooleanAttributes && val === "true") {
        return " " + attrName;
      } else return " " + attrName + '="' + val + '"';
    };
    function processTextOrObjNode(object, key, level, ajPath) {
      const result = this.j2x(object, level + 1, ajPath.concat(key));
      if (object[this.options.textNodeName] !== void 0 && Object.keys(object).length === 1) {
        return this.buildTextValNode(object[this.options.textNodeName], key, result.attrStr, level);
      } else {
        return this.buildObjectNode(result.val, key, result.attrStr, level);
      }
    }
    Builder.prototype.buildObjectNode = function(val, key, attrStr, level) {
      if (val === "") {
        if (key[0] === "?") return this.indentate(level) + "<" + key + attrStr + "?" + this.tagEndChar;
        else {
          return this.indentate(level) + "<" + key + attrStr + this.closeTag(key) + this.tagEndChar;
        }
      } else {
        let tagEndExp = "</" + key + this.tagEndChar;
        let piClosingChar = "";
        if (key[0] === "?") {
          piClosingChar = "?";
          tagEndExp = "";
        }
        if ((attrStr || attrStr === "") && val.indexOf("<") === -1) {
          return this.indentate(level) + "<" + key + attrStr + piClosingChar + ">" + val + tagEndExp;
        } else if (this.options.commentPropName !== false && key === this.options.commentPropName && piClosingChar.length === 0) {
          return this.indentate(level) + `<!--${val}-->` + this.newLine;
        } else {
          return this.indentate(level) + "<" + key + attrStr + piClosingChar + this.tagEndChar + val + this.indentate(level) + tagEndExp;
        }
      }
    };
    Builder.prototype.closeTag = function(key) {
      let closeTag = "";
      if (this.options.unpairedTags.indexOf(key) !== -1) {
        if (!this.options.suppressUnpairedNode) closeTag = "/";
      } else if (this.options.suppressEmptyNode) {
        closeTag = "/";
      } else {
        closeTag = `></${key}`;
      }
      return closeTag;
    };
    Builder.prototype.buildTextValNode = function(val, key, attrStr, level) {
      if (this.options.cdataPropName !== false && key === this.options.cdataPropName) {
        return this.indentate(level) + `<![CDATA[${val}]]>` + this.newLine;
      } else if (this.options.commentPropName !== false && key === this.options.commentPropName) {
        return this.indentate(level) + `<!--${val}-->` + this.newLine;
      } else if (key[0] === "?") {
        return this.indentate(level) + "<" + key + attrStr + "?" + this.tagEndChar;
      } else {
        let textValue = this.options.tagValueProcessor(key, val);
        textValue = this.replaceEntitiesValue(textValue);
        if (textValue === "") {
          return this.indentate(level) + "<" + key + attrStr + this.closeTag(key) + this.tagEndChar;
        } else {
          return this.indentate(level) + "<" + key + attrStr + ">" + textValue + "</" + key + this.tagEndChar;
        }
      }
    };
    Builder.prototype.replaceEntitiesValue = function(textValue) {
      if (textValue && textValue.length > 0 && this.options.processEntities) {
        for (let i = 0; i < this.options.entities.length; i++) {
          const entity = this.options.entities[i];
          textValue = textValue.replace(entity.regex, entity.val);
        }
      }
      return textValue;
    };
    function indentate(level) {
      return this.options.indentBy.repeat(level);
    }
    function isAttribute(name) {
      if (name.startsWith(this.options.attributeNamePrefix) && name !== this.options.textNodeName) {
        return name.substr(this.attrPrefixLen);
      } else {
        return false;
      }
    }
    module2.exports = Builder;
  }
});

// node_modules/fast-xml-parser/src/fxp.js
var require_fxp = __commonJS({
  "node_modules/fast-xml-parser/src/fxp.js"(exports2, module2) {
    "use strict";
    var validator = require_validator();
    var XMLParser2 = require_XMLParser();
    var XMLBuilder = require_json2xml();
    module2.exports = {
      XMLParser: XMLParser2,
      XMLValidator: validator,
      XMLBuilder
    };
  }
});

// src/main/main.ts
var import_electron4 = require("electron");
var import_node_fs5 = __toESM(require("node:fs"));
var import_node_path5 = __toESM(require("node:path"));

// src/shared/ipc.ts
var IPC = {
  watchlistGet: "watchlist:get",
  watchlistAdd: "watchlist:add",
  watchlistRemove: "watchlist:remove",
  symbolsSearch: "symbols:search",
  quotesGet: "quotes:get",
  holdingsGet: "holdings:get",
  newsGet: "news:get",
  earningsGet: "earnings:get",
  chartGet: "chart:get",
  pivotNewsGet: "chart:pivot-news",
  macroOverlayGet: "chart:macro-overlay",
  chartSnapshotCapture: "chart:capture-snapshot",
  quantAnalyze: "quant:analyze",
  quantInsightsGet: "quant:insights-get",
  llmSettingsGet: "llm-settings:get",
  llmSettingsSave: "llm-settings:save",
  valuationGet: "valuation:get",
  openExternal: "shell:open-external"
};

// src/shared/types.ts
var CHART_RANGES = ["1d", "1w", "1m", "6m", "1y", "5y", "max"];

// src/main/services/dataFiles.ts
var import_node_fs = __toESM(require("node:fs"));
var import_node_path = __toESM(require("node:path"));
function readJson(fileName) {
  try {
    const filePath = import_node_path.default.join(__dirname, "data", fileName);
    return JSON.parse(import_node_fs.default.readFileSync(filePath, "utf8"));
  } catch (err) {
    console.error(`[data] failed to read ${fileName}:`, err);
    return null;
  }
}
var etfBundleCache = null;
function getEtfBundle() {
  if (etfBundleCache) return etfBundleCache;
  const raw = readJson("etf-holdings.json");
  const etfs = {};
  if (raw && typeof raw === "object" && raw.etfs && typeof raw.etfs === "object") {
    for (const [symbol, entry] of Object.entries(raw.etfs)) {
      if (!entry || typeof entry.name !== "string" || !Array.isArray(entry.holdings)) continue;
      const holdings = [];
      for (const h of entry.holdings) {
        if (!h || typeof h.symbol !== "string" || typeof h.name !== "string") continue;
        holdings.push({
          symbol: h.symbol.toUpperCase(),
          name: h.name,
          weightPercent: typeof h.weightPercent === "number" ? h.weightPercent : null
        });
      }
      etfs[symbol.toUpperCase()] = { name: entry.name, holdings };
    }
  }
  etfBundleCache = {
    _meta: raw?._meta,
    etfs
  };
  return etfBundleCache;
}
function getBundleAsOf() {
  return getEtfBundle()._meta?.asOf ?? "2026-06";
}
var directoryCache = null;
function getSymbolDirectory() {
  if (directoryCache) return directoryCache;
  const raw = readJson("symbol-directory.json");
  const out = [];
  if (raw && Array.isArray(raw.symbols)) {
    for (const entry of raw.symbols) {
      const e = entry;
      if (typeof e.symbol === "string" && typeof e.name === "string" && (e.type === "etf" || e.type === "stock")) {
        out.push({
          symbol: e.symbol.toUpperCase(),
          name: e.name,
          type: e.type,
          exchange: typeof e.exchange === "string" ? e.exchange : void 0
        });
      }
    }
  }
  directoryCache = out;
  return directoryCache;
}
function directoryLookup(symbol) {
  const sym = symbol.toUpperCase();
  return getSymbolDirectory().find((e) => e.symbol === sym);
}
function lookupName(symbol) {
  const dir = directoryLookup(symbol);
  if (dir) return dir.name;
  const bundle = getEtfBundle();
  const etf = bundle.etfs[symbol.toUpperCase()];
  if (etf) return etf.name;
  for (const entry of Object.values(bundle.etfs)) {
    const hit = entry.holdings.find((h) => h.symbol === symbol.toUpperCase());
    if (hit) return hit.name;
  }
  return void 0;
}

// src/main/services/util.ts
var SYMBOL_RE = /^[A-Z0-9.^-]{1,12}$/i;
function normalizeSymbol(raw) {
  if (typeof raw !== "string") return null;
  const sym = raw.trim().toUpperCase();
  return sym.length > 0 && SYMBOL_RE.test(sym) ? sym : null;
}
function cleanSymbolList(raw, max) {
  if (!Array.isArray(raw)) return [];
  const out = [];
  for (const entry of raw) {
    const sym = normalizeSymbol(entry);
    if (sym && !out.includes(sym)) {
      out.push(sym);
      if (out.length >= max) break;
    }
  }
  return out;
}
function fnv1a(input, seed = 2166136261) {
  let h = seed >>> 0;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function stableHash(input) {
  return fnv1a(input);
}
function hashId(input) {
  return fnv1a(input).toString(36) + fnv1a(input, 2538058380).toString(36);
}
function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = a + 1831565813 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
function pLimit(concurrency) {
  let active = 0;
  const queue = [];
  const next = () => {
    active--;
    const run = queue.shift();
    if (run) run();
  };
  return (fn) => new Promise((resolve, reject) => {
    const run = () => {
      active++;
      fn().then(
        (value) => {
          next();
          resolve(value);
        },
        (err) => {
          next();
          reject(err);
        }
      );
    };
    if (active < concurrency) run();
    else queue.push(run);
  });
}
function toYmd(d) {
  return d.toISOString().slice(0, 10);
}
function todayYmd() {
  return toYmd(/* @__PURE__ */ new Date());
}
function parseDateMs(value) {
  if (!value) return null;
  const ms = Date.parse(value);
  return Number.isNaN(ms) ? null : ms;
}
function normalizeTitle(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}
function stripHtml(input) {
  return input.replace(/<[^>]*>/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#0?39;|&apos;/g, "'").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
}
function clampInt(raw, min, max, fallback) {
  const n = typeof raw === "number" && Number.isFinite(raw) ? Math.round(raw) : fallback;
  return Math.min(max, Math.max(min, n));
}
function round2(n) {
  return Math.round(n * 100) / 100;
}

// src/main/services/sample.ts
var BASE_PRICES = {
  SPY: 620,
  VOO: 570,
  IVV: 623,
  VTI: 305,
  QQQ: 560,
  DIA: 445,
  IWM: 225,
  XLK: 265,
  XLF: 53,
  XLE: 92,
  XLV: 135,
  SMH: 290,
  SOXX: 245,
  ARKK: 75,
  SCHD: 27,
  JEPI: 56,
  VGT: 700,
  VUG: 460,
  VTV: 175,
  RSP: 185,
  AAPL: 230,
  MSFT: 500,
  NVDA: 170,
  AMZN: 220,
  GOOGL: 185,
  GOOG: 187,
  META: 720,
  TSLA: 320,
  AVGO: 270,
  "BRK-B": 490,
  JPM: 290,
  V: 355,
  MA: 560,
  UNH: 310,
  XOM: 115,
  LLY: 780,
  JNJ: 155,
  PG: 160,
  HD: 365,
  COST: 985,
  WMT: 98,
  NFLX: 1250,
  CRM: 270,
  ORCL: 210,
  AMD: 140,
  ADBE: 390,
  PEP: 132,
  KO: 70,
  CSCO: 66,
  INTC: 22,
  TSM: 230,
  ASML: 790,
  QCOM: 155,
  TXN: 195,
  MU: 120,
  AMAT: 185,
  LRCX: 95,
  KLAC: 880,
  PLTR: 140,
  COIN: 350,
  HOOD: 80,
  SHOP: 110,
  DIS: 120,
  BA: 210,
  CAT: 390,
  GS: 700,
  MS: 140,
  BAC: 47,
  WFC: 80,
  IBM: 290,
  GE: 250,
  MCD: 300,
  NKE: 72,
  T: 28,
  VZ: 43,
  PFE: 25,
  MRK: 82,
  ABBV: 190,
  TMO: 490,
  CVX: 155,
  COP: 95,
  UBER: 90,
  NOW: 1e3,
  ISRG: 530,
  INTU: 760,
  AMGN: 290,
  HON: 220,
  GILD: 110,
  BMY: 55,
  SBUX: 95,
  PYPL: 75
};
function basePriceFor(symbol) {
  return BASE_PRICES[symbol.toUpperCase()] ?? 100;
}
var SAMPLE_RANGE = {
  "1d": { interval: "5m", count: 78, kind: "intraday", stepSec: 300, vol: 12e-4, baseVolume: 9e5 },
  "1w": { interval: "15m", count: 130, kind: "intraday", stepSec: 900, vol: 2e-3, baseVolume: 26e5 },
  "1m": { interval: "60m", count: 154, kind: "intraday", stepSec: 3600, vol: 4e-3, baseVolume: 9e6 },
  "6m": { interval: "1d", count: 126, kind: "daily", stepSec: 86400, vol: 0.012, baseVolume: 55e6 },
  "1y": { interval: "1d", count: 252, kind: "daily", stepSec: 86400, vol: 0.012, baseVolume: 55e6 },
  "5y": { interval: "1wk", count: 260, kind: "weekly", stepSec: 7 * 86400, vol: 0.028, baseVolume: 26e7 },
  max: { interval: "1mo", count: 240, kind: "monthly", stepSec: 30 * 86400, vol: 0.05, baseVolume: 11e8 }
};
var SESSION_OPEN_SEC = 13.5 * 3600;
var SESSION_CLOSE_SEC = 20 * 3600;
function lastWeekdayUtc(fromMs) {
  const d = new Date(fromMs);
  d.setUTCHours(0, 0, 0, 0);
  while (d.getUTCDay() === 0 || d.getUTCDay() === 6) {
    d.setUTCDate(d.getUTCDate() - 1);
  }
  return Math.floor(d.getTime() / 1e3);
}
function buildTimes(spec, count) {
  const times = [];
  if (spec.kind === "intraday") {
    let day = lastWeekdayUtc(Date.now());
    while (times.length < count) {
      const dayBars = [];
      for (let t = SESSION_OPEN_SEC; t < SESSION_CLOSE_SEC; t += spec.stepSec) {
        dayBars.push(day + t);
      }
      times.unshift(...dayBars);
      day = lastWeekdayUtc((day - 86400) * 1e3);
    }
    return times.slice(times.length - count);
  }
  if (spec.kind === "daily") {
    let day = lastWeekdayUtc(Date.now());
    while (times.length < count) {
      times.unshift(day + SESSION_OPEN_SEC);
      day = lastWeekdayUtc((day - 86400) * 1e3);
    }
    return times;
  }
  if (spec.kind === "weekly") {
    const anchor = lastWeekdayUtc(Date.now());
    for (let i = count - 1; i >= 0; i--) {
      times.push(anchor - i * 7 * 86400 + SESSION_OPEN_SEC);
    }
    return times;
  }
  const d = /* @__PURE__ */ new Date();
  d.setUTCHours(0, 0, 0, 0);
  d.setUTCDate(1);
  for (let i = 0; i < count; i++) {
    times.unshift(Math.floor(d.getTime() / 1e3) + SESSION_OPEN_SEC);
    d.setUTCMonth(d.getUTCMonth() - 1);
  }
  return times;
}
function sampleChart(symbol, range) {
  const sym = symbol.toUpperCase();
  const spec = SAMPLE_RANGE[range];
  const rng = mulberry32(stableHash(`${sym}|${range}`));
  const base = basePriceFor(sym);
  const times = buildTimes(spec, spec.count);
  const n = times.length;
  const closes = new Array(n);
  closes[n - 1] = base;
  for (let i = n - 2; i >= 0; i--) {
    const drift = (rng() - 0.495) * 2 * spec.vol;
    closes[i] = closes[i + 1] / (1 + drift);
  }
  const candles = [];
  let prevClose = closes[0] * (1 + (rng() - 0.5) * spec.vol);
  for (let i = 0; i < n; i++) {
    const open = prevClose;
    const close = closes[i];
    const wick = Math.max(Math.abs(close - open), close * spec.vol * 0.5);
    const high = Math.max(open, close) + rng() * wick * 0.6;
    const low = Math.min(open, close) - rng() * wick * 0.6;
    candles.push({
      time: times[i],
      open: round2(open),
      high: round2(high),
      low: round2(Math.max(low, 0.01)),
      close: round2(close),
      volume: Math.round(spec.baseVolume * (0.4 + rng() * 1.2))
    });
    prevClose = close;
  }
  const previousClose = range === "1d" ? round2(candles[0].open) : round2(candles[Math.max(0, n - 2)].close);
  return {
    symbol: sym,
    range,
    interval: spec.interval,
    candles,
    currency: "USD",
    exchangeName: void 0,
    regularMarketPrice: round2(candles[n - 1].close),
    previousClose,
    source: "sample"
  };
}
function sampleQuote(symbol) {
  const sym = symbol.toUpperCase();
  const chart = sampleChart(sym, "1d");
  const last = chart.candles[chart.candles.length - 1];
  const price = last.close;
  const previousClose = chart.previousClose ?? null;
  const change = previousClose !== null ? round2(price - previousClose) : null;
  const changePercent = previousClose !== null && previousClose !== 0 && change !== null ? round2(change / previousClose * 100) : null;
  return {
    symbol: sym,
    price,
    change,
    changePercent,
    previousClose,
    currency: "USD",
    updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
    source: "sample"
  };
}
var NEWS_TEMPLATES = [
  (name) => `${name} in focus as investors weigh the sector outlook`,
  (name, sym) => `Analysts revisit ${name} (${sym}) price targets after recent moves`,
  (name, sym) => `What the latest market swings mean for ${sym} holders`,
  (name) => `${name}: three things to watch this quarter`
];
function sampleNews(symbols, perSymbol = 3) {
  const items2 = [];
  const nowHour = Math.floor(Date.now() / 36e5) * 36e5;
  for (const symbol of symbols.slice(0, 12)) {
    const sym = symbol.toUpperCase();
    const rng = mulberry32(stableHash(`news|${sym}`));
    const name = lookupName(sym) ?? sym;
    for (let i = 0; i < Math.min(perSymbol, NEWS_TEMPLATES.length); i++) {
      const ageHours = 2 + Math.floor(rng() * 20) + i * 24;
      items2.push({
        id: `sample-${sym.toLowerCase()}-${i}`,
        title: NEWS_TEMPLATES[i](name, sym),
        url: `https://finance.yahoo.com/quote/${encodeURIComponent(sym)}`,
        sourceName: "Sample Data",
        publishedAt: new Date(nowHour - ageHours * 36e5).toISOString(),
        relatedSymbol: sym,
        summary: "Offline sample headline \u2014 live news was unavailable when this was generated."
      });
    }
  }
  items2.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  return items2;
}
function sampleEarnings(symbol) {
  const sym = symbol.toUpperCase();
  const hash = stableHash(sym);
  const daysOut = hash % 28 + 2;
  const date = /* @__PURE__ */ new Date();
  date.setUTCHours(0, 0, 0, 0);
  date.setUTCDate(date.getUTCDate() + daysOut);
  return {
    symbol: sym,
    companyName: lookupName(sym) ?? sym,
    date: toYmd(date),
    time: hash % 2 === 0 ? "bmo" : "amc",
    epsEstimate: Math.round((hash % 450 / 100 + 0.4) * 100) / 100,
    epsActual: Math.round((hash % 470 / 100 + 0.35) * 100) / 100,
    epsSurprisePercent: Math.round((hash % 21 - 8) / 100 * 1e3) / 10,
    latestReportedDate: toYmd(new Date(Date.now() - 90 * 864e5)),
    source: "sample"
  };
}

// src/main/services/cache.ts
var TtlCache = class {
  constructor(maxEntries = 800) {
    this.maxEntries = maxEntries;
  }
  map = /* @__PURE__ */ new Map();
  get(key) {
    const entry = this.map.get(key);
    if (!entry) return void 0;
    if (entry.expires <= Date.now()) {
      this.map.delete(key);
      return void 0;
    }
    return entry.value;
  }
  set(key, value, ttlMs) {
    if (ttlMs <= 0) return;
    if (this.map.size >= this.maxEntries) this.prune();
    this.map.set(key, { expires: Date.now() + ttlMs, value });
  }
  delete(key) {
    this.map.delete(key);
  }
  prune() {
    const now = Date.now();
    for (const [key, entry] of this.map) {
      if (entry.expires <= now) this.map.delete(key);
    }
    while (this.map.size >= this.maxEntries) {
      const oldest = this.map.keys().next();
      if (oldest.done) break;
      this.map.delete(oldest.value);
    }
  }
};

// src/main/services/http.ts
var BROWSER_UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36";
var HttpError = class extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
    this.name = "HttpError";
  }
};
var DEFAULT_TIMEOUT_MS = 12e3;
var MAX_ATTEMPTS = 3;
var RETRY_DELAYS_MS = [500, 1400];
var HostLimiter = class {
  constructor(maxConcurrent, spacingMs) {
    this.maxConcurrent = maxConcurrent;
    this.spacingMs = spacingMs;
  }
  active = 0;
  nextSlot = 0;
  waiting = [];
  async run(fn) {
    await this.acquire();
    try {
      return await fn();
    } finally {
      this.release();
    }
  }
  acquire() {
    return new Promise((resolve) => {
      const attempt = () => {
        if (this.active >= this.maxConcurrent) {
          this.waiting.push(attempt);
          return;
        }
        const now = Date.now();
        const wait = this.nextSlot - now;
        if (wait > 0) {
          setTimeout(attempt, wait);
          return;
        }
        this.active++;
        this.nextSlot = now + this.spacingMs;
        resolve();
      };
      attempt();
    });
  }
  release() {
    this.active--;
    const next = this.waiting.shift();
    if (next) next();
  }
};
var limiters = /* @__PURE__ */ new Map();
function limiterFor(host) {
  let limiter = limiters.get(host);
  if (!limiter) {
    const spacing = host === "query1.finance.yahoo.com" ? 250 : 0;
    limiter = new HostLimiter(4, spacing);
    limiters.set(host, limiter);
  }
  return limiter;
}
var bodyCache = new TtlCache(600);
var inFlight = /* @__PURE__ */ new Map();
async function doFetch(url, host, headers, timeoutMs) {
  const res = await fetch(url, {
    headers: { "User-Agent": BROWSER_UA, ...headers },
    redirect: "follow",
    signal: AbortSignal.timeout(timeoutMs)
  });
  if (!res.ok) {
    throw new HttpError(`HTTP ${res.status} from ${host}`, res.status);
  }
  return res.text();
}
async function fetchWithRetry(url, headers, timeoutMs) {
  const host = new URL(url).hostname;
  let lastErr;
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    try {
      return await limiterFor(host).run(() => doFetch(url, host, headers, timeoutMs));
    } catch (err) {
      lastErr = err;
      const status = err instanceof HttpError ? err.status : void 0;
      const retryable = status === void 0 || status === 429 || status >= 500;
      if (!retryable || attempt === MAX_ATTEMPTS - 1) throw err;
      await sleep(RETRY_DELAYS_MS[attempt] ?? 1500);
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error(`fetch failed: ${url}`);
}
async function fetchText(url, opts = {}) {
  const ttlMs = opts.ttlMs ?? 0;
  const timeoutMs = opts.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  if (ttlMs > 0) {
    const cached = bodyCache.get(url);
    if (cached !== void 0) return cached;
    const pending = inFlight.get(url);
    if (pending) return pending;
  }
  const promise = fetchWithRetry(url, opts.headers, timeoutMs).then((body) => {
    if (ttlMs > 0) bodyCache.set(url, body, ttlMs);
    return body;
  }).finally(() => {
    inFlight.delete(url);
  });
  if (ttlMs > 0) inFlight.set(url, promise);
  return promise;
}
async function fetchJson(url, opts = {}) {
  const body = await fetchText(url, opts);
  try {
    return JSON.parse(body);
  } catch {
    bodyCache.delete(url);
    throw new Error(`Invalid JSON from ${new URL(url).hostname}`);
  }
}

// src/main/services/yahoo.ts
function rawNumber(value) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (value && typeof value === "object") {
    const raw = value.raw;
    if (typeof raw === "number" && Number.isFinite(raw)) return raw;
  }
  return null;
}
async function fetchYahooChart(symbol, yahooRange, interval, ttlMs) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=${encodeURIComponent(yahooRange)}&interval=${encodeURIComponent(interval)}&includePrePost=false`;
  const json = await fetchJson(url, { ttlMs });
  const result = json.chart?.result?.[0];
  if (!result || !result.meta) {
    const desc = json.chart?.error?.description ?? "empty chart result";
    throw new Error(`Yahoo chart failed for ${symbol}: ${desc}`);
  }
  return result;
}
async function searchYahoo(query) {
  const url = `https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(query)}&quotesCount=8&newsCount=0`;
  const json = await fetchJson(url, { ttlMs: 10 * 6e4 });
  return Array.isArray(json.quotes) ? json.quotes : [];
}
var CRUMB_TTL_MS = 30 * 6e4;
var crumbState = null;
var crumbPromise = null;
function invalidateCrumb() {
  crumbState = null;
}
async function fetchCookie() {
  const res = await fetch("https://fc.yahoo.com/", {
    headers: { "User-Agent": BROWSER_UA },
    redirect: "manual",
    signal: AbortSignal.timeout(12e3)
  });
  let cookies = [];
  try {
    cookies = res.headers.getSetCookie();
  } catch {
  }
  if (cookies.length === 0) {
    const single = res.headers.get("set-cookie");
    if (single) cookies = [single];
  }
  const parts = cookies.map((c) => c.split(";")[0].trim()).filter((c) => c.includes("="));
  if (parts.length === 0) throw new Error("Yahoo returned no cookie");
  return parts.join("; ");
}
async function fetchCrumbState() {
  const cookie = await fetchCookie();
  const res = await fetch("https://query1.finance.yahoo.com/v1/test/getcrumb", {
    headers: { "User-Agent": BROWSER_UA, Cookie: cookie },
    signal: AbortSignal.timeout(12e3)
  });
  if (!res.ok) throw new HttpError(`getcrumb HTTP ${res.status}`, res.status);
  const crumb = (await res.text()).trim();
  if (!crumb || crumb.length > 64 || crumb.includes("<") || crumb.includes("{")) {
    throw new Error("Yahoo returned an invalid crumb");
  }
  return { cookie, crumb, fetchedAt: Date.now() };
}
async function getCrumb(force = false) {
  if (force) invalidateCrumb();
  if (crumbState && Date.now() - crumbState.fetchedAt < CRUMB_TTL_MS) {
    return crumbState;
  }
  if (!crumbPromise) {
    crumbPromise = fetchCrumbState().then((state) => {
      crumbState = state;
      return state;
    }).finally(() => {
      crumbPromise = null;
    });
  }
  return crumbPromise;
}
async function quoteSummary(symbol, modules) {
  let lastErr;
  for (let attempt = 0; attempt < 2; attempt++) {
    const { cookie, crumb } = await getCrumb(attempt > 0);
    const url = `https://query1.finance.yahoo.com/v10/finance/quoteSummary/${encodeURIComponent(symbol)}?modules=${encodeURIComponent(modules.join(","))}&crumb=${encodeURIComponent(crumb)}`;
    try {
      const json = await fetchJson(url, {
        ttlMs: 0,
        headers: { Cookie: cookie }
      });
      const result = json.quoteSummary?.result?.[0];
      if (!result) {
        const desc = json.quoteSummary?.error?.description ?? "empty result";
        throw new Error(`quoteSummary failed for ${symbol}: ${desc}`);
      }
      return result;
    } catch (err) {
      lastErr = err;
      const status = err instanceof HttpError ? err.status : void 0;
      if ((status === 401 || status === 403) && attempt === 0) {
        invalidateCrumb();
        continue;
      }
      throw err;
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error(`quoteSummary failed for ${symbol}`);
}

// src/main/services/chart.ts
var INTRADAY_TTL = 6e4;
var DAILY_TTL = 10 * 6e4;
var RANGE_MAP = {
  "1d": { yahooRange: "1d", interval: "5m", ttlMs: INTRADAY_TTL },
  "1w": { yahooRange: "5d", interval: "15m", ttlMs: INTRADAY_TTL },
  "1m": { yahooRange: "1mo", interval: "60m", ttlMs: INTRADAY_TTL },
  "6m": { yahooRange: "6mo", interval: "1d", ttlMs: DAILY_TTL },
  "1y": { yahooRange: "1y", interval: "1d", ttlMs: DAILY_TTL },
  "5y": { yahooRange: "5y", interval: "1wk", ttlMs: DAILY_TTL },
  max: { yahooRange: "max", interval: "1mo", ttlMs: DAILY_TTL }
};
function isFiniteNumber(v) {
  return typeof v === "number" && Number.isFinite(v);
}
async function getChart(symbol, range) {
  const spec = RANGE_MAP[range];
  try {
    const result = await fetchYahooChart(symbol, spec.yahooRange, spec.interval, spec.ttlMs);
    const meta = result.meta ?? {};
    const timestamps = Array.isArray(result.timestamp) ? result.timestamp : [];
    const quote = result.indicators?.quote?.[0] ?? {};
    const opens = quote.open ?? [];
    const highs = quote.high ?? [];
    const lows = quote.low ?? [];
    const closes = quote.close ?? [];
    const volumes = quote.volume ?? [];
    const bySecond = /* @__PURE__ */ new Map();
    for (let i = 0; i < timestamps.length; i++) {
      const time = timestamps[i];
      const close = closes[i];
      if (!isFiniteNumber(time) || !isFiniteNumber(close)) continue;
      const rawOpen = opens[i];
      const rawHigh = highs[i];
      const rawLow = lows[i];
      const rawVolume = volumes[i];
      const open = isFiniteNumber(rawOpen) ? rawOpen : close;
      let high = isFiniteNumber(rawHigh) ? rawHigh : Math.max(open, close);
      let low = isFiniteNumber(rawLow) ? rawLow : Math.min(open, close);
      high = Math.max(high, open, close);
      low = Math.min(low, open, close);
      const volume = isFiniteNumber(rawVolume) ? rawVolume : 0;
      bySecond.set(Math.floor(time), { time: Math.floor(time), open, high, low, close, volume });
    }
    const candles = [...bySecond.values()].sort((a, b) => a.time - b.time);
    if (candles.length === 0) throw new Error(`no usable candles for ${symbol} ${range}`);
    return {
      symbol,
      range,
      interval: spec.interval,
      candles,
      currency: typeof meta.currency === "string" && meta.currency ? meta.currency : "USD",
      exchangeName: typeof meta.exchangeName === "string" && meta.exchangeName ? meta.exchangeName : void 0,
      regularMarketPrice: isFiniteNumber(meta.regularMarketPrice) ? meta.regularMarketPrice : null,
      previousClose: isFiniteNumber(meta.chartPreviousClose) ? meta.chartPreviousClose : isFiniteNumber(meta.previousClose) ? meta.previousClose : null,
      source: "live"
    };
  } catch {
    return sampleChart(symbol, range);
  }
}

// src/main/services/earnings.ts
var LIVE_TTL_MS = 6 * 60 * 6e4;
var SAMPLE_TTL_MS = 10 * 6e4;
var WINDOW_DAYS = 120;
var limit = pLimit(3);
var cache = new TtlCache(400);
function toEpochMs(value) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value > 1e12 ? value : value * 1e3;
  }
  if (typeof value === "string") {
    const ms = Date.parse(value);
    return Number.isNaN(ms) ? null : ms;
  }
  if (value && typeof value === "object") {
    const raw = value.raw;
    if (typeof raw === "number" && Number.isFinite(raw)) {
      return raw > 1e12 ? raw : raw * 1e3;
    }
    const fmt = value.fmt;
    if (typeof fmt === "string") {
      const ms = Date.parse(fmt);
      return Number.isNaN(ms) ? null : ms;
    }
  }
  return null;
}
function detectTime(candidates) {
  for (const c of candidates) {
    if (typeof c !== "string") continue;
    const v = c.toLowerCase();
    if (v.includes("bmo") || v.includes("before")) return "bmo";
    if (v.includes("amc") || v.includes("after")) return "amc";
  }
  return "unknown";
}
async function fetchLiveEvent(symbol) {
  const summary = await quoteSummary(symbol, ["calendarEvents", "earningsHistory", "price"]);
  const earnings = summary.calendarEvents?.earnings;
  const latestHistory = summary.earningsHistory?.history?.[0];
  const companyName = summary.price?.longName || summary.price?.shortName || lookupName(symbol) || symbol;
  const dates = Array.isArray(earnings?.earningsDate) ? earnings.earningsDate : [];
  const startOfToday = Date.parse(`${toYmd(/* @__PURE__ */ new Date())}T00:00:00Z`);
  const windowEnd = startOfToday + WINDOW_DAYS * 864e5;
  let nextMs = null;
  for (const d of dates) {
    const ms = toEpochMs(d);
    if (ms === null || ms < startOfToday || ms > windowEnd) continue;
    if (nextMs === null || ms < nextMs) nextMs = ms;
  }
  if (nextMs === null) return null;
  return {
    symbol,
    companyName,
    date: toYmd(new Date(nextMs)),
    time: detectTime([earnings?.earningsCallTime, earnings?.callTime]),
    epsEstimate: rawNumber(earnings?.earningsAverage),
    epsActual: rawNumber(latestHistory?.epsActual),
    epsSurprisePercent: rawNumber(latestHistory?.surprisePercent),
    latestReportedDate: latestHistory?.quarter === void 0 ? null : (() => {
      const ms = toEpochMs(latestHistory.quarter);
      return ms === null ? null : toYmd(new Date(ms));
    })(),
    source: "live"
  };
}
async function eventFor(symbol) {
  const cached = cache.get(symbol);
  if (cached !== void 0) return cached;
  try {
    const event = await limit(() => fetchLiveEvent(symbol));
    cache.set(symbol, event, LIVE_TTL_MS);
    return event;
  } catch {
    const event = sampleEarnings(symbol);
    cache.set(symbol, event, SAMPLE_TTL_MS);
    return event;
  }
}
async function getEarnings(symbols) {
  const results = await Promise.all(symbols.map((s) => eventFor(s)));
  const events = results.filter((e) => e !== null);
  events.sort((a, b) => a.date.localeCompare(b.date) || a.symbol.localeCompare(b.symbol));
  return events;
}

// src/main/services/holdings.ts
var LIVE_TTL_MS2 = 12 * 60 * 6e4;
var SAMPLE_TTL_MS2 = 15 * 6e4;
var MAX_HOLDINGS = 20;
var cache2 = new TtlCache(200);
var inFlight2 = /* @__PURE__ */ new Map();
function bundledResult(etfSymbol) {
  const entry = getEtfBundle().etfs[etfSymbol];
  return {
    etfSymbol,
    asOf: getBundleAsOf(),
    holdings: entry ? entry.holdings.slice(0, MAX_HOLDINGS) : [],
    source: "sample"
  };
}
async function fetchLiveHoldings(etfSymbol) {
  const summary = await quoteSummary(etfSymbol, ["topHoldings"]);
  const raw = summary.topHoldings?.holdings;
  if (!Array.isArray(raw) || raw.length === 0) {
    throw new Error(`no live topHoldings for ${etfSymbol}`);
  }
  const out = [];
  for (const h of raw) {
    const symbol = typeof h.symbol === "string" ? h.symbol.toUpperCase().trim() : "";
    if (!symbol || out.some((x) => x.symbol === symbol)) continue;
    const fraction = rawNumber(h.holdingPercent);
    out.push({
      symbol,
      name: typeof h.holdingName === "string" && h.holdingName ? h.holdingName : symbol,
      weightPercent: fraction === null ? null : round2(fraction * 100)
    });
  }
  if (out.length === 0) throw new Error(`unusable live topHoldings for ${etfSymbol}`);
  return out;
}
function mergeWithBundle(etfSymbol, live) {
  const merged = [...live];
  const bundle = getEtfBundle().etfs[etfSymbol];
  if (bundle) {
    for (const h of bundle.holdings) {
      if (merged.length >= MAX_HOLDINGS) break;
      if (merged.some((x) => x.symbol === h.symbol)) continue;
      merged.push(h);
    }
    for (const item of merged) {
      if (item.name === item.symbol) {
        const known = bundle.holdings.find((x) => x.symbol === item.symbol);
        if (known) item.name = known.name;
      }
    }
  }
  merged.sort((a, b) => (b.weightPercent ?? -1) - (a.weightPercent ?? -1));
  return merged.slice(0, MAX_HOLDINGS);
}
async function getHoldings(etfSymbol) {
  const sym = etfSymbol.toUpperCase();
  const cached = cache2.get(sym);
  if (cached) return cached;
  const pending = inFlight2.get(sym);
  if (pending) return pending;
  const promise = (async () => {
    try {
      const live = await fetchLiveHoldings(sym);
      const result = {
        etfSymbol: sym,
        asOf: todayYmd(),
        holdings: mergeWithBundle(sym, live),
        source: "live"
      };
      cache2.set(sym, result, LIVE_TTL_MS2);
      return result;
    } catch {
      const result = bundledResult(sym);
      cache2.set(sym, result, SAMPLE_TTL_MS2);
      return result;
    }
  })().finally(() => {
    inFlight2.delete(sym);
  });
  inFlight2.set(sym, promise);
  return promise;
}

// src/main/services/llmSettings.ts
var import_electron = require("electron");
var import_node_fs2 = __toESM(require("node:fs"));
var import_node_path2 = __toESM(require("node:path"));
var DEFAULT_BASE_URL = process.env.QUANT_LLM_BASE_URL ?? "http://127.0.0.1:8080";
var DEFAULT_MODEL = process.env.QUANT_LLM_MODEL ?? "gemma-4-e4b";
function envEnabled() {
  return /^(1|true|yes)$/i.test(process.env.QUANT_LLM_ENABLED ?? "") || Boolean(process.env.QUANT_LLM_BASE_URL);
}
function storePath() {
  return import_node_path2.default.join(import_electron.app.getPath("userData"), "llm-settings.json");
}
function normalizeSettings(raw) {
  return {
    enabled: raw?.enabled === true || raw?.enabled === void 0 && envEnabled(),
    baseUrl: typeof raw?.baseUrl === "string" && raw.baseUrl.trim() ? raw.baseUrl.trim().replace(/\/+$/, "") : DEFAULT_BASE_URL,
    model: typeof raw?.model === "string" && raw.model.trim() ? raw.model.trim() : DEFAULT_MODEL
  };
}
function getLlmSettings() {
  try {
    const raw = import_node_fs2.default.readFileSync(storePath(), "utf8");
    const parsed = JSON.parse(raw);
    return normalizeSettings(parsed);
  } catch {
    return normalizeSettings(null);
  }
}
function saveLlmSettings(raw) {
  const settings = normalizeSettings({
    enabled: raw.enabled === true,
    baseUrl: raw.baseUrl,
    model: raw.model
  });
  const file = storePath();
  import_node_fs2.default.mkdirSync(import_node_path2.default.dirname(file), { recursive: true });
  import_node_fs2.default.writeFileSync(file, JSON.stringify(settings, null, 2), "utf8");
  return settings;
}

// src/main/services/macro.ts
var FRED_TTL_MS = 6 * 60 * 6e4;
var MARKET_TTL_MS = 2 * 6e4;
var SPECS = {
  jobs: {
    label: "US job growth",
    unit: "monthly payroll change, thousands",
    fredId: "PAYEMS"
  },
  unemployment: {
    label: "US unemployment",
    unit: "percent",
    fredId: "UNRATE"
  },
  inflation: {
    label: "US inflation",
    unit: "CPI year-over-year, percent",
    fredId: "CPIAUCSL"
  },
  treasury10y: {
    label: "10Y Treasury yield",
    unit: "percent",
    fredId: "DGS10"
  }
};
function rangeStartMs(range) {
  const now = Date.now();
  const day = 864e5;
  switch (range) {
    case "1d":
      return now - 14 * day;
    case "1w":
      return now - 35 * day;
    case "1m":
      return now - 90 * day;
    case "6m":
      return now - 240 * day;
    case "1y":
      return now - 500 * day;
    case "5y":
      return now - 6 * 365 * day;
    case "max":
      return now - 20 * 365 * day;
  }
}
function parseFredCsv(csv) {
  const rows = csv.trim().split(/\r?\n/).slice(1);
  const out = [];
  for (const row of rows) {
    const [date, rawValue] = row.split(",");
    const value = Number(rawValue);
    const ms = Date.parse(`${date}T13:30:00Z`);
    if (!Number.isFinite(value) || !Number.isFinite(ms)) continue;
    out.push({ time: Math.floor(ms / 1e3), value });
  }
  return out;
}
function monthlyChanges(points) {
  const out = [];
  for (let i = 1; i < points.length; i++) {
    out.push({ time: points[i].time, value: Math.round((points[i].value - points[i - 1].value) * 10) / 10 });
  }
  return out;
}
function yearOverYearPercent(points) {
  const out = [];
  for (let i = 12; i < points.length; i++) {
    const prev = points[i - 12].value;
    if (prev === 0) continue;
    out.push({
      time: points[i].time,
      value: Math.round((points[i].value - prev) / prev * 1e4) / 100
    });
  }
  return out;
}
function fallbackSeries(key, range) {
  const chart = sampleChart(key === "vix" ? "VIX" : key === "oil" ? "USO" : "SPY", range);
  const base = key === "jobs" ? 175 : key === "unemployment" ? 4.1 : key === "inflation" ? 3.2 : key === "treasury10y" ? 4.1 : key === "oil" ? 78 : 18;
  const label = key === "jobs" ? "US job growth" : key === "unemployment" ? "US unemployment" : key === "inflation" ? "US inflation" : key === "treasury10y" ? "10Y Treasury yield" : key === "oil" ? "WTI crude oil" : "VIX volatility";
  const unit = key === "jobs" ? "monthly payroll change, thousands" : key === "oil" ? "USD/barrel" : key === "vix" ? "index" : "percent";
  return {
    key,
    label,
    unit,
    sourceName: "Sample Data",
    source: "sample",
    points: chart.candles.filter((_, i) => i % Math.max(1, Math.floor(chart.candles.length / 60)) === 0).map((c, i) => ({
      time: c.time,
      value: Math.round(
        (base + Math.sin(i / 4) * (key === "jobs" ? 70 : key === "vix" ? 4 : key === "oil" ? 8 : 0.25)) * 100
      ) / 100
    }))
  };
}
async function getFredOverlay(key, range) {
  const spec = SPECS[key];
  const url = `https://fred.stlouisfed.org/graph/fredgraph.csv?id=${encodeURIComponent(spec.fredId)}`;
  const csv = await fetchText(url, { ttlMs: FRED_TTL_MS, timeoutMs: 12e3 });
  const startSec = Math.floor(rangeStartMs(range) / 1e3);
  const parsed = parseFredCsv(csv);
  const points = key === "jobs" ? monthlyChanges(parsed) : key === "inflation" ? yearOverYearPercent(parsed) : parsed.map((p) => ({ time: p.time, value: p.value }));
  return {
    key,
    label: spec.label,
    unit: spec.unit,
    sourceName: "FRED",
    source: "live",
    points: points.filter((p) => p.time >= startSec)
  };
}
function yahooRangeFor(range) {
  const yahooRange = range === "1w" ? "5d" : range === "1m" ? "1mo" : range === "max" ? "10y" : range;
  const interval = range === "1d" ? "5m" : range === "1w" ? "15m" : range === "1m" ? "60m" : "1d";
  return { yahooRange, interval };
}
async function getYahooOverlay(key, range) {
  const { yahooRange, interval } = yahooRangeFor(range);
  const result = await fetchYahooChart(key === "vix" ? "^VIX" : "CL=F", yahooRange, interval, MARKET_TTL_MS);
  const quote = result.indicators?.quote?.[0];
  const timestamps = result.timestamp ?? [];
  const closes = quote?.close ?? [];
  const points = [];
  for (let i = 0; i < timestamps.length; i++) {
    const time = timestamps[i];
    const value = closes[i];
    if (typeof time === "number" && typeof value === "number" && Number.isFinite(value)) {
      points.push({ time: Math.floor(time), value: Math.round(value * 100) / 100 });
    }
  }
  if (points.length === 0) throw new Error(`${key} overlay returned no points`);
  return {
    key,
    label: key === "vix" ? "VIX volatility" : "WTI crude oil",
    unit: key === "vix" ? "index" : "USD/barrel",
    sourceName: "Yahoo Finance",
    source: "live",
    points
  };
}
async function getMacroOverlay(key, range) {
  try {
    if (key === "vix" || key === "oil") return await getYahooOverlay(key, range);
    return await getFredOverlay(key, range);
  } catch {
    return fallbackSeries(key, range);
  }
}

// src/main/services/insightStore.ts
var import_electron2 = require("electron");
var import_node_fs3 = __toESM(require("node:fs"));
var import_node_path3 = __toESM(require("node:path"));
var MAX_RECORDS = 200;
function storePath2() {
  return import_node_path3.default.join(import_electron2.app.getPath("userData"), "quant-insights.json");
}
function readAll() {
  try {
    const raw = import_node_fs3.default.readFileSync(storePath2(), "utf8");
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isRecord);
  } catch {
    return [];
  }
}
function writeAll(records) {
  const file = storePath2();
  import_node_fs3.default.mkdirSync(import_node_path3.default.dirname(file), { recursive: true });
  import_node_fs3.default.writeFileSync(file, JSON.stringify(records.slice(0, MAX_RECORDS), null, 2));
}
function isRecord(value) {
  if (!value || typeof value !== "object") return false;
  const r = value;
  return typeof r.id === "string" && typeof r.symbol === "string" && typeof r.range === "string" && typeof r.answer === "string" && typeof r.generatedAt === "string";
}
function saveQuantInsight(request, response) {
  const record = {
    ...response,
    id: `${request.symbol}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    symbol: request.symbol,
    range: request.range,
    question: request.question,
    decision: request.evaluation.decision,
    setupType: request.evaluation.setupType,
    confidence: request.evaluation.confidence
  };
  const records = [record, ...readAll()].slice(0, MAX_RECORDS);
  writeAll(records);
  return record;
}
function getQuantInsights(symbol, range) {
  const normalized = symbol.toUpperCase();
  return readAll().filter((record) => record.symbol === normalized && (!range || record.range === range)).slice(0, 20);
}

// src/main/services/rss.ts
var import_fast_xml_parser = __toESM(require_fxp());
var parser = new import_fast_xml_parser.XMLParser({
  ignoreAttributes: false,
  isArray: (name) => name === "item",
  parseTagValue: false,
  trimValues: true
});
function textOf(value) {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number") return String(value);
  if (value && typeof value === "object") {
    const text = value["#text"];
    if (typeof text === "string") return text.trim();
    if (typeof text === "number") return String(text);
  }
  return "";
}
function parseRssItems(xml) {
  let doc;
  try {
    doc = parser.parse(xml);
  } catch {
    return [];
  }
  const channel = doc.rss?.channel;
  const rawItems = channel?.item;
  if (!Array.isArray(rawItems)) return [];
  const out = [];
  for (const raw of rawItems) {
    if (!raw || typeof raw !== "object") continue;
    const item = raw;
    const title = textOf(item.title);
    const link = textOf(item.link);
    if (!title || !link) continue;
    const pubDate = textOf(item.pubDate);
    const description = textOf(item.description);
    const sourceName = textOf(item.source);
    out.push({
      title,
      link,
      pubDate: pubDate || void 0,
      description: description || void 0,
      sourceName: sourceName || void 0
    });
  }
  return out;
}

// src/main/services/googleNews.ts
function cleanTitle(title, publisher) {
  const idx = title.lastIndexOf(" - ");
  if (idx <= 0) return title;
  const suffix = title.slice(idx + 3).trim();
  if (publisher && suffix.toLowerCase() === publisher.toLowerCase()) {
    return title.slice(0, idx).trim();
  }
  if (!publisher && suffix.length <= 40 && !suffix.includes(" - ")) {
    return title.slice(0, idx).trim();
  }
  return title;
}
async function searchGoogleNews(symbol, afterYmd, beforeYmd, ttlMs) {
  const query = `${symbol} stock after:${afterYmd} before:${beforeYmd}`;
  const url = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-US&gl=US&ceid=US:en`;
  const xml = await fetchText(url, { ttlMs });
  const items2 = parseRssItems(xml);
  const out = [];
  for (const item of items2) {
    const publishedMs = parseDateMs(item.pubDate);
    if (publishedMs === null) continue;
    const publisher = item.sourceName;
    out.push({
      id: `g-${hashId(`${item.link}|${item.title}`)}`,
      title: cleanTitle(item.title, publisher),
      url: item.link,
      sourceName: publisher || "Google News",
      publishedAt: new Date(publishedMs).toISOString(),
      relatedSymbol: symbol
    });
  }
  return out;
}
async function searchKoreanFinanceNews(symbol, ttlMs, afterYmd, beforeYmd) {
  const dateClause = afterYmd && beforeYmd ? ` after:${afterYmd} before:${beforeYmd}` : "";
  const query = `site:finance.naver.com ${symbol} \uC8FC\uC2DD OR \uC99D\uAD8C${dateClause}`;
  const url = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=ko&gl=KR&ceid=KR:ko`;
  const xml = await fetchText(url, { ttlMs });
  const items2 = parseRssItems(xml);
  const out = [];
  for (const item of items2) {
    const publishedMs = parseDateMs(item.pubDate);
    if (publishedMs === null) continue;
    const publisher = item.sourceName;
    out.push({
      id: `kr-${hashId(`${item.link}|${item.title}`)}`,
      title: cleanTitle(item.title, publisher),
      url: item.link,
      sourceName: publisher ? `KR \xB7 ${publisher}` : "KR \xB7 Naver Finance",
      publishedAt: new Date(publishedMs).toISOString(),
      relatedSymbol: symbol
    });
  }
  return out;
}

// src/main/services/news.ts
var FEED_TTL_MS = 10 * 6e4;
var MAX_SYMBOLS = 40;
var MAX_TOTAL = 100;
var limit2 = pLimit(4);
async function fetchSymbolFeed(symbol) {
  const url = `https://feeds.finance.yahoo.com/rss/2.0/headline?s=${encodeURIComponent(symbol)}&region=US&lang=en-US`;
  const xml = await fetchText(url, { ttlMs: FEED_TTL_MS });
  const items2 = parseRssItems(xml);
  const out = [];
  for (const item of items2) {
    const publishedMs = parseDateMs(item.pubDate);
    const summary = item.description ? stripHtml(item.description).slice(0, 300) : void 0;
    out.push({
      id: `y-${hashId(`${item.link}|${item.title}`)}`,
      title: item.title,
      url: item.link,
      sourceName: item.sourceName || "Yahoo Finance",
      publishedAt: new Date(publishedMs ?? Date.now()).toISOString(),
      relatedSymbol: symbol,
      summary: summary && summary !== item.title ? summary : void 0
    });
  }
  return out;
}
async function getNews(symbols, limitPerSymbol = 6) {
  const requested = symbols.slice(0, MAX_SYMBOLS);
  if (requested.length === 0) return [];
  const perSymbol = await Promise.all(
    requested.map(
      (symbol) => limit2(async () => {
        const [yahoo, korean] = await Promise.all([
          fetchSymbolFeed(symbol).catch(() => []),
          searchKoreanFinanceNews(symbol, FEED_TTL_MS).catch(() => [])
        ]);
        return [...yahoo.slice(0, limitPerSymbol), ...korean.slice(0, 2)];
      }).catch(() => null)
    )
  );
  const allFailed = perSymbol.every((r) => r === null);
  if (allFailed) return sampleNews(requested);
  const seenTitles = /* @__PURE__ */ new Set();
  const merged = [];
  for (const feed of perSymbol) {
    if (!feed) continue;
    for (const item of feed.slice(0, limitPerSymbol + 2)) {
      const key = normalizeTitle(item.title);
      if (!key || seenTitles.has(key)) continue;
      seenTitles.add(key);
      merged.push(item);
    }
  }
  merged.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  return merged.slice(0, MAX_TOTAL);
}

// src/main/services/pivotNews.ts
var WINDOW_DAYS2 = 5;
var DAY_MS = 864e5;
var GOOGLE_TTL_MS = 30 * 6e4;
var MAX_ITEMS_PER_PIVOT = 4;
var MAX_PIVOTS = 12;
var limit3 = pLimit(3);
async function newsForPivot(symbol, pivot, yahooItems) {
  const pivotMs = pivot.time * 1e3;
  const startMs = pivotMs - WINDOW_DAYS2 * DAY_MS;
  let endMs = pivotMs + WINDOW_DAYS2 * DAY_MS;
  const nowMs = Date.now();
  if (endMs > nowMs) endMs = nowMs;
  const afterYmd = toYmd(new Date(Math.min(startMs, endMs - DAY_MS)));
  const beforeYmd = toYmd(new Date(endMs));
  const [google, korean] = await Promise.all([
    searchGoogleNews(symbol, afterYmd, beforeYmd, GOOGLE_TTL_MS).catch(() => []),
    searchKoreanFinanceNews(symbol, GOOGLE_TTL_MS, afterYmd, beforeYmd).catch(
      () => []
    )
  ]);
  const inWindow = (item) => {
    const ms = Date.parse(item.publishedAt);
    return !Number.isNaN(ms) && ms >= startMs - DAY_MS && ms <= endMs + DAY_MS;
  };
  const merged = [];
  const seen = /* @__PURE__ */ new Set();
  for (const item of [...google, ...korean, ...yahooItems.filter(inWindow)]) {
    const key = normalizeTitle(item.title);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    merged.push(item);
  }
  merged.sort(
    (a, b) => Math.abs(Date.parse(a.publishedAt) - pivotMs) - Math.abs(Date.parse(b.publishedAt) - pivotMs)
  );
  return merged.slice(0, MAX_ITEMS_PER_PIVOT);
}
async function getPivotNews(symbol, pivots) {
  const bounded = pivots.slice(0, MAX_PIVOTS);
  if (bounded.length === 0) return [];
  const yahooItems = await fetchSymbolFeed(symbol).catch(() => []);
  const results = await Promise.all(
    bounded.map(
      (pivot) => limit3(() => newsForPivot(symbol, pivot, yahooItems)).catch(() => []).then((items2) => ({ pivot, items: items2 }))
    )
  );
  return results;
}

// src/main/services/quantAi.ts
async function isReady(baseUrl) {
  try {
    const res = await fetch(`${baseUrl}/health`, { signal: AbortSignal.timeout(1500) });
    return res.ok;
  } catch {
    return false;
  }
}
function compactRequest(req) {
  const e = req.evaluation;
  const news = req.news.slice(0, 8).map((item) => `- [${item.relatedSymbol}] ${item.title} (${item.sourceName}, ${item.publishedAt})`).join("\n");
  const components = e.components.map((c) => `- ${c.name}: ${c.status}, ${c.score >= 0 ? "+" : ""}${c.score}. ${c.explanation}`).join("\n");
  const earnings = req.earnings ? `- Upcoming date: ${req.earnings.date} ${req.earnings.time}
- Analyst expected EPS: ${req.earnings.epsEstimate ?? "n/a"}
- Latest actual EPS: ${req.earnings.epsActual ?? "n/a"}
- Latest surprise: ${req.earnings.epsSurprisePercent ?? "n/a"}%
- Latest reported date: ${req.earnings.latestReportedDate ?? "n/a"}` : "- none";
  const valuation = req.valuation ? `- Price: ${req.valuation.price ?? "n/a"}
- Market cap: ${req.valuation.marketCap ?? "n/a"}
- Revenue: ${req.valuation.totalRevenue ?? "n/a"}
- Gross profit: ${req.valuation.grossProfit ?? "n/a"}
- EBITDA: ${req.valuation.ebitda ?? "n/a"}
- Net income: ${req.valuation.netIncomeToCommon ?? "n/a"}
- Profit margin: ${req.valuation.profitMargin ?? "n/a"}
- Revenue growth: ${req.valuation.revenueGrowth ?? "n/a"}
- P/E: ${req.valuation.trailingPe ?? "n/a"}
- Forward P/E: ${req.valuation.forwardPe ?? "n/a"}
- P/S: ${req.valuation.priceToSales ?? "n/a"}
- EV/Revenue: ${req.valuation.enterpriseToRevenue ?? "n/a"}
- EV/EBITDA: ${req.valuation.enterpriseToEbitda ?? "n/a"}
- Formula estimates:
${req.valuation.estimates.map((x) => `  - ${x.label}: fair value ${x.fairValue ?? "n/a"}, upside ${x.upsidePercent ?? "n/a"}%, formula: ${x.formula}`).join("\n")}` : "- none";
  const macro = req.macroOverlays?.length ? req.macroOverlays.map((series) => {
    const last = series.points[series.points.length - 1];
    return `- ${series.label}: ${last ? `${last.value} ${series.unit}` : "n/a"} (${series.sourceName})`;
  }).join("\n") : "- no active macro overlays";
  return `
Symbol: ${req.symbol}
Range: ${req.range}
Question: ${req.question ?? "Analyze the current setup and explain the best decision."}
Snapshot captured: ${req.snapshotDataUrl ? "yes" : "no"}

Signal:
- Decision: ${e.decision}
- Setup: ${e.setupType}
- Regime: ${e.regime}
- Confidence: ${e.confidence}/100
- Reason: ${e.reason}
- No-trade reasons: ${e.noTradeReasons.join("; ") || "none"}

Risk plan:
- Direction: ${e.risk.direction}
- Entry: ${e.risk.entry}
- Stop: ${e.risk.stop}
- Target 1: ${e.risk.target1}
- Target 2: ${e.risk.target2}
- R/R target 1: ${e.risk.rewardRisk1}
- Position size: ${e.risk.positionSize}
- Max loss: ${e.risk.maxDollarLoss}

Analytics:
- Last close: ${e.analytics.lastClose}
- Change: ${e.analytics.changePercent}%
- SMA20: ${e.analytics.sma20 ?? "n/a"}
- SMA50: ${e.analytics.sma50 ?? "n/a"}
- ATR14: ${e.analytics.atr14 ?? "n/a"} (${e.analytics.atrPercent ?? "n/a"}%)
- Volume ratio: ${e.analytics.volumeRatio ?? "n/a"}
- Support: ${e.analytics.support ?? "n/a"}
- Resistance: ${e.analytics.resistance ?? "n/a"}

Backtest summary:
- Strategy: ${e.backtest.strategyName} ${e.backtest.strategyVersion}
- Trades: ${e.backtest.totalTrades}
- Win rate: ${e.backtest.winRate}%
- Expectancy: ${e.backtest.expectancy}R
- Profit factor: ${e.backtest.profitFactor}
- Max drawdown: ${e.backtest.maxDrawdown}R

Components:
${components}

Earnings context:
${earnings}

Valuation context:
${valuation}

Macro overlays active on chart:
${macro}

Recent scraped news:
${news || "- none"}
`.trim();
}
function deterministicFallback(req, error) {
  const e = req.evaluation;
  const lines = [
    `### Quant memo: ${e.decision.replaceAll("-", " ")}`,
    ``,
    `- **Setup:** ${e.setupType.replaceAll("-", " ")}`,
    `- **Regime:** ${e.regime.replaceAll("-", " ")}`,
    `- **Confidence:** ${e.confidence}/100`,
    `- **Risk plan:** entry \`${e.risk.entry}\`, stop \`${e.risk.stop}\`, target 1 \`${e.risk.target1}\`, target 2 \`${e.risk.target2}\``,
    `- **Position:** ${e.risk.positionSize} units, max loss \`${e.risk.maxDollarLoss}\`, target 1 reward \`${e.risk.rewardRisk1}R\``
  ];
  if (e.noTradeReasons.length) {
    lines.push(`- **Primary blocker:** ${e.noTradeReasons[0]}`);
  } else {
    lines.push(`- **Action:** ${e.reason}`);
  }
  const strongest = [...e.components].sort((a, b) => b.score - a.score)[0];
  const weakest = [...e.components].sort((a, b) => a.score - b.score)[0];
  if (strongest) lines.push(`- **Best evidence:** ${strongest.name} - ${strongest.explanation}`);
  if (weakest && weakest.score < 0) lines.push(`- **Risk evidence:** ${weakest.name} - ${weakest.explanation}`);
  if (error) lines.push(`
_Local LLM note: ${error}_`);
  return {
    ok: false,
    source: "deterministic-fallback",
    answer: lines.join("\n"),
    generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
    error
  };
}
async function analyzeQuant(req) {
  const settings = getLlmSettings();
  if (!settings.enabled) {
    return deterministicFallback(
      req,
      "Local LLM is disabled. Enable it in onboarding or set QUANT_LLM_ENABLED=1 and QUANT_LLM_BASE_URL to use an OpenAI-compatible local server."
    );
  }
  try {
    if (!await isReady(settings.baseUrl)) {
      return deterministicFallback(req, "Local LLM server is not ready.");
    }
    const prompt = compactRequest(req);
    const res = await fetch(`${settings.baseUrl}/v1/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: AbortSignal.timeout(28e3),
      body: JSON.stringify({
        model: settings.model,
        temperature: 0.2,
        max_tokens: 700,
        messages: [
          {
            role: "system",
            content: "You are QuantDesk, a strict personal quant trading assistant for the Quant app. Think like a senior quant trader and risk manager. Explain signals in disciplined trading language. Separate setup, evidence, invalidation, risk, and action. Do not give certainty, do not hype, do not recommend oversized trades, and do not ignore no-trade blockers. Return concise GitHub-flavored Markdown with headings, bullets, bold labels, and inline code for exact prices."
          },
          {
            role: "user",
            content: req.thinkingMode ? `Use thinking mode internally, then provide only the concise final decision memo.

${prompt}` : prompt
          }
        ]
      })
    });
    if (!res.ok) throw new Error(`LLM HTTP ${res.status}`);
    const json = await res.json();
    const answer = json.choices?.[0]?.message?.content?.trim();
    if (!answer) throw new Error("LLM returned an empty answer");
    return {
      ok: true,
      source: "local-llm",
      model: settings.model,
      answer,
      generatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Local LLM request failed.";
    return deterministicFallback(req, message);
  }
}

// src/main/services/quotes.ts
var QUOTE_TTL_MS = 45e3;
var limit4 = pLimit(4);
async function fetchQuote(symbol) {
  const result = await fetchYahooChart(symbol, "1d", "5m", QUOTE_TTL_MS);
  const meta = result.meta ?? {};
  const price = typeof meta.regularMarketPrice === "number" && Number.isFinite(meta.regularMarketPrice) ? meta.regularMarketPrice : null;
  const prevRaw = meta.chartPreviousClose ?? meta.previousClose;
  const previousClose = typeof prevRaw === "number" && Number.isFinite(prevRaw) ? prevRaw : null;
  let change = null;
  let changePercent = null;
  if (price !== null && previousClose !== null) {
    change = round2(price - previousClose);
    changePercent = previousClose !== 0 ? round2(change / previousClose * 100) : null;
  }
  return {
    symbol,
    price,
    change,
    changePercent,
    previousClose,
    currency: typeof meta.currency === "string" && meta.currency ? meta.currency : "USD",
    marketState: typeof meta.marketState === "string" && meta.marketState ? meta.marketState : void 0,
    updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
    source: "live"
  };
}
async function getQuotes(symbols) {
  return Promise.all(
    symbols.map(
      (symbol) => limit4(() => fetchQuote(symbol)).catch(() => sampleQuote(symbol))
    )
  );
}

// src/main/services/valuation.ts
var TTL_MS = 6 * 60 * 6e4;
var cache3 = new TtlCache(300);
function round(value, digits = 2) {
  if (value === null || !Number.isFinite(value)) return null;
  const scale = 10 ** digits;
  return Math.round(value * scale) / scale;
}
function pct(fairValue, price) {
  if (fairValue === null || price === null || price === 0) return null;
  return round((fairValue - price) / price * 100, 1);
}
function estimate(label, fairValue, price, formula) {
  return {
    label,
    fairValue: round(fairValue),
    upsidePercent: pct(fairValue, price),
    formula
  };
}
function sampleValuation(symbol) {
  const sym = symbol.toUpperCase();
  const price = basePriceFor(sym);
  const revenue = price * 1e9;
  const margin = 0.18;
  const shares = 1e9;
  const netIncome = revenue * margin;
  const fairEarnings = netIncome * 24 / shares;
  const fairSales = revenue * 5 / shares;
  return {
    symbol: sym,
    companyName: lookupName(sym) ?? sym,
    price,
    marketCap: price * shares,
    enterpriseValue: price * shares * 1.05,
    totalRevenue: revenue,
    grossProfit: revenue * 0.52,
    ebitda: revenue * 0.25,
    netIncomeToCommon: netIncome,
    profitMargin: margin,
    revenueGrowth: 0.08,
    trailingPe: 24,
    forwardPe: 21,
    priceToSales: 5,
    priceToBook: 7,
    enterpriseToRevenue: 5.2,
    enterpriseToEbitda: 18,
    forwardEps: price / 21,
    targetMeanPrice: price * 1.08,
    sharesOutstanding: shares,
    estimates: [
      estimate("Forward earnings value", fairEarnings, price, "net income x 24 P/E / shares outstanding"),
      estimate("Sales multiple value", fairSales, price, "revenue x 5 P/S / shares outstanding"),
      estimate("Analyst target value", price * 1.08, price, "Yahoo analyst mean target price")
    ],
    source: "sample"
  };
}
async function getValuation(symbol) {
  const sym = symbol.toUpperCase();
  const cached = cache3.get(sym);
  if (cached) return cached;
  try {
    const summary = await quoteSummary(sym, [
      "price",
      "summaryDetail",
      "defaultKeyStatistics",
      "financialData"
    ]);
    const price = rawNumber(summary.price?.regularMarketPrice) ?? rawNumber(summary.financialData?.targetMeanPrice) ?? null;
    const marketCap = rawNumber(summary.price?.marketCap);
    const shares = rawNumber(summary.defaultKeyStatistics?.sharesOutstanding);
    const revenue = rawNumber(summary.financialData?.totalRevenue);
    const netIncome = rawNumber(summary.financialData?.netIncomeToCommon);
    const priceToSales = rawNumber(summary.summaryDetail?.priceToSalesTrailing12Months);
    const trailingPe = rawNumber(summary.summaryDetail?.trailingPE);
    const targetMean = rawNumber(summary.financialData?.targetMeanPrice);
    const fairForwardEarnings = netIncome !== null && shares !== null && trailingPe !== null && shares > 0 ? netIncome * trailingPe / shares : null;
    const fairSales = revenue !== null && shares !== null && priceToSales !== null && shares > 0 ? revenue * priceToSales / shares : null;
    const snapshot = {
      symbol: sym,
      companyName: summary.price?.longName || summary.price?.shortName || lookupName(sym) || sym,
      price: round(price),
      marketCap: round(marketCap, 0),
      enterpriseValue: round(rawNumber(summary.defaultKeyStatistics?.enterpriseValue), 0),
      totalRevenue: round(revenue, 0),
      grossProfit: round(rawNumber(summary.financialData?.grossProfits), 0),
      ebitda: round(rawNumber(summary.financialData?.ebitda), 0),
      netIncomeToCommon: round(netIncome, 0),
      profitMargin: round(rawNumber(summary.financialData?.profitMargins), 4),
      revenueGrowth: round(rawNumber(summary.financialData?.revenueGrowth), 4),
      trailingPe: round(trailingPe),
      forwardPe: round(rawNumber(summary.summaryDetail?.forwardPE)),
      priceToSales: round(priceToSales),
      priceToBook: round(rawNumber(summary.summaryDetail?.priceToBook)),
      enterpriseToRevenue: round(rawNumber(summary.defaultKeyStatistics?.enterpriseToRevenue)),
      enterpriseToEbitda: round(rawNumber(summary.defaultKeyStatistics?.enterpriseToEbitda)),
      forwardEps: round(rawNumber(summary.defaultKeyStatistics?.forwardEps)),
      targetMeanPrice: round(targetMean),
      sharesOutstanding: round(shares, 0),
      estimates: [
        estimate("Forward earnings value", fairForwardEarnings, price, "net income x trailing P/E / shares outstanding"),
        estimate("Sales multiple value", fairSales, price, "revenue x trailing P/S / shares outstanding"),
        estimate("Analyst target value", targetMean, price, "Yahoo analyst mean target price")
      ],
      source: "live"
    };
    cache3.set(sym, snapshot, TTL_MS);
    return snapshot;
  } catch {
    const sample = sampleValuation(sym);
    cache3.set(sym, sample, 10 * 6e4);
    return sample;
  }
}

// src/main/services/symbols.ts
var MAX_RESULTS = 8;
function mapQuoteType(quoteType) {
  const t = (quoteType ?? "").toUpperCase();
  if (t === "ETF") return "etf";
  if (t === "EQUITY") return "stock";
  return null;
}
function searchDirectory(query) {
  const q = query.trim().toUpperCase();
  if (!q) return [];
  const qLower = query.trim().toLowerCase();
  const dir = getSymbolDirectory();
  const scored = dir.map((entry) => {
    let score = -1;
    if (entry.symbol === q) score = 3;
    else if (entry.symbol.startsWith(q)) score = 2;
    else if (entry.name.toLowerCase().includes(qLower)) score = 1;
    return { entry, score };
  }).filter((s) => s.score > 0).sort((a, b) => b.score - a.score || a.entry.symbol.localeCompare(b.entry.symbol));
  return scored.slice(0, MAX_RESULTS).map(({ entry }) => ({
    symbol: entry.symbol,
    name: entry.name,
    type: entry.type,
    exchange: entry.exchange
  }));
}
async function searchSymbols(query) {
  const q = query.trim().slice(0, 48);
  if (!q) return [];
  try {
    const quotes = await searchYahoo(q);
    const out = [];
    for (const quote of quotes) {
      const type = mapQuoteType(quote.quoteType);
      if (!type) continue;
      const symbol = typeof quote.symbol === "string" ? quote.symbol.toUpperCase() : "";
      if (!symbol || out.some((s) => s.symbol === symbol)) continue;
      out.push({
        symbol,
        name: quote.longname || quote.shortname || symbol,
        type,
        exchange: quote.exchDisp || void 0
      });
      if (out.length >= MAX_RESULTS) break;
    }
    return out.length > 0 ? out : searchDirectory(q);
  } catch {
    return searchDirectory(q);
  }
}

// src/main/services/watchlistStore.ts
var import_electron3 = require("electron");
var import_node_fs4 = __toESM(require("node:fs"));
var import_node_path4 = __toESM(require("node:path"));
var SEED = [
  { symbol: "SPY", name: "SPDR S&P 500 ETF Trust", type: "etf" },
  { symbol: "QQQ", name: "Invesco QQQ Trust", type: "etf" },
  { symbol: "SMH", name: "VanEck Semiconductor ETF", type: "etf" },
  { symbol: "AAPL", name: "Apple Inc.", type: "stock" },
  { symbol: "NVDA", name: "NVIDIA Corporation", type: "stock" },
  { symbol: "TSLA", name: "Tesla, Inc.", type: "stock" }
];
var items = null;
function storePath3() {
  return import_node_path4.default.join(import_electron3.app.getPath("userData"), "watchlist.json");
}
function seedItems() {
  const addedAt = (/* @__PURE__ */ new Date()).toISOString();
  return SEED.map((s) => ({ ...s, addedAt }));
}
function isValidItem(value) {
  if (!value || typeof value !== "object") return false;
  const item = value;
  return typeof item.symbol === "string" && normalizeSymbol(item.symbol) !== null && typeof item.name === "string" && item.name.length > 0 && (item.type === "etf" || item.type === "stock") && typeof item.addedAt === "string";
}
function save(list) {
  try {
    const file = storePath3();
    import_node_fs4.default.mkdirSync(import_node_path4.default.dirname(file), { recursive: true });
    import_node_fs4.default.writeFileSync(file, JSON.stringify(list, null, 2), "utf8");
  } catch (err) {
    console.error("[watchlist] failed to persist:", err);
  }
}
function load() {
  if (items) return items;
  try {
    const raw = import_node_fs4.default.readFileSync(storePath3(), "utf8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      const valid = parsed.filter(isValidItem).map((item) => ({
        ...item,
        symbol: item.symbol.toUpperCase()
      }));
      if (valid.length > 0 || parsed.length === 0) {
        items = valid;
        return items;
      }
    }
    throw new Error("unrecognized watchlist file shape");
  } catch (err) {
    const code = err.code;
    if (code !== "ENOENT") console.error("[watchlist] reseeding after load error:", err);
    items = seedItems();
    save(items);
    return items;
  }
}
function getWatchlist() {
  return [...load()];
}
function removeFromWatchlist(symbol) {
  const sym = symbol.toUpperCase();
  const list = load().filter((item) => item.symbol !== sym);
  items = list;
  save(list);
  return [...list];
}
async function resolveSymbol(symbol) {
  try {
    const suggestions = await searchSymbols(symbol);
    const exact = suggestions.find((s) => s.symbol.toUpperCase() === symbol);
    if (exact) return { name: exact.name, type: exact.type };
  } catch {
  }
  const entry = directoryLookup(symbol);
  if (entry) return { name: entry.name, type: entry.type };
  return null;
}
async function addToWatchlist(rawSymbol) {
  const symbol = normalizeSymbol(rawSymbol);
  if (!symbol) return { ok: false, error: "Invalid symbol" };
  const list = load();
  if (list.some((item2) => item2.symbol === symbol)) {
    return { ok: false, error: "Already in watchlist" };
  }
  const resolved = await resolveSymbol(symbol);
  if (!resolved) return { ok: false, error: "Symbol not found" };
  const item = {
    symbol,
    name: resolved.name,
    type: resolved.type,
    addedAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  const next = [...list, item];
  items = next;
  save(next);
  return { ok: true, item, watchlist: [...next] };
}

// src/main/main.ts
var MAX_QUOTE_SYMBOLS = 60;
var MAX_NEWS_SYMBOLS = 40;
var MAX_EARNINGS_SYMBOLS = 60;
var MAX_PIVOTS2 = 12;
var isSmoke = process.argv.includes("--smoke");
var forceOnboarding = process.argv.includes("--onboarding") || process.argv.includes("--smoke-onboarding");
var smokeModalArg = process.argv.find((arg) => arg.startsWith("--smoke-modal="));
var smokeModalSymbol = smokeModalArg ? normalizeSymbol(smokeModalArg.slice("--smoke-modal=".length)) : null;
var smokeRailArg = process.argv.find((arg) => arg.startsWith("--smoke-rail="));
var smokeRail = smokeRailArg?.slice("--smoke-rail=".length);
var smokeOverlaysArg = process.argv.find((arg) => arg.startsWith("--smoke-overlays="));
var smokeOverlays = smokeOverlaysArg?.slice("--smoke-overlays=".length);
var smokeTabArg = process.argv.find((arg) => arg.startsWith("--smoke-tab="));
var smokeTab = smokeTabArg?.slice("--smoke-tab=".length);
var smokeChartModeArg = process.argv.find((arg) => arg.startsWith("--smoke-chart-mode="));
var smokeChartMode = smokeChartModeArg?.slice("--smoke-chart-mode=".length);
function cleanPivots(raw) {
  if (!Array.isArray(raw)) return [];
  const out = [];
  for (const entry of raw) {
    if (!entry || typeof entry !== "object") continue;
    const p = entry;
    if (typeof p.time !== "number" || !Number.isFinite(p.time)) continue;
    if (typeof p.price !== "number" || !Number.isFinite(p.price)) continue;
    if (p.kind !== "high" && p.kind !== "low") continue;
    out.push({ time: p.time, price: p.price, kind: p.kind });
    if (out.length >= MAX_PIVOTS2) break;
  }
  return out;
}
function cleanRange(raw) {
  return CHART_RANGES.includes(raw) ? raw : "6m";
}
function cleanMacroOverlayKey(raw) {
  return raw === "jobs" || raw === "unemployment" || raw === "inflation" || raw === "treasury10y" || raw === "oil" || raw === "vix" ? raw : "jobs";
}
function cleanQuantInsightRequest(raw) {
  if (!raw || typeof raw !== "object") return null;
  const r = raw;
  const symbol = normalizeSymbol(r.symbol);
  if (!symbol) return null;
  if (!r.evaluation || typeof r.evaluation !== "object") return null;
  return {
    symbol,
    range: cleanRange(r.range),
    evaluation: r.evaluation,
    news: Array.isArray(r.news) ? r.news.slice(0, 12) : [],
    earnings: r.earnings && typeof r.earnings === "object" ? r.earnings : null,
    valuation: r.valuation && typeof r.valuation === "object" ? r.valuation : null,
    macroOverlays: Array.isArray(r.macroOverlays) ? r.macroOverlays.slice(0, 8).map((series) => ({
      ...series,
      points: Array.isArray(series.points) ? series.points.slice(-60) : []
    })) : [],
    snapshotDataUrl: typeof r.snapshotDataUrl === "string" ? r.snapshotDataUrl.slice(0, 1e6) : void 0,
    question: typeof r.question === "string" ? r.question.slice(0, 1200) : void 0,
    thinkingMode: r.thinkingMode === true
  };
}
function registerIpcHandlers() {
  import_electron4.ipcMain.handle(IPC.watchlistGet, () => {
    try {
      return getWatchlist();
    } catch {
      return [];
    }
  });
  import_electron4.ipcMain.handle(IPC.watchlistAdd, async (_e, rawSymbol) => {
    try {
      if (typeof rawSymbol !== "string") return { ok: false, error: "Invalid symbol" };
      return await addToWatchlist(rawSymbol);
    } catch {
      return { ok: false, error: "Could not add symbol" };
    }
  });
  import_electron4.ipcMain.handle(IPC.watchlistRemove, (_e, rawSymbol) => {
    try {
      const symbol = normalizeSymbol(rawSymbol);
      return symbol ? removeFromWatchlist(symbol) : getWatchlist();
    } catch {
      return [];
    }
  });
  import_electron4.ipcMain.handle(IPC.symbolsSearch, async (_e, rawQuery) => {
    try {
      if (typeof rawQuery !== "string") return [];
      return await searchSymbols(rawQuery);
    } catch {
      return [];
    }
  });
  import_electron4.ipcMain.handle(IPC.quotesGet, async (_e, rawSymbols) => {
    const symbols = cleanSymbolList(rawSymbols, MAX_QUOTE_SYMBOLS);
    try {
      return await getQuotes(symbols);
    } catch {
      return symbols.map((s) => sampleQuote(s));
    }
  });
  import_electron4.ipcMain.handle(IPC.holdingsGet, async (_e, rawSymbol) => {
    const symbol = normalizeSymbol(rawSymbol);
    if (!symbol) {
      return { etfSymbol: "", asOf: todayYmd(), holdings: [], source: "sample" };
    }
    try {
      return await getHoldings(symbol);
    } catch {
      return { etfSymbol: symbol, asOf: todayYmd(), holdings: [], source: "sample" };
    }
  });
  import_electron4.ipcMain.handle(IPC.newsGet, async (_e, rawSymbols, rawLimit) => {
    const symbols = cleanSymbolList(rawSymbols, MAX_NEWS_SYMBOLS);
    const limitPerSymbol = clampInt(rawLimit, 1, 20, 6);
    try {
      return await getNews(symbols, limitPerSymbol);
    } catch {
      return sampleNews(symbols);
    }
  });
  import_electron4.ipcMain.handle(IPC.earningsGet, async (_e, rawSymbols) => {
    const symbols = cleanSymbolList(rawSymbols, MAX_EARNINGS_SYMBOLS);
    try {
      return await getEarnings(symbols);
    } catch {
      return symbols.map((s) => sampleEarnings(s));
    }
  });
  import_electron4.ipcMain.handle(IPC.chartGet, async (_e, rawSymbol, rawRange) => {
    const symbol = normalizeSymbol(rawSymbol) ?? "SPY";
    const range = cleanRange(rawRange);
    try {
      return await getChart(symbol, range);
    } catch {
      return sampleChart(symbol, range);
    }
  });
  import_electron4.ipcMain.handle(IPC.pivotNewsGet, async (_e, rawSymbol, rawPivots) => {
    const pivots = cleanPivots(rawPivots);
    const symbol = normalizeSymbol(rawSymbol);
    if (!symbol) return pivots.map((pivot) => ({ pivot, items: [] }));
    try {
      return await getPivotNews(symbol, pivots);
    } catch {
      return pivots.map((pivot) => ({ pivot, items: [] }));
    }
  });
  import_electron4.ipcMain.handle(IPC.macroOverlayGet, async (_e, rawKey, rawRange) => {
    const key = cleanMacroOverlayKey(rawKey);
    const range = cleanRange(rawRange);
    return getMacroOverlay(key, range);
  });
  import_electron4.ipcMain.handle(IPC.chartSnapshotCapture, async () => {
    if (!mainWindow || mainWindow.isDestroyed()) return null;
    try {
      const image = await mainWindow.webContents.capturePage();
      return {
        dataUrl: image.toDataURL(),
        capturedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
    } catch {
      return null;
    }
  });
  import_electron4.ipcMain.handle(IPC.quantAnalyze, async (_e, rawRequest) => {
    const request = cleanQuantInsightRequest(rawRequest);
    if (!request) {
      return {
        ok: false,
        source: "deterministic-fallback",
        answer: "Quant analysis could not run because the request payload was invalid.",
        generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
        error: "Invalid request"
      };
    }
    const response = await analyzeQuant(request);
    try {
      saveQuantInsight(request, response);
    } catch (err) {
      console.error("[quant] save insight failed:", err);
    }
    return response;
  });
  import_electron4.ipcMain.handle(IPC.quantInsightsGet, async (_e, rawSymbol, rawRange) => {
    const symbol = normalizeSymbol(rawSymbol);
    if (!symbol) return [];
    return getQuantInsights(symbol, CHART_RANGES.includes(rawRange) ? rawRange : void 0);
  });
  import_electron4.ipcMain.handle(IPC.llmSettingsGet, () => getLlmSettings());
  import_electron4.ipcMain.handle(IPC.llmSettingsSave, (_e, rawSettings) => {
    const s = rawSettings && typeof rawSettings === "object" ? rawSettings : {};
    return saveLlmSettings({
      enabled: s.enabled === true,
      baseUrl: typeof s.baseUrl === "string" ? s.baseUrl : void 0,
      model: typeof s.model === "string" ? s.model : void 0
    });
  });
  import_electron4.ipcMain.handle(IPC.valuationGet, async (_e, rawSymbol) => {
    const symbol = normalizeSymbol(rawSymbol);
    return getValuation(symbol ?? "SPY");
  });
  import_electron4.ipcMain.handle(IPC.openExternal, async (_e, rawUrl) => {
    if (typeof rawUrl !== "string") return;
    let parsed;
    try {
      parsed = new URL(rawUrl);
    } catch {
      return;
    }
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return;
    try {
      await import_electron4.shell.openExternal(parsed.toString());
    } catch (err) {
      console.error("[shell] openExternal failed:", err);
    }
  });
}
function armSmokeMode(win) {
  win.setIgnoreMouseEvents(true);
  win.setFocusable(false);
  win.webContents.on("console-message", (_event, _level, message) => {
    console.log("[renderer] " + message);
  });
  win.webContents.on("render-process-gone", (_event, details) => {
    console.error("[renderer] process gone: " + details.reason);
  });
  win.webContents.on("did-start-navigation", (_event, url, isInPlace, isMainFrame) => {
    if (isMainFrame && !isInPlace) console.log("[smoke] main-frame navigation: " + url);
  });
  const killer = setTimeout(() => {
    console.error("SMOKE_FAIL hard timeout after 45s");
    import_electron4.app.exit(1);
  }, 45e3);
  killer.unref();
  win.webContents.once("did-finish-load", () => {
    const envDelay = Number(process.env.QUANT_SMOKE_DELAY_MS);
    const delayMs = Number.isFinite(envDelay) && envDelay > 0 ? Math.min(envDelay, 4e4) : smokeModalSymbol ? 16e3 : 13e3;
    setTimeout(async () => {
      try {
        const image = await win.webContents.capturePage();
        const outPath = process.env.QUANT_SMOKE_OUT || import_node_path5.default.join(
          import_electron4.app.getAppPath(),
          smokeModalSymbol ? "dist/smoke-modal.png" : "dist/smoke.png"
        );
        import_node_fs5.default.mkdirSync(import_node_path5.default.dirname(outPath), { recursive: true });
        import_node_fs5.default.writeFileSync(outPath, image.toPNG());
        clearTimeout(killer);
        console.log("SMOKE_OK " + outPath);
        import_electron4.app.quit();
      } catch (err) {
        console.error("SMOKE_FAIL", err);
        process.exitCode = 1;
        import_electron4.app.quit();
      }
    }, delayMs);
  });
}
var mainWindow = null;
function createWindow() {
  const win = new import_electron4.BrowserWindow({
    width: 1560,
    height: 940,
    minWidth: 1200,
    minHeight: 760,
    backgroundColor: "#0a0e16",
    autoHideMenuBar: true,
    title: "Quant",
    webPreferences: {
      preload: import_node_path5.default.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });
  mainWindow = win;
  win.on("closed", () => {
    if (mainWindow === win) mainWindow = null;
  });
  win.webContents.setWindowOpenHandler(() => ({ action: "deny" }));
  win.webContents.on("will-navigate", (event) => event.preventDefault());
  if (isSmoke) armSmokeMode(win);
  const indexPath = import_node_path5.default.join(__dirname, "../renderer/index.html");
  const query = {};
  if (smokeModalSymbol) query.smokeModal = smokeModalSymbol;
  if (smokeRail) query.smokeRail = smokeRail;
  if (smokeOverlays) query.smokeOverlays = smokeOverlays;
  if (smokeTab === "analysis" || smokeTab === "news") query.smokeTab = smokeTab;
  if (smokeChartMode === "grid" || smokeChartMode === "single") {
    query.smokeChartMode = smokeChartMode;
  }
  if (forceOnboarding) query.onboarding = "1";
  if (Object.keys(query).length) {
    void win.loadFile(indexPath, { query });
  } else {
    void win.loadFile(indexPath);
  }
}
var gotLock = import_electron4.app.requestSingleInstanceLock();
if (!gotLock) {
  import_electron4.app.quit();
} else {
  import_electron4.app.on("second-instance", () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
  process.on("unhandledRejection", (reason) => {
    console.error("[main] unhandled rejection:", reason);
  });
  import_electron4.app.whenReady().then(() => {
    registerIpcHandlers();
    createWindow();
    import_electron4.app.on("activate", () => {
      if (import_electron4.BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  });
  import_electron4.app.on("window-all-closed", () => {
    import_electron4.app.quit();
  });
}
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vbm9kZV9tb2R1bGVzL2Zhc3QteG1sLXBhcnNlci9zcmMvdXRpbC5qcyIsICIuLi8uLi9ub2RlX21vZHVsZXMvZmFzdC14bWwtcGFyc2VyL3NyYy92YWxpZGF0b3IuanMiLCAiLi4vLi4vbm9kZV9tb2R1bGVzL2Zhc3QteG1sLXBhcnNlci9zcmMveG1scGFyc2VyL09wdGlvbnNCdWlsZGVyLmpzIiwgIi4uLy4uL25vZGVfbW9kdWxlcy9mYXN0LXhtbC1wYXJzZXIvc3JjL3htbHBhcnNlci94bWxOb2RlLmpzIiwgIi4uLy4uL25vZGVfbW9kdWxlcy9mYXN0LXhtbC1wYXJzZXIvc3JjL3htbHBhcnNlci9Eb2NUeXBlUmVhZGVyLmpzIiwgIi4uLy4uL25vZGVfbW9kdWxlcy9zdHJudW0vc3RybnVtLmpzIiwgIi4uLy4uL25vZGVfbW9kdWxlcy9mYXN0LXhtbC1wYXJzZXIvc3JjL2lnbm9yZUF0dHJpYnV0ZXMuanMiLCAiLi4vLi4vbm9kZV9tb2R1bGVzL2Zhc3QteG1sLXBhcnNlci9zcmMveG1scGFyc2VyL09yZGVyZWRPYmpQYXJzZXIuanMiLCAiLi4vLi4vbm9kZV9tb2R1bGVzL2Zhc3QteG1sLXBhcnNlci9zcmMveG1scGFyc2VyL25vZGUyanNvbi5qcyIsICIuLi8uLi9ub2RlX21vZHVsZXMvZmFzdC14bWwtcGFyc2VyL3NyYy94bWxwYXJzZXIvWE1MUGFyc2VyLmpzIiwgIi4uLy4uL25vZGVfbW9kdWxlcy9mYXN0LXhtbC1wYXJzZXIvc3JjL3htbGJ1aWxkZXIvb3JkZXJlZEpzMlhtbC5qcyIsICIuLi8uLi9ub2RlX21vZHVsZXMvZmFzdC14bWwtcGFyc2VyL3NyYy94bWxidWlsZGVyL2pzb24yeG1sLmpzIiwgIi4uLy4uL25vZGVfbW9kdWxlcy9mYXN0LXhtbC1wYXJzZXIvc3JjL2Z4cC5qcyIsICIuLi8uLi9zcmMvbWFpbi9tYWluLnRzIiwgIi4uLy4uL3NyYy9zaGFyZWQvaXBjLnRzIiwgIi4uLy4uL3NyYy9zaGFyZWQvdHlwZXMudHMiLCAiLi4vLi4vc3JjL21haW4vc2VydmljZXMvZGF0YUZpbGVzLnRzIiwgIi4uLy4uL3NyYy9tYWluL3NlcnZpY2VzL3V0aWwudHMiLCAiLi4vLi4vc3JjL21haW4vc2VydmljZXMvc2FtcGxlLnRzIiwgIi4uLy4uL3NyYy9tYWluL3NlcnZpY2VzL2NhY2hlLnRzIiwgIi4uLy4uL3NyYy9tYWluL3NlcnZpY2VzL2h0dHAudHMiLCAiLi4vLi4vc3JjL21haW4vc2VydmljZXMveWFob28udHMiLCAiLi4vLi4vc3JjL21haW4vc2VydmljZXMvY2hhcnQudHMiLCAiLi4vLi4vc3JjL21haW4vc2VydmljZXMvZWFybmluZ3MudHMiLCAiLi4vLi4vc3JjL21haW4vc2VydmljZXMvaG9sZGluZ3MudHMiLCAiLi4vLi4vc3JjL21haW4vc2VydmljZXMvbGxtU2V0dGluZ3MudHMiLCAiLi4vLi4vc3JjL21haW4vc2VydmljZXMvbWFjcm8udHMiLCAiLi4vLi4vc3JjL21haW4vc2VydmljZXMvaW5zaWdodFN0b3JlLnRzIiwgIi4uLy4uL3NyYy9tYWluL3NlcnZpY2VzL3Jzcy50cyIsICIuLi8uLi9zcmMvbWFpbi9zZXJ2aWNlcy9nb29nbGVOZXdzLnRzIiwgIi4uLy4uL3NyYy9tYWluL3NlcnZpY2VzL25ld3MudHMiLCAiLi4vLi4vc3JjL21haW4vc2VydmljZXMvcGl2b3ROZXdzLnRzIiwgIi4uLy4uL3NyYy9tYWluL3NlcnZpY2VzL3F1YW50QWkudHMiLCAiLi4vLi4vc3JjL21haW4vc2VydmljZXMvcXVvdGVzLnRzIiwgIi4uLy4uL3NyYy9tYWluL3NlcnZpY2VzL3ZhbHVhdGlvbi50cyIsICIuLi8uLi9zcmMvbWFpbi9zZXJ2aWNlcy9zeW1ib2xzLnRzIiwgIi4uLy4uL3NyYy9tYWluL3NlcnZpY2VzL3dhdGNobGlzdFN0b3JlLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyIndXNlIHN0cmljdCc7XG5cbmNvbnN0IG5hbWVTdGFydENoYXIgPSAnOkEtWmEtel9cXFxcdTAwQzAtXFxcXHUwMEQ2XFxcXHUwMEQ4LVxcXFx1MDBGNlxcXFx1MDBGOC1cXFxcdTAyRkZcXFxcdTAzNzAtXFxcXHUwMzdEXFxcXHUwMzdGLVxcXFx1MUZGRlxcXFx1MjAwQy1cXFxcdTIwMERcXFxcdTIwNzAtXFxcXHUyMThGXFxcXHUyQzAwLVxcXFx1MkZFRlxcXFx1MzAwMS1cXFxcdUQ3RkZcXFxcdUY5MDAtXFxcXHVGRENGXFxcXHVGREYwLVxcXFx1RkZGRCc7XG5jb25zdCBuYW1lQ2hhciA9IG5hbWVTdGFydENoYXIgKyAnXFxcXC0uXFxcXGRcXFxcdTAwQjdcXFxcdTAzMDAtXFxcXHUwMzZGXFxcXHUyMDNGLVxcXFx1MjA0MCc7XG5jb25zdCBuYW1lUmVnZXhwID0gJ1snICsgbmFtZVN0YXJ0Q2hhciArICddWycgKyBuYW1lQ2hhciArICddKidcbmNvbnN0IHJlZ2V4TmFtZSA9IG5ldyBSZWdFeHAoJ14nICsgbmFtZVJlZ2V4cCArICckJyk7XG5cbmNvbnN0IGdldEFsbE1hdGNoZXMgPSBmdW5jdGlvbiAoc3RyaW5nLCByZWdleCkge1xuICBjb25zdCBtYXRjaGVzID0gW107XG4gIGxldCBtYXRjaCA9IHJlZ2V4LmV4ZWMoc3RyaW5nKTtcbiAgd2hpbGUgKG1hdGNoKSB7XG4gICAgY29uc3QgYWxsbWF0Y2hlcyA9IFtdO1xuICAgIGFsbG1hdGNoZXMuc3RhcnRJbmRleCA9IHJlZ2V4Lmxhc3RJbmRleCAtIG1hdGNoWzBdLmxlbmd0aDtcbiAgICBjb25zdCBsZW4gPSBtYXRjaC5sZW5ndGg7XG4gICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IGxlbjsgaW5kZXgrKykge1xuICAgICAgYWxsbWF0Y2hlcy5wdXNoKG1hdGNoW2luZGV4XSk7XG4gICAgfVxuICAgIG1hdGNoZXMucHVzaChhbGxtYXRjaGVzKTtcbiAgICBtYXRjaCA9IHJlZ2V4LmV4ZWMoc3RyaW5nKTtcbiAgfVxuICByZXR1cm4gbWF0Y2hlcztcbn07XG5cbmNvbnN0IGlzTmFtZSA9IGZ1bmN0aW9uIChzdHJpbmcpIHtcbiAgY29uc3QgbWF0Y2ggPSByZWdleE5hbWUuZXhlYyhzdHJpbmcpO1xuICByZXR1cm4gIShtYXRjaCA9PT0gbnVsbCB8fCB0eXBlb2YgbWF0Y2ggPT09ICd1bmRlZmluZWQnKTtcbn07XG5cbmV4cG9ydHMuaXNFeGlzdCA9IGZ1bmN0aW9uICh2KSB7XG4gIHJldHVybiB0eXBlb2YgdiAhPT0gJ3VuZGVmaW5lZCc7XG59O1xuXG5leHBvcnRzLmlzRW1wdHlPYmplY3QgPSBmdW5jdGlvbiAob2JqKSB7XG4gIHJldHVybiBPYmplY3Qua2V5cyhvYmopLmxlbmd0aCA9PT0gMDtcbn07XG5cbi8qKlxuICogQ29weSBhbGwgdGhlIHByb3BlcnRpZXMgb2YgYSBpbnRvIGIuXG4gKiBAcGFyYW0geyp9IHRhcmdldFxuICogQHBhcmFtIHsqfSBhXG4gKi9cbmV4cG9ydHMubWVyZ2UgPSBmdW5jdGlvbiAodGFyZ2V0LCBhLCBhcnJheU1vZGUpIHtcbiAgaWYgKGEpIHtcbiAgICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXMoYSk7IC8vIHdpbGwgcmV0dXJuIGFuIGFycmF5IG9mIG93biBwcm9wZXJ0aWVzXG4gICAgY29uc3QgbGVuID0ga2V5cy5sZW5ndGg7IC8vZG9uJ3QgbWFrZSBpdCBpbmxpbmVcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBpZiAoYXJyYXlNb2RlID09PSAnc3RyaWN0Jykge1xuICAgICAgICB0YXJnZXRba2V5c1tpXV0gPSBbYVtrZXlzW2ldXV07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0YXJnZXRba2V5c1tpXV0gPSBhW2tleXNbaV1dO1xuICAgICAgfVxuICAgIH1cbiAgfVxufTtcbi8qIGV4cG9ydHMubWVyZ2UgPWZ1bmN0aW9uIChiLGEpe1xuICByZXR1cm4gT2JqZWN0LmFzc2lnbihiLGEpO1xufSAqL1xuXG5leHBvcnRzLmdldFZhbHVlID0gZnVuY3Rpb24gKHYpIHtcbiAgaWYgKGV4cG9ydHMuaXNFeGlzdCh2KSkge1xuICAgIHJldHVybiB2O1xuICB9IGVsc2Uge1xuICAgIHJldHVybiAnJztcbiAgfVxufTtcblxuLyoqXG4gKiBEYW5nZXJvdXMgcHJvcGVydHkgbmFtZXMgdGhhdCBjb3VsZCBsZWFkIHRvIHByb3RvdHlwZSBwb2xsdXRpb24gb3Igc2VjdXJpdHkgaXNzdWVzXG4gKi9cbmNvbnN0IERBTkdFUk9VU19QUk9QRVJUWV9OQU1FUyA9IFtcbiAgLy8gJ19fcHJvdG9fXycsXG4gIC8vICdjb25zdHJ1Y3RvcicsXG4gIC8vICdwcm90b3R5cGUnLFxuICAnaGFzT3duUHJvcGVydHknLFxuICAndG9TdHJpbmcnLFxuICAndmFsdWVPZicsXG4gICdfX2RlZmluZUdldHRlcl9fJyxcbiAgJ19fZGVmaW5lU2V0dGVyX18nLFxuICAnX19sb29rdXBHZXR0ZXJfXycsXG4gICdfX2xvb2t1cFNldHRlcl9fJ1xuXTtcblxuY29uc3QgY3JpdGljYWxQcm9wZXJ0aWVzID0gW1wiX19wcm90b19fXCIsIFwiY29uc3RydWN0b3JcIiwgXCJwcm90b3R5cGVcIl07XG5cbmV4cG9ydHMuaXNOYW1lID0gaXNOYW1lO1xuZXhwb3J0cy5nZXRBbGxNYXRjaGVzID0gZ2V0QWxsTWF0Y2hlcztcbmV4cG9ydHMubmFtZVJlZ2V4cCA9IG5hbWVSZWdleHA7XG5leHBvcnRzLkRBTkdFUk9VU19QUk9QRVJUWV9OQU1FUyA9IERBTkdFUk9VU19QUk9QRVJUWV9OQU1FUztcbmV4cG9ydHMuY3JpdGljYWxQcm9wZXJ0aWVzID0gY3JpdGljYWxQcm9wZXJ0aWVzO1xuIiwgIid1c2Ugc3RyaWN0JztcblxuY29uc3QgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpO1xuXG5jb25zdCBkZWZhdWx0T3B0aW9ucyA9IHtcbiAgYWxsb3dCb29sZWFuQXR0cmlidXRlczogZmFsc2UsIC8vQSB0YWcgY2FuIGhhdmUgYXR0cmlidXRlcyB3aXRob3V0IGFueSB2YWx1ZVxuICB1bnBhaXJlZFRhZ3M6IFtdXG59O1xuXG4vL2NvbnN0IHRhZ3NQYXR0ZXJuID0gbmV3IFJlZ0V4cChcIjxcXFxcLz8oW1xcXFx3OlxcXFwtX1xcLl0rKVxcXFxzKlxcLz8+XCIsXCJnXCIpO1xuZXhwb3J0cy52YWxpZGF0ZSA9IGZ1bmN0aW9uICh4bWxEYXRhLCBvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0T3B0aW9ucywgb3B0aW9ucyk7XG5cbiAgLy94bWxEYXRhID0geG1sRGF0YS5yZXBsYWNlKC8oXFxyXFxufFxcbnxcXHIpL2dtLFwiXCIpOy8vbWFrZSBpdCBzaW5nbGUgbGluZVxuICAvL3htbERhdGEgPSB4bWxEYXRhLnJlcGxhY2UoLyheXFxzKjxcXD94bWwuKj9cXD8+KS9nLFwiXCIpOy8vUmVtb3ZlIFhNTCBzdGFydGluZyB0YWdcbiAgLy94bWxEYXRhID0geG1sRGF0YS5yZXBsYWNlKC8oPCFET0NUWVBFW1xcc1xcd1xcXCJcXC5cXC9cXC1cXDpdKyhcXFsuKlxcXSkqXFxzKj4pL2csXCJcIik7Ly9SZW1vdmUgRE9DVFlQRVxuICBjb25zdCB0YWdzID0gW107XG4gIGxldCB0YWdGb3VuZCA9IGZhbHNlO1xuXG4gIC8vaW5kaWNhdGVzIHRoYXQgdGhlIHJvb3QgdGFnIGhhcyBiZWVuIGNsb3NlZCAoYWthLiBkZXB0aCAwIGhhcyBiZWVuIHJlYWNoZWQpXG4gIGxldCByZWFjaGVkUm9vdCA9IGZhbHNlO1xuXG4gIGlmICh4bWxEYXRhWzBdID09PSAnXFx1ZmVmZicpIHtcbiAgICAvLyBjaGVjayBmb3IgYnl0ZSBvcmRlciBtYXJrIChCT00pXG4gICAgeG1sRGF0YSA9IHhtbERhdGEuc3Vic3RyKDEpO1xuICB9XG4gIFxuICBmb3IgKGxldCBpID0gMDsgaSA8IHhtbERhdGEubGVuZ3RoOyBpKyspIHtcblxuICAgIGlmICh4bWxEYXRhW2ldID09PSAnPCcgJiYgeG1sRGF0YVtpKzFdID09PSAnPycpIHtcbiAgICAgIGkrPTI7XG4gICAgICBpID0gcmVhZFBJKHhtbERhdGEsaSk7XG4gICAgICBpZiAoaS5lcnIpIHJldHVybiBpO1xuICAgIH1lbHNlIGlmICh4bWxEYXRhW2ldID09PSAnPCcpIHtcbiAgICAgIC8vc3RhcnRpbmcgb2YgdGFnXG4gICAgICAvL3JlYWQgdW50aWwgeW91IHJlYWNoIHRvICc+JyBhdm9pZGluZyBhbnkgJz4nIGluIGF0dHJpYnV0ZSB2YWx1ZVxuICAgICAgbGV0IHRhZ1N0YXJ0UG9zID0gaTtcbiAgICAgIGkrKztcbiAgICAgIFxuICAgICAgaWYgKHhtbERhdGFbaV0gPT09ICchJykge1xuICAgICAgICBpID0gcmVhZENvbW1lbnRBbmRDREFUQSh4bWxEYXRhLCBpKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgY2xvc2luZ1RhZyA9IGZhbHNlO1xuICAgICAgICBpZiAoeG1sRGF0YVtpXSA9PT0gJy8nKSB7XG4gICAgICAgICAgLy9jbG9zaW5nIHRhZ1xuICAgICAgICAgIGNsb3NpbmdUYWcgPSB0cnVlO1xuICAgICAgICAgIGkrKztcbiAgICAgICAgfVxuICAgICAgICAvL3JlYWQgdGFnbmFtZVxuICAgICAgICBsZXQgdGFnTmFtZSA9ICcnO1xuICAgICAgICBmb3IgKDsgaSA8IHhtbERhdGEubGVuZ3RoICYmXG4gICAgICAgICAgeG1sRGF0YVtpXSAhPT0gJz4nICYmXG4gICAgICAgICAgeG1sRGF0YVtpXSAhPT0gJyAnICYmXG4gICAgICAgICAgeG1sRGF0YVtpXSAhPT0gJ1xcdCcgJiZcbiAgICAgICAgICB4bWxEYXRhW2ldICE9PSAnXFxuJyAmJlxuICAgICAgICAgIHhtbERhdGFbaV0gIT09ICdcXHInOyBpKytcbiAgICAgICAgKSB7XG4gICAgICAgICAgdGFnTmFtZSArPSB4bWxEYXRhW2ldO1xuICAgICAgICB9XG4gICAgICAgIHRhZ05hbWUgPSB0YWdOYW1lLnRyaW0oKTtcbiAgICAgICAgLy9jb25zb2xlLmxvZyh0YWdOYW1lKTtcblxuICAgICAgICBpZiAodGFnTmFtZVt0YWdOYW1lLmxlbmd0aCAtIDFdID09PSAnLycpIHtcbiAgICAgICAgICAvL3NlbGYgY2xvc2luZyB0YWcgd2l0aG91dCBhdHRyaWJ1dGVzXG4gICAgICAgICAgdGFnTmFtZSA9IHRhZ05hbWUuc3Vic3RyaW5nKDAsIHRhZ05hbWUubGVuZ3RoIC0gMSk7XG4gICAgICAgICAgLy9jb250aW51ZTtcbiAgICAgICAgICBpLS07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF2YWxpZGF0ZVRhZ05hbWUodGFnTmFtZSkpIHtcbiAgICAgICAgICBsZXQgbXNnO1xuICAgICAgICAgIGlmICh0YWdOYW1lLnRyaW0oKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIG1zZyA9IFwiSW52YWxpZCBzcGFjZSBhZnRlciAnPCcuXCI7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG1zZyA9IFwiVGFnICdcIit0YWdOYW1lK1wiJyBpcyBhbiBpbnZhbGlkIG5hbWUuXCI7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBnZXRFcnJvck9iamVjdCgnSW52YWxpZFRhZycsIG1zZywgZ2V0TGluZU51bWJlckZvclBvc2l0aW9uKHhtbERhdGEsIGkpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IHJlYWRBdHRyaWJ1dGVTdHIoeG1sRGF0YSwgaSk7XG4gICAgICAgIGlmIChyZXN1bHQgPT09IGZhbHNlKSB7XG4gICAgICAgICAgcmV0dXJuIGdldEVycm9yT2JqZWN0KCdJbnZhbGlkQXR0cicsIFwiQXR0cmlidXRlcyBmb3IgJ1wiK3RhZ05hbWUrXCInIGhhdmUgb3BlbiBxdW90ZS5cIiwgZ2V0TGluZU51bWJlckZvclBvc2l0aW9uKHhtbERhdGEsIGkpKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgYXR0clN0ciA9IHJlc3VsdC52YWx1ZTtcbiAgICAgICAgaSA9IHJlc3VsdC5pbmRleDtcblxuICAgICAgICBpZiAoYXR0clN0clthdHRyU3RyLmxlbmd0aCAtIDFdID09PSAnLycpIHtcbiAgICAgICAgICAvL3NlbGYgY2xvc2luZyB0YWdcbiAgICAgICAgICBjb25zdCBhdHRyU3RyU3RhcnQgPSBpIC0gYXR0clN0ci5sZW5ndGg7XG4gICAgICAgICAgYXR0clN0ciA9IGF0dHJTdHIuc3Vic3RyaW5nKDAsIGF0dHJTdHIubGVuZ3RoIC0gMSk7XG4gICAgICAgICAgY29uc3QgaXNWYWxpZCA9IHZhbGlkYXRlQXR0cmlidXRlU3RyaW5nKGF0dHJTdHIsIG9wdGlvbnMpO1xuICAgICAgICAgIGlmIChpc1ZhbGlkID09PSB0cnVlKSB7XG4gICAgICAgICAgICB0YWdGb3VuZCA9IHRydWU7XG4gICAgICAgICAgICAvL2NvbnRpbnVlOyAvL3RleHQgbWF5IHByZXNlbnRzIGFmdGVyIHNlbGYgY2xvc2luZyB0YWdcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy90aGUgcmVzdWx0IGZyb20gdGhlIG5lc3RlZCBmdW5jdGlvbiByZXR1cm5zIHRoZSBwb3NpdGlvbiBvZiB0aGUgZXJyb3Igd2l0aGluIHRoZSBhdHRyaWJ1dGVcbiAgICAgICAgICAgIC8vaW4gb3JkZXIgdG8gZ2V0IHRoZSAndHJ1ZScgZXJyb3IgbGluZSwgd2UgbmVlZCB0byBjYWxjdWxhdGUgdGhlIHBvc2l0aW9uIHdoZXJlIHRoZSBhdHRyaWJ1dGUgYmVnaW5zIChpIC0gYXR0clN0ci5sZW5ndGgpIGFuZCB0aGVuIGFkZCB0aGUgcG9zaXRpb24gd2l0aGluIHRoZSBhdHRyaWJ1dGVcbiAgICAgICAgICAgIC8vdGhpcyBnaXZlcyB1cyB0aGUgYWJzb2x1dGUgaW5kZXggaW4gdGhlIGVudGlyZSB4bWwsIHdoaWNoIHdlIGNhbiB1c2UgdG8gZmluZCB0aGUgbGluZSBhdCBsYXN0XG4gICAgICAgICAgICByZXR1cm4gZ2V0RXJyb3JPYmplY3QoaXNWYWxpZC5lcnIuY29kZSwgaXNWYWxpZC5lcnIubXNnLCBnZXRMaW5lTnVtYmVyRm9yUG9zaXRpb24oeG1sRGF0YSwgYXR0clN0clN0YXJ0ICsgaXNWYWxpZC5lcnIubGluZSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChjbG9zaW5nVGFnKSB7XG4gICAgICAgICAgaWYgKCFyZXN1bHQudGFnQ2xvc2VkKSB7XG4gICAgICAgICAgICByZXR1cm4gZ2V0RXJyb3JPYmplY3QoJ0ludmFsaWRUYWcnLCBcIkNsb3NpbmcgdGFnICdcIit0YWdOYW1lK1wiJyBkb2Vzbid0IGhhdmUgcHJvcGVyIGNsb3NpbmcuXCIsIGdldExpbmVOdW1iZXJGb3JQb3NpdGlvbih4bWxEYXRhLCBpKSk7XG4gICAgICAgICAgfSBlbHNlIGlmIChhdHRyU3RyLnRyaW0oKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICByZXR1cm4gZ2V0RXJyb3JPYmplY3QoJ0ludmFsaWRUYWcnLCBcIkNsb3NpbmcgdGFnICdcIit0YWdOYW1lK1wiJyBjYW4ndCBoYXZlIGF0dHJpYnV0ZXMgb3IgaW52YWxpZCBzdGFydGluZy5cIiwgZ2V0TGluZU51bWJlckZvclBvc2l0aW9uKHhtbERhdGEsIHRhZ1N0YXJ0UG9zKSk7XG4gICAgICAgICAgfSBlbHNlIGlmICh0YWdzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIGdldEVycm9yT2JqZWN0KCdJbnZhbGlkVGFnJywgXCJDbG9zaW5nIHRhZyAnXCIrdGFnTmFtZStcIicgaGFzIG5vdCBiZWVuIG9wZW5lZC5cIiwgZ2V0TGluZU51bWJlckZvclBvc2l0aW9uKHhtbERhdGEsIHRhZ1N0YXJ0UG9zKSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IG90ZyA9IHRhZ3MucG9wKCk7XG4gICAgICAgICAgICBpZiAodGFnTmFtZSAhPT0gb3RnLnRhZ05hbWUpIHtcbiAgICAgICAgICAgICAgbGV0IG9wZW5Qb3MgPSBnZXRMaW5lTnVtYmVyRm9yUG9zaXRpb24oeG1sRGF0YSwgb3RnLnRhZ1N0YXJ0UG9zKTtcbiAgICAgICAgICAgICAgcmV0dXJuIGdldEVycm9yT2JqZWN0KCdJbnZhbGlkVGFnJyxcbiAgICAgICAgICAgICAgICBcIkV4cGVjdGVkIGNsb3NpbmcgdGFnICdcIitvdGcudGFnTmFtZStcIicgKG9wZW5lZCBpbiBsaW5lIFwiK29wZW5Qb3MubGluZStcIiwgY29sIFwiK29wZW5Qb3MuY29sK1wiKSBpbnN0ZWFkIG9mIGNsb3NpbmcgdGFnICdcIit0YWdOYW1lK1wiJy5cIixcbiAgICAgICAgICAgICAgICBnZXRMaW5lTnVtYmVyRm9yUG9zaXRpb24oeG1sRGF0YSwgdGFnU3RhcnRQb3MpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy93aGVuIHRoZXJlIGFyZSBubyBtb3JlIHRhZ3MsIHdlIHJlYWNoZWQgdGhlIHJvb3QgbGV2ZWwuXG4gICAgICAgICAgICBpZiAodGFncy5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgICByZWFjaGVkUm9vdCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnN0IGlzVmFsaWQgPSB2YWxpZGF0ZUF0dHJpYnV0ZVN0cmluZyhhdHRyU3RyLCBvcHRpb25zKTtcbiAgICAgICAgICBpZiAoaXNWYWxpZCAhPT0gdHJ1ZSkge1xuICAgICAgICAgICAgLy90aGUgcmVzdWx0IGZyb20gdGhlIG5lc3RlZCBmdW5jdGlvbiByZXR1cm5zIHRoZSBwb3NpdGlvbiBvZiB0aGUgZXJyb3Igd2l0aGluIHRoZSBhdHRyaWJ1dGVcbiAgICAgICAgICAgIC8vaW4gb3JkZXIgdG8gZ2V0IHRoZSAndHJ1ZScgZXJyb3IgbGluZSwgd2UgbmVlZCB0byBjYWxjdWxhdGUgdGhlIHBvc2l0aW9uIHdoZXJlIHRoZSBhdHRyaWJ1dGUgYmVnaW5zIChpIC0gYXR0clN0ci5sZW5ndGgpIGFuZCB0aGVuIGFkZCB0aGUgcG9zaXRpb24gd2l0aGluIHRoZSBhdHRyaWJ1dGVcbiAgICAgICAgICAgIC8vdGhpcyBnaXZlcyB1cyB0aGUgYWJzb2x1dGUgaW5kZXggaW4gdGhlIGVudGlyZSB4bWwsIHdoaWNoIHdlIGNhbiB1c2UgdG8gZmluZCB0aGUgbGluZSBhdCBsYXN0XG4gICAgICAgICAgICByZXR1cm4gZ2V0RXJyb3JPYmplY3QoaXNWYWxpZC5lcnIuY29kZSwgaXNWYWxpZC5lcnIubXNnLCBnZXRMaW5lTnVtYmVyRm9yUG9zaXRpb24oeG1sRGF0YSwgaSAtIGF0dHJTdHIubGVuZ3RoICsgaXNWYWxpZC5lcnIubGluZSkpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vaWYgdGhlIHJvb3QgbGV2ZWwgaGFzIGJlZW4gcmVhY2hlZCBiZWZvcmUgLi4uXG4gICAgICAgICAgaWYgKHJlYWNoZWRSb290ID09PSB0cnVlKSB7XG4gICAgICAgICAgICByZXR1cm4gZ2V0RXJyb3JPYmplY3QoJ0ludmFsaWRYbWwnLCAnTXVsdGlwbGUgcG9zc2libGUgcm9vdCBub2RlcyBmb3VuZC4nLCBnZXRMaW5lTnVtYmVyRm9yUG9zaXRpb24oeG1sRGF0YSwgaSkpO1xuICAgICAgICAgIH0gZWxzZSBpZihvcHRpb25zLnVucGFpcmVkVGFncy5pbmRleE9mKHRhZ05hbWUpICE9PSAtMSl7XG4gICAgICAgICAgICAvL2Rvbid0IHB1c2ggaW50byBzdGFja1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0YWdzLnB1c2goe3RhZ05hbWUsIHRhZ1N0YXJ0UG9zfSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRhZ0ZvdW5kID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vc2tpcCB0YWcgdGV4dCB2YWx1ZVxuICAgICAgICAvL0l0IG1heSBpbmNsdWRlIGNvbW1lbnRzIGFuZCBDREFUQSB2YWx1ZVxuICAgICAgICBmb3IgKGkrKzsgaSA8IHhtbERhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBpZiAoeG1sRGF0YVtpXSA9PT0gJzwnKSB7XG4gICAgICAgICAgICBpZiAoeG1sRGF0YVtpICsgMV0gPT09ICchJykge1xuICAgICAgICAgICAgICAvL2NvbW1lbnQgb3IgQ0FEQVRBXG4gICAgICAgICAgICAgIGkrKztcbiAgICAgICAgICAgICAgaSA9IHJlYWRDb21tZW50QW5kQ0RBVEEoeG1sRGF0YSwgaSk7XG4gICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh4bWxEYXRhW2krMV0gPT09ICc/Jykge1xuICAgICAgICAgICAgICBpID0gcmVhZFBJKHhtbERhdGEsICsraSk7XG4gICAgICAgICAgICAgIGlmIChpLmVycikgcmV0dXJuIGk7XG4gICAgICAgICAgICB9IGVsc2V7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZiAoeG1sRGF0YVtpXSA9PT0gJyYnKSB7XG4gICAgICAgICAgICBjb25zdCBhZnRlckFtcCA9IHZhbGlkYXRlQW1wZXJzYW5kKHhtbERhdGEsIGkpO1xuICAgICAgICAgICAgaWYgKGFmdGVyQW1wID09IC0xKVxuICAgICAgICAgICAgICByZXR1cm4gZ2V0RXJyb3JPYmplY3QoJ0ludmFsaWRDaGFyJywgXCJjaGFyICcmJyBpcyBub3QgZXhwZWN0ZWQuXCIsIGdldExpbmVOdW1iZXJGb3JQb3NpdGlvbih4bWxEYXRhLCBpKSk7XG4gICAgICAgICAgICBpID0gYWZ0ZXJBbXA7XG4gICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICBpZiAocmVhY2hlZFJvb3QgPT09IHRydWUgJiYgIWlzV2hpdGVTcGFjZSh4bWxEYXRhW2ldKSkge1xuICAgICAgICAgICAgICByZXR1cm4gZ2V0RXJyb3JPYmplY3QoJ0ludmFsaWRYbWwnLCBcIkV4dHJhIHRleHQgYXQgdGhlIGVuZFwiLCBnZXRMaW5lTnVtYmVyRm9yUG9zaXRpb24oeG1sRGF0YSwgaSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSAvL2VuZCBvZiByZWFkaW5nIHRhZyB0ZXh0IHZhbHVlXG4gICAgICAgIGlmICh4bWxEYXRhW2ldID09PSAnPCcpIHtcbiAgICAgICAgICBpLS07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKCBpc1doaXRlU3BhY2UoeG1sRGF0YVtpXSkpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICByZXR1cm4gZ2V0RXJyb3JPYmplY3QoJ0ludmFsaWRDaGFyJywgXCJjaGFyICdcIit4bWxEYXRhW2ldK1wiJyBpcyBub3QgZXhwZWN0ZWQuXCIsIGdldExpbmVOdW1iZXJGb3JQb3NpdGlvbih4bWxEYXRhLCBpKSk7XG4gICAgfVxuICB9XG5cbiAgaWYgKCF0YWdGb3VuZCkge1xuICAgIHJldHVybiBnZXRFcnJvck9iamVjdCgnSW52YWxpZFhtbCcsICdTdGFydCB0YWcgZXhwZWN0ZWQuJywgMSk7XG4gIH1lbHNlIGlmICh0YWdzLmxlbmd0aCA9PSAxKSB7XG4gICAgICByZXR1cm4gZ2V0RXJyb3JPYmplY3QoJ0ludmFsaWRUYWcnLCBcIlVuY2xvc2VkIHRhZyAnXCIrdGFnc1swXS50YWdOYW1lK1wiJy5cIiwgZ2V0TGluZU51bWJlckZvclBvc2l0aW9uKHhtbERhdGEsIHRhZ3NbMF0udGFnU3RhcnRQb3MpKTtcbiAgfWVsc2UgaWYgKHRhZ3MubGVuZ3RoID4gMCkge1xuICAgICAgcmV0dXJuIGdldEVycm9yT2JqZWN0KCdJbnZhbGlkWG1sJywgXCJJbnZhbGlkICdcIitcbiAgICAgICAgICBKU09OLnN0cmluZ2lmeSh0YWdzLm1hcCh0ID0+IHQudGFnTmFtZSksIG51bGwsIDQpLnJlcGxhY2UoL1xccj9cXG4vZywgJycpK1xuICAgICAgICAgIFwiJyBmb3VuZC5cIiwge2xpbmU6IDEsIGNvbDogMX0pO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59O1xuXG5mdW5jdGlvbiBpc1doaXRlU3BhY2UoY2hhcil7XG4gIHJldHVybiBjaGFyID09PSAnICcgfHwgY2hhciA9PT0gJ1xcdCcgfHwgY2hhciA9PT0gJ1xcbicgIHx8IGNoYXIgPT09ICdcXHInO1xufVxuLyoqXG4gKiBSZWFkIFByb2Nlc3NpbmcgaW5zc3RydWN0aW9ucyBhbmQgc2tpcFxuICogQHBhcmFtIHsqfSB4bWxEYXRhXG4gKiBAcGFyYW0geyp9IGlcbiAqL1xuZnVuY3Rpb24gcmVhZFBJKHhtbERhdGEsIGkpIHtcbiAgY29uc3Qgc3RhcnQgPSBpO1xuICBmb3IgKDsgaSA8IHhtbERhdGEubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoeG1sRGF0YVtpXSA9PSAnPycgfHwgeG1sRGF0YVtpXSA9PSAnICcpIHtcbiAgICAgIC8vdGFnbmFtZVxuICAgICAgY29uc3QgdGFnbmFtZSA9IHhtbERhdGEuc3Vic3RyKHN0YXJ0LCBpIC0gc3RhcnQpO1xuICAgICAgaWYgKGkgPiA1ICYmIHRhZ25hbWUgPT09ICd4bWwnKSB7XG4gICAgICAgIHJldHVybiBnZXRFcnJvck9iamVjdCgnSW52YWxpZFhtbCcsICdYTUwgZGVjbGFyYXRpb24gYWxsb3dlZCBvbmx5IGF0IHRoZSBzdGFydCBvZiB0aGUgZG9jdW1lbnQuJywgZ2V0TGluZU51bWJlckZvclBvc2l0aW9uKHhtbERhdGEsIGkpKTtcbiAgICAgIH0gZWxzZSBpZiAoeG1sRGF0YVtpXSA9PSAnPycgJiYgeG1sRGF0YVtpICsgMV0gPT0gJz4nKSB7XG4gICAgICAgIC8vY2hlY2sgaWYgdmFsaWQgYXR0cmlidXQgc3RyaW5nXG4gICAgICAgIGkrKztcbiAgICAgICAgYnJlYWs7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIGk7XG59XG5cbmZ1bmN0aW9uIHJlYWRDb21tZW50QW5kQ0RBVEEoeG1sRGF0YSwgaSkge1xuICBpZiAoeG1sRGF0YS5sZW5ndGggPiBpICsgNSAmJiB4bWxEYXRhW2kgKyAxXSA9PT0gJy0nICYmIHhtbERhdGFbaSArIDJdID09PSAnLScpIHtcbiAgICAvL2NvbW1lbnRcbiAgICBmb3IgKGkgKz0gMzsgaSA8IHhtbERhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmICh4bWxEYXRhW2ldID09PSAnLScgJiYgeG1sRGF0YVtpICsgMV0gPT09ICctJyAmJiB4bWxEYXRhW2kgKyAyXSA9PT0gJz4nKSB7XG4gICAgICAgIGkgKz0gMjtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2UgaWYgKFxuICAgIHhtbERhdGEubGVuZ3RoID4gaSArIDggJiZcbiAgICB4bWxEYXRhW2kgKyAxXSA9PT0gJ0QnICYmXG4gICAgeG1sRGF0YVtpICsgMl0gPT09ICdPJyAmJlxuICAgIHhtbERhdGFbaSArIDNdID09PSAnQycgJiZcbiAgICB4bWxEYXRhW2kgKyA0XSA9PT0gJ1QnICYmXG4gICAgeG1sRGF0YVtpICsgNV0gPT09ICdZJyAmJlxuICAgIHhtbERhdGFbaSArIDZdID09PSAnUCcgJiZcbiAgICB4bWxEYXRhW2kgKyA3XSA9PT0gJ0UnXG4gICkge1xuICAgIGxldCBhbmdsZUJyYWNrZXRzQ291bnQgPSAxO1xuICAgIGZvciAoaSArPSA4OyBpIDwgeG1sRGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHhtbERhdGFbaV0gPT09ICc8Jykge1xuICAgICAgICBhbmdsZUJyYWNrZXRzQ291bnQrKztcbiAgICAgIH0gZWxzZSBpZiAoeG1sRGF0YVtpXSA9PT0gJz4nKSB7XG4gICAgICAgIGFuZ2xlQnJhY2tldHNDb3VudC0tO1xuICAgICAgICBpZiAoYW5nbGVCcmFja2V0c0NvdW50ID09PSAwKSB7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSBpZiAoXG4gICAgeG1sRGF0YS5sZW5ndGggPiBpICsgOSAmJlxuICAgIHhtbERhdGFbaSArIDFdID09PSAnWycgJiZcbiAgICB4bWxEYXRhW2kgKyAyXSA9PT0gJ0MnICYmXG4gICAgeG1sRGF0YVtpICsgM10gPT09ICdEJyAmJlxuICAgIHhtbERhdGFbaSArIDRdID09PSAnQScgJiZcbiAgICB4bWxEYXRhW2kgKyA1XSA9PT0gJ1QnICYmXG4gICAgeG1sRGF0YVtpICsgNl0gPT09ICdBJyAmJlxuICAgIHhtbERhdGFbaSArIDddID09PSAnWydcbiAgKSB7XG4gICAgZm9yIChpICs9IDg7IGkgPCB4bWxEYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoeG1sRGF0YVtpXSA9PT0gJ10nICYmIHhtbERhdGFbaSArIDFdID09PSAnXScgJiYgeG1sRGF0YVtpICsgMl0gPT09ICc+Jykge1xuICAgICAgICBpICs9IDI7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBpO1xufVxuXG5jb25zdCBkb3VibGVRdW90ZSA9ICdcIic7XG5jb25zdCBzaW5nbGVRdW90ZSA9IFwiJ1wiO1xuXG4vKipcbiAqIEtlZXAgcmVhZGluZyB4bWxEYXRhIHVudGlsICc8JyBpcyBmb3VuZCBvdXRzaWRlIHRoZSBhdHRyaWJ1dGUgdmFsdWUuXG4gKiBAcGFyYW0ge3N0cmluZ30geG1sRGF0YVxuICogQHBhcmFtIHtudW1iZXJ9IGlcbiAqL1xuZnVuY3Rpb24gcmVhZEF0dHJpYnV0ZVN0cih4bWxEYXRhLCBpKSB7XG4gIGxldCBhdHRyU3RyID0gJyc7XG4gIGxldCBzdGFydENoYXIgPSAnJztcbiAgbGV0IHRhZ0Nsb3NlZCA9IGZhbHNlO1xuICBmb3IgKDsgaSA8IHhtbERhdGEubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoeG1sRGF0YVtpXSA9PT0gZG91YmxlUXVvdGUgfHwgeG1sRGF0YVtpXSA9PT0gc2luZ2xlUXVvdGUpIHtcbiAgICAgIGlmIChzdGFydENoYXIgPT09ICcnKSB7XG4gICAgICAgIHN0YXJ0Q2hhciA9IHhtbERhdGFbaV07XG4gICAgICB9IGVsc2UgaWYgKHN0YXJ0Q2hhciAhPT0geG1sRGF0YVtpXSkge1xuICAgICAgICAvL2lmIHZhdWUgaXMgZW5jbG9zZWQgd2l0aCBkb3VibGUgcXVvdGUgdGhlbiBzaW5nbGUgcXVvdGVzIGFyZSBhbGxvd2VkIGluc2lkZSB0aGUgdmFsdWUgYW5kIHZpY2UgdmVyc2FcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHN0YXJ0Q2hhciA9ICcnO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoeG1sRGF0YVtpXSA9PT0gJz4nKSB7XG4gICAgICBpZiAoc3RhcnRDaGFyID09PSAnJykge1xuICAgICAgICB0YWdDbG9zZWQgPSB0cnVlO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgYXR0clN0ciArPSB4bWxEYXRhW2ldO1xuICB9XG4gIGlmIChzdGFydENoYXIgIT09ICcnKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICB2YWx1ZTogYXR0clN0cixcbiAgICBpbmRleDogaSxcbiAgICB0YWdDbG9zZWQ6IHRhZ0Nsb3NlZFxuICB9O1xufVxuXG4vKipcbiAqIFNlbGVjdCBhbGwgdGhlIGF0dHJpYnV0ZXMgd2hldGhlciB2YWxpZCBvciBpbnZhbGlkLlxuICovXG5jb25zdCB2YWxpZEF0dHJTdHJSZWd4cCA9IG5ldyBSZWdFeHAoJyhcXFxccyopKFteXFxcXHM9XSspKFxcXFxzKj0pPyhcXFxccyooW1xcJ1wiXSkoKFtcXFxcc1xcXFxTXSkqPylcXFxcNSk/JywgJ2cnKTtcblxuLy9hdHRyLCA9XCJzZFwiLCBhPVwiYW1pdCdzXCIsIGE9XCJzZFwiYj1cInNhZlwiLCBhYiAgY2Q9XCJcIlxuXG5mdW5jdGlvbiB2YWxpZGF0ZUF0dHJpYnV0ZVN0cmluZyhhdHRyU3RyLCBvcHRpb25zKSB7XG4gIC8vY29uc29sZS5sb2coXCJzdGFydDpcIithdHRyU3RyK1wiOmVuZFwiKTtcblxuICAvL2lmKGF0dHJTdHIudHJpbSgpLmxlbmd0aCA9PT0gMCkgcmV0dXJuIHRydWU7IC8vZW1wdHkgc3RyaW5nXG5cbiAgY29uc3QgbWF0Y2hlcyA9IHV0aWwuZ2V0QWxsTWF0Y2hlcyhhdHRyU3RyLCB2YWxpZEF0dHJTdHJSZWd4cCk7XG4gIGNvbnN0IGF0dHJOYW1lcyA9IHt9O1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbWF0Y2hlcy5sZW5ndGg7IGkrKykge1xuICAgIGlmIChtYXRjaGVzW2ldWzFdLmxlbmd0aCA9PT0gMCkge1xuICAgICAgLy9ub3NwYWNlIGJlZm9yZSBhdHRyaWJ1dGUgbmFtZTogYT1cInNkXCJiPVwic2FmXCJcbiAgICAgIHJldHVybiBnZXRFcnJvck9iamVjdCgnSW52YWxpZEF0dHInLCBcIkF0dHJpYnV0ZSAnXCIrbWF0Y2hlc1tpXVsyXStcIicgaGFzIG5vIHNwYWNlIGluIHN0YXJ0aW5nLlwiLCBnZXRQb3NpdGlvbkZyb21NYXRjaChtYXRjaGVzW2ldKSlcbiAgICB9IGVsc2UgaWYgKG1hdGNoZXNbaV1bM10gIT09IHVuZGVmaW5lZCAmJiBtYXRjaGVzW2ldWzRdID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBnZXRFcnJvck9iamVjdCgnSW52YWxpZEF0dHInLCBcIkF0dHJpYnV0ZSAnXCIrbWF0Y2hlc1tpXVsyXStcIicgaXMgd2l0aG91dCB2YWx1ZS5cIiwgZ2V0UG9zaXRpb25Gcm9tTWF0Y2gobWF0Y2hlc1tpXSkpO1xuICAgIH0gZWxzZSBpZiAobWF0Y2hlc1tpXVszXSA9PT0gdW5kZWZpbmVkICYmICFvcHRpb25zLmFsbG93Qm9vbGVhbkF0dHJpYnV0ZXMpIHtcbiAgICAgIC8vaW5kZXBlbmRlbnQgYXR0cmlidXRlOiBhYlxuICAgICAgcmV0dXJuIGdldEVycm9yT2JqZWN0KCdJbnZhbGlkQXR0cicsIFwiYm9vbGVhbiBhdHRyaWJ1dGUgJ1wiK21hdGNoZXNbaV1bMl0rXCInIGlzIG5vdCBhbGxvd2VkLlwiLCBnZXRQb3NpdGlvbkZyb21NYXRjaChtYXRjaGVzW2ldKSk7XG4gICAgfVxuICAgIC8qIGVsc2UgaWYobWF0Y2hlc1tpXVs2XSA9PT0gdW5kZWZpbmVkKXsvL2F0dHJpYnV0ZSB3aXRob3V0IHZhbHVlOiBhYj1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgZXJyOiB7IGNvZGU6XCJJbnZhbGlkQXR0clwiLG1zZzpcImF0dHJpYnV0ZSBcIiArIG1hdGNoZXNbaV1bMl0gKyBcIiBoYXMgbm8gdmFsdWUgYXNzaWduZWQuXCJ9fTtcbiAgICAgICAgICAgICAgICB9ICovXG4gICAgY29uc3QgYXR0ck5hbWUgPSBtYXRjaGVzW2ldWzJdO1xuICAgIGlmICghdmFsaWRhdGVBdHRyTmFtZShhdHRyTmFtZSkpIHtcbiAgICAgIHJldHVybiBnZXRFcnJvck9iamVjdCgnSW52YWxpZEF0dHInLCBcIkF0dHJpYnV0ZSAnXCIrYXR0ck5hbWUrXCInIGlzIGFuIGludmFsaWQgbmFtZS5cIiwgZ2V0UG9zaXRpb25Gcm9tTWF0Y2gobWF0Y2hlc1tpXSkpO1xuICAgIH1cbiAgICBpZiAoIWF0dHJOYW1lcy5oYXNPd25Qcm9wZXJ0eShhdHRyTmFtZSkpIHtcbiAgICAgIC8vY2hlY2sgZm9yIGR1cGxpY2F0ZSBhdHRyaWJ1dGUuXG4gICAgICBhdHRyTmFtZXNbYXR0ck5hbWVdID0gMTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGdldEVycm9yT2JqZWN0KCdJbnZhbGlkQXR0cicsIFwiQXR0cmlidXRlICdcIithdHRyTmFtZStcIicgaXMgcmVwZWF0ZWQuXCIsIGdldFBvc2l0aW9uRnJvbU1hdGNoKG1hdGNoZXNbaV0pKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gdmFsaWRhdGVOdW1iZXJBbXBlcnNhbmQoeG1sRGF0YSwgaSkge1xuICBsZXQgcmUgPSAvXFxkLztcbiAgaWYgKHhtbERhdGFbaV0gPT09ICd4Jykge1xuICAgIGkrKztcbiAgICByZSA9IC9bXFxkYS1mQS1GXS87XG4gIH1cbiAgZm9yICg7IGkgPCB4bWxEYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHhtbERhdGFbaV0gPT09ICc7JylcbiAgICAgIHJldHVybiBpO1xuICAgIGlmICgheG1sRGF0YVtpXS5tYXRjaChyZSkpXG4gICAgICBicmVhaztcbiAgfVxuICByZXR1cm4gLTE7XG59XG5cbmZ1bmN0aW9uIHZhbGlkYXRlQW1wZXJzYW5kKHhtbERhdGEsIGkpIHtcbiAgLy8gaHR0cHM6Ly93d3cudzMub3JnL1RSL3htbC8jZHQtY2hhcnJlZlxuICBpKys7XG4gIGlmICh4bWxEYXRhW2ldID09PSAnOycpXG4gICAgcmV0dXJuIC0xO1xuICBpZiAoeG1sRGF0YVtpXSA9PT0gJyMnKSB7XG4gICAgaSsrO1xuICAgIHJldHVybiB2YWxpZGF0ZU51bWJlckFtcGVyc2FuZCh4bWxEYXRhLCBpKTtcbiAgfVxuICBsZXQgY291bnQgPSAwO1xuICBmb3IgKDsgaSA8IHhtbERhdGEubGVuZ3RoOyBpKyssIGNvdW50KyspIHtcbiAgICBpZiAoeG1sRGF0YVtpXS5tYXRjaCgvXFx3LykgJiYgY291bnQgPCAyMClcbiAgICAgIGNvbnRpbnVlO1xuICAgIGlmICh4bWxEYXRhW2ldID09PSAnOycpXG4gICAgICBicmVhaztcbiAgICByZXR1cm4gLTE7XG4gIH1cbiAgcmV0dXJuIGk7XG59XG5cbmZ1bmN0aW9uIGdldEVycm9yT2JqZWN0KGNvZGUsIG1lc3NhZ2UsIGxpbmVOdW1iZXIpIHtcbiAgcmV0dXJuIHtcbiAgICBlcnI6IHtcbiAgICAgIGNvZGU6IGNvZGUsXG4gICAgICBtc2c6IG1lc3NhZ2UsXG4gICAgICBsaW5lOiBsaW5lTnVtYmVyLmxpbmUgfHwgbGluZU51bWJlcixcbiAgICAgIGNvbDogbGluZU51bWJlci5jb2wsXG4gICAgfSxcbiAgfTtcbn1cblxuZnVuY3Rpb24gdmFsaWRhdGVBdHRyTmFtZShhdHRyTmFtZSkge1xuICByZXR1cm4gdXRpbC5pc05hbWUoYXR0ck5hbWUpO1xufVxuXG4vLyBjb25zdCBzdGFydHNXaXRoWE1MID0gL154bWwvaTtcblxuZnVuY3Rpb24gdmFsaWRhdGVUYWdOYW1lKHRhZ25hbWUpIHtcbiAgcmV0dXJuIHV0aWwuaXNOYW1lKHRhZ25hbWUpIC8qICYmICF0YWduYW1lLm1hdGNoKHN0YXJ0c1dpdGhYTUwpICovO1xufVxuXG4vL3RoaXMgZnVuY3Rpb24gcmV0dXJucyB0aGUgbGluZSBudW1iZXIgZm9yIHRoZSBjaGFyYWN0ZXIgYXQgdGhlIGdpdmVuIGluZGV4XG5mdW5jdGlvbiBnZXRMaW5lTnVtYmVyRm9yUG9zaXRpb24oeG1sRGF0YSwgaW5kZXgpIHtcbiAgY29uc3QgbGluZXMgPSB4bWxEYXRhLnN1YnN0cmluZygwLCBpbmRleCkuc3BsaXQoL1xccj9cXG4vKTtcbiAgcmV0dXJuIHtcbiAgICBsaW5lOiBsaW5lcy5sZW5ndGgsXG5cbiAgICAvLyBjb2x1bW4gbnVtYmVyIGlzIGxhc3QgbGluZSdzIGxlbmd0aCArIDEsIGJlY2F1c2UgY29sdW1uIG51bWJlcmluZyBzdGFydHMgYXQgMTpcbiAgICBjb2w6IGxpbmVzW2xpbmVzLmxlbmd0aCAtIDFdLmxlbmd0aCArIDFcbiAgfTtcbn1cblxuLy90aGlzIGZ1bmN0aW9uIHJldHVybnMgdGhlIHBvc2l0aW9uIG9mIHRoZSBmaXJzdCBjaGFyYWN0ZXIgb2YgbWF0Y2ggd2l0aGluIGF0dHJTdHJcbmZ1bmN0aW9uIGdldFBvc2l0aW9uRnJvbU1hdGNoKG1hdGNoKSB7XG4gIHJldHVybiBtYXRjaC5zdGFydEluZGV4ICsgbWF0Y2hbMV0ubGVuZ3RoO1xufVxuIiwgIlxuY29uc3QgeyBEQU5HRVJPVVNfUFJPUEVSVFlfTkFNRVMsIGNyaXRpY2FsUHJvcGVydGllcyB9ID0gcmVxdWlyZShcIi4uL3V0aWxcIik7XG5cbmNvbnN0IGRlZmF1bHRPbkRhbmdlcm91c1Byb3BlcnR5ID0gKG5hbWUpID0+IHtcbiAgaWYgKERBTkdFUk9VU19QUk9QRVJUWV9OQU1FUy5pbmNsdWRlcyhuYW1lKSkge1xuICAgIHJldHVybiBcIl9fXCIgKyBuYW1lO1xuICB9XG4gIHJldHVybiBuYW1lO1xufTtcbmNvbnN0IGRlZmF1bHRPcHRpb25zID0ge1xuICBwcmVzZXJ2ZU9yZGVyOiBmYWxzZSxcbiAgYXR0cmlidXRlTmFtZVByZWZpeDogJ0BfJyxcbiAgYXR0cmlidXRlc0dyb3VwTmFtZTogZmFsc2UsXG4gIHRleHROb2RlTmFtZTogJyN0ZXh0JyxcbiAgaWdub3JlQXR0cmlidXRlczogdHJ1ZSxcbiAgcmVtb3ZlTlNQcmVmaXg6IGZhbHNlLCAvLyByZW1vdmUgTlMgZnJvbSB0YWcgbmFtZSBvciBhdHRyaWJ1dGUgbmFtZSBpZiB0cnVlXG4gIGFsbG93Qm9vbGVhbkF0dHJpYnV0ZXM6IGZhbHNlLCAvL2EgdGFnIGNhbiBoYXZlIGF0dHJpYnV0ZXMgd2l0aG91dCBhbnkgdmFsdWVcbiAgLy9pZ25vcmVSb290RWxlbWVudCA6IGZhbHNlLFxuICBwYXJzZVRhZ1ZhbHVlOiB0cnVlLFxuICBwYXJzZUF0dHJpYnV0ZVZhbHVlOiBmYWxzZSxcbiAgdHJpbVZhbHVlczogdHJ1ZSwgLy9UcmltIHN0cmluZyB2YWx1ZXMgb2YgdGFnIGFuZCBhdHRyaWJ1dGVzXG4gIGNkYXRhUHJvcE5hbWU6IGZhbHNlLFxuICBudW1iZXJQYXJzZU9wdGlvbnM6IHtcbiAgICBoZXg6IHRydWUsXG4gICAgbGVhZGluZ1plcm9zOiB0cnVlLFxuICAgIGVOb3RhdGlvbjogdHJ1ZVxuICB9LFxuICB0YWdWYWx1ZVByb2Nlc3NvcjogZnVuY3Rpb24gKHRhZ05hbWUsIHZhbCkge1xuICAgIHJldHVybiB2YWw7XG4gIH0sXG4gIGF0dHJpYnV0ZVZhbHVlUHJvY2Vzc29yOiBmdW5jdGlvbiAoYXR0ck5hbWUsIHZhbCkge1xuICAgIHJldHVybiB2YWw7XG4gIH0sXG4gIHN0b3BOb2RlczogW10sIC8vbmVzdGVkIHRhZ3Mgd2lsbCBub3QgYmUgcGFyc2VkIGV2ZW4gZm9yIGVycm9yc1xuICBhbHdheXNDcmVhdGVUZXh0Tm9kZTogZmFsc2UsXG4gIGlzQXJyYXk6ICgpID0+IGZhbHNlLFxuICBjb21tZW50UHJvcE5hbWU6IGZhbHNlLFxuICB1bnBhaXJlZFRhZ3M6IFtdLFxuICBwcm9jZXNzRW50aXRpZXM6IHRydWUsXG4gIGh0bWxFbnRpdGllczogZmFsc2UsXG4gIGlnbm9yZURlY2xhcmF0aW9uOiBmYWxzZSxcbiAgaWdub3JlUGlUYWdzOiBmYWxzZSxcbiAgdHJhbnNmb3JtVGFnTmFtZTogZmFsc2UsXG4gIHRyYW5zZm9ybUF0dHJpYnV0ZU5hbWU6IGZhbHNlLFxuICB1cGRhdGVUYWc6IGZ1bmN0aW9uICh0YWdOYW1lLCBqUGF0aCwgYXR0cnMpIHtcbiAgICByZXR1cm4gdGFnTmFtZVxuICB9LFxuICAvLyBza2lwRW1wdHlMaXN0SXRlbTogZmFsc2VcbiAgY2FwdHVyZU1ldGFEYXRhOiBmYWxzZSxcbiAgbWF4TmVzdGVkVGFnczogMTAwLFxuICBzdHJpY3RSZXNlcnZlZE5hbWVzOiB0cnVlLFxuICBvbkRhbmdlcm91c1Byb3BlcnR5OiBkZWZhdWx0T25EYW5nZXJvdXNQcm9wZXJ0eVxufTtcbi8qKlxuICogVmFsaWRhdGVzIHRoYXQgYSBwcm9wZXJ0eSBuYW1lIGlzIHNhZmUgdG8gdXNlXG4gKiBAcGFyYW0ge3N0cmluZ30gcHJvcGVydHlOYW1lIC0gVGhlIHByb3BlcnR5IG5hbWUgdG8gdmFsaWRhdGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBvcHRpb25OYW1lIC0gVGhlIG9wdGlvbiBmaWVsZCBuYW1lIChmb3IgZXJyb3IgbWVzc2FnZSlcbiAqIEB0aHJvd3Mge0Vycm9yfSBJZiBwcm9wZXJ0eSBuYW1lIGlzIGRhbmdlcm91c1xuICovXG5mdW5jdGlvbiB2YWxpZGF0ZVByb3BlcnR5TmFtZShwcm9wZXJ0eU5hbWUsIG9wdGlvbk5hbWUpIHtcbiAgaWYgKHR5cGVvZiBwcm9wZXJ0eU5hbWUgIT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuOyAvLyBPbmx5IHZhbGlkYXRlIHN0cmluZyBwcm9wZXJ0eSBuYW1lc1xuICB9XG5cbiAgY29uc3Qgbm9ybWFsaXplZCA9IHByb3BlcnR5TmFtZS50b0xvd2VyQ2FzZSgpO1xuICBpZiAoREFOR0VST1VTX1BST1BFUlRZX05BTUVTLnNvbWUoZGFuZ2Vyb3VzID0+IG5vcm1hbGl6ZWQgPT09IGRhbmdlcm91cy50b0xvd2VyQ2FzZSgpKSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgIGBbU0VDVVJJVFldIEludmFsaWQgJHtvcHRpb25OYW1lfTogXCIke3Byb3BlcnR5TmFtZX1cIiBpcyBhIHJlc2VydmVkIEphdmFTY3JpcHQga2V5d29yZCB0aGF0IGNvdWxkIGNhdXNlIHByb3RvdHlwZSBwb2xsdXRpb25gXG4gICAgKTtcbiAgfVxuXG4gIGlmIChjcml0aWNhbFByb3BlcnRpZXMuc29tZShkYW5nZXJvdXMgPT4gbm9ybWFsaXplZCA9PT0gZGFuZ2Vyb3VzLnRvTG93ZXJDYXNlKCkpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgYFtTRUNVUklUWV0gSW52YWxpZCAke29wdGlvbk5hbWV9OiBcIiR7cHJvcGVydHlOYW1lfVwiIGlzIGEgcmVzZXJ2ZWQgSmF2YVNjcmlwdCBrZXl3b3JkIHRoYXQgY291bGQgY2F1c2UgcHJvdG90eXBlIHBvbGx1dGlvbmBcbiAgICApO1xuICB9XG59XG5cbi8qKlxuICogTm9ybWFsaXplcyBwcm9jZXNzRW50aXRpZXMgb3B0aW9uIGZvciBiYWNrd2FyZCBjb21wYXRpYmlsaXR5XG4gKiBAcGFyYW0ge2Jvb2xlYW58b2JqZWN0fSB2YWx1ZSBcbiAqIEByZXR1cm5zIHtvYmplY3R9IEFsd2F5cyByZXR1cm5zIG5vcm1hbGl6ZWQgb2JqZWN0XG4gKi9cbmZ1bmN0aW9uIG5vcm1hbGl6ZVByb2Nlc3NFbnRpdGllcyh2YWx1ZSkge1xuICAvLyBCb29sZWFuIGJhY2t3YXJkIGNvbXBhdGliaWxpdHlcbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGVuYWJsZWQ6IHZhbHVlLCAvLyB0cnVlIG9yIGZhbHNlXG4gICAgICBtYXhFbnRpdHlTaXplOiAxMDAwMCxcbiAgICAgIG1heEV4cGFuc2lvbkRlcHRoOiAxMCxcbiAgICAgIG1heFRvdGFsRXhwYW5zaW9uczogMTAwMCxcbiAgICAgIG1heEV4cGFuZGVkTGVuZ3RoOiAxMDAwMDAsXG4gICAgICBhbGxvd2VkVGFnczogbnVsbCxcbiAgICAgIHRhZ0ZpbHRlcjogbnVsbFxuICAgIH07XG4gIH1cblxuICAvLyBPYmplY3QgY29uZmlnIC0gbWVyZ2Ugd2l0aCBkZWZhdWx0c1xuICBpZiAodHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAhPT0gbnVsbCkge1xuICAgIHJldHVybiB7XG4gICAgICBlbmFibGVkOiB2YWx1ZS5lbmFibGVkICE9PSBmYWxzZSxcbiAgICAgIG1heEVudGl0eVNpemU6IE1hdGgubWF4KDEsIHZhbHVlLm1heEVudGl0eVNpemUgPz8gMTAwMDApLFxuICAgICAgbWF4RXhwYW5zaW9uRGVwdGg6IE1hdGgubWF4KDEsIHZhbHVlLm1heEV4cGFuc2lvbkRlcHRoID8/IDEwMDAwKSxcbiAgICAgIG1heFRvdGFsRXhwYW5zaW9uczogTWF0aC5tYXgoMSwgdmFsdWUubWF4VG90YWxFeHBhbnNpb25zID8/IEluZmluaXR5KSxcbiAgICAgIG1heEV4cGFuZGVkTGVuZ3RoOiBNYXRoLm1heCgxLCB2YWx1ZS5tYXhFeHBhbmRlZExlbmd0aCA/PyAxMDAwMDApLFxuICAgICAgbWF4RW50aXR5Q291bnQ6IE1hdGgubWF4KDEsIHZhbHVlLm1heEVudGl0eUNvdW50ID8/IDEwMDApLFxuICAgICAgYWxsb3dlZFRhZ3M6IHZhbHVlLmFsbG93ZWRUYWdzID8/IG51bGwsXG4gICAgICB0YWdGaWx0ZXI6IHZhbHVlLnRhZ0ZpbHRlciA/PyBudWxsXG4gICAgfTtcbiAgfVxuXG4gIC8vIERlZmF1bHQgdG8gZW5hYmxlZCB3aXRoIGxpbWl0c1xuICByZXR1cm4gbm9ybWFsaXplUHJvY2Vzc0VudGl0aWVzKHRydWUpO1xufVxuXG5jb25zdCBidWlsZE9wdGlvbnMgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICBjb25zdCBidWlsdCA9IE9iamVjdC5hc3NpZ24oe30sIGRlZmF1bHRPcHRpb25zLCBvcHRpb25zKTtcblxuXG4gIC8vIFZhbGlkYXRlIHByb3BlcnR5IG5hbWVzIHRvIHByZXZlbnQgcHJvdG90eXBlIHBvbGx1dGlvblxuICBjb25zdCBwcm9wZXJ0eU5hbWVPcHRpb25zID0gW1xuICAgIHsgdmFsdWU6IGJ1aWx0LmF0dHJpYnV0ZU5hbWVQcmVmaXgsIG5hbWU6ICdhdHRyaWJ1dGVOYW1lUHJlZml4JyB9LFxuICAgIHsgdmFsdWU6IGJ1aWx0LmF0dHJpYnV0ZXNHcm91cE5hbWUsIG5hbWU6ICdhdHRyaWJ1dGVzR3JvdXBOYW1lJyB9LFxuICAgIHsgdmFsdWU6IGJ1aWx0LnRleHROb2RlTmFtZSwgbmFtZTogJ3RleHROb2RlTmFtZScgfSxcbiAgICB7IHZhbHVlOiBidWlsdC5jZGF0YVByb3BOYW1lLCBuYW1lOiAnY2RhdGFQcm9wTmFtZScgfSxcbiAgICB7IHZhbHVlOiBidWlsdC5jb21tZW50UHJvcE5hbWUsIG5hbWU6ICdjb21tZW50UHJvcE5hbWUnIH1cbiAgXTtcblxuICBmb3IgKGNvbnN0IHsgdmFsdWUsIG5hbWUgfSBvZiBwcm9wZXJ0eU5hbWVPcHRpb25zKSB7XG4gICAgaWYgKHZhbHVlKSB7XG4gICAgICB2YWxpZGF0ZVByb3BlcnR5TmFtZSh2YWx1ZSwgbmFtZSk7XG4gICAgfVxuICB9XG5cbiAgaWYgKGJ1aWx0Lm9uRGFuZ2Vyb3VzUHJvcGVydHkgPT09IG51bGwpIHtcbiAgICBidWlsdC5vbkRhbmdlcm91c1Byb3BlcnR5ID0gZGVmYXVsdE9uRGFuZ2Vyb3VzUHJvcGVydHk7XG4gIH1cblxuICAvLyBBbHdheXMgbm9ybWFsaXplIHByb2Nlc3NFbnRpdGllcyBmb3IgYmFja3dhcmQgY29tcGF0aWJpbGl0eSBhbmQgdmFsaWRhdGlvblxuICBidWlsdC5wcm9jZXNzRW50aXRpZXMgPSBub3JtYWxpemVQcm9jZXNzRW50aXRpZXMoYnVpbHQucHJvY2Vzc0VudGl0aWVzKTtcbiAgLy9jb25zb2xlLmRlYnVnKGJ1aWx0LnByb2Nlc3NFbnRpdGllcylcbiAgcmV0dXJuIGJ1aWx0O1xufTtcblxuZXhwb3J0cy5idWlsZE9wdGlvbnMgPSBidWlsZE9wdGlvbnM7XG5leHBvcnRzLmRlZmF1bHRPcHRpb25zID0gZGVmYXVsdE9wdGlvbnM7IiwgIid1c2Ugc3RyaWN0JztcblxuY2xhc3MgWG1sTm9kZXtcbiAgY29uc3RydWN0b3IodGFnbmFtZSkge1xuICAgIHRoaXMudGFnbmFtZSA9IHRhZ25hbWU7XG4gICAgdGhpcy5jaGlsZCA9IFtdOyAvL25lc3RlZCB0YWdzLCB0ZXh0LCBjZGF0YSwgY29tbWVudHMgaW4gb3JkZXJcbiAgICB0aGlzW1wiOkBcIl0gPSB7fTsgLy9hdHRyaWJ1dGVzIG1hcFxuICB9XG4gIGFkZChrZXksdmFsKXtcbiAgICAvLyB0aGlzLmNoaWxkLnB1c2goIHtuYW1lIDoga2V5LCB2YWw6IHZhbCwgaXNDZGF0YTogaXNDZGF0YSB9KTtcbiAgICBpZihrZXkgPT09IFwiX19wcm90b19fXCIpIGtleSA9IFwiI19fcHJvdG9fX1wiO1xuICAgIHRoaXMuY2hpbGQucHVzaCgge1trZXldOiB2YWwgfSk7XG4gIH1cbiAgYWRkQ2hpbGQobm9kZSkge1xuICAgIGlmKG5vZGUudGFnbmFtZSA9PT0gXCJfX3Byb3RvX19cIikgbm9kZS50YWduYW1lID0gXCIjX19wcm90b19fXCI7XG4gICAgaWYobm9kZVtcIjpAXCJdICYmIE9iamVjdC5rZXlzKG5vZGVbXCI6QFwiXSkubGVuZ3RoID4gMCl7XG4gICAgICB0aGlzLmNoaWxkLnB1c2goIHsgW25vZGUudGFnbmFtZV06IG5vZGUuY2hpbGQsIFtcIjpAXCJdOiBub2RlW1wiOkBcIl0gfSk7XG4gICAgfWVsc2V7XG4gICAgICB0aGlzLmNoaWxkLnB1c2goIHsgW25vZGUudGFnbmFtZV06IG5vZGUuY2hpbGQgfSk7XG4gICAgfVxuICB9O1xufTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IFhtbE5vZGU7IiwgImNvbnN0IHV0aWwgPSByZXF1aXJlKCcuLi91dGlsJyk7XG5cbmNsYXNzIERvY1R5cGVSZWFkZXIge1xuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICAgICAgdGhpcy5zdXBwcmVzc1ZhbGlkYXRpb25FcnIgPSAhb3B0aW9ucztcbiAgICAgICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICB9XG5cbiAgICByZWFkRG9jVHlwZSh4bWxEYXRhLCBpKSB7XG4gICAgICAgIGNvbnN0IGVudGl0aWVzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICAgICAgbGV0IGVudGl0eUNvdW50ID0gMDtcblxuICAgICAgICBpZiAoeG1sRGF0YVtpICsgM10gPT09ICdPJyAmJlxuICAgICAgICAgICAgeG1sRGF0YVtpICsgNF0gPT09ICdDJyAmJlxuICAgICAgICAgICAgeG1sRGF0YVtpICsgNV0gPT09ICdUJyAmJlxuICAgICAgICAgICAgeG1sRGF0YVtpICsgNl0gPT09ICdZJyAmJlxuICAgICAgICAgICAgeG1sRGF0YVtpICsgN10gPT09ICdQJyAmJlxuICAgICAgICAgICAgeG1sRGF0YVtpICsgOF0gPT09ICdFJykge1xuXG4gICAgICAgICAgICBpID0gaSArIDk7XG4gICAgICAgICAgICBsZXQgYW5nbGVCcmFja2V0c0NvdW50ID0gMTtcbiAgICAgICAgICAgIGxldCBoYXNCb2R5ID0gZmFsc2UsIGNvbW1lbnQgPSBmYWxzZTtcbiAgICAgICAgICAgIGxldCBleHAgPSBcIlwiO1xuXG4gICAgICAgICAgICBmb3IgKDsgaSA8IHhtbERhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoeG1sRGF0YVtpXSA9PT0gJzwnICYmICFjb21tZW50KSB7IC8vRGV0ZXJtaW5lIHRoZSB0YWcgdHlwZVxuICAgICAgICAgICAgICAgICAgICBpZiAoaGFzQm9keSAmJiBoYXNTZXEoeG1sRGF0YSwgXCIhRU5USVRZXCIsIGkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpICs9IDc7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgZW50aXR5TmFtZSwgdmFsO1xuICAgICAgICAgICAgICAgICAgICAgICAgW2VudGl0eU5hbWUsIHZhbCwgaV0gPSB0aGlzLnJlYWRFbnRpdHlFeHAoeG1sRGF0YSwgaSArIDEsIHRoaXMuc3VwcHJlc3NWYWxpZGF0aW9uRXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2YWwuaW5kZXhPZihcIiZcIikgPT09IC0xKSB7IC8vUGFyYW1ldGVyIGVudGl0aWVzIGFyZSBub3Qgc3VwcG9ydGVkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5lbmFibGVkICE9PSBmYWxzZSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm9wdGlvbnMubWF4RW50aXR5Q291bnQgIT0gbnVsbCAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbnRpdHlDb3VudCA+PSB0aGlzLm9wdGlvbnMubWF4RW50aXR5Q291bnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYEVudGl0eSBjb3VudCAoJHtlbnRpdHlDb3VudCArIDF9KSBleGNlZWRzIG1heGltdW0gYWxsb3dlZCAoJHt0aGlzLm9wdGlvbnMubWF4RW50aXR5Q291bnR9KWBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9jb25zdCBlc2NhcGVkID0gZW50aXR5TmFtZS5yZXBsYWNlKC9bLlxcLSsqOl0vZywgJ1xcXFwuJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZXNjYXBlZCA9IGVudGl0eU5hbWUucmVwbGFjZSgvWy4qKz9eJHt9KCl8W1xcXVxcXFxdL2csICdcXFxcJCYnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbnRpdGllc1tlbnRpdHlOYW1lXSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVneDogUmVnRXhwKGAmJHtlc2NhcGVkfTtgLCBcImdcIiksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbDogdmFsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbnRpdHlDb3VudCsrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGhhc0JvZHkgJiYgaGFzU2VxKHhtbERhdGEsIFwiIUVMRU1FTlRcIiwgaSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGkgKz0gODsgLy9Ob3Qgc3VwcG9ydGVkXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB7IGluZGV4IH0gPSB0aGlzLnJlYWRFbGVtZW50RXhwKHhtbERhdGEsIGkgKyAxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGkgPSBpbmRleDtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChoYXNCb2R5ICYmIGhhc1NlcSh4bWxEYXRhLCBcIiFBVFRMSVNUXCIsIGkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpICs9IDg7IC8vTm90IHN1cHBvcnRlZFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc3Qge2luZGV4fSA9IHRoaXMucmVhZEF0dGxpc3RFeHAoeG1sRGF0YSxpKzEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gaSA9IGluZGV4O1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGhhc0JvZHkgJiYgaGFzU2VxKHhtbERhdGEsIFwiIU5PVEFUSU9OXCIsIGkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpICs9IDk7IC8vTm90IHN1cHBvcnRlZFxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgeyBpbmRleCB9ID0gdGhpcy5yZWFkTm90YXRpb25FeHAoeG1sRGF0YSwgaSArIDEsIHRoaXMuc3VwcHJlc3NWYWxpZGF0aW9uRXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGkgPSBpbmRleDtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChoYXNTZXEoeG1sRGF0YSwgXCIhLS1cIiwgaSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1lbnQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIERPQ1RZUEVgKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGFuZ2xlQnJhY2tldHNDb3VudCsrO1xuICAgICAgICAgICAgICAgICAgICBleHAgPSBcIlwiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoeG1sRGF0YVtpXSA9PT0gJz4nKSB7IC8vUmVhZCB0YWcgY29udGVudFxuICAgICAgICAgICAgICAgICAgICBpZiAoY29tbWVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHhtbERhdGFbaSAtIDFdID09PSBcIi1cIiAmJiB4bWxEYXRhW2kgLSAyXSA9PT0gXCItXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21tZW50ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5nbGVCcmFja2V0c0NvdW50LS07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhbmdsZUJyYWNrZXRzQ291bnQtLTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoYW5nbGVCcmFja2V0c0NvdW50ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoeG1sRGF0YVtpXSA9PT0gJ1snKSB7XG4gICAgICAgICAgICAgICAgICAgIGhhc0JvZHkgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGV4cCArPSB4bWxEYXRhW2ldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGFuZ2xlQnJhY2tldHNDb3VudCAhPT0gMCkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5jbG9zZWQgRE9DVFlQRWApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIFRhZyBpbnN0ZWFkIG9mIERPQ1RZUEVgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7IGVudGl0aWVzLCBpIH07XG4gICAgfVxuXG4gICAgcmVhZEVudGl0eUV4cCh4bWxEYXRhLCBpKSB7XG4gICAgICAgIC8vRXh0ZXJuYWwgZW50aXRpZXMgYXJlIG5vdCBzdXBwb3J0ZWRcbiAgICAgICAgLy8gICAgPCFFTlRJVFkgZXh0IFNZU1RFTSBcImh0dHA6Ly9ub3JtYWwtd2Vic2l0ZS5jb21cIiA+XG5cbiAgICAgICAgLy9QYXJhbWV0ZXIgZW50aXRpZXMgYXJlIG5vdCBzdXBwb3J0ZWRcbiAgICAgICAgLy8gICAgPCFFTlRJVFkgZW50aXR5bmFtZSBcIiZhbm90aGVyRWxlbWVudDtcIj5cblxuICAgICAgICAvL0ludGVybmFsIGVudGl0aWVzIGFyZSBzdXBwb3J0ZWRcbiAgICAgICAgLy8gICAgPCFFTlRJVFkgZW50aXR5bmFtZSBcInJlcGxhY2VtZW50IHRleHRcIj5cblxuICAgICAgICAvLyBTa2lwIGxlYWRpbmcgd2hpdGVzcGFjZSBhZnRlciA8IUVOVElUWVxuICAgICAgICBpID0gc2tpcFdoaXRlc3BhY2UoeG1sRGF0YSwgaSk7XG5cbiAgICAgICAgLy8gUmVhZCBlbnRpdHkgbmFtZVxuICAgICAgICBsZXQgZW50aXR5TmFtZSA9IFwiXCI7XG4gICAgICAgIHdoaWxlIChpIDwgeG1sRGF0YS5sZW5ndGggJiYgIS9cXHMvLnRlc3QoeG1sRGF0YVtpXSkgJiYgeG1sRGF0YVtpXSAhPT0gJ1wiJyAmJiB4bWxEYXRhW2ldICE9PSBcIidcIikge1xuICAgICAgICAgICAgZW50aXR5TmFtZSArPSB4bWxEYXRhW2ldO1xuICAgICAgICAgICAgaSsrO1xuICAgICAgICB9XG4gICAgICAgIHZhbGlkYXRlRW50aXR5TmFtZShlbnRpdHlOYW1lKTtcblxuICAgICAgICAvLyBTa2lwIHdoaXRlc3BhY2UgYWZ0ZXIgZW50aXR5IG5hbWVcbiAgICAgICAgaSA9IHNraXBXaGl0ZXNwYWNlKHhtbERhdGEsIGkpO1xuXG4gICAgICAgIC8vIENoZWNrIGZvciB1bnN1cHBvcnRlZCBjb25zdHJ1Y3RzIChleHRlcm5hbCBlbnRpdGllcyBvciBwYXJhbWV0ZXIgZW50aXRpZXMpXG4gICAgICAgIGlmICghdGhpcy5zdXBwcmVzc1ZhbGlkYXRpb25FcnIpIHtcbiAgICAgICAgICAgIGlmICh4bWxEYXRhLnN1YnN0cmluZyhpLCBpICsgNikudG9VcHBlckNhc2UoKSA9PT0gXCJTWVNURU1cIikge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkV4dGVybmFsIGVudGl0aWVzIGFyZSBub3Qgc3VwcG9ydGVkXCIpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh4bWxEYXRhW2ldID09PSBcIiVcIikge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlBhcmFtZXRlciBlbnRpdGllcyBhcmUgbm90IHN1cHBvcnRlZFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFJlYWQgZW50aXR5IHZhbHVlIChpbnRlcm5hbCBlbnRpdHkpXG4gICAgICAgIGxldCBlbnRpdHlWYWx1ZSA9IFwiXCI7XG4gICAgICAgIFtpLCBlbnRpdHlWYWx1ZV0gPSB0aGlzLnJlYWRJZGVudGlmaWVyVmFsKHhtbERhdGEsIGksIFwiZW50aXR5XCIpO1xuXG4gICAgICAgIC8vIFZhbGlkYXRlIGVudGl0eSBzaXplXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuZW5hYmxlZCAhPT0gZmFsc2UgJiZcbiAgICAgICAgICAgIHRoaXMub3B0aW9ucy5tYXhFbnRpdHlTaXplICE9IG51bGwgJiZcbiAgICAgICAgICAgIGVudGl0eVZhbHVlLmxlbmd0aCA+IHRoaXMub3B0aW9ucy5tYXhFbnRpdHlTaXplKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgICAgICAgYEVudGl0eSBcIiR7ZW50aXR5TmFtZX1cIiBzaXplICgke2VudGl0eVZhbHVlLmxlbmd0aH0pIGV4Y2VlZHMgbWF4aW11bSBhbGxvd2VkIHNpemUgKCR7dGhpcy5vcHRpb25zLm1heEVudGl0eVNpemV9KWBcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBpLS07XG4gICAgICAgIHJldHVybiBbZW50aXR5TmFtZSwgZW50aXR5VmFsdWUsIGldO1xuICAgIH1cblxuICAgIHJlYWROb3RhdGlvbkV4cCh4bWxEYXRhLCBpKSB7XG4gICAgICAgIC8vIFNraXAgbGVhZGluZyB3aGl0ZXNwYWNlIGFmdGVyIDwhTk9UQVRJT05cbiAgICAgICAgaSA9IHNraXBXaGl0ZXNwYWNlKHhtbERhdGEsIGkpO1xuXG4gICAgICAgIC8vIFJlYWQgbm90YXRpb24gbmFtZVxuICAgICAgICBsZXQgbm90YXRpb25OYW1lID0gXCJcIjtcbiAgICAgICAgd2hpbGUgKGkgPCB4bWxEYXRhLmxlbmd0aCAmJiAhL1xccy8udGVzdCh4bWxEYXRhW2ldKSkge1xuICAgICAgICAgICAgbm90YXRpb25OYW1lICs9IHhtbERhdGFbaV07XG4gICAgICAgICAgICBpKys7XG4gICAgICAgIH1cbiAgICAgICAgIXRoaXMuc3VwcHJlc3NWYWxpZGF0aW9uRXJyICYmIHZhbGlkYXRlRW50aXR5TmFtZShub3RhdGlvbk5hbWUpO1xuXG4gICAgICAgIC8vIFNraXAgd2hpdGVzcGFjZSBhZnRlciBub3RhdGlvbiBuYW1lXG4gICAgICAgIGkgPSBza2lwV2hpdGVzcGFjZSh4bWxEYXRhLCBpKTtcblxuICAgICAgICAvLyBDaGVjayBpZGVudGlmaWVyIHR5cGUgKFNZU1RFTSBvciBQVUJMSUMpXG4gICAgICAgIGNvbnN0IGlkZW50aWZpZXJUeXBlID0geG1sRGF0YS5zdWJzdHJpbmcoaSwgaSArIDYpLnRvVXBwZXJDYXNlKCk7XG4gICAgICAgIGlmICghdGhpcy5zdXBwcmVzc1ZhbGlkYXRpb25FcnIgJiYgaWRlbnRpZmllclR5cGUgIT09IFwiU1lTVEVNXCIgJiYgaWRlbnRpZmllclR5cGUgIT09IFwiUFVCTElDXCIpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgRXhwZWN0ZWQgU1lTVEVNIG9yIFBVQkxJQywgZm91bmQgXCIke2lkZW50aWZpZXJUeXBlfVwiYCk7XG4gICAgICAgIH1cbiAgICAgICAgaSArPSBpZGVudGlmaWVyVHlwZS5sZW5ndGg7XG5cbiAgICAgICAgLy8gU2tpcCB3aGl0ZXNwYWNlIGFmdGVyIGlkZW50aWZpZXIgdHlwZVxuICAgICAgICBpID0gc2tpcFdoaXRlc3BhY2UoeG1sRGF0YSwgaSk7XG5cbiAgICAgICAgLy8gUmVhZCBwdWJsaWMgaWRlbnRpZmllciAoaWYgUFVCTElDKVxuICAgICAgICBsZXQgcHVibGljSWRlbnRpZmllciA9IG51bGw7XG4gICAgICAgIGxldCBzeXN0ZW1JZGVudGlmaWVyID0gbnVsbDtcblxuICAgICAgICBpZiAoaWRlbnRpZmllclR5cGUgPT09IFwiUFVCTElDXCIpIHtcbiAgICAgICAgICAgIFtpLCBwdWJsaWNJZGVudGlmaWVyXSA9IHRoaXMucmVhZElkZW50aWZpZXJWYWwoeG1sRGF0YSwgaSwgXCJwdWJsaWNJZGVudGlmaWVyXCIpO1xuXG4gICAgICAgICAgICAvLyBTa2lwIHdoaXRlc3BhY2UgYWZ0ZXIgcHVibGljIGlkZW50aWZpZXJcbiAgICAgICAgICAgIGkgPSBza2lwV2hpdGVzcGFjZSh4bWxEYXRhLCBpKTtcblxuICAgICAgICAgICAgLy8gT3B0aW9uYWxseSByZWFkIHN5c3RlbSBpZGVudGlmaWVyXG4gICAgICAgICAgICBpZiAoeG1sRGF0YVtpXSA9PT0gJ1wiJyB8fCB4bWxEYXRhW2ldID09PSBcIidcIikge1xuICAgICAgICAgICAgICAgIFtpLCBzeXN0ZW1JZGVudGlmaWVyXSA9IHRoaXMucmVhZElkZW50aWZpZXJWYWwoeG1sRGF0YSwgaSwgXCJzeXN0ZW1JZGVudGlmaWVyXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGlkZW50aWZpZXJUeXBlID09PSBcIlNZU1RFTVwiKSB7XG4gICAgICAgICAgICAvLyBSZWFkIHN5c3RlbSBpZGVudGlmaWVyIChtYW5kYXRvcnkgZm9yIFNZU1RFTSlcbiAgICAgICAgICAgIFtpLCBzeXN0ZW1JZGVudGlmaWVyXSA9IHRoaXMucmVhZElkZW50aWZpZXJWYWwoeG1sRGF0YSwgaSwgXCJzeXN0ZW1JZGVudGlmaWVyXCIpO1xuXG4gICAgICAgICAgICBpZiAoIXRoaXMuc3VwcHJlc3NWYWxpZGF0aW9uRXJyICYmICFzeXN0ZW1JZGVudGlmaWVyKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTWlzc2luZyBtYW5kYXRvcnkgc3lzdGVtIGlkZW50aWZpZXIgZm9yIFNZU1RFTSBub3RhdGlvblwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7IG5vdGF0aW9uTmFtZSwgcHVibGljSWRlbnRpZmllciwgc3lzdGVtSWRlbnRpZmllciwgaW5kZXg6IC0taSB9O1xuICAgIH1cblxuICAgIHJlYWRJZGVudGlmaWVyVmFsKHhtbERhdGEsIGksIHR5cGUpIHtcbiAgICAgICAgbGV0IGlkZW50aWZpZXJWYWwgPSBcIlwiO1xuICAgICAgICBjb25zdCBzdGFydENoYXIgPSB4bWxEYXRhW2ldO1xuICAgICAgICBpZiAoc3RhcnRDaGFyICE9PSAnXCInICYmIHN0YXJ0Q2hhciAhPT0gXCInXCIpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgRXhwZWN0ZWQgcXVvdGVkIHN0cmluZywgZm91bmQgXCIke3N0YXJ0Q2hhcn1cImApO1xuICAgICAgICB9XG4gICAgICAgIGkrKztcblxuICAgICAgICB3aGlsZSAoaSA8IHhtbERhdGEubGVuZ3RoICYmIHhtbERhdGFbaV0gIT09IHN0YXJ0Q2hhcikge1xuICAgICAgICAgICAgaWRlbnRpZmllclZhbCArPSB4bWxEYXRhW2ldO1xuICAgICAgICAgICAgaSsrO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHhtbERhdGFbaV0gIT09IHN0YXJ0Q2hhcikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbnRlcm1pbmF0ZWQgJHt0eXBlfSB2YWx1ZWApO1xuICAgICAgICB9XG4gICAgICAgIGkrKztcbiAgICAgICAgcmV0dXJuIFtpLCBpZGVudGlmaWVyVmFsXTtcbiAgICB9XG5cbiAgICByZWFkRWxlbWVudEV4cCh4bWxEYXRhLCBpKSB7XG4gICAgICAgIC8vIDwhRUxFTUVOVCBiciBFTVBUWT5cbiAgICAgICAgLy8gPCFFTEVNRU5UIGRpdiBBTlk+XG4gICAgICAgIC8vIDwhRUxFTUVOVCB0aXRsZSAoI1BDREFUQSk+XG4gICAgICAgIC8vIDwhRUxFTUVOVCBib29rICh0aXRsZSwgYXV0aG9yKyk+XG4gICAgICAgIC8vIDwhRUxFTUVOVCBuYW1lIChjb250ZW50LW1vZGVsKT5cblxuICAgICAgICAvLyBTa2lwIGxlYWRpbmcgd2hpdGVzcGFjZSBhZnRlciA8IUVMRU1FTlRcbiAgICAgICAgaSA9IHNraXBXaGl0ZXNwYWNlKHhtbERhdGEsIGkpO1xuXG4gICAgICAgIC8vIFJlYWQgZWxlbWVudCBuYW1lXG4gICAgICAgIGxldCBlbGVtZW50TmFtZSA9IFwiXCI7XG4gICAgICAgIHdoaWxlIChpIDwgeG1sRGF0YS5sZW5ndGggJiYgIS9cXHMvLnRlc3QoeG1sRGF0YVtpXSkpIHtcbiAgICAgICAgICAgIGVsZW1lbnROYW1lICs9IHhtbERhdGFbaV07XG4gICAgICAgICAgICBpKys7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBWYWxpZGF0ZSBlbGVtZW50IG5hbWVcbiAgICAgICAgaWYgKCF0aGlzLnN1cHByZXNzVmFsaWRhdGlvbkVyciAmJiAhdXRpbC5pc05hbWUoZWxlbWVudE5hbWUpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgZWxlbWVudCBuYW1lOiBcIiR7ZWxlbWVudE5hbWV9XCJgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFNraXAgd2hpdGVzcGFjZSBhZnRlciBlbGVtZW50IG5hbWVcbiAgICAgICAgaSA9IHNraXBXaGl0ZXNwYWNlKHhtbERhdGEsIGkpO1xuICAgICAgICBsZXQgY29udGVudE1vZGVsID0gXCJcIjtcblxuICAgICAgICAvLyBFeHBlY3QgJygnIHRvIHN0YXJ0IGNvbnRlbnQgbW9kZWxcbiAgICAgICAgaWYgKHhtbERhdGFbaV0gPT09IFwiRVwiICYmIGhhc1NlcSh4bWxEYXRhLCBcIk1QVFlcIiwgaSkpIHtcbiAgICAgICAgICAgIGkgKz0gNDtcbiAgICAgICAgfSBlbHNlIGlmICh4bWxEYXRhW2ldID09PSBcIkFcIiAmJiBoYXNTZXEoeG1sRGF0YSwgXCJOWVwiLCBpKSkge1xuICAgICAgICAgICAgaSArPSAyO1xuICAgICAgICB9IGVsc2UgaWYgKHhtbERhdGFbaV0gPT09IFwiKFwiKSB7XG4gICAgICAgICAgICBpKys7IC8vIE1vdmUgcGFzdCAnKCdcblxuICAgICAgICAgICAgLy8gUmVhZCBjb250ZW50IG1vZGVsXG4gICAgICAgICAgICB3aGlsZSAoaSA8IHhtbERhdGEubGVuZ3RoICYmIHhtbERhdGFbaV0gIT09IFwiKVwiKSB7XG4gICAgICAgICAgICAgICAgY29udGVudE1vZGVsICs9IHhtbERhdGFbaV07XG4gICAgICAgICAgICAgICAgaSsrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHhtbERhdGFbaV0gIT09IFwiKVwiKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVW50ZXJtaW5hdGVkIGNvbnRlbnQgbW9kZWxcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoIXRoaXMuc3VwcHJlc3NWYWxpZGF0aW9uRXJyKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgRWxlbWVudCBFeHByZXNzaW9uLCBmb3VuZCBcIiR7eG1sRGF0YVtpXX1cImApO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGVsZW1lbnROYW1lLFxuICAgICAgICAgICAgY29udGVudE1vZGVsOiBjb250ZW50TW9kZWwudHJpbSgpLFxuICAgICAgICAgICAgaW5kZXg6IGlcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICByZWFkQXR0bGlzdEV4cCh4bWxEYXRhLCBpKSB7XG4gICAgICAgIC8vIFNraXAgbGVhZGluZyB3aGl0ZXNwYWNlIGFmdGVyIDwhQVRUTElTVFxuICAgICAgICBpID0gc2tpcFdoaXRlc3BhY2UoeG1sRGF0YSwgaSk7XG5cbiAgICAgICAgLy8gUmVhZCBlbGVtZW50IG5hbWVcbiAgICAgICAgbGV0IGVsZW1lbnROYW1lID0gXCJcIjtcbiAgICAgICAgd2hpbGUgKGkgPCB4bWxEYXRhLmxlbmd0aCAmJiAhL1xccy8udGVzdCh4bWxEYXRhW2ldKSkge1xuICAgICAgICAgICAgZWxlbWVudE5hbWUgKz0geG1sRGF0YVtpXTtcbiAgICAgICAgICAgIGkrKztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFZhbGlkYXRlIGVsZW1lbnQgbmFtZVxuICAgICAgICB2YWxpZGF0ZUVudGl0eU5hbWUoZWxlbWVudE5hbWUpO1xuXG4gICAgICAgIC8vIFNraXAgd2hpdGVzcGFjZSBhZnRlciBlbGVtZW50IG5hbWVcbiAgICAgICAgaSA9IHNraXBXaGl0ZXNwYWNlKHhtbERhdGEsIGkpO1xuXG4gICAgICAgIC8vIFJlYWQgYXR0cmlidXRlIG5hbWVcbiAgICAgICAgbGV0IGF0dHJpYnV0ZU5hbWUgPSBcIlwiO1xuICAgICAgICB3aGlsZSAoaSA8IHhtbERhdGEubGVuZ3RoICYmICEvXFxzLy50ZXN0KHhtbERhdGFbaV0pKSB7XG4gICAgICAgICAgICBhdHRyaWJ1dGVOYW1lICs9IHhtbERhdGFbaV07XG4gICAgICAgICAgICBpKys7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBWYWxpZGF0ZSBhdHRyaWJ1dGUgbmFtZVxuICAgICAgICBpZiAoIXZhbGlkYXRlRW50aXR5TmFtZShhdHRyaWJ1dGVOYW1lKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGF0dHJpYnV0ZSBuYW1lOiBcIiR7YXR0cmlidXRlTmFtZX1cImApO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gU2tpcCB3aGl0ZXNwYWNlIGFmdGVyIGF0dHJpYnV0ZSBuYW1lXG4gICAgICAgIGkgPSBza2lwV2hpdGVzcGFjZSh4bWxEYXRhLCBpKTtcblxuICAgICAgICAvLyBSZWFkIGF0dHJpYnV0ZSB0eXBlXG4gICAgICAgIGxldCBhdHRyaWJ1dGVUeXBlID0gXCJcIjtcbiAgICAgICAgaWYgKHhtbERhdGEuc3Vic3RyaW5nKGksIGkgKyA4KS50b1VwcGVyQ2FzZSgpID09PSBcIk5PVEFUSU9OXCIpIHtcbiAgICAgICAgICAgIGF0dHJpYnV0ZVR5cGUgPSBcIk5PVEFUSU9OXCI7XG4gICAgICAgICAgICBpICs9IDg7IC8vIE1vdmUgcGFzdCBcIk5PVEFUSU9OXCJcblxuICAgICAgICAgICAgLy8gU2tpcCB3aGl0ZXNwYWNlIGFmdGVyIFwiTk9UQVRJT05cIlxuICAgICAgICAgICAgaSA9IHNraXBXaGl0ZXNwYWNlKHhtbERhdGEsIGkpO1xuXG4gICAgICAgICAgICAvLyBFeHBlY3QgJygnIHRvIHN0YXJ0IHRoZSBsaXN0IG9mIG5vdGF0aW9uc1xuICAgICAgICAgICAgaWYgKHhtbERhdGFbaV0gIT09IFwiKFwiKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBFeHBlY3RlZCAnKCcsIGZvdW5kIFwiJHt4bWxEYXRhW2ldfVwiYCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpKys7IC8vIE1vdmUgcGFzdCAnKCdcblxuICAgICAgICAgICAgLy8gUmVhZCB0aGUgbGlzdCBvZiBhbGxvd2VkIG5vdGF0aW9uc1xuICAgICAgICAgICAgbGV0IGFsbG93ZWROb3RhdGlvbnMgPSBbXTtcbiAgICAgICAgICAgIHdoaWxlIChpIDwgeG1sRGF0YS5sZW5ndGggJiYgeG1sRGF0YVtpXSAhPT0gXCIpXCIpIHtcbiAgICAgICAgICAgICAgICBsZXQgbm90YXRpb24gPSBcIlwiO1xuICAgICAgICAgICAgICAgIHdoaWxlIChpIDwgeG1sRGF0YS5sZW5ndGggJiYgeG1sRGF0YVtpXSAhPT0gXCJ8XCIgJiYgeG1sRGF0YVtpXSAhPT0gXCIpXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgbm90YXRpb24gKz0geG1sRGF0YVtpXTtcbiAgICAgICAgICAgICAgICAgICAgaSsrO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIFZhbGlkYXRlIG5vdGF0aW9uIG5hbWVcbiAgICAgICAgICAgICAgICBub3RhdGlvbiA9IG5vdGF0aW9uLnRyaW0oKTtcbiAgICAgICAgICAgICAgICBpZiAoIXZhbGlkYXRlRW50aXR5TmFtZShub3RhdGlvbikpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIG5vdGF0aW9uIG5hbWU6IFwiJHtub3RhdGlvbn1cImApO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGFsbG93ZWROb3RhdGlvbnMucHVzaChub3RhdGlvbik7XG5cbiAgICAgICAgICAgICAgICAvLyBTa2lwICd8JyBzZXBhcmF0b3Igb3IgZXhpdCBsb29wXG4gICAgICAgICAgICAgICAgaWYgKHhtbERhdGFbaV0gPT09IFwifFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGkrKzsgLy8gTW92ZSBwYXN0ICd8J1xuICAgICAgICAgICAgICAgICAgICBpID0gc2tpcFdoaXRlc3BhY2UoeG1sRGF0YSwgaSk7IC8vIFNraXAgb3B0aW9uYWwgd2hpdGVzcGFjZSBhZnRlciAnfCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh4bWxEYXRhW2ldICE9PSBcIilcIikge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlVudGVybWluYXRlZCBsaXN0IG9mIG5vdGF0aW9uc1wiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGkrKzsgLy8gTW92ZSBwYXN0ICcpJ1xuXG4gICAgICAgICAgICAvLyBTdG9yZSB0aGUgYWxsb3dlZCBub3RhdGlvbnMgYXMgcGFydCBvZiB0aGUgYXR0cmlidXRlIHR5cGVcbiAgICAgICAgICAgIGF0dHJpYnV0ZVR5cGUgKz0gXCIgKFwiICsgYWxsb3dlZE5vdGF0aW9ucy5qb2luKFwifFwiKSArIFwiKVwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gSGFuZGxlIHNpbXBsZSB0eXBlcyAoZS5nLiwgQ0RBVEEsIElELCBJRFJFRiwgZXRjLilcbiAgICAgICAgICAgIHdoaWxlIChpIDwgeG1sRGF0YS5sZW5ndGggJiYgIS9cXHMvLnRlc3QoeG1sRGF0YVtpXSkpIHtcbiAgICAgICAgICAgICAgICBhdHRyaWJ1dGVUeXBlICs9IHhtbERhdGFbaV07XG4gICAgICAgICAgICAgICAgaSsrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBWYWxpZGF0ZSBzaW1wbGUgYXR0cmlidXRlIHR5cGVcbiAgICAgICAgICAgIGNvbnN0IHZhbGlkVHlwZXMgPSBbXCJDREFUQVwiLCBcIklEXCIsIFwiSURSRUZcIiwgXCJJRFJFRlNcIiwgXCJFTlRJVFlcIiwgXCJFTlRJVElFU1wiLCBcIk5NVE9LRU5cIiwgXCJOTVRPS0VOU1wiXTtcbiAgICAgICAgICAgIGlmICghdGhpcy5zdXBwcmVzc1ZhbGlkYXRpb25FcnIgJiYgIXZhbGlkVHlwZXMuaW5jbHVkZXMoYXR0cmlidXRlVHlwZS50b1VwcGVyQ2FzZSgpKSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBhdHRyaWJ1dGUgdHlwZTogXCIke2F0dHJpYnV0ZVR5cGV9XCJgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFNraXAgd2hpdGVzcGFjZSBhZnRlciBhdHRyaWJ1dGUgdHlwZVxuICAgICAgICBpID0gc2tpcFdoaXRlc3BhY2UoeG1sRGF0YSwgaSk7XG5cbiAgICAgICAgLy8gUmVhZCBkZWZhdWx0IHZhbHVlXG4gICAgICAgIGxldCBkZWZhdWx0VmFsdWUgPSBcIlwiO1xuICAgICAgICBpZiAoeG1sRGF0YS5zdWJzdHJpbmcoaSwgaSArIDgpLnRvVXBwZXJDYXNlKCkgPT09IFwiI1JFUVVJUkVEXCIpIHtcbiAgICAgICAgICAgIGRlZmF1bHRWYWx1ZSA9IFwiI1JFUVVJUkVEXCI7XG4gICAgICAgICAgICBpICs9IDg7XG4gICAgICAgIH0gZWxzZSBpZiAoeG1sRGF0YS5zdWJzdHJpbmcoaSwgaSArIDcpLnRvVXBwZXJDYXNlKCkgPT09IFwiI0lNUExJRURcIikge1xuICAgICAgICAgICAgZGVmYXVsdFZhbHVlID0gXCIjSU1QTElFRFwiO1xuICAgICAgICAgICAgaSArPSA3O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgW2ksIGRlZmF1bHRWYWx1ZV0gPSB0aGlzLnJlYWRJZGVudGlmaWVyVmFsKHhtbERhdGEsIGksIFwiQVRUTElTVFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBlbGVtZW50TmFtZSxcbiAgICAgICAgICAgIGF0dHJpYnV0ZU5hbWUsXG4gICAgICAgICAgICBhdHRyaWJ1dGVUeXBlLFxuICAgICAgICAgICAgZGVmYXVsdFZhbHVlLFxuICAgICAgICAgICAgaW5kZXg6IGlcbiAgICAgICAgfTtcbiAgICB9XG59XG5cbi8vIEhlbHBlciBmdW5jdGlvbnNcbmNvbnN0IHNraXBXaGl0ZXNwYWNlID0gKGRhdGEsIGluZGV4KSA9PiB7XG4gICAgd2hpbGUgKGluZGV4IDwgZGF0YS5sZW5ndGggJiYgL1xccy8udGVzdChkYXRhW2luZGV4XSkpIHtcbiAgICAgICAgaW5kZXgrKztcbiAgICB9XG4gICAgcmV0dXJuIGluZGV4O1xufTtcblxuZnVuY3Rpb24gaGFzU2VxKGRhdGEsIHNlcSwgaSkge1xuICAgIGZvciAobGV0IGogPSAwOyBqIDwgc2VxLmxlbmd0aDsgaisrKSB7XG4gICAgICAgIGlmIChzZXFbal0gIT09IGRhdGFbaSArIGogKyAxXSkgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gdmFsaWRhdGVFbnRpdHlOYW1lKG5hbWUpIHtcbiAgICBpZiAodXRpbC5pc05hbWUobmFtZSkpXG4gICAgICAgIHJldHVybiBuYW1lO1xuICAgIGVsc2VcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGVudGl0eSBuYW1lICR7bmFtZX1gKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBEb2NUeXBlUmVhZGVyOyIsICJjb25zdCBoZXhSZWdleCA9IC9eWy0rXT8weFthLWZBLUYwLTldKyQvO1xuY29uc3QgbnVtUmVnZXggPSAvXihbXFwtXFwrXSk/KDAqKShbMC05XSooXFwuWzAtOV0qKT8pJC87XG4vLyBjb25zdCBvY3RSZWdleCA9IC9eMHhbYS16MC05XSsvO1xuLy8gY29uc3QgYmluUmVnZXggPSAvMHhbYS16MC05XSsvO1xuXG4gXG5jb25zdCBjb25zaWRlciA9IHtcbiAgICBoZXggOiAgdHJ1ZSxcbiAgICAvLyBvY3Q6IGZhbHNlLFxuICAgIGxlYWRpbmdaZXJvczogdHJ1ZSxcbiAgICBkZWNpbWFsUG9pbnQ6IFwiXFwuXCIsXG4gICAgZU5vdGF0aW9uOiB0cnVlLFxuICAgIC8vc2tpcExpa2U6IC9yZWdleC9cbn07XG5cbmZ1bmN0aW9uIHRvTnVtYmVyKHN0ciwgb3B0aW9ucyA9IHt9KXtcbiAgICBvcHRpb25zID0gT2JqZWN0LmFzc2lnbih7fSwgY29uc2lkZXIsIG9wdGlvbnMgKTtcbiAgICBpZighc3RyIHx8IHR5cGVvZiBzdHIgIT09IFwic3RyaW5nXCIgKSByZXR1cm4gc3RyO1xuICAgIFxuICAgIGxldCB0cmltbWVkU3RyICA9IHN0ci50cmltKCk7XG4gICAgXG4gICAgaWYob3B0aW9ucy5za2lwTGlrZSAhPT0gdW5kZWZpbmVkICYmIG9wdGlvbnMuc2tpcExpa2UudGVzdCh0cmltbWVkU3RyKSkgcmV0dXJuIHN0cjtcbiAgICBlbHNlIGlmKHN0cj09PVwiMFwiKSByZXR1cm4gMDtcbiAgICBlbHNlIGlmIChvcHRpb25zLmhleCAmJiBoZXhSZWdleC50ZXN0KHRyaW1tZWRTdHIpKSB7XG4gICAgICAgIHJldHVybiBwYXJzZV9pbnQodHJpbW1lZFN0ciwgMTYpO1xuICAgIC8vIH1lbHNlIGlmIChvcHRpb25zLm9jdCAmJiBvY3RSZWdleC50ZXN0KHN0cikpIHtcbiAgICAvLyAgICAgcmV0dXJuIE51bWJlci5wYXJzZUludCh2YWwsIDgpO1xuICAgIH1lbHNlIGlmICh0cmltbWVkU3RyLnNlYXJjaCgvW2VFXS8pIT09IC0xKSB7IC8vZU5vdGF0aW9uXG4gICAgICAgIGNvbnN0IG5vdGF0aW9uID0gdHJpbW1lZFN0ci5tYXRjaCgvXihbLVxcK10pPygwKikoWzAtOV0qKFxcLlswLTldKik/W2VFXVstXFwrXT9bMC05XSspJC8pOyBcbiAgICAgICAgLy8gKzAwLjEyMyA9PiBbICwgJysnLCAnMDAnLCAnLjEyMycsIC4uXG4gICAgICAgIGlmKG5vdGF0aW9uKXtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKG5vdGF0aW9uKVxuICAgICAgICAgICAgaWYob3B0aW9ucy5sZWFkaW5nWmVyb3MpeyAvL2FjY2VwdCB3aXRoIGxlYWRpbmcgemVyb3NcbiAgICAgICAgICAgICAgICB0cmltbWVkU3RyID0gKG5vdGF0aW9uWzFdIHx8IFwiXCIpICsgbm90YXRpb25bM107XG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICBpZihub3RhdGlvblsyXSA9PT0gXCIwXCIgJiYgbm90YXRpb25bM11bMF09PT0gXCIuXCIpeyAvL3ZhbGlkIG51bWJlclxuICAgICAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc3RyO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBvcHRpb25zLmVOb3RhdGlvbiA/IE51bWJlcih0cmltbWVkU3RyKSA6IHN0cjtcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICByZXR1cm4gc3RyO1xuICAgICAgICB9XG4gICAgLy8gfWVsc2UgaWYgKG9wdGlvbnMucGFyc2VCaW4gJiYgYmluUmVnZXgudGVzdChzdHIpKSB7XG4gICAgLy8gICAgIHJldHVybiBOdW1iZXIucGFyc2VJbnQodmFsLCAyKTtcbiAgICB9ZWxzZXtcbiAgICAgICAgLy9zZXBhcmF0ZSBuZWdhdGl2ZSBzaWduLCBsZWFkaW5nIHplcm9zLCBhbmQgcmVzdCBudW1iZXJcbiAgICAgICAgY29uc3QgbWF0Y2ggPSBudW1SZWdleC5leGVjKHRyaW1tZWRTdHIpO1xuICAgICAgICAvLyArMDAuMTIzID0+IFsgLCAnKycsICcwMCcsICcuMTIzJywgLi5cbiAgICAgICAgaWYobWF0Y2gpe1xuICAgICAgICAgICAgY29uc3Qgc2lnbiA9IG1hdGNoWzFdO1xuICAgICAgICAgICAgY29uc3QgbGVhZGluZ1plcm9zID0gbWF0Y2hbMl07XG4gICAgICAgICAgICBsZXQgbnVtVHJpbW1lZEJ5WmVyb3MgPSB0cmltWmVyb3MobWF0Y2hbM10pOyAvL2NvbXBsZXRlIG51bSB3aXRob3V0IGxlYWRpbmcgemVyb3NcbiAgICAgICAgICAgIC8vdHJpbSBlbmRpbmcgemVyb3MgZm9yIGZsb2F0aW5nIG51bWJlclxuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZighb3B0aW9ucy5sZWFkaW5nWmVyb3MgJiYgbGVhZGluZ1plcm9zLmxlbmd0aCA+IDAgJiYgc2lnbiAmJiB0cmltbWVkU3RyWzJdICE9PSBcIi5cIikgcmV0dXJuIHN0cjsgLy8tMDEyM1xuICAgICAgICAgICAgZWxzZSBpZighb3B0aW9ucy5sZWFkaW5nWmVyb3MgJiYgbGVhZGluZ1plcm9zLmxlbmd0aCA+IDAgJiYgIXNpZ24gJiYgdHJpbW1lZFN0clsxXSAhPT0gXCIuXCIpIHJldHVybiBzdHI7IC8vMDEyM1xuICAgICAgICAgICAgZWxzZSBpZihvcHRpb25zLmxlYWRpbmdaZXJvcyAmJiBsZWFkaW5nWmVyb3M9PT1zdHIpIHJldHVybiAwOyAvLzAwXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGVsc2V7Ly9ubyBsZWFkaW5nIHplcm9zIG9yIGxlYWRpbmcgemVyb3MgYXJlIGFsbG93ZWRcbiAgICAgICAgICAgICAgICBjb25zdCBudW0gPSBOdW1iZXIodHJpbW1lZFN0cik7XG4gICAgICAgICAgICAgICAgY29uc3QgbnVtU3RyID0gXCJcIiArIG51bTtcblxuICAgICAgICAgICAgICAgIGlmKG51bVN0ci5zZWFyY2goL1tlRV0vKSAhPT0gLTEpeyAvL2dpdmVuIG51bWJlciBpcyBsb25nIGFuZCBwYXJzZWQgdG8gZU5vdGF0aW9uXG4gICAgICAgICAgICAgICAgICAgIGlmKG9wdGlvbnMuZU5vdGF0aW9uKSByZXR1cm4gbnVtO1xuICAgICAgICAgICAgICAgICAgICBlbHNlIHJldHVybiBzdHI7XG4gICAgICAgICAgICAgICAgfWVsc2UgaWYodHJpbW1lZFN0ci5pbmRleE9mKFwiLlwiKSAhPT0gLTEpeyAvL2Zsb2F0aW5nIG51bWJlclxuICAgICAgICAgICAgICAgICAgICBpZihudW1TdHIgPT09IFwiMFwiICYmIChudW1UcmltbWVkQnlaZXJvcyA9PT0gXCJcIikgKSByZXR1cm4gbnVtOyAvLzAuMFxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmKG51bVN0ciA9PT0gbnVtVHJpbW1lZEJ5WmVyb3MpIHJldHVybiBudW07IC8vMC40NTYuIDAuNzkwMDBcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiggc2lnbiAmJiBudW1TdHIgPT09IFwiLVwiK251bVRyaW1tZWRCeVplcm9zKSByZXR1cm4gbnVtO1xuICAgICAgICAgICAgICAgICAgICBlbHNlIHJldHVybiBzdHI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmKGxlYWRpbmdaZXJvcyl7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAobnVtVHJpbW1lZEJ5WmVyb3MgPT09IG51bVN0cikgfHwgKHNpZ24rbnVtVHJpbW1lZEJ5WmVyb3MgPT09IG51bVN0cikgPyBudW0gOiBzdHJcbiAgICAgICAgICAgICAgICB9ZWxzZSAge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKHRyaW1tZWRTdHIgPT09IG51bVN0cikgfHwgKHRyaW1tZWRTdHIgPT09IHNpZ24rbnVtU3RyKSA/IG51bSA6IHN0clxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfWVsc2V7IC8vbm9uLW51bWVyaWMgc3RyaW5nXG4gICAgICAgICAgICByZXR1cm4gc3RyO1xuICAgICAgICB9XG4gICAgfVxufVxuXG4vKipcbiAqIFxuICogQHBhcmFtIHtzdHJpbmd9IG51bVN0ciB3aXRob3V0IGxlYWRpbmcgemVyb3NcbiAqIEByZXR1cm5zIFxuICovXG5mdW5jdGlvbiB0cmltWmVyb3MobnVtU3RyKXtcbiAgICBpZihudW1TdHIgJiYgbnVtU3RyLmluZGV4T2YoXCIuXCIpICE9PSAtMSl7Ly9mbG9hdFxuICAgICAgICBudW1TdHIgPSBudW1TdHIucmVwbGFjZSgvMCskLywgXCJcIik7IC8vcmVtb3ZlIGVuZGluZyB6ZXJvc1xuICAgICAgICBpZihudW1TdHIgPT09IFwiLlwiKSAgbnVtU3RyID0gXCIwXCI7XG4gICAgICAgIGVsc2UgaWYobnVtU3RyWzBdID09PSBcIi5cIikgIG51bVN0ciA9IFwiMFwiK251bVN0cjtcbiAgICAgICAgZWxzZSBpZihudW1TdHJbbnVtU3RyLmxlbmd0aC0xXSA9PT0gXCIuXCIpICBudW1TdHIgPSBudW1TdHIuc3Vic3RyKDAsbnVtU3RyLmxlbmd0aC0xKTtcbiAgICAgICAgcmV0dXJuIG51bVN0cjtcbiAgICB9XG4gICAgcmV0dXJuIG51bVN0cjtcbn1cblxuZnVuY3Rpb24gcGFyc2VfaW50KG51bVN0ciwgYmFzZSl7XG4gICAgLy9wb2x5ZmlsbFxuICAgIGlmKHBhcnNlSW50KSByZXR1cm4gcGFyc2VJbnQobnVtU3RyLCBiYXNlKTtcbiAgICBlbHNlIGlmKE51bWJlci5wYXJzZUludCkgcmV0dXJuIE51bWJlci5wYXJzZUludChudW1TdHIsIGJhc2UpO1xuICAgIGVsc2UgaWYod2luZG93ICYmIHdpbmRvdy5wYXJzZUludCkgcmV0dXJuIHdpbmRvdy5wYXJzZUludChudW1TdHIsIGJhc2UpO1xuICAgIGVsc2UgdGhyb3cgbmV3IEVycm9yKFwicGFyc2VJbnQsIE51bWJlci5wYXJzZUludCwgd2luZG93LnBhcnNlSW50IGFyZSBub3Qgc3VwcG9ydGVkXCIpXG59XG5cbm1vZHVsZS5leHBvcnRzID0gdG9OdW1iZXI7IiwgImZ1bmN0aW9uIGdldElnbm9yZUF0dHJpYnV0ZXNGbihpZ25vcmVBdHRyaWJ1dGVzKSB7XG4gICAgaWYgKHR5cGVvZiBpZ25vcmVBdHRyaWJ1dGVzID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHJldHVybiBpZ25vcmVBdHRyaWJ1dGVzXG4gICAgfVxuICAgIGlmIChBcnJheS5pc0FycmF5KGlnbm9yZUF0dHJpYnV0ZXMpKSB7XG4gICAgICAgIHJldHVybiAoYXR0ck5hbWUpID0+IHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgcGF0dGVybiBvZiBpZ25vcmVBdHRyaWJ1dGVzKSB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBwYXR0ZXJuID09PSAnc3RyaW5nJyAmJiBhdHRyTmFtZSA9PT0gcGF0dGVybikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAocGF0dGVybiBpbnN0YW5jZW9mIFJlZ0V4cCAmJiBwYXR0ZXJuLnRlc3QoYXR0ck5hbWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiAoKSA9PiBmYWxzZVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdldElnbm9yZUF0dHJpYnV0ZXNGbiIsICIndXNlIHN0cmljdCc7XG4vLy9AdHMtY2hlY2tcblxuY29uc3QgdXRpbCA9IHJlcXVpcmUoJy4uL3V0aWwnKTtcbmNvbnN0IHhtbE5vZGUgPSByZXF1aXJlKCcuL3htbE5vZGUnKTtcbmNvbnN0IERvY1R5cGVSZWFkZXIgPSByZXF1aXJlKCcuL0RvY1R5cGVSZWFkZXInKTtcbmNvbnN0IHRvTnVtYmVyID0gcmVxdWlyZShcInN0cm51bVwiKTtcbmNvbnN0IGdldElnbm9yZUF0dHJpYnV0ZXNGbiA9IHJlcXVpcmUoJy4uL2lnbm9yZUF0dHJpYnV0ZXMnKVxuXG4vLyBjb25zdCByZWd4ID1cbi8vICAgJzwoKCFcXFxcW0NEQVRBXFxcXFsoW1xcXFxzXFxcXFNdKj8pKF1dPikpfCgoTkFNRTopPyhOQU1FKSkoW14+XSopPnwoKFxcXFwvKShOQU1FKVxcXFxzKj4pKShbXjxdKiknXG4vLyAgIC5yZXBsYWNlKC9OQU1FL2csIHV0aWwubmFtZVJlZ2V4cCk7XG5cbi8vY29uc3QgdGFnc1JlZ3ggPSBuZXcgUmVnRXhwKFwiPChcXFxcLz9bXFxcXHc6XFxcXC1cXC5fXSspKFtePl0qKT4oXFxcXHMqXCIrY2RhdGFSZWd4K1wiKSooW148XSspP1wiLFwiZ1wiKTtcbi8vY29uc3QgdGFnc1JlZ3ggPSBuZXcgUmVnRXhwKFwiPChcXFxcLz8pKChcXFxcdyo6KT8oW1xcXFx3OlxcXFwtXFwuX10rKSkoW14+XSopPihbXjxdKikoXCIrY2RhdGFSZWd4K1wiKFtePF0qKSkqKFtePF0rKT9cIixcImdcIik7XG5cbmNsYXNzIE9yZGVyZWRPYmpQYXJzZXIge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgICB0aGlzLmN1cnJlbnROb2RlID0gbnVsbDtcbiAgICB0aGlzLnRhZ3NOb2RlU3RhY2sgPSBbXTtcbiAgICB0aGlzLmRvY1R5cGVFbnRpdGllcyA9IHt9O1xuICAgIHRoaXMubGFzdEVudGl0aWVzID0ge1xuICAgICAgXCJhcG9zXCI6IHsgcmVnZXg6IC8mKGFwb3N8IzM5fCN4MjcpOy9nLCB2YWw6IFwiJ1wiIH0sXG4gICAgICBcImd0XCI6IHsgcmVnZXg6IC8mKGd0fCM2MnwjeDNFKTsvZywgdmFsOiBcIj5cIiB9LFxuICAgICAgXCJsdFwiOiB7IHJlZ2V4OiAvJihsdHwjNjB8I3gzQyk7L2csIHZhbDogXCI8XCIgfSxcbiAgICAgIFwicXVvdFwiOiB7IHJlZ2V4OiAvJihxdW90fCMzNHwjeDIyKTsvZywgdmFsOiBcIlxcXCJcIiB9LFxuICAgIH07XG4gICAgdGhpcy5hbXBFbnRpdHkgPSB7IHJlZ2V4OiAvJihhbXB8IzM4fCN4MjYpOy9nLCB2YWw6IFwiJlwiIH07XG4gICAgdGhpcy5odG1sRW50aXRpZXMgPSB7XG4gICAgICBcInNwYWNlXCI6IHsgcmVnZXg6IC8mKG5ic3B8IzE2MCk7L2csIHZhbDogXCIgXCIgfSxcbiAgICAgIC8vIFwibHRcIiA6IHsgcmVnZXg6IC8mKGx0fCM2MCk7L2csIHZhbDogXCI8XCIgfSxcbiAgICAgIC8vIFwiZ3RcIiA6IHsgcmVnZXg6IC8mKGd0fCM2Mik7L2csIHZhbDogXCI+XCIgfSxcbiAgICAgIC8vIFwiYW1wXCIgOiB7IHJlZ2V4OiAvJihhbXB8IzM4KTsvZywgdmFsOiBcIiZcIiB9LFxuICAgICAgLy8gXCJxdW90XCIgOiB7IHJlZ2V4OiAvJihxdW90fCMzNCk7L2csIHZhbDogXCJcXFwiXCIgfSxcbiAgICAgIC8vIFwiYXBvc1wiIDogeyByZWdleDogLyYoYXBvc3wjMzkpOy9nLCB2YWw6IFwiJ1wiIH0sXG4gICAgICBcImNlbnRcIjogeyByZWdleDogLyYoY2VudHwjMTYyKTsvZywgdmFsOiBcIlx1MDBBMlwiIH0sXG4gICAgICBcInBvdW5kXCI6IHsgcmVnZXg6IC8mKHBvdW5kfCMxNjMpOy9nLCB2YWw6IFwiXHUwMEEzXCIgfSxcbiAgICAgIFwieWVuXCI6IHsgcmVnZXg6IC8mKHllbnwjMTY1KTsvZywgdmFsOiBcIlx1MDBBNVwiIH0sXG4gICAgICBcImV1cm9cIjogeyByZWdleDogLyYoZXVyb3wjODM2NCk7L2csIHZhbDogXCJcdTIwQUNcIiB9LFxuICAgICAgXCJjb3B5cmlnaHRcIjogeyByZWdleDogLyYoY29weXwjMTY5KTsvZywgdmFsOiBcIlx1MDBBOVwiIH0sXG4gICAgICBcInJlZ1wiOiB7IHJlZ2V4OiAvJihyZWd8IzE3NCk7L2csIHZhbDogXCJcdTAwQUVcIiB9LFxuICAgICAgXCJpbnJcIjogeyByZWdleDogLyYoaW5yfCM4Mzc3KTsvZywgdmFsOiBcIlx1MjBCOVwiIH0sXG4gICAgICBcIm51bV9kZWNcIjogeyByZWdleDogLyYjKFswLTldezEsN30pOy9nLCB2YWw6IChfLCBzdHIpID0+IGZyb21Db2RlUG9pbnQoc3RyLCAxMCwgXCImI1wiKSB9LFxuICAgICAgXCJudW1faGV4XCI6IHsgcmVnZXg6IC8mI3goWzAtOWEtZkEtRl17MSw2fSk7L2csIHZhbDogKF8sIHN0cikgPT4gZnJvbUNvZGVQb2ludChzdHIsIDE2LCBcIiYjeFwiKSB9LFxuICAgIH07XG4gICAgdGhpcy5hZGRFeHRlcm5hbEVudGl0aWVzID0gYWRkRXh0ZXJuYWxFbnRpdGllcztcbiAgICB0aGlzLnBhcnNlWG1sID0gcGFyc2VYbWw7XG4gICAgdGhpcy5wYXJzZVRleHREYXRhID0gcGFyc2VUZXh0RGF0YTtcbiAgICB0aGlzLnJlc29sdmVOYW1lU3BhY2UgPSByZXNvbHZlTmFtZVNwYWNlO1xuICAgIHRoaXMuYnVpbGRBdHRyaWJ1dGVzTWFwID0gYnVpbGRBdHRyaWJ1dGVzTWFwO1xuICAgIHRoaXMuaXNJdFN0b3BOb2RlID0gaXNJdFN0b3BOb2RlO1xuICAgIHRoaXMucmVwbGFjZUVudGl0aWVzVmFsdWUgPSByZXBsYWNlRW50aXRpZXNWYWx1ZTtcbiAgICB0aGlzLnJlYWRTdG9wTm9kZURhdGEgPSByZWFkU3RvcE5vZGVEYXRhO1xuICAgIHRoaXMuc2F2ZVRleHRUb1BhcmVudFRhZyA9IHNhdmVUZXh0VG9QYXJlbnRUYWc7XG4gICAgdGhpcy5hZGRDaGlsZCA9IGFkZENoaWxkO1xuICAgIHRoaXMuaWdub3JlQXR0cmlidXRlc0ZuID0gZ2V0SWdub3JlQXR0cmlidXRlc0ZuKHRoaXMub3B0aW9ucy5pZ25vcmVBdHRyaWJ1dGVzKVxuICAgIHRoaXMuZW50aXR5RXhwYW5zaW9uQ291bnQgPSAwO1xuICAgIHRoaXMuY3VycmVudEV4cGFuZGVkTGVuZ3RoID0gMDtcblxuICAgIGlmICh0aGlzLm9wdGlvbnMuc3RvcE5vZGVzICYmIHRoaXMub3B0aW9ucy5zdG9wTm9kZXMubGVuZ3RoID4gMCkge1xuICAgICAgdGhpcy5zdG9wTm9kZXNFeGFjdCA9IG5ldyBTZXQoKTtcbiAgICAgIHRoaXMuc3RvcE5vZGVzV2lsZGNhcmQgPSBuZXcgU2V0KCk7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMub3B0aW9ucy5zdG9wTm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3Qgc3RvcE5vZGVFeHAgPSB0aGlzLm9wdGlvbnMuc3RvcE5vZGVzW2ldO1xuICAgICAgICBpZiAodHlwZW9mIHN0b3BOb2RlRXhwICE9PSAnc3RyaW5nJykgY29udGludWU7XG4gICAgICAgIGlmIChzdG9wTm9kZUV4cC5zdGFydHNXaXRoKFwiKi5cIikpIHtcbiAgICAgICAgICB0aGlzLnN0b3BOb2Rlc1dpbGRjYXJkLmFkZChzdG9wTm9kZUV4cC5zdWJzdHJpbmcoMikpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuc3RvcE5vZGVzRXhhY3QuYWRkKHN0b3BOb2RlRXhwKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG59XG5cbmZ1bmN0aW9uIGFkZEV4dGVybmFsRW50aXRpZXMoZXh0ZXJuYWxFbnRpdGllcykge1xuICBjb25zdCBlbnRLZXlzID0gT2JqZWN0LmtleXMoZXh0ZXJuYWxFbnRpdGllcyk7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgZW50S2V5cy5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IGVudCA9IGVudEtleXNbaV07XG4gICAgY29uc3QgZXNjYXBlZCA9IGVudC5yZXBsYWNlKC9bLlxcLSsqOl0vZywgJ1xcXFwuJyk7XG4gICAgdGhpcy5sYXN0RW50aXRpZXNbZW50XSA9IHtcbiAgICAgIHJlZ2V4OiBuZXcgUmVnRXhwKFwiJlwiICsgZXNjYXBlZCArIFwiO1wiLCBcImdcIiksXG4gICAgICB2YWw6IGV4dGVybmFsRW50aXRpZXNbZW50XVxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIEBwYXJhbSB7c3RyaW5nfSB2YWxcbiAqIEBwYXJhbSB7c3RyaW5nfSB0YWdOYW1lXG4gKiBAcGFyYW0ge3N0cmluZ30galBhdGhcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gZG9udFRyaW1cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gaGFzQXR0cmlidXRlc1xuICogQHBhcmFtIHtib29sZWFufSBpc0xlYWZOb2RlXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGVzY2FwZUVudGl0aWVzXG4gKi9cbmZ1bmN0aW9uIHBhcnNlVGV4dERhdGEodmFsLCB0YWdOYW1lLCBqUGF0aCwgZG9udFRyaW0sIGhhc0F0dHJpYnV0ZXMsIGlzTGVhZk5vZGUsIGVzY2FwZUVudGl0aWVzKSB7XG4gIGlmICh2YWwgIT09IHVuZGVmaW5lZCkge1xuICAgIGlmICh0aGlzLm9wdGlvbnMudHJpbVZhbHVlcyAmJiAhZG9udFRyaW0pIHtcbiAgICAgIHZhbCA9IHZhbC50cmltKCk7XG4gICAgfVxuICAgIGlmICh2YWwubGVuZ3RoID4gMCkge1xuICAgICAgaWYgKCFlc2NhcGVFbnRpdGllcykgdmFsID0gdGhpcy5yZXBsYWNlRW50aXRpZXNWYWx1ZSh2YWwsIHRhZ05hbWUsIGpQYXRoKTtcblxuICAgICAgY29uc3QgbmV3dmFsID0gdGhpcy5vcHRpb25zLnRhZ1ZhbHVlUHJvY2Vzc29yKHRhZ05hbWUsIHZhbCwgalBhdGgsIGhhc0F0dHJpYnV0ZXMsIGlzTGVhZk5vZGUpO1xuICAgICAgaWYgKG5ld3ZhbCA9PT0gbnVsbCB8fCBuZXd2YWwgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAvL2Rvbid0IHBhcnNlXG4gICAgICAgIHJldHVybiB2YWw7XG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiBuZXd2YWwgIT09IHR5cGVvZiB2YWwgfHwgbmV3dmFsICE9PSB2YWwpIHtcbiAgICAgICAgLy9vdmVyd3JpdGVcbiAgICAgICAgcmV0dXJuIG5ld3ZhbDtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5vcHRpb25zLnRyaW1WYWx1ZXMpIHtcbiAgICAgICAgcmV0dXJuIHBhcnNlVmFsdWUodmFsLCB0aGlzLm9wdGlvbnMucGFyc2VUYWdWYWx1ZSwgdGhpcy5vcHRpb25zLm51bWJlclBhcnNlT3B0aW9ucyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCB0cmltbWVkVmFsID0gdmFsLnRyaW0oKTtcbiAgICAgICAgaWYgKHRyaW1tZWRWYWwgPT09IHZhbCkge1xuICAgICAgICAgIHJldHVybiBwYXJzZVZhbHVlKHZhbCwgdGhpcy5vcHRpb25zLnBhcnNlVGFnVmFsdWUsIHRoaXMub3B0aW9ucy5udW1iZXJQYXJzZU9wdGlvbnMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiB2YWw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gcmVzb2x2ZU5hbWVTcGFjZSh0YWduYW1lKSB7XG4gIGlmICh0aGlzLm9wdGlvbnMucmVtb3ZlTlNQcmVmaXgpIHtcbiAgICBjb25zdCB0YWdzID0gdGFnbmFtZS5zcGxpdCgnOicpO1xuICAgIGNvbnN0IHByZWZpeCA9IHRhZ25hbWUuY2hhckF0KDApID09PSAnLycgPyAnLycgOiAnJztcbiAgICBpZiAodGFnc1swXSA9PT0gJ3htbG5zJykge1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cbiAgICBpZiAodGFncy5sZW5ndGggPT09IDIpIHtcbiAgICAgIHRhZ25hbWUgPSBwcmVmaXggKyB0YWdzWzFdO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdGFnbmFtZTtcbn1cblxuLy9UT0RPOiBjaGFuZ2UgcmVnZXggdG8gY2FwdHVyZSBOU1xuLy9jb25zdCBhdHRyc1JlZ3ggPSBuZXcgUmVnRXhwKFwiKFtcXFxcd1xcXFwtXFxcXC5cXFxcOl0rKVxcXFxzKj1cXFxccyooWydcXFwiXSkoKC58XFxuKSo/KVxcXFwyXCIsXCJnbVwiKTtcbmNvbnN0IGF0dHJzUmVneCA9IG5ldyBSZWdFeHAoJyhbXlxcXFxzPV0rKVxcXFxzKig9XFxcXHMqKFtcXCdcIl0pKFtcXFxcc1xcXFxTXSo/KVxcXFwzKT8nLCAnZ20nKTtcblxuZnVuY3Rpb24gYnVpbGRBdHRyaWJ1dGVzTWFwKGF0dHJTdHIsIGpQYXRoLCB0YWdOYW1lKSB7XG4gIGlmICh0aGlzLm9wdGlvbnMuaWdub3JlQXR0cmlidXRlcyAhPT0gdHJ1ZSAmJiB0eXBlb2YgYXR0clN0ciA9PT0gJ3N0cmluZycpIHtcbiAgICAvLyBhdHRyU3RyID0gYXR0clN0ci5yZXBsYWNlKC9cXHI/XFxuL2csICcgJyk7XG4gICAgLy9hdHRyU3RyID0gYXR0clN0ciB8fCBhdHRyU3RyLnRyaW0oKTtcblxuICAgIGNvbnN0IG1hdGNoZXMgPSB1dGlsLmdldEFsbE1hdGNoZXMoYXR0clN0ciwgYXR0cnNSZWd4KTtcbiAgICBjb25zdCBsZW4gPSBtYXRjaGVzLmxlbmd0aDsgLy9kb24ndCBtYWtlIGl0IGlubGluZVxuICAgIGNvbnN0IGF0dHJzID0ge307XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgY29uc3QgYXR0ck5hbWUgPSB0aGlzLnJlc29sdmVOYW1lU3BhY2UobWF0Y2hlc1tpXVsxXSk7XG4gICAgICBpZiAodGhpcy5pZ25vcmVBdHRyaWJ1dGVzRm4oYXR0ck5hbWUsIGpQYXRoKSkge1xuICAgICAgICBjb250aW51ZVxuICAgICAgfVxuICAgICAgbGV0IG9sZFZhbCA9IG1hdGNoZXNbaV1bNF07XG4gICAgICBsZXQgYU5hbWUgPSB0aGlzLm9wdGlvbnMuYXR0cmlidXRlTmFtZVByZWZpeCArIGF0dHJOYW1lO1xuICAgICAgaWYgKGF0dHJOYW1lLmxlbmd0aCkge1xuICAgICAgICBpZiAodGhpcy5vcHRpb25zLnRyYW5zZm9ybUF0dHJpYnV0ZU5hbWUpIHtcbiAgICAgICAgICBhTmFtZSA9IHRoaXMub3B0aW9ucy50cmFuc2Zvcm1BdHRyaWJ1dGVOYW1lKGFOYW1lKTtcbiAgICAgICAgfVxuICAgICAgICBhTmFtZSA9IHNhbml0aXplTmFtZShhTmFtZSwgdGhpcy5vcHRpb25zKTtcbiAgICAgICAgaWYgKG9sZFZhbCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy50cmltVmFsdWVzKSB7XG4gICAgICAgICAgICBvbGRWYWwgPSBvbGRWYWwudHJpbSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBvbGRWYWwgPSB0aGlzLnJlcGxhY2VFbnRpdGllc1ZhbHVlKG9sZFZhbCwgdGFnTmFtZSwgalBhdGgpO1xuICAgICAgICAgIGNvbnN0IG5ld1ZhbCA9IHRoaXMub3B0aW9ucy5hdHRyaWJ1dGVWYWx1ZVByb2Nlc3NvcihhdHRyTmFtZSwgb2xkVmFsLCBqUGF0aCk7XG4gICAgICAgICAgaWYgKG5ld1ZhbCA9PT0gbnVsbCB8fCBuZXdWYWwgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgLy9kb24ndCBwYXJzZVxuICAgICAgICAgICAgYXR0cnNbYU5hbWVdID0gb2xkVmFsO1xuICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIG5ld1ZhbCAhPT0gdHlwZW9mIG9sZFZhbCB8fCBuZXdWYWwgIT09IG9sZFZhbCkge1xuICAgICAgICAgICAgLy9vdmVyd3JpdGVcbiAgICAgICAgICAgIGF0dHJzW2FOYW1lXSA9IG5ld1ZhbDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy9wYXJzZVxuICAgICAgICAgICAgYXR0cnNbYU5hbWVdID0gcGFyc2VWYWx1ZShcbiAgICAgICAgICAgICAgb2xkVmFsLFxuICAgICAgICAgICAgICB0aGlzLm9wdGlvbnMucGFyc2VBdHRyaWJ1dGVWYWx1ZSxcbiAgICAgICAgICAgICAgdGhpcy5vcHRpb25zLm51bWJlclBhcnNlT3B0aW9uc1xuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5vcHRpb25zLmFsbG93Qm9vbGVhbkF0dHJpYnV0ZXMpIHtcbiAgICAgICAgICBhdHRyc1thTmFtZV0gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmICghT2JqZWN0LmtleXMoYXR0cnMpLmxlbmd0aCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodGhpcy5vcHRpb25zLmF0dHJpYnV0ZXNHcm91cE5hbWUpIHtcbiAgICAgIGNvbnN0IGF0dHJDb2xsZWN0aW9uID0ge307XG4gICAgICBhdHRyQ29sbGVjdGlvblt0aGlzLm9wdGlvbnMuYXR0cmlidXRlc0dyb3VwTmFtZV0gPSBhdHRycztcbiAgICAgIHJldHVybiBhdHRyQ29sbGVjdGlvbjtcbiAgICB9XG4gICAgcmV0dXJuIGF0dHJzXG4gIH1cbn1cblxuY29uc3QgcGFyc2VYbWwgPSBmdW5jdGlvbiAoeG1sRGF0YSkge1xuICB4bWxEYXRhID0geG1sRGF0YS5yZXBsYWNlKC9cXHJcXG4/L2csIFwiXFxuXCIpOyAvL1RPRE86IHJlbW92ZSB0aGlzIGxpbmVcbiAgY29uc3QgeG1sT2JqID0gbmV3IHhtbE5vZGUoJyF4bWwnKTtcbiAgbGV0IGN1cnJlbnROb2RlID0geG1sT2JqO1xuICBsZXQgdGV4dERhdGEgPSBcIlwiO1xuICBsZXQgalBhdGggPSBcIlwiO1xuXG4gIC8vIFJlc2V0IGVudGl0eSBleHBhbnNpb24gY291bnRlcnMgZm9yIHRoaXMgZG9jdW1lbnRcbiAgdGhpcy5lbnRpdHlFeHBhbnNpb25Db3VudCA9IDA7XG4gIHRoaXMuY3VycmVudEV4cGFuZGVkTGVuZ3RoID0gMDtcblxuICBjb25zdCBkb2NUeXBlUmVhZGVyID0gbmV3IERvY1R5cGVSZWFkZXIodGhpcy5vcHRpb25zLnByb2Nlc3NFbnRpdGllcyk7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgeG1sRGF0YS5sZW5ndGg7IGkrKykgey8vZm9yIGVhY2ggY2hhciBpbiBYTUwgZGF0YVxuICAgIGNvbnN0IGNoID0geG1sRGF0YVtpXTtcbiAgICBpZiAoY2ggPT09ICc8Jykge1xuICAgICAgLy8gY29uc3QgbmV4dEluZGV4ID0gaSsxO1xuICAgICAgLy8gY29uc3QgXzJuZENoYXIgPSB4bWxEYXRhW25leHRJbmRleF07XG4gICAgICBpZiAoeG1sRGF0YVtpICsgMV0gPT09ICcvJykgey8vQ2xvc2luZyBUYWdcbiAgICAgICAgY29uc3QgY2xvc2VJbmRleCA9IGZpbmRDbG9zaW5nSW5kZXgoeG1sRGF0YSwgXCI+XCIsIGksIFwiQ2xvc2luZyBUYWcgaXMgbm90IGNsb3NlZC5cIilcbiAgICAgICAgbGV0IHRhZ05hbWUgPSB4bWxEYXRhLnN1YnN0cmluZyhpICsgMiwgY2xvc2VJbmRleCkudHJpbSgpO1xuXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMucmVtb3ZlTlNQcmVmaXgpIHtcbiAgICAgICAgICBjb25zdCBjb2xvbkluZGV4ID0gdGFnTmFtZS5pbmRleE9mKFwiOlwiKTtcbiAgICAgICAgICBpZiAoY29sb25JbmRleCAhPT0gLTEpIHtcbiAgICAgICAgICAgIHRhZ05hbWUgPSB0YWdOYW1lLnN1YnN0cihjb2xvbkluZGV4ICsgMSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy50cmFuc2Zvcm1UYWdOYW1lKSB7XG4gICAgICAgICAgdGFnTmFtZSA9IHRoaXMub3B0aW9ucy50cmFuc2Zvcm1UYWdOYW1lKHRhZ05hbWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGN1cnJlbnROb2RlKSB7XG4gICAgICAgICAgdGV4dERhdGEgPSB0aGlzLnNhdmVUZXh0VG9QYXJlbnRUYWcodGV4dERhdGEsIGN1cnJlbnROb2RlLCBqUGF0aCk7XG4gICAgICAgIH1cblxuICAgICAgICAvL2NoZWNrIGlmIGxhc3QgdGFnIG9mIG5lc3RlZCB0YWcgd2FzIHVucGFpcmVkIHRhZ1xuICAgICAgICBjb25zdCBsYXN0VGFnTmFtZSA9IGpQYXRoLnN1YnN0cmluZyhqUGF0aC5sYXN0SW5kZXhPZihcIi5cIikgKyAxKTtcbiAgICAgICAgaWYgKHRhZ05hbWUgJiYgdGhpcy5vcHRpb25zLnVucGFpcmVkVGFncy5pbmRleE9mKHRhZ05hbWUpICE9PSAtMSkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5wYWlyZWQgdGFnIGNhbiBub3QgYmUgdXNlZCBhcyBjbG9zaW5nIHRhZzogPC8ke3RhZ05hbWV9PmApO1xuICAgICAgICB9XG4gICAgICAgIGxldCBwcm9wSW5kZXggPSAwXG4gICAgICAgIGlmIChsYXN0VGFnTmFtZSAmJiB0aGlzLm9wdGlvbnMudW5wYWlyZWRUYWdzLmluZGV4T2YobGFzdFRhZ05hbWUpICE9PSAtMSkge1xuICAgICAgICAgIHByb3BJbmRleCA9IGpQYXRoLmxhc3RJbmRleE9mKCcuJywgalBhdGgubGFzdEluZGV4T2YoJy4nKSAtIDEpXG4gICAgICAgICAgdGhpcy50YWdzTm9kZVN0YWNrLnBvcCgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHByb3BJbmRleCA9IGpQYXRoLmxhc3RJbmRleE9mKFwiLlwiKTtcbiAgICAgICAgfVxuICAgICAgICBqUGF0aCA9IGpQYXRoLnN1YnN0cmluZygwLCBwcm9wSW5kZXgpO1xuXG4gICAgICAgIGN1cnJlbnROb2RlID0gdGhpcy50YWdzTm9kZVN0YWNrLnBvcCgpOy8vYXZvaWQgcmVjdXJzaW9uLCBzZXQgdGhlIHBhcmVudCB0YWcgc2NvcGVcbiAgICAgICAgdGV4dERhdGEgPSBcIlwiO1xuICAgICAgICBpID0gY2xvc2VJbmRleDtcbiAgICAgIH0gZWxzZSBpZiAoeG1sRGF0YVtpICsgMV0gPT09ICc/Jykge1xuXG4gICAgICAgIGxldCB0YWdEYXRhID0gcmVhZFRhZ0V4cCh4bWxEYXRhLCBpLCBmYWxzZSwgXCI/PlwiKTtcbiAgICAgICAgaWYgKCF0YWdEYXRhKSB0aHJvdyBuZXcgRXJyb3IoXCJQaSBUYWcgaXMgbm90IGNsb3NlZC5cIik7XG5cbiAgICAgICAgdGV4dERhdGEgPSB0aGlzLnNhdmVUZXh0VG9QYXJlbnRUYWcodGV4dERhdGEsIGN1cnJlbnROb2RlLCBqUGF0aCk7XG4gICAgICAgIGlmICgodGhpcy5vcHRpb25zLmlnbm9yZURlY2xhcmF0aW9uICYmIHRhZ0RhdGEudGFnTmFtZSA9PT0gXCI/eG1sXCIpIHx8IHRoaXMub3B0aW9ucy5pZ25vcmVQaVRhZ3MpIHtcbiAgICAgICAgICAvL2RvIG5vdGhpbmdcbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgIGNvbnN0IGNoaWxkTm9kZSA9IG5ldyB4bWxOb2RlKHRhZ0RhdGEudGFnTmFtZSk7XG4gICAgICAgICAgY2hpbGROb2RlLmFkZCh0aGlzLm9wdGlvbnMudGV4dE5vZGVOYW1lLCBcIlwiKTtcblxuICAgICAgICAgIGlmICh0YWdEYXRhLnRhZ05hbWUgIT09IHRhZ0RhdGEudGFnRXhwICYmIHRhZ0RhdGEuYXR0ckV4cFByZXNlbnQpIHtcbiAgICAgICAgICAgIGNoaWxkTm9kZVtcIjpAXCJdID0gdGhpcy5idWlsZEF0dHJpYnV0ZXNNYXAodGFnRGF0YS50YWdFeHAsIGpQYXRoLCB0YWdEYXRhLnRhZ05hbWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLmFkZENoaWxkKGN1cnJlbnROb2RlLCBjaGlsZE5vZGUsIGpQYXRoLCBpKTtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgaSA9IHRhZ0RhdGEuY2xvc2VJbmRleCArIDE7XG4gICAgICB9IGVsc2UgaWYgKHhtbERhdGEuc3Vic3RyKGkgKyAxLCAzKSA9PT0gJyEtLScpIHtcbiAgICAgICAgY29uc3QgZW5kSW5kZXggPSBmaW5kQ2xvc2luZ0luZGV4KHhtbERhdGEsIFwiLS0+XCIsIGkgKyA0LCBcIkNvbW1lbnQgaXMgbm90IGNsb3NlZC5cIilcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5jb21tZW50UHJvcE5hbWUpIHtcbiAgICAgICAgICBjb25zdCBjb21tZW50ID0geG1sRGF0YS5zdWJzdHJpbmcoaSArIDQsIGVuZEluZGV4IC0gMik7XG5cbiAgICAgICAgICB0ZXh0RGF0YSA9IHRoaXMuc2F2ZVRleHRUb1BhcmVudFRhZyh0ZXh0RGF0YSwgY3VycmVudE5vZGUsIGpQYXRoKTtcblxuICAgICAgICAgIGN1cnJlbnROb2RlLmFkZCh0aGlzLm9wdGlvbnMuY29tbWVudFByb3BOYW1lLCBbeyBbdGhpcy5vcHRpb25zLnRleHROb2RlTmFtZV06IGNvbW1lbnQgfV0pO1xuICAgICAgICB9XG4gICAgICAgIGkgPSBlbmRJbmRleDtcbiAgICAgIH0gZWxzZSBpZiAoeG1sRGF0YS5zdWJzdHIoaSArIDEsIDIpID09PSAnIUQnKSB7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IGRvY1R5cGVSZWFkZXIucmVhZERvY1R5cGUoeG1sRGF0YSwgaSk7XG4gICAgICAgIHRoaXMuZG9jVHlwZUVudGl0aWVzID0gcmVzdWx0LmVudGl0aWVzO1xuICAgICAgICBpID0gcmVzdWx0Lmk7XG4gICAgICB9IGVsc2UgaWYgKHhtbERhdGEuc3Vic3RyKGkgKyAxLCAyKSA9PT0gJyFbJykge1xuICAgICAgICBjb25zdCBjbG9zZUluZGV4ID0gZmluZENsb3NpbmdJbmRleCh4bWxEYXRhLCBcIl1dPlwiLCBpLCBcIkNEQVRBIGlzIG5vdCBjbG9zZWQuXCIpIC0gMjtcbiAgICAgICAgY29uc3QgdGFnRXhwID0geG1sRGF0YS5zdWJzdHJpbmcoaSArIDksIGNsb3NlSW5kZXgpO1xuXG4gICAgICAgIHRleHREYXRhID0gdGhpcy5zYXZlVGV4dFRvUGFyZW50VGFnKHRleHREYXRhLCBjdXJyZW50Tm9kZSwgalBhdGgpO1xuXG4gICAgICAgIGxldCB2YWwgPSB0aGlzLnBhcnNlVGV4dERhdGEodGFnRXhwLCBjdXJyZW50Tm9kZS50YWduYW1lLCBqUGF0aCwgdHJ1ZSwgZmFsc2UsIHRydWUsIHRydWUpO1xuICAgICAgICBpZiAodmFsID09IHVuZGVmaW5lZCkgdmFsID0gXCJcIjtcblxuICAgICAgICAvL2NkYXRhIHNob3VsZCBiZSBzZXQgZXZlbiBpZiBpdCBpcyAwIGxlbmd0aCBzdHJpbmdcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5jZGF0YVByb3BOYW1lKSB7XG4gICAgICAgICAgY3VycmVudE5vZGUuYWRkKHRoaXMub3B0aW9ucy5jZGF0YVByb3BOYW1lLCBbeyBbdGhpcy5vcHRpb25zLnRleHROb2RlTmFtZV06IHRhZ0V4cCB9XSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY3VycmVudE5vZGUuYWRkKHRoaXMub3B0aW9ucy50ZXh0Tm9kZU5hbWUsIHZhbCk7XG4gICAgICAgIH1cblxuICAgICAgICBpID0gY2xvc2VJbmRleCArIDI7XG4gICAgICB9IGVsc2Ugey8vT3BlbmluZyB0YWdcbiAgICAgICAgbGV0IHJlc3VsdCA9IHJlYWRUYWdFeHAoeG1sRGF0YSwgaSwgdGhpcy5vcHRpb25zLnJlbW92ZU5TUHJlZml4KTtcbiAgICAgICAgbGV0IHRhZ05hbWUgPSByZXN1bHQudGFnTmFtZTtcbiAgICAgICAgY29uc3QgcmF3VGFnTmFtZSA9IHJlc3VsdC5yYXdUYWdOYW1lO1xuICAgICAgICBsZXQgdGFnRXhwID0gcmVzdWx0LnRhZ0V4cDtcbiAgICAgICAgbGV0IGF0dHJFeHBQcmVzZW50ID0gcmVzdWx0LmF0dHJFeHBQcmVzZW50O1xuICAgICAgICBsZXQgY2xvc2VJbmRleCA9IHJlc3VsdC5jbG9zZUluZGV4O1xuXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMudHJhbnNmb3JtVGFnTmFtZSkge1xuICAgICAgICAgIC8vY29uc29sZS5sb2codGFnRXhwLCB0YWdOYW1lKVxuICAgICAgICAgIGNvbnN0IG5ld1RhZ05hbWUgPSB0aGlzLm9wdGlvbnMudHJhbnNmb3JtVGFnTmFtZSh0YWdOYW1lKTtcbiAgICAgICAgICBpZiAodGFnRXhwID09PSB0YWdOYW1lKSB7XG4gICAgICAgICAgICB0YWdFeHAgPSBuZXdUYWdOYW1lXG4gICAgICAgICAgfVxuICAgICAgICAgIHRhZ05hbWUgPSBuZXdUYWdOYW1lO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5zdHJpY3RSZXNlcnZlZE5hbWVzICYmXG4gICAgICAgICAgKHRhZ05hbWUgPT09IHRoaXMub3B0aW9ucy5jb21tZW50UHJvcE5hbWVcbiAgICAgICAgICAgIHx8IHRhZ05hbWUgPT09IHRoaXMub3B0aW9ucy5jZGF0YVByb3BOYW1lXG4gICAgICAgICAgICB8fCB0YWdOYW1lID09PSB0aGlzLm9wdGlvbnMudGV4dE5vZGVOYW1lXG4gICAgICAgICAgICB8fCB0YWdOYW1lID09PSB0aGlzLm9wdGlvbnMuYXR0cmlidXRlc0dyb3VwTmFtZVxuICAgICAgICAgICkpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgdGFnIG5hbWU6ICR7dGFnTmFtZX1gKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vc2F2ZSB0ZXh0IGFzIGNoaWxkIG5vZGVcbiAgICAgICAgaWYgKGN1cnJlbnROb2RlICYmIHRleHREYXRhKSB7XG4gICAgICAgICAgaWYgKGN1cnJlbnROb2RlLnRhZ25hbWUgIT09ICcheG1sJykge1xuICAgICAgICAgICAgLy93aGVuIG5lc3RlZCB0YWcgaXMgZm91bmRcbiAgICAgICAgICAgIHRleHREYXRhID0gdGhpcy5zYXZlVGV4dFRvUGFyZW50VGFnKHRleHREYXRhLCBjdXJyZW50Tm9kZSwgalBhdGgsIGZhbHNlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvL2NoZWNrIGlmIGxhc3QgdGFnIHdhcyB1bnBhaXJlZCB0YWdcbiAgICAgICAgY29uc3QgbGFzdFRhZyA9IGN1cnJlbnROb2RlO1xuICAgICAgICBpZiAobGFzdFRhZyAmJiB0aGlzLm9wdGlvbnMudW5wYWlyZWRUYWdzLmluZGV4T2YobGFzdFRhZy50YWduYW1lKSAhPT0gLTEpIHtcbiAgICAgICAgICBjdXJyZW50Tm9kZSA9IHRoaXMudGFnc05vZGVTdGFjay5wb3AoKTtcbiAgICAgICAgICBqUGF0aCA9IGpQYXRoLnN1YnN0cmluZygwLCBqUGF0aC5sYXN0SW5kZXhPZihcIi5cIikpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0YWdOYW1lICE9PSB4bWxPYmoudGFnbmFtZSkge1xuICAgICAgICAgIGpQYXRoICs9IGpQYXRoID8gXCIuXCIgKyB0YWdOYW1lIDogdGFnTmFtZTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBzdGFydEluZGV4ID0gaTtcbiAgICAgICAgaWYgKHRoaXMuaXNJdFN0b3BOb2RlKHRoaXMuc3RvcE5vZGVzRXhhY3QsIHRoaXMuc3RvcE5vZGVzV2lsZGNhcmQsIGpQYXRoLCB0YWdOYW1lKSkge1xuICAgICAgICAgIGxldCB0YWdDb250ZW50ID0gXCJcIjtcbiAgICAgICAgICAvL3NlbGYtY2xvc2luZyB0YWdcbiAgICAgICAgICBpZiAodGFnRXhwLmxlbmd0aCA+IDAgJiYgdGFnRXhwLmxhc3RJbmRleE9mKFwiL1wiKSA9PT0gdGFnRXhwLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgIGlmICh0YWdOYW1lW3RhZ05hbWUubGVuZ3RoIC0gMV0gPT09IFwiL1wiKSB7IC8vcmVtb3ZlIHRyYWlsaW5nICcvJ1xuICAgICAgICAgICAgICB0YWdOYW1lID0gdGFnTmFtZS5zdWJzdHIoMCwgdGFnTmFtZS5sZW5ndGggLSAxKTtcbiAgICAgICAgICAgICAgalBhdGggPSBqUGF0aC5zdWJzdHIoMCwgalBhdGgubGVuZ3RoIC0gMSk7XG4gICAgICAgICAgICAgIHRhZ0V4cCA9IHRhZ05hbWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB0YWdFeHAgPSB0YWdFeHAuc3Vic3RyKDAsIHRhZ0V4cC5sZW5ndGggLSAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGkgPSByZXN1bHQuY2xvc2VJbmRleDtcbiAgICAgICAgICB9XG4gICAgICAgICAgLy91bnBhaXJlZCB0YWdcbiAgICAgICAgICBlbHNlIGlmICh0aGlzLm9wdGlvbnMudW5wYWlyZWRUYWdzLmluZGV4T2YodGFnTmFtZSkgIT09IC0xKSB7XG5cbiAgICAgICAgICAgIGkgPSByZXN1bHQuY2xvc2VJbmRleDtcbiAgICAgICAgICB9XG4gICAgICAgICAgLy9ub3JtYWwgdGFnXG4gICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvL3JlYWQgdW50aWwgY2xvc2luZyB0YWcgaXMgZm91bmRcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMucmVhZFN0b3BOb2RlRGF0YSh4bWxEYXRhLCByYXdUYWdOYW1lLCBjbG9zZUluZGV4ICsgMSk7XG4gICAgICAgICAgICBpZiAoIXJlc3VsdCkgdGhyb3cgbmV3IEVycm9yKGBVbmV4cGVjdGVkIGVuZCBvZiAke3Jhd1RhZ05hbWV9YCk7XG4gICAgICAgICAgICBpID0gcmVzdWx0Lmk7XG4gICAgICAgICAgICB0YWdDb250ZW50ID0gcmVzdWx0LnRhZ0NvbnRlbnQ7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29uc3QgY2hpbGROb2RlID0gbmV3IHhtbE5vZGUodGFnTmFtZSk7XG4gICAgICAgICAgaWYgKHRhZ05hbWUgIT09IHRhZ0V4cCAmJiBhdHRyRXhwUHJlc2VudCkge1xuICAgICAgICAgICAgY2hpbGROb2RlW1wiOkBcIl0gPSB0aGlzLmJ1aWxkQXR0cmlidXRlc01hcCh0YWdFeHAsIGpQYXRoLCB0YWdOYW1lKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHRhZ0NvbnRlbnQpIHtcbiAgICAgICAgICAgIHRhZ0NvbnRlbnQgPSB0aGlzLnBhcnNlVGV4dERhdGEodGFnQ29udGVudCwgdGFnTmFtZSwgalBhdGgsIHRydWUsIGF0dHJFeHBQcmVzZW50LCB0cnVlLCB0cnVlKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBqUGF0aCA9IGpQYXRoLnN1YnN0cigwLCBqUGF0aC5sYXN0SW5kZXhPZihcIi5cIikpO1xuICAgICAgICAgIGNoaWxkTm9kZS5hZGQodGhpcy5vcHRpb25zLnRleHROb2RlTmFtZSwgdGFnQ29udGVudCk7XG5cbiAgICAgICAgICB0aGlzLmFkZENoaWxkKGN1cnJlbnROb2RlLCBjaGlsZE5vZGUsIGpQYXRoLCBzdGFydEluZGV4KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvL3NlbGZDbG9zaW5nIHRhZ1xuICAgICAgICAgIGlmICh0YWdFeHAubGVuZ3RoID4gMCAmJiB0YWdFeHAubGFzdEluZGV4T2YoXCIvXCIpID09PSB0YWdFeHAubGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgaWYgKHRhZ05hbWVbdGFnTmFtZS5sZW5ndGggLSAxXSA9PT0gXCIvXCIpIHsgLy9yZW1vdmUgdHJhaWxpbmcgJy8nXG4gICAgICAgICAgICAgIHRhZ05hbWUgPSB0YWdOYW1lLnN1YnN0cigwLCB0YWdOYW1lLmxlbmd0aCAtIDEpO1xuICAgICAgICAgICAgICBqUGF0aCA9IGpQYXRoLnN1YnN0cigwLCBqUGF0aC5sZW5ndGggLSAxKTtcbiAgICAgICAgICAgICAgdGFnRXhwID0gdGFnTmFtZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRhZ0V4cCA9IHRhZ0V4cC5zdWJzdHIoMCwgdGFnRXhwLmxlbmd0aCAtIDEpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLnRyYW5zZm9ybVRhZ05hbWUpIHtcbiAgICAgICAgICAgICAgY29uc3QgbmV3VGFnTmFtZSA9IHRoaXMub3B0aW9ucy50cmFuc2Zvcm1UYWdOYW1lKHRhZ05hbWUpO1xuICAgICAgICAgICAgICBpZiAodGFnRXhwID09PSB0YWdOYW1lKSB7XG4gICAgICAgICAgICAgICAgdGFnRXhwID0gbmV3VGFnTmFtZVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHRhZ05hbWUgPSBuZXdUYWdOYW1lO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBjaGlsZE5vZGUgPSBuZXcgeG1sTm9kZSh0YWdOYW1lKTtcbiAgICAgICAgICAgIGlmICh0YWdOYW1lICE9PSB0YWdFeHAgJiYgYXR0ckV4cFByZXNlbnQpIHtcbiAgICAgICAgICAgICAgY2hpbGROb2RlW1wiOkBcIl0gPSB0aGlzLmJ1aWxkQXR0cmlidXRlc01hcCh0YWdFeHAsIGpQYXRoLCB0YWdOYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuYWRkQ2hpbGQoY3VycmVudE5vZGUsIGNoaWxkTm9kZSwgalBhdGgsIHN0YXJ0SW5kZXgpO1xuICAgICAgICAgICAgalBhdGggPSBqUGF0aC5zdWJzdHIoMCwgalBhdGgubGFzdEluZGV4T2YoXCIuXCIpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSBpZiAodGhpcy5vcHRpb25zLnVucGFpcmVkVGFncy5pbmRleE9mKHRhZ05hbWUpICE9PSAtMSkgey8vdW5wYWlyZWQgdGFnXG4gICAgICAgICAgICBjb25zdCBjaGlsZE5vZGUgPSBuZXcgeG1sTm9kZSh0YWdOYW1lKTtcbiAgICAgICAgICAgIGlmICh0YWdOYW1lICE9PSB0YWdFeHAgJiYgYXR0ckV4cFByZXNlbnQpIHtcbiAgICAgICAgICAgICAgY2hpbGROb2RlW1wiOkBcIl0gPSB0aGlzLmJ1aWxkQXR0cmlidXRlc01hcCh0YWdFeHAsIGpQYXRoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuYWRkQ2hpbGQoY3VycmVudE5vZGUsIGNoaWxkTm9kZSwgalBhdGgsIHN0YXJ0SW5kZXgpO1xuICAgICAgICAgICAgalBhdGggPSBqUGF0aC5zdWJzdHIoMCwgalBhdGgubGFzdEluZGV4T2YoXCIuXCIpKTtcbiAgICAgICAgICAgIGkgPSByZXN1bHQuY2xvc2VJbmRleDtcbiAgICAgICAgICAgIC8vIENvbnRpbnVlIHRvIG5leHQgaXRlcmF0aW9uIHdpdGhvdXQgY2hhbmdpbmcgY3VycmVudE5vZGVcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICAvL29wZW5pbmcgdGFnXG4gICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBjaGlsZE5vZGUgPSBuZXcgeG1sTm9kZSh0YWdOYW1lKTtcbiAgICAgICAgICAgIGlmICh0aGlzLnRhZ3NOb2RlU3RhY2subGVuZ3RoID4gdGhpcy5vcHRpb25zLm1heE5lc3RlZFRhZ3MpIHtcbiAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTWF4aW11bSBuZXN0ZWQgdGFncyBleGNlZWRlZFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMudGFnc05vZGVTdGFjay5wdXNoKGN1cnJlbnROb2RlKTtcblxuICAgICAgICAgICAgaWYgKHRhZ05hbWUgIT09IHRhZ0V4cCAmJiBhdHRyRXhwUHJlc2VudCkge1xuICAgICAgICAgICAgICBjaGlsZE5vZGVbXCI6QFwiXSA9IHRoaXMuYnVpbGRBdHRyaWJ1dGVzTWFwKHRhZ0V4cCwgalBhdGgsIHRhZ05hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5hZGRDaGlsZChjdXJyZW50Tm9kZSwgY2hpbGROb2RlLCBqUGF0aClcbiAgICAgICAgICAgIGN1cnJlbnROb2RlID0gY2hpbGROb2RlO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0ZXh0RGF0YSA9IFwiXCI7XG4gICAgICAgICAgaSA9IGNsb3NlSW5kZXg7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGV4dERhdGEgKz0geG1sRGF0YVtpXTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHhtbE9iai5jaGlsZDtcbn1cblxuZnVuY3Rpb24gYWRkQ2hpbGQoY3VycmVudE5vZGUsIGNoaWxkTm9kZSwgalBhdGgsIHN0YXJ0SW5kZXgpIHtcbiAgLy8gdW5zZXQgc3RhcnRJbmRleCBpZiBub3QgcmVxdWVzdGVkXG4gIGlmICghdGhpcy5vcHRpb25zLmNhcHR1cmVNZXRhRGF0YSkgc3RhcnRJbmRleCA9IHVuZGVmaW5lZDtcbiAgY29uc3QgcmVzdWx0ID0gdGhpcy5vcHRpb25zLnVwZGF0ZVRhZyhjaGlsZE5vZGUudGFnbmFtZSwgalBhdGgsIGNoaWxkTm9kZVtcIjpAXCJdKVxuICBpZiAocmVzdWx0ID09PSBmYWxzZSkge1xuICAgIC8vZG8gbm90aGluZ1xuICB9IGVsc2UgaWYgKHR5cGVvZiByZXN1bHQgPT09IFwic3RyaW5nXCIpIHtcbiAgICBjaGlsZE5vZGUudGFnbmFtZSA9IHJlc3VsdFxuICAgIGN1cnJlbnROb2RlLmFkZENoaWxkKGNoaWxkTm9kZSwgc3RhcnRJbmRleCk7XG4gIH0gZWxzZSB7XG4gICAgY3VycmVudE5vZGUuYWRkQ2hpbGQoY2hpbGROb2RlLCBzdGFydEluZGV4KTtcbiAgfVxufVxuXG5jb25zdCByZXBsYWNlRW50aXRpZXNWYWx1ZSA9IGZ1bmN0aW9uICh2YWwsIHRhZ05hbWUsIGpQYXRoKSB7XG4gIC8vIFBlcmZvcm1hbmNlIG9wdGltaXphdGlvbjogRWFybHkgcmV0dXJuIGlmIG5vIGVudGl0aWVzIHRvIHJlcGxhY2VcbiAgaWYgKHZhbC5pbmRleE9mKCcmJykgPT09IC0xKSB7XG4gICAgcmV0dXJuIHZhbDtcbiAgfVxuXG4gIGNvbnN0IGVudGl0eUNvbmZpZyA9IHRoaXMub3B0aW9ucy5wcm9jZXNzRW50aXRpZXM7XG5cbiAgaWYgKCFlbnRpdHlDb25maWcuZW5hYmxlZCkge1xuICAgIHJldHVybiB2YWw7XG4gIH1cblxuICAvLyBDaGVjayB0YWctc3BlY2lmaWMgZmlsdGVyaW5nXG4gIGlmIChlbnRpdHlDb25maWcuYWxsb3dlZFRhZ3MpIHtcbiAgICBpZiAoIWVudGl0eUNvbmZpZy5hbGxvd2VkVGFncy5pbmNsdWRlcyh0YWdOYW1lKSkge1xuICAgICAgcmV0dXJuIHZhbDsgLy8gU2tpcCBlbnRpdHkgcmVwbGFjZW1lbnQgZm9yIGN1cnJlbnQgdGFnIGFzIG5vdCBzZXRcbiAgICB9XG4gIH1cblxuICBpZiAoZW50aXR5Q29uZmlnLnRhZ0ZpbHRlcikge1xuICAgIGlmICghZW50aXR5Q29uZmlnLnRhZ0ZpbHRlcih0YWdOYW1lLCBqUGF0aCkpIHtcbiAgICAgIHJldHVybiB2YWw7IC8vIFNraXAgYmFzZWQgb24gY3VzdG9tIGZpbHRlclxuICAgIH1cbiAgfVxuXG4gIC8vIFJlcGxhY2UgRE9DVFlQRSBlbnRpdGllc1xuICBmb3IgKGxldCBlbnRpdHlOYW1lIGluIHRoaXMuZG9jVHlwZUVudGl0aWVzKSB7XG4gICAgY29uc3QgZW50aXR5ID0gdGhpcy5kb2NUeXBlRW50aXRpZXNbZW50aXR5TmFtZV07XG4gICAgY29uc3QgbWF0Y2hlcyA9IHZhbC5tYXRjaChlbnRpdHkucmVneCk7XG5cbiAgICBpZiAobWF0Y2hlcykge1xuICAgICAgLy8gVHJhY2sgZXhwYW5zaW9uc1xuICAgICAgdGhpcy5lbnRpdHlFeHBhbnNpb25Db3VudCArPSBtYXRjaGVzLmxlbmd0aDtcblxuICAgICAgLy8gQ2hlY2sgZXhwYW5zaW9uIGxpbWl0XG4gICAgICBpZiAoZW50aXR5Q29uZmlnLm1heFRvdGFsRXhwYW5zaW9ucyAmJlxuICAgICAgICB0aGlzLmVudGl0eUV4cGFuc2lvbkNvdW50ID4gZW50aXR5Q29uZmlnLm1heFRvdGFsRXhwYW5zaW9ucykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgYEVudGl0eSBleHBhbnNpb24gbGltaXQgZXhjZWVkZWQ6ICR7dGhpcy5lbnRpdHlFeHBhbnNpb25Db3VudH0gPiAke2VudGl0eUNvbmZpZy5tYXhUb3RhbEV4cGFuc2lvbnN9YFxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICAvLyBTdG9yZSBsZW5ndGggYmVmb3JlIHJlcGxhY2VtZW50XG4gICAgICBjb25zdCBsZW5ndGhCZWZvcmUgPSB2YWwubGVuZ3RoO1xuICAgICAgdmFsID0gdmFsLnJlcGxhY2UoZW50aXR5LnJlZ3gsIGVudGl0eS52YWwpO1xuXG4gICAgICAvLyBDaGVjayBleHBhbmRlZCBsZW5ndGggaW1tZWRpYXRlbHkgYWZ0ZXIgcmVwbGFjZW1lbnRcbiAgICAgIGlmIChlbnRpdHlDb25maWcubWF4RXhwYW5kZWRMZW5ndGgpIHtcbiAgICAgICAgdGhpcy5jdXJyZW50RXhwYW5kZWRMZW5ndGggKz0gKHZhbC5sZW5ndGggLSBsZW5ndGhCZWZvcmUpO1xuXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRFeHBhbmRlZExlbmd0aCA+IGVudGl0eUNvbmZpZy5tYXhFeHBhbmRlZExlbmd0aCkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgIGBUb3RhbCBleHBhbmRlZCBjb250ZW50IHNpemUgZXhjZWVkZWQ6ICR7dGhpcy5jdXJyZW50RXhwYW5kZWRMZW5ndGh9ID4gJHtlbnRpdHlDb25maWcubWF4RXhwYW5kZWRMZW5ndGh9YFxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgaWYgKHZhbC5pbmRleE9mKCcmJykgPT09IC0xKSByZXR1cm4gdmFsOyAgLy8gRWFybHkgZXhpdFxuXG4gIC8vIFJlcGxhY2Ugc3RhbmRhcmQgZW50aXRpZXNcbiAgZm9yIChjb25zdCBlbnRpdHlOYW1lIG9mIE9iamVjdC5rZXlzKHRoaXMubGFzdEVudGl0aWVzKSkge1xuICAgIGNvbnN0IGVudGl0eSA9IHRoaXMubGFzdEVudGl0aWVzW2VudGl0eU5hbWVdO1xuICAgIGNvbnN0IG1hdGNoZXMgPSB2YWwubWF0Y2goZW50aXR5LnJlZ2V4KTtcbiAgICBpZiAobWF0Y2hlcykge1xuICAgICAgdGhpcy5lbnRpdHlFeHBhbnNpb25Db3VudCArPSBtYXRjaGVzLmxlbmd0aDtcbiAgICAgIGlmIChlbnRpdHlDb25maWcubWF4VG90YWxFeHBhbnNpb25zICYmXG4gICAgICAgIHRoaXMuZW50aXR5RXhwYW5zaW9uQ291bnQgPiBlbnRpdHlDb25maWcubWF4VG90YWxFeHBhbnNpb25zKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICBgRW50aXR5IGV4cGFuc2lvbiBsaW1pdCBleGNlZWRlZDogJHt0aGlzLmVudGl0eUV4cGFuc2lvbkNvdW50fSA+ICR7ZW50aXR5Q29uZmlnLm1heFRvdGFsRXhwYW5zaW9uc31gXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuICAgIHZhbCA9IHZhbC5yZXBsYWNlKGVudGl0eS5yZWdleCwgZW50aXR5LnZhbCk7XG4gIH1cbiAgaWYgKHZhbC5pbmRleE9mKCcmJykgPT09IC0xKSByZXR1cm4gdmFsOyAgLy8gRWFybHkgZXhpdFxuXG4gIC8vIFJlcGxhY2UgSFRNTCBlbnRpdGllcyBpZiBlbmFibGVkXG4gIGlmICh0aGlzLm9wdGlvbnMuaHRtbEVudGl0aWVzKSB7XG4gICAgZm9yIChjb25zdCBlbnRpdHlOYW1lIG9mIE9iamVjdC5rZXlzKHRoaXMuaHRtbEVudGl0aWVzKSkge1xuICAgICAgY29uc3QgZW50aXR5ID0gdGhpcy5odG1sRW50aXRpZXNbZW50aXR5TmFtZV07XG4gICAgICBjb25zdCBtYXRjaGVzID0gdmFsLm1hdGNoKGVudGl0eS5yZWdleCk7XG4gICAgICBpZiAobWF0Y2hlcykge1xuICAgICAgICAvL2NvbnNvbGUubG9nKG1hdGNoZXMpO1xuICAgICAgICB0aGlzLmVudGl0eUV4cGFuc2lvbkNvdW50ICs9IG1hdGNoZXMubGVuZ3RoO1xuICAgICAgICBpZiAoZW50aXR5Q29uZmlnLm1heFRvdGFsRXhwYW5zaW9ucyAmJlxuICAgICAgICAgIHRoaXMuZW50aXR5RXhwYW5zaW9uQ291bnQgPiBlbnRpdHlDb25maWcubWF4VG90YWxFeHBhbnNpb25zKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICAgYEVudGl0eSBleHBhbnNpb24gbGltaXQgZXhjZWVkZWQ6ICR7dGhpcy5lbnRpdHlFeHBhbnNpb25Db3VudH0gPiAke2VudGl0eUNvbmZpZy5tYXhUb3RhbEV4cGFuc2lvbnN9YFxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHZhbCA9IHZhbC5yZXBsYWNlKGVudGl0eS5yZWdleCwgZW50aXR5LnZhbCk7XG4gICAgfVxuICB9XG5cbiAgLy8gUmVwbGFjZSBhbXBlcnNhbmQgZW50aXR5IGxhc3RcbiAgdmFsID0gdmFsLnJlcGxhY2UodGhpcy5hbXBFbnRpdHkucmVnZXgsIHRoaXMuYW1wRW50aXR5LnZhbCk7XG5cbiAgcmV0dXJuIHZhbDtcbn1cblxuZnVuY3Rpb24gc2F2ZVRleHRUb1BhcmVudFRhZyh0ZXh0RGF0YSwgcGFyZW50Tm9kZSwgalBhdGgsIGlzTGVhZk5vZGUpIHtcbiAgaWYgKHRleHREYXRhKSB7IC8vc3RvcmUgcHJldmlvdXNseSBjb2xsZWN0ZWQgZGF0YSBhcyB0ZXh0Tm9kZVxuICAgIGlmIChpc0xlYWZOb2RlID09PSB1bmRlZmluZWQpIGlzTGVhZk5vZGUgPSBwYXJlbnROb2RlLmNoaWxkLmxlbmd0aCA9PT0gMFxuXG4gICAgdGV4dERhdGEgPSB0aGlzLnBhcnNlVGV4dERhdGEodGV4dERhdGEsXG4gICAgICBwYXJlbnROb2RlLnRhZ25hbWUsXG4gICAgICBqUGF0aCxcbiAgICAgIGZhbHNlLFxuICAgICAgcGFyZW50Tm9kZVtcIjpAXCJdID8gT2JqZWN0LmtleXMocGFyZW50Tm9kZVtcIjpAXCJdKS5sZW5ndGggIT09IDAgOiBmYWxzZSxcbiAgICAgIGlzTGVhZk5vZGUpO1xuXG4gICAgaWYgKHRleHREYXRhICE9PSB1bmRlZmluZWQgJiYgdGV4dERhdGEgIT09IFwiXCIpXG4gICAgICBwYXJlbnROb2RlLmFkZCh0aGlzLm9wdGlvbnMudGV4dE5vZGVOYW1lLCB0ZXh0RGF0YSk7XG4gICAgdGV4dERhdGEgPSBcIlwiO1xuICB9XG4gIHJldHVybiB0ZXh0RGF0YTtcbn1cblxuLy9UT0RPOiB1c2UgalBhdGggdG8gc2ltcGxpZnkgdGhlIGxvZ2ljXG4vKipcbiAqIEBwYXJhbSB7U2V0fSBzdG9wTm9kZXNFeGFjdFxuICogQHBhcmFtIHtTZXR9IHN0b3BOb2Rlc1dpbGRjYXJkXG4gKiBAcGFyYW0ge3N0cmluZ30galBhdGhcbiAqIEBwYXJhbSB7c3RyaW5nfSBjdXJyZW50VGFnTmFtZVxuICovXG5mdW5jdGlvbiBpc0l0U3RvcE5vZGUoc3RvcE5vZGVzRXhhY3QsIHN0b3BOb2Rlc1dpbGRjYXJkLCBqUGF0aCwgY3VycmVudFRhZ05hbWUpIHtcbiAgaWYgKHN0b3BOb2Rlc1dpbGRjYXJkICYmIHN0b3BOb2Rlc1dpbGRjYXJkLmhhcyhjdXJyZW50VGFnTmFtZSkpIHJldHVybiB0cnVlO1xuICBpZiAoc3RvcE5vZGVzRXhhY3QgJiYgc3RvcE5vZGVzRXhhY3QuaGFzKGpQYXRoKSkgcmV0dXJuIHRydWU7XG4gIHJldHVybiBmYWxzZTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRoZSB0YWcgRXhwcmVzc2lvbiBhbmQgd2hlcmUgaXQgaXMgZW5kaW5nIGhhbmRsaW5nIHNpbmdsZS1kb3VibGUgcXVvdGVzIHNpdHVhdGlvblxuICogQHBhcmFtIHtzdHJpbmd9IHhtbERhdGEgXG4gKiBAcGFyYW0ge251bWJlcn0gaSBzdGFydGluZyBpbmRleFxuICogQHJldHVybnMgXG4gKi9cbmZ1bmN0aW9uIHRhZ0V4cFdpdGhDbG9zaW5nSW5kZXgoeG1sRGF0YSwgaSwgY2xvc2luZ0NoYXIgPSBcIj5cIikge1xuICBsZXQgYXR0ckJvdW5kYXJ5O1xuICBsZXQgdGFnRXhwID0gXCJcIjtcbiAgZm9yIChsZXQgaW5kZXggPSBpOyBpbmRleCA8IHhtbERhdGEubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgbGV0IGNoID0geG1sRGF0YVtpbmRleF07XG4gICAgaWYgKGF0dHJCb3VuZGFyeSkge1xuICAgICAgaWYgKGNoID09PSBhdHRyQm91bmRhcnkpIGF0dHJCb3VuZGFyeSA9IFwiXCI7Ly9yZXNldFxuICAgIH0gZWxzZSBpZiAoY2ggPT09ICdcIicgfHwgY2ggPT09IFwiJ1wiKSB7XG4gICAgICBhdHRyQm91bmRhcnkgPSBjaDtcbiAgICB9IGVsc2UgaWYgKGNoID09PSBjbG9zaW5nQ2hhclswXSkge1xuICAgICAgaWYgKGNsb3NpbmdDaGFyWzFdKSB7XG4gICAgICAgIGlmICh4bWxEYXRhW2luZGV4ICsgMV0gPT09IGNsb3NpbmdDaGFyWzFdKSB7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGRhdGE6IHRhZ0V4cCxcbiAgICAgICAgICAgIGluZGV4OiBpbmRleFxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBkYXRhOiB0YWdFeHAsXG4gICAgICAgICAgaW5kZXg6IGluZGV4XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGNoID09PSAnXFx0Jykge1xuICAgICAgY2ggPSBcIiBcIlxuICAgIH1cbiAgICB0YWdFeHAgKz0gY2g7XG4gIH1cbn1cblxuZnVuY3Rpb24gZmluZENsb3NpbmdJbmRleCh4bWxEYXRhLCBzdHIsIGksIGVyck1zZykge1xuICBjb25zdCBjbG9zaW5nSW5kZXggPSB4bWxEYXRhLmluZGV4T2Yoc3RyLCBpKTtcbiAgaWYgKGNsb3NpbmdJbmRleCA9PT0gLTEpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoZXJyTXNnKVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBjbG9zaW5nSW5kZXggKyBzdHIubGVuZ3RoIC0gMTtcbiAgfVxufVxuXG5mdW5jdGlvbiByZWFkVGFnRXhwKHhtbERhdGEsIGksIHJlbW92ZU5TUHJlZml4LCBjbG9zaW5nQ2hhciA9IFwiPlwiKSB7XG4gIGNvbnN0IHJlc3VsdCA9IHRhZ0V4cFdpdGhDbG9zaW5nSW5kZXgoeG1sRGF0YSwgaSArIDEsIGNsb3NpbmdDaGFyKTtcbiAgaWYgKCFyZXN1bHQpIHJldHVybjtcbiAgbGV0IHRhZ0V4cCA9IHJlc3VsdC5kYXRhO1xuICBjb25zdCBjbG9zZUluZGV4ID0gcmVzdWx0LmluZGV4O1xuICBjb25zdCBzZXBhcmF0b3JJbmRleCA9IHRhZ0V4cC5zZWFyY2goL1xccy8pO1xuICBsZXQgdGFnTmFtZSA9IHRhZ0V4cDtcbiAgbGV0IGF0dHJFeHBQcmVzZW50ID0gdHJ1ZTtcbiAgaWYgKHNlcGFyYXRvckluZGV4ICE9PSAtMSkgey8vc2VwYXJhdGUgdGFnIG5hbWUgYW5kIGF0dHJpYnV0ZXMgZXhwcmVzc2lvblxuICAgIHRhZ05hbWUgPSB0YWdFeHAuc3Vic3RyaW5nKDAsIHNlcGFyYXRvckluZGV4KTtcbiAgICB0YWdFeHAgPSB0YWdFeHAuc3Vic3RyaW5nKHNlcGFyYXRvckluZGV4ICsgMSkudHJpbVN0YXJ0KCk7XG4gIH1cblxuICBjb25zdCByYXdUYWdOYW1lID0gdGFnTmFtZTtcbiAgaWYgKHJlbW92ZU5TUHJlZml4KSB7XG4gICAgY29uc3QgY29sb25JbmRleCA9IHRhZ05hbWUuaW5kZXhPZihcIjpcIik7XG4gICAgaWYgKGNvbG9uSW5kZXggIT09IC0xKSB7XG4gICAgICB0YWdOYW1lID0gdGFnTmFtZS5zdWJzdHIoY29sb25JbmRleCArIDEpO1xuICAgICAgYXR0ckV4cFByZXNlbnQgPSB0YWdOYW1lICE9PSByZXN1bHQuZGF0YS5zdWJzdHIoY29sb25JbmRleCArIDEpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7XG4gICAgdGFnTmFtZTogdGFnTmFtZSxcbiAgICB0YWdFeHA6IHRhZ0V4cCxcbiAgICBjbG9zZUluZGV4OiBjbG9zZUluZGV4LFxuICAgIGF0dHJFeHBQcmVzZW50OiBhdHRyRXhwUHJlc2VudCxcbiAgICByYXdUYWdOYW1lOiByYXdUYWdOYW1lLFxuICB9XG59XG4vKipcbiAqIGZpbmQgcGFpcmVkIHRhZyBmb3IgYSBzdG9wIG5vZGVcbiAqIEBwYXJhbSB7c3RyaW5nfSB4bWxEYXRhIFxuICogQHBhcmFtIHtzdHJpbmd9IHRhZ05hbWUgXG4gKiBAcGFyYW0ge251bWJlcn0gaSBcbiAqL1xuZnVuY3Rpb24gcmVhZFN0b3BOb2RlRGF0YSh4bWxEYXRhLCB0YWdOYW1lLCBpKSB7XG4gIGNvbnN0IHN0YXJ0SW5kZXggPSBpO1xuICAvLyBTdGFydGluZyBhdCAxIHNpbmNlIHdlIGFscmVhZHkgaGF2ZSBhbiBvcGVuIHRhZ1xuICBsZXQgb3BlblRhZ0NvdW50ID0gMTtcblxuICBmb3IgKDsgaSA8IHhtbERhdGEubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoeG1sRGF0YVtpXSA9PT0gXCI8XCIpIHtcbiAgICAgIGlmICh4bWxEYXRhW2kgKyAxXSA9PT0gXCIvXCIpIHsvL2Nsb3NlIHRhZ1xuICAgICAgICBjb25zdCBjbG9zZUluZGV4ID0gZmluZENsb3NpbmdJbmRleCh4bWxEYXRhLCBcIj5cIiwgaSwgYCR7dGFnTmFtZX0gaXMgbm90IGNsb3NlZGApO1xuICAgICAgICBsZXQgY2xvc2VUYWdOYW1lID0geG1sRGF0YS5zdWJzdHJpbmcoaSArIDIsIGNsb3NlSW5kZXgpLnRyaW0oKTtcbiAgICAgICAgaWYgKGNsb3NlVGFnTmFtZSA9PT0gdGFnTmFtZSkge1xuICAgICAgICAgIG9wZW5UYWdDb3VudC0tO1xuICAgICAgICAgIGlmIChvcGVuVGFnQ291bnQgPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgIHRhZ0NvbnRlbnQ6IHhtbERhdGEuc3Vic3RyaW5nKHN0YXJ0SW5kZXgsIGkpLFxuICAgICAgICAgICAgICBpOiBjbG9zZUluZGV4XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGkgPSBjbG9zZUluZGV4O1xuICAgICAgfSBlbHNlIGlmICh4bWxEYXRhW2kgKyAxXSA9PT0gJz8nKSB7XG4gICAgICAgIGNvbnN0IGNsb3NlSW5kZXggPSBmaW5kQ2xvc2luZ0luZGV4KHhtbERhdGEsIFwiPz5cIiwgaSArIDEsIFwiU3RvcE5vZGUgaXMgbm90IGNsb3NlZC5cIilcbiAgICAgICAgaSA9IGNsb3NlSW5kZXg7XG4gICAgICB9IGVsc2UgaWYgKHhtbERhdGEuc3Vic3RyKGkgKyAxLCAzKSA9PT0gJyEtLScpIHtcbiAgICAgICAgY29uc3QgY2xvc2VJbmRleCA9IGZpbmRDbG9zaW5nSW5kZXgoeG1sRGF0YSwgXCItLT5cIiwgaSArIDMsIFwiU3RvcE5vZGUgaXMgbm90IGNsb3NlZC5cIilcbiAgICAgICAgaSA9IGNsb3NlSW5kZXg7XG4gICAgICB9IGVsc2UgaWYgKHhtbERhdGEuc3Vic3RyKGkgKyAxLCAyKSA9PT0gJyFbJykge1xuICAgICAgICBjb25zdCBjbG9zZUluZGV4ID0gZmluZENsb3NpbmdJbmRleCh4bWxEYXRhLCBcIl1dPlwiLCBpLCBcIlN0b3BOb2RlIGlzIG5vdCBjbG9zZWQuXCIpIC0gMjtcbiAgICAgICAgaSA9IGNsb3NlSW5kZXg7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCB0YWdEYXRhID0gcmVhZFRhZ0V4cCh4bWxEYXRhLCBpLCAnPicpXG5cbiAgICAgICAgaWYgKHRhZ0RhdGEpIHtcbiAgICAgICAgICBjb25zdCBvcGVuVGFnTmFtZSA9IHRhZ0RhdGEgJiYgdGFnRGF0YS50YWdOYW1lO1xuICAgICAgICAgIGlmIChvcGVuVGFnTmFtZSA9PT0gdGFnTmFtZSAmJiB0YWdEYXRhLnRhZ0V4cFt0YWdEYXRhLnRhZ0V4cC5sZW5ndGggLSAxXSAhPT0gXCIvXCIpIHtcbiAgICAgICAgICAgIG9wZW5UYWdDb3VudCsrO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpID0gdGFnRGF0YS5jbG9zZUluZGV4O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9Ly9lbmQgZm9yIGxvb3Bcbn1cblxuZnVuY3Rpb24gcGFyc2VWYWx1ZSh2YWwsIHNob3VsZFBhcnNlLCBvcHRpb25zKSB7XG4gIGlmIChzaG91bGRQYXJzZSAmJiB0eXBlb2YgdmFsID09PSAnc3RyaW5nJykge1xuICAgIC8vY29uc29sZS5sb2cob3B0aW9ucylcbiAgICBjb25zdCBuZXd2YWwgPSB2YWwudHJpbSgpO1xuICAgIGlmIChuZXd2YWwgPT09ICd0cnVlJykgcmV0dXJuIHRydWU7XG4gICAgZWxzZSBpZiAobmV3dmFsID09PSAnZmFsc2UnKSByZXR1cm4gZmFsc2U7XG4gICAgZWxzZSByZXR1cm4gdG9OdW1iZXIodmFsLCBvcHRpb25zKTtcbiAgfSBlbHNlIHtcbiAgICBpZiAodXRpbC5pc0V4aXN0KHZhbCkpIHtcbiAgICAgIHJldHVybiB2YWw7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gZnJvbUNvZGVQb2ludChzdHIsIGJhc2UsIHByZWZpeCkge1xuICBjb25zdCBjb2RlUG9pbnQgPSBOdW1iZXIucGFyc2VJbnQoc3RyLCBiYXNlKTtcblxuICBpZiAoY29kZVBvaW50ID49IDAgJiYgY29kZVBvaW50IDw9IDB4MTBGRkZGKSB7XG4gICAgcmV0dXJuIFN0cmluZy5mcm9tQ29kZVBvaW50KGNvZGVQb2ludCk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHByZWZpeCArIHN0ciArIFwiO1wiO1xuICB9XG59XG5cbmZ1bmN0aW9uIHNhbml0aXplTmFtZShuYW1lLCBvcHRpb25zKSB7XG4gIGlmICh1dGlsLmNyaXRpY2FsUHJvcGVydGllcy5pbmNsdWRlcyhuYW1lKSkge1xuICAgIHRocm93IG5ldyBFcnJvcihgW1NFQ1VSSVRZXSBJbnZhbGlkIG5hbWU6IFwiJHtuYW1lfVwiIGlzIGEgcmVzZXJ2ZWQgSmF2YVNjcmlwdCBrZXl3b3JkIHRoYXQgY291bGQgY2F1c2UgcHJvdG90eXBlIHBvbGx1dGlvbmApO1xuICB9IGVsc2UgaWYgKHV0aWwuREFOR0VST1VTX1BST1BFUlRZX05BTUVTLmluY2x1ZGVzKG5hbWUpKSB7XG4gICAgcmV0dXJuIG9wdGlvbnMub25EYW5nZXJvdXNQcm9wZXJ0eShuYW1lKTtcbiAgfVxuICByZXR1cm4gbmFtZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBPcmRlcmVkT2JqUGFyc2VyO1xuXG4iLCAiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIFxuICogQHBhcmFtIHthcnJheX0gbm9kZSBcbiAqIEBwYXJhbSB7YW55fSBvcHRpb25zIFxuICogQHJldHVybnMgXG4gKi9cbmZ1bmN0aW9uIHByZXR0aWZ5KG5vZGUsIG9wdGlvbnMpe1xuICByZXR1cm4gY29tcHJlc3MoIG5vZGUsIG9wdGlvbnMpO1xufVxuXG4vKipcbiAqIFxuICogQHBhcmFtIHthcnJheX0gYXJyIFxuICogQHBhcmFtIHtvYmplY3R9IG9wdGlvbnMgXG4gKiBAcGFyYW0ge3N0cmluZ30galBhdGggXG4gKiBAcmV0dXJucyBvYmplY3RcbiAqL1xuZnVuY3Rpb24gY29tcHJlc3MoYXJyLCBvcHRpb25zLCBqUGF0aCl7XG4gIGxldCB0ZXh0O1xuICBjb25zdCBjb21wcmVzc2VkT2JqID0ge307XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgdGFnT2JqID0gYXJyW2ldO1xuICAgIGNvbnN0IHByb3BlcnR5ID0gcHJvcE5hbWUodGFnT2JqKTtcbiAgICBsZXQgbmV3SnBhdGggPSBcIlwiO1xuICAgIGlmKGpQYXRoID09PSB1bmRlZmluZWQpIG5ld0pwYXRoID0gcHJvcGVydHk7XG4gICAgZWxzZSBuZXdKcGF0aCA9IGpQYXRoICsgXCIuXCIgKyBwcm9wZXJ0eTtcblxuICAgIGlmKHByb3BlcnR5ID09PSBvcHRpb25zLnRleHROb2RlTmFtZSl7XG4gICAgICBpZih0ZXh0ID09PSB1bmRlZmluZWQpIHRleHQgPSB0YWdPYmpbcHJvcGVydHldO1xuICAgICAgZWxzZSB0ZXh0ICs9IFwiXCIgKyB0YWdPYmpbcHJvcGVydHldO1xuICAgIH1lbHNlIGlmKHByb3BlcnR5ID09PSB1bmRlZmluZWQpe1xuICAgICAgY29udGludWU7XG4gICAgfWVsc2UgaWYodGFnT2JqW3Byb3BlcnR5XSl7XG4gICAgICBcbiAgICAgIGxldCB2YWwgPSBjb21wcmVzcyh0YWdPYmpbcHJvcGVydHldLCBvcHRpb25zLCBuZXdKcGF0aCk7XG4gICAgICBjb25zdCBpc0xlYWYgPSBpc0xlYWZUYWcodmFsLCBvcHRpb25zKTtcblxuICAgICAgaWYodGFnT2JqW1wiOkBcIl0pe1xuICAgICAgICBhc3NpZ25BdHRyaWJ1dGVzKCB2YWwsIHRhZ09ialtcIjpAXCJdLCBuZXdKcGF0aCwgb3B0aW9ucyk7XG4gICAgICB9ZWxzZSBpZihPYmplY3Qua2V5cyh2YWwpLmxlbmd0aCA9PT0gMSAmJiB2YWxbb3B0aW9ucy50ZXh0Tm9kZU5hbWVdICE9PSB1bmRlZmluZWQgJiYgIW9wdGlvbnMuYWx3YXlzQ3JlYXRlVGV4dE5vZGUpe1xuICAgICAgICB2YWwgPSB2YWxbb3B0aW9ucy50ZXh0Tm9kZU5hbWVdO1xuICAgICAgfWVsc2UgaWYoT2JqZWN0LmtleXModmFsKS5sZW5ndGggPT09IDApe1xuICAgICAgICBpZihvcHRpb25zLmFsd2F5c0NyZWF0ZVRleHROb2RlKSB2YWxbb3B0aW9ucy50ZXh0Tm9kZU5hbWVdID0gXCJcIjtcbiAgICAgICAgZWxzZSB2YWwgPSBcIlwiO1xuICAgICAgfVxuXG4gICAgICBpZihjb21wcmVzc2VkT2JqW3Byb3BlcnR5XSAhPT0gdW5kZWZpbmVkICYmIGNvbXByZXNzZWRPYmouaGFzT3duUHJvcGVydHkocHJvcGVydHkpKSB7XG4gICAgICAgIGlmKCFBcnJheS5pc0FycmF5KGNvbXByZXNzZWRPYmpbcHJvcGVydHldKSkge1xuICAgICAgICAgICAgY29tcHJlc3NlZE9ialtwcm9wZXJ0eV0gPSBbIGNvbXByZXNzZWRPYmpbcHJvcGVydHldIF07XG4gICAgICAgIH1cbiAgICAgICAgY29tcHJlc3NlZE9ialtwcm9wZXJ0eV0ucHVzaCh2YWwpO1xuICAgICAgfWVsc2V7XG4gICAgICAgIC8vVE9ETzogaWYgYSBub2RlIGlzIG5vdCBhbiBhcnJheSwgdGhlbiBjaGVjayBpZiBpdCBzaG91bGQgYmUgYW4gYXJyYXlcbiAgICAgICAgLy9hbHNvIGRldGVybWluZSBpZiBpdCBpcyBhIGxlYWYgbm9kZVxuICAgICAgICBpZiAob3B0aW9ucy5pc0FycmF5KHByb3BlcnR5LCBuZXdKcGF0aCwgaXNMZWFmICkpIHtcbiAgICAgICAgICBjb21wcmVzc2VkT2JqW3Byb3BlcnR5XSA9IFt2YWxdO1xuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICBjb21wcmVzc2VkT2JqW3Byb3BlcnR5XSA9IHZhbDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBcbiAgfVxuICAvLyBpZih0ZXh0ICYmIHRleHQubGVuZ3RoID4gMCkgY29tcHJlc3NlZE9ialtvcHRpb25zLnRleHROb2RlTmFtZV0gPSB0ZXh0O1xuICBpZih0eXBlb2YgdGV4dCA9PT0gXCJzdHJpbmdcIil7XG4gICAgaWYodGV4dC5sZW5ndGggPiAwKSBjb21wcmVzc2VkT2JqW29wdGlvbnMudGV4dE5vZGVOYW1lXSA9IHRleHQ7XG4gIH1lbHNlIGlmKHRleHQgIT09IHVuZGVmaW5lZCkgY29tcHJlc3NlZE9ialtvcHRpb25zLnRleHROb2RlTmFtZV0gPSB0ZXh0O1xuICByZXR1cm4gY29tcHJlc3NlZE9iajtcbn1cblxuZnVuY3Rpb24gcHJvcE5hbWUob2JqKXtcbiAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKG9iaik7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IGtleSA9IGtleXNbaV07XG4gICAgaWYoa2V5ICE9PSBcIjpAXCIpIHJldHVybiBrZXk7XG4gIH1cbn1cblxuZnVuY3Rpb24gYXNzaWduQXR0cmlidXRlcyhvYmosIGF0dHJNYXAsIGpwYXRoLCBvcHRpb25zKXtcbiAgaWYgKGF0dHJNYXApIHtcbiAgICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXMoYXR0ck1hcCk7XG4gICAgY29uc3QgbGVuID0ga2V5cy5sZW5ndGg7IC8vZG9uJ3QgbWFrZSBpdCBpbmxpbmVcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBjb25zdCBhdHJyTmFtZSA9IGtleXNbaV07XG4gICAgICBpZiAob3B0aW9ucy5pc0FycmF5KGF0cnJOYW1lLCBqcGF0aCArIFwiLlwiICsgYXRyck5hbWUsIHRydWUsIHRydWUpKSB7XG4gICAgICAgIG9ialthdHJyTmFtZV0gPSBbIGF0dHJNYXBbYXRyck5hbWVdIF07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvYmpbYXRyck5hbWVdID0gYXR0ck1hcFthdHJyTmFtZV07XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGlzTGVhZlRhZyhvYmosIG9wdGlvbnMpe1xuICBjb25zdCB7IHRleHROb2RlTmFtZSB9ID0gb3B0aW9ucztcbiAgY29uc3QgcHJvcENvdW50ID0gT2JqZWN0LmtleXMob2JqKS5sZW5ndGg7XG4gIFxuICBpZiAocHJvcENvdW50ID09PSAwKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBpZiAoXG4gICAgcHJvcENvdW50ID09PSAxICYmXG4gICAgKG9ialt0ZXh0Tm9kZU5hbWVdIHx8IHR5cGVvZiBvYmpbdGV4dE5vZGVOYW1lXSA9PT0gXCJib29sZWFuXCIgfHwgb2JqW3RleHROb2RlTmFtZV0gPT09IDApXG4gICkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuZXhwb3J0cy5wcmV0dGlmeSA9IHByZXR0aWZ5O1xuIiwgImNvbnN0IHsgYnVpbGRPcHRpb25zfSA9IHJlcXVpcmUoXCIuL09wdGlvbnNCdWlsZGVyXCIpO1xuY29uc3QgT3JkZXJlZE9ialBhcnNlciA9IHJlcXVpcmUoXCIuL09yZGVyZWRPYmpQYXJzZXJcIik7XG5jb25zdCB7IHByZXR0aWZ5fSA9IHJlcXVpcmUoXCIuL25vZGUyanNvblwiKTtcbmNvbnN0IHZhbGlkYXRvciA9IHJlcXVpcmUoJy4uL3ZhbGlkYXRvcicpO1xuXG5jbGFzcyBYTUxQYXJzZXJ7XG4gICAgXG4gICAgY29uc3RydWN0b3Iob3B0aW9ucyl7XG4gICAgICAgIHRoaXMuZXh0ZXJuYWxFbnRpdGllcyA9IHt9O1xuICAgICAgICB0aGlzLm9wdGlvbnMgPSBidWlsZE9wdGlvbnMob3B0aW9ucyk7XG4gICAgICAgIFxuICAgIH1cbiAgICAvKipcbiAgICAgKiBQYXJzZSBYTUwgZGF0cyB0byBKUyBvYmplY3QgXG4gICAgICogQHBhcmFtIHtzdHJpbmd8QnVmZmVyfSB4bWxEYXRhIFxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbnxPYmplY3R9IHZhbGlkYXRpb25PcHRpb24gXG4gICAgICovXG4gICAgcGFyc2UoeG1sRGF0YSx2YWxpZGF0aW9uT3B0aW9uKXtcbiAgICAgICAgaWYodHlwZW9mIHhtbERhdGEgPT09IFwic3RyaW5nXCIpe1xuICAgICAgICB9ZWxzZSBpZiggeG1sRGF0YS50b1N0cmluZyl7XG4gICAgICAgICAgICB4bWxEYXRhID0geG1sRGF0YS50b1N0cmluZygpO1xuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlhNTCBkYXRhIGlzIGFjY2VwdGVkIGluIFN0cmluZyBvciBCeXRlc1tdIGZvcm0uXCIpXG4gICAgICAgIH1cbiAgICAgICAgaWYoIHZhbGlkYXRpb25PcHRpb24pe1xuICAgICAgICAgICAgaWYodmFsaWRhdGlvbk9wdGlvbiA9PT0gdHJ1ZSkgdmFsaWRhdGlvbk9wdGlvbiA9IHt9OyAvL3ZhbGlkYXRlIHdpdGggZGVmYXVsdCBvcHRpb25zXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IHZhbGlkYXRvci52YWxpZGF0ZSh4bWxEYXRhLCB2YWxpZGF0aW9uT3B0aW9uKTtcbiAgICAgICAgICAgIGlmIChyZXN1bHQgIT09IHRydWUpIHtcbiAgICAgICAgICAgICAgdGhyb3cgRXJyb3IoIGAke3Jlc3VsdC5lcnIubXNnfToke3Jlc3VsdC5lcnIubGluZX06JHtyZXN1bHQuZXJyLmNvbH1gIClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIGNvbnN0IG9yZGVyZWRPYmpQYXJzZXIgPSBuZXcgT3JkZXJlZE9ialBhcnNlcih0aGlzLm9wdGlvbnMpO1xuICAgICAgICBvcmRlcmVkT2JqUGFyc2VyLmFkZEV4dGVybmFsRW50aXRpZXModGhpcy5leHRlcm5hbEVudGl0aWVzKTtcbiAgICAgICAgY29uc3Qgb3JkZXJlZFJlc3VsdCA9IG9yZGVyZWRPYmpQYXJzZXIucGFyc2VYbWwoeG1sRGF0YSk7XG4gICAgICAgIGlmKHRoaXMub3B0aW9ucy5wcmVzZXJ2ZU9yZGVyIHx8IG9yZGVyZWRSZXN1bHQgPT09IHVuZGVmaW5lZCkgcmV0dXJuIG9yZGVyZWRSZXN1bHQ7XG4gICAgICAgIGVsc2UgcmV0dXJuIHByZXR0aWZ5KG9yZGVyZWRSZXN1bHQsIHRoaXMub3B0aW9ucyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWRkIEVudGl0eSB3aGljaCBpcyBub3QgYnkgZGVmYXVsdCBzdXBwb3J0ZWQgYnkgdGhpcyBsaWJyYXJ5XG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGtleSBcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdmFsdWUgXG4gICAgICovXG4gICAgYWRkRW50aXR5KGtleSwgdmFsdWUpe1xuICAgICAgICBpZih2YWx1ZS5pbmRleE9mKFwiJlwiKSAhPT0gLTEpe1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRW50aXR5IHZhbHVlIGNhbid0IGhhdmUgJyYnXCIpXG4gICAgICAgIH1lbHNlIGlmKGtleS5pbmRleE9mKFwiJlwiKSAhPT0gLTEgfHwga2V5LmluZGV4T2YoXCI7XCIpICE9PSAtMSl7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJBbiBlbnRpdHkgbXVzdCBiZSBzZXQgd2l0aG91dCAnJicgYW5kICc7Jy4gRWcuIHVzZSAnI3hEJyBmb3IgJyYjeEQ7J1wiKVxuICAgICAgICB9ZWxzZSBpZih2YWx1ZSA9PT0gXCImXCIpe1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQW4gZW50aXR5IHdpdGggdmFsdWUgJyYnIGlzIG5vdCBwZXJtaXR0ZWRcIik7XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgdGhpcy5leHRlcm5hbEVudGl0aWVzW2tleV0gPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBYTUxQYXJzZXI7IiwgImNvbnN0IEVPTCA9IFwiXFxuXCI7XG5cbi8qKlxuICogXG4gKiBAcGFyYW0ge2FycmF5fSBqQXJyYXkgXG4gKiBAcGFyYW0ge2FueX0gb3B0aW9ucyBcbiAqIEByZXR1cm5zIFxuICovXG5mdW5jdGlvbiB0b1htbChqQXJyYXksIG9wdGlvbnMpIHtcbiAgICBsZXQgaW5kZW50YXRpb24gPSBcIlwiO1xuICAgIGlmIChvcHRpb25zLmZvcm1hdCAmJiBvcHRpb25zLmluZGVudEJ5Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgaW5kZW50YXRpb24gPSBFT0w7XG4gICAgfVxuICAgIHJldHVybiBhcnJUb1N0cihqQXJyYXksIG9wdGlvbnMsIFwiXCIsIGluZGVudGF0aW9uKTtcbn1cblxuZnVuY3Rpb24gYXJyVG9TdHIoYXJyLCBvcHRpb25zLCBqUGF0aCwgaW5kZW50YXRpb24pIHtcbiAgICBsZXQgeG1sU3RyID0gXCJcIjtcbiAgICBsZXQgaXNQcmV2aW91c0VsZW1lbnRUYWcgPSBmYWxzZTtcblxuXG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGFycikpIHtcbiAgICAgICAgLy8gTm9uLWFycmF5IHZhbHVlcyAoZS5nLiBzdHJpbmcgdGFnIHZhbHVlcykgc2hvdWxkIGJlIHRyZWF0ZWQgYXMgdGV4dCBjb250ZW50XG4gICAgICAgIGlmIChhcnIgIT09IHVuZGVmaW5lZCAmJiBhcnIgIT09IG51bGwpIHtcbiAgICAgICAgICAgIGxldCB0ZXh0ID0gYXJyLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICB0ZXh0ID0gcmVwbGFjZUVudGl0aWVzVmFsdWUodGV4dCwgb3B0aW9ucyk7XG4gICAgICAgICAgICByZXR1cm4gdGV4dDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gXCJcIjtcbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFyci5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCB0YWdPYmogPSBhcnJbaV07XG4gICAgICAgIGNvbnN0IHRhZ05hbWUgPSBwcm9wTmFtZSh0YWdPYmopO1xuICAgICAgICBpZiAodGFnTmFtZSA9PT0gdW5kZWZpbmVkKSBjb250aW51ZTtcblxuICAgICAgICBsZXQgbmV3SlBhdGggPSBcIlwiO1xuICAgICAgICBpZiAoalBhdGgubGVuZ3RoID09PSAwKSBuZXdKUGF0aCA9IHRhZ05hbWVcbiAgICAgICAgZWxzZSBuZXdKUGF0aCA9IGAke2pQYXRofS4ke3RhZ05hbWV9YDtcblxuICAgICAgICBpZiAodGFnTmFtZSA9PT0gb3B0aW9ucy50ZXh0Tm9kZU5hbWUpIHtcbiAgICAgICAgICAgIGxldCB0YWdUZXh0ID0gdGFnT2JqW3RhZ05hbWVdO1xuICAgICAgICAgICAgaWYgKCFpc1N0b3BOb2RlKG5ld0pQYXRoLCBvcHRpb25zKSkge1xuICAgICAgICAgICAgICAgIHRhZ1RleHQgPSBvcHRpb25zLnRhZ1ZhbHVlUHJvY2Vzc29yKHRhZ05hbWUsIHRhZ1RleHQpO1xuICAgICAgICAgICAgICAgIHRhZ1RleHQgPSByZXBsYWNlRW50aXRpZXNWYWx1ZSh0YWdUZXh0LCBvcHRpb25zKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpc1ByZXZpb3VzRWxlbWVudFRhZykge1xuICAgICAgICAgICAgICAgIHhtbFN0ciArPSBpbmRlbnRhdGlvbjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHhtbFN0ciArPSB0YWdUZXh0O1xuICAgICAgICAgICAgaXNQcmV2aW91c0VsZW1lbnRUYWcgPSBmYWxzZTtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9IGVsc2UgaWYgKHRhZ05hbWUgPT09IG9wdGlvbnMuY2RhdGFQcm9wTmFtZSkge1xuICAgICAgICAgICAgaWYgKGlzUHJldmlvdXNFbGVtZW50VGFnKSB7XG4gICAgICAgICAgICAgICAgeG1sU3RyICs9IGluZGVudGF0aW9uO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgeG1sU3RyICs9IGA8IVtDREFUQVske3RhZ09ialt0YWdOYW1lXVswXVtvcHRpb25zLnRleHROb2RlTmFtZV19XV0+YDtcbiAgICAgICAgICAgIGlzUHJldmlvdXNFbGVtZW50VGFnID0gZmFsc2U7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfSBlbHNlIGlmICh0YWdOYW1lID09PSBvcHRpb25zLmNvbW1lbnRQcm9wTmFtZSkge1xuICAgICAgICAgICAgeG1sU3RyICs9IGluZGVudGF0aW9uICsgYDwhLS0ke3RhZ09ialt0YWdOYW1lXVswXVtvcHRpb25zLnRleHROb2RlTmFtZV19LS0+YDtcbiAgICAgICAgICAgIGlzUHJldmlvdXNFbGVtZW50VGFnID0gdHJ1ZTtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9IGVsc2UgaWYgKHRhZ05hbWVbMF0gPT09IFwiP1wiKSB7XG4gICAgICAgICAgICBjb25zdCBhdHRTdHIgPSBhdHRyX3RvX3N0cih0YWdPYmpbXCI6QFwiXSwgb3B0aW9ucyk7XG4gICAgICAgICAgICBjb25zdCB0ZW1wSW5kID0gdGFnTmFtZSA9PT0gXCI/eG1sXCIgPyBcIlwiIDogaW5kZW50YXRpb247XG4gICAgICAgICAgICBsZXQgcGlUZXh0Tm9kZU5hbWUgPSB0YWdPYmpbdGFnTmFtZV1bMF1bb3B0aW9ucy50ZXh0Tm9kZU5hbWVdO1xuICAgICAgICAgICAgcGlUZXh0Tm9kZU5hbWUgPSBwaVRleHROb2RlTmFtZS5sZW5ndGggIT09IDAgPyBcIiBcIiArIHBpVGV4dE5vZGVOYW1lIDogXCJcIjsgLy9yZW1vdmUgZXh0cmEgc3BhY2luZ1xuICAgICAgICAgICAgeG1sU3RyICs9IHRlbXBJbmQgKyBgPCR7dGFnTmFtZX0ke3BpVGV4dE5vZGVOYW1lfSR7YXR0U3RyfT8+YDtcbiAgICAgICAgICAgIGlzUHJldmlvdXNFbGVtZW50VGFnID0gdHJ1ZTtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIGxldCBuZXdJZGVudGF0aW9uID0gaW5kZW50YXRpb247XG4gICAgICAgIGlmIChuZXdJZGVudGF0aW9uICE9PSBcIlwiKSB7XG4gICAgICAgICAgICBuZXdJZGVudGF0aW9uICs9IG9wdGlvbnMuaW5kZW50Qnk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgYXR0U3RyID0gYXR0cl90b19zdHIodGFnT2JqW1wiOkBcIl0sIG9wdGlvbnMpO1xuICAgICAgICBjb25zdCB0YWdTdGFydCA9IGluZGVudGF0aW9uICsgYDwke3RhZ05hbWV9JHthdHRTdHJ9YDtcbiAgICAgICAgY29uc3QgdGFnVmFsdWUgPSBhcnJUb1N0cih0YWdPYmpbdGFnTmFtZV0sIG9wdGlvbnMsIG5ld0pQYXRoLCBuZXdJZGVudGF0aW9uKTtcbiAgICAgICAgaWYgKG9wdGlvbnMudW5wYWlyZWRUYWdzLmluZGV4T2YodGFnTmFtZSkgIT09IC0xKSB7XG4gICAgICAgICAgICBpZiAob3B0aW9ucy5zdXBwcmVzc1VucGFpcmVkTm9kZSkgeG1sU3RyICs9IHRhZ1N0YXJ0ICsgXCI+XCI7XG4gICAgICAgICAgICBlbHNlIHhtbFN0ciArPSB0YWdTdGFydCArIFwiLz5cIjtcbiAgICAgICAgfSBlbHNlIGlmICgoIXRhZ1ZhbHVlIHx8IHRhZ1ZhbHVlLmxlbmd0aCA9PT0gMCkgJiYgb3B0aW9ucy5zdXBwcmVzc0VtcHR5Tm9kZSkge1xuICAgICAgICAgICAgeG1sU3RyICs9IHRhZ1N0YXJ0ICsgXCIvPlwiO1xuICAgICAgICB9IGVsc2UgaWYgKHRhZ1ZhbHVlICYmIHRhZ1ZhbHVlLmVuZHNXaXRoKFwiPlwiKSkge1xuICAgICAgICAgICAgeG1sU3RyICs9IHRhZ1N0YXJ0ICsgYD4ke3RhZ1ZhbHVlfSR7aW5kZW50YXRpb259PC8ke3RhZ05hbWV9PmA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB4bWxTdHIgKz0gdGFnU3RhcnQgKyBcIj5cIjtcbiAgICAgICAgICAgIGlmICh0YWdWYWx1ZSAmJiBpbmRlbnRhdGlvbiAhPT0gXCJcIiAmJiAodGFnVmFsdWUuaW5jbHVkZXMoXCIvPlwiKSB8fCB0YWdWYWx1ZS5pbmNsdWRlcyhcIjwvXCIpKSkge1xuICAgICAgICAgICAgICAgIHhtbFN0ciArPSBpbmRlbnRhdGlvbiArIG9wdGlvbnMuaW5kZW50QnkgKyB0YWdWYWx1ZSArIGluZGVudGF0aW9uO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB4bWxTdHIgKz0gdGFnVmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB4bWxTdHIgKz0gYDwvJHt0YWdOYW1lfT5gO1xuICAgICAgICB9XG4gICAgICAgIGlzUHJldmlvdXNFbGVtZW50VGFnID0gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4geG1sU3RyO1xufVxuXG5mdW5jdGlvbiBwcm9wTmFtZShvYmopIHtcbiAgICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXMob2JqKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3Qga2V5ID0ga2V5c1tpXTtcbiAgICAgICAgaWYgKCFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpKSBjb250aW51ZTtcbiAgICAgICAgaWYgKGtleSAhPT0gXCI6QFwiKSByZXR1cm4ga2V5O1xuICAgIH1cbn1cblxuZnVuY3Rpb24gYXR0cl90b19zdHIoYXR0ck1hcCwgb3B0aW9ucykge1xuICAgIGxldCBhdHRyU3RyID0gXCJcIjtcbiAgICBpZiAoYXR0ck1hcCAmJiAhb3B0aW9ucy5pZ25vcmVBdHRyaWJ1dGVzKSB7XG4gICAgICAgIGZvciAobGV0IGF0dHIgaW4gYXR0ck1hcCkge1xuICAgICAgICAgICAgaWYgKCFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYXR0ck1hcCwgYXR0cikpIGNvbnRpbnVlO1xuICAgICAgICAgICAgbGV0IGF0dHJWYWwgPSBvcHRpb25zLmF0dHJpYnV0ZVZhbHVlUHJvY2Vzc29yKGF0dHIsIGF0dHJNYXBbYXR0cl0pO1xuICAgICAgICAgICAgYXR0clZhbCA9IHJlcGxhY2VFbnRpdGllc1ZhbHVlKGF0dHJWYWwsIG9wdGlvbnMpO1xuICAgICAgICAgICAgaWYgKGF0dHJWYWwgPT09IHRydWUgJiYgb3B0aW9ucy5zdXBwcmVzc0Jvb2xlYW5BdHRyaWJ1dGVzKSB7XG4gICAgICAgICAgICAgICAgYXR0clN0ciArPSBgICR7YXR0ci5zdWJzdHIob3B0aW9ucy5hdHRyaWJ1dGVOYW1lUHJlZml4Lmxlbmd0aCl9YDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYXR0clN0ciArPSBgICR7YXR0ci5zdWJzdHIob3B0aW9ucy5hdHRyaWJ1dGVOYW1lUHJlZml4Lmxlbmd0aCl9PVwiJHthdHRyVmFsfVwiYDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gYXR0clN0cjtcbn1cblxuZnVuY3Rpb24gaXNTdG9wTm9kZShqUGF0aCwgb3B0aW9ucykge1xuICAgIGpQYXRoID0galBhdGguc3Vic3RyKDAsIGpQYXRoLmxlbmd0aCAtIG9wdGlvbnMudGV4dE5vZGVOYW1lLmxlbmd0aCAtIDEpO1xuICAgIGxldCB0YWdOYW1lID0galBhdGguc3Vic3RyKGpQYXRoLmxhc3RJbmRleE9mKFwiLlwiKSArIDEpO1xuICAgIGZvciAobGV0IGluZGV4IGluIG9wdGlvbnMuc3RvcE5vZGVzKSB7XG4gICAgICAgIGlmIChvcHRpb25zLnN0b3BOb2Rlc1tpbmRleF0gPT09IGpQYXRoIHx8IG9wdGlvbnMuc3RvcE5vZGVzW2luZGV4XSA9PT0gXCIqLlwiICsgdGFnTmFtZSkgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gcmVwbGFjZUVudGl0aWVzVmFsdWUodGV4dFZhbHVlLCBvcHRpb25zKSB7XG4gICAgaWYgKHRleHRWYWx1ZSAmJiB0ZXh0VmFsdWUubGVuZ3RoID4gMCAmJiBvcHRpb25zLnByb2Nlc3NFbnRpdGllcykge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG9wdGlvbnMuZW50aXRpZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGVudGl0eSA9IG9wdGlvbnMuZW50aXRpZXNbaV07XG4gICAgICAgICAgICB0ZXh0VmFsdWUgPSB0ZXh0VmFsdWUucmVwbGFjZShlbnRpdHkucmVnZXgsIGVudGl0eS52YWwpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0ZXh0VmFsdWU7XG59XG5tb2R1bGUuZXhwb3J0cyA9IHRvWG1sO1xuIiwgIid1c2Ugc3RyaWN0Jztcbi8vcGFyc2UgRW1wdHkgTm9kZSBhcyBzZWxmIGNsb3Npbmcgbm9kZVxuY29uc3QgYnVpbGRGcm9tT3JkZXJlZEpzID0gcmVxdWlyZSgnLi9vcmRlcmVkSnMyWG1sJyk7XG5jb25zdCBnZXRJZ25vcmVBdHRyaWJ1dGVzRm4gPSByZXF1aXJlKCcuLi9pZ25vcmVBdHRyaWJ1dGVzJylcblxuY29uc3QgZGVmYXVsdE9wdGlvbnMgPSB7XG4gIGF0dHJpYnV0ZU5hbWVQcmVmaXg6ICdAXycsXG4gIGF0dHJpYnV0ZXNHcm91cE5hbWU6IGZhbHNlLFxuICB0ZXh0Tm9kZU5hbWU6ICcjdGV4dCcsXG4gIGlnbm9yZUF0dHJpYnV0ZXM6IHRydWUsXG4gIGNkYXRhUHJvcE5hbWU6IGZhbHNlLFxuICBmb3JtYXQ6IGZhbHNlLFxuICBpbmRlbnRCeTogJyAgJyxcbiAgc3VwcHJlc3NFbXB0eU5vZGU6IGZhbHNlLFxuICBzdXBwcmVzc1VucGFpcmVkTm9kZTogdHJ1ZSxcbiAgc3VwcHJlc3NCb29sZWFuQXR0cmlidXRlczogdHJ1ZSxcbiAgdGFnVmFsdWVQcm9jZXNzb3I6IGZ1bmN0aW9uKGtleSwgYSkge1xuICAgIHJldHVybiBhO1xuICB9LFxuICBhdHRyaWJ1dGVWYWx1ZVByb2Nlc3NvcjogZnVuY3Rpb24oYXR0ck5hbWUsIGEpIHtcbiAgICByZXR1cm4gYTtcbiAgfSxcbiAgcHJlc2VydmVPcmRlcjogZmFsc2UsXG4gIGNvbW1lbnRQcm9wTmFtZTogZmFsc2UsXG4gIHVucGFpcmVkVGFnczogW10sXG4gIGVudGl0aWVzOiBbXG4gICAgeyByZWdleDogbmV3IFJlZ0V4cChcIiZcIiwgXCJnXCIpLCB2YWw6IFwiJmFtcDtcIiB9LC8vaXQgbXVzdCBiZSBvbiB0b3BcbiAgICB7IHJlZ2V4OiBuZXcgUmVnRXhwKFwiPlwiLCBcImdcIiksIHZhbDogXCImZ3Q7XCIgfSxcbiAgICB7IHJlZ2V4OiBuZXcgUmVnRXhwKFwiPFwiLCBcImdcIiksIHZhbDogXCImbHQ7XCIgfSxcbiAgICB7IHJlZ2V4OiBuZXcgUmVnRXhwKFwiXFwnXCIsIFwiZ1wiKSwgdmFsOiBcIiZhcG9zO1wiIH0sXG4gICAgeyByZWdleDogbmV3IFJlZ0V4cChcIlxcXCJcIiwgXCJnXCIpLCB2YWw6IFwiJnF1b3Q7XCIgfVxuICBdLFxuICBwcm9jZXNzRW50aXRpZXM6IHRydWUsXG4gIHN0b3BOb2RlczogW10sXG4gIC8vIHRyYW5zZm9ybVRhZ05hbWU6IGZhbHNlLFxuICAvLyB0cmFuc2Zvcm1BdHRyaWJ1dGVOYW1lOiBmYWxzZSxcbiAgb25lTGlzdEdyb3VwOiBmYWxzZVxufTtcblxuZnVuY3Rpb24gQnVpbGRlcihvcHRpb25zKSB7XG4gIHRoaXMub3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe30sIGRlZmF1bHRPcHRpb25zLCBvcHRpb25zKTtcbiAgaWYgKHRoaXMub3B0aW9ucy5pZ25vcmVBdHRyaWJ1dGVzID09PSB0cnVlIHx8IHRoaXMub3B0aW9ucy5hdHRyaWJ1dGVzR3JvdXBOYW1lKSB7XG4gICAgdGhpcy5pc0F0dHJpYnV0ZSA9IGZ1bmN0aW9uKC8qYSovKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfTtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLmlnbm9yZUF0dHJpYnV0ZXNGbiA9IGdldElnbm9yZUF0dHJpYnV0ZXNGbih0aGlzLm9wdGlvbnMuaWdub3JlQXR0cmlidXRlcylcbiAgICB0aGlzLmF0dHJQcmVmaXhMZW4gPSB0aGlzLm9wdGlvbnMuYXR0cmlidXRlTmFtZVByZWZpeC5sZW5ndGg7XG4gICAgdGhpcy5pc0F0dHJpYnV0ZSA9IGlzQXR0cmlidXRlO1xuICB9XG5cbiAgdGhpcy5wcm9jZXNzVGV4dE9yT2JqTm9kZSA9IHByb2Nlc3NUZXh0T3JPYmpOb2RlXG5cbiAgaWYgKHRoaXMub3B0aW9ucy5mb3JtYXQpIHtcbiAgICB0aGlzLmluZGVudGF0ZSA9IGluZGVudGF0ZTtcbiAgICB0aGlzLnRhZ0VuZENoYXIgPSAnPlxcbic7XG4gICAgdGhpcy5uZXdMaW5lID0gJ1xcbic7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5pbmRlbnRhdGUgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiAnJztcbiAgICB9O1xuICAgIHRoaXMudGFnRW5kQ2hhciA9ICc+JztcbiAgICB0aGlzLm5ld0xpbmUgPSAnJztcbiAgfVxufVxuXG5CdWlsZGVyLnByb3RvdHlwZS5idWlsZCA9IGZ1bmN0aW9uKGpPYmopIHtcbiAgaWYodGhpcy5vcHRpb25zLnByZXNlcnZlT3JkZXIpe1xuICAgIHJldHVybiBidWlsZEZyb21PcmRlcmVkSnMoak9iaiwgdGhpcy5vcHRpb25zKTtcbiAgfWVsc2Uge1xuICAgIGlmKEFycmF5LmlzQXJyYXkoak9iaikgJiYgdGhpcy5vcHRpb25zLmFycmF5Tm9kZU5hbWUgJiYgdGhpcy5vcHRpb25zLmFycmF5Tm9kZU5hbWUubGVuZ3RoID4gMSl7XG4gICAgICBqT2JqID0ge1xuICAgICAgICBbdGhpcy5vcHRpb25zLmFycmF5Tm9kZU5hbWVdIDogak9ialxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5qMngoak9iaiwgMCwgW10pLnZhbDtcbiAgfVxufTtcblxuQnVpbGRlci5wcm90b3R5cGUuajJ4ID0gZnVuY3Rpb24oak9iaiwgbGV2ZWwsIGFqUGF0aCkge1xuICBsZXQgYXR0clN0ciA9ICcnO1xuICBsZXQgdmFsID0gJyc7XG4gIGNvbnN0IGpQYXRoID0gYWpQYXRoLmpvaW4oJy4nKVxuICBmb3IgKGxldCBrZXkgaW4gak9iaikge1xuICAgIGlmKCFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoak9iaiwga2V5KSkgY29udGludWU7XG4gICAgaWYgKHR5cGVvZiBqT2JqW2tleV0gPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAvLyBzdXByZXNzIHVuZGVmaW5lZCBub2RlIG9ubHkgaWYgaXQgaXMgbm90IGFuIGF0dHJpYnV0ZVxuICAgICAgaWYgKHRoaXMuaXNBdHRyaWJ1dGUoa2V5KSkge1xuICAgICAgICB2YWwgKz0gJyc7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChqT2JqW2tleV0gPT09IG51bGwpIHtcbiAgICAgIC8vIG51bGwgYXR0cmlidXRlIHNob3VsZCBiZSBpZ25vcmVkIGJ5IHRoZSBhdHRyaWJ1dGUgbGlzdCwgYnV0IHNob3VsZCBub3QgY2F1c2UgdGhlIHRhZyBjbG9zaW5nXG4gICAgICBpZiAodGhpcy5pc0F0dHJpYnV0ZShrZXkpKSB7XG4gICAgICAgIHZhbCArPSAnJztcbiAgICAgIH0gZWxzZSBpZiAoa2V5ID09PSB0aGlzLm9wdGlvbnMuY2RhdGFQcm9wTmFtZSkge1xuICAgICAgICB2YWwgKz0gJyc7XG4gICAgICB9IGVsc2UgaWYgKGtleVswXSA9PT0gJz8nKSB7XG4gICAgICAgIHZhbCArPSB0aGlzLmluZGVudGF0ZShsZXZlbCkgKyAnPCcgKyBrZXkgKyAnPycgKyB0aGlzLnRhZ0VuZENoYXI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YWwgKz0gdGhpcy5pbmRlbnRhdGUobGV2ZWwpICsgJzwnICsga2V5ICsgJy8nICsgdGhpcy50YWdFbmRDaGFyO1xuICAgICAgfVxuICAgICAgLy8gdmFsICs9IHRoaXMuaW5kZW50YXRlKGxldmVsKSArICc8JyArIGtleSArICcvJyArIHRoaXMudGFnRW5kQ2hhcjtcbiAgICB9IGVsc2UgaWYgKGpPYmpba2V5XSBpbnN0YW5jZW9mIERhdGUpIHtcbiAgICAgIHZhbCArPSB0aGlzLmJ1aWxkVGV4dFZhbE5vZGUoak9ialtrZXldLCBrZXksICcnLCBsZXZlbCk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2Ygak9ialtrZXldICE9PSAnb2JqZWN0Jykge1xuICAgICAgLy9wcmVtaXRpdmUgdHlwZVxuICAgICAgY29uc3QgYXR0ciA9IHRoaXMuaXNBdHRyaWJ1dGUoa2V5KTtcbiAgICAgIGlmIChhdHRyICYmICF0aGlzLmlnbm9yZUF0dHJpYnV0ZXNGbihhdHRyLCBqUGF0aCkpIHtcbiAgICAgICAgYXR0clN0ciArPSB0aGlzLmJ1aWxkQXR0clBhaXJTdHIoYXR0ciwgJycgKyBqT2JqW2tleV0pO1xuICAgICAgfSBlbHNlIGlmICghYXR0cikge1xuICAgICAgICAvL3RhZyB2YWx1ZVxuICAgICAgICBpZiAoa2V5ID09PSB0aGlzLm9wdGlvbnMudGV4dE5vZGVOYW1lKSB7XG4gICAgICAgICAgbGV0IG5ld3ZhbCA9IHRoaXMub3B0aW9ucy50YWdWYWx1ZVByb2Nlc3NvcihrZXksICcnICsgak9ialtrZXldKTtcbiAgICAgICAgICB2YWwgKz0gdGhpcy5yZXBsYWNlRW50aXRpZXNWYWx1ZShuZXd2YWwpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhbCArPSB0aGlzLmJ1aWxkVGV4dFZhbE5vZGUoak9ialtrZXldLCBrZXksICcnLCBsZXZlbCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkoak9ialtrZXldKSkge1xuICAgICAgLy9yZXBlYXRlZCBub2Rlc1xuICAgICAgY29uc3QgYXJyTGVuID0gak9ialtrZXldLmxlbmd0aDtcbiAgICAgIGxldCBsaXN0VGFnVmFsID0gXCJcIjtcbiAgICAgIGxldCBsaXN0VGFnQXR0ciA9IFwiXCI7XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGFyckxlbjsgaisrKSB7XG4gICAgICAgIGNvbnN0IGl0ZW0gPSBqT2JqW2tleV1bal07XG4gICAgICAgIGlmICh0eXBlb2YgaXRlbSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAvLyBzdXByZXNzIHVuZGVmaW5lZCBub2RlXG4gICAgICAgIH0gZWxzZSBpZiAoaXRlbSA9PT0gbnVsbCkge1xuICAgICAgICAgIGlmKGtleVswXSA9PT0gXCI/XCIpIHZhbCArPSB0aGlzLmluZGVudGF0ZShsZXZlbCkgKyAnPCcgKyBrZXkgKyAnPycgKyB0aGlzLnRhZ0VuZENoYXI7XG4gICAgICAgICAgZWxzZSB2YWwgKz0gdGhpcy5pbmRlbnRhdGUobGV2ZWwpICsgJzwnICsga2V5ICsgJy8nICsgdGhpcy50YWdFbmRDaGFyO1xuICAgICAgICAgIC8vIHZhbCArPSB0aGlzLmluZGVudGF0ZShsZXZlbCkgKyAnPCcgKyBrZXkgKyAnLycgKyB0aGlzLnRhZ0VuZENoYXI7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGl0ZW0gPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgaWYodGhpcy5vcHRpb25zLm9uZUxpc3RHcm91cCl7XG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSB0aGlzLmoyeChpdGVtLCBsZXZlbCArIDEsIGFqUGF0aC5jb25jYXQoa2V5KSk7XG4gICAgICAgICAgICBsaXN0VGFnVmFsICs9IHJlc3VsdC52YWw7XG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLmF0dHJpYnV0ZXNHcm91cE5hbWUgJiYgaXRlbS5oYXNPd25Qcm9wZXJ0eSh0aGlzLm9wdGlvbnMuYXR0cmlidXRlc0dyb3VwTmFtZSkpIHtcbiAgICAgICAgICAgICAgbGlzdFRhZ0F0dHIgKz0gcmVzdWx0LmF0dHJTdHJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIGxpc3RUYWdWYWwgKz0gdGhpcy5wcm9jZXNzVGV4dE9yT2JqTm9kZShpdGVtLCBrZXksIGxldmVsLCBhalBhdGgpXG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMub25lTGlzdEdyb3VwKSB7XG4gICAgICAgICAgICBsZXQgdGV4dFZhbHVlID0gdGhpcy5vcHRpb25zLnRhZ1ZhbHVlUHJvY2Vzc29yKGtleSwgaXRlbSk7XG4gICAgICAgICAgICB0ZXh0VmFsdWUgPSB0aGlzLnJlcGxhY2VFbnRpdGllc1ZhbHVlKHRleHRWYWx1ZSk7XG4gICAgICAgICAgICBsaXN0VGFnVmFsICs9IHRleHRWYWx1ZTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGlzdFRhZ1ZhbCArPSB0aGlzLmJ1aWxkVGV4dFZhbE5vZGUoaXRlbSwga2V5LCAnJywgbGV2ZWwpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYodGhpcy5vcHRpb25zLm9uZUxpc3RHcm91cCl7XG4gICAgICAgIGxpc3RUYWdWYWwgPSB0aGlzLmJ1aWxkT2JqZWN0Tm9kZShsaXN0VGFnVmFsLCBrZXksIGxpc3RUYWdBdHRyLCBsZXZlbCk7XG4gICAgICB9XG4gICAgICB2YWwgKz0gbGlzdFRhZ1ZhbDtcbiAgICB9IGVsc2Uge1xuICAgICAgLy9uZXN0ZWQgbm9kZVxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5hdHRyaWJ1dGVzR3JvdXBOYW1lICYmIGtleSA9PT0gdGhpcy5vcHRpb25zLmF0dHJpYnV0ZXNHcm91cE5hbWUpIHtcbiAgICAgICAgY29uc3QgS3MgPSBPYmplY3Qua2V5cyhqT2JqW2tleV0pO1xuICAgICAgICBjb25zdCBMID0gS3MubGVuZ3RoO1xuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IEw7IGorKykge1xuICAgICAgICAgIGF0dHJTdHIgKz0gdGhpcy5idWlsZEF0dHJQYWlyU3RyKEtzW2pdLCAnJyArIGpPYmpba2V5XVtLc1tqXV0pO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YWwgKz0gdGhpcy5wcm9jZXNzVGV4dE9yT2JqTm9kZShqT2JqW2tleV0sIGtleSwgbGV2ZWwsIGFqUGF0aClcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHthdHRyU3RyOiBhdHRyU3RyLCB2YWw6IHZhbH07XG59O1xuXG5CdWlsZGVyLnByb3RvdHlwZS5idWlsZEF0dHJQYWlyU3RyID0gZnVuY3Rpb24oYXR0ck5hbWUsIHZhbCl7XG4gIHZhbCA9IHRoaXMub3B0aW9ucy5hdHRyaWJ1dGVWYWx1ZVByb2Nlc3NvcihhdHRyTmFtZSwgJycgKyB2YWwpO1xuICB2YWwgPSB0aGlzLnJlcGxhY2VFbnRpdGllc1ZhbHVlKHZhbCk7XG4gIGlmICh0aGlzLm9wdGlvbnMuc3VwcHJlc3NCb29sZWFuQXR0cmlidXRlcyAmJiB2YWwgPT09IFwidHJ1ZVwiKSB7XG4gICAgcmV0dXJuICcgJyArIGF0dHJOYW1lO1xuICB9IGVsc2UgcmV0dXJuICcgJyArIGF0dHJOYW1lICsgJz1cIicgKyB2YWwgKyAnXCInO1xufVxuXG5mdW5jdGlvbiBwcm9jZXNzVGV4dE9yT2JqTm9kZSAob2JqZWN0LCBrZXksIGxldmVsLCBhalBhdGgpIHtcbiAgY29uc3QgcmVzdWx0ID0gdGhpcy5qMngob2JqZWN0LCBsZXZlbCArIDEsIGFqUGF0aC5jb25jYXQoa2V5KSk7XG4gIGlmIChvYmplY3RbdGhpcy5vcHRpb25zLnRleHROb2RlTmFtZV0gIT09IHVuZGVmaW5lZCAmJiBPYmplY3Qua2V5cyhvYmplY3QpLmxlbmd0aCA9PT0gMSkge1xuICAgIHJldHVybiB0aGlzLmJ1aWxkVGV4dFZhbE5vZGUob2JqZWN0W3RoaXMub3B0aW9ucy50ZXh0Tm9kZU5hbWVdLCBrZXksIHJlc3VsdC5hdHRyU3RyLCBsZXZlbCk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHRoaXMuYnVpbGRPYmplY3ROb2RlKHJlc3VsdC52YWwsIGtleSwgcmVzdWx0LmF0dHJTdHIsIGxldmVsKTtcbiAgfVxufVxuXG5CdWlsZGVyLnByb3RvdHlwZS5idWlsZE9iamVjdE5vZGUgPSBmdW5jdGlvbih2YWwsIGtleSwgYXR0clN0ciwgbGV2ZWwpIHtcbiAgaWYodmFsID09PSBcIlwiKXtcbiAgICBpZihrZXlbMF0gPT09IFwiP1wiKSByZXR1cm4gIHRoaXMuaW5kZW50YXRlKGxldmVsKSArICc8JyArIGtleSArIGF0dHJTdHIrICc/JyArIHRoaXMudGFnRW5kQ2hhcjtcbiAgICBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLmluZGVudGF0ZShsZXZlbCkgKyAnPCcgKyBrZXkgKyBhdHRyU3RyICsgdGhpcy5jbG9zZVRhZyhrZXkpICsgdGhpcy50YWdFbmRDaGFyO1xuICAgIH1cbiAgfWVsc2V7XG5cbiAgICBsZXQgdGFnRW5kRXhwID0gJzwvJyArIGtleSArIHRoaXMudGFnRW5kQ2hhcjtcbiAgICBsZXQgcGlDbG9zaW5nQ2hhciA9IFwiXCI7XG4gICAgXG4gICAgaWYoa2V5WzBdID09PSBcIj9cIikge1xuICAgICAgcGlDbG9zaW5nQ2hhciA9IFwiP1wiO1xuICAgICAgdGFnRW5kRXhwID0gXCJcIjtcbiAgICB9XG4gIFxuICAgIC8vIGF0dHJTdHIgaXMgYW4gZW1wdHkgc3RyaW5nIGluIGNhc2UgdGhlIGF0dHJpYnV0ZSBjYW1lIGFzIHVuZGVmaW5lZCBvciBudWxsXG4gICAgaWYgKChhdHRyU3RyIHx8IGF0dHJTdHIgPT09ICcnKSAmJiB2YWwuaW5kZXhPZignPCcpID09PSAtMSkge1xuICAgICAgcmV0dXJuICggdGhpcy5pbmRlbnRhdGUobGV2ZWwpICsgJzwnICsgIGtleSArIGF0dHJTdHIgKyBwaUNsb3NpbmdDaGFyICsgJz4nICsgdmFsICsgdGFnRW5kRXhwICk7XG4gICAgfSBlbHNlIGlmICh0aGlzLm9wdGlvbnMuY29tbWVudFByb3BOYW1lICE9PSBmYWxzZSAmJiBrZXkgPT09IHRoaXMub3B0aW9ucy5jb21tZW50UHJvcE5hbWUgJiYgcGlDbG9zaW5nQ2hhci5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiB0aGlzLmluZGVudGF0ZShsZXZlbCkgKyBgPCEtLSR7dmFsfS0tPmAgKyB0aGlzLm5ld0xpbmU7XG4gICAgfWVsc2Uge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgdGhpcy5pbmRlbnRhdGUobGV2ZWwpICsgJzwnICsga2V5ICsgYXR0clN0ciArIHBpQ2xvc2luZ0NoYXIgKyB0aGlzLnRhZ0VuZENoYXIgK1xuICAgICAgICB2YWwgK1xuICAgICAgICB0aGlzLmluZGVudGF0ZShsZXZlbCkgKyB0YWdFbmRFeHAgICAgKTtcbiAgICB9XG4gIH1cbn1cblxuQnVpbGRlci5wcm90b3R5cGUuY2xvc2VUYWcgPSBmdW5jdGlvbihrZXkpe1xuICBsZXQgY2xvc2VUYWcgPSBcIlwiO1xuICBpZih0aGlzLm9wdGlvbnMudW5wYWlyZWRUYWdzLmluZGV4T2Yoa2V5KSAhPT0gLTEpeyAvL3VucGFpcmVkXG4gICAgaWYoIXRoaXMub3B0aW9ucy5zdXBwcmVzc1VucGFpcmVkTm9kZSkgY2xvc2VUYWcgPSBcIi9cIlxuICB9ZWxzZSBpZih0aGlzLm9wdGlvbnMuc3VwcHJlc3NFbXB0eU5vZGUpeyAvL2VtcHR5XG4gICAgY2xvc2VUYWcgPSBcIi9cIjtcbiAgfWVsc2V7XG4gICAgY2xvc2VUYWcgPSBgPjwvJHtrZXl9YFxuICB9XG4gIHJldHVybiBjbG9zZVRhZztcbn1cblxuZnVuY3Rpb24gYnVpbGRFbXB0eU9iak5vZGUodmFsLCBrZXksIGF0dHJTdHIsIGxldmVsKSB7XG4gIGlmICh2YWwgIT09ICcnKSB7XG4gICAgcmV0dXJuIHRoaXMuYnVpbGRPYmplY3ROb2RlKHZhbCwga2V5LCBhdHRyU3RyLCBsZXZlbCk7XG4gIH0gZWxzZSB7XG4gICAgaWYoa2V5WzBdID09PSBcIj9cIikgcmV0dXJuICB0aGlzLmluZGVudGF0ZShsZXZlbCkgKyAnPCcgKyBrZXkgKyBhdHRyU3RyKyAnPycgKyB0aGlzLnRhZ0VuZENoYXI7XG4gICAgZWxzZSB7XG4gICAgICByZXR1cm4gIHRoaXMuaW5kZW50YXRlKGxldmVsKSArICc8JyArIGtleSArIGF0dHJTdHIgKyAnLycgKyB0aGlzLnRhZ0VuZENoYXI7XG4gICAgICAvLyByZXR1cm4gdGhpcy5idWlsZFRhZ1N0cihsZXZlbCxrZXksIGF0dHJTdHIpO1xuICAgIH1cbiAgfVxufVxuXG5CdWlsZGVyLnByb3RvdHlwZS5idWlsZFRleHRWYWxOb2RlID0gZnVuY3Rpb24odmFsLCBrZXksIGF0dHJTdHIsIGxldmVsKSB7XG4gIGlmICh0aGlzLm9wdGlvbnMuY2RhdGFQcm9wTmFtZSAhPT0gZmFsc2UgJiYga2V5ID09PSB0aGlzLm9wdGlvbnMuY2RhdGFQcm9wTmFtZSkge1xuICAgIHJldHVybiB0aGlzLmluZGVudGF0ZShsZXZlbCkgKyBgPCFbQ0RBVEFbJHt2YWx9XV0+YCArICB0aGlzLm5ld0xpbmU7XG4gIH1lbHNlIGlmICh0aGlzLm9wdGlvbnMuY29tbWVudFByb3BOYW1lICE9PSBmYWxzZSAmJiBrZXkgPT09IHRoaXMub3B0aW9ucy5jb21tZW50UHJvcE5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5pbmRlbnRhdGUobGV2ZWwpICsgYDwhLS0ke3ZhbH0tLT5gICsgIHRoaXMubmV3TGluZTtcbiAgfWVsc2UgaWYoa2V5WzBdID09PSBcIj9cIikgey8vUEkgdGFnXG4gICAgcmV0dXJuICB0aGlzLmluZGVudGF0ZShsZXZlbCkgKyAnPCcgKyBrZXkgKyBhdHRyU3RyKyAnPycgKyB0aGlzLnRhZ0VuZENoYXI7IFxuICB9ZWxzZXtcbiAgICBsZXQgdGV4dFZhbHVlID0gdGhpcy5vcHRpb25zLnRhZ1ZhbHVlUHJvY2Vzc29yKGtleSwgdmFsKTtcbiAgICB0ZXh0VmFsdWUgPSB0aGlzLnJlcGxhY2VFbnRpdGllc1ZhbHVlKHRleHRWYWx1ZSk7XG4gIFxuICAgIGlmKCB0ZXh0VmFsdWUgPT09ICcnKXtcbiAgICAgIHJldHVybiB0aGlzLmluZGVudGF0ZShsZXZlbCkgKyAnPCcgKyBrZXkgKyBhdHRyU3RyICsgdGhpcy5jbG9zZVRhZyhrZXkpICsgdGhpcy50YWdFbmRDaGFyO1xuICAgIH1lbHNle1xuICAgICAgcmV0dXJuIHRoaXMuaW5kZW50YXRlKGxldmVsKSArICc8JyArIGtleSArIGF0dHJTdHIgKyAnPicgK1xuICAgICAgICAgdGV4dFZhbHVlICtcbiAgICAgICAgJzwvJyArIGtleSArIHRoaXMudGFnRW5kQ2hhcjtcbiAgICB9XG4gIH1cbn1cblxuQnVpbGRlci5wcm90b3R5cGUucmVwbGFjZUVudGl0aWVzVmFsdWUgPSBmdW5jdGlvbih0ZXh0VmFsdWUpe1xuICBpZih0ZXh0VmFsdWUgJiYgdGV4dFZhbHVlLmxlbmd0aCA+IDAgJiYgdGhpcy5vcHRpb25zLnByb2Nlc3NFbnRpdGllcyl7XG4gICAgZm9yIChsZXQgaT0wOyBpPHRoaXMub3B0aW9ucy5lbnRpdGllcy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgZW50aXR5ID0gdGhpcy5vcHRpb25zLmVudGl0aWVzW2ldO1xuICAgICAgdGV4dFZhbHVlID0gdGV4dFZhbHVlLnJlcGxhY2UoZW50aXR5LnJlZ2V4LCBlbnRpdHkudmFsKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRleHRWYWx1ZTtcbn1cblxuZnVuY3Rpb24gaW5kZW50YXRlKGxldmVsKSB7XG4gIHJldHVybiB0aGlzLm9wdGlvbnMuaW5kZW50QnkucmVwZWF0KGxldmVsKTtcbn1cblxuZnVuY3Rpb24gaXNBdHRyaWJ1dGUobmFtZSAvKiwgb3B0aW9ucyovKSB7XG4gIGlmIChuYW1lLnN0YXJ0c1dpdGgodGhpcy5vcHRpb25zLmF0dHJpYnV0ZU5hbWVQcmVmaXgpICYmIG5hbWUgIT09IHRoaXMub3B0aW9ucy50ZXh0Tm9kZU5hbWUpIHtcbiAgICByZXR1cm4gbmFtZS5zdWJzdHIodGhpcy5hdHRyUHJlZml4TGVuKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBCdWlsZGVyO1xuIiwgIid1c2Ugc3RyaWN0JztcblxuY29uc3QgdmFsaWRhdG9yID0gcmVxdWlyZSgnLi92YWxpZGF0b3InKTtcbmNvbnN0IFhNTFBhcnNlciA9IHJlcXVpcmUoJy4veG1scGFyc2VyL1hNTFBhcnNlcicpO1xuY29uc3QgWE1MQnVpbGRlciA9IHJlcXVpcmUoJy4veG1sYnVpbGRlci9qc29uMnhtbCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgWE1MUGFyc2VyOiBYTUxQYXJzZXIsXG4gIFhNTFZhbGlkYXRvcjogdmFsaWRhdG9yLFxuICBYTUxCdWlsZGVyOiBYTUxCdWlsZGVyXG59IiwgIi8vIEVsZWN0cm9uIG1haW4gcHJvY2Vzczogd2luZG93IGxpZmVjeWNsZSwgc2VjdXJpdHkgcG9saWN5LCBJUEMgd2lyaW5nIGZvclxuLy8gZXZlcnkgY2hhbm5lbCBpbiBzcmMvc2hhcmVkL2lwYy50cywgYW5kIHRoZSBhdXRvbWF0ZWQgc21va2Utc2NyZWVuc2hvdFxuLy8gbW9kZS4gRGF0YSBoYW5kbGVycyBuZXZlciByZWplY3QgXHUyMDE0IHRoZXkgdmFsaWRhdGUgaW5wdXRzIGFuZCBmYWxsIGJhY2sgdG9cbi8vIGRldGVybWluaXN0aWMgc2FtcGxlIHBheWxvYWRzIHNvIHRoZSByZW5kZXJlciBuZXZlciBzZWVzIGEgcmVqZWN0ZWRcbi8vIHByb21pc2UgKGFkZFRvV2F0Y2hsaXN0IHNpZ25hbHMgZmFpbHVyZSB2aWEgeyBvazogZmFsc2UgfSBpbnN0ZWFkKS5cblxuaW1wb3J0IHsgYXBwLCBCcm93c2VyV2luZG93LCBpcGNNYWluLCBzaGVsbCB9IGZyb20gJ2VsZWN0cm9uJztcbmltcG9ydCBmcyBmcm9tICdub2RlOmZzJztcbmltcG9ydCBwYXRoIGZyb20gJ25vZGU6cGF0aCc7XG5pbXBvcnQgeyBJUEMgfSBmcm9tICcuLi9zaGFyZWQvaXBjJztcbmltcG9ydCB0eXBlIHtcbiAgQWRkV2F0Y2hsaXN0UmVzdWx0LFxuICBDaGFydFJhbmdlLFxuICBIb2xkaW5nc1Jlc3VsdCxcbiAgTGxtU2V0dGluZ3MsXG4gIE1hY3JvT3ZlcmxheUtleSxcbiAgUGl2b3RQb2ludCxcbiAgUXVhbnRJbnNpZ2h0UmVxdWVzdCxcbn0gZnJvbSAnLi4vc2hhcmVkL3R5cGVzJztcbmltcG9ydCB7IENIQVJUX1JBTkdFUyB9IGZyb20gJy4uL3NoYXJlZC90eXBlcyc7XG5pbXBvcnQgeyBnZXRDaGFydCB9IGZyb20gJy4vc2VydmljZXMvY2hhcnQnO1xuaW1wb3J0IHsgZ2V0RWFybmluZ3MgfSBmcm9tICcuL3NlcnZpY2VzL2Vhcm5pbmdzJztcbmltcG9ydCB7IGdldEhvbGRpbmdzIH0gZnJvbSAnLi9zZXJ2aWNlcy9ob2xkaW5ncyc7XG5pbXBvcnQgeyBnZXRMbG1TZXR0aW5ncywgc2F2ZUxsbVNldHRpbmdzIH0gZnJvbSAnLi9zZXJ2aWNlcy9sbG1TZXR0aW5ncyc7XG5pbXBvcnQgeyBnZXRNYWNyb092ZXJsYXkgfSBmcm9tICcuL3NlcnZpY2VzL21hY3JvJztcbmltcG9ydCB7IGdldFF1YW50SW5zaWdodHMsIHNhdmVRdWFudEluc2lnaHQgfSBmcm9tICcuL3NlcnZpY2VzL2luc2lnaHRTdG9yZSc7XG5pbXBvcnQgeyBnZXROZXdzIH0gZnJvbSAnLi9zZXJ2aWNlcy9uZXdzJztcbmltcG9ydCB7IGdldFBpdm90TmV3cyB9IGZyb20gJy4vc2VydmljZXMvcGl2b3ROZXdzJztcbmltcG9ydCB7IGFuYWx5emVRdWFudCB9IGZyb20gJy4vc2VydmljZXMvcXVhbnRBaSc7XG5pbXBvcnQgeyBnZXRRdW90ZXMgfSBmcm9tICcuL3NlcnZpY2VzL3F1b3Rlcyc7XG5pbXBvcnQgeyBnZXRWYWx1YXRpb24gfSBmcm9tICcuL3NlcnZpY2VzL3ZhbHVhdGlvbic7XG5pbXBvcnQgeyBzYW1wbGVDaGFydCwgc2FtcGxlRWFybmluZ3MsIHNhbXBsZU5ld3MsIHNhbXBsZVF1b3RlIH0gZnJvbSAnLi9zZXJ2aWNlcy9zYW1wbGUnO1xuaW1wb3J0IHsgc2VhcmNoU3ltYm9scyB9IGZyb20gJy4vc2VydmljZXMvc3ltYm9scyc7XG5pbXBvcnQgeyBjbGFtcEludCwgY2xlYW5TeW1ib2xMaXN0LCBub3JtYWxpemVTeW1ib2wsIHRvZGF5WW1kIH0gZnJvbSAnLi9zZXJ2aWNlcy91dGlsJztcbmltcG9ydCB7XG4gIGFkZFRvV2F0Y2hsaXN0LFxuICBnZXRXYXRjaGxpc3QsXG4gIHJlbW92ZUZyb21XYXRjaGxpc3QsXG59IGZyb20gJy4vc2VydmljZXMvd2F0Y2hsaXN0U3RvcmUnO1xuXG5jb25zdCBNQVhfUVVPVEVfU1lNQk9MUyA9IDYwO1xuY29uc3QgTUFYX05FV1NfU1lNQk9MUyA9IDQwO1xuY29uc3QgTUFYX0VBUk5JTkdTX1NZTUJPTFMgPSA2MDtcbmNvbnN0IE1BWF9QSVZPVFMgPSAxMjtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBDTEkgZmxhZ3MgKHNtb2tlIG1vZGUpXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuY29uc3QgaXNTbW9rZSA9IHByb2Nlc3MuYXJndi5pbmNsdWRlcygnLS1zbW9rZScpO1xuY29uc3QgZm9yY2VPbmJvYXJkaW5nID1cbiAgcHJvY2Vzcy5hcmd2LmluY2x1ZGVzKCctLW9uYm9hcmRpbmcnKSB8fCBwcm9jZXNzLmFyZ3YuaW5jbHVkZXMoJy0tc21va2Utb25ib2FyZGluZycpO1xuY29uc3Qgc21va2VNb2RhbEFyZyA9IHByb2Nlc3MuYXJndi5maW5kKChhcmcpID0+IGFyZy5zdGFydHNXaXRoKCctLXNtb2tlLW1vZGFsPScpKTtcbmNvbnN0IHNtb2tlTW9kYWxTeW1ib2wgPSBzbW9rZU1vZGFsQXJnXG4gID8gbm9ybWFsaXplU3ltYm9sKHNtb2tlTW9kYWxBcmcuc2xpY2UoJy0tc21va2UtbW9kYWw9Jy5sZW5ndGgpKVxuICA6IG51bGw7XG5jb25zdCBzbW9rZVJhaWxBcmcgPSBwcm9jZXNzLmFyZ3YuZmluZCgoYXJnKSA9PiBhcmcuc3RhcnRzV2l0aCgnLS1zbW9rZS1yYWlsPScpKTtcbmNvbnN0IHNtb2tlUmFpbCA9IHNtb2tlUmFpbEFyZz8uc2xpY2UoJy0tc21va2UtcmFpbD0nLmxlbmd0aCk7XG5jb25zdCBzbW9rZU92ZXJsYXlzQXJnID0gcHJvY2Vzcy5hcmd2LmZpbmQoKGFyZykgPT4gYXJnLnN0YXJ0c1dpdGgoJy0tc21va2Utb3ZlcmxheXM9JykpO1xuY29uc3Qgc21va2VPdmVybGF5cyA9IHNtb2tlT3ZlcmxheXNBcmc/LnNsaWNlKCctLXNtb2tlLW92ZXJsYXlzPScubGVuZ3RoKTtcbmNvbnN0IHNtb2tlVGFiQXJnID0gcHJvY2Vzcy5hcmd2LmZpbmQoKGFyZykgPT4gYXJnLnN0YXJ0c1dpdGgoJy0tc21va2UtdGFiPScpKTtcbmNvbnN0IHNtb2tlVGFiID0gc21va2VUYWJBcmc/LnNsaWNlKCctLXNtb2tlLXRhYj0nLmxlbmd0aCk7XG5jb25zdCBzbW9rZUNoYXJ0TW9kZUFyZyA9IHByb2Nlc3MuYXJndi5maW5kKChhcmcpID0+IGFyZy5zdGFydHNXaXRoKCctLXNtb2tlLWNoYXJ0LW1vZGU9JykpO1xuY29uc3Qgc21va2VDaGFydE1vZGUgPSBzbW9rZUNoYXJ0TW9kZUFyZz8uc2xpY2UoJy0tc21va2UtY2hhcnQtbW9kZT0nLmxlbmd0aCk7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW5wdXQgdmFsaWRhdGlvbiBoZWxwZXJzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuZnVuY3Rpb24gY2xlYW5QaXZvdHMocmF3OiB1bmtub3duKTogUGl2b3RQb2ludFtdIHtcbiAgaWYgKCFBcnJheS5pc0FycmF5KHJhdykpIHJldHVybiBbXTtcbiAgY29uc3Qgb3V0OiBQaXZvdFBvaW50W10gPSBbXTtcbiAgZm9yIChjb25zdCBlbnRyeSBvZiByYXcpIHtcbiAgICBpZiAoIWVudHJ5IHx8IHR5cGVvZiBlbnRyeSAhPT0gJ29iamVjdCcpIGNvbnRpbnVlO1xuICAgIGNvbnN0IHAgPSBlbnRyeSBhcyBQYXJ0aWFsPFBpdm90UG9pbnQ+O1xuICAgIGlmICh0eXBlb2YgcC50aW1lICE9PSAnbnVtYmVyJyB8fCAhTnVtYmVyLmlzRmluaXRlKHAudGltZSkpIGNvbnRpbnVlO1xuICAgIGlmICh0eXBlb2YgcC5wcmljZSAhPT0gJ251bWJlcicgfHwgIU51bWJlci5pc0Zpbml0ZShwLnByaWNlKSkgY29udGludWU7XG4gICAgaWYgKHAua2luZCAhPT0gJ2hpZ2gnICYmIHAua2luZCAhPT0gJ2xvdycpIGNvbnRpbnVlO1xuICAgIG91dC5wdXNoKHsgdGltZTogcC50aW1lLCBwcmljZTogcC5wcmljZSwga2luZDogcC5raW5kIH0pO1xuICAgIGlmIChvdXQubGVuZ3RoID49IE1BWF9QSVZPVFMpIGJyZWFrO1xuICB9XG4gIHJldHVybiBvdXQ7XG59XG5cbmZ1bmN0aW9uIGNsZWFuUmFuZ2UocmF3OiB1bmtub3duKTogQ2hhcnRSYW5nZSB7XG4gIHJldHVybiBDSEFSVF9SQU5HRVMuaW5jbHVkZXMocmF3IGFzIENoYXJ0UmFuZ2UpID8gKHJhdyBhcyBDaGFydFJhbmdlKSA6ICc2bSc7XG59XG5cbmZ1bmN0aW9uIGNsZWFuTWFjcm9PdmVybGF5S2V5KHJhdzogdW5rbm93bik6IE1hY3JvT3ZlcmxheUtleSB7XG4gIHJldHVybiByYXcgPT09ICdqb2JzJyB8fFxuICAgIHJhdyA9PT0gJ3VuZW1wbG95bWVudCcgfHxcbiAgICByYXcgPT09ICdpbmZsYXRpb24nIHx8XG4gICAgcmF3ID09PSAndHJlYXN1cnkxMHknIHx8XG4gICAgcmF3ID09PSAnb2lsJyB8fFxuICAgIHJhdyA9PT0gJ3ZpeCdcbiAgICA/IHJhd1xuICAgIDogJ2pvYnMnO1xufVxuXG5mdW5jdGlvbiBjbGVhblF1YW50SW5zaWdodFJlcXVlc3QocmF3OiB1bmtub3duKTogUXVhbnRJbnNpZ2h0UmVxdWVzdCB8IG51bGwge1xuICBpZiAoIXJhdyB8fCB0eXBlb2YgcmF3ICE9PSAnb2JqZWN0JykgcmV0dXJuIG51bGw7XG4gIGNvbnN0IHIgPSByYXcgYXMgUGFydGlhbDxRdWFudEluc2lnaHRSZXF1ZXN0PjtcbiAgY29uc3Qgc3ltYm9sID0gbm9ybWFsaXplU3ltYm9sKHIuc3ltYm9sKTtcbiAgaWYgKCFzeW1ib2wpIHJldHVybiBudWxsO1xuICBpZiAoIXIuZXZhbHVhdGlvbiB8fCB0eXBlb2Ygci5ldmFsdWF0aW9uICE9PSAnb2JqZWN0JykgcmV0dXJuIG51bGw7XG4gIHJldHVybiB7XG4gICAgc3ltYm9sLFxuICAgIHJhbmdlOiBjbGVhblJhbmdlKHIucmFuZ2UpLFxuICAgIGV2YWx1YXRpb246IHIuZXZhbHVhdGlvbiBhcyBRdWFudEluc2lnaHRSZXF1ZXN0WydldmFsdWF0aW9uJ10sXG4gICAgbmV3czogQXJyYXkuaXNBcnJheShyLm5ld3MpID8gci5uZXdzLnNsaWNlKDAsIDEyKSA6IFtdLFxuICAgIGVhcm5pbmdzOiByLmVhcm5pbmdzICYmIHR5cGVvZiByLmVhcm5pbmdzID09PSAnb2JqZWN0JyA/IHIuZWFybmluZ3MgOiBudWxsLFxuICAgIHZhbHVhdGlvbjogci52YWx1YXRpb24gJiYgdHlwZW9mIHIudmFsdWF0aW9uID09PSAnb2JqZWN0JyA/IHIudmFsdWF0aW9uIDogbnVsbCxcbiAgICBtYWNyb092ZXJsYXlzOiBBcnJheS5pc0FycmF5KHIubWFjcm9PdmVybGF5cylcbiAgICAgID8gci5tYWNyb092ZXJsYXlzLnNsaWNlKDAsIDgpLm1hcCgoc2VyaWVzKSA9PiAoe1xuICAgICAgICAgIC4uLnNlcmllcyxcbiAgICAgICAgICBwb2ludHM6IEFycmF5LmlzQXJyYXkoc2VyaWVzLnBvaW50cykgPyBzZXJpZXMucG9pbnRzLnNsaWNlKC02MCkgOiBbXSxcbiAgICAgICAgfSkpXG4gICAgICA6IFtdLFxuICAgIHNuYXBzaG90RGF0YVVybDogdHlwZW9mIHIuc25hcHNob3REYXRhVXJsID09PSAnc3RyaW5nJyA/IHIuc25hcHNob3REYXRhVXJsLnNsaWNlKDAsIDFfMDAwXzAwMCkgOiB1bmRlZmluZWQsXG4gICAgcXVlc3Rpb246IHR5cGVvZiByLnF1ZXN0aW9uID09PSAnc3RyaW5nJyA/IHIucXVlc3Rpb24uc2xpY2UoMCwgMTIwMCkgOiB1bmRlZmluZWQsXG4gICAgdGhpbmtpbmdNb2RlOiByLnRoaW5raW5nTW9kZSA9PT0gdHJ1ZSxcbiAgfTtcbn1cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJUEMgaGFuZGxlcnMgXHUyMDE0IG9uZSBwZXIgY2hhbm5lbCwgc2lnbmF0dXJlcyBtYXRjaGluZyBRdWFudEFwaVxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmZ1bmN0aW9uIHJlZ2lzdGVySXBjSGFuZGxlcnMoKTogdm9pZCB7XG4gIGlwY01haW4uaGFuZGxlKElQQy53YXRjaGxpc3RHZXQsICgpID0+IHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIGdldFdhdGNobGlzdCgpO1xuICAgIH0gY2F0Y2gge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cbiAgfSk7XG5cbiAgaXBjTWFpbi5oYW5kbGUoSVBDLndhdGNobGlzdEFkZCwgYXN5bmMgKF9lLCByYXdTeW1ib2w6IHVua25vd24pOiBQcm9taXNlPEFkZFdhdGNobGlzdFJlc3VsdD4gPT4ge1xuICAgIHRyeSB7XG4gICAgICBpZiAodHlwZW9mIHJhd1N5bWJvbCAhPT0gJ3N0cmluZycpIHJldHVybiB7IG9rOiBmYWxzZSwgZXJyb3I6ICdJbnZhbGlkIHN5bWJvbCcgfTtcbiAgICAgIHJldHVybiBhd2FpdCBhZGRUb1dhdGNobGlzdChyYXdTeW1ib2wpO1xuICAgIH0gY2F0Y2gge1xuICAgICAgcmV0dXJuIHsgb2s6IGZhbHNlLCBlcnJvcjogJ0NvdWxkIG5vdCBhZGQgc3ltYm9sJyB9O1xuICAgIH1cbiAgfSk7XG5cbiAgaXBjTWFpbi5oYW5kbGUoSVBDLndhdGNobGlzdFJlbW92ZSwgKF9lLCByYXdTeW1ib2w6IHVua25vd24pID0+IHtcbiAgICB0cnkge1xuICAgICAgY29uc3Qgc3ltYm9sID0gbm9ybWFsaXplU3ltYm9sKHJhd1N5bWJvbCk7XG4gICAgICByZXR1cm4gc3ltYm9sID8gcmVtb3ZlRnJvbVdhdGNobGlzdChzeW1ib2wpIDogZ2V0V2F0Y2hsaXN0KCk7XG4gICAgfSBjYXRjaCB7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuICB9KTtcblxuICBpcGNNYWluLmhhbmRsZShJUEMuc3ltYm9sc1NlYXJjaCwgYXN5bmMgKF9lLCByYXdRdWVyeTogdW5rbm93bikgPT4ge1xuICAgIHRyeSB7XG4gICAgICBpZiAodHlwZW9mIHJhd1F1ZXJ5ICE9PSAnc3RyaW5nJykgcmV0dXJuIFtdO1xuICAgICAgcmV0dXJuIGF3YWl0IHNlYXJjaFN5bWJvbHMocmF3UXVlcnkpO1xuICAgIH0gY2F0Y2gge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cbiAgfSk7XG5cbiAgaXBjTWFpbi5oYW5kbGUoSVBDLnF1b3Rlc0dldCwgYXN5bmMgKF9lLCByYXdTeW1ib2xzOiB1bmtub3duKSA9PiB7XG4gICAgY29uc3Qgc3ltYm9scyA9IGNsZWFuU3ltYm9sTGlzdChyYXdTeW1ib2xzLCBNQVhfUVVPVEVfU1lNQk9MUyk7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBhd2FpdCBnZXRRdW90ZXMoc3ltYm9scyk7XG4gICAgfSBjYXRjaCB7XG4gICAgICByZXR1cm4gc3ltYm9scy5tYXAoKHMpID0+IHNhbXBsZVF1b3RlKHMpKTtcbiAgICB9XG4gIH0pO1xuXG4gIGlwY01haW4uaGFuZGxlKElQQy5ob2xkaW5nc0dldCwgYXN5bmMgKF9lLCByYXdTeW1ib2w6IHVua25vd24pOiBQcm9taXNlPEhvbGRpbmdzUmVzdWx0PiA9PiB7XG4gICAgY29uc3Qgc3ltYm9sID0gbm9ybWFsaXplU3ltYm9sKHJhd1N5bWJvbCk7XG4gICAgaWYgKCFzeW1ib2wpIHtcbiAgICAgIHJldHVybiB7IGV0ZlN5bWJvbDogJycsIGFzT2Y6IHRvZGF5WW1kKCksIGhvbGRpbmdzOiBbXSwgc291cmNlOiAnc2FtcGxlJyB9O1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgcmV0dXJuIGF3YWl0IGdldEhvbGRpbmdzKHN5bWJvbCk7XG4gICAgfSBjYXRjaCB7XG4gICAgICByZXR1cm4geyBldGZTeW1ib2w6IHN5bWJvbCwgYXNPZjogdG9kYXlZbWQoKSwgaG9sZGluZ3M6IFtdLCBzb3VyY2U6ICdzYW1wbGUnIH07XG4gICAgfVxuICB9KTtcblxuICBpcGNNYWluLmhhbmRsZShJUEMubmV3c0dldCwgYXN5bmMgKF9lLCByYXdTeW1ib2xzOiB1bmtub3duLCByYXdMaW1pdDogdW5rbm93bikgPT4ge1xuICAgIGNvbnN0IHN5bWJvbHMgPSBjbGVhblN5bWJvbExpc3QocmF3U3ltYm9scywgTUFYX05FV1NfU1lNQk9MUyk7XG4gICAgY29uc3QgbGltaXRQZXJTeW1ib2wgPSBjbGFtcEludChyYXdMaW1pdCwgMSwgMjAsIDYpO1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gYXdhaXQgZ2V0TmV3cyhzeW1ib2xzLCBsaW1pdFBlclN5bWJvbCk7XG4gICAgfSBjYXRjaCB7XG4gICAgICByZXR1cm4gc2FtcGxlTmV3cyhzeW1ib2xzKTtcbiAgICB9XG4gIH0pO1xuXG4gIGlwY01haW4uaGFuZGxlKElQQy5lYXJuaW5nc0dldCwgYXN5bmMgKF9lLCByYXdTeW1ib2xzOiB1bmtub3duKSA9PiB7XG4gICAgY29uc3Qgc3ltYm9scyA9IGNsZWFuU3ltYm9sTGlzdChyYXdTeW1ib2xzLCBNQVhfRUFSTklOR1NfU1lNQk9MUyk7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBhd2FpdCBnZXRFYXJuaW5ncyhzeW1ib2xzKTtcbiAgICB9IGNhdGNoIHtcbiAgICAgIHJldHVybiBzeW1ib2xzLm1hcCgocykgPT4gc2FtcGxlRWFybmluZ3MocykpO1xuICAgIH1cbiAgfSk7XG5cbiAgaXBjTWFpbi5oYW5kbGUoSVBDLmNoYXJ0R2V0LCBhc3luYyAoX2UsIHJhd1N5bWJvbDogdW5rbm93biwgcmF3UmFuZ2U6IHVua25vd24pID0+IHtcbiAgICBjb25zdCBzeW1ib2wgPSBub3JtYWxpemVTeW1ib2wocmF3U3ltYm9sKSA/PyAnU1BZJztcbiAgICBjb25zdCByYW5nZSA9IGNsZWFuUmFuZ2UocmF3UmFuZ2UpO1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gYXdhaXQgZ2V0Q2hhcnQoc3ltYm9sLCByYW5nZSk7XG4gICAgfSBjYXRjaCB7XG4gICAgICByZXR1cm4gc2FtcGxlQ2hhcnQoc3ltYm9sLCByYW5nZSk7XG4gICAgfVxuICB9KTtcblxuICBpcGNNYWluLmhhbmRsZShJUEMucGl2b3ROZXdzR2V0LCBhc3luYyAoX2UsIHJhd1N5bWJvbDogdW5rbm93biwgcmF3UGl2b3RzOiB1bmtub3duKSA9PiB7XG4gICAgY29uc3QgcGl2b3RzID0gY2xlYW5QaXZvdHMocmF3UGl2b3RzKTtcbiAgICBjb25zdCBzeW1ib2wgPSBub3JtYWxpemVTeW1ib2wocmF3U3ltYm9sKTtcbiAgICBpZiAoIXN5bWJvbCkgcmV0dXJuIHBpdm90cy5tYXAoKHBpdm90KSA9PiAoeyBwaXZvdCwgaXRlbXM6IFtdIH0pKTtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIGF3YWl0IGdldFBpdm90TmV3cyhzeW1ib2wsIHBpdm90cyk7XG4gICAgfSBjYXRjaCB7XG4gICAgICByZXR1cm4gcGl2b3RzLm1hcCgocGl2b3QpID0+ICh7IHBpdm90LCBpdGVtczogW10gfSkpO1xuICAgIH1cbiAgfSk7XG5cbiAgaXBjTWFpbi5oYW5kbGUoSVBDLm1hY3JvT3ZlcmxheUdldCwgYXN5bmMgKF9lLCByYXdLZXk6IHVua25vd24sIHJhd1JhbmdlOiB1bmtub3duKSA9PiB7XG4gICAgY29uc3Qga2V5ID0gY2xlYW5NYWNyb092ZXJsYXlLZXkocmF3S2V5KTtcbiAgICBjb25zdCByYW5nZSA9IGNsZWFuUmFuZ2UocmF3UmFuZ2UpO1xuICAgIHJldHVybiBnZXRNYWNyb092ZXJsYXkoa2V5LCByYW5nZSk7XG4gIH0pO1xuXG4gIGlwY01haW4uaGFuZGxlKElQQy5jaGFydFNuYXBzaG90Q2FwdHVyZSwgYXN5bmMgKCkgPT4ge1xuICAgIGlmICghbWFpbldpbmRvdyB8fCBtYWluV2luZG93LmlzRGVzdHJveWVkKCkpIHJldHVybiBudWxsO1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBpbWFnZSA9IGF3YWl0IG1haW5XaW5kb3cud2ViQ29udGVudHMuY2FwdHVyZVBhZ2UoKTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGRhdGFVcmw6IGltYWdlLnRvRGF0YVVSTCgpLFxuICAgICAgICBjYXB0dXJlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG4gICAgICB9O1xuICAgIH0gY2F0Y2gge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9KTtcblxuICBpcGNNYWluLmhhbmRsZShJUEMucXVhbnRBbmFseXplLCBhc3luYyAoX2UsIHJhd1JlcXVlc3Q6IHVua25vd24pID0+IHtcbiAgICBjb25zdCByZXF1ZXN0ID0gY2xlYW5RdWFudEluc2lnaHRSZXF1ZXN0KHJhd1JlcXVlc3QpO1xuICAgIGlmICghcmVxdWVzdCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgb2s6IGZhbHNlLFxuICAgICAgICBzb3VyY2U6ICdkZXRlcm1pbmlzdGljLWZhbGxiYWNrJyxcbiAgICAgICAgYW5zd2VyOiAnUXVhbnQgYW5hbHlzaXMgY291bGQgbm90IHJ1biBiZWNhdXNlIHRoZSByZXF1ZXN0IHBheWxvYWQgd2FzIGludmFsaWQuJyxcbiAgICAgICAgZ2VuZXJhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcbiAgICAgICAgZXJyb3I6ICdJbnZhbGlkIHJlcXVlc3QnLFxuICAgICAgfTtcbiAgICB9XG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBhbmFseXplUXVhbnQocmVxdWVzdCk7XG4gICAgdHJ5IHtcbiAgICAgIHNhdmVRdWFudEluc2lnaHQocmVxdWVzdCwgcmVzcG9uc2UpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgY29uc29sZS5lcnJvcignW3F1YW50XSBzYXZlIGluc2lnaHQgZmFpbGVkOicsIGVycik7XG4gICAgfVxuICAgIHJldHVybiByZXNwb25zZTtcbiAgfSk7XG5cbiAgaXBjTWFpbi5oYW5kbGUoSVBDLnF1YW50SW5zaWdodHNHZXQsIGFzeW5jIChfZSwgcmF3U3ltYm9sOiB1bmtub3duLCByYXdSYW5nZTogdW5rbm93bikgPT4ge1xuICAgIGNvbnN0IHN5bWJvbCA9IG5vcm1hbGl6ZVN5bWJvbChyYXdTeW1ib2wpO1xuICAgIGlmICghc3ltYm9sKSByZXR1cm4gW107XG4gICAgcmV0dXJuIGdldFF1YW50SW5zaWdodHMoc3ltYm9sLCBDSEFSVF9SQU5HRVMuaW5jbHVkZXMocmF3UmFuZ2UgYXMgQ2hhcnRSYW5nZSkgPyAocmF3UmFuZ2UgYXMgQ2hhcnRSYW5nZSkgOiB1bmRlZmluZWQpO1xuICB9KTtcblxuICBpcGNNYWluLmhhbmRsZShJUEMubGxtU2V0dGluZ3NHZXQsICgpID0+IGdldExsbVNldHRpbmdzKCkpO1xuXG4gIGlwY01haW4uaGFuZGxlKElQQy5sbG1TZXR0aW5nc1NhdmUsIChfZSwgcmF3U2V0dGluZ3M6IHVua25vd24pID0+IHtcbiAgICBjb25zdCBzID1cbiAgICAgIHJhd1NldHRpbmdzICYmIHR5cGVvZiByYXdTZXR0aW5ncyA9PT0gJ29iamVjdCdcbiAgICAgICAgPyAocmF3U2V0dGluZ3MgYXMgUGFydGlhbDxMbG1TZXR0aW5ncz4pXG4gICAgICAgIDoge307XG4gICAgcmV0dXJuIHNhdmVMbG1TZXR0aW5ncyh7XG4gICAgICBlbmFibGVkOiBzLmVuYWJsZWQgPT09IHRydWUsXG4gICAgICBiYXNlVXJsOiB0eXBlb2Ygcy5iYXNlVXJsID09PSAnc3RyaW5nJyA/IHMuYmFzZVVybCA6IHVuZGVmaW5lZCxcbiAgICAgIG1vZGVsOiB0eXBlb2Ygcy5tb2RlbCA9PT0gJ3N0cmluZycgPyBzLm1vZGVsIDogdW5kZWZpbmVkLFxuICAgIH0pO1xuICB9KTtcblxuICBpcGNNYWluLmhhbmRsZShJUEMudmFsdWF0aW9uR2V0LCBhc3luYyAoX2UsIHJhd1N5bWJvbDogdW5rbm93bikgPT4ge1xuICAgIGNvbnN0IHN5bWJvbCA9IG5vcm1hbGl6ZVN5bWJvbChyYXdTeW1ib2wpO1xuICAgIHJldHVybiBnZXRWYWx1YXRpb24oc3ltYm9sID8/ICdTUFknKTtcbiAgfSk7XG5cbiAgaXBjTWFpbi5oYW5kbGUoSVBDLm9wZW5FeHRlcm5hbCwgYXN5bmMgKF9lLCByYXdVcmw6IHVua25vd24pID0+IHtcbiAgICBpZiAodHlwZW9mIHJhd1VybCAhPT0gJ3N0cmluZycpIHJldHVybjtcbiAgICBsZXQgcGFyc2VkOiBVUkw7XG4gICAgdHJ5IHtcbiAgICAgIHBhcnNlZCA9IG5ldyBVUkwocmF3VXJsKTtcbiAgICB9IGNhdGNoIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHBhcnNlZC5wcm90b2NvbCAhPT0gJ2h0dHA6JyAmJiBwYXJzZWQucHJvdG9jb2wgIT09ICdodHRwczonKSByZXR1cm47XG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IHNoZWxsLm9wZW5FeHRlcm5hbChwYXJzZWQudG9TdHJpbmcoKSk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdbc2hlbGxdIG9wZW5FeHRlcm5hbCBmYWlsZWQ6JywgZXJyKTtcbiAgICB9XG4gIH0pO1xufVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFNtb2tlIG1vZGU6IHNjcmVlbnNob3QgYWZ0ZXIgbG9hZCwgdGhlbiBxdWl0LiBIYXJkIHRpbWVvdXQgYXQgNDVzLlxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmZ1bmN0aW9uIGFybVNtb2tlTW9kZSh3aW46IEJyb3dzZXJXaW5kb3cpOiB2b2lkIHtcbiAgLy8gU21va2UgcnVucyBleGVjdXRlIG9uIGEgbGl2ZSBkZXNrdG9wOiBzaGllbGQgdGhlIHdpbmRvdyBmcm9tIHN0cmF5IHVzZXJcbiAgLy8gY2xpY2tzL2tleXN0cm9rZXMgc28gYWNjaWRlbnRhbCBpbnB1dCBjYW4ndCBtdXRhdGUgVUkgc3RhdGUgKGUuZy4gb3BlbmluZ1xuICAvLyBvciBjbG9zaW5nIHRoZSBjaGFydCBtb2RhbCkgYmVmb3JlIHRoZSBzY3JlZW5zaG90IGlzIGNhcHR1cmVkLlxuICB3aW4uc2V0SWdub3JlTW91c2VFdmVudHModHJ1ZSk7XG4gIHdpbi5zZXRGb2N1c2FibGUoZmFsc2UpO1xuXG4gIHdpbi53ZWJDb250ZW50cy5vbignY29uc29sZS1tZXNzYWdlJywgKF9ldmVudCwgX2xldmVsLCBtZXNzYWdlKSA9PiB7XG4gICAgY29uc29sZS5sb2coJ1tyZW5kZXJlcl0gJyArIG1lc3NhZ2UpO1xuICB9KTtcbiAgLy8gU3VyZmFjZSByZW5kZXJlciBjcmFzaGVzL3JlbG9hZHMgaW4gc21va2UgbG9ncyBcdTIwMTQgYSBtaWQtcnVuIHJlbG9hZCByZXNldHNcbiAgLy8gcmVuZGVyZXIgc3RhdGUgYW5kIGNhbiBpbnZhbGlkYXRlIHRoZSBzY3JlZW5zaG90LlxuICB3aW4ud2ViQ29udGVudHMub24oJ3JlbmRlci1wcm9jZXNzLWdvbmUnLCAoX2V2ZW50LCBkZXRhaWxzKSA9PiB7XG4gICAgY29uc29sZS5lcnJvcignW3JlbmRlcmVyXSBwcm9jZXNzIGdvbmU6ICcgKyBkZXRhaWxzLnJlYXNvbik7XG4gIH0pO1xuICB3aW4ud2ViQ29udGVudHMub24oJ2RpZC1zdGFydC1uYXZpZ2F0aW9uJywgKF9ldmVudCwgdXJsLCBpc0luUGxhY2UsIGlzTWFpbkZyYW1lKSA9PiB7XG4gICAgaWYgKGlzTWFpbkZyYW1lICYmICFpc0luUGxhY2UpIGNvbnNvbGUubG9nKCdbc21va2VdIG1haW4tZnJhbWUgbmF2aWdhdGlvbjogJyArIHVybCk7XG4gIH0pO1xuXG4gIGNvbnN0IGtpbGxlciA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgIGNvbnNvbGUuZXJyb3IoJ1NNT0tFX0ZBSUwgaGFyZCB0aW1lb3V0IGFmdGVyIDQ1cycpO1xuICAgIGFwcC5leGl0KDEpO1xuICB9LCA0NV8wMDApO1xuICBraWxsZXIudW5yZWYoKTtcblxuICB3aW4ud2ViQ29udGVudHMub25jZSgnZGlkLWZpbmlzaC1sb2FkJywgKCkgPT4ge1xuICAgIGNvbnN0IGVudkRlbGF5ID0gTnVtYmVyKHByb2Nlc3MuZW52LlFVQU5UX1NNT0tFX0RFTEFZX01TKTtcbiAgICBjb25zdCBkZWxheU1zID1cbiAgICAgIE51bWJlci5pc0Zpbml0ZShlbnZEZWxheSkgJiYgZW52RGVsYXkgPiAwXG4gICAgICAgID8gTWF0aC5taW4oZW52RGVsYXksIDQwXzAwMClcbiAgICAgICAgOiBzbW9rZU1vZGFsU3ltYm9sXG4gICAgICAgICAgPyAxNl8wMDBcbiAgICAgICAgICA6IDEzXzAwMDtcbiAgICBzZXRUaW1lb3V0KGFzeW5jICgpID0+IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGltYWdlID0gYXdhaXQgd2luLndlYkNvbnRlbnRzLmNhcHR1cmVQYWdlKCk7XG4gICAgICAgIGNvbnN0IG91dFBhdGggPVxuICAgICAgICAgIHByb2Nlc3MuZW52LlFVQU5UX1NNT0tFX09VVCB8fFxuICAgICAgICAgIHBhdGguam9pbihcbiAgICAgICAgICAgIGFwcC5nZXRBcHBQYXRoKCksXG4gICAgICAgICAgICBzbW9rZU1vZGFsU3ltYm9sID8gJ2Rpc3Qvc21va2UtbW9kYWwucG5nJyA6ICdkaXN0L3Ntb2tlLnBuZycsXG4gICAgICAgICAgKTtcbiAgICAgICAgZnMubWtkaXJTeW5jKHBhdGguZGlybmFtZShvdXRQYXRoKSwgeyByZWN1cnNpdmU6IHRydWUgfSk7XG4gICAgICAgIGZzLndyaXRlRmlsZVN5bmMob3V0UGF0aCwgaW1hZ2UudG9QTkcoKSk7XG4gICAgICAgIGNsZWFyVGltZW91dChraWxsZXIpO1xuICAgICAgICBjb25zb2xlLmxvZygnU01PS0VfT0sgJyArIG91dFBhdGgpO1xuICAgICAgICBhcHAucXVpdCgpO1xuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ1NNT0tFX0ZBSUwnLCBlcnIpO1xuICAgICAgICBwcm9jZXNzLmV4aXRDb2RlID0gMTtcbiAgICAgICAgYXBwLnF1aXQoKTtcbiAgICAgIH1cbiAgICB9LCBkZWxheU1zKTtcbiAgfSk7XG59XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gV2luZG93ICsgYXBwIGxpZmVjeWNsZVxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmxldCBtYWluV2luZG93OiBCcm93c2VyV2luZG93IHwgbnVsbCA9IG51bGw7XG5cbmZ1bmN0aW9uIGNyZWF0ZVdpbmRvdygpOiB2b2lkIHtcbiAgY29uc3Qgd2luID0gbmV3IEJyb3dzZXJXaW5kb3coe1xuICAgIHdpZHRoOiAxNTYwLFxuICAgIGhlaWdodDogOTQwLFxuICAgIG1pbldpZHRoOiAxMjAwLFxuICAgIG1pbkhlaWdodDogNzYwLFxuICAgIGJhY2tncm91bmRDb2xvcjogJyMwYTBlMTYnLFxuICAgIGF1dG9IaWRlTWVudUJhcjogdHJ1ZSxcbiAgICB0aXRsZTogJ1F1YW50JyxcbiAgICB3ZWJQcmVmZXJlbmNlczoge1xuICAgICAgcHJlbG9hZDogcGF0aC5qb2luKF9fZGlybmFtZSwgJ3ByZWxvYWQuanMnKSxcbiAgICAgIGNvbnRleHRJc29sYXRpb246IHRydWUsXG4gICAgICBub2RlSW50ZWdyYXRpb246IGZhbHNlLFxuICAgICAgc2FuZGJveDogdHJ1ZSxcbiAgICB9LFxuICB9KTtcbiAgbWFpbldpbmRvdyA9IHdpbjtcbiAgd2luLm9uKCdjbG9zZWQnLCAoKSA9PiB7XG4gICAgaWYgKG1haW5XaW5kb3cgPT09IHdpbikgbWFpbldpbmRvdyA9IG51bGw7XG4gIH0pO1xuXG4gIC8vIFNlY3VyaXR5OiBuZXZlciBvcGVuIGNoaWxkIHdpbmRvd3MsIG5ldmVyIG5hdmlnYXRlIGF3YXkuXG4gIHdpbi53ZWJDb250ZW50cy5zZXRXaW5kb3dPcGVuSGFuZGxlcigoKSA9PiAoeyBhY3Rpb246ICdkZW55JyB9KSk7XG4gIHdpbi53ZWJDb250ZW50cy5vbignd2lsbC1uYXZpZ2F0ZScsIChldmVudCkgPT4gZXZlbnQucHJldmVudERlZmF1bHQoKSk7XG5cbiAgaWYgKGlzU21va2UpIGFybVNtb2tlTW9kZSh3aW4pO1xuXG4gIGNvbnN0IGluZGV4UGF0aCA9IHBhdGguam9pbihfX2Rpcm5hbWUsICcuLi9yZW5kZXJlci9pbmRleC5odG1sJyk7XG4gIGNvbnN0IHF1ZXJ5OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge307XG4gIGlmIChzbW9rZU1vZGFsU3ltYm9sKSBxdWVyeS5zbW9rZU1vZGFsID0gc21va2VNb2RhbFN5bWJvbDtcbiAgaWYgKHNtb2tlUmFpbCkgcXVlcnkuc21va2VSYWlsID0gc21va2VSYWlsO1xuICBpZiAoc21va2VPdmVybGF5cykgcXVlcnkuc21va2VPdmVybGF5cyA9IHNtb2tlT3ZlcmxheXM7XG4gIGlmIChzbW9rZVRhYiA9PT0gJ2FuYWx5c2lzJyB8fCBzbW9rZVRhYiA9PT0gJ25ld3MnKSBxdWVyeS5zbW9rZVRhYiA9IHNtb2tlVGFiO1xuICBpZiAoc21va2VDaGFydE1vZGUgPT09ICdncmlkJyB8fCBzbW9rZUNoYXJ0TW9kZSA9PT0gJ3NpbmdsZScpIHtcbiAgICBxdWVyeS5zbW9rZUNoYXJ0TW9kZSA9IHNtb2tlQ2hhcnRNb2RlO1xuICB9XG4gIGlmIChmb3JjZU9uYm9hcmRpbmcpIHF1ZXJ5Lm9uYm9hcmRpbmcgPSAnMSc7XG4gIGlmIChPYmplY3Qua2V5cyhxdWVyeSkubGVuZ3RoKSB7XG4gICAgdm9pZCB3aW4ubG9hZEZpbGUoaW5kZXhQYXRoLCB7IHF1ZXJ5IH0pO1xuICB9IGVsc2Uge1xuICAgIHZvaWQgd2luLmxvYWRGaWxlKGluZGV4UGF0aCk7XG4gIH1cbn1cblxuY29uc3QgZ290TG9jayA9IGFwcC5yZXF1ZXN0U2luZ2xlSW5zdGFuY2VMb2NrKCk7XG5pZiAoIWdvdExvY2spIHtcbiAgYXBwLnF1aXQoKTtcbn0gZWxzZSB7XG4gIGFwcC5vbignc2Vjb25kLWluc3RhbmNlJywgKCkgPT4ge1xuICAgIGlmIChtYWluV2luZG93KSB7XG4gICAgICBpZiAobWFpbldpbmRvdy5pc01pbmltaXplZCgpKSBtYWluV2luZG93LnJlc3RvcmUoKTtcbiAgICAgIG1haW5XaW5kb3cuZm9jdXMoKTtcbiAgICB9XG4gIH0pO1xuXG4gIHByb2Nlc3Mub24oJ3VuaGFuZGxlZFJlamVjdGlvbicsIChyZWFzb24pID0+IHtcbiAgICBjb25zb2xlLmVycm9yKCdbbWFpbl0gdW5oYW5kbGVkIHJlamVjdGlvbjonLCByZWFzb24pO1xuICB9KTtcblxuICBhcHAud2hlblJlYWR5KCkudGhlbigoKSA9PiB7XG4gICAgcmVnaXN0ZXJJcGNIYW5kbGVycygpO1xuICAgIGNyZWF0ZVdpbmRvdygpO1xuXG4gICAgYXBwLm9uKCdhY3RpdmF0ZScsICgpID0+IHtcbiAgICAgIGlmIChCcm93c2VyV2luZG93LmdldEFsbFdpbmRvd3MoKS5sZW5ndGggPT09IDApIGNyZWF0ZVdpbmRvdygpO1xuICAgIH0pO1xuICB9KTtcblxuICBhcHAub24oJ3dpbmRvdy1hbGwtY2xvc2VkJywgKCkgPT4ge1xuICAgIGFwcC5xdWl0KCk7XG4gIH0pO1xufVxuIiwgIi8vIElQQyBjaGFubmVsIG5hbWVzIHNoYXJlZCBieSBtYWluIChpcGNNYWluLmhhbmRsZSkgYW5kIHByZWxvYWQgKGlwY1JlbmRlcmVyLmludm9rZSkuXG4vLyBPbmUgY2hhbm5lbCBwZXIgUXVhbnRBcGkgbWV0aG9kIFx1MjAxNCBzZWUgc3JjL3NoYXJlZC90eXBlcy50cyBmb3Igc2lnbmF0dXJlcy5cblxuZXhwb3J0IGNvbnN0IElQQyA9IHtcbiAgd2F0Y2hsaXN0R2V0OiAnd2F0Y2hsaXN0OmdldCcsXG4gIHdhdGNobGlzdEFkZDogJ3dhdGNobGlzdDphZGQnLFxuICB3YXRjaGxpc3RSZW1vdmU6ICd3YXRjaGxpc3Q6cmVtb3ZlJyxcbiAgc3ltYm9sc1NlYXJjaDogJ3N5bWJvbHM6c2VhcmNoJyxcbiAgcXVvdGVzR2V0OiAncXVvdGVzOmdldCcsXG4gIGhvbGRpbmdzR2V0OiAnaG9sZGluZ3M6Z2V0JyxcbiAgbmV3c0dldDogJ25ld3M6Z2V0JyxcbiAgZWFybmluZ3NHZXQ6ICdlYXJuaW5nczpnZXQnLFxuICBjaGFydEdldDogJ2NoYXJ0OmdldCcsXG4gIHBpdm90TmV3c0dldDogJ2NoYXJ0OnBpdm90LW5ld3MnLFxuICBtYWNyb092ZXJsYXlHZXQ6ICdjaGFydDptYWNyby1vdmVybGF5JyxcbiAgY2hhcnRTbmFwc2hvdENhcHR1cmU6ICdjaGFydDpjYXB0dXJlLXNuYXBzaG90JyxcbiAgcXVhbnRBbmFseXplOiAncXVhbnQ6YW5hbHl6ZScsXG4gIHF1YW50SW5zaWdodHNHZXQ6ICdxdWFudDppbnNpZ2h0cy1nZXQnLFxuICBsbG1TZXR0aW5nc0dldDogJ2xsbS1zZXR0aW5nczpnZXQnLFxuICBsbG1TZXR0aW5nc1NhdmU6ICdsbG0tc2V0dGluZ3M6c2F2ZScsXG4gIHZhbHVhdGlvbkdldDogJ3ZhbHVhdGlvbjpnZXQnLFxuICBvcGVuRXh0ZXJuYWw6ICdzaGVsbDpvcGVuLWV4dGVybmFsJyxcbn0gYXMgY29uc3Q7XG5cbmV4cG9ydCB0eXBlIElwY0NoYW5uZWwgPSAodHlwZW9mIElQQylba2V5b2YgdHlwZW9mIElQQ107XG4iLCAiLy8gU2hhcmVkIGNvbnRyYWN0IGJldHdlZW4gdGhlIEVsZWN0cm9uIG1haW4gcHJvY2VzcyBhbmQgdGhlIHJlbmRlcmVyLlxuLy8gVGhpcyBmaWxlIGlzIHRoZSBzaW5nbGUgc291cmNlIG9mIHRydXRoIGZvciBkYXRhIHNoYXBlcyBhbmQgdGhlXG4vLyB3aW5kb3cucXVhbnQgYnJpZGdlIEFQSS4gQnJlYWtpbmcgY2hhbmdlcyBoZXJlIHJlcXVpcmUgY29vcmRpbmF0ZWRcbi8vIHVwZGF0ZXMgdG8gc3JjL21haW4vcHJlbG9hZC50cywgdGhlIElQQyBoYW5kbGVycyBpbiBzcmMvbWFpbiwgYW5kXG4vLyBldmVyeSByZW5kZXJlciBjYWxsZXIuXG5cbmV4cG9ydCB0eXBlIEluc3RydW1lbnRUeXBlID0gJ2V0ZicgfCAnc3RvY2snO1xuXG4vKiogV2hlcmUgYSBwYXlsb2FkIGNhbWUgZnJvbS4gJ3NhbXBsZScgbWVhbnMgYnVuZGxlZC9vZmZsaW5lIGZhbGxiYWNrIGRhdGEgXHUyMDE0XG4gKiAgdGhlIFVJIG11c3Qgc3VyZmFjZSB0aGlzIHNvIHRoZSB1c2VyIGlzIG5ldmVyIG1pc2xlZCBieSBzdGFsZSBudW1iZXJzLiAqL1xuZXhwb3J0IHR5cGUgRGF0YVNvdXJjZSA9ICdsaXZlJyB8ICdzYW1wbGUnO1xuXG5leHBvcnQgaW50ZXJmYWNlIFdhdGNobGlzdEl0ZW0ge1xuICBzeW1ib2w6IHN0cmluZztcbiAgbmFtZTogc3RyaW5nO1xuICB0eXBlOiBJbnN0cnVtZW50VHlwZTtcbiAgYWRkZWRBdDogc3RyaW5nOyAvLyBJU08gdGltZXN0YW1wXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgU3ltYm9sU3VnZ2VzdGlvbiB7XG4gIHN5bWJvbDogc3RyaW5nO1xuICBuYW1lOiBzdHJpbmc7XG4gIHR5cGU6IEluc3RydW1lbnRUeXBlO1xuICBleGNoYW5nZT86IHN0cmluZztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBRdW90ZSB7XG4gIHN5bWJvbDogc3RyaW5nO1xuICBwcmljZTogbnVtYmVyIHwgbnVsbDtcbiAgY2hhbmdlOiBudW1iZXIgfCBudWxsOyAgICAgICAgIC8vIGFic29sdXRlIGNoYW5nZSB2cyBwcmV2aW91cyBjbG9zZVxuICBjaGFuZ2VQZXJjZW50OiBudW1iZXIgfCBudWxsOyAgLy8gLTEuMjMgbWVhbnMgLTEuMjMlXG4gIHByZXZpb3VzQ2xvc2U6IG51bWJlciB8IG51bGw7XG4gIGN1cnJlbmN5OiBzdHJpbmc7XG4gIG1hcmtldFN0YXRlPzogc3RyaW5nO1xuICB1cGRhdGVkQXQ6IHN0cmluZzsgLy8gSVNPXG4gIHNvdXJjZTogRGF0YVNvdXJjZTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBIb2xkaW5nIHtcbiAgc3ltYm9sOiBzdHJpbmc7XG4gIG5hbWU6IHN0cmluZztcbiAgd2VpZ2h0UGVyY2VudDogbnVtYmVyIHwgbnVsbDsgLy8gMC4uMTAwXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSG9sZGluZ3NSZXN1bHQge1xuICBldGZTeW1ib2w6IHN0cmluZztcbiAgYXNPZjogc3RyaW5nOyAgICAgICAgLy8gZGF0ZSB0aGUgaG9sZGluZ3Mgc25hcHNob3QgcmVwcmVzZW50cyAoWVlZWS1NTS1ERCBvciBZWVlZLU1NKVxuICBob2xkaW5nczogSG9sZGluZ1tdOyAvLyB1cCB0byB0b3AgMjAsIHNvcnRlZCBieSB3ZWlnaHQgZGVzY1xuICBzb3VyY2U6IERhdGFTb3VyY2U7ICAvLyAnbGl2ZScgaWYgZmV0Y2hlZCwgJ3NhbXBsZScgaWYgZnJvbSB0aGUgYnVuZGxlZCBkYXRhc2V0XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgTmV3c0l0ZW0ge1xuICBpZDogc3RyaW5nOyAgICAgICAgICAgIC8vIHN0YWJsZSBpZCBmb3IgZGVkdXBlICsgUmVhY3Qga2V5c1xuICB0aXRsZTogc3RyaW5nO1xuICB1cmw6IHN0cmluZztcbiAgc291cmNlTmFtZTogc3RyaW5nOyAgICAvLyBwdWJsaXNoZXIsIGUuZy4gXCJSZXV0ZXJzXCJcbiAgcHVibGlzaGVkQXQ6IHN0cmluZzsgICAvLyBJU09cbiAgcmVsYXRlZFN5bWJvbDogc3RyaW5nOyAvLyB0aWNrZXIgdGhpcyBhcnRpY2xlIHdhcyBmZXRjaGVkIGZvclxuICBzdW1tYXJ5Pzogc3RyaW5nO1xufVxuXG5leHBvcnQgdHlwZSBFYXJuaW5nc1RpbWUgPSAnYm1vJyB8ICdhbWMnIHwgJ3Vua25vd24nOyAvLyBiZWZvcmUgbWFya2V0IG9wZW4gLyBhZnRlciBtYXJrZXQgY2xvc2VcblxuZXhwb3J0IGludGVyZmFjZSBFYXJuaW5nc0V2ZW50IHtcbiAgc3ltYm9sOiBzdHJpbmc7XG4gIGNvbXBhbnlOYW1lOiBzdHJpbmc7XG4gIGRhdGU6IHN0cmluZzsgICAgICAgICAgLy8gSVNPIGRhdGUsIFlZWVktTU0tRERcbiAgdGltZTogRWFybmluZ3NUaW1lO1xuICBlcHNFc3RpbWF0ZTogbnVtYmVyIHwgbnVsbDtcbiAgZXBzQWN0dWFsPzogbnVtYmVyIHwgbnVsbDtcbiAgZXBzU3VycHJpc2VQZXJjZW50PzogbnVtYmVyIHwgbnVsbDtcbiAgbGF0ZXN0UmVwb3J0ZWREYXRlPzogc3RyaW5nIHwgbnVsbDtcbiAgc291cmNlOiBEYXRhU291cmNlO1xufVxuXG5leHBvcnQgdHlwZSBDaGFydFJhbmdlID0gJzFkJyB8ICcxdycgfCAnMW0nIHwgJzZtJyB8ICcxeScgfCAnNXknIHwgJ21heCc7XG5leHBvcnQgY29uc3QgQ0hBUlRfUkFOR0VTOiBDaGFydFJhbmdlW10gPSBbJzFkJywgJzF3JywgJzFtJywgJzZtJywgJzF5JywgJzV5JywgJ21heCddO1xuXG5leHBvcnQgaW50ZXJmYWNlIENhbmRsZSB7XG4gIHRpbWU6IG51bWJlcjsgLy8gdW5peCBzZWNvbmRzLCBVVENcbiAgb3BlbjogbnVtYmVyO1xuICBoaWdoOiBudW1iZXI7XG4gIGxvdzogbnVtYmVyO1xuICBjbG9zZTogbnVtYmVyO1xuICB2b2x1bWU6IG51bWJlcjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBDaGFydERhdGEge1xuICBzeW1ib2w6IHN0cmluZztcbiAgcmFuZ2U6IENoYXJ0UmFuZ2U7XG4gIGludGVydmFsOiBzdHJpbmc7IC8vIGUuZy4gXCI1bVwiLCBcIjFkXCIsIFwiMXdrXCJcbiAgY2FuZGxlczogQ2FuZGxlW107IC8vIGFzY2VuZGluZyBieSB0aW1lLCBubyBudWxsIGNsb3Nlc1xuICBjdXJyZW5jeTogc3RyaW5nO1xuICBleGNoYW5nZU5hbWU/OiBzdHJpbmc7XG4gIHJlZ3VsYXJNYXJrZXRQcmljZT86IG51bWJlciB8IG51bGw7XG4gIHByZXZpb3VzQ2xvc2U/OiBudW1iZXIgfCBudWxsO1xuICBzb3VyY2U6IERhdGFTb3VyY2U7XG59XG5cbi8qKiBBIHNpZ25pZmljYW50IGxvY2FsIGhpZ2ggb3IgbG93IGRldGVjdGVkIGluIHRoZSBjYW5kbGUgc2VyaWVzLiAqL1xuZXhwb3J0IGludGVyZmFjZSBQaXZvdFBvaW50IHtcbiAgdGltZTogbnVtYmVyOyAgLy8gdW5peCBzZWNvbmRzIFx1MjAxNCB0aW1lIG9mIHRoZSBwaXZvdCBjYW5kbGVcbiAgcHJpY2U6IG51bWJlcjsgLy8gdGhlIGNhbmRsZSdzIGhpZ2ggZm9yICdoaWdoJyBwaXZvdHMsIGxvdyBmb3IgJ2xvdydcbiAga2luZDogJ2hpZ2gnIHwgJ2xvdyc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUGl2b3ROZXdzUmVzdWx0IHtcbiAgcGl2b3Q6IFBpdm90UG9pbnQ7XG4gIGl0ZW1zOiBOZXdzSXRlbVtdOyAvLyBuZXdzIHB1Ymxpc2hlZCBuZWFyIHRoZSBwaXZvdCBkYXRlOyBtYXkgYmUgZW1wdHlcbn1cblxuZXhwb3J0IHR5cGUgTWFjcm9PdmVybGF5S2V5ID1cbiAgfCAnam9icydcbiAgfCAndW5lbXBsb3ltZW50J1xuICB8ICdpbmZsYXRpb24nXG4gIHwgJ3RyZWFzdXJ5MTB5J1xuICB8ICdvaWwnXG4gIHwgJ3ZpeCc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgTWFjcm9PdmVybGF5UG9pbnQge1xuICB0aW1lOiBudW1iZXI7IC8vIHVuaXggc2Vjb25kc1xuICB2YWx1ZTogbnVtYmVyO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIE1hY3JvT3ZlcmxheVNlcmllcyB7XG4gIGtleTogTWFjcm9PdmVybGF5S2V5O1xuICBsYWJlbDogc3RyaW5nO1xuICB1bml0OiBzdHJpbmc7XG4gIHNvdXJjZU5hbWU6IHN0cmluZztcbiAgcG9pbnRzOiBNYWNyb092ZXJsYXlQb2ludFtdO1xuICBzb3VyY2U6IERhdGFTb3VyY2U7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUXVhbnRJbnNpZ2h0UmVxdWVzdCB7XG4gIHN5bWJvbDogc3RyaW5nO1xuICByYW5nZTogQ2hhcnRSYW5nZTtcbiAgZXZhbHVhdGlvbjogaW1wb3J0KCcuL3F1YW50JykuU2lnbmFsRXZhbHVhdGlvbjtcbiAgbmV3czogTmV3c0l0ZW1bXTtcbiAgZWFybmluZ3M/OiBFYXJuaW5nc0V2ZW50IHwgbnVsbDtcbiAgdmFsdWF0aW9uPzogVmFsdWF0aW9uU25hcHNob3QgfCBudWxsO1xuICBtYWNyb092ZXJsYXlzPzogTWFjcm9PdmVybGF5U2VyaWVzW107XG4gIHNuYXBzaG90RGF0YVVybD86IHN0cmluZztcbiAgcXVlc3Rpb24/OiBzdHJpbmc7XG4gIHRoaW5raW5nTW9kZT86IGJvb2xlYW47XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUXVhbnRJbnNpZ2h0UmVzcG9uc2Uge1xuICBvazogYm9vbGVhbjtcbiAgc291cmNlOiAnbG9jYWwtbGxtJyB8ICdkZXRlcm1pbmlzdGljLWZhbGxiYWNrJztcbiAgbW9kZWw/OiBzdHJpbmc7XG4gIGFuc3dlcjogc3RyaW5nO1xuICBnZW5lcmF0ZWRBdDogc3RyaW5nO1xuICBlcnJvcj86IHN0cmluZztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBRdWFudEluc2lnaHRSZWNvcmQgZXh0ZW5kcyBRdWFudEluc2lnaHRSZXNwb25zZSB7XG4gIGlkOiBzdHJpbmc7XG4gIHN5bWJvbDogc3RyaW5nO1xuICByYW5nZTogQ2hhcnRSYW5nZTtcbiAgcXVlc3Rpb24/OiBzdHJpbmc7XG4gIGRlY2lzaW9uPzogaW1wb3J0KCcuL3F1YW50JykuVHJhZGVEZWNpc2lvbjtcbiAgc2V0dXBUeXBlPzogaW1wb3J0KCcuL3F1YW50JykuU2V0dXBUeXBlO1xuICBjb25maWRlbmNlPzogbnVtYmVyO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIExsbVNldHRpbmdzIHtcbiAgZW5hYmxlZDogYm9vbGVhbjtcbiAgYmFzZVVybDogc3RyaW5nO1xuICBtb2RlbDogc3RyaW5nO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFZhbHVhdGlvblNuYXBzaG90IHtcbiAgc3ltYm9sOiBzdHJpbmc7XG4gIGNvbXBhbnlOYW1lOiBzdHJpbmc7XG4gIHByaWNlOiBudW1iZXIgfCBudWxsO1xuICBtYXJrZXRDYXA6IG51bWJlciB8IG51bGw7XG4gIGVudGVycHJpc2VWYWx1ZTogbnVtYmVyIHwgbnVsbDtcbiAgdG90YWxSZXZlbnVlOiBudW1iZXIgfCBudWxsO1xuICBncm9zc1Byb2ZpdDogbnVtYmVyIHwgbnVsbDtcbiAgZWJpdGRhOiBudW1iZXIgfCBudWxsO1xuICBuZXRJbmNvbWVUb0NvbW1vbjogbnVtYmVyIHwgbnVsbDtcbiAgcHJvZml0TWFyZ2luOiBudW1iZXIgfCBudWxsO1xuICByZXZlbnVlR3Jvd3RoOiBudW1iZXIgfCBudWxsO1xuICB0cmFpbGluZ1BlOiBudW1iZXIgfCBudWxsO1xuICBmb3J3YXJkUGU6IG51bWJlciB8IG51bGw7XG4gIHByaWNlVG9TYWxlczogbnVtYmVyIHwgbnVsbDtcbiAgcHJpY2VUb0Jvb2s6IG51bWJlciB8IG51bGw7XG4gIGVudGVycHJpc2VUb1JldmVudWU6IG51bWJlciB8IG51bGw7XG4gIGVudGVycHJpc2VUb0ViaXRkYTogbnVtYmVyIHwgbnVsbDtcbiAgZm9yd2FyZEVwczogbnVtYmVyIHwgbnVsbDtcbiAgdGFyZ2V0TWVhblByaWNlOiBudW1iZXIgfCBudWxsO1xuICBzaGFyZXNPdXRzdGFuZGluZzogbnVtYmVyIHwgbnVsbDtcbiAgZXN0aW1hdGVzOiBBcnJheTx7XG4gICAgbGFiZWw6IHN0cmluZztcbiAgICBmYWlyVmFsdWU6IG51bWJlciB8IG51bGw7XG4gICAgdXBzaWRlUGVyY2VudDogbnVtYmVyIHwgbnVsbDtcbiAgICBmb3JtdWxhOiBzdHJpbmc7XG4gIH0+O1xuICBzb3VyY2U6IERhdGFTb3VyY2U7XG59XG5cbmV4cG9ydCB0eXBlIEFkZFdhdGNobGlzdFJlc3VsdCA9XG4gIHwgeyBvazogdHJ1ZTsgaXRlbTogV2F0Y2hsaXN0SXRlbTsgd2F0Y2hsaXN0OiBXYXRjaGxpc3RJdGVtW10gfVxuICB8IHsgb2s6IGZhbHNlOyBlcnJvcjogc3RyaW5nIH07XG5cbi8qKiBUaGUgQVBJIGV4cG9zZWQgb24gd2luZG93LnF1YW50IGJ5IHNyYy9tYWluL3ByZWxvYWQudHMuICovXG5leHBvcnQgaW50ZXJmYWNlIFF1YW50QXBpIHtcbiAgZ2V0V2F0Y2hsaXN0KCk6IFByb21pc2U8V2F0Y2hsaXN0SXRlbVtdPjtcbiAgYWRkVG9XYXRjaGxpc3Qoc3ltYm9sOiBzdHJpbmcpOiBQcm9taXNlPEFkZFdhdGNobGlzdFJlc3VsdD47XG4gIHJlbW92ZUZyb21XYXRjaGxpc3Qoc3ltYm9sOiBzdHJpbmcpOiBQcm9taXNlPFdhdGNobGlzdEl0ZW1bXT47XG4gIHNlYXJjaFN5bWJvbHMocXVlcnk6IHN0cmluZyk6IFByb21pc2U8U3ltYm9sU3VnZ2VzdGlvbltdPjtcbiAgZ2V0UXVvdGVzKHN5bWJvbHM6IHN0cmluZ1tdKTogUHJvbWlzZTxRdW90ZVtdPjtcbiAgZ2V0SG9sZGluZ3MoZXRmU3ltYm9sOiBzdHJpbmcpOiBQcm9taXNlPEhvbGRpbmdzUmVzdWx0PjtcbiAgZ2V0TmV3cyhzeW1ib2xzOiBzdHJpbmdbXSwgbGltaXRQZXJTeW1ib2w/OiBudW1iZXIpOiBQcm9taXNlPE5ld3NJdGVtW10+O1xuICBnZXRFYXJuaW5ncyhzeW1ib2xzOiBzdHJpbmdbXSk6IFByb21pc2U8RWFybmluZ3NFdmVudFtdPjtcbiAgZ2V0Q2hhcnQoc3ltYm9sOiBzdHJpbmcsIHJhbmdlOiBDaGFydFJhbmdlKTogUHJvbWlzZTxDaGFydERhdGE+O1xuICBnZXRQaXZvdE5ld3Moc3ltYm9sOiBzdHJpbmcsIHBpdm90czogUGl2b3RQb2ludFtdKTogUHJvbWlzZTxQaXZvdE5ld3NSZXN1bHRbXT47XG4gIGdldE1hY3JvT3ZlcmxheShrZXk6IE1hY3JvT3ZlcmxheUtleSwgcmFuZ2U6IENoYXJ0UmFuZ2UpOiBQcm9taXNlPE1hY3JvT3ZlcmxheVNlcmllcz47XG4gIGNhcHR1cmVDaGFydFNuYXBzaG90KHN5bWJvbDogc3RyaW5nKTogUHJvbWlzZTx7IGRhdGFVcmw6IHN0cmluZzsgY2FwdHVyZWRBdDogc3RyaW5nIH0gfCBudWxsPjtcbiAgYW5hbHl6ZVF1YW50KHJlcXVlc3Q6IFF1YW50SW5zaWdodFJlcXVlc3QpOiBQcm9taXNlPFF1YW50SW5zaWdodFJlc3BvbnNlPjtcbiAgZ2V0UXVhbnRJbnNpZ2h0cyhzeW1ib2w6IHN0cmluZywgcmFuZ2U/OiBDaGFydFJhbmdlKTogUHJvbWlzZTxRdWFudEluc2lnaHRSZWNvcmRbXT47XG4gIGdldExsbVNldHRpbmdzKCk6IFByb21pc2U8TGxtU2V0dGluZ3M+O1xuICBzYXZlTGxtU2V0dGluZ3Moc2V0dGluZ3M6IExsbVNldHRpbmdzKTogUHJvbWlzZTxMbG1TZXR0aW5ncz47XG4gIGdldFZhbHVhdGlvbihzeW1ib2w6IHN0cmluZyk6IFByb21pc2U8VmFsdWF0aW9uU25hcHNob3Q+O1xuICBvcGVuRXh0ZXJuYWwodXJsOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+O1xufVxuIiwgIi8vIExhenkgcmVhZGVycyBmb3IgdGhlIEpTT04gZGF0YXNldHMgYnVuZGxlZCBuZXh0IHRvIG1haW4uanMuXG4vLyBUaGUgYnVpbGQgY29waWVzIHNyYy9tYWluL2RhdGEgLT4gZGlzdC9tYWluL2RhdGEsIHNvIGF0IHJ1bnRpbWUgdGhlIGZpbGVzXG4vLyBsaXZlIGF0IHBhdGguam9pbihfX2Rpcm5hbWUsICdkYXRhJywgLi4uKS4gQ29ycnVwdC9taXNzaW5nIGZpbGVzIGRlZ3JhZGVcbi8vIHRvIGVtcHR5IGRhdGFzZXRzIFx1MjAxNCBjYWxsZXJzIG11c3QgaGFuZGxlIHRoYXQuXG5cbmltcG9ydCBmcyBmcm9tICdub2RlOmZzJztcbmltcG9ydCBwYXRoIGZyb20gJ25vZGU6cGF0aCc7XG5pbXBvcnQgdHlwZSB7IEhvbGRpbmcsIEluc3RydW1lbnRUeXBlIH0gZnJvbSAnLi4vLi4vc2hhcmVkL3R5cGVzJztcblxuZXhwb3J0IGludGVyZmFjZSBFdGZCdW5kbGVFbnRyeSB7XG4gIG5hbWU6IHN0cmluZztcbiAgaG9sZGluZ3M6IEhvbGRpbmdbXTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBFdGZIb2xkaW5nc0J1bmRsZSB7XG4gIF9tZXRhPzogeyBub3RlPzogc3RyaW5nOyBhc09mPzogc3RyaW5nIH07XG4gIGV0ZnM6IFJlY29yZDxzdHJpbmcsIEV0ZkJ1bmRsZUVudHJ5Pjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBEaXJlY3RvcnlFbnRyeSB7XG4gIHN5bWJvbDogc3RyaW5nO1xuICBuYW1lOiBzdHJpbmc7XG4gIHR5cGU6IEluc3RydW1lbnRUeXBlO1xuICBleGNoYW5nZT86IHN0cmluZztcbn1cblxuZnVuY3Rpb24gcmVhZEpzb24oZmlsZU5hbWU6IHN0cmluZyk6IHVua25vd24ge1xuICB0cnkge1xuICAgIGNvbnN0IGZpbGVQYXRoID0gcGF0aC5qb2luKF9fZGlybmFtZSwgJ2RhdGEnLCBmaWxlTmFtZSk7XG4gICAgcmV0dXJuIEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKGZpbGVQYXRoLCAndXRmOCcpKSBhcyB1bmtub3duO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICBjb25zb2xlLmVycm9yKGBbZGF0YV0gZmFpbGVkIHRvIHJlYWQgJHtmaWxlTmFtZX06YCwgZXJyKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxuXG5sZXQgZXRmQnVuZGxlQ2FjaGU6IEV0ZkhvbGRpbmdzQnVuZGxlIHwgbnVsbCA9IG51bGw7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRFdGZCdW5kbGUoKTogRXRmSG9sZGluZ3NCdW5kbGUge1xuICBpZiAoZXRmQnVuZGxlQ2FjaGUpIHJldHVybiBldGZCdW5kbGVDYWNoZTtcbiAgY29uc3QgcmF3ID0gcmVhZEpzb24oJ2V0Zi1ob2xkaW5ncy5qc29uJykgYXMgRXRmSG9sZGluZ3NCdW5kbGUgfCBudWxsO1xuICBjb25zdCBldGZzOiBSZWNvcmQ8c3RyaW5nLCBFdGZCdW5kbGVFbnRyeT4gPSB7fTtcbiAgaWYgKHJhdyAmJiB0eXBlb2YgcmF3ID09PSAnb2JqZWN0JyAmJiByYXcuZXRmcyAmJiB0eXBlb2YgcmF3LmV0ZnMgPT09ICdvYmplY3QnKSB7XG4gICAgZm9yIChjb25zdCBbc3ltYm9sLCBlbnRyeV0gb2YgT2JqZWN0LmVudHJpZXMocmF3LmV0ZnMpKSB7XG4gICAgICBpZiAoIWVudHJ5IHx8IHR5cGVvZiBlbnRyeS5uYW1lICE9PSAnc3RyaW5nJyB8fCAhQXJyYXkuaXNBcnJheShlbnRyeS5ob2xkaW5ncykpIGNvbnRpbnVlO1xuICAgICAgY29uc3QgaG9sZGluZ3M6IEhvbGRpbmdbXSA9IFtdO1xuICAgICAgZm9yIChjb25zdCBoIG9mIGVudHJ5LmhvbGRpbmdzKSB7XG4gICAgICAgIGlmICghaCB8fCB0eXBlb2YgaC5zeW1ib2wgIT09ICdzdHJpbmcnIHx8IHR5cGVvZiBoLm5hbWUgIT09ICdzdHJpbmcnKSBjb250aW51ZTtcbiAgICAgICAgaG9sZGluZ3MucHVzaCh7XG4gICAgICAgICAgc3ltYm9sOiBoLnN5bWJvbC50b1VwcGVyQ2FzZSgpLFxuICAgICAgICAgIG5hbWU6IGgubmFtZSxcbiAgICAgICAgICB3ZWlnaHRQZXJjZW50OiB0eXBlb2YgaC53ZWlnaHRQZXJjZW50ID09PSAnbnVtYmVyJyA/IGgud2VpZ2h0UGVyY2VudCA6IG51bGwsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgZXRmc1tzeW1ib2wudG9VcHBlckNhc2UoKV0gPSB7IG5hbWU6IGVudHJ5Lm5hbWUsIGhvbGRpbmdzIH07XG4gICAgfVxuICB9XG4gIGV0ZkJ1bmRsZUNhY2hlID0ge1xuICAgIF9tZXRhOiByYXc/Ll9tZXRhLFxuICAgIGV0ZnMsXG4gIH07XG4gIHJldHVybiBldGZCdW5kbGVDYWNoZTtcbn1cblxuLyoqIFRoZSBhc09mIGxhYmVsIGZvciB0aGUgYnVuZGxlZCBob2xkaW5ncyBzbmFwc2hvdC4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRCdW5kbGVBc09mKCk6IHN0cmluZyB7XG4gIHJldHVybiBnZXRFdGZCdW5kbGUoKS5fbWV0YT8uYXNPZiA/PyAnMjAyNi0wNic7XG59XG5cbmxldCBkaXJlY3RvcnlDYWNoZTogRGlyZWN0b3J5RW50cnlbXSB8IG51bGwgPSBudWxsO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0U3ltYm9sRGlyZWN0b3J5KCk6IERpcmVjdG9yeUVudHJ5W10ge1xuICBpZiAoZGlyZWN0b3J5Q2FjaGUpIHJldHVybiBkaXJlY3RvcnlDYWNoZTtcbiAgY29uc3QgcmF3ID0gcmVhZEpzb24oJ3N5bWJvbC1kaXJlY3RvcnkuanNvbicpIGFzXG4gICAgfCB7IHN5bWJvbHM/OiB1bmtub3duIH1cbiAgICB8IG51bGw7XG4gIGNvbnN0IG91dDogRGlyZWN0b3J5RW50cnlbXSA9IFtdO1xuICBpZiAocmF3ICYmIEFycmF5LmlzQXJyYXkocmF3LnN5bWJvbHMpKSB7XG4gICAgZm9yIChjb25zdCBlbnRyeSBvZiByYXcuc3ltYm9scykge1xuICAgICAgY29uc3QgZSA9IGVudHJ5IGFzIFBhcnRpYWw8RGlyZWN0b3J5RW50cnk+O1xuICAgICAgaWYgKFxuICAgICAgICB0eXBlb2YgZS5zeW1ib2wgPT09ICdzdHJpbmcnICYmXG4gICAgICAgIHR5cGVvZiBlLm5hbWUgPT09ICdzdHJpbmcnICYmXG4gICAgICAgIChlLnR5cGUgPT09ICdldGYnIHx8IGUudHlwZSA9PT0gJ3N0b2NrJylcbiAgICAgICkge1xuICAgICAgICBvdXQucHVzaCh7XG4gICAgICAgICAgc3ltYm9sOiBlLnN5bWJvbC50b1VwcGVyQ2FzZSgpLFxuICAgICAgICAgIG5hbWU6IGUubmFtZSxcbiAgICAgICAgICB0eXBlOiBlLnR5cGUsXG4gICAgICAgICAgZXhjaGFuZ2U6IHR5cGVvZiBlLmV4Y2hhbmdlID09PSAnc3RyaW5nJyA/IGUuZXhjaGFuZ2UgOiB1bmRlZmluZWQsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBkaXJlY3RvcnlDYWNoZSA9IG91dDtcbiAgcmV0dXJuIGRpcmVjdG9yeUNhY2hlO1xufVxuXG4vKiogRXhhY3Qtc3ltYm9sIGxvb2t1cCBpbiB0aGUgb2ZmbGluZSBkaXJlY3RvcnkuICovXG5leHBvcnQgZnVuY3Rpb24gZGlyZWN0b3J5TG9va3VwKHN5bWJvbDogc3RyaW5nKTogRGlyZWN0b3J5RW50cnkgfCB1bmRlZmluZWQge1xuICBjb25zdCBzeW0gPSBzeW1ib2wudG9VcHBlckNhc2UoKTtcbiAgcmV0dXJuIGdldFN5bWJvbERpcmVjdG9yeSgpLmZpbmQoKGUpID0+IGUuc3ltYm9sID09PSBzeW0pO1xufVxuXG4vKiogQmVzdC1lZmZvcnQgZGlzcGxheSBuYW1lIGZvciBhIHN5bWJvbCBmcm9tIGFueSBidW5kbGVkIGRhdGFzZXQuICovXG5leHBvcnQgZnVuY3Rpb24gbG9va3VwTmFtZShzeW1ib2w6IHN0cmluZyk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gIGNvbnN0IGRpciA9IGRpcmVjdG9yeUxvb2t1cChzeW1ib2wpO1xuICBpZiAoZGlyKSByZXR1cm4gZGlyLm5hbWU7XG4gIGNvbnN0IGJ1bmRsZSA9IGdldEV0ZkJ1bmRsZSgpO1xuICBjb25zdCBldGYgPSBidW5kbGUuZXRmc1tzeW1ib2wudG9VcHBlckNhc2UoKV07XG4gIGlmIChldGYpIHJldHVybiBldGYubmFtZTtcbiAgZm9yIChjb25zdCBlbnRyeSBvZiBPYmplY3QudmFsdWVzKGJ1bmRsZS5ldGZzKSkge1xuICAgIGNvbnN0IGhpdCA9IGVudHJ5LmhvbGRpbmdzLmZpbmQoKGgpID0+IGguc3ltYm9sID09PSBzeW1ib2wudG9VcHBlckNhc2UoKSk7XG4gICAgaWYgKGhpdCkgcmV0dXJuIGhpdC5uYW1lO1xuICB9XG4gIHJldHVybiB1bmRlZmluZWQ7XG59XG4iLCAiLy8gU21hbGwgc2hhcmVkIHV0aWxpdGllcyBmb3IgdGhlIG1haW4tcHJvY2VzcyBzZXJ2aWNlczogc3ltYm9sIHZhbGlkYXRpb24sXG4vLyBzdGFibGUgaGFzaGluZywgYSBzZWVkZWQgUFJORyBmb3IgZGV0ZXJtaW5pc3RpYyBzYW1wbGUgZGF0YSwgY29uY3VycmVuY3lcbi8vIGxpbWl0aW5nLCBhbmQgZGF0ZSBoZWxwZXJzLlxuXG4vKiogVGlja2VyIHN5bWJvbHMgd2UgYWNjZXB0IGFueXdoZXJlIGluIHRoZSBhcHAgKHdhdGNobGlzdCwgSVBDIGlucHV0cykuICovXG5leHBvcnQgY29uc3QgU1lNQk9MX1JFID0gL15bQS1aMC05Ll4tXXsxLDEyfSQvaTtcblxuLyoqIE5vcm1hbGl6ZSBhbiB1bmtub3duIHZhbHVlIHRvIGFuIHVwcGVyY2FzZSB2YWxpZGF0ZWQgc3ltYm9sLCBvciBudWxsLiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG5vcm1hbGl6ZVN5bWJvbChyYXc6IHVua25vd24pOiBzdHJpbmcgfCBudWxsIHtcbiAgaWYgKHR5cGVvZiByYXcgIT09ICdzdHJpbmcnKSByZXR1cm4gbnVsbDtcbiAgY29uc3Qgc3ltID0gcmF3LnRyaW0oKS50b1VwcGVyQ2FzZSgpO1xuICByZXR1cm4gc3ltLmxlbmd0aCA+IDAgJiYgU1lNQk9MX1JFLnRlc3Qoc3ltKSA/IHN5bSA6IG51bGw7XG59XG5cbi8qKiBWYWxpZGF0ZSBhbiB1bmtub3duIElQQyBwYXlsb2FkIGludG8gYSB1bmlxdWUsIGJvdW5kZWQgc3ltYm9sIGxpc3QuICovXG5leHBvcnQgZnVuY3Rpb24gY2xlYW5TeW1ib2xMaXN0KHJhdzogdW5rbm93biwgbWF4OiBudW1iZXIpOiBzdHJpbmdbXSB7XG4gIGlmICghQXJyYXkuaXNBcnJheShyYXcpKSByZXR1cm4gW107XG4gIGNvbnN0IG91dDogc3RyaW5nW10gPSBbXTtcbiAgZm9yIChjb25zdCBlbnRyeSBvZiByYXcpIHtcbiAgICBjb25zdCBzeW0gPSBub3JtYWxpemVTeW1ib2woZW50cnkpO1xuICAgIGlmIChzeW0gJiYgIW91dC5pbmNsdWRlcyhzeW0pKSB7XG4gICAgICBvdXQucHVzaChzeW0pO1xuICAgICAgaWYgKG91dC5sZW5ndGggPj0gbWF4KSBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG91dDtcbn1cblxuLyoqIEZOVi0xYSAzMi1iaXQgaGFzaCB3aXRoIGEgY29uZmlndXJhYmxlIHNlZWQuIFN0YWJsZSBhY3Jvc3MgcnVucy4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmbnYxYShpbnB1dDogc3RyaW5nLCBzZWVkID0gMHg4MTFjOWRjNSk6IG51bWJlciB7XG4gIGxldCBoID0gc2VlZCA+Pj4gMDtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbnB1dC5sZW5ndGg7IGkrKykge1xuICAgIGggXj0gaW5wdXQuY2hhckNvZGVBdChpKTtcbiAgICBoID0gTWF0aC5pbXVsKGgsIDB4MDEwMDAxOTMpO1xuICB9XG4gIHJldHVybiBoID4+PiAwO1xufVxuXG4vKiogU3RhYmxlIG5vbi1uZWdhdGl2ZSBpbnRlZ2VyIGhhc2ggb2YgYSBzdHJpbmcuICovXG5leHBvcnQgZnVuY3Rpb24gc3RhYmxlSGFzaChpbnB1dDogc3RyaW5nKTogbnVtYmVyIHtcbiAgcmV0dXJuIGZudjFhKGlucHV0KTtcbn1cblxuLyoqIFNob3J0IHN0YWJsZSBpZCBzdHJpbmcgZGVyaXZlZCBmcm9tIHR3byBoYXNoIHBhc3NlcyAoZm9yIE5ld3NJdGVtIGlkcykuICovXG5leHBvcnQgZnVuY3Rpb24gaGFzaElkKGlucHV0OiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gZm52MWEoaW5wdXQpLnRvU3RyaW5nKDM2KSArIGZudjFhKGlucHV0LCAweDk3NDdiMjhjKS50b1N0cmluZygzNik7XG59XG5cbi8qKiBtdWxiZXJyeTMyIFBSTkcgXHUyMDE0IGRldGVybWluaXN0aWMgc2VxdWVuY2UgaW4gWzAsIDEpIGZvciBhIGdpdmVuIHNlZWQuICovXG5leHBvcnQgZnVuY3Rpb24gbXVsYmVycnkzMihzZWVkOiBudW1iZXIpOiAoKSA9PiBudW1iZXIge1xuICBsZXQgYSA9IHNlZWQgPj4+IDA7XG4gIHJldHVybiAoKSA9PiB7XG4gICAgYSA9IChhICsgMHg2ZDJiNzlmNSkgfCAwO1xuICAgIGxldCB0ID0gTWF0aC5pbXVsKGEgXiAoYSA+Pj4gMTUpLCAxIHwgYSk7XG4gICAgdCA9ICh0ICsgTWF0aC5pbXVsKHQgXiAodCA+Pj4gNyksIDYxIHwgdCkpIF4gdDtcbiAgICByZXR1cm4gKCh0IF4gKHQgPj4+IDE0KSkgPj4+IDApIC8gNDI5NDk2NzI5NjtcbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNsZWVwKG1zOiBudW1iZXIpOiBQcm9taXNlPHZvaWQ+IHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIG1zKSk7XG59XG5cbi8qKiBNaW5pbWFsIHByb21pc2UtY29uY3VycmVuY3kgbGltaXRlciAocC1saW1pdCBzdHlsZSkuICovXG5leHBvcnQgZnVuY3Rpb24gcExpbWl0KGNvbmN1cnJlbmN5OiBudW1iZXIpOiA8VD4oZm46ICgpID0+IFByb21pc2U8VD4pID0+IFByb21pc2U8VD4ge1xuICBsZXQgYWN0aXZlID0gMDtcbiAgY29uc3QgcXVldWU6IEFycmF5PCgpID0+IHZvaWQ+ID0gW107XG4gIGNvbnN0IG5leHQgPSAoKTogdm9pZCA9PiB7XG4gICAgYWN0aXZlLS07XG4gICAgY29uc3QgcnVuID0gcXVldWUuc2hpZnQoKTtcbiAgICBpZiAocnVuKSBydW4oKTtcbiAgfTtcbiAgcmV0dXJuIDxUPihmbjogKCkgPT4gUHJvbWlzZTxUPik6IFByb21pc2U8VD4gPT5cbiAgICBuZXcgUHJvbWlzZTxUPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCBydW4gPSAoKTogdm9pZCA9PiB7XG4gICAgICAgIGFjdGl2ZSsrO1xuICAgICAgICBmbigpLnRoZW4oXG4gICAgICAgICAgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICBuZXh0KCk7XG4gICAgICAgICAgICByZXNvbHZlKHZhbHVlKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIChlcnI6IHVua25vd24pID0+IHtcbiAgICAgICAgICAgIG5leHQoKTtcbiAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgIH0sXG4gICAgICAgICk7XG4gICAgICB9O1xuICAgICAgaWYgKGFjdGl2ZSA8IGNvbmN1cnJlbmN5KSBydW4oKTtcbiAgICAgIGVsc2UgcXVldWUucHVzaChydW4pO1xuICAgIH0pO1xufVxuXG4vKiogRm9ybWF0IGEgRGF0ZSBhcyBVVEMgWVlZWS1NTS1ERC4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0b1ltZChkOiBEYXRlKTogc3RyaW5nIHtcbiAgcmV0dXJuIGQudG9JU09TdHJpbmcoKS5zbGljZSgwLCAxMCk7XG59XG5cbi8qKiBUb2RheSdzIGRhdGUgYXMgVVRDIFlZWVktTU0tREQuICovXG5leHBvcnQgZnVuY3Rpb24gdG9kYXlZbWQoKTogc3RyaW5nIHtcbiAgcmV0dXJuIHRvWW1kKG5ldyBEYXRlKCkpO1xufVxuXG4vKiogUGFyc2UgYW55IGRhdGUtaXNoIHN0cmluZyB0byBlcG9jaCBtcywgb3IgbnVsbCB3aGVuIHVucGFyc2VhYmxlLiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlRGF0ZU1zKHZhbHVlOiBzdHJpbmcgfCB1bmRlZmluZWQpOiBudW1iZXIgfCBudWxsIHtcbiAgaWYgKCF2YWx1ZSkgcmV0dXJuIG51bGw7XG4gIGNvbnN0IG1zID0gRGF0ZS5wYXJzZSh2YWx1ZSk7XG4gIHJldHVybiBOdW1iZXIuaXNOYU4obXMpID8gbnVsbCA6IG1zO1xufVxuXG4vKiogTm9ybWFsaXplZCBmb3JtIG9mIGEgaGVhZGxpbmUgdXNlZCBmb3IgY3Jvc3Mtc291cmNlIGRlZHVwZS4gKi9cbmV4cG9ydCBmdW5jdGlvbiBub3JtYWxpemVUaXRsZSh0aXRsZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIHRpdGxlLnRvTG93ZXJDYXNlKCkucmVwbGFjZSgvW15hLXowLTldKy9nLCAnICcpLnRyaW0oKTtcbn1cblxuLyoqIFN0cmlwIEhUTUwgdGFncyBhbmQgY29sbGFwc2Ugd2hpdGVzcGFjZSAoZm9yIFJTUyBkZXNjcmlwdGlvbnMpLiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHN0cmlwSHRtbChpbnB1dDogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIGlucHV0XG4gICAgLnJlcGxhY2UoLzxbXj5dKj4vZywgJyAnKVxuICAgIC5yZXBsYWNlKC8mYW1wOy9nLCAnJicpXG4gICAgLnJlcGxhY2UoLyZsdDsvZywgJzwnKVxuICAgIC5yZXBsYWNlKC8mZ3Q7L2csICc+JylcbiAgICAucmVwbGFjZSgvJnF1b3Q7L2csICdcIicpXG4gICAgLnJlcGxhY2UoLyYjMD8zOTt8JmFwb3M7L2csIFwiJ1wiKVxuICAgIC5yZXBsYWNlKC8mbmJzcDsvZywgJyAnKVxuICAgIC5yZXBsYWNlKC9cXHMrL2csICcgJylcbiAgICAudHJpbSgpO1xufVxuXG4vKiogQ2xhbXAgYW4gdW5rbm93biBudW1lcmljIGlucHV0IHRvIGFuIGludGVnZXIgd2l0aGluIFttaW4sIG1heF0uICovXG5leHBvcnQgZnVuY3Rpb24gY2xhbXBJbnQocmF3OiB1bmtub3duLCBtaW46IG51bWJlciwgbWF4OiBudW1iZXIsIGZhbGxiYWNrOiBudW1iZXIpOiBudW1iZXIge1xuICBjb25zdCBuID0gdHlwZW9mIHJhdyA9PT0gJ251bWJlcicgJiYgTnVtYmVyLmlzRmluaXRlKHJhdykgPyBNYXRoLnJvdW5kKHJhdykgOiBmYWxsYmFjaztcbiAgcmV0dXJuIE1hdGgubWluKG1heCwgTWF0aC5tYXgobWluLCBuKSk7XG59XG5cbi8qKiBSb3VuZCB0byAyIGRlY2ltYWwgcGxhY2VzIChwcmljZXMpLiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJvdW5kMihuOiBudW1iZXIpOiBudW1iZXIge1xuICByZXR1cm4gTWF0aC5yb3VuZChuICogMTAwKSAvIDEwMDtcbn1cbiIsICIvLyBEZXRlcm1pbmlzdGljIG9mZmxpbmUgZmFsbGJhY2tzLiBFdmVyeXRoaW5nIGhlcmUgaXMgZ2VuZXJhdGVkIGZyb20gYVxuLy8gbXVsYmVycnkzMiBQUk5HIHNlZWRlZCBieSBhIHN0YWJsZSBoYXNoIG9mIHN5bWJvbCgrcmFuZ2UpIFx1MjAxNCBub1xuLy8gTWF0aC5yYW5kb20sIG5vIGRhdGUtc2VlZGVkIHJhbmRvbW5lc3MgXHUyMDE0IHNvIHJlcGVhdGVkIGNhbGxzIHByb2R1Y2UgdGhlXG4vLyBzYW1lIGRhdGEuIEFsbCBwYXlsb2FkcyBhcmUgZmxhZ2dlZCBzb3VyY2U6ICdzYW1wbGUnIHdoZXJlIHRoZSBzaGFwZVxuLy8gYWxsb3dzIGl0OyBzYW1wbGUgbmV3cyBpcyBtYXJrZWQgdmlhIHNvdXJjZU5hbWUgJ1NhbXBsZSBEYXRhJyBhbmQgYVxuLy8gJ3NhbXBsZS0nIGlkIHByZWZpeCBzaW5jZSBOZXdzSXRlbSBoYXMgbm8gc291cmNlIGZpZWxkLlxuXG5pbXBvcnQgdHlwZSB7XG4gIENhbmRsZSxcbiAgQ2hhcnREYXRhLFxuICBDaGFydFJhbmdlLFxuICBFYXJuaW5nc0V2ZW50LFxuICBOZXdzSXRlbSxcbiAgUXVvdGUsXG59IGZyb20gJy4uLy4uL3NoYXJlZC90eXBlcyc7XG5pbXBvcnQgeyBsb29rdXBOYW1lIH0gZnJvbSAnLi9kYXRhRmlsZXMnO1xuaW1wb3J0IHsgbXVsYmVycnkzMiwgcm91bmQyLCBzdGFibGVIYXNoLCB0b1ltZCB9IGZyb20gJy4vdXRpbCc7XG5cbi8vIFBsYXVzaWJsZSBtaWQtMjAyNiBwcmljZSBsZXZlbHMgZm9yIHdlbGwta25vd24gdGlja2VyczsgZGVmYXVsdCAxMDAuXG5jb25zdCBCQVNFX1BSSUNFUzogUmVjb3JkPHN0cmluZywgbnVtYmVyPiA9IHtcbiAgU1BZOiA2MjAsIFZPTzogNTcwLCBJVlY6IDYyMywgVlRJOiAzMDUsIFFRUTogNTYwLCBESUE6IDQ0NSwgSVdNOiAyMjUsXG4gIFhMSzogMjY1LCBYTEY6IDUzLCBYTEU6IDkyLCBYTFY6IDEzNSwgU01IOiAyOTAsIFNPWFg6IDI0NSwgQVJLSzogNzUsXG4gIFNDSEQ6IDI3LCBKRVBJOiA1NiwgVkdUOiA3MDAsIFZVRzogNDYwLCBWVFY6IDE3NSwgUlNQOiAxODUsXG4gIEFBUEw6IDIzMCwgTVNGVDogNTAwLCBOVkRBOiAxNzAsIEFNWk46IDIyMCwgR09PR0w6IDE4NSwgR09PRzogMTg3LFxuICBNRVRBOiA3MjAsIFRTTEE6IDMyMCwgQVZHTzogMjcwLCAnQlJLLUInOiA0OTAsIEpQTTogMjkwLCBWOiAzNTUsXG4gIE1BOiA1NjAsIFVOSDogMzEwLCBYT006IDExNSwgTExZOiA3ODAsIEpOSjogMTU1LCBQRzogMTYwLCBIRDogMzY1LFxuICBDT1NUOiA5ODUsIFdNVDogOTgsIE5GTFg6IDEyNTAsIENSTTogMjcwLCBPUkNMOiAyMTAsIEFNRDogMTQwLFxuICBBREJFOiAzOTAsIFBFUDogMTMyLCBLTzogNzAsIENTQ086IDY2LCBJTlRDOiAyMiwgVFNNOiAyMzAsIEFTTUw6IDc5MCxcbiAgUUNPTTogMTU1LCBUWE46IDE5NSwgTVU6IDEyMCwgQU1BVDogMTg1LCBMUkNYOiA5NSwgS0xBQzogODgwLFxuICBQTFRSOiAxNDAsIENPSU46IDM1MCwgSE9PRDogODAsIFNIT1A6IDExMCwgRElTOiAxMjAsIEJBOiAyMTAsXG4gIENBVDogMzkwLCBHUzogNzAwLCBNUzogMTQwLCBCQUM6IDQ3LCBXRkM6IDgwLCBJQk06IDI5MCwgR0U6IDI1MCxcbiAgTUNEOiAzMDAsIE5LRTogNzIsIFQ6IDI4LCBWWjogNDMsIFBGRTogMjUsIE1SSzogODIsIEFCQlY6IDE5MCxcbiAgVE1POiA0OTAsIENWWDogMTU1LCBDT1A6IDk1LCBVQkVSOiA5MCwgTk9XOiAxMDAwLCBJU1JHOiA1MzAsIElOVFU6IDc2MCxcbiAgQU1HTjogMjkwLCBIT046IDIyMCwgR0lMRDogMTEwLCBCTVk6IDU1LCBTQlVYOiA5NSwgUFlQTDogNzUsXG59O1xuXG5leHBvcnQgZnVuY3Rpb24gYmFzZVByaWNlRm9yKHN5bWJvbDogc3RyaW5nKTogbnVtYmVyIHtcbiAgcmV0dXJuIEJBU0VfUFJJQ0VTW3N5bWJvbC50b1VwcGVyQ2FzZSgpXSA/PyAxMDA7XG59XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gQ2FuZGxlc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnR5cGUgU2Vzc2lvbktpbmQgPSAnaW50cmFkYXknIHwgJ2RhaWx5JyB8ICd3ZWVrbHknIHwgJ21vbnRobHknO1xuXG5pbnRlcmZhY2UgU2FtcGxlUmFuZ2VTcGVjIHtcbiAgaW50ZXJ2YWw6IHN0cmluZztcbiAgY291bnQ6IG51bWJlcjtcbiAga2luZDogU2Vzc2lvbktpbmQ7XG4gIHN0ZXBTZWM6IG51bWJlcjsgLy8gYmFyIHNwYWNpbmcgZm9yIGludHJhZGF5IGtpbmRzXG4gIHZvbDogbnVtYmVyOyAgICAgLy8gcGVyLWJhciB2b2xhdGlsaXR5IChmcmFjdGlvbmFsKVxuICBiYXNlVm9sdW1lOiBudW1iZXI7XG59XG5cbmNvbnN0IFNBTVBMRV9SQU5HRTogUmVjb3JkPENoYXJ0UmFuZ2UsIFNhbXBsZVJhbmdlU3BlYz4gPSB7XG4gICcxZCc6IHsgaW50ZXJ2YWw6ICc1bScsIGNvdW50OiA3OCwga2luZDogJ2ludHJhZGF5Jywgc3RlcFNlYzogMzAwLCB2b2w6IDAuMDAxMiwgYmFzZVZvbHVtZTogOTAwXzAwMCB9LFxuICAnMXcnOiB7IGludGVydmFsOiAnMTVtJywgY291bnQ6IDEzMCwga2luZDogJ2ludHJhZGF5Jywgc3RlcFNlYzogOTAwLCB2b2w6IDAuMDAyLCBiYXNlVm9sdW1lOiAyXzYwMF8wMDAgfSxcbiAgJzFtJzogeyBpbnRlcnZhbDogJzYwbScsIGNvdW50OiAxNTQsIGtpbmQ6ICdpbnRyYWRheScsIHN0ZXBTZWM6IDM2MDAsIHZvbDogMC4wMDQsIGJhc2VWb2x1bWU6IDlfMDAwXzAwMCB9LFxuICAnNm0nOiB7IGludGVydmFsOiAnMWQnLCBjb3VudDogMTI2LCBraW5kOiAnZGFpbHknLCBzdGVwU2VjOiA4Nl80MDAsIHZvbDogMC4wMTIsIGJhc2VWb2x1bWU6IDU1XzAwMF8wMDAgfSxcbiAgJzF5JzogeyBpbnRlcnZhbDogJzFkJywgY291bnQ6IDI1Miwga2luZDogJ2RhaWx5Jywgc3RlcFNlYzogODZfNDAwLCB2b2w6IDAuMDEyLCBiYXNlVm9sdW1lOiA1NV8wMDBfMDAwIH0sXG4gICc1eSc6IHsgaW50ZXJ2YWw6ICcxd2snLCBjb3VudDogMjYwLCBraW5kOiAnd2Vla2x5Jywgc3RlcFNlYzogNyAqIDg2XzQwMCwgdm9sOiAwLjAyOCwgYmFzZVZvbHVtZTogMjYwXzAwMF8wMDAgfSxcbiAgbWF4OiB7IGludGVydmFsOiAnMW1vJywgY291bnQ6IDI0MCwga2luZDogJ21vbnRobHknLCBzdGVwU2VjOiAzMCAqIDg2XzQwMCwgdm9sOiAwLjA1LCBiYXNlVm9sdW1lOiAxXzEwMF8wMDBfMDAwIH0sXG59O1xuXG5jb25zdCBTRVNTSU9OX09QRU5fU0VDID0gMTMuNSAqIDM2MDA7IC8vIDEzOjMwIFVUQyB+IFVTIG1hcmtldCBvcGVuXG5jb25zdCBTRVNTSU9OX0NMT1NFX1NFQyA9IDIwICogMzYwMDsgIC8vIDIwOjAwIFVUQyB+IFVTIG1hcmtldCBjbG9zZVxuXG4vKiogTW9zdCByZWNlbnQgd2Vla2RheSAoVVRDIG1pZG5pZ2h0IGVwb2NoIHNlY29uZHMpIG9uL2JlZm9yZSB0aGUgZ2l2ZW4gZGF5LiAqL1xuZnVuY3Rpb24gbGFzdFdlZWtkYXlVdGMoZnJvbU1zOiBudW1iZXIpOiBudW1iZXIge1xuICBjb25zdCBkID0gbmV3IERhdGUoZnJvbU1zKTtcbiAgZC5zZXRVVENIb3VycygwLCAwLCAwLCAwKTtcbiAgd2hpbGUgKGQuZ2V0VVRDRGF5KCkgPT09IDAgfHwgZC5nZXRVVENEYXkoKSA9PT0gNikge1xuICAgIGQuc2V0VVRDRGF0ZShkLmdldFVUQ0RhdGUoKSAtIDEpO1xuICB9XG4gIHJldHVybiBNYXRoLmZsb29yKGQuZ2V0VGltZSgpIC8gMTAwMCk7XG59XG5cbi8qKiBCdWlsZCBhc2NlbmRpbmcgYmFyIHRpbWVzdGFtcHMgZW5kaW5nIG5lYXIgXCJub3dcIiBmb3IgdGhlIGdpdmVuIHNwZWMuICovXG5mdW5jdGlvbiBidWlsZFRpbWVzKHNwZWM6IFNhbXBsZVJhbmdlU3BlYywgY291bnQ6IG51bWJlcik6IG51bWJlcltdIHtcbiAgY29uc3QgdGltZXM6IG51bWJlcltdID0gW107XG4gIGlmIChzcGVjLmtpbmQgPT09ICdpbnRyYWRheScpIHtcbiAgICBsZXQgZGF5ID0gbGFzdFdlZWtkYXlVdGMoRGF0ZS5ub3coKSk7XG4gICAgd2hpbGUgKHRpbWVzLmxlbmd0aCA8IGNvdW50KSB7XG4gICAgICBjb25zdCBkYXlCYXJzOiBudW1iZXJbXSA9IFtdO1xuICAgICAgZm9yIChsZXQgdCA9IFNFU1NJT05fT1BFTl9TRUM7IHQgPCBTRVNTSU9OX0NMT1NFX1NFQzsgdCArPSBzcGVjLnN0ZXBTZWMpIHtcbiAgICAgICAgZGF5QmFycy5wdXNoKGRheSArIHQpO1xuICAgICAgfVxuICAgICAgdGltZXMudW5zaGlmdCguLi5kYXlCYXJzKTtcbiAgICAgIC8vIHN0ZXAgYmFjayB0byB0aGUgcHJldmlvdXMgd2Vla2RheVxuICAgICAgZGF5ID0gbGFzdFdlZWtkYXlVdGMoKGRheSAtIDg2XzQwMCkgKiAxMDAwKTtcbiAgICB9XG4gICAgcmV0dXJuIHRpbWVzLnNsaWNlKHRpbWVzLmxlbmd0aCAtIGNvdW50KTtcbiAgfVxuICBpZiAoc3BlYy5raW5kID09PSAnZGFpbHknKSB7XG4gICAgbGV0IGRheSA9IGxhc3RXZWVrZGF5VXRjKERhdGUubm93KCkpO1xuICAgIHdoaWxlICh0aW1lcy5sZW5ndGggPCBjb3VudCkge1xuICAgICAgdGltZXMudW5zaGlmdChkYXkgKyBTRVNTSU9OX09QRU5fU0VDKTtcbiAgICAgIGRheSA9IGxhc3RXZWVrZGF5VXRjKChkYXkgLSA4Nl80MDApICogMTAwMCk7XG4gICAgfVxuICAgIHJldHVybiB0aW1lcztcbiAgfVxuICBpZiAoc3BlYy5raW5kID09PSAnd2Vla2x5Jykge1xuICAgIGNvbnN0IGFuY2hvciA9IGxhc3RXZWVrZGF5VXRjKERhdGUubm93KCkpO1xuICAgIGZvciAobGV0IGkgPSBjb3VudCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICB0aW1lcy5wdXNoKGFuY2hvciAtIGkgKiA3ICogODZfNDAwICsgU0VTU0lPTl9PUEVOX1NFQyk7XG4gICAgfVxuICAgIHJldHVybiB0aW1lcztcbiAgfVxuICAvLyBtb250aGx5OiBmaXJzdC1vZi1tb250aCBzdGVwc1xuICBjb25zdCBkID0gbmV3IERhdGUoKTtcbiAgZC5zZXRVVENIb3VycygwLCAwLCAwLCAwKTtcbiAgZC5zZXRVVENEYXRlKDEpO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGNvdW50OyBpKyspIHtcbiAgICB0aW1lcy51bnNoaWZ0KE1hdGguZmxvb3IoZC5nZXRUaW1lKCkgLyAxMDAwKSArIFNFU1NJT05fT1BFTl9TRUMpO1xuICAgIGQuc2V0VVRDTW9udGgoZC5nZXRVVENNb250aCgpIC0gMSk7XG4gIH1cbiAgcmV0dXJuIHRpbWVzO1xufVxuXG4vKiogRGV0ZXJtaW5pc3RpYyByYW5kb20td2FsayBjYW5kbGVzIGZvciBhIHN5bWJvbCtyYW5nZS4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzYW1wbGVDaGFydChzeW1ib2w6IHN0cmluZywgcmFuZ2U6IENoYXJ0UmFuZ2UpOiBDaGFydERhdGEge1xuICBjb25zdCBzeW0gPSBzeW1ib2wudG9VcHBlckNhc2UoKTtcbiAgY29uc3Qgc3BlYyA9IFNBTVBMRV9SQU5HRVtyYW5nZV07XG4gIGNvbnN0IHJuZyA9IG11bGJlcnJ5MzIoc3RhYmxlSGFzaChgJHtzeW19fCR7cmFuZ2V9YCkpO1xuICBjb25zdCBiYXNlID0gYmFzZVByaWNlRm9yKHN5bSk7XG4gIGNvbnN0IHRpbWVzID0gYnVpbGRUaW1lcyhzcGVjLCBzcGVjLmNvdW50KTtcbiAgY29uc3QgbiA9IHRpbWVzLmxlbmd0aDtcblxuICAvLyBSYW5kb20gd2FsayBhbmNob3JlZCBzbyB0aGUgZmluYWwgY2xvc2UgbGFuZHMgb24gdGhlIGJhc2UgcHJpY2UuXG4gIGNvbnN0IGNsb3NlcyA9IG5ldyBBcnJheTxudW1iZXI+KG4pO1xuICBjbG9zZXNbbiAtIDFdID0gYmFzZTtcbiAgZm9yIChsZXQgaSA9IG4gLSAyOyBpID49IDA7IGktLSkge1xuICAgIGNvbnN0IGRyaWZ0ID0gKHJuZygpIC0gMC40OTUpICogMiAqIHNwZWMudm9sO1xuICAgIGNsb3Nlc1tpXSA9IGNsb3Nlc1tpICsgMV0gLyAoMSArIGRyaWZ0KTtcbiAgfVxuXG4gIGNvbnN0IGNhbmRsZXM6IENhbmRsZVtdID0gW107XG4gIGxldCBwcmV2Q2xvc2UgPSBjbG9zZXNbMF0gKiAoMSArIChybmcoKSAtIDAuNSkgKiBzcGVjLnZvbCk7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbjsgaSsrKSB7XG4gICAgY29uc3Qgb3BlbiA9IHByZXZDbG9zZTtcbiAgICBjb25zdCBjbG9zZSA9IGNsb3Nlc1tpXTtcbiAgICBjb25zdCB3aWNrID0gTWF0aC5tYXgoTWF0aC5hYnMoY2xvc2UgLSBvcGVuKSwgY2xvc2UgKiBzcGVjLnZvbCAqIDAuNSk7XG4gICAgY29uc3QgaGlnaCA9IE1hdGgubWF4KG9wZW4sIGNsb3NlKSArIHJuZygpICogd2ljayAqIDAuNjtcbiAgICBjb25zdCBsb3cgPSBNYXRoLm1pbihvcGVuLCBjbG9zZSkgLSBybmcoKSAqIHdpY2sgKiAwLjY7XG4gICAgY2FuZGxlcy5wdXNoKHtcbiAgICAgIHRpbWU6IHRpbWVzW2ldLFxuICAgICAgb3Blbjogcm91bmQyKG9wZW4pLFxuICAgICAgaGlnaDogcm91bmQyKGhpZ2gpLFxuICAgICAgbG93OiByb3VuZDIoTWF0aC5tYXgobG93LCAwLjAxKSksXG4gICAgICBjbG9zZTogcm91bmQyKGNsb3NlKSxcbiAgICAgIHZvbHVtZTogTWF0aC5yb3VuZChzcGVjLmJhc2VWb2x1bWUgKiAoMC40ICsgcm5nKCkgKiAxLjIpKSxcbiAgICB9KTtcbiAgICBwcmV2Q2xvc2UgPSBjbG9zZTtcbiAgfVxuXG4gIGNvbnN0IHByZXZpb3VzQ2xvc2UgPVxuICAgIHJhbmdlID09PSAnMWQnID8gcm91bmQyKGNhbmRsZXNbMF0ub3BlbikgOiByb3VuZDIoY2FuZGxlc1tNYXRoLm1heCgwLCBuIC0gMildLmNsb3NlKTtcblxuICByZXR1cm4ge1xuICAgIHN5bWJvbDogc3ltLFxuICAgIHJhbmdlLFxuICAgIGludGVydmFsOiBzcGVjLmludGVydmFsLFxuICAgIGNhbmRsZXMsXG4gICAgY3VycmVuY3k6ICdVU0QnLFxuICAgIGV4Y2hhbmdlTmFtZTogdW5kZWZpbmVkLFxuICAgIHJlZ3VsYXJNYXJrZXRQcmljZTogcm91bmQyKGNhbmRsZXNbbiAtIDFdLmNsb3NlKSxcbiAgICBwcmV2aW91c0Nsb3NlLFxuICAgIHNvdXJjZTogJ3NhbXBsZScsXG4gIH07XG59XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUXVvdGVzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuZXhwb3J0IGZ1bmN0aW9uIHNhbXBsZVF1b3RlKHN5bWJvbDogc3RyaW5nKTogUXVvdGUge1xuICBjb25zdCBzeW0gPSBzeW1ib2wudG9VcHBlckNhc2UoKTtcbiAgY29uc3QgY2hhcnQgPSBzYW1wbGVDaGFydChzeW0sICcxZCcpO1xuICBjb25zdCBsYXN0ID0gY2hhcnQuY2FuZGxlc1tjaGFydC5jYW5kbGVzLmxlbmd0aCAtIDFdO1xuICBjb25zdCBwcmljZSA9IGxhc3QuY2xvc2U7XG4gIGNvbnN0IHByZXZpb3VzQ2xvc2UgPSBjaGFydC5wcmV2aW91c0Nsb3NlID8/IG51bGw7XG4gIGNvbnN0IGNoYW5nZSA9XG4gICAgcHJldmlvdXNDbG9zZSAhPT0gbnVsbCA/IHJvdW5kMihwcmljZSAtIHByZXZpb3VzQ2xvc2UpIDogbnVsbDtcbiAgY29uc3QgY2hhbmdlUGVyY2VudCA9XG4gICAgcHJldmlvdXNDbG9zZSAhPT0gbnVsbCAmJiBwcmV2aW91c0Nsb3NlICE9PSAwICYmIGNoYW5nZSAhPT0gbnVsbFxuICAgICAgPyByb3VuZDIoKGNoYW5nZSAvIHByZXZpb3VzQ2xvc2UpICogMTAwKVxuICAgICAgOiBudWxsO1xuICByZXR1cm4ge1xuICAgIHN5bWJvbDogc3ltLFxuICAgIHByaWNlLFxuICAgIGNoYW5nZSxcbiAgICBjaGFuZ2VQZXJjZW50LFxuICAgIHByZXZpb3VzQ2xvc2UsXG4gICAgY3VycmVuY3k6ICdVU0QnLFxuICAgIHVwZGF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuICAgIHNvdXJjZTogJ3NhbXBsZScsXG4gIH07XG59XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gTmV3c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmNvbnN0IE5FV1NfVEVNUExBVEVTOiBBcnJheTwobmFtZTogc3RyaW5nLCBzeW06IHN0cmluZykgPT4gc3RyaW5nPiA9IFtcbiAgKG5hbWUpID0+IGAke25hbWV9IGluIGZvY3VzIGFzIGludmVzdG9ycyB3ZWlnaCB0aGUgc2VjdG9yIG91dGxvb2tgLFxuICAobmFtZSwgc3ltKSA9PiBgQW5hbHlzdHMgcmV2aXNpdCAke25hbWV9ICgke3N5bX0pIHByaWNlIHRhcmdldHMgYWZ0ZXIgcmVjZW50IG1vdmVzYCxcbiAgKG5hbWUsIHN5bSkgPT4gYFdoYXQgdGhlIGxhdGVzdCBtYXJrZXQgc3dpbmdzIG1lYW4gZm9yICR7c3ltfSBob2xkZXJzYCxcbiAgKG5hbWUpID0+IGAke25hbWV9OiB0aHJlZSB0aGluZ3MgdG8gd2F0Y2ggdGhpcyBxdWFydGVyYCxcbl07XG5cbi8qKiBEZXRlcm1pbmlzdGljIHBsYWNlaG9sZGVyIG5ld3MgZm9yIHRoZSBnaXZlbiBzeW1ib2xzIChvZmZsaW5lIG1vZGUpLiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNhbXBsZU5ld3Moc3ltYm9sczogc3RyaW5nW10sIHBlclN5bWJvbCA9IDMpOiBOZXdzSXRlbVtdIHtcbiAgY29uc3QgaXRlbXM6IE5ld3NJdGVtW10gPSBbXTtcbiAgY29uc3Qgbm93SG91ciA9IE1hdGguZmxvb3IoRGF0ZS5ub3coKSAvIDNfNjAwXzAwMCkgKiAzXzYwMF8wMDA7XG4gIGZvciAoY29uc3Qgc3ltYm9sIG9mIHN5bWJvbHMuc2xpY2UoMCwgMTIpKSB7XG4gICAgY29uc3Qgc3ltID0gc3ltYm9sLnRvVXBwZXJDYXNlKCk7XG4gICAgY29uc3Qgcm5nID0gbXVsYmVycnkzMihzdGFibGVIYXNoKGBuZXdzfCR7c3ltfWApKTtcbiAgICBjb25zdCBuYW1lID0gbG9va3VwTmFtZShzeW0pID8/IHN5bTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IE1hdGgubWluKHBlclN5bWJvbCwgTkVXU19URU1QTEFURVMubGVuZ3RoKTsgaSsrKSB7XG4gICAgICBjb25zdCBhZ2VIb3VycyA9IDIgKyBNYXRoLmZsb29yKHJuZygpICogMjApICsgaSAqIDI0O1xuICAgICAgaXRlbXMucHVzaCh7XG4gICAgICAgIGlkOiBgc2FtcGxlLSR7c3ltLnRvTG93ZXJDYXNlKCl9LSR7aX1gLFxuICAgICAgICB0aXRsZTogTkVXU19URU1QTEFURVNbaV0obmFtZSwgc3ltKSxcbiAgICAgICAgdXJsOiBgaHR0cHM6Ly9maW5hbmNlLnlhaG9vLmNvbS9xdW90ZS8ke2VuY29kZVVSSUNvbXBvbmVudChzeW0pfWAsXG4gICAgICAgIHNvdXJjZU5hbWU6ICdTYW1wbGUgRGF0YScsXG4gICAgICAgIHB1Ymxpc2hlZEF0OiBuZXcgRGF0ZShub3dIb3VyIC0gYWdlSG91cnMgKiAzXzYwMF8wMDApLnRvSVNPU3RyaW5nKCksXG4gICAgICAgIHJlbGF0ZWRTeW1ib2w6IHN5bSxcbiAgICAgICAgc3VtbWFyeTpcbiAgICAgICAgICAnT2ZmbGluZSBzYW1wbGUgaGVhZGxpbmUgXHUyMDE0IGxpdmUgbmV3cyB3YXMgdW5hdmFpbGFibGUgd2hlbiB0aGlzIHdhcyBnZW5lcmF0ZWQuJyxcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuICBpdGVtcy5zb3J0KChhLCBiKSA9PiBiLnB1Ymxpc2hlZEF0LmxvY2FsZUNvbXBhcmUoYS5wdWJsaXNoZWRBdCkpO1xuICByZXR1cm4gaXRlbXM7XG59XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gRWFybmluZ3Ncbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5leHBvcnQgZnVuY3Rpb24gc2FtcGxlRWFybmluZ3Moc3ltYm9sOiBzdHJpbmcpOiBFYXJuaW5nc0V2ZW50IHtcbiAgY29uc3Qgc3ltID0gc3ltYm9sLnRvVXBwZXJDYXNlKCk7XG4gIGNvbnN0IGhhc2ggPSBzdGFibGVIYXNoKHN5bSk7XG4gIGNvbnN0IGRheXNPdXQgPSAoaGFzaCAlIDI4KSArIDI7XG4gIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZSgpO1xuICBkYXRlLnNldFVUQ0hvdXJzKDAsIDAsIDAsIDApO1xuICBkYXRlLnNldFVUQ0RhdGUoZGF0ZS5nZXRVVENEYXRlKCkgKyBkYXlzT3V0KTtcbiAgcmV0dXJuIHtcbiAgICBzeW1ib2w6IHN5bSxcbiAgICBjb21wYW55TmFtZTogbG9va3VwTmFtZShzeW0pID8/IHN5bSxcbiAgICBkYXRlOiB0b1ltZChkYXRlKSxcbiAgICB0aW1lOiBoYXNoICUgMiA9PT0gMCA/ICdibW8nIDogJ2FtYycsXG4gICAgZXBzRXN0aW1hdGU6IE1hdGgucm91bmQoKCgoaGFzaCAlIDQ1MCkgLyAxMDApICsgMC40KSAqIDEwMCkgLyAxMDAsXG4gICAgZXBzQWN0dWFsOiBNYXRoLnJvdW5kKCgoKGhhc2ggJSA0NzApIC8gMTAwKSArIDAuMzUpICogMTAwKSAvIDEwMCxcbiAgICBlcHNTdXJwcmlzZVBlcmNlbnQ6IE1hdGgucm91bmQoKCgoaGFzaCAlIDIxKSAtIDgpIC8gMTAwKSAqIDEwMDApIC8gMTAsXG4gICAgbGF0ZXN0UmVwb3J0ZWREYXRlOiB0b1ltZChuZXcgRGF0ZShEYXRlLm5vdygpIC0gOTAgKiA4Nl80MDBfMDAwKSksXG4gICAgc291cmNlOiAnc2FtcGxlJyxcbiAgfTtcbn1cbiIsICIvLyBUaW55IGluLW1lbW9yeSBUVEwgY2FjaGUuIFVzZWQgYnkgaHR0cC50cyAoa2V5ZWQgYnkgVVJMKSBhbmQgYnkgc2VydmljZXNcbi8vIHRoYXQgY2FjaGUgZGVyaXZlZCByZXN1bHRzIChob2xkaW5ncywgZWFybmluZ3MpIGtleWVkIGJ5IHN5bWJvbC5cbi8vIEZhaWx1cmVzIGFyZSBuZXZlciBzdG9yZWQgaGVyZSBcdTIwMTQgY2FsbGVycyBvbmx5IHNldCgpIG9uIHN1Y2Nlc3MuXG5cbmludGVyZmFjZSBFbnRyeTxWPiB7XG4gIGV4cGlyZXM6IG51bWJlcjsgLy8gZXBvY2ggbXNcbiAgdmFsdWU6IFY7XG59XG5cbmV4cG9ydCBjbGFzcyBUdGxDYWNoZTxWPiB7XG4gIHByaXZhdGUgcmVhZG9ubHkgbWFwID0gbmV3IE1hcDxzdHJpbmcsIEVudHJ5PFY+PigpO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgbWF4RW50cmllcyA9IDgwMCkge31cblxuICBnZXQoa2V5OiBzdHJpbmcpOiBWIHwgdW5kZWZpbmVkIHtcbiAgICBjb25zdCBlbnRyeSA9IHRoaXMubWFwLmdldChrZXkpO1xuICAgIGlmICghZW50cnkpIHJldHVybiB1bmRlZmluZWQ7XG4gICAgaWYgKGVudHJ5LmV4cGlyZXMgPD0gRGF0ZS5ub3coKSkge1xuICAgICAgdGhpcy5tYXAuZGVsZXRlKGtleSk7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICByZXR1cm4gZW50cnkudmFsdWU7XG4gIH1cblxuICBzZXQoa2V5OiBzdHJpbmcsIHZhbHVlOiBWLCB0dGxNczogbnVtYmVyKTogdm9pZCB7XG4gICAgaWYgKHR0bE1zIDw9IDApIHJldHVybjtcbiAgICBpZiAodGhpcy5tYXAuc2l6ZSA+PSB0aGlzLm1heEVudHJpZXMpIHRoaXMucHJ1bmUoKTtcbiAgICB0aGlzLm1hcC5zZXQoa2V5LCB7IGV4cGlyZXM6IERhdGUubm93KCkgKyB0dGxNcywgdmFsdWUgfSk7XG4gIH1cblxuICBkZWxldGUoa2V5OiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0aGlzLm1hcC5kZWxldGUoa2V5KTtcbiAgfVxuXG4gIHByaXZhdGUgcHJ1bmUoKTogdm9pZCB7XG4gICAgY29uc3Qgbm93ID0gRGF0ZS5ub3coKTtcbiAgICBmb3IgKGNvbnN0IFtrZXksIGVudHJ5XSBvZiB0aGlzLm1hcCkge1xuICAgICAgaWYgKGVudHJ5LmV4cGlyZXMgPD0gbm93KSB0aGlzLm1hcC5kZWxldGUoa2V5KTtcbiAgICB9XG4gICAgLy8gU3RpbGwgb3ZlciBidWRnZXQgKG5vdGhpbmcgZXhwaXJlZCk/IERyb3Agb2xkZXN0LWluc2VydGVkIGVudHJpZXMuXG4gICAgd2hpbGUgKHRoaXMubWFwLnNpemUgPj0gdGhpcy5tYXhFbnRyaWVzKSB7XG4gICAgICBjb25zdCBvbGRlc3QgPSB0aGlzLm1hcC5rZXlzKCkubmV4dCgpO1xuICAgICAgaWYgKG9sZGVzdC5kb25lKSBicmVhaztcbiAgICAgIHRoaXMubWFwLmRlbGV0ZShvbGRlc3QudmFsdWUpO1xuICAgIH1cbiAgfVxufVxuIiwgIi8vIEhUVFAgbGF5ZXIgdXNlZCBieSBldmVyeSBkYXRhIHNlcnZpY2UuXG4vLyAgLSBCcm93c2VyIFVzZXItQWdlbnQgb24gYWxsIHJlcXVlc3RzIChZYWhvbyA0MjlzIHdpdGhvdXQgaXQpLlxuLy8gIC0gMTJzIHRpbWVvdXQgdmlhIEFib3J0U2lnbmFsLnRpbWVvdXQuXG4vLyAgLSBVcCB0byAyIHJldHJpZXMgd2l0aCBiYWNrb2ZmOyA0eHggKGV4Y2VwdCA0MjkpIGlzIG5vdCByZXRyaWVkLlxuLy8gIC0gUGVyLWhvc3QgY29uY3VycmVuY3kgbGltaXRlcjogbWF4IDQgaW4gZmxpZ2h0IHBlciBob3N0LCBhbmQgfjI1MG1zXG4vLyAgICBzcGFjaW5nIGJldHdlZW4gcmVxdWVzdCBzdGFydHMgZm9yIHF1ZXJ5MS5maW5hbmNlLnlhaG9vLmNvbS5cbi8vICAtIEluLW1lbW9yeSBUVEwgY2FjaGUga2V5ZWQgYnkgVVJMIChjYWxsZXIgZGVjaWRlcyB0aGUgVFRMKS5cbi8vICAgIEZhaWx1cmVzIGFyZSBORVZFUiBjYWNoZWQuIElkZW50aWNhbCBpbi1mbGlnaHQgR0VUcyBhcmUgY29hbGVzY2VkLlxuXG5pbXBvcnQgeyBUdGxDYWNoZSB9IGZyb20gJy4vY2FjaGUnO1xuaW1wb3J0IHsgc2xlZXAgfSBmcm9tICcuL3V0aWwnO1xuXG5leHBvcnQgY29uc3QgQlJPV1NFUl9VQSA9XG4gICdNb3ppbGxhLzUuMCAoV2luZG93cyBOVCAxMC4wOyBXaW42NDsgeDY0KSBBcHBsZVdlYktpdC81MzcuMzYgKEtIVE1MLCBsaWtlIEdlY2tvKSBDaHJvbWUvMTI2LjAuMC4wIFNhZmFyaS81MzcuMzYnO1xuXG5leHBvcnQgY2xhc3MgSHR0cEVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICBjb25zdHJ1Y3RvcihcbiAgICBtZXNzYWdlOiBzdHJpbmcsXG4gICAgcHVibGljIHJlYWRvbmx5IHN0YXR1cz86IG51bWJlcixcbiAgKSB7XG4gICAgc3VwZXIobWVzc2FnZSk7XG4gICAgdGhpcy5uYW1lID0gJ0h0dHBFcnJvcic7XG4gIH1cbn1cblxuZXhwb3J0IGludGVyZmFjZSBGZXRjaE9wdGlvbnMge1xuICAvKiogQ2FjaGUgVFRMIGluIG1zOyAwIChkZWZhdWx0KSBkaXNhYmxlcyBjYWNoaW5nIGZvciB0aGlzIGNhbGwuICovXG4gIHR0bE1zPzogbnVtYmVyO1xuICAvKiogUGVyLWF0dGVtcHQgdGltZW91dCBpbiBtcy4gKi9cbiAgdGltZW91dE1zPzogbnVtYmVyO1xuICAvKiogRXh0cmEgaGVhZGVycyBtZXJnZWQgb3ZlciB0aGUgZGVmYXVsdCBVc2VyLUFnZW50LiAqL1xuICBoZWFkZXJzPzogUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcbn1cblxuY29uc3QgREVGQVVMVF9USU1FT1VUX01TID0gMTJfMDAwO1xuY29uc3QgTUFYX0FUVEVNUFRTID0gMzsgLy8gMSBpbml0aWFsICsgMiByZXRyaWVzXG5jb25zdCBSRVRSWV9ERUxBWVNfTVMgPSBbNTAwLCAxNDAwXTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBQZXItaG9zdCBsaW1pdGVyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuY2xhc3MgSG9zdExpbWl0ZXIge1xuICBwcml2YXRlIGFjdGl2ZSA9IDA7XG4gIHByaXZhdGUgbmV4dFNsb3QgPSAwO1xuICBwcml2YXRlIHJlYWRvbmx5IHdhaXRpbmc6IEFycmF5PCgpID0+IHZvaWQ+ID0gW107XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSByZWFkb25seSBtYXhDb25jdXJyZW50OiBudW1iZXIsXG4gICAgcHJpdmF0ZSByZWFkb25seSBzcGFjaW5nTXM6IG51bWJlcixcbiAgKSB7fVxuXG4gIGFzeW5jIHJ1bjxUPihmbjogKCkgPT4gUHJvbWlzZTxUPik6IFByb21pc2U8VD4ge1xuICAgIGF3YWl0IHRoaXMuYWNxdWlyZSgpO1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gYXdhaXQgZm4oKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgdGhpcy5yZWxlYXNlKCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBhY3F1aXJlKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgY29uc3QgYXR0ZW1wdCA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgaWYgKHRoaXMuYWN0aXZlID49IHRoaXMubWF4Q29uY3VycmVudCkge1xuICAgICAgICAgIHRoaXMud2FpdGluZy5wdXNoKGF0dGVtcHQpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBub3cgPSBEYXRlLm5vdygpO1xuICAgICAgICBjb25zdCB3YWl0ID0gdGhpcy5uZXh0U2xvdCAtIG5vdztcbiAgICAgICAgaWYgKHdhaXQgPiAwKSB7XG4gICAgICAgICAgc2V0VGltZW91dChhdHRlbXB0LCB3YWl0KTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5hY3RpdmUrKztcbiAgICAgICAgdGhpcy5uZXh0U2xvdCA9IG5vdyArIHRoaXMuc3BhY2luZ01zO1xuICAgICAgICByZXNvbHZlKCk7XG4gICAgICB9O1xuICAgICAgYXR0ZW1wdCgpO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSByZWxlYXNlKCk6IHZvaWQge1xuICAgIHRoaXMuYWN0aXZlLS07XG4gICAgY29uc3QgbmV4dCA9IHRoaXMud2FpdGluZy5zaGlmdCgpO1xuICAgIGlmIChuZXh0KSBuZXh0KCk7XG4gIH1cbn1cblxuY29uc3QgbGltaXRlcnMgPSBuZXcgTWFwPHN0cmluZywgSG9zdExpbWl0ZXI+KCk7XG5cbmZ1bmN0aW9uIGxpbWl0ZXJGb3IoaG9zdDogc3RyaW5nKTogSG9zdExpbWl0ZXIge1xuICBsZXQgbGltaXRlciA9IGxpbWl0ZXJzLmdldChob3N0KTtcbiAgaWYgKCFsaW1pdGVyKSB7XG4gICAgY29uc3Qgc3BhY2luZyA9IGhvc3QgPT09ICdxdWVyeTEuZmluYW5jZS55YWhvby5jb20nID8gMjUwIDogMDtcbiAgICBsaW1pdGVyID0gbmV3IEhvc3RMaW1pdGVyKDQsIHNwYWNpbmcpO1xuICAgIGxpbWl0ZXJzLnNldChob3N0LCBsaW1pdGVyKTtcbiAgfVxuICByZXR1cm4gbGltaXRlcjtcbn1cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBDYWNoZSArIGluLWZsaWdodCBjb2FsZXNjaW5nIChzdWNjZXNzZnVsIHRleHQgYm9kaWVzIG9ubHkpXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuY29uc3QgYm9keUNhY2hlID0gbmV3IFR0bENhY2hlPHN0cmluZz4oNjAwKTtcbmNvbnN0IGluRmxpZ2h0ID0gbmV3IE1hcDxzdHJpbmcsIFByb21pc2U8c3RyaW5nPj4oKTtcblxuYXN5bmMgZnVuY3Rpb24gZG9GZXRjaChcbiAgdXJsOiBzdHJpbmcsXG4gIGhvc3Q6IHN0cmluZyxcbiAgaGVhZGVyczogUmVjb3JkPHN0cmluZywgc3RyaW5nPiB8IHVuZGVmaW5lZCxcbiAgdGltZW91dE1zOiBudW1iZXIsXG4pOiBQcm9taXNlPHN0cmluZz4ge1xuICBjb25zdCByZXMgPSBhd2FpdCBmZXRjaCh1cmwsIHtcbiAgICBoZWFkZXJzOiB7ICdVc2VyLUFnZW50JzogQlJPV1NFUl9VQSwgLi4uaGVhZGVycyB9LFxuICAgIHJlZGlyZWN0OiAnZm9sbG93JyxcbiAgICBzaWduYWw6IEFib3J0U2lnbmFsLnRpbWVvdXQodGltZW91dE1zKSxcbiAgfSk7XG4gIGlmICghcmVzLm9rKSB7XG4gICAgdGhyb3cgbmV3IEh0dHBFcnJvcihgSFRUUCAke3Jlcy5zdGF0dXN9IGZyb20gJHtob3N0fWAsIHJlcy5zdGF0dXMpO1xuICB9XG4gIHJldHVybiByZXMudGV4dCgpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBmZXRjaFdpdGhSZXRyeShcbiAgdXJsOiBzdHJpbmcsXG4gIGhlYWRlcnM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gfCB1bmRlZmluZWQsXG4gIHRpbWVvdXRNczogbnVtYmVyLFxuKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgY29uc3QgaG9zdCA9IG5ldyBVUkwodXJsKS5ob3N0bmFtZTtcbiAgbGV0IGxhc3RFcnI6IHVua25vd247XG4gIGZvciAobGV0IGF0dGVtcHQgPSAwOyBhdHRlbXB0IDwgTUFYX0FUVEVNUFRTOyBhdHRlbXB0KyspIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIGF3YWl0IGxpbWl0ZXJGb3IoaG9zdCkucnVuKCgpID0+IGRvRmV0Y2godXJsLCBob3N0LCBoZWFkZXJzLCB0aW1lb3V0TXMpKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIGxhc3RFcnIgPSBlcnI7XG4gICAgICBjb25zdCBzdGF0dXMgPSBlcnIgaW5zdGFuY2VvZiBIdHRwRXJyb3IgPyBlcnIuc3RhdHVzIDogdW5kZWZpbmVkO1xuICAgICAgY29uc3QgcmV0cnlhYmxlID1cbiAgICAgICAgc3RhdHVzID09PSB1bmRlZmluZWQgfHwgc3RhdHVzID09PSA0MjkgfHwgc3RhdHVzID49IDUwMDtcbiAgICAgIGlmICghcmV0cnlhYmxlIHx8IGF0dGVtcHQgPT09IE1BWF9BVFRFTVBUUyAtIDEpIHRocm93IGVycjtcbiAgICAgIGF3YWl0IHNsZWVwKFJFVFJZX0RFTEFZU19NU1thdHRlbXB0XSA/PyAxNTAwKTtcbiAgICB9XG4gIH1cbiAgLy8gVW5yZWFjaGFibGUsIGJ1dCBrZWVwcyBUUyBoYXBweS5cbiAgdGhyb3cgbGFzdEVyciBpbnN0YW5jZW9mIEVycm9yID8gbGFzdEVyciA6IG5ldyBFcnJvcihgZmV0Y2ggZmFpbGVkOiAke3VybH1gKTtcbn1cblxuLyoqIEZldGNoIGEgVVJMIGFzIHRleHQsIGhvbm9yaW5nIHRoZSBUVEwgY2FjaGUgYW5kIHBlci1ob3N0IGxpbWl0cy4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBmZXRjaFRleHQodXJsOiBzdHJpbmcsIG9wdHM6IEZldGNoT3B0aW9ucyA9IHt9KTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgY29uc3QgdHRsTXMgPSBvcHRzLnR0bE1zID8/IDA7XG4gIGNvbnN0IHRpbWVvdXRNcyA9IG9wdHMudGltZW91dE1zID8/IERFRkFVTFRfVElNRU9VVF9NUztcblxuICBpZiAodHRsTXMgPiAwKSB7XG4gICAgY29uc3QgY2FjaGVkID0gYm9keUNhY2hlLmdldCh1cmwpO1xuICAgIGlmIChjYWNoZWQgIT09IHVuZGVmaW5lZCkgcmV0dXJuIGNhY2hlZDtcbiAgICBjb25zdCBwZW5kaW5nID0gaW5GbGlnaHQuZ2V0KHVybCk7XG4gICAgaWYgKHBlbmRpbmcpIHJldHVybiBwZW5kaW5nO1xuICB9XG5cbiAgY29uc3QgcHJvbWlzZSA9IGZldGNoV2l0aFJldHJ5KHVybCwgb3B0cy5oZWFkZXJzLCB0aW1lb3V0TXMpXG4gICAgLnRoZW4oKGJvZHkpID0+IHtcbiAgICAgIGlmICh0dGxNcyA+IDApIGJvZHlDYWNoZS5zZXQodXJsLCBib2R5LCB0dGxNcyk7XG4gICAgICByZXR1cm4gYm9keTtcbiAgICB9KVxuICAgIC5maW5hbGx5KCgpID0+IHtcbiAgICAgIGluRmxpZ2h0LmRlbGV0ZSh1cmwpO1xuICAgIH0pO1xuXG4gIGlmICh0dGxNcyA+IDApIGluRmxpZ2h0LnNldCh1cmwsIHByb21pc2UpO1xuICByZXR1cm4gcHJvbWlzZTtcbn1cblxuLyoqIEZldGNoIGEgVVJMIGFuZCBKU09OLnBhcnNlIHRoZSBib2R5LiBUIGRlc2NyaWJlcyB0aGUgZXhwZWN0ZWQgcmF3IHNoYXBlLiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGZldGNoSnNvbjxUPih1cmw6IHN0cmluZywgb3B0czogRmV0Y2hPcHRpb25zID0ge30pOiBQcm9taXNlPFQ+IHtcbiAgY29uc3QgYm9keSA9IGF3YWl0IGZldGNoVGV4dCh1cmwsIG9wdHMpO1xuICB0cnkge1xuICAgIHJldHVybiBKU09OLnBhcnNlKGJvZHkpIGFzIFQ7XG4gIH0gY2F0Y2gge1xuICAgIC8vIEEgY2FjaGVkIGJvZHkgc2hvdWxkIG5ldmVyIGJlIHVucGFyc2VhYmxlIEpTT04gdW5sZXNzIHRoZSBlbmRwb2ludFxuICAgIC8vIHJldHVybmVkIEhUTUwgKGUuZy4gYW4gZXJyb3IgcGFnZSkgXHUyMDE0IGRvbid0IGtlZXAgc2VydmluZyBpdC5cbiAgICBib2R5Q2FjaGUuZGVsZXRlKHVybCk7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIEpTT04gZnJvbSAke25ldyBVUkwodXJsKS5ob3N0bmFtZX1gKTtcbiAgfVxufVxuIiwgIi8vIFlhaG9vIEZpbmFuY2UgY2xpZW50LiBUaGUgdjggY2hhcnQgYW5kIHYxIHNlYXJjaCBlbmRwb2ludHMgd29yayB3aXRoIGp1c3Rcbi8vIGEgYnJvd3NlciBVQS4gcXVvdGVTdW1tYXJ5ICh2MTApIHJlcXVpcmVzIGEgY29va2llICsgY3J1bWIgcGFpciwgd2hpY2ggbWF5XG4vLyBmYWlsIGF0IGFueSB0aW1lIFx1MjAxNCBjYWxsZXJzIG11c3QgZGVncmFkZSBncmFjZWZ1bGx5IHdoZW4gaXQgdGhyb3dzLlxuXG5pbXBvcnQgeyBCUk9XU0VSX1VBLCBmZXRjaEpzb24sIEh0dHBFcnJvciB9IGZyb20gJy4vaHR0cCc7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUmF3IHJlc3BvbnNlIHNoYXBlcyAodHlwZWQgYXQgdGhlIEpTT04gcGFyc2UgYm91bmRhcnk7IGZpZWxkcyBvcHRpb25hbClcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5leHBvcnQgaW50ZXJmYWNlIFlhaG9vQ2hhcnRNZXRhIHtcbiAgY3VycmVuY3k/OiBzdHJpbmcgfCBudWxsO1xuICBleGNoYW5nZU5hbWU/OiBzdHJpbmcgfCBudWxsO1xuICByZWd1bGFyTWFya2V0UHJpY2U/OiBudW1iZXIgfCBudWxsO1xuICBjaGFydFByZXZpb3VzQ2xvc2U/OiBudW1iZXIgfCBudWxsO1xuICBwcmV2aW91c0Nsb3NlPzogbnVtYmVyIHwgbnVsbDtcbiAgbWFya2V0U3RhdGU/OiBzdHJpbmcgfCBudWxsO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFlhaG9vQ2hhcnRSZXN1bHQge1xuICBtZXRhPzogWWFob29DaGFydE1ldGE7XG4gIHRpbWVzdGFtcD86IEFycmF5PG51bWJlciB8IG51bGw+O1xuICBpbmRpY2F0b3JzPzoge1xuICAgIHF1b3RlPzogQXJyYXk8e1xuICAgICAgb3Blbj86IEFycmF5PG51bWJlciB8IG51bGw+O1xuICAgICAgaGlnaD86IEFycmF5PG51bWJlciB8IG51bGw+O1xuICAgICAgbG93PzogQXJyYXk8bnVtYmVyIHwgbnVsbD47XG4gICAgICBjbG9zZT86IEFycmF5PG51bWJlciB8IG51bGw+O1xuICAgICAgdm9sdW1lPzogQXJyYXk8bnVtYmVyIHwgbnVsbD47XG4gICAgfT47XG4gIH07XG59XG5cbmludGVyZmFjZSBZYWhvb0NoYXJ0UmVzcG9uc2Uge1xuICBjaGFydD86IHtcbiAgICByZXN1bHQ/OiBZYWhvb0NoYXJ0UmVzdWx0W10gfCBudWxsO1xuICAgIGVycm9yPzogeyBjb2RlPzogc3RyaW5nOyBkZXNjcmlwdGlvbj86IHN0cmluZyB9IHwgbnVsbDtcbiAgfTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBZYWhvb1NlYXJjaFF1b3RlIHtcbiAgc3ltYm9sPzogc3RyaW5nO1xuICBzaG9ydG5hbWU/OiBzdHJpbmc7XG4gIGxvbmduYW1lPzogc3RyaW5nO1xuICBxdW90ZVR5cGU/OiBzdHJpbmc7XG4gIGV4Y2hEaXNwPzogc3RyaW5nO1xufVxuXG5pbnRlcmZhY2UgWWFob29TZWFyY2hSZXNwb25zZSB7XG4gIHF1b3Rlcz86IFlhaG9vU2VhcmNoUXVvdGVbXTtcbn1cblxuLyoqIHJhdyBudW1iZXIgfCB7cmF3OiBudW1iZXJ9IHwgZm9ybWF0dGVkLXN0cmluZyB1bmlvbnMgZnJvbSBxdW90ZVN1bW1hcnkgKi9cbmV4cG9ydCB0eXBlIFlhaG9vUmF3VmFsdWUgPVxuICB8IG51bWJlclxuICB8IHN0cmluZ1xuICB8IHsgcmF3PzogbnVtYmVyIHwgbnVsbDsgZm10Pzogc3RyaW5nIHwgbnVsbCB9XG4gIHwgbnVsbFxuICB8IHVuZGVmaW5lZDtcblxuZXhwb3J0IGludGVyZmFjZSBZYWhvb1F1b3RlU3VtbWFyeVJlc3VsdCB7XG4gIHByaWNlPzoge1xuICAgIGxvbmdOYW1lPzogc3RyaW5nIHwgbnVsbDtcbiAgICBzaG9ydE5hbWU/OiBzdHJpbmcgfCBudWxsO1xuICAgIG1hcmtldFN0YXRlPzogc3RyaW5nIHwgbnVsbDtcbiAgICByZWd1bGFyTWFya2V0UHJpY2U/OiBZYWhvb1Jhd1ZhbHVlO1xuICAgIG1hcmtldENhcD86IFlhaG9vUmF3VmFsdWU7XG4gIH07XG4gIHN1bW1hcnlEZXRhaWw/OiB7XG4gICAgdHJhaWxpbmdQRT86IFlhaG9vUmF3VmFsdWU7XG4gICAgZm9yd2FyZFBFPzogWWFob29SYXdWYWx1ZTtcbiAgICBwcmljZVRvU2FsZXNUcmFpbGluZzEyTW9udGhzPzogWWFob29SYXdWYWx1ZTtcbiAgICBwcmljZVRvQm9vaz86IFlhaG9vUmF3VmFsdWU7XG4gIH07XG4gIGRlZmF1bHRLZXlTdGF0aXN0aWNzPzoge1xuICAgIGVudGVycHJpc2VWYWx1ZT86IFlhaG9vUmF3VmFsdWU7XG4gICAgZW50ZXJwcmlzZVRvUmV2ZW51ZT86IFlhaG9vUmF3VmFsdWU7XG4gICAgZW50ZXJwcmlzZVRvRWJpdGRhPzogWWFob29SYXdWYWx1ZTtcbiAgICBmb3J3YXJkRXBzPzogWWFob29SYXdWYWx1ZTtcbiAgICBzaGFyZXNPdXRzdGFuZGluZz86IFlhaG9vUmF3VmFsdWU7XG4gIH07XG4gIGZpbmFuY2lhbERhdGE/OiB7XG4gICAgdG90YWxSZXZlbnVlPzogWWFob29SYXdWYWx1ZTtcbiAgICBncm9zc1Byb2ZpdHM/OiBZYWhvb1Jhd1ZhbHVlO1xuICAgIGViaXRkYT86IFlhaG9vUmF3VmFsdWU7XG4gICAgbmV0SW5jb21lVG9Db21tb24/OiBZYWhvb1Jhd1ZhbHVlO1xuICAgIHByb2ZpdE1hcmdpbnM/OiBZYWhvb1Jhd1ZhbHVlO1xuICAgIHJldmVudWVHcm93dGg/OiBZYWhvb1Jhd1ZhbHVlO1xuICAgIHRhcmdldE1lYW5QcmljZT86IFlhaG9vUmF3VmFsdWU7XG4gIH07XG4gIGVhcm5pbmdzSGlzdG9yeT86IHtcbiAgICBoaXN0b3J5PzogQXJyYXk8e1xuICAgICAgcXVhcnRlcj86IFlhaG9vUmF3VmFsdWU7XG4gICAgICBlcHNBY3R1YWw/OiBZYWhvb1Jhd1ZhbHVlO1xuICAgICAgZXBzRXN0aW1hdGU/OiBZYWhvb1Jhd1ZhbHVlO1xuICAgICAgc3VycHJpc2VQZXJjZW50PzogWWFob29SYXdWYWx1ZTtcbiAgICB9PjtcbiAgfTtcbiAgdG9wSG9sZGluZ3M/OiB7XG4gICAgaG9sZGluZ3M/OiBBcnJheTx7XG4gICAgICBzeW1ib2w/OiBzdHJpbmc7XG4gICAgICBob2xkaW5nTmFtZT86IHN0cmluZztcbiAgICAgIGhvbGRpbmdQZXJjZW50PzogWWFob29SYXdWYWx1ZTtcbiAgICB9PjtcbiAgfTtcbiAgY2FsZW5kYXJFdmVudHM/OiB7XG4gICAgZWFybmluZ3M/OiB7XG4gICAgICBlYXJuaW5nc0RhdGU/OiBZYWhvb1Jhd1ZhbHVlW107XG4gICAgICBlYXJuaW5nc0F2ZXJhZ2U/OiBZYWhvb1Jhd1ZhbHVlO1xuICAgICAgZWFybmluZ3NDYWxsVGltZT86IHN0cmluZyB8IG51bGw7XG4gICAgICBjYWxsVGltZT86IHN0cmluZyB8IG51bGw7XG4gICAgICBpc0Vhcm5pbmdzRGF0ZUVzdGltYXRlPzogWWFob29SYXdWYWx1ZSB8IGJvb2xlYW47XG4gICAgfTtcbiAgfTtcbn1cblxuaW50ZXJmYWNlIFlhaG9vUXVvdGVTdW1tYXJ5UmVzcG9uc2Uge1xuICBxdW90ZVN1bW1hcnk/OiB7XG4gICAgcmVzdWx0PzogWWFob29RdW90ZVN1bW1hcnlSZXN1bHRbXSB8IG51bGw7XG4gICAgZXJyb3I/OiB7IGNvZGU/OiBzdHJpbmc7IGRlc2NyaXB0aW9uPzogc3RyaW5nIH0gfCBudWxsO1xuICB9O1xufVxuXG4vKiogQ29lcmNlIFlhaG9vJ3MgbnVtYmVyIHwge3Jhd30gdW5pb25zIHRvIGEgZmluaXRlIG51bWJlciBvciBudWxsLiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJhd051bWJlcih2YWx1ZTogWWFob29SYXdWYWx1ZSk6IG51bWJlciB8IG51bGwge1xuICBpZiAodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyAmJiBOdW1iZXIuaXNGaW5pdGUodmFsdWUpKSByZXR1cm4gdmFsdWU7XG4gIGlmICh2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnKSB7XG4gICAgY29uc3QgcmF3ID0gdmFsdWUucmF3O1xuICAgIGlmICh0eXBlb2YgcmF3ID09PSAnbnVtYmVyJyAmJiBOdW1iZXIuaXNGaW5pdGUocmF3KSkgcmV0dXJuIHJhdztcbiAgfVxuICByZXR1cm4gbnVsbDtcbn1cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBDaGFydCArIHNlYXJjaCAobm8gYXV0aClcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZmV0Y2hZYWhvb0NoYXJ0KFxuICBzeW1ib2w6IHN0cmluZyxcbiAgeWFob29SYW5nZTogc3RyaW5nLFxuICBpbnRlcnZhbDogc3RyaW5nLFxuICB0dGxNczogbnVtYmVyLFxuKTogUHJvbWlzZTxZYWhvb0NoYXJ0UmVzdWx0PiB7XG4gIGNvbnN0IHVybCA9XG4gICAgYGh0dHBzOi8vcXVlcnkxLmZpbmFuY2UueWFob28uY29tL3Y4L2ZpbmFuY2UvY2hhcnQvJHtlbmNvZGVVUklDb21wb25lbnQoc3ltYm9sKX1gICtcbiAgICBgP3JhbmdlPSR7ZW5jb2RlVVJJQ29tcG9uZW50KHlhaG9vUmFuZ2UpfSZpbnRlcnZhbD0ke2VuY29kZVVSSUNvbXBvbmVudChpbnRlcnZhbCl9JmluY2x1ZGVQcmVQb3N0PWZhbHNlYDtcbiAgY29uc3QganNvbiA9IGF3YWl0IGZldGNoSnNvbjxZYWhvb0NoYXJ0UmVzcG9uc2U+KHVybCwgeyB0dGxNcyB9KTtcbiAgY29uc3QgcmVzdWx0ID0ganNvbi5jaGFydD8ucmVzdWx0Py5bMF07XG4gIGlmICghcmVzdWx0IHx8ICFyZXN1bHQubWV0YSkge1xuICAgIGNvbnN0IGRlc2MgPSBqc29uLmNoYXJ0Py5lcnJvcj8uZGVzY3JpcHRpb24gPz8gJ2VtcHR5IGNoYXJ0IHJlc3VsdCc7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBZYWhvbyBjaGFydCBmYWlsZWQgZm9yICR7c3ltYm9sfTogJHtkZXNjfWApO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzZWFyY2hZYWhvbyhxdWVyeTogc3RyaW5nKTogUHJvbWlzZTxZYWhvb1NlYXJjaFF1b3RlW10+IHtcbiAgY29uc3QgdXJsID1cbiAgICBgaHR0cHM6Ly9xdWVyeTEuZmluYW5jZS55YWhvby5jb20vdjEvZmluYW5jZS9zZWFyY2hgICtcbiAgICBgP3E9JHtlbmNvZGVVUklDb21wb25lbnQocXVlcnkpfSZxdW90ZXNDb3VudD04Jm5ld3NDb3VudD0wYDtcbiAgY29uc3QganNvbiA9IGF3YWl0IGZldGNoSnNvbjxZYWhvb1NlYXJjaFJlc3BvbnNlPih1cmwsIHsgdHRsTXM6IDEwICogNjBfMDAwIH0pO1xuICByZXR1cm4gQXJyYXkuaXNBcnJheShqc29uLnF1b3RlcykgPyBqc29uLnF1b3RlcyA6IFtdO1xufVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIENvb2tpZSArIGNydW1iIChuZWVkZWQgZm9yIHF1b3RlU3VtbWFyeTsgdW52ZXJpZmllZCBlbmRwb2ludCBcdTIwMTQgbWF5IGZhaWwpXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuaW50ZXJmYWNlIENydW1iU3RhdGUge1xuICBjb29raWU6IHN0cmluZztcbiAgY3J1bWI6IHN0cmluZztcbiAgZmV0Y2hlZEF0OiBudW1iZXI7XG59XG5cbmNvbnN0IENSVU1CX1RUTF9NUyA9IDMwICogNjBfMDAwO1xubGV0IGNydW1iU3RhdGU6IENydW1iU3RhdGUgfCBudWxsID0gbnVsbDtcbmxldCBjcnVtYlByb21pc2U6IFByb21pc2U8Q3J1bWJTdGF0ZT4gfCBudWxsID0gbnVsbDtcblxuZnVuY3Rpb24gaW52YWxpZGF0ZUNydW1iKCk6IHZvaWQge1xuICBjcnVtYlN0YXRlID0gbnVsbDtcbn1cblxuYXN5bmMgZnVuY3Rpb24gZmV0Y2hDb29raWUoKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgLy8gZmMueWFob28uY29tIHR5cGljYWxseSA0MDRzIFx1MjAxNCB3ZSBvbmx5IHdhbnQgaXRzIFNldC1Db29raWUgaGVhZGVyLlxuICBjb25zdCByZXMgPSBhd2FpdCBmZXRjaCgnaHR0cHM6Ly9mYy55YWhvby5jb20vJywge1xuICAgIGhlYWRlcnM6IHsgJ1VzZXItQWdlbnQnOiBCUk9XU0VSX1VBIH0sXG4gICAgcmVkaXJlY3Q6ICdtYW51YWwnLFxuICAgIHNpZ25hbDogQWJvcnRTaWduYWwudGltZW91dCgxMl8wMDApLFxuICB9KTtcbiAgbGV0IGNvb2tpZXM6IHN0cmluZ1tdID0gW107XG4gIHRyeSB7XG4gICAgY29va2llcyA9IHJlcy5oZWFkZXJzLmdldFNldENvb2tpZSgpO1xuICB9IGNhdGNoIHtcbiAgICAvKiBvbGRlciBydW50aW1lcyAqL1xuICB9XG4gIGlmIChjb29raWVzLmxlbmd0aCA9PT0gMCkge1xuICAgIGNvbnN0IHNpbmdsZSA9IHJlcy5oZWFkZXJzLmdldCgnc2V0LWNvb2tpZScpO1xuICAgIGlmIChzaW5nbGUpIGNvb2tpZXMgPSBbc2luZ2xlXTtcbiAgfVxuICBjb25zdCBwYXJ0cyA9IGNvb2tpZXNcbiAgICAubWFwKChjKSA9PiBjLnNwbGl0KCc7JylbMF0udHJpbSgpKVxuICAgIC5maWx0ZXIoKGMpID0+IGMuaW5jbHVkZXMoJz0nKSk7XG4gIGlmIChwYXJ0cy5sZW5ndGggPT09IDApIHRocm93IG5ldyBFcnJvcignWWFob28gcmV0dXJuZWQgbm8gY29va2llJyk7XG4gIHJldHVybiBwYXJ0cy5qb2luKCc7ICcpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBmZXRjaENydW1iU3RhdGUoKTogUHJvbWlzZTxDcnVtYlN0YXRlPiB7XG4gIGNvbnN0IGNvb2tpZSA9IGF3YWl0IGZldGNoQ29va2llKCk7XG4gIGNvbnN0IHJlcyA9IGF3YWl0IGZldGNoKCdodHRwczovL3F1ZXJ5MS5maW5hbmNlLnlhaG9vLmNvbS92MS90ZXN0L2dldGNydW1iJywge1xuICAgIGhlYWRlcnM6IHsgJ1VzZXItQWdlbnQnOiBCUk9XU0VSX1VBLCBDb29raWU6IGNvb2tpZSB9LFxuICAgIHNpZ25hbDogQWJvcnRTaWduYWwudGltZW91dCgxMl8wMDApLFxuICB9KTtcbiAgaWYgKCFyZXMub2spIHRocm93IG5ldyBIdHRwRXJyb3IoYGdldGNydW1iIEhUVFAgJHtyZXMuc3RhdHVzfWAsIHJlcy5zdGF0dXMpO1xuICBjb25zdCBjcnVtYiA9IChhd2FpdCByZXMudGV4dCgpKS50cmltKCk7XG4gIGlmICghY3J1bWIgfHwgY3J1bWIubGVuZ3RoID4gNjQgfHwgY3J1bWIuaW5jbHVkZXMoJzwnKSB8fCBjcnVtYi5pbmNsdWRlcygneycpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdZYWhvbyByZXR1cm5lZCBhbiBpbnZhbGlkIGNydW1iJyk7XG4gIH1cbiAgcmV0dXJuIHsgY29va2llLCBjcnVtYiwgZmV0Y2hlZEF0OiBEYXRlLm5vdygpIH07XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGdldENydW1iKGZvcmNlID0gZmFsc2UpOiBQcm9taXNlPENydW1iU3RhdGU+IHtcbiAgaWYgKGZvcmNlKSBpbnZhbGlkYXRlQ3J1bWIoKTtcbiAgaWYgKGNydW1iU3RhdGUgJiYgRGF0ZS5ub3coKSAtIGNydW1iU3RhdGUuZmV0Y2hlZEF0IDwgQ1JVTUJfVFRMX01TKSB7XG4gICAgcmV0dXJuIGNydW1iU3RhdGU7XG4gIH1cbiAgaWYgKCFjcnVtYlByb21pc2UpIHtcbiAgICBjcnVtYlByb21pc2UgPSBmZXRjaENydW1iU3RhdGUoKVxuICAgICAgLnRoZW4oKHN0YXRlKSA9PiB7XG4gICAgICAgIGNydW1iU3RhdGUgPSBzdGF0ZTtcbiAgICAgICAgcmV0dXJuIHN0YXRlO1xuICAgICAgfSlcbiAgICAgIC5maW5hbGx5KCgpID0+IHtcbiAgICAgICAgY3J1bWJQcm9taXNlID0gbnVsbDtcbiAgICAgIH0pO1xuICB9XG4gIHJldHVybiBjcnVtYlByb21pc2U7XG59XG5cbi8qKlxuICogRmV0Y2ggcXVvdGVTdW1tYXJ5IG1vZHVsZXMgZm9yIGEgc3ltYm9sLiBUaHJvd3Mgb24gYW55IGZhaWx1cmUgXHUyMDE0IGNhbGxlcnNcbiAqIGZhbGwgYmFjayB0byBidW5kbGVkL3NhbXBsZSBkYXRhLiBSZXN1bHRzIGFyZSBOT1QgY2FjaGVkIGhlcmUgKHNlcnZpY2VzXG4gKiBrZWVwIHRoZWlyIG93biBsb25nZXItbGl2ZWQgY2FjaGVzIGtleWVkIGJ5IHN5bWJvbCkuXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBxdW90ZVN1bW1hcnkoXG4gIHN5bWJvbDogc3RyaW5nLFxuICBtb2R1bGVzOiBzdHJpbmdbXSxcbik6IFByb21pc2U8WWFob29RdW90ZVN1bW1hcnlSZXN1bHQ+IHtcbiAgbGV0IGxhc3RFcnI6IHVua25vd247XG4gIGZvciAobGV0IGF0dGVtcHQgPSAwOyBhdHRlbXB0IDwgMjsgYXR0ZW1wdCsrKSB7XG4gICAgY29uc3QgeyBjb29raWUsIGNydW1iIH0gPSBhd2FpdCBnZXRDcnVtYihhdHRlbXB0ID4gMCk7XG4gICAgY29uc3QgdXJsID1cbiAgICAgIGBodHRwczovL3F1ZXJ5MS5maW5hbmNlLnlhaG9vLmNvbS92MTAvZmluYW5jZS9xdW90ZVN1bW1hcnkvJHtlbmNvZGVVUklDb21wb25lbnQoc3ltYm9sKX1gICtcbiAgICAgIGA/bW9kdWxlcz0ke2VuY29kZVVSSUNvbXBvbmVudChtb2R1bGVzLmpvaW4oJywnKSl9JmNydW1iPSR7ZW5jb2RlVVJJQ29tcG9uZW50KGNydW1iKX1gO1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBqc29uID0gYXdhaXQgZmV0Y2hKc29uPFlhaG9vUXVvdGVTdW1tYXJ5UmVzcG9uc2U+KHVybCwge1xuICAgICAgICB0dGxNczogMCxcbiAgICAgICAgaGVhZGVyczogeyBDb29raWU6IGNvb2tpZSB9LFxuICAgICAgfSk7XG4gICAgICBjb25zdCByZXN1bHQgPSBqc29uLnF1b3RlU3VtbWFyeT8ucmVzdWx0Py5bMF07XG4gICAgICBpZiAoIXJlc3VsdCkge1xuICAgICAgICBjb25zdCBkZXNjID0ganNvbi5xdW90ZVN1bW1hcnk/LmVycm9yPy5kZXNjcmlwdGlvbiA/PyAnZW1wdHkgcmVzdWx0JztcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBxdW90ZVN1bW1hcnkgZmFpbGVkIGZvciAke3N5bWJvbH06ICR7ZGVzY31gKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBsYXN0RXJyID0gZXJyO1xuICAgICAgY29uc3Qgc3RhdHVzID0gZXJyIGluc3RhbmNlb2YgSHR0cEVycm9yID8gZXJyLnN0YXR1cyA6IHVuZGVmaW5lZDtcbiAgICAgIGlmICgoc3RhdHVzID09PSA0MDEgfHwgc3RhdHVzID09PSA0MDMpICYmIGF0dGVtcHQgPT09IDApIHtcbiAgICAgICAgaW52YWxpZGF0ZUNydW1iKCk7XG4gICAgICAgIGNvbnRpbnVlOyAvLyBvbmUgcmV0cnkgd2l0aCBhIGZyZXNoIGNydW1iXG4gICAgICB9XG4gICAgICB0aHJvdyBlcnI7XG4gICAgfVxuICB9XG4gIHRocm93IGxhc3RFcnIgaW5zdGFuY2VvZiBFcnJvciA/IGxhc3RFcnIgOiBuZXcgRXJyb3IoYHF1b3RlU3VtbWFyeSBmYWlsZWQgZm9yICR7c3ltYm9sfWApO1xufVxuIiwgIi8vIGNoYXJ0OmdldCBcdTIwMTQgY2FuZGxlcyBmcm9tIFlhaG9vJ3MgdjggY2hhcnQgZW5kcG9pbnQgd2l0aCBjbGVhbiBhc2NlbmRpbmdcbi8vIGNhbmRsZXMgKG51bGwgY2xvc2VzIHNraXBwZWQsIE9ITEMgc2FuaXR5LWNsYW1wZWQpLiBBbnkgZmFpbHVyZSBmYWxsc1xuLy8gYmFjayB0byB0aGUgZGV0ZXJtaW5pc3RpYyBzYW1wbGUgd2FsaywgZmxhZ2dlZCBzb3VyY2UgJ3NhbXBsZScuXG5cbmltcG9ydCB0eXBlIHsgQ2FuZGxlLCBDaGFydERhdGEsIENoYXJ0UmFuZ2UgfSBmcm9tICcuLi8uLi9zaGFyZWQvdHlwZXMnO1xuaW1wb3J0IHsgc2FtcGxlQ2hhcnQgfSBmcm9tICcuL3NhbXBsZSc7XG5pbXBvcnQgeyBmZXRjaFlhaG9vQ2hhcnQgfSBmcm9tICcuL3lhaG9vJztcblxuaW50ZXJmYWNlIFJhbmdlU3BlYyB7XG4gIHlhaG9vUmFuZ2U6IHN0cmluZztcbiAgaW50ZXJ2YWw6IHN0cmluZztcbiAgdHRsTXM6IG51bWJlcjtcbn1cblxuY29uc3QgSU5UUkFEQVlfVFRMID0gNjBfMDAwO1xuY29uc3QgREFJTFlfVFRMID0gMTAgKiA2MF8wMDA7XG5cbmNvbnN0IFJBTkdFX01BUDogUmVjb3JkPENoYXJ0UmFuZ2UsIFJhbmdlU3BlYz4gPSB7XG4gICcxZCc6IHsgeWFob29SYW5nZTogJzFkJywgaW50ZXJ2YWw6ICc1bScsIHR0bE1zOiBJTlRSQURBWV9UVEwgfSxcbiAgJzF3JzogeyB5YWhvb1JhbmdlOiAnNWQnLCBpbnRlcnZhbDogJzE1bScsIHR0bE1zOiBJTlRSQURBWV9UVEwgfSxcbiAgJzFtJzogeyB5YWhvb1JhbmdlOiAnMW1vJywgaW50ZXJ2YWw6ICc2MG0nLCB0dGxNczogSU5UUkFEQVlfVFRMIH0sXG4gICc2bSc6IHsgeWFob29SYW5nZTogJzZtbycsIGludGVydmFsOiAnMWQnLCB0dGxNczogREFJTFlfVFRMIH0sXG4gICcxeSc6IHsgeWFob29SYW5nZTogJzF5JywgaW50ZXJ2YWw6ICcxZCcsIHR0bE1zOiBEQUlMWV9UVEwgfSxcbiAgJzV5JzogeyB5YWhvb1JhbmdlOiAnNXknLCBpbnRlcnZhbDogJzF3aycsIHR0bE1zOiBEQUlMWV9UVEwgfSxcbiAgbWF4OiB7IHlhaG9vUmFuZ2U6ICdtYXgnLCBpbnRlcnZhbDogJzFtbycsIHR0bE1zOiBEQUlMWV9UVEwgfSxcbn07XG5cbmZ1bmN0aW9uIGlzRmluaXRlTnVtYmVyKHY6IG51bWJlciB8IG51bGwgfCB1bmRlZmluZWQpOiB2IGlzIG51bWJlciB7XG4gIHJldHVybiB0eXBlb2YgdiA9PT0gJ251bWJlcicgJiYgTnVtYmVyLmlzRmluaXRlKHYpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0Q2hhcnQoc3ltYm9sOiBzdHJpbmcsIHJhbmdlOiBDaGFydFJhbmdlKTogUHJvbWlzZTxDaGFydERhdGE+IHtcbiAgY29uc3Qgc3BlYyA9IFJBTkdFX01BUFtyYW5nZV07XG4gIHRyeSB7XG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgZmV0Y2hZYWhvb0NoYXJ0KHN5bWJvbCwgc3BlYy55YWhvb1JhbmdlLCBzcGVjLmludGVydmFsLCBzcGVjLnR0bE1zKTtcbiAgICBjb25zdCBtZXRhID0gcmVzdWx0Lm1ldGEgPz8ge307XG4gICAgY29uc3QgdGltZXN0YW1wcyA9IEFycmF5LmlzQXJyYXkocmVzdWx0LnRpbWVzdGFtcCkgPyByZXN1bHQudGltZXN0YW1wIDogW107XG4gICAgY29uc3QgcXVvdGUgPSByZXN1bHQuaW5kaWNhdG9ycz8ucXVvdGU/LlswXSA/PyB7fTtcbiAgICBjb25zdCBvcGVucyA9IHF1b3RlLm9wZW4gPz8gW107XG4gICAgY29uc3QgaGlnaHMgPSBxdW90ZS5oaWdoID8/IFtdO1xuICAgIGNvbnN0IGxvd3MgPSBxdW90ZS5sb3cgPz8gW107XG4gICAgY29uc3QgY2xvc2VzID0gcXVvdGUuY2xvc2UgPz8gW107XG4gICAgY29uc3Qgdm9sdW1lcyA9IHF1b3RlLnZvbHVtZSA/PyBbXTtcblxuICAgIGNvbnN0IGJ5U2Vjb25kID0gbmV3IE1hcDxudW1iZXIsIENhbmRsZT4oKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRpbWVzdGFtcHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IHRpbWUgPSB0aW1lc3RhbXBzW2ldO1xuICAgICAgY29uc3QgY2xvc2UgPSBjbG9zZXNbaV07XG4gICAgICBpZiAoIWlzRmluaXRlTnVtYmVyKHRpbWUpIHx8ICFpc0Zpbml0ZU51bWJlcihjbG9zZSkpIGNvbnRpbnVlO1xuICAgICAgY29uc3QgcmF3T3BlbiA9IG9wZW5zW2ldO1xuICAgICAgY29uc3QgcmF3SGlnaCA9IGhpZ2hzW2ldO1xuICAgICAgY29uc3QgcmF3TG93ID0gbG93c1tpXTtcbiAgICAgIGNvbnN0IHJhd1ZvbHVtZSA9IHZvbHVtZXNbaV07XG4gICAgICBjb25zdCBvcGVuID0gaXNGaW5pdGVOdW1iZXIocmF3T3BlbikgPyByYXdPcGVuIDogY2xvc2U7XG4gICAgICBsZXQgaGlnaCA9IGlzRmluaXRlTnVtYmVyKHJhd0hpZ2gpID8gcmF3SGlnaCA6IE1hdGgubWF4KG9wZW4sIGNsb3NlKTtcbiAgICAgIGxldCBsb3cgPSBpc0Zpbml0ZU51bWJlcihyYXdMb3cpID8gcmF3TG93IDogTWF0aC5taW4ob3BlbiwgY2xvc2UpO1xuICAgICAgaGlnaCA9IE1hdGgubWF4KGhpZ2gsIG9wZW4sIGNsb3NlKTtcbiAgICAgIGxvdyA9IE1hdGgubWluKGxvdywgb3BlbiwgY2xvc2UpO1xuICAgICAgY29uc3Qgdm9sdW1lID0gaXNGaW5pdGVOdW1iZXIocmF3Vm9sdW1lKSA/IHJhd1ZvbHVtZSA6IDA7XG4gICAgICAvLyBsYXN0IHdyaXRlIHdpbnMgZm9yIGR1cGxpY2F0ZSB0aW1lc3RhbXBzIChZYWhvbyByZXBlYXRzIHRoZSBsaXZlIGJhcilcbiAgICAgIGJ5U2Vjb25kLnNldChNYXRoLmZsb29yKHRpbWUpLCB7IHRpbWU6IE1hdGguZmxvb3IodGltZSksIG9wZW4sIGhpZ2gsIGxvdywgY2xvc2UsIHZvbHVtZSB9KTtcbiAgICB9XG5cbiAgICBjb25zdCBjYW5kbGVzID0gWy4uLmJ5U2Vjb25kLnZhbHVlcygpXS5zb3J0KChhLCBiKSA9PiBhLnRpbWUgLSBiLnRpbWUpO1xuICAgIGlmIChjYW5kbGVzLmxlbmd0aCA9PT0gMCkgdGhyb3cgbmV3IEVycm9yKGBubyB1c2FibGUgY2FuZGxlcyBmb3IgJHtzeW1ib2x9ICR7cmFuZ2V9YCk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgc3ltYm9sLFxuICAgICAgcmFuZ2UsXG4gICAgICBpbnRlcnZhbDogc3BlYy5pbnRlcnZhbCxcbiAgICAgIGNhbmRsZXMsXG4gICAgICBjdXJyZW5jeTogdHlwZW9mIG1ldGEuY3VycmVuY3kgPT09ICdzdHJpbmcnICYmIG1ldGEuY3VycmVuY3kgPyBtZXRhLmN1cnJlbmN5IDogJ1VTRCcsXG4gICAgICBleGNoYW5nZU5hbWU6XG4gICAgICAgIHR5cGVvZiBtZXRhLmV4Y2hhbmdlTmFtZSA9PT0gJ3N0cmluZycgJiYgbWV0YS5leGNoYW5nZU5hbWVcbiAgICAgICAgICA/IG1ldGEuZXhjaGFuZ2VOYW1lXG4gICAgICAgICAgOiB1bmRlZmluZWQsXG4gICAgICByZWd1bGFyTWFya2V0UHJpY2U6IGlzRmluaXRlTnVtYmVyKG1ldGEucmVndWxhck1hcmtldFByaWNlKVxuICAgICAgICA/IG1ldGEucmVndWxhck1hcmtldFByaWNlXG4gICAgICAgIDogbnVsbCxcbiAgICAgIHByZXZpb3VzQ2xvc2U6IGlzRmluaXRlTnVtYmVyKG1ldGEuY2hhcnRQcmV2aW91c0Nsb3NlKVxuICAgICAgICA/IG1ldGEuY2hhcnRQcmV2aW91c0Nsb3NlXG4gICAgICAgIDogaXNGaW5pdGVOdW1iZXIobWV0YS5wcmV2aW91c0Nsb3NlKVxuICAgICAgICAgID8gbWV0YS5wcmV2aW91c0Nsb3NlXG4gICAgICAgICAgOiBudWxsLFxuICAgICAgc291cmNlOiAnbGl2ZScsXG4gICAgfTtcbiAgfSBjYXRjaCB7XG4gICAgcmV0dXJuIHNhbXBsZUNoYXJ0KHN5bWJvbCwgcmFuZ2UpO1xuICB9XG59XG4iLCAiLy8gZWFybmluZ3M6Z2V0IFx1MjAxNCB1cGNvbWluZyBlYXJuaW5ncyBwZXIgc3ltYm9sIHZpYSBxdW90ZVN1bW1hcnlcbi8vIGNhbGVuZGFyRXZlbnRzICgrcHJpY2UgZm9yIHRoZSBjb21wYW55IG5hbWUpLiBDb29raWUvY3J1bWIgbWF5IGZhaWwgYXRcbi8vIGFueSB0aW1lOyBlYWNoIGZhaWxlZCBzeW1ib2wgZGVncmFkZXMgdG8gYSBkZXRlcm1pbmlzdGljIHNhbXBsZSBldmVudC5cblxuaW1wb3J0IHR5cGUgeyBFYXJuaW5nc0V2ZW50LCBFYXJuaW5nc1RpbWUgfSBmcm9tICcuLi8uLi9zaGFyZWQvdHlwZXMnO1xuaW1wb3J0IHsgVHRsQ2FjaGUgfSBmcm9tICcuL2NhY2hlJztcbmltcG9ydCB7IGxvb2t1cE5hbWUgfSBmcm9tICcuL2RhdGFGaWxlcyc7XG5pbXBvcnQgeyBzYW1wbGVFYXJuaW5ncyB9IGZyb20gJy4vc2FtcGxlJztcbmltcG9ydCB7IHBMaW1pdCwgdG9ZbWQgfSBmcm9tICcuL3V0aWwnO1xuaW1wb3J0IHsgcXVvdGVTdW1tYXJ5LCByYXdOdW1iZXIsIFlhaG9vUmF3VmFsdWUgfSBmcm9tICcuL3lhaG9vJztcblxuY29uc3QgTElWRV9UVExfTVMgPSA2ICogNjAgKiA2MF8wMDA7IC8vIDZoXG5jb25zdCBTQU1QTEVfVFRMX01TID0gMTAgKiA2MF8wMDA7IC8vIHJldHJ5IGxpdmUgc29vbmVyIGFmdGVyIGZhaWx1cmVzXG5jb25zdCBXSU5ET1dfREFZUyA9IDEyMDtcbmNvbnN0IGxpbWl0ID0gcExpbWl0KDMpO1xuXG4vLyBudWxsID0gbGl2ZSBzYWlkIFwibm8gdXBjb21pbmcgZWFybmluZ3NcIiAoY2FjaGVkIHNvIHdlIGRvbid0IHJlZmV0Y2gpLlxuY29uc3QgY2FjaGUgPSBuZXcgVHRsQ2FjaGU8RWFybmluZ3NFdmVudCB8IG51bGw+KDQwMCk7XG5cbmZ1bmN0aW9uIHRvRXBvY2hNcyh2YWx1ZTogWWFob29SYXdWYWx1ZSk6IG51bWJlciB8IG51bGwge1xuICBpZiAodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyAmJiBOdW1iZXIuaXNGaW5pdGUodmFsdWUpKSB7XG4gICAgcmV0dXJuIHZhbHVlID4gMWUxMiA/IHZhbHVlIDogdmFsdWUgKiAxMDAwO1xuICB9XG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgY29uc3QgbXMgPSBEYXRlLnBhcnNlKHZhbHVlKTtcbiAgICByZXR1cm4gTnVtYmVyLmlzTmFOKG1zKSA/IG51bGwgOiBtcztcbiAgfVxuICBpZiAodmFsdWUgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0Jykge1xuICAgIGNvbnN0IHJhdyA9IHZhbHVlLnJhdztcbiAgICBpZiAodHlwZW9mIHJhdyA9PT0gJ251bWJlcicgJiYgTnVtYmVyLmlzRmluaXRlKHJhdykpIHtcbiAgICAgIHJldHVybiByYXcgPiAxZTEyID8gcmF3IDogcmF3ICogMTAwMDtcbiAgICB9XG4gICAgY29uc3QgZm10ID0gdmFsdWUuZm10O1xuICAgIGlmICh0eXBlb2YgZm10ID09PSAnc3RyaW5nJykge1xuICAgICAgY29uc3QgbXMgPSBEYXRlLnBhcnNlKGZtdCk7XG4gICAgICByZXR1cm4gTnVtYmVyLmlzTmFOKG1zKSA/IG51bGwgOiBtcztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59XG5cbmZ1bmN0aW9uIGRldGVjdFRpbWUoY2FuZGlkYXRlczogQXJyYXk8c3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZD4pOiBFYXJuaW5nc1RpbWUge1xuICBmb3IgKGNvbnN0IGMgb2YgY2FuZGlkYXRlcykge1xuICAgIGlmICh0eXBlb2YgYyAhPT0gJ3N0cmluZycpIGNvbnRpbnVlO1xuICAgIGNvbnN0IHYgPSBjLnRvTG93ZXJDYXNlKCk7XG4gICAgaWYgKHYuaW5jbHVkZXMoJ2JtbycpIHx8IHYuaW5jbHVkZXMoJ2JlZm9yZScpKSByZXR1cm4gJ2Jtbyc7XG4gICAgaWYgKHYuaW5jbHVkZXMoJ2FtYycpIHx8IHYuaW5jbHVkZXMoJ2FmdGVyJykpIHJldHVybiAnYW1jJztcbiAgfVxuICByZXR1cm4gJ3Vua25vd24nO1xufVxuXG5hc3luYyBmdW5jdGlvbiBmZXRjaExpdmVFdmVudChzeW1ib2w6IHN0cmluZyk6IFByb21pc2U8RWFybmluZ3NFdmVudCB8IG51bGw+IHtcbiAgY29uc3Qgc3VtbWFyeSA9IGF3YWl0IHF1b3RlU3VtbWFyeShzeW1ib2wsIFsnY2FsZW5kYXJFdmVudHMnLCAnZWFybmluZ3NIaXN0b3J5JywgJ3ByaWNlJ10pO1xuICBjb25zdCBlYXJuaW5ncyA9IHN1bW1hcnkuY2FsZW5kYXJFdmVudHM/LmVhcm5pbmdzO1xuICBjb25zdCBsYXRlc3RIaXN0b3J5ID0gc3VtbWFyeS5lYXJuaW5nc0hpc3Rvcnk/Lmhpc3Rvcnk/LlswXTtcbiAgY29uc3QgY29tcGFueU5hbWUgPVxuICAgIHN1bW1hcnkucHJpY2U/LmxvbmdOYW1lIHx8XG4gICAgc3VtbWFyeS5wcmljZT8uc2hvcnROYW1lIHx8XG4gICAgbG9va3VwTmFtZShzeW1ib2wpIHx8XG4gICAgc3ltYm9sO1xuXG4gIGNvbnN0IGRhdGVzID0gQXJyYXkuaXNBcnJheShlYXJuaW5ncz8uZWFybmluZ3NEYXRlKSA/IGVhcm5pbmdzLmVhcm5pbmdzRGF0ZSA6IFtdO1xuICBjb25zdCBzdGFydE9mVG9kYXkgPSBEYXRlLnBhcnNlKGAke3RvWW1kKG5ldyBEYXRlKCkpfVQwMDowMDowMFpgKTtcbiAgY29uc3Qgd2luZG93RW5kID0gc3RhcnRPZlRvZGF5ICsgV0lORE9XX0RBWVMgKiA4Nl80MDBfMDAwO1xuXG4gIGxldCBuZXh0TXM6IG51bWJlciB8IG51bGwgPSBudWxsO1xuICBmb3IgKGNvbnN0IGQgb2YgZGF0ZXMpIHtcbiAgICBjb25zdCBtcyA9IHRvRXBvY2hNcyhkKTtcbiAgICBpZiAobXMgPT09IG51bGwgfHwgbXMgPCBzdGFydE9mVG9kYXkgfHwgbXMgPiB3aW5kb3dFbmQpIGNvbnRpbnVlO1xuICAgIGlmIChuZXh0TXMgPT09IG51bGwgfHwgbXMgPCBuZXh0TXMpIG5leHRNcyA9IG1zO1xuICB9XG4gIGlmIChuZXh0TXMgPT09IG51bGwpIHJldHVybiBudWxsOyAvLyBsaXZlIHN1Y2NlZWRlZCwgbm90aGluZyB1cGNvbWluZ1xuXG4gIHJldHVybiB7XG4gICAgc3ltYm9sLFxuICAgIGNvbXBhbnlOYW1lLFxuICAgIGRhdGU6IHRvWW1kKG5ldyBEYXRlKG5leHRNcykpLFxuICAgIHRpbWU6IGRldGVjdFRpbWUoW2Vhcm5pbmdzPy5lYXJuaW5nc0NhbGxUaW1lLCBlYXJuaW5ncz8uY2FsbFRpbWVdKSxcbiAgICBlcHNFc3RpbWF0ZTogcmF3TnVtYmVyKGVhcm5pbmdzPy5lYXJuaW5nc0F2ZXJhZ2UpLFxuICAgIGVwc0FjdHVhbDogcmF3TnVtYmVyKGxhdGVzdEhpc3Rvcnk/LmVwc0FjdHVhbCksXG4gICAgZXBzU3VycHJpc2VQZXJjZW50OiByYXdOdW1iZXIobGF0ZXN0SGlzdG9yeT8uc3VycHJpc2VQZXJjZW50KSxcbiAgICBsYXRlc3RSZXBvcnRlZERhdGU6XG4gICAgICBsYXRlc3RIaXN0b3J5Py5xdWFydGVyID09PSB1bmRlZmluZWRcbiAgICAgICAgPyBudWxsXG4gICAgICAgIDogKCgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG1zID0gdG9FcG9jaE1zKGxhdGVzdEhpc3RvcnkucXVhcnRlcik7XG4gICAgICAgICAgICByZXR1cm4gbXMgPT09IG51bGwgPyBudWxsIDogdG9ZbWQobmV3IERhdGUobXMpKTtcbiAgICAgICAgICB9KSgpLFxuICAgIHNvdXJjZTogJ2xpdmUnLFxuICB9O1xufVxuXG5hc3luYyBmdW5jdGlvbiBldmVudEZvcihzeW1ib2w6IHN0cmluZyk6IFByb21pc2U8RWFybmluZ3NFdmVudCB8IG51bGw+IHtcbiAgY29uc3QgY2FjaGVkID0gY2FjaGUuZ2V0KHN5bWJvbCk7XG4gIGlmIChjYWNoZWQgIT09IHVuZGVmaW5lZCkgcmV0dXJuIGNhY2hlZDtcbiAgdHJ5IHtcbiAgICBjb25zdCBldmVudCA9IGF3YWl0IGxpbWl0KCgpID0+IGZldGNoTGl2ZUV2ZW50KHN5bWJvbCkpO1xuICAgIGNhY2hlLnNldChzeW1ib2wsIGV2ZW50LCBMSVZFX1RUTF9NUyk7XG4gICAgcmV0dXJuIGV2ZW50O1xuICB9IGNhdGNoIHtcbiAgICBjb25zdCBldmVudCA9IHNhbXBsZUVhcm5pbmdzKHN5bWJvbCk7XG4gICAgY2FjaGUuc2V0KHN5bWJvbCwgZXZlbnQsIFNBTVBMRV9UVExfTVMpO1xuICAgIHJldHVybiBldmVudDtcbiAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0RWFybmluZ3Moc3ltYm9sczogc3RyaW5nW10pOiBQcm9taXNlPEVhcm5pbmdzRXZlbnRbXT4ge1xuICBjb25zdCByZXN1bHRzID0gYXdhaXQgUHJvbWlzZS5hbGwoc3ltYm9scy5tYXAoKHMpID0+IGV2ZW50Rm9yKHMpKSk7XG4gIGNvbnN0IGV2ZW50cyA9IHJlc3VsdHMuZmlsdGVyKChlKTogZSBpcyBFYXJuaW5nc0V2ZW50ID0+IGUgIT09IG51bGwpO1xuICBldmVudHMuc29ydCgoYSwgYikgPT4gYS5kYXRlLmxvY2FsZUNvbXBhcmUoYi5kYXRlKSB8fCBhLnN5bWJvbC5sb2NhbGVDb21wYXJlKGIuc3ltYm9sKSk7XG4gIHJldHVybiBldmVudHM7XG59XG4iLCAiLy8gaG9sZGluZ3M6Z2V0IFx1MjAxNCB0b3AtMjAgRVRGIGhvbGRpbmdzLiBUcmllcyB0aGUgbGl2ZSBxdW90ZVN1bW1hcnlcbi8vIHRvcEhvbGRpbmdzIG1vZHVsZSAodXN1YWxseSB0b3AgMTApIGFuZCBtZXJnZXMgaXQgb3ZlciB0aGUgYnVuZGxlZFxuLy8gc25hcHNob3QgKGxpdmUgd2VpZ2h0cyB3aW4sIGJ1bmRsZSBmaWxscyB0aGUgbGlzdCBvdXQgdG8gMjApLiBBbnlcbi8vIGZhaWx1cmUgcmV0dXJucyB0aGUgYnVuZGxlZCBkYXRhIGZsYWdnZWQgJ3NhbXBsZScuXG5cbmltcG9ydCB0eXBlIHsgSG9sZGluZywgSG9sZGluZ3NSZXN1bHQgfSBmcm9tICcuLi8uLi9zaGFyZWQvdHlwZXMnO1xuaW1wb3J0IHsgVHRsQ2FjaGUgfSBmcm9tICcuL2NhY2hlJztcbmltcG9ydCB7IGdldEJ1bmRsZUFzT2YsIGdldEV0ZkJ1bmRsZSB9IGZyb20gJy4vZGF0YUZpbGVzJztcbmltcG9ydCB7IHJvdW5kMiwgdG9kYXlZbWQgfSBmcm9tICcuL3V0aWwnO1xuaW1wb3J0IHsgcXVvdGVTdW1tYXJ5LCByYXdOdW1iZXIgfSBmcm9tICcuL3lhaG9vJztcblxuY29uc3QgTElWRV9UVExfTVMgPSAxMiAqIDYwICogNjBfMDAwOyAvLyAxMmhcbmNvbnN0IFNBTVBMRV9UVExfTVMgPSAxNSAqIDYwXzAwMDsgLy8gcmV0cnkgbGl2ZSBzb29uZXIgYWZ0ZXIgYSBmYWlsdXJlXG5jb25zdCBNQVhfSE9MRElOR1MgPSAyMDtcblxuY29uc3QgY2FjaGUgPSBuZXcgVHRsQ2FjaGU8SG9sZGluZ3NSZXN1bHQ+KDIwMCk7XG5jb25zdCBpbkZsaWdodCA9IG5ldyBNYXA8c3RyaW5nLCBQcm9taXNlPEhvbGRpbmdzUmVzdWx0Pj4oKTtcblxuZnVuY3Rpb24gYnVuZGxlZFJlc3VsdChldGZTeW1ib2w6IHN0cmluZyk6IEhvbGRpbmdzUmVzdWx0IHtcbiAgY29uc3QgZW50cnkgPSBnZXRFdGZCdW5kbGUoKS5ldGZzW2V0ZlN5bWJvbF07XG4gIHJldHVybiB7XG4gICAgZXRmU3ltYm9sLFxuICAgIGFzT2Y6IGdldEJ1bmRsZUFzT2YoKSxcbiAgICBob2xkaW5nczogZW50cnkgPyBlbnRyeS5ob2xkaW5ncy5zbGljZSgwLCBNQVhfSE9MRElOR1MpIDogW10sXG4gICAgc291cmNlOiAnc2FtcGxlJyxcbiAgfTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gZmV0Y2hMaXZlSG9sZGluZ3MoZXRmU3ltYm9sOiBzdHJpbmcpOiBQcm9taXNlPEhvbGRpbmdbXT4ge1xuICBjb25zdCBzdW1tYXJ5ID0gYXdhaXQgcXVvdGVTdW1tYXJ5KGV0ZlN5bWJvbCwgWyd0b3BIb2xkaW5ncyddKTtcbiAgY29uc3QgcmF3ID0gc3VtbWFyeS50b3BIb2xkaW5ncz8uaG9sZGluZ3M7XG4gIGlmICghQXJyYXkuaXNBcnJheShyYXcpIHx8IHJhdy5sZW5ndGggPT09IDApIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYG5vIGxpdmUgdG9wSG9sZGluZ3MgZm9yICR7ZXRmU3ltYm9sfWApO1xuICB9XG4gIGNvbnN0IG91dDogSG9sZGluZ1tdID0gW107XG4gIGZvciAoY29uc3QgaCBvZiByYXcpIHtcbiAgICBjb25zdCBzeW1ib2wgPSB0eXBlb2YgaC5zeW1ib2wgPT09ICdzdHJpbmcnID8gaC5zeW1ib2wudG9VcHBlckNhc2UoKS50cmltKCkgOiAnJztcbiAgICBpZiAoIXN5bWJvbCB8fCBvdXQuc29tZSgoeCkgPT4geC5zeW1ib2wgPT09IHN5bWJvbCkpIGNvbnRpbnVlO1xuICAgIGNvbnN0IGZyYWN0aW9uID0gcmF3TnVtYmVyKGguaG9sZGluZ1BlcmNlbnQpO1xuICAgIG91dC5wdXNoKHtcbiAgICAgIHN5bWJvbCxcbiAgICAgIG5hbWU6IHR5cGVvZiBoLmhvbGRpbmdOYW1lID09PSAnc3RyaW5nJyAmJiBoLmhvbGRpbmdOYW1lID8gaC5ob2xkaW5nTmFtZSA6IHN5bWJvbCxcbiAgICAgIHdlaWdodFBlcmNlbnQ6IGZyYWN0aW9uID09PSBudWxsID8gbnVsbCA6IHJvdW5kMihmcmFjdGlvbiAqIDEwMCksXG4gICAgfSk7XG4gIH1cbiAgaWYgKG91dC5sZW5ndGggPT09IDApIHRocm93IG5ldyBFcnJvcihgdW51c2FibGUgbGl2ZSB0b3BIb2xkaW5ncyBmb3IgJHtldGZTeW1ib2x9YCk7XG4gIHJldHVybiBvdXQ7XG59XG5cbmZ1bmN0aW9uIG1lcmdlV2l0aEJ1bmRsZShldGZTeW1ib2w6IHN0cmluZywgbGl2ZTogSG9sZGluZ1tdKTogSG9sZGluZ1tdIHtcbiAgY29uc3QgbWVyZ2VkOiBIb2xkaW5nW10gPSBbLi4ubGl2ZV07XG4gIGNvbnN0IGJ1bmRsZSA9IGdldEV0ZkJ1bmRsZSgpLmV0ZnNbZXRmU3ltYm9sXTtcbiAgaWYgKGJ1bmRsZSkge1xuICAgIGZvciAoY29uc3QgaCBvZiBidW5kbGUuaG9sZGluZ3MpIHtcbiAgICAgIGlmIChtZXJnZWQubGVuZ3RoID49IE1BWF9IT0xESU5HUykgYnJlYWs7XG4gICAgICBpZiAobWVyZ2VkLnNvbWUoKHgpID0+IHguc3ltYm9sID09PSBoLnN5bWJvbCkpIGNvbnRpbnVlO1xuICAgICAgbWVyZ2VkLnB1c2goaCk7XG4gICAgfVxuICAgIC8vIFByZWZlciB0aGUgY3VyYXRlZCBuYW1lcyB3aGVyZSBsaXZlIGdhdmUgdXMgbm9uZS90ZXJzZSBvbmVzPyBMaXZlIHdpbnNcbiAgICAvLyBwZXIgc3BlYyBcdTIwMTQgYnV0IGRvIGJhY2tmaWxsIG1pc3NpbmcgbmFtZXMgZnJvbSB0aGUgYnVuZGxlLlxuICAgIGZvciAoY29uc3QgaXRlbSBvZiBtZXJnZWQpIHtcbiAgICAgIGlmIChpdGVtLm5hbWUgPT09IGl0ZW0uc3ltYm9sKSB7XG4gICAgICAgIGNvbnN0IGtub3duID0gYnVuZGxlLmhvbGRpbmdzLmZpbmQoKHgpID0+IHguc3ltYm9sID09PSBpdGVtLnN5bWJvbCk7XG4gICAgICAgIGlmIChrbm93bikgaXRlbS5uYW1lID0ga25vd24ubmFtZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgbWVyZ2VkLnNvcnQoKGEsIGIpID0+IChiLndlaWdodFBlcmNlbnQgPz8gLTEpIC0gKGEud2VpZ2h0UGVyY2VudCA/PyAtMSkpO1xuICByZXR1cm4gbWVyZ2VkLnNsaWNlKDAsIE1BWF9IT0xESU5HUyk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRIb2xkaW5ncyhldGZTeW1ib2w6IHN0cmluZyk6IFByb21pc2U8SG9sZGluZ3NSZXN1bHQ+IHtcbiAgY29uc3Qgc3ltID0gZXRmU3ltYm9sLnRvVXBwZXJDYXNlKCk7XG4gIGNvbnN0IGNhY2hlZCA9IGNhY2hlLmdldChzeW0pO1xuICBpZiAoY2FjaGVkKSByZXR1cm4gY2FjaGVkO1xuICBjb25zdCBwZW5kaW5nID0gaW5GbGlnaHQuZ2V0KHN5bSk7XG4gIGlmIChwZW5kaW5nKSByZXR1cm4gcGVuZGluZztcblxuICBjb25zdCBwcm9taXNlID0gKGFzeW5jICgpOiBQcm9taXNlPEhvbGRpbmdzUmVzdWx0PiA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGxpdmUgPSBhd2FpdCBmZXRjaExpdmVIb2xkaW5ncyhzeW0pO1xuICAgICAgY29uc3QgcmVzdWx0OiBIb2xkaW5nc1Jlc3VsdCA9IHtcbiAgICAgICAgZXRmU3ltYm9sOiBzeW0sXG4gICAgICAgIGFzT2Y6IHRvZGF5WW1kKCksXG4gICAgICAgIGhvbGRpbmdzOiBtZXJnZVdpdGhCdW5kbGUoc3ltLCBsaXZlKSxcbiAgICAgICAgc291cmNlOiAnbGl2ZScsXG4gICAgICB9O1xuICAgICAgY2FjaGUuc2V0KHN5bSwgcmVzdWx0LCBMSVZFX1RUTF9NUyk7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0gY2F0Y2gge1xuICAgICAgY29uc3QgcmVzdWx0ID0gYnVuZGxlZFJlc3VsdChzeW0pO1xuICAgICAgY2FjaGUuc2V0KHN5bSwgcmVzdWx0LCBTQU1QTEVfVFRMX01TKTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICB9KSgpLmZpbmFsbHkoKCkgPT4ge1xuICAgIGluRmxpZ2h0LmRlbGV0ZShzeW0pO1xuICB9KTtcblxuICBpbkZsaWdodC5zZXQoc3ltLCBwcm9taXNlKTtcbiAgcmV0dXJuIHByb21pc2U7XG59XG4iLCAiaW1wb3J0IHsgYXBwIH0gZnJvbSAnZWxlY3Ryb24nO1xuaW1wb3J0IGZzIGZyb20gJ25vZGU6ZnMnO1xuaW1wb3J0IHBhdGggZnJvbSAnbm9kZTpwYXRoJztcbmltcG9ydCB0eXBlIHsgTGxtU2V0dGluZ3MgfSBmcm9tICcuLi8uLi9zaGFyZWQvdHlwZXMnO1xuXG5jb25zdCBERUZBVUxUX0JBU0VfVVJMID0gcHJvY2Vzcy5lbnYuUVVBTlRfTExNX0JBU0VfVVJMID8/ICdodHRwOi8vMTI3LjAuMC4xOjgwODAnO1xuY29uc3QgREVGQVVMVF9NT0RFTCA9IHByb2Nlc3MuZW52LlFVQU5UX0xMTV9NT0RFTCA/PyAnZ2VtbWEtNC1lNGInO1xuXG5mdW5jdGlvbiBlbnZFbmFibGVkKCk6IGJvb2xlYW4ge1xuICByZXR1cm4gL14oMXx0cnVlfHllcykkL2kudGVzdChwcm9jZXNzLmVudi5RVUFOVF9MTE1fRU5BQkxFRCA/PyAnJykgfHxcbiAgICBCb29sZWFuKHByb2Nlc3MuZW52LlFVQU5UX0xMTV9CQVNFX1VSTCk7XG59XG5cbmZ1bmN0aW9uIHN0b3JlUGF0aCgpOiBzdHJpbmcge1xuICByZXR1cm4gcGF0aC5qb2luKGFwcC5nZXRQYXRoKCd1c2VyRGF0YScpLCAnbGxtLXNldHRpbmdzLmpzb24nKTtcbn1cblxuZnVuY3Rpb24gbm9ybWFsaXplU2V0dGluZ3MocmF3OiBQYXJ0aWFsPExsbVNldHRpbmdzPiB8IG51bGwgfCB1bmRlZmluZWQpOiBMbG1TZXR0aW5ncyB7XG4gIHJldHVybiB7XG4gICAgZW5hYmxlZDogcmF3Py5lbmFibGVkID09PSB0cnVlIHx8IChyYXc/LmVuYWJsZWQgPT09IHVuZGVmaW5lZCAmJiBlbnZFbmFibGVkKCkpLFxuICAgIGJhc2VVcmw6XG4gICAgICB0eXBlb2YgcmF3Py5iYXNlVXJsID09PSAnc3RyaW5nJyAmJiByYXcuYmFzZVVybC50cmltKClcbiAgICAgICAgPyByYXcuYmFzZVVybC50cmltKCkucmVwbGFjZSgvXFwvKyQvLCAnJylcbiAgICAgICAgOiBERUZBVUxUX0JBU0VfVVJMLFxuICAgIG1vZGVsOlxuICAgICAgdHlwZW9mIHJhdz8ubW9kZWwgPT09ICdzdHJpbmcnICYmIHJhdy5tb2RlbC50cmltKClcbiAgICAgICAgPyByYXcubW9kZWwudHJpbSgpXG4gICAgICAgIDogREVGQVVMVF9NT0RFTCxcbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldExsbVNldHRpbmdzKCk6IExsbVNldHRpbmdzIHtcbiAgdHJ5IHtcbiAgICBjb25zdCByYXcgPSBmcy5yZWFkRmlsZVN5bmMoc3RvcmVQYXRoKCksICd1dGY4Jyk7XG4gICAgY29uc3QgcGFyc2VkID0gSlNPTi5wYXJzZShyYXcpIGFzIFBhcnRpYWw8TGxtU2V0dGluZ3M+O1xuICAgIHJldHVybiBub3JtYWxpemVTZXR0aW5ncyhwYXJzZWQpO1xuICB9IGNhdGNoIHtcbiAgICByZXR1cm4gbm9ybWFsaXplU2V0dGluZ3MobnVsbCk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNhdmVMbG1TZXR0aW5ncyhyYXc6IFBhcnRpYWw8TGxtU2V0dGluZ3M+KTogTGxtU2V0dGluZ3Mge1xuICBjb25zdCBzZXR0aW5ncyA9IG5vcm1hbGl6ZVNldHRpbmdzKHtcbiAgICBlbmFibGVkOiByYXcuZW5hYmxlZCA9PT0gdHJ1ZSxcbiAgICBiYXNlVXJsOiByYXcuYmFzZVVybCxcbiAgICBtb2RlbDogcmF3Lm1vZGVsLFxuICB9KTtcbiAgY29uc3QgZmlsZSA9IHN0b3JlUGF0aCgpO1xuICBmcy5ta2RpclN5bmMocGF0aC5kaXJuYW1lKGZpbGUpLCB7IHJlY3Vyc2l2ZTogdHJ1ZSB9KTtcbiAgZnMud3JpdGVGaWxlU3luYyhmaWxlLCBKU09OLnN0cmluZ2lmeShzZXR0aW5ncywgbnVsbCwgMiksICd1dGY4Jyk7XG4gIHJldHVybiBzZXR0aW5ncztcbn1cbiIsICJpbXBvcnQgdHlwZSB7IENoYXJ0UmFuZ2UsIE1hY3JvT3ZlcmxheUtleSwgTWFjcm9PdmVybGF5UG9pbnQsIE1hY3JvT3ZlcmxheVNlcmllcyB9IGZyb20gJy4uLy4uL3NoYXJlZC90eXBlcyc7XG5pbXBvcnQgeyBzYW1wbGVDaGFydCB9IGZyb20gJy4vc2FtcGxlJztcbmltcG9ydCB7IGZldGNoVGV4dCB9IGZyb20gJy4vaHR0cCc7XG5pbXBvcnQgeyBmZXRjaFlhaG9vQ2hhcnQgfSBmcm9tICcuL3lhaG9vJztcblxuY29uc3QgRlJFRF9UVExfTVMgPSA2ICogNjAgKiA2MF8wMDA7XG5jb25zdCBNQVJLRVRfVFRMX01TID0gMiAqIDYwXzAwMDtcblxuaW50ZXJmYWNlIE1hY3JvU3BlYyB7XG4gIGxhYmVsOiBzdHJpbmc7XG4gIHVuaXQ6IHN0cmluZztcbiAgZnJlZElkOiBzdHJpbmc7XG59XG5cbmNvbnN0IFNQRUNTOiBSZWNvcmQ8RXhjbHVkZTxNYWNyb092ZXJsYXlLZXksICd2aXgnIHwgJ29pbCc+LCBNYWNyb1NwZWM+ID0ge1xuICBqb2JzOiB7XG4gICAgbGFiZWw6ICdVUyBqb2IgZ3Jvd3RoJyxcbiAgICB1bml0OiAnbW9udGhseSBwYXlyb2xsIGNoYW5nZSwgdGhvdXNhbmRzJyxcbiAgICBmcmVkSWQ6ICdQQVlFTVMnLFxuICB9LFxuICB1bmVtcGxveW1lbnQ6IHtcbiAgICBsYWJlbDogJ1VTIHVuZW1wbG95bWVudCcsXG4gICAgdW5pdDogJ3BlcmNlbnQnLFxuICAgIGZyZWRJZDogJ1VOUkFURScsXG4gIH0sXG4gIGluZmxhdGlvbjoge1xuICAgIGxhYmVsOiAnVVMgaW5mbGF0aW9uJyxcbiAgICB1bml0OiAnQ1BJIHllYXItb3Zlci15ZWFyLCBwZXJjZW50JyxcbiAgICBmcmVkSWQ6ICdDUElBVUNTTCcsXG4gIH0sXG4gIHRyZWFzdXJ5MTB5OiB7XG4gICAgbGFiZWw6ICcxMFkgVHJlYXN1cnkgeWllbGQnLFxuICAgIHVuaXQ6ICdwZXJjZW50JyxcbiAgICBmcmVkSWQ6ICdER1MxMCcsXG4gIH0sXG59O1xuXG5mdW5jdGlvbiByYW5nZVN0YXJ0TXMocmFuZ2U6IENoYXJ0UmFuZ2UpOiBudW1iZXIge1xuICBjb25zdCBub3cgPSBEYXRlLm5vdygpO1xuICBjb25zdCBkYXkgPSA4Nl80MDBfMDAwO1xuICBzd2l0Y2ggKHJhbmdlKSB7XG4gICAgY2FzZSAnMWQnOlxuICAgICAgcmV0dXJuIG5vdyAtIDE0ICogZGF5O1xuICAgIGNhc2UgJzF3JzpcbiAgICAgIHJldHVybiBub3cgLSAzNSAqIGRheTtcbiAgICBjYXNlICcxbSc6XG4gICAgICByZXR1cm4gbm93IC0gOTAgKiBkYXk7XG4gICAgY2FzZSAnNm0nOlxuICAgICAgcmV0dXJuIG5vdyAtIDI0MCAqIGRheTtcbiAgICBjYXNlICcxeSc6XG4gICAgICByZXR1cm4gbm93IC0gNTAwICogZGF5O1xuICAgIGNhc2UgJzV5JzpcbiAgICAgIHJldHVybiBub3cgLSA2ICogMzY1ICogZGF5O1xuICAgIGNhc2UgJ21heCc6XG4gICAgICByZXR1cm4gbm93IC0gMjAgKiAzNjUgKiBkYXk7XG4gIH1cbn1cblxuZnVuY3Rpb24gcGFyc2VGcmVkQ3N2KGNzdjogc3RyaW5nKTogQXJyYXk8eyB0aW1lOiBudW1iZXI7IHZhbHVlOiBudW1iZXIgfT4ge1xuICBjb25zdCByb3dzID0gY3N2LnRyaW0oKS5zcGxpdCgvXFxyP1xcbi8pLnNsaWNlKDEpO1xuICBjb25zdCBvdXQ6IEFycmF5PHsgdGltZTogbnVtYmVyOyB2YWx1ZTogbnVtYmVyIH0+ID0gW107XG4gIGZvciAoY29uc3Qgcm93IG9mIHJvd3MpIHtcbiAgICBjb25zdCBbZGF0ZSwgcmF3VmFsdWVdID0gcm93LnNwbGl0KCcsJyk7XG4gICAgY29uc3QgdmFsdWUgPSBOdW1iZXIocmF3VmFsdWUpO1xuICAgIGNvbnN0IG1zID0gRGF0ZS5wYXJzZShgJHtkYXRlfVQxMzozMDowMFpgKTtcbiAgICBpZiAoIU51bWJlci5pc0Zpbml0ZSh2YWx1ZSkgfHwgIU51bWJlci5pc0Zpbml0ZShtcykpIGNvbnRpbnVlO1xuICAgIG91dC5wdXNoKHsgdGltZTogTWF0aC5mbG9vcihtcyAvIDEwMDApLCB2YWx1ZSB9KTtcbiAgfVxuICByZXR1cm4gb3V0O1xufVxuXG5mdW5jdGlvbiBtb250aGx5Q2hhbmdlcyhwb2ludHM6IEFycmF5PHsgdGltZTogbnVtYmVyOyB2YWx1ZTogbnVtYmVyIH0+KTogTWFjcm9PdmVybGF5UG9pbnRbXSB7XG4gIGNvbnN0IG91dDogTWFjcm9PdmVybGF5UG9pbnRbXSA9IFtdO1xuICBmb3IgKGxldCBpID0gMTsgaSA8IHBvaW50cy5sZW5ndGg7IGkrKykge1xuICAgIG91dC5wdXNoKHsgdGltZTogcG9pbnRzW2ldLnRpbWUsIHZhbHVlOiBNYXRoLnJvdW5kKChwb2ludHNbaV0udmFsdWUgLSBwb2ludHNbaSAtIDFdLnZhbHVlKSAqIDEwKSAvIDEwIH0pO1xuICB9XG4gIHJldHVybiBvdXQ7XG59XG5cbmZ1bmN0aW9uIHllYXJPdmVyWWVhclBlcmNlbnQocG9pbnRzOiBBcnJheTx7IHRpbWU6IG51bWJlcjsgdmFsdWU6IG51bWJlciB9Pik6IE1hY3JvT3ZlcmxheVBvaW50W10ge1xuICBjb25zdCBvdXQ6IE1hY3JvT3ZlcmxheVBvaW50W10gPSBbXTtcbiAgZm9yIChsZXQgaSA9IDEyOyBpIDwgcG9pbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgcHJldiA9IHBvaW50c1tpIC0gMTJdLnZhbHVlO1xuICAgIGlmIChwcmV2ID09PSAwKSBjb250aW51ZTtcbiAgICBvdXQucHVzaCh7XG4gICAgICB0aW1lOiBwb2ludHNbaV0udGltZSxcbiAgICAgIHZhbHVlOiBNYXRoLnJvdW5kKCgocG9pbnRzW2ldLnZhbHVlIC0gcHJldikgLyBwcmV2KSAqIDEwXzAwMCkgLyAxMDAsXG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuIG91dDtcbn1cblxuZnVuY3Rpb24gZmFsbGJhY2tTZXJpZXMoa2V5OiBNYWNyb092ZXJsYXlLZXksIHJhbmdlOiBDaGFydFJhbmdlKTogTWFjcm9PdmVybGF5U2VyaWVzIHtcbiAgY29uc3QgY2hhcnQgPSBzYW1wbGVDaGFydChrZXkgPT09ICd2aXgnID8gJ1ZJWCcgOiBrZXkgPT09ICdvaWwnID8gJ1VTTycgOiAnU1BZJywgcmFuZ2UpO1xuICBjb25zdCBiYXNlID1cbiAgICBrZXkgPT09ICdqb2JzJ1xuICAgICAgPyAxNzVcbiAgICAgIDoga2V5ID09PSAndW5lbXBsb3ltZW50J1xuICAgICAgICA/IDQuMVxuICAgICAgICA6IGtleSA9PT0gJ2luZmxhdGlvbidcbiAgICAgICAgICA/IDMuMlxuICAgICAgICAgIDoga2V5ID09PSAndHJlYXN1cnkxMHknXG4gICAgICAgICAgICA/IDQuMVxuICAgICAgICAgICAgOiBrZXkgPT09ICdvaWwnXG4gICAgICAgICAgICAgID8gNzhcbiAgICAgICAgICAgICAgOiAxODtcbiAgY29uc3QgbGFiZWwgPVxuICAgIGtleSA9PT0gJ2pvYnMnXG4gICAgICA/ICdVUyBqb2IgZ3Jvd3RoJ1xuICAgICAgOiBrZXkgPT09ICd1bmVtcGxveW1lbnQnXG4gICAgICAgID8gJ1VTIHVuZW1wbG95bWVudCdcbiAgICAgICAgOiBrZXkgPT09ICdpbmZsYXRpb24nXG4gICAgICAgICAgPyAnVVMgaW5mbGF0aW9uJ1xuICAgICAgICAgIDoga2V5ID09PSAndHJlYXN1cnkxMHknXG4gICAgICAgICAgICA/ICcxMFkgVHJlYXN1cnkgeWllbGQnXG4gICAgICAgICAgICA6IGtleSA9PT0gJ29pbCdcbiAgICAgICAgICAgICAgPyAnV1RJIGNydWRlIG9pbCdcbiAgICAgICAgICAgICAgOiAnVklYIHZvbGF0aWxpdHknO1xuICBjb25zdCB1bml0ID1cbiAgICBrZXkgPT09ICdqb2JzJ1xuICAgICAgPyAnbW9udGhseSBwYXlyb2xsIGNoYW5nZSwgdGhvdXNhbmRzJ1xuICAgICAgOiBrZXkgPT09ICdvaWwnXG4gICAgICAgID8gJ1VTRC9iYXJyZWwnXG4gICAgICAgIDoga2V5ID09PSAndml4J1xuICAgICAgICAgID8gJ2luZGV4J1xuICAgICAgICAgIDogJ3BlcmNlbnQnO1xuICByZXR1cm4ge1xuICAgIGtleSxcbiAgICBsYWJlbCxcbiAgICB1bml0LFxuICAgIHNvdXJjZU5hbWU6ICdTYW1wbGUgRGF0YScsXG4gICAgc291cmNlOiAnc2FtcGxlJyxcbiAgICBwb2ludHM6IGNoYXJ0LmNhbmRsZXNcbiAgICAgIC5maWx0ZXIoKF8sIGkpID0+IGkgJSBNYXRoLm1heCgxLCBNYXRoLmZsb29yKGNoYXJ0LmNhbmRsZXMubGVuZ3RoIC8gNjApKSA9PT0gMClcbiAgICAgIC5tYXAoKGMsIGkpID0+ICh7XG4gICAgICAgIHRpbWU6IGMudGltZSxcbiAgICAgICAgdmFsdWU6XG4gICAgICAgICAgTWF0aC5yb3VuZChcbiAgICAgICAgICAgIChiYXNlICtcbiAgICAgICAgICAgICAgTWF0aC5zaW4oaSAvIDQpICpcbiAgICAgICAgICAgICAgICAoa2V5ID09PSAnam9icycgPyA3MCA6IGtleSA9PT0gJ3ZpeCcgPyA0IDoga2V5ID09PSAnb2lsJyA/IDggOiAwLjI1KSkgKlxuICAgICAgICAgICAgICAxMDAsXG4gICAgICAgICAgKSAvIDEwMCxcbiAgICAgIH0pKSxcbiAgfTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gZ2V0RnJlZE92ZXJsYXkoXG4gIGtleTogRXhjbHVkZTxNYWNyb092ZXJsYXlLZXksICd2aXgnIHwgJ29pbCc+LFxuICByYW5nZTogQ2hhcnRSYW5nZSxcbik6IFByb21pc2U8TWFjcm9PdmVybGF5U2VyaWVzPiB7XG4gIGNvbnN0IHNwZWMgPSBTUEVDU1trZXldO1xuICBjb25zdCB1cmwgPSBgaHR0cHM6Ly9mcmVkLnN0bG91aXNmZWQub3JnL2dyYXBoL2ZyZWRncmFwaC5jc3Y/aWQ9JHtlbmNvZGVVUklDb21wb25lbnQoc3BlYy5mcmVkSWQpfWA7XG4gIGNvbnN0IGNzdiA9IGF3YWl0IGZldGNoVGV4dCh1cmwsIHsgdHRsTXM6IEZSRURfVFRMX01TLCB0aW1lb3V0TXM6IDEyXzAwMCB9KTtcbiAgY29uc3Qgc3RhcnRTZWMgPSBNYXRoLmZsb29yKHJhbmdlU3RhcnRNcyhyYW5nZSkgLyAxMDAwKTtcbiAgY29uc3QgcGFyc2VkID0gcGFyc2VGcmVkQ3N2KGNzdik7XG4gIGNvbnN0IHBvaW50cyA9XG4gICAga2V5ID09PSAnam9icydcbiAgICAgID8gbW9udGhseUNoYW5nZXMocGFyc2VkKVxuICAgICAgOiBrZXkgPT09ICdpbmZsYXRpb24nXG4gICAgICAgID8geWVhck92ZXJZZWFyUGVyY2VudChwYXJzZWQpXG4gICAgICAgIDogcGFyc2VkLm1hcCgocCkgPT4gKHsgdGltZTogcC50aW1lLCB2YWx1ZTogcC52YWx1ZSB9KSk7XG4gIHJldHVybiB7XG4gICAga2V5LFxuICAgIGxhYmVsOiBzcGVjLmxhYmVsLFxuICAgIHVuaXQ6IHNwZWMudW5pdCxcbiAgICBzb3VyY2VOYW1lOiAnRlJFRCcsXG4gICAgc291cmNlOiAnbGl2ZScsXG4gICAgcG9pbnRzOiBwb2ludHMuZmlsdGVyKChwKSA9PiBwLnRpbWUgPj0gc3RhcnRTZWMpLFxuICB9O1xufVxuXG5mdW5jdGlvbiB5YWhvb1JhbmdlRm9yKHJhbmdlOiBDaGFydFJhbmdlKTogeyB5YWhvb1JhbmdlOiBzdHJpbmc7IGludGVydmFsOiBzdHJpbmcgfSB7XG4gIGNvbnN0IHlhaG9vUmFuZ2UgPVxuICAgIHJhbmdlID09PSAnMXcnXG4gICAgICA/ICc1ZCdcbiAgICAgIDogcmFuZ2UgPT09ICcxbSdcbiAgICAgICAgPyAnMW1vJ1xuICAgICAgICA6IHJhbmdlID09PSAnbWF4J1xuICAgICAgICAgID8gJzEweSdcbiAgICAgICAgICA6IHJhbmdlO1xuICBjb25zdCBpbnRlcnZhbCA9IHJhbmdlID09PSAnMWQnID8gJzVtJyA6IHJhbmdlID09PSAnMXcnID8gJzE1bScgOiByYW5nZSA9PT0gJzFtJyA/ICc2MG0nIDogJzFkJztcbiAgcmV0dXJuIHsgeWFob29SYW5nZSwgaW50ZXJ2YWwgfTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gZ2V0WWFob29PdmVybGF5KFxuICBrZXk6IEV4dHJhY3Q8TWFjcm9PdmVybGF5S2V5LCAndml4JyB8ICdvaWwnPixcbiAgcmFuZ2U6IENoYXJ0UmFuZ2UsXG4pOiBQcm9taXNlPE1hY3JvT3ZlcmxheVNlcmllcz4ge1xuICBjb25zdCB7IHlhaG9vUmFuZ2UsIGludGVydmFsIH0gPSB5YWhvb1JhbmdlRm9yKHJhbmdlKTtcbiAgY29uc3QgcmVzdWx0ID0gYXdhaXQgZmV0Y2hZYWhvb0NoYXJ0KGtleSA9PT0gJ3ZpeCcgPyAnXlZJWCcgOiAnQ0w9RicsIHlhaG9vUmFuZ2UsIGludGVydmFsLCBNQVJLRVRfVFRMX01TKTtcbiAgY29uc3QgcXVvdGUgPSByZXN1bHQuaW5kaWNhdG9ycz8ucXVvdGU/LlswXTtcbiAgY29uc3QgdGltZXN0YW1wcyA9IHJlc3VsdC50aW1lc3RhbXAgPz8gW107XG4gIGNvbnN0IGNsb3NlcyA9IHF1b3RlPy5jbG9zZSA/PyBbXTtcbiAgY29uc3QgcG9pbnRzOiBNYWNyb092ZXJsYXlQb2ludFtdID0gW107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgdGltZXN0YW1wcy5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IHRpbWUgPSB0aW1lc3RhbXBzW2ldO1xuICAgIGNvbnN0IHZhbHVlID0gY2xvc2VzW2ldO1xuICAgIGlmICh0eXBlb2YgdGltZSA9PT0gJ251bWJlcicgJiYgdHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyAmJiBOdW1iZXIuaXNGaW5pdGUodmFsdWUpKSB7XG4gICAgICBwb2ludHMucHVzaCh7IHRpbWU6IE1hdGguZmxvb3IodGltZSksIHZhbHVlOiBNYXRoLnJvdW5kKHZhbHVlICogMTAwKSAvIDEwMCB9KTtcbiAgICB9XG4gIH1cbiAgaWYgKHBvaW50cy5sZW5ndGggPT09IDApIHRocm93IG5ldyBFcnJvcihgJHtrZXl9IG92ZXJsYXkgcmV0dXJuZWQgbm8gcG9pbnRzYCk7XG4gIHJldHVybiB7XG4gICAga2V5LFxuICAgIGxhYmVsOiBrZXkgPT09ICd2aXgnID8gJ1ZJWCB2b2xhdGlsaXR5JyA6ICdXVEkgY3J1ZGUgb2lsJyxcbiAgICB1bml0OiBrZXkgPT09ICd2aXgnID8gJ2luZGV4JyA6ICdVU0QvYmFycmVsJyxcbiAgICBzb3VyY2VOYW1lOiAnWWFob28gRmluYW5jZScsXG4gICAgc291cmNlOiAnbGl2ZScsXG4gICAgcG9pbnRzLFxuICB9O1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0TWFjcm9PdmVybGF5KFxuICBrZXk6IE1hY3JvT3ZlcmxheUtleSxcbiAgcmFuZ2U6IENoYXJ0UmFuZ2UsXG4pOiBQcm9taXNlPE1hY3JvT3ZlcmxheVNlcmllcz4ge1xuICB0cnkge1xuICAgIGlmIChrZXkgPT09ICd2aXgnIHx8IGtleSA9PT0gJ29pbCcpIHJldHVybiBhd2FpdCBnZXRZYWhvb092ZXJsYXkoa2V5LCByYW5nZSk7XG4gICAgcmV0dXJuIGF3YWl0IGdldEZyZWRPdmVybGF5KGtleSwgcmFuZ2UpO1xuICB9IGNhdGNoIHtcbiAgICByZXR1cm4gZmFsbGJhY2tTZXJpZXMoa2V5LCByYW5nZSk7XG4gIH1cbn1cbiIsICJpbXBvcnQgeyBhcHAgfSBmcm9tICdlbGVjdHJvbic7XG5pbXBvcnQgZnMgZnJvbSAnbm9kZTpmcyc7XG5pbXBvcnQgcGF0aCBmcm9tICdub2RlOnBhdGgnO1xuaW1wb3J0IHR5cGUge1xuICBDaGFydFJhbmdlLFxuICBRdWFudEluc2lnaHRSZWNvcmQsXG4gIFF1YW50SW5zaWdodFJlcXVlc3QsXG4gIFF1YW50SW5zaWdodFJlc3BvbnNlLFxufSBmcm9tICcuLi8uLi9zaGFyZWQvdHlwZXMnO1xuXG5jb25zdCBNQVhfUkVDT1JEUyA9IDIwMDtcblxuZnVuY3Rpb24gc3RvcmVQYXRoKCk6IHN0cmluZyB7XG4gIHJldHVybiBwYXRoLmpvaW4oYXBwLmdldFBhdGgoJ3VzZXJEYXRhJyksICdxdWFudC1pbnNpZ2h0cy5qc29uJyk7XG59XG5cbmZ1bmN0aW9uIHJlYWRBbGwoKTogUXVhbnRJbnNpZ2h0UmVjb3JkW10ge1xuICB0cnkge1xuICAgIGNvbnN0IHJhdyA9IGZzLnJlYWRGaWxlU3luYyhzdG9yZVBhdGgoKSwgJ3V0ZjgnKTtcbiAgICBjb25zdCBwYXJzZWQgPSBKU09OLnBhcnNlKHJhdykgYXMgdW5rbm93bjtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkocGFyc2VkKSkgcmV0dXJuIFtdO1xuICAgIHJldHVybiBwYXJzZWQuZmlsdGVyKGlzUmVjb3JkKTtcbiAgfSBjYXRjaCB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG59XG5cbmZ1bmN0aW9uIHdyaXRlQWxsKHJlY29yZHM6IFF1YW50SW5zaWdodFJlY29yZFtdKTogdm9pZCB7XG4gIGNvbnN0IGZpbGUgPSBzdG9yZVBhdGgoKTtcbiAgZnMubWtkaXJTeW5jKHBhdGguZGlybmFtZShmaWxlKSwgeyByZWN1cnNpdmU6IHRydWUgfSk7XG4gIGZzLndyaXRlRmlsZVN5bmMoZmlsZSwgSlNPTi5zdHJpbmdpZnkocmVjb3Jkcy5zbGljZSgwLCBNQVhfUkVDT1JEUyksIG51bGwsIDIpKTtcbn1cblxuZnVuY3Rpb24gaXNSZWNvcmQodmFsdWU6IHVua25vd24pOiB2YWx1ZSBpcyBRdWFudEluc2lnaHRSZWNvcmQge1xuICBpZiAoIXZhbHVlIHx8IHR5cGVvZiB2YWx1ZSAhPT0gJ29iamVjdCcpIHJldHVybiBmYWxzZTtcbiAgY29uc3QgciA9IHZhbHVlIGFzIFBhcnRpYWw8UXVhbnRJbnNpZ2h0UmVjb3JkPjtcbiAgcmV0dXJuIChcbiAgICB0eXBlb2Ygci5pZCA9PT0gJ3N0cmluZycgJiZcbiAgICB0eXBlb2Ygci5zeW1ib2wgPT09ICdzdHJpbmcnICYmXG4gICAgdHlwZW9mIHIucmFuZ2UgPT09ICdzdHJpbmcnICYmXG4gICAgdHlwZW9mIHIuYW5zd2VyID09PSAnc3RyaW5nJyAmJlxuICAgIHR5cGVvZiByLmdlbmVyYXRlZEF0ID09PSAnc3RyaW5nJ1xuICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2F2ZVF1YW50SW5zaWdodChcbiAgcmVxdWVzdDogUXVhbnRJbnNpZ2h0UmVxdWVzdCxcbiAgcmVzcG9uc2U6IFF1YW50SW5zaWdodFJlc3BvbnNlLFxuKTogUXVhbnRJbnNpZ2h0UmVjb3JkIHtcbiAgY29uc3QgcmVjb3JkOiBRdWFudEluc2lnaHRSZWNvcmQgPSB7XG4gICAgLi4ucmVzcG9uc2UsXG4gICAgaWQ6IGAke3JlcXVlc3Quc3ltYm9sfS0ke0RhdGUubm93KCl9LSR7TWF0aC5yYW5kb20oKS50b1N0cmluZygxNikuc2xpY2UoMil9YCxcbiAgICBzeW1ib2w6IHJlcXVlc3Quc3ltYm9sLFxuICAgIHJhbmdlOiByZXF1ZXN0LnJhbmdlLFxuICAgIHF1ZXN0aW9uOiByZXF1ZXN0LnF1ZXN0aW9uLFxuICAgIGRlY2lzaW9uOiByZXF1ZXN0LmV2YWx1YXRpb24uZGVjaXNpb24sXG4gICAgc2V0dXBUeXBlOiByZXF1ZXN0LmV2YWx1YXRpb24uc2V0dXBUeXBlLFxuICAgIGNvbmZpZGVuY2U6IHJlcXVlc3QuZXZhbHVhdGlvbi5jb25maWRlbmNlLFxuICB9O1xuICBjb25zdCByZWNvcmRzID0gW3JlY29yZCwgLi4ucmVhZEFsbCgpXS5zbGljZSgwLCBNQVhfUkVDT1JEUyk7XG4gIHdyaXRlQWxsKHJlY29yZHMpO1xuICByZXR1cm4gcmVjb3JkO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0UXVhbnRJbnNpZ2h0cyhzeW1ib2w6IHN0cmluZywgcmFuZ2U/OiBDaGFydFJhbmdlKTogUXVhbnRJbnNpZ2h0UmVjb3JkW10ge1xuICBjb25zdCBub3JtYWxpemVkID0gc3ltYm9sLnRvVXBwZXJDYXNlKCk7XG4gIHJldHVybiByZWFkQWxsKClcbiAgICAuZmlsdGVyKChyZWNvcmQpID0+IHJlY29yZC5zeW1ib2wgPT09IG5vcm1hbGl6ZWQgJiYgKCFyYW5nZSB8fCByZWNvcmQucmFuZ2UgPT09IHJhbmdlKSlcbiAgICAuc2xpY2UoMCwgMjApO1xufVxuIiwgIi8vIFJTUyAyLjAgcGFyc2luZyBzaGFyZWQgYnkgdGhlIFlhaG9vIHBlci10aWNrZXIgZmVlZCBhbmQgR29vZ2xlIE5ld3MuXG4vLyBmYXN0LXhtbC1wYXJzZXIgd2l0aCBpc0FycmF5IGZvciA8aXRlbT4gc28gc2luZ2xlLWl0ZW0gY2hhbm5lbHMgc3RpbGxcbi8vIGNvbWUgYmFjayBhcyBhcnJheXMuIFRpdGxlcyBhcmUga2VwdCBhcyByYXcgc3RyaW5ncyAocGFyc2VUYWdWYWx1ZSBvZmYpXG4vLyBzbyBoZWFkbGluZXMgbGlrZSBcIjNNXCIgZG9uJ3QgZ2V0IGNvZXJjZWQgdG8gbnVtYmVycy5cblxuaW1wb3J0IHsgWE1MUGFyc2VyIH0gZnJvbSAnZmFzdC14bWwtcGFyc2VyJztcblxuZXhwb3J0IGludGVyZmFjZSBSc3NJdGVtIHtcbiAgdGl0bGU6IHN0cmluZztcbiAgbGluazogc3RyaW5nO1xuICBwdWJEYXRlPzogc3RyaW5nO1xuICBkZXNjcmlwdGlvbj86IHN0cmluZztcbiAgLyoqIFB1Ymxpc2hlciBmcm9tIHRoZSA8c291cmNlPiB0YWcgd2hlbiBwcmVzZW50IChHb29nbGUgTmV3cyBoYXMgaXQpLiAqL1xuICBzb3VyY2VOYW1lPzogc3RyaW5nO1xufVxuXG5jb25zdCBwYXJzZXIgPSBuZXcgWE1MUGFyc2VyKHtcbiAgaWdub3JlQXR0cmlidXRlczogZmFsc2UsXG4gIGlzQXJyYXk6IChuYW1lKSA9PiBuYW1lID09PSAnaXRlbScsXG4gIHBhcnNlVGFnVmFsdWU6IGZhbHNlLFxuICB0cmltVmFsdWVzOiB0cnVlLFxufSk7XG5cbmZ1bmN0aW9uIHRleHRPZih2YWx1ZTogdW5rbm93bik6IHN0cmluZyB7XG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSByZXR1cm4gdmFsdWUudHJpbSgpO1xuICBpZiAodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJykgcmV0dXJuIFN0cmluZyh2YWx1ZSk7XG4gIGlmICh2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnKSB7XG4gICAgY29uc3QgdGV4dCA9ICh2YWx1ZSBhcyBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPilbJyN0ZXh0J107XG4gICAgaWYgKHR5cGVvZiB0ZXh0ID09PSAnc3RyaW5nJykgcmV0dXJuIHRleHQudHJpbSgpO1xuICAgIGlmICh0eXBlb2YgdGV4dCA9PT0gJ251bWJlcicpIHJldHVybiBTdHJpbmcodGV4dCk7XG4gIH1cbiAgcmV0dXJuICcnO1xufVxuXG4vKiogUGFyc2UgYW4gUlNTIDIuMCBkb2N1bWVudCBpbnRvIG5vcm1hbGl6ZWQgaXRlbXMuIEJhZCBYTUwgXHUyMTkyIFtdLiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlUnNzSXRlbXMoeG1sOiBzdHJpbmcpOiBSc3NJdGVtW10ge1xuICBsZXQgZG9jOiB1bmtub3duO1xuICB0cnkge1xuICAgIGRvYyA9IHBhcnNlci5wYXJzZSh4bWwpO1xuICB9IGNhdGNoIHtcbiAgICByZXR1cm4gW107XG4gIH1cbiAgY29uc3QgY2hhbm5lbCA9IChkb2MgYXMgeyByc3M/OiB7IGNoYW5uZWw/OiB7IGl0ZW0/OiB1bmtub3duIH0gfSB9KS5yc3M/LmNoYW5uZWw7XG4gIGNvbnN0IHJhd0l0ZW1zID0gY2hhbm5lbD8uaXRlbTtcbiAgaWYgKCFBcnJheS5pc0FycmF5KHJhd0l0ZW1zKSkgcmV0dXJuIFtdO1xuXG4gIGNvbnN0IG91dDogUnNzSXRlbVtdID0gW107XG4gIGZvciAoY29uc3QgcmF3IG9mIHJhd0l0ZW1zKSB7XG4gICAgaWYgKCFyYXcgfHwgdHlwZW9mIHJhdyAhPT0gJ29iamVjdCcpIGNvbnRpbnVlO1xuICAgIGNvbnN0IGl0ZW0gPSByYXcgYXMgUmVjb3JkPHN0cmluZywgdW5rbm93bj47XG4gICAgY29uc3QgdGl0bGUgPSB0ZXh0T2YoaXRlbS50aXRsZSk7XG4gICAgY29uc3QgbGluayA9IHRleHRPZihpdGVtLmxpbmspO1xuICAgIGlmICghdGl0bGUgfHwgIWxpbmspIGNvbnRpbnVlO1xuICAgIGNvbnN0IHB1YkRhdGUgPSB0ZXh0T2YoaXRlbS5wdWJEYXRlKTtcbiAgICBjb25zdCBkZXNjcmlwdGlvbiA9IHRleHRPZihpdGVtLmRlc2NyaXB0aW9uKTtcbiAgICBjb25zdCBzb3VyY2VOYW1lID0gdGV4dE9mKGl0ZW0uc291cmNlKTtcbiAgICBvdXQucHVzaCh7XG4gICAgICB0aXRsZSxcbiAgICAgIGxpbmssXG4gICAgICBwdWJEYXRlOiBwdWJEYXRlIHx8IHVuZGVmaW5lZCxcbiAgICAgIGRlc2NyaXB0aW9uOiBkZXNjcmlwdGlvbiB8fCB1bmRlZmluZWQsXG4gICAgICBzb3VyY2VOYW1lOiBzb3VyY2VOYW1lIHx8IHVuZGVmaW5lZCxcbiAgICB9KTtcbiAgfVxuICByZXR1cm4gb3V0O1xufVxuIiwgIi8vIEdvb2dsZSBOZXdzIFJTUyBzZWFyY2ggXHUyMDE0IHVzZWQgYnkgcGl2b3ROZXdzIGZvciBkYXRlLWJvdW5kZWQgcXVlcmllcyBsaWtlXG4vLyBcIk5WREEgc3RvY2sgYWZ0ZXI6MjAyNi0wMS0wNSBiZWZvcmU6MjAyNi0wMS0xMlwiLiBJdGVtIHRpdGxlcyB1c3VhbGx5IGVuZFxuLy8gd2l0aCBcIiAtIFB1Ymxpc2hlclwiOyB0aGUgPHNvdXJjZT4gdGFnIGhvbGRzIHRoZSBwdWJsaXNoZXIgbmFtZS5cblxuaW1wb3J0IHR5cGUgeyBOZXdzSXRlbSB9IGZyb20gJy4uLy4uL3NoYXJlZC90eXBlcyc7XG5pbXBvcnQgeyBmZXRjaFRleHQgfSBmcm9tICcuL2h0dHAnO1xuaW1wb3J0IHsgcGFyc2VSc3NJdGVtcyB9IGZyb20gJy4vcnNzJztcbmltcG9ydCB7IGhhc2hJZCwgcGFyc2VEYXRlTXMgfSBmcm9tICcuL3V0aWwnO1xuXG4vKiogU3RyaXAgYSB0cmFpbGluZyBcIiAtIFB1Ymxpc2hlclwiIHN1ZmZpeCB3aGVuIGl0IG1hdGNoZXMgdGhlIHNvdXJjZSB0YWcuICovXG5mdW5jdGlvbiBjbGVhblRpdGxlKHRpdGxlOiBzdHJpbmcsIHB1Ymxpc2hlcjogc3RyaW5nIHwgdW5kZWZpbmVkKTogc3RyaW5nIHtcbiAgY29uc3QgaWR4ID0gdGl0bGUubGFzdEluZGV4T2YoJyAtICcpO1xuICBpZiAoaWR4IDw9IDApIHJldHVybiB0aXRsZTtcbiAgY29uc3Qgc3VmZml4ID0gdGl0bGUuc2xpY2UoaWR4ICsgMykudHJpbSgpO1xuICBpZiAocHVibGlzaGVyICYmIHN1ZmZpeC50b0xvd2VyQ2FzZSgpID09PSBwdWJsaXNoZXIudG9Mb3dlckNhc2UoKSkge1xuICAgIHJldHVybiB0aXRsZS5zbGljZSgwLCBpZHgpLnRyaW0oKTtcbiAgfVxuICAvLyBObyBzb3VyY2UgdGFnOiBzdGlsbCBzdHJpcCBhIHNob3J0IHRyYWlsaW5nIHB1Ymxpc2hlci1sb29raW5nIHN1ZmZpeC5cbiAgaWYgKCFwdWJsaXNoZXIgJiYgc3VmZml4Lmxlbmd0aCA8PSA0MCAmJiAhc3VmZml4LmluY2x1ZGVzKCcgLSAnKSkge1xuICAgIHJldHVybiB0aXRsZS5zbGljZSgwLCBpZHgpLnRyaW0oKTtcbiAgfVxuICByZXR1cm4gdGl0bGU7XG59XG5cbi8qKlxuICogU2VhcmNoIEdvb2dsZSBOZXdzIGZvciBhIHN5bWJvbCB3aXRoaW4gYSBVVEMgZGF0ZSB3aW5kb3cgKGluY2x1c2l2ZS1pc2g7XG4gKiBHb29nbGUgdHJlYXRzIGFmdGVyOi9iZWZvcmU6IGFzIGRheSBib3VuZHMpLiBDYWNoZWQgYnkgVVJMLCB3aGljaCBlbmNvZGVzXG4gKiBzeW1ib2wgKyB3aW5kb3csIHNvIHJlcGVhdCBwaXZvdCBsb29rdXBzIHdpdGhpbiB0dGxNcyBhcmUgZnJlZS5cbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNlYXJjaEdvb2dsZU5ld3MoXG4gIHN5bWJvbDogc3RyaW5nLFxuICBhZnRlclltZDogc3RyaW5nLFxuICBiZWZvcmVZbWQ6IHN0cmluZyxcbiAgdHRsTXM6IG51bWJlcixcbik6IFByb21pc2U8TmV3c0l0ZW1bXT4ge1xuICBjb25zdCBxdWVyeSA9IGAke3N5bWJvbH0gc3RvY2sgYWZ0ZXI6JHthZnRlclltZH0gYmVmb3JlOiR7YmVmb3JlWW1kfWA7XG4gIGNvbnN0IHVybCA9XG4gICAgYGh0dHBzOi8vbmV3cy5nb29nbGUuY29tL3Jzcy9zZWFyY2g/cT0ke2VuY29kZVVSSUNvbXBvbmVudChxdWVyeSl9YCArXG4gICAgYCZobD1lbi1VUyZnbD1VUyZjZWlkPVVTOmVuYDtcbiAgY29uc3QgeG1sID0gYXdhaXQgZmV0Y2hUZXh0KHVybCwgeyB0dGxNcyB9KTtcbiAgY29uc3QgaXRlbXMgPSBwYXJzZVJzc0l0ZW1zKHhtbCk7XG5cbiAgY29uc3Qgb3V0OiBOZXdzSXRlbVtdID0gW107XG4gIGZvciAoY29uc3QgaXRlbSBvZiBpdGVtcykge1xuICAgIGNvbnN0IHB1Ymxpc2hlZE1zID0gcGFyc2VEYXRlTXMoaXRlbS5wdWJEYXRlKTtcbiAgICBpZiAocHVibGlzaGVkTXMgPT09IG51bGwpIGNvbnRpbnVlOyAvLyB1bmRhdGVkIGl0ZW1zIGFyZSB1c2VsZXNzIG5lYXIgcGl2b3RzXG4gICAgY29uc3QgcHVibGlzaGVyID0gaXRlbS5zb3VyY2VOYW1lO1xuICAgIG91dC5wdXNoKHtcbiAgICAgIGlkOiBgZy0ke2hhc2hJZChgJHtpdGVtLmxpbmt9fCR7aXRlbS50aXRsZX1gKX1gLFxuICAgICAgdGl0bGU6IGNsZWFuVGl0bGUoaXRlbS50aXRsZSwgcHVibGlzaGVyKSxcbiAgICAgIHVybDogaXRlbS5saW5rLFxuICAgICAgc291cmNlTmFtZTogcHVibGlzaGVyIHx8ICdHb29nbGUgTmV3cycsXG4gICAgICBwdWJsaXNoZWRBdDogbmV3IERhdGUocHVibGlzaGVkTXMpLnRvSVNPU3RyaW5nKCksXG4gICAgICByZWxhdGVkU3ltYm9sOiBzeW1ib2wsXG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuIG91dDtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNlYXJjaEtvcmVhbkZpbmFuY2VOZXdzKFxuICBzeW1ib2w6IHN0cmluZyxcbiAgdHRsTXM6IG51bWJlcixcbiAgYWZ0ZXJZbWQ/OiBzdHJpbmcsXG4gIGJlZm9yZVltZD86IHN0cmluZyxcbik6IFByb21pc2U8TmV3c0l0ZW1bXT4ge1xuICBjb25zdCBkYXRlQ2xhdXNlID0gYWZ0ZXJZbWQgJiYgYmVmb3JlWW1kID8gYCBhZnRlcjoke2FmdGVyWW1kfSBiZWZvcmU6JHtiZWZvcmVZbWR9YCA6ICcnO1xuICBjb25zdCBxdWVyeSA9IGBzaXRlOmZpbmFuY2UubmF2ZXIuY29tICR7c3ltYm9sfSBcdUM4RkNcdUMyREQgT1IgXHVDOTlEXHVBRDhDJHtkYXRlQ2xhdXNlfWA7XG4gIGNvbnN0IHVybCA9XG4gICAgYGh0dHBzOi8vbmV3cy5nb29nbGUuY29tL3Jzcy9zZWFyY2g/cT0ke2VuY29kZVVSSUNvbXBvbmVudChxdWVyeSl9YCArXG4gICAgYCZobD1rbyZnbD1LUiZjZWlkPUtSOmtvYDtcbiAgY29uc3QgeG1sID0gYXdhaXQgZmV0Y2hUZXh0KHVybCwgeyB0dGxNcyB9KTtcbiAgY29uc3QgaXRlbXMgPSBwYXJzZVJzc0l0ZW1zKHhtbCk7XG5cbiAgY29uc3Qgb3V0OiBOZXdzSXRlbVtdID0gW107XG4gIGZvciAoY29uc3QgaXRlbSBvZiBpdGVtcykge1xuICAgIGNvbnN0IHB1Ymxpc2hlZE1zID0gcGFyc2VEYXRlTXMoaXRlbS5wdWJEYXRlKTtcbiAgICBpZiAocHVibGlzaGVkTXMgPT09IG51bGwpIGNvbnRpbnVlO1xuICAgIGNvbnN0IHB1Ymxpc2hlciA9IGl0ZW0uc291cmNlTmFtZTtcbiAgICBvdXQucHVzaCh7XG4gICAgICBpZDogYGtyLSR7aGFzaElkKGAke2l0ZW0ubGlua318JHtpdGVtLnRpdGxlfWApfWAsXG4gICAgICB0aXRsZTogY2xlYW5UaXRsZShpdGVtLnRpdGxlLCBwdWJsaXNoZXIpLFxuICAgICAgdXJsOiBpdGVtLmxpbmssXG4gICAgICBzb3VyY2VOYW1lOiBwdWJsaXNoZXIgPyBgS1IgXHUwMEI3ICR7cHVibGlzaGVyfWAgOiAnS1IgXHUwMEI3IE5hdmVyIEZpbmFuY2UnLFxuICAgICAgcHVibGlzaGVkQXQ6IG5ldyBEYXRlKHB1Ymxpc2hlZE1zKS50b0lTT1N0cmluZygpLFxuICAgICAgcmVsYXRlZFN5bWJvbDogc3ltYm9sLFxuICAgIH0pO1xuICB9XG4gIHJldHVybiBvdXQ7XG59XG4iLCAiLy8gbmV3czpnZXQgXHUyMDE0IFlhaG9vIHBlci10aWNrZXIgUlNTLCBmZXRjaGVkIHBlciBzeW1ib2wgKGNvbmN1cnJlbmN5IDQsXG4vLyAxMC1taW51dGUgVFRMIHBlciBmZWVkKSwgZGVkdXBlZCBhY3Jvc3Mgc3ltYm9scyBieSBub3JtYWxpemVkIHRpdGxlLFxuLy8gc29ydGVkIG5ld2VzdCBmaXJzdCwgY2FwcGVkIGF0IDEwMC4gVG90YWwgZmFpbHVyZSBcdTIxOTIgZGV0ZXJtaW5pc3RpY1xuLy8gc2FtcGxlIGl0ZW1zIChzb3VyY2VOYW1lICdTYW1wbGUgRGF0YScsIGlkcyBwcmVmaXhlZCAnc2FtcGxlLScpLlxuXG5pbXBvcnQgdHlwZSB7IE5ld3NJdGVtIH0gZnJvbSAnLi4vLi4vc2hhcmVkL3R5cGVzJztcbmltcG9ydCB7IHNlYXJjaEtvcmVhbkZpbmFuY2VOZXdzIH0gZnJvbSAnLi9nb29nbGVOZXdzJztcbmltcG9ydCB7IGZldGNoVGV4dCB9IGZyb20gJy4vaHR0cCc7XG5pbXBvcnQgeyBwYXJzZVJzc0l0ZW1zIH0gZnJvbSAnLi9yc3MnO1xuaW1wb3J0IHsgc2FtcGxlTmV3cyB9IGZyb20gJy4vc2FtcGxlJztcbmltcG9ydCB7XG4gIGhhc2hJZCxcbiAgbm9ybWFsaXplVGl0bGUsXG4gIHBhcnNlRGF0ZU1zLFxuICBwTGltaXQsXG4gIHN0cmlwSHRtbCxcbn0gZnJvbSAnLi91dGlsJztcblxuY29uc3QgRkVFRF9UVExfTVMgPSAxMCAqIDYwXzAwMDtcbmNvbnN0IE1BWF9TWU1CT0xTID0gNDA7XG5jb25zdCBNQVhfVE9UQUwgPSAxMDA7XG5jb25zdCBsaW1pdCA9IHBMaW1pdCg0KTtcblxuLyoqXG4gKiBGZXRjaCBhbmQgbWFwIHRoZSBmdWxsIFlhaG9vIFJTUyBmZWVkIGZvciBvbmUgc3ltYm9sICh1bmNhcHBlZCkuXG4gKiBTaGFyZWQgd2l0aCBwaXZvdE5ld3MsIHdoaWNoIGZpbHRlcnMgaXRlbXMgaW50byBwaXZvdCB3aW5kb3dzLlxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZmV0Y2hTeW1ib2xGZWVkKHN5bWJvbDogc3RyaW5nKTogUHJvbWlzZTxOZXdzSXRlbVtdPiB7XG4gIGNvbnN0IHVybCA9XG4gICAgYGh0dHBzOi8vZmVlZHMuZmluYW5jZS55YWhvby5jb20vcnNzLzIuMC9oZWFkbGluZWAgK1xuICAgIGA/cz0ke2VuY29kZVVSSUNvbXBvbmVudChzeW1ib2wpfSZyZWdpb249VVMmbGFuZz1lbi1VU2A7XG4gIGNvbnN0IHhtbCA9IGF3YWl0IGZldGNoVGV4dCh1cmwsIHsgdHRsTXM6IEZFRURfVFRMX01TIH0pO1xuICBjb25zdCBpdGVtcyA9IHBhcnNlUnNzSXRlbXMoeG1sKTtcblxuICBjb25zdCBvdXQ6IE5ld3NJdGVtW10gPSBbXTtcbiAgZm9yIChjb25zdCBpdGVtIG9mIGl0ZW1zKSB7XG4gICAgY29uc3QgcHVibGlzaGVkTXMgPSBwYXJzZURhdGVNcyhpdGVtLnB1YkRhdGUpO1xuICAgIGNvbnN0IHN1bW1hcnkgPSBpdGVtLmRlc2NyaXB0aW9uID8gc3RyaXBIdG1sKGl0ZW0uZGVzY3JpcHRpb24pLnNsaWNlKDAsIDMwMCkgOiB1bmRlZmluZWQ7XG4gICAgb3V0LnB1c2goe1xuICAgICAgaWQ6IGB5LSR7aGFzaElkKGAke2l0ZW0ubGlua318JHtpdGVtLnRpdGxlfWApfWAsXG4gICAgICB0aXRsZTogaXRlbS50aXRsZSxcbiAgICAgIHVybDogaXRlbS5saW5rLFxuICAgICAgc291cmNlTmFtZTogaXRlbS5zb3VyY2VOYW1lIHx8ICdZYWhvbyBGaW5hbmNlJyxcbiAgICAgIHB1Ymxpc2hlZEF0OiBuZXcgRGF0ZShwdWJsaXNoZWRNcyA/PyBEYXRlLm5vdygpKS50b0lTT1N0cmluZygpLFxuICAgICAgcmVsYXRlZFN5bWJvbDogc3ltYm9sLFxuICAgICAgc3VtbWFyeTogc3VtbWFyeSAmJiBzdW1tYXJ5ICE9PSBpdGVtLnRpdGxlID8gc3VtbWFyeSA6IHVuZGVmaW5lZCxcbiAgICB9KTtcbiAgfVxuICByZXR1cm4gb3V0O1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0TmV3cyhzeW1ib2xzOiBzdHJpbmdbXSwgbGltaXRQZXJTeW1ib2wgPSA2KTogUHJvbWlzZTxOZXdzSXRlbVtdPiB7XG4gIGNvbnN0IHJlcXVlc3RlZCA9IHN5bWJvbHMuc2xpY2UoMCwgTUFYX1NZTUJPTFMpO1xuICBpZiAocmVxdWVzdGVkLmxlbmd0aCA9PT0gMCkgcmV0dXJuIFtdO1xuXG4gIGNvbnN0IHBlclN5bWJvbCA9IGF3YWl0IFByb21pc2UuYWxsKFxuICAgIHJlcXVlc3RlZC5tYXAoKHN5bWJvbCkgPT5cbiAgICAgIGxpbWl0KGFzeW5jICgpID0+IHtcbiAgICAgICAgY29uc3QgW3lhaG9vLCBrb3JlYW5dID0gYXdhaXQgUHJvbWlzZS5hbGwoW1xuICAgICAgICAgIGZldGNoU3ltYm9sRmVlZChzeW1ib2wpLmNhdGNoKCgpID0+IFtdIGFzIE5ld3NJdGVtW10pLFxuICAgICAgICAgIHNlYXJjaEtvcmVhbkZpbmFuY2VOZXdzKHN5bWJvbCwgRkVFRF9UVExfTVMpLmNhdGNoKCgpID0+IFtdIGFzIE5ld3NJdGVtW10pLFxuICAgICAgICBdKTtcbiAgICAgICAgcmV0dXJuIFsuLi55YWhvby5zbGljZSgwLCBsaW1pdFBlclN5bWJvbCksIC4uLmtvcmVhbi5zbGljZSgwLCAyKV07XG4gICAgICB9KS5jYXRjaCgoKSA9PiBudWxsKSxcbiAgICApLFxuICApO1xuXG4gIGNvbnN0IGFsbEZhaWxlZCA9IHBlclN5bWJvbC5ldmVyeSgocikgPT4gciA9PT0gbnVsbCk7XG4gIGlmIChhbGxGYWlsZWQpIHJldHVybiBzYW1wbGVOZXdzKHJlcXVlc3RlZCk7XG5cbiAgY29uc3Qgc2VlblRpdGxlcyA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICBjb25zdCBtZXJnZWQ6IE5ld3NJdGVtW10gPSBbXTtcbiAgZm9yIChjb25zdCBmZWVkIG9mIHBlclN5bWJvbCkge1xuICAgIGlmICghZmVlZCkgY29udGludWU7XG4gICAgZm9yIChjb25zdCBpdGVtIG9mIGZlZWQuc2xpY2UoMCwgbGltaXRQZXJTeW1ib2wgKyAyKSkge1xuICAgICAgY29uc3Qga2V5ID0gbm9ybWFsaXplVGl0bGUoaXRlbS50aXRsZSk7XG4gICAgICBpZiAoIWtleSB8fCBzZWVuVGl0bGVzLmhhcyhrZXkpKSBjb250aW51ZTtcbiAgICAgIHNlZW5UaXRsZXMuYWRkKGtleSk7XG4gICAgICBtZXJnZWQucHVzaChpdGVtKTtcbiAgICB9XG4gIH1cblxuICBtZXJnZWQuc29ydCgoYSwgYikgPT4gYi5wdWJsaXNoZWRBdC5sb2NhbGVDb21wYXJlKGEucHVibGlzaGVkQXQpKTtcbiAgcmV0dXJuIG1lcmdlZC5zbGljZSgwLCBNQVhfVE9UQUwpO1xufVxuIiwgIi8vIGNoYXJ0OnBpdm90LW5ld3MgXHUyMDE0IGZvciBlYWNoIGRldGVjdGVkIHBpdm90LCBmaW5kIGRhdGVkIGFydGljbGVzIG5lYXIgdGhlXG4vLyBwaXZvdDogR29vZ2xlIE5ld3MgUlNTIHdpdGggYSBcdTAwQjE1IGRheSB3aW5kb3cgcGx1cyBhbnkgWWFob28gcGVyLXRpY2tlciBSU1Ncbi8vIGl0ZW1zIHRoYXQgZmFsbCBpbnNpZGUgdGhlIHdpbmRvdy4gRGVkdXBlZCBieSB0aXRsZSwgc29ydGVkIGJ5IGRpc3RhbmNlXG4vLyB0byB0aGUgcGl2b3QsIG1heCA0IHBlciBwaXZvdC4gT25lIHBpdm90IGZhaWxpbmcgbmV2ZXIgZmFpbHMgdGhlIGJhdGNoLFxuLy8gYW5kIGlucHV0IHBpdm90IG9yZGVyIGlzIHByZXNlcnZlZC5cblxuaW1wb3J0IHR5cGUgeyBOZXdzSXRlbSwgUGl2b3ROZXdzUmVzdWx0LCBQaXZvdFBvaW50IH0gZnJvbSAnLi4vLi4vc2hhcmVkL3R5cGVzJztcbmltcG9ydCB7IHNlYXJjaEdvb2dsZU5ld3MsIHNlYXJjaEtvcmVhbkZpbmFuY2VOZXdzIH0gZnJvbSAnLi9nb29nbGVOZXdzJztcbmltcG9ydCB7IGZldGNoU3ltYm9sRmVlZCB9IGZyb20gJy4vbmV3cyc7XG5pbXBvcnQgeyBub3JtYWxpemVUaXRsZSwgcExpbWl0LCB0b1ltZCB9IGZyb20gJy4vdXRpbCc7XG5cbmNvbnN0IFdJTkRPV19EQVlTID0gNTtcbmNvbnN0IERBWV9NUyA9IDg2XzQwMF8wMDA7XG5jb25zdCBHT09HTEVfVFRMX01TID0gMzAgKiA2MF8wMDA7IC8vIHBlciBzeW1ib2wrcGl2b3QtZGF5IHdpbmRvd1xuY29uc3QgTUFYX0lURU1TX1BFUl9QSVZPVCA9IDQ7XG5jb25zdCBNQVhfUElWT1RTID0gMTI7XG5jb25zdCBsaW1pdCA9IHBMaW1pdCgzKTtcblxuYXN5bmMgZnVuY3Rpb24gbmV3c0ZvclBpdm90KFxuICBzeW1ib2w6IHN0cmluZyxcbiAgcGl2b3Q6IFBpdm90UG9pbnQsXG4gIHlhaG9vSXRlbXM6IE5ld3NJdGVtW10sXG4pOiBQcm9taXNlPE5ld3NJdGVtW10+IHtcbiAgY29uc3QgcGl2b3RNcyA9IHBpdm90LnRpbWUgKiAxMDAwO1xuICBjb25zdCBzdGFydE1zID0gcGl2b3RNcyAtIFdJTkRPV19EQVlTICogREFZX01TO1xuICBsZXQgZW5kTXMgPSBwaXZvdE1zICsgV0lORE9XX0RBWVMgKiBEQVlfTVM7XG4gIGNvbnN0IG5vd01zID0gRGF0ZS5ub3coKTtcbiAgaWYgKGVuZE1zID4gbm93TXMpIGVuZE1zID0gbm93TXM7IC8vIGNsYW1wICdiZWZvcmUnIHRvIHRvZGF5XG4gIGNvbnN0IGFmdGVyWW1kID0gdG9ZbWQobmV3IERhdGUoTWF0aC5taW4oc3RhcnRNcywgZW5kTXMgLSBEQVlfTVMpKSk7XG4gIGNvbnN0IGJlZm9yZVltZCA9IHRvWW1kKG5ldyBEYXRlKGVuZE1zKSk7XG5cbiAgY29uc3QgW2dvb2dsZSwga29yZWFuXSA9IGF3YWl0IFByb21pc2UuYWxsKFtcbiAgICBzZWFyY2hHb29nbGVOZXdzKHN5bWJvbCwgYWZ0ZXJZbWQsIGJlZm9yZVltZCwgR09PR0xFX1RUTF9NUykuY2F0Y2goKCkgPT4gW10gYXMgTmV3c0l0ZW1bXSksXG4gICAgc2VhcmNoS29yZWFuRmluYW5jZU5ld3Moc3ltYm9sLCBHT09HTEVfVFRMX01TLCBhZnRlclltZCwgYmVmb3JlWW1kKS5jYXRjaChcbiAgICAgICgpID0+IFtdIGFzIE5ld3NJdGVtW10sXG4gICAgKSxcbiAgXSk7XG5cbiAgY29uc3QgaW5XaW5kb3cgPSAoaXRlbTogTmV3c0l0ZW0pOiBib29sZWFuID0+IHtcbiAgICBjb25zdCBtcyA9IERhdGUucGFyc2UoaXRlbS5wdWJsaXNoZWRBdCk7XG4gICAgcmV0dXJuICFOdW1iZXIuaXNOYU4obXMpICYmIG1zID49IHN0YXJ0TXMgLSBEQVlfTVMgJiYgbXMgPD0gZW5kTXMgKyBEQVlfTVM7XG4gIH07XG5cbiAgY29uc3QgbWVyZ2VkOiBOZXdzSXRlbVtdID0gW107XG4gIGNvbnN0IHNlZW4gPSBuZXcgU2V0PHN0cmluZz4oKTtcbiAgZm9yIChjb25zdCBpdGVtIG9mIFsuLi5nb29nbGUsIC4uLmtvcmVhbiwgLi4ueWFob29JdGVtcy5maWx0ZXIoaW5XaW5kb3cpXSkge1xuICAgIGNvbnN0IGtleSA9IG5vcm1hbGl6ZVRpdGxlKGl0ZW0udGl0bGUpO1xuICAgIGlmICgha2V5IHx8IHNlZW4uaGFzKGtleSkpIGNvbnRpbnVlO1xuICAgIHNlZW4uYWRkKGtleSk7XG4gICAgbWVyZ2VkLnB1c2goaXRlbSk7XG4gIH1cblxuICBtZXJnZWQuc29ydChcbiAgICAoYSwgYikgPT5cbiAgICAgIE1hdGguYWJzKERhdGUucGFyc2UoYS5wdWJsaXNoZWRBdCkgLSBwaXZvdE1zKSAtXG4gICAgICBNYXRoLmFicyhEYXRlLnBhcnNlKGIucHVibGlzaGVkQXQpIC0gcGl2b3RNcyksXG4gICk7XG4gIHJldHVybiBtZXJnZWQuc2xpY2UoMCwgTUFYX0lURU1TX1BFUl9QSVZPVCk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRQaXZvdE5ld3MoXG4gIHN5bWJvbDogc3RyaW5nLFxuICBwaXZvdHM6IFBpdm90UG9pbnRbXSxcbik6IFByb21pc2U8UGl2b3ROZXdzUmVzdWx0W10+IHtcbiAgY29uc3QgYm91bmRlZCA9IHBpdm90cy5zbGljZSgwLCBNQVhfUElWT1RTKTtcbiAgaWYgKGJvdW5kZWQubGVuZ3RoID09PSAwKSByZXR1cm4gW107XG5cbiAgLy8gRmV0Y2ggdGhlIHN5bWJvbCdzIFlhaG9vIGZlZWQgb25jZSBmb3IgdGhlIHdob2xlIGJhdGNoOyBhIGZhaWx1cmUgaGVyZVxuICAvLyBqdXN0IG1lYW5zIHBpdm90IHdpbmRvd3MgcmVseSBvbiBHb29nbGUgTmV3cyBhbG9uZS5cbiAgY29uc3QgeWFob29JdGVtcyA9IGF3YWl0IGZldGNoU3ltYm9sRmVlZChzeW1ib2wpLmNhdGNoKCgpID0+IFtdIGFzIE5ld3NJdGVtW10pO1xuXG4gIGNvbnN0IHJlc3VsdHMgPSBhd2FpdCBQcm9taXNlLmFsbChcbiAgICBib3VuZGVkLm1hcCgocGl2b3QpID0+XG4gICAgICBsaW1pdCgoKSA9PiBuZXdzRm9yUGl2b3Qoc3ltYm9sLCBwaXZvdCwgeWFob29JdGVtcykpXG4gICAgICAgIC5jYXRjaCgoKSA9PiBbXSBhcyBOZXdzSXRlbVtdKVxuICAgICAgICAudGhlbigoaXRlbXMpOiBQaXZvdE5ld3NSZXN1bHQgPT4gKHsgcGl2b3QsIGl0ZW1zIH0pKSxcbiAgICApLFxuICApO1xuICByZXR1cm4gcmVzdWx0czsgLy8gUHJvbWlzZS5hbGwgcHJlc2VydmVzIGlucHV0IG9yZGVyXG59XG4iLCAiaW1wb3J0IHR5cGUgeyBRdWFudEluc2lnaHRSZXF1ZXN0LCBRdWFudEluc2lnaHRSZXNwb25zZSB9IGZyb20gJy4uLy4uL3NoYXJlZC90eXBlcyc7XG5pbXBvcnQgeyBnZXRMbG1TZXR0aW5ncyB9IGZyb20gJy4vbGxtU2V0dGluZ3MnO1xuXG5pbnRlcmZhY2UgQ2hhdFJlc3BvbnNlIHtcbiAgY2hvaWNlcz86IEFycmF5PHsgbWVzc2FnZT86IHsgY29udGVudD86IHN0cmluZyB9IH0+O1xufVxuXG5hc3luYyBmdW5jdGlvbiBpc1JlYWR5KGJhc2VVcmw6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICB0cnkge1xuICAgIGNvbnN0IHJlcyA9IGF3YWl0IGZldGNoKGAke2Jhc2VVcmx9L2hlYWx0aGAsIHsgc2lnbmFsOiBBYm9ydFNpZ25hbC50aW1lb3V0KDE1MDApIH0pO1xuICAgIHJldHVybiByZXMub2s7XG4gIH0gY2F0Y2gge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuXG5mdW5jdGlvbiBjb21wYWN0UmVxdWVzdChyZXE6IFF1YW50SW5zaWdodFJlcXVlc3QpOiBzdHJpbmcge1xuICBjb25zdCBlID0gcmVxLmV2YWx1YXRpb247XG4gIGNvbnN0IG5ld3MgPSByZXEubmV3c1xuICAgIC5zbGljZSgwLCA4KVxuICAgIC5tYXAoKGl0ZW0pID0+IGAtIFske2l0ZW0ucmVsYXRlZFN5bWJvbH1dICR7aXRlbS50aXRsZX0gKCR7aXRlbS5zb3VyY2VOYW1lfSwgJHtpdGVtLnB1Ymxpc2hlZEF0fSlgKVxuICAgIC5qb2luKCdcXG4nKTtcbiAgY29uc3QgY29tcG9uZW50cyA9IGUuY29tcG9uZW50c1xuICAgIC5tYXAoKGMpID0+IGAtICR7Yy5uYW1lfTogJHtjLnN0YXR1c30sICR7Yy5zY29yZSA+PSAwID8gJysnIDogJyd9JHtjLnNjb3JlfS4gJHtjLmV4cGxhbmF0aW9ufWApXG4gICAgLmpvaW4oJ1xcbicpO1xuICBjb25zdCBlYXJuaW5ncyA9IHJlcS5lYXJuaW5nc1xuICAgID8gYC0gVXBjb21pbmcgZGF0ZTogJHtyZXEuZWFybmluZ3MuZGF0ZX0gJHtyZXEuZWFybmluZ3MudGltZX1cbi0gQW5hbHlzdCBleHBlY3RlZCBFUFM6ICR7cmVxLmVhcm5pbmdzLmVwc0VzdGltYXRlID8/ICduL2EnfVxuLSBMYXRlc3QgYWN0dWFsIEVQUzogJHtyZXEuZWFybmluZ3MuZXBzQWN0dWFsID8/ICduL2EnfVxuLSBMYXRlc3Qgc3VycHJpc2U6ICR7cmVxLmVhcm5pbmdzLmVwc1N1cnByaXNlUGVyY2VudCA/PyAnbi9hJ30lXG4tIExhdGVzdCByZXBvcnRlZCBkYXRlOiAke3JlcS5lYXJuaW5ncy5sYXRlc3RSZXBvcnRlZERhdGUgPz8gJ24vYSd9YFxuICAgIDogJy0gbm9uZSc7XG4gIGNvbnN0IHZhbHVhdGlvbiA9IHJlcS52YWx1YXRpb25cbiAgICA/IGAtIFByaWNlOiAke3JlcS52YWx1YXRpb24ucHJpY2UgPz8gJ24vYSd9XG4tIE1hcmtldCBjYXA6ICR7cmVxLnZhbHVhdGlvbi5tYXJrZXRDYXAgPz8gJ24vYSd9XG4tIFJldmVudWU6ICR7cmVxLnZhbHVhdGlvbi50b3RhbFJldmVudWUgPz8gJ24vYSd9XG4tIEdyb3NzIHByb2ZpdDogJHtyZXEudmFsdWF0aW9uLmdyb3NzUHJvZml0ID8/ICduL2EnfVxuLSBFQklUREE6ICR7cmVxLnZhbHVhdGlvbi5lYml0ZGEgPz8gJ24vYSd9XG4tIE5ldCBpbmNvbWU6ICR7cmVxLnZhbHVhdGlvbi5uZXRJbmNvbWVUb0NvbW1vbiA/PyAnbi9hJ31cbi0gUHJvZml0IG1hcmdpbjogJHtyZXEudmFsdWF0aW9uLnByb2ZpdE1hcmdpbiA/PyAnbi9hJ31cbi0gUmV2ZW51ZSBncm93dGg6ICR7cmVxLnZhbHVhdGlvbi5yZXZlbnVlR3Jvd3RoID8/ICduL2EnfVxuLSBQL0U6ICR7cmVxLnZhbHVhdGlvbi50cmFpbGluZ1BlID8/ICduL2EnfVxuLSBGb3J3YXJkIFAvRTogJHtyZXEudmFsdWF0aW9uLmZvcndhcmRQZSA/PyAnbi9hJ31cbi0gUC9TOiAke3JlcS52YWx1YXRpb24ucHJpY2VUb1NhbGVzID8/ICduL2EnfVxuLSBFVi9SZXZlbnVlOiAke3JlcS52YWx1YXRpb24uZW50ZXJwcmlzZVRvUmV2ZW51ZSA/PyAnbi9hJ31cbi0gRVYvRUJJVERBOiAke3JlcS52YWx1YXRpb24uZW50ZXJwcmlzZVRvRWJpdGRhID8/ICduL2EnfVxuLSBGb3JtdWxhIGVzdGltYXRlczpcbiR7cmVxLnZhbHVhdGlvbi5lc3RpbWF0ZXMubWFwKCh4KSA9PiBgICAtICR7eC5sYWJlbH06IGZhaXIgdmFsdWUgJHt4LmZhaXJWYWx1ZSA/PyAnbi9hJ30sIHVwc2lkZSAke3gudXBzaWRlUGVyY2VudCA/PyAnbi9hJ30lLCBmb3JtdWxhOiAke3guZm9ybXVsYX1gKS5qb2luKCdcXG4nKX1gXG4gICAgOiAnLSBub25lJztcbiAgY29uc3QgbWFjcm8gPSByZXEubWFjcm9PdmVybGF5cz8ubGVuZ3RoXG4gICAgPyByZXEubWFjcm9PdmVybGF5c1xuICAgICAgICAubWFwKChzZXJpZXMpID0+IHtcbiAgICAgICAgICBjb25zdCBsYXN0ID0gc2VyaWVzLnBvaW50c1tzZXJpZXMucG9pbnRzLmxlbmd0aCAtIDFdO1xuICAgICAgICAgIHJldHVybiBgLSAke3Nlcmllcy5sYWJlbH06ICR7bGFzdCA/IGAke2xhc3QudmFsdWV9ICR7c2VyaWVzLnVuaXR9YCA6ICduL2EnfSAoJHtzZXJpZXMuc291cmNlTmFtZX0pYDtcbiAgICAgICAgfSlcbiAgICAgICAgLmpvaW4oJ1xcbicpXG4gICAgOiAnLSBubyBhY3RpdmUgbWFjcm8gb3ZlcmxheXMnO1xuICByZXR1cm4gYFxuU3ltYm9sOiAke3JlcS5zeW1ib2x9XG5SYW5nZTogJHtyZXEucmFuZ2V9XG5RdWVzdGlvbjogJHtyZXEucXVlc3Rpb24gPz8gJ0FuYWx5emUgdGhlIGN1cnJlbnQgc2V0dXAgYW5kIGV4cGxhaW4gdGhlIGJlc3QgZGVjaXNpb24uJ31cblNuYXBzaG90IGNhcHR1cmVkOiAke3JlcS5zbmFwc2hvdERhdGFVcmwgPyAneWVzJyA6ICdubyd9XG5cblNpZ25hbDpcbi0gRGVjaXNpb246ICR7ZS5kZWNpc2lvbn1cbi0gU2V0dXA6ICR7ZS5zZXR1cFR5cGV9XG4tIFJlZ2ltZTogJHtlLnJlZ2ltZX1cbi0gQ29uZmlkZW5jZTogJHtlLmNvbmZpZGVuY2V9LzEwMFxuLSBSZWFzb246ICR7ZS5yZWFzb259XG4tIE5vLXRyYWRlIHJlYXNvbnM6ICR7ZS5ub1RyYWRlUmVhc29ucy5qb2luKCc7ICcpIHx8ICdub25lJ31cblxuUmlzayBwbGFuOlxuLSBEaXJlY3Rpb246ICR7ZS5yaXNrLmRpcmVjdGlvbn1cbi0gRW50cnk6ICR7ZS5yaXNrLmVudHJ5fVxuLSBTdG9wOiAke2Uucmlzay5zdG9wfVxuLSBUYXJnZXQgMTogJHtlLnJpc2sudGFyZ2V0MX1cbi0gVGFyZ2V0IDI6ICR7ZS5yaXNrLnRhcmdldDJ9XG4tIFIvUiB0YXJnZXQgMTogJHtlLnJpc2sucmV3YXJkUmlzazF9XG4tIFBvc2l0aW9uIHNpemU6ICR7ZS5yaXNrLnBvc2l0aW9uU2l6ZX1cbi0gTWF4IGxvc3M6ICR7ZS5yaXNrLm1heERvbGxhckxvc3N9XG5cbkFuYWx5dGljczpcbi0gTGFzdCBjbG9zZTogJHtlLmFuYWx5dGljcy5sYXN0Q2xvc2V9XG4tIENoYW5nZTogJHtlLmFuYWx5dGljcy5jaGFuZ2VQZXJjZW50fSVcbi0gU01BMjA6ICR7ZS5hbmFseXRpY3Muc21hMjAgPz8gJ24vYSd9XG4tIFNNQTUwOiAke2UuYW5hbHl0aWNzLnNtYTUwID8/ICduL2EnfVxuLSBBVFIxNDogJHtlLmFuYWx5dGljcy5hdHIxNCA/PyAnbi9hJ30gKCR7ZS5hbmFseXRpY3MuYXRyUGVyY2VudCA/PyAnbi9hJ30lKVxuLSBWb2x1bWUgcmF0aW86ICR7ZS5hbmFseXRpY3Mudm9sdW1lUmF0aW8gPz8gJ24vYSd9XG4tIFN1cHBvcnQ6ICR7ZS5hbmFseXRpY3Muc3VwcG9ydCA/PyAnbi9hJ31cbi0gUmVzaXN0YW5jZTogJHtlLmFuYWx5dGljcy5yZXNpc3RhbmNlID8/ICduL2EnfVxuXG5CYWNrdGVzdCBzdW1tYXJ5OlxuLSBTdHJhdGVneTogJHtlLmJhY2t0ZXN0LnN0cmF0ZWd5TmFtZX0gJHtlLmJhY2t0ZXN0LnN0cmF0ZWd5VmVyc2lvbn1cbi0gVHJhZGVzOiAke2UuYmFja3Rlc3QudG90YWxUcmFkZXN9XG4tIFdpbiByYXRlOiAke2UuYmFja3Rlc3Qud2luUmF0ZX0lXG4tIEV4cGVjdGFuY3k6ICR7ZS5iYWNrdGVzdC5leHBlY3RhbmN5fVJcbi0gUHJvZml0IGZhY3RvcjogJHtlLmJhY2t0ZXN0LnByb2ZpdEZhY3Rvcn1cbi0gTWF4IGRyYXdkb3duOiAke2UuYmFja3Rlc3QubWF4RHJhd2Rvd259UlxuXG5Db21wb25lbnRzOlxuJHtjb21wb25lbnRzfVxuXG5FYXJuaW5ncyBjb250ZXh0OlxuJHtlYXJuaW5nc31cblxuVmFsdWF0aW9uIGNvbnRleHQ6XG4ke3ZhbHVhdGlvbn1cblxuTWFjcm8gb3ZlcmxheXMgYWN0aXZlIG9uIGNoYXJ0OlxuJHttYWNyb31cblxuUmVjZW50IHNjcmFwZWQgbmV3czpcbiR7bmV3cyB8fCAnLSBub25lJ31cbmAudHJpbSgpO1xufVxuXG5mdW5jdGlvbiBkZXRlcm1pbmlzdGljRmFsbGJhY2socmVxOiBRdWFudEluc2lnaHRSZXF1ZXN0LCBlcnJvcj86IHN0cmluZyk6IFF1YW50SW5zaWdodFJlc3BvbnNlIHtcbiAgY29uc3QgZSA9IHJlcS5ldmFsdWF0aW9uO1xuICBjb25zdCBsaW5lcyA9IFtcbiAgICBgIyMjIFF1YW50IG1lbW86ICR7ZS5kZWNpc2lvbi5yZXBsYWNlQWxsKCctJywgJyAnKX1gLFxuICAgIGBgLFxuICAgIGAtICoqU2V0dXA6KiogJHtlLnNldHVwVHlwZS5yZXBsYWNlQWxsKCctJywgJyAnKX1gLFxuICAgIGAtICoqUmVnaW1lOioqICR7ZS5yZWdpbWUucmVwbGFjZUFsbCgnLScsICcgJyl9YCxcbiAgICBgLSAqKkNvbmZpZGVuY2U6KiogJHtlLmNvbmZpZGVuY2V9LzEwMGAsXG4gICAgYC0gKipSaXNrIHBsYW46KiogZW50cnkgXFxgJHtlLnJpc2suZW50cnl9XFxgLCBzdG9wIFxcYCR7ZS5yaXNrLnN0b3B9XFxgLCB0YXJnZXQgMSBcXGAke2Uucmlzay50YXJnZXQxfVxcYCwgdGFyZ2V0IDIgXFxgJHtlLnJpc2sudGFyZ2V0Mn1cXGBgLFxuICAgIGAtICoqUG9zaXRpb246KiogJHtlLnJpc2sucG9zaXRpb25TaXplfSB1bml0cywgbWF4IGxvc3MgXFxgJHtlLnJpc2subWF4RG9sbGFyTG9zc31cXGAsIHRhcmdldCAxIHJld2FyZCBcXGAke2Uucmlzay5yZXdhcmRSaXNrMX1SXFxgYCxcbiAgXTtcbiAgaWYgKGUubm9UcmFkZVJlYXNvbnMubGVuZ3RoKSB7XG4gICAgbGluZXMucHVzaChgLSAqKlByaW1hcnkgYmxvY2tlcjoqKiAke2Uubm9UcmFkZVJlYXNvbnNbMF19YCk7XG4gIH0gZWxzZSB7XG4gICAgbGluZXMucHVzaChgLSAqKkFjdGlvbjoqKiAke2UucmVhc29ufWApO1xuICB9XG4gIGNvbnN0IHN0cm9uZ2VzdCA9IFsuLi5lLmNvbXBvbmVudHNdLnNvcnQoKGEsIGIpID0+IGIuc2NvcmUgLSBhLnNjb3JlKVswXTtcbiAgY29uc3Qgd2Vha2VzdCA9IFsuLi5lLmNvbXBvbmVudHNdLnNvcnQoKGEsIGIpID0+IGEuc2NvcmUgLSBiLnNjb3JlKVswXTtcbiAgaWYgKHN0cm9uZ2VzdCkgbGluZXMucHVzaChgLSAqKkJlc3QgZXZpZGVuY2U6KiogJHtzdHJvbmdlc3QubmFtZX0gLSAke3N0cm9uZ2VzdC5leHBsYW5hdGlvbn1gKTtcbiAgaWYgKHdlYWtlc3QgJiYgd2Vha2VzdC5zY29yZSA8IDApIGxpbmVzLnB1c2goYC0gKipSaXNrIGV2aWRlbmNlOioqICR7d2Vha2VzdC5uYW1lfSAtICR7d2Vha2VzdC5leHBsYW5hdGlvbn1gKTtcbiAgaWYgKGVycm9yKSBsaW5lcy5wdXNoKGBcXG5fTG9jYWwgTExNIG5vdGU6ICR7ZXJyb3J9X2ApO1xuICByZXR1cm4ge1xuICAgIG9rOiBmYWxzZSxcbiAgICBzb3VyY2U6ICdkZXRlcm1pbmlzdGljLWZhbGxiYWNrJyxcbiAgICBhbnN3ZXI6IGxpbmVzLmpvaW4oJ1xcbicpLFxuICAgIGdlbmVyYXRlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG4gICAgZXJyb3IsXG4gIH07XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBhbmFseXplUXVhbnQocmVxOiBRdWFudEluc2lnaHRSZXF1ZXN0KTogUHJvbWlzZTxRdWFudEluc2lnaHRSZXNwb25zZT4ge1xuICBjb25zdCBzZXR0aW5ncyA9IGdldExsbVNldHRpbmdzKCk7XG4gIGlmICghc2V0dGluZ3MuZW5hYmxlZCkge1xuICAgIHJldHVybiBkZXRlcm1pbmlzdGljRmFsbGJhY2soXG4gICAgICByZXEsXG4gICAgICAnTG9jYWwgTExNIGlzIGRpc2FibGVkLiBFbmFibGUgaXQgaW4gb25ib2FyZGluZyBvciBzZXQgUVVBTlRfTExNX0VOQUJMRUQ9MSBhbmQgUVVBTlRfTExNX0JBU0VfVVJMIHRvIHVzZSBhbiBPcGVuQUktY29tcGF0aWJsZSBsb2NhbCBzZXJ2ZXIuJyxcbiAgICApO1xuICB9XG5cbiAgdHJ5IHtcbiAgICBpZiAoIShhd2FpdCBpc1JlYWR5KHNldHRpbmdzLmJhc2VVcmwpKSkge1xuICAgICAgcmV0dXJuIGRldGVybWluaXN0aWNGYWxsYmFjayhyZXEsICdMb2NhbCBMTE0gc2VydmVyIGlzIG5vdCByZWFkeS4nKTtcbiAgICB9XG5cbiAgICBjb25zdCBwcm9tcHQgPSBjb21wYWN0UmVxdWVzdChyZXEpO1xuICAgIGNvbnN0IHJlcyA9IGF3YWl0IGZldGNoKGAke3NldHRpbmdzLmJhc2VVcmx9L3YxL2NoYXQvY29tcGxldGlvbnNgLCB7XG4gICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgIGhlYWRlcnM6IHsgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyB9LFxuICAgICAgc2lnbmFsOiBBYm9ydFNpZ25hbC50aW1lb3V0KDI4XzAwMCksXG4gICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgIG1vZGVsOiBzZXR0aW5ncy5tb2RlbCxcbiAgICAgICAgdGVtcGVyYXR1cmU6IDAuMixcbiAgICAgICAgbWF4X3Rva2VuczogNzAwLFxuICAgICAgICBtZXNzYWdlczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHJvbGU6ICdzeXN0ZW0nLFxuICAgICAgICAgICAgY29udGVudDpcbiAgICAgICAgICAgICAgJ1lvdSBhcmUgUXVhbnREZXNrLCBhIHN0cmljdCBwZXJzb25hbCBxdWFudCB0cmFkaW5nIGFzc2lzdGFudCBmb3IgdGhlIFF1YW50IGFwcC4gVGhpbmsgbGlrZSBhIHNlbmlvciBxdWFudCB0cmFkZXIgYW5kIHJpc2sgbWFuYWdlci4gRXhwbGFpbiBzaWduYWxzIGluIGRpc2NpcGxpbmVkIHRyYWRpbmcgbGFuZ3VhZ2UuIFNlcGFyYXRlIHNldHVwLCBldmlkZW5jZSwgaW52YWxpZGF0aW9uLCByaXNrLCBhbmQgYWN0aW9uLiBEbyBub3QgZ2l2ZSBjZXJ0YWludHksIGRvIG5vdCBoeXBlLCBkbyBub3QgcmVjb21tZW5kIG92ZXJzaXplZCB0cmFkZXMsIGFuZCBkbyBub3QgaWdub3JlIG5vLXRyYWRlIGJsb2NrZXJzLiBSZXR1cm4gY29uY2lzZSBHaXRIdWItZmxhdm9yZWQgTWFya2Rvd24gd2l0aCBoZWFkaW5ncywgYnVsbGV0cywgYm9sZCBsYWJlbHMsIGFuZCBpbmxpbmUgY29kZSBmb3IgZXhhY3QgcHJpY2VzLicsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICByb2xlOiAndXNlcicsXG4gICAgICAgICAgICBjb250ZW50OiByZXEudGhpbmtpbmdNb2RlXG4gICAgICAgICAgICAgID8gYFVzZSB0aGlua2luZyBtb2RlIGludGVybmFsbHksIHRoZW4gcHJvdmlkZSBvbmx5IHRoZSBjb25jaXNlIGZpbmFsIGRlY2lzaW9uIG1lbW8uXFxuXFxuJHtwcm9tcHR9YFxuICAgICAgICAgICAgICA6IHByb21wdCxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSksXG4gICAgfSk7XG4gICAgaWYgKCFyZXMub2spIHRocm93IG5ldyBFcnJvcihgTExNIEhUVFAgJHtyZXMuc3RhdHVzfWApO1xuICAgIGNvbnN0IGpzb24gPSAoYXdhaXQgcmVzLmpzb24oKSkgYXMgQ2hhdFJlc3BvbnNlO1xuICAgIGNvbnN0IGFuc3dlciA9IGpzb24uY2hvaWNlcz8uWzBdPy5tZXNzYWdlPy5jb250ZW50Py50cmltKCk7XG4gICAgaWYgKCFhbnN3ZXIpIHRocm93IG5ldyBFcnJvcignTExNIHJldHVybmVkIGFuIGVtcHR5IGFuc3dlcicpO1xuICAgIHJldHVybiB7XG4gICAgICBvazogdHJ1ZSxcbiAgICAgIHNvdXJjZTogJ2xvY2FsLWxsbScsXG4gICAgICBtb2RlbDogc2V0dGluZ3MubW9kZWwsXG4gICAgICBhbnN3ZXIsXG4gICAgICBnZW5lcmF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuICAgIH07XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIGNvbnN0IG1lc3NhZ2UgPSBlcnIgaW5zdGFuY2VvZiBFcnJvciA/IGVyci5tZXNzYWdlIDogJ0xvY2FsIExMTSByZXF1ZXN0IGZhaWxlZC4nO1xuICAgIHJldHVybiBkZXRlcm1pbmlzdGljRmFsbGJhY2socmVxLCBtZXNzYWdlKTtcbiAgfVxufVxuIiwgIi8vIHF1b3RlczpnZXQgXHUyMDE0IGxpdmUgcXVvdGVzIGRlcml2ZWQgZnJvbSB0aGUgdjggY2hhcnQgZW5kcG9pbnQgKDFkLzVtKSxcbi8vIHdoaWNoIG5lZWRzIG5vIGF1dGguIE9uZSBRdW90ZSBpcyBhbHdheXMgcmV0dXJuZWQgcGVyIHJlcXVlc3RlZCBzeW1ib2w7XG4vLyBwZXItc3ltYm9sIGZhaWx1cmVzIGZhbGwgYmFjayB0byBkZXRlcm1pbmlzdGljIHNhbXBsZSBxdW90ZXMuXG5cbmltcG9ydCB0eXBlIHsgUXVvdGUgfSBmcm9tICcuLi8uLi9zaGFyZWQvdHlwZXMnO1xuaW1wb3J0IHsgc2FtcGxlUXVvdGUgfSBmcm9tICcuL3NhbXBsZSc7XG5pbXBvcnQgeyBwTGltaXQsIHJvdW5kMiB9IGZyb20gJy4vdXRpbCc7XG5pbXBvcnQgeyBmZXRjaFlhaG9vQ2hhcnQgfSBmcm9tICcuL3lhaG9vJztcblxuY29uc3QgUVVPVEVfVFRMX01TID0gNDVfMDAwO1xuY29uc3QgbGltaXQgPSBwTGltaXQoNCk7XG5cbmFzeW5jIGZ1bmN0aW9uIGZldGNoUXVvdGUoc3ltYm9sOiBzdHJpbmcpOiBQcm9taXNlPFF1b3RlPiB7XG4gIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGZldGNoWWFob29DaGFydChzeW1ib2wsICcxZCcsICc1bScsIFFVT1RFX1RUTF9NUyk7XG4gIGNvbnN0IG1ldGEgPSByZXN1bHQubWV0YSA/PyB7fTtcblxuICBjb25zdCBwcmljZSA9XG4gICAgdHlwZW9mIG1ldGEucmVndWxhck1hcmtldFByaWNlID09PSAnbnVtYmVyJyAmJiBOdW1iZXIuaXNGaW5pdGUobWV0YS5yZWd1bGFyTWFya2V0UHJpY2UpXG4gICAgICA/IG1ldGEucmVndWxhck1hcmtldFByaWNlXG4gICAgICA6IG51bGw7XG4gIGNvbnN0IHByZXZSYXcgPSBtZXRhLmNoYXJ0UHJldmlvdXNDbG9zZSA/PyBtZXRhLnByZXZpb3VzQ2xvc2U7XG4gIGNvbnN0IHByZXZpb3VzQ2xvc2UgPVxuICAgIHR5cGVvZiBwcmV2UmF3ID09PSAnbnVtYmVyJyAmJiBOdW1iZXIuaXNGaW5pdGUocHJldlJhdykgPyBwcmV2UmF3IDogbnVsbDtcblxuICBsZXQgY2hhbmdlOiBudW1iZXIgfCBudWxsID0gbnVsbDtcbiAgbGV0IGNoYW5nZVBlcmNlbnQ6IG51bWJlciB8IG51bGwgPSBudWxsO1xuICBpZiAocHJpY2UgIT09IG51bGwgJiYgcHJldmlvdXNDbG9zZSAhPT0gbnVsbCkge1xuICAgIGNoYW5nZSA9IHJvdW5kMihwcmljZSAtIHByZXZpb3VzQ2xvc2UpO1xuICAgIGNoYW5nZVBlcmNlbnQgPSBwcmV2aW91c0Nsb3NlICE9PSAwID8gcm91bmQyKChjaGFuZ2UgLyBwcmV2aW91c0Nsb3NlKSAqIDEwMCkgOiBudWxsO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBzeW1ib2wsXG4gICAgcHJpY2UsXG4gICAgY2hhbmdlLFxuICAgIGNoYW5nZVBlcmNlbnQsXG4gICAgcHJldmlvdXNDbG9zZSxcbiAgICBjdXJyZW5jeTogdHlwZW9mIG1ldGEuY3VycmVuY3kgPT09ICdzdHJpbmcnICYmIG1ldGEuY3VycmVuY3kgPyBtZXRhLmN1cnJlbmN5IDogJ1VTRCcsXG4gICAgbWFya2V0U3RhdGU6XG4gICAgICB0eXBlb2YgbWV0YS5tYXJrZXRTdGF0ZSA9PT0gJ3N0cmluZycgJiYgbWV0YS5tYXJrZXRTdGF0ZSA/IG1ldGEubWFya2V0U3RhdGUgOiB1bmRlZmluZWQsXG4gICAgdXBkYXRlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG4gICAgc291cmNlOiAnbGl2ZScsXG4gIH07XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRRdW90ZXMoc3ltYm9sczogc3RyaW5nW10pOiBQcm9taXNlPFF1b3RlW10+IHtcbiAgcmV0dXJuIFByb21pc2UuYWxsKFxuICAgIHN5bWJvbHMubWFwKChzeW1ib2wpID0+XG4gICAgICBsaW1pdCgoKSA9PiBmZXRjaFF1b3RlKHN5bWJvbCkpLmNhdGNoKCgpID0+IHNhbXBsZVF1b3RlKHN5bWJvbCkpLFxuICAgICksXG4gICk7XG59XG4iLCAiaW1wb3J0IHR5cGUgeyBWYWx1YXRpb25TbmFwc2hvdCB9IGZyb20gJy4uLy4uL3NoYXJlZC90eXBlcyc7XG5pbXBvcnQgeyBUdGxDYWNoZSB9IGZyb20gJy4vY2FjaGUnO1xuaW1wb3J0IHsgbG9va3VwTmFtZSB9IGZyb20gJy4vZGF0YUZpbGVzJztcbmltcG9ydCB7IGJhc2VQcmljZUZvciB9IGZyb20gJy4vc2FtcGxlJztcbmltcG9ydCB7IHF1b3RlU3VtbWFyeSwgcmF3TnVtYmVyIH0gZnJvbSAnLi95YWhvbyc7XG5cbmNvbnN0IFRUTF9NUyA9IDYgKiA2MCAqIDYwXzAwMDtcbmNvbnN0IGNhY2hlID0gbmV3IFR0bENhY2hlPFZhbHVhdGlvblNuYXBzaG90PigzMDApO1xuXG5mdW5jdGlvbiByb3VuZCh2YWx1ZTogbnVtYmVyIHwgbnVsbCwgZGlnaXRzID0gMik6IG51bWJlciB8IG51bGwge1xuICBpZiAodmFsdWUgPT09IG51bGwgfHwgIU51bWJlci5pc0Zpbml0ZSh2YWx1ZSkpIHJldHVybiBudWxsO1xuICBjb25zdCBzY2FsZSA9IDEwICoqIGRpZ2l0cztcbiAgcmV0dXJuIE1hdGgucm91bmQodmFsdWUgKiBzY2FsZSkgLyBzY2FsZTtcbn1cblxuZnVuY3Rpb24gcGN0KGZhaXJWYWx1ZTogbnVtYmVyIHwgbnVsbCwgcHJpY2U6IG51bWJlciB8IG51bGwpOiBudW1iZXIgfCBudWxsIHtcbiAgaWYgKGZhaXJWYWx1ZSA9PT0gbnVsbCB8fCBwcmljZSA9PT0gbnVsbCB8fCBwcmljZSA9PT0gMCkgcmV0dXJuIG51bGw7XG4gIHJldHVybiByb3VuZCgoKGZhaXJWYWx1ZSAtIHByaWNlKSAvIHByaWNlKSAqIDEwMCwgMSk7XG59XG5cbmZ1bmN0aW9uIGVzdGltYXRlKFxuICBsYWJlbDogc3RyaW5nLFxuICBmYWlyVmFsdWU6IG51bWJlciB8IG51bGwsXG4gIHByaWNlOiBudW1iZXIgfCBudWxsLFxuICBmb3JtdWxhOiBzdHJpbmcsXG4pOiBWYWx1YXRpb25TbmFwc2hvdFsnZXN0aW1hdGVzJ11bbnVtYmVyXSB7XG4gIHJldHVybiB7XG4gICAgbGFiZWwsXG4gICAgZmFpclZhbHVlOiByb3VuZChmYWlyVmFsdWUpLFxuICAgIHVwc2lkZVBlcmNlbnQ6IHBjdChmYWlyVmFsdWUsIHByaWNlKSxcbiAgICBmb3JtdWxhLFxuICB9O1xufVxuXG5mdW5jdGlvbiBzYW1wbGVWYWx1YXRpb24oc3ltYm9sOiBzdHJpbmcpOiBWYWx1YXRpb25TbmFwc2hvdCB7XG4gIGNvbnN0IHN5bSA9IHN5bWJvbC50b1VwcGVyQ2FzZSgpO1xuICBjb25zdCBwcmljZSA9IGJhc2VQcmljZUZvcihzeW0pO1xuICBjb25zdCByZXZlbnVlID0gcHJpY2UgKiAxXzAwMF8wMDBfMDAwO1xuICBjb25zdCBtYXJnaW4gPSAwLjE4O1xuICBjb25zdCBzaGFyZXMgPSAxXzAwMF8wMDBfMDAwO1xuICBjb25zdCBuZXRJbmNvbWUgPSByZXZlbnVlICogbWFyZ2luO1xuICBjb25zdCBmYWlyRWFybmluZ3MgPSAobmV0SW5jb21lICogMjQpIC8gc2hhcmVzO1xuICBjb25zdCBmYWlyU2FsZXMgPSAocmV2ZW51ZSAqIDUpIC8gc2hhcmVzO1xuICByZXR1cm4ge1xuICAgIHN5bWJvbDogc3ltLFxuICAgIGNvbXBhbnlOYW1lOiBsb29rdXBOYW1lKHN5bSkgPz8gc3ltLFxuICAgIHByaWNlLFxuICAgIG1hcmtldENhcDogcHJpY2UgKiBzaGFyZXMsXG4gICAgZW50ZXJwcmlzZVZhbHVlOiBwcmljZSAqIHNoYXJlcyAqIDEuMDUsXG4gICAgdG90YWxSZXZlbnVlOiByZXZlbnVlLFxuICAgIGdyb3NzUHJvZml0OiByZXZlbnVlICogMC41MixcbiAgICBlYml0ZGE6IHJldmVudWUgKiAwLjI1LFxuICAgIG5ldEluY29tZVRvQ29tbW9uOiBuZXRJbmNvbWUsXG4gICAgcHJvZml0TWFyZ2luOiBtYXJnaW4sXG4gICAgcmV2ZW51ZUdyb3d0aDogMC4wOCxcbiAgICB0cmFpbGluZ1BlOiAyNCxcbiAgICBmb3J3YXJkUGU6IDIxLFxuICAgIHByaWNlVG9TYWxlczogNSxcbiAgICBwcmljZVRvQm9vazogNyxcbiAgICBlbnRlcnByaXNlVG9SZXZlbnVlOiA1LjIsXG4gICAgZW50ZXJwcmlzZVRvRWJpdGRhOiAxOCxcbiAgICBmb3J3YXJkRXBzOiBwcmljZSAvIDIxLFxuICAgIHRhcmdldE1lYW5QcmljZTogcHJpY2UgKiAxLjA4LFxuICAgIHNoYXJlc091dHN0YW5kaW5nOiBzaGFyZXMsXG4gICAgZXN0aW1hdGVzOiBbXG4gICAgICBlc3RpbWF0ZSgnRm9yd2FyZCBlYXJuaW5ncyB2YWx1ZScsIGZhaXJFYXJuaW5ncywgcHJpY2UsICduZXQgaW5jb21lIHggMjQgUC9FIC8gc2hhcmVzIG91dHN0YW5kaW5nJyksXG4gICAgICBlc3RpbWF0ZSgnU2FsZXMgbXVsdGlwbGUgdmFsdWUnLCBmYWlyU2FsZXMsIHByaWNlLCAncmV2ZW51ZSB4IDUgUC9TIC8gc2hhcmVzIG91dHN0YW5kaW5nJyksXG4gICAgICBlc3RpbWF0ZSgnQW5hbHlzdCB0YXJnZXQgdmFsdWUnLCBwcmljZSAqIDEuMDgsIHByaWNlLCAnWWFob28gYW5hbHlzdCBtZWFuIHRhcmdldCBwcmljZScpLFxuICAgIF0sXG4gICAgc291cmNlOiAnc2FtcGxlJyxcbiAgfTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldFZhbHVhdGlvbihzeW1ib2w6IHN0cmluZyk6IFByb21pc2U8VmFsdWF0aW9uU25hcHNob3Q+IHtcbiAgY29uc3Qgc3ltID0gc3ltYm9sLnRvVXBwZXJDYXNlKCk7XG4gIGNvbnN0IGNhY2hlZCA9IGNhY2hlLmdldChzeW0pO1xuICBpZiAoY2FjaGVkKSByZXR1cm4gY2FjaGVkO1xuICB0cnkge1xuICAgIGNvbnN0IHN1bW1hcnkgPSBhd2FpdCBxdW90ZVN1bW1hcnkoc3ltLCBbXG4gICAgICAncHJpY2UnLFxuICAgICAgJ3N1bW1hcnlEZXRhaWwnLFxuICAgICAgJ2RlZmF1bHRLZXlTdGF0aXN0aWNzJyxcbiAgICAgICdmaW5hbmNpYWxEYXRhJyxcbiAgICBdKTtcbiAgICBjb25zdCBwcmljZSA9XG4gICAgICByYXdOdW1iZXIoc3VtbWFyeS5wcmljZT8ucmVndWxhck1hcmtldFByaWNlKSA/P1xuICAgICAgcmF3TnVtYmVyKHN1bW1hcnkuZmluYW5jaWFsRGF0YT8udGFyZ2V0TWVhblByaWNlKSA/P1xuICAgICAgbnVsbDtcbiAgICBjb25zdCBtYXJrZXRDYXAgPSByYXdOdW1iZXIoc3VtbWFyeS5wcmljZT8ubWFya2V0Q2FwKTtcbiAgICBjb25zdCBzaGFyZXMgPSByYXdOdW1iZXIoc3VtbWFyeS5kZWZhdWx0S2V5U3RhdGlzdGljcz8uc2hhcmVzT3V0c3RhbmRpbmcpO1xuICAgIGNvbnN0IHJldmVudWUgPSByYXdOdW1iZXIoc3VtbWFyeS5maW5hbmNpYWxEYXRhPy50b3RhbFJldmVudWUpO1xuICAgIGNvbnN0IG5ldEluY29tZSA9IHJhd051bWJlcihzdW1tYXJ5LmZpbmFuY2lhbERhdGE/Lm5ldEluY29tZVRvQ29tbW9uKTtcbiAgICBjb25zdCBwcmljZVRvU2FsZXMgPSByYXdOdW1iZXIoc3VtbWFyeS5zdW1tYXJ5RGV0YWlsPy5wcmljZVRvU2FsZXNUcmFpbGluZzEyTW9udGhzKTtcbiAgICBjb25zdCB0cmFpbGluZ1BlID0gcmF3TnVtYmVyKHN1bW1hcnkuc3VtbWFyeURldGFpbD8udHJhaWxpbmdQRSk7XG4gICAgY29uc3QgdGFyZ2V0TWVhbiA9IHJhd051bWJlcihzdW1tYXJ5LmZpbmFuY2lhbERhdGE/LnRhcmdldE1lYW5QcmljZSk7XG5cbiAgICBjb25zdCBmYWlyRm9yd2FyZEVhcm5pbmdzID1cbiAgICAgIG5ldEluY29tZSAhPT0gbnVsbCAmJiBzaGFyZXMgIT09IG51bGwgJiYgdHJhaWxpbmdQZSAhPT0gbnVsbCAmJiBzaGFyZXMgPiAwXG4gICAgICAgID8gKG5ldEluY29tZSAqIHRyYWlsaW5nUGUpIC8gc2hhcmVzXG4gICAgICAgIDogbnVsbDtcbiAgICBjb25zdCBmYWlyU2FsZXMgPVxuICAgICAgcmV2ZW51ZSAhPT0gbnVsbCAmJiBzaGFyZXMgIT09IG51bGwgJiYgcHJpY2VUb1NhbGVzICE9PSBudWxsICYmIHNoYXJlcyA+IDBcbiAgICAgICAgPyAocmV2ZW51ZSAqIHByaWNlVG9TYWxlcykgLyBzaGFyZXNcbiAgICAgICAgOiBudWxsO1xuXG4gICAgY29uc3Qgc25hcHNob3Q6IFZhbHVhdGlvblNuYXBzaG90ID0ge1xuICAgICAgc3ltYm9sOiBzeW0sXG4gICAgICBjb21wYW55TmFtZTogc3VtbWFyeS5wcmljZT8ubG9uZ05hbWUgfHwgc3VtbWFyeS5wcmljZT8uc2hvcnROYW1lIHx8IGxvb2t1cE5hbWUoc3ltKSB8fCBzeW0sXG4gICAgICBwcmljZTogcm91bmQocHJpY2UpLFxuICAgICAgbWFya2V0Q2FwOiByb3VuZChtYXJrZXRDYXAsIDApLFxuICAgICAgZW50ZXJwcmlzZVZhbHVlOiByb3VuZChyYXdOdW1iZXIoc3VtbWFyeS5kZWZhdWx0S2V5U3RhdGlzdGljcz8uZW50ZXJwcmlzZVZhbHVlKSwgMCksXG4gICAgICB0b3RhbFJldmVudWU6IHJvdW5kKHJldmVudWUsIDApLFxuICAgICAgZ3Jvc3NQcm9maXQ6IHJvdW5kKHJhd051bWJlcihzdW1tYXJ5LmZpbmFuY2lhbERhdGE/Lmdyb3NzUHJvZml0cyksIDApLFxuICAgICAgZWJpdGRhOiByb3VuZChyYXdOdW1iZXIoc3VtbWFyeS5maW5hbmNpYWxEYXRhPy5lYml0ZGEpLCAwKSxcbiAgICAgIG5ldEluY29tZVRvQ29tbW9uOiByb3VuZChuZXRJbmNvbWUsIDApLFxuICAgICAgcHJvZml0TWFyZ2luOiByb3VuZChyYXdOdW1iZXIoc3VtbWFyeS5maW5hbmNpYWxEYXRhPy5wcm9maXRNYXJnaW5zKSwgNCksXG4gICAgICByZXZlbnVlR3Jvd3RoOiByb3VuZChyYXdOdW1iZXIoc3VtbWFyeS5maW5hbmNpYWxEYXRhPy5yZXZlbnVlR3Jvd3RoKSwgNCksXG4gICAgICB0cmFpbGluZ1BlOiByb3VuZCh0cmFpbGluZ1BlKSxcbiAgICAgIGZvcndhcmRQZTogcm91bmQocmF3TnVtYmVyKHN1bW1hcnkuc3VtbWFyeURldGFpbD8uZm9yd2FyZFBFKSksXG4gICAgICBwcmljZVRvU2FsZXM6IHJvdW5kKHByaWNlVG9TYWxlcyksXG4gICAgICBwcmljZVRvQm9vazogcm91bmQocmF3TnVtYmVyKHN1bW1hcnkuc3VtbWFyeURldGFpbD8ucHJpY2VUb0Jvb2spKSxcbiAgICAgIGVudGVycHJpc2VUb1JldmVudWU6IHJvdW5kKHJhd051bWJlcihzdW1tYXJ5LmRlZmF1bHRLZXlTdGF0aXN0aWNzPy5lbnRlcnByaXNlVG9SZXZlbnVlKSksXG4gICAgICBlbnRlcnByaXNlVG9FYml0ZGE6IHJvdW5kKHJhd051bWJlcihzdW1tYXJ5LmRlZmF1bHRLZXlTdGF0aXN0aWNzPy5lbnRlcnByaXNlVG9FYml0ZGEpKSxcbiAgICAgIGZvcndhcmRFcHM6IHJvdW5kKHJhd051bWJlcihzdW1tYXJ5LmRlZmF1bHRLZXlTdGF0aXN0aWNzPy5mb3J3YXJkRXBzKSksXG4gICAgICB0YXJnZXRNZWFuUHJpY2U6IHJvdW5kKHRhcmdldE1lYW4pLFxuICAgICAgc2hhcmVzT3V0c3RhbmRpbmc6IHJvdW5kKHNoYXJlcywgMCksXG4gICAgICBlc3RpbWF0ZXM6IFtcbiAgICAgICAgZXN0aW1hdGUoJ0ZvcndhcmQgZWFybmluZ3MgdmFsdWUnLCBmYWlyRm9yd2FyZEVhcm5pbmdzLCBwcmljZSwgJ25ldCBpbmNvbWUgeCB0cmFpbGluZyBQL0UgLyBzaGFyZXMgb3V0c3RhbmRpbmcnKSxcbiAgICAgICAgZXN0aW1hdGUoJ1NhbGVzIG11bHRpcGxlIHZhbHVlJywgZmFpclNhbGVzLCBwcmljZSwgJ3JldmVudWUgeCB0cmFpbGluZyBQL1MgLyBzaGFyZXMgb3V0c3RhbmRpbmcnKSxcbiAgICAgICAgZXN0aW1hdGUoJ0FuYWx5c3QgdGFyZ2V0IHZhbHVlJywgdGFyZ2V0TWVhbiwgcHJpY2UsICdZYWhvbyBhbmFseXN0IG1lYW4gdGFyZ2V0IHByaWNlJyksXG4gICAgICBdLFxuICAgICAgc291cmNlOiAnbGl2ZScsXG4gICAgfTtcbiAgICBjYWNoZS5zZXQoc3ltLCBzbmFwc2hvdCwgVFRMX01TKTtcbiAgICByZXR1cm4gc25hcHNob3Q7XG4gIH0gY2F0Y2gge1xuICAgIGNvbnN0IHNhbXBsZSA9IHNhbXBsZVZhbHVhdGlvbihzeW0pO1xuICAgIGNhY2hlLnNldChzeW0sIHNhbXBsZSwgMTAgKiA2MF8wMDApO1xuICAgIHJldHVybiBzYW1wbGU7XG4gIH1cbn1cbiIsICIvLyBzeW1ib2xzOnNlYXJjaCBcdTIwMTQgWWFob28gc3ltYm9sIHNlYXJjaCBtYXBwZWQgdG8gU3ltYm9sU3VnZ2VzdGlvbltdLCB3aXRoIGFuXG4vLyBvZmZsaW5lIGZhbGxiYWNrIHRoYXQgZmlsdGVycyB0aGUgYnVuZGxlZCBzeW1ib2wgZGlyZWN0b3J5LlxuXG5pbXBvcnQgdHlwZSB7IEluc3RydW1lbnRUeXBlLCBTeW1ib2xTdWdnZXN0aW9uIH0gZnJvbSAnLi4vLi4vc2hhcmVkL3R5cGVzJztcbmltcG9ydCB7IGdldFN5bWJvbERpcmVjdG9yeSB9IGZyb20gJy4vZGF0YUZpbGVzJztcbmltcG9ydCB7IHNlYXJjaFlhaG9vIH0gZnJvbSAnLi95YWhvbyc7XG5cbmNvbnN0IE1BWF9SRVNVTFRTID0gODtcblxuZnVuY3Rpb24gbWFwUXVvdGVUeXBlKHF1b3RlVHlwZTogc3RyaW5nIHwgdW5kZWZpbmVkKTogSW5zdHJ1bWVudFR5cGUgfCBudWxsIHtcbiAgY29uc3QgdCA9IChxdW90ZVR5cGUgPz8gJycpLnRvVXBwZXJDYXNlKCk7XG4gIGlmICh0ID09PSAnRVRGJykgcmV0dXJuICdldGYnO1xuICBpZiAodCA9PT0gJ0VRVUlUWScpIHJldHVybiAnc3RvY2snO1xuICByZXR1cm4gbnVsbDtcbn1cblxuLyoqIEZpbHRlciB0aGUgYnVuZGxlZCBkaXJlY3Rvcnk6IGV4YWN0IHN5bWJvbCwgdGhlbiBzeW1ib2wgcHJlZml4LCB0aGVuIG5hbWUuICovXG5leHBvcnQgZnVuY3Rpb24gc2VhcmNoRGlyZWN0b3J5KHF1ZXJ5OiBzdHJpbmcpOiBTeW1ib2xTdWdnZXN0aW9uW10ge1xuICBjb25zdCBxID0gcXVlcnkudHJpbSgpLnRvVXBwZXJDYXNlKCk7XG4gIGlmICghcSkgcmV0dXJuIFtdO1xuICBjb25zdCBxTG93ZXIgPSBxdWVyeS50cmltKCkudG9Mb3dlckNhc2UoKTtcbiAgY29uc3QgZGlyID0gZ2V0U3ltYm9sRGlyZWN0b3J5KCk7XG5cbiAgY29uc3Qgc2NvcmVkID0gZGlyXG4gICAgLm1hcCgoZW50cnkpID0+IHtcbiAgICAgIGxldCBzY29yZSA9IC0xO1xuICAgICAgaWYgKGVudHJ5LnN5bWJvbCA9PT0gcSkgc2NvcmUgPSAzO1xuICAgICAgZWxzZSBpZiAoZW50cnkuc3ltYm9sLnN0YXJ0c1dpdGgocSkpIHNjb3JlID0gMjtcbiAgICAgIGVsc2UgaWYgKGVudHJ5Lm5hbWUudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhxTG93ZXIpKSBzY29yZSA9IDE7XG4gICAgICByZXR1cm4geyBlbnRyeSwgc2NvcmUgfTtcbiAgICB9KVxuICAgIC5maWx0ZXIoKHMpID0+IHMuc2NvcmUgPiAwKVxuICAgIC5zb3J0KChhLCBiKSA9PiBiLnNjb3JlIC0gYS5zY29yZSB8fCBhLmVudHJ5LnN5bWJvbC5sb2NhbGVDb21wYXJlKGIuZW50cnkuc3ltYm9sKSk7XG5cbiAgcmV0dXJuIHNjb3JlZC5zbGljZSgwLCBNQVhfUkVTVUxUUykubWFwKCh7IGVudHJ5IH0pID0+ICh7XG4gICAgc3ltYm9sOiBlbnRyeS5zeW1ib2wsXG4gICAgbmFtZTogZW50cnkubmFtZSxcbiAgICB0eXBlOiBlbnRyeS50eXBlLFxuICAgIGV4Y2hhbmdlOiBlbnRyeS5leGNoYW5nZSxcbiAgfSkpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2VhcmNoU3ltYm9scyhxdWVyeTogc3RyaW5nKTogUHJvbWlzZTxTeW1ib2xTdWdnZXN0aW9uW10+IHtcbiAgY29uc3QgcSA9IHF1ZXJ5LnRyaW0oKS5zbGljZSgwLCA0OCk7XG4gIGlmICghcSkgcmV0dXJuIFtdO1xuICB0cnkge1xuICAgIGNvbnN0IHF1b3RlcyA9IGF3YWl0IHNlYXJjaFlhaG9vKHEpO1xuICAgIGNvbnN0IG91dDogU3ltYm9sU3VnZ2VzdGlvbltdID0gW107XG4gICAgZm9yIChjb25zdCBxdW90ZSBvZiBxdW90ZXMpIHtcbiAgICAgIGNvbnN0IHR5cGUgPSBtYXBRdW90ZVR5cGUocXVvdGUucXVvdGVUeXBlKTtcbiAgICAgIGlmICghdHlwZSkgY29udGludWU7XG4gICAgICBjb25zdCBzeW1ib2wgPSB0eXBlb2YgcXVvdGUuc3ltYm9sID09PSAnc3RyaW5nJyA/IHF1b3RlLnN5bWJvbC50b1VwcGVyQ2FzZSgpIDogJyc7XG4gICAgICBpZiAoIXN5bWJvbCB8fCBvdXQuc29tZSgocykgPT4gcy5zeW1ib2wgPT09IHN5bWJvbCkpIGNvbnRpbnVlO1xuICAgICAgb3V0LnB1c2goe1xuICAgICAgICBzeW1ib2wsXG4gICAgICAgIG5hbWU6IHF1b3RlLmxvbmduYW1lIHx8IHF1b3RlLnNob3J0bmFtZSB8fCBzeW1ib2wsXG4gICAgICAgIHR5cGUsXG4gICAgICAgIGV4Y2hhbmdlOiBxdW90ZS5leGNoRGlzcCB8fCB1bmRlZmluZWQsXG4gICAgICB9KTtcbiAgICAgIGlmIChvdXQubGVuZ3RoID49IE1BWF9SRVNVTFRTKSBicmVhaztcbiAgICB9XG4gICAgLy8gTGl2ZSBzZWFyY2ggY2FuIGxlZ2l0aW1hdGVseSByZXR1cm4gbm90aGluZzsgb25seSBmYWxsIGJhY2sgdG8gdGhlXG4gICAgLy8gb2ZmbGluZSBkaXJlY3Rvcnkgd2hlbiBZYWhvbyBnYXZlIHVzIG5vdGhpbmcgdXNhYmxlIGF0IGFsbC5cbiAgICByZXR1cm4gb3V0Lmxlbmd0aCA+IDAgPyBvdXQgOiBzZWFyY2hEaXJlY3RvcnkocSk7XG4gIH0gY2F0Y2gge1xuICAgIHJldHVybiBzZWFyY2hEaXJlY3RvcnkocSk7XG4gIH1cbn1cbiIsICIvLyBQZXJzaXN0ZW50IHdhdGNobGlzdDogSlNPTiBmaWxlIGluIHVzZXJEYXRhLCBzZWVkZWQgb24gZmlyc3QgcnVuLlxuLy8gQSBjb3JydXB0IGZpbGUgaXMgcmVwbGFjZWQgd2l0aCB0aGUgc2VlZCByYXRoZXIgdGhhbiBjcmFzaGluZy5cblxuaW1wb3J0IHsgYXBwIH0gZnJvbSAnZWxlY3Ryb24nO1xuaW1wb3J0IGZzIGZyb20gJ25vZGU6ZnMnO1xuaW1wb3J0IHBhdGggZnJvbSAnbm9kZTpwYXRoJztcbmltcG9ydCB0eXBlIHtcbiAgQWRkV2F0Y2hsaXN0UmVzdWx0LFxuICBJbnN0cnVtZW50VHlwZSxcbiAgV2F0Y2hsaXN0SXRlbSxcbn0gZnJvbSAnLi4vLi4vc2hhcmVkL3R5cGVzJztcbmltcG9ydCB7IGRpcmVjdG9yeUxvb2t1cCB9IGZyb20gJy4vZGF0YUZpbGVzJztcbmltcG9ydCB7IHNlYXJjaFN5bWJvbHMgfSBmcm9tICcuL3N5bWJvbHMnO1xuaW1wb3J0IHsgbm9ybWFsaXplU3ltYm9sIH0gZnJvbSAnLi91dGlsJztcblxuY29uc3QgU0VFRDogQXJyYXk8eyBzeW1ib2w6IHN0cmluZzsgbmFtZTogc3RyaW5nOyB0eXBlOiBJbnN0cnVtZW50VHlwZSB9PiA9IFtcbiAgeyBzeW1ib2w6ICdTUFknLCBuYW1lOiAnU1BEUiBTJlAgNTAwIEVURiBUcnVzdCcsIHR5cGU6ICdldGYnIH0sXG4gIHsgc3ltYm9sOiAnUVFRJywgbmFtZTogJ0ludmVzY28gUVFRIFRydXN0JywgdHlwZTogJ2V0ZicgfSxcbiAgeyBzeW1ib2w6ICdTTUgnLCBuYW1lOiAnVmFuRWNrIFNlbWljb25kdWN0b3IgRVRGJywgdHlwZTogJ2V0ZicgfSxcbiAgeyBzeW1ib2w6ICdBQVBMJywgbmFtZTogJ0FwcGxlIEluYy4nLCB0eXBlOiAnc3RvY2snIH0sXG4gIHsgc3ltYm9sOiAnTlZEQScsIG5hbWU6ICdOVklESUEgQ29ycG9yYXRpb24nLCB0eXBlOiAnc3RvY2snIH0sXG4gIHsgc3ltYm9sOiAnVFNMQScsIG5hbWU6ICdUZXNsYSwgSW5jLicsIHR5cGU6ICdzdG9jaycgfSxcbl07XG5cbmxldCBpdGVtczogV2F0Y2hsaXN0SXRlbVtdIHwgbnVsbCA9IG51bGw7XG5cbmZ1bmN0aW9uIHN0b3JlUGF0aCgpOiBzdHJpbmcge1xuICByZXR1cm4gcGF0aC5qb2luKGFwcC5nZXRQYXRoKCd1c2VyRGF0YScpLCAnd2F0Y2hsaXN0Lmpzb24nKTtcbn1cblxuZnVuY3Rpb24gc2VlZEl0ZW1zKCk6IFdhdGNobGlzdEl0ZW1bXSB7XG4gIGNvbnN0IGFkZGVkQXQgPSBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCk7XG4gIHJldHVybiBTRUVELm1hcCgocykgPT4gKHsgLi4ucywgYWRkZWRBdCB9KSk7XG59XG5cbmZ1bmN0aW9uIGlzVmFsaWRJdGVtKHZhbHVlOiB1bmtub3duKTogdmFsdWUgaXMgV2F0Y2hsaXN0SXRlbSB7XG4gIGlmICghdmFsdWUgfHwgdHlwZW9mIHZhbHVlICE9PSAnb2JqZWN0JykgcmV0dXJuIGZhbHNlO1xuICBjb25zdCBpdGVtID0gdmFsdWUgYXMgUGFydGlhbDxXYXRjaGxpc3RJdGVtPjtcbiAgcmV0dXJuIChcbiAgICB0eXBlb2YgaXRlbS5zeW1ib2wgPT09ICdzdHJpbmcnICYmXG4gICAgbm9ybWFsaXplU3ltYm9sKGl0ZW0uc3ltYm9sKSAhPT0gbnVsbCAmJlxuICAgIHR5cGVvZiBpdGVtLm5hbWUgPT09ICdzdHJpbmcnICYmXG4gICAgaXRlbS5uYW1lLmxlbmd0aCA+IDAgJiZcbiAgICAoaXRlbS50eXBlID09PSAnZXRmJyB8fCBpdGVtLnR5cGUgPT09ICdzdG9jaycpICYmXG4gICAgdHlwZW9mIGl0ZW0uYWRkZWRBdCA9PT0gJ3N0cmluZydcbiAgKTtcbn1cblxuZnVuY3Rpb24gc2F2ZShsaXN0OiBXYXRjaGxpc3RJdGVtW10pOiB2b2lkIHtcbiAgdHJ5IHtcbiAgICBjb25zdCBmaWxlID0gc3RvcmVQYXRoKCk7XG4gICAgZnMubWtkaXJTeW5jKHBhdGguZGlybmFtZShmaWxlKSwgeyByZWN1cnNpdmU6IHRydWUgfSk7XG4gICAgZnMud3JpdGVGaWxlU3luYyhmaWxlLCBKU09OLnN0cmluZ2lmeShsaXN0LCBudWxsLCAyKSwgJ3V0ZjgnKTtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgY29uc29sZS5lcnJvcignW3dhdGNobGlzdF0gZmFpbGVkIHRvIHBlcnNpc3Q6JywgZXJyKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBsb2FkKCk6IFdhdGNobGlzdEl0ZW1bXSB7XG4gIGlmIChpdGVtcykgcmV0dXJuIGl0ZW1zO1xuICB0cnkge1xuICAgIGNvbnN0IHJhdyA9IGZzLnJlYWRGaWxlU3luYyhzdG9yZVBhdGgoKSwgJ3V0ZjgnKTtcbiAgICBjb25zdCBwYXJzZWQgPSBKU09OLnBhcnNlKHJhdykgYXMgdW5rbm93bjtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShwYXJzZWQpKSB7XG4gICAgICBjb25zdCB2YWxpZCA9IHBhcnNlZC5maWx0ZXIoaXNWYWxpZEl0ZW0pLm1hcCgoaXRlbSkgPT4gKHtcbiAgICAgICAgLi4uaXRlbSxcbiAgICAgICAgc3ltYm9sOiBpdGVtLnN5bWJvbC50b1VwcGVyQ2FzZSgpLFxuICAgICAgfSkpO1xuICAgICAgaWYgKHZhbGlkLmxlbmd0aCA+IDAgfHwgcGFyc2VkLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBpdGVtcyA9IHZhbGlkO1xuICAgICAgICByZXR1cm4gaXRlbXM7XG4gICAgICB9XG4gICAgfVxuICAgIHRocm93IG5ldyBFcnJvcigndW5yZWNvZ25pemVkIHdhdGNobGlzdCBmaWxlIHNoYXBlJyk7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIGNvbnN0IGNvZGUgPSAoZXJyIGFzIE5vZGVKUy5FcnJub0V4Y2VwdGlvbikuY29kZTtcbiAgICBpZiAoY29kZSAhPT0gJ0VOT0VOVCcpIGNvbnNvbGUuZXJyb3IoJ1t3YXRjaGxpc3RdIHJlc2VlZGluZyBhZnRlciBsb2FkIGVycm9yOicsIGVycik7XG4gICAgaXRlbXMgPSBzZWVkSXRlbXMoKTtcbiAgICBzYXZlKGl0ZW1zKTtcbiAgICByZXR1cm4gaXRlbXM7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFdhdGNobGlzdCgpOiBXYXRjaGxpc3RJdGVtW10ge1xuICByZXR1cm4gWy4uLmxvYWQoKV07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVGcm9tV2F0Y2hsaXN0KHN5bWJvbDogc3RyaW5nKTogV2F0Y2hsaXN0SXRlbVtdIHtcbiAgY29uc3Qgc3ltID0gc3ltYm9sLnRvVXBwZXJDYXNlKCk7XG4gIGNvbnN0IGxpc3QgPSBsb2FkKCkuZmlsdGVyKChpdGVtKSA9PiBpdGVtLnN5bWJvbCAhPT0gc3ltKTtcbiAgaXRlbXMgPSBsaXN0O1xuICBzYXZlKGxpc3QpO1xuICByZXR1cm4gWy4uLmxpc3RdO1xufVxuXG5hc3luYyBmdW5jdGlvbiByZXNvbHZlU3ltYm9sKFxuICBzeW1ib2w6IHN0cmluZyxcbik6IFByb21pc2U8eyBuYW1lOiBzdHJpbmc7IHR5cGU6IEluc3RydW1lbnRUeXBlIH0gfCBudWxsPiB7XG4gIHRyeSB7XG4gICAgY29uc3Qgc3VnZ2VzdGlvbnMgPSBhd2FpdCBzZWFyY2hTeW1ib2xzKHN5bWJvbCk7XG4gICAgY29uc3QgZXhhY3QgPSBzdWdnZXN0aW9ucy5maW5kKChzKSA9PiBzLnN5bWJvbC50b1VwcGVyQ2FzZSgpID09PSBzeW1ib2wpO1xuICAgIGlmIChleGFjdCkgcmV0dXJuIHsgbmFtZTogZXhhY3QubmFtZSwgdHlwZTogZXhhY3QudHlwZSB9O1xuICB9IGNhdGNoIHtcbiAgICAvKiBmYWxsIHRocm91Z2ggdG8gdGhlIG9mZmxpbmUgZGlyZWN0b3J5ICovXG4gIH1cbiAgY29uc3QgZW50cnkgPSBkaXJlY3RvcnlMb29rdXAoc3ltYm9sKTtcbiAgaWYgKGVudHJ5KSByZXR1cm4geyBuYW1lOiBlbnRyeS5uYW1lLCB0eXBlOiBlbnRyeS50eXBlIH07XG4gIHJldHVybiBudWxsO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gYWRkVG9XYXRjaGxpc3QocmF3U3ltYm9sOiBzdHJpbmcpOiBQcm9taXNlPEFkZFdhdGNobGlzdFJlc3VsdD4ge1xuICBjb25zdCBzeW1ib2wgPSBub3JtYWxpemVTeW1ib2wocmF3U3ltYm9sKTtcbiAgaWYgKCFzeW1ib2wpIHJldHVybiB7IG9rOiBmYWxzZSwgZXJyb3I6ICdJbnZhbGlkIHN5bWJvbCcgfTtcblxuICBjb25zdCBsaXN0ID0gbG9hZCgpO1xuICBpZiAobGlzdC5zb21lKChpdGVtKSA9PiBpdGVtLnN5bWJvbCA9PT0gc3ltYm9sKSkge1xuICAgIHJldHVybiB7IG9rOiBmYWxzZSwgZXJyb3I6ICdBbHJlYWR5IGluIHdhdGNobGlzdCcgfTtcbiAgfVxuXG4gIGNvbnN0IHJlc29sdmVkID0gYXdhaXQgcmVzb2x2ZVN5bWJvbChzeW1ib2wpO1xuICBpZiAoIXJlc29sdmVkKSByZXR1cm4geyBvazogZmFsc2UsIGVycm9yOiAnU3ltYm9sIG5vdCBmb3VuZCcgfTtcblxuICBjb25zdCBpdGVtOiBXYXRjaGxpc3RJdGVtID0ge1xuICAgIHN5bWJvbCxcbiAgICBuYW1lOiByZXNvbHZlZC5uYW1lLFxuICAgIHR5cGU6IHJlc29sdmVkLnR5cGUsXG4gICAgYWRkZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuICB9O1xuICBjb25zdCBuZXh0ID0gWy4uLmxpc3QsIGl0ZW1dO1xuICBpdGVtcyA9IG5leHQ7XG4gIHNhdmUobmV4dCk7XG4gIHJldHVybiB7IG9rOiB0cnVlLCBpdGVtLCB3YXRjaGxpc3Q6IFsuLi5uZXh0XSB9O1xufVxuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUEsNkNBQUFBLFVBQUE7QUFBQTtBQUVBLFFBQU0sZ0JBQWdCO0FBQ3RCLFFBQU0sV0FBVyxnQkFBZ0I7QUFDakMsUUFBTSxhQUFhLE1BQU0sZ0JBQWdCLE9BQU8sV0FBVztBQUMzRCxRQUFNLFlBQVksSUFBSSxPQUFPLE1BQU0sYUFBYSxHQUFHO0FBRW5ELFFBQU0sZ0JBQWdCLFNBQVUsUUFBUSxPQUFPO0FBQzdDLFlBQU0sVUFBVSxDQUFDO0FBQ2pCLFVBQUksUUFBUSxNQUFNLEtBQUssTUFBTTtBQUM3QixhQUFPLE9BQU87QUFDWixjQUFNLGFBQWEsQ0FBQztBQUNwQixtQkFBVyxhQUFhLE1BQU0sWUFBWSxNQUFNLENBQUMsRUFBRTtBQUNuRCxjQUFNLE1BQU0sTUFBTTtBQUNsQixpQkFBUyxRQUFRLEdBQUcsUUFBUSxLQUFLLFNBQVM7QUFDeEMscUJBQVcsS0FBSyxNQUFNLEtBQUssQ0FBQztBQUFBLFFBQzlCO0FBQ0EsZ0JBQVEsS0FBSyxVQUFVO0FBQ3ZCLGdCQUFRLE1BQU0sS0FBSyxNQUFNO0FBQUEsTUFDM0I7QUFDQSxhQUFPO0FBQUEsSUFDVDtBQUVBLFFBQU0sU0FBUyxTQUFVLFFBQVE7QUFDL0IsWUFBTSxRQUFRLFVBQVUsS0FBSyxNQUFNO0FBQ25DLGFBQU8sRUFBRSxVQUFVLFFBQVEsT0FBTyxVQUFVO0FBQUEsSUFDOUM7QUFFQSxJQUFBQSxTQUFRLFVBQVUsU0FBVSxHQUFHO0FBQzdCLGFBQU8sT0FBTyxNQUFNO0FBQUEsSUFDdEI7QUFFQSxJQUFBQSxTQUFRLGdCQUFnQixTQUFVLEtBQUs7QUFDckMsYUFBTyxPQUFPLEtBQUssR0FBRyxFQUFFLFdBQVc7QUFBQSxJQUNyQztBQU9BLElBQUFBLFNBQVEsUUFBUSxTQUFVLFFBQVEsR0FBRyxXQUFXO0FBQzlDLFVBQUksR0FBRztB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QUEsRUFBSyxLQUFLO0FBQUEsRUFDdkQsTUFBTTtBQUFBLEVBQUssTUFBTTtBQUFBLEVBQUssTUFBTTtBQUFBLEVBQUssTUFBTTtBQUFBLEVBQUssT0FBTztBQUFBLEVBQUssTUFBTTtBQUFBLEVBQzlELE1BQU07QUFBQSxFQUFLLE1BQU07QUFBQSxFQUFLLE1BQU07QUFBQSxFQUFLLFNBQVM7QUFBQSxFQUFLLEtBQUs7QUFBQSxFQUFLLEdBQUc7QUFBQSxFQUM1RCxJQUFJO0FBQUEsRUFBSyxLQUFLO0FBQUEsRUFBSyxLQUFLO0FBQUEsRUFBSyxLQUFLO0FBQUEsRUFBSyxLQUFLO0FBQUEsRUFBSyxJQUFJO0FBQUEsRUFBSyxJQUFJO0FBQUEsRUFDOUQsTUFBTTtBQUFBLEVBQUssS0FBSztBQUFBLEVBQUksTUFBTTtBQUFBLEVBQU0sS0FBSztBQUFBLEVBQUssTUFBTTtBQUFBLEVBQUssS0FBSztBQUFBLEVBQzFELE1BQU07QUFBQSxFQUFLLEtBQUs7QUFBQSxFQUFLLElBQUk7QUFBQSxFQUFJLE1BQU07QUFBQSxFQUFJLE1BQU07QUFBQSxFQUFJLEtBQUs7QUFBQSxFQUFLLE1BQU07QUFBQSxFQUNqRSxNQUFNO0FBQUEsRUFBSyxLQUFLO0FBQUEsRUFBSyxJQUFJO0FBQUEsRUFBSyxNQUFNO0FBQUEsRUFBSyxNQUFNO0FBQUEsRUFBSSxNQUFNO0FBQUEsRUFDekQsTUFBTTtBQUFBLEVBQUssTUFBTTtBQUFBLEVBQUssTUFBTTtBQUFBLEVBQUksTUFBTTtBQUFBLEVBQUssS0FBSztBQUFBLEVBQUssSUFBSTtBQUFBLEVBQ3pELEtBQUs7QUFBQSxFQUFLLElBQUk7QUFBQSxFQUFLLElBQUk7QUFBQSxFQUFLLEtBQUs7QUFBQSxFQUFJLEtBQUs7QUFBQSxFQUFJLEtBQUs7QUFBQSxFQUFLLElBQUk7QUFBQSxFQUM1RCxLQUFLO0FBQUEsRUFBSyxLQUFLO0FBQUEsRUFBSSxHQUFHO0FBQUEsRUFBSSxJQUFJO0FBQUEsRUFBSSxLQUFLO0FBQUEsRUFBSSxLQUFLO0FBQUEsRUFBSSxNQUFNO0FBQUEsRUFD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QUFRLE9BQU0sV0FBVztBQUNyRSxNQUFJLG1CQUFtQixVQUFVLG1CQUFtQixVQUFVO0FBQzVELFVBQU0saUJBQWlCO0FBQUEsRUFDekI7QUFDQSxNQUFJLGdCQUFpQixPQUFNLGFBQWE7QUFDeEMsTUFBSSxPQUFPLEtBQUssS0FBSyxFQUFFLFFBQVE7QUFDN0IsU0FBSyxJQUFJLFNBQVMsV0FBVyxFQUFFLE1BQU0sQ0FBQztBQUFBLEVBQ3hDLE9BQU87QUFDTCxTQUFLLElBQUksU0FBUyxTQUFTO0FBQUEsRUFDN0I7QUFDRjtBQUVBLElBQU0sVUFBVSxxQkFBSSwwQkFBMEI7QUFDOUMsSUFBSSxDQUFDLFNBQVM7QUFDWix1QkFBSSxLQUFLO0FBQ1gsT0FBTztBQUNMLHVCQUFJLEdBQUcsbUJBQW1CLE1BQU07QUFDOUIsUUFBSSxZQUFZO0FBQ2QsVUFBSSxXQUFXLFlBQVksRUFBRyxZQUFXLFFBQVE7QUFDakQsaUJBQVcsTUFBTTtBQUFBLElBQ25CO0FBQUEsRUFDRixDQUFDO0FBRUQsVUFBUSxHQUFHLHNCQUFzQixDQUFDLFdBQVc7QUFDM0MsWUFBUSxNQUFNLCtCQUErQixNQUFNO0FBQUEsRUFDckQsQ0FBQztBQUVELHVCQUFJLFVBQVUsRUFBRSxLQUFLLE1BQU07QUFDekIsd0JBQW9CO0FBQ3BCLGlCQUFhO0FBRWIseUJBQUksR0FBRyxZQUFZLE1BQU07QUFDdkIsVUFBSSwrQkFBYyxjQUFjLEVBQUUsV0FBVyxFQUFHLGNBQWE7QUFBQSxJQUMvRCxDQUFDO0FBQUEsRUFDSCxDQUFDO0FBRUQsdUJBQUksR0FBRyxxQkFBcUIsTUFBTTtBQUNoQyx5QkFBSSxLQUFLO0FBQUEsRUFDWCxDQUFDO0FBQ0g7IiwKICAibmFtZXMiOiBbImV4cG9ydHMiLCAiZXhwb3J0cyIsICJleHBvcnRzIiwgImV4cG9ydHMiLCAibW9kdWxlIiwgImV4cG9ydHMiLCAibW9kdWxlIiwgImV4cG9ydHMiLCAibW9kdWxlIiwgImV4cG9ydHMiLCAibW9kdWxlIiwgImV4cG9ydHMiLCAibW9kdWxlIiwgInJlc3VsdCIsICJleHBvcnRzIiwgImV4cG9ydHMiLCAibW9kdWxlIiwgIlhNTFBhcnNlciIsICJleHBvcnRzIiwgIm1vZHVsZSIsICJhdHRTdHIiLCAiZXhwb3J0cyIsICJtb2R1bGUiLCAiZXhwb3J0cyIsICJtb2R1bGUiLCAiWE1MUGFyc2VyIiwgImltcG9ydF9lbGVjdHJvbiIsICJpbXBvcnRfbm9kZV9mcyIsICJpbXBvcnRfbm9kZV9wYXRoIiwgInBhdGgiLCAiZnMiLCAiaXRlbXMiLCAiTElWRV9UVExfTVMiLCAiU0FNUExFX1RUTF9NUyIsICJjYWNoZSIsICJpbkZsaWdodCIsICJpbXBvcnRfbm9kZV9mcyIsICJpbXBvcnRfbm9kZV9wYXRoIiwgInBhdGgiLCAiZnMiLCAiaW1wb3J0X2VsZWN0cm9uIiwgImltcG9ydF9ub2RlX2ZzIiwgImltcG9ydF9ub2RlX3BhdGgiLCAic3RvcmVQYXRoIiwgInBhdGgiLCAiZnMiLCAiaXRlbXMiLCAibGltaXQiLCAiaXRlbXMiLCAiV0lORE9XX0RBWVMiLCAibGltaXQiLCAiaXRlbXMiLCAibGltaXQiLCAiY2FjaGUiLCAiaW1wb3J0X2VsZWN0cm9uIiwgImltcG9ydF9ub2RlX2ZzIiwgImltcG9ydF9ub2RlX3BhdGgiLCAic3RvcmVQYXRoIiwgInBhdGgiLCAiZnMiLCAiaXRlbSIsICJNQVhfUElWT1RTIiwgInBhdGgiLCAiZnMiXQp9Cg==
