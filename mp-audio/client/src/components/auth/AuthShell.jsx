import { motion } from 'framer-motion';
import { Disc3, Headphones, Radio, Sparkles } from 'lucide-react';

const statCards = [
  { label: 'Layout', value: 'Responsive-first' },
  { label: 'Focus', value: 'Zero clutter' },
  { label: 'Flow', value: 'Fast access' },
];

const highlights = [
  {
    icon: Headphones,
    title: 'Immersive sessions',
    description: 'Clear spacing and calm contrast keep attention on your library instead of the chrome.',
  },
  {
    icon: Radio,
    title: 'Discover faster',
    description: 'A stronger structure makes search, playlists, and playback feel easier to navigate.',
  },
  {
    icon: Sparkles,
    title: 'Premium feel',
    description: 'Soft depth, motion, and lighting give the interface a polished studio-inspired finish.',
  },
];

const listVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0 },
};

const AuthShell = ({
  eyebrow,
  title,
  description,
  heroTitle,
  heroDescription,
  children,
  footer,
}) => {
  return (
    <div className="auth-shell">
      <div className="auth-shell__orb auth-shell__orb--primary" />
      <div className="auth-shell__orb auth-shell__orb--secondary" />
      <div className="auth-shell__grid">
        <motion.section
          className="auth-hero"
          initial={{ opacity: 0, x: -28 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
        >
          <div className="auth-lockup">
            <div className="auth-lockup__mark">
              <Disc3 className="h-6 w-6" />
            </div>
            <div>
              <p className="auth-lockup__eyebrow">Music Platform</p>
              <h1 className="auth-lockup__title">MP AUDIO</h1>
            </div>
          </div>

          <span className="auth-kicker">{eyebrow}</span>
          <div className="auth-hero__copy">
            <h2 className="auth-hero__title">{heroTitle}</h2>
            <p className="auth-hero__description">{heroDescription}</p>
          </div>

          <motion.div
            className="auth-stat-grid"
            variants={listVariants}
            initial="hidden"
            animate="show"
          >
            {statCards.map((card) => (
              <motion.div key={card.label} className="auth-stat-card" variants={itemVariants}>
                <span className="auth-stat-card__label">{card.label}</span>
                <strong className="auth-stat-card__value">{card.value}</strong>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="auth-highlight-list"
            variants={listVariants}
            initial="hidden"
            animate="show"
          >
            {highlights.map((highlight) => (
              <motion.article
                key={highlight.title}
                className="auth-highlight"
                variants={itemVariants}
              >
                <div className="auth-highlight__icon">
                  <highlight.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="auth-highlight__title">{highlight.title}</h3>
                  <p className="auth-highlight__text">{highlight.description}</p>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </motion.section>

        <motion.section
          className="auth-panel"
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        >
          <div className="auth-panel__brand">
            <div className="auth-panel__brand-mark">
              <Disc3 className="h-5 w-5" />
            </div>
            <div>
              <p className="auth-panel__brand-label">Studio Mode</p>
              <p className="auth-panel__brand-name">MP AUDIO</p>
            </div>
          </div>

          <p className="auth-panel__eyebrow">{eyebrow}</p>
          <h2 className="auth-panel__title">{title}</h2>
          <p className="auth-panel__description">{description}</p>

          {children}

          {footer ? <div className="auth-panel__footer">{footer}</div> : null}
        </motion.section>
      </div>
    </div>
  );
};

export default AuthShell;
