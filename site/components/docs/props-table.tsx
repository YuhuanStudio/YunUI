import propsData from "@/.props.json";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "yunui";

/**
 * PropsTable — auto-generated component prop reference.
 *
 * Reads `site/.props.json`, produced by `scripts/gen-props.ts`
 * (react-docgen-typescript parsing the YunUI source + its JSDoc). Look a
 * component up by `name`. For components react-docgen can't introspect (e.g.
 * Radix re-exports like `Accordion = Primitive.Root`), pass a hand-authored
 * `rows` fallback — those are merged in and used when the generated entry is
 * empty.
 */
export interface PropRow {
  name: string;
  type: string;
  required?: boolean;
  defaultValue?: string | null;
  description: string;
}

const generated = propsData as Record<string, PropRow[]>;

export function PropsTable({
  name,
  rows,
}: {
  /** Component display name, e.g. "Button". Looked up in .props.json. */
  name?: string;
  /** Hand-authored rows; used when no generated entry exists (or to override). */
  rows?: PropRow[];
}) {
  const data = rows ?? (name ? generated[name] : undefined) ?? [];

  if (data.length === 0) {
    return (
      <div className="my-6 rounded-xl border border-border bg-(--bg-elevated) p-4 text-sm text-muted-foreground not-prose">
        No documented props
        {name ? (
          <>
            {" "}
            for <code className="code-inline">{name}</code>
          </>
        ) : null}
        . This component forwards the props of its underlying element.
      </div>
    );
  }

  return (
    <div className="my-6 rounded-xl border border-border overflow-hidden not-prose">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Prop</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Default</TableHead>
            <TableHead className="w-[40%]">Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((p) => (
            <TableRow key={p.name}>
              <TableCell className="font-mono text-xs whitespace-nowrap align-top">
                {p.name}
                {p.required ? <span className="text-error">*</span> : null}
              </TableCell>
              <TableCell className="font-mono text-xs text-muted-foreground align-top">
                {p.type}
              </TableCell>
              <TableCell className="font-mono text-xs align-top">
                {p.defaultValue ? (
                  p.defaultValue
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell className="text-sm align-top">{p.description}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
