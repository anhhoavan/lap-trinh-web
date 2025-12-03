import React from "react";
import {Input} from "reactstrap";

const ShopSortBar = ({results = 0, handleSort}) => {
  return (
    <section className="sort-bar-section my-3 d-flex align-items-center justify-content-between">
      <span>Kết quả: {results}</span>

      <div>
        <Input
          id="sort by select"
          name="select"
          type="select"
          bsSize="sm"
          onChange={(e) => {
            handleSort(e.target.value);
          }}
        >
          <option value="">Sắp xếp mặc định</option>
          <option value="-price">Giá từ cao đến thấp</option>
          <option value="+price">Giá từ thấp đến cao</option>
          <option value="+ratingAverage">Đánh giá từ thấp đến cao</option>
          <option value="-ratingAverage">Đánh giá từ cao đến thấp</option>
          <option value="name">Theo thứ tự chữ cái</option>
        </Input>
      </div>
    </section>
  );
};

export default ShopSortBar;
