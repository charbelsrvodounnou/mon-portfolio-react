/**
 * Portfolio — Charbel Spéro VODOUNNOU
 * Développeur Web Front-End
 *
 * Structure :
 *  - Navbar (fixe, scroll-aware, menu mobile)
 *  - Hero
 *  - Pourquoi me choisir ?
 *  - Projets
 *  - Compétences
 *  - Contact (formulaire + liens)
 *  - Footer
 *
 * Pour remplacer la photo :
 *   Cherchez le commentaire « PHOTO » dans la section "Pourquoi me choisir ?"
 *   et remplacez la balise <div> placeholder par :
 *   <img src="votre-photo.jpg" alt="Charbel Spéro VODOUNNOU" className="about-photo" />
 *
 * Pour connecter le formulaire (EmailJS) :
 *   1. npm install @emailjs/browser
 *   2. Remplacez la simulation dans handleSubmit par emailjs.sendForm(...)
 */

import { useState, useEffect, useRef } from "react";
import emailjs from "@emailjs/browser";

/* ─────────────────────────────────────────────
   DONNÉES DU PORTFOLIO
───────────────────────────────────────────── */
const PROJECTS = [
    {
        title: "Application de gestion de tâches",
        subtitle: "To-Do App",
        description:
            "Application permettant de créer, modifier et organiser des tâches avec une interface fluide et intuitive.",
        tech: ["HTML", "CSS", "JavaScript", "React.js"],
        link: null,
    },
    {
        title: "Site vitrine pour entreprise locale",
        subtitle: null,
        description:
            "Conception d'un site moderne et responsive pour présenter les services d'une entreprise.",
        tech: ["HTML", "CSS", "Bootstrap"],
        link: null,
    },
    {
        title: "Dashboard analytique",
        subtitle: null,
        description:
            "Interface dynamique affichant des données sous forme de graphiques interactifs.",
        tech: ["React.js", "API REST"],
        link: null,
    },
];

const SKILLS_FRONTEND = ["HTML", "CSS", "Bootstrap", "JavaScript", "React.js"];
const SKILLS_BACKEND = ["SQL", "Bases de données relationnelles"];
const SKILLS_TOOLS = ["Git", "GitHub", "VS Code", "Figma"];
const KEY_SKILLS = [
    "Intégration pixel-perfect",
    "Développement responsive (mobile-first)",
    "Compatibilité cross-browser",
    "Intégration d'API REST / GraphQL",
    "Optimisation des performances web",
    "Accessibilité (bonnes pratiques WCAG)",
    "Gestion de version avec Git",
];

/* ─────────────────────────────────────────────
   STYLES GLOBAUX
───────────────────────────────────────────── */
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@300;400;500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg:          #FAFAF7;
  --bg-alt:      #F2EFE8;
  --text:        #1A1714;
  --text-light:  #6B6460;
  --accent:      #B8976A;
  --accent-dark: #956F44;
  --border:      #E4DED5;
  --white:       #FFFFFF;
  --display:     'Playfair Display', Georgia, serif;
  --body:        'DM Sans', system-ui, sans-serif;
  --max:         1180px;
}

html { scroll-behavior: smooth; font-size: 16px; }

body {
  font-family: var(--body);
  background: var(--bg);
  color: var(--text);
  line-height: 1.65;
  -webkit-font-smoothing: antialiased;
}

img { display: block; max-width: 100%; }

/* ── SCROLLBAR ── */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: var(--bg); }
::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }

/* ── NAVBAR ── */
.nav {
  position: fixed;
  inset: 0 0 auto 0;
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 48px;
  transition: padding .3s ease, background .3s ease, box-shadow .3s ease;
}
.nav.scrolled {
  padding: 14px 48px;
  background: rgba(250, 250, 247, 0.96);
  backdrop-filter: blur(12px);
  box-shadow: 0 1px 0 var(--border);
}
.nav-logo {
  font-family: var(--display);
  font-size: 20px;
  font-weight: 600;
  color: var(--text);
  text-decoration: none;
  letter-spacing: .3px;
}
.nav-logo em { color: var(--accent); font-style: normal; }
.nav-links {
  display: flex;
  gap: 40px;
  list-style: none;
}
.nav-links a {
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--text-light);
  text-decoration: none;
  position: relative;
  transition: color .2s;
}
.nav-links a::after {
  content: '';
  position: absolute;
  bottom: -4px; left: 0;
  width: 0; height: 1.5px;
  background: var(--accent);
  transition: width .25s ease;
}
.nav-links a:hover, .nav-links a.active { color: var(--accent); }
.nav-links a:hover::after, .nav-links a.active::after { width: 100%; }

