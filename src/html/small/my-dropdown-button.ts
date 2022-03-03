import { Template } from "../util";
import { WebComponent } from "../web-component";

class MyDropdownButton extends WebComponent {
    
    static readonly template = Template.html`

	<style>
		* {
			margin: 0;
			padding: 0;
			font: "comic sans";
			z-index: 10;
		}

		li {
			float: left;
			position: relative;
			list-style: none;
		}
	
		li li {
			width: 200px;
		}

		a {
			display: block;
			text-decoration: none;
			padding: 4px 15px;
			color: white;
			font-size: 12pt;
			font: arial;
		}

		ul {
			background: var(--background-color-1);
			float: left;
			color: white;
			/* -webkit-transition: .9s;
			transition: .9s; */
		}
        
		ul ul {
			position: absolute;
			left: 0;
			top: 100%;
            display: none;
		}
	
		ul ul ul {
			left: 100%;
			top: 0;
		}
	
		li:hover {
			background: var(--background-color-3);
		}
	
		li:hover > ul {
            display: block;
		}
	</style>
	<ul>
		<li>
			<my-button ><slot name="title"></slot>
			</my-button>
			<ul>
				<slot name="items"></slot>
				<li>
					<a>Monotremes</a>
					<ul>
						<li><a>Echidnas</a></li>
						<li><a>Platypus</a></li>
					</ul>
				</li>
				<li>
					<a>Marsupials -> </a>
					<ul>
						<li><a>Opossums</a></li>
						<li><a>Numbats, etc.</a></li>
						<li><a>Bandicoots, etc.</a></li>
						<li><a>Kangaroos, koalas, wombats, etc.</a></li>
					</ul>
				</li>
				<li>
					<a>Placentals</a>
					<p></p>
					<ul>
						<li><a>Primates, ungulates, etc.</a></li>
						<li><a>Anteaters, sloths, etc.</a></li>
						<li><a>Elephants, etc.</a></li>
					</ul>
				</li>
			</ul>
		</li>
	</ul>
    `;
        
    connectedCallback() {
        this.addFrom(MyDropdownButton.template);
        // this.get("dropbtn").addEventListener("click", () => this.onCLick.bind(this));
        
        console.log("TESTING 123")
        this.shadow.querySelectorAll("ul").forEach((el) => {
            console.log(el);
        })
    }  

    onCLick() {
        this.toggle();
    }

    toggle() {
        console.log("click!");
        // if (this.style.display == "none") {
        //     this.style.display = "block";
        // } else {
        //     this.style.display = "none";
        // }
    }
};

customElements.define('my-dropdown-button', MyDropdownButton);

declare global {
    interface HTMLElementTagNameMap {
        "my-dropdown-button": MyDropdownButton;
    }

    interface WindowEventMap {
        // "message": CustomEvent;
    }
}