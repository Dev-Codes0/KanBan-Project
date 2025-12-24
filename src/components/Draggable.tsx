import { type ReactNode } from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
type DraggleProps = {
  children: ReactNode;
  id: string;
  status: string;
};

function Draggable({ children, id, status }: DraggleProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
    data: { type: status },
  });
  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {children}
    </div>
  );
}

export default Draggable;
