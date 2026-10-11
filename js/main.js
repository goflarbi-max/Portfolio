// PROJECT DATA: edit this array to add or update portfolio case studies.
const projects = [
  {
    title: 'AutoBusiness',
    summary: 'Live dealership analytics dashboard tracking GHS 1.09B+ in revenue, margin and 3,906 unit sales on a custom domain.',
    tags: ['Python', 'Cloudflare Workers', 'Analytics'],
    metrics: ['GHS 1.09B+ revenue', '3,906 units', 'Zero loading flash'],
    link: 'https://automobile.goflarbi.com',
    challenge: 'Deliver GHS-denominated reporting on a custom domain without the default Streamlit border, footer or loading flash.',
    action: 'Built the Python data pipeline, proxied the application through Cloudflare Workers and embedded a purpose-built dark interface.',
    result: 'Delivered an edge-to-edge, zero-flash dashboard with live filters that works across desktop and mobile devices.'
  },
  {
    title: 'Dealership IT Infrastructure Management',
    summary: 'Coordinated day-to-day IT operations across three automotive dealerships under one group.',
    tags: ['Networks', 'Diagnostics', 'Security'],
    metrics: ['3 dealership brands', '120+ users', '19 diagnostic devices'],
    challenge: 'Three dealerships relied on different brand platforms, diagnostic tools and access requirements while sharing a need for dependable support.',
    action: 'Supported users and networks, administered accounts and permissions, maintained specialist diagnostic connections, and coordinated updates without exposing confidential systems.',
    result: 'Sustained access to essential dealership and workshop technology across Volkswagen, Nissan and Porsche operations.'
  },
  {
    title: 'Security Awareness Training',
    summary: 'Helped staff recognise social-engineering threats and respond more safely to suspicious messages.',
    tags: ['Security', 'Training', 'User support'],
    metrics: ['70+ staff', '10 sessions'],
    challenge: 'Staff needed practical guidance to identify scams and social-engineering techniques in everyday communication.',
    action: 'Delivered clear, scenario-based guidance on warning signs, safe verification and escalation practices.',
    result: 'Trained 70+ staff across 10 sessions, giving teams practical steps for recognising and escalating suspicious activity.'
  },
  {
    title: 'Personal Portfolio & Web Deployment',
    summary: 'Designed and deployed a responsive professional portfolio with accessible themes, custom-domain support and a working contact workflow.',
    tags: ['Figma', 'HTML', 'CSS', 'JavaScript', 'Vercel', 'GitHub Pages'],
    metrics: ['Responsive frontend', 'Two hosting platforms', 'Custom domain ready'],
    link: 'https://godfred-larbi-portfolio.vercel.app',
    challenge: 'Present a broad technical background clearly while delivering a fast, accessible website without a framework or build process.',
    action: 'Planned the interface in Figma, developed the responsive frontend with HTML, CSS and JavaScript, connected Formspree, and configured deployments through GitHub Pages and Vercel.',
    result: 'Delivered a mobile-ready portfolio with light and dark modes, accessible interactions, downloadable CV and independently hosted deployment paths.'
  }
];

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

const header = $('#site-header');
const menuButton = $('.menu-toggle');
const navPanel = $('#nav-links');
const themeButton = $('.theme-toggle');

const setThemeLabel = () => {
  const dark = document.documentElement.dataset.theme === 'dark';
  themeButton.setAttribute('aria-label', `Switch to ${dark ? 'light' : 'dark'} mode`);
};
setThemeLabel();
themeButton.addEventListener('click', () => {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  try { localStorage.setItem('theme', next); } catch (error) { /* Preference remains active for this visit. */ }
  setThemeLabel();
});

menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  navPanel.classList.toggle('open', !open);
  $('.sr-only', menuButton).textContent = open ? 'Open menu' : 'Close menu';
});
$$('.nav-panel a').forEach(link => link.addEventListener('click', () => {
  menuButton.setAttribute('aria-expanded', 'false'); navPanel.classList.remove('open');
}));

const start = new Date(2018, 5, 1);
const now = new Date();
let years = now.getFullYear() - start.getFullYear();
if (now < new Date(now.getFullYear(), start.getMonth(), start.getDate())) years -= 1;
$('#experience-years').textContent = `${Math.max(0, years)}+ years`;
$('#current-year').textContent = now.getFullYear();

const photo = $('#profile-photo');
photo.addEventListener('error', () => { photo.hidden = true; });

