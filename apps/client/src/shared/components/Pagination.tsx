import { FC } from "react";
import { DEFAULT_PAGE } from "@/constants/pagination";

export interface PaginationProps {
  onNextPage: () => void;
  hasNextPage?: boolean;
  onPreviousPage: () => void;
  hasPreviousPage?: boolean;
  currentPage?: number;
}

export const Pagination: FC<PaginationProps> = (props) => {
  const {
    onNextPage,
    hasNextPage = false,
    onPreviousPage,
    hasPreviousPage = false,
    currentPage = DEFAULT_PAGE,
  } = props;

  return (
    <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
      <button disabled={!hasPreviousPage} onClick={onPreviousPage}>
        {"<<"}
      </button>
      <span style={{ margin: "0 8px" }}>{currentPage}</span>
      <button disabled={!hasNextPage} onClick={onNextPage}>
        {">>"}
      </button>
    </div>
  );
};
