var Clone = function (radius, segsX, segsY, color, isWire) {
    this._radius = radius || 50;
    this._segsX  = segsX || 10;
    this._segsY  = segsY || 10;
    this._color  = color || 0xccaa00;
    this._isWire = isWire || true;

    //THREEJS properties not accessors, we don't want these to update
    this._geometry = new THREE.SphereGeometry(this._radius, this._segsX, this._segsY);
    this._material = new THREE.MeshBasicMaterial({ color: this._color, wireframe: this._isWire });
    this._mesh     = new THREE.Mesh(this._geometry, this._material);
};

/**************************ACCESSORS**************************/
Clone.prototype.radius = function(radius) {
    this._radius = radius;
    this._mesh.geometry = this.recalculateGeometry();
    return this;
};


Clone.prototype.segsX  = function(segsX) {
    this._segsX = segsX;
    this._mesh.geometry = this.recalculateGeometry();
    return this;
};

Clone.prototype.segsY  = function(segsY) {
    this._segsY = segsY;
    this._mesh.geometry = this.recalculateGeometry();
    return this;
};

Clone.prototype.color = function(color) {
    this._color = color;
    this._mesh.color = this.recalculateMaterial();
    return this;
};

Clone.prototype.isWire = function(isWire) {
    this._isWire = isWire;
    this._mesh.isWire = this.recalculateMaterial();
    return this;
};

/**************************THREEJS HELPERS**************************/
Clone.prototype.recalculateGeometry = function() {
    this._geometry = new THREE.SphereGeometry(this._radius, this._segsX, this._segsY);
    return this._geometry;
};

Clone.prototype.recalculateMaterial = function() {
    this._material = new THREE.MeshBasicMaterial({ color: this._color, wireframe: this._isWire });
    return this._material;
};

Clone.prototype.recalculateMesh = function() {
    this._mesh     = new THREE.Mesh(this._geometry, this._material);
    return this._mesh;
};

Clone.prototype.recalculateAll = function() {
    this.recalculateGeometry();
    this.recalculateMaterial();
    this.recalculateMesh();
    return this;
};

