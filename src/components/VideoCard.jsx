import React from "react";
import { Heart, Play, Pencil, Trash2, Check } from "lucide-react";
export default function VideoCard({
  video,
  course,
  onWatch,
  onFavorite,
  onEdit,
  onDelete,
}) {
  return (
    <article className="course-card video-card">
      <div className="cover-wrap">
        <img
          className="video-thumbnail"
          src={`https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`}
          alt={`Miniatura de ${video.title}`}
          loading="lazy"
        />
        <button
          className={`favorite-button ${video.favorite ? "selected" : ""}`}
          aria-label={`${video.favorite ? "Remover" : "Adicionar"} ${video.title} ${video.favorite ? "dos" : "aos"} favoritos`}
          aria-pressed={video.favorite}
          onClick={() => onFavorite(video.id)}
        >
          <Heart size={18} fill={video.favorite ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="card-body">
        <span className="category-tag">{video.category}</span>
        <h3>{video.title}</h3>
        <p className="video-course">{course?.title}</p>
        {video.completed && (
          <span className="completed-label">
            <Check size={14} /> Concluído
          </span>
        )}
        <button className="open-course" onClick={() => onWatch(video)}>
          <Play size={17} /> Assistir vídeo
        </button>
        <div className="video-actions">
          <button
            onClick={() => onEdit(video)}
            aria-label={`Editar ${video.title}`}
          >
            <Pencil size={15} /> Editar
          </button>
          <button
            onClick={() => onDelete(video)}
            aria-label={`Excluir ${video.title}`}
          >
            <Trash2 size={15} /> Excluir
          </button>
        </div>
      </div>
    </article>
  );
}
