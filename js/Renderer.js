class Renderer extends View {
	constructor(colors) {
		super();
		this.colors = colors || {};
		this.button("Другой файл", () => location.reload());
		this.content.classList.add("renderer__workbench");
		this.container = this.element("div", "renderer__container", this.content);
		this.image = this.element("img", "renderer__image", this.container);
		this.canvas = this.element("canvas", "renderer__canvas", this.container);
		this.context = this.canvas.getContext("2d", { willReadFrequently: true });
		this.context.imageSmoothingEnabled = false;
	};

	async prepare(file) {
		this.image.src = URL.createObjectURL(file);
		await new Promise(r => this.image.onload = r);
		URL.revokeObjectURL(this.image.src);

		let sizes = {
			width: this.image.naturalWidth,
			height: this.image.naturalHeight
		};

		this.area = [0, 0, ...Object.values(sizes)];
		for (let e of this.container.children) Object.assign(e, sizes);
		let ratio = (sizes.height / sizes.width * 100).toFixed(2);
		this.container.style.setProperty("--ratio", ratio + "%");
		this.context.drawImage(this.image, ...this.area);
		return this.context.getImageData(...this.area);
	};

	process(capture, sensitivity) {
		this.context.clearRect(...this.area);
		let array = new Uint8ClampedArray(capture.data),
			threshold = (100 - sensitivity) * 7.65,
			result = { blank: 0, binder: 0, fiber: 0 };

		for (let i = 0; i < array.length; i += 4) {
			let [r, g, b, a] = array.subarray(i, i + 4),
				component = a < 128 ? "blank" : "binder";

			if (r + g + b > threshold) component = "fiber";
			array.set(this.colors[component], i);
			result[component]++;
		};

		result.accounted = capture.width * capture.height - result.blank;
		result.percentage = (result.fiber / result.accounted * 100).toFixed(2);
		this.context.putImageData(new ImageData(array, capture.width), 0, 0);
		return result;
	};
};