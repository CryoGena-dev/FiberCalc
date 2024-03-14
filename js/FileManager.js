class FileManager extends UIComponent {
	constructor(app) {
		super(app, "filemanager", "div"); this.button(); this.ondrag();
		this.input = this.element("input", 0, 0, { type: "file" });
		this.content.classList.add("filemanager__dropzone");
		this.content.ondragenter = () => this.ondrag(1);
		this.content.ondragleave = () => this.ondrag();
		this.content.ondragover = e => e.preventDefault();
		this.window.addEventListener("click", () => this.input.click());
	};

	ondrag(state=0) {
		this.window.classList.toggle("filemanager--drag", state);
		this.controls.children[0].innerText =
			(state ? "Перетащить" : "Загрузить") + " снимок";
	}

	async pick(type) {
		return new Promise(r => {
			this.input.accept = (type || "*") + "/*";

			this.input.onchange = this.content.ondrop = e => {
				if (e.target == this.input) {
					this.file = e.target.files[0];
				} else if (e.target == this.content) {
					e.preventDefault();
					this.ondrag();
					this.file = e.dataTransfer.files[0];
				};

				if (!this.file) return;

				if (type && !this.file.type.startsWith(type)) {
					alert(`Поддерживаются только файлы типа ${type}`);
				} else {
					this.input.onchange = this.content.ondrop = null;
					this.input.accept = null;
					r(this.file);
				};
			};
		});
	};
};