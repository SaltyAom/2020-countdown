window.addEventListener("load", () => {
	let layout = () => {
		let applyDigit = value => (value < 10 ? `0${value}` : value.toString())

		let date = new Date(new Date("January 1, 2020 00:00:00") - new Date()),
			day = Math.floor(date / (1000 * 60 * 60 * 24)).toString(),
			hour = applyDigit(Math.floor(date / (1000 * 60 * 60)) % 24),
			minute = applyDigit(Math.floor(date / (1000 * 60)) % 60),
			second = applyDigit(Math.floor(date / 1000) % 60),
			time = Math.ceil(date / 1000)

		return time > 0
			? render(
					h(
						"main",
						{ id: "layout" },
						h(
							"section",
							{ id: "timer" },
							h("h1", { id: "day", class: "counter" }, day),
							h("h1", { id: "hour", class: "counter" }, hour),
							h("h1", { id: "minute", class: "counter" }, minute),
							h("h1", { id: "second", class: "counter" }, second)
						),
						h(
							"section",
							{ id: "descriptor" },
							h("span", { class: "detail" }, "day"),
							h("span", { class: "detail" }, "hour"),
							h("span", { class: "detail" }, "minute"),
							h("span", { class: "detail" }, "second")
						)
					),
					window["root"]
			  )
			: render(
					h(
						"main",
						{ id: "layout" },
						h(
							"section",
							{ id: "timer" },
							h("h1", { id: "day", class: "counter appear-1" }, "2"),
							h("h1", { id: "hour", class: "counter appear-2" }, "0"),
							h("h1", { id: "minute", class: "counter appear-3" }, "2"),
							h("h1", { id: "second", class: "counter appear-4" }, "0")
						),
						h(
							"section",
							{ id: "descriptor" },
							h("span", { class: "detail appear-5" }, "Happy"),
							h("span", { class: "detail appear-6" }, "new"),
							h("span", { class: "detail appear-7" }, "year"),
							h("span", { class: "detail appear-8" }, "!!")
						)
					),
					window["root"]
			  )
	}

	layout()
	setInterval(() => layout(), 1000)
})
