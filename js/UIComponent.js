class UIComponent {
	constructor(host, name, tag) {
		Object.assign(this, { host, name });
		this.window = this.element(tag, [name, "window"], host.root);
		this.content = this.element("section", "window__content");
		this.controls = this.element("footer", "window__controls");
		["hide", "show"].forEach((a, i) => { this[a] = () =>
			this.window.classList.toggle("window--active", i) });
		this.host[name] = this;
	};

	element(tag="div", cls, parent=this.window, attrs, content) {
		let e = document.createElement(tag);
		if (typeof cls === "string") e.classList.add(cls);
		else if (Array.isArray(cls)) e.classList.add(...cls);
		Object.entries(attrs || {}).forEach(p => e.setAttribute(...p));
		if (content) e.insertAdjacentHTML("beforeend", content);
		if (parent instanceof Element) parent.append(e);
		return e;
	};

	button(title, handler) {
		let b = this.element("button", "window__button", this.controls, {}, title);
		if (typeof handler === "function") b.addEventListener("click", handler);
		return b;
	}
};