const W = 87;
const A = 65;
const S = 83;
const D = 68;

let playerX = 0;
let playerY = 0;
let playerSize; //Player size
let translateX;
let translateY;
let scaling = 1;
let Speed = 4;
let speedMultiplier = 1;
let credits = 300;
let difficulty = 1;
let healthScaling = 1;
let diffscaling;
let diffStatScale;
const diffImages = [
  ["easy.jpg", null],
  ["medium.jpg", null],
  ["hard.jpg", null]
];
let spawnCooldown = 300;
let spawnPosX;
let spawnPosY;
let NMEs = []; // NME is short for Enemy
let bullets = [];
let xpOrb = [];
let xp = [0, 1000];
let xpSpeed = 0;
let xpScale = 1;
let level = 0;
let score = 0;
let maxHealth = 3;
let health = 3;
let healthScale = 1;
let NMEHealthScale = 1;
let shootCooldown = 60;
let curCooldown = 10;
let bulletsPerShot = 1;
let rounds = 1;
let roundsQued = 0;
let roundTimer = 0;
let bulletMultiplier;
let shootCooldownSpeedScale = 0;
let damageHealthScale = 0;
let pierce = 0;
let spread = 0;
let shootAngle;
let damage = 2;
let damageMultiplier = 1;
let leech = 0;
let leechScale = 0;
let mX; //mouseX
let mY; //mouseY
let pos;
let deathTimer = 0;
let cardChoices = [];
let chosenCard;
let drawingCards = false;
let mouseHeld = false;
let images = [];
let goldImages = [];
let abilityImages = [];
let delta;
let deltaSum = 0;
let invincibility = 0.0;
let invincible = false;
let ability = 0;
let abilityTimer = 0;
let abilityCooldown = 0;
let dash = false;
let spike = false;
let syringe = false;
let dashCoolDown = 0;
let dashDir;
let id = 0;
const numbers = ['4', '8', '1', '5', '1', '6', '2', '3', '4', '2'];
let curSecretNumber = 0;
let cheatsEnabled = false;

const cards = [
  ["rapid fire", "rapidfire.jpg"],
  ["double shot", "doubleshot.jpg"],
  ["healthy", "healthy.jpg"],
  ["reaction time", "reactiontime.jpg"],
  ["calculated shot", "calculatedshot.jpg"],
  ["well rounded", "wellrounded.jpg"]
]; //List of possible upgrades and their associated image
const goldCards = [
  ["lightweight", "lightweight.jpg"],
  ["tank", "tank.jpg"],
  ["vampire", "vampire.jpg"],
  ["shotgun", "shotgun.jpg"],
  ["glass cannon", "glasscannon.jpg"],
  ["pierce", "pierce.jpg"],
  ["magnet", "magnet.jpg"]
];
const abilityCards = [
  ["dash", "dash.jpg"],
  ["spike", "spike.jpg"],
  ["super syringe", "supersyringe.jpg"]
];

class NME {
  constructor(x, y, health, type) {
    this.x = x;
    this.y = y;
    this.health = health;
    this.speed = random(0.9, 1.05);
    this.type = type;
    this.id = id;
    id++;
  }
}

class Bullet {
  constructor(x, y, angle, damage, pierces){
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.damage = damage;
    this.pierces = pierces;
    this.NMEsHit = [];
  }
}

function setup() {
  scaling = min(windowWidth / 1366, windowHeight / 1366); 
  createCanvas(1366*scaling, 1366*scaling);
  // The previous two lines of code create a canvas that fits on the screen that is the same width to height ratio every time. The base width and height are 1366 and 665. The first line finds how big the window width is compared to the base width and the window height compared to the base height and sets scaling to the lower of those two values. The canvas is set to the base values times scaling so that the width to height stays the same but the canvas fits on the screen.
  angleMode(DEGREES);
  rectMode(CENTER);
  imageMode(CENTER);
  textAlign(CENTER);
  noStroke();
  frameRate(60);
  translateX = width/2; 
  translateY = height/2; 
  playerSize = 80*scaling; 
  pos=createVector(0, 0);
  img = loadImage("YouDied.png");
  for (i = 0; i < cards.length; i++) {
    images[i] = loadImage(cards[i][1]); //Loads the images of the upgrades
  }
  for (i = 0; i < goldCards.length; i++) {
    goldImages[i] = loadImage(goldCards[i][1]); //Loads the images of the upgrades
  }
  for (i = 0; i < abilityCards.length; i++) {
    abilityImages[i] = loadImage(abilityCards[i][1]); //Loads the images of the upgrade
  }
  for (i = 0; i < 3; i++) {
    diffImages[i][1] = loadImage(diffImages[i][0]); //Loads the images of the upgrades
  }
  dots = createGraphics(width*3, height*3);
  dots.fill(150);
  dots.noStroke();
  for (let x = 0; x < width*3; x += 160.32*scaling) {
    for (let y = 0; y < height*3; y += 160.32*scaling) {
      dots.ellipse(x, y, 3);
      //console.log(x, y);
    }
  }
}

window.onkeydown= function(e){  
  if(String.fromCharCode(e.keyCode) === numbers[curSecretNumber]){  
      if (curSecretNumber < 9) {
        curSecretNumber++; 
        console.log(curSecretNumber);
      }
      else {cheatsEnabled = true;}
  } 
  else if (String.fromCharCode(e.keyCode) != numbers[curSecretNumber] && String.fromCharCode(e.keyCode) != numbers[curSecretNumber-1]) {
    curSecretNumber = 0;
  }
};  

