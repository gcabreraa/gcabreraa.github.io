// js/project-modal.js

// Project data structure - update with your actual project details
const projectData = {
  'mitos': {
    title: 'MITOS ? Campus Heat Monitor',
    year: '2025',
    tagline: 'Low-power environmental sensing unit for mapping urban heat across MIT\'s campus.',
    description: `
      <p>Built around an ESP32-C3 with custom PCBs for power management, sensing peripherals (SHT4x + VEML7700), and field deployment. The node performs multi-stage buffering (RTC -> flash) to survive outages, and schedules LoRa/Wi-Fi upload windows to minimize energy usage. An e-ink display provides an accessible community interface, showing local temperature, battery status, and a QR code that links to live telemetry via a custom backend dashboard.</p>
      <p><strong>Role:</strong> Firmware and communications implementation.</p>
    `,
    techStack: ['ESP32-C3', 'LoRa', 'KiCad', 'C++'],
    features: [
      'Custom ESP32-C3 sensing and power PCBs (SHT4x + VEML7700)',
      'RTC -> flash buffering for outage resilience',
      'Scheduled LoRa/Wi-Fi uplinks to conserve energy',
      'E-ink community display with QR link to live telemetry'
    ],
    links: {
      repo: 'https://github.com/gcabreraa/mitosis-project-2025',
      slides: 'https://docs.google.com/presentation/d/18ddx2oT0A9gGHlHaXcvTStzuUjTPh3UD1AqeYcPpL7Q/edit?usp=drive_link'
    },
    image: 'images/mitos-preview.png'
  },
  'astra': {
    title: 'ASTRA ? Networking Architecture',
    year: '2025',
    tagline: 'Designed a fault-tolerant extension of NASA\'s SolarNet spec for Earth-Moon-Mars communication.',
    description: `
      <p>The system integrates persistent bundle storage, adaptive routing, and selective retransmission to handle long delays and intermittent connectivity in space.</p>
      <p><strong>Role:</strong> Co-designed node-level communication logic and distributed storage layout; evaluated link constraints across use cases, authored reliability + performance trade-offs in the final design.</p>
    `,
    techStack: ['Distributed Systems', 'Networking', 'ZFS'],
    features: [
      'Persistent bundle storage for delay-tolerant delivery',
      'Adaptive routing and selective retransmission',
      'Link-constraint evaluation across mission profiles',
      'Reliability/performance trade-off analysis'
    ],
    links: {
      report: 'https://docs.google.com/document/d/1cOCUEaAVGkqs2jXp9CCTP37xcXpISTWYaUpNlvsYYDI/edit?usp=sharing',
      specs: 'https://web.mit.edu/6.1800/www/assignments/dp.pdf'
    },
    image: 'images/astra-preview.png'
  },
  'grid-thym': {
    title: 'Grid-thym ? FPGA Music Game',
    year: '2024',
    tagline: 'Piano Tiles-style rhythm game implemented entirely on an FPGA.',
    description: `
      <p>An SD-card reader streams MIDI/WAV data into audio-processing pipelines, which map notes to frequencies and drive both audio synthesis and a 10x10 visual grid. The display module renders falling tiles over HDMI using BRAM-backed line buffers, while the game logic checks keyboard hits against the bottom row in real time.</p>
      <p><strong>Role:</strong> Designed the node architecture and SystemVerilog modules for storage layout, SD-card I/O, and tile rendering with emphasis on timing, buffering, and clean interfaces.</p>
    `,
    techStack: ['FPGA', 'SystemVerilog', 'HDMI'],
    features: [
      'SD-card MIDI/WAV streaming into audio pipelines',
      'HDMI tile renderer with BRAM-backed line buffers',
      'Real-time hit detection on a 10x10 grid',
      'Timing-accurate audio synthesis and buffering'
    ],
    links: {
      repo: 'https://github.mit.edu/rbchavez/Gridthym'
    },
    image: 'assets/projects/grid-thym-thumb.jpg'
  },
  'piano-tiles': {
    title: 'Piano Tiles ? PSoC Edition',
    year: '2024',
    tagline: 'Piano Tiles on a PSoC 5LP with a 240x320 TFT, wavetable audio, and SPI-rendered tiles.',
    description: `
      <p>Interrupt-driven buttons and an on-chip VDAC synthesizer run inside a SysTick ISR while emWin graphics render falling tiles via SPI.</p>
      <p><strong>Repo:</strong> Coming soon.</p>
    `,
    techStack: ['PSoC 5LP', 'TFT', 'DAC', 'Embedded C'],
    features: [
      'SysTick ISR for input + VDAC audio synthesis',
      'emWin graphics pipeline over SPI',
      '240x320 TFT tile rendering',
      'Low-latency input handling'
    ],
    links: {},
    image: 'assets/projects/piano-tiles-thumb.jpg'
  },
  'star-battle': {
    title: 'Star Battle ? Network Puzzle',
    year: '2023',
    tagline: 'Network-based logic puzzle with a custom GUI for interactive gameplay.',
    description: `
      <p>Designed abstract data types to represent puzzle rules, board state, and player actions so validation stayed fast and synchronized across clients.</p>
      <p><strong>Repo:</strong> Coming soon. <strong>Demo:</strong> Coming soon.</p>
    `,
    techStack: ['Python', 'Networking', 'ADTs'],
    features: [
      'Custom GUI for interactive puzzle play',
      'ADTs for rules, board state, and actions',
      'Fast validation synchronized across clients'
    ],
    links: {},
    image: 'assets/projects/star-battle-thumb.jpg'
  },
  'smart-dnd': {
    title: 'Smart Dungeons & Dragons ? ESP32 Game',
    year: '2022',
    tagline: 'Interactive D&D-style experience built on ESP32 devices with real-time combat actions.',
    description: `
      <p>The device handles dice rolls, attacks, and shielding while a SQL-backed coordinator syncs player states, server messages, and team interactions with an LED map of the game.</p>
      <p><strong>Repo:</strong> Coming soon.</p>
    `,
    techStack: ['ESP32', 'C', 'SQL'],
    features: [
      'Real-time combat actions on device',
      'SQL-backed coordinator for player state sync',
      'LED map for team interactions and status'
    ],
    links: {},
    image: 'assets/projects/smart-dnd-thumb.jpg'
  }
};

