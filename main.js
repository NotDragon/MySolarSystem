import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { ColladaLoader } from "three/addons/loaders/ColladaLoader.js";
import {GLTFLoader} from "three/addons/loaders/GLTFLoader.js";

let currentStage = 0;
let planetCameraData = {
	"Sun": {
		position: {
			x: 0,
			y: 0,
			z: 0
		},
		rotation: {
			x: 0,
			y: 0,
			z: 0
		}
	},
	"Mercury": {
		position: {
			x: 0,
			y: 0,
			z: 0
		},
		rotation: {
			x: 0,
			y: 0,
			z: 0
		}
	},
	"Venus": {
		position: {
			x: 0,
			y: 0,
			z: 0
		},
		rotation: {
			x: 0,
			y: 0,
			z: 0
		}
	},
	"Earth": {
		position: {
			x: 0,
			y: 0,
			z: 0
		},
		rotation: {
			x: 0,
			y: 0,
			z: 0
		}
	},
	"Moon": {
		position: {
			x: 0,
			y: 0,
			z: 0
		},
		rotation: {
			x: 0,
			y: 0,
			z: 0
		}
	},
	"Mars": {
		position: {
			x: 0,
			y: 0,
			z: 0
		},
		rotation: {
			x: 0,
			y: 0,
			z: 0
		}
	},
	"Jupiter": {
		position: {
			x: 0,
			y: 0,
			z: 0
		},
		rotation: {
			x: 0,
			y: 0,
			z: 0
		}
	},
	"Saturn": {
		position: {
			x: 0,
			y: 0,
			z: 0
		},
		rotation: {
			x: 0,
			y: 0,
			z: 0
		}
	},
	"Uranus": {
		position: {
			x: 0,
			y: 0,
			z: 0
		},
		rotation: {
			x: 0,
			y: 0,
			z: 0
		}
	},
	"Neptune": {
		position: {
			x: 0,
			y: 0,
			z: 0
		},
		rotation: {
			x: 0,
			y: 0,
			z: 0
		}
	},
};
let newCameraData = {
	position: {
		x: 0,
		y: 0,
		z: 0,
	},
	rotation: {
		x: 0,
		y: 0,
		z: 0,
	},
	change: {
		x: 0,
		y: 0,
		z: 0
	}
};

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 1, 2000);
let renderer = new THREE.WebGLRenderer();

const loadingManager = new THREE.LoadingManager();
const loader = new GLTFLoader(loadingManager);

const background_music = new Audio('/Audio/bg.mp3');
let click_sound = new Audio('/Audio/click.mp3');
let has_sound = false;

let progress = document.createElement('div');
let progressBar = document.createElement('div');

camera.position.set(0, 10, 43);

renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

renderer.setClearColor(0x010101, 1);

function addStar() {
	const geometry = new THREE.SphereGeometry(THREE.MathUtils.randFloatSpread(8), 24, 24);
	const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
	const star = new THREE.Mesh(geometry, material);

	let [x, y, z] = Array(3)
		.fill()
		.map(() => THREE.MathUtils.randFloat(-6000, 6000));

	while((y > -300 && y < 300) && ((x < 300 && x > -300) && (z < 300 && z > -300)))
		y = THREE.MathUtils.randFloat(-6000, 6000);

	star.position.set(x, y, z);
	scene.add(star);
}

function loadPlanet(name, radius, widthSegment = 50, heightSegment = 50, basic = false) {
	const map = new THREE.TextureLoader(loadingManager).load(`/Textures/${name}/${name}_Color.png`);
	const normalTexture = new THREE.TextureLoader(loadingManager).load(`/Textures/${name}/${name}_Normal.png`);
	// const emissiveTexture = new THREE.TextureLoader().load(`/Textures/${name}/${name}_Emission.png`);
	const metalnessTexture = new THREE.TextureLoader(loadingManager).load(`/Textures/${name}/${name}_Metallic.png`);
	const roughnessTexture = new THREE.TextureLoader(loadingManager).load(`/Textures/${name}/${name}_Roughness.png`);

	const geometry = basic? new THREE.MeshBasicMaterial({
		map,
		normalMap: normalTexture,
		// emissiveMap: emissiveTexture,
		metalnessMap: metalnessTexture,
		roughnessMap: roughnessTexture
	}) : new THREE.MeshStandardMaterial({
		map,
		normalMap: normalTexture,
		// emissiveMap: emissiveTexture,
		metalnessMap: metalnessTexture,
		roughnessMap: roughnessTexture
	});

	return new THREE.Mesh(
		new THREE.SphereGeometry(radius, widthSegment, heightSegment),
		geometry
	);
}

