
var gl;
var canvas;
var program;

//___________________________________________

//Light parameters    
var lightPosition = vec4(-1.0, -1.0, -10.0, 0.0 );
var lightAmbient = vec4(0.1, 0.2, 0.1, 1.0 );
var lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
var lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );
// __________________________________________

//chrome material
var chrome  = {
    materialAmbient: vec4( 0.25, 0.25, 0.25, 1.0 ),
    materialDiffuse: vec4( 0.4, 0.4, 0.4, 1.0 ),
    materialSpecular: vec4( 0.774, 0.774, 0.774, 1.0 ),
    materialShininess: 15.0
};

var mesaMaterial1 = {
    materialAmbient: vec4( 0.5, 0.5, 0.5, 1.0 ),
    materialDiffuse: vec4( 0.1, 0.1, 0.1, 1.0 ),
    materialSpecular: vec4( 0.9, 0.9, 0.9, 1.0 ),
    materialShininess: 100.0
}
//_____________________________________________

//Esfera
var esfera = {
    posicao: [0.0, 0.0],
    vertices: [],
    normais: [],
    textures: [],
    indices: [],
    posicao: [0.0, 0.0, 0.0],
    index: 0, 
    raio: 2,
    texturaPointer: 0
};
var sphereNormalsBuffer, sphereVertexPositionBuffer, sphereTextureCoordBuffer;
var numBolas = 3;

// _______________________________________

var paletas = {
    incrementoAngulo: 7.5,
    anguloMaximo: 60,
    rotatingRadiusEsq: 0,
    emMovimentoEsq: false,
    indoEsq: false,
    voltandoEsq: false, 
    rotatingRadiusDir: 0,
    emMovimentoDir: false,
    indoDir: false,
    voltandoDir: false,
};


//__________________________________

//Mesa do pinball
// 

var fundo = {       vertices: [], normais: [], textures: [], indices: [], 
                    vertexPositionBuffer: 0, normalsBuffer: 0, textureCoordBuffer: 0   };
var esquerda = {    vertices: [], normais: [], textures: [], indices: [], 
                    vertexPositionBuffer: 0, normalsBuffer: 0, textureCoordBuffer: 0   };
var direita = {    vertices: [], normais: [], textures: [], indices: [], 
                    vertexPositionBuffer: 0, normalsBuffer: 0, textureCoordBuffer: 0   };
var cima = {        vertices: [], normais: [], textures: [], indices: [], 
                    vertexPositionBuffer: 0, normalsBuffer: 0, textureCoordBuffer: 0   };
var cornerEsq = {      vertices: [], normais: [], textures: [], indices: [], 
                    vertexPositionBuffer: 0, normalsBuffer: 0, textureCoordBuffer: 0   };
var cornerDir = {      vertices: [], normais: [], textures: [], indices: [], 
                    vertexPositionBuffer: 0, normalsBuffer: 0, textureCoordBuffer: 0   };
var corredorEsq = {    vertices: [], normais: [], textures: [], indices: [], 
                    vertexPositionBuffer: 0, normalsBuffer: 0, textureCoordBuffer: 0   };
var corredorDir = {    vertices: [], normais: [], textures: [], indices: [], 
                    vertexPositionBuffer: 0, normalsBuffer: 0, textureCoordBuffer: 0   };
var cornerCorredorEsq = {      vertices: [], normais: [], textures: [], indices: [], 
                    vertexPositionBuffer: 0, normalsBuffer: 0, textureCoordBuffer: 0   };
var cornerCorredorDir = {      vertices: [], normais: [], textures: [], indices: [], 
                    vertexPositionBuffer: 0, normalsBuffer: 0, textureCoordBuffer: 0   };
var paleta = {    vertices: [], normais: [], textures: [], indices: [], 
                    vertexPositionBuffer: 0, normalsBuffer: 0, textureCoordBuffer: 0   };
var obstaculo1 = {    vertices: [], normais: [], textures: [], indices: [], 
                    vertexPositionBuffer: 0, normalsBuffer: 0, textureCoordBuffer: 0   };
var obstaculo2 = {    vertices: [], normais: [], textures: [], indices: [], 
                    vertexPositionBuffer: 0, normalsBuffer: 0, textureCoordBuffer: 0   };
var obstaculo3 = {    vertices: [], normais: [], textures: [], indices: [], 
                    vertexPositionBuffer: 0, normalsBuffer: 0, textureCoordBuffer: 0   };


var parametrosMesa = {
    largura: 60,
    altura: 10,
    profundidade: 100,
    coeficienteRestituicao: 0.7,
    larguraParede: 2,
    inclinacao: 45,
    cateto: 0,
    xMax: 0, xMin: 0,
    zMax: 0, zMin: 0,
    alturaRelacaoLarguraParede: 0
};
parametrosMesa.cateto = Math.sin(degToRad(parametrosMesa.inclinacao) ) * parametrosMesa.profundidade;
parametrosMesa.xMax = (parametrosMesa.largura/2) - parametrosMesa.larguraParede;
parametrosMesa.xMin = -(parametrosMesa.largura/2) + parametrosMesa.larguraParede;
parametrosMesa.zMin = (parametrosMesa.profundidade/2) - parametrosMesa.larguraParede;
parametrosMesa.zMax = -(parametrosMesa.profundidade/2);
//parametrosMesa.alturaRelacaoLarguraParede = Math.sin( degToRad( 90 - parametrosMesa.inclinacao ) ) * parametrosMesa.larguraParede;

// ______________________________________________



//Parametros Fisicos 
//
var angle, fAspect;
var deltaTempo, tempoAtual, tempoAnterior, deltaT;
var tempoContador = 0;


var desloc = [0.0, 0.0, 0.0];
var veloc = [0.0, 0.0, 0.0];
var forca = [0.0, 0.0, 0.0];

var grav = [0.0, -9.81, 0.0];
var massa = 1;

