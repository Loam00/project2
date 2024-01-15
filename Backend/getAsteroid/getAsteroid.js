const axios = require('axios');
const express = require('express');

const router = express.Router();

router.get('/getAsteroid', (req, res) => {
    let pages = [];
        for( let i= 0; i < 10; i++) {
            let url = `https://api.nasa.gov/neo/rest/v1/neo/browse?page=${i}&size=20&api_key=GC0tZMMjbn55gkfIHCtsavveulO8YlnDOlbdwdU5`;
            axios.get(url).then( (response) => {
                pages.length = i + 1; 
                pages[i] = response.data.near_earth_objects;
                /* console.log(pages[i])   */
                console.log(response.headers['x-ratelimit-remaining'])     
            }).catch( (err) => {
                res.status(500).json({ message: err });                
            })
        }
        res.status(201).json( {message: "Done"} ) 
})

module.exports = router;

