import * as React from "react";
import { ConfirmModal, TodoModal, TodoItem, TodoAdd } from "@components";
import { useTodo } from "@context";
import { TodoModel } from "@models";
import styles from "./TodoList.module.scss";

interface Props {
	totalCount: number;
	onAdd: (todo: TodoModel) => void;
}

export const TodoList: React.FC<Props> = ({ totalCount, onAdd }) => {
	const { todos, search, removeTodo, editTodo, todoIdDelete, setTodoIdDelete, updateTodos } =
		useTodo();
	console.log("render", todos);
	const [dragging, setDragging] = React.useState(false);
	const dragID = React.useRef<string | null>(null);
	const dragNode = React.useRef<HTMLLIElement>(
		null
	) as React.MutableRefObject<HTMLLIElement | null>;
	const targetDragId = React.useRef<string | null>(null);
	const targetDragNode = React.useRef<HTMLLIElement>(
		null
	) as React.MutableRefObject<HTMLLIElement | null>;
	const [openModal, setOpenModal] = React.useState(false);
	const [todoEdit, setTodoEdit] = React.useState<TodoModel | null>(null);
	let isSwapping = false;

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
		e.dataTransfer.setData("text", id);
		e.dataTransfer.effectAllowed = "move";

		setDragging(true);

		dragID.current = id;
		dragNode.current = e.target as HTMLLIElement;
	};

	const handleDragEnter = (e: React.DragEvent<HTMLLIElement>, id: string) => {
		const { current: dragIDCurrent } = dragID;
		const { current: dragNodeCurrent } = dragNode;
		const todoTarget = e.target as HTMLLIElement;

		e.preventDefault();
		e.dataTransfer.dropEffect = "move";

		if (!dragNodeCurrent || !dragIDCurrent || isSwapping) return;
		if (dragIDCurrent !== id && todoTarget.tagName === "LI") {
			targetDragId.current = id;
			targetDragNode.current = e.target as HTMLLIElement;

			dragNodeCurrent.addEventListener("transitionend", resetSwapItems);
			swapItems();
		}
	};

	const swapItems = (): void => {
		isSwapping = true;

		const { current: dragNodeCurrent } = dragNode;
		const { current: targetDragNodeCurrent } = targetDragNode;

		if (!dragNodeCurrent || !targetDragNodeCurrent) return;

		if (dragNodeCurrent.offsetTop > targetDragNodeCurrent.offsetTop) {
			targetDragNodeCurrent.style.transform = "translateY(100%)";
			dragNodeCurrent.style.transform = "translateY(-100%)";
		} else {
			targetDragNodeCurrent.style.transform = "translateY(-100%)";
			dragNodeCurrent.style.transform = "translateY(100%)";
		}
	};

	const resetSwapItems = (e: TransitionEvent): void => {
		if (e.propertyName !== "transform") return;
		const { current: dragNodeCurrent } = dragNode;
		const { current: targetDragNodeCurrent } = targetDragNode;

		if (!dragNodeCurrent || !targetDragNodeCurrent) return;
		reorderList();

		dragNodeCurrent.style.transition = "none";
		targetDragNodeCurrent.style.transition = "none";
		dragNodeCurrent.style.transform = "translateY(0)";
		targetDragNodeCurrent.style.transform = "translateY(0)";

		setTimeout(() => {
			dragNodeCurrent.style.transition = "";
			targetDragNodeCurrent.style.transition = "";
		}, 0);

		dragNodeCurrent.removeEventListener("transitionend", reorderList);
		isSwapping = false;
		resetRefs();
	};

	const reorderList = (): void => {
		const { current: dragIDCurrent } = dragID;
		const { current: targetDragIdCurrent } = targetDragId;

		const draggedTodo = todos.find((todo) => todo.id === dragIDCurrent);
		const draggedIndex = todos.findIndex((todo) => todo.id === dragIDCurrent);
		const todoIndex = todos.findIndex((todo) => todo.id === targetDragIdCurrent);

		if (draggedTodo) {
			console.log("todos", todos);
			const newTodos = [...todos];
			newTodos.splice(draggedIndex, 1);
			newTodos.splice(todoIndex, 0, draggedTodo);
			updateTodos(newTodos);
			console.log("new todos", newTodos);
		}
	};

	const handleDragEnd = () => {
		setDragging(false);

		if (!isSwapping) {
			resetRefs();
		}
	};

	const resetRefs = () => {
		dragID.current = null;
		dragNode.current = null;
		targetDragId.current = null;
		targetDragNode.current = null;
	};

	const onEdit = (id: string) => {
		const todo = todos.find((todo) => todo.id === id);
		setTodoEdit(todo as TodoModel);
		if (todo) {
			setOpenModal(true);
		}
	};

	return (
		<>
			<ul className={styles.list}>
				{todos.length > 0 ? (
					todos.map(({ completed, text, id }) => (
						<TodoItem
							key={id}
							id={id}
							completed={completed}
							text={text}
							dragging={dragging && dragID.current === id}
							onComplete={onComplete}
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
				open={openModal}
				onClose={() => setOpenModal(false)}
				todo={todoEdit}
				onEdit={(todo) => {
					const newTodos = todos.map((t) => {
						if (t.id === todo.id) {
							return todo;
						}
						return t;
					});
					updateTodos([...newTodos]);
					setOpenModal(false);
				}}
				edit
			/>
			<ConfirmModal
				open={Boolean(todoIdDelete)}
				onClose={() => setTodoIdDelete("")}
				onConfirm={() => {
					removeTodo();
					setTodoIdDelete("");
				}}
			/>
		</>
	);
};
