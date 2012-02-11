var Clone = function (radius, segsX, segsY, color, isWire) {
    this._radius = radius || 500;
    this._segsX = segsX || 100;
    this._segsY = segsY || 100;
    this._color = color || 0xccaa00;
    this._isWire = isWire || true;
};

//ACCESSOR METHODS

Clone.prototype.radius = function (radius) {
    if (typeof(radius) === 'undefined') {
        return this._radius;
    } else {
        this._radius = radius;
        return this;
    }
};

Clone.prototype.segsX = function (segsX) {
    if (typeof(segsX) === 'undefined') {
        return this._segsX;
    } else {
        this._segsX = segsX;
        return this;
    }
};

Clone.prototype.segsY = function (segsY) {
    if (typeof(segsY) === 'undefined') {
        return this._segsY;
    } else {
        this._segsY = segsY;
        return this;
    }
};

Clone.prototype.color = function (color) {
    if (typeof(color) === 'undefined') {
        return this._color;
    } else {
        this._color = color;
        return this;
    }
};

Clone.prototype.isWire = function (isWire) {
    if (typeof(isWire) === 'undefined') {
        return this._isWire;
    } else {
        this._isWire = isWire;
        return this;
    }
};


