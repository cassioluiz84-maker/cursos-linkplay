export const initialCourses = [
  { id: 1, title: 'Design de interfaces do zero', category: 'Design', videos: 24, progress: 42, favorite: true, theme: 'design', label: 'DESIGN ESSENTIALS', subtitle: 'Ideias que viram interfaces.', symbol: '✳︎' },
  { id: 2, title: 'React: do básico ao avançado', category: 'Programação', videos: 36, progress: 18, favorite: false, theme: 'react', label: 'CODE & CREATE', subtitle: 'Seu próximo passo em React.', symbol: '⌘' },
  { id: 3, title: 'Marketing digital na prática', category: 'Marketing', videos: 18, progress: 0, favorite: false, theme: 'marketing', label: 'MAKE AN IMPACT', subtitle: 'Conecte. Crie. Cresça.', symbol: '↗︎' },
  { id: 4, title: 'Fotografia com novos olhares', category: 'Criatividade', videos: 16, progress: 65, favorite: true, theme: 'photo', label: 'A NEW PERSPECTIVE', subtitle: 'O extraordinário no cotidiano.', symbol: '◉' },
  { id: 5, title: 'Produtividade sem complicação', category: 'Desenvolvimento pessoal', videos: 12, progress: 100, favorite: false, theme: 'focus', label: 'LESS, BUT BETTER', subtitle: 'Mais espaço para o que importa.', symbol: '✦' },
  { id: 6, title: 'JavaScript: primeiros passos', category: 'Programação', videos: 28, progress: 0, favorite: false, theme: 'javascript', label: 'HELLO, WORLD.', subtitle: 'Grandes projetos começam aqui.', symbol: '{ }' },
];
export const categories = ['Design', 'Programação', 'Marketing', 'Criatividade', 'Desenvolvimento pessoal'];
export function filterCourses(courses, search, favoritesOnly, category) {
  return courses.filter(course => (!favoritesOnly || course.favorite) && (!category || course.category === category) && `${course.title} ${course.category}`.toLocaleLowerCase('pt-BR').includes(search.toLocaleLowerCase('pt-BR')));
}