var tempoTranscorrido = 0.0;                                      
//var veloc0 = [-25.0, 0.0, 25.0];
var veloc0 = [0, 0, 45];

var ultimaColisao = 0;
// _______________________________________


var ctm;
var ambientColor, diffuseColor, specularColor;

//Contamos o numero de frames ate termos uma jogada
const NUMERO_DE_FRAMES_ATE_ATUALIZAR = 10; 


var near = 1.0;
var far = 100;
var radius = 20.0;
var theta  = 1.57;
var phi    = 1;
var dr = 2.0 * Math.PI/180.0;


var  fovy = 85;  // Field-of-view in Y direction angle (in degrees)
var  aspect;       // Viewport aspect ratio

const at = vec3(0.0, 0.0, 0.0);
const up = vec3(0.0, 1.0, 0.0);
/*
var left = -5.0;
var right = 5.0;
var ytop = 2.5;
var bottom = -2.5;*/

var modelMatrix, viewMatrix, projectionMatrix;

var  parameters = {
    screenWidth: 0,
    screenHeight: 0
};
// ______________________________

const KEY_DOWN = 40; 
const KEY_UP  = 38; 
const KEY_LEFT = 37; 
const KEY_RIGHT = 39; 
const BACKSPACE = 8;    
const HOME = 36;

var comecaJogo = false;

var pausado = false;

// __________________________-




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


    //Coordenadas da Textura
    program.textureAttribute = gl.textureAttribute = 
                gl.getAttribLocation(program, "vTexCoord");
    gl.enableVertexAttribArray(program.textureAttribute);

    //Normais
    program.normalsAttribute = gl.normalsAttribute = 
                gl.getAttribLocation(program, "vNormal");
    gl.enableVertexAttribArray(program.normalsAttribute);

    //Vertices
    program.vertexPositionAttribute = gl.vertexPositionAttribute = 
                                                gl.getAttribLocation(program, "vPosition");
    gl.enableVertexAttribArray(program.vertexPositionAttribute);



    inicializarTexturas();

    var x = [0, 1, 2, 3];

    var y = inverteIndices(x);
    console.log(y);


   //
   //   ESFERA
   //

   inicializaEsferaBuffers();

   inicializaMesaPinballBuffers();



    //Pega a localizacao das matrizes de model, view e projection
    program.modelMatrix = gl.getUniformLocation( program, "modelMatrix" );
    program.viewMatrix = gl.getUniformLocation(program, "viewMatrix");
    program.projectionMatrix = gl.getUniformLocation( program, "projectionMatrix" );

    //Pega a localizacao de ambientProduct, diffuseProduct, specularProduct e shininess
    program.ambientProduct = gl.getUniformLocation(program, "ambientProduct");
    program.diffuseProduct = gl.getUniformLocation(program, "diffuseProduct");
    program.specularProduct = gl.getUniformLocation(program, "specularProduct");
    program.shininess = gl.getUniformLocation(program, "shininess");

    //Pega a localizacao de uSampler
    program.samplerUniform = gl.getUniformLocation(program, "uSampler");



    gl.uniform4fv( gl.getUniformLocation(program, 
       "lightPosition"),flatten(lightPosition) );

    


    inicializaParticula();
    /*console.log("particula inicializada");
    console.log(veloc);
    console.log(esfera.posicao);
    console.log("rfedfsdfsdf");*/

    tempoAnterior = new Date().getTime();
       
    tick();
 
}

function render()
{

    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);

    gl.clear( gl.COLOR_BUFFER_BIT);

    aspect = gl.viewportWidth / gl.viewportHeight;
    
    var eye = vec3( radius*Math.sin(phi)*Math.cos(theta), 
                    radius*Math.sin(phi)*Math.sin(theta),
                    radius*Math.cos(phi));
    
    modelMatrix = identityMatrix();
    viewMatrix = lookAt( eye, at, up );
    viewMatrix =  mult(matrix4Translate(0, 15, -40), viewMatrix);
    //viewMatrix = mult(matrix4Rotate(90, [1,0,0]), viewMatrix);

    projectionMatrix = perspective(fovy, aspect, near, far);
    
    setMatrixUniforms(modelMatrix, viewMatrix, projectionMatrix);



    gl.clearColor( 0.2, 0.2, 0.2, 1.0 );


    console.log("novo valor a ser desenhado");
    console.log(esfera.posicao);

    desenhaEsfera();
    desenhaMesa();
    
}

// _______________________________________
//
//



//
// _______________________________________

document.onkeypress = function (e)
{
    var e = window.event || e;

    if(e.keyCode == KEY_RIGHT)
    {
        paletas.emMovimentoDir = true;
        if(paletas.voltandoDir == false) paletas.indoDir = true;
    }
    if(e.keyCode == KEY_LEFT)
    {
        paletas.emMovimentoEsq = true;
        if(paletas.voltandoEsq == false) paletas.indoEsq = true;
    }
    if(e.keyCode == KEY_UP)
    {
        comecaJogo = true;
    }
    if(e.keyCode == HOME)
    {
        if(pausado == true)
        {
            pausado = false;
        } else {
            pausado = true;
        }
    }
    if(e.keyCode == BACKSPACE)
    {
        inicializaParticula();
        numBolas = 3;
    }

}

function tick(){
    if(tempoContador >= 0)
    {
            requestAnimFrame(tick);
    animar();
    }

}

function setMatrixUniforms(modelMatrix, viewMatrix, projectionMatrix){
    gl.uniformMatrix4fv( program.modelMatrix, false, flatten(modelMatrix) );
    gl.uniformMatrix4fv( program.viewMatrix, false, flatten(viewMatrix) );
    gl.uniformMatrix4fv( program.projectionMatrix, false, flatten(projectionMatrix) );
}

