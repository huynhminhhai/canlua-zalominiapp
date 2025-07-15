import { create } from 'zustand';
import { AppSliceType, createAppSlice } from './appSlice';
import { AuthSliceType, createAuthSlice } from './authSlice';
import { ResidentSliceType ,createResidentSlice } from './residentCategoriesSlice';
import { createPhienCanSlice, PhienCanSliceType } from './phienCanSlice';

type StoreState = AppSliceType & AuthSliceType & ResidentSliceType & PhienCanSliceType;

export const useStoreApp = create<StoreState>()((set, get) => ({
  ...createAppSlice(set),
  ...createAuthSlice(set, get),
  ...createResidentSlice(set),
  ...createPhienCanSlice(set, get),
}));