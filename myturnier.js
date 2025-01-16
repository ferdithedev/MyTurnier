const url = document.URL
const mytt = url.includes('mytischtennis.de')
const clicktt = url.includes('click-tt.de')

if (mytt) {
    verband = url.split('/')
    verband = verband[verband.length - 3].toUpperCase()
} else if (clicktt) {
    verband = url.split('.')[0].split('//')[1].toUpperCase()

}

lonlat = {
    DTTB: [51, 10.5, 5], OHNE: [51, 10.5, 5], BATTV: [48, 8.3080, 7], BYTTV: [48, 12, 6], TTVB: [52.25, 12.33, 7], FTTB: [53.08, 8.81, 9], HATTV: [53.55, 10, 8], HETTV: [50.61, 9.03, 7], TTVMV: [53.77, 12.58, 7],
    TTVN: [52.64, 9, 7], PTTV: [49.95, 7.31, 7], RTTVR: [49.85, 8.03, 7], STTB: [49.38, 6.95, 8], TTVSA: [52, 11.7, 7], TTTV: [50.90, 11.04, 7], WTTV: [51.96, 7.64, 7], TTBW: [48.76, 8.24, 7]
}

function buildTableDataClickTT() {
    const tbody = document.querySelector("table.result-set").getElementsByTagName("tbody")[0];
    var rows = Array.from(tbody.getElementsByTagName("tr"))
    rows.shift()

    result = []

    rows.forEach((row) => {
        values = row.getElementsByTagName("td")

        tournament = {
            date: values[0].innerText,
            name: values[1].innerText,
            link: values[1].getElementsByTagName("a")[0].getAttribute("href")
        }

        loc = { name: values[2].innerText, lon: 0, lat: 0, tournaments: [] }

        tournaments = []

        var found = false
        result.forEach((currentLoc) => {
            if (currentLoc.name == loc.name) {
                currentLoc.tournaments.push(tournament)
                found = true
            }
        })

        if (!found && loc.name) {
            loc.tournaments.push(tournament)
            result.push(loc)
        }
    });

    return result
}

function buildTableDataMyTT() {
    const tbody = document.getElementsByClassName("table table-mytt table-striped table-bordered table-mini-xs table-mini-sm table-mini-md")[0].getElementsByTagName("tbody")[0]
    var rows = Array.from(tbody.getElementsByTagName("tr"))

    // Abgesagte Spiele entfernen
    rows = rows.filter((row) => row.getElementsByTagName("td")[0].getElementsByClassName("label label-danger")[0] === undefined)

    result = []
    rows.forEach((row) => {
        values = row.getElementsByTagName("td")

        tournament = {
            date: values[0].innerText + " " + values[1].innerText,
            name: values[2].getElementsByTagName("strong")[0].getElementsByTagName("a")[0].innerText,
            link: values[2].getElementsByTagName("strong")[0].getElementsByTagName("a")[0].getAttribute("href")
        }

        loc = { name: values[3].innerText, lon: 0, lat: 0, tournaments: [] }

        tournaments = []

        var found = false
        result.forEach((currentLoc) => {
            if (currentLoc.name == loc.name) {
                currentLoc.tournaments.push(tournament)
                found = true
            }
        })

        if (!found && loc.name) {
            loc.tournaments.push(tournament)
            result.push(loc)
        }

    })

    return result;
}

const extDiv = document.createElement("div");
extDiv.setAttribute('id', 'extension');
extDiv.style.border = "2px solid black";



const mapDiv = document.createElement("div");
mapDiv.setAttribute('id', 'map')


if (mytt) {

    extDiv.style.width = document.getElementById("left-col").style.width
    extDiv.style.height = "70vh"

    document.getElementById("left-col").appendChild(extDiv);

    locs = buildTableDataMyTT()

    mapDiv.style.width = document.getElementById("left-col").style.width
    mapDiv.style.height = "60vh"



} else if (clicktt) {

    extDiv.style.width = "25vw"
    extDiv.style.height = "50vh"

    extDiv.style.position = "absolute"
    extDiv.style.left = "45vw"
    extDiv.style.top = "20vh"

    document.getElementById("content-row2").appendChild(extDiv);

    locs = buildTableDataClickTT()

    mapDiv.style.width = "25vw"
    mapDiv.style.height = "45vh"

}

