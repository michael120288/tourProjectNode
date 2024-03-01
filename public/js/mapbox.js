/* eslint-disable */
// const locations = JSON.parse(document.getElementById('map').dataset.locations);
// console.log(locations);

export const displayMap = (locations) => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoibWljaGFlbDEyMDI4OCIsImEiOiJjbHA3b3E0cnUxeWM2Mm1xdmJjMDVwcHp2In0.ANyHZ36G_sraladH8HQB_Q';

  const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/michael120288/clp7px17v00g601r6ggwo0b64', // style URL
    center: [-74.5, 40], // starting position [lng, lat]
    zoom: 9, // starting zoom
    scrollZoom: false,
  });

  const bounds = new mapboxgl.LngLatBounds();
  locations.forEach((loc) => {
    // Create marker
    const el = document.createElement('div');
    el.className = 'marker';

    // Add marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    // Add popup
    new mapboxgl.Popup({
      offset: 30,
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    // Extend map bounds to include current location
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 100,
      left: 100,
      right: 100,
    },
  });
};
