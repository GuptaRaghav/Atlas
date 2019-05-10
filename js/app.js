var i=0;
images = [];
$canvas = $('#canvascontainer');
var isDragging = false;
var startX;
var startY;
descriptionElem = document.getElementById("descriptionElem");
tablePrice = document.getElementById("tablePrice");
var itemCounter = 1;
$(document).ready(function(){
  $(".nav-link").click(function(){
    $(".nav-link").removeClass('active');
    $(".itemcontainer").hide();
    $("#"+$(this).attr("div-id")+"").show();
    $(this).addClass('active');
  });
});

function dragimg(ev){
  ev.dataTransfer.setData("text", ev.target.id);
}
function updateDescription(event){
  descriptionElem.innerText = event.srcElement.src.split("/")[4] + " Selected";
}
function allowImgDrop(ev) {
  ev.preventDefault();
}
function updateTablePrice(imgPath){
  var botmRow = tablePrice.tBodies[0].insertRow(-1);
  cell = botmRow.insertCell(0);
  cell.innerText = itemCounter;
  itemCounter++;
  cell = botmRow.insertCell(1);
  cell.innerText = imgPath.split("/")[4];
  cell = botmRow.insertCell(2);
  cell.innerText = "Size here";
  cell = botmRow.insertCell(3);
  cell.innerText = "1";
  cell = botmRow.insertCell(4);
  cell.innerText = Math.random()*1000;
}
function Imgdrop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    var nodeCopy = document.getElementById(data).cloneNode(true);
    nodeCopy.id = "newImg"+i; /* We cannot use the same ID */
    i++;
    this.canvas = document.getElementById("canvascontainer");
    this.ctx = this.canvas.getContext("2d");
    var img = new Image();
    img.src = nodeCopy.src;
    img.draggable = true;
    updateTablePrice(img.src);
    this.ctx.drawImage(img,ev.offsetX,ev.offsetY);
    //need to keep ref of all image alnng with their previous state
    images.push({ 
      image: img,
      x: ev.offsetX,
      y: ev.offsetY, 
      scale: 0.5, 
      isDragging: false,
      url: img.src,
      width: img.naturalWidth,
      height: img.naturalHeight
     });
    img.onload = function() {
      _MouseEvents();
    };
}
function _MouseEvents() {
  this.canvas.onmousedown = function(e) {
     /// tell browser we're handling this mouse event
    e.preventDefault();
    e.stopPropagation();

    //get current position
    var mx = parseInt(e.clientX - $canvas.offset().left);
    var my = parseInt(e.clientY - $canvas.offset().top);

    //test to see if mouse is in 1+ images
    isDragging = false;
    for (var i = 0; i < images.length; i++) {
        var r = images[i];
        if (mx > r.x && mx < r.x + r.width && my > r.y && my < r.y + r.height) {
            //if true set r.isDragging=true
            r.isDragging = true;
            isDragging = true;
        }
    }
    //save mouse position
    startX = mx;
    startY = my;
    
  };
  this.canvas.onmousemove = function(e) {
  // do nothing if we're not dragging
  if (!isDragging) {return; }

  //tell browser we're handling this mouse event
  e.preventDefault();
  e.stopPropagation();

  canvas.style.cursor = "grabbing";
  //get current mouseposition
  var mx = parseInt(e.clientX - $canvas.offset().left);
  var my = parseInt(e.clientY - $canvas.offset().top);

  //calculate how far the mouse has moved;
  var dx = mx - startX;
  var dy = my - startY;

  //move each image by how far the mouse moved
  for (var i = 0; i < images.length; i++) {
      var r = images[i];
      if (r.isDragging) {
          r.x += dx;
          r.y += dy;
      }
  }

  //reset the mouse positions for next mouse move;
  startX = mx;
  startY = my;

  //re render the images
  renderAll();
    
  };
  this.canvas.onmouseup = function(e) {
    //tell browser we're handling this mouse event
    e.preventDefault();
    e.stopPropagation();

    // clear all the dragging flags
    isDragging = false;
    for (var i = 0; i < images.length; i++) {
        images[i].isDragging = false;
    }
    canvas.style.cursor = "default";
    
  };
  this.canvas.onmouseout = function(e) {
    //tell browser we're handling this mouse event
    e.preventDefault();
    e.stopPropagation();

    // clear all the dragging flags
    isDragging = false;
    for (var i = 0; i < images.length; i++) {
        images[i].isDragging = false;
    }
  };
}
function renderAll() {
  this.ctx.fillStyle = "#ffffff";
  this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  for (var i = 0; i < images.length; i++) {
      var r = images[i];
      this.ctx.drawImage(r.image, r.x, r.y);
  }
}

