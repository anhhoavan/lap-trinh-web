import React, { useState } from "react";
import { MdDelete, MdEdit } from "react-icons/md";
import { Link } from "react-router-dom";
import { Alert, Badge } from "reactstrap";
import OverlayLoader from "../../../common/components/Loaders/OverlayLoader";
import PageHelmet from "../../../common/components/Shared/PageHelmet";
import useGetProducts from "../../../common/hooks/products/useGetProducts";
import DashboardLayout from "../../../layout/DashboardLayout";
import PaginateTable from "../../../common/components/Shared/PaginateTable";
import { CreateProductModal, UpdateProductModal } from "./MutateModals";
import DashboardHead from "../../../common/components/Heads/DashboardHead";
import useMutateProducts from "../../../common/hooks/products/useMutateProducts";
import useGetCategories from "../../../common/hooks/categories/useGetCategories";

const Products = () => {
  const { allProducts, isMutation, handlePagination } = useGetProducts(5);
  const { allCategories } = useGetCategories();

  const [updateModal, setUpdateModal] = useState(false);
  const toggleUpdateModal = () => setUpdateModal(!updateModal);

  const [createModal, setCreateModal] = useState(false);
  const toggleCreateModal = () => setCreateModal(!createModal);

  const { handleDeleteProduct } = useMutateProducts();
  const [product, setProduct] = useState(null);

  return (
    <>
      <PageHelmet title={"Sản phẩm"} />
      <DashboardLayout>
        <section className="Products-section">
          <OverlayLoader active={isMutation?.loading} />

          <DashboardHead
            head={"Danh sách sản phẩm"}
            toggleCreateModal={toggleCreateModal}
            loading={allProducts.loading}
          />

          <CreateProductModal
            modalState={createModal}
            toggle={toggleCreateModal}
            ModalHead={"Thêm sản phẩm mới"}
            allCategories={allCategories}
          />

          {allProducts.loading || allProducts.products?.length > 0 ? (
            <>
              <UpdateProductModal
                modalState={updateModal}
                toggle={toggleUpdateModal}
                ModalHead={"Cập nhật sản phẩm"}
                allCategories={allCategories}
                product={product}
                setProduct={setProduct}
              />

              <PaginateTable
                allItems={allProducts}
                handlePagination={handlePagination}
              >
                <thead>
                  <tr>
                    <th>Mã</th>
                    <th>Ảnh</th>
                    <th>Tên sản phẩm</th>
                    <th>Giá</th>
                    <th>Giảm giá</th>
                    <th>Danh mục</th>
                    <th>Số lượng</th>
                    <th>Đã bán</th>
                    <th>Đánh giá</th>
                    <th>Chỉnh sửa</th>
                    <th>Xoá</th>
                  </tr>
                </thead>
                <tbody>
                  {allProducts.products.map((item) => (
                    <tr key={item._id}>
                      <td style={{ fontSize: "11px" }}>
                        <Link to={`/products/${item._id}`}>{item._id}</Link>
                      </td>
                      <td>
                        <img
                          src={item.image}
                          alt="product-img"
                          width={50}
                          height={50}
                          style={{ objectFit: "contain" }}
                        />
                      </td>
                      <td style={{ fontSize: "13px", fontStyle: "italic" }}>
                        {item.name.toUpperCase()}
                      </td>
                      <td style={{ fontSize: "13px", color: "red" }}>
                        ${item.price}
                      </td>
                      <td style={{ fontSize: "13px", color: "gray" }}>
                        {item.discount === 0 ? "_" : `$${item.discount}`}
                      </td>
                      <td style={{ fontSize: "13px" }}>
                        <Badge color="info">{item?.category?.name}</Badge>
                      </td>
                      <td style={{ fontSize: "13px" }}>{item.quantityInStock}</td>
                      <td style={{ fontSize: "13px" }}>{item.sold}</td>
                      <td style={{ fontSize: "13px" }}>{item.ratingAverage}</td>
                      <td>
                        <MdEdit
                          size={25}
                          title="Chỉnh sửa"
                          onClick={() => {
                            setProduct(item);
                            setTimeout(() => {
                              toggleUpdateModal();
                            }, 100);
                          }}
                        />
                      </td>
                      <td>
                        <MdDelete
                          color="red"
                          size={25}
                          title="Xoá"
                          onClick={() => handleDeleteProduct(item._id)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </PaginateTable>
            </>
          ) : (
            <Alert>Chưa có sản phẩm nào được thêm!</Alert>
          )}
        </section>
      </DashboardLayout>
    </>
  );
};

export default Products;
