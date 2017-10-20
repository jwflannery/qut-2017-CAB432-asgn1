markers = []

// Once markers are initialized, add onClick events to each of them.
// Click event creates an infoWindow (popup) and populates with relevant data
// Content includes the parsed results of a call to the server Flickr request, to be displayed as an image.
function setMarkerEvents (markers, infoWindow, map, acList) {
  markers.map(function (marker, i) {
    marker.addListener('click', function () {
      var id = marker.get('id')
      var model = acList[id].Mdl
      var from = (acList[id].From || false)
      var to = (acList[id].To || false)
      var altitude = (acList[id].Alt || false)
      var callSign = (acList[id].Call || false)
      console.log('Calling ajax, model = ' + model)
      $.get('/images/' + model.replace(/ /g, '_').replace('/', ''), function (flickrRsp) {
        console.log('maps.js response: ' + flickrRsp)
        var contentString = ''
        contentString += '<b>Model:</b> ' + model + '<br>'
        contentString += (callSign ? '<b>Call Sign:</b> ' + callSign + '<br>' : '')
        contentString += (from ? '<b>From: </b>' + from + '<br>' : '')
        contentString += (to ? '<b>To: </b>' + to + '<br>' : '')
        contentString += (altitude ? '<b>Altitude: </b>' + altitude + '<br>' : '')
        contentString += flickrRsp
        infoWindow.setOptions({
          content: contentString
        })
        infoWindow.open(map, marker)
      })
    })
  })
}

// Initialize markers iteratively, with position pulled from acList.
function initMarkers (acList) {
  console.log('Initializing markers')
  markers = []
  for (var i = 0; i < acList.length; i++) {
    if (acList[i].Lat != null && acList[i].Long != null) {
      markers.push(
                new google.maps.Marker({
                  position: {
                    lat: acList[i].Lat,
                    lng: acList[i].Long
                  },
                  map: map,
                  id: i
                })
            )
    }
  }
  setMarkerEvents(markers, infoWindow, map, acList)
}

// Called when a checkbox is clicked on the front end. Creates a filtered version of the aircraft list, based on parameters selected.
function filterMap () {
  try {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null)
    }
  } catch (err) {
    console.log(err)
  }

    // Get checked parameter values using jQuery.
  var checkedManufacturers = $("input[name='Manufacturer']:checked").get()
  var checkedCountries = $("input[name='Country']:checked").get()
  var checkedOperators = $("input[name='Operator']:checked").get()

  manFilters = []
  checkedManufacturers.map(function (ID) {
    manFilters.push(ID.value)
  })
  couFilters = []
  checkedCountries.map(function (ID) {
    couFilters.push(ID.value)
  })
  opFilters = []
  checkedOperators.map(function (ID) {
    opFilters.push(ID.value)
  })

    // If there are any parameters in a category, filter the acList with them.
  var filteredList = rawAcList
  if (manFilters.length > 0) {
    filteredList = filteredList.filter(ac => manFilters.includes(ac.Man))
  }
  if (couFilters.length > 0) {
    filteredList = filteredList.filter(ac => couFilters.includes(ac.Cou))
  }
  if (opFilters.length > 0) {
    filteredList = filteredList.filter(ac => opFilters.includes(ac.Op))
  }
  console.log(filteredList)
  initMarkers(filteredList) // Once list is filtered, reset markers to show only those aircraft.
}

function initMap (acList) {
  var uluru = {
    lat: -25.363,
    lng: 131.044
  }
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: uluru
  })

    // Need to create infoWindow globally, so that it can be moved when different markers are clicked.
  infoWindow = new google.maps.InfoWindow({
    map: map
  })

  initMarkers(acList)
  console.log('Map Loaded.')
}

// When page is loaded, call google maps API with parameters provided by the initMap function.
google.maps.event.addDomListener(window, 'load', initMap(rawAcList))
