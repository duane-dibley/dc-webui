(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["kdb"] = factory();
	else
		root["kdb"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	function _interopExportWildcard(obj, defaults) { var newObj = defaults({}, obj); delete newObj["default"]; return newObj; }

	function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

	var _srcParameters = __webpack_require__(1);

	_defaults(exports, _interopExportWildcard(_srcParameters, _defaults));

	var _srcTemporals = __webpack_require__(2);

	_defaults(exports, _interopExportWildcard(_srcTemporals, _defaults));

	var _srcSql = __webpack_require__(4);

	_defaults(exports, _interopExportWildcard(_srcSql, _defaults));

	var _srcConstants = __webpack_require__(3);

	_defaults(exports, _interopExportWildcard(_srcConstants, _defaults));

	var _srcQuery = __webpack_require__(5);

	_defaults(exports, _interopExportWildcard(_srcQuery, _defaults));

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var _temporals = __webpack_require__(2);

	var _constants = __webpack_require__(3);

	var QParameter = (function () {
	    function QParameter() {
	        _classCallCheck(this, QParameter);

	        this.value = null;
	    }

	    _createClass(QParameter, [{
	        key: "setValue",
	        value: function setValue(val) {
	            this.value = val;
	        }
	    }]);

	    return QParameter;
	})();

	var QBoolean = (function (_QParameter) {
	    _inherits(QBoolean, _QParameter);

	    function QBoolean() {
	        _classCallCheck(this, QBoolean);

	        _get(Object.getPrototypeOf(QBoolean.prototype), "constructor", this).call(this);
	        this.value = false;
	    }

	    _createClass(QBoolean, [{
	        key: "setValue",
	        value: function setValue(val) {
	            val = val == null ? false : val;
	            if (typeof val === "string") {
	                val = val.toString().toLowerCase().charAt(0) === "t" ? true : false;
	            }
	            this.value = val;
	        }
	    }]);

	    return QBoolean;
	})(QParameter);

	var QGUID = (function (_QParameter2) {
	    _inherits(QGUID, _QParameter2);

	    function QGUID() {
	        _classCallCheck(this, QGUID);

	        _get(Object.getPrototypeOf(QGUID.prototype), "constructor", this).apply(this, arguments);
	    }

	    _createClass(QGUID, [{
	        key: "setValue",
	        value: function setValue(val) {
	            this.value = val == null ? null : val.toString();
	        }
	    }]);

	    return QGUID;
	})(QParameter);

	var QByte = (function (_QParameter3) {
	    _inherits(QByte, _QParameter3);

	    function QByte() {
	        _classCallCheck(this, QByte);

	        _get(Object.getPrototypeOf(QByte.prototype), "constructor", this).apply(this, arguments);
	    }

	    return QByte;
	})(QParameter);

	;

	var QShort = (function (_QParameter4) {
	    _inherits(QShort, _QParameter4);

	    function QShort() {
	        _classCallCheck(this, QShort);

	        _get(Object.getPrototypeOf(QShort.prototype), "constructor", this).apply(this, arguments);
	    }

	    _createClass(QShort, [{
	        key: "setValue",
	        value: function setValue(val) {
	            this.value = val == null ? null : isNaN(val) ? null : parseInt(val, 10);
	        }
	    }]);

	    return QShort;
	})(QParameter);

	var QInt = (function (_QParameter5) {
	    _inherits(QInt, _QParameter5);

	    function QInt() {
	        _classCallCheck(this, QInt);

	        _get(Object.getPrototypeOf(QInt.prototype), "constructor", this).apply(this, arguments);
	    }

	    _createClass(QInt, [{
	        key: "setValue",
	        value: function setValue(val) {
	            this.value = val == null ? null : isNaN(val) ? null : parseInt(val, 10);
	        }
	    }]);

	    return QInt;
	})(QParameter);

	var QLong = (function (_QParameter6) {
	    _inherits(QLong, _QParameter6);

	    function QLong() {
	        _classCallCheck(this, QLong);

	        _get(Object.getPrototypeOf(QLong.prototype), "constructor", this).apply(this, arguments);
	    }

	    _createClass(QLong, [{
	        key: "setValue",
	        value: function setValue(val) {
	            this.value = val == null ? null : isNaN(val) ? null : parseFloat(val);
	        }
	    }]);

	    return QLong;
	})(QParameter);

	var QReal = (function (_QLong) {
	    _inherits(QReal, _QLong);

	    function QReal() {
	        _classCallCheck(this, QReal);

	        _get(Object.getPrototypeOf(QReal.prototype), "constructor", this).apply(this, arguments);
	    }

	    return QReal;
	})(QLong);

	;

	var QFloat = (function (_QLong2) {
	    _inherits(QFloat, _QLong2);

	    function QFloat() {
	        _classCallCheck(this, QFloat);

	        _get(Object.getPrototypeOf(QFloat.prototype), "constructor", this).apply(this, arguments);
	    }

	    return QFloat;
	})(QLong);

	;

	var QChar = (function (_QParameter7) {
	    _inherits(QChar, _QParameter7);

	    function QChar() {
	        _classCallCheck(this, QChar);

	        _get(Object.getPrototypeOf(QChar.prototype), "constructor", this).apply(this, arguments);
	    }

	    _createClass(QChar, [{
	        key: "setValue",
	        value: function setValue(val) {
	            this.value = val == null ? null : val.toString().charAt(0);
	        }
	    }]);

	    return QChar;
	})(QParameter);

	var QSymbol = (function (_QParameter8) {
	    _inherits(QSymbol, _QParameter8);

	    function QSymbol() {
	        _classCallCheck(this, QSymbol);

	        _get(Object.getPrototypeOf(QSymbol.prototype), "constructor", this).apply(this, arguments);
	    }

	    _createClass(QSymbol, [{
	        key: "setValue",
	        value: function setValue(val) {
	            this.value = val == null ? null : val.toString();
	        }
	    }]);

	    return QSymbol;
	})(QParameter);

	var QTimeStamp = (function (_QParameter9) {
	    _inherits(QTimeStamp, _QParameter9);

	    function QTimeStamp() {
	        _classCallCheck(this, QTimeStamp);

	        _get(Object.getPrototypeOf(QTimeStamp.prototype), "constructor", this).call(this);
	        this.nanoValue = 0;
	    }

	    _createClass(QTimeStamp, [{
	        key: "setValue",
	        value: function setValue(val) {
	            this.value = val == null ? null : val === "0Np" ? null : val instanceof Date ? val.getTime() : val instanceof _temporals.JTemporal ? val.i : isNaN(val) ? this.parse(val) : parseFloat(val);
	        }
	    }, {
	        key: "parse",
	        value: function parse(val) {
	            var delim = val.indexOf(" ") !== -1 ? " " : val.indexOf("D") !== 1 ? "D" : "";
	            if (delim === "") {
	                throw new Error("Please separate your date and time with either a D or a space");
	            }

	            var _val$split = val.split(delim);

	            var _val$split2 = _slicedToArray(_val$split, 2);

	            var date = _val$split2[0];
	            var time = _val$split2[1];

	            if (time == null) {
	                throw new Error("Please enter time stamp in the correct format (YYYY.MM.DD HH:MM:SS)");
	            }
	            this.nanoValue = parseFloat(time.substring(9, 18));

	            var _date$split = date.split(".");

	            var _date$split2 = _slicedToArray(_date$split, 3);

	            var year = _date$split2[0];
	            var month = _date$split2[1];
	            var day = _date$split2[2];

	            month = parseInt(month, 10);
	            day = parseInt(day, 10);
	            month = month === 0 ? 0 : month - 1;
	            day = day === 0 ? 1 : day;

	            var _time$substring$split = time.substring(0, 8).split(":");

	            var _time$substring$split2 = _slicedToArray(_time$substring$split, 3);

	            var h = _time$substring$split2[0];
	            var m = _time$substring$split2[1];
	            var s = _time$substring$split2[2];
	            var d = new Date(year, month, day, h, m, s, 0);
	            return d.getTime();
	        }
	    }]);

	    return QTimeStamp;
	})(QParameter);

	var QMonth = (function (_QParameter10) {
	    _inherits(QMonth, _QParameter10);

	    function QMonth() {
	        _classCallCheck(this, QMonth);

	        _get(Object.getPrototypeOf(QMonth.prototype), "constructor", this).apply(this, arguments);
	    }

	    _createClass(QMonth, [{
	        key: "setValue",
	        value: function setValue(val) {
	            this.value = val == null ? null : val === "0Nm" ? null : val instanceof Date ? this.parse(val.getFullYear() + "-" + val.getMonth()) : val instanceof _temporals.JTemporal ? val.i : typeof val === "number" ? parseFloat(val) : typeof val === "string" ? this.parse(val) : val;
	        }
	    }, {
	        key: "parse",
	        value: function parse(val) {
	            var delim = val.indexOf(".") !== -1 ? "." : val.indexOf("-") !== -1 ? "-" : "";
	            if (delim === "") {
	                if (!isNaN(val)) {
	                    return parseFloat(val);
	                }
	                throw new Error("Please separate your month with either a . or -");
	            }
	            var parts = val.split(delim),
	                year = parseInt(parts[0], 10),
	                month = parseInt(parts[1], 10);
	            month = month === 0 ? 0 : month - 1;
	            return (year - 2000) * 12 + month;
	        }
	    }]);

	    return QMonth;
	})(QParameter);

	var QDate = (function (_QParameter11) {
	    _inherits(QDate, _QParameter11);

	    function QDate() {
	        _classCallCheck(this, QDate);

	        _get(Object.getPrototypeOf(QDate.prototype), "constructor", this).apply(this, arguments);
	    }

	    _createClass(QDate, [{
	        key: "setValue",
	        value: function setValue(val) {
	            this.value = val == null ? null : val === "0Nd" ? null : val instanceof Date ? val.getTime() : val instanceof _temporals.JTemporal ? val.i : typeof val === "number" ? parseFloat(val) : typeof val === "string" ? this.parse(val) : isNaN(val) ? null : parseFloat(val);
	        }
	    }, {
	        key: "parse",
	        value: function parse(val) {
	            if (!isNaN(val)) {
	                return parseFloat(val);
	            }

	            var _val$split3 = val.split(".");

	            var _val$split32 = _slicedToArray(_val$split3, 3);

	            var year = _val$split32[0];
	            var month = _val$split32[1];
	            var day = _val$split32[2];

	            month = parseInt(month, 10), day = parseInt(day, 10);
	            month = month === 0 ? 0 : month - 1;
	            day = day === 0 ? 1 : day;
	            var date = new Date();
	            date.setUTCFullYear(year, month, day);
	            return date.getTime();
	        }
	    }]);

	    return QDate;
	})(QParameter);

	var QDateTime = (function (_QParameter12) {
	    _inherits(QDateTime, _QParameter12);

	    function QDateTime() {
	        _classCallCheck(this, QDateTime);

	        _get(Object.getPrototypeOf(QDateTime.prototype), "constructor", this).apply(this, arguments);
	    }

	    _createClass(QDateTime, [{
	        key: "setValue",
	        value: function setValue(val) {
	            this.value = val == null ? null : val === "0Nz" ? null : val instanceof _temporals.JTemporal ? val.i : val instanceof Date ? val.getTime() : typeof val === "string" ? this.parse(val) : isNaN(val) ? null : parseFloat(val);
	        }
	    }, {
	        key: "parse",
	        value: function parse(val) {
	            var delim = val.indexOf(" ") !== -1 ? " " : val.indexOf("T") !== 1 ? "T" : "";
	            if (delim === "") {
	                throw new Error("Please separate your date and time with either a T or a space");
	            }

	            var _val$split4 = val.split(delim);

	            var _val$split42 = _slicedToArray(_val$split4, 2);

	            var date = _val$split42[0];
	            var time = _val$split42[1];

	            var parts = date.split("."),
	                year = parseInt(parts[0], 10),
	                month = parseInt(parts[1], 10),
	                day = parseInt(parts[2], 10);
	            month = month === 0 ? 0 : month - 1;
	            day = day === 0 ? 1 : day;
	            var h1 = parseInt(time.charAt(0), 10),
	                h2 = parseInt(time.charAt(1), 10),
	                m1 = parseInt(time.charAt(3), 10),
	                m2 = parseInt(time.charAt(4), 10),
	                s1 = parseInt(time.charAt(6), 10),
	                s2 = parseInt(time.charAt(7), 10),
	                ms1 = parseInt(time.charAt(9), 10),
	                ms2 = parseInt(time.charAt(10), 10),
	                ms3 = parseInt(time.charAt(11), 10),
	                hh = h2 + h1 * 10,
	                mm = m2 + m1 * 10,
	                ss = s2 + s1 * 10,
	                ms = (isNaN(ms3) ? 0 : ms3) + (isNaN(ms2) ? 0 : ms2 * 10) + (isNaN(ms1) ? 0 : ms1 * 100);
	            return new Date(year, month, day, hh, mm, ss, ms).getTime();
	        }
	    }]);

	    return QDateTime;
	})(QParameter);

	var QTimeSpan = (function (_QParameter13) {
	    _inherits(QTimeSpan, _QParameter13);

	    function QTimeSpan() {
	        _classCallCheck(this, QTimeSpan);

	        _get(Object.getPrototypeOf(QTimeSpan.prototype), "constructor", this).apply(this, arguments);
	    }

	    _createClass(QTimeSpan, [{
	        key: "setValue",
	        value: function setValue(val) {
	            if (val != null && typeof val === "string") {
	                val = val == "0Nn" ? null : val;
	            }
	            if (typeof val === "string") {
	                val = this.parseTimeSpan(val);
	            }
	            if (val != null) {
	                val = isNaN(val) ? null : val;
	            }
	            if (val === undefined) {
	                val = null;
	            }
	            this.value = val;
	        }
	    }, {
	        key: "parseTimeSpan",
	        value: function parseTimeSpan(val) {
	            var dayTimeParts = val.split("D");
	            var daySince = parseInt(dayTimeParts[0]);

	            var timeNSParts = dayTimeParts[1].split(".");
	            var nanos = 0;
	            if (timeNSParts.length > 1) {
	                nanos = parseInt(timeNSParts[1]);
	            }
	            var timeParts = timeNSParts[0].split(":");

	            var hours = parseInt(timeParts[0]);
	            var mins = parseInt(timeParts[1]);
	            var secs = parseInt(timeParts[2]);

	            var j = nanos + secs * 1000000000 + mins * 60 * 1000000000 + hours * 60 * 60 * 1000000000 + daySince * 24 * 60 * 60 * 1000000000;
	            return j;
	        }
	    }]);

	    return QTimeSpan;
	})(QParameter);

	var QMinute = (function (_QParameter14) {
	    _inherits(QMinute, _QParameter14);

	    function QMinute() {
	        _classCallCheck(this, QMinute);

	        _get(Object.getPrototypeOf(QMinute.prototype), "constructor", this).apply(this, arguments);
	    }

	    _createClass(QMinute, [{
	        key: "setValue",
	        value: function setValue(val) {
	            this.value = val == null ? null : val === "0Nu" ? null : val instanceof _temporals.JTemporal ? val.i : val instanceof Date ? this.parse(val.getHours() + ":" + val.getMinutes()) : typeof val === "number" ? val : typeof val === "string" ? this.parse(val) : isNaN(val) ? null : parseFloat(val);
	        }
	    }, {
	        key: "parse",
	        value: function parse(val) {
	            if (!isNaN(val)) {
	                return parseFloat(val);
	            }

	            var h1 = parseInt(val.charAt(0), 10),
	                h2 = parseInt(val.charAt(1), 10),
	                m1 = parseInt(val.charAt(3), 10),
	                m2 = parseInt(val.charAt(4), 10),
	                hh = h2 + h1 * 10,
	                mm = m2 + m1 * 10;
	            return hh * 60 + mm;
	        }
	    }]);

	    return QMinute;
	})(QParameter);

	var QSecond = (function (_QParameter15) {
	    _inherits(QSecond, _QParameter15);

	    function QSecond() {
	        _classCallCheck(this, QSecond);

	        _get(Object.getPrototypeOf(QSecond.prototype), "constructor", this).apply(this, arguments);
	    }

	    _createClass(QSecond, [{
	        key: "setValue",
	        value: function setValue(val) {
	            this.value = val == null ? null : val === "0Nv" ? null : val instanceof _temporals.JTemporal ? val.i : val instanceof Date ? val.getTime() : typeof val === "string" ? this.parse(val) : isNaN(val) ? null : parseFloat(val);
	        }
	    }, {
	        key: "parse",
	        value: function parse(val) {
	            var h1 = parseInt(val.charAt(0), 10),
	                h2 = parseInt(val.charAt(1), 10),
	                m1 = parseInt(val.charAt(3), 10),
	                m2 = parseInt(val.charAt(4), 10),
	                s1 = parseInt(val.charAt(6), 10),
	                s2 = parseInt(val.charAt(7), 10),
	                hh = h2 + h1 * 10,
	                mm = m2 + m1 * 10,
	                ss = s2 + s1 * 10;
	            return hh * 3600 + mm * 60 + ss;
	        }
	    }]);

	    return QSecond;
	})(QParameter);

	var QTime = (function (_QParameter16) {
	    _inherits(QTime, _QParameter16);

	    function QTime() {
	        _classCallCheck(this, QTime);

	        _get(Object.getPrototypeOf(QTime.prototype), "constructor", this).apply(this, arguments);
	    }

	    _createClass(QTime, [{
	        key: "setValue",
	        value: function setValue(val) {
	            this.value = val == null ? null : val === "0Nt" ? null : val instanceof _temporals.JTemporal ? val.i : val instanceof Date ? val.getTime() : typeof val === "string" ? this.parse(val) : isNaN(val) ? null : parseFloat(val);
	        }
	    }, {
	        key: "parse",
	        value: function parse(val) {
	            var h1 = parseInt(val.charAt(0), 10),
	                h2 = parseInt(val.charAt(1), 10),
	                m1 = parseInt(val.charAt(3), 10),
	                m2 = parseInt(val.charAt(4), 10),
	                s1 = parseInt(val.charAt(6), 10),
	                s2 = parseInt(val.charAt(7), 10),
	                ms1 = parseInt(val.charAt(9), 10),
	                ms2 = parseInt(val.charAt(10), 10),
	                ms3 = parseInt(val.charAt(11), 10),
	                hh = h2 + h1 * 10,
	                mm = m2 + m1 * 10,
	                ss = s2 + s1 * 10,
	                ms = (isNaN(ms3) ? 0 : ms3) + (isNaN(ms2) ? 0 : ms2) * 10 + (isNaN(ms1) ? 0 : ms1) * 100;
	            return (hh * 3600 + mm * 60 + ss) * 1000 + ms;
	        }
	    }]);

	    return QTime;
	})(QParameter);

	var QNamespace = (function (_QParameter17) {
	    _inherits(QNamespace, _QParameter17);

	    function QNamespace() {
	        _classCallCheck(this, QNamespace);

	        _get(Object.getPrototypeOf(QNamespace.prototype), "constructor", this).apply(this, arguments);
	    }

	    return QNamespace;
	})(QParameter);

	var QString = (function (_QSymbol) {
	    _inherits(QString, _QSymbol);

	    function QString() {
	        _classCallCheck(this, QString);

	        _get(Object.getPrototypeOf(QString.prototype), "constructor", this).apply(this, arguments);
	    }

	    return QString;
	})(QSymbol);

	var QList = (function (_QParameter18) {
	    _inherits(QList, _QParameter18);

	    function QList() {
	        _classCallCheck(this, QList);

	        _get(Object.getPrototypeOf(QList.prototype), "constructor", this).call(this);
	        this.value = [];
	    }

	    _createClass(QList, [{
	        key: "add",
	        value: function add(val, type) {
	            var parameter = val;
	            if (!_constants.KDB.isComplex(type)) {
	                parameter = new params[_constants.QType[type]]();
	                parameter.setValue(val);
	            }
	            this.value.push(parameter);
	            return this;
	        }
	    }, {
	        key: "addAll",
	        value: function addAll(values, type) {
	            var _this = this;

	            values.forEach(function (val) {
	                return _this.add(val, type);
	            });
	            return this;
	        }
	    }], [{
	        key: "create",
	        value: function create() {
	            return new QList();
	        }
	    }]);

	    return QList;
	})(QParameter);

	var QDict = (function (_QParameter19) {
	    _inherits(QDict, _QParameter19);

	    function QDict() {
	        _classCallCheck(this, QDict);

	        _get(Object.getPrototypeOf(QDict.prototype), "constructor", this).call(this);
	        this.values = [];
	        this.fields = [];
	    }

	    _createClass(QDict, [{
	        key: "add",
	        value: function add(field, val, type) {
	            var parameter = val;
	            if (!_constants.KDB.isComplex(type)) {
	                parameter = new params[_constants.QType[type]]();
	                parameter.setValue(val);
	            }
	            var idx = this.fields.indexOf(field);
	            if (idx === -1) {
	                this.fields.push(field);
	                this.values.push(parameter);
	            } else {
	                this.values[idx] = parameter;
	            }
	            return this;
	        }
	    }, {
	        key: "remove",
	        value: function remove(field) {
	            var idx = this.fields.indexOf(field);
	            if (idx !== -1) {
	                this.fields.splice(idx, 1);
	                this.values.splice(idx, 1);
	            }
	            return this;
	        }
	    }, {
	        key: "getValue",
	        value: function getValue(field) {
	            var idx = this.fields.indexOf(field);
	            if (idx !== -1) {
	                return this.values[idx];
	            } else {
	                return null;
	            }
	        }
	    }], [{
	        key: "create",
	        value: function create() {
	            return new QDict();
	        }
	    }]);

	    return QDict;
	})(QParameter);

	var QFlip = (function (_QParameter20) {
	    _inherits(QFlip, _QParameter20);

	    function QFlip() {
	        _classCallCheck(this, QFlip);

	        _get(Object.getPrototypeOf(QFlip.prototype), "constructor", this).call(this);
	        this.values = [];
	        this.fields = [];
	    }

	    _createClass(QFlip, [{
	        key: "add",
	        value: function add(column, list) {
	            var parameter = new QList();
	            if (parameter instanceof QList || parameter instanceof QDict || parameter instanceof QFlip) {
	                parameter = list;
	            } else {
	                parameter.setValue(list);
	            }
	            this.fields.push(column);
	            this.values.push(parameter);
	            return this;
	        }
	    }, {
	        key: "remove",
	        value: function remove(field) {
	            var idx = this.fields.indexOf(field);
	            if (idx !== -1) {
	                this.fields.splice(idx, 1);
	                this.values.splice(idx, 1);
	            }
	            return this;
	        }
	    }], [{
	        key: "create",
	        value: function create() {
	            return new QDict();
	        }
	    }]);

	    return QFlip;
	})(QParameter);

	var QByteStream = (function (_QParameter21) {
	    _inherits(QByteStream, _QParameter21);

	    function QByteStream() {
	        _classCallCheck(this, QByteStream);

	        _get(Object.getPrototypeOf(QByteStream.prototype), "constructor", this).apply(this, arguments);
	    }

	    _createClass(QByteStream, [{
	        key: "setValue",
	        value: function setValue(val) {
	            this.value = val == null ? null : val.toString();
	        }
	    }]);

	    return QByteStream;
	})(QParameter);

	var params = {
	    QParameter: QParameter,
	    QBoolean: QBoolean,
	    QGUID: QGUID,
	    QByte: QByte,
	    QShort: QShort,
	    QInt: QInt,
	    QLong: QLong,
	    QReal: QReal,
	    QFloat: QFloat,
	    QChar: QChar,
	    QSymbol: QSymbol,
	    QTimeStamp: QTimeStamp,
	    QMonth: QMonth,
	    QDate: QDate,
	    QDateTime: QDateTime,
	    QTimeSpan: QTimeSpan,
	    QMinute: QMinute,
	    QSecond: QSecond,
	    QTime: QTime,
	    QString: QString,
	    QList: QList,
	    QDict: QDict,
	    QFlip: QFlip,
	    QByteStream: QByteStream,
	    QNamespace: QNamespace
	};

	exports.QParameter = QParameter;
	exports.QBoolean = QBoolean;
	exports.QGUID = QGUID;
	exports.QByte = QByte;
	exports.QShort = QShort;
	exports.QInt = QInt;
	exports.QLong = QLong;
	exports.QReal = QReal;
	exports.QFloat = QFloat;
	exports.QChar = QChar;
	exports.QSymbol = QSymbol;
	exports.QTimeStamp = QTimeStamp;
	exports.QMonth = QMonth;
	exports.QDate = QDate;
	exports.QDateTime = QDateTime;
	exports.QTimeSpan = QTimeSpan;
	exports.QMinute = QMinute;
	exports.QSecond = QSecond;
	exports.QTime = QTime;
	exports.QString = QString;
	exports.QList = QList;
	exports.QDict = QDict;
	exports.QFlip = QFlip;
	exports.QByteStream = QByteStream;
	exports.QNamespace = QNamespace;

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var f2 = function f2(x) {
	    return x < 10 ? "0" + x.toString().substr(0, 1) : x.toString().substr(0, 2);
	};
	var f3 = function f3(val) {
	    return val < 10 ? "00" + val : val < 100 ? "0" + val : "" + val;
	};
	var f9 = function f9(val) {
	    return "000000000".slice(val.toString().length) + val;
	};

	var JTemporal = (function () {
	    function JTemporal() {
	        _classCallCheck(this, JTemporal);

	        this.i = 0;
	    }

	    _createClass(JTemporal, [{
	        key: "nil",
	        value: function nil() {
	            return "";
	        }
	    }, {
	        key: "infinity",
	        value: function infinity() {
	            return String.fromCharCode(8734);
	        }
	    }, {
	        key: "parse",
	        value: function parse(i) {
	            throw new Error("Must override");
	        }
	    }, {
	        key: "toDate",
	        value: function toDate() {
	            return new Date(this.i);
	        }
	    }, {
	        key: "isNull",
	        value: function isNull() {
	            throw new Error("Must override");
	        }
	    }, {
	        key: "isInfinity",
	        value: function isInfinity() {
	            throw new Error("Must override");
	        }
	    }, {
	        key: "isNullOrInf",
	        value: function isNullOrInf() {
	            return this.isNull() || this.isInfinity();
	        }
	    }, {
	        key: "toString",
	        value: function toString() {
	            return this.isNull() ? this.nil() : this.isInfinity() ? this.infinity() : this.parse(this.i);
	        }
	    }]);

	    return JTemporal;
	})();

	var JTimeStamp = (function (_JTemporal) {
	    _inherits(JTimeStamp, _JTemporal);

	    function JTimeStamp() {
	        _classCallCheck(this, JTimeStamp);

	        _get(Object.getPrototypeOf(JTimeStamp.prototype), "constructor", this).call(this);
	        this.n = 0;
	    }

	    _createClass(JTimeStamp, [{
	        key: "parse",
	        value: function parse(i) {
	            var d = new Date(i);
	            return new JDate().parse(i) + "D" + f2(d.getUTCHours()) + ":" + f2(d.getUTCMinutes()) + ":" + f2(d.getUTCSeconds()) + "." + f9(this.n);
	        }
	    }, {
	        key: "isNull",
	        value: function isNull() {
	            return this.i === -9223372036854775808 && this.n === 192000000;
	        }
	    }, {
	        key: "isInfinity",
	        value: function isInfinity() {
	            return this.i === 10170056836854 && this.n === 854775807;
	        }
	    }]);

	    return JTimeStamp;
	})(JTemporal);

	var JMonth = (function (_JTemporal2) {
	    _inherits(JMonth, _JTemporal2);

	    function JMonth() {
	        _classCallCheck(this, JMonth);

	        _get(Object.getPrototypeOf(JMonth.prototype), "constructor", this).apply(this, arguments);
	    }

	    _createClass(JMonth, [{
	        key: "parse",
	        value: function parse(i) {
	            var yearBase = 2000;
	            var year = yearBase + Math.floor(i / 12);
	            var month = f2(i % 12 + 1);
	            return year + "." + month;
	        }
	    }, {
	        key: "isNull",
	        value: function isNull() {
	            return this.i === -2147483648;
	        }
	    }, {
	        key: "isInfinity",
	        value: function isInfinity() {
	            return this.i === 2147483647;
	        }
	    }, {
	        key: "toDate",
	        value: function toDate() {
	            var _toString$split = this.toString().split("-");

	            var _toString$split2 = _slicedToArray(_toString$split, 2);

	            var year = _toString$split2[0];
	            var month = _toString$split2[1];

	            month = parseInt(month, 10);
	            month = month === 0 ? 0 : month - 1;
	            return new Date(year, month);
	        }
	    }]);

	    return JMonth;
	})(JTemporal);

	var JDate = (function (_JTemporal3) {
	    _inherits(JDate, _JTemporal3);

	    function JDate() {
	        _classCallCheck(this, JDate);

	        _get(Object.getPrototypeOf(JDate.prototype), "constructor", this).apply(this, arguments);
	    }

	    _createClass(JDate, [{
	        key: "parse",
	        value: function parse(i) {
	            var d = new Date(i);
	            return [d.getUTCFullYear(), f2(d.getUTCMonth() + 1), f2(d.getUTCDate())].join(".");
	        }
	    }, {
	        key: "isNull",
	        value: function isNull() {
	            return this.i === -9223372036854775808;
	        }
	    }, {
	        key: "isInfinity",
	        value: function isInfinity() {
	            return this.i === 185543533785600000;
	        }
	    }]);

	    return JDate;
	})(JTemporal);

	var JDateTime = (function (_JTemporal4) {
	    _inherits(JDateTime, _JTemporal4);

	    function JDateTime() {
	        _classCallCheck(this, JDateTime);

	        _get(Object.getPrototypeOf(JDateTime.prototype), "constructor", this).apply(this, arguments);
	    }

	    _createClass(JDateTime, [{
	        key: "parse",
	        value: function parse(i) {
	            var d = new Date(i);
	            return new JDate().parse(i) + "T" + f2(d.getUTCHours()) + ":" + f2(d.getUTCMinutes()) + ":" + f2(d.getUTCSeconds()) + "." + f3(d.getUTCMilliseconds());
	        }
	    }, {
	        key: "isNull",
	        value: function isNull() {
	            return this.i === -9223372036854775808;
	        }
	    }, {
	        key: "isInfinity",
	        value: function isInfinity() {
	            return this.i === -9223371090169975808;
	        }
	    }]);

	    return JDateTime;
	})(JTemporal);

	var JTimeSpan = (function (_JTemporal5) {
	    _inherits(JTimeSpan, _JTemporal5);

	    function JTimeSpan() {
	        _classCallCheck(this, JTimeSpan);

	        _get(Object.getPrototypeOf(JTimeSpan.prototype), "constructor", this).apply(this, arguments);
	    }

	    _createClass(JTimeSpan, [{
	        key: "parse",
	        value: function parse(i) {
	            var days = Math.floor(i / 86400000000000),
	                nanos = i % 86400000000000;
	            return days + "D" + new JSecond().parse(Math.floor(nanos / 1000000000)) + "." + f9(nanos % 1000000000);
	        }
	    }, {
	        key: "toDate",
	        value: function toDate() {
	            var date = new Date(1970, 0, 1);
	            date.setUTCDate(Math.floor(this.i / 86400000000000) + 1);
	            var millseconds = Math.floor(this.i % 86400000000000 / 1000000);
	            date.setUTCMilliseconds(millseconds);
	            return date;
	        }
	    }, {
	        key: "isNull",
	        value: function isNull() {
	            return this.i === -9223372036854775808;
	        }
	    }, {
	        key: "isInfinity",
	        value: function isInfinity() {
	            return this.i === 10170056836854;
	        }
	    }]);

	    return JTimeSpan;
	})(JTemporal);

	var JMinute = (function (_JTemporal6) {
	    _inherits(JMinute, _JTemporal6);

	    function JMinute() {
	        _classCallCheck(this, JMinute);

	        _get(Object.getPrototypeOf(JMinute.prototype), "constructor", this).apply(this, arguments);
	    }

	    _createClass(JMinute, [{
	        key: "parse",
	        value: function parse(i) {
	            return f2(Math.floor(i / 60)) + ":" + f2(i % 60);
	        }
	    }, {
	        key: "isNull",
	        value: function isNull() {
	            return this.i === -2147483648;
	        }
	    }, {
	        key: "isInfinity",
	        value: function isInfinity() {
	            return this.i === 2147483647;
	        }
	    }, {
	        key: "toDate",
	        value: function toDate() {
	            return new Date(this.i * 1000);
	        }
	    }]);

	    return JMinute;
	})(JTemporal);

	var JSecond = (function (_JTemporal7) {
	    _inherits(JSecond, _JTemporal7);

	    function JSecond() {
	        _classCallCheck(this, JSecond);

	        _get(Object.getPrototypeOf(JSecond.prototype), "constructor", this).apply(this, arguments);
	    }

	    _createClass(JSecond, [{
	        key: "parse",
	        value: function parse(i) {
	            return new JMinute().parse(Math.floor(i / 60)) + ":" + f2(i % 60);
	        }
	    }, {
	        key: "isNull",
	        value: function isNull() {
	            return this.i === -2147483648;
	        }
	    }, {
	        key: "isInfinity",
	        value: function isInfinity() {
	            return this.i === 2147483647;
	        }
	    }, {
	        key: "toDate",
	        value: function toDate() {
	            return new Date(this.i * 1000);
	        }
	    }]);

	    return JSecond;
	})(JTemporal);

	var JTime = (function (_JTemporal8) {
	    _inherits(JTime, _JTemporal8);

	    function JTime() {
	        _classCallCheck(this, JTime);

	        _get(Object.getPrototypeOf(JTime.prototype), "constructor", this).apply(this, arguments);
	    }

	    _createClass(JTime, [{
	        key: "parse",
	        value: function parse(i) {
	            return new JSecond().parse(Math.floor(i / 1000)) + "." + f3(i % 1000);
	        }
	    }, {
	        key: "isNull",
	        value: function isNull() {
	            return this.i === -9223372036854775808;
	        }
	    }, {
	        key: "isInfinity",
	        value: function isInfinity() {
	            return this.i === 2147483647;
	        }
	    }]);

	    return JTime;
	})(JTemporal);

	var JUUID = (function () {
	    function JUUID() {
	        _classCallCheck(this, JUUID);

	        this.uuid = "";
	    }

	    _createClass(JUUID, [{
	        key: "toString",
	        value: function toString() {
	            return this.uuid;
	        }
	    }]);

	    return JUUID;
	})();

	exports.JTemporal = JTemporal;
	exports.JTimeStamp = JTimeStamp;
	exports.JMonth = JMonth;
	exports.JDate = JDate;
	exports.JDateTime = JDateTime;
	exports.JTimeSpan = JTimeSpan;
	exports.JMinute = JMinute;
	exports.JSecond = JSecond;
	exports.JTime = JTime;
	exports.JUUID = JUUID;

/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var KDB = {
	    LIST: 0,
	    BOOLEAN: 1,
	    GUID: 2,
	    BYTE: 4,
	    SHORT: 5,
	    INT: 6,
	    LONG: 7,
	    REAL: 8,
	    FLOAT: 9,
	    CHAR: 10,
	    SYMBOL: 11,
	    TIMESTAMP: 12,
	    MONTH: 13,
	    DATE: 14,
	    DATETIME: 15,
	    TIMESPAN: 16,
	    MINUTE: 17,
	    SECOND: 18,
	    TIME: 19,
	    BYTESTREAM: 97,
	    FLIP: 98,
	    DICT: 99,
	    STRING: 1001,
	    OBJECT: 1002,
	    TYPE_NAMES: {
	        0: "List",
	        1: "Boolean",
	        2: "GUID",
	        4: "Byte",
	        5: "Short",
	        6: "Integer",
	        7: "Long",
	        8: "Real",
	        9: "Float",
	        10: "Char",
	        11: "Symbol",
	        12: "Timestamp",
	        13: "Month",
	        14: "Date",
	        15: "DateTime",
	        16: "Timespan",
	        17: "Minute",
	        18: "Second",
	        19: "Time",
	        97: "ByteStream",
	        98: "Flip",
	        99: "Dict",
	        1001: "String",
	        1002: "Object"
	    },
	    TYPES: [0, 1, 2, 4, 5, 6, 7, 8, 9, 10, 1001, 11, 12, 13, 14, 15, 16, 17, 18, 19, 97, 98, 99, 1002]
	};

	KDB.NAMES = {
	    List: KDB.LIST,
	    Boolean: KDB.BOOLEAN,
	    Byte: KDB.BYTE,
	    GUID: KDB.GUID,
	    Short: KDB.SHORT,
	    Integer: KDB.INT,
	    Long: KDB.LONG,
	    Float: KDB.FLOAT,
	    Real: KDB.REAL,
	    Double: KDB.FLOAT,
	    Char: KDB.CHAR,
	    Symbol: KDB.SYMBOL,
	    TimeStamp: KDB.TIMESTAMP,
	    Month: KDB.MONTH,
	    Date: KDB.DATE,
	    DateTime: KDB.DATETIME,
	    TimeSpan: KDB.TIMESPAN,
	    Minute: KDB.MINUTE,
	    Second: KDB.SECOND,
	    Time: KDB.TIME,
	    Dict: KDB.DICT,
	    Flip: KDB.FLIP,
	    ByteStream: KDB.BYTESTREAM,
	    String: KDB.STRING,
	    Object: KDB.OBJECT
	};

	KDB.nameToType = function (name) {
	    return KDB.NAMES[name];
	};
	KDB.typeToName = function (type) {
	    return KDB.TYPE_NAMES[Math.abs(type)];
	};
	KDB.isTemporal = function (type) {
	    return [12, 13, 14, 15, 16, 17, 18, 19].indexOf(type) > -1;
	};
	KDB.isNumeric = function (type) {
	    return [4, 5, 6, 7, 8, 9].indexOf(type) > -1;
	};
	KDB.isLiteral = function (type) {
	    return [2, 10, 11, 1001].indexOf(type) > -1;
	};
	KDB.isComplex = function (type) {
	    return [0, 98, 99, 1002].indexOf(type) > -1;
	};
	KDB.isAtomic = function (type) {
	    return [0, 98, 99, 1002].indexOf(type) === -1;
	};
	KDB.isList = function (type) {
	    return type === KDB.LIST;
	};
	KDB.isDict = function (type) {
	    return type === KDB.DICT;
	};
	KDB.isFlip = function (type) {
	    return type === KDB.FLIP;
	};

	var QType = {
	    QList: 0,
	    QBoolean: 1,
	    QGUID: 2,
	    QByte: 4,
	    QShort: 5,
	    QInt: 6,
	    QLong: 7,
	    QReal: 8,
	    QFloat: 9,
	    QChar: 10,
	    QSymbol: 11,
	    QTimeStamp: 12,
	    QMonth: 13,
	    QDate: 14,
	    QDateTime: 15,
	    QTimeSpan: 16,
	    QMinute: 17,
	    QSecond: 18,
	    QTime: 19,
	    QByteStream: 97,
	    QFlip: 98,
	    QDict: 99,
	    QString: 1001,

	    0: "QList",
	    1: "QBoolean",
	    2: "QGUID",
	    4: "QByte",
	    5: "QShort",
	    6: "QInt",
	    7: "QLong",
	    8: "QReal",
	    9: "QFloat",
	    10: "QChar",
	    11: "QSymbol",
	    12: "QTimeStamp",
	    13: "QMonth",
	    14: "QDate",
	    15: "QDateTime",
	    16: "QTimeSpan",
	    17: "QMinute",
	    18: "QSecond",
	    19: "QTime",
	    97: "QByteStream",
	    98: "QFlip",
	    99: "QDict",
	    1001: "QString"
	};

	exports.KDB = KDB;
	exports.QType = QType;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var _temporals = __webpack_require__(2);

	var SQLQuery = function SQLQuery() {
	    _classCallCheck(this, SQLQuery);
	};

	var SQLParameter = (function () {
	    function SQLParameter() {
	        _classCallCheck(this, SQLParameter);

	        this.name = null;
	        this.value = null;
	    }

	    _createClass(SQLParameter, [{
	        key: "setName",
	        value: function setName(name) {
	            this.name = name;
	        }
	    }, {
	        key: "setValue",
	        value: function setValue(val) {
	            this.value = val;
	        }
	    }]);

	    return SQLParameter;
	})();

	var SQLBoolean = (function (_SQLParameter) {
	    _inherits(SQLBoolean, _SQLParameter);

	    function SQLBoolean() {
	        _classCallCheck(this, SQLBoolean);

	        _get(Object.getPrototypeOf(SQLBoolean.prototype), "constructor", this).call(this);
	        this.value = false;
	    }

	    _createClass(SQLBoolean, [{
	        key: "setValue",
	        value: function setValue(val) {
	            val = val == null ? false : val;
	            if (typeof val === "string") {
	                val = val.toString().toLowerCase().charAt(0) === "t" ? true : false;
	            }
	            this.value = val;
	        }
	    }]);

	    return SQLBoolean;
	})(SQLParameter);

	var SQLByte = (function (_SQLParameter2) {
	    _inherits(SQLByte, _SQLParameter2);

	    function SQLByte() {
	        _classCallCheck(this, SQLByte);

	        _get(Object.getPrototypeOf(SQLByte.prototype), "constructor", this).apply(this, arguments);
	    }

	    return SQLByte;
	})(SQLParameter);

	;

	var SQLShort = (function (_SQLParameter3) {
	    _inherits(SQLShort, _SQLParameter3);

	    function SQLShort() {
	        _classCallCheck(this, SQLShort);

	        _get(Object.getPrototypeOf(SQLShort.prototype), "constructor", this).apply(this, arguments);
	    }

	    _createClass(SQLShort, [{
	        key: "setValue",
	        value: function setValue(val) {
	            this.value = val == null ? null : isNaN(val) ? null : parseInt(val, 10);
	        }
	    }]);

	    return SQLShort;
	})(SQLParameter);

	var SQLInt = (function (_SQLParameter4) {
	    _inherits(SQLInt, _SQLParameter4);

	    function SQLInt() {
	        _classCallCheck(this, SQLInt);

	        _get(Object.getPrototypeOf(SQLInt.prototype), "constructor", this).apply(this, arguments);
	    }

	    _createClass(SQLInt, [{
	        key: "setValue",
	        value: function setValue(val) {
	            this.value = val == null ? null : isNaN(val) ? null : parseInt(val, 10);
	        }
	    }]);

	    return SQLInt;
	})(SQLParameter);

	var SQLLong = (function (_SQLParameter5) {
	    _inherits(SQLLong, _SQLParameter5);

	    function SQLLong() {
	        _classCallCheck(this, SQLLong);

	        _get(Object.getPrototypeOf(SQLLong.prototype), "constructor", this).apply(this, arguments);
	    }

	    _createClass(SQLLong, [{
	        key: "setValue",
	        value: function setValue(val) {
	            this.value = val == null ? null : isNaN(val) ? null : parseFloat(val);
	        }
	    }]);

	    return SQLLong;
	})(SQLParameter);

	var SQLDouble = (function (_SQLLong) {
	    _inherits(SQLDouble, _SQLLong);

	    function SQLDouble() {
	        _classCallCheck(this, SQLDouble);

	        _get(Object.getPrototypeOf(SQLDouble.prototype), "constructor", this).apply(this, arguments);
	    }

	    return SQLDouble;
	})(SQLLong);

	;

	var SQLFloat = (function (_SQLLong2) {
	    _inherits(SQLFloat, _SQLLong2);

	    function SQLFloat() {
	        _classCallCheck(this, SQLFloat);

	        _get(Object.getPrototypeOf(SQLFloat.prototype), "constructor", this).apply(this, arguments);
	    }

	    return SQLFloat;
	})(SQLLong);

	;

	var SQLVarChar = (function (_SQLParameter6) {
	    _inherits(SQLVarChar, _SQLParameter6);

	    function SQLVarChar() {
	        _classCallCheck(this, SQLVarChar);

	        _get(Object.getPrototypeOf(SQLVarChar.prototype), "constructor", this).apply(this, arguments);
	    }

	    _createClass(SQLVarChar, [{
	        key: "setValue",
	        value: function setValue(val) {
	            this.value = val == null ? null : val.toString();
	        }
	    }]);

	    return SQLVarChar;
	})(SQLParameter);

	var SQLTimeStamp = (function (_SQLParameter7) {
	    _inherits(SQLTimeStamp, _SQLParameter7);

	    function SQLTimeStamp() {
	        _classCallCheck(this, SQLTimeStamp);

	        _get(Object.getPrototypeOf(SQLTimeStamp.prototype), "constructor", this).call(this);
	    }

	    _createClass(SQLTimeStamp, [{
	        key: "setValue",
	        value: function setValue(val) {
	            if (val == null || val === "0Np") {
	                val = null;
	            }
	            if (val instanceof String || typeof val === "string") {
	                val = this.parseTimeStr(val);
	            }
	            if (val instanceof _temporals.JTemporal) {
	                val = val.i;
	            }
	            if (val instanceof Date) {
	                val = val.getTime();
	            }
	            if (val != null) {
	                val = isNaN(val) ? null : val;
	            }
	            this.value = val;
	        }
	    }, {
	        key: "parseTimeStr",
	        value: function parseTimeStr(val) {
	            var splitChar = val.indexOf(" ") != -1 ? " " : val.indexOf("D") != 1 ? "D" : "";
	            var dateTimeParts = val.split(splitChar);
	            var parts = dateTimeParts[0].split("."),
	                year = parseInt(parts[0]),
	                month = parseInt(parts[1]),
	                day = parseInt(parts[2]);
	            month = month == 0 ? 0 : month - 1;
	            day = day == 0 ? 1 : day;

	            var h1 = parseInt(dateTimeParts[1].charAt(0)),
	                h2 = parseInt(dateTimeParts[1].charAt(1));
	            var m1 = parseInt(dateTimeParts[1].charAt(3)),
	                m2 = parseInt(dateTimeParts[1].charAt(4));
	            var s1 = parseInt(dateTimeParts[1].charAt(6)),
	                s2 = parseInt(dateTimeParts[1].charAt(7));
	            var ms1 = parseInt(dateTimeParts[1].charAt(9)),
	                ms2 = parseInt(dateTimeParts[1].charAt(10)),
	                ms3 = parseInt(dateTimeParts[1].charAt(11));

	            var hh = h2 + h1 * 10,
	                mm = m2 + m1 * 10,
	                ss = s2 + s1 * 10,
	                ms = ms3 + ms2 * 10 + ms1 * 100;

	            var date = new Date(year, month, day, hh, mm, ss, ms);
	            return date.getTime();
	        }
	    }]);

	    return SQLTimeStamp;
	})(SQLParameter);

	var SQLDate = (function (_SQLParameter8) {
	    _inherits(SQLDate, _SQLParameter8);

	    function SQLDate() {
	        _classCallCheck(this, SQLDate);

	        _get(Object.getPrototypeOf(SQLDate.prototype), "constructor", this).call(this);
	    }

	    _createClass(SQLDate, [{
	        key: "setValue",
	        value: function setValue(val) {
	            if (val == null || val === "0Nd") {
	                val = null;
	            }
	            if (val instanceof String || typeof val === "string") {
	                val = this.parseTimeStr(val);
	            }
	            if (val instanceof _temporals.JTemporal) {
	                val = val.i;
	            }
	            if (val instanceof Date) {
	                val = val.getTime();
	            }
	            if (val != null) {
	                val = isNaN(val) ? null : val;
	            }
	            this.value = val;
	        }
	    }, {
	        key: "parseTimeStr",
	        value: function parseTimeStr(val) {
	            var dateTimeParts = val.split(" ");

	            var _val$split = val.split(".");

	            var _val$split2 = _slicedToArray(_val$split, 3);

	            var year = _val$split2[0];
	            var month = _val$split2[1];
	            var day = _val$split2[2];

	            month = parseInt(month, 10);
	            day = parseInt(day, 10);
	            month = month === 0 ? 0 : month - 1;
	            day = day === 0 ? 1 : day;
	            var date = new Date();
	            date.setFullYear(year, month, day);
	            return date.getTime();
	        }
	    }]);

	    return SQLDate;
	})(SQLParameter);

	var SQLTime = (function (_SQLParameter9) {
	    _inherits(SQLTime, _SQLParameter9);

	    function SQLTime() {
	        _classCallCheck(this, SQLTime);

	        _get(Object.getPrototypeOf(SQLTime.prototype), "constructor", this).call(this);
	    }

	    _createClass(SQLTime, [{
	        key: "setValue",
	        value: function setValue(val) {
	            if (val == null || val === "0Nt") {
	                val = null;
	            }
	            if (val instanceof String || typeof val === "string") {
	                val = this.parseTimeStr(val);
	            }
	            if (val instanceof _temporals.JTemporal) {
	                val = val.i;
	            }
	            if (val instanceof Date) {
	                val = val.getTime();
	            }
	            if (val != null) {
	                val = isNaN(val) ? null : val;
	            }
	            this.value = val;
	        }
	    }, {
	        key: "parseTimeStr",
	        value: function parseTimeStr(val) {
	            var h1 = parseInt(val.charAt(0), 10),
	                h2 = parseInt(val.charAt(1), 10),
	                m1 = parseInt(val.charAt(3), 10),
	                m2 = parseInt(val.charAt(4), 10),
	                s1 = parseInt(val.charAt(6), 10),
	                s2 = parseInt(val.charAt(7), 10),
	                ms1 = parseInt(val.charAt(9), 10),
	                ms2 = parseInt(val.charAt(10), 10),
	                ms3 = parseInt(val.charAt(11), 10),
	                hh = h2 + h1 * 10,
	                mm = m2 + m1 * 10,
	                ss = s2 + s1 * 10,
	                ms = (isNaN(ms3) ? 0 : ms3) + (isNaN(ms2) ? 0 : ms2) * 10 + (isNaN(ms1) ? 0 : ms1) * 100;
	            return (hh * 3600 + mm * 60 + ss) * 1000 + ms;
	        }
	    }]);

	    return SQLTime;
	})(SQLParameter);

	var SQLList = (function (_SQLParameter10) {
	    _inherits(SQLList, _SQLParameter10);

	    function SQLList() {
	        _classCallCheck(this, SQLList);

	        _get(Object.getPrototypeOf(SQLList.prototype), "constructor", this).call(this);
	        this.value = [];
	    }

	    return SQLList;
	})(SQLParameter);

	var params = {
	    SQLParameter: SQLParameter,
	    SQLBoolean: SQLBoolean,
	    SQLByte: SQLByte,
	    SQLShort: SQLShort,
	    SQLInt: SQLInt,
	    SQLLong: SQLLong,
	    SQLDouble: SQLDouble,
	    SQLFloat: SQLFloat,
	    SQLVarChar: SQLVarChar,
	    SQLTimeStamp: SQLTimeStamp,
	    SQLDate: SQLDate,
	    SQLTime: SQLTime,
	    SQLList: SQLList
	};

	exports.SQLParameter = SQLParameter;
	exports.SQLBoolean = SQLBoolean;
	exports.SQLByte = SQLByte;
	exports.SQLShort = SQLShort;
	exports.SQLInt = SQLInt;
	exports.SQLLong = SQLLong;
	exports.SQLDouble = SQLDouble;
	exports.SQLFloat = SQLFloat;
	exports.SQLVarChar = SQLVarChar;
	exports.SQLTimeStamp = SQLTimeStamp;
	exports.SQLDate = SQLDate;
	exports.SQLTime = SQLTime;
	exports.SQLList = SQLList;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _get = function get(_x15, _x16, _x17) { var _again = true; _function: while (_again) { var object = _x15, property = _x16, receiver = _x17; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x15 = parent; _x16 = property; _x17 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var _parameters = __webpack_require__(1);

	var p = _interopRequireWildcard(_parameters);

	var _constants = __webpack_require__(3);

	var PAGED_NONE = "NONE";
	var PAGED_OFFSET = "OFFSET";
	var PAGED_OFFSET_NOCACHE = "OFFSET_NOCACHE";
	var PAGED_PAGENO = "PAGENO";
	var PAGED_PAGENO_NOCACHE = "PAGENO_NOCACHE";

	var KDBQuery = (function () {
	  function KDBQuery() {
	    _classCallCheck(this, KDBQuery);

	    this.lambda = "";
	    this.parameters = [];
	    this.rows = 10;
	    this.page = -1;
	    this.unlimitedRows = false;
	    this.kxPaged = PAGED_NONE; // '.page.run*' wrapping
	    this.sorting = null; // QDict expected
	    this.uiParams = null; // QDict expected
	  }

	  // TODO: BMA. The page number no longer makes sense. Paging needs to be enabled with the createPaged constructor.
	  // Only open question is if it is still used when QR is disabled

	  _createClass(KDBQuery, [{
	    key: "compare",
	    value: function compare(query) {
	      return true;
	    }
	  }, {
	    key: "wrapLambda",
	    value: function wrapLambda(lambda) {
	      if (lambda.charAt(0) !== "{") {
	        return "{[] " + lambda + "}";
	      }
	      return lambda;
	    }
	  }, {
	    key: "addParameter",
	    value: function addParameter(value, type) {
	      var parameter = new p[_constants.QType[type]]();
	      if (parameter instanceof p.QList || parameter instanceof p.QDict || parameter instanceof p.QFlip) {
	        parameter = value;
	      } else {
	        parameter.setValue(value);
	      }
	      this.parameters.push(parameter);
	      return this;
	    }
	  }, {
	    key: "setParameter",
	    value: function setParameter(idx, value, type) {
	      var parameter = new p[_constants.QType[type]]();
	      if (parameter instanceof p.QList || parameter instanceof p.QDict || parameter instanceof p.QFlip) {
	        parameter = value;
	      } else {
	        parameter.setValue(value);
	      }
	      this.parameters[idx] = parameter;
	      return this;
	    }
	  }, {
	    key: "removeParameters",
	    value: function removeParameters() {
	      this.parameters = [];
	      return this;
	    }
	  }], [{
	    key: "create",
	    value: function create(lambda) {
	      var rows = arguments.length <= 1 || arguments[1] === undefined ? 10 : arguments[1];
	      var page = arguments.length <= 2 || arguments[2] === undefined ? -1 : arguments[2];
	      var unlimitedRows = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];

	      var query = new KDBQuery();
	      query.lambda = query.wrapLambda(lambda);
	      query.rows = rows;
	      query.page = page;
	      query.unlimitedRows = unlimitedRows;
	      return query;
	    }
	  }, {
	    key: "createPaged",
	    value: function createPaged(lambda) {
	      var pageType = arguments.length <= 1 || arguments[1] === undefined ? PAGED_NONE : arguments[1];
	      var pgOffset = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];
	      var blockSize = arguments.length <= 3 || arguments[3] === undefined ? 100 : arguments[3];
	      var sorting = arguments.length <= 4 || arguments[4] === undefined ? new p.QDict() : arguments[4];
	      var uiParams = arguments.length <= 5 || arguments[5] === undefined ? new p.QDict() : arguments[5];

	      var query = new KDBQuery();
	      query.lambda = query.wrapLambda(lambda);
	      query.kxPaged = pageType;
	      query.rows = blockSize;
	      query.page = pgOffset;
	      query.unlimitedRows = false;
	      query.sorting = sorting;
	      query.uiParams = uiParams;
	      return query;
	    }
	  }]);

	  return KDBQuery;
	})();

	var APIQuery = (function (_KDBQuery) {
	  _inherits(APIQuery, _KDBQuery);

	  function APIQuery() {
	    _classCallCheck(this, APIQuery);

	    _get(Object.getPrototypeOf(APIQuery.prototype), "constructor", this).apply(this, arguments);
	  }

	  _createClass(APIQuery, null, [{
	    key: "create",
	    value: function create(analytic) {
	      var rows = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
	      var page = arguments.length <= 2 || arguments[2] === undefined ? 1 : arguments[2];
	      var unlimitedRows = arguments.length <= 3 || arguments[3] === undefined ? true : arguments[3];

	      var query = new APIQuery();
	      query.lambda = analytic;
	      query.rows = rows;
	      query.page = page;
	      query.unlimitedRows = unlimitedRows;
	      return query;
	    }
	  }]);

	  return APIQuery;
	})(KDBQuery);

	var SQLQuery = (function () {
	  function SQLQuery() {
	    _classCallCheck(this, SQLQuery);

	    this.query = "";
	    this.parameters = [];
	    this.rows = 10;
	    this.page = -1;
	    this.unlimitedRows = false;
	  }

	  _createClass(SQLQuery, null, [{
	    key: "create",
	    value: function create(queryStr) {
	      var rows = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
	      var page = arguments.length <= 2 || arguments[2] === undefined ? 1 : arguments[2];
	      var unlimitedRows = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];

	      var query = new SQLQuery();
	      query.query = queryStr;
	      query.rows = rows;
	      query.page = page;
	      query.unlimitedRows = unlimitedRows;
	      return query;
	    }
	  }]);

	  return SQLQuery;
	})();

	var DataSet = (function () {
	  function DataSet() {
	    _classCallCheck(this, DataSet);

	    this.columns = [];
	    this.meta = {};
	    this.rows = [];
	  }

	  _createClass(DataSet, [{
	    key: "column",
	    value: function column(field) {
	      return this.rows.map(function (row) {
	        return row[field];
	      });
	    }
	  }, {
	    key: "row",
	    value: function row(idx) {
	      if (idx >= this.rows.length) {
	        return [];
	      }
	      var row = this.rows[idx];
	      return this.columns.map(function (c) {
	        return row[c];
	      });
	    }
	  }, {
	    key: "isEmpty",
	    value: function isEmpty() {
	      return this.rows.length === 0;
	    }
	  }]);

	  return DataSet;
	})();

	exports.KDBQuery = KDBQuery;
	exports.APIQuery = APIQuery;
	exports.SQLQuery = SQLQuery;
	exports.DataSet = DataSet;

/***/ }
/******/ ])
});
;