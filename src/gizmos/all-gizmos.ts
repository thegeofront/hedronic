import { ButtonGizmo } from "./button-gizmo";
import { PreviewGizmo } from "./preview-gizmo";
import { GizmoCore } from "./_gizmo";

export const allGizmoKinds: GizmoCore[] = [
    ButtonGizmo.new(),
    PreviewGizmo.new(),
]

