import express from "express";
import { validateRequest } from "../middleware/validateRequest";
import { WorkspaceController } from "../controllers/workspaceController";
import { WorkspaceService } from "../../services/workspaceService";
import { WorkspaceRepository } from "../../database/repository/workspaceRepository";
import { validateToken } from "../middleware/validateToken";
import { workspaceSchema } from "../validators/workspaceValidator";
const router = express.Router();
const workspaceRepository = new WorkspaceRepository();
const workspaceService = new WorkspaceService(workspaceRepository);
const workspaceController = new WorkspaceController(workspaceService);

router.use(validateToken);
 
// Create a new workspace
router.post(
  "/",
  validateRequest(workspaceSchema),
  workspaceController.onCreateWorkspace.bind(workspaceController)
);

// find Workspace by Id
router.get(
  "/",
  workspaceController.onFindUserWorkspace.bind(workspaceController)
);

// Update an existing workspace
router.put(
  "/:id",
  validateRequest(workspaceSchema),
  workspaceController.onUpdateWorkspace.bind(workspaceController)
);

// Delete a workspace
router.delete(
  "/:id",
  workspaceController.onDeleteWorkspace.bind(workspaceController)
);

// Add a collaborator to a workspace
router.post(
  "/collaborators/:workspaceId",
  workspaceController.onAddCollaborator.bind(workspaceController)
);

// Remove a collaborator from a workspace
router.delete(
  "/:id/collaborators/:userId",
  workspaceController.onRemoveCollaborator.bind(workspaceController)
);

export default router;
