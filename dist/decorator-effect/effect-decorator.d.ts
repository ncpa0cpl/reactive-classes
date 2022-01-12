import type { ReactiveClass } from "..";
import type { DependencyResolver } from "./effect-wrapper";
export declare function effect<C extends ReactiveClass>(deps: DependencyResolver<C>): any;
