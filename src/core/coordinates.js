import CoordinateList from "../classes/coordinateList.js";
import { out_txt } from "./domElements.js";

const coordinates = new CoordinateList(out_txt);
export default coordinates;
globalThis.coordinates = coordinates;