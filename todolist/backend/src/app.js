import express from "express";
import cors from "cors";

import conn from "./config/conn.js";

import Tarefa from "./models/tarefaModel.js";

import tarefaRouter from "./routes/tarefaRoute.js";

const app = express();

//middlewares
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

conn.sync(/*{force: true}*/).then(() => {
     console.log("Conectado!")
}).catch((error => {
     console.error(error)
}))

app.use("/api/tarefas", tarefaRouter)

app.use((req, res) => {
     res.status(404).json({ message: "rota não encontrada" });
});

export default app;