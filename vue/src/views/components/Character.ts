import * as d3 from "d3"
d3.selection.prototype.attrAll =
    function(config) {
        Object.keys(config).forEach(attr_key => {
            this.attr(attr_key, config[attr_key])
        })
        return this
    };
export interface CharacterConfig {
    class: string;
    cx: number;
    cy: number;
    r: number;
    fill: string;
    stroke: string;
    stroke_width: number;

}
export class Character {
    svg: any;
    config: CharacterConfig;
    public constructor(svgId: string, config: CharacterConfig) {
        this.svg = d3.select(`#${svgId}`)
        this.config = config
    }
    init() {
        const character = this.svg.append("circle")
            .attrAll(this.config)

    }
}