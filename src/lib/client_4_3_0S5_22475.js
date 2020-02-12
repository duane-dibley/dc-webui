(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("kdb"));
	else if(typeof define === 'function' && define.amd)
		define(["kdb"], factory);
	else if(typeof exports === 'object')
		exports["web"] = factory(require("kdb"));
	else
		root["web"] = factory(root["kdb"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_65__) {
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
	exports.Client = undefined;

	var _remoting = __webpack_require__(1);

	Object.keys(_remoting).forEach(function (key) {
	    if (key === "default" || key === "__esModule") return;
	    Object.defineProperty(exports, key, {
	        enumerable: true,
	        get: function get() {
	            return _remoting[key];
	        }
	    });
	});

	var _connection = __webpack_require__(15);

	var _security = __webpack_require__(2);

	var _endec = __webpack_require__(64);

	var _BehaviorSubject = __webpack_require__(31);

	var Client = function Client() {
	    var details = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
	    var useBinary = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
	    var qmBinary = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

	    var connectAttempt = 0;
	    var clientReqLogInterval = null;

	    var conn = (0, _connection.connection)(details, useBinary, qmBinary),
	        clientToken = new _security.ClientToken(),
	        deltaClient = null,
	        username = null,
	        systemConfiguration = null,

	    // Can be password. or unique token. Used in message authorization
	    cipherToken = null,
	        status = new _BehaviorSubject.BehaviorSubject({
	        type: Client.status.LOGGED_OUT
	    });

	    var req = function req(service, result, fault) {
	        for (var _len = arguments.length, args = Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
	            args[_key - 3] = arguments[_key];
	        }

	        var r = (0, _connection.request)(service, result, fault, args, deltaClient);
	        if (r.deltaClient) {
	            r.deltaClient.requestId = r.uid;
	            r.deltaClient.requestToken = clientToken.getRequestToken();
	        }
	        conn.send(r);
	        return r;
	    };

	    var reqWithAppMsg = function reqWithAppMsg(service, result, fault, appMsg) {
	        for (var _len2 = arguments.length, args = Array(_len2 > 4 ? _len2 - 4 : 0), _key2 = 4; _key2 < _len2; _key2++) {
	            args[_key2 - 4] = arguments[_key2];
	        }

	        var r = (0, _connection.request)(service, result, fault, args, deltaClient, appMsg);
	        if (r.deltaClient) {
	            r.deltaClient.requestId = r.uid;
	            r.deltaClient.requestToken = clientToken.getRequestToken();
	        }
	        conn.send(r);
	        return r;
	    };

	    var post = function post(service, result, fault) {
	        for (var _len3 = arguments.length, args = Array(_len3 > 3 ? _len3 - 3 : 0), _key3 = 3; _key3 < _len3; _key3++) {
	            args[_key3 - 3] = arguments[_key3];
	        }

	        var r = (0, _connection.request)(service, result, fault, args, deltaClient);
	        if (r.deltaClient) {
	            r.deltaClient.requestId = r.uid;
	            r.deltaClient.requestToken = clientToken.getRequestToken();
	        }
	        conn.post(r);
	        return r;
	    };

	    status.subscribe(function (x) {
	        return console.log("client status", x);
	    });

	    // Initialises the websocket connection. 
	    var initConnection = function initConnection() {
	        conn.doConnect(deltaClient.id);
	    };

	    var disconnect = function disconnect() {
	        conn.doDisconnect();
	    };

	    var startHeartbeating = function startHeartbeating() {
	        console.log("Initiating SSO Heartbeat");
	        setInterval(function () {
	            var http = new XMLHttpRequest();
	            http.open("GET", conn.url + "/ssoHeartBeat", true);
	            http.onreadystatechange = function (e) {
	                if (http.readyState == 4 && http.status == 401) {
	                    window.location.href = conn.url;
	                }
	            };
	            http.send();
	        }, 30000);
	    };

	    var login = function login(user, pass) {
	        var clientType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "unknown";
	        var traits = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];

	        status.next({
	            type: Client.status.CONNECTING
	        });
	        clientToken.initKey(pass);
	        username = user;
	        cipherToken = pass;
	        var uae = _remoting.UserAccessEntity.create(user, pass, clientType, traits);
	        var http = new XMLHttpRequest();
	        http.open("POST", conn.url + "/kxlogon", true);
	        http.setRequestHeader('Content-Type', 'application/json');
	        http.onreadystatechange = function (e) {
	            if (http.readyState == 4 && http.status == 200) {
	                var data = JSON.parse(http.responseText);
	                var logonSuccess = data[1];
	                if (logonSuccess) {
	                    var result = data[0];
	                    deltaClient = new _remoting.DeltaClient();
	                    deltaClient.id = result[0].clientId;
	                    setClientLoggingEnabled(result[0].clientLoggingEnabled);
	                    deltaClient.tokenKey = result[1][0];
	                    clientToken.init(result[1][2], result[2]);
	                    systemConfiguration = result[3];
	                    status.next({
	                        type: Client.status.LOGGED_IN
	                    });
	                    initConnection();
	                } else {
	                    var error = data[2];
	                    if (error === "expired") {
	                        status.next({
	                            type: Client.status.EXPIRED,
	                            data: error
	                        });
	                    } else if (error === "reset") {
	                        status.next({
	                            type: Client.status.RESET,
	                            data: error
	                        });
	                    } else {
	                        status.next({
	                            type: Client.status.FAULT,
	                            data: error
	                        });
	                    }
	                }
	            };
	        };
	        http.send(JSON.stringify(uae));
	    };

	    var loginWithTokenKey = function loginWithTokenKey(tokenKey) {
	        var clientType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "unknown";
	        var traits = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

	        status.next({
	            type: Client.status.CONNECTING
	        });
	        var tokenae = _remoting.TokenIdAccessEntity.create(tokenKey, clientType, traits);
	        var http = new XMLHttpRequest();
	        http.open("POST", conn.url + "/kxlogon", true);
	        http.setRequestHeader('Content-Type', 'application/json');
	        http.onreadystatechange = function (e) {
	            if (http.readyState == 4 && http.status == 200) {
	                var data = JSON.parse(http.responseText);
	                var logonSuccess = data[1];
	                if (logonSuccess) {
	                    var result = data[0];
	                    var userpass = (0, _security.decryptUserPass)(result[0].uda);
	                    username = parseUserPass(userpass)[0];
	                    cipherToken = parseUserPass(userpass)[1];
	                    clientToken.initKey(cipherToken);
	                    deltaClient = new _remoting.DeltaClient();
	                    deltaClient.id = result[0].clientId;
	                    setClientLoggingEnabled(result[0].clientLoggingEnabled);
	                    deltaClient.tokenKey = result[1][0];
	                    clientToken.init(result[1][2], result[2]);
	                    systemConfiguration = result[3];
	                    status.next({
	                        type: Client.status.LOGGED_IN
	                    });
	                    initConnection();
	                } else {
	                    var error = data[2];
	                    if (error === "expired") {
	                        status.next({
	                            type: Client.status.EXPIRED,
	                            data: error
	                        });
	                    } else if (error === "reset") {
	                        status.next({
	                            type: Client.status.RESET,
	                            data: error
	                        });
	                    } else {
	                        status.next({
	                            type: Client.status.FAULT,
	                            data: error
	                        });
	                    }
	                }
	            }
	        };
	        http.send(JSON.stringify(tokenae));
	    };

	    // Requires user authentication to be handled by third party (SAML/Kerberos)
	    var register = function register() {
	        var clientType = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "unknown";
	        var traits = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

	        status.next({
	            type: Client.status.CONNECTING
	        });
	        var regAE = _remoting.RegisterAccessEntity.create(clientType, traits);
	        // TODO BMA - move into connection with generic post option
	        var http = new XMLHttpRequest();
	        http.open("POST", conn.url + "/clientRegister", true);
	        http.setRequestHeader('Content-Type', 'application/json');
	        http.onreadystatechange = function (e) {
	            if (http.readyState == 4 && http.status == 401) {
	                window.location.href = conn.url;
	            } else if (http.readyState == 4 && http.status == 200) {
	                var data = (0, _endec.decode)(http.responseText);
	                var logonSuccess = data[0];
	                if (logonSuccess) {
	                    var result = data[1];
	                    var usertoken = (0, _security.decryptUserPass)(result[0].uda);
	                    username = parseUserPass(usertoken)[0];
	                    cipherToken = parseUserPass(usertoken)[1];
	                    clientToken.initKey(cipherToken);
	                    deltaClient = new _remoting.DeltaClient();
	                    deltaClient.id = result[0].clientId;
	                    setClientLoggingEnabled(result[0].clientLoggingEnabled);
	                    deltaClient.tokenKey = result[1][0];
	                    clientToken.init(result[1][2], result[2]);
	                    systemConfiguration = result[3];
	                    status.next({
	                        type: Client.status.LOGGED_IN
	                    });
	                    initConnection();
	                    startHeartbeating();
	                } else {
	                    var error = data[1];
	                    status.next({
	                        type: Client.status.FAULT,
	                        data: error
	                    });
	                }
	            }
	        };
	        http.send((0, _endec.encode)(regAE));
	    };

	    var logoutCleanup = function logoutCleanup(data) {
	        clientToken.reset();
	        deltaClient = null;
	        conn.clear();
	        status.next({
	            type: Client.status.LOGGED_OUT,
	            data: data
	        });
	        disconnect();
	    };

	    var logout = function logout() {
	        req("UserAccessServices.userLogout", function (result) {
	            logoutCleanup(result);
	        }, function (fault) {
	            logoutCleanup(fault);
	        }, "Client");
	    };

	    var ssoLoggingOut = false;

	    var ssoLogout = function ssoLogout(logoutType) {
	        if (ssoLoggingOut) {
	            console.log("Ignoring request, client not authenticated");
	            return;
	        } else {
	            ssoLoggingOut = true;
	            console.log("sso logout request: " + logoutType);
	            var url = conn.url + "/saml/logout";
	            var logoutTypeLC = logoutType.toLowerCase();
	            if (logoutTypeLC == "local") {
	                url = url + "?local=true";
	            }
	            window.location.href = url;
	        }
	    };

	    var isAuthenticated = function isAuthenticated() {
	        return conn.isConnected() && deltaClient != null;
	    };

	    /**
	     * Sets the client logging status for the class. If enabled, the web client
	     * will report request log data (local time and time difference for requests)
	     * @param {Boolean} clientLoggingEnabled 
	     *   Enable/Disable clientLogging 
	     */
	    var setClientLoggingEnabled = function setClientLoggingEnabled(clientLoggingEnabled) {
	        if (deltaClient) {
	            deltaClient.clientLoggingEnabled = clientLoggingEnabled;
	        }
	        if (clientLoggingEnabled) {
	            if (clientReqLogInterval == null) {
	                clientReqLogInterval = setInterval(sendClientRequestLogData, 60000);
	                console.log("Client Logging Enabled:RQ");
	            } else {
	                console.log("Client Logging Enabled:ARQ");
	            }
	        } else {
	            if (clientReqLogInterval != null) {
	                clearInterval(clientReqLogInterval);
	                clientReqLogInterval = null;
	                console.log("Client Logging Disabled:RQ");
	            } else {
	                console.log("Client Logging Disbaled:ARQ");
	            }
	        }
	    };

	    /**
	     * Sends Request log data (local time and time difference for requests)
	     */
	    var sendClientRequestLogData = function sendClientRequestLogData() {
	        if (!conn.isConnected()) {
	            console.log("Logging Client Request cancelled, not authenticated");
	            return;
	        }
	        var clientTokenVal = clientToken.getRequestToken();

	        var now = new Date();
	        var requestInfo = {
	            tn: now.getTime(), // Date time (long) of THIS request
	            td: clientToken.timeDifference, // Generic Time difference
	            to: clientToken.REQUEST_TIMEOUT_MS, // Generic TIMEOUT value
	            rt: clientTokenVal // THIS request token value
	        };

	        var r = (0, _connection.request)("ClientLoggerAPI.log", function (data) {
	            console.log("Client Status Send successfully");
	        }, function (data) {
	            console.log("Client Status Send failed: " + data.toString());
	        }, [deltaClient.id + ":" + username, now.toUTCString(), "RequestInfo", "", JSON.stringify(requestInfo)], deltaClient);
	        if (deltaClient) {
	            deltaClient.requestId = r.uid;
	            deltaClient.requestToken = clientTokenVal;
	        };
	        // Log it to console
	        console.log(now.toUTCString() + "[uid:" + deltaClient.id + ":" + username + "][now:" + now.getTime() + "][td:" + requestInfo.td + "][to:" + requestInfo.to + "][rt:" + requestInfo.rt + "]");
	        // Send it to server
	        conn.send(r);
	    };

	    conn.connected.subscribe(function (connected) {
	        console.log("connected:", connected, conn.url);
	        if (connected.connected) {
	            connectAttempt = 0;
	            status.next({
	                type: Client.status.CONNECTED
	            });
	        } else {
	            // If deltaClient doesn't exist or ws is reporting a POLICY_VIOLATION (1008), do not try to reconnect
	            if (deltaClient && connected.eCode != 1008) {
	                status.next({
	                    type: Client.status.CONNECTING
	                });
	                connectAttempt++;
	                setTimeout(function () {
	                    initConnection();
	                }, Math.min(30, Math.pow(2, connectAttempt)) * 1000);
	            } else {
	                console.log("Setting Logged out: " + connected.eCode);
	                status.next({
	                    type: Client.status.LOGGED_OUT
	                });
	            }
	        }
	    });

	    conn.logoff.subscribe(function (logoff) {
	        if (logoff.loggedoff) {
	            logoutCleanup(logoff.reason);
	            conn.logoff.next({ loggedoff: false, reason: "" });
	        } else {
	            // Do nothing, reset of logoff
	        }
	    });

	    conn.clientLogging.subscribe(function (clientLogging) {
	        if (deltaClient !== null && deltaClient.id === clientLogging.clientid) {
	            setClientLoggingEnabled(clientLogging.enabled);
	        }
	    });

	    return {
	        user: function user() {
	            return username;
	        },
	        systemConfig: function systemConfig() {
	            return systemConfiguration;
	        },
	        clientId: function clientId() {
	            return deltaClient == null ? "" : deltaClient.id;
	        },
	        tokenKey: function tokenKey() {
	            return deltaClient == null ? "" : deltaClient.tokenKey;
	        },
	        clientLoggingEnabled: function clientLoggingEnabled() {
	            return deltaClient == null ? "" : deltaClient.clientLoggingEnabled;
	        },
	        login: login,
	        loginWithTokenKey: loginWithTokenKey,
	        register: register,
	        request: req,
	        appMsgRequest: reqWithAppMsg,
	        post: post,
	        status: status,
	        isAuthenticated: isAuthenticated,
	        connection: conn,
	        logout: logout,
	        ssoLogout: ssoLogout,
	        resetPassword: function resetPassword(user, old, pass) {
	            post("UserAccessServices.changePassword", function (result) {
	                console.log("Change Password success?" + result);
	                status.next({
	                    type: Client.status.RESET_SUCCESS,
	                    data: result
	                });
	            }, function (fault) {
	                status.next({
	                    type: Client.status.RESET_FAIL,
	                    data: fault
	                });
	            }, _remoting.PasswordResetEntity.create(user, old, pass, conn.id()));
	        },
	        base64DeltaClient: function base64DeltaClient() {
	            if (deltaClient) {
	                deltaClient.requestToken = clientToken.getRequestToken();
	            }
	            return (0, _endec.encodeBase64)(deltaClient);
	        }
	    };
	};
	// TODO BMA - May not need encode this in here. Depends on is I implement a common post in connection.js


	Client.status = {
	    LOGGED_OUT: 0,
	    CONNECTING: 1,
	    LOGGED_IN: 2,
	    CONNECTED: 3,
	    EXPIRED: 5,
	    RESET: 6,
	    RESET_FAIL: 7,
	    FAULT: 8,
	    RESET_SUCCESS: 9
	};

	exports.Client = Client;


	var getNowTime = function getNowTime() {
	    var d = new Date();
	    var hr = d.getHours();
	    var min = d.getMinutes();
	    var sec = d.getSeconds();
	    if (min < 10) {
	        min = "0" + min;
	    }
	    if (sec < 10) {
	        sec = "0" + sec;
	    }
	    return hr + ":" + min + "." + sec;
	};

	var parseUserPass = function parseUserPass(up) {
	    var upArray = new Array();
	    upArray[0] = "";
	    upArray[1] = "";
	    if (up === null || up.length === 0) {
	        return upArray;
	    }
	    var splitIndex = up.indexOf(":");
	    upArray[0] = up.substring(0, splitIndex);
	    upArray[1] = up.substring(splitIndex + 1);
	    return upArray;
	};

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.OOBUpdate = exports.KXBinaryMsg = exports.DashPermissionEntity = exports.TickSubscriptionEntity = exports.ConnectionGroupEntity = exports.ConnectionEntity = exports.PasswordResetEntity = exports.RegisterAccessEntity = exports.TokenIdAccessEntity = exports.UserAccessEntity = exports.DeltaClient = exports.FDRemoteCall = exports.LogoutMessage = exports.AnalystPubMessage = exports.StatusMessage = exports.UpdateMessage = exports.NackMessage = exports.AckMessage = exports.Message = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _security = __webpack_require__(2);

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Message = function Message() {
	    _classCallCheck(this, Message);

	    this.clientId = "";
	    this.subId = "";
	    this.queryId = "";
	    this.node = "";
	};

	var AckMessage = function (_Message) {
	    _inherits(AckMessage, _Message);

	    function AckMessage() {
	        _classCallCheck(this, AckMessage);

	        var _this = _possibleConstructorReturn(this, (AckMessage.__proto__ || Object.getPrototypeOf(AckMessage)).call(this));

	        _this.add = null;
	        return _this;
	    }

	    return AckMessage;
	}(Message);

	var NackMessage = function (_Message2) {
	    _inherits(NackMessage, _Message2);

	    function NackMessage() {
	        _classCallCheck(this, NackMessage);

	        var _this2 = _possibleConstructorReturn(this, (NackMessage.__proto__ || Object.getPrototypeOf(NackMessage)).call(this));

	        _this2.reason = "";
	        _this2.add = null;
	        return _this2;
	    }

	    return NackMessage;
	}(Message);

	var UpdateMessage = function (_Message3) {
	    _inherits(UpdateMessage, _Message3);

	    function UpdateMessage() {
	        _classCallCheck(this, UpdateMessage);

	        var _this3 = _possibleConstructorReturn(this, (UpdateMessage.__proto__ || Object.getPrototypeOf(UpdateMessage)).call(this));

	        _this3.dataSet = null;
	        return _this3;
	    }

	    return UpdateMessage;
	}(Message);

	var StatusMessage = function (_Message4) {
	    _inherits(StatusMessage, _Message4);

	    function StatusMessage() {
	        _classCallCheck(this, StatusMessage);

	        var _this4 = _possibleConstructorReturn(this, (StatusMessage.__proto__ || Object.getPrototypeOf(StatusMessage)).call(this));

	        _this4.active = null;
	        return _this4;
	    }

	    return StatusMessage;
	}(Message);

	var AnalystPubMessage = function (_Message5) {
	    _inherits(AnalystPubMessage, _Message5);

	    function AnalystPubMessage() {
	        _classCallCheck(this, AnalystPubMessage);

	        var _this5 = _possibleConstructorReturn(this, (AnalystPubMessage.__proto__ || Object.getPrototypeOf(AnalystPubMessage)).call(this));

	        _this5.msgData = null;
	        return _this5;
	    }

	    return AnalystPubMessage;
	}(Message);

	var LogoutMessage = function (_Message6) {
	    _inherits(LogoutMessage, _Message6);

	    function LogoutMessage() {
	        _classCallCheck(this, LogoutMessage);

	        var _this6 = _possibleConstructorReturn(this, (LogoutMessage.__proto__ || Object.getPrototypeOf(LogoutMessage)).call(this));

	        _this6.reason = null;
	        return _this6;
	    }

	    return LogoutMessage;
	}(Message);

	var FDRemoteCall = function FDRemoteCall() {
	    _classCallCheck(this, FDRemoteCall);

	    this.id = null;
	    this.method = null;
	    this.parameters = null;
	};

	var DeltaClient = function DeltaClient() {
	    _classCallCheck(this, DeltaClient);

	    this.id = null;
	    this.tokenKey = null;
	    this.requestToken = [];
	    this.requestId = -1;
	    this.clientLoggingEnabled = false;
	};

	var AccessEntity = function AccessEntity(clientType, traits) {
	    _classCallCheck(this, AccessEntity);

	    this.browserTime = new Date();
	    this.forceLogin = false;
	    this.url = document.URL;
	    this.clientTZMinOffset = this.browserTime.getTimezoneOffset();
	    this.clientType = clientType;
	    this.traits = traits;
	};

	var UserAccessEntity = function (_AccessEntity) {
	    _inherits(UserAccessEntity, _AccessEntity);

	    function UserAccessEntity(clientType, traits) {
	        _classCallCheck(this, UserAccessEntity);

	        return _possibleConstructorReturn(this, (UserAccessEntity.__proto__ || Object.getPrototypeOf(UserAccessEntity)).call(this, clientType, traits));
	    }

	    _createClass(UserAccessEntity, null, [{
	        key: "create",
	        value: function create(user, pass, clientType, traits) {
	            var inst = new UserAccessEntity(clientType, traits);
	            inst.encrypteduserpass = (0, _security.encryptUserPass)(user, pass);
	            return inst;
	        }
	    }]);

	    return UserAccessEntity;
	}(AccessEntity);

	var TokenIdAccessEntity = function (_AccessEntity2) {
	    _inherits(TokenIdAccessEntity, _AccessEntity2);

	    function TokenIdAccessEntity(clientType, traits) {
	        _classCallCheck(this, TokenIdAccessEntity);

	        return _possibleConstructorReturn(this, (TokenIdAccessEntity.__proto__ || Object.getPrototypeOf(TokenIdAccessEntity)).call(this, clientType, traits));
	    }

	    _createClass(TokenIdAccessEntity, null, [{
	        key: "create",
	        value: function create(tokenId, clientType, traits) {
	            var inst = new TokenIdAccessEntity(clientType, traits);
	            inst.tokenId = tokenId;
	            return inst;
	        }
	    }]);

	    return TokenIdAccessEntity;
	}(AccessEntity);

	var RegisterAccessEntity = function (_AccessEntity3) {
	    _inherits(RegisterAccessEntity, _AccessEntity3);

	    function RegisterAccessEntity(clientType, traits) {
	        _classCallCheck(this, RegisterAccessEntity);

	        return _possibleConstructorReturn(this, (RegisterAccessEntity.__proto__ || Object.getPrototypeOf(RegisterAccessEntity)).call(this, clientType, traits));
	    }

	    _createClass(RegisterAccessEntity, null, [{
	        key: "create",
	        value: function create(clientType, traits) {
	            var inst = new RegisterAccessEntity(clientType, traits);
	            return inst;
	        }
	    }]);

	    return RegisterAccessEntity;
	}(AccessEntity);

	var PasswordResetEntity = function () {
	    function PasswordResetEntity() {
	        _classCallCheck(this, PasswordResetEntity);
	    }

	    _createClass(PasswordResetEntity, null, [{
	        key: "create",
	        value: function create(user, old, pass, id) {
	            var inst = new PasswordResetEntity();
	            inst.oldusernamepassword = (0, _security.encryptUserPass)(user, old);
	            inst.newusernamepassword = (0, _security.encryptUserPass)(user, pass);
	            inst.connectionId = id;
	            return inst;
	        }
	    }]);

	    return PasswordResetEntity;
	}();

	var ConnectionEntity = function ConnectionEntity() {
	    _classCallCheck(this, ConnectionEntity);

	    this.name = null;
	    this.originalName = null;
	    this.host = null;
	    this.port = null;
	    this.user = null;
	    this.password = null;
	    this.type = null;
	    this.driver = null;
	};

	var ConnectionGroupEntity = function ConnectionGroupEntity() {
	    _classCallCheck(this, ConnectionGroupEntity);

	    this.name = "";
	    this.connections = [];
	    this.connectionsType = [];
	    this.type = "DEFAULT";
	};

	var TickSubscriptionEntity = function TickSubscriptionEntity() {
	    _classCallCheck(this, TickSubscriptionEntity);

	    this.table = null;
	    this.syms = [];
	    this.columns = [];
	    this.keyColumns = [];
	    this.filters = [];
	};

	var DashPermissionEntity = function DashPermissionEntity() {
	    _classCallCheck(this, DashPermissionEntity);

	    this.accessLevel = null;
	    this.entity = null;
	    this.entityClass = null;
	    this.inheritedFrom = null;
	    this.permissionEntity = null;
	    this.permissionType = null;
	};

	var KXBinaryMsg = function KXBinaryMsg() {
	    _classCallCheck(this, KXBinaryMsg);

	    this.apiMessage = null;
	    this.applicationMessage = null;
	};

	var OOBUpdate = function (_Message7) {
	    _inherits(OOBUpdate, _Message7);

	    function OOBUpdate() {
	        _classCallCheck(this, OOBUpdate);

	        var _this10 = _possibleConstructorReturn(this, (OOBUpdate.__proto__ || Object.getPrototypeOf(OOBUpdate)).call(this));

	        _this10.type = "";
	        _this10.data = null;
	        return _this10;
	    }

	    return OOBUpdate;
	}(Message);

	exports.Message = Message;
	exports.AckMessage = AckMessage;
	exports.NackMessage = NackMessage;
	exports.UpdateMessage = UpdateMessage;
	exports.StatusMessage = StatusMessage;
	exports.AnalystPubMessage = AnalystPubMessage;
	exports.LogoutMessage = LogoutMessage;
	exports.FDRemoteCall = FDRemoteCall;
	exports.DeltaClient = DeltaClient;
	exports.UserAccessEntity = UserAccessEntity;
	exports.TokenIdAccessEntity = TokenIdAccessEntity;
	exports.RegisterAccessEntity = RegisterAccessEntity;
	exports.PasswordResetEntity = PasswordResetEntity;
	exports.ConnectionEntity = ConnectionEntity;
	exports.ConnectionGroupEntity = ConnectionGroupEntity;
	exports.TickSubscriptionEntity = TickSubscriptionEntity;
	exports.DashPermissionEntity = DashPermissionEntity;
	exports.KXBinaryMsg = KXBinaryMsg;
	exports.OOBUpdate = OOBUpdate;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.toBase64 = exports.decryptUserPass = exports.encryptUserPass = exports.ClientToken = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _encBase = __webpack_require__(3);

	var _encBase2 = _interopRequireDefault(_encBase);

	var _encUtf = __webpack_require__(5);

	var _encUtf2 = _interopRequireDefault(_encUtf);

	var _encHex = __webpack_require__(6);

	var _encHex2 = _interopRequireDefault(_encHex);

	var _aes = __webpack_require__(7);

	var _aes2 = _interopRequireDefault(_aes);

	var _padZeropadding = __webpack_require__(13);

	var _padZeropadding2 = _interopRequireDefault(_padZeropadding);

	var _modeEcb = __webpack_require__(14);

	var _modeEcb2 = _interopRequireDefault(_modeEcb);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var hexify = function hexify(str) {
	    return str.split("").map(function (c) {
	        return c.charCodeAt(0).toString(16);
	    }).join("");
	};

	var encryptUserPass = function encryptUserPass(user, pass) {
	    var key = _encBase2.default.parse("aXRzYXRlbXBvcmFyeWtleQ=="),
	        encrypted = _aes2.default.encrypt(user + ":" + pass, key, {
	        mode: _modeEcb2.default,
	        padding: _padZeropadding2.default
	    }),
	        text = encrypted.ciphertext.toString(),
	        bytes = [];
	    for (var i = 0; i < text.length; i += 2) {
	        var b = text.charAt(i) + text.charAt(i + 1);
	        bytes.push(parseInt(b, 16));
	    }
	    return bytes;
	};

	var decryptUserPass = function decryptUserPass(pwArray) {
	    var key = _encBase2.default.parse("aXRzYXRlbXBvcmFyeWtleQ==");
	    var up = _aes2.default.decrypt(pwArray, key, {
	        mode: _modeEcb2.default,
	        padding: _padZeropadding2.default
	    });
	    return _encUtf2.default.stringify(up).toString();
	};

	var toBase64 = function toBase64(x) {
	    return _encBase2.default.stringify(_encUtf2.default.parse(x));
	};

	var ClientToken = function () {
	    function ClientToken() {
	        _classCallCheck(this, ClientToken);

	        this.pKey = "";
	        this.REQUEST_TIMEOUT_MS = 30000;
	        this.cipher = null;
	        this.timeDifference = 0;
	    }

	    _createClass(ClientToken, [{
	        key: "initKey",
	        value: function initKey(pw) {
	            var pwLimitedStr = pw.substring(0, Math.min(16, pw.length));
	            this.pKey = hexify(pwLimitedStr);
	            while (this.pKey.length < 32) {
	                this.pKey += "0";
	            }
	        }
	    }, {
	        key: "init",
	        value: function init(tkn, stime) {
	            this.timeDifference = Date.now() - stime;
	            this.cipher = _aes2.default.decrypt(tkn, _encHex2.default.parse(this.pKey), {
	                mode: _modeEcb2.default,
	                padding: _padZeropadding2.default
	            });
	        }
	    }, {
	        key: "getRequestToken",
	        value: function getRequestToken() {
	            var timeToLive = Date.now() - this.timeDifference + this.REQUEST_TIMEOUT_MS;
	            var encrypted = _aes2.default.encrypt("ok" + timeToLive, this.cipher, {
	                mode: _modeEcb2.default,
	                padding: _padZeropadding2.default
	            });
	            var text = encrypted.ciphertext.toString(),
	                bytes = [];
	            for (var i = 0; i < text.length; i += 2) {
	                bytes.push(parseInt(text.charAt(i) + text.charAt(i + 1), 16));
	            }
	            return bytes;
	        }
	    }, {
	        key: "reset",
	        value: function reset() {
	            this.pKey = "";
	            this.cipher = null;
	        }
	    }]);

	    return ClientToken;
	}();

	exports.ClientToken = ClientToken;
	exports.encryptUserPass = encryptUserPass;
	exports.decryptUserPass = decryptUserPass;
	exports.toBase64 = toBase64;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;"use strict";

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	;(function (root, factory) {
		if (( false ? "undefined" : _typeof(exports)) === "object") {
			// CommonJS
			module.exports = exports = factory(__webpack_require__(4));
		} else if (true) {
			// AMD
			!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(4)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		} else {
			// Global (browser)
			factory(root.CryptoJS);
		}
	})(undefined, function (CryptoJS) {

		(function () {
			// Shortcuts
			var C = CryptoJS;
			var C_lib = C.lib;
			var WordArray = C_lib.WordArray;
			var C_enc = C.enc;

			/**
	   * Base64 encoding strategy.
	   */
			var Base64 = C_enc.Base64 = {
				/**
	    * Converts a word array to a Base64 string.
	    *
	    * @param {WordArray} wordArray The word array.
	    *
	    * @return {string} The Base64 string.
	    *
	    * @static
	    *
	    * @example
	    *
	    *     var base64String = CryptoJS.enc.Base64.stringify(wordArray);
	    */
				stringify: function stringify(wordArray) {
					// Shortcuts
					var words = wordArray.words;
					var sigBytes = wordArray.sigBytes;
					var map = this._map;

					// Clamp excess bits
					wordArray.clamp();

					// Convert
					var base64Chars = [];
					for (var i = 0; i < sigBytes; i += 3) {
						var byte1 = words[i >>> 2] >>> 24 - i % 4 * 8 & 0xff;
						var byte2 = words[i + 1 >>> 2] >>> 24 - (i + 1) % 4 * 8 & 0xff;
						var byte3 = words[i + 2 >>> 2] >>> 24 - (i + 2) % 4 * 8 & 0xff;

						var triplet = byte1 << 16 | byte2 << 8 | byte3;

						for (var j = 0; j < 4 && i + j * 0.75 < sigBytes; j++) {
							base64Chars.push(map.charAt(triplet >>> 6 * (3 - j) & 0x3f));
						}
					}

					// Add padding
					var paddingChar = map.charAt(64);
					if (paddingChar) {
						while (base64Chars.length % 4) {
							base64Chars.push(paddingChar);
						}
					}

					return base64Chars.join('');
				},

				/**
	    * Converts a Base64 string to a word array.
	    *
	    * @param {string} base64Str The Base64 string.
	    *
	    * @return {WordArray} The word array.
	    *
	    * @static
	    *
	    * @example
	    *
	    *     var wordArray = CryptoJS.enc.Base64.parse(base64String);
	    */
				parse: function parse(base64Str) {
					// Shortcuts
					var base64StrLength = base64Str.length;
					var map = this._map;

					// Ignore padding
					var paddingChar = map.charAt(64);
					if (paddingChar) {
						var paddingIndex = base64Str.indexOf(paddingChar);
						if (paddingIndex != -1) {
							base64StrLength = paddingIndex;
						}
					}

					// Convert
					var words = [];
					var nBytes = 0;
					for (var i = 0; i < base64StrLength; i++) {
						if (i % 4) {
							var bits1 = map.indexOf(base64Str.charAt(i - 1)) << i % 4 * 2;
							var bits2 = map.indexOf(base64Str.charAt(i)) >>> 6 - i % 4 * 2;
							words[nBytes >>> 2] |= (bits1 | bits2) << 24 - nBytes % 4 * 8;
							nBytes++;
						}
					}

					return WordArray.create(words, nBytes);
				},

				_map: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
			};
		})();

		return CryptoJS.enc.Base64;
	});

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;"use strict";

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	;(function (root, factory) {
		if (( false ? "undefined" : _typeof(exports)) === "object") {
			// CommonJS
			module.exports = exports = factory();
		} else if (true) {
			// AMD
			!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		} else {
			// Global (browser)
			root.CryptoJS = factory();
		}
	})(undefined, function () {

		/**
	  * CryptoJS core components.
	  */
		var CryptoJS = CryptoJS || function (Math, undefined) {
			/**
	   * CryptoJS namespace.
	   */
			var C = {};

			/**
	   * Library namespace.
	   */
			var C_lib = C.lib = {};

			/**
	   * Base object for prototypal inheritance.
	   */
			var Base = C_lib.Base = function () {
				function F() {}

				return {
					/**
	     * Creates a new object that inherits from this object.
	     *
	     * @param {Object} overrides Properties to copy into the new object.
	     *
	     * @return {Object} The new object.
	     *
	     * @static
	     *
	     * @example
	     *
	     *     var MyType = CryptoJS.lib.Base.extend({
	     *         field: 'value',
	     *
	     *         method: function () {
	     *         }
	     *     });
	     */
					extend: function extend(overrides) {
						// Spawn
						F.prototype = this;
						var subtype = new F();

						// Augment
						if (overrides) {
							subtype.mixIn(overrides);
						}

						// Create default initializer
						if (!subtype.hasOwnProperty('init')) {
							subtype.init = function () {
								subtype.$super.init.apply(this, arguments);
							};
						}

						// Initializer's prototype is the subtype object
						subtype.init.prototype = subtype;

						// Reference supertype
						subtype.$super = this;

						return subtype;
					},

					/**
	     * Extends this object and runs the init method.
	     * Arguments to create() will be passed to init().
	     *
	     * @return {Object} The new object.
	     *
	     * @static
	     *
	     * @example
	     *
	     *     var instance = MyType.create();
	     */
					create: function create() {
						var instance = this.extend();
						instance.init.apply(instance, arguments);

						return instance;
					},

					/**
	     * Initializes a newly created object.
	     * Override this method to add some logic when your objects are created.
	     *
	     * @example
	     *
	     *     var MyType = CryptoJS.lib.Base.extend({
	     *         init: function () {
	     *             // ...
	     *         }
	     *     });
	     */
					init: function init() {},

					/**
	     * Copies properties into this object.
	     *
	     * @param {Object} properties The properties to mix in.
	     *
	     * @example
	     *
	     *     MyType.mixIn({
	     *         field: 'value'
	     *     });
	     */
					mixIn: function mixIn(properties) {
						for (var propertyName in properties) {
							if (properties.hasOwnProperty(propertyName)) {
								this[propertyName] = properties[propertyName];
							}
						}

						// IE won't copy toString using the loop above
						if (properties.hasOwnProperty('toString')) {
							this.toString = properties.toString;
						}
					},

					/**
	     * Creates a copy of this object.
	     *
	     * @return {Object} The clone.
	     *
	     * @example
	     *
	     *     var clone = instance.clone();
	     */
					clone: function clone() {
						return this.init.prototype.extend(this);
					}
				};
			}();

			/**
	   * An array of 32-bit words.
	   *
	   * @property {Array} words The array of 32-bit words.
	   * @property {number} sigBytes The number of significant bytes in this word array.
	   */
			var WordArray = C_lib.WordArray = Base.extend({
				/**
	    * Initializes a newly created word array.
	    *
	    * @param {Array} words (Optional) An array of 32-bit words.
	    * @param {number} sigBytes (Optional) The number of significant bytes in the words.
	    *
	    * @example
	    *
	    *     var wordArray = CryptoJS.lib.WordArray.create();
	    *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607]);
	    *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607], 6);
	    */
				init: function init(words, sigBytes) {
					words = this.words = words || [];

					if (sigBytes != undefined) {
						this.sigBytes = sigBytes;
					} else {
						this.sigBytes = words.length * 4;
					}
				},

				/**
	    * Converts this word array to a string.
	    *
	    * @param {Encoder} encoder (Optional) The encoding strategy to use. Default: CryptoJS.enc.Hex
	    *
	    * @return {string} The stringified word array.
	    *
	    * @example
	    *
	    *     var string = wordArray + '';
	    *     var string = wordArray.toString();
	    *     var string = wordArray.toString(CryptoJS.enc.Utf8);
	    */
				toString: function toString(encoder) {
					return (encoder || Hex).stringify(this);
				},

				/**
	    * Concatenates a word array to this word array.
	    *
	    * @param {WordArray} wordArray The word array to append.
	    *
	    * @return {WordArray} This word array.
	    *
	    * @example
	    *
	    *     wordArray1.concat(wordArray2);
	    */
				concat: function concat(wordArray) {
					// Shortcuts
					var thisWords = this.words;
					var thatWords = wordArray.words;
					var thisSigBytes = this.sigBytes;
					var thatSigBytes = wordArray.sigBytes;

					// Clamp excess bits
					this.clamp();

					// Concat
					if (thisSigBytes % 4) {
						// Copy one byte at a time
						for (var i = 0; i < thatSigBytes; i++) {
							var thatByte = thatWords[i >>> 2] >>> 24 - i % 4 * 8 & 0xff;
							thisWords[thisSigBytes + i >>> 2] |= thatByte << 24 - (thisSigBytes + i) % 4 * 8;
						}
					} else {
						// Copy one word at a time
						for (var i = 0; i < thatSigBytes; i += 4) {
							thisWords[thisSigBytes + i >>> 2] = thatWords[i >>> 2];
						}
					}
					this.sigBytes += thatSigBytes;

					// Chainable
					return this;
				},

				/**
	    * Removes insignificant bits.
	    *
	    * @example
	    *
	    *     wordArray.clamp();
	    */
				clamp: function clamp() {
					// Shortcuts
					var words = this.words;
					var sigBytes = this.sigBytes;

					// Clamp
					words[sigBytes >>> 2] &= 0xffffffff << 32 - sigBytes % 4 * 8;
					words.length = Math.ceil(sigBytes / 4);
				},

				/**
	    * Creates a copy of this word array.
	    *
	    * @return {WordArray} The clone.
	    *
	    * @example
	    *
	    *     var clone = wordArray.clone();
	    */
				clone: function clone() {
					var clone = Base.clone.call(this);
					clone.words = this.words.slice(0);

					return clone;
				},

				/**
	    * Creates a word array filled with random bytes.
	    *
	    * @param {number} nBytes The number of random bytes to generate.
	    *
	    * @return {WordArray} The random word array.
	    *
	    * @static
	    *
	    * @example
	    *
	    *     var wordArray = CryptoJS.lib.WordArray.random(16);
	    */
				random: function random(nBytes) {
					var words = [];

					var r = function r(m_w) {
						var m_w = m_w;
						var m_z = 0x3ade68b1;
						var mask = 0xffffffff;

						return function () {
							m_z = 0x9069 * (m_z & 0xFFFF) + (m_z >> 0x10) & mask;
							m_w = 0x4650 * (m_w & 0xFFFF) + (m_w >> 0x10) & mask;
							var result = (m_z << 0x10) + m_w & mask;
							result /= 0x100000000;
							result += 0.5;
							return result * (Math.random() > .5 ? 1 : -1);
						};
					};

					for (var i = 0, rcache; i < nBytes; i += 4) {
						var _r = r((rcache || Math.random()) * 0x100000000);

						rcache = _r() * 0x3ade67b7;
						words.push(_r() * 0x100000000 | 0);
					}

					return new WordArray.init(words, nBytes);
				}
			});

			/**
	   * Encoder namespace.
	   */
			var C_enc = C.enc = {};

			/**
	   * Hex encoding strategy.
	   */
			var Hex = C_enc.Hex = {
				/**
	    * Converts a word array to a hex string.
	    *
	    * @param {WordArray} wordArray The word array.
	    *
	    * @return {string} The hex string.
	    *
	    * @static
	    *
	    * @example
	    *
	    *     var hexString = CryptoJS.enc.Hex.stringify(wordArray);
	    */
				stringify: function stringify(wordArray) {
					// Shortcuts
					var words = wordArray.words;
					var sigBytes = wordArray.sigBytes;

					// Convert
					var hexChars = [];
					for (var i = 0; i < sigBytes; i++) {
						var bite = words[i >>> 2] >>> 24 - i % 4 * 8 & 0xff;
						hexChars.push((bite >>> 4).toString(16));
						hexChars.push((bite & 0x0f).toString(16));
					}

					return hexChars.join('');
				},

				/**
	    * Converts a hex string to a word array.
	    *
	    * @param {string} hexStr The hex string.
	    *
	    * @return {WordArray} The word array.
	    *
	    * @static
	    *
	    * @example
	    *
	    *     var wordArray = CryptoJS.enc.Hex.parse(hexString);
	    */
				parse: function parse(hexStr) {
					// Shortcut
					var hexStrLength = hexStr.length;

					// Convert
					var words = [];
					for (var i = 0; i < hexStrLength; i += 2) {
						words[i >>> 3] |= parseInt(hexStr.substr(i, 2), 16) << 24 - i % 8 * 4;
					}

					return new WordArray.init(words, hexStrLength / 2);
				}
			};

			/**
	   * Latin1 encoding strategy.
	   */
			var Latin1 = C_enc.Latin1 = {
				/**
	    * Converts a word array to a Latin1 string.
	    *
	    * @param {WordArray} wordArray The word array.
	    *
	    * @return {string} The Latin1 string.
	    *
	    * @static
	    *
	    * @example
	    *
	    *     var latin1String = CryptoJS.enc.Latin1.stringify(wordArray);
	    */
				stringify: function stringify(wordArray) {
					// Shortcuts
					var words = wordArray.words;
					var sigBytes = wordArray.sigBytes;

					// Convert
					var latin1Chars = [];
					for (var i = 0; i < sigBytes; i++) {
						var bite = words[i >>> 2] >>> 24 - i % 4 * 8 & 0xff;
						latin1Chars.push(String.fromCharCode(bite));
					}

					return latin1Chars.join('');
				},

				/**
	    * Converts a Latin1 string to a word array.
	    *
	    * @param {string} latin1Str The Latin1 string.
	    *
	    * @return {WordArray} The word array.
	    *
	    * @static
	    *
	    * @example
	    *
	    *     var wordArray = CryptoJS.enc.Latin1.parse(latin1String);
	    */
				parse: function parse(latin1Str) {
					// Shortcut
					var latin1StrLength = latin1Str.length;

					// Convert
					var words = [];
					for (var i = 0; i < latin1StrLength; i++) {
						words[i >>> 2] |= (latin1Str.charCodeAt(i) & 0xff) << 24 - i % 4 * 8;
					}

					return new WordArray.init(words, latin1StrLength);
				}
			};

			/**
	   * UTF-8 encoding strategy.
	   */
			var Utf8 = C_enc.Utf8 = {
				/**
	    * Converts a word array to a UTF-8 string.
	    *
	    * @param {WordArray} wordArray The word array.
	    *
	    * @return {string} The UTF-8 string.
	    *
	    * @static
	    *
	    * @example
	    *
	    *     var utf8String = CryptoJS.enc.Utf8.stringify(wordArray);
	    */
				stringify: function stringify(wordArray) {
					try {
						return decodeURIComponent(escape(Latin1.stringify(wordArray)));
					} catch (e) {
						throw new Error('Malformed UTF-8 data');
					}
				},

				/**
	    * Converts a UTF-8 string to a word array.
	    *
	    * @param {string} utf8Str The UTF-8 string.
	    *
	    * @return {WordArray} The word array.
	    *
	    * @static
	    *
	    * @example
	    *
	    *     var wordArray = CryptoJS.enc.Utf8.parse(utf8String);
	    */
				parse: function parse(utf8Str) {
					return Latin1.parse(unescape(encodeURIComponent(utf8Str)));
				}
			};

			/**
	   * Abstract buffered block algorithm template.
	   *
	   * The property blockSize must be implemented in a concrete subtype.
	   *
	   * @property {number} _minBufferSize The number of blocks that should be kept unprocessed in the buffer. Default: 0
	   */
			var BufferedBlockAlgorithm = C_lib.BufferedBlockAlgorithm = Base.extend({
				/**
	    * Resets this block algorithm's data buffer to its initial state.
	    *
	    * @example
	    *
	    *     bufferedBlockAlgorithm.reset();
	    */
				reset: function reset() {
					// Initial values
					this._data = new WordArray.init();
					this._nDataBytes = 0;
				},

				/**
	    * Adds new data to this block algorithm's buffer.
	    *
	    * @param {WordArray|string} data The data to append. Strings are converted to a WordArray using UTF-8.
	    *
	    * @example
	    *
	    *     bufferedBlockAlgorithm._append('data');
	    *     bufferedBlockAlgorithm._append(wordArray);
	    */
				_append: function _append(data) {
					// Convert string to WordArray, else assume WordArray already
					if (typeof data == 'string') {
						data = Utf8.parse(data);
					}

					// Append
					this._data.concat(data);
					this._nDataBytes += data.sigBytes;
				},

				/**
	    * Processes available data blocks.
	    *
	    * This method invokes _doProcessBlock(offset), which must be implemented by a concrete subtype.
	    *
	    * @param {boolean} doFlush Whether all blocks and partial blocks should be processed.
	    *
	    * @return {WordArray} The processed data.
	    *
	    * @example
	    *
	    *     var processedData = bufferedBlockAlgorithm._process();
	    *     var processedData = bufferedBlockAlgorithm._process(!!'flush');
	    */
				_process: function _process(doFlush) {
					// Shortcuts
					var data = this._data;
					var dataWords = data.words;
					var dataSigBytes = data.sigBytes;
					var blockSize = this.blockSize;
					var blockSizeBytes = blockSize * 4;

					// Count blocks ready
					var nBlocksReady = dataSigBytes / blockSizeBytes;
					if (doFlush) {
						// Round up to include partial blocks
						nBlocksReady = Math.ceil(nBlocksReady);
					} else {
						// Round down to include only full blocks,
						// less the number of blocks that must remain in the buffer
						nBlocksReady = Math.max((nBlocksReady | 0) - this._minBufferSize, 0);
					}

					// Count words ready
					var nWordsReady = nBlocksReady * blockSize;

					// Count bytes ready
					var nBytesReady = Math.min(nWordsReady * 4, dataSigBytes);

					// Process blocks
					if (nWordsReady) {
						for (var offset = 0; offset < nWordsReady; offset += blockSize) {
							// Perform concrete-algorithm logic
							this._doProcessBlock(dataWords, offset);
						}

						// Remove processed words
						var processedWords = dataWords.splice(0, nWordsReady);
						data.sigBytes -= nBytesReady;
					}

					// Return processed words
					return new WordArray.init(processedWords, nBytesReady);
				},

				/**
	    * Creates a copy of this object.
	    *
	    * @return {Object} The clone.
	    *
	    * @example
	    *
	    *     var clone = bufferedBlockAlgorithm.clone();
	    */
				clone: function clone() {
					var clone = Base.clone.call(this);
					clone._data = this._data.clone();

					return clone;
				},

				_minBufferSize: 0
			});

			/**
	   * Abstract hasher template.
	   *
	   * @property {number} blockSize The number of 32-bit words this hasher operates on. Default: 16 (512 bits)
	   */
			var Hasher = C_lib.Hasher = BufferedBlockAlgorithm.extend({
				/**
	    * Configuration options.
	    */
				cfg: Base.extend(),

				/**
	    * Initializes a newly created hasher.
	    *
	    * @param {Object} cfg (Optional) The configuration options to use for this hash computation.
	    *
	    * @example
	    *
	    *     var hasher = CryptoJS.algo.SHA256.create();
	    */
				init: function init(cfg) {
					// Apply config defaults
					this.cfg = this.cfg.extend(cfg);

					// Set initial values
					this.reset();
				},

				/**
	    * Resets this hasher to its initial state.
	    *
	    * @example
	    *
	    *     hasher.reset();
	    */
				reset: function reset() {
					// Reset data buffer
					BufferedBlockAlgorithm.reset.call(this);

					// Perform concrete-hasher logic
					this._doReset();
				},

				/**
	    * Updates this hasher with a message.
	    *
	    * @param {WordArray|string} messageUpdate The message to append.
	    *
	    * @return {Hasher} This hasher.
	    *
	    * @example
	    *
	    *     hasher.update('message');
	    *     hasher.update(wordArray);
	    */
				update: function update(messageUpdate) {
					// Append
					this._append(messageUpdate);

					// Update the hash
					this._process();

					// Chainable
					return this;
				},

				/**
	    * Finalizes the hash computation.
	    * Note that the finalize operation is effectively a destructive, read-once operation.
	    *
	    * @param {WordArray|string} messageUpdate (Optional) A final message update.
	    *
	    * @return {WordArray} The hash.
	    *
	    * @example
	    *
	    *     var hash = hasher.finalize();
	    *     var hash = hasher.finalize('message');
	    *     var hash = hasher.finalize(wordArray);
	    */
				finalize: function finalize(messageUpdate) {
					// Final message update
					if (messageUpdate) {
						this._append(messageUpdate);
					}

					// Perform concrete-hasher logic
					var hash = this._doFinalize();

					return hash;
				},

				blockSize: 512 / 32,

				/**
	    * Creates a shortcut function to a hasher's object interface.
	    *
	    * @param {Hasher} hasher The hasher to create a helper for.
	    *
	    * @return {Function} The shortcut function.
	    *
	    * @static
	    *
	    * @example
	    *
	    *     var SHA256 = CryptoJS.lib.Hasher._createHelper(CryptoJS.algo.SHA256);
	    */
				_createHelper: function _createHelper(hasher) {
					return function (message, cfg) {
						return new hasher.init(cfg).finalize(message);
					};
				},

				/**
	    * Creates a shortcut function to the HMAC's object interface.
	    *
	    * @param {Hasher} hasher The hasher to use in this HMAC helper.
	    *
	    * @return {Function} The shortcut function.
	    *
	    * @static
	    *
	    * @example
	    *
	    *     var HmacSHA256 = CryptoJS.lib.Hasher._createHmacHelper(CryptoJS.algo.SHA256);
	    */
				_createHmacHelper: function _createHmacHelper(hasher) {
					return function (message, key) {
						return new C_algo.HMAC.init(hasher, key).finalize(message);
					};
				}
			});

			/**
	   * Algorithm namespace.
	   */
			var C_algo = C.algo = {};

			return C;
		}(Math);

		return CryptoJS;
	});

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;"use strict";

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	;(function (root, factory) {
		if (( false ? "undefined" : _typeof(exports)) === "object") {
			// CommonJS
			module.exports = exports = factory(__webpack_require__(4));
		} else if (true) {
			// AMD
			!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(4)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		} else {
			// Global (browser)
			factory(root.CryptoJS);
		}
	})(undefined, function (CryptoJS) {

		return CryptoJS.enc.Utf8;
	});

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;"use strict";

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	;(function (root, factory) {
		if (( false ? "undefined" : _typeof(exports)) === "object") {
			// CommonJS
			module.exports = exports = factory(__webpack_require__(4));
		} else if (true) {
			// AMD
			!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(4)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		} else {
			// Global (browser)
			factory(root.CryptoJS);
		}
	})(undefined, function (CryptoJS) {

		return CryptoJS.enc.Hex;
	});

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;"use strict";

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	;(function (root, factory, undef) {
		if (( false ? "undefined" : _typeof(exports)) === "object") {
			// CommonJS
			module.exports = exports = factory(__webpack_require__(4), __webpack_require__(3), __webpack_require__(8), __webpack_require__(9), __webpack_require__(12));
		} else if (true) {
			// AMD
			!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(4), __webpack_require__(3), __webpack_require__(8), __webpack_require__(9), __webpack_require__(12)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		} else {
			// Global (browser)
			factory(root.CryptoJS);
		}
	})(undefined, function (CryptoJS) {

		(function () {
			// Shortcuts
			var C = CryptoJS;
			var C_lib = C.lib;
			var BlockCipher = C_lib.BlockCipher;
			var C_algo = C.algo;

			// Lookup tables
			var SBOX = [];
			var INV_SBOX = [];
			var SUB_MIX_0 = [];
			var SUB_MIX_1 = [];
			var SUB_MIX_2 = [];
			var SUB_MIX_3 = [];
			var INV_SUB_MIX_0 = [];
			var INV_SUB_MIX_1 = [];
			var INV_SUB_MIX_2 = [];
			var INV_SUB_MIX_3 = [];

			// Compute lookup tables
			(function () {
				// Compute double table
				var d = [];
				for (var i = 0; i < 256; i++) {
					if (i < 128) {
						d[i] = i << 1;
					} else {
						d[i] = i << 1 ^ 0x11b;
					}
				}

				// Walk GF(2^8)
				var x = 0;
				var xi = 0;
				for (var i = 0; i < 256; i++) {
					// Compute sbox
					var sx = xi ^ xi << 1 ^ xi << 2 ^ xi << 3 ^ xi << 4;
					sx = sx >>> 8 ^ sx & 0xff ^ 0x63;
					SBOX[x] = sx;
					INV_SBOX[sx] = x;

					// Compute multiplication
					var x2 = d[x];
					var x4 = d[x2];
					var x8 = d[x4];

					// Compute sub bytes, mix columns tables
					var t = d[sx] * 0x101 ^ sx * 0x1010100;
					SUB_MIX_0[x] = t << 24 | t >>> 8;
					SUB_MIX_1[x] = t << 16 | t >>> 16;
					SUB_MIX_2[x] = t << 8 | t >>> 24;
					SUB_MIX_3[x] = t;

					// Compute inv sub bytes, inv mix columns tables
					var t = x8 * 0x1010101 ^ x4 * 0x10001 ^ x2 * 0x101 ^ x * 0x1010100;
					INV_SUB_MIX_0[sx] = t << 24 | t >>> 8;
					INV_SUB_MIX_1[sx] = t << 16 | t >>> 16;
					INV_SUB_MIX_2[sx] = t << 8 | t >>> 24;
					INV_SUB_MIX_3[sx] = t;

					// Compute next counter
					if (!x) {
						x = xi = 1;
					} else {
						x = x2 ^ d[d[d[x8 ^ x2]]];
						xi ^= d[d[xi]];
					}
				}
			})();

			// Precomputed Rcon lookup
			var RCON = [0x00, 0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36];

			/**
	   * AES block cipher algorithm.
	   */
			var AES = C_algo.AES = BlockCipher.extend({
				_doReset: function _doReset() {
					// Shortcuts
					var key = this._key;
					var keyWords = key.words;
					var keySize = key.sigBytes / 4;

					// Compute number of rounds
					var nRounds = this._nRounds = keySize + 6;

					// Compute number of key schedule rows
					var ksRows = (nRounds + 1) * 4;

					// Compute key schedule
					var keySchedule = this._keySchedule = [];
					for (var ksRow = 0; ksRow < ksRows; ksRow++) {
						if (ksRow < keySize) {
							keySchedule[ksRow] = keyWords[ksRow];
						} else {
							var t = keySchedule[ksRow - 1];

							if (!(ksRow % keySize)) {
								// Rot word
								t = t << 8 | t >>> 24;

								// Sub word
								t = SBOX[t >>> 24] << 24 | SBOX[t >>> 16 & 0xff] << 16 | SBOX[t >>> 8 & 0xff] << 8 | SBOX[t & 0xff];

								// Mix Rcon
								t ^= RCON[ksRow / keySize | 0] << 24;
							} else if (keySize > 6 && ksRow % keySize == 4) {
								// Sub word
								t = SBOX[t >>> 24] << 24 | SBOX[t >>> 16 & 0xff] << 16 | SBOX[t >>> 8 & 0xff] << 8 | SBOX[t & 0xff];
							}

							keySchedule[ksRow] = keySchedule[ksRow - keySize] ^ t;
						}
					}

					// Compute inv key schedule
					var invKeySchedule = this._invKeySchedule = [];
					for (var invKsRow = 0; invKsRow < ksRows; invKsRow++) {
						var ksRow = ksRows - invKsRow;

						if (invKsRow % 4) {
							var t = keySchedule[ksRow];
						} else {
							var t = keySchedule[ksRow - 4];
						}

						if (invKsRow < 4 || ksRow <= 4) {
							invKeySchedule[invKsRow] = t;
						} else {
							invKeySchedule[invKsRow] = INV_SUB_MIX_0[SBOX[t >>> 24]] ^ INV_SUB_MIX_1[SBOX[t >>> 16 & 0xff]] ^ INV_SUB_MIX_2[SBOX[t >>> 8 & 0xff]] ^ INV_SUB_MIX_3[SBOX[t & 0xff]];
						}
					}
				},

				encryptBlock: function encryptBlock(M, offset) {
					this._doCryptBlock(M, offset, this._keySchedule, SUB_MIX_0, SUB_MIX_1, SUB_MIX_2, SUB_MIX_3, SBOX);
				},

				decryptBlock: function decryptBlock(M, offset) {
					// Swap 2nd and 4th rows
					var t = M[offset + 1];
					M[offset + 1] = M[offset + 3];
					M[offset + 3] = t;

					this._doCryptBlock(M, offset, this._invKeySchedule, INV_SUB_MIX_0, INV_SUB_MIX_1, INV_SUB_MIX_2, INV_SUB_MIX_3, INV_SBOX);

					// Inv swap 2nd and 4th rows
					var t = M[offset + 1];
					M[offset + 1] = M[offset + 3];
					M[offset + 3] = t;
				},

				_doCryptBlock: function _doCryptBlock(M, offset, keySchedule, SUB_MIX_0, SUB_MIX_1, SUB_MIX_2, SUB_MIX_3, SBOX) {
					// Shortcut
					var nRounds = this._nRounds;

					// Get input, add round key
					var s0 = M[offset] ^ keySchedule[0];
					var s1 = M[offset + 1] ^ keySchedule[1];
					var s2 = M[offset + 2] ^ keySchedule[2];
					var s3 = M[offset + 3] ^ keySchedule[3];

					// Key schedule row counter
					var ksRow = 4;

					// Rounds
					for (var round = 1; round < nRounds; round++) {
						// Shift rows, sub bytes, mix columns, add round key
						var t0 = SUB_MIX_0[s0 >>> 24] ^ SUB_MIX_1[s1 >>> 16 & 0xff] ^ SUB_MIX_2[s2 >>> 8 & 0xff] ^ SUB_MIX_3[s3 & 0xff] ^ keySchedule[ksRow++];
						var t1 = SUB_MIX_0[s1 >>> 24] ^ SUB_MIX_1[s2 >>> 16 & 0xff] ^ SUB_MIX_2[s3 >>> 8 & 0xff] ^ SUB_MIX_3[s0 & 0xff] ^ keySchedule[ksRow++];
						var t2 = SUB_MIX_0[s2 >>> 24] ^ SUB_MIX_1[s3 >>> 16 & 0xff] ^ SUB_MIX_2[s0 >>> 8 & 0xff] ^ SUB_MIX_3[s1 & 0xff] ^ keySchedule[ksRow++];
						var t3 = SUB_MIX_0[s3 >>> 24] ^ SUB_MIX_1[s0 >>> 16 & 0xff] ^ SUB_MIX_2[s1 >>> 8 & 0xff] ^ SUB_MIX_3[s2 & 0xff] ^ keySchedule[ksRow++];

						// Update state
						s0 = t0;
						s1 = t1;
						s2 = t2;
						s3 = t3;
					}

					// Shift rows, sub bytes, add round key
					var t0 = (SBOX[s0 >>> 24] << 24 | SBOX[s1 >>> 16 & 0xff] << 16 | SBOX[s2 >>> 8 & 0xff] << 8 | SBOX[s3 & 0xff]) ^ keySchedule[ksRow++];
					var t1 = (SBOX[s1 >>> 24] << 24 | SBOX[s2 >>> 16 & 0xff] << 16 | SBOX[s3 >>> 8 & 0xff] << 8 | SBOX[s0 & 0xff]) ^ keySchedule[ksRow++];
					var t2 = (SBOX[s2 >>> 24] << 24 | SBOX[s3 >>> 16 & 0xff] << 16 | SBOX[s0 >>> 8 & 0xff] << 8 | SBOX[s1 & 0xff]) ^ keySchedule[ksRow++];
					var t3 = (SBOX[s3 >>> 24] << 24 | SBOX[s0 >>> 16 & 0xff] << 16 | SBOX[s1 >>> 8 & 0xff] << 8 | SBOX[s2 & 0xff]) ^ keySchedule[ksRow++];

					// Set output
					M[offset] = t0;
					M[offset + 1] = t1;
					M[offset + 2] = t2;
					M[offset + 3] = t3;
				},

				keySize: 256 / 32
			});

			/**
	   * Shortcut functions to the cipher's object interface.
	   *
	   * @example
	   *
	   *     var ciphertext = CryptoJS.AES.encrypt(message, key, cfg);
	   *     var plaintext  = CryptoJS.AES.decrypt(ciphertext, key, cfg);
	   */
			C.AES = BlockCipher._createHelper(AES);
		})();

		return CryptoJS.AES;
	});

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;"use strict";

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	;(function (root, factory) {
		if (( false ? "undefined" : _typeof(exports)) === "object") {
			// CommonJS
			module.exports = exports = factory(__webpack_require__(4));
		} else if (true) {
			// AMD
			!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(4)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		} else {
			// Global (browser)
			factory(root.CryptoJS);
		}
	})(undefined, function (CryptoJS) {

		(function (Math) {
			// Shortcuts
			var C = CryptoJS;
			var C_lib = C.lib;
			var WordArray = C_lib.WordArray;
			var Hasher = C_lib.Hasher;
			var C_algo = C.algo;

			// Constants table
			var T = [];

			// Compute constants
			(function () {
				for (var i = 0; i < 64; i++) {
					T[i] = Math.abs(Math.sin(i + 1)) * 0x100000000 | 0;
				}
			})();

			/**
	   * MD5 hash algorithm.
	   */
			var MD5 = C_algo.MD5 = Hasher.extend({
				_doReset: function _doReset() {
					this._hash = new WordArray.init([0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476]);
				},

				_doProcessBlock: function _doProcessBlock(M, offset) {
					// Swap endian
					for (var i = 0; i < 16; i++) {
						// Shortcuts
						var offset_i = offset + i;
						var M_offset_i = M[offset_i];

						M[offset_i] = (M_offset_i << 8 | M_offset_i >>> 24) & 0x00ff00ff | (M_offset_i << 24 | M_offset_i >>> 8) & 0xff00ff00;
					}

					// Shortcuts
					var H = this._hash.words;

					var M_offset_0 = M[offset + 0];
					var M_offset_1 = M[offset + 1];
					var M_offset_2 = M[offset + 2];
					var M_offset_3 = M[offset + 3];
					var M_offset_4 = M[offset + 4];
					var M_offset_5 = M[offset + 5];
					var M_offset_6 = M[offset + 6];
					var M_offset_7 = M[offset + 7];
					var M_offset_8 = M[offset + 8];
					var M_offset_9 = M[offset + 9];
					var M_offset_10 = M[offset + 10];
					var M_offset_11 = M[offset + 11];
					var M_offset_12 = M[offset + 12];
					var M_offset_13 = M[offset + 13];
					var M_offset_14 = M[offset + 14];
					var M_offset_15 = M[offset + 15];

					// Working varialbes
					var a = H[0];
					var b = H[1];
					var c = H[2];
					var d = H[3];

					// Computation
					a = FF(a, b, c, d, M_offset_0, 7, T[0]);
					d = FF(d, a, b, c, M_offset_1, 12, T[1]);
					c = FF(c, d, a, b, M_offset_2, 17, T[2]);
					b = FF(b, c, d, a, M_offset_3, 22, T[3]);
					a = FF(a, b, c, d, M_offset_4, 7, T[4]);
					d = FF(d, a, b, c, M_offset_5, 12, T[5]);
					c = FF(c, d, a, b, M_offset_6, 17, T[6]);
					b = FF(b, c, d, a, M_offset_7, 22, T[7]);
					a = FF(a, b, c, d, M_offset_8, 7, T[8]);
					d = FF(d, a, b, c, M_offset_9, 12, T[9]);
					c = FF(c, d, a, b, M_offset_10, 17, T[10]);
					b = FF(b, c, d, a, M_offset_11, 22, T[11]);
					a = FF(a, b, c, d, M_offset_12, 7, T[12]);
					d = FF(d, a, b, c, M_offset_13, 12, T[13]);
					c = FF(c, d, a, b, M_offset_14, 17, T[14]);
					b = FF(b, c, d, a, M_offset_15, 22, T[15]);

					a = GG(a, b, c, d, M_offset_1, 5, T[16]);
					d = GG(d, a, b, c, M_offset_6, 9, T[17]);
					c = GG(c, d, a, b, M_offset_11, 14, T[18]);
					b = GG(b, c, d, a, M_offset_0, 20, T[19]);
					a = GG(a, b, c, d, M_offset_5, 5, T[20]);
					d = GG(d, a, b, c, M_offset_10, 9, T[21]);
					c = GG(c, d, a, b, M_offset_15, 14, T[22]);
					b = GG(b, c, d, a, M_offset_4, 20, T[23]);
					a = GG(a, b, c, d, M_offset_9, 5, T[24]);
					d = GG(d, a, b, c, M_offset_14, 9, T[25]);
					c = GG(c, d, a, b, M_offset_3, 14, T[26]);
					b = GG(b, c, d, a, M_offset_8, 20, T[27]);
					a = GG(a, b, c, d, M_offset_13, 5, T[28]);
					d = GG(d, a, b, c, M_offset_2, 9, T[29]);
					c = GG(c, d, a, b, M_offset_7, 14, T[30]);
					b = GG(b, c, d, a, M_offset_12, 20, T[31]);

					a = HH(a, b, c, d, M_offset_5, 4, T[32]);
					d = HH(d, a, b, c, M_offset_8, 11, T[33]);
					c = HH(c, d, a, b, M_offset_11, 16, T[34]);
					b = HH(b, c, d, a, M_offset_14, 23, T[35]);
					a = HH(a, b, c, d, M_offset_1, 4, T[36]);
					d = HH(d, a, b, c, M_offset_4, 11, T[37]);
					c = HH(c, d, a, b, M_offset_7, 16, T[38]);
					b = HH(b, c, d, a, M_offset_10, 23, T[39]);
					a = HH(a, b, c, d, M_offset_13, 4, T[40]);
					d = HH(d, a, b, c, M_offset_0, 11, T[41]);
					c = HH(c, d, a, b, M_offset_3, 16, T[42]);
					b = HH(b, c, d, a, M_offset_6, 23, T[43]);
					a = HH(a, b, c, d, M_offset_9, 4, T[44]);
					d = HH(d, a, b, c, M_offset_12, 11, T[45]);
					c = HH(c, d, a, b, M_offset_15, 16, T[46]);
					b = HH(b, c, d, a, M_offset_2, 23, T[47]);

					a = II(a, b, c, d, M_offset_0, 6, T[48]);
					d = II(d, a, b, c, M_offset_7, 10, T[49]);
					c = II(c, d, a, b, M_offset_14, 15, T[50]);
					b = II(b, c, d, a, M_offset_5, 21, T[51]);
					a = II(a, b, c, d, M_offset_12, 6, T[52]);
					d = II(d, a, b, c, M_offset_3, 10, T[53]);
					c = II(c, d, a, b, M_offset_10, 15, T[54]);
					b = II(b, c, d, a, M_offset_1, 21, T[55]);
					a = II(a, b, c, d, M_offset_8, 6, T[56]);
					d = II(d, a, b, c, M_offset_15, 10, T[57]);
					c = II(c, d, a, b, M_offset_6, 15, T[58]);
					b = II(b, c, d, a, M_offset_13, 21, T[59]);
					a = II(a, b, c, d, M_offset_4, 6, T[60]);
					d = II(d, a, b, c, M_offset_11, 10, T[61]);
					c = II(c, d, a, b, M_offset_2, 15, T[62]);
					b = II(b, c, d, a, M_offset_9, 21, T[63]);

					// Intermediate hash value
					H[0] = H[0] + a | 0;
					H[1] = H[1] + b | 0;
					H[2] = H[2] + c | 0;
					H[3] = H[3] + d | 0;
				},

				_doFinalize: function _doFinalize() {
					// Shortcuts
					var data = this._data;
					var dataWords = data.words;

					var nBitsTotal = this._nDataBytes * 8;
					var nBitsLeft = data.sigBytes * 8;

					// Add padding
					dataWords[nBitsLeft >>> 5] |= 0x80 << 24 - nBitsLeft % 32;

					var nBitsTotalH = Math.floor(nBitsTotal / 0x100000000);
					var nBitsTotalL = nBitsTotal;
					dataWords[(nBitsLeft + 64 >>> 9 << 4) + 15] = (nBitsTotalH << 8 | nBitsTotalH >>> 24) & 0x00ff00ff | (nBitsTotalH << 24 | nBitsTotalH >>> 8) & 0xff00ff00;
					dataWords[(nBitsLeft + 64 >>> 9 << 4) + 14] = (nBitsTotalL << 8 | nBitsTotalL >>> 24) & 0x00ff00ff | (nBitsTotalL << 24 | nBitsTotalL >>> 8) & 0xff00ff00;

					data.sigBytes = (dataWords.length + 1) * 4;

					// Hash final blocks
					this._process();

					// Shortcuts
					var hash = this._hash;
					var H = hash.words;

					// Swap endian
					for (var i = 0; i < 4; i++) {
						// Shortcut
						var H_i = H[i];

						H[i] = (H_i << 8 | H_i >>> 24) & 0x00ff00ff | (H_i << 24 | H_i >>> 8) & 0xff00ff00;
					}

					// Return final computed hash
					return hash;
				},

				clone: function clone() {
					var clone = Hasher.clone.call(this);
					clone._hash = this._hash.clone();

					return clone;
				}
			});

			function FF(a, b, c, d, x, s, t) {
				var n = a + (b & c | ~b & d) + x + t;
				return (n << s | n >>> 32 - s) + b;
			}

			function GG(a, b, c, d, x, s, t) {
				var n = a + (b & d | c & ~d) + x + t;
				return (n << s | n >>> 32 - s) + b;
			}

			function HH(a, b, c, d, x, s, t) {
				var n = a + (b ^ c ^ d) + x + t;
				return (n << s | n >>> 32 - s) + b;
			}

			function II(a, b, c, d, x, s, t) {
				var n = a + (c ^ (b | ~d)) + x + t;
				return (n << s | n >>> 32 - s) + b;
			}

			/**
	   * Shortcut function to the hasher's object interface.
	   *
	   * @param {WordArray|string} message The message to hash.
	   *
	   * @return {WordArray} The hash.
	   *
	   * @static
	   *
	   * @example
	   *
	   *     var hash = CryptoJS.MD5('message');
	   *     var hash = CryptoJS.MD5(wordArray);
	   */
			C.MD5 = Hasher._createHelper(MD5);

			/**
	   * Shortcut function to the HMAC's object interface.
	   *
	   * @param {WordArray|string} message The message to hash.
	   * @param {WordArray|string} key The secret key.
	   *
	   * @return {WordArray} The HMAC.
	   *
	   * @static
	   *
	   * @example
	   *
	   *     var hmac = CryptoJS.HmacMD5(message, key);
	   */
			C.HmacMD5 = Hasher._createHmacHelper(MD5);
		})(Math);

		return CryptoJS.MD5;
	});

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;"use strict";

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	;(function (root, factory, undef) {
		if (( false ? "undefined" : _typeof(exports)) === "object") {
			// CommonJS
			module.exports = exports = factory(__webpack_require__(4), __webpack_require__(10), __webpack_require__(11));
		} else if (true) {
			// AMD
			!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(4), __webpack_require__(10), __webpack_require__(11)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		} else {
			// Global (browser)
			factory(root.CryptoJS);
		}
	})(undefined, function (CryptoJS) {

		(function () {
			// Shortcuts
			var C = CryptoJS;
			var C_lib = C.lib;
			var Base = C_lib.Base;
			var WordArray = C_lib.WordArray;
			var C_algo = C.algo;
			var MD5 = C_algo.MD5;

			/**
	   * This key derivation function is meant to conform with EVP_BytesToKey.
	   * www.openssl.org/docs/crypto/EVP_BytesToKey.html
	   */
			var EvpKDF = C_algo.EvpKDF = Base.extend({
				/**
	    * Configuration options.
	    *
	    * @property {number} keySize The key size in words to generate. Default: 4 (128 bits)
	    * @property {Hasher} hasher The hash algorithm to use. Default: MD5
	    * @property {number} iterations The number of iterations to perform. Default: 1
	    */
				cfg: Base.extend({
					keySize: 128 / 32,
					hasher: MD5,
					iterations: 1
				}),

				/**
	    * Initializes a newly created key derivation function.
	    *
	    * @param {Object} cfg (Optional) The configuration options to use for the derivation.
	    *
	    * @example
	    *
	    *     var kdf = CryptoJS.algo.EvpKDF.create();
	    *     var kdf = CryptoJS.algo.EvpKDF.create({ keySize: 8 });
	    *     var kdf = CryptoJS.algo.EvpKDF.create({ keySize: 8, iterations: 1000 });
	    */
				init: function init(cfg) {
					this.cfg = this.cfg.extend(cfg);
				},

				/**
	    * Derives a key from a password.
	    *
	    * @param {WordArray|string} password The password.
	    * @param {WordArray|string} salt A salt.
	    *
	    * @return {WordArray} The derived key.
	    *
	    * @example
	    *
	    *     var key = kdf.compute(password, salt);
	    */
				compute: function compute(password, salt) {
					// Shortcut
					var cfg = this.cfg;

					// Init hasher
					var hasher = cfg.hasher.create();

					// Initial values
					var derivedKey = WordArray.create();

					// Shortcuts
					var derivedKeyWords = derivedKey.words;
					var keySize = cfg.keySize;
					var iterations = cfg.iterations;

					// Generate key
					while (derivedKeyWords.length < keySize) {
						if (block) {
							hasher.update(block);
						}
						var block = hasher.update(password).finalize(salt);
						hasher.reset();

						// Iterations
						for (var i = 1; i < iterations; i++) {
							block = hasher.finalize(block);
							hasher.reset();
						}

						derivedKey.concat(block);
					}
					derivedKey.sigBytes = keySize * 4;

					return derivedKey;
				}
			});

			/**
	   * Derives a key from a password.
	   *
	   * @param {WordArray|string} password The password.
	   * @param {WordArray|string} salt A salt.
	   * @param {Object} cfg (Optional) The configuration options to use for this computation.
	   *
	   * @return {WordArray} The derived key.
	   *
	   * @static
	   *
	   * @example
	   *
	   *     var key = CryptoJS.EvpKDF(password, salt);
	   *     var key = CryptoJS.EvpKDF(password, salt, { keySize: 8 });
	   *     var key = CryptoJS.EvpKDF(password, salt, { keySize: 8, iterations: 1000 });
	   */
			C.EvpKDF = function (password, salt, cfg) {
				return EvpKDF.create(cfg).compute(password, salt);
			};
		})();

		return CryptoJS.EvpKDF;
	});

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;"use strict";

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	;(function (root, factory) {
		if (( false ? "undefined" : _typeof(exports)) === "object") {
			// CommonJS
			module.exports = exports = factory(__webpack_require__(4));
		} else if (true) {
			// AMD
			!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(4)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		} else {
			// Global (browser)
			factory(root.CryptoJS);
		}
	})(undefined, function (CryptoJS) {

		(function () {
			// Shortcuts
			var C = CryptoJS;
			var C_lib = C.lib;
			var WordArray = C_lib.WordArray;
			var Hasher = C_lib.Hasher;
			var C_algo = C.algo;

			// Reusable object
			var W = [];

			/**
	   * SHA-1 hash algorithm.
	   */
			var SHA1 = C_algo.SHA1 = Hasher.extend({
				_doReset: function _doReset() {
					this._hash = new WordArray.init([0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0]);
				},

				_doProcessBlock: function _doProcessBlock(M, offset) {
					// Shortcut
					var H = this._hash.words;

					// Working variables
					var a = H[0];
					var b = H[1];
					var c = H[2];
					var d = H[3];
					var e = H[4];

					// Computation
					for (var i = 0; i < 80; i++) {
						if (i < 16) {
							W[i] = M[offset + i] | 0;
						} else {
							var n = W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16];
							W[i] = n << 1 | n >>> 31;
						}

						var t = (a << 5 | a >>> 27) + e + W[i];
						if (i < 20) {
							t += (b & c | ~b & d) + 0x5a827999;
						} else if (i < 40) {
							t += (b ^ c ^ d) + 0x6ed9eba1;
						} else if (i < 60) {
							t += (b & c | b & d | c & d) - 0x70e44324;
						} else /* if (i < 80) */{
								t += (b ^ c ^ d) - 0x359d3e2a;
							}

						e = d;
						d = c;
						c = b << 30 | b >>> 2;
						b = a;
						a = t;
					}

					// Intermediate hash value
					H[0] = H[0] + a | 0;
					H[1] = H[1] + b | 0;
					H[2] = H[2] + c | 0;
					H[3] = H[3] + d | 0;
					H[4] = H[4] + e | 0;
				},

				_doFinalize: function _doFinalize() {
					// Shortcuts
					var data = this._data;
					var dataWords = data.words;

					var nBitsTotal = this._nDataBytes * 8;
					var nBitsLeft = data.sigBytes * 8;

					// Add padding
					dataWords[nBitsLeft >>> 5] |= 0x80 << 24 - nBitsLeft % 32;
					dataWords[(nBitsLeft + 64 >>> 9 << 4) + 14] = Math.floor(nBitsTotal / 0x100000000);
					dataWords[(nBitsLeft + 64 >>> 9 << 4) + 15] = nBitsTotal;
					data.sigBytes = dataWords.length * 4;

					// Hash final blocks
					this._process();

					// Return final computed hash
					return this._hash;
				},

				clone: function clone() {
					var clone = Hasher.clone.call(this);
					clone._hash = this._hash.clone();

					return clone;
				}
			});

			/**
	   * Shortcut function to the hasher's object interface.
	   *
	   * @param {WordArray|string} message The message to hash.
	   *
	   * @return {WordArray} The hash.
	   *
	   * @static
	   *
	   * @example
	   *
	   *     var hash = CryptoJS.SHA1('message');
	   *     var hash = CryptoJS.SHA1(wordArray);
	   */
			C.SHA1 = Hasher._createHelper(SHA1);

			/**
	   * Shortcut function to the HMAC's object interface.
	   *
	   * @param {WordArray|string} message The message to hash.
	   * @param {WordArray|string} key The secret key.
	   *
	   * @return {WordArray} The HMAC.
	   *
	   * @static
	   *
	   * @example
	   *
	   *     var hmac = CryptoJS.HmacSHA1(message, key);
	   */
			C.HmacSHA1 = Hasher._createHmacHelper(SHA1);
		})();

		return CryptoJS.SHA1;
	});

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;"use strict";

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	;(function (root, factory) {
		if (( false ? "undefined" : _typeof(exports)) === "object") {
			// CommonJS
			module.exports = exports = factory(__webpack_require__(4));
		} else if (true) {
			// AMD
			!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(4)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		} else {
			// Global (browser)
			factory(root.CryptoJS);
		}
	})(undefined, function (CryptoJS) {

		(function () {
			// Shortcuts
			var C = CryptoJS;
			var C_lib = C.lib;
			var Base = C_lib.Base;
			var C_enc = C.enc;
			var Utf8 = C_enc.Utf8;
			var C_algo = C.algo;

			/**
	   * HMAC algorithm.
	   */
			var HMAC = C_algo.HMAC = Base.extend({
				/**
	    * Initializes a newly created HMAC.
	    *
	    * @param {Hasher} hasher The hash algorithm to use.
	    * @param {WordArray|string} key The secret key.
	    *
	    * @example
	    *
	    *     var hmacHasher = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, key);
	    */
				init: function init(hasher, key) {
					// Init hasher
					hasher = this._hasher = new hasher.init();

					// Convert string to WordArray, else assume WordArray already
					if (typeof key == 'string') {
						key = Utf8.parse(key);
					}

					// Shortcuts
					var hasherBlockSize = hasher.blockSize;
					var hasherBlockSizeBytes = hasherBlockSize * 4;

					// Allow arbitrary length keys
					if (key.sigBytes > hasherBlockSizeBytes) {
						key = hasher.finalize(key);
					}

					// Clamp excess bits
					key.clamp();

					// Clone key for inner and outer pads
					var oKey = this._oKey = key.clone();
					var iKey = this._iKey = key.clone();

					// Shortcuts
					var oKeyWords = oKey.words;
					var iKeyWords = iKey.words;

					// XOR keys with pad constants
					for (var i = 0; i < hasherBlockSize; i++) {
						oKeyWords[i] ^= 0x5c5c5c5c;
						iKeyWords[i] ^= 0x36363636;
					}
					oKey.sigBytes = iKey.sigBytes = hasherBlockSizeBytes;

					// Set initial values
					this.reset();
				},

				/**
	    * Resets this HMAC to its initial state.
	    *
	    * @example
	    *
	    *     hmacHasher.reset();
	    */
				reset: function reset() {
					// Shortcut
					var hasher = this._hasher;

					// Reset
					hasher.reset();
					hasher.update(this._iKey);
				},

				/**
	    * Updates this HMAC with a message.
	    *
	    * @param {WordArray|string} messageUpdate The message to append.
	    *
	    * @return {HMAC} This HMAC instance.
	    *
	    * @example
	    *
	    *     hmacHasher.update('message');
	    *     hmacHasher.update(wordArray);
	    */
				update: function update(messageUpdate) {
					this._hasher.update(messageUpdate);

					// Chainable
					return this;
				},

				/**
	    * Finalizes the HMAC computation.
	    * Note that the finalize operation is effectively a destructive, read-once operation.
	    *
	    * @param {WordArray|string} messageUpdate (Optional) A final message update.
	    *
	    * @return {WordArray} The HMAC.
	    *
	    * @example
	    *
	    *     var hmac = hmacHasher.finalize();
	    *     var hmac = hmacHasher.finalize('message');
	    *     var hmac = hmacHasher.finalize(wordArray);
	    */
				finalize: function finalize(messageUpdate) {
					// Shortcut
					var hasher = this._hasher;

					// Compute HMAC
					var innerHash = hasher.finalize(messageUpdate);
					hasher.reset();
					var hmac = hasher.finalize(this._oKey.clone().concat(innerHash));

					return hmac;
				}
			});
		})();
	});

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;"use strict";

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	;(function (root, factory) {
		if (( false ? "undefined" : _typeof(exports)) === "object") {
			// CommonJS
			module.exports = exports = factory(__webpack_require__(4));
		} else if (true) {
			// AMD
			!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(4)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		} else {
			// Global (browser)
			factory(root.CryptoJS);
		}
	})(undefined, function (CryptoJS) {

		/**
	  * Cipher core components.
	  */
		CryptoJS.lib.Cipher || function (undefined) {
			// Shortcuts
			var C = CryptoJS;
			var C_lib = C.lib;
			var Base = C_lib.Base;
			var WordArray = C_lib.WordArray;
			var BufferedBlockAlgorithm = C_lib.BufferedBlockAlgorithm;
			var C_enc = C.enc;
			var Utf8 = C_enc.Utf8;
			var Base64 = C_enc.Base64;
			var C_algo = C.algo;
			var EvpKDF = C_algo.EvpKDF;

			/**
	   * Abstract base cipher template.
	   *
	   * @property {number} keySize This cipher's key size. Default: 4 (128 bits)
	   * @property {number} ivSize This cipher's IV size. Default: 4 (128 bits)
	   * @property {number} _ENC_XFORM_MODE A constant representing encryption mode.
	   * @property {number} _DEC_XFORM_MODE A constant representing decryption mode.
	   */
			var Cipher = C_lib.Cipher = BufferedBlockAlgorithm.extend({
				/**
	    * Configuration options.
	    *
	    * @property {WordArray} iv The IV to use for this operation.
	    */
				cfg: Base.extend(),

				/**
	    * Creates this cipher in encryption mode.
	    *
	    * @param {WordArray} key The key.
	    * @param {Object} cfg (Optional) The configuration options to use for this operation.
	    *
	    * @return {Cipher} A cipher instance.
	    *
	    * @static
	    *
	    * @example
	    *
	    *     var cipher = CryptoJS.algo.AES.createEncryptor(keyWordArray, { iv: ivWordArray });
	    */
				createEncryptor: function createEncryptor(key, cfg) {
					return this.create(this._ENC_XFORM_MODE, key, cfg);
				},

				/**
	    * Creates this cipher in decryption mode.
	    *
	    * @param {WordArray} key The key.
	    * @param {Object} cfg (Optional) The configuration options to use for this operation.
	    *
	    * @return {Cipher} A cipher instance.
	    *
	    * @static
	    *
	    * @example
	    *
	    *     var cipher = CryptoJS.algo.AES.createDecryptor(keyWordArray, { iv: ivWordArray });
	    */
				createDecryptor: function createDecryptor(key, cfg) {
					return this.create(this._DEC_XFORM_MODE, key, cfg);
				},

				/**
	    * Initializes a newly created cipher.
	    *
	    * @param {number} xformMode Either the encryption or decryption transormation mode constant.
	    * @param {WordArray} key The key.
	    * @param {Object} cfg (Optional) The configuration options to use for this operation.
	    *
	    * @example
	    *
	    *     var cipher = CryptoJS.algo.AES.create(CryptoJS.algo.AES._ENC_XFORM_MODE, keyWordArray, { iv: ivWordArray });
	    */
				init: function init(xformMode, key, cfg) {
					// Apply config defaults
					this.cfg = this.cfg.extend(cfg);

					// Store transform mode and key
					this._xformMode = xformMode;
					this._key = key;

					// Set initial values
					this.reset();
				},

				/**
	    * Resets this cipher to its initial state.
	    *
	    * @example
	    *
	    *     cipher.reset();
	    */
				reset: function reset() {
					// Reset data buffer
					BufferedBlockAlgorithm.reset.call(this);

					// Perform concrete-cipher logic
					this._doReset();
				},

				/**
	    * Adds data to be encrypted or decrypted.
	    *
	    * @param {WordArray|string} dataUpdate The data to encrypt or decrypt.
	    *
	    * @return {WordArray} The data after processing.
	    *
	    * @example
	    *
	    *     var encrypted = cipher.process('data');
	    *     var encrypted = cipher.process(wordArray);
	    */
				process: function process(dataUpdate) {
					// Append
					this._append(dataUpdate);

					// Process available blocks
					return this._process();
				},

				/**
	    * Finalizes the encryption or decryption process.
	    * Note that the finalize operation is effectively a destructive, read-once operation.
	    *
	    * @param {WordArray|string} dataUpdate The final data to encrypt or decrypt.
	    *
	    * @return {WordArray} The data after final processing.
	    *
	    * @example
	    *
	    *     var encrypted = cipher.finalize();
	    *     var encrypted = cipher.finalize('data');
	    *     var encrypted = cipher.finalize(wordArray);
	    */
				finalize: function finalize(dataUpdate) {
					// Final data update
					if (dataUpdate) {
						this._append(dataUpdate);
					}

					// Perform concrete-cipher logic
					var finalProcessedData = this._doFinalize();

					return finalProcessedData;
				},

				keySize: 128 / 32,

				ivSize: 128 / 32,

				_ENC_XFORM_MODE: 1,

				_DEC_XFORM_MODE: 2,

				/**
	    * Creates shortcut functions to a cipher's object interface.
	    *
	    * @param {Cipher} cipher The cipher to create a helper for.
	    *
	    * @return {Object} An object with encrypt and decrypt shortcut functions.
	    *
	    * @static
	    *
	    * @example
	    *
	    *     var AES = CryptoJS.lib.Cipher._createHelper(CryptoJS.algo.AES);
	    */
				_createHelper: function () {
					function selectCipherStrategy(key) {
						if (typeof key == 'string') {
							return PasswordBasedCipher;
						} else {
							return SerializableCipher;
						}
					}

					return function (cipher) {
						return {
							encrypt: function encrypt(message, key, cfg) {
								return selectCipherStrategy(key).encrypt(cipher, message, key, cfg);
							},

							decrypt: function decrypt(ciphertext, key, cfg) {
								return selectCipherStrategy(key).decrypt(cipher, ciphertext, key, cfg);
							}
						};
					};
				}()
			});

			/**
	   * Abstract base stream cipher template.
	   *
	   * @property {number} blockSize The number of 32-bit words this cipher operates on. Default: 1 (32 bits)
	   */
			var StreamCipher = C_lib.StreamCipher = Cipher.extend({
				_doFinalize: function _doFinalize() {
					// Process partial blocks
					var finalProcessedBlocks = this._process(!!'flush');

					return finalProcessedBlocks;
				},

				blockSize: 1
			});

			/**
	   * Mode namespace.
	   */
			var C_mode = C.mode = {};

			/**
	   * Abstract base block cipher mode template.
	   */
			var BlockCipherMode = C_lib.BlockCipherMode = Base.extend({
				/**
	    * Creates this mode for encryption.
	    *
	    * @param {Cipher} cipher A block cipher instance.
	    * @param {Array} iv The IV words.
	    *
	    * @static
	    *
	    * @example
	    *
	    *     var mode = CryptoJS.mode.CBC.createEncryptor(cipher, iv.words);
	    */
				createEncryptor: function createEncryptor(cipher, iv) {
					return this.Encryptor.create(cipher, iv);
				},

				/**
	    * Creates this mode for decryption.
	    *
	    * @param {Cipher} cipher A block cipher instance.
	    * @param {Array} iv The IV words.
	    *
	    * @static
	    *
	    * @example
	    *
	    *     var mode = CryptoJS.mode.CBC.createDecryptor(cipher, iv.words);
	    */
				createDecryptor: function createDecryptor(cipher, iv) {
					return this.Decryptor.create(cipher, iv);
				},

				/**
	    * Initializes a newly created mode.
	    *
	    * @param {Cipher} cipher A block cipher instance.
	    * @param {Array} iv The IV words.
	    *
	    * @example
	    *
	    *     var mode = CryptoJS.mode.CBC.Encryptor.create(cipher, iv.words);
	    */
				init: function init(cipher, iv) {
					this._cipher = cipher;
					this._iv = iv;
				}
			});

			/**
	   * Cipher Block Chaining mode.
	   */
			var CBC = C_mode.CBC = function () {
				/**
	    * Abstract base CBC mode.
	    */
				var CBC = BlockCipherMode.extend();

				/**
	    * CBC encryptor.
	    */
				CBC.Encryptor = CBC.extend({
					/**
	     * Processes the data block at offset.
	     *
	     * @param {Array} words The data words to operate on.
	     * @param {number} offset The offset where the block starts.
	     *
	     * @example
	     *
	     *     mode.processBlock(data.words, offset);
	     */
					processBlock: function processBlock(words, offset) {
						// Shortcuts
						var cipher = this._cipher;
						var blockSize = cipher.blockSize;

						// XOR and encrypt
						xorBlock.call(this, words, offset, blockSize);
						cipher.encryptBlock(words, offset);

						// Remember this block to use with next block
						this._prevBlock = words.slice(offset, offset + blockSize);
					}
				});

				/**
	    * CBC decryptor.
	    */
				CBC.Decryptor = CBC.extend({
					/**
	     * Processes the data block at offset.
	     *
	     * @param {Array} words The data words to operate on.
	     * @param {number} offset The offset where the block starts.
	     *
	     * @example
	     *
	     *     mode.processBlock(data.words, offset);
	     */
					processBlock: function processBlock(words, offset) {
						// Shortcuts
						var cipher = this._cipher;
						var blockSize = cipher.blockSize;

						// Remember this block to use with next block
						var thisBlock = words.slice(offset, offset + blockSize);

						// Decrypt and XOR
						cipher.decryptBlock(words, offset);
						xorBlock.call(this, words, offset, blockSize);

						// This block becomes the previous block
						this._prevBlock = thisBlock;
					}
				});

				function xorBlock(words, offset, blockSize) {
					// Shortcut
					var iv = this._iv;

					// Choose mixing block
					if (iv) {
						var block = iv;

						// Remove IV for subsequent blocks
						this._iv = undefined;
					} else {
						var block = this._prevBlock;
					}

					// XOR blocks
					for (var i = 0; i < blockSize; i++) {
						words[offset + i] ^= block[i];
					}
				}

				return CBC;
			}();

			/**
	   * Padding namespace.
	   */
			var C_pad = C.pad = {};

			/**
	   * PKCS #5/7 padding strategy.
	   */
			var Pkcs7 = C_pad.Pkcs7 = {
				/**
	    * Pads data using the algorithm defined in PKCS #5/7.
	    *
	    * @param {WordArray} data The data to pad.
	    * @param {number} blockSize The multiple that the data should be padded to.
	    *
	    * @static
	    *
	    * @example
	    *
	    *     CryptoJS.pad.Pkcs7.pad(wordArray, 4);
	    */
				pad: function pad(data, blockSize) {
					// Shortcut
					var blockSizeBytes = blockSize * 4;

					// Count padding bytes
					var nPaddingBytes = blockSizeBytes - data.sigBytes % blockSizeBytes;

					// Create padding word
					var paddingWord = nPaddingBytes << 24 | nPaddingBytes << 16 | nPaddingBytes << 8 | nPaddingBytes;

					// Create padding
					var paddingWords = [];
					for (var i = 0; i < nPaddingBytes; i += 4) {
						paddingWords.push(paddingWord);
					}
					var padding = WordArray.create(paddingWords, nPaddingBytes);

					// Add padding
					data.concat(padding);
				},

				/**
	    * Unpads data that had been padded using the algorithm defined in PKCS #5/7.
	    *
	    * @param {WordArray} data The data to unpad.
	    *
	    * @static
	    *
	    * @example
	    *
	    *     CryptoJS.pad.Pkcs7.unpad(wordArray);
	    */
				unpad: function unpad(data) {
					// Get number of padding bytes from last byte
					var nPaddingBytes = data.words[data.sigBytes - 1 >>> 2] & 0xff;

					// Remove padding
					data.sigBytes -= nPaddingBytes;
				}
			};

			/**
	   * Abstract base block cipher template.
	   *
	   * @property {number} blockSize The number of 32-bit words this cipher operates on. Default: 4 (128 bits)
	   */
			var BlockCipher = C_lib.BlockCipher = Cipher.extend({
				/**
	    * Configuration options.
	    *
	    * @property {Mode} mode The block mode to use. Default: CBC
	    * @property {Padding} padding The padding strategy to use. Default: Pkcs7
	    */
				cfg: Cipher.cfg.extend({
					mode: CBC,
					padding: Pkcs7
				}),

				reset: function reset() {
					// Reset cipher
					Cipher.reset.call(this);

					// Shortcuts
					var cfg = this.cfg;
					var iv = cfg.iv;
					var mode = cfg.mode;

					// Reset block mode
					if (this._xformMode == this._ENC_XFORM_MODE) {
						var modeCreator = mode.createEncryptor;
					} else /* if (this._xformMode == this._DEC_XFORM_MODE) */{
							var modeCreator = mode.createDecryptor;

							// Keep at least one block in the buffer for unpadding
							this._minBufferSize = 1;
						}
					this._mode = modeCreator.call(mode, this, iv && iv.words);
				},

				_doProcessBlock: function _doProcessBlock(words, offset) {
					this._mode.processBlock(words, offset);
				},

				_doFinalize: function _doFinalize() {
					// Shortcut
					var padding = this.cfg.padding;

					// Finalize
					if (this._xformMode == this._ENC_XFORM_MODE) {
						// Pad data
						padding.pad(this._data, this.blockSize);

						// Process final blocks
						var finalProcessedBlocks = this._process(!!'flush');
					} else /* if (this._xformMode == this._DEC_XFORM_MODE) */{
							// Process final blocks
							var finalProcessedBlocks = this._process(!!'flush');

							// Unpad data
							padding.unpad(finalProcessedBlocks);
						}

					return finalProcessedBlocks;
				},

				blockSize: 128 / 32
			});

			/**
	   * A collection of cipher parameters.
	   *
	   * @property {WordArray} ciphertext The raw ciphertext.
	   * @property {WordArray} key The key to this ciphertext.
	   * @property {WordArray} iv The IV used in the ciphering operation.
	   * @property {WordArray} salt The salt used with a key derivation function.
	   * @property {Cipher} algorithm The cipher algorithm.
	   * @property {Mode} mode The block mode used in the ciphering operation.
	   * @property {Padding} padding The padding scheme used in the ciphering operation.
	   * @property {number} blockSize The block size of the cipher.
	   * @property {Format} formatter The default formatting strategy to convert this cipher params object to a string.
	   */
			var CipherParams = C_lib.CipherParams = Base.extend({
				/**
	    * Initializes a newly created cipher params object.
	    *
	    * @param {Object} cipherParams An object with any of the possible cipher parameters.
	    *
	    * @example
	    *
	    *     var cipherParams = CryptoJS.lib.CipherParams.create({
	    *         ciphertext: ciphertextWordArray,
	    *         key: keyWordArray,
	    *         iv: ivWordArray,
	    *         salt: saltWordArray,
	    *         algorithm: CryptoJS.algo.AES,
	    *         mode: CryptoJS.mode.CBC,
	    *         padding: CryptoJS.pad.PKCS7,
	    *         blockSize: 4,
	    *         formatter: CryptoJS.format.OpenSSL
	    *     });
	    */
				init: function init(cipherParams) {
					this.mixIn(cipherParams);
				},

				/**
	    * Converts this cipher params object to a string.
	    *
	    * @param {Format} formatter (Optional) The formatting strategy to use.
	    *
	    * @return {string} The stringified cipher params.
	    *
	    * @throws Error If neither the formatter nor the default formatter is set.
	    *
	    * @example
	    *
	    *     var string = cipherParams + '';
	    *     var string = cipherParams.toString();
	    *     var string = cipherParams.toString(CryptoJS.format.OpenSSL);
	    */
				toString: function toString(formatter) {
					return (formatter || this.formatter).stringify(this);
				}
			});

			/**
	   * Format namespace.
	   */
			var C_format = C.format = {};

			/**
	   * OpenSSL formatting strategy.
	   */
			var OpenSSLFormatter = C_format.OpenSSL = {
				/**
	    * Converts a cipher params object to an OpenSSL-compatible string.
	    *
	    * @param {CipherParams} cipherParams The cipher params object.
	    *
	    * @return {string} The OpenSSL-compatible string.
	    *
	    * @static
	    *
	    * @example
	    *
	    *     var openSSLString = CryptoJS.format.OpenSSL.stringify(cipherParams);
	    */
				stringify: function stringify(cipherParams) {
					// Shortcuts
					var ciphertext = cipherParams.ciphertext;
					var salt = cipherParams.salt;

					// Format
					if (salt) {
						var wordArray = WordArray.create([0x53616c74, 0x65645f5f]).concat(salt).concat(ciphertext);
					} else {
						var wordArray = ciphertext;
					}

					return wordArray.toString(Base64);
				},

				/**
	    * Converts an OpenSSL-compatible string to a cipher params object.
	    *
	    * @param {string} openSSLStr The OpenSSL-compatible string.
	    *
	    * @return {CipherParams} The cipher params object.
	    *
	    * @static
	    *
	    * @example
	    *
	    *     var cipherParams = CryptoJS.format.OpenSSL.parse(openSSLString);
	    */
				parse: function parse(openSSLStr) {
					// Parse base64
					var ciphertext = Base64.parse(openSSLStr);

					// Shortcut
					var ciphertextWords = ciphertext.words;

					// Test for salt
					if (ciphertextWords[0] == 0x53616c74 && ciphertextWords[1] == 0x65645f5f) {
						// Extract salt
						var salt = WordArray.create(ciphertextWords.slice(2, 4));

						// Remove salt from ciphertext
						ciphertextWords.splice(0, 4);
						ciphertext.sigBytes -= 16;
					}

					return CipherParams.create({ ciphertext: ciphertext, salt: salt });
				}
			};

			/**
	   * A cipher wrapper that returns ciphertext as a serializable cipher params object.
	   */
			var SerializableCipher = C_lib.SerializableCipher = Base.extend({
				/**
	    * Configuration options.
	    *
	    * @property {Formatter} format The formatting strategy to convert cipher param objects to and from a string. Default: OpenSSL
	    */
				cfg: Base.extend({
					format: OpenSSLFormatter
				}),

				/**
	    * Encrypts a message.
	    *
	    * @param {Cipher} cipher The cipher algorithm to use.
	    * @param {WordArray|string} message The message to encrypt.
	    * @param {WordArray} key The key.
	    * @param {Object} cfg (Optional) The configuration options to use for this operation.
	    *
	    * @return {CipherParams} A cipher params object.
	    *
	    * @static
	    *
	    * @example
	    *
	    *     var ciphertextParams = CryptoJS.lib.SerializableCipher.encrypt(CryptoJS.algo.AES, message, key);
	    *     var ciphertextParams = CryptoJS.lib.SerializableCipher.encrypt(CryptoJS.algo.AES, message, key, { iv: iv });
	    *     var ciphertextParams = CryptoJS.lib.SerializableCipher.encrypt(CryptoJS.algo.AES, message, key, { iv: iv, format: CryptoJS.format.OpenSSL });
	    */
				encrypt: function encrypt(cipher, message, key, cfg) {
					// Apply config defaults
					cfg = this.cfg.extend(cfg);

					// Encrypt
					var encryptor = cipher.createEncryptor(key, cfg);
					var ciphertext = encryptor.finalize(message);

					// Shortcut
					var cipherCfg = encryptor.cfg;

					// Create and return serializable cipher params
					return CipherParams.create({
						ciphertext: ciphertext,
						key: key,
						iv: cipherCfg.iv,
						algorithm: cipher,
						mode: cipherCfg.mode,
						padding: cipherCfg.padding,
						blockSize: cipher.blockSize,
						formatter: cfg.format
					});
				},

				/**
	    * Decrypts serialized ciphertext.
	    *
	    * @param {Cipher} cipher The cipher algorithm to use.
	    * @param {CipherParams|string} ciphertext The ciphertext to decrypt.
	    * @param {WordArray} key The key.
	    * @param {Object} cfg (Optional) The configuration options to use for this operation.
	    *
	    * @return {WordArray} The plaintext.
	    *
	    * @static
	    *
	    * @example
	    *
	    *     var plaintext = CryptoJS.lib.SerializableCipher.decrypt(CryptoJS.algo.AES, formattedCiphertext, key, { iv: iv, format: CryptoJS.format.OpenSSL });
	    *     var plaintext = CryptoJS.lib.SerializableCipher.decrypt(CryptoJS.algo.AES, ciphertextParams, key, { iv: iv, format: CryptoJS.format.OpenSSL });
	    */
				decrypt: function decrypt(cipher, ciphertext, key, cfg) {
					// Apply config defaults
					cfg = this.cfg.extend(cfg);

					// Convert string to CipherParams
					ciphertext = this._parse(ciphertext, cfg.format);

					// Decrypt
					var plaintext = cipher.createDecryptor(key, cfg).finalize(ciphertext.ciphertext);

					return plaintext;
				},

				/**
	    * Converts serialized ciphertext to CipherParams,
	    * else assumed CipherParams already and returns ciphertext unchanged.
	    *
	    * @param {CipherParams|string} ciphertext The ciphertext.
	    * @param {Formatter} format The formatting strategy to use to parse serialized ciphertext.
	    *
	    * @return {CipherParams} The unserialized ciphertext.
	    *
	    * @static
	    *
	    * @example
	    *
	    *     var ciphertextParams = CryptoJS.lib.SerializableCipher._parse(ciphertextStringOrParams, format);
	    */
				_parse: function _parse(ciphertext, format) {
					if (typeof ciphertext == 'string') {
						return format.parse(ciphertext, this);
					} else {
						return ciphertext;
					}
				}
			});

			/**
	   * Key derivation function namespace.
	   */
			var C_kdf = C.kdf = {};

			/**
	   * OpenSSL key derivation function.
	   */
			var OpenSSLKdf = C_kdf.OpenSSL = {
				/**
	    * Derives a key and IV from a password.
	    *
	    * @param {string} password The password to derive from.
	    * @param {number} keySize The size in words of the key to generate.
	    * @param {number} ivSize The size in words of the IV to generate.
	    * @param {WordArray|string} salt (Optional) A 64-bit salt to use. If omitted, a salt will be generated randomly.
	    *
	    * @return {CipherParams} A cipher params object with the key, IV, and salt.
	    *
	    * @static
	    *
	    * @example
	    *
	    *     var derivedParams = CryptoJS.kdf.OpenSSL.execute('Password', 256/32, 128/32);
	    *     var derivedParams = CryptoJS.kdf.OpenSSL.execute('Password', 256/32, 128/32, 'saltsalt');
	    */
				execute: function execute(password, keySize, ivSize, salt) {
					// Generate random salt
					if (!salt) {
						salt = WordArray.random(64 / 8);
					}

					// Derive key and IV
					var key = EvpKDF.create({ keySize: keySize + ivSize }).compute(password, salt);

					// Separate key and IV
					var iv = WordArray.create(key.words.slice(keySize), ivSize * 4);
					key.sigBytes = keySize * 4;

					// Return params
					return CipherParams.create({ key: key, iv: iv, salt: salt });
				}
			};

			/**
	   * A serializable cipher wrapper that derives the key from a password,
	   * and returns ciphertext as a serializable cipher params object.
	   */
			var PasswordBasedCipher = C_lib.PasswordBasedCipher = SerializableCipher.extend({
				/**
	    * Configuration options.
	    *
	    * @property {KDF} kdf The key derivation function to use to generate a key and IV from a password. Default: OpenSSL
	    */
				cfg: SerializableCipher.cfg.extend({
					kdf: OpenSSLKdf
				}),

				/**
	    * Encrypts a message using a password.
	    *
	    * @param {Cipher} cipher The cipher algorithm to use.
	    * @param {WordArray|string} message The message to encrypt.
	    * @param {string} password The password.
	    * @param {Object} cfg (Optional) The configuration options to use for this operation.
	    *
	    * @return {CipherParams} A cipher params object.
	    *
	    * @static
	    *
	    * @example
	    *
	    *     var ciphertextParams = CryptoJS.lib.PasswordBasedCipher.encrypt(CryptoJS.algo.AES, message, 'password');
	    *     var ciphertextParams = CryptoJS.lib.PasswordBasedCipher.encrypt(CryptoJS.algo.AES, message, 'password', { format: CryptoJS.format.OpenSSL });
	    */
				encrypt: function encrypt(cipher, message, password, cfg) {
					// Apply config defaults
					cfg = this.cfg.extend(cfg);

					// Derive key and other params
					var derivedParams = cfg.kdf.execute(password, cipher.keySize, cipher.ivSize);

					// Add IV to config
					cfg.iv = derivedParams.iv;

					// Encrypt
					var ciphertext = SerializableCipher.encrypt.call(this, cipher, message, derivedParams.key, cfg);

					// Mix in derived params
					ciphertext.mixIn(derivedParams);

					return ciphertext;
				},

				/**
	    * Decrypts serialized ciphertext using a password.
	    *
	    * @param {Cipher} cipher The cipher algorithm to use.
	    * @param {CipherParams|string} ciphertext The ciphertext to decrypt.
	    * @param {string} password The password.
	    * @param {Object} cfg (Optional) The configuration options to use for this operation.
	    *
	    * @return {WordArray} The plaintext.
	    *
	    * @static
	    *
	    * @example
	    *
	    *     var plaintext = CryptoJS.lib.PasswordBasedCipher.decrypt(CryptoJS.algo.AES, formattedCiphertext, 'password', { format: CryptoJS.format.OpenSSL });
	    *     var plaintext = CryptoJS.lib.PasswordBasedCipher.decrypt(CryptoJS.algo.AES, ciphertextParams, 'password', { format: CryptoJS.format.OpenSSL });
	    */
				decrypt: function decrypt(cipher, ciphertext, password, cfg) {
					// Apply config defaults
					cfg = this.cfg.extend(cfg);

					// Convert string to CipherParams
					ciphertext = this._parse(ciphertext, cfg.format);

					// Derive key and other params
					var derivedParams = cfg.kdf.execute(password, cipher.keySize, cipher.ivSize, ciphertext.salt);

					// Add IV to config
					cfg.iv = derivedParams.iv;

					// Decrypt
					var plaintext = SerializableCipher.decrypt.call(this, cipher, ciphertext, derivedParams.key, cfg);

					return plaintext;
				}
			});
		}();
	});

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;"use strict";

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	;(function (root, factory, undef) {
		if (( false ? "undefined" : _typeof(exports)) === "object") {
			// CommonJS
			module.exports = exports = factory(__webpack_require__(4), __webpack_require__(12));
		} else if (true) {
			// AMD
			!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(4), __webpack_require__(12)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		} else {
			// Global (browser)
			factory(root.CryptoJS);
		}
	})(undefined, function (CryptoJS) {

		/**
	  * Zero padding strategy.
	  */
		CryptoJS.pad.ZeroPadding = {
			pad: function pad(data, blockSize) {
				// Shortcut
				var blockSizeBytes = blockSize * 4;

				// Pad
				data.clamp();
				data.sigBytes += blockSizeBytes - (data.sigBytes % blockSizeBytes || blockSizeBytes);
			},

			unpad: function unpad(data) {
				// Shortcut
				var dataWords = data.words;

				// Unpad
				var i = data.sigBytes - 1;
				while (!(dataWords[i >>> 2] >>> 24 - i % 4 * 8 & 0xff)) {
					i--;
				}
				data.sigBytes = i + 1;
			}
		};

		return CryptoJS.pad.ZeroPadding;
	});

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;"use strict";

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	;(function (root, factory, undef) {
		if (( false ? "undefined" : _typeof(exports)) === "object") {
			// CommonJS
			module.exports = exports = factory(__webpack_require__(4), __webpack_require__(12));
		} else if (true) {
			// AMD
			!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(4), __webpack_require__(12)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		} else {
			// Global (browser)
			factory(root.CryptoJS);
		}
	})(undefined, function (CryptoJS) {

		/**
	  * Electronic Codebook block mode.
	  */
		CryptoJS.mode.ECB = function () {
			var ECB = CryptoJS.lib.BlockCipherMode.extend();

			ECB.Encryptor = ECB.extend({
				processBlock: function processBlock(words, offset) {
					this._cipher.encryptBlock(words, offset);
				}
			});

			ECB.Decryptor = ECB.extend({
				processBlock: function processBlock(words, offset) {
					this._cipher.decryptBlock(words, offset);
				}
			});

			return ECB;
		}();

		return CryptoJS.mode.ECB;
	});

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.request = exports.connection = undefined;

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var _Observable = __webpack_require__(17);

	var _BehaviorSubject = __webpack_require__(31);

	__webpack_require__(36);

	__webpack_require__(43);

	__webpack_require__(45);

	__webpack_require__(48);

	__webpack_require__(57);

	__webpack_require__(62);

	var _endec = __webpack_require__(64);

	var _binaryEndec = __webpack_require__(66);

	var _sockjsClient = __webpack_require__(68);

	var _sockjsClient2 = _interopRequireDefault(_sockjsClient);

	var _remoting = __webpack_require__(1);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var connection = function connection() {
	    var details = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
	    var useBinary = arguments[1];
	    var qmBinary = arguments[2];


	    var _id = null,
	        responders = {},
	        connected = new _BehaviorSubject.BehaviorSubject({ connected: false, eCode: 0 }),
	        clientLogging = new _BehaviorSubject.BehaviorSubject({ enabled: false, userid: "" }),
	        logoff = new _BehaviorSubject.BehaviorSubject({ loggedoff: false, reason: "" }),
	        oobupdate = new _BehaviorSubject.BehaviorSubject({ type: "", data: null }),
	        attempts = -1,
	        ws = null,
	        raw = true;

	    details = details || {
	        host: "localhost",
	        port: 8080,
	        secure: false,
	        fromURL: true
	    };

	    useBinary = useBinary;
	    qmBinary = qmBinary;
	    console.log("Binary Enabled: " + useBinary + ":" + qmBinary);

	    try {
	        var _request = new XMLHttpRequest();
	        _request.open("get", "connection.txt?" + Date.now(), true);
	        _request.onload = function (e) {
	            if (_request.readyState === 4) {
	                if (_request.status === 200) {
	                    details = JSON.parse(_request.responseText);
	                } else {
	                    console.log(_request.statusText);
	                }
	            }
	        };
	        _request.send();
	    } catch (e) {
	        console.log(e);
	    }

	    if (details.fromURL) {
	        details.port = parseInt(window.location.port, 10);
	        details.host = window.location.hostname;
	        details.secure = window.location.protocol.indexOf("https") === 0;
	    }

	    var URL = ("http" + (details.secure ? "s" : "") + "://" + details.host + ":" + details.port).replace(":NaN", ""),
	        postURL = URL + "/services",
	        sockURL = URL + "/sockjs/websocket",
	        wsURL = ("ws" + (details.secure ? "s" : "") + "://" + details.host + ":" + details.port + "/websocket").replace(":NaN", "");

	    process = function process(msg) {
	        if (!_id) {
	            var parsedMsg = JSON.parse(msg.apiMessage);
	            if (typeof parsedMsg === "string") {
	                _id = parsedMsg;
	                connected.next({ connected: true, eCode: 0 });
	                console.log(getNowTime() + " : Connected with id: " + _id);
	                return;
	            }
	        }
	        // If here must be a proper message
	        var apiMsg = (0, _endec.decode)(msg.apiMessage);

	        if (apiMsg instanceof _remoting.FDRemoteCall) {
	            return;
	        } else if (apiMsg instanceof _remoting.OOBUpdate) {
	            console.log("OOBUpdate received " + apiMsg.type);
	            if (apiMsg.type == "clientLoggingStatus") {
	                var fields = apiMsg.data.split('|');
	                var enableClientLogging = fields[0] == '1';
	                clientLogging.next({ enabled: enableClientLogging, clientid: fields[1] });
	            } else {
	                oobupdate.next({ type: apiMsg.type, data: apiMsg.data, appMsg: msg.applicationMessage });
	            }
	        } else if (apiMsg instanceof _remoting.LogoutMessage) {
	            console.log("LogoutMessage received '" + apiMsg.reason + "'");
	            logoff.next({ loggedoff: true, reason: apiMsg.reason });
	        } else {
	            var res = null;
	            if (apiMsg instanceof _remoting.Message) {
	                // *Messages - qmBinary Enabled
	                res = responders[apiMsg.subId];
	                res ? res.result(apiMsg, msg.applicationMessage) : null;
	            } else if (apiMsg[0] instanceof _remoting.Message) {
	                // *Messages - qmBinary Disabled
	                apiMsg.forEach(function (m) {
	                    var res = responders[m.subId];
	                    res ? res.result(m, msg.applicationMessage) : null;
	                });
	            } else {
	                // Request/Response flow
	                res = responders[apiMsg[0]];
	                if (res) {
	                    apiMsg[1] ? res.result(apiMsg[2], msg.applicationMessage) : res.fault(apiMsg[2]);
	                }
	                if (apiMsg.length > 2) {
	                    if (apiMsg[2] == null || _typeof(apiMsg[2]) !== "object" || !('clientSubId' in apiMsg[2])) {
	                        // console.log(getNowTime() + " :" + id + ": Update number-" + data[0]);
	                        delete responders[apiMsg[0]];
	                    }
	                }
	            }
	        }
	    };

	    var buildNativeWS = function buildNativeWS(wsURL, useBinary, qmBinary, clientId) {
	        return wsURL + "?useBinary:" + useBinary + "&qmBinary:" + qmBinary + "&clientId:" + clientId;
	    };

	    var doConnect = function doConnect(clientId) {
	        if (clientId == null) {
	            console.log("Unable to initialise webSocket connection. No clientId provided");
	            return;
	        }
	        if (connected.value.connected) {
	            console.log("Unable to initialise webSocket connection. Already connected.");
	            return;
	        }
	        var _wsURL = buildNativeWS(wsURL, useBinary, qmBinary, clientId);
	        var _sockURL = sockURL + "?clientId:" + clientId;

	        console.log("Connecting:" + ", raw:" + raw + ", useBinary:" + useBinary + "::" + _wsURL + "||" + _sockURL);
	        ws = raw || useBinary ? new WebSocket(_wsURL) : new _sockjsClient2.default(_sockURL, null, {
	            transports: ["xhr-streaming", "xdr-streaming", "iframe-eventsource", "htmlfile", "iframe-htmlfile", "xhr-polling", "xdr-polling", "iframe-xhr-polling", "jsonp-polling"]
	        });
	        if (useBinary) {
	            ws.binaryType = 'arraybuffer';
	        }
	        ws.onmessage = function (e) {
	            var msg = new _remoting.KXBinaryMsg();
	            if (useBinary && isArrayBuffer(e.data)) {
	                var binMsg = (0, _binaryEndec.decode)(e.data);
	                msg.apiMessage = binMsg.router;
	                msg.applicationMessage = binMsg.payload;
	            } else {
	                var jsonMsg = (0, _endec.decode)(e.data);
	                msg.apiMessage = jsonMsg.apiMessage.message;
	                if (jsonMsg.applicationMessage != undefined) {
	                    msg.applicationMessage = jsonMsg.applicationMessage;
	                }
	            }
	            process(msg);
	        };
	        ws.onclose = function (e) {
	            raw = [1002, 1003, 1006].indexOf(e.code) == -1;
	            console.log("Connection '" + _id + " closed", e);
	            connected.next({ connected: false, eCode: e.code });
	            _id = null;
	        };

	        var isArrayBuffer = function isArrayBuffer(data) {
	            return data && data instanceof ArrayBuffer;
	        };
	    };

	    var doDisconnect = function doDisconnect() {
	        console.log("Disconnecting Websocket");
	        ws.close();
	    };

	    return {
	        send: function send(request) {
	            responders[request.uid] = request.responder;
	            if (connected.getValue().connected) {
	                attempts = -1;
	                var requestData = request.send();
	                var msg = null;
	                if (useBinary) {
	                    var jsonAPIMsg = (0, _endec.encode)(requestData.APIMsg);
	                    msg = (0, _binaryEndec.encode)(jsonAPIMsg, requestData.ApplicationMsg);
	                } else {
	                    var mergedArray = requestData.APIMsg[2].slice(0);
	                    if (requestData.ApplicationMsg != null && requestData.ApplicationMsg.byteLength > 0) {
	                        // Array Buffer coming in must be converted to byte[] understandable by the App Server
	                        var byteArray = new Uint8Array(requestData.ApplicationMsg);
	                        var v = [];
	                        for (var i = 0; i < byteArray.length; i++) {
	                            v.push(byteArray[i]);
	                        }
	                        byteArray = v;
	                        mergedArray.push(byteArray);
	                        requestData.APIMsg[2] = mergedArray;
	                    }
	                    msg = (0, _endec.encode)(requestData.APIMsg);
	                }
	                ws.send(msg);
	            } else {
	                request.responder.fault("no connection available");
	            }
	        },
	        post: function post(request) {
	            responders[request.uid] = request.responder;
	            var http = new XMLHttpRequest(),

	            // BMA Post doesn't support AppMsg
	            blob = new Blob([(0, _endec.encode)(request.send().APIMsg)], {
	                type: "text/plain"
	            });
	            http.onreadystatechange = function (e) {
	                if (http.readyState == 4 && http.status == 200) {
	                    // Does not support AppMessage
	                    var jsonMsg = (0, _endec.decode)(http.responseText);
	                    var msg = new _remoting.KXBinaryMsg();
	                    msg.apiMessage = jsonMsg.apiMessage.message;
	                    process(msg);
	                }
	            };
	            http.open("POST", postURL, true);
	            http.send(blob);
	        },
	        clear: function clear() {
	            return responders = {};
	        },
	        removeResponder: function removeResponder(id) {
	            delete responders[id];
	        },
	        isConnected: function isConnected() {
	            return connected.getValue().connected;
	        },
	        doConnect: doConnect,
	        doDisconnect: doDisconnect,
	        connected: connected,
	        logoff: logoff,
	        oobupdate: oobupdate,
	        clientLogging: clientLogging,
	        id: function id() {
	            return _id;
	        },
	        url: URL
	    };
	};

	var responder = function responder() {
	    var onresult = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
	    var onfault = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

	    return {
	        result: function result(x, y) {
	            if (onresult) {
	                onresult(x, y);
	            }
	        },
	        fault: function fault(x) {
	            if (onfault) {
	                onfault(x);
	            }
	        }
	    };
	};

	var request = function request(service) {
	    var onresult = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
	    var onfault = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
	    var args = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
	    var deltaClient = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
	    var applicationByteMsg = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : new ArrayBuffer(0);

	    var uid = request.cnt++,
	        res = responder(onresult, onfault);
	    return {
	        uid: uid,
	        service: service,
	        deltaClient: deltaClient,
	        responder: res,
	        send: function send() {
	            return {
	                'APIMsg': [uid, service, args, deltaClient],
	                'ApplicationMsg': applicationByteMsg
	            };
	        }
	    };
	};

	var getNowTime = function getNowTime() {
	    var d = new Date();
	    var hr = d.getHours();
	    var min = d.getMinutes();
	    var sec = d.getSeconds();
	    if (min < 10) {
	        min = "0" + min;
	    }
	    if (sec < 10) {
	        sec = "0" + sec;
	    }
	    return hr + ":" + min + "." + sec;
	};

	request.cnt = 0;
	exports.connection = connection;
	exports.request = request;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(16)))

/***/ },
/* 16 */
/***/ function(module, exports) {

	'use strict';

	// shim for using process in browser
	var process = module.exports = {};

	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.

	var cachedSetTimeout;
	var cachedClearTimeout;

	function defaultSetTimout() {
	    throw new Error('setTimeout has not been defined');
	}
	function defaultClearTimeout() {
	    throw new Error('clearTimeout has not been defined');
	}
	(function () {
	    try {
	        if (typeof setTimeout === 'function') {
	            cachedSetTimeout = setTimeout;
	        } else {
	            cachedSetTimeout = defaultSetTimout;
	        }
	    } catch (e) {
	        cachedSetTimeout = defaultSetTimout;
	    }
	    try {
	        if (typeof clearTimeout === 'function') {
	            cachedClearTimeout = clearTimeout;
	        } else {
	            cachedClearTimeout = defaultClearTimeout;
	        }
	    } catch (e) {
	        cachedClearTimeout = defaultClearTimeout;
	    }
	})();
	function runTimeout(fun) {
	    if (cachedSetTimeout === setTimeout) {
	        //normal enviroments in sane situations
	        return setTimeout(fun, 0);
	    }
	    // if setTimeout wasn't available but was latter defined
	    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
	        cachedSetTimeout = setTimeout;
	        return setTimeout(fun, 0);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedSetTimeout(fun, 0);
	    } catch (e) {
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
	            return cachedSetTimeout.call(null, fun, 0);
	        } catch (e) {
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
	            return cachedSetTimeout.call(this, fun, 0);
	        }
	    }
	}
	function runClearTimeout(marker) {
	    if (cachedClearTimeout === clearTimeout) {
	        //normal enviroments in sane situations
	        return clearTimeout(marker);
	    }
	    // if clearTimeout wasn't available but was latter defined
	    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
	        cachedClearTimeout = clearTimeout;
	        return clearTimeout(marker);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedClearTimeout(marker);
	    } catch (e) {
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
	            return cachedClearTimeout.call(null, marker);
	        } catch (e) {
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
	            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
	            return cachedClearTimeout.call(this, marker);
	        }
	    }
	}
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = runTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while (len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    runClearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        runTimeout(drainQueue);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;
	process.prependListener = noop;
	process.prependOnceListener = noop;

	process.listeners = function (name) {
	    return [];
	};

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () {
	    return '/';
	};
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function () {
	    return 0;
	};

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var root_1 = __webpack_require__(18);
	var observable_1 = __webpack_require__(20);
	var toSubscriber_1 = __webpack_require__(21);
	/**
	 * A representation of any set of values over any amount of time. This the most basic building block
	 * of RxJS.
	 *
	 * @class Observable<T>
	 */
	var Observable = function () {
	    /**
	     * @constructor
	     * @param {Function} subscribe the function that is  called when the Observable is
	     * initially subscribed to. This function is given a Subscriber, to which new values
	     * can be `next`ed, or an `error` method can be called to raise an error, or
	     * `complete` can be called to notify of a successful completion.
	     */
	    function Observable(subscribe) {
	        this._isScalar = false;
	        if (subscribe) {
	            this._subscribe = subscribe;
	        }
	    }
	    /**
	     * Creates a new Observable, with this Observable as the source, and the passed
	     * operator defined as the new observable's operator.
	     * @method lift
	     * @param {Operator} operator the operator defining the operation to take on the observable
	     * @return {Observable} a new observable with the Operator applied
	     */
	    Observable.prototype.lift = function (operator) {
	        var observable = new Observable();
	        observable.source = this;
	        observable.operator = operator;
	        return observable;
	    };
	    /**
	     * Registers handlers for handling emitted values, error and completions from the observable, and
	     *  executes the observable's subscriber function, which will take action to set up the underlying data stream
	     * @method subscribe
	     * @param {PartialObserver|Function} observerOrNext (optional) either an observer defining all functions to be called,
	     *  or the first of three possible handlers, which is the handler for each value emitted from the observable.
	     * @param {Function} error (optional) a handler for a terminal event resulting from an error. If no error handler is provided,
	     *  the error will be thrown as unhandled
	     * @param {Function} complete (optional) a handler for a terminal event resulting from successful completion.
	     * @return {Subscription} a subscription reference to the registered handlers
	     */
	    Observable.prototype.subscribe = function (observerOrNext, error, complete) {
	        var operator = this.operator;
	        var subscriber = toSubscriber_1.toSubscriber(observerOrNext, error, complete);
	        if (operator) {
	            subscriber.add(this._subscribe(operator.call(subscriber)));
	        } else {
	            subscriber.add(this._subscribe(subscriber));
	        }
	        if (subscriber.syncErrorThrowable) {
	            subscriber.syncErrorThrowable = false;
	            if (subscriber.syncErrorThrown) {
	                throw subscriber.syncErrorValue;
	            }
	        }
	        return subscriber;
	    };
	    /**
	     * @method forEach
	     * @param {Function} next a handler for each value emitted by the observable
	     * @param {PromiseConstructor} [PromiseCtor] a constructor function used to instantiate the Promise
	     * @return {Promise} a promise that either resolves on observable completion or
	     *  rejects with the handled error
	     */
	    Observable.prototype.forEach = function (next, PromiseCtor) {
	        var _this = this;
	        if (!PromiseCtor) {
	            if (root_1.root.Rx && root_1.root.Rx.config && root_1.root.Rx.config.Promise) {
	                PromiseCtor = root_1.root.Rx.config.Promise;
	            } else if (root_1.root.Promise) {
	                PromiseCtor = root_1.root.Promise;
	            }
	        }
	        if (!PromiseCtor) {
	            throw new Error('no Promise impl found');
	        }
	        return new PromiseCtor(function (resolve, reject) {
	            var subscription = _this.subscribe(function (value) {
	                if (subscription) {
	                    // if there is a subscription, then we can surmise
	                    // the next handling is asynchronous. Any errors thrown
	                    // need to be rejected explicitly and unsubscribe must be
	                    // called manually
	                    try {
	                        next(value);
	                    } catch (err) {
	                        reject(err);
	                        subscription.unsubscribe();
	                    }
	                } else {
	                    // if there is NO subscription, then we're getting a nexted
	                    // value synchronously during subscription. We can just call it.
	                    // If it errors, Observable's `subscribe` imple will ensure the
	                    // unsubscription logic is called, then synchronously rethrow the error.
	                    // After that, Promise will trap the error and send it
	                    // down the rejection path.
	                    next(value);
	                }
	            }, reject, resolve);
	        });
	    };
	    Observable.prototype._subscribe = function (subscriber) {
	        return this.source.subscribe(subscriber);
	    };
	    /**
	     * An interop point defined by the es7-observable spec https://github.com/zenparsing/es-observable
	     * @method Symbol.observable
	     * @return {Observable} this instance of the observable
	     */
	    Observable.prototype[observable_1.$$observable] = function () {
	        return this;
	    };
	    // HACK: Since TypeScript inherits static properties too, we have to
	    // fight against TypeScript here so Subject can have a different static create signature
	    /**
	     * Creates a new cold Observable by calling the Observable constructor
	     * @static true
	     * @owner Observable
	     * @method create
	     * @param {Function} subscribe? the subscriber function to be passed to the Observable constructor
	     * @return {Observable} a new cold observable
	     */
	    Observable.create = function (subscribe) {
	        return new Observable(subscribe);
	    };
	    return Observable;
	}();
	exports.Observable = Observable;
	//# sourceMappingURL=Observable.js.map

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module, global) {"use strict";

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var objectTypes = {
	    'boolean': false,
	    'function': true,
	    'object': true,
	    'number': false,
	    'string': false,
	    'undefined': false
	};
	exports.root = objectTypes[typeof self === 'undefined' ? 'undefined' : _typeof(self)] && self || objectTypes[typeof window === 'undefined' ? 'undefined' : _typeof(window)] && window;
	/* tslint:disable:no-unused-variable */
	var freeExports = objectTypes[ false ? 'undefined' : _typeof(exports)] && exports && !exports.nodeType && exports;
	var freeModule = objectTypes[ false ? 'undefined' : _typeof(module)] && module && !module.nodeType && module;
	var freeGlobal = objectTypes[typeof global === 'undefined' ? 'undefined' : _typeof(global)] && global;
	if (freeGlobal && (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal)) {
	    exports.root = freeGlobal;
	}
	//# sourceMappingURL=root.js.map
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(19)(module), (function() { return this; }())))

/***/ },
/* 19 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function (module) {
		if (!module.webpackPolyfill) {
			module.deprecate = function () {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	};

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var root_1 = __webpack_require__(18);
	var _Symbol = root_1.root.Symbol;
	if (typeof _Symbol === 'function') {
	    if (!_Symbol.observable) {
	        if (typeof _Symbol.for === 'function') {
	            exports.$$observable = _Symbol.for('observable');
	        } else {
	            exports.$$observable = _Symbol('observable');
	        }
	        _Symbol.observable = exports.$$observable;
	    }
	} else {
	    exports.$$observable = '@@observable';
	}
	//# sourceMappingURL=observable.js.map

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var Subscriber_1 = __webpack_require__(22);
	var rxSubscriber_1 = __webpack_require__(29);
	function toSubscriber(nextOrObserver, error, complete) {
	    if (nextOrObserver && (typeof nextOrObserver === 'undefined' ? 'undefined' : _typeof(nextOrObserver)) === 'object') {
	        if (nextOrObserver instanceof Subscriber_1.Subscriber) {
	            return nextOrObserver;
	        } else if (typeof nextOrObserver[rxSubscriber_1.$$rxSubscriber] === 'function') {
	            return nextOrObserver[rxSubscriber_1.$$rxSubscriber]();
	        }
	    }
	    return new Subscriber_1.Subscriber(nextOrObserver, error, complete);
	}
	exports.toSubscriber = toSubscriber;
	//# sourceMappingURL=toSubscriber.js.map

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var __extends = undefined && undefined.__extends || function (d, b) {
	    for (var p in b) {
	        if (b.hasOwnProperty(p)) d[p] = b[p];
	    }function __() {
	        this.constructor = d;
	    }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var isFunction_1 = __webpack_require__(23);
	var Subscription_1 = __webpack_require__(24);
	var rxSubscriber_1 = __webpack_require__(29);
	var Observer_1 = __webpack_require__(30);
	var Subscriber = function (_super) {
	    __extends(Subscriber, _super);
	    function Subscriber(destinationOrNext, error, complete) {
	        _super.call(this);
	        this.syncErrorValue = null;
	        this.syncErrorThrown = false;
	        this.syncErrorThrowable = false;
	        this.isStopped = false;
	        switch (arguments.length) {
	            case 0:
	                this.destination = Observer_1.empty;
	                break;
	            case 1:
	                if (!destinationOrNext) {
	                    this.destination = Observer_1.empty;
	                    break;
	                }
	                if ((typeof destinationOrNext === 'undefined' ? 'undefined' : _typeof(destinationOrNext)) === 'object') {
	                    if (destinationOrNext instanceof Subscriber) {
	                        this.destination = destinationOrNext;
	                    } else {
	                        this.syncErrorThrowable = true;
	                        this.destination = new SafeSubscriber(this, destinationOrNext);
	                    }
	                    break;
	                }
	            default:
	                this.syncErrorThrowable = true;
	                this.destination = new SafeSubscriber(this, destinationOrNext, error, complete);
	                break;
	        }
	    }
	    Subscriber.create = function (next, error, complete) {
	        var subscriber = new Subscriber(next, error, complete);
	        subscriber.syncErrorThrowable = false;
	        return subscriber;
	    };
	    Subscriber.prototype.next = function (value) {
	        if (!this.isStopped) {
	            this._next(value);
	        }
	    };
	    Subscriber.prototype.error = function (err) {
	        if (!this.isStopped) {
	            this.isStopped = true;
	            this._error(err);
	        }
	    };
	    Subscriber.prototype.complete = function () {
	        if (!this.isStopped) {
	            this.isStopped = true;
	            this._complete();
	        }
	    };
	    Subscriber.prototype.unsubscribe = function () {
	        if (this.isUnsubscribed) {
	            return;
	        }
	        this.isStopped = true;
	        _super.prototype.unsubscribe.call(this);
	    };
	    Subscriber.prototype._next = function (value) {
	        this.destination.next(value);
	    };
	    Subscriber.prototype._error = function (err) {
	        this.destination.error(err);
	        this.unsubscribe();
	    };
	    Subscriber.prototype._complete = function () {
	        this.destination.complete();
	        this.unsubscribe();
	    };
	    Subscriber.prototype[rxSubscriber_1.$$rxSubscriber] = function () {
	        return this;
	    };
	    return Subscriber;
	}(Subscription_1.Subscription);
	exports.Subscriber = Subscriber;
	var SafeSubscriber = function (_super) {
	    __extends(SafeSubscriber, _super);
	    function SafeSubscriber(_parent, observerOrNext, error, complete) {
	        _super.call(this);
	        this._parent = _parent;
	        var next;
	        var context = this;
	        if (isFunction_1.isFunction(observerOrNext)) {
	            next = observerOrNext;
	        } else if (observerOrNext) {
	            context = observerOrNext;
	            next = observerOrNext.next;
	            error = observerOrNext.error;
	            complete = observerOrNext.complete;
	        }
	        this._context = context;
	        this._next = next;
	        this._error = error;
	        this._complete = complete;
	    }
	    SafeSubscriber.prototype.next = function (value) {
	        if (!this.isStopped && this._next) {
	            var _parent = this._parent;
	            if (!_parent.syncErrorThrowable) {
	                this.__tryOrUnsub(this._next, value);
	            } else if (this.__tryOrSetError(_parent, this._next, value)) {
	                this.unsubscribe();
	            }
	        }
	    };
	    SafeSubscriber.prototype.error = function (err) {
	        if (!this.isStopped) {
	            var _parent = this._parent;
	            if (this._error) {
	                if (!_parent.syncErrorThrowable) {
	                    this.__tryOrUnsub(this._error, err);
	                    this.unsubscribe();
	                } else {
	                    this.__tryOrSetError(_parent, this._error, err);
	                    this.unsubscribe();
	                }
	            } else if (!_parent.syncErrorThrowable) {
	                this.unsubscribe();
	                throw err;
	            } else {
	                _parent.syncErrorValue = err;
	                _parent.syncErrorThrown = true;
	                this.unsubscribe();
	            }
	        }
	    };
	    SafeSubscriber.prototype.complete = function () {
	        if (!this.isStopped) {
	            var _parent = this._parent;
	            if (this._complete) {
	                if (!_parent.syncErrorThrowable) {
	                    this.__tryOrUnsub(this._complete);
	                    this.unsubscribe();
	                } else {
	                    this.__tryOrSetError(_parent, this._complete);
	                    this.unsubscribe();
	                }
	            } else {
	                this.unsubscribe();
	            }
	        }
	    };
	    SafeSubscriber.prototype.__tryOrUnsub = function (fn, value) {
	        try {
	            fn.call(this._context, value);
	        } catch (err) {
	            this.unsubscribe();
	            throw err;
	        }
	    };
	    SafeSubscriber.prototype.__tryOrSetError = function (parent, fn, value) {
	        try {
	            fn.call(this._context, value);
	        } catch (err) {
	            parent.syncErrorValue = err;
	            parent.syncErrorThrown = true;
	            return true;
	        }
	        return false;
	    };
	    SafeSubscriber.prototype._unsubscribe = function () {
	        var _parent = this._parent;
	        this._context = null;
	        this._parent = null;
	        _parent.unsubscribe();
	    };
	    return SafeSubscriber;
	}(Subscriber);
	//# sourceMappingURL=Subscriber.js.map

/***/ },
/* 23 */
/***/ function(module, exports) {

	"use strict";

	function isFunction(x) {
	    return typeof x === 'function';
	}
	exports.isFunction = isFunction;
	//# sourceMappingURL=isFunction.js.map

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var __extends = undefined && undefined.__extends || function (d, b) {
	    for (var p in b) {
	        if (b.hasOwnProperty(p)) d[p] = b[p];
	    }function __() {
	        this.constructor = d;
	    }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var isArray_1 = __webpack_require__(25);
	var isObject_1 = __webpack_require__(26);
	var isFunction_1 = __webpack_require__(23);
	var tryCatch_1 = __webpack_require__(27);
	var errorObject_1 = __webpack_require__(28);
	var Subscription = function () {
	    function Subscription(_unsubscribe) {
	        this.isUnsubscribed = false;
	        if (_unsubscribe) {
	            this._unsubscribe = _unsubscribe;
	        }
	    }
	    Subscription.prototype.unsubscribe = function () {
	        var hasErrors = false;
	        var errors;
	        if (this.isUnsubscribed) {
	            return;
	        }
	        this.isUnsubscribed = true;
	        var _a = this,
	            _unsubscribe = _a._unsubscribe,
	            _subscriptions = _a._subscriptions;
	        this._subscriptions = null;
	        if (isFunction_1.isFunction(_unsubscribe)) {
	            var trial = tryCatch_1.tryCatch(_unsubscribe).call(this);
	            if (trial === errorObject_1.errorObject) {
	                hasErrors = true;
	                (errors = errors || []).push(errorObject_1.errorObject.e);
	            }
	        }
	        if (isArray_1.isArray(_subscriptions)) {
	            var index = -1;
	            var len = _subscriptions.length;
	            while (++index < len) {
	                var sub = _subscriptions[index];
	                if (isObject_1.isObject(sub)) {
	                    var trial = tryCatch_1.tryCatch(sub.unsubscribe).call(sub);
	                    if (trial === errorObject_1.errorObject) {
	                        hasErrors = true;
	                        errors = errors || [];
	                        var err = errorObject_1.errorObject.e;
	                        if (err instanceof UnsubscriptionError) {
	                            errors = errors.concat(err.errors);
	                        } else {
	                            errors.push(err);
	                        }
	                    }
	                }
	            }
	        }
	        if (hasErrors) {
	            throw new UnsubscriptionError(errors);
	        }
	    };
	    Subscription.prototype.add = function (subscription) {
	        // return early if:
	        //  1. the subscription is null
	        //  2. we're attempting to add our this
	        //  3. we're attempting to add the static `empty` Subscription
	        if (!subscription || subscription === this || subscription === Subscription.EMPTY) {
	            return;
	        }
	        var sub = subscription;
	        switch (typeof subscription === 'undefined' ? 'undefined' : _typeof(subscription)) {
	            case 'function':
	                sub = new Subscription(subscription);
	            case 'object':
	                if (sub.isUnsubscribed || typeof sub.unsubscribe !== 'function') {
	                    break;
	                } else if (this.isUnsubscribed) {
	                    sub.unsubscribe();
	                } else {
	                    (this._subscriptions || (this._subscriptions = [])).push(sub);
	                }
	                break;
	            default:
	                throw new Error('Unrecognized subscription ' + subscription + ' added to Subscription.');
	        }
	    };
	    Subscription.prototype.remove = function (subscription) {
	        // return early if:
	        //  1. the subscription is null
	        //  2. we're attempting to remove ourthis
	        //  3. we're attempting to remove the static `empty` Subscription
	        if (subscription == null || subscription === this || subscription === Subscription.EMPTY) {
	            return;
	        }
	        var subscriptions = this._subscriptions;
	        if (subscriptions) {
	            var subscriptionIndex = subscriptions.indexOf(subscription);
	            if (subscriptionIndex !== -1) {
	                subscriptions.splice(subscriptionIndex, 1);
	            }
	        }
	    };
	    Subscription.EMPTY = function (empty) {
	        empty.isUnsubscribed = true;
	        return empty;
	    }(new Subscription());
	    return Subscription;
	}();
	exports.Subscription = Subscription;
	var UnsubscriptionError = function (_super) {
	    __extends(UnsubscriptionError, _super);
	    function UnsubscriptionError(errors) {
	        _super.call(this, 'unsubscriptoin error(s)');
	        this.errors = errors;
	        this.name = 'UnsubscriptionError';
	    }
	    return UnsubscriptionError;
	}(Error);
	exports.UnsubscriptionError = UnsubscriptionError;
	//# sourceMappingURL=Subscription.js.map

/***/ },
/* 25 */
/***/ function(module, exports) {

	"use strict";

	exports.isArray = Array.isArray || function (x) {
	  return x && typeof x.length === 'number';
	};
	//# sourceMappingURL=isArray.js.map

/***/ },
/* 26 */
/***/ function(module, exports) {

	"use strict";

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	function isObject(x) {
	    return x != null && (typeof x === "undefined" ? "undefined" : _typeof(x)) === 'object';
	}
	exports.isObject = isObject;
	//# sourceMappingURL=isObject.js.map

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var errorObject_1 = __webpack_require__(28);
	var tryCatchTarget;
	function tryCatcher() {
	    try {
	        return tryCatchTarget.apply(this, arguments);
	    } catch (e) {
	        errorObject_1.errorObject.e = e;
	        return errorObject_1.errorObject;
	    }
	}
	function tryCatch(fn) {
	    tryCatchTarget = fn;
	    return tryCatcher;
	}
	exports.tryCatch = tryCatch;
	;
	//# sourceMappingURL=tryCatch.js.map

/***/ },
/* 28 */
/***/ function(module, exports) {

	"use strict";
	// typeof any so that it we don't have to cast when comparing a result to the error object

	exports.errorObject = { e: {} };
	//# sourceMappingURL=errorObject.js.map

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var root_1 = __webpack_require__(18);
	var _Symbol = root_1.root.Symbol;
	/**
	 * rxSubscriber symbol is a symbol for retrieving an "Rx safe" Observer from an object
	 * "Rx safety" can be defined as an object that has all of the traits of an Rx Subscriber,
	 * including the ability to add and remove subscriptions to the subscription chain and
	 * guarantees involving event triggering (can't "next" after unsubscription, etc).
	 */
	exports.$$rxSubscriber = typeof _Symbol === 'function' && typeof _Symbol.for === 'function' ? _Symbol.for('rxSubscriber') : '@@rxSubscriber';
	//# sourceMappingURL=rxSubscriber.js.map

/***/ },
/* 30 */
/***/ function(module, exports) {

	"use strict";

	exports.empty = {
	    isUnsubscribed: true,
	    next: function next(value) {},
	    error: function error(err) {
	        throw err;
	    },
	    complete: function complete() {}
	};
	//# sourceMappingURL=Observer.js.map

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var __extends = undefined && undefined.__extends || function (d, b) {
	    for (var p in b) {
	        if (b.hasOwnProperty(p)) d[p] = b[p];
	    }function __() {
	        this.constructor = d;
	    }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var Subject_1 = __webpack_require__(32);
	var throwError_1 = __webpack_require__(34);
	var ObjectUnsubscribedError_1 = __webpack_require__(35);
	/**
	 * @class BehaviorSubject<T>
	 */
	var BehaviorSubject = function (_super) {
	    __extends(BehaviorSubject, _super);
	    function BehaviorSubject(_value) {
	        _super.call(this);
	        this._value = _value;
	    }
	    BehaviorSubject.prototype.getValue = function () {
	        if (this.hasErrored) {
	            throwError_1.throwError(this.errorValue);
	        } else if (this.isUnsubscribed) {
	            throwError_1.throwError(new ObjectUnsubscribedError_1.ObjectUnsubscribedError());
	        } else {
	            return this._value;
	        }
	    };
	    Object.defineProperty(BehaviorSubject.prototype, "value", {
	        get: function get() {
	            return this.getValue();
	        },
	        enumerable: true,
	        configurable: true
	    });
	    BehaviorSubject.prototype._subscribe = function (subscriber) {
	        var subscription = _super.prototype._subscribe.call(this, subscriber);
	        if (subscription && !subscription.isUnsubscribed) {
	            subscriber.next(this._value);
	        }
	        return subscription;
	    };
	    BehaviorSubject.prototype._next = function (value) {
	        _super.prototype._next.call(this, this._value = value);
	    };
	    BehaviorSubject.prototype._error = function (err) {
	        this.hasErrored = true;
	        _super.prototype._error.call(this, this.errorValue = err);
	    };
	    return BehaviorSubject;
	}(Subject_1.Subject);
	exports.BehaviorSubject = BehaviorSubject;
	//# sourceMappingURL=BehaviorSubject.js.map

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var __extends = undefined && undefined.__extends || function (d, b) {
	    for (var p in b) {
	        if (b.hasOwnProperty(p)) d[p] = b[p];
	    }function __() {
	        this.constructor = d;
	    }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var Observable_1 = __webpack_require__(17);
	var Subscriber_1 = __webpack_require__(22);
	var Subscription_1 = __webpack_require__(24);
	var SubjectSubscription_1 = __webpack_require__(33);
	var rxSubscriber_1 = __webpack_require__(29);
	var throwError_1 = __webpack_require__(34);
	var ObjectUnsubscribedError_1 = __webpack_require__(35);
	/**
	 * @class Subject<T>
	 */
	var Subject = function (_super) {
	    __extends(Subject, _super);
	    function Subject(destination, source) {
	        _super.call(this);
	        this.destination = destination;
	        this.source = source;
	        this.observers = [];
	        this.isUnsubscribed = false;
	        this.isStopped = false;
	        this.hasErrored = false;
	        this.dispatching = false;
	        this.hasCompleted = false;
	        this.source = source;
	    }
	    Subject.prototype.lift = function (operator) {
	        var subject = new Subject(this.destination || this, this);
	        subject.operator = operator;
	        return subject;
	    };
	    Subject.prototype.add = function (subscription) {
	        Subscription_1.Subscription.prototype.add.call(this, subscription);
	    };
	    Subject.prototype.remove = function (subscription) {
	        Subscription_1.Subscription.prototype.remove.call(this, subscription);
	    };
	    Subject.prototype.unsubscribe = function () {
	        Subscription_1.Subscription.prototype.unsubscribe.call(this);
	    };
	    Subject.prototype._subscribe = function (subscriber) {
	        if (this.source) {
	            return this.source.subscribe(subscriber);
	        } else {
	            if (subscriber.isUnsubscribed) {
	                return;
	            } else if (this.hasErrored) {
	                return subscriber.error(this.errorValue);
	            } else if (this.hasCompleted) {
	                return subscriber.complete();
	            }
	            this.throwIfUnsubscribed();
	            var subscription = new SubjectSubscription_1.SubjectSubscription(this, subscriber);
	            this.observers.push(subscriber);
	            return subscription;
	        }
	    };
	    Subject.prototype._unsubscribe = function () {
	        this.source = null;
	        this.isStopped = true;
	        this.observers = null;
	        this.destination = null;
	    };
	    Subject.prototype.next = function (value) {
	        this.throwIfUnsubscribed();
	        if (this.isStopped) {
	            return;
	        }
	        this.dispatching = true;
	        this._next(value);
	        this.dispatching = false;
	        if (this.hasErrored) {
	            this._error(this.errorValue);
	        } else if (this.hasCompleted) {
	            this._complete();
	        }
	    };
	    Subject.prototype.error = function (err) {
	        this.throwIfUnsubscribed();
	        if (this.isStopped) {
	            return;
	        }
	        this.isStopped = true;
	        this.hasErrored = true;
	        this.errorValue = err;
	        if (this.dispatching) {
	            return;
	        }
	        this._error(err);
	    };
	    Subject.prototype.complete = function () {
	        this.throwIfUnsubscribed();
	        if (this.isStopped) {
	            return;
	        }
	        this.isStopped = true;
	        this.hasCompleted = true;
	        if (this.dispatching) {
	            return;
	        }
	        this._complete();
	    };
	    Subject.prototype.asObservable = function () {
	        var observable = new SubjectObservable(this);
	        return observable;
	    };
	    Subject.prototype._next = function (value) {
	        if (this.destination) {
	            this.destination.next(value);
	        } else {
	            this._finalNext(value);
	        }
	    };
	    Subject.prototype._finalNext = function (value) {
	        var index = -1;
	        var observers = this.observers.slice(0);
	        var len = observers.length;
	        while (++index < len) {
	            observers[index].next(value);
	        }
	    };
	    Subject.prototype._error = function (err) {
	        if (this.destination) {
	            this.destination.error(err);
	        } else {
	            this._finalError(err);
	        }
	    };
	    Subject.prototype._finalError = function (err) {
	        var index = -1;
	        var observers = this.observers;
	        // optimization to block our SubjectSubscriptions from
	        // splicing themselves out of the observers list one by one.
	        this.observers = null;
	        this.isUnsubscribed = true;
	        if (observers) {
	            var len = observers.length;
	            while (++index < len) {
	                observers[index].error(err);
	            }
	        }
	        this.isUnsubscribed = false;
	        this.unsubscribe();
	    };
	    Subject.prototype._complete = function () {
	        if (this.destination) {
	            this.destination.complete();
	        } else {
	            this._finalComplete();
	        }
	    };
	    Subject.prototype._finalComplete = function () {
	        var index = -1;
	        var observers = this.observers;
	        // optimization to block our SubjectSubscriptions from
	        // splicing themselves out of the observers list one by one.
	        this.observers = null;
	        this.isUnsubscribed = true;
	        if (observers) {
	            var len = observers.length;
	            while (++index < len) {
	                observers[index].complete();
	            }
	        }
	        this.isUnsubscribed = false;
	        this.unsubscribe();
	    };
	    Subject.prototype.throwIfUnsubscribed = function () {
	        if (this.isUnsubscribed) {
	            throwError_1.throwError(new ObjectUnsubscribedError_1.ObjectUnsubscribedError());
	        }
	    };
	    Subject.prototype[rxSubscriber_1.$$rxSubscriber] = function () {
	        return new Subscriber_1.Subscriber(this);
	    };
	    Subject.create = function (destination, source) {
	        return new Subject(destination, source);
	    };
	    return Subject;
	}(Observable_1.Observable);
	exports.Subject = Subject;
	/**
	 * We need this JSDoc comment for affecting ESDoc.
	 * @ignore
	 * @extends {Ignored}
	 */
	var SubjectObservable = function (_super) {
	    __extends(SubjectObservable, _super);
	    function SubjectObservable(source) {
	        _super.call(this);
	        this.source = source;
	    }
	    return SubjectObservable;
	}(Observable_1.Observable);
	//# sourceMappingURL=Subject.js.map

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var __extends = undefined && undefined.__extends || function (d, b) {
	    for (var p in b) {
	        if (b.hasOwnProperty(p)) d[p] = b[p];
	    }function __() {
	        this.constructor = d;
	    }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var Subscription_1 = __webpack_require__(24);
	var SubjectSubscription = function (_super) {
	    __extends(SubjectSubscription, _super);
	    function SubjectSubscription(subject, observer) {
	        _super.call(this);
	        this.subject = subject;
	        this.observer = observer;
	        this.isUnsubscribed = false;
	    }
	    SubjectSubscription.prototype.unsubscribe = function () {
	        if (this.isUnsubscribed) {
	            return;
	        }
	        this.isUnsubscribed = true;
	        var subject = this.subject;
	        var observers = subject.observers;
	        this.subject = null;
	        if (!observers || observers.length === 0 || subject.isUnsubscribed) {
	            return;
	        }
	        var subscriberIndex = observers.indexOf(this.observer);
	        if (subscriberIndex !== -1) {
	            observers.splice(subscriberIndex, 1);
	        }
	    };
	    return SubjectSubscription;
	}(Subscription_1.Subscription);
	exports.SubjectSubscription = SubjectSubscription;
	//# sourceMappingURL=SubjectSubscription.js.map

/***/ },
/* 34 */
/***/ function(module, exports) {

	"use strict";

	function throwError(e) {
	  throw e;
	}
	exports.throwError = throwError;
	//# sourceMappingURL=throwError.js.map

/***/ },
/* 35 */
/***/ function(module, exports) {

	"use strict";

	var __extends = undefined && undefined.__extends || function (d, b) {
	    for (var p in b) {
	        if (b.hasOwnProperty(p)) d[p] = b[p];
	    }function __() {
	        this.constructor = d;
	    }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	/**
	 * an error thrown when an action is invalid because the object
	 * has been unsubscribed
	 */
	var ObjectUnsubscribedError = function (_super) {
	    __extends(ObjectUnsubscribedError, _super);
	    function ObjectUnsubscribedError() {
	        _super.call(this, 'object unsubscribed');
	        this.name = 'ObjectUnsubscribedError';
	    }
	    return ObjectUnsubscribedError;
	}(Error);
	exports.ObjectUnsubscribedError = ObjectUnsubscribedError;
	//# sourceMappingURL=ObjectUnsubscribedError.js.map

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var Observable_1 = __webpack_require__(17);
	var switchMap_1 = __webpack_require__(37);
	Observable_1.Observable.prototype.switchMap = switchMap_1.switchMap;
	//# sourceMappingURL=switchMap.js.map

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var __extends = undefined && undefined.__extends || function (d, b) {
	    for (var p in b) {
	        if (b.hasOwnProperty(p)) d[p] = b[p];
	    }function __() {
	        this.constructor = d;
	    }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var OuterSubscriber_1 = __webpack_require__(38);
	var subscribeToResult_1 = __webpack_require__(39);
	/**
	 * Returns a new Observable by applying a function that you supply to each item emitted by the source Observable that
	 * returns an Observable, and then emitting the items emitted by the most recently emitted of these Observables.
	 *
	 * <img src="./img/switchMap.png" width="100%">
	 *
	 * @param {Observable} a function that, when applied to an item emitted by the source Observable, returns an Observable.
	 * @return {Observable} an Observable that emits the items emitted by the Observable returned from applying func to
	 * the most recently emitted item emitted by the source Observable.
	 * @method switchMap
	 * @owner Observable
	 */
	function switchMap(project, resultSelector) {
	    return this.lift(new SwitchMapOperator(project, resultSelector));
	}
	exports.switchMap = switchMap;
	var SwitchMapOperator = function () {
	    function SwitchMapOperator(project, resultSelector) {
	        this.project = project;
	        this.resultSelector = resultSelector;
	    }
	    SwitchMapOperator.prototype.call = function (subscriber) {
	        return new SwitchMapSubscriber(subscriber, this.project, this.resultSelector);
	    };
	    return SwitchMapOperator;
	}();
	var SwitchMapSubscriber = function (_super) {
	    __extends(SwitchMapSubscriber, _super);
	    function SwitchMapSubscriber(destination, project, resultSelector) {
	        _super.call(this, destination);
	        this.project = project;
	        this.resultSelector = resultSelector;
	        this.index = 0;
	    }
	    SwitchMapSubscriber.prototype._next = function (value) {
	        var result;
	        var index = this.index++;
	        try {
	            result = this.project(value, index);
	        } catch (error) {
	            this.destination.error(error);
	            return;
	        }
	        this._innerSub(result, value, index);
	    };
	    SwitchMapSubscriber.prototype._innerSub = function (result, value, index) {
	        var innerSubscription = this.innerSubscription;
	        if (innerSubscription) {
	            innerSubscription.unsubscribe();
	        }
	        this.add(this.innerSubscription = subscribeToResult_1.subscribeToResult(this, result, value, index));
	    };
	    SwitchMapSubscriber.prototype._complete = function () {
	        var innerSubscription = this.innerSubscription;
	        if (!innerSubscription || innerSubscription.isUnsubscribed) {
	            _super.prototype._complete.call(this);
	        }
	    };
	    SwitchMapSubscriber.prototype._unsubscribe = function () {
	        this.innerSubscription = null;
	    };
	    SwitchMapSubscriber.prototype.notifyComplete = function (innerSub) {
	        this.remove(innerSub);
	        this.innerSubscription = null;
	        if (this.isStopped) {
	            _super.prototype._complete.call(this);
	        }
	    };
	    SwitchMapSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
	        if (this.resultSelector) {
	            this._tryNotifyNext(outerValue, innerValue, outerIndex, innerIndex);
	        } else {
	            this.destination.next(innerValue);
	        }
	    };
	    SwitchMapSubscriber.prototype._tryNotifyNext = function (outerValue, innerValue, outerIndex, innerIndex) {
	        var result;
	        try {
	            result = this.resultSelector(outerValue, innerValue, outerIndex, innerIndex);
	        } catch (err) {
	            this.destination.error(err);
	            return;
	        }
	        this.destination.next(result);
	    };
	    return SwitchMapSubscriber;
	}(OuterSubscriber_1.OuterSubscriber);
	//# sourceMappingURL=switchMap.js.map

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var __extends = undefined && undefined.__extends || function (d, b) {
	    for (var p in b) {
	        if (b.hasOwnProperty(p)) d[p] = b[p];
	    }function __() {
	        this.constructor = d;
	    }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var Subscriber_1 = __webpack_require__(22);
	var OuterSubscriber = function (_super) {
	    __extends(OuterSubscriber, _super);
	    function OuterSubscriber() {
	        _super.apply(this, arguments);
	    }
	    OuterSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
	        this.destination.next(innerValue);
	    };
	    OuterSubscriber.prototype.notifyError = function (error, innerSub) {
	        this.destination.error(error);
	    };
	    OuterSubscriber.prototype.notifyComplete = function (innerSub) {
	        this.destination.complete();
	    };
	    return OuterSubscriber;
	}(Subscriber_1.Subscriber);
	exports.OuterSubscriber = OuterSubscriber;
	//# sourceMappingURL=OuterSubscriber.js.map

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var root_1 = __webpack_require__(18);
	var isArray_1 = __webpack_require__(25);
	var isPromise_1 = __webpack_require__(40);
	var Observable_1 = __webpack_require__(17);
	var iterator_1 = __webpack_require__(41);
	var observable_1 = __webpack_require__(20);
	var InnerSubscriber_1 = __webpack_require__(42);
	function subscribeToResult(outerSubscriber, result, outerValue, outerIndex) {
	    var destination = new InnerSubscriber_1.InnerSubscriber(outerSubscriber, outerValue, outerIndex);
	    if (destination.isUnsubscribed) {
	        return;
	    }
	    if (result instanceof Observable_1.Observable) {
	        if (result._isScalar) {
	            destination.next(result.value);
	            destination.complete();
	            return;
	        } else {
	            return result.subscribe(destination);
	        }
	    }
	    if (isArray_1.isArray(result)) {
	        for (var i = 0, len = result.length; i < len && !destination.isUnsubscribed; i++) {
	            destination.next(result[i]);
	        }
	        if (!destination.isUnsubscribed) {
	            destination.complete();
	        }
	    } else if (isPromise_1.isPromise(result)) {
	        result.then(function (value) {
	            if (!destination.isUnsubscribed) {
	                destination.next(value);
	                destination.complete();
	            }
	        }, function (err) {
	            return destination.error(err);
	        }).then(null, function (err) {
	            // Escaping the Promise trap: globally throw unhandled errors
	            root_1.root.setTimeout(function () {
	                throw err;
	            });
	        });
	        return destination;
	    } else if (typeof result[iterator_1.$$iterator] === 'function') {
	        for (var _i = 0, result_1 = result; _i < result_1.length; _i++) {
	            var item = result_1[_i];
	            destination.next(item);
	            if (destination.isUnsubscribed) {
	                break;
	            }
	        }
	        if (!destination.isUnsubscribed) {
	            destination.complete();
	        }
	    } else if (typeof result[observable_1.$$observable] === 'function') {
	        var obs = result[observable_1.$$observable]();
	        if (typeof obs.subscribe !== 'function') {
	            destination.error('invalid observable');
	        } else {
	            return obs.subscribe(new InnerSubscriber_1.InnerSubscriber(outerSubscriber, outerValue, outerIndex));
	        }
	    } else {
	        destination.error(new TypeError('unknown type returned'));
	    }
	}
	exports.subscribeToResult = subscribeToResult;
	//# sourceMappingURL=subscribeToResult.js.map

/***/ },
/* 40 */
/***/ function(module, exports) {

	"use strict";

	function isPromise(value) {
	    return value && typeof value.subscribe !== 'function' && typeof value.then === 'function';
	}
	exports.isPromise = isPromise;
	//# sourceMappingURL=isPromise.js.map

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var root_1 = __webpack_require__(18);
	var _Symbol = root_1.root.Symbol;
	if (typeof _Symbol === 'function') {
	    if (_Symbol.iterator) {
	        exports.$$iterator = _Symbol.iterator;
	    } else if (typeof _Symbol.for === 'function') {
	        exports.$$iterator = _Symbol.for('iterator');
	    }
	} else {
	    if (root_1.root.Set && typeof new root_1.root.Set()['@@iterator'] === 'function') {
	        // Bug for mozilla version
	        exports.$$iterator = '@@iterator';
	    } else if (root_1.root.Map) {
	        // es6-shim specific logic
	        var keys = Object.getOwnPropertyNames(root_1.root.Map.prototype);
	        for (var i = 0; i < keys.length; ++i) {
	            var key = keys[i];
	            if (key !== 'entries' && key !== 'size' && root_1.root.Map.prototype[key] === root_1.root.Map.prototype['entries']) {
	                exports.$$iterator = key;
	                break;
	            }
	        }
	    } else {
	        exports.$$iterator = '@@iterator';
	    }
	}
	//# sourceMappingURL=iterator.js.map

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var __extends = undefined && undefined.__extends || function (d, b) {
	    for (var p in b) {
	        if (b.hasOwnProperty(p)) d[p] = b[p];
	    }function __() {
	        this.constructor = d;
	    }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var Subscriber_1 = __webpack_require__(22);
	var InnerSubscriber = function (_super) {
	    __extends(InnerSubscriber, _super);
	    function InnerSubscriber(parent, outerValue, outerIndex) {
	        _super.call(this);
	        this.parent = parent;
	        this.outerValue = outerValue;
	        this.outerIndex = outerIndex;
	        this.index = 0;
	    }
	    InnerSubscriber.prototype._next = function (value) {
	        this.parent.notifyNext(this.outerValue, value, this.outerIndex, this.index++, this);
	    };
	    InnerSubscriber.prototype._error = function (error) {
	        this.parent.notifyError(error, this);
	        this.unsubscribe();
	    };
	    InnerSubscriber.prototype._complete = function () {
	        this.parent.notifyComplete(this);
	        this.unsubscribe();
	    };
	    return InnerSubscriber;
	}(Subscriber_1.Subscriber);
	exports.InnerSubscriber = InnerSubscriber;
	//# sourceMappingURL=InnerSubscriber.js.map

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var Observable_1 = __webpack_require__(17);
	var filter_1 = __webpack_require__(44);
	Observable_1.Observable.prototype.filter = filter_1.filter;
	//# sourceMappingURL=filter.js.map

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var __extends = undefined && undefined.__extends || function (d, b) {
	    for (var p in b) {
	        if (b.hasOwnProperty(p)) d[p] = b[p];
	    }function __() {
	        this.constructor = d;
	    }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var Subscriber_1 = __webpack_require__(22);
	/**
	 * Similar to the well-known `Array.prototype.filter` method, this operator filters values down to a set
	 * allowed by a `select` function
	 *
	 * @param {Function} select a function that is used to select the resulting values
	 *  if it returns `true`, the value is emitted, if `false` the value is not passed to the resulting observable
	 * @param {any} [thisArg] an optional argument to determine the value of `this` in the `select` function
	 * @return {Observable} an observable of values allowed by the select function
	 * @method filter
	 * @owner Observable
	 */
	function filter(select, thisArg) {
	    return this.lift(new FilterOperator(select, thisArg));
	}
	exports.filter = filter;
	var FilterOperator = function () {
	    function FilterOperator(select, thisArg) {
	        this.select = select;
	        this.thisArg = thisArg;
	    }
	    FilterOperator.prototype.call = function (subscriber) {
	        return new FilterSubscriber(subscriber, this.select, this.thisArg);
	    };
	    return FilterOperator;
	}();
	var FilterSubscriber = function (_super) {
	    __extends(FilterSubscriber, _super);
	    function FilterSubscriber(destination, select, thisArg) {
	        _super.call(this, destination);
	        this.select = select;
	        this.thisArg = thisArg;
	        this.count = 0;
	        this.select = select;
	    }
	    // the try catch block below is left specifically for
	    // optimization and perf reasons. a tryCatcher is not necessary here.
	    FilterSubscriber.prototype._next = function (value) {
	        var result;
	        try {
	            result = this.select.call(this.thisArg, value, this.count++);
	        } catch (err) {
	            this.destination.error(err);
	            return;
	        }
	        if (result) {
	            this.destination.next(value);
	        }
	    };
	    return FilterSubscriber;
	}(Subscriber_1.Subscriber);
	//# sourceMappingURL=filter.js.map

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var Observable_1 = __webpack_require__(17);
	var first_1 = __webpack_require__(46);
	Observable_1.Observable.prototype.first = first_1.first;
	//# sourceMappingURL=first.js.map

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var __extends = undefined && undefined.__extends || function (d, b) {
	    for (var p in b) {
	        if (b.hasOwnProperty(p)) d[p] = b[p];
	    }function __() {
	        this.constructor = d;
	    }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var Subscriber_1 = __webpack_require__(22);
	var EmptyError_1 = __webpack_require__(47);
	/**
	 * Returns an Observable that emits the first item of the source Observable that matches the specified condition.
	 * Throws an error if matching element is not found.
	 * @param {function} predicate function called with each item to test for condition matching.
	 * @return {Observable} an Observable of the first item that matches the condition.
	 * @method first
	 * @owner Observable
	 */
	function first(predicate, resultSelector, defaultValue) {
	    return this.lift(new FirstOperator(predicate, resultSelector, defaultValue, this));
	}
	exports.first = first;
	var FirstOperator = function () {
	    function FirstOperator(predicate, resultSelector, defaultValue, source) {
	        this.predicate = predicate;
	        this.resultSelector = resultSelector;
	        this.defaultValue = defaultValue;
	        this.source = source;
	    }
	    FirstOperator.prototype.call = function (observer) {
	        return new FirstSubscriber(observer, this.predicate, this.resultSelector, this.defaultValue, this.source);
	    };
	    return FirstOperator;
	}();
	var FirstSubscriber = function (_super) {
	    __extends(FirstSubscriber, _super);
	    function FirstSubscriber(destination, predicate, resultSelector, defaultValue, source) {
	        _super.call(this, destination);
	        this.predicate = predicate;
	        this.resultSelector = resultSelector;
	        this.defaultValue = defaultValue;
	        this.source = source;
	        this.index = 0;
	        this.hasCompleted = false;
	    }
	    FirstSubscriber.prototype._next = function (value) {
	        var index = this.index++;
	        if (this.predicate) {
	            this._tryPredicate(value, index);
	        } else {
	            this._emit(value, index);
	        }
	    };
	    FirstSubscriber.prototype._tryPredicate = function (value, index) {
	        var result;
	        try {
	            result = this.predicate(value, index, this.source);
	        } catch (err) {
	            this.destination.error(err);
	            return;
	        }
	        if (result) {
	            this._emit(value, index);
	        }
	    };
	    FirstSubscriber.prototype._emit = function (value, index) {
	        if (this.resultSelector) {
	            this._tryResultSelector(value, index);
	            return;
	        }
	        this._emitFinal(value);
	    };
	    FirstSubscriber.prototype._tryResultSelector = function (value, index) {
	        var result;
	        try {
	            result = this.resultSelector(value, index);
	        } catch (err) {
	            this.destination.error(err);
	            return;
	        }
	        this._emitFinal(result);
	    };
	    FirstSubscriber.prototype._emitFinal = function (value) {
	        var destination = this.destination;
	        destination.next(value);
	        destination.complete();
	        this.hasCompleted = true;
	    };
	    FirstSubscriber.prototype._complete = function () {
	        var destination = this.destination;
	        if (!this.hasCompleted && typeof this.defaultValue !== 'undefined') {
	            destination.next(this.defaultValue);
	            destination.complete();
	        } else if (!this.hasCompleted) {
	            destination.error(new EmptyError_1.EmptyError());
	        }
	    };
	    return FirstSubscriber;
	}(Subscriber_1.Subscriber);
	//# sourceMappingURL=first.js.map

/***/ },
/* 47 */
/***/ function(module, exports) {

	"use strict";

	var __extends = undefined && undefined.__extends || function (d, b) {
	    for (var p in b) {
	        if (b.hasOwnProperty(p)) d[p] = b[p];
	    }function __() {
	        this.constructor = d;
	    }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var EmptyError = function (_super) {
	    __extends(EmptyError, _super);
	    function EmptyError() {
	        _super.call(this, 'no elements in sequence');
	        this.name = 'EmptyError';
	    }
	    return EmptyError;
	}(Error);
	exports.EmptyError = EmptyError;
	//# sourceMappingURL=EmptyError.js.map

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var Observable_1 = __webpack_require__(17);
	var delay_1 = __webpack_require__(49);
	Observable_1.Observable.prototype.delay = delay_1.delay;
	//# sourceMappingURL=delay.js.map

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var __extends = undefined && undefined.__extends || function (d, b) {
	    for (var p in b) {
	        if (b.hasOwnProperty(p)) d[p] = b[p];
	    }function __() {
	        this.constructor = d;
	    }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var async_1 = __webpack_require__(50);
	var isDate_1 = __webpack_require__(55);
	var Subscriber_1 = __webpack_require__(22);
	var Notification_1 = __webpack_require__(56);
	/**
	 * Delays the emission of items from the source Observable by a given timeout or
	 * until a given Date.
	 *
	 * <span class="informal">Time order shifts each item by some specified amount of
	 * milliseconds.</span>
	 *
	 * <img src="./img/delay.png" width="100%">
	 *
	 * If the delay argument is a Number, this operator time shifts the source
	 * Observable by that amount of time expressed in milliseconds. The relative
	 * time intervals between the values are preserved.
	 *
	 * If the delay argument is a Date, this operator time shifts the start of the
	 * Observable execution until the given date occurs.
	 *
	 * @example <caption>Delay each click by one second</caption>
	 * var clicks = Rx.Observable.fromEvent(document, 'click');
	 * var delayedClicks = clicks.delay(1000); // each click emitted after 1 second
	 * delayedClicks.subscribe(x => console.log(x));
	 *
	 * @example <caption>Delay all clicks until a future date happens</caption>
	 * var clicks = Rx.Observable.fromEvent(document, 'click');
	 * var date = new Date('March 15, 2050 12:00:00'); // in the future
	 * var delayedClicks = clicks.delay(date); // click emitted only after that date
	 * delayedClicks.subscribe(x => console.log(x));
	 *
	 * @see {@link debounceTime}
	 * @see {@link delayWhen}
	 *
	 * @param {number|Date} delay The delay duration in milliseconds (a `number`) or
	 * a `Date` until which the emission of the source items is delayed.
	 * @param {Scheduler} [scheduler=async] The Scheduler to use for
	 * managing the timers that handle the time-shift for each item.
	 * @return {Observable} An Observable that delays the emissions of the source
	 * Observable by the specified timeout or Date.
	 * @method delay
	 * @owner Observable
	 */
	function delay(delay, scheduler) {
	    if (scheduler === void 0) {
	        scheduler = async_1.async;
	    }
	    var absoluteDelay = isDate_1.isDate(delay);
	    var delayFor = absoluteDelay ? +delay - scheduler.now() : Math.abs(delay);
	    return this.lift(new DelayOperator(delayFor, scheduler));
	}
	exports.delay = delay;
	var DelayOperator = function () {
	    function DelayOperator(delay, scheduler) {
	        this.delay = delay;
	        this.scheduler = scheduler;
	    }
	    DelayOperator.prototype.call = function (subscriber) {
	        return new DelaySubscriber(subscriber, this.delay, this.scheduler);
	    };
	    return DelayOperator;
	}();
	var DelaySubscriber = function (_super) {
	    __extends(DelaySubscriber, _super);
	    function DelaySubscriber(destination, delay, scheduler) {
	        _super.call(this, destination);
	        this.delay = delay;
	        this.scheduler = scheduler;
	        this.queue = [];
	        this.active = false;
	        this.errored = false;
	    }
	    DelaySubscriber.dispatch = function (state) {
	        var source = state.source;
	        var queue = source.queue;
	        var scheduler = state.scheduler;
	        var destination = state.destination;
	        while (queue.length > 0 && queue[0].time - scheduler.now() <= 0) {
	            queue.shift().notification.observe(destination);
	        }
	        if (queue.length > 0) {
	            var delay_1 = Math.max(0, queue[0].time - scheduler.now());
	            this.schedule(state, delay_1);
	        } else {
	            source.active = false;
	        }
	    };
	    DelaySubscriber.prototype._schedule = function (scheduler) {
	        this.active = true;
	        this.add(scheduler.schedule(DelaySubscriber.dispatch, this.delay, {
	            source: this, destination: this.destination, scheduler: scheduler
	        }));
	    };
	    DelaySubscriber.prototype.scheduleNotification = function (notification) {
	        if (this.errored === true) {
	            return;
	        }
	        var scheduler = this.scheduler;
	        var message = new DelayMessage(scheduler.now() + this.delay, notification);
	        this.queue.push(message);
	        if (this.active === false) {
	            this._schedule(scheduler);
	        }
	    };
	    DelaySubscriber.prototype._next = function (value) {
	        this.scheduleNotification(Notification_1.Notification.createNext(value));
	    };
	    DelaySubscriber.prototype._error = function (err) {
	        this.errored = true;
	        this.queue = [];
	        this.destination.error(err);
	    };
	    DelaySubscriber.prototype._complete = function () {
	        this.scheduleNotification(Notification_1.Notification.createComplete());
	    };
	    return DelaySubscriber;
	}(Subscriber_1.Subscriber);
	var DelayMessage = function () {
	    function DelayMessage(time, notification) {
	        this.time = time;
	        this.notification = notification;
	    }
	    return DelayMessage;
	}();
	//# sourceMappingURL=delay.js.map

/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var AsyncScheduler_1 = __webpack_require__(51);
	exports.async = new AsyncScheduler_1.AsyncScheduler();
	//# sourceMappingURL=async.js.map

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var __extends = undefined && undefined.__extends || function (d, b) {
	    for (var p in b) {
	        if (b.hasOwnProperty(p)) d[p] = b[p];
	    }function __() {
	        this.constructor = d;
	    }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var FutureAction_1 = __webpack_require__(52);
	var QueueScheduler_1 = __webpack_require__(53);
	var AsyncScheduler = function (_super) {
	    __extends(AsyncScheduler, _super);
	    function AsyncScheduler() {
	        _super.apply(this, arguments);
	    }
	    AsyncScheduler.prototype.scheduleNow = function (work, state) {
	        return new FutureAction_1.FutureAction(this, work).schedule(state, 0);
	    };
	    return AsyncScheduler;
	}(QueueScheduler_1.QueueScheduler);
	exports.AsyncScheduler = AsyncScheduler;
	//# sourceMappingURL=AsyncScheduler.js.map

/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var __extends = undefined && undefined.__extends || function (d, b) {
	    for (var p in b) {
	        if (b.hasOwnProperty(p)) d[p] = b[p];
	    }function __() {
	        this.constructor = d;
	    }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var root_1 = __webpack_require__(18);
	var Subscription_1 = __webpack_require__(24);
	var FutureAction = function (_super) {
	    __extends(FutureAction, _super);
	    function FutureAction(scheduler, work) {
	        _super.call(this);
	        this.scheduler = scheduler;
	        this.work = work;
	        this.pending = false;
	    }
	    FutureAction.prototype.execute = function () {
	        if (this.isUnsubscribed) {
	            this.error = new Error('executing a cancelled action');
	        } else {
	            try {
	                this.work(this.state);
	            } catch (e) {
	                this.unsubscribe();
	                this.error = e;
	            }
	        }
	    };
	    FutureAction.prototype.schedule = function (state, delay) {
	        if (delay === void 0) {
	            delay = 0;
	        }
	        if (this.isUnsubscribed) {
	            return this;
	        }
	        return this._schedule(state, delay);
	    };
	    FutureAction.prototype._schedule = function (state, delay) {
	        var _this = this;
	        if (delay === void 0) {
	            delay = 0;
	        }
	        // Always replace the current state with the new state.
	        this.state = state;
	        // Set the pending flag indicating that this action has been scheduled, or
	        // has recursively rescheduled itself.
	        this.pending = true;
	        var id = this.id;
	        // If this action has an intervalID and the specified delay matches the
	        // delay we used to create the intervalID, don't call `setInterval` again.
	        if (id != null && this.delay === delay) {
	            return this;
	        }
	        this.delay = delay;
	        // If this action has an intervalID, but was rescheduled with a different
	        // `delay` time, cancel the current intervalID and call `setInterval` with
	        // the new `delay` time.
	        if (id != null) {
	            this.id = null;
	            root_1.root.clearInterval(id);
	        }
	        //
	        // Important implementation note:
	        //
	        // By default, FutureAction only executes once. However, Actions have the
	        // ability to be rescheduled from within the scheduled callback (mimicking
	        // recursion for asynchronous methods). This allows us to implement single
	        // and repeated actions with the same code path without adding API surface
	        // area, and implement tail-call optimization over asynchronous boundaries.
	        //
	        // However, JS runtimes make a distinction between intervals scheduled by
	        // repeatedly calling `setTimeout` vs. a single `setInterval` call, with
	        // the latter providing a better guarantee of precision.
	        //
	        // In order to accommodate both single and repeatedly rescheduled actions,
	        // use `setInterval` here for both cases. By default, the interval will be
	        // canceled after its first execution, or if the action schedules itself to
	        // run again with a different `delay` time.
	        //
	        // If the action recursively schedules itself to run again with the same
	        // `delay` time, the interval is not canceled, but allowed to loop again.
	        // The check of whether the interval should be canceled or not is run every
	        // time the interval is executed. The first time an action fails to
	        // reschedule itself, the interval is canceled.
	        //
	        this.id = root_1.root.setInterval(function () {
	            _this.pending = false;
	            var _a = _this,
	                id = _a.id,
	                scheduler = _a.scheduler;
	            scheduler.actions.push(_this);
	            scheduler.flush();
	            //
	            // Terminate this interval if the action didn't reschedule itself.
	            // Don't call `this.unsubscribe()` here, because the action could be
	            // rescheduled later. For example:
	            //
	            // ```
	            // scheduler.schedule(function doWork(counter) {
	            //   /* ... I'm a busy worker bee ... */
	            //   var originalAction = this;
	            //   /* wait 100ms before rescheduling this action again */
	            //   setTimeout(function () {
	            //     originalAction.schedule(counter + 1);
	            //   }, 100);
	            // }, 1000);
	            // ```
	            if (_this.pending === false && id != null) {
	                _this.id = null;
	                root_1.root.clearInterval(id);
	            }
	        }, delay);
	        return this;
	    };
	    FutureAction.prototype._unsubscribe = function () {
	        this.pending = false;
	        var _a = this,
	            id = _a.id,
	            scheduler = _a.scheduler;
	        var actions = scheduler.actions;
	        var index = actions.indexOf(this);
	        if (id != null) {
	            this.id = null;
	            root_1.root.clearInterval(id);
	        }
	        if (index !== -1) {
	            actions.splice(index, 1);
	        }
	        this.work = null;
	        this.state = null;
	        this.scheduler = null;
	    };
	    return FutureAction;
	}(Subscription_1.Subscription);
	exports.FutureAction = FutureAction;
	//# sourceMappingURL=FutureAction.js.map

/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var QueueAction_1 = __webpack_require__(54);
	var FutureAction_1 = __webpack_require__(52);
	var QueueScheduler = function () {
	    function QueueScheduler() {
	        this.active = false;
	        this.actions = [];
	        this.scheduledId = null;
	    }
	    QueueScheduler.prototype.now = function () {
	        return Date.now();
	    };
	    QueueScheduler.prototype.flush = function () {
	        if (this.active || this.scheduledId) {
	            return;
	        }
	        this.active = true;
	        var actions = this.actions;
	        for (var action = void 0; action = actions.shift();) {
	            action.execute();
	            if (action.error) {
	                this.active = false;
	                throw action.error;
	            }
	        }
	        this.active = false;
	    };
	    QueueScheduler.prototype.schedule = function (work, delay, state) {
	        if (delay === void 0) {
	            delay = 0;
	        }
	        return delay <= 0 ? this.scheduleNow(work, state) : this.scheduleLater(work, delay, state);
	    };
	    QueueScheduler.prototype.scheduleNow = function (work, state) {
	        return new QueueAction_1.QueueAction(this, work).schedule(state);
	    };
	    QueueScheduler.prototype.scheduleLater = function (work, delay, state) {
	        return new FutureAction_1.FutureAction(this, work).schedule(state, delay);
	    };
	    return QueueScheduler;
	}();
	exports.QueueScheduler = QueueScheduler;
	//# sourceMappingURL=QueueScheduler.js.map

/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var __extends = undefined && undefined.__extends || function (d, b) {
	    for (var p in b) {
	        if (b.hasOwnProperty(p)) d[p] = b[p];
	    }function __() {
	        this.constructor = d;
	    }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var FutureAction_1 = __webpack_require__(52);
	var QueueAction = function (_super) {
	    __extends(QueueAction, _super);
	    function QueueAction() {
	        _super.apply(this, arguments);
	    }
	    QueueAction.prototype._schedule = function (state, delay) {
	        if (delay === void 0) {
	            delay = 0;
	        }
	        if (delay > 0) {
	            return _super.prototype._schedule.call(this, state, delay);
	        }
	        this.delay = delay;
	        this.state = state;
	        var scheduler = this.scheduler;
	        scheduler.actions.push(this);
	        scheduler.flush();
	        return this;
	    };
	    return QueueAction;
	}(FutureAction_1.FutureAction);
	exports.QueueAction = QueueAction;
	//# sourceMappingURL=QueueAction.js.map

/***/ },
/* 55 */
/***/ function(module, exports) {

	"use strict";

	function isDate(value) {
	    return value instanceof Date && !isNaN(+value);
	}
	exports.isDate = isDate;
	//# sourceMappingURL=isDate.js.map

/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var Observable_1 = __webpack_require__(17);
	var Notification = function () {
	    function Notification(kind, value, exception) {
	        this.kind = kind;
	        this.value = value;
	        this.exception = exception;
	        this.hasValue = kind === 'N';
	    }
	    Notification.prototype.observe = function (observer) {
	        switch (this.kind) {
	            case 'N':
	                return observer.next && observer.next(this.value);
	            case 'E':
	                return observer.error && observer.error(this.exception);
	            case 'C':
	                return observer.complete && observer.complete();
	        }
	    };
	    Notification.prototype.do = function (next, error, complete) {
	        var kind = this.kind;
	        switch (kind) {
	            case 'N':
	                return next && next(this.value);
	            case 'E':
	                return error && error(this.exception);
	            case 'C':
	                return complete && complete();
	        }
	    };
	    Notification.prototype.accept = function (nextOrObserver, error, complete) {
	        if (nextOrObserver && typeof nextOrObserver.next === 'function') {
	            return this.observe(nextOrObserver);
	        } else {
	            return this.do(nextOrObserver, error, complete);
	        }
	    };
	    Notification.prototype.toObservable = function () {
	        var kind = this.kind;
	        switch (kind) {
	            case 'N':
	                return Observable_1.Observable.of(this.value);
	            case 'E':
	                return Observable_1.Observable.throw(this.exception);
	            case 'C':
	                return Observable_1.Observable.empty();
	        }
	    };
	    Notification.createNext = function (value) {
	        if (typeof value !== 'undefined') {
	            return new Notification('N', value);
	        }
	        return this.undefinedValueNotification;
	    };
	    Notification.createError = function (err) {
	        return new Notification('E', undefined, err);
	    };
	    Notification.createComplete = function () {
	        return this.completeNotification;
	    };
	    Notification.completeNotification = new Notification('C');
	    Notification.undefinedValueNotification = new Notification('N', undefined);
	    return Notification;
	}();
	exports.Notification = Notification;
	//# sourceMappingURL=Notification.js.map

/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var Observable_1 = __webpack_require__(17);
	var ArrayObservable_1 = __webpack_require__(58);
	Observable_1.Observable.of = ArrayObservable_1.ArrayObservable.of;
	//# sourceMappingURL=of.js.map

/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var __extends = undefined && undefined.__extends || function (d, b) {
	    for (var p in b) {
	        if (b.hasOwnProperty(p)) d[p] = b[p];
	    }function __() {
	        this.constructor = d;
	    }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var Observable_1 = __webpack_require__(17);
	var ScalarObservable_1 = __webpack_require__(59);
	var EmptyObservable_1 = __webpack_require__(60);
	var isScheduler_1 = __webpack_require__(61);
	/**
	 * We need this JSDoc comment for affecting ESDoc.
	 * @extends {Ignored}
	 * @hide true
	 */
	var ArrayObservable = function (_super) {
	    __extends(ArrayObservable, _super);
	    function ArrayObservable(array, scheduler) {
	        _super.call(this);
	        this.array = array;
	        this.scheduler = scheduler;
	        if (!scheduler && array.length === 1) {
	            this._isScalar = true;
	            this.value = array[0];
	        }
	    }
	    /**
	     * @param array
	     * @param scheduler
	     * @return {Observable}
	     * @static true
	     * @name fromArray
	     * @owner Observable
	     */
	    ArrayObservable.create = function (array, scheduler) {
	        return new ArrayObservable(array, scheduler);
	    };
	    /**
	     * @param array
	     * @return {any}
	     * @static true
	     * @name of
	     * @owner Observable
	     */
	    ArrayObservable.of = function () {
	        var array = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            array[_i - 0] = arguments[_i];
	        }
	        var scheduler = array[array.length - 1];
	        if (isScheduler_1.isScheduler(scheduler)) {
	            array.pop();
	        } else {
	            scheduler = null;
	        }
	        var len = array.length;
	        if (len > 1) {
	            return new ArrayObservable(array, scheduler);
	        } else if (len === 1) {
	            return new ScalarObservable_1.ScalarObservable(array[0], scheduler);
	        } else {
	            return new EmptyObservable_1.EmptyObservable(scheduler);
	        }
	    };
	    ArrayObservable.dispatch = function (state) {
	        var array = state.array,
	            index = state.index,
	            count = state.count,
	            subscriber = state.subscriber;
	        if (index >= count) {
	            subscriber.complete();
	            return;
	        }
	        subscriber.next(array[index]);
	        if (subscriber.isUnsubscribed) {
	            return;
	        }
	        state.index = index + 1;
	        this.schedule(state);
	    };
	    ArrayObservable.prototype._subscribe = function (subscriber) {
	        var index = 0;
	        var array = this.array;
	        var count = array.length;
	        var scheduler = this.scheduler;
	        if (scheduler) {
	            return scheduler.schedule(ArrayObservable.dispatch, 0, {
	                array: array, index: index, count: count, subscriber: subscriber
	            });
	        } else {
	            for (var i = 0; i < count && !subscriber.isUnsubscribed; i++) {
	                subscriber.next(array[i]);
	            }
	            subscriber.complete();
	        }
	    };
	    return ArrayObservable;
	}(Observable_1.Observable);
	exports.ArrayObservable = ArrayObservable;
	//# sourceMappingURL=ArrayObservable.js.map

/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var __extends = undefined && undefined.__extends || function (d, b) {
	    for (var p in b) {
	        if (b.hasOwnProperty(p)) d[p] = b[p];
	    }function __() {
	        this.constructor = d;
	    }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var Observable_1 = __webpack_require__(17);
	/**
	 * We need this JSDoc comment for affecting ESDoc.
	 * @extends {Ignored}
	 * @hide true
	 */
	var ScalarObservable = function (_super) {
	    __extends(ScalarObservable, _super);
	    function ScalarObservable(value, scheduler) {
	        _super.call(this);
	        this.value = value;
	        this.scheduler = scheduler;
	        this._isScalar = true;
	    }
	    ScalarObservable.create = function (value, scheduler) {
	        return new ScalarObservable(value, scheduler);
	    };
	    ScalarObservable.dispatch = function (state) {
	        var done = state.done,
	            value = state.value,
	            subscriber = state.subscriber;
	        if (done) {
	            subscriber.complete();
	            return;
	        }
	        subscriber.next(value);
	        if (subscriber.isUnsubscribed) {
	            return;
	        }
	        state.done = true;
	        this.schedule(state);
	    };
	    ScalarObservable.prototype._subscribe = function (subscriber) {
	        var value = this.value;
	        var scheduler = this.scheduler;
	        if (scheduler) {
	            return scheduler.schedule(ScalarObservable.dispatch, 0, {
	                done: false, value: value, subscriber: subscriber
	            });
	        } else {
	            subscriber.next(value);
	            if (!subscriber.isUnsubscribed) {
	                subscriber.complete();
	            }
	        }
	    };
	    return ScalarObservable;
	}(Observable_1.Observable);
	exports.ScalarObservable = ScalarObservable;
	//# sourceMappingURL=ScalarObservable.js.map

/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var __extends = undefined && undefined.__extends || function (d, b) {
	    for (var p in b) {
	        if (b.hasOwnProperty(p)) d[p] = b[p];
	    }function __() {
	        this.constructor = d;
	    }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var Observable_1 = __webpack_require__(17);
	/**
	 * We need this JSDoc comment for affecting ESDoc.
	 * @extends {Ignored}
	 * @hide true
	 */
	var EmptyObservable = function (_super) {
	    __extends(EmptyObservable, _super);
	    function EmptyObservable(scheduler) {
	        _super.call(this);
	        this.scheduler = scheduler;
	    }
	    /**
	     * @param scheduler
	     * @return {Observable<T>}
	     * @static true
	     * @name empty
	     * @owner Observable
	     */
	    EmptyObservable.create = function (scheduler) {
	        return new EmptyObservable(scheduler);
	    };
	    EmptyObservable.dispatch = function (_a) {
	        var subscriber = _a.subscriber;
	        subscriber.complete();
	    };
	    EmptyObservable.prototype._subscribe = function (subscriber) {
	        var scheduler = this.scheduler;
	        if (scheduler) {
	            return scheduler.schedule(EmptyObservable.dispatch, 0, { subscriber: subscriber });
	        } else {
	            subscriber.complete();
	        }
	    };
	    return EmptyObservable;
	}(Observable_1.Observable);
	exports.EmptyObservable = EmptyObservable;
	//# sourceMappingURL=EmptyObservable.js.map

/***/ },
/* 61 */
/***/ function(module, exports) {

	"use strict";

	function isScheduler(value) {
	    return value && typeof value.schedule === 'function';
	}
	exports.isScheduler = isScheduler;
	//# sourceMappingURL=isScheduler.js.map

/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var Observable_1 = __webpack_require__(17);
	var do_1 = __webpack_require__(63);
	Observable_1.Observable.prototype.do = do_1._do;
	//# sourceMappingURL=do.js.map

/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var __extends = undefined && undefined.__extends || function (d, b) {
	    for (var p in b) {
	        if (b.hasOwnProperty(p)) d[p] = b[p];
	    }function __() {
	        this.constructor = d;
	    }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var Subscriber_1 = __webpack_require__(22);
	/**
	 * Returns a mirrored Observable of the source Observable, but modified so that the provided Observer is called
	 * for every item emitted by the source.
	 * This operator is useful for debugging your observables for the correct values or performing other side effects.
	 * @param {Observer|function} [nextOrObserver] a normal observer callback or callback for onNext.
	 * @param {function} [error] callback for errors in the source.
	 * @param {function} [complete] callback for the completion of the source.
	 * @reurns {Observable} a mirrored Observable with the specified Observer or callback attached for each item.
	 * @method do
	 * @owner Observable
	 */
	function _do(nextOrObserver, error, complete) {
	    return this.lift(new DoOperator(nextOrObserver, error, complete));
	}
	exports._do = _do;
	var DoOperator = function () {
	    function DoOperator(nextOrObserver, error, complete) {
	        this.nextOrObserver = nextOrObserver;
	        this.error = error;
	        this.complete = complete;
	    }
	    DoOperator.prototype.call = function (subscriber) {
	        return new DoSubscriber(subscriber, this.nextOrObserver, this.error, this.complete);
	    };
	    return DoOperator;
	}();
	var DoSubscriber = function (_super) {
	    __extends(DoSubscriber, _super);
	    function DoSubscriber(destination, nextOrObserver, error, complete) {
	        _super.call(this, destination);
	        var safeSubscriber = new Subscriber_1.Subscriber(nextOrObserver, error, complete);
	        safeSubscriber.syncErrorThrowable = true;
	        this.add(safeSubscriber);
	        this.safeSubscriber = safeSubscriber;
	    }
	    DoSubscriber.prototype._next = function (value) {
	        var safeSubscriber = this.safeSubscriber;
	        safeSubscriber.next(value);
	        if (safeSubscriber.syncErrorThrown) {
	            this.destination.error(safeSubscriber.syncErrorValue);
	        } else {
	            this.destination.next(value);
	        }
	    };
	    DoSubscriber.prototype._error = function (err) {
	        var safeSubscriber = this.safeSubscriber;
	        safeSubscriber.error(err);
	        if (safeSubscriber.syncErrorThrown) {
	            this.destination.error(safeSubscriber.syncErrorValue);
	        } else {
	            this.destination.error(err);
	        }
	    };
	    DoSubscriber.prototype._complete = function () {
	        var safeSubscriber = this.safeSubscriber;
	        safeSubscriber.complete();
	        if (safeSubscriber.syncErrorThrown) {
	            this.destination.error(safeSubscriber.syncErrorValue);
	        } else {
	            this.destination.complete();
	        }
	    };
	    return DoSubscriber;
	}(Subscriber_1.Subscriber);
	//# sourceMappingURL=do.js.map

/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.alias = exports.encodeBase64 = exports.decode = exports.encode = undefined;

	var _kdb = __webpack_require__(65);

	var kdb = _interopRequireWildcard(_kdb);

	var _remoting = __webpack_require__(1);

	var rc = _interopRequireWildcard(_remoting);

	var _security = __webpack_require__(2);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	var alias = {
	    201: kdb.QParameter,
	    1: kdb.QBoolean,
	    2: kdb.QGUID,
	    4: kdb.QByte,
	    5: kdb.QShort,
	    6: kdb.QInt,
	    7: kdb.QLong,
	    8: kdb.QReal,
	    9: kdb.QFloat,
	    10: kdb.QChar,
	    11: kdb.QSymbol,
	    12: kdb.QTimeStamp,
	    13: kdb.QMonth,
	    14: kdb.QDate,
	    15: kdb.QDateTime,
	    16: kdb.QTimeSpan,
	    17: kdb.QMinute,
	    18: kdb.QSecond,
	    19: kdb.QTime,
	    1001: kdb.QString,
	    0: kdb.QList,
	    99: kdb.QDict,
	    98: kdb.QFlip,
	    97: kdb.QByteStream,
	    202: kdb.QNamespace,
	    1201: kdb.JTemporal,
	    1212: kdb.JTimeStamp,
	    1213: kdb.JMonth,
	    1214: kdb.JDate,
	    1215: kdb.JDateTime,
	    1216: kdb.JTimeSpan,
	    1217: kdb.JMinute,
	    1218: kdb.JSecond,
	    1219: kdb.JTime,
	    1222: kdb.JUUID,
	    203: kdb.DataSet,
	    204: kdb.KDBQuery,
	    205: kdb.APIQuery,
	    206: rc.Message,
	    207: rc.AckMessage,
	    208: rc.NackMessage,
	    209: rc.UpdateMessage,
	    210: rc.StatusMessage,
	    211: rc.FDRemoteCall,
	    212: rc.DeltaClient,
	    213: rc.UserAccessEntity,
	    214: rc.PasswordResetEntity,
	    215: rc.ConnectionEntity,
	    216: rc.ConnectionGroupEntity,
	    217: rc.TickSubscriptionEntity,
	    218: kdb.SQLQuery,
	    219: kdb.SQLParameter,
	    220: kdb.SQLBoolean,
	    221: kdb.SQLByte,
	    222: kdb.SQLDate,
	    223: kdb.SQLDouble,
	    224: kdb.SQLFloat,
	    225: kdb.SQLInt,
	    226: kdb.SQLList,
	    227: kdb.SQLLong,
	    228: kdb.SQLShort,
	    229: kdb.SQLTime,
	    230: kdb.SQLTimeStamp,
	    231: kdb.SQLVarChar,
	    232: rc.DashPermissionEntity,
	    233: rc.AnalystPubMessage,
	    234: rc.TokenIdAccessEntity,
	    235: rc.LogoutMessage,
	    236: rc.OOBUpdate,
	    237: rc.RegisterAccessEntity,

	    init: function init() {
	        for (var p in alias) {
	            alias[p].prototype.class = p;
	        }
	    }
	};

	var replacer = function replacer(key, value) {
	    if (value != null && value.__proto__ && value.__proto__.class) {
	        value.class = value.__proto__.class;
	    }
	    return value;
	};

	var reviver = function reviver(key, value) {
	    if (value == null || value.class === undefined) {
	        return value;
	    }
	    var cls = alias[value.class],
	        inst = null,
	        prop = void 0;
	    if (cls === undefined || cls == null) {
	        return value;
	    }
	    inst = new cls();
	    for (prop in value) {
	        if (inst[prop] !== undefined) {
	            inst[prop] = value[prop];
	        }
	    }
	    return inst;
	};

	var encode = function encode(x) {
	    return JSON.stringify(x, replacer);
	};

	var decode = function decode(x) {
	    return JSON.parse(x, reviver);
	};

	var encodeBase64 = function encodeBase64(x) {
	    return (0, _security.toBase64)(encode(x));
	};

	alias.init();

	exports.encode = encode;
	exports.decode = decode;
	exports.encodeBase64 = encodeBase64;
	exports.alias = alias;

/***/ },
/* 65 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_65__;

/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.decode = exports.encode = undefined;

	var _Protocol = __webpack_require__(67);

	var _Protocol2 = _interopRequireDefault(_Protocol);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var protocol = new _Protocol2.default({
	    // The router is passed to us already JSON stringified, so just wrap and
	    // unwrap in an array buffer here
	    Router: {
	        encode: function encode(router) {
	            return _Protocol2.default.stringToArrayBuffer(router);
	        },
	        decode: function decode(blob) {
	            return _Protocol2.default.arrayBufferToString(blob);
	        }
	    }
	});

	var encode = function encode(apiMsg, appMsg) {
	    return protocol.encode({
	        // TODO - define (identify) relevant channels
	        channel: 0,
	        router: apiMsg,
	        payload: appMsg
	    });
	};

	var decode = function decode(byteArray) {
	    return protocol.decode(byteArray);
	};

	exports.encode = encode;
	exports.decode = decode;

/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Protocol = function () {

	    /* ******************* */
	    /* Protocol Definition */
	    /* ******************* */

	    var version = 0;
	    var Unit = {
	        UINT8: 1,
	        UINT16: 2,
	        UINT32: 4,
	        VAR: function VAR(l) {
	            return { length: l };
	        }
	    };

	    function protocol(o) {
	        o = o || {};
	        o.channel = o.channel || 0;
	        o.version = o.version || version;
	        o.router = o.router || {};
	        o.payload = o.payload || {};
	        // Protocol ordering and widths
	        return [part('version', o.version, Unit.UINT16), part('channel', o.channel, Unit.UINT16), part('routerLength', o.router.byteLength, Unit.UINT32), part('router', o.router, Unit.VAR(o.router.byteLength)), part('payloadLength', o.payload.byteLength, Unit.UINT32), part('payload', o.payload, Unit.VAR(o.payload.byteLength))];
	    }

	    /* ********* */
	    /* Encodings */
	    /* ********* */

	    var Router = {
	        encode: function encode(router) {
	            return Protocol.stringToArrayBuffer(JSON.stringify(router));
	        },
	        decode: function decode(blob) {
	            return JSON.parse(Protocol.arrayBufferToString(blob));
	        }
	    };

	    var Payload = {
	        encode: function encode(payload) {
	            return payload;
	        },
	        decode: function decode(blob) {
	            return blob;
	        }
	    };

	    /* ****** */
	    /* Public */
	    /* ****** */

	    /**
	     * @param {object} [encodings] - Encoding/decoding for router and Payload
	     * @param {object} [encodings.Router]
	     * @param {object} [encodings.Router.encode] - Function from router to ArrayBuffer
	     * @param {object} [encodings.Router.decode] - Inverse of encode
	     * @param {object} [encodings.Payload]
	     * @param {object} [encodings.Payload.encode] - Function from paylaod to ArrayBuffer
	     * @param {object} [encodings.Payload.decode] - Inverse of encode
	     * @example
	     * var protocol = new Protocol()
	     * @example
	     * var protocol = new Protocol({
	     *     Payload : { encode: fn, decode: fn },
	     *     Router  : { encode: fn, decode: fn }
	     * })
	     */
	    function Protocol(encodings) {
	        encodings = encodings || {};
	        encodings.Router = encodings.Router || Router;
	        encodings.Payload = encodings.Payload || Payload;
	        this._encodings = encodings;
	    }

	    /**
	     * Encode a message as an ArrayBuffer
	     * @param {object} msg - Result of `Protocol.format`
	     * @param {number} msg.channel
	     * @param {any}    msg.router
	     * @param {any}    msg.payload
	     * @example
	     * protocol.encode(msg)
	     */
	    Protocol.prototype.encode = function (msg) {
	        return assemble(msg.channel, this._encodings.Router.encode(msg.router), this._encodings.Payload.encode(msg.payload));
	    };

	    /**
	     * @param {ArrayBuffer} blob
	     * @returns {object} - Decoded message
	     * @example
	     * protocol.decode(arraybuffer)
	     */
	    Protocol.prototype.decode = function (blob) {
	        var msg = disassemble(blob);
	        msg.router = this._encodings.Router.decode(msg.router);
	        msg.payload = this._encodings.Payload.decode(msg.payload);
	        return msg;
	    };

	    /**
	     * If given a message, return the protocol version of the message.
	     * Otherwise (if given no argument), return the protocol version of
	     * the encoder instance.
	     * @param {ArrayBuffer} [msg] - An encoded message
	     * @returns {number}
	     * @example
	     * protocol.version() >= protocol.version(msg)
	     */
	    Protocol.prototype.version = function (msg) {
	        if (msg === undefined) {
	            return version;
	        }
	        var offset = offsets(protocol()).version;
	        return new DataView(msg).getUint16(offset);
	    };

	    /* ********* */
	    /*  Private  */
	    /* ********* */

	    function offsets(proto) {
	        var result = {},
	            // Result accumulator
	        acc = 0,
	            // Position accumulator
	        i,
	            j;
	        for (i = 0, j = proto.length; i < j; ++i) {
	            result[proto[i].title] = acc;
	            acc += partLength(proto[i]);
	        }
	        return result;
	    }

	    function part(title, value, length) {
	        return { title: title, value: value, length: length };
	    }

	    function partLength(p) {
	        return 'number' === typeof p.length ? p.length : p.length.length;
	    }

	    function bufferLength(data) {
	        return data.reduce(function (a, p) {
	            return a + partLength(p);
	        }, 0);
	    }

	    function write(buffer, data) {
	        var view = new DataView(buffer, 0),
	            uint8 = new Uint8Array(buffer),
	            pos = 0,
	            // Position in the buffer
	        val,
	            // Value to write to the buffer
	        i,
	            j;
	        for (i = 0, j = data.length; i < j; ++i) {
	            val = data[i].value;
	            switch (partLength(data[i])) {
	                case Unit.UINT8:
	                    view.setUint8(pos, val);
	                    pos += Unit.UINT8;
	                    break;
	                case Unit.UINT16:
	                    view.setUint16(pos, val);
	                    pos += Unit.UINT16;
	                    break;
	                case Unit.UINT32:
	                    view.setUint32(pos, val);
	                    pos += Unit.UINT32;
	                    break;
	                default:
	                    // wrap the arraybuffer for set
	                    uint8.set(new Uint8Array(val), pos);
	                    pos += partLength(data[i]);
	                    break;
	            }
	        }
	        return buffer;
	    }

	    function assemble(channel, router, payload) {
	        var data = protocol({
	            version: version,
	            channel: channel,
	            router: router,
	            payload: payload
	        }),
	            buffer = new ArrayBuffer(bufferLength(data));
	        return write(buffer, data);
	    }

	    function disassemble(blob) {
	        var view = new DataView(blob),
	            proto = protocol(),
	            result = {},
	            // Result accumulator
	        pos = 0,
	            // Position in the buffer
	        i,
	            j,
	            // Looping variables
	        curr,
	            last; // Current and last result
	        for (i = 0, j = proto.length; i < j; ++i) {
	            switch (partLength(proto[i])) {
	                case Unit.UINT8:
	                    curr = view.getUint8(pos);
	                    pos += Unit.UINT8;
	                    break;
	                case Unit.UINT16:
	                    curr = view.getUint16(pos);
	                    pos += Unit.UINT16;
	                    break;
	                case Unit.UINT32:
	                    curr = view.getUint32(pos);
	                    pos += Unit.UINT32;
	                    break;
	                default:
	                    curr = blob.slice(pos, pos + last);
	                    pos += last;
	                    break;
	            }
	            result[proto[i].title] = curr;
	            last = curr;
	        }
	        return result;
	    }

	    Protocol.arrayBufferToString = function (buf) {
	        var str = "";
	        var uint16 = new Uint16Array(buf);
	        for (var i = 0; i < uint16.length; ++i) {
	            str += String.fromCharCode(uint16[i]);
	        }
	        return str;
	    };

	    Protocol.stringToArrayBuffer = function (str) {
	        var buffer = new ArrayBuffer(str.length * 2),
	            view = new Uint16Array(buffer),
	            i,
	            j;
	        for (i = 0, j = str.length; i < j; ++i) {
	            view[i] = str.charCodeAt(i);
	        }
	        return buffer;
	    };

	    return Protocol;
	}();

	if (true) {
	    module.exports = Protocol;
	}
	if (true) {
	    exports.Protocol = Protocol;
	}

/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var transportList = __webpack_require__(69);

	module.exports = __webpack_require__(114)(transportList);

	// TODO can't get rid of this until all servers do
	if ('_sockjs_onload' in global) {
	  setTimeout(global._sockjs_onload, 1);
	}
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = [
	// streaming transports
	__webpack_require__(70), __webpack_require__(85), __webpack_require__(95), __webpack_require__(97), __webpack_require__(100)(__webpack_require__(97))

	// polling transports
	, __webpack_require__(107), __webpack_require__(100)(__webpack_require__(107)), __webpack_require__(109), __webpack_require__(110), __webpack_require__(100)(__webpack_require__(109)), __webpack_require__(111)];

/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	var utils = __webpack_require__(71),
	    urlUtils = __webpack_require__(74),
	    inherits = __webpack_require__(81),
	    EventEmitter = __webpack_require__(82).EventEmitter,
	    WebsocketDriver = __webpack_require__(84);

	var debug = function debug() {};
	if (process.env.NODE_ENV !== 'production') {
	  debug = __webpack_require__(78)('sockjs-client:websocket');
	}

	function WebSocketTransport(transUrl) {
	  if (!WebSocketTransport.enabled()) {
	    throw new Error('Transport created when disabled');
	  }

	  EventEmitter.call(this);
	  debug('constructor', transUrl);

	  var self = this;
	  var url = urlUtils.addPath(transUrl, '/websocket');
	  if (url.slice(0, 5) === 'https') {
	    url = 'wss' + url.slice(5);
	  } else {
	    url = 'ws' + url.slice(4);
	  }
	  this.url = url;

	  this.ws = new WebsocketDriver(this.url);
	  this.ws.onmessage = function (e) {
	    debug('message event', e.data);
	    self.emit('message', e.data);
	  };
	  // Firefox has an interesting bug. If a websocket connection is
	  // created after onunload, it stays alive even when user
	  // navigates away from the page. In such situation let's lie -
	  // let's not open the ws connection at all. See:
	  // https://github.com/sockjs/sockjs-client/issues/28
	  // https://bugzilla.mozilla.org/show_bug.cgi?id=696085
	  this.unloadRef = utils.unloadAdd(function () {
	    debug('unload');
	    self.ws.close();
	  });
	  this.ws.onclose = function (e) {
	    debug('close event', e.code, e.reason);
	    self.emit('close', e.code, e.reason);
	    self._cleanup();
	  };
	  this.ws.onerror = function (e) {
	    debug('error event', e);
	    self.emit('close', 1006, 'WebSocket connection broken');
	    self._cleanup();
	  };
	}

	inherits(WebSocketTransport, EventEmitter);

	WebSocketTransport.prototype.send = function (data) {
	  var msg = '[' + data + ']';
	  debug('send', msg);
	  this.ws.send(msg);
	};

	WebSocketTransport.prototype.close = function () {
	  debug('close');
	  if (this.ws) {
	    this.ws.close();
	  }
	  this._cleanup();
	};

	WebSocketTransport.prototype._cleanup = function () {
	  debug('_cleanup');
	  var ws = this.ws;
	  if (ws) {
	    ws.onmessage = ws.onclose = ws.onerror = null;
	  }
	  utils.unloadDel(this.unloadRef);
	  this.unloadRef = this.ws = null;
	  this.removeAllListeners();
	};

	WebSocketTransport.enabled = function () {
	  debug('enabled');
	  return !!WebsocketDriver;
	};
	WebSocketTransport.transportName = 'websocket';

	// In theory, ws should require 1 round trip. But in chrome, this is
	// not very stable over SSL. Most likely a ws connection requires a
	// separate SSL connection, in which case 2 round trips are an
	// absolute minumum.
	WebSocketTransport.roundTrips = 2;

	module.exports = WebSocketTransport;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(16)))

/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var random = __webpack_require__(72);

	var onUnload = {},
	    afterUnload = false
	// detect google chrome packaged apps because they don't allow the 'unload' event
	,
	    isChromePackagedApp = global.chrome && global.chrome.app && global.chrome.app.runtime;

	module.exports = {
	  attachEvent: function attachEvent(event, listener) {
	    if (typeof global.addEventListener !== 'undefined') {
	      global.addEventListener(event, listener, false);
	    } else if (global.document && global.attachEvent) {
	      // IE quirks.
	      // According to: http://stevesouders.com/misc/test-postmessage.php
	      // the message gets delivered only to 'document', not 'window'.
	      global.document.attachEvent('on' + event, listener);
	      // I get 'window' for ie8.
	      global.attachEvent('on' + event, listener);
	    }
	  },

	  detachEvent: function detachEvent(event, listener) {
	    if (typeof global.addEventListener !== 'undefined') {
	      global.removeEventListener(event, listener, false);
	    } else if (global.document && global.detachEvent) {
	      global.document.detachEvent('on' + event, listener);
	      global.detachEvent('on' + event, listener);
	    }
	  },

	  unloadAdd: function unloadAdd(listener) {
	    if (isChromePackagedApp) {
	      return null;
	    }

	    var ref = random.string(8);
	    onUnload[ref] = listener;
	    if (afterUnload) {
	      setTimeout(this.triggerUnloadCallbacks, 0);
	    }
	    return ref;
	  },

	  unloadDel: function unloadDel(ref) {
	    if (ref in onUnload) {
	      delete onUnload[ref];
	    }
	  },

	  triggerUnloadCallbacks: function triggerUnloadCallbacks() {
	    for (var ref in onUnload) {
	      onUnload[ref]();
	      delete onUnload[ref];
	    }
	  }
	};

	var unloadTriggered = function unloadTriggered() {
	  if (afterUnload) {
	    return;
	  }
	  afterUnload = true;
	  module.exports.triggerUnloadCallbacks();
	};

	// 'unload' alone is not reliable in opera within an iframe, but we
	// can't use `beforeunload` as IE fires it on javascript: links.
	if (!isChromePackagedApp) {
	  module.exports.attachEvent('unload', unloadTriggered);
	}
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 72 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/* global crypto:true */

	var crypto = __webpack_require__(73);

	// This string has length 32, a power of 2, so the modulus doesn't introduce a
	// bias.
	var _randomStringChars = 'abcdefghijklmnopqrstuvwxyz012345';
	module.exports = {
	  string: function string(length) {
	    var max = _randomStringChars.length;
	    var bytes = crypto.randomBytes(length);
	    var ret = [];
	    for (var i = 0; i < length; i++) {
	      ret.push(_randomStringChars.substr(bytes[i] % max, 1));
	    }
	    return ret.join('');
	  },

	  number: function number(max) {
	    return Math.floor(Math.random() * max);
	  },

	  numberString: function numberString(max) {
	    var t = ('' + (max - 1)).length;
	    var p = new Array(t + 1).join('0');
	    return (p + this.number(max)).slice(-t);
	  }
	};

/***/ },
/* 73 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	if (global.crypto && global.crypto.getRandomValues) {
	  module.exports.randomBytes = function (length) {
	    var bytes = new Uint8Array(length);
	    global.crypto.getRandomValues(bytes);
	    return bytes;
	  };
	} else {
	  module.exports.randomBytes = function (length) {
	    var bytes = new Array(length);
	    for (var i = 0; i < length; i++) {
	      bytes[i] = Math.floor(Math.random() * 256);
	    }
	    return bytes;
	  };
	}
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 74 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	var URL = __webpack_require__(75);

	var debug = function debug() {};
	if (process.env.NODE_ENV !== 'production') {
	  debug = __webpack_require__(78)('sockjs-client:utils:url');
	}

	module.exports = {
	  getOrigin: function getOrigin(url) {
	    if (!url) {
	      return null;
	    }

	    var p = new URL(url);
	    if (p.protocol === 'file:') {
	      return null;
	    }

	    var port = p.port;
	    if (!port) {
	      port = p.protocol === 'https:' ? '443' : '80';
	    }

	    return p.protocol + '//' + p.hostname + ':' + port;
	  },

	  isOriginEqual: function isOriginEqual(a, b) {
	    var res = this.getOrigin(a) === this.getOrigin(b);
	    debug('same', a, b, res);
	    return res;
	  },

	  isSchemeEqual: function isSchemeEqual(a, b) {
	    return a.split(':')[0] === b.split(':')[0];
	  },

	  addPath: function addPath(url, path) {
	    var qs = url.split('?');
	    return qs[0] + path + (qs[1] ? '?' + qs[1] : '');
	  },

	  addQuery: function addQuery(url, q) {
	    return url + (url.indexOf('?') === -1 ? '?' + q : '&' + q);
	  }
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(16)))

/***/ },
/* 75 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var required = __webpack_require__(76),
	    qs = __webpack_require__(77),
	    protocolre = /^([a-z][a-z0-9.+-]*:)?(\/\/)?([\S\s]*)/i,
	    slashes = /^[A-Za-z][A-Za-z0-9+-.]*:\/\//;

	/**
	 * These are the parse rules for the URL parser, it informs the parser
	 * about:
	 *
	 * 0. The char it Needs to parse, if it's a string it should be done using
	 *    indexOf, RegExp using exec and NaN means set as current value.
	 * 1. The property we should set when parsing this value.
	 * 2. Indication if it's backwards or forward parsing, when set as number it's
	 *    the value of extra chars that should be split off.
	 * 3. Inherit from location if non existing in the parser.
	 * 4. `toLowerCase` the resulting value.
	 */
	var rules = [['#', 'hash'], // Extract from the back.
	['?', 'query'], // Extract from the back.
	function sanitize(address) {
	  // Sanitize what is left of the address
	  return address.replace('\\', '/');
	}, ['/', 'pathname'], // Extract from the back.
	['@', 'auth', 1], // Extract from the front.
	[NaN, 'host', undefined, 1, 1], // Set left over value.
	[/:(\d+)$/, 'port', undefined, 1], // RegExp the back.
	[NaN, 'hostname', undefined, 1, 1] // Set left over.
	];

	/**
	 * These properties should not be copied or inherited from. This is only needed
	 * for all non blob URL's as a blob URL does not include a hash, only the
	 * origin.
	 *
	 * @type {Object}
	 * @private
	 */
	var ignore = { hash: 1, query: 1 };

	/**
	 * The location object differs when your code is loaded through a normal page,
	 * Worker or through a worker using a blob. And with the blobble begins the
	 * trouble as the location object will contain the URL of the blob, not the
	 * location of the page where our code is loaded in. The actual origin is
	 * encoded in the `pathname` so we can thankfully generate a good "default"
	 * location from it so we can generate proper relative URL's again.
	 *
	 * @param {Object|String} loc Optional default location object.
	 * @returns {Object} lolcation object.
	 * @public
	 */
	function lolcation(loc) {
	  var globalVar;

	  if (typeof window !== 'undefined') globalVar = window;else if (typeof global !== 'undefined') globalVar = global;else if (typeof self !== 'undefined') globalVar = self;else globalVar = {};

	  var location = globalVar.location || {};
	  loc = loc || location;

	  var finaldestination = {},
	      type = typeof loc === 'undefined' ? 'undefined' : _typeof(loc),
	      key;

	  if ('blob:' === loc.protocol) {
	    finaldestination = new Url(unescape(loc.pathname), {});
	  } else if ('string' === type) {
	    finaldestination = new Url(loc, {});
	    for (key in ignore) {
	      delete finaldestination[key];
	    }
	  } else if ('object' === type) {
	    for (key in loc) {
	      if (key in ignore) continue;
	      finaldestination[key] = loc[key];
	    }

	    if (finaldestination.slashes === undefined) {
	      finaldestination.slashes = slashes.test(loc.href);
	    }
	  }

	  return finaldestination;
	}

	/**
	 * @typedef ProtocolExtract
	 * @type Object
	 * @property {String} protocol Protocol matched in the URL, in lowercase.
	 * @property {Boolean} slashes `true` if protocol is followed by "//", else `false`.
	 * @property {String} rest Rest of the URL that is not part of the protocol.
	 */

	/**
	 * Extract protocol information from a URL with/without double slash ("//").
	 *
	 * @param {String} address URL we want to extract from.
	 * @return {ProtocolExtract} Extracted information.
	 * @private
	 */
	function extractProtocol(address) {
	  var match = protocolre.exec(address);

	  return {
	    protocol: match[1] ? match[1].toLowerCase() : '',
	    slashes: !!match[2],
	    rest: match[3]
	  };
	}

	/**
	 * Resolve a relative URL pathname against a base URL pathname.
	 *
	 * @param {String} relative Pathname of the relative URL.
	 * @param {String} base Pathname of the base URL.
	 * @return {String} Resolved pathname.
	 * @private
	 */
	function resolve(relative, base) {
	  var path = (base || '/').split('/').slice(0, -1).concat(relative.split('/')),
	      i = path.length,
	      last = path[i - 1],
	      unshift = false,
	      up = 0;

	  while (i--) {
	    if (path[i] === '.') {
	      path.splice(i, 1);
	    } else if (path[i] === '..') {
	      path.splice(i, 1);
	      up++;
	    } else if (up) {
	      if (i === 0) unshift = true;
	      path.splice(i, 1);
	      up--;
	    }
	  }

	  if (unshift) path.unshift('');
	  if (last === '.' || last === '..') path.push('');

	  return path.join('/');
	}

	/**
	 * The actual URL instance. Instead of returning an object we've opted-in to
	 * create an actual constructor as it's much more memory efficient and
	 * faster and it pleases my OCD.
	 *
	 * It is worth noting that we should not use `URL` as class name to prevent
	 * clashes with the global URL instance that got introduced in browsers.
	 *
	 * @constructor
	 * @param {String} address URL we want to parse.
	 * @param {Object|String} [location] Location defaults for relative paths.
	 * @param {Boolean|Function} [parser] Parser for the query string.
	 * @private
	 */
	function Url(address, location, parser) {
	  if (!(this instanceof Url)) {
	    return new Url(address, location, parser);
	  }

	  var relative,
	      extracted,
	      parse,
	      instruction,
	      index,
	      key,
	      instructions = rules.slice(),
	      type = typeof location === 'undefined' ? 'undefined' : _typeof(location),
	      url = this,
	      i = 0;

	  //
	  // The following if statements allows this module two have compatibility with
	  // 2 different API:
	  //
	  // 1. Node.js's `url.parse` api which accepts a URL, boolean as arguments
	  //    where the boolean indicates that the query string should also be parsed.
	  //
	  // 2. The `URL` interface of the browser which accepts a URL, object as
	  //    arguments. The supplied object will be used as default values / fall-back
	  //    for relative paths.
	  //
	  if ('object' !== type && 'string' !== type) {
	    parser = location;
	    location = null;
	  }

	  if (parser && 'function' !== typeof parser) parser = qs.parse;

	  location = lolcation(location);

	  //
	  // Extract protocol information before running the instructions.
	  //
	  extracted = extractProtocol(address || '');
	  relative = !extracted.protocol && !extracted.slashes;
	  url.slashes = extracted.slashes || relative && location.slashes;
	  url.protocol = extracted.protocol || location.protocol || '';
	  address = extracted.rest;

	  //
	  // When the authority component is absent the URL starts with a path
	  // component.
	  //
	  if (!extracted.slashes) instructions[3] = [/(.*)/, 'pathname'];

	  for (; i < instructions.length; i++) {
	    instruction = instructions[i];

	    if (typeof instruction === 'function') {
	      address = instruction(address);
	      continue;
	    }

	    parse = instruction[0];
	    key = instruction[1];

	    if (parse !== parse) {
	      url[key] = address;
	    } else if ('string' === typeof parse) {
	      if (~(index = address.indexOf(parse))) {
	        if ('number' === typeof instruction[2]) {
	          url[key] = address.slice(0, index);
	          address = address.slice(index + instruction[2]);
	        } else {
	          url[key] = address.slice(index);
	          address = address.slice(0, index);
	        }
	      }
	    } else if (index = parse.exec(address)) {
	      url[key] = index[1];
	      address = address.slice(0, index.index);
	    }

	    url[key] = url[key] || (relative && instruction[3] ? location[key] || '' : '');

	    //
	    // Hostname, host and protocol should be lowercased so they can be used to
	    // create a proper `origin`.
	    //
	    if (instruction[4]) url[key] = url[key].toLowerCase();
	  }

	  //
	  // Also parse the supplied query string in to an object. If we're supplied
	  // with a custom parser as function use that instead of the default build-in
	  // parser.
	  //
	  if (parser) url.query = parser(url.query);

	  //
	  // If the URL is relative, resolve the pathname against the base URL.
	  //
	  if (relative && location.slashes && url.pathname.charAt(0) !== '/' && (url.pathname !== '' || location.pathname !== '')) {
	    url.pathname = resolve(url.pathname, location.pathname);
	  }

	  //
	  // We should not add port numbers if they are already the default port number
	  // for a given protocol. As the host also contains the port number we're going
	  // override it with the hostname which contains no port number.
	  //
	  if (!required(url.port, url.protocol)) {
	    url.host = url.hostname;
	    url.port = '';
	  }

	  //
	  // Parse down the `auth` for the username and password.
	  //
	  url.username = url.password = '';
	  if (url.auth) {
	    instruction = url.auth.split(':');
	    url.username = instruction[0] || '';
	    url.password = instruction[1] || '';
	  }

	  url.origin = url.protocol && url.host && url.protocol !== 'file:' ? url.protocol + '//' + url.host : 'null';

	  //
	  // The href is just the compiled result.
	  //
	  url.href = url.toString();
	}

	/**
	 * This is convenience method for changing properties in the URL instance to
	 * insure that they all propagate correctly.
	 *
	 * @param {String} part          Property we need to adjust.
	 * @param {Mixed} value          The newly assigned value.
	 * @param {Boolean|Function} fn  When setting the query, it will be the function
	 *                               used to parse the query.
	 *                               When setting the protocol, double slash will be
	 *                               removed from the final url if it is true.
	 * @returns {URL} URL instance for chaining.
	 * @public
	 */
	function set(part, value, fn) {
	  var url = this;

	  switch (part) {
	    case 'query':
	      if ('string' === typeof value && value.length) {
	        value = (fn || qs.parse)(value);
	      }

	      url[part] = value;
	      break;

	    case 'port':
	      url[part] = value;

	      if (!required(value, url.protocol)) {
	        url.host = url.hostname;
	        url[part] = '';
	      } else if (value) {
	        url.host = url.hostname + ':' + value;
	      }

	      break;

	    case 'hostname':
	      url[part] = value;

	      if (url.port) value += ':' + url.port;
	      url.host = value;
	      break;

	    case 'host':
	      url[part] = value;

	      if (/:\d+$/.test(value)) {
	        value = value.split(':');
	        url.port = value.pop();
	        url.hostname = value.join(':');
	      } else {
	        url.hostname = value;
	        url.port = '';
	      }

	      break;

	    case 'protocol':
	      url.protocol = value.toLowerCase();
	      url.slashes = !fn;
	      break;

	    case 'pathname':
	    case 'hash':
	      if (value) {
	        var char = part === 'pathname' ? '/' : '#';
	        url[part] = value.charAt(0) !== char ? char + value : value;
	      } else {
	        url[part] = value;
	      }
	      break;

	    default:
	      url[part] = value;
	  }

	  for (var i = 0; i < rules.length; i++) {
	    var ins = rules[i];

	    if (ins[4]) url[ins[1]] = url[ins[1]].toLowerCase();
	  }

	  url.origin = url.protocol && url.host && url.protocol !== 'file:' ? url.protocol + '//' + url.host : 'null';

	  url.href = url.toString();

	  return url;
	}

	/**
	 * Transform the properties back in to a valid and full URL string.
	 *
	 * @param {Function} stringify Optional query stringify function.
	 * @returns {String} Compiled version of the URL.
	 * @public
	 */
	function toString(stringify) {
	  if (!stringify || 'function' !== typeof stringify) stringify = qs.stringify;

	  var query,
	      url = this,
	      protocol = url.protocol;

	  if (protocol && protocol.charAt(protocol.length - 1) !== ':') protocol += ':';

	  var result = protocol + (url.slashes ? '//' : '');

	  if (url.username) {
	    result += url.username;
	    if (url.password) result += ':' + url.password;
	    result += '@';
	  }

	  result += url.host + url.pathname;

	  query = 'object' === _typeof(url.query) ? stringify(url.query) : url.query;
	  if (query) result += '?' !== query.charAt(0) ? '?' + query : query;

	  if (url.hash) result += url.hash;

	  return result;
	}

	Url.prototype = { set: set, toString: toString };

	//
	// Expose the URL parser and some additional properties that might be useful for
	// others or testing.
	//
	Url.extractProtocol = extractProtocol;
	Url.location = lolcation;
	Url.qs = qs;

	module.exports = Url;
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 76 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * Check if we're required to add a port number.
	 *
	 * @see https://url.spec.whatwg.org/#default-port
	 * @param {Number|String} port Port number we need to check
	 * @param {String} protocol Protocol we need to check against.
	 * @returns {Boolean} Is it a default port for the given protocol
	 * @api private
	 */

	module.exports = function required(port, protocol) {
	  protocol = protocol.split(':')[0];
	  port = +port;

	  if (!port) return false;

	  switch (protocol) {
	    case 'http':
	    case 'ws':
	      return port !== 80;

	    case 'https':
	    case 'wss':
	      return port !== 443;

	    case 'ftp':
	      return port !== 21;

	    case 'gopher':
	      return port !== 70;

	    case 'file':
	      return false;
	  }

	  return port !== 0;
	};

/***/ },
/* 77 */
/***/ function(module, exports) {

	'use strict';

	var has = Object.prototype.hasOwnProperty,
	    undef;

	/**
	 * Decode a URI encoded string.
	 *
	 * @param {String} input The URI encoded string.
	 * @returns {String} The decoded string.
	 * @api private
	 */
	function decode(input) {
	  return decodeURIComponent(input.replace(/\+/g, ' '));
	}

	/**
	 * Simple query string parser.
	 *
	 * @param {String} query The query string that needs to be parsed.
	 * @returns {Object}
	 * @api public
	 */
	function querystring(query) {
	  var parser = /([^=?&]+)=?([^&]*)/g,
	      result = {},
	      part;

	  while (part = parser.exec(query)) {
	    var key = decode(part[1]),
	        value = decode(part[2]);

	    //
	    // Prevent overriding of existing properties. This ensures that build-in
	    // methods like `toString` or __proto__ are not overriden by malicious
	    // querystrings.
	    //
	    if (key in result) continue;
	    result[key] = value;
	  }

	  return result;
	}

	/**
	 * Transform a query string to an object.
	 *
	 * @param {Object} obj Object that should be transformed.
	 * @param {String} prefix Optional prefix.
	 * @returns {String}
	 * @api public
	 */
	function querystringify(obj, prefix) {
	  prefix = prefix || '';

	  var pairs = [],
	      value,
	      key;

	  //
	  // Optionally prefix with a '?' if needed
	  //
	  if ('string' !== typeof prefix) prefix = '?';

	  for (key in obj) {
	    if (has.call(obj, key)) {
	      value = obj[key];

	      //
	      // Edge cases where we actually want to encode the value to an empty
	      // string instead of the stringified value.
	      //
	      if (!value && (value === null || value === undef || isNaN(value))) {
	        value = '';
	      }

	      pairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
	    }
	  }

	  return pairs.length ? prefix + pairs.join('&') : '';
	}

	//
	// Expose the module.
	//
	exports.stringify = querystringify;
	exports.parse = querystring;

/***/ },
/* 78 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	/**
	 * This is the web browser implementation of `debug()`.
	 *
	 * Expose `debug()` as the module.
	 */

	exports = module.exports = __webpack_require__(79);
	exports.log = log;
	exports.formatArgs = formatArgs;
	exports.save = save;
	exports.load = load;
	exports.useColors = useColors;
	exports.storage = 'undefined' != typeof chrome && 'undefined' != typeof chrome.storage ? chrome.storage.local : localstorage();

	/**
	 * Colors.
	 */

	exports.colors = ['lightseagreen', 'forestgreen', 'goldenrod', 'dodgerblue', 'darkorchid', 'crimson'];

	/**
	 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
	 * and the Firebug extension (any Firefox version) are known
	 * to support "%c" CSS customizations.
	 *
	 * TODO: add a `localStorage` variable to explicitly enable/disable colors
	 */

	function useColors() {
	  // NB: In an Electron preload script, document will be defined but not fully
	  // initialized. Since we know we're in Chrome, we'll just detect this case
	  // explicitly
	  if (typeof window !== 'undefined' && window.process && window.process.type === 'renderer') {
	    return true;
	  }

	  // is webkit? http://stackoverflow.com/a/16459606/376773
	  // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
	  return typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance ||
	  // is firebug? http://stackoverflow.com/a/398120/376773
	  typeof window !== 'undefined' && window.console && (window.console.firebug || window.console.exception && window.console.table) ||
	  // is firefox >= v31?
	  // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
	  typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 ||
	  // double check webkit in userAgent just in case we are in a worker
	  typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
	}

	/**
	 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
	 */

	exports.formatters.j = function (v) {
	  try {
	    return JSON.stringify(v);
	  } catch (err) {
	    return '[UnexpectedJSONParseError]: ' + err.message;
	  }
	};

	/**
	 * Colorize log arguments if enabled.
	 *
	 * @api public
	 */

	function formatArgs(args) {
	  var useColors = this.useColors;

	  args[0] = (useColors ? '%c' : '') + this.namespace + (useColors ? ' %c' : ' ') + args[0] + (useColors ? '%c ' : ' ') + '+' + exports.humanize(this.diff);

	  if (!useColors) return;

	  var c = 'color: ' + this.color;
	  args.splice(1, 0, c, 'color: inherit');

	  // the final "%c" is somewhat tricky, because there could be other
	  // arguments passed either before or after the %c, so we need to
	  // figure out the correct index to insert the CSS into
	  var index = 0;
	  var lastC = 0;
	  args[0].replace(/%[a-zA-Z%]/g, function (match) {
	    if ('%%' === match) return;
	    index++;
	    if ('%c' === match) {
	      // we only are interested in the *last* %c
	      // (the user may have provided their own)
	      lastC = index;
	    }
	  });

	  args.splice(lastC, 0, c);
	}

	/**
	 * Invokes `console.log()` when available.
	 * No-op when `console.log` is not a "function".
	 *
	 * @api public
	 */

	function log() {
	  // this hackery is required for IE8/9, where
	  // the `console.log` function doesn't have 'apply'
	  return 'object' === (typeof console === 'undefined' ? 'undefined' : _typeof(console)) && console.log && Function.prototype.apply.call(console.log, console, arguments);
	}

	/**
	 * Save `namespaces`.
	 *
	 * @param {String} namespaces
	 * @api private
	 */

	function save(namespaces) {
	  try {
	    if (null == namespaces) {
	      exports.storage.removeItem('debug');
	    } else {
	      exports.storage.debug = namespaces;
	    }
	  } catch (e) {}
	}

	/**
	 * Load `namespaces`.
	 *
	 * @return {String} returns the previously persisted debug modes
	 * @api private
	 */

	function load() {
	  var r;
	  try {
	    r = exports.storage.debug;
	  } catch (e) {}

	  // If debug isn't set in LS, and we're in Electron, try to load $DEBUG
	  if (!r && typeof process !== 'undefined' && 'env' in process) {
	    r = process.env.DEBUG;
	  }

	  return r;
	}

	/**
	 * Enable namespaces listed in `localStorage.debug` initially.
	 */

	exports.enable(load());

	/**
	 * Localstorage attempts to return the localstorage.
	 *
	 * This is necessary because safari throws
	 * when a user disables cookies/localstorage
	 * and you attempt to access it.
	 *
	 * @return {LocalStorage}
	 * @api private
	 */

	function localstorage() {
	  try {
	    return window.localStorage;
	  } catch (e) {}
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(16)))

/***/ },
/* 79 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * This is the common logic for both the Node.js and web browser
	 * implementations of `debug()`.
	 *
	 * Expose `debug()` as the module.
	 */

	exports = module.exports = createDebug.debug = createDebug['default'] = createDebug;
	exports.coerce = coerce;
	exports.disable = disable;
	exports.enable = enable;
	exports.enabled = enabled;
	exports.humanize = __webpack_require__(80);

	/**
	 * The currently active debug mode names, and names to skip.
	 */

	exports.names = [];
	exports.skips = [];

	/**
	 * Map of special "%n" handling functions, for the debug "format" argument.
	 *
	 * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
	 */

	exports.formatters = {};

	/**
	 * Previous log timestamp.
	 */

	var prevTime;

	/**
	 * Select a color.
	 * @param {String} namespace
	 * @return {Number}
	 * @api private
	 */

	function selectColor(namespace) {
	  var hash = 0,
	      i;

	  for (i in namespace) {
	    hash = (hash << 5) - hash + namespace.charCodeAt(i);
	    hash |= 0; // Convert to 32bit integer
	  }

	  return exports.colors[Math.abs(hash) % exports.colors.length];
	}

	/**
	 * Create a debugger with the given `namespace`.
	 *
	 * @param {String} namespace
	 * @return {Function}
	 * @api public
	 */

	function createDebug(namespace) {

	  function debug() {
	    // disabled?
	    if (!debug.enabled) return;

	    var self = debug;

	    // set `diff` timestamp
	    var curr = +new Date();
	    var ms = curr - (prevTime || curr);
	    self.diff = ms;
	    self.prev = prevTime;
	    self.curr = curr;
	    prevTime = curr;

	    // turn the `arguments` into a proper Array
	    var args = new Array(arguments.length);
	    for (var i = 0; i < args.length; i++) {
	      args[i] = arguments[i];
	    }

	    args[0] = exports.coerce(args[0]);

	    if ('string' !== typeof args[0]) {
	      // anything else let's inspect with %O
	      args.unshift('%O');
	    }

	    // apply any `formatters` transformations
	    var index = 0;
	    args[0] = args[0].replace(/%([a-zA-Z%])/g, function (match, format) {
	      // if we encounter an escaped % then don't increase the array index
	      if (match === '%%') return match;
	      index++;
	      var formatter = exports.formatters[format];
	      if ('function' === typeof formatter) {
	        var val = args[index];
	        match = formatter.call(self, val);

	        // now we need to remove `args[index]` since it's inlined in the `format`
	        args.splice(index, 1);
	        index--;
	      }
	      return match;
	    });

	    // apply env-specific formatting (colors, etc.)
	    exports.formatArgs.call(self, args);

	    var logFn = debug.log || exports.log || console.log.bind(console);
	    logFn.apply(self, args);
	  }

	  debug.namespace = namespace;
	  debug.enabled = exports.enabled(namespace);
	  debug.useColors = exports.useColors();
	  debug.color = selectColor(namespace);

	  // env-specific initialization logic for debug instances
	  if ('function' === typeof exports.init) {
	    exports.init(debug);
	  }

	  return debug;
	}

	/**
	 * Enables a debug mode by namespaces. This can include modes
	 * separated by a colon and wildcards.
	 *
	 * @param {String} namespaces
	 * @api public
	 */

	function enable(namespaces) {
	  exports.save(namespaces);

	  exports.names = [];
	  exports.skips = [];

	  var split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
	  var len = split.length;

	  for (var i = 0; i < len; i++) {
	    if (!split[i]) continue; // ignore empty strings
	    namespaces = split[i].replace(/\*/g, '.*?');
	    if (namespaces[0] === '-') {
	      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
	    } else {
	      exports.names.push(new RegExp('^' + namespaces + '$'));
	    }
	  }
	}

	/**
	 * Disable debug output.
	 *
	 * @api public
	 */

	function disable() {
	  exports.enable('');
	}

	/**
	 * Returns true if the given mode name is enabled, false otherwise.
	 *
	 * @param {String} name
	 * @return {Boolean}
	 * @api public
	 */

	function enabled(name) {
	  var i, len;
	  for (i = 0, len = exports.skips.length; i < len; i++) {
	    if (exports.skips[i].test(name)) {
	      return false;
	    }
	  }
	  for (i = 0, len = exports.names.length; i < len; i++) {
	    if (exports.names[i].test(name)) {
	      return true;
	    }
	  }
	  return false;
	}

	/**
	 * Coerce `val`.
	 *
	 * @param {Mixed} val
	 * @return {Mixed}
	 * @api private
	 */

	function coerce(val) {
	  if (val instanceof Error) return val.stack || val.message;
	  return val;
	}

/***/ },
/* 80 */
/***/ function(module, exports) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	/**
	 * Helpers.
	 */

	var s = 1000;
	var m = s * 60;
	var h = m * 60;
	var d = h * 24;
	var y = d * 365.25;

	/**
	 * Parse or format the given `val`.
	 *
	 * Options:
	 *
	 *  - `long` verbose formatting [false]
	 *
	 * @param {String|Number} val
	 * @param {Object} [options]
	 * @throws {Error} throw an error if val is not a non-empty string or a number
	 * @return {String|Number}
	 * @api public
	 */

	module.exports = function (val, options) {
	  options = options || {};
	  var type = typeof val === 'undefined' ? 'undefined' : _typeof(val);
	  if (type === 'string' && val.length > 0) {
	    return parse(val);
	  } else if (type === 'number' && isNaN(val) === false) {
	    return options.long ? fmtLong(val) : fmtShort(val);
	  }
	  throw new Error('val is not a non-empty string or a valid number. val=' + JSON.stringify(val));
	};

	/**
	 * Parse the given `str` and return milliseconds.
	 *
	 * @param {String} str
	 * @return {Number}
	 * @api private
	 */

	function parse(str) {
	  str = String(str);
	  if (str.length > 100) {
	    return;
	  }
	  var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(str);
	  if (!match) {
	    return;
	  }
	  var n = parseFloat(match[1]);
	  var type = (match[2] || 'ms').toLowerCase();
	  switch (type) {
	    case 'years':
	    case 'year':
	    case 'yrs':
	    case 'yr':
	    case 'y':
	      return n * y;
	    case 'days':
	    case 'day':
	    case 'd':
	      return n * d;
	    case 'hours':
	    case 'hour':
	    case 'hrs':
	    case 'hr':
	    case 'h':
	      return n * h;
	    case 'minutes':
	    case 'minute':
	    case 'mins':
	    case 'min':
	    case 'm':
	      return n * m;
	    case 'seconds':
	    case 'second':
	    case 'secs':
	    case 'sec':
	    case 's':
	      return n * s;
	    case 'milliseconds':
	    case 'millisecond':
	    case 'msecs':
	    case 'msec':
	    case 'ms':
	      return n;
	    default:
	      return undefined;
	  }
	}

	/**
	 * Short format for `ms`.
	 *
	 * @param {Number} ms
	 * @return {String}
	 * @api private
	 */

	function fmtShort(ms) {
	  if (ms >= d) {
	    return Math.round(ms / d) + 'd';
	  }
	  if (ms >= h) {
	    return Math.round(ms / h) + 'h';
	  }
	  if (ms >= m) {
	    return Math.round(ms / m) + 'm';
	  }
	  if (ms >= s) {
	    return Math.round(ms / s) + 's';
	  }
	  return ms + 'ms';
	}

	/**
	 * Long format for `ms`.
	 *
	 * @param {Number} ms
	 * @return {String}
	 * @api private
	 */

	function fmtLong(ms) {
	  return plural(ms, d, 'day') || plural(ms, h, 'hour') || plural(ms, m, 'minute') || plural(ms, s, 'second') || ms + ' ms';
	}

	/**
	 * Pluralization helper.
	 */

	function plural(ms, n, name) {
	  if (ms < n) {
	    return;
	  }
	  if (ms < n * 1.5) {
	    return Math.floor(ms / n) + ' ' + name;
	  }
	  return Math.ceil(ms / n) + ' ' + name + 's';
	}

/***/ },
/* 81 */
/***/ function(module, exports) {

	'use strict';

	if (typeof Object.create === 'function') {
	  // implementation from standard node.js 'util' module
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor;
	    ctor.prototype = Object.create(superCtor.prototype, {
	      constructor: {
	        value: ctor,
	        enumerable: false,
	        writable: true,
	        configurable: true
	      }
	    });
	  };
	} else {
	  // old school shim for old browsers
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor;
	    var TempCtor = function TempCtor() {};
	    TempCtor.prototype = superCtor.prototype;
	    ctor.prototype = new TempCtor();
	    ctor.prototype.constructor = ctor;
	  };
	}

/***/ },
/* 82 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var inherits = __webpack_require__(81),
	    EventTarget = __webpack_require__(83);

	function EventEmitter() {
	  EventTarget.call(this);
	}

	inherits(EventEmitter, EventTarget);

	EventEmitter.prototype.removeAllListeners = function (type) {
	  if (type) {
	    delete this._listeners[type];
	  } else {
	    this._listeners = {};
	  }
	};

	EventEmitter.prototype.once = function (type, listener) {
	  var self = this,
	      fired = false;

	  function g() {
	    self.removeListener(type, g);

	    if (!fired) {
	      fired = true;
	      listener.apply(this, arguments);
	    }
	  }

	  this.on(type, g);
	};

	EventEmitter.prototype.emit = function (type) {
	  var listeners = this._listeners[type];
	  if (!listeners) {
	    return;
	  }
	  var args = Array.prototype.slice.call(arguments, 1);
	  for (var i = 0; i < listeners.length; i++) {
	    listeners[i].apply(this, args);
	  }
	};

	EventEmitter.prototype.on = EventEmitter.prototype.addListener = EventTarget.prototype.addEventListener;
	EventEmitter.prototype.removeListener = EventTarget.prototype.removeEventListener;

	module.exports.EventEmitter = EventEmitter;

/***/ },
/* 83 */
/***/ function(module, exports) {

	'use strict';

	/* Simplified implementation of DOM2 EventTarget.
	 *   http://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-EventTarget
	 */

	function EventTarget() {
	  this._listeners = {};
	}

	EventTarget.prototype.addEventListener = function (eventType, listener) {
	  if (!(eventType in this._listeners)) {
	    this._listeners[eventType] = [];
	  }
	  var arr = this._listeners[eventType];
	  // #4
	  if (arr.indexOf(listener) === -1) {
	    // Make a copy so as not to interfere with a current dispatchEvent.
	    arr = arr.concat([listener]);
	  }
	  this._listeners[eventType] = arr;
	};

	EventTarget.prototype.removeEventListener = function (eventType, listener) {
	  var arr = this._listeners[eventType];
	  if (!arr) {
	    return;
	  }
	  var idx = arr.indexOf(listener);
	  if (idx !== -1) {
	    if (arr.length > 1) {
	      // Make a copy so as not to interfere with a current dispatchEvent.
	      this._listeners[eventType] = arr.slice(0, idx).concat(arr.slice(idx + 1));
	    } else {
	      delete this._listeners[eventType];
	    }
	    return;
	  }
	};

	EventTarget.prototype.dispatchEvent = function (event) {
	  var t = event.type;
	  var args = Array.prototype.slice.call(arguments, 0);
	  // TODO: This doesn't match the real behavior; per spec, onfoo get
	  // their place in line from the /first/ time they're set from
	  // non-null. Although WebKit bumps it to the end every time it's
	  // set.
	  if (this['on' + t]) {
	    this['on' + t].apply(this, args);
	  }
	  if (t in this._listeners) {
	    // Grab a reference to the listeners list. removeEventListener may alter the list.
	    var listeners = this._listeners[t];
	    for (var i = 0; i < listeners.length; i++) {
	      listeners[i].apply(this, args);
	    }
	  }
	};

	module.exports = EventTarget;

/***/ },
/* 84 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {"use strict";

	module.exports = global.WebSocket || global.MozWebSocket;
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 85 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var inherits = __webpack_require__(81),
	    AjaxBasedTransport = __webpack_require__(86),
	    XhrReceiver = __webpack_require__(90),
	    XHRCorsObject = __webpack_require__(91),
	    XHRLocalObject = __webpack_require__(93),
	    browser = __webpack_require__(94);

	function XhrStreamingTransport(transUrl) {
	  if (!XHRLocalObject.enabled && !XHRCorsObject.enabled) {
	    throw new Error('Transport created when disabled');
	  }
	  AjaxBasedTransport.call(this, transUrl, '/xhr_streaming', XhrReceiver, XHRCorsObject);
	}

	inherits(XhrStreamingTransport, AjaxBasedTransport);

	XhrStreamingTransport.enabled = function (info) {
	  if (info.nullOrigin) {
	    return false;
	  }
	  // Opera doesn't support xhr-streaming #60
	  // But it might be able to #92
	  if (browser.isOpera()) {
	    return false;
	  }

	  return XHRCorsObject.enabled;
	};

	XhrStreamingTransport.transportName = 'xhr-streaming';
	XhrStreamingTransport.roundTrips = 2; // preflight, ajax

	// Safari gets confused when a streaming ajax request is started
	// before onload. This causes the load indicator to spin indefinetely.
	// Only require body when used in a browser
	XhrStreamingTransport.needBody = !!global.document;

	module.exports = XhrStreamingTransport;
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 86 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	var inherits = __webpack_require__(81),
	    urlUtils = __webpack_require__(74),
	    SenderReceiver = __webpack_require__(87);

	var debug = function debug() {};
	if (process.env.NODE_ENV !== 'production') {
	  debug = __webpack_require__(78)('sockjs-client:ajax-based');
	}

	function createAjaxSender(AjaxObject) {
	  return function (url, payload, callback) {
	    debug('create ajax sender', url, payload);
	    var opt = {};
	    if (typeof payload === 'string') {
	      opt.headers = { 'Content-type': 'text/plain' };
	    }
	    var ajaxUrl = urlUtils.addPath(url, '/xhr_send');
	    var xo = new AjaxObject('POST', ajaxUrl, payload, opt);
	    xo.once('finish', function (status) {
	      debug('finish', status);
	      xo = null;

	      if (status !== 200 && status !== 204) {
	        return callback(new Error('http status ' + status));
	      }
	      callback();
	    });
	    return function () {
	      debug('abort');
	      xo.close();
	      xo = null;

	      var err = new Error('Aborted');
	      err.code = 1000;
	      callback(err);
	    };
	  };
	}

	function AjaxBasedTransport(transUrl, urlSuffix, Receiver, AjaxObject) {
	  SenderReceiver.call(this, transUrl, urlSuffix, createAjaxSender(AjaxObject), Receiver, AjaxObject);
	}

	inherits(AjaxBasedTransport, SenderReceiver);

	module.exports = AjaxBasedTransport;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(16)))

/***/ },
/* 87 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	var inherits = __webpack_require__(81),
	    urlUtils = __webpack_require__(74),
	    BufferedSender = __webpack_require__(88),
	    Polling = __webpack_require__(89);

	var debug = function debug() {};
	if (process.env.NODE_ENV !== 'production') {
	  debug = __webpack_require__(78)('sockjs-client:sender-receiver');
	}

	function SenderReceiver(transUrl, urlSuffix, senderFunc, Receiver, AjaxObject) {
	  var pollUrl = urlUtils.addPath(transUrl, urlSuffix);
	  debug(pollUrl);
	  var self = this;
	  BufferedSender.call(this, transUrl, senderFunc);

	  this.poll = new Polling(Receiver, pollUrl, AjaxObject);
	  this.poll.on('message', function (msg) {
	    debug('poll message', msg);
	    self.emit('message', msg);
	  });
	  this.poll.once('close', function (code, reason) {
	    debug('poll close', code, reason);
	    self.poll = null;
	    self.emit('close', code, reason);
	    self.close();
	  });
	}

	inherits(SenderReceiver, BufferedSender);

	SenderReceiver.prototype.close = function () {
	  debug('close');
	  this.removeAllListeners();
	  if (this.poll) {
	    this.poll.abort();
	    this.poll = null;
	  }
	  this.stop();
	};

	module.exports = SenderReceiver;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(16)))

/***/ },
/* 88 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	var inherits = __webpack_require__(81),
	    EventEmitter = __webpack_require__(82).EventEmitter;

	var debug = function debug() {};
	if (process.env.NODE_ENV !== 'production') {
	  debug = __webpack_require__(78)('sockjs-client:buffered-sender');
	}

	function BufferedSender(url, sender) {
	  debug(url);
	  EventEmitter.call(this);
	  this.sendBuffer = [];
	  this.sender = sender;
	  this.url = url;
	}

	inherits(BufferedSender, EventEmitter);

	BufferedSender.prototype.send = function (message) {
	  debug('send', message);
	  this.sendBuffer.push(message);
	  if (!this.sendStop) {
	    this.sendSchedule();
	  }
	};

	// For polling transports in a situation when in the message callback,
	// new message is being send. If the sending connection was started
	// before receiving one, it is possible to saturate the network and
	// timeout due to the lack of receiving socket. To avoid that we delay
	// sending messages by some small time, in order to let receiving
	// connection be started beforehand. This is only a halfmeasure and
	// does not fix the big problem, but it does make the tests go more
	// stable on slow networks.
	BufferedSender.prototype.sendScheduleWait = function () {
	  debug('sendScheduleWait');
	  var self = this;
	  var tref;
	  this.sendStop = function () {
	    debug('sendStop');
	    self.sendStop = null;
	    clearTimeout(tref);
	  };
	  tref = setTimeout(function () {
	    debug('timeout');
	    self.sendStop = null;
	    self.sendSchedule();
	  }, 25);
	};

	BufferedSender.prototype.sendSchedule = function () {
	  debug('sendSchedule', this.sendBuffer.length);
	  var self = this;
	  if (this.sendBuffer.length > 0) {
	    var payload = '[' + this.sendBuffer.join(',') + ']';
	    this.sendStop = this.sender(this.url, payload, function (err) {
	      self.sendStop = null;
	      if (err) {
	        debug('error', err);
	        self.emit('close', err.code || 1006, 'Sending error: ' + err);
	        self._cleanup();
	      } else {
	        self.sendScheduleWait();
	      }
	    });
	    this.sendBuffer = [];
	  }
	};

	BufferedSender.prototype._cleanup = function () {
	  debug('_cleanup');
	  this.removeAllListeners();
	};

	BufferedSender.prototype.stop = function () {
	  debug('stop');
	  this._cleanup();
	  if (this.sendStop) {
	    this.sendStop();
	    this.sendStop = null;
	  }
	};

	module.exports = BufferedSender;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(16)))

/***/ },
/* 89 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	var inherits = __webpack_require__(81),
	    EventEmitter = __webpack_require__(82).EventEmitter;

	var debug = function debug() {};
	if (process.env.NODE_ENV !== 'production') {
	  debug = __webpack_require__(78)('sockjs-client:polling');
	}

	function Polling(Receiver, receiveUrl, AjaxObject) {
	  debug(receiveUrl);
	  EventEmitter.call(this);
	  this.Receiver = Receiver;
	  this.receiveUrl = receiveUrl;
	  this.AjaxObject = AjaxObject;
	  this._scheduleReceiver();
	}

	inherits(Polling, EventEmitter);

	Polling.prototype._scheduleReceiver = function () {
	  debug('_scheduleReceiver');
	  var self = this;
	  var poll = this.poll = new this.Receiver(this.receiveUrl, this.AjaxObject);

	  poll.on('message', function (msg) {
	    debug('message', msg);
	    self.emit('message', msg);
	  });

	  poll.once('close', function (code, reason) {
	    debug('close', code, reason, self.pollIsClosing);
	    self.poll = poll = null;

	    if (!self.pollIsClosing) {
	      if (reason === 'network') {
	        self._scheduleReceiver();
	      } else {
	        self.emit('close', code || 1006, reason);
	        self.removeAllListeners();
	      }
	    }
	  });
	};

	Polling.prototype.abort = function () {
	  debug('abort');
	  this.removeAllListeners();
	  this.pollIsClosing = true;
	  if (this.poll) {
	    this.poll.abort();
	  }
	};

	module.exports = Polling;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(16)))

/***/ },
/* 90 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	var inherits = __webpack_require__(81),
	    EventEmitter = __webpack_require__(82).EventEmitter;

	var debug = function debug() {};
	if (process.env.NODE_ENV !== 'production') {
	  debug = __webpack_require__(78)('sockjs-client:receiver:xhr');
	}

	function XhrReceiver(url, AjaxObject) {
	  debug(url);
	  EventEmitter.call(this);
	  var self = this;

	  this.bufferPosition = 0;

	  this.xo = new AjaxObject('POST', url, null);
	  this.xo.on('chunk', this._chunkHandler.bind(this));
	  this.xo.once('finish', function (status, text) {
	    debug('finish', status, text);
	    self._chunkHandler(status, text);
	    self.xo = null;
	    var reason = status === 200 ? 'network' : 'permanent';
	    debug('close', reason);
	    self.emit('close', null, reason);
	    self._cleanup();
	  });
	}

	inherits(XhrReceiver, EventEmitter);

	XhrReceiver.prototype._chunkHandler = function (status, text) {
	  debug('_chunkHandler', status);
	  if (status !== 200 || !text) {
	    return;
	  }

	  for (var idx = -1;; this.bufferPosition += idx + 1) {
	    var buf = text.slice(this.bufferPosition);
	    idx = buf.indexOf('\n');
	    if (idx === -1) {
	      break;
	    }
	    var msg = buf.slice(0, idx);
	    if (msg) {
	      debug('message', msg);
	      this.emit('message', msg);
	    }
	  }
	};

	XhrReceiver.prototype._cleanup = function () {
	  debug('_cleanup');
	  this.removeAllListeners();
	};

	XhrReceiver.prototype.abort = function () {
	  debug('abort');
	  if (this.xo) {
	    this.xo.close();
	    debug('close');
	    this.emit('close', null, 'user');
	    this.xo = null;
	  }
	  this._cleanup();
	};

	module.exports = XhrReceiver;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(16)))

/***/ },
/* 91 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var inherits = __webpack_require__(81),
	    XhrDriver = __webpack_require__(92);

	function XHRCorsObject(method, url, payload, opts) {
	  XhrDriver.call(this, method, url, payload, opts);
	}

	inherits(XHRCorsObject, XhrDriver);

	XHRCorsObject.enabled = XhrDriver.enabled && XhrDriver.supportsCORS;

	module.exports = XHRCorsObject;

/***/ },
/* 92 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global, process) {'use strict';

	var EventEmitter = __webpack_require__(82).EventEmitter,
	    inherits = __webpack_require__(81),
	    utils = __webpack_require__(71),
	    urlUtils = __webpack_require__(74),
	    XHR = global.XMLHttpRequest;

	var debug = function debug() {};
	if (process.env.NODE_ENV !== 'production') {
	  debug = __webpack_require__(78)('sockjs-client:browser:xhr');
	}

	function AbstractXHRObject(method, url, payload, opts) {
	  debug(method, url);
	  var self = this;
	  EventEmitter.call(this);

	  setTimeout(function () {
	    self._start(method, url, payload, opts);
	  }, 0);
	}

	inherits(AbstractXHRObject, EventEmitter);

	AbstractXHRObject.prototype._start = function (method, url, payload, opts) {
	  var self = this;

	  try {
	    this.xhr = new XHR();
	  } catch (x) {}

	  if (!this.xhr) {
	    debug('no xhr');
	    this.emit('finish', 0, 'no xhr support');
	    this._cleanup();
	    return;
	  }

	  // several browsers cache POSTs
	  url = urlUtils.addQuery(url, 't=' + +new Date());

	  // Explorer tends to keep connection open, even after the
	  // tab gets closed: http://bugs.jquery.com/ticket/5280
	  this.unloadRef = utils.unloadAdd(function () {
	    debug('unload cleanup');
	    self._cleanup(true);
	  });
	  try {
	    this.xhr.open(method, url, true);
	    if (this.timeout && 'timeout' in this.xhr) {
	      this.xhr.timeout = this.timeout;
	      this.xhr.ontimeout = function () {
	        debug('xhr timeout');
	        self.emit('finish', 0, '');
	        self._cleanup(false);
	      };
	    }
	  } catch (e) {
	    debug('exception', e);
	    // IE raises an exception on wrong port.
	    this.emit('finish', 0, '');
	    this._cleanup(false);
	    return;
	  }

	  if ((!opts || !opts.noCredentials) && AbstractXHRObject.supportsCORS) {
	    debug('withCredentials');
	    // Mozilla docs says https://developer.mozilla.org/en/XMLHttpRequest :
	    // "This never affects same-site requests."

	    this.xhr.withCredentials = 'true';
	  }
	  if (opts && opts.headers) {
	    for (var key in opts.headers) {
	      this.xhr.setRequestHeader(key, opts.headers[key]);
	    }
	  }

	  this.xhr.onreadystatechange = function () {
	    if (self.xhr) {
	      var x = self.xhr;
	      var text, status;
	      debug('readyState', x.readyState);
	      switch (x.readyState) {
	        case 3:
	          // IE doesn't like peeking into responseText or status
	          // on Microsoft.XMLHTTP and readystate=3
	          try {
	            status = x.status;
	            text = x.responseText;
	          } catch (e) {}
	          debug('status', status);
	          // IE returns 1223 for 204: http://bugs.jquery.com/ticket/1450
	          if (status === 1223) {
	            status = 204;
	          }

	          // IE does return readystate == 3 for 404 answers.
	          if (status === 200 && text && text.length > 0) {
	            debug('chunk');
	            self.emit('chunk', status, text);
	          }
	          break;
	        case 4:
	          status = x.status;
	          debug('status', status);
	          // IE returns 1223 for 204: http://bugs.jquery.com/ticket/1450
	          if (status === 1223) {
	            status = 204;
	          }
	          // IE returns this for a bad port
	          // http://msdn.microsoft.com/en-us/library/windows/desktop/aa383770(v=vs.85).aspx
	          if (status === 12005 || status === 12029) {
	            status = 0;
	          }

	          debug('finish', status, x.responseText);
	          self.emit('finish', status, x.responseText);
	          self._cleanup(false);
	          break;
	      }
	    }
	  };

	  try {
	    self.xhr.send(payload);
	  } catch (e) {
	    self.emit('finish', 0, '');
	    self._cleanup(false);
	  }
	};

	AbstractXHRObject.prototype._cleanup = function (abort) {
	  debug('cleanup');
	  if (!this.xhr) {
	    return;
	  }
	  this.removeAllListeners();
	  utils.unloadDel(this.unloadRef);

	  // IE needs this field to be a function
	  this.xhr.onreadystatechange = function () {};
	  if (this.xhr.ontimeout) {
	    this.xhr.ontimeout = null;
	  }

	  if (abort) {
	    try {
	      this.xhr.abort();
	    } catch (x) {}
	  }
	  this.unloadRef = this.xhr = null;
	};

	AbstractXHRObject.prototype.close = function () {
	  debug('close');
	  this._cleanup(true);
	};

	AbstractXHRObject.enabled = !!XHR;
	// override XMLHttpRequest for IE6/7
	// obfuscate to avoid firewalls
	var axo = ['Active'].concat('Object').join('X');
	if (!AbstractXHRObject.enabled && axo in global) {
	  debug('overriding xmlhttprequest');
	  XHR = function XHR() {
	    try {
	      return new global[axo]('Microsoft.XMLHTTP');
	    } catch (e) {
	      return null;
	    }
	  };
	  AbstractXHRObject.enabled = !!new XHR();
	}

	var cors = false;
	try {
	  cors = 'withCredentials' in new XHR();
	} catch (ignored) {}

	AbstractXHRObject.supportsCORS = cors;

	module.exports = AbstractXHRObject;
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(16)))

/***/ },
/* 93 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var inherits = __webpack_require__(81),
	    XhrDriver = __webpack_require__(92);

	function XHRLocalObject(method, url, payload /*, opts */) {
	  XhrDriver.call(this, method, url, payload, {
	    noCredentials: true
	  });
	}

	inherits(XHRLocalObject, XhrDriver);

	XHRLocalObject.enabled = XhrDriver.enabled;

	module.exports = XHRLocalObject;

/***/ },
/* 94 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	module.exports = {
	  isOpera: function isOpera() {
	    return global.navigator && /opera/i.test(global.navigator.userAgent);
	  },

	  isKonqueror: function isKonqueror() {
	    return global.navigator && /konqueror/i.test(global.navigator.userAgent);
	  }

	  // #187 wrap document.domain in try/catch because of WP8 from file:///
	  , hasDomain: function hasDomain() {
	    // non-browser client always has a domain
	    if (!global.document) {
	      return true;
	    }

	    try {
	      return !!global.document.domain;
	    } catch (e) {
	      return false;
	    }
	  }
	};
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 95 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var inherits = __webpack_require__(81),
	    AjaxBasedTransport = __webpack_require__(86),
	    XhrReceiver = __webpack_require__(90),
	    XDRObject = __webpack_require__(96);

	// According to:
	//   http://stackoverflow.com/questions/1641507/detect-browser-support-for-cross-domain-xmlhttprequests
	//   http://hacks.mozilla.org/2009/07/cross-site-xmlhttprequest-with-cors/

	function XdrStreamingTransport(transUrl) {
	  if (!XDRObject.enabled) {
	    throw new Error('Transport created when disabled');
	  }
	  AjaxBasedTransport.call(this, transUrl, '/xhr_streaming', XhrReceiver, XDRObject);
	}

	inherits(XdrStreamingTransport, AjaxBasedTransport);

	XdrStreamingTransport.enabled = function (info) {
	  if (info.cookie_needed || info.nullOrigin) {
	    return false;
	  }
	  return XDRObject.enabled && info.sameScheme;
	};

	XdrStreamingTransport.transportName = 'xdr-streaming';
	XdrStreamingTransport.roundTrips = 2; // preflight, ajax

	module.exports = XdrStreamingTransport;

/***/ },
/* 96 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process, global) {'use strict';

	var EventEmitter = __webpack_require__(82).EventEmitter,
	    inherits = __webpack_require__(81),
	    eventUtils = __webpack_require__(71),
	    browser = __webpack_require__(94),
	    urlUtils = __webpack_require__(74);

	var debug = function debug() {};
	if (process.env.NODE_ENV !== 'production') {
	  debug = __webpack_require__(78)('sockjs-client:sender:xdr');
	}

	// References:
	//   http://ajaxian.com/archives/100-line-ajax-wrapper
	//   http://msdn.microsoft.com/en-us/library/cc288060(v=VS.85).aspx

	function XDRObject(method, url, payload) {
	  debug(method, url);
	  var self = this;
	  EventEmitter.call(this);

	  setTimeout(function () {
	    self._start(method, url, payload);
	  }, 0);
	}

	inherits(XDRObject, EventEmitter);

	XDRObject.prototype._start = function (method, url, payload) {
	  debug('_start');
	  var self = this;
	  var xdr = new global.XDomainRequest();
	  // IE caches even POSTs
	  url = urlUtils.addQuery(url, 't=' + +new Date());

	  xdr.onerror = function () {
	    debug('onerror');
	    self._error();
	  };
	  xdr.ontimeout = function () {
	    debug('ontimeout');
	    self._error();
	  };
	  xdr.onprogress = function () {
	    debug('progress', xdr.responseText);
	    self.emit('chunk', 200, xdr.responseText);
	  };
	  xdr.onload = function () {
	    debug('load');
	    self.emit('finish', 200, xdr.responseText);
	    self._cleanup(false);
	  };
	  this.xdr = xdr;
	  this.unloadRef = eventUtils.unloadAdd(function () {
	    self._cleanup(true);
	  });
	  try {
	    // Fails with AccessDenied if port number is bogus
	    this.xdr.open(method, url);
	    if (this.timeout) {
	      this.xdr.timeout = this.timeout;
	    }
	    this.xdr.send(payload);
	  } catch (x) {
	    this._error();
	  }
	};

	XDRObject.prototype._error = function () {
	  this.emit('finish', 0, '');
	  this._cleanup(false);
	};

	XDRObject.prototype._cleanup = function (abort) {
	  debug('cleanup', abort);
	  if (!this.xdr) {
	    return;
	  }
	  this.removeAllListeners();
	  eventUtils.unloadDel(this.unloadRef);

	  this.xdr.ontimeout = this.xdr.onerror = this.xdr.onprogress = this.xdr.onload = null;
	  if (abort) {
	    try {
	      this.xdr.abort();
	    } catch (x) {}
	  }
	  this.unloadRef = this.xdr = null;
	};

	XDRObject.prototype.close = function () {
	  debug('close');
	  this._cleanup(true);
	};

	// IE 8/9 if the request target uses the same scheme - #79
	XDRObject.enabled = !!(global.XDomainRequest && browser.hasDomain());

	module.exports = XDRObject;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(16), (function() { return this; }())))

/***/ },
/* 97 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var inherits = __webpack_require__(81),
	    AjaxBasedTransport = __webpack_require__(86),
	    EventSourceReceiver = __webpack_require__(98),
	    XHRCorsObject = __webpack_require__(91),
	    EventSourceDriver = __webpack_require__(99);

	function EventSourceTransport(transUrl) {
	  if (!EventSourceTransport.enabled()) {
	    throw new Error('Transport created when disabled');
	  }

	  AjaxBasedTransport.call(this, transUrl, '/eventsource', EventSourceReceiver, XHRCorsObject);
	}

	inherits(EventSourceTransport, AjaxBasedTransport);

	EventSourceTransport.enabled = function () {
	  return !!EventSourceDriver;
	};

	EventSourceTransport.transportName = 'eventsource';
	EventSourceTransport.roundTrips = 2;

	module.exports = EventSourceTransport;

/***/ },
/* 98 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	var inherits = __webpack_require__(81),
	    EventEmitter = __webpack_require__(82).EventEmitter,
	    EventSourceDriver = __webpack_require__(99);

	var debug = function debug() {};
	if (process.env.NODE_ENV !== 'production') {
	  debug = __webpack_require__(78)('sockjs-client:receiver:eventsource');
	}

	function EventSourceReceiver(url) {
	  debug(url);
	  EventEmitter.call(this);

	  var self = this;
	  var es = this.es = new EventSourceDriver(url);
	  es.onmessage = function (e) {
	    debug('message', e.data);
	    self.emit('message', decodeURI(e.data));
	  };
	  es.onerror = function (e) {
	    debug('error', es.readyState, e);
	    // ES on reconnection has readyState = 0 or 1.
	    // on network error it's CLOSED = 2
	    var reason = es.readyState !== 2 ? 'network' : 'permanent';
	    self._cleanup();
	    self._close(reason);
	  };
	}

	inherits(EventSourceReceiver, EventEmitter);

	EventSourceReceiver.prototype.abort = function () {
	  debug('abort');
	  this._cleanup();
	  this._close('user');
	};

	EventSourceReceiver.prototype._cleanup = function () {
	  debug('cleanup');
	  var es = this.es;
	  if (es) {
	    es.onmessage = es.onerror = null;
	    es.close();
	    this.es = null;
	  }
	};

	EventSourceReceiver.prototype._close = function (reason) {
	  debug('close', reason);
	  var self = this;
	  // Safari and chrome < 15 crash if we close window before
	  // waiting for ES cleanup. See:
	  // https://code.google.com/p/chromium/issues/detail?id=89155
	  setTimeout(function () {
	    self.emit('close', null, reason);
	    self.removeAllListeners();
	  }, 200);
	};

	module.exports = EventSourceReceiver;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(16)))

/***/ },
/* 99 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {"use strict";

	module.exports = global.EventSource;
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 100 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var inherits = __webpack_require__(81),
	    IframeTransport = __webpack_require__(101),
	    objectUtils = __webpack_require__(106);

	module.exports = function (transport) {

	  function IframeWrapTransport(transUrl, baseUrl) {
	    IframeTransport.call(this, transport.transportName, transUrl, baseUrl);
	  }

	  inherits(IframeWrapTransport, IframeTransport);

	  IframeWrapTransport.enabled = function (url, info) {
	    if (!global.document) {
	      return false;
	    }

	    var iframeInfo = objectUtils.extend({}, info);
	    iframeInfo.sameOrigin = true;
	    return transport.enabled(iframeInfo) && IframeTransport.enabled();
	  };

	  IframeWrapTransport.transportName = 'iframe-' + transport.transportName;
	  IframeWrapTransport.needBody = true;
	  IframeWrapTransport.roundTrips = IframeTransport.roundTrips + transport.roundTrips - 1; // html, javascript (2) + transport - no CORS (1)

	  IframeWrapTransport.facadeTransport = transport;

	  return IframeWrapTransport;
	};
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 101 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	// Few cool transports do work only for same-origin. In order to make
	// them work cross-domain we shall use iframe, served from the
	// remote domain. New browsers have capabilities to communicate with
	// cross domain iframe using postMessage(). In IE it was implemented
	// from IE 8+, but of course, IE got some details wrong:
	//    http://msdn.microsoft.com/en-us/library/cc197015(v=VS.85).aspx
	//    http://stevesouders.com/misc/test-postmessage.php

	var inherits = __webpack_require__(81),
	    JSON3 = __webpack_require__(102),
	    EventEmitter = __webpack_require__(82).EventEmitter,
	    version = __webpack_require__(104),
	    urlUtils = __webpack_require__(74),
	    iframeUtils = __webpack_require__(105),
	    eventUtils = __webpack_require__(71),
	    random = __webpack_require__(72);

	var debug = function debug() {};
	if (process.env.NODE_ENV !== 'production') {
	  debug = __webpack_require__(78)('sockjs-client:transport:iframe');
	}

	function IframeTransport(transport, transUrl, baseUrl) {
	  if (!IframeTransport.enabled()) {
	    throw new Error('Transport created when disabled');
	  }
	  EventEmitter.call(this);

	  var self = this;
	  this.origin = urlUtils.getOrigin(baseUrl);
	  this.baseUrl = baseUrl;
	  this.transUrl = transUrl;
	  this.transport = transport;
	  this.windowId = random.string(8);

	  var iframeUrl = urlUtils.addPath(baseUrl, '/iframe.html') + '#' + this.windowId;
	  debug(transport, transUrl, iframeUrl);

	  this.iframeObj = iframeUtils.createIframe(iframeUrl, function (r) {
	    debug('err callback');
	    self.emit('close', 1006, 'Unable to load an iframe (' + r + ')');
	    self.close();
	  });

	  this.onmessageCallback = this._message.bind(this);
	  eventUtils.attachEvent('message', this.onmessageCallback);
	}

	inherits(IframeTransport, EventEmitter);

	IframeTransport.prototype.close = function () {
	  debug('close');
	  this.removeAllListeners();
	  if (this.iframeObj) {
	    eventUtils.detachEvent('message', this.onmessageCallback);
	    try {
	      // When the iframe is not loaded, IE raises an exception
	      // on 'contentWindow'.
	      this.postMessage('c');
	    } catch (x) {}
	    this.iframeObj.cleanup();
	    this.iframeObj = null;
	    this.onmessageCallback = this.iframeObj = null;
	  }
	};

	IframeTransport.prototype._message = function (e) {
	  debug('message', e.data);
	  if (!urlUtils.isOriginEqual(e.origin, this.origin)) {
	    debug('not same origin', e.origin, this.origin);
	    return;
	  }

	  var iframeMessage;
	  try {
	    iframeMessage = JSON3.parse(e.data);
	  } catch (ignored) {
	    debug('bad json', e.data);
	    return;
	  }

	  if (iframeMessage.windowId !== this.windowId) {
	    debug('mismatched window id', iframeMessage.windowId, this.windowId);
	    return;
	  }

	  switch (iframeMessage.type) {
	    case 's':
	      this.iframeObj.loaded();
	      // window global dependency
	      this.postMessage('s', JSON3.stringify([version, this.transport, this.transUrl, this.baseUrl]));
	      break;
	    case 't':
	      this.emit('message', iframeMessage.data);
	      break;
	    case 'c':
	      var cdata;
	      try {
	        cdata = JSON3.parse(iframeMessage.data);
	      } catch (ignored) {
	        debug('bad json', iframeMessage.data);
	        return;
	      }
	      this.emit('close', cdata[0], cdata[1]);
	      this.close();
	      break;
	  }
	};

	IframeTransport.prototype.postMessage = function (type, data) {
	  debug('postMessage', type, data);
	  this.iframeObj.post(JSON3.stringify({
	    windowId: this.windowId,
	    type: type,
	    data: data || ''
	  }), this.origin);
	};

	IframeTransport.prototype.send = function (message) {
	  debug('send', message);
	  this.postMessage('m', message);
	};

	IframeTransport.enabled = function () {
	  return iframeUtils.iframeEnabled;
	};

	IframeTransport.transportName = 'iframe';
	IframeTransport.roundTrips = 2;

	module.exports = IframeTransport;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(16)))

/***/ },
/* 102 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module, global) {"use strict";

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	/*! JSON v3.3.2 | http://bestiejs.github.io/json3 | Copyright 2012-2014, Kit Cambridge | http://kit.mit-license.org */
	;(function () {
	  // Detect the `define` function exposed by asynchronous module loaders. The
	  // strict `define` check is necessary for compatibility with `r.js`.
	  var isLoader = "function" === "function" && __webpack_require__(103);

	  // A set of types used to distinguish objects from primitives.
	  var objectTypes = {
	    "function": true,
	    "object": true
	  };

	  // Detect the `exports` object exposed by CommonJS implementations.
	  var freeExports = objectTypes[ false ? "undefined" : _typeof(exports)] && exports && !exports.nodeType && exports;

	  // Use the `global` object exposed by Node (including Browserify via
	  // `insert-module-globals`), Narwhal, and Ringo as the default context,
	  // and the `window` object in browsers. Rhino exports a `global` function
	  // instead.
	  var root = objectTypes[typeof window === "undefined" ? "undefined" : _typeof(window)] && window || this,
	      freeGlobal = freeExports && objectTypes[ false ? "undefined" : _typeof(module)] && module && !module.nodeType && (typeof global === "undefined" ? "undefined" : _typeof(global)) == "object" && global;

	  if (freeGlobal && (freeGlobal["global"] === freeGlobal || freeGlobal["window"] === freeGlobal || freeGlobal["self"] === freeGlobal)) {
	    root = freeGlobal;
	  }

	  // Public: Initializes JSON 3 using the given `context` object, attaching the
	  // `stringify` and `parse` functions to the specified `exports` object.
	  function runInContext(context, exports) {
	    context || (context = root["Object"]());
	    exports || (exports = root["Object"]());

	    // Native constructor aliases.
	    var Number = context["Number"] || root["Number"],
	        String = context["String"] || root["String"],
	        Object = context["Object"] || root["Object"],
	        Date = context["Date"] || root["Date"],
	        SyntaxError = context["SyntaxError"] || root["SyntaxError"],
	        TypeError = context["TypeError"] || root["TypeError"],
	        Math = context["Math"] || root["Math"],
	        nativeJSON = context["JSON"] || root["JSON"];

	    // Delegate to the native `stringify` and `parse` implementations.
	    if ((typeof nativeJSON === "undefined" ? "undefined" : _typeof(nativeJSON)) == "object" && nativeJSON) {
	      exports.stringify = nativeJSON.stringify;
	      exports.parse = nativeJSON.parse;
	    }

	    // Convenience aliases.
	    var objectProto = Object.prototype,
	        getClass = objectProto.toString,
	        _isProperty,
	        _forEach,
	        undef;

	    // Test the `Date#getUTC*` methods. Based on work by @Yaffle.
	    var isExtended = new Date(-3509827334573292);
	    try {
	      // The `getUTCFullYear`, `Month`, and `Date` methods return nonsensical
	      // results for certain dates in Opera >= 10.53.
	      isExtended = isExtended.getUTCFullYear() == -109252 && isExtended.getUTCMonth() === 0 && isExtended.getUTCDate() === 1 &&
	      // Safari < 2.0.2 stores the internal millisecond time value correctly,
	      // but clips the values returned by the date methods to the range of
	      // signed 32-bit integers ([-2 ** 31, 2 ** 31 - 1]).
	      isExtended.getUTCHours() == 10 && isExtended.getUTCMinutes() == 37 && isExtended.getUTCSeconds() == 6 && isExtended.getUTCMilliseconds() == 708;
	    } catch (exception) {}

	    // Internal: Determines whether the native `JSON.stringify` and `parse`
	    // implementations are spec-compliant. Based on work by Ken Snyder.
	    function has(name) {
	      if (has[name] !== undef) {
	        // Return cached feature test result.
	        return has[name];
	      }
	      var isSupported;
	      if (name == "bug-string-char-index") {
	        // IE <= 7 doesn't support accessing string characters using square
	        // bracket notation. IE 8 only supports this for primitives.
	        isSupported = "a"[0] != "a";
	      } else if (name == "json") {
	        // Indicates whether both `JSON.stringify` and `JSON.parse` are
	        // supported.
	        isSupported = has("json-stringify") && has("json-parse");
	      } else {
	        var value,
	            serialized = "{\"a\":[1,true,false,null,\"\\u0000\\b\\n\\f\\r\\t\"]}";
	        // Test `JSON.stringify`.
	        if (name == "json-stringify") {
	          var stringify = exports.stringify,
	              stringifySupported = typeof stringify == "function" && isExtended;
	          if (stringifySupported) {
	            // A test function object with a custom `toJSON` method.
	            (value = function value() {
	              return 1;
	            }).toJSON = value;
	            try {
	              stringifySupported =
	              // Firefox 3.1b1 and b2 serialize string, number, and boolean
	              // primitives as object literals.
	              stringify(0) === "0" &&
	              // FF 3.1b1, b2, and JSON 2 serialize wrapped primitives as object
	              // literals.
	              stringify(new Number()) === "0" && stringify(new String()) == '""' &&
	              // FF 3.1b1, 2 throw an error if the value is `null`, `undefined`, or
	              // does not define a canonical JSON representation (this applies to
	              // objects with `toJSON` properties as well, *unless* they are nested
	              // within an object or array).
	              stringify(getClass) === undef &&
	              // IE 8 serializes `undefined` as `"undefined"`. Safari <= 5.1.7 and
	              // FF 3.1b3 pass this test.
	              stringify(undef) === undef &&
	              // Safari <= 5.1.7 and FF 3.1b3 throw `Error`s and `TypeError`s,
	              // respectively, if the value is omitted entirely.
	              stringify() === undef &&
	              // FF 3.1b1, 2 throw an error if the given value is not a number,
	              // string, array, object, Boolean, or `null` literal. This applies to
	              // objects with custom `toJSON` methods as well, unless they are nested
	              // inside object or array literals. YUI 3.0.0b1 ignores custom `toJSON`
	              // methods entirely.
	              stringify(value) === "1" && stringify([value]) == "[1]" &&
	              // Prototype <= 1.6.1 serializes `[undefined]` as `"[]"` instead of
	              // `"[null]"`.
	              stringify([undef]) == "[null]" &&
	              // YUI 3.0.0b1 fails to serialize `null` literals.
	              stringify(null) == "null" &&
	              // FF 3.1b1, 2 halts serialization if an array contains a function:
	              // `[1, true, getClass, 1]` serializes as "[1,true,],". FF 3.1b3
	              // elides non-JSON values from objects and arrays, unless they
	              // define custom `toJSON` methods.
	              stringify([undef, getClass, null]) == "[null,null,null]" &&
	              // Simple serialization test. FF 3.1b1 uses Unicode escape sequences
	              // where character escape codes are expected (e.g., `\b` => `\u0008`).
	              stringify({ "a": [value, true, false, null, "\x00\b\n\f\r\t"] }) == serialized &&
	              // FF 3.1b1 and b2 ignore the `filter` and `width` arguments.
	              stringify(null, value) === "1" && stringify([1, 2], null, 1) == "[\n 1,\n 2\n]" &&
	              // JSON 2, Prototype <= 1.7, and older WebKit builds incorrectly
	              // serialize extended years.
	              stringify(new Date(-8.64e15)) == '"-271821-04-20T00:00:00.000Z"' &&
	              // The milliseconds are optional in ES 5, but required in 5.1.
	              stringify(new Date(8.64e15)) == '"+275760-09-13T00:00:00.000Z"' &&
	              // Firefox <= 11.0 incorrectly serializes years prior to 0 as negative
	              // four-digit years instead of six-digit years. Credits: @Yaffle.
	              stringify(new Date(-621987552e5)) == '"-000001-01-01T00:00:00.000Z"' &&
	              // Safari <= 5.1.5 and Opera >= 10.53 incorrectly serialize millisecond
	              // values less than 1000. Credits: @Yaffle.
	              stringify(new Date(-1)) == '"1969-12-31T23:59:59.999Z"';
	            } catch (exception) {
	              stringifySupported = false;
	            }
	          }
	          isSupported = stringifySupported;
	        }
	        // Test `JSON.parse`.
	        if (name == "json-parse") {
	          var parse = exports.parse;
	          if (typeof parse == "function") {
	            try {
	              // FF 3.1b1, b2 will throw an exception if a bare literal is provided.
	              // Conforming implementations should also coerce the initial argument to
	              // a string prior to parsing.
	              if (parse("0") === 0 && !parse(false)) {
	                // Simple parsing test.
	                value = parse(serialized);
	                var parseSupported = value["a"].length == 5 && value["a"][0] === 1;
	                if (parseSupported) {
	                  try {
	                    // Safari <= 5.1.2 and FF 3.1b1 allow unescaped tabs in strings.
	                    parseSupported = !parse('"\t"');
	                  } catch (exception) {}
	                  if (parseSupported) {
	                    try {
	                      // FF 4.0 and 4.0.1 allow leading `+` signs and leading
	                      // decimal points. FF 4.0, 4.0.1, and IE 9-10 also allow
	                      // certain octal literals.
	                      parseSupported = parse("01") !== 1;
	                    } catch (exception) {}
	                  }
	                  if (parseSupported) {
	                    try {
	                      // FF 4.0, 4.0.1, and Rhino 1.7R3-R4 allow trailing decimal
	                      // points. These environments, along with FF 3.1b1 and 2,
	                      // also allow trailing commas in JSON objects and arrays.
	                      parseSupported = parse("1.") !== 1;
	                    } catch (exception) {}
	                  }
	                }
	              }
	            } catch (exception) {
	              parseSupported = false;
	            }
	          }
	          isSupported = parseSupported;
	        }
	      }
	      return has[name] = !!isSupported;
	    }

	    if (!has("json")) {
	      // Common `[[Class]]` name aliases.
	      var functionClass = "[object Function]",
	          dateClass = "[object Date]",
	          numberClass = "[object Number]",
	          stringClass = "[object String]",
	          arrayClass = "[object Array]",
	          booleanClass = "[object Boolean]";

	      // Detect incomplete support for accessing string characters by index.
	      var charIndexBuggy = has("bug-string-char-index");

	      // Define additional utility methods if the `Date` methods are buggy.
	      if (!isExtended) {
	        var floor = Math.floor;
	        // A mapping between the months of the year and the number of days between
	        // January 1st and the first of the respective month.
	        var Months = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
	        // Internal: Calculates the number of days between the Unix epoch and the
	        // first day of the given month.
	        var getDay = function getDay(year, month) {
	          return Months[month] + 365 * (year - 1970) + floor((year - 1969 + (month = +(month > 1))) / 4) - floor((year - 1901 + month) / 100) + floor((year - 1601 + month) / 400);
	        };
	      }

	      // Internal: Determines if a property is a direct property of the given
	      // object. Delegates to the native `Object#hasOwnProperty` method.
	      if (!(_isProperty = objectProto.hasOwnProperty)) {
	        _isProperty = function isProperty(property) {
	          var members = {},
	              constructor;
	          if ((members.__proto__ = null, members.__proto__ = {
	            // The *proto* property cannot be set multiple times in recent
	            // versions of Firefox and SeaMonkey.
	            "toString": 1
	          }, members).toString != getClass) {
	            // Safari <= 2.0.3 doesn't implement `Object#hasOwnProperty`, but
	            // supports the mutable *proto* property.
	            _isProperty = function isProperty(property) {
	              // Capture and break the object's prototype chain (see section 8.6.2
	              // of the ES 5.1 spec). The parenthesized expression prevents an
	              // unsafe transformation by the Closure Compiler.
	              var original = this.__proto__,
	                  result = property in (this.__proto__ = null, this);
	              // Restore the original prototype chain.
	              this.__proto__ = original;
	              return result;
	            };
	          } else {
	            // Capture a reference to the top-level `Object` constructor.
	            constructor = members.constructor;
	            // Use the `constructor` property to simulate `Object#hasOwnProperty` in
	            // other environments.
	            _isProperty = function isProperty(property) {
	              var parent = (this.constructor || constructor).prototype;
	              return property in this && !(property in parent && this[property] === parent[property]);
	            };
	          }
	          members = null;
	          return _isProperty.call(this, property);
	        };
	      }

	      // Internal: Normalizes the `for...in` iteration algorithm across
	      // environments. Each enumerated key is yielded to a `callback` function.
	      _forEach = function forEach(object, callback) {
	        var size = 0,
	            Properties,
	            members,
	            property;

	        // Tests for bugs in the current environment's `for...in` algorithm. The
	        // `valueOf` property inherits the non-enumerable flag from
	        // `Object.prototype` in older versions of IE, Netscape, and Mozilla.
	        (Properties = function Properties() {
	          this.valueOf = 0;
	        }).prototype.valueOf = 0;

	        // Iterate over a new instance of the `Properties` class.
	        members = new Properties();
	        for (property in members) {
	          // Ignore all properties inherited from `Object.prototype`.
	          if (_isProperty.call(members, property)) {
	            size++;
	          }
	        }
	        Properties = members = null;

	        // Normalize the iteration algorithm.
	        if (!size) {
	          // A list of non-enumerable properties inherited from `Object.prototype`.
	          members = ["valueOf", "toString", "toLocaleString", "propertyIsEnumerable", "isPrototypeOf", "hasOwnProperty", "constructor"];
	          // IE <= 8, Mozilla 1.0, and Netscape 6.2 ignore shadowed non-enumerable
	          // properties.
	          _forEach = function forEach(object, callback) {
	            var isFunction = getClass.call(object) == functionClass,
	                property,
	                length;
	            var hasProperty = !isFunction && typeof object.constructor != "function" && objectTypes[_typeof(object.hasOwnProperty)] && object.hasOwnProperty || _isProperty;
	            for (property in object) {
	              // Gecko <= 1.0 enumerates the `prototype` property of functions under
	              // certain conditions; IE does not.
	              if (!(isFunction && property == "prototype") && hasProperty.call(object, property)) {
	                callback(property);
	              }
	            }
	            // Manually invoke the callback for each non-enumerable property.
	            for (length = members.length; property = members[--length]; hasProperty.call(object, property) && callback(property)) {}
	          };
	        } else if (size == 2) {
	          // Safari <= 2.0.4 enumerates shadowed properties twice.
	          _forEach = function forEach(object, callback) {
	            // Create a set of iterated properties.
	            var members = {},
	                isFunction = getClass.call(object) == functionClass,
	                property;
	            for (property in object) {
	              // Store each property name to prevent double enumeration. The
	              // `prototype` property of functions is not enumerated due to cross-
	              // environment inconsistencies.
	              if (!(isFunction && property == "prototype") && !_isProperty.call(members, property) && (members[property] = 1) && _isProperty.call(object, property)) {
	                callback(property);
	              }
	            }
	          };
	        } else {
	          // No bugs detected; use the standard `for...in` algorithm.
	          _forEach = function forEach(object, callback) {
	            var isFunction = getClass.call(object) == functionClass,
	                property,
	                isConstructor;
	            for (property in object) {
	              if (!(isFunction && property == "prototype") && _isProperty.call(object, property) && !(isConstructor = property === "constructor")) {
	                callback(property);
	              }
	            }
	            // Manually invoke the callback for the `constructor` property due to
	            // cross-environment inconsistencies.
	            if (isConstructor || _isProperty.call(object, property = "constructor")) {
	              callback(property);
	            }
	          };
	        }
	        return _forEach(object, callback);
	      };

	      // Public: Serializes a JavaScript `value` as a JSON string. The optional
	      // `filter` argument may specify either a function that alters how object and
	      // array members are serialized, or an array of strings and numbers that
	      // indicates which properties should be serialized. The optional `width`
	      // argument may be either a string or number that specifies the indentation
	      // level of the output.
	      if (!has("json-stringify")) {
	        // Internal: A map of control characters and their escaped equivalents.
	        var Escapes = {
	          92: "\\\\",
	          34: '\\"',
	          8: "\\b",
	          12: "\\f",
	          10: "\\n",
	          13: "\\r",
	          9: "\\t"
	        };

	        // Internal: Converts `value` into a zero-padded string such that its
	        // length is at least equal to `width`. The `width` must be <= 6.
	        var leadingZeroes = "000000";
	        var toPaddedString = function toPaddedString(width, value) {
	          // The `|| 0` expression is necessary to work around a bug in
	          // Opera <= 7.54u2 where `0 == -0`, but `String(-0) !== "0"`.
	          return (leadingZeroes + (value || 0)).slice(-width);
	        };

	        // Internal: Double-quotes a string `value`, replacing all ASCII control
	        // characters (characters with code unit values between 0 and 31) with
	        // their escaped equivalents. This is an implementation of the
	        // `Quote(value)` operation defined in ES 5.1 section 15.12.3.
	        var unicodePrefix = "\\u00";
	        var quote = function quote(value) {
	          var result = '"',
	              index = 0,
	              length = value.length,
	              useCharIndex = !charIndexBuggy || length > 10;
	          var symbols = useCharIndex && (charIndexBuggy ? value.split("") : value);
	          for (; index < length; index++) {
	            var charCode = value.charCodeAt(index);
	            // If the character is a control character, append its Unicode or
	            // shorthand escape sequence; otherwise, append the character as-is.
	            switch (charCode) {
	              case 8:case 9:case 10:case 12:case 13:case 34:case 92:
	                result += Escapes[charCode];
	                break;
	              default:
	                if (charCode < 32) {
	                  result += unicodePrefix + toPaddedString(2, charCode.toString(16));
	                  break;
	                }
	                result += useCharIndex ? symbols[index] : value.charAt(index);
	            }
	          }
	          return result + '"';
	        };

	        // Internal: Recursively serializes an object. Implements the
	        // `Str(key, holder)`, `JO(value)`, and `JA(value)` operations.
	        var serialize = function serialize(property, object, callback, properties, whitespace, indentation, stack) {
	          var value, className, year, month, date, time, hours, minutes, seconds, milliseconds, results, element, index, length, prefix, result;
	          try {
	            // Necessary for host object support.
	            value = object[property];
	          } catch (exception) {}
	          if ((typeof value === "undefined" ? "undefined" : _typeof(value)) == "object" && value) {
	            className = getClass.call(value);
	            if (className == dateClass && !_isProperty.call(value, "toJSON")) {
	              if (value > -1 / 0 && value < 1 / 0) {
	                // Dates are serialized according to the `Date#toJSON` method
	                // specified in ES 5.1 section 15.9.5.44. See section 15.9.1.15
	                // for the ISO 8601 date time string format.
	                if (getDay) {
	                  // Manually compute the year, month, date, hours, minutes,
	                  // seconds, and milliseconds if the `getUTC*` methods are
	                  // buggy. Adapted from @Yaffle's `date-shim` project.
	                  date = floor(value / 864e5);
	                  for (year = floor(date / 365.2425) + 1970 - 1; getDay(year + 1, 0) <= date; year++) {}
	                  for (month = floor((date - getDay(year, 0)) / 30.42); getDay(year, month + 1) <= date; month++) {}
	                  date = 1 + date - getDay(year, month);
	                  // The `time` value specifies the time within the day (see ES
	                  // 5.1 section 15.9.1.2). The formula `(A % B + B) % B` is used
	                  // to compute `A modulo B`, as the `%` operator does not
	                  // correspond to the `modulo` operation for negative numbers.
	                  time = (value % 864e5 + 864e5) % 864e5;
	                  // The hours, minutes, seconds, and milliseconds are obtained by
	                  // decomposing the time within the day. See section 15.9.1.10.
	                  hours = floor(time / 36e5) % 24;
	                  minutes = floor(time / 6e4) % 60;
	                  seconds = floor(time / 1e3) % 60;
	                  milliseconds = time % 1e3;
	                } else {
	                  year = value.getUTCFullYear();
	                  month = value.getUTCMonth();
	                  date = value.getUTCDate();
	                  hours = value.getUTCHours();
	                  minutes = value.getUTCMinutes();
	                  seconds = value.getUTCSeconds();
	                  milliseconds = value.getUTCMilliseconds();
	                }
	                // Serialize extended years correctly.
	                value = (year <= 0 || year >= 1e4 ? (year < 0 ? "-" : "+") + toPaddedString(6, year < 0 ? -year : year) : toPaddedString(4, year)) + "-" + toPaddedString(2, month + 1) + "-" + toPaddedString(2, date) +
	                // Months, dates, hours, minutes, and seconds should have two
	                // digits; milliseconds should have three.
	                "T" + toPaddedString(2, hours) + ":" + toPaddedString(2, minutes) + ":" + toPaddedString(2, seconds) +
	                // Milliseconds are optional in ES 5.0, but required in 5.1.
	                "." + toPaddedString(3, milliseconds) + "Z";
	              } else {
	                value = null;
	              }
	            } else if (typeof value.toJSON == "function" && (className != numberClass && className != stringClass && className != arrayClass || _isProperty.call(value, "toJSON"))) {
	              // Prototype <= 1.6.1 adds non-standard `toJSON` methods to the
	              // `Number`, `String`, `Date`, and `Array` prototypes. JSON 3
	              // ignores all `toJSON` methods on these objects unless they are
	              // defined directly on an instance.
	              value = value.toJSON(property);
	            }
	          }
	          if (callback) {
	            // If a replacement function was provided, call it to obtain the value
	            // for serialization.
	            value = callback.call(object, property, value);
	          }
	          if (value === null) {
	            return "null";
	          }
	          className = getClass.call(value);
	          if (className == booleanClass) {
	            // Booleans are represented literally.
	            return "" + value;
	          } else if (className == numberClass) {
	            // JSON numbers must be finite. `Infinity` and `NaN` are serialized as
	            // `"null"`.
	            return value > -1 / 0 && value < 1 / 0 ? "" + value : "null";
	          } else if (className == stringClass) {
	            // Strings are double-quoted and escaped.
	            return quote("" + value);
	          }
	          // Recursively serialize objects and arrays.
	          if ((typeof value === "undefined" ? "undefined" : _typeof(value)) == "object") {
	            // Check for cyclic structures. This is a linear search; performance
	            // is inversely proportional to the number of unique nested objects.
	            for (length = stack.length; length--;) {
	              if (stack[length] === value) {
	                // Cyclic structures cannot be serialized by `JSON.stringify`.
	                throw TypeError();
	              }
	            }
	            // Add the object to the stack of traversed objects.
	            stack.push(value);
	            results = [];
	            // Save the current indentation level and indent one additional level.
	            prefix = indentation;
	            indentation += whitespace;
	            if (className == arrayClass) {
	              // Recursively serialize array elements.
	              for (index = 0, length = value.length; index < length; index++) {
	                element = serialize(index, value, callback, properties, whitespace, indentation, stack);
	                results.push(element === undef ? "null" : element);
	              }
	              result = results.length ? whitespace ? "[\n" + indentation + results.join(",\n" + indentation) + "\n" + prefix + "]" : "[" + results.join(",") + "]" : "[]";
	            } else {
	              // Recursively serialize object members. Members are selected from
	              // either a user-specified list of property names, or the object
	              // itself.
	              _forEach(properties || value, function (property) {
	                var element = serialize(property, value, callback, properties, whitespace, indentation, stack);
	                if (element !== undef) {
	                  // According to ES 5.1 section 15.12.3: "If `gap` {whitespace}
	                  // is not the empty string, let `member` {quote(property) + ":"}
	                  // be the concatenation of `member` and the `space` character."
	                  // The "`space` character" refers to the literal space
	                  // character, not the `space` {width} argument provided to
	                  // `JSON.stringify`.
	                  results.push(quote(property) + ":" + (whitespace ? " " : "") + element);
	                }
	              });
	              result = results.length ? whitespace ? "{\n" + indentation + results.join(",\n" + indentation) + "\n" + prefix + "}" : "{" + results.join(",") + "}" : "{}";
	            }
	            // Remove the object from the traversed object stack.
	            stack.pop();
	            return result;
	          }
	        };

	        // Public: `JSON.stringify`. See ES 5.1 section 15.12.3.
	        exports.stringify = function (source, filter, width) {
	          var whitespace, callback, properties, className;
	          if (objectTypes[typeof filter === "undefined" ? "undefined" : _typeof(filter)] && filter) {
	            if ((className = getClass.call(filter)) == functionClass) {
	              callback = filter;
	            } else if (className == arrayClass) {
	              // Convert the property names array into a makeshift set.
	              properties = {};
	              for (var index = 0, length = filter.length, value; index < length; value = filter[index++], (className = getClass.call(value), className == stringClass || className == numberClass) && (properties[value] = 1)) {}
	            }
	          }
	          if (width) {
	            if ((className = getClass.call(width)) == numberClass) {
	              // Convert the `width` to an integer and create a string containing
	              // `width` number of space characters.
	              if ((width -= width % 1) > 0) {
	                for (whitespace = "", width > 10 && (width = 10); whitespace.length < width; whitespace += " ") {}
	              }
	            } else if (className == stringClass) {
	              whitespace = width.length <= 10 ? width : width.slice(0, 10);
	            }
	          }
	          // Opera <= 7.54u2 discards the values associated with empty string keys
	          // (`""`) only if they are used directly within an object member list
	          // (e.g., `!("" in { "": 1})`).
	          return serialize("", (value = {}, value[""] = source, value), callback, properties, whitespace, "", []);
	        };
	      }

	      // Public: Parses a JSON source string.
	      if (!has("json-parse")) {
	        var fromCharCode = String.fromCharCode;

	        // Internal: A map of escaped control characters and their unescaped
	        // equivalents.
	        var Unescapes = {
	          92: "\\",
	          34: '"',
	          47: "/",
	          98: "\b",
	          116: "\t",
	          110: "\n",
	          102: "\f",
	          114: "\r"
	        };

	        // Internal: Stores the parser state.
	        var Index, Source;

	        // Internal: Resets the parser state and throws a `SyntaxError`.
	        var abort = function abort() {
	          Index = Source = null;
	          throw SyntaxError();
	        };

	        // Internal: Returns the next token, or `"$"` if the parser has reached
	        // the end of the source string. A token may be a string, number, `null`
	        // literal, or Boolean literal.
	        var lex = function lex() {
	          var source = Source,
	              length = source.length,
	              value,
	              begin,
	              position,
	              isSigned,
	              charCode;
	          while (Index < length) {
	            charCode = source.charCodeAt(Index);
	            switch (charCode) {
	              case 9:case 10:case 13:case 32:
	                // Skip whitespace tokens, including tabs, carriage returns, line
	                // feeds, and space characters.
	                Index++;
	                break;
	              case 123:case 125:case 91:case 93:case 58:case 44:
	                // Parse a punctuator token (`{`, `}`, `[`, `]`, `:`, or `,`) at
	                // the current position.
	                value = charIndexBuggy ? source.charAt(Index) : source[Index];
	                Index++;
	                return value;
	              case 34:
	                // `"` delimits a JSON string; advance to the next character and
	                // begin parsing the string. String tokens are prefixed with the
	                // sentinel `@` character to distinguish them from punctuators and
	                // end-of-string tokens.
	                for (value = "@", Index++; Index < length;) {
	                  charCode = source.charCodeAt(Index);
	                  if (charCode < 32) {
	                    // Unescaped ASCII control characters (those with a code unit
	                    // less than the space character) are not permitted.
	                    abort();
	                  } else if (charCode == 92) {
	                    // A reverse solidus (`\`) marks the beginning of an escaped
	                    // control character (including `"`, `\`, and `/`) or Unicode
	                    // escape sequence.
	                    charCode = source.charCodeAt(++Index);
	                    switch (charCode) {
	                      case 92:case 34:case 47:case 98:case 116:case 110:case 102:case 114:
	                        // Revive escaped control characters.
	                        value += Unescapes[charCode];
	                        Index++;
	                        break;
	                      case 117:
	                        // `\u` marks the beginning of a Unicode escape sequence.
	                        // Advance to the first character and validate the
	                        // four-digit code point.
	                        begin = ++Index;
	                        for (position = Index + 4; Index < position; Index++) {
	                          charCode = source.charCodeAt(Index);
	                          // A valid sequence comprises four hexdigits (case-
	                          // insensitive) that form a single hexadecimal value.
	                          if (!(charCode >= 48 && charCode <= 57 || charCode >= 97 && charCode <= 102 || charCode >= 65 && charCode <= 70)) {
	                            // Invalid Unicode escape sequence.
	                            abort();
	                          }
	                        }
	                        // Revive the escaped character.
	                        value += fromCharCode("0x" + source.slice(begin, Index));
	                        break;
	                      default:
	                        // Invalid escape sequence.
	                        abort();
	                    }
	                  } else {
	                    if (charCode == 34) {
	                      // An unescaped double-quote character marks the end of the
	                      // string.
	                      break;
	                    }
	                    charCode = source.charCodeAt(Index);
	                    begin = Index;
	                    // Optimize for the common case where a string is valid.
	                    while (charCode >= 32 && charCode != 92 && charCode != 34) {
	                      charCode = source.charCodeAt(++Index);
	                    }
	                    // Append the string as-is.
	                    value += source.slice(begin, Index);
	                  }
	                }
	                if (source.charCodeAt(Index) == 34) {
	                  // Advance to the next character and return the revived string.
	                  Index++;
	                  return value;
	                }
	                // Unterminated string.
	                abort();
	              default:
	                // Parse numbers and literals.
	                begin = Index;
	                // Advance past the negative sign, if one is specified.
	                if (charCode == 45) {
	                  isSigned = true;
	                  charCode = source.charCodeAt(++Index);
	                }
	                // Parse an integer or floating-point value.
	                if (charCode >= 48 && charCode <= 57) {
	                  // Leading zeroes are interpreted as octal literals.
	                  if (charCode == 48 && (charCode = source.charCodeAt(Index + 1), charCode >= 48 && charCode <= 57)) {
	                    // Illegal octal literal.
	                    abort();
	                  }
	                  isSigned = false;
	                  // Parse the integer component.
	                  for (; Index < length && (charCode = source.charCodeAt(Index), charCode >= 48 && charCode <= 57); Index++) {}
	                  // Floats cannot contain a leading decimal point; however, this
	                  // case is already accounted for by the parser.
	                  if (source.charCodeAt(Index) == 46) {
	                    position = ++Index;
	                    // Parse the decimal component.
	                    for (; position < length && (charCode = source.charCodeAt(position), charCode >= 48 && charCode <= 57); position++) {}
	                    if (position == Index) {
	                      // Illegal trailing decimal.
	                      abort();
	                    }
	                    Index = position;
	                  }
	                  // Parse exponents. The `e` denoting the exponent is
	                  // case-insensitive.
	                  charCode = source.charCodeAt(Index);
	                  if (charCode == 101 || charCode == 69) {
	                    charCode = source.charCodeAt(++Index);
	                    // Skip past the sign following the exponent, if one is
	                    // specified.
	                    if (charCode == 43 || charCode == 45) {
	                      Index++;
	                    }
	                    // Parse the exponential component.
	                    for (position = Index; position < length && (charCode = source.charCodeAt(position), charCode >= 48 && charCode <= 57); position++) {}
	                    if (position == Index) {
	                      // Illegal empty exponent.
	                      abort();
	                    }
	                    Index = position;
	                  }
	                  // Coerce the parsed value to a JavaScript number.
	                  return +source.slice(begin, Index);
	                }
	                // A negative sign may only precede numbers.
	                if (isSigned) {
	                  abort();
	                }
	                // `true`, `false`, and `null` literals.
	                if (source.slice(Index, Index + 4) == "true") {
	                  Index += 4;
	                  return true;
	                } else if (source.slice(Index, Index + 5) == "false") {
	                  Index += 5;
	                  return false;
	                } else if (source.slice(Index, Index + 4) == "null") {
	                  Index += 4;
	                  return null;
	                }
	                // Unrecognized token.
	                abort();
	            }
	          }
	          // Return the sentinel `$` character if the parser has reached the end
	          // of the source string.
	          return "$";
	        };

	        // Internal: Parses a JSON `value` token.
	        var get = function get(value) {
	          var results, hasMembers;
	          if (value == "$") {
	            // Unexpected end of input.
	            abort();
	          }
	          if (typeof value == "string") {
	            if ((charIndexBuggy ? value.charAt(0) : value[0]) == "@") {
	              // Remove the sentinel `@` character.
	              return value.slice(1);
	            }
	            // Parse object and array literals.
	            if (value == "[") {
	              // Parses a JSON array, returning a new JavaScript array.
	              results = [];
	              for (;; hasMembers || (hasMembers = true)) {
	                value = lex();
	                // A closing square bracket marks the end of the array literal.
	                if (value == "]") {
	                  break;
	                }
	                // If the array literal contains elements, the current token
	                // should be a comma separating the previous element from the
	                // next.
	                if (hasMembers) {
	                  if (value == ",") {
	                    value = lex();
	                    if (value == "]") {
	                      // Unexpected trailing `,` in array literal.
	                      abort();
	                    }
	                  } else {
	                    // A `,` must separate each array element.
	                    abort();
	                  }
	                }
	                // Elisions and leading commas are not permitted.
	                if (value == ",") {
	                  abort();
	                }
	                results.push(get(value));
	              }
	              return results;
	            } else if (value == "{") {
	              // Parses a JSON object, returning a new JavaScript object.
	              results = {};
	              for (;; hasMembers || (hasMembers = true)) {
	                value = lex();
	                // A closing curly brace marks the end of the object literal.
	                if (value == "}") {
	                  break;
	                }
	                // If the object literal contains members, the current token
	                // should be a comma separator.
	                if (hasMembers) {
	                  if (value == ",") {
	                    value = lex();
	                    if (value == "}") {
	                      // Unexpected trailing `,` in object literal.
	                      abort();
	                    }
	                  } else {
	                    // A `,` must separate each object member.
	                    abort();
	                  }
	                }
	                // Leading commas are not permitted, object property names must be
	                // double-quoted strings, and a `:` must separate each property
	                // name and value.
	                if (value == "," || typeof value != "string" || (charIndexBuggy ? value.charAt(0) : value[0]) != "@" || lex() != ":") {
	                  abort();
	                }
	                results[value.slice(1)] = get(lex());
	              }
	              return results;
	            }
	            // Unexpected token encountered.
	            abort();
	          }
	          return value;
	        };

	        // Internal: Updates a traversed object member.
	        var update = function update(source, property, callback) {
	          var element = walk(source, property, callback);
	          if (element === undef) {
	            delete source[property];
	          } else {
	            source[property] = element;
	          }
	        };

	        // Internal: Recursively traverses a parsed JSON object, invoking the
	        // `callback` function for each value. This is an implementation of the
	        // `Walk(holder, name)` operation defined in ES 5.1 section 15.12.2.
	        var walk = function walk(source, property, callback) {
	          var value = source[property],
	              length;
	          if ((typeof value === "undefined" ? "undefined" : _typeof(value)) == "object" && value) {
	            // `forEach` can't be used to traverse an array in Opera <= 8.54
	            // because its `Object#hasOwnProperty` implementation returns `false`
	            // for array indices (e.g., `![1, 2, 3].hasOwnProperty("0")`).
	            if (getClass.call(value) == arrayClass) {
	              for (length = value.length; length--;) {
	                update(value, length, callback);
	              }
	            } else {
	              _forEach(value, function (property) {
	                update(value, property, callback);
	              });
	            }
	          }
	          return callback.call(source, property, value);
	        };

	        // Public: `JSON.parse`. See ES 5.1 section 15.12.2.
	        exports.parse = function (source, callback) {
	          var result, value;
	          Index = 0;
	          Source = "" + source;
	          result = get(lex());
	          // If a JSON string contains multiple tokens, it is invalid.
	          if (lex() != "$") {
	            abort();
	          }
	          // Reset the parser state.
	          Index = Source = null;
	          return callback && getClass.call(callback) == functionClass ? walk((value = {}, value[""] = result, value), "", callback) : result;
	        };
	      }
	    }

	    exports["runInContext"] = runInContext;
	    return exports;
	  }

	  if (freeExports && !isLoader) {
	    // Export for CommonJS environments.
	    runInContext(root, freeExports);
	  } else {
	    // Export for web browsers and JavaScript engines.
	    var nativeJSON = root.JSON,
	        previousJSON = root["JSON3"],
	        isRestored = false;

	    var JSON3 = runInContext(root, root["JSON3"] = {
	      // Public: Restores the original value of the global `JSON` object and
	      // returns a reference to the `JSON3` object.
	      "noConflict": function noConflict() {
	        if (!isRestored) {
	          isRestored = true;
	          root.JSON = nativeJSON;
	          root["JSON3"] = previousJSON;
	          nativeJSON = previousJSON = null;
	        }
	        return JSON3;
	      }
	    });

	    root.JSON = {
	      "parse": JSON3.parse,
	      "stringify": JSON3.stringify
	    };
	  }

	  // Export for asynchronous module loaders.
	  if (isLoader) {
	    !(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
	      return JSON3;
	    }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  }
	}).call(undefined);
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(19)(module), (function() { return this; }())))

/***/ },
/* 103 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(__webpack_amd_options__) {module.exports = __webpack_amd_options__;

	/* WEBPACK VAR INJECTION */}.call(exports, {}))

/***/ },
/* 104 */
/***/ function(module, exports) {

	'use strict';

	module.exports = '1.0.3';

/***/ },
/* 105 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process, global) {'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var eventUtils = __webpack_require__(71),
	    JSON3 = __webpack_require__(102),
	    browser = __webpack_require__(94);

	var debug = function debug() {};
	if (process.env.NODE_ENV !== 'production') {
	  debug = __webpack_require__(78)('sockjs-client:utils:iframe');
	}

	module.exports = {
	  WPrefix: '_jp',
	  currentWindowId: null,

	  polluteGlobalNamespace: function polluteGlobalNamespace() {
	    if (!(module.exports.WPrefix in global)) {
	      global[module.exports.WPrefix] = {};
	    }
	  },

	  postMessage: function postMessage(type, data) {
	    if (global.parent !== global) {
	      global.parent.postMessage(JSON3.stringify({
	        windowId: module.exports.currentWindowId,
	        type: type,
	        data: data || ''
	      }), '*');
	    } else {
	      debug('Cannot postMessage, no parent window.', type, data);
	    }
	  },

	  createIframe: function createIframe(iframeUrl, errorCallback) {
	    var iframe = global.document.createElement('iframe');
	    var tref, unloadRef;
	    var unattach = function unattach() {
	      debug('unattach');
	      clearTimeout(tref);
	      // Explorer had problems with that.
	      try {
	        iframe.onload = null;
	      } catch (x) {}
	      iframe.onerror = null;
	    };
	    var cleanup = function cleanup() {
	      debug('cleanup');
	      if (iframe) {
	        unattach();
	        // This timeout makes chrome fire onbeforeunload event
	        // within iframe. Without the timeout it goes straight to
	        // onunload.
	        setTimeout(function () {
	          if (iframe) {
	            iframe.parentNode.removeChild(iframe);
	          }
	          iframe = null;
	        }, 0);
	        eventUtils.unloadDel(unloadRef);
	      }
	    };
	    var onerror = function onerror(err) {
	      debug('onerror', err);
	      if (iframe) {
	        cleanup();
	        errorCallback(err);
	      }
	    };
	    var post = function post(msg, origin) {
	      debug('post', msg, origin);
	      try {
	        // When the iframe is not loaded, IE raises an exception
	        // on 'contentWindow'.
	        setTimeout(function () {
	          if (iframe && iframe.contentWindow) {
	            iframe.contentWindow.postMessage(msg, origin);
	          }
	        }, 0);
	      } catch (x) {}
	    };

	    iframe.src = iframeUrl;
	    iframe.style.display = 'none';
	    iframe.style.position = 'absolute';
	    iframe.onerror = function () {
	      onerror('onerror');
	    };
	    iframe.onload = function () {
	      debug('onload');
	      // `onload` is triggered before scripts on the iframe are
	      // executed. Give it few seconds to actually load stuff.
	      clearTimeout(tref);
	      tref = setTimeout(function () {
	        onerror('onload timeout');
	      }, 2000);
	    };
	    global.document.body.appendChild(iframe);
	    tref = setTimeout(function () {
	      onerror('timeout');
	    }, 15000);
	    unloadRef = eventUtils.unloadAdd(cleanup);
	    return {
	      post: post,
	      cleanup: cleanup,
	      loaded: unattach
	    };
	  }

	  /* jshint undef: false, newcap: false */
	  /* eslint no-undef: 0, new-cap: 0 */
	  , createHtmlfile: function createHtmlfile(iframeUrl, errorCallback) {
	    var axo = ['Active'].concat('Object').join('X');
	    var doc = new global[axo]('htmlfile');
	    var tref, unloadRef;
	    var iframe;
	    var unattach = function unattach() {
	      clearTimeout(tref);
	      iframe.onerror = null;
	    };
	    var cleanup = function cleanup() {
	      if (doc) {
	        unattach();
	        eventUtils.unloadDel(unloadRef);
	        iframe.parentNode.removeChild(iframe);
	        iframe = doc = null;
	        CollectGarbage();
	      }
	    };
	    var onerror = function onerror(r) {
	      debug('onerror', r);
	      if (doc) {
	        cleanup();
	        errorCallback(r);
	      }
	    };
	    var post = function post(msg, origin) {
	      try {
	        // When the iframe is not loaded, IE raises an exception
	        // on 'contentWindow'.
	        setTimeout(function () {
	          if (iframe && iframe.contentWindow) {
	            iframe.contentWindow.postMessage(msg, origin);
	          }
	        }, 0);
	      } catch (x) {}
	    };

	    doc.open();
	    doc.write('<html><s' + 'cript>' + 'document.domain="' + global.document.domain + '";' + '</s' + 'cript></html>');
	    doc.close();
	    doc.parentWindow[module.exports.WPrefix] = global[module.exports.WPrefix];
	    var c = doc.createElement('div');
	    doc.body.appendChild(c);
	    iframe = doc.createElement('iframe');
	    c.appendChild(iframe);
	    iframe.src = iframeUrl;
	    iframe.onerror = function () {
	      onerror('onerror');
	    };
	    tref = setTimeout(function () {
	      onerror('timeout');
	    }, 15000);
	    unloadRef = eventUtils.unloadAdd(cleanup);
	    return {
	      post: post,
	      cleanup: cleanup,
	      loaded: unattach
	    };
	  }
	};

	module.exports.iframeEnabled = false;
	if (global.document) {
	  // postMessage misbehaves in konqueror 4.6.5 - the messages are delivered with
	  // huge delay, or not at all.
	  module.exports.iframeEnabled = (typeof global.postMessage === 'function' || _typeof(global.postMessage) === 'object') && !browser.isKonqueror();
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(16), (function() { return this; }())))

/***/ },
/* 106 */
/***/ function(module, exports) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	module.exports = {
	  isObject: function isObject(obj) {
	    var type = typeof obj === 'undefined' ? 'undefined' : _typeof(obj);
	    return type === 'function' || type === 'object' && !!obj;
	  },

	  extend: function extend(obj) {
	    if (!this.isObject(obj)) {
	      return obj;
	    }
	    var source, prop;
	    for (var i = 1, length = arguments.length; i < length; i++) {
	      source = arguments[i];
	      for (prop in source) {
	        if (Object.prototype.hasOwnProperty.call(source, prop)) {
	          obj[prop] = source[prop];
	        }
	      }
	    }
	    return obj;
	  }
	};

/***/ },
/* 107 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var inherits = __webpack_require__(81),
	    HtmlfileReceiver = __webpack_require__(108),
	    XHRLocalObject = __webpack_require__(93),
	    AjaxBasedTransport = __webpack_require__(86);

	function HtmlFileTransport(transUrl) {
	  if (!HtmlfileReceiver.enabled) {
	    throw new Error('Transport created when disabled');
	  }
	  AjaxBasedTransport.call(this, transUrl, '/htmlfile', HtmlfileReceiver, XHRLocalObject);
	}

	inherits(HtmlFileTransport, AjaxBasedTransport);

	HtmlFileTransport.enabled = function (info) {
	  return HtmlfileReceiver.enabled && info.sameOrigin;
	};

	HtmlFileTransport.transportName = 'htmlfile';
	HtmlFileTransport.roundTrips = 2;

	module.exports = HtmlFileTransport;

/***/ },
/* 108 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process, global) {'use strict';

	var inherits = __webpack_require__(81),
	    iframeUtils = __webpack_require__(105),
	    urlUtils = __webpack_require__(74),
	    EventEmitter = __webpack_require__(82).EventEmitter,
	    random = __webpack_require__(72);

	var debug = function debug() {};
	if (process.env.NODE_ENV !== 'production') {
	  debug = __webpack_require__(78)('sockjs-client:receiver:htmlfile');
	}

	function HtmlfileReceiver(url) {
	  debug(url);
	  EventEmitter.call(this);
	  var self = this;
	  iframeUtils.polluteGlobalNamespace();

	  this.id = 'a' + random.string(6);
	  url = urlUtils.addQuery(url, 'c=' + decodeURIComponent(iframeUtils.WPrefix + '.' + this.id));

	  debug('using htmlfile', HtmlfileReceiver.htmlfileEnabled);
	  var constructFunc = HtmlfileReceiver.htmlfileEnabled ? iframeUtils.createHtmlfile : iframeUtils.createIframe;

	  global[iframeUtils.WPrefix][this.id] = {
	    start: function start() {
	      debug('start');
	      self.iframeObj.loaded();
	    },
	    message: function message(data) {
	      debug('message', data);
	      self.emit('message', data);
	    },
	    stop: function stop() {
	      debug('stop');
	      self._cleanup();
	      self._close('network');
	    }
	  };
	  this.iframeObj = constructFunc(url, function () {
	    debug('callback');
	    self._cleanup();
	    self._close('permanent');
	  });
	}

	inherits(HtmlfileReceiver, EventEmitter);

	HtmlfileReceiver.prototype.abort = function () {
	  debug('abort');
	  this._cleanup();
	  this._close('user');
	};

	HtmlfileReceiver.prototype._cleanup = function () {
	  debug('_cleanup');
	  if (this.iframeObj) {
	    this.iframeObj.cleanup();
	    this.iframeObj = null;
	  }
	  delete global[iframeUtils.WPrefix][this.id];
	};

	HtmlfileReceiver.prototype._close = function (reason) {
	  debug('_close', reason);
	  this.emit('close', null, reason);
	  this.removeAllListeners();
	};

	HtmlfileReceiver.htmlfileEnabled = false;

	// obfuscate to avoid firewalls
	var axo = ['Active'].concat('Object').join('X');
	if (axo in global) {
	  try {
	    HtmlfileReceiver.htmlfileEnabled = !!new global[axo]('htmlfile');
	  } catch (x) {}
	}

	HtmlfileReceiver.enabled = HtmlfileReceiver.htmlfileEnabled || iframeUtils.iframeEnabled;

	module.exports = HtmlfileReceiver;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(16), (function() { return this; }())))

/***/ },
/* 109 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var inherits = __webpack_require__(81),
	    AjaxBasedTransport = __webpack_require__(86),
	    XhrReceiver = __webpack_require__(90),
	    XHRCorsObject = __webpack_require__(91),
	    XHRLocalObject = __webpack_require__(93);

	function XhrPollingTransport(transUrl) {
	  if (!XHRLocalObject.enabled && !XHRCorsObject.enabled) {
	    throw new Error('Transport created when disabled');
	  }
	  AjaxBasedTransport.call(this, transUrl, '/xhr', XhrReceiver, XHRCorsObject);
	}

	inherits(XhrPollingTransport, AjaxBasedTransport);

	XhrPollingTransport.enabled = function (info) {
	  if (info.nullOrigin) {
	    return false;
	  }

	  if (XHRLocalObject.enabled && info.sameOrigin) {
	    return true;
	  }
	  return XHRCorsObject.enabled;
	};

	XhrPollingTransport.transportName = 'xhr-polling';
	XhrPollingTransport.roundTrips = 2; // preflight, ajax

	module.exports = XhrPollingTransport;

/***/ },
/* 110 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var inherits = __webpack_require__(81),
	    AjaxBasedTransport = __webpack_require__(86),
	    XdrStreamingTransport = __webpack_require__(95),
	    XhrReceiver = __webpack_require__(90),
	    XDRObject = __webpack_require__(96);

	function XdrPollingTransport(transUrl) {
	  if (!XDRObject.enabled) {
	    throw new Error('Transport created when disabled');
	  }
	  AjaxBasedTransport.call(this, transUrl, '/xhr', XhrReceiver, XDRObject);
	}

	inherits(XdrPollingTransport, AjaxBasedTransport);

	XdrPollingTransport.enabled = XdrStreamingTransport.enabled;
	XdrPollingTransport.transportName = 'xdr-polling';
	XdrPollingTransport.roundTrips = 2; // preflight, ajax

	module.exports = XdrPollingTransport;

/***/ },
/* 111 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	// The simplest and most robust transport, using the well-know cross
	// domain hack - JSONP. This transport is quite inefficient - one
	// message could use up to one http request. But at least it works almost
	// everywhere.
	// Known limitations:
	//   o you will get a spinning cursor
	//   o for Konqueror a dumb timer is needed to detect errors

	var inherits = __webpack_require__(81),
	    SenderReceiver = __webpack_require__(87),
	    JsonpReceiver = __webpack_require__(112),
	    jsonpSender = __webpack_require__(113);

	function JsonPTransport(transUrl) {
	  if (!JsonPTransport.enabled()) {
	    throw new Error('Transport created when disabled');
	  }
	  SenderReceiver.call(this, transUrl, '/jsonp', jsonpSender, JsonpReceiver);
	}

	inherits(JsonPTransport, SenderReceiver);

	JsonPTransport.enabled = function () {
	  return !!global.document;
	};

	JsonPTransport.transportName = 'jsonp-polling';
	JsonPTransport.roundTrips = 1;
	JsonPTransport.needBody = true;

	module.exports = JsonPTransport;
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 112 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process, global) {'use strict';

	var utils = __webpack_require__(105),
	    random = __webpack_require__(72),
	    browser = __webpack_require__(94),
	    urlUtils = __webpack_require__(74),
	    inherits = __webpack_require__(81),
	    EventEmitter = __webpack_require__(82).EventEmitter;

	var debug = function debug() {};
	if (process.env.NODE_ENV !== 'production') {
	  debug = __webpack_require__(78)('sockjs-client:receiver:jsonp');
	}

	function JsonpReceiver(url) {
	  debug(url);
	  var self = this;
	  EventEmitter.call(this);

	  utils.polluteGlobalNamespace();

	  this.id = 'a' + random.string(6);
	  var urlWithId = urlUtils.addQuery(url, 'c=' + encodeURIComponent(utils.WPrefix + '.' + this.id));

	  global[utils.WPrefix][this.id] = this._callback.bind(this);
	  this._createScript(urlWithId);

	  // Fallback mostly for Konqueror - stupid timer, 35 seconds shall be plenty.
	  this.timeoutId = setTimeout(function () {
	    debug('timeout');
	    self._abort(new Error('JSONP script loaded abnormally (timeout)'));
	  }, JsonpReceiver.timeout);
	}

	inherits(JsonpReceiver, EventEmitter);

	JsonpReceiver.prototype.abort = function () {
	  debug('abort');
	  if (global[utils.WPrefix][this.id]) {
	    var err = new Error('JSONP user aborted read');
	    err.code = 1000;
	    this._abort(err);
	  }
	};

	JsonpReceiver.timeout = 35000;
	JsonpReceiver.scriptErrorTimeout = 1000;

	JsonpReceiver.prototype._callback = function (data) {
	  debug('_callback', data);
	  this._cleanup();

	  if (this.aborting) {
	    return;
	  }

	  if (data) {
	    debug('message', data);
	    this.emit('message', data);
	  }
	  this.emit('close', null, 'network');
	  this.removeAllListeners();
	};

	JsonpReceiver.prototype._abort = function (err) {
	  debug('_abort', err);
	  this._cleanup();
	  this.aborting = true;
	  this.emit('close', err.code, err.message);
	  this.removeAllListeners();
	};

	JsonpReceiver.prototype._cleanup = function () {
	  debug('_cleanup');
	  clearTimeout(this.timeoutId);
	  if (this.script2) {
	    this.script2.parentNode.removeChild(this.script2);
	    this.script2 = null;
	  }
	  if (this.script) {
	    var script = this.script;
	    // Unfortunately, you can't really abort script loading of
	    // the script.
	    script.parentNode.removeChild(script);
	    script.onreadystatechange = script.onerror = script.onload = script.onclick = null;
	    this.script = null;
	  }
	  delete global[utils.WPrefix][this.id];
	};

	JsonpReceiver.prototype._scriptError = function () {
	  debug('_scriptError');
	  var self = this;
	  if (this.errorTimer) {
	    return;
	  }

	  this.errorTimer = setTimeout(function () {
	    if (!self.loadedOkay) {
	      self._abort(new Error('JSONP script loaded abnormally (onerror)'));
	    }
	  }, JsonpReceiver.scriptErrorTimeout);
	};

	JsonpReceiver.prototype._createScript = function (url) {
	  debug('_createScript', url);
	  var self = this;
	  var script = this.script = global.document.createElement('script');
	  var script2; // Opera synchronous load trick.

	  script.id = 'a' + random.string(8);
	  script.src = url;
	  script.type = 'text/javascript';
	  script.charset = 'UTF-8';
	  script.onerror = this._scriptError.bind(this);
	  script.onload = function () {
	    debug('onload');
	    self._abort(new Error('JSONP script loaded abnormally (onload)'));
	  };

	  // IE9 fires 'error' event after onreadystatechange or before, in random order.
	  // Use loadedOkay to determine if actually errored
	  script.onreadystatechange = function () {
	    debug('onreadystatechange', script.readyState);
	    if (/loaded|closed/.test(script.readyState)) {
	      if (script && script.htmlFor && script.onclick) {
	        self.loadedOkay = true;
	        try {
	          // In IE, actually execute the script.
	          script.onclick();
	        } catch (x) {}
	      }
	      if (script) {
	        self._abort(new Error('JSONP script loaded abnormally (onreadystatechange)'));
	      }
	    }
	  };
	  // IE: event/htmlFor/onclick trick.
	  // One can't rely on proper order for onreadystatechange. In order to
	  // make sure, set a 'htmlFor' and 'event' properties, so that
	  // script code will be installed as 'onclick' handler for the
	  // script object. Later, onreadystatechange, manually execute this
	  // code. FF and Chrome doesn't work with 'event' and 'htmlFor'
	  // set. For reference see:
	  //   http://jaubourg.net/2010/07/loading-script-as-onclick-handler-of.html
	  // Also, read on that about script ordering:
	  //   http://wiki.whatwg.org/wiki/Dynamic_Script_Execution_Order
	  if (typeof script.async === 'undefined' && global.document.attachEvent) {
	    // According to mozilla docs, in recent browsers script.async defaults
	    // to 'true', so we may use it to detect a good browser:
	    // https://developer.mozilla.org/en/HTML/Element/script
	    if (!browser.isOpera()) {
	      // Naively assume we're in IE
	      try {
	        script.htmlFor = script.id;
	        script.event = 'onclick';
	      } catch (x) {}
	      script.async = true;
	    } else {
	      // Opera, second sync script hack
	      script2 = this.script2 = global.document.createElement('script');
	      script2.text = "try{var a = document.getElementById('" + script.id + "'); if(a)a.onerror();}catch(x){};";
	      script.async = script2.async = false;
	    }
	  }
	  if (typeof script.async !== 'undefined') {
	    script.async = true;
	  }

	  var head = global.document.getElementsByTagName('head')[0];
	  head.insertBefore(script, head.firstChild);
	  if (script2) {
	    head.insertBefore(script2, head.firstChild);
	  }
	};

	module.exports = JsonpReceiver;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(16), (function() { return this; }())))

/***/ },
/* 113 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process, global) {'use strict';

	var random = __webpack_require__(72),
	    urlUtils = __webpack_require__(74);

	var debug = function debug() {};
	if (process.env.NODE_ENV !== 'production') {
	  debug = __webpack_require__(78)('sockjs-client:sender:jsonp');
	}

	var form, area;

	function createIframe(id) {
	  debug('createIframe', id);
	  try {
	    // ie6 dynamic iframes with target="" support (thanks Chris Lambacher)
	    return global.document.createElement('<iframe name="' + id + '">');
	  } catch (x) {
	    var iframe = global.document.createElement('iframe');
	    iframe.name = id;
	    return iframe;
	  }
	}

	function createForm() {
	  debug('createForm');
	  form = global.document.createElement('form');
	  form.style.display = 'none';
	  form.style.position = 'absolute';
	  form.method = 'POST';
	  form.enctype = 'application/x-www-form-urlencoded';
	  form.acceptCharset = 'UTF-8';

	  area = global.document.createElement('textarea');
	  area.name = 'd';
	  form.appendChild(area);

	  global.document.body.appendChild(form);
	}

	module.exports = function (url, payload, callback) {
	  debug(url, payload);
	  if (!form) {
	    createForm();
	  }
	  var id = 'a' + random.string(8);
	  form.target = id;
	  form.action = urlUtils.addQuery(urlUtils.addPath(url, '/jsonp_send'), 'i=' + id);

	  var iframe = createIframe(id);
	  iframe.id = id;
	  iframe.style.display = 'none';
	  form.appendChild(iframe);

	  try {
	    area.value = payload;
	  } catch (e) {
	    // seriously broken browsers get here
	  }
	  form.submit();

	  var completed = function completed(err) {
	    debug('completed', id, err);
	    if (!iframe.onerror) {
	      return;
	    }
	    iframe.onreadystatechange = iframe.onerror = iframe.onload = null;
	    // Opera mini doesn't like if we GC iframe
	    // immediately, thus this timeout.
	    setTimeout(function () {
	      debug('cleaning up', id);
	      iframe.parentNode.removeChild(iframe);
	      iframe = null;
	    }, 500);
	    area.value = '';
	    // It is not possible to detect if the iframe succeeded or
	    // failed to submit our form.
	    callback(err);
	  };
	  iframe.onerror = function () {
	    debug('onerror', id);
	    completed();
	  };
	  iframe.onload = function () {
	    debug('onload', id);
	    completed();
	  };
	  iframe.onreadystatechange = function (e) {
	    debug('onreadystatechange', id, iframe.readyState, e);
	    if (iframe.readyState === 'complete') {
	      completed();
	    }
	  };
	  return function () {
	    debug('aborted', id);
	    completed(new Error('Aborted'));
	  };
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(16), (function() { return this; }())))

/***/ },
/* 114 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process, global) {'use strict';

	__webpack_require__(115);

	var URL = __webpack_require__(75),
	    inherits = __webpack_require__(81),
	    JSON3 = __webpack_require__(102),
	    random = __webpack_require__(72),
	    escape = __webpack_require__(116),
	    urlUtils = __webpack_require__(74),
	    eventUtils = __webpack_require__(71),
	    transport = __webpack_require__(117),
	    objectUtils = __webpack_require__(106),
	    browser = __webpack_require__(94),
	    log = __webpack_require__(118),
	    Event = __webpack_require__(119),
	    EventTarget = __webpack_require__(83),
	    loc = __webpack_require__(120),
	    CloseEvent = __webpack_require__(121),
	    TransportMessageEvent = __webpack_require__(122),
	    InfoReceiver = __webpack_require__(123);

	var debug = function debug() {};
	if (process.env.NODE_ENV !== 'production') {
	  // Make debug module available globally so you can enable via the console easily
	  global.dbg = __webpack_require__(78);
	  debug = global.dbg('sockjs-client:main');
	}

	var transports;

	// follow constructor steps defined at http://dev.w3.org/html5/websockets/#the-websocket-interface
	function SockJS(url, protocols, options) {
	  if (!(this instanceof SockJS)) {
	    return new SockJS(url, protocols, options);
	  }
	  if (arguments.length < 1) {
	    throw new TypeError("Failed to construct 'SockJS: 1 argument required, but only 0 present");
	  }
	  EventTarget.call(this);

	  this.readyState = SockJS.CONNECTING;
	  this.extensions = '';
	  this.protocol = '';

	  // non-standard extension
	  options = options || {};
	  if (options.protocols_whitelist) {
	    log.warn("'protocols_whitelist' is DEPRECATED. Use 'transports' instead.");
	  }
	  this._transportsWhitelist = options.transports;

	  var sessionId = options.sessionId || 8;
	  if (typeof sessionId === 'function') {
	    this._generateSessionId = sessionId;
	  } else if (typeof sessionId === 'number') {
	    this._generateSessionId = function () {
	      return random.string(sessionId);
	    };
	  } else {
	    throw new TypeError("If sessionId is used in the options, it needs to be a number or a function.");
	  }

	  this._server = options.server || random.numberString(1000);

	  // Step 1 of WS spec - parse and validate the url. Issue #8
	  var parsedUrl = new URL(url);
	  if (!parsedUrl.host || !parsedUrl.protocol) {
	    throw new SyntaxError("The URL '" + url + "' is invalid");
	  } else if (parsedUrl.hash) {
	    throw new SyntaxError('The URL must not contain a fragment');
	  } else if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
	    throw new SyntaxError("The URL's scheme must be either 'http:' or 'https:'. '" + parsedUrl.protocol + "' is not allowed.");
	  }

	  var secure = parsedUrl.protocol === 'https:';
	  // Step 2 - don't allow secure origin with an insecure protocol
	  if (loc.protocol === 'https' && !secure) {
	    throw new Error('SecurityError: An insecure SockJS connection may not be initiated from a page loaded over HTTPS');
	  }

	  // Step 3 - check port access - no need here
	  // Step 4 - parse protocols argument
	  if (!protocols) {
	    protocols = [];
	  } else if (!Array.isArray(protocols)) {
	    protocols = [protocols];
	  }

	  // Step 5 - check protocols argument
	  var sortedProtocols = protocols.sort();
	  sortedProtocols.forEach(function (proto, i) {
	    if (!proto) {
	      throw new SyntaxError("The protocols entry '" + proto + "' is invalid.");
	    }
	    if (i < sortedProtocols.length - 1 && proto === sortedProtocols[i + 1]) {
	      throw new SyntaxError("The protocols entry '" + proto + "' is duplicated.");
	    }
	  });

	  // Step 6 - convert origin
	  var o = urlUtils.getOrigin(loc.href);
	  this._origin = o ? o.toLowerCase() : null;

	  // remove the trailing slash
	  parsedUrl.set('pathname', parsedUrl.pathname.replace(/\/+$/, ''));

	  // store the sanitized url
	  this.url = parsedUrl.href;
	  debug('using url', this.url);

	  // Step 7 - start connection in background
	  // obtain server info
	  // http://sockjs.github.io/sockjs-protocol/sockjs-protocol-0.3.3.html#section-26
	  this._urlInfo = {
	    nullOrigin: !browser.hasDomain(),
	    sameOrigin: urlUtils.isOriginEqual(this.url, loc.href),
	    sameScheme: urlUtils.isSchemeEqual(this.url, loc.href)
	  };

	  this._ir = new InfoReceiver(this.url, this._urlInfo);
	  this._ir.once('finish', this._receiveInfo.bind(this));
	}

	inherits(SockJS, EventTarget);

	function userSetCode(code) {
	  return code === 1000 || code >= 3000 && code <= 4999;
	}

	SockJS.prototype.close = function (code, reason) {
	  // Step 1
	  if (code && !userSetCode(code)) {
	    throw new Error('InvalidAccessError: Invalid code');
	  }
	  // Step 2.4 states the max is 123 bytes, but we are just checking length
	  if (reason && reason.length > 123) {
	    throw new SyntaxError('reason argument has an invalid length');
	  }

	  // Step 3.1
	  if (this.readyState === SockJS.CLOSING || this.readyState === SockJS.CLOSED) {
	    return;
	  }

	  // TODO look at docs to determine how to set this
	  var wasClean = true;
	  this._close(code || 1000, reason || 'Normal closure', wasClean);
	};

	SockJS.prototype.send = function (data) {
	  // #13 - convert anything non-string to string
	  // TODO this currently turns objects into [object Object]
	  if (typeof data !== 'string') {
	    data = '' + data;
	  }
	  if (this.readyState === SockJS.CONNECTING) {
	    throw new Error('InvalidStateError: The connection has not been established yet');
	  }
	  if (this.readyState !== SockJS.OPEN) {
	    return;
	  }
	  this._transport.send(escape.quote(data));
	};

	SockJS.version = __webpack_require__(104);

	SockJS.CONNECTING = 0;
	SockJS.OPEN = 1;
	SockJS.CLOSING = 2;
	SockJS.CLOSED = 3;

	SockJS.prototype._receiveInfo = function (info, rtt) {
	  debug('_receiveInfo', rtt);
	  this._ir = null;
	  if (!info) {
	    this._close(1002, 'Cannot connect to server');
	    return;
	  }

	  // establish a round-trip timeout (RTO) based on the
	  // round-trip time (RTT)
	  this._rto = this.countRTO(rtt);
	  // allow server to override url used for the actual transport
	  this._transUrl = info.base_url ? info.base_url : this.url;
	  info = objectUtils.extend(info, this._urlInfo);
	  debug('info', info);
	  // determine list of desired and supported transports
	  var enabledTransports = transports.filterToEnabled(this._transportsWhitelist, info);
	  this._transports = enabledTransports.main;
	  debug(this._transports.length + ' enabled transports');

	  this._connect();
	};

	SockJS.prototype._connect = function () {
	  for (var Transport = this._transports.shift(); Transport; Transport = this._transports.shift()) {
	    debug('attempt', Transport.transportName);
	    if (Transport.needBody) {
	      if (!global.document.body || typeof global.document.readyState !== 'undefined' && global.document.readyState !== 'complete' && global.document.readyState !== 'interactive') {
	        debug('waiting for body');
	        this._transports.unshift(Transport);
	        eventUtils.attachEvent('load', this._connect.bind(this));
	        return;
	      }
	    }

	    // calculate timeout based on RTO and round trips. Default to 5s
	    var timeoutMs = this._rto * Transport.roundTrips || 5000;
	    this._transportTimeoutId = setTimeout(this._transportTimeout.bind(this), timeoutMs);
	    debug('using timeout', timeoutMs);

	    var transportUrl = urlUtils.addPath(this._transUrl, '/' + this._server + '/' + this._generateSessionId());
	    debug('transport url', transportUrl);
	    var transportObj = new Transport(transportUrl, this._transUrl);
	    transportObj.on('message', this._transportMessage.bind(this));
	    transportObj.once('close', this._transportClose.bind(this));
	    transportObj.transportName = Transport.transportName;
	    this._transport = transportObj;

	    return;
	  }
	  this._close(2000, 'All transports failed', false);
	};

	SockJS.prototype._transportTimeout = function () {
	  debug('_transportTimeout');
	  if (this.readyState === SockJS.CONNECTING) {
	    this._transportClose(2007, 'Transport timed out');
	  }
	};

	SockJS.prototype._transportMessage = function (msg) {
	  debug('_transportMessage', msg);
	  var self = this,
	      type = msg.slice(0, 1),
	      content = msg.slice(1),
	      payload;

	  // first check for messages that don't need a payload
	  switch (type) {
	    case 'o':
	      this._open();
	      return;
	    case 'h':
	      this.dispatchEvent(new Event('heartbeat'));
	      debug('heartbeat', this.transport);
	      return;
	  }

	  if (content) {
	    try {
	      payload = JSON3.parse(content);
	    } catch (e) {
	      debug('bad json', content);
	    }
	  }

	  if (typeof payload === 'undefined') {
	    debug('empty payload', content);
	    return;
	  }

	  switch (type) {
	    case 'a':
	      if (Array.isArray(payload)) {
	        payload.forEach(function (p) {
	          debug('message', self.transport, p);
	          self.dispatchEvent(new TransportMessageEvent(p));
	        });
	      }
	      break;
	    case 'm':
	      debug('message', this.transport, payload);
	      this.dispatchEvent(new TransportMessageEvent(payload));
	      break;
	    case 'c':
	      if (Array.isArray(payload) && payload.length === 2) {
	        this._close(payload[0], payload[1], true);
	      }
	      break;
	  }
	};

	SockJS.prototype._transportClose = function (code, reason) {
	  debug('_transportClose', this.transport, code, reason);
	  if (this._transport) {
	    this._transport.removeAllListeners();
	    this._transport = null;
	    this.transport = null;
	  }

	  if (!userSetCode(code) && code !== 2000 && this.readyState === SockJS.CONNECTING) {
	    this._connect();
	    return;
	  }

	  this._close(code, reason);
	};

	SockJS.prototype._open = function () {
	  debug('_open', this._transport.transportName, this.readyState);
	  if (this.readyState === SockJS.CONNECTING) {
	    if (this._transportTimeoutId) {
	      clearTimeout(this._transportTimeoutId);
	      this._transportTimeoutId = null;
	    }
	    this.readyState = SockJS.OPEN;
	    this.transport = this._transport.transportName;
	    this.dispatchEvent(new Event('open'));
	    debug('connected', this.transport);
	  } else {
	    // The server might have been restarted, and lost track of our
	    // connection.
	    this._close(1006, 'Server lost session');
	  }
	};

	SockJS.prototype._close = function (code, reason, wasClean) {
	  debug('_close', this.transport, code, reason, wasClean, this.readyState);
	  var forceFail = false;

	  if (this._ir) {
	    forceFail = true;
	    this._ir.close();
	    this._ir = null;
	  }
	  if (this._transport) {
	    this._transport.close();
	    this._transport = null;
	    this.transport = null;
	  }

	  if (this.readyState === SockJS.CLOSED) {
	    throw new Error('InvalidStateError: SockJS has already been closed');
	  }

	  this.readyState = SockJS.CLOSING;
	  setTimeout(function () {
	    this.readyState = SockJS.CLOSED;

	    if (forceFail) {
	      this.dispatchEvent(new Event('error'));
	    }

	    var e = new CloseEvent('close');
	    e.wasClean = wasClean || false;
	    e.code = code || 1000;
	    e.reason = reason;

	    this.dispatchEvent(e);
	    this.onmessage = this.onclose = this.onerror = null;
	    debug('disconnected');
	  }.bind(this), 0);
	};

	// See: http://www.erg.abdn.ac.uk/~gerrit/dccp/notes/ccid2/rto_estimator/
	// and RFC 2988.
	SockJS.prototype.countRTO = function (rtt) {
	  // In a local environment, when using IE8/9 and the `jsonp-polling`
	  // transport the time needed to establish a connection (the time that pass
	  // from the opening of the transport to the call of `_dispatchOpen`) is
	  // around 200msec (the lower bound used in the article above) and this
	  // causes spurious timeouts. For this reason we calculate a value slightly
	  // larger than that used in the article.
	  if (rtt > 100) {
	    return 4 * rtt; // rto > 400msec
	  }
	  return 300 + rtt; // 300msec < rto <= 400msec
	};

	module.exports = function (availableTransports) {
	  transports = transport(availableTransports);
	  __webpack_require__(128)(SockJS, availableTransports);
	  return SockJS;
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(16), (function() { return this; }())))

/***/ },
/* 115 */
/***/ function(module, exports) {

	/* eslint-disable */
	/* jscs: disable */
	'use strict';

	// pulled specific shims from https://github.com/es-shims/es5-shim

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var ArrayPrototype = Array.prototype;
	var ObjectPrototype = Object.prototype;
	var FunctionPrototype = Function.prototype;
	var StringPrototype = String.prototype;
	var array_slice = ArrayPrototype.slice;

	var _toString = ObjectPrototype.toString;
	var isFunction = function isFunction(val) {
	    return ObjectPrototype.toString.call(val) === '[object Function]';
	};
	var isArray = function isArray(obj) {
	    return _toString.call(obj) === '[object Array]';
	};
	var isString = function isString(obj) {
	    return _toString.call(obj) === '[object String]';
	};

	var supportsDescriptors = Object.defineProperty && function () {
	    try {
	        Object.defineProperty({}, 'x', {});
	        return true;
	    } catch (e) {
	        /* this is ES3 */
	        return false;
	    }
	}();

	// Define configurable, writable and non-enumerable props
	// if they don't exist.
	var defineProperty;
	if (supportsDescriptors) {
	    defineProperty = function defineProperty(object, name, method, forceAssign) {
	        if (!forceAssign && name in object) {
	            return;
	        }
	        Object.defineProperty(object, name, {
	            configurable: true,
	            enumerable: false,
	            writable: true,
	            value: method
	        });
	    };
	} else {
	    defineProperty = function defineProperty(object, name, method, forceAssign) {
	        if (!forceAssign && name in object) {
	            return;
	        }
	        object[name] = method;
	    };
	}
	var defineProperties = function defineProperties(object, map, forceAssign) {
	    for (var name in map) {
	        if (ObjectPrototype.hasOwnProperty.call(map, name)) {
	            defineProperty(object, name, map[name], forceAssign);
	        }
	    }
	};

	var toObject = function toObject(o) {
	    if (o == null) {
	        // this matches both null and undefined
	        throw new TypeError("can't convert " + o + ' to object');
	    }
	    return Object(o);
	};

	//
	// Util
	// ======
	//

	// ES5 9.4
	// http://es5.github.com/#x9.4
	// http://jsperf.com/to-integer

	function toInteger(num) {
	    var n = +num;
	    if (n !== n) {
	        // isNaN
	        n = 0;
	    } else if (n !== 0 && n !== 1 / 0 && n !== -(1 / 0)) {
	        n = (n > 0 || -1) * Math.floor(Math.abs(n));
	    }
	    return n;
	}

	function ToUint32(x) {
	    return x >>> 0;
	}

	//
	// Function
	// ========
	//

	// ES-5 15.3.4.5
	// http://es5.github.com/#x15.3.4.5

	function Empty() {}

	defineProperties(FunctionPrototype, {
	    bind: function bind(that) {
	        // .length is 1
	        // 1. Let Target be the this value.
	        var target = this;
	        // 2. If IsCallable(Target) is false, throw a TypeError exception.
	        if (!isFunction(target)) {
	            throw new TypeError('Function.prototype.bind called on incompatible ' + target);
	        }
	        // 3. Let A be a new (possibly empty) internal list of all of the
	        //   argument values provided after thisArg (arg1, arg2 etc), in order.
	        // XXX slicedArgs will stand in for "A" if used
	        var args = array_slice.call(arguments, 1); // for normal call
	        // 4. Let F be a new native ECMAScript object.
	        // 11. Set the [[Prototype]] internal property of F to the standard
	        //   built-in Function prototype object as specified in 15.3.3.1.
	        // 12. Set the [[Call]] internal property of F as described in
	        //   15.3.4.5.1.
	        // 13. Set the [[Construct]] internal property of F as described in
	        //   15.3.4.5.2.
	        // 14. Set the [[HasInstance]] internal property of F as described in
	        //   15.3.4.5.3.
	        var binder = function binder() {

	            if (this instanceof bound) {
	                // 15.3.4.5.2 [[Construct]]
	                // When the [[Construct]] internal method of a function object,
	                // F that was created using the bind function is called with a
	                // list of arguments ExtraArgs, the following steps are taken:
	                // 1. Let target be the value of F's [[TargetFunction]]
	                //   internal property.
	                // 2. If target has no [[Construct]] internal method, a
	                //   TypeError exception is thrown.
	                // 3. Let boundArgs be the value of F's [[BoundArgs]] internal
	                //   property.
	                // 4. Let args be a new list containing the same values as the
	                //   list boundArgs in the same order followed by the same
	                //   values as the list ExtraArgs in the same order.
	                // 5. Return the result of calling the [[Construct]] internal
	                //   method of target providing args as the arguments.

	                var result = target.apply(this, args.concat(array_slice.call(arguments)));
	                if (Object(result) === result) {
	                    return result;
	                }
	                return this;
	            } else {
	                // 15.3.4.5.1 [[Call]]
	                // When the [[Call]] internal method of a function object, F,
	                // which was created using the bind function is called with a
	                // this value and a list of arguments ExtraArgs, the following
	                // steps are taken:
	                // 1. Let boundArgs be the value of F's [[BoundArgs]] internal
	                //   property.
	                // 2. Let boundThis be the value of F's [[BoundThis]] internal
	                //   property.
	                // 3. Let target be the value of F's [[TargetFunction]] internal
	                //   property.
	                // 4. Let args be a new list containing the same values as the
	                //   list boundArgs in the same order followed by the same
	                //   values as the list ExtraArgs in the same order.
	                // 5. Return the result of calling the [[Call]] internal method
	                //   of target providing boundThis as the this value and
	                //   providing args as the arguments.

	                // equiv: target.call(this, ...boundArgs, ...args)
	                return target.apply(that, args.concat(array_slice.call(arguments)));
	            }
	        };

	        // 15. If the [[Class]] internal property of Target is "Function", then
	        //     a. Let L be the length property of Target minus the length of A.
	        //     b. Set the length own property of F to either 0 or L, whichever is
	        //       larger.
	        // 16. Else set the length own property of F to 0.

	        var boundLength = Math.max(0, target.length - args.length);

	        // 17. Set the attributes of the length own property of F to the values
	        //   specified in 15.3.5.1.
	        var boundArgs = [];
	        for (var i = 0; i < boundLength; i++) {
	            boundArgs.push('$' + i);
	        }

	        // XXX Build a dynamic function with desired amount of arguments is the only
	        // way to set the length property of a function.
	        // In environments where Content Security Policies enabled (Chrome extensions,
	        // for ex.) all use of eval or Function costructor throws an exception.
	        // However in all of these environments Function.prototype.bind exists
	        // and so this code will never be executed.
	        var bound = Function('binder', 'return function (' + boundArgs.join(',') + '){ return binder.apply(this, arguments); }')(binder);

	        if (target.prototype) {
	            Empty.prototype = target.prototype;
	            bound.prototype = new Empty();
	            // Clean up dangling references.
	            Empty.prototype = null;
	        }

	        // TODO
	        // 18. Set the [[Extensible]] internal property of F to true.

	        // TODO
	        // 19. Let thrower be the [[ThrowTypeError]] function Object (13.2.3).
	        // 20. Call the [[DefineOwnProperty]] internal method of F with
	        //   arguments "caller", PropertyDescriptor {[[Get]]: thrower, [[Set]]:
	        //   thrower, [[Enumerable]]: false, [[Configurable]]: false}, and
	        //   false.
	        // 21. Call the [[DefineOwnProperty]] internal method of F with
	        //   arguments "arguments", PropertyDescriptor {[[Get]]: thrower,
	        //   [[Set]]: thrower, [[Enumerable]]: false, [[Configurable]]: false},
	        //   and false.

	        // TODO
	        // NOTE Function objects created using Function.prototype.bind do not
	        // have a prototype property or the [[Code]], [[FormalParameters]], and
	        // [[Scope]] internal properties.
	        // XXX can't delete prototype in pure-js.

	        // 22. Return F.
	        return bound;
	    }
	});

	//
	// Array
	// =====
	//

	// ES5 15.4.3.2
	// http://es5.github.com/#x15.4.3.2
	// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/isArray
	defineProperties(Array, { isArray: isArray });

	var boxedString = Object('a');
	var splitString = boxedString[0] !== 'a' || !(0 in boxedString);

	var properlyBoxesContext = function properlyBoxed(method) {
	    // Check node 0.6.21 bug where third parameter is not boxed
	    var properlyBoxesNonStrict = true;
	    var properlyBoxesStrict = true;
	    if (method) {
	        method.call('foo', function (_, __, context) {
	            if ((typeof context === 'undefined' ? 'undefined' : _typeof(context)) !== 'object') {
	                properlyBoxesNonStrict = false;
	            }
	        });

	        method.call([1], function () {
	            'use strict';

	            properlyBoxesStrict = typeof this === 'string';
	        }, 'x');
	    }
	    return !!method && properlyBoxesNonStrict && properlyBoxesStrict;
	};

	defineProperties(ArrayPrototype, {
	    forEach: function forEach(fun /*, thisp*/) {
	        var object = toObject(this),
	            self = splitString && isString(this) ? this.split('') : object,
	            thisp = arguments[1],
	            i = -1,
	            length = self.length >>> 0;

	        // If no callback function or if callback is not a callable function
	        if (!isFunction(fun)) {
	            throw new TypeError(); // TODO message
	        }

	        while (++i < length) {
	            if (i in self) {
	                // Invoke the callback function with call, passing arguments:
	                // context, property value, property key, thisArg object
	                // context
	                fun.call(thisp, self[i], i, object);
	            }
	        }
	    }
	}, !properlyBoxesContext(ArrayPrototype.forEach));

	// ES5 15.4.4.14
	// http://es5.github.com/#x15.4.4.14
	// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/indexOf
	var hasFirefox2IndexOfBug = Array.prototype.indexOf && [0, 1].indexOf(1, 2) !== -1;
	defineProperties(ArrayPrototype, {
	    indexOf: function indexOf(sought /*, fromIndex */) {
	        var self = splitString && isString(this) ? this.split('') : toObject(this),
	            length = self.length >>> 0;

	        if (!length) {
	            return -1;
	        }

	        var i = 0;
	        if (arguments.length > 1) {
	            i = toInteger(arguments[1]);
	        }

	        // handle negative indices
	        i = i >= 0 ? i : Math.max(0, length + i);
	        for (; i < length; i++) {
	            if (i in self && self[i] === sought) {
	                return i;
	            }
	        }
	        return -1;
	    }
	}, hasFirefox2IndexOfBug);

	//
	// String
	// ======
	//

	// ES5 15.5.4.14
	// http://es5.github.com/#x15.5.4.14

	// [bugfix, IE lt 9, firefox 4, Konqueror, Opera, obscure browsers]
	// Many browsers do not split properly with regular expressions or they
	// do not perform the split correctly under obscure conditions.
	// See http://blog.stevenlevithan.com/archives/cross-browser-split
	// I've tested in many browsers and this seems to cover the deviant ones:
	//    'ab'.split(/(?:ab)*/) should be ["", ""], not [""]
	//    '.'.split(/(.?)(.?)/) should be ["", ".", "", ""], not ["", ""]
	//    'tesst'.split(/(s)*/) should be ["t", undefined, "e", "s", "t"], not
	//       [undefined, "t", undefined, "e", ...]
	//    ''.split(/.?/) should be [], not [""]
	//    '.'.split(/()()/) should be ["."], not ["", "", "."]

	var string_split = StringPrototype.split;
	if ('ab'.split(/(?:ab)*/).length !== 2 || '.'.split(/(.?)(.?)/).length !== 4 || 'tesst'.split(/(s)*/)[1] === 't' || 'test'.split(/(?:)/, -1).length !== 4 || ''.split(/.?/).length || '.'.split(/()()/).length > 1) {
	    (function () {
	        var compliantExecNpcg = /()??/.exec('')[1] === void 0; // NPCG: nonparticipating capturing group

	        StringPrototype.split = function (separator, limit) {
	            var string = this;
	            if (separator === void 0 && limit === 0) {
	                return [];
	            }

	            // If `separator` is not a regex, use native split
	            if (_toString.call(separator) !== '[object RegExp]') {
	                return string_split.call(this, separator, limit);
	            }

	            var output = [],
	                flags = (separator.ignoreCase ? 'i' : '') + (separator.multiline ? 'm' : '') + (separator.extended ? 'x' : '') + ( // Proposed for ES6
	            separator.sticky ? 'y' : ''),
	                // Firefox 3+
	            lastLastIndex = 0,

	            // Make `global` and avoid `lastIndex` issues by working with a copy
	            separator2,
	                match,
	                lastIndex,
	                lastLength;
	            separator = new RegExp(separator.source, flags + 'g');
	            string += ''; // Type-convert
	            if (!compliantExecNpcg) {
	                // Doesn't need flags gy, but they don't hurt
	                separator2 = new RegExp('^' + separator.source + '$(?!\\s)', flags);
	            }
	            /* Values for `limit`, per the spec:
	             * If undefined: 4294967295 // Math.pow(2, 32) - 1
	             * If 0, Infinity, or NaN: 0
	             * If positive number: limit = Math.floor(limit); if (limit > 4294967295) limit -= 4294967296;
	             * If negative number: 4294967296 - Math.floor(Math.abs(limit))
	             * If other: Type-convert, then use the above rules
	             */
	            limit = limit === void 0 ? -1 >>> 0 : // Math.pow(2, 32) - 1
	            ToUint32(limit);
	            while (match = separator.exec(string)) {
	                // `separator.lastIndex` is not reliable cross-browser
	                lastIndex = match.index + match[0].length;
	                if (lastIndex > lastLastIndex) {
	                    output.push(string.slice(lastLastIndex, match.index));
	                    // Fix browsers whose `exec` methods don't consistently return `undefined` for
	                    // nonparticipating capturing groups
	                    if (!compliantExecNpcg && match.length > 1) {
	                        match[0].replace(separator2, function () {
	                            for (var i = 1; i < arguments.length - 2; i++) {
	                                if (arguments[i] === void 0) {
	                                    match[i] = void 0;
	                                }
	                            }
	                        });
	                    }
	                    if (match.length > 1 && match.index < string.length) {
	                        ArrayPrototype.push.apply(output, match.slice(1));
	                    }
	                    lastLength = match[0].length;
	                    lastLastIndex = lastIndex;
	                    if (output.length >= limit) {
	                        break;
	                    }
	                }
	                if (separator.lastIndex === match.index) {
	                    separator.lastIndex++; // Avoid an infinite loop
	                }
	            }
	            if (lastLastIndex === string.length) {
	                if (lastLength || !separator.test('')) {
	                    output.push('');
	                }
	            } else {
	                output.push(string.slice(lastLastIndex));
	            }
	            return output.length > limit ? output.slice(0, limit) : output;
	        };
	    })();

	    // [bugfix, chrome]
	    // If separator is undefined, then the result array contains just one String,
	    // which is the this value (converted to a String). If limit is not undefined,
	    // then the output array is truncated so that it contains no more than limit
	    // elements.
	    // "0".split(undefined, 0) -> []
	} else if ('0'.split(void 0, 0).length) {
	    StringPrototype.split = function split(separator, limit) {
	        if (separator === void 0 && limit === 0) {
	            return [];
	        }
	        return string_split.call(this, separator, limit);
	    };
	}

	// ES5 15.5.4.20
	// whitespace from: http://es5.github.io/#x15.5.4.20
	var ws = '\t\n\x0B\f\r \xA0\u1680\u180E\u2000\u2001\u2002\u2003' + '\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028' + '\u2029\uFEFF';
	var zeroWidth = '\u200B';
	var wsRegexChars = '[' + ws + ']';
	var trimBeginRegexp = new RegExp('^' + wsRegexChars + wsRegexChars + '*');
	var trimEndRegexp = new RegExp(wsRegexChars + wsRegexChars + '*$');
	var hasTrimWhitespaceBug = StringPrototype.trim && (ws.trim() || !zeroWidth.trim());
	defineProperties(StringPrototype, {
	    // http://blog.stevenlevithan.com/archives/faster-trim-javascript
	    // http://perfectionkills.com/whitespace-deviations/
	    trim: function trim() {
	        if (this === void 0 || this === null) {
	            throw new TypeError("can't convert " + this + ' to object');
	        }
	        return String(this).replace(trimBeginRegexp, '').replace(trimEndRegexp, '');
	    }
	}, hasTrimWhitespaceBug);

	// ECMA-262, 3rd B.2.3
	// Not an ECMAScript standard, although ECMAScript 3rd Edition has a
	// non-normative section suggesting uniform semantics and it should be
	// normalized across all browsers
	// [bugfix, IE lt 9] IE < 9 substr() with negative value not working in IE
	var string_substr = StringPrototype.substr;
	var hasNegativeSubstrBug = ''.substr && '0b'.substr(-1) !== 'b';
	defineProperties(StringPrototype, {
	    substr: function substr(start, length) {
	        return string_substr.call(this, start < 0 ? (start = this.length + start) < 0 ? 0 : start : start, length);
	    }
	}, hasNegativeSubstrBug);

/***/ },
/* 116 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var JSON3 = __webpack_require__(102);

	// Some extra characters that Chrome gets wrong, and substitutes with
	// something else on the wire.
	var extraEscapable = /[\x00-\x1f\ud800-\udfff\ufffe\uffff\u0300-\u0333\u033d-\u0346\u034a-\u034c\u0350-\u0352\u0357-\u0358\u035c-\u0362\u0374\u037e\u0387\u0591-\u05af\u05c4\u0610-\u0617\u0653-\u0654\u0657-\u065b\u065d-\u065e\u06df-\u06e2\u06eb-\u06ec\u0730\u0732-\u0733\u0735-\u0736\u073a\u073d\u073f-\u0741\u0743\u0745\u0747\u07eb-\u07f1\u0951\u0958-\u095f\u09dc-\u09dd\u09df\u0a33\u0a36\u0a59-\u0a5b\u0a5e\u0b5c-\u0b5d\u0e38-\u0e39\u0f43\u0f4d\u0f52\u0f57\u0f5c\u0f69\u0f72-\u0f76\u0f78\u0f80-\u0f83\u0f93\u0f9d\u0fa2\u0fa7\u0fac\u0fb9\u1939-\u193a\u1a17\u1b6b\u1cda-\u1cdb\u1dc0-\u1dcf\u1dfc\u1dfe\u1f71\u1f73\u1f75\u1f77\u1f79\u1f7b\u1f7d\u1fbb\u1fbe\u1fc9\u1fcb\u1fd3\u1fdb\u1fe3\u1feb\u1fee-\u1fef\u1ff9\u1ffb\u1ffd\u2000-\u2001\u20d0-\u20d1\u20d4-\u20d7\u20e7-\u20e9\u2126\u212a-\u212b\u2329-\u232a\u2adc\u302b-\u302c\uaab2-\uaab3\uf900-\ufa0d\ufa10\ufa12\ufa15-\ufa1e\ufa20\ufa22\ufa25-\ufa26\ufa2a-\ufa2d\ufa30-\ufa6d\ufa70-\ufad9\ufb1d\ufb1f\ufb2a-\ufb36\ufb38-\ufb3c\ufb3e\ufb40-\ufb41\ufb43-\ufb44\ufb46-\ufb4e\ufff0-\uffff]/g,
	    extraLookup;

	// This may be quite slow, so let's delay until user actually uses bad
	// characters.
	var unrollLookup = function unrollLookup(escapable) {
	  var i;
	  var unrolled = {};
	  var c = [];
	  for (i = 0; i < 65536; i++) {
	    c.push(String.fromCharCode(i));
	  }
	  escapable.lastIndex = 0;
	  c.join('').replace(escapable, function (a) {
	    unrolled[a] = '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
	    return '';
	  });
	  escapable.lastIndex = 0;
	  return unrolled;
	};

	// Quote string, also taking care of unicode characters that browsers
	// often break. Especially, take care of unicode surrogates:
	// http://en.wikipedia.org/wiki/Mapping_of_Unicode_characters#Surrogates
	module.exports = {
	  quote: function quote(string) {
	    var quoted = JSON3.stringify(string);

	    // In most cases this should be very fast and good enough.
	    extraEscapable.lastIndex = 0;
	    if (!extraEscapable.test(quoted)) {
	      return quoted;
	    }

	    if (!extraLookup) {
	      extraLookup = unrollLookup(extraEscapable);
	    }

	    return quoted.replace(extraEscapable, function (a) {
	      return extraLookup[a];
	    });
	  }
	};

/***/ },
/* 117 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	var debug = function debug() {};
	if (process.env.NODE_ENV !== 'production') {
	  debug = __webpack_require__(78)('sockjs-client:utils:transport');
	}

	module.exports = function (availableTransports) {
	  return {
	    filterToEnabled: function filterToEnabled(transportsWhitelist, info) {
	      var transports = {
	        main: [],
	        facade: []
	      };
	      if (!transportsWhitelist) {
	        transportsWhitelist = [];
	      } else if (typeof transportsWhitelist === 'string') {
	        transportsWhitelist = [transportsWhitelist];
	      }

	      availableTransports.forEach(function (trans) {
	        if (!trans) {
	          return;
	        }

	        if (trans.transportName === 'websocket' && info.websocket === false) {
	          debug('disabled from server', 'websocket');
	          return;
	        }

	        if (transportsWhitelist.length && transportsWhitelist.indexOf(trans.transportName) === -1) {
	          debug('not in whitelist', trans.transportName);
	          return;
	        }

	        if (trans.enabled(info)) {
	          debug('enabled', trans.transportName);
	          transports.main.push(trans);
	          if (trans.facadeTransport) {
	            transports.facade.push(trans.facadeTransport);
	          }
	        } else {
	          debug('disabled', trans.transportName);
	        }
	      });
	      return transports;
	    }
	  };
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(16)))

/***/ },
/* 118 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var logObject = {};
	['log', 'debug', 'warn'].forEach(function (level) {
	  var levelExists = global.console && global.console[level] && global.console[level].apply;
	  logObject[level] = levelExists ? function () {
	    return global.console[level].apply(global.console, arguments);
	  } : level === 'log' ? function () {} : logObject.log;
	});

	module.exports = logObject;
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 119 */
/***/ function(module, exports) {

	'use strict';

	function Event(eventType) {
	  this.type = eventType;
	}

	Event.prototype.initEvent = function (eventType, canBubble, cancelable) {
	  this.type = eventType;
	  this.bubbles = canBubble;
	  this.cancelable = cancelable;
	  this.timeStamp = +new Date();
	  return this;
	};

	Event.prototype.stopPropagation = function () {};
	Event.prototype.preventDefault = function () {};

	Event.CAPTURING_PHASE = 1;
	Event.AT_TARGET = 2;
	Event.BUBBLING_PHASE = 3;

	module.exports = Event;

/***/ },
/* 120 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	module.exports = global.location || {
	  origin: 'http://localhost:80',
	  protocol: 'http',
	  host: 'localhost',
	  port: 80,
	  href: 'http://localhost/',
	  hash: ''
	};
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 121 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var inherits = __webpack_require__(81),
	    Event = __webpack_require__(119);

	function CloseEvent() {
	  Event.call(this);
	  this.initEvent('close', false, false);
	  this.wasClean = false;
	  this.code = 0;
	  this.reason = '';
	}

	inherits(CloseEvent, Event);

	module.exports = CloseEvent;

/***/ },
/* 122 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var inherits = __webpack_require__(81),
	    Event = __webpack_require__(119);

	function TransportMessageEvent(data) {
	  Event.call(this);
	  this.initEvent('message', false, false);
	  this.data = data;
	}

	inherits(TransportMessageEvent, Event);

	module.exports = TransportMessageEvent;

/***/ },
/* 123 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	var EventEmitter = __webpack_require__(82).EventEmitter,
	    inherits = __webpack_require__(81),
	    urlUtils = __webpack_require__(74),
	    XDR = __webpack_require__(96),
	    XHRCors = __webpack_require__(91),
	    XHRLocal = __webpack_require__(93),
	    XHRFake = __webpack_require__(124),
	    InfoIframe = __webpack_require__(125),
	    InfoAjax = __webpack_require__(127);

	var debug = function debug() {};
	if (process.env.NODE_ENV !== 'production') {
	  debug = __webpack_require__(78)('sockjs-client:info-receiver');
	}

	function InfoReceiver(baseUrl, urlInfo) {
	  debug(baseUrl);
	  var self = this;
	  EventEmitter.call(this);

	  setTimeout(function () {
	    self.doXhr(baseUrl, urlInfo);
	  }, 0);
	}

	inherits(InfoReceiver, EventEmitter);

	// TODO this is currently ignoring the list of available transports and the whitelist

	InfoReceiver._getReceiver = function (baseUrl, url, urlInfo) {
	  // determine method of CORS support (if needed)
	  if (urlInfo.sameOrigin) {
	    return new InfoAjax(url, XHRLocal);
	  }
	  if (XHRCors.enabled) {
	    return new InfoAjax(url, XHRCors);
	  }
	  if (XDR.enabled && urlInfo.sameScheme) {
	    return new InfoAjax(url, XDR);
	  }
	  if (InfoIframe.enabled()) {
	    return new InfoIframe(baseUrl, url);
	  }
	  return new InfoAjax(url, XHRFake);
	};

	InfoReceiver.prototype.doXhr = function (baseUrl, urlInfo) {
	  var self = this,
	      url = urlUtils.addPath(baseUrl, '/info');
	  debug('doXhr', url);

	  this.xo = InfoReceiver._getReceiver(baseUrl, url, urlInfo);

	  this.timeoutRef = setTimeout(function () {
	    debug('timeout');
	    self._cleanup(false);
	    self.emit('finish');
	  }, InfoReceiver.timeout);

	  this.xo.once('finish', function (info, rtt) {
	    debug('finish', info, rtt);
	    self._cleanup(true);
	    self.emit('finish', info, rtt);
	  });
	};

	InfoReceiver.prototype._cleanup = function (wasClean) {
	  debug('_cleanup');
	  clearTimeout(this.timeoutRef);
	  this.timeoutRef = null;
	  if (!wasClean && this.xo) {
	    this.xo.close();
	  }
	  this.xo = null;
	};

	InfoReceiver.prototype.close = function () {
	  debug('close');
	  this.removeAllListeners();
	  this._cleanup(false);
	};

	InfoReceiver.timeout = 8000;

	module.exports = InfoReceiver;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(16)))

/***/ },
/* 124 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var EventEmitter = __webpack_require__(82).EventEmitter,
	    inherits = __webpack_require__(81);

	function XHRFake() /* method, url, payload, opts */{
	  var self = this;
	  EventEmitter.call(this);

	  this.to = setTimeout(function () {
	    self.emit('finish', 200, '{}');
	  }, XHRFake.timeout);
	}

	inherits(XHRFake, EventEmitter);

	XHRFake.prototype.close = function () {
	  clearTimeout(this.to);
	};

	XHRFake.timeout = 2000;

	module.exports = XHRFake;

/***/ },
/* 125 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process, global) {'use strict';

	var EventEmitter = __webpack_require__(82).EventEmitter,
	    inherits = __webpack_require__(81),
	    JSON3 = __webpack_require__(102),
	    utils = __webpack_require__(71),
	    IframeTransport = __webpack_require__(101),
	    InfoReceiverIframe = __webpack_require__(126);

	var debug = function debug() {};
	if (process.env.NODE_ENV !== 'production') {
	  debug = __webpack_require__(78)('sockjs-client:info-iframe');
	}

	function InfoIframe(baseUrl, url) {
	  var self = this;
	  EventEmitter.call(this);

	  var go = function go() {
	    var ifr = self.ifr = new IframeTransport(InfoReceiverIframe.transportName, url, baseUrl);

	    ifr.once('message', function (msg) {
	      if (msg) {
	        var d;
	        try {
	          d = JSON3.parse(msg);
	        } catch (e) {
	          debug('bad json', msg);
	          self.emit('finish');
	          self.close();
	          return;
	        }

	        var info = d[0],
	            rtt = d[1];
	        self.emit('finish', info, rtt);
	      }
	      self.close();
	    });

	    ifr.once('close', function () {
	      self.emit('finish');
	      self.close();
	    });
	  };

	  // TODO this seems the same as the 'needBody' from transports
	  if (!global.document.body) {
	    utils.attachEvent('load', go);
	  } else {
	    go();
	  }
	}

	inherits(InfoIframe, EventEmitter);

	InfoIframe.enabled = function () {
	  return IframeTransport.enabled();
	};

	InfoIframe.prototype.close = function () {
	  if (this.ifr) {
	    this.ifr.close();
	  }
	  this.removeAllListeners();
	  this.ifr = null;
	};

	module.exports = InfoIframe;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(16), (function() { return this; }())))

/***/ },
/* 126 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var inherits = __webpack_require__(81),
	    EventEmitter = __webpack_require__(82).EventEmitter,
	    JSON3 = __webpack_require__(102),
	    XHRLocalObject = __webpack_require__(93),
	    InfoAjax = __webpack_require__(127);

	function InfoReceiverIframe(transUrl) {
	  var self = this;
	  EventEmitter.call(this);

	  this.ir = new InfoAjax(transUrl, XHRLocalObject);
	  this.ir.once('finish', function (info, rtt) {
	    self.ir = null;
	    self.emit('message', JSON3.stringify([info, rtt]));
	  });
	}

	inherits(InfoReceiverIframe, EventEmitter);

	InfoReceiverIframe.transportName = 'iframe-info-receiver';

	InfoReceiverIframe.prototype.close = function () {
	  if (this.ir) {
	    this.ir.close();
	    this.ir = null;
	  }
	  this.removeAllListeners();
	};

	module.exports = InfoReceiverIframe;

/***/ },
/* 127 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	var EventEmitter = __webpack_require__(82).EventEmitter,
	    inherits = __webpack_require__(81),
	    JSON3 = __webpack_require__(102),
	    objectUtils = __webpack_require__(106);

	var debug = function debug() {};
	if (process.env.NODE_ENV !== 'production') {
	  debug = __webpack_require__(78)('sockjs-client:info-ajax');
	}

	function InfoAjax(url, AjaxObject) {
	  EventEmitter.call(this);

	  var self = this;
	  var t0 = +new Date();
	  this.xo = new AjaxObject('GET', url);

	  this.xo.once('finish', function (status, text) {
	    var info, rtt;
	    if (status === 200) {
	      rtt = +new Date() - t0;
	      if (text) {
	        try {
	          info = JSON3.parse(text);
	        } catch (e) {
	          debug('bad json', text);
	        }
	      }

	      if (!objectUtils.isObject(info)) {
	        info = {};
	      }
	    }
	    self.emit('finish', info, rtt);
	    self.removeAllListeners();
	  });
	}

	inherits(InfoAjax, EventEmitter);

	InfoAjax.prototype.close = function () {
	  this.removeAllListeners();
	  this.xo.close();
	};

	module.exports = InfoAjax;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(16)))

/***/ },
/* 128 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	var urlUtils = __webpack_require__(74),
	    eventUtils = __webpack_require__(71),
	    JSON3 = __webpack_require__(102),
	    FacadeJS = __webpack_require__(129),
	    InfoIframeReceiver = __webpack_require__(126),
	    iframeUtils = __webpack_require__(105),
	    loc = __webpack_require__(120);

	var debug = function debug() {};
	if (process.env.NODE_ENV !== 'production') {
	  debug = __webpack_require__(78)('sockjs-client:iframe-bootstrap');
	}

	module.exports = function (SockJS, availableTransports) {
	  var transportMap = {};
	  availableTransports.forEach(function (at) {
	    if (at.facadeTransport) {
	      transportMap[at.facadeTransport.transportName] = at.facadeTransport;
	    }
	  });

	  // hard-coded for the info iframe
	  // TODO see if we can make this more dynamic
	  transportMap[InfoIframeReceiver.transportName] = InfoIframeReceiver;
	  var parentOrigin;

	  /* eslint-disable camelcase */
	  SockJS.bootstrap_iframe = function () {
	    /* eslint-enable camelcase */
	    var facade;
	    iframeUtils.currentWindowId = loc.hash.slice(1);
	    var onMessage = function onMessage(e) {
	      if (e.source !== parent) {
	        return;
	      }
	      if (typeof parentOrigin === 'undefined') {
	        parentOrigin = e.origin;
	      }
	      if (e.origin !== parentOrigin) {
	        return;
	      }

	      var iframeMessage;
	      try {
	        iframeMessage = JSON3.parse(e.data);
	      } catch (ignored) {
	        debug('bad json', e.data);
	        return;
	      }

	      if (iframeMessage.windowId !== iframeUtils.currentWindowId) {
	        return;
	      }
	      switch (iframeMessage.type) {
	        case 's':
	          var p;
	          try {
	            p = JSON3.parse(iframeMessage.data);
	          } catch (ignored) {
	            debug('bad json', iframeMessage.data);
	            break;
	          }
	          var version = p[0];
	          var transport = p[1];
	          var transUrl = p[2];
	          var baseUrl = p[3];
	          debug(version, transport, transUrl, baseUrl);
	          // change this to semver logic
	          if (version !== SockJS.version) {
	            throw new Error('Incompatibile SockJS! Main site uses:' + ' "' + version + '", the iframe:' + ' "' + SockJS.version + '".');
	          }

	          if (!urlUtils.isOriginEqual(transUrl, loc.href) || !urlUtils.isOriginEqual(baseUrl, loc.href)) {
	            throw new Error('Can\'t connect to different domain from within an ' + 'iframe. (' + loc.href + ', ' + transUrl + ', ' + baseUrl + ')');
	          }
	          facade = new FacadeJS(new transportMap[transport](transUrl, baseUrl));
	          break;
	        case 'm':
	          facade._send(iframeMessage.data);
	          break;
	        case 'c':
	          if (facade) {
	            facade._close();
	          }
	          facade = null;
	          break;
	      }
	    };

	    eventUtils.attachEvent('message', onMessage);

	    // Start
	    iframeUtils.postMessage('s');
	  };
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(16)))

/***/ },
/* 129 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var JSON3 = __webpack_require__(102),
	    iframeUtils = __webpack_require__(105);

	function FacadeJS(transport) {
	  this._transport = transport;
	  transport.on('message', this._transportMessage.bind(this));
	  transport.on('close', this._transportClose.bind(this));
	}

	FacadeJS.prototype._transportClose = function (code, reason) {
	  iframeUtils.postMessage('c', JSON3.stringify([code, reason]));
	};
	FacadeJS.prototype._transportMessage = function (frame) {
	  iframeUtils.postMessage('t', frame);
	};
	FacadeJS.prototype._send = function (data) {
	  this._transport.send(data);
	};
	FacadeJS.prototype._close = function () {
	  this._transport.close();
	  this._transport.removeAllListeners();
	};

	module.exports = FacadeJS;

/***/ }
/******/ ])
});
;