// Square.js
// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'attribute float a_PointSize;\n' +
  
  'void main() {\n' +
  '  gl_Position = a_Position;\n' + //Coordinates
  '  gl_PointSize = a_PointSize;\n' + // Set the point size
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  'void main() {\n' +
  '  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' + // Set the color
  '}\n';

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

  // Set the pointSize of the points 
  var a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');
  gl.vertexAttrib1f(a_PointSize, 5.0);
  
  if (a_PointSize < 0) {
    console.log('Failed to get the storage location of a_PointSize');
    return;
  } 

  // Set the positions of the vertices
  var n = initVertexBuffers(gl);
  if (n < 0) {
    console.log('Failed to set the positions of the vertices');
  }

  // Set the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Draw a point
  gl.drawArrays(gl.TRIANGLE_FAN, 0, n);
}

function initVertexBuffers(gl) {
  var vertices = new Float32Array([
    -0.5, 0.5, -0.5, -0.5, 0.5, -0.5, 0.5, 0.5 
  ]);
  var n = 4; // the number of vertices

  var vbo = gl.createBuffer();// Create buffer object
  if (!vbo) {
    console.log('Failed to create the buffer object');
    return -1;
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  // Get the storage location of attribute variable
  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  } 
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Position);

  
  return n;
}

