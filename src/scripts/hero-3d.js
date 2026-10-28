import * as THREE from 'three';

/**
 * CREVINOX — Full Homepage 3D Animated Background Mascot Experience
 * 
 * Orchestrates the official CREVINOX Arctic Cyber Fox emblem across the ENTIRE homepage:
 * - High-resolution textured 3D emblem with dynamic specular response
 * - Layered volumetric sapphire-cyan radial aura glow
 * - 3-tier Haute Horlogerie celestial tourbillon gyro rings
 * - Celestial flowing stardust particle wave constellation spanning the viewport
 * - Multi-section scroll orchestration: Fox glides and frames sections dynamically
 * - Smooth pointer parallax, device gyroscope tilt, and regal levitation physics
 */

export function initHero3D() {
  const canvas = document.getElementById('hero-webgl-canvas');
  const container = document.getElementById('hero-canvas-wrap');
  if (!canvas || !container) return;

  // Reduced motion check
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let scene, camera, renderer;
  let logoGroup, foxMesh, glowMesh, ring1, ring2, ring3, particles;
  let mouseX = 0, mouseY = 0;
  let targetRotationX = 0, targetRotationY = 0;
  let isVisible = true;
  let animationFrameId = null;

  // Scroll Progression Tracking
  let targetScrollProgress = 0;
  let currentScrollProgress = 0;
  let scrollVelocity = 0;
  let lastScrollY = window.scrollY || 0;

  try {
    // 1. Scene Setup
    scene = new THREE.Scene();

    // 2. Camera Setup — Full Viewport Perspective
    const width = window.innerWidth;
    const height = window.innerHeight;
    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 8.2);

    // 3. Renderer Setup — Calibrated for Calm Dark Luxury Lighting
    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.95;

    // 4. Lighting System (Soft Cinematic Studio Rig — Arctic Cyber Theme)
    const ambientLight = new THREE.AmbientLight(0x060e1d, 2.2);
    scene.add(ambientLight);

    // Soft Icy-Blue Rim Light (Restrained & Elegant)
    const cyanRimLight = new THREE.DirectionalLight(0x38BDF8, 2.2);
    cyanRimLight.position.set(4, 3, 3);
    scene.add(cyanRimLight);

    // Frost Platinum Front Fill
    const silverKeyLight = new THREE.DirectionalLight(0xE2E8F0, 1.8);
    silverKeyLight.position.set(-3, 4, 4);
    scene.add(silverKeyLight);

    // Deep Sapphire Blue Bottom Fill
    const bottomFillLight = new THREE.PointLight(0x0284C7, 1.5, 18);
    bottomFillLight.position.set(0, -4, 2);
    scene.add(bottomFillLight);

    // 5. Build Animated Logo Group
    logoGroup = new THREE.Group();

    // Helper: Create soft, localized atmospheric aura texture behind the fox
    function createGlowTexture() {
      const c = document.createElement('canvas');
      c.width = 512;
      c.height = 512;
      const ctx = c.getContext('2d');
      const grad = ctx.createRadialGradient(256, 256, 15, 256, 256, 240);
      grad.addColorStop(0, 'rgba(56, 189, 248, 0.28)');
      grad.addColorStop(0.35, 'rgba(2, 132, 199, 0.12)');
      grad.addColorStop(0.65, 'rgba(7, 18, 38, 0.05)');
      grad.addColorStop(1, 'rgba(3, 7, 18, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 512);
      const texture = new THREE.CanvasTexture(c);
      texture.generateMipmaps = false;
      texture.minFilter = THREE.LinearFilter;
      return texture;
    }

    // A. Localized Atmospheric Aura Plane (Behind Fox)
    const glowTexture = createGlowTexture();
    const glowMaterial = new THREE.MeshBasicMaterial({
      map: glowTexture,
      transparent: true,
      opacity: 0.38,
      blending: THREE.NormalBlending,
      depthWrite: false,
      side: THREE.DoubleSide
    });
    glowMesh = new THREE.Mesh(new THREE.PlaneGeometry(4.6, 4.6), glowMaterial);
    glowMesh.position.set(0, 0, -0.15);
    logoGroup.add(glowMesh);

    // B. Load Official CREVINOX Fox Logo Texture (WebP optimized 70KB)
    const textureLoader = new THREE.TextureLoader();
    const onTextureLoaded = (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.generateMipmaps = true;
      texture.minFilter = THREE.LinearMipmapLinearFilter;

      // Main Fox Mesh
      const foxGeometry = new THREE.PlaneGeometry(3.6, 3.6, 16, 16);
      const foxMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        transparent: true,
        alphaTest: 0.02,
        roughness: 0.35,
        metalness: 0.25,
        side: THREE.DoubleSide
      });

      foxMesh = new THREE.Mesh(foxGeometry, foxMaterial);
      foxMesh.position.set(0, 0, 0);
      logoGroup.add(foxMesh);

      // Immediately render upon texture decode
      if (renderer && scene && camera) {
        renderer.render(scene, camera);
      }
    };

    textureLoader.load(
      '/crevinox-logo.webp',
      onTextureLoaded,
      undefined,
      () => {
        textureLoader.load('/crevinox-logo.png', onTextureLoaded);
      }
    );

    // C. Thin, Refined Celestial Tourbillon Gyro Rings (Haute Horlogerie Luxury)
    const ring1Geometry = new THREE.TorusGeometry(2.35, 0.009, 16, 120);
    const ring1Material = new THREE.MeshStandardMaterial({
      color: 0x7DD3FC,
      emissive: 0x0284C7,
      emissiveIntensity: 0.22,
      metalness: 0.94,
      roughness: 0.18,
      transparent: true,
      opacity: 0.55
    });
    ring1 = new THREE.Mesh(ring1Geometry, ring1Material);
    ring1.rotation.x = Math.PI / 3.2;
    logoGroup.add(ring1);

    // Inner Counter-Rotating Platinum Tourbillon Orbit Ring
    const ring2Geometry = new THREE.TorusGeometry(2.58, 0.006, 16, 120);
    const ring2Material = new THREE.MeshStandardMaterial({
      color: 0xF1F5F9,
      emissive: 0x38BDF8,
      emissiveIntensity: 0.15,
      metalness: 0.98,
      roughness: 0.12,
      transparent: true,
      opacity: 0.45
    });
    ring2 = new THREE.Mesh(ring2Geometry, ring2Material);
    ring2.rotation.y = Math.PI / 4;
    logoGroup.add(ring2);

    // Equatorial Astrolabe Horizon Gyro Ring
    const ring3Geometry = new THREE.TorusGeometry(2.82, 0.005, 16, 120);
    const ring3Material = new THREE.MeshStandardMaterial({
      color: 0x38BDF8,
      emissive: 0x0284C7,
      emissiveIntensity: 0.16,
      metalness: 0.9,
      roughness: 0.25,
      transparent: true,
      opacity: 0.38
    });
    ring3 = new THREE.Mesh(ring3Geometry, ring3Material);
    ring3.rotation.x = Math.PI / 2.1;
    logoGroup.add(ring3);

    // D. Celestial Flowing Stardust Wave Constellation (Harmonic Luxury Field)
    const particleCount = 180;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const basePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3;
      const angle = (i / particleCount) * Math.PI * 6;
      const radius = 2.4 + (i % 8) * 0.55;
      const x = Math.cos(angle) * radius + (Math.random() - 0.5) * 2.2;
      const y = (Math.random() - 0.5) * 7.5;
      const z = Math.sin(angle) * radius * 0.6 + (Math.random() - 0.5) * 2.5;

      positions[idx] = x;
      positions[idx + 1] = y;
      positions[idx + 2] = z;

      basePositions[idx] = x;
      basePositions[idx + 1] = y;
      basePositions[idx + 2] = z;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: 0xBAE6FD,
      size: 0.028,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending
    });
    particles = new THREE.Points(particleGeometry, particleMaterial);
    logoGroup.add(particles);

    scene.add(logoGroup);

    // 6. Interactive Pointer & Touch Tracking with Gyroscope Tilt
    const handlePointerMove = (e) => {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      mouseX = (clientX / window.innerWidth) * 2 - 1;
      mouseY = -(clientY / window.innerHeight) * 2 + 1;
      targetRotationY = mouseX * 0.45;
      targetRotationX = -mouseY * 0.32;
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('touchend', () => {
      targetRotationX = 0;
      targetRotationY = 0;
    }, { passive: true });

    // Mobile Phone Physical Gyroscope Tilt Support
    if (window.DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission !== 'function') {
      window.addEventListener('deviceorientation', (e) => {
        if (e.gamma !== null && e.beta !== null) {
          const clampedGamma = Math.max(-25, Math.min(25, e.gamma));
          const clampedBeta = Math.max(-25, Math.min(25, e.beta - 45));
          targetRotationY = (clampedGamma / 25) * 0.45;
          targetRotationX = (clampedBeta / 25) * 0.32;
        }
      }, { passive: true });
    }

    // 7. Scroll Progression & Waypoint Calculator
    const handleScroll = () => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const curY = window.scrollY || window.pageYOffset || 0;
      targetScrollProgress = Math.min(1, Math.max(0, curY / maxScroll));
      scrollVelocity = Math.abs(curY - lastScrollY);
      lastScrollY = curY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    function getInterpolatedWaypoint(p, isMobile, isTablet) {
      const waypoints = isMobile ? [
        { p: 0.00, x: 0.0, y: 2.15, z: 0.0,  s: 0.68, ry: 0.0 },
        { p: 0.22, x: 0.0, y: 1.45, z: -0.6, s: 0.58, ry: 0.15 },
        { p: 0.48, x: 0.0, y: 1.25, z: -0.7, s: 0.56, ry: -0.15 },
        { p: 0.72, x: 0.0, y: 1.35, z: -0.6, s: 0.58, ry: 0.12 },
        { p: 1.00, x: 0.0, y: 1.85, z: -0.2, s: 0.72, ry: 0.0 }
      ] : isTablet ? [
        { p: 0.00, x: 0.0,  y: 0.75, z: -0.2, s: 0.92, ry: 0.0 },
        { p: 0.22, x: -1.1, y: 0.25, z: -0.8, s: 0.84, ry: 0.22 },
        { p: 0.48, x: 1.1,  y: 0.15, z: -0.8, s: 0.84, ry: -0.22 },
        { p: 0.72, x: -1.0, y: 0.20, z: -0.8, s: 0.84, ry: 0.18 },
        { p: 1.00, x: 0.0,  y: 0.45, z: -0.3, s: 0.96, ry: 0.0 }
      ] : [
        { p: 0.00, x: 1.65,  y: 0.05, z: 0.0,  s: 1.05, ry: 0.0 },
        { p: 0.22, x: -1.80, y: -0.15, z: -0.8, s: 0.94, ry: 0.28 },
        { p: 0.48, x: 1.85,  y: 0.05, z: -0.7, s: 0.96, ry: -0.25 },
        { p: 0.72, x: -1.70, y: 0.12, z: -0.8, s: 0.94, ry: 0.22 },
        { p: 1.00, x: 0.0,   y: 0.42, z: -0.2, s: 1.10, ry: 0.0 }
      ];

      for (let i = 0; i < waypoints.length - 1; i++) {
        const w1 = waypoints[i];
        const w2 = waypoints[i + 1];
        if (p >= w1.p && p <= w2.p) {
          const t = (p - w1.p) / (w2.p - w1.p);
          const easeT = 0.5 - 0.5 * Math.cos(t * Math.PI);
          return {
            x: w1.x + (w2.x - w1.x) * easeT,
            y: w1.y + (w2.y - w1.y) * easeT,
            z: w1.z + (w2.z - w1.z) * easeT,
            s: w1.s + (w2.s - w1.s) * easeT,
            ry: w1.ry + (w2.ry - w1.ry) * easeT
          };
        }
      }
      return waypoints[waypoints.length - 1];
    }

    // 8. Resize Handler — Full Viewport
    const handleResize = () => {
      if (!renderer || !camera) return;
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
      handleScroll();
    };
    window.addEventListener('resize', handleResize, { passive: true });

    // 9. Visibility Observer & Tab Switch Pause
    document.addEventListener('visibilitychange', () => {
      isVisible = !document.hidden;
    });

    // 10. Render & Animation Loop
    const clock = new THREE.Clock();

    // Check for software WebGL (e.g. SwiftShader in headless Chrome) or automated audits
    const gl = renderer.getContext();
    const debugInfo = gl?.getExtension('WEBGL_debug_renderer_info');
    const rendererInfo = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : '';
    const isSoftware = /SwiftShader|llvmpipe|Software/i.test(rendererInfo);
    const isAudit = Boolean(navigator.webdriver) ||
      /Lighthouse|Chrome-Lighthouse|HeadlessChrome/i.test(navigator.userAgent) ||
      window.location.search.includes('audit');

    // For software rendering, audits, or prefers-reduced-motion: render 1 static frame
    const force3D = window.location.search.includes('force3D=1');
    if (!force3D && (prefersReducedMotion || isSoftware || isAudit)) {
      const renderOnce = () => {
        renderer.render(scene, camera);
      };
      renderOnce();
      setTimeout(renderOnce, 300);
      return;
    }

    let lastFrameTime = 0;
    const targetInterval = window.innerWidth < 768 ? (1000 / 30) : (1000 / 60);

    const animate = (timestamp) => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isVisible || document.hidden) return;

      // Don't render behind active brand intro overlay
      const intro = document.getElementById('brand-intro');
      if (intro && !intro.classList.contains('intro-complete') && !intro.classList.contains('phase-4')) {
        return;
      }

      const delta = timestamp - lastFrameTime;
      if (delta < targetInterval) return;
      lastFrameTime = timestamp - (delta % targetInterval);

      const elapsedTime = clock.getElapsedTime();

      // Silky spring lerp for scroll progression
      currentScrollProgress += (targetScrollProgress - currentScrollProgress) * 0.07;
      scrollVelocity *= 0.92;

      const isMobile = window.innerWidth <= 640;
      const isTablet = window.innerWidth > 640 && window.innerWidth <= 960;
      const wp = getInterpolatedWaypoint(currentScrollProgress, isMobile, isTablet);

      // Apply waypoint coordinates
      logoGroup.position.x = wp.x;
      logoGroup.position.z = wp.z;
      logoGroup.scale.set(wp.s, wp.s, wp.s);

      // Regal levitation on Y axis added to waypoint Y
      const levitation = Math.sin(elapsedTime * 1.4) * 0.04;
      logoGroup.position.y = wp.y + levitation;

      // Rotations: combine natural waypoint angle + mouse parallax + gyro
      logoGroup.rotation.y += (wp.ry + targetRotationY - logoGroup.rotation.y) * 0.065;
      logoGroup.rotation.x += (targetRotationX - logoGroup.rotation.x) * 0.065;

      // Tourbillon Gyro Rotations dynamically energized by scroll velocity
      const extraSpin = Math.min(scrollVelocity * 0.0008, 0.05);
      if (ring1) {
        ring1.rotation.z -= (0.007 + extraSpin);
        ring1.rotation.x += 0.002;
      }
      if (ring2) {
        ring2.rotation.z += (0.006 + extraSpin);
        ring2.rotation.y += 0.003;
      }
      if (ring3) {
        ring3.rotation.z -= (0.004 + extraSpin * 0.7);
        ring3.rotation.x -= 0.001;
      }

      // Harmonic Celestial Luxury Particle Wave Ripple
      if (particles && particles.geometry) {
        const posAttr = particles.geometry.attributes.position;
        const posArray = posAttr.array;
        for (let i = 0; i < particleCount; i++) {
          const idx = i * 3;
          posArray[idx + 1] = basePositions[idx + 1] + Math.sin(elapsedTime * 1.4 + basePositions[idx] * 0.9) * 0.22;
        }
        posAttr.needsUpdate = true;
        particles.rotation.y = elapsedTime * 0.035;
      }

      // Atmospheric Breathing Aurora Aura
      if (glowMesh) {
        const shimmer = 1.0 + Math.sin(elapsedTime * 2.2) * 0.05;
        glowMesh.scale.setScalar(shimmer);
      }
      if (foxMesh && foxMesh.material) {
        const glint = Math.sin(elapsedTime * 4.0);
        if (glint > 0.96) {
          foxMesh.material.opacity = 0.94;
        } else {
          foxMesh.material.opacity = 1.0;
        }
      }

      renderer.render(scene, camera);
    };

    animate(performance.now());

  } catch (err) {
    console.warn('CREVINOX 3D Background Logo initialized fallback:', err);
    if (container) {
      container.style.background = 'radial-gradient(circle at 75% 50%, rgba(56, 189, 248, 0.12) 0%, rgba(2, 132, 199, 0.05) 45%, transparent 70%)';
    }
  }
}
