import { Sun, Moon } from "@assets/icons";
import styles from "./TodoHeader.module.scss";

interface Props {
	completedCount: number;
	totalCount: number;
	theme: string;
	setTheme: (theme: string) => void;
}

export const TodoCounter: React.FC<Props> = ({ completedCount, totalCount, theme, setTheme }) => (
	<header className={styles.header}>
		<div className={styles.header__container}>
			<h2 className={styles.header__title}>
				<span>{completedCount}</span> de <span>{totalCount}</span> tareas completadas
			</h2>
			<button
				className={`${styles.header__button} ${styles[theme]}`}
				onClick={() => setTheme(theme === "light" ? "dark" : "light")}
				title={theme === "light" ? "Dark theme" : "Light theme"}
				type="button"
			>
				{theme === "dark" ? <Sun /> : <Moon />}
			</button>
			<div className={styles.header__progress}>
				<progress className={styles.header__progress_bar} value={completedCount} max={totalCount} />
				<span className={styles.header__progress_percentage}>
					{totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100)}%
				</span>
			</div>
		</div>
	</header>
);
