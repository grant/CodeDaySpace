var Helpers = {
    packFloat: function (e) {
        return Helpers.packInt(e * 16);
    },
    parseFloat: function (e, t) {
        return Helpers.parseInt(e, t) / 16;
    },
    packInt: function (e) {
        return String.fromCharCode((e >> 24) % 256, (e >> 16) % 256, (e >> 8) % 256, (e >> 0) % 256);
    },
    parseInt: function (e, t) {
        return (e.charCodeAt(t.ind++) << 24) + (e.charCodeAt(t.ind++) << 16) + (e.charCodeAt(t.ind++) << 8) + e.charCodeAt(t.ind++);
    }
}