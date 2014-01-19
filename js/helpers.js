var Helpers = {
    packFloat: function (val) {
        return Helpers.packInt(val * 16);
    },
    parseFloat: function (data, ind) {
        return Helpers.parseInt(data, ind) / 16;
    },
    packInt: function (val) {
        return String.fromCharCode((val >> 24) % 256, (val >> 16) % 256, (val >> 8) % 256, (val >> 0) % 256);
    },
    parseInt: function (data, ind) {
        return (data.charCodeAt(ind.ind++) << 24) +
            (data.charCodeAt(ind.ind++) << 16) +
            (data.charCodeAt(ind.ind++) << 8) +
            (data.charCodeAt(ind.ind++));
    }
};