var ctx;
const sampleJson2 = 
    {"point": {
        "postedBy": "rSTZWwjvwVg6ijEIKLysTYSOGzt2",
        "location": {
            "name": "location1",
            "latitude": 29.664736,
            "longitude": -95.027364
        },
        "timestamp": { 
            "seconds": "1572591600",
            "name": "sun1",
        },
        "metadata": {
            "data": "other data here",
            "size": 36,
        }
    }};

const alreadySearched =
    {"point": {
        "postedBy": "rSTZWwjvwVg6ijEIKLysTYSOGzt2",
        "location": {
            "name": "location1",
            "latitude": 29.664736,
            "longitude": -95.027364
        },
        "timestamp": { 
            "seconds": "1572591600",
            "name": "sun1",
        },
        "metadata": {
            "data": "icon",
            "size": 36,
        }
    }};


// canvas action
(function() {
    // drag n drop
    var canvasOffset=$("#canvas").offset();
    var offsetX=canvasOffset.left;
    var offsetY=canvasOffset.top;
    var canvasWidth=canvas.width;
    var canvasHeight=canvas.height;
    
    var startX;
    var startY;
    var isDown = false;
    var dragTarget; //the target selected for dragging!
    var selectedTarget =[]; //the target selected!

    var canvasLeft = offsetX;
    var canvasTop = offsetY;
    
    canvas.ondrop = drop;
    canvas.ondragover = allowDrop;
    // drag n drop end


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

        make_base();

        function make_base() {
            base_image = new Image();
            base_image.src = 'https://i.imgur.com/flpFsg4.png';
            base_image.onload = function(){
                canvas.node.getContext('2d').globalCompositeOperation = 'source-over';
                canvas.node.getContext('2d').drawImage(base_image, 70, 20);
                canvas.node.getContext('2d').globalCompositeOperation = 'source-over';
            }
        }

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
        // canvas.node.onmousemove = function(e) {
        //     if (!canvas.isDrawing) {
        //        return;
        //     }
        //     console.log('WHATISDAS');
        //     console.log(e);
        //     var x = e.pageX - this.offsetLeft;
        //     var y = e.pageY - this.offsetTop;
        //     console.log(x, y); //coordinates of mouse clicks
        //     var radius = 10; // or whatever
        //     var fillColor = '#ff0000';
        //     ctx.globalCompositeOperation = 'destination-out';
        //     ctx.fillCircle(x, y, radius, fillColor);
        // };
        // canvas.node.onmousedown = function(e) {
        //     canvas.isDrawing = true;
        // };
        // canvas.node.onmouseup = function(e) {
        //     canvas.isDrawing = false;
        // };

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


// DRAG N DROP CODE

    //attach the image element
    var img1 = document.getElementById("img1");
    img1.onmousedown = mousedown;
    img1.ondragstart = dragstart;

    //attach the image element
    var img2 = document.getElementById("img2");
    img2.onmousedown = mousedown;
    img2.ondragstart = dragstart;

    //attach the image element
    var img3 = document.getElementById("img3");
    img3.onmousedown = mousedown;
    img3.ondragstart = dragstart;

    //this array contains the elements to draw on the canvas
    var boxes = [];
    var connectors = [];


    function allowDrop(ev) {
        ev.preventDefault();
    }
    
    function mousedown(ev) {
        startOffsetX = ev.offsetX;
        startOffsetY = ev.offsetY;
    }
    
    function dragstart(ev) {
        ev.dataTransfer.setData("Text", ev.target.id);
    }
    
    function drop(ev) {
        ev.preventDefault();
        console.log("drop called");	
        // try this
        var dropX = ev.pageX - this.offsetLeft-13;
        var dropY = ev.pageY - this.offsetTop-14;
        //     console.log(x, y); //coordinates of mouse clicks

        // var dropX = ev.clientX - canvasLeft;
        // var dropY = ev.clientY - canvasTop;

        var id = ev.dataTransfer.getData("Text");
        var dropElement = document.getElementById(id);
    
        // draw the drag image at the drop coordinates
        ctx.drawImage(dropElement, dropX, dropY);
        var cloneImg = new Image();
        cloneImg.src = dropElement.src;
        boxes.push({ img: cloneImg, x:dropX, y:dropY, w:50, h:50 });
        console.log(boxes);
    }
    
    function hit(x, y, event) {
        for (var i = 0; i < boxes.length; i++) {
            var box = boxes[i];
            if (x >= box.x && x <= box.x + box.w && y >= box.y && y <= box.y + box.h) {
                if (event === "mousedown"){
                    dragTarget = box;
                }
                if (event === "click"){
                    //draw a blue rectangle around the selected element
                    ctx.beginPath();
                    ctx.lineWidth="4";
                    ctx.strokeStyle="blue";
                    ctx.rect(box.x,box.y,box.w,box.h); 
                    ctx.stroke();
                    if (selectedTarget.indexOf(i) == -1){
                        selectedTarget.push(i);
                    }
                    if (selectedTarget.length == 2){
                        connectors.push({
                            box1: selectedTarget[0],
                            box2: selectedTarget[1]
                        });
                    }
                }
                console.log("I am hit!!");
                return (true);
            }
        }
        return (false);
    }
    
    function handleMouseDown(e){
        startX=parseInt(e.clientX-offsetX);
        startY=parseInt(e.clientY-offsetY);
        // set the drag flag
        console.log("mousedown called",startX,startY);
        // Put your mousedown stuff here
        isDown = hit(startX, startY, "mousedown");
    }

    function handleMouseUp(e){
        console.log("Mouse up called!!");
        // clear the drag flag
        dragTarget = null;
        isDown=false;
    }

    function handleMouseOut(e){
        //handleMouseUp(e); do nothing for now
    }

    function handleMouseMove(e){
        if (!isDown) {
            return;
        }
        canMouseX=parseInt(e.clientX-offsetX);
        canMouseY=parseInt(e.clientY-offsetY);
        
        // Put your mousemove stuff here
        var dx = canMouseX - startX;
        var dy = canMouseY - startY;
        startX = canMouseX;
        startY = canMouseY;
        dragTarget.x += dx;
        dragTarget.y += dy;
        draw();
    }

    function handleMouseClick(e) {
        startX=parseInt(e.clientX-offsetX);
        startY=parseInt(e.clientY-offsetY);
        // set the drag flag
        console.log("clicked !!" , startX, startY);
        isClicked = hit(startX, startY, "click");
        
        if (isClicked){
            if (selectedTarget.length == 2) {
                draw();
                //empty the selected targets
                selectedTarget  = [];
            }
        }
        else {
            draw();
            selectedTarget  = [];
        }
    }
    
    function draw() {
        // clear the canvas
        ctx.clearRect(0,0,canvasWidth,canvasHeight);
        //draw the boxes!
        for (var i = 0; i < boxes.length; i++) {
            var box = boxes[i];
            ctx.drawImage(box.img, box.x, box.y);
        }
        //draw the connectors!
        if (connectors.length > 0){
            drawConnectors();
        }
    }

    function drawConnectors(){
        
        for (var i = 0; i < connectors.length; i++) {
            var connector = connectors[i];
            var box1 = boxes[connector.box1];
            var box2 = boxes[connector.box2];
            ctx.beginPath();
            ctx.moveTo(box1.x + box1.w / 2, box1.y + box1.h / 2);
            ctx.lineTo(box2.x + box2.w / 2, box2.y + box2.h / 2);
            ctx.stroke();
        }
    }
        
    
    $("#canvas").mousedown(function(e){handleMouseDown(e);});

    $("#canvas").mousemove(function(e){handleMouseMove(e);});

    $("#canvas").mouseup(function(e){handleMouseUp(e);});

    $("#canvas").mouseout(function(e){handleMouseOut(e);});

    $('#canvas').click(function (e){handleMouseClick(e)});

    // DRAG N DROP END

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





