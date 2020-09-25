// view-triangles.js
// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'attribute vec4 a_Color;\n' +
  'uniform mat4 u_ViewMatrix;\n' +
  'uniform mat4 u_ProjMatrix;\n' +
  'uniform mat4 u_ModelMatrix;\n' +
  'varying vec4 v_Color;\n' +
  
  'void main() {\n' +
  '  gl_Position = u_ProjMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;\n' + //Coordinates
  '  v_Color = a_Color;\n' + 
  '  gl_PointSize = 10.0;\n' +
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
  
  // Set the color for clearing <canvas> and enable depth buffer
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);
  
  // Get the storage location of the u_ModelMatrix variabble
  var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  
  // Get the storage location of the u_ViewMatrix and u_ProjMatrix variable
  var u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  var u_ProjMatrix = gl.getUniformLocation(gl.program, 'u_ProjMatrix');

  // Set the eye point, look-at point, and up direction
  var viewMatrix = new Matrix4();
  viewMatrix.setLookAt(0.0, 0.0, 1.0, 0, 0, 0, 0, 1, 0);

  // Set the projection matrix
  var projMatrix = new Matrix4();
  projMatrix.setPerspective(60, canvas.width/canvas.height, 1, 100); // angle, ratio, near, far

  // Pass the view matrix to u_ViewMatrix and u_ProjMatrix variable
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
  gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);
  
  
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
    -0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, -0.5, 0.5, -0.5, -0.5, 0.5, //front 0 1 2 3
	-0.5, -0.5, -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, -0.5, -0.5, 0.5, -0.5, //back 4 5 6 7
	-0.5, 0.5, -0.5, -0.5, 0.5, 0.5, -0.5, -0.5, 0.5, -0.5, -0.5, -0.5, //left 8 9 10 11
	0.5, -0.5, -0.5, 0.5, -0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, -0.5, //right 12 13 14 15
	0.5, 0.5, -0.5, 0.5, 0.5, 0.5, -0.5, 0.5, 0.5, -0.5, 0.5, -0.5, // top 16 17 18 19
	-0.5, -0.5, -0.5, -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, 0.5, -0.5, -0.5 // bottom 20 21 22 23
  ]);

  var colors = new Float32Array([
    1.0, 0.4, 0.4,  1.0, 0.4, 0.4,  1.0, 0.4, 0.4,  1.0, 0.4, 0.4,//front red
    1.0, 0.4, 0.4,  1.0, 0.4, 0.4,  1.0, 0.4, 0.4,  1.0, 0.4, 0.4,//botton red
	0.4, 1.0, 0.4,  0.4, 1.0, 0.4,  0.4, 1.0, 0.4,  0.4, 1.0, 0.4,//left yellow     
	0.4, 1.0, 0.4,  0.4, 1.0, 0.4,  0.4, 1.0, 0.4,  0.4, 1.0, 0.4,//right yellow     
    0.4, 0.4, 1.0,  0.4, 0.4, 1.0,  0.4, 0.4, 1.0,  0.4, 0.4, 1.0,//top blue    
    0.4, 0.4, 1.0,  0.4, 0.4, 1.0,  0.4, 0.4, 1.0,  0.4, 0.4, 1.0//bottom blue    
  ]);

  var indices = new Uint8Array([
    0, 1, 3,  1, 2, 3,
	4, 5, 7,  5, 6, 7,
	8, 9, 11, 9, 10, 11,
	12, 13, 15, 13, 14, 15,
	16, 17, 19, 17, 18, 19,
	20, 21, 23, 21, 22, 23
  ]);
  
  // Call the function initArrayBuffer to init vertex and color buffer
  if (!initArrayBuffer(gl, vertices, 3, gl.FLOAT, 'a_Position')) {
    console.log('Failed to init the vertex buffer');
	return -1;
  }

  if (!initArrayBuffer(gl, colors, 3, gl.FLOAT, 'a_Color')) {
    console.log('Failed to init the color buffer');
	return -1;
  }

  var indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

  return indices.length;
}

function draw(gl, n, currentAngle, modelMatrix, u_ModelMatrix) {
  // Set up rotation matrix

  modelMatrix.setTranslate(0, 0, -2.0); // set means from scrach, forget history
  modelMatrix.rotate(currentAngle, 0, 1, 1); // multiply from the right side of the translate matrix. another solution will be keep all the transform matrix separated and just pass them all to the vertex shader to multiply. more clear this way.


  // Pass the rotation matrix to the vertex shader
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

  // clear color and depth buffer bit 
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Draw a triangle
  gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
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

// the initArrayBuffer function
function initArrayBuffer(gl, data, num, type, attribute) {
  
  var buffer = gl.createBuffer();// Create buffer object
  if (!buffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

  // Get the storage location of attribute variable
  var a_Attribute = gl.getAttribLocation(gl.program, attribute);
  if (a_Attribute < 0) {
    console.log('Failed to get the storage location of a_Attribute');
    return;
  } 

  gl.vertexAttribPointer(a_Attribute, num, type, false, 0, 0);
  gl.enableVertexAttribArray(a_Attribute);

  return true;
}
