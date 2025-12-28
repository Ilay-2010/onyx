
import React, { useEffect, useRef } from 'react';

declare const THREE: any;

const Background3D: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cubesRef = useRef<any[]>([]);
  const stateRef = useRef({
    targetOpacity: 0.1,
    currentOpacity: 0.1,
    scrollTargetY: 0,
    currentScrollY: 0
  });

  useEffect(() => {
    if (!canvasRef.current || typeof THREE === 'undefined') {
      const checkInterval = setInterval(() => {
        if (typeof THREE !== 'undefined' && canvasRef.current) {
          clearInterval(checkInterval);
          init();
        }
      }, 100);
      return () => clearInterval(checkInterval);
    } else {
      init();
    }

    function init() {
      if (!canvasRef.current) return;
      
      const isMobile = window.innerWidth < 768;
      
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ 
        canvas: canvasRef.current, 
        // Disable antialias on mobile for performance boost
        antialias: !isMobile, 
        alpha: true,
        powerPreference: "high-performance"
      });
      
      renderer.setSize(window.innerWidth, window.innerHeight);
      
      // Lock pixel ratio to 1 on mobile to avoid GPU overhead from high-DPI screens
      const pixelRatio = isMobile ? 1 : (window.devicePixelRatio > 1 ? 2 : 1);
      renderer.setPixelRatio(pixelRatio);

      // Mobile geometry uses 0 detail (minimal triangles)
      const geometry = new THREE.IcosahedronGeometry(1.8, isMobile ? 0 : 1);
      const material = new THREE.MeshBasicMaterial({ 
        color: 0x9333ea, 
        wireframe: true, 
        transparent: true, 
        opacity: 0.1 
      });

      const fieldRange = isMobile ? 30 : 50; 
      const cubes: any[] = [];
      
      // Significantly reduce object count on mobile (6 vs 15)
      const objectCount = isMobile ? 6 : 15;
      
      for (let i = 0; i < objectCount; i++) {
        const cube = new THREE.Mesh(geometry, material.clone());
        const initialPos = {
            x: (Math.random() - 0.5) * fieldRange,
            y: (Math.random() - 0.5) * fieldRange,
            z: (Math.random() - 0.5) * (isMobile ? 10 : 20)
        };
        cube.position.set(initialPos.x, initialPos.y, initialPos.z);
        (cube as any).initialX = initialPos.x;
        (cube as any).initialY = initialPos.y;
        (cube as any).speedMult = 0.5 + Math.random();
        
        cube.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
        scene.add(cube);
        cubes.push(cube);
      }
      cubesRef.current = cubes;

      // Simplier grid for mobile
      const grid = new THREE.GridHelper(200, isMobile ? 40 : 80, 0x111111, 0x050505);
      grid.position.y = -20;
      scene.add(grid);

      camera.position.z = 25;

      let mouseX = 0;
      let mouseY = 0;

      const onMouseMove = (e: MouseEvent) => {
        mouseX = (e.clientX / window.innerWidth) - 0.5;
        mouseY = (e.clientY / window.innerHeight) - 0.5;
      };

      const onScroll = () => {
        stateRef.current.scrollTargetY = window.scrollY;
      };

      const onKeyDown = () => {
        stateRef.current.currentOpacity = 0.3; // Subtler pulse on mobile
      };

      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('keydown', onKeyDown);

      const animate = () => {
        requestAnimationFrame(animate);

        stateRef.current.currentOpacity += (stateRef.current.targetOpacity - stateRef.current.currentOpacity) * 0.05;
        stateRef.current.currentScrollY += (stateRef.current.scrollTargetY - stateRef.current.currentScrollY) * 0.05;

        const time = Date.now() * 0.0005;

        cubes.forEach((cube, i) => {
          cube.rotation.x += 0.001 * (i % 2 === 0 ? 1 : -1);
          cube.rotation.y += 0.0008;
          
          const scrollOffset = stateRef.current.currentScrollY * 0.02 * (cube as any).speedMult;
          const floatOffset = Math.sin(time + i) * 2;
          
          let targetY = (cube as any).initialY - scrollOffset + floatOffset;
          
          const halfRange = fieldRange / 2;
          cube.position.y = ((targetY + halfRange) % fieldRange + fieldRange) % fieldRange - halfRange;
          
          cube.material.opacity = stateRef.current.currentOpacity;
        });

        // Skip parallax calculations if no movement detected for mobile efficiency
        if (!isMobile || (Math.abs(mouseX) > 0.01 || Math.abs(mouseY) > 0.01)) {
            camera.position.x += (mouseX * 15 - camera.position.x) * 0.02;
            const camScrollY = -stateRef.current.currentScrollY * 0.005;
            camera.position.y += (-mouseY * 15 + camScrollY - camera.position.y) * 0.02;
            camera.lookAt(0, 0, 0);
        }

        renderer.render(scene, camera);
      };

      animate();

      const handleResize = () => {
        if (!camera || !renderer) return;
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        
        // Dynamic re-scaling on rotation
        const isNowMobile = window.innerWidth < 768;
        renderer.setPixelRatio(isNowMobile ? 1 : (window.devicePixelRatio > 1 ? 2 : 1));
      };

      window.addEventListener('resize', handleResize);
    }
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: 'black' }}
    />
  );
};

export default Background3D;
