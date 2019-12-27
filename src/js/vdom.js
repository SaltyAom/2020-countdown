/**
 * * Basic Virtual DOM
 * ? For more information and further update please take a look at https://github.com/SaltyAom/basic-vdom
 */
const mapObject = (iterator, callback) =>
		Object.entries(iterator).map(callback),
	isString = value => typeof value === "string",
	isUndefined = value => typeof value === "undefined",
	applyProperty = (iterator, updateValue, condition = true) =>
		condition
			? mapObject(
					iterator,
					([attribute, property]) =>
						(updateValue[convertClassName(attribute)] = property)
			  )
			: updateValue,
	applySensitiveProperty = (attributes, localAttributes) =>
		mapObject(attributes, ([attribute, property]) =>
			attribute === "style"
				? applyProperty(property, localAttributes.style)
				: (localAttributes[convertClassName(attribute)] = property)
		),
	hasSameChildren = (oldChildren, newChildren) =>
		JSON.stringify(oldChildren) !== JSON.stringify(newChildren),
	convertClassName = attribute =>
		attribute === "class" ? "className" : attribute

const h = (tagName, attributes = {}, ...children) => {
		let localAttributes = {},
			localChildren = []

		if (attributes !== null && !isUndefined(attributes.style))
			localAttributes = { style: {} }

        if(attributes !== null)
    		applySensitiveProperty(attributes, localAttributes)

		children.map(child =>
			isString(child)
				? localChildren.push(child)
				: localChildren.push(child)
		)

		return {
			tagName: tagName,
			attributes: localAttributes,
			children: localChildren
		}
	},
	diff = (oldNode, newNode) => {
		let difference = { children: [], attributes: {} },
			oldChildren = []

		if (isUndefined(oldNode)) return newNode

		// Convert DOM nodes to children
		if (oldNode.childNodes)
			oldNode.childNodes.forEach((node, index) =>
				isUndefined(node.tagName)
					? oldChildren.push(
							node.textContent.toString().replace(/\t|\n/g, "")
					  )
					: oldChildren.push(node)
			)

		// Declare style if style are available
		if (
			typeof oldNode.attributes.style !== "undefined" ||
			typeof newNode.attributes.style !== "undefined"
		)
			difference.attributes = { style: {} }

		if (oldNode.tagName.toUpperCase() !== newNode.tagName.toUpperCase())
			difference.tagName = newNode.tagName

		// Attribute
		if (isUndefined(oldNode.attributes))
			difference.attributes = newNode.attributes
		else if (isUndefined(newNode.attributes)) difference.attributes = {}
		else
			mapObject(newNode.attributes, ([attribute, property]) => {
				// Style property
				if (attribute === "style")
					if (typeof oldNode.attributes.style !== "undefined")
						return applyProperty(
							newNode.attributes.style,
							difference.attributes.style
						)
					else return (difference.attributes.style = property)

				if (
					isUndefined(oldNode.attributes[attribute]) ||
					property !== oldNode.attributes[attribute]
				)
					return (difference.attributes[attribute] = property)

				return
			})

		// Children
		if (hasSameChildren(oldChildren, newNode.children))
			newNode.children.forEach((child, index) =>
				isString(oldChildren[index])
					? oldChildren[index] !== child
						? (difference.children[index] = child)
						: null
					: (difference.children[index] = diff(
							oldChildren[index],
							child
					  ))
			)

		return difference
	},
	construct = ({ tagName, attributes, children = [] }) => {
		let vNode = document.createElement(tagName)

		applySensitiveProperty(attributes, vNode)

        children.forEach(child =>
            isString(child)
                ? vNode.appendChild(document.createTextNode(child))
                : vNode.appendChild(construct(child))
        )

		return vNode
	},
	applyDiff = (oldNode, difference) => {
		let vNode,
			{ attributes, children } = difference,
			oldChildren = []

		// Convert DOM nodes to children
		if (oldNode.childNodes)
			oldNode.childNodes.forEach((node, index) =>
				isUndefined(node.tagName)
					? oldChildren.push(
							node.textContent.toString().replace(/\t|\n/g, "")
					  )
					: oldChildren.push(node)
			)

		if (
			!isUndefined(difference.tagName) &&
			oldNode.tagName.toUpperCase() !== difference.tagName.toUpperCase()
		) {
			let newChildren = oldChildren.map((oldChild, index) =>
				isUndefined(difference.children[index]) ||
				oldChild === difference.children[index]
					? oldChildren
					: difference.children[index]
			)
			return oldNode.parentNode.replaceChild(
				construct(
					h(
						[difference.tagName],
						{
							...Object.assign(
								oldNode.attributes,
								difference.attributes
							)
						},
						...newChildren
					)
				),
				oldNode
			)
		}

		vNode = oldNode

		applySensitiveProperty(attributes, vNode)

		difference.children.forEach((newChild, index) =>
			isString(newChild)
				? (vNode.childNodes[index].textContent = newChild)
				: applyDiff(vNode.childNodes[index], newChild)
		)
	},
	render = (vNode, target) =>
		typeof target.children[0] === "undefined"
			? target.appendChild(construct(vNode))
			: applyDiff(
					target.children[0],
					diff(target.children[0], vNode),
					vNode
			  )
