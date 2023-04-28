import { useState, useRef } from "react";
import { useTodo } from "@context";
import { Checkbox } from "@components";
import { Delete, Edit, Grabber } from "@assets/icons";
import styles from "./TodoItem.module.scss";

interface Props {
	completed: boolean;
	dragging: boolean;
	id: string;
	onDragStart: (node: HTMLLIElement, id: string) => void;
	onDragEnter: (e: React.DragEvent<HTMLLIElement>, id: string) => void;
	onDragEnd: () => void;
	text: string;
	onComplete: (id: string) => void;
	onEdit: (id: string) => void;
}

export const TodoItem: React.FC<Props> = ({
	completed,
	id,
	text,
	onDragStart,
	onDragEnter,
	onDragEnd,
	dragging,
	onComplete,
	onEdit,
}) => {
	const itemRef = useRef<HTMLLIElement>(null);
	const { setTodoIdDelete } = useTodo();
	const [draggable, setDraggable] = useState(false);

	return (
		<li
			ref={itemRef}
			className={dragging ? `${styles.item} ${styles.current}` : styles.item}
			onDragEnter={onDragEnter ? (e) => onDragEnter(e, id) : undefined}
			onDragEnd={onDragEnd}
			onDragOver={(e) => e.preventDefault()}
			onDragStart={(e) => onDragStart(itemRef.current!, id)}
			draggable={draggable}
		>
			<Checkbox checked={completed} onChange={() => onComplete(id)}>
				{text}
			</Checkbox>
			<button
				className={styles.item__edit}
				type="button"
				onClick={() => onEdit(id)}
				title={`Editar tarea: ${text}`}
			>
				<Edit />
			</button>
			<button
				className={styles.item__delete}
				type="button"
				onClick={() => setTodoIdDelete(id)}
				title={`Eliminar tarea: ${text}`}
			>
				<Delete />
			</button>
			<span
				className={styles.item__grabber}
				aria-hidden={dragging ? "false" : "true"}
				title="Drag to reorder"
				onMouseDown={() => setDraggable(true)}
				onMouseUp={() => setDraggable(false)}
				onTouchStart={() => setDraggable(true)}
				onTouchEnd={() => setDraggable(false)}
			>
				<Grabber />
			</span>
		</li>
	);
};
