var i = 0;
images = [];
$canvas = $('#canvascontainer');
var isDragging = false;
var startX;
var startY;
//this.canvas = document.getElementById("canvascontainer");
canvas = new fabric.Canvas('canvascontainer');
//this.ctx = this.canvas.getContext("2d");
descriptionElem = document.getElementById("descriptionElem");
sizeElem = document.getElementById("sizeElem");
materialElem = document.getElementById("materialElem");
priceElem = document.getElementById("priceElem");
tablePrice = document.getElementById("tablePrice");
tableTotalPrice = document.getElementById("tableTotalPrice");
materials = ["Wood", "Steel", "Iron"];
total = 0;
var itemCounter = 1;
var imgSrc;
rods = [];
initialX= 1100;
initialY = 300;
nearestRod = [];
twentyTwoInch = 220;
thirtyThreeInch = 330;

var canvasContainer = document.getElementById('canvas-container');
canvasContainer.addEventListener('dragenter', handleDragEnter, false);
canvasContainer.addEventListener('dragover', handleDragOver, false);
canvasContainer.addEventListener('dragleave', handleDragLeave, false);
canvasContainer.addEventListener('drop', handleDrop, false);
canvas.hoverCursor = 'pointer';

function handleDragEnter(e) {
  // this / e.target is the current hover target.
  this.classList.add('over');
  console.log("DragEnter:" + e);
}

function handleDragLeave(e) {
  this.classList.remove('over'); // this / e.target is previous target element.
  console.log("DragLeave:"+ e);
}
function handleDrop(e) {
  // this / e.target is current target element.
  e.preventDefault();

  if (e.stopPropagation) {
    e.stopPropagation(); // stops the browser from redirecting.
  }
  var img = new Image();
  img.src = draggedImg.src;
  img.alt = draggedImg.alt;
  img.width = draggedImg.naturalWidth;
  img.height = draggedImg.naturalHeight;
  var x = e.layerX;
  var y = e.layerY;
  checkforCanvasRods(img, x, y);
  placeotherElemets(img,x,y);
  for (var i = 0; i < canvas.getObjects().length; i++) {
    // canvas.item(i).lockMovementX = true;
    canvas.item(i).lockRotation = true;
    // canvas.item(i).hasControls = false;
  }
  canvas.renderAll();
  return false;
}
function handleDragOver(e) {
  if (e.preventDefault) {
    e.preventDefault(); // Necessary. Allows us to drop.
  }

  e.dataTransfer.dropEffect = 'copy'; // See the section on the DataTransfer object.

  return false;
}
function addToCanvas(img, x, y) {
  var newImage = new fabric.Image(img, {
    width: img.width,
    height: img.height,
    // Set the center of the new object based on the event coordinates relative
    // to the canvas container.
    // left: e.layerX,
    // top: e.layerY
    left: x,
    top: y
  });
  canvas.add(newImage);
  canvas.renderAll();
}
function checkforCanvasRods(img, x, y) {
  rodDivState = document.getElementById("item1").style.display;
  if (rodDivState != "none" && rods.length == 0) {
    addToCanvas(img, initialX, initialY);
    updateTablePrice(img);
    rods.push({
      image: img,
      x: initialX,
      y: 0
    });
    return;
  }
  else if (rodDivState != "none" && rods.length > 0) {
    for (var i = 0; i < rods.length; i++) {
      diff = rods[i].x - x;
      nearestRod.push({
        img:img,
        modDiff:Math.abs(diff),
        diff:diff,
        x:rods[i].x
      });
    }
    nearestRod.sort((a, b) => (a.modDiff > b.modDiff) ? 1 : -1)
    if (nearestRod[0].diff > 0)
    x = nearestRod[0].x - twentyTwoInch
    else
    x = nearestRod[0].x + twentyTwoInch
    addToCanvas(img, x, initialY);
    updateTablePrice(img);
    rods.push({
      image: img,
      x: x,
      y: 0
    });
    return;
  }
}
function placeotherElemets(img,x,y){
  rodDivState = document.getElementById("item1").style.display;
  if (rodDivState == "none" && rods.length >= 2) {
    addToCanvas(img,x,y);
    updateTablePrice(img);
  }else{
    return;
  }
}
$('body').keydown(function (event) {
  if (event.keyCode == 46) {
    var activeObject = canvas.getActiveObject();
    if (activeObject) {
      if (confirm('Are you sure?')) {
        canvas.remove(activeObject);
        var imgSrc = activeObject.getSrc();
        imgSrc = imgSrc.split("/");
        imgSrc = imgSrc[imgSrc.length-1];
        imgSrc = imgSrc.split(".")[0];
        delParticularElem(imgSrc);
      }
    }
  }
});
function changeColor(color) {
  color = event.srcElement.value;
  var activeObject = canvas.getActiveObject();
  if (activeObject != null) {
    var oldImgSrc = activeObject.getSrc().split("$");
    var newImgSrc = oldImgSrc[0] + "$" + color + "@2x.png";
    var b = oldImgSrc[1].split("@");
    if (b[0] != "") {
      b[0] = color;
      newImgSrc = oldImgSrc[0] + "$" + color + "@2x.png"
    }
    activeObject.setSrc(newImgSrc, function () {
      canvas.renderAll();
    });

  }
}
function download(event) {
  this.href = canvas.toDataURL('png');
  this.download = 'canvas.png'
}

