import React from 'react'
import { LibraryFolder } from '../../types'

type LibrarySideBarProps = {
  folders: LibraryFolder[]
  activeImageId?: string | null,
  onSelectImage?: (imageId: string) => void
}

const LibrarySideBar = ({
  folders,
  activeImageId,
  onSelectImage
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
              >{image.name} {image.id === activeImageId ? '(selected)': ''}</li>
            ))
          }
          </ul>
      </div>
      ))
    }
    </nav>
  )
}

export default LibrarySideBar