type RequirementIndicatorProps = {
  required?: boolean;
};

export function RequirementIndicator({ required }: RequirementIndicatorProps) {
  if (required) return <span className="font-semibold text-red-400">*</span>;
  return <span className="text-gray-400 text-xs align-middle">(Opcional)</span>;
}
