import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";
describe("Biblioteca Cursos Linkplay", () => {
  it("exibe seis cursos e pesquisa por nome sem diferenciar maiúsculas", async () => {
    const user = userEvent.setup();
    render(<App />);
    expect(screen.getAllByRole("button", { name: "Abrir curso" })).toHaveLength(
      6,
    );
    await user.type(
      screen.getByRole("textbox", { name: "Pesquisar cursos e vídeos..." }),
      "REACT",
    );
    expect(screen.getAllByRole("button", { name: "Abrir curso" })).toHaveLength(
      1,
    );
    expect(
      screen.getByRole("heading", { name: "React: do básico ao avançado" }),
    ).toBeVisible();
  });
  it("filtra favoritos e permite remover um curso dos favoritos", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(
      within(screen.getByRole("navigation")).getByRole("button", {
        name: "Favoritos",
      }),
    );
    expect(screen.getAllByRole("button", { name: "Abrir curso" })).toHaveLength(
      2,
    );
    await user.click(
      screen.getByRole("button", { name: /Remover Design de interfaces/ }),
    );
    expect(screen.getAllByRole("button", { name: "Abrir curso" })).toHaveLength(
      1,
    );
  });
  it("cria um curso e cadastra um vídeo real", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: "Novo curso" }));
    await user.type(
      screen.getByLabelText("Nome do curso"),
      "Meu curso de teste",
    );
    await user.click(screen.getByRole("button", { name: "Criar curso" }));
    expect(
      screen.getByRole("heading", { name: "Meu curso de teste" }),
    ).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Adicionar vídeo" }));
    await user.type(
      screen.getByLabelText("Link do YouTube"),
      "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    );
    await user.type(screen.getByLabelText("Título do vídeo"), "Aula de teste");
    await user.selectOptions(
      screen.getByLabelText("Curso"),
      screen.getByRole("option", { name: "Meu curso de teste" }),
    );
    await user.click(
      within(screen.getByRole("dialog")).getByRole("button", {
        name: "Salvar vídeo",
      }),
    );
    const card = screen
      .getByRole("heading", { name: "Meu curso de teste" })
      .closest("article");
    expect(within(card).getByText("1 vídeo")).toBeVisible();
  });
  it("filtra categorias e simula progresso no curso aberto", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: "Categorias" }));
    await user.click(screen.getByRole("button", { name: "Programação" }));
    expect(screen.getAllByRole("button", { name: "Abrir curso" })).toHaveLength(
      2,
    );
    await user.click(screen.getAllByRole("button", { name: "Abrir curso" })[0]);
    await user.click(
      screen.getByRole("button", { name: "Simular avanço de 10%" }),
    );
    expect(screen.getByText(/28% concluído/)).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Fechar janela" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
  it("exibe um estado vazio e restaura a biblioteca", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.type(
      screen.getByRole("textbox", { name: "Pesquisar cursos e vídeos..." }),
      "inexistente",
    );
    expect(screen.getByText("Nenhum curso por aqui")).toBeVisible();
    await user.click(
      screen.getByRole("button", { name: "Ver todos os cursos" }),
    );
    expect(screen.getAllByRole("button", { name: "Abrir curso" })).toHaveLength(
      6,
    );
  });
});
