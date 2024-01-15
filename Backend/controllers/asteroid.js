const Asteroid = require('../Models/Asteroid');

exports.getPages = async (req, res) => {
    try {

        const pages = await Asteroid.getPages()

        const output = Object.entries(pages);

        res.status(200).json(output[0][1])        
    } catch (err) {
        
    }
}

exports.getAsteroid = async (req, res) => {

    try {
        let last = req.params.init + 21;
        const allAsteroid = await Asteroid.getAsteroid(req.params.init);
        const allCloseApproachData = await Asteroid.getCloseApproachData(req.params.init, last);

        const asteorid = [];

        let begin = 0;

        for( let i = 0; i < allAsteroid.length; i++) {
            let length = 0;
            asteorid[i] = allAsteroid[i];
            let close_approaches_data = [];
            
            for ( let k = begin; k < allCloseApproachData.length; k++) {
                if( allCloseApproachData[k].id_asteroid == allAsteroid[i].id_asteroid ) {
                    close_approaches_data.push(allCloseApproachData[k]);
                    length++;
                } else if ( allCloseApproachData[k].id_asteroid == ( allAsteroid[i].id_asteroid + 1) ) {
                    begin = k;
                    break;
                }              
            }
            asteorid[i].close_approaches = [];

            for( let j = 0; j < length; j++) {
                asteorid[i].close_approaches.push(close_approaches_data[j])                
            }

            /* console.log(asteorid[i]) */
        }

        

        console.log("sono qui")

        res.status(200).json(asteorid);
    } catch (err) {
        
    }
}

