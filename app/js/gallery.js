(function (window, document){
  'use strict';

  function Gallery (container){
    this.pictures = [];
    this.flickrPictures = [];
    this.itemPerPage = 15;
    this.container = document.getElementById(container);
    this.currentIndex = 0;
    this.currentPage = 0;
    this.api = new FlickrApi();
    this.utilities = new Utilities();
    this.initialize();
  }

  Gallery.prototype = {
    /**
     * Initialize app
     * @param --
     * @returns --
     */
    initialize : function (){
      var self = this;
      var pictures = this.api.getPictures();
      pictures.then(function(response){
        try {
          self.flickrPictures = JSON.parse(response).photos.photo;
          self.pictures = self.flickrPictures;
          self.createGallery();
        } catch (error) {
          console.log(error);
        }
      });
    },

    /**
     * Create gallery elements
     * @param --
     * @returns --
     */
    createGallery : function (){
      this.mainListenersGallery();
      this.renderThumbnailHtml();
      this.renderMainPictureHtml();
      this.renderPagination();
    },

    /**
     * Create html for thumbnails
     * @param --
     * @returns html thumbnails
     */
    createThumbnails : function (){
      var html = '',
          items = this.pictures.slice( this.currentPage * this.itemPerPage, (this.currentPage + 1) * this.itemPerPage),
          self = this;

      items.forEach(function(item, index) {
        html += '<li class="FlickrGallery-content-thumbnailWrap-thumbnail" data-index="'+ index +'" data-large-image="'+ item.url_l +'" data-title="'+ item.title +'">'+
                  '<img class="FlickrGallery-content-thumbnailWrap-thumbnail-thumbnailPicture" src="' + item.url_q + '"/>'+
                '</li>';
      });

      return html;
    },

    /**
     * Render html thumbnails
     * @param --
     * @returns --
     */
    renderThumbnailHtml : function() {
      var thumbnailsHtml = this.createThumbnails();
      this.utilities.renderHtml(this.getThumbnailContainer(), thumbnailsHtml);
    },

    /**
     * Create html for main picture
     * @param --
     * @returns html main picture
     */
    createMainPicture : function (){
      var html = '',
          containerThumbnails = this.getThumbnailContainer(),
          item = containerThumbnails.childNodes[this.currentIndex];
          if(typeof item !== "undefined") {
            html = '<figure class="FlickrGallery-content-pictureWrap-figure">'+
                    '<img src="'+ item.dataset.largeImage +'" class="FlickrGallery-content-pictureWrap-figure-picture" alt="'+item.title+'">'+
                    '<figcaption class="FlickrGallery-content-pictureWrap-figure-legend">'+
                      item.dataset.title +
                      '<div class="Layout-socialMediaBox">'+
                        '<div class="Layout-socialMediaBox-socialData">'+
                          '<div class="Layout-socialMediaBox-socialData-wrap">'+
                            '<div class="Layout-socialMediaBox-socialData-wrap-column">'+
                                '<div class="Layout-socialMediaBox-socialData-wrap-column-socialNetworkNumbers">'+
                                  '<span>0</span>'+
                                '</div>'+
                                '<button class="Layout-socialMediaBox-socialData-wrap-column-socialNetworkNumbers-shareButton"><span class="Layout-socialMediaBox--twitter ion-social-twitter"></span>Tweet</button>'+
                            '</div>'+
                            '<div class="Layout-socialMediaBox-socialData-wrap-column">'+
                              '<div class="Layout-socialMediaBox-socialData-wrap-column-socialNetworkNumbers">'+
                                '<span class="Layout-socialMediaBox-socialData-wrap-column-socialNetworkNumbers-icon ion-thumbsup Layout-socialMediaBox--facebook"></span>'+
                                '<span>246</span>'+
                              '</div>'+
                              '<button class="Layout-socialMediaBox-socialData-wrap-column-socialNetworkNumbers-shareButton"><span class="Layout-socialMediaBox--facebook ion-social-facebook"></span>Like</button>'+
                            '</div>'+
                            '<div class="Layout-socialMediaBox-socialData-wrap-column">'+
                              '<div class="Layout-socialMediaBox-socialData-wrap-column-socialNetworkNumbers">'+
                                '<span>10</span>'+
                              '</div>'+
                              '<button class="Layout-socialMediaBox-socialData-wrap-column-socialNetworkNumbers-shareButton Layout-socialMediaBox--googleplus"><span  class="ion-social-googleplus"></span> +1 </button>'+
                            '</div>'+
                          '</div>'+
                        '</div>'+
                        '<a href="#" class="Layout-socialMediaBox-socialButton" onclick="event.preventDefault(); event.stopPropagation(); this.previousSibling.style.display = this.previousSibling.style.display === \'\' || this.previousSibling.style.display === \'none\' ? \'block\' : \'none\';">Share</a>'+
                      '</div>'+
                    '</figcaption>'+
                 '</figure>';
          }else{
            html = '<p class="FlickrGallery-content-pictureWrap-messageNotFound">We couldn\'t find what you looking for, please try again</p>';
          }
      return html;
    },

    /**
     * Render html main picture
     * @param --
     * @returns --
     */
    renderMainPictureHtml : function (){
      var mainPictureHtml = this.createMainPicture();
      this.utilities.renderHtml(this.container.querySelector('.FlickrGallery-content-pictureWrap'), mainPictureHtml);
    },

    /**
     * Return Thumbnail container DOM element
     * @param --
     * @returns DOM element
     */
    getThumbnailContainer : function (){
      return this.container.querySelector('.FlickrGallery-content-thumbnailWrap');
    },

    /**
     * Create html for pagination
     * @param --
     * @returns html pagination
     */
    createPagination : function(){
      var numberTotalPages = this.getTotalPages(),
          html = '';

      for (var i = 1; i <= numberTotalPages; i = i+1) {
        html += '<li class="FlickrGallery-content-pagination-paginationContainer-numbersWrap-page">'+
                  '<a class="FlickrGallery-content-pagination-paginationContainer-numbersWrap-page-pageNumber" href="#">'+ i +'</a>'+
                '</li>';
      }

      return html;
    },

    /**
     * Render html pagination
     * @param --
     * @returns --
     */
    renderPagination : function() {
      var self = this,
          htmlPagination = this.createPagination(),
          paginationParent = this.container.querySelector('.FlickrGallery-content-pagination-paginationContainer-numbersWrap');

      this.utilities.renderHtml(paginationParent, htmlPagination);

      // Event to bind pagination numbers
      paginationParent.addEventListener('click', function(event) {
        event.preventDefault();
        var page = event.target;
        if (page.className === 'FlickrGallery-content-pagination-paginationContainer-numbersWrap-page-pageNumber') {
          self.currentPage = page.text - 1;
          self.goToPage();
        }
      });

      // Go to first page
      this.container.querySelector('.FlickrGallery-content-pagination-paginationContainer-paginationWrap-controlsWrap-goFirstPage').addEventListener('click', function(event) {
        event.preventDefault();
        self.currentPage = 0;
        self.goToPage();
      });

      // Go previous page
      this.container.querySelector('.FlickrGallery-content-pagination-paginationContainer-paginationWrap-controlsWrap-goPreviousPage').addEventListener('click', function(event) {
        event.preventDefault();
        self.currentPage = self.currentPage === 0 ? 0 : self.currentPage - 1;
        self.goToPage();
      });

      //Go last page
      this.container.querySelector('.FlickrGallery-content-pagination-paginationContainer-paginationWrap-controlsWrap-goLastPage').addEventListener('click', function(event) {
        event.preventDefault();
        self.currentPage = self.getTotalPages() - 1;
        self.goToPage();
      });

      //Go next page
      this.container.querySelector('.FlickrGallery-content-pagination-paginationContainer-paginationWrap-controlsWrap-goNextPage').addEventListener('click', function(event) {
        event.preventDefault();
        var numberTotalPages = self.getTotalPages() - 1;
        self.currentPage = self.currentPage === numberTotalPages ? numberTotalPages : self.currentPage + 1;
        self.goToPage();
      });


    },

    /**
     * Return totalPages
     * @param --
     * @returns number
     */
    getTotalPages : function() {
      return Math.ceil(this.pictures.length / this.itemPerPage);
    },

    /**
     * Go to a specific page
     * @param --
     * @returns --
     */
    goToPage : function() {
      var self = this;
      self.currentIndex = 0;
      self.renderThumbnailHtml();
      self.renderMainPictureHtml();
    },

    /**
     * Search for title inside pictures array from flickr
     * @param {String} text
     * @returns --
     */
    searchIntoGallery : function(text) {
      this.pictures = [];
      self = this;
      this.flickrPictures.forEach(function(picture){
        if ( picture.title.match( new RegExp (text, "i") ) ) {
          self.pictures.push(picture);
        }
      });

      this.currentIndex = 0;
      this.currentPage = 0;

      this.renderThumbnailHtml();
      this.renderMainPictureHtml();
      this.renderPagination();
    },

    /**
     * Listeners for gallery
     * @param --
     * @returns --
     */
    mainListenersGallery : function() {
      var self = this,
          timerKeyUp;

      this.getThumbnailContainer().addEventListener('click', function(event) {
        var image = event.target;
        if (image.className === 'FlickrGallery-content-thumbnailWrap-thumbnail-thumbnailPicture') {
          self.currentIndex = parseInt(image.parentNode.dataset.index);
          self.renderMainPictureHtml();
        }
      });

      document.getElementById('search-pictures').addEventListener('keyup', function(event){
        var text = event.target.value;
        clearTimeout(timerKeyUp);
        timerKeyUp = setTimeout(function(){
          self.searchIntoGallery(text);
        }, 500);
      });

      this.container.querySelector('.FlickrGallery-content-mainPicture').addEventListener('click', function(event) {
        var totalPics = self.getThumbnailContainer().childNodes.length - 1;
        if ( event.target.parentNode.className === 'FlickrGallery-content-controlsMainPictureRight' ){
          self.currentIndex = ( self.currentIndex === totalPics ) ? 0 : self.currentIndex + 1;
        }else if( event.target.parentNode.className === 'FlickrGallery-content-controlsMainPictureLeft' ){
          self.currentIndex = ( self.currentIndex === 0 ) ? totalPics: self.currentIndex - 1;
        }
        self.renderMainPictureHtml();
      });
    }

  };

  window.Gallery = Gallery;

}(window, document));