function animar()
{
    tempoAtual = new Date().getTime();

    // Calcula tempo transcorrido desde o último frame em segundos
    deltaT = (tempoAtual - tempoAnterior) / 1000.0;

    // Salva tempo atual
    tempoAnterior = tempoAtual;

    // Armazena tempo de simulação
    tempoTranscorrido += deltaT;
    
    // Salva tempo atual
    tempoAnterior = tempoAtual;

    if(pausado == false )
    {
        if(comecaJogo == true)
        {
            // Calcula nova posição da partícula
             calculaParticula(deltaT); 

            trataColisoes();
            lidaFimDeJogo();
        

            tempoContador++;
            console.log(tempoContador);

            render(); 
        } else {
            if(tempoContador == 0)
            {
                // Calcula nova posição da partícula
                 calculaParticula(deltaT); 

                trataColisoes();
                lidaFimDeJogo();
            

                tempoContador++;
                console.log(tempoContador);

                render(); 
            }
        }
 
    }


}



function inicializaEsferaBuffers()
{
    var aux = getOBJ("OBJs/ball2.obj");

    esfera.vertices = aux[0];
    esfera.normais = aux[1];
    esfera.textures = aux[2];
    esfera.indices = aux[3];

    sphereTextureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, sphereTextureCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(esfera.textures), gl.STATIC_DRAW);


    sphereNormalsBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, sphereNormalsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(esfera.normais), gl.STATIC_DRAW);


    sphereVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(esfera.indices), gl.STATIC_DRAW);

    //esfera.posicao[0] = parametrosMesa.xMax - parametrosMesa.larguraParede;
    //esfera.posicao[1] = parametrosMesa.zMax - 7 * parametrosMesa.larguraParede;
}

function desenhaEsfera()
{

    ambientProduct = mult(lightAmbient, chrome.materialAmbient);
    diffuseProduct = mult(lightDiffuse, chrome.materialDiffuse);
    specularProduct = mult(lightSpecular, chrome.materialSpecular);

    gl.uniform4fv(program.ambientProduct, ambientProduct);
    gl.uniform4fv(program.diffuseProduct, diffuseProduct);
    gl.uniform4fv(program.specularProduct, specularProduct);
    gl.uniform1f( program.shininess, chrome.materialShininess);


    mPushMatrix();

    //modelMatrix = matrix4Translate(parametrosMesa.xMax, 1.0, parametrosMesa.zMin);
    modelMatrix = matrix4Translate(esfera.posicao[0], 
                                0, esfera.posicao[1]);
    //modelMatrix = identityMatrix();

    gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexPositionBuffer);
    gl.vertexAttribPointer(program.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, sphereNormalsBuffer);
    gl.vertexAttribPointer(program.normalsAttribute, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, sphereTextureCoordBuffer);
    gl.vertexAttribPointer(program.textureAttribute, 3, gl.FLOAT, false, 0, 0);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, esfera.texturaPointer);
    //console.log(program.samplerUniform);
    //console.log(esfera.texturaPointer);
    gl.uniform1i(program.samplerUniform,0);

    setMatrixUniforms(modelMatrix, viewMatrix, projectionMatrix);
            
    gl.drawArrays(gl.TRIANGLES, 0, esfera.indices.length/3);

    mPopMatrix();
}


//
//
//          Funçoes da fisica do jogo 
//
//
function inicializaParticula()
{
    forca[0] = forca[1] = forca[2] = 0.0;
    veloc[0] = veloc0[0];
    veloc[1] = veloc0[1];
    veloc[2] = veloc0[2];
    desloc[0] = 7/8 * parametrosMesa.xMax;
    desloc[1] = 0;
    desloc[2] = 9/10 * parametrosMesa.zMin;
    /*desloc[0] = 0;
    desloc[1] = 0;
    desloc[2] = -20;*/

}

function calculaParticula(deltaT)
{
    /*console.log("entrei na fuunçao");
    console.log(desloc);
    console.log(veloc);
    console.log(forca);*/
     // partícula Newtoniana
    for(var i=0; i<3; i++) {        
        
        // força da gravidade
        forca[i] = massa * grav[i];
        if(i == 1) forca[1] = massa * grav[1] * Math.cos(parametrosMesa.inclinacao);
        if(i == 2) forca[2] = massa * grav[1] * Math.sin(parametrosMesa.inclinacao);  
        //console.log("forca " + forca);     
        
        //console.log("forca: " + forca[i] + " = " + massa + " * " + grav[i]);                
        
        // calcula velocidade
        veloc[i] += (forca[i] / massa) * deltaT;
        //console.log("veloc " + veloc);
        
        // calcula novo deslocamento
        if(i == 2) desloc[2] -= veloc[2] * deltaT;
        else desloc[i] += veloc[i] * deltaT;
        //console.log("desloc " + desloc);        
    }
        
    /*if (desloc[1] <= 0.0) {
     
        inicializaParticula();
    
        //velocy0 /= 1.2;   // coefr = 0.8333
        veloc[0] = veloc0[0];
        veloc[1] = veloc0[1];
        veloc[2] = veloc0[2];
    //printf("veloc=%f\n",veloc[1]);
    }   */
        //printf("v=%f, d=%f, f=%f, dt=%f\n",veloc[1],desloc[1],forca[1],deltaT);

    esfera.posicao[0] = desloc[0];
    esfera.posicao[1] = desloc[2];
}


