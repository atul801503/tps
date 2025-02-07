


maptilersdk.config.apiKey = mapToken;
console.log(mapToken);
const map = new maptilersdk.Map({
  container: 'map', // container's id or the HTML element to render the map
  style: maptilersdk.MapStyle.STREETS,
  center: listing.geometry.coordinates, // starting position [lng, lat]
  zoom: 9, // starting zoom
});
console.log(listing.geometry.coordinates)

customMarker = document.createElement('div');
customMarker.className = 'custom-marker';
customMarker.style.backgroundImage = 'url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWJRtRzvfF4kP9vVqSxM24bVvZyLAgUNItZA&s)'; // path to your custom icon
customMarker.style.width = '50px'; // set the width of your icon
customMarker.style.height = '50px'; // set the height of your icon
customMarker.style.backgroundSize = "100%";

const marker = new maptilersdk.Marker({color:"red"})
  .setLngLat(listing.geometry.coordinates)
  .setPopup(new maptilersdk.Popup().setHTML(`<h4>${listing.title}</h4> <p>Exact location will be provided after booking</p><h5>${listing.location}</h5>`))
  .addTo(map);