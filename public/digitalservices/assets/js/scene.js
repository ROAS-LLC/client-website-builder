/* Digital Services US — cinematic WebGL layer (three.js)
   Runs only on capable desktops with motion enabled. The site is
   fully functional without it; CSS ambient light carries the look
   on mobile / reduced-motion / no-WebGL environments. */

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const desktop = window.matchMedia("(min-width: 1024px)").matches;
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

function webglAvailable() {
  try {
    const c = document.createElement("canvas");
    return !!(window.WebGLRenderingContext && (c.getContext("webgl2") || c.getContext("webgl")));
  } catch (e) {
    return false;
  }
}

if (desktop && finePointer && !reducedMotion && webglAvailable()) {
  init().catch(() => { /* CSS ambient fallback stays active */ });
}

async function init() {
  const THREE = await import("../vendor/three.module.min.js");
  const canvas = document.getElementById("gl-stage");
  if (!canvas) return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 60);
  camera.position.set(0, 0, 9);

  /* ---- lighting: cinematic rim + colored key lights ---- */
  scene.add(new THREE.AmbientLight(0x1b1533, 1.4));
  const keyViolet = new THREE.PointLight(0x8b5cf6, 90, 40, 1.8);
  keyViolet.position.set(-5, 3, 6);
  const keyCyan = new THREE.PointLight(0x22d3ee, 60, 40, 1.8);
  keyCyan.position.set(6, -3, 4);
  const rim = new THREE.DirectionalLight(0xc4b5fd, 2.2);
  rim.position.set(-4, 6, -6);
  scene.add(keyViolet, keyCyan, rim);

  /* ---- hero object: faceted black-chrome core + emissive lattice ---- */
  const hero = new THREE.Group();

  const core = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.9, 1),
    new THREE.MeshStandardMaterial({
      color: 0x0d0b1e,
      metalness: 0.95,
      roughness: 0.18,
      flatShading: true,
      emissive: 0x1a1040,
      emissiveIntensity: 0.6
    })
  );
  hero.add(core);

  const lattice = new THREE.Mesh(
    new THREE.IcosahedronGeometry(2.25, 1),
    new THREE.MeshBasicMaterial({
      color: 0x8b5cf6,
      wireframe: true,
      transparent: true,
      opacity: 0.18,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    })
  );
  hero.add(lattice);

  const innerGlow = new THREE.Mesh(
    new THREE.SphereGeometry(1.15, 24, 24),
    new THREE.MeshBasicMaterial({
      color: 0x6366f1,
      transparent: true,
      opacity: 0.16,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    })
  );
  hero.add(innerGlow);

  /* orbiting data nodes */
  const nodes = new THREE.Group();
  const nodeGeo = new THREE.SphereGeometry(0.045, 10, 10);
  const nodeMat = new THREE.MeshBasicMaterial({ color: 0x67e8f9, transparent: true, opacity: 0.9 });
  for (let i = 0; i < 26; i++) {
    const node = new THREE.Mesh(nodeGeo, nodeMat);
    const a = Math.random() * Math.PI * 2;
    const b = Math.acos(2 * Math.random() - 1);
    const r = 2.7 + Math.random() * 0.5;
    node.position.set(r * Math.sin(b) * Math.cos(a), r * Math.cos(b), r * Math.sin(b) * Math.sin(a));
    nodes.add(node);
  }
  hero.add(nodes);

  hero.position.set(3.1, 0.1, -1.4);
  scene.add(hero);

  /* ---- final CTA portal rings (revealed near the end) ---- */
  const portal = new THREE.Group();
  const ringA = new THREE.Mesh(
    new THREE.TorusGeometry(3.1, 0.02, 12, 160),
    new THREE.MeshBasicMaterial({ color: 0xa78bfa, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false })
  );
  const ringB = new THREE.Mesh(
    new THREE.TorusGeometry(2.55, 0.014, 12, 160),
    new THREE.MeshBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false })
  );
  ringB.rotation.x = 0.5;
  portal.add(ringA, ringB);
  portal.position.set(0, 0, -1);
  scene.add(portal);

  /* ---- atmospheric particle field ---- */
  const COUNT = 850;
  const positions = new Float32Array(COUNT * 3);
  const colors = new Float32Array(COUNT * 3);
  const cViolet = new THREE.Color(0x8b5cf6);
  const cCyan = new THREE.Color(0x22d3ee);
  const cMag = new THREE.Color(0xd946ef);
  for (let i = 0; i < COUNT; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 30;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 16 - 3;
    const t = Math.random();
    const col = t < 0.55 ? cViolet : t < 0.9 ? cCyan : cMag;
    colors[i * 3] = col.r; colors[i * 3 + 1] = col.g; colors[i * 3 + 2] = col.b;
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  pGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  const particles = new THREE.Points(pGeo, new THREE.PointsMaterial({
    size: 0.045,
    vertexColors: true,
    transparent: true,
    opacity: 0.55,
    sizeAttenuation: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  }));
  scene.add(particles);

  /* ---- cursor-responsive lighting & parallax ---- */
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  window.addEventListener("mousemove", (e) => {
    mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.ty = -((e.clientY / window.innerHeight) * 2 - 1);
  }, { passive: true });

  /* ---- scroll choreography (scrubbed, camera-feel transitions) ---- */
  const drive = { heroX: 3.1, heroScale: 1, heroFade: 1, portalGlow: 0, camZ: 9, hue: 0 };
  if (window.gsap && window.ScrollTrigger) {
    /* leaving the hero: object recedes and drifts as the journey begins */
    gsap.to(drive, {
      heroX: -3.4, heroScale: 0.55, heroFade: 0.35, camZ: 10.5,
      ease: "none",
      scrollTrigger: { trigger: "#about", start: "top bottom", end: "top 20%", scrub: 0.8 }
    });
    /* mid-journey: ambient hue slowly shifts violet → cyan */
    gsap.to(drive, {
      hue: 1,
      ease: "none",
      scrollTrigger: { trigger: "#services", start: "top bottom", end: "bottom top", scrub: 1.2 }
    });
    /* finale: the portal ignites, lighting intensifies, object returns to center */
    gsap.to(drive, {
      portalGlow: 1, heroX: 0, heroScale: 1.25, heroFade: 1, camZ: 8.2,
      ease: "none",
      scrollTrigger: { trigger: ".finale", start: "top bottom", end: "center center", scrub: 0.8 }
    });
  }

  /* ---- resize ---- */
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  /* ---- render loop ---- */
  const clock = new THREE.Clock();
  const violetA = new THREE.Color(0x8b5cf6);
  const violetB = new THREE.Color(0x22d3ee);
  const cyanA = new THREE.Color(0x22d3ee);
  const cyanB = new THREE.Color(0xd946ef);
  const tmpA = new THREE.Color();
  const tmpB = new THREE.Color();
  let running = true;

  document.addEventListener("visibilitychange", () => {
    running = document.visibilityState === "visible";
    if (running) clock.getDelta();
  });

  renderer.setAnimationLoop(() => {
    if (!running) return;
    const t = clock.getElapsedTime();

    mouse.x += (mouse.tx - mouse.x) * 0.05;
    mouse.y += (mouse.ty - mouse.y) * 0.05;

    /* slow continuous movement + subtle cursor response */
    hero.rotation.y = t * 0.12 + mouse.x * 0.18;
    hero.rotation.x = Math.sin(t * 0.16) * 0.14 + mouse.y * 0.12;
    lattice.rotation.y = -t * 0.05;
    nodes.rotation.y = t * 0.22;
    nodes.rotation.z = t * 0.07;
    hero.position.x = drive.heroX + Math.sin(t * 0.4) * 0.08;
    hero.position.y = 0.1 + Math.sin(t * 0.55) * 0.12 + (drive.portalGlow > 0.02 ? 0 : 0);
    hero.scale.setScalar(drive.heroScale);

    core.material.opacity = 1;
    lattice.material.opacity = 0.18 * drive.heroFade;
    innerGlow.material.opacity = 0.16 * drive.heroFade + drive.portalGlow * 0.1;
    nodeMat.opacity = 0.9 * drive.heroFade;
    core.material.emissiveIntensity = 0.6 + drive.portalGlow * 1.6;

    /* lighting responds to cursor + section hue shift */
    tmpA.copy(violetA).lerp(violetB, drive.hue * 0.45);
    tmpB.copy(cyanA).lerp(cyanB, drive.hue * 0.4);
    keyViolet.color = tmpA;
    keyCyan.color = tmpB;
    keyViolet.position.x = -5 + mouse.x * 2.4;
    keyViolet.position.y = 3 + mouse.y * 1.8;
    keyViolet.intensity = 90 + drive.portalGlow * 120;
    keyCyan.intensity = 60 + drive.portalGlow * 80;

    /* portal ignition */
    ringA.material.opacity = drive.portalGlow * 0.75;
    ringB.material.opacity = drive.portalGlow * 0.6;
    portal.rotation.z = t * 0.08;
    ringB.rotation.z = -t * 0.14;
    portal.scale.setScalar(0.9 + drive.portalGlow * 0.25);

    particles.rotation.y = t * 0.014;
    particles.position.y = Math.sin(t * 0.25) * 0.25;

    camera.position.z = drive.camZ;
    camera.position.x = mouse.x * 0.28;
    camera.position.y = mouse.y * 0.22;
    camera.lookAt(drive.portalGlow > 0.5 ? portal.position : hero.position);

    renderer.render(scene, camera);
  });
}
