import fs from 'fs';

const filePath = 'e:/adlibswebsites/puntoveterinario/src/pages/ubicacion.astro';
let content = fs.readFileSync(filePath, 'utf8');

// Fix the unclosed p and li and ul, and div tags before the section
content = content.replace(/10:00-17:00\s+<!-- 3\. CÓMO LLEGAR -->/s, '10:00-17:00\n                                </p>\n                            </div>\n                        </li>\n                    </ul>\n                </div>\n\n                <!-- Derecha: Mapa (Nuevo Iframe) -->\n                <div class="mapa-container">\n                  <iframe\n                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3764.5!2d-99.13922!3d19.322004!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85ce010007f0a32f%3A0x9c168bcfa6aad89f!2sPunto%20Veterinario!5e0!3m2!1ses!2smx!4v1"\n                    width="100%"\n                    height="100%"\n                    style="border:0;"\n                    allowfullscreen=""\n                    loading="lazy"\n                    referrerpolicy="no-referrer-when-downgrade"\n                    title="Ubicación Punto Veterinario en Google Maps"\n                  ></iframe>\n                </div>\n            </div>\n        </div>\n    </section>\n\n    <!-- 3. CÓMO LLEGAR -->');

// Fix nested a tags
content = content.replace(/<a\s+href="https:\/\/maps\.app\.goo\.gl\/GricGKCzpp6BXJgE7\?g_st=aw"\s+target="_blank"\s+rel="noopener"\s+aria-label="Ver ubicación en Google Maps"\s+class="maps-link"\s*>\s*<a\s+href="https:\/\/maps\.app\.goo\.gl\/GricGKCzpp6BXJgE7\?g_st=aw"\s+target="_blank"\s+rel="noopener"\s+aria-label="Ver ubicación en Google Maps"\s+class="maps-link"\s*>\s*Av\. División del Norte 3595,\s*San\s*Pablo Tepetlapa,\s*CP 04620,\s*Coyoacán,\s*CDMX\s*<\/a>\s*<\/a>/s, '<a\n                                        href="https://maps.app.goo.gl/GricGKCzpp6BXJgE7?g_st=aw"\n                                        target="_blank"\n                                        rel="noopener"\n                                        aria-label="Ver ubicación en Google Maps"\n                                        class="maps-link"\n                                    >\n                                        Av. División del Norte 3595, San Pablo Tepetlapa, CP 04620, Coyoacán, CDMX\n                                    </a>');

if (content.indexOf('.mapa-container') === -1) {
    content = content.replace(/<\/style>/, `  .mapa-container {
    width: 100%;
    min-height: clamp(20rem, 35vw, 55vw);
    border-radius: var(--radius-lg);
    overflow: hidden;
    border: 0.1rem solid var(--color-border);
    box-shadow: var(--shadow);
  }
</style>`);
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed ubicacion.astro structure and added map iframe.');
