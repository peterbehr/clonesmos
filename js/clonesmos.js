$(function () {

var camera, scene, renderer,
geometry, material, mesh;
var props = {
    isMouseDown : false,
    dragStartX  : null,
    dragStartY  : null
};

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
    
    $(document).bind('keyup', 'a', function () {
        camera.position.z += 10;
    });
    $(document).bind('keyup', 's', function () {
        camera.position.z -= 10;
    });
    $(document).bind('keyup', 'up', function () {
        updateCameraZenith(0.1);
    });
    $(document).bind('keyup', 'down', function () {
        updateCameraZenith(-0.1);
    });
    var origin = new THREE.Vector3(0, 0, 0);
    
    var updateCameraZenith = function (angle) {
        // change y
        var r = Math.sqrt(sq(camera.position.z - origin.z) + sq(camera.position.y - origin.y) + sq(camera.position.x - origin.x));
        console.log(r);
        console.log(r * Math.sin(angle));
        console.log(r * Math.cos(angle));
        
        camera.translateY(-r*(Math.sin(angle)));
        camera.translateZ(r*(Math.cos(angle)-1));
        updateCameraDirection(origin);
    };
    var updateCameraAzimuth = function (angle) {
        updateCameraDirection(origin);
    };
    
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
}



function init() {

    preparekeyboardAndMouse();

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.z = 1000;
    scene.add( camera );

    var clones = [];
    clones.push(new Clone());
    clones.push((new Clone()).radius(100));
    for (var i = 0; i < clones.length; i++) {
        var clone = clones[i];
        console.log(clone);
        var geometry = new THREE.SphereGeometry(clone.radius(), clone.segsX(), clone.segsY());
        var material = new THREE.MeshBasicMaterial({ color: clone.color(), wireframe: clone.isWire() });
        var mesh = new THREE.Mesh( geometry, material );
        scene.add( mesh );
    }
    
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