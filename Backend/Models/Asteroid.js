
const sqlite3 = require('sqlite3').verbose();
const Database = require('better-sqlite3');

module.exports = class Asteroid {

    static async getPages() {

        /* OPEN DB CONNECTION */

        const db = new sqlite3.Database('C:/Users/Stefano/Documents/GitHub/project2/Backend/database/asteroids.db', sqlite3.OPEN_READWRITE, (err) => {
            if (err) return console.error(err.message);
        
            console.log("Connected.")
        })
        
        /* GET PAGES */

        const getPages = await new Promise( resolve => {

            let sql = "SELECT COUNT(*) FROM asteroid";

            db.get(sql, (err, row) => {
                if (err) resolve ( console.log(err.message) )
                else resolve ( row )
            })
        })

        const close = await new Promise( resolve => {
            db.close( (err) => {
                if( err ) resolve ( console.log(err.message) )
                else resolve ( console.log("Disconnected") )
            });
        })

        return getPages;
    }
    
    static async getAsteroid(init) {

        /* OPEN DB CONNECTION */

        const db = new sqlite3.Database('C:/Users/Stefano/Documents/GitHub/project2/Backend/database/asteroids.db', sqlite3.OPEN_READWRITE, (err) => {
            if (err) return console.error(err.message);
        
            console.log("Connected.")
        })

        /* QUERY GET ALL ASTEROIDS */

        const allAsteroids = await new Promise( resolve => {

            let sql = `SELECT * FROM estimated_diameter INNER JOIN asteroid_chars ON estimated_diameter.id_estimated_diameter = asteroid_chars.id_estimated_diameter INNER JOIN asteroid ON asteroid_chars.id_asteroid = asteroid.id_asteroid INNER JOIN orbit_class ON asteroid.id_orbit_class = orbit_class.id_orbit_class INNER JOIN orbital_data ON asteroid.id_asteroid = orbital_data.id_asteroid LIMIT ${init}, 20`;

            db.all(sql, (err, rows) => {
                if (err) resolve ( console.log(err.message) )
                else resolve ( rows )
            })
        })

        const close = await new Promise( resolve => {
            db.close( (err) => {
                if( err ) resolve ( console.log(err.message) )
                else resolve ( console.log("Disconnected") )
            });
        })

        return allAsteroids;
    }

    static async getCloseApproachData(first, last) {

        const database = new Database('C:/Users/Stefano/Documents/GitHub/project2/Backend/database/asteroids.db', { fileMustExist: true });

        const stmt = database.prepare(`SELECT * FROM close_approach_data INNER JOIN miss_distance ON close_approach_data.id_miss_distance = miss_distance.id_miss_distance INNER JOIN relative_velocity ON close_approach_data.id_relative_velocity = relative_velocity.id_relative_velocity INNER JOIN orbiting_body ON close_approach_data.id_orbiting_body = orbiting_body.id_orbiting_body WHERE close_approach_data.id_asteroid > ? AND close_approach_data.id_asteroid < ?`);
        
        const closeApproachData = stmt.all(`${first}`, `${last}`);

        database.close();

        return closeApproachData;

        /* const db = new sqlite3.Database('C:/Users/Stefano/Documents/GitHub/project2/Backend/database/asteroids.db', sqlite3.OPEN_READWRITE, (err) => {
            if (err) return console.error(err.message);
        
            console.log("Connected.")
        })

        const allCloseApproachData = await new Promise( resolve => {
            
            let sql = `SELECT * FROM close_approach_data INNER JOIN miss_distance ON close_approach_data.id_miss_distance = miss_distance.id_miss_distance INNER JOIN relative_velocity ON close_approach_data.id_relative_velocity = relative_velocity.id_relative_velocity INNER JOIN orbiting_body ON close_approach_data.id_orbiting_body = orbiting_body.id_orbiting_body LIMIT ${first}, 1000`; WHERE close_approach_data.id_asteroid > ${first} AND close_approach_data.id_asteroid < ${last}

            db.all(sql, (err, rows) => {
                if (err) resolve ( console.log(err.message) )
                else resolve ( rows )
            })

        })

        const close = await new Promise( resolve => {
            db.close( (err) => {
                if( err ) resolve ( console.log(err.message) )
                else resolve ( console.log("Disconnected") )
            });
        })

        return allCloseApproachData; */
     
    }

    static async postAsteroid(asteroid_table, estimated_diameter, orbital_data, close_approach_data) {

        const db = new sqlite3.Database('C:/Users/Stefano/Documents/GitHub/project2/Backend/database/asteroids.db', sqlite3.OPEN_READWRITE, (err) => {
            if (err) return console.error(err.message);
        
            console.log("Connected.")
        })

        // INSERT DATA INTO DATABASE        
        const postAsteroid = await new Promise( resolve => {

            let sql = "INSERT INTO asteroid (neo_reference_id, name, name_limited, designation, id_orbit_class) VALUES (?, ?, ?, ?, ?);"

            db.run(sql, [asteroid_table.neo_reference_id, asteroid_table.name, asteroid_table.name_limited, asteroid_table.designation, asteroid_table.id_orbit_class], function(err) {
            if (err) resolve ( console.error(err.message) )
            else resolve (this.lastID);            
            })        
        })
        let last_id = postAsteroid;

        const postEstimatedDiameter = await new Promise( resolve => {

            let sql = "INSERT INTO estimated_diameter (estimated_diameter_min_km, estimated_diameter_max_km, estimated_diameter_min_meters, estimated_diameter_max_meters, estimated_diameter_min_miles, estimated_diameter_max_miles, estimated_diameter_min_feet, estimated_diameter_max_feet) VALUES (?, ?, ?, ?, ?, ?, ?, ?);"

            db.run(sql, 
                [
                estimated_diameter.estimated_diameter_min_km, 
                estimated_diameter.estimated_diameter_max_km, 
                estimated_diameter.estimated_diameter_min_meters,
                estimated_diameter.estimated_diameter_max_meters,
                estimated_diameter.estimated_diameter_min_miles,
                estimated_diameter.estimated_diameter_max_miles,
                estimated_diameter.estimated_diameter_min_feet,
                estimated_diameter.estimated_diameter_max_feet
            ], function(err) {
            if (err) resolve ( console.error(err.message) )
            else resolve (this.lastID);            
            })        
        })

        let last_id_estimated_diameter = postEstimatedDiameter;

        const postAsteroidChars = await new Promise( resolve => {

            let sql = "INSERT INTO asteroid_chars (id_asteroid, nasa_jpl_url, absolute_magnitude_h, id_estimated_diameter, is_potentially_hazardous_asteroid, is_sentry_object) VALUES (?, ?, ?, ?, ?, ?);"

            db.run(sql, [last_id, asteroid_table.nasa_jpl_url, asteroid_table.absolute_magnitude_h, last_id_estimated_diameter, asteroid_table.is_potentially_hazardous_asteroid, asteroid_table.is_sentry_object], function(err) {
            if (err) resolve ( console.error(err.message) )
            else resolve (asteroid_table);            
            })        
        })

        const postAsteroidOrbitalData = await new Promise( resolve => {

            let sql = "INSERT INTO orbital_data (id_asteroid, orbit_id, orbit_determination_date, first_observation_date, last_observation_date, data_arc_in_days, observations_used, orbit_uncertainty, minimum_orbit_intersection, jupiter_tisserand_invariant, epoch_osculation, eccentricity, semi_major_axis, inclination, ascending_node_longitude, orbital_period, perihelion_distance, perihelion_argument, aphelion_distance, perihelion_time, mean_anomaly, mean_motion, equinox) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);"

            db.run(sql, [
                last_id, 
                orbital_data.orbit_id, 
                orbital_data.orbit_determination_date, 
                orbital_data.first_observation_date,
                orbital_data.last_observation_date, 
                orbital_data.data_arc_in_days, 
                orbital_data.observations_used,
                orbital_data.orbit_uncertainty,
                orbital_data.minimum_orbit_intersection,
                orbital_data.jupiter_tisserand_invariant,
                orbital_data.epoch_osculation,
                orbital_data.eccentricity,
                orbital_data.semi_major_axis,
                orbital_data.inclination,
                orbital_data.ascending_node_longitude,
                orbital_data.orbital_period,
                orbital_data.perihelion_distance,
                orbital_data.perihelion_argument,
                orbital_data.aphelion_distance,
                orbital_data.perihelion_time,
                orbital_data.mean_anomaly,
                orbital_data.mean_motion,
                orbital_data.equinox
            ], function(err) {
            if (err) resolve ( console.error(err.message) )
            else resolve (orbital_data);            
            })        
        })
        
        for(let close_approach of close_approach_data) {

            let last_id_relative_velocity;

            const postAsteroidCloseApproachRelativeVelocity = await new Promise( resolve => {

                let sql_relative_velocity = "INSERT INTO relative_velocity (kilometers_per_second, kilometers_per_hour, miles_per_hour) VALUES (?, ?, ?)";                

                db.run(sql_relative_velocity, [close_approach.relative_velocity.kilometers_per_second, close_approach.relative_velocity.kilometers_per_hour, close_approach.relative_velocity.miles_per_hour], function(err) {
                    if (err) resolve ( console.error(err.message) )
                    else resolve (this.lastID);           
                })
            })
            last_id_relative_velocity = postAsteroidCloseApproachRelativeVelocity;

            let last_id_miss_distance;
            
            const postAsteroidCloseApproachMissDistance = await new Promise( resolve => {

                let sql_miss_distance = "INSERT INTO miss_distance (astronomical, lunar, kilometers, miles) VALUES (?, ?, ?, ?)";
                

                db.run(sql_miss_distance, [close_approach.miss_distance.astronomical, close_approach.miss_distance.lunar, close_approach.miss_distance.kilometers, close_approach.miss_distance.miles], function(err) {
                    if (err) resolve ( console.error(err.message) )
                    else resolve (this.lastID);           
                })
            })
            last_id_miss_distance = postAsteroidCloseApproachMissDistance; 

            let id_orbiting_body;

            if( close_approach.orbiting_body == "Earth" ) {
                id_orbiting_body = 1;
            } else if ( close_approach.orbiting_body == "Mars" ) {
                id_orbiting_body = 2;
            } else if ( close_approach.orbiting_body == "Venus" ) {
                id_orbiting_body = 3;
            } else if ( close_approach.orbiting_body == "Sun" ) {
                id_orbiting_body = 4;
            } else if ( close_approach.orbiting_body == "Merc" ) {
                id_orbiting_body = 5;
            } else if ( close_approach.orbiting_body == "Juptr" ) {
                id_orbiting_body = 6;
            } else if ( close_approach.orbiting_body == "Satrn" ) {
                id_orbiting_body = 7;
            } else if ( close_approach.orbiting_body == "Neptune" ) {
                id_orbiting_body = 8;
            } else if ( close_approach.orbiting_body == "Uranus" ) {
                id_orbiting_body = 9;
            } else if ( close_approach_orbiting_body == "Moon" ) {
                id_orbiting_body_0 = 10;
            } else if ( close_approach_orbiting_body == "Ceres" ) {
                id_orbiting_body_0 = 11;
            }

            let sql_close_approach = "INSERT INTO close_approach_data (id_asteroid, close_approach_date, close_approach_date_full, epoch_date_close_approach, id_relative_velocity, id_miss_distance, id_orbiting_body) VALUES (?, ?, ?, ?, ?, ?, ?);"

            db.run(sql_close_approach, [last_id, close_approach.close_approach_date, close_approach.close_approach_date_full, close_approach.epoch_date_close_approach, last_id_relative_velocity, last_id_miss_distance, id_orbiting_body], function(err) {
            if (err) ( console.error(err.message) )          
            })            
        }

        db.close( (err) => {
            if( err ) (console.log(err.message))
            else console.log("Disconnected")
        });

    }
}