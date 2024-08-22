import React from 'react';
import { Modal, Button } from 'react-bootstrap';

function FileModal({ show, onHide, file }) {
  const renderFileContent = () => {
    const { url, mimeType } = file;

    if (mimeType.startsWith('image/')) {
      return <img src={url} alt="File" className="img-fluid" />;
    } else if (mimeType === 'application/pdf') {
      return (
        <embed src={url} type="application/pdf" width="100%" height="500px" />
      );
    } else if (mimeType.startsWith('video/')) {
      return (
        <video controls width="100%">
          <source src={url} type={mimeType} />
          Your browser does not support the video tag.
        </video>
      );
    } else {
      return <p>Preview not available. Use the button below to download the file.</p>;
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>{file.fileName}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {renderFileContent()}
        <div className="mt-3">
          <Button href={file.url} download={file.fileName} variant="primary">
            Download 
          </Button>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default FileModal;
