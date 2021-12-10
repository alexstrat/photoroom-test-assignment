
import React from 'react';
import { v4 as uuid } from 'uuid';
import { useStorageReducer, useStorageState } from 'react-storage-hooks';


import { LibraryFolder, LibraryImage } from '../types';

type UseImageLibraryHook = {
  folders: LibraryFolder[]
  images: LibraryImage[]
  /**
   * Add an image to the library.
   */
  addImage: (folderId: string, name: string, base64Original: string, base64Result: string) => LibraryImage;
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


type ImageAction =
  | { type: 'add-image', image: LibraryImage & { folderId: string } }
  | { type: 'add-result-to-image', imageId: string, base64Result: string }
  | { type: 'move-image', imageId: string, folderId: string };

type ImagesState = (LibraryImage & { folderId: string })[]
const imagesReducer = (images: ImagesState, action: ImageAction): ImagesState => {
  switch (action.type) {
    case 'add-image': 
      return [...images, action.image];
    case 'add-result-to-image': {
      const foundIndex = images.findIndex((image) => image.id === action.imageId)
      if (foundIndex === -1) throw new Error(`No image with id ${action.imageId}`)
      const newImage = {
        ...images[foundIndex],
        base64Result: action.base64Result
      }
      images[foundIndex] = newImage
      return [...images]
    }
    case 'move-image': {
      const foundIndex = images.findIndex((image) => image.id === action.imageId)
      if (foundIndex === -1) throw new Error(`No image with id ${action.imageId}`)
      const newImage = {
        ...images[foundIndex],
        folderId: action.folderId
      }
      images[foundIndex] = newImage
      return [...images]
    }
  }
}
/**
 * A hook to manage the library of images: its folders, its images etc.
 * 
 * @returns 
 */
export default function useImageLibrary(): UseImageLibraryHook {
  const [images, dispatch] = useStorageReducer(window.localStorage, 'images', imagesReducer, [])
  const [foldersState, setFoldersState] = useStorageState<Omit<LibraryFolder, 'images'>[]>(window.localStorage, 'folders', [{
    id: UNTITLED_FOLDER_ID,
    name: 'Untitled Folder',
  }])

  const folders = React.useMemo <LibraryFolder[]>(() => {
    if (!images || !foldersState) return []
    return foldersState.map((f) => ({
      ...f,
      images: images.filter((i) => i.folderId === f.id)
    }))
  }, [images, foldersState]);

  const addImage = React.useCallback((folderId: string, name: string, base64Original: string, base64Result: string) => {
    const image = {
      id: uuid(),
      name,
      base64Original,
      base64Result,
      folderId,
    }
    dispatch({ type: 'add-image', image })
    return image
  }, [dispatch])

  const addResultToImage = (imageId: string, base64Result: string) => {
    dispatch({ type: 'add-result-to-image', imageId, base64Result})
  }

  const addFolder = React.useCallback((name: string) => {
    const folder = {
      id: uuid(),
      name,
    }
    setFoldersState((folders) => [...folders || [], folder])
    return folder
  }, [setFoldersState])

  const moveImageToFolder = React.useCallback((imageId: string, folderId: string) => {
    dispatch({ type: 'move-image', imageId, folderId})
  }, [dispatch])
  
  return {
    folders,
    images: images || [],
    addImage,
    addResultToImage,
    addFolder,
    moveImageToFolder,
  }

}