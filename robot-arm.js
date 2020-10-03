// light-cube.js
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'attribute vec4 a_Color;\n' +
  'attribute vec4 a_Normal;\n' +
  'uniform mat4 u_MVPMatrix;\n' +
  'uniform mat4 u_NormalMatrix;\n' +
  'uniform vec3 u_LightColor;\n' +
  'uniform vec3 u_LightDirection;\n' +
  'varying vec4 v_Color;\n' +
  
  'void main() {\n' +
  '  gl_Position = u_MVPMatrix * a_Position;\n' + //Coordinates
  '  vec3 normal = -normalize(vec3(u_NormalMatrix * a_Normal));\n' +
  //'  vec3 normal = normalize(vec3(a_Normal));\n' + 
  '  vec3 light = normalize(u_LightDirection);\n' + 
  // Dot product the normalized light direction and the normal of the surface
  '  float nDotL =  max(dot(light, normal), 0.0);\n' +
  // Calculate the diffuse color
  '  vec3 diffuse = u_LightColor * vec3(a_Color) * nDotL;\n' +
  '  vec3 ambient = u_LightColor * a_Color.rgb * 0.4;\n' +
  //'  v_Color = a_Color;\n' + 
  '  v_Color = vec4(diffuse + ambient, a_Color.a);\n' + 
  '  gl_PointSize = 10.0;\n' +
  '}\n';

var FSHADER_SOURCE =
  'precision mediump float;\n' +
  'varying vec4 v_Color;\n' +
  'void main() {\n' +
  '  gl_FragColor = v_Color;\n' + // Set the color
  '}\n';

function main() {
  var canvas = document.getElementById('webgl');
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
	return;
  }
  
  // Set the color for clearing <canvas> and enable depth buffer
  gl.clearColor(0.0, 0.5, 0.5, 1.0);
  gl.enable(gl.DEPTH_TEST);

  // Set Direct light color and direction
  var u_LightColor = gl.getUniformLocation(gl.program, 'u_LightColor');
  var u_LightDirection = gl.getUniformLocation(gl.program, 'u_LightDirection');
  var lightColor = new Vector3([1.0, 1.0, 1.0]);
  var lightDirection = new Vector3([0.5, -1.0, -4.0]);
  lightDirection.normalize();

  gl.uniform3fv(u_LightColor, lightColor.elements);
  gl.uniform3fv(u_LightDirection, lightDirection.elements);
  
  var modelMatrix = new Matrix4();
  var viewProjMatrix = new Matrix4();
  var mvpMatrix = new Matrix4();
  // Set view and perspect matrix 
  //viewProjMatrix.setPerspective(100, canvas.width/canvas.height, 1, 100);//angle ratio near far
  //viewProjMatrix.setLookAt(0, -0.5, 3, 0, 0, 0, 0, 1, 0);

  viewProjMatrix.setPerspective(40.0, canvas.width / canvas.height, 1.0, 100.0);
  viewProjMatrix.lookAt(3.0, 2.0, 10.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);
  // Get the storage location of the u_ModelMatrix variabble
  var u_MVPMatrix = gl.getUniformLocation(gl.program, 'u_MVPMatrix');
  var u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  //var angle1 = 0.0, angle2 = 0.0;
  draw(gl, n, 0.0, 0.0, modelMatrix, viewProjMatrix, u_NormalMatrix, u_MVPMatrix); 

  document.onkeydown = function(ev){ keydown(ev, gl, n, modelMatrix, viewProjMatrix,  u_NormalMatrix, u_MVPMatrix); };
}

