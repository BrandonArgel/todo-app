import * as React from "react";
import { Search } from "assets/icons";
import styles from "./TodoSearch.module.scss";

interface Props {
	onSearch: (term: string) => void;
	placeholder: string;
	value: string;
}

export const TodoSearch: React.FC<Props> = ({ onSearch, placeholder, value }) => {
	return (
		<div className={styles.search}>
			<input
				autoComplete="off"
				className={styles.search__input}
				id={placeholder}
				type="text"
				placeholder={placeholder}
				value={value}
				onChange={(e) => onSearch(e.target.value)}
				autoFocus
			/>
			<label htmlFor={placeholder} className={styles.search__label}>
				<Search />
			</label>
		</div>
	);
};
