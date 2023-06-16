// ........................................................
// mainTest1.js
// ........................................................
const Logica = require( "../Logica.js" )
var assert = require ('assert')

// ........................................................
// main ()
// ........................................................

describe( "Test 1: Probar lógica", function() {

       // ....................................................
       // ....................................................
       var laLogica = null
       // ....................................................
       // ....................................................
       it( "conectar a la base de datos", function( hecho ) {
               laLogica = new Logica(
                       "../BD/datos.bd",
                       function( err ) {
                               if ( err ) {
                                       throw new Error ("No he podido conectar con datos.db")
                                }
                        hecho()
                        })
        })//it
// ....................................................
// ....................................................
it( "borrar todas las filas", async function() {
        await laLogica.borrarFilasDe("Usuario")
        await laLogica.borrarFilasDe('Palabra')
}) // it
it("inserto palabra ",
        async function(){
                await laLogica.insertarPalabra({"palabra":'móvil'})
                await laLogica.insertarPalabra({palabra:"hilo"})
                await laLogica.insertarPalabra({palabra:"mierda"})
                await laLogica.insertarPalabra({palabra:"oveja"})
                await laLogica.insertarPalabra({palabra:"pajaro"})
                
        })
// ....................................................
// ....................................................
it( "puedo insertar una persona",
        async function() {
                await laLogica.insertarPersona(
                        {'nombre': "Pepe", 'puntuacion': 0} )
                var res = await laLogica.buscarPersonaConCodigo( "1" )
                //assert.equal( res.length, 1, "¿no hay un resulado?" )
                //assert.equal( res[0].codigo, "1", "¿no es 1?" )
                //console.log(res[0])
                assert.equal( res[0].nombre, "Pepe", "¿no es Pepe?" )
}) // it
it( "no puedo insertar una persona con codigo que ya está",
         async function() {
         var error = null
        try {
                await laLogica.insertarPersona(
                        {codigo: "1", nombre: "Pepe" } )
        } 
        catch( err ) {
                error = err
         }
        assert( error, "¿Ha insertado el codigo que ya estaba 1? ¿No ha pasado por el catch()?" )
}) // it

it("puedo ver la puntuación de una persona",
        async function(){
            var puntuacion= await laLogica.verPuntuacion('1')
            //assert.equal( puntuacion.length, 1, "¿no hay un resulado?" )
            //console.log(puntuacion)
            assert.equal(puntuacion[0].puntuacion, 0, "no es 0 la puntuación?")
})//it
it("puedo modificar la puntuacion de una persona",
        async function(){
            await laLogica.modificarPuntuacion('1')
            var res= await laLogica.verPuntuacion('1')
            //console.log(res)
            //assert.equal( res.length, 1, "¿no hay un resultado?" )
            assert.equal(res, 1, "no es 1 la puntuación?")
        })
// ....................................................
// ....................................................
it ( "cerrar conexión a la base de datos", 
        async function (){
                try{
                        await laLogica.cerrar()
                } catch (err){
                        //assert.equal (0,1, " cerrar conexión a BD fallada: " + err)
                        throw new Error("cerrar conexión a BD fallada: "+err)
                }
        })//it
})