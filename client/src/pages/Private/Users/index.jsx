import React, { useState } from "react";
import { MdDelete } from "react-icons/md";
import { Alert, Badge } from "reactstrap";
import DashboardHead from "../../../common/components/Heads/DashboardHead";
import OverlayLoader from "../../../common/components/Loaders/OverlayLoader";
import PageHelmet from "../../../common/components/Shared/PageHelmet";
import PaginateTable from "../../../common/components/Shared/PaginateTable";
import useGetUsers from "../../../common/hooks/user/useGetUsers";
import useMutateUsers from "../../../common/hooks/user/useMutateUsers";
import DashboardLayout from "../../../layout/DashboardLayout";

const Users = () => {
  const [page, setPage] = useState(1);
  const handlePagination = (pg) => {
    setPage(pg);
  };
  const { allUsers, isMutationAdmin } = useGetUsers(5, page);

  const { handleDeleteUser, handleUpdateUserRole } = useMutateUsers();

  return (
    <>
      <PageHelmet title={"Người dùng"} />
      <DashboardLayout>
        <section className="Users-section">
          <OverlayLoader active={isMutationAdmin?.loading} />

          <DashboardHead head={"Danh sách người dùng"} loading={allUsers.loading} />

          {allUsers.loading || allUsers.users.length > 0 ? (
            <>
              <PaginateTable
                allItems={allUsers}
                handlePagination={handlePagination}
              >
                <thead>
                  <tr>
                    <th>Họ tên</th>
                    <th>Email</th>
                    <th>Vai trò</th>
                    <th>Ngày đăng ký</th>
                    <th>Cập nhật vai trò</th>
                    <th>Xóa</th>
                  </tr>
                </thead>
                <tbody>
                  {allUsers.users.map((item) => (
                    <tr key={item._id}>
                      <td className="text-capitalize" style={{ fontSize: "13px" }}>
                        {item.username}
                      </td>
                      <td style={{ fontSize: "13px" }}>{item.email}</td>
                      <td>
                        {item.role === "user" ? (
                          <Badge color="info" className="rounded">
                            NGƯỜI DÙNG
                          </Badge>
                        ) : (
                          <Badge color="danger" className="rounded">
                            QUẢN TRỊ VIÊN
                          </Badge>
                        )}
                      </td>
                      <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                      <td>
                        <select
                          name="user-roles"
                          id="user-roles"
                          defaultValue={item.role}
                          onChange={(e) =>
                            handleUpdateUserRole(item._id, e.target.value)
                          }
                        >
                          <option value="user">Người dùng</option>
                          <option value="admin">Quản trị viên</option>
                        </select>
                      </td>
                      <td>
                        <MdDelete
                          color="red"
                          size={25}
                          onClick={() => handleDeleteUser(item._id)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </PaginateTable>
            </>
          ) : (
            <Alert>Chưa có người dùng nào được đăng ký</Alert>
          )}
        </section>
      </DashboardLayout>
    </>
  );
};

export default Users;
