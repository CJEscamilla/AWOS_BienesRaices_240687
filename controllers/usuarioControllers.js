import {check, validationResult } from 'express-validator'
import Usuario from '../models/Usuario.js'
import {generarToken} from '../lib/tokens.js'

const formularioLogin = (req, res) => {
     res.render("auth/login", {pagina: "Inicia sesión"});
}
const formularioRegistro = (req,res) =>
{
    res.render("auth/registro", {pagina: "Registrate con nosotros :)"});
}

const registrarUsuario = async(req,res) =>
{
    console.log("Intentando registrar a un Usuario Nuevo con los datos del formulario:");
    console.log(req.body);
    const {nombreUsuario:name, emailUsuario: email, passwordUsuario:password} = req.body 


    // Validación de los datos del formulario previo a registro en la BD
    // Definir reglas de validacion
    await check('nombreUsuario').notEmpty().withMessage("El nombre de la persona no puede ser vacío").run(req);
    await check('emailUsuario').notEmpty().withMessage("El correo electrónico no puede ser vacío").isEmail().withMessage("El correo electrónico no tiene un formato adecuado").run(req)
    await check('passwordUsuario').notEmpty().withMessage("La contraseña parece estar vacía").isLength({ min: 8 , max:30}).withMessage("La longitud de la contraseña debe ser entre 8 y 30 caractéres").run(req);
    await check('confirmacionUsuario').equals(password).withMessage("Ambas contraseñas deben ser iguales").run(req);

    // aplicamos la reglas definidas
    let resultadoValidacion = validationResult(req);

    // Verificar si el usuario no esta previamente registrado en la bd
    const existeUsuario = await Usuario.findOne({where: {email}})
  

    if(existeUsuario)
    {  res.render("auth/registro", { 
            pagina: "Registrate con nosotros :) ", 
            errores: [{msg:` Ya existe un usuario asociado al correo: ${email}`}],
            usuario: { nombreUsuario: name,           
            }});
    }


    // Validar si hay errores en la recepción de datos , si no mandar a bd

    if(resultadoValidacion.isEmpty())
    {
        const data =
        {
            name, 
            email, 
            password,
            token: generarToken()
        }
        const usuario = await Usuario.create(data);
        res.render("templates/mensaje",{
            title: "¡Bienvenid@ a BienesRaíces!",
            msg: `La cuenta asociada al correo: ${email}, se ha creado exitosamente, te pedimos confirmar tu a través del correo electrónico que te hemos enviado. `
        })

    }
    else 
        res.render("auth/registro", { 
            pagina: "Error al interar crear una cuenta.", 
            errores: resultadoValidacion.array(), 
            usuario: { nombreUsuario: name,
                emailUsuario: email
            }});
    
            
}

const formularioRecuperacion = (req,res) =>
{
    res.render("auth/recuperarPassword", {pagina: "Te ayudamos a restaurar tu contraseña"});
}


export { formularioLogin, formularioRegistro, registrarUsuario, formularioRecuperacion}