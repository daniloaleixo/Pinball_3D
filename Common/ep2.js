
var gl;
var canvas;
var program;


//Esfera
var esfera = {
    vertices: [],
    normais: [],
    textureCoord: [],
    indices: [],
    index: 0
};
var sphereNormalsBuffer, sphereVertexPositionBufffer, sphereTextureCoordBuffer, sphereIndexBuffer;

var texture;


    
var lightPosition = vec4(1.0, 1.0, 1.0, 0.0 );
var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0 );
var lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
var lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );

var chrome  = {
    materialAmbient: vec4( 0.25, 0.25, 0.25, 1.0 ),
    materialDiffuse: vec4( 0.4, 0.4, 0.4, 1.0 ),
    materialSpecular: vec4( 0.774, 0.774, 0.774, 1.0 ),
    materialShininess: 5.0
};


var ctm;
var ambientColor, diffuseColor, specularColor;

//Contamos o numero de frames ate termos uma jogada
const NUMERO_DE_FRAMES_ATE_ATUALIZAR = 10; 


var near = 1.0;
var far = 100;
var radius = 4.0;
var theta  = 0.0;
var phi    = 0.0;
var dr = 5.0 * Math.PI/180.0;


var  fovy = 45.0;  // Field-of-view in Y direction angle (in degrees)
var  aspect;       // Viewport aspect ratio

const at = vec3(0.0, 0.0, 0.0);
const up = vec3(0.0, 1.0, 0.0);

var left = -5.0;
var right = 5.0;
var ytop = 2.5;
var bottom = -2.5;

var modelMatrix, viewMatrix, projectionMatrix;

var  parameters = {
    screenWidth: 0,
    screenHeight: 0
};

window.onload = function init()
{

    /* 
        Inicializamos o canvas 
    */
    canvas = document.getElementById( "gl-canvas" );

    aspect =  canvas.width/canvas.height;

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
    gl.viewportWidth = canvas.width;
    gl.viewportHeight = canvas.height;


    // se redimensionarmos a janela o canvas se altera automaticamente
    onWindowResize();
    window.addEventListener( 'resize', onWindowResize, false );


    gl.viewport( 0, 0, gl.viewportWidth, gl.viewportHeight );

    gl.clearColor( 0.2, 0.2, 0.2, 1.0 );
    
    gl.enable(gl.DEPTH_TEST);
    
    //
    //  Load shaders 
    //
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    //Texture Coords
    program.textureCoordAttribute = gl.textureCoordAttribute = 
                gl.getAttribLocation(program, "vTextureCoord");
    gl.enableVertexAttribArray(program.textureCoordAttribute);  

    //Normais
    program.normalsAttribute = gl.normalsAttribute = 
                gl.getAttribLocation(program, "vNormal");
    gl.enableVertexAttribArray(program.normalsAttribute);

    //Vertices
    program.vertexPositionAttribute = gl.vertexPositionAttribute = 
                                                gl.getAttribLocation(program, "vPosition");
    gl.enableVertexAttribArray(program.vertexPositionAttribute);


    ambientProduct = mult(lightAmbient, chrome.materialAmbient);
    diffuseProduct = mult(lightDiffuse, chrome.materialDiffuse);
    specularProduct = mult(lightSpecular, chrome.materialSpecular);



    // 
    //  ESFERA
    //

/*
    //octaedro inicial
    verticesIniciais = [
        [1.0, 0.0, 0.0], 
        [0.0, 0.0, -1.0],
        [0.0, 1.0, 0.0], 
        [0.0, 0.0, 1.0],
        [0.0, -1.0, 0.0],
        [-1.0, 0.0, 0.0]
    ];

    octaedro(verticesIniciais[0], verticesIniciais[1], verticesIniciais[2], 
        verticesIniciais[3], verticesIniciais[4], verticesIniciais[5], 3);



    //Buffer de normais da esfera
    sphereNormalsBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, sphereNormalsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(esfera.normais), gl.STATIC_DRAW);


    //Buffer de posiçao da esfera
    sphereVertexPositionBufffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexPositionBufffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(esfera.vertices), gl.STATIC_DRAW);*/



    initTexture();

    initBuffers();

    //Pega a localizacao das matrizes de model, view e projection
    program.modelMatrix = gl.getUniformLocation( program, "modelMatrix" );
    program.viewMatrix = gl.getUniformLocation(program, "viewMatrix");
    program.projectionMatrix = gl.getUniformLocation( program, "projectionMatrix" );
    program.samplerUniform = gl.getUniformLocation(program, "uSampler");


    gl.uniform4fv( gl.getUniformLocation(program, 
       "ambientProduct"),flatten(ambientProduct) );
    gl.uniform4fv( gl.getUniformLocation(program, 
       "diffuseProduct"),flatten(diffuseProduct) );
    gl.uniform4fv( gl.getUniformLocation(program, 
       "specularProduct"),flatten(specularProduct) );   
    gl.uniform4fv( gl.getUniformLocation(program, 
       "lightPosition"),flatten(lightPosition) );
    gl.uniform1f( gl.getUniformLocation(program, 
       "shininess"),chrome.materialShininess );

       
    render();
 
}

