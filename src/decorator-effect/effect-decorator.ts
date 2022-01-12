import type { ReactiveClass } from "..";
import { MetadataKeys } from "../metadata";
import type { DependencyResolver } from "./effect-wrapper";

export function effect<C extends ReactiveClass>(
  deps: DependencyResolver<C>
): any {
  return (prototype: object, key: string | symbol) =>
    Reflect.defineMetadata(MetadataKeys.Effect, deps, prototype, key);
}
