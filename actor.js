
function actor(type,xpos,ypos,xvelocity,yvelocity,img) {
    this.type = type;
    this.xpos = xpos;
    this.ypos = ypos;
    this.velocity = velocity;
    this.img = img;
}

function actor(){
    this.xpos = 0;
    this.ypos = 0;
    this.type = "undefined";
    this.velocity = 0;
    this.img = "undefined";
}

function update(deltaT){
    this.xpos = this.xpos + xvelocity * deltaT;
    this.ypos = this.ypos + yvelocity * deltaT;
}




