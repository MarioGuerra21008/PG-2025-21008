import { render, screen } from "@testing-library/react";

import EditUserModal, {
  EditUserValues,
} from "@/components/DeviceTables/components/EditUserModal";

describe("EditUserModal", () => {
  test("[C0069] Muestra initialValues cuando visible=true", () => {
    const initial: EditUserValues = {
      nombre_usuario: "USR-123",
      nombre: "Mario",
      email: "mariog@yahoo.com",
      activo: true,
      rol: "admin",
    } as any;

    render(
      <EditUserModal
        visible
        initialValues={initial}
        onCancel={() => {}}
        onSave={() => {}}
      />
    );

    // Verificar que los campos se rellenan
    expect(screen.getByDisplayValue("USR-123")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Mario")).toBeInTheDocument();
    expect(screen.getByDisplayValue("mariog@yahoo.com")).toBeInTheDocument();
  });
});
