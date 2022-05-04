import * as React from "react";
import { TodoModal, TodoItem, TodoAdd } from "components";
import { Todo } from "utils/TodoType";
import styles from "./TodoList.module.scss";

interface Props {
	search: string;
	todos: Todo[];
	totalCount: number;
	setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
	onAdd: (todo: Todo) => void;
}

export const TodoList: React.FC<Props> = ({ search, todos, totalCount, setTodos, onAdd }) => {
	const [dragging, setDragging] = React.useState(false);
	const [draggedId, setDraggedId] = React.useState("");
	const dragNode = React.useRef<HTMLLIElement>(
		null
	) as React.MutableRefObject<HTMLLIElement | null>;
	const [open, setOpen] = React.useState(false);
	const [todoEdit, setTodoEdit] = React.useState<Todo | null>(null);

	const onComplete = (id: string) => {
		const todo = todos.find((todo) => todo.id === id);
		if (todo) {
			todo.completed = !todo.completed;
			setTodos([...todos]);
		}
	};

	const handleDragEnd = (e: DragEvent) => {
		e.preventDefault();

		setDragging(false);
		setDraggedId("");
		dragNode.current!.removeEventListener("dragend", handleDragEnd);
		dragNode.current = null;
	};

	const handleDragStart = (e: React.DragEvent<HTMLLIElement>, id: string) => {
		e.dataTransfer.setData("text", id);
		e.dataTransfer.effectAllowed = "move";
		const target = e.target as HTMLLIElement;
		target.style.cursor = "grabbing !important";
		setDragging(true);
		setDraggedId(id);
		dragNode.current = e.target as HTMLLIElement;
		dragNode.current.addEventListener("dragend", handleDragEnd);
		setTimeout(() => setDragging(true), 0);
	};

	const handleDragEnter = (e: React.DragEvent<HTMLLIElement>, id: string) => {
		e.preventDefault();
		e.dataTransfer.dropEffect = "move";

		if (dragging && draggedId !== id) {
			const draggedTodo = todos.find((todo) => todo.id === draggedId);
			const draggedIndex = todos.findIndex((todo) => todo.id === draggedId);
			const todoIndex = todos.findIndex((todo) => todo.id === id);
			if (draggedTodo) {
				const newTodos = [...todos];
				newTodos.splice(draggedIndex, 1);
				newTodos.splice(todoIndex, 0, draggedTodo);
				setTodos([...newTodos]);
			}
		}
	};

	const onEdit = (id: string) => {
		const todo = todos.find((todo) => todo.id === id);
		setTodoEdit(todo as Todo);
		if (todo) {
			setOpen(true);
		}
	};

	const onDelete = (id: string) => {
		const todo = todos.find((todo) => todo.id === id);
		if (todo) {
			const newTodos = todos.filter((todo) => todo.id !== id);
			setTodos([...newTodos]);
		}
	};

	return (
		<>
			<ul className={styles.list}>
				{todos && todos.length > 0 ? (
					todos.map(({ completed, text, id }) => (
						<TodoItem
							key={text}
							id={id}
							completed={completed}
							text={text}
							draggable
							onDragStart={handleDragStart}
							onDragEnter={dragging ? (e) => handleDragEnter(e, id) : undefined}
							dragging={dragging && draggedId === id}
							onComplete={onComplete}
							onDelete={onDelete}
							onEdit={onEdit}
						/>
					))
				) : totalCount > 0 ? (
					<li className={styles.list__item}>
						<p>No hay resultados para: {search}</p>
					</li>
				) : (
					<li className={styles.list__item}>
						Crea una nueva tarea <TodoAdd onAdd={onAdd} />
					</li>
				)}
			</ul>
			<TodoModal
				open={open}
				onClose={() => setOpen(false)}
				todo={todoEdit}
				onEdit={(todo) => {
					const newTodos = todos.map((t) => {
						if (t.id === todo.id) {
							return todo;
						}
						return t;
					});
					setTodos([...newTodos]);
					setOpen(false);
				}}
				edit
			/>
		</>
	);
};
