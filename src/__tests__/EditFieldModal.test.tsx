import { render, screen } from "@testing-library/react";

import EditFieldModal from "@/features/create-forms/components/EditFieldModal";

describe("EditFieldModal", () => {
  test("[C0072] Muestra dialog con visible", () => {
    render(
      <EditFieldModal
        visible
        onCancel={() => {}}
        onSave={() => {}}
        opcionesList={[]}
        gruposList={[]}
      />
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});
