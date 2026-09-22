import * as THREE from "three";

import {
  OrbitControls
} from "three/addons/controls/OrbitControls.js";



/* =====================================================
   THREE.JS SCENE
===================================================== */

const sceneElement =
  document.getElementById("scene");


const scene =
  new THREE.Scene();


scene.background =
  new THREE.Color(0x0b0b0d);



/* CAMERA */

const camera =
  new THREE.PerspectiveCamera(
    32,
    1,
    0.1,
    100
  );


camera.position.set(
  4.8,
  2.8,
  7.2
);



/* RENDERER */

const renderer =
  new THREE.WebGLRenderer({

    antialias: true,

    powerPreference:
      "high-performance"

  });


renderer.setPixelRatio(
  Math.min(
    window.devicePixelRatio,
    1.6
  )
);


renderer.outputColorSpace =
  THREE.SRGBColorSpace;


renderer.shadowMap.enabled = true;


renderer.shadowMap.type =
  THREE.PCFSoftShadowMap;


sceneElement.appendChild(
  renderer.domElement
);



/* =====================================================
   CONTROLS
===================================================== */

const controls =
  new OrbitControls(
    camera,
    renderer.domElement
  );


controls.enableDamping = true;

controls.dampingFactor = 0.055;

controls.enablePan = false;

controls.minDistance = 4.5;

controls.maxDistance = 9;

controls.minPolarAngle = 0.75;

controls.maxPolarAngle = 1.8;

controls.target.set(
  0,
  1.05,
  0
);



/* =====================================================
   LIGHTING
===================================================== */

const hemisphere =
  new THREE.HemisphereLight(
    0xffffff,
    0x111118,
    2.1
  );

scene.add(
  hemisphere
);


const keyLight =
  new THREE.DirectionalLight(
    0xffffff,
    3.2
  );

keyLight.position.set(
  4,
  7,
  5
);

keyLight.castShadow = true;

scene.add(
  keyLight
);


const lavenderLight =
  new THREE.PointLight(
    0xcfc3ff,
    20,
    8
  );

lavenderLight.position.set(
  -4,
  2,
  -3
);

scene.add(
  lavenderLight
);



/* =====================================================
   BIKE
===================================================== */

const bike =
  new THREE.Group();


scene.add(
  bike
);



/* MATERIALS */

const frameMaterial =
  new THREE.MeshStandardMaterial({

    color: 0xddd9d0,

    metalness: 0.7,

    roughness: 0.27

  });


const darkMaterial =
  new THREE.MeshStandardMaterial({

    color: 0x121216,

    metalness: 0.7,

    roughness: 0.3

  });


const tireMaterial =
  new THREE.MeshStandardMaterial({

    color: 0x09090b,

    roughness: 0.75

  });


const metalMaterial =
  new THREE.MeshStandardMaterial({

    color: 0x77777b,

    metalness: 0.85,

    roughness: 0.2

  });



/* =====================================================
   TUBE FUNCTION
===================================================== */

function tube(
  start,
  end,
  radius,
  material = frameMaterial
) {

  const direction =
    new THREE.Vector3()
      .subVectors(
        end,
        start
      );


  const length =
    direction.length();


  const geometry =
    new THREE.CylinderGeometry(
      radius,
      radius,
      length,
      16
    );


  const mesh =
    new THREE.Mesh(
      geometry,
      material
    );


  mesh.position
    .copy(start)
    .add(end)
    .multiplyScalar(0.5);


  mesh.quaternion.setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    direction.normalize()
  );


  mesh.castShadow = true;


  return mesh;

}



/* =====================================================
   WHEELS
===================================================== */