function draw(gl, n, angle1, angle2,  modelMatrix, viewProjMatrix, u_NormalMatrix, u_MVPMatrix) {
/***
  var colors = new Float32Array([
    1.0, 0.4, 0.4,  1.0, 0.4, 0.4,  1.0, 0.4, 0.4,  1.0, 0.4, 0.4,//front red
    1.0, 0.4, 0.4,  1.0, 0.4, 0.4,  1.0, 0.4, 0.4,  1.0, 0.4, 0.4,//botton red
	0.4, 1.0, 0.4,  0.4, 1.0, 0.4,  0.4, 1.0, 0.4,  0.4, 1.0, 0.4,//left yellow     
	0.4, 1.0, 0.4,  0.4, 1.0, 0.4,  0.4, 1.0, 0.4,  0.4, 1.0, 0.4,//right yellow     
    0.4, 0.4, 1.0,  0.4, 0.4, 1.0,  0.4, 0.4, 1.0,  0.4, 0.4, 1.0,//top blue    
    0.4, 0.4, 1.0,  0.4, 0.4, 1.0,  0.4, 0.4, 1.0,  0.4, 0.4, 1.0//bottom blue    
  ]);
***/

  let colors = [];
  let color = [1.0, 1.0, 1.0];
  for(let i = 0; i < 24; i++){
	colors = colors.concat(color);
  }
  console.log(colors[1]); 
  if (!initArrayBuffer(gl, new Float32Array(colors), 3, gl.FLOAT, 'a_Color')) {
    console.log('Failed to init the color buffer');
  }
  // draw lower box
  var angle = angle1;
  modelMatrix.setTranslate(-0.3, 0, 2);
  modelMatrix.rotate(angle, 1, 1, 0);  
  drawBox(gl, n, angle, 0.5, 0.2, 0.5, modelMatrix, viewProjMatrix, u_NormalMatrix, u_MVPMatrix);//draw top arm;

  // draw up box
  angle = angle2;
  modelMatrix.setTranslate(0.3, 0, 2);
  modelMatrix.rotate(angle, 1, 1, 1);  
  drawBox(gl, n, angle, 0.2, 0.3, 0.4, modelMatrix, viewProjMatrix, u_NormalMatrix, u_MVPMatrix);//draw top arm;

  // draw ground
  angle = 0.0;
  modelMatrix.setTranslate(0, -0.5, 2);
  modelMatrix.rotate(angle, 1, 1, 1);  
  drawBox(gl, n, angle, 4, 0.5, 1, modelMatrix, viewProjMatrix, u_NormalMatrix, u_MVPMatrix);//draw top arm;
}

function drawBox(gl, n, angle, width, height, depth, modelMatrix, viewProjMatrix, u_NormalMatrix, u_MVPMatrix){
  modelMatrix.scale(width, height, depth);
  var mvpMatrix = new Matrix4();
  var normalMatrix = new Matrix4();
  mvpMatrix.set(viewProjMatrix);
  mvpMatrix = mvpMatrix.multiply(modelMatrix);
  normalMatrix.setInverseOf(modelMatrix);
  normalMatrix.transpose();
  //feed matrix to VS;
  gl.uniformMatrix4fv(u_MVPMatrix, false, mvpMatrix.elements);//mvp
  gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);//normal
  gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE,0);
}


var angle1 = 0.0, angle2= 0.0;
function keydown(ev, gl, n, modelMatrix, viewProjMatrix, u_NormalMatrix, u_MVPMatrix) {
  if(ev.keyCode == 39) { // The right arrow key was pressed
    angle1+= 1;
  } else
  if (ev.keyCode == 37) { // The left arrow key was pressed
    angle1 -= 1;
  } else  // Prevent unnecessary drawing

  if(ev.keyCode == 40) { // The right arrow key was pressed
    angle2 += 1;
  } else
  if (ev.keyCode == 38) { // The left arrow key was pressed
    angle2 -= 1;
  } else { return; } // Prevent unnecessary drawing
  
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  draw(gl, n, angle1, angle2, modelMatrix, viewProjMatrix, u_NormalMatrix, u_MVPMatrix);
}

// initVertexBuffers function which will pass all arrays and uniform
// in this case, pass position, color, normal and indices buffers and bind them to shader
// indices buffer just need be bond not pass to shader
function initVertexBuffers(gl) {
  var vertices = new Float32Array([
    -0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, -0.5, 0.5, -0.5, -0.5, 0.5, //front 0 1 2 3
	-0.5, -0.5, -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, -0.5, -0.5, 0.5, -0.5, //back 4 5 6 7
	-0.5, 0.5, -0.5, -0.5, 0.5, 0.5, -0.5, -0.5, 0.5, -0.5, -0.5, -0.5, //left 8 9 10 11
	0.5, -0.5, -0.5, 0.5, -0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, -0.5, //right 12 13 14 15
	0.5, 0.5, -0.5, 0.5, 0.5, 0.5, -0.5, 0.5, 0.5, -0.5, 0.5, -0.5, // top 16 17 18 19
	-0.5, -0.5, -0.5, -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, 0.5, -0.5, -0.5 // bottom 20 21 22 23
]);


  var normals = new Float32Array([
    0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,    
    0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 
	-1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, 
	1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 
	0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0,0,
	0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0,0,
  ]);

  var indices = new Uint8Array([
    0, 3, 1,  1, 3, 2,
	4, 7, 5,  5, 7, 6,
	8, 11, 9, 9, 11, 10,
	12, 15, 13, 13, 15, 14,
	16, 19, 17, 17, 19, 18,
	20, 23, 21, 21, 23, 22 
  ]);
  
  // Call the function initArrayBuffer to init vertex and color buffer
  if (!initArrayBuffer(gl, vertices, 3, gl.FLOAT, 'a_Position')) {
    console.log('Failed to init the vertex buffer');
	return -1;
  }


  if (!initArrayBuffer(gl, normals, 3, gl.FLOAT, 'a_Normal')) {
    console.log('Failed to init the normal buffer');
	return -1;
  }
  var indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

  return indices.length;
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
