
import { FamilyMember } from '../../types';

/**
 * دالة عودية لتحديث عضو معين داخل الشجرة
 */
export const updateMemberInTree = (
  node: FamilyMember,
  targetId: string,
  updatedData: Partial<FamilyMember>
): FamilyMember => {
  if (node.id === targetId) {
    return { ...node, ...updatedData };
  }

  if (node.children && node.children.length > 0) {
    return {
      ...node,
      children: node.children.map((child) =>
        updateMemberInTree(child, targetId, updatedData)
      ),
    };
  }

  return node;
};

/**
 * دالة لإضافة ابن لعضو معين
 */
export const addChildToTree = (
  node: FamilyMember,
  parentId: string,
  newChild: FamilyMember
): FamilyMember => {
  if (node.id === parentId) {
    return {
      ...node,
      children: [...(node.children || []), newChild],
    };
  }

  if (node.children && node.children.length > 0) {
    return {
      ...node,
      children: node.children.map((child) =>
        addChildToTree(child, parentId, newChild)
      ),
    };
  }

  return node;
};

/**
 * دالة لحذف عضو معين من الشجرة
 */
export const deleteMemberFromTree = (
  node: FamilyMember,
  targetId: string
): FamilyMember | null => {
  // لا يمكن حذف الجذر (الجد المؤسس) من هذه الدالة، يتم معالجة ذلك في الواجهة إذا لزم الأمر
  if (node.id === targetId) {
    return null;
  }

  if (node.children && node.children.length > 0) {
    const filteredChildren = node.children.filter(child => child.id !== targetId);
    
    // إذا تم حذف الطفل مباشرة من هذه القائمة
    if (filteredChildren.length !== node.children.length) {
      return {
        ...node,
        children: filteredChildren
      };
    }

    // إذا لم يجد في المستوى الأول، نبحث عودياً في أحفاد الأطفال
    return {
      ...node,
      children: node.children.map(child => deleteMemberFromTree(child, targetId)).filter((c): c is FamilyMember => c !== null)
    };
  }

  return node;
};

/**
 * دالة للبحث عن عضو معين ومسار آبائه (لأغراض التنقل)
 */
export const findMemberAndPath = (
  node: FamilyMember,
  targetId: string,
  path: FamilyMember[] = []
): { member: FamilyMember; path: FamilyMember[] } | null => {
  const currentPath = [...path, node];

  if (node.id === targetId) {
    return { member: node, path: currentPath };
  }

  if (node.children && node.children.length > 0) {
    for (const child of node.children) {
      const result = findMemberAndPath(child, targetId, currentPath);
      if (result) return result;
    }
  }

  return null;
};

/**
 * دالة للبحث عن الأعضاء بالاسم (بحث شامل في الشجرة)
 */
export const searchMembersByName = (
  node: FamilyMember,
  query: string
): FamilyMember[] => {
  let results: FamilyMember[] = [];
  
  if (node.name.toLowerCase().includes(query.toLowerCase())) {
    results.push(node);
  }

  if (node.children && node.children.length > 0) {
    node.children.forEach(child => {
      results = [...results, ...searchMembersByName(child, query)];
    });
  }

  return results;
};
