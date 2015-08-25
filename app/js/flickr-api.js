

(function (window, document){
  'use strict';
  function FlickrApi (){
    this.url = 'https://api.flickr.com/services/rest/';
    this.apiKey = '9ff95f55e313c5e7794bd0100c9a8ea3';
    this.galleyId = '5704-72157656838328615';
    this.apiUrl = '';
    this.method = 'flickr.galleries.getPhotos';
    this.extras = 'url_l,url_q,tags,description';
  };

  FlickrApi.prototype = {
    /**
     * @param {String} tag
     * @returns {JSON} pictures
     */
    getPictures : function (tag){

      var xmlHttp,
          url,
          promise,
          self;

      self = this;

      promise = new Promise( function (resolve, reject) {
        xmlHttp = new XMLHttpRequest();

        url = self.url + '?&method=' + self.method + '&api_key=' + self.apiKey + '&gallery_id=' + self.galleyId + '&extras=' + self.extras + '&format=json&nojsoncallback=1';

        xmlHttp.open("GET",url);

        xmlHttp.onload = function() {
          if (xmlHttp.status == 200) {
            resolve(xmlHttp.response);
          } else {
            reject(Error('Image didn\'t load successfully; error code:' + xmlHttp.statusText));
          }
        };
        xmlHttp.onerror = function () {
          reject(Error('There was a network error.'));
        };

        xmlHttp.send();
      });

      return promise;
    }
  }

  window.FlickrApi = FlickrApi;


}(window, document));
