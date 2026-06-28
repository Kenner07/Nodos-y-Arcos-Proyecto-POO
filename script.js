const dNodo = document.querySelector("#dNodo");
const dArco = document.querySelector("#dArco");
const save_archivo = document.querySelector("#save_archivo");
const updateArco = document.querySelector("#updateArco");
const updateNodo = document.querySelector("#updateNodo");
const a_nodo = document.querySelector("#a_nodo");
const clear_canvas = document.querySelector("#clear_canvas");
const update_arco = document.querySelector("#update_arco");
const update_nodo = document.querySelector("#update_nodo");
const a_nodofuente = document.querySelector("#a_nodofuente");
const a_nodosumidero = document.querySelector("#a_nodosumidero");
const b_fuente = document.querySelector("#nodofuente");
const dialogNodo = document.querySelector("#dialogNodo");
const dialogArco = document.querySelector("#dialogArco");
const dialogUpdateArco = document.querySelector("#dialogUpdateArco");
const dialogUpdateNodo = document.querySelector("#dialogUpdateNodo");
const radioValor = document.querySelector("#radioValor");
const a_arco = document.querySelector("#a_arco");
const el_objeto = document.querySelector("#el_objeto");
const move_nodo = document.querySelector("#move_nodo");
const radioInput = document.querySelector("#radioInput");
const IdInput = document.querySelector("#IdInput");
const newPesoInput = document.querySelector("#newPesoInput");
const newIdInput = document.querySelector("#newIdInput");
const newRadioInput = document.querySelector("#newRadioInput");
const pesoInput = document.querySelector("#pesoInput");
const upload_archivo = document.getElementById("upload_archivo");
const canvas = document.getElementById("canvas");
ctx = canvas.getContext("2d");

// Clases
class Nodes extends Array{
  constructor (x, y , radio, color, id){
    super();
    this.x = x;
    this.y = y;
    this.radio = radio;
    this.color = color;
    this. id = id;
  }
}

class Arrows extends Array{
  constructor(start, end, peso){
    super();
    this.start = start;
    this.end = end;
    this,peso = peso;
  }
}
//

//Se crean los objetos
let nodes = new Nodes ();
let arrows = new Arrows ();
//

var id = [];
var color=null;
var startPoint = null;
var endPoint = null;
let opc = 0;
let selectedNodes = []; // Almacena los círculos seleccionados


upload_archivo.addEventListener("click", function() {
  let input = document.createElement("input");
  input.type = "file";
  input.onchange = (e) => {
    let file = e.target.files[0];
    let reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
      let data = reader.result.split("][");
      nodes = JSON.parse(data[0] + "]");
      arrows = JSON.parse("[" + data[1]);
      arrows = arrows.map((arrow) => {
        const startNode = nodes.find((node) => node.x === arrow.start.x && node.y === arrow.start.y);
        const endNode = nodes.find((node) => node.x === arrow.end.x && node.y === arrow.end.y);
        return {
          start: {
            x: arrow.start.x,
            y: arrow.start.y,
            radio: startNode ? startNode.radio : (arrow.start.radio || 0),
            id: startNode ? startNode.id : arrow.start.id,
          },
          end: {
            x: arrow.end.x,
            y: arrow.end.y,
            radio: endNode ? endNode.radio : (arrow.end.radio || 0),
            id: endNode ? endNode.id : arrow.end.id,
          },
          peso: arrow.peso,
        };
      });
      dibujarFlechaAndNodos();
    };
  };
  input.click();
});

clear_canvas.addEventListener("click", () =>{
  ctx.clearRect(0, 0, canvas.width, canvas.height);
})

save_archivo.addEventListener("click", () =>{
  saveArchivo();
});

el_objeto.addEventListener("click", () => {
  canvas.addEventListener("click", eliminarCirculo);
  canvas.addEventListener("click", eliminarFlecha);
  opc = 3;
});

a_arco.addEventListener("click", () => {
  dArco.showModal();
  canvas.addEventListener("click", seleccionarCirculo); // Agrega el evento para seleccionar círculos
  opc = 2;
});

update_arco.addEventListener("click", () => {
  updateArco.showModal();
  canvas.addEventListener("click", actualizarPeso); 
  opc = 4;
});

update_nodo.addEventListener("click", () => {
  updateNodo.showModal();
  canvas.addEventListener("click", actualizarNodo); 
  opc = 5;
});

