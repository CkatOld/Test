let game;
let gameOptions = {

    // hero horizontal speed, in pixels per second
    heroSpeed: 150
}

window.onload = function() {
    let gameConfig = {
        type: Phaser.AUTO,
        backgroundColor: 0x444444,
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            parent: "thegame",
            width: 640,
            height: 480
        },
        physics: {
            default: "arcade",
            arcade: {
                gravity: {
                    y: 0
                }
            }
        },
       scene: playGame
    }
    game = new Phaser.Game(gameConfig);
}
class playGame extends Phaser.Scene{
    constructor(){
        super("PlayGame");
    }
    preload(){
        this.load.tilemapTiledJSON("level", "level.json");
        this.load.image("tile", "tile.png");
        this.load.image("hero", "hero.png");
    }
    create(){

        // creation of "level" tilemap
        this.map = this.make.tilemap({
            key: "level"
        });

        // add tiles to tilemap
        let tile = this.map.addTilesetImage("tileset01", "tile");

        // which layers should we render? That's right, "layer01"
        this.layer = this.map.createStaticLayer("layer01", tile);

        // layer (wall) is enabled for collision
        this.layer.setCollision(1);

        // add the hero sprite and enable arcade physics for the hero
        this.hero = this.physics.add.sprite(260, 376, "hero");

        // make hero bounce
        this.hero.setBounce(1);

        // set hero velocity
        this.hero.setVelocity(gameOptions.heroSpeed * Math.cos(Math.PI / 4), gameOptions.heroSpeed * Math.sin(Math.PI / 4));

        // listener for input
        this.input.on("pointerdown", this.changeDirection, this);

        // set world bounds to allow camera to follow the hero
        this.cameras.main.setBounds(0, 0, 1920, 1440);

        // make the camera follow the hero
        this.cameras.main.startFollow(this.hero);
    }

    // method to make the change direction
    changeDirection(){

        // invert hero y velocity
        this.hero.body.velocity.y *= -1;
    }

    // method to be executed at each frame
    update(){

        // handle collision between hero and tiles
        this.physics.world.collide(this.hero, this.layer);

        // flip hero according to direction
        this.hero.flipX = this.hero.body.velocity.x < 0;
    }
}
