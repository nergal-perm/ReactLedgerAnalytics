Vector = function(items) {
    this.items = items
};

Vector.prototype.add = function(other) {
    if (!(other instanceof Vector)) {
        return this;
    }
    let result = [];
    for(let i = 0; i < this.items.length; i++) {
        result.push( this.items[i] + other.items[i])
    }

    return new Vector(result);
};

Vector.prototype.subtract = function(other) {
    if (!(other instanceof Vector)) {
        return this;
    }
    let result = [];
    for(let i = 0; i < this.items.length; i++) {
        result.push( this.items[i] - other.items[i])
    }

    return new Vector(result);
};

// Moving average calculation
// taken from https://rosettacode.org/wiki/Averages/Simple_moving_average#JavaScript
// subtly changed to reflect my algorithm
Vector.prototype.simpleSMA=function(N) {
    return this.items.map(function(el,index, _arr) {
        return _arr.filter(function(x2,i2) {
            return i2 <= index && i2 > index - N;
        })
            .reduce(function(current, last){
                return (current + last);
            })/Math.min(index+1, N);
    });
};

Vector.prototype.firstItem = function() {
    return this.items[0];
};

Vector.prototype.lastItem = function() {
    return this.items.slice(-1)[0];
};

module.exports = Vector;