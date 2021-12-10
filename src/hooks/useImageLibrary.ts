
import React from 'react';
import { v4 as uuid } from 'uuid';
import { useLocalStorage } from '@rehooks/local-storage';

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

  /**
   * Will move an image to a folder. captainobvious
   */
  moveImageToFolder: (imageId: string, folderId: string) => void
}

const UNTITLED_FOLDER_ID = 'untitled-folder';

/**
 * A hook to manage the library of images: its folders, its images etc.
 * 
 * @returns 
 */
export default function useImageLibrary(): UseImageLibraryHook {
  const [images, setImages] = useLocalStorage<(LibraryImage & { folderId: string })[]>('images', [])
  const [foldersState, setFoldersState] = useLocalStorage<Omit<LibraryFolder, 'images'>[]>('folders', [{
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
    setImages([...images, image])
    return image
  }, [images, setImages])

  const addResultToImage = React.useCallback((imageId: string, base64Result: string) => {
    const foundIndex = images.findIndex((image) => image.id === imageId)
    if (foundIndex === -1) throw new Error(`No image with id ${imageId}`)
    const newImage = {
      ...images[foundIndex],
      base64Result
    }
    images[foundIndex] = newImage
    setImages([...images])
  }, [images, setImages])

  const addFolder = React.useCallback((name: string) => {
    const folder = {
      id: uuid(),
      name,
    }
    setFoldersState([...folders, folder])
    return folder
  }, [folders, setFoldersState])

  const moveImageToFolder = React.useCallback((imageId: string, folderId: string) => {
    const foundIndex = images.findIndex((image) => image.id === imageId)
    if (foundIndex === -1) throw new Error(`No image with id ${imageId}`)
    const newImage = {
      ...images[foundIndex],
      folderId,
    }
    images[foundIndex] = newImage
    setImages([...images])
  }, [images, setImages])
  
  return {
    folders,
    images,
    addImage,
    addResultToImage,
    addFolder,
    moveImageToFolder,
  }

}