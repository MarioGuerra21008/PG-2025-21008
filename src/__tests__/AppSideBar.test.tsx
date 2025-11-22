import { render, screen, fireEvent, waitFor } from '../../test-utils';
import userEvent from "@testing-library/user-event";

import { AppSidebar } from "@/components/AppSideBar";

describe("AppSideBar", () => {
  test("[C0009] Al hacer click en Ayuda cambia la selección y llama onSelect('5')", async () => {
    const user = userEvent.setup();
    const onSelect = jest.fn();
    const navigate = jest.fn();

    render(
      <AppSidebar
        navigate={navigate}
        collapsed={false}
        selectedKey="1"
        onSelect={onSelect}
      />
    );

    const ayuda = screen.getByRole("menuitem", { name: /Ayuda/i });
    await user.click(ayuda);

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith("5");
    expect(navigate).not.toHaveBeenCalled();
  });

  test("[C0010] al hacer click en Cerrar sesión llama navigate('/')", async () => {
    const user = userEvent.setup();
    const onSelect = jest.fn();
    const navigate = jest.fn();

    render(
      <AppSidebar
        navigate={navigate}
        collapsed={false}
        selectedKey="1"
        onSelect={onSelect}
      />
    );

    const cerrarSesion = screen.getByRole("menuitem", {
      name: /Cerrar sesión/i,
    });
    await user.click(cerrarSesion);

    expect(navigate).toHaveBeenCalledTimes(1);
    expect(navigate).toHaveBeenCalledWith("/");
    // onSelect puede o no dispararse según la configuración
  });
});