/* ── HAMBURGER ── */
.hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px;
  z-index: 201;
}
.hamburger span {
  display: block;
  width: 22px;
  height: 1.5px;
  background: var(--text);
  transition: all .3s;
}
.hamburger.open span:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
.hamburger.open span:nth-child(2) { opacity: 0; }
.hamburger.open span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }

/* ── MOBILE MENU ── */
.mobile-menu {
  display: none;
  position: fixed;
  inset: 0;
  background: var(--bg);
  z-index: 199;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 28px;
}
.mobile-menu.open { display: flex; }
.mobile-menu a {
  font-family: var(--display);
  font-size: 36px;
  font-weight: 300;
  color: var(--text);
  text-decoration: none;
  letter-spacing: .5px;
  transition: color .2s;
}
.mobile-menu a:hover { color: var(--accent); }

/* ── SECTION BASE ── */
.section { padding: 110px 48px; }
.section-inner { max-width: var(--max); margin: 0 auto; }
.section-alt { background: var(--bg-alt); }

.section-head { margin-bottom: 64px; }
.section-label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 10px;
}
.section-title {
  font-family: var(--display);
  font-size: clamp(38px, 5vw, 58px);
  font-weight: 300;
  color: var(--text);
  line-height: 1.08;
  letter-spacing: -.5px;
}
.section-title b { font-weight: 700; }
.section-rule {
  width: 56px;
  height: 2px;
  background: var(--accent);
  margin-top: 18px;
}

/* ── HERO ── */
.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 140px 48px 100px;
  position: relative;
  overflow: hidden;
}
.hero-inner {
  max-width: var(--max);
  margin: 0 auto;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 60px;
}
.hero-content { max-width: 640px; }
.hero-eye {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 28px;
}
.hero-eye::before {
  content: '';
  width: 32px; height: 1px;
  background: var(--accent);
}
.hero-name {
  font-family: var(--display);
  font-size: clamp(50px, 8vw, 90px);
  font-weight: 300;
  line-height: 1.02;
  color: var(--text);
  margin-bottom: 10px;
  letter-spacing: -2px;
}
.hero-name b { font-weight: 700; display: block; }
.hero-job {
  font-family: var(--display);
  font-size: clamp(18px, 2.5vw, 28px);
  font-weight: 300;
  color: var(--text-light);
  margin-bottom: 32px;
  letter-spacing: .5px;
}
.hero-tagline {
  font-size: 16px;
  color: var(--text-light);
  line-height: 1.85;
  font-weight: 300;
  margin-bottom: 48px;
  border-left: 2px solid var(--accent);
  padding-left: 20px;
  max-width: 520px;
}
.hero-cta { display: flex; gap: 14px; flex-wrap: wrap; }

/* ── HERO DECORATION ── */
.hero-deco {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  opacity: .15;
}
.hero-deco-char {
  font-family: var(--display);
  font-size: 200px;
  font-weight: 700;
  color: var(--accent);
  line-height: 1;
  user-select: none;
  letter-spacing: -8px;
}

/* ── BUTTONS ── */
.btn {
  display: inline-block;
  padding: 14px 36px;
  font-family: var(--body);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  text-decoration: none;
  cursor: pointer;
  border: none;
  transition: all .25s ease;
}
.btn-dark {
  background: var(--text);
  color: var(--white);
}
.btn-dark:hover {
  background: var(--accent);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(184,151,106,.3);
}
.btn-ghost {
  background: transparent;
  color: var(--text);
  border: 1.5px solid var(--border);
}
.btn-ghost:hover {
  border-color: var(--accent);
  color: var(--accent);
  transform: translateY(-2px);
}

