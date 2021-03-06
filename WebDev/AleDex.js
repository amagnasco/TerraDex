// AleDex
// Finds identified species for any given coordinates using the iNaturalist API

// PAGE SETUP
// generate loading messages
// generate buttons
// estimate location of user
    /* superseded by mapbox internal geolocation
    navigator.geolocation.getCurrentPosition(function(location){
        const user_lat = location.coords.latitude;
        const user_lng = location.coords.longitude;
        document.getElementById("user-location").innerText = `Your device is reporting its location as Lat: ${lat}, Lng: ${lng}`
    });
    */

// check if MapBox can render in this browser
// https://docs.mapbox.com/mapbox-gl-js/example/check-for-support/

// load map from MapBox
// https://docs.mapbox.com/mapbox-gl-js/example/drag-a-point/

	mapboxgl.accessToken = 'pk.eyJ1IjoiYW1hZ25hc2NvIiwiYSI6ImNsNjVqcTk1YjAzZzkzZHM3OXFoMTJqMzUifQ.O-oSk96QJMtHyMzQL80VyA';
    const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: [-24, 42], // starting center in [lng, lat]
    zoom: 1, // starting zoom
    projection: 'globe' // display map as a 3D 'globe'. can use 'naturalEarth' for 2d
    });
     
    map.on('style.load', () => {
    map.setFog({}); // Set the default atmosphere style
    });
     
    // Add a button for user to geolocate their device
    map.addControl(
        new mapboxgl.GeolocateControl({
        positionOptions: {
        enableHighAccuracy: true
        },
        // When active the map will receive updates to the device's location as it changes.
        trackUserLocation: true,
        // Draw an arrow next to the location dot to indicate which direction the device is heading.
        showUserHeading: true
        })
    );

    // Add text input box for user to search for location
    // https://docs.mapbox.com/mapbox-gl-js/example/mapbox-gl-geocoder/ 
    map.addControl(
        new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl
        })
    );

    // change map style 
    // https://docs.mapbox.com/mapbox-gl-js/example/setstyle/

// let user know page is ready to search

// USER INPUT VALIDATION
// listen for user input
// determine if input is valid, return error message otherwise
// determine if area is too large or will likely return too many results for API, return error message otherwise
// print valid input as coordinates and accuracy radius

// SEARCH
// Take the minimum id to start looking for
function recursiveGet(min_id, totalResults) {

    //Construct the url
    let url = `https://api.inaturalist.org/v1/observations?id_above=${min_id}&lat=${lat}&lng=${lng}&radius=${radius}&order=asc&order_by=id&per_page=200`

    // Get the data
    axios.get(url).then((rsp) => {
        // Concat the array returned in results to all results
        allResults = allResults.concat(rsp.data.results);
        console.log(allResults)
        console.log(rsp.data.results)
        // Wait so you don't timeout the API
        setTimeout(() => {
            // If the length of all the results is still less than the total, increment the minimum id and try again
            if (allResults.length < totalResults || typeof rsp.data.results === 'undefined') {
                recursiveGet((rsp.data.results[rsp.data.results.length - 1].id), totalResults);
            }else{
                // Otherwise, it's done!
                console.log('DONE!')
                processFullResults();
            }
        }, 100);
        console.log(url);
        console.log(`${totalResults - allResults.length} more needed!`)
        console.log(allResults)
    })
}

// Get the total number of results and the id of the first result
function getNumResults() {
    let url = `https://api.inaturalist.org/v1/observations?lat=${lat}&lng=${lng}8&radius=${radius}&order=asc&order_by=id&per_page=1`
    axios.get(url).then((rsp) => {
        let total = rsp.data.total_results;
        console.log(total)
        // Start off by looking at 1 less than the first id
        recursiveGet(+rsp.data.results[0].id - 1, total);
    })
}

//Start it all off
// getNumResults();

// GENERATE STATISTICS ON PAGE

// GENERATE RESULTS ON PAGE