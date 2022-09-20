const THREE = require("three");
const {
  PointerLockControls,
} = require("three/examples/jsm/controls/PointerLockControls");

const textureLoader = new THREE.TextureLoader();

const getSprite = (fileName) => {
  const texture = textureLoader.load(fileName);
  const material = new THREE.SpriteMaterial({ map: texture });
  return new THREE.Sprite(material);
};

const setOffset = (sprite, baseOffset, multiplier, direction) => {
  const length = baseOffset * (1 - multiplier) * 3;

  sprite.position.x = direction.x * length;
  sprite.position.y = direction.y * length;
};

// 1. Tworzenie sceny
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

// 2. Tworzenie kamery
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.z = 5;
camera.rotateX(0.5);

// Ruch kamery
const controls = new PointerLockControls(camera, document.body);
scene.add(controls.getObject());

document.body.addEventListener("click", function () {
  if (controls.isLocked) {
    controls.unlock();
  } else {
    controls.lock();
  }
});

// 3. Tworzenie renderera
const renderer = new THREE.WebGLRenderer();

// Ustawiamy odleglosc flary
const flareLength = 0.1;

// Sprite slonca
const sun = getSprite("./sun.png");
sun.position.z = 0;
scene.add(sun);

// Sprite 3 flary
const flare3 = getSprite("./flare3.png");
flare3.scale.x = 0.5;
flare3.scale.y = 0.5;
flare3.position.x = 0.8;
flare3.position.y = 0.8;
scene.add(flare3);

// Sprite 2 flary
const flare2 = getSprite("./flare1.png");
flare2.scale.x = 0.5;
flare2.scale.y = 0.5;
flare2.position.x = 0.5;
flare2.position.y = 0.5;
scene.add(flare2);

// Sprite 1 flary
const flare1 = getSprite("./flare1.png");
flare1.scale.x = 3;
flare1.scale.y = 3;
flare1.position.x = 1.3;
flare1.position.y = 1.3;
scene.add(flare1);

// Dodawanie renderera do html'a strony
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Uruchimienie renderowania klatek
function animate() {
  try {
    requestAnimationFrame(animate);

    // Kamera
    const cameraToForwardVector = camera.getWorldDirection(
      new THREE.Vector3(0, 0, 1) // Kamera patrząca przed siebie
    );

    const cameraToSunVector = new THREE.Vector3()
      .subVectors(sun.position, camera.position)
      .normalize(); // Normalizujemy, poniewaz chcemy tylko kierunek

    const similarity = cameraToSunVector.dot(cameraToForwardVector);
    const power = 1 - (1 - similarity) / flareLength;

    flare1.material.opacity = power;
    flare2.material.opacity = power;
    flare3.material.opacity = power;

    const sunDirectionVector = new THREE.Vector3()
      .subVectors(cameraToForwardVector, cameraToSunVector)
      .normalize(); // Normalizujemy, poniewaz chcemy tylko kierunek

    setOffset(flare1, 3.3, power, sunDirectionVector);
    setOffset(flare2, 2.1, power, sunDirectionVector);
    setOffset(flare3, 1.7, power, sunDirectionVector);

    renderer.render(scene, camera);
  } catch (e) {}
}

animate();
