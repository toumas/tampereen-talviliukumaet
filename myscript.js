var json_obj;
var map;
var infowindow;
var markers = [];
var markerButtons = [];
var showAll = false;

$(function() {
    $(".close").click(function() {
        $(".warning").slideUp();
    });
});

function initMap() {
    requestXMLHttp();
    var tampere = {
        lat: 61.6274106,
        lng: 23.5501276
    };
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 11,
        center: tampere
    });

    google.maps.event.addListener(map, 'bounds_changed', function() {

        for (var i = 0; i < json_obj.features.length; i++) {
            var myPos = {
                lat: json_obj.features[i].geometry.coordinates[1],
                lng: json_obj.features[i].geometry.coordinates[0]
            };

            if (map.getBounds().contains(markers[i].getPosition())) {
                //writeInList(markers[i]);
                markerButtons[markers[i].id].removeClass("hidden");
                markerButtons[markers[i].id].removeClass("out-of-bounds");
            } else {
                if (!showAll) {
                    markerButtons[markers[i].id].addClass("hidden");
                }
                markerButtons[markers[i].id].addClass("out-of-bounds");
            }
        }


    });
    var button = $('<button id="showAll" type="button" class="flex-item" style="order:' + json_obj.features.length + '">Show all</button>');
    button.click(function() {
        showAllMarkers();
    });
    $("#flex-container").append(button);

    infowindow = new google.maps.InfoWindow({});
    var bounds = new google.maps.LatLngBounds();
    placeMarkers(bounds);
    map.fitBounds(bounds);
}

function placeMarkers(bounds) {


    for (var i = 0; i < json_obj.features.length; i++) {
        var myPos = {
            lat: json_obj.features[i].geometry.coordinates[1],
            lng: json_obj.features[i].geometry.coordinates[0]
        };

        var marker = new google.maps.Marker({
            position: myPos,
            map: map,
            title: json_obj.features[i].properties.ALUE_NIMI,
            id: i
        });

        markers.push(marker);

        bounds.extend(marker.getPosition());

        attachClickListener(marker);
        writeInList(marker);
    }
}

function showAllMarkers() {
    showAll = !showAll;
    if (showAll == true) {
        $("#showAll").html('Show less');
    } else {
        $("#showAll").html('Show all');
    }

    for (var i = 0; i < markerButtons.length; i++) {
        if (showAll == true) {
            markerButtons[i].removeClass("hidden");
        } else {
            if (markerButtons[i].hasClass("out-of-bounds")) {
                markerButtons[i].addClass("hidden");
            }

        }
    }
}

function attachClickListener(marker) {
    marker.addListener('click', function() {
        infowindow.setContent('<a>' + (this.id + 1) + '. ' +
            toTitleCase(json_obj.features[this.id].properties.ALUE_NIMI) +
            ', ' + toTitleCase(json_obj.features[this.id].properties.KAUPUNGINOSA) +
            '</a><br><img src="http://placehold.it/200x165" alt="Placeholder text">');
        infowindow.open(marker.get('map'), marker);
    });
}

function writeInList(marker) {
    var flexItem = $("<div id=" + marker.id + " class='flex-item hidden out-of-bounds'>" +
        '<a href="#map">' + (marker.id + 1) + '. ' +
        toTitleCase(json_obj.features[marker.id].properties.ALUE_NIMI) +
        ', ' + toTitleCase(json_obj.features[marker.id].properties.KAUPUNGINOSA) +
        '</a>' +
        "</div>");

    $(flexItem).click(function() {
        var marker = markers[flexItem.attr('id')];
        map.panTo(marker.getPosition());
        map.setZoom(14);
    });

    $("#flex-container").append(flexItem);

    markerButtons.push(flexItem);
}

function toTitleCase(str) {
    var str2 = str.replace("(", " (");
    return str2.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

function requestXMLHttp() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://opendata.navici.com/tampere/opendata/ows?service=WFS&version=2.0.0&request=GetFeature&typeName=opendata:WFS_TALVILIUKUPAIKKA_MVIEW&outputFormat=json&srsName=EPSG:4326", false);
    xhr.send();
    console.log(xhr.status);
    console.log(xhr.statusText);
    if (xhr.readyState == 4 && xhr.status == 200) {
        var json = xhr.response;
        json_obj = JSON.parse(json);

    }
}