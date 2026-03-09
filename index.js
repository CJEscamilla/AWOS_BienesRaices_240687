//console.log("Hola desde JS");
import express from 'express';
import usuarioRoutes from './routes/usuarioRoutes.js';
import { connectDB} from './config/db.js';
import session from "express-session";
import cookieParser from "cookie-parser";
import csurf from "@dr.pogodin/csurf";

// Crea una instancia del contenedor web 
const app = express();

// Habilitar el Template Engine (PUG)
app.set("view engine", "pug");
app.set("views", "./views")

// Definimos la carpeta de los recursos estáticos
app.use(express.static('public'))

// Habilitar lectura de datos a través de las peticiones (REQUEST)
app.use(express.urlencoded({extended: true}))
// Activamos la opción para poder manipular Cookies - Almacenamiento en el cliente (navegador) 
app.use(cookieParser());
app.use(express.json());

// Definimos el Middleware  - 
app.use(session({
    secret: process.env.SESSION_SECRET||"PC-BienesRaices_MATRICULA_csrf_secret",
    resave: false,
    saveUninitialized: false, 
    cookie: {
        httpOnly: true, 
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production"
        }
    }));

//Habilitamos el mecanismo para protección de CSRF
app.use(csurf())


// Habilitar los tokes de CSRF para cualquier formulario
app.use((req, res, next) =>
{
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.use("/auth", usuarioRoutes)
await connectDB();

// Cachear el error
app.use((err, req, res, next) => {
    if (err.code === "EBADCSRFTOKEN") {
        return res.status(403).render("templates/mensaje", {
            pagina: "Error de seguridad",
            title: "Error CSRF",
            msg: "El formulario expiró o fue manipulado. Recarga la página."
        });
    }

    next(err);
});

app.listen(process.env.PORT ?? 4000, ()=> {
    console.log(`El servidor esta iniciado en el puerto ${process.env.PORT}`)
}) 