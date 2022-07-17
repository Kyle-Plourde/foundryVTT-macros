/*
CREATE LIGHT SOURCE
adds a selected light scource to the current scene
Created by Kyle-Plourde
*/

function makeLight(vardim, varbright) {
    canvas.scene.createEmbeddedDocuments("AmbientLight", [{
        t: "1",
        x: 1000,
        y: 1000,
        rotation: 0,
        darkness: (0.5, 1),
        config: {
            dim: vardim,
            bright: varbright,
            angle: 360,
            animation: {
                type: "torch", speed: 1, intensity: 1
            },
        }
    }]);
}



let dialogEditor = new Dialog({
    title: "Create Light",
    content: "Choose a light source to create in scene.",
    buttons: {
        candelabra: {
            label: "Candelabra",
            callback: () => {
                makeLight(10, 5);
                dialogEditor.render(true);
            }
        },
        candle: {
            label: "Candle",
            callback: () => {
                makeLight(5, 0);
                dialogEditor.render(true);
            }
        },
        fireplace: {
            label: "Fire(place)",
            callback: () => {
                makeLight(60, 30);
                dialogEditor.render(true);
            }
        },
        lantern: {
            label: "Lantern",
            callback: () => {
                makeLight(45, 15);
                dialogEditor.render(true);
            }
        },
        torch: {
            label: "Torch",
            callback: () => {
                makeLight(40, 20);
                dialogEditor.render(true);
            }
        },
        continual_flame: {
            label: "Continual Flame",
            callback: () => {
                makeLight(40, 20);
                dialogEditor.render(true);
            }
        },
        dancing_lights: {
            label: "Dancing Lights",
            callback: () => {
                makeLight(10, 0);
                dialogEditor.render(true);
            }
        },
        faerie_fire: {
            label: "Faerie Fire",
            callback: () => {
                makeLight(10, 0);
                dialogEditor.render(true);
            }
        },
        light: {
            label: "Light",
            callback: () => {
                makeLight(40, 20);
                dialogEditor.render(true);
            }
        }
    }
});

dialogEditor.render(true);