document.getElementById("extension").appendChild(mapDiv);

// Settings
// Nur Races, Keine Races, Turniere, die vom Verband organisert werden

const noVerband = document.createElement("input")
noVerband.setAttribute('type', 'checkbox')
noVerband.setAttribute('id', 'noVerband')
noVerband.setAttribute('checked', 'true')
const noVerbandLabel = document.createElement("label")
noVerbandLabel.setAttribute('for', 'noVerband')
noVerbandLabel.innerText = "Keine vom Verband organisierten Turniere"

document.getElementById("extension").appendChild(noVerband);
document.getElementById("extension").appendChild(noVerbandLabel);

const race = document.createElement("input")
if (mytt) {

    document.getElementById("extension").appendChild(document.createElement("br"))


    race.setAttribute('type', 'checkbox')
    race.setAttribute('id', 'races')
    const raceLabel = document.createElement("label")
    raceLabel.setAttribute('for', 'races')
    raceLabel.innerText = "Nur Races"

    document.getElementById("extension").appendChild(race);
    document.getElementById("extension").appendChild(raceLabel);

    document.getElementById("extension").appendChild(document.createElement("br"))

    const norace = document.createElement("input")
    norace.setAttribute('type', 'checkbox')
    norace.setAttribute('id', 'noraces')
    const noraceLabel = document.createElement("label")
    noraceLabel.setAttribute('for', 'noraces')
    noraceLabel.innerText = "Keine Races"

    document.getElementById("extension").appendChild(norace);
    document.getElementById("extension").appendChild(noraceLabel);

    // Events

    race.addEventListener("change", () => {
        if (race.checked) {
            norace.checked = false;
            noVerband.checked = false;
        }
        updateMarkers()
    })

    norace.addEventListener("change", () => {
        if (norace.checked) {
            race.checked = false;
        }
        updateMarkers()
    })
}

noVerband.addEventListener("change", () => {
    if (noVerband.checked && mytt) race.checked = false;
    updateMarkers()
})

// Make list

var map = L.map('map').setView([lonlat[verband][0], [lonlat[verband][1]]], lonlat[verband][2]);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);


addCoords()

// Adds markers


var markerGroup = L.layerGroup().addTo(map)
function locationMarker(loc) {

    var marker = L.marker([loc.lon, loc.lat]).addTo(markerGroup);

    popupText = ""

    // Settings
    noRaces = mytt ? document.getElementById("noraces").checked : false
    justRaces = mytt ? document.getElementById("races").checked : false
    noChampionships = document.getElementById("noVerband").checked

    loc.tournaments.forEach((t) => {
        if ((!noRaces || !t.name.includes('Race')) &&
            (!justRaces || t.name.includes('Race')) &&
            (!noChampionships || (!t.name.toLowerCase().includes('verband') && !t.name.toLowerCase().includes('individualmeisterschaft') && !t.name.toLowerCase().includes('ranglisten')))) {

            popupText = popupText + "<a href=\"" + t.link + "\">" + t.name + "</a><br><p style=\"margin: 0 0 0 0;\">" + t.date + "</p></br>"

        }
    })

    if (popupText) {
        popupText = "<h3 style=\"margin: 0 0 0 0;\">" + loc.name + "</h3></br>" + popupText
        marker.bindPopup(popupText)
    } else marker.remove()

}

function updateMarkers() {
    if (coordsLoaded) {
        markerGroup.clearLayers()

        locs.forEach((loc) => {
            locationMarker(loc)
        })

    }
}

var coordsLoaded = false;
function addCoords(index) {
    if (index === undefined) index = 0;
    loc = locs[index]

    locName = loc.name.replace('/', ' ').replace('OT', '').split('|')[0]

    fetch('https://photon.komoot.io/api/?q=' + locName + ", Germany") // + '&limit=1&lat=' + lonlat[verband][0] + '&lon=' + lonlat[verband][1]
        .then(response => response.json())
        .then(data => {
            if (data.features !== undefined && data.features[0] !== undefined) {

                loc.lon = data.features[0].geometry.coordinates[1]
                loc.lat = data.features[0].geometry.coordinates[0]

                locationMarker(loc)
            }

            if (index + 1 < locs.length) {
                setTimeout(function () { addCoords(index + 1) }, 1000)
            } else {
                coordsLoaded = true;
            }
        })

}
