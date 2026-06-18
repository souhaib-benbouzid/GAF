import React from "react";
import styles from "./FilterBar.module.css";

export const CategorySelector = React.memo(
  ({
    selectedCategory,
    onCategoryChange,
    categories = [],
  }: {
    selectedCategory: string;
    onCategoryChange: (value: string) => void;
    categories?: string[];
  }) => (
    <select
      value={selectedCategory}
      onChange={(e) => onCategoryChange(e.target.value)}
      className={styles.selectField}
    >
      {categories.map((category) => (
        <option key={category} value={category}>
          {category}
        </option>
      ))}
    </select>
  ),
);