function render()
{

    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);

    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    aspect = gl.viewportWidth / gl.viewportHeight;
    
    var eye = vec3( radius*Math.sin(theta)*Math.cos(phi), 
                    radius*Math.sin(theta)*Math.sin(phi),
                    radius*Math.cos(theta));
    
    modelMatrix = identityMatrix();
    viewMatrix = lookAt( eye, at, up );


    projectionMatrix = perspective(fovy, aspect, near, far);
    
    setMatrixUniforms(modelMatrix, viewMatrix, projectionMatrix);



    gl.clearColor( 0.2, 0.2, 0.2, 1.0 );

    console.log("vou desenhar");/*

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, )
    

    gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexPositionBufffer);
    gl.vertexAttribPointer(program.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
    gl.vertexAttribPointer(program.normalsAttribute, 3, gl.FLOAT, false, 0, 0);
    setMatrixUniforms(modelMatrix, viewMatrix, projectionMatrix);
            
    gl.drawArrays(gl.TRIANGLES, 0, esfera.vertices.length);*/
    
    console.log(esfera.vertices);
    console.log(esfera.normais);
    console.log(esfera.indices);
    console.log(textureCoord);

    desenhaEsfera();
}

// _______________________________________
//
//



//
// _______________________________________

function tick(){
    requestAnimFrame(tick);
    render();
    animar();
}

function setMatrixUniforms(modelMatrix, viewMatrix, projectionMatrix){
    gl.uniformMatrix4fv( program.modelMatrix, false, flatten(modelMatrix) );
    gl.uniformMatrix4fv( program.viewMatrix, false, flatten(viewMatrix) );
    gl.uniformMatrix4fv( program.projectionMatrix, false, flatten(projectionMatrix) );
}

var ultimo = 0;
var rSphere = 1.0;
function animar()
{
    var agora = new Date().getTime();
    if(ultimo != 0)
    {
        var diferenca = agora - ultimo;
        rSphere += ((75 * diferenca) /100/NUMERO_DE_FRAMES_ATE_ATUALIZAR) % 360.0;
    }
    ultimo = agora;
}

function initBuffers() {

    var latitudeBands = 30;
    var longitudeBands = 30;
    var radius = 2;


    for (var latNumber = 0; latNumber <= latitudeBands; latNumber++) {
        var theta = latNumber * Math.PI / latitudeBands;
        var sinTheta = Math.sin(theta);
        var cosTheta = Math.cos(theta);

        for (var longNumber = 0; longNumber <= longitudeBands; longNumber++) {
            var phi = longNumber * 2 * Math.PI / longitudeBands;
            var sinPhi = Math.sin(phi);
            var cosPhi = Math.cos(phi);

            var x = cosPhi * sinTheta;
            var y = cosTheta;
            var z = sinPhi * sinTheta;
            var u = 1 - (longNumber / longitudeBands);
            var v = 1 - (latNumber / latitudeBands);

            esfera.normais.push(x);
            esfera.normais.push(y);
            esfera.normais.push(z);
            esfera.textureCoord.push(u);
            esfera.textureCoord.push(v);
            esfera.vertices.push(radius * x);
            esfera.vertices.push(radius * y);
            esfera.vertices.push(radius * z);
        }
    }

    for (var latNumber = 0; latNumber < latitudeBands; latNumber++) {
        for (var longNumber = 0; longNumber < longitudeBands; longNumber++) {
            var first = (latNumber * (longitudeBands + 1)) + longNumber;
            var second = first + longitudeBands + 1;
            esfera.indices.push(first);
            esfera.indices.push(second);
            esfera.indices.push(first + 1);

            esfera.indices.push(second);
            esfera.indices.push(second + 1);
            esfera.indices.push(first + 1);
        }
    }

    sphereNormalsBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, sphereNormalsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(esfera.normais), gl.STATIC_DRAW);
    sphereNormalsBuffer.itemSize = 3;
    sphereNormalsBuffer.numItems = esfera.normais.length / 3;

    sphereTextureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, sphereTextureCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(esfera.textureCoord), gl.STATIC_DRAW);
    sphereTextureCoordBuffer.itemSize = 2;
    sphereTextureCoordBuffer.numItems = esfera.textureCoord.length / 2;

    sphereVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(esfera.vertices), gl.STATIC_DRAW);
    sphereVertexPositionBuffer.itemSize = 3;
    sphereVertexPositionBuffer.numItems = esfera.vertices.length / 3;

    sphereIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(esfera.indices), gl.STATIC_DRAW);
    sphereIndexBuffer.itemSize = 1;
    sphereIndexBuffer.numItems = esfera.indices.length;
}