/* ── ABOUT ── */
.about-grid {
  display: grid;
  grid-template-columns: 380px 1fr;
  gap: 80px;
  align-items: center;
}
.about-photo-wrap { position: relative; }
.about-photo {
  width: 100%;
  aspect-ratio: 3/4;
  object-fit: cover;
  display: block;
}
.about-photo-placeholder {
  width: 100%;
  aspect-ratio: 3/4;
  background: var(--bg);
  border: 2px dashed var(--border);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  color: var(--text-light);
  font-size: 13px;
  text-align: center;
  padding: 32px;
}
.about-photo-placeholder svg { opacity: .35; }
.about-frame {
  position: absolute;
  top: 18px; left: -18px;
  right: 18px; bottom: -18px;
  border: 1.5px solid var(--accent);
  z-index: -1;
  opacity: .5;
  pointer-events: none;
}
.about-text p {
  font-size: 16px;
  color: var(--text-light);
  line-height: 1.9;
  font-weight: 300;
  margin-bottom: 22px;
}
.about-text p:last-child { margin-bottom: 0; }
.about-text strong { color: var(--text); font-weight: 600; }

/* ── PROJECTS ── */
.projects-note {
  font-size: 14px;
  color: var(--text-light);
  line-height: 1.8;
  font-style: italic;
  border-left: 2px solid var(--accent);
  padding-left: 18px;
  margin-bottom: 52px;
  max-width: 640px;
}
.projects-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;
}
.project-card {
  background: var(--white);
  border: 1px solid var(--border);
  padding: 36px 32px;
  position: relative;
  overflow: hidden;
  transition: transform .3s ease, box-shadow .3s ease;
}
.project-card::after {
  content: '';
  position: absolute;
  bottom: 0; left: 0;
  width: 100%; height: 2px;
  background: var(--accent);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform .35s ease;
}
.project-card:hover::after { transform: scaleX(1); }
.project-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 24px 48px rgba(0,0,0,.07);
}
.project-badge {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 22px;
}
.badge-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: var(--accent);
  animation: blink 2s ease-in-out infinite;
}
@keyframes blink {
  0%, 100% { opacity: 1; }
  50%       { opacity: .2; }
}
.project-title {
  font-family: var(--display);
  font-size: 20px;
  font-weight: 600;
  color: var(--text);
  line-height: 1.3;
  margin-bottom: 4px;
}
.project-sub {
  font-size: 12px;
  color: var(--text-light);
  margin-bottom: 14px;
  letter-spacing: .3px;
}
.project-desc {
  font-size: 14px;
  color: var(--text-light);
  line-height: 1.75;
  font-weight: 300;
  margin-bottom: 24px;
}
.project-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  margin-bottom: 22px;
}
.tag {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: .5px;
  text-transform: uppercase;
  padding: 4px 12px;
  background: var(--bg-alt);
  color: var(--text);
  border: 1px solid var(--border);
}
.project-soon {
  font-size: 12px;
  color: var(--text-light);
  font-style: italic;
  letter-spacing: .3px;
}

/* ── SKILLS ── */
.skills-cats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
  margin-bottom: 60px;
}
.skill-cat-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 2.5px;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 18px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--border);
}
.skill-tags { display: flex; flex-wrap: wrap; gap: 8px; }
.skill-tag {
  font-size: 13px;
  font-weight: 400;
  padding: 7px 16px;
  background: var(--white);
  border: 1px solid var(--border);
  color: var(--text);
  cursor: default;
  transition: all .2s;
}
.skill-tag:hover {
  border-color: var(--accent);
  color: var(--accent);
  transform: translateY(-1px);
}
.key-title {
  font-family: var(--display);
  font-size: 26px;
  font-weight: 400;
  color: var(--text);
  margin-bottom: 24px;
}
.key-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
  gap: 10px;
  list-style: none;
}
.key-item {
  display: flex;
  align-items: center;
  gap: 14px;
  font-size: 14px;
  font-weight: 300;
  color: var(--text-light);
  padding: 13px 16px;
  background: var(--white);
  border: 1px solid var(--border);
  transition: border-color .2s;
}
.key-item:hover { border-color: var(--accent); }
.key-item::before {
  content: '';
  width: 5px; height: 5px;
  border-radius: 50%;
  background: var(--accent);
  flex-shrink: 0;
}

