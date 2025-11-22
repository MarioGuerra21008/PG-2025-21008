import { render, screen } from "@testing-library/react";

import BaseModal from "@/components/BaseModal";

describe("BaseModal", () => {
  test("[C0011] Muestra título y contenido cuando está visible", () => {
    render(
      <BaseModal title="Nuevo" open onCancel={() => {}}>
        <div>Contenido del modal</div>
      </BaseModal>
    );
    expect(screen.getByText("Nuevo")).toBeInTheDocument();
    expect(screen.getByText("Contenido del modal")).toBeInTheDocument();
  });

  test("[C0012] Cuando no muestra contenido", () => {
    render(
      <BaseModal title="X" open={false} onCancel={() => {}}>
        <div>Contenido</div>
      </BaseModal>
    );
    expect(screen.queryByText("Contenido")).not.toBeInTheDocument();
  });
});
