/*globals $,_,Log,win*/
/// <reference path="../classes/log.js"/>

var DeltaClientBase = {
    changingPassword: false,
    changingPasswordFail: null,
    changingPasswordOld: null,
    changingPasswordNew: null,
    changingPasswordSuccess: null,

    DEFAULT_TIMEOUT: 10000,

    initializeDeltaClient: function(
        host,
        port,
        secure,
        fromUrl,
        username,
        password,
        successCallback,
        errorCallback,
        token,
        appid,
        useBinary,
        saml
    ) {

        this.host = host;
        this.port = port;
        this.secure = secure;
        this.fromUrl = fromUrl;
        this.username = username;
        this.successCallback = successCallback;
        this.errorCallback = errorCallback;
        this.token = token;
        this.appid = appid;
        this.saml = saml;

        this.clientLoggedIn = false;

        if(!this.deltaClient) {
            this.deltaClient = new win.Client({
                "host": this.host,
                "port": this.port,
                "secure": this.secure,
                "fromURL": this.fromUrl
            }, useBinary);
            this.initDeltaClient(password);
        } else {
            this.saml ? this.deltaClient.register("control") : this.deltaClient.login(this.username, password, this.appid);
        }
    },

    initializeDeltaClientCopy: function(client, host, port, secure, fromUrl, username, password, successCallback, errorCallback, appid) {
        this.host = host;
        this.port = port;
        this.secure = secure;
        this.fromUrl = fromUrl;
        this.username = username;
        this.successCallback = successCallback;
        this.errorCallback = errorCallback;
        this.appid = appid;

        this.clientLoggedIn = true;

        this.deltaClient = client;
        this.deltaClient.DeltaClientLogin = true;

        this.initDeltaClient(password);
    },

    initDeltaClient: function(password) {
        var self = this,
            wasConnected = false,
            connectionTimeoutDelay = null;

        this.deltaClient.status._subscribe({
            "next": function(data) {
                switch(data.type) {
                    case win.Client.status.CONNECTING:
                        if(wasConnected) {
                            // Disconnect not firing so if has been connected before fire disconnect event
                            $(self).trigger("DeltaClientDisconnect");
                        }
                        if(!connectionTimeoutDelay) {
                            connectionTimeoutDelay = _.delay(function() {
                                self.sendError("Server connectivity issues, please try again.");
                            }, self.DEFAULT_TIMEOUT);
                        }
                        break;
                    case win.Client.status.CONNECTED:
                        try {
                            wasConnected = true;
                            // Add delay to allow processes to initialize again
                            _.delay(function() {
                                $(self).trigger("DeltaClientConnect");
                            }, 2000);

                            self.onFirstLogin();

                            clearTimeout(connectionTimeoutDelay);
                            connectionTimeoutDelay = null;
                        } catch(e) {
                            self.sendError("There was a problem connecting to the server: " + e);
                        }
                        break;
                    case win.Client.status.DISCONNECTED:
                        $(self).trigger("DeltaClientDisconnect");
                        break;
                    case win.Client.status.LOGGED_IN:
                        self.username = self.deltaClient.user();
                        $.cookie('deltaToken', self.deltaClient.tokenKey(), { expires: 30, path: '/' });
                        break;
                    case win.Client.status.LOGGED_OUT:
                        if(self.changingPassword && _.isString(data.data) && data.data.indexOf("Client action") !== -1) {
                            // delay password change otherwise it will not work
                            setTimeout(function() {
                                self.changingPasswordFailed = false;
                                // this will change password and login the user
                                self.deltaClient.resetPassword(self.username, self.changingPasswordOld, self.changingPasswordNew);
                            }, 500);
                        } else if(_.isString(data.data) && data.data.indexOf("no connection available") === -1) {
                            // user initiated logout or session timeout
                            $.removeCookie("deltaToken", { path: "/" });

                            if(self.saml) {
                                self.ssoLogout("local");
                                break;
                            } else if(data.data.indexOf("timeout") !== -1) {
                                // self.sendError('Your session timed out');
                                $.cookie("deltaLoginError", "Your session timed out", { expires: 30, path: "/" });
                                window.onbeforeunload = function( /*e*/ ) {}; // override Dashboards save notification
                                location.reload();
                            } else if(data.data.indexOf("force logout") !== -1) {
                                $.cookie("deltaLoginError", "Forced logout", { expires: 30, path: "/" });
                                window.onbeforeunload = function( /*e*/ ) {}; // override Dashboards save notification
                                location.reload();
                            } else {
                                location.reload();
                            }
                        } else if(_.isString(data.data) && data.data.indexOf("no connection available") === 0) {
                            // server logged out session
                            $.removeCookie("deltaToken", { path: "/" });
                            location.reload();
                        } else if(wasConnected) {
                            // server was brought down and back up
                            $.removeCookie("deltaToken", { path: "/" });
                            location.reload();
                        }
                        break;
                    case win.Client.status.EXPIRED:
                        clearTimeout(connectionTimeoutDelay);
                        connectionTimeoutDelay = null;
                        Log.Log("Expired", data);
                        self.sendError("Your password has expired");
                        break;
                    case win.Client.status.RESET:
                        clearTimeout(connectionTimeoutDelay);
                        connectionTimeoutDelay = null;
                        $(self).trigger("Reset");
                        self.sendError("Please reset password");
                        Log.Log("Reset", data);
                        break;
                    case win.Client.status.RESET_FAIL:
                        clearTimeout(connectionTimeoutDelay);
                        connectionTimeoutDelay = null;
                        self.changingPasswordFail && self.changingPasswordFail(data["data"]);
                        self.changingPasswordFailed = true;
                        self.changingPassword = false;
                        Log.Log("Reset Fail", data);
                        break;
                    case win.Client.status.RESET_SUCCESS:
                        if (self.changingPassword) {
                            if (self.changingPasswordFailed) {
                                self.changingPassword = false;
                            } else {
                                // changing password
                                // call password changed callback
                                self.changingPasswordSuccess && self.changingPasswordSuccess();
                                // reset
                                self.changingPassword = false;
                                self.changingPasswordFail = null;
                                self.changingPasswordSuccess = null;
                                self.changingPasswordOld = null;
                                self.changingPasswordNew = null;
                                self.successCallback && self.successCallback();
                                // Since the deltaToken in use is invalid, logout of existing session 
                                $.cookie("deltaLoginError", "Password changed. Please login again", { expires: 30, path: "/" });
                                self.deltaClient.logout();
                            }
                        }
                        break;
                    case win.Client.status.FAULT:
                        var deltaToken = $.cookie("deltaToken");
                        Log.Log("Fault", data);
                        // wrong user / password
                        clearTimeout(connectionTimeoutDelay);
                        connectionTimeoutDelay = null;
                        // Remove any existing token
                        $.removeCookie("deltaToken", { path: "/" });
                        if (data["data"] === "locked") { data["data"] = "Account is locked; please contact your administrator" };
                        self.sendError(data["data"]);
                        // If this was a page refresh with a token and got a fault, reload page
                        if (deltaToken) {
                            if (!data.data.match(/no token/i) && data["data"] !== "Login Failed") {
                                $.cookie("deltaLoginError", data["data"], { expires: 30, path: "/" });
                            }
                            location.reload();
                        }
                        break;
                }
            },
            "error": function() {
                Log.Error("onError", arguments);
            },
            "complete": function() {
                Log.Info("onCompleted", arguments);
            }
        });

        if(this.saml) {
            this.deltaClient.register("control");
        } else if(this.token) {
            this.deltaClient.loginWithTokenKey(this.token, this.appid);
        } else {
            this.deltaClient.login(this.username, password, this.appid);
            password = null;
        }
    },

    changeUserPassword: function(oldPass, newPass, success, fail) {
        if(!this.changingPassword) {

            this.changingPassword = true;
            this.changingPasswordOld = oldPass;
            this.changingPasswordNew = newPass;
            this.changingPasswordSuccess = success;
            this.changingPasswordFail = fail;

            this.changingPasswordFailed = false;
            // This call will result in either RESET_SUCCESS or RESET_FAIL being called
            this.deltaClient.resetPassword(this.username, this.changingPasswordOld, this.changingPasswordNew);
        }
    },

    onFirstLogin: function() {
        // first login
        this.clientLoggedIn = true;
        $(this).trigger("DeltaClientLogin");
        this.deltaClient.DeltaClientLogin = true;
        this.successCallback && this.successCallback();
    }
};
