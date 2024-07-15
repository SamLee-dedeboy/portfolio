import * as d3 from "d3"
import { Character, CharacterConfig } from "./Character"
import { PageController} from "./PageController"
import { Background, BackgroundConfig} from "./Background"
let map = {}
let enable_move = true
const LEFT="ArrowLeft", UP="ArrowUp", RIGHT="ArrowRight", DOWN="ArrowDown"
const max_width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
const max_height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
// const margin = {left: 150, right: 150, top: 150, bottom: 150}
const margin = {left: 0, right: 0, top: 0, bottom: 0}
export class Controller {
    svg: any;
    character: Character;
    character_config: CharacterConfig;
    page_controller: PageController;
    svg_config: any;
    background: Background;
    background_config: BackgroundConfig;
    data: any;
    public constructor(svgId, data) {
        this.data = data
        this.svg_config = {
            // width: 1000,
            // height: 1000,
            width: max_width,
            height: max_height,
            size_unit: "px",
        }
        this.background_config = {
            view_width: max_width,
            view_height: max_height,
            canvas_width: this.svg_config.width,
            canvas_height: this.svg_config.height,
            canvas_size_unit: this.svg_config.size_unit,
            margin: margin,
        }
        this.character_config = {
            class: "character",
            cx: max_width/2,
            cy: max_height/2,
            r: 10,
            fill: "white",
            stroke: "red",
            stroke_width: 1,
        }


        this.background = new Background(svgId, this.background_config)
        this.background.init()
        this.page_controller = new PageController(svgId, this.data)
        this.page_controller.init()
        this.character = new Character(svgId, this.character_config)
        this.character.init()
        this.svg = d3.select(`#${svgId}`)
    }

    init() {
        // listen to keyboard 
        map[LEFT] = false
        map[UP] = false
        map[RIGHT] = false
        map[DOWN] = false
        const onkeydown = onkeyup = function(e){
            map[e.key] = e.type == 'keydown';
        }
        d3.select("body")
            .on("keydown", onkeydown)
            .on("keyup", onkeyup)

        let self = this
        const step = () => {
            const offset = 9
            self.moveCharacter(-map[LEFT]*offset + (+map[RIGHT]*offset), -map[UP]*offset + (+map[DOWN]*offset))
            window.requestAnimationFrame(step);
        }
        window.requestAnimationFrame(step);
    }


    moveCharacter(dx, dy, animate_duration=0, callback=() => {}) {
        if(dx === 0 && dy === 0) return
        if(!enable_move && animate_duration==0) return
        const character = this.svg.select(`.${this.character_config.class}`)
        const r = this.character_config.r
        const new_x = parseFloat(character.attr("cx")) + dx 
        const new_y = parseFloat(character.attr("cy")) + dy 
        const screen_coord = SVGToScreen(this.svg.node(), new_x, new_y)
        if(screen_coord.x - r < margin.left || screen_coord.x + r > max_width - margin.right) this.moveBubble(-dx, -dy, animate_duration, callback)
        else if(screen_coord.y - r < margin.top || screen_coord.y + r > max_height - margin.bottom) this.moveBubble(-dx, -dy, animate_duration, callback)
        else character.transition().duration(animate_duration).attr("cx", new_x).attr("cy", new_y).on("end", callback)
        this.checkCollideActivator(new_x, new_y, r)
    }

    moveBubble(dx, dy, animate_duration, callback=() => {}) {
        const page_container = d3.select(".page-container")
        const new_page_x = +page_container.attr("left") + dx
        const new_page_y = +page_container.attr("top") + dy
        page_container
            .attr("left", new_page_x)
            .attr("top", new_page_y)
        page_container.transition().duration(animate_duration)
            .style("left", `${new_page_x}px`)
            .style("top", `${new_page_y}px`)
            .on("end", callback)

        const svg = this.svg
        // move bubble
        const page = svg.select(`.page`)
        const translate_coordinate = page.attr("transform").split("(")[1].slice(0, -1).split(",")
        const new_svg_x = +translate_coordinate[0] + dx
        const new_svg_y = +translate_coordinate[1] + dy
        page.transition().duration(animate_duration)
            .attr("transform", `translate(${new_svg_x}, ${new_svg_y})`)
            .on("end", callback)
    }

