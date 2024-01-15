const axios = require('axios');
const sqlite3 = require('sqlite3').verbose();

async function getAsteroid() {
    let pages = [];  
    for(let i=1727; i<1728; i++) {
        let url = `https://api.nasa.gov/neo/rest/v1/neo/browse?page=${i}&size=20&api_key=GC0tZMMjbn55gkfIHCtsavveulO8YlnDOlbdwdU5`;
        pages[i] = axios.get(url)
    }

    let asteroid = [];

    Promise.all(pages).then( (values) => {

        for( let i=1727; i < values.length; i++) {
            
            for( let k=0; k < 20; k++){         
                asteroid.push(values[i].data.near_earth_objects[k]);            
            }                       
        }

        /* console.log(values[asteroid.length - 1].headers['x-ratelimit-remaining']); */
        return asteroid;       
    }).then( async (asteroid) => {

        const db = new sqlite3.Database('C:/Users/Stefano/Documents/GitHub/project2/Backend/database/asteroids.db', sqlite3.OPEN_READWRITE, (err) => {
            if (err) return console.error(err.message);
        
            console.log("Connected.")
        })

        /* FILL asteroid TABLE */

        let sqlAsteroid;

        if( Object.hasOwn(asteroid[0], "orbital_data")) {
        
            let id_orbit_class;
            let orbit_class_type = asteroid[0].orbital_data.orbit_class.orbit_class_type;

            if( orbit_class_type == "AMO" ) {
                id_orbit_class = 1;
            } else if ( orbit_class_type == "APO" ) {
                id_orbit_class = 2;
            } else if ( orbit_class_type == "ATE" ) {
                id_orbit_class = 3;
            } else if ( orbit_class_type == "IEO" ) {
                id_orbit_class = 4;
            }

            sqlAsteroid = `INSERT INTO asteroid (neo_reference_id, name, name_limited, designation, id_orbit_class) VALUES ('${asteroid[0].neo_reference_id}', "${asteroid[0].name}", "${asteroid[0].name_limited}", '${asteroid[0].designation}', '${id_orbit_class}')`;
        } else {
            sqlAsteroid = `INSERT INTO asteroid (neo_reference_id, name, name_limited, designation, id_orbit_class) VALUES ('${asteroid[0].neo_reference_id}', "${asteroid[0].name}", "${asteroid[0].name_limited}", '${asteroid[0].designation}', NULL)`            
        }
        

        for(let i = 1; i < asteroid.length; i++) {

            if( Object.hasOwn(asteroid[i], "orbital_data")) {
                let id_orbit_class;
                let orbit_class_type = asteroid[i].orbital_data.orbit_class.orbit_class_type;

                if( orbit_class_type == "AMO" ) {
                    id_orbit_class = 1;
                } else if ( orbit_class_type == "APO" ) {
                    id_orbit_class = 2;
                } else if ( orbit_class_type == "ATE" ) {
                    id_orbit_class = 3;
                } else if ( orbit_class_type == "IEO" ) {
                    id_orbit_class = 4;
                }

                sqlAsteroid = sqlAsteroid + `, ('${asteroid[i].neo_reference_id}', "${asteroid[i].name}", "${asteroid[i].name_limited}", '${asteroid[i].designation}', '${id_orbit_class}')`;
            } else {
                sqlAsteroid = sqlAsteroid + `, ('${asteroid[i].neo_reference_id}', "${asteroid[i].name}", "${asteroid[i].name_limited}", '${asteroid[i].designation}', NULL)`                
            }          
        }

        sqlAsteroid = sqlAsteroid + ` RETURNING id_asteroid;`;

        /* console.log(sqlAsteroid) */
        
        let asteroidID = [];
        async function Asteroid() {

            const asteroidFill = await new Promise( (resolve) => {
                db.all(sqlAsteroid, function(err, rows) {
                    let id_asteroid = [];
                    for( let i = 0; i < rows.length; i++) {
                        id_asteroid[i] = rows[i].id_asteroid;
                    }
                    if(err) resolve (console.log("asteroid " + err.message))
                    else resolve (id_asteroid)
                })
            })
            return asteroidFill        
        }

        asteroidID = await Asteroid();

        /* FILL estimated_diameter TABLE */

        let sqlAsteroidEstimatedDiameter = `INSERT INTO estimated_diameter (estimated_diameter_min_km, estimated_diameter_max_km, estimated_diameter_min_meters, estimated_diameter_max_meters, estimated_diameter_min_miles, estimated_diameter_max_miles, estimated_diameter_min_feet, estimated_diameter_max_feet) VALUES ('${asteroid[0].estimated_diameter.kilometers.estimated_diameter_min}', '${asteroid[0].estimated_diameter.kilometers.estimated_diameter_max}', '${asteroid[0].estimated_diameter.meters.estimated_diameter_min}', '${asteroid[0].estimated_diameter.meters.estimated_diameter_max}', '${asteroid[0].estimated_diameter.miles.estimated_diameter_min}', '${asteroid[0].estimated_diameter.miles.estimated_diameter_max}','${asteroid[0].estimated_diameter.feet.estimated_diameter_min}', '${asteroid[0].estimated_diameter.feet.estimated_diameter_max}')`;

        for(let i = 1; i < asteroid.length; i++) {            
            if( !Object.hasOwn(asteroid[i], 'estimated_diameter') ) {
                sqlAsteroidEstimatedDiameter = sqlAsteroidEstimatedDiameter + `, (NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)`                
            } else {
                sqlAsteroidEstimatedDiameter = sqlAsteroidEstimatedDiameter + `, ('${asteroid[i].estimated_diameter.kilometers.estimated_diameter_min}', '${asteroid[i].estimated_diameter.kilometers.estimated_diameter_max}', '${asteroid[i].estimated_diameter.meters.estimated_diameter_min}', '${asteroid[i].estimated_diameter.meters.estimated_diameter_max}', '${asteroid[i].estimated_diameter.miles.estimated_diameter_min}', '${asteroid[i].estimated_diameter.miles.estimated_diameter_max}','${asteroid[i].estimated_diameter.feet.estimated_diameter_min}', '${asteroid[i].estimated_diameter.feet.estimated_diameter_max}')`;
            }    
                  
        }

        sqlAsteroidEstimatedDiameter = sqlAsteroidEstimatedDiameter + " RETURNING id_estimated_diameter;";

        let estimated_diameterID = [];

        async function EstimatedDiameter() {
            const EstimatedDiameterFill = await new Promise( (resolve) => {
            
                db.all(sqlAsteroidEstimatedDiameter, (err, rows) => {
    
                    let id_estimated_diameter = [];
    
                    for( let i = 0; i < rows.length; i++ ) {
                        id_estimated_diameter[i] = rows[i].id_estimated_diameter;
                    }
                    if(err) resolve (console.log("estimated_diameter " + err.message))
                    else resolve (id_estimated_diameter)
                })
            })
            return EstimatedDiameterFill;
        }
        
        estimated_diameterID = await EstimatedDiameter();

        /* FILL asteroid_chars TABLE */

        let sqlAsteroidChars = `INSERT INTO asteroid_chars (id_asteroid, nasa_jpl_url, absolute_magnitude_h, id_estimated_diameter, is_potentially_hazardous_asteroid, is_sentry_object) VALUES (${asteroidID[0]}, '${asteroid[0].nasa_jpl_url}', ${asteroid[0].absolute_magnitude_h}, '${estimated_diameterID[0]}', ${asteroid[0].is_potentially_hazardous_asteroid}, ${asteroid[0].is_sentry_object})`;

        for( let i = 1; i < asteroid.length; i++ ) {
            if( !Object.hasOwn(asteroid[i], 'absolute_magnitude_h') ) {
                sqlAsteroidChars = sqlAsteroidChars + `, (${asteroidID[i]}, '${asteroid[i].nasa_jpl_url}', NULL, '${estimated_diameterID[i]}', ${asteroid[i].is_potentially_hazardous_asteroid}, ${asteroid[i].is_sentry_object})`
            } else {
                sqlAsteroidChars = sqlAsteroidChars + `, (${asteroidID[i]}, '${asteroid[i].nasa_jpl_url}', ${asteroid[i].absolute_magnitude_h}, '${estimated_diameterID[i]}', ${asteroid[i].is_potentially_hazardous_asteroid}, ${asteroid[i].is_sentry_object})`                
            }
        }

        db.run(sqlAsteroidChars, (err) => {
            if(err) console.log("AsteroidChars " + err.message);
        })

        /* FILL orbital_data TABLE */

        let sqlAsteroidOrbitalData = `INSERT INTO orbital_data (id_asteroid, orbit_id, orbit_determination_date, first_observation_date, last_observation_date, data_arc_in_days, observations_used, orbit_uncertainty, minimum_orbit_intersection, jupiter_tisserand_invariant, epoch_osculation, eccentricity, semi_major_axis, inclination, ascending_node_longitude, orbital_period, perihelion_distance, perihelion_argument, aphelion_distance, perihelion_time, mean_anomaly, mean_motion, equinox) VALUES (${asteroidID[0]}, '${asteroid[0].orbital_data.orbit_id}', '${asteroid[0].orbital_data.orbit_determination_date}', '${asteroid[0].orbital_data.first_observation_date}', '${asteroid[0].orbital_data.last_observation_date}', ${asteroid[0].orbital_data.data_arc_in_days}, ${asteroid[0].orbital_data.observations_used}, ${asteroid[0].orbital_data.orbit_uncertainty}, ${asteroid[0].orbital_data.minimum_orbit_intersection}, ${asteroid[0].orbital_data.jupiter_tisserand_invariant}, ${asteroid[0].orbital_data.epoch_osculation}, ${asteroid[0].orbital_data.eccentricity}, ${asteroid[0].orbital_data.semi_major_axis}, ${asteroid[0].orbital_data.inclination}, ${asteroid[0].orbital_data.ascending_node_longitude}, ${asteroid[0].orbital_data.orbital_period}, ${asteroid[0].orbital_data.perihelion_distance}, ${asteroid[0].orbital_data.perihelion_argument}, ${asteroid[0].orbital_data.aphelion_distance}, ${asteroid[0].orbital_data.perihelion_time}, ${asteroid[0].orbital_data.mean_anomaly}, ${asteroid[0].orbital_data.mean_motion}, '${asteroid[0].orbital_data.equinox}')`;

        for( let i = 1; i < asteroid.length; i++ ) {
            if ( Object.hasOwn(asteroid[i], "orbital_data" )) {
                sqlAsteroidOrbitalData = sqlAsteroidOrbitalData + `, (${asteroidID[i]}, '${asteroid[i].orbital_data.orbit_id}', '${asteroid[i].orbital_data.orbit_determination_date}', '${asteroid[i].orbital_data.first_observation_date}', '${asteroid[i].orbital_data.last_observation_date}', ${asteroid[i].orbital_data.data_arc_in_days}, ${asteroid[i].orbital_data.observations_used}, ${asteroid[i].orbital_data.orbit_uncertainty}, ${asteroid[i].orbital_data.minimum_orbit_intersection}, ${asteroid[i].orbital_data.jupiter_tisserand_invariant}, ${asteroid[i].orbital_data.epoch_osculation}, ${asteroid[i].orbital_data.eccentricity}, ${asteroid[i].orbital_data.semi_major_axis}, ${asteroid[i].orbital_data.inclination}, ${asteroid[i].orbital_data.ascending_node_longitude}, ${asteroid[i].orbital_data.orbital_period}, ${asteroid[i].orbital_data.perihelion_distance}, ${asteroid[i].orbital_data.perihelion_argument}, ${asteroid[i].orbital_data.aphelion_distance}, ${asteroid[i].orbital_data.perihelion_time}, ${asteroid[i].orbital_data.mean_anomaly}, ${asteroid[i].orbital_data.mean_motion}, '${asteroid[i].orbital_data.equinox}')`
            } else {
                sqlAsteroidOrbitalData = sqlAsteroidOrbitalData + `, (${asteroidID[i]}, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)`                
            }
            
        }

        db.run(sqlAsteroidOrbitalData, (err) => {
            if(err) console.log("OrbitalData " + err.message);
        })

        /* FILL relative_velocity TABLE */

        let sqlRelativeVelocity = `INSERT INTO relative_velocity (kilometers_per_second, kilometers_per_hour, miles_per_hour) VALUES ('${asteroid[0].close_approach_data[0].relative_velocity.kilometers_per_second}', '${asteroid[0].close_approach_data[0].relative_velocity.kilometers_per_hour}', '${asteroid[0].close_approach_data[0].relative_velocity.miles_per_hour}')`;

        for( let k = 1; k < asteroid[0].close_approach_data.length; k++ ) {
            sqlRelativeVelocity = sqlRelativeVelocity + `, ('${asteroid[0].close_approach_data[k].relative_velocity.kilometers_per_second}', '${asteroid[0].close_approach_data[k].relative_velocity.kilometers_per_hour}', '${asteroid[0].close_approach_data[k].relative_velocity.miles_per_hour}')`            
        }

        for( let i = 1; i < asteroid.length; i++ ) {
            for( let j = 0; j < asteroid[i].close_approach_data.length; j++ ) {
                sqlRelativeVelocity = sqlRelativeVelocity + `, ('${asteroid[i].close_approach_data[j].relative_velocity.kilometers_per_second}', '${asteroid[i].close_approach_data[j].relative_velocity.kilometers_per_hour}', '${asteroid[i].close_approach_data[j].relative_velocity.miles_per_hour}')`
            }
        }

        sqlRelativeVelocity = sqlRelativeVelocity + " RETURNING id_relative_velocity;";

        let relative_velocityID = [];

        async function RelativeVelocity() {
            const RelativeVelocityFill = await new Promise( (resolve) => {
            
                db.all(sqlRelativeVelocity, (err, rows) => {  
                    let id_relative_velocity = [];
    
                    for( let i = 0; i < rows.length; i++ ) {
                        id_relative_velocity[i] = rows[i].id_relative_velocity;
                    }
                    if(err) resolve (console.log("relative_velocity " + err.message))
                    else resolve (id_relative_velocity)
                })
            })
            return RelativeVelocityFill;
        }
        
        relative_velocityID = await RelativeVelocity();

        /* FILL miss_distance TABLE */

        let sqlMissDistance = `INSERT INTO miss_distance (astronomical, lunar, kilometers, miles) VALUES ('${asteroid[0].close_approach_data[0].miss_distance.astronomical}', '${asteroid[0].close_approach_data[0].miss_distance.lunar}', '${asteroid[0].close_approach_data[0].miss_distance.kilometers}', '${asteroid[0].close_approach_data[0].miss_distance.miles}')`;

        for( let k = 1; k < asteroid[0].close_approach_data.length; k++ ) {
            sqlMissDistance = sqlMissDistance + `, ('${asteroid[0].close_approach_data[k].miss_distance.astronomical}', '${asteroid[0].close_approach_data[k].miss_distance.lunar}', '${asteroid[0].close_approach_data[k].miss_distance.kilometers}', '${asteroid[0].close_approach_data[k].miss_distance.miles}')`            
        }

        for( let i = 1; i < asteroid.length; i++ ) {
            for( let j = 0; j < asteroid[i].close_approach_data.length; j++ ) {
                sqlMissDistance = sqlMissDistance + `, ('${asteroid[i].close_approach_data[j].miss_distance.astronomical}', '${asteroid[i].close_approach_data[j].miss_distance.lunar}', '${asteroid[i].close_approach_data[j].miss_distance.kilometers}', '${asteroid[i].close_approach_data[j].miss_distance.miles}')`
            }
        }

        sqlMissDistance = sqlMissDistance + " RETURNING id_miss_distance;";

        let miss_distanceID = [];

        async function MissDistance() {
            const MissDistanceFill = await new Promise( (resolve) => {
            
                db.all(sqlMissDistance, (err, rows) => {   
                    let id_miss_distance = [];
    
                    for( let i = 0; i < rows.length; i++ ) {
                        id_miss_distance[i] = rows[i].id_miss_distance;
                    }
                    if(err) resolve (console.log("miss_distance " + err.message))
                    else resolve (id_miss_distance)
                })
            })
            return MissDistanceFill;
        }
        
        miss_distanceID = await MissDistance();
        
        let close_approach_orbiting_body = asteroid[0].close_approach_data[0].orbiting_body;

        let id_orbiting_body_0;

        if( close_approach_orbiting_body == "Earth" ) {
            id_orbiting_body_0 = 1;
        } else if ( close_approach_orbiting_body == "Mars" ) {
            id_orbiting_body_0 = 2;
        } else if ( close_approach_orbiting_body == "Venus" ) {
            id_orbiting_body_0 = 3;
        } else if ( close_approach_orbiting_body == "Sun" ) {
            id_orbiting_body_0 = 4;
        } else if ( close_approach_orbiting_body == "Merc" ) {
            id_orbiting_body_0 = 5;
        } else if ( close_approach_orbiting_body == "Juptr" ) {
            id_orbiting_body_0 = 6;
        } else if ( close_approach_orbiting_body == "Satrn" ) {
            id_orbiting_body_0 = 7;
        } else if ( close_approach_orbiting_body == "Neptune" ) {
            id_orbiting_body_0 = 8;
        } else if ( close_approach_orbiting_body == "Uranus" ) {
            id_orbiting_body_0 = 9;
        } else if ( close_approach_orbiting_body == "Moon" ) {
            id_orbiting_body_0 = 10;
        } else if ( close_approach_orbiting_body == "Ceres" ) {
            id_orbiting_body_0 = 11;
        }

        /* FILL close_approach TABLE */

        let sqlCloseApproach = `INSERT INTO close_approach_data (id_asteroid, close_approach_date, close_approach_date_full, epoch_date_close_approach, id_relative_velocity, id_miss_distance, id_orbiting_body) VALUES (${asteroidID[0]}, '${asteroid[0].close_approach_data[0].close_approach_date}', '${asteroid[0].close_approach_data[0].close_approach_date_full}', ${asteroid[0].close_approach_data[0].epoch_date_close_approach}, ${relative_velocityID[0]}, ${miss_distanceID[0]}, ${id_orbiting_body_0})`;

        let num = 1;

        for( let k = 1; k < asteroid[0].close_approach_data.length; k++ ) {

            let id_orbiting_body_0;
            let close_approach_orbiting_body = asteroid[0].close_approach_data[k].orbiting_body;

            if( close_approach_orbiting_body == "Earth" ) {
                id_orbiting_body_0 = 1;
            } else if ( close_approach_orbiting_body == "Mars" ) {
                id_orbiting_body_0 = 2;
            } else if ( close_approach_orbiting_body == "Venus" ) {
                id_orbiting_body_0 = 3;
            } else if ( close_approach_orbiting_body == "Sun" ) {
                id_orbiting_body_0 = 4;
            } else if ( close_approach_orbiting_body == "Merc" ) {
                id_orbiting_body_0 = 5;
            } else if ( close_approach_orbiting_body == "Juptr" ) {
                id_orbiting_body_0 = 6;
            } else if ( close_approach_orbiting_body == "Satrn" ) {
                id_orbiting_body_0 = 7;
            } else if ( close_approach_orbiting_body == "Neptune" ) {
                id_orbiting_body_0 = 8;
            } else if ( close_approach_orbiting_body == "Uranus" ) {
                id_orbiting_body_0 = 9;
            } else if ( close_approach_orbiting_body == "Moon" ) {
                id_orbiting_body_0 = 10;
            } else if ( close_approach_orbiting_body == "Ceres" ) {
                id_orbiting_body_0 = 11;
            }

            sqlCloseApproach = sqlCloseApproach + `, (${asteroidID[0]}, '${asteroid[0].close_approach_data[k].close_approach_date}', '${asteroid[0].close_approach_data[k].close_approach_date_full}', ${asteroid[0].close_approach_data[k].epoch_date_close_approach}, ${relative_velocityID[num]}, ${miss_distanceID[num]}, ${id_orbiting_body_0})`;
            
            num++;
        }

        for( let i = 1; i < asteroid.length; i++ ) {
            for( let j = 0; j < asteroid[i].close_approach_data.length; j++ ) {

                let id_orbiting_body_0;
                let close_approach_orbiting_body = asteroid[i].close_approach_data[j].orbiting_body;

                if( close_approach_orbiting_body == "Earth" ) {
                    id_orbiting_body_0 = 1;
                } else if ( close_approach_orbiting_body == "Mars" ) {
                    id_orbiting_body_0 = 2;
                } else if ( close_approach_orbiting_body == "Venus" ) {
                    id_orbiting_body_0 = 3;
                } else if ( close_approach_orbiting_body == "Sun" ) {
                    id_orbiting_body_0 = 4;
                } else if ( close_approach_orbiting_body == "Merc" ) {
                    id_orbiting_body_0 = 5;
                } else if ( close_approach_orbiting_body == "Juptr" ) {
                    id_orbiting_body_0 = 6;
                } else if ( close_approach_orbiting_body == "Satrn" ) {
                    id_orbiting_body_0 = 7;
                } else if ( close_approach_orbiting_body == "Neptune" ) {
                    id_orbiting_body_0 = 8;
                } else if ( close_approach_orbiting_body == "Uranus" ) {
                    id_orbiting_body_0 = 9;
                } else if ( close_approach_orbiting_body == "Moon" ) {
                    id_orbiting_body_0 = 10;
                } else if ( close_approach_orbiting_body == "Ceres" ) {
                    id_orbiting_body_0 = 11;
                }

                sqlCloseApproach = sqlCloseApproach + `, (${asteroidID[i]}, '${asteroid[i].close_approach_data[j].close_approach_date}', '${asteroid[i].close_approach_data[j].close_approach_date_full}', ${asteroid[i].close_approach_data[j].epoch_date_close_approach}, ${relative_velocityID[num]}, ${miss_distanceID[num]}, ${id_orbiting_body_0})`;

                num++;
            }
        }

        /* console.log(sqlCloseApproach) */

        async function CloseApproach() {
            const CloseApproachFunc = await new Promise( (resolve) => {
            
                db.run(sqlCloseApproach, (err) => {
                    if(err) resolve (console.log("Close approach " + err))
                    else resolve (true)
                })
                
            })
            return CloseApproachFunc;     
        }

        const Close_Approach = await CloseApproach();

        db.close( (err) => {
            if( err ) (console.log(err.message))
            else console.log("Disconnected")
        });
        
    })

    
}   

getAsteroid();