function initTexture() {
    texture = gl.createTexture();
    texture.image = new Image();
    texture.image.onload = function () {
        handleLoadedTexture(texture)
    }

    texture.image.src = "chrome.jpg";
}

function handleLoadedTexture(texture) {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
    gl.generateMipmap(gl.TEXTURE_2D);

    gl.bindTexture(gl.TEXTURE_2D, null);
}

function desenhaEsfera()
{
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.uniform1i(program.samplerUniform, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexPositionBuffer);
    gl.vertexAttribPointer(program.vertexPositionAttribute, sphereVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, sphereTextureCoordBuffer);
    gl.vertexAttribPointer(program.textureCoordAttribute, sphereTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, sphereNormalsBuffer);
    gl.vertexAttribPointer(program.vertexNormalAttribute, sphereNormalsBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereIndexBuffer);
    setMatrixUniforms();
    gl.drawElements(gl.TRIANGLES, sphereIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}
/*
function octaedro(a, b, c, d, e, f, i)
{
    divideTriangle( a, b, c, i);
    divideTriangle( a, c, d, i);
    divideTriangle( a, d, e, i);
    divideTriangle( a, e, b, i);
    divideTriangle( f, b, c, i);
    divideTriangle( f, c, d, i);
    divideTriangle( f, d, e, i);
    divideTriangle( f, e, b, i);
}

function divideTriangle(a, b, c, i)
{
    if ( i === 0 ) {
        normalizar(a);
        normalizar(b);
        normalizar(c);
        triangle( a, b, c);
    } else {

        var ab = mix( a, b, 0.5 );
        var ac = mix( a, c, 0.5 );
        var bc = mix( b, c, 0.5 );

        // lift midpoints on the sphere
        normalizar(ab);
        normalizar(ac);
        normalizar(bc);

        --i;

        // four new triangles
        
        divideTriangle( a, ab, ac, i );
        divideTriangle( c, ac, bc, i );
        divideTriangle( b, bc, ab, i );
        divideTriangle( ab, ac, bc, i );
    }
    
}

function triangle( a, b, c)
{
    var t1 = subtract(b, a);
    var t2 = subtract(c, a);
    var normal = normalize(cross(t1, t2));
    normal = vec4(normal);

    esfera.normais.push(normal);
    esfera.normais.push(normal);
    esfera.normais.push(normal);

    esfera.vertices.push(a);
    esfera.vertices.push(b);
    esfera.vertices.push(c);

    esfera.index += 3;
}*/

function normalizar(a)
{
    var aux = Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2]);
    a[0] /= aux;
    a[1] /= aux;
    a[2] /= aux;
}



// Caso a janela seja redimensionada, atualizamos o canvas
// para manter o mesmo aspecto na janela 
function onWindowResize( event ) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  parameters.screenWidth = canvas.width;
  parameters.screenHeight = canvas.height;

  gl.viewportWidth = canvas.width;
  gl.viewportHeight = canvas.height;
}




/*
function cube(a, b, c, d, e, f, g, h)
{
    quad( b, a, d, c );
    quad( c, d, h, g );
    quad( d, a, e, h );
    quad( g, f, b, c );
    quad( e, f, g, h );
    quad( f, e, a, b );
}*/
/*
function quad(a, b, c, d)
{
    divideTriangle(a, b, c);
    divideTriangle(a, c, d);
}

function divideTriangle(a, b, c)
{
    /*console.log("a: " + a);
    console.log("b: " + b);
    console.log("c: " + c);

    verticesCubo.push(a[0]);
    verticesCubo.push(a[1]);
    verticesCubo.push(a[2]);
    verticesCubo.push(b[0]);
    verticesCubo.push(b[1]);
    verticesCubo.push(b[2]);
    verticesCubo.push(c[0]);
    verticesCubo.push(c[1]);
    verticesCubo.push(c[2]);
}*/