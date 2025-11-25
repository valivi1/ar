const video = document.getElementById('video');

navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
  .then(stream => { video.srcObject = stream; });

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(70, window.innerWidth/window.innerHeight, 0.01, 100);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('canvas'), alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0);

const videoTexture = new THREE.VideoTexture(video);
scene.background = videoTexture;

const loader = new THREE.GLTFLoader();
loader.load('hullam_kicsi.glb', (gltf) => {
  const model = gltf.scene;
  model.scale.set(1, 1, 1);
  model.position.set(0, 0, -2);
  scene.add(model);
});

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, -2);
controls.update();

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

