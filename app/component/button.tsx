import { Button } from "@nextui-org/react";
import { Children } from "react";

export function PurpleGradientButton({
	text,
	onPress,
}: {
	text: string;
	onPress: () => void;
}) {
	return (
		<Button
			className="bg-gradient-to-b from-purple-300 via-purple-800 to-purple-500 text-white"
			onPress={onPress}
			size="sm"
			variant="shadow"
		>
			{text}
		</Button>
	);
}
