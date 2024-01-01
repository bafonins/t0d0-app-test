import { FC } from "react";
import { DEFAULT_PAGE } from "@/constants/pagination";
import styles from "./Pagination.module.css";

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
    <div className={styles.pagination}>
      <button
        className={styles.prev}
        disabled={!hasPreviousPage}
        onClick={onPreviousPage}
      ></button>
      <span className={styles.page}>{currentPage}</span>
      <button
        className={styles.next}
        disabled={!hasNextPage}
        onClick={onNextPage}
      ></button>
    </div>
  );
};
