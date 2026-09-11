export function NoteToc({ items = [], ariaLabel = "笔记目录" }) {
  if (!items.length) return null;

  return (
    <nav className="note-toc" aria-label={ariaLabel}>
      <div className="note-toc-title">目录</div>
      <ol className="note-toc-list">
        {items.map((item) => (
          <li key={item.id} className={`note-toc-item note-toc-level-${item.level}`}>
            <a href={`#${item.id}`}>{item.title}</a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
