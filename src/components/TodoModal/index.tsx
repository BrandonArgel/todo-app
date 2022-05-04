import * as React from "react";
import { Checkbox } from "components";
import { Close } from "assets/icons";
import { Todo } from "utils/TodoType";
import styles from "./TodoModal.module.scss";

interface Props {
	open: boolean;
	edit?: boolean;
	todo?: Todo | null;
	onClose: () => void;
	onAdd?: (todo: Todo) => void;
	onEdit?: (todo: Todo) => void;
}

export const TodoModal = ({ open, onClose, onAdd, onEdit, edit = false, todo }: Props) => {
	const status = edit ? "Editar" : "Agregar";
	const inputRef = React.useRef<HTMLInputElement>(null);
	const [text, setText] = React.useState(todo?.text || "");
	const [error, setError] = React.useState(todo?.text || false);
	const [completed, setCompleted] = React.useState(todo?.completed || false);

	React.useEffect(() => {
		setTimeout(() => {
			if (inputRef.current) {
				inputRef.current.focus();
			}
		}, 100);
	}, [open]);

	React.useEffect(() => {
		if (todo) {
			setText(todo.text);
			setCompleted(todo.completed);
		}
	}, [todo]);

	const validate = (value: string) => {
		if (!value) {
			inputRef.current!.focus();
			setText(value);
			setError(true);
			return false;
		}

		return true;
	};

	const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!edit) onCreate(e);
		else onEditSubmit(e);
	};

	const onCreate = (e: React.FormEvent<HTMLFormElement>) => {
		if (validate(text)) {
			const newTodo = {
				id: new Date().getTime().toString(),
				text,
				completed,
			};
			if (onAdd) onAdd(newTodo as Todo);
			setText("");
			setCompleted(false);
			onClose();
		}
	};

	const onEditSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		if (validate(text)) {
			const editedTodo = {
				...todo,
				text,
				completed,
			};
			if (onEdit) onEdit(editedTodo as Todo);
			setText("");
			setCompleted(false);
			onClose();
		}
	};

	return (
		<>
			<button
				aria-hidden={!open}
				className={`${styles.overlay} ${open ? styles.visible : ""}`}
				onClick={() => onClose()}
				tabIndex={-1}
				type="button"
			/>
			<aside
				className={`${styles.modal} ${open ? styles.open : ""}`}
				aria-hidden={!open}
				tabIndex={0}
			>
				<form className={styles.modal__form} onSubmit={onSubmit}>
					<label className={`${styles.modal__form_label} ${error ? styles.error : ""}`}>
						{status} {edit ? "la" : "una"} tarea
						<input
							ref={inputRef}
							type="text"
							placeholder="Aprender, estudiar, hacer, ..."
							value={text}
							onChange={(e) => {
								setText(e.target.value);
								setError(false);
							}}
							title={`${status} ${edit ? "la" : "una"} tarea`}
						/>
					</label>
					<label className={styles.modal__form_checkbox}>
						Completada:
						<Checkbox checked={completed as boolean} onChange={() => setCompleted(!completed)}>
							{text || "Todo"}
						</Checkbox>
					</label>
					<div className={styles.modal__form_buttons}>
						<button type="button" onClick={() => onClose()}>
							Cancel
						</button>
						<button type="submit">{status}</button>
					</div>
				</form>
				<button
					type="button"
					className={styles.close}
					onClick={() => onClose()}
					aria-label="Cerrar modal"
				>
					<Close />
				</button>
			</aside>
		</>
	);
};
