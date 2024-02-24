import express from "express";
import { validateRequest } from "../middleware/validateRequest";
import { FolderController } from "../controllers/FolderController";
import { FolderService } from "../../services/folderService";
import { FolderRepository } from "../../database/repository/folderRepository";
import { validateToken } from "../middleware/validateToken"; 
import { folderSchema } from "../validators/folderValidator";
const router = express.Router();
const folderRepository = new FolderRepository();
const folderService = new FolderService(folderRepository);
const folderController = new FolderController(folderService);

router.use(validateToken);

// Get all folders for a user
router.get("/", folderController.getAllFolders.bind(folderController));

// Get a specific folder by ID
router.get("/:id", folderController.getFolderById.bind(folderController));

// Create a new folder
router.post(
  "/",
  validateRequest(folderSchema),
  folderController.createFolder.bind(folderController)
);

// Update an existing folder
router.put(
  "/:id",
  validateRequest(folderSchema),
  folderController.updateFolder.bind(folderController)
);

// Delete a folder
router.delete("/:id", folderController.deleteFolder.bind(folderController));

export default router;
