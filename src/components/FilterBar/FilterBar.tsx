import { CategorySelector } from "./CategorySelector";
import styles from "./FilterBar.module.css";
import type { FilterBarProps } from "./FilterBar.types";

export const FilterBar = ({
  searchQuery,
  selectedCategory,
  onSearchChange,
  onCategoryChange,
  categories,
}: FilterBarProps) => {
  return (
    <div className={styles.searchBar}>
      <input
        type="text"
        placeholder="Filter notices by keywords or details..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className={styles.inputField}
      />
      <CategorySelector
        selectedCategory={selectedCategory}
        onCategoryChange={onCategoryChange}
        categories={categories}
      />
    </div>
  );
};
