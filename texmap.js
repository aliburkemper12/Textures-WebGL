"use strict";

var canvas;
var gl;

var numPositions  = 18; 
var numPositions2 = 24;
var numPositions3 = 6;
var numPositions4 = 180; // table
var numPositions5 = 6;

var texSize = 64;

var program;

var positionsArray = [];
var colorsArray = [];
var texCoordsArray = [];

// camera
var modelViewMatrixLoc, projectionMatrixLoc;
var modelViewMatrix, projectionMatrix;
var eye = vec3(0.0, 0.1, 1.5);
var at, up;

var flag = true;



// texturing
var texture; // brick
var texture2; // wallpaper
var texture3; // carpet
var texture4; // wood
var texture5; // dog
var texture6; // car
var texture7; // cat
var texture8; // rose
var texture9; // kid
var texture10; // family
var texture11; // frog


// images
var currentImage = 0;

var images = [
    "texImage5", // dog
    "texImage9", // kid
    "texImage10", // family
    "texImage11", // frog
]


var texCoord = [
    vec2(0, 1),
    vec2(0, 0),
    vec2(1, 0),
    vec2(1, 1)
];
// inside walls
var vertices = [
    vec4(-0.5, -0.5,  0.5, 1.0),
    vec4(-0.5,  0.5, 0.5, 1.0),
    vec4(0.5,  0.5, 0.5, 1.0),
    vec4(0.5, -0.5, 0.5, 1.0),
    vec4(-0.5, -0.5, -0.5, 1.0),
    vec4(-0.5,  0.5, -0.5, 1.0),
    vec4(0.5,  0.5, -0.5, 1.0),
    vec4(0.5, -0.5, -0.5, 1.0)
];
// outside walls
var outsideVertices = [
    vec4(-0.51, -0.51,  0.51, 1.0), 
    vec4(-0.51,  0.51,  0.51, 1.0),
    vec4( 0.51,  0.51,  0.51, 1.0),
    vec4( 0.51, -0.51,  0.51, 1.0),
    vec4(-0.51, -0.51, -0.51, 1.0),
    vec4(-0.51,  0.51, -0.51, 1.0),
    vec4( 0.51,  0.51, -0.51, 1.0),
    vec4( 0.51, -0.51, -0.51, 1.0)
];

// Table vertices
var tableVertices = [
    // table top
    vec4(-0.3, -0.2,  0.2, 1.0),  
    vec4(-0.3, -0.2, -0.2, 1.0),  
    vec4( 0.3, -0.2, -0.2, 1.0),  
    vec4( 0.3, -0.2,  0.2, 1.0),  
    
    vec4(-0.3, -0.25,  0.2, 1.0), 
    vec4(-0.3, -0.25, -0.2, 1.0),
    vec4( 0.3, -0.25, -0.2, 1.0), 
    vec4( 0.3, -0.25,  0.2, 1.0),  
    
    // front left leg
    vec4(-0.25, -0.25,  0.05, 1.0),
    vec4(-0.25, -0.25, -0.05, 1.0),
    vec4(-0.2,  -0.25, -0.05, 1.0), 
    vec4(-0.2,  -0.25,  0.05, 1.0),
    
    vec4(-0.25, -0.5,  0.05, 1.0), 
    vec4(-0.25, -0.5, -0.05, 1.0), 
    vec4(-0.2,  -0.5, -0.05, 1.0), 
    vec4(-0.2,  -0.5,  0.05, 1.0), 
    
    // front right leg
    vec4(0.2,  -0.25,  0.05, 1.0),  
    vec4(0.2,  -0.25, -0.05, 1.0), 
    vec4(0.25, -0.25, -0.05, 1.0), 
    vec4(0.25, -0.25,  0.05, 1.0),  
    
    vec4(0.2,  -0.5,  0.05, 1.0), 
    vec4(0.2,  -0.5, -0.05, 1.0), 
    vec4(0.25, -0.5, -0.05, 1.0), 
    vec4(0.25, -0.5,  0.05, 1.0), 
    
    // back left leg
    vec4(-0.25, -0.25, -0.05, 1.0), 
    vec4(-0.25, -0.25, -0.1, 1.0), 
    vec4(-0.2,  -0.25, -0.1, 1.0), 
    vec4(-0.2,  -0.25, -0.05, 1.0), 
    
    vec4(-0.25, -0.5, -0.05, 1.0), 
    vec4(-0.25, -0.5, -0.1, 1.0), 
    vec4(-0.2,  -0.5, -0.1, 1.0),  
    vec4(-0.2,  -0.5, -0.05, 1.0), 
    
    // back right leg
    vec4(0.2,  -0.25, -0.05, 1.0), 
    vec4(0.2,  -0.25, -0.1, 1.0),  
    vec4(0.25, -0.25, -0.1, 1.0),  
    vec4(0.25, -0.25, -0.05, 1.0),
    
    vec4(0.2,  -0.5, -0.05, 1.0),  
    vec4(0.2,  -0.5, -0.1, 1.0),  
    vec4(0.25, -0.5, -0.1, 1.0),  
    vec4(0.25, -0.5, -0.05, 1.0)  
];

