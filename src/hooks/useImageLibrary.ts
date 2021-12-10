
import React, { useState } from 'react';
import { v4 as uuid } from 'uuid';
import { LibraryFolder, LibraryImage } from '../types';

type UseImageLibraryHook = {
  folders: LibraryFolder[]
  images: LibraryImage[]
  /**
   * Add an image to the library.
   */
  addImage: (name: string, base64Original: string) => LibraryImage;
  /**
   * Add a result to an image.
   */
  addResultToImage: (imageId: string, base64Result: string) => void;
}

const UNTITLED_FOLDER_ID = 'unique-folder';

/**
 * A hook to manage the library of images: its folders, its images etc.
 * 
 * @returns 
 */
export default function useImageLibrary(): UseImageLibraryHook {
  const [images, setImages] = useState<(LibraryImage & { folderId: string })[]>([])

  const folders = React.useMemo <LibraryFolder[]>(() => {
    return [{
      id: UNTITLED_FOLDER_ID,
      name: 'Untitled Folder',
      images,
    }]
  }, [images]);

  const addImage = React.useCallback((name: string, base64Original: string) => {
    const image = {
      id: uuid(),
      name,
      base64Original,
      folderId: UNTITLED_FOLDER_ID,
    }
    setImages((images) => [...images, image])
    return image
  }, [setImages])

  const addResultToImage = (imageId: string, base64Result: string) => {
    setImages((images_) => {
      const foundIndex = images_.findIndex((image) => image.id === imageId)
      if (foundIndex === -1) throw new Error(`No image with id ${imageId}`)
      const newImage = {
        ...images_[foundIndex],
        base64Result
      }
      images_[foundIndex] = newImage
      return [...images_]
    })
  }

  return {
    folders,
    images,
    addImage,
    addResultToImage,
  }

}