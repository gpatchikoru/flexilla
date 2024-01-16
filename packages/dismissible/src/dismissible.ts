import { dismissElement } from "./helpers";
import { DismissibleParams } from "./types";

class Dismissible {
    private dismissibleElement: HTMLElement
    private dismissButtons: HTMLElement[]
    private action: "remove-from-dom" | "hide-from-screen"
    private onDismiss: (() => void) | undefined

    constructor({ dismissibleElement, action, onDissmiss }: DismissibleParams) {
        if (!(dismissibleElement instanceof HTMLElement)) throw new Error("Provided Element not a valid HTMLElement")
        this.dismissibleElement = dismissibleElement
        this.action = action || this.dismissibleElement.dataset.action as "remove-from-dom" | "hide-from-screen" || "hide-from-screen"
        this.dismissButtons = Array.from((dismissibleElement).querySelectorAll("[data-dismiss-btn]"));
        this.onDismiss = onDissmiss
        this.init()
    }

    private hideFromScreen = () => {
        this.dismissibleElement.style.display = "none"
        this.onDismiss?.()
    }

    private removeFromDom = () => {
        this.onDismiss?.()
        this.dismissibleElement.parentNode?.removeChild(this.dismissibleElement)
    }

    dismiss = () => {
        switch (this.action) {
            case "hide-from-screen":
                this.dismissibleElement.setAttribute("aria-hidden", "true")
                dismissElement({
                    dismissibleElement: this.dismissibleElement,
                    callback: this.hideFromScreen
                })
                break;
            default:
                this.dismissibleElement.setAttribute("data-hidden", "")
                this.dismissibleElement.setAttribute("aria-hidden", "true")
                dismissElement({
                    dismissibleElement: this.dismissibleElement,
                    callback: this.removeFromDom
                })
                break;
        }
    }

    private init() {
        for (const dismissButton of this.dismissButtons) {
            dismissButton.addEventListener("click", this.dismiss)
        }
    }
}

export default Dismissible