function draw()　{
  background(230);
  delta = min(deltaTime / (1000/60), 2); //deltaTime is the time since the last frame in milliseconds. 1000/60 is the framerate in frames per second.  
  leechScale = leech/difficulty;
  if(diffscaling != null) { //If the player has already chosen the difficulty
  if (!drawingCards){ //If the player is not drawing cards
    if (health > 0) { //If the player's health is above 0 (is alive)
    deltaSum += delta; //Is the sum of all deltas it is used to track time since the game starts
    if (!dash) {
    if (keyIsDown(W)) {
      if (!keyIsDown(A) && !keyIsDown(D) || keyIsDown(A) && keyIsDown(D)) {
        playerY = max(height*-1.5+playerSize/2, playerY-Speed*speedMultiplier*scaling*delta);
      }
      else if ((keyIsDown(A) && !keyIsDown(D)) || (keyIsDown(D) && !keyIsDown(A))) {
        playerY = max(height*-1.5+playerSize/2, playerY-Speed*.707106*scaling*delta*speedMultiplier);
      }
    } //When the player is holding down w, the player moves up. If the player is holding w and a or d, the player moves up but slower to stop the player from going faster when moving diagonally. There are also a limit to how far up the player can go so that the player can't move up infinitely.
    if (keyIsDown(S)) {
      if (!keyIsDown(A) && !keyIsDown(D) || keyIsDown(A) && keyIsDown(D)) {
        playerY = min(height*1.5-playerSize/2, playerY+Speed*scaling*delta*speedMultiplier);
      }
      else if ((keyIsDown(A) && !keyIsDown(D)) || (keyIsDown(D) && !keyIsDown(A))) {
        playerY = min(height*1.5-playerSize/2, playerY+Speed*.707106*scaling*delta*speedMultiplier);
      }
    }//When the player is holding down s, the player moves down. If the player is holding s and a or d, the player moves down but slower to stop the player from going faster when moving diagonally. There are also a limit to how far down the player can go so that the player can't move down infinitely.
    if (keyIsDown(A)) {
      if (!keyIsDown(W) && !keyIsDown(S) || keyIsDown(W) && keyIsDown(S)) {
        playerX = max(width*-1.5+playerSize/2, playerX-Speed*scaling*delta*speedMultiplier);
      }
      else if ((keyIsDown(W) && !keyIsDown(S)) || (keyIsDown(S) && !keyIsDown(W))) {
        playerX = max(width*-1.5+playerSize/2, playerX-Speed*.707106*scaling*delta*speedMultiplier);
      }
    }//When the player is holding down a, the player moves left. If the player is holding a and w or s, the player moves left but slower to stop the player from going faster when moving diagonally. There are also a limit to how far left the player can go so that the player can't move left infinitely.
    if (keyIsDown(D)) {
      if (!keyIsDown(W) && !keyIsDown(S) || keyIsDown(W) && keyIsDown(S)) {
        playerX = min(width*1.5-playerSize/2, playerX+Speed*scaling*delta*speedMultiplier);
      }
      else if ((keyIsDown(W) && !keyIsDown(S)) || (keyIsDown(S) && !keyIsDown(W))) {
        playerX = min(width*1.5-playerSize/2, playerX+Speed*.707106*scaling*delta*speedMultiplier);
      }
    }//When the player is holding down d, the player moves right. If the player is holding d and w or s, the player moves right but slower to stop the player from going faster when moving diagonally. There are also a limit to how far right the player can go so that the player can't move right infinitely.
    }
    if (dash) {
      playerX = min(max(playerX + dashDir.x*Speed*scaling*delta*speedMultiplier*((abilityTimer*4 + 40)/40), width*-1.5+playerSize/2), width*1.5-playerSize/2);
      playerY = min(max(playerY + dashDir.y*Speed*scaling*delta*speedMultiplier*((abilityTimer*4 + 40)/40), height*-1.5+playerSize/2), height*1.5-playerSize/2);
    }
    translateX = min(max(width/2 - playerX, -width/2-50*scaling), width*1.5+50*scaling);
    translateY = min(max(height/2 - playerY, -height/2-50*scaling), height*1.5+50*scaling);
    translate(translateX, translateY);  //The last 3 lines of code translate the origin to the opposite of the players position. When the origin is moved, so are all objects. When the player moves up, the origin moves down moving everything including the player down. This makes it look like the camera is following the player. The translate coordinates also have mins and maxes to prevent the camera from going past the boundry
    image(dots, 0, 0)
    fill(0);
    rect(width*1.5+50*scaling, 0, 100*scaling, 3*height+100*scaling);
    rect(-width*1.5-50*scaling, 0, 100*scaling, 3*height+100*scaling);
    rect(0, height*1.5+50*scaling, 3*width+100*scaling, 100*scaling);
    rect(0, -height*1.5-50*scaling, 3*width+100*scaling, 100*scaling); //These rectangles show the boundry of the map
    //These 4 rectangles are the borders of the game. They are offscreen at the beginning of the game but if you move then you can see the borders.
    if (!dash && !spike && !syringe) {
      abilityCooldown = max(0, abilityCooldown-delta);
    }
    abilityTimer = max(0, abilityTimer-delta);
    if (abilityTimer > 0) {
      if (ability == 1) {
        dash = true;
      }
      else if (ability == 2) {
        spike = true;
      }
      else if (ability == 3) {
        syringe = true;
        speedMultiplier = 1.25
      }
    } 
    else {
      dash = false;
      spike = false;
      syringe = false;
      speedMultiplier = 1;
      damageMultiplier = 1;
    }
    if (keyIsDown(32)) {
      //console.log(abilityTimer, abilityCooldown);
      if (abilityCooldown <= 0) {  
        if (ability == 1 && ((keyIsDown(W) && !keyIsDown(S)) || (keyIsDown(S) && !keyIsDown(W)) || (keyIsDown(A) && !keyIsDown(D)) || (keyIsDown(D) && !keyIsDown(A)))) {
          abilityTimer = 40;
          abilityCooldown = 30;
          dash = true;
          if (keyIsDown(W) && !keyIsDown(S) && !keyIsDown(A) && !keyIsDown(D)) {
            dashDir = createVector(0, -1);
          }
          if (!keyIsDown(W) && keyIsDown(S) && !keyIsDown(A) && !keyIsDown(D)) {
            dashDir = createVector(0, 1);
          }
          if (!keyIsDown(W) && !keyIsDown(S) && keyIsDown(A) && !keyIsDown(D)) {
            dashDir = createVector(-1, 0);
          }
          if (!keyIsDown(W) && !keyIsDown(S) && !keyIsDown(A) && keyIsDown(D)) {
            dashDir = createVector(1, 0);
          }
          if (keyIsDown(W) && !keyIsDown(S) && keyIsDown(A) && !keyIsDown(D)) {
            dashDir = createVector(-.707, -.707);
          }
          if (keyIsDown(W) && !keyIsDown(S) && !keyIsDown(A) && keyIsDown(D)) {
            dashDir = createVector(.707, -.707);
          }
          if (!keyIsDown(W) && keyIsDown(S) && keyIsDown(A) && !keyIsDown(D)) {
            dashDir = createVector(-.707, .707);
          }
          if (!keyIsDown(W) && keyIsDown(S) && !keyIsDown(A) && keyIsDown(D)) {
            dashDir = createVector(.707, .707);
          }
        }
        else if (ability == 2) {
          abilityTimer = 180;
          abilityCooldown = 1200;
          damageMultiplier = 1.1;
          spike = true;
        }
        else if (ability == 3) {
          abilityTimer = 600;
          abilityCooldown = 600;
          speedMultiplier = 1.25;
          damageMultiplier = 1.5;
          syringe = true;
        }
      }
    }
    if (keyIsDown(69) && cheatsEnabled){
      xp[0] = xp[1];
    }
    mX = mouseX - width/2 -playerX - (translateX-width/2);
    mY = mouseY - height/2 -playerY - (translateY-height/2);
    if (mX > 0 && mY <= 0) {
      shootAngle = atan(mY/mX);
    }
    else if (mX < 0 && mY <= 0) {
      shootAngle = 180 + atan(mY/mX);
    }
    else if (mX < 0 && mY >= 0) {
      shootAngle = 180 + atan(mY/mX);
    }
    else if (mX >=0 && mY > 0) {
      shootAngle = atan(mY/mX);
    } //This is a math formula to find the angle between the mouse, the player and just right of the player. This amount will be how much the rectangle will have to rotate to point towards the mouse
    curCooldown -= delta; //Cooldown between shots decreases every frame
    if (mouseIsPressed && curCooldown <= 0 && !spike) { // If the mouse is down and the shooting cooldown is 0 then a bullet will be created and it will move towards the mouse position
      roundsQued += rounds;
      roundTimer = 0;
    }
    roundTimer = max(0, roundTimer-delta);
    if (roundsQued > 0 && roundTimer <= 0) {
      if (delta >= curCooldown*2) {
        bulletMultiplier = max(floor(delta/curCooldown), 1);
      }
      else {bulletMultiplier = 1;}
      for (i = 0; i < bulletsPerShot*bulletMultiplier; i++) { //Repeats bulletsPerShot times
        pos.set(65*scaling*delta, 0).rotate(shootAngle); //Creates a vector2. Vectors are variables in the format of (x, y) coordinates. This means that they can be rotated around a point.
        //bullets.push([playerX + pos.x, playerY + pos.y, random(shootAngle - min(max(360*spread/2, 2.5*bulletsPerShot-2.5), 80), shootAngle + min(max(360*spread/2, 2.5*bulletsPerShot-2.5), 80))]); //If the spread variable is greater than 0, the bullet angle will be randomized based on spread and the bullets will travel in different directionsStores all the necessary information about the bullet in a list. This information is used later to create the bullets
        bullets.push(new Bullet(playerX + pos.x, playerY + pos.y, random(shootAngle - min(max(360*spread/2, 2.5*bulletsPerShot-2.5), 80), shootAngle + min(max(360*spread/2, 2.5*bulletsPerShot-2.5), 80)), damage, pierce));
        if (!syringe) {
          curCooldown = shootCooldown/(shootCooldownSpeedScale*((Speed*speedMultiplier)/4)+1); //Resets the cooldown
        }
        else {
          curCooldown = shootCooldown/2/(shootCooldownSpeedScale*((Speed*speedMultiplier)/4)+1);;
        }
      }
      roundsQued--;
      roundTimer = 3*5/60*shootCooldown/rounds;
    }
    fill(25, 50, 75);
    for (let i = 0; i < bullets.length; i++) { //This loop will go through all of the bullets stored in the list
      pos.set(7*scaling*delta, 0); //Creates a vector2
      pos = pos.rotate(bullets[i].angle); //Rotates the vector by the angle stored in the array. This will cause the bullet to move towards the point that was clicked
      bullets[i].x += pos.x; //increases the bullet x by the x of the rotated vector
      bullets[i].y += pos.y; //increases the bullet y by the y of the rotated vector
      ellipse(bullets[i].x, bullets[i].y, 20*scaling); //Draws the bullet
      if (bullets[i].x < -1.5*width || bullets[i].x > 1.5 * width || bullets[i].y < -1.5*height || bullets[i].y > 1.5*height) { 
        bullets.splice(i, 1); //if bullet is out of bounds deletes bullet;
        i--; //decreases i so that the loop doesn't skip an index
      }
    }
    translate(playerX, playerY); //sets origin to player position
    rotate(shootAngle); //rotates by shootAngle (towards mouse)
    fill(150);
    if (!spike) {
      rect(playerSize/2, 0, 50*scaling); //draws rectangle that will point towards mouse
    }
    else {
      for(i = 0; i < 4; i++) {
        triangle(27.2340425532*scaling, 27.2340425532*scaling, 27.2340425532*scaling, -27.2340425532*scaling,  (27.2340425532+46.8085106383)*scaling, 0);
        rotate(90);
      }
    }
    rotate(-shootAngle);
    translate(-playerX, -playerY); //resets rotate and translate
    fill(50, 255, 50);
    ellipse(playerX, playerY, playerSize); //Draws the player
    spawnCooldown -= delta; //decreases the time until enemies are spawned
    credits += difficulty; //increases credits by difficulty. When enemies are being spawned, credits are used to decide how many and which types of enemies to spawn
    if (invincibility > 0) {
      invincible = true;
      invincibility = max(invincibility - delta, 0);
    }
    else {
      invincible = false;
    }
    if (spawnCooldown<=0) {
      SpawnEnemies();
    }
    fill(255, 0, 0);
    stroke(2);
    NMELoop: for (let i = 0; i < NMEs.length; i++) {//Goes throught the list of enemies and creates them
      let angle;
      let x = playerX - NMEs[i].x;
      let y = playerY - NMEs[i].y;
      switch(NMEs[i].type) { //Draws enemy based on it's type
        case 1: //Normal enemies
          pos.set(min(2*((difficulty-1)/4+1), 5)*scaling*diffStatScale*delta, 0);
          if (x > 0 && y <= 0) {
            angle = atan(y/x);
          }
          else if (x <= 0 && y < 0) {
            angle = 180 + atan(y/x);
          }
          else if (x < 0 && y >= 0) {
            angle = 180 + atan(y/x);
          }
          else if (x >=0 && y > 0) {
            angle = atan(y/x);
          }
          pos = pos.rotate(angle); //Math formula to rotate the enemy to move it towards the player
          NMEs[i].x += pos.x*NMEs[i].speed;
          NMEs[i].y += pos.y*NMEs[i].speed;
          for (ii = 0; ii < bullets.length; ii++) { //Goes through the list of bullets and checks if the enemy is touching a bullet
            if (bullets[ii].x > NMEs[i].x - 50*scaling && bullets[ii].x < NMEs[i].x+50*scaling && bullets[ii].y > NMEs[i].y - 50*scaling && bullets[ii].y < NMEs[i].y+50*scaling && !bullets[ii].NMEsHit.includes(NMEs[i].id)) {
              health = min(maxHealth, health + max(min(NMEs[i].health, (bullets[ii].damage+damageHealthScale*NMEs[i].health)*damageMultiplier)*leech, 0));
              NMEs[i].health -= (bullets[ii].damage+damageHealthScale*NMEs[i].health)*damageMultiplier; //if the enemy touches the bullet, the enemy takes damage
              if (bullets[ii].pierces > 0) {
                bullets[ii].pierces--; 
                bullets[ii].NMEsHit.push(NMEs[i].id); 
              }
              else {
                bullets.splice(ii, 1); //deletes the bullet
                ii--; //decreases ii so that the loop doesn't skip over a bullet because one was deleted
              }
              if (NMEs[i].health <= 0) { //if enemy health is 0
                xpOrb.push([NMEs[i].x, NMEs[i].y, 450]); //creates xp orb at the enemy position
                NMEs.splice(i, 1); //deletes the enemy
                i--;
                continue NMELoop;
              }
            }
          } 
          if (NMEs[i].x - 50*scaling < playerX && NMEs[i].x+50*scaling > playerX && NMEs[i].y - 50*scaling < playerY && NMEs[i].y+50*scaling > playerY && NMEs[i].health > 0 && !dash) { //if the enemy is close the the player
          if (!spike && !invincible) {  
            health -= 1; //player loses health
            if (diffStatScale == .8) {
              invincibility = max(15, invincibility); 
            } else if (diffStatScale == .85) {
              invincibility = max(5, incivibility);
            }
            invincible = true;
            NMEs.splice(i, 1); //deletes the enemy
            i--;
            continue NMELoop;
          }
          else if (spike) {
            health = min(maxHealth, health + max(NMEs[i].health*leech, 0));
            NMEs[i].health = 0;
            xpOrb.push([NMEs[i].x, NMEs[i].y, 450]); //creates xp orb at the enemy position
            NMEs.splice(i, 1); //deletes the enemy
            i--;
            continue NMELoop;
          }
          else {
            rect(NMEs[i].x, NMEs[i].y, 80*scaling);
          }
        }
          else {
            rect(NMEs[i].x, NMEs[i].y, 80*scaling); // if the enemy doesn't get deleted, draws the enemy
          }
        break;
        case 2: //small enemies
          pos.set(min(5*((difficulty-1)/16+1), 6)*scaling*diffStatScale*delta, 0);
          if (x > 0 && y <= 0) {
            angle = atan(y/x);
          }
          else if (x <= 0 && y < 0) {
            angle = 180 + atan(y/x);
          }
          else if (x < 0 && y >= 0) {
            angle = 180 + atan(y/x);
          }
          else if (x >=0 && y > 0) {
            angle = atan(y/x);
          }
          pos = pos.rotate(angle);
          NMEs[i].x += pos.x*NMEs[i].speed;
          NMEs[i].y += pos.y*NMEs[i].speed;
          for (ii = 0; ii < bullets.length; ii++) {
            if (bullets[ii].x > NMEs[i].x - 25*scaling && bullets[ii].x < NMEs[i].x+25*scaling && bullets[ii].y > NMEs[i].y - 25*scaling && bullets[ii].y < NMEs[i].y+25*scaling && !bullets[ii].NMEsHit.includes(NMEs[i].id)) {
              health = min(maxHealth, health + max(min(NMEs[i].health, (bullets[ii].damage+damageHealthScale*NMEs[i].health)*damageMultiplier)*leech, 0));
              NMEs[i].health -= (bullets[ii].damage+damageHealthScale*NMEs[i].health)*damageMultiplier;
              if (bullets[ii].pierces > 0) {
                bullets[ii].pierces--; 
                bullets[ii].NMEsHit.push(NMEs[i].id); 
              }
              else {
                bullets.splice(ii, 1); //deletes the bullet
                ii--; //decreases ii so that the loop doesn't skip over a bullet because one was deleted
              }
            }
          } 
          if (NMEs[i].health <= 0) {
            xpOrb.push([NMEs[i].x, NMEs[i].y, 500]);
            NMEs.splice(i, 1);
            i--;
          }
          else {
            if (NMEs[i].x - 25*scaling < playerX && NMEs[i].x+25*scaling > playerX && NMEs[i].y - 25*scaling < playerY && NMEs[i].y+25*scaling > playerY && NMEs[i].health > 0 && !dash) {
            if (!spike && !invincible) {
              health -= 0.5;
              if (diffStatScale == .8) {
                invincibility = max(15, invincibility); 
              } else if (diffStatScale == .85) {
                invincibility = max(5, incivibility);
              }
              invincible = true;
              NMEs.splice(i, 1);
              i--;
              continue NMELoop;
            }
            else if (spike) {
              health = min(maxHealth, health + max(NMEs[i].health*leech, 0));
              NMEs[i].health = 0;
              xpOrb.push([NMEs[i].x, NMEs[i].y, 500]); //creates xp orb at the enemy position
              NMEs.splice(i, 1); //deletes the enemy
              i--;
              continue NMELoop;
            }
            else {
              rect(NMEs[i].x, NMEs[i].y, 30*scaling);
            }
          }
            else {
              rect(NMEs[i].x, NMEs[i].y, 30*scaling);
            }
          }
        break;
        case 3: // big enemies
          //console.log(NMEs[i].health);
          pos.set(min(1*((difficulty-1)/4+1), 4)*scaling*diffStatScale*delta, 0);
          if (x > 0 && y <= 0) {
            angle = atan(y/x);
          }
          else if (x <= 0 && y < 0) {
            angle = 180 + atan(y/x);
          }
          else if (x < 0 && y >= 0) {
            angle = 180 + atan(y/x);
          }
          else if (x >=0 && y > 0) {
            angle = atan(y/x);
          }
          pos = pos.rotate(angle);
          NMEs[i].x += pos.x*NMEs[i].speed;
          NMEs[i].y += pos.y*NMEs[i].speed;
          for (ii = 0; ii < bullets.length; ii++) {
            if (bullets[ii].x > NMEs[i].x - 90*scaling && bullets[ii].x < NMEs[i].x+90*scaling && bullets[ii].y > NMEs[i].y - 90*scaling && bullets[ii].y < NMEs[i].y+90*scaling && !bullets[ii].NMEsHit.includes(NMEs[i].id)) {
              health = min(maxHealth, health + max(min(NMEs[i].health, (bullets[ii].damage+damageHealthScale*NMEs[i].health)*damageMultiplier)*leech, 0));
              NMEs[i].health -= (bullets[ii].damage+damageHealthScale*NMEs[i].health)*damageMultiplier;
              if (bullets[ii].pierces > 0) {
                bullets[ii].pierces--; 
                bullets[ii].NMEsHit.push(NMEs[i].id); 
              }
              else {
                bullets.splice(ii, 1); //deletes the bullet
                ii--; //decreases ii so that the loop doesn't skip over a bullet because one was deleted
              }
            }
          } 
          if (NMEs[i].health <= 0) {
            xpOrb.push([NMEs[i].x, NMEs[i].y, 3000]);
            NMEs.splice(i, 1);
            i--;
          }
          else {
            if (NMEs[i].x - 90*scaling < playerX && NMEs[i].x+90*scaling > playerX && NMEs[i].y - 90*scaling < playerY && NMEs[i].y+90*scaling > playerY && NMEs[i].health > 0 && !dash) {
            if (!spike && !invincible) {
              health -= 1;
              if (diffStatScale == .8) {
                invincibility = max(15, invincibility); 
              } else if (diffStatScale == .85) {
                invincibility = max(5, incivibility);
              }
              invincible = true;
              NMEs.splice(i, 1);
              i--;
              continue NMELoop;
            }
            else {
              rect(NMEs[i].x, NMEs[i].y, 160*scaling);
            }
          }
            else {
              rect(NMEs[i].x, NMEs[i].y, 160*scaling);
            }
          }
        break;
      }
    }
    noStroke();
    for (i = 0; i < xpOrb.length; i++) { //goes through the list of xp orbs
      if (xpSpeed > 0) {
        let x = playerX - xpOrb[i][0];
        let y = playerY - xpOrb[i][1];
        let angle;
        pos.set(xpSpeed*scaling*delta, 0);
        if (x > 0 && y <= 0) {
          angle = atan(y/x);
        }
        else if (x <= 0 && y < 0) {
          angle = 180 + atan(y/x);
        }
        else if (x < 0 && y >= 0) {
          angle = 180 + atan(y/x);
        }
        else if (x >=0 && y > 0) {
          angle = atan(y/x);
        }
        pos = pos.rotate(angle); //Math formula to rotate the enemy to move it towards the player
        xpOrb[i][0] += pos.x;
        xpOrb[i][1] += pos.y;
      }
      if (playerX+40*scaling > xpOrb[i][0]-10*scaling && playerX-40*scaling < xpOrb[i][0]+10*scaling && playerY+40*scaling > xpOrb[i][1]-10*scaling && playerY-40*scaling < xpOrb[i][1]+10*scaling) { //checks if the player is touching the orb
        score += xpOrb[i][2]*diffStatScale*xpScale; //increases score, score increases by less if you are playing on an easier difficulty
        xp[0] += xpOrb[i][2]*xpScale; //increases xp
        health = min(maxHealth, health + max(xpOrb[i][2]*leech*.05, 0)); //increases health
        xpOrb.splice(i, 1); //deletes orb
        i--;
      }
      else {
        fill(50, 240, 255);
        ellipse(xpOrb[i][0], xpOrb[i][1], 20*scaling); //draws xp orb
      }
    }
    difficulty = pow(diffscaling, deltaSum); //difficulty increases by diffscaling so that the difficulty goes up exponentially
    NMEHealthScale += delta/600*diffStatScale;
    if (xp[0] >= xp[1]) { //if current xp in level is greater than amount needed to level up
      level ++;
      xp[0] -= xp[1]; //current xp in level decreases by amount needed to level up
      xp[1] *= 1.4; // amount of xp needed to level up increases
      health = min(health+1,maxHealth); // health increases by 1 if health is less than max health
      mouseHeld = true; //This bool stops the player from accidentally selecting a card
      drawingCards = true; //when drawing cards is active, the game pauses and the player gets to choose a bonus, card choosing starts at line 247
    }
    translate(-translateX, -translateY); //resets translation so that 0, 0 is in the corner again
    fill (150);
    stroke(4*scaling);
    rect(width/2, 40*scaling, width-70*scaling, 54*scaling); // creates rectangle for xp bar
    fill(50, 240, 255);
    noStroke();
    rect(35*scaling + xp[0]/xp[1]*(width-70*scaling)/2, 40*scaling, xp[0]/xp[1]*(width-74*scaling), 50*scaling); //blue bar fills up as xp increases, the player will get a bonus when the bar is full
    fill (150);
    stroke(4*scaling);
    rect(250*scaling, height-50*scaling,  404*scaling, 64*scaling); //creates rectangle for health bar
    fill(255, 0, 0);
    noStroke();
    rect(50*scaling + health/maxHealth*200*scaling, height-50*scaling, health/maxHealth*400*scaling, 60*scaling); //red bar represents current health divided by max health
    if (ability != 0) {
      fill (150);
      stroke(4*scaling);
      rect(250*scaling, height-100*scaling,  404*scaling, 25*scaling); //creates rectangle for ability bar
      fill(50, 50, 255);
      noStroke();
      if (ability == 2 && !spike) {
        rect(50*scaling + (1200-abilityCooldown)/1200*200*scaling, height-100*scaling, (1200-abilityCooldown)/1200*400*scaling, 25*scaling);
      }
      else if (ability == 1 && !dash) {
        rect(50*scaling + (30-abilityCooldown)/30*200*scaling, height-100*scaling, (30-abilityCooldown)/30*400*scaling, 25*scaling);
      }
      else if (ability == 3 && !syringe) {
        rect(50*scaling + (600-abilityCooldown)/600*200*scaling, height-100*scaling, (600-abilityCooldown)/600*400*scaling, 25*scaling);
      }
      else if (dash) {
        rect(50*scaling + abilityTimer/40*200*scaling, height-100*scaling, abilityTimer/40*400*scaling, 25*scaling);
      }
      else if (spike) {
        rect(50*scaling + abilityTimer/180*200*scaling, height-100*scaling, abilityTimer/180*400*scaling, 25*scaling);
      }
      else if (syringe) {
        rect(50*scaling + abilityTimer/600*200*scaling, height-100*scaling, abilityTimer/600*400*scaling, 25*scaling);
      }
    }
      textSize(50*scaling);
      fill(0);
      text("LVL: " + level, width - 110*scaling, 150*scaling); //Shows my name in the bottom right corner
    }
  else { //If the player is dead
    deathTimer += delta; 
    if (deathTimer < 300) {
      tint(255, min(deathTimer*2, 255));
      image(img, width/2, height/2, width, height/10);//shows death image that fades in
    }
    else {
      fill(0, 0, 0, 255);
      textSize(100*scaling);
      text("Score: " + score, width/2, height/2) //displays score
      }
    }
  }
  else {
    for (i = 0; i < 3; i++) //this loop will randomly pick 3 cards for the player to choose from
  {
    if (cardChoices[i] == null) { //if there are no cards displayed yet
      if (level == 5) {
        cardChoices[i] = i;
      }
      else if (level % 5 != 0 && level != 1) {
        cardChoices[i] = ceil(random(cards.length))-1;
      } //randomly selects a card from the list of cards
      else {
        cardChoices[i] = ceil(random(goldCards.length))-1;
      }
    }
    if (level == 5) {
      image(abilityImages[i], (i*(width-50*scaling)/3)+25*scaling + 421/2*scaling, height/2, 421*scaling, 582*scaling)
    }
    else if (level % 5 != 0 && level != 1) {
      image(images[cardChoices[i]], (i*(width-50*scaling)/3)+25*scaling + 421/2*scaling, height/2, 421*scaling, 582*scaling); // creates the image of the card
    }
    else {
      image(goldImages[cardChoices[i]], (i*(width-50*scaling)/3)+25*scaling + 421/2*scaling, height/2, 421*scaling, 582*scaling);
    }
  }
  if (mouseHeld) {
    mouseHeld = mouseIsPressed; //This is to stop the player from accidentally selecting a card. The player won't be allowed to choose a card until they stop holding the mouse down
  }
  if (chosenCard == null){ //if the player hasn't picked a card yet
    if (!mouseHeld) {
    if (mouseX > 25*scaling && mouseX < 446*scaling && mouseY > height/2-582/2*scaling && mouseY < (height/2+582/2*scaling))
    {
      if (mouseIsPressed)
      {
        chosenCard = cardChoices[0]; //if the player clicks on the first card, chosen card will be set to the corresponding card number
      } 
    }
    if (mouseX > width/2-421/2*scaling && mouseX < width/2+421/2*scaling && mouseY > height/2-582/2*scaling && mouseY < (height/2+582/2*scaling))
    {
      if (mouseIsPressed)
      {
        chosenCard = cardChoices[1];//if the player clicks on the second card, chosen card will be set to the corresponding card number
      }
    }
    if (mouseX < width-25*scaling && mouseX > width-446*scaling && mouseY > height/2-582/2*scaling && mouseY < (height/2+582/2*scaling))
    {
      if (mouseIsPressed)
      {
        chosenCard = cardChoices[2];//if the player clicks on the third card, chosen card will be set to the corresponding card number
      }
    } }
  }
    if (chosenCard != null) { //if the card has been chosen
      if (level == 5) {
        switch (chosenCard) {
          case 0:
            ability = 1;
            break;
          case 1:
            ability = 2;
            break;
          case 2:
            ability = 3;
            break;
        }
      }
      else if (level % 5 != 0 && level != 1) {
      switch (chosenCard) {
        case 0: //if the card is rapid fire
          shootCooldown /= 4; //shoot 4 times as often
          damage /= 2; //1/2 of the damage
          spread += .15; //bullets spread out
          break;
        case 1: //card is double shot
          shootCooldown *= 1.15; //shoot slower
          bulletsPerShot *=2; // shoot 2 bullets at a time
          spread += .1; //bullets spread out
          break;
        case 2: // card is healthy
          maxHealth += 3*healthScale; //increases max health
          health = maxHealth; //sets health to max health
          break;
        case 3: // card is reaction time
          Speed *= 1.3; //move faster
          shootCooldown /= 1.25; //shoot faster
          break;
        case 4: //card is calculated shot
          damage *= 2.5; //three times the damage
          shootCooldown *= 1.25; //shoot slower
          spread -= .2; //bullets spread out less
          break
        case 5: //card is well rounded
          damage *= 1.5;
          maxHealth += 1*healthScale;
          health += 1*healthScale;
          Speed *= 1.15; //move faster
      }}
      else {
        switch (chosenCard) {
          case 0: //if the card is lightweight
            maxHealth *= .75; 
            health = min(maxHealth, health)
            Speed *= 1.5; 
            shootCooldown /= 1.5;
            healthScale *= .75;
            shootCooldownSpeedScale += 1;
            break;
          case 1: //card is tank
            maxHealth *= 5;
            health *= 5;
            Speed *= .75;
            shootCooldown *= 1.1;
            damage *= 3;
            healthScale *= 5;
            break;
          case 2: // card is vampire
            maxHealth *= 2;
            health *= 2;
            leech += .05;
            healthScale *= 2;
            damageHealthScale += .2;
            break;
          case 3: // card is shotgun
            bulletsPerShot *= 4;
            shootCooldown *= 3; 
            rounds += 2;
            damage *= .85;
            break;
          case 4: //card is glass cannon
            damage *= 2; //double damage
            maxHealth /= 2; //half health
            health = maxHealth; //sets health to max health
            shootCooldown /= 1.1; //shoot faster
            Speed *= 1.1; //move faster
            healthScale /= 2; //This means that every time your max health increases you will get half as much more max health
            break;
          case 5: //card is pierce
            pierce += 2;
            damage *= 1.5;
            break;
          case 6: //card is magnet
            xpSpeed += 1.5;
            xpScale *= 1.25
        }
      }
      chosenCard = null;
      drawingCards = false;
      cardChoices = [null, null, null];
    }
  }
  }
  else { //Choose difficulty
    for (i = 0; i < 3; i++) 
    {
      image(diffImages[i][1], (i*(width-50*scaling)/3)+25*scaling + 424/2*scaling, height/2, 424*scaling, 132*scaling); //creates the images for choosing difficulty
    }
    if (mouseX > 25*scaling && mouseX < 449*scaling && mouseY > height/2-132/2*scaling && mouseY < (height/2+132/2*scaling)) //if easy is chosen
    {
      if (mouseIsPressed)
      {
        diffscaling = 1.0002; //Difficulty multiplies by 1.00015 60 times each second
        diffStatScale = .85; //Multiplies all of the stats of the enemies by .85
      }
    }
    if (mouseX > width/2-424/2*scaling && mouseX < width/2+424/2*scaling && mouseY > height/2-132/2*scaling && mouseY < (height/2+132/2*scaling)) //if medium is chosen
    {
      if (mouseIsPressed)
      {
        diffscaling = 1.00025;//Difficulty multiplies by 1.0002 60 times each 
        diffStatScale = .925; //Multiplies all of the stats of the enemies by .9
      }
    }
    if (mouseX < width-25*scaling && mouseX > width-449*scaling && mouseY > height/2-132/2*scaling && mouseY < (height/2+132/2*scaling)) //if hard is chosen
    {
      if (mouseIsPressed)
      {
        diffscaling = 1.00035; //Difficulty multiplies by 1.00035 60 times each second
        diffStatScale = 1; //Multiplies all of the stats of the enemies by 1
      }
    } 
  }
}