move_nodo.addEventListener("click", () => {
  opc = 6;
  canvas.style.cursor = "move";
});

a_nodo.addEventListener("click", () => {
  color="yellow";
  dNodo.showModal();
  canvas.addEventListener("click", drawCircle);
  opc = 1;
});

a_nodofuente.addEventListener("click", () => {
  color="#0400ff";
  dNodo.showModal();
  canvas.addEventListener("click", drawCircle);
  opc = 1;
});

a_nodosumidero.addEventListener("click", () => {
  color="#6765ff";
  dNodo.showModal();
  canvas.addEventListener("click", drawCircle);
  opc = 1;
});

dialogNodo.addEventListener("submit", (e) => {
  e.preventDefault();
  dNodo.close(radioInput.value);
  dNodo.close(IdInput.value);
});

dialogArco.addEventListener("submit", (e) => {
  e.preventDefault();
  dArco.close(pesoInput.value);
});

dialogUpdateArco.addEventListener("submit", (e) => {
  e.preventDefault();
  updateArco.close(newPesoInput.value);
});

dialogUpdateNodo.addEventListener("submit", (e) => {
  e.preventDefault();
  updateNodo.close(newIdInput.value);
  updateNodo.close(newRadioInput.value);
});

ctx.font = "20px Inter Light";

