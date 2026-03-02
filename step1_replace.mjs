import fs from 'fs';

const files = [
    'e:/adlibswebsites/puntoveterinario/src/pages/servicios/estetica-canina-felina.astro',
    'e:/adlibswebsites/puntoveterinario/src/pages/servicios/alimento-mascotas.astro'
];

files.forEach(f => {
    let content = fs.readFileSync(f, 'utf8');
    let orig = content;

    // Replace Pedregal de Sto. Domingo -> San Pablo Tepetlapa
    content = content.replace(/Pedregal de Sto\. Domingo/g, 'San Pablo Tepetlapa');

    // Replace Pedregal de \s* Santo \s* Domingo -> San Pablo Tepetlapa
    content = content.replace(/Pedregal de\s+Santo\s+Domingo/g, 'San Pablo Tepetlapa');

    if (content !== orig) {
        fs.writeFileSync(f, content, 'utf8');
        console.log('Updated ' + f);
    } else {
        console.log('No matches in ' + f);
    }
});