// picture frame
// picture frame - standing upright on table
var frameVertices = [
    vec4(-0.1, -0.2,  0.05, 1.0),  // bottom left (on table surface)
    vec4(-0.1,  0.0,  0.05, 1.0),  // top left
    vec4( 0.1,  0.0,  0.05, 1.0),  // top right
    vec4( 0.1, -0.2,  0.05, 1.0)   // bottom right (on table surface)
];


var wallPic1Vertices = [
    vec4(-0.49,  -0.2,  0.2, 1.0),  // bottom left
    vec4(-0.49,  0.2,  0.2, 1.0),  // top left
    vec4(-0.49,  0.2,  -0.2, 1.0),  // top right
    vec4(-0.49,  -0.2,  -0.2, 1.0)   // bottom right
];

var wallPic2Vertices = [
    vec4(-0.2,  -0.2,  -0.49, 1.0),  // bottom left
    vec4(-0.2,  0.2,  -0.49, 1.0),  // top left
    vec4(0.2,  0.2,  -0.49, 1.0),  // top right
    vec4(0.2,  -0.2,  -0.49, 1.0)   // bottom right
];

var wallPic3Vertices = [
    vec4(0.49,  -0.2,  0.2, 1.0),  // bottom left
    vec4(0.49,  0.2,  0.2, 1.0),  // top left
    vec4(0.49,  0.2,  -0.2, 1.0),  // top right
    vec4(0.49,  -0.2,  -0.2, 1.0)   // bottom right
];

function configureTexture( image , textureUnit) {
    var tex = gl.createTexture();
    gl.activeTexture(textureUnit);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB,
         gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
                      gl.NEAREST_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    return tex;

    // gl.uniform1i(gl.getUniformLocation(program, "uTexMap"), 0);
}


function quad(a, b, c, d, array) {
    var color = vec4(0.0, 0.0, 0.0, 1.0)

     positionsArray.push(array[a]);
     colorsArray.push(color);
     texCoordsArray.push(texCoord[0]);

     positionsArray.push(array[b]);
     colorsArray.push(color);
     texCoordsArray.push(texCoord[1]);

     positionsArray.push(array[c]);
     colorsArray.push(color);
     texCoordsArray.push(texCoord[2]);

     positionsArray.push(array[a]);
     colorsArray.push(color);
     texCoordsArray.push(texCoord[0]);

     positionsArray.push(array[c]);
     colorsArray.push(color);
     texCoordsArray.push(texCoord[2]);

     positionsArray.push(array[d]);
     colorsArray.push(color);
     texCoordsArray.push(texCoord[3]);
}


function createRoom()
{
    // Right wall
    quad(2, 3, 7, 6, vertices);
    // left wall
    quad(0, 1, 5, 4, vertices);
    // back wall
    quad(4, 5, 6, 7, vertices);


    // reversed - right
    quad(6, 7, 3, 2, outsideVertices);
    //reversed - floor
    quad(7, 4, 0, 3, outsideVertices);
    // reversed - left
    quad(4, 5, 1, 0, outsideVertices);
    // reversed - right
    quad(7, 6, 5, 4, outsideVertices);

    // Floor (carpet)
    quad(3, 0, 4, 7, vertices);

    createTable();
    createFrame(frameVertices);
    createFrame(wallPic1Vertices);
    createFrame(wallPic2Vertices);
    createFrame(wallPic3Vertices)
}

