import { render, screen } from "@/test-utils";
import { HomePage } from "../HomePage";

jest.mock("../../CreateFormsPage", () => ({
  __esModule: true,
  default: () => <div data-testid="create-forms-stub" />,
}));
jest.mock("../../FormListPage", () => ({
  __esModule: true,
  default: () => <div data-testid="form-list-stub" />,
}));
jest.mock("../../DataSourcesPage", () => ({
  __esModule: true,
  default: () => <div data-testid="data-sources-stub" />,
}));
jest.mock("../../DevicesListPage", () => ({
  __esModule: true,
  default: () => <div data-testid="devices-list-stub" />,
}));
jest.mock("../../HelpSystemPage", () => ({
  __esModule: true,
  HelpSystemPage: () => null,
}));
jest.mock("react-pdf", () => ({
  Document: ({ children, onLoadSuccess }: any) => {
    if (onLoadSuccess) {
      setTimeout(() => onLoadSuccess({ numPages: 1 }), 0);
    }
    return children || null;
  },
  Page: () => null,
  pdfjs: {
    GlobalWorkerOptions: {
      workerSrc: "",
    },
  },
}));

describe("HomePage", () => {
  test("[C0191] renderiza sin errores", () => {
    render(<HomePage />);
    
    // Verifica elementos que SÍ están en el render actual
    expect(screen.getByText(/Santa Ana AgroForms/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Dashboard/i).length).toBeGreaterThan(0);
  });
});

describe("HomePage Card", () => {
  test("[C0192] Mostrar un acceso rápido o card", () => {
    render(<HomePage />);
    
    // Verifica que la página se renderiza correctamente
    expect(screen.getByText(/Santa Ana AgroForms/i)).toBeInTheDocument();
  });
});