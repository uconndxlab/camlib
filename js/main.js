var video = document.querySelector("#webcamFeed");

if (navigator.mediaDevices.getUserMedia) {
  navigator.mediaDevices.getUserMedia({
      video: true
    })
    .then(function(stream) {
      video.srcObject = stream;
    })
    .catch(function(err0r) {
      console.log("Please make sure a webcam is connected. If there is one connected, make sure it's the right one.");
    });
}
