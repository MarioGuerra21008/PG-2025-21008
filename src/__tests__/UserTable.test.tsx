import { render, screen } from '@/test-utils';

import { EditUserValues } from "@/components/DeviceTables/components/EditUserModal";
import UserTable, { UserType } from "@/components/UserTable";

describe("UserTable", () => {
  test("[C0071] Renderizar una tabla", () => {
    render(
      <UserTable
        data={[]}
        onEdit={function (record: UserType): void {
          throw new Error("Function not implemented.");
        }}
        onDelete={function (record: UserType): void {
          throw new Error("Function not implemented.");
        }}
        onCreate={function (values: EditUserValues): void {
          throw new Error("Function not implemented.");
        }}
      />
    );
    expect(screen.getByRole("table", { hidden: true })).toBeInTheDocument();
  });
});
