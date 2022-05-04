import { Checkbox } from "components";
import { Delete, Edit } from "assets/icons";
import styles from "./TodoItem.module.scss";

interface Props {
	completed: boolean;
	draggable: boolean;
	dragging: boolean;
	id: string;
	onDragStart: (e: React.DragEvent<HTMLLIElement>, id: string) => void;
	onDragEnter?: (e: React.DragEvent<HTMLLIElement>) => void;
	text: string;
	onComplete: (id: string) => void;
	onDelete: (id: string) => void;
	onEdit: (id: string) => void;
}

export const TodoItem: React.FC<Props> = ({
	completed,
	id,
	text,
	draggable,
	dragging,
	onDragStart,
	onDragEnter,
	onComplete,
	onDelete,
	onEdit,
}) => {
	return (
		<li
			className={dragging ? `${styles.item} ${styles.current}` : styles.item}
			draggable={draggable}
			onDragStart={(e) => onDragStart(e, id)}
			onDragEnter={onDragEnter}
		>
			<Checkbox checked={completed} onChange={() => onComplete(id)}>
				{text}
			</Checkbox>
			<button
				className={styles.item__edit}
				type="button"
				onClick={() => onEdit(id)}
				aria-hidden={dragging ? "false" : "true"}
				title={`Editar tarea: ${text}`}
			>
				<Edit />
			</button>
			<button
				className={styles.item__delete}
				type="button"
				onClick={() => onDelete(id)}
				aria-hidden={dragging ? "false" : "true"}
				title={`Eliminar tarea: ${text}`}
			>
				<Delete />
			</button>
		</li>
	);
};
