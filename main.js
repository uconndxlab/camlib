class CamLib {
    constructor(opts) {
        this.video = document.querySelector(opts.videoSelector);
        this.errorElement = document.querySelector(opts.errorSelector);
        this.constraints = opts.constraints;
        this.hiddenCanvas = opts.canvasSelector;
        this.hiddenImg;
        this.stream;
    }

   async init(e) {
        try {
            this.stream = await navigator.mediaDevices.getUserMedia(this.constraints);
            this.handleSuccess(this.stream);
        } catch (e) {
            this.handleError(e);
        }
    }

    handleSuccess(stream) {
        const videoTracks = this.stream.getVideoTracks();
        console.log('Got stream with constraints:', this.constraints);
        console.log(`Using video device: ${videoTracks[0].label}`);
        this.video.srcObject = this.stream;

        this.hiddenImg = document.createElement("img");
    }

    takeSnapshot(){
        // Here we're using a trick that involves a hidden canvas element.  

        let hidden_canvas = this.hiddenCanvas;
            context = hidden_canvas.getContext('2d');

        let width = video.videoWidth,
            height = video.videoHeight;

        if (width && height) {

            // Setup a canvas with the same dimensions as the video.
            hidden_canvas.width = width;
            hidden_canvas.height = height;

            // Make a copy of the current frame in the video on the canvas.
            context.drawImage(this.video, 0, 0, width, height);

            // Turn the canvas image into a dataURL that can be used as a src for our photo.
            return hidden_canvas.toDataURL('image/png');
        }
    }

    updateImage() {
        this.hiddenImg.setAttribute('src', this.takeSnapshot());
    }

    handleError(error) {
        if (error.name === 'ConstraintNotSatisfiedError') {
          let v = this.constraints.video;
          this. errorMsg(`The resolution ${v.width.exact}x${v.height.exact} px is not supported by your device.`);
        } else if (error.name === 'PermissionDeniedError') {
          this.errorMsg('Permissions have not been granted to use your camera and ' +
            'microphone, you need to allow the page access to your devices in ' +
            'order for the demo to work.');
        }
        this.errorMsg(`getUserMedia error: ${error.name}`, error);
      }
      
      errorMsg(msg, error) {
        this.errorElement.innerHTML += `<p>${msg}</p>`;
        if (typeof error !== 'undefined') {
          console.error(error);
        }
      }
    
}


document.addEventListener("DOMContentLoaded", function(event) {

    let camLib = new CamLib({
        videoSelector:"#video",
        errorSelector:"#errorElement",
        canvasSelector:"#canvasElement",
        constraints:{audio:false,video:true}        
    });

    camLib.init();

});