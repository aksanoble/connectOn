/*jslint browser: true*/
/*jslint white: true */
/*global $, Parse, console, jQuery, alert, WifiWizard*/

$(function() {

    "use strict";

    var bestWifi;
    var hotSpotFound = 0;
    var currentLocation = "";

    function win(message) {
        console.log(message);
    }

    function fail(message) {
        console.log(message);
    }

    function connectON() {

        if (hotSpotFound === 0) {
            console.log("No known Hotspot found");
        } else if (hotSpotFound === 1) {
            // console.log("Attempting to connect to ", bestWifi.SSID);
            var formattedWifi = WifiWizard.formatWPAConfig(bestWifi.SSID, bestWifi.pass);
            WifiWizard.addNetwork(formattedWifi, win, fail);
            WifiWizard.connectNetwork(bestWifi.SSID, win, fail);
            setTimeout(function() {
                WifiWizard.disconnectNetwork(bestWifi.SSID, win, fail);
                WifiWizard.removeNetwork(bestWifi.SSID, win, fail);
                alert("Your session has timed out");
            }, 10000);
        }

    }

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

            function enableWifi() {

                //looks like this function is buggy - returns true all the time
                WifiWizard.setWifiEnabled(true, win, fail);
                setTimeout(function(){
                    //do nothing
                }, 2000); 
   
            }

            //enable wifi if it isn't already
            WifiWizard.isWifiEnabled(win, enableWifi);

            
            function scanWifi() {

                function listHandler(results) {

                    var sigLevel = 0;

                    // console.log("The following networks were discovered:\n", results);

                    _.each(results, function(element) {

                        if (_.has(localStorage, element.BSSID)) {

                            if (element.level > sigLevel) {
                                sigLevel = element.level;
                                bestWifi = JSON.parse(localStorage.getItem(element.BSSID));
                                currentLocation = bestWifi.location;
                                // console.log(currentLocation);
                                $('#location span').text(currentLocation);
                            }

                            hotSpotFound = 1;

                        }

                    });

                }

                WifiWizard.getScanResults(listHandler, fail);
            }

            //Download list from Parse as soon as app is launched
            //This fails gracefully if there is not network connection available

            Parse.initialize("1pabmbMrzkDWwDeIBGdZ3sgAnf7YDxlvesn3UDMz", "Q85sXPpbEk4k0C0WTI3N0KVjpFq8NEfwXeegSrqm");
            var AP = Parse.Object.extend("AP");
            var WifiNetworks = Parse.Collection.extend({
                model: AP
            });
            var wifiNetworks = new WifiNetworks();

            // Sync

            wifiNetworks.fetch({

                success: function(collection) {
                    collection.each(function(object) {
                        var objJSON = object.toJSON();
                        localStorage.setItem(objJSON.BSSID, JSON.stringify(objJSON));

                    });
                },

                error: function(collection, error) {
                    console.log(collection);
                    console.log(error); // The collection could not be retrieved.
                }
            });

            scanWifi();

            $('#connect').on('click', connectON);
        },

    };

    app.initialize();

});
