var express = require('express')
var https = require('https') // Needed to perform adbs API call.
var flickr = require('../flickr.js') // Needed to create ajax route
var router = express.Router()
var app = express()

// These three functions build dictionaries with key = parameter name and value = number of occurrences in aircraft list.

function getManufacturers (aircraft) {
  var manufacturers = {}
  for (var i = 0; i < aircraft.length; i++) {
    if (!manufacturers.hasOwnProperty(aircraft[i].Man)) {
      manufacturers[aircraft[i].Man] = 1
    } else {
      manufacturers[aircraft[i].Man]++
    }
  }
  delete manufacturers['undefined']
  return manufacturers
}

function getCountries (aircraft) {
  var countries = {}
  for (var i = 0; i < aircraft.length; i++) {
    if (!countries.hasOwnProperty(aircraft[i].Cou)) {
      countries[aircraft[i].Cou] = 1
    } else {
      countries[aircraft[i].Cou]++
    }
  }
  delete countries['undefined']
  return countries
}

function getOperators (aircraft) {
  var operators = {}
  for (var i = 0; i < aircraft.length; i++) {
    if (!operators.hasOwnProperty(aircraft[i].Op)) {
      operators[aircraft[i].Op] = 1
    } else {
      operators[aircraft[i].Op]++
    }
  }
  delete operators['undefined']
  return operators
}

/* GET home page. */
router.get('/', function (req, res) {
    // Pulls the aircraft list from the ADBS api, filters it, builds the arrays, filters again, and passes to frontend through EJS.
  adbsPromise.then(function (result) {
    var aircraft = result.acList.filter(ac => (ac.Lat != null && ac.Long != null))
    var manufacturers = getManufacturers(aircraft)
    var countries = getCountries(aircraft)
    var operators = getOperators(aircraft)

    if (req.query.Manufacturer != null) { var aircraft = aircraft.filter(ac => req.query.Manufacturer.includes(ac.Man)) }
    if (req.query.Country != null) { var aircraft = aircraft.filter(ac => req.query.Country.includes(ac.Cou)) }
    if (req.query.Operator != null) { var aircraft = aircraft.filter(ac => req.query.Operator.includes(ac.Op)) }

    res.render('index', {
      manufacturers: manufacturers,
      countries: countries,
      operators: operators,
      result: aircraft
    })
  })
})

// Make a call to the Flickr API upon GET request. To be called from the marker click event defined in 'maps.js'.
router.get('/images/:par', function (req, res, next) {
  console.log(req.params.par)
  flickFunction(req.params.par, function (result) {
    console.log('Sending result back to map: ' + result)
    res.send(result)
  })
})

// Flickr function is defined separately for readability.
var flickFunction = function (query, callback) {
  console.log('\nAbout to resolve flickr promise with query:' + query)
  flickr.callFlickrAPI(query, callback)
}

// Make a call to the adbs API and return results as a JSON object.
var adbsPromise = new Promise(function callAdbs (resolve, reject) {
  console.log('Calling adbs')
  var adsbOptions = {
    host: 'public-api.adsbexchange.com',
    path: '/VirtualRadar/AircraftList.json',
    method: 'GET'
  }

  var adsbReq = https.request(adsbOptions, function (adsbRes) {
    var body = []
    adsbRes.on('data', function (chunk) {
      body.push(chunk)
    })
    adsbRes.on('end', function () {
      var bodyString = body.join('')
      var adsbRsp = JSON.parse(bodyString)
      resolve(adsbRsp)
    })
  })
  adsbReq.end()
})

module.exports = router
