import React from 'react'
import Modal from 'react-modal';

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

type NewFolderModalProps = {
  isOpen: boolean;
  onRequestClose?: () => void
  onSubmit?: (name:string) => void 
}

const NewFolderModal = ({
  isOpen,
  onRequestClose,
  onSubmit
}: NewFolderModalProps) => {
  const [folderName, setFolderName] = React.useState('');
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customStyles}
      contentLabel="Example Modal"
    >
      <div>
      <h1>
        Add a folder
      </h1>
      <form onSubmit={(e) => {
        e.preventDefault()
          onSubmit?.(folderName)
          setFolderName('')
          onRequestClose?.()
      }}>
        <input
          type="text"
          placeholder="Folder name"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
        />
        <button type="submit" disabled={folderName.length === 0}>Create</button>
      </form>
      <button onClick={onRequestClose}>Cancel</button>
      </div>
    </Modal>
  )
}

export default NewFolderModal