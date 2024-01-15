export interface Asteroid {

    id_asteroid: string;
    neo_reference_id: string;
    name: string;
    name_limited: string;
    designation: string;
    nasa_jpl_url: string;
    absolute_magnitude_h: number;

    estimated_diameter_min_km: number;
    estimated_diameter_max_km: number;
    estimated_diameter_min_meters: number;
    estimated_diameter_max_meters: number;
    estimated_diameter_min_miles: number;
    estimated_diameter_max_miles: number;
    estimated_diameter_min_feet: number;
    estimated_diameter_max_feet: number;

    is_potentially_hazardous_asteroid: boolean;

    close_approaches: Array<CloseApproachData>

    orbit_id: string;
    orbit_determination_date: string;
    first_observation_date: string;
    last_observation_date: string;
    data_arc_in_days: number;
    observations_used: number;
    orbit_uncertainty: string;
    minimum_orbit_intersection: string;
    jupiter_tisserand_invariant: string;
    epoch_osculation: string;
    eccentricity: string;
    semi_major_axis: string;
    inclination: string;
    ascending_node_longitude: string;
    orbital_period: string;
    perihelion_distance: string;
    perihelion_argument: string;
    aphelion_distance: string;
    perihelion_time: string;
    mean_anomaly: string;
    mean_motion: string;
    equinox: string;

    id_orbit_class: number;
    orbit_class_type: string;
    orbit_class_description: string;
    orbit_class_range: string;

    is_sentry_object: boolean;

    displayAsteroid: boolean;
}

/* CLOSE APPROACH DATA INTERFACE */

interface CloseApproachData {

  id_close_approach: number;
  id_asteroid: number;

  close_approach_date: string;
  close_approach_date_full: string;
  epoch_date_close_approach: string;

  id_relative_velocity: number;
  kilometers_per_second: string;
  kilometers_per_hour: string;
  miles_per_hour: string;

  id_miss_distance: number;
  astronomical: string;
  lunar: string;
  kilometers: string;
  miles: string;

  id_orbiting_body: number;
  name: string;

}
