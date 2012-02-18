var camera, scene, renderer,
geometry, material, mesh, pointLight, ambientLight;
var props = {
    isMouseDown : false,
    dragStartX  : null,
    dragStartY  : null
};
//global for debug
var clone1;
var clone2;
var spot = new THREE.Vector3(200, 200, 200);
var origin = new THREE.Vector3(0,0,0);

$(function () {

init();
animate();
    
var updateCameraRho = function (distance) {
    // add to radius
    camera.updateRho(distance);
    camera.sphericalToRectangular();
    updateCameraDirection(origin);
};
var updateCameraTheta = function (angle) {
    // change theta
    camera.updateTheta(angle);
    camera.sphericalToRectangular();
    updateCameraDirection(origin);
};
var updateCameraPhi = function (angle) {
    // change phi
    camera.updatePhi(angle);
    camera.sphericalToRectangular();
    updateCameraDirection(origin);
};
var updateCameraDirection = function (target) {
    camera.observe(target);
};

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
    $(document).bind('keyup', 'a', function () {
        updateCameraRho(10);
    });
    $(document).bind('keyup', 's', function () {
        updateCameraRho(-10);
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
    preparekeyboardAndMouse();
    
    THREE.PerspectiveCamera.prototype.origin = new THREE.Vector3(0, 0, 0);
    THREE.PerspectiveCamera.prototype.theta = 0;
    THREE.PerspectiveCamera.prototype.updateTheta = function (delta) {
        this.theta = (this.theta + delta) % (2*Math.PI);
    };
    THREE.PerspectiveCamera.prototype.phi = 0;
    THREE.PerspectiveCamera.prototype.updatePhi = function (delta) {
        this.phi += delta;
    };
    THREE.PerspectiveCamera.prototype.getPhi = function () {
        if ((this.phi % (2*Math.PI)) < Math.PI) {
            return (this.phi % (2*Math.PI));
        } else {
            return -(this.phi % (2*Math.PI));
        }
    }
    THREE.PerspectiveCamera.prototype.rho = 0;
    THREE.PerspectiveCamera.prototype.updateRho = function (delta) {
        this.rho += delta;
        console.log(this.rho);
    };
    THREE.PerspectiveCamera.prototype.sphericalToRectangular = function () {
        var x = (this.rho * Math.cos(this.theta) * Math.sin(this.getPhi()));
        var y = (this.rho * Math.sin(this.getPhi()) * Math.sin(this.theta));
        var z = (this.rho * Math.cos(this.getPhi()));
        console.log("rect", x, y, z);
        console.log("sphere", this.rho, this.getPhi(), this.theta);
        var vector = new THREE.Vector3(x, y, z);
        this.position = vector;
    };
    THREE.PerspectiveCamera.prototype.observe = function (target) {
        //console.log(this);
        this.origin = target;
        this.lookAt(origin);
    };
    
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 1000);
    pointLight = new THREE.PointLight(0xffffff);
    ambientLight = new THREE.AmbientLight(0xffffff);
    pointLight.position.x = 500;
    pointLight.position.y = 500;
    scene.add(camera);
    scene.add(ambientLight);
    scene.add(pointLight);
    clone1 = new Clone();
    clone2 = new Clone().radius(50);
    clone2._mesh.translateX(100);
    clone2._mesh.translateZ(100);
    scene.add(clone1._mesh);
    scene.add(clone2._mesh);
    camera.updateRho(500);
    camera.sphericalToRectangular();
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
}

function animate() {
    // note: three.js includes requestAnimationFrame shim
    requestAnimationFrame(animate);
    render();
}

function render() {
    // mesh.rotation.x += 0.01;
    // mesh.rotation.y += 0.02;
    renderer.render(scene, camera);
}

// wouldn't it be fucking great if string and number literals had methods
// ughghghgh
Object.prototype.echo = function () {
    console.log(this);
}

});
