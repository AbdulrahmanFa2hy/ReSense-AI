(function () {
  emailjs.init("TU70aafdCjvaCj-zl");
})();

var map = L.map("map", {
  center: [37.8, -96],
  zoom: 6,
  maxBounds: [
    [24.396308, -125.0],
    [49.384358, -66.93457],
  ],
  maxBoundsViscosity: 1.0,
  minZoom: 4,
  maxZoom: 9,
});

var baseMaps = {
  Streets: L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
  }),
  Imagery: L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    { maxZoom: 19 }
  ),
  Topographic: L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
    maxZoom: 17,
  }),
};

baseMaps["Streets"].addTo(map);

L.control.layers(baseMaps).addTo(map);

var drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

var drawControl = new L.Control.Draw({
  edit: {
    featureGroup: drawnItems,
  },
  draw: {
    polygon: true,
    rectangle: true,
    polyline: false,
    circle: true,
    circlemarker: false,
    marker: false,
  },
});
map.addControl(drawControl);

map.on(L.Draw.Event.CREATED, function (event) {
  var layer = event.layer;
  drawnItems.addLayer(layer);
  setTimeout(() => {
    document.getElementById("container").scrollIntoView({ behavior: "smooth" });
  }, 100);
});

function validateEmail(email) {
  var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validatePhoneNumber(phone) {
  var re = /^[0-9]+$/;
  return re.test(phone);
}

function sendData(method) {
  var email = document.getElementById("email").value;
  var countryCode = document.getElementById("countryCode").value;
  var phone = document.getElementById("phone").value;
  if (!validateEmail(email)) {
    Swal.fire("Error", "Please enter a valid email address.", "error");
    return;
  }
  if (!validatePhoneNumber(phone)) {
    Swal.fire("Error", "Please enter a valid phone number.", "error");
    return;
  }
  var crop = document.getElementById("crop").value;
  var data = drawnItems.toGeoJSON();
  var jsonData = JSON.stringify(data, null, 2);

  var subject = `GeoJSON Data for ${crop}`;
  var body = `User Email: ${email}\nUser Phone: ${countryCode}${phone}\n\nCrop Type: ${crop}\n\nGeoJSON Data:\n${jsonData}`;

  if (method === "email") {
    var templateParams = {
      email: email,
      countryCode: countryCode,
      phone: phone,
      subject: subject,
      crop: crop,
      geojsonData: jsonData,
    };

    emailjs.send("service_oe8h1cj", "template_sihy0xb", templateParams).then(
      function (response) {
        Swal.fire(
          "Request Sent",
          "You will receive a response via email within 24 hours.",
          "success"
        );
      },
      function (error) {
        Swal.fire("Error", "Failed to send the request via email.", "error");
      }
    );
  } else if (method === "whatsapp") {
    var phoneNumber = "+201009415688";
    var message = `User Email: ${email}\nUser Phone: ${countryCode} ${phone}\n\nCrop Type: ${crop}\n\nGeoJSON Data:\n${jsonData}`;
    window.open(
      `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(
        message
      )}`,
      "_blank"
    );
  }
}

const countryOptions = [
  { id: "+20", text: "Egypt (+20)" },
  { id: "+966", text: "Saudi Arabia (+966)" },
  { id: "+971", text: "United Arab Emirates (+971)" },
  { id: "+92", text: "Pakistan (+92)" },
  { id: "+90", text: "Turkey (+90)" },
  { id: "+62", text: "Indonesia (+62)" },
  { id: "+98", text: "Iran (+98)" },
  { id: "+60", text: "Malaysia (+60)" },
  { id: "+880", text: "Bangladesh (+880)" },
  { id: "+964", text: "Iraq (+964)" },
];

const countryCodeSelect = document.getElementById("countryCode");
countryOptions.forEach((option) => {
  const opt = document.createElement("option");
  opt.value = option.id;
  opt.text = option.text;
  countryCodeSelect.appendChild(opt);
});
countryCodeSelect.value = "+20"; // Default to Egypt

document.getElementById("sendEmail").onclick = function () {
  sendData("email");
};

document.getElementById("sendWhatsApp").onclick = function () {
  sendData("whatsapp");
};

map.on(L.Draw.Event.CREATED, function (event) {
  var layer = event.layer;
  drawnItems.addLayer(layer);
  setTimeout(() => {
    document.getElementById("container").scrollIntoView({ behavior: "smooth" });
  }, 100);
});
