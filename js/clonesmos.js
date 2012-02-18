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
    
    $(document).bind('keyup', 'down', function () {
        camera.position.z += 10;
    });
    $(document).bind('keyup', 'up', function () {
        camera.position.z -= 10;
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

});
