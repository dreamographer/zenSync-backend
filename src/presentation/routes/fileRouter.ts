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
const workspaceRepository = new WorkspaceRepository();
const workspaceService = new WorkspaceService(workspaceRepository);
const folderRepository = new FolderRepository();
const fileRepository=new FileRepository()
const folderService = new FolderService(folderRepository, workspaceService);
const fileService = new FileService(fileRepository, folderService);
const fileController = new FileController(fileService);


router.get("/public/:fileId", fileController.getFile.bind(fileController));
router.use(validateToken); 
  
router.get("/trash", fileController.getAllFilesInTrash.bind(fileController));

router.patch("/trash/:fileId", fileController.restoreFile.bind(fileController)); 

// get all the all files of a folder
router.get("/folder/:folderId", fileController.getAllFilesInFolder.bind(fileController));


// create a new file
router.post("/", validateRequest(fileSchema),fileController.createFile.bind(fileController));

// delete a file
router.delete("/:fileId", fileController.deleteFile.bind(fileController));

// update a file
router.put(
  "/:fileId",
  validateRequest(fileUpdateSchema),
  fileController.updateFile.bind(fileController)
);

// move to Trash
router.patch(
  "/:fileId",
  fileController.moveToTrash.bind(fileController)
);

router.put(
  "/:fileId/publish",
  validateRequest(fileUpdateSchema),
  fileController.updateIsPublished.bind(fileController)
);

// Get data of the FIle
router.get("/:fileId", fileController.getFile.bind(fileController));

export default router;
