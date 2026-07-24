import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Three.js фоновая анимация — поле частиц со связями.
 * Canvas позиционируется как fixed-слой позади контента.
 * При размонтировании все ресурсы корректно освобождаются.
 */
export default function ThreeBackground() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // --- Сцена, камера, рендерер ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 50;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // --- Частицы ---
    const PARTICLE_COUNT = 120;
    const CONNECTION_DISTANCE = 12;
    const geometry = new THREE.BufferGeometry();

    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const velocities = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);

    const palette = [
      new THREE.Color(0x818cf8), // indigo-400
      new THREE.Color(0x6366f1), // indigo-500
      new THREE.Color(0xa78bfa), // violet-400
      new THREE.Color(0x34d399), // emerald-400
    ];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 100;
      positions[i3 + 1] = (Math.random() - 0.5) * 60;
      positions[i3 + 2] = (Math.random() - 0.5) * 40;

      velocities[i3] = (Math.random() - 0.5) * 0.02;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.02;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.01;

      const color = palette[Math.floor(Math.random() * palette.length)];
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.4,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(geometry, particleMaterial);
    scene.add(particles);

    // --- Линии связей между близкими частицами ---
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x818cf8,
      transparent: true,
      opacity: 0.08,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    // Максимальное количество линий — выделяем буфер заранее
    const MAX_LINES = PARTICLE_COUNT * 3;
    const linePositions = new Float32Array(MAX_LINES * 6);
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    const lineMesh = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lineMesh);

    // --- Анимация ---
    let animationId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const dt = clock.getDelta();
      const pos = geometry.attributes.position as THREE.BufferAttribute;
      const arr = pos.array as Float32Array;

      // Двигаем частицы
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const i3 = i * 3;
        arr[i3] += velocities[i3] * dt * 60;
        arr[i3 + 1] += velocities[i3 + 1] * dt * 60;
        arr[i3 + 2] += velocities[i3 + 2] * dt * 60;

        // Отражение от границ
        if (Math.abs(arr[i3]) > 50) velocities[i3] *= -1;
        if (Math.abs(arr[i3 + 1]) > 30) velocities[i3 + 1] *= -1;
        if (Math.abs(arr[i3 + 2]) > 20) velocities[i3 + 2] *= -1;
      }
      pos.needsUpdate = true;

      // Пересчитываем линии связей
      let lineIdx = 0;
      const lineArr = lineGeometry.attributes.position.array as Float32Array;
      for (let i = 0; i < PARTICLE_COUNT && lineIdx < MAX_LINES; i++) {
        for (let j = i + 1; j < PARTICLE_COUNT && lineIdx < MAX_LINES; j++) {
          const dx = arr[i * 3] - arr[j * 3];
          const dy = arr[i * 3 + 1] - arr[j * 3 + 1];
          const dz = arr[i * 3 + 2] - arr[j * 3 + 2];
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
          if (dist < CONNECTION_DISTANCE) {
            const li = lineIdx * 6;
            lineArr[li] = arr[i * 3];
            lineArr[li + 1] = arr[i * 3 + 1];
            lineArr[li + 2] = arr[i * 3 + 2];
            lineArr[li + 3] = arr[j * 3];
            lineArr[li + 4] = arr[j * 3 + 1];
            lineArr[li + 5] = arr[j * 3 + 2];
            lineIdx++;
          }
        }
      }
      // Обнуляем оставшиеся вершины
      for (let k = lineIdx * 6; k < MAX_LINES * 6; k++) {
        lineArr[k] = 0;
      }
      lineGeometry.attributes.position.needsUpdate = true;
      lineGeometry.setDrawRange(0, lineIdx * 2);

      // Медленное вращение всей сцены для глубины
      particles.rotation.y = Math.sin(clock.elapsedTime * 0.05) * 0.15;
      particles.rotation.x = Math.cos(clock.elapsedTime * 0.03) * 0.05;
      lineMesh.rotation.y = particles.rotation.y;
      lineMesh.rotation.x = particles.rotation.x;

      renderer.render(scene, camera);
    };

    animate();

    // --- Ресайз ---
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // --- Очистка при размонтировании ---
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      geometry.dispose();
      particleMaterial.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ opacity: 0.5 }}
      aria-hidden="true"
    />
  );
}
