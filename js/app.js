var i = 0;
images = [];
$canvas = $('#canvascontainer');
var isDragging = false;
var startX;
var startY;
this.canvas = document.getElementById("canvascontainer");
this.ctx = this.canvas.getContext("2d");
descriptionElem = document.getElementById("descriptionElem");
sizeElem = document.getElementById("sizeElem");
materialElem = document.getElementById("materialElem");
priceElem = document.getElementById("priceElem");
tablePrice = document.getElementById("tablePrice");
tableTotalPrice = document.getElementById("tableTotalPrice");
materials = ["Wood", "Steel", "Iron"];
total = 0;
var itemCounter = 1;
$(document).ready(function () {
  $(".nav-link").click(function () {
    $(".nav-link").removeClass('active');
    $(".itemcontainer").hide();
    $("#" + $(this).attr("div-id") + "").show();
    $(this).addClass('active');
  });
});

function dragimg(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
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
    if (!found){
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
  var ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  images = [];
  //clear table rows also
  var a = tablePrice.tBodies[0].rows.length;
  //dont use tbody length directly in loop it will change dynamically as it del row therefore row lenght will also del 
  //and last row will never del thus, take initial len of row and del them one by one
  for (var i = 0;i < a; i++){
    tablePrice.deleteRow(1);
  }
  //clear table footer also
  for (var i = 0;i < tablePrice.tFoot.rows.length; i++){
    tablePrice.tFoot.rows[i].cells[1].innerText = "";
  }
}
function calculateTotalAmount() {
  var qty;
  total = 0;
  for (var i = 0; i < tablePrice.tBodies[0].rows.length; i++) {
     qty = parseInt(tablePrice.tBodies[0].rows[i].cells[3].innerText);
     price = parseFloat(tablePrice.tBodies[0].rows[i].cells[4].innerText);
     itemTotal  = qty * price;
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
  img.src = nodeCopy.src;
  img.alt = nodeCopy.alt;
  img.draggable = true;
  updateTablePrice(img);
  this.ctx.drawImage(img, ev.offsetX, ev.offsetY);
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
    _MouseEvents();
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
