import { Category, Note, Tag, NoteRelation, KnowledgeExport } from "@/types/knowledge";
import { Profile } from "@/types";
import { profileData } from "@/data/profile";

const DB_NAME = "self-web-db";
const DB_VERSION = 3; // 版本号增加以支持新的技能数据结构
const STORE_NAMES = {
  CATEGORIES: "categories",
  NOTES: "notes",
  TAGS: "tags",
  RELATIONS: "relations",
  PROFILE: "profile", // 新增:个人信息存储
};

// 检查 IndexedDB 支持性
export function isIndexedDBSupported(): boolean {
  return typeof window !== "undefined" && "indexedDB" in window;
}

// 检查存储空间
export async function checkStorageQuota(): Promise<{
  quota: number;
  usage: number;
  usagePercentage: number;
}> {
  if ("storage" in navigator && "estimate" in navigator.storage) {
    try {
      const estimate = await navigator.storage.estimate();
      return {
        quota: estimate.quota || 0,
        usage: estimate.usage || 0,
        usagePercentage: estimate.quota ? (estimate.usage / estimate.quota) * 100 : 0,
      };
    } catch (error) {
      console.warn("无法获取存储配额:", error);
    }
  }
  return { quota: 0, usage: 0, usagePercentage: 0 };
}

class KnowledgeDB {
  private db: IDBDatabase | null = null;
  
  // 内存缓存，提升查询性能
  private profileCache: Profile | null = null;
  private isInitialized = false;

  async init(): Promise<void> {
    if (this.isInitialized && this.db) {
      return;
    }

    if (!isIndexedDBSupported()) {
      throw new Error("您的浏览器不支持 IndexedDB，请使用现代浏览器。");
    }

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        reject(new Error("无法打开数据库，请刷新页面重试。"));
      };
      
      request.onsuccess = () => {
        this.db = request.result;
        this.isInitialized = true;
        
        // 处理数据库版本过期错误
        this.db.onversionchange = () => {
          this.db?.close();
          this.isInitialized = false;
        };
        
        resolve();
      };
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        const oldVersion = event.oldVersion || 0;
        
        if (oldVersion < 1) {
          if (!db.objectStoreNames.contains(STORE_NAMES.CATEGORIES)) {
            const categoryStore = db.createObjectStore(STORE_NAMES.CATEGORIES, { keyPath: "id" });
            categoryStore.createIndex("name", "name", { unique: true });
          }

          if (!db.objectStoreNames.contains(STORE_NAMES.NOTES)) {
            const noteStore = db.createObjectStore(STORE_NAMES.NOTES, { keyPath: "id" });
            noteStore.createIndex("categoryId", "categoryId", { unique: false });
            noteStore.createIndex("createdAt", "createdAt", { unique: false });
          }

          if (!db.objectStoreNames.contains(STORE_NAMES.TAGS)) {
            const tagStore = db.createObjectStore(STORE_NAMES.TAGS, { keyPath: "id" });
            tagStore.createIndex("name", "name", { unique: true });
          }

          if (!db.objectStoreNames.contains(STORE_NAMES.RELATIONS)) {
            const relationStore = db.createObjectStore(STORE_NAMES.RELATIONS, { keyPath: "id" });
            relationStore.createIndex("sourceNoteId", "sourceNoteId", { unique: false });
            relationStore.createIndex("targetNoteId", "targetNoteId", { unique: false });
          }
        }
        
        // 新增:profile store
        if (!db.objectStoreNames.contains(STORE_NAMES.PROFILE)) {
          db.createObjectStore(STORE_NAMES.PROFILE, { keyPath: "id" });
        }
        
