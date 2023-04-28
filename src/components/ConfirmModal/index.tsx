import * as React from "react";
import { useTodo } from "@context";
import { Close } from "@assets/icons";
import styles from "./ConfirmModal.module.scss";

interface Props {
	open: boolean;
	onClose: () => void;
	onConfirm: () => void;
}

export const ConfirmModal = ({ open, onClose, onConfirm }: Props) => {
	const { todos, todoIdDelete } = useTodo();
	const inputRef = React.useRef<HTMLInputElement>(null);

	React.useEffect(() => {
		setTimeout(() => {
			if (inputRef.current) {
				inputRef.current.focus();
			}
		}, 100);
	}, [open]);

	const onSubmit = () => {
		onConfirm();
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
					<h2>¿Quieres eliminar esta tarea?</h2>
					<p>{todos.find((todo) => todo.id === todoIdDelete)?.text}</p>
					<div className={styles.modal__form_buttons}>
						<button type="button" onClick={() => onClose()}>
							Cancel
						</button>
						<button type="submit">{open ? "Delete" : "Deleting..."}</button>
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
