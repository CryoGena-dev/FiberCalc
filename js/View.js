class View {
	constructor() {
		this.window = this.element("div", "view", document.body);
		this.content = this.element("section", "view__content");
		this.controls = this.element("footer", "view__controls");
		this.show = () => this.window.classList.add("view--active");
		this.hide = () => this.window.classList.remove("view--active");
		this.window.classList.add(this.constructor.name.toLowerCase());
		window[this.window.classList[1]] = this;
	};

	element(tag="div", className, parent=this.window) {
		let elem = document.createElement(tag);
		elem.classList.add(className);
		parent.append(elem);
		return elem;
	};

	button(title, handler) {
		let btn = this.element("button", "view__button", this.controls);
		if (typeof title === "string") btn.innerText = title;
		if (typeof handler === "function") btn.onclick = handler;
		return btn;
	};
};