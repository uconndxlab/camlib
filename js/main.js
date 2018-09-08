window.onload = function() {
  var video = document.getElementById('webcamFeed');
  var canvas = document.getElementById('canvas');
  var context = canvas.getContext('2d');
  var findStatus = document.getElementById("indicator");
  var tracker = new tracking.ObjectTracker('face');
  var foundFace = false;
  tracker.setInitialScale(4);
  tracker.setStepSize(2);
  tracker.setEdgesDensity(0.1);

  tracking.track('#webcamFeed', tracker, { camera: true });

  var x = setInterval(function(){
     if(foundFace && findStatus.children.length == 0){
       var faceFind = document.createElement("p");
       faceFind.setAttribute("id", "statusIndicator");
       var text = document.createTextNode("*** FACE FOUND ***");
       faceFind.appendChild(text);
       document.getElementById("indicator").appendChild(faceFind);
     } else {
       var childP = document.getElementById("statusIndicator");
       findStatus.removeChild(childP);
     }
  }, 100);

  tracker.on('track', function(event) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    foundFace = false;

    event.data.forEach(function(rect) {
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

  var gui = new dat.GUI();
  gui.add(tracker, 'edgesDensity', 0.1, 0.5).step(0.01);
  gui.add(tracker, 'initialScale', 1.0, 10.0).step(0.1);
  gui.add(tracker, 'stepSize', 1, 5).step(0.1);
};
