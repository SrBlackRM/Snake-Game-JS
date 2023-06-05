class SnakeGame{
    constructor(width, height){
        this.canvas = document.querySelector("#root")
        this.ctx = this.canvas.getContext("2d")
        this.width = width
        this.height = height
        this.frame = 120
        this.points_cont = 0
        this.score = 0

        this.init()
    }

    init(){
        this.canvas.setAttribute('width', this.width)
        this.canvas.setAttribute('height', this.height)

        this.init_instances()
        this.gameloop()
    }

    init_instances(){
        this.snake = new Snake()
        this.points = new Points()
        this.control = new Control()
    }

    end_instances(){
        delete this.snake
        delete this.points
        delete this.control
    }

    gameloop(){
        setInterval(()=>{
            this.update()
            this.game_rules()
            this.show_score()
        }, 1/this.frame)
    }

    update(){
        this.snake.move_snake(this.control.buttons)
        this.draw_screen()
    }

    draw_screen(){
        this.ctx.clearRect(0, 0, this.width, this.height)
        // draw snake
        this.ctx.drawImage(this.snake.snake_sprite.full_sprite, this.snake.snake_sprite.sprite_cutted_posX, this.snake.snake_sprite.sprite_cutted_posY, this.snake.snake_sprite.full_sprite_larg, this.snake.snake_sprite.full_sprite_alt, this.snake.posX,this.snake.posY,this.snake.snake_sprite.sprite_cutted_size,this.snake.snake_sprite.sprite_cutted_size)
        // body snake
        this.ctx.drawImage(this.snake.snake_body_sprite.full_sprite, this.snake.snake_body_sprite.sprite_cutted_posX, this.snake.snake_body_sprite.sprite_cutted_posY, this.snake.snake_body_sprite.full_sprite_larg, this.snake.snake_body_sprite.full_sprite_alt, this.snake.posX-this.snake.snake_body_sprite.sprite_cutted_size,this.snake.posY,this.snake.snake_body_sprite.sprite_cutted_size,this.snake.snake_sprite.sprite_cutted_size)
        // draw points
        this.ctx.drawImage(this.points.image_points, this.points.posX, this.points.posY, this.points.size_square, this.points.size_square)
    }

    game_rules(){

        if(this.colision_two_objects(this.snake, this.points)){
            this.score += 1
            this.show_score()
            delete this.points
            this.points = new Points()
            
        }

        if(this.colision_scenario(this.snake)){
            this.end_instances()
            this.score = 0
            this.show_score()
            this.init_instances()
        }
    }

    colision_two_objects(obj1, obj2){
        if(
            // colisão pela esquerda
            obj1.posX + obj1.size_square >= obj2.posX
            // colisão por baixo
        &&  obj1.posY <= obj2.posY + obj2.size_square
            // colisão pela direita
        &&  obj1.posX <= obj2.posX + obj2.size_square
            // colisão por cima
        &&  obj1.posY + obj1.size_square >= obj2.posY
        ){
            return true
        }
        return false
    }

    colision_scenario(obj1){
        if(obj1.posY <= 0){ obj1.posY = 0; return true }
        if(obj1.posY >= this.height - obj1.size_square) {obj1.posY = this.height - obj1.size_square; return true}
        if(obj1.posX <= 0) {obj1.posX = 0; return true}
        if(obj1.posX >= this.width - obj1.size_square) {obj1.posX = this.width - obj1.size_square; return true}

        return false
    }

    show_score(){
        let score_text_size = "30px"
        let score_text_family = "serif"
        let score_text_color = "white"
        let score_text = "SCORE: " + this.score
        this.ctx.fillText(score_text, (width / 2) - 25, 50)
        this.ctx.font = score_text_size + " " + score_text_family + " ";
    }
}

