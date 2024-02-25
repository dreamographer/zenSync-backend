import express from "express";
import { validateToken } from "../middleware/validateToken"; 
import { validateRequest } from "../middleware/validateRequest";
import { fileSchema } from "../validators/fileValidator";
import { fileController } from "../controllers/FileController";
import { FileRepository } from "../../database/repository/fileRepository";
import { FileService } from "../../services/fileService";

const router = express.Router();
const fileRepository=new FileRepository()
const fileService = new FileService(fileRepository);
const FileController = new fileController(fileService);
router.use(validateToken);

// Route to get all the all files of a folder
router.get("/folder/:folderId", FileController.getAllFilesInFolder.bind(fileController));

// Route to create a new file
router.post("/", validateRequest(fileSchema),FileController.createFile.bind(fileController));

// Route to delete a file
router.delete("/:fileId", FileController.deleteFile.bind(fileController));

// Route to update a file
router.put("/:fileId",  validateRequest(fileSchema),FileController.updateFile.bind(fileController));


export default router;
