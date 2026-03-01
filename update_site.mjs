import fs from 'fs';
import path from 'path';

function walkPath(dir, callback) {
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
    
    // 1. Reemplazar "Pedregal de Santo Domingo" por "San Pablo Tepetlapa"
    content = content.replace(/Pedregal de Santo Domingo/g, 'San Pablo Tepetlapa');

    // 2. Schemas JSON-LD
    
    // En index.astro
    content = content.replace(
      /dayOfWeek: \["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"\],\s*opens: "09:00",\s*closes: "20:00",/g,
      'dayOfWeek: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],\n      opens: "10:00",\n      closes: "19:00",'
    );
    content = content.replace(
      /dayOfWeek: \["Saturday", "Sunday"\],\s*opens: "10:00",\s*closes: "18:00",/g,
      'dayOfWeek: ["Sunday"],\n      opens: "10:00",\n      closes: "17:00",'
    );

    // En contacto.astro
    content = content.replace(
      /dayOfWeek: \[\s*"Monday",\s*"Tuesday",\s*"Wednesday",\s*"Thursday",\s*"Friday",\s*\],\s*opens: "09:00",\s*closes: "20:00",/g,
      'dayOfWeek: [\n                    "Tuesday",\n                    "Wednesday",\n                    "Thursday",\n                    "Friday",\n                    "Saturday",\n                ],\n                opens: "10:00",\n                closes: "19:00",'
    );

    // 3. Footer
    content = content.replace(
      /<p>Lun-Vie: 9:00 - 20:00<\/p>\s*<p>Sáb-Dom: 10:00 - 18:00<\/p>/g,
      '<p>Lunes: Cerrado</p>\n        <p>Mar-Sáb: 10:00 - 19:00</p>\n        <p>Dom: 10:00 - 17:00</p>'
    );

    // 4. Urgencias Banner y FAQ
    content = content.replace(
      /Atendemos urgencias: Lun-Vie 9:00-20:00 \| Sáb-Dom 10:00-18:00/g,
      'Atendemos urgencias: Lunes: Cerrado | Mar-Sáb 10:00-19:00 | Dom 10:00-17:00'
    );
    content = content.replace(
      /Lun-Vie 9-20h, Sáb-Dom 10-18h/g,
      'Lunes cerrado, Mar-Sáb 10-19h, Dom 10-17h'
    );
    // En FAQ urgencias
    content = content.replace(
      /en un horario de 10:00 a 18:00 hrs\. En Av\. División del Norte 3595, San Pablo Tepetlapa\./g,
      'en un horario de 10:00 a 17:00 hrs. En Av. División del Norte 3595, San Pablo Tepetlapa.'
    );

    // 5. Ubicacion
    content = content.replace(
      /Lun-Vie 9:00-20:00<br \/>\s*Sáb-Dom 10:00-18:00/g,
      'Lunes: Cerrado<br />\n                                    Mar-Sáb 10:00-19:00<br />\n                                    Dom 10:00-17:00'
    );

    // 6. Contacto info
    content = content.replace(
      /<span class="fw-bold text-primary-dark block"\s*>Lunes a Viernes:<\/span>\s*Desde las 9:00 AM hasta las 20:00 PM hrs./g,
      '<span class="fw-bold text-primary-dark block"\n                                >Lunes:</span\n                            >\n                            Cerrado.\n                        </p>\n                        <p class="text-soft text-sm m-0 lh-relaxed pt-xs">\n                            <span class="fw-bold text-primary-dark block"\n                                >Martes a Sábado:</span\n                            >\n                            Desde las 10:00 AM hasta las 19:00 PM hrs.'
    );
    content = content.replace(
      /<span class="fw-bold text-primary-dark block"\s*>Sábado y Domingo:<\/span>\s*Desde las 10:00 AM hasta las 18:00 PM hrs./g,
      '<span class="fw-bold text-primary-dark block"\n                                >Domingo:</span\n                            >\n                            Desde las 10:00 AM hasta las 17:00 PM hrs.'
    );

    // 7. Index mapa
    content = content.replace(
      /<span class="text-primary-dark fw-bold block">Lun-Vie:<\/span> 9:00 -\s*20:00 hrs\s*<br \/><span class="text-primary-dark fw-bold block mt-xs"\s*>Sáb-Dom:<\/span\s*>\s*10:00 - 18:00 hrs/g,
      '<span class="text-primary-dark fw-bold block">Lunes:</span> Cerrado\n              <br /><span class="text-primary-dark fw-bold block mt-xs">Mar-Sáb:</span> 10:00 - 19:00 hrs\n              <br /><span class="text-primary-dark fw-bold block mt-xs"\n                >Dom:</span\n              > 10:00 - 17:00 hrs'
    );

    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Updated: ' + filePath);
    }
  }
});
