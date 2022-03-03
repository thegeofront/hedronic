import { Template } from "../util";
import { WebComponent } from "../web-component";

class MyDropdownButton extends WebComponent {
    
    static readonly template = Template.html`

    <!-- TODO 
    
    1. make it on click , not on hover

    -->

	<style>
		* {
			margin: 0;
			padding: 0;
		}
	
		li {
			float: left;
			position: relative;
			width: 150px;
			list-style: none;
			/* -webkit-transition: .5s;
			transition: .5s; */
		}
	
		a {
			display: block;
			text-decoration: none;
			padding: 2px 15px;
			color: #000;
		}

		ul {
			background: white;
			float: left;
			/* -webkit-transition: .5s;
			transition: .5s; */
		}
        
		ul ul {
			position: absolute;
			left: 0;
			top: 100%;

            display: none;
			/* visibility: hidden; */
			/* opacity: 0; */
		}
	
		ul ul ul {
			left: 100%;
			top: 0;
		}
	
		li:hover, li:hover li {
			background: #ddd;
		}
	
		li li:hover, li li:hover li {
			background: #bbb;
		}
	
		li li li:hover {
			background: #999;
		}
	
		li:hover > ul {
            display: block;
			/* visibility: visible; */
			/* opacity: 1; */
		}
	</style>
	<article>
			<ul>
				<li>
					<a>Mammals</a>
					<ul>
						<li>
							<a>Monotremes</a>
							<ul>
								<li><a href="#">Echidnas</a></li>
								<li><a href="#">Platypus</a></li>
							</ul>
						</li>
						<li>
							<a>Marsupials</a>
							<ul>
								<li><a href="#">Opossums</a></li>
								<li><a href="#">Numbats, etc.</a></li>
								<li><a href="#">Bandicoots, etc.</a></li>
								<li><a href="#">Kangaroos, koalas, wombats, etc.</a></li>
							</ul>
						</li>
						<li>
							<a>Placentals</a>
							<ul>
								<li><a href="#">Primates, ungulates, etc.</a></li>
								<li><a href="#">Anteaters, sloths, etc.</a></li>
								<li><a href="#">Elephants, etc.</a></li>
							</ul>
						</li>
					</ul>
				</li>
			</ul>
	</article>
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