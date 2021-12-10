import React from 'react'
import Modal from 'react-modal';
import { LibraryFolder } from '../../types';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

type MoveImageModalProps = {
  folders: LibraryFolder[]
  imageName: string;
  isOpen: boolean;
  onRequestClose?: () => void
  onSubmit?: (folderId: string) => void 
}

const MoveImageModal = ({
  isOpen,
  imageName,
  folders,
  onRequestClose,
  onSubmit
}: MoveImageModalProps) => {
  const [folderId, setFolderId] = React.useState<string | undefined>(undefined);
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customStyles}
      contentLabel="Example Modal"
    >
      <div>
      <h1>
        Move {imageName}
      </h1>
      <form onSubmit={(e) => {
        e.preventDefault()
        if (!folderId) return
        onSubmit?.(folderId)
        setFolderId(undefined)
        onRequestClose?.()
      }}>
        <select value={folderId} onChange={(e) => setFolderId(e.target.value)}>
          {
              folders.map((folder) => <option value={folder.id}>{folder.name}</option>)
          }
        </select>
        <button type="submit" disabled={!folderId}>Move</button>
      </form>
      <button onClick={onRequestClose}>Cancel</button>
      </div>
    </Modal>
  )
}

export default MoveImageModal