require('dotenv').config()

const { leerInput, inquirerMenu, pausa, listarLugares } = require("./helpers/inquirer");

const Busquedas = require('./models/busquedas');

const main = async() => {
    

    let opt = 0;

    const busquedas = new Busquedas();

    do {

        opt = await inquirerMenu();

        switch (opt) {
            case 1:

                // Mostrar mensaje
                const termino = await leerInput('Ciudad: ');

                // Buscar los lugares
                const lugares = await busquedas.ciudad(termino);

                // Seleccionar el lugar
                const id = await listarLugares(lugares);

                if( id === '0' ) continue;

                const lugarSel = lugares.find( l => l.id === id);

                busquedas.agregarHistorial( lugarSel.nombre );

                const clima = await busquedas.climaLugar(lugarSel.lat,lugarSel.lng);
 
                // Clima

                console.log('\n Informacion de la ciudad\n'.green);
                console.log('Ciudad: ', lugarSel.nombre);
                console.log('Lat: ', lugarSel.lat);
                console.log('Lng: ', lugarSel.lng);
                console.log('Temperatura: ', clima.temp);
                console.log('Minima: ', clima.min);
                console.log('Maxima: ', clima.max);
                console.log('Como esta el clima: ', clima.desc);

                
                
                break;
            case 2:
                busquedas.historialCapiltalizado.forEach( ( lugar, i ) => {
                    const idx = `${ i + 1 }.`.green;
                    console.log( ` ${ idx } ${ lugar }` );
                } )

                break;
    
            default:
                break;
        }

        await pausa();
        
    } while( opt !== 0 )

   
}

main();