function addElement(type, content, parent = document.querySelector('#main'), id = '', cssClass = '') {
	let element = document.createElement(type);
	element.innerHTML = content;

	if(cssClass)
		element.classList.add(cssClass);
	if(id)
		element.id = id;
	parent.appendChild(element);
	return element;
}

function setCameraData(name, x, y, z, rX = 0, rY = 0, rZ = 0) {
	planetCameraData[name].position.x = x;
	planetCameraData[name].position.y = y;
	planetCameraData[name].position.z = z;

	planetCameraData[name].rotation.x = rX;
	planetCameraData[name].rotation.y = rY;
	planetCameraData[name].rotation.z = rZ;
}

function displayText() {
	if(currentStage === 0) {
		document.querySelector('#introText').style.display = 'block';
	} else {
		document.querySelector('#introText').style.display = 'none';
	}

	if(currentStage === 1) {
		document.querySelector('#venusText').style.display = 'block';
	} else {
		document.querySelector('#venusText').style.display = 'none';
	}

	if(currentStage === 2) {
		document.querySelector('#mercuryText').style.display = 'block';
	} else {
		document.querySelector('#mercuryText').style.display = 'none';
	}

	if(currentStage === 3) {
		document.querySelector('#earthText').style.display = 'block';
	} else {
		document.querySelector('#earthText').style.display = 'none';
	}

	if(currentStage === 4) {
		document.querySelector('#moonText').style.display = 'block';
	} else {
		document.querySelector('#moonText').style.display = 'none';
	}

	if(currentStage === 5) {
		document.querySelector('#marsText').style.display = 'block';
	} else {
		document.querySelector('#marsText').style.display = 'none';
	}

	if(currentStage === 6) {
		document.querySelector('#jupiterText').style.display = 'block';
	} else {
		document.querySelector('#jupiterText').style.display = 'none';
	}

	if(currentStage === 7) {
		document.querySelector('#saturnText').style.display = 'block';
	} else {
		document.querySelector('#saturnText').style.display = 'none';
	}

	if(currentStage === 8) {
		document.querySelector('#uranusText').style.display = 'block';
	} else {
		document.querySelector('#uranusText').style.display = 'none';
	}

	if(currentStage === 9) {
		document.querySelector('#neptuneText').style.display = 'block';
	} else {
		document.querySelector('#neptuneText').style.display = 'none';
	}
}

