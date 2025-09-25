"use client";
import React, { useEffect, useRef } from "react";
import { useVisibility, VisibilityProvider } from "@/lib/VisibilityContext";
import List from "@/app/components/List";
import { FaXmark, FaBars } from "react-icons/fa6";
import { MenuItem, INavigationItems } from "@/lib/types";
import { useHandleDomClick, useWindowListener } from "@/lib/clientFunctions";

// Define the Modal component with children prop
const Modal: React.FC<{
	id: string;
	children: React.ReactNode;
}> = ({ id, children }) => {
	const { visible, ref, setRef, setVisible } = useVisibility();
	const refDialog = useRef<HTMLDialogElement>(null);
	useEffect(() => {
		setRef(refDialog);
		if (visible) {
			refDialog.current?.showModal();
		} else {
			refDialog.current?.close();
		}
	}, [visible, setRef]);

	const handleClick = (e: React.MouseEvent<HTMLDialogElement>) => {
		const target = e.target as HTMLElement;
		if (target.tagName === "A") {
			setVisible(false);
		}
	};
	return (
		<dialog
			data-id={id}
			ref={refDialog}
			className={`z-50 bg-gray-100 w-full h-full p-5 mx-auto top-[10%]`}
			onClick={handleClick}
		>
			{children}
		</dialog>
	);
};
// Define the Container component with children prop
const Container: React.FC<{
	id: string;
	display: string;
	children: React.ReactNode;
}> = ({ id, display, children }) => {
	const ref = useHandleDomClick(id);
	return (
		<div className={`dialog-wrapper z-50 md:fixed`} ref={ref}>
			{children}
		</div>
	);
};

// Define the BarsIcon component
const BarsIcon: React.FC<{ id: string }> = ({ id }) => {
	const { setVisible } = useVisibility();
	return (
		<FaBars
			className={`absolute md:!hidden text-black text-[1.9rem] top-[20px] end-5`}
			onClick={() => setVisible(true)}
		/>
	);
};

// Define the ModalCloseFormDialog component
const ModalCloseFormDialog: React.FC = () => {
	const { setVisible } = useVisibility();
	return (
		<form method="dialog" className="flex justify-end mb-5">
			<button className="p-0 leading-tight" onClick={() => setVisible(false)}>
				<FaXmark className={`text-[1.9rem] top-3 absolute end-3`} />
			</button>
		</form>
	);
};

type SetVisibleType = React.Dispatch<React.SetStateAction<boolean>>;
// Define the NavModal component
const NavModal: React.FC<{
	nav: INavigationItems;
	id: string;
	display: string;
	user: INavigationItems;
}> = ({ nav, id, display, user }) => {
	return (
		<VisibilityProvider>
			<Container id={id} display={display}>
				<BarsIcon id={id} />
				<Modal id={id}>
					<ModalCloseFormDialog />
					<List nav={nav} user={user} type="mobile" />
				</Modal>
			</Container>
		</VisibilityProvider>
	);
};

export default NavModal;
