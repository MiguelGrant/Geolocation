const btn = document.getElementById("getLocationBtn");
const output = document.getElementById("output");
let marker; // marker variable for reuse

// Initialize map on page load - centered on Philippines with restricted bounds
const map = L.map("map", {
  center: [12.8797, 121.7740],
  zoom: 6,
  minZoom: 5,
  maxBounds: [
    [4.5, 116.0],  // Southwest corner
    [21.0, 127.0]  // Northeast corner
  ],
  maxBoundsViscosity: 1.0
});

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
}).addTo(map);

btn.addEventListener("click", () => {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log("Latitude:", latitude);
        console.log("Longitude:", longitude);

        output.innerHTML = `
          ✅ <strong>Location retrieved!</strong><br>
          Latitude: ${latitude.toFixed(6)}<br>
          Longitude: ${longitude.toFixed(6)}
        `;

        // Zoom to location with animation
        map.flyTo([latitude, longitude], 15, {
          duration: 2, // 2 seconds animation
        });

        // Update or create marker
        if (marker) {
          marker.setLatLng([latitude, longitude]);
        } else {
          marker = L.marker([latitude, longitude])
            .addTo(map)
            .bindPopup("📍 You are here")
            .openPopup();
        }
      },
      (error) => {
        console.error("Error getting location:", error);
        output.innerHTML = "❌ Unable to retrieve your location.";
      }
    );
  } else {
    output.innerHTML = "⚠️ Geolocation is not supported by your browser.";
  }
});
