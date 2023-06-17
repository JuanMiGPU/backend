//test para reglas del servidor
// .....................................................................
// .....................................................................
// ........................................................
// mainTest1.js
// ........................................................
var request = require ("request")
var assert = require ("assert")
// ........................................................
// ........................................................
const IP_PUERTO="http://localhost:8080"
// ........................................................
// main ()
// ........................................................

//VARIABLES

var ordenador= {palabra:'ordenado'}


describe( "Test 1 : Recuerda arrancar el servidor", function() {

    /*it( "probar que GET /prueba responde ¡Funciona!",function(hecho){
        request.get(
        { url : IP_PUERTO+"/prueba", headers : { "User-Agent" : "jordi" }},
        function( err, respuesta, carga ) {
            
            assert.equal( err, null, "¿ha habido un error?" ) 
                      
            assert.equal( respuesta.statusCode, 200, "¿El código no es 200 (OK)" )
            hecho()
        } // callback()
        )//.get
        })//it*/
    /*var Palabra={nombre:"Palabra"}
    
    it( "probar DELETE /palabra", function( hecho ) {
        request.post(
            { url : IP_PUERTO+"/borrarFilasde/",
            headers : { "User-Agent" : "JuanMi" ,"Content-Type": "application/json"},
            body: JSON.stringify(Palabra.nombre)
        },
          function( err, respuesta, carga ) {
            //console.log("soy err " +err)
            //console.log(respuesta.statusCode)
                assert.equal( err, null, "¿ha habido un error?" )
                assert.equal( respuesta.statusCode, 200, "¿El código no es 200 (OK)" )
                assert.equal( carga, "OK", "¿La carga no es OK" )
                hecho()
          } // callback

        )//.get
        })//it 

        // ....................................................
        // ....................................................
    it( "probar POST /palabra", function( hecho ) {
        request.post(
            { url : IP_PUERTO+"/palabra",
            headers : { "User-Agent" : "JuanMi" ,"Content-Type": "application/json"},
            body: JSON.stringify(ordenador)},
          function( err, respuesta, carga ) {
                assert.equal( err, null, "¿ha habido un error?" )
                assert.equal( respuesta.statusCode, 200, "¿El código no es 200 (OK)" )
                assert.equal( carga, "OK", "¿La carga no es OK" )
                hecho()
          } // callback

        )//.get
        })//it


        var yo= {'palabra':"boligrafo",'nombre':"Angel"}
        //console.log(yo.palabra+ "<----- soy la palabra")

    it("probar POST palabra con usuario",function(done){
        //`this.timeout(5000)
        request.post(
            {url:IP_PUERTO+"/palabraUser",
            headers : { "User-Agent" : "JuanMi" ,"Content-Type": "application/json"},
            body: JSON.stringify(yo)},
            function(err, respuesta){
                assert.equal( err, null, "¿ha habido un error?" )
                assert.equal( respuesta.statusCode, 200, "¿El código no es 200 (OK)" )
                done() 
            }
    )}
        )
    // ....................................................
    // ....................................................
    var Usuario={nombre:"Usuario"}
    it( "probar DELETE /palabra", function( hecho ) {
        request.post(
            { url : IP_PUERTO+"/borrarFilasde/",
            headers : { "User-Agent" : "JuanMi" ,"Content-Type": "application/json"},
            body: JSON.stringify(Usuario.nombre)
        },
          function( err, respuesta, carga ) {
            //console.log("soy err " +err)
            //console.log(respuesta.statusCode)
                assert.equal( err, null, "¿ha habido un error?" )
                assert.equal( respuesta.statusCode, 200, "¿El código no es 200 (OK)" )
                assert.equal( carga, "OK", "¿La carga no es OK" )
                hecho()
          } // callback

        )//.get
        })//it 


    var persona={nombre:'Antonio',puntuacion:0}
    it( "probar POST /persona", function( hecho ) {
        request.post(
            { url : IP_PUERTO+"/persona",
            headers : { "User-Agent" : "JuanMi" ,"Content-Type": "application/json"},
            body: JSON.stringify(persona)},
          function( err, respuesta) {
            //console.log(err)
                //assert.equal( err, null, "¿ha habido un error?" )
                //console.log(respuesta.statusCode)
                assert.equal( respuesta.statusCode, 200, "¿El código no es 200 (OK)" )
                hecho()
          } // callback

        )//.get
        })//it
    */
    // ....................................................
    // ....................................................
var Puntuaciones
    it ("probar GET/palabras", function(done){
        request.get(
            { url : IP_PUERTO+"/palabras", headers : { "User-Agent" : "JuanMi" }},
            function( err, respuesta) {
                
                assert.equal( err, null, "¿ha habido un error?" ) 
                          
                assert.equal( respuesta.statusCode, 200, "¿El código no es 200 (OK)" )
                console.log(JSON.stringify(respuesta.body[0]))
                //He puesto esto para probar, PUNTUACIONES es un array con las palabras y sus códigos
                
                done()
            } // callback()
            )//.get   
    })//it
    var Puntuaciones =[
        { codigo: 132, palabra: 'ordenado' },
        { codigo: 133, palabra: 'boligrafo' }
      ]
//console.log(Puntuaciones.length+"<---- soy Puntuaciones.length")
it("probar GET/puntuacionPalabras", function(done){
    request.get(
        { url : IP_PUERTO+"/puntuacionPalabras", headers : { "User-Agent" : "JuanMi" }, body:Puntuaciones},
        function(err, respuesta){
            assert.equal( err, null, "¿ha habido un error?" ) 
                          
            assert.equal( respuesta.statusCode, 200, "¿El código no es 200 (OK)" )
            console.log(respuesta.body)
            done()
        }
    )
})


















    /*it("Debería obtener una persona con el código proporcionado", function(hecho) {
        var codigo = "2"; // Asegúrate de tener un registro con este código en la base de datos
        request.get(
            { url: IP_PUERTO + "/persona/" + codigo },
            function(error, response, body) {
                assert.equal(error, null, "¿Ha habido un error?");
                assert.equal(response.statusCode, 200, "¿El código no es 200 (OK)?");
                
                // Aquí asumimos que la respuesta es un objeto JSON con una propiedad 'nombre'
                var respuesta = JSON.parse(body);
                assert.equal(respuesta.nombre, 'Antonio', "¿El campo 'nombre' no es una cadena de texto?");
                
                // Deberías adaptar esta parte a los datos que estás devolviendo en la respuesta
                //console.log("Nombre de la persona: " + respuesta.nombre);
                hecho();
            }
        );
    });
    it('Obtener puntuación de persona con código', function(done) {
        var codigo = '2'; // Supongamos que '2' es el código de la persona que estás buscando
        request.get(IP_PUERTO+'/persona/' + codigo + '/puntuacion', function(error, response, body) {
            assert.equal(error, null, '¿ha habido un error?');
            assert.equal(response.statusCode, 200, '¿El código no es 200 (OK)?');
            console.log(JSON.parse(body))
            assert.equal(parseInt(JSON.parse(body)), '0', '¿La puntuación no es un número?');
            done();
        });
    });*/
})
