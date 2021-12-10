import React from 'react'
import { LibraryFolder } from '../../types'

type LibrarySideBarProps = {
  folders: LibraryFolder[]
  activeImageId?: string | null,
  onSelectImage?: (imageId: string) => void
  onClickAddFolder?: () => void
  onClickMove?: (imageId: string) => void
  onAddImageToFolder?: (folderId: string, file: File) => void;
}

const LibrarySideBar = ({
  folders,
  activeImageId,
  onSelectImage,
  onClickAddFolder,
  onClickMove,
  onAddImageToFolder
}: LibrarySideBarProps) => {
  return (
    <nav>
    {
      folders.map((folder) => (
        <div key={folder.id}>
          <h2>{folder.name}</h2>
          <ul>
          {
            folder.images.map((image) => (
              <li
                key={image.id}
                onClick={() => onSelectImage?.(image.id)}
              >{image.name} {image.id === activeImageId ? '(selected)': ''}
                <button onClick={() => onClickMove?.(image.id)}>Move</button>
              </li>
            ))
          }
          </ul>
          <input type="file"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                onAddImageToFolder?.(folder.id, e.target.files[0])
              } else {
                console.error("No file was picked")
              }
            }}
            accept=".png, .jpg, .jpeg" />
          <hr />
      </div>
      ))
    }
    <button onClick={onClickAddFolder}>Add a folder</button>
    </nav>
  )
}

export default LibrarySideBar