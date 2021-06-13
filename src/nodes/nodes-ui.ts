
/**
 * All UI besides the canvas itself
 */
export class NodesSidePanel {

    private constructor(private context: HTMLDivElement) {

    }

    public static new(context: HTMLDivElement) : NodesSidePanel {
        return new NodesSidePanel(context);
    }

    
}