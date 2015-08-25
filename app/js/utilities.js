(function (window, document){
  'use strict';
  function Utilities (){

  }

  Utilities.prototype = {
    /**
     * @param {DOM element} container
     * @returns {HTML} html
     */
    renderHtml : function(container, html) {
      container.innerHTML = html;
    }
  }

  window.Utilities = Utilities;

}(window, document));
