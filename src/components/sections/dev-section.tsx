"use client";

import { useEffect, useRef, useState } from "react";
import { SlideTextButton } from "@/components/ui/slide-text-button";

// ── Datos ─────────────────────────────────────────────────────────────────────
const stats = [
  {
    label: "Transacciones procesadas por mes",
    value: "+3,5M",
    sub: "en toda la red nacional",
  },
  {
    label: "Tiempo de actividad",
    value: "99,999%",
    sub: "uptime histórico garantizado",
  },
  {
    label: "Tarjetas procesadas",
    value: "+1,2M",
    sub: "débito y crédito activas",
  },
];

// ── Tipos y datos del grafo ────────────────────────────────────────────────────
type NodeDef = {
  id: string;
  label: string;
  sublabel?: string;
  col: 0 | 1 | 2 | 3 | 4 | 5;
  row: number;
};

const NODES: NodeDef[] = [
  { id: "ecommerce", label: "E-commerce", col: 0, row: 0 },
  { id: "mobile", label: "App Mobile", col: 0, row: 1 },
  { id: "crm", label: "CRM / ERP", col: 0, row: 2 },
  { id: "cms", label: "CMS", col: 0, row: 3 },

  { id: "rest", label: "REST API", sublabel: "HTTPS / JSON", col: 1, row: 1.5 },
  {
    id: "gateway",
    label: "API Gateway",
    sublabel: "Seguridad",
    col: 2,
    row: 1.5,
  },

  { id: "dinelco", label: "dinelco.", col: 3, row: 1.5 },

  {
    id: "3ds",
    label: "3D Secure",
    sublabel: "Fricción · Sin fricción",
    col: 4,
    row: 0.5,
  },
  {
    id: "challenge",
    label: "Autenticación",
    sublabel: "verif. de tarjeta",
    col: 4,
    row: 1.5,
  },
  {
    id: "infra",
    label: "Infra BEPSA",
    sublabel: "Processing layer",
    col: 4,
    row: 2.5,
  },

  { id: "visa", label: "Visa / Mastercard", col: 5, row: 0.5 },
  { id: "dincard", label: "Tarjetas dinelco", col: 5, row: 1.5 },
  { id: "bepsa", label: "BEPSA Core", col: 5, row: 2.5 },
  { id: "portal", label: "Portal Comercios", col: 5, row: 3.5 },
];

const EDGES: [string, string][] = [
  ["ecommerce", "rest"],
  ["mobile", "rest"],
  ["crm", "rest"],
  ["cms", "rest"],
  ["rest", "gateway"],
  ["gateway", "dinelco"],
  ["dinelco", "3ds"],
  ["dinelco", "challenge"],
  ["dinelco", "infra"],
  ["dinelco", "portal"],
  ["3ds", "visa"],
  ["challenge", "dincard"],
  ["infra", "bepsa"],
];

const NODE_W: Record<number, number> = {
  0: 106,
  1: 100,
  2: 112,
  3: 88,
  4: 118,
  5: 140,
};
const NODE_H = 36;
const CENTER_W = 92;
const CENTER_H = 44;
const COL_PCT = [0.05, 0.19, 0.34, 0.5, 0.67, 0.9];