function moveCamera(instant = false) {
	let currentPlanet = '';

	switch (currentStage) {
		case 0:
			currentPlanet = 'Sun';
			break;
		case 1:
			currentPlanet = 'Mercury';
			break;
		case 2:
			currentPlanet = 'Venus';
			break;
		case 3:
			currentPlanet = 'Earth';
			break;
		case 4:
			currentPlanet = 'Moon';
			break;
		case 5:
			currentPlanet = 'Mars';
			break;
		case 6:
			currentPlanet = 'Jupiter';
			break;
		case 7:
			currentPlanet = 'Saturn';
			break;
		case 8:
			currentPlanet = 'Uranus';
			break;
		case 9:
			currentPlanet = 'Neptune';
			break;
		default:
			currentStage = 0;
			moveCamera();
	}

	console.log(currentPlanet);

	if(currentStage === 0) {
		document.querySelector('#prevButton').style.opacity = 0.3;
		document.querySelector('#prevButton').disabled = true;
	}
	else {
		document.querySelector('#prevButton').style.opacity = 1;
		document.querySelector('#prevButton').removeAttribute('disabled');
	}
	if(currentStage === 9) {
		document.querySelector('#nextButton').style.opacity = 0.3;
		document.querySelector('#nextButton').disabled = true;
	}
	else {
		document.querySelector('#nextButton').style.opacity = 1;
		document.querySelector('#nextButton').removeAttribute('disabled');
	}

	displayText();

	if(instant) {
		camera.position.x = planetCameraData[currentPlanet].position.x;
		camera.position.y = planetCameraData[currentPlanet].position.y;
		camera.position.z = planetCameraData[currentPlanet].position.z;
	}

	newCameraData.position.x = planetCameraData[currentPlanet].position.x;
	newCameraData.position.y = planetCameraData[currentPlanet].position.y;
	newCameraData.position.z = planetCameraData[currentPlanet].position.z;

	newCameraData.rotation.x = planetCameraData[currentPlanet].rotation.x;
	newCameraData.rotation.y = planetCameraData[currentPlanet].rotation.y;
	newCameraData.rotation.z = planetCameraData[currentPlanet].rotation.z;

	newCameraData.change.x = 1;
	newCameraData.change.y = 1;
	newCameraData.change.z = 1;

	if(Math.abs(newCameraData.position.x - camera.position.x) > 100)
		newCameraData.change.x = Math.abs(newCameraData.position.x - camera.position.x) / 100;

	if(Math.abs(newCameraData.position.y - camera.position.y) > 100)
		newCameraData.change.y = Math.abs(newCameraData.position.y - camera.position.y) / 100;

	if(Math.abs(newCameraData.position.z - camera.position.z) > 100)
		newCameraData.change.z = Math.abs(newCameraData.position.z - camera.position.z) / 100;
}

