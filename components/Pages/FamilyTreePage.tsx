
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { AppData, FamilyMember } from '../../types';
import SectionHeader from '../SectionHeader';
import { PageTransition } from '../CommonLayout';
import { searchMembersByName, findMemberAndPath } from '../Admin/treeUtils';

const MemberCard: React.FC<{ 
  member: FamilyMember; 
  level: number; 
  onClick: () => void; 
  isExpanded: boolean;
  isHighlighted?: boolean;
  isFocusedBranch?: boolean;
  isDimmed?: boolean;
}> = ({ member, level, onClick, isExpanded, isHighlighted, isFocusedBranch, isDimmed }) => {
  const isFemale = member.gender === 'female';
  const hasChildren = member.children && member.children.length > 0;

  // تحديد ألوان الإطار عند التركيز بناءً على النوع والمستوى
  const focusRingStyles = level === 0 
    ? "ring-amber-500 shadow-[0_0_25px_rgba(245,158,11,0.4)]"
    : isFemale 
      ? "ring-rose-500 shadow-[0_0_25px_rgba(244,63,94,0.3)]" 
      : "ring-emerald-600 shadow-[0_0_25px_rgba(5,150,105,0.3)]";

  const cardStyles = level === 0 
    ? "bg-gradient-to-br from-emerald-800 to-emerald-950 text-white border-amber-400 shadow-amber-500/20 ring-4 ring-amber-500/10" 
    : isFemale 
      ? "bg-white dark:bg-slate-900 border-rose-200 dark:border-rose-900/30 text-slate-900 dark:text-rose-50 shadow-rose-500/5"
      : "bg-white dark:bg-slate-900 border-emerald-100 dark:border-emerald-900/30 text-slate-900 dark:text-emerald-50 shadow-emerald-500/5";

  const genderIcon = isFemale ? "👩" : "👨";
  const borderClass = isFemale ? "rounded-[1.5rem] md:rounded-[2rem]" : "rounded-xl md:rounded-2xl";

  return (
    <div 
      id={`member-${member.id}`}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      className={`relative group cursor-pointer transition-all duration-500 transform 
        ${isHighlighted ? 'scale-110 ring-4 ring-amber-500 ring-offset-4 dark:ring-offset-slate-950 z-50 shadow-2xl' : ''}
        ${isFocusedBranch && !isHighlighted ? `ring-2 ${focusRingStyles} z-40 scale-105` : ''}
        ${isDimmed ? 'opacity-30 grayscale-[0.8] scale-95 blur-[1px] z-0 pointer-events-auto' : 'z-10'}
        ${!isHighlighted && !isDimmed && !isFocusedBranch ? 'hover:-translate-y-1' : ''}
        select-none ${hasChildren ? 'active:scale-95' : ''}`}
    >
      <div className={`
        px-3 py-3 md:px-5 md:py-4 border-2 shadow-xl min-w-[140px] md:min-w-[200px] max-w-[240px] text-center relative z-10
        ${cardStyles} ${borderClass}
        ${isExpanded && hasChildren ? 'ring-2 ring-emerald-500/50' : ''}
      `}>
        <div className="flex flex-col items-center gap-0.5 md:gap-1">
          <span className="text-sm md:text-lg">{genderIcon}</span>
          <p className="text-[7px] md:text-[9px] opacity-60 font-medium italic">
            {level === 0 ? 'المؤسس' : level === 1 ? 'الجيل الأول' : `الجيل ${level + 1}`}
          </p>
          <h4 className="text-xs md:text-base font-black leading-tight">
            {member.name} 
            {member.isDeceased && <span className="text-[8px] md:text-[10px] block font-medium opacity-70 mt-1 italic">(رحمه الله)</span>}
          </h4>
          
          {member.spouse && (
            <div className="mt-1.5 md:mt-2 pt-1.5 md:pt-2 border-t border-current/10 w-full">
              <p className={`text-[8px] md:text-[10px] font-bold ${isFemale ? 'text-rose-500' : 'text-emerald-600 dark:text-emerald-400'}`}>
                {isFemale ? 'زوجها: ' : 'زوجته: '} {member.spouse}
              </p>
            </div>
          )}
        </div>

        {hasChildren && (
          <div className={`absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center text-[7px] md:text-[8px] shadow-lg transition-transform duration-500 ${isExpanded ? 'bg-emerald-500 rotate-180' : 'bg-slate-800'} text-white`}>
            ▼
          </div>
        )}
      </div>
    </div>
  );
};

