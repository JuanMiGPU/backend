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
    //----------------------------------------------
    verPalabras(){
        var textoSQL = "select * from Palabra;"
        return new Promise ((resolver, rechazar)=>{
            this.laConexion.all(textoSQL,(err,res)=>{
                (err ? rechazar(err): resolver(res))
                console.log(res)
            })
        })
    }
    //----------------------------------------------
    //----------------------------------------------
    async PuntuacionDePalabras(datos){
        var usuarios=[]
        var Puntuaciones=[]
        console.log(datos.length+"<---- soy datos.length")
        //Me pasas un array de palabras, cojo su código y saco el código del usuario
        for(var i=0; i<datos.length-1;i++){
            var codUser =await this.relacionarCodigoPalabra_User(datos[i].codigo)
            console.log(codUser+"<------ soy codUser")
            usuarios.push(codUser)
        }
        console.log(usuarios+"<---- soy Usuarios")
        //Con el codigo del usuario veo la puntuación
        for (var i=0; i<usuarios.length-1;i++){
            var PuntUser= await this.verPuntuacion(usuarios[i])
            console.log(PuntUser+"<------ soy puntUser")
            Puntuaciones.push(PuntUser)
        }
        console.log(Puntuaciones+"<---- soy Puntuaciones")
        //Devuelvo las puntuaciones en un array

        //DEBE ESTAR IGUAL COLOCADO QUE LAS PALABRAS POR LO QUE PUEDES
        //UTILIZAR LA POSICIÓN DE LAS PALABRAS PARA COGER LA PUNTUACION 
        //EN ESTE ARRAY
        return Puntuaciones
        /*return new Promise ((resolver, rechazar)=>{
            this.laConexion.all(textoSQL,valoresParaSQL,(err,res)=>{
                (err ? rechazar(err): resolver(Puntuaciones))
            })
        })*/     
    }
    //----------------------------------------------
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
    //----------------------------------------------
    //----------------------------------------------
    verPuntuacion (codigo){
        var textoSQL= "select puntuacion from Usuario where codigo=$codigo;"
        var valoresParaSQL= {$codigo:codigo}
        return new Promise((resolver,rechazar)=>{
            this.laConexion.all(textoSQL,valoresParaSQL,(err,res)=>{
                (err ? rechazar(err): resolver(res))
                //console.log(res)
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
     //-----------------------------------------------------------------
    //-----------------------------------------------------------------
    //CODIGOS
    //-----------------------------------------------------------------
    //-----------------------------------------------------------------
    buscarCodigoConNombre (nombre){
        var textoSQL = "select codigo from Usuario where nombre=$nombre;"
        //console.log(nombre.username+" soy username")
        var valoresParaSQL = {$nombre: nombre.username}
        return new Promise ((resolver, rechazar)=>{
            this.laConexion.all(textoSQL,valoresParaSQL,(err,res)=>{
                (err ? rechazar(err): resolver(res))
                //console.log(res+"<--- soy resultado de codigo con nombre")
                //console.log(JSON.stringify(res)+"resultado stringificado")
            })
        })
     }
     buscarCodigoConPalabra(palabra){
        var textoSQL= "select codigo from Palabra where palabra=$palabra;"
        var valoresParaSQL={$palabra:palabra}
        return new Promise ((resolver, rechazar)=>{
            this.laConexion.all(textoSQL,valoresParaSQL,(err,res)=>{
                (err ? rechazar(err): resolver(res))
                //console.log(res+"<---- soy resultado de codigo con Palabra")
            })
        })
     }
    insertarCodigos(datos){
        var textoSQL=
        'insert into Codigo values ($codigo1, $codigo2);'
        var valoresParaSQL= {$codigo1: datos.codigo1, $codigo2: datos.codigo2}
            //codigo1 es usuario, codigo 2 es palabra
            
    return new Promise ((resolver, rechazar)=> {
    this.laConexion.run (textoSQL, valoresParaSQL, function (err){
        (err ? rechazar(err) : resolver())
    })
    }) 


    }
    //codigo1 es usuario, codigo 2 es palabra
    relacionarCodigosUser_Palabra(datos){
        var textoSQL= "select codigo2 from Codigo where codigo1=$codigo;"
        var valoresParaSQL={$codigo:datos.codigo}
        return new Promise ((resolver, rechazar)=>{
            this.laConexion.all(textoSQL,valoresParaSQL,(err,res)=>{
                (err ? rechazar(err): resolver(res))
                //console.log(res+"<---- soy resultado de codigo con Palabra")
            })
        })
    }
    relacionarCodigoPalabra_User(datos){
        var textoSQL= "select codigo1 from Codigo where codigo2=$codigo;"
        var valoresParaSQL={$codigo:datos.codigo}
        return new Promise ((resolver, rechazar)=>{
            this.laConexion.all(textoSQL,valoresParaSQL,(err,res)=>{
                (err ? rechazar(err): resolver(res))
                //console.log(res+"<---- soy resultado de codigo con Palabra")
            })
        })
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
