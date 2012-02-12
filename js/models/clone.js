var Clone = function (radius, segsX, segsY, color, isWire) {
    this._radius = radius || 500;
    this._segsX = segsX || 100;
    this._segsY = segsY || 100;
    this._color = color || 0xccaa00;
    this._isWire = isWire || true;
};

//ACCESSOR METHODS

/*Adds accessors
 *radius() gets _radius, radius(10) sets and returns clone.
 */
Clone.prototype.radius = accessor("_radius");
Clone.prototype.segsX  = accessor("_segsX");
Clone.prototype.segsY  = accessor("_segsY");
Clone.prototype.color  = accessor("_color");
Clone.prototype.isWire = accessor("_isWire");



