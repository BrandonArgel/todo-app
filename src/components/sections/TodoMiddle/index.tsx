import { TodoAdd, TodoSearch } from "components";
import { Todo } from "utils/TodoType";
import styles from "./TodoMiddle.module.scss";

interface Props {
	placeholder: string;
  onAdd: (todo: Todo) => void;
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
