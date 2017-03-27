import * as React from "react";
import { render } from "react-dom";
import * as mobx from "mobx";
import * as mobxReact from "mobx-react";
import './style.scss';
import * as t from "io-ts";
import * as _ from "lazy.js";

const OptimizeTargets = t.union([t.literal("typingSpeed"), t.literal("memorization")], "OptimizeTargets");
type OptimizeTargets = t.TypeOf<typeof OptimizeTargets>;
const optinames: {[t in OptimizeTargets]: string} = {
    "memorization": "Memorization",
    "typingSpeed": "Typing Speed"
};
function* randomInts() {
    const arr = new Int32Array(1);
    while (true) {
        crypto.getRandomValues(arr);
        yield arr[0];
    }
}
function dice(n = 6) {
    return function* () {
        const maxInt = 2 ** 31 - 1;
        for (const int of randomInts()) {
            if (0 <= int && int < maxInt - (maxInt % n)) yield int % n;
        }
    }
}
function range(a: string, b: string) {
    if (a.length > 1 || b.length > 1) throw Error(`range: invalid arguments ${a}, ${b}`);
    const codeA = a.charCodeAt(0);
    const codeB = b.charCodeAt(0);
    if (codeB < codeA) throw Error(`range: codeB < codeA`);
    const codes = [];
    for (let code = codeA; code <= codeB; code++) codes.push(String.fromCharCode(code));
    return codes;
}
@mobxReact.observer
class GUI extends React.Component<{}, {}> {
    @mobx.observable counter = 0;
    @mobx.observable optimizeFor: OptimizeTargets = "memorization";
    @mobx.observable chars = range("a", "z");
    render() {
        return (
            <div>
                <h1>Password Generator</h1>
                <hr />
                <select value={this.optimizeFor} onChange={e => this.optimizeFor = OptimizeTargets.is(e.currentTarget.value) ? e.currentTarget.value : "memorization"}>
                    {OptimizeTargets.types.map(type => type.value).map(v => <option key={v} value={v}>{optinames[v]}</option>)}
                </select>
                <button>Generate</button>
                PW: {_(dice(this.chars.length)).take(10).join("")}
            </div>
        );
    }
}
Object.assign(window, { _, mobx, mobxReact, React, t, GUI, range, dice, randomInts });
render(<GUI />, document.getElementById("app"));