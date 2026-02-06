<!DOCTYPE html>
<html>
<head>
    <title>RAI Tutor: Smart AI Learning</title>
    <script src="https://aframe.io/releases/1.2.0/aframe.min.js"></script>
    <script src="https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
    <style>
        body { margin: 0; overflow: hidden; font-family: 'Segoe UI', sans-serif; }
        #app-header { position: absolute; top: 0; width: 100%; text-align: center; z-index: 1000; background: white; padding: 10px; border-bottom: 2px solid #FFD700; }
        .logo-img { width: 80px; height: auto; border-radius: 10px; }
        #ui-overlay { position: absolute; bottom: 20px; width: 100%; text-align: center; z-index: 1000; display: none; }
        .btn { padding: 12px 15px; margin: 5px; border-radius: 25px; border: none; background: gold; font-weight: bold; cursor: pointer; box-shadow: 0 4px 8px rgba(0,0,0,0.2); }
        #notes-panel { position: absolute; right: 10px; top: 120px; width: 260px; background: white; border-radius: 15px; padding: 15px; display: none; z-index: 1500; border: 2px solid #00BFFF; }
        #notes-display { font-size: 12px; background: #f9f9f9; padding: 10px; border-radius: 8px; margin-top: 10px; max-height: 150px; overflow-y: auto; color: #333; border: 1px solid #ddd; }
        .lock-screen { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.95); z-index: 2000; display: none; color: white; text-align: center; padding-top: 25%; }
    </style>
</head>
<body onclick="toggleUI()">

    <div id="app-header">
        <img src="1000081864.jpg" class="logo-img" alt="RAI Tutor">
        <p style="margin:2px; font-weight:bold;">RAI Tutor</p>
        <input type="file" id="pdfLoader" accept="application/pdf">
    </div>

    <div id="notes-panel">
        <h3 style="margin:0; color:#00BFFF; font-size: 16px;">RAI AI Notes 📝</h3>
        <button class="btn" style="width:100%; font-size:12px; background: #32CD32; color:white;" onclick="createNotes()">📄 CREATE NOTES</button>
        <div id="notes-display">No notes created yet.</div>
        <button id="download-btn" class="btn" style="width:100%; font-size:12px; background: #FF4500; color:white; display:none; margin-top:10px;" onclick="downloadNotesPDF()">📥 DOWNLOAD PDF</button>
    </div>

    <div id="standard-lock" class="lock-screen">
        <h2 style="color:gold;">RAI Tutor: Standard Ended</h2>
        <p>Trial khatam. Padhne ke liye ₹10 pay karein.</p>
        <button class="btn" onclick="pay('10', 'Standard_Plan')">PAY ₹10 VIA UPI</button>
    </div>

    <div id="premium-lock" class="lock-screen">
        <h2 style="color:deepskyblue;">RAI Tutor: Notes Locked</h2>
        <p>AI Notes ke liye ₹30 pay karein.</p>
        <button class="btn" style="background:deepskyblue; color:white;" onclick="pay('30', 'AI_Notes_Plan')">PAY ₹30 VIA UPI</button>
    </div>

    <div id="ui-overlay">
        <button class="btn" onclick="changePage(-2)">PREV</button>
        <button class="btn" onclick="changePage(2)">NEXT</button>
        <button class="btn" style="background:#00BFFF; color:white;" onclick="toggleNotes()">📝 NOTES</button>
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

        function toggleUI() {
            let ui = document.getElementById('ui-overlay');
            ui.style.display = (ui.style.display === 'block') ? 'none' : 'block';
        }

        function toggleNotes() {
            let panel = document.getElementById('notes-panel');
            panel.style.display = (panel.style.display === 'block') ? 'none' : 'block';
        }

        document.getElementById('pdfLoader').onchange = function(e) {
            let file = e.target.files[0];
            let reader = new FileReader();
            reader.onload = function() {
                let typedarray = new Uint8Array(this.result);
                pdfjsLib.getDocument(typedarray).promise.then(pdf => {
                    pdfDoc = pdf; renderBook();
                });
            };
            reader.readAsArrayBuffer(file);
        };

        function renderPage(num, elementId) {
            if (!pdfDoc || num > pdfDoc.numPages || num < 1) return;
            if (Date.now() - installDate > (30 * 24 * 60 * 60 * 1000)) {
                document.getElementById('standard-lock').style.display = 'block';
                return;
            }
            pdfDoc.getPage(num).then(page => {
                let viewport = page.getViewport({scale: 2.5});
                let canvas = document.createElement('canvas');
                let ctx = canvas.getContext('2d');
                canvas.height = viewport.height; canvas.width = viewport.width;
                page.render({canvasContext: ctx, viewport: viewport}).promise.then(() => {
                    let texture = new THREE.CanvasTexture(canvas);
                    let mesh = document.getElementById(elementId).getObject3D('mesh');
                    mesh.material.map = texture; mesh.material.needsUpdate = true;
                });
            });
        }

        function createNotes() {
            if (Date.now() - installDate > (24 * 60 * 60 * 1000)) {
                document.getElementById('premium-lock').style.display = 'block';
                return;
            }
            let noteText = "RAI Tutor AI Notes - Page " + pageNum + "\n\n1. Concept Analysis: Detailed summary of page content.\n2. Key Formulas: Important points captured.\n3. Exam Tips: Based on UPSC/OPSC patterns.";
            document.getElementById('notes-display').innerText = noteText;
            document.getElementById('download-btn').style.display = 'block';
        }

        function downloadNotesPDF() {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            let content = document.getElementById('notes-display').innerText;
            doc.text("RAI Tutor: Smart AI Learning", 10, 10);
            doc.text("-------------------------------", 10, 15);
            doc.text(content, 10, 25);
            doc.save("RAI_Tutor_Notes_Page_" + pageNum + ".pdf");
            alert("PDF Downloaded Successfully!");
        }

        function renderBook() { renderPage(pageNum, 'leftP'); renderPage(pageNum + 1, 'rightP'); }
        function changePage(offset) { if(pdfDoc) { pageNum += offset; renderBook(); } }
        function pay(amount, plan) {
            let upiId = "9692347234@ptsbi"; // Your Real UPI ID
            window.location.href = `upi://pay?pa=${upiId}&pn=RAI_Tutor&am=${amount}&cu=INR&tn=${plan}`;
        }
    </script>
</body>
</html>
