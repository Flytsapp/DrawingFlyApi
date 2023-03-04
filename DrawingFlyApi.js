class FlySurface{
    constructor(surface=document.createElement("canvas"), panX, panY, rot=0, scaleX=0, scaleY=0){
        if(!surface.getContext){
            console.error("The given surface is not a Canvas Element");
            return;
        }
        this.element = surface;
        this.context = surface.getContext("2d");            
        this.asRect = surface.getBoundingClientRect();
        this.pan = [panX, panY];
        this.rotation = rot;
        this.scale = [scaleX, scaleY];
        this.width = this.element.width;
        this.height = this.element.height;
        this.isFlySurface = true;
    }
    
    assignTransforms(translateX=null, translateY=null, rotation=null, scaleX=null, scaleY=null){
        if(translateX==null&&translateY==null&&rotation==null&&scaleX==null&&scaleY==null){
            this.width = this.element.width;
            this.height = this.element.height;
        }else if(translateX==null||translateY==null||rotation==null||scaleX==null||scaleY==null){
            console.error("Any of five paremeters of assignTransforms can't be empty of null until all the paremeters are not null or empty");
        } else{
            this.pan = [translateX, translateY];
            this.rotation = rotation;
            this.scale = [scaleX, scaleY];    
            this.width = this.element.width;
            this.height = this.element.height;        
        }
    }

    transformToCurrent(){
        this.element.style.transform = `translateX(${this.pan[0]}px) translateY(${this.pan[1]}px) scaleX(${this.scale[0]}) scaleY(${this.scale[1]}) rotate(${this.rotation}deg)`;
    }

    clearSurface(){
        this.context.clearRect(0,0,this.height, this.width)
    }

    getCordOnSurface(x, y){
        let cx = x;
        let cy = y;
        let cw = this.element.width;
        let ch = this.element.height;
        let tx = cx;
        let ty = cy;
        tx -= this.pan[0];
        ty -= this.pan[1];
        tx /= this.scale[0];
        ty /= this.scale[1];
        let radius = 0;
        let angle = 0;
        let dx = 0;
        let dy = 0;
        if (cw/2 >= tx) {
            if (ch/2 >= ty) {
                dx = cw / 2 - tx;
                dy = ch / 2 - ty;
            }
            else {
                dx = cw / 2 - tx;
                dy = ty-(ch / 2);
            }
        }
        else {
            if (ch/2 >= ty) {
                dx = tx - (cw / 2);
                dy = ch / 2 - ty;
            }
            else {
                dx = tx - (cw / 2);
                dy = ty-(ch / 2);
            }
        }
        radius = Math.sqrt((dx * dx) + (dy * dy))
        dx=tx-(cw/2)
        dy = ty - (ch / 2)
        angle = Math.atan2(dy, dx)
        angle = angle * 180 / Math.PI
        angle -= this.rotation;
        if (angle < 0) angle += 360
        angle = angle * Math.PI / 180
        tx=(Math.cos(angle)*radius)+cw/2
        ty=(Math.sin(angle)*radius)+ch/2
        return [tx, ty];
    }
}
class FlyBrush{
    static codeOfPen = `init brush;

    context.lineWidth = linewidth;
    context.strokeStyle = currentcolor.asStr;
    var start = datas.prevMousePos;
    var prevdata = context.getImageData(0, 0, surface.width, surface.height);
    var penpoints = [];
    
    mm{
        init mm;
        context.putImageData(prevdata, 0, 0)
        context.beginPath();
        context.moveTo(start[0], start[1]);
        penpoints.push(datas.currentMousePos);
        for(var p of penpoints){
            context.lineTo(p[0], p[1])
        }
        context.stroke();
        context.closePath();
        exit mm;
    }
    
    mu{
        init mu;
        penpoints = [];
        exit mu;
    }
    exit brush;`;
    static codeOfParticles = `init brush;
    context.lineWidth = accessdatas.particlew;
    context.strokeStyle = currentcolor.asStr;
    var x = math.floor(Math.randomInt(0, linewidth)+datas.currentMousePos[0]-(linewidth/2));
    var y = math.floor(Math.randomInt(0, linewidth)+datas.currentMousePos[1]-(linewidth/2));
    context.beginPath();
    context.moveTo(x,y)
    context.lineTo(x+accessdatas.particlew,y+accessdatas.particlew)
    context.stroke();
    context.closePath();
    var times = 0;
    var tdens = 0;
    mm{
        init mm;
        
        pointerloop{
            init pointerloop;
            context.lineWidth = accessdatas.particlew;
            context.strokeStyle = currentcolor.asStr;
            if(accessdatas.particleDensity>=1){
                while(times<=accessdatas.particleDensity){
                    var x = math.floor(Math.randomInt(0, linewidth)+crrPointerPos[0]-(linewidth/2));
                    var y = math.floor(Math.randomInt(0, linewidth)+crrPointerPos[1]-(linewidth/2));
                    context.beginPath();
                    context.moveTo(x,y);
                    context.lineTo(x+accessdatas.particlew,y+accessdatas.particlew);
                    context.stroke();
                    context.closePath();
                    times++;
                }
            } else{
                if(tdens>=1/accessdatas.particleDensity){
                    var x = math.floor(Math.randomInt(0, linewidth)+crrPointerPos[0]-(linewidth/2));
                    var y = math.floor(Math.randomInt(0, linewidth)+crrPointerPos[1]-(linewidth/2));
                    context.beginPath();
                    context.moveTo(x,y);
                    context.lineTo(x+accessdatas.particlew,y+accessdatas.particlew);
                    context.stroke();
                    context.closePath();
                    tdens = 0;
                }
                tdens++;
            }
            times=0;
            
            exit pointerloop;
        }
        
        exit mm;
    }
    
    mu{
        init mu;
        context.lineWidth = linewidth;
        exit mu;
    }
    
    exit brush;`;
    static codeOfBrush = `init brush;

    context.fillStyle = new ColorRGB(
        currentcolor.r, currentcolor.b, currentcolor.b,
        currentcolor.a/(linewidth/4)).asStr;
    context.beginPath();
    context.arc(
        datas.currentMousePos[0], datas.currentMousePos[1],
        linewidth/2, 0, math.PI*2
    );
    context.fill();
    context.closePath();
    
    mm{
        init mm;
        
        pointerloop{
            init pointerloop;

            context.fillStyle = new ColorRGB(
                currentcolor.r, currentcolor.b, currentcolor.b,
                currentcolor.a/(linewidth/4)).asStr;
            
            context.beginPath();
            context.arc(
                crrPointerPos[0], crrPointerPos[1],
                linewidth/2, 0, math.PI*2
            );
            context.fill();
            context.closePath();
            
            exit pointerloop;
        }
        
        exit mm;
    }
    
    mu{
        init mu;
        exit mu;
    }
    
    exit brush;`;
    static codeOfHighlighter = `init brush;
    context.strokeStyle = currentcolor.asStr;
    context.lineWidth = 1;
    var ax = Math.floor(Math.cos(accessdatas.highlighterAngle)*linewidth);
    var ay = Math.floor(Math.sin(accessdatas.highlighterAngle)*linewidth);
    context.beginPath();
    context.moveTo(datas.currentMousePos[0], datas.currentMousePos[1]);
    context.lineTo(datas.currentMousePos[0]+ax, datas.currentMousePos[1]+ay);
    context.stroke();
    context.closePath();
    
    mm{
        init mm;
        pointerloop{
            init pointerloop;
            context.strokeStyle = currentcolor.asStr;
            context.beginPath();
            context.moveTo(crrPointerPos[0], crrPointerPos[1]);
            context.lineTo(crrPointerPos[0]+ax,crrPointerPos[1]+ay);
            context.stroke();
            context.closePath();
            exit pointerloop;
        }
        
        exit mm;
    }
    
    mu{
        init mu;
    
        exit mu;
    }
    exit brush;`;
    static codeOfRoundEraser = `init brush;

    context.initEraser();
    context.beginPath();
    context.arc(datas.currentMousePos[0],datas.currentMousePos[1],linewidth/2,0,Math.PI*2);
    context.fill();
    context.closePath();
    
    mm{
        init mm;
        pointerloop{
            init pointerloop;
            pointerloop{
                init pointerloop;
                
                context.beginPath();
                context.arc(crrPointerPos[0],crrPointerPos[1],linewidth/2,0,Math.PI*2);
                context.fill();
                context.closePath();
                
                exit pointerloop;
            }
    
            exit pointerloop;
        }
        
        exit mm;
    }
    
    mu{
        init mu;
        context.exitEraser();
        exit mu;
    }
    exit brush;`;
    static codeOfRectEraser = `init brush;

    context.initEraser();
    context.beginPath();
    context.rect(datas.currentMousePos[0]-linewidth/2,datas.currentMousePos[1]-linewidth/2,linewidth,linewidth);
    context.fill();
    context.closePath();
    
    mm{
        init mm;
        pointerloop{
            init pointerloop;
            pointerloop{
                init pointerloop;
                
                context.beginPath();
                context.rect(crrPointerPos[0]-linewidth/2,crrPointerPos[1]-linewidth/2,linewidth,linewidth);
                context.fill();
                context.closePath();
                
                exit pointerloop;
            }
    
            exit pointerloop;
        }
        
        exit mm;
    }
    
    mu{
        init mu;
        context.exitEraser();
        exit mu;
    }
    exit brush;`;
    static codeOfRectAlphaSet = `init brush;

    context.setFilledRectAlpha(currentcolor.a,datas.currentMousePos[0]-linewidth/2,datas.currentMousePos[1]-linewidth/2,linewidth,linewidth)
    
    mm{
        init mm;
        pointerloop{
            init pointerloop;
            pointerloop{
                init pointerloop;
                
                context.setFilledRectAlpha(currentcolor.a,crrPointerPos[0]-linewidth/2,crrPointerPos[1]-linewidth/2,linewidth,linewidth);
                                
                exit pointerloop;
            }
    
            exit pointerloop;
        }
        
        exit mm;
    }
    
    mu{
        init mu;
        exit mu;
    }
    exit brush;`;
    static codeOfRoundAlphaSet = `init brush;

    context.setFilledArcAlpha(currentcolor.a,datas.currentMousePos[0],datas.currentMousePos[1],linewidth/2,0,math.PI*2);
    
    mm{
        init mm;
        pointerloop{
            init pointerloop;
            pointerloop{
                init pointerloop;
                
                context.setFilledArcAlpha(currentcolor.a,crrPointerPos[0],crrPointerPos[1],linewidth/2,0,math.PI*2);
                                
                exit pointerloop;
            }
    
            exit pointerloop;
        }
        
        exit mm;
    }
    
    mu{
        init mu;
        exit mu;
    }
    exit brush;`;
    #mouseDatas = {
        prevMousePos: [0,0],
        currentMousePos: [0,0],
        penpoints: [],
        praticleDensity: 1,
        ngco: "source-over"
    };
    #brushFunctions = {
        "": (e, obj)=>{}
    }
    #createNewBrushKeywords = {
        "surface": "obj.surface",
        "context": "obj.surface.context",
        "datas": "obj.#mouseDatas",
        "accessdatas": "obj.accessDatas",
        "linewidth": "obj.#lineWidth",
        "currentcolor": "obj.#colorObject",
        "cord": "surface.getCordOnSurface",
        "clickedkeys": "obj.#clickedKeys",
        "drawshortcut": "obj.shortcut",
        "math": "obj.math",
        "colormath":"Math.color",
        "init mm": "obj.#mouseDatas.currentMousePos = surface.getCordOnSurface(em.clientX, em.clientY)",
        "init mu": 'obj.#mouseDatas.currentMousePos = surface.getCordOnSurface(eu.clientX, eu.clientY)',
        "init brush": '\n!!!!#mds#!!!!\n'+
                    'obj.#mouseDatas.prevMousePos = surface.getCordOnSurface(e.clientX, e.clientY)\n'+
                    'obj.#mouseDatas.currentMousePos = surface.getCordOnSurface(e.clientX, e.clientY)',
        "exit mm": "obj.#mouseDatas.prevMousePos = obj.#mouseDatas.currentMousePos;\n!!!!#mme#!!!!\n",
        "exit mu": 'removeEventListener("!!!!#mm#!!!!", mm );\nremoveEventListener("!!!!#mu#!!!!", mu);\n!!!!#mue#!!!!\n',
        "exit brush": 'addEventListener("!!!!#mm#!!!!", mm );\naddEventListener("!!!!#mu#!!!!", mu);\n!!!!#mde#!!!!\n',
        "mm\\s*\\{": "var mm = em => {\n!!!!#mms#!!!!\n",
        "mu\\s*\\{": "var mu = eu => {\n!!!!#mus#!!!!\n",
        "init pointerloop": "//pointer loop",
        "exit pointerloop": 'crrPointerPos = [crrPointerPos[0]+ix, crrPointerPos[1]+iy];\n'+
                            'if(\n'+
                            '(ix==1)&&(Math.round(crrPointerPos[0])>=Math.round(obj.#mouseDatas.currentMousePos[0]))\n'+
                            ') break\n'+
                            'else if(\n'+
                            '(ix==-1)&&(Math.round(crrPointerPos[0])<=Math.round(obj.#mouseDatas.currentMousePos[0]))\n'+
                            ') break\n'+
                            'else if(\n'+
                            '(iy==1)&&(Math.round(crrPointerPos[1])>=Math.round(obj.#mouseDatas.currentMousePos[1]))\n'+
                            ') break\n'+
                            'else if(\n'+
                            '(iy==-1)&&(Math.round(crrPointerPos[1])<=Math.round(obj.#mouseDatas.currentMousePos[1]))\n'+
                            ') break\n',
        "pointerloop\\s*\\{": 'var dx=obj.#mouseDatas.currentMousePos[0]-obj.#mouseDatas.prevMousePos[0];\n'+
                        'var dy=obj.#mouseDatas.currentMousePos[1]-obj.#mouseDatas.prevMousePos[1];\n'+
                        'let tdx=(dx<0)?-dx:dx;\n'+
                        'let tdy=(dy<0)?-dy:dy;\n'+
                        'let ix = (tdx<tdy) ? (tdx/tdy) : 1;\n'+
                        'let iy = (tdx>tdy) ? (tdy/tdx) : 1;\n'+
                        'ix=dx<0?-ix:ix;\n'+
                        'iy=dy<0?-iy:iy;\n'+
                        'let crrPointerPos = obj.#mouseDatas.prevMousePos;\n'+
                        'while(true){',
    };
    #eventThemeKeywords = {
        md: {
            "ex": "e.clientX",
            "ey": "e.clientY",
            "event": "e"
        },
        mm: {
            "ex": "em.clientX",
            "ey": "em.clientY",
            "event": "em"
        },
        mu: {
            "ex": "eu.clientX",
            "ey": "eu.clientY",
            "event": "eu"
        }
    };
    #eventThemes = {};
    #brushFunctionInUse = "";
    #clickedKeys = [];
    #color = "rgba(0,0,0,1)";
    #colorObject = new ColorRGB(0, 0, 0, 1);
    #lineWidth = 10;
    #etv = {};
    surface=null;
    constructor(surface){
        if(!surface.isFlySurface){
            console.error("surface is not type of FlySurface");
            return null;
        }
        this.surface = surface;
        surface = 
        this.shortcut = [];
        this.accessDatas = {};
        this.math = Math;
        this.getPixelIndexFromData = (idata, x, y) => (((y-1)*idata.width)+x)*4;
        this.surface.context["eraseArc"] = (x, y, radius, sangle, eangle, anticlockwise=false) => {
            let gco = this.surface.context.globalCompositeOperation;
            this.surface.context.globalCompositeOperation = "destination-out";
            this.surface.context.beginPath();
            this.surface.context.arc(x, y, radius, sangle, eangle, anticlockwise);
            this.surface.context.stroke();
            this.surface.context.closePath();
            this.surface.context.globalCompositeOperation = gco;
        }
        this.surface.context["eraseRect"] = (x, y, w, h) => {
            let gco = this.surface.context.globalCompositeOperation;
            this.surface.context.globalCompositeOperation = "destination-out";
            this.surface.context.beginPath();
            this.surface.context.rect(x, y, w, h);
            this.surface.context.stroke();
            this.surface.context.closePath();
            this.surface.context.globalCompositeOperation = gco;
        }
        this.surface.context["eraseFilledArc"] = (x,y,radius,sangle,eangle,anticlockwise=false) => {
            let gco = this.surface.context.globalCompositeOperation;
            this.surface.context.globalCompositeOperation = "destination-out";
            this.surface.context.beginPath();
            this.surface.context.arc(x, y, radius, sangle, eangle, anticlockwise);
            this.surface.context.closePath();
            this.surface.context.fill();
            this.surface.context.globalCompositeOperation = gco;
        }
        this.surface.context["eraseFilledRect"] = (x, y, w, h) => {
            let gco = this.surface.context.globalCompositeOperation;
            this.surface.context.globalCompositeOperation = "destination-out";
            this.surface.context.beginPath();
            this.surface.context.rect(x, y, w, h);
            this.surface.context.closePath();
            this.surface.context.fill();
            this.surface.context.globalCompositeOperation = gco;
        }
        this.surface.context["initEraser"] = () => {
            this.#mouseDatas.ngco = this.surface.context.globalCompositeOperation;
            this.surface.context.globalCompositeOperation = "destination-out";
        }
        this.surface.context["exitEraser"] = () => {
            this.surface.globalCompositeOperation = this.#mouseDatas.ngco;
        }
        this.surface.context["setRectAlpha"] = (a,x,y,w,h) => {
            let idata1 = this.surface.context.getImageData(x, y, w, this.#lineWidth);
            for(var p=3; p<=idata1.data.length; p+=4){
                idata1.data[p] = Math.round(a*255);
            }
            this.surface.context.putImageData(idata1, x, y);
            let idata2 = this.surface.context.getImageData(x, y+h-this.#lineWidth, w, this.#lineWidth);
            for(var p=3; p<=idata2.data.length; p+=4){
                idata2.data[p] = Math.round(a*255);
            }
            this.surface.context.putImageData(idata2, x, y+h-this.#lineWidth);
            let idata3 = this.surface.context.getImageData(x, y+this.#lineWidth, this.#lineWidth, h-(2*this.#lineWidth));
            for(var p=3; p<=idata3.data.length; p+=4){
                idata3.data[p] = Math.round(a*255);
            }
            this.surface.context.putImageData(idata3, x, y+this.#lineWidth);
            let idata4 = this.surface.context.getImageData(x+w-this.#lineWidth, y+this.#lineWidth, this.#lineWidth, h-(2*this.#lineWidth));
            for(var p=3; p<=idata4.data.length; p+=4){
                idata4.data[p] = Math.round(a*255);
            }
            this.surface.context.putImageData(idata4, x+w-this.#lineWidth, y+this.#lineWidth);
        }
        this.surface.context["incRectAlpha"] = (a,x,y,w,h) => {
            let idata1 = this.surface.context.getImageData(x, y, w, this.#lineWidth);
            for(var p=3; p<=idata1.data.length; p+=4){
                idata1.data[p] += Math.round(a*255);
            }
            this.surface.context.putImageData(idata1, x, y);
            let idata2 = this.surface.context.getImageData(x, y+h-this.#lineWidth, w, this.#lineWidth);
            for(var p=3; p<=idata2.data.length; p+=4){
                idata2.data[p] += Math.round(a*255);
            }
            this.surface.context.putImageData(idata2, x, y+h-this.#lineWidth);
            let idata3 = this.surface.context.getImageData(x, y+this.#lineWidth, this.#lineWidth, h-(2*this.#lineWidth));
            for(var p=3; p<=idata3.data.length; p+=4){
                idata3.data[p] += Math.round(a*255);
            }
            this.surface.context.putImageData(idata3, x, y+this.#lineWidth);
            let idata4 = this.surface.context.getImageData(x+w-this.#lineWidth, y+this.#lineWidth, this.#lineWidth, h-(2*this.#lineWidth));
            for(var p=3; p<=idata4.data.length; p+=4){
                idata4.data[p] += Math.round(a*255);
            }
            this.surface.context.putImageData(idata4, x+w-this.#lineWidth, y+this.#lineWidth);
        }
        this.surface.context["decRectAlpha"] = (a,x,y,w,h) => {
            let idata1 = this.surface.context.getImageData(x, y, w, this.#lineWidth);
            for(var p=3; p<=idata1.data.length; p+=4){
                idata1.data[p] -= Math.round(a*255);
            }
            this.surface.context.putImageData(idata1, x, y);
            let idata2 = this.surface.context.getImageData(x, y+h-this.#lineWidth, w, this.#lineWidth);
            for(var p=3; p<=idata2.data.length; p+=4){
                idata2.data[p] -= Math.round(a*255);
            }
            this.surface.context.putImageData(idata2, x, y+h-this.#lineWidth);
            let idata3 = this.surface.context.getImageData(x, y+this.#lineWidth, this.#lineWidth, h-(2*this.#lineWidth));
            for(var p=3; p<=idata3.data.length; p+=4){
                idata3.data[p] -= Math.round(a*255);
            }
            this.surface.context.putImageData(idata3, x, y+this.#lineWidth);
            let idata4 = this.surface.context.getImageData(x+w-this.#lineWidth, y+this.#lineWidth, this.#lineWidth, h-(2*this.#lineWidth));
            for(var p=3; p<=idata4.data.length; p+=4){
                idata4.data[p] -= Math.round(a*255);
            }
            this.surface.context.putImageData(idata4, x+w-this.#lineWidth, y+this.#lineWidth);
        }
        this.surface.context["setFilledRectAlpha"] = (a,x,y,w,h) => {
            let idata = this.surface.context.getImageData(x, y, w, h);
            for(var p=3; p<=idata.data.length; p+=4){
                idata.data[p] = Math.round(a*255);
            }
            this.surface.context.putImageData(idata, x, y);
        }
        this.surface.context["incFilledRectAlpha"] = (a,x,y,w,h) => {
            let idata = this.surface.context.getImageData(x, y, w, h);
            for(var p=3; p<=idata.data.length; p+=4){
                idata.data[p] += Math.round(a*255);
            }
            this.surface.context.putImageData(idata, x, y);
        }
        this.surface.context["decFilledRectAlpha"] = (a,x,y,w,h) => {
            let idata = this.surface.context.getImageData(x, y, w, h);
            for(var p=3; p<=idata.data.length; p+=4){
                idata.data[p] -= Math.round(a*255);
            }
            this.surface.context.putImageData(idata, x, y);
        }
        this.surface.context["setArcAlpha"] = (a, x, y, radius, sangle, eangle) => {
            let idata = this.surface.context.getImageData(x-radius, y-radius, 2*radius, 2*radius);
            for(var r=radius; r>=radius-this.#lineWidth; r--){
                for(var angle=sangle; angle<=eangle; angle+=Math.PI*2*30/(r*360)){
                    var tx=radius+Math.floor(r*Math.cos(angle));
                    var ty=radius+Math.ceil(r*Math.sin(angle))
                    if(!(tx<0||tx>2*radius||ty<0||ty>2*radius)){
                        var d = this.getPixelIndexFromData(idata, tx, ty);
                        idata.data[d+3]=Math.round(a*255);
                    }
                }
            }
            this.surface.context.putImageData(idata, x-radius, y-radius);
        }
        this.surface.context["incArcAlpha"] = (a, x, y, radius, sangle, eangle) => {
            let idata = this.surface.context.getImageData(x-radius, y-radius, 2*radius, 2*radius);
            for(var r=radius; r>=radius-this.#lineWidth; r--){
                for(var angle=sangle; angle<=eangle; angle+=Math.PI*2*30/(r*360)){
                    var tx=radius+Math.floor(r*Math.cos(angle));
                    var ty=radius+Math.ceil(r*Math.sin(angle))
                    if(!(tx<0||tx>2*radius||ty<0||ty>2*radius)){
                        var d = this.getPixelIndexFromData(idata, tx, ty);
                        idata.data[d+3]+=Math.round(a*255);
                    }
                }
            }
            this.surface.context.putImageData(idata, x-radius, y-radius);
        }
        this.surface.context["decArcAlpha"] = (a, x, y, radius, sangle, eangle) => {
            let idata = this.surface.context.getImageData(x-radius, y-radius, 2*radius, 2*radius);
            for(var r=radius; r>=radius-this.#lineWidth; r--){
                for(var angle=sangle; angle<=eangle; angle+=Math.PI*2*30/(r*360)){
                    var tx=radius+Math.floor(r*Math.cos(angle));
                    var ty=radius+Math.ceil(r*Math.sin(angle))
                    if(!(tx<0||tx>2*radius||ty<0||ty>2*radius)){
                        var d = this.getPixelIndexFromData(idata, tx, ty);
                        idata.data[d+3]-=Math.round(a*255);
                    }
                }
            }
            this.surface.context.putImageData(idata, x-radius, y-radius);
        }
        this.surface.context["setFilledArcAlpha"] = (a, x, y, radius, sangle, eangle) => {
            let idata = this.surface.context.getImageData(x-radius, y-radius, 2*radius, 2*radius);
            for(var r=radius; r>=0; r--){
                for(var angle=sangle; angle<=eangle; angle+=Math.PI*2*30/(r*360)){
                    var tx=radius+Math.floor(r*Math.cos(angle));
                    var ty=radius+Math.ceil(r*Math.sin(angle))
                    if(!(tx<0||tx>2*radius||ty<0||ty>2*radius)){
                        var d = this.getPixelIndexFromData(idata, tx, ty);
                        idata.data[d+3]=Math.round(a*255);
                    }
                }
            }
            this.surface.context.putImageData(idata, x-radius, y-radius);
        }
        this.surface.context["incFilledArcAlpha"] = (a, x, y, radius, sangle, eangle) => {
            let idata = this.surface.context.getImageData(x-radius, y-radius, 2*radius, 2*radius);
            for(var r=radius; r>=0; r--){
                for(var angle=sangle; angle<=eangle; angle+=Math.PI*2*30/(r*360)){
                    var tx=radius+Math.floor(r*Math.cos(angle));
                    var ty=radius+Math.ceil(r*Math.sin(angle))
                    if(!(tx<0||tx>2*radius||ty<0||ty>2*radius)){
                        var d = this.getPixelIndexFromData(idata, tx, ty);
                        idata.data[d+3]+=Math.round(a*255);
                    }
                }
            }
            this.surface.context.putImageData(idata, x-radius, y-radius);
        }
        this.surface.context["decFilledArcAlpha"] = (a, x, y, radius, sangle, eangle) => {
            let idata = this.surface.context.getImageData(x-radius, y-radius, 2*radius, 2*radius);
            for(var r=radius; r>=0; r--){
                for(var angle=sangle; angle<=eangle; angle+=Math.PI*2*30/(r*360)){
                    var tx=radius+Math.floor(r*Math.cos(angle));
                    var ty=radius+Math.ceil(r*Math.sin(angle))
                    if(!(tx<0||tx>2*radius||ty<0||ty>2*radius)){
                        var d = this.getPixelIndexFromData(idata, tx, ty);
                        idata.data[d+3]-=Math.round(a*255);
                    }
                }
            }
            this.surface.context.putImageData(idata, x-radius, y-radius);
        }
        for(var b in this.#brushFunctions){
            this.#brushFunctions[b]["event"] = "mousedown";
            this.#brushFunctions[b]["element"] = this.surface.element;
            this.#brushFunctions[b]["attached"] = [];
        }
        this.setEventTheme(BrushEventThemeOps.themeDefault(this.surface.element));
        this.createNew("pen", FlyBrush.codeOfPen);
        this.createNew("particles", FlyBrush.codeOfParticles);
        this.createNew("brush", FlyBrush.codeOfBrush);
        this.createNew("highlighter", FlyBrush.codeOfHighlighter);
        this.createNew("round_eraser", FlyBrush.codeOfRoundEraser);
        this.createNew("rect_eraser", FlyBrush.codeOfRectEraser);
        this.createNew("round_alpha_set", FlyBrush.codeOfRoundAlphaSet);
        this.createNew("rect_alpha_set", FlyBrush.codeOfRectAlphaSet);
        
        this.setEventTheme(BrushEventThemeOps.themeTouch(this.surface.element));
        this.createNew("pen_touch", FlyBrush.codeOfPen);
        this.createNew("particles_touch", FlyBrush.codeOfParticles);
        this.createNew("brush_touch", FlyBrush.codeOfBrush);
        this.createNew("highlighter_touch", FlyBrush.codeOfHighlighter);
        this.createNew("round_eraser_touch", FlyBrush.codeOfRoundEraser);
        this.createNew("rect_eraser_touch", FlyBrush.codeOfRectEraser);
        this.createNew("round_alpha_set_touch", FlyBrush.codeOfRoundAlphaSet);
        this.createNew("rect_alpha_set_touch", FlyBrush.codeOfRectAlphaSet);
        
        this.setEventTheme(BrushEventThemeOps.themeDefault(this.surface.element));
        this.attachBrushes("pen", "pen_touch");
        this.attachBrushes("particles", "particles_touch");
        this.attachBrushes("brush", "brush_touch");
        this.attachBrushes("highlighter", "highlighter_touch");
        this.attachBrushes("round_eraser", "round_eraser_touch");
        this.attachBrushes("rect_eraser", "rect_eraser_touch");
        this.attachBrushes("round_alpha_set", "round_alpha_set_touch");
        this.attachBrushes("rect_alpha_set", "rect_alpha_set_touch");
        
        this.usePen = () => this.use("pen");
        this.useParticles = () => this.use("particles");
        this.useBrush = () => this.use("brush");
        this.useHighlighter = () => this.use("highlighter");
        this.useRoundEraser = () => this.use("round_eraser");
        this.useRectEraser = () => this.use("rect_eraser");
        this.useRoundAlphaSet = () => this.use("round_alpha_set");
        this.useRectAlphaSet = () => this.use("rect_alpha_set");
    }

    #initEvent(e, brush, obj){
        var doIt = true;
        for(var s in this.shortcut){
            if(!obj.#clickedKeys.includes(obj.shortcut[s])){
                doIt = false;
                break;
            }
        }
        if(doIt){
            obj.#brushFunctions[brush](e, obj);
        }
    }
    #keydownEvent(e, obj){
        e.preventDefault();
        if(!obj.#clickedKeys.includes(e.key)) obj.#clickedKeys.push(e.key);
    }
    #keyupEvent(e, obj){
        e.preventDefault();
        var keys = [];
        for(var k in obj.#clickedKeys){
            if(obj.#clickedKeys[k]!=e.key) keys.push(e.key);
        }
        obj.#clickedKeys = keys;
    }

    setLineWidth(width){
        this.#lineWidth = width;
    }

    setColor(color){
        this.#color = color.asStr;
        this.#colorObject = color;
    }

    getCrrColor(){
        return this.#colorObject;
    }

    setEventTheme(options=new BrushEventThemeOps(this.surface.element)){
        var checker = new BrushEventThemeOps();
        for(var c in checker){
            if(!(c in options)){
                throw new Error("given options are not type BrushEventThemeOps!");
            }
        }
        if(options.elem == null) {
            options.elem = this.surface.element;
        }
        for(var p in this.#eventThemeKeywords.md){
            options.mds = options.mds.replaceAll(p, this.#eventThemeKeywords.md[p]);
            options.mde = options.mde.replaceAll(p, this.#eventThemeKeywords.md[p]);
        }
        for(var p in this.#eventThemeKeywords.mm){
            options.mms = options.mms.replaceAll(p, this.#eventThemeKeywords.mm[p]);
            options.mme = options.mme.replaceAll(p, this.#eventThemeKeywords.mm[p]);
        }
        for(var p in this.#eventThemeKeywords.mu){
            options.mus = options.mus.replaceAll(p, this.#eventThemeKeywords.mu[p]);
            options.mue = options.mue.replaceAll(p, this.#eventThemeKeywords.mu[p]);
        }
        for(var w in this.#createNewBrushKeywords){
            if(w!="init brush"&&
                w!="exit mm"&&
                w!="exit mu"&&
                w!="exit brush"&&
                w!="mm\\s*\\{"&&
                w!="mu\\s*\\{"
            ){
                var rg = w.endsWith("{")?new RegExp(`\\b${w}`, "g"):new RegExp(`\\b${w}\\b`, "g");
                options.mds = options.mds.replaceAll(rg, this.#createNewBrushKeywords[w]);
                options.mde = options.mde.replaceAll(rg, this.#createNewBrushKeywords[w]);
                options.mms = options.mms.replaceAll(rg, this.#createNewBrushKeywords[w]);
                options.mme = options.mme.replaceAll(rg, this.#createNewBrushKeywords[w]);
                options.mus = options.mus.replaceAll(rg, this.#createNewBrushKeywords[w]);
                options.mue = options.mue.replaceAll(rg, this.#createNewBrushKeywords[w]);
            }
        }
        this.#etv = options;
    }

    init(){
        addEventListener("keydown", e=>this.#keydownEvent(e,this));
        addEventListener("keyup", e=>this.#keyupEvent(e,this));
    }

    use(brush){
        if(this.#brushFunctionInUse = ""){
        this.#brushFunctions[this.#brushFunctionInUse].element.removeEventListener(
            this.#brushFunctions[this.#brushFunctionInUse].event, e=>this.#initEvent(e, this.#brushFunctionInUse, this));
        
        for(var atch of this.#brushFunctions[this.#brushFunctionInUse].attached){
            this.#brushFunctions[atch].element.removeEventListener(
                this.#brushFunctions[atch].event, e=>this.#initEvent(e, atch, this));
        }
        }
        
        this.#brushFunctionInUse = brush;

        this.#brushFunctions[this.#brushFunctionInUse].element.addEventListener(
            this.#brushFunctions[this.#brushFunctionInUse].event, e=>this.#initEvent(e, this.#brushFunctionInUse, this));
        
        for(var atch of this.#brushFunctions[this.#brushFunctionInUse].attached){
            this.#brushFunctions[atch].element.addEventListener(
                this.#brushFunctions[atch].event, e=>this.#initEvent(e, atch, this));
        }
    }

    getBrushFromUrl(url, label="", func=brushSrc=>{}){
        let brushSource = null;
        fetch(url).then(res=>res.text()).then(data=>{
            brushSource =  data;
            if(label!=""){
                let start = brushSource.search(`/>${label}`);
                brushSource=brushSource.slice(start+4+label.length, brushSource.length);
                if(brushSource.includes("/>")){
                    let end = brushSource.search(/\/>/);
                    brushSource=brushSource.slice(0, end);
                }
            }
            func(brushSource);
        });
    }

    createNew(name, brushSource=""){
        brushSource = "\n" + brushSource;
        for(var w in this.#createNewBrushKeywords){
            var rg = 
            w.endsWith("{")?new RegExp(`\\b${w}`, "g"):new RegExp(`\\b${w}\\b`, "g");
            brushSource=brushSource.replaceAll(
                rg,
                this.#createNewBrushKeywords[w]
                .replaceAll("!!!!#mm#!!!!", this.#etv.etmm)
                .replaceAll("!!!!#mu#!!!!", this.#etv.etmu)
                .replaceAll("!!!!#mds#!!!!", this.#etv.mds)
                .replaceAll("!!!!#mde#!!!!", this.#etv.mde)
                .replaceAll("!!!!#mms#!!!!", this.#etv.mms)
                .replaceAll("!!!!#mme#!!!!", this.#etv.mme)
                .replaceAll("!!!!#mus#!!!!", this.#etv.mus)
                .replaceAll("!!!!#mue#!!!!", this.#etv.mue)
            );
        }
        this.#brushFunctions[name] = (e, obj)=>{
            eval(brushSource);
        }
        this.#brushFunctions[name]["event"] = this.#etv.etmd;
        this.#brushFunctions[name]["element"] = this.#etv.elem;
        this.#brushFunctions[name]["attached"] = [];
    }

    attachBrushes(...brushes){
        for(var brush of brushes){
            for(var b of brushes){
                if(!(b in this.#brushFunctions))
                throw new Error("One of the given names of brushes to be attached is not created");
                if(brush!=b){
                    this.#brushFunctions[brush]["attached"].push(b);
                }
            }
        }
    }

    attachEvent(brush, event){
        if(!(brush in this.#brushFunctions))
            throw new Error("One of the given names of brushes to be attached is not created");
        this.#brushFunctions[brush]["event"] = event;
    }

    attachElement(brush, element){
        if(!(brush in this.#brushFunctions))
            throw new Error("One of the given names of brushes to be attached is not created");
        this.#brushFunctions[brush]["element"] = element;
    }

}

class FlyFill extends FlyBrush{
    constructor(surface){
        if(!surface.isFlySurface){
            console.error("surface is not type of FlySurface");
            return null;
        }
        super(surface);
        this.surface = surface;
        this.getPixelIndexFromData = (idata, x, y) => (((y-1)*idata.width)+x)*4;
    }

    fill(x, y, color, ignoreColorDiff=0, ignoreAlpha=0){
        x = Math.floor(x), y=Math.floor(y)
        let points = [[x, y, "x", false]];
        let colored = [];
        let crrIndex = 0;
        var idata = this.surface.context.getImageData(0,0,this.surface.width, this.surface.height);
        let preColorCordIndex = this.getPixelIndexFromData(idata, x, y);
        let preColor = new ColorRGB(
            idata.data[preColorCordIndex],
            idata.data[preColorCordIndex+1],
            idata.data[preColorCordIndex+2],
            idata.data[preColorCordIndex+3]/255
        );
        
        while(points[0]){
        // setInterval(()=>{if(points[0]){
            var caxis = points[crrIndex][2];
            var cneg = points[crrIndex][3];
            var cx = caxis=="x"?(cneg?points[crrIndex][0]-1:points[crrIndex][0]+1):points[crrIndex][0];
            var cy = caxis=="y"?(cneg?points[crrIndex][1]-1:points[crrIndex][1]+1):points[crrIndex][1];
            var cDataIndex = this.getPixelIndexFromData(idata, cx, cy);
            var r = idata.data[cDataIndex];
            var g = idata.data[cDataIndex+1];
            var b = idata.data[cDataIndex+2];
            var a = idata.data[cDataIndex+3]/255;
            var naxis = caxis=="x"?"y":"x";
            if(
                Math.color.matchColor(preColor, new ColorRGB(r,g,b,a), ignoreColorDiff, ignoreAlpha)&&
                !Math.color.matchColor(new ColorRGB(r,g,b,a), color)&&
                cx<this.surface.element.width&&cy<=this.surface.element.height&&cx>=0&&cy>0&&
                !colored.includes([cx, cy])
            ){
                idata.data[cDataIndex] = color.r;
                idata.data[cDataIndex+1] = color.g;
                idata.data[cDataIndex+2] = color.b;
                idata.data[cDataIndex+3] = color.a*255;
                points.push([cx, cy, naxis, false]);
                colored.push([cx, cy]);
                crrIndex++;
            }
            else{
                if(cneg){
                    points.pop();
                    crrIndex--;
                } else{
                    points[crrIndex][3] = true;
                }
            }
        }
        this.surface.context.putImageData(idata, 0, 0);
        
    }
    
}

Math["randomInt"] = (start, end) => Math.round((Math.random()*(end-start))+start);
Math["randomFloat"] = (start, end) => (Math.random()*(end-start))+start;
Math["rad2deg"] = (rad) => (rad*180)/Math.PI;
Math["deg2rad"] = (deg) => (deg*Math.PI)/180;

class FlyColorMath{
    constructor(){}
    random(type="rgb", x=null, y=null, z=null, alpha=null){
        if(type=="rgb"){
            var r = x?x:Math.randomInt(0, 255);
            var g = y?y:Math.randomInt(0, 255);
            var b = z?z:Math.randomInt(0, 255);
            var a = alpha?alpha:Math.randomInt(0, 1);
            
            return new ColorRGB(r, g, b, a);
        }
        else if(type=="hsl"){
            var h = x?x:Math.randomInt(0, 360);
            var s = y?y:Math.randomInt(0, 100);
            var l = z?z:Math.randomInt(0, 100);
            var a = alpha?alpha:Math.randomInt(0, 1);
            
            return new ColorHSL(h, s, l, a);
        }
        else if(type=="hex"){
            var arr = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];
            if(x.length>2||x.length<1) throw new Error("length of HEX value can only be of 1 or 2 length")
            if(y.length>2||y.length<1) throw new Error("length of HEX value can only be of 1 or 2 length")
            if(z.length>2||z.length<1) throw new Error("length of HEX value can only be of 1 or 2 length")
            if(x)x=x.length==1?x+x:x;
            if(y)y=y.length==1?y+y:y;
            if(z)z=z.length==1?z+z:z;
            var r = x?x:arr[Math.randomInt(0, 15)]+arr[Math.randomInt(0, 15)];
            var g = y?y:arr[Math.randomInt(0, 15)]+arr[Math.randomInt(0, 15)];
            var b = z?z:arr[Math.randomInt(0, 15)]+arr[Math.randomInt(0, 15)];
            var a = alpha?alpha:Math.randomInt(0, 1);
            var value = r+g+b;
            
            return new ColorHEX(value, a);
        }
    }
    getHEXfrom(color){
        if(color.type == "hex") return color;
        if(color.type == "hsl") color = this.getRGBfrom(color);
        
        var arr = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];
        var rstr = arr[Math.floor(color.r/16)]+arr[color.r%16];
        var gstr = arr[Math.floor(color.g/16)]+arr[color.g%16];
        var bstr = arr[Math.floor(color.b/16)]+arr[color.b%16];
        
        return new ColorHEX(rstr+gstr+bstr, color.a);
        
    }

    getRGBfrom(color){
        if(color.type == "rgb") return color;
        if(color.type == "hsl"){
            var r, g, b;
            var {h, s, l} = color;
            h/=360;
            s/=100;
            l/=100;
            if(s == 0){
                r = g = b = l;
            }else{
                var hue2rgb = function (p, q, t){
                    if(t < 0) t += 1;
                    if(t > 1) t -= 1;
                    if(t < 1/6) return p + (q - p) * 6 * t;
                    if(t < 1/2) return q;
                    if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                    return p;
                }

                var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                var p = 2 * l - q;
                r = hue2rgb(p, q, h + 1/3);
                g = hue2rgb(p, q, h);
                b = hue2rgb(p, q, h - 1/3);
            }

            return new ColorRGB(Math.round(r * 255), Math.round(g * 255), Math.round(b * 255), color.a);
        }
        if(color.type == "hex"){
            var {r, g, b} = color;
            var arr = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];
            var rr = ((arr.indexOf(r[0]))*16)+arr.indexOf(r[1]);
            var rg = ((arr.indexOf(g[0]))*16)+arr.indexOf(g[1]);
            var rb = ((arr.indexOf(b[0]))*16)+arr.indexOf(b[1]);
            
            return new ColorRGB(rr, rg, rb, color.a);
        }
    }

    getHSLfrom(color){
        if(color.type == "hsl") return color;
        if(color.type == "hex") color = this.getRGBfrom(color);
        var {r, g, b} = color;
        r /= 255, g /= 255, b /= 255;
        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        var h, s, l = (max + min) / 2;
    
        if(max == min){
            h = s = 0;
        }else{
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch(max){
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }    
        return new ColorHSL(Math.round(h*360), Math.round(s*100), Math.round(l*100), color.a);
    }

    matchColor(...colors){
        var colorDiff = 0, aDiff = 0;
        if(colors.length<2) throw new Error("Sufficient parameters not given");
        if(typeof(colors[colors.length-1])=="number"&&typeof(colors[colors.length-2])=="number"){
            colorDiff = colors[colors.length-2];
            aDiff = colors[colors.length-1];
            colors.splice(colors.length-2, 2);
        }
        else if(typeof(colors[colors.length-1])=="number"){
            colorDiff = colors[colors.length-1];
            colors.splice(colors.length-1, 1);
        }
        if(colors.length<2) throw new Error("Sufficient parameters not given");
        if(colorDiff<0||colorDiff>1) throw new Error("Color Difference can be between 0 and 1 only.");
        if(aDiff<0||aDiff>1) throw new Error("Alpha Difference can be between 0 and 1 only.");
        colorDiff = Math.round(colorDiff*255);
        
        for(var i of colors){
            if(!i.type) throw new Error("Given parameter is not type of FlyColor "+i);
            var tColor = this.getRGBfrom(i);
            for (var j of colors) {
                var cColor = this.getRGBfrom(j);
                if(!j.type) throw new Error("Given parameter is not type of FlyColor "+j);
                if(
                    Math.abs(tColor.r-cColor.r)>colorDiff||
                    Math.abs(tColor.g-cColor.g)>colorDiff||
                    Math.abs(tColor.b-cColor.b)>colorDiff||
                    Math.abs(tColor.a-cColor.a)>aDiff
                ){
                    return false;
                }
            }
        }
        return true;
    }
    matchAlpha(...colors){
        aDiff = 0;
        if(colors.length<2) throw new Error("Sufficient parameters not given");
        else if(typeof(colors[colors.length-1])=="number"){
            aDiff = colors[colors.length-1];
            colors.splice(colors.length-1, 1);
        }
        if(colors.length<2) throw new Error("Sufficient parameters not given"+colors);
        if(aDiff<0||aDiff>1) throw new Error("Alpha Difference can be between 0 and 1 only.");
        
        for(var i of colors){
            if(!i.type) throw new Error("Given parameter is not type of FlyColor");
            var tColor = this.getRGBfrom(i);
            for (var j of colors) {
                var cColor = this.getRGBfrom(j);
                if(!j.type) throw new Error("Given parameter is not type of FlyColor");
                if(
                    Math.abs(tColor.a-cColor.a)>aDiff
                ){
                    return false;
                }
            }
        }
        return true;
    }

    add(...colors){
        var rsum = 0, gsum = 0, bsum = 0, asum = 0, addAlpha = true;
        if(colors[colors.length-1]===true||colors[colors.length-1]===false){
            addAlpha = colors[colors.length-1];
            colors.splice(colors.length-1, 1);
        }
        if(!addAlpha) asum = 1;
        for(var c of colors){
            c = this.getRGBfrom(c);
            var {r, g, b, a} = c;
            if(rsum<=255)rsum+=r;
            if(rsum>255)rsum=255;
            if(gsum<=255)gsum+=g;
            if(gsum>255)gsum=255;
            if(bsum<=255)bsum+=b;
            if(bsum>255)bsum=255;
            if(addAlpha){
                if(asum<=1)asum+=a;
                if(asum>1)asum = 1;
            }
        }
        return new ColorRGB(rsum, gsum, bsum, asum);
    }
    subtract(...colors){
        var rdiff = 0, gdiff = 0, bdiff = 0, adiff = 0, subAlpha = false;
        if(colors[colors.length-1]===true||colors[colors.length-1]===false){
            subAlpha = colors[colors.length-1];
            colors.splice(colors.length-1, 1);
        }
        rdiff = colors[0].r;
        gdiff = colors[0].g;
        bdiff = colors[0].b;
        adiff = colors[0].a;
        colors.shift();
        for(var c of colors){
            c = this.getRGBfrom(c);
            var {r, g, b, a} = c;
            if(rdiff>=0)rdiff-=r;
            if (rdiff<0) rdiff=0;
            if(gdiff>=0)gdiff-=g;
            if (gdiff<0) gdiff=0;
            if(bdiff>=0)bdiff-=b;
            if (bdiff<0) bdiff=0;
            if(subAlpha){
                if(adiff>=0)adiff-=a;
                if(adiff<0)adiff = 0;
            }
        }
        return new ColorRGB(rdiff, gdiff, bdiff, adiff);
    }
    multiply(...colors){
        var rmul = 1, gmul = 1, bmul = 1, amul = 1, mulAlpha = true;
        if(colors[colors.length-1]===true||colors[colors.length-1]===false){
            mulAlpha = colors[colors.length-1];
            colors.splice(colors.length-1, 1);
        }
        for(var c of colors){
            c = this.getRGBfrom(c);
            var {r, g, b, a} = c;
            rmul*=r/255, gmul*=g/255, bmul*=b/255;
            if(mulAlpha) amul*=a;
        }
        rmul = Math.round(rmul*255), gmul = Math.round(gmul*255), bmul = Math.round(bmul*255);
        if(rmul>255) rmul=255;
        if(rmul<0) rmul=0;
        if(rmul>255) rmul=255;
        if(rmul<0) rmul=0;
        if(rmul>255) rmul=255;
        if(rmul<0) rmul=0;
        if(amul>1) amul=255;
        if(amul<0) amul=0;
        return new ColorRGB(rmul, gmul, bmul, amul);
    }

    betweenAtValue(value, color1, color2, valuebefore=0, valueafter=1){
        if(valuebefore<0||valueafter>1||valuebefore>valueafter) 
            throw new Error("Invalid parameters for valuebefore or valueafter");
        var s = valuebefore, e = valueafter, v=value;
        var sr = color1.r/255;
        var er = color2.r/255;
        var sg = color1.g/255;
        var eg = color2.g/255;
        var sb = color1.b/255;
        var eb = color2.b/255;
        
        var rr = Math.round((sr+((er-sr)*(v-s)*(1/(e-s))))*255);
        var rg = Math.round((sg+((eg-sg)*(v-s)*(1/(e-s))))*255);
        var rb = Math.round((sb+((eb-sb)*(v-s)*(1/(e-s))))*255);

        return new ColorRGB(rr, rg, rb);
    }
}

Math["color"] = new FlyColorMath();

class ColorRGB{
    constructor(r=255, g=255, b=255, a=1){
        r = Math.floor(r);
        g = Math.floor(g);
        b = Math.floor(b);
        if(r<0||r>255){
            throw new Error("r value of RGB color cannot be out of 0->255 range")
        }
        if(g<0||g>255){
            throw new Error("g value of RGB color cannot be out of 0->255 range")
        }
        if(b<0||b>255){
            throw new Error("b value of RGB color cannot be out of 0->255 range")
        }
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
        this.asStr = `rgba(${r}, ${g}, ${b}, ${a})`;
        this.type = "rgb";
    }
    toRGB() {return Math.color.getRGBfrom(this)}
    toHEX() {return Math.color.getHEXfrom(this)}
    toHSL() {return Math.color.getHSLfrom(this)}
    match(...colors) {return Math.color.matchColor(...[this, ...colors]);}
    matchAlpha(...colors) {return Math.color.matchAlpha(...[this, ...colors]);}
    add(...colors) {return Math.color.add(...[this, ...colors]);}
    subtract(...colors) {return Math.color.subtract(...[this, ...colors]);}
    multiply(...colors) {return Math.color.multiply(...[this, ...colors]);}
}

class ColorHSL{
    constructor(h=0, s=100, l=50, a=1){
        h = Math.floor(h);
        s = Math.floor(s);
        l = Math.floor(l);
        if(h<0||h>360){
            throw new Error("h value of HSL color cannot be out of 0->360 range")
        }
        if(s<0||s>100){
            throw new Error("s value of HSL color cannot be out of 0->100 range")
        }
        if(l<0||l>100){
            throw new Error("l value of HSL color cannot be out of 0->100 range")
        }
        this.h = h;
        this.s = s;
        this.l = l;
        this.a = a;
        this.asStr = `hsla(${h}, ${s}%, ${l}%, ${a})`;
        this.type = "hsl";
    }
    toRGB() {return Math.color.getRGBfrom(this)}
    toHEX() {return Math.color.getHEXfrom(this)}
    toHSL() {return Math.color.getHSLfrom(this)}
    match(...colors) {return Math.color.matchColor(...[this, ...colors]);}
    matchAlpha(...colors) {return Math.color.matchAlpha(...[this, ...colors]);}
    add(...colors) {return Math.color.add(...[this, ...colors]);}
    subtract(...colors) {return Math.color.subtract(...[this, ...colors]);}
    multiply(...colors) {return Math.color.multiply(...[this, ...colors]);}
}

class ColorHEX{
    constructor(value = "#fff", a=1){
        value = value.toLowerCase()
        var astr = "";
        if(!value.startsWith("#")){value = "#"+value}
        if(!(value.length==4||value.length==7)){
            throw new Error("The length of HEX Color cannot be "+value.length);
        }

        if(value.length==4){
            value = value[0]+value[1]+value[1]+value[2]+value[2]+value[3]+value[3];
        }

        var arr = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];
        if(value.length==7) astr=arr[Math.floor(a*255/16)]+arr[Math.floor(a*255/16)];
        value+=astr;

        var r = value[1]+value[2];
        var g = value[3]+value[4];
        var b = value[5]+value[6];
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
        this.alphaStr = astr;
        this.asStr = value
        this.type = "hex";
    }
    toRGB() {return Math.color.getRGBfrom(this)}
    toHEX() {return Math.color.getHEXfrom(this)}
    toHSL() {return Math.color.getHSLfrom(this)}
    match(...colors) {return Math.color.matchColor(...[this, ...colors]);}
    matchAlpha(...colors) {return Math.color.matchAlpha(...[this, ...colors]);}
    add(...colors) {return Math.color.add(...[this, ...colors]);}
    subtract(...colors) {return Math.color.subtract(...[this, ...colors]);}
    multiply(...colors) {return Math.color.multiply(...[this, ...colors]);}
}

class BrushEventThemeOps{
    constructor(
        element = null,
        eventmd="mousedown", eventmm="mousemove", eventmu="mouseup",
        mdStart="", mdEnd="",
        mmStart="", mmEnd="",
        muStart="", muEnd=""
    ){
        this.elem = element;
        this.etmd = eventmd;
        this.etmm = eventmm;
        this.etmu = eventmu;
        this.mds = mdStart;
        this.mde = mdEnd;
        this.mms = mmStart;
        this.mme = mmEnd;
        this.mus = muStart;
        this.mue = muEnd;
        this.element = (el) => new BrushEventThemeOps
            (el, this.etmd, this.etmm, this.etmu, this.mds, this.mde, this.mms, this.mme, this.mus, this.mue);
        this.eventmd = (name) => new BrushEventThemeOps
            (this.elem, name, this.etmm, this.etmu, this.mds, this.mde, this.mms, this.mme, this.mus, this.mue);
        this.eventmm = (name) => new BrushEventThemeOps
            (this.elem, this.etmd, name, this.etmu, this.mds, this.mde, this.mms, this.mme, this.mus, this.mue);
        this.eventmu = (name) => new BrushEventThemeOps
            (this.elem, this.etmd, this.etmm, name, this.mds, this.mde, this.mms, this.mme, this.mus, this.mue);
        this.mdStart = (code) => new BrushEventThemeOps
            (this.elem, this.etmd, this.etmm, this.etmu, code, this.mde, this.mms, this.mme, this.mus, this.mue);
        this.mdEnd = (code) => new BrushEventThemeOps
            (this.elem, this.etmd, this.etmm, this.etmu, this.mds, code, this.mms, this.mme, this.mus, this.mue);
        this.mmStart = (code) => new BrushEventThemeOps
            (this.elem, this.etmd, this.etmm, this.etmu, this.mds, this.mde, code, this.mme, this.mus, this.mue);
        this.mmEnd = (code) => new BrushEventThemeOps
            (this.elem, this.etmd, this.etmm, this.etmu, this.mds, this.mde, this.mms, code, this.mus, this.mue);
        this.muStart = (code) => new BrushEventThemeOps
            (this.elem, this.etmd, this.etmm, this.etmu, this.mds, this.mde, this.mms, this.mme, code, this.mue);
        this.muEnd = (code) => new BrushEventThemeOps
            (this.elem, this.etmd, this.etmm, this.etmu, this.mds, this.mde, this.mms, this.mme, this.mus, code);
    }

    static themeTouch = (element=null) => new BrushEventThemeOps()
    .element(element)
    .eventmd("touchstart")
    .eventmm("touchmove")
    .eventmu("touchend")
    .mdStart(`ex = event.touches[0].clientX, ey = event.touches[0].clientY;`)
    .mmStart(`ex = event.touches[0].clientX, ey = event.touches[0].clientY;`)
    .muStart(`ex = event.touches.length>0?event.touches[0].clientX:datas.prevMousePos[0];
    ey = event.touches.length>0?event.touches[0].clientY:datas.prevMousePos[1];`);

    static themeDefault = (element=null) => new BrushEventThemeOps()
    .element(element);

    static themeMouse = (element=null) => new BrushEventThemeOps()
    .element(element);
}
