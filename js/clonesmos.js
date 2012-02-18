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
    var material = new THREE.ParticleBasicMaterial( { map: new THREE.Texture( generateSprite() ), blending: THREE.AdditiveBlending } );
    for (var i = 0; i < 1; i++) {
        particle = new THREE.Particle(material);
        scene.add(particle);
    }
    function generateSprite() {
        var canvas = document.createElement( 'canvas' );
        canvas.width = 16;
        canvas.height = 16;
        var context = canvas.getContext( '2d' );
        var gradient = context.createRadialGradient( canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2 );
        gradient.addColorStop( 0, 'rgba(255,255,255,1)' );
        gradient.addColorStop( 0.2, 'rgba(0,255,255,1)' );
        gradient.addColorStop( 0.4, 'rgba(0,0,64,1)' );
        gradient.addColorStop( 1, 'rgba(0,0,0,1)' );
        
        context.fillStyle = gradient;
        context.fillRect( 0, 0, canvas.width, canvas.height );
        
        return canvas;
    }
    clone1 = new Clone();
    clone2 = new Clone().radius(50);
    clone2._mesh.translateX(150);
    clone2._mesh.translateZ(150);
    scene.add(clone1._mesh);
    scene.add(clone2._mesh);
    var particleColor = new THREE.Color();
    particleColor.setHSV(Math.random(), 1.0, 1.0);
    var particleGeometry = new THREE.Geometry();
    var particleColors = [];
    var particleMaterial =new THREE.ParticleBasicMaterial({
            map: THREE.ImageUtils.loadTexture('images/particle.png'),
            blending: THREE.AdditiveBlending,
            depthTest: false,
            transparent: false,
            vertexColors: true, //allows 1 color per particle
            size: 1000,
            opacity: 1
    });
    var vector = new THREE.Vector3(0, 0, 0);
    var particle = new THREE.Vertex(vector);
    particleGeometry.vertices.push(particle);
    particleColors.push(particleColor);
    particleGeometry.colors = particleColors;
    var particleSystem = new THREE.ParticleSystem(particleGeometry, particleMaterial);
    scene.addObject(particleSystem);
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