// Create modal HTML structure
function createModalHTML() {
  const modalHTML = `
    <div class="project-modal-overlay" id="project-modal-overlay">
      <div class="project-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div class="project-modal__titlebar">
          <span class="project-modal__title" id="modal-title">Project Details</span>
          <button class="project-modal__close" aria-label="Close" id="modal-close">×</button>
        </div>
        <div class="project-modal__content" id="modal-content">
          <!-- Content will be injected here -->
        </div>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', modalHTML);
  
  // Add event listeners
  const overlay = document.getElementById('project-modal-overlay');
  const closeBtn = document.getElementById('modal-close');
  
  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });
  
  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) {
      closeModal();
    }
  });
}

// Open modal with project data
function openProjectModal(projectKey) {
  if (!document.getElementById('project-modal-overlay')) {
    createModalHTML();
  }
  const project = projectData[projectKey];
  if (!project) {
    console.error(`❌ Project not found: ${projectKey}`);
    return;
  }
  
  console.log(`✅ Opening modal for: ${projectKey}`);
  
  const overlay = document.getElementById('project-modal-overlay');
  const content = document.getElementById('modal-content');
  const title = document.getElementById('modal-title');
  
  title.textContent = project.title;

  const trigger = document.querySelector(`[data-project-id="${projectKey}"]`);
  const panel = trigger ? trigger.closest('.project-panel') : null;
  const modal = overlay ? overlay.querySelector('.project-modal') : null;
  if (panel && modal) {
    const panelStyles = getComputedStyle(panel);
    const panelBg = panelStyles.getPropertyValue('--panel-bg').trim();
    const panelBar = panelStyles.getPropertyValue('--panel-bar').trim();
    if (panelBg) {
      modal.style.setProperty('--modal-bg', panelBg);
    }
    if (panelBar) {
      modal.style.setProperty('--modal-bar', panelBar);
    }
  }
  
  // Build embeds for slides and videos
  let embedsHTML = '';
  
  if (project.links.slides) {
    embedsHTML += `
      <div class="modal-embed">
        <h3>Slides</h3>
        <iframe src="${project.links.slides}" allowfullscreen></iframe>
      </div>
    `;
  }
  
  if (project.links.demo || project.links.video) {
    const videoUrl = project.links.demo || project.links.video;
    // Convert YouTube watch URLs to embed URLs
    const embedUrl = videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')
      ? videoUrl.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')
      : videoUrl;
    
    embedsHTML += `
      <div class="modal-embed">
        <h3> Demo Video</h3>
        <iframe src="${embedUrl}" allowfullscreen></iframe>
      </div>
    `;
  }
  
  // Build other links (repo, report, etc.) as big buttons
  const otherLinks = Object.entries(project.links)
    .filter(([key]) => !['slides', 'demo', 'video'].includes(key))
    .map(([key, url]) => {
      const icons = {
        repo: '💻',
        report: '📄',
        paper: '📄',
        specs: '📋',
        docs: '📖',
        website: '🌐'
      };
      const icon = icons[key.toLowerCase()] || '🔗';
      return `
        <a href="${url}" class="modal-link-btn" target="_blank" rel="noopener noreferrer">
          ${icon} ${key.charAt(0).toUpperCase() + key.slice(1)}
        </a>
      `;
    }).join('');
  
  const featuresHTML = project.features
    .map(f => `<li>${f}</li>`)
    .join('');
  
  const techHTML = project.techStack
    .map(tech => `<span class="pill">${tech}</span>`)
    .join('');
  
  content.innerHTML = `
    <div class="modal-project-header">
      <div class="modal-project-image">
        <img src="${project.image}" alt="${project.title}" onerror="this.style.display='none'">
      </div>
      <div class="modal-project-info">
        <h2>${project.title}</h2>
        <div class="modal-project-meta">
          <span class="modal-meta-badge">📅 ${project.year}</span>
          <span class="modal-meta-badge">💡 ${project.tagline}</span>
        </div>
        ${otherLinks ? `<div class="modal-links modal-links--inline">${otherLinks}</div>` : ''}
        <p class="modal-scroll-hint">Scroll down for slides and demo videos.</p>
      </div>
    </div>
    
    <div class="modal-section">
      <h3>About</h3>
      ${project.description}
    </div>
    
    <div class="modal-section">
      <h3>Key Features</h3>
      <ul class="about-list">
        ${featuresHTML}
      </ul>
    </div>
    
    <div class="modal-section">
      <h3>Tech Stack</h3>
      <div class="modal-tech-stack">
        ${techHTML}
      </div>
    </div>
    
    ${embedsHTML}
  `;
  
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

// Close modal
function closeModal() {
  const overlay = document.getElementById('project-modal-overlay');
  overlay.classList.remove('active');
  document.body.style.overflow = '';
}

// Initialize modal system
function initProjectModals() {
  console.log('🔧 Initializing project modals...');
  
  // Create modal on first load
  if (!document.getElementById('project-modal-overlay')) {
    console.log('✅ Creating modal HTML');
    createModalHTML();
  } else {
    console.log('ℹ️ Modal already exists');
  }
}

// Delegated handler so dynamically injected cards always work
document.addEventListener('click', (e) => {
  const trigger = e.target.closest('[data-project-id]');
  if (!trigger) return;
  e.preventDefault();
  e.stopPropagation();
  const projectId = trigger.getAttribute('data-project-id');
  console.log(`🎯 Clicked project: ${projectId}`);
  openProjectModal(projectId);
});

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initProjectModals);
} else {
  initProjectModals();
}

// Export for use in router
window.initProjectModals = initProjectModals;
