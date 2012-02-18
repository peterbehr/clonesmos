var Clone = function (radius, segsX, segsY, color, isWire) {
    this._radius = radius || 100;
    this._segsX  = segsX || 50;
    this._segsY  = segsY || 50;
    this._color  = color || 0xccaa00;
    this._isWire = isWire || true;
    this._opacity = 0.75;

    //need to first value for scaling
    this._radius_orig = this._radius;

    //THREEJS properties not accessors, we don't want these to update
    this._geometry = new THREE.SphereGeometry(this._radius, this._segsX, this._segsY);
    // this._material = new THREE.MeshBasicMaterial({ color: this._color, wireframe: this._isWire });
    this._material = new THREE.MeshLambertMaterial({ color: this._color, opacity: this._opacity, transparent: true });
    this._mesh = new THREE.Mesh(this._geometry, this._material);

};

/**************************ACCESSORS**************************/

//Radius actually just scales for efficiency, no need to remove from scene and create new.
Clone.prototype.radius = function(radius) {
    this._radius = radius;

    var rorig = this._radius_orig;
    var scale = (rorig === 0) ? 0 : (radius / rorig);

    this._mesh.scale = new THREE.Vector3(scale, scale, scale);
    return this;
};


//this actually removes and adds mesh, NOT GOOD FOR PRODUCTIONS
Clone.prototype.segsX  = function(segsX) {
    this._segsX = segsX;

    scene.remove(this._mesh);
    this.recalculateGeometry();
    this.recalculateMesh();
    scene.add(this._mesh);

    return this;
};

//this actually removes and adds mesh, NOT GOOD FOR PRODUCTIONS
Clone.prototype.segsY  = function(segsY) {
    this._segsY = segsY;

    scene.remove(this._mesh);
    this.recalculateGeometry();
    this.recalculateMesh();
    scene.add(this._mesh);

    return this;
};

Clone.prototype.color = function(color) {
    this._color = color;
    this._material.color = new THREE.Color(color);
    return this;
};

Clone.prototype.isWire = function(isWire) {
    this._isWire = isWire;

    scene.remove(this._mesh);
    this.recalculateMaterial();
    this.recalculateMesh();
    scene.add(this._mesh);

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

