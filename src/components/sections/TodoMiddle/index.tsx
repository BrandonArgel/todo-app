import { TodoAdd, TodoSearch } from "@components";
import { TodoModel } from "@models";
import styles from "./TodoMiddle.module.scss";

interface Props {
	placeholder: string;
	onAdd: (todo: TodoModel) => void;
	onSearch: (term: string) => void;
	value: string;
}

export const TodoMiddle: React.FC<Props> = ({ placeholder, onAdd, onSearch, value }) => {
	return (
		<div className={styles.middle}>
			<TodoSearch placeholder={placeholder} onSearch={onSearch} value={value} />
			<TodoAdd onAdd={onAdd} />
		</div>
	);
};
