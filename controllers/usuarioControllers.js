const formularioLogin = (req, res) => {
     res.render("auth/login", {pagina: "Inicia sesión"});
}

const formularioRegistro = (req,res) =>
{
    res.render("auth/registro", {pagina: "Registrate con nosotros :)"});
}

const formularioRecuperacion = (req,res) =>
{
    res.render("auth/recuperarPassword", {pagina: "Te ayudamos a restaurar tu contraseña"});
}


export { formularioLogin, formularioRegistro, formularioRecuperacion}