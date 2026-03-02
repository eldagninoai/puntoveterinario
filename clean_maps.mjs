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

const badTagWrapper = `<a 
  href="https://maps.app.goo.gl/GricGKCzpp6BXJgE7?g_st=aw"
  target="_blank"
  rel="noopener"
  aria-label="Ver ubicación en Google Maps"
  class="maps-link"
>
  <a 
  href="https://maps.app.goo.gl/GricGKCzpp6BXJgE7?g_st=aw"
  target="_blank"
  rel="noopener"
  aria-label="Ver ubicación en Google Maps"
  class="maps-link"
>
  Av. División del Norte 3595, San Pablo Tepetlapa, 
  CP 04620, Coyoacán, CDMX
</a>
</a>`;

const goodTagWrapper = `<a 
  href="https://maps.app.goo.gl/GricGKCzpp6BXJgE7?g_st=aw"
  target="_blank"
  rel="noopener"
  aria-label="Ver ubicación en Google Maps"
  class="maps-link"
>
  Av. División del Norte 3595, San Pablo Tepetlapa, 
  CP 04620, Coyoacán, CDMX
</a>`;

walkPath(dir, (filePath) => {
    if (filePath.endsWith('.astro')) {
        let content = fs.readFileSync(filePath, 'utf8');
        let original = content;

        content = content.split(badTagWrapper).join(goodTagWrapper);

        if (content !== original) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log('Fixed double nesting in: ' + filePath);
        }
    }
});
