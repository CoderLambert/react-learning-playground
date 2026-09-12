# UI Engineering Architecture

## Purpose and scope

This document freezes the UI engineering standard for new and touched UI. It
does **not** authorize a repository-wide CSS rewrite. Existing, working UI can
keep its current styling until a product change naturally touches that surface.

## Platform contract

- **shadcn** is a copy-owned primitive architecture in this repository. Its
  components are source owned by this codebase rather than a runtime component
  library dependency. We may adapt those primitives to our accessibility,
  product, and design-token needs.
- **Tailwind CSS** is the default styling mechanism for product UI, reusable
  primitives, and new teaching-demo presentation. Tailwind preflight remains
  disabled so it cannot reset the established application baseline.
- **CSS custom properties** remain the compatibility layer for existing design
  tokens and shell layout contracts. Tailwind utilities and primitives should
  reuse those variables where appropriate; this policy does not require a
  wholesale variable rename or redesign.

Do not introduce a second UI system (for example MUI, Ant Design, Chakra, or
styled-components) for new product UI without an explicit architecture
decision.

## Directory responsibilities

| Area | Responsibility |
| --- | --- |
| `src/components/ui/**` | Generic, copy-owned UI primitives. They are domain-neutral, accessible, and styled with Tailwind utilities. |
| Feature UI | Business-facing compositions that assemble primitives, feature state, and domain content. Feature UI does not promote one-off domain behavior into generic primitives prematurely. |
| `src/demos/**` | Teaching experiments. They prioritize faithful learning semantics and observable React behavior over product-component abstraction. |

`src/components/ui/**` must not depend on Assessment, AI, Workbench, or other
domain modules. Features may depend on primitives, never the reverse.

## Styling policy

### Product UI

New Product UI defaults to shadcn-style, copy-owned primitives plus Tailwind
utilities. Prefer an existing primitive when it fits; compose it at the
feature level when it does not. Add a new primitive only after an actual shared
need is established.

### Teaching demos

Teaching Demos first preserve the teaching model, interaction semantics, and
source readability. Their presentation should prefer Tailwind utilities, but a
demo does not need to be reshaped into product UI merely to use a primitive.

### Existing CSS

Legacy CSS follows **touched-surface migration**: when a surface is materially
changed, new presentation work should move toward the platform contract where
safe. Do not make standalone, bulk CSS migration commits that alter unrelated
working surfaces. `App.css` and `index.css` remain compatibility layers during
this transition.

CSS remains appropriate for these exceptions:

- third-party component or embed overrides;
- Shiki, editor, or source-viewer styling that requires generated selectors;
- print styles;
- complex pseudo-element or selector-driven effects that are less clear as
  utilities; and
- legacy application shells that have not yet been touched.

The exception should be local and purposeful. It must not become a new default
for routine buttons, cards, badges, forms, or layout.

## Primitive expectations

Primitives expose a small semantic API, accept `className` for consumer
overrides, preserve native semantics, and use `forwardRef` whenever consumers
need the underlying interactive element. Variant-bearing primitives use a
consistent variant contract. Presentation stays in Tailwind utilities and
existing design tokens rather than adding new global component CSS.

## Adoption checklist

When adding or materially changing UI:

1. Start with an existing `src/components/ui/**` primitive if it satisfies the
   need.
2. Compose domain behavior in the feature or demo, not in a generic primitive.
3. Use Tailwind for ordinary presentation and existing CSS variables for
   established tokens.
4. Keep accessible native controls and keyboard behavior intact.
5. Use scoped CSS only for a documented exception or an untouched legacy
   surface.