$(document).ready(function () {
  $(".nav-link").click(function () {
    $(".nav-link").removeClass('active');
    $(".itemcontainer").hide();
    $("#" + $(this).attr("div-id") + "").show();
    $(this).addClass('active');
  });
});
function dragimg(ev) {
  //ev.dataTransfer.setData("text", ev.target.id);
  draggedImg = ev.srcElement;
}
function updateDescription(event) {

  descriptionElem.innerText = event.srcElement.src.split("/")[4].split(".")[0] + " Selected";
  sizeElem.innerText = " " + (Math.random() * 1000).toFixed() + "X" + (Math.random() * 1000).toFixed() + "X" + (Math.random() * 1000).toFixed();
  var material = " " + materials[Math.floor(Math.random() * materials.length)];
  materialElem.innerText = " " + material;
  priceElem.innerText = " " + event.srcElement.alt;
}
function allowImgDrop(ev) {
  ev.preventDefault();
}
function insertNewRow(img) {
  var botmRow = tablePrice.tBodies[0].insertRow(-1);
  cell = botmRow.insertCell(0);
  cell.innerText = itemCounter;
  itemCounter++;
  cell = botmRow.insertCell(1);
  name = imgPath.split("/")[4];
  cell.classList.add('cell-ellipsis');
  cell.innerText = name.split(".")[0];
  cell = botmRow.insertCell(2);
  cell.innerText = "Size here";
  cell = botmRow.insertCell(3);
  cell.innerText = "1";
  cell = botmRow.insertCell(4);
  priceArrayelem = img.alt;
  priceArrayelem = parseFloat(priceArrayelem);
  cell.innerText = priceArrayelem;
}
function updateTablePrice(img) {
  imgPath = img.src;
  elemSearch = (imgPath.split("/")[4]).split(".")[0];
  var found = false;
  if (tablePrice.tBodies[0].rows.length != 0) {
    for (var i = 0; i < tablePrice.tBodies[0].rows.length; i++) {
      if (elemSearch === tablePrice.tBodies[0].rows[i].cells[1].innerText) {
        var qty = parseInt(tablePrice.tBodies[0].rows[i].cells[3].innerText);
        qty = qty + 1;
        tablePrice.tBodies[0].rows[i].cells[3].innerText = qty;
        calculateTotalAmount();
        found = true;
        break;
      }
    }
    if (!found) {
      insertNewRow(img);
      priceArrayelem = img.alt;
      priceArrayelem = parseFloat(priceArrayelem);
      //total = total + priceArrayelem;
      calculateTotalAmount();
    }
  } else {
    insertNewRow(img);
    priceArrayelem = img.alt;
    priceArrayelem = parseFloat(priceArrayelem);
    //total = total + priceArrayelem;
    calculateTotalAmount();
  }
}
function clearCanvas() {
  // var ctx = canvas.getContext("2d");
  // ctx.clearRect(0, 0, canvas.width, canvas.height);
  canvas.clear();
  images = [];
  rods = [];
  itemCounter = 1;
  //clear table rows also
  var a = tablePrice.tBodies[0].rows.length;
  //dont use tbody length directly in loop it will change dynamically as it del row therefore row lenght will also del 
  //and last row will never del thus, take initial len of row and del them one by one
  for (var i = 0; i < a; i++) {
    tablePrice.deleteRow(1);
  }
  //clear table footer also
  for (var i = 0; i < tablePrice.tFoot.rows.length; i++) {
    tablePrice.tFoot.rows[i].cells[1].innerText = "";
  }
}
function delParticularElem(elem){
  var a = tablePrice.tBodies[0].rows.length;
  for (var i = 0; i < a; i++) {
    if (tablePrice.tBodies[0].rows[i].cells[1].innerText === elem && tablePrice.tBodies[0].rows[i].cells[3].innerText === 1){
      tablePrice.tBodies[0].deleteRow(i);
      return;
    }
    else if (tablePrice.tBodies[0].rows[i].cells[1].innerText === elem && tablePrice.tBodies[0].rows[i].cells[3].innerText > 1){
      tablePrice.tBodies[0].rows[i].cells[3].innerText = tablePrice.tBodies[0].rows[i].cells[3].innerText-1;
      return;
    }
  }
}
function calculateTotalAmount() {
  var qty;
  total = 0;
  for (var i = 0; i < tablePrice.tBodies[0].rows.length; i++) {
    qty = parseInt(tablePrice.tBodies[0].rows[i].cells[3].innerText);
    price = parseFloat(tablePrice.tBodies[0].rows[i].cells[4].innerText);
    itemTotal = qty * price;
    total = total + itemTotal;
    //  if (tablePrice.tBodies[0].rows.length > 1){
    //   total = total + itemTotal;
    //  }else{
    //    total = itemTotal;
    //  }

  }

  tablePrice.tFoot.rows[0].cells[1].innerText = total.toFixed(2);
  gst = 0.18 * total;
  tablePrice.tFoot.rows[1].cells[1].innerText = gst.toFixed(2);
  estimateAmount = total + gst;
  tablePrice.tFoot.rows[2].cells[1].innerText = estimateAmount.toFixed(2);
}
function Imgdrop(ev) {
  ev.preventDefault();
  var data = ev.dataTransfer.getData("text");
  var nodeCopy = document.getElementById(data).cloneNode(true);
  nodeCopy.id = "newImg" + i; /* We cannot use the same ID */
  i++;
  var img = new Image();
  img.height = 100;
  img.width = 100;
  img.src = nodeCopy.src;
  img.alt = nodeCopy.alt;
  img.draggable = true;
  updateTablePrice(img);
  this.canvas.add(img);
  // if (images.length < 1)
  // this.ctx.drawImage(img, 200, 10);
  // else{
  //   lastImg = images[images.length-1];
  //   newX = lastImg.x + 100;
  //   newY = lastImg.y;
  //   this.ctx.drawImage(img, newX, newY);
  // }
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
  img.onload = function () {
    // _MouseEvents();
  };
}
function _MouseEvents() {
  this.canvas.onmousedown = function (e) {
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
  this.canvas.onmousemove = function (e) {
    // do nothing if we're not dragging
    if (!isDragging) { return; }

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
  this.canvas.onmouseup = function (e) {
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
  this.canvas.onmouseout = function (e) {
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
  //this.ctx.fillStyle = "#ffffff";

  //following code will repeat grid image 
  /*
  this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  img = new Image();
  img.src = "./gridopacity.png";
  var pattern = this.ctx.createPattern(img, 'repeat');
  this.ctx.fillStyle = pattern;
  this.ctx.fill();
  */

  this.ctx.clearRect(0, 0, canvas.width, canvas.height);

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
