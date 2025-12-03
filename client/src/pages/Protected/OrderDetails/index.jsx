import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Alert, Badge, Col, Container, Row } from "reactstrap";
import BlockLoader from "../../../common/components/Loaders/BlockLoader";
import PageHelmet from "../../../common/components/Shared/PageHelmet";
import { getOrderDetails } from "../../../features/orders/ordersServices";
import { resetMutationResult } from "../../../features/orders/ordersSlice";

const OrderDetails = () => {
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const { isMutation, orderDetails } = useSelector((state) => state.orders);

  useEffect(() => {
    if (isMutation.success) {
      dispatch(getOrderDetails(orderId));
      dispatch(resetMutationResult());
    } else {
      dispatch(getOrderDetails(orderId));
    }
  }, [orderId, dispatch, isMutation.success]);

  return (
    <>
      <PageHelmet title={"Chi tiết đơn hàng"} />
      <Container className="py-3">
        {orderDetails.loading ? (
          <BlockLoader minHeight={300} />
        ) : (
          <Row>
            <Col lg={8}>
              <h3>Sản phẩm trong đơn</h3>
              <div className="d-flex flex-column gap-3 mb-4">
                {orderDetails?.order?.cartItems.map(
                  ({ product, price, quantity, color, size }, idx) => (
                    <div className="d-flex align-items-center gap-2" key={idx}>
                      <img
                        src={product?.image}
                        alt="product-img"
                        style={{
                          objectFit: "contain",
                          maxWidth: "100%",
                          maxHeight: "70px",
                        }}
                      />
                      <span className="text-capitalize">{product?.name}</span>
                      {color && (
                        <div
                          style={{
                            width: "30px",
                            height: "30px",
                            background: `${color}`,
                            borderRadius: "100%",
                          }}
                        />
                      )}
                      {size && (
                        <div
                          style={{
                            fontSize: "12px",
                            padding: "10px",
                            border: "1px solid black",
                            background: "black",
                            color: "white",
                          }}
                        >
                          {size}
                        </div>
                      )}
                      <span>
                        ({quantity}) x ${price}
                      </span>
                    </div>
                  )
                )}
              </div>

              <h3>Địa chỉ giao hàng</h3>
              <div className="d-flex flex-column gap-2 mb-4">
                <div>
                  <span className="fw-bold">Địa chỉ: </span>{" "}
                  {orderDetails?.order?.shippingAddress.detailedAddress},{" "}
                  {orderDetails?.order?.shippingAddress.city},{" "}
                  {orderDetails?.order?.shippingAddress.postalCode}
                </div>
                <div>
                  <span className="fw-bold">Số điện thoại: </span>
                  {orderDetails?.order?.shippingAddress.phone}
                </div>
              </div>
            </Col>

            <Col lg={4}>
              <div className="bg-light p-3">
                <h3>Thông tin đơn hàng</h3>
                <div className="d-flex flex-column gap-3">
                  <div>
                    <span className="fw-bold">Tổng tiền:</span>&nbsp;${
                      orderDetails?.order?.totalOrderPrice
                    }
                  </div>
                  <span style={{ fontSize: "12px" }} className="text-muted">
                    Giá đã bao gồm thuế và phí vận chuyển
                  </span>

                  <div className="d-flex">
                    <span className="fw-bold">Phương thức thanh toán: &nbsp;</span>
                    {orderDetails?.order?.paymentMethod === "cash" ? (
                      <Badge color="primary" className="rounded">
                        Tiền mặt
                      </Badge>
                    ) : (
                      <Badge color="info" className="rounded">
                        Thẻ
                      </Badge>
                    )}
                  </div>

                  {orderDetails?.order?.isPaid ? (
                    <Alert className="mb-0 p-1 text-center" color="success">
                      ĐÃ THANH TOÁN
                    </Alert>
                  ) : (
                    <Alert className="mb-0 p-1 text-center" color="danger">
                      CHƯA THANH TOÁN
                    </Alert>
                  )}

                  {orderDetails?.order?.isDelivered ? (
                    <Alert className="mb-0 p-1 text-center" color="success">
                      ĐÃ GIAO HÀNG
                    </Alert>
                  ) : (
                    <Alert className="mb-0 p-1 text-center" color="danger">
                      ĐANG VẬN CHUYỂN
                    </Alert>
                  )}
                </div>
              </div>
            </Col>
          </Row>
        )}
      </Container>
    </>
  );
};

export default OrderDetails;
