import { MemoryRouter } from "react-router-dom";

import { render, screen } from "@testing-library/react";

import PhoneMockup from "@/features/create-forms/components/PhoneMockup";

import type { PageValues } from "../PageEditModal";

describe("PhoneMockup", () => {
  test("[C0076] renderiza encabezado con título de la página", () => {
    const mockPages: PageValues[] = [
      { id: "p1" as any, title: "Página 1", description: "", sequence: 1 },
    ];

    render(
      <MemoryRouter>
        <PhoneMockup
          formId="test"
          formulario={{ nombre: "Demo" }}
          isLoading={false}
          isError={false}
          pages={mockPages}
          selectedPage={mockPages[0]}
          selectedElements={[]}
          onBack={jest.fn()}
          onPageChange={jest.fn()}
        />
      </MemoryRouter>
    );

    expect(screen.getByText(/Demo/i)).toBeInTheDocument();
    expect(screen.getByText(/Página 1/i)).toBeInTheDocument();
  });
});