function loadUI() {
	let body = document.createElement('div');
	body.style.cssText = 'position:fixed;'
	body.id = 'main';
	document.body.appendChild(body);

	let introText = addElement('div', '', body, 'introText', 'text');
	addElement('h1', 'Welcome To My Solar System', introText);
	addElement('p', 'By Michalis Chatzittofi', introText);

	let venusText = addElement('div', '', body, 'venusText', 'text');
	addElement('h1', 'About me', venusText);
	addElement('p', 'My name is Michalis Chatzittofi. I am a 14 year old student at the American Academy of Nicosia, and I have a passion for creating software. I also enjoy working with hardware, more specifically electronics. This lead me to the educational center <a href="https://www.stemfreak.com/">StemFreak</a>, where I discovered my passion about STEM, and made my dream of learning how to code come true', venusText);
	venusText.onclick = () => {
		localStorage.setItem('currentStage', currentStage);
		window.location.replace('/pages/about.html');
	}

	let mercuryText = addElement('div', '', body, 'mercuryText', 'text');
	addElement('h1', 'Robo', mercuryText);
	addElement('p', 'This year, I got an inter-ship at <a href="robo.com.cy">Robo.com.cy</a>. THere I expanded my expertise, and furthered my understanding of electronics. My inter-ship also gave me the opportunity to participate in some of the largest event in Cyprus. An opportunity that I latched on. Some of this events include:<br> <a href="https://reflectfest.com/">Reflect Fest. 2022</a><br> <a href="https://robotex.org.cy/">Robotex 2023</a><br> <a href="http://www.makerspace.onek.org.cy/makers-fair-2023">Makers Fair</a><br> ect', mercuryText);
	mercuryText.onclick = () => {
		localStorage.setItem('currentStage', currentStage);
		window.location.replace('/pages/robo.html');
	}

	let earthText = addElement('div', '', body, 'earthText', 'text');
	addElement('h1', 'STEM', earthText);
	addElement('p', 'Over my time at StemFreak, I became more, and more interested in STEM. I have researched many topics in depth, and conducted many surveys. I also have gained a lot of experience with data analysis, using many tools like python, and pspp', earthText);
	earthText.onclick = () => {
		localStorage.setItem('currentStage', currentStage);
		window.location.replace('/pages/stem.html');
	}

	let moonText = addElement('div', '', body, 'moonText', 'text');
	addElement('h1', 'Welcome To My Solar System4', moonText);
	addElement('p', 'By Michalis Chatzittofi', moonText);
	moonText.onclick = () => {
		localStorage.setItem('currentStage', currentStage);
		window.location.replace('/pages/robo.html');
	}

	let marsText = addElement('div', '', body, 'marsText', 'text');
	addElement('h1', 'Welcome To My Solar System5', marsText);
	addElement('p', 'By Michalis Chatzittofi', marsText);
	marsText.onclick = () => {
		localStorage.setItem('currentStage', currentStage);
		window.location.replace('/pages/robo.html');
	}

	let jupiterText = addElement('div', '', body, 'jupiterText', 'text');
	addElement('h1', 'Welcome To My Solar System6', jupiterText);
	addElement('p', 'By Michalis Chatzittofi', jupiterText);
	jupiterText.onclick = () => {
		localStorage.setItem('currentStage', currentStage);
		window.location.replace('/pages/robo.html');
	}

	let saturnText = addElement('div', '', body, 'saturnText', 'text');
	addElement('h1', 'Welcome To My Solar System7', saturnText);
	addElement('p', 'By Michalis Chatzittofi', saturnText);
	saturnText.onclick = () => {
		localStorage.setItem('currentStage', currentStage);
		window.location.replace('/pages/robo.html');
	}

	let uranusText = addElement('div', '', body, 'uranusText', 'text');
	addElement('h1', 'Welcome To My Solar System8', uranusText);
	addElement('p', 'By Michalis Chatzittofi', uranusText);
	uranusText.onclick = () => {
		localStorage.setItem('currentStage', currentStage);
		window.location.replace('/pages/robo.html');
	}

	let neptuneText = addElement('div', '', body, 'neptuneText', 'text');
	addElement('h1', 'Welcome To My Solar System9', neptuneText);
	addElement('p', 'By Michalis Chatzittofi', neptuneText);
	neptuneText.onclick = () => {
		localStorage.setItem('currentStage', currentStage);
		window.location.replace('/pages/robo.html');
	}

	displayText();
	let prevButton = addElement('button', '🡐', body, 'prevButton');
	let nextButton = addElement('button', '🡒', body, 'nextButton');

	let mute = addElement('button', 'Mute', body, 'muteButton');
	mute.innerHTML = 'Play Sound';

	nextButton.onclick = () => {
		click_sound.playbackRate = 1.5;
		click_sound.volume = 0.4;
		if(has_sound)
			click_sound.play();

		currentStage++;
		moveCamera();
	}

	prevButton.onclick = () => {
		click_sound.playbackRate = 1.5;
		click_sound.volume = 0.4;
		if(has_sound)
			click_sound.play();

		currentStage--;
		moveCamera();
	}

}
function loadScene() {
	progress.id = 'progress';
	progressBar.id = 'progressBar'

	progress.appendChild(progressBar);

	document.body.appendChild(progress);

	loadingManager.onProgress = function (item, loaded, total) {
		console.log((loaded / total * 100) + '%');
		progressBar.style.width = (loaded / total * 100) + '%';
	};

	const sun_light = new THREE.PointLight(0xffffff, 3, 5000);
	sun_light.position.set(0, 10, 0);
	// new OrbitControls(camera, renderer.domElement);

	// Array(5000).fill().forEach(addStar);

	const sun = loadPlanet('Sun', 20, 50, 50, true);
	sun.position.y = 10;
	setCameraData('Sun', 0, 10, 50);

	const mercury = loadPlanet('Mercury', 2);
	mercury.position.y = 10;
	mercury.position.x = 79;
	setCameraData('Mercury', 79, 10, 20);

	const venus = loadPlanet('Venus', 3);
	venus.position.y = 10;
	venus.position.x = 128;
	setCameraData('Venus', 128, 10, 23);

	const earth = loadPlanet('Earth', 4);
	earth.position.y = 10;
	earth.position.x = 172;
	setCameraData('Earth', 172, 10, 25);

	const moon = loadPlanet('Moon', 1);
	moon.position.y = 10;
	moon.position.x = 182;
	setCameraData('Moon', 182, 10, 10);

	const mars = loadPlanet('Mars', 3);
	mars.position.y = 10;
	mars.position.x = 268;
	setCameraData('Mars', 268, 10, 23);

	const jupiter = loadPlanet('Jupiter', 6);
	jupiter.position.y = 10;
	jupiter.position.x = 761;
	setCameraData('Jupiter', 761, 10, 30);

	let saturn = null;
	loader.load( '/Saturn.glb', function (gltf) {
		saturn = gltf.scene;
		saturn.scale.set(5, 5, 5);
		saturn.position.y = 10;
		saturn.position.x = 1482;

		saturn.rotation.z = -50 * Math.PI / 180;

		setCameraData('Saturn', 1482, 10, 25);

		scene.add(saturn);
	}, undefined, function (error) {

		console.error( error );

	} );

	const uranus = loadPlanet('Uranus', 5);
	console.log(uranus)
	uranus.position.y = 10;
	uranus.position.x = 2957;
	setCameraData('Uranus', 2957, 10, 43);

	const neptune = loadPlanet('Neptune', 4);
	neptune.position.y = 10;
	neptune.position.x = 4493;
	setCameraData('Neptune', 4493, 10, 43);

	scene.add(
		sun,
		mercury,
		venus,
		earth,
		moon,
		mars,
		jupiter,
		uranus,
		neptune,
		sun_light
	);

	function animate() {
		requestAnimationFrame(animate);

		sun.rotation.y += 0.002;
		mercury.rotation.y += 0.01;
		venus.rotation.y += 0.006;
		earth.rotation.y += 0.016;
		moon.rotation.y += 0.036;
		mars.rotation.y += 0.0086;
		jupiter.rotation.y += 0.0045;
		if(saturn)
			saturn.rotation.y += 0.03;
		uranus.rotation.y += 0.0093;
		neptune.rotation.y += 0.0097;

		if(camera.position.x > newCameraData.position.x) {
			camera.position.x -= newCameraData.change.x;
		} else if(camera.position.x < newCameraData.position.x) {
			camera.position.x += newCameraData.change.x;
		}
		if(Math.abs(newCameraData.position.x - camera.position.x) < 20) {
			newCameraData.change.x = 1;
			camera.position.x = Math.ceil(camera.position.x);
		}

		if(camera.position.y > newCameraData.position.y) {
			camera.position.y -= newCameraData.change.y;
		} else if(camera.position.y < newCameraData.position.y) {
			camera.position.y += newCameraData.change.y;
		}
		if(Math.abs(newCameraData.position.y - camera.position.y) < 20) {
			newCameraData.change.y = 1;
			camera.position.y = Math.ceil(camera.position.y);
		}

		if(camera.position.z > newCameraData.position.z) {
			camera.position.z -= newCameraData.change.z;
		} else if(camera.position.z < newCameraData.position.z) {
			camera.position.z += newCameraData.change.z;
		}
		if(Math.abs(newCameraData.position.z - camera.position.z) < 20) {
			newCameraData.change.z = 1;
			camera.position.z = Math.ceil(camera.position.z);
		}

		renderer.render(scene, camera);
	}

	loadUI();

	background_music.addEventListener('ended', function() {
		this.currentTime = 0;
		this.play();
	}, false);

	document.querySelector('#muteButton').addEventListener('click', function() {
		has_sound = !has_sound;

		if(has_sound) {
			document.querySelector('#muteButton').innerHTML = 'Pause Sound';
			background_music.volume = 0.1;
			background_music.play().then(() => {
				console.log('Playback resumed successfully');
			});
		} else {
			document.querySelector('#muteButton').innerHTML = 'Play Sound';
			background_music.pause();
		}

	});

	if(localStorage.getItem('currentStage')) {
		currentStage = parseInt(localStorage.getItem('currentStage'));
		moveCamera(true);
	}else {
		moveCamera();
	}

	animate();
}

window.onbeforeunload = () => {
	localStorage.setItem('currentStage', currentStage);
};
window.onload = loadScene;