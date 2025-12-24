import { useDroppable } from "@dnd-kit/core";
import type { ReactNode } from "react";

type DroppableProps = {
  id: string;
  children: ReactNode;
};

function Droppable({ id, children }: DroppableProps) {
  const { setNodeRef } = useDroppable({
    id,
    data: {
      accepts: ["stat-todo", "stat-prog", "stat-comp"],
    },
  });

  return <div ref={setNodeRef}>{children}</div>;
}

export default Droppable;
