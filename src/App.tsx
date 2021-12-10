import React, { ChangeEvent, useMemo, useState } from 'react';
import './App.css';
import AddButton from './components/AddButton';
import loadImage, { LoadImageResult } from 'blueimp-load-image';
import { API_KEY, API_URL, BASE64_IMAGE_HEADER } from './Constants';
import useImageLibrary from './hooks/useImageLibrary';
import LibrarySideBar from './components/LibrarySideBar';
import ImagePreview from './components/ImagePreview';
import NewFolderModal from './components/NewFolderModal';

function App() {
  const { folders, images, addImage, addResultToImage, addFolder } = useImageLibrary()
  const [activeImageId, setActiveImageId] = useState<string | null>(null)
  const [newFolderModalIsOpen, setNewFolderModalIsOpen] = React.useState(false);

  let uploadImageToServer = (folderId: string, file: File) => {
    loadImage(
      file,
      {
        maxWidth: 400,
        maxHeight: 400,
        canvas: true
      })
      .then(async (imageData: LoadImageResult) => {
        let image = imageData.image as HTMLCanvasElement
        
        let imageBase64 = image.toDataURL("image/png")
        const { id } = addImage(folderId, file.name, imageBase64)
        
        let imageBase64Data = imageBase64.replace(BASE64_IMAGE_HEADER, "")
        let data = {
          image_file_b64: imageBase64Data,
        }
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'x-api-key': API_KEY
          },
          body: JSON.stringify(data)
        });

        if (response.status >= 400 && response.status < 600) {
          throw new Error("Bad response from server");
        }

        const result = await response.json();
        const base64Result = BASE64_IMAGE_HEADER + result.result_b64
        addResultToImage(id, base64Result)
        setActiveImageId(id)
      })
      
      .catch(error => {
        console.error(error)
      })
    }
    
    const activeImage = useMemo(() => {
      return images.find((i) => i.id === activeImageId)
    }, [activeImageId, images]);

    return (
      <div className="App">
        <NewFolderModal
          isOpen={newFolderModalIsOpen}
          onRequestClose={() => setNewFolderModalIsOpen(false)}
          onSubmit={addFolder}
        />
        <div>
          <LibrarySideBar
            folders={folders}
            activeImageId={activeImageId}
            onSelectImage={setActiveImageId}
            onClickAddFolder={() => setNewFolderModalIsOpen(true)}
            onAddImageToFolder={uploadImageToServer}
          />
        </div>
        {
          activeImage ? <ImagePreview {...activeImage}/> : <span></span>
        }
      </div>
      );
    }
    
    export default App;
    