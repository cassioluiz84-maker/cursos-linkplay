import { describe, it, expect } from "vitest";
import {
  readLibrary,
  emptyLibrary,
  STORAGE_KEY,
  courseSummary,
  matchingVideos,
} from "./library";
describe("Persistência e consultas", () => {
  it("inicia sem dados reais e mantém os exemplos separados", () => {
    expect(readLibrary(localStorage).data).toEqual(emptyLibrary());
    expect(emptyLibrary().courses).toEqual([]);
    expect(emptyLibrary().videos).toEqual([]);
  });
  it("recupera registros e não substitui armazenamento inválido", () => {
    const data = emptyLibrary();
    data.courses.push({ id: "c1", title: "Curso real", category: "Música" });
    data.categories.push("Música");
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    expect(readLibrary(localStorage).data.courses[0].title).toBe("Curso real");
    localStorage.setItem(STORAGE_KEY, "inválido");
    expect(readLibrary(localStorage).error).toMatch(/não será sobrescrito/);
    expect(localStorage.getItem(STORAGE_KEY)).toBe("inválido");
  });
  it("calcula progresso a partir da conclusão e filtra por título, curso e categoria", () => {
    const courses = [{ id: "c1", title: "React", category: "Programação" }];
    const videos = [
      {
        id: "v1",
        courseId: "c1",
        title: "Componentes",
        category: "Web",
        favorite: true,
        completed: true,
      },
      {
        id: "v2",
        courseId: "c1",
        title: "Estado",
        category: "Web",
        favorite: false,
        completed: false,
      },
    ];
    expect(courseSummary(courses[0], videos)).toMatchObject({
      videos: 2,
      progress: 50,
    });
    for (const query of ["react", "WEB", "Componentes"])
      expect(matchingVideos(videos, courses, query, true, "")).toHaveLength(1);
    expect(matchingVideos(videos, courses, "", false, "Outros")).toHaveLength(
      0,
    );
  });
});
