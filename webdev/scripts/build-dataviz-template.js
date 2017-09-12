var body = document.body;
var header = document.createElement('header');

var h1 = document.createElement('h1');
h1.innerHTML = 'CSC630: Template';
var h3 = document.createElement('h3');
h3.innerHTML = 'Rudd Fawcett // Data Visualization';

header.appendChild(h1);
header.appendChild(h3);

var container = document.createElement('div');
container.setAttribute('class', 'container dataviz');

var main = document.createElement('main');
var title = document.createElement('h3');
title.innerHTML = 'SVG Demo';

var graphic = document.createElement('img');
graphic.setAttribute('src', 'assets/images/demo.svg');

var explanation = document.createElement('p');
explanation.innerHTML = 'This is an explanation for the graphic above. (In this case it is an SVG.)';

main.appendChild(title);
main.appendChild(graphic);
main.appendChild(explanation);

container.appendChild(main);

body.appendChild(header);
body.appendChild(container);
