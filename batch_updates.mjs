import fs from 'fs';
import path from 'path';

function walkPath(dir, callback) {
    if (!fs.existsSync(dir)) return;
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkPath(dirPath, callback) : callback(dirPath);
    });
}

const dir = 'e:/adlibswebsites/puntoveterinario/src';

walkPath(dir, (filePath) => {
    if (filePath.endsWith('.astro')) {
        let content = fs.readFileSync(filePath, 'utf8');
        let originalContent = content;

        // 1. Eliminar Urgencias
        // Header
        if (filePath.endsWith('Header.astro')) {
            content = content.replace(/\s*<li>\s*<a href="\/urgencias" class="nav-link nav-urgencias">🚨 Urgencias<\/a>\s*<\/li>/g, '');
            content = content.replace(/\s*\.nav-urgencias\s*{[^}]+}/g, '');

            // Cambio 5: Header mejorado
            if (!content.includes('const currentPath = Astro.url.pathname;')) {
                content = content.replace(/---/, '---\nconst currentPath = Astro.url.pathname;');
            }
            content = content.replace(/<a href={link\.href} class="nav-link">/g, '<a href={link.href} class={`nav-link ${currentPath === link.href ? \'nav-link--active\' : \'\'}`}>');

            if (!content.includes('.nav-link--active')) {
                content = content.replace(/\.nav-link:hover \s*{[^}]+}/g, `$&
  .nav-link--active {
    background: var(--color-primary-light);
    color: var(--color-primary-dark);
    font-weight: 600;
  }`);
            }

            content = content.replace(/\.nav-link \s*{/, `.nav-link {
    display: block;
    width: 100%;`);

            content = content.replace(/padding: var\(--space-xs\) var\(--space-sm\);/g, 'padding: var(--space-xs) var(--space-sm);'); // It already has this exact padding

            content = content.replace(/toggle\?.addEventListener\("click", \(\) => {[^}]+}\);/g, `$&
    document.addEventListener('click', (e) => {
      if (!nav || !toggle) return;
      if (!nav.contains(e.target) && !toggle.contains(e.target)) {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });`);
        }

        // Footer
        if (filePath.endsWith('Footer.astro')) {
            content = content.replace(/\s*{\s*href:\s*"\/urgencias",\s*label:\s*"🚨 Urgencias"\s*},/g, '');
        }

        if (filePath.endsWith('BaseLayout.astro')) {
            if (!content.includes('astro:page-load')) {
                content = content.replace(/<\/body>/, `  <script is:inline>
      // Scroll al tope en cada navegación
      document.addEventListener('astro:page-load', () => {
        window.scrollTo({ top: 0, behavior: 'instant' });
      });
      // Para navegación normal sin View Transitions
      window.scrollTo({ top: 0, behavior: 'instant' });
    </script>\n  </body>`);
            }
        }

        // 2. Maps Link (Global)
        const mapTag = `<a 
  href="https://maps.app.goo.gl/GricGKCzpp6BXJgE7?g_st=aw"
  target="_blank"
  rel="noopener"
  aria-label="Ver ubicación en Google Maps"
  class="maps-link"
>
  Av. División del Norte 3595, San Pablo Tepetlapa, 
  CP 04620, Coyoacán, CDMX
</a>`;

        // Replace standalone occurrences (this requires careful exact matching where possible)
        // There are many variations in the text.
        // Index:
        content = content.replace(/Av\. División del Norte 3595, San Pablo Tepetlapa,<br \/>\s*CP 04620, Coyoacán, CDMX\./g, mapTag);
        // Ubicacion:
        content = content.replace(/Av\. División del Norte 3595<br \/>\s*San Pablo Tepetlapa<br \/>\s*CP 04620, Coyoacán, CDMX/g, mapTag);

        // Services / Contact footer usually matches this:
        content = content.replace(/Av\. División del Norte 3595,\s*San Pablo Tepetlapa,\s*CP 04620, Coyoacán, CDMX/g, mapTag);
        content = content.replace(/Av\. División del Norte 3595, San Pablo Tepetlapa, CP 04620/g, mapTag);

        // Add map link CSS if maps-link was added
        if (content.includes('maps-link') && !content.includes('.maps-link {') && content.includes('</style>')) {
            content = content.replace(/<\/style>/, `
  .maps-link {
    color: inherit;
    text-decoration: underline;
    text-decoration-color: var(--color-primary);
    text-underline-offset: 0.2rem;
    transition: color 0.2s;
  }
  .maps-link:hover {
    color: var(--color-primary);
  }
</style>`);
        }

        if (content !== originalContent) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log('Updated: ' + filePath);
        }
    }
});
