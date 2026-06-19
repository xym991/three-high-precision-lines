import { type Vector3 } from "three";

export default function splitVector3(v: Vector3, high: Vector3, low: Vector3) {
  high.set(Math.fround(v.x), Math.fround(v.y), Math.fround(v.z));
  low.set(v.x - high.x, v.y - high.y, v.z - high.z);
}
