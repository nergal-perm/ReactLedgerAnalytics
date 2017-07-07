const formatter = {
    asPercent: function(num, dec) {
        dec = dec || 0;
        return (num * 100).toFixed(dec) + '%';
    },
    asThousands: function(num) {
        return (num / 1000).toFixed(2) + ' тыс.руб.';
    },
    asUnits: function(num, dec, units) {
        dec = dec || 0;
        return num.toFixed(dec) + ' ' + units;
    }
};


module.exports = formatter;