exports.postAsteroid = async (req, res) => {

    /* console.log(req.body.object) */
    
    /* DEFINE ASTEROID TABLE */

    const neo_reference_id = req.body.object.neo_reference_id;
    const name = req.body.object.name;
    const name_limited = req.body.object.name_limited;
    const designation = req.body.object.designation;
    const orbit_class_type = req.body.object.orbital_data.orbit_class.orbit_class_type;
    let id_orbit_class;

    if( orbit_class_type == "AMO" ) {
        id_orbit_class = 1;
    } else if ( orbit_class_type == "APO" ) {
        id_orbit_class = 2;
    } else if ( orbit_class_type == "ATE" ) {
        id_orbit_class = 3;
    } else if ( orbit_class_type == "IEO" ) {
        id_orbit_class = 4;
    }

    /* DEFINE ESTIMATED DIAMETER TABLE */

    const estimated_diameter_min_km = req.body.object.estimated_diameter.kilometers.estimated_diameter_min;
    const estimated_diameter_max_km = req.body.object.estimated_diameter.kilometers.estimated_diameter_max;
    const estimated_diameter_min_meters = req.body.object.estimated_diameter.meters.estimated_diameter_min;
    const estimated_diameter_max_meters = req.body.object.estimated_diameter.meters.estimated_diameter_max;
    const estimated_diameter_min_miles = req.body.object.estimated_diameter.miles.estimated_diameter_min;
    const estimated_diameter_max_miles = req.body.object.estimated_diameter.miles.estimated_diameter_max;
    const estimated_diameter_min_feet = req.body.object.estimated_diameter.feet.estimated_diameter_min;
    const estimated_diameter_max_feet = req.body.object.estimated_diameter.feet.estimated_diameter_max;

    /* DEFINE ASTEROID CHARS TABLE */

    const nasa_jpl_url = req.body.object.nasa_jpl_url;
    const absolute_magnitude_h = req.body.object.absolute_magnitude_h;
    const is_potentially_hazardous_asteroid = req.body.object.is_potentially_hazardous_asteroid;
    const is_sentry_object = req.body.object.is_sentry_object;

    /* DEFINE ORBITAL DATA TABLE */

    const orbit_id = req.body.object.orbital_data.orbit_id;
    const orbit_determination_date = req.body.object.orbital_data.orbit_determination_date;
    const first_observation_date = req.body.object.orbital_data.first_observation_date;
    const last_observation_date = req.body.object.orbital_data.last_observation_date;
    const data_arc_in_days = req.body.object.orbital_data.data_arc_in_days;
    const observations_used = req.body.object.orbital_data.observations_used;
    const orbit_uncertainty = req.body.object.orbital_data.orbit_uncertainty;
    const minimum_orbit_intersection = req.body.object.orbital_data.minimum_orbit_intersection;
    const jupiter_tisserand_invariant = req.body.object.orbital_data.jupiter_tisserand_invariant;
    const epoch_osculation = req.body.object.orbital_data.epoch_osculation;
    const eccentricity = req.body.object.orbital_data.eccentricity;
    const semi_major_axis = req.body.object.orbital_data.semi_major_axis;
    const inclination = req.body.object.orbital_data.inclination;
    const ascending_node_longitude = req.body.object.orbital_data.ascending_node_longitude;
    const orbital_period = req.body.object.orbital_data.orbital_period;
    const perihelion_distance = req.body.object.orbital_data.perihelion_distance;
    const perihelion_argument = req.body.object.orbital_data.perihelion_argument;
    const aphelion_distance = req.body.object.orbital_data.aphelion_distance;
    const perihelion_time = req.body.object.orbital_data.perihelion_time;
    const mean_anomaly = req.body.object.orbital_data.mean_anomaly;
    const mean_motion = req.body.object.orbital_data.mean_motion;
    const equinox = req.body.object.orbital_data.equinox;

    /* DEFINE CLOSE APPROACHES */

    /* let close_approach_data = [];

    for(let i = 0; i < req.body.object.close_approach_data.length; i++) {
        close_approach_data[i].close_approach_date = req.body.object.close_approach_data[i].close_approach_date;
        close_approach_data[i].close_approach_date_full = req.body.object.close_approach_data[i].close_approach_date_full;
        close_approach_data[i].epoch_date_close_approach = req.body.object.close_approach_data[i].epoch_date_close_approach;
        close_approach_data[i].relative_velocity = req.body.object.close_approach_data[i].relative_velocity;
        close_approach_data[i].miss_distance = req.body.object.close_approach_data[i].miss_distance;
        close_approach_data[i].orbiting_body = req.body.object.close_approach_data[i].orbiting_body; 
    } */

    const close_approach_data = req.body.object.close_approach_data;

    try {
        const asteroid_table = {
            neo_reference_id: neo_reference_id,
            name: name,
            name_limited: name_limited,
            designation: designation,
            id_orbit_class: id_orbit_class,
            nasa_jpl_url: nasa_jpl_url,
            absolute_magnitude_h: absolute_magnitude_h,
            is_potentially_hazardous_asteroid: is_potentially_hazardous_asteroid,
            is_sentry_object: is_sentry_object
        }

        const estimated_diameter = {
            estimated_diameter_min_km: estimated_diameter_min_km,
            estimated_diameter_max_km: estimated_diameter_max_km,
            estimated_diameter_min_meters: estimated_diameter_min_meters,
            estimated_diameter_max_meters: estimated_diameter_max_meters,
            estimated_diameter_min_miles: estimated_diameter_min_miles,
            estimated_diameter_max_miles: estimated_diameter_max_miles,
            estimated_diameter_min_feet: estimated_diameter_min_feet,
            estimated_diameter_max_feet: estimated_diameter_max_feet,                        
        }

        const orbital_data = {
            orbit_id: orbit_id,
            orbit_determination_date: orbit_determination_date,
            first_observation_date: first_observation_date,
            last_observation_date: last_observation_date,
            data_arc_in_days: data_arc_in_days,
            observations_used: observations_used,
            orbit_uncertainty: orbit_uncertainty,
            minimum_orbit_intersection: minimum_orbit_intersection,
            jupiter_tisserand_invariant: jupiter_tisserand_invariant,
            epoch_osculation: epoch_osculation,
            eccentricity: eccentricity,
            semi_major_axis: semi_major_axis,
            inclination: inclination,
            ascending_node_longitude: ascending_node_longitude,
            orbital_period: orbital_period,
            perihelion_distance: perihelion_distance,
            perihelion_argument: perihelion_argument,
            aphelion_distance: aphelion_distance,
            perihelion_time: perihelion_time,
            mean_anomaly: mean_anomaly,
            mean_motion: mean_motion,
            equinox: equinox
        }

        const asteroid = await Asteroid.postAsteroid(asteroid_table, estimated_diameter, orbital_data, close_approach_data);

        res.status(201).json({ message: 'Posted!'})
    } catch (error) {
        
    }
}