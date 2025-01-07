class Uploader extends View {
	constructor(...mime) {
		super();
		this.mime = mime || ["*/*"];
		this.actions = ["Выбрать файл", "Перетащить снимок"];
		this.content.classList.add("uploader__dropzone");
		this.label = this.button(this.actions[0]);
		this.input = document.createElement("input");
		this.input.type = "file";
		this.window.onclick = () => this.input.click();

		for (let type of ["enter", "over", "leave"]) {
			this.content["ondrag" + type] = () => {
				if (type === "over") return false;
				let state = type === "enter" & 1;
				this.window.classList.toggle("uploader--drag", state);
				this.label.innerText = this.actions[state];
			};
		};
	};

	select() {
		this.input.accept = this.mime.join(",");

		return new Promise(resolve => {
			this.input.addEventListener("change", event => {
				let file = event.target.files[0];
				if (file) resolve(file);
				else alert("Файл не выбран!");
			}, { once: true });
		});
	};

	accept() {
		return new Promise(resolve => {
			this.content.addEventListener("drop", event => {
				event.preventDefault();
				let file = event.dataTransfer.files[0];
				if (this.mime.includes(file.type)) resolve(file);
				else alert("Такой тип файла не поддерживается");
			}, { once: true });
		});
	};
};