function SpawnEnemies() {
  while (credits > 450) { //Keeps spawning enemies until there isn't enough credits to spawn any
    switch(ceil(credits > 1500 ? random(3) : credits > 1000? random(2) : 1)) { //Chooses between 3 types of enemies
      case 1: //Normal enemies
        spawnPosX = random(-.4, .4);
        spawnPosY = random(-.35, .35);
        switch(ceil(random(4))) //Chooses random number 1 to 4 and spawns enemies on the side of the screen corresponding to that number
        {
          case 1: //Spawn enemy on top edge of screen
              if (playerY - 80*scaling - height/2 > -1.5*height) {
                  NMEs.push(new NME(-1*(translateX-width/2)+spawnPosX*width, min(playerY-height/2-40*scaling, height/2-40*scaling), 5*((NMEHealthScale-1)/1.5+1)*diffStatScale, 1));
                }
              else { //Spawns enemy on bottom edge of screen if top edge is outside of border
                  NMEs.push(new NME(-1*(translateX-width/2)+spawnPosX*width, max(playerY+height/2+40*scaling, -height/2+40*scaling), 5*((NMEHealthScale-1)/1.5+1)*diffStatScale, 1));
                }
            break;
            case 2: //Spawns enemy on left side of screen
              if (playerX - 80*scaling - width/2 > -1.5*width) {
                  NMEs.push(new NME(min(playerX-width/2-40*scaling, width/2-40*scaling), -1*(translateY-height/2)-spawnPosY*width, 5*((NMEHealthScale-1)/1.5+1)*diffStatScale, 1));
                }
              else { //Spawns enemy on right side of screen if left side is out of bounds
                  NMEs.push(new NME(max(playerX+width/2+40*scaling, -width/2+40*scaling), -1*(translateY-height/2)-spawnPosY*height, 5*((NMEHealthScale-1)/1.5+1)*diffStatScale, 1));
                }
            break;
            case 3: //Spawns enemey at bottom of screen
              if (playerY + 80*scaling +height/2 < 1.5*height) {
                  NMEs.push(new NME(-1*(translateX-width/2)+spawnPosX*width, max(playerY+height/2+40*scaling, -height/2+40*scaling), 5*((NMEHealthScale-1)/1.5+1)*diffStatScale, 1));
                }
              else { //Spawns enemy at top of screen if the bottom is outside of the border
                  NMEs.push(new NME(-1*(translateX-width/2)+spawnPosX*width, min(playerY-height/2-40*scaling, height/2-40*scaling), 5*((NMEHealthScale-1)/1.5+1)*diffStatScale, 1));
                }
            break;
            case 4: //Spawns enemy at the right side of the screen
              if (playerX + 80*scaling + width/2 < 1.5*width) {
                  NMEs.push(new NME(max(playerX+width/2+40*scaling, -width/2+40*scaling), -1*(translateY-height/2)-spawnPosY*height, 5*((NMEHealthScale-1)/1.5+1)*diffStatScale, 1));
                }
              else { //Spawns enemy at left side of the screen if right side is out of bounds
                  NMEs.push(new NME(min(playerX-width/2-40*scaling, width/2-40*scaling), -1*(translateY-height/2)-spawnPosY*height, 5*((NMEHealthScale-1)/1.5+1)*diffStatScale, 1))
                }
            break;
        }
        credits -= 450; //spends 450 credits
        break;
      case 2: //Small, fast enemies
        spawnPosX = random(-.45, .45);
        spawnPosY = random(-.45, .45);
        switch(ceil(random(4))) //Chooses random number 1 to 4 and spawns enemies on the side of the screen corresponding to that number
        {
          case 1: //Spawn enemy on top edge of screen
              if (playerY - 80*scaling - height/2 > -1.5*height) {
                  NMEs.push(new NME(-1*(translateX-width/2)+spawnPosX*width, min(playerY-height/2-40*scaling, height/2-40*scaling)));
                }
              else { //Spawns enemy on bottom edge of screen if top edge is outside of border
                  NMEs.push(new NME(-1*(translateX-width/2)+spawnPosX*width, max(playerY+height/2+40*scaling, -height/2+40*scaling), 1*((NMEHealthScale-1)+1)*diffStatScale, 2));
                }
            break;
            case 2: //Spawns enemy on left side of screen
              if (playerX - 80*scaling - width/2 > -1.5*width) {
                  NMEs.push(new NME(min(playerX-width/2-40*scaling, width/2-40*scaling), -1*(translateY-height/2)-spawnPosY*width, 1*((NMEHealthScale-1)+1)*diffStatScale, 2));
                }
              else { //Spawns enemy on right side of screen if left side is out of bounds
                  NMEs.push(new NME(max(playerX+width/2+40*scaling, -width/2+40*scaling), -1*(translateY-height/2)-spawnPosY*height, 1*((NMEHealthScale-1)+1)*diffStatScale, 2));
                }
            break;
            case 3: //Spawns enemey at bottom of screen
              if (playerY + 80*scaling +height/2 < 1.5*height) {
                  NMEs.push(new NME(-1*(translateX-width/2)+spawnPosX*width, max(playerY+height/2+40*scaling, -height/2+40*scaling), 1*((NMEHealthScale-1)+1)*diffStatScale, 2));
                }
              else { //Spawns enemy at top of screen if the bottom is outside of the border
                  NMEs.push(new NME(-1*(translateX-width/2)+spawnPosX*width, min(playerY-height/2-40*scaling, height/2-40*scaling), 1*((NMEHealthScale-1)+1)*diffStatScale, 2));
                }
            break;
            case 4: //Spawns enemy at the right side of the screen
              if (playerX + 80*scaling + width/2 < 1.5*width) {
                  NMEs.push(new NME(max(playerX+width/2+40*scaling, -width/2+40*scaling), -1*(translateY-height/2)-spawnPosY*height, 1*((NMEHealthScale-1)+1)*diffStatScale, 2));
                }
              else { //Spawns enemy at left side of the screen if right side is out of bounds
                NMEs.push(new NME(min(playerX-width/2-40*scaling, width/2-40*scaling), -1*(translateY-height/2)-spawnPosY*height, 1*((NMEHealthScale-1)+1)*diffStatScale, 2));
                }
            break;
        }
        credits -= 1000; //spends 1000 credits
        break;
        case 3: //Big, slow enemies
        spawnPosX = random(-.4, .4);
        spawnPosY = random(-.3, .3);
        switch(ceil(random(4))) //Chooses random number 1 to 4 and spawns enemies on the side of the screen corresponding to that number
        {
          case 1: //Spawn enemy on top edge of screen
              if (playerY - 120*scaling - height/2 > -1.5*height) {
                  NMEs.push(new NME(-1*(translateX-width/2)+spawnPosX*width, min(playerY-height/2-80*scaling, height/2-80*scaling), 12*((NMEHealthScale-1)*2+1)*diffStatScale, 3));
                }
              else { //Spawns enemy on bottom edge of screen if top edge is outside of border
                  NMEs.push(new NME(-1*(translateX-width/2)+spawnPosX*width, max(playerY+height/2+80*scaling, -height/2+80*scaling), 12*((NMEHealthScale-1)*2+1)*diffStatScale, 3));
                }
            break;
            case 2: //Spawns enemy on left side of screen
              if (playerX - 120*scaling - width/2 > -1.5*width) {
                  NMEs.push(new NME(min(playerX-width/2-80*scaling, width/2-80*scaling), -1*(translateY-height/2)-spawnPosY*width, 12*((NMEHealthScale-1)*2+1)*diffStatScale, 3));
                }
              else { //Spawns enemy on right side of screen if left side is out of bounds
                  NMEs.push(new NME(max(playerX+width/2+80*scaling, -width/2+80*scaling), -1*(translateY-height/2)-spawnPosY*height, 12*((NMEHealthScale-1)*2+1)*diffStatScale, 3));
                }
            break;
            case 3: //Spawns enemey at bottom of screen
              if (playerY + 120*scaling +height/2 < 1.5*height) {
                  NMEs.push(new NME(-1*(translateX-width/2)+spawnPosX*width, max(playerY+height/2+80*scaling, -height/2+80*scaling), 12*((NMEHealthScale-1)*2+1)*diffStatScale, 3))
                }
              else { //Spawns enemy at top of screen if the bottom is outside of the border
                  NMEs.push(new NME(-1*(translateX-width/2)+spawnPosX*width, min(playerY-height/2-80*scaling, height/2-80*scaling), 12*((NMEHealthScale-1)*2+1)*diffStatScale, 3));
                }
            break;
            case 4: //Spawns enemy at the right side of the screen
              if (playerX + 120*scaling + width/2 < 1.5*width) {
                  NMEs.push(new NME(max(playerX+width/2+80*scaling, -width/2+80*scaling), -1*(translateY-height/2)-spawnPosY*height, 12*((NMEHealthScale-1)*2+1)*diffStatScale, 3));
                }
              else { //Spawns enemy at left side of the screen if right side is out of bounds
                  NMEs.push(new NME(min(playerX-width/2-80*scaling, width/2-80*scaling), -1*(translateY-height/2)-spawnPosY*height, 12*((NMEHealthScale-1)*2+1)*diffStatScale, 3));
                }
            break;
        }
        credits -= 1500; //spends 1500 credits
        break;
    }
  }
    spawnCooldown = random(240/(1+deltaSum/3000), 420/(1+deltaSum/3000)); //sets timer for 4 to 7 seconds and when timer is up this function will be called and more enemies will be spawned
}
