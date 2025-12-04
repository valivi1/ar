// --- Kamera inicializálás ---
const video = document.getElementById('video');
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

// --- Kamera stream elindítása ---
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    video.srcObject = stream;
    return video.play(); // biztos, hogy elindul
  })
  .then(() => {
    // Csak akkor állítjuk be a háttér textúrát, amikor a videó ténylegesen játszik
    const videoTexture = new THREE.VideoTexture(video);
    scene.background = videoTexture;

    // 3D modell betöltése
    const loader = new THREE.GLTFLoader();
    loader.load(
      'hullam_kicsi.glb', // vagy hullam_comp.glb, ha így nevezted
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

    animate();
  })
  .catch(err => {
    console.error('Kamera hiba:', err);
  });

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

// --- Képernyőméret változás kezelése ---
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
