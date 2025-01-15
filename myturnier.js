const url = document.URL

if (url.includes('mytischtennis.de')) {
    verband = url.split('/')
    verband = verband[verband.length - 3].toUpperCase()
} else if (url.includes('click-tt.de')) {
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

    result = new Map()

    rows.forEach((row) => {
        values = row.getElementsByTagName("td")

        tournament = {
            date: values[0].innerText,
            name: values[1].innerText,
            link: values[1].getElementsByTagName("a")[0].getAttribute("href")
        }

        region = values[2].innerText

        list = []
        if (result.has(region)) {
            list = result.get(region)
        }
        if (region) {
            list.push(tournament)
            result.set(region, list)
        }
    });

    return result
}

function buildTableDataMyTT() {
    const tbody = document.getElementsByClassName("table table-mytt table-striped table-bordered table-mini-xs table-mini-sm table-mini-md")[0].getElementsByTagName("tbody")[0]
    var rows = Array.from(tbody.getElementsByTagName("tr"))

    rows = rows.filter((row) => row.getElementsByTagName("td")[0].getElementsByClassName("label label-danger")[0] === undefined)

    result = new Map()
    rows.forEach((row) => {
        values = row.getElementsByTagName("td")

        tournament = {
            date: values[0].innerText + " " + values[1].innerText,
            name: values[2].getElementsByTagName("strong")[0].getElementsByTagName("a")[0].innerText,
            link: values[2].getElementsByTagName("strong")[0].getElementsByTagName("a")[0].getAttribute("href")
        }

        region = values[3].innerText

        list = []
        if (result.has(region)) {
            list = result.get(region)
        }
        if (region) {
            list.push(tournament)
            result.set(region, list)
        }

    })

    return result;
}

const extDiv = document.createElement("div");
extDiv.setAttribute('id', 'extension');
extDiv.style.border = "2px solid black";



const mapDiv = document.createElement("div");
mapDiv.setAttribute('id', 'map')
mapDiv.style.border = "1px solid black"

if (url.includes("mytischtennis.de")) {

    extDiv.style.width = document.getElementById("left-col").style.width
    extDiv.style.height = "70vh"

    document.getElementById("left-col").appendChild(extDiv);

    map = buildTableDataMyTT()

    mapDiv.style.width = document.getElementById("left-col").style.width
    mapDiv.style.height = "60vh"

} else if (url.includes("click-tt.de")) {

    extDiv.style.width = document.getElementById("content-row2").style.width
    extDiv.style.height = "55vh"

    document.getElementById("left-col").appendChild(extDiv);

    map = buildTableDataClickTT()

    mapDiv.style.position = "absolute"
    mapDiv.style.left = "45vw"
    mapDiv.style.top = "20vh"
    mapDiv.style.width = "25vw"
    mapDiv.style.height = "45vh"

}

document.getElementById("extension").appendChild(mapDiv);

regions = map.entries().toArray()

var map = L.map('map').setView([lonlat[verband][0], [lonlat[verband][1]]], lonlat[verband][2]);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

function addNextRegion(regions, index) {
    r = regions[index]
    region = r[0]
    region = region.replace('/', ' ')
    region = region.replace('OT', '')
    region = region.split('|')[0]
    tournaments = r[1]

    fetch('https://photon.komoot.io/api/?q=' + region + ", Germany" + '&limit=1&lat=' + lonlat[verband][0] + '&lon=' + lonlat[verband][1])
        .then(response => response.json())
        .then(data => {
            if (data.features !== undefined && data.features[0] !== undefined) {
                var marker = L.marker([data.features[0].geometry.coordinates[1], data.features[0].geometry.coordinates[0]]).addTo(map);

                popupText = ""

                tournaments.forEach((t) => {

                    popupText = popupText + "<a href=\"" + t.link + "\">" + t.name + "</a><br><p style=\"margin: 0 0 0 0;\">" + t.date + "</p></br>"
                })

                marker.bindPopup(popupText)


            }

            if (index + 1 < regions.length) setTimeout(function () { addNextRegion(regions, index + 1) }, 1000)
        })

}

addNextRegion(regions, 0)


