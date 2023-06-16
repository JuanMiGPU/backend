//----------------------------------------------
//Logica.js
//----------------------------------------------
const sqlite3 = require ("sqlite3")
const { resourceLimits } = require("worker_threads")


module.exports =class Logica {

    //----------------------------------------------
    // nombreBD: texto -->
    //                      constructor ()-->
    //----------------------------------------------
    constructor(nombreBD, cb){
        this.laConexion = new sqlite3.Database(
            nombreBD,
            (err)=>{
                if(!err){
                        this.laConexion.run("PRAGMA freign_keys = ON")
                }
                cb(err)
            })
    }

    //----------------------------------------------
    // nombreTabla=Texto -->
    //                      borrarFilasDe()-->
    //----------------------------------------------
    borrarFilasDe( tabla ){
        return new Promise ((resolver, rechazar) => {
            this.laConexion.run(
                "delete from "+ tabla + ";",
                (err)=> (err ? rechazar(err): resolver())
            )
        })
    }
    //----------------------------------------------
    // inserta una palabra dado SOLO la palabra
    //----------------------------------------------
    
    insertarPalabra(datos){
        //console.log(datos)
        var textoSQL=
                'insert into Palabra("palabra") values ($palabra);'
        var valoresParaSQL= {$palabra: datos.palabra}

        return new Promise ((resolver, rechazar)=> {
            this.laConexion.run (textoSQL, valoresParaSQL, function (err){
                (err ? rechazar(err) : resolver())
            })
        })    
     }
    //----------------------------------------------
    // inserta una persona dado el JSON entero con el codigo, el nombre y la puntuación
    //----------------------------------------------
    insertarPersona(datos){//funciona
        //console.log(datos)
        var textoSQL=
                'insert into Usuario("nombre","puntuacion") values ($nombre, $puntuacion);'
        var valoresParaSQL= {$nombre: datos.nombre, $puntuacion: datos.puntuacion}

        return new Promise ((resolver, rechazar)=> {
            this.laConexion.run (textoSQL, valoresParaSQL, function (err){
                (err ? rechazar(err) : resolver())
            })
        })    
    }
    //----------------------------------------------
    // devuelve todo de la persona con ese código       
    //----------------------------------------------
     buscarPersonaConCodigo (codigo){
        var textoSQL = "select * from Usuario where codigo=$codigo";
        var valoresParaSQL = {$codigo: codigo}
        return new Promise ((resolver, rechazar)=>{
            this.laConexion.all(textoSQL,valoresParaSQL,(err,res)=>{
                (err ? rechazar(err): resolver(res))
            })
        })
     }

    //----------------------------------------------
    //           Codigo:Texto -->
    //                           buscarAsignaturaPorCodigo()<--
    //       {codigo, nombre}<--
    //----------------------------------------------
    buscarTematicaPorCodigo (codigo){
        var textoSQL = "select Tematica from Tematica where codigo=$codigo;"
        var valoresParaSQL = {$codigo: codigo}
        return new Promise ((resolver, rechazar)=>{
            this.laConexion.all(textoSQL,valoresParaSQL,(err,res)=>{
                (err ? rechazar(err): resolver(res))
            })
        })
     }

    //----------------------------------------------
    //       codigo:Texto-->
    //                       NumerodeMatriculados()
    //          res: int<--
    //----------------------------------------------
    
   /*numerodeJugadores(codigo){
        var textoSQL = "select count(*) as numJugadores from Persona where codigo=$codigo;"
        var valoresParaSQL = {$codigo:codigo}
        return new Promise ((resolver, rechazar)=>{
            this.laConexion.all(textoSQL,valoresParaSQL,(err,res)=>{
                (err ? rechazar(err): resolver(res))
            })
        })
    }*/
    verPuntuacion (codigo){
        var textoSQL= "select puntuacion from Usuario where codigo=$codigo;"
        var valoresParaSQL= {$codigo:codigo}
        return new Promise((resolver,rechazar)=>{
            this.laConexion.all(textoSQL,valoresParaSQL,(err,res)=>{
                (err ? rechazar(err): resolver(res))
                console.log(res)
            })
        })
    }
    async main_VerPuntuacion(codigo){
        var res= await this.verPuntuacion(codigo)
        return res
    }


    //-----------------------------------------------------------------
    //-----------------------------------------------------------------
    //arreglar
    //-----------------------------------------------------------------
    //-----------------------------------------------------------------
    modificarPuntuacion(codigo){
        this.verPuntuacion(codigo)
            .then((resultado) => {
                var resultadoPuntuacion = resultado;
                //console.log(resultadoPuntuacion);
                
                var newPuntuacion = parseInt(resultadoPuntuacion[0].puntuacion) + parseInt(1)
                var valoresParaSQL = {$newPuntuacion: newPuntuacion, $codigo: codigo};
                var textoSQL = "UPDATE Usuario SET puntuacion = $newPuntuacion WHERE Usuario.codigo = $codigo;";
                
                return new Promise((resolver, rechazar) => {
                    this.laConexion.all(textoSQL, valoresParaSQL, (err, res) => {
                        (err ? rechazar(err) : resolver(res));
                    });
                });
            })
            .catch(err => {
                console.error(err);
            });
    }
    vincularCodigos(){

    }
    //----------------------------------------------
    // cerrar()-->
    //----------------------------------------------
    cerrar (){
        return new Promise ((resolver, rechazar)=> {
            this.laConexion.close( (err)=>{
                (err ? rechazar (err): resolver())
            })
        })
    }
//----------------------------------------------
//----------------------------------------------
//----------------------------------------------
//----------------------------------------------
//----------------------------------------------
//----------------------------------------------
    
    //VIDA MÁS FACIL:
//----------------------------------------------
//----------------------------------------------
//----------------------------------------------
//----------------------------------------------
//----------------------------------------------
//----------------------------------------------

//A pertir de un objeto JSON me devuelve true si contiene el campo que quiero
//Analogía con array JSON
buscarCampoEnArray(array, campo) {
    for (let i = 0; i < array.length; i++) {
      const objeto = array[i];
      if (typeof objeto === 'object') {
        if (function buscarCampo(objeto, campo){
            for (let key in objeto) {
                if (typeof objeto[key] === 'object') {
                if (buscarCampo(objeto[key], campo)) {
                 return true;
               }
             } else if (key === campo || objeto[key] === campo) {
               return true;
             }
           }
           return false;
        }) {
          return true;
        }
      }
    }
    return false;
  }
}
