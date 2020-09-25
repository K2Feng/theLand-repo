// view-triangles.js
// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'attribute vec4 a_Color;\n' +
  'uniform mat4 u_ViewMatrix;\n' +
  'uniform mat4 u_ModelMatrix;\n' +
  'varying vec4 v_Color;\n' +
  
  'void main() {\n' +
  '  gl_Position = u_ViewMatrix * u_ModelMatrix * a_Position;\n' + //Coordinates
  '  v_Color = a_Color;\n' + 
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  'precision mediump float;\n' +
  'varying vec4 v_Color;\n' +
  'void main() {\n' +
  '  gl_FragColor = v_Color;\n' + // Set the color
  '}\n';

// Rotation angle (degrees/seconds)
var ANGLE_STEP = 45.0;

function main() {
  // Retrieve <canvas> element
  var canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  var gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to initialize shaders.');
    return;
  }

  // Set the positions of the vertices
  var n = initVertexBuffers(gl);
  if (n < 0) {
    console.log('Failed to set the positions of the vertices');
  }
  
  // Set the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  
  // Get the storage location of the u_ModelMatrix variabble
  var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  
  // Get the storage location of the u_ViewMatrix variable
  var u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');

  // Set the eye point, look-at point, and up direction
  var viewMatrix = new Matrix4();
  viewMatrix.setLookAt(0.20, 0.25, 0.25, 0, 0, 0, 0, 1, 0);

  // Pass the view matrix to u_ViewMatrix variable
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
  
  // Create Matrix4 object for model transformation
  var modelMatrix = new Matrix4();

  // Calculate a model matrix
  var currentAngle = 0.0; // Rotate angle

  // Start to draw a triangle
  var tick = function(){
    currentAngle = animate(currentAngle); // Update the rotation angle
    draw(gl, n, currentAngle, modelMatrix, u_ModelMatrix);
    requestAnimationFrame(tick); // Request that the brower calls tick
  };
  tick();
}

function initVertexBuffers(gl) {
  var vertices = new Float32Array([
    0.0,  0.5,  -0.4,  0.4,  1.0,  0.4,   // The back green triangle
    -0.5, -0.5,  -0.4,  0.4,  1.0,  0.4,
    0.5, -0.5,  -0.4,  1.0,  0.4,  0.4,

    0.5,  0.4,  -0.2,  1.0,  0.4,  0.4,   // The middle yellow triangle
    -0.5,  0.4,  -0.2,  1.0,  1.0,  0.4,
    0.0, -0.6,  -0.2,  1.0,  1.0,  0.4,

    0.0,   0.5,  0.0,  0.4,  0.4, 1.0,     // The front blue triangle
    -0.5,  -0.5,  0.0,  0.4,  0.4, 1.0,
    0.5, -0.5,   0.0,  1.0,  0.4,  0.4
  ]);
  var n = 9;// the number of vertices

  var vbo = gl.createBuffer();// Create buffer object
  if (!vbo) {
    console.log('Failed to create the buffer object');
    return -1;
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  // Get the storage location of attribute variable

  var FSIZE = vertices.BYTES_PER_ELEMENT;

  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  } 
  var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
  if (a_Color < 0) {
    console.log('Failed to get the storage location of a_Color');
    return;
  } 

  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 24, 0);
  gl.enableVertexAttribArray(a_Position);

  gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, 24, 12);
  gl.enableVertexAttribArray(a_Color);
  return n;
}

function draw(gl, n, currentAngle, modelMatrix, u_ModelMatrix) {
  // Set up rotation matrix

  //modelMatrix.setTranslate(0.51, 0, 0); // set means from scrach, forget history
  //modelMatrix.setRotate(currentAngle, 0, 0, 1); // multiply from the right side of the translate matrix. another solution will be keep all the transform matrix separated and just pass them all to the vertex shader to multiply. more clear this way.


  // Pass the rotation matrix to the vertex shader
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Draw a triangle
  gl.drawArrays(gl.TRIANGLES, 0, n);
}

// Last time when this function was called
var g_last = Date.now();
function animate(angle) {
  // Calculate the elapsed time
  var now = Date.now();
  var elapsed = now - g_last; // milliseconds
  g_last = now;

  // Update the current rotation angle (adjusted bby the elapsed time)
  var newAngle = angle + (ANGLE_STEP * elapsed)/1000.0;
  return newAngle %= 360;
}

