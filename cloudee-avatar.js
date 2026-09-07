/**
 * Cloudee Avatar Renderer & Expression Engine
 * Based on schema: bible-strong/avatar-definition
 * Powered by Three.js & GSAP
 */

(function () {
  // Cloudee Avatar Definition Data
  const AVATAR_DEF = {
    schema: "bible-strong/avatar-definition",
    schemaVersion: 1,
    name: "Cloudee",
    body: {
      primary: {
        type: "sphere",
        width: 159.787109375,
        height: 159.787109375,
        depth: 159.77982741038028,
        roundness: 1
      },
      nodes: [
        {
          surface: {
            type: "sphere",
            width: 81.6,
            height: 81.6,
            depth: 81.6,
            roundness: 1
          },
          position: [-54.211163573292225, -19.983270576375716, -18],
          rotation: [0, 0, 0]
        },
        {
          surface: {
            type: "sphere",
            width: 108.64140625,
            height: 87.1000059,
            depth: 90.99923895,
            roundness: 1
          },
          position: [-64.06931629506641, 18.35102511266605, -18],
          rotation: [0, 0, 0]
        },
        {
          surface: {
            type: "sphere",
            width: 97.791015625,
            height: 96.838138,
            depth: 89.56416,
            roundness: 1
          },
          position: [61.23234219342984, 18.962019686907013, -18],
          rotation: [0, 0, 0]
        },
        {
          surface: {
            type: "sphere",
            width: 94.3489253,
            height: 94.3451962,
            depth: 100.53515625,
            roundness: 1
          },
          position: [41.48876642638391, -37.63883372407813, -17.99133043155456],
          rotation: [0, 0, 0]
        }
      ]
    },
    colors: {
      body: "#edf0f3",
      eyes: "#111316"
    },
    expressions: {
      neutral: {
        head: { x: 0, y: 0, z: 0 },
        eyes: {
          left: { width: 13.94, height: 45.42, x: 0, y: -1.07, angle: 0 },
          right: { width: 13.94, height: 45.42, x: 0, y: -1.07, angle: 0 },
          spacing: 12.76
        },
        perspective: 1,
        motion: { eyes: "none", body: "none" }
      },
      "upward-side-glance": {
        head: { x: 7.3, y: 27.8, z: -16.1 },
        eyes: {
          left: { width: 16.44, height: 37.8, x: 0, y: -14.57, angle: 0 },
          right: { width: 16.44, height: 37.8, x: 0, y: -14.57, angle: 0 },
          spacing: 32.06
        },
        perspective: 1,
        motion: { eyes: "none", body: "none" }
      },
      "downward-gaze": {
        head: { x: -15.06, y: 0.14, z: -14.55 },
        eyes: {
          left: { width: 16.34, height: 50.0, x: 0, y: 5.93, angle: 0 },
          right: { width: 16.34, height: 50.0, x: 0, y: 5.93, angle: 0 },
          spacing: 35.46
        },
        perspective: 1,
        motion: { eyes: "none", body: "none" }
      },
      "skeptical-right": {
        head: { x: -16.53, y: -3.77, z: -13.73 },
        eyes: {
          left: { width: 17.03, height: 53.1, x: 0, y: 5.93, angle: 0 },
          right: { width: 43.87, height: 10, x: 0, y: 5.93, angle: 0 },
          spacing: 34.06
        },
        perspective: 1,
        motion: { eyes: "none", body: "none" }
      },
      "small-attentive": {
        head: { x: -4.23, y: 14.36, z: 11.2 },
        eyes: {
          left: { width: 16.01, height: 35.02, x: 0, y: 5.93, angle: 0 },
          right: { width: 16.01, height: 35.02, x: 0, y: 5.93, angle: 0 },
          spacing: 28.66
        },
        perspective: 1,
        motion: { eyes: "none", body: "none" }
      },
      "wide-downward-gaze": {
        head: { x: -19.21, y: 15.2, z: 11.8 },
        eyes: {
          left: { width: 46.03, height: 46.89, x: 0, y: 5.93, angle: 0 },
          right: { width: 47.06, height: 47.61, x: 0, y: 5.93, angle: 0 },
          spacing: 47.26
        },
        perspective: 1,
        motion: { eyes: "none", body: "none" }
      },
      "surprised-left": {
        head: { x: 2.95, y: -16.05, z: -20.92 },
        eyes: {
          left: { width: 45.63, height: 47.16, x: 0, y: 5.93, angle: 0 },
          right: { width: 45.63, height: 47.16, x: 0, y: 5.93, angle: 0 },
          spacing: 48.66
        },
        perspective: 1,
        motion: { eyes: "none", body: "none" }
      },
      "sleepy-squint": {
        head: { x: 3.4, y: 13.23, z: 8.98 },
        eyes: {
          left: { width: 45.72, height: 10, x: 0, y: 5.93, angle: 0 },
          right: { width: 45.72, height: 10, x: 0, y: 5.93, angle: 0 },
          spacing: 41.63
        },
        perspective: 1,
        motion: { eyes: "none", body: "none" }
      },
      "angry-right": {
        head: { x: 8.06, y: 17.63, z: -11.12 },
        eyes: {
          left: { width: 14.85, height: 35.82, x: 0, y: 5.93, angle: -30.87 },
          right: { width: 14.85, height: 35.82, x: 0, y: 5.93, angle: 28.78 },
          spacing: 29.82
        },
        perspective: 1,
        motion: { eyes: "none", body: "none" }
      },
      "curious-left": {
        head: { x: -12.3, y: -17.6, z: 5.91 },
        eyes: {
          left: { width: 14.55, height: 43.19, x: 0, y: 5.93, angle: 23.52 },
          right: { width: 14.55, height: 43.19, x: 0, y: 5.93, angle: -24.04 },
          spacing: 32.66
        },
        perspective: 1,
        motion: { eyes: "none", body: "none" }
      },
      "asymmetric-down-right": {
        head: { x: -20.06, y: 12.61, z: -12.7 },
        eyes: {
          left: { width: 36.44, height: 37.22, x: 0, y: 5.93, angle: 0 },
          right: { width: 16.04, height: 17.62, x: 0, y: 5.93, angle: 0 },
          spacing: 39.46
        },
        perspective: 1,
        motion: { eyes: "none", body: "none" }
      },
      "attentive-left": {
        head: { x: 1.43, y: 6.19, z: 10.56 },
        eyes: {
          left: { width: 17.78, height: 53.55, x: 0, y: 5.93, angle: 0 },
          right: { width: 17.78, height: 53.55, x: 0, y: 5.93, angle: 0 },
          spacing: 34.56
        },
        perspective: 1,
        motion: { eyes: "none", body: "none" }
      },
      "joyful-wide": {
        head: { x: -2.09, y: -15.9, z: -14.47 },
        eyes: {
          left: { width: 28.14, height: 80.75, x: 0, y: 5.93, angle: 0 },
          right: { width: 28.14, height: 78.6, x: 0, y: 5.93, angle: 0 },
          spacing: 37.17
        },
        perspective: 1,
        motion: { eyes: "none", body: "none" }
      },
      "eyes-closed": {
        head: { x: -8.75, y: -8.74, z: -10.77 },
        eyes: {
          left: { width: 50.08, height: 10.92, x: 0, y: 5.93, angle: 0 },
          right: { width: 50.08, height: 10.58, x: 0, y: 5.93, angle: 0 },
          spacing: 47.03
        },
        perspective: 1,
        motion: { eyes: "none", body: "none" }
      },
      "joyful-down-right": {
        head: { x: -15.29, y: 15.01, z: 12.79 },
        eyes: {
          left: { width: 25.2, height: 72.14, x: 0, y: 5.93, angle: 0 },
          right: { width: 25.2, height: 72.14, x: 0, y: 5.93, angle: 0 },
          spacing: 46.46
        },
        perspective: 1,
        motion: { eyes: "none", body: "none" }
      },
      "skeptical-left": {
        head: { x: 3.53, y: -7.08, z: 9.83 },
        eyes: {
          left: { width: 18.25, height: 54.7, x: 0, y: 5.93, angle: 0 },
          right: { width: 42.87, height: 10, x: 0, y: 5.93, angle: 0 },
          spacing: 39.98
        },
        perspective: 1,
        motion: { eyes: "none", body: "none" }
      },
      "far-right-glance": {
        head: { x: 0.32, y: 35.31, z: -10.9 },
        eyes: {
          left: { width: 16.4, height: 35.24, x: 0, y: 5.93, angle: 0 },
          right: { width: 16.4, height: 35.24, x: 0, y: 5.93, angle: 0 },
          spacing: 31.66
        },
        perspective: 1,
        motion: { eyes: "none", body: "none" }
      },
      "angry-left": {
        head: { x: -14.75, y: -19.35, z: 5.63 },
        eyes: {
          left: { width: 13.55, height: 44.06, x: 0, y: 5.93, angle: -27.61 },
          right: { width: 13.55, height: 44.06, x: 0, y: 5.93, angle: 26.15 },
          spacing: 32.86
        },
        perspective: 1,
        motion: { eyes: "none", body: "none" }
      },
      "playful-right": {
        head: { x: -4.4, y: 14.07, z: -16.13 },
        eyes: {
          left: { width: 12.99, height: 38.79, x: 0, y: 5.93, angle: 26.29 },
          right: { width: 12.99, height: 38.79, x: 0, y: 5.93, angle: -20.25 },
          spacing: 29.49
        },
        perspective: 1,
        motion: { eyes: "none", body: "none" }
      },
      "asymmetric-up-left": {
        head: { x: 6.59, y: 4.74, z: 12.84 },
        eyes: {
          left: { width: 36.04, height: 37.12, x: 0, y: 5.93, angle: 0 },
          right: { width: 16.14, height: 17.52, x: 0, y: 5.93, angle: 0 },
          spacing: 38.16
        },
        perspective: 1,
        motion: { eyes: "none", body: "none" }
      },
      "gentle-downward-gaze": {
        head: { x: -6.08, y: -11.04, z: -13.97 },
        eyes: {
          left: { width: 16.99, height: 54.11, x: 0, y: 5.93, angle: 0 },
          right: { width: 16.99, height: 54.11, x: 0, y: 5.93, angle: 0 },
          spacing: 33.96
        },
        perspective: 1,
        motion: { eyes: "none", body: "none" }
      },
      "wide-down-left": {
        head: { x: -17.13, y: 18.07, z: 13.89 },
        eyes: {
          left: { width: 29.4, height: 74.52, x: 0, y: 5.93, angle: 0 },
          right: { width: 29.4, height: 74.52, x: 0, y: 5.93, angle: 0 },
          spacing: 48.56
        },
        perspective: 1,
        motion: { eyes: "none", body: "none" }
      },
      "surprised-wide-left": {
        head: { x: -5.43, y: -11.71, z: -13.47 },
        eyes: {
          left: { width: 45.34, height: 45.52, x: 0, y: 5.93, angle: 0 },
          right: { width: 44.44, height: 44.82, x: 0, y: 5.93, angle: 0 },
          spacing: 46.76
        },
        perspective: 1,
        motion: { eyes: "none", body: "none" }
      },
      "drowsy-closed": {
        head: { x: 10.29, y: 3.4, z: 7.58 },
        eyes: {
          left: { width: 49.62, height: 10.04, x: 0, y: 5.93, angle: 0 },
          right: { width: 49.62, height: 10.04, x: 0, y: 5.93, angle: 0 },
          spacing: 46.17
        },
        perspective: 1,
        motion: { eyes: "none", body: "none" }
      },
      "suspicious-right": {
        head: { x: -17.8, y: 10, z: -10.89 },
        eyes: {
          left: { width: 17.91, height: 51.31, x: 0, y: -3.87, angle: 0 },
          right: { width: 47.51, height: 10, x: 0, y: -3.87, angle: 0 },
          spacing: 37.7
        },
        perspective: 1,
        motion: { eyes: "none", body: "none" }
      },
      "shy-downward": {
        head: { x: 7.13, y: 7.78, z: 3.94 },
        eyes: {
          left: { width: 15.44, height: 27.42, x: 0, y: 45.93, angle: 0 },
          right: { width: 17.14, height: 28.92, x: 0, y: 45.93, angle: 0 },
          spacing: 28.96
        },
        perspective: 1,
        motion: { eyes: "none", body: "none" }
      },
      "angry-brows": {
        head: { x: 10.47, y: 5.09, z: 4.7 },
        eyes: {
          left: { width: 21.07, height: 58.45, x: 0, y: 5.93, angle: -36.24 },
          right: { width: 21.07, height: 58.45, x: 0, y: 5.93, angle: 27.73 },
          spacing: 46.46
        },
        perspective: 1,
        motion: { eyes: "none", body: "shake" },
        colors: { body: "#ba3636", eyes: "#610000" }
      },
      "uneasy-left": {
        head: { x: -12.3, y: -17.6, z: 5.91 },
        eyes: {
          left: { width: 14.55, height: 43.19, x: 0, y: 5.93, angle: 23.52 },
          right: { width: 14.55, height: 43.19, x: 0, y: 5.93, angle: -24.04 },
          spacing: 32.66
        },
        perspective: 1,
        motion: { eyes: "shake", body: "slowDrift" },
        colors: { body: "#adc3ff" }
      }
    },
    animations: {
      idle: {
        playbackMode: "loop",
        steps: [
          { expression: "upward-side-glance", holdMs: 1400, transitionMs: 320 },
          { expression: "small-attentive", holdMs: 1200, transitionMs: 280 },
          { expression: "curious-left", holdMs: 1500, transitionMs: 300 },
          { expression: "playful-right", holdMs: 1200, transitionMs: 280 },
          { expression: "gentle-downward-gaze", holdMs: 1300, transitionMs: 300 }
        ],
        blink: { enabled: true, minIntervalMs: 2000, maxIntervalMs: 4500, durationMs: 220 }
      },
      happy: {
        playbackMode: "loop",
        steps: [
          { expression: "joyful-down-right", holdMs: 800, transitionMs: 240 },
          { expression: "joyful-wide", holdMs: 900, transitionMs: 220 },
          { expression: "playful-right", holdMs: 800, transitionMs: 240 },
          { expression: "surprised-wide-left", holdMs: 700, transitionMs: 220 },
          { expression: "joyful-wide", holdMs: 1000, transitionMs: 240 }
        ],
        blink: { enabled: true, minIntervalMs: 1500, maxIntervalMs: 3200, durationMs: 200 }
      },
      listening: {
        playbackMode: "loop",
        steps: [
          { expression: "attentive-left", holdMs: 1200, transitionMs: 280 },
          { expression: "small-attentive", holdMs: 1100, transitionMs: 260 },
          { expression: "curious-left", holdMs: 1200, transitionMs: 280 }
        ],
        blink: { enabled: true, minIntervalMs: 2200, maxIntervalMs: 4200, durationMs: 220 }
      },
      thinking: {
        playbackMode: "loop",
        steps: [
          { expression: "curious-left", holdMs: 600, transitionMs: 240 },
          { expression: "skeptical-left", holdMs: 600, transitionMs: 240 },
          { expression: "playful-right", holdMs: 600, transitionMs: 240 },
          { expression: "skeptical-right", holdMs: 600, transitionMs: 240 }
        ],
        blink: { enabled: true, minIntervalMs: 1400, maxIntervalMs: 2800, durationMs: 180 }
      },
      searching: {
        playbackMode: "loop",
        steps: [
          { expression: "far-right-glance", holdMs: 450, transitionMs: 200 },
          { expression: "asymmetric-down-right", holdMs: 450, transitionMs: 200 },
          { expression: "surprised-left", holdMs: 450, transitionMs: 200 },
          { expression: "wide-down-left", holdMs: 450, transitionMs: 200 }
        ],
        blink: { enabled: true, minIntervalMs: 1200, maxIntervalMs: 2400, durationMs: 180 }
      },
      celebrate: {
        playbackMode: "loop",
        steps: [
          { expression: "joyful-down-right", holdMs: 900, transitionMs: 240 },
          { expression: "curious-left", holdMs: 800, transitionMs: 220 },
          { expression: "playful-right", holdMs: 800, transitionMs: 220 },
          { expression: "joyful-wide", holdMs: 1200, transitionMs: 240 }
        ],
        blink: { enabled: true, minIntervalMs: 1200, maxIntervalMs: 2600, durationMs: 190 }
      },
      sleeping: {
        playbackMode: "loop",
        steps: [
          { expression: "eyes-closed", holdMs: 2800, transitionMs: 400 },
          { expression: "drowsy-closed", holdMs: 2800, transitionMs: 400 },
          { expression: "sleepy-squint", holdMs: 2800, transitionMs: 400 }
        ],
        blink: { enabled: false }
      }
    }
  };

  /**
   * Cloudee Avatar Controller Class
   */
  class CloudeeAvatar {
    constructor(containerEl, options = {}) {
      this.container = containerEl;
      this.options = Object.assign(
        {
          width: 96,
          height: 96,
          defaultAnimation: "idle"
        },
        options
      );

      this.scene = null;
      this.camera = null;
      this.renderer = null;
      this.cloudeeGroup = null;
      this.headGroup = null;
      this.bodyMeshes = [];
      this.leftEyeMesh = null;
      this.rightEyeMesh = null;
      this.bodyMaterial = null;
      this.eyesMaterial = null;

      // Current Animated State Values
      this.state = {
        rotX: 0,
        rotY: 0,
        rotZ: 0,
        leftEyeWidth: 13.94,
        leftEyeHeight: 45.42,
        leftEyeX: 0,
        leftEyeY: -1.07,
        leftEyeAngle: 0,
        rightEyeWidth: 13.94,
        rightEyeHeight: 45.42,
        rightEyeX: 0,
        rightEyeY: -1.07,
        rightEyeAngle: 0,
        spacing: 12.76,
        bodyColor: "#edf0f3",
        eyesColor: "#111316",
        motionBody: "none",
        motionEyes: "none",
        isBlinking: false
      };

      // Gaze Tracking (Cursor Looking) System
      this.gaze = {
        normX: 0,
        normY: 0,
        currentRotX: 0,
        currentRotY: 0,
        currentRotZ: 0,
        currentEyeX: 0,
        currentEyeY: 0,
        weight: 0
      };

      this.currentAnimationName = this.options.defaultAnimation;
      this.stepIndex = 0;
      this.stepTimeout = null;
      this.blinkTimeout = null;
      this.animTween = null;
      this.isHovered = false;
      this.isActive = false;
      this.clock = new THREE.Clock();

      this.init();
    }

    init() {
      if (typeof THREE === "undefined") {
        console.warn("[Cloudee] Three.js not found.");
        return;
      }

      const w = this.options.width;
      const h = this.options.height;

      // Setup Scene
      this.scene = new THREE.Scene();

      // Camera: field of view designed to frame the 240px wide cloud nicely
      this.camera = new THREE.PerspectiveCamera(40, w / h, 1, 1000);
      this.camera.position.set(0, 0, 370);

      // Renderer with transparency & high pixel density
      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance"
      });
      this.renderer.setSize(w, h);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

      // Container DOM setup
      this.container.innerHTML = "";
      this.container.appendChild(this.renderer.domElement);

      // Lights
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
      this.scene.add(ambientLight);

      // Directional top-front light
      const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.05);
      dirLight1.position.set(80, 150, 160);
      this.scene.add(dirLight1);

      // Subtle dusk violet rim accent light from left (Dimension aesthetic)
      const dirLight2 = new THREE.DirectionalLight(0x8075ff, 0.55);
      dirLight2.position.set(-120, -40, 60);
      this.scene.add(dirLight2);

      // Soft warm fill light
      const dirLight3 = new THREE.DirectionalLight(0xfff7ed, 0.4);
      dirLight3.position.set(60, -100, 120);
      this.scene.add(dirLight3);

      this.buildCloudeeModel();
      this.bindEvents();
      this.playAnimation(this.currentAnimationName);
      this.startBlinkLoop();
      this.animate();
    }

    buildCloudeeModel() {
      this.cloudeeGroup = new THREE.Group();
      this.headGroup = new THREE.Group();
      this.cloudeeGroup.add(this.headGroup);
      this.scene.add(this.cloudeeGroup);

      // Body Material: smooth cloudy soft light gray
      this.bodyMaterial = new THREE.MeshStandardMaterial({
        color: new THREE.Color(AVATAR_DEF.colors.body),
        roughness: 0.36,
        metalness: 0.02,
        flatShading: false
      });

      // 1. Primary Sphere
      const prim = AVATAR_DEF.body.primary;
      const primaryRadius = prim.width / 2; // ~79.9
      const primaryGeo = new THREE.SphereGeometry(primaryRadius, 32, 32);
      const primaryMesh = new THREE.Mesh(primaryGeo, this.bodyMaterial);
      this.headGroup.add(primaryMesh);
      this.bodyMeshes.push(primaryMesh);

      // 2. Additional Spherical Nodes
      AVATAR_DEF.body.nodes.forEach((node) => {
        const radius = node.surface.width / 2;
        const geo = new THREE.SphereGeometry(radius, 28, 28);
        const mesh = new THREE.Mesh(geo, this.bodyMaterial);

        const sx = 1;
        const sy = node.surface.height / node.surface.width;
        const sz = node.surface.depth / node.surface.width;
        mesh.scale.set(sx, sy, sz);

        mesh.position.set(node.position[0], node.position[1], node.position[2]);
        this.headGroup.add(mesh);
        this.bodyMeshes.push(mesh);
      });

      // 3. Eyes Setup
      this.eyesMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color(AVATAR_DEF.colors.eyes),
        depthTest: false
      });

      this.leftEyeMesh = this.createEyeMesh();
      this.rightEyeMesh = this.createEyeMesh();

      this.leftEyeMesh.renderOrder = 999;
      this.rightEyeMesh.renderOrder = 999;
      this.headGroup.add(this.leftEyeMesh);
      this.headGroup.add(this.rightEyeMesh);

      this.updateEyeTransforms();
    }

    createEyeMesh() {
      const width = 14;
      const height = 45;
      const shape = new THREE.Shape();
      const r = Math.min(width, height) / 2;
      const x = -width / 2;
      const y = -height / 2;
      const w = width;
      const h = height;

      shape.moveTo(x + r, y);
      shape.lineTo(x + w - r, y);
      shape.quadraticCurveTo(x + w, y, x + w, y + r);
      shape.lineTo(x + w, y + h - r);
      shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      shape.lineTo(x + r, y + h);
      shape.quadraticCurveTo(x, y + h, x, y + h - r);
      shape.lineTo(x, y + r);
      shape.quadraticCurveTo(x, y, x + r, y);

      const geo = new THREE.ShapeGeometry(shape, 12);
      const mesh = new THREE.Mesh(geo, this.eyesMaterial);
      return mesh;
    }

    updateEyeMeshGeometry(mesh, width, height) {
      width = Math.max(width, 3);
      height = Math.max(height, 2);
      const r = Math.min(width, height) / 2;
      const x = -width / 2;
      const y = -height / 2;
      const w = width;
      const h = height;

      const shape = new THREE.Shape();
      shape.moveTo(x + r, y);
      shape.lineTo(x + w - r, y);
      shape.quadraticCurveTo(x + w, y, x + w, y + r);
      shape.lineTo(x + w, y + h - r);
      shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      shape.lineTo(x + r, y + h);
      shape.quadraticCurveTo(x, y + h, x, y + h - r);
      shape.lineTo(x, y + r);
      shape.quadraticCurveTo(x, y, x + r, y);

      if (mesh.geometry) {
        mesh.geometry.dispose();
      }
      mesh.geometry = new THREE.ShapeGeometry(shape, 12);
    }

    updateEyeTransforms() {
      if (!this.leftEyeMesh || !this.rightEyeMesh) return;

      const st = this.state;
      const halfSpacing = st.spacing / 2;

      // Blink squash
      const currentLeftH = st.isBlinking ? 2.5 : st.leftEyeHeight;
      const currentRightH = st.isBlinking ? 2.5 : st.rightEyeHeight;

      this.updateEyeMeshGeometry(this.leftEyeMesh, st.leftEyeWidth, currentLeftH);
      this.updateEyeMeshGeometry(this.rightEyeMesh, st.rightEyeWidth, currentRightH);

      // Gaze Eye Offset (Pupil cursor tracking)
      const gazeEyeX = this.gaze ? this.gaze.currentEyeX : 0;
      const gazeEyeY = this.gaze ? this.gaze.currentEyeY : 0;

      // Left Eye
      const lx = -(halfSpacing + 12) + st.leftEyeX + gazeEyeX;
      const ly = st.leftEyeY + gazeEyeY;
      const lz = 82;
      this.leftEyeMesh.position.set(lx, ly, lz);
      this.leftEyeMesh.rotation.z = THREE.MathUtils.degToRad(st.leftEyeAngle);

      // Right Eye
      const rx = (halfSpacing + 12) + st.rightEyeX + gazeEyeX;
      const ry = st.rightEyeY + gazeEyeY;
      const rz = 82;
      this.rightEyeMesh.position.set(rx, ry, rz);
      this.rightEyeMesh.rotation.z = THREE.MathUtils.degToRad(st.rightEyeAngle);

      // Colors
      if (this.bodyMaterial) {
        this.bodyMaterial.color.set(st.bodyColor);
      }
      if (this.eyesMaterial) {
        this.eyesMaterial.color.set(st.eyesColor);
      }
    }

    applyExpression(exprName, durationMs = 500) {
      const expr = AVATAR_DEF.expressions[exprName] || AVATAR_DEF.expressions.neutral;
      const durationSec = durationMs / 1000;

      const targetProps = {
        rotX: expr.head.x,
        rotY: expr.head.y,
        rotZ: expr.head.z,
        leftEyeWidth: expr.eyes.left.width,
        leftEyeHeight: expr.eyes.left.height,
        leftEyeX: expr.eyes.left.x,
        leftEyeY: expr.eyes.left.y,
        leftEyeAngle: expr.eyes.left.angle,
        rightEyeWidth: expr.eyes.right.width,
        rightEyeHeight: expr.eyes.right.height,
        rightEyeX: expr.eyes.right.x,
        rightEyeY: expr.eyes.right.y,
        rightEyeAngle: expr.eyes.right.angle,
        spacing: expr.eyes.spacing,
        bodyColor: (expr.colors && expr.colors.body) || AVATAR_DEF.colors.body,
        eyesColor: (expr.colors && expr.colors.eyes) || AVATAR_DEF.colors.eyes,
        motionBody: expr.motion.body || "none",
        motionEyes: expr.motion.eyes || "none"
      };

      if (typeof gsap !== "undefined") {
        if (this.animTween) this.animTween.kill();
        this.animTween = gsap.to(this.state, {
          ...targetProps,
          duration: durationSec,
          ease: "power2.out",
          onUpdate: () => {
            this.updateEyeTransforms();
          }
        });
      } else {
        Object.assign(this.state, targetProps);
        this.updateEyeTransforms();
      }
    }

    playAnimation(animName) {
      if (this.stepTimeout) {
        clearTimeout(this.stepTimeout);
        this.stepTimeout = null;
      }

      const anim = AVATAR_DEF.animations[animName] || AVATAR_DEF.animations.idle;
      this.currentAnimationName = animName;
      this.stepIndex = 0;

      const executeStep = () => {
        const step = anim.steps[this.stepIndex];
        if (!step) return;

        this.applyExpression(step.expression, step.transitionMs || 500);

        const hold = (step.holdMs || 2000) + (step.transitionMs || 500);
        this.stepTimeout = setTimeout(() => {
          this.stepIndex = (this.stepIndex + 1) % anim.steps.length;
          executeStep();
        }, hold);
      };

      executeStep();
    }

    startBlinkLoop() {
      const scheduleBlink = () => {
        const anim = AVATAR_DEF.animations[this.currentAnimationName];
        const blinkConf =
          anim && anim.blink
            ? anim.blink
            : { enabled: true, minIntervalMs: 3000, maxIntervalMs: 6000, durationMs: 250 };

        if (!blinkConf.enabled) {
          this.blinkTimeout = setTimeout(scheduleBlink, 3000);
          return;
        }

        const interval =
          blinkConf.minIntervalMs +
          Math.random() * (blinkConf.maxIntervalMs - blinkConf.minIntervalMs);

        this.blinkTimeout = setTimeout(() => {
          this.state.isBlinking = true;
          this.updateEyeTransforms();

          setTimeout(() => {
            this.state.isBlinking = false;
            this.updateEyeTransforms();
            scheduleBlink();
          }, blinkConf.durationMs || 220);
        }, interval);
      };

      scheduleBlink();
    }

    bindEvents() {
      this.container.addEventListener("mouseenter", () => {
        this.isHovered = true;
        if (!this.isActive) {
          this.playAnimation("happy");
        }
      });

      this.container.addEventListener("mouseleave", () => {
        this.isHovered = false;
        if (!this.isActive) {
          this.playAnimation("idle");
        }
      });

      // Pointer / Cursor Tracking across window
      window.addEventListener("pointermove", (e) => {
        if (!this.isActive && !this.isHovered) return;

        const rect = this.container.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;

        const dx = e.clientX - cx;
        const dy = e.clientY - cy;

        // Normalize across reasonable screen span
        const spanX = Math.max(window.innerWidth * 0.45, 200);
        const spanY = Math.max(window.innerHeight * 0.45, 200);

        this.gaze.normX = Math.max(-1, Math.min(1, dx / spanX));
        this.gaze.normY = Math.max(-1, Math.min(1, dy / spanY));
      });
    }

    setActive(active) {
      this.isActive = active;
      if (active) {
        this.playAnimation("listening");
      } else {
        this.gaze.normX = 0;
        this.gaze.normY = 0;
        this.playAnimation(this.isHovered ? "happy" : "idle");
      }
    }

    triggerReaction(exprName, durationMs = 600) {
      this.applyExpression(exprName, 200);
      if (this.stepTimeout) clearTimeout(this.stepTimeout);
      this.stepTimeout = setTimeout(() => {
        if (this.isActive) {
          this.playAnimation("listening");
        } else {
          this.playAnimation(this.isHovered ? "happy" : "idle");
        }
      }, durationMs);
    }

    setThinking() {
      this.playAnimation("thinking");
    }

    setSearching() {
      this.playAnimation("searching");
    }

    setCelebrate() {
      this.playAnimation("celebrate");
    }

    setHappy() {
      this.playAnimation("happy");
    }

    animate() {
      requestAnimationFrame(() => this.animate());

      const delta = this.clock.getDelta();
      const elapsed = this.clock.getElapsedTime();

      // Target Gaze Weight: 1.0 when active conversation, 0.45 when hovered, 0 otherwise
      const targetWeight = this.isActive ? 1.0 : this.isHovered ? 0.45 : 0.0;
      this.gaze.weight = THREE.MathUtils.lerp(this.gaze.weight, targetWeight, 0.1);

      // Calculate Target Gaze Rotation (degrees)
      // When cursor is left (normX < 0), head turns left (+Y in Three.js coords with camera facing -Z, but check direction)
      const targetGazeY = this.gaze.normX * 28;
      const targetGazeX = this.gaze.normY * 18;
      const targetGazeZ = this.gaze.normX * -6;

      this.gaze.currentRotX = THREE.MathUtils.lerp(this.gaze.currentRotX, targetGazeX, 0.14);
      this.gaze.currentRotY = THREE.MathUtils.lerp(this.gaze.currentRotY, targetGazeY, 0.14);
      this.gaze.currentRotZ = THREE.MathUtils.lerp(this.gaze.currentRotZ, targetGazeZ, 0.14);

      // Eye pupil shift towards cursor
      const targetEyeX = this.gaze.normX * 8.5;
      const targetEyeY = -this.gaze.normY * 6.5;
      this.gaze.currentEyeX = THREE.MathUtils.lerp(this.gaze.currentEyeX, targetEyeX * this.gaze.weight, 0.16);
      this.gaze.currentEyeY = THREE.MathUtils.lerp(this.gaze.currentEyeY, targetEyeY * this.gaze.weight, 0.16);

      // Blend Animation Base Rotation with Gaze Tracking
      if (this.headGroup) {
        const w = this.gaze.weight;
        const blendedRotX = this.state.rotX * (1 - w * 0.6) + this.gaze.currentRotX * w;
        const blendedRotY = this.state.rotY * (1 - w * 0.7) + this.gaze.currentRotY * w;
        const blendedRotZ = this.state.rotZ * (1 - w * 0.5) + this.gaze.currentRotZ * w;

        const targetRadX = THREE.MathUtils.degToRad(blendedRotX);
        const targetRadY = THREE.MathUtils.degToRad(blendedRotY);
        const targetRadZ = THREE.MathUtils.degToRad(blendedRotZ);

        this.headGroup.rotation.x = THREE.MathUtils.lerp(this.headGroup.rotation.x, targetRadX, 0.14);
        this.headGroup.rotation.y = THREE.MathUtils.lerp(this.headGroup.rotation.y, targetRadY, 0.14);
        this.headGroup.rotation.z = THREE.MathUtils.lerp(this.headGroup.rotation.z, targetRadZ, 0.14);
      }

      // Update Eyes to reflect gaze pupil offset
      if (this.gaze.weight > 0.01) {
        this.updateEyeTransforms();
      }

      // Floating / breathing subtle bounce
      if (this.cloudeeGroup) {
        let bobY = Math.sin(elapsed * 2.2) * 4.5;
        let shakeOffset = 0;

        if (this.state.motionBody === "shake") {
          shakeOffset = (Math.random() - 0.5) * 3;
        } else if (this.state.motionBody === "slowDrift") {
          bobY += Math.sin(elapsed * 0.8) * 7.0;
        }

        this.cloudeeGroup.position.y = THREE.MathUtils.lerp(
          this.cloudeeGroup.position.y,
          bobY + shakeOffset,
          0.1
        );
      }

      if (this.renderer && this.scene && this.camera) {
        this.renderer.render(this.scene, this.camera);
      }
    }
  }

  window.CloudeeAvatar = CloudeeAvatar;
})();
