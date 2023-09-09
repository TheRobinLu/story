import * as React from "react";

// 1. import `NextUIProvider` component
import { NextUIProvider } from "@nextui-org/react";
import { AppProps } from "next/app";

function App({ Component, pageProps }: AppProps) {
	// 2. Wrap NextUIProvider at the root of your app
	return (
		<NextUIProvider>
			<Component {...pageProps} />
		</NextUIProvider>
	);
}

export default App;
