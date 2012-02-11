var Clone = function (r, segmentsX, segmentsY, color, wireframe) {
    this.r = r || 500;
    this.segmentsX = segmentsX || 100;
    this.segmentsY = segmentsY || 100;
    this.color = color || 0xccaa00;
    this.wireframe = wireframe || true;
}

Clone.prototype.radius = function (r) {
    if (typeof(r) === 'undefined') {
        return this.r;
    } else {
        this.r = r;
        return this;
    }
}
