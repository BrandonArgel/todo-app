import * as React from "react";
import { ConfirmModal, TodoModal, TodoItem, TodoAdd } from "@components";
import { useTodo } from "@context";
import { TodoModel } from "@models";
import styles from "./TodoList.module.scss";

interface Props {
	totalCount: number;
	onAdd: (todo: TodoModel) => void;
}

let isSwapping = false;

export const TodoList: React.FC<Props> = ({ totalCount, onAdd }) => {
	const { todos, search, removeTodo, editTodo, todoIdDelete, setTodoIdDelete, updateTodos } =
		useTodo();
	const [todoEdit, setTodoEdit] = React.useState<TodoModel | null>(null);
	const [dragging, setDragging] = React.useState(false);
	const [openModal, setOpenModal] = React.useState(false);
	const dragID = React.useRef<string | null>(null);
	const listContainer = React.useRef<HTMLUListElement>(
		null
	) as React.MutableRefObject<HTMLUListElement | null>;
	const dragNode = React.useRef<HTMLLIElement>(
		null
	) as React.MutableRefObject<HTMLLIElement | null>;
	const targetDragNode = React.useRef<HTMLLIElement>(
		null
	) as React.MutableRefObject<HTMLLIElement | null>;
	const targetDragId = React.useRef<string | null>(null);
	const _todos = [...todos];

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

			swapItems();
			reorderList();
		}
	};

	const onTransitionEnd = () => {
		isSwapping = !isSwapping;

		const { current: dragNodeCurrent } = dragNode;

		if (!dragNodeCurrent) return;

		dragNodeCurrent.removeEventListener("transitionend", onTransitionEnd);
	};

	// TODO: Fix swapping items jumping one position out of the container
	const swapItems = (): void => {
		isSwapping = true;

		const { current: dragNodeCurrent } = dragNode;
		const { current: targetDragNodeCurrent } = targetDragNode;

		if (!dragNodeCurrent || !targetDragNodeCurrent) return;

		const currentTranslate = targetDragNodeCurrent.style.transform.match(/-?\d+/g)?.[0] ?? 0;
		const targetTranslate = dragNodeCurrent.style.transform.match(/-?\d+/g)?.[0] ?? 0;

		dragNodeCurrent.addEventListener("transitionend", onTransitionEnd);

		const topDragNode = dragNodeCurrent.getBoundingClientRect().top;
		const topTargetDragNode = targetDragNodeCurrent.getBoundingClientRect().top;

		if (topDragNode > topTargetDragNode) {
			targetDragNodeCurrent.style.transform = `translateY(${Number(currentTranslate) + 100}%)`;
			dragNodeCurrent.style.transform = `translateY(${Number(targetTranslate) - 100}%)`;
		} else {
			targetDragNodeCurrent.style.transform = `translateY(${Number(currentTranslate) - 100}%)`;
			dragNodeCurrent.style.transform = `translateY(${Number(targetTranslate) + 100}%)`;
		}
	};

	const resetSwapItems = (): void => {
		const { current: listContainerCurrent } = listContainer;

		if (!listContainerCurrent) return;
		// Array of all the list items inside the container
		const listItems = Array.from(listContainerCurrent.children) as HTMLLIElement[];

		listItems.forEach((item) => {
			item.style.transition = "none";
			item.style.transform = "translateY(0)";

			setTimeout(() => {
				item.style.transition = "";
			}, 100);
		});

		updateTodos(_todos);
		resetRefs();
	};

	const reorderList = (): void => {
		const { current: dragIDCurrent } = dragID;
		const { current: targetDragIdCurrent } = targetDragId;

		if (!dragIDCurrent || !targetDragIdCurrent) return;

		const dragIndex = _todos.findIndex((todo) => todo.id === dragIDCurrent);
		const targetIndex = _todos.findIndex((todo) => todo.id === targetDragIdCurrent);

		_todos.splice(targetIndex, 0, _todos.splice(dragIndex, 1)[0]);
	};

	const handleDragEnd = () => {
		setDragging(false);
		resetSwapItems();

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
			<ul className={styles.list} ref={listContainer}>
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