function createWheel(
  positionZ
) {

  const wheel =
    new THREE.Group();


  const tire =
    new THREE.Mesh(

      new THREE.TorusGeometry(
        1.05,
        0.105,
        18,
        64
      ),

      tireMaterial

    );


  tire.rotation.y =
    Math.PI / 2;


  wheel.add(
    tire
  );


  const rim =
    new THREE.Mesh(

      new THREE.TorusGeometry(
        0.91,
        0.028,
        10,
        64
      ),

      metalMaterial

    );


  rim.rotation.y =
    Math.PI / 2;


  wheel.add(
    rim
  );



  /* SPOKES */

  for (
    let i = 0;
    i < 18;
    i++
  ) {

    const angle =
      i *
      Math.PI /
      9;


    const p1 =
      new THREE.Vector3(
        0,
        Math.sin(angle) * 0.9,
        Math.cos(angle) * 0.9
      );


    const p2 =
      new THREE.Vector3(
        0,
        -Math.sin(angle) * 0.9,
        -Math.cos(angle) * 0.9
      );


    wheel.add(
      tube(
        p1,
        p2,
        0.009,
        metalMaterial
      )
    );

  }



  const hub =
    new THREE.Mesh(

      new THREE.CylinderGeometry(
        0.07,
        0.07,
        0.25,
        16
      ),

      metalMaterial

    );


  hub.rotation.z =
    Math.PI / 2;


  wheel.add(
    hub
  );


  wheel.position.set(
    0,
    1.05,
    positionZ
  );


  return wheel;

}


const rearWheel =
  createWheel(-1.65);


const frontWheel =
  createWheel(1.65);


bike.add(
  rearWheel,
  frontWheel
);



/* =====================================================
   FRAME
===================================================== */

const rearAxle =
  new THREE.Vector3(
    0,
    1.05,
    -1.65
  );


const frontAxle =
  new THREE.Vector3(
    0,
    1.05,
    1.65
  );


const crank =
  new THREE.Vector3(
    0,
    0.85,
    -0.15
  );


const seat =
  new THREE.Vector3(
    0,
    1.82,
    -0.45
  );


const head =
  new THREE.Vector3(
    0,
    1.7,
    1.0
  );



bike.add(

  tube(
    rearAxle,
    crank,
    0.075
  ),

  tube(
    crank,
    head,
    0.075
  ),

  tube(
    head,
    rearAxle,
    0.075
  ),

  tube(
    crank,
    seat,
    0.065
  ),

  tube(
    seat,
    head,
    0.075
  ),

  tube(
    seat,
    rearAxle,
    0.065
  )

);



/* FRONT FORK */

bike.add(

  tube(

    head,

    new THREE.Vector3(
      0,
      1.08,
      1.62
    ),

    0.06,

    darkMaterial

  )

);



/* HANDLEBARS */

bike.add(

  tube(

    new THREE.Vector3(
      -0.35,
      1.82,
      1.75
    ),

    new THREE.Vector3(
      0.35,
      1.82,
      1.75
    ),

    0.035,

    darkMaterial

  )

);



/* SEAT */

bike.add(

  tube(

    new THREE.Vector3(
      0,
      1.84,
      -0.55
    ),

    new THREE.Vector3(
      0,
      1.84,
      -0.35
    ),

    0.09,

    darkMaterial

  )

);



/* SEAT POST */

bike.add(

  tube(

    new THREE.Vector3(
      0,
      1.84,
      -0.45
    ),

    new THREE.Vector3(
      0,
      1.91,
      -0.45
    ),

    0.025,

    metalMaterial

  )

);



/* MOTOR */

const motor =
  new THREE.Mesh(

    new THREE.CylinderGeometry(
      0.27,
      0.3,
      0.38,
      24
    ),

    darkMaterial

  );


motor.rotation.z =
  Math.PI / 2;


motor.position.set(
  0,
  0.67,
  0.05
);


bike.add(
  motor
);



bike.rotation.y =
  -0.35;


bike.position.y =
  0.15;



/* =====================================================
   RESIZE
===================================================== */

function resizeScene() {

  const width =
    sceneElement.clientWidth;

  const height =
    sceneElement.clientHeight ||
    window.innerHeight;


  camera.aspect =
    width / height;


  camera.updateProjectionMatrix();


  renderer.setSize(
    width,
    height,
    false
  );

}


window.addEventListener(
  "resize",
  resizeScene
);


resizeScene();



/* =====================================================
   MOUSE ROTATION
===================================================== */

let targetRotation =
  -0.35;


