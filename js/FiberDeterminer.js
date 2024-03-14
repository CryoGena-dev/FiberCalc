class FiberDeterminer extends UIComponent {
	constructor(app, colors) {
		super(app, "determiner", "main");
		this.colors = new Map(Object.entries(colors || {}));
		this.content.classList.add("determiner__viewer");
		this.container = this.element("div", "determiner__container", this.content);
		this.contexts = {};
		
		["src", "dist"].forEach(n => {
			let c = this.element("canvas", "determiner__canvas", this.container);
			c.classList.add(`determiner__${n}-canvas`);
			this.contexts[n] = c.getContext("2d");
		});
	};

	async loadFile(file) {
		let url = URL.createObjectURL(file),
			img = await this.loadURL(url);
		URL.revokeObjectURL(url);
		return img;
	};

	async loadURL(url) {
		let img = new Image();
		img.src = url;
		await new Promise(r => img.onload = r);
		return img;
	};

	prepare(img) {
		let w = img.naturalWidth,
			h = img.naturalHeight,
			area = [0, 0, w, h];

		Object.values(this.contexts).forEach(c => {
			["width", "height"].forEach((p, i) => c.canvas[p] = i ? h : w);
			c.clearRect(...area);
		});

		this.container.style.setProperty("--ratio", (h / w * 100).toFixed(2) + "%");
		this.contexts.src.drawImage(img, ...area);
		return this.contexts.src.getImageData(...area);
	};

	process(data, senstivity) {
		this.contexts.dist.clearRect(0, 0, data.width, data.height);
		let result = { blank: 0, binder: 0, fiber: 0 },
			arr = Array.from(data.data);

		for (let i = 0; i < arr.length; i += 4) {
			let [r, g, b, a] = arr.slice(i, i + 4), component;

			if (a < 127)
				component = "blank";
			else if (r + g + b > (100 - senstivity) * 7.65)
				component = "fiber";
			else
				component = "binder";

			result[component]++;
			this.colors.get(component).forEach((e, j) => arr[i + j] = e);
		};

		let newData = new ImageData(new Uint8ClampedArray(arr), data.width);
		this.contexts.dist.putImageData(newData, 0, 0);
		this.content.classList.add("determiner__viewer--ready");
		return result;
	};
};