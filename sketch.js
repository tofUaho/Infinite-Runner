var PLAY = 1;
var END = 0;
var gameState = PLAY;

var boyImg, boy_collide, boy;
var fieldImg, field, invisbleGround;

var obstaclesGroup, obstacle1, obstacle2, obstacle3;

var score;
var gameOver, reset;
var gameOverImg, restartImg;

function preload(){
    boyImg = loadAnimation("Sprite1.png", "Sprite2.png", "Sprite3.png");
    boy_collide = loadAnimation("Sprite4.png")

    fieldImage = loadImage("field.jpg");

    obsatcle1 = loadImage("obstacle1.jpg");
    obsatcle2 = loadImage("obstacle2.jpg");
    obstacle3 = loadImage("obstacle3.jpg");

    restartImg = loadImage("Restart.png");
    gameOverImg = loadImage("over.png");
}

function setup() {
    createCanvas(500,600);

    field = createSprite(200,180,20,50);
    field.addImage("ground", fieldImage);
    field.x = field.width / 2;

    invisbleGround = createSprite(200, height-140, 400, 10);
    invisbleGround.visible = false;
  
    gameOver = createSprite(400,150);
    gameOver.addAnimation("over",gameOverImg);
    gameOver.scale = 0.5;

    reset = createSprite(400,180);
    reset.addAnimation("PLay",restartImg);
    reset.scale = 0.3;

    boy = createSprite(80, height-145, 20, 50);
    boy.addAnimation("walkCycle", boyImg);
    boy.addAnimation("lose", boy_collide)
    boy.scale = 0.7;

    obstaclesGroup = createGroup();

    boy.setCollider("rectangle", 0, 0, boy.windowHeight, boy.height);
    boy.debug = true

    score = 0;    
}

function draw() {

    background(255);
    text("Score:"+ score, 500, 50);

    gameOver.visible = false;
    reset.visible = false;

    console.log(boy.y)

    if (gameState === PLAY) {
            
        field.velocityX = -(4 + 3* score/100)

        score = score + Math.round(getFrameRate()/30);

        if (field.x < 0) {
         field.x = field.width / 2;
        }

        if(keyDown("space") && boy.y >= 30) {
            boy.velocityY = -12;
        }

        boy.collide(invisbleGround);
        boy.velocityY = boy.velocityY + 0.8;

        spawnObstacles();

        if(obstaclesGroup.isTouching(boy)){
            gameState = END;
        }

    }

    else if (gameState===END) {

        gameOver.visible = true;
        reset.visible = true;

        field.velocityX = 0;
        boy.velocityY = 0;

        boy.changeAnimation("lose", boy_collide);

        obstaclesGroup.setLifetimeEach(-1);
        obstaclesGroup.setVelocityXEach(0);

        if(mousePressedOver(reset)) {
         restart();
        }
    }

    drawSprites();
}


function restart() {
    boy.changeAnimation("walkCycle", boyImg)
    obstaclesGroup.destroyEach();
    score = 0;
    gameState = PLAY;
}


function spawnObstacles(){
    if (frameCount % 60 === 0){
      var obstacle = createSprite(400,height-145,10,40);
      obstacle.velocityX = -(6 + score / 100);

       var rand = Math.round(random(1,3));
       switch(rand) {
         case 1: obstacle.addImage(obstacle1);
                 break;
         case 2: obstacle.addImage(obstacle2);
                 break;
         case 3: obstacle.addImage(obstacle3);
                 break;
         default: break;
       }

       obstacle.scale = 0.5;
       obstacle.lifetime = 300;

       obstaclesGroup.add(obstacle);
       obstacle.debug = true
       //obstacle.setCollider("rectangle", 0, 0, obstacle.windowHeight, obstacle.height);
    }
}   

