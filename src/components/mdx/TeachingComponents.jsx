import { useEffect, useMemo, useState } from "react";
import { highlightCode } from "../../lib/shikiHighlighter";
import "./mdx-components.css";

function TeachingBlock({ as: Tag = "section", tone = "neutral", eyebrow, title, children, className = "" }) {
  return (
    <Tag className={`mdx-teaching-block mdx-tone-${tone} ${className}`.trim()}>
      {(eyebrow || title) && (
        <header className="mdx-teaching-block-header">
          {eyebrow && <span className="mdx-eyebrow">{eyebrow}</span>}
          {title && <h3>{title}</h3>}
        </header>
      )}
      <div className="mdx-teaching-block-body">{children}</div>
    </Tag>
  );
}

export function Callout({ type = "info", title, children }) {
  const labels = { info: "提示", warning: "注意", success: "推荐", danger: "风险" };
  return <TeachingBlock tone={type} eyebrow={labels[type] ?? labels.info} title={title}>{children}</TeachingBlock>;
}

export function MentalModel({ title = "Mental Model", children }) {
  return <TeachingBlock tone="mental" eyebrow="心智模型" title={title}>{children}</TeachingBlock>;
}

export function Concept({ title, children }) {
  return <TeachingBlock eyebrow="概念" title={title}>{children}</TeachingBlock>;
}

export function Experiment({ title = "跟随 Demo 做实验", children }) {
  return <TeachingBlock tone="experiment" eyebrow="Experiment" title={title}>{children}</TeachingBlock>;
}

export function Observation({ title = "观察结果", children }) {
  return <TeachingBlock tone="observation" eyebrow="Observation" title={title}>{children}</TeachingBlock>;
}

export function Boundary({ title = "Production Boundary", children }) {
  return <TeachingBlock tone="boundary" eyebrow="边界" title={title}>{children}</TeachingBlock>;
}

export function AntiPattern({ title = "Anti-pattern", children }) {
  return <TeachingBlock tone="danger" eyebrow="不推荐" title={title}>{children}</TeachingBlock>;
}

export function Summary({ title = "核心结论", items = [], children }) {
  const body = children ?? (
    items.length > 0 ? <ul>{items.map((item, index) => <li key={`${index}-${String(item)}`}>{item}</li>)}</ul> : null
  );
  return <TeachingBlock tone="summary" eyebrow="Summary" title={title}>{body}</TeachingBlock>;
}

function ItemList({ items }) {
  if (items.length === 0) return null;
  return <ul>{items.map((item, index) => <li key={`${index}-${String(item)}`}>{item}</li>)}</ul>;
}

export function Compare({
  left,
  right,
  leftItems = [],
  rightItems = [],
  leftTitle = "错误模型",
  rightTitle = "推荐模型",
  children,
}) {
  const hasLegacyItems = leftItems.length > 0 || rightItems.length > 0;
  if (children && left == null && right == null && !hasLegacyItems) {
    return <TeachingBlock eyebrow="对比">{children}</TeachingBlock>;
  }

  const leftContent = left ?? <ItemList items={leftItems} />;
  const rightContent = right ?? <ItemList items={rightItems} />;

  return (
    <section className="mdx-compare" aria-label="方案对比">
      <article className="mdx-compare-pane mdx-compare-bad"><h3>{leftTitle}</h3><div>{leftContent}</div></article>
      <article className="mdx-compare-pane mdx-compare-good"><h3>{rightTitle}</h3><div>{rightContent}</div></article>
    </section>
  );
}

function Sequence({ label, items = [], children, ordered = false }) {
  if (children) return <TeachingBlock eyebrow={label}>{children}</TeachingBlock>;
  const List = ordered ? "ol" : "ul";
  return (
    <section className="mdx-sequence" aria-label={label}>
      <div className="mdx-eyebrow">{label}</div>
      <List>{items.map((item, index) => <li key={`${index}-${String(item)}`}>{item}</li>)}</List>
    </section>
  );
}

export function Timeline({ steps = [], items = [], children }) {
  const resolvedSteps = steps.length > 0 ? steps : items;
  return <Sequence label="Timeline" items={resolvedSteps} ordered>{children}</Sequence>;
}

export function Flow({ items = [], children }) {
  return <Sequence label="Flow" items={items}>{children}</Sequence>;
}

export function DemoReference({ action, observe, children }) {
  return (
    <TeachingBlock tone="experiment" eyebrow="Demo Reference" title="回到中间实验区验证">
      {action && <p><strong>操作：</strong>{action}</p>}
      {observe && <p><strong>观察：</strong>{observe}</p>}
      {children}
    </TeachingBlock>
  );
}

export function FurtherReading({ items = [], links = [], children }) {
  const resolvedItems = items.length > 0 ? items : links;
  return (
    <TeachingBlock eyebrow="Further Reading" title="延伸阅读">
      {resolvedItems.length > 0 && (
        <ul>{resolvedItems.map((item) => <li key={item.href}><a href={item.href} target="_blank" rel="noreferrer">{item.label ?? item.href}</a></li>)}</ul>
      )}
      {children}
    </TeachingBlock>
  );
}

export function CodeBlock({ code, children, language = "jsx", fileName, caption }) {
  const source = useMemo(() => code ?? (typeof children === "string" ? children : ""), [code, children]);
  const requestKey = `${fileName ?? ""}\u0000${language}\u0000${source}`;
  const [result, setResult] = useState({ key: "", html: "", error: false });

  useEffect(() => {
    let active = true;
    highlightCode(source, { language, fileName })
      .then((html) => { if (active) setResult({ key: requestKey, html, error: false }); })
      .catch(() => { if (active) setResult({ key: requestKey, html: "", error: true }); });
    return () => { active = false; };
  }, [source, language, fileName, requestKey]);

  const html = result.key === requestKey && !result.error ? result.html : "";

  return (
    <figure className="mdx-code-block">
      {(caption || fileName) && <figcaption>{caption ?? fileName}</figcaption>}
      {html ? (
        <div className="mdx-shiki" dangerouslySetInnerHTML={{ __html: html }} />
      ) : (
        <pre><code>{source}</code></pre>
      )}
    </figure>
  );
}

export function CodeDiff({ before, after, beforeTitle = "Before", afterTitle = "After", language = "jsx" }) {
  return (
    <section className="mdx-code-diff" aria-label="代码前后对比">
      <CodeBlock code={before} language={language} caption={beforeTitle} />
      <CodeBlock code={after} language={language} caption={afterTitle} />
    </section>
  );
}
