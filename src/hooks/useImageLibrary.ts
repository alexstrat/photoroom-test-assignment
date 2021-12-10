
import React, { useState } from 'react';
import { v4 as uuid } from 'uuid';
import { LibraryFolder, LibraryImage } from '../types';

type UseImageLibraryHook = {
  folders: LibraryFolder[]
  images: LibraryImage[]
  /**
   * Add an image to the library.
   */
  addImage: (folderId: string, name: string, base64Original: string) => LibraryImage;
  /**
   * Add a result to an image.
   */
  addResultToImage: (imageId: string, base64Result: string) => void;


  /**
   * Create a new folder.
   */
  addFolder: (folderName: string) => Omit<LibraryFolder, 'images'>
}

const UNTITLED_FOLDER_ID = 'untitled-folder';

/**
 * A hook to manage the library of images: its folders, its images etc.
 * 
 * @returns 
 */
export default function useImageLibrary(): UseImageLibraryHook {
  const [images, setImages] = useState<(LibraryImage & { folderId: string })[]>([])
  const [foldersState, setFoldersState] = useState<Omit<LibraryFolder, 'images'>[]>([{
    id: UNTITLED_FOLDER_ID,
    name: 'Untitled Folder',
  }])

  const folders = React.useMemo <LibraryFolder[]>(() => {
    return foldersState.map((f) => ({
      ...f,
      images: images.filter((i) => i.folderId === f.id)
    }))
  }, [images, foldersState]);

  const addImage = React.useCallback((folderId: string, name: string, base64Original: string) => {
    const image = {
      id: uuid(),
      name,
      base64Original,
      folderId,
    }
    setImages((images) => [...images, image])
    return image
  }, [setImages])

  const addResultToImage = React.useCallback((imageId: string, base64Result: string) => {
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
  }, [setImages])

  const addFolder = React.useCallback((name: string) => {
    const folder = {
      id: uuid(),
      name,
    }
    setFoldersState((folders) => [...folders, folder])
    return folder
  }, [setFoldersState])
  
  return {
    folders,
    images,
    addImage,
    addResultToImage,
    addFolder,
  }

}