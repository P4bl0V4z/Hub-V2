import { api } from './_base';
import type { BasicUser } from './roles';
export const UsersAPI = { listBasic: (q?: string) => api.get<BasicUser[]>('/users', { params: q ? { q } : undefined }) };
