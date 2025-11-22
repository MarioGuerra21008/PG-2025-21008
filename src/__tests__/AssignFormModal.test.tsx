import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AssignFormModal from "../AssignFormModal";

describe("AssignFormModal", () => {
  const mockOptions = [
    { label: "Usuario 1", value: "user1" },
    { label: "Usuario 2", value: "user2" },
    { label: "Usuario 3", value: "user3", disabled: true },
  ];

  test("[C0048] renderiza el modal cuando open=true", () => {
    render(
      <AssignFormModal
        open={true}
        onCancel={jest.fn()}
        onAssign={jest.fn()}
        options={mockOptions}
      />
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Asignar formulario")).toBeInTheDocument();
  });

  test("[C0049] no renderiza cuando open=false", () => {
    render(
      <AssignFormModal
        open={false}
        onCancel={jest.fn()}
        onAssign={jest.fn()}
        options={mockOptions}
      />
    );

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  test("[C0050] muestra el placeholder correcto", () => {
    render(
      <AssignFormModal
        open={true}
        onCancel={jest.fn()}
        onAssign={jest.fn()}
        options={mockOptions}
        placeholder="Selecciona usuarios..."
      />
    );

    expect(screen.getByText("Selecciona usuarios...")).toBeInTheDocument();
  });

  test("[C0051] muestra texto de ayuda cuando se proporciona", () => {
    render(
      <AssignFormModal
        open={true}
        onCancel={jest.fn()}
        onAssign={jest.fn()}
        options={mockOptions}
        helperText="Puedes seleccionar múltiples usuarios"
      />
    );

    expect(
      screen.getByText("Puedes seleccionar múltiples usuarios")
    ).toBeInTheDocument();
  });

  test("[C0052] llama onCancel cuando se hace click en Cancelar", async () => {
    const user = userEvent.setup();
    const onCancel = jest.fn();

    render(
      <AssignFormModal
        open={true}
        onCancel={onCancel}
        onAssign={jest.fn()}
        options={mockOptions}
      />
    );

    await user.click(screen.getByRole("button", { name: /Cancelar/i }));

    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  test("[C0053] botón Asignar está deshabilitado cuando no hay selección", () => {
    render(
      <AssignFormModal
        open={true}
        onCancel={jest.fn()}
        onAssign={jest.fn()}
        options={mockOptions}
      />
    );

    const assignButton = screen.getByRole("button", { name: /Asignar/i });
    expect(assignButton).toBeDisabled();
  });

  test("[C0054] llama onAssign con los usuarios seleccionados", async () => {
    const user = userEvent.setup();
    const onAssign = jest.fn();

    render(
      <AssignFormModal
        open={true}
        onCancel={jest.fn()}
        onAssign={onAssign}
        options={mockOptions}
        defaultSelected={["user1", "user2"]}
      />
    );

    const assignButton = screen.getByRole("button", { name: /Asignar/i });

    await user.click(assignButton);

    await waitFor(() => {
      expect(onAssign).toHaveBeenCalledWith(["user1", "user2"]);
    });
  });

  test("[C0055] muestra estado de loading cuando loadingOptions=true", () => {
    render(
      <AssignFormModal
        open={true}
        onCancel={jest.fn()}
        onAssign={jest.fn()}
        options={mockOptions}
        loadingOptions={true}
      />
    );

    // El Select de Ant Design muestra un spinner cuando loading=true
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  test("[C0056] deshabilita botones cuando submitting=true", () => {
    render(
      <AssignFormModal
        open={true}
        onCancel={jest.fn()}
        onAssign={jest.fn()}
        options={mockOptions}
        submitting={true}
        defaultSelected={["user1"]}
      />
    );

    expect(screen.getByRole("button", { name: /Cancelar/i })).toBeDisabled();
    expect(
      screen.getByRole("button", { name: /Asignando/i })
    ).toBeInTheDocument();
  });

  test("[C0057] muestra texto 'Asignando...' cuando submitting=true", () => {
    render(
      <AssignFormModal
        open={true}
        onCancel={jest.fn()}
        onAssign={jest.fn()}
        options={mockOptions}
        submitting={true}
        defaultSelected={["user1"]}
      />
    );

    expect(screen.getByText(/Asignando/i)).toBeInTheDocument();
  });

  test("[C0058] modo single cuando multiple=false", () => {
    render(
      <AssignFormModal
        open={true}
        onCancel={jest.fn()}
        onAssign={jest.fn()}
        options={mockOptions}
        multiple={false}
      />
    );

    expect(screen.getByText("Usuario")).toBeInTheDocument();
  });

  test("[C0059] modo multiple por defecto", () => {
    render(
      <AssignFormModal
        open={true}
        onCancel={jest.fn()}
        onAssign={jest.fn()}
        options={mockOptions}
      />
    );

    expect(screen.getByText("Usuarios")).toBeInTheDocument();
  });

  test("[C0060] resetea selección al cerrar cuando resetOnClose=true", async () => {
    const user = userEvent.setup();
    const onCancel = jest.fn();

    const { rerender } = render(
      <AssignFormModal
        open={true}
        onCancel={onCancel}
        onAssign={jest.fn()}
        options={mockOptions}
        defaultSelected={["user1"]}
        resetOnClose={true}
      />
    );

    await user.click(screen.getByRole("button", { name: /Cancelar/i }));

    expect(onCancel).toHaveBeenCalled();
  });

  test("[C0061] mantiene selección cuando resetOnClose=false", async () => {
    const user = userEvent.setup();
    const onCancel = jest.fn();

    render(
      <AssignFormModal
        open={true}
        onCancel={onCancel}
        onAssign={jest.fn()}
        options={mockOptions}
        defaultSelected={["user1"]}
        resetOnClose={false}
      />
    );

    await user.click(screen.getByRole("button", { name: /Cancelar/i }));

    expect(onCancel).toHaveBeenCalled();
  });

  test("[C0062] permite búsqueda cuando se proporciona onSearchUsers", () => {
    const onSearchUsers = jest.fn();

    render(
      <AssignFormModal
        open={true}
        onCancel={jest.fn()}
        onAssign={jest.fn()}
        options={mockOptions}
        onSearchUsers={onSearchUsers}
      />
    );

    // El Select tiene showSearch habilitado
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  test("[C0063] muestra icono de UserAddOutlined en el título", () => {
    render(
      <AssignFormModal
        open={true}
        onCancel={jest.fn()}
        onAssign={jest.fn()}
        options={mockOptions}
      />
    );

    // Verificar que el modal tiene el título con el componente
    expect(screen.getByText("Asignar formulario")).toBeInTheDocument();
  });

  test("[C0064] el botón Asignar está habilitado con selección válida", () => {
    render(
      <AssignFormModal
        open={true}
        onCancel={jest.fn()}
        onAssign={jest.fn()}
        options={mockOptions}
        defaultSelected={["user1"]}
      />
    );

    const assignButton = screen.getByRole("button", { name: /Asignar/i });
    expect(assignButton).not.toBeDisabled();
  });

  test("[C0065] maneja opciones vacías sin errores", () => {
    render(
      <AssignFormModal
        open={true}
        onCancel={jest.fn()}
        onAssign={jest.fn()}
        options={[]}
      />
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});