import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Form,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Spinner,
} from "reactstrap";
import FormInput from "../../../common/components/Shared/FormInput";
import PageHelmet from "../../../common/components/Shared/PageHelmet";
import {
  updateUserPassword,
  updateUserProfile,
} from "../../../features/user/userServices";

import SideBarLayout from "../../../layout/SideBarLayout";

const Profile = () => {
  const dispatch = useDispatch();
  const { userProfile, isMutation } = useSelector((state) => state.user);

  // MODALS
  const [profileModal, setProfileModal] = useState(false);
  const toggleProfileModal = () => setProfileModal(!profileModal);
  const [passModal, setPassModal] = useState(false);
  const togglePassModal = () => setPassModal(!passModal);

  // INPUT STATE
  const [username, setUsername] = useState(userProfile?.user?.username);
  const [email, setEmail] = useState(userProfile?.user?.email);
  const [image, setImage] = useState(null);

  const handleChangeUsername = (e) => setUsername(e.target.value);
  const handleChangeEmail = (e) => setEmail(e.target.value);
  const handleChangeImage = (e) => setImage(e.target.files[0]);

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.set("username", username);
    formData.set("email", email);
    if (image) {
      formData.set("image", image);
    }
    dispatch(updateUserProfile(formData));
  };

  const [values, setValues] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const handleChangePasses = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    dispatch(updateUserPassword(values));
  };

  return (
    <>
      <PageHelmet title={"Hồ sơ cá nhân"} />
      <SideBarLayout>
        <section className="wishlist-section">
          <h4 className="mb-4">Hồ sơ cá nhân</h4>

          {/* Thẻ thông tin người dùng */}
          <div
            className="d-flex flex-column align-items-center gap-3 text-center mx-auto"
            style={{
              maxWidth: "300px",
              boxShadow:
                "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px",
              padding: "20px 10px",
              borderRadius: "20px",
            }}
          >
            <img
              src={userProfile?.user?.image}
              alt="Ảnh người dùng"
              width={100}
              height={100}
              className="rounded-circle"
            />
            <ul className="d-flex flex-column gap-2">
              <li>
                <span className="fw-bold">Tên đăng nhập:</span>{" "}
                <span>{userProfile?.user?.username.toUpperCase()}</span>
              </li>
              <li>
                <span className="fw-bold">Email:</span>{" "}
                <span>{userProfile?.user?.email}</span>
              </li>
            </ul>
          </div>

          {/* Nút mở modal */}
          <div className="d-flex justify-content-center gap-3 mt-3">
            <Button color="info" onClick={toggleProfileModal}>
              Chỉnh sửa hồ sơ
            </Button>
            <Button color="dark" onClick={togglePassModal}>
              Đổi mật khẩu
            </Button>
          </div>

          {/* Modal cập nhật hồ sơ */}
          <Modal isOpen={profileModal} toggle={toggleProfileModal} centered>
            <ModalHeader toggle={toggleProfileModal}>
              Chỉnh sửa hồ sơ
            </ModalHeader>
            <ModalBody>
              <Form>
                <FormInput
                  type="text"
                  name="username"
                  onChange={handleChangeUsername}
                  value={username}
                  placeholder="Tên đăng nhập"
                />
                <FormInput
                  type="email"
                  name="email"
                  onChange={handleChangeEmail}
                  value={email}
                  placeholder="Email"
                />
                <Input
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={handleChangeImage}
                />
              </Form>
            </ModalBody>
            <ModalFooter>
              {isMutation.loading ? (
                <Button color="primary" disabled>
                  <Spinner size={"sm"} />
                </Button>
              ) : (
                <Button
                  color="info"
                  onClick={(e) => {
                    handleUpdateProfile(e);
                    if (isMutation.loading === "false") {
                      toggleProfileModal();
                    }
                  }}
                >
                  Lưu thay đổi
                </Button>
              )}
              <Button color="secondary" onClick={toggleProfileModal}>
                Hủy
              </Button>
            </ModalFooter>
          </Modal>

          {/* Modal đổi mật khẩu */}
          <Modal isOpen={passModal} toggle={togglePassModal} centered>
            <ModalHeader toggle={togglePassModal}>Đổi mật khẩu</ModalHeader>
            <ModalBody>
              <Form>
                <FormInput
                  type="password"
                  name="currentPassword"
                  onChange={handleChangePasses}
                  placeholder="Mật khẩu hiện tại"
                />
                <FormInput
                  type="password"
                  name="newPassword"
                  onChange={handleChangePasses}
                  placeholder="Mật khẩu mới"
                />
                <FormInput
                  type="password"
                  name="confirmNewPassword"
                  onChange={handleChangePasses}
                  placeholder="Xác nhận mật khẩu mới"
                />
              </Form>
            </ModalBody>
            <ModalFooter>
              {isMutation.loading ? (
                <Button color="info" disabled>
                  <Spinner size={"sm"} />
                </Button>
              ) : (
                <Button
                  color="info"
                  onClick={(e) => {
                    handleUpdatePassword(e);
                    if (isMutation.loading === "false") {
                      togglePassModal();
                    }
                  }}
                >
                  Cập nhật
                </Button>
              )}
              <Button color="secondary" onClick={togglePassModal}>
                Hủy
              </Button>
            </ModalFooter>
          </Modal>
        </section>
      </SideBarLayout>
    </>
  );
};

export default Profile;
