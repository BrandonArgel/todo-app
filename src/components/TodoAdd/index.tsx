import * as React from "react";
import { TodoModal } from "components";
import { Add } from "assets/icons";
import { Todo } from "utils/TodoType";
import styles from "./TodoAdd.module.scss";

interface Props {
	onAdd: (todo: Todo) => void;
}

export const TodoAdd: React.FC<Props> = ({ onAdd }) => {
	const [showModal, setShowModal] = React.useState(false);

	return (
		<>
			<button
				className={styles.add}
				type="button"
				onClick={() => setShowModal(true)}
				title="Agregar nueva tarea"
			>
				<Add />
			</button>
			<TodoModal
				open={showModal}
				onClose={() => setShowModal(false)}
				onAdd={onAdd}
			/>
		</>
	);
};
