// --- Kamera inicializálás ---
const video = document.getElementById('video');

// Egyszerűsített kameraindítás (bármelyik elérhető kamera)
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    video.srcObject = stream;
  })
  .catch(err => {
    console.error('Kamera hiba:', err);
  });

// --- THREE.JS alapbeállítás ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  70,
  window.innerWidth / window.innerHeight,
  0.01,
  100
);

const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById('canvas'),
  alpha: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0);

// Kamera háttér beállítása
const videoTexture = new THREE.VideoTexture(video);
scene.background = videoTexture;

// --- 3D modell betöltése (ha elérhető) ---
const loader = new THREE.GLTFLoader();
loader.load(
  'hullam_kicsi.glb',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(1, 1, 1);
    model.position.set(0, 0, -2);
    scene.add(model);
  },
  undefined,
  (error) => {
    console.error('Modell betöltési hiba:', error);
  }
);

// --- Kameravezérlés ---
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, -2);
controls.update();

// --- Animációs ciklus ---
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

// --- Képernyőméret változás kezelése ---
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
