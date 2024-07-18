import * as d3 from "d3"
interface Margin {
    left: number;
    right: number;
    top: number;
    bottom: number
}

export interface BackgroundConfig {
    view_width: number;
    view_height: number;
    canvas_width: number;
    canvas_height: number;
    canvas_size_unit: string;
    margin: Margin;
}

export class Background {
    svg: any;
    config: BackgroundConfig;
    map: any;

    public constructor(svgId: string, config: BackgroundConfig) {
        this.svg = d3.select(`#${svgId}`)
        this.config = config;
    }

    init() {
        this.svg
            .attr("width", this.config.canvas_width + this.config.canvas_size_unit)
            .attr("height", this.config.canvas_height + this.config.canvas_size_unit)
    }

}
