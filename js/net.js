//networking class

/* 
constructor: Network(cBack) - calls cBack when websocket opened

methods:
    login(name, cBack) - logs user in, calls cBack(userId) when done
    getPlayers(cBack) - calls cBack(users) with fetched users
        users - [{name : <user_name>, id : <user_id>}]
    getPlayerId() - returns id of current player
    getAllActors(cBack) - calls cBack(actors_string) when done
    pushPull(data, cBack) - pushes data to server (replacing everything,
            calls cBack(actors_string) where actors_string is other actors
*/




//var SOCKET_SERVER_URL = "ws://" + window.location.host + ":999";
var SOCKET_SERVER_URL = "ws://10.50.138.71:999";

var Network = function (cBack) {
    var WSPromise = function (ws, msg, done) {
        ws.onmessage = function (data) {
            ws.onmessage = null;
            done(data.data.toString());
        };
        ws.send(msg);
    };

    var ws = new WebSocket(SOCKET_SERVER_URL);
    var users = [];
    var userId;

    //Make names string form server into [{id,name}]
    var parseNames = function (data) {
        var users = [];
        var ind = 0;
        while (ind < data.length) {
            var len = data.charCodeAt(ind + 1);
            var name = data.substr(ind + 2, len);
            users.push({ id: data.charCodeAt(ind), name: name });
            ind += len + 2;
        }
        return users;
    };



    this.getPlayers = function (cBack) {
        WSPromise(ws, String.fromCharCode(1), function (data) {
            if (cBack)
                cBack(parseNames(data));
        });
    };

    this.getPlayerID = function () {
        return userId;
    };

    this.getAllActors = function (cBack) {
        WSPromise(ws, String.fromCharCode(3), function (data) {
            if (cBack)
                cBack(data);
        });
    };

    this.login = function (plName, cBack) {
        WSPromise(ws, String.fromCharCode(0) + plName, function (data) {
            userId = data.charCodeAt(0) * 256 + data.charCodeAt(1);
            if (cBack)
                cBack(userId);
        });
    };


    var packShort = function (num) {
        return String.fromCharCode(Math.floor(num / 256), num % 256);
    };

    this.pushPull = function (data, cBack) {
        console.log("sending " + data);
        console.log(", length: " + data.length);
        WSPromise(ws, String.fromCharCode(4) + packShort(userId) + data, function (dt) {
            console.log("receiveing: " + dt);
            console.log(", length: " + dt.length);
            if (cBack)
                cBack(dt);
        });
    };

    ws.onopen = cBack;
};