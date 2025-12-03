import React, { useState } from "react";
import { Alert } from "reactstrap";
import OverlayLoader from "../../../common/components/Loaders/OverlayLoader";
import PageHelmet from "../../../common/components/Shared/PageHelmet";
import DashboardLayout from "../../../layout/DashboardLayout";
import { MdDelete, MdEdit } from "react-icons/md";
import useGetCoupons from "../../../common/hooks/coupons/useGetCoupons";
import useMutateCoupons from "../../../common/hooks/coupons/useMutateCoupons";
import DashboardHead from "../../../common/components/Heads/DashboardHead";
import PaginateTable from "../../../common/components/Shared/PaginateTable";
import { CreateCouponModal, UpdateCouponModal } from "./MutateModals";

const Coupons = () => {
  const [page, setPage] = useState(1);
  const handlePagination = (pg) => {
    setPage(pg);
  };
  const { allCoupons, isMutation } = useGetCoupons(5, page);

  const [updateModal, setUpdateModal] = useState(false);
  const toggleUpdateModal = () => setUpdateModal(!updateModal);

  const [createModal, setCreateModal] = useState(false);
  const toggleCreateModal = () => setCreateModal(!createModal);

  const {
    handleChangeValues,
    handleCreateCoupon,
    handleDeleteCoupon,
    handleUpdateCoupon,
    getDateToInput,
    setCoupon,
    coupon,
  } = useMutateCoupons();

  return (
    <>
      <PageHelmet title={"Mã giảm giá"} />
      <DashboardLayout>
        <section className="Coupons-section position-relative">
          {/*____LOADING_OVERLAY____*/}
          <OverlayLoader active={isMutation?.loading} />

          {/*____HEAD____*/}
          <DashboardHead
            head={"Danh sách mã giảm giá"}
            toggleCreateModal={toggleCreateModal}
            loading={allCoupons.loading}
          />

          {/*____CREATE_MODAL____*/}
          <CreateCouponModal
            modalState={createModal}
            toggle={toggleCreateModal}
            ModalHead={"Tạo mã giảm giá"}
            handleCreateCoupon={handleCreateCoupon}
            handleChangeValues={handleChangeValues}
          />

          {allCoupons.loading || allCoupons.coupons?.length > 0 ? (
            <>
              {/* UPDATE_MODAL */}
              <UpdateCouponModal
                modalState={updateModal}
                toggle={toggleUpdateModal}
                ModalHead={"Cập nhật mã giảm giá"}
                handleUpdateCoupon={handleUpdateCoupon}
                getDateToInput={getDateToInput}
                coupon={coupon}
                setCoupon={setCoupon}
              />

              {/*____COUPONS_TABLE____*/}
              <PaginateTable
                allItems={allCoupons}
                handlePagination={handlePagination}
              >
                <thead>
                  <tr>
                    <th>Mã giảm giá</th>
                    <th>Ngày hết hạn</th>
                    <th>ID sản phẩm</th>
                    <th>Giảm giá (%)</th>
                    <th>Cập nhật</th>
                    <th>Xóa</th>
                  </tr>
                </thead>
                <tbody>
                  {allCoupons.coupons.map((item) => (
                    <tr key={item._id}>
                      <td style={{ fontSize: "12px" }}>{item.name}</td>
                      <td style={{ fontSize: "12px" }}>
                        <div>{getDateToInput(item.expire)}</div>
                      </td>
                      <td style={{ fontSize: "12px" }}>{item.product}</td>
                      <td style={{ fontSize: "14px", color: "red" }}>
                        %{item.discount}
                      </td>
                      <td>
                        <MdEdit
                          size={25}
                          onClick={() => {
                            setCoupon(item);
                            toggleUpdateModal();
                          }}
                        />
                      </td>
                      <td>
                        <MdDelete
                          color="red"
                          size={25}
                          onClick={() => handleDeleteCoupon(item._id)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </PaginateTable>
            </>
          ) : (
            <Alert>Chưa có mã giảm giá nào được thêm!</Alert>
          )}
        </section>
      </DashboardLayout>
    </>
  );
};

export default Coupons;
