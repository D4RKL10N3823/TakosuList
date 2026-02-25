import { useMemo, useState } from "react";
import Textarea from "./ui/Textarea";
import Button from "./ui/Button";

function buildTree(comments) {
  const byId = new Map(comments.map((c) => [c._id, { ...c, children: [] }]));
  const roots = [];
  for (const c of byId.values()) {
    if (c.parentId) {
      const parent = byId.get(String(c.parentId)) || byId.get(c.parentId);
      if (parent) parent.children.push(c);
      else roots.push(c);
    } else {
      roots.push(c);
    }
  }
  return roots;
}

function formatDate(dateStr) {
  try {
    return new Intl.DateTimeFormat("es", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateStr));
  } catch {
    return dateStr;
  }
}

function Avatar({ username }) {
  const name = username || "?";
  const hue = (name.charCodeAt(0) * 37 + (name.charCodeAt(1) || 0) * 13) % 360;
  const initials = name.slice(0, 2).toUpperCase();

  return (
    <div
      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 border"
      style={{
        background: `hsl(${hue}, 60%, 25%)`,
        borderColor: `hsl(${hue}, 60%, 40%)`,
        color: `hsl(${hue}, 80%, 75%)`,
      }}
    >
      {initials}
    </div>
  );
}

function CommentNode({ node, onReply, depth = 0 }) {
  const [open, setOpen] = useState(false);
  const [txt, setTxt] = useState("");

  const maxDepth = 3;
  const isNested = depth > 0;

  return (
    <div className={isNested ? "comment-tree-line" : "mt-4"}>
      <div className="flex gap-3">
        <Avatar username={node.userId?.username} />

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-sm font-semibold text-cyan-300">
              @{node.userId?.username || "usuario"}
            </span>
            <span className="text-xs text-[var(--color-muted)]">
              {formatDate(node.createdAt)}
            </span>
          </div>

          {/* Content bubble */}
          <div className="text-sm text-slate-300 leading-relaxed bg-[var(--color-surface2)] border border-[var(--color-border)] rounded-xl rounded-tl-sm px-3 py-2">
            {node.content}
          </div>

          {/* Reply button */}
          {depth < maxDepth && (
            <button
              onClick={() => setOpen((v) => !v)}
              className="mt-1.5 text-xs text-[var(--color-muted)] hover:text-purple-400 transition-colors flex items-center gap-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              {open ? "Cancelar" : "Responder"}
            </button>
          )}

          {/* Reply form */}
          {open && (
            <div className="mt-2 space-y-2 fade-up">
              <Textarea
                placeholder="Escribe tu respuesta…"
                value={txt}
                onChange={(e) => setTxt(e.target.value)}
                rows={2}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onReply(node._id, txt);
                  setTxt("");
                  setOpen(false);
                }}
              >
                Enviar respuesta
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Children */}
      {node.children?.map((ch) => (
        <CommentNode key={ch._id} node={ch} onReply={onReply} depth={depth + 1} />
      ))}
    </div>
  );
}

export default function CommentThread({ comments, onCreate, onReply }) {
  const tree = useMemo(() => buildTree(comments), [comments]);
  const [txt, setTxt] = useState("");

  return (
    <div className="mt-8">
      {/* Section header */}
      <div className="section-title mb-6">
        <span>💬 Comentarios</span>
        <span className="text-sm text-[var(--color-muted)] font-normal ml-2">
          ({comments.length})
        </span>
      </div>

      {/* New comment box */}
      <div className="card mb-6 space-y-3">
        <Textarea
          placeholder="Comparte tu opinión sobre este anime…"
          value={txt}
          onChange={(e) => setTxt(e.target.value)}
          rows={3}
        />
        <div className="flex justify-end">
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              onCreate(txt);
              setTxt("");
            }}
          >
            Publicar comentario
          </Button>
        </div>
      </div>

      {/* Thread */}
      {tree.length === 0 ? (
        <div className="text-center py-12 text-[var(--color-muted)]">
          <div className="text-4xl mb-3">💭</div>
          <p className="text-sm">Sé el primero en comentar.</p>
        </div>
      ) : (
        <div className="space-y-1">
          {tree.map((n) => (
            <CommentNode key={n._id} node={n} onReply={onReply} />
          ))}
        </div>
      )}
    </div>
  );
}