window.addEventListener('scroll', () => header.classList.toggle('scrolled', scrollY > 10), { passive: true });

const sections = $$('main section[id]');
const navLinks = $$('.nav-panel a[href^="#"]');
const sectionObserver = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
    if (link.classList.contains('active')) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current');
  });
}), { rootMargin: '-30% 0px -60% 0px' });
sections.forEach(section => sectionObserver.observe(section));

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
if (reducedMotion) $$('.reveal').forEach(el => el.classList.add('visible'));
else {
  const revealObserver = new IntersectionObserver((entries, observer) => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
  }), { threshold: .12 });
  $$('.reveal').forEach(el => revealObserver.observe(el));
}

$$('.expander').forEach(button => button.addEventListener('click', () => {
  const target = document.getElementById(button.getAttribute('aria-controls'));
  const open = button.getAttribute('aria-expanded') === 'true';
  button.setAttribute('aria-expanded', String(!open));
  button.firstChild.textContent = open ? 'Show more ' : 'Show less ';
  target.classList.toggle('open', !open);
}));

const projectGrid = $('#project-grid');
const modal = $('#project-modal');
const modalContent = $('#modal-content');
const safeUrl = value => value && !value.startsWith('[') ? value : '';
projectGrid.innerHTML = projects.map((project, index) => `
  <article class="card project-card reveal visible">
    <span class="project-number">CASE ${String(index + 1).padStart(2, '0')}</span>
    <h3>${project.title}</h3><p>${project.summary}</p>
    <div class="project-metrics">${(project.metrics || []).map(metric => `<strong>${metric}</strong>`).join('')}</div>
    <div class="tags">${project.tags.map(tag => `<span>${tag}</span>`).join('')}</div>
    <div class="project-actions"><button class="text-button case-open" type="button" data-project="${index}">Read case study →</button>${safeUrl(project.link) ? `<a href="${project.link}" target="_blank" rel="noopener noreferrer">Visit project <span class="sr-only">(opens in a new tab)</span></a>` : ''}</div>
  </article>`).join('');

let modalTrigger;
projectGrid.addEventListener('click', event => {
  const trigger = event.target.closest('.case-open');
  if (!trigger) return;
  modalTrigger = trigger;
  const project = projects[Number(trigger.dataset.project)];
  modalContent.innerHTML = `<p class="section-kicker">Case study</p><h2 id="modal-title">${project.title}</h2><p class="lead">${project.summary}</p>${['challenge','action','result'].map(key => `<div class="case-block"><h3>${key}</h3><p>${project[key]}</p></div>`).join('')}`;
  modal.showModal(); document.body.classList.add('modal-open');
});
const closeModal = () => { modal.close(); document.body.classList.remove('modal-open'); modalTrigger?.focus(); };
$('.modal-close').addEventListener('click', closeModal);
modal.addEventListener('click', event => { if (event.target === modal) closeModal(); });
modal.addEventListener('cancel', event => { event.preventDefault(); closeModal(); });

const form = $('#contact-form');
const fields = [
  { el: $('#name'), message: 'Please enter your name.' },
  { el: $('#email'), message: 'Please enter a valid email address.' },
  { el: $('#message'), message: 'Please enter a message of at least 20 characters.' }
];
const validate = field => {
  const valid = field.el.checkValidity();
  field.el.setAttribute('aria-invalid', String(!valid));
  $(`#${field.el.id}-error`).textContent = valid ? '' : field.message;
  return valid;
};
fields.forEach(field => field.el.addEventListener('blur', () => validate(field)));
form.addEventListener('submit', event => {
  const valid = fields.map(validate).every(Boolean);
  if (!valid) { event.preventDefault(); $('.form-status').textContent = 'Please correct the highlighted fields.'; fields.find(field => !field.el.checkValidity()).el.focus(); return; }
  const endpoint = form.getAttribute('action');
  if (!endpoint || endpoint.startsWith('mailto:')) {
    event.preventDefault();
    const subject = encodeURIComponent(`Portfolio enquiry from ${$('#name').value}`);
    const body = encodeURIComponent(`${$('#message').value}\n\nFrom: ${$('#name').value} <${$('#email').value}>`);
    $('.form-status').textContent = 'Opening your email application…';
    window.location.href = `mailto:goflarbi@gmail.com?subject=${subject}&body=${body}`;
  }
});
