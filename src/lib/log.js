/*global _,$,console,Backbone */
var Log = (function(){

    function safePrint(method, level, message, argument){
        if (this.disabled) {
            return;
        }
        var time = new Date().toLocaleTimeString("en-us", this.options);
        if (argument) {
            method.call(console, level, ':', time, ':', message, ':', argument);
        } else {
            method.call(console, level, ':', time, ':', message);
        }
    }

    function fancyPrint(method, level, message, argument){
        if (this.disabled) {
            return;
        }
        var stack, time = new Date().toLocaleTimeString("en-us", this.options);
        if (argument) {
            console.groupCollapsed(level, ':', time, ':', message, ':', argument);
        } else {
            console.groupCollapsed(level, ':', time, ':', message);
        }
        try { throw new Error(); } catch(e){ stack = e.stack.split('\n').slice(3).join('\n'); }
        method.call(console, stack);
        console.groupEnd();
    }

    return {
        Level: {
            Info: 'INFO',
            Warn: 'WARN',
            Error: 'ERROR',
            Fatal: 'FATAL',
            Critical: 'CRITICAL',
            Off: 'OFF',
            Handled: 'HANDLED',
            Debug: 'DEBUG'
        },
        options : {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        },
        disabled: true,

        Debug: function (message, argument) {
            if (this.trace && console.groupCollapsed) {
                fancyPrint(console.debug, this.Level.Debug, message, argument);
            } else {
                safePrint(console.debug, this.Level.Debug, message, argument);
            }
        },
        Handled: function (message, argument) {
            safePrint(console.error, this.Level.Handled, message, argument);
        },
        Error: function(message,argument) {
            safePrint(console.error, this.Level.Error, message, argument);
        },
        Info: function (message, argument) {
            if (this.trace && console.groupCollapsed) {
                fancyPrint.call(this, console.info, this.Level.Info, message, argument);
            } else {
                safePrint.call(this, console.info, this.Level.Info, message, argument);
            }
        },
        Log: function (message, argument) {
            if (this.trace && console.groupCollapsed) {
                fancyPrint(console.log, this.Level.Info, message, argument);
            } else {
                safePrint(console.log, this.Level.Info, message, argument);
            }
        },
        Warn: function (message, argument) {
            safePrint(console.warn, this.Level.Warn, message, argument);
        }
        
    };
})();
