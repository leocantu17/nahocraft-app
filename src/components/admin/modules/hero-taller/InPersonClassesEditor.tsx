import type { InPersonClassProgram } from '../../../../types';

export interface InPersonClassesEditorProps {
  inPersonClasses: InPersonClassProgram[];
  onUpdateInPersonClasses: (classes: InPersonClassProgram[]) => void;
}

export function InPersonClassesEditor({
  inPersonClasses,
  onUpdateInPersonClasses,
}: InPersonClassesEditorProps) {
  return (
    <div className="bg-white p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-black/[0.04] space-y-6">
      <h3 className="font-serif text-xl text-neutral-900 font-normal">
        Programas de Clases Presenciales ({inPersonClasses.length})
      </h3>

      <div className="space-y-6">
        {inPersonClasses.map((cls, idx) => (
          <div
            key={cls.id}
            className="p-5 bg-[#F5F2EB]/50 border border-black/[0.06] rounded-xl space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400 mb-1">
                  Título del Programa
                </label>
                <input
                  type="text"
                  value={cls.title}
                  onChange={(e) => {
                    const next = [...inPersonClasses];
                    next[idx] = { ...cls, title: e.target.value };
                    onUpdateInPersonClasses(next);
                  }}
                  className="w-full py-1.5 bg-transparent border-b border-neutral-300 focus:border-naho-pink text-xs font-semibold text-neutral-900 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400 mb-1">
                  Público / Rango de Edad
                </label>
                <input
                  type="text"
                  value={cls.ageRange}
                  onChange={(e) => {
                    const next = [...inPersonClasses];
                    next[idx] = { ...cls, ageRange: e.target.value };
                    onUpdateInPersonClasses(next);
                  }}
                  className="w-full py-1.5 bg-transparent border-b border-neutral-300 focus:border-naho-pink text-xs text-neutral-900 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400 mb-1">
                  Horario y Frecuencia
                </label>
                <input
                  type="text"
                  value={cls.scheduleSummary}
                  onChange={(e) => {
                    const next = [...inPersonClasses];
                    next[idx] = { ...cls, scheduleSummary: e.target.value };
                    onUpdateInPersonClasses(next);
                  }}
                  className="w-full py-1.5 bg-transparent border-b border-neutral-300 focus:border-naho-pink text-xs text-neutral-900 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400 mb-1">
                  Precio / Cuota Mensual
                </label>
                <input
                  type="text"
                  value={cls.priceInfo}
                  onChange={(e) => {
                    const next = [...inPersonClasses];
                    next[idx] = { ...cls, priceInfo: e.target.value };
                    onUpdateInPersonClasses(next);
                  }}
                  className="w-full py-1.5 bg-transparent border-b border-neutral-300 focus:border-naho-pink text-xs font-mono text-neutral-900 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400 mb-1">
                Descripción del Programa
              </label>
              <textarea
                rows={2}
                value={cls.description}
                onChange={(e) => {
                  const next = [...inPersonClasses];
                  next[idx] = { ...cls, description: e.target.value };
                  onUpdateInPersonClasses(next);
                }}
                className="w-full p-2 bg-white border border-neutral-200 text-xs text-neutral-700 rounded focus:outline-none"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

