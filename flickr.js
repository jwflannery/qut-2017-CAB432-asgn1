var https = require('https')
var Flickr = require('node-flickr')
var config = require('./config.js');
var keys = {
  'api_key': config.FLICKR_KEY
}
flickr = new Flickr(keys)

function callFlickrAPI (model, callback) {
  console.log('Inside callFlickrAPI with Model = ' + model)

  flickr.get('photos.search', {
    'tags': model
  }, function (err, result) {
    if (err) return console.error(err)
    var address = parsePhotoRsp(result.photos)
    console.log(address)
    callback(address)
  })

  function parsePhotoRsp (rsp) {
    var s = ''
    photo = rsp.photo[0]
    console.log(photo)
    try {
      t_url = 'https://farm' + photo.farm + '.staticflickr.com/' +
                photo.server + '/' + photo.id + '_' + photo.secret +
                '_' + 'm.jpg' // "_" + "t.jpg";
      p_url = 'https://www.flickr.com/photos/' + photo.owner +
                '/' + photo.id
      s += '<a href="' + p_url + '">' + '<img alt="' +
                photo.title + '"src="' + t_url + '"/>' + '</a>'
      return s
    } catch (err) {
      return 'No Image'
    }
  }
}
exports.callFlickrAPI = callFlickrAPI
