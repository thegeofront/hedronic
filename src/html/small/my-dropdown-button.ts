import { PayloadEventType } from "../payload-event";
import { Template } from "../util";
import { WebComponent } from "../web-component";

export const AddRounterEvent = new PayloadEventType<(a: HTMLAnchorElement) => void>("addmainmenurouter");

/**
 * NOTE: right now this webcomponent is very specific to being a menu dropdown...
 * TODO: make a more general version :)
 */
class MyDropdownButton extends WebComponent {
    
    static readonly template = Template.html`

	<style>
		* {
			margin: 0;
			padding: 0;
			z-index: 10;
		}

		li, div {
			float: left;
			position: relative;
			list-style: none;
			margin: 10px, 10px;
		}
	
		li li {
			width: 240px;
		}

		a {
			/* display: block; */
			padding: 4px 8px 4px 8px;
			
			text-decoration: none;
			color: var(--default-color-2);
			font: var(--font-body);
			font-size: 10pt;

			display: flex;
			flex-direction: row; 
			justify-content: flex-start;
			gap: 5px;

			cursor: pointer;
		}

		a .icon {
			width: 20px;
			text-align: center;
		}

		a .fill {
			flex-grow:1;
		}

		ul {
			background: var(--background-color-1);
			float: left;
			color: white;
			/* z-index: 20; */
		}
        
		ul ul {
			position: absolute;
			left: 0;
			top: 100%;
			padding-top: 10px;
			padding-bottom: 10px;
            display: none;
			box-shadow: 0 0px 5px 1px #111;
			border-radius: 4px;
			/* z-index: 10; */
		}
	
		ul ul ul {
			left: 100%;
			top: -10px;
		}
	
		li:hover {
			background: white;
		}

		li li:hover {
			background: var(--accent-color-2);
		}
	
		li li:hover > a {
			color: white;
		}

		li:hover > ul {
            display: block;
		}

		/* This delivers a divider */
		div {
			border-top: 1px solid var(--default-color-3);
			margin: 10px;
			min-width: calc(100% - 20px);
			min-height: 1px;
			cursor: default;
		}
	</style>
	<ul>
		<li id="wrapper">
			<my-button id="button"><slot name="title"></slot>
			</my-button>
		</li>
	</ul>
    `;
        
	route: (e: HTMLAnchorElement) => void = (e) => {
		console.log("router not yet hooked up!");
	}

	constructor() {
		super()
	}

    connectedCallback() {
        this.addFrom(MyDropdownButton.template);
        // this.get("dropbtn").addEventListener("click", () => this.onCLick.bind(this));

		// add the list slot to the shadow dom
		let list = this.querySelector(`ul[slot="list"]`);
		if (!list) return; 
		this.get("wrapper").appendChild(list);

		// make all anchor tags call the router
		// for (let a of this.shadow.querySelectorAll('a')) {
		// 	a.addEventListener("click", this.onRouted.bind(this));
		// }
		
		this.listen(AddRounterEvent, this.setRouter.bind(this))
    }  

	setRouter(payload: (a: HTMLAnchorElement) => void) {
		this.route = payload;
	}

	onRouted(ev: MouseEvent) {
		if (!ev.target) return;
		this.route(ev.target as HTMLAnchorElement);
	}
};

customElements.define('my-dropdown-button', MyDropdownButton);