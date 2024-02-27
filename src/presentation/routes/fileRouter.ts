import express from "express";
import { validateToken } from "../middleware/validateToken"; 
import { validateRequest } from "../middleware/validateRequest";
import { fileSchema, fileUpdateSchema } from "../validators/fileValidator";
import { FileController } from "../controllers/FileController";
import { FileRepository } from "../../database/repository/fileRepository";
import { FileService } from "../../services/fileService";
import { FolderRepository } from "../../database/repository/folderRepository";
import { WorkspaceRepository } from "../../database/repository/workspaceRepository";
import { WorkspaceService } from "../../services/workspaceService";
import { FolderService } from "../../services/folderService";

const router = express.Router();
const fileRepository=new FileRepository()
const folderRepository = new FolderRepository();
const workspaceRepository = new WorkspaceRepository();
const workspaceService = new WorkspaceService(workspaceRepository);
const folderService = new FolderService(folderRepository, workspaceService);
const fileService = new FileService(fileRepository, folderService);
const fileController = new FileController(fileService);
router.use(validateToken);

// Route to get all the all files of a folder
router.get("/folder/:folderId", fileController.getAllFilesInFolder.bind(fileController));

// Route to create a new file
router.post("/", validateRequest(fileSchema),fileController.createFile.bind(fileController));

// Route to delete a file
router.delete("/:fileId", fileController.deleteFile.bind(fileController));

// Route to update a file
router.put(
  "/:fileId",
  validateRequest(fileUpdateSchema),
  fileController.updateFile.bind(fileController)
);


export default router;
