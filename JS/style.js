require('./node_modules/jquery/dist/jquery.js')

TreeView = require('js-treeview')

tree = new TreeView([
    { name: 'Item 1', children: [] },
    { name: 'Item 2', expanded: true, children: [
            { name: 'Sub Item 1', children: [] },
            { name: 'Sub Item 2', children: [] }
        ]
    }
], 'treeview');

tree.on('collapse', function (e) {
    console.log(JSON.stringify(e));
});


function selection(panelIndex) {
  const buttons = document.querySelectorAll('.nav-button')
  const content = document.querySelectorAll('.code-workspace')
  const areas = document.querySelectorAll('.area')
  areas.forEach((node) => {
    node.setAttribute('id', '')
  })
  buttons.forEach((node) => {
    node.style.backgroundColor = '#ecf0f1'
  })
  content.forEach((node) => {
    node.style.display = 'none'
  })
  buttons[panelIndex].style.backgroundColor = '#bdc3c7'
  const textArea = content[panelIndex].childNodes

  content[panelIndex].style.display = 'block'

  areas[panelIndex].setAttribute('id', 'codemirror-textarea')
//  require('scriptCodeHighlighter.js')
  launch()
}
