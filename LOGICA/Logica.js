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
    async borrarTodo(){
        await this.borrarFilasDe("Usuario")
        await this.borrarFilasDe("Palabra")
        await this.borrarFilasDe("Codigo")
    }
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
                //console.log(res)
            })
        })
    }
    //----------------------------------------------
    //----------------------------------------------

//SE LE DA UN ARRAY DE PALABRAS (EL QUE DEVUELVE VER PALABRAS VALE)
//DEVUELVE UN ARRAY DE NÚMEROS EN EL MISMO ORDEN QUE LAS PALABRAS
    async PuntuacionDePalabras(palabras) {//CHATGPT
        //try {
            //console.log(palabras)
            let codigosUsuarios = [];
            for (let i = 0; i < palabras.length; i++) {
                //console.log(palabras[i].codigo+"<--- soy el codigo de palabra i")
                let codigoUsuario = await this.relacionarCodigoUserConPalabra(palabras[i].codigo);
                codigosUsuarios.push(codigoUsuario);
                //console.log(codigoUsuario+"<--- soy codigo usuario")
            }
            console.log(codigosUsuarios+"<---- soy codigos usuario")
    
            let puntuaciones = [];
            for (let i = 0; i < codigosUsuarios.length; i++) {
                let puntuacion = await this.verPuntuacion(codigosUsuarios[i]);
                puntuaciones.push(puntuacion);
            }
            console.log(puntuaciones+"<--- soy Puntuaciones")
    
            return puntuaciones;
        //} catch (error) {
        //   console.error("Error al obtener puntuaciones:", error);
        //}
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
    /*verPuntuacion (codigo){
        var textoSQL= "select puntuacion from Usuario where codigo=$codigo;"
        var valoresParaSQL= {$codigo:codigo}
        return new Promise((resolver,rechazar)=>{
            this.laConexion.all(textoSQL,valoresParaSQL,(err,res)=>{
                (err ? rechazar(err): resolver(res))
                //console.log(res)
            })
        })
    }*/



    verPuntuacion(codigo) {
        var textoSQL = "select puntuacion from Usuario where codigo=$codigo;";
        var valoresParaSQL = { $codigo: codigo };
        return new Promise((resolver, rechazar) => {
            this.laConexion.all(textoSQL, valoresParaSQL, (err, res) => {
                if (err) {
                    console.log(err);
                    return rechazar(err);
                }
                //console.log(res[0].puntuacion+"<-- soy la puntuacion (solo un numero)");
                resolver(res[0].puntuacion);
                //console.log(res[0].puntuacion+" soy lo que devuelve ver puntuación")
            });
        });
    }


    async main_VerPuntuacion(codigo){
        var res= await this.verPuntuacion(codigo)
        return res
    }
    //-----------------------------------------------------------------
    //-----------------------------------------------------------------
    //modificar la de una palabra
    //-----------------------------------------------------------------
    //-----------------------------------------------------------------
    /*modificarPuntuacion(palabra){

        //Busco el codigo de la palabra
        var cod_Palabra=this.buscarCodigoConPalabra(palabra)
        console.log(cod_Palabra+"<--- soy cod_Palabra")

        //Con el codigo de la palabra veo el codigo del usuario

        var cod_User=this.relacionarCodigoPalabra_User(cod_Palabra)

        //con el codigo del usuario veo su puntuación

        this.verPuntuacion(cod_User)
            .then((resultado) => {
                var resultadoPuntuacion = resultado;
                console.log(resultadoPuntuacion+"<-- soy resultadoPuntuación");
                
                //cojo la puntuación y le sumo 1
                var newPuntuacion = parseInt(resultadoPuntuacion[0].puntuacion) + parseInt(1)
                var valoresParaSQL = {$newPuntuacion: newPuntuacion, $codigo: codigo};

                //Meto la nueva puntuación en la tabla
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
    }//.*/
    async modificarPuntuacion(palabra){
        try {
            //Busco el codigo de la palabra
            var cod_Palabra = await this.buscarCodigoConPalabra(palabra);
            //console.log(cod_Palabra+"<--- soy cod_Palabra");
    
            //Con el codigo de la palabra veo el codigo del usuario
            var cod_User = await this.relacionarCodigoPalabra_User(cod_Palabra);
            //console.log(cod_User+"<--- soy cod_User")
    
            //con el codigo del usuario veo su puntuación
            var resultadoPuntuacion = await this.verPuntuacion(cod_User);
            //console.log(resultadoPuntuacion+"<-- soy resultadoPuntuación");
            
            //cojo la puntuación y le sumo 1
            var newPuntuacion = parseInt(resultadoPuntuacion) + 1;
            //console.log(newPuntuacion+"<-- soy new puntuación")
            
            var valoresParaSQL = {$newPuntuacion: newPuntuacion, $codigo: cod_User};
    
            //Meto la nueva puntuación en la tabla
            var textoSQL = "UPDATE Usuario SET puntuacion = $newPuntuacion WHERE Usuario.codigo = $codigo;";
            
            var res = await new Promise((resolver, rechazar) => {
                this.laConexion.all(textoSQL, valoresParaSQL, (err, res) => {
                    (err ? rechazar(err) : resolver(res));
                });
            });
    
            return res;
        } catch (err) {
            console.error(err);
        }
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
                (err ? rechazar(err): resolver(res[0].codigo))
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
    relacionarCodigoUserConPalabra(datos){
        var textoSQL= "select codigo2 from Codigo where codigo1=$codigo;"
        var valoresParaSQL={$codigo:datos}
        return new Promise ((resolver, rechazar)=>{
            this.laConexion.all(textoSQL,valoresParaSQL,(err,res)=>{
                if (err) {
                    console.log(err);
                    return rechazar(err);
                }
                //console.log(res[0].codigo2 + "<---- soy resultado de codigo con nombre");
                resolver(res[0].codigo2);
                
            })
        })
    }
    relacionarCodigoPalabra_User(datos){
        var textoSQL= "select codigo1 from Codigo where codigo2=$codigo;"
        var valoresParaSQL={$codigo:datos}
        return new Promise ((resolver, rechazar)=>{
            this.laConexion.all(textoSQL,valoresParaSQL,(err,res)=>{
                if (err) {
                    console.log(err);
                    return rechazar(err);
                }
                //console.log(res[0].codigo1 + "<---- soy resultado de codigo con nombre");
                resolver(res[0].codigo1);
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
