import browserEnv from "browser-env";
import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

browserEnv();

configure({ adapter: new Adapter() });
