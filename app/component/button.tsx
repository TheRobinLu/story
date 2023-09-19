import { Button } from "@nextui-org/react";
import { Children } from "react";

export function PurpleGradientButton({
	onPress,
	disabled,
	children,
}: {
	onPress: () => void;
	disabled?: boolean | undefined;
	children?: React.ReactNode;
}) {
	return (
		<Button
			className="bg-gradient-to-b from-purple-300 via-purple-800 to-purple-500 text-white
								hover:from-purple-400 hover:via-purple-900 hover:to-purple-600"
			disabled={disabled}
			onPress={onPress}
			size="sm"
			variant="shadow"
		>
			{children}
		</Button>
	);
}
