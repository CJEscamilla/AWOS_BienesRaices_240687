import express, { json } from "express";
import usuarioRoutes from "./routes/usuarioRoutes.js";

const app = express();
const PORT = process.env.PORT ?? 4000;

app.set("view engine", "pug");
app.set("views", "./views")

app.use(express.static(`public`))

app.use("/auth", usuarioRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
