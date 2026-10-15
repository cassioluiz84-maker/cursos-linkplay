import React from "react";
import { useState } from "react";
import {
  BookOpen,
  LayoutDashboard,
  Heart,
  Shapes,
  Search,
  Plus,
  Play,
  ArrowUpRight,
  Menu,
  X,
  Check,
  Layers,
  Sparkles,
} from "lucide-react";
import CourseCard from "./components/CourseCard";
import Modal from "./components/Modal";
import { filterCourses } from "./data/courses";
import { useLibrary, courseSummary, matchingVideos } from "./lib/library";
import VideoForm from "./components/VideoForm";
import VideoCard from "./components/VideoCard";
const navigation = [
  { name: "Início", icon: LayoutDashboard },
  { name: "Meus Cursos", icon: BookOpen },
  { name: "Favoritos", icon: Heart },
  { name: "Categorias", icon: Shapes },
];
export default function App() {
  const {
    library,
    setLibrary,
    courses: storedCourses,
    setCourses,
    storageError,
  } = useLibrary();
  const videos = library.videos;
  const courses = storedCourses.map((c) => courseSummary(c, videos));
  const categories = library.categories;

  const [page, setPage] = useState("Início");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Todos");
  const [category, setCategory] = useState("");
  const [modal, setModal] = useState(null);
  const [sidebar, setSidebar] = useState(false);
  const [notice, setNotice] = useState("");
  const favoritesOnly = page === "Favoritos" || filter === "Favoritos";
  const visibleVideos = matchingVideos(
    videos,
    courses,
    search,
    favoritesOnly,
    category,
  );
  const directlyMatchingCourses = filterCourses(
    courses,
    search,
    favoritesOnly,
    category,
  );
  const visible = courses.filter(
    (course) =>
      directlyMatchingCourses.includes(course) ||
      (search.trim() &&
        (!favoritesOnly || course.favorite) &&
        visibleVideos.some((video) => video.courseId === course.id)),
  );
  const activeVideo =
    modal?.type === "watch" ? videos.find((v) => v.id === modal.id) : null;
  const courseVideos =
    modal?.type === "course"
      ? videos.filter((v) => v.courseId === modal.id)
      : [];
  function updateVideo(id, patch) {
    setLibrary((current) => ({
      ...current,
      videos: current.videos.map((v) => (v.id === id ? { ...v, ...patch } : v)),
    }));
  }
  function saveVideo(video) {
    setLibrary((current) => ({
      ...current,
      videos: current.videos.some((v) => v.id === video.id)
        ? current.videos.map((v) => (v.id === video.id ? video : v))
        : [...current.videos, video],
      categories: [...new Set([...current.categories, video.category])],
    }));
    setModal(null);
    setSearch("");
    setFilter("Todos");
    setCategory("");
    setPage("Início");
    setNotice("Vídeo salvo na biblioteca.");
  }
  function videoCard(video) {
    return (
      <VideoCard
        key={video.id}
        video={video}
        course={courses.find((c) => c.id === video.courseId)}
        onWatch={(v) => setModal({ type: "watch", id: v.id })}
        onFavorite={(id) =>
          updateVideo(id, {
            favorite: !videos.find((v) => v.id === id).favorite,
          })
        }
        onEdit={(v) => setModal({ type: "video", video: v })}
        onDelete={(v) => setModal({ type: "delete", video: v })}
      />
    );
  }
  const activeCourse =
    modal?.type === "course"
      ? courses.find((course) => course.id === modal.id)
      : null;
  function navigate(name) {
    setPage(name);
    setFilter("Todos");
    setCategory("");
    setSearch("");
    setSidebar(false);
  }
  function submitCourse(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setCourses((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        title: data.get("title").trim(),
        category: data.get("category"),
        videos: 0,
        progress: 0,
        favorite: false,
        theme: "design",
        label: "SEU NOVO COMEÇO",
        subtitle: "Uma nova jornada de aprendizado.",
        symbol: "✳",
      },
    ]);
    setModal(null);
    setNotice("Curso criado na sua biblioteca.");
  }
  return (
    <div className="app-shell">
      {sidebar && (
        <button
          className="sidebar-overlay"
          aria-label="Fechar menu"
          onClick={() => setSidebar(false)}
        />
      )}
      <aside className={`sidebar ${sidebar ? "is-open" : ""}`}>
        <a
          className="brand"
          href="#"
          onClick={(event) => {
            event.preventDefault();
            navigate("Início");
          }}
        >
          <span className="brand-icon">
            <Play size={20} fill="currentColor" />
          </span>
          <span>
            linkplay<span className="brand-dot">.</span>
          </span>
        </a>
        <span className="sidebar-label">SEU ESPAÇO DE APRENDIZADO</span>
        <nav aria-label="Menu principal">
          {navigation.map(({ name, icon: Icon }) => (
            <button
              key={name}
              className={`nav-item ${page === name ? "active" : ""}`}
              aria-current={page === name ? "page" : undefined}
              onClick={() => navigate(name)}
            >
              <Icon size={19} />
              {name}
              {name === "Meus Cursos" && (
                <span className="nav-count">{courses.length}</span>
              )}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="learning-note">
            <span className="note-icon">
              <Sparkles size={20} />
            </span>
            <strong>Um pouco a cada dia.</strong>
            <p>Grandes conquistas começam com pequenos aprendizados.</p>
            <span>
              Continue sua jornada <ArrowUpRight size={14} />
            </span>
          </div>
          <div className="profile">
            <span className="avatar">V</span>
            <div>
              <strong>Seu espaço pessoal</strong>
              <small>Aprender nunca para</small>
            </div>
            <span className="online-dot" />
          </div>
        </div>
      </aside>
      <div className="main-shell">
        <header className="topbar">
          <div>
            <button
              className="mobile-menu icon-button"
              aria-label="Abrir menu"
              onClick={() => setSidebar(true)}
            >
              <Menu size={22} />
            </button>
            <span>Cursos Linkplay</span>
            <span className="header-slash">/</span>
            <span className="breadcrumb">
              {page === "Início" ? "Minha Biblioteca" : page}
            </span>
          </div>
          <span className="demo-badge">
            <span /> Biblioteca local
          </span>
        </header>
        <main>
          {storageError && (
            <p className="storage-warning" role="alert">
              {storageError}
            </p>
          )}
          <section className="page-heading">
            <div className="eyebrow">
              <span /> SEU CONHECIMENTO, ORGANIZADO
            </div>
            <div className="heading-row">
              <div>
                <h1>{page === "Início" ? "Minha Biblioteca" : page}</h1>
                <p>Seu próximo aprendizado está aqui. Vamos continuar?</p>
              </div>
              <div className="heading-actions">
                <button
                  className="button secondary"
                  onClick={() => setModal({ type: "video" })}
                >
                  <Plus size={17} /> Adicionar vídeo
                </button>
                <button
                  className="button primary"
                  onClick={() => setModal({ type: "new" })}
                >
                  <Plus size={17} /> Novo curso
                </button>
              </div>
            </div>
          </section>
          <section className="stats" aria-label="Resumo da biblioteca">
            {[
              {
                label: "Cursos na biblioteca",
                value: courses.length,
                icon: BookOpen,
                color: "purple",
              },
              {
                label: "Vídeos para explorar",
                value: videos.length,
                icon: Play,
                color: "blue",
              },
              {
                label: "Em andamento",
                value: courses.filter((c) => c.progress > 0 && c.progress < 100)
                  .length,
                icon: Layers,
                color: "orange",
              },
              {
                label: "Cursos concluídos",
                value: courses.filter((c) => c.progress === 100).length,
                icon: Check,
                color: "green",
              },
            ].map(({ label, value, icon: Icon, color }) => (
              <div className="stat" key={label}>
                <span className={`stat-icon ${color}`}>
                  <Icon size={20} />
                </span>
                <div>
                  <strong>{String(value).padStart(2, "0")}</strong>
                  <span>{label}</span>
                </div>
              </div>
            ))}
          </section>
          <section className="library" aria-label="Biblioteca de cursos">
            <div className="library-toolbar">
              <div className="tabs" aria-label="Filtrar cursos">
                {["Todos", "Favoritos"].map((name) => (
                  <button
                    key={name}
                    aria-pressed={
                      (page === "Favoritos" ? "Favoritos" : filter) === name
                    }
                    onClick={() => {
                      if (page === "Favoritos") setPage("Início");
                      setFilter(name);
                    }}
                    className={
                      (page === "Favoritos" ? "Favoritos" : filter) === name
                        ? "active"
                        : ""
                    }
                  >
                    {name === "Favoritos" && <Heart size={15} />} {name}{" "}
                    <span>
                      {name === "Todos"
                        ? courses.length + videos.length
                        : courses.filter((c) => c.favorite).length +
                          videos.filter((v) => v.favorite).length}
                    </span>
                  </button>
                ))}
              </div>
              <label className="search">
                <Search size={18} />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Pesquisar cursos e vídeos..."
                  aria-label="Pesquisar cursos e vídeos..."
                />
                {search && (
                  <button
                    aria-label="Limpar pesquisa"
                    onClick={() => setSearch("")}
                  >
                    <X size={15} />
                  </button>
                )}
              </label>
            </div>
            {page === "Categorias" && (
              <div className="category-filters">
                <button
                  className={!category ? "active" : ""}
                  onClick={() => setCategory("")}
                >
                  Todas as categorias
                </button>
                {categories.map((name) => (
                  <button
                    key={name}
                    className={category === name ? "active" : ""}
                    onClick={() => setCategory(name)}
                  >
                    {name}
                  </button>
                ))}
              </div>
            )}
            {page !== "Meus Cursos" && (
              <>
                <div className="results-heading">
                  <h2>
                    Seus vídeos{" "}
                    <span>{visibleVideos.length} vídeos cadastrados</span>
                  </h2>
                </div>
                {visibleVideos.length ? (
                  <div className="course-grid">
                    {visibleVideos.map(videoCard)}
                  </div>
                ) : (
                  <p className="video-empty">
                    {videos.length
                      ? "Nenhum vídeo corresponde aos filtros."
                      : "Sua biblioteca de vídeos começa aqui. Clique em Adicionar vídeo para salvar seu primeiro link do YouTube."}
                  </p>
                )}
              </>
            )}
            <div className="results-heading">
              <h2>
                {category ||
                  (page === "Favoritos" || filter === "Favoritos"
                    ? "Seus favoritos"
                    : "Seus cursos")}{" "}
                <span>{visible.length} cursos</span>
              </h2>
              <span className="order-label">
                Organizados para você <Shapes size={14} />
              </span>
            </div>
            <div className="course-grid">
              {visible.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onFavorite={(id) =>
                    setCourses((current) =>
                      current.map((c) =>
                        c.id === id ? { ...c, favorite: !c.favorite } : c,
                      ),
                    )
                  }
                  onOpen={(c) => setModal({ type: "course", id: c.id })}
                />
              ))}
            </div>
            {visible.length === 0 && visibleVideos.length === 0 && (
              <div className="empty-state">
                <Search size={30} />
                <h3>Nenhum curso por aqui</h3>
                <p>
                  Tente outra pesquisa ou adicione um novo curso à biblioteca.
                </p>
                <button
                  className="button secondary"
                  onClick={() => {
                    setSearch("");
                    setCategory("");
                    setFilter("Todos");
                    setPage("Meus Cursos");
                  }}
                >
                  Ver todos os cursos
                </button>
              </div>
            )}
          </section>
          <footer>
            <span>
              <span className="footer-logo">linkplay.</span> Seu conhecimento
              merece um lugar especial.
            </span>
            <span>
              Feito para quem nunca para de aprender <Sparkles size={13} />
            </span>
          </footer>
        </main>
      </div>
      {notice && (
        <div className="toast" role="status">
          <Check size={18} />
          {notice}
          <button
            className="icon-button"
            aria-label="Dispensar aviso"
            onClick={() => setNotice("")}
          >
            <X size={16} />
          </button>
        </div>
      )}
      {modal?.type === "new" && (
        <Modal title="Novo curso" onClose={() => setModal(null)}>
          <p className="modal-description">
            Dê um lugar para seu próximo aprendizado.
          </p>
          <form onSubmit={submitCourse}>
            <label>
              Nome do curso
              <input
                name="title"
                required
                maxLength={100}
                pattern=".*\S.*"
                placeholder="Ex.: Introdução ao design"
                autoFocus
              />
            </label>
            <label>
              Categoria
              <select name="category">
                {categories.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
            <p className="form-hint">
              Os cursos criados são salvos neste navegador.
            </p>
            <button className="button primary" type="submit">
              <Plus size={17} /> Criar curso
            </button>
          </form>
        </Modal>
      )}
      {modal?.type === "video" && (
        <Modal
          title={modal.video ? "Editar vídeo" : "Adicionar vídeo"}
          onClose={() => setModal(null)}
        >
          <p className="modal-description">
            Salve um vídeo do YouTube na sua biblioteca.
          </p>
          <VideoForm
            video={modal.video}
            videos={videos}
            courses={courses}
            categories={categories}
            onSave={saveVideo}
            onCancel={() => setModal(null)}
          />
        </Modal>
      )}
      {modal?.type === "delete" && (
        <Modal title="Excluir vídeo" onClose={() => setModal(null)}>
          <p>
            Deseja excluir “{modal.video.title}” da biblioteca? Esta ação não
            pode ser desfeita.
          </p>
          <div className="form-actions">
            <button className="button secondary" onClick={() => setModal(null)}>
              Cancelar
            </button>
            <button
              className="button danger"
              onClick={() => {
                setLibrary((current) => ({
                  ...current,
                  videos: current.videos.filter((v) => v.id !== modal.video.id),
                }));
                setModal(null);
                setNotice("Vídeo excluído da biblioteca.");
              }}
            >
              Confirmar exclusão
            </button>
          </div>
        </Modal>
      )}
      {activeVideo && (
        <Modal title={activeVideo.title} onClose={() => setModal(null)}>
          <div className="youtube-player">
            <iframe
              key={activeVideo.youtubeId}
              src={`https://www.youtube.com/embed/${activeVideo.youtubeId}`}
              title={`Player do YouTube: ${activeVideo.title}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
          <p className="modal-description">
            {courses.find((c) => c.id === activeVideo.courseId)?.title} ·{" "}
            {activeVideo.category}
          </p>
          {activeVideo.description && (
            <p className="video-description">{activeVideo.description}</p>
          )}
          <p className="form-hint">
            Reprodução pelo player oficial do YouTube. Vídeos privados,
            removidos ou com incorporação desativada podem não estar
            disponíveis.
          </p>
          <a
            className="youtube-link"
            href={`https://www.youtube.com/watch?v=${activeVideo.youtubeId}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Abrir no YouTube ↗
          </a>
          <button
            className="button primary"
            onClick={() =>
              updateVideo(activeVideo.id, { completed: !activeVideo.completed })
            }
          >
            <Check size={17} />
            {activeVideo.completed
              ? "Marcar como não concluído"
              : "Marcar como concluído"}
          </button>
        </Modal>
      )}
      {activeCourse && (
        <Modal title={activeCourse.title} onClose={() => setModal(null)}>
          <p className="modal-description">
            {activeCourse.category} · {courseVideos.length} vídeos cadastrados ·{" "}
            {activeCourse.progress}% concluído
          </p>
          <div
            className="progress-track"
            role="progressbar"
            aria-label="Progresso do curso"
            aria-valuenow={activeCourse.progress}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div style={{ width: `${activeCourse.progress}%` }} />
          </div>
          {activeCourse.demo && (
            <p className="form-hint demo-label">
              Curso de demonstração. As contagens ilustrativas da capa são
              substituídas por dados reais quando você adiciona vídeos.
            </p>
          )}
          {courseVideos.length ? (
            <div className="course-video-list">
              {courseVideos.map(videoCard)}
            </div>
          ) : (
            <div className="course-demo">
              <Play size={36} />
              <h3>Seu aprendizado começa aqui</h3>
              <p>
                Nenhum vídeo cadastrado neste curso. Adicione seu primeiro link
                do YouTube.
              </p>
            </div>
          )}
          {activeCourse.demo && !courseVideos.length && (
            <button
              className="button secondary"
              disabled={activeCourse.progress === 100}
              onClick={() =>
                setCourses((current) =>
                  current.map((c) =>
                    c.id === activeCourse.id
                      ? { ...c, progress: Math.min(100, c.progress + 10) }
                      : c,
                  ),
                )
              }
            >
              <Check size={17} />
              {activeCourse.progress === 100
                ? "Curso demonstrativo concluído"
                : "Simular avanço de 10%"}
            </button>
          )}
        </Modal>
      )}
    </div>
  );
}
