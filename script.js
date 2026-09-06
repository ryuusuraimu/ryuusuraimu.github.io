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

  function createAnchorShieldTexture() {
    try {
      const c = document.createElement('canvas');
      c.width = 1024;
      c.height = 665;
      const ctx = c.getContext('2d');
      if (!ctx) return null;

      // Darkroom Deep Indigo Background
      ctx.fillStyle = '#0a0d14';
      ctx.fillRect(0, 0, c.width, c.height);

      // Subtle top header bar
      ctx.fillStyle = '#111724';
      ctx.fillRect(0, 0, c.width, 44);

      // macOS Traffic Lights
      ctx.fillStyle = '#ff5f56';
      ctx.beginPath(); ctx.arc(22, 22, 6, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#ffbd2e';
      ctx.beginPath(); ctx.arc(42, 22, 6, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#27c93f';
      ctx.beginPath(); ctx.arc(62, 22, 6, 0, Math.PI * 2); ctx.fill();

      // Title & Status
      ctx.fillStyle = '#e2e8f0';
      ctx.font = 'bold 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText('⚓ Anchor — Emergency Shield Active Mode', 90, 27);

      // Active status indicator pill
      ctx.fillStyle = 'rgba(74, 222, 128, 0.15)';
      ctx.strokeStyle = 'rgba(74, 222, 128, 0.45)';
      ctx.lineWidth = 1;
      if (ctx.roundRect) ctx.roundRect(c.width - 240, 9, 220, 26, 13);
      else ctx.fillRect(c.width - 240, 9, 220, 26);
      ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#4ade80';
      ctx.beginPath(); ctx.arc(c.width - 224, 22, 4, 0, Math.PI * 2); ctx.fill();
      ctx.font = 'bold 11px monospace';
      ctx.fillText('CRISIS PROTOCOL ACTIVE', c.width - 212, 26);

      // Emergency Statement Box (Zero-Friction Cognitive Notice)
      ctx.fillStyle = 'rgba(239, 68, 68, 0.12)';
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
      ctx.lineWidth = 1.5;
      if (ctx.roundRect) ctx.roundRect(36, 60, c.width - 72, 76, 12);
      else ctx.fillRect(36, 60, c.width - 72, 76);
      ctx.fill(); ctx.stroke();

      ctx.fillStyle = '#f87171';
      ctx.font = 'bold 11px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillText('● EMERGENCE ASSISTANCE REQUIRED / 現在パニック発作中', 56, 84);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 22px -apple-system, BlinkMacSystemFont, "Hiragino Sans", sans-serif';
      ctx.fillText('今、言葉が出せない状態です。落ち着くまで静かに見守ってください。', 56, 115);

      // Two Column Decision Cards (DO vs DO NOT)
      const cardW = 460;
      const cardH = 310;
      const cardY = 152;

      // Card 1: してほしいこと (DO / WHAT HELPS)
      ctx.fillStyle = '#111827';
      ctx.strokeStyle = '#1f2937';
      ctx.lineWidth = 1;
      if (ctx.roundRect) ctx.roundRect(36, cardY, cardW, cardH, 12);
      else ctx.fillRect(36, cardY, cardW, cardH);
      ctx.fill(); ctx.stroke();

      // Card 1 Header Pill
      ctx.fillStyle = 'rgba(16, 185, 129, 0.18)';
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.5)';
      if (ctx.roundRect) ctx.roundRect(36, cardY, cardW, 46, [12, 12, 0, 0]);
      else ctx.fillRect(36, cardY, cardW, 46);
      ctx.fill(); ctx.stroke();

      ctx.fillStyle = '#34d399';
      ctx.font = 'bold 15px -apple-system, BlinkMacSystemFont, "Hiragino Sans", sans-serif';
      ctx.fillText('✓  してほしいこと (WHAT HELPS)', 56, cardY + 29);

      const doItems = [
        { title: '静かな場所へ誘導する', desc: '音や光の刺激が少ない壁際やベンチなどへ案内してください。' },
        { title: '急かさずそばにいて見守る', desc: '無理に立たせようとせず、座らせて安全を確保してください。' },
        { title: '質問は「はい/いいえ」だけ', desc: '複雑な会話はできません。頷きで答えられる質問にしてください。' },
        { title: 'ゆっくり長く息を吐く', desc: '本人の呼吸に合わせ、背中に軽く触れながらペースを整えてください。' }
      ];

      let dy = cardY + 76;
      doItems.forEach((item, idx) => {
        ctx.fillStyle = '#10b981';
        ctx.beginPath(); ctx.arc(58, dy - 5, 8, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#0a0d14';
        ctx.font = 'bold 10px monospace';
        ctx.fillText(`${idx + 1}`, 55, dy - 2);

        ctx.fillStyle = '#f1f5f9';
        ctx.font = 'bold 13px -apple-system, BlinkMacSystemFont, "Hiragino Sans", sans-serif';
        ctx.fillText(item.title, 76, dy);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '11.5px -apple-system, BlinkMacSystemFont, "Hiragino Sans", sans-serif';
        ctx.fillText(item.desc, 76, dy + 18);
        dy += 58;
      });

      // Card 2: してほしくないこと (DO NOT / WHAT TO AVOID)
      const card2X = c.width - 36 - cardW;
      ctx.fillStyle = '#111827';
      ctx.strokeStyle = '#1f2937';
      ctx.lineWidth = 1;
      if (ctx.roundRect) ctx.roundRect(card2X, cardY, cardW, cardH, 12);
      else ctx.fillRect(card2X, cardY, cardW, cardH);
      ctx.fill(); ctx.stroke();

      // Card 2 Header Pill
      ctx.fillStyle = 'rgba(239, 68, 68, 0.16)';
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.5)';
      if (ctx.roundRect) ctx.roundRect(card2X, cardY, cardW, 46, [12, 12, 0, 0]);
      else ctx.fillRect(card2X, cardY, cardW, 46);
      ctx.fill(); ctx.stroke();

      ctx.fillStyle = '#f87171';
      ctx.font = 'bold 15px -apple-system, BlinkMacSystemFont, "Hiragino Sans", sans-serif';
      ctx.fillText('✕  してほしくないこと (WHAT TO AVOID)', card2X + 20, cardY + 29);

      const dontItems = [
        { title: '大声で問い詰めること', desc: '「どうしたの？」「何があったの？」と連続で話しかけないでください。' },
        { title: '身体を強く揺さぶること', desc: '意識を取り戻させようと肩を激しく揺らすとパニックが悪化します。' },
        { title: '人混みの中で取り囲むこと', desc: '周りに人が集まらないよう配慮し、パーソナルスペースを確保してください。' },
        { title: '救急車をむやみに呼ぶこと', desc: '持病のパニック発作の場合、15分ほど安静にすれば落ち着くことが多いです。' }
      ];

      let dny = cardY + 76;
      dontItems.forEach((item, idx) => {
        ctx.fillStyle = '#ef4444';
        ctx.beginPath(); ctx.arc(card2X + 22, dny - 5, 8, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 10px monospace';
        ctx.fillText(`${idx + 1}`, card2X + 19, dny - 2);

        ctx.fillStyle = '#f1f5f9';
        ctx.font = 'bold 13px -apple-system, BlinkMacSystemFont, "Hiragino Sans", sans-serif';
        ctx.fillText(item.title, card2X + 40, dny);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '11.5px -apple-system, BlinkMacSystemFont, "Hiragino Sans", sans-serif';
        ctx.fillText(item.desc, card2X + 40, dny + 18);
        dny += 58;
      });

      // Bottom Bar (Audio Message & Offline QR)
      const botY = 478;
      const botH = 135;

      // Left: Audio Playback Widget
      ctx.fillStyle = '#111827';
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      if (ctx.roundRect) ctx.roundRect(36, botY, 560, botH, 12);
      else ctx.fillRect(36, botY, 560, botH);
      ctx.fill(); ctx.stroke();

      // Play button circle
      ctx.fillStyle = '#0284c7';
      ctx.beginPath(); ctx.arc(76, botY + 45, 24, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(72, botY + 35);
      ctx.lineTo(84, botY + 45);
      ctx.lineTo(72, botY + 55);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 13px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillText('▶︎ 保存済み音声メッセージ (Pre-recorded Voice)', 114, botY + 36);

      ctx.fillStyle = '#cbd5e1';
      ctx.font = '12px -apple-system, BlinkMacSystemFont, "Hiragino Sans", sans-serif';
      ctx.fillText('「私は今パニック発作中です。命に別状はありません。静かに見守ってください。」', 114, botY + 56);

      // Sound Waveform Bars
      const waveX = 114;
      const waveY = botY + 84;
      const barHeights = [10, 18, 28, 14, 22, 34, 40, 26, 18, 30, 38, 22, 16, 26, 32, 18, 12, 24, 30, 20, 14, 8];
      barHeights.forEach((bh, i) => {
        ctx.fillStyle = i < 8 ? '#38bdf8' : '#334155';
        ctx.fillRect(waveX + i * 18, waveY - bh / 2, 8, bh);
      });
      ctx.fillStyle = '#64748b';
      ctx.font = '10px monospace';
      ctx.fillText('0:12 / 0:28 · SPATIAL AUDIO CAPABLE', waveX + barHeights.length * 18 + 12, waveY + 4);

      // Right: Offline QR Widget
      const qrBoxX = c.width - 36 - 360;
      ctx.fillStyle = '#111827';
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      if (ctx.roundRect) ctx.roundRect(qrBoxX, botY, 360, botH, 12);
      else ctx.fillRect(qrBoxX, botY, 360, botH);
      ctx.fill(); ctx.stroke();

      // Sharp QR Pattern Mockup
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(qrBoxX + 18, botY + 18, 98, 98);
      ctx.fillStyle = '#000000';
      // Corners
      ctx.fillRect(qrBoxX + 24, botY + 24, 26, 26);
      ctx.clearRect(qrBoxX + 28, botY + 28, 18, 18);
      ctx.fillRect(qrBoxX + 32, botY + 32, 10, 10);

      ctx.fillRect(qrBoxX + 84, botY + 24, 26, 26);
      ctx.clearRect(qrBoxX + 88, botY + 28, 18, 18);
      ctx.fillRect(qrBoxX + 92, botY + 32, 10, 10);

      ctx.fillRect(qrBoxX + 24, botY + 84, 26, 26);
      ctx.clearRect(qrBoxX + 28, botY + 88, 18, 18);
      ctx.fillRect(qrBoxX + 32, botY + 92, 10, 10);

      // Matrix dots
      const dots = [
        [56, 28], [64, 28], [72, 34], [60, 42], [68, 50], [56, 60], [74, 60],
        [32, 60], [42, 66], [84, 64], [94, 72], [60, 78], [70, 84], [80, 94]
      ];
      dots.forEach(([dx, dy]) => {
        ctx.fillRect(qrBoxX + dx, botY + dy, 6, 6);
      });

      // QR Text
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 11.5px monospace';
      ctx.fillText('OFFLINE-FIRST QR', qrBoxX + 130, botY + 40);

      ctx.fillStyle = '#e2e8f0';
      ctx.font = 'bold 12px -apple-system, BlinkMacSystemFont, "Hiragino Sans", sans-serif';
      ctx.fillText('通信なしで支援情報を共有', qrBoxX + 130, botY + 62);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '10.5px -apple-system, BlinkMacSystemFont, "Hiragino Sans", sans-serif';
      ctx.fillText('QRそのものにテキストデータを格納。', qrBoxX + 130, botY + 82);
      ctx.fillText('電波圏外でも相手のスマホで即読取可能。', qrBoxX + 130, botY + 98);

      // Bottom Footer Bar
      ctx.fillStyle = '#64748b';
      ctx.font = '10.5px monospace';
      ctx.fillText('ANCHOR v1.4.2 · SWIFT 6 · SWIFTUI · COGNITIVE ACCESSIBILITY ARCHITECTURE · SSC 2026', 36, c.height - 18);

      const tex = new THREE.CanvasTexture(c);
      tex.encoding = THREE.sRGBEncoding;
      tex.generateMipmaps = true;
      return tex;
    } catch (err) {
      console.warn('Could not generate Anchor Shield canvas texture, fallback to null', err);
      return null;
    }
  }

  function createMoftailAdsTexture() {
    try {
      const c = document.createElement('canvas');
      c.width = 1024;
      c.height = 665;
      const ctx = c.getContext('2d');
      if (!ctx) return null;

      // Darkroom Meta Ads Theme Background
      ctx.fillStyle = '#14171f';
      ctx.fillRect(0, 0, c.width, c.height);

      // Header Bar
      ctx.fillStyle = '#1c212c';
      ctx.fillRect(0, 0, c.width, 48);

      // Traffic Lights
      ctx.fillStyle = '#ff5f56';
      ctx.beginPath(); ctx.arc(22, 24, 6, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#ffbd2e';
      ctx.beginPath(); ctx.arc(42, 24, 6, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#27c93f';
      ctx.beginPath(); ctx.arc(62, 24, 6, 0, Math.PI * 2); ctx.fill();

      // Meta Ads Title
      ctx.fillStyle = '#1877f2';
      ctx.font = 'bold 13px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillText('∞ Meta Ads Manager', 88, 29);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '12px monospace';
      ctx.fillText('› MOFTAIL_CYCLE_02_MOCKUP_TEST › A/B Split Test', 240, 29);

      // Active status pill
      ctx.fillStyle = 'rgba(74, 222, 128, 0.15)';
      ctx.strokeStyle = 'rgba(74, 222, 128, 0.45)';
      ctx.lineWidth = 1;
      if (ctx.roundRect) ctx.roundRect(c.width - 230, 11, 210, 26, 13);
      else ctx.fillRect(c.width - 230, 11, 210, 26);
      ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#4ade80';
      ctx.beginPath(); ctx.arc(c.width - 215, 24, 4, 0, Math.PI * 2); ctx.fill();
      ctx.font = 'bold 11px monospace';
      ctx.fillText('CYCLE 2 VERIFIED DATA', c.width - 202, 28);

      // Summary Metric Cards (4 Cards Row)
      const kpis = [
        { label: 'TOTAL AD SPEND', val: '$597.87', sub: 'Verified Actual Spend', color: '#f87171' },
        { label: 'IMPRESSIONS', val: '27,396', sub: 'US Target Audience', color: '#38bdf8' },
        { label: 'LINK CLICKS', val: '1,142', sub: 'Avg CPC $0.52', color: '#fbbf24' },
        { label: 'ADD TO CART', val: '78', sub: 'High Intent Signals', color: '#4ade80' }
      ];

      const kpiW = 222;
      const kpiH = 78;
      const kpiY = 64;
      kpis.forEach((kpi, idx) => {
        const kx = 36 + idx * (kpiW + 18);
        ctx.fillStyle = '#1c2230';
        ctx.strokeStyle = '#273142';
        ctx.lineWidth = 1;
        if (ctx.roundRect) ctx.roundRect(kx, kpiY, kpiW, kpiH, 10);
        else ctx.fillRect(kx, kpiY, kpiW, kpiH);
        ctx.fill(); ctx.stroke();

        ctx.fillStyle = '#94a3b8';
        ctx.font = 'bold 10px monospace';
        ctx.fillText(kpi.label, kx + 16, kpiY + 22);

        ctx.fillStyle = kpi.color;
        ctx.font = 'bold 22px monospace';
        ctx.fillText(kpi.val, kx + 16, kpiY + 50);

        ctx.fillStyle = '#64748b';
        ctx.font = '10.5px sans-serif';
        ctx.fillText(kpi.sub, kx + 16, kpiY + 68);
      });

      // Split Test Comparison Board
      const boardY = 160;
      const boardH = 340;
      ctx.fillStyle = '#171c26';
      ctx.strokeStyle = '#273142';
      ctx.lineWidth = 1;
      if (ctx.roundRect) ctx.roundRect(36, boardY, c.width - 72, boardH, 12);
      else ctx.fillRect(36, boardY, c.width - 72, boardH);
      ctx.fill(); ctx.stroke();

      // Board Header
      ctx.fillStyle = '#202735';
      if (ctx.roundRect) ctx.roundRect(36, boardY, c.width - 72, 42, [12, 12, 0, 0]);
      else ctx.fillRect(36, boardY, c.width - 72, 42);
      ctx.fill();

      ctx.fillStyle = '#cbd5e1';
      ctx.font = 'bold 12px monospace';
      ctx.fillText('ONE VARIABLE A/B TEST : FRAME MATERIAL & FINISH (COPY & LINK CONSTANT)', 56, boardY + 26);

      // 3 Test Rows
      const rows = [
        {
          name: 'Wood (Natural Ash Finish)',
          tag: '★ PRIMARY WINNER',
          tagBg: 'rgba(74, 222, 128, 0.2)',
          tagColor: '#4ade80',
          ctr: '5.26%',
          barW: 420,
          barColor: '#4ade80',
          clicks: '534 Clicks',
          atc: '42 ATC',
          cpc: '$0.39',
          action: 'PRIMARY FOCUS · SCALE TO HERO'
        },
        {
          name: 'Matcha (Organic Green Texture)',
          tag: 'RUNNER UP',
          tagBg: 'rgba(56, 189, 248, 0.2)',
          tagColor: '#38bdf8',
          ctr: '4.21%',
          barW: 336,
          barColor: '#38bdf8',
          clicks: '398 Clicks',
          atc: '26 ATC',
          cpc: '$0.50',
          action: 'SECONDARY VARIANT · KEEP FOR NICHES'
        },
        {
          name: 'Cork (Raw Surface Material)',
          tag: 'DEPRIORITIZED',
          tagBg: 'rgba(148, 163, 184, 0.15)',
          tagColor: '#94a3b8',
          ctr: '2.75%',
          barW: 220,
          barColor: '#64748b',
          clicks: '210 Clicks',
          atc: '10 ATC',
          cpc: '$0.90',
          action: 'PAUSE AD SPEND · REDUCE PRODUCTION'
        }
      ];

      let ry = boardY + 62;
      rows.forEach((r, idx) => {
        // Row container
        ctx.fillStyle = idx === 0 ? 'rgba(74, 222, 128, 0.05)' : '#1a202c';
        ctx.strokeStyle = idx === 0 ? 'rgba(74, 222, 128, 0.3)' : '#232c3d';
        ctx.lineWidth = 1;
        if (ctx.roundRect) ctx.roundRect(52, ry, c.width - 104, 76, 8);
        else ctx.fillRect(52, ry, c.width - 104, 76);
        ctx.fill(); ctx.stroke();

        // Variant Name & Tag
        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 14px -apple-system, BlinkMacSystemFont, "Hiragino Sans", sans-serif';
        ctx.fillText(r.name, 72, ry + 28);

        // Tag pill
        ctx.fillStyle = r.tagBg;
        if (ctx.roundRect) ctx.roundRect(320, ry + 13, 150, 22, 6);
        else ctx.fillRect(320, ry + 13, 150, 22);
        ctx.fill();
        ctx.fillStyle = r.tagColor;
        ctx.font = 'bold 10.5px monospace';
        ctx.fillText(r.tag, 332, ry + 28);

        // CTR Big text
        ctx.fillStyle = r.tagColor;
        ctx.font = 'bold 20px monospace';
        ctx.fillText(`CTR ${r.ctr}`, c.width - 240, ry + 30);

        // Progress Bar (CTR visual representation)
        const bx = 72;
        const by = ry + 44;
        ctx.fillStyle = '#263042';
        if (ctx.roundRect) ctx.roundRect(bx, by, 500, 14, 7);
        else ctx.fillRect(bx, by, 500, 14);
        ctx.fill();

        ctx.fillStyle = r.barColor;
        if (ctx.roundRect) ctx.roundRect(bx, by, r.barW, 14, 7);
        else ctx.fillRect(bx, by, r.barW, 14);
        ctx.fill();

        // Stats summary beside bar
        ctx.fillStyle = '#cbd5e1';
        ctx.font = '11.5px monospace';
        ctx.fillText(`${r.clicks}  |  ${r.atc}  |  CPC ${r.cpc}`, bx + 518, by + 11);

        // Action note right
        ctx.fillStyle = idx === 0 ? '#4ade80' : '#94a3b8';
        ctx.font = 'bold 10px monospace';
        ctx.fillText(r.action, c.width - 340, by + 11);

        ry += 90;
      });

      // Bottom Insight Box: "Pretty isn't enough."
      const insY = 518;
      const insH = 110;
      ctx.fillStyle = 'rgba(245, 158, 11, 0.08)';
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.35)';
      ctx.lineWidth = 1;
      if (ctx.roundRect) ctx.roundRect(36, insY, c.width - 72, insH, 10);
      else ctx.fillRect(36, insY, c.width - 72, insH);
      ctx.fill(); ctx.stroke();

      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 11px monospace';
      ctx.fillText('★ CORE DIRECTIVE : PRETTY ISN\'T ENOUGH. MOVE PEOPLE TO ACT.', 56, insY + 28);

      ctx.fillStyle = '#f1f5f9';
      ctx.font = '13.5px -apple-system, BlinkMacSystemFont, "Hiragino Sans", sans-serif';
      ctx.fillText('「どれが一番綺麗か」ではなく「どれが人を動かしたか」。WoodはCorkに対し+91.3%のクリック率を実証。', 56, insY + 54);
      ctx.fillText('直感や感覚を疑い、マーケットの冷徹な事実データ（CTR・ATC）に基づいてプロダクト方針を決定。', 56, insY + 76);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px monospace';
      ctx.fillText('MOFTAIL LLC · ZERO-INVENTORY POD ARCHITECTURE · US COMMERCE VERIFICATION', 56, insY + 98);

      const tex = new THREE.CanvasTexture(c);
      tex.encoding = THREE.sRGBEncoding;
      tex.generateMipmaps = true;
      return tex;
    } catch (err) {
      console.warn('Could not generate Moftail Ads canvas texture, fallback to null', err);
      return null;
    }
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
    anchor: createAnchorShieldTexture() || loadCleanTexture('./assets/anchor-xcode-simulator.png'),
    shopify: loadCleanTexture('./assets/moftail-shopify-admin.png'),
    ads: createMoftailAdsTexture() || loadCleanTexture('./assets/moftail-meta-ads.png'),
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
    tex.repeat.set(1.6, 1.6);
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
    tex.repeat.set(1.6, 1.6);
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
    tex.repeat.set(1.6, 1.6);
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

  // Helper 6: High-fidelity MacBook Air contact ambient occlusion shadow
  function createContactShadowTexture() {
    const c = document.createElement('canvas');
    c.width = 512;
    c.height = 512;
    const ctx = c.getContext('2d');

    // 1. Broad soft ambient occlusion falloff (multi-layer diffused blur)
    for (let r = 240; r >= 130; r -= 12) {
      const alpha = (1 - (r - 130) / 110) * 0.15;
      ctx.fillStyle = `rgba(0, 0, 0, ${alpha.toFixed(3)})`;
      ctx.beginPath();
      ctx.ellipse(256, 256, r * 0.95, r * 0.70, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // 2. Direct chassis rectangular ambient occlusion matching M2 MacBook Air footprint
    const bw = 370, bh = 264, cr = 24;
    const bx = (512 - bw) / 2, by = (512 - bh) / 2;
    for (let inset = 24; inset >= 0; inset -= 3) {
      const alpha = 0.40 + ((24 - inset) / 24) * 0.48;
      ctx.fillStyle = `rgba(0, 0, 0, ${alpha.toFixed(3)})`;
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(bx + inset, by + inset, bw - inset * 2, bh - inset * 2, Math.max(2, cr - inset));
      } else {
        const rx = bx + inset, ry = by + inset, rw = bw - inset * 2, rh = bh - inset * 2, rad = Math.max(2, cr - inset);
        ctx.moveTo(rx + rad, ry);
        ctx.lineTo(rx + rw - rad, ry);
        ctx.quadraticCurveTo(rx + rw, ry, rx + rw, ry + rad);
        ctx.lineTo(rx + rw, ry + rh - rad);
        ctx.quadraticCurveTo(rx + rw, ry + rh, rx + rw - rad, ry + rh);
        ctx.lineTo(rx + rad, ry + rh);
        ctx.quadraticCurveTo(rx, ry + rh, rx, ry + rh - rad);
        ctx.lineTo(rx, ry + rad);
        ctx.quadraticCurveTo(rx, ry, rx + rad, ry);
      }
      ctx.fill();
    }

    // 3. Dense contact spots directly under the 4 rubber feet
    const feet = [
      [bx + 42, by + 38],
      [bx + bw - 42, by + 38],
      [bx + 42, by + bh - 38],
      [bx + bw - 42, by + bh - 38]
    ];
    feet.forEach(([fx, fy]) => {
      const footGrad = ctx.createRadialGradient(fx, fy, 4, fx, fy, 34);
      footGrad.addColorStop(0, 'rgba(0, 0, 0, 0.98)');
      footGrad.addColorStop(0.45, 'rgba(0, 0, 0, 0.85)');
      footGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = footGrad;
      ctx.beginPath();
      ctx.arc(fx, fy, 34, 0, Math.PI * 2);
      ctx.fill();
    });

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
  // Extended forward (depth 5.60, centered at Z = 1.20) so the tabletop extends
  // seamlessly from the hutch wall (Z = -1.60) through and beyond the bottom of the viewport (Z = +4.00),
  // completely eliminating any floating gap or empty void under the front edge!
  const deskTopShape = createRoundedRectShape(7.6, 5.6, 0.12);
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
  deskSurfaceMesh.position.set(0, -0.140, 1.20);
  deskSurfaceMesh.receiveShadow = true;
  deskGroup.add(deskSurfaceMesh);

  // Under-desk structural steel frame crossbeam for realistic grounded architecture
  const underDeskFrame = new THREE.Mesh(new THREE.BoxGeometry(5.4, 0.06, 0.10), steelLegMaterial);
  underDeskFrame.position.set(0, -0.170, 0.20);
  underDeskFrame.castShadow = true;
  underDeskFrame.receiveShadow = true;
  deskGroup.add(underDeskFrame);

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
  clockGroup.position.set(-2.15, 0.118, -0.38);
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

  const fullMatShape = createRoundedRectShape(4.24, 2.15, 0.14);
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
  const leftX = -2.112;
  const rightX = -0.650;
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
  const contactShadowMesh = new THREE.Mesh(new THREE.PlaneGeometry(2.65, 1.95), contactShadowMaterial);
  contactShadowMesh.rotateX(-Math.PI / 2);
  contactShadowMesh.position.set(0, -0.0350, 0.0);
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

  /* ==========================================================================
     3D iPad Pro M4 & Apple Pencil 2 (Interactive Engineering Note Mode)
     ========================================================================== */
  const ipadMasterGroup = new THREE.Group();
  const ipadBodyGroup = new THREE.Group();
  ipadMasterGroup.add(ipadBodyGroup);

  // iPad Dimensions (scale ~1:1 with real 13" iPad Pro beside 2.25-width MacBook Air)
  const ipadW = 1.16;
  const ipadH = 1.58;
  const ipadDepth = 0.022;
  const ipadRadius = 0.065;

  // Unibody chassis shape with rounded corners
  const ipadShape = new THREE.Shape();
  const hw = ipadW / 2, hh = ipadH / 2, ir = ipadRadius;
  ipadShape.moveTo(-hw + ir, -hh);
  ipadShape.lineTo(hw - ir, -hh);
  ipadShape.quadraticCurveTo(hw, -hh, hw, -hh + ir);
  ipadShape.lineTo(hw, hh - ir);
  ipadShape.quadraticCurveTo(hw, hh, hw - ir, hh);
  ipadShape.lineTo(-hw + ir, hh);
  ipadShape.quadraticCurveTo(-hw, hh, -hw, hh - ir);
  ipadShape.lineTo(-hw, -hh + ir);
  ipadShape.quadraticCurveTo(-hw, -hh, -hw + ir, -hh);

  const ipadExtrudeSettings = {
    steps: 1,
    depth: ipadDepth,
    bevelEnabled: true,
    bevelThickness: 0.004,
    bevelSize: 0.004,
    bevelOffset: 0,
    bevelSegments: 3
  };
  const ipadChassisGeo = new THREE.ExtrudeGeometry(ipadShape, ipadExtrudeSettings);
  ipadChassisGeo.center();

  // Space Gray / Midnight anodized aluminum material
  const ipadAlumMat = new THREE.MeshPhysicalMaterial({
    color: 0x1d2127,
    roughness: 0.28,
    metalness: 0.88,
    clearcoat: 0.25,
    clearcoatRoughness: 0.35
  });
  const ipadChassisMesh = new THREE.Mesh(ipadChassisGeo, ipadAlumMat);
  ipadChassisMesh.castShadow = true;
  ipadChassisMesh.receiveShadow = true;
  ipadBodyGroup.add(ipadChassisMesh);

  // Rear Camera bump
  const camBumpGeo = new THREE.BoxGeometry(0.18, 0.18, 0.008);
  const camBumpMesh = new THREE.Mesh(camBumpGeo, ipadAlumMat);
  camBumpMesh.position.set(-hw + 0.14, hh - 0.14, -ipadDepth / 2 - 0.004);
  ipadBodyGroup.add(camBumpMesh);

  // Dynamic High-Res CanvasTexture for iPad Screen
  const ipadCanvas = document.createElement('canvas');
  ipadCanvas.width = 1536;
  ipadCanvas.height = 2048;
  const ipadCtx = ipadCanvas.getContext('2d');

  const ipadScreenTex = new THREE.CanvasTexture(ipadCanvas);
  ipadScreenTex.colorSpace = THREE.SRGBColorSpace;
  ipadScreenTex.generateMipmaps = true;
  ipadScreenTex.minFilter = THREE.LinearMipmapLinearFilter;
  ipadScreenTex.magFilter = THREE.LinearFilter;
  if (renderer.capabilities && renderer.capabilities.getMaxAnisotropy) {
    ipadScreenTex.anisotropy = renderer.capabilities.getMaxAnisotropy();
  }

  // Active Screen display plane (perfect 3:4 aspect ratio matching 1536x2048 canvas)
  const screenW = 1.08;
  const screenH = 1.44;
  const ipadScreenGeo = new THREE.PlaneGeometry(screenW, screenH);
  // Using MeshBasicMaterial with toneMapped: false guarantees self-illumination, zero shadow occlusion, and crystal clarity!
  const ipadScreenMat = new THREE.MeshBasicMaterial({
    map: ipadScreenTex,
    toneMapped: false,
    transparent: true
  });
  const ipadScreenMesh = new THREE.Mesh(ipadScreenGeo, ipadScreenMat);
  ipadScreenMesh.position.set(0, 0, ipadDepth / 2 + 0.0020);
  ipadBodyGroup.add(ipadScreenMesh);

  // Sleek Black Screen Bezel border plane behind the screen
  const bezelGeo = new THREE.PlaneGeometry(ipadW - 0.010, ipadH - 0.010);
  const bezelMat = new THREE.MeshBasicMaterial({ color: 0x08090c, transparent: true });
  const bezelMesh = new THREE.Mesh(bezelGeo, bezelMat);
  bezelMesh.position.set(0, 0, ipadDepth / 2 + 0.0010);
  ipadBodyGroup.add(bezelMesh);

  // Front camera dot on top bezel
  const frontCamDot = new THREE.Mesh(
    new THREE.CircleGeometry(0.006, 16),
    new THREE.MeshBasicMaterial({ color: 0x020305 })
  );
  frontCamDot.position.set(0, hh - 0.024, ipadDepth / 2 + 0.0022);
  ipadBodyGroup.add(frontCamDot);

  // Magnetic Pencil charging strip on right edge
  const magnetStrip = new THREE.Mesh(
    new THREE.PlaneGeometry(0.006, 0.50),
    new THREE.MeshStandardMaterial({ color: 0x121418, roughness: 0.5, metalness: 0.8 })
  );
  magnetStrip.rotateY(Math.PI / 2);
  magnetStrip.position.set(hw + 0.002, 0, 0);
  ipadBodyGroup.add(magnetStrip);

  // --- 3D Precision Aluminum Stand for iPad Pro ---
  const ipadStandGroup = new THREE.Group();
  deskGroup.add(ipadStandGroup);

  // Stand Base: Chamfered rectangular plate on the desk mat
  const standBaseGeo = new THREE.BoxGeometry(0.55, 0.016, 0.42);
  const standBaseMesh = new THREE.Mesh(standBaseGeo, ipadAlumMat);
  standBaseMesh.position.set(-1.26, -0.0355 + 0.008, 0.05);
  standBaseMesh.rotation.y = 0.14;
  standBaseMesh.receiveShadow = true;
  standBaseMesh.castShadow = true;
  ipadStandGroup.add(standBaseMesh);

  // Stand Upright Spine: Slender angled column rising from base
  const standArmGeo = new THREE.BoxGeometry(0.12, 0.82, 0.018);
  const standArmMesh = new THREE.Mesh(standArmGeo, ipadAlumMat);
  standArmMesh.position.set(-1.26, 0.38, 0.02);
  standArmMesh.rotation.set(-0.28, 0.14, 0.0);
  standArmMesh.castShadow = true;
  standArmMesh.receiveShadow = true;
  ipadStandGroup.add(standArmMesh);

  // Stand Magnetic Backplate
  const standHeadGeo = new THREE.BoxGeometry(0.42, 0.32, 0.014);
  const standHeadMesh = new THREE.Mesh(standHeadGeo, ipadAlumMat);
  standHeadMesh.position.set(-1.26, 0.78, 0.05 - 0.020);
  standHeadMesh.rotation.set(-0.28, 0.14, 0.0);
  standHeadMesh.castShadow = true;
  ipadStandGroup.add(standHeadMesh);

  // Stand Contact Shadow on the felt desk mat
  const standShadowGeo = new THREE.PlaneGeometry(0.68, 0.54);
  standShadowGeo.rotateX(-Math.PI / 2);
  const standShadowMat = new THREE.MeshBasicMaterial({
    map: createContactShadowTexture(),
    transparent: true,
    opacity: 0.45,
    depthWrite: false
  });
  const standShadowMesh = new THREE.Mesh(standShadowGeo, standShadowMat);
  standShadowMesh.position.set(-1.26, -0.0345, 0.05);
  standShadowMesh.rotation.set(0, 0.14, 0);
  ipadStandGroup.add(standShadowMesh);

  // --- 3D Apple Pencil (2nd Generation / Pro) ---
  const pencilGroup = new THREE.Group();
  ipadMasterGroup.add(pencilGroup);

  const pencilBodyLength = 0.58;
  const pencilRadius = 0.014;

  const pencilBodyGeo = new THREE.CylinderGeometry(pencilRadius, pencilRadius, pencilBodyLength, 32);
  const pencilMat = new THREE.MeshPhysicalMaterial({
    color: 0xf6f6f8,
    roughness: 0.26,
    metalness: 0.04,
    clearcoat: 0.25,
    clearcoatRoughness: 0.35
  });
  const pencilBodyMesh = new THREE.Mesh(pencilBodyGeo, pencilMat);
  pencilBodyMesh.castShadow = true;
  pencilGroup.add(pencilBodyMesh);

  // Pencil Tip Cone
  const tipLength = 0.055;
  const pencilTipGeo = new THREE.CylinderGeometry(pencilRadius * 0.2, pencilRadius, tipLength, 32);
  const pencilTipMesh = new THREE.Mesh(pencilTipGeo, pencilMat);
  pencilTipMesh.position.y = -pencilBodyLength / 2 - tipLength / 2;
  pencilTipMesh.castShadow = true;
  pencilGroup.add(pencilTipMesh);

  // Graphite fine drawing nib
  const nibLength = 0.014;
  const nibGeo = new THREE.ConeGeometry(pencilRadius * 0.22, nibLength, 16);
  const nibMat = new THREE.MeshStandardMaterial({
    color: 0x28292c,
    roughness: 0.65,
    metalness: 0.05
  });
  const nibMesh = new THREE.Mesh(nibGeo, nibMat);
  nibMesh.position.y = -pencilBodyLength / 2 - tipLength - nibLength / 2;
  nibMesh.rotation.x = Math.PI;
  pencilGroup.add(nibMesh);

  // Pencil Top Cap
  const capGeo = new THREE.SphereGeometry(pencilRadius, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2);
  const capMesh = new THREE.Mesh(capGeo, pencilMat);
  capMesh.position.y = pencilBodyLength / 2;
  pencilGroup.add(capMesh);

  // Pencil Tip Soft Amber Glow Indicator
  const pencilTipGlow = new THREE.PointLight(0xff7722, 0.20, 0.45, 2.0);
  pencilTipGlow.position.set(0, -pencilBodyLength / 2 - tipLength - nibLength, 0);
  pencilGroup.add(pencilTipGlow);

  deskGroup.add(ipadMasterGroup);

  // Mount 3D iPad Pro in vertical portrait orientation propped up on stand
  ipadMasterGroup.position.set(-1.26, 0.78, 0.05);
  ipadMasterGroup.rotation.set(-0.28, 0.14, 0.0);

  // Apple Pencil magnetically attached to the right edge facing the MacBook
  pencilGroup.position.set(hw + 0.020, 0.04, 0.0);
  pencilGroup.rotation.set(0, 0, 0);

  // --- Dynamic High-DPI iPad Studio Screen Rendering Engine ---
  let currentIpadSlide = 1;

  function renderIpadScreen(slideIndex) {
    const w = 1536;
    const h = 2048;
    const ctx = ipadCtx;

    // 1. Deep Obsidian / Dark Slate Background
    ctx.fillStyle = '#0f1117';
    ctx.fillRect(0, 0, w, h);

    // Subtle technical grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
    ctx.lineWidth = 1.5;
    for (let y = 140; y < h - 80; y += 48) {
      ctx.beginPath();
      ctx.moveTo(80, y);
      ctx.lineTo(w - 80, y);
      ctx.stroke();
    }
    for (let x = 80; x < w - 80; x += 48) {
      ctx.beginPath();
      ctx.moveTo(x, 140);
      ctx.lineTo(x, h - 80);
      ctx.stroke();
    }

    // Warm margin accent guide
    ctx.strokeStyle = 'rgba(194, 91, 44, 0.28)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(120, 100);
    ctx.lineTo(120, h - 80);
    ctx.stroke();

    // Fonts definition
    const titleFont = '700 52px "Inter", "Noto Sans JP", sans-serif';
    const subFont = '400 32px "Inter", "Noto Sans JP", sans-serif';
    const handFont = '"Zen Kurenaido", "Caveat", "Noto Sans JP", cursive, sans-serif';
    const codeFont = '"JetBrains Mono", "Courier New", monospace';
    const microFont = '600 22px "Inter", sans-serif';

    // 2. Status & Navigation Header Bar
    let badgeText = '01 / ANCHOR';
    let categoryText = 'COGNITIVE ACCESSIBILITY ARCHITECTURE';
    if (slideIndex === 2) {
      badgeText = '02 / MOFTAIL · 01';
      categoryText = 'US D2C COMMERCE · MARKET VALIDATION';
    } else if (slideIndex === 3) {
      badgeText = '02 / MOFTAIL · 02';
      categoryText = 'PAID TRAFFIC · A/B TEST DATA METRICS';
    } else if (slideIndex === 4) {
      badgeText = '02 / MOFTAIL · 03';
      categoryText = 'BRAND PHILOSOPHY & BALANCE OF LIFE';
    } else if (slideIndex === 5) {
      badgeText = '03 / CLIENT WORK';
      categoryText = 'SHOPIFY THEME DEV · $30/H PAID TRIAL';
    }

    // Draw Left Pill Badge
    ctx.fillStyle = '#c25b2c';
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(140, 60, 240, 48, 24);
    else ctx.rect(140, 60, 240, 48);
    ctx.fill();

    ctx.font = '700 24px "Inter", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(badgeText, 164, 93);

    // Category
    ctx.font = microFont;
    ctx.fillStyle = '#8e867b';
    ctx.fillText(categoryText, 410, 93);

    // Right Status
    ctx.font = '500 22px "Inter", sans-serif';
    ctx.fillStyle = '#c25b2c';
    ctx.fillText('● 9:41 AM · STUDIO DUAL', w - 420, 93);

    // Header Divider
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(100, 130);
    ctx.lineTo(w - 100, 130);
    ctx.stroke();

    // 3. Main Headline & Content by Slide
    if (slideIndex === 1) {
      // --- SLIDE 1: ANCHOR ---
      ctx.font = titleFont;
      ctx.fillStyle = '#f8efe0';
      ctx.fillText('声が出せない危機の瞬間に、', 140, 220);
      ctx.fillText('必要な支援をワンタップで相手へ届ける。', 140, 290);

      ctx.font = subFont;
      ctx.fillStyle = 'rgba(248, 239, 224, 0.82)';
      ctx.fillText('パニック時の“沈黙”を前提に、何もない平時に未来の自分の盾を備える。', 140, 360);

      // Thinking Log Card
      ctx.fillStyle = 'rgba(22, 25, 34, 0.88)';
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(140, 420, w - 280, 260, 18);
      else ctx.rect(140, 420, w - 280, 260);
      ctx.fill();
      ctx.strokeStyle = 'rgba(194, 91, 44, 0.40)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.font = '700 22px "Inter", sans-serif';
      ctx.fillStyle = '#ff7733';
      ctx.fillText('✎ RAW THOUGHT / 思考ログ', 170, 460);

      ctx.font = '400 34px ' + handFont;
      ctx.fillStyle = '#f5edd6';
      ctx.fillText('「パニックの最中、人は言葉を失う。音が刺さり、判断が止まる。」', 170, 520);
      ctx.fillText('「本人に操作を頑張らせない。何もない平時のうちに未来の自分の盾を作る。」', 170, 580);
      ctx.fillText('「助けを求める行為そのものが最も高い認知負荷になる矛盾をなくす。」', 170, 640);

      // Technical Showcase: Emergency Shield Active Card
      ctx.fillStyle = 'rgba(26, 14, 12, 0.92)';
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(140, 720, w - 280, 940, 22);
      else ctx.rect(140, 720, w - 280, 940);
      ctx.fill();
      ctx.strokeStyle = 'rgba(235, 60, 40, 0.65)';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Shield Active Red Badge
      ctx.fillStyle = 'rgba(220, 40, 20, 0.25)';
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(180, 760, 360, 54, 12);
      else ctx.rect(180, 760, 360, 54);
      ctx.fill();
      ctx.font = '800 26px "Inter", sans-serif';
      ctx.fillStyle = '#ff4433';
      ctx.fillText('SHIELD PROTOCOL ACTIVE', 204, 796);

      // Big Emergency Message
      ctx.font = '700 46px ' + handFont;
      ctx.fillStyle = '#ffffff';
      ctx.fillText('「声が出せません。静かな場所へ移動させてください」', 180, 890);

      // 4 Key Architectural Points
      const specs1 = [
        '発作時の操作負荷ゼロ：ワンタップで全画面SOSカードに切替',
        '視野狭窄に対応する高コントラスト黒赤デュアルカラー設計',
        '触覚（Haptics）フィードバックにより視覚遮断時も起動を確認可能',
        'オフライン完結：機内モードでもローカルストレージから即座に起動'
      ];
      ctx.font = '400 32px "Inter", "Noto Sans JP", sans-serif';
      specs1.forEach((text, i) => {
        ctx.fillStyle = '#4ade80';
        ctx.fillText('✓', 180, 990 + i * 75);
        ctx.fillStyle = 'rgba(248, 239, 224, 0.90)';
        ctx.fillText(text, 225, 990 + i * 75);
      });

      // Wireframe QR Box
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
      ctx.lineWidth = 2;
      ctx.strokeRect(180, 1330, 220, 220);
      ctx.font = '500 24px ' + codeFont;
      ctx.fillStyle = '#8e867b';
      ctx.fillText('EMERGENCY QR', 205, 1435);
      ctx.fillText('(OFFLINE V-CARD)', 195, 1475);

      ctx.font = '400 32px ' + handFont;
      ctx.fillStyle = 'rgba(248, 239, 224, 0.85)';
      ctx.fillText('救急隊員・周囲の人へ渡すだけで完結するエマージェンシースクリーン。', 440, 1400);
      ctx.fillText('日常の安心を、コードで具体化する。', 440, 1470);

    } else if (slideIndex === 2) {
      // --- SLIDE 2: MOFTAIL STOREFRONT ---
      ctx.font = titleFont;
      ctx.fillStyle = '#f8efe0';
      ctx.fillText('自分の「良い」ではなく、', 140, 220);
      ctx.fillText('市場が実際に動いた数字で意思決定する。', 140, 290);

      ctx.font = subFont;
      ctx.fillStyle = 'rgba(248, 239, 224, 0.82)';
      ctx.fillText('米国向けD2Cブランドを実運用し、主観とマーケットの冷徹な事実の差を直視した。', 140, 360);

      // Thinking Log Card
      ctx.fillStyle = 'rgba(22, 25, 34, 0.88)';
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(140, 420, w - 280, 260, 18);
      else ctx.rect(140, 420, w - 280, 260);
      ctx.fill();
      ctx.strokeStyle = 'rgba(194, 91, 44, 0.40)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.font = '700 22px "Inter", sans-serif';
      ctx.fillStyle = '#ff7733';
      ctx.fillText('✎ RAW THOUGHT / 思考ログ', 170, 460);

      ctx.font = '400 34px ' + handFont;
      ctx.fillStyle = '#f5edd6';
      ctx.fillText('「『自分の良い』≠『市場の数字』」', 170, 520);
      ctx.fillText('「一番綺麗なものを作るな。人を動かすものを作れ。」', 170, 580);
      ctx.fillText('「在庫リスクを持たずに最速で仮説をぶつけ、リアルな行動データを得る。」', 170, 640);

      // Technical Showcase: Supply Chain & Market Validation
      ctx.fillStyle = 'rgba(18, 23, 30, 0.92)';
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(140, 720, w - 280, 940, 22);
      else ctx.rect(140, 720, w - 280, 940);
      ctx.fill();
      ctx.strokeStyle = 'rgba(110, 231, 183, 0.50)';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      ctx.fillStyle = 'rgba(110, 231, 183, 0.20)';
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(180, 760, 380, 54, 12);
      else ctx.rect(180, 760, 380, 54);
      ctx.fill();
      ctx.font = '800 26px "Inter", sans-serif';
      ctx.fillStyle = '#6ee7b7';
      ctx.fillText('ZERO-INVENTORY PIPELINE', 204, 796);

      // Diagram Box
      ctx.fillStyle = 'rgba(10, 13, 18, 0.85)';
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(180, 850, w - 360, 200, 16);
      else ctx.rect(180, 850, w - 360, 200);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.font = '600 28px ' + codeFont;
      ctx.fillStyle = '#9cdcfe';
      ctx.fillText('[ Shopify Storefront ]', 220, 920);
      ctx.fillStyle = '#ce9178';
      ctx.fillText('── (REST Webhook) ──>', 570, 920);
      ctx.fillStyle = '#4ade80';
      ctx.fillText('[ Printify POD ]', 980, 920);

      ctx.font = '400 24px "Inter", sans-serif';
      ctx.fillStyle = '#8e867b';
      ctx.fillText('US Direct-to-Consumer / Zero Upfront Capital / Global Automated Fulfillment', 220, 980);

      // 4 Key Learnings
      const specs2 = [
        '在庫リスク完全ゼロ：注文が入ってから自動オンデマンド製造＆即発送',
        'カート離脱（Abandonment）要因の特定：配送コスト摩擦（$8.99+）を検出',
        '主観的なこだわりを捨て、顧客が実際に支払う価格感度を計測',
        'デザインが優れているだけでは売れないというビジネスの冷徹な現実を体得'
      ];
      ctx.font = '400 32px "Inter", "Noto Sans JP", sans-serif';
      specs2.forEach((text, i) => {
        ctx.fillStyle = '#6ee7b7';
        ctx.fillText('✓', 180, 1150 + i * 75);
        ctx.fillStyle = 'rgba(248, 239, 224, 0.90)';
        ctx.fillText(text, 225, 1150 + i * 75);
      });

      ctx.font = '600 36px ' + handFont;
      ctx.fillStyle = '#ff9944';
      ctx.fillText('「失敗を恐れず市場に晒す。真実の答えはユーザーのクリックにしかない。」', 180, 1530);

    } else if (slideIndex === 3) {
      // --- SLIDE 3: MOFTAIL META ADS ---
      ctx.font = titleFont;
      ctx.fillStyle = '#f8efe0';
      ctx.fillText('変える要素を1つに絞り、', 140, 220);
      ctx.fillText('クリックと行動の差をデータで掴む。', 140, 290);

      ctx.font = subFont;
      ctx.fillStyle = 'rgba(248, 239, 224, 0.82)';
      ctx.fillText('Wood（木目）がCTR 5.26%を記録し主軸へ昇格。主観ではなく実測データが次を決める。', 140, 360);

      // Thinking Log Card
      ctx.fillStyle = 'rgba(22, 25, 34, 0.88)';
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(140, 420, w - 280, 260, 18);
      else ctx.rect(140, 420, w - 280, 260);
      ctx.fill();
      ctx.strokeStyle = 'rgba(194, 91, 44, 0.40)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.font = '700 22px "Inter", sans-serif';
      ctx.fillStyle = '#ff7733';
      ctx.fillText('✎ RAW THOUGHT / 思考ログ', 170, 460);

      ctx.font = '400 34px ' + handFont;
      ctx.fillStyle = '#f5edd6';
      ctx.fillText('「変数を『素材の質感』1点に限定してMeta広告を出稿。明確な差が出た。」', 170, 520);
      ctx.fillText('「自分が推していたCork（コルク）が最下位。直感は平気で裏切る。」', 170, 580);
      ctx.fillText('「感覚で議論するな。データで次の手を決める。」', 170, 640);

      // Technical Showcase: Real A/B Test CTR Bar Chart & Stats
      ctx.fillStyle = 'rgba(16, 22, 32, 0.92)';
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(140, 720, w - 280, 940, 22);
      else ctx.rect(140, 720, w - 280, 940);
      ctx.fill();
      ctx.strokeStyle = 'rgba(96, 165, 250, 0.55)';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      ctx.fillStyle = 'rgba(96, 165, 250, 0.22)';
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(180, 760, 360, 54, 12);
      else ctx.rect(180, 760, 360, 54);
      ctx.fill();
      ctx.font = '800 26px "Inter", sans-serif';
      ctx.fillStyle = '#60a5fa';
      ctx.fillText('REAL CAMPAIGN METRICS', 204, 796);

      // Stat row
      ctx.font = '700 32px ' + codeFont;
      ctx.fillStyle = '#ffffff';
      ctx.fillText('TOTAL SPEND: $597.87', 180, 870);
      ctx.fillStyle = '#9cdcfe';
      ctx.fillText('·  ATC: 78件  ·  PURCHASE: 0件', 640, 870);

      // CTR Bar Chart
      const barY = 940;
      // 1. Wood
      ctx.font = '600 30px "Inter", sans-serif';
      ctx.fillStyle = '#4ade80';
      ctx.fillText('WOOD (木目調)', 180, barY);
      ctx.fillStyle = 'rgba(74, 222, 128, 0.25)';
      ctx.fillRect(440, barY - 26, 680, 36);
      ctx.fillStyle = '#4ade80';
      ctx.fillRect(440, barY - 26, 680 * (5.26 / 6.0), 36);
      ctx.fillText('5.26% CTR  [★ WINNER]', 1080, barY);

      // 2. Matcha
      ctx.font = '600 30px "Inter", sans-serif';
      ctx.fillStyle = '#60a5fa';
      ctx.fillText('MATCHA (抹茶調)', 180, barY + 80);
      ctx.fillStyle = 'rgba(96, 165, 250, 0.25)';
      ctx.fillRect(440, barY + 80 - 26, 680, 36);
      ctx.fillStyle = '#60a5fa';
      ctx.fillRect(440, barY + 80 - 26, 680 * (4.21 / 6.0), 36);
      ctx.fillText('4.21% CTR', 1080, barY + 80);

      // 3. Cork
      ctx.font = '600 30px "Inter", sans-serif';
      ctx.fillStyle = '#8e867b';
      ctx.fillText('CORK (コルク調)', 180, barY + 160);
      ctx.fillStyle = 'rgba(142, 134, 123, 0.25)';
      ctx.fillRect(440, barY + 160 - 26, 680, 36);
      ctx.fillStyle = '#8e867b';
      ctx.fillRect(440, barY + 160 - 26, 680 * (2.75 / 6.0), 36);
      ctx.fillText('2.75% CTR', 1080, barY + 160);

      // Findings Box
      ctx.fillStyle = 'rgba(10, 14, 22, 0.85)';
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(180, 1240, w - 360, 220, 16);
      else ctx.rect(180, 1240, w - 360, 220);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.font = '500 28px "Inter", "Noto Sans JP", sans-serif';
      ctx.fillStyle = 'rgba(248, 239, 224, 0.92)';
      ctx.fillText('・変数を「素材の質感」のみに限定したため、勝因がクリアに特定できた。', 210, 1295);
      ctx.fillText('・木目がコルクの1.91倍の反応を獲得。クリエイティブの主軸へ即時昇格。', 210, 1355);
      ctx.fillText('・78件のカート追加（ATC）に対し購入ゼロ：決済UIの配送摩擦を特定。', 210, 1415);

      ctx.font = '600 36px ' + handFont;
      ctx.fillStyle = '#ffaa33';
      ctx.fillText('「データは嘘をつかない。冷徹な数字こそが、次に進む勇気をくれる。」', 180, 1540);

    } else if (slideIndex === 4) {
      // --- SLIDE 4: MOFTAIL POD ---
      ctx.font = titleFont;
      ctx.fillStyle = '#f8efe0';
      ctx.fillText('綺麗さだけでは人は動かない。', 140, 220);
      ctx.fillText('思想を事業として成立させるために検証を重ねる。', 140, 290);

      ctx.font = subFont;
      ctx.fillStyle = 'rgba(248, 239, 224, 0.82)';
      ctx.fillText('AI時代に自分を取り戻す『Balance of Life』を掲げ、勝つビジュアルと事業性を両立。', 140, 360);

      // Thinking Log Card
      ctx.fillStyle = 'rgba(22, 25, 34, 0.88)';
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(140, 420, w - 280, 260, 18);
      else ctx.rect(140, 420, w - 280, 260);
      ctx.fill();
      ctx.strokeStyle = 'rgba(194, 91, 44, 0.40)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.font = '700 22px "Inter", sans-serif';
      ctx.fillStyle = '#ff7733';
      ctx.fillText('✎ RAW THOUGHT / 思考ログ', 170, 460);

      ctx.font = '400 34px ' + handFont;
      ctx.fillStyle = '#f5edd6';
      ctx.fillText('"The best mockup is not the prettiest one. It is the one that moves people to act."', 170, 520);
      ctx.fillText('「AI時代だからこそ、静けさと調和を服とビジュアルに宿す。」', 170, 580);
      ctx.fillText('「思想だけでは事業にならない。だから数字で証明する。」', 170, 640);

      // Technical Showcase: Brand Philosophy & Viability
      ctx.fillStyle = 'rgba(22, 20, 28, 0.92)';
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(140, 720, w - 280, 940, 22);
      else ctx.rect(140, 720, w - 280, 940);
      ctx.fill();
      ctx.strokeStyle = 'rgba(165, 180, 252, 0.55)';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      ctx.fillStyle = 'rgba(165, 180, 252, 0.22)';
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(180, 760, 360, 54, 12);
      else ctx.rect(180, 760, 360, 54);
      ctx.fill();
      ctx.font = '800 26px "Inter", sans-serif';
      ctx.fillStyle = '#a5b4fc';
      ctx.fillText('PHILOSOPHY & PROOF', 204, 796);

      // Quote Banner
      ctx.fillStyle = 'rgba(12, 10, 16, 0.85)';
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(180, 850, w - 360, 160, 16);
      else ctx.rect(180, 850, w - 360, 160);
      ctx.fill();
      ctx.strokeStyle = 'rgba(165, 180, 252, 0.3)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.font = '700 36px "Inter", sans-serif';
      ctx.fillStyle = '#ffeed8';
      ctx.fillText('“ PRETTY ISN’T ENOUGH. MAKE IT MOVE PEOPLE. ”', 220, 940);

      // 3 Pillars
      const pillars = [
        { label: '01. 静けさと調和', desc: 'AI時代に押し寄せる情報ノイズに対し、生活空間に溶け込む上質な世界観を追求。' },
        { label: '02. 勝つビジュアル', desc: '単なる服の画像ではなく、身に纏ったときの安心感や手触りまで想起させる演出。' },
        { label: '03. 思想の事業化', desc: 'どれほど美しい思想も、売上が立たなければ続かない。持続可能な供給網で支える。' }
      ];

      pillars.forEach((p, i) => {
        const py = 1070 + i * 130;
        ctx.fillStyle = '#a5b4fc';
        ctx.font = '700 30px "Inter", "Noto Sans JP", sans-serif';
        ctx.fillText(p.label, 180, py);
        ctx.fillStyle = 'rgba(248, 239, 224, 0.88)';
        ctx.font = '400 28px "Inter", "Noto Sans JP", sans-serif';
        ctx.fillText(p.desc, 180, py + 46);
      });

      ctx.font = '600 36px ' + handFont;
      ctx.fillStyle = '#ffaa33';
      ctx.fillText('「美学と収益性は対立しない。両者が揃ったとき、ブランドは永続する。」', 180, 1530);

    } else if (slideIndex === 5) {
      // --- SLIDE 5: SHOPIFY THEME CLIENT WORK ---
      ctx.font = titleFont;
      ctx.fillStyle = '#f8efe0';
      ctx.fillText('「仕様です」という回答の違和感を突き詰め、', 140, 220);
      ctx.fillText('修正コードを添えて時給30ドルの有償案件に変えた。', 140, 290);

      ctx.font = subFont;
      ctx.fillStyle = 'rgba(248, 239, 224, 0.82)';
      ctx.fillText('ストア運営で見つけた不具合を自らコード解析し、海外開発元から14タスクを受注。', 140, 360);

      // Thinking Log Card
      ctx.fillStyle = 'rgba(22, 25, 34, 0.88)';
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(140, 420, w - 280, 260, 18);
      else ctx.rect(140, 420, w - 280, 260);
      ctx.fill();
      ctx.strokeStyle = 'rgba(194, 91, 44, 0.40)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.font = '700 22px "Inter", sans-serif';
      ctx.fillStyle = '#ff7733';
      ctx.fillText('✎ RAW THOUGHT / 思考ログ', 170, 460);

      ctx.font = '400 34px ' + handFont;
      ctx.fillStyle = '#f5edd6';
      ctx.fillText('「バリアント変更で価格が変わらない。『仕様です』の回答への強い違和感。」', 170, 520);
      ctx.fillText('「原因を特定し、英語レポート ＋ 再現手順 ＋ 修正コードを添えて送付。」', 170, 580);
      ctx.fillText('「開発元から時給30ドルの有償トライアル打診 -> 14個のタスクを任されることに。」', 170, 640);

      // Technical Showcase: Liquid Bug Code & Freelance Result
      ctx.fillStyle = 'rgba(16, 22, 30, 0.92)';
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(140, 720, w - 280, 940, 22);
      else ctx.rect(140, 720, w - 280, 940);
      ctx.fill();
      ctx.strokeStyle = 'rgba(96, 165, 250, 0.60)';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      ctx.fillStyle = 'rgba(96, 165, 250, 0.22)';
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(180, 760, 440, 54, 12);
      else ctx.rect(180, 760, 440, 54);
      ctx.fill();
      ctx.font = '800 26px "Inter", sans-serif';
      ctx.fillStyle = '#60a5fa';
      ctx.fillText('SHOPIFY THEME ENGINEERING', 204, 796);

      // Code Editor Box
      ctx.fillStyle = '#0c1017';
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(180, 850, w - 360, 360, 16);
      else ctx.rect(180, 850, w - 360, 360);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.font = '500 28px ' + codeFont;
      ctx.fillStyle = '#8e857b';
      ctx.fillText('01  {% comment %} price.liquid DOM Selector Fix {% endcomment %}', 210, 905);
      ctx.fillStyle = '#569cd6';
      ctx.fillText('02  assign', 210, 955);
      ctx.fillStyle = '#9cdcfe';
      ctx.fillText('target_variant = product.selected_or_first_available_variant', 320, 955);
      ctx.fillStyle = '#ce9178';
      ctx.fillText('03  <div class="price price--large" id="price-{{ section.id }}" data-instant-sync="true">', 210, 1005);
      ctx.fillStyle = '#dcdcaa';
      ctx.fillText('04    data-instant-variant-sync="true"', 250, 1055);
      ctx.fillStyle = '#ce9178';
      ctx.fillText('05    <span class="price-item price-item--regular">', 250, 1105);
      ctx.fillStyle = '#4ade80';
      ctx.fillText('06      {{ target_variant.price | money }}  <-- DOMセレクター修正！', 290, 1155);

      // Client Work Outcome Box
      ctx.fillStyle = 'rgba(10, 14, 22, 0.85)';
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(180, 1250, w - 360, 180, 16);
      else ctx.rect(180, 1250, w - 360, 180);
      ctx.fill();
      ctx.strokeStyle = 'rgba(74, 222, 128, 0.35)';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.font = '700 32px "Inter", sans-serif';
      ctx.fillStyle = '#4ade80';
      ctx.fillText('★ $30/H PAID FREELANCE TRIAL · 14 TASKS COMPLETED', 210, 1310);

      ctx.font = '400 28px "Inter", "Noto Sans JP", sans-serif';
      ctx.fillStyle = 'rgba(248, 239, 224, 0.90)';
      ctx.fillText('海外開発元のCTOから「うちのコードを触ってみないか？」と直接オファーを獲得。', 210, 1370);

      ctx.font = '600 36px ' + handFont;
      ctx.fillStyle = '#ffaa33';
      ctx.fillText('「技術は自分のためだけでなく、誰かの事業を前へ進めるために使える。」', 180, 1530);
    }

    // 5. Global Footer on iPad Screen
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(100, 1860);
    ctx.lineTo(w - 100, 1860);
    ctx.stroke();

    ctx.font = '600 24px "Inter", sans-serif';
    ctx.fillStyle = '#8e867b';
    ctx.fillText('RYUNOSUKE NAKAMURA · FACT BASE 2026', 140, 1920);

    // Slide indicator dots
    for (let d = 1; d <= 5; d++) {
      ctx.beginPath();
      ctx.arc(w - 240 + (d - 1) * 32, 1912, d === slideIndex ? 8 : 4, 0, Math.PI * 2);
      ctx.fillStyle = d === slideIndex ? '#ff7733' : 'rgba(255, 255, 255, 0.25)';
      ctx.fill();
    }

    ipadScreenTex.needsUpdate = true;
  }

  function updateIpadSlide(idx) {
    if (currentIpadSlide === idx) return;
    currentIpadSlide = idx;
    renderIpadScreen(idx);
  }

  // Initial render of default slide (Anchor)
  renderIpadScreen(1);

  if (document.fonts) {
    document.fonts.load('32px "Zen Kurenaido"').then(() => {
      renderIpadScreen(currentIpadSlide);
    });
    document.fonts.load('32px "Caveat"').then(() => {
      renderIpadScreen(currentIpadSlide);
    });
  }
  const floorTex = createHardwoodFloorTexture();
  const floorMat = new THREE.MeshStandardMaterial({
    map: floorTex,
    color: 0x5a4230,
    roughness: 0.85,
    metalness: 0.04
  });
  const floorGeo = new THREE.PlaneGeometry(20, 18);
  floorGeo.rotateX(-Math.PI / 2);
  const floorMesh = new THREE.Mesh(floorGeo, floorMat);
  floorMesh.position.set(0, -1.89, 1.5);
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
      if (m !== clockGlassMat && m !== frameGlassMat && m !== standShadowMat) {
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
      // Base rubber feet compress 2.2mm into the soft felt mat pile (-0.0385 Y),
      // bringing the bottom unibody plate flush to the mat (-0.0359 Y) with 0 floating gap.
      laptopGroup.position.set(0, -0.0022, 0);

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
      if (p === panel) {
        p.classList.add('active');
      } else {
        p.classList.remove('active');
      }
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
          updateIpadSlide(1);
        } else if (p >= 0.27 && p < 0.42) {
          setPanelActive(panelAnchor);
          updateScreenTexture(textures.anchor, 0x82b4ff);
          updateActiveNav('#scroll-stage');
          updateIpadSlide(1);
        } else if (p >= 0.42 && p < 0.55) {
          setPanelActive(panelMoftailStorefront);
          updateScreenTexture(textures.shopify, 0x6ee7b7);
          updateActiveNav('#scroll-stage');
          updateIpadSlide(2);
        } else if (p >= 0.55 && p < 0.68) {
          setPanelActive(panelMoftailAds);
          updateScreenTexture(textures.ads, 0x60a5fa);
          updateActiveNav('#scroll-stage');
          updateIpadSlide(3);
        } else if (p >= 0.68 && p < 0.81) {
          setPanelActive(panelMoftailPod);
          updateScreenTexture(textures.printify, 0xa5b4fc);
          updateActiveNav('#scroll-stage');
          updateIpadSlide(4);
        } else {
          setPanelActive(panelShopifyTheme);
          updateScreenTexture(textures.shopifyTheme, 0x60a5fa);
          updateActiveNav('#scroll-stage');
          updateIpadSlide(5);
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
  // Step 2: Dynamic Dual-Screen Presentation of Anchor (3.65 -> 5.75s)
  // iPad on left shows engineering notes, Mac on right shows live web app
  // =========================================================================
  tl.to(macState, {
    rotX: 0.05,
    rotY: -0.03,
    cameraZ: 4.15,      // Dual-screen workstation view showing both iPad & MacBook
    cameraY: 0.65,
    lookOffsetY: 1.05,  // Screen-centered vertical framing for both displays
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
    rotY: 0.02,         // Elegant slight tilt showcasing midnight aluminum anodized finish
    cameraZ: 4.15,
    cameraY: 0.65,
    lookOffsetY: 1.05,
    posX: 0.00,
    posY: -0.46,
    ease: 'power1.inOut',
    duration: 1.70
  }, 5.75);

  tl.to(deskState, {
    rotX: 0.06,
    rotY: 0.02,
    posY: -0.46,
    posX: 0.00,
    bounceIntensity: 0.65,
    underShelfLightIntensity: 2.6,
    ease: 'power1.inOut',
    duration: 1.70
  }, 5.75);

  // =========================================================================
  // Step 3b: Moftail Phase 2 - Meta Ads & Demand Verification (7.45 -> 9.15s)
  // Subtle angle change highlighting the analytics dashboard & iPad A/B CTR chart
  // =========================================================================
  tl.to(macState, {
    rotX: 0.05,
    rotY: -0.02,        // Nuanced angle change
    cameraZ: 4.12,
    cameraY: 0.65,
    lookOffsetY: 1.05,
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
  // Balanced centered framing showcasing Printify supply network & brand philosophy
  // =========================================================================
  tl.to(macState, {
    rotX: 0.06,
    rotY: 0.01,         // Centered balanced view
    cameraZ: 4.15,
    cameraY: 0.65,
    lookOffsetY: 1.05,
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
    cameraZ: 4.12,
    cameraY: 0.65,
    lookOffsetY: 1.05,
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
    cameraZ: 5.20,      // Pull back to showcase whole creator workspace
    cameraY: 0.85,
    lookOffsetY: 0.75,
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

  // Click-to-Focus Raycaster (Interact with iPad or MacBook)
  const raycaster = new THREE.Raycaster();
  const mouseVec = new THREE.Vector2();
  let focusTarget = null; // 'ipad' | 'mac' | null

  const currentCamPos = new THREE.Vector3(0, macState.cameraY, macState.cameraZ);
  const currentLookTarget = new THREE.Vector3(0, 0.14, 0);

  window.addEventListener('click', (e) => {
    if (e.target.closest('a, button, input, textarea, select, nav, .header-minimal')) return;
    if (macState.lidOpen < 0.3) return;

    mouseVec.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouseVec.y = -(e.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouseVec, camera);

    const ipadHits = raycaster.intersectObjects(ipadMasterGroup.children, true);
    if (ipadHits.length > 0) {
      focusTarget = (focusTarget === 'ipad') ? null : 'ipad';
      return;
    }

    const macHits = raycaster.intersectObjects(macRoot.children, true);
    if (macHits.length > 0) {
      focusTarget = (focusTarget === 'mac') ? null : 'mac';
      return;
    }

    if (focusTarget !== null) {
      focusTarget = null;
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && focusTarget !== null) {
      focusTarget = null;
    }
  });

  let prevScrollPos = window.scrollY;
  window.addEventListener('scroll', () => {
    if (focusTarget !== null && Math.abs(window.scrollY - prevScrollPos) > 40) {
      focusTarget = null;
    }
    prevScrollPos = window.scrollY;
  }, { passive: true });

  function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();

    // Smooth mouse parallax damping
    mouseX += (targetMouseX - mouseX) * 0.05;
    mouseY += (targetMouseY - mouseY) * 0.05;

    // Dual-screen layout: MacBook shifts to right (+0.70) when opened, balancing the propped iPad on the left
    const isMobile = camera.aspect < 1.15;
    const desktopOffset = isMobile ? 0.0 : (macState.lidOpen > 0 ? 0.70 : 0.0);

    // Rotate and position the MacBook master group
    macRoot.scale.setScalar(1.0);
    macRoot.position.x = macState.posX + desktopOffset;
    macRoot.position.y = macState.posY;
    macRoot.position.z = 0;
    macRoot.rotation.x = macState.rotX + mouseY;
    macRoot.rotation.y = macState.rotY + mouseX;
    macRoot.rotation.z = macState.rotZ;

    // Contact shadow follows MacBook
    if (contactShadowMesh) {
      contactShadowMesh.position.x = macState.posX + desktopOffset;
    }

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
        if (m === standShadowMat) {
          m.opacity = 0.45 * Math.min(1.0, deskState.opacity);
        } else if (m === clockGlassMat) {
          m.opacity = 0.45 * Math.min(1.0, deskState.opacity);
        } else if (m === frameGlassMat) {
          m.opacity = 0.40 * Math.min(1.0, deskState.opacity);
        } else if (m !== contactShadowMaterial) {
          m.opacity = Math.min(1.0, deskState.opacity);
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

    // Control Lid Opening
    if (lidNode) {
      if (isObjModel) {
        lidNode.rotation.x = THREE.MathUtils.lerp(closedLidRot, openLidRot, macState.lidOpen);
      } else {
        lidNode.rotation.x = -macState.lidOpen * 2.02;
      }
    }

    // Base camera framing for dual-screen workstation
    const baseLookX = isMobile ? 0.0 : (macState.lidOpen > 0 ? -0.28 : 0.0);
    const mobileLookShift = isMobile ? 0.20 : 0.0;
    const baseLookY = macRoot.position.y + (macState.lookOffsetY !== undefined ? macState.lookOffsetY : 0.14) - mobileLookShift;
    const baseCamZ = isMobile ? 4.60 : macState.cameraZ;
    const baseCamY = macState.cameraY;
    const baseCamX = 0;

    let targetCamX = baseCamX;
    let targetCamY = baseCamY;
    let targetCamZ = baseCamZ;
    let targetLookX = baseLookX;
    let targetLookY = baseLookY;

    if (focusTarget === 'ipad') {
      targetCamX = -1.26;
      targetCamY = 0.78;
      targetCamZ = 2.45;
      targetLookX = -1.26;
      targetLookY = 0.78;
    } else if (focusTarget === 'mac') {
      targetCamX = macState.posX + desktopOffset;
      targetCamY = 0.58;
      targetCamZ = 2.70;
      targetLookX = macState.posX + desktopOffset;
      targetLookY = 0.65;
    }

    currentCamPos.x += (targetCamX - currentCamPos.x) * 0.08;
    currentCamPos.y += (targetCamY - currentCamPos.y) * 0.08;
    currentCamPos.z += (targetCamZ - currentCamPos.z) * 0.08;

    currentLookTarget.x += (targetLookX - currentLookTarget.x) * 0.08;
    currentLookTarget.y += (targetLookY - currentLookTarget.y) * 0.08;
    currentLookTarget.z += (0.0 - currentLookTarget.z) * 0.08;

    camera.position.copy(currentCamPos);
    camera.lookAt(currentLookTarget);

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
