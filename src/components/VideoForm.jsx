import React, { useState } from "react";
import { youtubeId, validateVideo } from "../lib/youtube";
export default function VideoForm({
  video,
  videos,
  courses,
  categories,
  onSave,
  onCancel,
}) {
  const [values, setValues] = useState({
    url: video ? `https://www.youtube.com/watch?v=${video.youtubeId}` : "",
    title: video?.title || "",
    courseId: String(video?.courseId ?? courses[0]?.id ?? ""),
    category: video?.category || courses[0]?.category || "",
    description: video?.description || "",
  });
  const [error, setError] = useState("");
  const id = youtubeId(values.url);
  function change(event) {
    const { name, value } = event.target;
    setValues((current) => ({
      ...current,
      [name]: value,
      ...(name === "courseId"
        ? {
            category:
              courses.find((c) => String(c.id) === value)?.category ||
              current.category,
          }
        : {}),
    }));
    setError("");
  }
  function submit(event) {
    event.preventDefault();
    const message = validateVideo(values, videos, video?.id);
    if (message) {
      setError(message);
      return;
    }
    const course = courses.find((c) => String(c.id) === values.courseId);
    if (!course) {
      setError("Selecione um curso existente.");
      return;
    }
    onSave({
      ...video,
      id: video?.id || crypto.randomUUID(),
      youtubeId: id,
      title: values.title.trim(),
      courseId: course.id,
      category: values.category.trim(),
      description: values.description.trim(),
      favorite: video?.favorite || false,
      completed: video?.completed || false,
      createdAt: video?.createdAt || new Date().toISOString(),
    });
  }
  return (
    <form onSubmit={submit} noValidate>
      <label>
        Link do YouTube
        <input
          name="url"
          value={values.url}
          onChange={change}
          placeholder="youtube.com/watch?v=..."
          autoFocus
          aria-required="true"
        />
      </label>
      {id && (
        <img
          className="thumbnail-preview"
          src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
          alt="Miniatura do vídeo informado"
        />
      )}
      <label>
        Título do vídeo
        <input
          name="title"
          value={values.title}
          onChange={change}
          maxLength={180}
          aria-required="true"
        />
      </label>
      <label>
        Curso
        <select name="courseId" value={values.courseId} onChange={change}>
          {courses.map((c) => (
            <option key={c.id} value={String(c.id)}>
              {c.title}
              {c.demo ? " (curso de demonstração)" : ""}
            </option>
          ))}
        </select>
      </label>
      <label>
        Categoria
        <input
          name="category"
          list="video-categories"
          value={values.category}
          onChange={change}
          maxLength={80}
          aria-required="true"
        />
        <datalist id="video-categories">
          {categories.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
      </label>
      <label>
        Descrição (opcional)
        <textarea
          name="description"
          value={values.description}
          onChange={change}
          maxLength={3000}
          rows={3}
        />
      </label>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <div className="form-actions">
        <button type="button" className="button secondary" onClick={onCancel}>
          Cancelar
        </button>
        <button type="submit" className="button primary">
          Salvar vídeo
        </button>
      </div>
    </form>
  );
}