function createTable() {
    // TABLE TOP
    quad(0, 1, 2, 3, tableVertices);  // Top surface
    quad(7, 6, 5, 4, tableVertices);  // Bottom surface
    quad(0, 4, 5, 1, tableVertices);  // Left side
    quad(3, 2, 6, 7, tableVertices);  // Right side
    quad(0, 3, 7, 4, tableVertices);  // Front side
    quad(1, 5, 6, 2, tableVertices);  // Back side
    
    // LEG 1 (front-left)
    quad(8, 9, 10, 11, tableVertices);    // Top
    quad(15, 14, 13, 12, tableVertices);  // Bottom
    quad(8, 12, 13, 9, tableVertices);    // Left
    quad(11, 10, 14, 15, tableVertices);  // Right
    quad(8, 11, 15, 12, tableVertices);   // Front
    quad(9, 13, 14, 10, tableVertices);   // Back
    
    // LEG 2 (front-right)
    quad(16, 17, 18, 19, tableVertices);
    quad(23, 22, 21, 20, tableVertices);
    quad(16, 20, 21, 17, tableVertices);
    quad(19, 18, 22, 23, tableVertices);
    quad(16, 19, 23, 20, tableVertices);
    quad(17, 21, 22, 18, tableVertices);
    
    // LEG 3 (back-left)
    quad(24, 25, 26, 27, tableVertices);
    quad(31, 30, 29, 28, tableVertices);
    quad(24, 28, 29, 25, tableVertices);
    quad(27, 26, 30, 31, tableVertices);
    quad(24, 27, 31, 28, tableVertices);
    quad(25, 29, 30, 26, tableVertices);
    
    // LEG 4 (back-right)
    quad(32, 33, 34, 35, tableVertices);
    quad(39, 38, 37, 36, tableVertices);
    quad(32, 36, 37, 33, tableVertices);
    quad(35, 34, 38, 39, tableVertices);
    quad(32, 35, 39, 36, tableVertices);
    quad(33, 37, 38, 34, tableVertices);
}

function createFrame(array) {
    quad(0, 1, 2, 3, array);
}



window.onload = function init() {

    canvas = document.getElementById("gl-canvas");

    gl = canvas.getContext('webgl2');
    if (!gl) alert("WebGL 2.0 isn't available");

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    gl.enable(gl.DEPTH_TEST);
    
    // Disable backface culling
    gl.disable(gl.CULL_FACE);

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // camera
    // modelViewMatrix = lookAt(vec3(0.0, 13.0, 15.0), vec3(0.0, 0.0, 0.0), vec3(0.0, 1.0, 0.0));
    projectionMatrix = perspective(80.0, canvas.width / canvas.height, 0.1, 100.0);

    modelViewMatrixLoc = gl.getUniformLocation(program, "uModelViewMatrix");
    projectionMatrixLoc = gl.getUniformLocation(program, "uProjectionMatrix");

    // gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));


    createRoom();

    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW );

    var colorLoc = gl.getAttribLocation(program, "aColor");
    gl.vertexAttribPointer(colorLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(colorLoc);

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(positionsArray), gl.STATIC_DRAW);

    var positionLoc = gl.getAttribLocation(program, "aPosition");
    gl.vertexAttribPointer(positionLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);

    var tBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW);

    var texCoordLoc = gl.getAttribLocation(program, "aTexCoord");
    gl.vertexAttribPointer(texCoordLoc, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(texCoordLoc);

    //
    // Initialize a texture
    //
    // brick
    var image = document.getElementById("texImage");
    texture = configureTexture(image, gl.TEXTURE0);
    // wallpaper
    var image2 = document.getElementById("texImage2");
    texture2 = configureTexture(image2, gl.TEXTURE1);
    /// carpet
    var image3 = document.getElementById("texImage3");
    texture3 = configureTexture(image3, gl.TEXTURE2);
    // wood
    var image4 = document.getElementById("texImage4");
    texture4 = configureTexture(image4, gl.TEXTURE3);
    // dog
    var image5 = document.getElementById("texImage5");
    texture5 = configureTexture(image5, gl.TEXTURE4);
    // car
    var image6 = document.getElementById("texImage6");
    texture6 = configureTexture(image6, gl.TEXTURE5);
    // cat
    var image7 = document.getElementById("texImage7");
    texture7 = configureTexture(image7, gl.TEXTURE6);
    /// rose
    var image8 = document.getElementById("texImage8");
    texture8 = configureTexture(image8, gl.TEXTURE7);
    // kid
    var image9 = document.getElementById("texImage9");
    texture9 = configureTexture(image9, gl.TEXTURE8);
    // family
    var image10 = document.getElementById("texImage10");
    texture10 = configureTexture(image10, gl.TEXTURE9);
    // frog
    var image11 = document.getElementById("texImage11");
    texture11 = configureTexture(image11, gl.TEXTURE10);


    gl.uniform1i(gl.getUniformLocation(program, "uTextureMap"), 0);


    // button left
    document.getElementById("left").addEventListener("click", function() {
        eye = vec3(-1.2, eye[1], eye[2]);
    });
    // button middle
    document.getElementById("middle").addEventListener("click", function() {
        eye = vec3(0.0, eye[1], eye[2]);
    });
    // button right
    document.getElementById("right").addEventListener("click", function() {
        eye = vec3(1.2, eye[1], eye[2]);
    });

    // // button prev
    // document.getElementById("prev").addEventListener("click", function() {
    //     if (flag) { // get prev image
    //         currentImage--;
    //         if (currentImage < 0) {
    //             currentImage = images.length - 1;
    //         }
    //         var imgId = images[currentImage];
    //         gl.activeTexture(gl.TEXTURE4);
    //         gl.bindTexture(gl.TEXTURE_2D, texture5);
    //         gl.uniform1i(gl.getUniformLocation(program, "uTextureMap"), 4);
    //         gl.drawArrays(gl.TRIANGLES, numPositions + numPositions2 + numPositions3 + numPositions4, numPositions5);
    //     }
    // });
    // // button play
    // document.getElementById("play").addEventListener("click", function() {
    //     if (flag) { // start
    //         flag = false;
    //         //change btn to 'pause'
    //         document.getElementById("play").innerHTML = "Pause";

    //     }
    //     else { // stop
    //         flag = true;
    //         document.getElementById("play").innerHTML = "Play";
    //     }
    // });
    // // button next
    // document.getElementById("next").addEventListener("click", function() {
    //     if (flag) { // get next image

    //     }
    // });


    render();

}

