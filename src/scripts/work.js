/**
 * CREVINOX — Official Client Project Portfolio Controller
 * Six Deployed Projects: Shri Krishna Jewellers, Hardcore Fitness Centre,
 * Kesar & Kahani, Fine Gym, Lumina, Space Essence.
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
    id: 'hardcore-fitness',
    num: '02',
    category: 'fitness',
    categoryLabel: 'Fitness & Gym Centre',
    title: 'HARDCORE FITNESS CENTRE',
    description: 'A powerhouse gym and athletic performance website engineered with intense aesthetics, program showcases, and rapid membership inquiry flows.',
    liveUrl: 'https://hardcore-fitness-centre.vercel.app/',
    image: '/projects/project_hardcore_fitness.jpg',
    alt: 'CREVINOX fitness and gym website project - Hardcore Fitness Centre in Dahisar East Mumbai',
    location: 'Dahisar East, Mumbai, Maharashtra',
    highlights: [
      'High-impact athletic design for Dahisar East premier strength facility',
      'Strength, powerlifting, bodybuilding, and fat-loss program architecture',
      'Intense, dark-luxury aesthetic with progressive overload mindset',
      'Frictionless membership consultation and direct online inquiry pathway'
    ],
    scope: 'Athletic Gym Identity, Program Showcases, High-Impact Web Design',
    status: 'Live Deployed Website'
  },
  {
    id: 'kesar-kahani',
    num: '03',
    category: 'culinary',
    categoryLabel: 'Café & Culinary Experience',
    title: 'KESAR & KAHANI',
    description: 'A premium Indian café experience designed to evoke warmth and legacy through authentic chai, artisanal coffee, and immersive digital storytelling.',
    liveUrl: 'https://kesar-kahani.vercel.app/',
    image: '/projects/project_kesar_kahani.jpg',
    alt: 'CREVINOX premium cafe website project - Kesar & Kahani in Bandra West Mumbai',
    location: 'Bandra West, Mumbai, Maharashtra',
    highlights: [
      'Warm editorial cafe showcase for Bandra West flagship destination',
      'Artisanal Masala Chai, Filter Coffee, Saffron Milk & Indian bites menu',
      'Rich earthy aesthetics with virtual walkthrough and ambience gallery',
      'Frictionless table reservation & inquiry intake pathway'
    ],
    scope: 'Café Brand Identity, Artisanal Menu Presentation, Digital Storytelling',
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
