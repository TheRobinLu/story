import crypto from "crypto";

export const hashPassword = async (password: string): Promise<string> => {
	const salt = process.env.HASH_SALT;

	if (!salt) {
		throw new Error("No salt defined");
	}

	const saltedPassword = salt + password;
	const hash = await crypto.subtle.digest(
		"SHA-256",
		new TextEncoder().encode(saltedPassword)
	);
	const hashArray = Array.from(new Uint8Array(hash));
	const hashHex = hashArray
		.map((b) => b.toString(16).padStart(2, "0"))
		.join("");
	return hashHex;
};
