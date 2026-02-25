//console.log("Hola desde JS");
import express from 'express';
import usuarioRoutes from './routes/usuarioRoutes.js';
import { connectDB} from './config/db.js';

// Crea una instancia del contenedor web 
const app = express();
const PORT = process.env.PORT ?? 4000;

// Habilitar el Template Engine (PUG)
app.set("view engine", "pug");
app.set("views", "./views")

// Definimos la carpeta de los recursos estáticos
app.use(express.static('public'))


app.use("/auth", usuarioRoutes)
await connectDB();

app.listen(PORT, ()=> {
    console.log(`El servidor esta iniciado en el puerto ${PORT}`)
}) 
