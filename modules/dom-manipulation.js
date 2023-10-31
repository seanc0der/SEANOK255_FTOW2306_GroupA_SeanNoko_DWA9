//@ts-check
/* eslint-disable import/extensions */
import { authors, genres } from "./data.js";

/**
 * Finds and returns the HTML element with the provided data attribute. Throws
 * an error if the element with the specified data attribute is not found.
 *
 * @param {{dataAttr: string}} dataAttribute - The data attribute to search for, including
 * the `data-` prefix.
 * @param {{target?: HTMLElement | ShadowRoot}} [domElement] - The DOM element to query the element from; this refines the DOM search.
 * @returns {HTMLElement | ShadowRoot} - The HTML element with the specified data attribute.
 */
const getHTML = (dataAttribute, domElement = {}) => {
	const { dataAttr } = dataAttribute;
	const { target } = domElement;
	const scope = target || document;
	const element = scope.querySelector(`[${dataAttr}]`);
	const isHTMLOrShadowElement =
		element instanceof HTMLElement || element instanceof ShadowRoot;

	if (!isHTMLOrShadowElement) {
		throw new Error(
			`The element with the data attribute ${target} is not an HTML or Shadow element.`
		);
	}
	return element;
};

// HTML DOM Elements

/**
 * An Object literal which includes all the HTML elements that are referenced in
 * the Javascript script and modules codebase. The elements are structured
 * within sub-Object literals in order to create separation based on the type of
 * function/ purpose they serve in the app. *
 */
const book = {
	header: {
		search: getHTML({ dataAttr: "data-header-search" }),
		settings: getHTML({ dataAttr: "data-header-settings" }),
	},
	list: {
		dialog: getHTML({ dataAttr: "data-list-active" }),
		items: getHTML({ dataAttr: "data-list-item" }),
		message: getHTML({ dataAttr: "data-list-message" }),
		title: getHTML({ dataAttr: "data-list-title" }),
		blur: getHTML({ dataAttr: "data-list-blur" }),
		image: getHTML({ dataAttr: "data-list-image" }),
		subtitle: getHTML({ dataAttr: "data-list-subtitle" }),
		description: getHTML({ dataAttr: "data-list-description" }),
		button: getHTML({ dataAttr: "data-list-button" }),
		close: getHTML({ dataAttr: "data-list-close" }),
	},
	search: {
		dialog: getHTML({ dataAttr: "data-search-overlay" }),
		form: getHTML({ dataAttr: "data-search-form" }),
		title: getHTML({ dataAttr: "data-search-title" }),
		genres: getHTML({ dataAttr: "data-search-genres" }),
		authors: getHTML({ dataAttr: "data-search-authors" }),
		cancel: getHTML({ dataAttr: "data-search-cancel" }),
	},
	settings: {
		dialog: getHTML({ dataAttr: "data-settings-overlay" }),
		form: getHTML({ dataAttr: "data-settings-form" }),
		theme: getHTML({ dataAttr: "data-settings-theme" }),
		cancel: getHTML({ dataAttr: "data-settings-cancel" }),
	},
};

// createBookAttributeHTML

/**
 * Generates a document fragment containing option elements for a collection of
 * genres or authors.
 *
 * @param {Object<string, string>} bookAttributeSource - An object with a
 * collection of either genres or authors.
 * @param {"Genres" | "Authors"} attributeType - The type of book attribute
 * source (`"Genres"` or `"Authors"`).
 * @returns {DocumentFragment} A document fragment containing option elements to
 * be added to the HTML DOM and displayed to the user.
 */
const createBookAttributeHTML = (bookAttributeSource, attributeType) => {
	const bookAttributeFragment = document.createDocumentFragment();
	const firstOptionElement = document.createElement("option");

	firstOptionElement.value = "any";
	firstOptionElement.innerText = `All ${attributeType}`;

	bookAttributeFragment.appendChild(firstOptionElement);

	// eslint-disable-next-line no-restricted-syntax
	for (const [id, name] of Object.entries(bookAttributeSource)) {
		const optionElement = document.createElement("option");

		optionElement.value = id;
		optionElement.innerText = name;
		bookAttributeFragment.appendChild(optionElement);
	}
	return bookAttributeFragment;
};

/* The below lines of code create genres and authors fragments which are then
appended to the HTML DOM when the app loads. 
*/
book.search.genres.appendChild(createBookAttributeHTML(genres, "Genres"));
book.search.authors.appendChild(createBookAttributeHTML(authors, "Authors"));

export { book, getHTML };
