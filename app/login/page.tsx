import LogIn from "../component/login/login";
import Header from "../component/header";

export default function EditPage() {
	return (
		<div>
			<div className=" relative max-w-2xl mx-auto">
				<header className="sticky top-0 z-50 ">
					<Header />
				</header>
			</div>
			<div>
				<LogIn />
			</div>
		</div>
	);
}
