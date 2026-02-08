
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { AppData, FamilyMember } from '../../types';
import { 
  updateMemberInTree, 
  addChildToTree, 
  deleteMemberFromTree,
  findMemberAndPath,
  searchMembersByName
} from './treeUtils';

interface Props {
  formData: AppData;
  updateField: (field: keyof AppData, value: any) => void;
}

export const FamilyTreeAdmin: React.FC<Props> = ({ formData, updateField }) => {
  const [focusId, setFocusId] = useState<string | null>(null);
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // حالة للتعديل السريع للاسم في مكانه
  const [inlineEditingId, setInlineEditingId] = useState<string | null>(null);
  const [inlineName, setInlineName] = useState('');
  const inlineInputRef = useRef<HTMLInputElement>(null);

  // حالة نافذة التأكيد المخصصة للحذف
  const [memberToDelete, setMemberToDelete] = useState<{id: string, name: string} | null>(null);

  const tree = formData.familyTree || null;

  // استخراج العضو الحالي والمسار
  const activeView = useMemo(() => {
    if (!tree) return null;
    if (!focusId) return { member: tree, path: [tree] };
    const result = findMemberAndPath(tree, focusId);
    return result || { member: tree, path: [tree] };
  }, [tree, focusId]);

  // تحديث الـ focusId في حال اختفاء العضو
  useEffect(() => {
    if (tree && focusId) {
      const exists = findMemberAndPath(tree, focusId);
      if (!exists) setFocusId(tree.id);
    }
  }, [tree, focusId]);

  // فوكس تلقائي عند بدء التعديل السريع
  useEffect(() => {
    if (inlineEditingId && inlineInputRef.current) {
      inlineInputRef.current.focus();
      inlineInputRef.current.select();
    }
  }, [inlineEditingId]);

  // نتائج البحث
  const searchResults = useMemo(() => {
    if (!tree || searchQuery.trim().length < 2) return [];
    return searchMembersByName(tree, searchQuery).slice(0, 10);
  }, [tree, searchQuery]);

  const generateId = () => 'm-' + Math.random().toString(36).substring(2, 15);

  const initTree = () => {
    const root: FamilyMember = {
      id: 'root-' + Date.now(),
      name: 'محي الدين مليباري',
      gender: 'male',
      isDeceased: true,
      children: []
    };
    updateField('familyTree', root);
    setFocusId(root.id);
  };

  const onAddChild = (parentId: string, gender: 'male' | 'female') => {
    if (!tree) return;
    const treeCopy = structuredClone(tree);
    const newChild: FamilyMember = {
      id: generateId(),
      name: gender === 'male' ? 'ابن جديد' : 'ابنة جديدة',
      gender,
      children: []
    };
    const updatedTree = addChildToTree(treeCopy, parentId, newChild);
    updateField('familyTree', updatedTree);
  };

  const onEditSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMember && tree) {
      const treeCopy = structuredClone(tree);
      const updatedTree = updateMemberInTree(treeCopy, editingMember.id, editingMember);
      updateField('familyTree', updatedTree);
      setEditingMember(null);
    }
  };

  // حفظ التعديل السريع للاسم
  const saveInlineName = (id: string) => {
    if (!tree || !inlineName.trim()) {
      setInlineEditingId(null);
      return;
    }
    const treeCopy = structuredClone(tree);
    const updatedTree = updateMemberInTree(treeCopy, id, { name: inlineName });
    updateField('familyTree', updatedTree);
    setInlineEditingId(null);
  };

  const startInlineEdit = (e: React.MouseEvent, member: FamilyMember) => {
    e.stopPropagation();
    setInlineEditingId(member.id);
    setInlineName(member.name);
  };

  // تنفيذ عملية الحذف الفعلية
  const confirmDeletion = () => {
    if (!memberToDelete || !tree) return;
    
    const id = memberToDelete.id;
    const isRoot = id === tree.id;

    if (isRoot) {
      updateField('familyTree', undefined);
      setFocusId(null);
    } else {
      const treeCopy = structuredClone(tree);
      const updatedTree = deleteMemberFromTree(treeCopy, id);
      updateField('familyTree', updatedTree);
      
      if (focusId === id) {
        const parentId = activeView?.path[activeView.path.length - 2]?.id || tree.id;
        setFocusId(parentId);
      }
    }
    setMemberToDelete(null);
  };

  const selectSearchResult = (member: FamilyMember) => {
    setFocusId(member.id);
    setSearchQuery('');
  };

  if (!tree) {
    return (
      <div className="py-20 text-center animate-in fade-in">
        <div className="text-8xl mb-6">🌳</div>
        <h2 className="text-2xl font-black text-slate-400 dark:text-slate-500 mb-8">شجرة العائلة فارغة</h2>
        <button 
          onClick={initTree}
          className="bg-emerald-600 text-white px-10 py-4 rounded-2xl font-black text-lg shadow-xl hover:bg-emerald-500 transition-all"
        >
          ابدأ بإضافة الجد المؤسس
        </button>
      </div>
    );
  }

  const { member, path } = activeView || { member: tree, path: [tree] };

  return (
    <div className="space-y-8 animate-in fade-in" dir="rtl">
      
      {/* محرك البحث */}
      <div className="relative group">
        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
          <span className="text-xl">🔍</span>
        </div>
        <input 
          type="text"
          placeholder="ابحث عن فرد بالاسم (مثلاً: أحمد)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-slate-50 dark:bg-slate-800 p-5 pr-14 rounded-3xl border-2 border-transparent focus:border-emerald-500 outline-none font-bold transition-all shadow-sm dark:text-white"
        />
        {searchResults.length > 0 && (
          <div className="absolute top-full right-0 left-0 mt-3 bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border border-slate-100 dark:border-slate-800 z-[100] overflow-hidden animate-in slide-in-from-top-2">
            {searchResults.map(result => (
              <button 
                key={result.id}
                onClick={() => selectSearchResult(result)}
                className="w-full text-right p-4 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 flex items-center justify-between border-b last:border-none border-slate-50 dark:border-slate-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{result.gender === 'female' ? '👩' : '👨'}</span>
                  <span className="font-black text-slate-800 dark:text-white">{result.name}</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">انتقال ⤶</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* شريط المسار */}
      <div className="flex flex-wrap items-center gap-2 bg-white dark:bg-slate-800/40 p-3 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-x-auto no-scrollbar">
        {path.map((p, idx) => (
          <React.Fragment key={p.id}>
            <button 
              onClick={() => setFocusId(p.id)}
              className={`text-xs font-black px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                focusId === p.id ? 'bg-emerald-600 text-white' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              {p.name}
            </button>
            {idx < path.length - 1 && <span className="text-slate-300 dark:text-slate-700 text-xs">/</span>}
          </React.Fragment>
        ))}
      </div>

      {/* البطاقة الرئيسية مع خاصية التعديل السريع للاسم */}
      <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 p-8 rounded-[3rem] shadow-2xl relative overflow-hidden text-white border border-emerald-500/30">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative flex flex-col md:flex-row items-center gap-8 z-10">
          <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-4xl border-2 border-white/30 shadow-inner">
            {member.gender === 'female' ? '👩' : '👨'}
          </div>
          <div className="flex-grow text-center md:text-right">
            {inlineEditingId === member.id ? (
              <input 
                ref={inlineInputRef}
                value={inlineName}
                onChange={(e) => setInlineName(e.target.value)}
                onBlur={() => saveInlineName(member.id)}
                onKeyDown={(e) => e.key === 'Enter' && saveInlineName(member.id)}
                className="text-3xl font-black mb-1 bg-white/10 border-b-2 border-white outline-none w-full max-w-md text-white"
              />
            ) : (
              <h3 
                className="text-3xl font-black mb-1 cursor-pointer hover:underline decoration-dotted transition-colors" 
                onClick={(e) => startInlineEdit(e, member)}
                title="اضغط لتعديل الاسم بسرعة"
              >
                {member.name} <span className="text-sm opacity-50">✏️</span>
              </h3>
            )}
            <p className="text-emerald-100 font-bold opacity-80">
              {member.isDeceased ? '(رحمه الله)' : 'حفظه الله'} 
              {member.spouse && ` • شريك الحياة: ${member.spouse}`}
            </p>
          </div>
          <div className="flex gap-3 relative z-20">
             <button onClick={() => setEditingMember(member)} className="bg-white text-emerald-700 px-6 py-3 rounded-2xl font-black text-sm shadow-lg hover:bg-emerald-50 transition-all active:scale-95">⚙️ تفاصيل</button>
             {member.id !== tree.id && (
               <button 
                 onClick={(e) => { e.stopPropagation(); setMemberToDelete({id: member.id, name: member.name}); }}
                 className="bg-red-500/20 hover:bg-red-600 text-white border border-red-400/50 px-6 py-3 rounded-2xl font-black text-sm transition-all active:scale-95"
               >🗑️ حذف</button>
             )}
          </div>
        </div>
      </div>

      {/* قسم الأبناء مع التعديل السريع للاسم */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-center px-4 gap-4">
          <h4 className="text-xl font-black text-slate-800 dark:text-white">قائمة الأبناء ({member.children?.length || 0})</h4>
          <div className="flex gap-2">
            <button onClick={() => onAddChild(member.id, 'male')} className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-xs font-black shadow-lg hover:bg-blue-500 transition-all">+ إضافة ابن 👨</button>
            <button onClick={() => onAddChild(member.id, 'female')} className="bg-rose-500 text-white px-5 py-2.5 rounded-xl text-xs font-black shadow-lg hover:bg-rose-400 transition-all">+ إضافة ابنة 👩</button>
          </div>
        </div>

        {member.children && member.children.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {member.children.map(child => (
              <div 
                key={child.id}
                onClick={() => setFocusId(child.id)}
                className={`group p-6 rounded-[2.5rem] border-2 transition-all hover:shadow-xl relative bg-white dark:bg-slate-900 cursor-pointer ${
                  child.gender === 'female' 
                  ? 'border-rose-100 dark:border-rose-900/30 hover:border-rose-300 dark:hover:border-rose-700' 
                  : 'border-emerald-100 dark:border-emerald-900/30 hover:border-emerald-300 dark:hover:border-emerald-700'
                }`}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${child.gender === 'female' ? 'bg-rose-50 dark:bg-rose-950/40' : 'bg-emerald-50 dark:bg-emerald-950/40'}`}>{child.gender === 'female' ? '👩' : '👨'}</div>
                  <div className="flex-grow overflow-hidden">
                    {inlineEditingId === child.id ? (
                      <input 
                        ref={inlineInputRef}
                        value={inlineName}
                        onChange={(e) => setInlineName(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        onBlur={() => saveInlineName(child.id)}
                        onKeyDown={(e) => e.key === 'Enter' && saveInlineName(child.id)}
                        className="w-full bg-slate-50 dark:bg-slate-800 border-b-2 border-emerald-500 outline-none font-black text-slate-800 dark:text-white"
                      />
                    ) : (
                      <h5 
                        className="font-black text-slate-800 dark:text-white truncate hover:text-emerald-600 transition-colors"
                        onClick={(e) => startInlineEdit(e, child)}
                      >
                        {child.name}
                      </h5>
                    )}
                    <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 mt-0.5">انقر للتعديل السريع</p>
                  </div>
                </div>
                <div className="flex gap-2 relative z-30">
                  <div className="flex-grow bg-slate-100 dark:bg-slate-800 py-3 rounded-xl text-xs font-black group-hover:bg-emerald-600 group-hover:text-white transition-all text-center">تصفح 🔎</div>
                  <button onClick={(e) => { e.stopPropagation(); setEditingMember(child); }} className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 hover:text-emerald-500 dark:hover:text-emerald-400 rounded-xl transition-all" title="تعديل التفاصيل">⚙️</button>
                  <button onClick={(e) => { e.stopPropagation(); setMemberToDelete({id: child.id, name: child.name}); }} className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 hover:text-red-500 rounded-xl transition-all">🗑️</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center bg-slate-50 dark:bg-slate-900 rounded-[3rem] border-4 border-dashed border-slate-200 dark:border-slate-800/50">
            <p className="text-slate-400 dark:text-slate-500 font-bold italic">لا يوجد أبناء حالياً لهذه البطاقة.</p>
          </div>
        )}
      </div>

      {/* نافذة التأكيد المخصصة للحذف */}
      {memberToDelete && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-md animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[3rem] shadow-2xl overflow-hidden p-8 text-center animate-in zoom-in-95">
            <div className="text-6xl mb-6">⚠️</div>
            <h3 className="text-2xl font-black mb-4 dark:text-white">تأكيد الحذف</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
              هل أنت متأكد من حذف <b>({memberToDelete.name})</b> وكافة ذريته؟ لا يمكن التراجع عن هذا الإجراء.
            </p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={confirmDeletion}
                className="w-full bg-red-600 text-white py-4 rounded-2xl font-black shadow-lg hover:bg-red-500 transition-all active:scale-95"
              >نعم، احذف العضو</button>
              <button 
                onClick={() => setMemberToDelete(null)}
                className="w-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 py-4 rounded-2xl font-black transition-all"
              >إلغاء</button>
            </div>
          </div>
        </div>
      )}

      {/* مودال التعديل الكامل */}
      {editingMember && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95" onClick={(e) => e.stopPropagation()}>
            <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <h3 className="text-xl font-black dark:text-white">تعديل كامل البيانات</h3>
              <button onClick={() => setEditingMember(null)} className="text-slate-300 hover:text-red-500 text-xl font-bold p-2 transition-colors">✕</button>
            </div>
            <form onSubmit={onEditSave} className="p-8 space-y-6 text-right">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 dark:text-slate-500 mr-2 uppercase tracking-widest">الاسم الكامل</label>
                <input type="text" value={editingMember.name} onChange={e => setEditingMember({...editingMember, name: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border-none outline-none font-bold dark:text-white ring-1 ring-slate-100 dark:ring-slate-700 focus:ring-2 focus:ring-emerald-500 transition-all" autoFocus />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 dark:text-slate-500 mr-2 uppercase tracking-widest">الجنس</label>
                  <select value={editingMember.gender} onChange={e => setEditingMember({...editingMember, gender: e.target.value as any})} className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border-none outline-none font-bold dark:text-white ring-1 ring-slate-100 dark:ring-slate-700">
                    <option value="male">ذكر</option>
                    <option value="female">أنثى</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 dark:text-slate-500 mr-2 uppercase tracking-widest">الحالة</label>
                  <select value={editingMember.isDeceased ? 'true' : 'false'} onChange={e => setEditingMember({...editingMember, isDeceased: e.target.value === 'true'})} className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border-none outline-none font-bold dark:text-white ring-1 ring-slate-100 dark:ring-slate-700">
                    <option value="false">حي يرزق</option>
                    <option value="true">متوفى</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 dark:text-slate-500 mr-2 uppercase tracking-widest">اسم الشريك (الزوج/الزوجة)</label>
                <input type="text" value={editingMember.spouse || ''} onChange={e => setEditingMember({...editingMember, spouse: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border-none outline-none font-bold dark:text-white ring-1 ring-slate-100 dark:ring-slate-700 focus:ring-2 focus:ring-emerald-500 transition-all" placeholder="اسم الشريك..." />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="submit" className="flex-grow bg-emerald-600 text-white py-4 rounded-2xl font-black shadow-xl hover:bg-emerald-500 transition-all active:scale-95">حفظ التغييرات</button>
                <button type="button" onClick={() => setEditingMember(null)} className="px-8 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 py-4 rounded-2xl font-black transition-all hover:bg-slate-200 dark:hover:bg-slate-700">إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
