var camera, scene, renderer,
geometry, material, mesh;

var props = {
    ticks       : 0,
    isMouseDown : false,
    dragStartX  : null,
    dragStartY  : null
};

//global for debug
var clone1;
var clone2;

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
    $(document).bind('keyup', 'left', function () {
        updateCameraAzimuth(0.1);
    });
    $(document).bind('keyup', 'right', function () {
        updateCameraAzimuth(-0.1);
    });
    var origin = new THREE.Vector3(0, 0, 0);
    
    var updateCameraZenith = function (angle) {
        var distance = camera.position.distanceTo(clone1._mesh.position);

        //move to center
        camera.position.copy(clone1._mesh.position);

        //rotate in object local space
        camera.matrix.rotateX(0.1);

        //rotate in object local space
        camera.rotation.setRotationFromMatrix(camera.matrix);

        //move back following the camera look vector
        //var normV = camera.rotation.clone().normalize();
        //var moveVector = camera.rotation.clone().normalize().multiplyScalar(-distance);
        //camera.position.addSelf(moveVector);
    };

    var updateCameraAzimuth = function (angle) {
        var distance = camera.position.distanceTo(clone1._mesh.position);

        //move to center
        camera.position.copy(clone1._mesh.position);

        //rotate in object local space
        camera.matrix.rotateY(0.1);

        //rotate in object local space
        camera.rotation.setRotationFromMatrix(camera.matrix);

        //move back following the camera look vector
        //var normV = camera.rotation.clone().normalize();
        //var moveVector = camera.rotation.clone().normalize().multiplyScalar(-distance);
        //camera.position.addSelf(moveVector);
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

    camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.z = 1000;
    scene.add( camera );

    clone1 = new Clone();
    clone2 = new Clone().radius(100);
    clone2._mesh.translateX(500);
    scene.add(clone1._mesh);
    scene.add(clone2._mesh);
    
    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );

    document.body.appendChild( renderer.domElement );
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
    renderer.render( scene, camera );
}

// wouldn't it be fucking great if string and number literals had methods
// ughghghgh
Object.prototype.echo = function () {
    console.log(this);
};

function sq(x) {
    return x * x;
}

});
