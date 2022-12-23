import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

/** threejs template */

/** SCENE */
const scene = new THREE.Scene();

/** CAMERA */
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = 5;

/** RENDERER */
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

function render() {
  renderer.render( scene, camera );
}

/** OBJECTS */
const cube = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial( {color: 0x00ff00} )
);
scene.add(cube);

/** CONTROLS */
const controls = new OrbitControls(camera, renderer.domElement);

/** ANIMATE */
function animate() {
  requestAnimationFrame( animate );

  cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;

  render();
};

animate();