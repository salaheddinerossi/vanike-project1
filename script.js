const url = 'ex.pdf';
let pdfDoc = null, pageNum =1 , pageIsRendering = false,pageNumIsPending = null;
const scale =1.5 ,canvas = document.querySelector('#pdf-render'),ctx=canvas.getContext('2d');

//render the page

const  renderPage = num => {
    pageIsRendering = true;
    pdfDoc.getPage(num).then(page => {
        //set scale 
        const viewport = page.getViewport({scale});
        canvas.height= viewport.height;
        canvas.width= viewport.width;
        const renderCtx = {
            canvasContext:ctx,
            viewport
        }
        page.render(renderCtx).promise.then(() => {
            pageIsRendering = false;
            if (pageNumIsPending !== null) {
              renderPage(pageNumIsPending);
              pageNumIsPending = null;
            }
          });
      
          // Output current page
          document.querySelector('#page-num').textContent = num;
        });
}

// Check for pages render 
const queueRenderPage = num => {
    if(pageIsRendering){
        pageNumIsPending = num; 
    }
    else{
        renderPage(num);
    }
}
//show prev 
const showPrevPage = () => {
    if (pageNum <= 1 ){
        return;
    }
    pageNum--;
    queueRenderPage(pageNum);
}
//show next 
const showNextPage = () => {
    if (pageNum >= pdfDoc.numPages ){
        return;
    }
    pageNum++;
    queueRenderPage(pageNum);
}
// get the document 
pdfjsLib.getDocument(url).promise.then(pdfDoc_ => {
    pdfDoc=pdfDoc_;
    document.querySelector('#page-count').textContent = pdfDoc.numPages;
    renderPage(pageNum);
})
//button events 
document.querySelector('#prev-page').addEventListener('click',showPrevPage);
document.querySelector('#next-page').addEventListener('click',showNextPage);