function movimentacaoPaletas()
{
    //Lidando com os movimentos das paletas    
    if(paletas.emMovimentoEsq == true)
    {
        if(paletas.indoEsq == true)
        {
            paletas.rotatingRadiusEsq += 2 * paletas.incrementoAngulo;
            if(paletas.rotatingRadiusEsq > paletas.anguloMaximo)
            {
                paletas.indoEsq = false;
                paletas.voltandoEsq = true;
            }
        } else {
            paletas.rotatingRadiusEsq -= paletas.incrementoAngulo;
            if(paletas.rotatingRadiusEsq <= 0) {
                paletas.voltandoEsq = false;
                paletas.emMovimentoEsq = false;
                paletas.rotatingRadiusEsq = 0;
            }
        }
    }
    if(paletas.emMovimentoDir == true)
    {
        if(paletas.indoDir == true)
        {
            paletas.rotatingRadiusDir += 2 * paletas.incrementoAngulo;
            if(paletas.rotatingRadiusDir > paletas.anguloMaximo)
            {
                paletas.indoDir = false;
                paletas.voltandoDir = true;
            }
        } else {
            paletas.rotatingRadiusDir -= paletas.incrementoAngulo;
            if(paletas.rotatingRadiusDir <= 0) {
                paletas.voltandoDir = false;
                paletas.emMovimentoDir = false;
                paletas.rotatingRadiusDir = 0;
            }
        }
    }
}

/*
Vamos utilizar flags para sabermos qual foi a ultima colisao realizada
*/
function trataColisoes()
{
    //lateral esquerda - 1
    if(esfera.posicao[0] - esfera.raio < parametrosMesa.xMin)
    {
        if(ultimaColisao != 1)
        {
            veloc[0] = -parametrosMesa.coeficienteRestituicao * veloc[0];
            ultimaColisao = 1;
        } 
    }

    //lateral direita - 2
    if(esfera.posicao[0] + esfera.raio > parametrosMesa.xMax)
    {
        if(ultimaColisao != 2)
        {
            veloc[0] = -parametrosMesa.coeficienteRestituicao * veloc[0];
            ultimaColisao = 2;
        } 
    }

    //cima - 3
     if(esfera.posicao[1] - esfera.raio < parametrosMesa.zMax)
    {
        if(ultimaColisao != 3)
        {
            veloc[2] = -parametrosMesa.coeficienteRestituicao * veloc[2];
            ultimaColisao = 3;   
        }
        
    }

    //corredor direito - 4
    if(esfera.posicao[1] - esfera.raio > -30)
    {   
        if( ( (esfera.posicao[0] - esfera.raio < -19.75) && (esfera.posicao[0] + esfera.raio > -17.75) ) || 
       ( (esfera.posicao[0] + esfera.raio > -18.75) && (esfera.posicao[0] - esfera.raio < -20.75) ) )
        {
            if(ultimaColisao != 4)
            {
                veloc[0] = -parametrosMesa.coeficienteRestituicao * veloc[0];
                ultimaColisao = 4;
            }   
        }
    

        //corredor esquerdo - 5
        if( (esfera.posicao[0] + esfera.raio > 19.04) && (esfera.posicao[0] - esfera.raio < 21.04) ||  
             (esfera.posicao[0] - esfera.raio < 20.04) && (esfera.posicao[0] + esfera.raio > 18.04) )
        {
            if(ultimaColisao != 5)
            {
                veloc[0] = -parametrosMesa.coeficienteRestituicao * veloc[0];
                ultimaColisao = 5;
            }   
        }
    }

    /*//corner direito - 6
    if(esfera.posicao[0] - esfera.posicao[1] >= 50)
    {
        if(ultimaColisao != 6)
        {
            //TODO 
            var normal = [-0.7, 0, -0.7];
            var normalx2 = [-1.4, 0, -1.4];
            var cosseno = mult(normal, normalize(veloc));
            var quase = mult(normalx2, cosseno);
            var vetorRefletido = subtract(quase, normalize(veloc) );
            veloc[0] = vetorRefletido[0]; veloc[2] = vetorRefletido[2];
            ultimaColisao = 6;
        }
    }

    //corner esquerdo - 7
    if(-esfera.posicao[0] + esfera.posicao[1] >= 50){
        if(ultimaColisao != 7)
        {
            //TODO 
            var normal = [-0.7, 0, -0.7];
            var normalx2 = [-1.4, 0, -1.4];
            var cosseno = mult(normal, normalize(veloc));
            var quase = mult(normalx2, cosseno);
            var vetorRefletido = subtract(quase, normalize(veloc) );
            veloc[0] = vetorRefletido[0]; veloc[2] = vetorRefletido[2];
            ultimaColisao = 7;
        }
    }*/
}

function inverteIndices(indices)
{
    var indicesInvertidos = [];
    for(i = 0; i < indices.length; i++)
    {
        indicesInvertidos.push(0);
    }
    for(i = 0; i < indices.length; i+= 3)
    {
        indicesInvertidos[i] = indices[indices.length - i - 3];
        indicesInvertidos[i + 1] = indices[indices.length - i - 2];
        indicesInvertidos[i + 2] = indices[indices.length - i - 1];
    }
    return indicesInvertidos;
}

function lidaFimDeJogo()
{
    if(numBolas > 0)
    {
            if(esfera.posicao[1] > 50)
        {
            inicializaParticula();
            ultimaColisao = 0;
            comecaJogo = false;
            sleep(5, alerta);
        }
    } else {
        document.write("FIM DE JOGO");
    }
}

function sleep(millis, callback) {
    setTimeout(function()
            { callback(); }
    , millis);
}

function alerta()
{
    alert("Perdeu uma bola!!! \n" + --numBolas + " bolas restantes");
}


function inicializarTexturas()
{
    var imagemEsfera = new Image();
    esfera.texturaPointer = gl.createTexture();
    esfera.texturaPointer.image = imagemEsfera;
    //console.log(esfera.texturaPointer.image);

    imagemEsfera.onload = function(){
        tratarTextura(esfera.texturaPointer);
    }
    imagemEsfera.src = "OBJs/usp.jpg";
}

function tratarTextura(texturas)
{
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);

    gl.bindTexture(gl.TEXTURE_2D, texturas);
    gl.activeTexture(gl.TEXTURE0);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texturas.image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
    gl.generateMipmap(gl.TEXTURE_2D);

    gl.bindTexture(gl.TEXTURE_2D, null);
}



//__________________________________________________________________
//________________________________________________________________
//________________________________________________________________


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


