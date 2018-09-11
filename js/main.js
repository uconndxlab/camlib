window.onload = function() {
  var video = document.getElementById('webcamFeed');
  var canvas = document.getElementById('canvas');
  var context = canvas.getContext('2d');
  var findStatus = document.getElementById("indicator");
  var tracker = new tracking.ObjectTracker('face');
  var foundFace = false;
  tracker.setInitialScale(4);
  tracker.setStepSize(1);
  tracker.setEdgesDensity(0.1);

  tracking.track('#webcamFeed', tracker, { camera: true });

  /*The below interval checks every millisecond to see if a face has been found, refound, or lost*/

  var x = setInterval(function(){
     if(foundFace && findStatus.children.length == 0){
       var childP = document.getElementById("statusIndicatorRed");
       findStatus.removeChild(childP);
       var faceFind = document.createElement("p");
       faceFind.setAttribute("id", "statusIndicator");
       faceFind.setAttribute("style", "color: rgb(89, 255, 0); font-weight: 500;");
       var text = document.createTextNode("--> FACE FOUND <--");
       faceFind.appendChild(text);
       document.getElementById("indicator").appendChild(faceFind);
     } else if (foundFace && findStatus.children.length > 0){
       var childP = document.getElementById("statusIndicatorRed");
       findStatus.removeChild(childP);
       var faceFind = document.createElement("p");
       faceFind.setAttribute("id", "statusIndicator");
       faceFind.setAttribute("style", "color: rgb(89, 255, 0); font-weight: 800; font-family: Helvetica; font-size: 20px;");
       var text = document.createTextNode("--> FACE FOUND <--");
       faceFind.appendChild(text);
       document.getElementById("indicator").appendChild(faceFind);
     } else{
       var childP = document.getElementById("statusIndicator");
       findStatus.removeChild(childP);
       var faceFind = document.createElement("p");
       faceFind.setAttribute("id", "statusIndicatorRed");
       faceFind.setAttribute("style", "color: rgb(212, 1, 127); font-weight: 800; font-family: Helvetica; font-size: 20px;");
       var text = document.createTextNode("--> FACE LOST <--");
       faceFind.appendChild(text);
       document.getElementById("indicator").appendChild(faceFind);
     }
  }, 100);

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
  gui.add(tracker, 'stepSize', 1, 5).step(0.1);  */


};
