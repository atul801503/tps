

	// TO MAKE THE MAP APPEAR YOU MUST
	// ADD YOUR ACCESS TOKEN FROM
	// https://account.mapbox.com
	mapboxgl.accessToken =  mapToken;
    
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        style: "mapbox://styles/mapbox/satellite-streets-v12",

        center: listing.geometry.coordinates, // starting position [lng, lat]
        zoom: 15.1, // starting zoom
        // pitch: 62, // starting pitch
        // bearing: -20 // starting bearing
    });


   

    const marker = new mapboxgl.Marker({ color: "red"})
    .setLngLat(listing.geometry.coordinates) // Listing.geometry.coordinates //
    .setPopup
    (new mapboxgl.Popup({offset: 25}).setHTML(
        `<h4>${listing.location}</h4><p>Exact Location provided after booking</p>`
    )
    )
    .addTo(map);
  