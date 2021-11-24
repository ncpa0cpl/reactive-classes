import React from "react";
import {
  reactive,
  ReactiveClassComponent,
} from "../src/reactive-decorator/reactive";

@reactive
export class Component implements ReactiveClassComponent {
  private name: string | undefined;
  private counter: number = 0;

  // @effect(this.name)
  // onCounterChange() {
  //   this.counter += 1;
  // }

  setName(v: string) {
    this.name = v;
  }

  render() {
    return (
      <div>
        <p>Name: {this.name ?? ""}</p>
        <p>Counter: {this.counter}</p>
        <input onChange={({ target: { value } }) => this.setName(value)} />
      </div>
    );
  }
}
