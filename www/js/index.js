var imported1 = document.createElement('script');
imported1.src = 'js/loadedscript.js';
document.head.appendChild(imported1);
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {

    }

    // Update DOM on a Received Event

};

app.initialize();