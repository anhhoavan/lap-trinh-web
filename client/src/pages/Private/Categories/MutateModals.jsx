import React from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
} from "reactstrap";

// Modal Tạo Danh Mục
export const CreateCategoryModal = ({
  modalState,
  toggle,
  ModalHead,
  name,
  setName,
  description,
  setDescription,
  setNewImage,
  handleCreateCategory,
}) => {
  return (
    <Modal isOpen={modalState} toggle={toggle} centered>
      <ModalHeader toggle={toggle}>{ModalHead}</ModalHeader>
      <ModalBody>
        <Input
          name="name"
          type="text"
          placeholder="Tên danh mục"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          className="my-3"
          name="description"
          placeholder="Mô tả"
          type="textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Input
          name="image"
          type="file"
          accept="image/*"
          onChange={(e) => setNewImage(e.target.files[0])}
        />
      </ModalBody>
      <ModalFooter>
        <Button
          color="info"
          onClick={() => {
            handleCreateCategory();
            toggle();
          }}
        >
          Tạo mới
        </Button>
        <Button color="primary" onClick={toggle}>
          Hủy
        </Button>
      </ModalFooter>
    </Modal>
  );
};

// Modal Cập Nhật Danh Mục
export const UpdateCategoryModal = ({
  modalState,
  toggle,
  ModalHead,
  category,
  setCategory,
  setImage,
  handleUpdateCategory,
}) => {
  return (
    <Modal isOpen={modalState} toggle={toggle} centered>
      <ModalHeader toggle={toggle}>{ModalHead}</ModalHeader>
      <ModalBody>
        <Input
          name="name"
          type="text"
          placeholder="Tên danh mục"
          value={category?.name}
          onChange={(e) => setCategory({ ...category, name: e.target.value })}
        />
        <Input
          className="my-3"
          name="description"
          type="textarea"
          placeholder="Mô tả"
          value={category?.description}
          onChange={(e) =>
            setCategory({ ...category, description: e.target.value })
          }
        />
        <Input
          name="image"
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />
      </ModalBody>
      <ModalFooter>
        <Button
          color="info"
          onClick={() => {
            handleUpdateCategory();
            toggle();
          }}
        >
          Cập nhật
        </Button>
        <Button color="primary" onClick={toggle}>
          Hủy
        </Button>
      </ModalFooter>
    </Modal>
  );
};
