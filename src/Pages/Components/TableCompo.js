import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

export function TableCompo(props) {
  const [showModal, setShowModal] = useState(false);
  const [editedContent, setEditedContent] = useState(null);

  const handleShow = (content) => {
    props.setModalContent(content);
    setEditedContent(content);
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedContent((prevContent) => ({
      ...prevContent,
      [name]: value,
    }));
  };

  const handleSave = () => {
    console.log("Saved Content:", editedContent);
    props.setModalContent(editedContent);
    setShowModal(false);
  };

  const headerKeys =
    props.inputPattern.length > 0 ? props.inputPattern[0].header : [];

  return (
    <>
      <h1>{props.title}</h1>
      <div className="table-responsive">
        <table className="table table-primary">
          <thead>
            <tr>
              {headerKeys.map((headerName, headerIdx) => (
                <th scope="col" key={headerIdx}>
                  {headerName}
                </th>
              ))}
              {props.link && <th>Details</th>}
            </tr>
          </thead>
          <tbody>
            {props.inputPattern.length > 0 &&
              props.inputPattern[0].content.map((contentObj, contentIdx) => (
                <tr key={contentIdx}>
                  {headerKeys.map((key, keyIdx) => (
                    <td key={keyIdx}>{contentObj[key] || "N/A"}</td>
                  ))}
                  {props.link && (
                    <td>
                      <button
                        type="button"
                        className="btn btn-outline-primary"
                        onClick={() => handleShow(contentObj)}
                      >
                        Show Details
                      </button>
                    </td>
                  )}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editedContent ? (
            <Form>
              {Object.keys(editedContent).map((key) => (
                <Form.Group key={key} controlId={`formBasic${key}`}>
                  <Form.Label>{key}</Form.Label>
                  <Form.Control
                    type="text"
                    name={key}
                    value={editedContent[key] || ""}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              ))}
            </Form>
          ) : (
            "Loading..."
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          {props.isChangeable !== false && (
            <Button variant="primary" onClick={handleSave}>
              Save Changes
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
}
