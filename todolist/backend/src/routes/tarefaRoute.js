import { Router } from "express";
import { create, deleteTarefa, getAll, getTarefa, getTarefaStatus, updateStatusTarefa, updateTarefa } from "../controllers/tarefaController.js";

const router = Router();

router.get('/', getAll);
router.post('/', create);
router.get('/:id', getTarefa);
router.put('/:id', updateTarefa);
router.patch('/:id/status', updateStatusTarefa);
router.get('/status/:situacao', getTarefaStatus);
router.delete('/:id', deleteTarefa)

export default router;