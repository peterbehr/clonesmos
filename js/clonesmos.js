var camera, scene, renderer,
geometry, material, mesh;
var props = {
    isMouseDown : false,
    dragStartX  : null,
    dragStartY  : null
};
//global for debug
var clone1;
var clone2;

$(function () {

init();
animate();

function preparekeyboardAndMouse() {
    $(document).mousedown(function(e) {
        if(e.button !== 0) {
            //only set drag bindings on first mouse click
            //later add right click to move objects
            return;
        }
        
        e.preventDefault();
        props.isMouseDown = true;
        props.dragStartX = e.pageX;
        props.dragStartY = e.pageY;
        
        //update camera as we move
        var updateCamera = function(event) {
            camera.translateX(props.dragStartX - event.pageX);
            camera.translateY(event.pageY - props.dragStartY);
            props.dragStartX = event.pageX;
            props.dragStartY = event.pageY;
        };
        $(document).bind('mousemove', updateCamera);
    });
    
    $(document).mouseup(function(e) {
        e.preventDefault();
        props.isMouseDown = false;
        $(document).unbind('mousemove');
    });
    
    var updateCameraRadius = function (distance) {
        // add to radius
        camera.radius += distance;
        camera.position = camera.sphericalToRectangular();
        updateCameraDirection(origin);
    };
    var updateCameraTheta = function (angle) {
        // change theta
        camera.theta += angle;
        camera.position = camera.sphericalToRectangular();
        updateCameraDirection(origin);
    };
    var updateCameraPhi = function (angle) {
        // change phi
        camera.phi += angle;
        camera.position = camera.sphericalToRectangular();
        updateCameraDirection(origin);
    };
    var updateCameraDirection = function (target) {
        camera.lookAt(target);
    };
    var spot = new THREE.Vector3(200, 200, 200);
    var origin = new THREE.Vector3(0,0,0);
    $(document).bind('keyup', 'a', function () {
        updateCameraRadius(10);
    });
    $(document).bind('keyup', 's', function () {
        updateCameraRadius(-10);
    });
    $(document).bind('keyup', 'up', function () {
        updateCameraPhi(0.1);
    });
    $(document).bind('keyup', 'down', function () {
        updateCameraPhi(-0.1);
    });
    $(document).bind('keyup', 'left', function () {
        updateCameraTheta(0.1);
    });
    $(document).bind('keyup', 'right', function () {
        updateCameraTheta(-0.1);
    });
    $(document).bind('keyup', '0', function () {
        updateCameraDirection(spot);
    });
    $(document).bind('keyup', '1', function () {
        updateCameraDirection(origin);
    });
    $(document).bind('keyup', '2', function () {
        console.log(camera.rotation);
    });
    $(document).bind('keyup', '3', function () {
        camera.position.x = 200;
        camera.position.y = 200;
        camera.translateX(200);
        console.log(camera.position);
        
    });
}



function init() {
    THREE.PerspectiveCamera.prototype.origin = new THREE.Vector3(0, 0, 0);
    THREE.PerspectiveCamera.prototype.theta = 0;
    THREE.PerspectiveCamera.prototype.setTheta = function () {};
    THREE.PerspectiveCamera.prototype.phi = 0;
    THREE.PerspectiveCamera.prototype.setPhi = function () {};
    THREE.PerspectiveCamera.prototype.radius = 0;
    THREE.PerspectiveCamera.prototype.setRadius = function () {};
    THREE.PerspectiveCamera.prototype.sphericalToRectangular = function () {
        var x = (this.radius * Math.cos(this.phi) * Math.sin(this.theta));
        var y = (this.radius * Math.sin(this.phi) * Math.sin(this.theta));
        var z = (this.radius * Math.cos(this.theta));
        console.log(x, y, z);
        var vector = new THREE.Vector3(x, y, z);
        return vector;
    };
    THREE.PerspectiveCamera.prototype.observe = function (target) {
        //console.log(this);
        this.origin = target;
        this.lookAt(origin);
    };
    
    preparekeyboardAndMouse();
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 10000 );
    scene.add(camera);
    
    clone1 = new Clone();
    clone2 = new Clone().radius(100);
    clone2._mesh.translateX(200);
    scene.add(clone1._mesh);
    scene.add(clone2._mesh);
    
    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    
    document.body.appendChild( renderer.domElement );
}

function animate() {
    // note: three.js includes requestAnimationFrame shim
    requestAnimationFrame( animate );
    render();
}

function render() {
    // mesh.rotation.x += 0.01;
    // mesh.rotation.y += 0.02;
    renderer.render( scene, camera );
}

// wouldn't it be fucking great if string and number literals had methods
// ughghghgh
Object.prototype.echo = function () {
    console.log(this);
}

function sq(x) {
    return x * x;
}

});
