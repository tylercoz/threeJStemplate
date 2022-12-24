import * as THREE from 'three'
import { DoubleSide } from 'three';
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
const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial( {color: 0x00ff00, side: DoubleSide} )
);
scene.add(plane);

/** cover with quad */
/** FIX */
() => {
  const dist = this.camera.position.z;
  const height = 1;
  this.camera.fov = 2*(180*Math.PI)*Math.atan(height/(2*dist));

  if (window.innerWidth/window.innerHeight > 1) {
    plane.scale.x = camera.aspect;
  }
  else {
    plane.scale.y = 1 / camera.aspect;
  }

  camera.updateProjectionMatrix();

}

/** CONTROLS */
const controls = new OrbitControls(camera, renderer.domElement);

/** ANIMATE */
function animate() {
  requestAnimationFrame( animate );

  render();
};

animate();