/*  Dragging method starts   */
  function allowDrop(ev) {
    ev.preventDefault();
  }


  function drop(ev) {
      ev.preventDefault();
      document.getElementById("image").style.left = ev.x;
      document.getElementById("image").style.top = ev.y;
      var data = ev.dataTransfer.getData("text");
	    document.getElementById(data).style.top = ev.x;
      ev.target.appendChild(document.getElementById(data));
  }

  function dragMouseDown(e) {
    console.log(e);
  }


  /*  Dragging method ends   */
  /*Make resizable div by Hung Nguyen*/
  function makeResizableDiv(div) {
    const element = document.querySelector(div);
    const resizers = document.querySelectorAll(div + ' .resizer')
    const minimum_size = 20;
    let original_width = 0;
    let original_height = 0;
    let original_x = 0;
    let original_y = 0;
    let original_mouse_x = 0;
    let original_mouse_y = 0;
    for (let i = 0; i < resizers.length; i++) {
      const currentResizer = resizers[i];
      currentResizer.addEventListener('mousedown', function (e) {
        e.preventDefault();
        original_width = parseFloat(getComputedStyle(element, null).getPropertyValue('width').replace('px', ''));
        original_height = parseFloat(getComputedStyle(element, null).getPropertyValue('height').replace('px', ''));
        original_x = element.getBoundingClientRect().left;
        original_y = element.getBoundingClientRect().top;
        original_mouse_x = e.pageX;
        original_mouse_y = e.pageY;
        window.addEventListener('mousemove', resize);
        window.addEventListener('mouseup', stopResize);
      })

      function resize(e) {
        if (currentResizer.classList.contains('bottom-right')) {
          const width = original_width + (e.pageX - original_mouse_x);
          const height = original_height + (e.pageY - original_mouse_y);
          if (width > minimum_size) {
            element.style.width = width + 'px';
          }
          if (height > minimum_size) {
            element.style.height = height + 'px';
          }
        }
        else if (currentResizer.classList.contains('bottom-left')) {
          const height = original_height + (e.pageY - original_mouse_y);
          const width = original_width - (e.pageX - original_mouse_x);
          if (height > minimum_size) {
            element.style.height = height + 'px';
          }
          if (width > minimum_size) {
            element.style.width = width + 'px';
            element.style.left = original_x + (e.pageX - original_mouse_x) + 'px';
          }
        }
        else if (currentResizer.classList.contains('top-right')) {
          const width = original_width + (e.pageX - original_mouse_x);
          const height = original_height - (e.pageY - original_mouse_y);
          if (width > minimum_size) {
            element.style.width = width + 'px';
          }
          if (height > minimum_size) {
            element.style.height = height + 'px';
            element.style.top = original_y + (e.pageY - original_mouse_y) + 'px';
          }
        }
        else {
          const width = original_width - (e.pageX - original_mouse_x);
          const height = original_height - (e.pageY - original_mouse_y);
          if (width > minimum_size) {
            element.style.width = width + 'px';
            element.style.left = original_x + (e.pageX - original_mouse_x) + 'px';
          }
          if (height > minimum_size) {
            element.style.height = height + 'px';
            element.style.top = original_y + (e.pageY - original_mouse_y) + 'px';
          }
        }
      }

      function stopResize() {
        window.removeEventListener('mousemove', resize);
      }
    }
  }

  makeResizableDiv('.resizable');
