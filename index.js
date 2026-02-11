//console.log("Hola desde JS");
import express from 'express'
import usuarioRoutes from './routes/usuarioRoutes.js'
// Crea una instancia del contenedor web 
const app = express();
const PORT = process.env.PORT ?? 4000;

app.use("/", usuarioRoutes)

app.listen(PORT, ()=> {
    console.log(`El servidor esta iniciado en el puerto ${PORT}`)
})

