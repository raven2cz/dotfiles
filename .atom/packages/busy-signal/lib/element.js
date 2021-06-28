/* @flow */

import type { SignalInternal } from "./types";

const MESSAGE_IDLE = "Idle";

function elementWithText(text, tag = "div") {
  const el = document.createElement(tag);
  el.textContent = text;
  return el;
}

export class SignalElement extends HTMLElement {
  tooltip: ?IDisposable;
  activatedLast: ?number;
  deactivateTimer: ?TimeoutID;

  createdCallback() {
    this.update([], []);
    this.classList.add("inline-block");
  }
  update(
    titles: Array<SignalInternal>,
    history: Array<{ title: string, duration: string }>
  ) {
    this.setBusy(!!titles.length);

    const el = document.createElement("div");
    el.style.textAlign = "left";

    if (history.length) {
      el.append(
        elementWithText("History:", "strong"),
        ...history.map(item =>
          elementWithText(`${item.title} (${item.duration})`)
        )
      );
    }
    if (titles.length) {
      el.append(
        elementWithText("Current:", "strong"),
        ...titles.map(item => {
          const e = elementWithText(item.title);
          if (item.options) {
            e.onclick = item.options.onDidClick;
          }
          return e;
        })
      );
    }

    if (!el.childElementCount) {
      el.textContent = MESSAGE_IDLE;
    }

    this.setTooltip(el);
  }
  setBusy(busy: boolean) {
    if (busy) {
      this.classList.add("busy");
      this.classList.remove("idle");
      this.activatedLast = Date.now();
      if (this.deactivateTimer) {
        clearTimeout(this.deactivateTimer);
      }
    } else {
      // The logic below makes sure that busy signal is shown for at least 1 second
      const timeNow = Date.now();
      const timeThen = this.activatedLast || 0;
      const timeDifference = timeNow - timeThen;
      if (timeDifference < 1000) {
        this.deactivateTimer = setTimeout(
          () => this.setBusy(false),
          timeDifference + 100
        );
      } else {
        this.classList.add("idle");
        this.classList.remove("busy");
      }
    }
  }
  setTooltip(item: HTMLElement) {
    if (this.tooltip) {
      this.tooltip.dispose();
    }
    this.tooltip = atom.tooltips.add(this, { item });
  }
  dispose() {
    if (this.tooltip) {
      this.tooltip.dispose();
    }
  }
}

const element = document.registerElement("busy-signal", {
  prototype: SignalElement.prototype
});

export default element;
