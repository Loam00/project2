const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./asteroids.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.error(err.message);

    console.log("Connected.")
})

let sql;

/* Asteroid */

/* sql = "DROP TABLE close_approach_data"; */

/* sql = "CREATE TABLE asteroid ( id_asteroid INTEGER PRIMARY KEY, neo_reference_id VARCHAR(255) UNIQUE, name VARCHAR(255), name_limited VARCHAR(255), designation VARCHAR(255), id_orbit_class INTEGER references orbit_class(id_orbit_class) )"; */

/* sql = "CREATE TABLE orbit_class ( id_orbit_class INTEGER PRIMARY KEY, orbit_class_type VARCHAR(255), orbit_class_description VARCHAR(255), orbit_class_range VARCHAR(255) )"; */

/* sql = "CREATE TABLE close_approach_data ( id_close_approach INTEGER PRIMARY KEY, id_asteroid INTEGER references asteroid(id_asteroid), close_approach_date VARCHAR(255), close_approach_date_full VARCHAR(255), epoch_date_close_approach VARCHAR(255), id_relative_velocity INTEGER UNIQUE references relative_velocity(id_relative_velocity), id_miss_distance INTEGER UNIQUE references miss_distance(id_miss_distance), id_orbiting_body INTEGER references orbiting_body(id_orbiting_body) )"; */

/* sql = "CREATE TABLE relative_velocity ( id_relative_velocity INTEGER PRIMARY KEY, kilometers_per_second VARCHAR(255), kilometers_per_hour VARCHAR(255), miles_per_hour VARCHAR(255) )"; */

/* sql = "CREATE TABLE miss_distance ( id_miss_distance INTEGER PRIMARY KEY, astronomical VARCHAR(255), lunar VARCHAR(255), kilometers VARCHAR(255), miles VARCHAR(255) )"; */

/* sql = "CREATE TABLE orbiting_body ( id_orbiting_body INTEGER PRIMARY KEY, name VARCHAR(255) )"; */

/* sql = "CREATE TABLE asteroid_chars ( id_asteroid INTEGER PRIMARY KEY references asteroid(id_asteroid), nasa_jpl_url VARCHAR(255), absolute_magnitude_h INTEGER, id_estimated_diameter INTEGER UNIQUE references estimated_diameter(id_estimated_diameter), is_potentially_hazardous_asteroid boolean, is_sentry_object boolean )"; */

/* sql = "CREATE TABLE estimated_diameter ( id_estimated_diameter INTEGER PRIMARY KEY, estimated_diameter_min_km INTEGER, estimated_diameter_max_km INTEGER, estimated_diameter_min_meters INTEGER, estimated_diameter_max_meters INTEGER, estimated_diameter_min_miles INTEGER, estimated_diameter_max_miles INTEGER, estimated_diameter_min_feet INTEGER, estimated_diameter_max_feet INTEGER )"; */

/* sql = "CREATE TABLE orbital_data ( id_asteroid INTEGER PRIMARY KEY references asteroid(id_asteroid), orbit_id VARCHAR(255), orbit_determination_date VARCHAR(255), first_observation_date VARCHAR(255), last_observation_date VARCHAR(255), data_arc_in_days INTEGER, observations_used INTEGER, orbit_uncertainty VARCHAR(255), minimum_orbit_intersection VARCHAR(255), jupiter_tisserand_invariant VARCHAR(255), epoch_osculation VARCHAR(255), eccentricity VARCHAR(255), semi_major_axis VARCHAR(255), inclination VARCHAR(255), ascending_node_longitude VARCHAR(255), orbital_period VARCHAR(255), perihelion_distance VARCHAR(255), perihelion_argument VARCHAR(255), aphelion_distance VARCHAR(255), perihelion_time VARCHAR(255), mean_anomaly VARCHAR(255), mean_motion VARCHAR(255), equinox VARCHAR(255) )"; */

/* sql = "INSERT INTO orbiting_body (name) VALUES ('Ceres')" */

/* db.run(sql); */

sql = /* 'SELECT * FROM estimated_diameter INNER JOIN asteroid_chars ON estimated_diameter.id_estimated_diameter = asteroid_chars.id_estimated_diameter INNER JOIN asteroid ON asteroid_chars.id_asteroid = asteroid.id_asteroid INNER JOIN orbit_class ON asteroid.id_orbit_class = orbit_class.id_orbit_class INNER JOIN orbital_data ON asteroid.id_asteroid = orbital_data.id_asteroid WHERE asteroid.id_asteroid = 1; */ 'SELECT * FROM close_approach_data INNER JOIN miss_distance ON close_approach_data.id_miss_distance = miss_distance.id_miss_distance INNER JOIN relative_velocity ON close_approach_data.id_relative_velocity = relative_velocity.id_relative_velocity WHERE close_approach_data.id_asteroid = 1';
db.all(sql, (err, rows) => {
    if (err) return console.error(err.message);
    
    console.log(rows)
    
});

