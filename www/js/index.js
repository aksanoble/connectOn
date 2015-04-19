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

  /*var addToStatus =  function(message) {
  console.log(message);
  var newP = document.createElement("p");
  var node = document.createTextNode(message);
  var status = document.getElementById("status");
  newP.appendChild(node);
  status.insertBefore(newP, status.firstChild);
};

test = {
addNetwork: function() {

var ssid =  document.getElementById("SSID").value;
var pass = document.getElementById("password").value;

var wifiConfiguration = WifiWizard.formatWifiConfig(ssid, pass, 'WPA');
WifiWizard.addNetwork(wifiConfiguration, addToStatus, addToStatus);
addToStatus(wifiConfiguration.SSID + " " + wifiConfiguration.Password);
addToStatus("Adding Network...");
},

removeNetwork: function() {
var ssid =  document.getElementById("SSID").value;
addToStatus("Removing network: " + ssid);
WifiWizard.removeNetwork(ssid, addToStatus, addToStatus);
},

handleList: function(networkList) {
addToStatus(networkList.join(" "));
},

listNetworks: function() {
WifiWizard.listNetworks(test.handleList);
addToStatus("Listing networks...");
},

disconnect: function() {
var ssid =  document.getElementById("SSID").value;
addToStatus("Disconnecting: " + ssid);
WifiWizard.disconnectNetwork(ssid, addToStatus, addToStatus);
},

connect: function() {
var ssid =  document.getElementById("SSID").value;
addToStatus("Connecting: " + ssid);
WifiWizard.connectNetwork(ssid, addToStatus, addToStatus);
},

scanNetworks: function() {
console.log('scanning Networks');
WifiWizard.getScanResults(parseSave);
function parseSave (list) {
_.each(list, saveNow);
function saveNow (item) {
var wifiObject = new WifiObject();
wifiObject.save({SSID: item.SSID, BSSID: item.BSSID}).then(function(object) {
console.log(item.SSID);
});}
}
},

toJSON: function(list) {
this.addToStatus(JSON.stringify(list));
_.each(list,this.parseSave);

},



clear: function() {
document.getElementById("status").innerHTML="";
addToStatus("WifiTest Cleared.");
}
};

Parse.initialize("1pabmbMrzkDWwDeIBGdZ3sgAnf7YDxlvesn3UDMz", "Q85sXPpbEk4k0C0WTI3N0KVjpFq8NEfwXeegSrqm");
var TestObject = Parse.Object.extend("TestObject");
var testObject = new TestObject();
testObject.save({foo: "bar"}).then(function(object) {
addToStatus("Parse! it worked");
});
var WifiObject = Parse.Object.extend("WifiObject");

$('#scan').on("tap", test.scanNetworks);
$('#clear').on("tap", test.clear);*/
}
});
