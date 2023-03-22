import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';

// Declare a type for the canvas object
type FabricCanvas = fabric.Canvas | null;
interface Props {
  canvas: FabricCanvas;
  setCanvas: Dispatch<SetStateAction<FabricCanvas>>;
  onCanvasUpdate: (canvas: FabricCanvas) => void;
  controls: boolean;
}

const canvasID = 'canvas';

const App = ({ canvas, setCanvas, onCanvasUpdate, controls }: Props) => {
  const [tool, setTool] = useState<'Pencil' | 'Eraser'>('Pencil');
  const canvasRef = useRef(null);
  const initCanvas = () => {
    const fabCanvas = new fabric.Canvas(canvasID, {
      backgroundColor: 'white',
      width: window.innerWidth - 100,
      height: window.innerHeight - 400,
      isDrawingMode: true,
    });
    return fabCanvas;
  };

  const toggleDraw = () => {
    if (tool === 'Pencil') return;
    if (canvas) {
      //   canvas.isDrawingMode = !canvas.isDrawingMode;
      canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
      setTool('Pencil');
    }
  };

  const toggleEraser = () => {
    if (tool === 'Eraser') return;
    if (canvas) {
      // EraserBrush exists but no @types
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      canvas.freeDrawingBrush = new fabric.EraserBrush(canvas);
      canvas.freeDrawingBrush.width = 40;
    }
    setTool('Eraser');
  };

  useEffect(() => {
    const newCanvas = initCanvas();
    newCanvas.on('path:created', () => {
      // some event
      onCanvasUpdate(newCanvas);
    });
    setCanvas(newCanvas);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setCanvas]);

  return (
    <div style={{ textAlign: 'center' }}>
      {controls && (
        <>
          {' '}
          <button
            onClick={toggleDraw}
            style={{ backgroundColor: tool === 'Pencil' ? 'yellow' : 'white' }}
          >
            &#9998;
          </button>
          <button
            onClick={toggleEraser}
            style={{ backgroundColor: tool === 'Eraser' ? 'yellow' : 'white' }}
          >
            erase
          </button>
        </>
      )}
      <div
        className='App'
        style={{
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <canvas
          id={canvasID}
          style={{ border: '2px solid black' }}
          ref={canvasRef}
        />
      </div>
    </div>
  );
};
export default App;
