
SCENE ID mapa

SET TEXTURES[
  "mapa",
  "tienda",
  "restaurante",
  "correo"
]

SET SOUNDS[
  "openning"
]

mapa = new GraphObject({
  texture: "mapa",
  brightness: 1,
  scale: 1,
  z: 0,
  states: {
    burning: {
      beforeChange: (engine) => {
        engine.anims.get("testState").enabled = true;
      },
      data: {
        //grayscale:1
      }
    }
  }
})


testState = new Animation("mapa",
  {
    grayscale: 1
  }, { duration: 4000, infinite: true, loopback: true })

tienda = new GraphObject({
  texture: "tienda",
  scale: 0.1,
  left: .45,
  top: .18
})
restaurante = new GraphObject({
  texture: "restaurante",
  scale: 0.1,
  left: .56,
  top: .75
})
correo = new GraphObject({
  texture: "correo",
  scale: 0.1,
  left: .08,
  top: .27
})
entrarCorreo = new Trigger({
  relatedTo: "correo",
  enabled: true,
  onRelease: (engine) => {
    engine.loadScene("oficinaPostal");
  }
})
entrarTienda = new Trigger({
  relatedTo: "tienda",
  onRelease: (engine) => {
    engine.loadScene("testScene");
  }
})

test = new Animation("mapa", {
  0: { blur: 0, brightness: 0 },
  4000: { blur: 7, brightness: 4 },
  6000: { blur: 0, brightness: 0 }
}, { enabled: true, infinite: true })

test1 = new Animation("mapa", {
  0: { left: -.002, top: .002, scale: 1 },
  500: { left: .002, top: -.001, scale: 1.0025 },
  1000: { left: .001, top: -.002, scale: 1.005 },
  1500: { left: -.001, top: .001, scale: 1.0025 },
  2000: { left: -.002, top: .002, scale: 1 }
}, { enabled: true, infinite: true })

//**DIALOG MISC????????=============================================
voiceByName = new GraphObject({
  text: "Gta",
  fontSize: 22,
  boxColor: "black",
  scale: .1,
  color: "white",
  top: .70,
  left: .08,
  heightScale: .7,
  margin: .1,
  z: -2
})
dialogbox = new GraphObject({
  boxColor: "rgb(20,80,190)",
  color: "white",
  scale: .8,
  heightScale: .25,
  top: .75,
  left: .1,
  fontSize: 18,
  text: "",
  margin: .05,
  opacity: 0
})

botonAvanzarDialogo = new GraphObject({
  boxColor: "white",
  color: "black",
  scale: .05,
  text: "Next",
  fontSize: 24,
  left: .85,
  top: .9
})
avanzarDialogo = new Trigger({
  relatedTo: "botonAvanzarDialogo",
  onRelease: (engine) => {
    engine.graphArray.get("dialogbox").text = "";
    if (engine.dialogNumber + 1 < engine.dialog.length) {
      engine.dialogNumber++;
    } else {
      engine.graphArray.get("dialogbox").opacity = 0;
      engine.dialogNumber = 0;
      engine.continue = true;
    }
  }
})

narrationBox = new GraphObject({
  boxColor: "rgb(211,103,5)",
  color: "white",
  scale: .7,
  top: .15,
  left: .15,
  fontSize: 18,
  text: "",
  margin: .1,
  opacity: 0
})

botonNarracion = new GraphObject({
  boxColor: "white",
  color: "black",
  scale: .1,
  text: "Next",
  fontSize: 24,
  left: .8,
  top: .75
})
avanzarNarracion = new Trigger({
  relatedTo: "botonNarracion",
  onRelease: (engine) => {
    engine.paragraphNumber++;

    const tb = engine.narration.split('\n');
    if (engine.paragraphNumber < tb.length) {
      engine.paragraph += '\n' + tb[engine.paragraphNumber];
    } else {      
      SET TRIGGER avanzarNarracion { enabled: false }
      SET GRAPHOBJECT narrationBox { opacity: 0 }
      CONTINUE
      engine.paragraph = "";
      SET GRAPHOBJECT narrationBox { text: "" }
      //engine.graphArray.get("narrationBox").text = "";
    }
  }
})
narrationAgent = new CodedRoutine({
  code: (engine) => {
    let text = engine.graphArray.get("narrationBox").text;
    if (text.length < engine.paragraph.length) {
      engine.graphArray.get("narrationBox").text += engine.paragraph[text.length];
    }
  }
})
dialogAgent = new CodedRoutine({
  code: (engine) => {
    let text = engine.graphArray.get("dialogbox").text;

    if (engine.dialog.length > 0)
      if (text.length < engine.dialog[engine.dialogNumber].length) {
        engine.graphArray.get("dialogbox").text += engine.dialog[engine.dialogNumber][text.length];
      }
  }
})

END DEFINITION

//WAIT

WAIT 1000

SHOW DIALOG ...[
  "No debia de terminar así",
  "Esto definitivamente no era lo que estaba buscando",
  "Ahora estoy sumido en la mas profunda oscuridad"
]

blast = new CodedRoutine({
  code: () => { console.log("blast"); }
})

SHOW NARRATION[
  "El viento arrecia y hace cada vez más frio",
  "Las luces de las farolas se vuelven mas tenues",
  "La nieve se acumula en las hojas congeladas de los arboles y cubre el suelo",
  "Se hace dificil diferenciar donde termina la via y comienza el paso peatonal"
]

WAIT 1000

SHOW DIALOG ...[
  "Es curioso. Siento el corazon entumecido, pero no es precisamente porque esté nevando."
]

END FILE