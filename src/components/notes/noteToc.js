export function collectNoteToc(container, selector = "h2, h3") {
  if (!container) return [];

  return Array.from(container.querySelectorAll(selector))
    .filter((heading) => heading.id && heading.textContent?.trim())
    .map((heading) => ({
      id: heading.id,
      title: heading.textContent.trim(),
      level: Number(heading.tagName.slice(1)),
    }));
}
