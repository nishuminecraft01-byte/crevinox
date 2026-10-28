/**
 * CREVINOX — Official Client Project Portfolio Controller
 * Six Deployed Projects: Shri Krishna Jewellers, House of Blush by Sargam,
 * AV Fitness Centre, Fine Gym, Lumina, Space Essence.
 */

export const OFFICIAL_PROJECTS = [
  {
    id: 'shri-krishna-jewellers',
    num: '01',
    category: 'jewellery',
    categoryLabel: 'Jewellery & Retail',
    title: 'SHRI KRISHNA JEWELLERS',
    description: 'A dedicated digital experience for a jewellery business, designed to establish its online presence and showcase its brand.',
    liveUrl: 'https://shrikrishna-jewellers.vercel.app/',
    image: '/projects/project_shrikrishna_jewellers.jpg',
    alt: 'CREVINOX jewellery website project preview - Shri Krishna Jewellers in Bhokardan',
    location: 'Sarafa Market, Bhokardan, Maharashtra',
    highlights: [
      'Gold, diamond, and bridal collection digital showcase',
      'Sophisticated dark background with warm metallic accents',
      'Artisanal jewellery craftsmanship brand narrative',
      'Ultra-responsive mobile luxury browsing layout'
    ],
    scope: 'Jewellery Brand Experience, Catalog Showcase, Mobile Optimization',
    status: 'Live Deployed Experience'
  },
  {
    id: 'house-of-blush',
    num: '02',
    category: 'beauty',
    categoryLabel: 'Beauty & Makeup Artist',
    title: 'HOUSE OF BLUSH BY SARGAM',
    description: 'A beauty-focused website concept created to present makeup artistry through an elegant and polished digital experience.',
    liveUrl: 'https://sargam-dx62f8dne-crevinox.vercel.app/',
    image: '/projects/project_houseofblush_sargam.jpg',
    alt: 'CREVINOX beauty and makeup artist website project - House of Blush by Sargam',
    location: 'Luxury Editorial Makeup Studio',
    highlights: [
      'High-fashion bridal glam & editorial showcase',
      'Refined editorial typography with warm terracotta & rose-gold tones',
      'Curated bridal transformation lookbook gallery',
      'Frictionless client consultation inquiry pathway'
    ],
    scope: 'Luxury Beauty Identity, Bridal Portfolio, Editorial Web Design',
    status: 'Live Website Concept'
  },
  {
    id: 'av-fitness-centre',
    num: '03',
    category: 'fitness',
    categoryLabel: 'Fitness & Gym',
    title: 'AV FITNESS CENTRE',
    description: "A fitness website designed to present the gym's digital presence, services, and brand identity.",
    liveUrl: 'https://av-fitness-centre.vercel.app/',
    image: '/projects/project_av_fitness.jpg',
    alt: 'CREVINOX fitness centre website project - AV Fitness Centre in Kandivali East Mumbai',
    location: 'Kandivali East, Mumbai, Maharashtra',
    highlights: [
      'Modern digital presence for Kandivali East athletic facility',
      'Strength, conditioning, and goal-oriented training programs',
      'High-contrast sporty aesthetics with energetic interactions',
      'Instant membership consultation and location contact'
    ],
    scope: 'Fitness Web Presence, Training Programs, Brand Identity',
    status: 'Live Deployed Website'
  },
  {
    id: 'fine-gym',
    num: '04',
    category: 'fitness',
    categoryLabel: 'Fitness & Gym',
    title: 'FINE GYM',
    description: 'A gym website experience designed to give a fitness brand a professional online presence.',
    liveUrl: 'https://finegym.vercel.app/',
    image: '/projects/project_fine_gym.jpg',
    alt: 'CREVINOX gym website project preview - Fine Gym in Dahisar West Mumbai',
    location: 'Dahisar West, Mumbai, Maharashtra',
    highlights: [
      'Dahisar West fitness facility digital flagship (Rated 4.9/5)',
      'Strength training, calisthenics, Zumba, and weight management',
      'Dark, sophisticated presentation with strong typographic hierarchy',
      'Interactive facility gallery and program schedule'
    ],
    scope: 'Fitness Brand Platform, Program Showcase, Responsive UI',
    status: 'Live Deployed Website'
  },
  {
    id: 'lumina',
    num: '05',
    category: 'culinary',
    categoryLabel: 'Fine Dining & Culinary Experience',
    title: 'LUMINA',
    description: "A visually focused digital project showcasing CREVINOX's approach to website design and presentation.",
    liveUrl: 'https://lumina-five-sepia.vercel.app/',
    image: '/projects/project_lumina_dining.jpg',
    alt: 'CREVINOX fine dining and culinary website project - Lumina Fine Dining',
    location: 'Modern Indian Culinary Destination',
    highlights: [
      'Modern fine dining culinary presentation & sensory pacing',
      'Signature gastronomy showcases (Truffle Paneer Tikka, Butter Chicken)',
      'Balanced spatial composition with luxury serif typography',
      'Smooth visual transitions and culinary storytelling'
    ],
    scope: 'Culinary Digital Experience, Signature Menu UI, Sensory Aesthetics',
    status: 'Live Deployed Experience'
  },
  {
    id: 'space-essence',
    num: '06',
    category: 'architecture',
    categoryLabel: 'Architecture & Interior Design Studio',
    title: 'SPACE ESSENCE',
    description: "A digital design project that demonstrates CREVINOX's ability to create distinctive online experiences.",
    liveUrl: 'https://space-essence.vercel.app/',
    image: '/projects/project_space_essence.jpg',
    alt: 'CREVINOX architecture and interior design website project - Space Essence Design Studio',
    location: 'Akola, Maharashtra',
    highlights: [
      'Architecture & interior design studio flagship in Akola',
      'Residential, commercial architecture, 3D visualization & VR',
      'Clean editorial layout with spatial proportions and typography',
      'Turnkey construction & comprehensive design portfolio'
    ],
    scope: 'Architecture Portfolio, 3D/VR Service Presentation, Editorial Layout',
    status: 'Live Deployed Website'
  }
];

export function initWorkPortfolio() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  // Category Filter Handler
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      filterButtons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      projectCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (filter === 'all' || cardCategory === filter) {
          card.style.display = 'grid';
          requestAnimationFrame(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          });
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(12px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 240);
        }
      });
    });
  });

  // Make whole browser frame or media wrapper clickable to open project directly in new tab
  document.querySelectorAll('.project-browser-frame, .project-media-wrapper').forEach(media => {
    media.addEventListener('click', (e) => {
      // Avoid double trigger if target is an inner link/button
      if (e.target.closest('a')) return;
      const liveUrl = media.getAttribute('data-live-url') || media.querySelector('[data-live-url]')?.getAttribute('data-live-url');
      if (liveUrl) {
        window.open(liveUrl, '_blank', 'noopener,noreferrer');
      }
    });

    media.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const liveUrl = media.getAttribute('data-live-url') || media.querySelector('[data-live-url]')?.getAttribute('data-live-url');
        if (liveUrl) {
          window.open(liveUrl, '_blank', 'noopener,noreferrer');
        }
      }
    });
  });
}
