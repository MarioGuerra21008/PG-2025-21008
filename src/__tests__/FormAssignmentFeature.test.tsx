import { render, screen } from "@testing-library/react";

import FormAssignmentFeature, {
  FormAssignmentValues,
} from "@/features/form-assignment";

describe("FormAssignmentFeature", () => {
  test("[C0119] renderiza campos principales del formulario", () => {
    render(
      <FormAssignmentFeature
        formularios={[]}
        usuarios={[]}
        onAssign={function (values: FormAssignmentValues): void {
          throw new Error("Function not implemented.");
        }}
        onPrefill={function (): void {
          throw new Error("Function not implemented.");
        }}
      />
    );
    expect(screen.getByLabelText(/Formulario/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Usuario/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/T[íi]tulo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Notas/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Asignar/i })
    ).toBeInTheDocument();
  });
});
