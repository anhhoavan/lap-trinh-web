import React, { useEffect, useState } from "react";
import {
  Button,
  Container,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
  Col,
  Spinner,
} from "reactstrap";
import PageHelmet from "../../../common/components/Shared/PageHelmet";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import pushNotification from "../../../common/components/Shared/Notification";
import PageBreadcrumbs from "../../../common/components/Shared/PageBreadcrumbs";
import { createShippingAddress } from "../../../features/address/addressSlice";
import useUserCart from "../../../common/hooks/cart/useUserCart";
import paymentMethods from "../../../assets/imgs/payment-method.png";
import {
  createCashOrder,
  createCardOrder,
} from "../../../features/orders/ordersServices";
import {
  resetMutationResult,
  resetSessionUrl,
} from "../../../features/orders/ordersSlice";

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userCart } = useUserCart();

  const [address, setAddress] = useState(
    localStorage.getItem("shippingAddress")
      ? JSON.parse(localStorage.getItem("shippingAddress"))
      : {
          detailedAddress: "",
          city: "",
          phone: "",
          postalCode: "",
        }
  );

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const [paymentMethod, setPaymentMethod] = useState(null);
  const handlePaymentMethod = (paymentVal) => {
    setPaymentMethod(paymentVal);
  };

  const { isMutation, sessionUrl } = useSelector((state) => state.orders);

  const handleSubmitOrder = (e) => {
    e.preventDefault();
    if (
      !address.detailedAddress ||
      !address.city ||
      !address.phone ||
      !address.postalCode
    ) {
      pushNotification("Vui lòng điền đầy đủ thông tin địa chỉ giao hàng", "error");
      return;
    }
    localStorage.setItem("shippingAddress", JSON.stringify(address));
    dispatch(createShippingAddress(address));

    if (userCart.cart?.cartItems.length < 1) {
      pushNotification("Giỏ hàng của bạn đang trống", "error");
      setTimeout(() => {
        navigate("/cart");
      }, 1000);
      return;
    }

    if (!paymentMethod) {
      pushNotification("Vui lòng chọn phương thức thanh toán", "error");
      return;
    }

    if (paymentMethod === "cash") {
      dispatch(
        createCashOrder({
          cartId: userCart.cart?._id,
          body: { shippingAddress: address },
        })
      );
    } else if (paymentMethod === "card") {
      dispatch(
        createCardOrder({
          cartId: userCart.cart?._id,
          shippingAddress: address,
        })
      );
    }
  };

  useEffect(() => {
    if (!isMutation.loading) {
      if (isMutation.success) {
        if (sessionUrl) {
          dispatch(resetMutationResult());
          window.location.href = sessionUrl;
          dispatch(resetSessionUrl());
        } else {
          dispatch(resetMutationResult());
          setTimeout(() => (window.location.href = "/orders"), 1000);
        }
      }
    }
  }, [isMutation, dispatch, navigate, sessionUrl]);

  return (
    <>
      <PageHelmet title={"Thanh toán"} />
      <Container className="py-4">
        <PageBreadcrumbs
          pages={[
            { page: "Trang chủ", link: "/" },
            { page: "Giỏ hàng", link: "/cart" },
            { page: "Thanh toán", isActive: true },
          ]}
        />
        <Row>
          <Col md={7}>
            <h3 className="mb-3">Địa chỉ giao hàng</h3>
            <Form>
              <FormGroup>
                <Label for="address">Địa chỉ chi tiết</Label>
                <Input
                  id="address"
                  name="detailedAddress"
                  placeholder="Nhập địa chỉ chi tiết"
                  type="text"
                  value={address.detailedAddress}
                  onChange={handleChange}
                />
              </FormGroup>
              <FormGroup>
                <Label for="city">Thành phố</Label>
                <Input
                  id="city"
                  name="city"
                  placeholder="Nhập thành phố"
                  type="text"
                  value={address.city}
                  onChange={handleChange}
                />
              </FormGroup>
              <FormGroup>
                <Label for="phone">Số điện thoại</Label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="Nhập số điện thoại"
                  type="text"
                  value={address.phone}
                  onChange={handleChange}
                />
              </FormGroup>
              <FormGroup>
                <Label for="postalCode">Mã bưu điện</Label>
                <Input
                  id="postalCode"
                  name="postalCode"
                  placeholder="Nhập mã bưu điện"
                  type="text"
                  value={address.postalCode}
                  onChange={handleChange}
                />
              </FormGroup>
            </Form>
          </Col>
          <Col md={4}>
            <h3 className="mb-3">Phương thức thanh toán</h3>
            <div className="bg-light p-3">
              <div className="d-flex flex-column gap-2">
               <h5>Giá trị đơn hàng</h5>

  {/* Tạm tính */}
  <span
    style={{
      fontFamily: "sans-serif",
      textDecoration: userCart.cart?.totalPriceAfterCouponDiscount
        ? "line-through"
        : "none",
      color: userCart.cart?.totalPriceAfterCouponDiscount
        ? "gray"
        : "black",
    }}
  >
    Tạm tính: ${userCart.cart?.totalPrice}
  </span>

  {/* Nếu có giảm giá thì hiển thị */}
  {userCart.cart?.totalPriceAfterCouponDiscount > 0 && (
    <span>
      Sau giảm giá: ${userCart.cart?.totalPriceAfterCouponDiscount}
    </span>
  )}

  {/* Phí ship */}
  <span>Phí ship: $10</span>

  {/* Tổng cộng */}
  <strong>
    Tổng cộng: $
    {userCart.cart?.totalPriceAfterCouponDiscount > 0
      ? userCart.cart?.totalPriceAfterCouponDiscount + 10
      : userCart.cart?.totalPrice + 10}
  </strong>
</div>

              <hr />
              <div className="d-flex flex-column gap-2">
                <h5>Thanh toán</h5>
                <Form
                  className="d-flex flex-column gap-2"
                  onSubmit={handleSubmitOrder}
                >
                  <div>
                    <Input
                      onChange={(e) => handlePaymentMethod(e.target.value)}
                      type="radio"
                      id={"cash"}
                      value={"cash"}
                      name="payment"
                    />{" "}
                    <Label>Thanh toán khi nhận hàng</Label>
                  </div>
                  <div>
                    <Input
                      onChange={(e) => handlePaymentMethod(e.target.value)}
                      type="radio"
                      id={"card"}
                      value={"card"}
                      name="payment"
                    />{" "}
                    <Label>Thanh toán bằng thẻ</Label>
                  </div>
                  <div>
                    <img src={paymentMethods} alt="Hình thức thanh toán" />
                  </div>
                  {isMutation.loading ? (
                    <Button size="sm" block color="primary" disabled className="mt-3">
                      <Spinner size={"sm"} />
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      block
                      color="primary"
                      type="submit"
                      className="mt-3"
                    >
                      Đặt hàng
                    </Button>
                  )}
                </Form>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Checkout;