function degToRad(graus) {  return graus * Math.PI / 180; }

// ***************************************************************************
// ***************************************************************************
// ***************************************************************************
// ***************************************************************************

// ***************************************************************************
// ***************************************************************************
// ***************************************************************************
// ***************************************************************************
// ***************************************************************************


function inicializaMesaPinballBuffers()
{
    // FUNDO 
    var aux = getOBJ("OBJs/1_bottom.obj");

    fundo.vertices = aux[0];
    fundo.normais = aux[1];
    fundo.textures = aux[2];
    fundo.indices = aux[3];

    fundo.textureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, fundo.textureCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(fundo.textures), gl.STATIC_DRAW);

    fundo.normalsBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, fundo.normalsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(fundo.normais), gl.STATIC_DRAW);

    fundo.vertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, fundo.vertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(fundo.indices), gl.STATIC_DRAW);

    // ESQUERDA 
    var aux = getOBJ("OBJs/1_lateralEsq.obj");

    esquerda.vertices = aux[0];
    esquerda.normais = aux[1];
    esquerda.textures = aux[2];
    esquerda.indices = aux[3];

    esquerda.textureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, esquerda.textureCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(esquerda.textures), gl.STATIC_DRAW);

    esquerda.normalsBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, esquerda.normalsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(esquerda.normais), gl.STATIC_DRAW);

    esquerda.vertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, esquerda.vertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(esquerda.indices), gl.STATIC_DRAW);

    // DIREITA
    var aux = getOBJ("OBJs/1_lateralDir.obj");

    direita.vertices = aux[0];
    direita.normais = aux[1];
    direita.textures = aux[2];
    direita.indices = aux[3];

    direita.textureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, direita.textureCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(direita.textures), gl.STATIC_DRAW);

    direita.normalsBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, direita.normalsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(direita.normais), gl.STATIC_DRAW);

    direita.vertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, direita.vertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(direita.indices), gl.STATIC_DRAW);

    // CIMA
    var aux = getOBJ("OBJs/1_cima.obj");

    cima.vertices = aux[0];
    cima.normais = aux[1];
    cima.textures = aux[2];
    cima.indices = aux[3];

    cima.textureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cima.textureCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(cima.textures), gl.STATIC_DRAW);

    cima.normalsBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cima.normalsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cima.normais), gl.STATIC_DRAW);

    cima.vertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cima.vertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cima.indices), gl.STATIC_DRAW);

    // CORNER ESQUERDO
    var aux = getOBJ("OBJs/1_cornerEsq.obj");

    cornerEsq.vertices = aux[0];
    cornerEsq.normais = aux[1];
    cornerEsq.textures = aux[2];
    cornerEsq.indices = aux[3];

    cornerEsq.textureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cornerEsq.textureCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(cornerEsq.textures), gl.STATIC_DRAW);

    cornerEsq.normalsBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cornerEsq.normalsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cornerEsq.normais), gl.STATIC_DRAW);

    cornerEsq.vertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cornerEsq.vertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cornerEsq.indices), gl.STATIC_DRAW);

    // CORNER DIREITO
    var aux = getOBJ("OBJs/1_cornerDir.obj");

    cornerDir.vertices = aux[0];
    cornerDir.normais = aux[1];
    cornerDir.textures = aux[2];
    cornerDir.indices = aux[3];

    cornerDir.textureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cornerDir.textureCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(cornerDir.textures), gl.STATIC_DRAW);

    cornerDir.normalsBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cornerDir.normalsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cornerDir.normais), gl.STATIC_DRAW);

    cornerDir.vertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cornerDir.vertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cornerDir.indices), gl.STATIC_DRAW);

    // CORREDOR ESQUERDO
    var aux = getOBJ("OBJs/1_corredorEsq.obj");

    corredorEsq.vertices = aux[0];
    corredorEsq.normais = aux[1];
    corredorEsq.textures = aux[2];
    corredorEsq.indices = aux[3];

    corredorEsq.textureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, corredorEsq.textureCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(corredorEsq.textures), gl.STATIC_DRAW);

    corredorEsq.normalsBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, corredorEsq.normalsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(corredorEsq.normais), gl.STATIC_DRAW);

    corredorEsq.vertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, corredorEsq.vertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(corredorEsq.indices), gl.STATIC_DRAW);

    // CORREDOR DIREITO
    var aux = getOBJ("OBJs/1_corredorDir.obj");

    corredorDir.vertices = aux[0];
    corredorDir.normais = aux[1];
    corredorDir.textures = aux[2];
    corredorDir.indices = aux[3];

    corredorDir.textureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, corredorDir.textureCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(corredorDir.textures), gl.STATIC_DRAW);

    corredorDir.normalsBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, corredorDir.normalsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(corredorDir.normais), gl.STATIC_DRAW);

    corredorDir.vertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, corredorDir.vertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(corredorDir.indices), gl.STATIC_DRAW);

    // CORNER CORREDOR DIREITO
    var aux = getOBJ("OBJs/1_cornerCorredorDir.obj");

    cornerCorredorDir.vertices = aux[0];
    cornerCorredorDir.normais = aux[1];
    cornerCorredorDir.textures = aux[2];
    cornerCorredorDir.indices = aux[3];

    cornerCorredorDir.textureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cornerCorredorDir.textureCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(cornerCorredorDir.textures), gl.STATIC_DRAW);

    cornerCorredorDir.normalsBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cornerCorredorDir.normalsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cornerCorredorDir.normais), gl.STATIC_DRAW);

    cornerCorredorDir.vertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cornerCorredorDir.vertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cornerCorredorDir.indices), gl.STATIC_DRAW);

    // CORNER CORREDOR ESQUERDO
    var aux = getOBJ("OBJs/1_cornerCorredorEsq.obj");

    cornerCorredorEsq.vertices = aux[0];
    cornerCorredorEsq.normais = aux[1];
    cornerCorredorEsq.textures = aux[2];
    cornerCorredorEsq.indices = aux[3];

    cornerCorredorEsq.textureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cornerCorredorEsq.textureCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(cornerCorredorEsq.textures), gl.STATIC_DRAW);

    cornerCorredorEsq.normalsBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cornerCorredorEsq.normalsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cornerCorredorEsq.normais), gl.STATIC_DRAW);

    cornerCorredorEsq.vertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cornerCorredorEsq.vertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cornerCorredorEsq.indices), gl.STATIC_DRAW);

    // PALETA
    var aux = getOBJ("OBJs/1_paleta.obj");

    paleta.vertices = aux[0];
    paleta.normais = aux[1];
    paleta.textures = aux[2];
    paleta.indices = aux[3];

    paleta.textureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, paleta.textureCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(paleta.textures), gl.STATIC_DRAW);

    paleta.normalsBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, paleta.normalsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(paleta.normais), gl.STATIC_DRAW);

    paleta.vertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, paleta.vertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(paleta.indices), gl.STATIC_DRAW);

    // OBSTACULOS
    var aux = getOBJ("OBJs/1_obstaculo1.obj");
    obstaculo1.vertices = aux[0];
    obstaculo1.normais = aux[1];
    obstaculo1.textures = aux[2];
    obstaculo1.indices = aux[3];
    obstaculo1.textureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, obstaculo1.textureCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(obstaculo1.textures), gl.STATIC_DRAW);
    obstaculo1.normalsBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, obstaculo1.normalsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(obstaculo1.normais), gl.STATIC_DRAW);
    obstaculo1.vertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, obstaculo1.vertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(obstaculo1.indices), gl.STATIC_DRAW);

    var aux = getOBJ("OBJs/1_obstaculo2.obj");
    obstaculo2.vertices = aux[0];
    obstaculo2.normais = aux[1];
    obstaculo2.textures = aux[2];
    obstaculo2.indices = aux[3];
    obstaculo2.textureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, obstaculo2.textureCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(obstaculo2.textures), gl.STATIC_DRAW);
    obstaculo2.normalsBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, obstaculo2.normalsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(obstaculo2.normais), gl.STATIC_DRAW);
    obstaculo2.vertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, obstaculo2.vertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(obstaculo2.indices), gl.STATIC_DRAW);

    var aux = getOBJ("OBJs/1_obstaculo3.obj");
    obstaculo3.vertices = aux[0];
    obstaculo3.normais = aux[1];
    obstaculo3.textures = aux[2];
    obstaculo3.indices = aux[3];
    obstaculo3.textureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, obstaculo3.textureCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(obstaculo3.textures), gl.STATIC_DRAW);
    obstaculo3.normalsBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, obstaculo3.normalsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(obstaculo3.normais), gl.STATIC_DRAW);
    obstaculo3.vertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, obstaculo3.vertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(obstaculo3.indices), gl.STATIC_DRAW);

}


