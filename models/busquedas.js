const fs = require('fs');
const axios = require('axios');

class Busquedas {

    historial = [];
    dbPath = './db/database.json';

    constructor () {
       this.leerDB();
    }

    get historialCapiltalizado() {

        // return this.historial.map( ( lugar ) => 
        // lugar.trim().split(',').map( 
        // (palabra) => palabra.trim()[0].toUpperCase() + palabra.trim().substr(1) ).join(', '))

        return this.historial.map( lugar => {

            let palabras = lugar.split(' ');

            palabras = palabras.map( p => p[0].toUpperCase() + p.substring(1) );

            return palabras.join(' ');

        });
      
    }

    get paramsMapbox() {
        return {
            'access_token': process.env.MAPBOX_KEY,
            'limit': 5,
            'lenguage': 'es'
        }
    }

    get paramsOpenWeather() {
        return {
            appid: process.env.OPENWEATHER_KEY ,
            units: 'metric',
            lang: 'es'
        }
    }

    async ciudad( lugar = '' ) {
        // peticion http

        try {

            const intance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.paramsMapbox
            });

            const resp = await intance.get();

            return resp.data.features.map( lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1]
            })); // retornar un nuevo array con objetos // lugar => ({}) se retorna un objeto implicitamente
            
        } catch (error) {

            return [];
            
        }

      
    }

    async climaLugar(lat, lon) {
        try {
            // intace axios.create()

            const intance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: { ...this.paramsOpenWeather, lat, lon }
            });

            const resp = await intance.get();
            const { weather, main } = resp.data;

            //  resp.data

            return {
                desc: weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp
            }

        } catch (error) {
            console.log(error);
        }
    }

    agregarHistorial( lugar = '' ) {
        //

        if( this.historial.includes( lugar.toLocaleLowerCase()) ) {
            return;
        }

        this.historial = this.historial.splice(0,5);

        this.historial.unshift( lugar.toLocaleLowerCase() );
        
        //Grabar en db

        this.guardarDB();

    }

    guardarDB() {

        const payload = {
            historial: this.historial
        }

        fs.writeFileSync( this.dbPath, JSON.stringify( payload ) )
    }

    leerDB() {

        if( !fs.existsSync(this.dbPath) ) {
            return null;
        }

        const info = fs.readFileSync(this.dbPath, { encoding: 'utf-8' });

        const data = JSON.parse( info );

        this.historial = data.historial;
       
    }


}


module.exports = Busquedas;