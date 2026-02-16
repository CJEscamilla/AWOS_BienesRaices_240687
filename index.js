import express, { json } from "express";
import usuarioRouter from "./routes/usuarioRouter.js";

const app = express();
const PORT = process.env.PORT ?? 4000;

app.set("view engine", "pug");
app.set("views", "./views")

app.use(express.static(`public`))

app.use("/auth", usuarioRouter);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