class Snake{
    constructor(){
        this.size_square = 30
        this.posX = Math.round((Math.random() * (width - this.size_square - 10)))
        this.posY = Math.round((Math.random() * (height - this.size_square - 10)))
        this.size_unit = 1
        this.incrise_position = 1
        this.velocity = 1
        this.init_sprite()
    }

    init_sprite(){
        // HEAD
        //                                 src,  posx, posy, nmbr_inx, nmbr_iny, square
        this.snake_sprite = new Sprites('snake-graphics.png',4,0,5,4,this.size_square)

        //BODY
        this.snake_body_sprite = new Sprites('snake-graphics.png',4,2,5,4,this.size_square)
    }

    after_feed_incrise_size(){
        //this.size_unit ++
    }

    move_snake(to){
        if( to.up === 1){
            // if(this.posY <= 0) this.posY = 0
            this.snake_sprite.change_sprite(3,0)
            this.posY -= (this.incrise_position * this.velocity)
        }
        if( to.down === 1){
            // if(this.posY >= height - this.size_square) this.posY = height - this.size_square
            this.snake_sprite.change_sprite(4,1)
            this.posY += (this.incrise_position * this.velocity)
        }
        if( to.left === 1){
            // if(this.posX <= 0) this.posX = 0 
            this.snake_sprite.change_sprite(3,1)
            this.posX -= (this.incrise_position * this.velocity)
        }
        if( to.right === 1){
            // if(this.posX >= width - this.size_square) this.posX = width - this.size_square
            this.snake_sprite.change_sprite(4,0)
            this.posX += (this.incrise_position * this.velocity)
        }
    }
}


class Control{
    constructor(){
        this.resetButtons()
        this.button_pressed_event = document.addEventListener('keypress', e => this.handleButtonPressed(e))
    }

    resetButtons(){
        this.buttons = {
            up: 0,
            right: 0,
            left: 0,
            down: 0
        }
    }

    handleButtonPressed(e){
        this.resetButtons()
        if(e.key === "a") this.buttons.left = 1
        if(e.key === "w") this.buttons.up = 1
        if(e.key === "s") this.buttons.down = 1
        if(e.key === "d") this.buttons.right = 1
    }
}

class Sprites{
    constructor(image_src, sprite_cutted_x_inicial, sprite_cutted_y_inicial, number_of_sprites_x, number_of_sprites_y, size_square){
        this.full_sprite = new Image()
        this.full_sprite.src = image_src

        this.sprite_cutted_posX = sprite_cutted_x_inicial
        this.sprite_cutted_posY = sprite_cutted_y_inicial
        this.sprite_cutted_size = size_square
        this.sprite_cutted_total_x = number_of_sprites_x
        this.sprite_cutted_total_y = number_of_sprites_y
        this.full_sprite_larg = this.full_sprite.width / this.sprite_cutted_total_x
        this.full_sprite_alt = this.full_sprite.height / this.sprite_cutted_total_y

        this.load_sprite()
    }

    load_sprite(){
        this.full_sprite.addEventListener('load',()=>
        {    
            
            this.full_sprite_larg = this.full_sprite.width / this.sprite_cutted_total_x
            this.full_sprite_alt = this.full_sprite.height / this.sprite_cutted_total_y
            this.change_sprite(this.sprite_cutted_posX, this.sprite_cutted_posY)
        })
    }

    change_sprite(num_x, num_y){
        this.sprite_cutted_x = num_x
        this.sprite_cutted_y = num_y
        this.sprite_cutted_posX = this.full_sprite_larg * this.sprite_cutted_x
        this.sprite_cutted_posY = this.full_sprite_alt * this.sprite_cutted_y
    }
}

class Points{
    constructor(){
        this.size_square = 30
        this.posX = Math.round((Math.random() * (width - this.size_square - 10)))
        this.posY = Math.round((Math.random() * (height - this.size_square - 10)))
        this.image_points = new Image()
        this.image_points.src = 'maca_points.png'
    }
}

const width = 700
const height = 600
const canvas_context = new SnakeGame(width,height)