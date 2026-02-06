
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RAI Tutor: Smart AI Learning</title>
    <script src="https://aframe.io/releases/1.2.0/aframe.min.js"></script>
    <script src="https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
    
    <style>
        body { margin: 0; overflow: hidden; font-family: 'Segoe UI', sans-serif; }
        #app-header { 
            position: absolute; top: 0; width: 100%; text-align: center; 
            z-index: 1000; background: white; padding: 10px; 
            border-bottom: 2px solid #FFD700; 
        }
        .logo-img { width: 80px; height: 80px; border-radius: 10px; object-fit: cover; }
        #ui-overlay { 
            position: absolute; bottom: 20px; width: 100%; 
            text-align: center; z-index: 1000; display: none; 
        }
        .btn { 
            padding: 12px 15px; margin: 5px; border-radius: 25px; 
            border: none; background: gold; font-weight: bold; 
            cursor: pointer; box-shadow: 0 4px 8px rgba(0,0,0,0.2); 
        }
        #notes-panel { 
            position: absolute; right: 10px; top: 120px; width: 260px; 
            background: white; border-radius: 15px; padding: 15px; 
            display: none; z-index: 1500; border: 2px solid #00BFFF; 
        }
        .lock-screen { 
            position: absolute; top: 0; left: 0; width: 100%; height: 100%; 
            background: rgba(0,0,0,0.95); z-index: 2000; display: none; 
            color: white; text-align: center; padding-top: 25%; 
        }
    </style>
</head>
<body>

<div id="app-header">
    <img src="1000081883.jpg" class="logo-img" alt="RAI Tutor Logo">
    <p style="margin:2px; font-weight:bold;">RAI Tutor</p>
    <input type="file" id="pdfLoader" accept="application/pdf">
</div>

<div id="notes-panel">
    <h3 style="margin:0; color:#00BFFF;">RAI AI Notes 📝</h3>
    <div id="notes-display" style="font-size:12px; margin-top:10px;">No notes yet.</div>
</div>

<div id="ui-overlay">
    <button class="btn" onclick="changePage(-2)">PREV</button>
    <button class="btn" onclick="changePage(2)">NEXT</button>
</div>

<a-scene embedded arjs="sourceType: webcam; debugUIEnabled: false;">
    <a-entity id="book-anchor" position="0 0 -2.5">
        <a-box id="leftP" position="-0.55 0 0" width="1" height="1.4" depth="0.04" material="color: white"></a-box>
        <a-box id="rightP" position="0.55 0 0" width="1" height="1.4" depth="0.04" material="color: white"></a-box>
    </a-entity>
    <a-entity camera></a-entity>
</a-scene>

<script>
    let pdfDoc = null, pageNum = 1;
    let installDate = localStorage.getItem('installDate') || Date.now();
    localStorage.setItem('installDate', installDate);

    document.getElementById('pdfLoader').onchange = function(e) {
        let file = e.target.files[0];
        let reader = new FileReader();
        reader.onload = function() {
            let typedarray = new Uint8Array(this.result);
            pdfjsLib.getDocument(typedarray).promise.then(pdf => {
                pdfDoc = pdf;
                document.getElementById('ui-overlay').style.display = 'block';
                renderBook();
            });
        };
        reader.readAsArrayBuffer(file);
    };

    function renderPage(num, elementId) {
        if (!pdfDoc || num > pdfDoc.numPages || num < 1) return;
        pdfDoc.getPage(num).then(page => {
            let viewport = page.getViewport({scale: 2});
            let canvas = document.createElement('canvas');
            let ctx = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            page.render({canvasContext: ctx, viewport: viewport}).promise.then(() => {
                let texture = new THREE.CanvasTexture(canvas);
                let mesh = document.getElementById(elementId).getObject3D('mesh');
                mesh.material.map = texture;
                mesh.material.needsUpdate = true;
            });
        });
    }

    function renderBook() {
        renderPage(pageNum, 'leftP');
        renderPage(pageNum + 1, 'rightP');
    }

    function changePage(offset) {
        if(pdfDoc) {
            pageNum += offset;
            renderBook();
        }
    }
</script>

</body>
</html>
