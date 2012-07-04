var camera, scene, renderer,
geometry, material, mesh, pointLight, ambientLight;

var props = {
    ticks       : 0,
    isMouseDown : false,
    dragStartX  : null,
    dragStartY  : null,
    multitude: 70,
    w: window.innerWidth,
    h: window.innerHeight,
    padding: 0 // this doesn't really do what i want it too
};

//global for debug
var clone1;
var clone2;
var spot = new THREE.Vector3(200, 200, 200);
var origin = new THREE.Vector3(0,0,0);

//print matrix
var pm = function(m) {
    console.log(m.n11 + " " + m.n12 + " " + m.n13 + " " + m.n14);
    console.log(m.n21 + " " + m.n22 + " " + m.n23 + " " + m.n24);
    console.log(m.n31 + " " + m.n32 + " " + m.n33 + " " + m.n34);
    console.log(m.n41 + " " + m.n42 + " " + m.n43 + " " + m.n44);
};


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
    
    var updateCameraDirection = function (target) {
        console.log();
        camera.lookAt(target);
    };

    var spot = new THREE.Vector3(200, 200, 200);

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
    THREE.PerspectiveCamera.prototype.theta = (Math.PI / 2);
    THREE.PerspectiveCamera.prototype.updateTheta = function (delta) {
        this.theta = (this.theta + delta) % (2*Math.PI);
    };
    THREE.PerspectiveCamera.prototype.phi = 0;
    THREE.PerspectiveCamera.prototype.updatePhi = function (delta) {
        this.phi += delta;
    };
    THREE.PerspectiveCamera.prototype.getPhi = function () {
        var culprit = this.phi % (2*Math.PI);
        if ((culprit > (Math.PI / 2)) && (culprit < (3* Math.PI / 2))) {
            return -this.phi;
        } else {
            return this.phi;
        }
    };
    THREE.PerspectiveCamera.prototype.rho = 0;
    THREE.PerspectiveCamera.prototype.updateRho = function (delta) {
        this.rho += delta;
        //console.log(this.rho);
    };
    THREE.PerspectiveCamera.prototype.sphericalToRectangular = function () {
        var x = (this.rho * Math.cos(this.theta) * Math.sin(this.getPhi()));
        var y = (this.rho * Math.sin(this.getPhi()) * Math.sin(this.theta));
        var z = (this.rho * Math.cos(this.getPhi()));
        //console.log("sphere", this.rho, this.getPhi(), this.theta);
        //console.log("rect", x, y, z);
        var vector = new THREE.Vector3(x, y, z);
        this.position = vector;
    };
    THREE.PerspectiveCamera.prototype.observe = function (target) {
        // console.log(this);
        this.origin = target;
        this.lookAt(origin);
    };
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 1000);
    pointLight = new THREE.PointLight(0xffffff);
    var pointLight2 = new THREE.PointLight(0xffffff);
    ambientLight = new THREE.AmbientLight(0xffffff);
    pointLight.position.x = 500;
    pointLight.position.y = 500;
    pointLight2.position.x = -500;
    pointLight2.position.y = -500;
    pointLight2.position.z = 100;
    
    scene.add(camera);
    scene.add(ambientLight);
    scene.add(pointLight2);
    scene.add(pointLight);
    
    var particleGeometry = new THREE.Geometry();
    var particleGeometryOuter = new THREE.Geometry();
    var particleMaterialOuter = new THREE.ParticleBasicMaterial({
            map: THREE.ImageUtils.loadTexture('images/particle.png'),
            blending: THREE.AdditiveBlending,
            depthTest: false,
            transparent: true,
            vertexColors: true, //allows 1 color per particle
            size: 500,
            opacity: 0.7
    });
    var particleMaterial = new THREE.ParticleBasicMaterial({
            map: THREE.ImageUtils.loadTexture('images/particle.png'),
            blending: THREE.AdditiveBlending,
            depthTest: false,
            transparent: false,
            vertexColors: true, //allows 1 color per particle
            size: 100,
            opacity: 1
    });
    
    // we need to generate some quantity of position vectors
    // then populate those points with spheres and particles
    
    props.centers = [];
    props.colors = [];
    props.yellows = [];
    props.spheres = [];
    props.particles = [];
    props.radii = [];
    for (var i = 0; i < props.multitude; i++) {
        var center = new THREE.Vector3((props.w*(1-2*Math.random())/2.2)-props.padding, (props.h*(1-2*Math.random())/2.2)-props.padding, (props.h*(1-2*Math.random())/2.2)-props.padding);
        props.centers.push(center);
        var color = new THREE.Color();
        props.yellows.push(new THREE.Color(0xfaff3b));
        color.setHSV(Math.random(), 1.0, 1.0);
        props.colors.push(color);
        var radius = (Math.random() * 50)+10;
        var clone = new Clone().radius(radius);
        props.radii.push(radius);
        clone.color(color);
        clone._mesh.position = center;
        props.spheres.push(clone);
        scene.add(clone._mesh);
        var vertex = new THREE.Vertex(center);
        props.particles.push(vertex);
        particleGeometry.vertices.push(vertex);
        particleGeometryOuter.vertices.push(vertex);
    }
    
    particleGeometryOuter.colors = props.colors;
    var particleSystemOuter = new THREE.ParticleSystem(particleGeometryOuter, particleMaterialOuter);
    particleGeometry.colors = props.yellows;
    var particleSystem = new THREE.ParticleSystem(particleGeometry, particleMaterial);
    scene.addObject(particleSystem);
    scene.addObject(particleSystemOuter);
    camera.updateRho(500);
    camera.sphericalToRectangular();
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(props.w, props.h);
    document.body.appendChild(renderer.domElement);
}

function updateTime() {
    props.ticks += 1;
}

function moveClones() {
}

function animate() {
    updateTime();
    moveClones();

    requestAnimationFrame( animate );
    render();
}

function render() {
    renderer.render(scene, camera);
}

// wouldn't it be fucking great if string and number literals had methods
// ughghghgh
Object.prototype.echo = function () {
    console.log(this);
};

});