    checkCollideActivator(x, y, r) {
        const svg = this.svg
        const self = this
        svg.selectAll(".activator").each(function(this: any) {
            const activator_width = +d3.select(this).attr("width")
            const activator_height = +d3.select(this).attr("height")
            const activator_translate_coord = d3.select(this.parentNode.parentNode).attr("transform").split("(")[1].slice(0, -1).split(",") 
            const activator_x = +activator_translate_coord[0] + +d3.select(this).attr("x") + activator_width/2
            const activator_y = +activator_translate_coord[1] + +d3.select(this).attr("y") + activator_height/2
            const collide = checkCollide({x: x, y: y, r: r}, {x: activator_x, y: activator_y, width: activator_width, height: activator_height})
            if(collide) {
                console.log("collide!")
                const activated = d3.select(this)
                const activated_parent = d3.select(this.parentNode)
                const activator_path_data = activated_parent.data()[0]
                // activated.attr("fill", "red")
                const type = activated.attr("class").split(" ")[1]
                let dst = {x: 0, y: 0}
                const dst_offset = 30
                // const dst_offset = 0
                if(type == "src") {
                    dst.x = activator_path_data.dst.x + activator_path_data.dst.width + dst_offset
                    dst.y = activator_path_data.dst.y + activator_path_data.dst.height + dst_offset
                } else {
                    dst.x = activator_path_data.src.x + activator_path_data.src.width + dst_offset
                    dst.y = activator_path_data.src.y + activator_path_data.src.height + dst_offset
                }
                if(enable_move) {
                    disableMove()
                    self.moveCharacterToSection(dst, activator_path_data.turning_point)
                }
            }

        })
    } 

    moveCharacterToSection(dst, turning_point) {
        const character = this.svg.select(`.${this.character_config.class}`)
        const page_translate = this.svg.select(".page").attr("transform").split("(")[1].slice(0, -1).split(",")
        const cur_x = +character.attr("cx")
        const cur_y = +character.attr("cy")
        const dx = dst.x - cur_x + +page_translate[0]
        const dy = dst.y - cur_y + +page_translate[1]
        this.moveCharacter(dx, dy, 1000, enableMove)
        // // src to turning point
        // const dx1 = turning_point.x - cur_x + +page_translate[0]
        // const dy1 = turning_point.y - cur_y + +page_translate[1]
        // this.moveCharacter(dx1, dy1, 1000, () => {
        //     // turning point to dst as call back
        //     // const dx2 = dst.x - turning_point.x + +page_translate[0] 
        //     // const dy2 = dst.y - turning_point.y + +page_translate[1] 
        //     const dx2 = dst.x - turning_point.x
        //     const dy2 = dst.y - turning_point.y
        //     this.moveCharacter(dx2, dy2, 1000, enableMove)
        // })

    }
}

function disableMove() {
    console.log("move disabled")
    enable_move = false
}
function enableMove() {
    enable_move = true
    console.log("move enabled", enable_move)
}
function SVGToScreen(svgElement, svgX, svgY) {
    let p = svgElement.createSVGPoint()
    p.x = svgX
    p.y = svgY
    return p.matrixTransform(svgElement.getScreenCTM());
}

function checkCollide(circle, rect) {
    const circleDistance_x = Math.abs(circle.x - rect.x);
    const circleDistance_y = Math.abs(circle.y - rect.y);
    if (circleDistance_x > (rect.width/2 + circle.r)) return false; 
    if (circleDistance_y > (rect.height/2 + circle.r)) return false; 

    if (circleDistance_x <= (rect.width/2)) return true; 
    if (circleDistance_y <= (rect.height/2)) return true; 

    const cornerDistance_sq = (circleDistance_x - rect.width/2)**2 +
                        (circleDistance_y - rect.height/2)**2;
    return (cornerDistance_sq <= (circle.r^2));
}