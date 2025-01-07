import * as THREE from "three";
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';

import strawberry from '../img/strawberry.jpg';
import gf from '../img/gf.png';
import bf from '../img/bf.png';
import stars from '../img/stars.png';
import cat1 from '../img/cat1.png';
import cat2 from '../img/cat2.png';

const renderer = new THREE.WebGLRenderer();

renderer.shadowMap.enabled = true;

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

const orbit = new OrbitControls(camera, renderer.domElement);

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

camera.position.set(0, 2, 5);
orbit.update();

// Cube Shape
const boxGeometry = new THREE.BoxGeometry();
const boxMaterial = new THREE.MeshStandardMaterial({color: 0x00FF00});
const box = new THREE.Mesh(boxGeometry, boxMaterial);
scene.add(box);
box.castShadow = true;
box.receiveShadow = true;

// Plane Shape
const planeGeometry = new THREE.PlaneGeometry(50, 50);
const planeMaterial = new THREE.MeshStandardMaterial({
    color: 0xFFFFFF,
    side: THREE.DoubleSide
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(plane);
plane.rotation.x = -0.5 * Math.PI;
// plane.castShadow = true;     -> will cause weird lines on shadows
plane.receiveShadow = true;

// Grid
const gridHelper = new THREE.GridHelper(50, 50);
scene.add(gridHelper);

// Sphere Shape
const sphereGeometry = new THREE.SphereGeometry(4, 50, 50);
const sphereMaterial = new THREE.MeshStandardMaterial({
    color: 0xFF0000,
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);
sphere.position.set(-10, 10, 0);
sphere.castShadow = true;
sphere.receiveShadow = true;

// Heart Shape
const heartShape = new THREE.Shape();

heartShape.moveTo(1.67, -1.67); // Flipped Y
heartShape.bezierCurveTo(1.67, -1.67, 1.33, 0, 0, 0); // Flipped Y
heartShape.bezierCurveTo(-2, 0, -2, -2.33, -2, -2.33); // Flipped Y
heartShape.bezierCurveTo(-2, -3.67, -0.67, -5.13, 1.67, -6.33); // Flipped Y
heartShape.bezierCurveTo(4, -5.13, 5.33, -3.67, 5.33, -2.33); // Flipped Y
heartShape.bezierCurveTo(5.33, -2.33, 5.33, 0, 3.33, 0); // Flipped Y
heartShape.bezierCurveTo(2.33, 0, 1.67, -1.67, 1.67, -1.67); // Flipped Y

const extrudeSettings = {
    depth: 8,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 2,
    bevelSize: 1,
    bevelThickness: 1,
};

const heartGeometry = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
const heartMaterial = new THREE.MeshStandardMaterial({ color: 0xff69b4 }); // Pink color for the heart
const heart = new THREE.Mesh(heartGeometry, heartMaterial);
heart.scale.set(2, 2, 0.1);

// Position and add the heart to the scene
heart.position.set(0, 20, -10); // Adjust the position as needed
heart.castShadow = true;
// heart.receiveShadow = true;
scene.add(heart);

// Ambient Light
const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);
ambientLight.castShadow = true;
ambientLight.position.set(0, 30, 0);

// Directional Light
const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.8);
scene.add(directionalLight);
directionalLight.position.set(-25, 30, 0);
directionalLight.intensity = 0;
directionalLight.castShadow = true

directionalLight.shadow.camera.left = -50;    // Left boundary of the shadow camera
directionalLight.shadow.camera.right = 50;    // Right boundary of the shadow camera
directionalLight.shadow.camera.top = 50;      // Top boundary of the shadow camera
directionalLight.shadow.camera.bottom = -50;  // Bottom boundary of the shadow camera
directionalLight.shadow.camera.near = 0.1;    // Near plane of the shadow camera
directionalLight.shadow.camera.far = 100;     // Far plane of the shadow camera

const dLightHelper = new THREE.DirectionalLightHelper(directionalLight);
scene.add(dLightHelper)

const dLightShadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
scene.add(dLightShadowHelper);

// Spot Light
const spotLight = new THREE.SpotLight(0xFFFFFF);
scene.add(spotLight);
spotLight.position.set(-25,25,0);
spotLight.castShadow = true;

const sLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(sLightHelper);

// Fog
scene.fog = new THREE.FogExp2(0x000000, 0.009);
// scene.fog = new THREE.Fog(0x000000, 0, 300);

// GUI
const gui = new dat.GUI();

const options = {
    boxColor: '#FF0000',
    sphereColor: '#FFEA00',
    planeColor: '#EEDD90',
    objWireframe: false,
    sphereSpeed: 0.01,
    ambientLightIntensity: ambientLight.intensity,
    directionalLightX: directionalLight.position.x,
    directionalLightY: directionalLight.position.y,
    directionalLightZ: directionalLight.position.z,
    directionalLightIntensity: directionalLight.intensity,
    spotLightIntensity: spotLight.intensity,
    spotLightAngle: spotLight.angle,
    spotLightPenumbra: spotLight.penumbra,
    backgroundType: 'single'

};

gui.addColor(options, 'boxColor').onChange(function(e){
    box.material.color.set(e);
});

gui.addColor(options, 'sphereColor').onChange(function(e){
    sphere.material.color.set(e);
});

gui.addColor(options, 'planeColor').onChange(function(e){
    plane.material.color.set(e);
});

gui.add(options, 'objWireframe').onChange(function(e){
    sphere.material.wireframe = e;
    box.material.wireframe = e;
});

gui.add(options, 'directionalLightX', -100, 100).onChange(function(e) {
    directionalLight.position.x = e;
});

gui.add(options, 'directionalLightY', -100, 100).onChange(function(e) {
    directionalLight.position.y = e;
});

gui.add(options, 'directionalLightZ', -100, 100).onChange(function(e) {
    directionalLight.position.z = e;
});

gui.add(options, 'sphereSpeed', 0, 1);

gui.add(options, 'ambientLightIntensity', 0, 10).onChange(function (e) {
    directionalLight.intensity = e;
});

gui.add(options, 'directionalLightIntensity', 0, 3).onChange(function (e) {
    directionalLight.intensity = e;
});

gui.add(options, 'spotLightIntensity', 0, 1000).onChange(function (e) {
    spotLight.intensity = e;
});

gui.add(options, 'spotLightAngle', 0, 1.6).onChange(function (e) {
    spotLight.angle = e;
});

gui.add(options, 'spotLightPenumbra', 0, 1).onChange(function (e) {
    spotLight.penumbra = e;
});

// renderer.setClearColor(0x000000);

const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();
const singleTexture = textureLoader.load(stars); // Single background texture
const cubeTexture = cubeTextureLoader.load([
    cat1, // Positive X
    cat2, // Negative X
    bf, // Positive Y
    gf, // Negative Y
    bf, // Positive Z
    gf  // Negative Z
]);


function updateBackground() {
    console.log(`Switching to background type: ${options.backgroundType}`);
    
    if (options.backgroundType === 'single') {
        scene.background = singleTexture; // Apply single texture
        console.log('Applied single texture.');
    } else if (options.backgroundType === 'cube') {
        scene.background = cubeTexture; // Apply cube texture
        console.log('Applied cube texture.');
    } else {
        console.error('Invalid background type. Defaulting to single texture.');
        scene.background = singleTexture; // Fallback to single texture
    }
}

gui.add(options, 'backgroundType', ['single', 'cube']).onChange(() => {
    updateBackground(); // Update background when option changes
});

let step = 0;

function animate(time){
    box.rotation.x = time / 1000;
    box.rotation.y = time / 1000;
    box.rotation.z = time / 1000;

    step += options.sphereSpeed;
    sphere.position.y = 10 * Math.abs(Math.sin(step));

    spotLightIntensity = options.spotLightIntensity
    spotLightAngle = options.spotLightAngle 
    spotLightPenumbra = options.spotLightPenumbra
    sLightHelper.update();

    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);