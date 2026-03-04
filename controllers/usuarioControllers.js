import { check, validationResult } from 'express-validator'
import Usuario from '../models/Usuario.js'
import { generarToken } from '../lib/tokens.js';
import { emailRegistro } from '../lib/email.js';

const formularioLogin = (req, res) => {
    res.render("auth/login", { pagina: "Inicia sesión" });
}

const formularioRegistro = (req, res) => {
    res.render("auth/registro", { pagina: "Registrate con nosotros :)" });
}

const registrarUsuario = async (req, res) => {
    console.log("Intentando registrar a un Usuario Nuevo con los datos del formulario:");

    // 1. Extraer los datos usando los nombres que definiste en tus validaciones
    console.log(req.body);
    const { nombreUsuario: name, emailUsuario: email, passwordUsuario: password } = req.body

    // 2. Validación de los datos del formulario
    await check('nombreUsuario').notEmpty().withMessage("El nombre de la persona no puede ser vacío").run(req);
    await check('emailUsuario').notEmpty().withMessage("El correo electrónico no puede ser vacío").isEmail().withMessage("El correo electrónico no tiene un formato adecuado").run(req)
    await check('passwordUsuario').notEmpty().withMessage("La contraseña parece estar vacía").isLength({ min: 8, max: 30 }).withMessage("La longitud de la contraseña debe ser entre 8 y 30 caractéres").run(req);
    await check('confirmacionUsuario').equals(password).withMessage("Ambas contraseñas deben ser iguales").run(req);

    // Aplicamos las reglas definidas
    let resultadoValidacion = validationResult(req);

    // 3. Verificar si el usuario ya existe (usamos emailUsuario que es la variable con valor)
    const existeUsuario = await Usuario.findOne({ where: { email } })

    if (existeUsuario) {
        return res.render("auth/registro", {
            pagina: "Registrate con nosotros :) ",
            errores: [{ msg: ` Ya existe un usuario asociado al correo: ${email}` }],
            usuario: {
                nombreUsuario: name,
                emailUsuario: email
            }
        });
    }

    // 4. Validar si hay errores de validación
    if (resultadoValidacion.isEmpty()) {
        const data = {
            name,      // Asegúrate que estos nombres coincidan con tu Modelo
            email, 
            password,
            tokenRecovery: generarToken()
        }
        
        const usuario = await Usuario.create(data);

        // Enviar el correo electrónico 
        emailRegistro({
            nombre: usuario.name,
            email: usuario.email,
            token: usuario.tokenRecovery
        })

        // Mostrar mensaje de éxito
        res.render("templates/mensaje", {
            title: "¡Bienvenid@ a BienesRaíces!",
            msg: `La cuenta asociada al correo: ${email}, se ha creado exitosamente, te pedimos confirmar tu cuenta a través del correo electrónico que te hemos enviado. `
        })

    } else {
        // Si hay errores de validación (campos vacíos, password corto, etc)
        res.render("auth/registro", {
            pagina: "Error al intentar crear una cuenta.",
            errores: resultadoValidacion.array(),
            usuario: {
                nombreUsuario: name,
                emailUsuario: email
            }
        });
    }
}

const paginaConfirmacion = async(req, res) =>
{
    const {token: tokenCuenta} = req.params
    console.log("Confirmando la cuenta asociada al token: ", tokenCuenta);

    // Confirmar si el token existe
    const usuarioToken = await(Usuario.findOne({where:{tokenRecovery:tokenCuenta}}))
    console.log(usuarioToken);

    if(!usuarioToken)
    {
        res.render("templates/mensaje" ,{
            title: "Error al confirmar la cuenta",
            msg: `El codigo de Vrificación (No es valido), por favor intentalo de nuevo`});
        }

        //Actualizar los datos del usuario
        usuarioToken.tokenRecovery=null;
        usuarioToken.confirmed=true;
        usuarioToken.save();

        res.render("templates/mensaje",{
            title: "Confirmación Exitosa",
            msg: `La cuenta de ${usuarioToken.name}, asociada al correo electronico: ${usuarioToken.email} se ha confirmado, ahora ya puedes ingresar a la plataforma`
        });
}

const formularioRecuperacion = (req, res) => {
    res.render("auth/recuperarPassword", { pagina: "Te ayudamos a restaurar tu contraseña" });
}

export { formularioLogin, formularioRegistro, registrarUsuario, formularioRecuperacion, paginaConfirmacion }

