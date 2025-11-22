import { render, screen } from "@testing-library/react";

import CreateFormsPage from "@/pages/CreateFormsPage";

// Mock para feature de crear formularios
jest.mock("@/features/create-forms", () => ({
  __esModule: true,
  default: () => <div data-testid="create-forms-stub" />,
}));

describe("CreateFormsPage", () => {
  test("[C0181] se monta la página y renderiza el feature", () => {
    render(
      <CreateFormsPage
        formId={""}
        onBack={function (): void {
          throw new Error("Function not implemented.");
        }}
      />
    );
    expect(screen.getByTestId("create-forms-stub")).toBeInTheDocument();
  });
});
