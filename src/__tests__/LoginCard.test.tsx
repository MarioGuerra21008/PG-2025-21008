import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { LoginCard } from "@/components/LoginCard";

describe("LoginCard", () => {
  test("[C0013] Muestra mensajes de validación en caso de enviarse vacío.", async () => {
    const user = userEvent.setup();
    render(<LoginCard onFinish={jest.fn()} />);
    await user.click(screen.getByRole("button", { name: /Entrar/i }));

    expect(
      await screen.findByText(/Por favor ingresa tu usuario/i)
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/Por favor ingresa tu contraseña/i)
    ).toBeInTheDocument();
  });

  test("[C0014] envía credenciales cuando se llena el formulario (sin fake timers)", async () => {
    const realSetTimeout = global.setTimeout;
    const setTimeoutSpy = jest.spyOn(global, "setTimeout").mockImplementation(((
      cb: any,
      ms?: number,
      ...args: any[]
    ) => {
      if (typeof ms === "number" && ms >= 1200) {
        if (typeof cb === "function") cb(...args);
        else {
          eval(cb as string);
        }
        return 0 as any;
      }
      return (realSetTimeout as any)(cb, ms, ...args);
    }) as any);

    const user = userEvent.setup();
    const onFinish = jest.fn();
    render(<LoginCard onFinish={onFinish} />);

    await user.type(screen.getByPlaceholderText(/Usuario/i), "mario");
    await user.type(screen.getByPlaceholderText(/Contraseña/i), "secreta");
    await user.click(screen.getByRole("button", { name: /Entrar/i }));

    await waitFor(() =>
      expect(onFinish).toHaveBeenCalledWith({
        username: "mario",
        password: "secreta",
      })
    );

    setTimeoutSpy.mockRestore();
  });

  test("[C0015] Enlace de recuperación presente", () => {
    render(<LoginCard onFinish={jest.fn()} />);
    expect(
      screen.getByRole("link", { name: /¿Olvidaste tu contraseña\?/i })
    ).toBeInTheDocument();
  });
});
