export interface File {
  id: string;
  title: string;
  folderId: string;
  in_trash: boolean;
  coverImage?: string;
  isPublished:boolean;
}