window.addEventListener(
  "pointermove",
  event => {

    const x =
      event.clientX /
      window.innerWidth -
      0.5;


    targetRotation =
      -0.35 +
      x * 0.35;

  }
);



/* =====================================================
   ANIMATION LOOP
===================================================== */

function animate() {

  requestAnimationFrame(
    animate
  );


  bike.rotation.y +=
    (
      targetRotation -
      bike.rotation.y
    ) * 0.025;


  controls.update();


  renderer.render(
    scene,
    camera
  );

}


animate();



/* =====================================================
   RIGHT MENU
===================================================== */

const menu =
  document.getElementById(
    "sideMenu"
  );


const backdrop =
  document.getElementById(
    "menuBackdrop"
  );


const menuButton =
  document.getElementById(
    "menuButton"
  );


const closeMenu =
  document.getElementById(
    "closeMenu"
  );


function toggleMenu(
  open
) {

  menu.classList.toggle(
    "open",
    open
  );


  backdrop.classList.toggle(
    "open",
    open
  );


  menuButton.setAttribute(
    "aria-expanded",
    open
  );

}


menuButton.addEventListener(
  "click",
  () => {

    toggleMenu(true);

  }
);


closeMenu.addEventListener(
  "click",
  () => {

    toggleMenu(false);

  }
);


backdrop.addEventListener(
  "click",
  () => {

    toggleMenu(false);

  }
);


document
  .querySelectorAll(
    ".side-menu a"
  )
  .forEach(
    link => {

      link.addEventListener(
        "click",
        () => {

          toggleMenu(false);

        }
      );

    }
  );



/* =====================================================
   PRE-ORDER MODAL
===================================================== */

const modal =
  document.getElementById(
    "modal"
  );


const modalClose =
  document.getElementById(
    "modalClose"
  );


document
  .querySelectorAll(
    '[data-action="preorder"]'
  )
  .forEach(
    button => {

      button.addEventListener(
        "click",
        () => {

          modal.classList.add(
            "open"
          );

        }
      );

    }
  );


modalClose.addEventListener(
  "click",
  () => {

    modal.classList.remove(
      "open"
    );

  }
);


modal.addEventListener(
  "click",
  event => {

    if (
      event.target === modal
    ) {

      modal.classList.remove(
        "open"
      );

    }

  }
);



/* =====================================================
   FORM
===================================================== */

const form =
  document.getElementById(
    "interestForm"
  );


const formMessage =
  document.getElementById(
    "formMessage"
  );


form.addEventListener(
  "submit",
  event => {

    event.preventDefault();


    formMessage.textContent =
      "Thanks — you're on the list.";


    form.reset();

  }
);



/* =====================================================
   CUSTOM LAVENDER CURSOR
===================================================== */

const cursor =
  document.getElementById(
    "cursor"
  );


const cursorRing =
  document.getElementById(
    "cursor-ring"
  );


let mouseX =
  window.innerWidth / 2;


let mouseY =
  window.innerHeight / 2;


let ringX =
  mouseX;


let ringY =
  mouseY;


window.addEventListener(
  "pointermove",
  event => {

    mouseX =
      event.clientX;

    mouseY =
      event.clientY;

  }
);



function cursorAnimation() {

  ringX +=
    (
      mouseX -
      ringX
    ) * 0.18;


  ringY +=
    (
      mouseY -
      ringY
    ) * 0.18;


  cursor.style.left =
    mouseX + "px";


  cursor.style.top =
    mouseY + "px";


  cursorRing.style.left =
    ringX + "px";


  cursorRing.style.top =
    ringY + "px";


  requestAnimationFrame(
    cursorAnimation
  );

}


cursorAnimation();



/* =====================================================
   CURSOR HOVER EFFECT
===================================================== */

const hoverElements =
  document.querySelectorAll(
    "a, button, input"
  );


hoverElements.forEach(
  element => {

    element.addEventListener(
      "mouseenter",
      () => {

        cursor.classList.add(
          "cursor-hover"
        );

      }
    );


    element.addEventListener(
      "mouseleave",
      () => {

        cursor.classList.remove(
          "cursor-hover"
        );

      }
    );

  }
);