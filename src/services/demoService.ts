import { v4 as uuidv4 } from "uuid";
import { User } from "../entities/User";
import { IBcrypt } from "../interfaces/IBcrypt";
import { IDemoService } from "../interfaces/IDemoService";
import { IFileRepository } from "../interfaces/IFileRepository";
import { IFolderRepository } from "../interfaces/IFolderRepository";
import { IToken } from "../interfaces/IToken";
import { IUserRepository } from "../interfaces/IUserRepository";
import { IWorkspaceRepository } from "../interfaces/IWorkspaceRepository";

// how long a demo account survives before it is swept away
const DEMO_LIFETIME_MS = 24 * 60 * 60 * 1000;

const DEMO_WORKSPACE_TITLE = "💼 Demo Workspace";
const DEMO_FOLDER_TITLE = "Getting Started";
const DEMO_FILE_TITLES = [
  "Welcome to zenSync",
  "Product Roadmap",
  "Meeting Notes",
];

export class DemoService implements IDemoService {
  private userRepository: IUserRepository;
  private workspaceRepository: IWorkspaceRepository;
  private folderRepository: IFolderRepository;
  private fileRepository: IFileRepository;
  private bcrypt: IBcrypt;
  private token: IToken;

  constructor(
    userRepository: IUserRepository,
    workspaceRepository: IWorkspaceRepository,
    folderRepository: IFolderRepository,
    fileRepository: IFileRepository,
    bcrypt: IBcrypt,
    token: IToken
  ) {
    this.userRepository = userRepository;
    this.workspaceRepository = workspaceRepository;
    this.folderRepository = folderRepository;
    this.fileRepository = fileRepository;
    this.bcrypt = bcrypt;
    this.token = token;
  }

  generateToken(userId: string) {
    return this.token.generateTokens(userId);
  }

  // a throwaway, already verified account so the visitor skips signup entirely
  async createDemoUser(): Promise<User> {
    const handle = uuidv4().replace(/-/g, "").slice(0, 8);
    const password = await this.bcrypt.Encrypt(uuidv4());
    const demoUser = {
      fullname: "Demo User",
      email: `demo+${handle}@zensync.demo`,
      password,
      verify_token: uuidv4(),
      verified: true,
      isDemo: true,
    } as User;
    return await this.userRepository.create(demoUser);
  }

  // give the account something to look at instead of an empty dashboard
  async seedDemoData(userId: string): Promise<void> {
    const workspace = await this.workspaceRepository.create({
      workspaceOwner: userId,
      title: DEMO_WORKSPACE_TITLE,
      workspaceType: "private",
    });
    if (!workspace) return;

    const folder = await this.folderRepository.create({
      title: DEMO_FOLDER_TITLE,
      workspaceId: workspace.id,
    });

    for (const title of DEMO_FILE_TITLES) {
      await this.fileRepository.create({ title, folderId: folder.id });
    }
  }

  // cascade: files -> folders -> workspaces -> users
  async purgeExpiredDemoUsers(): Promise<number> {
    const cutoff = new Date(Date.now() - DEMO_LIFETIME_MS);
    const userIds = await this.userRepository.findExpiredDemoUserIds(cutoff);
    if (!userIds.length) return 0;

    const workspaceIds = await this.workspaceRepository.findIdsByOwners(
      userIds
    );
    const folderIds = await this.folderRepository.findIdsByWorkspaces(
      workspaceIds
    );

    await this.fileRepository.deleteByFolders(folderIds);
    await this.folderRepository.deleteByWorkspaces(workspaceIds);
    await this.workspaceRepository.deleteByOwners(userIds);
    return await this.userRepository.deleteByIds(userIds);
  }
}