const drawCircle = (e) => {
  if (opc == 1) {
    var radio = parseInt(radioInput.value);
    var id = IdInput.value;
    ctx.fillStyle=color;
    ctx.beginPath();
    ctx.arc(e.offsetX, e.offsetY, radio, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle="black";
    ctx.textAlign = "center";
    ctx.fillText(id, e.offsetX, e.offsetY);
    nodes.push({x: e.offsetX, y: e.offsetY, radio: radio, id: id, color: color});
  }
};

const dibujarCirculo = (x, y, radio, color, id) => {
  ctx.fillStyle=color;
  ctx.beginPath();
  ctx.arc(x, y, radio, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
  ctx.textAlign = "center";
  ctx.fillStyle = "black";
  ctx.fillText(id, x, y);
};

const calcularPuntosFlecha = (start, end) => {
  const angle = Math.atan2(end.y - start.y, end.x - start.x);
  return {
    startX: start.x + start.radio * Math.cos(angle),
    startY: start.y + start.radio * Math.sin(angle),
    endX: end.x - end.radio * Math.cos(angle),
    endY: end.y - end.radio * Math.sin(angle),
    angle,
  };
};

const dibujarFlecha = (start, end, peso) => {
  const points = calcularPuntosFlecha(start, end);
  const arrowSize = 10;
  const x1 = points.endX - arrowSize * Math.cos(points.angle - Math.PI / 6);
  const y1 = points.endY - arrowSize * Math.sin(points.angle - Math.PI / 6);
  const x2 = points.endX - arrowSize * Math.cos(points.angle + Math.PI / 6);
  const y2 = points.endY - arrowSize * Math.sin(points.angle + Math.PI / 6);

  ctx.beginPath();
  ctx.moveTo(points.startX, points.startY);
  ctx.lineTo(points.endX, points.endY);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(points.endX, points.endY);
  ctx.lineTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.closePath();
  ctx.fillStyle = "red";
  ctx.fill();

  ctx.fillStyle = "black";
  ctx.textAlign = "center";
  const midX = (points.startX + points.endX) / 2;
  const midY = (points.startY + points.endY) / 2;
  ctx.fillText(peso, midX - 10, midY - 10);
};

const seleccionarCirculo = (e) => {
  if (opc == 2) {
    const circuloEncontrado = buscarCirculo(e.offsetX, e.offsetY);
    if (circuloEncontrado) {
      selectedNodes.push(circuloEncontrado);

      if (selectedNodes.length == 2) {
        const start = selectedNodes[0];
        const end = selectedNodes[1];
        // Obtiene el valor del peso del input
        var peso = parseInt(pesoInput.value);
        // Añade el peso al objeto flecha con el radio y el id de cada nodo
        arrows.push({
          start: { x: start.x, y: start.y, radio: start.radio, id: start.id },
          end: { x: end.x, y: end.y, radio: end.radio, id: end.id },
          startId: start.id,
          endId: end.id,
          peso: peso,
        });
        dibujarFlecha({ x: start.x, y: start.y, radio: start.radio }, { x: end.x, y: end.y, radio: end.radio }, peso);
        selectedNodes = [];
      }
    }
  }
};

const buscarNodoPorArista = (arrowEndpoint) => {
  if (!arrowEndpoint) return null;
  if (arrowEndpoint.id != null) {
    const foundById = nodes.find((node) => node.id == arrowEndpoint.id);
    if (foundById) return foundById;
  }
  return nodes.find((node) => node.x === arrowEndpoint.x && node.y === arrowEndpoint.y && node.radio === arrowEndpoint.radio);
};

const obtenerNodosFlecha = (arrow) => {
  const startNode = buscarNodoPorArista(arrow.start) || nodes.find((node) => node.id == arrow.startId);
  const endNode = buscarNodoPorArista(arrow.end) || nodes.find((node) => node.id == arrow.endId);
  return { startNode, endNode };
};

const buscarFlecha = (x, y) => {
  // Recorre el arreglo de flechas
  for (let i = 0; i < arrows.length; i++) {
    const arrow = arrows[i];
    const { startNode, endNode } = obtenerNodosFlecha(arrow);
    if (!startNode || !endNode) continue;
    const points = calcularPuntosFlecha(
      { x: startNode.x, y: startNode.y, radio: startNode.radio },
      { x: endNode.x, y: endNode.y, radio: endNode.radio }
    );
    let length = Math.sqrt((points.endX - points.startX) ** 2 + (points.endY - points.startY) ** 2);
    let distanceStart = Math.sqrt((x - points.startX) ** 2 + (y - points.startY) ** 2);
    let distanceEnd = Math.sqrt((x - points.endX) ** 2 + (y - points.endY) ** 2);
    if (Math.abs(distanceStart + distanceEnd - length) < 0.1) {
      return arrow;
    }
  }
  return null;
};


let draggingNode = null;
let isDragging = false;

const buscarCirculo = (x, y) => {
  
  for (let i = 0; i < nodes.length; i++) {
    const circulo = nodes[i];
    const distancia = Math.sqrt(Math.pow(x - circulo.x, 2) + Math.pow(y - circulo.y, 2));
    if (distancia <= circulo.radio) {
      return circulo;
    }
  }
  return null;
};

canvas.addEventListener("mousedown", (e) => {
  if (opc !== 6) return;
  const node = buscarCirculo(e.offsetX, e.offsetY);
  if (node) {
    draggingNode = node;
    isDragging = true;
  }
});

canvas.addEventListener("mousemove", (e) => {
  if (opc !== 6 || !isDragging || !draggingNode) return;
  draggingNode.x = e.offsetX;
  draggingNode.y = e.offsetY;
  arrows.forEach((arrow) => {
    if (arrow.startId != null && arrow.startId == draggingNode.id) {
      arrow.start = { x: draggingNode.x, y: draggingNode.y, radio: draggingNode.radio, id: draggingNode.id };
    }
    if (arrow.endId != null && arrow.endId == draggingNode.id) {
      arrow.end = { x: draggingNode.x, y: draggingNode.y, radio: draggingNode.radio, id: draggingNode.id };
    }
  });
  dibujarFlechaAndNodos();
});

canvas.addEventListener("mouseup", () => {
  if (opc !== 6) return;
  isDragging = false;
  draggingNode = null;
  canvas.style.cursor = "default";
});

const eliminarFlecha = (e) => {
  if(opc==3){
  const flechaseleccionada = buscarFlecha(e.offsetX, e.offsetY);
  if (flechaseleccionada) {
    arrows = arrows.filter((arrow) => arrow !== flechaseleccionada);
    // Dibuja nuevamente los círculos y flechas actualizados
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      dibujarCirculo(node.x, node.y, node.radio, node.color, node.id);
    }

    for (let i = 0; i < arrows.length; i++) {
      const arrow = arrows[i];
      dibujarFlecha(arrow.start, arrow.end, arrow.peso);
  }
  }
 }
}

const eliminarCirculo = (e) => {
  if (opc == 3){ 
  const circuloSeleccionado = buscarCirculo(e.offsetX, e.offsetY);
  if (circuloSeleccionado) {
    // Elimina el círculo seleccionado de la lista de nodos
    nodes = nodes.filter((node) => node !== circuloSeleccionado);


    // Elimina las flechas que tienen como inicio o fin el círculo seleccionado
    arrows = arrows.filter((arrow) => {
      // Si la flecha tiene como inicio o fin el círculo seleccionado
      if ((arrow.start.id && arrow.start.id === circuloSeleccionado.id) || (arrow.end.id && arrow.end.id === circuloSeleccionado.id)) {
        return false;
      }
      if ((arrow.start.x === circuloSeleccionado.x && arrow.start.y === circuloSeleccionado.y) || (arrow.end.x === circuloSeleccionado.x && arrow.end.y === circuloSeleccionado.y)) {
        return false;
      }
      return true;
    }); 
    // Dibuja nuevamente los círculos y flechas actualizados
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      dibujarCirculo(node.x, node.y, node.radio, node.color, node.id);
    }

    for (let i = 0; i < arrows.length; i++) {
      const arrow = arrows[i];
      dibujarFlecha(arrow.start, arrow.end, arrow.peso);
    }
 }
}
}

