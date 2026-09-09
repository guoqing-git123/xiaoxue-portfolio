const menuButton = document.querySelector('.menu');
const nav = document.querySelector('nav');
const languageButton = document.querySelector('#language');
const copyButton = document.querySelector('#copy-email');
const toast = document.querySelector('#toast');
const progress = document.querySelector('.scroll-progress span');
const sections = [...document.querySelectorAll('main section[id]')];
const navLinks = [...document.querySelectorAll('nav a')];
const translatable = [...document.querySelectorAll('[data-en]')];

const originalChinese = new Map(
  translatable.map((element) => [element, element.innerHTML])
);

let language = 'zh';
let toastTimer;

const closeMenu = () => {
  nav.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('menu-open');
};

menuButton.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
  document.body.classList.toggle('menu-open', isOpen);
});

navLinks.forEach((link) => link.addEventListener('click', closeMenu));

languageButton.addEventListener('click', () => {
  language = language === 'zh' ? 'en' : 'zh';
  document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
  translatable.forEach((element) => {
    if (language === 'en') {
      element.textContent = element.dataset.en;
    } else {
      element.innerHTML = originalChinese.get(element);
    }
  });
  languageButton.textContent = language === 'zh' ? '中 / EN' : 'EN / 中';
  menuButton.textContent = language === 'zh' ? '菜单' : 'MENU';
  menuButton.setAttribute('aria-label', language === 'zh' ? '打开导航' : 'Open navigation');
  document.title = language === 'zh'
    ? '邝小雪 · 人力资源与招聘'
    : 'Kuang Xiaoxue · Human Resources & Recruitment';
});

const showToast = (message) => {
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add('visible');
  toastTimer = window.setTimeout(() => toast.classList.remove('visible'), 1800);
};

copyButton.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText('3052599811@qq.com');
    showToast(language === 'zh' ? '邮箱地址已复制' : 'Email address copied');
  } catch {
    showToast('3052599811@qq.com');
  }
});

const updateScrollState = () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = scrollable > 0 ? window.scrollY / scrollable : 0;
  progress.style.width = `${Math.min(100, Math.max(0, ratio * 100))}%`;

  let current = sections[0]?.id;
  for (const section of sections) {
    if (window.scrollY >= section.offsetTop - 150) current = section.id;
  }
  navLinks.forEach((link) => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
};

window.addEventListener('scroll', updateScrollState, { passive: true });
window.addEventListener('resize', () => {
  if (window.innerWidth > 900) closeMenu();
  updateScrollState();
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll('.reveal').forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
  observer.observe(element);
});

updateScrollState();
