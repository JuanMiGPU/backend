// .....................................................................
// ReglasREST.js
// .....................................................................
module.exports.cargar = function(servidorExpress, laLogica){
    var express = require('express')
    var app = express()
    var bodyParser = require('body-parser');

    app.use(express.json())
    app.use(bodyParser.json());
    // .......................................................
    // GET /prueba
    // .......................................................
    servidorExpress.get("/prueba/", function( peticion, respuesta ){
        console.log( " * GET /prueba " )
        respuesta.send( "¡Funciona!" )
    }) // get /prueba
    // .......................................................
    // GET /dividir?a=<num>&b=<num>
    // .......................................................
    // .......................................................
    // POST /alta   
    // .......................................................
    servidorExpress.post("/borrarFilasde", async function (peticion, respuesta) {
        console.log(" * POST /borrarFilasde/ ");
        // averiguo la tabla
        //var tabla = JSON.parse(peticion.body).tabla;
        var tabla = JSON.parse(peticion.body)
        // llamo a la funcion adecuada de la logica
    
        await laLogica.borrarFilasDe(tabla);
        respuesta.send("OK");
      });

    servidorExpress.post("/borrar", async function (peticion, respuesta) {
        console.log(" * POST /borrar ");
          //borro todo de todas las tablas salvo Temática

        await laLogica.borrarFilasDe(Usuario);
        await laLogica.borrarFilasDe(Palabra)
        await laLogica.borrarFilasDe(Codigo)
          respuesta.send("OK");
    });
    // .......................................................
    // POST /alta   
    // .......................................................
    servidorExpress.post(
        "/palabra",
        async function( peticion, respuesta ){
                console.log( " * POST /palabra " )
                //console.log(peticion.body)
                var datos = JSON.parse( peticion.body )
                //console.log(datos)
                //console.log( datos.codigo )
                //console.log( datos.palabra )
                await laLogica.insertarPalabra(datos)
                // supuesto procesamiento
                respuesta.send( "OK" )
        })//post/palabra
    // .......................................................
    // POST /alta   
    // .......................................................
    servidorExpress.post(
        "/persona",
        async function( peticion, respuesta ){
                console.log( " * POST /persona " )
                //console.log("soy peticion.body  "+peticion.body)
                var datos =JSON.parse(peticion.body)
                //console.log(datos.codigo )
                //console.log(datos.nombre )
                //console.log(datos.puntuacion)
                //console.log(datos)
                await laLogica.insertarPersona(datos)
                // supuesto procesamiento
                respuesta.send( "OK" )
        })

    //regla GET /persona/:dni
    servidorExpress.get("/persona/:nombre", 
        async function (peticion, respuesta){
            //averiguo el codigo
            var codigo =peticion.params.nombre
            //console.log(dni)
            //llamo a la función adecuada de la lógica
            var res= await laLogica.buscarPersonaConCodigo(codigo)
            //console.log("soy res " + res)
            if(res.length ==0){
                //404: not found
                respuesta.status(404).send("no encontré dni: " + dni)
                return
            }//if
            respuesta.send(JSON.stringify(res[0]))
            //console.log(JSON.stringify(res[0]+"res[0]"))
        })


    //post palabra con el nombre del usuario
    servidorExpress.post("/palabraUser",
        async function(peticion,respuesta){
            console.log("* POST/palabraUSER")
            var datos=JSON.parse(peticion.body)
            //console.log(datos + "   <---- es datos (palabraUser)")
            var username=datos.nombre
            var pal=datos.palabra
            var datosPalabra={palabra:pal}
            var datosPersona={nombre: username, puntuacion:0}
            //console.log(username+"   <---- es username (palabraUser)")
            //console.log(pal+"   <---- es palabra (palabraUser")
            await laLogica.insertarPalabra(datosPalabra)
            await laLogica.insertarPersona(datosPersona)

            //hemos insertado la palabra, ahora vamos a coger el código 
            //de la palabra y del usuario para poder relacionarlos
            //codigo1 es usuario, codigo 2 es palabra
            //VARIABLES

            var cod1= await laLogica.buscarCodigoConNombre({username})
            var cod2= await laLogica.buscarCodigoConPalabra(pal)
            //FUNCIONES
            var codigoUs=cod1[0].codigo;
            var codigoPal=cod2[0].codigo;
            //console.log(codigoUs)
            //console.log(cod1+ "<--- sin stringify")
            //FUNCIONES
            //console.log(JSON.stringify(cod2) + " <----- es cod2")
            await laLogica.insertarCodigos({codigo1:codigoUs,codigo2:codigoPal})
            respuesta.send("OK")
        }
    )

    servidorExpress.post("/persona/puntuacion",
            async function (peticion, respuesta){
                //averiguo el codigo
                var persona =peticion.params.persona
                //console.log(dni)
                //llamo a la función adecuada de la lógica
                await laLogica.modificarPuntuacion(persona)
                //console.log("soy res " + res)
                /*if(res.length ==0){
                    //404: not found
                    respuesta.status(404).send("no encontré persona: " + persona.codigo)
                    return
                }//if
                respuesta.send(JSON.stringify(res[0]))
                //console.log(JSON.stringify(res[0]+"res[0]"))*/
        })

    
    servidorExpress.get(
        "/persona/:codigo",
        async function( peticion, respuesta ){
            console.log( " * GET /persona/:codigo " );
            var codigo = peticion.params.codigo;
            var resultado = await laLogica.buscarPersonaConCodigo(codigo);
            respuesta.json(resultado);
        });
//NO HACE FALTA QUE ME ENVIES NADA.
    servidorExpress.get(
        "/palabras",
        async function( peticion, respuesta ){
            console.log( " * GET /palabras" );
            var resultado = await laLogica.verPalabras();
            console.log(resultado+"<---- de ver palabras")
            respuesta.json(resultado);
        });

    servidorExpress.post(
        "/puntuacionPalabras",
        async function(peticion,respuesta){
            console.log(" * POST Puntuación Palabras")
            //entrada=JSON.parse(peticion.body)
            console.log(JSON.stringify(peticion.body)+"<--- soy peticion.body en Reglas")
            //console.log(JSON.parse(peticion.body))
            var datos=JSON.parse(peticion.body)
            //console.log(datos+"<--- soy datos")

            var resultado =await laLogica.PuntuacionDePalabras(datos)
            //console.log(resultado+"<-----de puntuacionPalabras")
            respuesta.json(resultado)
        }
    )


    servidorExpress.get(
        "/persona/:codigo/puntuacion",
        async function(peticion, respuesta) {
            console.log(" * GET /puntuacion ");
            var codigo = peticion.params.codigo;
            try {
                var resultado = await laLogica.verPuntuacion(codigo);
                respuesta.status(200).send(resultado);
            } catch(err) {
                console.error(err);
                respuesta.status(500).send("Hubo un error al intentar recuperar la puntuación");
            }
        }
    );
}//()