// ── Grafo SVG ─────────────────────────────────────────────────────────────────
function IntegrationGraph() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 960, h: 500 });
  const [hovered, setHovered] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const obs = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width;
      setSize({ w, h: Math.max(360, w * 0.52) });
    });
    if (containerRef.current) obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  const { w, h } = size;
  const colX = (col: number) => w * (COL_PCT[col] ?? 0.5);

  const PAD_Y = 36;
  const usableH = h - PAD_Y * 2;

  // Pre-computar columnas e índices una sola vez
  const rowsByCol: Record<number, NodeDef[]> = {
    0: [],
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
  };
  NODES.forEach((n) => rowsByCol[n.col].push(n));

  // Índice de posición de cada nodo en su columna — O(1) en nodePos
  const nodeIdxMap = Object.fromEntries(
    NODES.map((n) => [n.id, rowsByCol[n.col].indexOf(n)]),
  );

  const nodePos = (node: NodeDef) => {
    const col = rowsByCol[node.col];
    const count = col.length;
    const step = count > 1 ? usableH / (count - 1) : 0;
    const idx = nodeIdxMap[node.id];
    return {
      x: colX(node.col),
      y: count === 1 ? h / 2 : PAD_Y + idx * step,
    };
  };

  // Mapa id→nodo para O(1) en lugar de O(n) find() por cada edge/nodo
  const nodeMap = Object.fromEntries(NODES.map((n) => [n.id, n]));

  const connectedSet = hovered
    ? new Set(
        EDGES.filter((e) => e[0] === hovered || e[1] === hovered).flatMap(
          (e) => e,
        ),
      )
    : null;

  const centerPos = nodePos(nodeMap["dinelco"]);

  return (
    <div ref={containerRef} style={{ width: "100%", position: "relative" }}>
      <style>{`
        @keyframes pulse-ring {
          0%   { opacity: 0.5;  transform: scale(1);   }
          100% { opacity: 0;    transform: scale(2.0); }
        }
        @keyframes flow-dash {
          from { stroke-dashoffset: 26; }
          to   { stroke-dashoffset: 0;  }
        }
        .edge-flow { animation: flow-dash 1.4s linear infinite; }
        .pulse-a { animation: pulse-ring 2.4s ease-out infinite;      transform-origin: ${centerPos.x}px ${centerPos.y}px; }
        .pulse-b { animation: pulse-ring 2.4s ease-out infinite 1.2s; transform-origin: ${centerPos.x}px ${centerPos.y}px; }
      `}</style>

      {!mounted ? null : (
        <svg
          viewBox={`0 0 ${w} ${h}`}
          width={w}
          height={h}
          style={{ width: "100%", height: "auto", display: "block" }}
          aria-label="Diagrama de integración REST API de Dinelco"
          role="img"
        >
          <defs>
            {/* Gradiente diagonal para el nodo central dinelco. */}
            {/* x1/y1/x2/y2 en porcentaje simulan un ángulo de ~135deg */}
            <linearGradient
              id="grad-dinelco"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#8754b6" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#ce0058" stopOpacity="0.65" />
            </linearGradient>

            <filter
              id="glow-center"
              x="-60%"
              y="-60%"
              width="220%"
              height="220%"
            >
              <feGaussianBlur stdDeviation="9" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter
              id="glow-hover"
              x="-50%"
              y="-50%"
              width="200%"
              height="200%"
            >
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Pulso central */}
          <rect
            x={centerPos.x - CENTER_W / 2}
            y={centerPos.y - CENTER_H / 2}
            width={CENTER_W}
            height={CENTER_H}
            rx={8}
            fill="none"
            stroke="#8754b6"
            strokeWidth={1.5}
            className="pulse-a"
          />
          <rect
            x={centerPos.x - CENTER_W / 2}
            y={centerPos.y - CENTER_H / 2}
            width={CENTER_W}
            height={CENTER_H}
            rx={8}
            fill="none"
            stroke="#ce0058"
            strokeWidth={1}
            className="pulse-b"
          />

          {/* Edges */}
          {EDGES.map(([aId, bId], idx) => {
            const a = nodePos(nodeMap[aId]);
            const b = nodePos(nodeMap[bId]);
            const fromCenter = aId === "dinelco";
            const toCenter = bId === "dinelco";
            const isCentral = fromCenter || toCenter;
            const dimmed =
              connectedSet && !connectedSet.has(aId) && !connectedSet.has(bId);

            const mx = (a.x + b.x) / 2;
            const d = `M ${a.x} ${a.y} C ${mx} ${a.y}, ${mx} ${b.y}, ${b.x} ${b.y}`;
            const gid = `g-${aId}-${bId}`;

            const c1 = fromCenter ? "#ce0058" : "#8754b6";
            const c2 = fromCenter ? "#8754b6" : "#ce0058";

            return (
              <g key={gid}>
                <defs>
                  <linearGradient
                    id={gid}
                    gradientUnits="userSpaceOnUse"
                    x1={a.x}
                    y1={a.y}
                    x2={b.x}
                    y2={b.y}
                  >
                    <stop offset="0%" stopColor={c1} stopOpacity="0.7" />
                    <stop offset="100%" stopColor={c2} stopOpacity="0.25" />
                  </linearGradient>
                </defs>
                <path
                  d={d}
                  fill="none"
                  stroke="rgba(255,255,255,0.07)"
                  strokeWidth={1}
                />
                <path
                  d={d}
                  fill="none"
                  stroke={`url(#${gid})`}
                  strokeWidth={isCentral ? 1.5 : 1}
                  strokeDasharray="8 18"
                  className="edge-flow"
                  style={{
                    opacity: dimmed ? 0.06 : 1,
                    transition: "opacity 0.22s",
                    animationDuration: toCenter
                      ? "1.3s"
                      : fromCenter
                        ? "1.0s"
                        : "1.7s",
                    animationDelay: `${idx * 0.08}s`,
                  }}
                />
              </g>
            );
          })}

          {/* Nodos */}
          {NODES.map((node) => {
            const pos = nodePos(node);
            const isCenter = node.id === "dinelco";
            const isHov = hovered === node.id;
            const isConn = connectedSet?.has(node.id) ?? false;
            const isDim = !!connectedSet && !isConn;

            const nw = isCenter ? CENTER_W : (NODE_W[node.col] ?? 104);
            const nh = isCenter ? CENTER_H : NODE_H;

            const fill = isCenter
              ? "url(#grad-dinelco)" // ← degradado primary→secondary
              : isHov || isConn
                ? "rgba(135,84,182,0.18)"
                : "rgba(255,255,255,0.04)";
            const stroke = isCenter
              ? "none"
              : isHov || isConn
                ? "#8754b6"
                : "rgba(255,255,255,0.10)";
            const tc = isCenter
              ? "#ffffff"
              : isHov || isConn
                ? "rgba(255,255,255,0.90)"
                : "rgba(255,255,255,0.50)";

            return (
              <g
                key={node.id}
                transform={`translate(${pos.x},${pos.y})`}
                style={{
                  opacity: isDim ? 0.15 : 1,
                  transition: "opacity 0.22s",
                }}
                onMouseEnter={() => setHovered(node.id)}
                onMouseLeave={() => setHovered(null)}
              >
                <rect
                  x={-nw / 2}
                  y={-nh / 2}
                  width={nw}
                  height={nh}
                  rx={7}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={isCenter ? 1.5 : 1}
                  filter={
                    isCenter
                      ? "url(#glow-center)"
                      : isHov
                        ? "url(#glow-hover)"
                        : undefined
                  }
                  style={{ transition: "fill 0.18s, stroke 0.18s" }}
                />
                <text
                  textAnchor="middle"
                  dominantBaseline={node.sublabel ? "auto" : "middle"}
                  y={node.sublabel ? -4 : 0}
                  fill={tc}
                  fontSize={isCenter ? 14 : 11}
                  fontWeight={isCenter ? 700 : 500}
                  fontFamily="Gilroy, sans-serif"
                  style={{
                    userSelect: "none",
                    pointerEvents: "none",
                    transition: "fill 0.18s",
                  }}
                >
                  {node.label}
                </text>
                {node.sublabel && (
                  <text
                    textAnchor="middle"
                    dominantBaseline="hanging"
                    y={5}
                    fill={
                      isHov || isConn
                        ? "rgba(255,255,255,0.4)"
                        : "rgba(255,255,255,0.2)"
                    }
                    fontSize={8.5}
                    fontFamily="'Noto Sans', sans-serif"
                    letterSpacing="0.05em"
                    style={{
                      userSelect: "none",
                      pointerEvents: "none",
                      transition: "fill 0.18s",
                    }}
                  >
                    {node.sublabel}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      )}
    </div>
  );
}

// ── Contador animado ──────────────────────────────────────────────────────────
function AnimatedStat({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [displayed, setDisplayed] = useState("0");
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const numMatch = value.replace(/\./g, "").match(/[\d,]+/);
          if (!numMatch) {
            setDisplayed(value);
            return;
          }
          const target = parseFloat(numMatch[0].replace(",", "."));
          const prefix = value.match(/^[+]/) ? "+" : "";
          const suffix = value.replace(/^[+]/, "").replace(/[\d.,]+/, "");
          const isPercent = suffix.includes("%");
          const duration = 1200;
          const start = performance.now();
          const tick = (now: number) => {
            const p = Math.min((now - start) / duration, 1);
            const ease = 1 - Math.pow(1 - p, 3);
            const current = ease * target;
            let formatted: string;
            if (isPercent) {
              formatted = current.toFixed(1).replace(".", ",") + "%";
            } else if (target >= 1000) {
              formatted =
                prefix +
                Math.round(current)
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            } else {
              formatted = prefix + Math.round(current).toString();
            }
            setDisplayed(formatted);
            if (p < 1) requestAnimationFrame(tick);
            else setDisplayed(value);
          };
          requestAnimationFrame(tick);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  return <span ref={ref}>{displayed}</span>;
}

// ── Sección principal ─────────────────────────────────────────────────────────
export function DevSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const glow = glowRef.current;
    if (!section || !glow) return;

    // Actualiza la posición directamente en el DOM — sin re-render de React
    const handleMouseMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      glow.style.background = `radial-gradient(circle 600px at ${x}% ${y}%, rgba(135,84,182,0.10), transparent 70%)`;
    };
    const handleMouseLeave = () => {
      glow.style.background =
        "radial-gradient(circle 600px at 50% 50%, rgba(135,84,182,0.10), transparent 70%)";
    };

    section.addEventListener("mousemove", handleMouseMove, { passive: true });
    section.addEventListener("mouseleave", handleMouseLeave, { passive: true });
    return () => {
      section.removeEventListener("mousemove", handleMouseMove);
      section.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="dev-section-heading"
      className="relative w-full bg-[#0d0d12] overflow-hidden"
    >
      {/* Glow mouse-follow — actualizado directo en DOM, sin re-renders */}
      <div
        ref={glowRef}
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle 600px at 50% 50%, rgba(135,84,182,0.10), transparent 70%)",
          willChange: "background",
        }}
        aria-hidden
      />
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        aria-hidden
        style={{
          backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <div
        className="absolute top-0 left-1/4 w-1/2 h-px pointer-events-none"
        aria-hidden
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(135,84,182,0.5), rgba(206,0,88,0.5), transparent)",
        }}
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Headline */}
        <div className="pt-24 lg:pt-32 pb-16 lg:pb-20 border-b border-white/[0.06]">
          <div className="max-w-3xl">
            <h2
              id="dev-section-heading"
              className="font-gilroy font-semibold text-white text-3xl sm:text-4xl md:text-5xl leading-[1.1] tracking-tight"
            >
              La infraestructura fiable y escalable que mejora tu stack.{" "}
              <span className="text-white/35">
                Aprovechá la flexibilidad de nuestra API para integrar Dinelco a
                las necesidades de tu negocio.
              </span>
            </h2>
          </div>
        </div>

        {/* Stats */}
        <div aria-label="Estadísticas de la red Dinelco" role="list">
          {stats.map((stat, i) => (
            <div
              key={i}
              role="listitem"
              className="flex items-baseline justify-between gap-8 py-6 border-b border-white/[0.05] group"
            >
              <div className="flex-shrink-0">
                <p className="text-[11px] font-medium tracking-[0.18em] uppercase text-white/25 font-notosans group-hover:text-white/50 transition-colors duration-200">
                  {stat.label}
                </p>
              </div>
              <div className="text-right">
                <p
                  className="font-gilroy font-semibold text-white leading-none tabular-nums"
                  style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}
                >
                  <AnimatedStat value={stat.value} />
                </p>
                <p className="text-xs text-white/20 mt-1 font-notosans">
                  {stat.sub}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Texto + CTAs */}
        <div className="pt-20 lg:pt-28 pb-12">
          <div className="max-w-2xl">
            <h3 className="font-gilroy font-semibold text-white text-2xl sm:text-3xl md:text-4xl leading-[1.15] tracking-tight">
              Integrá Dinelco a tu stack.{" "}
              <span className="text-white/35">
                Pagos, datos y autenticación en una sola API.
              </span>
            </h3>
            <p className="mt-5 text-base text-white/40 leading-relaxed font-notosans">
              Conectá tu e-commerce, ERP o app mobile con la infraestructura de
              pagos de Dinelco a través de nuestra API REST, lista para
              producción.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <SlideTextButton
                as="link"
                href="/documentacion"
                label="Ver documentación para desarrolladores"
                className="px-5 py-3 rounded-md text-sm bg-primary"
              />
              <SlideTextButton
                as="link"
                href="/documentacion/api"
                label="Centro de conocimiento"
                className="px-5 py-3 rounded-md text-sm border border-white/20 bg-transparent text-white"
              />
            </div>
          </div>
        </div>

        {/* Grafo full-width — oculto en mobile */}
        <div className="hidden sm:block pb-20 lg:pb-28">
          <div
            className="relative rounded-2xl overflow-hidden border border-white/[0.06] bg-white/[0.02] p-4 sm:p-8"
            aria-hidden
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse 50% 60% at 50% 50%, rgba(135,84,182,0.07), transparent)",
              }}
            />
            <IntegrationGraph />
            <div className="mt-4 flex items-center gap-5 justify-end">
              <div className="flex items-center gap-1.5">
                <div
                  className="w-4 h-px"
                  style={{ background: "rgba(255,255,255,0.15)" }}
                />
                <span className="text-[10px] text-white/25 font-notosans tracking-wide uppercase">
                  Base
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div
                  className="w-4 h-px"
                  style={{
                    background: "linear-gradient(to right, #8754b6, #ce0058)",
                  }}
                />
                <span className="text-[10px] text-white/25 font-notosans tracking-wide uppercase">
                  Flujo activo
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        aria-hidden
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(135,84,182,0.3), rgba(206,0,88,0.3), transparent)",
        }}
      />
    </section>
  );
}