        // 升级到版本3：确保profile数据有新的字段
        if (oldVersion < 3) {
          const profileStore = event.newTransaction?.objectStore(STORE_NAMES.PROFILE);
          if (profileStore) {
            const getRequest = profileStore.get("main");
            getRequest.onsuccess = () => {
              const existingProfile = getRequest.result;
              if (existingProfile) {
                // 合并旧数据和新的默认数据，确保skillCategories等新字段存在
                const updatedProfile = { ...profileData, ...existingProfile };
                profileStore.put(updatedProfile);
              }
            };
          }
        }
      };
    });
  }

  private ensureDB(): IDBDatabase {
    if (!this.db) {
      throw new Error("数据库未初始化，请刷新页面重试。");
    }
    return this.db;
  }

  private async transaction<T>(
    storeName: string,
    mode: IDBTransactionMode,
    callback: (store: IDBObjectStore) => Promise<T>
  ): Promise<T> {
    try {
      const db = this.ensureDB();
      const transaction = db.transaction([storeName], mode);
      const store = transaction.objectStore(storeName);
      return await callback(store);
    } catch (error) {
      if (error instanceof DOMException && error.name === "QuotaExceededError") {
        throw new Error("存储空间不足，请清理本地数据或导出备份。");
      }
      throw error;
    }
  }

  // ========== Profile 管理 ==========
  async getProfile(): Promise<Profile> {
    // 先从缓存获取
    if (this.profileCache) {
      return this.profileCache;
    }

    try {
      return await this.transaction(STORE_NAMES.PROFILE, "readonly", async (store) => {
        return new Promise((resolve) => {
          const request = store.get("main");
          request.onsuccess = () => {
            let profile: Profile;
            if (request.result) {
              // 合并旧数据和新的默认数据，确保所有必需字段都存在
              profile = { ...profileData, ...request.result };
            } else {
              // 如果没有数据，使用默认数据
              profile = { ...profileData };
              // 保存默认数据
              this.saveProfile(profile).catch(console.error);
            }
            this.profileCache = profile;
            resolve(profile);
          };
          request.onerror = () => {
            // 出错时也返回默认数据
            const profile = { ...profileData };
            this.profileCache = profile;
            resolve(profile);
          };
        });
      });
    } catch (error) {
      console.warn("获取个人信息失败，使用默认数据:", error);
      const profile = { ...profileData };
      this.profileCache = profile;
      return profile;
    }
  }

  async saveProfile(profile: Profile): Promise<void> {
    // 检查存储空间
    const { usagePercentage } = await checkStorageQuota();
    if (usagePercentage > 90) {
      throw new Error("存储空间即将不足，请先清理部分数据。");
    }

    this.profileCache = profile; // 更新缓存

    return this.transaction(STORE_NAMES.PROFILE, "readwrite", async (store) => {
      return new Promise((resolve, reject) => {
        const request = store.put({ ...profile, id: "main" });
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error || new Error("保存个人信息失败"));
      });
    });
  }

  async resetToDefaultProfile(): Promise<void> {
    const defaultProfile = { ...profileData };
    await this.saveProfile(defaultProfile);
  }

  // ========== Category 管理 ==========
  async addCategory(category: Category): Promise<void> {
    await this.transaction(STORE_NAMES.CATEGORIES, "readwrite", async (store) => {
      return new Promise((resolve, reject) => {
        const request = store.add(category);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error || new Error("添加分类失败"));
      });
    });
  }

  async getCategories(): Promise<Category[]> {
    return this.transaction(STORE_NAMES.CATEGORIES, "readonly", async (store) => {
      return new Promise((resolve, reject) => {
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error || new Error("获取分类失败"));
      });
    });
  }

  async updateCategory(category: Category): Promise<void> {
    await this.transaction(STORE_NAMES.CATEGORIES, "readwrite", async (store) => {
      return new Promise((resolve, reject) => {
        const request = store.put(category);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error || new Error("更新分类失败"));
      });
    });
  }

  async deleteCategory(id: string): Promise<void> {
    await this.transaction(STORE_NAMES.CATEGORIES, "readwrite", async (store) => {
      return new Promise((resolve, reject) => {
        const request = store.delete(id);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error || new Error("删除分类失败"));
      });
    });
  }

  // ========== Note 管理 ==========
  async addNote(note: Note): Promise<void> {
    await this.transaction(STORE_NAMES.NOTES, "readwrite", async (store) => {
      return new Promise((resolve, reject) => {
        const request = store.add(note);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error || new Error("添加笔记失败"));
      });
    });
  }

  async getNotes(): Promise<Note[]> {
    return this.transaction(STORE_NAMES.NOTES, "readonly", async (store) => {
      return new Promise((resolve, reject) => {
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result.sort((a, b) => b.createdAt - a.createdAt));
        request.onerror = () => reject(request.error || new Error("获取笔记失败"));
      });
    });
  }

  async getNotesByCategory(categoryId: string): Promise<Note[]> {
    return this.transaction(STORE_NAMES.NOTES, "readonly", async (store) => {
      return new Promise((resolve, reject) => {
        const index = store.index("categoryId");
        const request = index.getAll(categoryId);
        request.onsuccess = () => resolve(request.result.sort((a, b) => b.createdAt - a.createdAt));
        request.onerror = () => reject(request.error || new Error("获取笔记失败"));
      });
    });
  }

  async updateNote(note: Note): Promise<void> {
    await this.transaction(STORE_NAMES.NOTES, "readwrite", async (store) => {
      return new Promise((resolve, reject) => {
        const request = store.put(note);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error || new Error("更新笔记失败"));
      });
    });
  }

  async deleteNote(id: string): Promise<void> {
    await this.transaction(STORE_NAMES.NOTES, "readwrite", async (store) => {
      return new Promise((resolve, reject) => {
        const request = store.delete(id);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error || new Error("删除笔记失败"));
      });
    });
  }

  // ========== Tag 管理 ==========
  async addTag(tag: Tag): Promise<void> {
    await this.transaction(STORE_NAMES.TAGS, "readwrite", async (store) => {
      return new Promise((resolve, reject) => {
        const request = store.add(tag);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error || new Error("添加标签失败"));
      });
    });
  }

  async getTags(): Promise<Tag[]> {
    return this.transaction(STORE_NAMES.TAGS, "readonly", async (store) => {
      return new Promise((resolve, reject) => {
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error || new Error("获取标签失败"));
      });
    });
  }

  async deleteTag(id: string): Promise<void> {
    await this.transaction(STORE_NAMES.TAGS, "readwrite", async (store) => {
      return new Promise((resolve, reject) => {
        const request = store.delete(id);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error || new Error("删除标签失败"));
      });
    });
  }

  // ========== Relation 管理 ==========
  async addRelation(relation: NoteRelation): Promise<void> {
    await this.transaction(STORE_NAMES.RELATIONS, "readwrite", async (store) => {
      return new Promise((resolve, reject) => {
        const request = store.add(relation);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error || new Error("添加关系失败"));
      });
    });
  }

  async getRelations(): Promise<NoteRelation[]> {
    return this.transaction(STORE_NAMES.RELATIONS, "readonly", async (store) => {
      return new Promise((resolve, reject) => {
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error || new Error("获取关系失败"));
      });
    });
  }

  async deleteRelation(id: string): Promise<void> {
    await this.transaction(STORE_NAMES.RELATIONS, "readwrite", async (store) => {
      return new Promise((resolve, reject) => {
        const request = store.delete(id);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error || new Error("删除关系失败"));
      });
    });
  }

  // ========== 导入导出 ==========
  async exportData(): Promise<KnowledgeExport> {
    try {
      const [categories, notes, tags, relations, profile] = await Promise.all([
        this.getCategories(),
        this.getNotes(),
        this.getTags(),
        this.getRelations(),
        this.getProfile(),
      ]);

      return {
        categories,
        notes,
        tags,
        relations,
        profile, // 新增:包含 profile 数据
        exportTime: Date.now(),
        version: "2.0.0",
      };
    } catch (error) {
      throw new Error("导出数据失败，请重试。");
    }
  }

  async importData(data: KnowledgeExport): Promise<void> {
    // 验证导入数据格式
    if (!data || typeof data !== "object") {
      throw new Error("导入失败，文件格式不正确。");
    }

    // 检查存储空间
    const { usagePercentage } = await checkStorageQuota();
    if (usagePercentage > 80) {
      throw new Error("存储空间不足，无法导入数据，请先清理部分数据。");
    }

    const stores = [
      STORE_NAMES.CATEGORIES,
      STORE_NAMES.NOTES,
      STORE_NAMES.TAGS,
      STORE_NAMES.RELATIONS,
    ];
    
    // 如果导入数据包含 profile，也加入事务
    if (data.profile) {
      stores.push(STORE_NAMES.PROFILE);
    }

    const db = this.ensureDB();
    const transaction = db.transaction(stores, "readwrite");

    const categoryStore = transaction.objectStore(STORE_NAMES.CATEGORIES);
    const noteStore = transaction.objectStore(STORE_NAMES.NOTES);
    const tagStore = transaction.objectStore(STORE_NAMES.TAGS);
    const relationStore = transaction.objectStore(STORE_NAMES.RELATIONS);

    // 清空现有数据
    categoryStore.clear();
    noteStore.clear();
    tagStore.clear();
    relationStore.clear();

    // 导入新数据
    (data.categories || []).forEach(cat => categoryStore.put(cat));
    (data.notes || []).forEach(note => noteStore.put(note));
    (data.tags || []).forEach(tag => tagStore.put(tag));
    (data.relations || []).forEach(rel => relationStore.put(rel));
    
    // 导入 profile 数据
    if (data.profile) {
      const profileStore = transaction.objectStore(STORE_NAMES.PROFILE);
      profileStore.clear();
      profileStore.put({ ...data.profile, id: "main" });
      this.profileCache = data.profile; // 更新缓存
    }

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error || new Error("导入数据失败"));
    });
  }
}

export const db = new KnowledgeDB();