function desenhaMesa()
{

    ambientProduct = mult(lightAmbient, mesaMaterial1.materialAmbient);
    diffuseProduct = mult(lightDiffuse, mesaMaterial1.materialDiffuse);
    specularProduct = mult(lightSpecular, mesaMaterial1.materialSpecular);

    gl.uniform4fv(program.ambientProduct, ambientProduct);
    gl.uniform4fv(program.diffuseProduct, diffuseProduct);
    gl.uniform4fv(program.specularProduct, specularProduct);
    gl.uniform1f( program.shininess, mesaMaterial1.materialShininess);


    //  Fundo
    mPushMatrix();
    modelMatrix = matrix4Rotate(90, [0,1,0]);

    gl.bindBuffer(gl.ARRAY_BUFFER, fundo.vertexPositionBuffer);
    gl.vertexAttribPointer(program.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
  
    gl.bindBuffer(gl.ARRAY_BUFFER, fundo.normalsBuffer);
    gl.vertexAttribPointer(program.normalsAttribute, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, fundo.textureCoordBuffer);
    gl.vertexAttribPointer(program.textureAttribute, 3, gl.FLOAT, false, 0, 0);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, esfera.texturaPointer);
    gl.uniform1i(program.samplerUniform,0);

    setMatrixUniforms(modelMatrix, viewMatrix, projectionMatrix);
    mPopMatrix();
            
    gl.drawArrays(gl.LINE_STRIP, 0, fundo.indices.length/3);

    //  Esquerda
    mPushMatrix();

    modelMatrix = matrix4Rotate(90, [0,1,0]);

    gl.bindBuffer(gl.ARRAY_BUFFER, esquerda.vertexPositionBuffer);
    gl.vertexAttribPointer(program.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
  
    gl.bindBuffer(gl.ARRAY_BUFFER, esquerda.normalsBuffer);
    gl.vertexAttribPointer(program.normalsAttribute, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, esquerda.textureCoordBuffer);
    gl.vertexAttribPointer(program.textureAttribute, 3, gl.FLOAT, false, 0, 0);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, esfera.texturaPointer);
    gl.uniform1i(program.samplerUniform,0);

    setMatrixUniforms(modelMatrix, viewMatrix, projectionMatrix);
    mPopMatrix();
            
    gl.drawArrays(gl.LINE_STRIP, 0, esquerda.indices.length/3);

    //  Direta
    mPushMatrix();

    modelMatrix = matrix4Rotate(90, [0,1,0]);

    gl.bindBuffer(gl.ARRAY_BUFFER, direita.vertexPositionBuffer);
    gl.vertexAttribPointer(program.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
  
    gl.bindBuffer(gl.ARRAY_BUFFER, direita.normalsBuffer);
    gl.vertexAttribPointer(program.normalsAttribute, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, direita.textureCoordBuffer);
    gl.vertexAttribPointer(program.textureAttribute, 3, gl.FLOAT, false, 0, 0);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, esfera.texturaPointer);
    gl.uniform1i(program.samplerUniform,0);

    setMatrixUniforms(modelMatrix, viewMatrix, projectionMatrix);
    mPopMatrix();
            
    gl.drawArrays(gl.LINE_STRIP, 0, direita.indices.length/3);

    //  Cima
    mPushMatrix();

    modelMatrix = matrix4Rotate(90, [0,1,0]);

    gl.bindBuffer(gl.ARRAY_BUFFER, cima.vertexPositionBuffer);
    gl.vertexAttribPointer(program.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
  
    gl.bindBuffer(gl.ARRAY_BUFFER, cima.normalsBuffer);
    gl.vertexAttribPointer(program.normalsAttribute, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, cima.textureCoordBuffer);
    gl.vertexAttribPointer(program.textureAttribute, 3, gl.FLOAT, false, 0, 0);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, esfera.texturaPointer);
    gl.uniform1i(program.samplerUniform,0);

    setMatrixUniforms(modelMatrix, viewMatrix, projectionMatrix);
    mPopMatrix();
            
    gl.drawArrays(gl.LINE_STRIP, 0, cima.indices.length/3);

    //  Corner Esquerdo
    mPushMatrix();

    modelMatrix = matrix4Rotate(90, [0,1,0]);

    gl.bindBuffer(gl.ARRAY_BUFFER, cornerEsq.vertexPositionBuffer);
    gl.vertexAttribPointer(program.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
  
    gl.bindBuffer(gl.ARRAY_BUFFER, cornerEsq.normalsBuffer);
    gl.vertexAttribPointer(program.normalsAttribute, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, cornerEsq.textureCoordBuffer);
    gl.vertexAttribPointer(program.textureAttribute, 3, gl.FLOAT, false, 0, 0);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, esfera.texturaPointer);
    gl.uniform1i(program.samplerUniform,0);

    setMatrixUniforms(modelMatrix, viewMatrix, projectionMatrix);
    mPopMatrix();
            
    gl.drawArrays(gl.LINE_STRIP, 0, cornerEsq.indices.length/3);

    //  Corner Direito
    mPushMatrix();

    modelMatrix = matrix4Rotate(90, [0,1,0]);

    gl.bindBuffer(gl.ARRAY_BUFFER, cornerDir.vertexPositionBuffer);
    gl.vertexAttribPointer(program.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
  
    gl.bindBuffer(gl.ARRAY_BUFFER, cornerDir.normalsBuffer);
    gl.vertexAttribPointer(program.normalsAttribute, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, cornerDir.textureCoordBuffer);
    gl.vertexAttribPointer(program.textureAttribute, 3, gl.FLOAT, false, 0, 0);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, esfera.texturaPointer);
    gl.uniform1i(program.samplerUniform,0);

    setMatrixUniforms(modelMatrix, viewMatrix, projectionMatrix);
    mPopMatrix();
            
    gl.drawArrays(gl.LINE_STRIP, 0, cornerDir.indices.length/3);

    //  Corredor Esquerdo
    mPushMatrix();

    modelMatrix = matrix4Rotate(90, [0,1,0]);

    gl.bindBuffer(gl.ARRAY_BUFFER, corredorEsq.vertexPositionBuffer);
    gl.vertexAttribPointer(program.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
  
    gl.bindBuffer(gl.ARRAY_BUFFER, corredorEsq.normalsBuffer);
    gl.vertexAttribPointer(program.normalsAttribute, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, corredorEsq.textureCoordBuffer);
    gl.vertexAttribPointer(program.textureAttribute, 3, gl.FLOAT, false, 0, 0);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, esfera.texturaPointer);
    gl.uniform1i(program.samplerUniform,0);

    setMatrixUniforms(modelMatrix, viewMatrix, projectionMatrix);
    mPopMatrix();
            
    gl.drawArrays(gl.LINE_STRIP, 0, corredorEsq.indices.length/3);

    //  Corredor Direito
    mPushMatrix();

    modelMatrix = matrix4Rotate(90, [0,1,0]);

    gl.bindBuffer(gl.ARRAY_BUFFER, corredorDir.vertexPositionBuffer);
    gl.vertexAttribPointer(program.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
  
    gl.bindBuffer(gl.ARRAY_BUFFER, corredorDir.normalsBuffer);
    gl.vertexAttribPointer(program.normalsAttribute, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, corredorDir.textureCoordBuffer);
    gl.vertexAttribPointer(program.textureAttribute, 3, gl.FLOAT, false, 0, 0);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, esfera.texturaPointer);
    gl.uniform1i(program.samplerUniform,0);

    setMatrixUniforms(modelMatrix, viewMatrix, projectionMatrix);
    mPopMatrix();
            
    gl.drawArrays(gl.LINE_STRIP, 0, corredorDir.indices.length/3);

    //  Corner Corredor Direito
    mPushMatrix();

    modelMatrix = matrix4Rotate(90, [0,1,0]);

    gl.bindBuffer(gl.ARRAY_BUFFER, cornerCorredorDir.vertexPositionBuffer);
    gl.vertexAttribPointer(program.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
  
    gl.bindBuffer(gl.ARRAY_BUFFER, cornerCorredorDir.normalsBuffer);
    gl.vertexAttribPointer(program.normalsAttribute, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, cornerCorredorDir.textureCoordBuffer);
    gl.vertexAttribPointer(program.textureAttribute, 3, gl.FLOAT, false, 0, 0);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, esfera.texturaPointer);
    gl.uniform1i(program.samplerUniform,0);

    setMatrixUniforms(modelMatrix, viewMatrix, projectionMatrix);
    mPopMatrix();
            
    gl.drawArrays(gl.LINE_STRIP, 0, cornerCorredorDir.indices.length/3);

    //  Corner Corredor Esq
    mPushMatrix();

    modelMatrix = matrix4Rotate(90, [0,1,0]);

    gl.bindBuffer(gl.ARRAY_BUFFER, cornerCorredorEsq.vertexPositionBuffer);
    gl.vertexAttribPointer(program.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
  
    gl.bindBuffer(gl.ARRAY_BUFFER, cornerCorredorEsq.normalsBuffer);
    gl.vertexAttribPointer(program.normalsAttribute, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, cornerCorredorEsq.textureCoordBuffer);
    gl.vertexAttribPointer(program.textureAttribute, 3, gl.FLOAT, false, 0, 0);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, esfera.texturaPointer);
    gl.uniform1i(program.samplerUniform,0);

    setMatrixUniforms(modelMatrix, viewMatrix, projectionMatrix);
    mPopMatrix();
            
    gl.drawArrays(gl.LINE_STRIP, 0, cornerCorredorEsq.indices.length/3);

    //  Obstaculo 1
    mPushMatrix();

    modelMatrix = matrix4Rotate(90, [0,1,0]);

    gl.bindBuffer(gl.ARRAY_BUFFER, obstaculo1.vertexPositionBuffer);
    gl.vertexAttribPointer(program.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
  
    gl.bindBuffer(gl.ARRAY_BUFFER, obstaculo1.normalsBuffer);
    gl.vertexAttribPointer(program.normalsAttribute, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, obstaculo1.textureCoordBuffer);
    gl.vertexAttribPointer(program.textureAttribute, 3, gl.FLOAT, false, 0, 0);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, esfera.texturaPointer);
    gl.uniform1i(program.samplerUniform,0);

    setMatrixUniforms(modelMatrix, viewMatrix, projectionMatrix);
    mPopMatrix();
            
    gl.drawArrays(gl.LINE_STRIP, 0, obstaculo1.indices.length/3);

    //  Obstaculo 2
    mPushMatrix();

    modelMatrix = matrix4Rotate(90, [0,1,0]);

    gl.bindBuffer(gl.ARRAY_BUFFER, obstaculo2.vertexPositionBuffer);
    gl.vertexAttribPointer(program.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
  
    gl.bindBuffer(gl.ARRAY_BUFFER, obstaculo2.normalsBuffer);
    gl.vertexAttribPointer(program.normalsAttribute, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, obstaculo2.textureCoordBuffer);
    gl.vertexAttribPointer(program.textureAttribute, 3, gl.FLOAT, false, 0, 0);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, esfera.texturaPointer);
    gl.uniform1i(program.samplerUniform,0);

    setMatrixUniforms(modelMatrix, viewMatrix, projectionMatrix);
    mPopMatrix();
            
    gl.drawArrays(gl.LINE_STRIP, 0, obstaculo2.indices.length/3);

    //  Obstaculo 3
    mPushMatrix();

    modelMatrix = matrix4Rotate(90, [0,1,0]);

    gl.bindBuffer(gl.ARRAY_BUFFER, obstaculo3.vertexPositionBuffer);
    gl.vertexAttribPointer(program.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
  
    gl.bindBuffer(gl.ARRAY_BUFFER, obstaculo3.normalsBuffer);
    gl.vertexAttribPointer(program.normalsAttribute, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, obstaculo3.textureCoordBuffer);
    gl.vertexAttribPointer(program.textureAttribute, 3, gl.FLOAT, false, 0, 0);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, esfera.texturaPointer);
    gl.uniform1i(program.samplerUniform,0);

    setMatrixUniforms(modelMatrix, viewMatrix, projectionMatrix);
    mPopMatrix();
            
    gl.drawArrays(gl.LINE_STRIP, 0, obstaculo3.indices.length/3);


    // lidamos com a movimentacao das paletas 
    movimentacaoPaletas();


    //  Paleta Esquerda

    mPushMatrix();

    //console.log(paletas.rotatingRadius);
    modelMatrix = mult (matrix4Translate (parametrosMesa.xMin + parametrosMesa.largura/4, 0, 
                    parametrosMesa.zMin - parametrosMesa.profundidade/9),
                    matrix4Rotate(90 + paletas.rotatingRadiusEsq, [0,1,0]) );
    

    gl.bindBuffer(gl.ARRAY_BUFFER, paleta.vertexPositionBuffer);
    gl.vertexAttribPointer(program.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
  
    gl.bindBuffer(gl.ARRAY_BUFFER, paleta.normalsBuffer);
    gl.vertexAttribPointer(program.normalsAttribute, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, paleta.textureCoordBuffer);
    gl.vertexAttribPointer(program.textureAttribute, 3, gl.FLOAT, false, 0, 0);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, esfera.texturaPointer);
    gl.uniform1i(program.samplerUniform,0);

    setMatrixUniforms(modelMatrix, viewMatrix, projectionMatrix);
    mPopMatrix();
            
    gl.drawArrays(gl.LINE_STRIP, 0, paleta.indices.length/3);

    //  Paleta Direita
    mPushMatrix();

    modelMatrix = mult ( mult (matrix4Translate (parametrosMesa.xMax - parametrosMesa.largura/4, 0, 
                    parametrosMesa.zMin - parametrosMesa.profundidade/9),
                    matrix4Rotate(90 - paletas.rotatingRadiusDir, [0,1,0]) ), matrix4Scale(1,1,-1) );

    gl.bindBuffer(gl.ARRAY_BUFFER, paleta.vertexPositionBuffer);
    gl.vertexAttribPointer(program.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
  
    gl.bindBuffer(gl.ARRAY_BUFFER, paleta.normalsBuffer);
    gl.vertexAttribPointer(program.normalsAttribute, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, paleta.textureCoordBuffer);
    gl.vertexAttribPointer(program.textureAttribute, 3, gl.FLOAT, false, 0, 0);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, esfera.texturaPointer);
    gl.uniform1i(program.samplerUniform,0);

    setMatrixUniforms(modelMatrix, viewMatrix, projectionMatrix);
    mPopMatrix();
            
    gl.drawArrays(gl.LINE_STRIP, 0, paleta.indices.length/3);


}

