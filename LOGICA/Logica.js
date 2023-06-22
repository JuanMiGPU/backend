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
    // BORRAR
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
    //---------------------------------------------------------------------
    //     TEMAS SELECCIONADOS
    //---------------------------------------------------------------------
    //devuelve un array de dos números con los índices de las temáticas
    vacio(){

    }
    verTemasSeleccionados(){
        var textoSQL = "select * from temasSeleccionados;";
        return new Promise ((resolver, rechazar)=>{
            this.laConexion.all(textoSQL,(err,res)=>{
                if (err) {
                    rechazar(err);
                } else {
                    /*resolver(resultado);
                    }//else*/
                    //console.log(res+"<-- soy res")
                    resolver(res)
                }//else
            })
        })
    }
    //añade al indice el índice que queramos, se le da un número
    añadirTemaSeleccionado(indice){
        var textoSQL="insert into temasSeleccionados (indice) values ($indice);"
        var valoresParaSQL = { $indice: indice };
        return new Promise ((resolver, rechazar)=>{
            this.laConexion.all(textoSQL,valoresParaSQL, (err,res)=>{
                (err ? rechazar(err): resolver(res))
            })
        })
    }
    borrarTemasSeleccionados(){
        var textoSQL=" delete from temasSeleccionados;"
        return new Promise ((resolver, rechazar)=>{
            this.laConexion.all(textoSQL, (err,res)=>{
                (err ? rechazar(err): resolver(res))
            })
        })

    }
    //---------------------------------------------------------------------
    //     CONTADOR
    //---------------------------------------------------------------------
    verContador(){
        var textoSQL = "select * from contadorUsuarios;";
        return new Promise ((resolver, rechazar)=>{
            this.laConexion.all(textoSQL,(err,res)=>{
                (err ? rechazar(err): resolver(res[0].contador))
            })
        })
    }

    /*modificarContador(){
        try {
    
            //Meto la nueva puntuación en la tabla
            var textoSQL = "UPDATE contadorUsuarios SET contador = contador + 1;";
            
            new Promise((resolver, rechazar) => {
                this.laConexion.all(textoSQL, (err, res) => {
                    (err ? rechazar(err) : resolver(res));
                });
            });
        } catch (err) {
            console.error(err);
        }
    }//*/
    /*async incrementarYObtenerContador(){
        const incrementSQL = "UPDATE contadorUsuarios SET contador = contador + 1 WHERE id = 1";
        const getSQL = "SELECT * FROM contadorUsuarios WHERE id = 1";

        return new Promise((resolve, reject) => {
            this.laConexion.run(incrementSQL, (err) => {
                if (err) {
                    reject(err);
                } else {
                    this.laConexion.get(getSQL, (err, row) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(row.contador);
                        }
                    });
                }
            });
        });
        
    }//*/
    
    incrementarYObtenerContador() {
        return new Promise((resolver, rechazar) => {
            const textoSQL = "UPDATE contadorUsuarios SET contador = (contador % 5)+1;";
            this.laConexion.run(textoSQL, function(err) {
                if (err) {
                    rechazar(err);
                } else {
                    resolver(this.changes);
                }
            });
        }).then(() => {
            return this.verContador();
        }).catch((error) => {
            console.error(error);
        });
    }
    
    //---------------------------------------------------------------------
    //     TEMATICAS
    //---------------------------------------------------------------------
    verTematicas(){
        var textoSQL = "select * from Tematica;";
        return new Promise ((resolver, rechazar)=>{
            this.laConexion.all(textoSQL,(err,res)=>{
                (err ? rechazar(err): resolver(res))
            })
        })
    }


    async asignarTemaAUsuario() {
      // Cargar todas las temáticas de la BD solo si no se han cargado ya
        
        // Incrementamos el contador de usuarios
        var tematica= await this.verTematicas()
        //console.log(res)

        var resultado= await this.temasPara5()
        //console.log(tematica[4]+"<--- soy temática[4]")
        return tematica[resultado-1]
    }
   
    async temasPara5() {

        //TODAS LAS TEMÁTICAS
        var tematicas = await this.verTematicas();
        var cont=await this.verContador()
        console.log(cont+"<-- soy cont")

        // Si el contadorUsuarios es un múltiplo de 5, o si los temas no se han seleccionado todavía,
        // seleccionamos dos temas aleatorios
        var temas=await this.verTemasSeleccionados()

        //console.log(temas+"<-- sin stringificar")
        //console.log(JSON.stringify(temas)+"<-- soy temas stringificado")

        if (temas.length < 2 || cont % 5 === 0){
        //if (/*JSON.stringify(temas) == [ ] ||*/ cont1 % 5 === 0){
            console.log("estoy en el if")

            //si el contador es 5, se limpia todo
            if (cont === 5) {
                await this.borrarTemasSeleccionados()
                temas = [] // También limpia el array temas en la memoria.
            }

            //creo un array con códigos para las temáticas
                //var codigosTemas = [];

            //mientras que ese array tenga menos de dos casillas, necesito que añada índices
            //dos casillas porque cada 5 rondas necesito dos temáticas distintas.

          /*while (temas.length < 2) {
                //índice aleatorio redondeando hacia abajo, (de 0 a 4)
            const indiceAleatorio = Math.floor(Math.random() * 3)+1;

                //si el array con los códigos de las temáticas no tiene este código, lo añade
            if (!temas.includes(indiceAleatorio)) {
                //codigosTemas.push(indiceAleatorio);
                console.log(indiceAleatorio+"<--- soy indiceAleatorio")
                // Guardamos los temas seleccionados
                 await this.añadirTemaSeleccionado(indiceAleatorio)
                 temas=await this.verTemasSeleccionados()
                 console.log(JSON.stringify(temas)+ "<--soy temas en el if de temas para 5" )
                 
            }//*/
            
            while (temas.length < 2) {

                //GENERA NÚMEROS ALEATORIOS DE 0 A 4, PERO REDONDEA HACIA ABAJO SIEMPRE ENTONCES ES
                // DE 0 A 3,Y SE LE SUMA 1 PARA OBTENER VALORES DE 1 A 4 
                //QUE ES COMO ESTÁN INDEXADAS LAS TEMÁTICAS EN LA BASE DE DATOS


                const indiceAleatorio = Math.floor(Math.random() * 4) + 1;//SE HA CAMBIADO

                if (!temas.includes(indiceAleatorio)) {
                    await this.añadirTemaSeleccionado(indiceAleatorio)
                    temas = await this.verTemasSeleccionados()
                    //console.log(JSON.stringify(temas)+ "<--soy temas en el if de temas para 5" )
                }
            }
        }
         // si la longitud es >2, va a ir mal
        //console.log(temas.length+"<-- soy .length")
    
        //me guardo todos los temas en un array
        var tem= await this.verTemasSeleccionados()

        console.log(JSON.stringify(tem[0])+" soy tem[0] "+ JSON.stringify(tem[1])+ " soy tem[1]")

        //EN TEM[0] Y TEM[1] SON JSON, HAY QUE ACCEDER A SU CAMPO

        //CONTADOR INCREMENTADO
        var cont1=await this.incrementarYObtenerContador()
        console.log(cont1+"<-- soy cont1")

        // Asignamos el tema común a los primeros 4 usuarios y el tema especial al quinto
        /*let temaAsignado = cont % 5 == 4 ? temasSeleccionados[0] : temasSeleccionados[1];
                */
        // Se incrementa el contador 
        
        //cuando el contador es == 5, se devuelve un tema
        if(cont==5){
            //cuando es 5 me devuelve la temática con el indice 0
            // VOY A MANDAR UN ÍNDICE, EN LA FUNCION PRINCIPAL ASIGNO LA VARIABLE QUE QUIERA
            var resultado=tem[0].indice
            //console.log(resultado+"<--- soy resultado del if")
            return resultado
        }else{//si no, se devuelve otro
            //console.log(tem[1].indice+"<--- soy resultado del else")
            return tem[1].indice
        }
    }//función
    


 /*async temasPara5(){

        // Seleccionar dos temas diferentes aleatoriamente
        const codigosTemas = [];
        while (codigosTemas.length < 2) {
            const indiceAleatorio = Math.floor(Math.random() * temasAsignados.length);
            if (!codigosTemas.includes(indiceAleatorio)) {
                codigosTemas.push(indiceAleatorio);
            }
        }
        var contadorUsuarios = await this.incrementarYObtenerContador();
        // Asignamos el tema común a los primeros 4 usuarios y el tema especial al quinto
        let temaAsignado = contadorUsuarios % 5 === 0 ? temasAsignados[codigosTemas[0]] : temasAsignados[codigosTemas[1]];
        
        console.log(contadorUsuarios+"<--- soy contador usuarios")
        return temaAsignado
    }//*/


    
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
    //codigo={codigo:35}
    async cogerUsuarioconCod_Palabra(codigo){
        console.log(codigo+"<--- soy codigo (soy JSON)")
        var cod=JSON.parse(codigo)
        //console.log((JSON.parse(codigo)).codigo+"<--- un solo numero")
        //cojo el código y lo relaciono con el de la persona
        var cod_User=await this.relacionarCodigoPalabra_User(cod.codigo)

        //con cod_User cojo la persona entera

        var persona=await this.buscarPersonaConCodigo(cod_User)
            //console.log(persona[0]+"<--- soy lo que devuelve buscar persona")
        return persona[0]
    }
        //
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
            console.log(palabras[0].codigo+" <--- soy palabras[0].codigo")
            let codigosUsuarios = [];
            for (let i = 0; i < palabras.length; i++) {
                //console.log(palabras[i].codigo+"<--- soy el codigo de palabra i")
                //console.log(palabras[i].codigo)
                
                let codigoUsuario = await this.relacionarCodigoPalabra_User(palabras[i].codigo);
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

    //-----------------------------------------------------------------
    //-----------------------------------------------------------------
    //modificar la de una palabra
    //-----------------------------------------------------------------
    //-----------------------------------------------------------------
    
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

    //Me pasa solo un numero, me devuelve otro
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
