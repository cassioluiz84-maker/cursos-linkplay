import { useState, useEffect } from "react";
import { initialCourses, categories } from "../data/courses";
export const STORAGE_KEY = "cursos-linkplay.library.v1";
export const emptyLibrary = () => ({
  version: 1,
  courses: [],
  videos: [],
  demoOverrides: {},
  categories: [...categories],
});
export function readLibrary(storage) {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return { data: emptyLibrary(), error: "" };
    const data = JSON.parse(raw);
    if (
      data.version !== 1 ||
      !Array.isArray(data.courses) ||
      !Array.isArray(data.videos) ||
      !Array.isArray(data.categories) ||
      !data.demoOverrides ||
      data.courses.some(
        (c) =>
          typeof c.id !== "string" ||
          typeof c.title !== "string" ||
          typeof c.category !== "string",
      ) ||
      data.videos.some(
        (v) =>
          typeof v.id !== "string" ||
          !/^[\w-]{11}$/.test(v.youtubeId) ||
          typeof v.title !== "string" ||
          typeof v.category !== "string" ||
          typeof v.description !== "string" ||
          ![...initialCourses, ...data.courses].some(
            (c) => c.id === v.courseId,
          ),
      ) ||
      data.categories.some((c) => typeof c !== "string")
    )
      throw Error("invalid");
    return { data, error: "" };
  } catch {
    return {
      data: emptyLibrary(),
      error:
        "Não foi possível ler os dados locais. Para proteger seus dados, o armazenamento não será sobrescrito. Verifique o armazenamento deste navegador.",
    };
  }
}
export function useLibrary() {
  const [loaded] = useState(() => {
    try {
      return readLibrary(window.localStorage);
    } catch {
      return {
        data: emptyLibrary(),
        error:
          "O armazenamento local está indisponível. As alterações não serão mantidas ao fechar a página.",
      };
    }
  });
  const [library, setLibrary] = useState(loaded.data);
  const [storageError, setStorageError] = useState(loaded.error);
  useEffect(() => {
    if (loaded.error) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(library));
      setStorageError("");
    } catch {
      setStorageError(
        "Não foi possível salvar no navegador. O armazenamento pode estar cheio ou bloqueado; as alterações atuais estão apenas na memória.",
      );
    }
  }, [library, loaded.error]);
  const courses = [
    ...initialCourses.map((c) => ({
      ...c,
      ...library.demoOverrides[c.id],
      demo: true,
    })),
    ...library.courses,
  ];
  function setCourses(update) {
    setLibrary((current) => {
      const all = [
        ...initialCourses.map((c) => ({
          ...c,
          ...current.demoOverrides[c.id],
          demo: true,
        })),
        ...current.courses,
      ];
      const next = typeof update === "function" ? update(all) : update;
      return {
        ...current,
        courses: next.filter((c) => !c.demo),
        demoOverrides: Object.fromEntries(
          next
            .filter((c) => c.demo)
            .map((c) => [c.id, { favorite: c.favorite, progress: c.progress }]),
        ),
        categories: [
          ...new Set([...current.categories, ...next.map((c) => c.category)]),
        ],
      };
    });
  }
  return { library, setLibrary, courses, setCourses, storageError };
}
export function courseSummary(course, videos) {
  const items = videos.filter((v) => v.courseId === course.id);
  return items.length
    ? {
        ...course,
        videos: items.length,
        progress: Math.round(
          (items.filter((v) => v.completed).length / items.length) * 100,
        ),
      }
    : course;
}
export function matchingVideos(videos, courses, search, favorites, category) {
  const query = search.trim().toLocaleLowerCase("pt-BR");
  return videos.filter(
    (v) =>
      (!favorites || v.favorite) &&
      (!category || v.category === category) &&
      `${v.title} ${v.category} ${courses.find((c) => c.id === v.courseId)?.title || ""}`
        .toLocaleLowerCase("pt-BR")
        .includes(query),
  );
}
