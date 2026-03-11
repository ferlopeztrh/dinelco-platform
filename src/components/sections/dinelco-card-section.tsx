"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three-stdlib";
import { isWebGLAvailable } from "@/lib/webgl";

// ── Tarjeta CSS estática — fallback sin WebGL ─────────────────────────────────
function CardFallback() {
  return (
    <div
      className="w-full h-125 md:h-150 lg:h-175 flex items-center justify-center"
      role="img"
      aria-label="Tarjeta de crédito/débito Dinelco con chip EMV y logo BEPSA"
    >
      <style>{`
        @keyframes card-float {
          0%, 100% { transform: perspective(1200px) rotateY(-8deg) rotateX(3deg) translateY(0px); }
          50%       { transform: perspective(1200px) rotateY(-8deg) rotateX(3deg) translateY(-18px); }
        }
      `}</style>
      <div
        className="relative"
        style={{ animation: "card-float 3.5s ease-in-out infinite" }}
        aria-hidden
      >
        <div
          className="relative w-[190px] h-[300px] sm:w-[280px] sm:h-[444px] lg:w-[320px] lg:h-[506px] rounded-[18px] overflow-hidden"
          style={{
            background:
              "linear-gradient(145deg, #7a3faa 0%, #5c2d91 55%, #46226e 100%)",
          }}
        >
          <div
            className="absolute inset-0 rounded-[18px] pointer-events-none z-10"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.04) 40%, transparent 70%)",
            }}
          />
          <div className="absolute bottom-0 -right-8 sm:-right-12 w-48 h-48 sm:w-[28rem] sm:h-[28rem] opacity-20 pointer-events-none">
            <Image
              src="/assets/dinelco/dinelco-isologo-background.svg"
              alt=""
              fill
              className="object-contain"
              aria-hidden
            />
          </div>
          <p className="absolute top-[14px] left-[18px] text-white/60 text-[9px] font-medium tracking-widest uppercase z-20">
            Crédito / Débito
          </p>
          <div className="absolute top-[10px] right-[14px] w-[56px] h-[18px] z-20">
            <Image
              src="/assets/bepsa-logo.svg"
              alt="BEPSA"
              fill
              className="object-contain object-right"
            />
          </div>
          <div
            className="absolute top-[46px] left-[18px] w-[44px] h-[34px] rounded-[5px] z-20"
            style={{
              background: "linear-gradient(160deg, #f4e4c1, #d4c49a)",
              boxShadow:
                "inset 0 1px 2px rgba(255,255,255,0.5), 0 2px 4px rgba(0,0,0,0.2)",
            }}
          >
            <div className="absolute inset-[5px] flex flex-col justify-between">
              {[0, 1, 2].map((i) => (
                <div key={i} className="w-full h-[1px] bg-[#b8a882]/60" />
              ))}
            </div>
          </div>
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
  const sectionRef = useRef<HTMLElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const rafRef = useRef<number | null>(null);
  const [webglAvailable] = useState(() => isWebGLAvailable());

  useEffect(() => {
    if (!webglAvailable) return;
    if (!containerRef.current) return;

    const container = containerRef.current;
    const section = sectionRef.current;
    const glow = glowRef.current;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      25,
      container.clientWidth / container.clientHeight,
      0.1,
      100,
    );
    camera.position.z = 6;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.4;
    container.appendChild(renderer.domElement);

    const geometry = new RoundedBoxGeometry(1.25, 2, 0.055, 16, 0.055);

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    canvas.width = 648;
    canvas.height = 1024;
    ctx.fillStyle = "#5c2d91";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const texture = new THREE.CanvasTexture(canvas);

    const backgroundImg = new window.Image();
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
    ctx.strokeStyle = "rgba(255,255,255,0.9)";
    ctx.lineWidth = 4;
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.arc(550, 140, 15 + i * 15, -0.6, 0.6);
      ctx.stroke();
    }
    ctx.fillStyle = "#ffffff";
    ctx.font = "22px Arial";
    ctx.textAlign = "left";
    ctx.fillText("Crédito / Débito", 50, 55);

    const bepsLogoImg = new window.Image();
    bepsLogoImg.src = "/assets/bepsa-logo.svg";
    bepsLogoImg.onload = () => {
      ctx.drawImage(bepsLogoImg, 520, 35, 100, 30);
      texture.needsUpdate = true;
    };

    const logoImg = new window.Image();
    logoImg.src = "/assets/dinelco/isologo-white.svg";
    logoImg.onload = () => {
      ctx.drawImage(logoImg, 40, 860, 120, 80);
      texture.needsUpdate = true;
    };

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
      color: 0xd0d0d8,
      metalness: 0.9,
      roughness: 0.08,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      emissive: 0xaaaacc,
      emissiveIntensity: 0.18,
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
    card.castShadow = card.receiveShadow = true;
    scene.add(card);

    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const mainLight = new THREE.DirectionalLight(0xffffff, 0.4);
    mainLight.position.set(3, 4, 5);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = mainLight.shadow.mapSize.height = 2048;
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

    // Glow — DOM directo, sin re-render React
    const handleMouseMove = (event: MouseEvent) => {
      if (!section || !glow) return;
      const rect = container.getBoundingClientRect();
      mouseRef.current.targetX =
        ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.targetY =
        -((event.clientY - rect.top) / rect.height) * 2 + 1;
      const sectionRect = section.getBoundingClientRect();
      const x = ((event.clientX - sectionRect.left) / sectionRect.width) * 100;
      const y = ((event.clientY - sectionRect.top) / sectionRect.height) * 100;
      glow.style.background = `radial-gradient(circle 700px at ${x}% ${y}%, rgba(124,58,185,0.12), transparent 70%)`;
    };
    const handleMouseLeave = () => {
      mouseRef.current.targetX = mouseRef.current.targetY = 0;
      if (glow)
        glow.style.background =
          "radial-gradient(circle 700px at 50% 50%, rgba(124,58,185,0.12), transparent 70%)";
    };

    section?.addEventListener("mousemove", handleMouseMove, { passive: true });
    section?.addEventListener("mouseleave", handleMouseLeave, {
      passive: true,
    });

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

    const handleResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    // IntersectionObserver — cancelar RAF por completo cuando no es visible
    // Mucho mejor que "return early": no encola callbacks en absoluto
    const visObs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Reanudar — resetear el clock para no tener un salto temporal
          clock.start();
          animate();
        } else {
          if (rafRef.current !== null) {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
          }
        }
      },
      { threshold: 0.05 },
    );
    if (section) visObs.observe(section);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      visObs.disconnect();
      section?.removeEventListener("mousemove", handleMouseMove);
      section?.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      geometry.dispose();
      texture.dispose();
      materials.forEach((m) => m.dispose());
      const c = container.querySelector("canvas");
      if (c && c.parentElement === container) container.removeChild(c);
    };
  }, [webglAvailable]);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="marca-consolidada-heading"
      className="relative w-full min-h-screen bg-[#0a0a0a] overflow-hidden"
    >
      {/* Glow mouse-follow — actualizado en DOM, sin re-renders */}
      <div
        ref={glowRef}
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle 700px at 50% 50%, rgba(124,58,185,0.12), transparent 70%)",
          willChange: "background",
        }}
        aria-hidden
      />

      <div
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
        aria-hidden
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="mb-16 lg:mb-20">
          <h2
            id="marca-consolidada-heading"
            className="font-gilroy font-semibold text-white text-3xl sm:text-4xl md:text-5xl leading-[1.1] tracking-tight"
          >
            Una marca consolidada
          </h2>
          <p className="text-lg text-white/60 mt-5 max-w-2xl leading-relaxed">
            Tus productos de pago respaldados por presencia y confianza en todo
            el mercado paraguayo.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {webglAvailable ? (
            <div
              ref={containerRef}
              className="w-full h-125 md:h-150 lg:h-175"
              role="img"
              aria-label="Tarjeta de crédito/débito Dinelco con chip EMV y logo BEPSA, animación 3D interactiva"
            />
          ) : (
            <CardFallback />
          )}

          <ul
            aria-label="Características de la red Dinelco"
            className="flex flex-col list-none p-0 m-0"
          >
            {[
              {
                title: "Red consolidada",
                description:
                  "Más de 36 años innovando con metodologías reconocidas a nivel mundial, impulsando la integridad, el trabajo en equipo y la innovación.",
              },
              {
                title: "Tarifas competitivas",
                description:
                  "Estructura de costos favorable que permite ofrecer soluciones de pago atractivas para tu cartera de clientes.",
              },
              {
                title: "Marca personalizable",
                description:
                  "Productos adaptables a las necesidades específicas de tu negocio, manteniendo el respaldo de una marca reconocida.",
              },
            ].map((feature, i) => (
              <li
                key={i}
                className="flex gap-5 py-8 border-b border-white/[0.06] last:border-b-0 first:pt-0"
              >
                <div className="flex-shrink-0 mt-1" aria-hidden>
                  <svg
                    className="w-6 h-6 text-purple-400"
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    focusable="false"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 10l4.5 4.5L16 6"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2 font-gilroy tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="font-notosans text-base font-bold md:text-lg text-white/50 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </li>
            ))}

            <li className="mt-10 list-none">
              <a
                href="/sobre-nosotros"
                className="inline-flex items-center gap-2 text-base text-white/50 hover:text-white transition-colors duration-200 group"
              >
                <span>Conocé más sobre la red dinelco</span>
                <svg
                  className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  viewBox="0 0 24 24"
                  aria-hidden
                  focusable="false"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
        aria-hidden
      />
    </section>
  );
}
