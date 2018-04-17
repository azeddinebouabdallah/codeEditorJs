
function launch(){
  const textArea = document.getElementById('codemirror-textarea')
  const editor = CodeMirror.fromTextArea(textArea, {
    lineNumbers: true,
    mode: 'css',
    theme: '3024-day'
  })
}

launch()
