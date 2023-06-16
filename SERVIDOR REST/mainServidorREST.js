// .....................................................................
// mainServidorREST.js
// .....................................................................
var Logica = require ("../LOGICA/Logica.js")
const express = require("express")
const bodyParser = require("body-parser")

function cargarLogica(fichero){
    return new Promise((resolver,rechazar)=>{
        var laLogica= new Logica(fichero, (err)=> {
                if (err){ rechazar(err)
                }else{
                    resolver (laLogica)
                }
            })
    })//promise
}

// .....................................................................
// main()
// .....................................................................
async function main (){
    var laLogica=await cargarLogica("../bd/datos.bd")
    //creamos el servidor 
    var servidorExpress=express()

    //para poder acceder a la carga de la petición http, asumiendo que es JSON
    servidorExpress.use(bodyParser.text({type: "application/json"}))

    //cargo las reglas REST
    var reglas = require ("./ReglasREST.js")
    reglas.cargar(servidorExpress,laLogica)

    //Arranco el servidor
    var servicio =servidorExpress.listen(8080, function(){
        console.log("servidor REST escuchando en el puerto 8080")
    })
    //capturo contro-c para cerrar el servicio ordenadamente
    process.on("SIGINT", function() {
        console.log(" terminando")
        servicio.close()
    })
}
// .....................................................................
// .....................................................................
main()
// .....................................................................
// .....................................................................
