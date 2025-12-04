// Importáljuk a modulokat a modern three.js rendszerhez
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/controls/OrbitControls.js';

// --- Kamera inicializálás ---
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');

// THREE.js setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 100);
camera.position.z = 1;

const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0x000000, 0);

// --- Kamera stream elindítása ---
navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
  .then(stream => {
    video.srcObject = stream;
    return video.play();
  })
  .then(() => {
    const videoTexture = new THREE.VideoTexture(video);
    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.magFilter = THREE.LinearFilter;
    videoTexture.format = THREE.RGBFormat;

    scene.background = videoTexture;

    // 3D modell betöltése
    const loader = new GLTFLoader();
    loader.load(
      'hullam_kicsi.glb',
      gltf => {
        const model = gltf.scene;
        model.scale.set(1, 1, 1);
        model.position.set(0, 0, -2);
        scene.add(model);
      },
      undefined,
      error => console.error('Modell betöltési hiba:', error)
    );

    animate();
  })
  .catch(err => {
    console.error('Kamera hiba:', err);
  });

// OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, -2);
controls.update();

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

// --- Képernyőméret változás kezelése ---
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
