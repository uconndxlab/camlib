window.onload = function() {
  var video = document.getElementById('webcamFeed');
  var canvas = document.getElementById('canvas');
  var context = canvas.getContext('2d');
  var findStatus = document.getElementById("indicator");
  var tracker = new tracking.ObjectTracker('face');
  var foundFace = false;
  var pictureTaken = false;
  var hasFoundFace;
  var canTurnOn;
  var counter = 4;

  function turnOnLight(){
    fetch('https://maker.ifttt.com/trigger/light_wink/with/key/bT9Xhj5iv07GgtQolk-H36')
      .then(function(response) {
        return response.json();
      })
      .then(function(myJson) {
        console.log(JSON.stringify(myJson));
      });
  }

  function turnOffLight(){
    fetch('https://maker.ifttt.com/trigger/light_off/with/key/bT9Xhj5iv07GgtQolk-H36')
    .then(function(response) {
      return response.json();
    })
    .then(function(myJson) {
      console.log(JSON.stringify(myJson));
    });
    resetFaceFind();
  }

  function resetFaceFind(){
    var y = setInterval(function(){
      if(foundFace){
          counter -= 1;
          document.querySelector(".countdown").style = "color: rgb(198, 117, 126); font-weight: 700; font-family: Helvetica;";
          document.querySelector(".countdown").innerHTML = counter;
          if(counter <= 0){
            counter = 4;
            clearInterval(y);
            document.querySelector(".countdown").style = "color: rgb(77, 162, 32); font-weight: 700; font-family: Helvetica;";
            document.querySelector(".countdown").innerHTML = "Picture taken! Please wait...";
            for(var i = 0; i < 1; i++){
              turnOnLight();
            }
        }
      }
      if(!foundFace) {
            counter = 4;
            document.querySelector(".countdown").style = "color: rgb(198, 117, 126); font-weight: 700; font-family: Helvetica;";
            document.querySelector(".countdown").innerHTML = "Please Align a Face!";
      }
    }, 1000);
  }

  resetFaceFind();
  tracker.setInitialScale(4);
  tracker.setStepSize(2);
  tracker.setEdgesDensity(0.1);

  tracking.track('#webcamFeed', tracker, { camera: true });

  canvas.width = Math.min(window.innerWidth, window.innerHeight) * 1.4;
  canvas.height = Math.min(window.innerWidth, window.innerHeight);

  /*The below interval checks every millisecond to see if a face has been found, refound, or lost
  and reports it back to a variable which dynamically creates and erases a visual indication*/
  var x = setInterval(function(){
     if(foundFace){
      var els = document.querySelectorAll('.region div');
      for(var x = 0; x < els.length; x++) {
        els[x].style.borderColor = 'green';
      }
      if(!pictureTaken) {
         var z = setInterval(function(){
           counter -= 1;
           console.log(counter);
           document.querySelector(".countdown").innerHTML = counter;
           if(counter == 0){
             counter = 4;
             pictureTaken = true;
             clearInterval(z);
             document.querySelector(".countdown").innerHTML = "Picture Taken! Please wait!";
           }
         }, 1000);
       }
     } else {
      var els = document.querySelectorAll('.region div');
      for(var x = 0; x < els.length; x++) {
        els[x].style.borderColor = 'red';
      }
       counter = 4;
       pictureTaken = false;

    /*The below interval checks every millisecond to see if a face has been found, refound, or lost
    and reports it back to a variable which dynamically creates and erases a visual indication*/
     }
  }, 100);

  document.querySelector(".offBtn").addEventListener("click", function(){
      turnOffLight();
  });

  /*The following code starts the tracker upon recognition and draws the green square*/

  tracker.on('track', function(event) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    /*foundFace is set to false here because this is the function actuation, so it is ready to track but has found nothing yet*/
    foundFace = false;

    event.data.forEach(function(rect) {
      /*foundFace is true here because this function is where the green square is actually drawn*/
      foundFace = true;
      context.strokeStyle = '#1cff00';
      context.lineWidth = "3";
      context.strokeRect(rect.x, rect.y, rect.width, rect.height);
      context.font = '11px Helvetica';
      context.fillStyle = "#fff";
      context.fillText('x: ' + rect.x + 'px', rect.x + rect.width + 5, rect.y + 11);
      context.fillText('y: ' + rect.y + 'px', rect.x + rect.width + 5, rect.y + 22);
    });

    /*The below is to give the user a point of reference to line up their face*/
    context.strokeStyle = "rgb(226, 51, 113)";
    context.lineWidth = "5";
    context.strokeRect(canvas.width/5, canvas.height/4, video.width*.5, video.height*.5);
  });

  /*
var gui = new dat.GUI();
  gui.add(tracker, 'edgesDensity', 0.1, 0.5).step(0.01);
  gui.add(tracker, 'initialScale', 1.0, 10.0).step(0.1);
  gui.add(tracker, 'stepSize', 1, 5).step(0.1);*/


};
