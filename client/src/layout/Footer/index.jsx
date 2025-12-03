import React from "react";
import {Col, Container, Row} from "reactstrap";
import {AiTwotoneHeart} from "react-icons/ai";
import logo from "../../assets/imgs/dark-logo.png";
import paymentLogo from "../../assets/imgs/payment-method.png";
import {NavLink} from "react-router-dom";
import {
  FaEnvelope,
  FaFacebookF,
  FaInstagram,
  FaPhoneAlt,
  FaTiktok,
  FaTwitter,
} from "react-icons/fa";
import {MdKeyboardArrowRight} from "react-icons/md";
import {AiFillHome} from "react-icons/ai";
import SocialIcon from "../../common/components/Icons/SocialIcon";

const Footer = () => {
  return (
    <footer className="bg-light pt-4">
      {/* Thông tin Footer */}
      <Container>
        <Row>
          <Col lg={6}>
            <img src={logo} alt="logo" />
            <p className="my-3">
              Chúng tôi mang đến phong cách thời trang cho thế hệ các chuyên gia
              thành thị, người sáng tạo và đổi mới, những người cần sản phẩm hiện
              đại, tiện dụng cho cuộc sống hàng ngày. Trụ sở chính tại London, và
              có văn phòng cộng tác tại Lisbon, Berlin, Barcelona, London, Warsaw,
              Stockholm, Amsterdam, Toronto, New York, Hà Nội và Tokyo.
            </p>
            <div className="d-flex align-items-center">
              {[
                {Icon: FaFacebookF, bgColor: "#3b5998"},
                {Icon: FaInstagram, bgColor: "#ac2bac"},
                {Icon: FaTiktok, bgColor: "#000"},
                {Icon: FaTwitter, bgColor: "#55acee"},
              ].map((item, idx) => (
                <SocialIcon key={idx} {...item} />
              ))}
            </div>
          </Col>

          <Col lg={6}>
            <Row>
              <Col md={6}>
                <h5 className="mt-3">Thông tin</h5>
                <ul>
                  {[
                    "Về chúng tôi",
                    "Câu hỏi thường gặp",
                    "Điều khoản & Điều kiện",
                    "Liên hệ",
                    "Hỗ trợ",
                  ].map((item) => (
                    <li key={item} className="mb-2 d-flex align-items-center">
                      <MdKeyboardArrowRight />
                      <NavLink to="/" className="nav-link">
                        {item}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </Col>
              <Col md={6}>
                <h5 className="mt-3">Liên hệ</h5>
                <ul>
                  {[
                    {Icon: AiFillHome, text: "92 Trần Phú, Hà Đông, Hà Nội, Việt Nam"},
                    {Icon: FaEnvelope, text: "anhhoavanbg@gmail.com"},
                    {Icon: FaPhoneAlt, text: "0886666203"},
                  ].map(({Icon, text}) => (
                    <li className="mb-3" key={text}>
                      <Icon size={20} className="me-2" /> {text}
                    </li>
                  ))}
                </ul>
                <div>
                  <img
                    src={paymentLogo}
                    alt="stripe-logo"
                    width={"170px"}
                    height={"24px"}
                  />
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>

      {/* Phần bản quyền */}
      <div className="text-center p-3 bg-light mt-3">
        Bản Quyền thuộc Nhóm Thực tập
      </div>
    </footer>
  );
};

export default Footer;
