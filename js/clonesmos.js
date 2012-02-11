var camera, scene, renderer,
geometry, material, mesh;

init();
animate();

function init() {

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
        var geometry = new THREE.SphereGeometry(clone.r, clone.segmentsX, clone.segmentsY);
        var material = new THREE.MeshBasicMaterial({ color: clone.color, wireframe: clone.wireframe });
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
