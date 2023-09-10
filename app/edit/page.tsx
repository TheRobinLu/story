import Edit from "../component/edit";
import Header from "../component/header";

export default function EditPage() {
	return (
		<div className="relative max-w-2xl mx-auto">
			<header className="sticky top-0 z-50 ">
				<Header />
			</header>
			<div className="relative">
				<Edit />
			</div>
		</div>
	);
}
