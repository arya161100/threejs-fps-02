// Improved tactical three.js FPS: movement, shooting, scoring, basic enemies
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87CEEB);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(10, 20, 10);
scene.add(light);
scene.add(new THREE.AmbientLight(0x404040));

// Ground
const groundGeo = new THREE.PlaneGeometry(200, 200);
const groundMat = new THREE.MeshLambertMaterial({color: 0x228B22});
const ground = new THREE.Mesh(groundGeo, groundMat);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

camera.position.set(0, 1.6, 5);
let score = 0;
let ammo = 30;
const keys = {};

window.addEventListener('keydown', e => keys[e.code] = true);
window.addEventListener('keyup', e => keys[e.code] = false);

const enemies = [];
function spawnEnemy() {
  const geo = new THREE.BoxGeometry(1, 2, 1);
  const mat = new THREE.MeshLambertMaterial({color: Math.random() > 0.5 ? 0xff0000 : 0xffaa00});
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set((Math.random()-0.5)*80, 1, (Math.random()-0.5)*80 - 10);
  scene.add(mesh);
  enemies.push(mesh);
}
for (let i = 0; i < 10; i++) spawnEnemy();
document.getElementById('left').textContent = enemies.length;

function shoot() {
  if (ammo <= 0) return;
  ammo--;
  document.getElementById('ammo').textContent = ammo;
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
  const intersects = raycaster.intersectObjects(enemies);
  if (intersects.length > 0) {
    const hit = intersects[0].object;
    scene.remove(hit);
    enemies.splice(enemies.indexOf(hit), 1);
    score += 10;
    document.getElementById('score').textContent = score;
    document.getElementById('left').textContent = enemies.length;
    if (enemies.length === 0) {
      alert('All enemies cleared! Score: ' + score);
    }
  }
}
window.addEventListener('click', shoot);

let velocity = new THREE.Vector3();
function animate() {
  requestAnimationFrame(animate);
  // WASD movement
  const speed = 0.15;
  if (keys['KeyW']) velocity.z -= speed;
  if (keys['KeyS']) velocity.z += speed;
  if (keys['KeyA']) velocity.x -= speed;
  if (keys['KeyD']) velocity.x += speed;
  camera.position.add(velocity);
  velocity.multiplyScalar(0.85);
  // Keep on ground
  if (camera.position.y < 1.6) camera.position.y = 1.6;
  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
