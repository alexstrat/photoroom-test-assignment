
import React, { useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { useLocalStorage } from 'react-use';

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
    setImages((images) => [...images || [], image])
    return image
  }, [setImages])

  const addResultToImage = (imageId: string, base64Result: string) => {
    const images_ = images || []
    const foundIndex = images_.findIndex((image) => image.id === imageId)
    if (foundIndex === -1) throw new Error(`No image with id ${imageId}`)
    const newImage = {
      ...images_[foundIndex],
      base64Result
    }
    images_[foundIndex] = newImage
    setImages([...images_])
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
    setImages((images_ = []) => {
      const foundIndex = images_.findIndex((image) => image.id === imageId)
      if (foundIndex === -1) throw new Error(`No image with id ${imageId}`)
      const newImage = {
        ...images_[foundIndex],
        folderId,
      }
      images_[foundIndex] = newImage
      return [...images_]
    })
  }, [setImages])
  
  return {
    folders,
    images: images || [],
    addImage,
    addResultToImage,
    addFolder,
    moveImageToFolder,
  }

}