/* ── CONTACT ── */
.contact-grid {
  display: grid;
  grid-template-columns: 1fr 1.6fr;
  gap: 80px;
  align-items: start;
}
.contact-heading {
  font-family: var(--display);
  font-size: 30px;
  font-weight: 400;
  color: var(--text);
  margin-bottom: 18px;
  line-height: 1.3;
}
.contact-intro {
  font-size: 15px;
  color: var(--text-light);
  line-height: 1.8;
  font-weight: 300;
  margin-bottom: 40px;
}
.contact-list { list-style: none; display: flex; flex-direction: column; }
.contact-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 0;
  border-bottom: 1px solid var(--border);
  text-decoration: none;
  color: var(--text);
  font-size: 14px;
  font-weight: 400;
  transition: color .2s, padding-left .2s;
}
.contact-item:hover { color: var(--accent); padding-left: 6px; }
.contact-icon {
  width: 38px; height: 38px;
  border: 1px solid var(--border);
  background: var(--bg-alt);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background .2s, border-color .2s;
}
.contact-item:hover .contact-icon {
  background: var(--accent);
  border-color: var(--accent);
  color: white;
}

/* ── FORM ── */
.form { display: flex; flex-direction: column; gap: 18px; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
.field { display: flex; flex-direction: column; gap: 6px; }
.field-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--text-light);
}
.field-input, .field-textarea {
  padding: 13px 16px;
  background: var(--white);
  border: 1px solid var(--border);
  color: var(--text);
  font-family: var(--body);
  font-size: 14px;
  font-weight: 300;
  outline: none;
  resize: none;
  transition: border-color .2s;
}
.field-input:focus, .field-textarea:focus { border-color: var(--accent); }
.field-input.has-error, .field-textarea.has-error { border-color: #c0392b; }
.field-error { font-size: 11px; color: #c0392b; }
.form-success {
  padding: 14px 18px;
  background: #eef9ee;
  border: 1px solid #aed9ae;
  color: #2e6b2e;
  font-size: 14px;
  font-weight: 400;
  border-radius: 0;
}
.btn-submit {
  align-self: flex-start;
  min-width: 220px;
  text-align: center;
}
.btn-submit:disabled { opacity: .65; cursor: not-allowed; transform: none !important; }

/* ── FOOTER ── */
.footer {
  padding: 28px 48px;
  border-top: 1px solid var(--border);
}
.footer-inner {
  max-width: var(--max);
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.footer-text {
  font-size: 13px;
  color: var(--text-light);
  font-weight: 300;
}
.footer-text em {
  color: var(--accent);
  font-style: normal;
  font-weight: 500;
}

/* ── RESPONSIVE ── */
@media (max-width: 1024px) {
  .projects-grid { grid-template-columns: repeat(2, 1fr); }
  .skills-cats   { grid-template-columns: repeat(2, 1fr); }
  .about-grid    { grid-template-columns: 300px 1fr; gap: 56px; }
  .hero-deco     { display: none; }
}
@media (max-width: 768px) {
  .nav { padding: 16px 24px; }
  .nav.scrolled { padding: 12px 24px; }
  .nav-links { display: none; }
  .hamburger { display: flex; }

  .section { padding: 72px 24px; }

  .hero { padding: 100px 24px 72px; }
  .hero-inner { grid-template-columns: 1fr; }

  .about-grid    { grid-template-columns: 1fr; gap: 40px; }
  .about-photo-wrap { max-width: 300px; }

  .projects-grid { grid-template-columns: 1fr; }
  .skills-cats   { grid-template-columns: 1fr; gap: 28px; }
  .contact-grid  { grid-template-columns: 1fr; gap: 48px; }
  .form-row      { grid-template-columns: 1fr; }

  .footer { padding: 24px 24px; }
  .footer-inner { flex-direction: column; gap: 10px; text-align: center; }

  .hero-cta { flex-direction: column; }
  .btn { text-align: center; }
}
`;

/* ─────────────────────────────────────────────
   ICÔNES SVG (inline, pas de dépendance)
───────────────────────────────────────────── */
const IconMail = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <polyline points="22,6 12,13 2,6" />
    </svg>
);
const IconGithub = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
);
const IconLinkedin = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
);


/* ─────────────────────────────────────────────
   COMPOSANT PRINCIPAL
───────────────────────────────────────────── */
export default function Portfolio() {
    /* ── état ── */
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState("hero");
    const [form, setForm] = useState({ from_name: "", from_email: "", subject: "", message: "" });
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState(false);
    const formRef = useRef(null);   // ← ajoute cette ligne
    const [loading, setLoading] = useState(false);

    /* ── scroll listener ── */
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 60);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    /* ── section active (Intersection Observer) ── */
    useEffect(() => {
        const ids = ["hero", "about", "projects", "skills", "contact"];
        const observers = ids.map((id) => {
            const el = document.getElementById(id);
            if (!el) return null;
            const obs = new IntersectionObserver(
                ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
                { threshold: 0.35 }
            );
            obs.observe(el);
            return obs;
        });
        return () => observers.forEach((o) => o?.disconnect());
    }, []);

    /* ── fermer menu au resize ── */
    useEffect(() => {
        const onResize = () => { if (window.innerWidth > 768) setMenuOpen(false); };
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    /* ── navigation items ── */
    const navItems = [
        { label: "Accueil", href: "hero" },
        { label: "Profil", href: "about" },
        { label: "Projets", href: "projects" },
        { label: "Compétences", href: "skills" },
        { label: "Contact", href: "contact" },
    ];

    /* ── formulaire ── */
    const validate = () => {
        const e = {};
        if (!form.name.trim()) e.name = "Ce champ est requis";
        if (!form.email.trim()) e.email = "Ce champ est requis";
        else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Adresse email invalide";
        if (!form.subject.trim()) e.subject = "Ce champ est requis";
        if (!form.message.trim()) e.message = "Ce champ est requis";
        return e;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setLoading(true);
    try {
        await emailjs.sendForm(
            "service_81304pr",   // ← ton Service ID
            "template_ewh0y8b",  // ← ton Template ID
            formRef.current,
            "xGQLNeh2S-NiCpNmX"  // ← ta Public Key
        );
        setSuccess(true);
        setForm({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
        console.error("Erreur EmailJS :", error);
        alert("Une erreur est survenue. Veuillez réessayer.");
    } finally {
        setLoading(false);
    }
};

    /* ─────────────────────────────────────────────
       RENDU
    ───────────────────────────────────────────── */
    return (
        <>
            {/* ── STYLES GLOBAUX ── */}
            <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />

            {/* ═══════════════════════════════════════
          NAVBAR
      ═══════════════════════════════════════ */}
            <nav className={`nav${scrolled ? " scrolled" : ""}`}>
                <a href="#hero" className="nav-logo">
                    CSV<em>.</em>
                </a>

                <ul className="nav-links">
                    {navItems.map(({ label, href }) => (
                        <li key={href}>
                            <a
                                href={`#${href}`}
                                className={activeSection === href ? "active" : ""}
                            >
                                {label}
                            </a>
                        </li>
                    ))}
                </ul>

                <button
                    className={`hamburger${menuOpen ? " open" : ""}`}
                    onClick={() => setMenuOpen((v) => !v)}
                    aria-label="Menu"
                >
                    <span /><span /><span />
                </button>
            </nav>

            {/* ── MENU MOBILE ── */}
            <div className={`mobile-menu${menuOpen ? " open" : ""}`}>
                {navItems.map(({ label, href }) => (
                    <a
                        key={href}
                        href={`#${href}`}
                        onClick={() => setMenuOpen(false)}
                    >
                        {label}
                    </a>
                ))}
            </div>

            {/* ═══════════════════════════════════════
          HERO
      ═══════════════════════════════════════ */}
            <section id="hero">
                <div className="hero">
                    <div className="hero-inner">
                        <div className="hero-content">
                            <p className="hero-eye">Développeur Web</p>

                            <h1 className="hero-name">
                                Charbel Spéro
                                <b>VODOUNNOU</b>
                            </h1>

                            <p className="hero-job">Front-End Developer</p>

                            <p className="hero-tagline">
                                Développeur Web Front-End passionné, je conçois des interfaces
                                modernes, responsives et performantes, avec une attention
                                particulière portée à l'expérience utilisateur et à la qualité
                                du code.
                            </p>

                            <div className="hero-cta">
                                <a href="#projects" className="btn btn-dark">
                                    Voir mes projets
                                </a>
                                <a href="#contact" className="btn btn-ghost">
                                    Me contacter
                                </a>
                            </div>
                        </div>

                        {/* Décoration typographique */}
                        <div className="hero-deco" aria-hidden="true">
                            <span className="hero-deco-char">CSV</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════
          POURQUOI ME CHOISIR ?
      ═══════════════════════════════════════ */}
            <section id="about" className="section section-alt">
                <div className="section-inner">
                    <div className="section-head">
                        <p className="section-label">Mon profil</p>
                        <h2 className="section-title">
                            Pourquoi me <b>choisir ?</b>
                        </h2>
                        <div className="section-rule" />
                    </div>

                    <div className="about-grid">
                        {/* ── PHOTO ──
                Pour afficher votre photo, remplacez le bloc ci-dessous par :
                <img
                  src="votre-photo.jpg"
                  alt="Charbel Spéro VODOUNNOU"
                  className="about-photo"
                />
            ── */}
                        <div className="about-photo-wrap">
                            <img
                                src="photopro.jpeg"
                                alt="Charbel Spéro VODOUNNOU"
                                className="about-photo"
                            />
                            <div className="about-frame" aria-hidden="true" />
                        </div>

                        <div className="about-text">
                            <p>
                                Passionné par le développement web depuis plus de deux ans, j'ai
                                débuté en <strong>autodidacte</strong> en explorant différents
                                concepts et technologies.
                            </p>
                            <p>
                                Souhaitant aller plus loin, j'ai rejoint en octobre 2025 une
                                formation professionnelle en développement web à{" "}
                                <strong>EIG Bénin</strong>, où je renforce mes compétences et ma
                                rigueur technique.
                            </p>
                            <p>
                                Curieux et en constante progression, je prévois d'élargir mes
                                compétences vers le{" "}
                                <strong>développement mobile</strong> dans un futur proche.
                            </p>
                            <p>
                                Mon objectif est de proposer mes services en{" "}
                                <strong>freelance</strong> et de contribuer à la réalisation de
                                projets web modernes, performants et centrés sur les besoins des
                                utilisateurs.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════
          PROJETS
      ═══════════════════════════════════════ */}
            <section id="projects" className="section">
                <div className="section-inner">
                    <div className="section-head">
                        <p className="section-label">Réalisations</p>
                        <h2 className="section-title">
                            Mes <b>projets</b>
                        </h2>
                        <div className="section-rule" />
                    </div>

                    <p className="projects-note">
                        Je dispose actuellement de projets en cours de développement en
                        local, qui seront prochainement déployés. En attendant, voici
                        quelques projets présentés de manière professionnelle pour illustrer
                        mes compétences.
                    </p>

                    <div className="projects-grid">
                        {PROJECTS.map((project, i) => (
                            <article key={i} className="project-card">
                                <div className="project-badge">
                                    <span className="badge-dot" aria-hidden="true" />
                                    En cours de finalisation
                                </div>

                                <h3 className="project-title">{project.title}</h3>
                                {project.subtitle && (
                                    <p className="project-sub">{project.subtitle}</p>
                                )}

                                <p className="project-desc">{project.description}</p>

                                <div className="project-tags">
                                    {project.tech.map((t) => (
                                        <span key={t} className="tag">{t}</span>
                                    ))}
                                </div>

                                <span className="project-soon">Déploiement à venir</span>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════
          COMPÉTENCES
      ═══════════════════════════════════════ */}
            <section id="skills" className="section section-alt">
                <div className="section-inner">
                    <div className="section-head">
                        <p className="section-label">Expertise</p>
                        <h2 className="section-title">
                            Mes <b>compétences</b>
                        </h2>
                        <div className="section-rule" />
                    </div>

                    {/* Catégories */}
                    <div className="skills-cats">
                        <div>
                            <p className="skill-cat-label">Front-End</p>
                            <div className="skill-tags">
                                {SKILLS_FRONTEND.map((s) => (
                                    <span key={s} className="skill-tag">{s}</span>
                                ))}
                            </div>
                        </div>
                        <div>
                            <p className="skill-cat-label">Backend &amp; BDD</p>
                            <div className="skill-tags">
                                {SKILLS_BACKEND.map((s) => (
                                    <span key={s} className="skill-tag">{s}</span>
                                ))}
                            </div>
                        </div>
                        <div>
                            <p className="skill-cat-label">Outils &amp; Design</p>
                            <div className="skill-tags">
                                {SKILLS_TOOLS.map((s) => (
                                    <span key={s} className="skill-tag">{s}</span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Compétences clés */}
                    <p className="key-title">Compétences clés</p>
                    <ul className="key-grid">
                        {KEY_SKILLS.map((skill) => (
                            <li key={skill} className="key-item">{skill}</li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* ═══════════════════════════════════════
          CONTACT
      ═══════════════════════════════════════ */}
            <section id="contact" className="section">
                <div className="section-inner">
                    <div className="section-head">
                        <p className="section-label">Collaboration</p>
                        <h2 className="section-title">
                            Me <b>contacter</b>
                        </h2>
                        <div className="section-rule" />
                    </div>

                    <div className="contact-grid">
                        {/* ── Infos ── */}
                        <div>
                            <h3 className="contact-heading">Travaillons ensemble</h3>
                            <p className="contact-intro">
                                Disponible pour des missions freelance, des collaborations
                                ou des opportunités professionnelles. N'hésitez pas à me
                                contacter — je réponds sous 24 h.
                            </p>

                            <ul className="contact-list">
                                <li>
                                    <a
                                        href="mailto:charbeljr10@gmail.com"
                                        className="contact-item"
                                    >
                                        <span className="contact-icon"><IconMail /></span>
                                        charbeljr10@gmail.com
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="https://github.com/charbelsrvodounnou"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="contact-item"
                                    >
                                        <span className="contact-icon"><IconGithub /></span>
                                        github.com/charbelsrvodounnou
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="https://www.linkedin.com/in/charbel-vodounnou"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="contact-item"
                                    >
                                        <span className="contact-icon"><IconLinkedin /></span>
                                        linkedin.com/in/charbel-vodounnou
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* ── Formulaire ── */}
                        <form ref={formRef} className="form" onSubmit={handleSubmit} noValidate>
                            {success && (
                                <div className="form-success">
                                    Message envoyé avec succès. Je vous répondrai dans les plus
                                    brefs délais.
                                </div>
                            )}

                            <div className="form-row">
                                <div className="field">
                                    <label className="field-label">Nom</label>
                                    <input
                                        type="text"
                                        name="from_name"
                                        value={form.name}
                                        onChange={handleChange}
                                        placeholder="Votre nom complet"
                                        className={`field-input${errors.name ? " has-error" : ""}`}
                                        autoComplete="name"
                                    />
                                    {errors.name && (
                                        <span className="field-error">{errors.name}</span>
                                    )}
                                </div>

                                <div className="field">
                                    <label className="field-label">Email</label>
                                    <input
                                        type="email"
                                        name="from_email"
                                        value={form.email}
                                        onChange={handleChange}
                                        placeholder="votre@email.com"
                                        className={`field-input${errors.email ? " has-error" : ""}`}
                                        autoComplete="email"
                                    />
                                    {errors.email && (
                                        <span className="field-error">{errors.email}</span>
                                    )}
                                </div>
                            </div>

                            <div className="field">
                                <label className="field-label">Sujet</label>
                                <input
                                    type="text"
                                    name="subject"
                                    value={form.subject}
                                    onChange={handleChange}
                                    placeholder="Objet de votre message"
                                    className={`field-input${errors.subject ? " has-error" : ""}`}
                                />
                                {errors.subject && (
                                    <span className="field-error">{errors.subject}</span>
                                )}
                            </div>

                            <div className="field">
                                <label className="field-label">Message</label>
                                <textarea
                                    name="message"
                                    value={form.message}
                                    onChange={handleChange}
                                    placeholder="Décrivez votre projet ou votre demande..."
                                    rows={6}
                                    className={`field-textarea${errors.message ? " has-error" : ""}`}
                                />
                                {errors.message && (
                                    <span className="field-error">{errors.message}</span>
                                )}
                            </div>

                            <button
                                type="submit"
                                className="btn btn-dark btn-submit"
                                disabled={loading}
                            >
                                {loading ? "Envoi en cours…" : "Envoyer le message"}
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════ */}
            <footer className="footer">
                <div className="footer-inner">
                    <p className="footer-text">
                        © 2025 <em>Charbel Spéro VODOUNNOU</em> — Tous droits réservés.
                    </p>
                    <p className="footer-text">
                        Conçu &amp; développé avec <em>React.js</em>
                    </p>
                </div>
            </footer>
        </>
    );
}
