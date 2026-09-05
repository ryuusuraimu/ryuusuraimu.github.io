/**
 * Superr Style — Real M2 MacBook FBX 3D Portfolio
 * Powered by Three.js FBXLoader + PBR Lighting + GSAP ScrollTrigger
 */

document.addEventListener('DOMContentLoaded', () => {
  if (typeof THREE === 'undefined' || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    console.error('Three.js, GSAP, or ScrollTrigger is missing.');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  /* ==========================================================================
     1. Scene, Camera, Renderer Setup
     ========================================================================== */
  const canvas = document.getElementById('three-canvas');
  const stage = document.getElementById('three-stage');
  const badgeText = document.getElementById('badge-text');

  const scene = new THREE.Scene();

  // Perspective camera adjusted for realistic laptop viewing distance
  const camera = new THREE.PerspectiveCamera(40, stage.clientWidth / stage.clientHeight, 0.1, 1000);
  camera.position.set(0, 1.4, 4.2);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance'
  });
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.96;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // Adaptive Camera & Responsive Viewport Handler:
  // Automatically widens FOV on portrait mobile screens so MacBook never clips horizontally
  function updateCameraAspect() {
    const w = stage.clientWidth;
    const h = stage.clientHeight;
    const aspect = w / h;
    camera.aspect = aspect;

    if (aspect < 1.0) {
      // Base desktop reference aspect ~1.45 with fov 40 deg gives half-angle tan = 0.528
      const targetTan = 0.528 / Math.max(aspect, 0.38);
      const adaptiveFov = Math.atan(targetTan) * 2 * (180 / Math.PI);
      camera.fov = Math.min(Math.max(adaptiveFov, 40), 66);
    } else {
      camera.fov = 40;
    }
    camera.updateProjectionMatrix();

    const maxDpr = w <= 860 ? 1.75 : 2.0;
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxDpr));
  }
  updateCameraAspect();

  /* ==========================================================================
     2. Studio Environment & Lighting (Multi-Point HDRI Studio & Edge Sculpting)
     ========================================================================== */
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  pmremGenerator.compileEquirectangularShader();

  const envCanvas = document.createElement('canvas');
  envCanvas.width = 1024;
  envCanvas.height = 512;
  const ectx = envCanvas.getContext('2d');

  // 1. Deep warm darkroom dome background with horizon gradient
  const bgGrad = ectx.createLinearGradient(0, 0, 0, envCanvas.height);
  bgGrad.addColorStop(0.00, '#0a0705');
  bgGrad.addColorStop(0.35, '#120c08');
  bgGrad.addColorStop(0.50, '#1c120a'); // Soft horizon warmth
  bgGrad.addColorStop(0.65, '#140c06');
  bgGrad.addColorStop(1.00, '#0a0603');
  ectx.fillStyle = bgGrad;
  ectx.fillRect(0, 0, envCanvas.width, envCanvas.height);

  // 2. Large Overhead Studio Softbox Array (Diffused warm daylight, 3200K)
  const topSoftbox = ectx.createLinearGradient(0, 30, 0, 130);
  topSoftbox.addColorStop(0.0, 'rgba(0, 0, 0, 0)');
  topSoftbox.addColorStop(0.2, 'rgba(255, 242, 225, 0.45)');
  topSoftbox.addColorStop(0.5, 'rgba(255, 248, 238, 0.70)');
  topSoftbox.addColorStop(0.8, 'rgba(255, 242, 225, 0.45)');
  topSoftbox.addColorStop(1.0, 'rgba(0, 0, 0, 0)');
  ectx.fillStyle = topSoftbox;
  ectx.fillRect(50, 30, envCanvas.width - 100, 100);

  // 3. Front Key Softbox (Sculpting the keyboard deck, palm rests, and top lid)
  const keySoftbox = ectx.createRadialGradient(290, 210, 15, 290, 210, 160);
  keySoftbox.addColorStop(0.0, 'rgba(255, 238, 215, 0.45)');
  keySoftbox.addColorStop(0.4, 'rgba(220, 195, 170, 0.22)');
  keySoftbox.addColorStop(0.8, 'rgba(140, 110, 80, 0.08)');
  keySoftbox.addColorStop(1.0, 'rgba(0, 0, 0, 0)');
  ectx.fillStyle = keySoftbox;
  ectx.fillRect(100, 50, 380, 320);

  // 4. Right Edge Rim Strip (Cooler 5000K crisp white highlight to carve unibody silhouette)
  const rimSoftbox = ectx.createLinearGradient(810, 0, 890, 0);
  rimSoftbox.addColorStop(0.0, 'rgba(0, 0, 0, 0)');
  rimSoftbox.addColorStop(0.5, 'rgba(220, 232, 255, 0.50)');
  rimSoftbox.addColorStop(1.0, 'rgba(0, 0, 0, 0)');
  ectx.fillStyle = rimSoftbox;
  ectx.fillRect(810, 70, 80, 270);

  // 5. Lower Hemisphere Floor & Table Radiosity Bounce (Warm walnut reflection)
  const floorBounce = ectx.createLinearGradient(0, 340, 0, 512);
  floorBounce.addColorStop(0.0, 'rgba(0, 0, 0, 0)');
  floorBounce.addColorStop(0.5, 'rgba(145, 88, 42, 0.28)');
  floorBounce.addColorStop(1.0, 'rgba(60, 34, 16, 0.40)');
  ectx.fillStyle = floorBounce;
  ectx.fillRect(0, 340, envCanvas.width, 172);

  const envTex = new THREE.CanvasTexture(envCanvas);
  envTex.mapping = THREE.EquirectangularReflectionMapping;
  const envRenderTarget = pmremGenerator.fromEquirectangular(envTex);
  scene.environment = envRenderTarget.texture;
  pmremGenerator.dispose();
  envTex.dispose();

  // Studio Lighting (Moody Darkroom Product Photography & Rich Chiaroscuro Contrast):
  // 1. Ambient Light: Deep warm darkroom fill (low base to ensure dramatic contrast & deep blacks)
  const ambientLight = new THREE.AmbientLight(0x22160e, 0.18);
  scene.add(ambientLight);

  // 2. Key Directional Light: Warm focused studio key light with tight frustum for max shadow resolution
  const keyLight = new THREE.DirectionalLight(0xffe4c8, 0.44);
  keyLight.position.set(3.8, 6.8, 3.2);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.width = 2048;
  keyLight.shadow.mapSize.height = 2048;
  keyLight.shadow.camera.left = -3.8;
  keyLight.shadow.camera.right = 3.8;
  keyLight.shadow.camera.top = 3.8;
  keyLight.shadow.camera.bottom = -3.8;
  keyLight.shadow.camera.near = 1.5;
  keyLight.shadow.camera.far = 14.0;
  keyLight.shadow.bias = -0.0004;
  keyLight.shadow.radius = 2.0;
  scene.add(keyLight);

  // 3. Hero Soft Fill: Very subtle warm shadow fill
  const heroFillLight = new THREE.DirectionalLight(0x7a5438, 0.14);
  heroFillLight.position.set(-3.0, 3.5, 2.5);
  scene.add(heroFillLight);

  // 4. Top Rim Light: Crisp edge specular on MacBook unibody & desk bevels
  const topRimLight = new THREE.DirectionalLight(0xffddbe, 0.36);
  topRimLight.position.set(1.0, 6.8, -1.8);
  scene.add(topRimLight);

  // 5. Side Fill Light: Faint ground reflection
  const sideFillLight = new THREE.DirectionalLight(0x3c2414, 0.08);
  sideFillLight.position.set(-5.0, 2.0, 2.0);
  scene.add(sideFillLight);

  /* ==========================================================================
     3. Project Screen & Hardware Textures (Authentic User Lock Screen & Apps)
     ========================================================================== */
  const textureLoader = new THREE.TextureLoader();
  function loadCleanTexture(path) {
    return textureLoader.load(path, t => {
      t.encoding = THREE.sRGBEncoding;
      t.generateMipmaps = true;
      t.minFilter = THREE.LinearMipmapLinearFilter;
      t.magFilter = THREE.LinearFilter;
      t.needsUpdate = true;
    });
  }

  function createShopifyThemeTexture() {
    try {
      const c = document.createElement('canvas');
      c.width = 1024;
      c.height = 665;
      const ctx = c.getContext('2d');
      if (!ctx) return null;

      // IDE Background (VS Code Dark)
      ctx.fillStyle = '#181a1f';
      ctx.fillRect(0, 0, c.width, c.height);

      // Title bar
      ctx.fillStyle = '#21252b';
      ctx.fillRect(0, 0, c.width, 40);

      // Window controls (Red, Yellow, Green macOS traffic lights)
      ctx.fillStyle = '#ff5f56';
      ctx.beginPath(); ctx.arc(22, 20, 6, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#ffbd2e';
      ctx.beginPath(); ctx.arc(42, 20, 6, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#27c93f';
      ctx.beginPath(); ctx.arc(62, 20, 6, 0, Math.PI * 2); ctx.fill();

      // Editor Tab: price.liquid
      ctx.fillStyle = '#181a1f';
      ctx.fillRect(90, 4, 330, 36);
      ctx.fillStyle = '#61afef';
      ctx.font = 'bold 12px monospace';
      ctx.fillText('⚡ price.liquid', 110, 25);
      ctx.fillStyle = '#abb2bf';
      ctx.font = '11.5px sans-serif';
      ctx.fillText('— Commercial Shopify Theme', 200, 24);

      // Freelance Trial Badge top right
      ctx.fillStyle = 'rgba(255, 111, 30, 0.15)';
      ctx.strokeStyle = 'rgba(255, 111, 30, 0.45)';
      ctx.lineWidth = 1;
      if (ctx.roundRect) ctx.roundRect(c.width - 345, 8, 330, 24, 12);
      else ctx.fillRect(c.width - 345, 8, 330, 24);
      ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#ff8c42';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText('★ Paid Freelance Trial ($30/h) · 14 Tasks Verified', c.width - 335, 24);

      // Left Sidebar (File Explorer)
      ctx.fillStyle = '#1e2227';
      ctx.fillRect(0, 40, 230, c.height - 40);
      ctx.fillStyle = '#abb2bf';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText('EXPLORER : SHOPIFY-THEME', 16, 64);

      const files = [
        { name: '▾ layout/', color: '#abb2bf' },
        { name: '    theme.liquid', color: '#61afef' },
        { name: '▾ sections/', color: '#abb2bf' },
        { name: '    main-product.liquid', color: '#61afef' },
        { name: '▾ snippets/', color: '#abb2bf' },
        { name: '  ● price.liquid [Active]', color: '#e5c07b', active: true },
        { name: '    variant-picker.liquid', color: '#61afef' },
        { name: '▾ assets/', color: '#abb2bf' },
        { name: '    theme.css', color: '#e06c75' },
        { name: '    global.js', color: '#d19a66' },
        { name: '▾ docs/', color: '#abb2bf' },
        { name: '    triage-report-en.md', color: '#98c379' },
        { name: '    trial-notion-delivery.md', color: '#c678dd' }
      ];

      let fy = 90;
      files.forEach(f => {
        if (f.active) {
          ctx.fillStyle = '#2c313a';
          ctx.fillRect(0, fy - 14, 230, 22);
        }
        ctx.fillStyle = f.color;
        ctx.font = f.active ? 'bold 11.5px monospace' : '11px monospace';
        ctx.fillText(f.name, 16, fy);
        fy += 22;
      });

      // Main Code Editor Lines
      const codeLines = [
        { num: '01', text: '{%- comment -%}', color: '#5c6370' },
        { num: '02', text: '  Shopify Theme Engineering — Task #08: Variant & Price Sync Fix', color: '#5c6370' },
        { num: '03', text: '  Reported & Resolved by Ryunosuke Nakamura | Verified by PM', color: '#5c6370' },
        { num: '04', text: '{%- endcomment -%}', color: '#5c6370' },
        { num: '05', text: '', color: '' },
        { num: '06', text: '{%- liquid', color: '#c678dd' },
        { num: '07', text: '  assign target_variant = product.selected_or_first_available_variant', color: '#abb2bf' },
        { num: '08', text: '  assign price = target_variant.price', color: '#abb2bf' },
        { num: '09', text: '  assign compare_at_price = target_variant.compare_at_price', color: '#abb2bf' },
        { num: '10', text: '-%}', color: '#c678dd' },
        { num: '11', text: '', color: '' },
        { num: '12', text: '<div class="price price--large" id="price-{{ section.id }}"', color: '#e06c75' },
        { num: '13', text: '     data-instant-variant-sync="true">', color: '#d19a66' },
        { num: '14', text: '  <span class="price-item price-item--regular">', color: '#e06c75' },
        { num: '15', text: '    {{ price | money }}', color: '#98c379' },
        { num: '16', text: '  </span>', color: '#e06c75' },
        { num: '17', text: '  {%- if compare_at_price > price -%}', color: '#c678dd' },
        { num: '18', text: '    <s class="price-item--sale">{{ compare_at_price | money }}</s>', color: '#98c379' },
        { num: '19', text: '  {%- endif -%}', color: '#c678dd' },
        { num: '20', text: '</div>', color: '#e06c75' }
      ];

      let cy = 74;
      codeLines.forEach(l => {
        ctx.fillStyle = '#4b5263';
        ctx.font = '12px monospace';
        ctx.fillText(l.num, 250, cy);

        ctx.fillStyle = l.color || '#abb2bf';
        ctx.font = '13px monospace';
        ctx.fillText(l.text, 285, cy);
        cy += 21;
      });

      // Bottom Terminal Bar (Test Runner & Delivery Log)
      ctx.fillStyle = '#1e2227';
      ctx.fillRect(230, c.height - 150, c.width - 230, 150);
      ctx.strokeStyle = '#282c34';
      ctx.beginPath();
      ctx.moveTo(230, c.height - 150);
      ctx.lineTo(c.width, c.height - 150);
      ctx.stroke();

      ctx.fillStyle = '#abb2bf';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText('TERMINAL : TEST RUNNER & PRODUCT MANAGER VERIFICATION LOG', 250, c.height - 126);

      const testLogs = [
        { text: '✓ PASS  spec/variant_price_sync.spec.js (Mobile & Desktop Price Sync Verified)', color: '#98c379' },
        { text: '✓ PASS  spec/theme_editor_controls.spec.js (Instance-scoped hover & swatch rules applied)', color: '#98c379' },
        { text: '✓ SUMMARY: 14 of 14 tasks completed | 19h 20m logged | Verified by Product Manager', color: '#61afef' }
      ];

      let ty = c.height - 98;
      testLogs.forEach(t => {
        ctx.fillStyle = t.color;
        ctx.font = '12px monospace';
        ctx.fillText(t.text, 250, ty);
        ty += 23;
      });

      const tex = new THREE.CanvasTexture(c);
      tex.encoding = THREE.sRGBEncoding;
      tex.generateMipmaps = true;
      return tex;
    } catch (err) {
      console.warn('Could not generate Shopify Theme canvas texture, fallback to null', err);
      return null;
    }
  }

  const textures = {
    lockScreen: loadCleanTexture('./assets/mac-lockscreen.jpg'),
    anchor: loadCleanTexture('./assets/anchor-xcode-simulator.png'),
    shopify: loadCleanTexture('./assets/moftail-shopify-admin.png'),
    ads: loadCleanTexture('./assets/moftail-meta-ads.png'),
    printify: loadCleanTexture('./assets/moftail-printify.png'),
    shopifyTheme: createShopifyThemeTexture()
  };

  const screenMaterial = new THREE.MeshBasicMaterial({
    map: textures.lockScreen,
    side: THREE.DoubleSide,
    toneMapped: false // Prevents tone mapping wash-out; renders exact 1:1 original screenshot brightness & contrast
  });

  /* ==========================================================================
     4. M2 MacBook Air Midnight PBR Materials & Model Loader
     ========================================================================== */
  const macRoot = new THREE.Group();
  scene.add(macRoot);

  let lidNode = null;
  let screenMesh = null;
  let isModelLoaded = false;
  let mixer = null;
  let openAction = null;

  // Genuine M2 MacBook Air Midnight Material:
  // Authentic bead-blasted anodized aluminum with subtle oxide clearcoat
  const midnightAluminumMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x18202c,
    metalness: 0.82,
    roughness: 0.40,
    clearcoat: 0.15,
    clearcoatRoughness: 0.35,
    envMapIntensity: 1.25
  });

  // Apple Logo: Flush Inset Mirror-Polished Dark Stainless Steel
  // Liquid metal dark titanium mirror finish catching crisp environment reflections
  const appleLogoMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x485872,
    metalness: 1.0,
    roughness: 0.02,
    clearcoat: 0.95,
    clearcoatRoughness: 0.04,
    emissive: 0x142032,
    emissiveIntensity: 0.28,
    envMapIntensity: 1.6
  });

  // Magic Keyboard Keycaps: Pure deep matte jet black PBT plastic
  const keycapMaterial = new THREE.MeshStandardMaterial({
    color: 0x0a0c10,
    roughness: 0.62,
    metalness: 0.02
  });

  // Magic Keyboard Keycap Lettering & Symbols:
  // Crisp Apple San Francisco typography modeled as 3D CAD geometry
  const keyLetteringMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.25,
    metalness: 0.05,
    emissive: 0xffffff,
    emissiveIntensity: 0.35,
    polygonOffset: true,
    polygonOffsetFactor: -1,
    polygonOffsetUnits: -1,
    side: THREE.DoubleSide
  });

  // Touch ID Concentric Ring: Dark specular stainless steel
  const touchIdRingMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x0a0d14,
    metalness: 0.98,
    roughness: 0.05,
    clearcoat: 0.80,
    clearcoatRoughness: 0.10
  });

  // Touch ID Sensor Center
  const touchIdSensorMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x07090e,
    roughness: 0.38,
    metalness: 0.15,
    clearcoat: 0.25,
    clearcoatRoughness: 0.35
  });

  // Keyboard Well & Surround Recess (Deep pitch-black recessed anodized well)
  const keyboardWellMaterial = new THREE.MeshStandardMaterial({
    color: 0x090b10,
    roughness: 0.65,
    metalness: 0.10
  });

  // Trackpad: Etched matte glass in deep Midnight tone matching the unibody
  const trackpadMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x141822,
    roughness: 0.42,
    metalness: 0.15,
    clearcoat: 0.25,
    clearcoatRoughness: 0.30
  });

  // Display Bezel & Notch: Seamless glossy deep black glass & rubber gasket
  const bezelMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x020305, // Deepest pitch black
    roughness: 0.04,
    metalness: 0.10,
    clearcoat: 0.92,
    clearcoatRoughness: 0.08
  });

  // Camera Optics
  const cameraLensMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x050810,
    metalness: 0.95,
    roughness: 0.05,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05
  });

  // Camera Green Indicator LED
  const cameraLedMaterial = new THREE.MeshStandardMaterial({
    color: 0x08150c,
    roughness: 0.6,
    metalness: 0.2
  });

  // Rubber Feet
  const rubberFeetMaterial = new THREE.MeshStandardMaterial({
    color: 0x0d0e11,
    roughness: 0.95,
    metalness: 0.0
  });

  // Hinge Barrel
  const hingeBarrelMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x1b1f28,
    roughness: 0.38,
    metalness: 0.85,
    clearcoat: 0.25,
    clearcoatRoughness: 0.25
  });

  // Natural orientation for M2 MacBook Air:
  // Start screen: closed laptop, dynamic bold presentation, Apple logo facing viewer with leaf pointing UP
  // Natural orientation for M2 MacBook Air & Creator Workspace:
  // Start screen: closed laptop, Apple logo facing viewer with leaf pointing UP, tilted diagonally to the right
  const macState = {
    lidOpen: 0.0,      // 0.0 = closed flush, 1.0 = open to ~112 deg
    rotX: 1.22,        // ~70 deg: faces top lid & Apple logo directly towards the viewer
    rotY: 2.88,        // ~165 deg: leaf points straight UP (+Y), right-side up
    rotZ: -0.26,       // ~-15 deg: right-tilted dynamic diagonal posture
    posX: 0.35,        // Floating in right half of hero section
    posY: 0.38,        // Generously high in the air above future desk position
    cameraZ: 4.10,     // Hero camera view framing floating laptop
    cameraY: 0.40,     // Elevated to view floating laptop
    lookOffsetY: 0.15  // Centered on floating MacBook
  };

  function updateScreenTexture(tex, bounceColor = null) {
    if (screenMaterial && tex) {
      tex.encoding = THREE.sRGBEncoding;
      screenMaterial.map = tex;
      screenMaterial.toneMapped = false;
      screenMaterial.needsUpdate = true;
    }
    if (screenBounceLight && bounceColor) {
      screenBounceLight.color.setHex(bounceColor);
    }
  }

  /* ==========================================================================
     4.5. 3D Creator Work Desk Setup (Amazon Hutch & Pegboard Studio Workspace)
     ========================================================================== */
  const deskGroup = new THREE.Group();
  scene.add(deskGroup);

  const deskState = {
    opacity: 0.0,       // Desk is 100% hidden at first (identical to before)
    posY: -0.65,       // Starts submerged below
    posX: 0.0,
    posZ: 0.0,
    rotX: 0.06,
    rotY: -0.03,
    rotZ: 0.0,
    bounceIntensity: 0.0,
    underShelfLightIntensity: 0.0, // Off at first
    contactShadowOpacity: 0.0
  };

  // Glass materials & room lighting declarations so animate() can reference them
  let clockGlassMat, frameGlassMat;
  let slatCoveLight, slatCoveLightL, slatCoveLightR, slatCoveStripMat;
  let deskRadiosityBounce;

  // Helper 1: Ultra-High-Res Smoked Dark Walnut Wood Grain procedural canvas texture (2048 x 1024)
  function createDarkWalnutTexture() {
    const c = document.createElement('canvas');
    c.width = 2048;
    c.height = 1024;
    const ctx = c.getContext('2d');

    // Rich dark chocolate walnut base gradient
    const baseGrad = ctx.createLinearGradient(0, 0, 0, c.height);
    baseGrad.addColorStop(0, '#22140b');
    baseGrad.addColorStop(0.25, '#170c06');
    baseGrad.addColorStop(0.55, '#24150c');
    baseGrad.addColorStop(0.85, '#130904');
    baseGrad.addColorStop(1, '#1c1008');
    ctx.fillStyle = baseGrad;
    ctx.fillRect(0, 0, c.width, c.height);

    // Multi-frequency organic wood grain fibers (240 passes)
    for (let i = 0; i < 240; i++) {
      const yBase = (i / 240) * c.height;
      const alpha = 0.05 + Math.random() * 0.13;
      const isDark = Math.random() > 0.35;
      ctx.strokeStyle = isDark ? `rgba(8, 4, 1, ${alpha})` : `rgba(88, 54, 29, ${alpha * 0.8})`;
      ctx.lineWidth = 1.0 + Math.random() * 1.6;
      ctx.beginPath();
      ctx.moveTo(0, yBase);
      for (let x = 0; x <= c.width; x += 40) {
        const wave = Math.sin(x * 0.005 + i * 0.28) * 9 +
                     Math.sin(x * 0.014 + i * 0.65) * 4.5 +
                     Math.sin(x * 0.035 + i * 1.1) * 1.8;
        ctx.lineTo(x, yBase + wave);
      }
      ctx.stroke();
    }

    // Prominent natural cathedral grain arches (Growth rings)
    ctx.lineWidth = 2.8;
    ctx.strokeStyle = 'rgba(7, 3, 1, 0.18)';
    [
      { cx: 580, cy: 480, rx: 420, ry: 75, rot: -0.04 },
      { cx: 1480, cy: 540, rx: 480, ry: 85, rot: 0.03 },
      { cx: 960, cy: 380, rx: 320, ry: 60, rot: -0.02 }
    ].forEach(ring => {
      ctx.beginPath();
      ctx.ellipse(ring.cx, ring.cy, ring.rx, ring.ry, ring.rot, 0, Math.PI * 2);
      ctx.stroke();
    });

    // Realistic wood pore speckles
    ctx.fillStyle = 'rgba(5, 2, 1, 0.08)';
    for (let p = 0; p < 800; p++) {
      const px = Math.random() * c.width;
      const py = Math.random() * c.height;
      ctx.fillRect(px, py, 2.5 + Math.random() * 3.5, 1.2);
    }

    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(1.4, 1);
    return tex;
  }

  // Helper 1b: Walnut Roughness Map (satin finish with matte grain grooves)
  function createWalnutRoughnessTexture() {
    const c = document.createElement('canvas');
    c.width = 1024;
    c.height = 512;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#6a6a6a'; // Base satin sheen (~0.42 roughness)
    ctx.fillRect(0, 0, c.width, c.height);

    ctx.lineWidth = 1.4;
    for (let i = 0; i < 90; i++) {
      const y = (i / 90) * c.height;
      ctx.strokeStyle = `rgba(180, 180, 180, ${0.08 + Math.random() * 0.15})`;
      ctx.beginPath();
      ctx.moveTo(0, y);
      for (let x = 0; x <= c.width; x += 32) {
        const wave = Math.sin(x * 0.008 + i * 0.3) * 6 + Math.sin(x * 0.02 + i * 0.7) * 2.5;
        ctx.lineTo(x, y + wave);
      }
      ctx.stroke();
    }
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(1.4, 1);
    return tex;
  }

  // Helper 1bb: Smoked Dark Walnut Wood Grain Micro-Pore Normal Map (1024 x 512)
  function createWalnutNormalTexture() {
    const w = 1024, h = 512;
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    const ctx = c.getContext('2d');
    const imgData = ctx.createImageData(w, h);
    const data = imgData.data;

    const height = new Float32Array(w * h);
    for (let i = 0; i < 90; i++) {
      const y0 = Math.floor((i / 90) * h);
      const freq1 = 0.006 + (i % 5) * 0.002;
      const freq2 = 0.022 + (i % 7) * 0.003;
      const amp = 0.45;
      for (let x = 0; x < w; x++) {
        const offset = Math.sin(x * freq1 + i * 0.4) * 8.0 + Math.sin(x * freq2 + i * 0.9) * 3.0;
        const py = Math.min(h - 1, Math.max(0, Math.round(y0 + offset)));
        height[py * w + x] += amp;
        if (py + 1 < h) height[(py + 1) * w + x] += amp * 0.5;
        if (py - 1 >= 0) height[(py - 1) * w + x] += amp * 0.5;
      }
    }

    const scale = 2.4;
    for (let y = 0; y < h; y++) {
      const yPrev = (y === 0 ? h - 1 : y - 1) * w;
      const yNext = (y === h - 1 ? 0 : y + 1) * w;
      const yCurr = y * w;
      for (let x = 0; x < w; x++) {
        const xPrev = x === 0 ? w - 1 : x - 1;
        const xNext = x === w - 1 ? 0 : x + 1;
        const dx = (height[yCurr + xNext] - height[yCurr + xPrev]) * scale;
        const dy = (height[yNext + x] - height[yPrev + x]) * scale;
        const dz = 1.0;
        const len = Math.hypot(dx, dy, dz);
        const idx = (y * w + x) * 4;
        data[idx] = Math.round(((dx / len) * 0.5 + 0.5) * 255);
        data[idx + 1] = Math.round(((-dy / len) * 0.5 + 0.5) * 255);
        data[idx + 2] = Math.round(((dz / len) * 0.5 + 0.5) * 255);
        data[idx + 3] = 255;
      }
    }
    ctx.putImageData(imgData, 0, 0);
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(1.4, 1);
    return tex;
  }

  // Helper 1e: Full-Grain Vegetable-Tanned Saddle Leather Base Color (512 x 512)
  function createLeatherTexture() {
    const w = 512, h = 512;
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    const ctx = c.getContext('2d');

    ctx.fillStyle = '#22140a';
    ctx.fillRect(0, 0, w, h);

    for (let i = 0; i < 45; i++) {
      const rx = Math.random() * w;
      const ry = Math.random() * h;
      const r = 25 + Math.random() * 60;
      const grad = ctx.createRadialGradient(rx, ry, 0, rx, ry, r);
      grad.addColorStop(0, Math.random() > 0.5 ? 'rgba(42, 25, 14, 0.18)' : 'rgba(20, 11, 6, 0.22)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(rx, ry, r, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = 'rgba(12, 6, 3, 0.12)';
    for (let p = 0; p < 2400; p++) {
      ctx.fillRect(Math.random() * w, Math.random() * h, 1.2, 1.2);
    }

    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(2.4, 2.4);
    return tex;
  }

  // Helper 1f: Full-Grain Leather Micro-Pebble & Pore Normal Map (512 x 512)
  function createLeatherNormalTexture() {
    const w = 512, h = 512;
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    const ctx = c.getContext('2d');
    const imgData = ctx.createImageData(w, h);
    const data = imgData.data;

    const height = new Float32Array(w * h);
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const n1 = Math.sin(x * 0.14) * Math.cos(y * 0.14);
        const n2 = Math.sin(x * 0.32 + 1.2) * Math.cos(y * 0.32 + 0.8) * 0.5;
        const n3 = Math.sin(x * 0.75 + 2.4) * Math.cos(y * 0.75 + 1.9) * 0.25;
        height[y * w + x] = n1 + n2 + n3;
      }
    }

    const scale = 1.8;
    for (let y = 0; y < h; y++) {
      const yPrev = (y === 0 ? h - 1 : y - 1) * w;
      const yNext = (y === h - 1 ? 0 : y + 1) * w;
      const yCurr = y * w;
      for (let x = 0; x < w; x++) {
        const xPrev = x === 0 ? w - 1 : x - 1;
        const xNext = x === w - 1 ? 0 : x + 1;
        const dx = (height[yCurr + xNext] - height[yCurr + xPrev]) * scale;
        const dy = (height[yNext + x] - height[yPrev + x]) * scale;
        const dz = 1.0;
        const len = Math.hypot(dx, dy, dz);
        const idx = (y * w + x) * 4;
        data[idx] = Math.round(((dx / len) * 0.5 + 0.5) * 255);
        data[idx + 1] = Math.round(((-dy / len) * 0.5 + 0.5) * 255);
        data[idx + 2] = Math.round(((dz / len) * 0.5 + 0.5) * 255);
        data[idx + 3] = 255;
      }
    }
    ctx.putImageData(imgData, 0, 0);
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(2.4, 2.4);
    return tex;
  }

  // Helper 1g: Matte Powder-Coated Cast Steel Micro-Stipple Normal Map (256 x 256)
  function createStippleNormalTexture() {
    const w = 256, h = 256;
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    const ctx = c.getContext('2d');
    const imgData = ctx.createImageData(w, h);
    const data = imgData.data;

    for (let i = 0; i < w * h; i++) {
      const nx = (Math.random() - 0.5) * 0.22;
      const ny = (Math.random() - 0.5) * 0.22;
      const nz = 1.0;
      const len = Math.hypot(nx, ny, nz);
      const idx = i * 4;
      data[idx] = Math.round(((nx / len) * 0.5 + 0.5) * 255);
      data[idx + 1] = Math.round(((ny / len) * 0.5 + 0.5) * 255);
      data[idx + 2] = Math.round(((nz / len) * 0.5 + 0.5) * 255);
      data[idx + 3] = 255;
    }
    ctx.putImageData(imgData, 0, 0);
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(6, 6);
    return tex;
  }

  // Helper 1h: Concentric Spun-Brushed Metal Normal Map (512 x 512)
  function createSpunMetalNormalTexture() {
    const w = 512, h = 512;
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    const ctx = c.getContext('2d');
    const imgData = ctx.createImageData(w, h);
    const data = imgData.data;

    const cx = w / 2, cy = h / 2;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const dx = x - cx;
        const dy = y - cy;
        const r = Math.hypot(dx, dy);
        const angle = Math.atan2(dy, dx);
        const wave = Math.sin(r * 1.8 + Math.cos(angle * 8) * 0.5) * 0.25;
        const nx = -Math.sin(angle) * wave;
        const ny = Math.cos(angle) * wave;
        const nz = 1.0;
        const len = Math.hypot(nx, ny, nz);
        const idx = (y * w + x) * 4;
        data[idx] = Math.round(((nx / len) * 0.5 + 0.5) * 255);
        data[idx + 1] = Math.round(((-ny / len) * 0.5 + 0.5) * 255);
        data[idx + 2] = Math.round(((nz / len) * 0.5 + 0.5) * 255);
        data[idx + 3] = 255;
      }
    }
    ctx.putImageData(imgData, 0, 0);
    const tex = new THREE.CanvasTexture(c);
    return tex;
  }

  // Helper 1c: Architectural Oak Slat procedural canvas texture (vertical battens)
  function createSlatWoodTexture() {
    const c = document.createElement('canvas');
    c.width = 512;
    c.height = 1024;
    const ctx = c.getContext('2d');

    // Rich warm golden-teak / dark amber oak base tone
    ctx.fillStyle = '#6e4c2e';
    ctx.fillRect(0, 0, c.width, c.height);

    // Subtle vertical grain stripes
    for (let i = 0; i < 140; i++) {
      const x = (i / 140) * c.width;
      ctx.lineWidth = 1.0 + Math.random() * 2.2;
      ctx.strokeStyle = `rgba(38, 22, 10, ${0.12 + Math.random() * 0.16})`;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      for (let y = 0; y <= c.height; y += 32) {
        const wave = Math.sin(y * 0.012 + i * 0.4) * 3.5;
        ctx.lineTo(x + wave, y);
      }
      ctx.stroke();
    }

    // Natural wood pore speckles
    ctx.fillStyle = 'rgba(25, 14, 6, 0.12)';
    for (let p = 0; p < 500; p++) {
      ctx.fillRect(Math.random() * c.width, Math.random() * c.height, 1.5, 3.5);
    }

    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  }

  // Helper 1d: Nordic Smoked Oak Plank Hardwood Floor procedural canvas texture (1024x1024)
  function createHardwoodFloorTexture() {
    const c = document.createElement('canvas');
    c.width = 1024;
    c.height = 1024;
    const ctx = c.getContext('2d');

    // Rich, moody dark Scandinavian smoked oak base tone
    ctx.fillStyle = '#261b12';
    ctx.fillRect(0, 0, c.width, c.height);

    const plankCount = 8;
    const plankWidth = c.width / plankCount;
    const plankLength = c.height / 3;

    // Render individual planks with subtle tone shifts and fine longitudinal wood grain
    for (let i = 0; i < plankCount; i++) {
      const px = i * plankWidth;
      const stagger = (i % 2 === 0) ? 0 : plankLength * 0.5;

      for (let r = -1; r < 4; r++) {
        const py = r * plankLength + stagger;
        const toneVar = Math.sin(i * 3.7 + r * 5.1) * 0.08;
        if (toneVar > 0) {
          ctx.fillStyle = `rgba(140, 100, 70, ${toneVar * 0.6})`;
        } else {
          ctx.fillStyle = `rgba(0, 0, 0, ${-toneVar * 0.8})`;
        }
        ctx.fillRect(px, py, plankWidth, plankLength);

        // Plank bevel edge seams (subtle dark groove)
        ctx.fillStyle = '#100a06';
        ctx.fillRect(px, py + plankLength - 2, plankWidth, 2);
      }

      // Vertical plank seam groove
      ctx.fillStyle = '#0c0704';
      ctx.fillRect(px + plankWidth - 2, 0, 2, c.height);

      // Fine oak grain inside this plank
      for (let g = 0; g < 18; g++) {
        const gx = px + (g / 18) * plankWidth;
        ctx.lineWidth = 1.0;
        ctx.strokeStyle = 'rgba(15, 8, 4, 0.15)';
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        for (let y = 0; y <= c.height; y += 40) {
          const wave = Math.sin(y * 0.008 + g) * 2.0;
          ctx.lineTo(gx + wave, y);
        }
        ctx.stroke();
      }
    }

    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(4, 4);
    return tex;
  }

  // Helper 2: Perforated Pegboard procedural canvas texture
  function createPegboardTexture() {
    const c = document.createElement('canvas');
    c.width = 512;
    c.height = 512;
    const ctx = c.getContext('2d');

    // Dark charcoal metal base
    ctx.fillStyle = '#1e2126';
    ctx.fillRect(0, 0, c.width, c.height);

    // Fine metallic surface noise
    const imgData = ctx.getImageData(0, 0, c.width, c.height);
    for (let i = 0; i < imgData.data.length; i += 4) {
      const n = (Math.random() - 0.5) * 12;
      imgData.data[i] = Math.min(255, Math.max(0, imgData.data[i] + n));
      imgData.data[i + 1] = Math.min(255, Math.max(0, imgData.data[i + 1] + n));
      imgData.data[i + 2] = Math.min(255, Math.max(0, imgData.data[i + 2] + n));
    }
    ctx.putImageData(imgData, 0, 0);

    // Regular grid of stamped holes
    const spacing = 32;
    const radius = 5.2;
    for (let y = spacing / 2; y < c.height; y += spacing) {
      for (let x = spacing / 2; x < c.width; x += spacing) {
        // Outer hole rim / bevel highlight
        ctx.fillStyle = 'rgba(255, 235, 210, 0.12)';
        ctx.beginPath();
        ctx.arc(x, y + 0.8, radius + 0.6, 0, Math.PI * 2);
        ctx.fill();

        // Dark hole interior shadow
        ctx.fillStyle = '#0a0c0f';
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(7, 3);
    return tex;
  }

  // Helper 3: Braun Minimalist Analog Clock Dial Face (512x512)
  function createBraunClockDialTexture() {
    const c = document.createElement('canvas');
    c.width = 512;
    c.height = 512;
    const ctx = c.getContext('2d');
    const cx = 256, cy = 256, radius = 230;

    // Warm Bauhaus off-white dial face
    ctx.fillStyle = '#f6f3eb';
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();

    // Subtle dial inner vignette shadow
    const dialGrad = ctx.createRadialGradient(cx, cy, radius * 0.75, cx, cy, radius);
    dialGrad.addColorStop(0, 'rgba(0,0,0,0)');
    dialGrad.addColorStop(1, 'rgba(0,0,0,0.12)');
    ctx.fillStyle = dialGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();

    // 60 tick marks (12 bold hour markers, 48 fine minute markers)
    for (let i = 0; i < 60; i++) {
      const angle = (i / 60) * Math.PI * 2 - Math.PI / 2;
      const isHour = i % 5 === 0;
      const rOuter = radius - 16;
      const rInner = isHour ? radius - 38 : radius - 26;

      ctx.lineWidth = isHour ? 6.5 : 2.2;
      ctx.strokeStyle = isHour ? '#141517' : '#82858b';
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(angle) * rInner, cy + Math.sin(angle) * rInner);
      ctx.lineTo(cx + Math.cos(angle) * rOuter, cy + Math.sin(angle) * rOuter);
      ctx.stroke();
    }

    // Clean typography
    ctx.fillStyle = '#3a3c42';
    ctx.font = '600 18px -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('DESIGN SPEC', cx, cy - 72);

    ctx.fillStyle = '#7a7c82';
    ctx.font = '400 13px -apple-system, sans-serif';
    ctx.fillText('GERMAN CRAFT', cx, cy + 88);

    const tex = new THREE.CanvasTexture(c);
    return tex;
  }

  // Helper 4: Hardcover Book Spines with Gold/Silver Foil Stamp
  function createBookSpineTexture(title, baseColorHex, foilColorHex = '#d4af37') {
    const c = document.createElement('canvas');
    c.width = 128;
    c.height = 512;
    const ctx = c.getContext('2d');

    // Textured bookcloth base
    ctx.fillStyle = baseColorHex;
    ctx.fillRect(0, 0, c.width, c.height);

    // Fine bookcloth weave noise
    const imgData = ctx.getImageData(0, 0, c.width, c.height);
    for (let i = 0; i < imgData.data.length; i += 4) {
      const n = (Math.random() - 0.5) * 16;
      imgData.data[i] = Math.min(255, Math.max(0, imgData.data[i] + n));
      imgData.data[i + 1] = Math.min(255, Math.max(0, imgData.data[i + 1] + n));
      imgData.data[i + 2] = Math.min(255, Math.max(0, imgData.data[i + 2] + n));
    }
    ctx.putImageData(imgData, 0, 0);

    // Spine head and tail embossed ribbing
    ctx.strokeStyle = foilColorHex;
    ctx.lineWidth = 2.5;
    [32, 42, 470, 480].forEach(y => {
      ctx.beginPath();
      ctx.moveTo(18, y);
      ctx.lineTo(c.width - 18, y);
      ctx.stroke();
    });

    // Vertical foil stamped book title
    ctx.save();
    ctx.translate(c.width / 2, c.height / 2);
    ctx.rotate(Math.PI / 2);
    ctx.fillStyle = foilColorHex;
    ctx.font = '700 18px -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(title, 0, 6);
    ctx.restore();

    const tex = new THREE.CanvasTexture(c);
    return tex;
  }

  // Helper 5: Tactile felt micro-noise bump map
  function createFeltNoiseTexture() {
    const c = document.createElement('canvas');
    c.width = 512;
    c.height = 512;
    const ctx = c.getContext('2d');
    const imgData = ctx.createImageData(512, 512);
    for (let i = 0; i < imgData.data.length; i += 4) {
      const v = 115 + Math.floor(Math.random() * 32);
      imgData.data[i] = v;
      imgData.data[i + 1] = v;
      imgData.data[i + 2] = 255;
      imgData.data[i + 3] = 255;
    }
    ctx.putImageData(imgData, 0, 0);
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(24, 16);
    return tex;
  }

  // Helper 6: Soft contact shadow radial gradient
  function createContactShadowTexture() {
    const c = document.createElement('canvas');
    c.width = 512;
    c.height = 512;
    const ctx = c.getContext('2d');
    const g = ctx.createRadialGradient(256, 256, 60, 256, 256, 248);
    g.addColorStop(0, 'rgba(0, 0, 0, 0.96)');
    g.addColorStop(0.35, 'rgba(0, 0, 0, 0.70)');
    g.addColorStop(0.70, 'rgba(0, 0, 0, 0.25)');
    g.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 512, 512);
    const tex = new THREE.CanvasTexture(c);
    return tex;
  }

  // Rounded rectangle shape helper
  function createRoundedRectShape(w, h, r) {
    const shape = new THREE.Shape();
    const x = -w / 2;
    const y = -h / 2;
    shape.moveTo(x, y + r);
    shape.lineTo(x, y + h - r);
    shape.quadraticCurveTo(x, y + h, x + r, y + h);
    shape.lineTo(x + w - r, y + h);
    shape.quadraticCurveTo(x + w, y + h, x + w, y + h - r);
    shape.lineTo(x + w, y + r);
    shape.quadraticCurveTo(x + w, y, x + w - r, y);
    shape.lineTo(x + r, y);
    shape.quadraticCurveTo(x, y, x, y + r);
    return shape;
  }

  /* --- 1. Standing Desk Steel Frame & Beveled Tabletop --- */
  const steelStippleNormalTex = createStippleNormalTexture();

  const steelLegMaterial = new THREE.MeshStandardMaterial({
    color: 0x121316,
    roughness: 0.48,
    metalness: 0.75,
    normalMap: steelStippleNormalTex,
    normalScale: new THREE.Vector2(0.20, 0.20)
  });

  const walnutTex = createDarkWalnutTexture();
  const walnutRoughnessTex = createWalnutRoughnessTexture();
  const walnutNormalTex = createWalnutNormalTexture();

  const deskSurfaceMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x24160e,
    map: walnutTex,
    roughnessMap: walnutRoughnessTex,
    normalMap: walnutNormalTex,
    normalScale: new THREE.Vector2(0.35, 0.35),
    roughness: 0.52,
    metalness: 0.04,
    clearcoat: 0.28,
    clearcoatRoughness: 0.38,
    envMapIntensity: 0.95
  });

  // Expansive standing desk tabletop with beveled bullnose edges
  const deskTopShape = createRoundedRectShape(6.6, 2.9, 0.12);
  const deskTopGeo = new THREE.ExtrudeGeometry(deskTopShape, {
    depth: 0.08,
    bevelEnabled: true,
    bevelSegments: 4,
    steps: 1,
    bevelSize: 0.014,
    bevelThickness: 0.012
  });
  deskTopGeo.rotateX(-Math.PI / 2);

  const deskSurfaceMesh = new THREE.Mesh(deskTopGeo, deskSurfaceMaterial);
  deskSurfaceMesh.position.set(0, -0.140, -0.15);
  deskSurfaceMesh.receiveShadow = true;
  deskGroup.add(deskSurfaceMesh);

  // Left & Right Standing Desk Legs (Dual motor columns & feet)
  [-2.5, 2.5].forEach(x => {
    const legMesh = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.80, 0.18), steelLegMaterial);
    legMesh.position.set(x, -0.99, -0.20);
    legMesh.castShadow = true;
    legMesh.receiveShadow = true;
    deskGroup.add(legMesh);

    const footMesh = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.08, 1.70), steelLegMaterial);
    footMesh.position.set(x, -1.85, -0.20);
    footMesh.receiveShadow = true;
    deskGroup.add(footMesh);
  });

  /* --- 2. Hutch Back Pegboard & Upper 2-Tier Shelves --- */
  const pegboardTex = createPegboardTexture();
  const pegboardMaterial = new THREE.MeshStandardMaterial({
    map: pegboardTex,
    roughness: 0.72,
    metalness: 0.30
  });
  const pegboardMesh = new THREE.Mesh(new THREE.BoxGeometry(4.70, 1.95, 0.04), pegboardMaterial);
  pegboardMesh.position.set(0, 0.935, -1.48);
  pegboardMesh.receiveShadow = true;
  deskGroup.add(pegboardMesh);

  // Side Vertical Uprights (Supporting shelves and pegboard)
  const uprightMaterial = new THREE.MeshStandardMaterial({
    color: 0x181a1e,
    metalness: 0.85,
    roughness: 0.38,
    normalMap: steelStippleNormalTex,
    normalScale: new THREE.Vector2(0.18, 0.18)
  });
  [-2.38, 2.38].forEach(x => {
    const uprightMesh = new THREE.Mesh(new THREE.BoxGeometry(0.10, 3.10, 0.48), uprightMaterial);
    uprightMesh.position.set(x, 1.48, -1.35);
    uprightMesh.castShadow = true;
    uprightMesh.receiveShadow = true;
    deskGroup.add(uprightMesh);
  });

  // Lower & Upper Shelves
  const shelfMaterial = new THREE.MeshStandardMaterial({
    color: 0x131519,
    roughness: 0.52,
    metalness: 0.45,
    normalMap: steelStippleNormalTex,
    normalScale: new THREE.Vector2(0.15, 0.15)
  });

  const lowerShelfMesh = new THREE.Mesh(new THREE.BoxGeometry(4.76, 0.06, 0.50), shelfMaterial);
  lowerShelfMesh.position.set(0, 1.93, -1.35);
  lowerShelfMesh.castShadow = true;
  lowerShelfMesh.receiveShadow = true;
  deskGroup.add(lowerShelfMesh);

  const upperShelfMesh = new THREE.Mesh(new THREE.BoxGeometry(4.76, 0.06, 0.50), shelfMaterial);
  upperShelfMesh.position.set(0, 2.65, -1.35);
  upperShelfMesh.castShadow = true;
  upperShelfMesh.receiveShadow = true;
  deskGroup.add(upperShelfMesh);

  // Shelf back lips
  [1.93, 2.65].forEach(y => {
    const lipMesh = new THREE.Mesh(new THREE.BoxGeometry(4.68, 0.28, 0.025), uprightMaterial);
    lipMesh.position.set(0, y + 0.14, -1.58);
    deskGroup.add(lipMesh);
  });

  /* --- 3. Under-Shelf Warm Indirect LED Strip Lighting --- */
  const underShelfStripGeo = new THREE.PlaneGeometry(4.4, 0.025);
  underShelfStripGeo.rotateX(Math.PI / 2);
  const underShelfStripMat = new THREE.MeshStandardMaterial({
    color: 0x0c0a08,
    emissive: 0xff9933,
    emissiveIntensity: 0.0,
    roughness: 0.35,
    metalness: 0.1
  });
  const underShelfStripMesh = new THREE.Mesh(underShelfStripGeo, underShelfStripMat);
  underShelfStripMesh.position.set(0, 1.895, -1.35);
  deskGroup.add(underShelfStripMesh);

  // Focused golden amber pool of light on the workstation (2400K incandescent mood)
  const underShelfLight = new THREE.SpotLight(0xffaa48, 0.0, 5.2, Math.PI / 2.8, 0.90, 1.8);
  underShelfLight.position.set(0, 1.88, -1.30);
  underShelfLight.castShadow = true;
  underShelfLight.shadow.mapSize.width = 1024;
  underShelfLight.shadow.mapSize.height = 1024;
  underShelfLight.shadow.bias = -0.001;
  underShelfLight.shadow.radius = 2.5;

  const underShelfTarget = new THREE.Object3D();
  underShelfTarget.position.set(0, 0.35, -0.90);
  deskGroup.add(underShelfTarget);
  underShelfLight.target = underShelfTarget;
  deskGroup.add(underShelfLight);

  // Rich warm amber ambient desk fill with gentle local radius
  const deskWarmAmbience = new THREE.PointLight(0xff8828, 0.0, 4.2, 2.0);
  deskWarmAmbience.position.set(0, 1.78, -0.85);
  deskGroup.add(deskWarmAmbience);

  // Upward indirect warm radiosity bounce from the illuminated walnut desk
  deskRadiosityBounce = new THREE.PointLight(0xff9438, 0.0, 3.4, 2.0);
  deskRadiosityBounce.position.set(0, 0.15, -0.40);
  deskGroup.add(deskRadiosityBounce);

  /* --- 4. Curated Pegboard & Shelf Accessories --- */
  // Studio Monitor Over-Ear Headphones on Pegboard Hook (Left)
  const headphoneGroup = new THREE.Group();
  const spunMetalNormalTex = createSpunMetalNormalTexture();

  const hpSilverMat = new THREE.MeshPhysicalMaterial({
    color: 0xd8dade,
    metalness: 0.90,
    roughness: 0.20,
    clearcoat: 0.35,
    clearcoatRoughness: 0.25
  });
  const hpSpunCapMat = new THREE.MeshPhysicalMaterial({
    color: 0xbcbfc4,
    metalness: 0.96,
    roughness: 0.16,
    normalMap: spunMetalNormalTex,
    normalScale: new THREE.Vector2(0.40, 0.40),
    clearcoat: 0.50,
    clearcoatRoughness: 0.20
  });
  const hpPadMat = new THREE.MeshStandardMaterial({
    color: 0x151619,
    roughness: 0.78,
    metalness: 0.04
  });
  const hpBandMat = new THREE.MeshStandardMaterial({
    color: 0x24262b,
    roughness: 0.68
  });

  // Pegboard retention hook for studio headphones (solid support cantilever)
  const hookMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.009, 0.009, 0.16, 16), uprightMaterial);
  hookMesh.rotateX(Math.PI / 2);
  hookMesh.position.set(-1.30, 1.16, -1.40);
  deskGroup.add(hookMesh);

  const hookLip = new THREE.Mesh(new THREE.CylinderGeometry(0.009, 0.009, 0.035, 16), uprightMaterial);
  hookLip.position.set(-1.30, 1.175, -1.32);
  deskGroup.add(hookLip);

  // Arched Headband: inner apex rests directly on top of hook (y = 1.169), seamless solid join
  const headbandMesh = new THREE.Mesh(new THREE.TorusGeometry(0.160, 0.015, 12, 32, Math.PI), hpBandMat);
  headbandMesh.position.set(-1.30, 1.024, -1.34);
  headphoneGroup.add(headbandMesh);

  // Dual stainless steel slider rods & sculpted earcups (0mm gap, seamless mechanical joints)
  [-0.160, 0.160].forEach(xOff => {
    // Slider rod: top enters directly into headband tube ends at y = 1.024 with zero gap
    const sliderRod = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.080, 12), hpSilverMat);
    sliderRod.position.set(-1.30 + xOff, 0.984, -1.34);
    sliderRod.castShadow = true;
    headphoneGroup.add(sliderRod);

    // Aluminum wishbone gimbal yoke: top apex joins slider rod at y = 0.944 with zero gap
    const yokeMesh = new THREE.Mesh(new THREE.TorusGeometry(0.065, 0.006, 8, 24, Math.PI), hpSilverMat);
    yokeMesh.rotateZ(Math.PI);
    yokeMesh.position.set(-1.30 + xOff, 0.944, -1.34);
    yokeMesh.castShadow = true;
    headphoneGroup.add(yokeMesh);

    // Sculpted Aluminum Earcup: pivot axis at y = 0.879
    const cupOuter = new THREE.Mesh(new THREE.CylinderGeometry(0.088, 0.088, 0.038, 32), hpSilverMat);
    cupOuter.rotateZ(Math.PI / 2);
    cupOuter.position.set(-1.30 + xOff, 0.879, -1.34);
    cupOuter.castShadow = true;
    headphoneGroup.add(cupOuter);

    // Spun aluminum radial reflection cap (outer side)
    const cupCap = new THREE.Mesh(new THREE.CircleGeometry(0.082, 32), hpSpunCapMat);
    cupCap.rotateY(xOff > 0 ? Math.PI / 2 : -Math.PI / 2);
    cupCap.position.set(-1.30 + xOff + (xOff > 0 ? 0.020 : -0.020), 0.879, -1.34);
    headphoneGroup.add(cupCap);

    // Memory foam leather cushion (inner side)
    const cupCushion = new THREE.Mesh(new THREE.TorusGeometry(0.065, 0.022, 14, 28), hpPadMat);
    cupCushion.rotateY(Math.PI / 2);
    cupCushion.position.set(-1.30 + xOff + (xOff > 0 ? -0.014 : 0.014), 0.879, -1.34);
    headphoneGroup.add(cupCushion);
  });
  headphoneGroup.castShadow = true;
  deskGroup.add(headphoneGroup);

  // --- Pegboard Accessory: Folded Steel Utility Caddy & Creator Stationery ---
  // Positioned at x = -1.82, ensuring a generous 18cm gap from the headphone (no collision)
  const caddyGroup = new THREE.Group();
  caddyGroup.position.set(-1.82, 0.88, -1.37);

  const caddyMat = new THREE.MeshStandardMaterial({
    color: 0x16181d,
    roughness: 0.42,
    metalness: 0.78,
    normalMap: steelStippleNormalTex,
    normalScale: new THREE.Vector2(0.22, 0.22)
  });

  // Folded steel tray base (y = 0, top face is at y = +0.006)
  const caddyBase = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.012, 0.12), caddyMat);
  caddyBase.castShadow = true;
  caddyBase.receiveShadow = true;
  caddyGroup.add(caddyBase);

  const caddyFrontLip = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.10, 0.010), caddyMat);
  caddyFrontLip.position.set(0, 0.05, 0.055);
  caddyFrontLip.castShadow = true;
  caddyFrontLip.receiveShadow = true;
  caddyGroup.add(caddyFrontLip);

  const caddyBackLip = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.14, 0.010), caddyMat);
  caddyBackLip.position.set(0, 0.07, -0.055);
  caddyBackLip.castShadow = true;
  caddyBackLip.receiveShadow = true;
  caddyGroup.add(caddyBackLip);

  [-0.165, 0.165].forEach(x => {
    const caddySide = new THREE.Mesh(new THREE.BoxGeometry(0.010, 0.10, 0.12), caddyMat);
    caddySide.position.set(x, 0.05, 0);
    caddySide.castShadow = true;
    caddySide.receiveShadow = true;
    caddyGroup.add(caddySide);
  });

  // Rear steel mounting hooks penetrating into pegboard holes
  [-0.12, 0.12].forEach(x => {
    const hook = new THREE.Mesh(new THREE.CylinderGeometry(0.007, 0.007, 0.09, 12), uprightMaterial);
    hook.rotateX(Math.PI / 2);
    hook.position.set(x, 0.10, -0.080);
    hook.castShadow = true;
    caddyGroup.add(hook);
  });

  // Stationery Item 1: Apple Pencil (2nd Gen) - Grounded inside tray (y = 0.008, zero bottom penetration)
  const applePencilGroup = new THREE.Group();
  const pencilMatWhite = new THREE.MeshStandardMaterial({ color: 0xf4f4f6, roughness: 0.32 });
  const pencilMatTip = new THREE.MeshStandardMaterial({ color: 0xe0e0e2, roughness: 0.45 });
  const pencilMatRing = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.9, roughness: 0.2 });

  const apBody = new THREE.Mesh(new THREE.CylinderGeometry(0.0085, 0.0085, 0.24, 24), pencilMatWhite);
  apBody.position.y = 0.12;
  apBody.castShadow = true;
  applePencilGroup.add(apBody);

  const apTip = new THREE.Mesh(new THREE.ConeGeometry(0.0085, 0.024, 24), pencilMatTip);
  apTip.position.y = 0.252;
  applePencilGroup.add(apTip);

  const apRing = new THREE.Mesh(new THREE.CylinderGeometry(0.0087, 0.0087, 0.005, 24), pencilMatRing);
  apRing.position.y = 0.035;
  applePencilGroup.add(apRing);

  applePencilGroup.position.set(-0.08, 0.008, 0.01);
  applePencilGroup.rotation.z = -0.09;
  applePencilGroup.rotation.x = 0.06;
  applePencilGroup.castShadow = true;
  caddyGroup.add(applePencilGroup);

  // Stationery Item 2: Rotring 600 Technical Drafting Pencil - Grounded inside tray (zero bottom penetration)
  const rotringGroup = new THREE.Group();
  const rotringMatBlack = new THREE.MeshStandardMaterial({ color: 0x111215, roughness: 0.55, metalness: 0.65 });
  const rotringMatRed = new THREE.MeshStandardMaterial({ color: 0xdd1133, roughness: 0.4 });
  const rotringMatChrome = new THREE.MeshStandardMaterial({ color: 0xd5d8de, metalness: 0.95, roughness: 0.15 });

  const rBody = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.23, 6), rotringMatBlack);
  rBody.position.y = 0.115;
  rBody.castShadow = true;
  rotringGroup.add(rBody);

  const rRedRing = new THREE.Mesh(new THREE.CylinderGeometry(0.0084, 0.0084, 0.004, 16), rotringMatRed);
  rRedRing.position.y = 0.205;
  rotringGroup.add(rRedRing);

  const rKnurl = new THREE.Mesh(new THREE.CylinderGeometry(0.0082, 0.0082, 0.045, 16), rotringMatBlack);
  rKnurl.position.y = 0.228;
  rotringGroup.add(rKnurl);

  const rLeadPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.0018, 0.0018, 0.020, 12), rotringMatChrome);
  rLeadPipe.position.y = 0.258;
  rotringGroup.add(rLeadPipe);

  rotringGroup.position.set(0.01, 0.008, 0.01);
  rotringGroup.rotation.z = 0.07;
  rotringGroup.rotation.x = -0.05;
  rotringGroup.castShadow = true;
  caddyGroup.add(rotringGroup);

  // Stationery Item 3: Machined Aluminum 15cm Architect's Ruler - Grounded inside tray (zero bottom penetration)
  const rulerMat = new THREE.MeshStandardMaterial({ color: 0xc4c7cc, metalness: 0.92, roughness: 0.25 });
  const rulerMesh = new THREE.Mesh(new THREE.BoxGeometry(0.004, 0.24, 0.026), rulerMat);
  rulerMesh.position.set(0.09, 0.128, 0.00);
  rulerMesh.rotation.z = 0.12;
  rulerMesh.rotation.x = 0.04;
  rulerMesh.castShadow = true;
  caddyGroup.add(rulerMesh);

  deskGroup.add(caddyGroup);

  // --- Curated Hardcover Books on Lower & Upper Shelves ---
  const bookShelfGroup = new THREE.Group();
  const paperCoreMat = new THREE.MeshStandardMaterial({ color: 0xf5ede2, roughness: 0.88 });

  // Minimalist L-shaped heavy steel bookend on lower shelf
  const bookendMat = new THREE.MeshStandardMaterial({ color: 0x141618, metalness: 0.85, roughness: 0.32 });
  const bookendBottom = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.008, 0.28), bookendMat);
  bookendBottom.position.set(-2.03, 1.964, -1.34);
  bookShelfGroup.add(bookendBottom);
  const bookendUpright = new THREE.Mesh(new THREE.BoxGeometry(0.008, 0.32, 0.28), bookendMat);
  bookendUpright.position.set(-2.03, 2.12, -1.34);
  bookShelfGroup.add(bookendUpright);

  const bookDataLower = [
    { title: 'SYSTEMS', color: '#1a1b1e', foil: '#d4af37', h: 0.42 },
    { title: 'TYPOGRAPHY', color: '#8b2616', foil: '#e2e8f0', h: 0.38 },
    { title: 'SWIFT ARCH', color: '#2b3a2f', foil: '#d4af37', h: 0.44 },
    { title: 'MINIMALISM', color: '#c8bba8', foil: '#1a1b1e', h: 0.39 },
    { title: 'CATALOGUE', color: '#543d2b', foil: '#d4af37', h: 0.40, tilt: 0.24 } // Tilted natural lean!
  ];

  let currentBookX = -1.98;
  bookDataLower.forEach((b) => {
    const spineTex = createBookSpineTexture(b.title, b.color, b.foil);
    const coverMat = new THREE.MeshStandardMaterial({ color: 0xffffff, map: spineTex, roughness: 0.65 });
    const singleBook = new THREE.Group();

    const bMesh = new THREE.Mesh(new THREE.BoxGeometry(0.058, b.h, 0.31), coverMat);
    bMesh.castShadow = true;
    singleBook.add(bMesh);

    const pagesMesh = new THREE.Mesh(new THREE.BoxGeometry(0.050, b.h - 0.016, 0.29), paperCoreMat);
    pagesMesh.position.set(0.002, 0, 0.006);
    singleBook.add(pagesMesh);

    if (b.tilt) {
      singleBook.position.set(currentBookX + 0.04, 1.96 + (b.h / 2) * Math.cos(b.tilt), -1.34);
      singleBook.rotation.z = -b.tilt;
    } else {
      singleBook.position.set(currentBookX, 1.96 + b.h / 2, -1.34);
    }
    bookShelfGroup.add(singleBook);
    currentBookX += 0.068;
  });

  // Upper Shelf Books (3 Monographs)
  const bookDataUpper = [
    { title: 'ARCHITECTURE', color: '#16222f', foil: '#e2e8f0', h: 0.44 },
    { title: 'INDUSTRIAL', color: '#b9652a', foil: '#d4af37', h: 0.40 },
    { title: 'GRAPHICS', color: '#d2cac0', foil: '#141518', h: 0.38 }
  ];
  let upperBookX = -1.92;
  bookDataUpper.forEach(b => {
    const spineTex = createBookSpineTexture(b.title, b.color, b.foil);
    const coverMat = new THREE.MeshStandardMaterial({ color: 0xffffff, map: spineTex, roughness: 0.65 });
    const bMesh = new THREE.Mesh(new THREE.BoxGeometry(0.065, b.h, 0.30), coverMat);
    bMesh.position.set(upperBookX, 2.68 + b.h / 2, -1.34);
    bMesh.castShadow = true;
    bookShelfGroup.add(bMesh);
    upperBookX += 0.076;
  });
  deskGroup.add(bookShelfGroup);

  // --- Realistic Echeveria Rosette Succulent in Ribbed Ceramic Planter ---
  const plantGroup = new THREE.Group();
  plantGroup.position.set(1.75, 2.68, -1.34);

  const potMat = new THREE.MeshStandardMaterial({ color: 0xf2f2f4, roughness: 0.42, metalness: 0.06 });
  const potMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.125, 0.095, 0.17, 32), potMat);
  potMesh.position.y = 0.085;
  potMesh.castShadow = true;
  plantGroup.add(potMesh);

  const potRim = new THREE.Mesh(new THREE.TorusGeometry(0.126, 0.008, 12, 32), potMat);
  potRim.rotateX(Math.PI / 2);
  potRim.position.y = 0.17;
  plantGroup.add(potRim);

  const soilMat = new THREE.MeshStandardMaterial({ color: 0x1a120b, roughness: 0.95 });
  const soilMesh = new THREE.Mesh(new THREE.CircleGeometry(0.118, 24), soilMat);
  soilMesh.rotateX(-Math.PI / 2);
  soilMesh.position.y = 0.162;
  plantGroup.add(soilMesh);

  // 18-Leaf Plump Rosette Succulent (3 concentric Fibonacci tiers with realistic waxy sheen)
  const succulentLeafMatOuter = new THREE.MeshPhysicalMaterial({
    color: 0x4a7356,
    roughness: 0.38,
    clearcoat: 0.18,
    clearcoatRoughness: 0.40
  });
  const succulentLeafMatMid = new THREE.MeshPhysicalMaterial({
    color: 0x5b8568,
    roughness: 0.36,
    clearcoat: 0.18,
    clearcoatRoughness: 0.40
  });
  const succulentLeafMatInner = new THREE.MeshPhysicalMaterial({
    color: 0x7a9c82,
    roughness: 0.34,
    clearcoat: 0.20,
    clearcoatRoughness: 0.40
  });

  const leafTiers = [
    { count: 8, radius: 0.065, y: 0.175, scale: 1.0, pitch: 0.55, mat: succulentLeafMatOuter },
    { count: 6, radius: 0.040, y: 0.195, scale: 0.78, pitch: 0.38, mat: succulentLeafMatMid },
    { count: 4, radius: 0.018, y: 0.210, scale: 0.55, pitch: 0.22, mat: succulentLeafMatInner }
  ];

  leafTiers.forEach((tier, tIdx) => {
    for (let i = 0; i < tier.count; i++) {
      const angle = (i / tier.count) * Math.PI * 2 + (tIdx * 0.38);
      const leafGeo = new THREE.SphereGeometry(0.038 * tier.scale, 16, 12);
      leafGeo.scale(1.0, 0.35, 1.85); // Plump fleshy spoon shape

      const leafMesh = new THREE.Mesh(leafGeo, tier.mat);
      leafMesh.position.set(
        Math.cos(angle) * tier.radius,
        tier.y,
        Math.sin(angle) * tier.radius
      );
      leafMesh.rotation.y = -angle + Math.PI / 2;
      leafMesh.rotation.x = tier.pitch;
      leafMesh.castShadow = true;
      plantGroup.add(leafMesh);
    }
  });
  deskGroup.add(plantGroup);

  // --- Minimalist Oak Framed Art Print on Upper Shelf ---
  const artGroup = new THREE.Group();
  artGroup.position.set(0.65, 2.94, -1.45);

  const frameOakMat = new THREE.MeshStandardMaterial({ color: 0x1f160e, map: walnutTex, roughness: 0.55 });
  const frameOuter = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.54, 0.024), frameOakMat);
  frameOuter.castShadow = true;
  artGroup.add(frameOuter);

  const matBoard = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 0.50), new THREE.MeshStandardMaterial({ color: 0xfbf9f5, roughness: 0.9 }));
  matBoard.position.z = 0.013;
  artGroup.add(matBoard);

  const artCanvas = document.createElement('canvas');
  artCanvas.width = 256; artCanvas.height = 320;
  const actx = artCanvas.getContext('2d');
  actx.fillStyle = '#faf8f3'; actx.fillRect(0, 0, 256, 320);
  actx.fillStyle = '#141518';
  actx.beginPath(); actx.arc(128, 130, 68, 0, Math.PI * 2); actx.fill();
  actx.fillStyle = '#faf8f3';
  actx.fillRect(128, 62, 70, 136);
  actx.fillStyle = '#141518';
  actx.font = '700 24px -apple-system, sans-serif';
  actx.textAlign = 'center';
  actx.fillText('FORM & FUNCTION', 128, 250);
  actx.font = '400 12px -apple-system, sans-serif';
  actx.fillText('TOKYO · 2026', 128, 275);
  const artTex = new THREE.CanvasTexture(artCanvas);

  const artPhoto = new THREE.Mesh(new THREE.PlaneGeometry(0.30, 0.38), new THREE.MeshStandardMaterial({ map: artTex, roughness: 0.7 }));
  artPhoto.position.z = 0.014;
  artGroup.add(artPhoto);

  frameGlassMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    transmission: 0.95,
    roughness: 0.04,
    ior: 1.52,
    reflectivity: 0.9,
    transparent: true,
    opacity: 0.40
  });
  const frameGlass = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 0.50), frameGlassMat);
  frameGlass.position.z = 0.015;
  artGroup.add(frameGlass);
  deskGroup.add(artGroup);

  // --- Left Desk Accessory: Braun BC02 Inspired Minimalist Analog Desk Clock ---
  const clockGroup = new THREE.Group();
  // Elevated so the entire clock body and its angled base rest cleanly on top of the desk mat (y = -0.036), 0mm submerged
  clockGroup.position.set(-1.62, 0.118, -0.38);
  clockGroup.rotation.x = -0.20; // 11.5 deg backward tilt towards user

  const clockBodyMat = new THREE.MeshPhysicalMaterial({
    color: 0x141619,
    roughness: 0.42,
    metalness: 0.60,
    clearcoat: 0.15,
    clearcoatRoughness: 0.35
  });
  const clockBezelMat = new THREE.MeshPhysicalMaterial({
    color: 0xd2d5db,
    roughness: 0.16,
    metalness: 0.90,
    clearcoat: 0.40,
    clearcoatRoughness: 0.20
  });

  const clockBody = new THREE.Mesh(new THREE.CylinderGeometry(0.145, 0.145, 0.075, 32), clockBodyMat);
  clockBody.rotateX(Math.PI / 2);
  clockBody.castShadow = true;
  clockGroup.add(clockBody);

  const clockBezel = new THREE.Mesh(new THREE.CylinderGeometry(0.134, 0.134, 0.015, 32), clockBezelMat);
  clockBezel.rotateX(Math.PI / 2);
  clockBezel.position.z = 0.033;
  clockGroup.add(clockBezel);

  const clockDialTex = createBraunClockDialTexture();
  const clockDialMat = new THREE.MeshStandardMaterial({ map: clockDialTex, roughness: 0.85, metalness: 0.02 });
  const clockDial = new THREE.Mesh(new THREE.CircleGeometry(0.126, 32), clockDialMat);
  clockDial.position.z = 0.039;
  clockGroup.add(clockDial);

  const handMatBlack = new THREE.MeshStandardMaterial({ color: 0x111215, roughness: 0.3 });
  const handMatOrange = new THREE.MeshStandardMaterial({ color: 0xff9900, roughness: 0.35 });

  const hourHand = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.058, 0.003), handMatBlack);
  hourHand.position.set(-0.022, 0.018, 0.041);
  hourHand.rotation.z = Math.PI / 3.4;
  clockGroup.add(hourHand);

  const minHand = new THREE.Mesh(new THREE.BoxGeometry(0.009, 0.082, 0.003), handMatBlack);
  minHand.position.set(0.026, 0.026, 0.043);
  minHand.rotation.z = -Math.PI / 4.2;
  clockGroup.add(minHand);

  const secHand = new THREE.Mesh(new THREE.BoxGeometry(0.004, 0.096, 0.002), handMatOrange);
  secHand.position.set(0.0, 0.016, 0.045);
  secHand.rotation.z = 0.45;
  clockGroup.add(secHand);

  const secBoss = new THREE.Mesh(new THREE.CylinderGeometry(0.010, 0.010, 0.005, 16), handMatOrange);
  secBoss.rotateX(Math.PI / 2);
  secBoss.position.z = 0.046;
  clockGroup.add(secBoss);

  clockGlassMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    transmission: 0.92,
    roughness: 0.03,
    ior: 1.52,
    reflectivity: 0.92,
    clearcoat: 1.0,
    clearcoatRoughness: 0.04,
    transparent: true,
    opacity: 0.45
  });
  const clockGlass = new THREE.Mesh(new THREE.CylinderGeometry(0.128, 0.128, 0.004, 32), clockGlassMat);
  clockGlass.rotateX(Math.PI / 2);
  clockGlass.position.z = 0.048;
  clockGroup.add(clockGlass);

  const clockStand = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.024, 0.08), clockBodyMat);
  clockStand.position.set(0, -0.138, -0.025);
  clockStand.castShadow = true;
  clockStand.receiveShadow = true;
  clockGroup.add(clockStand);
  deskGroup.add(clockGroup);

  /* --- 5. Center Desk Mat & Grounding (Grovemade Merino Wool & Saddle Leather) --- */
  const feltBumpTex = createFeltNoiseTexture();
  const deskMatFeltMaterial = new THREE.MeshStandardMaterial({
    color: 0x14171e,
    roughness: 0.92,
    metalness: 0.02,
    bumpMap: feltBumpTex,
    bumpScale: 0.005
  });

  const leatherTex = createLeatherTexture();
  const leatherNormalTex = createLeatherNormalTexture();
  const deskMatLeatherMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x22140a,
    map: leatherTex,
    normalMap: leatherNormalTex,
    normalScale: new THREE.Vector2(0.40, 0.40),
    roughness: 0.48,
    metalness: 0.04,
    clearcoat: 0.12,
    clearcoatRoughness: 0.45
  });

  const stitchLineMaterial = new THREE.MeshBasicMaterial({
    color: 0x8b6540
  });

  const fullMatShape = createRoundedRectShape(3.48, 2.15, 0.14);
  const fullMatGeo = new THREE.ExtrudeGeometry(fullMatShape, {
    depth: 0.014,
    bevelEnabled: true,
    bevelSegments: 3,
    steps: 1,
    bevelSize: 0.010,
    bevelThickness: 0.008
  });
  fullMatGeo.rotateX(-Math.PI / 2);

  const deskMatMesh = new THREE.Mesh(fullMatGeo, deskMatFeltMaterial);
  deskMatMesh.position.set(0, -0.058, 0.02);
  deskMatMesh.receiveShadow = true;
  deskGroup.add(deskMatMesh);

  // Grovemade Saddle Leather Left Inlay Panel with matched rounded outer corners (zero overhang)
  const leatherShape = new THREE.Shape();
  const leftX = -1.732;
  const rightX = -1.020;
  const topY = 1.066;
  const botY = -1.066;
  const cr = 0.135; // Matches fullMatShape corner radius (0.14) with 5mm interior margin

  leatherShape.moveTo(leftX, botY + cr);
  leatherShape.quadraticCurveTo(leftX, botY, leftX + cr, botY);
  leatherShape.lineTo(rightX, botY);
  leatherShape.lineTo(rightX, topY);
  leatherShape.lineTo(leftX + cr, topY);
  leatherShape.quadraticCurveTo(leftX, topY, leftX, topY - cr);
  leatherShape.lineTo(leftX, botY + cr);

  const leatherPanelGeo = new THREE.ShapeGeometry(leatherShape);
  leatherPanelGeo.rotateX(-Math.PI / 2);
  const leatherPanelMesh = new THREE.Mesh(leatherPanelGeo, deskMatLeatherMaterial);
  leatherPanelMesh.position.set(0, -0.0355, 0.02);
  leatherPanelMesh.receiveShadow = true;
  deskGroup.add(leatherPanelMesh);

  const stitchSeamMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.008, topY - botY), stitchLineMaterial);
  stitchSeamMesh.rotateX(-Math.PI / 2);
  stitchSeamMesh.position.set(rightX + 0.005, -0.0350, 0.02);
  deskGroup.add(stitchSeamMesh);

  // Contact Shadow Plane under MacBook chassis
  const contactShadowTex = createContactShadowTexture();
  const contactShadowMaterial = new THREE.MeshBasicMaterial({
    map: contactShadowTex,
    transparent: true,
    opacity: 0.0,
    depthWrite: false
  });
  const contactShadowMesh = new THREE.Mesh(new THREE.PlaneGeometry(2.52, 1.82), contactShadowMaterial);
  contactShadowMesh.rotateX(-Math.PI / 2);
  contactShadowMesh.position.set(0, -0.0358, 0.0);
  deskGroup.add(contactShadowMesh);

  // Screen Emissive Bounce Light
  const screenBounceLight = new THREE.PointLight(0xaad0ff, 0.0, 3.2, 2.0);
  screenBounceLight.position.set(0, 0.12, 0.35);
  deskGroup.add(screenBounceLight);

  // --- Right Desk Accessory: Hasami Porcelain Stoneware Mug & CNC Walnut Coaster ---
  // Positioned comfortably to the right (x = 1.95) with plenty of breathing room from the laptop
  const mugGroup = new THREE.Group();
  mugGroup.position.set(1.95, -0.048, 0.12);

  const coasterGeo = new THREE.CylinderGeometry(0.20, 0.20, 0.018, 32);
  const coasterMat = new THREE.MeshPhysicalMaterial({
    color: 0x1f140d,
    map: walnutTex,
    normalMap: walnutNormalTex,
    normalScale: new THREE.Vector2(0.35, 0.35),
    roughness: 0.55,
    metalness: 0.04,
    clearcoat: 0.25,
    clearcoatRoughness: 0.40
  });
  const coasterMesh = new THREE.Mesh(coasterGeo, coasterMat);
  coasterMesh.position.y = 0.009;
  coasterMesh.castShadow = true;
  coasterMesh.receiveShadow = true;
  mugGroup.add(coasterMesh);

  const hasamiMat = new THREE.MeshPhysicalMaterial({
    color: 0x22252a,
    roughness: 0.76,
    metalness: 0.05,
    clearcoat: 0.15,
    clearcoatRoughness: 0.50
  });

  const mugPedestal = new THREE.Mesh(new THREE.CylinderGeometry(0.112, 0.112, 0.035, 32), hasamiMat);
  mugPedestal.position.y = 0.035;
  mugPedestal.castShadow = true;
  mugGroup.add(mugPedestal);

  const mugBody = new THREE.Mesh(new THREE.CylinderGeometry(0.134, 0.126, 0.24, 32), hasamiMat);
  mugBody.position.y = 0.170;
  mugBody.castShadow = true;
  mugBody.receiveShadow = true;
  mugGroup.add(mugBody);

  const mugHandleGeo = new THREE.TorusGeometry(0.062, 0.014, 12, 28, Math.PI * 1.15);
  const mugHandle = new THREE.Mesh(mugHandleGeo, hasamiMat);
  mugHandle.position.set(0.138, 0.170, 0.0);
  mugHandle.rotation.z = -Math.PI / 1.85;
  mugHandle.castShadow = true;
  mugGroup.add(mugHandle);

  const coffeeMat = new THREE.MeshPhysicalMaterial({
    color: 0x120a05,
    roughness: 0.02,
    metalness: 0.08,
    clearcoat: 1.0,
    clearcoatRoughness: 0.02,
    ior: 1.33
  });
  const coffeeMesh = new THREE.Mesh(new THREE.CircleGeometry(0.128, 32), coffeeMat);
  coffeeMesh.rotateX(-Math.PI / 2);
  coffeeMesh.position.y = 0.255;
  mugGroup.add(coffeeMesh);

  deskGroup.add(mugGroup);

  /* --- 6. Architectural Nordic Study Room (Reference: media_1788589474255.png) --- */
  // 6a. Nordic Smoked Oak Plank Hardwood Floor (Deep rich warm wood with dark grooves)
  const floorTex = createHardwoodFloorTexture();
  const floorMat = new THREE.MeshStandardMaterial({
    map: floorTex,
    color: 0x5a4230,
    roughness: 0.85,
    metalness: 0.04
  });
  const floorGeo = new THREE.PlaneGeometry(16, 12);
  floorGeo.rotateX(-Math.PI / 2);
  const floorMesh = new THREE.Mesh(floorGeo, floorMat);
  floorMesh.position.set(0, -1.89, -0.5);
  floorMesh.receiveShadow = true;
  deskGroup.add(floorMesh);

  // 6b. Acoustic Wood Slat Wall (Vertical architectural slats & deep obsidian felt backing)
  const slatBackingMat = new THREE.MeshStandardMaterial({
    color: 0x0a0b0f,
    roughness: 0.98,
    metalness: 0.02
  });
  const slatBackingMesh = new THREE.Mesh(new THREE.BoxGeometry(8.4, 5.2, 0.02), slatBackingMat);
  slatBackingMesh.position.set(0, 0.705, -1.90);
  slatBackingMesh.receiveShadow = true;
  deskGroup.add(slatBackingMesh);

  // 64 Individual Wood Slats (Golden-teak oak batten louvers) using InstancedMesh for 60fps single-draw-call performance
  const slatWidth = 0.042;
  const slatHeight = 5.2;
  const slatDepth = 0.025;
  const slatGeo = new THREE.BoxGeometry(slatWidth, slatHeight, slatDepth);
  const slatTex = createSlatWoodTexture();
  const slatMat = new THREE.MeshStandardMaterial({
    map: slatTex,
    color: 0x825e3b,
    roughness: 0.60,
    metalness: 0.06
  });

  const slatCount = 64;
  const slatSpacing = 0.128;
  const slatInstancedMesh = new THREE.InstancedMesh(slatGeo, slatMat, slatCount);
  const slatDummy = new THREE.Object3D();
  for (let i = 0; i < slatCount; i++) {
    const sx = (i - (slatCount - 1) / 2) * slatSpacing;
    slatDummy.position.set(sx, 0.705, -1.88);
    slatDummy.updateMatrix();
    slatInstancedMesh.setMatrixAt(i, slatDummy.matrix);
  }
  slatInstancedMesh.instanceMatrix.needsUpdate = true;
  slatInstancedMesh.castShadow = true;
  slatInstancedMesh.receiveShadow = true;
  deskGroup.add(slatInstancedMesh);

  // 6c. Top Floating Architectural Shelf & Hidden Cove Wall-Washer Light
  const floatingShelfMat = new THREE.MeshStandardMaterial({
    color: 0x121318,
    roughness: 0.50,
    metalness: 0.35
  });
  const floatingShelfMesh = new THREE.Mesh(new THREE.BoxGeometry(8.4, 0.08, 0.40), floatingShelfMat);
  floatingShelfMesh.position.set(0, 3.00, -1.70);
  floatingShelfMesh.castShadow = true;
  floatingShelfMesh.receiveShadow = true;
  deskGroup.add(floatingShelfMesh);

  // Underside warm cove LED strip (2300K rich amber golden glow)
  slatCoveStripMat = new THREE.MeshStandardMaterial({
    color: 0x0a0805,
    emissive: 0xff9933,
    emissiveIntensity: 0.0,
    roughness: 0.3
  });
  const slatCoveStripMesh = new THREE.Mesh(new THREE.BoxGeometry(8.2, 0.015, 0.035), slatCoveStripMat);
  slatCoveStripMesh.position.set(0, 2.95, -1.80);
  deskGroup.add(slatCoveStripMesh);

  // Cove wall-washer spotlight array bathing slats in warm architectural grazing light with natural falloff
  slatCoveLight = new THREE.SpotLight(0xffa444, 0.0, 5.8, Math.PI / 2.8, 0.92, 1.8);
  slatCoveLight.position.set(0, 2.94, -1.78);
  const slatCoveTarget = new THREE.Object3D();
  slatCoveTarget.position.set(0, 0.6, -1.88);
  deskGroup.add(slatCoveTarget);
  slatCoveLight.target = slatCoveTarget;
  deskGroup.add(slatCoveLight);

  slatCoveLightL = new THREE.SpotLight(0xff9938, 0.0, 5.0, Math.PI / 3.0, 0.92, 1.8);
  slatCoveLightL.position.set(-2.4, 2.94, -1.78);
  const slatCoveTargetL = new THREE.Object3D();
  slatCoveTargetL.position.set(-2.4, 0.6, -1.88);
  deskGroup.add(slatCoveTargetL);
  slatCoveLightL.target = slatCoveTargetL;
  deskGroup.add(slatCoveLightL);

  slatCoveLightR = new THREE.SpotLight(0xff9938, 0.0, 5.0, Math.PI / 3.0, 0.92, 1.8);
  slatCoveLightR.position.set(2.4, 2.94, -1.78);
  const slatCoveTargetR = new THREE.Object3D();
  slatCoveTargetR.position.set(2.4, 0.6, -1.88);
  deskGroup.add(slatCoveTargetR);
  slatCoveLightR.target = slatCoveTargetR;
  deskGroup.add(slatCoveLightR);

  // 6d. Architectural Matte Charcoal Side Walls & Storage Credenza (Study Nook)
  const roomWallMat = new THREE.MeshStandardMaterial({
    color: 0x101115,
    roughness: 0.94,
    metalness: 0.08
  });

  const leftWallMesh = new THREE.Mesh(new THREE.BoxGeometry(0.12, 5.2, 6.0), roomWallMat);
  leftWallMesh.position.set(-4.20, 0.705, 0.5);
  leftWallMesh.receiveShadow = true;
  deskGroup.add(leftWallMesh);

  const rightWallMesh = new THREE.Mesh(new THREE.BoxGeometry(0.12, 5.2, 6.0), roomWallMat);
  rightWallMesh.position.set(4.20, 0.705, 0.5);
  rightWallMesh.receiveShadow = true;
  deskGroup.add(rightWallMesh);

  const ceilingMesh = new THREE.Mesh(new THREE.BoxGeometry(8.4, 0.15, 6.0), roomWallMat);
  ceilingMesh.position.set(0, 3.35, 0.5);
  deskGroup.add(ceilingMesh);

  // Left Low Storage Credenza / Nook Cabinet (as seen in media_1788589474255.png)
  const credenzaMat = new THREE.MeshStandardMaterial({
    color: 0x14151a,
    roughness: 0.75,
    metalness: 0.15
  });
  const credenzaMesh = new THREE.Mesh(new THREE.BoxGeometry(0.90, 0.95, 3.2), credenzaMat);
  credenzaMesh.position.set(-3.65, -1.415, -0.3);
  credenzaMesh.castShadow = true;
  credenzaMesh.receiveShadow = true;
  deskGroup.add(credenzaMesh);

  // Credenza oak top trim
  const credenzaTopMesh = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.03, 3.22), slatMat);
  credenzaTopMesh.position.set(-3.65, -0.925, -0.3);
  credenzaTopMesh.castShadow = true;
  credenzaTopMesh.receiveShadow = true;
  deskGroup.add(credenzaTopMesh);

  // Collect all unique materials across the entire deskGroup to support smooth gradual manifestation
  const deskMaterials = new Set();
  deskGroup.traverse((child) => {
    if (child.isMesh && child.material) {
      if (Array.isArray(child.material)) {
        child.material.forEach(m => deskMaterials.add(m));
      } else {
        deskMaterials.add(child.material);
      }
    }
  });

  deskMaterials.forEach(m => {
    if (m !== contactShadowMaterial) {
      m.transparent = true;
      m.opacity = 0.0;
      if (m !== clockGlassMat && m !== frameGlassMat) {
        m.depthWrite = true;
      }
    }
  });

  // Load the official Apple M2 MacBook Air CAD model
  const objLoader = new THREE.OBJLoader();
  badgeText.textContent = 'Loading M2 MacBook Air (Apple CAD)...';

  let isObjModel = false;
  const hingeY = 0.068; // Exact hinge axis from Apple CAD coordinates
  const hingeZ = -10.385;

  // 90.55 deg (1.5805 rad): eliminates 2.2mm CAD offset, lid sits 100% flush on top of base with 0 gap
  const closedLidRot = 1.5805;
  const openLidRot = -0.384;   // -22 deg backwards: 112 deg open facing user

  // All 18 lid meshes in Apple's CAD hierarchy
  const lidMeshNames = new Set([
    'mZNmJdOPleYFLZg', 'UFXzThjPybplDUu', 'JuhbtSVUApBmAxZ', 'upjAUqYVLfcxvyM',
    'dFmPMyaKVBOVSYU', 'mcOCnZgAJjewDrN', 'ZDgSqzMhYRkIwOB', 'YxEoGdVfCoJSQNq',
    'ZoEUQEmIqLZBLak', 'IIYuScaaJfZFQCI', 'CkbnHAtuXixvlPr', 'irBwdgNkUouIpnC',
    'cdEKpSInDAxKfRd', 'WpfSRoMSCXcnWjO', 'exAHuoZuPFkBomv', 'VVnIYKcbynDbdXl',
    'feBsULtagOdYvJH', 'DauEMEVlXggAWUI'
  ]);

  objLoader.load(
    './assets/macbook_air_m2.obj',
    (obj) => {
      console.log('✅ Successfully loaded Apple M2 MacBook Air CAD model!', obj);
      isModelLoaded = true;
      isObjModel = true;

      const laptopGroup = new THREE.Group();
      const baseGroup = new THREE.Group();
      const lidGroup = new THREE.Group();

      lidGroup.position.set(0, hingeY, hingeZ);
      lidGroup.rotation.x = closedLidRot;

      // Distribute meshes into Base and Lid
      const children = [...obj.children];
      children.forEach((child) => {
        if (!child.isMesh) return;

        const name = child.name;

        // Skip Maya bounding box / shadow occluder
        if (name === 'csvvJPhjQMuWYNc') {
          child.visible = false;
          return;
        }

        child.castShadow = true;
        child.receiveShadow = true;

        // 1. Display Screen (Liquid Retina)
        if (name === 'irBwdgNkUouIpnC') {
          child.material = screenMaterial;
          screenMesh = child;

          // Remap UVs to perfect edge-to-edge screen dimensions
          const posAttr = child.geometry.attributes.position;
          const uvAttr = child.geometry.attributes.uv;
          if (posAttr && uvAttr) {
            const minX = -14.530, maxX = 14.530;
            const minY = 1.640, maxY = 20.483;
            for (let i = 0; i < posAttr.count; i++) {
              const x = posAttr.getX(i);
              const y = posAttr.getY(i);
              const u = (x - minX) / (maxX - minX);
              const v = (y - minY) / (maxY - minY);
              uvAttr.setXY(i, u, v);
            }
            uvAttr.needsUpdate = true;
          }
        }
        // 2. Apple Logo (Dark Mirror Polished Stainless Steel)
        else if (name === 'UFXzThjPybplDUu') {
          child.material = appleLogoMaterial;
        }
        // 3. Crisp Apple Keycap Lettering & Symbols (3D CAD geometry)
        else if (name === 'zsOsFQXpFwOJKWG' || name === 'GyojOOVwJxpbhhC' || name === 'mfFbowEMMbSZOLy') {
          child.material = keyLetteringMaterial;
          child.castShadow = false;
        }
        // 4. Magic Keyboard Keycaps (Matte Jet Black)
        else if (name === 'YKxhYpybFgSsZHM' || name === 'VbVhWDLrLXNelZV' || name === 'NixeTWqDVbOPgCM' || name === 'wmzzHoVpMCAxWtT') {
          child.material = keycapMaterial;
        }
        // 5. Touch ID Concentric Ring
        else if (name === 'RftRIxRqeYohApj') {
          child.material = touchIdRingMaterial;
        }
        // 6. Touch ID Sensor Center
        else if (name === 'ZKHcwOMvXecEGfS') {
          child.material = touchIdSensorMaterial;
        }
        // 7. Keyboard Well & Recess (Including well surrounds)
        else if (name === 'mSEUNgysuVTcudc' || name === 'HgrefWTDdZusNww' || name === 'nCwiYTzbsUHfReE') {
          child.material = keyboardWellMaterial;
        }
        // 8. Force Touch Trackpad
        else if (name === 'gBnfybYsnvNKMNz' || name === 'HTHOzmkTYEwZyEh' || name === 'JyWPvxtVWeAIlFr' || name === 'PtCJmGcZOLCVfpE') {
          child.material = trackpadMaterial;
        }
        // 9. Display Bezel, Notch, Outer Frame & Camera Chin (All pitch black glass/rubber)
        else if (
          name === 'IIYuScaaJfZFQCI' || name === 'ZoEUQEmIqLZBLak' || name === 'mcOCnZgAJjewDrN' ||
          name === 'CkbnHAtuXixvlPr' || name === 'ZDgSqzMhYRkIwOB' || name === 'cdEKpSInDAxKfRd' ||
          name === 'JuhbtSVUApBmAxZ' || name === 'YxEoGdVfCoJSQNq' || name === 'upjAUqYVLfcxvyM' ||
          name === 'dFmPMyaKVBOVSYU'
        ) {
          child.material = bezelMaterial;
        }
        // 10. Camera Optics
        else if (name === 'WpfSRoMSCXcnWjO' || name === 'exAHuoZuPFkBomv') {
          child.material = cameraLensMaterial;
        }
        // 11. Camera Indicator LED
        else if (name === 'VVnIYKcbynDbdXl') {
          child.material = cameraLedMaterial;
        }
        // 12. Rubber Feet
        else if (name === 'YAOjfwmVkkNHGsw' || name === 'VteflOJPtnElhSW' || name === 'gPTLGfpChDzhsrp' || name === 'LmZwNLewLylxPut') {
          child.material = rubberFeetMaterial;
        }
        // 13. Hinge Clutch Barrel
        else if (name === 'JbBpyzYqWdIGYBB') {
          child.material = hingeBarrelMaterial;
        }
        // 14. Midnight Satin Unibody Aluminum (Chassis & Outer Lid)
        else {
          child.material = midnightAluminumMaterial;
        }

        // Add to lid or base with exact hinge pivot offsets
        if (lidMeshNames.has(name)) {
          child.position.y -= hingeY;
          child.position.z -= hingeZ;
          lidGroup.add(child);
        } else {
          baseGroup.add(child);
        }
      });

      laptopGroup.add(baseGroup);
      laptopGroup.add(lidGroup);

      // Auto-scale CAD centimeters (~30.4cm width) to standard scene units (~2.25)
      // Upsized for prominent, high-impact presence and crystal-clear screen legibility
      const scale = 2.25 / 30.41;
      laptopGroup.scale.setScalar(scale);

      // Ground model flush on top of desk mat:
      // In laptopGroup coordinates, base rubber feet are at y = -0.0363.
      // Setting laptopGroup.position.y = 0.000 places the bottom rubber feet at y = -0.0363,
      // resting 100% flush on the desk mat top surface (-0.0360) with 0mm submersion.
      laptopGroup.position.set(0, 0.000, 0);

      macRoot.add(laptopGroup);
      lidNode = lidGroup;

      badgeText.textContent = 'Ready';
      setTimeout(() => {
        const badgeEl = document.getElementById('screen-badge');
        if (badgeEl) {
          badgeEl.style.transition = 'opacity 0.8s ease';
          badgeEl.style.opacity = '0';
          badgeEl.style.pointerEvents = 'none';
        }
      }, 1000);
    },
    (xhr) => {
      if (xhr.total > 0) {
        const pct = Math.round((xhr.loaded / xhr.total) * 100);
        badgeText.textContent = `Loading M2 MacBook Air (${pct}%)...`;
      } else {
        const mb = (xhr.loaded / (1024 * 1024)).toFixed(1);
        badgeText.textContent = `Loading M2 MacBook Air (${mb}MB)...`;
      }
    },
    (err) => {
      console.error('Error loading assets/macbook_air_m2.obj:', err);
      badgeText.textContent = 'Using procedural fallback';
      buildCleanFallback();
    }
  );

  /* --- Fallback Procedural Model in case FBX has any loading failure --- */
  function buildCleanFallback() {
    if (isModelLoaded) return;
    const fallbackGroup = new THREE.Group();
    macRoot.add(fallbackGroup);

    // M2 MacBook Air 13.6" Dimensions: 30.41 x 21.50 x 1.13cm -> Ultra-slim flat slab
    const baseWidth = 2.65;
    const baseDepth = 1.88;
    const baseHeight = 0.055;
    const lidHeight = 0.038;

    // Base body (Midnight aluminum)
    const base = new THREE.Mesh(new THREE.BoxGeometry(baseWidth, baseHeight, baseDepth), midnightAluminumMaterial);
    base.castShadow = true;
    base.receiveShadow = true;
    fallbackGroup.add(base);

    // Keyboard well
    const kb = new THREE.Mesh(new THREE.PlaneGeometry(2.25, 0.92), keyboardMaterial);
    kb.rotateX(-Math.PI / 2);
    kb.position.set(0, baseHeight / 2 + 0.001, -0.22);
    fallbackGroup.add(kb);

    // Force Touch Trackpad (Large format)
    const tp = new THREE.Mesh(new THREE.PlaneGeometry(1.12, 0.70), trackpadMaterial);
    tp.rotateX(-Math.PI / 2);
    tp.position.set(0, baseHeight / 2 + 0.001, 0.48);
    fallbackGroup.add(tp);

    // Hinge & Display Lid
    const hinge = new THREE.Group();
    hinge.position.set(0, baseHeight / 2, -baseDepth / 2);
    fallbackGroup.add(hinge);

    // Lid chassis
    const lid = new THREE.Mesh(new THREE.BoxGeometry(baseWidth, lidHeight, baseDepth), midnightAluminumMaterial);
    lid.position.set(0, lidHeight / 2, baseDepth / 2);
    lid.castShadow = true;
    hinge.add(lid);

    // Apple Logo (Dark Mirror Chrome on top of lid)
    const logoMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.38, 0.38), appleLogoMaterial);
    logoMesh.rotateX(-Math.PI / 2);
    logoMesh.position.set(0, lidHeight + 0.001, baseDepth / 2);
    hinge.add(logoMesh);

    // Liquid Retina Screen (Interior display)
    const screen = new THREE.Mesh(new THREE.PlaneGeometry(baseWidth - 0.12, baseDepth - 0.14), screenMaterial);
    screen.rotateX(Math.PI / 2);
    screen.position.set(0, -0.001, baseDepth / 2);
    hinge.add(screen);

    lidNode = hinge;
    screenMesh = screen;
  }

  /* ==========================================================================
     5. Story Panels & GSAP ScrollTrigger
     ========================================================================== */
  const scrollStage = document.getElementById('scroll-stage');
  const panelHero = document.getElementById('panel-hero');
  const panelAnchor = document.getElementById('panel-anchor');
  const panelMoftailStorefront = document.getElementById('panel-moftail-storefront');
  const panelMoftailAds = document.getElementById('panel-moftail-ads');
  const panelMoftailPod = document.getElementById('panel-moftail-pod');
  const panelShopifyTheme = document.getElementById('panel-shopify-theme');
  const btnOpen = document.getElementById('btn-open-macbook');
  const navItems = document.querySelectorAll('.nav-links .nav-item');

  function updateActiveNav(targetHref) {
    navItems.forEach(item => {
      if (item.getAttribute('href') === targetHref) item.classList.add('active');
      else item.classList.remove('active');
    });
  }

  const allPanels = [
    panelHero,
    panelAnchor,
    panelMoftailStorefront,
    panelMoftailAds,
    panelMoftailPod,
    panelShopifyTheme
  ];

  function setPanelActive(panel) {
    allPanels.forEach(p => {
      if (!p) return;
      if (p === panel) p.classList.add('active');
      else p.classList.remove('active');
    });
  }

  if (btnOpen) {
    btnOpen.addEventListener('click', () => {
      const stageTop = scrollStage.offsetTop;
      const targetScroll = stageTop + window.innerHeight * 1.8;
      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    });
  }

  // Master GSAP Timeline synchronized to scroll (ORYZO Darkroom Void-Mode Reveal)
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: scrollStage,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1.2,
      onUpdate: (self) => {
        const p = self.progress;

        if (p < 0.27) {
          setPanelActive(panelHero);
          updateScreenTexture(textures.lockScreen, 0xffeed8);
          updateActiveNav('#panel-hero');
        } else if (p >= 0.27 && p < 0.42) {
          setPanelActive(panelAnchor);
          updateScreenTexture(textures.anchor, 0x82b4ff);
          updateActiveNav('#scroll-stage');
        } else if (p >= 0.42 && p < 0.55) {
          setPanelActive(panelMoftailStorefront);
          updateScreenTexture(textures.shopify, 0x6ee7b7);
          updateActiveNav('#scroll-stage');
        } else if (p >= 0.55 && p < 0.68) {
          setPanelActive(panelMoftailAds);
          updateScreenTexture(textures.ads, 0x60a5fa);
          updateActiveNav('#scroll-stage');
        } else if (p >= 0.68 && p < 0.81) {
          setPanelActive(panelMoftailPod);
          updateScreenTexture(textures.printify, 0xa5b4fc);
          updateActiveNav('#scroll-stage');
        } else {
          setPanelActive(panelShopifyTheme);
          updateScreenTexture(textures.shopifyTheme, 0x60a5fa);
          updateActiveNav('#scroll-stage');
        }
      }
    }
  });

  // =========================================================================
  // Step 1a: Mid-Air Rotation & Subtle Dark Desk Manifestation (0.0 -> 0.80s)
  // Mac smoothly rotates in mid-air from diagonal to horizontal (staying high!).
  // Simultaneously, the desk begins as a very faint, dark silhouette in deep shadow ("暗くして存在感を薄くする").
  // Desk lighting stays completely OFF.
  // =========================================================================
  tl.to(macState, {
    rotX: 0.06,         // Rotates to level horizontal in mid-air
    rotY: -0.03,
    rotZ: 0.0,
    posX: 0.00,         // Centers horizontally
    posY: 0.35,         // Remains floating high in mid-air!
    cameraZ: 4.60,      // Begins expanding view
    cameraY: 0.50,
    lookOffsetY: 0.26,
    ease: 'power1.inOut',
    duration: 0.80
  }, 0);

  tl.to(deskState, {
    opacity: 0.20,      // Very dim, faint silhouette — low presence in the darkroom!
    posY: -0.54,        // Faintly rising into place below
    posX: 0.00,
    rotX: 0.06,
    rotY: -0.03,
    rotZ: 0.0,
    underShelfLightIntensity: 0.0, // Strictly OFF / completely dark
    contactShadowOpacity: 0.0,
    ease: 'sine.inOut',
    duration: 0.80
  }, 0);

  // =========================================================================
  // Step 1b: Generous Flight & Gentle Cushioned Landing ("フワッとおく", 0.80 -> 2.15s)
  // The Mac travels down through a generous vertical distance (~35cm),
  // decelerating softly towards the felt desk mat.
  // The desk remains in dim, low-key dark silhouette while the laptop descends.
  // =========================================================================
  tl.to(macState, {
    posY: -0.46,        // Cushions softly to a gentle touchdown on the mat
    cameraZ: 4.88,      // Wide camera view
    cameraY: 0.58,
    lookOffsetY: 0.36,
    ease: 'power2.out', // Smooth cushioned deceleration — "フワッとおく"
    duration: 1.35
  }, 0.80);

  tl.to(deskState, {
    opacity: 0.30,      // Still dim & dark while descending — presence kept understated
    posY: -0.46,        // Desk is in place
    underShelfLightIntensity: 0.0, // Stays dark until touchdown!
    contactShadowOpacity: 0.15,
    ease: 'power1.out',
    duration: 1.35
  }, 0.80);

  // =========================================================================
  // Step 1c: TOUCHDOWN! Warm Lighting Blossoms & Desk Radiance (2.15 -> 2.75s)
  // At the EXACT MOMENT the laptop lands on the mat:
  // Beautiful warm amber indirect lighting blooms across the desk, illuminating
  // the walnut wood grain, pegboard, plant, books, and the sleek closed Mac!
  // Desk fully materializes into rich, solid focus.
  // =========================================================================
  tl.to(deskState, {
    underShelfLightIntensity: 2.6, // Warm ambient & indirect LED strip bloom with gorgeous amber radiance!
    opacity: 1.0,                  // Desk transitions to 100% full rich material definition
    contactShadowOpacity: 0.72,    // Grounding shadow deepens under laptop chassis
    ease: 'power2.out',
    duration: 0.60
  }, 2.15);

  tl.to(macState, {
    cameraZ: 4.95,                 // Expands slightly as the scene is beautifully illuminated
    cameraY: 0.58,
    lookOffsetY: 0.36,
    ease: 'power1.out',
    duration: 0.60
  }, 2.15);

  // =========================================================================
  // Step 1d: Laptop on Warm Desk Opens Display (2.75 -> 3.65s)
  // Firmly resting on the desk under the warm glow, lid smoothly opens to 112°
  // =========================================================================
  tl.to(macState, {
    lidOpen: 1.0,                  // Opens smoothly to 112°
    rotX: 0.06,
    rotY: -0.03,
    rotZ: 0.0,
    posX: 0.00,
    posY: -0.46,
    cameraZ: 4.90,
    cameraY: 0.58,
    lookOffsetY: 0.36,
    ease: 'power2.inOut',
    duration: 0.90
  }, 2.75);

  tl.to(deskState, {
    bounceIntensity: 0.60,         // Screen emissive bounce illuminates the mat & workspace
    underShelfLightIntensity: 2.6,
    ease: 'power2.inOut',
    duration: 0.90
  }, 2.75);

  // =========================================================================
  // Step 2: Dynamic Zoom-in Dive into Anchor (3.65 -> 5.75s)
  // Camera dives into the screen, making the code & architecture prominent
  // =========================================================================
  tl.to(macState, {
    rotX: 0.05,
    rotY: -0.03,
    cameraZ: 3.16,      // Close-up hero screen view between Left & Right cards
    cameraY: 0.22,
    lookOffsetY: 0.44,  // Screen-centered vertical framing
    posY: -0.46,
    posX: 0.00,
    ease: 'power2.inOut',
    duration: 2.10
  }, 3.65);

  tl.to(deskState, {
    rotX: 0.05,
    rotY: -0.03,
    posY: -0.46,
    posX: 0.00,
    bounceIntensity: 0.65,
    underShelfLightIntensity: 2.6,
    ease: 'power2.inOut',
    duration: 2.10
  }, 3.65);

  // =========================================================================
  // Step 3a: Moftail Phase 1 - Storefront & Commerce Pipeline (5.75 -> 7.45s)
  // Subtle right perspective shift showcasing midnight unibody & storefront
  // =========================================================================
  tl.to(macState, {
    rotX: 0.06,
    rotY: 0.03,         // Elegant slight tilt showcasing midnight aluminum anodized finish
    cameraZ: 3.16,
    cameraY: 0.22,
    lookOffsetY: 0.44,
    posX: 0.00,
    posY: -0.46,
    ease: 'power1.inOut',
    duration: 1.70
  }, 5.75);

  tl.to(deskState, {
    rotX: 0.06,
    rotY: 0.03,
    posY: -0.46,
    posX: 0.00,
    bounceIntensity: 0.65,
    underShelfLightIntensity: 2.6,
    ease: 'power1.inOut',
    duration: 1.70
  }, 5.75);

  // =========================================================================
  // Step 3b: Moftail Phase 2 - Meta Ads & Demand Verification (7.45 -> 9.15s)
  // Subtle left tilt as user examines real ad analytics ($597.87 / 78 ATC / 0 purchase)
  // =========================================================================
  tl.to(macState, {
    rotX: 0.05,
    rotY: -0.02,        // Nuanced angle change highlighting the analytics dashboard
    cameraZ: 3.14,
    cameraY: 0.22,
    lookOffsetY: 0.44,
    posX: 0.00,
    posY: -0.46,
    ease: 'power1.inOut',
    duration: 1.70
  }, 7.45);

  tl.to(deskState, {
    rotX: 0.05,
    rotY: -0.02,
    posY: -0.46,
    posX: 0.00,
    bounceIntensity: 0.65,
    underShelfLightIntensity: 2.6,
    ease: 'power1.inOut',
    duration: 1.70
  }, 7.45);

  // =========================================================================
  // Step 3c: Moftail Phase 3 - Supply POD & Birding Pivot (9.15 -> 10.85s)
  // Balanced centered framing showcasing Printify supply network & market pivot
  // =========================================================================
  tl.to(macState, {
    rotX: 0.06,
    rotY: 0.01,         // Centered balanced view
    cameraZ: 3.16,
    cameraY: 0.22,
    lookOffsetY: 0.44,
    posX: 0.00,
    posY: -0.46,
    ease: 'power1.inOut',
    duration: 1.70
  }, 9.15);

  tl.to(deskState, {
    rotX: 0.06,
    rotY: 0.01,
    posY: -0.46,
    posX: 0.00,
    bounceIntensity: 0.65,
    underShelfLightIntensity: 2.6,
    ease: 'power1.inOut',
    duration: 1.70
  }, 9.15);

  // =========================================================================
  // Step 4: Direct frontal close-up on Shopify Theme Engineering (10.85 -> 12.65s)
  // =========================================================================
  tl.to(macState, {
    rotX: 0.04,
    rotY: -0.01,        // Direct frontal alignment to maximize readability
    cameraZ: 3.14,
    cameraY: 0.22,
    lookOffsetY: 0.44,
    posX: 0.00,
    posY: -0.46,
    ease: 'power1.inOut',
    duration: 1.80
  }, 10.85);

  tl.to(deskState, {
    rotX: 0.04,
    rotY: -0.01,
    posY: -0.46,
    posX: 0.00,
    bounceIntensity: 0.65,
    underShelfLightIntensity: 2.6,
    ease: 'power1.inOut',
    duration: 1.80
  }, 10.85);

  // =========================================================================
  // Step 5: Pull back out smoothly to wide overview (12.65 -> 13.80s)
  // =========================================================================
  tl.to(macState, {
    rotX: 0.08,
    rotY: 0.03,
    cameraZ: 4.80,      // Pull back to showcase whole creator workspace
    cameraY: 0.52,
    lookOffsetY: 0.36,
    posY: -0.46,
    posX: 0.00,
    ease: 'power2.out',
    duration: 1.15
  }, 12.65);

  tl.to(deskState, {
    rotX: 0.08,
    rotY: 0.03,
    posY: -0.46,
    posX: 0.00,
    bounceIntensity: 0.40,
    underShelfLightIntensity: 2.6,
    ease: 'power2.out',
    duration: 1.15
  }, 12.65);

  /* Window scroll listener for post-pinned sections */
  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY + window.innerHeight * 0.4;
    const methodSec = document.getElementById('how-i-work');
    const aboutSec = document.getElementById('about');

    if (aboutSec && scrollPos >= aboutSec.offsetTop) {
      updateActiveNav('#about');
    } else if (methodSec && scrollPos >= methodSec.offsetTop) {
      updateActiveNav('#how-i-work');
    }
  }, { passive: true });

  /* ==========================================================================
     6. Mouse Parallax & Render Loop
     ========================================================================== */
  let mouseX = 0, mouseY = 0;
  let targetMouseX = 0, targetMouseY = 0;

  window.addEventListener('mousemove', (e) => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    targetMouseX = (e.clientX - cx) / cx * 0.08;
    targetMouseY = (e.clientY - cy) / cy * 0.05;
  });

  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();

    // Smooth mouse parallax damping
    mouseX += (targetMouseX - mouseX) * 0.05;
    mouseY += (targetMouseY - mouseY) * 0.05;

    // Rotate and position the MacBook master group
    macRoot.rotation.x = macState.rotX + mouseY;
    macRoot.rotation.y = macState.rotY + mouseX;
    macRoot.rotation.z = macState.rotZ;
    macRoot.position.x = macState.posX;
    macRoot.position.y = macState.posY;

    // Desk group follows deskState with matching mouse parallax
    deskGroup.visible = deskState.opacity > 0.005;
    deskGroup.position.x = deskState.posX;
    deskGroup.position.y = deskState.posY;
    deskGroup.position.z = deskState.posZ;
    deskGroup.rotation.x = deskState.rotX + mouseY;
    deskGroup.rotation.y = deskState.rotY + mouseX;
    deskGroup.rotation.z = deskState.rotZ;

    if (deskGroup.visible && deskMaterials) {
      deskMaterials.forEach(m => {
        if (m !== contactShadowMaterial && m !== clockGlassMat && m !== frameGlassMat) {
          m.opacity = Math.min(1.0, deskState.opacity);
        } else if (m === clockGlassMat) {
          m.opacity = 0.45 * Math.min(1.0, deskState.opacity);
        } else if (m === frameGlassMat) {
          m.opacity = 0.40 * Math.min(1.0, deskState.opacity);
        }
      });
    }

    if (underShelfLight) {
      underShelfLight.intensity = deskState.underShelfLightIntensity * 0.90;
    }
    if (deskWarmAmbience) {
      deskWarmAmbience.intensity = deskState.underShelfLightIntensity * 0.22;
    }
    if (deskRadiosityBounce) {
      deskRadiosityBounce.intensity = deskState.underShelfLightIntensity * 0.35;
    }
    if (underShelfStripMat) {
      underShelfStripMat.emissiveIntensity = (deskState.underShelfLightIntensity / 2.6) * 1.8;
    }
    if (slatCoveLight) {
      slatCoveLight.intensity = deskState.underShelfLightIntensity * 0.85;
    }
    if (slatCoveLightL) {
      slatCoveLightL.intensity = deskState.underShelfLightIntensity * 0.60;
    }
    if (slatCoveLightR) {
      slatCoveLightR.intensity = deskState.underShelfLightIntensity * 0.60;
    }
    if (slatCoveStripMat) {
      slatCoveStripMat.emissiveIntensity = (deskState.underShelfLightIntensity / 2.6) * 2.2;
    }
    if (screenBounceLight) {
      screenBounceLight.intensity = deskState.bounceIntensity;
    }
    if (contactShadowMaterial) {
      contactShadowMaterial.opacity = deskState.contactShadowOpacity;
    }

    // Control Lid Opening:
    if (lidNode) {
      if (isObjModel) {
        // Apple CAD model: closedLidRot (+1.5805 rad / 90.55 deg forward) is closed 100% flush on base,
        // openLidRot (-0.384 rad / -22 deg backwards) is open at 112 deg facing user
        lidNode.rotation.x = THREE.MathUtils.lerp(closedLidRot, openLidRot, macState.lidOpen);
      } else {
        lidNode.rotation.x = -macState.lidOpen * 2.02;
      }
    }

    camera.position.z = macState.cameraZ;
    camera.position.y = macState.cameraY;

    // On mobile portrait, shift look target slightly downward so the 3D MacBook
    // centers gracefully in the upper 52% of the screen above the bottom card
    const isMobile = camera.aspect < 1.0;
    const mobileLookShift = isMobile ? 0.30 : 0.0;
    const targetLookY = macRoot.position.y + (macState.lookOffsetY !== undefined ? macState.lookOffsetY : 0.14) - mobileLookShift;
    camera.lookAt(0, targetLookY, 0);

    renderer.render(scene, camera);
  }
  animate();

  /* ==========================================================================
     7. Resize & Orientation Handlers
     ========================================================================== */
  window.addEventListener('resize', () => {
    updateCameraAspect();
    ScrollTrigger.refresh();
  });

  window.addEventListener('orientationchange', () => {
    setTimeout(() => {
      updateCameraAspect();
      ScrollTrigger.refresh();
    }, 200);
  });
});
