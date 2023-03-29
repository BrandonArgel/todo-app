import * as React from "react";
import { TodoModal, TodoItem, TodoAdd } from "@components";
import { ToDoContext } from "@context";
import { TodoModel } from "@models";
import styles from "./TodoList.module.scss";

interface Props {
	search: string;
	todos: TodoModel[];
	totalCount: number;
	setTodos: (todos: TodoModel[]) => void;
	onAdd: (todo: TodoModel) => void;
}

export const TodoList: React.FC<Props> = ({ search, todos, totalCount, setTodos, onAdd }) => {
	const [dragging, setDragging] = React.useState(false);
	const { removeTodo, editTodo } = React.useContext(ToDoContext);
	const dragContainer = React.useRef<HTMLUListElement>(null);
	const dragItem = React.useRef<any>(null);
	const dragNode = React.useRef<HTMLLIElement>(
		null
	) as React.MutableRefObject<HTMLLIElement | null>;
	const [open, setOpen] = React.useState(false);
	const [todoEdit, setTodoEdit] = React.useState<TodoModel | null>(null);

	const onComplete = (id: string) => {
		const todo = todos.find((todo) => todo.id === id);
		if (todo) {
			editTodo({
				...todo,
				completed: !todo.completed,
			});
		}
	};

	const handleDragStart = (e: React.DragEvent<HTMLLIElement>, id: string) => {
		setDragging(true);
		const { current: dragContainerCurrent } = dragContainer;
		if (dragContainerCurrent) {
			dragContainerCurrent.style.cursor = "grabbing";
		}
		const target = e.target;
		dragItem.current = id;

		if (target) {
			dragNode.current = e.target as HTMLLIElement;
		}
	};

	const handleDragEnter = (e: React.DragEvent<HTMLLIElement>, id: string) => {
		e.preventDefault();
		const { current: dragItemCurrent } = dragItem;
		const { current: dragNodeCurrent } = dragNode;
		if (dragNodeCurrent && dragItemCurrent !== id) {
			const draggedTodo = todos.find((todo) => todo.id === dragItemCurrent);
			const draggedIndex = todos.findIndex((todo) => todo.id === dragItemCurrent);
			const todoIndex = todos.findIndex((todo) => todo.id === id);
			if (draggedTodo) {
				const newTodos = [...todos];
				newTodos.splice(draggedIndex, 1);
				newTodos.splice(todoIndex, 0, draggedTodo);
				setTodos([...newTodos]);
			}
		}
	};

	const handleDragEnd = () => {
		dragItem.current = null;
		dragNode.current = null;
		const { current: dragContainerCurrent } = dragContainer;
		if (dragContainerCurrent) {
			dragContainerCurrent.style.cursor = "";
		}
		setDragging(false);
	};

	const onEdit = (id: string) => {
		const todo = todos.find((todo) => todo.id === id);
		setTodoEdit(todo as TodoModel);
		if (todo) {
			setOpen(true);
		}
	};

	return (
		<>
			<ul className={styles.list} ref={dragContainer}>
				{todos.length > 0 ? (
					todos.map(({ completed, text, id }) => (
						<TodoItem
							key={id}
							id={id}
							completed={completed}
							text={text}
							dragging={dragging && dragItem.current === id}
							onComplete={onComplete}
							onDelete={removeTodo}
							onEdit={onEdit}
							onDragStart={handleDragStart}
							onDragEnter={handleDragEnter}
							onDragEnd={handleDragEnd}
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
