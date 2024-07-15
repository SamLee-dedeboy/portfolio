import * as d3 from "d3"
d3.selection.prototype.attrAll =
    function(config) {
        Object.keys(config).forEach(attr_key => {
            this.attr(attr_key, config[attr_key])
        })
        return this
    };


export class PageController {
    svg: any;
    data: any[];
    public constructor(svgId: string, data: any[]) {
        this.svg = d3.select(`#${svgId}`)
        this.data = data
    }
    init() {
        // append everything to page to control movement by moving page 
        const page = this.svg.append("g")
            .attr('class', "page")
            .attr("transform", "translate(0,0)")
        
        // append activators for each section
        const activator_paths = page.selectAll("g.activator-path")
                .data(this.data)
                .join("g")
                .attr("class", (d) => d.header)
        let self = this
        activator_paths.each(function(this:any, activator_data:any, stage_index) {
            console.log(activator_data)
            const g = d3.select(this)
            
            // src
            const x = activator_data.src.x - activator_data.src.width/2
            const y = activator_data.src.y
            const src_activator = g.append("rect")
                .attr("class", `activator src`)
                .attr("x", activator_data.src.x - activator_data.src.width/2)
                .attr("y", activator_data.src.y)
                .attr("width", activator_data.src.width)
                .attr("height", activator_data.src.height)
                .attr("fill", "none")
                // .attr("stroke", "black")
                // .attr("transform", `translate(${x}, ${y})`)
            const src_expand = d3.select(".page-container").append("div")
                .attr("class", `expand src`)
                .style("position", "absolute")
                .style("left", activator_data.src.x - activator_data.src.width/2 + "px")
                .style("top", activator_data.src.y + "px")
                .style("width", activator_data.src.width + "px")
                .style("height", activator_data.src.height + "px")
                .style("border", "solid 1px black")

            const src_activator_label = g.append("text")
                .attr("class", "src_label")
                .attr("text-anchor", "middle")
                .attr("dominant-baseline", "middle")
                .attr("x", activator_data.src.x)
                .attr("y", activator_data.src.y + activator_data.src.height/2)
                .text(activator_data.label)

            // turning point
            // const turning_point = g.append("rect")
            //     .attr("class", `activator turning_point`)
            //     .attr("x", activator_data.turning_point.x)
            //     .attr("y", activator_data.turning_point.y)
            //     .attr("width", 10)
            //     .attr("height", 10)

            // // dst
            // const dst_activator = g.append("rect")
            //     .attr("class", `activator dst`)
            //     .attr("x", activator_data.dst.x)
            //     .attr("y", activator_data.dst.y)
            //     .attr("width", activator_data.dst.width)
            //     .attr("height", activator_data.dst.height)
            // const dst_activator_label = g.append("text")
            //     .attr("class", "dst_label")
            //     .attr("text-anchor", "middle")
            //     .attr("x", activator_data.dst.x + activator_data.dst.width/2)
            //     .attr("y", activator_data.dst.y - 10)
            //     .text(activator_data.dst.label)

            
        })

        return

        const section = page.selectAll(`g.section`)
            .data(this.data)
            .join("g")
            .attr("class", "section")

        section.each(function(this: any, section_data: any) {
            const g = d3.select(this)
            g.append("rect")
                .attr('class', "section section-stroke")
                .attr("x", section_data.x)
                .attr("y", section_data.y)
                .attr("width", section_data.width)
                .attr("height", section_data.height)
                .attr("fill", "none")
                .attr("stroke", "black")

            g.selectAll("text")
                .data(section_data.content)
                .join("text")
                    .attr('class', "section section-content")
                    .attr("x", section_data.x)
                    .attr("y", section_data.y)
                    .text(d => d)

        })
        
    }
}