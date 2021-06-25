import { ButtonGizmo } from "./button-gizmo";
import { PreviewGizmo } from "./preview-gizmo";
import { GizmoType } from "./_gizmo";

export const allGizmoKinds: GizmoType[] = [
    ButtonGizmo.new(),
    PreviewGizmo.new(),
]

