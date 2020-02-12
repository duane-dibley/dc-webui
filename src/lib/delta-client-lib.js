/*globals Backbone,_,$,console, kdb, kdb.QBoolean, kdb.QSymbol, kdb.QByte, kdb.QShort, kdb.QInt, kdb.QLong, kdb.QReal,
kdb.QFloat, kdb.QChar, kdb.QTimeStamp, kdb.QMonth, kdb.QDate, kdb.QDateTime, kdb.QTimeSpan, kdb.QMinute, kdb.QSecond, kdb.QTime,
kdb.QList, kdb.QDict, win, win.ConnectionGroupEntity, win.ConnectionEntity, win.Client, kdb.KDBQuery, DataSet,
UpdateMessage, win.AckMessage, NackMessage, setTimeout, clearTimeout, win, kdb*/
/// <reference path="./log.js"/>
/// <reference path="./delta-client-base.js"/>
//var kdb = kdb || {};
//var win = win || {};

var DeltaClientLib = $.extend({}, DeltaClientBase, {
    subs: {},
    parameterRx: new RegExp('<%([^<>%]+?)%>', 'g'),

    DEFAULT_NULL_VAL: -9223372036854776000, //if a value of 0N is returned this comes back from delta client
    PAGING_TYPES: ['OFFSET', 'PAGENO', 'PAGENO_NOCACHE'],
    PIVOT_FUNCTION_NAME: '.pivot.pivotV4',
    PIVOT_SOURCE_CODE: '.pivot.pivotV4:{[t;w;d;a;f;n;o] g:(); if [(type d)=99h; [g:d[`g]; d:d[`d],g;]];piv: 0!?[t;w;d!d;a!f]; if [(count g)>0; [d: (-1 _ d); a2:d,a; piv2: 0!?[piv;();g!g;a2!a2]; grpData:{[x;d;grpCol;f] labels: $[(count f)>1;(`$((string x[grpCol]) ,/: string f[;0]));x[grpCol]]; d xkey (d,labels) xcol flip x _ grpCol}; piv: 0! () uj/ each[grpData[;d;g[0];f]] piv2; ]]; if [(count o)>0;[field: o[0]; order: o[1]; piv:$[order>0;field xasc piv;field xdesc piv];]]; $[n<=0;piv;n#piv]};',

    createNewConnection: function (name, host, port, user, password, type, driver, callback, errorCallback) {
        var newConn = new win.ConnectionEntity();
        newConn.name = name;
        newConn.host = host;
        newConn.port = port;
        newConn.user = user;
        newConn.password = password;
        newConn.type = type;
        newConn.driver = driver;

        this.deltaClient.request("ConnectionAPI.updateConnections", function (data) {
            Log.Info('create success', data);

            if (callback) {
                callback(data);
            }
        }, function (data) {
            if (errorCallback) {
                errorCallback(data);
            }
        }, [newConn], []);
    },

    createConnectionGroup: function (name, type, connections, connectionsType, callback, errorCallback) {
        var newCg = new win.ConnectionGroupEntity();

        newCg.name = name;
        newCg.type = type;
        newCg.connections = connections;
        newCg.connectionsType = connectionsType;

        this.deltaClient.request("ConnectionAPI.createConnectionGroup", function (data) {
            if (callback) {
                callback(data);
            }
        }, function (data) {
            if (errorCallback) {
                errorCallback(data);
            }
        }, newCg);
    },

    //recursive
    createDeltaObj: function (obj) {
        var deltaObj, placeholderArray, param1;

        switch (obj.type.toLowerCase()) {
            case 'boolean':
                deltaObj = new kdb.QBoolean();
                deltaObj.setValue(obj.value);
                break;
            case 'guid':
                deltaObj = new kdb.QGUID();
                deltaObj.value = obj.value;
                break;
            case 'symbol':
                deltaObj = new kdb.QSymbol();
                deltaObj.value = obj.value;
                break;
            case 'byte':
                deltaObj = new kdb.QByte();
                deltaObj.value = obj.value;
                break;
            case 'short':
                deltaObj = new kdb.QShort();
                deltaObj.value = obj.value;
                break;
            case 'int':
                deltaObj = new kdb.QInt();
                deltaObj.value = parseInt(obj.value, 10);
                break;
            case 'integer':
                deltaObj = new kdb.QInt();
                deltaObj.value = parseInt(obj.value, 10);
                break;
            case 'long':
                deltaObj = new kdb.QLong();
                deltaObj.value = obj.value;
                break;
            case 'real':
                deltaObj = new kdb.QReal();
                deltaObj.value = obj.value;
                break;
            case 'float':
                deltaObj = new kdb.QFloat();
                deltaObj.value = parseFloat(obj.value);
                break;
            case 'double':
                deltaObj = new kdb.QFloat();
                deltaObj.value = parseFloat(obj.value);
                break;
            case 'char':
                deltaObj = new kdb.QChar();
                deltaObj.value = obj.value;
                break;
            case 'timestamp':
                deltaObj = new kdb.QTimeStamp();
                deltaObj.setValue(obj.value);
                if (obj.value && obj.value.n) {
                    deltaObj.nanoValue = obj.value.n;
                }
                break;
            case 'month':
                deltaObj = new kdb.QMonth();
                deltaObj.setValue(obj.value);
                break;
            case 'date':
                deltaObj = new kdb.QDate();
                deltaObj.setValue(obj.value);
                break;
            case 'datetime':
                deltaObj = new kdb.QDateTime();
                deltaObj.setValue(obj.value);
                break;
            case 'timespan':
                deltaObj = new kdb.QTimeSpan();
                deltaObj.setValue(obj.value);
                break;
            case 'minute':
                deltaObj = new kdb.QMinute();
                deltaObj.setValue(obj.value);
                break;
            case 'second':
                deltaObj = new kdb.QSecond();
                deltaObj.setValue(obj.value);
                break;
            case 'time':
                deltaObj = new kdb.QTime();
                deltaObj.setValue(obj.value);
                break;
            case 'string':
                deltaObj = new kdb.QString();
                deltaObj.setValue(obj.value);
                break;
            case 'list':
                deltaObj = new kdb.QList();
                placeholderArray = [];

                _.each(obj.value, function (arrayItm) {
                    param1 = new kdb.QSymbol();
                    param1.setValue(arrayItm);
                    placeholderArray.push(param1);
                });

                deltaObj.value = placeholderArray;
                break;

            case 'listobject':
                deltaObj = new kdb.QList();
                placeholderArray = [];

                _.each(obj.value, function (arrayItm) {
                    var item;
                    if (!_.isEmpty(arrayItm)) {
                        //recursive
                        item = this.createDeltaObj(arrayItm);
                        placeholderArray.push(item);
                    }
                }, this);

                deltaObj.value = placeholderArray;
                break;

                //TODO handle generic nested arrays other way
            case 'listlistsymbol':
                deltaObj = new kdb.QList();
                deltaObj.value = _.map(obj.value, function (arr) {
                    var nestedList = new kdb.QList();
                    nestedList.value = _.map(arr, function (itm) {
                        var param = new kdb.QSymbol();
                        param.setValue(itm);
                        return param;
                    });

                    return nestedList;
                });
                break;

                //TODO handle generic nested arrays other way
            case 'listlistboolean':
                deltaObj = new kdb.QList();
                deltaObj.value = _.map(obj.value, function (arr) {
                    var nestedList = new kdb.QList();
                    nestedList.value = _.map(arr, function (itm) {
                        var param = new kdb.QBoolean();
                        param.setValue(itm);
                        return param;
                    });

                    return nestedList;
                });
                break;

                //TODO handle generic nested arrays other way
            case 'listliststring':
                deltaObj = new kdb.QList();
                deltaObj.value = _.map(obj.value, function (arr) {
                    var nestedList = new kdb.QList();
                    nestedList.value = _.map(arr, function (itm) {
                        var param = new kdb.QString();
                        param.setValue(itm);
                        return param;
                    });

                    return nestedList;
                });
                break;

                //TODO handle generic nested arrays other way
                //case 'listlistlistchar':
                //    debugger;
                //    deltaObj = new kdb.QList();
                //    deltaObj.value = _.map(obj.value, function (arr) {
                //        var nestedList = new kdb.QList();
                //        nestedList.value = _.map(arr, function (itm) {
                //            var listChar = new kdb.QList();
                //            listChar.value = _.map(itm.split(""), function (char) {
                //                var ch = new kdb.QChar();
                //                ch.value = char;
                //            });
                //            return listChar;
                //        });
                //        return nestedList;
                //    });
                //    break;

            case 'symbol[]':
                deltaObj = new kdb.QList();
                placeholderArray = [];

                _.each(obj.value, function (arrayItm) {
                    param1 = new kdb.QSymbol();
                    param1.setValue(arrayItm);
                    placeholderArray.push(param1);
                });

                deltaObj.value = placeholderArray;
                break;
            case 'listlong':
                deltaObj = new kdb.QList();
                placeholderArray = [];

                _.each(obj.value, function (arrayItm) {
                    param1 = new kdb.QLong();
                    param1.setValue(arrayItm);
                    placeholderArray.push(param1);
                });

                deltaObj.value = placeholderArray;
                break;
            case 'listtimestamp':
                deltaObj = new kdb.QList();
                placeholderArray = [];

                _.each(obj.value, function (arrayItm) {
                    param1 = new kdb.QTimeStamp();
                    param1.setValue(arrayItm);
                    placeholderArray.push(param1);
                });

                deltaObj.value = placeholderArray;
                break;
            case 'dict':
                deltaObj = new kdb.QDict();

                _.each(obj.value, function (value, key) {
                    var itm = this.createDeltaObj(value);
                    deltaObj.values.push(itm);
                    deltaObj.fields.push(key);
                }, this);
                break;
            case 'nulltype':
                deltaObj = new kdb.QDict();
                break;
            default:
                if (obj.type.toLowerCase().indexOf('[]') > -1) {
                    deltaObj = new kdb.QList();
                    placeholderArray = [];

                    _.each(obj.value, function (arrayValue, idx) {
                        placeholderArray.push(
                            this.createDeltaObj({
                                //type: obj.type.toLowerCase().split('[]')[0],
                                type: obj.type.toLowerCase().replace('[]', ''),
                                value: arrayValue,
                                index: idx
                            })
                        );
                    }, this);
                    deltaObj.value = placeholderArray;
                }
                break;
        }
        deltaObj.orderIndex = obj.index;

        return deltaObj;
    },

    createParamsObj: function (deltaClientObjParam, jsObj) {
        var self = this,
            idx = 0,
            localJsObj,
            createDeltaObj;

        //if (jsObj instanceof Backbone.Model) {
        if (jsObj.attributes) {
            localJsObj = jsObj.attributes;
        } else if (jsObj) {
            localJsObj = jsObj;
        }

        if (localJsObj) {
            _.each(localJsObj, function (obj) {
                if ((obj.type) && (obj.type !== 't')) {
                    if (obj.type === 'symbol[]') {
                        obj.type = 'list';
                    }

                    deltaClientObjParam[idx] = this.createDeltaObj(obj);
                    idx += 1;
                }
            }, this);

            deltaClientObjParam.sort(function (a, b) {
                return a.orderIndex - b.orderIndex;
            });
        }
    },

    createSqlParamsObj: function (deltaClientObjParam, jsObj) {
        var placeholderArray,
            param1,
            idx = 0,
            stringChars,
            localJsObj,
            createDeltaObj;

        //if (jsObj instanceof Backbone.Model) {
        if (jsObj.attributes) {
            localJsObj = jsObj.attributes;
        } else if (jsObj) {
            localJsObj = jsObj;
        }

        createDeltaObj = function (obj) {
            var deltaObj;

            switch (obj.type.toLowerCase()) {
                case 'boolean':
                    deltaObj = new kdb.SQLBoolean();
                    deltaObj.value = obj.value;
                    break;
                case 'guid':
                    deltaObj = new kdb.SQLVarChar();
                    deltaObj.value = obj.value;
                    break;
                case 'symbol':
                    deltaObj = new kdb.SQLVarChar();
                    deltaObj.value = obj.value;
                    break;
                case 'byte':
                    deltaObj = new kdb.SQLByte();
                    deltaObj.value = obj.value;
                    break;
                case 'short':
                    deltaObj = new kdb.SQLShort();
                    deltaObj.value = obj.value;
                    break;
                case 'int':
                    deltaObj = new kdb.SQLInt();
                    deltaObj.value = parseInt(obj.value, 10);
                    break;
                case 'integer':
                    deltaObj = new kdb.SQLInt();
                    deltaObj.value = parseInt(obj.value, 10);
                    break;
                case 'long':
                    deltaObj = new kdb.SQLLong();
                    deltaObj.value = obj.value;
                    break;
                case 'real':
                    deltaObj = new kdb.SQLFloat();
                    deltaObj.value = obj.value;
                    break;
                case 'float':
                    deltaObj = new kdb.SQLFloat();
                    deltaObj.value = parseFloat(obj.value);
                    break;
                case 'double':
                    deltaObj = new kdb.SQLDouble();
                    deltaObj.setValue(obj.value);
                    break;
                case 'char':
                    deltaObj = new kdb.SQLVarChar();
                    deltaObj.value = obj.value;
                    break;
                case 'timestamp':
                    deltaObj = new kdb.SQLTime();
                    deltaObj.setValue(obj.value);
                    break;
                case 'month':
                    deltaObj = new kdb.SQLInt();
                    deltaObj.setValue(obj.value);
                    break;
                case 'date':
                    deltaObj = new kdb.SQLTime();
                    deltaObj.setValue(new Date(obj.value));
                    //deltaObj.value = obj[1];
                    break;
                case 'datetime':
                    deltaObj = new kdb.SQLTime();
                    deltaObj.setValue(new Date(obj.value));
                    break;
                case 'timespan':
                    deltaObj = new kdb.SQLTime();
                    deltaObj.setValue(obj.value);
                    break;
                case 'minute':
                    deltaObj = new kdb.SQLInt();
                    deltaObj.setValue(obj.value);
                    break;
                case 'second':
                    deltaObj = new kdb.SQLInt();
                    deltaObj.setValue(obj.value);
                    break;
                case 'time':
                    deltaObj = new kdb.SQLTime();
                    deltaObj.setValue(obj.value);
                    break;
                case 'string':
                    deltaObj = new kdb.SQLList();
                    stringChars = obj.value.split('');
                    placeholderArray = [];

                    _.each(stringChars, function (c) {
                        param1 = new kdb.SQLVarChar();
                        param1.value = c;
                        placeholderArray.push(param1);
                    });
                    deltaObj.value = placeholderArray;
                    break;
                    //case 'symbol[]':
                    //    deltaObj = new kdb.SQLList();
                    //    placeholderArray = [];

                    //    _.each(obj.value, function (arrayItm) {
                    //        param1 = new kdb.SQLSymbol();
                    //        param1.setValue(arrayItm);
                    //        placeholderArray.push(param1);
                    //    });

                    //    deltaObj.value = placeholderArray;
                    //    break;
                case 'list':
                    deltaObj = new kdb.SQLList();
                    placeholderArray = [];

                    _.each(obj.value, function (arrayItm) {
                        param1 = new kdb.SQLVarChar();
                        param1.setValue(arrayItm);
                        placeholderArray.push(param1);
                    });

                    deltaObj.value = placeholderArray;
                    break;
                case 'symbol[]':
                    deltaObj = new kdb.SQLList();
                    placeholderArray = [];

                    _.each(obj.value, function (arrayItm) {
                        param1 = new kdb.SQLVarChar();
                        param1.setValue(arrayItm);
                        placeholderArray.push(param1);
                    });

                    deltaObj.value = placeholderArray;
                    break;
                case 'listtimestamp':
                    deltaObj = new kdb.SQLList();
                    placeholderArray = [];

                    _.each(obj.value, function (arrayItm) {
                        param1 = new kdb.SQLTime();
                        param1.setValue(arrayItm);
                        placeholderArray.push(param1);
                    });

                    deltaObj.value = placeholderArray;
                    break;
                case 'dict':
                    deltaObj = new kdb.SQLDict();

                    _.each(obj.value, function (value, key) {
                        var itm = createDeltaObj(value);
                        deltaObj.values.push(itm);
                        deltaObj.fields.push(key);
                    });
                    break;
                case 'nulltype':
                    deltaObj = new kdb.SQLDict();
                    break;
            }
            deltaObj.orderIndex = obj.index;
            deltaObj.setName(obj.name);

            return deltaObj;
        };

        if (localJsObj) {
            _.each(localJsObj, function (obj) {
                if ((obj.type) && (obj.type !== 't')) {
                    if (obj.type === 'symbol[]') {
                        obj.type = 'list';
                    }

                    deltaClientObjParam[idx] = createDeltaObj(obj);
                    idx += 1;
                }
            });

            deltaClientObjParam.sort(function (a, b) {
                return a.orderIndex - b.orderIndex;
            });
        }
    },

    deleteComponent: function (id, successFn, errorFn) {
        this.deltaClient.request("ComponentAPI.deleteComponent", function(data) {
            successFn(data);
        }, function(data) {
            errorFn(data);
        }, id);
    },

    deleteConnection: function (connectionName, callback, errorCallback) {
        this.deltaClient.request("ConnectionAPI.updateConnections", function (data) {
            if (callback) {
                callback(data);
            }
        }, function (data) {
            if (errorCallback) {
                errorCallback(data);
            }
        }, [], [connectionName]);
    },

    deleteConnectionGroup: function (connectionName, callback, errorCallback) {
        this.deltaClient.request("ConnectionAPI.deleteConnectionGroup", function (data) {
            Log.Info('group deleted');
            if (callback) {
                callback(data);
            }
        }, function (data) {
            Log.Info('error group deleted', data);
            if (errorCallback) {
                errorCallback(data);
            }
        }, connectionName);
    },

    fixNullValues: function (data) {
        var self = this,
            dataToProcess = data,
            isPagingQuery;

        //check for empty data set with one row {"":""}. Issues arise on table updates using this value
        //(some queries return this typeless null to prevent errors propagating for invalid selections)
        if (data && data.rows && (_.keys(data.rows).length === 1) && (_.keys(data.rows[0])[0] === '')) {
            data.rows = [];
            return data;
        }

        isPagingQuery = (data && data.rows && data.rows[0] && data.rows[0]['Property'] === 'startRows' && data.rows[3]);

        // check if paging dataset
        if (isPagingQuery) {
            dataToProcess = data.rows[3]['Value'];
        }

        if (dataToProcess && dataToProcess.meta && dataToProcess.rows && dataToProcess.rows.length) {
            //Non-temporal types
            _.each(dataToProcess.meta, function (kdbType, col) {
                var valToReplace = undefined;

                //Non temporal values that need handling null vals
                if (kdbType < 12) {
                    switch (kdbType) {
                    //guid
                    case 2:
                        valToReplace = -9223372036854776000;
                        break;
                    //short
                    case 5:
                        valToReplace = -32768;
                        break;
                    //int
                    case 6:
                       valToReplace = -2147483648;
                        break;
                    //long
                    case 7:
                        valToReplace = -9223372036854776000;
                        break;
                }

                    _.each(dataToProcess.rows, function (row) {
                        if (((valToReplace !== undefined) && (row[col] === valToReplace)) || (row[col] === self.DEFAULT_NULL_VAL)) {
                            row[col] = null;
                        }
                    });

                } else {
                    //Temporal types (isNull function)
                    _.each(dataToProcess.rows, function (row) {
                        if ((row[col] && row[col].isNull && row[col].isNull()) || (row[col] === self.DEFAULT_NULL_VAL)) {
                            row[col] = null;
                        }
                    });
                }

            });
        }

        if (isPagingQuery) {
            data.rows[3]['Value'] = dataToProcess;
        }

        return data;
    },

    _generateOrderingKdbSyntax: function (ordering) {
        var toReturn = '',
            column,
            direction,
            parts;

        //if (typeof ordering === 'undefined') { ordering = ''; } //optional param, needs a default
        ordering = ordering || '';
        parts = ordering.split(',');
        if (parts.length === 2) {
            direction = parts[1];

            if (direction != 'null') {
                column = parts[0];
                toReturn = '`' + column + ';' + (direction === 'asc' ? 1 : -1);
            }
        }

        return toReturn;
    },

    getComponents: function (successFn, errorFn) {
        Log.Info("Running Get Components");
        this.deltaClient.request("ComponentAPI.getComponents", function(data){
            successFn(data);
        }, function(data){
            errorFn(data);
        });
    },

    getDeltaConnections: function (callback) {
        this.deltaClient.request("ConnectionAPI.getConnections", function (data) {
            if (callback) {
                callback(data);
            }
        }, function () {
            Log.Error("Failed to retrieve Connections\n\n");
        });
    },

    getDeltaConnectionGroups: function (callback, errorCallback) {
        this.deltaClient.request("ConnectionAPI.getConnectionGroups", function (data) {
            Log.Info("Connection Group Fetched\n\n");
            if (callback) {
                callback(data);
            }
        }, function (data) {
            if (errorCallback) {
                errorCallback();
            }
            Log.Error("Connection Group fetched FAILED\n\n", data);
        });
    },

    getDeltaAnalytics: function (callback) {
        this.deltaClient.request("AnalyticAPI.getAnalytics", function (data) {
            if (callback) {
                callback(DeltaClientLib.fixNullValues(data));
            }
        }, function () {
            Log.Error("Failed to retrieve Analytics\n\n");
        });
    },

    getDeltaInstances: function (callback) {
        this.deltaClient.request("ConnectionAPI.getProcessInstances", function (data) {
            if (callback) {
                callback(data);
            }
        }, function () {
            Log.Error("Failed to retrieve Instances\n\n");
        });
    },

    constructPivotWhereString: function (wheres) {
        var whereString = '',
            closingbrackets = '';

        if (wheres.length > 0) {
            whereString = "enlist ";
        } else {
            whereString = "( ) ";
        }

        //Loop through wheres object array and construct wheres string
        _.each(wheres, function (where, i) {
            if (wheres.length > 1) {
                if (i < (wheres.length - 1)) {
                    whereString += "(&;";
                    closingbrackets += ")";
                }
            }

            switch (where.columnType) {
                case 4:  //byte
                case 6: //int
                case 9: // float
                case 12: //timestamp
                case 14: //date
                case 15: //datetime
                case 16: //timespan
                case 17: //minute
                case 18: //second
                case 19: //time
                    whereString += "(" + where.columnOperator + ";`$\"" + where.columnName + "\"; " + where.columnValue.toString() + ");";
                    break;
                case 1: //boolean
                    whereString += "(" + where.columnOperator + ";`$\"" + where.columnName + "\"; " + where.columnValue.toString() + "b);";
                    break;
                case 2: //guid
                    whereString += "(" + where.columnOperator + ";`$\"" + where.columnName + "\"; \"" + where.columnValue.toString() + "\");";
                    break;
                case 5:  //short
                    whereString += "(" + where.columnOperator + ";`$\"" + where.columnName + "\"; " + where.columnValue.toString() + "h);";
                    break;
                case 7: //bigint
                    whereString += "(" + where.columnOperator + ";`$\"" + where.columnName + "\"; " + where.columnValue.toString() + "j);";
                    break;
                case 8: //real
                    whereString += "(" + where.columnOperator + ";`$\"" + where.columnName + "\"; " + where.columnValue.toString() + "e);";
                    break;
                case 10: //char
                    if (where.columnValue.length < 2) {
                        whereString += "(" + where.columnOperator + ";`$\"" + where.columnName + "\"; \"" + where.columnValue.toString() + "\");";
                    } else {
                        //whereString += "(" + where.columnOperator + ";`$\"" + where.columnName + "\"; enlist (\"" + where.columnValue.toString().split('').join('\",\"') + "\"));";
                        whereString += "(" + 'like' + ";`$\"" + where.columnName + "\"; \"" + where.columnValue.toString()+ "\");";
                    }
                    break;
                case 11: //symbol
                    whereString += "(" + where.columnOperator + ";`$\"" + where.columnName + "\"; enlist `$\"" + where.columnValue.toString() + "\");";
                    break;
                case 13: //month
                    whereString += "(" + where.columnOperator + ";`$\"" + where.columnName + "\"; " + where.columnValue.toString().replace('-', '.') + "m);";
                    break;
                default:
                    whereString += "(" + where.columnOperator + ";`$\"" + where.columnName + "\"; enlist `$\"" + where.columnValue.toString() + "\");";
                    //whereString += "(" + where.columnOperator + ";`$\"" + where.columnName + "\"; " + where.columnValue + ");";
                    break;
            }
        });

        return { 'whereString': whereString, 'closingbrackets': closingbrackets };
    },

    getPivotData: function (options, callback, errorCallback, isSubscriptionSuppressed) {
        var dimsString = '',
            aggsString = '',
            whereString = '',
            closingbrackets = '',
            funcsString = '',
            topString = '0j',
            query,
            pivotSource = options.pivotSource,
            table = options.table,
            queryString = options.queryString,
            queryParams = options.queryParams,
            kdbParams = [],
            aggFn = options.aggFn,
            aggregateFns = options.aggregateFns,
            aggStr,
            ordering = options._generateOrderingKdbSyntax,
            connectionName = options.connection,
            formattedQuery,
            deltaParameterRx,
            deltaParameterRgx,
            deltaParameterString,
            generatedWheresObj,
            columnLabelString = '',
            dimsDict = '',
            regex,
            regex2;

        ordering = this._generateOrderingKdbSyntax(ordering);

        //remove Comments & newlines from query
        if (queryString && queryString.length > 0) {

            regex = new RegExp('\s*\n\/.*| \/.*|^\/.*?$', 'gm');
            queryString = queryString.replace(regex, '');

            regex2 = new RegExp('\s*\n', 'gm');
            queryString = queryString.replace(regex2, ' ');
        }

        if (options.dimensions.length > 1) {
            dimsString = "`" + options.dimensions.join("`");
        } else {
            dimsString = "enlist `" + options.dimensions[0];
        }

        options.aggregateCols = _.without(options.aggregateCols, '');
        if (options.aggregateCols.length > 1) {
            aggsString = "`" + options.aggregateCols.join("`");
        } else {
            aggsString = "enlist `" + options.aggregateCols[0];
        }

        generatedWheresObj = this.constructPivotWhereString(options.wheres);
        whereString = generatedWheresObj.whereString;
        closingbrackets = generatedWheresObj.closingbrackets;

        whereString = whereString.substr(0, whereString.length - 1);

        whereString += closingbrackets;
        if (options.aggregateCols.length === 1) {
            funcsString = "enlist ";
        }
        funcsString += "(";
        _.each(options.aggregateCols, function (c, idx) {
            if (c.length > 0) {
                aggStr = ((aggregateFns && aggregateFns[idx]) || aggFn);
                funcsString += "(" + aggStr + ";`" + c + ");";
            }
        });

        funcsString = funcsString.substr(0, funcsString.length - 1) + ")";

        if (options.topX && options.topX !== 'null' && options.topX !== 'all') {
            topString = (options.topX + "j");
        }

        if (options.columnLabel && options.columnLabel.length > 0) {
            columnLabelString = 'enlist `' + options.columnLabel;
        } else {
            columnLabelString = '()';
        }

        dimsDict = '`d`g!(' + dimsString + ';' + columnLabelString + ')';

        if (pivotSource === 'query') {
            queryString = $.trim(queryString);
            deltaParameterRx = /^{\[([a-z0-9A-Z\;\w\/ ]+?)\]/;
            deltaParameterRgx = deltaParameterRx.exec(queryString);
            deltaParameterString = '';

            //Format query string to use parametersif required
            if ($.isArray(deltaParameterRgx)) {
                deltaParameterString = deltaParameterRgx[0];
            } else if (queryString.substring(0, 3) !== '{[]') {
                queryString = '{[] ' + queryString + '}[]';
            } else {
                queryString = queryString + '[]';
            }

            if (deltaParameterString.length > 0) {
                if (queryParams.length === 1) {
                    queryString = queryString + '[' + queryParams[0].name + ']';
                } else {
                    //append parameter value array to query
                    //the kdbQuery.parameters values will then be passed to this array
                    queryString = queryString + '[';
                    _.each(queryParams, function (param, idx) {
                        if (idx > 0) {
                            queryString = queryString + ';';
                        }

                        queryString = queryString + param.name;
                    });
                    queryString = queryString + ']';
                }
            }

            query = deltaParameterString + ' ' + this.PIVOT_SOURCE_CODE + this.PIVOT_FUNCTION_NAME + '[' + queryString + ';' + whereString + ';'
                + dimsDict + ';' + aggsString + ';'
                + funcsString + ';' + topString + ';(' + ordering + ')]';

            if (deltaParameterString.length > 0) {
                query = query + '}';
            }

        } else {
            query = this.PIVOT_SOURCE_CODE + this.PIVOT_FUNCTION_NAME + '[`' + table + ';' + whereString + ';'
                + dimsDict + ';' + aggsString + ';'
                + funcsString + ';' + topString + ';(' + ordering + ')]';
        }

        formattedQuery = kdb.KDBQuery.create(query, 2000);

        if (pivotSource === 'query') {
            this.createParamsObj(kdbParams, queryParams);
            formattedQuery.parameters = kdbParams;
        }

        //Run query using deltaClient
        this.deltaClient.request("QueryAPI.runQuery", function (data) {
                if (data && data.rows) {
                    if (callback) {
                        callback(DeltaClientLib.fixNullValues(data));
                    }
                }
            }, function () {
                if (errorCallback) {
                    errorCallback(arguments);
                }
            }, formattedQuery, connectionName);

        //If subscription type is subscription run managed query query
        if ((options.subscriptionType === 'subscription') && (!isSubscriptionSuppressed)) {
            this.deltaClient.request("SubscriptionAPI.addSubscription", function (data) {
                if (callback) {
                    callback(DeltaClientLib.fixNullValues(data));
                }
            },
            function (data) {
                if (errorCallback) {
                    errorCallback(data);
                }
            }, formattedQuery, connectionName, (options.subscriptionInterval * 1000));
        }
    },

    getQueryData: function (dataSource, connection, queryStr, queryParams, callback, errorCallback, maxRowCount, paging) {
        var formattedQuery,
            kdbParams = [],
            sortDict,
            runQueryArgs,
            rows = maxRowCount || null;

        if (!paging || !connection || !(_.contains(DeltaClientLib.PAGING_TYPES, paging.type))) {
            paging = {
                'type': 'NONE'
            }
        }

        queryStr = $.trim(queryStr);

        if (queryStr && queryStr.length > 0) {

            var regex = new RegExp('\s*\n\/.*| \/.*|^\/.*?$', 'gm');

            queryStr = queryStr.replace(regex, '');
        }

        if (dataSource === 'sql') {
            //run jdbc query if source set to sql
            this.getSqlQueryData(connection, queryStr, queryParams, callback, errorCallback, maxRowCount);
        } else {
            if (!paging || paging.type === 'NONE') {
                formattedQuery = kdb.KDBQuery.create(queryStr, rows);
            } else {
                sortDict = new kdb.QDict();

                _.each(paging.sorting, function (value, key) {
                    sortDict.add(key, (value === true), kdb.KDB.BOOLEAN);
                });

                formattedQuery = kdb.KDBQuery.createPaged(queryStr, paging.type, paging.num, paging.size, sortDict);
            }

            if (queryParams) {
                this.createParamsObj(kdbParams, queryParams);
                formattedQuery.parameters = kdbParams;
            }

            runQueryArgs = [
                "QueryAPI.runQuery",
                function (data) {
                    if (data && data.rows) {
                        if (callback) {
                            callback(DeltaClientLib.fixNullValues(data));
                        }
                    }
                }, function () {
                    if (errorCallback) {
                        errorCallback(arguments);
                    }
                }, formattedQuery
            ];

            //enable running queries omitting conections (avoid hitting QueryRouter)
            if (connection) {
                runQueryArgs.push(connection);
            }

            this.deltaClient.request.apply(this.deltaClient.request, runQueryArgs);
        }
    },

    getConfigAPIDataWithProfile: function (dataSource, connection, api, param, overrideName, profileName, callback, errorCallback) {
        var runQueryArgs;

        runQueryArgs = [
            api,
            function (data) {
                if (data) {
                    if (callback) {
                        callback(DeltaClientLib.fixNullValues(data));
                    }
                }
            }, function () {
                if (errorCallback) {
                    errorCallback(arguments);
                }
            },
            param,
            overrideName,
            profileName
        ];

        //enable running queries omitting conections (avoid hitting QueryRouter)
        if (connection) {
            runQueryArgs.push(connection);
        }

        this.deltaClient.request.apply(this.deltaClient.request, runQueryArgs);
    },


    getConfigAPIData: function(dataSource, connection, api, param, callback, errorCallback) {
        var runQueryArgs;

        runQueryArgs = [
            api,
            function(data) {
                if (data) {
                    if (callback) {
                        callback(DeltaClientLib.fixNullValues(data));
                    }
                }
            }, function() {
                if (errorCallback) {
                    errorCallback(arguments);
                }
            },
            param
        ];

        //enable running queries omitting conections (avoid hitting QueryRouter)
        if (connection) {
            runQueryArgs.push(connection);
        }

        this.deltaClient.request.apply(this.deltaClient.request, runQueryArgs);
    },

    getConfigAPIDataNoParam: function (dataSource, connection, api,  callback, errorCallback) {
        var runQueryArgs;

        runQueryArgs = [
            api,
            function (data) {
                if (data) {
                    if (callback) {
                        callback(DeltaClientLib.fixNullValues(data));
                    }
                }
            }, function () {
                if (errorCallback) {
                    errorCallback(arguments);
                }
            }
        ];

        //enable running queries omitting conections (avoid hitting QueryRouter)
        if (connection) {
            runQueryArgs.push(connection);
        }

        this.deltaClient.request.apply(this.deltaClient.request, runQueryArgs);
    },

    //IK: required for report management component
    // uses APIQuery insetead of KDBQuery,
    //  unwraps the lambda
    getAPIQueryData: function (dataSource, connection, queryStr, queryParams, callback, errorCallback) {
        var formattedQuery,
            kdbParams = [],
            runQueryArgs;

        formattedQuery = kdb.APIQuery.create(queryStr);
        //get rid of wrapping (".rpt.addReport" -> "{[].rpt.addReport}" -> ".rpt.addReport" )
        formattedQuery.lambda = queryStr;

        this.createParamsObj(kdbParams, queryParams);
        formattedQuery.parameters = kdbParams;

        runQueryArgs = [
            "QueryAPI.runQuery",
            function (data) {
                if (data && data.rows) {
                    if (callback) {
                        callback(DeltaClientLib.fixNullValues(data));
                    }
                }
            }, function () {
                if (errorCallback) {
                    errorCallback(arguments);
                }
            }, formattedQuery
        ];

        //enable running queries omitting conections (avoid hitting QueryRouter)
        if (connection) {
            runQueryArgs.push(connection);
        }

        this.deltaClient.request.apply(this.deltaClient.request, runQueryArgs);
    },

    getSqlQueryData: function (connection, queryStr, queryParams, callback, errorCallback, maxRowCount) {
        var formattedQuery,
            sqlParams = [],
            rows = (maxRowCount) || 2000;

        queryStr = $.trim(queryStr);

        if (queryParams) {
            formattedQuery = kdb.SQLQuery.create(queryStr, rows);

            this.createSqlParamsObj(sqlParams, queryParams);
            formattedQuery.parameters = sqlParams;
        } else {
            formattedQuery = kdb.SQLQuery.create(queryStr, rows);
        }

        if (queryParams) {
            formattedQuery = kdb.SQLQuery.create(queryStr, rows);

            this.createSqlParamsObj(sqlParams, queryParams);
            formattedQuery.parameters = sqlParams;
        }

        this.deltaClient.request("QueryAPI.runQuery", function (data) {
            if (data && data.rows) {
                if (callback) {
                    callback(data);
                }
            }
        }, function () {
            if (errorCallback) {
                errorCallback(arguments);
            }
        }, formattedQuery, connection);
    },

    isConnectionAlive: function (connectionName) {
        return this.deltaClient.request("ConnectionAPI.isAlive",
            function (data) {
                Log.Info(data);
            },
            function (data) {
                Log.Info(data);
            }, connectionName);
    },

    logout: function () {
        if (this.deltaClient) {
            this.deltaClient.logout();
        }

        // clear token
        $.removeCookie('deltaToken', { path: '/' });

        // reload after msg sent
        _.delay(function () {
            location.reload();
        }, 500);
    },

    ssoLogout: function(type) {
        if (this.deltaClient) {
            this.deltaClient.ssoLogout(type);
        }

        // clear token
        $.removeCookie('deltaToken', { path: '/' });

        // reload after msg sent
        _.delay(function () {
            location.reload();
        }, 500);
    },

    runAnalytic: function (analyticName, connection, params, callback, errorCallback, maxRowCount) {
        var kdbParams = [],
            rows = maxRowCount || null;

        if (!params) {
            params = [];
        }


        if (!connection) {
            connection = 'ds_rdb_fx_eval';
        }

        //Create paramter object for passing ot deltaclient
        this.createParamsObj(kdbParams, params);

        this.deltaClient.request("AnalyticAPI.run", function (data) {
            if (data && callback) {
                callback(DeltaClientLib.fixNullValues(data));
            }
        }, function (data) {
            Log.Error("Analytic run failed (" + analyticName + ")", data);
            if (errorCallback) {
                errorCallback(data);
            }
        }, analyticName, kdbParams, connection, rows);
    },

    runApiFunction: function (apiFunction, connection, params, callback, errorCallback) {
        var args,
            delay,
            onceCallback;

        // ensure the callback is only called once
        onceCallback = _.once(function (success, data) {
            if (success) {
                if (data && callback) {
                    callback(DeltaClientLib.fixNullValues(data));
                }
            } else {
                Log.Error("Api Analytic run failed (" + apiFunction + ")", data);
                if (errorCallback) {
                    errorCallback(data);
                }
            }

            clearTimeout(timeout);
        });

        // call error callback if no response within timeout
        timeout = _.delay(function () {
            if (onceCallback) {
                onceCallback(false, "timed out");
            }
        }, this.DEFAULT_TIMEOUT);

        args = _.flatten([
            apiFunction,
            _.partial(onceCallback, true, _),
            _.partial(onceCallback, false, _),
            params
        ]);

        this.deltaClient.request.apply(this.deltaClient, args);
    },

    sendError: function (message, detail) {
        if (this.errorCallback) {
            this.errorCallback(message);
        }
    },

    setComponent: function (name, displayName, description, dataJson, successFn, errorFn) {
        var dashDataObj = {
            'name': name,
            'displayName': displayName,
            'description': description,
            'dataJSON': dataJson,
            "class": "api.entity.ComponentEntity"
        };

        this.deltaClient.request("ComponentAPI.setComponent", function (data) {
            Log.Info("Save component " + name + " successful", data);
            successFn(data);
        }, function (data) {
            Log.Error("Save Dashboard " + name + " FAILED");
            errorFn(data);
        }, dashDataObj);
    },

    startManagedAnalytic: function (analyticName, connection, params, callback, errorCallback, interval, maxRowCount) {
        var self = this,
            kdbParams = [],
            rows = maxRowCount || null;

        if (!params) {
            params = [];
        }


        if (!connection) {
            connection = 'ds_rdb_fx_eval';
        }

        //Create paramter object for passing ot deltaclient
        this.createParamsObj(kdbParams, params);


        //sometimes the managed query returned just AckMessage without consequent UpdateMessage
        //FIX: first run static query, then managed query
        // this was mostly happening for ActionTracker's dxATGetCurrentItems
        this.deltaClient.request("AnalyticAPI.run", function (data) {
            if (data && callback) {
                //wrap data first, so it looks like managed query result
                callback({
                    dataSet: DeltaClientLib.fixNullValues(data)
                });

                //Start managed analytic. Update frequency depends on interval variable
                self.deltaClient.request("AnalyticAPI.startManaged", function (data) {
                    if (data) {
                        if (data instanceof win.AckMessage) {
                            //self.analyticSubId = data.clientId + ":" + data.subId;
                            if (callback) {
                                DeltaClientLib.fixNullValues(data.dataSet);
                                callback(data);
                            }
                        } else if (data instanceof win.NackMessage) {
                        } else if (data instanceof win.UpdateMessage) {
                            if (callback) {
                                DeltaClientLib.fixNullValues(data.dataSet)
                                callback(data);
                            }
                        }
                    }
                }, function (data) {
                    Log.Error("Managed Analytic run failed.", data);
                    if (errorCallback) {
                        errorCallback(data);
                    }
                }, analyticName, kdbParams, connection, interval, rows);
            }
        }, function (data) {
            Log.Error("Analytic run failed.", data);
            if (errorCallback) {
                errorCallback(data);
            }
        }, analyticName, kdbParams, connection, rows);


    },

    stopManagedAnalytic: function (subId) {
        this.deltaClient.request("SubscriptionAPI.removeSubscription", function (data) {
            Log.Info("Stop Subscription succeeded subscriptionId: ", data);
        }, function (data) {
            Log.Error("Stop Subscriptions failed", data);
        }, subId);
    },

    startManagedQuery: function (connection, queryStr, queryParams, callback, errorCallback, interval, maxRowCount, paging) {
        var self = this,
            formattedQuery,
            kdbParams = [],
            rows = maxRowCount || null,
            runQueryArgs,
            sortDict,
            subQueryArgs;

        if (!paging || !connection || !(_.contains(DeltaClientLib.PAGING_TYPES, paging.type))) {
            paging = {
                'type': 'NONE'
            }
        }

        if (queryStr && queryStr.length > 0) {

            var regex = new RegExp('\s*\n\/.*| \/.*|^\/.*?$', 'gm');

            queryStr = queryStr.replace(regex, '');
        }

        // TODO NF - temporarily disabling paging for managed queries (pending server-side support)
        //if (!paging || paging.type === 'NONE') {
            formattedQuery = kdb.KDBQuery.create(queryStr, -1, -1, true);
        //} else {
        //    sortDict = new kdb.QDict();

        //    _.each(paging.sorting, function (value, key) {
        //        sortDict.add(key, (value === true), kdb.KDB.BOOLEAN);
        //    });

        //    formattedQuery = kdb.KDBQuery.createPaged(queryStr, paging.type, paging.num, paging.size, sortDict);
        //}

        if (queryParams) {
            this.createParamsObj(kdbParams, queryParams);
            formattedQuery.parameters = kdbParams;
        }

        // run a static query first to get immediate results
        runQueryArgs = [
            "QueryAPI.runQuery",
            function (data) {
                if (data && data.rows) {
                    if (callback) {
                        callback(DeltaClientLib.fixNullValues(data));
                    }
                }

                // run subscription query
                self.deltaClient.request.apply(self.deltaClient.request, subQueryArgs);
            }, function () {
                if (errorCallback) {
                    errorCallback(arguments);
                }
            },
            formattedQuery,
            connection
        ];

        subQueryArgs = [
            "SubscriptionAPI.addSubscription",
            function (data) {
                if (callback) {
                    if (data.dataSet && data.dataSet.rows) {
                        Log.Info('Add SuscriptionID', data.dataSet.rows.length);
                    }
                    callback(data);
                }
            },
            function (data) {
                if (errorCallback) {
                    errorCallback(data);
                }
            },
            formattedQuery,
            connection,
            interval
        ];

        this.deltaClient.request.apply(this.deltaClient.request, runQueryArgs);
    },

    startStreamingAnalytic: function (analyticName, connection, params, callback, errorCallback, subId) {
        var self = this,
            subObj,
            kdbParams = [];

        if (!params) {
            params = [];
        }


        if (!connection) {
            connection = 'ds_rdb_fx_eval';
        }

        this.createParamsObj(kdbParams, params);

        // register subscription id
        if (subId) {
            if (this.subs[subId]) {
                // subscription id exists - already subscribed
                errorCallback("duplicate subscription id: " + subId);
                return;
            } else {
                subObj = {};
                this.subs[subId] = subObj;
            }
        }

        //Start streaming analytic.
        this.deltaClient.request("AnalyticAPI.startStreaming", function (data) {
            if (data) {
                if ((data instanceof win.AckMessage) && data.add) {
                    self.analyticSubId = data.clientId + ":" + data.subId;
                    if (subObj) {
                        subObj.analyticSubId = data.clientId + ":" + data.subId;
                    }
                    callback(DeltaClientLib.fixNullValues(data));
                } else if (data instanceof win.NackMessage) {
                    if (errorCallback) {
                        errorCallback(data.reason);
                    }
                } else if (data instanceof win.UpdateMessage) {
                    if (data.dataSet.rows && data.dataSet.rows.length > 0) {
                        if (callback && data.dataSet) {
                            callback(DeltaClientLib.fixNullValues(data.dataSet));
                        }
                    }
                }
                //else if (data instanceof win.DataSet) {
                //    if (data.rows && data.rows.length > 0) {
                //        if (callback) {
                //            callback(DeltaClientLib.fixNullValues(data));
                //        }
                //    }
                //}
            }
        }, function (data) {
            Log.Info("Analytic run failed.", data);
            if (errorCallback) {
                errorCallback(data);
            }
        }, analyticName, kdbParams, connection);
    },

    removeSubscriptions: function (subId) {
        var temp,
            self = this;

        if (subId) {

            if (this.subs[subId]) {
                temp = subId;
                // there is local subscriptionid
                subId = this.subs[subId].analyticSubId;
                //delete this.subs[temp]; // done on success
            }

            this.deltaClient.request(
                "SubscriptionAPI.removeSubscription",
                function (data) {
                    if (self.subs[temp]) {
                        delete self.subs[temp];
                    }
                    Log.Info("Stop Subscriptions succeeded.", data);
                },
                function (data) {
                    Log.Error("Stop Subscriptions failed", data);
                },
                subId
            );
        } else {
            this.deltaClient.request("SubscriptionAPI.removeSubscriptions", function (data) {
                Log.Info("Stop Subscriptions succeeded.", data);
            }, function (data) {
                Log.Error("Stop Subscriptions failed", data);
            });
        }
    },

    updateConnection: function (connectionObj, callback, errorCallback) {
        var connEntity = new win.ConnectionEntity();
        connEntity.name = connectionObj.name;
        connEntity.originalName = connectionObj.originalName;
        connEntity.host = connectionObj.host;
        connEntity.port = connectionObj.port;
        connEntity.user = connectionObj.user;
        connEntity.password = connectionObj.password;
        connEntity.type = connectionObj.type;
        connEntity.driver = connectionObj.driver || '';

        this.deltaClient.request("ConnectionAPI.updateConnections", function (data) {
            if (callback) {
                callback(data);
            }
        }, function (error) {
            if (errorCallback) {
                errorCallback(error);
            }
        }, [connEntity], []);
    },

    updateConnectionGroup: function (connectionGroupObj, callback, errorCallback) {
        var groupEntity = new win.ConnectionGroupEntity(),
            i;

        groupEntity.name = connectionGroupObj.name;
        groupEntity.type = connectionGroupObj.type;
        groupEntity.connections = connectionGroupObj.connections;

        for (i = 0; i < groupEntity.connections.length; i += 1) {
            groupEntity.connectionsType.push('default');
        }

        this.deltaClient.request("ConnectionAPI.updateConnectionGroup", function (data) {
            if (callback) {
                callback(data);
            }
        }, function (error) {
            if (errorCallback) {
                errorCallback(error);
            }
        }, groupEntity);
    },

    //call update query passing in column based dictionaries for updates, called directly from datagrid curently
    // options: {
    //  idCol: '',
    //  addedDict: {},  <-- column based dictionary 'columnName: [LISTOFROWUPDATES]'
    //  updateDict: {},  <-- column based dictionary 'columnName: [LISTOFROWUPDATES]'
    //  deletedDict: {},  <-- column based dictionary 'columnName: [LISTOFROWUPDATES]'
    //  query: '',
    //  connection: ''
    //}
    updateTable: function (options, successCallback, errorCallback) {
        var self = this,
            localUpdateParam = [];

        for (var i = 0; i < 3; i += 1) {
            localUpdateParam[i] = {
                type: 'dict',
                value: {},
                index: i
            };
        }

        //populate localUpdateParam array with added, updated, and deleted dictionaries
        _.each(localUpdateParam, function (updateParam, idx) {
            updateParam.index = idx;
        });

        //added
        _.each(options.addedDict.items, function (dictItem, dictKey) {
            localUpdateParam[0].value[dictKey] = {
                type: self.updateTableGetListType(options.typeConfig[dictKey], dictItem),
                value: dictItem
            };
        });

        //updated
        _.each(options.updatedDict.items, function (dictItem, dictKey) {
            localUpdateParam[1].value[dictKey] = {
                type: self.updateTableGetListType(options.typeConfig[dictKey], dictItem),
                value: dictItem
            };
        });

        //deleted
        _.each(options.deletedDict.items, function (dictItem, dictKey) {
            localUpdateParam[2].value[dictKey] = {
                type: self.updateTableGetListType(options.typeConfig[dictKey], dictItem),
                value: dictItem
            };
        });

        //localUpdateParam.push({
        //    index: 3,
        //    type: 'symbol',
        //    value: options.keyColumn
        //});

        //run stored table update query
        self.getQueryData('kdb', options.connection, options.query, localUpdateParam, successCallback, errorCallback);
    },

    updateTableGetListType: function (kdbType, item) {
        var charReturnType;
        //set list types for table update
        switch (kdbType) {
            case 1:
                return 'boolean[]';
            case 6:
                return 'int[]';
            case 7:
                return 'long[]';
            case 9:
                return 'float[]';
            case 10:
                //    return 'char[]';
                charReturnType = 'char[]';

                _.each(item, function (i) {
                    if (i.length > 1) {
                        charReturnType = 'string[]';
                    }
                });
                return charReturnType;
            case 11:
                return 'symbol[]';
            case 12:
                return 'timestamp[]';
            case 13:
                return 'month[]';
            case 14:
                return 'date[]';
            case 15:
                return 'datetime[]';
            case 16:
                return 'timespan[]';
            case 17:
                return 'minute[]';
            case 18:
                return 'second[]';
            case 19:
                return 'time[]';
            default:
                return 'symbol[]';
        }
    }
});
