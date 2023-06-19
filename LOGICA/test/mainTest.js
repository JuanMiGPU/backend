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
/*it( "borrar todas las filas", async function() {
        await laLogica.borrarFilasDe("Usuario")
        await laLogica.borrarFilasDe('Palabra')
}) // it
it("inserto palabra ",
        async function(){
                await laLogica.insertarPalabra({"palabra":'móvil'})
                await laLogica.insertarPalabra({palabra:"hilo"})
                //await laLogica.insertarPalabra({palabra:"mierda"})
                //await laLogica.insertarPalabra({palabra:"oveja"})
                //await laLogica.insertarPalabra({palabra:"pajaro"})
                
        })

*/
// ....................................................
// ....................................................
/*it( "puedo insertar una persona",
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


*/
var Palabras
        /*it("Relacionar códigos",
        async function(){
                var res= await laLogica.verPalabras()
                //console.log(res[0].codigo)
                //NO ESTOY BORRANDO, SI EN ALGUN MOMENTO METO COSAS NUEVAS, 
                //QUITAR EL COMENTARIO DE AQUÍ ABAJO

                var codigos={"codigo1":res[0].codigo, "codigo2":10}
                var codigos2={"codigo1":res[1].codigo, "codigo2":11}
                //await laLogica.insertarCodigos(codigos2)
                //console.log(codigos)

                var codigoUser= await laLogica.relacionarCodigoUserConPalabra(res[0].codigo)
                //console.log(codigoUser+"<---- codigoUser")
                assert.equal(codigoUser, 10, "El código no es 10¿??")

        })

        it("puedo conseguir todas las palabras",
        async function(){
                var res=await laLogica.verPalabras()
                //console.log(JSON.stringify(res)+"<--- res string")

                //res es un array de objetos
                //Palabras=res

                //console.log(res[0].codigo+"<---- res")
                //console.log(res[1].codigo)
        })*/

console.log(JSON.stringify(Palabras)+"<---- Palabras")

var Palabras =[
        { codigo: 176, palabra: 'móvil' },
        { codigo: 177, palabra: 'hilo' }
      ]
        /*it("puedo ver la Puntuacion de las palabras",
        async function(){
                var res=await laLogica.PuntuacionDePalabras(Palabras)
                console.log(res+"<--- soy res")
                assert.equal(res[0],5, "¿No corresponde la puntuación?")
        })*/

/*it("puedo ver la puntuación de una persona",
        async function(){
            var puntuacion= await laLogica.verPuntuacion('1')
            //assert.equal( puntuacion.length, 1, "¿no hay un resulado?" )
            //console.log(puntuacion)
            assert.equal(puntuacion[0].puntuacion, 0, "no es 0 la puntuación?")
})//it
*/
it("puedo modificar la puntuacion de una palabra",
        async function(){
            await laLogica.modificarPuntuacion("macha")
            var res= await laLogica.verPuntuacion('11')
            //console.log(res)
            //assert.equal( res.length, 1, "¿no hay un resultado?" )
            assert.equal(res, 9, "no es 6 la puntuación?")
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