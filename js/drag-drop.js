$(function(){



    var canvas=document.getElementById("canvas");
    
    var ctx=canvas.getContext("2d");
    var canvasOffset=$(".canvas-drag-drop").offset();
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
	
	
	
//attach the image element
var img1 = document.getElementById("img1");
img1.onmousedown = mousedown;
img1.ondragstart = dragstart;

//attach the image element
var img2 = document.getElementById("img2");
img2.onmousedown = mousedown;
img2.ondragstart = dragstart;

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
  var dropX = ev.clientX - canvasLeft - startOffsetX;
  var dropY = ev.clientY - canvasTop - startOffsetY;
  var id = ev.dataTransfer.getData("Text");
  var dropElement = document.getElementById(id);

  // draw the drag image at the drop coordinates
  ctx.drawImage(dropElement, dropX, dropY);
  var cloneImg = new Image();
  cloneImg.src = dropElement.src;
  boxes.push({ img: cloneImg, x:dropX, y:dropY, w:100, h:100 });
  console.log(boxes);
}
	

function hit(x, y, event) {
    for (var i = 0; i < boxes.length; i++) {
        var box = boxes[i];
        if (x >= box.x && x <= box.x + box.w && y >= box.y && y <= box.y + box.h) {
            
			if(event === "mousedown"){
				dragTarget = box;
			}
			if(event === "click"){
				
				//draw a blue rectangle around the selected element
				ctx.beginPath();
				ctx.lineWidth="4";
				ctx.strokeStyle="blue";
				ctx.rect(box.x,box.y,box.w,box.h); 
				ctx.stroke();
				
				if(selectedTarget.indexOf(i) == -1){
					selectedTarget.push(i);
				}
			
				if(selectedTarget.length == 2){
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

	function handleMouseClick(e){
      startX=parseInt(e.clientX-offsetX);
      startY=parseInt(e.clientY-offsetY);
      // set the drag flag
	  console.log("clicked !!" , startX, startY);
	  isClicked = hit(startX, startY, "click");
	  
	 if(isClicked){
		if(selectedTarget.length == 2){
			draw();
		//empty the selected targets
		selectedTarget  = [];
		}
	 }	
	 else{
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
	if(connectors.length > 0){
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
	
	
    $(".canvas-drag-drop").mousedown(function(e){handleMouseDown(e);});
    $(".canvas-drag-drop").mousemove(function(e){handleMouseMove(e);});
    $(".canvas-drag-drop").mouseup(function(e){handleMouseUp(e);});
    $(".canvas-drag-drop").mouseout(function(e){handleMouseOut(e);});
	$('.canvas-drag-drop').click(function (e){handleMouseClick(e)});

}); // end $(function(){});
