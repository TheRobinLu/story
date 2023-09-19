import React, { ChangeEvent } from "react";

import { Input } from "@nextui-org/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

export function Password({
	errorMessage,
	onChange,
}: {
	errorMessage: string;
	onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}) {
	const [isVisible, setIsVisible] = React.useState(false);
	const toggleVisibility = () => setIsVisible(!isVisible);

	return (
		<Input
			className="p-1"
			// variant="underlined"
			errorMessage={errorMessage}
			color="primary"
			radius="sm"
			size="sm"
			// startContent={<div>edit</div>}
			isRequired={true}
			isInvalid={false}
			type={isVisible ? "text" : "password"}
			placeholder="Enter your password"
			onChange={(e) => onChange(e)}
			endContent={
				<button
					className="focus:outline-none"
					type="button"
					onClick={toggleVisibility}
				>
					{isVisible ? (
						<FontAwesomeIcon
							icon={faEyeSlash}
							className="text-2xl text-default-400 pointer-events-none"
						/>
					) : (
						<FontAwesomeIcon
							icon={faEye}
							className="text-2xl text-default-400 pointer-events-none"
						/>
					)}
				</button>
			}
		/>
	);
}
