import { describe, it, expect } from "vitest";
import { youtubeId, validateVideo } from "./youtube";
const id = "dQw4w9WgXcQ";
describe("URLs do YouTube", () => {
  it.each([
    `https://www.youtube.com/watch?v=${id}&t=40`,
    `youtube.com/watch?v=${id}`,
    `https://youtu.be/${id}?si=abc`,
    `https://youtube.com/shorts/${id}`,
    `https://youtube.com/embed/${id}`,
    `https://m.youtube.com/watch?v=${id}`,
  ])("extrai o ID de %s", (url) => expect(youtubeId(url)).toBe(id));
  it.each([
    "",
    "nada",
    "https://evil.youtube.com/watch?v=" + id,
    "https://youtube.com.evil.test/watch?v=" + id,
    "https://youtube.com/watch?v=abc",
    "javascript:alert(1)",
    "https://vimeo.com/" + id,
    "https://youtube.com/playlist?list=abc",
    "https://user:pass@youtube.com/watch?v=" + id,
  ])("rejeita %s", (url) => expect(youtubeId(url)).toBeNull());
  it("detecta o mesmo vídeo em formatos diferentes e permite editar o próprio registro", () => {
    const values = {
      url: `youtu.be/${id}`,
      title: "Aula",
      courseId: "1",
      category: "Design",
    };
    const videos = [{ id: "video1", youtubeId: id }];
    expect(validateVideo(values, videos)).toMatch(/já está cadastrado/);
    expect(validateVideo(values, videos, "video1")).toBe("");
    expect(validateVideo({ ...values, title: "  " }, [])).toMatch(/título/);
    expect(validateVideo({ ...values, url: "" }, [])).toMatch(/Informe o link/);
  });
});