const TreeBranch: React.FC<{ 
  member: FamilyMember; 
  level: number; 
  forceExpandAll?: boolean;
  highlightedId?: string | null;
  expandedIds?: Set<string>;
  focusedId: string | null;
  setFocusedId: (id: string | null) => void;
  parentId: string | null;
}> = ({ member, level, forceExpandAll, highlightedId, expandedIds, focusedId, setFocusedId, parentId }) => {
  // تفعيل الحالة بناءً على خيار "توسيع الكل" أو المستوى
  const [localExpanded, setLocalExpanded] = useState((forceExpandAll ?? false) || level < 1);
  const hasChildren = member.children && member.children.length > 0;
  const isFirstRun = useRef(true);

  // مراقبة التغييرات في "توسيع الكل" لضمان التحديث التفرعي الصحيح
  useEffect(() => {
    if (forceExpandAll === true) {
      setLocalExpanded(true);
    } else if (forceExpandAll === false && !isFirstRun.current) {
      // عند الطي، نغلق الجميع باستثناء الجذر
      setLocalExpanded(level < 1);
    }
    isFirstRun.current = false;
  }, [forceExpandAll, level]);

  // مراقبة الأعضاء المحددين من البحث
  useEffect(() => {
    if (expandedIds && expandedIds.has(member.id)) {
      setLocalExpanded(true);
    }
  }, [expandedIds, member.id]);

  // منطق وضع التركيز (Focus Mode)
  const isSourceOfFocus = focusedId === member.id;
  const isChildOfFocus = focusedId === parentId;
  const isFocusRelated = isSourceOfFocus || isChildOfFocus;
  const isDimmed = focusedId !== null && !isFocusRelated && highlightedId !== member.id;

  const toggleExpand = () => {
    if (hasChildren) setLocalExpanded(!localExpanded);
  };

  return (
    <div className={`flex flex-col items-center relative transition-all duration-500`}>
      <MemberCard 
        member={member} 
        level={level} 
        isExpanded={localExpanded} 
        isHighlighted={highlightedId === member.id}
        isFocusedBranch={isFocusRelated}
        isDimmed={isDimmed}
        onClick={() => {
          toggleExpand();
          setFocusedId(member.id === focusedId ? null : member.id);
        }} 
      />

      {hasChildren && localExpanded && (
        <div className="flex flex-col items-center pt-6 md:pt-8 w-full animate-in fade-in slide-in-from-top-2 duration-500">
          <div className="w-[2px] h-6 md:h-8 bg-gradient-to-b from-emerald-500 to-emerald-200 dark:to-emerald-800"></div>
          
          <div className="relative flex justify-center gap-2 md:gap-8 w-full px-2">
            {member.children!.length > 1 && (
              <div className="absolute top-0 left-[10%] right-[10%] h-[2px] bg-emerald-200 dark:bg-emerald-800 rounded-full"></div>
            )}
            
            {member.children!.map((child) => (
              <div key={child.id} className="relative flex flex-col items-center">
                <div className="w-[2px] h-3 md:h-4 bg-emerald-200 dark:bg-emerald-800"></div>
                <TreeBranch 
                  member={child} 
                  level={level + 1} 
                  forceExpandAll={forceExpandAll} 
                  highlightedId={highlightedId}
                  expandedIds={expandedIds}
                  focusedId={focusedId}
                  setFocusedId={setFocusedId}
                  parentId={member.id}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const FamilyTreePage: React.FC<{ data: AppData }> = ({ data }) => {
  const treeRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportType, setExportType] = useState<'png' | 'pdf' | 'print' | null>(null);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [forceExpandAll, setForceExpandAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [focusedId, setFocusedId] = useState<string | null>(null);
  
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);

  const onMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    if ((e.target as HTMLElement).closest('input, button, .export-menu')) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setStartY(e.pageY - scrollContainerRef.current.offsetTop);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
    setScrollTop(scrollContainerRef.current.scrollTop);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const y = e.pageY - scrollContainerRef.current.offsetTop;
    const walkX = (x - startX) * 1.5;
    const walkY = (y - startY) * 1.5;
    scrollContainerRef.current.scrollLeft = scrollLeft - walkX;
    scrollContainerRef.current.scrollTop = scrollTop - walkY;
  };

  const stopDragging = () => setIsDragging(false);

  const treeData = data.familyTree;

  const searchResults = useMemo(() => {
    if (!treeData || searchQuery.trim().length < 2) return [];
    return searchMembersByName(treeData, searchQuery).slice(0, 10);
  }, [treeData, searchQuery]);

  const handleSelectMember = (member: FamilyMember) => {
    if (!treeData) return;
    const result = findMemberAndPath(treeData, member.id);
    if (result) {
      const newExpanded = new Set<string>();
      result.path.forEach(p => newExpanded.add(p.id));
      setExpandedIds(newExpanded);
      setHighlightedId(member.id);
      setFocusedId(member.id);
      setSearchQuery('');
      setTimeout(() => {
        const el = document.getElementById(`member-${member.id}`);
        if (el && scrollContainerRef.current) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
        }
      }, 300);
    }
  };

  const runExport = async (type: 'png' | 'pdf' | 'print') => {
    if (!treeRef.current) return;
    setIsExporting(true);
    setExportType(type);
    setShowExportMenu(false);
    
    const prevExpand = forceExpandAll;
    const prevFocus = focusedId;
    
    // توسيع الكل وإزالة التركيز لضمان تصدير نظيف
    setForceExpandAll(true);
    setFocusedId(null);

    // إضافة كلاس لتعطيل الانيميشن أثناء التصدير لمنع الشاشة البيضاء
    document.body.classList.add('exporting-tree');

    try {
      // Use any casting for global objects to avoid TypeScript "not callable" errors
      // @ts-ignore
      const jsPDF = (window as any).jspdf?.jsPDF;
      // @ts-ignore
      const html2canvas = (window as any).html2canvas;

      if (!html2canvas) throw new Error("html2canvas not loaded");

      // وقت إضافي لضمان انتهاء الانتقالات البصرية واستقرار الشجرة
      await new Promise(r => setTimeout(r, 2000));

      const canvas = await html2canvas(treeRef.current, {
        backgroundColor: '#fffbeb',
        scale: 2, // تقليل الـ scale قليلاً لضمان عدم تجاوز حدود الذاكرة في المتصفح للأشجار الكبيرة جداً
        useCORS: true,
        logging: false,
        allowTaint: true,
        imageTimeout: 0,
        scrollX: 0,
        scrollY: 0,
        onclone: (clonedDoc: Document) => {
          const element = clonedDoc.getElementById('export-target');
          if (element) {
            element.style.padding = '100px';
            element.style.backgroundImage = 'none';
            element.style.backgroundColor = '#fffbeb';
            element.style.border = '20px solid #064e3b';
            
            // إزالة كافة كلاسات الانيميشن من النسخة المستنسخة لضمان الظهور الكامل
            const animatedElements = element.querySelectorAll('.animate-in, .fade-in, .slide-in-from-top-2');
            animatedElements.forEach((el: any) => {
              el.classList.remove('animate-in', 'fade-in', 'slide-in-from-top-2', 'duration-500');
              el.style.opacity = '1';
              el.style.transform = 'none';
            });

            const allText = element.querySelectorAll('h4, p, span');
            allText.forEach((el: any) => {
              el.style.webkitFontSmoothing = 'antialiased';
              el.style.textRendering = 'optimizeLegibility';
            });
          }
        }
      });
      
      const fileName = `شجرة_أواصر_مليباري_${new Date().toLocaleDateString('ar-SA')}`;

      if (type === 'png') {
        const link = document.createElement('a');
        link.download = `${fileName}.png`;
        link.href = canvas.toDataURL('image/png', 1.0);
        link.click();
      } else if (type === 'pdf') {
        // Check if jsPDF constructor is valid before using 'new'
        if (typeof jsPDF !== 'function') throw new Error("jsPDF not loaded");
        const imgData = canvas.toDataURL('image/jpeg', 0.9); 
        const pdf = new jsPDF({
          orientation: canvas.width > canvas.height ? 'l' : 'p',
          unit: 'px',
          format: [canvas.width / 2, canvas.height / 2]
        });
        pdf.addImage(imgData, 'JPEG', 0, 0, canvas.width / 2, canvas.height / 2);
        pdf.save(`${fileName}.pdf`);
      } else if (type === 'print') {
        const imgData = canvas.toDataURL('image/png');
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.write(`
            <html>
              <head><title>${fileName}</title></head>
              <body style="margin:0; padding:0; display:flex; justify-content:center; align-items:center; background:#fffbeb;">
                <img src="${imgData}" style="max-width:100%; height:auto;" />
                <script>setTimeout(() => { window.print(); window.close(); }, 500);</script>
              </body>
            </html>
          `);
          printWindow.document.close();
        }
      }
    } catch (err) {
      console.error('Error exporting:', err);
      alert('حدث خطأ أثناء تصدير الشجرة.');
    } finally {
      document.body.classList.remove('exporting-tree');
      setIsExporting(false);
      setExportType(null);
      setForceExpandAll(prevExpand);
      setFocusedId(prevFocus);
    }
  };

  if (!treeData) {
    return (
      <div className="pt-60 pb-40 text-center">
        <h2 className="text-2xl font-black opacity-30">لم يتم إدخال بيانات الشجرة بعد.</h2>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="pt-32 md:pt-40 pb-40 px-4 md:px-6 min-h-screen text-right" dir="rtl">
        
        <div className="max-w-6xl mx-auto mb-10">
          <SectionHeader 
            title="شجرة العائلة التفاعلية" 
            subtitle="استكشف جذور عائلتنا الكريمة، ابحث عن الأسماء، ووسع الفروع بلمسة واحدة." 
          />
          
          <div className="flex flex-col lg:flex-row gap-6 items-center bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-800">
            <div className="relative flex-grow w-full">
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-xl">🔍</div>
              <input 
                type="text" 
                placeholder="ابحث عن فرد بالعائلة..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 p-4 pr-12 rounded-2xl border-2 border-transparent focus:border-emerald-500 outline-none font-bold transition-all dark:text-white"
              />
              
              {searchResults.length > 0 && (
                <div className="absolute top-full right-0 left-0 mt-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-2xl z-[100] overflow-hidden animate-in slide-in-from-top-2">
                  {searchResults.map(res => (
                    <button 
                      key={res.id} 
                      onClick={() => handleSelectMember(res)}
                      className="w-full text-right p-4 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 flex items-center justify-between border-b last:border-none border-slate-50 dark:border-slate-800 transition-colors"
                    >
                      <span className="font-black text-slate-800 dark:text-white">{res.name}</span>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">فتح الموقع ⤶</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-3 w-full lg:w-auto relative">
              <button 
                onClick={() => { 
                  const nextState = !forceExpandAll;
                  setForceExpandAll(nextState); 
                  if (!nextState) setFocusedId(null); 
                }}
                className={`flex-grow lg:flex-grow-0 px-6 py-4 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 shadow-lg ${
                  forceExpandAll 
                  ? 'bg-amber-500 text-white ring-4 ring-amber-500/20' 
                  : 'bg-white dark:bg-slate-800 text-emerald-700 border border-emerald-100 dark:border-emerald-800'
                }`}
              >
                {forceExpandAll ? '📂 طي الشجرة' : '📂 توسيع الكل'}
              </button>
              
              <div className="relative flex-grow lg:flex-grow-0">
                <button 
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  disabled={isExporting}
                  className="w-full bg-emerald-800 hover:bg-emerald-700 text-white px-6 py-4 rounded-2xl font-black shadow-xl flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50 text-sm"
                >
                  {isExporting ? (
                    <>
                      <span className="animate-spin text-xl">⏳</span>
                      <span>جاري {exportType === 'pdf' ? 'توليد PDF' : exportType === 'print' ? 'تحضير الطباعة' : 'التصدير'}...</span>
                    </>
                  ) : (
                    <>
                      <span>💾 خيارات الحفظ والطباعة</span>
                      <span className={`transition-transform duration-300 ${showExportMenu ? 'rotate-180' : ''}`}>▼</span>
                    </>
                  )}
                </button>

                {showExportMenu && (
                  <div className="export-menu absolute top-full left-0 right-0 mt-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-2xl z-[110] overflow-hidden animate-in zoom-in-95 origin-top-right">
                    <button onClick={() => runExport('png')} className="w-full text-right p-4 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 flex items-center gap-3 font-bold text-slate-700 dark:text-white border-b border-slate-50 dark:border-slate-800">
                      <span className="text-xl">📷</span> حفظ كصورة (PNG)
                    </button>
                    <button onClick={() => runExport('pdf')} className="w-full text-right p-4 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 flex items-center gap-3 font-bold text-slate-700 dark:text-white border-b border-slate-50 dark:border-slate-800">
                      <span className="text-xl">📄</span> حفظ كملف (PDF)
                    </button>
                    <button onClick={() => runExport('print')} className="w-full text-right p-4 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 flex items-center gap-3 font-bold text-slate-700 dark:text-white">
                      <span className="text-xl">🖨️</span> طباعة الشجرة
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div 
          ref={scrollContainerRef}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={stopDragging}
          onMouseLeave={stopDragging}
          onClick={(e) => { 
            if (e.target === scrollContainerRef.current) setFocusedId(null); 
          }}
          className={`relative overflow-auto py-20 custom-scrollbar-h cursor-grab active:cursor-grabbing select-none h-[70vh] bg-slate-50 dark:bg-slate-950 rounded-[4rem] border-2 border-slate-200 dark:border-slate-800 transition-colors`}
        >
          <div 
            id="export-target"
            className="inline-flex min-w-full justify-center px-20 md:px-60 pb-40" 
            ref={treeRef}
          >
            <TreeBranch 
              member={treeData} 
              level={0} 
              forceExpandAll={forceExpandAll} 
              highlightedId={highlightedId}
              expandedIds={expandedIds}
              focusedId={focusedId}
              setFocusedId={setFocusedId}
              parentId={null}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10 max-w-4xl mx-auto">
           <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] shadow-xl border border-slate-100 dark:border-slate-800 flex flex-col gap-3 justify-center">
              <div className="flex items-center gap-3">
                 <div className="w-4 h-4 rounded-full bg-emerald-700"></div>
                 <span className="text-xs md:text-sm font-bold">رجال العائلة (أخضر عميق)</span>
              </div>
              <div className="flex items-center gap-3">
                 <div className="w-4 h-4 rounded-full bg-rose-400"></div>
                 <span className="text-xs md:text-sm font-bold">نساء العائلة (وردي ناعم)</span>
              </div>
           </div>
           <div className="bg-amber-50 dark:bg-amber-950/20 p-6 rounded-[2rem] border border-amber-200 dark:border-amber-900/30">
              <p className="text-xs font-bold text-amber-800 dark:text-amber-400 leading-relaxed">
                💡 وضع التركيز: انقر على أي شخص لتسليط الضوء عليه وعلى أبنائه المباشرين بلونهم الخاص.<br/>
                💡 توسيع الكل: يقوم بفتح كافة الأجيال في الشجرة بضغطة واحدة.
              </p>
           </div>
        </div>
      </div>
      <style>{`
        .custom-scrollbar-h::-webkit-scrollbar { height: 8px; width: 8px; }
        .custom-scrollbar-h::-webkit-scrollbar-thumb { background: #059669; border-radius: 10px; border: 2px solid transparent; background-clip: content-box; }
        .custom-scrollbar-h::-webkit-scrollbar-track { background: transparent; }
      `}</style>
    </PageTransition>
  );
};
