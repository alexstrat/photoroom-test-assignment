export type LibraryImage = {
  id: string;
  name: string;
  base64Original: string;
  base64Result?: string;
}

export type LibraryFolder = {
  id: string;
  name: string;
  images: LibraryImage[]
}
