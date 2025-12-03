import React, { useState } from "react";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import { Alert, Badge, Spinner, Table, UncontrolledTooltip } from "reactstrap";
import DashboardHead from "../../../common/components/Heads/DashboardHead";
import OverlayLoader from "../../../common/components/Loaders/OverlayLoader";
import PageHelmet from "../../../common/components/Shared/PageHelmet";
import PaginateTable from "../../../common/components/Shared/PaginateTable";
import Pagination from "../../../common/components/Shared/Pagination";
import useGetOrders from "../../../common/hooks/orders/useGetOrders";
import useMutateOrders from "../../../common/hooks/orders/useMutateOrders";
import DashboardLayout from "../../../layout/DashboardLayout";

const Orders = () => {
  const [page, setPage] = useState(1);
  const handlePagination = (pg) => {
    setPage(pg);
  };
  const { allOrders, isMutation } = useGetOrders(5, page);

  const {
    handleDeleteOrder,
    handleUpdateOrderToDelivered,
    handleUpdateOrderToPaid,
  } = useMutateOrders();

  return (
    <>
      <PageHelmet title={"Đơn hàng"} />
      <DashboardLayout>
        <section className="Orders-section">
          <OverlayLoader active={isMutation?.loading} />

          <DashboardHead head={"Danh sách đơn hàng"} loading={allOrders.loading} />

          {allOrders.loading || allOrders.orders?.length > 0 ? (
            <>
              <PaginateTable
                allItems={allOrders}
                handlePagination={handlePagination}
              >
                <thead>
                  <tr>
                    <th>Mã đơn</th>
                    <th>Người đặt</th>
                    <th>Ngày tạo</th>
                    <th>Phương thức thanh toán</th>
                    <th>Trạng thái thanh toán</th>
                    <th>Trạng thái giao hàng</th>
                    <th>Xóa</th>
                  </tr>
                </thead>
                <tbody>
                  {allOrders.orders.map((item) => (
                    <tr key={item._id}>
                      <td style={{ fontSize: "11px" }}>
                        <Link to={`/orders/${item._id}`}>{item._id}</Link>
                      </td>
                      <td style={{ fontSize: "11px" }}>{item.user}</td>
                      <td style={{ fontSize: "13px" }}>
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        {item.paymentMethod === "cash" ? (
                          <Badge color="primary" className="rounded">
                            Tiền mặt
                          </Badge>
                        ) : (
                          <Badge color="info" className="rounded">
                            {item.paymentMethod}
                          </Badge>
                        )}
                      </td>
                      <td>
                        {item.isPaid ? (
                          <Badge color="success" className="rounded">
                            Đã thanh toán
                          </Badge>
                        ) : (
                          <>
                            <UncontrolledTooltip
                              placement="top"
                              target={`tooltipPaid-${item._id}`}
                            >
                              Cập nhật trạng thái thanh toán
                            </UncontrolledTooltip>
                            <Badge
                              id={`tooltipPaid-${item._id}`}
                              style={{ cursor: "pointer" }}
                              color="danger"
                              className="rounded"
                              onClick={() => handleUpdateOrderToPaid(item._id)}
                            >
                              Chưa thanh toán
                            </Badge>
                          </>
                        )}
                      </td>
                      <td>
                        {item.isDelivered ? (
                          <Badge color="success" className="rounded">
                            Đã giao hàng
                          </Badge>
                        ) : (
                          <>
                            <UncontrolledTooltip
                              placement="top"
                              target={`tooltipDelivered-${item._id}`}
                            >
                              Cập nhật trạng thái giao hàng
                            </UncontrolledTooltip>
                            <Badge
                              id={`tooltipDelivered-${item._id}`}
                              style={{ cursor: "pointer" }}
                              color="danger"
                              className="rounded"
                              onClick={() => handleUpdateOrderToDelivered(item._id)}
                            >
                              Đang xử lý
                            </Badge>
                          </>
                        )}
                      </td>
                      <td>
                        <MdDelete
                          color="red"
                          size={25}
                          onClick={() => handleDeleteOrder(item._id)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </PaginateTable>
            </>
          ) : (
            <Alert>Chưa có đơn hàng nào!</Alert>
          )}
        </section>
      </DashboardLayout>
    </>
  );
};

export default Orders;
