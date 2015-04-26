$(function(){
  var app = {
    // Application Constructor
    initialize: function() {
      this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
      document.addEventListener('deviceready', this.onDeviceReady, false);

    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {

      $('#connect').on('click', mainApp);
      //mainApp();//app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    /*receivedEvent: function(id) {
    var parentElement = document.getElementById(id);
    var listeningElement = parentElement.querySelector('.listening');
    var receivedElement = parentElement.querySelector('.received');

    listeningElement.setAttribute('style', 'display:none;');
    receivedElement.setAttribute('style', 'display:block;');

  }
  console.log('Received Event: ' + id);*/
};

app.initialize();


function mainApp(){
  //  localStorage.setItem("60:a4:4c:67:b8:80", JSON.stringify({SSID: "JaagaHotspot", pass:"jaagajaaga"}));
  function addWifi (BSSID){
    var wifi = JSON.parse(localStorage.getItem(BSSID));
    var formattedWifi = WifiWizard.formatWPAConfig(wifi.SSID, wifi.pass);
    WifiWizard.addNetwork(formattedWifi, connectWifi(wifi), error);
    //WifiWizard.connectNetwork(wifi.SSID, win, error);
  }

  function connectWifi(wifi) {
    //console.log(message);
    WifiWizard.connectNetwork(wifi.SSID, win, error);
    //wifiConnect();
  }

  function win(message) {
    console.log(message);
  }

  function error (err) {
    console.log(err);
  }



WifiWizard.getScanResults(listHandler);
function listHandler(results) {
  function success(message) {
    console.log(message);}

    _.each(results, function(element){
      if(_.has(localStorage,element.BSSID)){
        addWifi(element.BSSID);
      }

      //console.log(element.BSSID);
    });
  }

  var AP = Parse.Object.extend("AP");
  var WifiNetworks = Parse.Collection.extend({model: AP});
  wifiNetworks = new WifiNetworks();
  // Sync
  wifiNetworks.fetch({
    success: function(collection) {
      collection.each(function(object) {
        var objJSON = object.toJSON();
        console.log(objJSON);
        localStorage.setItem(objJSON.BSSID, JSON.stringify(objJSON));

      });
    },
    error: function(collection, error) {
      console.log(error);// The collection could not be retrieved.
    }
  });

}
});
