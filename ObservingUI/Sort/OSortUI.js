import { Button } from "../../components/common/Button.js";
import { Span } from "../../components/Span.js";

export class OSortUI {
    update(object) {
        console.log("OSortUI");
        this.render({ parent: document.getElementById('sort-ui'), data: object });
    }

    async render({ parent, data }) {
        parent.innerHTML = '';
        try {
            const entries = Array.from(data.entries()).reverse();
            for (const [key, value] of entries) {
                new Span({
                    parent,
                    text: `${key} ${value}`,

                })
            }

        } catch (e) {
            console.log(e);
        }
    }
}