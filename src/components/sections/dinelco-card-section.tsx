"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three-stdlib";

function isWebGLAvailable(): boolean {
  try {
    const canvas = document.createElement("canvas");
    const ctx =
      canvas.getContext("webgl") ?? canvas.getContext("experimental-webgl");
    return !!ctx;
  } catch {
    return false;
  }
}

// ── Tarjeta CSS estática — imita el diseño del canvas de Three.js ─────────────
function CardFallback() {
  return (
    <div className="w-full h-125 md:h-150 lg:h-175 flex items-center justify-center">
      <style>{`
        @keyframes card-float {
          0%, 100% { transform: perspective(1200px) rotateY(-8deg) rotateX(3deg) translateY(0px); }
          50%       { transform: perspective(1200px) rotateY(-8deg) rotateX(3deg) translateY(-18px); }
        }
        @keyframes card-shadow-pulse {
          0%, 100% { opacity: 0.35; transform: translateX(-50%) scaleX(1); }
          50%       { opacity: 0.2;  transform: translateX(-50%) scaleX(0.85); }
        }
      `}</style>

      <div
        className="relative"
        style={{ animation: "card-float 3.5s ease-in-out infinite" }}
      >
        {/* Tarjeta: mismo aspect ratio que el canvas 648×1024 ≈ 0.63 */}
        <div
          className="relative w-[190px] h-[300px] sm:w-[280px] sm:h-[444px] lg:w-[320px] lg:h-[506px] rounded-[18px] overflow-hidden"
          style={{
            background:
              "linear-gradient(145deg, #7a3faa 0%, #5c2d91 55%, #46226e 100%)",
          }}
        >
          {/* Reflejo superior (clearcoat) */}
          <div
            className="absolute inset-0 rounded-[18px] pointer-events-none z-10"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.04) 40%, transparent 70%)",
            }}
          />

          {/* Isologo de fondo semitransparente */}
          <div className="absolute bottom-0 -right-8 sm:-right-12 w-48 h-48 sm:w-[28rem] sm:h-[28rem] opacity-20 pointer-events-none">
            <Image
              src="/assets/dinelco/dinelco-isologo-background.svg"
              alt=""
              fill
              className="object-contain"
              aria-hidden
            />
          </div>

          {/* ── Contenido de la tarjeta ── */}

          {/* Texto tipo tarjeta arriba */}
          <p className="absolute top-[14px] left-[18px] text-white/60 text-[9px] font-medium tracking-widest uppercase z-20">
            Crédito / Débito
          </p>

          {/* Logo BEPSA arriba derecha */}
          <div className="absolute top-[10px] right-[14px] w-[56px] h-[18px] z-20">
            <Image
              src="/assets/bepsa-logo.svg"
              alt="BEPSA"
              fill
              className="object-contain object-right"
            />
          </div>

          {/* Chip EMV */}
          <div
            className="absolute top-[46px] left-[18px] w-[44px] h-[34px] rounded-[5px] z-20"
            style={{
              background: "linear-gradient(160deg, #f4e4c1, #d4c49a)",
              boxShadow:
                "inset 0 1px 2px rgba(255,255,255,0.5), 0 2px 4px rgba(0,0,0,0.2)",
            }}
          >
            {/* Líneas del chip */}
            <div className="absolute inset-[5px] flex flex-col justify-between">
              {[0, 1, 2].map((i) => (
                <div key={i} className="w-full h-[1px] bg-[#b8a882]/60" />
              ))}
            </div>
          </div>

          {/* Logo Dinelco abajo izquierda */}
          <div className="absolute bottom-[18px] left-[18px] w-[72px] h-[48px] z-20">
            <Image
              src="/assets/dinelco/isologo-white.svg"
              alt="Dinelco"
              fill
              className="object-contain object-left"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function DinelcoCardSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const rafRef = useRef<number | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [webglAvailable, setWebglAvailable] = useState(true);

  useEffect(() => {
    if (!isWebGLAvailable()) {
      setWebglAvailable(false);
      return;
    }

    if (!containerRef.current) return;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      25,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      100,
    );
    camera.position.z = 6;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(
      containerRef.current.clientWidth,
      containerRef.current.clientHeight,
    );
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.4;

    containerRef.current.appendChild(renderer.domElement);

    const cardWidth = 1.25,
      cardHeight = 2,
      cardDepth = 0.02,
      radius = 0.12;
    const geometry = new RoundedBoxGeometry(
      cardWidth,
      cardHeight,
      cardDepth,
      16,
      radius,
    );

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    canvas.width = 648;
    canvas.height = 1024;

    ctx.fillStyle = "#5c2d91";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const backgroundImg = new Image();
    backgroundImg.onload = () => {
      ctx.globalAlpha = 0.3;
      ctx.drawImage(backgroundImg, 150, 340, 500, 680);
      ctx.globalAlpha = 1.0;
      texture.needsUpdate = true;
    };
    backgroundImg.src = "/assets/dinelco/dinelco-isologo-background.svg";

    const chipX = 50,
      chipY = 120,
      chipW = 70,
      chipH = 55;
    const chipGradient = ctx.createLinearGradient(
      chipX,
      chipY,
      chipX,
      chipY + chipH,
    );
    chipGradient.addColorStop(0, "#f4e4c1");
    chipGradient.addColorStop(0.5, "#e6d5a8");
    chipGradient.addColorStop(1, "#d4c49a");
    ctx.fillStyle = chipGradient;
    ctx.fillRect(chipX, chipY, chipW, chipH);
    ctx.strokeStyle = "#b8a882";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(chipX, chipY, chipW, chipH);
    ctx.strokeStyle = "#c9b896";
    ctx.lineWidth = 1;
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.moveTo(chipX + 10, chipY + 12 + i * 12);
      ctx.lineTo(chipX + chipW - 10, chipY + 12 + i * 12);
      ctx.stroke();
    }

    ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
    ctx.lineWidth = 4;
    const contactlessX = 550,
      contactlessY = 140;
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.arc(contactlessX, contactlessY, 15 + i * 15, -0.6, 0.6);
      ctx.stroke();
    }

    ctx.fillStyle = "#ffffff";
    ctx.font = "22px Arial";
    ctx.textAlign = "left";
    ctx.fillText("Crédito / Débito", 50, 55);

    const bepsLogoImg = new Image();
    bepsLogoImg.src = "/assets/bepsa-logo.svg";
    bepsLogoImg.onload = () => {
      ctx.drawImage(bepsLogoImg, 520, 35, 100, 30);
      texture.needsUpdate = true;
    };

    const logoImg = new Image();
    logoImg.src = "/assets/dinelco/isologo-white.svg";
    logoImg.onload = () => {
      ctx.drawImage(logoImg, 40, 860, 120, 80);
      texture.needsUpdate = true;
    };

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;

    const frontMaterial = new THREE.MeshPhysicalMaterial({
      map: texture,
      metalness: 0.15,
      roughness: 0.35,
      clearcoat: 0.9,
      clearcoatRoughness: 0.25,
      reflectivity: 0.6,
    });

    const backMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x5c2d91,
      metalness: 0.2,
      roughness: 0.5,
      clearcoat: 0.6,
    });

    const edgeMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xe8e8e8,
      metalness: 0.85,
      roughness: 0.15,
      clearcoat: 0.95,
      emissive: 0xcccccc,
      emissiveIntensity: 0.1,
    });

    const materials = [
      edgeMaterial,
      edgeMaterial,
      edgeMaterial,
      edgeMaterial,
      frontMaterial,
      backMaterial,
    ];

    const card = new THREE.Mesh(geometry, materials);
    card.castShadow = true;
    card.receiveShadow = true;
    scene.add(card);

    scene.add(new THREE.AmbientLight(0xffffff, 0.5));

    const mainLight = new THREE.DirectionalLight(0xffffff, 0.4);
    mainLight.position.set(3, 4, 5);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    scene.add(mainLight);

    const rimLight = new THREE.DirectionalLight(0xb8a0d9, 0.3);
    rimLight.position.set(-3, -2, -3);
    scene.add(rimLight);

    const mouseLight = new THREE.PointLight(0xffffff, 2, 20);
    mouseLight.position.set(0, 0, 4);
    scene.add(mouseLight);

    const purpleLight = new THREE.PointLight(0x9370db, 0.2, 10);
    purpleLight.position.set(-2, 2, 3);
    scene.add(purpleLight);

    const handleMouseMove = (event: MouseEvent) => {
      if (!sectionRef.current) return;
      const rect = containerRef.current!.getBoundingClientRect();
      mouseRef.current.targetX =
        ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.targetY =
        -((event.clientY - rect.top) / rect.height) * 2 + 1;
      const sectionRect = sectionRef.current.getBoundingClientRect();
      setMousePosition({
        x: ((event.clientX - sectionRect.left) / sectionRect.width) * 100,
        y: ((event.clientY - sectionRect.top) / sectionRect.height) * 100,
      });
    };

    const handleMouseLeave = () => {
      mouseRef.current.targetX = 0;
      mouseRef.current.targetY = 0;
      setMousePosition({ x: 50, y: 50 });
    };

    sectionRef.current?.addEventListener("mousemove", handleMouseMove);
    sectionRef.current?.addEventListener("mouseleave", handleMouseLeave);

    const clock = new THREE.Clock();

    function animate() {
      rafRef.current = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      mouseRef.current.x +=
        (mouseRef.current.targetX - mouseRef.current.x) * 0.08;
      mouseRef.current.y +=
        (mouseRef.current.targetY - mouseRef.current.y) * 0.08;

      card.rotation.y = -mouseRef.current.x * 0.25;
      card.rotation.x = mouseRef.current.y * 0.25;
      card.position.y = Math.sin(elapsedTime * 0.6) * 0.08;

      mouseLight.position.x = mouseRef.current.x * 3;
      mouseLight.position.y = mouseRef.current.y * 3;
      mouseLight.intensity = 2 + Math.sin(elapsedTime * 1.5) * 0.3;

      purpleLight.position.x = -mouseRef.current.x * 1.5;
      purpleLight.position.y = -mouseRef.current.y * 1.5;

      renderer.render(scene, camera);
    }

    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect =
        containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(
        containerRef.current.clientWidth,
        containerRef.current.clientHeight,
      );
    };
    window.addEventListener("resize", handleResize);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      sectionRef.current?.removeEventListener("mousemove", handleMouseMove);
      sectionRef.current?.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      geometry.dispose();
      texture.dispose();
      materials.forEach((m) => m.dispose());
      const c = containerRef.current?.querySelector("canvas");
      if (c && c.parentElement === containerRef.current) {
        containerRef.current.removeChild(c);
      }
    };
  }, []);

  return (
    <div className="relative w-full bg-white overflow-hidden mb-32">
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="diagonal-pattern"
            x="0"
            y="0"
            width="100"
            height="100"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(-45)"
          >
            <rect x="0" y="0" width="50" height="100" fill="#0a0a0a" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#diagonal-pattern)" />
      </svg>

      <div
        ref={sectionRef}
        className="relative w-full min-h-screen bg-black overflow-hidden"
      >
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle 600px at ${mousePosition.x}% ${mousePosition.y}%, rgba(147, 112, 219, 0.15), transparent 80%)`,
          }}
        />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="mb-16">
            <h2 className="font-gilroy font-semibold text-white text-3xl sm:text-4xl md:text-5xl">
              Una marca consolidada
            </h2>
            <p className="text-lg text-purple-200 mt-6 max-w-2xl">
              Te respaldan tus productos de pago con presencia y confianza en
              todo el mercado
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Tarjeta: 3D o fallback CSS */}
            {webglAvailable ? (
              <div
                ref={containerRef}
                className="w-full h-[500px] md:h-[600px] lg:h-[700px]"
              />
            ) : (
              <CardFallback />
            )}

            <div className="flex flex-col gap-8 lg:gap-12 lg:pt-20">
              <div>
                <div className="mb-4 p-4 rounded-full bg-primary backdrop-blur-sm w-fit">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  Red consolidada
                </h3>
                <p className="text-base text-primary-100 leading-relaxed">
                  Más de 36 años innovando continuamente, utilizando
                  metodologías reconocidas a nivel mundial, impulsando el
                  crecimiento de nuestros colaboradores, la integridad, el
                  trabajo en equipo, la sustentabilidad, la inclusión y la
                  innovación
                </p>
              </div>

              <div>
                <div className="mb-4 p-4 rounded-full bg-primary backdrop-blur-sm w-fit">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  Tarifas competitivas
                </h3>
                <p className="text-base text-purple-200 leading-relaxed">
                  Estructura de costos favorable que permite ofrecer soluciones
                  de pago atractivas para tu cartera de clientes
                </p>
              </div>

              <div>
                <div className="mb-4 p-4 rounded-full bg-primary backdrop-blur-sm w-fit">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  Marca personalizable
                </h3>
                <p className="text-base text-purple-200 leading-relaxed">
                  Productos adaptables a las necesidades específicas de tu
                  negocio, manteniendo el respaldo de una marca reconocida
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
