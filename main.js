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

function vertexShader() {
  return `
    varying vec3 vUv; 

    void main() {
      vUv = position; 

      vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
      gl_Position = projectionMatrix * modelViewPosition; 
    }
  `
}

function fragmentShader() {
  return `
    uniform vec3 colorA; 
    uniform vec3 colorB; 
    varying vec3 vUv;

    void main() {
      gl_FragColor = vec4(mix(colorA, colorB, vUv.z), 1.0);
    }
  `
}

/** OBJECTS */
const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(1, 1),
  new THREE.ShaderMaterial({
    // uniforms: {},
    vertexShader:
      `
      varying vec3 vUv; 

      void main() {
        vUv = position; 

        vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * modelViewPosition; 
      }
    `,
    fragmentShader:
    `
      varying vec3 vUv;

      void main() {
        gl_FragColor = vec4(0., .8, .5, 1.0);
      }
    `,
  })
);
scene.add(plane);

/** cover with quad */
/** FIX */
const dist = camera.position.z;
const height = 1;
camera.fov = 2*(180/Math.PI)*Math.atan(height/(2*dist));

if (window.innerWidth/window.innerHeight > 1) {
  plane.scale.x = camera.aspect;
}
else {
  plane.scale.y = 1 / camera.aspect;
}

camera.updateProjectionMatrix();

/** CONTROLS */
// const controls = new OrbitControls(camera, renderer.domElement);

/** ANIMATE */
function animate() {
  requestAnimationFrame( animate );

  render();
};

animate();