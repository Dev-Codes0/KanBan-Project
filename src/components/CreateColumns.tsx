import type { ReactNode } from "react";
import "./CreateColumns.css";

type CreateColumnsProps = {
  status: string;
  children?: ReactNode;
};

function CreateColumns({ status, children }: CreateColumnsProps) {
  return (
    <div>
      <p>{status}</p>
      <div className="colum-layout">{children}</div>
    </div>
  );
}

export default CreateColumns;
