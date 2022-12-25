import * as THREE from 'three'
import { DoubleSide } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

/** SCENE */
const scene = new THREE.Scene();

/** CAMERA */
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = 5;

/** RENDERER */
const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(devicePixelRatio);
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

function render() {
  renderer.render( scene, camera );
}

/** OBJECTS */
const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(1, 1),
  new THREE.ShaderMaterial({
    uniforms: {
      resolution: {
        type: 'f',
        value: new THREE.Vector2(visualViewport.width, visualViewport.height)
      },
     },
    vertexShader:
      `
      void main() {

        vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * modelViewPosition; 
      }
    `,
    fragmentShader:
    `
      uniform vec2 resolution;
      vec2 col;

      struct Blob {
        vec2 position;
        float radius;
        vec2 velocity;
      };
  
      Blob[10] blobs;

      //WORK ON RANDOM BLOBS!!! 
      float rand(vec2 co){
        return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
      }


      void main() {
        //x: 0 -> 2, y: = -> 1
        //divide by y to account for aspect ratio being off (rectangle shape, render squarely)
        vec2 uv = (gl_FragCoord.xy/resolution.y) / 2.;
        
        //center uv
        // uv.x -= .5;

        //populate blobs
        for (int i = 0; i < blobs.length(); i++) {
          vec2 p = vec2(rand(vec2(1, 2)), rand(vec2(i, i)));
          blobs[i] = Blob(p, .1, vec2(.1, .3));
        }


        //distance function
        float d = distance(uv, blobs[0].position);
        col.x = blobs[0].radius / d;


        gl_FragColor = vec4(col, 0., 1.0);
      }
    `,
  })
);
scene.add(plane);

/** cover with quad */
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