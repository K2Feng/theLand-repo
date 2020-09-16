// DrawRectangle.js
function main() {
  // Retrieve <canvas> element
  var canvas = document.getElementById('example');
  if (!canvas) {
    console.log('Failed to retrieve the <canvas> element');
    return;
  }

  //get the rendering context for 2DCG
  var ctx = canvas.getContext('2d');
  // Draw a bblue retangle
  ctx.fillStyle = 'rgba(0, 0, 255, 1.0)';//blue color
  ctx.fillRect(120, 10, 150, 150); // Fill a rectangle with the color
}
