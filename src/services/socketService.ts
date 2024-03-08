import { Socket } from "socket.io";
import { FileService } from "./fileService";
import { IFileService } from "../interfaces/IFileService";
export class SocketService {
  private FileService: IFileService;

  constructor(dataService: IFileService) {
    this.FileService = dataService;
  }

  handleConnection(socket: Socket): void {
    console.log("a user connected inside");

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });

    socket.on("updateContent", async (data: any) => {
      try {
        await this.FileService.updateContent(data.id, data.content);
      } catch (error) {
        console.error("Error processing data:", error);
      }
    });
  }
}
