import React from "react";
import { it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";
import { STORAGE_KEY } from "./lib/library";
async function addVideo(
  user,
  title = "Minha aula",
  url = "youtu.be/dQw4w9WgXcQ",
) {
  await user.click(
    screen.getByRole("button", { name: "Adicionar vídeo", exact: true }),
  );
  await user.type(screen.getByLabelText("Link do YouTube"), url);
  await user.type(screen.getByLabelText("Título do vídeo"), title);
  await user.click(screen.getByRole("button", { name: "Salvar vídeo" }));
}
it("persiste cadastro, favoritos, conclusão, edição e exclusão confirmada", async () => {
  const user = userEvent.setup();
  let view = render(<App />);
  await addVideo(user);
  expect(screen.getByAltText("Miniatura de Minha aula")).toHaveAttribute(
    "src",
    "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
  );
  await user.click(
    screen.getByRole("button", { name: "Adicionar Minha aula aos favoritos" }),
  );
  await user.click(screen.getByRole("button", { name: "Assistir vídeo" }));
  expect(screen.getByTitle("Player do YouTube: Minha aula")).toHaveAttribute(
    "src",
    "https://www.youtube.com/embed/dQw4w9WgXcQ",
  );
  await user.click(
    screen.getByRole("button", { name: "Marcar como concluído" }),
  );
  await user.click(screen.getByRole("button", { name: "Fechar janela" }));
  view.unmount();
  view = render(<App />);
  expect(
    screen.getByRole("button", { name: "Remover Minha aula dos favoritos" }),
  ).toHaveAttribute("aria-pressed", "true");
  expect(
    screen.getByText("Concluído", { selector: ".completed-label" }),
  ).toBeVisible();
  await user.click(screen.getByRole("button", { name: "Editar Minha aula" }));
  await user.clear(screen.getByLabelText("Título do vídeo"));
  await user.type(screen.getByLabelText("Título do vídeo"), "Aula editada");
  await user.click(screen.getByRole("button", { name: "Salvar vídeo" }));
  expect(screen.getByRole("heading", { name: "Aula editada" })).toBeVisible();
  await user.click(
    screen.getByRole("button", { name: "Excluir Aula editada" }),
  );
  await user.click(screen.getByRole("button", { name: "Cancelar" }));
  expect(screen.getByRole("heading", { name: "Aula editada" })).toBeVisible();
  await user.click(
    screen.getByRole("button", { name: "Excluir Aula editada" }),
  );
  await user.click(screen.getByRole("button", { name: "Confirmar exclusão" }));
  expect(
    screen.queryByRole("heading", { name: "Aula editada" }),
  ).not.toBeInTheDocument();
  expect(JSON.parse(localStorage.getItem(STORAGE_KEY)).videos).toHaveLength(0);
});
it("mostra erros amigáveis, rejeita duplicatas e permite cancelar", async () => {
  const user = userEvent.setup();
  render(<App />);
  await user.click(
    screen.getByRole("button", { name: "Adicionar vídeo", exact: true }),
  );
  await user.click(screen.getByRole("button", { name: "Salvar vídeo" }));
  expect(screen.getByRole("alert")).toHaveTextContent("Informe o link");
  await user.type(
    screen.getByLabelText("Link do YouTube"),
    "https://example.com",
  );
  await user.click(screen.getByRole("button", { name: "Salvar vídeo" }));
  expect(screen.getByRole("alert")).toHaveTextContent("link válido");
  await user.clear(screen.getByLabelText("Link do YouTube"));
  await user.type(
    screen.getByLabelText("Link do YouTube"),
    "youtu.be/dQw4w9WgXcQ",
  );
  await user.click(screen.getByRole("button", { name: "Salvar vídeo" }));
  expect(screen.getByRole("alert")).toHaveTextContent("título");
  await user.type(screen.getByLabelText("Título do vídeo"), "Primeiro");
  await user.click(screen.getByRole("button", { name: "Salvar vídeo" }));
  await addVideo(user, "Duplicado", "youtube.com/shorts/dQw4w9WgXcQ");
  expect(screen.getByRole("alert")).toHaveTextContent("já está cadastrado");
  await user.click(screen.getByRole("button", { name: "Cancelar" }));
  expect(
    screen.getAllByRole("button", { name: "Assistir vídeo" }),
  ).toHaveLength(1);
});
it("filtra vídeos por título, curso e categoria e mostra apenas favoritos", async () => {
  const user = userEvent.setup();
  render(<App />);
  await addVideo(user);
  const search = screen.getByRole("textbox", {
    name: "Pesquisar cursos e vídeos...",
  });
  for (const query of ["Minha aula", "Design de interfaces", "Design"]) {
    await user.clear(search);
    await user.type(search, query);
    expect(screen.getByRole("heading", { name: "Minha aula" })).toBeVisible();
  }
  await user.click(
    within(screen.getByRole("navigation")).getByRole("button", {
      name: "Favoritos",
    }),
  );
  expect(
    screen.queryByRole("heading", { name: "Minha aula" }),
  ).not.toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: /Todos/ }));
  expect(screen.getByRole("heading", { name: "Minha aula" })).toBeVisible();
});
it("protege dados corrompidos e informa falha de gravação", () => {
  localStorage.setItem(STORAGE_KEY, "corrompido");
  const view = render(<App />);
  expect(screen.getByRole("alert")).toHaveTextContent("não será sobrescrito");
  expect(localStorage.getItem(STORAGE_KEY)).toBe("corrompido");
  view.unmount();
  localStorage.clear();
  const spy = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
    throw Error("quota");
  });
  render(<App />);
  expect(screen.getByRole("alert")).toHaveTextContent(
    "Não foi possível salvar",
  );
  spy.mockRestore();
});
