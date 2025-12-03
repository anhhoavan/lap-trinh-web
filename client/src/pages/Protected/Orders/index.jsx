import React from "react";
import { Link } from "react-router-dom";
import { Alert, Badge, Table } from "reactstrap";
import BlockLoader from "../../../common/components/Loaders/BlockLoader";
import OverlayLoader from "../../../common/components/Loaders/OverlayLoader";
import PageHelmet from "../../../common/components/Shared/PageHelmet";
import useGetOrders from "../../../common/hooks/orders/useGetOrders";
import SideBarLayout from "../../../layout/SideBarLayout";

const Orders = () => {
  const { allOrders, isMutation } = useGetOrders();

  return (
    <>
      <PageHelmet title={"Đơn hàng"} />
      <OverlayLoader active={isMutation?.loading} />
      <SideBarLayout>
        <section className="wishlist-section">
          <h4 className="mb-4">Danh sách đơn hàng</h4>
          {allOrders.loading ? (
            <BlockLoader minHeight={200} />
          ) : allOrders.orders?.length > 0 ? (
            <Table responsive striped>
              <thead>
                <tr className="text-center">
                  <th>Mã đơn</th>
                  <th>Ngày tạo</th>
                  <th>Tổng tiền</th>
                  <th>Thanh toán</th>
                  <th>Đã thanh toán</th>
                  <th>Đã giao hàng</th>
                </tr>
              </thead>
              <tbody>
                {allOrders.orders?.map((item, idx) => (
                  <tr className="text-center" key={idx}>
                    <th scope="row">
                      <Link to={`/orders/${item._id}`}>{item._id}</Link>
                    </th>
                    <td>
                      {new Date(item.createdAt).toLocaleString("vi-VN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </td>
                    <td>$ {item.totalOrderPrice}</td>
                    <td>
                      {item.paymentMethod === "cash" && (
                        <Badge color="primary" className="rounded">
                          Tiền mặt
                        </Badge>
                      )}
                      {item.paymentMethod === "card" && (
                        <Badge color="info" className="rounded">
                          Thẻ
                        </Badge>
                      )}
                    </td>
                    <td>
                      {item.isPaid ? (
                        <Badge color="success" className="rounded">
                          Đã thanh toán
                        </Badge>
                      ) : (
                        <Badge color="danger" className="rounded">
                          Chưa thanh toán
                        </Badge>
                      )}
                    </td>
                    <td>
                      {item.isDelivered ? (
                        <Badge color="success" className="rounded">
                          Đã giao
                        </Badge>
                      ) : (
                        <Badge color="danger" className="rounded">
                          Chưa giao
                        </Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <Alert color="info">Bạn chưa có đơn hàng nào.</Alert>
          )}
        </section>
      </SideBarLayout>
    </>
  );
};

export default Orders;