var render = function() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // camera
    // update modelView matrix based on eye position
    modelViewMatrix = lookAt(eye, vec3(0.0, 0.0, 0.0), vec3(0.0, 1.0, 0.0));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    // gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));

    // brick
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture2);
    gl.uniform1i(gl.getUniformLocation(program, "uTextureMap"), 0);
    gl.drawArrays(gl.TRIANGLES, 0, numPositions);


    // wallpaper
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.uniform1i(gl.getUniformLocation(program, "uTextureMap"), 1);
    gl.drawArrays(gl.TRIANGLES, numPositions, numPositions2);

    // carpet
    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, texture3);
    gl.uniform1i(gl.getUniformLocation(program, "uTextureMap"), 2);
    gl.drawArrays(gl.TRIANGLES, numPositions + numPositions2, numPositions3);


    // wood table
    gl.activeTexture(gl.TEXTURE3);
    gl.bindTexture(gl.TEXTURE_2D, texture4);
    gl.uniform1i(gl.getUniformLocation(program, "uTextureMap"), 3);
    gl.drawArrays(gl.TRIANGLES, numPositions + numPositions2 + numPositions3, numPositions4);

    // frame
    gl.activeTexture(gl.TEXTURE4);
    gl.bindTexture(gl.TEXTURE_2D, texture5);
    gl.uniform1i(gl.getUniformLocation(program, "uTextureMap"), 4);
    gl.drawArrays(gl.TRIANGLES, numPositions + numPositions2 + numPositions3 + numPositions4, numPositions5);

    // left wall
    gl.activeTexture(gl.TEXTURE5);
    gl.bindTexture(gl.TEXTURE_2D, texture6);
    gl.uniform1i(gl.getUniformLocation(program, "uTextureMap"), 5);
    gl.drawArrays(gl.TRIANGLES, numPositions + numPositions2 + numPositions3 + numPositions4 + numPositions5, numPositions5);

    // back wall
    gl.activeTexture(gl.TEXTURE6);
    gl.bindTexture(gl.TEXTURE_2D, texture7);
    gl.uniform1i(gl.getUniformLocation(program, "uTextureMap"), 6);
    gl.drawArrays(gl.TRIANGLES, numPositions + numPositions2 + numPositions3 + numPositions4 + numPositions5 + 1*numPositions5, numPositions5);


    // right wall
    gl.activeTexture(gl.TEXTURE7);
    gl.bindTexture(gl.TEXTURE_2D, texture8);
    gl.uniform1i(gl.getUniformLocation(program, "uTextureMap"), 7);
    gl.drawArrays(gl.TRIANGLES, numPositions + numPositions2 + numPositions3 + numPositions4 + numPositions5 + 2*numPositions5, numPositions5);

    requestAnimationFrame(render);
}