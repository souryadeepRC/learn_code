import * as React from 'react';

/**
 * IconPlaceholder — a multi-icon-library resolver used by shadcn components.
 *
 * It accepts icon name props for several popular icon libraries and renders
 * the first one that resolves. In this project, we use `react-icons` with the
 * Remix Icon set (remixicon), so that prop is the primary source.
 *
 * If no library matches, falls back to a plain ✕ SVG so the UI never breaks.
 *
 * Usage (in shadcn primitives like sheet.tsx):
 * ```tsx
 * <IconPlaceholder
 *   lucide="XIcon"
 *   tabler="IconX"
 *   hugeicons="Cancel01Icon"
 *   phosphor="XIcon"
 *   remixicon="RiCloseLine"
 * />
 * ```
 */

// ── Icon library registries ────────────────────────────────────────────────

// Lazily load react-icons/ri so this file doesn't bloat the bundle
// if IconPlaceholder is tree-shaken.
type RemixIconModule = Record<
  string,
  React.ComponentType<React.SVGProps<SVGSVGElement>>
>;

let _ri: RemixIconModule | null = null;

const getRI = (): RemixIconModule => {
  if (_ri) return _ri;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    _ri = require('react-icons/ri') as RemixIconModule;
  } catch {
    _ri = {};
  }
  return _ri;
};

// ── Fallback SVG ───────────────────────────────────────────────────────────

const FallbackCloseIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
};

// ── Props ──────────────────────────────────────────────────────────────────

export type IconPlaceholderProps = React.SVGProps<SVGSVGElement> & {
  /** Lucide icon name (e.g. "XIcon") */
  lucide?: string;
  /** Tabler icon name (e.g. "IconX") */
  tabler?: string;
  /** Hugeicons icon name (e.g. "Cancel01Icon") */
  hugeicons?: string;
  /** Phosphor icon name (e.g. "XIcon") */
  phosphor?: string;
  /** React Icons / Remix icon name (e.g. "RiCloseLine") — primary for this project */
  remixicon?: string;
};

// ── Component ──────────────────────────────────────────────────────────────

/**
 * Resolves the correct icon component at runtime by checking each
 * registered icon library in priority order:
 * 1. remixicon (react-icons/ri) — this project's icon library
 * 2. Fallback inline SVG
 */
export const IconPlaceholder = ({
  lucide,
  tabler,
  hugeicons,
  phosphor,
  remixicon,
  ...svgProps
}: IconPlaceholderProps) => {
  // Explicitly discard unsupported library names — this project uses react-icons only.
  void lucide;
  void tabler;
  void hugeicons;
  void phosphor;
  // ── Try remixicon (react-icons/ri) ──────────────────────────────────────
  if (remixicon) {
    const ri = getRI();
    const Icon = ri[remixicon];
    if (Icon) {
      return <Icon aria-hidden="true" {...svgProps} />;
    }
  }

  // ── Fallback ─────────────────────────────────────────────────────────────
  return <FallbackCloseIcon {...svgProps} />;
};
