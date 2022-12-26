import * as THREE from 'three'
import { DoubleSide } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

let blobs = [];
for (let i = 0; i < 10; i++) {
  blobs[i] = {
    position: new THREE.Vector2(Math.random()  *2 ,Math.random()),
    radius: .01,
    velocity: new THREE.Vector2((Math.random() - .5) / 32, (Math.random() - .5) / 32),
  }
}

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
      random: {
        type: 'f',
        value: [Math.random(), Math.random(), Math.random(), Math.random(), Math.random(),
                Math.random(), Math.random(), Math.random(), Math.random(), Math.random()]
      },
      blobs: {
        value: blobs,
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
      };

      uniform Blob[10] blobs;

      void main() {
        //x: 0 -> 2, y: = -> 1
        //divide by y to account for aspect ratio being off (rectangle shape, render squarely)
        vec2 uv = (gl_FragCoord.xy/resolution.y) / 2.;
        
        //center uv
        // uv.x -= .5;

        //distance function
        float total = 0.;
        for (int i = 0; i < blobs.length(); i++) {
          float d = distance(uv, blobs[i].position);
          total += blobs[i].radius / d;
        }
        col.x = total;

        // col = uv;

        gl_FragColor = vec4(col, .5, 1.0);
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

  for (let i = 0; i < blobs.length; i++) {
    if (blobs[i].position.x > 2.0 || blobs[i].position.x < 0) {
      blobs[i].velocity.x = -blobs[i].velocity.x;
    }
    if (blobs[i].position.y > 1.0 || blobs[i].position.y < 0) {
      blobs[i].velocity.y = -blobs[i].velocity.y;
    }

    blobs[i].position.add(blobs[i].velocity);
  }

  render();
};

animate();