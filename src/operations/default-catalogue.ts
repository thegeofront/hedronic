// purpose:     the hardcoded default cores 

import { ButtonGizmo } from "../gizmos/button-gizmo";
import { PreviewGizmo } from "../gizmos/preview-gizmo";
import { GizmoCore } from "../gizmos/_gizmo";
import { AND, EXPAND, IN, MULTI, NOT, OR, OUT } from "./functions";
import { FN } from "./operation-core";

export const defaultGizmos: GizmoCore[] = [
    ButtonGizmo.new(),
    PreviewGizmo.new(),
]

export const defaultOperations: FN[] = [
    IN,
    OUT,
    AND,
    OR,
    NOT,
    MULTI,
    EXPAND,
];
