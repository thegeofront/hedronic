import { Template } from "../util";
import { WebComponent } from "../web-component";

/**
 * Taken from: https://webcomponents.dev/blog/all-the-ways-to-make-a-web-component/
 */
class MyCounter extends WebComponent {
    
    static theTemplate = Template.html`
        <style>
        * {
            font-size: 200%;
        }

        span {
            width: 4rem;
            display: inline-block;
            text-align: center;
        }

        button {
            width: 4rem;
            height: 4rem;
            border: none;
            border-radius: 10px;
            background-color: seagreen;
            color: white;
        }
        </style>
        <button id="dec">-</button>
        <span id="count"></span>
        <button id="inc">+</button>
    `;

    count = 0;

    constructor(
    ) {
        super();
    }

    connectedCallback() {
        this.addFrom(MyCounter.theTemplate);
        this.get('inc').onclick = () => this.inc();
        this.get('dec').onclick = () => this.dec();
        this.update(this.count);
    }

    disconnecedCallback() {
        console.log("poef!");
    }

    inc() {
        this.update(++this.count);
    }

    dec() {
        this.update(--this.count);
    }

    update(count: number) {
        this.get('count').innerHTML = count.toString();
    }
}

customElements.define("my-counter", MyCounter);