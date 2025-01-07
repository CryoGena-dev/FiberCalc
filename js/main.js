window.onload = async () => {
	new Uploader("image/png", "image/jpeg");
	uploader.show();

	let file = await Promise.race([
		uploader.select(),
		uploader.accept()
	]);

	new Renderer({
		blank: [255, 255, 255, 255],
		binder: [64, 64, 64, 255],
		fiber: [255, 100, 0, 255]
	});

	uploader.hide();
	let capture = await renderer.prepare(file);
	renderer.show();

	renderer.button("Обработать", () => {
		let sensitivity = +prompt("Введите чувствительность (0-100%):", 50),
			result = renderer.process(capture, sensitivity);
		alert(`Процентное содержание волокна равно ${result.percentage}%`);
	});
};