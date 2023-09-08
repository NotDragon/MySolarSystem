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
	"PlanetIX": {
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
renderer.autoClearColor = true;
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

function addElement(type, content, parent = document.querySelector('#main'), id = '', cssClass = ['']) {
	let element = document.createElement(type);
	element.innerHTML = content;

	if(cssClass[0])
		for(let i of cssClass)
			element.classList.add(i);
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

function displayText(detail = false) {
	document.querySelector('#venusTextDetail').style.display = 'none';
	document.querySelector('#mercuryTextDetail').style.display = 'none';
	document.querySelector('#earthTextDetail').style.display = 'none';
	document.querySelector('#moonTextDetail').style.display = 'none';
	document.querySelector('#marsTextDetail').style.display = 'none';
	document.querySelector('#jupiterTextDetail').style.display = 'none';
	document.querySelector('#saturnTextDetail').style.display = 'none';
	document.querySelector('#uranusTextDetail').style.display = 'none';
	document.querySelector('#neptuneTextDetail').style.display = 'none';

	document.querySelector('#introText').style.display = 'none';
	document.querySelector('#venusText').style.display = 'none';
	document.querySelector('#mercuryText').style.display = 'none';
	document.querySelector('#earthText').style.display = 'none';
	document.querySelector('#moonText').style.display = 'none';
	document.querySelector('#marsText').style.display = 'none';
	document.querySelector('#jupiterText').style.display = 'none';
	document.querySelector('#saturnText').style.display = 'none';
	document.querySelector('#uranusText').style.display = 'none';
	document.querySelector('#neptuneText').style.display = 'none';


	if(currentStage === 0) {
		document.querySelector(`#introText`).style.display = 'block';
	}

	if(currentStage === 1) {
		document.querySelector(`#mercuryText${detail? 'Detail': ''}`).style.display = 'block';
	}

	if(currentStage === 2) {
		document.querySelector(`#venusText${detail? 'Detail': ''}`).style.display = 'block';
	}

	if(currentStage === 3) {
		document.querySelector(`#earthText${detail? 'Detail': ''}`).style.display = 'block';
	}

	if(currentStage === 4) {
		document.querySelector(`#moonText${detail? 'Detail': ''}`).style.display = 'block';
	}

	if(currentStage === 5) {
		document.querySelector(`#marsText${detail? 'Detail': ''}`).style.display = 'block';
	}

	if(currentStage === 6) {
		document.querySelector(`#jupiterText${detail? 'Detail': ''}`).style.display = 'block';
	}

	if(currentStage === 7) {
		document.querySelector(`#saturnText${detail? 'Detail': ''}`).style.display = 'block';
	}

	if(currentStage === 8) {
		document.querySelector(`#uranusText${detail? 'Detail': ''}`).style.display = 'block';
	}

	if(currentStage === 9) {
		document.querySelector(`#neptuneText${detail? 'Detail': ''}`).style.display = 'block';
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
		case 10:
			currentPlanet = 'PlanetIX';
			break;
		default:
			currentStage = 0;
			moveCamera();
	}

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

	let introText = addElement('div', '', body, 'introText', ['panel', 'underPlanet']);
	addElement('h1', 'Welcome To My Solar System', introText);
	addElement('p', 'By Michalis Chatzittofi', introText);

	let mercuryText = addElement('div', '', body, 'mercuryText', ['panel', 'underPlanet']);
	addElement('h1', 'About me', mercuryText);
	addElement('p', 'My name is Michalis Chatzittofi. I am a 14 year old student at the American Academy of Nicosia, and I have a passion for creating software. I also enjoy working with hardware, more specifically electronics. This lead me to the educational center <a href="https://www.stemfreak.com/">StemFreak</a>, where I discovered my passion about STEM, and made my dream of learning how to code come true', mercuryText);
	// mercuryText.onclick = () => {
	// 	displayText(true);
	// }

	let mercuryTextDetail = addElement('div', '', body, 'mercuryTextDetail');

	let venusText = addElement('div', '', body, 'venusText', ['panel', 'underPlanet']);
	addElement('h1', 'Robo', venusText);
	addElement('p', 'This year, I got an internship at <a href="https://robo.com.cy">Robo.com.cy</a>. There I expanded my expertise, and furthered my understanding of electronics. My internship also gave me the opportunity to participate in some of the largest event in Cyprus. An opportunity that I latched on. Some of this events include:<br> <a href="https://reflectfest.com/">Reflect Fest. 2022</a><br> <a href="https://robotex.org.cy/">Robotex 2023</a><br> <a href="http://www.makerspace.onek.org.cy/makers-fair-2023">Makers Fair</a><br> ect <br> <h6>Click to read more</h6>', venusText);
	venusText.onclick = () => {
		displayText(true);
		newCameraData.position.y -= 5;
	}

	let venusTextDetail = addElement('div', '', body, 'venusTextDetail');

	addElement('div', '', venusTextDetail, 'cscriptContainer', ['panel', 'overPlanet']);
	addElement('h1', 'CScript (Alpha)', document.querySelector('#cscriptContainer'));
	addElement('p', 'One of the many projects I undertook with <a href="https://robo.com.cy">Robo</a> was CScript. CScript is a program that takes Blocks and translates them to arduino code. It also includes special functions specific for the Tankbot (a robot produced by <a href="https://robo.com.cy">Robo</a>). <a href="https://github.com/NotDragon/CScript">The code is available on GitHub</a>', document.querySelector('#cscriptContainer'));

	addElement('div', '', venusTextDetail, 'unicContainer', ['panel', 'overPlanet']);
	addElement('h1', 'Courses', document.querySelector('#unicContainer'));
	addElement('p', 'This year, I had the opportunity to help, in several introductory courses/workshops organized and hosted by <a href="https://robo.com.cy">Robo</a>, as well as its partners. Some of these courses/workshops include: <br>An introductions to electronic, hosted at <a href="https://www.unic.ac.cy/">The University of Nicosia</a> <br>An introduction to electronics at <a href="http://www.makerspace.onek.org.cy/makers-fair-2023">Makers Fair</a><br> ect. <br> I also helped prepare an introductory course on electronics for the <a href="https://www.nup.ac.cy/">Napolis University Pafos</a>', document.querySelector('#unicContainer'));

	// let cscriptscreenshot = document.createElement('img');
	// cscriptscreenshot.src = '/img/CScirptScreenshot.png';
	// cscriptscreenshot.width = window.innerWidth / 3;
	// venusTextDetail.appendChild(cscriptscreenshot);

	addElement('div', '', venusTextDetail, 'ubidotsContainer', ['panel', 'overPlanet']);
	addElement('h1', 'Ubidots', document.querySelector('#ubidotsContainer'));
	addElement('p', '<a href="https://ubidots.com/">Ubidots</a> is a platform that allows you to present and visualise data. It also allows IoT devices, like arduino boards, to communicate with computers. I was responsible for integrating this tool with already existing projects at <a href="https://robo.com.cy">Robo</a>', document.querySelector('#ubidotsContainer'));

	venusTextDetail.onclick = () => {
		displayText();
		newCameraData.position.y += 5;
	}

	let earthText = addElement('div', '', body, 'earthText', ['panel', 'underPlanet']);
	addElement('h1', 'STEM', earthText);
	addElement('p', 'Over my time at <a href="https://www.stemfreak.com/">StemFreak</a>, I became more, and more interested in STEM. I have researched many topics in depth, and conducted many surveys. I also have gained a lot of experience with data analysis, using many tools like python, and pspp <br> <h6>Click to read more</h6>', earthText);
	earthText.onclick = () => {
		displayText(true);
		newCameraData.position.y -= 5;
	}

	let earthTextDetail = addElement('div', '', body, 'earthTextDetail');

	addElement('div', '', earthTextDetail, 'fiveGContainer', ['panel', 'overPlanet']);
	addElement('h1', '5G', document.querySelector('#fiveGContainer'));
	addElement('p', '5G is a very important development in technology. It allowed for faster internet speeds and supported more devices from one access-point. It also made machines like surgical robots, to be more precise and accurate. At <a href="https://www.stemfreak.com/">StemFreak</a>, me and a team of other students put together a survey, and collected responses, x in total. Afterwards we analyzed the data, and drew conclusions.', document.querySelector('#fiveGContainer'));

	addElement('div', '', earthTextDetail, 'AIContainer', ['panel', 'overPlanet']);
	addElement('h1', 'AI', document.querySelector('#AIContainer'));
	addElement('p', 'Recently AI has been improving at a drastic rate. AIs, like <a href="https://chat.openai.com/">ChatGPT</a>, have gotten to a point that can challenge human intelligence. Yet, not many people know how it works, although they might use it daily <br> <h6>Click to read more</h6>', document.querySelector('#AIContainer'));
	document.querySelector('#AIContainer').onclick = () => {
		window.location.replace("https://docs.google.com/presentation/d/1VuLapJSvsCmxKjZswXtTdp7udW8pwNkE/edit?usp=drive_link&ouid=100565756179145800677&rtpof=true&sd=true");
	}

	// addElement('div', '', earthTextDetail, 'brainContainer', ['panel', 'overPlanet']);
	// addElement('h1', 'The human brain', document.querySelector('#brainContainer'));
	// addElement('p', 'The human brain is one of the most complicated and least understood part of our body. This is because it is responsible for many things and is very complex. In this presentation I focus mainly on memory and the hippocampus <br> <h6>Click to read more</h6>', document.querySelector('#brainContainer'));
	// document.querySelector('#brainContainer').onclick = () => {
	// 	window.location.replace("https://docs.google.com/presentation/d/1RAk0E0ZfxfmrllN1oP_c2mtJ7sAZ6IpQ/edit?usp=drive_link&ouid=100565756179145800677&rtpof=true&sd=true");
	// }

	addElement('div', '', earthTextDetail, 'readMoreContainer', ['panel', 'overPlanet']);
	addElement('h1', 'Read more', document.querySelector('#readMoreContainer'));
	addElement('p', 'You can click here to find some more of my powerpoint presentations, as well as the raw result of the 5G survey', document.querySelector('#readMoreContainer'));
	document.querySelector('#readMoreContainer').onclick = () => {
		window.location.replace("https://drive.google.com/drive/folders/1D6DCljTg-ZKKD7OlI2VyN4SL4jLt71WX?usp=drive_link");
	}
	// https://drive.google.com/drive/folders/1D6DCljTg-ZKKD7OlI2VyN4SL4jLt71WX?usp=drive_link


	earthTextDetail.onclick = () => {
		displayText();
		newCameraData.position.y += 5;
	}

	let moonText = addElement('div', '', body, 'moonText', ['panel', 'underPlanet']);
	addElement('h1', 'Teacher Assistant', moonText);
	addElement('p', '2022, was my first time as a teacher assistant. During that summer school at <a href="https://www.stemfreak.com/">StemFreak</a>, I was entrusted with the role of teacher assistant. Along with my mentor, I had the opportunity to teach STEM and C++ to other students. This year I was entrusted a class of my own. I was responsible for 6 students. Everyday, I would give them a topic, and they would research that topic. At the end of the day, they would have to present their work, either thought a PowerPoint presentation or anything else they prepared ', moonText);

	let moonTextDetail = addElement('div', '', body, 'moonTextDetail');


	let marsText = addElement('div', '', body, 'marsText', ['panel', 'underPlanet']);
	addElement('h1', 'Inertia', marsText);
	addElement('p', 'By far, one of my most ambitious projects, code named "Inertia", is my very own programming language. It is statically typed, but supports dynamic variables. It is also compiled, and can compile down to C++, which is the language it is written in. Inertia aims to be very versatile and has no specific use. <a href="https://github.com/NotDragon/Inertia">An older version is available on GitHub</a>', marsText);
	// marsText.onclick = () => {
	// 	displayText(true);
	// }

	let marsTextDetail = addElement('div', '', body, 'marsTextDetail');


	let jupiterText = addElement('div', '', body, 'jupiterText', ['panel', 'underPlanet']);
	addElement('h1', 'Endure', jupiterText);
	addElement('p', 'Endure, is one of my biggest projects. It is a third person, top-down, survival, adventure game, written in C++ (no engine). This project allowed me to experiment with things that I previously was not comfortable with, such as animation, level design and graphics <br> <h6>Click to read more</h6>', jupiterText);
	jupiterText.onclick = () => {
		newCameraData.position.y -= 5;
		displayText(true);
	}

	let jupiterTextDetail = addElement('div', '', body, 'jupiterTextDetail');

	addElement('div', '', jupiterTextDetail, 'narrativeContainer', ['panel', 'overPlanet']);
	addElement('h1', 'Narrative', document.querySelector('#narrativeContainer'));
	addElement('p', 'The first thing to decide when making a game is what genera it was going to be. Endure is a third person top down, adventure game, where you resume the role of a human in the far future. The lore is heavily inspired by <a href="https://en.wikipedia.org/wiki/The_Fable_of_the_Dragon-Tyrant">The Fable of the Dragon-Tyrant</a>. It goes as following, after a disaster that almost wiped out the human race, a group of people decided to seek refuge in a huge and old tree. Over the years the tree and humans evolved around each-other. But a new mutation caused the tree to require humans inorder to thrive. Since humans needed the tree to be fertile, inorder the farm plants, everyone mutually agreed that people over the age of 50 would be feed to the tree', document.querySelector('#narrativeContainer'));

	addElement('div', '', jupiterTextDetail, 'storyContainer', ['panel', 'overPlanet']);
	addElement('h1', 'Story', document.querySelector('#storyContainer'));
	addElement('p', 'The main character is the one that challenged this mentality, that every one had accepted as part of life for generations. He decides to leave the tree and go to the outer world, that now started to heal and all signs of humanity start to fade away. There he has to fight with new species and a new rising civilization that started to replace humans', document.querySelector('#storyContainer'));

	addElement('div', '', jupiterTextDetail, 'internalContainer', ['panel', 'overPlanet']);
	addElement('h1', 'Internal', document.querySelector('#internalContainer'));
	addElement('p', 'For this project I used C++ along with a graphics library called <a href="https://www.raylib.com/">RayLib</a>, along with a wrapper that I made for C++, as <a href="https://www.raylib.com/">RayLib</a> was made for C. This wrapper also allowed me to render things in a custom grid and blocks. I also used <a href="https://www.glfw.org/">GLFW</a> for more complex and performance demanding things. During development, I decided that manually making maps with code was needlessly complicated, so I made a tool that would read from a JSON file where maps and their corresponding metadata were saved, and then loaded them.', document.querySelector('#internalContainer'));

	jupiterTextDetail.onclick = () => {
		newCameraData.position.y += 5;
		displayText();
	}

	let saturnText = addElement('div', '', body, 'saturnText', ['panel', 'underPlanet']);
	addElement('h1', 'Astrotourism Project', saturnText);
	addElement('p', 'Astroturism is a project, funded by the Research and Innovation Foundation and funded by the EU and the Government of the Republic of Cyprus. It aims to utilize, Cyprus\' clear skies, and ideal geography, inorder to promote and improve astroturism, in 36 months.', saturnText);
	// saturnText.onclick = () => {
	// 	displayText(true);
	// }

	let saturnTextDetail = addElement('div', '', body, 'saturnTextDetail');

	let uranusText = addElement('div', '', body, 'uranusText', ['panel', 'underPlanet']);
	addElement('h1', 'This Portfolio', uranusText);
	addElement('p', 'Another big project, I undertook, is this portfolio. It is written in vanilla JS, HTML and CSS. <a href="https://github.com/NotDragon/MySolarSystem"> The code is available on GitHub</a>', uranusText);
	// uranusText.onclick = () => {
	// 	displayText(true);
	// }

	let uranusTextDetail = addElement('div', '', body, 'uranusTextDetail');

	let neptuneText = addElement('div', '', body, 'neptuneText', ['panel', 'underPlanet']);
	addElement('h1', 'My Computer!', neptuneText);
	addElement('p', 'Computers, are one of the most important things, we have created. They are used everywhere! Few people, though, understand how they actually work, and even less are able to build one. I decided to be one of this people, by building a computer from scratch. <br> <h6>Click to read more</h6>', neptuneText);
	neptuneText.onclick = () => {
		newCameraData.position.y -= 10;
		displayText(true);
	}

	let neptuneTextDetail = addElement('div', '', body, 'neptuneTextDetail');
	addElement('div', '', neptuneTextDetail, 'computerPartsContainer', ['panel', 'overPlanet']);
	addElement('h1', 'Basics', document.querySelector('#computerPartsContainer'));
	addElement('p', 'My computer, code named M.A.G.I.C., is build using basic logic gates, like <a href="https://en.wikipedia.org/wiki/AND_gate">AND gates</a>, <a href="https://en.wikipedia.org/wiki/OR_gate">OR gates</a>, <a href="https://en.wikipedia.org/wiki/Inverter_(logic_gate)">NOT gates</a>, ect. With this, I build modules of 255-bit RAM, an 8-bit ALU, registers, and a very basic GPU. At its current state, it is able to understand 32 16-bit instructions (in 0s and 1s only). I have constructed a basic program, that can take input 2, 1-digit numbers, add them, and display the result on a screen', document.querySelector('#computerPartsContainer'));

	neptuneTextDetail.onclick = () => {
		newCameraData.position.y += 10;
		displayText();
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

	const sun_light = new THREE.PointLight(0xffffff, 2, 7000);
	sun_light.position.set(0, 10, 0);
	// new OrbitControls(camera, renderer.domElement);

	Array(5000).fill().forEach(addStar);

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

		if(localStorage.getItem('currentStage')) {
			currentStage = parseInt(localStorage.getItem('currentStage'));
			moveCamera(true);
		}

		scene.add(saturn);
	}, undefined, function (error) {

		console.error( error );

	} );

	const uranus = loadPlanet('Uranus', 5);
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
			background_music.volume = 0.3;
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
	} else {
		moveCamera();
	}

	animate();

}

window.onbeforeunload = () => {
	localStorage.setItem('currentStage', currentStage);
};
window.onload = loadScene;