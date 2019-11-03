(function() {
    // Creates a new canvas element and appends it as a child
    // to the parent element, and returns the reference to
    // the newly created canvas element
    function createCanvas(parent, width, height) {
        var canvas = {};
        canvas.node = document.createElement('canvas');
        canvas.context = canvas.node.getContext('2d');
        canvas.node.width = width || 100;
        canvas.node.height = height || 100;
        parent.appendChild(canvas.node);
        return canvas;
    }

    function init(container, width, height, fillColor) {
        var canvas = createCanvas(container, width, height);
        ctx = canvas.context;
        ctx.globalAlpha = 0.8;
        // define a custom fillCircle method
        ctx.fillCircle = function(x, y, radius, fillColor) {
            this.fillStyle = fillColor;
            this.beginPath();
            this.globalAlpha = 0.9;
            this.moveTo(x, y);
            this.arc(x, y, radius, 0, Math.PI * 2, false);
            this.fill();
        };
        ctx.clearTo = function(fillColor) {
            ctx.fillStyle = fillColor;
            ctx.fillRect(0, 0, width, height);
        };
        ctx.clearTo(fillColor || "#ddd");


        // bind mouse events
        canvas.node.onmousemove = function(e) {
            if (!canvas.isDrawing) {
               return;
            }
            var x = e.pageX - this.offsetLeft;
            var y = e.pageY - this.offsetTop;
            console.log(x, y); //coordinates of mouse clicks
            var radius = 10; // or whatever
            var fillColor = '#ff0000';
            ctx.globalCompositeOperation = 'destination-out';
            ctx.fillCircle(x, y, radius, fillColor);
        };
        canvas.node.onmousedown = function(e) {
            canvas.isDrawing = true;
        };
        canvas.node.onmouseup = function(e) {
            canvas.isDrawing = false;
        };

        initialFill();

        // test code
        // let initialX = 166;
        // let initialY = 193;

        // setInterval(function() {
        //     initialX += 2;
        //     initialY += 2;
        //     // ctx.fillCircle(initialX, initialY, 10, '#bada55');
        //     // 166 193
        //     // 233 203
        // }, 500);
    }
    var container = document.getElementById('canvas');
    init(container, 1000, 505, '#000000');

})();



/**
 * initial transparent lines of already searched routes
 */
function initialFill() {
    let lat = 0;
    let long = 0;

    // vertical green line
    for (x = 190; x < 440; x++) {
        long = x;
        // console.log(x);
        ctx.globalCompositeOperation = 'destination-out'; // clear color
        ctx.fillCircle(490, x, 10, '#ff0000');
    }
    for (y = 490; y < 700; y++) {
        lat = 7;
        // console.log(x);
        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillCircle(y, 440, 10, '#ff0000');
    }
}




