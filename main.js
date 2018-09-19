class CamLib {
    constructor(opts) {
        this.video = document.querySelector(opts.videoSelector);
        this.errorElement = document.querySelector(opts.errorSelector);
        this.constraints = opts.constraints;
        this.hiddenCanvas = document.querySelector(opts.canvasSelector);
        this.context = this.hiddenCanvas.getContext('2d');
        this.trackFaces = opts.trackFaces;
        this.outlineFaces = opts.outlineFaces;
        this.faces = [];
        this.hiddenImg;
        this.stream;

        if(this.trackFaces) {
            this.video.onloadedmetadata = () => {
                this.hiddenCanvas.width = this.video.videoWidth;
                this.hiddenCanvas.height = this.video.videoHeight;
            };

            let context = this.context;

            
            this.startTrackingFaces();
        }
    }

    async init(e) {
        try {
            this.stream = await navigator.mediaDevices.getUserMedia(this.constraints);
            this.handleSuccess(this.stream);
        } catch (e) {
            this.handleError(e);
        }
    }

    async startTrackingFaces() {
        if(this.trackFaces) {

            let context = this.context;
            let video = this.video;
            let canvas = this.hiddenCanvas;

            context.strokeStyle = '#ffeb3b';
            context.fillStyle = '#ffeb3b';
            context.font = '16px Arial';
            context.lineWidth = 5;

            let faceDetector = new window.FaceDetector({fastMode:true});
            faceDetector.detect(this.video)
                .then(function(faces) {
                    context.clearRect(0, 0, canvas.width, canvas.height);
                    context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
                    faces.forEach(function(face) {
                        const { top, left, width, height } = face.boundingBox;
                        context.beginPath();
                        context.rect(left, top, width, height);
                        context.stroke();
                    })
                })
        }

        requestAnimationFrame(() => this.startTrackingFaces())

    }

    stopTrackingFaces() {
        this.trackFaces = false;
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
            context = this.context;

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
        if (error.name === 'PermissionDeniedError') {
          this.errorMsg('You need to allow the page access to your devices in ' +
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
        errorSelector:"#notifications",
        canvasSelector:"#canvasElement",
        trackFaces:true,
        outlineFaces:true,
        constraints:{audio:false,video:true}        
    });

    camLib.init();

});