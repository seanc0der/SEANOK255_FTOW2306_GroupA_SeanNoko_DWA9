// @ts-check

import { getHTML } from "../modules/dom-manipulation.js";

const template = document.createElement("template");

template.innerHTML = /** HTML */ `
    <style>
        * {
            box-sizing: border-box;
        }

        .overlay {
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            border-width: 0;
            box-shadow: 0px 3px 3px -2px rgba(0,0,0,0.2), 0px 3px 4px 0px rgba(0,0,0,0.14), 0px 1px 8px 0px rgba(0,0,0,0.12);
            animation-name: enter;
            animation-duration: 0.6s;
            z-index: 10;
            background-color: rgba(var(--color-light), 1);
        }
        
        @media (min-width: 30rem) {
            .overlay {
            max-width: 30rem;
            left: 0%;
            top: 0;
            border-radius: 8px;;
            }
        }
            
        .overlay__row {
            display: flex;
            gap: 0.5rem;
            margin: 0 auto;
            justify-content: center;
        }
        
        .overlay__button {
            font-family: Roboto, sans-serif;
            background-color: rgba(var(--color-blue), 0.1);
            transition: background-color 0.1s;
            border-width: 0;
            border-radius: 6px;
            height: 2.75rem;
            cursor: pointer;
            width: 50%;
            color: rgba(var(--color-blue), 1);
            font-size: 1rem;
            border: 1px solid rgba(var(--color-blue), 1);
        }
        
        .overlay__button_primary {
            background-color: rgba(var(--color-blue), 1);
            color: rgba(var(--color-force-light), 1);
        }
        
        .overlay__button:hover {
            background-color: rgba(var((var(--color-blue))), 0.2);
        }
        
        
        .overlay__button_primary:hover {
            background-color: rgba(var(--color-blue), 0.8);
            color: rgba(var(--color-force-light), 1);
        }
                    
        .overlay__title {
            padding: 1rem 0 0.25rem;
            font-size: 1.25rem;
            font-weight: bold;
            line-height: 1;
            letter-spacing: -0.1px;
            max-width: 25rem;
            margin: 0 auto;
            color: rgba(var(--color-dark), 0.8)
        }
        
        .overlay__blur {
            width: 100%;
            height: 200px;
            filter: blur(10px);
            opacity: 0.5;
            transform: scale(2);
        }
        
        .overlay__image {
            max-width: 10rem;
            position: absolute;
            top: 1.5m;
            left: calc(50% - 5rem);
            border-radius: 2px;
            box-shadow: 0px 3px 3px -2px rgba(0,0,0,0.2), 0px 3px 4px 0px rgba(0,0,0,0.14), 0px 1px 8px 0px rgba(0,0,0,0.12);
        }
        
        .overlay__data {
            font-size: 0.9rem;
            display: -webkit-box;
            -webkit-line-clamp: 6;
            -webkit-box-orient: vertical;  
            overflow: hidden;
            color: rgba(var(--color-dark), 0.8)
        }
        
        .overlay__data_secondary {
            color: rgba(var(--color-dark), 0.6)
        }
        
        .overlay__content {
            padding: 2rem 1.5rem;
            text-align: center;
            padding-top: 3rem;
        }
        
        .overlay__preview {
            overflow: hidden;
            margin: -1rem;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    </style>

    <dialog class="overlay" data-dialog>
      <div class="overlay__preview"><img class="overlay__blur" data-blur-image src=""/><img class="overlay__image" data-image src=""/></div>
      <div class="overlay__content">
        <h3 class="overlay__title" data-title></h3>
        <div class="overlay__data" data-subtitle></div>
        <p class="overlay__data overlay__data_secondary" data-description></p>
      </div>

      <div class="overlay__row">
        <button class="overlay__button overlay__button_primary" data-close>Close</button>
      </div>
    </dialog>
`;

class BookPreviewDialog extends HTMLElement {
	/** @type {boolean} */
	#open = false;

	/** @type {string} */
	#image;

	/** @type {string} */
	#title;

	/** @type {string} */
	#subtitle;

	/** @type {string} */
	#description;

	#elements = {
		/** @type {HTMLElement | undefined} */
		dialog: undefined,

		/** @type {HTMLElement | undefined} */
		blur: undefined,

		/** @type {HTMLElement | undefined} */
		image: undefined,

		/** @type {HTMLElement | undefined} */
		title: undefined,

		/** @type {HTMLElement | undefined} */
		subtitle: undefined,

		/** @type {HTMLElement | undefined} */
		description: undefined,

		/** @type {HTMLElement | undefined} */
		close: undefined,
	};

	/** @type {ShadowRoot} */
	#shadow = this.attachShadow({ mode: "closed" });

	constructor() {
		super();
		const instance = template.content.cloneNode(true);
		this.#shadow.appendChild(instance);
	}

	connectedCallback() {
		this.open = this.getAttribute("open") !== null;
		this.#image = this.getAttribute("image") || "";
		this.#title = this.getAttribute("title") || "";
		this.#subtitle = this.getAttribute("subtitle") || "";
		this.#description = this.getAttribute("description") || "";

		this.#elements = {
			dialog: getHTML({ dataAttr: "dialog", target: this.#shadow }),
			blur: getHTML({ dataAttr: "blur-image", target: this.#shadow }),
			image: getHTML({ dataAttr: "image", target: this.#shadow }),
			title: getHTML({ dataAttr: "title", target: this.#shadow }),
			subtitle: getHTML({ dataAttr: "subtitle", target: this.#shadow }),
			description: getHTML({ dataAttr: "description", target: this.#shadow }),
			close: getHTML({ dataAttr: "close", target: this.#shadow }),
		};

		const { blur, image, title, subtitle, description, close } = this.#elements;

		if (!(blur instanceof HTMLElement)) {
			throw new Error(`The ${blur} instance is not an HTMLELement type`);
		}
		blur.setAttribute("src", this.#image);

		if (!(image instanceof HTMLElement)) {
			throw new Error(`The ${image} instance is not an HTMLELement type`);
		}
		image.setAttribute("src", this.#image);

		if (!(title instanceof HTMLElement)) {
			throw new Error(`The ${title} instance is not an HTMLELement type`);
		}
		title.textContent = this.#title;

		if (!(subtitle instanceof HTMLElement)) {
			throw new Error(`The ${subtitle} instance is not an HTMLELement type`);
		}
		subtitle.textContent = this.#subtitle;

		if (!(description instanceof HTMLElement)) {
			throw new Error(`The ${description} instance is not an HTMLELement type`);
		}
		description.textContent = this.#description;

		if (!(close instanceof HTMLButtonElement)) {
			throw new Error(`The ${close} instance is not an HTMLButtonElement type`);
		}

		close.addEventListener("click", () => {
			this.open = false;
			this.remove();
		});
	}

	get open() {
		return this.#open;
	}

	/**
	 * Get or set the state of the dialog modal.
	 *
	 * @param {Boolean} newBoolValue - The current state of the dialog open attribute.
	 */
	set open(newBoolValue) {
		const { dialog } = this.#elements;

		if (newBoolValue === this.#open) return;
		this.#open = newBoolValue;

		if (!(dialog instanceof HTMLDialogElement)) {
			throw new Error(
				`The ${dialog} instance is not an HTMLDialogElement type`
			);
		}

		if (this.#open) {
			dialog.showModal();
		} else {
			dialog.close();
		}
	}
}

customElements.define("book-preview-dialog", BookPreviewDialog);

export default BookPreviewDialog;
