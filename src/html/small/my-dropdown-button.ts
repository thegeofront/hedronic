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
			font: var(--font-body);
			font-size: 10pt;
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

		div {
			margin: 10px;
			min-width: 10px;
			min-height: 10px;
		}
	</style>
	<ul>
		<li id="wrapper">
			<my-button ><slot name="title"></slot>
			</my-button>
			<!-- <ul slot="list">
				<li>
					<a>Kaas </a>
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
			</ul> -->
		</li>
	</ul>
    `;
        
	constructor() {
		super()
	}

    connectedCallback() {
        this.addFrom(MyDropdownButton.template);
        // this.get("dropbtn").addEventListener("click", () => this.onCLick.bind(this));
        
        // console.log("TESTING 123")
        // this.shadow.querySelectorAll("ul").forEach((el) => {
        //     console.log(el);
        // })

		let list = this.querySelector(`ul[slot="list"]`);
		if (!list) return; 
		this.get("wrapper").appendChild(list);
		
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