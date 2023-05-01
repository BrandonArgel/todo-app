import { TodoAdd, TodoSearch } from "@components";
import { useTodo } from "@context";
import { TodoModel } from "@models";
import styles from "./TodoMiddle.module.scss";

interface Props {
	placeholder: string;
	onAdd: (todo: TodoModel) => void;
}

export const TodoMiddle: React.FC<Props> = ({ placeholder, onAdd }) => {
	const { search, setSearch } = useTodo();
	
	return (
		<div className={styles.middle}>
			<TodoSearch placeholder={placeholder} onSearch={setSearch} value={search} />
			<TodoAdd onAdd={onAdd} />
		</div>
	);
};
