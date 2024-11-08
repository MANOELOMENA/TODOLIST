
import Tarefa from "../models/tarefaModel.js";
import { z } from "zod";
import { response } from "express";

const createSchema = z.object({
     tarefa: z.string({
          invalid_type_error: "A tarefa deve ser um texto",
          required_error: "Tarefa é obrigatória"
     })
          .min(3, { message: "a tarefa deve conter pelo menos 3 caracteres" })
          .max(255, { message: "a tarefa deve conter no máximo 255 caracteres" }),
})

const idSchema = z.object({
     id: z.string().uuid({message: "Id inválido"})
})

export const create = async (req, res) => {

     const createValidation = createSchema.safeParse(req.body);
     if (!createValidation.success) {
          res.status(400).json(createValidation.error)
          return
     }
     const { tarefa } = createValidation.data;
     const descricao = req.body?.descricao || null //opcional

     const novaTarefa = {
          tarefa,
          descricao
     }

     try {
          const insertTarefa = await Tarefa.create(novaTarefa)
          res.status(201).json(insertTarefa)
     } catch (error) {
          console.error(error)
          res.status(500).json({ err: "Erro ao cadastrar tarefa" })
     }
};

//GET -> 8080/api/tarefas?page=1&limit=10
export const getAll = async (req, res) => {
     const page = parseInt(req.query.page) || 1
     const limit = parseInt(req.query.limit) || 10
     const offset = (page - 1) * 10 //offset serve para limitar a qauntidade de linhas

     try {
          const tarefas = await Tarefa.findAndCountAll({
               limit,
               offset
          })

          const totalPaginas = Math.ceil(tarefas.count / limit)

          res.status(200).json({
               totalTarefas: tarefas.count,
               totalPaginas,
               paginaAtual: page,
               itensPorPagina: limit,
               proximaPagina: totalPaginas === 0 ? null : `http://localhost:7777/api/tarefas/page=${page + 1}`,
               tarefas: tarefas.rows
          })   
     } catch (error) {
          console.error(error)
          res.status(500).json({ err: "deu erro buscando moral" })
     }
     res.status(200).json("Chegou no controlador")
};
//ok
export const getTarefa = async (req, res) => {
     const idValidation = idSchema.safeParse(req, params)
     if(!idValidation.success) {
          res.status(400).json({message: idValidation.error})
          return
     }
     const id = idValidation.data.id; 
     try{
          const tarefa = await Tarefa.findByPk(id)
          if(!tarefa){
               res.status(404).json({err: "Tarefa não encontrada"})
               return
          }
          res.status(200).json(tarefa)
     }catch (error) {
          console.error(error)
          res.status(500).json({err: "Erro ao buscar Tarefa"})
     }
// const {id} = req. params

//      const tarefa = await Tarefa.findByPk(id);
//      if (tarefa === null) {
//           console.log('Not found!');
//      } else {
//           console.log(tarefa instanceof Tarefa); // true
//      res.status(200).json(tarefa)  
//      }
};

export const updateTarefa = async (req, res) => {
     res.status(200).json("Chegou no controlador")
};

export const updateStatusTarefa = async (req, res) => {
     const idValidation = idSchema.safeParse(req, res)
     if(!idValidation.success) {
          res.status(400).json({message: idValidation.error})
          return
     }

     const id = idValidation.data.id;
     try {
          const tarefa = await Tarefa.findOne({ raw: true, where: {id}})
          if(!tarefa){
               response.status(404).json({err:"Tarefa não encontrada"})
               return
          }

          if (tarefa.status === 'pendente') {
               //att para concluída
               const tarefaAtualizada = await Tarefa.update({status: 'concluida'}, {where: {id}})
          } else if(tarefa.status === 'concluida') {
               //att para pendente
               const tarefaAtualizada = await Tarefa.update(
                    {status: "pendente"},
                    {where: {id} }
               )
               response.status(200).json(tarefaAtualizada)
          }

          console.log(tarefa.id);
     } catch (error) {
          console.error(error);
          response.status(500).json({ err: "Erro ao atualizar tarefa" })
     }
};

export const getTarefaStatus = async (req, res) => {
};
//pk
export const deleteTarefa = async (req, res) => {
     const idValidation = idSchema.safeParse(req, res)
     if(!idValidation.success) {
          res.status(400).json({message: idValidation.error})
          return
     }
     const id = idValidation.data.id;

     try{
          const tarefaDeletada = await Tarefa.destroy({
               where: {id},
          });
          if(tarefaDeletada === 0){
               res.status(404).json({message: "Tarefa não existe!"})
               return
          }
          res.status(200).json({message: "Tarefa excluida"});
     }catch(error){
          console.log(error)
          res.status(500).json({message: "Erro ao excluir Tarefa"})
     }
     
};
