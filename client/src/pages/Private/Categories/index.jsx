import React, { useState } from "react";
import { MdDelete, MdEdit } from "react-icons/md";
import { Link } from "react-router-dom";
import { Alert } from "reactstrap";
import DashboardHead from "../../../common/components/Heads/DashboardHead";
import OverlayLoader from "../../../common/components/Loaders/OverlayLoader";
import PageHelmet from "../../../common/components/Shared/PageHelmet";
import PaginateTable from "../../../common/components/Shared/PaginateTable";
import useGetCategories from "../../../common/hooks/categories/useGetCategories";
import useMutateCategories from "../../../common/hooks/categories/useMutateCategories";
import DashboardLayout from "../../../layout/DashboardLayout";
import { CreateCategoryModal, UpdateCategoryModal } from "./MutateModals";

const Categories = () => {
  // PHÂN TRANG
  const [page, setPage] = useState(1);
  const handlePagination = (pg) => {
    setPage(pg);
  };
  const { allCategories, isMutation } = useGetCategories(5, page);

  // CẬP NHẬT
  const [updateModal, setUpdateModal] = useState(false);
  const toggleUpdateModal = () => setUpdateModal(!updateModal);

  // TẠO MỚI
  const [createModal, setCreateModal] = useState(false);
  const toggleCreateModal = () => setCreateModal(!createModal);

  // XỬ LÝ DỮ LIỆU
  const {
    category,
    setCategory,
    name,
    setName,
    description,
    setDescription,
    setNewImage,
    setImage,
    handleCreateCategory,
    handleUpdateCategory,
    handleDeleteCategory,
  } = useMutateCategories();

  return (
    <>
      <PageHelmet title={"Danh mục"} />
      <DashboardLayout>
        <section className="Categories-section">
          {/* LOADER */}
          <OverlayLoader active={isMutation?.loading} />

          {/* TIÊU ĐỀ */}
          <DashboardHead
            head={"Danh mục sản phẩm"}
            toggleCreateModal={toggleCreateModal}
            loading={allCategories.loading}
          />

          {/* MODAL TẠO MỚI */}
          <CreateCategoryModal
            modalState={createModal}
            toggle={toggleCreateModal}
            ModalHead={"Thêm danh mục"}
            name={name}
            setName={setName}
            description={description}
            setDescription={setDescription}
            setNewImage={setNewImage}
            handleCreateCategory={handleCreateCategory}
          />

          {allCategories.loading || allCategories.categories?.length > 0 ? (
            <>
              {/* MODAL CẬP NHẬT */}
              <UpdateCategoryModal
                modalState={updateModal}
                toggle={toggleUpdateModal}
                ModalHead={"Cập nhật danh mục"}
                category={category}
                setCategory={setCategory}
                setImage={setImage}
                handleUpdateCategory={handleUpdateCategory}
              />

              {/* BẢNG DANH MỤC */}
              <PaginateTable
                allItems={allCategories}
                handlePagination={handlePagination}
              >
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Tên danh mục</th>
                    <th>Hình ảnh</th>
                    <th>Cập nhật</th>
                    <th>Xóa</th>
                  </tr>
                </thead>
                <tbody>
                  {allCategories.categories.map((item) => (
                    <tr key={item._id}>
                      <td style={{ fontSize: "11px" }}>
                        <Link to={`/categories/${item._id}`}>{item._id}</Link>
                      </td>
                      <td style={{ fontSize: "13px", fontStyle: "italic" }}>
                        {item.name.toUpperCase()}
                      </td>
                      <td>
                        <img
                          src={item.image}
                          alt="Hình danh mục"
                          width={30}
                          height={50}
                          style={{ objectFit: "contain" }}
                        />
                      </td>
                      <td>
                        <MdEdit
                          size={25}
                          onClick={() => {
                            setCategory(item);
                            toggleUpdateModal();
                          }}
                        />
                      </td>
                      <td>
                        <MdDelete
                          color="red"
                          size={25}
                          onClick={() => handleDeleteCategory(item._id)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </PaginateTable>
            </>
          ) : (
            <Alert>Chưa có danh mục nào được thêm!</Alert>
          )}
        </section>
      </DashboardLayout>
    </>
  );
};

export default Categories;
