import React, {
	createContext,
	useState,
	ReactNode,
	useContext,
	useRef,
} from "react";

interface VisibilityContextType {
	visible: boolean;
	setVisible: React.Dispatch<React.SetStateAction<boolean>>;
	string: string;
	setString: React.Dispatch<React.SetStateAction<string>>;
	ref: React.MutableRefObject<HTMLDialogElement | null>;
	setRef: (ref: React.MutableRefObject<HTMLDialogElement | null>) => void;
}

const defaultVisibilityContext: VisibilityContextType = {
	visible: false,
	setVisible: () => {},
	string: "",
	setString: () => {},
	ref: { current: null },
	setRef: () => {},
};

const VisibilityContext = createContext<VisibilityContextType | undefined>(
	undefined,
);

export const VisibilityProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [visible, setVisible] = useState<boolean>(false);
	const [string, setString] = useState<string>("");
	const ref = useRef<HTMLDialogElement | null>(null);
	const setRef = (newRef: React.MutableRefObject<HTMLDialogElement | null>) => {
		ref.current = newRef.current;
	};

	return (
		<VisibilityContext.Provider
			value={{ visible, setVisible, string, setString, ref, setRef }}
		>
			{children}
		</VisibilityContext.Provider>
	);
};

export const useVisibility = () => {
	const context = useContext(VisibilityContext);
	if (!context) {
		return defaultVisibilityContext;
	}
	return context;
};
