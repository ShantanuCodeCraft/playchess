import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

const Piece = ({ children, id, type }: { children: React.ReactNode; id: string; type: string }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id,
    });
    const style = {
        // Outputs `translate3d(x, y, 0)`
        transform: CSS.Translate.toString(transform),
    };
    return (
        <div
            id={id}
            data-type={ type }
            className="  cursor-grab "
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            onMouseDown={(e) => {
                const grabedElement = document.getElementById(e.currentTarget.id);
                if (grabedElement) {
                    grabedElement.style.cursor = "grabbing"
                }
            }}

            onMouseUp={(e) => {
                const grabedElement = document.getElementById(e.currentTarget.id);
                if (grabedElement) {
                    grabedElement.style.cursor = "grab";
                }
            }}
        >
            {children}
        </div>
    );
};

export default Piece;