function dibujarFlechaAndNodos (e) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    dibujarCirculo(node.x, node.y, node.radio, node.color, node.id);
  }

  for (let i = 0; i < arrows.length; i++) {
    const arrow = arrows[i];
    const { startNode, endNode } = obtenerNodosFlecha(arrow);
    if (startNode && endNode) {
      dibujarFlecha(
        { x: startNode.x, y: startNode.y, radio: startNode.radio },
        { x: endNode.x, y: endNode.y, radio: endNode.radio },
        arrow.peso
      );
      arrow.start = { x: startNode.x, y: startNode.y, radio: startNode.radio, id: startNode.id };
      arrow.end = { x: endNode.x, y: endNode.y, radio: endNode.radio, id: endNode.id };
    } else {
      dibujarFlecha(arrow.start, arrow.end, arrow.peso);
    }
  }
}

function actualizarPeso(e) {
  if(opc==4){
  // Busca la flecha que se ha clickeado
  const flechaEncontrada = buscarFlecha(e.offsetX, e.offsetY);
  // Si se encuentra una flecha
  if (flechaEncontrada) {
    var nuevoPeso = parseInt(newPesoInput.value);
      // Actualiza el peso de la flecha en el arreglo
      flechaEncontrada.peso = nuevoPeso;
      // Dibuja los circulos y flechas actualizados
      dibujarFlechaAndNodos();
  }
 }
}

function actualizarNodo(e) {
  if(opc==5){
  // Busca el circulo que se ha clickeado
  const circuloEncontrado = buscarCirculo(e.offsetX, e.offsetY);
  // Si se encuentra un circulo
  if (circuloEncontrado) {
    var nuevoRadio = parseInt(newRadioInput.value);
    var nuevoId = newIdInput.value;
     // Actualiza el id y el radio del circulo en el arreglo
     const oldId = circuloEncontrado.id;
     circuloEncontrado.id = nuevoId;
     circuloEncontrado.radio = nuevoRadio;
     arrows.forEach((arrow) => {
       if (arrow.startId != null && arrow.startId == oldId) {
         arrow.startId = nuevoId;
         if (arrow.start) arrow.start.id = nuevoId;
       }
       if (arrow.endId != null && arrow.endId == oldId) {
         arrow.endId = nuevoId;
         if (arrow.end) arrow.end.id = nuevoId;
       }
     });
     // Dibuja los circulos y flechas actualizados
     dibujarFlechaAndNodos();
  }
 }
}

function saveArchivo (e){
  // Convertir los arreglos en cadenas JSON
  let nodesJSON = JSON.stringify(nodes);
  let arrowsJSON = JSON.stringify(arrows);
  // Crear un archivo Blob con los datos JSON y el tipo MIME text/plain
  let file = new Blob([nodesJSON, arrowsJSON], {type: "text/plain"});
  // Crear una URL que apunte al archivo Blob
  let url = URL.createObjectURL(file);
  // Crear un elemento a con la URL como href y el atributo download
  let link = document.createElement("a");
  link.href = url;
  link.download = "datos.txt"; // El nombre del archivo que se descargará
  // Añadir el elemento a al documento y hacer clic en él
  document.body.appendChild(link);
  link.click();
  // Eliminar el elemento a del documento y liberar la URL
  document.body.removeChild(link);
  URL.revokeObjectURL(url);  
}






