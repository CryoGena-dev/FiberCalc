window.onload = () => new class {
	constructor() {
		this.root = document.body;
		setTimeout(() => this.run(), 100);
		new FileManager(this);

		new FiberDeterminer(this, {
			blank: [255, 255, 255, 255],
			binder: [64, 64, 64, 255],
			fiber: [255, 100, 0, 255]
		});
	};

	async run() {
		this.filemanager.show();
		let file = await this.filemanager.pick("image");
		this.filemanager.hide();
		let img = await this.determiner.loadFile(file),
			data = this.determiner.prepare(img);
		this.determiner.show();
		
		this.determiner.button("Обработать", () => {
			let senstivity = +prompt("Введите чувствительность (0-100%):", 50),
				result = this.determiner.process(data, senstivity),
				filling = result.fiber / (data.width * data.height - result.blank) * 100;
			setTimeout(() => alert("Процентное содержание волокна равно "
				+ filling.toFixed(2) + "%"), 100);
		});

		this.determiner.button("Другой файл", () => location.reload());
	};
};